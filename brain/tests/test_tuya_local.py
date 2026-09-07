"""Tuya local lane — store, normalisation, honesty states, bindings, entities, rules, routes.

No network: a fake device with the tinytuya surface is injected through
``tuya_local._make_device``. The worker thread is never started here (the lane is
driven through ``ingest`` / ``mark_link``), which is the same path the thread uses.
"""

from __future__ import annotations

import json
import time
from pathlib import Path
from typing import Any

import pytest

PLUG_ID = "bf0123456789abcdef"
TESTER_ID = "bfwater0123456789ab"


class FakeTuyaDevice:
    """Enough of tinytuya.Device for the lane: status / set_value / receive / close."""

    instances: list["FakeTuyaDevice"] = []
    next_status: dict[str, Any] = {"dps": {"1": False, "19": 0}}

    def __init__(self, row: dict[str, Any]) -> None:
        self.row = row
        self.calls: list[tuple[str, Any]] = []
        self.persistent = False
        self.timeout = None
        FakeTuyaDevice.instances.append(self)

    def set_socketPersistent(self, on: bool) -> None:  # noqa: N802 - tinytuya name
        self.persistent = on

    def set_socketTimeout(self, s: float) -> None:  # noqa: N802
        self.timeout = s

    def status(self, nowait: bool = False) -> dict[str, Any]:
        self.calls.append(("status", nowait))
        return dict(FakeTuyaDevice.next_status)

    def set_value(self, index: int, value: Any, nowait: bool = False) -> dict[str, Any]:
        self.calls.append(("set_value", (index, value)))
        # A real plug echoes the DPS it just changed.
        return {"dps": {str(index): value}}

    def receive(self) -> None:
        time.sleep(0.05)  # a real socket blocks up to SOCKET_TIMEOUT_S; keep the worker loop polite
        return None

    def heartbeat(self, nowait: bool = True) -> None:
        self.calls.append(("heartbeat", nowait))

    def close(self) -> None:
        self.calls.append(("close", None))


@pytest.fixture()
def lane(temp_db: Path, monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", temp_db)
    from dsc_brain import tuya_local
    from dsc_brain.fleet_state import FleetState, update_fleet_state

    update_fleet_state(FleetState())
    FakeTuyaDevice.instances.clear()
    FakeTuyaDevice.next_status = {"dps": {"1": False, "19": 0}}
    monkeypatch.setattr(tuya_local, "_make_device", FakeTuyaDevice)
    fresh = tuya_local.TuyaLane()
    monkeypatch.setattr(tuya_local, "_lane", fresh)
    # The module registered the original lane's role rows at import; point the
    # provider at this test's lane so merged buckets read the right one.
    from dsc_brain import zigbee_mqtt

    monkeypatch.setattr(zigbee_mqtt, "_ROLE_PROVIDERS", [fresh.role_rows])
    zigbee_mqtt._ingest._by_role = {}
    zigbee_mqtt._ingest._device_states = {}
    yield fresh
    fresh.stop()


def _wizard_entries() -> list[dict[str, Any]]:
    return [
        {"name": "Tent pump plug", "id": PLUG_ID, "key": "0123456789abcdef", "ip": "192.168.1.61", "version": "3.4"},
        {"name": "Reservoir tester", "id": TESTER_ID, "key": "fedcba9876543210", "ip": "", "version": "3.3"},
        {"name": "no key", "id": "bfnokey000000000000"},
    ]


def _register_plug(lane) -> None:
    from dsc_brain.tuya_local import import_devices_json, save_tuya_bindings, update_tuya_device

    import_devices_json(_wizard_entries())
    update_tuya_device(PLUG_ID, {"type": "smart_plug"})
    save_tuya_bindings({PLUG_ID: {"role": "plug_pump", "zone": "4x8", "alias": "Pump"}})


# ---- store ------------------------------------------------------------------


def test_import_upserts_and_reports_missing_ip(lane) -> None:
    from dsc_brain.tuya_local import import_devices_json, load_tuya_devices, public_device

    result = import_devices_json(_wizard_entries())
    assert set(result["imported"]) == {PLUG_ID, TESTER_ID}
    assert result["missing_ip"] == [TESTER_ID]
    assert result["skipped"] and result["skipped"][0]["reason"].startswith("no local key")
    devices = load_tuya_devices()
    assert devices[PLUG_ID]["ip"] == "192.168.1.61"
    assert devices[PLUG_ID]["version"] == "3.4"
    assert devices[PLUG_ID]["type"] == ""  # type is chosen after a probe, never guessed silently
    pub = public_device(devices[PLUG_ID])
    assert "local_key" not in pub and pub["local_key_set"] is True

    # Re-import with a new key keeps everything else (type set meanwhile).
    from dsc_brain.tuya_local import update_tuya_device

    update_tuya_device(PLUG_ID, {"type": "smart_plug"})
    import_devices_json([{"id": PLUG_ID, "name": "Tent pump plug", "key": "newkey00000000"}])
    devices = load_tuya_devices()
    assert devices[PLUG_ID]["local_key"] == "newkey00000000"
    assert devices[PLUG_ID]["type"] == "smart_plug"
    assert devices[PLUG_ID]["dps_map"]["state"] == 1


def test_import_rejects_non_list(lane) -> None:
    from dsc_brain.tuya_local import import_devices_json

    with pytest.raises(ValueError):
        import_devices_json("nope")


def test_update_validates_and_applies_type_defaults(lane) -> None:
    from dsc_brain.tuya_local import import_devices_json, load_tuya_devices, update_tuya_device

    import_devices_json(_wizard_entries())
    with pytest.raises(ValueError):
        update_tuya_device(PLUG_ID, {"type": "toaster"})
    with pytest.raises(ValueError):
        update_tuya_device(PLUG_ID, {"ip": "not-an-ip"})
    with pytest.raises(ValueError):
        update_tuya_device(PLUG_ID, {"version": "9.9"})
    with pytest.raises(KeyError):
        update_tuya_device("bfmissing0000000000", {"name": "x"})
    row = update_tuya_device(TESTER_ID, {"type": "water_tester", "ip": "192.168.1.62"})
    assert row["dps_map"]["ph"] == 106 and row["scales"]["ph"] == 0.01
    # Operator override of one DPS keeps the rest of the map explicit.
    row = update_tuya_device(TESTER_ID, {"dps_map": {"ph": 101, "ec": 102}})
    assert load_tuya_devices()[TESTER_ID]["dps_map"] == {"ph": 101, "ec": 102}


# ---- normalisation + honesty -------------------------------------------------


def test_ingest_scales_dps_and_feeds_role_buckets(lane) -> None:
    from dsc_brain.fleet_state import get_fleet_state
    from dsc_brain.settings import list_inventory

    _register_plug(lane)
    lane.ingest(PLUG_ID, {"1": True, "19": 1234, "18": 520, "20": 2381, "17": 15})
    states = lane.device_states()
    row = states[PLUG_ID]
    assert row["state"] is True
    assert row["power"] == pytest.approx(123.4)
    assert row["current"] == pytest.approx(0.52)
    assert row["voltage"] == pytest.approx(238.1)
    assert row["link"] == "live" and row["lane"] == "tuya"
    assert row["friendly_name"] == "Pump"  # alias wins for display

    fleet = get_fleet_state()
    by_role = fleet.system["zigbee_by_role"]
    assert by_role["plug_pump"]["device_id"] == PLUG_ID
    assert by_role["plug_pump"]["kind"] == "plug"
    assert fleet.system["tuya_health"]["live"] == 1 and fleet.system["tuya_health"]["enabled_count"] == 1
    # Entities carry the lane in their id, never "zigbee" for a Wi-Fi plug.
    hass = fleet.to_hass_states(list_inventory())
    assert hass["binary_sensor.dsc_tuya_plug_pump_state"]["state"] == "on"
    assert hass["sensor.dsc_tuya_plug_pump_power"]["attributes"]["unit_of_measurement"] == "W"
    assert not any(k.startswith("sensor.dsc_zigbee_plug_pump") for k in hass)


def test_link_goes_stale_then_offline_by_age(lane, monkeypatch: pytest.MonkeyPatch) -> None:
    from dsc_brain import tuya_local

    _register_plug(lane)
    lane.ingest(PLUG_ID, {"1": False})
    t0 = lane._updated_at[PLUG_ID]
    row = lane.device_states()[PLUG_ID]
    assert row["link"] == "live"
    monkeypatch.setattr(tuya_local.time, "time", lambda: t0 + tuya_local.LIVE_S + 1)
    assert lane.device_states()[PLUG_ID]["link"] == "stale"
    monkeypatch.setattr(tuya_local.time, "time", lambda: t0 + tuya_local.OFFLINE_S + 1)
    assert lane.device_states()[PLUG_ID]["link"] == "offline"
    # A worker-reported key failure is its own state, with the re-import hint.
    monkeypatch.setattr(tuya_local.time, "time", lambda: t0 + 1)
    lane.mark_link(PLUG_ID, "key_changed", "914")
    assert lane.device_states()[PLUG_ID]["link"] == "key_changed"
    assert "re-paired" in lane.health()["note"].lower() or "decrypt" in lane.health()["note"].lower()


def test_write_pending_synced_differs(lane) -> None:
    from dsc_brain.tuya_local import set_tuya_state

    _register_plug(lane)
    lane.ingest(PLUG_ID, {"1": False})
    # No worker alive → one-shot write through the fake device, which echoes DPS 1.
    result = set_tuya_state(PLUG_ID, True)
    assert result["ok"] and result["queued"] is False
    dev = FakeTuyaDevice.instances[-1]
    assert ("set_value", (1, True)) in dev.calls and ("close", None) in dev.calls
    row = lane.device_states()[PLUG_ID]
    assert row["state"] is True and row["write_state"] == "synced" and row["commanded"] is True
    # Someone flips it in the SmartLife app: the next report disagrees with what we commanded.
    lane.ingest(PLUG_ID, {"1": False})
    assert lane.device_states()[PLUG_ID]["write_state"] == "differs"
    # Unknown device / no switch datapoint never raise.
    assert set_tuya_state("bfnobody00000000000", True)["ok"] is False


def test_write_failure_is_reported_not_raised(lane, monkeypatch: pytest.MonkeyPatch) -> None:
    from dsc_brain import tuya_local
    from dsc_brain.tuya_local import set_tuya_state

    _register_plug(lane)

    class Broken(FakeTuyaDevice):
        def set_value(self, index: int, value: Any, nowait: bool = False) -> dict[str, Any]:
            return {"Error": "Network Error: Unable to Connect", "Err": "901", "Payload": None}

    monkeypatch.setattr(tuya_local, "_make_device", Broken)
    result = set_tuya_state(PLUG_ID, True)
    assert result["ok"] is False and "Connect" in result["error"]
    row = lane.device_states()[PLUG_ID]
    assert row["write_state"] == "failed"


def test_probe_reports_hint_and_guesses_type(lane, monkeypatch: pytest.MonkeyPatch) -> None:
    from dsc_brain import tuya_local
    from dsc_brain.tuya_local import import_devices_json, probe_tuya_device

    import_devices_json(_wizard_entries())
    FakeTuyaDevice.next_status = {"dps": {"1": True, "9": 0, "17": 3, "18": 10, "19": 55, "20": 2400}}
    result = probe_tuya_device(PLUG_ID)
    assert result["ok"] and result["guess_type"] == "smart_plug" and result["dps"]["19"] == 55
    # The probe's report is ingested so the row is live before a type is even chosen.
    assert lane._raw[PLUG_ID]["19"] == 55

    class BadKey(FakeTuyaDevice):
        def status(self, nowait: bool = False) -> dict[str, Any]:
            return {"Error": "Check device key or version", "Err": "914", "Payload": None}

    monkeypatch.setattr(tuya_local, "_make_device", BadKey)
    bad = probe_tuya_device(PLUG_ID)
    assert bad["ok"] is False and bad["err_code"] == "914" and "wizard" in bad["hint"]
    # Unregistered probe needs ip + key.
    assert probe_tuya_device(None, ip="", local_key="")["ok"] is False
    assert probe_tuya_device(TESTER_ID)["ok"] is False  # no ip yet


def test_water_tester_datapoints(lane) -> None:
    from dsc_brain.fleet_state import get_fleet_state
    from dsc_brain.settings import list_inventory
    from dsc_brain.tuya_local import import_devices_json, save_tuya_bindings, update_tuya_device

    import_devices_json(_wizard_entries())
    update_tuya_device(TESTER_ID, {"type": "water_tester", "ip": "192.168.1.62"})
    save_tuya_bindings({TESTER_ID: {"role": "reservoir_4x8", "zone": "4x8"}})
    lane.ingest(TESTER_ID, {"8": 213, "106": 612, "111": 840, "116": 1680, "126": 1003})
    row = lane.device_states()[TESTER_ID]
    assert row["water_temperature"] == pytest.approx(21.3)
    assert row["ph"] == pytest.approx(6.12)
    assert row["tds"] == 840 and row["ec"] == 1680
    assert row["specific_gravity"] == pytest.approx(1.003)
    assert "orp" not in row  # DPS the unit never sent do not appear
    hass = get_fleet_state().to_hass_states(list_inventory())
    assert hass["sensor.dsc_tuya_reservoir_4x8_ph"]["attributes"]["unit_of_measurement"] == "pH"
    assert hass["sensor.dsc_tuya_reservoir_4x8_ec"]["attributes"]["unit_of_measurement"] == "µS/cm"


# ---- bindings ----------------------------------------------------------------


def test_bindings_validate_and_conflict_across_lanes(lane) -> None:
    from dsc_brain.tuya_local import get_tuya_devices, import_devices_json, save_tuya_bindings, update_tuya_device
    from dsc_brain.zigbee_mqtt import save_zigbee_bindings

    import_devices_json(_wizard_entries())
    update_tuya_device(PLUG_ID, {"type": "smart_plug"})
    with pytest.raises(ValueError):
        save_tuya_bindings({PLUG_ID: {"role": "no_such_role"}})
    with pytest.raises(ValueError):
        save_tuya_bindings({PLUG_ID: {"role": "plug_pump", "zone": "attic"}})
    save_tuya_bindings({PLUG_ID: {"role": "plug_pump", "zone": "4x8"}})
    assert next(d for d in get_tuya_devices() if d["id"] == PLUG_ID)["status"] == "bound"
    # A Zigbee plug claiming the same role → both lanes see CONFLICT, nothing silently wins.
    save_zigbee_bindings({"0xzb1": {"role": "plug_pump", "zone": "4x8", "friendly_name": "zb_plug"}})
    assert next(d for d in get_tuya_devices() if d["id"] == PLUG_ID)["status"] == "conflict"


def test_bound_stub_before_first_report(lane) -> None:
    from dsc_brain.fleet_state import get_fleet_state

    _register_plug(lane)
    row = get_fleet_state().system["zigbee_by_role"]["plug_pump"]
    assert row["bound_stub"] is True and row["updated_at"] is None
    assert row["link"] == "offline"


def test_delete_refused_while_a_rule_targets_it(lane) -> None:
    from dsc_brain.automation_rules import save_automation_rules
    from dsc_brain.tuya_local import delete_tuya_device, load_tuya_bindings, load_tuya_devices

    _register_plug(lane)
    save_automation_rules(
        [
            {
                "id": "pump_on_hot",
                "name": "Pump when hot",
                "enabled": False,
                "trigger": {"entity_id": "sensor.dsc_hub_tent_temperature", "op": "gt", "value": 30},
                "action": {"type": "tuya_switch", "params": {"device_id": PLUG_ID}},
            }
        ]
    )
    with pytest.raises(ValueError) as exc:
        delete_tuya_device(PLUG_ID)
    assert "Pump when hot" in str(exc.value)
    save_automation_rules([])
    delete_tuya_device(PLUG_ID)
    assert PLUG_ID not in load_tuya_devices() and PLUG_ID not in load_tuya_bindings()
    with pytest.raises(KeyError):
        delete_tuya_device(PLUG_ID)


# ---- rule engine -------------------------------------------------------------


def test_tuya_switch_action_and_clear(lane, monkeypatch: pytest.MonkeyPatch) -> None:
    from dsc_brain.automation_rules import evaluate_automation_rules, save_automation_rules
    from dsc_brain.fleet_state import get_fleet_state, update_fleet_state
    from dsc_brain.tuya_local import actuatable_tuya_devices

    _register_plug(lane)
    assert actuatable_tuya_devices() == [
        {"lane": "tuya", "id": PLUG_ID, "device_id": PLUG_ID, "friendly_name": "Pump", "alias": "Pump", "role": "plug_pump"}
    ]
    calls: list[tuple[str, bool]] = []
    monkeypatch.setattr(
        "dsc_brain.tuya_local.set_tuya_state",
        lambda did, on: calls.append((did, on)) or {"ok": True},
    )
    with pytest.raises(ValueError):
        save_automation_rules([{"id": "x", "name": "x", "enabled": True, "trigger": {"entity_id": "sensor.a", "op": "gt", "value": 1}, "action": {"type": "tuya_switch", "params": {}}}])
    save_automation_rules(
        [
            {
                "id": "hot_pump",
                "name": "Pump when hot",
                "enabled": True,
                "trigger": {"entity_id": "sensor.dsc_hub_tent_temperature", "op": "gt", "value": 30},
                "action": {"type": "tuya_switch", "params": {"device_id": PLUG_ID}},
            }
        ]
    )

    def fleet(temp_c: float) -> None:
        f = get_fleet_state()
        f.hub.online = True
        f.hub.values["temp_c"] = temp_c
        update_fleet_state(f)

    fleet(35.0)
    evaluate_automation_rules()
    assert (PLUG_ID, True) in calls
    fleet(20.0)
    evaluate_automation_rules()
    assert (PLUG_ID, False) in calls


def test_rule_age_resolves_for_tuya_entities(lane) -> None:
    from dsc_brain.automation_rules import AGE_PREFIXES, timestamp_source
    from dsc_brain.automation_rules import _entity_timestamp
    from dsc_brain.fleet_state import get_fleet_state

    _register_plug(lane)
    lane.ingest(PLUG_ID, {"1": True})
    assert "sensor.dsc_tuya_" in AGE_PREFIXES
    assert timestamp_source("binary_sensor.dsc_tuya_plug_pump_state") == "zigbee"
    ts = _entity_timestamp(get_fleet_state(), "binary_sensor.dsc_tuya_plug_pump_state")
    assert ts == pytest.approx(lane._updated_at[PLUG_ID])


# ---- routes ------------------------------------------------------------------


def test_routes_round_trip(lane) -> None:
    from fastapi.testclient import TestClient

    from dsc_brain.api import app

    with TestClient(app) as client:
        r = client.post("/settings/tuya/devices/import", json={"devices": _wizard_entries()})
        assert r.status_code == 200 and r.json()["missing_ip"] == [TESTER_ID]
        r = client.get("/settings/tuya/device-types")
        assert {t["id"] for t in r.json()["device_types"]} >= {"smart_plug", "smart_switch", "water_tester"}
        r = client.put(f"/settings/tuya/devices/{PLUG_ID}", json={"type": "smart_plug"})
        assert r.status_code == 200 and r.json()["local_key_set"] is True and "local_key" not in r.json()
        r = client.put(f"/settings/tuya/devices/{PLUG_ID}", json={"type": "kettle"})
        assert r.status_code == 400
        r = client.put("/settings/tuya/bindings", json={"bindings": {PLUG_ID: {"role": "plug_pump", "zone": "4x8"}}})
        assert r.status_code == 200 and r.json()["bindings"][PLUG_ID]["role"] == "plug_pump"
        r = client.get("/settings/tuya/devices")
        body = r.json()
        plug = next(d for d in body["devices"] if d["id"] == PLUG_ID)
        # The lifespan started the lane: a worker opened the fake device with a
        # persistent socket and its first status() report made the row live.
        assert plug["status"] == "bound" and plug["state"]["link"] == "live" and "local_key" not in plug
        assert any(d.persistent and d.timeout == 2.0 for d in FakeTuyaDevice.instances)
        assert body["health"]["device_count"] == 2
        r = client.get("/settings/devices/actuatable")
        assert [d["lane"] for d in r.json()["devices"]] == ["tuya"]
        r = client.post(f"/settings/tuya/devices/{PLUG_ID}/probe")
        assert r.status_code == 200 and r.json()["ok"] is True
        r = client.post(f"/settings/tuya/devices/{PLUG_ID}/set", json={"on": True})
        assert r.status_code == 200 and r.json()["state"] == "ON"
        r = client.delete(f"/settings/tuya/devices/{PLUG_ID}")
        assert r.status_code == 200
        r = client.delete(f"/settings/tuya/devices/{PLUG_ID}")
        assert r.status_code == 404
        r = client.get("/health")
        assert "tuya" in r.json()
