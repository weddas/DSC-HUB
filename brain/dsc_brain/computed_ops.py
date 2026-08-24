"""Synthetic HA entities for Pi SPA — CFM, roster, runtime, efficacy."""

from __future__ import annotations

import datetime
import time
from typing import Any

from .compose_store import all_helpers, get_helper, get_roster_slots
from .hub_controls import HUB_FAN_ENTITY_TO_OID
from .settings import list_history, list_roster
from .dash_computed import emit_dash_entities

FAN_PCT_ENTITIES: dict[str, str] = {
    "sensor.dsc_fan_intake_main_pct": "fan.dsc_hub_4_inch_intake_fan_main",
    "sensor.dsc_fan_intake_2x4_pct": "fan.dsc_hub_4_inch_intake_fan_2x4",
    "sensor.dsc_fan_exhaust_room_pct": "fan.dsc_hub_6_inch_exhaust_room",
    "sensor.dsc_fan_exhaust_outside_pct": "fan.dsc_hub_6_inch_exhaust_outside",
}

CFM_SPECS: list[tuple[str, str, str, str]] = [
    ("sensor.dsc_cfm_exhaust_out", "sensor.dsc_fan_exhaust_outside_pct", "input_number.dsc_cfm_out_max", "dsc_cal_cfm_out"),
    ("sensor.dsc_cfm_exhaust_recirc", "sensor.dsc_fan_exhaust_room_pct", "input_number.dsc_cfm_recirc_max", "dsc_cal_cfm_recirc"),
    ("sensor.dsc_cfm_intake_main", "sensor.dsc_fan_intake_main_pct", "input_number.dsc_cfm_intake_main_max", "dsc_cal_cfm_intake_main"),
    ("sensor.dsc_cfm_intake_2x4", "sensor.dsc_fan_intake_2x4_pct", "input_number.dsc_cfm_intake_clone_max", "dsc_cal_cfm_intake_clone"),
]

RUNTIME_ENTITIES: dict[str, tuple[str, str]] = {
    "sensor.dsc_heater_runtime_today": ("hub", "switch_dsc_hub_heater_demand"),
    "sensor.dsc_humidifier_runtime_today": ("hub", "switch_dsc_hub_humidifier_demand"),
    "sensor.dsc_dehumidifier_runtime_today": ("hub", "switch_dsc_hub_dehumidifier_demand"),
    "sensor.dsc_ac_runtime_today": ("hub", "switch_dsc_hub_ac_demand"),
    "sensor.dsc_growmat_runtime_today": ("hub", "switch_dsc_hub_grow_mat_demand"),
}

DEMAND_TO_RELAY: dict[str, str] = {
    "switch.dsc_hub_heater_demand": "switch.dsc_heater_main_relay",
    "switch.dsc_hub_humidifier_demand": "switch.dsc_humidifier_main_relay",
    "switch.dsc_hub_grow_mat_demand": "switch.dsc_heatmat_main_relay",
}

VESSEL_OPTIONS = [
    "generic_fabric_25l",
    "generic_tall_pet_20l",
    "generic_fabric_20l",
    "airpot_20l",
    "felt_15l",
    "plastic_taper_15l",
]

SELECT_OPTIONS: dict[str, list[str]] = {
    "input_select.dsc_build_custom_slot": ["auto", "1", "2", "3", "4", "5"],
    "input_select.dsc_build_assign_pot": ["none", "1", "2", "3", "4"],
    "input_select.dsc_build_climate_pot": ["Fleet", "1", "2", "3", "4"],
    "input_select.dsc_build_vessel": VESSEL_OPTIONS,
    **{f"input_select.dsc_pot{n}_vessel": VESSEL_OPTIONS for n in range(1, 5)},
    **{f"input_select.dsc_pot{n}_tent": ["clone", "main", "unassigned"] for n in range(1, 5)},
}


def _pot_in_service(inventory: list[dict[str, Any]] | None, pot_n: int) -> bool:
    row = next((r for r in (inventory or []) if r.get("seat_id") == f"pot{pot_n}"), None)
    if row is not None:
        return bool(row.get("in_service"))
    return pot_n != 3


def _set_entity(
    states: dict[str, dict[str, Any]],
    eid: str,
    value: Any,
    *,
    available: bool = True,
    attributes: dict[str, Any] | None = None,
) -> None:
    st = "unavailable" if not available else _stringify(value)
    ent: dict[str, Any] = {"entity_id": eid, "state": st, "attributes": attributes or {}}
    states[eid] = ent


def _stringify(value: Any) -> str:
    if isinstance(value, bool):
        return "on" if value else "off"
    if value is None:
        return "unavailable"
    return str(value)


def _fan_pct_from_controls(controls: dict[str, Any], fan_entity: str) -> float:
    ctrl = controls.get(fan_entity)
    if not ctrl:
        return 0.0
    if ctrl.get("state") != "on":
        return 0.0
    pct = ctrl.get("percentage")
    if pct is None:
        return 0.0
    try:
        return float(pct)
    except (TypeError, ValueError):
        return 0.0


def _cfm_from_pct(pct: float, nameplate: float, cal_prefix: str, helpers: dict[str, Any]) -> tuple[float, str, str]:
    points: list[tuple[float, float]] = [(0.0, 0.0)]
    for step in (25, 50, 75, 100):
        key = f"input_number.{cal_prefix}_{step}"
        val = float(helpers.get(key, 0) or 0)
        if val > 0:
            points.append((float(step), val))
    measured = [v for _, v in points if v > 0]
    if len(measured) < 2:
        return round(pct / 100.0 * nameplate, 1), "linear", "capacity_proxy_nameplate"
    xs = [p[0] for p in points]
    ys = [p[1] for p in points]
    if pct <= xs[0]:
        return round(ys[0], 1), "curve", "measured_curve"
    if pct >= xs[-1]:
        return round(ys[-1], 1), "curve", "measured_curve"
    lo = 0
    for i in range(len(xs) - 1):
        if xs[i] <= pct <= xs[i + 1]:
            lo = i
            break
    x0, x1 = xs[lo], xs[lo + 1]
    y0, y1 = ys[lo], ys[lo + 1]
    if x1 == x0:
        return round(y0, 1), "curve", "measured_curve"
    val = y0 + (y1 - y0) * (pct - x0) / (x1 - x0)
    return round(val, 1), "curve", "measured_curve"


def _midnight_ts() -> float:
    now = datetime.datetime.now()
    midnight = now.replace(hour=0, minute=0, second=0, microsecond=0)
    return midnight.timestamp()


def _runtime_hours_today(seat_id: str, metric: str) -> float:
    rows = list_history(seat_id, metric, _midnight_ts(), limit=5000)
    if not rows:
        return 0.0
    if len(rows) == 1:
        return (rows[0]["value"] or 0.0) * (time.time() - rows[0]["ts"]) / 3600.0 if rows[0]["value"] else 0.0
    total_sec = 0.0
    for i in range(len(rows) - 1):
        v = rows[i]["value"] or 0.0
        if v > 0.5:
            total_sec += max(0.0, rows[i + 1]["ts"] - rows[i]["ts"])
    last = rows[-1]
    if (last["value"] or 0.0) > 0.5:
        total_sec += max(0.0, time.time() - last["ts"])
    return round(total_sec / 3600.0, 2)


def _control_state(states: dict[str, dict[str, Any]], eid: str) -> str | None:
    ent = states.get(eid)
    if not ent:
        return None
    st = ent.get("state")
    if st in (None, "unavailable", "unknown"):
        return None
    return str(st)


def _num_state(states: dict[str, dict[str, Any]], eid: str) -> float | None:
    st = _control_state(states, eid)
    if st is None:
        return None
    try:
        return float(st)
    except ValueError:
        return None


def build_computed_hass_states(
    fleet: Any,
    inventory: list[dict[str, Any]] | None = None,
) -> dict[str, dict[str, Any]]:
    """Emit HA-shaped computed entities for Pi compat layer."""
    states: dict[str, dict[str, Any]] = {}
    helpers = all_helpers()
    controls = (fleet.hub.values.get("controls") or {}) if fleet.hub else {}
    hub_live = bool(fleet.hub and fleet.hub.online)

    fan_pcts: dict[str, float] = {}
    for sensor_id, fan_entity in FAN_PCT_ENTITIES.items():
        pct = _fan_pct_from_controls(controls, fan_entity) if hub_live else 0.0
        fan_pcts[sensor_id] = pct
        _set_entity(states, sensor_id, pct, available=True, attributes={"unit_of_measurement": "%"})

    cfm_values: dict[str, float] = {}
    for cfm_id, pct_id, plate_id, cal_prefix in CFM_SPECS:
        pct = fan_pcts.get(pct_id, 0.0)
        plate = float(helpers.get(plate_id, 0) or 0)
        val, model, honesty = _cfm_from_pct(pct, plate, cal_prefix, helpers)
        cfm_values[cfm_id] = val
        _set_entity(
            states,
            cfm_id,
            val,
            available=True,
            attributes={"unit_of_measurement": "CFM", "model": model, "honesty": honesty},
        )

    inn = cfm_values.get("sensor.dsc_cfm_intake_main", 0.0) + cfm_values.get("sensor.dsc_cfm_intake_2x4", 0.0)
    po = fan_pcts.get("sensor.dsc_fan_exhaust_outside_pct", 0.0)
    pr = fan_pcts.get("sensor.dsc_fan_exhaust_room_pct", 0.0)
    fs = po + pr
    if fs >= 0.5:
        out_alloc = round(inn * po / fs, 1)
        recirc_alloc = round(inn * pr / fs, 1)
    else:
        out_alloc = 0.0
        recirc_alloc = 0.0
    _set_entity(
        states,
        "sensor.dsc_cfm_exhaust_out_allocated",
        out_alloc,
        available=True,
        attributes={
            "unit_of_measurement": "CFM",
            "model": "mass_balance_allocated",
            "honesty": "Sigma_intake_times_fan_pct_split",
            "companion_capacity": "sensor.dsc_cfm_exhaust_out",
        },
    )
    _set_entity(
        states,
        "sensor.dsc_cfm_exhaust_recirc_allocated",
        recirc_alloc,
        available=True,
        attributes={
            "unit_of_measurement": "CFM",
            "model": "mass_balance_allocated",
            "honesty": "Sigma_intake_times_fan_pct_split",
            "companion_capacity": "sensor.dsc_cfm_exhaust_recirc",
        },
    )

    for eid, val in helpers.items():
        domain = eid.split(".", 1)[0] if "." in eid else "sensor"
        if domain in ("input_text", "input_select", "input_number", "input_datetime", "text", "select"):
            attrs: dict[str, Any] | None = None
            if domain == "input_select":
                opts = SELECT_OPTIONS.get(eid)
                if opts:
                    attrs = {"options": opts}
            _set_entity(states, eid, val, available=True, attributes=attrs)
        elif domain == "input_boolean":
            _set_entity(states, eid, val, available=True)

    for runtime_id, (seat_id, metric) in RUNTIME_ENTITIES.items():
        hours = _runtime_hours_today(seat_id, metric)
        _set_entity(states, runtime_id, hours, available=True, attributes={"unit_of_measurement": "h"})

    slots = get_roster_slots()
    occupied = sum(1 for s in slots if s.get("status") not in ("empty", "", None, "unknown", "unavailable"))
    _set_entity(states, "sensor.dsc_plant_roster_summary", f"{occupied} occupied", attributes={"slots": slots})

    roster_rows = {r["seat_id"]: r for r in list_roster()}
    for pot_n in range(1, 5):
        seat_id = f"pot{pot_n}"
        row = roster_rows.get(seat_id, {})
        recipe = row.get("recipe") or {}
        strain_id = row.get("strain_id") or ""
        stage = row.get("stage") or "veg"
        plant_name = recipe.get("plant_name") or recipe.get("nickname") or ""
        strain_display = recipe.get("strain_display") or strain_id or ""
        tent = recipe.get("tent") or get_helper(f"input_select.dsc_pot{pot_n}_tent", "unassigned")
        growth_stage = recipe.get("growth_stage") or stage
        sprout = recipe.get("sprout_date") or ""
        _set_entity(states, f"text.dsc_pot{pot_n}_plant_name", plant_name)
        _set_entity(states, f"select.dsc_pot{pot_n}_growth_stage", growth_stage)
        _set_entity(states, f"input_select.dsc_pot{pot_n}_tent", tent, attributes={"options": SELECT_OPTIONS[f"input_select.dsc_pot{pot_n}_tent"]})
        _set_entity(states, f"sensor.dsc_pot{pot_n}_strain_display", strain_display)
        if sprout:
            _set_entity(states, f"datetime.dsc_pot{pot_n}_sprout_date", sprout[:10])
            try:
                sprout_dt = datetime.date.fromisoformat(sprout[:10])
                days = (datetime.date.today() - sprout_dt).days
                _set_entity(states, f"sensor.dsc_pot{pot_n}_days_since_sprout", max(0, days))
            except ValueError:
                pass
        if strain_id:
            want = resolve_want(strain_id=strain_id, stage=stage)
            bands = want.get("want") or {}
            if "temp_c" in bands:
                _set_entity(states, f"sensor.dsc_pot{pot_n}_want_temp_min", bands["temp_c"][0])
                _set_entity(states, f"sensor.dsc_pot{pot_n}_want_temp_max", bands["temp_c"][1])
            if "rh_pct" in bands:
                _set_entity(states, f"sensor.dsc_pot{pot_n}_want_rh_min", bands["rh_pct"][0])
                _set_entity(states, f"sensor.dsc_pot{pot_n}_want_rh_max", bands["rh_pct"][1])

    cal_active = get_helper("input_boolean.dsc_cal_active", "off") == "on"
    curve_count = sum(
        1
        for prefix in ("dsc_cal_cfm_out", "dsc_cal_cfm_recirc", "dsc_cal_cfm_intake_main", "dsc_cal_cfm_intake_clone")
        if sum(1 for p in (25, 50, 75, 100) if float(helpers.get(f"input_number.{prefix}_{p}", 0) or 0) > 0) >= 2
    )
    _set_entity(states, "sensor.dsc_cfm_curves_status", f"{curve_count}/4 curves")
    _set_entity(states, "sensor.dsc_learn_status", "idle" if not cal_active else "cal_active")
    _set_entity(states, "binary_sensor.dsc_learn_gate_open", get_helper("input_boolean.dsc_learn_gate_open", "off"))

    tent_t = fleet.hub.values.get("temp_c") if fleet.hub else None
    tent_rh = fleet.hub.values.get("rh_pct") if fleet.hub else None
    rh_max = float(helpers.get("number.dsc_hub_rh_target_max", helpers.get("input_number.dsc_hub_rh_target_max", 70)) or 70)
    target_t = float(helpers.get("number.dsc_hub_target_temp", helpers.get("input_number.dsc_hub_target_temp", 25)) or 25)

    hum_demand = _control_state(states, "switch.dsc_hub_humidifier_demand") == "on"
    hum_relay = _control_state(states, "switch.dsc_humidifier_main_relay") == "on"
    heat_demand = _control_state(states, "switch.dsc_hub_heater_demand") == "on"
    heat_relay = _control_state(states, "switch.dsc_heater_main_relay") == "on"
    mat_demand = _control_state(states, "switch.dsc_hub_grow_mat_demand") == "on"
    mat_relay = _control_state(states, "switch.dsc_heatmat_main_relay") == "on"
    out_pct = fan_pcts.get("sensor.dsc_fan_exhaust_outside_pct", 0.0)

    hum_runtime_h = _runtime_hours_today("hub", "switch_dsc_hub_humidifier_demand")
    heat_runtime_h = _runtime_hours_today("hub", "switch_dsc_hub_heater_demand")
    mat_runtime_h = _runtime_hours_today("hub", "switch_dsc_hub_grow_mat_demand")

    _set_entity(
        states,
        "binary_sensor.dsc_humidifier_ineffective_suspect",
        hum_demand and hum_relay and tent_rh is not None and float(tent_rh) >= (rh_max - 0.5) and hum_runtime_h * 3600 >= 600,
    )
    _set_entity(
        states,
        "binary_sensor.dsc_heater_ineffective_suspect",
        heat_demand
        and heat_relay
        and tent_t is not None
        and float(tent_t) >= (target_t + 0.3)
        and heat_runtime_h * 3600 >= 480,
    )

    any_pot = any(_pot_in_service(inventory, n) for n in range(1, 5))
    coldest = None
    for pot_id, seat in (fleet.pots or {}).items():
        st = seat.values.get("soil_temp_c")
        if st is not None:
            coldest = st if coldest is None else min(coldest, st)
    _set_entity(
        states,
        "binary_sensor.dsc_grow_mat_ineffective_suspect",
        any_pot and mat_demand and mat_relay and coldest is not None and float(coldest) < 19.5 and mat_runtime_h * 3600 >= 1800,
    )
    _set_entity(
        states,
        "binary_sensor.dsc_humidifier_vent_conflict",
        hum_demand and hum_relay and out_pct >= 30,
    )
    _set_entity(
        states,
        "binary_sensor.dsc_heater_vent_conflict",
        heat_demand and heat_relay and out_pct >= 25,
    )

    alert_count = sum(
        1
        for eid in (
            "binary_sensor.dsc_humidifier_ineffective_suspect",
            "binary_sensor.dsc_heater_ineffective_suspect",
            "binary_sensor.dsc_grow_mat_ineffective_suspect",
            "binary_sensor.dsc_humidifier_vent_conflict",
            "binary_sensor.dsc_heater_vent_conflict",
        )
        if _control_state(states, eid) == "on"
    )
    _set_entity(states, "sensor.dsc_active_alert_count", alert_count)

    emit_dash_entities(states, fleet, set_entity=_set_entity, inventory=inventory)

    dash_alerts = sum(
        1
        for eid in (
            "binary_sensor.dsc_hub_emergency_failsafe",
            "binary_sensor.dsc_hub_climate_sensor_fault",
            "binary_sensor.dsc_hub_aux_sensor_fault",
            "binary_sensor.dsc_hub_root_zone_sensor_fault",
            "binary_sensor.dsc_clone_dark_period_violation",
            "binary_sensor.dsc_clone_light_missing_in_window",
            "binary_sensor.dsc_hub_coherence_mismatch",
            "binary_sensor.dsc_nest_channel_split",
            "binary_sensor.dsc_humidifier_vent_conflict",
            "binary_sensor.dsc_heater_vent_conflict",
            "binary_sensor.dsc_humidifier_ineffective_suspect",
            "binary_sensor.dsc_heater_ineffective_suspect",
            "binary_sensor.dsc_grow_mat_ineffective_suspect",
        )
        if _control_state(states, eid) == "on"
    )
    _set_entity(states, "sensor.dsc_active_alert_count", dash_alerts)

    return states
