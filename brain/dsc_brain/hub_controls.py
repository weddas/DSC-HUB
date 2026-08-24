"""Hub Native API entity_id ↔ object_id maps (ingest + control proxy)."""

from __future__ import annotations

HUB_SWITCH_ENTITY_TO_OID: dict[str, str] = {
    "switch.dsc_hub_heater_demand": "heater_demand",
    "switch.dsc_hub_humidifier_demand": "humidifier_demand",
    "switch.dsc_hub_dehumidifier_demand": "dehumidifier_demand",
    "switch.dsc_hub_grow_mat_demand": "growmat_demand",
    "switch.dsc_hub_ac_demand": "ac_demand",
    "switch.dsc_hub_clone_humidifier_demand": "clone_humidifier_demand",
    "switch.dsc_hub_tent_full_auto_mode": "full_auto_switch",
    "switch.dsc_hub_manual_takeover": "manual_takeover_switch",
    "switch.dsc_hub_tent_manual_override": "tent_manual_override",
    "switch.dsc_hub_humidifier_intake_routing": "humidifier_intake_routing",
    "switch.dsc_hub_recirc_de_strat_pulse": "recirc_de_strat_pulse",
}

HUB_NUMBER_ENTITY_TO_OID: dict[str, str] = {
    "number.dsc_hub_target_temp": "target_temp",
    "number.dsc_hub_rh_target_min": "rh_target_min",
    "number.dsc_hub_rh_target_max": "rh_target_max",
    "number.dsc_hub_vpd_target_min": "vpd_target_min",
    "number.dsc_hub_vpd_target_max": "vpd_target_max",
    "number.dsc_hub_clone_target_temp": "clone_target_temp",
    "number.dsc_hub_clone_rh_min": "clone_rh_min",
    "number.dsc_hub_clone_rh_max": "clone_rh_max",
    "number.dsc_hub_clone_vpd_min": "clone_vpd_min",
    "number.dsc_hub_clone_vpd_max": "clone_vpd_max",
    "number.dsc_hub_mat_root_zone_low": "num_mat_rz_low",
    "number.dsc_hub_mat_root_zone_high": "num_mat_rz_high",
    "number.dsc_hub_clone_light_hours": "num_clone_light_hours",
}

HUB_FAN_OID_TO_ENTITY: dict[str, str] = {
    "fan_intake_main": "fan.dsc_hub_4_inch_intake_fan_main",
    "fan_intake_clone": "fan.dsc_hub_4_inch_intake_fan_2x4",
    "fan_exhaust_recirc": "fan.dsc_hub_6_inch_exhaust_room",
    "fan_exhaust_out": "fan.dsc_hub_6_inch_exhaust_outside",
}

HUB_FAN_ENTITY_TO_OID: dict[str, str] = {v: k for k, v in HUB_FAN_OID_TO_ENTITY.items()}

HUB_LIGHT_OID_TO_ENTITY: dict[str, str] = {
    "light_sf1000": "light.dsc_hub_sf1000_dimmer",
}

HUB_LIGHT_ENTITY_TO_OID: dict[str, str] = {v: k for k, v in HUB_LIGHT_OID_TO_ENTITY.items()}

HUB_SELECT_OID_TO_ENTITY: dict[str, str] = {
    "control_strategy": "select.dsc_hub_control_strategy",
    "priority_tent_select": "select.dsc_hub_priority_tent",
    "grow_stage": "select.dsc_hub_grow_stage",
    "clone_mode": "select.dsc_hub_clone_mode",
    "clone_photo_select": "select.dsc_hub_clone_photoperiod",
}

HUB_SELECT_ENTITY_TO_OID: dict[str, str] = {v: k for k, v in HUB_SELECT_OID_TO_ENTITY.items()}

HUB_SWITCH_OID_TO_ENTITY: dict[str, str] = {v: k for k, v in HUB_SWITCH_ENTITY_TO_OID.items()}
HUB_NUMBER_OID_TO_ENTITY: dict[str, str] = {v: k for k, v in HUB_NUMBER_ENTITY_TO_OID.items()}

# ESPHome object_id → hub.values metric key (exact match — id and name-slug variants)
HUB_SENSOR_OID_TO_KEY: dict[str, str] = {
    "temp_sensor": "temp_c",
    "tent_temperature": "temp_c",
    "humidity_sensor": "rh_pct",
    "tent_humidity": "rh_pct",
    "vpd_sensor": "vpd_kpa",
    "vpd_kpa": "vpd_kpa",
    "room_temp": "room_temp_c",
    "room_temperature": "room_temp_c",
    "room_rh": "room_rh_pct",
    "room_humidity": "room_rh_pct",
    "clone_temp": "clone_temp_c",
    "clone_temperature": "clone_temp_c",
    "clone_rh": "clone_rh_pct",
    "clone_humidity": "clone_rh_pct",
    "clone_vpd": "clone_vpd_kpa",
    "clone_vpd_kpa": "clone_vpd_kpa",
    "hub_heartbeat": "heartbeat",
    "heartbeat": "heartbeat",
    "uptime_s": "uptime",
    "uptime": "uptime",
}

HUB_BINARY_OID_TO_ENTITY: dict[str, str] = {
    "main_window_bs": "binary_sensor.dsc_hub_4x8_window_open",
    "4x8_window_open": "binary_sensor.dsc_hub_4x8_window_open",
    "clone_window_bs": "binary_sensor.dsc_hub_2x4_window_open",
    "2x4_window_open": "binary_sensor.dsc_hub_2x4_window_open",
    "light_catchup_bs": "binary_sensor.dsc_hub_light_catchup_active",
    "light_catchup_active": "binary_sensor.dsc_hub_light_catchup_active",
    "rootzone_fault_bs": "binary_sensor.dsc_hub_root_zone_sensor_fault",
    "root_zone_sensor_fault": "binary_sensor.dsc_hub_root_zone_sensor_fault",
    "pot1_espnow_link": "binary_sensor.dsc_hub_pot1_esp_now_link",
    "pot1_esp_now_link": "binary_sensor.dsc_hub_pot1_esp_now_link",
    "pot2_espnow_link": "binary_sensor.dsc_hub_pot2_esp_now_link",
    "pot2_esp_now_link": "binary_sensor.dsc_hub_pot2_esp_now_link",
    "pot3_espnow_link": "binary_sensor.dsc_hub_pot3_esp_now_link",
    "pot3_esp_now_link": "binary_sensor.dsc_hub_pot3_esp_now_link",
    "pot4_espnow_link": "binary_sensor.dsc_hub_pot4_esp_now_link",
    "pot4_esp_now_link": "binary_sensor.dsc_hub_pot4_esp_now_link",
}

