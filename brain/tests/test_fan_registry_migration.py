"""The four hardcoded fans must survive becoming data, byte for byte.

`plan-spatial-layout-2026-09-10.md` S1: a fan stops being a name spread across six parallel
4-entry literals and becomes a row. The plan's own rule for that migration is "a test, not a
hope: snapshot every airflow entity before and after and diff", because this path is what
the tents actually breathe through.

So this file is the snapshot. It pins, against a fully-populated fleet:

* every airflow entity's state and its honesty/model attributes;
* the identity of the four fans across all the places that describe them, so the registry
  and the literals it replaces cannot drift apart while both exist.

It is deliberately assertion-heavy and value-explicit. If a refactor changes one number
here, that is the migration having failed, not the test being brittle.
"""

from __future__ import annotations

import time

import pytest

from dsc_brain.compose_store import set_helper
from dsc_brain.computed_ops import (
    CFM_SPECS,
    FAN_PCT_ENTITIES,
    build_computed_hass_states,
    fan_instances,
    invalidate_computed_cache,
)
from dsc_brain.fleet_state import FleetState, SeatState

# Duty per fan, chosen so no two fans share a percentage: a mix-up between two of them
# cannot then produce a passing snapshot.
DUTIES = {
    "fan.dsc_hub_6_inch_exhaust_outside": 60,
    "fan.dsc_hub_6_inch_exhaust_room": 45,
    "fan.dsc_hub_4_inch_intake_fan_main": 30,
    "fan.dsc_hub_4_inch_intake_fan_2x4": 25,
}

NAMEPLATES = {
    "input_number.dsc_cfm_out_max": 440.0,
    "input_number.dsc_cfm_recirc_max": 440.0,
    "input_number.dsc_cfm_intake_main_max": 200.0,
    "input_number.dsc_cfm_intake_clone_max": 200.0,
}

# A real, plausible curve on ONE fan only (the 2x4 intake), so the snapshot covers both
# branches: a measured curve and three nameplate proxies.
CLONE_CURVE = {25: 83.2, 50: 124.8, 75: 133.1, 100: 149.8}

AIRFLOW_ENTITIES = [
    "sensor.dsc_cfm_exhaust_out",
    "sensor.dsc_cfm_exhaust_recirc",
    "sensor.dsc_cfm_intake_main",
    "sensor.dsc_cfm_intake_2x4",
    "sensor.dsc_cfm_intake_capacity_total",
    "sensor.dsc_cfm_exhaust_capacity_total",
    "sensor.dsc_cfm_exhaust_out_allocated",
    "sensor.dsc_cfm_exhaust_recirc_allocated",
    "sensor.dsc_cfm_intake_2x4_allocated",
    "sensor.dsc_cfm_intake_main_allocated",
    "sensor.dsc_cfm_cascade_2x4_allocated",
    "sensor.dsc_flow_net_pressure_cfm",
    "sensor.dsc_cfm_curves_status",
    "binary_sensor.dsc_flow_mass_balance_ok",
]


@pytest.fixture()
def populated(tmp_path, monkeypatch):
    """A hub reporting all four fans, real nameplates, one real curve."""
    monkeypatch.setenv("DSC_DATA", str(tmp_path))
    invalidate_computed_cache()
    for key, val in NAMEPLATES.items():
        set_helper(key, val)
    for step, cfm in CLONE_CURVE.items():
        set_helper(f"input_number.dsc_cal_cfm_intake_clone_{step}", cfm)

    controls = {
        eid: {"state": "on", "percentage": pct, "attributes": {"percentage": pct}}
        for eid, pct in DUTIES.items()
    }
    state = FleetState()
    state.hub = SeatState("hub", True, "10.42.0.1", {"controls": controls}, time.time())
    return state


def _snapshot(state: FleetState) -> dict[str, dict]:
    invalidate_computed_cache()
    extras = build_computed_hass_states(state)
    out: dict[str, dict] = {}
    for eid in AIRFLOW_ENTITIES + list(FAN_PCT_ENTITIES):
        ent = extras.get(eid)
        assert ent is not None, f"{eid} missing from computed states"
        attrs = ent.get("attributes") or {}
        out[eid] = {
            "state": ent.get("state"),
            "honesty": attrs.get("honesty"),
            "model": attrs.get("model"),
            "basis_honesty": attrs.get("basis_honesty"),
            "nameplate_share_pct": attrs.get("nameplate_share_pct"),
        }
    return out


# --------------------------------------------------------------------------------------
# The registry and the literals it replaces must describe the same four fans.
# --------------------------------------------------------------------------------------


def test_the_registry_has_the_four_fans() -> None:
    assert [f.key for f in fan_instances()] == ["out", "recirc", "intake_main", "intake_clone"]


def test_cfm_specs_is_derived_from_the_registry_not_restated() -> None:
    """CFM_SPECS was one of six parallel 4-entry literals. It is now a projection."""
    assert CFM_SPECS == [(f.cfm_id, f.pct_id, f.plate_id, f.cal_prefix) for f in fan_instances()]


def test_every_fan_carries_the_whole_description_of_itself() -> None:
    """The point of the registry: one row says everything, so a fifth fan is one row."""
    for fan in fan_instances():
        assert fan.cfm_id.startswith("sensor.dsc_cfm_")
        assert fan.pct_id in FAN_PCT_ENTITIES
        assert fan.plate_id.startswith("input_number.dsc_cfm_")
        assert fan.cal_prefix.startswith("dsc_cal_cfm_")
        assert fan.fan_entity.startswith("fan.dsc_hub_")
        assert fan.duct_entity.startswith("input_number.dsc_duct_")
        assert fan.duct_default_cm > 0
        assert fan.label
        assert fan.side in ("intake", "exhaust")


def test_fan_pct_entities_agree_with_the_registry() -> None:
    assert {f.pct_id: f.fan_entity for f in fan_instances()} == dict(FAN_PCT_ENTITIES)


def test_sides_are_two_in_two_out() -> None:
    sides = [f.side for f in fan_instances()]
    assert sides.count("exhaust") == 2
    assert sides.count("intake") == 2


# --------------------------------------------------------------------------------------
# The snapshot. These are the numbers the tents breathe through.
# --------------------------------------------------------------------------------------


def test_airflow_snapshot_is_unchanged(populated) -> None:  # noqa: ANN001
    """Captured from the pre-migration code on 2026-09-10. Every value here is a number a
    tent breathes through; a diff is the migration having failed."""
    snap = _snapshot(populated)

    # Duty passes through untouched, one distinct value per fan.
    assert snap["sensor.dsc_fan_exhaust_outside_pct"]["state"] == "60.0"
    assert snap["sensor.dsc_fan_exhaust_room_pct"]["state"] == "45.0"
    assert snap["sensor.dsc_fan_intake_main_pct"]["state"] == "30.0"
    assert snap["sensor.dsc_fan_intake_2x4_pct"]["state"] == "25.0"

    # Three fans have no usable curve, so each is duty x nameplate, said plainly.
    assert snap["sensor.dsc_cfm_exhaust_out"]["state"] == "264.0"  # 60 % of 440
    assert snap["sensor.dsc_cfm_exhaust_out"]["honesty"] == "capacity_proxy_nameplate"
    assert snap["sensor.dsc_cfm_exhaust_out"]["model"] == "linear"
    assert snap["sensor.dsc_cfm_exhaust_recirc"]["state"] == "198.0"  # 45 % of 440
    assert snap["sensor.dsc_cfm_intake_main"]["state"] == "60.0"  # 30 % of 200

    # The 2x4 intake has a real curve, so it is read off the curve and says so.
    assert snap["sensor.dsc_cfm_intake_2x4"]["state"] == "83.2"
    assert snap["sensor.dsc_cfm_intake_2x4"]["honesty"] == "measured_curve"
    assert snap["sensor.dsc_cfm_intake_2x4"]["model"] == "curve"

    # Totals, and the mixed-basis labels that keep each sum honest.
    assert snap["sensor.dsc_cfm_intake_capacity_total"]["state"] == "143.2"
    assert snap["sensor.dsc_cfm_intake_capacity_total"]["honesty"] == "mixed_42pct_nameplate_proxy"
    assert snap["sensor.dsc_cfm_intake_capacity_total"]["nameplate_share_pct"] == 42
    assert snap["sensor.dsc_cfm_exhaust_capacity_total"]["state"] == "462.0"
    assert snap["sensor.dsc_cfm_exhaust_capacity_total"]["honesty"] == "capacity_proxy_nameplate"
    assert snap["sensor.dsc_cfm_exhaust_capacity_total"]["nameplate_share_pct"] == 100

    assert snap["sensor.dsc_flow_net_pressure_cfm"]["state"] == "-318.8"
    assert snap["sensor.dsc_flow_net_pressure_cfm"]["basis_honesty"] == "100pct_of_a_side_is_nameplate_proxy"
    assert snap["sensor.dsc_flow_net_pressure_cfm"]["nameplate_share_pct"] == 100
    assert snap["binary_sensor.dsc_flow_mass_balance_ok"]["state"] == "off"

    # One of four curves is usable; the other three were never calibrated.
    assert snap["sensor.dsc_cfm_curves_status"]["state"] == "1/4 curves"


def test_allocation_splits_by_the_fans_that_are_actually_running(populated) -> None:  # noqa: ANN001
    """Each side is shared out in proportion to the duties on the OTHER side.

    Exhaust is allocated from the intake total (143.2) split 60/45; intake is allocated from
    the exhaust total (462.0) split 30/25. Iterating a registry has to keep pairing the right
    fan with the right duty — swapping two would still sum correctly, so the split is what
    the test actually pins.
    """
    snap = _snapshot(populated)
    assert snap["sensor.dsc_cfm_exhaust_out_allocated"]["state"] == "81.8"  # 143.2 x 60/105
    assert snap["sensor.dsc_cfm_exhaust_recirc_allocated"]["state"] == "61.4"  # 143.2 x 45/105
    assert snap["sensor.dsc_cfm_intake_main_allocated"]["state"] == "252.0"  # 462 x 30/55
    assert snap["sensor.dsc_cfm_intake_2x4_allocated"]["state"] == "210.0"  # 462 x 25/55
    assert snap["sensor.dsc_cfm_cascade_2x4_allocated"]["state"] == "172.8"


def test_a_dark_hub_still_publishes_no_theatre(populated) -> None:  # noqa: ANN001
    """Regression guard carried through the migration: offline is not 0 %."""
    populated.hub = SeatState("hub", False, "10.42.0.1", {"controls": {}}, time.time())
    invalidate_computed_cache()
    extras = build_computed_hass_states(populated)
    for pct_id in FAN_PCT_ENTITIES:
        assert extras[pct_id]["state"] == "unavailable"
