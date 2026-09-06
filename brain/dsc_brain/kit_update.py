"""DSC kit version check + update — brain code and ESP fleet firmware.

Read side (``GET /settings/update``): compares the running brain ``__version__``
and the running per-seat ESP firmware against the latest GitHub release tag and
the brain's ``EXPECTED_FIRMWARE``. Ethernet-gated, cached ~1 h, offline-safe
(never raises — an offline box just gets ``ok: false``).

Write side (``POST /settings/update/pull``): runs the operator-configured brain
self-update command (setting ``brain_update_cmd``) as a background job. If none
is set it returns the manual deploy instruction rather than guessing at the
deploy topology (Docker compose vs venv vs bare). Fleet firmware reflash is a
separate action — the ESPHome rollout in ``esphome_jobs`` / ``esphome_toolchain``.
"""

from __future__ import annotations

import json
import shlex
import subprocess
import threading
import time
import urllib.request
from typing import Any

from . import __version__
from .fleet_state import get_fleet_state
from .network_apply import eth_carrier_up
from .paths import EXPECTED_FIRMWARE, SURFACE_VERSION
from .settings import get_setting, list_inventory

_GH_LATEST_URL = "https://api.github.com/repos/weddas/DSC-HUB/releases/latest"
_GH_CACHE_TTL = 3600.0  # 1 h
_GH_FAIL_TTL = 15 * 60.0
_GH_TIMEOUT = 5.0

_gh_cache: dict[str, Any] = {"tag": None, "name": None, "url": None, "published_at": None,
                             "checked_at": 0.0, "ok": False, "error": None}
_gh_lock = threading.Lock()

_update_job: dict[str, Any] = {"status": "idle", "detail": "", "started_at": 0.0}
_update_lock = threading.Lock()


def _norm(v: str | None) -> str:
    s = str(v or "").strip()
    return s[1:] if s[:1].lower() == "v" else s


def _version_core(v: str | None) -> tuple[int, ...]:
    """Numeric core of a version, ignoring a pre-release / label tail.

    ``v8.0.0-AlphaPi`` -> ``(8, 0, 0)`` so it matches the running ``8.0.0`` and does
    not read as a newer release just because the tag string differs.
    """
    core = _norm(v).split("-", 1)[0].split("+", 1)[0]
    parts: list[int] = []
    for chunk in core.split("."):
        digits = "".join(c for c in chunk if c.isdigit())
        parts.append(int(digits) if digits else 0)
    return tuple(parts) or (0,)


def _is_newer(latest: str | None, running: str | None) -> bool:
    """True only when ``latest``'s numeric core is strictly greater than ``running``."""
    lc, rc = _version_core(latest), _version_core(running)
    width = max(len(lc), len(rc))
    lc += (0,) * (width - len(lc))
    rc += (0,) * (width - len(rc))
    return lc > rc


def github_latest(*, force: bool = False) -> dict[str, Any]:
    """Latest GitHub release for weddas/DSC-HUB. Cached, Ethernet-gated, never raises."""
    now = time.time()
    with _gh_lock:
        age = now - float(_gh_cache["checked_at"])
        if not force:
            if _gh_cache["ok"] and age < _GH_CACHE_TTL:
                return dict(_gh_cache)
            if not _gh_cache["ok"] and 0 < age < _GH_FAIL_TTL:
                return {**_gh_cache, "eth_up": eth_carrier_up()}

    eth = eth_carrier_up()
    result: dict[str, Any] = {
        "tag": _gh_cache.get("tag"),
        "name": _gh_cache.get("name"),
        "url": _gh_cache.get("url"),
        "published_at": _gh_cache.get("published_at"),
        "checked_at": now,
        "ok": False,
        "eth_up": eth,
        "error": None,
    }
    if not eth:
        result["error"] = "offline (no ethernet carrier)"
        with _gh_lock:
            _gh_cache.update(checked_at=now, ok=False, error=result["error"])
        return result
    try:
        req = urllib.request.Request(
            _GH_LATEST_URL,
            headers={"User-Agent": "dsc-brain", "Accept": "application/vnd.github+json"},
        )
        with urllib.request.urlopen(req, timeout=_GH_TIMEOUT) as resp:  # noqa: S310
            data = json.loads(resp.read().decode("utf-8"))
        result.update(
            tag=str(data.get("tag_name") or ""),
            name=str(data.get("name") or data.get("tag_name") or ""),
            url=str(data.get("html_url") or ""),
            published_at=str(data.get("published_at") or ""),
            ok=True,
            error=None,
        )
        with _gh_lock:
            _gh_cache.update(
                tag=result["tag"], name=result["name"], url=result["url"],
                published_at=result["published_at"], checked_at=now, ok=True, error=None,
            )
    except Exception as exc:  # noqa: BLE001 — network/JSON, must not break the endpoint
        result["error"] = f"github lookup failed: {exc}"
        with _gh_lock:
            _gh_cache.update(checked_at=now, ok=False, error=result["error"])
    return result


def fleet_firmware_status() -> dict[str, Any]:
    """Per-seat running ESP firmware vs the brain's EXPECTED_FIRMWARE."""
    fleet = get_fleet_state().to_dict()
    in_service = {str(r["seat_id"]): bool(r.get("in_service")) for r in list_inventory()}
    seats: list[tuple[str, dict[str, Any]]] = []
    if isinstance(fleet.get("hub"), dict):
        seats.append(("hub", fleet["hub"]))
    if isinstance(fleet.get("panel"), dict):
        seats.append(("control", fleet["panel"]))
    for key, seat in (fleet.get("pots") or {}).items():
        seats.append((str(key), seat))
    for key, seat in (fleet.get("sonoffs") or {}).items():
        seats.append((str(key), seat))

    expected = _norm(EXPECTED_FIRMWARE)
    devices: list[dict[str, Any]] = []
    behind = 0
    for seat_id, seat in seats:
        running_raw = seat.get("firmware") if isinstance(seat, dict) else None
        running = _norm(running_raw) if running_raw else None
        online = bool(seat.get("online")) if isinstance(seat, dict) else False
        is_behind = bool(running) and running != expected
        if is_behind and in_service.get(seat_id, True):
            behind += 1
        devices.append(
            {
                "seat_id": seat_id,
                "running": running,
                "expected": expected,
                "behind": is_behind,
                "online": online,
                "in_service": in_service.get(seat_id, True),
            }
        )
    return {"expected_firmware": expected, "devices": devices, "behind_count": behind}


def update_status(*, eth_up: bool | None = None, refresh: bool = False) -> dict[str, Any]:
    if eth_up is None:
        eth_up = eth_carrier_up()
    gh = github_latest(force=refresh)
    latest_tag = _norm(gh.get("tag"))
    update_available = bool(gh["ok"] and latest_tag and _is_newer(latest_tag, __version__))
    fleet = fleet_firmware_status()
    return {
        "eth_up": bool(eth_up),
        "can_full_pull": bool(eth_up),
        "current": {
            "image": "8.0.0",
            "brain": __version__,
            "surface": SURFACE_VERSION,
            "digests": {},
        },
        "brain": {
            "version": __version__,
            "latest_tag": gh.get("tag"),
            "latest_name": gh.get("name"),
            "latest_url": gh.get("url"),
            "published_at": gh.get("published_at"),
            "update_available": update_available,
            "checked_at": gh.get("checked_at"),
            "ok": bool(gh["ok"]),
            "error": gh.get("error"),
        },
        "fleet": fleet,
        "update_job": dict(_update_job) if _update_job["status"] != "idle" else None,
        "note": (
            "Full Update pulls require Ethernet. Offline kits keep running the baked card version."
            if not eth_up
            else "Ethernet up — full Update pull allowed."
        ),
    }


def check_updates() -> dict[str, Any]:
    """Explicit 'Check for updates' — force a fresh GitHub lookup."""
    return update_status(refresh=True)


def _run_update(cmd: str) -> None:
    with _update_lock:
        _update_job.update(status="running", detail=f"$ {cmd}", started_at=time.time())
    try:
        proc = subprocess.run(  # noqa: S603
            shlex.split(cmd),
            capture_output=True,
            text=True,
            timeout=1800,
        )
        tail = (proc.stdout or "")[-4000:] + (("\n" + proc.stderr[-2000:]) if proc.stderr else "")
        status = "done" if proc.returncode == 0 else "failed"
        with _update_lock:
            _update_job.update(status=status, detail=f"exit {proc.returncode}\n{tail}".strip())
    except Exception as exc:  # noqa: BLE001
        with _update_lock:
            _update_job.update(status="failed", detail=f"{type(exc).__name__}: {exc}")


def start_full_update(*, eth_up: bool | None = None) -> dict[str, Any]:
    if eth_up is None:
        eth_up = eth_carrier_up()
    if not eth_up:
        raise ValueError("full update requires ethernet link")
    with _update_lock:
        if _update_job["status"] == "running":
            raise ValueError("an update is already running")
    cmd = str(get_setting("brain_update_cmd", "")).strip()
    if not cmd:
        return {
            "status": "manual",
            "action": "full_pull",
            "detail": (
                "No brain_update_cmd is set. Run the deploy from your workstation "
                "(deploy/deploy-brain-remote.sh), or set the brain_update_cmd setting to a "
                "self-update script the brain can exec on the Pi."
            ),
            **update_status(eth_up=True),
        }
    with _update_lock:
        _update_job.update(status="running", detail="starting…", started_at=time.time())
    threading.Thread(target=_run_update, args=(cmd,), daemon=True).start()
    return {
        "status": "accepted",
        "action": "full_pull",
        "detail": f"Update started: {cmd}",
        **update_status(eth_up=True),
    }


def full_update_job() -> dict[str, Any]:
    return dict(_update_job)
