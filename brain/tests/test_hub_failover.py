import time

from dsc_brain.hub_failover import (
    evaluate_failover,
    note_reconnect,
    reset_override,
    should_reassert,
)
from dsc_brain.decision_loop import decision_tick
from dsc_brain.computed_ops import FAN_PCT_ENTITIES, _resolve_hub_tick_stage


def test_resolve_hub_tick_stage_from_grow_stage():
    """Re-assert must not hardcode veg — flower grow_stage → flower family."""
    class _Fleet:
        hub = None

    assert _resolve_hub_tick_stage({"select.dsc_hub_grow_stage": "Flowering"}, _Fleet()) == "flower"
    assert _resolve_hub_tick_stage({"select.dsc_hub_grow_stage": "Vegetative"}, _Fleet()) == "veg"
    assert _resolve_hub_tick_stage({}, _Fleet()) == "veg"


def test_fan_pct_unavailable_when_hub_dark(tmp_path, monkeypatch):
    """Hub offline must not emit available=True fan pct at 0.0 theater."""
    monkeypatch.setenv("DSC_DATA", str(tmp_path))
    from dsc_brain.computed_ops import build_computed_hass_states, invalidate_computed_cache
    from dsc_brain.fleet_state import FleetState, SeatState

    invalidate_computed_cache()
    state = FleetState()
    state.hub = SeatState("hub", False, "0.0.0.0", {"controls": {}}, time.time())
    extras = build_computed_hass_states(state)
    for sensor_id in FAN_PCT_ENTITIES:
        ent = extras[sensor_id]
        assert ent["state"] == "unavailable"
        assert ent["state"] != "0.0"


def test_manual_takeover_helper_wins_in_hass_extras(tmp_path, monkeypatch):
    """Helper persist must surface in hass_extras even when hub control says off."""
    monkeypatch.setenv("DSC_DATA", str(tmp_path))
    from dsc_brain.compose_store import set_helper
    from dsc_brain.computed_ops import build_computed_hass_states, invalidate_computed_cache
    from dsc_brain.fleet_state import FleetState, SeatState

    invalidate_computed_cache()
    set_helper("switch.dsc_hub_manual_takeover", "on")
    state = FleetState()
    state.hub = SeatState(
        "hub",
        True,
        "7.0.0.0",
        {
            "controls": {
                "switch.dsc_hub_manual_takeover": {"state": "off"},
            },
        },
        time.time(),
    )
    extras = build_computed_hass_states(state)
    assert extras["switch.dsc_hub_manual_takeover"]["state"] == "on"

    set_helper("switch.dsc_hub_manual_takeover", "off")
    invalidate_computed_cache()
    extras = build_computed_hass_states(state)
    assert extras["switch.dsc_hub_manual_takeover"]["state"] == "off"


def test_reconnect_with_takeover_sets_override():
    reset_override()
    o = note_reconnect({"sf1000": "on"}, takeover=True, now=1000.0)
    assert o.active is True
    assert should_reassert(o, now=1000.0, ttl_sec=900) is False
    assert should_reassert(o, now=1000.0 + 901, ttl_sec=900) is True


def test_reconnect_without_takeover_no_override():
    reset_override()
    o = note_reconnect({}, takeover=False, now=1000.0)
    assert o.active is False


def test_ttl_under_takeover_then_clear_forces_reassert():
    """TTL while takeover stays ON must sticky-pending; clear later → re-assert."""
    reset_override()
    note_reconnect({"sf1000": "on"}, takeover=True, now=1000.0)

    # Wait >900s with takeover still ON — binary clears, pending sticks, no emit yet.
    o_ttl, force_ttl = evaluate_failover(takeover=True, now=1000.0 + 901, ttl_sec=900)
    assert o_ttl.active is False
    assert o_ttl.pending_reassert is True
    assert force_ttl is False

    # Clear takeover after TTL already fired → force_reassert / emit true.
    tick = decision_tick(
        seat="hub",
        strain_id=None,
        stage="veg",
        manual_takeover=False,
        emit=False,
        now=1000.0 + 902,
        ttl_sec=900,
    )
    assert tick["safety"]["force_reassert"] is True
    assert tick["safety"]["emit"] is True
