"""Synthetic HA entities for Pi SPA — CFM, roster, runtime, efficacy."""

from __future__ import annotations

import datetime
import json
import logging
import time
from dataclasses import dataclass
from typing import Any
from zoneinfo import ZoneInfo

from .compose_ops import _strain_is_auto, update_pot_recipe
from .compose_store import all_helpers, get_helper, get_roster_slots
from .dash_computed import emit_dash_entities
from .decision_loop import decision_tick
from .device_calibration import get_calibration, last_calibrated_at
from .event_log import record_grow_log
from .global_modifiers import scale_fan_demand_pct, scale_light_brightness_pct
from .hub_failover import emit_override_entity, evaluate_failover, get_override
from .light_loop import build_light_loop, emit_light_loop
from .light_loop import _FLOWER_STAGES, _VEG_STAGES
from .runtime_history import HistoryMemo, RuntimeMemo, midnight_ts
from .settings import list_roster
from .stage_model import expected_stage, stage_family, stage_rank, tent_id
from .want import resolve_want

_logger = logging.getLogger(__name__)

SYDNEY_TZ = ZoneInfo("Australia/Sydney")
_HOT_CACHE: dict[str, Any] = {"ts": 0.0, "key": None, "states": {}}
_COLD_CACHE: dict[str, Any] = {"ts": 0.0, "key": None, "states": {}}
_HOT_TTL_SEC = 2.0
_COLD_TTL_SEC = 45.0

# ---- The fans, as instances -----------------------------------------------------------
# A fan used to be a NAME, restated in six parallel four-entry literals: FAN_PCT_ENTITIES,
# CFM_SPECS, _CAL_PREFIX_PLATE, CAL_PREFIX_DEVICE, FAN_CAL_TARGETS, and the duct maps in
# compose_ops. Adding a fifth fan meant editing all six in step, and every one of them was
# an opportunity to pair the wrong duty with the wrong duct.
#
# A fan is now one row that says everything about itself. The literals below are kept as
# PROJECTIONS of this list — callers that want a dict still get one — so nothing outside
# this module had to change, but there is exactly one place to add a fan.
#
# plan-spatial-layout-2026-09-10.md S1/S2. The next step is loading these rows from
# space_device instead of declaring them here; the shape is chosen to make that a swap.


@dataclass(frozen=True)
class FanInstance:
    """One physical fan: how it is driven, rated, calibrated, and ducted."""

    key: str
    label: str
    #: "intake" pushes air in, "exhaust" pulls it out. Decides which total it joins.
    side: str
    #: The tent it moves air for.
    space_id: str
    #: Hub entity that carries its duty.
    fan_entity: str
    #: Computed percent sensor published for it.
    pct_id: str
    #: Computed CFM sensor published for it.
    cfm_id: str
    #: Helper holding its rated free-air capacity.
    plate_id: str
    #: Prefix for its stored calibration curve, and its device_calibration id.
    cal_prefix: str
    #: Helper holding its duct diameter, and the built-in default when unset.
    duct_entity: str
    duct_default_cm: float


_FANS: tuple[FanInstance, ...] = (
    FanInstance(
        key="out",
        label="OUT exhaust",
        side="exhaust",
        space_id="4x8",
        fan_entity="fan.dsc_hub_6_inch_exhaust_outside",
        pct_id="sensor.dsc_fan_exhaust_outside_pct",
        cfm_id="sensor.dsc_cfm_exhaust_out",
        plate_id="input_number.dsc_cfm_out_max",
        cal_prefix="dsc_cal_cfm_out",
        duct_entity="input_number.dsc_duct_out_cm",
        duct_default_cm=15.0,
    ),
    FanInstance(
        key="recirc",
        label="RECIRC",
        side="exhaust",
        space_id="4x8",
        fan_entity="fan.dsc_hub_6_inch_exhaust_room",
        pct_id="sensor.dsc_fan_exhaust_room_pct",
        cfm_id="sensor.dsc_cfm_exhaust_recirc",
        plate_id="input_number.dsc_cfm_recirc_max",
        cal_prefix="dsc_cal_cfm_recirc",
        duct_entity="input_number.dsc_duct_recirc_cm",
        duct_default_cm=15.0,
    ),
    FanInstance(
        key="intake_main",
        label="Intake 4x8",
        side="intake",
        space_id="4x8",
        fan_entity="fan.dsc_hub_4_inch_intake_fan_main",
        pct_id="sensor.dsc_fan_intake_main_pct",
        cfm_id="sensor.dsc_cfm_intake_main",
        plate_id="input_number.dsc_cfm_intake_main_max",
        cal_prefix="dsc_cal_cfm_intake_main",
        duct_entity="input_number.dsc_duct_intake_main_cm",
        duct_default_cm=10.0,
    ),
    FanInstance(
        key="intake_clone",
        label="Intake 2x4",
        side="intake",
        space_id="2x4",
        fan_entity="fan.dsc_hub_4_inch_intake_fan_2x4",
        pct_id="sensor.dsc_fan_intake_2x4_pct",
        cfm_id="sensor.dsc_cfm_intake_2x4",
        plate_id="input_number.dsc_cfm_intake_clone_max",
        cal_prefix="dsc_cal_cfm_intake_clone",
        duct_entity="input_number.dsc_duct_intake_clone_cm",
        duct_default_cm=10.0,
    ),
)


def fan_instances(space_id: str | None = None) -> list[FanInstance]:
    """Every fan, or every fan in one space."""
    if space_id is None:
        return list(_FANS)
    return [f for f in _FANS if f.space_id == space_id]


def fan_by_cal_prefix(cal_prefix: str) -> FanInstance | None:
    return next((f for f in _FANS if f.cal_prefix == cal_prefix), None)


# ---- Projections of the registry, for callers that still want the old shapes -----------
# Iterated once, to publish one independent entity per fan — order carries no meaning.
FAN_PCT_ENTITIES: dict[str, str] = {f.pct_id: f.fan_entity for f in _FANS}

CFM_SPECS: list[tuple[str, str, str, str]] = [
    (f.cfm_id, f.pct_id, f.plate_id, f.cal_prefix) for f in _FANS
]

# nameplate helper -> calibration prefix, so a curve is always judged against its own fan.
_CAL_PREFIX_PLATE: dict[str, str] = {f.plate_id: f.cal_prefix for f in _FANS}

CAL_PREFIX_DEVICE: dict[str, str] = {f.cal_prefix: f.cal_prefix for f in _FANS}

LIGHT_OFF_LUX = 5.0
LIGHT_OFF_PAR = 10.0
NP_INTake_MARGIN = 1.02

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

GROWTH_STAGE_OPTIONS = [
    "Germination",
    "Seedling",
    "Early Vegetative",
    "Vegetative",
    "Late (Push) Vegetative",
    "Early Flowering",
    "Flowering",
    "Late Flowering",
    "Final 48-72h Flowering",
]

SELECT_OPTIONS: dict[str, list[str]] = {
    "input_select.dsc_build_custom_slot": ["auto", "1", "2", "3", "4", "5"],
    "input_select.dsc_build_assign_pot": ["none", "1", "2", "3", "4"],
    "input_select.dsc_build_climate_pot": ["Fleet", "1", "2", "3", "4"],
    "input_select.dsc_build_tent": ["4x8", "2x4"],
    "input_select.dsc_build_vessel": VESSEL_OPTIONS,
    **{f"input_select.dsc_probe{n}_vessel": VESSEL_OPTIONS for n in range(1, 5)},
    **{f"input_select.dsc_probe{n}_tent": ["clone", "main", "unassigned"] for n in range(1, 5)},
}

def _pot_in_service(inventory: list[dict[str, Any]] | None, pot_n: int) -> bool:
    row = next((r for r in (inventory or []) if r.get("seat_id") == f"pot{pot_n}"), None)
    if row is not None:
        return bool(row.get("in_service"))
    return False


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


def _cal_points_from_storage(cal_prefix: str, helpers: dict[str, Any]) -> list[tuple[float, float]]:
    """Prefer device_calibration rows, then compose helper curves."""
    device_id = CAL_PREFIX_DEVICE.get(cal_prefix, cal_prefix)
    stored = get_calibration(device_id, "fan_cfm")
    points: list[tuple[float, float]] = [(0.0, 0.0)]
    if stored:
        for row in stored:
            try:
                step = float(row["step_key"])
                val = float(row["measured_value"])
            except (TypeError, ValueError):
                continue
            if val > 0:
                points.append((step, val))
    else:
        for step in (25, 50, 75, 100):
            key = f"input_number.{cal_prefix}_{step}"
            val = float(helpers.get(key, 0) or 0)
            if val > 0:
                points.append((float(step), val))
    points.sort(key=lambda p: p[0])
    return points


def _cal_points_memoized(
    cal_prefix: str,
    helpers: dict[str, Any],
    memo: dict[str, list[tuple[float, float]]],
) -> list[tuple[float, float]]:
    cached = memo.get(cal_prefix)
    if cached is not None:
        return cached
    points = _cal_points_from_storage(cal_prefix, helpers)
    memo[cal_prefix] = points
    return points


# A stored calibration only earns `measured_curve` if it behaves like one. Two non-zero
# numbers used to be the whole gate, so a probe that returned 14.3 at every duty step was
# "measured", interpolated to a horizontal line, and drove a -200 CFM under-pressure alarm.
_CURVE_MIN_SPAN_FRAC = 0.10  # top-to-bottom spread must be >=10 % of the top reading
_CURVE_NOISE_FRAC = 0.05  # a step may dip this much (of the top reading) and still count

# ...and it has to be in the same units as the fan it describes. Varying is not enough:
# the live 2x4 intake curve read 5.0/7.5/8.0/9.0 against a 200 CFM nameplate — a clean
# monotonic rise, 4.5 % of the fan's rating, almost certainly an anemometer's m/s rather
# than CFM. It passed the span gate, was stamped `measured_curve`, and became the intake
# side of `flow_net_pressure_cfm` while the exhaust side used nameplate proxy: 5.9 CFM in
# vs 224.4 CFM out, a -218.5 CFM "under-pressure" that no tent could actually be in. A
# curve that disagrees with the nameplate by an order of magnitude is a unit error, not a
# measurement, and the nameplate proxy is the more honest answer.
_CURVE_MIN_PLATE_FRAC = 0.25  # top point >=25 % of nameplate (ducting/filter derate is real)
_CURVE_MAX_PLATE_FRAC = 1.5  # ...and no more than 1.5x it; a fan cannot beat its rating


def _curve_points_usable(points: list[tuple[float, float]], nameplate: float = 0.0) -> bool:
    """True when >=2 positive points that vary with duty, never fall as duty rises, and —
    when a nameplate is known — sit in a plausible band around it."""
    live = [(x, y) for x, y in points if y > 0]
    if len(live) < 2:
        return False
    top = max(y for _, y in live)
    if top - min(y for _, y in live) < _CURVE_MIN_SPAN_FRAC * top:
        return False
    for (_x0, y0), (_x1, y1) in zip(live, live[1:]):
        if y1 < y0 - _CURVE_NOISE_FRAC * top:
            return False
    if nameplate > 0 and not (_CURVE_MIN_PLATE_FRAC * nameplate <= top <= _CURVE_MAX_PLATE_FRAC * nameplate):
        return False
    return True


def _proxy_reason(points: list[tuple[float, float]], nameplate: float) -> str:
    """Why the nameplate proxy is being used — the operator has to be able to act on it."""
    live = [(x, y) for x, y in points if y > 0]
    if len(live) < 2:
        return "capacity_proxy_nameplate"
    top = max(y for _, y in live)
    if top - min(y for _, y in live) < _CURVE_MIN_SPAN_FRAC * top:
        return "capacity_proxy_nameplate_flat_calibration"
    if nameplate > 0 and not (_CURVE_MIN_PLATE_FRAC * nameplate <= top <= _CURVE_MAX_PLATE_FRAC * nameplate):
        return "capacity_proxy_nameplate_calibration_implausible_vs_nameplate"
    return "capacity_proxy_nameplate_calibration_not_monotonic"


def _cfm_from_pct_memoized(
    pct: float,
    nameplate: float,
    cal_prefix: str,
    helpers: dict[str, Any],
    memo: dict[str, list[tuple[float, float]]],
) -> tuple[float, str, str]:
    points = _cal_points_memoized(cal_prefix, helpers, memo)
    if not _curve_points_usable(points, nameplate):
        return round(pct / 100.0 * nameplate, 1), "linear", _proxy_reason(points, nameplate)
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


# The ducts, in the order the Calibrate desk shows them — a projection of the registry.
FAN_CAL_TARGETS: list[tuple[str, str]] = [(f.cal_prefix, f.label) for f in _FANS]

_PROXY_REASON_TEXT: dict[str, str] = {
    "capacity_proxy_nameplate": "No calibration stored — using the fan's rated capacity.",
    "capacity_proxy_nameplate_flat_calibration": (
        "Every duty step measured the same value, so the curve is a flat line and cannot "
        "describe a fan. Using the rated capacity instead."
    ),
    "capacity_proxy_nameplate_calibration_implausible_vs_nameplate": (
        "The measured points are an order of magnitude away from the fan's rating — almost "
        "always a unit mix-up (m/s stored where CFM was expected). Using the rated capacity."
    ),
    "capacity_proxy_nameplate_calibration_not_monotonic": (
        "Airflow falls as the fan speeds up, which no fan does. Using the rated capacity."
    ),
}


def fan_calibration_summary() -> list[dict[str, Any]]:
    """Per-duct: is there a calibration, when, what was measured, and is it actually used?

    The last question is the one the Calibrate desk could not answer. A stored calibration
    that the curve gate rejects is invisible: the fan silently falls back to its nameplate
    and the screen still says "calibrated". Every field here is read through the same
    helpers the live computation uses, so the desk cannot disagree with the airflow numbers.
    """
    # Deferred: compose_ops imports device_calibration, which this module also uses.
    from .compose_ops import cal_duct_cm

    helpers = all_helpers()
    memo: dict[str, list[tuple[float, float]]] = {}
    plate_for = {prefix: plate_id for plate_id, prefix in _CAL_PREFIX_PLATE.items()}
    out: list[dict[str, Any]] = []

    for fan in fan_instances():
        prefix, label = fan.cal_prefix, fan.label
        device_id = CAL_PREFIX_DEVICE.get(prefix, prefix)
        plate_id = plate_for.get(prefix, "")
        nameplate = float(helpers.get(plate_id, 0) or 0)

        rows = get_calibration(device_id, "fan_cfm")
        source = "device_calibration" if rows else None
        steps: list[dict[str, Any]] = []
        units: set[str] = set()
        if rows:
            for row in rows:
                steps.append(
                    {
                        "step_pct": row["step_key"],
                        "measured_value": row["measured_value"],
                        "unit": row["unit"] or "",
                        "created_at": row["created_at"],
                    }
                )
                if row["unit"]:
                    units.add(row["unit"])
        else:
            # Older captures live only in the compose helpers; they carry no timestamp.
            for step in (25, 50, 75, 100):
                val = float(helpers.get(f"input_number.{prefix}_{step}", 0) or 0)
                if val > 0:
                    steps.append(
                        {"step_pct": str(step), "measured_value": val, "unit": "", "created_at": None}
                    )
            if steps:
                source = "compose_helpers"

        points = _cal_points_memoized(prefix, helpers, memo)
        in_use = _curve_points_usable(points, nameplate)
        reason_key = "" if in_use else _proxy_reason(points, nameplate)
        measured_top = max((p[1] for p in points if p[1] > 0), default=0.0)

        out.append(
            {
                "device_id": device_id,
                "cal_prefix": prefix,
                "label": label,
                "calibrated": bool(steps),
                "source": source,
                "last_calibrated_at": last_calibrated_at(device_id, "fan_cfm"),
                "steps": steps,
                # The unit the capture was stored under. The curve is consumed as CFM, so
                # anything else here is the bug, not a preference.
                "stored_unit": sorted(units)[0] if len(units) == 1 else ("mixed" if units else ""),
                "nameplate_cfm": nameplate,
                # The anemometer reads m/s; this is what turns it into airflow. Shown so a
                # wrong duct size is visible rather than silently scaling every point.
                "duct_cm": cal_duct_cm(prefix),
                "duct_entity": fan.duct_entity if fan else "",
                "measured_top": round(measured_top, 2),
                "pct_of_nameplate": round(100.0 * measured_top / nameplate, 1) if nameplate > 0 else None,
                "in_use": in_use,
                "basis": "measured_curve" if in_use else _proxy_reason(points, nameplate),
                "why_not": _PROXY_REASON_TEXT.get(reason_key, "") if reason_key else "",
            }
        )
    return out


def _capacity_honesty(
    states: dict[str, dict[str, Any]],
    cfm_values: dict[str, float],
    eids: tuple[str, ...],
) -> tuple[str, int]:
    """(honesty label, nameplate share %) for a sum of per-fan capacities."""
    total = 0.0
    proxy = 0.0
    for eid in eids:
        val = float(cfm_values.get(eid, 0.0) or 0.0)
        hon = str(((states.get(eid) or {}).get("attributes") or {}).get("honesty") or "")
        total += val
        if hon.startswith("capacity_proxy"):
            proxy += val
    if total <= 0.0:
        return "no_capacity", 0
    share = int(round(100.0 * proxy / total))
    if share <= 0:
        return "measured_curve", 0
    if share >= 100:
        return "capacity_proxy_nameplate", 100
    return f"mixed_{share}pct_nameplate_proxy", share


# Flags that must not flap: each holds its raw condition for on_after_s before turning on
# and off_after_s before turning off. heater_temp_oos_latch was a latch in name only —
# recomputed every tick, it toggled 70 times in 48 h — and its "runtime" gate used the
# cumulative hours today, so after 8 minutes of heating it was permanently satisfied.
_FLAG_STATE: dict[str, dict[str, Any]] = {}


def _held_flag(eid: str, raw: bool, *, on_after_s: float, off_after_s: float, now: float | None = None) -> bool:
    now = time.time() if now is None else now
    st = _FLAG_STATE.setdefault(eid, {"on": False, "since": None})
    if bool(raw) != bool(st["on"]):
        if st["since"] is None:
            st["since"] = now
        if now - float(st["since"]) >= (on_after_s if raw else off_after_s):
            st["on"] = bool(raw)
            st["since"] = None
    else:
        st["since"] = None
    return bool(st["on"])


def _stage_phase(stage: str) -> str | None:
    st = (stage or "").strip()
    if not st or st in ("—", "unknown"):
        return None
    if st in _VEG_STAGES:
        return "veg"
    if st in _FLOWER_STAGES:
        return "flower"
    return "other"


def _stage_disagreement(hub_stage: str, plant_stage: str) -> tuple[bool, dict[str, Any]]:
    """Two stage vocabularies coexist with no reconciliation: the hub's grow_stage select
    (drives its ladders) and the plants' expected stage (drives the VPD band). Overview
    showed one, Climate the other. ON only when they land in different PHASES (veg vs
    flower) — Early Flowering vs Flowering is the same phase and only worth a label."""
    hp, pp = _stage_phase(hub_stage), _stage_phase(plant_stage)
    differ = bool(hub_stage and plant_stage and hub_stage.strip() != plant_stage.strip())
    on = bool(hp and pp and hp != pp)
    return on, {
        "hub_stage": hub_stage or None,
        "plant_stage": plant_stage or None,
        "hub_phase": hp,
        "plant_phase": pp,
        "stages_differ": differ,
        "note": "hub select and plant expected stage are in different phases — the VPD band follows the plants, the hub ladders follow the select"
        if on
        else ("same phase, different label" if differ else ""),
    }


def _states_with_controls(
    base: dict[str, dict[str, Any]],
    controls: dict[str, Any],
) -> dict[str, dict[str, Any]]:
    merged = dict(base)
    for eid, ctrl in controls.items():
        attrs: dict[str, Any] = {}
        if ctrl.get("options"):
            attrs["options"] = ctrl["options"]
        if ctrl.get("percentage") is not None:
            attrs["percentage"] = ctrl["percentage"]
        if ctrl.get("brightness") is not None:
            attrs["brightness"] = ctrl["brightness"]
        for key in ("min", "max", "step", "unit_of_measurement"):
            if ctrl.get(key) is not None:
                attrs[key] = ctrl[key]
        merged[eid] = {
            "entity_id": eid,
            "state": str(ctrl.get("state", "unavailable")),
            "attributes": attrs,
        }
    return merged


def _light_curve_points() -> list[tuple[float, float, float]]:
    """Return (dim_pct, lux, par) from sf1000 light_par calibration."""
    rows = get_calibration("sf1000", "light_par")
    by_step: dict[str, dict[str, float]] = {}
    for row in rows:
        key = str(row.get("step_key", ""))
        if "_" not in key:
            continue
        step, field = key.rsplit("_", 1)
        try:
            val = float(row["measured_value"])
        except (TypeError, ValueError):
            continue
        by_step.setdefault(step, {})[field] = val
    out: list[tuple[float, float, float]] = []
    for step, fields in by_step.items():
        try:
            pct = float(step)
        except ValueError:
            continue
        lux = float(fields.get("lux", 0.0))
        par = float(fields.get("par", 0.0))
        out.append((pct, lux, par))
    out.sort(key=lambda p: p[0])
    return out


def _effective_light_off_pct(helpers: dict[str, Any]) -> tuple[float, str]:
    """Lowest dim % treated as off from calibrated LUX/PAR curve."""
    points = _light_curve_points()
    if points:
        off_pct = 0.0
        for pct, lux, par in points:
            effectively_dark = lux < LIGHT_OFF_LUX and (par <= 0 or par < LIGHT_OFF_PAR)
            if effectively_dark:
                off_pct = pct
            else:
                break
        if off_pct > 0:
            return off_pct, "measured_curve"
    try:
        floor = float(
            helpers.get("number.dsc_hub_sf1000_ramp_floor")
            or helpers.get("input_number.dsc_hub_sf1000_ramp_floor")
            or 5
        )
    except (TypeError, ValueError):
        floor = 5.0
    return max(0.0, floor), "ramp_floor_fallback"


def _live_intake_over_exhaust(cfm_values: dict[str, float]) -> bool:
    exhaust = cfm_values.get("sensor.dsc_cfm_exhaust_out", 0.0) + cfm_values.get(
        "sensor.dsc_cfm_exhaust_recirc", 0.0
    )
    intake = cfm_values.get("sensor.dsc_cfm_intake_main", 0.0) + cfm_values.get(
        "sensor.dsc_cfm_intake_2x4", 0.0
    )
    if exhaust < 0.5:
        return False
    return intake > exhaust * NP_INTake_MARGIN


def _light_brightness_pct(states: dict[str, dict[str, Any]]) -> float | None:
    ent = states.get("light.dsc_hub_sf1000_dimmer")
    if not ent:
        return None
    if ent.get("state") != "on":
        return 0.0
    attrs = ent.get("attributes") or {}
    bri = attrs.get("brightness")
    if bri is not None:
        try:
            return round(float(bri) / 255.0 * 100.0, 1)
        except (TypeError, ValueError):
            pass
    pct_attr = attrs.get("percentage")
    if pct_attr is not None:
        try:
            return float(pct_attr)
        except (TypeError, ValueError):
            pass
    return None


def invalidate_computed_cache() -> None:
    """Drop hot/cold computed caches (tests or forced refresh)."""
    _HOT_CACHE.update(ts=0.0, key=None, states={})
    _COLD_CACHE.update(ts=0.0, key=None, states={})


def _helpers_cache_key(helpers: dict[str, Any]) -> str:
    return json.dumps(helpers, sort_keys=True, default=str)


def _inventory_cache_key(inventory: list[dict[str, Any]] | None) -> tuple[Any, ...]:
    return tuple((r.get("seat_id"), r.get("in_service")) for r in (inventory or []))


def _control_state(states: dict[str, dict[str, Any]], eid: str) -> str | None:
    ent = states.get(eid)
    if not ent:
        return None
    st = ent.get("state")
    if st in (None, "unavailable", "unknown"):
        return None
    return str(st)


# Single source of truth: brain/dsc_brain/entity_tables.py (was a literal copy).
from .entity_tables import SONOFF_RELAY as _SONOFF_RELAY_ENTITIES


def _states_with_sonoff_relays(
    fleet: Any,
    states: dict[str, dict[str, Any]],
) -> dict[str, dict[str, Any]]:
    """Merge fleet sonoff relay_on into HA-shaped view when relay entities are absent."""
    merged = dict(states)
    sonoffs = getattr(fleet, "sonoffs", None) or {}
    for seat_id, seat in sonoffs.items():
        relay_eid = _SONOFF_RELAY_ENTITIES.get(seat_id)
        if not relay_eid:
            continue
        existing = merged.get(relay_eid)
        if existing and _control_state(merged, relay_eid) is not None:
            continue
        relay_on = (getattr(seat, "values", None) or {}).get("relay_on")
        if relay_on is None:
            continue
        merged[relay_eid] = {
            "entity_id": relay_eid,
            "state": "on" if relay_on else "off",
            "attributes": {},
        }
    return merged


def _num_state(states: dict[str, dict[str, Any]], eid: str) -> float | None:
    st = _control_state(states, eid)
    if st is None:
        return None
    try:
        return float(st)
    except ValueError:
        return None


_SHIFT_TICK_S = 10.0
_last_shift_tick = 0.0


def tick_schedule_shift_plans(now: float | None = None) -> bool:
    """Advance approve-only slide plans on the brain's clock; never raise.

    Called from the automation ticker (automation_rules._tick_loop). It used to run inside
    build_computed_hass_states — i.e. GET /fleet/computed — so a lights-on write happened
    at whatever rate a browser happened to poll, and never with no tab open. Returns True
    when a tick actually ran (throttled to _SHIFT_TICK_S).
    """
    global _last_shift_tick
    ts = time.time() if now is None else float(now)
    if ts - _last_shift_tick < _SHIFT_TICK_S:
        return False
    _last_shift_tick = ts
    _tick_schedule_shift_plans()
    return True


def _tick_schedule_shift_plans() -> None:
    """Advance approve-only slide plans; never raise."""
    try:
        from .compose_store import set_helper
        from .schedule_shift import tick_shift_plans

        def set_lights_on(space_id: str, lights_on: str) -> None:
            sid = str(space_id or "").strip()
            entity = (
                "time.dsc_hub_lights_on_time"
                if sid in ("4x8", "main")
                else "time.dsc_hub_clone_lights_on_time"
            )
            set_helper(entity, lights_on)

        tick_shift_plans(set_lights_on=set_lights_on)
    except Exception:  # noqa: BLE001
        _logger.debug("schedule shift tick skipped", exc_info=True)


def build_computed_hass_states(
    fleet: Any,
    inventory: list[dict[str, Any]] | None = None,
) -> dict[str, dict[str, Any]]:
    """Emit HA-shaped computed entities for Pi compat layer. Pure read: the schedule-shift
    advance moved to the automation ticker (tick_schedule_shift_plans)."""
    controls = (fleet.hub.values.get("controls") or {}) if fleet.hub else {}
    controls_key = json.dumps(controls, sort_keys=True, default=str)
    inv_key = _inventory_cache_key(inventory)
    hot_key = (getattr(fleet, "updated_at", 0.0), inv_key, controls_key)
    now = time.time()

    helpers = all_helpers()
    cold_key = (midnight_ts(), inv_key, _helpers_cache_key(helpers))
    history = HistoryMemo()
    runtime = RuntimeMemo(history)

    cold_states: dict[str, dict[str, Any]]
    if (
        now - float(_COLD_CACHE.get("ts", 0.0)) < _COLD_TTL_SEC
        and _COLD_CACHE.get("key") == cold_key
        and _COLD_CACHE.get("states")
    ):
        cold_states = dict(_COLD_CACHE["states"])
    else:
        cold_states = _build_cold_computed_states(fleet, inventory, helpers, runtime=runtime)
        _COLD_CACHE.update(ts=now, key=cold_key, states=cold_states)

    if (
        now - float(_HOT_CACHE.get("ts", 0.0)) < _HOT_TTL_SEC
        and _HOT_CACHE.get("key") == hot_key
        and _HOT_CACHE.get("states")
    ):
        return {**cold_states, **dict(_HOT_CACHE["states"])}

    hot_states = _build_hot_computed_states(
        fleet,
        inventory,
        helpers,
        controls,
        cold_states,
        hub_live=bool(fleet.hub and fleet.hub.online),
        runtime=runtime,
    )
    _HOT_CACHE.update(ts=now, key=hot_key, states=hot_states)
    return {**cold_states, **hot_states}


def _build_cold_computed_states(
    fleet: Any,
    inventory: list[dict[str, Any]] | None,
    helpers: dict[str, Any],
    *,
    runtime: RuntimeMemo,
) -> dict[str, dict[str, Any]]:
    """Slow path: helpers, roster, runtime integrals, dash mirrors."""
    states: dict[str, dict[str, Any]] = {}
    cal_memo: dict[str, list[tuple[float, float]]] = {}

    for eid, val in helpers.items():
        domain = eid.split(".", 1)[0] if "." in eid else "sensor"
        if domain in ("input_text", "input_select", "input_number", "input_datetime", "text", "select", "datetime"):
            attrs: dict[str, Any] | None = None
            if domain == "input_select":
                opts = SELECT_OPTIONS.get(eid)
                if opts:
                    attrs = {"options": opts}
            _set_entity(states, eid, val, available=True, attributes=attrs)
        elif domain == "input_boolean":
            _set_entity(states, eid, val, available=True)

    for script_id in (
        "script.dsc_build_plant_commit",
        "script.dsc_build_plant_commit_and_assign",
        "script.dsc_plant_assign_to_pot",
        "script.dsc_plant_retire",
        "script.dsc_plant_detach",
        "script.dsc_plant_assign_slot",
        "script.dsc_plant_move",
    ):
        _set_entity(states, script_id, "off", available=True)

    build_sprout = str(helpers.get("input_datetime.dsc_build_sprout_date") or "")
    if build_sprout:
        try:
            build_days = (datetime.date.today() - datetime.date.fromisoformat(build_sprout[:10])).days
            strain_raw = str(helpers.get("input_text.dsc_build_strain", "")).strip()
            strain_id = strain_raw.replace(" ", "_").lower()[:64]
            _set_entity(states, "sensor.dsc_build_days_since_sprout", max(0, build_days))
            plant_stage = expected_stage(max(0, build_days), auto=_strain_is_auto(strain_id))
            _set_entity(states, "sensor.dsc_build_expected_stage", plant_stage)
            hub_stage = ""
            if fleet.hub:
                hub_stage = str(((fleet.hub.values.get("controls") or {}).get("select.dsc_hub_grow_stage") or {}).get("state") or "")
            on, attrs = _stage_disagreement(hub_stage, plant_stage)
            _set_entity(states, "binary_sensor.dsc_stage_disagreement", on, attributes=attrs)
        except ValueError:
            pass

    bought_hours = 0.0
    bought_by: dict[str, float] = {}
    for runtime_id, (seat_id, metric) in RUNTIME_ENTITIES.items():
        hours = runtime.hours_today(seat_id, metric)
        _set_entity(states, runtime_id, hours, available=True, attributes={"unit_of_measurement": "h"})
        if isinstance(hours, (int, float)):
            bought_hours += float(hours)
            bought_by[runtime_id.removeprefix("sensor.dsc_").removesuffix("_runtime_today")] = round(
                float(hours), 2
            )

    # Efficacy's "bought" number: appliance-hours of purchased conditioning today. Appliances
    # overlap, so this is appliance-hours, not wall-clock — the attributes carry the split.
    _set_entity(
        states,
        "sensor.dsc_bought_runtime_today",
        round(bought_hours, 2),
        available=True,
        attributes={
            "unit_of_measurement": "h",
            "model": "sum_of_appliance_runtime_today",
            "honesty": "appliance_hours_overlapping_not_wall_clock",
            "by_appliance": bought_by,
        },
    )

    slots = get_roster_slots()
    occupied = sum(1 for s in slots if s.get("status") not in ("empty", "", None, "unknown", "unavailable"))
    _set_entity(states, "sensor.dsc_plant_roster_summary", f"{occupied} occupied", attributes={"slots": slots})

    roster_rows = {r["seat_id"]: r for r in list_roster()}
    for pot_n in range(1, 5):
        seat_id = f"pot{pot_n}"
        row = roster_rows.get(seat_id, {})
        recipe = row.get("recipe") or {}
        strain_id = row.get("strain_id") or ""
        stage = row.get("stage") or ""
        plant_name = recipe.get("plant_name") or recipe.get("nickname") or get_helper(f"text.dsc_probe{pot_n}_plant_name", "")
        strain_display = recipe.get("strain_display") or strain_id or ""
        tent = tent_id(str(recipe.get("tent") or get_helper(f"input_select.dsc_probe{pot_n}_tent", "unassigned")))
        sprout = recipe.get("sprout_date") or get_helper(f"datetime.dsc_probe{pot_n}_sprout_date", "")
        pot_occupied = bool(str(plant_name).strip())
        growth_stage = recipe.get("growth_stage") or (stage if pot_occupied else "")
        if sprout and pot_occupied:
            try:
                sprout_dt = datetime.date.fromisoformat(str(sprout)[:10])
                days = (datetime.date.today() - sprout_dt).days
                derived = expected_stage(max(0, days), auto=_strain_is_auto(strain_id))
                if derived and derived != "unknown":
                    _set_entity(states, f"sensor.dsc_probe{pot_n}_expected_stage", derived)
                    recipe_stage = str(recipe.get("growth_stage") or "").strip()
                    # Calendar advances select when ahead; keep operator override only if later than age model.
                    if not recipe_stage or stage_rank(derived) > stage_rank(recipe_stage):
                        growth_stage = derived
                        if recipe_stage != derived:
                            try:
                                update_pot_recipe(pot_n, {"growth_stage": derived})
                            except Exception:
                                pass
                    else:
                        growth_stage = recipe_stage
                _set_entity(states, f"sensor.dsc_probe{pot_n}_days_since_sprout", max(0, days))
            except ValueError:
                pass
        _set_entity(states, f"text.dsc_probe{pot_n}_plant_name", plant_name if pot_occupied else "")
        _set_entity(
            states,
            f"select.dsc_probe{pot_n}_growth_stage",
            growth_stage if pot_occupied else "",
            attributes={"options": GROWTH_STAGE_OPTIONS},
        )
        _set_entity(
            states,
            f"input_select.dsc_probe{pot_n}_tent",
            tent,
            attributes={"options": SELECT_OPTIONS[f"input_select.dsc_probe{pot_n}_tent"]},
        )
        _set_entity(states, f"sensor.dsc_probe{pot_n}_strain_display", strain_display)
        _set_entity(states, f"datetime.dsc_probe{pot_n}_sprout_date", str(sprout)[:10] if sprout else "")
        if pot_occupied:
            fam = stage_family(str(growth_stage or stage)) or "veg"
            want = resolve_want(strain_id=strain_id or None, stage=fam)
            bands = want.get("want") or {}
            _emit_probe_want_bands(states, pot_n, bands)
            pot = fleet.pots.get(seat_id) if fleet else None
            got = dict(pot.values or {}) if pot and pot.online else {}
            bins = (pot.values or {}).get("binaries") or {} if pot else {}
            reading_ok = bool(pot and pot.online) and not bins.get("sensor_fault")
            if bins.get("modbus_probe_online") is False:
                reading_ok = False
            need = _need_summary_text(got if reading_ok else {}, bands)
            _set_entity(states, f"sensor.dsc_probe{pot_n}_need_summary", need)

    cal_active = get_helper("input_boolean.dsc_cal_active", "off") == "on"
    # Count a curve only against its own fan's nameplate: "3/4 curves" while three of them
    # are an order of magnitude off the fans they describe is the calibration screen lying.
    curve_count = sum(
        1
        for plate_id, prefix in _CAL_PREFIX_PLATE.items()
        if _curve_points_usable(
            _cal_points_memoized(prefix, helpers, cal_memo), float(helpers.get(plate_id, 0) or 0)
        )
    )
    _set_entity(states, "sensor.dsc_cfm_curves_status", f"{curve_count}/4 curves")
    _set_entity(states, "sensor.dsc_learn_status", "idle" if not cal_active else "cal_active")
    _set_entity(states, "binary_sensor.dsc_learn_gate_open", get_helper("input_boolean.dsc_learn_gate_open", "off"))

    emit_dash_entities(states, fleet, set_entity=_set_entity, inventory=inventory, runtime=runtime)

    # Policy helper wins over hub mirror for manual takeover (SPA banner / failover).
    takeover_helper = helpers.get("switch.dsc_hub_manual_takeover")
    if takeover_helper is not None:
        _set_entity(states, "switch.dsc_hub_manual_takeover", takeover_helper, available=True)

    # Photoperiod SoT: overwrite got/want/deviation (and honesty) from light_loop.
    light_helpers = _helpers_for_light_loop(helpers, fleet)
    light_hub = _hub_values_for_light_loop(fleet, runtime)
    light_snap = build_light_loop(helpers=light_helpers, hub_values=light_hub, now_ts=time.time())
    emit_light_loop(states, light_snap, _set_entity)

    # Hub reconnect temporary override → SPA binary; TTL/takeover clear → re-assert.
    now_ts = time.time()
    takeover = _manual_takeover_on(fleet, helpers)
    override, force_reassert = evaluate_failover(takeover=takeover, now=now_ts, override=get_override())
    emit_override_entity(states, override, _set_entity)
    if force_reassert:
        stage = _resolve_hub_tick_stage(light_helpers, fleet)
        try:
            decision_tick(
                seat="hub",
                strain_id=None,
                stage=stage,
                manual_takeover=takeover,
                emit=True,
                hub_override=override,
                now=now_ts,
            )
        except Exception as exc:  # noqa: BLE001 — never fail computed emit on re-assert
            _logger.warning("hub re-assert decision_tick failed: %s", exc)
            try:
                record_grow_log(f"Hub re-assert failed: {exc}")
            except Exception:  # noqa: BLE001 — grow-log must not break emit
                _logger.debug("grow-log write failed after re-assert error", exc_info=True)
    return states


def _resolve_hub_tick_stage(helpers: dict[str, Any], fleet: Any) -> str:
    """Want-band family for hub ticks: grow_stage helper/control, else roster main tent."""
    raw = helpers.get("select.dsc_hub_grow_stage") or helpers.get("input_select.dsc_hub_grow_stage")
    if not raw and fleet and getattr(fleet, "hub", None):
        ctrl = (fleet.hub.values.get("controls") or {}).get("select.dsc_hub_grow_stage") or {}
        if isinstance(ctrl, dict) and ctrl.get("state") is not None:
            raw = ctrl.get("state")
    if raw:
        fam = stage_family(str(raw))
        if fam:
            return fam
    try:
        rows = list_roster()
    except Exception:  # noqa: BLE001
        rows = []
    main_stages: list[str] = []
    any_stages: list[str] = []
    for row in rows:
        recipe = row.get("recipe") or {}
        name = str(recipe.get("plant_name") or recipe.get("nickname") or "").strip()
        if not name and not row.get("strain_id"):
            continue
        st = str(row.get("stage") or recipe.get("growth_stage") or "").strip()
        if not st:
            continue
        any_stages.append(st)
        if tent_id(str(recipe.get("tent") or row.get("tent") or "")) == "main":
            main_stages.append(st)
    for st in main_stages or any_stages:
        fam = stage_family(st)
        if fam:
            return fam
    return "veg"


def _manual_takeover_on(fleet: Any, helpers: dict[str, Any]) -> bool:
    eid = "switch.dsc_hub_manual_takeover"
    if helpers.get(eid) is not None:
        return str(helpers.get(eid)).lower() == "on"
    if fleet.hub:
        ctrl = (fleet.hub.values.get("controls") or {}).get(eid) or {}
        if isinstance(ctrl, dict) and ctrl.get("state") is not None:
            return str(ctrl.get("state")).lower() == "on"
    return False


def _emit_probe_want_bands(states: dict[str, dict[str, Any]], pot_n: int, bands: dict[str, Any]) -> None:
    """Publish Want min/max sensors SPA Need / target-band chrome read."""
    mapping = (
        ("temp_c", "want_temp"),
        ("rh_pct", "want_rh"),
        ("moisture_pct", "want_moisture"),
        ("ec_us", "want_ec"),
        ("ph", "want_ph"),
    )
    for key, slug in mapping:
        band = bands.get(key)
        if not isinstance(band, (list, tuple)) or len(band) < 2:
            continue
        try:
            lo, hi = float(band[0]), float(band[1])
        except (TypeError, ValueError):
            continue
        attrs: dict[str, Any] | None = None
        if key == "ec_us":
            # STAGE_DEFAULTS / catalog EC bands are nutrient-solution (feed) values. The pot
            # probe reads BULK substrate EC, which runs several times below pore/feed EC, so
            # the band is unreachable by construction and EC always read "too low".
            attrs = {
                "unit_of_measurement": "µS/cm",
                "basis": "feed_solution",
                "probe_basis": "bulk_substrate",
                "comparable": False,
                "note": "feed-solution target; the probe measures bulk substrate EC (typically several × lower) — not directly comparable",
            }
        _set_entity(states, f"sensor.dsc_probe{pot_n}_{slug}_min", lo, attributes=attrs)
        _set_entity(states, f"sensor.dsc_probe{pot_n}_{slug}_max", hi, attributes=attrs)


def _opt_got(values: dict[str, Any], *keys: str) -> float | None:
    for key in keys:
        raw = values.get(key)
        if raw is None:
            continue
        try:
            return float(raw)
        except (TypeError, ValueError):
            continue
    return None


def _need_summary_text(got: dict[str, Any], bands: dict[str, Any]) -> str:
    """HA-parity Need summary from Got vs Want (brain SoT when templates absent)."""
    bits: list[str] = []
    g_ec = _opt_got(got, "ec_us", "ec")
    ec = bands.get("ec_us")
    if g_ec is not None and isinstance(ec, (list, tuple)) and len(ec) >= 2:
        lo, hi = float(ec[0]), float(ec[1])
        if g_ec < lo:
            bits.append(f"EC low vs Want by ~{round(lo - g_ec)} µS/cm")
        elif g_ec > hi:
            bits.append(f"EC high vs Want by ~{round(g_ec - hi)} µS/cm")
    g_ph = _opt_got(got, "ph")
    ph = bands.get("ph")
    if g_ph is not None and isinstance(ph, (list, tuple)) and len(ph) >= 2:
        lo, hi = float(ph[0]), float(ph[1])
        if g_ph < lo:
            bits.append("pH low")
        elif g_ph > hi:
            bits.append("pH high")
    g_m = _opt_got(got, "moisture_pct", "moisture")
    moist = bands.get("moisture_pct")
    if g_m is not None and isinstance(moist, (list, tuple)) and len(moist) >= 2:
        lo, hi = float(moist[0]), float(moist[1])
        if g_m < lo:
            bits.append("moisture low")
        elif g_m > hi:
            bits.append("moisture high")
    if not bands.get("moisture_pct") and not bands.get("ec_us") and not bands.get("ph"):
        return "—"
    if not got:
        return "—"
    return "; ".join(bits) if bits else "On target vs Want bands"


# The photoperiod anchor is a device fact. When the hub publishes it, the hub wins over the
# brain's stored helper; when only the helper exists the snapshot says so, so the Light page
# can stop stamping the brain's own wish `honesty: ok` as if it had been read back.
_LIGHTS_ON_DEVICE_FIRST = ("time.dsc_hub_lights_on_time", "datetime.dsc_hub_lights_on_time")
LIGHTS_ON_SOURCE_KEY = "_lights_on_source"


def _helpers_for_light_loop(helpers: dict[str, Any], fleet: Any) -> dict[str, Any]:
    """Merge compose helpers with live hub control states light_loop needs."""
    merged = dict(helpers)
    if not fleet.hub:
        if any(eid in merged for eid in _LIGHTS_ON_DEVICE_FIRST):
            merged[LIGHTS_ON_SOURCE_KEY] = "brain"
        return merged
    controls = fleet.hub.values.get("controls") or {}
    for eid in (
        "select.dsc_hub_clone_photoperiod",
        "select.dsc_hub_clone_mode",
        "select.dsc_hub_grow_stage",
        "number.dsc_hub_clone_light_hours",
        "time.dsc_hub_lights_on_time",
        "datetime.dsc_hub_lights_on_time",
        "switch.dsc_hub_auto_photoperiod",
    ):
        ctrl = controls.get(eid)
        has_ctrl = isinstance(ctrl, dict) and ctrl.get("state") not in (None, "")
        if eid in _LIGHTS_ON_DEVICE_FIRST:
            if has_ctrl:
                merged[eid] = ctrl.get("state")
                merged[LIGHTS_ON_SOURCE_KEY] = "hub"
            elif eid in merged and merged.get(LIGHTS_ON_SOURCE_KEY) != "hub":
                merged[LIGHTS_ON_SOURCE_KEY] = "brain"
            continue
        if eid in merged:
            continue
        if has_ctrl:
            merged[eid] = ctrl.get("state")
    return merged


_TWIN_ENTITY = "light.dsc_hub_twin_sf1000"
_TWIN_ON_METRIC = "twin_sf1000_on"
_TWIN_BRI_METRIC = "twin_sf1000_brightness"
_WINDOW_4X8_METRIC = "window_4x8_open"


def _twin_control_available(fleet: Any) -> bool:
    """True when Twin SF1000 control is present with a usable state."""
    if not fleet.hub:
        return False
    controls = fleet.hub.values.get("controls") or {}
    twin = controls.get(_TWIN_ENTITY)
    if not isinstance(twin, dict):
        return False
    st = str(twin.get("state", "")).strip().lower()
    return st not in ("", "unavailable", "unknown", "none")


def _twin_history_healthy(runtime: RuntimeMemo) -> bool:
    """Healthy = at least one Twin on/brightness sample since local midnight."""
    since = runtime.midnight_ts
    if runtime.history.rows("hub", _TWIN_ON_METRIC, since):
        return True
    if runtime.history.rows("hub", _TWIN_BRI_METRIC, since):
        return True
    return False


def _got_hours_4x8_hybrid(fleet: Any, runtime: RuntimeMemo) -> tuple[float, str]:
    """Prefer Twin-derived hours when entity available + healthy history; else window."""
    window_h = runtime.hours_today("hub", _WINDOW_4X8_METRIC)
    if not (_twin_control_available(fleet) and _twin_history_healthy(runtime)):
        return window_h, "window"
    on_rows = runtime.history.rows("hub", _TWIN_ON_METRIC, runtime.midnight_ts)
    if on_rows:
        return runtime.hours_today("hub", _TWIN_ON_METRIC), "twin"
    return runtime.hours_today("hub", _TWIN_BRI_METRIC), "twin"


def _hub_values_for_light_loop(fleet: Any, runtime: RuntimeMemo) -> dict[str, Any]:
    """SF dimmer + delivered/got hours for light_loop (never invent ON from gauges)."""
    got_4x8, got_source = _got_hours_4x8_hybrid(fleet, runtime)
    out: dict[str, Any] = {
        "got_hours_2x4": runtime.hours_today("hub", "window_2x4_open"),
        "got_hours_4x8": got_4x8,
        "got_hours_4x8_source": got_source,
    }
    if not fleet.hub:
        out["sf1000_on"] = False
        return out
    controls = fleet.hub.values.get("controls") or {}
    light = controls.get("light.dsc_hub_sf1000_dimmer") or {}
    out["sf1000_on"] = str(light.get("state", "")).lower() == "on"
    bri = light.get("brightness")
    if bri is not None:
        try:
            bri_f = float(bri)
            # ESPHome often reports 0–255; snapshot prefers 0–1 fraction when >1.
            out["sf1000_brightness"] = bri_f / 255.0 if bri_f > 1.0 else bri_f
        except (TypeError, ValueError):
            pass
    delivered = fleet.hub.values.get("light_delivered_hours")
    if delivered is None:
        sensors = fleet.hub.values.get("sensors") or {}
        delivered = sensors.get("light_delivered_hours")
    if delivered is not None:
        out["light_delivered_hours"] = delivered
    # The hub's catch-up debt. This function is an explicit whitelist, so a value not copied
    # here is invisible to light_loop no matter what /fleet carries — adding the field to the
    # snapshot was not enough on its own (caught on the Pi: the entity published as None
    # while /fleet showed 7.85).
    debt = fleet.hub.values.get("light_debt_hours")
    if debt is None:
        sensors = fleet.hub.values.get("sensors") or {}
        debt = sensors.get("light_debt_hours")
    if debt is not None:
        out["light_debt_hours"] = debt
    return out


def _build_hot_computed_states(
    fleet: Any,
    inventory: list[dict[str, Any]] | None,
    helpers: dict[str, Any],
    controls: dict[str, Any],
    cold_states: dict[str, dict[str, Any]],
    *,
    hub_live: bool,
    runtime: RuntimeMemo,
) -> dict[str, dict[str, Any]]:
    """Fast path: live CFM, fan pct, efficacy gates, alert rollups."""
    states: dict[str, dict[str, Any]] = {}
    cal_memo: dict[str, list[tuple[float, float]]] = {}
    view = _states_with_sonoff_relays(fleet, _states_with_controls(cold_states, controls))

    fan_pcts: dict[str, float] = {}
    for sensor_id, fan_entity in FAN_PCT_ENTITIES.items():
        if not hub_live:
            # Hub dark: do not publish theater 0% as live — SPA must see unavailable.
            fan_pcts[sensor_id] = 0.0
            _set_entity(
                states,
                sensor_id,
                None,
                available=False,
                attributes={"unit_of_measurement": "%"},
            )
            continue
        pct = _fan_pct_from_controls(controls, fan_entity)
        # Per-fan: this loop already knows which fan it is holding.
        scaled = scale_fan_demand_pct(pct, fan_entity)
        fan_pcts[sensor_id] = float(scaled if scaled is not None else pct)
        _set_entity(states, sensor_id, fan_pcts[sensor_id], available=True, attributes={"unit_of_measurement": "%"})

    cfm_values: dict[str, float] = {}
    for cfm_id, pct_id, plate_id, cal_prefix in CFM_SPECS:
        pct = fan_pcts.get(pct_id, 0.0)
        plate = float(helpers.get(plate_id, 0) or 0)
        val, model, honesty = _cfm_from_pct_memoized(pct, plate, cal_prefix, helpers, cal_memo)
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

    # Intake-side mirror: total exhaust CFM (curve-or-nameplate) split across the
    # two intake fans by their live pct share.
    exh = cfm_values.get("sensor.dsc_cfm_exhaust_out", 0.0) + cfm_values.get("sensor.dsc_cfm_exhaust_recirc", 0.0)
    pim = fan_pcts.get("sensor.dsc_fan_intake_main_pct", 0.0)
    pi2 = fan_pcts.get("sensor.dsc_fan_intake_2x4_pct", 0.0)
    ifs = pim + pi2
    if ifs >= 0.5:
        intake_main_alloc = round(exh * pim / ifs, 1)
        intake_2x4_alloc = round(exh * pi2 / ifs, 1)
    else:
        intake_main_alloc = 0.0
        intake_2x4_alloc = 0.0
    _set_entity(
        states,
        "sensor.dsc_cfm_intake_main_allocated",
        intake_main_alloc,
        available=True,
        attributes={
            "unit_of_measurement": "CFM",
            "model": "mass_balance_allocated",
            "honesty": "Sigma_exhaust_times_fan_pct_split",
            "companion_capacity": "sensor.dsc_cfm_intake_main",
        },
    )
    _set_entity(
        states,
        "sensor.dsc_cfm_intake_2x4_allocated",
        intake_2x4_alloc,
        available=True,
        attributes={
            "unit_of_measurement": "CFM",
            "model": "mass_balance_allocated",
            "honesty": "Sigma_exhaust_times_fan_pct_split",
            "companion_capacity": "sensor.dsc_cfm_intake_2x4",
        },
    )

    total_intake = intake_main_alloc + intake_2x4_alloc
    if total_intake >= 0.5:
        direct_exhaust_2x4 = out_alloc * (intake_2x4_alloc / total_intake)
        cascade_2x4 = max(0.0, round(intake_2x4_alloc - direct_exhaust_2x4, 1))
    else:
        cascade_2x4 = 0.0
    _set_entity(
        states,
        "sensor.dsc_cfm_cascade_2x4_allocated",
        cascade_2x4,
        available=True,
        attributes={
            "unit_of_measurement": "CFM",
            "model": "mass_balance_cascade",
            "honesty": "intake_2x4_minus_direct_exhaust_share",
        },
    )
    total_exhaust = out_alloc + recirc_alloc

    # Pressure verdict off the *capacity* curves, never the allocated pair.
    #
    # intake_*_allocated is Sigma-exhaust-capacity split by intake fan pct; exhaust_*_allocated
    # is Sigma-intake-capacity split by exhaust fan pct. Each side is derived from the other, so
    # comparing them compares a number against its own mirror and can never fail honestly — and
    # a diagram that prints both reads as an impossible balance (intake 278 next to dump 7).
    # Capacity vs capacity is the only comparison that says something about the real rig.
    intake_capacity = cfm_values.get("sensor.dsc_cfm_intake_main", 0.0) + cfm_values.get(
        "sensor.dsc_cfm_intake_2x4", 0.0
    )
    exhaust_capacity = cfm_values.get("sensor.dsc_cfm_exhaust_out", 0.0) + cfm_values.get(
        "sensor.dsc_cfm_exhaust_recirc", 0.0
    )
    net_pressure = round(intake_capacity - exhaust_capacity, 1)
    # A total is only as measured as its parts. exhaust_capacity_total used to be stamped
    # "measured" while 93 % of it was one fan's nameplate proxy, and the headline negative
    # pressure figure inherited that label.
    intake_h, intake_share = _capacity_honesty(states, cfm_values, ("sensor.dsc_cfm_intake_main", "sensor.dsc_cfm_intake_2x4"))
    exhaust_h, exhaust_share = _capacity_honesty(states, cfm_values, ("sensor.dsc_cfm_exhaust_out", "sensor.dsc_cfm_exhaust_recirc"))
    for eid, val, hon, share in (
        ("sensor.dsc_cfm_intake_capacity_total", round(intake_capacity, 1), intake_h, intake_share),
        ("sensor.dsc_cfm_exhaust_capacity_total", round(exhaust_capacity, 1), exhaust_h, exhaust_share),
    ):
        _set_entity(
            states,
            eid,
            val,
            available=True,
            attributes={
                "unit_of_measurement": "CFM",
                "model": "fan_curve_or_nameplate",
                "honesty": hon,
                "nameplate_share_pct": share,
            },
        )
    worst_share = max(intake_share, exhaust_share)
    _set_entity(
        states,
        "sensor.dsc_flow_net_pressure_cfm",
        net_pressure,
        available=True,
        attributes={
            "unit_of_measurement": "CFM",
            "model": "intake_capacity_minus_exhaust_capacity",
            "honesty": "positive_is_over_pressure_negative_is_under_pressure",
            "basis_honesty": "measured_curve" if worst_share == 0 else f"{worst_share}pct_of_a_side_is_nameplate_proxy",
            "nameplate_share_pct": worst_share,
        },
    )
    imbalance = abs(net_pressure)
    mass_ok = imbalance < max(5.0, 0.05 * max(intake_capacity, exhaust_capacity, 1.0))
    _set_entity(
        states,
        "binary_sensor.dsc_flow_mass_balance_ok",
        mass_ok,
        attributes={"net_pressure_cfm": net_pressure, "basis": "capacity_vs_capacity"},
    )

    tent_t = fleet.hub.values.get("temp_c") if fleet.hub else None
    tent_rh = fleet.hub.values.get("rh_pct") if fleet.hub else None
    room_t = fleet.hub.values.get("room_temp_c") if fleet.hub else None
    room_rh = fleet.hub.values.get("room_rh_pct") if fleet.hub else None
    rh_max = float(helpers.get("number.dsc_hub_rh_target_max", helpers.get("input_number.dsc_hub_rh_target_max", 70)) or 70)
    rh_min = float(helpers.get("number.dsc_hub_rh_target_min", helpers.get("input_number.dsc_hub_rh_target_min", 45)) or 45)
    target_t = float(helpers.get("number.dsc_hub_target_temp", helpers.get("input_number.dsc_hub_target_temp", 25)) or 25)

    hum_demand = _control_state(view, "switch.dsc_hub_humidifier_demand") == "on"
    hum_relay = _control_state(view, "switch.dsc_humidifier_main_relay") == "on"
    dehum_demand = _control_state(view, "switch.dsc_hub_dehumidifier_demand") == "on"
    dehum_relay = _control_state(view, "switch.dsc_de_humidifier_main_relay") == "on"
    heat_demand = _control_state(view, "switch.dsc_hub_heater_demand") == "on"
    heat_relay = _control_state(view, "switch.dsc_heater_main_relay") == "on"
    mat_demand = _control_state(view, "switch.dsc_hub_grow_mat_demand") == "on"
    mat_relay = _control_state(view, "switch.dsc_heatmat_main_relay") == "on"
    out_pct = fan_pcts.get("sensor.dsc_fan_exhaust_outside_pct", 0.0)

    # What the lung is actually moving out of the 4x8 into the room, in BTU/h:
    # 1.08 x CFM x dT(degF) == 1.944 x CFM x dT(degC). Both temps are measured, so this is real.
    # There is no outdoor probe on this rig, so the tent->outdoors dump is NOT computed here —
    # sensor.dsc_vent_heat_dump_btu never existed and stays absent rather than invented.
    if tent_t is not None and room_t is not None and recirc_alloc > 0:
        transfer_btu = round(1.944 * recirc_alloc * (float(tent_t) - float(room_t)), 1)
        _set_entity(
            states,
            "sensor.dsc_vent_heat_transfer_btu",
            transfer_btu,
            available=True,
            attributes={
                "unit_of_measurement": "BTU/h",
                "model": "1.08_x_cfm_x_dT_degF",
                "honesty": "recirc_allocated_cfm_times_measured_tent_minus_room",
            },
        )
    else:
        _set_entity(
            states,
            "sensor.dsc_vent_heat_transfer_btu",
            None,
            available=False,
            attributes={"unit_of_measurement": "BTU/h"},
        )

    heat_tent_w = 0.0
    if heat_demand and heat_relay and room_t is not None and tent_t is not None:
        heat_tent_w = round(max(0.0, float(tent_t) - float(room_t)) * 120.0, 1)
    mat_w = round(80.0, 1) if mat_demand and mat_relay else 0.0
    humidify_g = 0.0
    if hum_demand and hum_relay and room_rh is not None:
        humidify_g = round(max(0.0, rh_min - float(room_rh)) * 2.0, 2)
    dehumidify_g = 0.0
    if dehum_demand and dehum_relay and room_rh is not None:
        dehumidify_g = round(max(0.0, float(room_rh) - rh_max) * 2.0, 2)
    _set_entity(
        states,
        "sensor.dsc_flow_heat_tent_w",
        heat_tent_w,
        available=True,
        attributes={"unit_of_measurement": "W", "model": "estimated_proxy", "honesty": "demand_times_delta_t"},
    )
    _set_entity(
        states,
        "sensor.dsc_flow_heat_mat_w",
        mat_w,
        available=True,
        attributes={"unit_of_measurement": "W", "model": "estimated_proxy", "honesty": "mat_demand_on"},
    )
    _set_entity(
        states,
        "sensor.dsc_flow_humidify_g_h",
        humidify_g,
        available=True,
        attributes={"unit_of_measurement": "g/h", "model": "estimated_proxy", "honesty": "demand_times_rh_gap"},
    )
    _set_entity(
        states,
        "sensor.dsc_flow_dehumidify_g_h",
        dehumidify_g,
        available=True,
        attributes={"unit_of_measurement": "g/h", "model": "estimated_proxy", "honesty": "demand_times_rh_gap"},
    )

    hum_runtime_h = runtime.hours_today("hub", "switch_dsc_hub_humidifier_demand")
    heat_runtime_h = runtime.hours_today("hub", "switch_dsc_hub_heater_demand")
    mat_runtime_h = runtime.hours_today("hub", "switch_dsc_hub_grow_mat_demand")

    hold_attrs = {"basis": "held_condition", "on_after_s": 600, "off_after_s": 300}
    _set_entity(
        states,
        "binary_sensor.dsc_humidifier_ineffective_suspect",
        _held_flag(
            "binary_sensor.dsc_humidifier_ineffective_suspect",
            bool(hum_demand and hum_relay and tent_rh is not None and float(tent_rh) >= (rh_max - 0.5) and hum_runtime_h * 3600 >= 600),
            on_after_s=600,
            off_after_s=300,
        ),
        attributes=hold_attrs,
    )
    _set_entity(
        states,
        "binary_sensor.dsc_heater_ineffective_suspect",
        _held_flag(
            "binary_sensor.dsc_heater_ineffective_suspect",
            bool(heat_demand and heat_relay and tent_t is not None and float(tent_t) >= (target_t + 0.3) and heat_runtime_h * 3600 >= 480),
            on_after_s=600,
            off_after_s=300,
        ),
        attributes=hold_attrs,
    )
    # The condition itself must persist for the hold — that IS continuous runtime, so the
    # cumulative-today runtime gate is gone.
    _set_entity(
        states,
        "binary_sensor.dsc_heater_temp_oos_latch",
        _held_flag(
            "binary_sensor.dsc_heater_temp_oos_latch",
            bool(heat_demand and heat_relay and tent_t is not None and float(tent_t) < (target_t - 1.5)),
            on_after_s=600,
            off_after_s=300,
        ),
        attributes=hold_attrs,
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
            "binary_sensor.dsc_live_intake_over_exhaust",
        )
        if _control_state(states, eid) == "on"
    )
    _set_entity(states, "sensor.dsc_active_alert_count", alert_count)

    off_pct, off_honesty = _effective_light_off_pct(helpers)
    _set_entity(
        states,
        "number.dsc_hub_sf1000_effective_off_pct",
        off_pct,
        available=True,
        attributes={"unit_of_measurement": "%", "honesty": off_honesty},
    )
    bri_pct = _light_brightness_pct(view)
    if bri_pct is not None:
        scaled = scale_light_brightness_pct(bri_pct)
        if scaled is not None:
            bri_pct = scaled
        _set_entity(
            states,
            "binary_sensor.dsc_light_effectively_off",
            bri_pct <= off_pct,
            available=True,
            attributes={"brightness_pct": bri_pct, "threshold_pct": off_pct},
        )

    np_breach = _live_intake_over_exhaust(cfm_values)
    _set_entity(states, "binary_sensor.dsc_live_intake_over_exhaust", np_breach, available=hub_live)
    _set_entity(
        states,
        "binary_sensor.dsc_plant_specs_intake_over_exhaust",
        np_breach,
        available=hub_live,
    )

    dash_view = {**cold_states, **states}
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
            "binary_sensor.dsc_peer_mad_alert",
            "binary_sensor.dsc_dht_disagreement",
            "binary_sensor.dsc_probe1_sensor_stuck",
            "binary_sensor.dsc_probe2_sensor_stuck",
            "binary_sensor.dsc_probe3_sensor_stuck",
            "binary_sensor.dsc_probe4_sensor_stuck",
        )
        if _control_state(dash_view, eid) == "on"
    )
    _set_entity(states, "sensor.dsc_active_alert_count", dash_alerts)

    return states
