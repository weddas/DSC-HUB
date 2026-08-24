"""HA-shaped helper persistence for Pi (compose, roster slots, cal curves)."""

from __future__ import annotations

import json
import time
from typing import Any

from .settings import get_all_settings, get_setting, set_setting

COMPOSE_KEY = "compose_helpers_json"
ROSTER_SLOTS_KEY = "plant_roster_slots_json"
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
}

DEFAULT_TEXT: dict[str, str] = {
    "input_text.dsc_build_strain": "",
    "input_text.dsc_build_nickname": "",
    "input_text.dsc_build_recipe_note": "",
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


def all_helpers() -> dict[str, Any]:
    return dict(_load_helpers())


def default_roster_slots() -> list[dict[str, Any]]:
    return [
        {
            "slot": i,
            "status": "empty",
            "nickname": "",
            "strain": "",
            "blend": "",
            "recipe": "",
            "sprout": "",
            "pot": "none",
            "seed_count": 0,
            "notes": "",
        }
        for i in range(1, 9)
    ]


def get_roster_slots() -> list[dict[str, Any]]:
    raw = get_setting(ROSTER_SLOTS_KEY, "")
    if not raw:
        return default_roster_slots()
    try:
        slots = json.loads(raw)
    except json.JSONDecodeError:
        return default_roster_slots()
    if not isinstance(slots, list) or len(slots) != 8:
        return default_roster_slots()
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
