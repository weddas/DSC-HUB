"""Generic Zigbee datapoint exposure (plan Phase 4, 2026-09-06).

A bound device of *any* role must reach the fleet as entities the rule engine can
trigger on — not just temperature / humidity. Unbound devices never do.
"""

from __future__ import annotations

import tempfile
from pathlib import Path

import pytest

from dsc_brain.settings import init_settings_db


@pytest.fixture()
def temp_db(monkeypatch: pytest.MonkeyPatch) -> Path:
    with tempfile.TemporaryDirectory() as tmp:
        db = Path(tmp) / "dsc_ops.sqlite3"
        monkeypatch.setenv("DSC_DATA", str(Path(tmp)))
        monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", db)
        init_settings_db(db)
        yield db


class _Msg:
    def __init__(self, topic: str, payload: bytes) -> None:
        self.topic = topic
        self.payload = payload


def _ingest_bound(monkeypatch: pytest.MonkeyPatch, ieee: str, friendly: str, role: str, payload: bytes):
    monkeypatch.setattr("dsc_brain.appliance_driver.force_set_sonoff_relay_sync", lambda *_a, **_k: None)
    from dsc_brain.zigbee_mqtt import _ingest, save_zigbee_bindings

    save_zigbee_bindings({ieee: {"role": role, "zone": "4x8", "enabled": True, "friendly_name": friendly}})
    _ingest._devices = [{"ieee_address": ieee, "friendly_name": friendly, "type": "EndDevice"}]
    _ingest._by_role = {}
    _ingest._by_placement = {}
    _ingest._canopy = {}
    _ingest._on_message(None, None, _Msg(f"zigbee2mqtt/{friendly}", payload))
    return _ingest


def _states():
    from dsc_brain.fleet_state import get_fleet_state
    from dsc_brain.settings import list_inventory

    return get_fleet_state().to_hass_states(list_inventory())


def test_co2_role_reaches_fleet_entities(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    ingest = _ingest_bound(monkeypatch, "0xco2", "air_1", "co2_tent", b'{"co2": 812, "voc": 30, "linkquality": 120}')

    row = ingest._by_role["co2_tent"]
    assert row["co2"] == 812 and row["kind"] == "gas"

    states = _states()
    co2 = states["sensor.dsc_zigbee_co2_tent_co2"]
    assert float(co2["state"]) == 812
    assert co2["attributes"]["unit_of_measurement"] == "ppm"
    assert co2["attributes"]["zigbee_role"] == "co2_tent"
    assert float(states["sensor.dsc_zigbee_co2_tent_voc"]["state"]) == 30
    # device health is exported too (battery < 20 rules), unit from the fallback table
    assert states["sensor.dsc_zigbee_co2_tent_linkquality"]["attributes"]["unit_of_measurement"] == "lqi"


def test_contact_role_is_binary_sensor_not_leak(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    ingest = _ingest_bound(monkeypatch, "0xdoor", "door_1", "door_tent", b'{"contact": false, "battery": 88}')

    row = ingest._by_role["door_tent"]
    assert row["kind"] == "safety"
    assert "wet" not in row  # contact is not the leak Wet/Dry path

    states = _states()
    assert states["binary_sensor.dsc_zigbee_door_tent_contact"]["state"] == "off"
    assert float(states["sensor.dsc_zigbee_door_tent_battery"]["state"]) == 88


def test_leak_roles_keep_wet_dry_normalisation(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    ingest = _ingest_bound(monkeypatch, "0xleak", "floor_1", "leak_floor_4x8", b'{"water_leak": true}')

    row = ingest._by_role["leak_floor_4x8"]
    assert row["kind"] == "safety" and row["wet"] is True

    states = _states()
    assert states["binary_sensor.dsc_zigbee_leak_floor_4x8_wet"]["state"] == "on"
    assert states["binary_sensor.dsc_zigbee_leak_floor_4x8_water_leak"]["state"] == "on"


def test_unbound_device_is_never_exported(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("dsc_brain.appliance_driver.force_set_sonoff_relay_sync", lambda *_a, **_k: None)
    from dsc_brain.zigbee_mqtt import _ingest, save_zigbee_bindings

    save_zigbee_bindings({})
    _ingest._devices = [{"ieee_address": "0xnew", "friendly_name": "mystery", "type": "EndDevice"}]
    _ingest._by_role = {}
    _ingest._by_placement = {}
    _ingest._canopy = {}
    _ingest._on_message(None, None, _Msg("zigbee2mqtt/mystery", b'{"co2": 999, "temperature": 30}'))

    assert "mystery" in _ingest._device_states
    assert not _ingest._by_role
    assert not [eid for eid in _states() if ".dsc_zigbee_" in eid]


def test_climate_rows_still_carry_kind_and_canopy(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    ingest = _ingest_bound(monkeypatch, "0xcan", "canopy_1", "canopy_4x8", b'{"temperature": 25.4, "humidity": 44}')

    assert ingest._by_role["canopy_4x8"]["kind"] == "climate"
    assert ingest._canopy.get("temp_c") == 25.4
    states = _states()
    assert float(states["sensor.dsc_zigbee_canopy_4x8_temperature"]["state"]) == 25.4
    assert states["sensor.dsc_zigbee_canopy_4x8_temperature"]["attributes"]["unit_of_measurement"] == "°C"


def test_rule_engine_timestamp_source_covers_every_zigbee_entity() -> None:
    from dsc_brain.automation_rules import timestamp_source

    assert timestamp_source("sensor.dsc_zigbee_co2_tent_co2") == "zigbee"
    assert timestamp_source("binary_sensor.dsc_zigbee_door_tent_contact") == "zigbee"
    assert timestamp_source("sensor.dsc_zigbee_canopy_4x8_temperature") == "zigbee"
    assert timestamp_source("sensor.dsc_hub_tent_temperature") == "hub"


def test_automation_targets_list_live_zigbee_entities(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    _ingest_bound(monkeypatch, "0xlux", "lux_1", "lux_canopy", b'{"illuminance_lux": 14200}')
    from dsc_brain.automation_rules import automation_targets

    targets = automation_targets()
    ents = {e["entity_id"]: e for e in targets["entities"]}
    lux = ents["sensor.dsc_zigbee_lux_canopy_illuminance_lux"]
    assert lux["unit"] == "lx" and lux["kind"] == "number" and lux["role"] == "lux_canopy"
    assert "binary_sensor.dsc_zigbee_" in targets["age_prefixes"]


def test_bound_stub_carries_kind(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("dsc_brain.appliance_driver.force_set_sonoff_relay_sync", lambda *_a, **_k: None)
    from dsc_brain.zigbee_mqtt import _ingest, _reapply_bindings_to_fleet, save_zigbee_bindings

    _ingest._device_states = {}
    _ingest._devices = []
    save_zigbee_bindings({"0xm": {"role": "meter_wall", "zone": "room", "enabled": True, "friendly_name": "meter"}})
    _reapply_bindings_to_fleet()
    stub = _ingest._by_role["meter_wall"]
    assert stub["bound_stub"] is True and stub["kind"] == "meter"
    # a stub has no datapoints -> nothing exported yet (honest: no faked readings)
    assert not [eid for eid in _states() if "dsc_zigbee_meter_wall" in eid]
