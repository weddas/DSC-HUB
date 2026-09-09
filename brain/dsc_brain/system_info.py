"""System transparency (plan-settings S4): time, optional-route health, failover state.

Everything here is read-only and never invents a value: when the host has no
``timedatectl`` the NTP status is ``None`` ("unknown"), when the hub firmware does not
publish its clock the drift is ``None`` and the SPA says so.
"""

from __future__ import annotations

import datetime as _dt
import os
import shutil
import subprocess
import time
from typing import Any

from .computed_ops import SYDNEY_TZ
from .fleet_state import get_fleet_state
from .hub_failover import DEFAULT_TTL_SEC, get_override

# The hub firmware's sntp component is pinned to this zone (firmware/v4 `time:`); photoperiod
# windows run on the hub's local clock, so the SPA shows both clocks side by side.
HUB_FIRMWARE_TZ = "Australia/Sydney"

# Optional routes the SPA asks the brain for. A brain that predates one answers with the SPA's
# index.html — the "brain predates …" messages. The list is the contract for About › Brain routes.
OPTIONAL_ROUTES: list[dict[str, str]] = [
    {"path": "/settings/manifest", "label": "Settings manifest", "since": "S1"},
    {"path": "/settings/hub-tunables", "label": "Hub tunables", "since": "S2"},
    {"path": "/settings/stage-rail", "label": "Stage presets", "since": "S2"},
    {"path": "/settings/root-steering-targets", "label": "Root steering targets", "since": "S2"},
    {"path": "/settings/alerts", "label": "Alert catalogue", "since": "S3"},
    {"path": "/settings/automation-defaults", "label": "Automation defaults", "since": "S3"},
    {"path": "/settings/journals", "label": "Journals & storage", "since": "S3"},
    {"path": "/journals/archive", "label": "Grow records", "since": "S3"},
    {"path": "/system/time", "label": "Time", "since": "S4"},
    {"path": "/system/failover", "label": "Failover state", "since": "S4"},
    {"path": "/settings/profile", "label": "Setup profile", "since": "S4"},
    {"path": "/cameras", "label": "Cameras", "since": "S7"},
    {"path": "/zones", "label": "Zones", "since": "v2"},
]


def _ntp_status_kernel() -> dict[str, Any] | None:
    """Kernel clock discipline via adjtimex(2) — the same kernel clock the host disciplines,
    readable from inside the container without any host tooling. None when unavailable."""
    import ctypes
    import sys

    if not sys.platform.startswith("linux"):
        return None
    try:
        libc = ctypes.CDLL(None, use_errno=True)

        class _Timeval(ctypes.Structure):
            _fields_ = [("tv_sec", ctypes.c_long), ("tv_usec", ctypes.c_long)]

        class _Timex(ctypes.Structure):
            _fields_ = [
                ("modes", ctypes.c_uint),
                ("offset", ctypes.c_long),
                ("freq", ctypes.c_long),
                ("maxerror", ctypes.c_long),
                ("esterror", ctypes.c_long),
                ("status", ctypes.c_int),
                ("constant", ctypes.c_long),
                ("precision", ctypes.c_long),
                ("tolerance", ctypes.c_long),
                ("time", _Timeval),
                ("tick", ctypes.c_long),
                ("ppsfreq", ctypes.c_long),
                ("jitter", ctypes.c_long),
                ("shift", ctypes.c_int),
                ("stabil", ctypes.c_long),
                ("jitcnt", ctypes.c_long),
                ("calcnt", ctypes.c_long),
                ("errcnt", ctypes.c_long),
                ("stbcnt", ctypes.c_long),
                ("tai", ctypes.c_int),
                ("_pad", ctypes.c_int * 11),
            ]

        tx = _Timex()
        tx.modes = 0  # read-only query, no CAP_SYS_TIME needed
        ret = libc.adjtimex(ctypes.byref(tx))
        if ret < 0:
            return None
        sta_unsync = 0x0040
        time_error = 5
        synced = ret != time_error and not (int(tx.status) & sta_unsync)
        return {
            "synced": bool(synced),
            "source": "kernel adjtimex",
            "detail": (
                f"kernel clock {'synchronised' if synced else 'UNSYNC'} · max error {int(tx.maxerror) / 1e6:.3f} s"
                + (" · TIME_ERROR" if ret == time_error else "")
            ),
            "max_error_s": round(int(tx.maxerror) / 1e6, 3),
        }
    except Exception:  # noqa: BLE001 — any libc/ABI surprise means "unknown", never a crash
        return None


def _ntp_status() -> dict[str, Any]:
    """NTP health: timedatectl on a host that has it, else the kernel's own sync flag.

    The brain runs in a container where timedatectl is never present, so the old
    "unknown on this host" branch was the only branch that ever ran in production and the
    7-minute host clock error went undetected. The kernel clock is shared with the host.
    """
    exe = shutil.which("timedatectl")
    if not exe:
        kernel = _ntp_status_kernel()
        if kernel is not None:
            return kernel
        return {"synced": None, "source": None, "detail": "neither timedatectl nor adjtimex available on this host"}
    try:
        out = subprocess.run(  # noqa: S603
            [exe, "show", "-p", "NTPSynchronized", "-p", "NTP", "-p", "Timezone"],
            capture_output=True,
            text=True,
            timeout=3,
            check=False,
        ).stdout
    except (OSError, subprocess.SubprocessError) as exc:
        return {"synced": None, "source": None, "detail": f"timedatectl failed: {exc}"}
    kv: dict[str, str] = {}
    for line in out.splitlines():
        if "=" in line:
            k, v = line.split("=", 1)
            kv[k.strip()] = v.strip()
    synced = kv.get("NTPSynchronized")
    return {
        "synced": True if synced == "yes" else False if synced == "no" else None,
        "source": "systemd-timesyncd" if kv.get("NTP") == "yes" else None,
        "detail": f"NTP={kv.get('NTP', '?')} · zone {kv.get('Timezone', '?')}",
        "host_timezone": kv.get("Timezone"),
    }


def _hub_clock(values: dict[str, Any]) -> dict[str, Any]:
    raw = values.get("hub_clock_epoch")
    epoch: float | None = None
    if raw not in (None, "", "unsynced"):
        try:
            epoch = float(raw)
        except (TypeError, ValueError):
            epoch = None
    # The hub publishes clock_valid nested under values["binaries"] (see esphome_client /
    # dash_computed). The flat spelling never existed, so this read was permanently None and
    # the SPA's CLOCK INVALID chip (gated on === false) could never render.
    bins = values.get("binaries") or {}
    cv = bins.get("binary_sensor.dsc_hub_clock_valid")
    if cv is None:
        cv = values.get("clock_valid")
    valid: bool | None
    if isinstance(cv, bool):
        valid = cv
    elif cv in ("on", "off"):
        valid = cv == "on"
    else:
        valid = None
    return {"epoch": epoch, "valid": valid, "timezone": HUB_FIRMWARE_TZ, "raw": raw}


def time_info(now: float | None = None) -> dict[str, Any]:
    now = time.time() if now is None else now
    fleet = get_fleet_state()
    hub_vals = dict(getattr(getattr(fleet, "hub", None), "values", {}) or {})
    hub = _hub_clock(hub_vals)
    brain_local = _dt.datetime.fromtimestamp(now, SYDNEY_TZ)
    drift = None
    hub_age = None
    last_seen = getattr(getattr(fleet, "hub", None), "last_seen", None)
    if hub["epoch"] is not None:
        # The hub stamps its clock once per report; compare against the poll that carried it.
        ref = float(last_seen) if last_seen else now
        drift = round(hub["epoch"] - ref, 1)
        hub_age = round(now - ref, 1) if last_seen else None
    return {
        "now": now,
        "brain": {
            "timezone": str(SYDNEY_TZ.key),
            "utc_offset_min": int((brain_local.utcoffset() or _dt.timedelta()).total_seconds() // 60),
            "local_iso": brain_local.isoformat(timespec="seconds"),
            "host_tz_env": os.environ.get("TZ"),
            "monotonic_uptime_s": round(time.monotonic(), 0),
        },
        "ntp": _ntp_status(),
        "hub": {
            **hub,
            "online": bool(getattr(getattr(fleet, "hub", None), "online", False)),
            "uptime_s": hub_vals.get("uptime"),
            "drift_s": drift,
            # hub_epoch minus the brain's own clock. The brain is NOT an absolute reference —
            # when the Pi itself is unsynced a correctly-synced hub shows as "drifted".
            "drift_basis": "hub_minus_brain",
            "reported_age_s": hub_age,
            "note": (
                "this firmware does not publish its clock — flash a build with the Hub Clock text sensor to see drift"
                if hub["epoch"] is None and hub["raw"] in (None, "")
                else "hub clock not synced yet"
                if hub["raw"] == "unsynced"
                else None
            ),
        },
        "photoperiod_note": f"Light windows run on the hub's own clock ({HUB_FIRMWARE_TZ}); the brain journals in {SYDNEY_TZ.key}.",
    }


def failover_info(now: float | None = None) -> dict[str, Any]:
    now = time.time() if now is None else now
    from .computed_ops import _manual_takeover_on

    o = get_override()
    fleet = get_fleet_state()
    since = float(getattr(o, "since_ts", 0.0) or 0.0)
    active = bool(getattr(o, "active", False))
    try:
        takeover: bool | None = bool(_manual_takeover_on(fleet, {}))
    except Exception:  # noqa: BLE001 — a half-built fleet must not break the card
        takeover = None
    return {
        "ttl_sec": DEFAULT_TTL_SEC,
        "active": active,
        "since": since or None,
        "remaining_s": max(0.0, round(since + DEFAULT_TTL_SEC - now, 0)) if active and since else None,
        "forced": dict(getattr(o, "forced", {}) or {}),
        "pending_reassert": bool(getattr(o, "pending_reassert", False)),
        "manual_takeover": takeover,
        "hub_online": bool(getattr(getattr(fleet, "hub", None), "online", False)),
    }


def routes_info(app: Any) -> dict[str, Any]:
    """Every route the running brain serves, plus the optional-route contract with served flags."""
    served: set[str] = set()
    rows: list[dict[str, Any]] = []
    for r in getattr(app, "routes", []):
        path = getattr(r, "path", None)
        if not path:
            continue
        methods = sorted(m for m in (getattr(r, "methods", None) or []) if m not in ("HEAD", "OPTIONS"))
        served.add(path)
        rows.append({"path": path, "methods": methods})
    rows.sort(key=lambda x: x["path"])
    optional = [{**o, "served": o["path"] in served} for o in OPTIONAL_ROUTES]
    return {"count": len(rows), "routes": rows, "optional": optional}
