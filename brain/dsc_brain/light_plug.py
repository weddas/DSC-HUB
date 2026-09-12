"""Drive a tent lamp that lives on a bound smart plug from the hub's own window.

The 4x8 has no lamp the hub can switch. ``run_photoperiod`` in the hub firmware is a
clock and nothing else — by its own comment it "ONLY maintains lights_currently_on" —
and the GPIO5 twin output reserved for a 4x8 lamp has no PWM module wired. So the
tent's lamp sits on a Wi-Fi plug, running the plug vendor's schedule, which is outside
the system entirely: on 2026-09-12 it fired 33 minutes late and nothing here knew.

This module is the missing half. Each automation tick it mirrors the hub's own window
binary onto the bound plug, so the tent runs on the hub's clock instead of the vendor's.

Three things it deliberately does NOT do:

* **Guess.** When the hub is offline, its clock is invalid, or the operator has taken
  over, the desired state is *unknown* and nothing is commanded — the plug holds. A
  stale window read is not a reason to switch a lamp.
* **Spam.** It commands on a change of intent, and otherwise only re-asserts when the
  plug *reports* a state that disagrees with intent for longer than `REASSERT_S`. The
  comparison is against what the device reports, not against what we last sent — the
  appliance driver's bug (`control_ops.py:258`) was exactly that confusion.
* **Pretend to be a failsafe.** A Tuya plug keeps its last state when the brain dies,
  so a brain outage mid-photoperiod would leave the lamp ON. The operator is told to
  leave an OFF-only schedule on the plug itself as the backstop; `status()` reports
  whether that advice is outstanding so the SPA can keep saying it.

A plug is on/off only: there is no sunrise/sunset ramp and no debt ledger here. The
hub's ramp engine (`run_clone_photoperiod`) still owns the 2x4's dimmable SF1000.
"""

from __future__ import annotations

import logging
import time
from typing import Any

from .event_log import record_grow_log
from .fleet_state import FleetState, get_fleet_state

_logger = logging.getLogger(__name__)

# role id → (hub window binary, human label). The window binaries are the hub's own
# nominal photoperiod truth: "4x8 Window Open" is `lights_currently_on`, "2x4 Window
# Open" is the clone nominal window (catch-up deliberately excluded — see the firmware
# note "Nominal window export only").
LAMP_ROLES: dict[str, tuple[str, str]] = {
    "plug_light_4x8": ("binary_sensor.dsc_hub_4x8_window_open", "4×8"),
    "plug_light_2x4": ("binary_sensor.dsc_hub_2x4_window_open", "2×4"),
}

# A hub snapshot older than this is not a window reading, it is a memory.
HUB_STALE_S = 90.0

# How long a disagreement between intent and the plug's reported state is tolerated
# before re-asserting. Long enough that a slow Tuya push does not cause a write storm.
REASSERT_S = 300.0

# role → {"want": bool, "since": float, "device_id": str}
_commanded: dict[str, dict[str, Any]] = {}
# role → last reason string, for status() and for not re-logging the same hold
_reason: dict[str, str] = {}


def _hub_values(fleet: FleetState) -> tuple[dict[str, Any], dict[str, Any], dict[str, Any]]:
    values = dict(getattr(fleet.hub, "values", None) or {})
    binaries = dict(values.get("binaries") or {})
    controls = dict(values.get("controls") or {})
    return values, binaries, controls


def _switch_on(controls: dict[str, Any], entity_id: str) -> bool | None:
    ctrl = controls.get(entity_id)
    if not isinstance(ctrl, dict):
        return None
    state = str(ctrl.get("state") or "").strip().lower()
    if state in ("on", "true", "1"):
        return True
    if state in ("off", "false", "0"):
        return False
    return None


def desired_state(role: str, fleet: FleetState, *, now: float | None = None) -> tuple[bool | None, str]:
    """(want_on, reason). ``None`` means *hold* — we do not know, so we do not command."""
    now = time.time() if now is None else now
    window_key, _label = LAMP_ROLES[role]
    hub = fleet.hub

    if not getattr(hub, "online", False):
        return None, "hub offline — holding"
    last_seen = getattr(hub, "last_seen", None)
    if last_seen is None or (now - float(last_seen)) > HUB_STALE_S:
        age = "never" if last_seen is None else f"{now - float(last_seen):.0f}s old"
        return None, f"hub snapshot stale ({age}) — holding"

    _values, binaries, controls = _hub_values(fleet)

    if binaries.get("binary_sensor.dsc_hub_clock_valid") is False:
        return None, "hub clock invalid — holding"

    # The >35 C trip owns the light on the hub side; a plug lamp follows it off.
    if binaries.get("binary_sensor.dsc_hub_emergency_failsafe") is True:
        return False, "emergency failsafe — lamp off"

    if _switch_on(controls, "switch.dsc_hub_manual_takeover") is True:
        return None, "manual takeover — operator owns the lamp"

    # `lights_currently_on` is computed from the stage hours alone; unlike the clone
    # engine it does not consult Auto Photoperiod. Honour the switch here, or turning
    # auto off would stop the 2x4 lamp and leave this one running.
    if _switch_on(controls, "switch.dsc_hub_auto_photoperiod") is False:
        return None, "auto photoperiod off — holding"

    window = binaries.get(window_key)
    if window is None:
        return None, f"hub does not report {window_key} — holding"
    return bool(window), "following the hub window"


def _plug_reports(row: dict[str, Any]) -> bool | None:
    """What the plug says it is doing, or None when it has not said recently."""
    if str(row.get("link") or "") == "offline":
        return None
    state = row.get("state")
    if isinstance(state, bool):
        return state
    if isinstance(state, (int, float)):
        return bool(state)
    if isinstance(state, str):
        low = state.strip().lower()
        if low in ("on", "true", "1"):
            return True
        if low in ("off", "false", "0"):
            return False
    return None


def tick_lamp_plugs(fleet: FleetState | None = None, *, now: float | None = None) -> dict[str, Any]:
    """Mirror each hub window onto its bound lamp plug. Safe to call every tick."""
    from .tuya_local import set_tuya_state, tuya_role_rows

    now = time.time() if now is None else now
    fleet = get_fleet_state() if fleet is None else fleet
    try:
        rows = tuya_role_rows()
    except Exception as exc:  # noqa: BLE001
        _logger.warning("lamp plug tick: could not read Tuya role rows: %s", exc)
        return {"acted": [], "held": []}

    acted: list[dict[str, Any]] = []
    held: list[dict[str, Any]] = []

    for role, (_window_key, label) in LAMP_ROLES.items():
        row = rows.get(role)
        if not row:
            _commanded.pop(role, None)
            _reason.pop(role, None)
            continue
        device_id = str(row.get("device_id") or "")
        if not device_id:
            continue

        want, reason = desired_state(role, fleet, now=now)
        _reason[role] = reason
        if want is None:
            held.append({"role": role, "device_id": device_id, "reason": reason})
            continue

        prev = _commanded.get(role)
        intent_changed = prev is None or bool(prev.get("want")) != want or str(prev.get("device_id")) != device_id
        reports = _plug_reports(row)
        drifted = (
            not intent_changed
            and reports is not None
            and reports is not want
            and prev is not None
            and (now - float(prev.get("since") or now)) >= REASSERT_S
        )

        if not intent_changed and not drifted:
            continue

        result = set_tuya_state(device_id, want)
        ok = bool(result.get("ok", True)) and not result.get("error")
        _commanded[role] = {"want": want, "since": now, "device_id": device_id}
        acted.append(
            {
                "role": role,
                "device_id": device_id,
                "want": want,
                "ok": ok,
                "why": "drift" if drifted else "window",
                "error": result.get("error"),
            }
        )
        if intent_changed and prev is not None:
            record_grow_log(f"{label} lamp {'on' if want else 'off'} — following the hub photoperiod window")
        elif drifted:
            _logger.info("lamp plug %s re-asserted %s (plug reported %s)", role, want, reports)
        if not ok:
            _logger.warning("lamp plug %s write failed: %s", role, result.get("error"))

    return {"acted": acted, "held": held}


def status() -> dict[str, Any]:
    """Per-role view for the SPA: what is bound, what we intend, and the backstop nag."""
    from .tuya_local import tuya_role_rows

    try:
        rows = tuya_role_rows()
    except Exception:  # noqa: BLE001
        rows = {}
    fleet = get_fleet_state()
    out: list[dict[str, Any]] = []
    for role, (window_key, label) in LAMP_ROLES.items():
        row = rows.get(role)
        if not row:
            out.append({"role": role, "label": label, "bound": False})
            continue
        want, reason = desired_state(role, fleet)
        out.append(
            {
                "role": role,
                "label": label,
                "bound": True,
                "device_id": row.get("device_id"),
                "friendly_name": row.get("friendly_name"),
                "lane": row.get("lane"),
                "link": row.get("link"),
                "window_entity": window_key,
                "want": want,
                "reason": reason,
                "plug_reports": _plug_reports(row),
                "commanded": (_commanded.get(role) or {}).get("want"),
                # A plug holds its last state when the brain stops, so the lamp can be
                # stranded ON through a dark period. The plug's own OFF-only schedule is
                # the only thing that covers that, and we cannot see it from here.
                "needs_vendor_off_backstop": True,
            }
        )
    return {"lamps": out, "hub_stale_after_s": HUB_STALE_S, "reassert_after_s": REASSERT_S}


def reset_state() -> None:
    """Drop remembered intent — tests, and after a binding change."""
    _commanded.clear()
    _reason.clear()
