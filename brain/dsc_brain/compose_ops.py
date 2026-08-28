"""Native compose / script handlers for Pi (replaces HA scripts)."""

from __future__ import annotations

import datetime
from typing import Any

from .compose_store import (
    blend_snapshot_from_helpers,
    clear_build_helpers,
    find_roster_slot_for_strain,
    get_helper,
    next_empty_roster_slot,
    reset_cal_curve,
    set_cal_point,
    set_helper,
    update_roster_slot,
)
from .settings import delete_roster, list_roster, upsert_roster
from .stage_model import expected_stage, stage_family, tent_id

CAL_PREFIX_BY_SCRIPT: dict[str, str] = {
    "script.dsc_cal_reset_curve_out": "dsc_cal_cfm_out",
    "script.dsc_cal_reset_curve_recirc": "dsc_cal_cfm_recirc",
    "script.dsc_cal_reset_curve_intake_main": "dsc_cal_cfm_intake_main",
    "script.dsc_cal_reset_curve_intake_clone": "dsc_cal_cfm_intake_clone",
    "script.dsc_cal_reset_curve_sf1000": "dsc_cal_sf1000_ppfd",
}

CAL_STEPS = (25, 50, 75, 100)


def _strain_is_auto(strain_id: str) -> bool:
    if not strain_id:
        return False
    from .catalog import get_strain

    row = get_strain(strain_id)
    return bool(row and str(row.get("type") or "").lower() == "auto")


def derived_stage_for(sprout_date: str, strain_id: str = "") -> str:
    """Stage auto-derived from sprout date (empty when no date)."""
    if not sprout_date:
        return ""
    try:
        sprout_dt = datetime.date.fromisoformat(sprout_date[:10])
    except ValueError:
        return ""
    days = (datetime.date.today() - sprout_dt).days
    return expected_stage(days, auto=_strain_is_auto(strain_id))


def _pot_recipe_from_build() -> dict[str, Any]:
    strain = str(get_helper("input_text.dsc_build_strain", "")).strip()
    nickname = str(get_helper("input_text.dsc_build_nickname", "")).strip() or strain
    sprout = str(get_helper("input_datetime.dsc_build_sprout_date", ""))[:10]
    blend = blend_snapshot_from_helpers()
    recipe_note = str(get_helper("input_text.dsc_build_recipe_note", "")).strip()
    tent = tent_id(str(get_helper("input_select.dsc_build_tent", "4x8")))
    strain_id = strain.replace(" ", "_").lower()[:64]
    # growth_stage is derived from the sprout date, not hand-picked; fall back
    # to the veg family when no date is known.
    stage = derived_stage_for(sprout, strain_id) or "veg"
    return {
        "plant_name": nickname,
        "nickname": nickname,
        "strain_display": strain,
        "blend": blend,
        "recipe": recipe_note,
        "sprout_date": sprout,
        "growth_stage": stage,
        "tent": tent,
    }


def commit_to_roster() -> dict[str, Any]:
    strain = str(get_helper("input_text.dsc_build_strain", "")).strip()
    if not strain:
        raise ValueError("Strain is empty — pick or enter a strain first")
    nickname = str(get_helper("input_text.dsc_build_nickname", "")).strip() or strain
    # Re-committing the same plant updates its slot instead of duplicating it.
    slot_num = find_roster_slot_for_strain(strain, nickname)
    if slot_num <= 0:
        slot_num = next_empty_roster_slot()
    if slot_num <= 0:
        raise RuntimeError("Roster full — all eight slots occupied")
    assign_pot = str(get_helper("input_select.dsc_build_assign_pot", "none"))
    sprout = str(get_helper("input_datetime.dsc_build_sprout_date", ""))[:10]
    blend = blend_snapshot_from_helpers()
    recipe = str(get_helper("input_text.dsc_build_recipe_note", "")).strip()
    status = "active" if assign_pot in ("1", "2", "3", "4") else "stock"
    slot = update_roster_slot(
        slot_num,
        {
            "nickname": nickname,
            "strain": strain,
            "blend": blend,
            "recipe": recipe,
            "sprout": sprout,
            "tent": str(get_helper("input_select.dsc_build_tent", "4x8")),
            "pot": assign_pot if assign_pot in ("1", "2", "3", "4") else "none",
            "status": status,
        },
    )
    set_helper("input_text.dsc_build_blend_snapshot", blend)
    return {"slot": slot_num, "roster": slot}


def assign_to_pot(pot: str | None = None) -> dict[str, Any]:
    n = str(pot or get_helper("input_select.dsc_build_assign_pot", "")).strip()
    if n not in ("1", "2", "3", "4"):
        raise ValueError("Select a valid pot (1-4) before assigning")
    strain = str(get_helper("input_text.dsc_build_strain", "")).strip()
    if not strain:
        raise ValueError("Strain is empty — pick or enter a strain first")
    recipe = _pot_recipe_from_build()
    seat_id = f"pot{n}"
    upsert_roster(
        seat_id,
        {
            "strain_id": strain.replace(" ", "_").lower()[:64] or "generic_photoperiod",
            "stage": stage_family(recipe.get("growth_stage", "")) or "veg",
            "recipe": recipe,
        },
    )
    set_helper(f"text.dsc_pot{n}_plant_name", recipe["plant_name"])
    set_helper(f"select.dsc_pot{n}_growth_stage", recipe["growth_stage"])
    set_helper(f"input_select.dsc_pot{n}_tent", recipe["tent"])
    if recipe.get("sprout_date"):
        set_helper(f"datetime.dsc_pot{n}_sprout_date", recipe["sprout_date"])
    roster_slot = find_roster_slot_for_strain(strain, recipe["nickname"])
    if roster_slot > 0:
        update_roster_slot(roster_slot, {"pot": n, "status": "active"})
    return {"pot": n, "strain": strain, "roster_slot": roster_slot, "tent": recipe["tent"]}


def update_pot_recipe(pot_n: int, updates: dict[str, Any]) -> dict[str, Any]:
    """Persist post-creation edits (name/sprout/stage/tent) into the roster row."""
    seat_id = f"pot{pot_n}"
    rows = {r["seat_id"]: r for r in list_roster()}
    row = rows.get(seat_id)
    if not row:
        raise ValueError(f"No plant on pot {pot_n} — nothing to edit")
    recipe_patch: dict[str, Any] = {}
    patch: dict[str, Any] = {}
    if "plant_name" in updates:
        name = str(updates["plant_name"]).strip()
        recipe_patch["plant_name"] = name
        recipe_patch["nickname"] = name
        set_helper(f"text.dsc_pot{pot_n}_plant_name", name)
    if "sprout_date" in updates:
        sprout = str(updates["sprout_date"])[:10]
        recipe_patch["sprout_date"] = sprout
        set_helper(f"datetime.dsc_pot{pot_n}_sprout_date", sprout)
        # Sprout date changed → re-derive the stage instead of keeping a stale one.
        stage = derived_stage_for(sprout, str(row.get("strain_id") or ""))
        if stage:
            recipe_patch["growth_stage"] = stage
            patch["stage"] = stage_family(stage) or "veg"
            set_helper(f"select.dsc_pot{pot_n}_growth_stage", stage)
    if "growth_stage" in updates:
        stage = str(updates["growth_stage"]).strip()
        recipe_patch["growth_stage"] = stage
        patch["stage"] = stage_family(stage) or "veg"
        if stage:
            set_helper(f"select.dsc_pot{pot_n}_growth_stage", stage)
    if "tent" in updates:
        recipe_patch["tent"] = tent_id(str(updates["tent"]))
        set_helper(f"input_select.dsc_pot{pot_n}_tent", recipe_patch["tent"])
    if "strain_display" in updates:
        strain = str(updates["strain_display"]).strip()
        recipe_patch["strain_display"] = strain
        patch["strain_id"] = strain
    if "notes" in updates:
        recipe_patch["notes"] = str(updates["notes"])
    if "blend" in updates:
        recipe_patch["blend"] = str(updates["blend"])
    if not recipe_patch and not patch:
        return row
    patch["recipe"] = recipe_patch
    result = upsert_roster(seat_id, patch)
    # Mirror the visible fields onto the roster slot listing.
    recipe = result.get("recipe") or {}
    slot_num = find_roster_slot_for_strain(
        str(recipe.get("strain_display") or ""), str(recipe.get("nickname") or "")
    )
    if slot_num > 0:
        slot_patch: dict[str, Any] = {}
        if "plant_name" in updates:
            slot_patch["nickname"] = recipe.get("nickname", "")
        if "sprout_date" in updates:
            slot_patch["sprout"] = recipe.get("sprout_date", "")
        if "strain_display" in updates:
            slot_patch["strain"] = recipe.get("strain_display", "")
        if "notes" in updates:
            slot_patch["notes"] = recipe.get("notes", "")
        if "blend" in updates:
            slot_patch["blend"] = recipe.get("blend", "")
        if slot_patch:
            update_roster_slot(slot_num, slot_patch)
    return result


def retire_plant(pot: str | None = None) -> dict[str, Any]:
    """Remove a plant from its pot + roster and clear the pot helpers."""
    n = str(pot or get_helper("input_select.dsc_build_assign_pot", "")).strip()
    if n not in ("1", "2", "3", "4"):
        raise ValueError("Select a valid pot (1-4) to retire")
    seat_id = f"pot{n}"
    rows = {r["seat_id"]: r for r in list_roster()}
    row = rows.get(seat_id)
    recipe = (row or {}).get("recipe") or {}
    removed = delete_roster(seat_id)
    set_helper(f"text.dsc_pot{n}_plant_name", "")
    set_helper(f"select.dsc_pot{n}_growth_stage", "")
    set_helper(f"input_select.dsc_pot{n}_tent", "unassigned")
    set_helper(f"datetime.dsc_pot{n}_sprout_date", "")
    slot_num = find_roster_slot_for_strain(
        str(recipe.get("strain_display") or ""), str(recipe.get("nickname") or "")
    )
    if slot_num > 0:
        update_roster_slot(
            slot_num,
            {
                "status": "empty",
                "nickname": "",
                "strain": "",
                "blend": "",
                "recipe": "",
                "sprout": "",
                "pot": "none",
                "notes": "",
            },
        )
    clear_build_helpers()
    return {"pot": n, "removed": removed, "roster_slot": slot_num}


def commit_and_assign() -> dict[str, Any]:
    strain = str(get_helper("input_text.dsc_build_strain", "")).strip()
    nickname = str(get_helper("input_text.dsc_build_nickname", "")).strip() or strain
    if find_roster_slot_for_strain(strain, nickname) <= 0 and next_empty_roster_slot() <= 0:
        raise RuntimeError("Roster full — commit+assign did not seat a pot")
    commit = commit_to_roster()
    assign_pot = str(get_helper("input_select.dsc_build_assign_pot", "none"))
    result: dict[str, Any] = {"commit": commit}
    if assign_pot in ("1", "2", "3", "4"):
        result["assign"] = assign_to_pot(assign_pot)
    return result


def accept_mix() -> dict[str, Any]:
    tank_l = float(get_helper("input_number.dsc_mix_tank_liters", 20) or 20)
    strength = float(get_helper("input_number.dsc_mix_strength_pct", 100) or 100) / 100.0
    burned: list[dict[str, Any]] = []
    for slot in range(1, 9):
        name = str(get_helper(f"input_text.dsc_nutrient_{slot}_name", "")).strip()
        dose = float(get_helper(f"input_number.dsc_nutrient_{slot}_dose_ml_l", 0) or 0)
        inv = get_helper(f"input_boolean.dsc_nutrient_{slot}_in_inventory", "off") == "on"
        if not name or dose <= 0 or not inv:
            continue
        ml = dose * tank_l * strength
        stock = float(get_helper(f"input_number.dsc_nutrient_{slot}_stock_ml", 0) or 0)
        set_helper(f"input_number.dsc_nutrient_{slot}_stock_ml", max(0.0, stock - ml))
        burned.append({"slot": slot, "name": name, "ml": round(ml, 1)})
    set_helper("input_datetime.dsc_mix_last_accepted", datetime.date.today().isoformat())
    return {"burned": burned}


def apply_climate_want() -> dict[str, Any]:
    pot = str(get_helper("input_select.dsc_build_climate_pot", "Fleet"))
    if pot not in ("1", "2", "3", "4"):
        raise ValueError("Pick pot 1–4 on Climate apply pot before applying climate want")
    strain = str(get_helper("input_text.dsc_build_strain", "")).strip()
    from .want import resolve_want

    stage = "veg"
    row = next((r for r in list_roster() if r.get("seat_id") == f"pot{pot}"), None)
    if row:
        stage = str(row.get("stage") or "veg")
    want = resolve_want(strain_id=strain.replace(" ", "_").lower()[:64] or None, stage=stage)
    bands = want.get("want") or {}
    if "temp_c" in bands:
        lo, hi = bands["temp_c"]
        target = round((lo + hi) / 2.0, 1)
        set_helper("number.dsc_hub_target_temp", target)
    if "rh_pct" in bands:
        lo, hi = bands["rh_pct"]
        set_helper("number.dsc_hub_rh_target_min", lo)
        set_helper("number.dsc_hub_rh_target_max", hi)
    return {"pot": pot, "want": want}


def cal_start() -> dict[str, Any]:
    set_helper("input_boolean.dsc_cal_active", "on")
    set_helper("sensor.dsc_learn_activity", "cal_sampling")
    return {"active": True}


def cal_hold_next() -> dict[str, Any]:
    idx = int(float(get_helper("cal_step_index", 0) or 0))
    set_helper("cal_step_index", min(idx + 1, len(CAL_STEPS) - 1))
    return {"step_index": idx + 1}


def cal_save_point() -> dict[str, Any]:
    prefix = str(get_helper("cal_fan_prefix", "dsc_cal_cfm_out"))
    idx = int(float(get_helper("cal_step_index", 0) or 0))
    step_pct = CAL_STEPS[min(idx, len(CAL_STEPS) - 1)]
    cfm_key_map = {
        "dsc_cal_cfm_out": "sensor.dsc_cfm_exhaust_out",
        "dsc_cal_cfm_recirc": "sensor.dsc_cfm_exhaust_recirc",
        "dsc_cal_cfm_intake_main": "sensor.dsc_cfm_intake_main",
        "dsc_cal_cfm_intake_clone": "sensor.dsc_cfm_intake_2x4",
    }
    from .computed_ops import build_computed_hass_states
    from .fleet_state import get_fleet_state

    computed = build_computed_hass_states(get_fleet_state())
    cfm_entity = cfm_key_map.get(prefix, "sensor.dsc_cfm_exhaust_out")
    cfm_val = float(computed.get(cfm_entity, {}).get("state", 0) or 0)
    set_cal_point(prefix, step_pct, cfm_val)
    return {"prefix": prefix, "step_pct": step_pct, "cfm": cfm_val}


def cal_skip_point() -> dict[str, Any]:
    return cal_hold_next()


def cal_abort() -> dict[str, Any]:
    set_helper("input_boolean.dsc_cal_active", "off")
    set_helper("sensor.dsc_learn_activity", "idle")
    set_helper("cal_step_index", 0)
    return {"active": False}


def cal_finish() -> dict[str, Any]:
    set_helper("input_boolean.dsc_cal_active", "off")
    set_helper("sensor.dsc_learn_activity", "idle")
    set_helper("cal_step_index", 0)
    return {"active": False, "finished": True}


def _script_pot(data: dict[str, Any]) -> str | None:
    pot = data.get("pot")
    if pot not in (None, ""):
        return str(pot)
    variables = data.get("variables")
    if isinstance(variables, dict) and variables.get("pot") not in (None, ""):
        return str(variables.get("pot"))
    return None


def handle_script(entity_id: str, data: dict[str, Any] | None = None) -> dict[str, Any]:
    data = data or {}
    if entity_id == "script.dsc_build_plant_commit":
        return commit_to_roster()
    if entity_id == "script.dsc_build_plant_commit_and_assign":
        return commit_and_assign()
    if entity_id == "script.dsc_plant_assign_to_pot":
        return assign_to_pot(_script_pot(data))
    if entity_id == "script.dsc_plant_retire":
        return retire_plant(_script_pot(data))
    if entity_id == "script.dsc_accept_mix":
        return accept_mix()
    if entity_id == "script.dsc_apply_climate_want":
        return apply_climate_want()
    if entity_id == "script.dsc_cal_start":
        prefix = str(data.get("prefix") or get_helper("cal_fan_prefix", "dsc_cal_cfm_out"))
        set_helper("cal_fan_prefix", prefix)
        return cal_start()
    if entity_id == "script.dsc_cal_hold_next":
        return cal_hold_next()
    if entity_id == "script.dsc_cal_save_point":
        return cal_save_point()
    if entity_id == "script.dsc_cal_skip_point":
        return cal_skip_point()
    if entity_id == "script.dsc_cal_abort":
        return cal_abort()
    if entity_id == "script.dsc_cal_finish":
        return cal_finish()
    prefix = CAL_PREFIX_BY_SCRIPT.get(entity_id)
    if prefix:
        reset_cal_curve(prefix)
        return {"reset": prefix}
    raise ValueError(f"unsupported script {entity_id}")
