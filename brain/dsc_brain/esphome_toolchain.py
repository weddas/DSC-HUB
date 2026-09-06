"""ESPHome build-toolchain status + self-update (Pi venv, no Home Assistant).

The Pi runs one dedicated ESPHome venv that serves both `esphome dashboard`
(port 6052) and the OTA/compile job runner in ``esphome_jobs``. This module
reports what that venv has installed, what PyPI offers, and the ``min_version``
the firmware pins — and can bump the venv to latest on operator request.

Everything here is ESPHome-native: the running per-device version comes from the
ESPHome native API ingest (``esphome_client``), "latest" comes from PyPI, and the
update is ``pip install -U esphome`` in the venv. When the brain itself runs in
the ``dsc-hub-brain`` container it cannot reach that venv, so it hands the job to
the host through ``<ops>/esphome-host/request.json`` and the
``dsc-esphome-update.path`` unit (``pi/dsc-esphome-host.sh``) — see
``_run_host_update``. The older containerised kit (``dsc-hub-esphome``) is
handled by a compose image-tag bump until that backend is removed.
No HA entities involved.
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
from .paths import BRAIN_DATA, REPO_ROOT
from .settings import connect, get_setting, list_inventory, set_setting

# Last QA-validated ESPHome; kept in lock-step with the firmware `min_version:`
# pin in firmware/v4/dsc-*-common.yaml + dsc-hub-v4_0.yaml.
PINNED_MIN_VERSION = "2026.6.5"

_PYPI_URL = "https://pypi.org/pypi/esphome/json"
_PYPI_CACHE_TTL = 6 * 3600.0
_PYPI_FAIL_TTL = 15 * 60.0  # after a failed lookup, don't re-hit PyPI for 15 min
_PYPI_TIMEOUT = 4.0

_VERSION_RE = re.compile(r"(\d+\.\d+\.\d+)")
# An ESPHome release string (2026.6.5), as opposed to the product train (8.0.0.0).
_ESPHOME_RELEASE_RE = re.compile(r"^20\d{2}\.\d{1,2}\.\d{1,3}(?:[-.].*)?$")

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


# Legacy container name, tried as a fallback during the venv-unit cutover.
_LEGACY_DASHBOARD_API = "http://dsc-hub-esphome:6052"


def dashboard_api() -> str:
    """brain -> ESPHome dashboard HTTP base. The dashboard is the build service.

    Default is the host `dsc-esphome-dashboard` venv unit reached over the bridge
    via host-gateway (compose sets DSC_ESPHOME_DASHBOARD_API); a setting or env
    override wins for a LAN host or the legacy `legacy-esphome` container.
    """
    return (
        get_setting("esphome_dashboard_api", "").strip()
        or os.environ.get("DSC_ESPHOME_DASHBOARD_API", "").strip()
        or "http://host.docker.internal:6052"
    )


# --------------------------------------------------------------------------- #
# Host helper (pi/dsc-esphome-host.sh) — files in the ops dir the container mounts
# --------------------------------------------------------------------------- #
_last_dash_base: str | None = None


def host_dir() -> Path:
    """``<ops>/esphome-host`` — shared with ``dsc-esphome-host.sh`` on the Pi."""
    raw = os.environ.get("DSC_ESPHOME_HOST_DIR", "").strip()
    if raw:
        return Path(raw)
    data = os.environ.get("DSC_DATA", "").strip()
    return (Path(data) if data else BRAIN_DATA) / "esphome-host"


def host_capabilities() -> dict[str, Any] | None:
    """What the host helper last reported (venv version, secrets, disk); None if absent."""
    try:
        data = json.loads((host_dir() / "capabilities.json").read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return None
    return data if isinstance(data, dict) and data.get("helper") else None


def dashboard_is_legacy() -> bool:
    """True when the last dashboard answer came from the retired container name."""
    return _last_dash_base == _LEGACY_DASHBOARD_API


MIN_FREE_BYTES = 1_610_612_736  # 1.5 GiB — pip + PlatformIO cache headroom on the SD


def disk_free_bytes() -> int | None:
    caps = host_capabilities()
    if caps and isinstance(caps.get("disk_free_bytes"), (int, float)):
        return int(caps["disk_free_bytes"])
    try:
        return shutil.disk_usage(str(host_dir().parent)).free
    except OSError:
        return None


def secrets_present() -> bool | None:
    """Does the firmware tree the toolchain builds from have a ``secrets.yaml``?

    From the container the tree is not visible, so trust the host helper; on a
    host/venv brain look at the project dir directly. None = unknown."""
    caps = host_capabilities()
    if caps is not None and "secrets_present" in caps:
        return bool(caps["secrets_present"])
    pd = project_dir()
    if pd.is_dir():
        return (pd / "secrets.yaml").is_file()
    return None


# --------------------------------------------------------------------------- #
# Compose backend (the `dsc-hub-esphome` container) — image-tag bump + redeploy
# --------------------------------------------------------------------------- #
_COMPOSE_IMG_RE = re.compile(
    r"^(?P<pre>[ \t]*image:[ \t]*esphome/esphome:)(?P<tag>[^\s#]+)", re.MULTILINE
)


def compose_file() -> Path:
    """docker-compose.yml that defines the `esphome` service (setting → env → repo)."""
    raw = (
        get_setting("esphome_compose_file", "").strip()
        or os.environ.get("DSC_ESPHOME_COMPOSE_FILE", "").strip()
    )
    if raw:
        return Path(raw)
    return REPO_ROOT / "services" / "dsc-hub" / "docker-compose.yml"


def compose_esphome_tag(path: Path | None = None) -> str | None:
    """The `esphome/esphome:<tag>` currently pinned in the compose file, or None."""
    p = Path(path) if path else compose_file()
    try:
        m = _COMPOSE_IMG_RE.search(p.read_text(encoding="utf-8"))
    except OSError:
        return None
    return m.group("tag") if m else None


def set_compose_esphome_tag(tag: str, path: Path | None = None) -> tuple[bool, str]:
    """Rewrite `image: esphome/esphome:<x>` → ``tag`` in place. (changed, message)."""
    p = Path(path) if path else compose_file()
    try:
        text = p.read_text(encoding="utf-8")
    except OSError as exc:
        return False, f"compose file unreadable ({p}): {exc}"
    m = _COMPOSE_IMG_RE.search(text)
    if not m:
        return False, f"no `image: esphome/esphome:<tag>` line in {p}"
    cur = m.group("tag")
    if cur == tag:
        return False, f"{p} already pins esphome/esphome:{tag}"
    try:
        p.write_text(
            _COMPOSE_IMG_RE.sub(lambda mm: mm.group("pre") + tag, text, count=1),
            encoding="utf-8",
        )
    except OSError as exc:
        return False, f"compose file not writable ({p}): {exc}"
    return True, f"{p}: esphome/esphome:{cur} → esphome/esphome:{tag}"


def _dash_get_one(base: str, path: str, timeout: float) -> Any:
    url = base.rstrip("/") + path
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "dsc-brain"})
        with urllib.request.urlopen(req, timeout=timeout) as resp:  # noqa: S310
            return json.loads(resp.read().decode("utf-8"))
    except Exception:  # noqa: BLE001 — status must never raise
        return None


def _dash_get(path: str, timeout: float = 4.0) -> Any:
    """GET JSON from the dashboard; None on any failure (offline / not deployed).

    Tries the configured base, then the legacy container name — so a kit part-way
    through the venv-unit cutover keeps working whichever one is up.
    """
    global _last_dash_base
    primary = dashboard_api()
    data = _dash_get_one(primary, path, timeout)
    if data is not None:
        _last_dash_base = primary
        return data
    if primary != _LEGACY_DASHBOARD_API:
        data = _dash_get_one(_LEGACY_DASHBOARD_API, path, min(timeout, 2.0))
        if data is not None:
            _last_dash_base = _LEGACY_DASHBOARD_API
    return data


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
        product_fw = seat.get("firmware") if isinstance(seat, dict) else None
        # `seat.firmware` is the PRODUCT train (7.0.0.0 / 8.0.0.0) from the generic
        # firmware_version text sensor — never compare that to an ESPHome release.
        # The ESPHome framework version comes from the `platform: version` text
        # sensor (`esphome_version`); accept `firmware` only if it already looks
        # like one (YYYY.M.P) for devices that report nothing else.
        running: str | None = None
        if isinstance(values, dict):
            cand = values.get("esphome_version")
            if cand and _ESPHOME_RELEASE_RE.match(str(cand)):
                running = str(cand)
        if running is None and product_fw and _ESPHOME_RELEASE_RE.match(str(product_fw)):
            running = str(product_fw)
        deployed = deployed_by_yaml.get(SEAT_YAML.get(seat_id, ""))
        out.append(
            {
                "seat_id": seat_id,
                "online": bool(seat.get("online")) if isinstance(seat, dict) else False,
                "running": running,
                "product_firmware": product_fw,
                "deployed": deployed,
                "matches_installed": bool(running and inst and _vtuple(running) == _vtuple(inst)),
            }
        )
    return out


# --------------------------------------------------------------------------- #
# Status snapshot
# --------------------------------------------------------------------------- #
def build_backend() -> str:
    """Where compile/OTA and the toolchain update actually run.

    * ``venv``      — a local ``esphome`` CLI (host/venv brain): subprocess.
    * ``venv-host`` — no local CLI, but the host ``dsc-esphome-dashboard`` unit
      answers on :6052 **and** ``dsc-esphome-host.sh`` has published
      ``capabilities.json``: compile/OTA over the dashboard WebSocket, toolchain
      update via the host helper. This is the shipping (compose brain) topology.
    * ``dashboard`` — a dashboard answers but no host helper: the legacy
      ``dsc-hub-esphome`` container, or a host unit deployed before the helper.
      Compile/OTA work; the update is a compose bump (legacy) or manual.
    * ``none``      — nothing reachable.
    """
    eb = esphome_bin()
    if eb and (Path(eb).exists() or shutil.which(eb)):
        return "venv"
    if _dash_get("/version", timeout=3.0) is None:
        return "none"
    if host_capabilities() is not None and not dashboard_is_legacy():
        return "venv-host"
    return "dashboard"


def status(*, force_latest: bool = False) -> dict[str, Any]:
    inst = installed()
    lat = latest(force=force_latest)
    mn = min_version()
    last_built = get_setting("last_built_esphome", "").strip()
    update_available = bool(lat.get("ok") and inst and _vtuple(lat["version"]) > _vtuple(inst))
    devices = device_versions()
    behind = [d for d in devices if d["running"] and not d["matches_installed"]]
    backend = build_backend()
    caps = host_capabilities()
    free = disk_free_bytes()
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
        "dashboard_legacy": dashboard_is_legacy(),
        "host_helper": bool(caps),
        "host_helper_written_at": (caps or {}).get("written_at"),
        "compose_file": str(compose_file()) if backend == "dashboard" else None,
        "compose_esphome_tag": compose_esphome_tag() if backend == "dashboard" else None,
        "esphome_bin": esphome_bin(),
        "project_dir": str((caps or {}).get("project_dir") or project_dir()),
        "secrets_present": secrets_present(),
        "disk_free_gb": round(free / 1_073_741_824, 2) if free is not None else None,
        "disk_free_ok": (free >= MIN_FREE_BYTES) if free is not None else None,
        "last_built_esphome": last_built or None,
        "fleet_rollout_pending": bool(inst and last_built and _vtuple(inst) != _vtuple(last_built)),
        "rollback_target": rollback_target(inst=inst),
        "devices": devices,
        "devices_behind": [d["seat_id"] for d in behind],
        "update_job": latest_update_job(),
        "canary": canary_status(inst=inst, devices=devices),
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


def _new_toolchain_job(kind: str, tgt: str, db_path: Path | None = None) -> str:
    job_id = str(uuid.uuid4())
    now = time.time()
    conn = connect(db_path)
    _ensure_jobs(conn)
    conn.execute(
        "INSERT INTO esphome_toolchain_jobs(job_id, kind, status, detail, from_version, "
        "to_version, created_at, updated_at) VALUES(?, ?, 'queued', 'Queued…', ?, ?, ?, ?)",
        (job_id, kind, installed() or "", tgt, now, now),
    )
    conn.commit()
    conn.close()
    return job_id


def _set_toolchain_job_versions(
    job_id: str, from_v: str, to_v: str, db_path: Path | None = None
) -> None:
    conn = connect(db_path)
    _ensure_jobs(conn)
    conn.execute(
        "UPDATE esphome_toolchain_jobs SET from_version=?, to_version=? WHERE job_id=?",
        (from_v, to_v, job_id),
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


def rollback_target(db_path: Path | None = None, inst: str | None = None) -> str | None:
    """The version the last successful toolchain change came *from* — offered as
    "Roll back to X" when it is still >= the pinned min and != what is installed."""
    conn = connect(db_path)
    _ensure_jobs(conn)
    row = conn.execute(
        "SELECT from_version FROM esphome_toolchain_jobs WHERE status='done' "
        "AND from_version<>'' AND to_version<>'' AND from_version<>to_version "
        "ORDER BY created_at DESC LIMIT 1"
    ).fetchone()
    conn.close()
    if not row:
        return None
    prev = str(row[0])
    inst = inst if inst is not None else installed()
    if inst and _vtuple(prev) == _vtuple(inst):
        return None
    if _vtuple(prev) < _vtuple(min_version()):
        return None
    return prev


_HOST_UPDATE_TIMEOUT = 20 * 60.0


def _write_host_request(job_id: str, action: str, target: str | None) -> Path:
    hd = host_dir()
    hd.mkdir(parents=True, exist_ok=True)
    # Clear stale artefacts from an earlier run so we never read an old result.
    for name in ("result.json", "progress.log"):
        try:
            (hd / name).unlink()
        except OSError:
            pass
    tmp = hd / ".request.json.tmp"
    tmp.write_text(
        json.dumps(
            {"job_id": job_id, "action": action, "target": target or "", "requested_at": time.time()}
        ),
        encoding="utf-8",
    )
    req = hd / "request.json"
    tmp.replace(req)  # atomic: the .path unit must never see a half-written file
    return req


def _run_host_update(
    job_id: str, action: str, target: str | None, db_path: Path | None = None
) -> None:
    """Containerised brain: hand the pip to ``dsc-esphome-host.sh`` via request.json,
    stream its progress.log into the job row, finish on result.json."""
    global _update_running
    from_v = installed() or ""
    hd = host_dir()
    try:
        req = _write_host_request(job_id, action, target)
        head = (
            f"$ request -> {req}  ({action} esphome{'==' + target if target else ''})\n"
            "waiting for the host helper (dsc-esphome-update.path)...\n"
        )
        _update_job_row(job_id, "running", head, db_path)
        started = time.time()
        last_len = -1
        result: dict[str, Any] | None = None
        while time.time() - started < _HOST_UPDATE_TIMEOUT:
            try:
                data = json.loads((hd / "result.json").read_text(encoding="utf-8"))
                if isinstance(data, dict) and str(data.get("job_id")) == job_id:
                    result = data
                    break
            except (OSError, ValueError):
                pass
            try:
                prog = (hd / "progress.log").read_text(encoding="utf-8", errors="replace")
            except OSError:
                prog = ""
            if len(prog) != last_len:
                last_len = len(prog)
                _update_job_row(job_id, "running", head + prog[-3000:], db_path)
            elif time.time() - started > 45 and not prog and req.exists():
                _update_job_row(
                    job_id,
                    "running",
                    head + "\n(no helper activity after 45 s - is dsc-esphome-update.path "
                    "enabled on the Pi? `sudo systemctl enable --now dsc-esphome-update.path`)\n",
                    db_path,
                )
            time.sleep(_host_poll_interval())
        if result is None:
            _update_job_row(
                job_id,
                "failed",
                head + "\nTimed out after 20 min waiting for the host helper. The request file "
                f"is at {hd / 'request.json'}; check `journalctl -u dsc-esphome-update` on the Pi.",
                db_path,
            )
            return
        now_v = str(result.get("to") or "") or (installed() or "")
        from_v = str(result.get("from") or "") or from_v
        _set_toolchain_job_versions(job_id, from_v, now_v, db_path)
        tail = str(result.get("log_tail") or "")
        msg = str(result.get("message") or "")
        try:
            (hd / "result.json").unlink()
        except OSError:
            pass
        if result.get("ok"):
            _update_job_row(job_id, "done", f"{tail}\n\n{msg}\n", db_path)
        else:
            _update_job_row(
                job_id,
                "failed",
                f"{tail}\n\n{msg} (exit {result.get('exit_code')})\n",
                db_path,
            )
    except Exception as exc:  # noqa: BLE001
        _update_job_row(job_id, "failed", f"host update failed: {exc}", db_path)
    finally:
        with _update_lock:
            _update_running = False


def _host_poll_interval() -> float:
    """Seconds between progress polls (tests shrink it)."""
    try:
        return float(os.environ.get("DSC_ESPHOME_HOST_POLL", "2.0"))
    except ValueError:
        return 2.0


def _compose_update_cmd() -> str:
    """The redeploy command for the `esphome` container (setting → env → default)."""
    tmpl = (
        get_setting("esphome_compose_update_cmd", "").strip()
        or os.environ.get("DSC_ESPHOME_COMPOSE_UPDATE_CMD", "").strip()
        or (
            "docker compose --profile legacy-esphome -f {file} pull esphome && "
            "docker compose --profile legacy-esphome -f {file} up -d esphome"
        )
    )
    return tmpl.replace("{file}", str(compose_file()))


def _run_compose_update(job_id: str, cmd: str, head: str, db_path: Path | None = None) -> None:
    """Run the container redeploy, stream stdout, then re-read the dashboard version."""
    global _update_running
    from_v = installed() or ""
    chunks: list[str] = [head, f"\n$ {cmd}\n"]
    proc: subprocess.Popen[str] | None = None
    try:
        # `&&` in the default command needs a shell; the command is operator-owned
        # (setting/env), same trust model as `brain_update_cmd`.
        proc = subprocess.Popen(  # noqa: S602
            cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, bufsize=1
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
        now_v = ""
        if proc.returncode == 0:
            # the container is bouncing on the new image — give :6052 a moment.
            for _ in range(10):
                now_v = installed() or ""
                if now_v and now_v != from_v:
                    break
                time.sleep(2.0)
        else:
            now_v = installed() or ""
        _set_toolchain_job_versions(job_id, from_v, now_v, db_path)
        if proc.returncode == 0:
            _update_job_row(
                job_id,
                "done",
                tail + f"\n\nESPHome {from_v or '?'} → {now_v or '?'} "
                "(dsc-hub-esphome container redeployed on the new image).",
                db_path,
            )
        else:
            _update_job_row(
                job_id,
                "failed",
                tail + f"\n\ncompose redeploy exited {proc.returncode}. The container may still be "
                f"on {from_v or '?'} — check `docker compose ps` / `docker compose logs esphome`.",
                db_path,
            )
    except subprocess.TimeoutExpired:
        if proc:
            proc.kill()
        _update_job_row(job_id, "failed", "".join(chunks) + "\n\nTimed out after 15 min.", db_path)
    except Exception as exc:  # noqa: BLE001
        _update_job_row(job_id, "failed", "".join(chunks) + f"\n\n{exc}", db_path)
    finally:
        with _update_lock:
            _update_running = False


def _start_compose_update(tgt: str, db_path: Path | None = None) -> dict[str, Any]:
    """Container backend: bump `image: esphome/esphome:<tgt>`, redeploy if `docker` is here.

    Clears the run lock itself on the no-docker path (nothing async was started).
    """
    global _update_running
    cf = compose_file()
    changed, note = set_compose_esphome_tag(tgt, cf)
    cmd = _compose_update_cmd()

    if shutil.which("docker") is None:
        # The brain container has no docker socket — leave the bumped tag + exact
        # steps so the operator's next `docker compose up` picks it up.
        with _update_lock:
            _update_running = False
        head = note if changed else f"{note}\n(edit it by hand to `image: esphome/esphome:{tgt}`)"
        return {
            "status": "manual",
            "mode": "compose",
            "target": tgt,
            "compose_file": str(cf),
            "compose_bumped": changed,
            "detail": (
                f"{head}\n\nThen redeploy on the Pi:\n  {cmd}\n\n"
                f"Settings → Device → ESPHome will read {tgt} once the container is back up."
            ),
        }

    job_id = _new_toolchain_job("compose-redeploy", tgt, db_path)
    _update_job_row(job_id, "running", f"{note}\n", db_path)
    threading.Thread(
        target=_run_compose_update,
        args=(job_id, cmd, note, db_path),
        daemon=True,
        name="esphome-compose-update",
    ).start()
    return {"job_id": job_id, "target": tgt, "mode": "compose", "compose_bumped": changed}


def update_to_latest(
    *,
    target: str | None = None,
    db_path: Path | None = None,
    allow_downgrade: bool = False,
) -> dict[str, Any]:
    """Move the ESPHome build toolchain to ``target`` (or PyPI latest).

    Ethernet-gated, one at a time, never below the firmware-pinned ``min_version``,
    never *down* unless ``allow_downgrade`` (the rollback path). Mechanism per backend:

    * ``venv``      — ``pip install -U esphome`` here, then bounce the dashboard unit.
    * ``venv-host`` — request.json → ``dsc-esphome-host.sh`` on the Pi (the brain is
      in a container and cannot pip the host venv itself).
    * ``dashboard`` — legacy ``dsc-hub-esphome`` container: compose tag bump +
      redeploy (or the exact steps when this host can't run ``docker``); a host
      unit without the helper gets told how to install it.
    * ``none``      — nothing to drive; raises.
    """
    global _update_running
    backend = build_backend()
    if backend == "none":
        raise RuntimeError(
            "no ESPHome build backend reachable — neither a venv `esphome` nor the dashboard "
            "on :6052. Update ESPHome on the host and reflash with pi/flash-fleet-remote.sh."
        )
    if backend == "dashboard" and not dashboard_is_legacy():
        raise RuntimeError(
            "the host ESPHome dashboard is up but its update helper is not installed — on the Pi: "
            "`sudo systemctl enable --now dsc-esphome-update.path` (or re-run the deploy/bake), "
            "then try again."
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

    inst = installed()
    if target:
        tgt = target.strip()
    else:
        lat = latest(force=True)
        tgt = lat.get("version") if lat.get("ok") else None
    if not tgt:
        raise ValueError("could not determine latest esphome from PyPI")
    if _vtuple(tgt) < _vtuple(min_version()):
        raise RuntimeError(f"refusing: {tgt} is below the pinned min_version {min_version()}")
    if inst and _vtuple(tgt) == _vtuple(inst):
        raise RuntimeError(f"ESPHome {inst} is already installed")
    if inst and not allow_downgrade and _vtuple(tgt) < _vtuple(inst):
        raise RuntimeError(
            f"refusing: {tgt} is older than the installed {inst} — use the rollback action"
        )
    free = disk_free_bytes()
    if free is not None and free < MIN_FREE_BYTES:
        raise RuntimeError(
            f"refusing: only {free // 1_048_576} MiB free, need "
            f"{MIN_FREE_BYTES // 1_048_576} MiB for pip + the PlatformIO cache"
        )

    with _update_lock:
        if _update_running:
            raise RuntimeError("a toolchain update is already running")
        _update_running = True

    action = "rollback" if allow_downgrade else "update"
    try:
        if backend == "dashboard":
            return _start_compose_update(tgt, db_path)
        if backend == "venv-host":
            job_id = _new_toolchain_job(f"host-{action}", tgt, db_path)
            threading.Thread(
                target=_run_host_update, args=(job_id, action, tgt, db_path), daemon=True,
                name="esphome-host-update",
            ).start()
            return {"job_id": job_id, "target": tgt, "mode": "host", "action": action}
        job_id = _new_toolchain_job(f"pip-{action}", tgt, db_path)
        threading.Thread(
            target=_run_update, args=(job_id, tgt, db_path), daemon=True,
            name="esphome-toolchain-update",
        ).start()
        return {"job_id": job_id, "target": tgt, "mode": "pip", "action": action}
    except Exception:
        with _update_lock:
            _update_running = False
        raise


def rollback_toolchain(*, target: str | None = None, db_path: Path | None = None) -> dict[str, Any]:
    """Put the toolchain back on the version the last successful change came from."""
    tgt = (target or "").strip() or rollback_target(db_path)
    if not tgt:
        raise ValueError("nothing to roll back to — no completed toolchain change on record")
    return update_to_latest(target=tgt, db_path=db_path, allow_downgrade=True)


# --------------------------------------------------------------------------- #
# Fleet OTA rollout after a toolchain change (queue + one confirm click)
# --------------------------------------------------------------------------- #
_ROLLOUT_ORDER_TAIL = ("hub",)  # hub flashed LAST
_CANARY_KEY = "esphome_rollout_canary"
_CANARY_PREFERENCE = ("pot2", "pot1", "pot3", "pot4")


def _canary_state(db_path: Path | None = None) -> dict[str, Any] | None:
    raw = get_setting(_CANARY_KEY, "", db_path).strip()
    if not raw:
        return None
    try:
        data = json.loads(raw)
    except ValueError:
        return None
    return data if isinstance(data, dict) and data.get("seat") else None


def _clear_canary(db_path: Path | None = None) -> None:
    set_setting(_CANARY_KEY, "", db_path)


def canary_status(
    db_path: Path | None = None,
    inst: str | None = None,
    devices: list[dict[str, Any]] | None = None,
) -> dict[str, Any] | None:
    """State of an in-flight canary (one probe flashed ahead of the fleet), or None."""
    st = _canary_state(db_path)
    if not st:
        return None
    inst = inst if inst is not None else installed()
    if not inst or _vtuple(str(st.get("built") or "")) != _vtuple(inst):
        return None  # the toolchain moved again since the canary — start over
    from .esphome_jobs import get_job

    try:
        job = get_job(str(st.get("job_id")), db_path)
    except KeyError:
        job = None
    devices = devices if devices is not None else device_versions()
    dev = next((d for d in devices if d.get("seat_id") == st["seat"]), None)
    running = dev.get("running") if dev else None
    job_status = str(job.get("status")) if job else "unknown"
    return {
        "seat": st["seat"],
        "job_id": st.get("job_id"),
        "job_status": job_status,
        "job_detail": str((job or {}).get("detail") or "")[-600:],
        "running": running,
        "online": bool(dev.get("online")) if dev else False,
        "ok": job_status == "done" and bool(running) and _vtuple(str(running)) == _vtuple(inst),
        "queued_at": st.get("queued_at"),
    }


def pending_fleet_rollout(db_path: Path | None = None) -> dict[str, Any]:
    """Seats that would be reflashed if the operator confirms a fleet rollout."""
    from .esphome_jobs import SEAT_YAML

    inst = installed()
    last_built = get_setting("last_built_esphome", "", db_path).strip()
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
    ids = [s["seat_id"] for s in seats]
    canary_seat = next((c for c in _CANARY_PREFERENCE if c in ids), None)
    if canary_seat is None:
        canary_seat = next((i for i in ids if i not in _ROLLOUT_ORDER_TAIL), None)
    canary = canary_status(db_path, inst=inst)
    if canary and canary["seat"] in ids:
        canary_seat = canary["seat"]
    return {
        "installed": inst,
        "last_built_esphome": last_built or None,
        "needed": bool(inst and (not last_built or _vtuple(inst) != _vtuple(last_built))),
        "prompt_enabled": get_setting("esphome_fleet_ota_prompt", "true", db_path).strip().lower() == "true",
        "seats": seats,
        "canary_seat": canary_seat,
        "canary": canary,
        "rest": [s for s in seats if s["seat_id"] != canary_seat],
    }


def start_fleet_rollout(db_path: Path | None = None, mode: str = "all") -> dict[str, Any]:
    """Enqueue OTAs through the jobs worker (serialised, hub last).

    * ``all``    — every in-service seat.
    * ``canary`` — only the canary probe; ``last_built_esphome`` is left alone so the
      rollout prompt stays up until the rest is released.
    * ``rest``   — everything except the canary seat; marks the rollout done.
    """
    from .esphome_jobs import queue_job

    if mode not in {"all", "canary", "rest"}:
        raise ValueError(f"unknown rollout mode {mode!r}")
    plan = pending_fleet_rollout(db_path)
    inst = installed()
    if mode == "canary":
        seat = plan.get("canary_seat")
        if not seat:
            raise ValueError("no in-service probe available as a canary")
        job = queue_job(seat, "ota", db_path=db_path)
        set_setting(
            _CANARY_KEY,
            json.dumps({"seat": seat, "job_id": job["job_id"], "built": inst or "", "queued_at": time.time()}),
            db_path,
        )
        return {"queued": [seat], "errors": [], "built_against": inst, "mode": mode}

    targets = plan["seats"] if mode == "all" else plan["rest"]
    queued: list[str] = []
    errors: list[dict[str, str]] = []
    for seat in targets:
        try:
            queue_job(seat["seat_id"], "ota", db_path=db_path)
            queued.append(seat["seat_id"])
        except Exception as exc:  # noqa: BLE001 — surface per-seat, keep going
            errors.append({"seat_id": seat["seat_id"], "error": str(exc)})
    if inst and queued:
        set_setting("last_built_esphome", inst, db_path)
    _clear_canary(db_path)
    return {"queued": queued, "errors": errors, "built_against": inst, "mode": mode}
