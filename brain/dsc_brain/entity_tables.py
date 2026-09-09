"""Single source of truth for the HA-shaped entity-id tables shared with the SPA.

Home Assistant is retired, but the ``<domain>.dsc_<thing>_<metric>`` dialect is
still the control surface: the brain emits these ids, the SPA reads them, and a
rename that lands on only one side fails *silently* on the Pi.  So the tables
live here, in Python, once — and the TypeScript mirrors under
``frontend/src/lib/generated/`` are EMITTED from this module.

    regenerate:  python brain/scripts/gen_entity_maps.py
    verify:      python brain/scripts/gen_entity_maps.py --check
                 (also run by brain/tests/test_entity_maps_generated.py, so a
                 one-sided rename breaks the build instead of the grow)

Edit the tables here.  Never hand-edit the generated .gen.ts files.

Nothing in this module changes runtime behaviour: every table is a verbatim
transcription of what the brain and the SPA already carried separately.
"""

from __future__ import annotations

from typing import Any

# --- Kit Pulse / Fleet page seat → entity contracts -------------------------
# Consumed by fleet_state.to_hass_states() and, via codegen, by the SPA's
# fleetFromHass.ts.

SONOFF_RELAY: dict[str, str] = {
    "heater": "switch.dsc_heater_main_relay",
    "heatmat": "switch.dsc_heatmat_main_relay",
    "humidifier": "switch.dsc_humidifier_main_relay",
    "dehumidifier": "switch.dsc_de_humidifier_main_relay",
}

SONOFF_FW: dict[str, str] = {
    "heater": "sensor.dsc_heater_firmware_version",
    "heatmat": "sensor.dsc_heatmat_firmware_version",
    "humidifier": "sensor.dsc_humidifier_firmware_version",
    "dehumidifier": "sensor.dsc_dehumidifier_firmware_version",
}

IN_SERVICE_ENTITIES: dict[str, str] = {
    "ac": "input_boolean.dsc_ac_in_service",
    "mister": "input_boolean.dsc_clone_humidifier_in_service",
    "pot1": "input_boolean.dsc_probe1_in_service",
    "pot2": "input_boolean.dsc_probe2_in_service",
    "pot3": "input_boolean.dsc_probe3_in_service",
    "pot4": "input_boolean.dsc_probe4_in_service",
    "tank": "input_boolean.dsc_tank_in_service",
}


# --- HA entity_id → fleet seat metric --------------------------------------
# Mirror of the SPA's ENTITY_FLEET_MAP (Pi history + held readings).  Rows are
# ``{"seat_id": ..., "metric": ..., "binary"?: True, "text"?: True}``; the
# generator renames ``seat_id`` → ``seatId`` on the way out.
#
# Insertion order is load-bearing only for the generated file's diff stability,
# not for lookup.

EntityFleetRef = dict[str, Any]

# Comments carried through to the generated TypeScript, keyed by the entity id
# they sit above.
ENTITY_FLEET_MAP_COMMENTS: dict[str, tuple[str, ...]] = {
    "sensor.dsc_hub_api_down_age": (
        "Hub link vitals — the brain files these as flat hub.values metrics (hub_controls.py);",
        'without these rows the Alerts/Kit chips rendered "Bounces —" and "RF —" over live data.',
    ),
    "sensor.dsc_probe1_soil_nitrogen": (
        "Match brain / ESPHome pot values keys (nitrogen|phosphorus|potassium), not short n|p|k.",
    ),
}

ENTITY_FLEET_MAP: dict[str, EntityFleetRef] = {
    "sensor.dsc_hub_api_down_age": {"seat_id": "hub", "metric": "api_down_age"},
    "sensor.dsc_hub_ha_handshake_age": {"seat_id": "hub", "metric": "ha_handshake_age"},
    "sensor.dsc_hub_link_recovery_bounces": {"seat_id": "hub", "metric": "link_recovery_bounces"},
    "sensor.dsc_hub_rf_status": {"seat_id": "hub", "metric": "rf_status", "text": True},
    "sensor.dsc_hub_wifi_rssi": {"seat_id": "hub", "metric": "wifi_rssi"},
    "sensor.dsc_hub_tent_temperature": {"seat_id": "hub", "metric": "temp_c"},
    "sensor.dsc_hub_temperature": {"seat_id": "hub", "metric": "temp_c"},
    "sensor.dsc_hub_tent_humidity": {"seat_id": "hub", "metric": "rh_pct"},
    "sensor.dsc_hub_humidity": {"seat_id": "hub", "metric": "rh_pct"},
    "sensor.dsc_hub_vpd_kpa": {"seat_id": "hub", "metric": "vpd_kpa"},
    "sensor.dsc_hub_vpd": {"seat_id": "hub", "metric": "vpd_kpa"},
    "sensor.dsc_hub_heartbeat": {"seat_id": "hub", "metric": "heartbeat"},
    "sensor.dsc_hub_uptime": {"seat_id": "hub", "metric": "uptime"},
    "sensor.dsc_hub_room_temperature": {"seat_id": "hub", "metric": "room_temp_c"},
    "sensor.dsc_hub_room_humidity": {"seat_id": "hub", "metric": "room_rh_pct"},
    "sensor.dsc_hub_room_vpd_kpa": {"seat_id": "hub", "metric": "room_vpd_kpa"},
    "sensor.dsc_hub_room_vpd": {"seat_id": "hub", "metric": "room_vpd_kpa"},
    "sensor.dsc_hub_clone_temperature": {"seat_id": "hub", "metric": "clone_temp_c"},
    "sensor.dsc_hub_clone_humidity": {"seat_id": "hub", "metric": "clone_rh_pct"},
    "sensor.dsc_hub_clone_vpd_kpa": {"seat_id": "hub", "metric": "clone_vpd_kpa"},
    "sensor.dsc_hub_clone_vpd": {"seat_id": "hub", "metric": "clone_vpd_kpa"},
    "sensor.dsc_coldest_root_zone_temp": {"seat_id": "hub", "metric": "coldest_root_c"},
    "sensor.dsc_hub_humidifier_fire_countdown": {
        "seat_id": "hub",
        "metric": "humidifier_fire_countdown",
    },
    "sensor.dsc_hub_dehumidifier_fire_countdown": {
        "seat_id": "hub",
        "metric": "dehumidifier_fire_countdown",
    },
    "sensor.dsc_hub_heater_fire_countdown": {"seat_id": "hub", "metric": "heater_fire_countdown"},
    "sensor.dsc_hub_ac_fire_countdown": {"seat_id": "hub", "metric": "ac_fire_countdown"},
    "sensor.dsc_hub_grow_mat_fire_countdown": {
        "seat_id": "hub",
        "metric": "grow_mat_fire_countdown",
    },
    "sensor.dsc_hub_clone_humidifier_fire_countdown": {
        "seat_id": "hub",
        "metric": "clone_humidifier_fire_countdown",
    },
    "sensor.dsc_hub_firmware_version": {"seat_id": "hub", "metric": "firmware_version"},
    "sensor.dsc_probe1_got_moisture": {"seat_id": "pot1", "metric": "moisture_pct"},
    "sensor.dsc_probe1_soil_moisture": {"seat_id": "pot1", "metric": "moisture_pct"},
    "sensor.dsc_probe2_soil_moisture": {"seat_id": "pot2", "metric": "moisture_pct"},
    "sensor.dsc_probe2_got_moisture": {"seat_id": "pot2", "metric": "moisture_pct"},
    "sensor.dsc_probe3_soil_moisture": {"seat_id": "pot3", "metric": "moisture_pct"},
    "sensor.dsc_probe3_got_moisture": {"seat_id": "pot3", "metric": "moisture_pct"},
    "sensor.dsc_probe4_soil_moisture": {"seat_id": "pot4", "metric": "moisture_pct"},
    "sensor.dsc_probe4_got_moisture": {"seat_id": "pot4", "metric": "moisture_pct"},
    "sensor.dsc_probe1_soil_temperature": {"seat_id": "pot1", "metric": "soil_temp_c"},
    "sensor.dsc_probe2_soil_temperature": {"seat_id": "pot2", "metric": "soil_temp_c"},
    "sensor.dsc_probe3_soil_temperature": {"seat_id": "pot3", "metric": "soil_temp_c"},
    "sensor.dsc_probe4_soil_temperature": {"seat_id": "pot4", "metric": "soil_temp_c"},
    "sensor.dsc_probe1_soil_ec": {"seat_id": "pot1", "metric": "ec_us"},
    "sensor.dsc_probe2_soil_ec": {"seat_id": "pot2", "metric": "ec_us"},
    "sensor.dsc_probe3_soil_ec": {"seat_id": "pot3", "metric": "ec_us"},
    "sensor.dsc_probe4_soil_ec": {"seat_id": "pot4", "metric": "ec_us"},
    "sensor.dsc_probe1_got_ec": {"seat_id": "pot1", "metric": "ec_us"},
    "sensor.dsc_probe2_got_ec": {"seat_id": "pot2", "metric": "ec_us"},
    "sensor.dsc_probe3_got_ec": {"seat_id": "pot3", "metric": "ec_us"},
    "sensor.dsc_probe4_got_ec": {"seat_id": "pot4", "metric": "ec_us"},
    "sensor.dsc_probe1_soil_conductivity": {"seat_id": "pot1", "metric": "ec_us"},
    "sensor.dsc_probe2_soil_conductivity": {"seat_id": "pot2", "metric": "ec_us"},
    "sensor.dsc_probe3_soil_conductivity": {"seat_id": "pot3", "metric": "ec_us"},
    "sensor.dsc_probe4_soil_conductivity": {"seat_id": "pot4", "metric": "ec_us"},
    "sensor.dsc_probe1_soil_ph": {"seat_id": "pot1", "metric": "ph"},
    "sensor.dsc_probe2_soil_ph": {"seat_id": "pot2", "metric": "ph"},
    "sensor.dsc_probe3_soil_ph": {"seat_id": "pot3", "metric": "ph"},
    "sensor.dsc_probe4_soil_ph": {"seat_id": "pot4", "metric": "ph"},
    "sensor.dsc_probe1_got_ph": {"seat_id": "pot1", "metric": "ph"},
    "sensor.dsc_probe2_got_ph": {"seat_id": "pot2", "metric": "ph"},
    "sensor.dsc_probe3_got_ph": {"seat_id": "pot3", "metric": "ph"},
    "sensor.dsc_probe4_got_ph": {"seat_id": "pot4", "metric": "ph"},
    "sensor.dsc_probe1_dryback_pct": {"seat_id": "pot1", "metric": "dryback_pct"},
    "sensor.dsc_probe2_dryback_pct": {"seat_id": "pot2", "metric": "dryback_pct"},
    "sensor.dsc_probe3_dryback_pct": {"seat_id": "pot3", "metric": "dryback_pct"},
    "sensor.dsc_probe4_dryback_pct": {"seat_id": "pot4", "metric": "dryback_pct"},
    "sensor.dsc_probe1_soil_moisture_rate": {"seat_id": "pot1", "metric": "moisture_rate"},
    "sensor.dsc_probe2_soil_moisture_rate": {"seat_id": "pot2", "metric": "moisture_rate"},
    "sensor.dsc_probe3_soil_moisture_rate": {"seat_id": "pot3", "metric": "moisture_rate"},
    "sensor.dsc_probe4_soil_moisture_rate": {"seat_id": "pot4", "metric": "moisture_rate"},
    "sensor.dsc_probe1_soil_nitrogen": {"seat_id": "pot1", "metric": "nitrogen"},
    "sensor.dsc_probe2_soil_nitrogen": {"seat_id": "pot2", "metric": "nitrogen"},
    "sensor.dsc_probe3_soil_nitrogen": {"seat_id": "pot3", "metric": "nitrogen"},
    "sensor.dsc_probe4_soil_nitrogen": {"seat_id": "pot4", "metric": "nitrogen"},
    "sensor.dsc_probe1_soil_phosphorus": {"seat_id": "pot1", "metric": "phosphorus"},
    "sensor.dsc_probe2_soil_phosphorus": {"seat_id": "pot2", "metric": "phosphorus"},
    "sensor.dsc_probe3_soil_phosphorus": {"seat_id": "pot3", "metric": "phosphorus"},
    "sensor.dsc_probe4_soil_phosphorus": {"seat_id": "pot4", "metric": "phosphorus"},
    "sensor.dsc_probe1_soil_potassium": {"seat_id": "pot1", "metric": "potassium"},
    "sensor.dsc_probe2_soil_potassium": {"seat_id": "pot2", "metric": "potassium"},
    "sensor.dsc_probe3_soil_potassium": {"seat_id": "pot3", "metric": "potassium"},
    "sensor.dsc_probe4_soil_potassium": {"seat_id": "pot4", "metric": "potassium"},
    "binary_sensor.dsc_probe1_clock_valid": {
        "seat_id": "pot1",
        "metric": "clock_valid",
        "binary": True,
    },
    "binary_sensor.dsc_probe2_clock_valid": {
        "seat_id": "pot2",
        "metric": "clock_valid",
        "binary": True,
    },
    "binary_sensor.dsc_probe3_clock_valid": {
        "seat_id": "pot3",
        "metric": "clock_valid",
        "binary": True,
    },
    "binary_sensor.dsc_probe4_clock_valid": {
        "seat_id": "pot4",
        "metric": "clock_valid",
        "binary": True,
    },
    "binary_sensor.dsc_probe1_modbus_probe_online": {
        "seat_id": "pot1",
        "metric": "modbus_probe_online",
        "binary": True,
    },
    "binary_sensor.dsc_probe2_modbus_probe_online": {
        "seat_id": "pot2",
        "metric": "modbus_probe_online",
        "binary": True,
    },
    "binary_sensor.dsc_probe3_modbus_probe_online": {
        "seat_id": "pot3",
        "metric": "modbus_probe_online",
        "binary": True,
    },
    "binary_sensor.dsc_probe4_modbus_probe_online": {
        "seat_id": "pot4",
        "metric": "modbus_probe_online",
        "binary": True,
    },
    "binary_sensor.dsc_probe1_sensor_fault": {
        "seat_id": "pot1",
        "metric": "sensor_fault",
        "binary": True,
    },
    "binary_sensor.dsc_probe2_sensor_fault": {
        "seat_id": "pot2",
        "metric": "sensor_fault",
        "binary": True,
    },
    "binary_sensor.dsc_probe3_sensor_fault": {
        "seat_id": "pot3",
        "metric": "sensor_fault",
        "binary": True,
    },
    "binary_sensor.dsc_probe4_sensor_fault": {
        "seat_id": "pot4",
        "metric": "sensor_fault",
        "binary": True,
    },
    "switch.dsc_heater_main_relay": {"seat_id": "heater", "metric": "relay_on", "binary": True},
    "switch.dsc_heatmat_main_relay": {"seat_id": "heatmat", "metric": "relay_on", "binary": True},
    "switch.dsc_humidifier_main_relay": {
        "seat_id": "humidifier",
        "metric": "relay_on",
        "binary": True,
    },
    "switch.dsc_de_humidifier_main_relay": {
        "seat_id": "dehumidifier",
        "metric": "relay_on",
        "binary": True,
    },
}


# --- Kit page node definitions ---------------------------------------------
# Mirror of the SPA's KIT_DEFS.  Row keys are snake_case here and camelCased by
# the generator; per-row key order is preserved into the emitted TypeScript.

# Full entity universe (Device restore / maps). Not the Live kit.
ALL_PROBE_NUMBERS: tuple[int, ...] = (1, 2, 3, 4)

# Operator kit — Live Root, honesty, Fleet pulse, idle-home defaults.
# KIT_DEFS' probe rows expand from this, so it has to be generated alongside
# them: before codegen the SPA derived those rows from its own copy in
# probeModel.ts, and a Python-only edit here would otherwise drift.
KIT_PROBE_NUMBERS: tuple[int, ...] = (1, 2)

KitDefRow = dict[str, Any]

# KNOWN-DEAD IDS, transcribed as-is from the SPA rather than corrected — see
# docs/FOLLOWUPS.md (2026-09-09). Fixing an id here changes what the live grow
# actuates, so each one needs an operator decision, not a codegen pass:
#   * dehumidifier.firmware_entity says "de_humidifier"; SONOFF_FW (above) and
#     the brain publish "dsc_dehumidifier_firmware_version". Nothing resolves it.
#   * heater/humidifier cycles_today have no producer anywhere in brain/; the
#     brain emits *_cycles_last_hour and the *_runtime_today family instead.
#   * ac/mister relay_entity have no producer either — expected, F-001/F-002 are
#     on indefinite hold and control_ops._PHANTOM_RELAY_SEATS covers those seats.
KIT_DEFS: list[KitDefRow] = [
    {
        "id": "hub",
        "label": "Hub",
        "link_entity": "binary_sensor.dsc_hub_link",
        "firmware_entity": "sensor.dsc_hub_firmware_version",
    },
    {
        "id": "heater",
        "label": "Heater",
        "demand_entity": "switch.dsc_hub_heater_demand",
        "relay_entity": "switch.dsc_heater_main_relay",
        "runtime_today": "sensor.dsc_heater_runtime_today",
        "cycles_today": "sensor.dsc_heater_cycles_today",
        "firmware_entity": "sensor.dsc_heater_firmware_version",
    },
    {
        "id": "heatmat",
        "label": "Heat mat",
        "demand_entity": "switch.dsc_hub_grow_mat_demand",
        "relay_entity": "switch.dsc_heatmat_main_relay",
        "runtime_today": "sensor.dsc_growmat_runtime_today",
        "firmware_entity": "sensor.dsc_heatmat_firmware_version",
    },
    {
        "id": "ac",
        "label": "AC",
        "in_service_entity": "input_boolean.dsc_ac_in_service",
        "planned_when_off": True,
        "demand_entity": "switch.dsc_hub_ac_demand",
        "relay_entity": "switch.dsc_ac_main_relay",
        "runtime_today": "sensor.dsc_ac_runtime_today",
    },
    {
        "id": "humidifier",
        "label": "Humidifier",
        "demand_entity": "switch.dsc_hub_humidifier_demand",
        "relay_entity": "switch.dsc_humidifier_main_relay",
        "runtime_today": "sensor.dsc_humidifier_runtime_today",
        "cycles_today": "sensor.dsc_humidifier_cycles_today",
        "firmware_entity": "sensor.dsc_humidifier_firmware_version",
    },
    {
        "id": "dehumidifier",
        "label": "Dehumidifier",
        "demand_entity": "switch.dsc_hub_dehumidifier_demand",
        "relay_entity": "switch.dsc_de_humidifier_main_relay",
        "runtime_today": "sensor.dsc_dehumidifier_runtime_today",
        "firmware_entity": "sensor.dsc_de_humidifier_firmware_version",
    },
    {
        "id": "mister",
        "label": "Clone mister",
        "in_service_entity": "input_boolean.dsc_clone_humidifier_in_service",
        "planned_when_off": True,
        "demand_entity": "switch.dsc_hub_clone_humidifier_demand",
        "relay_entity": "switch.dsc_clone_humidifier_main_relay",
    },
    *[
        {
            "id": f"pot{n}",
            "label": f"Probe {n}",
            "in_service_entity": f"input_boolean.dsc_probe{n}_in_service",
            "planned_when_off": False,
            "firmware_entity": f"sensor.dsc_probe{n}_firmware_version",
        }
        for n in KIT_PROBE_NUMBERS
    ],
    {
        "id": "tank",
        "label": "Tank",
        "in_service_entity": "input_boolean.dsc_tank_in_service",
        "planned_when_off": True,
    },
]
