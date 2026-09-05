"""ESPHome build-toolchain status + self-update (Pi venv, no Home Assistant).

The Pi runs one dedicated ESPHome venv that serves both `esphome dashboard`
(port 6052) and the OTA/compile job runner in ``esphome_jobs``. This module
reports what that venv has installed, what PyPI offers, and the ``min_version``
the firmware pins — and can bump the venv to latest on operator request.

Everything here is ESPHome-native: the running per-device version comes from the
ESPHome native API ingest (``esphome_client``), "latest" comes from PyPI, and the
update is ``pip install -U esphome`` in the venv. No HA entities involved.
"""

from __future__ import annotations

import json
import os
import re
import shutil
import subprocess
import threading
import time
import urllib.request
import uuid
from pathlib import Path
from typing import Any

from .fleet_state import get_fleet_state
from .network_apply import eth_carrier_up
from .paths import REPO_ROOT
from .settings import connect, get_setting, list_inventory, set_setting

# Last QA-validated ESPHome; kept in lock-step with the firmware `min_version:`
# pin in firmware/v4/dsc-*-common.yaml + dsc-hub-v4_0.yaml.
PINNED_MIN_VERSION = "2026.6.5"

_PYPI_URL = "https://pypi.org/pypi/esphome/json"
_PYPI_CACHE_TTL = 6 * 3600.0
_PYPI_FAIL_TTL = 15 * 60.0  # after a failed lookup, don't re-hit PyPI for 15 min
_PYPI_TIMEOUT = 4.0

_VERSION_RE = re.compile(r"(\d+\.\d+\.\d+)")

_latest_cache: dict[str, Any] = {"version": None, "checked_at": 0.0, "ok": False}
_latest_lock = threading.Lock()

TOOLCHAIN_JOB_SCHEMA = """
CREATE TABLE IF NOT EXISTS esphome_toolchain_jobs (
  job_id TEXT PRIMARY KEY,
  kind TEXT NOT NULL,
  status TEXT NOT NULL,
  detail TEXT NOT NULL DEFAULT '',
  from_version TEXT NOT NULL DEFAULT '',
  to_version TEXT NOT NULL DEFAULT '',
  created_at REAL NOT NULL,
  updated_at REAL NOT NULL
);
"""

_update_lock = threading.Lock()
_update_running = False


# --------------------------------------------------------------------------- #
# Paths / binaries
# --------------------------------------------------------------------------- #
def esphome_bin() -> str:
    """Resolve the venv `esphome` binary (setting → env → conventional → PATH)."""
    for cand in (
        get_setting("esphome_bin", ""),
        os.environ.get("DSC_ESPHOME_BIN", ""),
        "/opt/dsc-esphome-venv/bin/esphome",
    ):
        cand = (cand or "").strip()
        if cand and Path(cand).exists():
            return cand
    return shutil.which("esphome") or "esphome"


def _pip_for_esphome() -> list[str]:
    """The pip that installs into the same venv as `esphome_bin()`."""
    eb = esphome_bin()
    p = Path(eb)
    if p.name == "esphome" and (p.parent / "pip").exists():
        return [str(p.parent / "pip")]
    if p.name == "esphome" and (p.parent / "python").exists():
        return [str(p.parent / "python"), "-m", "pip"]
    return ["python3", "-m", "pip"]


def project_dir() -> Path:
    raw = get_setting("esphome_project_dir", "").strip() or os.environ.get(
        "DSC_ESPHOME_PROJECT_DIR", ""
    ).strip()
    if raw:
        return Path(raw)
    return REPO_ROOT / "firmware" / "v4"


def dashboard_url() -> str:
    """Browser link for Settings (operator's LAN view)."""
    return get_setting("esphome_dashboard_url", "http://dsc-brain.local:6052").strip() or (
        "http://dsc-brain.local:6052"
    )


def dashboard_api() -> str:
    """brain -> ESPHome dashboard HTTP base. The dashboard is the build service."""
    return (
        get_setting("esphome_dashboard_api", "").strip()
        or os.environ.get("DSC_ESPHOME_DASHBOARD_API", "").strip()
        or "http://dsc-hub-esphome:6052"
    )


def _dash_get(path: str, timeout: float = 4.0) -> Any:
    """GET JSON from the dashboard; None on any failure (offline / not deployed)."""
    url = dashboard_api().rstrip("/") + path
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "dsc-brain"})
        with urllib.request.urlopen(req, timeout=timeout) as resp:  # noqa: S310
            return json.loads(resp.read().decode("utf-8"))
    except Exception:  # noqa: BLE001 — status must never raise
        return None


def dashboard_devices() -> list[dict[str, Any]]:
    """`GET /devices` from the dashboard: configuration + current/deployed version."""
    data = _dash_get("/devices")
    if isinstance(data, dict):
        return [d for d in data.get("configured", []) if isinstance(d, dict)]
    if isinstance(data, list):  # some builds return a bare list
        return [d for d in data if isinstance(d, dict)]
    return []


def platformio_core_dir() -> str:
    """Shared PlatformIO cache — kept off the SD root and away from `pip`'s reach."""
    return (
        os.environ.get("PLATFORMIO_CORE_DIR", "").strip()
        or get_setting("esphome_platformio_dir", "").strip()
        or "/var/lib/dsc-hub/platformio"
    )


def run_env() -> dict[str, str]:
    """Env for `esphome compile|run` subprocesses (brain service won't inherit the
    dashboard unit's Environment=)."""
    env = dict(os.environ)
    env["PLATFORMIO_CORE_DIR"] = platformio_core_dir()
    return env


# --------------------------------------------------------------------------- #
# Versions
# --------------------------------------------------------------------------- #
def installed() -> str | None:
    """Installed ESPHome version.

    Prefer the dashboard's `/version` (works cross-container, no binary needed);
    fall back to the venv `esphome version` for a host/venv deployment.
    """
    data = _dash_get("/version", timeout=3.0)
    if isinstance(data, dict):
        m = _VERSION_RE.search(str(data.get("version", "")))
        if m:
            return m.group(1)
    try:
        out = subprocess.run(
            [esphome_bin(), "version"],
            capture_output=True,
            text=True,
            timeout=20,
        )
    except (OSError, subprocess.SubprocessError):
        return None
    blob = f"{out.stdout}\n{out.stderr}"
    m = _VERSION_RE.search(blob)
    return m.group(1) if m else None


def min_version() -> str:
    """The `min_version:` the firmware pins. Read from YAML, fall back to constant."""
    yml = project_dir() / "dsc-hub-v4_0.yaml"
    try:
        text = yml.read_text(encoding="utf-8", errors="ignore")
        m = re.search(r'min_version:\s*"?(\d+\.\d+\.\d+)"?', text)
        if m:
            return m.group(1)
    except OSError:
        pass
    return PINNED_MIN_VERSION


def latest(*, force: bool = False) -> dict[str, Any]:
    """Latest esphome on PyPI. Cached ~6h, Ethernet-gated, never raises."""
    now = time.time()
    with _latest_lock:
        age = now - _latest_cache["checked_at"]
        if not force:
            if _latest_cache["ok"] and age < _PYPI_CACHE_TTL:
                return dict(_latest_cache)
            # Recently failed (offline box): serve the miss, don't hammer PyPI on
            # every /toolchain GET.
            if not _latest_cache["ok"] and 0 < age < _PYPI_FAIL_TTL:
                return {
                    "version": _latest_cache.get("version"),
                    "checked_at": _latest_cache["checked_at"],
                    "ok": False,
                    "eth_up": eth_carrier_up(),
                    "error": _latest_cache.get("error", "recent pypi lookup failed"),
                }

    eth = eth_carrier_up()
    result = {"version": _latest_cache.get("version"), "checked_at": now, "ok": False, "eth_up": eth}
    if not eth:
        result["error"] = "offline (no ethernet carrier)"
        with _latest_lock:
            _latest_cache.update(checked_at=now, ok=False, error=result["error"])
        return result
    try:
        req = urllib.request.Request(_PYPI_URL, headers={"User-Agent": "dsc-brain"})
        with urllib.request.urlopen(req, timeout=_PYPI_TIMEOUT) as resp:  # noqa: S310
            data = json.loads(resp.read().decode("utf-8"))
        ver = str(data["info"]["version"])
        result.update(version=ver, ok=True)
        with _latest_lock:
            _latest_cache.update(version=ver, checked_at=now, ok=True, error=None)
    except Exception as exc:  # noqa: BLE001 — network/JSON, must not break the endpoint
        result["error"] = f"pypi lookup failed: {exc}"
        with _latest_lock:
            _latest_cache.update(checked_at=now, ok=False, error=result["error"])
    return result


def _vtuple(v: str | None) -> tuple[int, ...]:
    if not v:
        return (0,)
    return tuple(int(x) for x in _VERSION_RE.search(v).group(1).split(".")) if _VERSION_RE.search(v) else (0,)


def device_versions() -> list[dict[str, Any]]:
    """Per-seat running ESPHome version from the native-API ingest cache."""
    fleet = get_fleet_state().to_dict()
    seats: list[tuple[str, dict[str, Any]]] = []
    if isinstance(fleet.get("hub"), dict):
        seats.append(("hub", fleet["hub"]))
    if isinstance(fleet.get("panel"), dict):
        seats.append(("control", fleet["panel"]))
    for key, seat in (fleet.get("pots") or {}).items():
        seats.append((str(key), seat))
    for key, seat in (fleet.get("sonoffs") or {}).items():
        seats.append((str(key), seat))

    inst = installed()
    # dashboard `/devices`: configuration -> deployed_version (last flash by the dashboard)
    from .esphome_jobs import SEAT_YAML

    deployed_by_yaml: dict[str, str] = {}
    for d in dashboard_devices():
        cfg = str(d.get("configuration") or "")
        dv = str(d.get("deployed_version") or "")
        if cfg and dv:
            deployed_by_yaml[cfg] = dv

    out: list[dict[str, Any]] = []
    for seat_id, seat in seats:
        values = seat.get("values") if isinstance(seat, dict) else None
        running = None
        if isinstance(seat, dict):
            running = seat.get("firmware")
        if not running and isinstance(values, dict):
            running = values.get("esphome_version")
        deployed = deployed_by_yaml.get(SEAT_YAML.get(seat_id, ""))
        out.append(
            {
                "seat_id": seat_id,
                "online": bool(seat.get("online")) if isinstance(seat, dict) else False,
                "running": running,
                "deployed": deployed,
                "matches_installed": bool(running and inst and _vtuple(running) == _vtuple(inst)),
            }
        )
    return out


# --------------------------------------------------------------------------- #
# Status snapshot
# --------------------------------------------------------------------------- #
def build_backend() -> str:
    """Where compile/OTA actually runs: 'venv' (local CLI), 'dashboard' (HTTP), or 'none'."""
    eb = esphome_bin()
    if eb and (Path(eb).exists() or shutil.which(eb)):
        return "venv"
    if _dash_get("/version", timeout=3.0) is not None:
        return "dashboard"
    return "none"


def status(*, force_latest: bool = False) -> dict[str, Any]:
    inst = installed()
    lat = latest(force=force_latest)
    mn = min_version()
    last_built = get_setting("last_built_esphome", "").strip()
    update_available = bool(lat.get("ok") and inst and _vtuple(lat["version"]) > _vtuple(inst))
    devices = device_versions()
    behind = [d for d in devices if d["running"] and not d["matches_installed"]]
    backend = build_backend()
    return {
        "installed": inst,
        "latest": lat.get("version"),
        "latest_ok": bool(lat.get("ok")),
        "latest_error": lat.get("error"),
        "min_version": mn,
        "meets_min": bool(inst and _vtuple(inst) >= _vtuple(mn)),
        "eth_up": bool(lat.get("eth_up", eth_carrier_up())),
        "checked_at": lat.get("checked_at"),
        "update_available": update_available,
        "dashboard_url": dashboard_url(),
        "dashboard_api": dashboard_api(),
        "build_backend": backend,
        "esphome_bin": esphome_bin(),
        "project_dir": str(project_dir()),
        "last_built_esphome": last_built or None,
        "fleet_rollout_pending": bool(inst and last_built and _vtuple(inst) != _vtuple(last_built)),
        "devices": devices,
        "devices_behind": [d["seat_id"] for d in behind],
        "update_job": latest_update_job(),
    }


# --------------------------------------------------------------------------- #
# Self-update job
# --------------------------------------------------------------------------- #
def _ensure_jobs(conn) -> None:
    conn.executescript(TOOLCHAIN_JOB_SCHEMA)


def _update_job_row(job_id: str, st: str, detail: str, db_path: Path | None = None) -> None:
    conn = connect(db_path)
    _ensure_jobs(conn)
    conn.execute(
        "UPDATE esphome_toolchain_jobs SET status=?, detail=?, updated_at=? WHERE job_id=?",
        (st, detail[-4000:], time.time(), job_id),
    )
    conn.commit()
    conn.close()


def latest_update_job(db_path: Path | None = None) -> dict[str, Any] | None:
    conn = connect(db_path)
    _ensure_jobs(conn)
    row = conn.execute(
        "SELECT job_id, kind, status, detail, from_version, to_version, created_at, updated_at "
        "FROM esphome_toolchain_jobs ORDER BY created_at DESC LIMIT 1"
    ).fetchone()
    conn.close()
    return dict(row) if row else None


def _run_update(job_id: str, target: str | None, db_path: Path | None = None) -> None:
    global _update_running
    from_v = installed() or ""
    pkg = f"esphome=={target}" if target else "esphome"
    cmd = [*_pip_for_esphome(), "install", "-U", pkg]
    _update_job_row(job_id, "running", f"$ {' '.join(cmd)}\n", db_path)
    chunks: list[str] = []
    try:
        proc = subprocess.Popen(
            cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, bufsize=1
        )
        last = 0.0
        if proc.stdout:
            for line in proc.stdout:
                chunks.append(line)
                if time.time() - last >= 2.0:
                    _update_job_row(job_id, "running", "".join(chunks), db_path)
                    last = time.time()
        proc.wait(timeout=900)
        tail = "".join(chunks)
        now_v = installed() or ""
        conn = connect(db_path)
        _ensure_jobs(conn)
        conn.execute(
            "UPDATE esphome_toolchain_jobs SET to_version=?, from_version=? WHERE job_id=?",
            (now_v, from_v, job_id),
        )
        conn.commit()
        conn.close()
        if proc.returncode == 0:
            _update_job_row(
                job_id,
                "done",
                tail + f"\n\nESPHome {from_v or '?'} -> {now_v or '?'}. "
                "Restart the dashboard service to pick it up:\n"
                "  sudo systemctl restart dsc-esphome-dashboard\n",
                db_path,
            )
            # Best-effort: bounce the dashboard unit so :6052 reflects the new version.
            try:
                subprocess.run(
                    ["systemctl", "restart", "dsc-esphome-dashboard"],
                    capture_output=True,
                    text=True,
                    timeout=30,
                )
            except (OSError, subprocess.SubprocessError):
                pass
        else:
            _update_job_row(
                job_id,
                "failed",
                tail + f"\n\npip exited {proc.returncode}. venv unchanged "
                f"(still {now_v or '?'}). Roll back if needed: "
                f"{' '.join(_pip_for_esphome())} install esphome=={from_v or '<last-good>'}",
                db_path,
            )
    except subprocess.TimeoutExpired:
        proc.kill()
        _update_job_row(job_id, "failed", "".join(chunks) + "\n\nTimed out after 15 min.", db_path)
    except Exception as exc:  # noqa: BLE001
        _update_job_row(job_id, "failed", "".join(chunks) + f"\n\n{exc}", db_path)
    finally:
        with _update_lock:
            _update_running = False


def update_to_latest(*, target: str | None = None, db_path: Path | None = None) -> dict[str, Any]:
    """Kick off `pip install -U esphome` in the venv. Ethernet-gated, one at a time.

    Only for the 'venv' build backend. When ESPHome runs as the dashboard
    container, `pip` can't touch its image — bump the tag in docker-compose.yml.
    """
    global _update_running
    if build_backend() != "venv":
        raise RuntimeError(
            "this kit runs ESPHome as the dashboard container — `pip` can't update it. "
            "Bump `image: esphome/esphome:<version>` in services/dsc-hub/docker-compose.yml, "
            "redeploy, then `docker compose pull esphome && docker compose up -d esphome`."
        )
    if not eth_carrier_up():
        raise ValueError("toolchain update needs an ethernet link")

    # Never let an OTA/compile job run against a moving toolchain.
    try:
        from .esphome_jobs import list_jobs

        if any(j.get("status") in {"queued", "running"} for j in list_jobs(limit=50, db_path=db_path)):
            raise RuntimeError("firmware jobs queued/running — let them finish first")
    except ImportError:
        pass

    lat = latest(force=True)
    tgt = target or (lat.get("version") if lat.get("ok") else None)
    if not tgt:
        raise ValueError("could not determine latest esphome from PyPI")
    if _vtuple(tgt) < _vtuple(min_version()):
        raise RuntimeError(f"refusing: {tgt} is below the pinned min_version {min_version()}")

    with _update_lock:
        if _update_running:
            raise RuntimeError("a toolchain update is already running")
        _update_running = True

    job_id = str(uuid.uuid4())
    now = time.time()
    conn = connect(db_path)
    _ensure_jobs(conn)
    conn.execute(
        "INSERT INTO esphome_toolchain_jobs(job_id, kind, status, detail, from_version, to_version, "
        "created_at, updated_at) VALUES(?, 'pip-update', 'queued', 'Queued…', ?, ?, ?, ?)",
        (job_id, installed() or "", tgt, now, now),
    )
    conn.commit()
    conn.close()

    threading.Thread(
        target=_run_update, args=(job_id, tgt, db_path), daemon=True, name="esphome-toolchain-update"
    ).start()
    return {"job_id": job_id, "target": tgt}


# --------------------------------------------------------------------------- #
# Fleet OTA rollout after a toolchain change (queue + one confirm click)
# --------------------------------------------------------------------------- #
_ROLLOUT_ORDER_TAIL = ("hub",)  # hub flashed LAST


def pending_fleet_rollout(db_path: Path | None = None) -> dict[str, Any]:
    """Seats that would be reflashed if the operator confirms a fleet rollout."""
    from .esphome_jobs import SEAT_YAML

    inst = installed()
    last_built = get_setting("last_built_esphome", "").strip()
    seats: list[dict[str, Any]] = []
    for row in list_inventory(db_path):
        seat_id = str(row.get("seat_id"))
        if seat_id not in SEAT_YAML:
            continue
        if not row.get("in_service", True):
            continue
        if not row.get("host"):
            continue
        seats.append({"seat_id": seat_id, "host": row.get("host"), "yaml": SEAT_YAML[seat_id]})
    seats.sort(key=lambda s: (s["seat_id"] in _ROLLOUT_ORDER_TAIL, s["seat_id"]))
    return {
        "installed": inst,
        "last_built_esphome": last_built or None,
        "needed": bool(inst and (not last_built or _vtuple(inst) != _vtuple(last_built))),
        "prompt_enabled": get_setting("esphome_fleet_ota_prompt", "true").strip().lower() == "true",
        "seats": seats,
    }


def start_fleet_rollout(db_path: Path | None = None) -> dict[str, Any]:
    """Enqueue one OTA per in-service seat, hub last. Serialised by the jobs worker."""
    from .esphome_jobs import queue_job

    plan = pending_fleet_rollout(db_path)
    queued: list[str] = []
    errors: list[dict[str, str]] = []
    for seat in plan["seats"]:
        try:
            queue_job(seat["seat_id"], "ota", db_path=db_path)
            queued.append(seat["seat_id"])
        except Exception as exc:  # noqa: BLE001 — surface per-seat, keep going
            errors.append({"seat_id": seat["seat_id"], "error": str(exc)})
    inst = installed()
    if inst and queued:
        set_setting("last_built_esphome", inst, db_path)
    return {"queued": queued, "errors": errors, "built_against": inst}
