"""Brain unit tests."""

import os
import tempfile
from pathlib import Path

import pytest

from dsc_brain import __version__
from dsc_brain.fleet_state import FleetState, SeatState, get_fleet_state, update_fleet_state
from dsc_brain.settings import (
    get_all_settings,
    init_settings_db,
    list_inventory,
    list_roster,
    record_history,
    upsert_roster,
)


@pytest.fixture()
def temp_db(monkeypatch: pytest.MonkeyPatch) -> Path:
    with tempfile.TemporaryDirectory() as tmp:
        db = Path(tmp) / "dsc_ops.sqlite3"
        monkeypatch.setenv("DSC_DATA", str(Path(tmp)))
        init_settings_db(db)
        yield db


def test_version_is_pi_train() -> None:
    assert __version__.startswith("7.0.0")


def test_settings_defaults(temp_db: Path) -> None:
    settings = get_all_settings(temp_db)
    assert settings["ap_ssid"] == "DSC-Brain"
    assert "cannalib_api_url" in settings
    inv = list_inventory(temp_db)
    seat_ids = {r["seat_id"] for r in inv}
    assert "hub" in seat_ids
    assert "pot1" in seat_ids


def test_roster_upsert(temp_db: Path) -> None:
    row = upsert_roster("pot1", {"strain_id": "generic_photoperiod", "stage": "veg"}, temp_db)
    assert row["strain_id"] == "generic_photoperiod"
    roster = list_roster(temp_db)
    assert len(roster) == 1


def test_inventory_no_bridge(temp_db: Path) -> None:
    inv = list_inventory(temp_db)
    seat_ids = {r["seat_id"] for r in inv}
    assert "bridge" not in seat_ids


def test_appliance_demand_map() -> None:
    from dsc_brain.appliance_driver import DEMAND_TO_SEAT

    assert DEMAND_TO_SEAT["heater_demand"] == "heater"
    assert DEMAND_TO_SEAT["growmat_demand"] == "heatmat"
    assert len(DEMAND_TO_SEAT) == 4


def test_fleet_hass_pi_appliance_link() -> None:
    state = FleetState()
    hass = state.to_hass_states()
    assert "binary_sensor.dsc_pi_appliance_link" in hass
    assert "binary_sensor.dsc_hub_bridge_link" not in hass


def test_fleet_state_roundtrip() -> None:
    state = FleetState()
    state.hub = SeatState("hub", True, "7.0.0.0", {"temp_c": 24.5}, 1.0)
    update_fleet_state(state)
    got = get_fleet_state()
    assert got.hub.online is True
    assert got.hub.values["temp_c"] == 24.5
    hass = got.to_hass_states()
    assert "sensor.dsc_hub_temperature" in hass
    assert hass["binary_sensor.dsc_hub_link"]["state"] == "on"
    assert "sensor.dsc_ha_surface_version" in hass


def test_fleet_api_native_snapshot(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from fastapi.testclient import TestClient

    from dsc_brain.api import app

    client = TestClient(app)
    resp = client.get("/fleet")
    assert resp.status_code == 200
    body = resp.json()
    assert "inventory" in body
    assert "hub" in body
    assert "hass_extras" in body
    assert "sensor.dsc_fan_exhaust_outside_pct" in body["hass_extras"]
    assert "hass_states" not in body

    legacy = client.get("/fleet?include_hass=true")
    assert legacy.status_code == 200
    legacy_body = legacy.json()
    assert "hass_states" in legacy_body
    assert "binary_sensor.dsc_hub_link" in legacy_body["hass_states"]
    assert "sensor.dsc_cfm_exhaust_out" in legacy_body["hass_states"]


def test_compose_commit_roster(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.compose_ops import commit_to_roster
    from dsc_brain.compose_store import default_roster_slots, save_roster_slots, set_helper

    save_roster_slots(default_roster_slots())
    set_helper("input_text.dsc_build_strain", "Test Strain")
    set_helper("input_text.dsc_build_nickname", "Tester")
    result = commit_to_roster()
    assert result["slot"] == 1


def test_control_script_proxy(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from fastapi.testclient import TestClient

    from dsc_brain.api import app

    client = TestClient(app)
    resp = client.post(
        "/control/service",
        json={
            "domain": "input_text",
            "service": "set_value",
            "data": {"entity_id": "input_text.dsc_build_strain", "value": "Blue Dream"},
        },
    )
    assert resp.status_code == 200
    assert resp.json()["state"] == "Blue Dream"


def test_history_api(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from fastapi.testclient import TestClient

    from dsc_brain.api import app
    from dsc_brain.settings import record_history

    record_history("hub", "temp_c", 24.0)
    record_history("hub", "temp_c", 25.0)
    client = TestClient(app)
    resp = client.get("/history", params={"entity_id": "sensor.dsc_hub_tent_temperature", "hours": 6})
    assert resp.status_code == 200
    body = resp.json()
    assert body["entity_id"] == "sensor.dsc_hub_tent_temperature"
    assert len(body["points"]) >= 2


def test_health_endpoint() -> None:
    from fastapi.testclient import TestClient

    from dsc_brain.api import app

    client = TestClient(app)
    resp = client.get("/health")
    assert resp.status_code == 200
    body = resp.json()
    assert body["status"] == "ok"
    assert body["expected_firmware"] == "7.0.0.0"


def test_network_apply(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.network_apply import apply_network_configs, network_status

    status = network_status()
    assert status["ap_ssid"] == "DSC-Brain"
    result = apply_network_configs()
    assert "hostapd" in result
    assert Path(result["hostapd"]).is_file()


def test_hub_controls_from_states() -> None:
    from types import SimpleNamespace

    from dsc_brain.esphome_client import _hub_controls_from_states

    states = {
        1: SimpleNamespace(state=True),
        2: SimpleNamespace(state=24.5),
        3: SimpleNamespace(state=True, speed_level=42),
    }
    key_to_object = {1: "heater_demand", 2: "target_temp", 3: "fan_intake_main"}
    controls = _hub_controls_from_states(states, key_to_object, [])
    assert controls["switch.dsc_hub_heater_demand"]["state"] == "on"
    assert controls["number.dsc_hub_target_temp"]["state"] == "24.5"
    assert controls["fan.dsc_hub_4_inch_intake_fan_main"]["percentage"] == 42


def test_hub_binaries_from_states() -> None:
    from types import SimpleNamespace

    from dsc_brain.esphome_client import _hub_binaries_from_states

    states = {1: SimpleNamespace(state=True)}
    key_to_object = {1: "main_window_bs"}
    binaries = _hub_binaries_from_states(states, key_to_object)
    assert binaries["binary_sensor.dsc_hub_4x8_window_open"] is True


def test_hub_sensors_exact_map_ignores_number_entities() -> None:
    from types import SimpleNamespace

    from dsc_brain.esphome_client import _hub_sensors_from_states

    states = {
        1: SimpleNamespace(state=24.0),
        2: SimpleNamespace(state=65.0),
        3: SimpleNamespace(state=18.0),
        4: SimpleNamespace(state=22.5),
        5: SimpleNamespace(state=61.0),
    }
    key_to_object = {
        1: "temp_sensor",
        2: "humidity_sensor",
        3: "num_clone_light_hours",
        4: "clone_temp",
        5: "clone_rh",
    }
    out = _hub_sensors_from_states(states, key_to_object)
    assert out["temp_c"] == 24.0
    assert out["rh_pct"] == 65.0
    assert "vpd_kpa" not in out
    assert out["clone_temp_c"] == 22.5
    assert out["clone_rh_pct"] == 61.0


def test_finalize_hub_climate_computes_vpd() -> None:
    from dsc_brain.climate_math import compute_vpd_kpa, finalize_hub_climate

    assert compute_vpd_kpa(24.0, 70.0) == pytest.approx(0.902, rel=0.02)
    values = {"temp_c": 24.0, "rh_pct": 70.0, "vpd_kpa": 18.0}
    finalize_hub_climate(values)
    assert values["vpd_kpa"] == pytest.approx(0.902, rel=0.02)


def test_finalize_hub_binaries_fills_pot_esp() -> None:
    import time

    from dsc_brain.esphome_client import _finalize_hub_binaries
    from dsc_brain.fleet_state import FleetState, SeatState

    state = FleetState()
    state.hub = SeatState("hub", True, "1.0", {"binaries": {}}, time.time())
    state.pots["pot1"] = SeatState("pot1", True, "1.0", {"soil_temp_c": 22.0}, time.time())
    _finalize_hub_binaries(state)
    binaries = state.hub.values["binaries"]
    assert binaries["binary_sensor.dsc_hub_pot1_esp_now_link"] is True
    assert binaries["binary_sensor.dsc_hub_pot2_esp_now_link"] is False
    assert binaries["binary_sensor.dsc_hub_root_zone_sensor_fault"] is False


def test_grow_log_api(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from fastapi.testclient import TestClient

    from dsc_brain.api import app
    from dsc_brain.event_log import record_grow_log

    record_grow_log("Test grow event")
    client = TestClient(app)
    resp = client.get("/grow-log", params={"hours": 24})
    assert resp.status_code == 200
    body = resp.json()
    assert any("Test grow event" in e["message"] for e in body["events"])


def test_esphome_job_queue(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.esphome_jobs import list_jobs, queue_job

    job = queue_job("hub", "ota", temp_db)
    assert job["status"] == "queued"
    assert list_jobs(db_path=temp_db)[0]["seat_id"] == "hub"
