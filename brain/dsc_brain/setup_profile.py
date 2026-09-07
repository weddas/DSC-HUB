"""Setup profile (plan-settings S4): one JSON of the brain-owned *grow* configuration —
global modifiers, stage presets, root steering targets, alert catalogue, automation
defaults, journal retention and the desired hub-tunable values — for a second device or
for sharing with the community.

Never carries network, inventory, credentials, cameras or media (the plan's privacy row):
those are the kit's own. The SPA adds its browser preferences to the same file.

Import is diff-first: ``apply_profile(profile, confirm=False)`` only reports what would
change; ``confirm=True`` applies through the same setters the Settings pages use, so every
change lands in the settings journal like an operator edit.
"""

from __future__ import annotations

import json
import time
from typing import Any

from . import __version__

PROFILE_VERSION = 1
SECTIONS = ("global_modifiers", "stage_rail", "root_steering_targets", "alert_prefs", "automation_defaults", "journal_retention", "hub_tunables")


def _num_eq(a: Any, b: Any) -> bool:
    """Value equality that treats 0 and 0.0 alike, recursively through dicts and lists
    (the JSON round trip drops the float marker, which must not read as a change)."""
    if isinstance(a, bool) or isinstance(b, bool):
        return a == b
    if isinstance(a, dict) and isinstance(b, dict):
        return a.keys() == b.keys() and all(_num_eq(a[k], b[k]) for k in a)
    if isinstance(a, (list, tuple)) and isinstance(b, (list, tuple)):
        return len(a) == len(b) and all(_num_eq(x, y) for x, y in zip(a, b))
    if isinstance(a, (int, float)) and isinstance(b, (int, float)):
        return abs(float(a) - float(b)) < 1e-9
    if a is None or b is None:
        return a is b
    try:
        return abs(float(a) - float(b)) < 1e-9
    except (TypeError, ValueError):
        return str(a) == str(b)


def export_profile(db_path=None) -> dict[str, Any]:
    from .alert_prefs import get_alert_prefs
    from .automation_defaults import get_automation_defaults
    from .global_modifiers import get_global_modifiers
    from .hub_tunables import list_tunables
    from .journal_storage import get_retention
    from .root_steering import _load_targets
    from .settings import get_setting
    from .stage_rail import STAGE_RAIL_FIELDS, list_stage_rail

    tunables = list_tunables(db_path)
    return {
        "kind": "dsc-hub-setup-profile",
        "version": PROFILE_VERSION,
        "exported_at": time.time(),
        "brain_version": __version__,
        "ap_ssid": get_setting("ap_ssid", ""),  # identifies the kit; never applied on import
        "sections": {
            "global_modifiers": get_global_modifiers(),
            "stage_rail": {r["stage"]: {k: r[k] for k in STAGE_RAIL_FIELDS} for r in list_stage_rail(db_path)},
            "root_steering_targets": _load_targets(),
            "alert_prefs": get_alert_prefs(),
            "automation_defaults": get_automation_defaults(),
            "journal_retention": get_retention(),
            # Only values the operator (or a preset) actually set — adopted-from-hub rows are
            # that hub's own truth and would be wrong on another kit.
            "hub_tunables": {
                r["entity_id"]: r["desired"]
                for r in tunables["rows"]
                if r.get("desired") is not None and r.get("source") not in (None, "", "hub", "adopt")
            },
        },
        "excluded": ["network", "inventory", "zigbee", "tuya", "cameras", "media", "credentials", "journals"],
    }


def _validate(profile: Any) -> dict[str, Any]:
    if not isinstance(profile, dict) or profile.get("kind") != "dsc-hub-setup-profile":
        raise ValueError("not a DSC-HUB setup profile (kind must be dsc-hub-setup-profile)")
    if int(profile.get("version", 0)) > PROFILE_VERSION:
        raise ValueError(f"profile version {profile.get('version')} is newer than this brain understands ({PROFILE_VERSION})")
    sections = profile.get("sections")
    if not isinstance(sections, dict):
        raise ValueError("profile has no sections")
    return sections


def diff_profile(profile: Any, db_path=None) -> dict[str, Any]:
    """What applying ``profile`` would change, per section, without touching anything."""
    from .stage_rail import STAGE_RAIL_FIELDS

    incoming = _validate(profile)
    current = export_profile(db_path)["sections"]
    out: dict[str, Any] = {}
    for sec in SECTIONS:
        inc = incoming.get(sec)
        if not isinstance(inc, dict):
            out[sec] = {"present": False, "changes": []}
            continue
        cur = current.get(sec) or {}
        changes: list[dict[str, Any]] = []
        if sec == "stage_rail":
            for stage, vals in inc.items():
                if not isinstance(vals, dict):
                    continue
                for k in STAGE_RAIL_FIELDS:
                    if k in vals and not _num_eq(vals[k], (cur.get(stage) or {}).get(k)):
                        changes.append({"key": f"{stage}.{k}", "from": (cur.get(stage) or {}).get(k), "to": vals[k]})
        elif sec == "alert_prefs":
            for eid, pref in (inc.get("alerts") or {}).items():
                if (cur.get("alerts") or {}).get(eid) != pref:
                    changes.append({"key": eid, "from": (cur.get("alerts") or {}).get(eid), "to": pref})
            if "quiet_hours" in inc and inc.get("quiet_hours") != cur.get("quiet_hours"):
                changes.append({"key": "quiet_hours", "from": cur.get("quiet_hours"), "to": inc.get("quiet_hours")})
        else:
            for k, v in inc.items():
                if not _num_eq(v, cur.get(k)) and (v is not None or cur.get(k) is not None):
                    changes.append({"key": k, "from": cur.get(k), "to": v})
        out[sec] = {"present": True, "changes": changes}
    out["total"] = sum(len(v["changes"]) for v in out.values() if isinstance(v, dict))
    return out


def apply_profile(profile: Any, *, confirm: bool = False, db_path=None) -> dict[str, Any]:
    """Diff, and on ``confirm`` apply section by section. Returns the diff plus per-section results."""
    diff = diff_profile(profile, db_path)
    if not confirm:
        return {"applied": False, "diff": diff}
    incoming = _validate(profile)
    results: dict[str, Any] = {}

    if diff["global_modifiers"]["changes"]:
        from .global_modifiers import set_global_modifiers
        from .settings_journal import journal_kv_patch

        before = {c["key"]: c["from"] for c in diff["global_modifiers"]["changes"]}
        patch = {c["key"]: c["to"] for c in diff["global_modifiers"]["changes"]}
        set_global_modifiers(patch)
        journal_kv_patch({f"global_modifiers.{k}": v for k, v in before.items()}, {f"global_modifiers.{k}": v for k, v in patch.items()}, source="profile")
        results["global_modifiers"] = len(patch)

    if diff["stage_rail"]["changes"]:
        from .stage_rail import patch_stage_rail

        per_stage: dict[str, dict[str, Any]] = {}
        for c in diff["stage_rail"]["changes"]:
            stage, key = c["key"].split(".", 1)
            per_stage.setdefault(stage, {})[key] = c["to"]
        for stage, patch in per_stage.items():
            patch_stage_rail(stage, patch, db_path)
        results["stage_rail"] = len(diff["stage_rail"]["changes"])

    if diff["root_steering_targets"]["changes"]:
        from .root_steering import DEFAULT_TARGETS, _load_targets
        from .settings import set_setting
        from .settings_journal import journal_setting_change

        current = _load_targets()
        for c in diff["root_steering_targets"]["changes"]:
            if c["key"] in DEFAULT_TARGETS:
                current[c["key"]] = float(c["to"])
                journal_setting_change(f"Root steering {c['key']}", c["from"], c["to"], domain="root", source="profile")
        set_setting("root_steering_targets", json.dumps(current))
        results["root_steering_targets"] = len(diff["root_steering_targets"]["changes"])

    if diff["alert_prefs"]["changes"]:
        from .alert_prefs import patch_alert_prefs

        sec = incoming["alert_prefs"]
        patch: dict[str, Any] = {"alerts": {c["key"]: c["to"] for c in diff["alert_prefs"]["changes"] if c["key"] != "quiet_hours"}}
        if any(c["key"] == "quiet_hours" for c in diff["alert_prefs"]["changes"]):
            patch["quiet_hours"] = sec.get("quiet_hours")
        patch_alert_prefs(patch)
        results["alert_prefs"] = len(diff["alert_prefs"]["changes"])

    if diff["automation_defaults"]["changes"]:
        from .automation_defaults import patch_automation_defaults

        patch_automation_defaults({c["key"]: c["to"] for c in diff["automation_defaults"]["changes"]})
        results["automation_defaults"] = len(diff["automation_defaults"]["changes"])

    if diff["journal_retention"]["changes"]:
        from .journal_storage import set_retention

        set_retention({c["key"]: c["to"] for c in diff["journal_retention"]["changes"]})
        results["journal_retention"] = len(diff["journal_retention"]["changes"])

    if diff["hub_tunables"]["changes"]:
        from .hub_tunables import set_desired

        applied = 0
        errors: list[str] = []
        for c in diff["hub_tunables"]["changes"]:
            try:
                set_desired(c["key"], c["to"], source="profile", db_path=db_path)
                applied += 1
            except ValueError as exc:
                errors.append(f"{c['key']}: {exc}")
        results["hub_tunables"] = applied
        if errors:
            results["hub_tunables_errors"] = errors

    from .settings_journal import journal_setting_change

    journal_setting_change("Setup profile imported", None, f"{diff['total']} change(s)", domain="profile", source="operator")
    return {"applied": True, "diff": diff, "results": results}
