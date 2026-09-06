"""HA-shaped helper persistence for Pi (compose, roster slots, cal curves)."""

from __future__ import annotations

import json
import re
import time
from typing import Any

from .settings import get_all_settings, get_setting, set_setting

COMPOSE_KEY = "compose_helpers_json"
ROSTER_SLOTS_KEY = "plant_roster_slots_json"
ROSTER_SLOT_COUNT = 10
CAL_ACTIVE_KEY = "cal_active"
CAL_STEP_KEY = "cal_step_index"
CAL_FAN_KEY = "cal_fan_prefix"

DEFAULT_NAMEPLATES: dict[str, float] = {
    "input_number.dsc_cfm_out_max": 440.0,
    "input_number.dsc_cfm_recirc_max": 440.0,
    "input_number.dsc_cfm_intake_main_max": 200.0,
    "input_number.dsc_cfm_intake_clone_max": 200.0,
    "input_number.dsc_blend_total_l": 20.0,
    "input_number.dsc_mix_tank_liters": 20.0,
    "input_number.dsc_mix_strength_pct": 100.0,
}

DEFAULT_SELECTS: dict[str, str] = {
    "input_select.dsc_build_assign_pot": "none",
    "input_select.dsc_build_vessel": "generic_fabric_20l",
    "input_select.dsc_light_fixture": "",
    "input_select.dsc_build_custom_slot": "auto",
    "input_select.dsc_build_climate_pot": "Fleet",
    "input_select.dsc_build_tent": "4x8",
}

DEFAULT_TEXT: dict[str, str] = {
    "input_text.dsc_build_strain": "",
    "input_text.dsc_build_nickname": "",
    "input_text.dsc_build_recipe_note": "",
    # Empty default keeps the sprout-date field enabled on a fresh brain
    # (EntityDatetime disables itself when the entity does not exist).
    "input_datetime.dsc_build_sprout_date": "",
    "input_text.dsc_blend_component_1_name": "",
    "input_text.dsc_blend_component_2_name": "",
    "input_text.dsc_blend_component_3_name": "",
}

DEFAULT_BOOLEANS: dict[str, bool] = {
    "input_boolean.dsc_cal_active": False,
    "input_boolean.dsc_learn_gate_open": False,
}


def _load_helpers() -> dict[str, Any]:
    raw = get_setting(COMPOSE_KEY, "{}")
    try:
        data = json.loads(raw or "{}")
    except json.JSONDecodeError:
        data = {}
    if not isinstance(data, dict):
        data = {}
    changed = False
    for k, v in DEFAULT_NAMEPLATES.items():
        if k not in data:
            data[k] = v
            changed = True
    for k, v in DEFAULT_SELECTS.items():
        if k not in data:
            data[k] = v
            changed = True
    for k, v in DEFAULT_TEXT.items():
        if k not in data:
            data[k] = v
            changed = True
    for k, v in DEFAULT_BOOLEANS.items():
        if k not in data:
            data[k] = "on" if v else "off"
            changed = True
    if changed:
        _save_helpers(data)
    return data


def _save_helpers(data: dict[str, Any]) -> None:
    set_setting(COMPOSE_KEY, json.dumps(data))


def get_helper(entity_id: str, default: Any = "") -> Any:
    return _load_helpers().get(entity_id, default)


def clear_build_helpers() -> None:
    """Reset compose draft fields after retire (WF-P0-2 / REL-P0-1)."""
    for entity_id, default in DEFAULT_SELECTS.items():
        if entity_id.startswith("input_select.dsc_build_"):
            set_helper(entity_id, default)
    for entity_id, default in DEFAULT_TEXT.items():
        if entity_id.startswith(("input_text.dsc_build_", "input_datetime.dsc_build_")):
            set_helper(entity_id, default)
    set_helper("input_text.dsc_build_blend_snapshot", "")


def set_helper(entity_id: str, value: Any) -> None:
    data = _load_helpers()
    if entity_id.startswith("input_boolean."):
        if isinstance(value, bool):
            value = "on" if value else "off"
        elif str(value).lower() in ("true", "1", "yes"):
            value = "on"
        elif str(value).lower() in ("false", "0", "no"):
            value = "off"
    data[entity_id] = value
    _save_helpers(data)
    _mirror_plant_name_to_hub(entity_id, value)


_PROBE_PLANT_NAME_RE = re.compile(r"^text\.dsc_probe([1-4])_plant_name$")


def _mirror_plant_name_to_hub(entity_id: str, value: Any) -> None:
    """Replaces the retired `platform: homeassistant` ha_plant_{n} feed: when a
    probe plant name changes, push it to the hub's `set_plant_name` native-API
    action so the panel OLED tracks the roster. Best-effort, never raises."""
    m = _PROBE_PLANT_NAME_RE.match(entity_id or "")
    if not m:
        return
    try:
        from .hub_native import push_plant_name_bg

        push_plant_name_bg(int(m.group(1)), "" if value is None else str(value))
    except Exception:  # noqa: BLE001
        pass


def all_helpers() -> dict[str, Any]:
    return dict(_load_helpers())


def _empty_roster_slot(slot_num: int) -> dict[str, Any]:
    return {
        "slot": slot_num,
        "status": "empty",
        "nickname": "",
        "strain": "",
        "blend": "",
        "recipe": "",
        "sprout": "",
        "tent": "",
        "pot": "none",
        "seed_count": 0,
        "notes": "",
    }


def default_roster_slots() -> list[dict[str, Any]]:
    return [_empty_roster_slot(i) for i in range(1, ROSTER_SLOT_COUNT + 1)]


def get_roster_slots() -> list[dict[str, Any]]:
    raw = get_setting(ROSTER_SLOTS_KEY, "")
    if not raw:
        return default_roster_slots()
    try:
        slots = json.loads(raw)
    except json.JSONDecodeError:
        return default_roster_slots()
    if not isinstance(slots, list) or len(slots) < 1:
        return default_roster_slots()
    if len(slots) > ROSTER_SLOT_COUNT:
        return default_roster_slots()
    if len(slots) < ROSTER_SLOT_COUNT:
        by_num = {int(s.get("slot") or 0): s for s in slots if isinstance(s, dict)}
        slots = [by_num.get(i) or _empty_roster_slot(i) for i in range(1, ROSTER_SLOT_COUNT + 1)]
        save_roster_slots(slots)
    return slots


def save_roster_slots(slots: list[dict[str, Any]]) -> None:
    set_setting(ROSTER_SLOTS_KEY, json.dumps(slots))


def next_empty_roster_slot() -> int:
    for slot in get_roster_slots():
        if slot.get("status") in ("empty", "", "unknown", "unavailable", None):
            return int(slot.get("slot", 0))
    return 0


def update_roster_slot(slot_num: int, patch: dict[str, Any]) -> dict[str, Any]:
    slots = get_roster_slots()
    idx = slot_num - 1
    if idx < 0 or idx >= len(slots):
        raise ValueError(f"invalid roster slot {slot_num}")
    slots[idx].update(patch)
    slots[idx]["slot"] = slot_num
    save_roster_slots(slots)
    return slots[idx]


def find_roster_slot_for_strain(strain: str, nickname: str = "") -> int:
    strain = strain.strip()
    nickname = nickname.strip()
    for slot in get_roster_slots():
        rs = str(slot.get("strain", "")).strip()
        rn = str(slot.get("nickname", "")).strip()
        if strain and rs == strain:
            return int(slot["slot"])
        if nickname and rn == nickname:
            return int(slot["slot"])
    return 0


def blend_snapshot_from_helpers() -> str:
    parts: list[str] = []
    for n in (1, 2, 3):
        name = str(get_helper(f"input_text.dsc_blend_component_{n}_name", "")).strip()
        pct = float(get_helper(f"input_number.dsc_blend_pct_{n}", 0) or 0)
        if name and pct > 0:
            parts.append(f"{name} {pct:.0f}%")
    return " + ".join(parts)


def cal_point_entity(prefix: str, step_pct: int) -> str:
    return f"input_number.{prefix}_{step_pct}"


def set_cal_point(prefix: str, step_pct: int, cfm: float) -> None:
    set_helper(cal_point_entity(prefix, step_pct), cfm)


def get_cal_points(prefix: str) -> dict[int, float]:
    out: dict[int, float] = {}
    for pct in (25, 50, 75, 100):
        val = float(get_helper(cal_point_entity(prefix, pct), 0) or 0)
        if val > 0:
            out[pct] = val
    return out


def reset_cal_curve(prefix: str) -> None:
    for pct in (25, 50, 75, 100):
        set_helper(cal_point_entity(prefix, pct), 0)


def export_settings_snapshot() -> dict[str, Any]:
    return {
        "helpers": all_helpers(),
        "roster_slots": get_roster_slots(),
        "settings": get_all_settings(),
        "exported_at": time.time(),
    }
