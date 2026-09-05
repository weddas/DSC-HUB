"""ESPHome OTA / compile job queue — operator-initiated only."""

from __future__ import annotations

import json
import shutil
import subprocess
import threading
import time
import uuid
from pathlib import Path
from typing import Any

from .esphome_toolchain import build_backend, dashboard_api, esphome_bin, project_dir, run_env
from .paths import DEFAULT_DB, EXPECTED_FIRMWARE
from .settings import connect, list_inventory

JOB_SCHEMA = """
CREATE TABLE IF NOT EXISTS esphome_jobs (
  job_id TEXT PRIMARY KEY,
  seat_id TEXT NOT NULL,
  action TEXT NOT NULL,
  yaml_name TEXT NOT NULL,
  status TEXT NOT NULL,
  detail TEXT NOT NULL DEFAULT '',
  created_at REAL NOT NULL,
  updated_at REAL NOT NULL
);
"""

SEAT_YAML: dict[str, str] = {
    "hub": "dsc-hub.yaml",
    "control": "dsc-control.yaml",
    "pot1": "DSC-Probe1.yaml",
    "pot2": "DSC-Probe2.yaml",
    "pot3": "DSC-Probe3.yaml",
    "pot4": "DSC-Probe4.yaml",
    "heater": "dsc-heater.yaml",
    "heatmat": "dsc-heatmat.yaml",
    "humidifier": "dsc-humidifier.yaml",
    "dehumidifier": "dsc-de-humidifier.yaml",
}

# v8: the ESPHome CLI now runs from the Pi venv (esphome_toolchain.esphome_bin),
# not `docker exec dsc-hub-esphome …`. One venv serves the dashboard + this queue.

_worker_thread: threading.Thread | None = None
_worker_running = False
_worker_wake = threading.Event()


def _ensure_jobs(conn) -> None:
    conn.executescript(JOB_SCHEMA)


def _inventory_host(seat_id: str) -> str | None:
    for row in list_inventory():
        if row.get("seat_id") == seat_id:
            host = row.get("host")
            return str(host) if host else None
    return None


def _update_job(
    job_id: str,
    status: str,
    detail: str,
    db_path: Path | None = None,
) -> None:
    conn = connect(db_path)
    _ensure_jobs(conn)
    conn.execute(
        "UPDATE esphome_jobs SET status=?, detail=?, updated_at=? WHERE job_id=?",
        (status, detail, time.time(), job_id),
    )
    conn.commit()
    conn.close()


def _local_esphome_available() -> bool:
    eb = esphome_bin()
    return bool(eb and (Path(eb).exists() or shutil.which(eb)))


def _run_job_via_dashboard(job: dict[str, Any], db_path: Path | None = None) -> None:
    """No local CLI, but the ESPHome dashboard is reachable — it IS the build
    service. Drive its WebSocket command endpoint (/compile, /upload):
    connect, send {"type":"spawn","configuration":<yaml>}, stream {"event":"line"}
    messages, finish on {"event":"exit","code":N}.
    """
    job_id = str(job["job_id"])
    action = str(job["action"])
    yaml_name = str(job["yaml_name"])
    endpoint = "compile" if action == "compile" else "upload"
    base = dashboard_api().rstrip("/")
    ws_url = ("wss://" if base.startswith("https://") else "ws://") + base.split("://", 1)[-1] + "/" + endpoint

    try:
        from websockets.sync.client import connect as ws_connect
    except ImportError:
        _update_job(
            job_id,
            "failed",
            "no local esphome CLI and `websockets` unavailable — set esphome_bin to a "
            "venv CLI, or flash via pi/flash-*-remote.sh.",
            db_path,
        )
        return

    _update_job(job_id, "running", f"ws {ws_url}  spawn configuration={yaml_name}\n", db_path)
    lines: list[str] = []
    code: int | None = None
    last = 0.0
    try:
        with ws_connect(ws_url, open_timeout=10, close_timeout=5) as ws:
            spawn: dict[str, Any] = {"type": "spawn", "configuration": yaml_name}
            if endpoint == "upload":
                spawn["port"] = "OTA"
            ws.send(json.dumps(spawn))
            deadline = time.time() + 1800
            while time.time() < deadline:
                try:
                    raw = ws.recv(timeout=60)
                except TimeoutError:
                    continue
                try:
                    msg = json.loads(raw)
                except (TypeError, ValueError):
                    continue
                ev = msg.get("event")
                if ev == "line":
                    lines.append(str(msg.get("data", "")))
                    if time.time() - last >= 2.0:
                        _update_job(job_id, "running", "".join(lines)[-2500:], db_path)
                        last = time.time()
                elif ev == "exit":
                    code = int(msg.get("code", 1))
                    break
        tail = "".join(lines)[-3600:]
        if code == 0:
            _update_job(job_id, "done", tail or f"{action} via dashboard OK (exit 0)", db_path)
        else:
            _update_job(
                job_id,
                "failed",
                (tail or f"{action} via dashboard") + f"\n\nesphome exited {code}."
                + ("\n(dashboard ESPHome is below the pinned min_version — bump the "
                   "dsc-hub-esphome image / venv.)" if code and "too old" in tail.lower() else ""),
                db_path,
            )
    except Exception as exc:  # noqa: BLE001
        _update_job(
            job_id,
            "failed",
            "".join(lines)[-2000:] + f"\n\ndashboard ws {endpoint} failed: {exc}\n"
            "Fallbacks: set esphome_bin to a venv CLI, or use pi/flash-*-remote.sh.",
            db_path,
        )


def _run_job(job: dict[str, Any], db_path: Path | None = None) -> None:
    job_id = str(job["job_id"])
    seat_id = str(job["seat_id"])
    action = str(job["action"])
    yaml_name = str(job["yaml_name"])
    host = _inventory_host(seat_id)
    _update_job(job_id, "running", f"Running {action} for {seat_id}…", db_path)
    eb = esphome_bin()
    if not _local_esphome_available() and build_backend() == "dashboard":
        _run_job_via_dashboard(job, db_path)
        return
    if action == "compile":
        cmd = [eb, "compile", yaml_name]
    else:
        if not host:
            _update_job(job_id, "failed", f"No host configured for seat {seat_id}", db_path)
            return
        # --no-logs: OTA returns once the image is uploaded instead of attaching
        # to the device log stream and blocking the worker forever.
        cmd = [eb, "run", yaml_name, "--device", host, "--no-logs"]
    chunks: list[str] = []
    last_detail_at = 0.0
    try:
        proc = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1,
            cwd=str(project_dir()),
            env=run_env(),
        )
        if proc.stdout:
            for line in proc.stdout:
                chunks.append(line)
                now = time.time()
                if now - last_detail_at >= 2.0:
                    tail = "".join(chunks).strip()[-2000:]
                    _update_job(job_id, "running", tail or f"{action} in progress…", db_path)
                    last_detail_at = now
        proc.wait(timeout=1800)
        tail = "".join(chunks).strip()[-2000:]
        if proc.returncode == 0:
            _update_job(job_id, "done", tail or f"{action} completed", db_path)
        else:
            _update_job(job_id, "failed", tail or f"{action} exited {proc.returncode}", db_path)
    except subprocess.TimeoutExpired:
        proc.kill()
        _update_job(job_id, "failed", f"{action} timed out after 30 minutes", db_path)
    except FileNotFoundError:
        _update_job(
            job_id,
            "failed",
            f"esphome CLI not found at '{eb}' — check the Pi venv / esphome_bin setting. "
            f"Run manually: {eb} {action} {yaml_name}",
            db_path,
        )
    except Exception as exc:  # noqa: BLE001
        _update_job(job_id, "failed", str(exc), db_path)


def _worker_loop(db_path: Path | None = None) -> None:
    while _worker_running:
        conn = connect(db_path)
        _ensure_jobs(conn)
        row = conn.execute(
            """
            SELECT job_id, seat_id, action, yaml_name, status, detail, created_at, updated_at
            FROM esphome_jobs WHERE status='queued' ORDER BY created_at ASC LIMIT 1
            """
        ).fetchone()
        conn.close()
        if row:
            _run_job(dict(row), db_path)
            continue
        _worker_wake.wait(timeout=5.0)
        _worker_wake.clear()


def start_esphome_worker(db_path: Path | None = None) -> None:
    global _worker_thread, _worker_running
    if _worker_thread and _worker_thread.is_alive():
        return
    _worker_running = True
    _worker_thread = threading.Thread(
        target=_worker_loop,
        args=(db_path,),
        daemon=True,
        name="esphome-jobs",
    )
    _worker_thread.start()


def stop_esphome_worker() -> None:
    global _worker_running
    _worker_running = False
    _worker_wake.set()


def list_esphome_devices() -> list[dict[str, Any]]:
    """Fleet seats with expected yaml + firmware train."""
    devices: list[dict[str, Any]] = []
    for row in list_inventory():
        seat_id = str(row["seat_id"])
        devices.append(
            {
                "seat_id": seat_id,
                "role": row.get("role"),
                "host": row.get("host"),
                "in_service": row.get("in_service"),
                "yaml": SEAT_YAML.get(seat_id),
                "expected_firmware": EXPECTED_FIRMWARE,
            }
        )
    return devices


def queue_job(seat_id: str, action: str, db_path: Path | None = None) -> dict[str, Any]:
    if action not in {"ota", "compile"}:
        raise ValueError(f"unknown action {action}")
    yaml_name = SEAT_YAML.get(seat_id)
    if not yaml_name:
        raise KeyError(seat_id)
    conn = connect(db_path)
    _ensure_jobs(conn)
    running = conn.execute(
        "SELECT job_id FROM esphome_jobs WHERE status='running' LIMIT 1"
    ).fetchone()
    if running:
        conn.close()
        raise RuntimeError("flash already running — wait for current job")
    if action == "ota":
        dup = conn.execute(
            """
            SELECT job_id FROM esphome_jobs
            WHERE seat_id=? AND action='ota' AND status IN ('queued','running') LIMIT 1
            """,
            (seat_id,),
        ).fetchone()
        if dup:
            conn.close()
            raise RuntimeError(f"OTA already queued or running for {seat_id}")
    active = conn.execute(
        """
        SELECT job_id, seat_id, action FROM esphome_jobs
        WHERE status IN ('queued','running')
        """
    ).fetchall()
    if action == "compile" and active:
        conn.close()
        raise RuntimeError("compile already queued or running — one job at a time on Pi")
    if action == "ota":
        for row in active:
            if row["seat_id"] == seat_id and row["action"] == "ota":
                conn.close()
                raise RuntimeError("OTA already queued for this seat")
    now = time.time()
    job_id = str(uuid.uuid4())
    detail = f"Queued — worker will run: {esphome_bin()} {action} {yaml_name}"
    conn.execute(
        """
        INSERT INTO esphome_jobs(job_id, seat_id, action, yaml_name, status, detail, created_at, updated_at)
        VALUES(?, ?, ?, ?, 'queued', ?, ?, ?)
        """,
        (job_id, seat_id, action, yaml_name, detail, now, now),
    )
    conn.commit()
    conn.close()
    _worker_wake.set()
    return get_job(job_id, db_path)


def list_jobs(limit: int = 20, db_path: Path | None = None) -> list[dict[str, Any]]:
    conn = connect(db_path)
    _ensure_jobs(conn)
    rows = conn.execute(
        """
        SELECT job_id, seat_id, action, yaml_name, status, detail, created_at, updated_at
        FROM esphome_jobs ORDER BY created_at DESC LIMIT ?
        """,
        (limit,),
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def get_job(job_id: str, db_path: Path | None = None) -> dict[str, Any]:
    conn = connect(db_path)
    _ensure_jobs(conn)
    row = conn.execute(
        """
        SELECT job_id, seat_id, action, yaml_name, status, detail, created_at, updated_at
        FROM esphome_jobs WHERE job_id=?
        """,
        (job_id,),
    ).fetchone()
    conn.close()
    if not row:
        raise KeyError(job_id)
    return dict(row)
