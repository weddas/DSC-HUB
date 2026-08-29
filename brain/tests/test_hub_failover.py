from dsc_brain.hub_failover import (
    evaluate_failover,
    note_reconnect,
    reset_override,
    should_reassert,
)
from dsc_brain.decision_loop import decision_tick


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
