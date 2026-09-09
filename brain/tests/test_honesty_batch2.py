"""Quality scores, held flags, canopy zones, rule ids, alert-pref removal, update unknown."""

from __future__ import annotations

from pathlib import Path

import pytest


def test_quality_penalises_impossible_readings():
    from dsc_brain.soil_tests import _plausibility_penalty

    pen, why = _plausibility_penalty({"moisture_pct": 40.0, "ec_us": 0.0, "ph": 7.9, "nitrogen": 0, "potassium": 0, "phosphorus": None})
    # EC 0 (+50) and N/P/K all zero (+20) in wet media; pH 7.9 is inside 3-9 so no pH penalty.
    assert pen == 70 and "EC 0 in wet media" in why and "N/P/K all zero in wet media" in why
    pen, why = _plausibility_penalty({"moisture_pct": 100.0, "ec_us": 300.0, "ph": 2.1})
    assert pen == 80 and "moisture on a rail" in why and "pH outside 3-9" in why
    pen, why = _plausibility_penalty({"moisture_pct": 40.0, "ec_us": 900.0, "ph": 6.2, "nitrogen": 30, "potassium": 90, "phosphorus": 20})
    assert pen == 0 and why == []


def test_held_flag_needs_the_condition_to_persist():
    from dsc_brain import computed_ops as co

    co._FLAG_STATE.clear()
    eid = "binary_sensor.test_latch"
    assert co._held_flag(eid, True, on_after_s=600, off_after_s=300, now=0.0) is False
    assert co._held_flag(eid, True, on_after_s=600, off_after_s=300, now=300.0) is False
    assert co._held_flag(eid, False, on_after_s=600, off_after_s=300, now=400.0) is False  # flicker resets
    assert co._held_flag(eid, True, on_after_s=600, off_after_s=300, now=500.0) is False
    assert co._held_flag(eid, True, on_after_s=600, off_after_s=300, now=1100.0) is True
    assert co._held_flag(eid, False, on_after_s=600, off_after_s=300, now=1200.0) is True  # holds
    assert co._held_flag(eid, False, on_after_s=600, off_after_s=300, now=1500.0) is False


def test_capacity_honesty_follows_components():
    from dsc_brain.computed_ops import _capacity_honesty

    states = {
        "a": {"attributes": {"honesty": "measured_curve"}},
        "b": {"attributes": {"honesty": "capacity_proxy_nameplate"}},
    }
    hon, share = _capacity_honesty(states, {"a": 8.6, "b": 110.0}, ("a", "b"))
    assert share == 93 and hon == "mixed_93pct_nameplate_proxy"
    assert _capacity_honesty(states, {"a": 10.0}, ("a",)) == ("measured_curve", 0)
    assert _capacity_honesty(states, {"b": 10.0}, ("b",)) == ("capacity_proxy_nameplate", 100)


def test_canopy_zones_keep_both_sensors():
    from dsc_brain.zigbee_mqtt import _recompute_canopy

    by_role = {
        "canopy_4x8": {"temperature": 22.6, "humidity": 51.0, "updated_at": 1.0, "friendly_name": "a"},
        "canopy_2x4": {"temperature": 26.3, "humidity": 47.0, "updated_at": 2.0, "friendly_name": "b"},
    }
    c = _recompute_canopy(by_role)
    assert c["role"] == "canopy_4x8" and c["temp_c"] == 22.6  # legacy slot unchanged
    assert c["zones"]["2x4"]["temp_c"] == 26.3 and c["zones"]["2x4"]["rh_pct"] == 47.0


def test_uppercase_rule_id_is_rejected():
    from dsc_brain.automation_rules import _normalize_rule

    with pytest.raises(ValueError, match="lowercase"):
        _normalize_rule({"id": "BadID", "trigger": {"entity_id": "sensor.x", "op": "gt", "value": 1}, "action": {"type": "banner", "params": {"text": "t"}}})


def test_alert_pref_null_removes(temp_db: Path, monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.alert_prefs import get_alert_prefs, patch_alert_prefs

    eid = "binary_sensor.dsc_hub_climate_sensor_fault"
    patch_alert_prefs({"alerts": {eid: {"severity": "info"}}})
    assert get_alert_prefs()["alerts"][eid]["severity"] == "info"
    patch_alert_prefs({"alerts": {eid: None}})
    assert eid not in get_alert_prefs()["alerts"]


def test_pot_raw_channel_never_shadows_calibrated():
    import asyncio
    from types import SimpleNamespace

    from dsc_brain import esphome_client as ec

    class FakeClient:
        def __init__(self):
            self._cb = None

        async def connect(self, login=True):
            return None

        async def device_info(self):
            return SimpleNamespace(esphome_version="2026.8.2", mac_address="F0:24:F9:59:C3:14")

        async def list_entities_services(self):
            ents = [
                SimpleNamespace(key=1, object_id="soil_moisture"),
                SimpleNamespace(key=2, object_id="soil_moisture_raw"),
            ]
            return ents, []

        def subscribe_states(self, cb):
            cb(SimpleNamespace(key=2, state=19.9))  # raw arrives first...
            cb(SimpleNamespace(key=1, state=20.9))  # ...then calibrated
            cb(SimpleNamespace(key=2, state=19.9))  # ...and raw again, last
            return lambda: None

        async def disconnect(self):
            return None

    monkeypatch_target = ec
    orig_make, orig_sleep = monkeypatch_target.make_api_client, asyncio.sleep
    monkeypatch_target.make_api_client = lambda host, key: FakeClient()

    async def fast_sleep(_s):
        return None

    ec.asyncio.sleep = fast_sleep
    try:
        out = asyncio.run(ec._fetch_device("10.0.0.21", "", "pot", "pot1"))
    finally:
        monkeypatch_target.make_api_client = orig_make
        ec.asyncio.sleep = orig_sleep
    values = out["values"]
    assert values["moisture_pct"] == 20.9  # calibrated wins regardless of arrival order
    assert values["moisture_pct_raw"] == 19.9
    assert values["mac"] == "F0:24:F9:59:C3:14"
