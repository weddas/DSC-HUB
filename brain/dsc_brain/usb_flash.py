"""USB kit flash jobs — baked binaries + host esptool (not docker ESPHome OTA)."""

from __future__ import annotations

import json
import subprocess
import threading
import time
import uuid
from pathlib import Path
from typing import Any

from .paths import REPO_ROOT
from .settings import connect

try:
    from serial.tools import list_ports as _serial_list_ports
except ImportError:  # optional on Windows CI without pyserial
    _serial_list_ports = None

JOB_SCHEMA = """
CREATE TABLE IF NOT EXISTS usb_flash_jobs (
  job_id TEXT PRIMARY KEY,
  role TEXT NOT NULL,
  port TEXT NOT NULL,
  status TEXT NOT NULL,
  detail TEXT NOT NULL DEFAULT '',
  created_at REAL NOT NULL,
  updated_at REAL NOT NULL
);
"""

# Kit default order (pot3/4 not kit defaults).
KIT_ROLES: tuple[str, ...] = (
    "hub",
    "control",
    "pot1",
    "pot2",
    "bridge",
    "heater",
    "heatmat",
    "humidifier",
    "dehumidifier",
)

_DEFAULT_MANIFEST: dict[str, dict[str, Any]] = {
    "hub": {
        "binary": "hub.bin",
        "chip": "esp32",
        "offset": "0x0",
        "boot_mode_note": "Hold BOOT if auto-reset fails.",
    },
    "control": {
        "binary": "control.bin",
        "chip": "esp32",
        "offset": "0x0",
        "boot_mode_note": "Hold BOOT if auto-reset fails.",
    },
    "pot1": {
        "binary": "pot1.bin",
        "chip": "esp32",
        "offset": "0x0",
        "boot_mode_note": "Hold BOOT if auto-reset fails.",
    },
    "pot2": {
        "binary": "pot2.bin",
        "chip": "esp32",
        "offset": "0x0",
        "boot_mode_note": "Hold BOOT if auto-reset fails.",
    },
    "bridge": {
        "binary": "bridge.bin",
        "chip": "esp32",
        "offset": "0x0",
        "boot_mode_note": "WT32-ETH01 — use flash_mode dio tooling; hold BOOT as needed.",
    },
    "heater": {
        "binary": "heater.bin",
        "chip": "esp8266",
        "offset": "0x0",
        "boot_mode_note": "Sonoff: open case, hold button for serial bootloader before flash.",
    },
    "heatmat": {
        "binary": "heatmat.bin",
        "chip": "esp8266",
        "offset": "0x0",
        "boot_mode_note": "Sonoff: open case, hold button for serial bootloader before flash.",
    },
    "humidifier": {
        "binary": "humidifier.bin",
        "chip": "esp8266",
        "offset": "0x0",
        "boot_mode_note": "Sonoff: open case, hold button for serial bootloader before flash.",
    },
    "dehumidifier": {
        "binary": "dehumidifier.bin",
        "chip": "esp8266",
        "offset": "0x0",
        "boot_mode_note": "Sonoff: open case, hold button for serial bootloader before flash.",
    },
}

_worker_lock = threading.Lock()
_worker_thread: threading.Thread | None = None


def firmware_dir() -> Path:
    env = Path("/opt/dsc-hub/firmware/kit")
    if env.is_dir():
        return env
    local = REPO_ROOT / "services" / "dsc-hub" / "firmware" / "kit"
    local.mkdir(parents=True, exist_ok=True)
    return local


def load_manifest() -> dict[str, Any]:
    path = firmware_dir().parent / "kit-manifest.json"
    alt = REPO_ROOT / "services" / "dsc-hub" / "firmware" / "kit-manifest.json"
    for candidate in (path, alt):
        if candidate.is_file():
            data = json.loads(candidate.read_text(encoding="utf-8"))
            roles = data.get("roles") if isinstance(data, dict) else None
            if isinstance(roles, dict):
                return roles
    return dict(_DEFAULT_MANIFEST)


def list_serial_ports() -> list[dict[str, Any]]:
    """Enumerate serial ports; prefer /dev/serial/by-id when present."""
    ports: list[dict[str, Any]] = []
    by_id = Path("/dev/serial/by-id")
    if by_id.is_dir():
        for link in sorted(by_id.iterdir()):
            try:
                target = link.resolve()
            except OSError:
                continue
            ports.append(
                {
                    "device": str(target),
                    "by_id": str(link),
                    "vid_pid": "",
                    "chip_hint": "",
                }
            )
        if ports:
            return ports
    try:
        if _serial_list_ports is None:
            return ports
        for info in _serial_list_ports.comports():
            ports.append(
                {
                    "device": info.device,
                    "by_id": info.device,
                    "vid_pid": f"{info.vid or ''}:{info.pid or ''}",
                    "chip_hint": info.description or "",
                }
            )
    except Exception:  # noqa: BLE001
        pass
    return ports


def _ensure(conn) -> None:
    conn.executescript(JOB_SCHEMA)


def _update(job_id: str, status: str, detail: str, db_path: Path | None = None) -> None:
    conn = connect(db_path)
    _ensure(conn)
    conn.execute(
        "UPDATE usb_flash_jobs SET status=?, detail=?, updated_at=? WHERE job_id=?",
        (status, detail[:4000], time.time(), job_id),
    )
    conn.commit()
    conn.close()


def _running_job(db_path: Path | None = None) -> str | None:
    conn = connect(db_path)
    _ensure(conn)
    row = conn.execute(
        "SELECT job_id FROM usb_flash_jobs WHERE status IN ('queued','running') LIMIT 1"
    ).fetchone()
    conn.close()
    return str(row["job_id"]) if row else None


def _esptool_cmd(role: str, port: str, manifest: dict[str, Any]) -> list[str]:
    meta = manifest[role]
    binary = firmware_dir() / str(meta["binary"])
    chip = str(meta.get("chip") or "esp32")
    offset = str(meta.get("offset") or "0x0")
    return [
        "esptool.py",
        "--chip",
        chip,
        "--port",
        port,
        "write_flash",
        offset,
        str(binary),
    ]


def _run_job(job_id: str, role: str, port: str, db_path: Path | None = None) -> None:
    manifest = load_manifest()
    meta = manifest.get(role) or {}
    binary = firmware_dir() / str(meta.get("binary") or "")
    _update(job_id, "running", f"Flashing {role} on {port}…", db_path)
    if not binary.is_file():
        _update(
            job_id,
            "failed",
            f"Missing firmware binary for {role}: {binary}. Bake kit binaries into the image.",
            db_path,
        )
        return
    cmd = _esptool_cmd(role, port, manifest)
    try:
        proc = subprocess.run(cmd, capture_output=True, text=True, timeout=600, check=False)
        tail = ((proc.stdout or "") + "\n" + (proc.stderr or "")).strip()[-2000:]
        if proc.returncode == 0:
            _update(job_id, "done", tail or f"{role} flash completed", db_path)
        else:
            note = str(meta.get("boot_mode_note") or "")
            detail = tail or f"esptool exit {proc.returncode}"
            if note:
                detail = f"{detail}\n{note}"
            _update(job_id, "failed", detail, db_path)
    except FileNotFoundError:
        _update(job_id, "failed", "esptool.py not found on PATH — install esptool on the Pi host", db_path)
    except Exception as exc:  # noqa: BLE001
        _update(job_id, "failed", str(exc)[:2000], db_path)


def _worker_loop(db_path: Path | None = None) -> None:
    while True:
        conn = connect(db_path)
        _ensure(conn)
        row = conn.execute(
            "SELECT job_id, role, port FROM usb_flash_jobs WHERE status='queued' ORDER BY created_at ASC LIMIT 1"
        ).fetchone()
        conn.close()
        if not row:
            break
        _run_job(str(row["job_id"]), str(row["role"]), str(row["port"]), db_path)


def _ensure_worker(db_path: Path | None = None) -> None:
    global _worker_thread
    with _worker_lock:
        if _worker_thread and _worker_thread.is_alive():
            return
        _worker_thread = threading.Thread(target=_worker_loop, args=(db_path,), daemon=True)
        _worker_thread.start()


def queue_usb_flash(role: str, port: str, db_path: Path | None = None) -> dict[str, Any]:
    role = (role or "").strip()
    port = (port or "").strip()
    if role not in KIT_ROLES:
        raise ValueError(f"unknown role {role!r}; expected one of {KIT_ROLES}")
    if not port:
        raise ValueError("port is required")
    manifest = load_manifest()
    if role not in manifest:
        raise ValueError(f"role {role!r} missing from kit manifest")
    running = _running_job(db_path)
    if running:
        raise RuntimeError(f"usb flash job already in progress: {running}")
    job_id = str(uuid.uuid4())
    now = time.time()
    conn = connect(db_path)
    _ensure(conn)
    conn.execute(
        """
        INSERT INTO usb_flash_jobs(job_id, role, port, status, detail, created_at, updated_at)
        VALUES(?,?,?,?,?,?,?)
        """,
        (job_id, role, port, "queued", "queued", now, now),
    )
    conn.commit()
    conn.close()
    _ensure_worker(db_path)
    return get_usb_flash_job(job_id, db_path) or {"job_id": job_id, "status": "queued"}


def get_usb_flash_job(job_id: str, db_path: Path | None = None) -> dict[str, Any] | None:
    conn = connect(db_path)
    _ensure(conn)
    row = conn.execute(
        "SELECT job_id, role, port, status, detail, created_at, updated_at FROM usb_flash_jobs WHERE job_id=?",
        (job_id,),
    ).fetchone()
    conn.close()
    if not row:
        return None
    return dict(row)


def list_usb_flash_jobs(limit: int = 20, db_path: Path | None = None) -> list[dict[str, Any]]:
    conn = connect(db_path)
    _ensure(conn)
    rows = conn.execute(
        """
        SELECT job_id, role, port, status, detail, created_at, updated_at
        FROM usb_flash_jobs ORDER BY created_at DESC LIMIT ?
        """,
        (max(1, min(int(limit), 100)),),
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def manifest_public() -> dict[str, Any]:
    roles = load_manifest()
    return {
        "kit_roles": list(KIT_ROLES),
        "roles": {
            k: {
                "binary": v.get("binary"),
                "chip": v.get("chip"),
                "boot_mode_note": v.get("boot_mode_note", ""),
            }
            for k, v in roles.items()
            if k in KIT_ROLES
        },
        "firmware_dir": str(firmware_dir()),
    }
