"""Air changes per hour — the one airflow number that is arithmetic, not a model.

`plan-spatial-layout-2026-09-10.md` S7. The plan is deliberate that air gets a *shape*, not
a *number*, with exactly one exception: a throughput divided by a volume is division, and it
answers the question a grower actually asks ("how fast does my tent turn over?").

Three things need pinning, because each is somewhere a plausible-looking wrong answer lives:

* the two sides are the same flow counted twice, so they must not be added;
* a tent with only a powered intake still exchanges — through its passive vents;
* the tent's air being replaced is not the same as fresh air, because a fan exhausting to
  the room moves it next door and what comes back is room air.
"""

from __future__ import annotations

import time

import pytest

from dsc_brain.compose_store import set_helper
from dsc_brain.computed_ops import build_computed_hass_states, fan_instances, invalidate_computed_cache
from dsc_brain.fleet_state import FleetState, SeatState
from dsc_brain.space_model import DEFAULT_TENT_HEIGHT_CM, ensure_kit_spaces, space_volume_m3

NAMEPLATES = {
    "input_number.dsc_cfm_out_max": 440.0,
    "input_number.dsc_cfm_recirc_max": 440.0,
    "input_number.dsc_cfm_intake_main_max": 200.0,
    "input_number.dsc_cfm_intake_clone_max": 200.0,
}


def _fleet(duties: dict[str, float]) -> FleetState:
    controls = {
        eid: {"state": "on", "percentage": pct, "attributes": {"percentage": pct}}
        for eid, pct in duties.items()
    }
    state = FleetState()
    state.hub = SeatState("hub", True, "10.42.0.1", {"controls": controls}, time.time())
    return state


@pytest.fixture()
def rig(tmp_path, monkeypatch):
    monkeypatch.setenv("DSC_DATA", str(tmp_path))
    ensure_kit_spaces()
    for key, val in NAMEPLATES.items():
        set_helper(key, val)
    invalidate_computed_cache()
    return None


def _extras(duties: dict[str, float]) -> dict:
    invalidate_computed_cache()
    return build_computed_hass_states(_fleet(duties))


ALL_OFF = {
    "fan.dsc_hub_6_inch_exhaust_outside": 0,
    "fan.dsc_hub_6_inch_exhaust_room": 0,
    "fan.dsc_hub_4_inch_intake_fan_main": 0,
    "fan.dsc_hub_4_inch_intake_fan_2x4": 0,
}


# --------------------------------------------------------------------------------------
# Volume
# --------------------------------------------------------------------------------------


def test_volume_is_footprint_times_height() -> None:
    assert space_volume_m3({"size_m2": 2.97, "extra": {"height_cm": 210}}) == 6.237
    assert space_volume_m3({"size_m2": 0.74, "extra": {"height_cm": 210}}) == 1.554


def test_a_missing_height_falls_back_to_the_tent_default_not_to_zero() -> None:
    assert space_volume_m3({"size_m2": 2.97, "extra": {}}) == round(2.97 * DEFAULT_TENT_HEIGHT_CM / 100, 3)


def test_no_footprint_means_no_volume_rather_than_a_guess() -> None:
    assert space_volume_m3({"size_m2": 0, "extra": {"height_cm": 210}}) == 0.0
    assert space_volume_m3({"size_m2": None, "extra": {}}) == 0.0


def test_a_taller_tent_exchanges_more_slowly(rig) -> None:  # noqa: ANN001
    """Volume is the denominator, so height is not cosmetic."""
    short = space_volume_m3({"size_m2": 2.97, "extra": {"height_cm": 180}})
    tall = space_volume_m3({"size_m2": 2.97, "extra": {"height_cm": 240}})
    assert tall > short


# --------------------------------------------------------------------------------------
# Which side drives the exchange
# --------------------------------------------------------------------------------------


def test_the_two_sides_are_not_added(rig) -> None:  # noqa: ANN001
    """In steady state what goes in comes out: summing both sides doubles the flow.

    The 4x8 here has 462 CFM of exhaust against 60 CFM of powered intake. The exchange is
    462, not 522.
    """
    ex = _extras({**ALL_OFF,
                  "fan.dsc_hub_6_inch_exhaust_outside": 60,
                  "fan.dsc_hub_6_inch_exhaust_room": 45,
                  "fan.dsc_hub_4_inch_intake_fan_main": 30})
    attrs = ex["sensor.dsc_ach_4x8"]["attributes"]
    assert attrs["exchange_cfm"] == 462.0
    assert attrs["driven_by"] == "exhaust"


def test_a_tent_with_only_a_powered_intake_still_exchanges(rig) -> None:  # noqa: ANN001
    """The 2x4 has no exhaust fan at all — air leaves through the passive vents."""
    ex = _extras({**ALL_OFF, "fan.dsc_hub_4_inch_intake_fan_2x4": 50})
    attrs = ex["sensor.dsc_ach_2x4"]["attributes"]
    assert attrs["driven_by"] == "intake"
    assert attrs["exchange_cfm"] == 100.0  # 50 % of a 200 CFM nameplate
    assert attrs["driving_fans"] == ["Intake 2x4"]
    assert float(ex["sensor.dsc_ach_2x4"]["state"]) > 0


def test_ach_is_flow_over_volume(rig) -> None:  # noqa: ANN001
    ex = _extras({**ALL_OFF, "fan.dsc_hub_4_inch_intake_fan_2x4": 50})
    ent = ex["sensor.dsc_ach_2x4"]
    attrs = ent["attributes"]
    expected = round(100.0 * 1.699 / attrs["volume_m3"], 1)
    assert float(ent["state"]) == expected


def test_minutes_per_exchange_is_the_reciprocal(rig) -> None:  # noqa: ANN001
    """What a grower actually thinks in: "it turns over every N minutes"."""
    ex = _extras({**ALL_OFF, "fan.dsc_hub_4_inch_intake_fan_2x4": 50})
    ach = float(ex["sensor.dsc_ach_2x4"]["state"])
    minutes = float(ex["sensor.dsc_air_exchange_minutes_2x4"]["state"])
    assert minutes == pytest.approx(60.0 / ach, abs=0.01)


def test_fans_reporting_but_off_is_a_real_zero(rig) -> None:  # noqa: ANN001
    """The fans answer and say 0 %: "this tent is not exchanging" is a fact worth showing."""
    ex = _extras(ALL_OFF)
    assert ex["sensor.dsc_ach_4x8"]["state"] == "0.0"
    assert ex["sensor.dsc_ach_2x4"]["state"] == "0.0"
    # ...but "turns over every N minutes" has no value at zero flow, and infinity is not a
    # reading.
    assert ex["sensor.dsc_air_exchange_minutes_4x8"]["state"] == "unavailable"


def test_a_dark_hub_publishes_no_ach_at_all(rig) -> None:  # noqa: ANN001
    """The bug this file originally missed: with nothing reporting, a confident 0.0/hour.

    An earlier version of this test only checked the minutes entity, which was unavailable
    for an unrelated reason, so it passed while the ACH sensor was publishing a zero it had
    no basis for.
    """
    invalidate_computed_cache()
    state = FleetState()
    state.hub = SeatState("hub", False, "10.42.0.1", {"controls": {}}, time.time())
    ex = build_computed_hass_states(state)
    for space_id in ("4x8", "2x4"):
        assert ex[f"sensor.dsc_ach_{space_id}"]["state"] == "unavailable"
        assert ex[f"sensor.dsc_air_exchange_minutes_{space_id}"]["state"] == "unavailable"


def test_a_space_with_no_exhaust_fan_is_not_reported_as_exhaust_driven(rig) -> None:  # noqa: ANN001
    """A tie at zero used to pick "exhaust" for the 2x4, which has no exhaust fan."""
    ex = _extras(ALL_OFF)
    assert ex["sensor.dsc_ach_2x4"]["attributes"]["driven_by"] == "intake"


# --------------------------------------------------------------------------------------
# Honesty
# --------------------------------------------------------------------------------------


def test_ach_inherits_the_honesty_of_the_fans_it_is_built_from(rig) -> None:  # noqa: ANN001
    """A total is only as measured as its parts — the capacity-total rule, applied here."""
    ex = _extras({**ALL_OFF,
                  "fan.dsc_hub_6_inch_exhaust_outside": 60,
                  "fan.dsc_hub_6_inch_exhaust_room": 45})
    attrs = ex["sensor.dsc_ach_4x8"]["attributes"]
    assert attrs["honesty"] == "capacity_proxy_nameplate"
    assert attrs["nameplate_share_pct"] == 100


def test_a_calibrated_fan_makes_its_space_measured(rig) -> None:  # noqa: ANN001
    for step, cfm in {25: 83.2, 50: 124.8, 75: 133.1, 100: 149.8}.items():
        set_helper(f"input_number.dsc_cal_cfm_intake_clone_{step}", cfm)
    ex = _extras({**ALL_OFF, "fan.dsc_hub_4_inch_intake_fan_2x4": 100})
    attrs = ex["sensor.dsc_ach_2x4"]["attributes"]
    assert attrs["honesty"] == "measured_curve"
    assert attrs["exchange_cfm"] == 149.8


def test_tent_air_replaced_is_not_the_same_as_fresh_air(rig) -> None:  # noqa: ANN001
    """RECIRC moves the tent's air into the room; only OUT leaves the building.

    Folding both into one number would read as fresh-air ventilation, so the outside share
    is broken out. Here 462 CFM of exchange contains only 264 CFM that actually leaves.
    """
    ex = _extras({**ALL_OFF,
                  "fan.dsc_hub_6_inch_exhaust_outside": 60,
                  "fan.dsc_hub_6_inch_exhaust_room": 45})
    attrs = ex["sensor.dsc_ach_4x8"]["attributes"]
    assert attrs["exchange_cfm"] == 462.0
    assert attrs["to_outside_cfm"] == 264.0
    assert "tent_air_replaced" in attrs["model"]


def test_exactly_one_fan_vents_outside(rig) -> None:  # noqa: ANN001
    outside = [f.key for f in fan_instances() if f.destination == "outside"]
    assert outside == ["out"]
