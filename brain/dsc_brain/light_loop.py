"""Photoperiod / light hours single source of truth for 4x8 + 2x4."""

from __future__ import annotations

import math
from dataclasses import dataclass
from typing import Any, Callable


@dataclass
class LightLoopSnapshot:
    main_on_time: str | None
    main_want_hours: float | None
    clone_mode: str
    clone_follows_main: bool
    clone_want_hours: float | None
    sf_on: bool
    sf_brightness: float | None
    got_hours_2x4: float | None
    got_hours_4x8: float | None
    deviation_2x4: float | None
    schedule_valid: bool
    honesty: str


_VEG_STAGES = {
    "Germination",
    "Seedling",
    "Early Vegetative",
    "Vegetative",
    "Late (Push) Vegetative",
}
_FLOWER_STAGES = {
    "Early Flowering",
    "Flowering",
    "Late Flowering",
    "Final 48-72h Flowering",
}


def _opt_float(raw: Any) -> float | None:
    if raw is None:
        return None
    if isinstance(raw, str) and raw.strip().lower() in ("", "unavailable", "unknown", "none"):
        return None
    try:
        val = float(raw)
    except (TypeError, ValueError):
        return None
    if not math.isfinite(val):
        return None
    return val


def _helper_str(helpers: dict, *keys: str, default: str = "") -> str:
    for key in keys:
        raw = helpers.get(key)
        if raw is None:
            continue
        text = str(raw).strip()
        if text and text.lower() not in ("unavailable", "unknown", "none"):
            return text
    return default


def _main_want_hours(helpers: dict) -> float | None:
    direct = _opt_float(helpers.get("sensor.dsc_expected_light_hours"))
    if direct is not None:
        return direct
    stage = _helper_str(
        helpers,
        "select.dsc_hub_grow_stage",
        "input_select.dsc_hub_grow_stage",
    )
    if stage in _VEG_STAGES:
        return 18.0
    if stage in _FLOWER_STAGES:
        return 12.0
    if stage:
        return 0.0
    return None


def _clone_want_hours(
    *,
    clone_mode: str,
    photoperiod: str,
    follows_main: bool,
    main_want: float | None,
    helpers: dict,
) -> float | None:
    if clone_mode == "Off" or photoperiod == "Off":
        return 0.0
    if follows_main:
        return main_want
    hours = _opt_float(helpers.get("number.dsc_hub_clone_light_hours"))
    if hours is not None:
        return hours
    return _opt_float(helpers.get("input_number.dsc_hub_clone_light_hours"))


def build_light_loop(*, helpers: dict, hub_values: dict, now_ts: float) -> LightLoopSnapshot:
    """Build one photoperiod snapshot from helpers + hub values.

    ``now_ts`` is reserved for future window-clock honesty; unused today.
    """
    _ = now_ts
    helpers = helpers or {}
    hub_values = hub_values or {}

    main_on_raw = helpers.get("time.dsc_hub_lights_on_time")
    if main_on_raw is None:
        main_on_raw = helpers.get("datetime.dsc_hub_lights_on_time")
    main_on_time: str | None
    if main_on_raw is None:
        main_on_time = None
    else:
        text = str(main_on_raw).strip()
        main_on_time = text if text else None

    photoperiod = _helper_str(
        helpers,
        "select.dsc_hub_clone_photoperiod",
        default="Independent",
    )
    clone_mode = _helper_str(
        helpers,
        "select.dsc_hub_clone_mode",
        default=photoperiod,
    )
    follows_main = photoperiod == "Follow 4x8" or clone_mode == "Follow 4x8"

    main_want = _main_want_hours(helpers)
    clone_want = _clone_want_hours(
        clone_mode=clone_mode,
        photoperiod=photoperiod,
        follows_main=follows_main,
        main_want=main_want,
        helpers=helpers,
    )

    # SF ON/% only from hub — never invent from hours gauges.
    sf_on = bool(hub_values.get("sf1000_on", False))
    sf_brightness = _opt_float(hub_values.get("sf1000_brightness"))

    delivered = _opt_float(hub_values.get("light_delivered_hours"))
    got_2x4 = delivered if delivered is not None else _opt_float(hub_values.get("got_hours_2x4"))
    got_4x8 = _opt_float(hub_values.get("got_hours_4x8"))

    deviation: float | None = None
    if got_2x4 is not None and clone_want is not None:
        deviation = got_2x4 - clone_want

    if follows_main and main_on_time is None:
        schedule_valid = False
        honesty = "no schedule: main on-time unset"
    else:
        schedule_valid = True
        honesty = "ok"

    return LightLoopSnapshot(
        main_on_time=main_on_time,
        main_want_hours=main_want,
        clone_mode=clone_mode,
        clone_follows_main=follows_main,
        clone_want_hours=clone_want,
        sf_on=sf_on,
        sf_brightness=sf_brightness,
        got_hours_2x4=got_2x4,
        got_hours_4x8=got_4x8,
        deviation_2x4=deviation,
        schedule_valid=schedule_valid,
        honesty=honesty,
    )


SetEntityFn = Callable[..., None]


def emit_light_loop(states: dict, snapshot: LightLoopSnapshot, set_entity: SetEntityFn) -> None:
    """Emit got/want/deviation sensors from the light_loop snapshot."""
    schedule_attrs = {"honesty": snapshot.honesty, "unit_of_measurement": "h"}

    if snapshot.main_want_hours is not None:
        set_entity(
            states,
            "sensor.dsc_expected_light_hours",
            snapshot.main_want_hours,
            available=True,
            attributes=dict(schedule_attrs),
        )
    if snapshot.clone_want_hours is not None:
        set_entity(
            states,
            "sensor.dsc_clone_expected_light_hours",
            snapshot.clone_want_hours,
            available=True,
            attributes=dict(schedule_attrs),
        )
    if snapshot.got_hours_2x4 is not None:
        set_entity(
            states,
            "sensor.dsc_lights_on_today_2x4",
            snapshot.got_hours_2x4,
            available=True,
            attributes=dict(schedule_attrs),
        )
    if snapshot.got_hours_4x8 is not None:
        set_entity(
            states,
            "sensor.dsc_lights_on_today_4x8",
            snapshot.got_hours_4x8,
            available=True,
            attributes=dict(schedule_attrs),
        )
    if snapshot.deviation_2x4 is not None:
        set_entity(
            states,
            "sensor.dsc_lights_deviation_today",
            round(snapshot.deviation_2x4, 2),
            available=True,
            attributes=dict(schedule_attrs),
        )
    if snapshot.main_on_time is not None:
        set_entity(
            states,
            "time.dsc_hub_lights_on_time",
            snapshot.main_on_time,
            available=True,
            attributes={"honesty": snapshot.honesty},
        )
    elif not snapshot.schedule_valid:
        # Honest empty: Follow claimed with unset on-time.
        set_entity(
            states,
            "time.dsc_hub_lights_on_time",
            "",
            available=True,
            attributes={"honesty": snapshot.honesty},
        )
