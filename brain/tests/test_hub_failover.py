from dsc_brain.hub_failover import note_reconnect, should_reassert


def test_reconnect_with_takeover_sets_override():
    o = note_reconnect({"sf1000": "on"}, takeover=True, now=1000.0)
    assert o.active is True
    assert should_reassert(o, now=1000.0, ttl_sec=900) is False
    assert should_reassert(o, now=1000.0 + 901, ttl_sec=900) is True


def test_reconnect_without_takeover_no_override():
    o = note_reconnect({}, takeover=False, now=1000.0)
    assert o.active is False
