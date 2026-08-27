"""Brain unit tests."""

import os
import tempfile
import time
from pathlib import Path
from types import SimpleNamespace

import pytest

from dsc_brain import __version__
from dsc_brain.fleet_state import FleetState, SeatState, get_fleet_state, update_fleet_state
from dsc_brain.hub_controls import (
    HUB_BINARY_OID_TO_ENTITY,
    HUB_NUMBER_ENTITY_TO_OID,
    HUB_NUMBER_OID_TO_ENTITY,
    HUB_SENSOR_OID_TO_KEY,
    HUB_SWITCH_ENTITY_TO_OID,
    HUB_SWITCH_OID_TO_ENTITY,
    HUB_TEXT_SENSOR_OID_TO_KEY,
)
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
    assert __version__.startswith("7.3.0")


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
    assert DEMAND_TO_SEAT["grow_mat_demand"] == "heatmat"
    assert len(DEMAND_TO_SEAT) == 5


def test_appliance_undiscovered_aliases_not_emitted() -> None:
    """Phantom growmat_demand=False must not overwrite grow_mat_demand ON."""
    from dsc_brain.appliance_driver import DEMAND_TO_SEAT, _demands_from_discovered

    assert "growmat_demand" in DEMAND_TO_SEAT
    assert DEMAND_TO_SEAT["growmat_demand"] == DEMAND_TO_SEAT["grow_mat_demand"] == "heatmat"

    discovered = {
        "heater_demand": 1,
        "humidifier_demand": 2,
        "dehumidifier_demand": 3,
        "grow_mat_demand": 4,
    }
    live = {
        "heater_demand": False,
        "humidifier_demand": False,
        "dehumidifier_demand": False,
        "grow_mat_demand": True,
    }

    out = _demands_from_discovered(discovered, live)
    assert "growmat_demand" not in out
    assert out["grow_mat_demand"] is True
    assert set(out) == set(discovered)

    # The pre-fix loop over every DEMAND_TO_SEAT key defaulted the leftover
    # alias to False and chattered the heatmat relay (~10 s period).
    buggy = {oid: live.get(oid, False) for oid in DEMAND_TO_SEAT}
    assert buggy["growmat_demand"] is False
    assert buggy["grow_mat_demand"] is True


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
    assert "hass_extras" not in body
    assert "hass_states" not in body

    computed = client.get("/fleet/computed")
    assert computed.status_code == 200
    computed_body = computed.json()
    assert "hass_extras" in computed_body
    assert "sensor.dsc_fan_exhaust_outside_pct" in computed_body["hass_extras"]

    with_computed = client.get("/fleet?include_computed=true")
    assert with_computed.status_code == 200
    assert "hass_extras" in with_computed.json()

    legacy = client.get("/fleet?include_hass=true")
    assert legacy.status_code == 200
    legacy_body = legacy.json()
    assert "hass_states" in legacy_body
    assert "binary_sensor.dsc_hub_link" in legacy_body["hass_states"]
    assert "hass_extras" not in legacy_body
    assert "sensor.dsc_cfm_exhaust_out" not in legacy_body["hass_states"]

    legacy_computed = client.get("/fleet?include_hass=true&include_computed=true")
    assert legacy_computed.status_code == 200
    legacy_computed_body = legacy_computed.json()
    assert "sensor.dsc_cfm_exhaust_out" in legacy_computed_body["hass_extras"]


def test_compose_commit_roster(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.compose_ops import commit_to_roster
    from dsc_brain.compose_store import default_roster_slots, save_roster_slots, set_helper

    save_roster_slots(default_roster_slots())
    set_helper("input_text.dsc_build_strain", "Test Strain")
    set_helper("input_text.dsc_build_nickname", "Tester")
    result = commit_to_roster()
    assert result["slot"] == 1


def test_stage_model_july_9_is_late_push_veg() -> None:
    from datetime import date

    from dsc_brain.stage_model import expected_stage, tent_id

    assert (date(2026, 8, 27) - date(2026, 7, 9)).days == 49
    assert expected_stage(49, auto=False) == "Late (Push) Vegetative"
    assert tent_id("2x4") == "clone"
    assert tent_id("4x8") == "main"


def test_assign_to_pot_writes_tent_and_stage(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", temp_db)
    from dsc_brain.compose_ops import assign_to_pot, derived_stage_for
    from dsc_brain.compose_store import default_roster_slots, save_roster_slots, set_helper

    save_roster_slots(default_roster_slots())
    set_helper("input_text.dsc_build_strain", "Northern Lights")
    set_helper("input_text.dsc_build_nickname", "NL pot3")
    set_helper("input_datetime.dsc_build_sprout_date", "2026-07-09")
    set_helper("input_select.dsc_build_tent", "2x4")
    set_helper("input_select.dsc_build_assign_pot", "3")
    result = assign_to_pot("3")
    assert result["tent"] == "clone"
    rows = list_roster(temp_db)
    assert rows[0]["seat_id"] == "pot3"
    assert rows[0]["tent"] == "clone"
    assert rows[0]["sprout_date"] == "2026-07-09"
    assert rows[0]["recipe"]["growth_stage"] == derived_stage_for("2026-07-09")


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


def test_control_demand_unknown_seat(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from fastapi.testclient import TestClient

    from dsc_brain.api import app

    client = TestClient(app)
    resp = client.post("/control/demand", json={"seat": "not_a_seat", "on": True})
    assert resp.status_code == 400


def test_hub_ingest_critical_oids_mapped() -> None:
    """Operational ESPHome slugs must exist in ingest maps (no silent zero)."""
    from dsc_brain.hub_controls import (
        HUB_BINARY_OID_TO_ENTITY,
        HUB_FAN_OID_TO_ENTITY,
        HUB_LIGHT_OID_TO_ENTITY,
        HUB_SENSOR_OID_TO_KEY,
        HUB_SWITCH_OID_TO_ENTITY,
        HUB_TEXT_SENSOR_OID_TO_KEY,
    )

    critical = [
        "heater_demand",
        "grow_mat_demand",
        "humidifier_demand",
        "humidifier_fire_countdown",
        "4_inch_intake_fan__main_",
        "tent_full_auto_mode",
        "auto_photoperiod",
        "sf1000_dimmer",
        "firmware_version",
        "emergency_failsafe",
        "climate_sensor_fault",
    ]
    known = (
        set(HUB_SWITCH_OID_TO_ENTITY)
        | set(HUB_SENSOR_OID_TO_KEY)
        | set(HUB_FAN_OID_TO_ENTITY)
        | set(HUB_TEXT_SENSOR_OID_TO_KEY)
        | set(HUB_LIGHT_OID_TO_ENTITY)
        | set(HUB_BINARY_OID_TO_ENTITY)
    )
    missing = [oid for oid in critical if oid not in known]
    assert not missing, f"critical hub oids not in ingest maps: {missing}"


def test_hub_ingest_informational_oids_mapped() -> None:
    """Non-critical hub entities (audit 2026-08-26 §4) land in ingest maps.

    Representative sample per kind, asserting both the name-slug and legacy
    internal-id variants resolve to the same target. Informational entities
    stay ingest-only: no control-proxy (ENTITY_TO_OID) rows.
    """
    # switches — hub-side in-service flags, *_auto ladder gates, mat votes
    assert HUB_SWITCH_OID_TO_ENTITY["pot3_in_service"] == "switch.dsc_hub_pot3_in_service"
    assert HUB_SWITCH_OID_TO_ENTITY["pot3_in_service_switch"] == "switch.dsc_hub_pot3_in_service"
    assert HUB_SWITCH_OID_TO_ENTITY["ac_in_service"] == "switch.dsc_hub_ac_in_service"
    assert HUB_SWITCH_OID_TO_ENTITY["heater_auto"] == "switch.dsc_hub_heater_auto"
    assert HUB_SWITCH_OID_TO_ENTITY["growmat_auto_switch"] == "switch.dsc_hub_grow_mat_auto"
    assert HUB_SWITCH_OID_TO_ENTITY["mat_vote_pot_1"] == "switch.dsc_hub_mat_vote_pot_1"
    assert HUB_SWITCH_OID_TO_ENTITY["lock_wifi_ap"] == "switch.dsc_hub_lock_wifi_ap"
    # numbers — ladder waits, min-off times, photoperiod ramp, fleet-heal targets
    assert HUB_NUMBER_OID_TO_ENTITY["ladder_wait_hum"] == "number.dsc_hub_ladder_wait_hum"
    assert HUB_NUMBER_OID_TO_ENTITY["num_ladder_wait_hum"] == "number.dsc_hub_ladder_wait_hum"
    assert HUB_NUMBER_OID_TO_ENTITY["ladder-wait-hum"] == "number.dsc_hub_ladder_wait_hum"
    assert HUB_NUMBER_OID_TO_ENTITY["humidifier_min_off-time"] == "number.dsc_hub_humidifier_min_off_time"
    assert HUB_NUMBER_OID_TO_ENTITY["min_dark_hours"] == "number.dsc_hub_min_dark_hours"
    assert HUB_NUMBER_OID_TO_ENTITY["sf1000_ramp_floor"] == "number.dsc_hub_sf1000_ramp_floor"
    assert HUB_NUMBER_OID_TO_ENTITY["num_destrat_burst"] == "number.dsc_hub_de_strat_pulse_length"
    assert HUB_NUMBER_OID_TO_ENTITY["mister_target_hours"] == "number.dsc_hub_mister_target_hours"
    # sensors — WiFi/link diagnostics, light debt, CO2 estimate, fleet-heal bands
    assert HUB_SENSOR_OID_TO_KEY["wifi_rssi"] == "wifi_rssi"
    assert HUB_SENSOR_OID_TO_KEY["light_debt_h"] == "light_debt_hours"
    assert HUB_SENSOR_OID_TO_KEY["light_debt_hours"] == "light_debt_hours"
    assert HUB_SENSOR_OID_TO_KEY["co2_ppm_estimate"] == "dynamic_co2_ppm"
    assert HUB_SENSOR_OID_TO_KEY["vpd_main_band_hours"] == "vpd_main_band_hours"
    assert HUB_SENSOR_OID_TO_KEY["coherence_epoch_s"] == "coherence_epoch"
    # binaries — link/heal diagnostics
    assert HUB_BINARY_OID_TO_ENTITY["ota_blocked"] == "binary_sensor.dsc_hub_ota_blocked"
    assert HUB_BINARY_OID_TO_ENTITY["ha_connected"] == "binary_sensor.dsc_hub_ha_link_status"
    assert HUB_BINARY_OID_TO_ENTITY["ha_link_status"] == "binary_sensor.dsc_hub_ha_link_status"
    assert HUB_BINARY_OID_TO_ENTITY["wifi_associated"] == "binary_sensor.dsc_hub_wifi_associated"
    assert HUB_BINARY_OID_TO_ENTITY["learning_paused_bs"] == "binary_sensor.dsc_hub_learning_paused"
    # text sensors — network/heal strings
    assert HUB_TEXT_SENSOR_OID_TO_KEY["network_ssid"] == "wifi_ssid"
    assert HUB_TEXT_SENSOR_OID_TO_KEY["ip_address"] == "ip_address"
    assert HUB_TEXT_SENSOR_OID_TO_KEY["esphome_version"] == "esphome_version"
    assert HUB_TEXT_SENSOR_OID_TO_KEY["last_evt_ts"] == "last_evt"
    # ingest-only: informational entities gain no write/control-proxy rows
    assert "switch.dsc_hub_pot3_in_service" not in HUB_SWITCH_ENTITY_TO_OID
    assert "switch.dsc_hub_heater_auto" not in HUB_SWITCH_ENTITY_TO_OID
    assert "number.dsc_hub_ladder_wait_hum" not in HUB_NUMBER_ENTITY_TO_OID


def test_hub_ingest_informational_states_flow() -> None:
    from dsc_brain.esphome_client import (
        _hub_binaries_from_states,
        _hub_controls_from_states,
        _hub_sensors_from_states,
        _hub_text_sensors_from_states,
    )

    states = {
        1: SimpleNamespace(state=True),
        2: SimpleNamespace(state=45.0),
        3: SimpleNamespace(state=-61.0),
        4: SimpleNamespace(state=True),
        5: SimpleNamespace(state="DSC-Brain"),
    }
    key_to_object = {
        1: "pot3_in_service",
        2: "ladder_wait_hum",
        3: "wifi_rssi",
        4: "ota_blocked_bs",
        5: "wifi_ssid",
    }
    controls = _hub_controls_from_states(states, key_to_object, [])
    assert controls["switch.dsc_hub_pot3_in_service"]["state"] == "on"
    assert controls["number.dsc_hub_ladder_wait_hum"]["state"] == "45.0"
    sensors = _hub_sensors_from_states(states, key_to_object)
    assert sensors["wifi_rssi"] == -61.0
    binaries = _hub_binaries_from_states(states, key_to_object)
    assert binaries["binary_sensor.dsc_hub_ota_blocked"] is True
    texts = _hub_text_sensors_from_states(states, key_to_object)
    assert texts["wifi_ssid"] == "DSC-Brain"


def test_intake_allocated_cfm(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    """Intake *_allocated mirrors exhaust: Σ exhaust CFM split by intake fan pct share."""
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.compose_store import set_helper
    from dsc_brain.computed_ops import build_computed_hass_states

    set_helper("input_number.dsc_cfm_out_max", 200)
    set_helper("input_number.dsc_cfm_recirc_max", 100)
    set_helper("input_number.dsc_cfm_intake_main_max", 100)
    set_helper("input_number.dsc_cfm_intake_clone_max", 100)

    state = FleetState()
    controls = {
        "fan.dsc_hub_6_inch_exhaust_outside": {"state": "on", "percentage": 50},
        "fan.dsc_hub_6_inch_exhaust_room": {"state": "off", "percentage": 0},
        "fan.dsc_hub_4_inch_intake_fan_main": {"state": "on", "percentage": 60},
        "fan.dsc_hub_4_inch_intake_fan_2x4": {"state": "on", "percentage": 20},
    }
    state.hub = SeatState("hub", True, "7.0.0.0", {"controls": controls}, time.time())
    states = build_computed_hass_states(state)

    # exhaust capacity 50% of 200 nameplate = 100 CFM; intake shares 60/80 and 20/80
    assert states["sensor.dsc_cfm_exhaust_out"]["state"] == "100.0"
    main = states["sensor.dsc_cfm_intake_main_allocated"]
    clone = states["sensor.dsc_cfm_intake_2x4_allocated"]
    assert main["state"] == "75.0"
    assert clone["state"] == "25.0"
    assert main["attributes"]["model"] == "mass_balance_allocated"
    assert main["attributes"]["honesty"] == "Sigma_exhaust_times_fan_pct_split"
    assert main["attributes"]["companion_capacity"] == "sensor.dsc_cfm_intake_main"
    assert clone["attributes"]["companion_capacity"] == "sensor.dsc_cfm_intake_2x4"

    # zero intake share → no divide-by-zero, allocations 0
    controls["fan.dsc_hub_4_inch_intake_fan_main"] = {"state": "off", "percentage": 0}
    controls["fan.dsc_hub_4_inch_intake_fan_2x4"] = {"state": "off", "percentage": 0}
    state.hub = SeatState("hub", True, "7.0.0.0", {"controls": controls}, time.time())
    states = build_computed_hass_states(state)
    assert states["sensor.dsc_cfm_intake_main_allocated"]["state"] == "0.0"
    assert states["sensor.dsc_cfm_intake_2x4_allocated"]["state"] == "0.0"


def test_flow_proxies_and_cascade(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.computed_ops import build_computed_hass_states, invalidate_computed_cache

    invalidate_computed_cache()
    state = FleetState()
    state.hub = SeatState(
        "hub",
        True,
        "7.0.0.0",
        {
            "temp_c": 26.0,
            "room_temp_c": 22.0,
            "rh_pct": 55.0,
            "room_rh_pct": 48.0,
            "controls": {
                "switch.dsc_hub_heater_demand": {"state": "on"},
                "switch.dsc_hub_humidifier_demand": {"state": "on"},
                "switch.dsc_hub_grow_mat_demand": {"state": "on"},
            },
        },
        time.time(),
    )
    state.sonoffs = {
        "heater": SeatState("heater", True, "7.0.0.0", {"relay_on": True}, time.time()),
        "humidifier": SeatState("humidifier", True, "7.0.0.0", {"relay_on": True}, time.time()),
        "heatmat": SeatState("heatmat", True, "7.0.0.0", {"relay_on": True}, time.time()),
    }
    states = build_computed_hass_states(state)
    assert float(states["sensor.dsc_flow_heat_tent_w"]["state"]) > 0
    assert float(states["sensor.dsc_flow_heat_mat_w"]["state"]) > 0
    assert "sensor.dsc_cfm_cascade_2x4_allocated" in states
    assert "binary_sensor.dsc_flow_mass_balance_ok" in states
    assert "binary_sensor.dsc_heater_temp_oos_latch" in states


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
    assert body["version"] == "7.3.0"
    assert body["surface"] == "7.3.0"
    assert body["expected_firmware"] == "7.0.0.0"


def test_pot3_default_out_of_service(temp_db: Path) -> None:
    inv = {r["seat_id"]: r for r in list_inventory(temp_db)}
    assert inv["pot3"]["in_service"] is False


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
        4: SimpleNamespace(state=True, brightness=1),
        5: SimpleNamespace(state=True),
        6: SimpleNamespace(state=True, speed_level=55),
        7: SimpleNamespace(state="2x4 Clone"),
    }
    key_to_object = {
        1: "heater_demand",
        2: "target_temp",
        3: "fan_intake_main",
        4: "sf1000_dimmer",
        5: "tent_full_auto_mode",
        6: "4_inch_intake_fan__main_",
        7: "priority_tent",
    }
    controls = _hub_controls_from_states(states, key_to_object, [])
    assert controls["switch.dsc_hub_heater_demand"]["state"] == "on"
    assert controls["number.dsc_hub_target_temp"]["state"] == "24.5"
    assert controls["fan.dsc_hub_4_inch_intake_fan_main"]["percentage"] == 55
    assert controls["light.dsc_hub_sf1000_dimmer"]["state"] == "on"
    assert controls["switch.dsc_hub_tent_full_auto_mode"]["state"] == "on"
    assert controls["select.dsc_hub_priority_tent"]["state"] == "2x4 Clone"


def test_hub_binaries_safety_and_esp_slug() -> None:
    from types import SimpleNamespace

    from dsc_brain.esphome_client import _hub_binaries_from_states

    states = {
        1: SimpleNamespace(state=True),
        2: SimpleNamespace(state=True),
        3: SimpleNamespace(state=True),
    }
    key_to_object = {
        1: "emergency_failsafe",
        2: "climate_sensor_fault",
        3: "pot1_esp-now_link",
    }
    binaries = _hub_binaries_from_states(states, key_to_object)
    assert binaries["binary_sensor.dsc_hub_emergency_failsafe"] is True
    assert binaries["binary_sensor.dsc_hub_climate_sensor_fault"] is True
    assert binaries["binary_sensor.dsc_hub_pot1_esp_now_link"] is True


def test_hub_sensors_cooldown_map() -> None:
    from types import SimpleNamespace

    from dsc_brain.esphome_client import _hub_sensors_from_states

    states = {1: SimpleNamespace(state=90.0)}
    key_to_object = {1: "heater_cooldown_remaining"}
    out = _hub_sensors_from_states(states, key_to_object)
    assert out["heater_cooldown_remaining"] == 90.0


def test_hub_text_sensors_firmware_version() -> None:
    from types import SimpleNamespace

    from dsc_brain.esphome_client import _hub_text_sensors_from_states

    states = {1: SimpleNamespace(state="6.0.0.0")}
    key_to_object = {1: "firmware_version"}
    out = _hub_text_sensors_from_states(states, key_to_object)
    assert out["firmware_version"] == "6.0.0.0"


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


def test_hub_sensors_fire_countdown_map() -> None:
    from types import SimpleNamespace

    from dsc_brain.esphome_client import _hub_sensors_from_states

    states = {
        1: SimpleNamespace(state=45.0),
        2: SimpleNamespace(state=12.5),
    }
    key_to_object = {
        1: "humidifier_fire_countdown",
        2: "sens_heater_countdown",
    }
    out = _hub_sensors_from_states(states, key_to_object)
    assert out["humidifier_fire_countdown"] == 45.0
    assert out["heater_fire_countdown"] == 12.5


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


def test_public_settings_masks_ap_psk(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    from dsc_brain.settings import get_all_settings, public_settings, set_setting

    set_setting("ap_psk", "super-secret", temp_db)
    set_setting("compose_helpers_json", '{"ghost": true}', temp_db)
    raw = get_all_settings(temp_db)
    assert raw["ap_psk"] == "super-secret"
    pub = public_settings(temp_db)
    assert pub["ap_psk_set"] is True
    assert pub["ap_psk"] == ""
    assert "compose_helpers_json" not in pub


def test_settings_get_masks_ap_psk(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", temp_db)
    from fastapi.testclient import TestClient

    from dsc_brain.api import app
    from dsc_brain.settings import set_setting

    set_setting("ap_psk", "super-secret", temp_db)
    client = TestClient(app)
    resp = client.get("/settings")
    assert resp.status_code == 200
    body = resp.json()
    assert body["settings"]["ap_psk_set"] is True
    assert body["settings"]["ap_psk"] == ""
    assert "compose_helpers_json" not in body["settings"]


def test_planned_oos_seats_in_inventory(temp_db: Path) -> None:
    inv = {r["seat_id"]: r for r in list_inventory(temp_db)}
    for seat in ("ac", "mister", "tank"):
        assert seat in inv
        assert inv[seat]["in_service"] is False


def test_create_extra_seat_api(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", temp_db)
    from fastapi.testclient import TestClient

    from dsc_brain.api import app

    client = TestClient(app)
    resp = client.post(
        "/settings/inventory/create-extra-seat",
        json={
            "seat_id": "zigbee_intake_qa",
            "role": "extra",
            "extra": {"placement": "4x8 intake duct", "zigbee_friendly_name": "intake_sensor"},
        },
    )
    assert resp.status_code == 200
    row = resp.json()
    assert row["seat_id"] == "zigbee_intake_qa"
    assert row["extra"]["placement"] == "4x8 intake duct"


def test_permit_join_payload_time_format(monkeypatch: pytest.MonkeyPatch) -> None:
    from dsc_brain.zigbee_mqtt import set_permit_join

    published: list[tuple[str, str]] = []

    class _FakeClient:
        def publish(self, topic: str, payload: str) -> None:
            published.append((topic, payload))

    monkeypatch.setattr("dsc_brain.zigbee_mqtt._ingest._client", _FakeClient())
    set_permit_join(True, duration_s=90)
    assert published == [("zigbee2mqtt/bridge/request/permit_join", '{"time": 90}')]
    set_permit_join(False)
    assert published[-1] == ("zigbee2mqtt/bridge/request/permit_join", '{"time": 0}')


def test_permit_join_expiry_clears_flag(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", temp_db)
    from dsc_brain.settings import get_setting, set_setting
    from dsc_brain.zigbee_mqtt import _schedule_permit_join_expiry

    set_setting("zigbee_permit_join", "true", temp_db)
    _schedule_permit_join_expiry(0.05)
    time.sleep(0.2)
    assert get_setting("zigbee_permit_join", db_path=temp_db) == "false"


def test_zigbee_health_radio_down_by_default() -> None:
    from dsc_brain.zigbee_mqtt import get_zigbee_health

    health = get_zigbee_health()
    assert health["radio_up"] is False
    assert "radio_note" in health
    assert health.get("bridge_state") is None or health["bridge_state"] != "online"


def test_catalog_search_raises_without_local_db(monkeypatch: pytest.MonkeyPatch) -> None:
    import asyncio

    from dsc_brain.integrations import CatalogSearchError, catalog_search

    async def _boom(*_a: object, **_k: object) -> list:
        raise RuntimeError("remote down")

    monkeypatch.setattr("dsc_brain.integrations._catalog_search_remote", _boom)
    monkeypatch.setattr("dsc_brain.integrations.cannalib_base_url", lambda: "http://example.invalid")
    monkeypatch.setattr("dsc_brain.integrations.get_setting", lambda k, d="": "true" if k == "cannalib_use_local_fallback" else d)
    monkeypatch.setattr("dsc_brain.integrations.resolve_cannalib_db", lambda: None)

    with pytest.raises(CatalogSearchError, match="no on-host corpus DB"):
        asyncio.run(catalog_search("strain", "og", 5))


def test_hostapd_conf_fleet_heal_fields(temp_db: Path) -> None:
    from dsc_brain.network_apply import render_hostapd_conf
    from dsc_brain.settings import get_all_settings

    conf = render_hostapd_conf(get_all_settings(temp_db))
    assert "max_num_sta=32" in conf
    assert "macaddr_acl=0" in conf
    assert "deny_mac_file=/etc/dsc-hub/hostapd.deny" in conf


def test_esphome_double_ota_blocked(temp_db: Path) -> None:
    from dsc_brain.esphome_jobs import queue_job

    queue_job("hub", "ota", temp_db)
    with pytest.raises(RuntimeError, match="OTA already queued"):
        queue_job("hub", "ota", temp_db)


def test_planned_oos_inventory_defaults(temp_db: Path) -> None:
    inv = {r["seat_id"]: r for r in list_inventory(temp_db)}
    assert inv["ac"]["in_service"] is False
    assert inv["mister"]["in_service"] is False
    assert inv["tank"]["in_service"] is False


def test_fleet_includes_oos_seats(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    monkeypatch.setattr("dsc_brain.paths.DEFAULT_DB", temp_db)
    monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", temp_db)
    from fastapi.testclient import TestClient

    from dsc_brain.api import app

    client = TestClient(app)
    resp = client.get("/fleet")
    assert resp.status_code == 200
    body = resp.json()
    assert "pot3" in body["pots"]
    assert body["pots"]["pot3"]["online"] is False
    assert body["pots"]["pot3"]["in_service"] is False


def test_apply_clone_tent_skips_offline_hub(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    import asyncio

    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.control_ops import apply_clone_tent_automation
    from dsc_brain.fleet_state import FleetState, update_fleet_state

    update_fleet_state(FleetState())
    result = asyncio.run(apply_clone_tent_automation())
    assert result["applied"] is False
    assert result["reason"] == "hub offline"


def test_list_history_newest_first(temp_db: Path) -> None:
    from dsc_brain.settings import list_history, record_history

    base = time.time() - 300
    record_history("hub", "temp_c", 20.0, base, temp_db)
    record_history("hub", "temp_c", 21.0, base + 60, temp_db)
    record_history("hub", "temp_c", 22.0, base + 120, temp_db)
    rows = list_history("hub", "temp_c", base - 1, db_path=temp_db)
    assert [r["value"] for r in rows] == [22.0, 21.0, 20.0]


def test_retire_clears_build_draft(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.compose_ops import retire_plant
    from dsc_brain.compose_store import default_roster_slots, get_helper, save_roster_slots, set_helper

    save_roster_slots(default_roster_slots())
    set_helper("input_text.dsc_build_strain", "Retire Me")
    set_helper("input_text.dsc_build_nickname", "Gone")
    set_helper("input_select.dsc_build_assign_pot", "2")
    retire_plant("2")
    assert get_helper("input_text.dsc_build_strain", "x") == ""
    assert get_helper("input_select.dsc_build_climate_pot", "x") == "Fleet"
    assert get_helper("input_select.dsc_build_custom_slot", "x") == "auto"


def test_in_service_default_off_without_inventory_row(temp_db: Path) -> None:
    from dsc_brain.fleet_state import FleetState

    state = FleetState()
    hass = state.to_hass_states(inventory=[])
    assert hass["input_boolean.dsc_ac_in_service"]["state"] == "off"
    assert hass["input_boolean.dsc_pot1_in_service"]["state"] == "off"
    assert hass["input_boolean.dsc_pot3_in_service"]["state"] == "off"


def test_online_stale_sec_alias() -> None:
    from dsc_brain.esphome_client import ONLINE_STALE_SEC, _ONLINE_STALE_SEC

    assert ONLINE_STALE_SEC == _ONLINE_STALE_SEC == 120.0


def test_esphome_devices_merges_panel_and_sonoffs(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", temp_db)
    monkeypatch.setattr("dsc_brain.paths.DEFAULT_DB", temp_db)
    from fastapi.testclient import TestClient

    from dsc_brain.api import app
    from dsc_brain.fleet_state import FleetState, SeatState, update_fleet_state

    state = FleetState()
    state.panel = SeatState("panel", True, "7.0.0.0", {}, time.time())
    state.sonoffs["heater"] = SeatState("heater", True, "7.0.0.0", {}, time.time())
    update_fleet_state(state)
    client = TestClient(app)
    resp = client.get("/settings/esphome/devices")
    assert resp.status_code == 200
    by_seat = {d["seat_id"]: d for d in resp.json()["devices"]}
    assert by_seat.get("control", {}).get("online") is True
    assert by_seat.get("heater", {}).get("online") is True


def test_computed_cache_hot_beats_cold(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from unittest.mock import patch

    from dsc_brain.computed_ops import build_computed_hass_states, invalidate_computed_cache
    from dsc_brain.compose_store import set_helper
    from dsc_brain.fleet_state import FleetState, SeatState

    invalidate_computed_cache()
    set_helper("input_number.dsc_cfm_out_max", 200)
    state = FleetState()
    controls = {
        "fan.dsc_hub_6_inch_exhaust_outside": {"state": "on", "percentage": 40},
    }
    state.hub = SeatState("hub", True, "7.0.0.0", {"controls": controls}, time.time())

    cannalib_stub = {"online": False, "hits": 0, "bytes_in": 0, "bytes_out": 0, "corpus_strains": 0, "summary": "— MB"}
    with patch("dsc_brain.dash_computed._cannalib_snapshot", return_value=cannalib_stub):
        t0 = time.perf_counter()
        cold = build_computed_hass_states(state)
        cold_ms = (time.perf_counter() - t0) * 1000.0

        t1 = time.perf_counter()
        hot = build_computed_hass_states(state)
        hot_ms = (time.perf_counter() - t1) * 1000.0

    assert "sensor.dsc_fan_exhaust_outside_pct" in cold
    assert hot["sensor.dsc_fan_exhaust_outside_pct"] == cold["sensor.dsc_fan_exhaust_outside_pct"]
    assert hot_ms < cold_ms


def test_fleet_computed_endpoint_responds_quickly(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from unittest.mock import patch

    from fastapi.testclient import TestClient

    from dsc_brain.api import app

    cannalib_stub = {"online": False, "hits": 0, "bytes_in": 0, "bytes_out": 0, "corpus_strains": 0, "summary": "— MB"}
    client = TestClient(app)
    with patch("dsc_brain.dash_computed._cannalib_snapshot", return_value=cannalib_stub):
        # Warm import/cache on Windows CI can exceed 1s on first hit; assert cold < 2s.
        client.get("/fleet/computed")
        t0 = time.perf_counter()
        resp = client.get("/fleet/computed")
        elapsed_ms = (time.perf_counter() - t0) * 1000.0
    assert resp.status_code == 200
    assert "hass_extras" in resp.json()
    assert elapsed_ms < 2000.0


def test_computed_runtime_memo_single_history_query(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from unittest.mock import patch

    from dsc_brain.computed_ops import build_computed_hass_states, invalidate_computed_cache
    from dsc_brain.fleet_state import FleetState

    invalidate_computed_cache()
    state = FleetState()
    calls: list[tuple[str, str, float]] = []

    def _spy(seat_id: str, metric: str, since_ts: float, limit: int = 2000, db_path=None):
        calls.append((seat_id, metric, since_ts))
        return []

    cannalib_stub = {"online": False, "hits": 0, "bytes_in": 0, "bytes_out": 0, "corpus_strains": 0, "summary": "— MB"}
    with patch("dsc_brain.runtime_history.list_history", side_effect=_spy):
        with patch("dsc_brain.dash_computed._cannalib_snapshot", return_value=cannalib_stub):
            build_computed_hass_states(state)

    from dsc_brain.runtime_history import midnight_ts

    today = midnight_ts()
    hum_today = [c for c in calls if c[0] == "hub" and c[1] == "switch_dsc_hub_humidifier_demand" and c[2] == today]
    assert len(hum_today) == 1


def test_pot_binary_oids_mapped() -> None:
    from dsc_brain.esphome_client import POT_BINARY_OID_TO_KEY

    for oid in ("clock_valid_bs", "probe_online_bs", "sensor_fault_bs"):
        assert oid in POT_BINARY_OID_TO_KEY


def test_pot_binary_states_flow() -> None:
    from types import SimpleNamespace

    from dsc_brain.esphome_client import POT_BINARY_OID_TO_KEY

    key_to_object = {1: "clock_valid_bs", 2: "probe_online_bs", 3: "sensor_fault_bs"}
    states = {
        1: SimpleNamespace(state=True),
        2: SimpleNamespace(state=False),
        3: SimpleNamespace(state=True),
    }
    binaries: dict[str, bool] = {}
    for key, st in states.items():
        object_id = key_to_object.get(key, "")
        bin_field = POT_BINARY_OID_TO_KEY.get(object_id)
        if bin_field is not None:
            raw = getattr(st, "state", None)
            binaries[bin_field] = raw in (True, "on", "ON", 1, "1")
    assert binaries == {
        "clock_valid": True,
        "modbus_probe_online": False,
        "sensor_fault": True,
    }


def test_global_modifiers_offsets_and_clamp(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.global_modifiers import apply_temp_rh_offsets, get_global_modifiers, set_global_modifiers

    set_global_modifiers({"temp_offset_c": {"room": 2.0}, "rh_offset_pct": {"room": -5.0}})
    mods = get_global_modifiers()
    assert mods["temp_offset_c"]["room"] == 2.0
    t, rh, clamped = apply_temp_rh_offsets(20.0, 50.0, "room")
    assert t == 22.0
    assert rh == 45.0
    assert clamped is False


def test_global_modifiers_api(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from fastapi.testclient import TestClient

    from dsc_brain.api import app
    from dsc_brain.global_modifiers import set_global_modifiers

    client = TestClient(app)
    resp = client.patch("/settings/global-modifiers", json={"fan_demand_scale": 1.2})
    assert resp.status_code == 200
    assert resp.json()["modifiers"]["fan_demand_scale"] == 1.2
    set_global_modifiers({"fan_demand_scale": 1.0})


def test_soil_test_flow(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.fleet_state import FleetState, SeatState, update_fleet_state
    from dsc_brain.soil_tests import cancel_soil_test, confirm_soil_test, poll_soil_test
    from dsc_brain.settings import upsert_inventory
    from fastapi.testclient import TestClient

    from dsc_brain.api import app

    upsert_inventory(
        "pot2",
        {
            "extra": {
                "role": "probe_station",
                "tent": "2x4",
                "idle_home_pot_id": "pot2",
                "probe_attached": True,
            }
        },
        temp_db,
    )
    state = FleetState()
    state.pots["pot2"] = SeatState(
        "pot2",
        True,
        "7.0.0.0",
        {"moisture_pct": 42.0, "ec_us": 800.0, "ph": 6.2, "soil_temp_c": 22.0},
        None,
    )
    update_fleet_state(state)

    client = TestClient(app)
    start = client.post(
        "/soil-tests/start",
        json={
            "probe_seat_id": "pot2",
            "target_pot_id": "pot2",
            "mode": "adhoc",
            "timing_note": "adhoc",
            "plant_label": "Test plant",
        },
    )
    assert start.status_code == 200
    test_id = start.json()["id"]
    for _ in range(5):
        poll = poll_soil_test(test_id)
        if poll.get("stable"):
            break
    try:
        confirm_soil_test(test_id)
    except ValueError:
        cancel_soil_test(test_id)
    hist = client.get("/soil-tests")
    assert hist.status_code == 200


def test_zigbee_by_placement_entities(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.fleet_state import FleetState

    state = FleetState()
    state.system["zigbee_by_placement"] = {
        "canopy_4x8": {"temperature": 24.5, "humidity": 55.0},
    }
    states = state.to_hass_states([])
    assert "sensor.dsc_zigbee_canopy_4x8_temperature" in states
    assert "sensor.dsc_zigbee_canopy_4x8_humidity" in states


@pytest.fixture()
def demo_client(temp_db: Path, monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    monkeypatch.setenv("DSC_DEMO_MODE", "1")
    from fastapi.testclient import TestClient

    from dsc_brain.api import app

    with TestClient(app) as client:
        yield client


def test_demo_health_mode(demo_client) -> None:
    resp = demo_client.get("/health")
    assert resp.status_code == 200
    body = resp.json()
    assert body["mode"] == "demo"
    assert body["simulation"] is True


def test_demo_seeds_fleet_online(demo_client) -> None:
    resp = demo_client.get("/fleet")
    assert resp.status_code == 200
    body = resp.json()
    assert body["hub"]["online"] is True
    assert body["hub"]["values"].get("temp_c") is not None


def test_demo_heater_raises_temp(demo_client) -> None:
    before = demo_client.get("/fleet").json()["hub"]["values"]["temp_c"]
    demo_client.post("/control/demand", json={"seat": "heater", "on": True})
    time.sleep(1.2)
    after = demo_client.get("/fleet").json()["hub"]["values"]["temp_c"]
    assert after > before


def test_demo_dehum_lowers_rh(demo_client) -> None:
    demo_client.post("/control/demand", json={"seat": "dehumidifier", "on": True})
    before = demo_client.get("/fleet").json()["hub"]["values"]["rh_pct"]
    time.sleep(1.2)
    after = demo_client.get("/fleet").json()["hub"]["values"]["rh_pct"]
    assert after < before


def test_demo_blocks_network_apply(demo_client) -> None:
    resp = demo_client.post("/settings/network/apply")
    assert resp.status_code == 403


def test_demo_fan_updates_cfm(demo_client) -> None:
    demo_client.post(
        "/control/service",
        json={
            "domain": "fan",
            "service": "set_percentage",
            "data": {"entity_id": "fan.dsc_hub_6_inch_exhaust_outside", "percentage": 80},
        },
    )
    computed = demo_client.get("/fleet/computed").json()["hass_extras"]
    pct = float(computed["sensor.dsc_fan_exhaust_outside_pct"]["state"])
    assert pct == 80.0
    cfm = float(computed["sensor.dsc_cfm_exhaust_out"]["state"])
    assert cfm > 0


def test_demo_no_native_api_on_control(demo_client, monkeypatch: pytest.MonkeyPatch) -> None:
    calls: list[str] = []

    def _boom(*_a, **_k):
        calls.append("native")
        raise RuntimeError("native api must not run in demo")

    monkeypatch.setattr("dsc_brain.native_api.make_api_client", _boom)
    resp = demo_client.post("/control/demand", json={"seat": "heater", "on": True})
    assert resp.status_code == 200
    assert calls == []


def test_demo_rejects_private_inventory_host(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    monkeypatch.setenv("DSC_DEMO_MODE", "1")
    from dsc_brain.demo_mode import assert_demo_safe_config
    from dsc_brain.settings import upsert_inventory

    upsert_inventory("hub", {"host": "192.168.1.10"})
    with pytest.raises(RuntimeError, match="unsafe"):
        assert_demo_safe_config()
