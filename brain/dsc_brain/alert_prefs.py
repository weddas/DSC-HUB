"""Alert catalogue preferences (plan-settings S3): per-alert enabled + severity, and the
shared quiet hours. Stored as one JSON blob in the settings table so every browser sees
the same catalogue; the sound/toast choices are browser preferences on the SPA side.

The brain keeps computing every alert regardless — disabling only hides it on the desks.
Quiet hours never silence the emergency failsafe (the SPA enforces that exception).
"""

from __future__ import annotations

import json
import re
from typing import Any

from .settings import get_setting, set_setting

SETTING_KEY = "alert_prefs_json"
SEVERITIES = ("critical", "warn", "info")
_HHMM = re.compile(r"^([01]\d|2[0-3]):[0-5]\d$")

# Severity the SPA assumes when the operator has not chosen one. Ids match the SPA's
# alertPlaybook.ts. Anything not listed takes BASELINE_SEVERITY. Critical counts on the
# Overview mission line and sounds in critical-only mode; warn shows on the desks and the
# mission line's warn tier; info is listed on the Alerts desk only (configuration nags).
BASELINE_SEVERITY = "warn"
DEFAULT_SEVERITY: dict[str, str] = {
    "binary_sensor.dsc_hub_emergency_failsafe": "critical",
    "binary_sensor.dsc_hub_climate_sensor_fault": "critical",
    "binary_sensor.dsc_hub_root_zone_sensor_fault": "critical",
    "binary_sensor.dsc_clone_dark_period_violation": "critical",
    "binary_sensor.dsc_hub_light_catchup_active": "info",
    "binary_sensor.dsc_reduced_kit": "info",
    "binary_sensor.dsc_plant_specs_incomplete": "info",
    "binary_sensor.dsc_plant_specs_intake_over_exhaust": "info",
    "binary_sensor.dsc_plant_specs_ac_capacity_missing": "info",
    "binary_sensor.dsc_plant_specs_dehum_rate_zero": "info",
    "binary_sensor.dsc_plant_specs_hum_rate_zero": "info",
    "binary_sensor.dsc_plant_specs_heater_zero": "info",
}
FAILSAFE_ID = "binary_sensor.dsc_hub_emergency_failsafe"


def _empty() -> dict[str, Any]:
    return {"alerts": {}, "quiet_hours": None}


def get_alert_prefs() -> dict[str, Any]:
    raw = get_setting(SETTING_KEY, "")
    if not raw:
        return _empty()
    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        return _empty()
    if not isinstance(parsed, dict):
        return _empty()
    out = _empty()
    alerts = parsed.get("alerts")
    if isinstance(alerts, dict):
        for eid, pref in alerts.items():
            if not isinstance(pref, dict):
                continue
            row: dict[str, Any] = {}
            if "enabled" in pref:
                row["enabled"] = bool(pref["enabled"])
            if pref.get("severity") in SEVERITIES:
                row["severity"] = pref["severity"]
            if row:
                out["alerts"][str(eid)] = row
    qh = parsed.get("quiet_hours")
    if isinstance(qh, dict) and _HHMM.match(str(qh.get("start", ""))) and _HHMM.match(str(qh.get("end", ""))):
        out["quiet_hours"] = {"start": str(qh["start"]), "end": str(qh["end"])}
    return out


def patch_alert_prefs(patch: dict[str, Any]) -> dict[str, Any]:
    """Merge a patch: {"alerts": {id: {enabled?, severity?}}, "quiet_hours": {start,end} | null}."""
    current = get_alert_prefs()
    alerts = patch.get("alerts")
    if alerts is not None:
        if not isinstance(alerts, dict):
            raise ValueError("alerts must be an object keyed by entity id")
        for eid, pref in alerts.items():
            if pref is None:
                # null removes the override and the alert falls back to its catalogue default.
                # The map only ever grew before this; nothing written was removable.
                current["alerts"].pop(str(eid), None)
                continue
            if not isinstance(pref, dict):
                raise ValueError(f"{eid}: preference must be an object or null (remove)")
            row = dict(current["alerts"].get(str(eid), {}))
            if "enabled" in pref:
                if eid == FAILSAFE_ID and pref["enabled"] is False:
                    raise ValueError("the emergency failsafe alert cannot be disabled")
                row["enabled"] = bool(pref["enabled"])
            if "severity" in pref:
                if pref["severity"] not in SEVERITIES:
                    raise ValueError(f"{eid}: severity must be one of {', '.join(SEVERITIES)}")
                row["severity"] = pref["severity"]
            current["alerts"][str(eid)] = row
    if "quiet_hours" in patch:
        qh = patch["quiet_hours"]
        if qh is None:
            current["quiet_hours"] = None
        else:
            if not isinstance(qh, dict):
                raise ValueError("quiet_hours must be {start, end} or null")
            start, end = str(qh.get("start", "")), str(qh.get("end", ""))
            if not (_HHMM.match(start) and _HHMM.match(end)):
                raise ValueError("quiet_hours start/end must be HH:MM")
            if start == end:
                raise ValueError("quiet_hours start and end must differ")
            current["quiet_hours"] = {"start": start, "end": end}
    set_setting(SETTING_KEY, json.dumps(current, separators=(",", ":"), sort_keys=True))
    return current
