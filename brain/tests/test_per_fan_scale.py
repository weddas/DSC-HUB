"""Fan demand scaling is per fan, not one multiplier over four different fans.

The four are physically different — 4" intake main, 4" intake 2x4, 6" exhaust room, 6"
exhaust outside — so trimming the noisy one used to trim the room exhaust with it.
"""

from __future__ import annotations

from pathlib import Path

import pytest


def test_an_existing_single_scale_still_applies_to_every_fan(
    temp_db: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    """Migration: a rig that only ever had the scalar must behave identically on upgrade —
    silently re-scaling a running fan would change airflow on a live grow."""
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    import json

    from dsc_brain.global_modifiers import FAN_SCALE_ENTITIES, get_global_modifiers, scale_fan_demand_pct
    from dsc_brain.settings import set_setting

    set_setting("global_modifiers", json.dumps({"fan_demand_scale": 0.8}))

    mods = get_global_modifiers()
    assert all(mods["fan_demand_scales"][eid] == 0.8 for eid in FAN_SCALE_ENTITIES)
    for eid in FAN_SCALE_ENTITIES:
        assert scale_fan_demand_pct(50.0, eid) == 40.0


def test_one_fan_can_be_trimmed_without_touching_the_others(
    temp_db: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.global_modifiers import scale_fan_demand_pct, set_global_modifiers

    set_global_modifiers({"fan_demand_scales": {"fan.dsc_hub_4_inch_intake_fan_2x4": 0.6}})

    assert scale_fan_demand_pct(100.0, "fan.dsc_hub_4_inch_intake_fan_2x4") == 60.0
    # The whole point: the others are untouched.
    assert scale_fan_demand_pct(100.0, "fan.dsc_hub_6_inch_exhaust_room") == 100.0
    assert scale_fan_demand_pct(100.0, "fan.dsc_hub_4_inch_intake_fan_main") == 100.0
    assert scale_fan_demand_pct(100.0, "fan.dsc_hub_6_inch_exhaust_outside") == 100.0


def test_scales_are_clamped_and_unknown_fans_refused(
    temp_db: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.global_modifiers import scale_fan_demand_pct, set_global_modifiers

    set_global_modifiers({"fan_demand_scales": {"fan.dsc_hub_6_inch_exhaust_room": 99.0}})
    assert scale_fan_demand_pct(100.0, "fan.dsc_hub_6_inch_exhaust_room") == 100.0, "clamped to 1.5x then to 100%"
    assert scale_fan_demand_pct(50.0, "fan.dsc_hub_6_inch_exhaust_room") == 75.0

    with pytest.raises(ValueError, match="unknown fan"):
        set_global_modifiers({"fan_demand_scales": {"fan.dsc_hub_not_a_fan": 1.0}})


def test_a_caller_that_names_no_fan_falls_back_to_the_legacy_scalar(
    temp_db: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    import json

    from dsc_brain.global_modifiers import scale_fan_demand_pct
    from dsc_brain.settings import set_setting

    set_setting("global_modifiers", json.dumps({"fan_demand_scale": 0.5}))
    assert scale_fan_demand_pct(100.0, None) == 50.0


def test_none_in_none_out(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.global_modifiers import scale_fan_demand_pct

    assert scale_fan_demand_pct(None, "fan.dsc_hub_6_inch_exhaust_room") is None


def test_the_call_site_names_its_fan() -> None:
    """computed_ops holds `fan_entity` in the same loop; a bare call there would silently
    apply the legacy scalar to all four."""
    import inspect

    from dsc_brain import computed_ops

    src = inspect.getsource(computed_ops)
    assert "scale_fan_demand_pct(pct, fan_entity)" in src, "the call site stopped naming its fan"
