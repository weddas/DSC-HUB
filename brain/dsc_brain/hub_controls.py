"""Hub Native API entity_id ↔ object_id maps (ingest + control proxy).

ESPHome 2026+ publishes name-slug object_ids (e.g. ``grow_mat_demand``,
``4_inch_intake_fan__main_``). Older firmware used internal C++ ids
(``growmat_demand``, ``fan_intake_main``). Ingest maps accept both; control
proxy uses the live slug the hub actually exposes.
"""

from __future__ import annotations

HUB_SWITCH_ENTITY_TO_OID: dict[str, str] = {
    "switch.dsc_hub_heater_demand": "heater_demand",
    "switch.dsc_hub_humidifier_demand": "humidifier_demand",
    "switch.dsc_hub_dehumidifier_demand": "dehumidifier_demand",
    "switch.dsc_hub_grow_mat_demand": "grow_mat_demand",
    "switch.dsc_hub_ac_demand": "ac_demand",
    "switch.dsc_hub_clone_humidifier_demand": "clone_humidifier_demand",
    "switch.dsc_hub_tent_full_auto_mode": "tent_full_auto_mode",
    "switch.dsc_hub_manual_takeover": "manual_takeover",
    "switch.dsc_hub_tent_manual_override": "tent_manual_override",
    "switch.dsc_hub_humidifier_intake_routing": "humidifier_intake_routing",
    "switch.dsc_hub_recirc_de_strat_pulse": "recirc_de-strat_pulse",
    "switch.dsc_hub_auto_photoperiod": "auto_photoperiod",
}

HUB_SWITCH_OID_TO_ENTITY: dict[str, str] = {
    "heater_demand": "switch.dsc_hub_heater_demand",
    "humidifier_demand": "switch.dsc_hub_humidifier_demand",
    "dehumidifier_demand": "switch.dsc_hub_dehumidifier_demand",
    "grow_mat_demand": "switch.dsc_hub_grow_mat_demand",
    "growmat_demand": "switch.dsc_hub_grow_mat_demand",
    "ac_demand": "switch.dsc_hub_ac_demand",
    "clone_humidifier_demand": "switch.dsc_hub_clone_humidifier_demand",
    "tent_full_auto_mode": "switch.dsc_hub_tent_full_auto_mode",
    "full_auto_switch": "switch.dsc_hub_tent_full_auto_mode",
    "manual_takeover": "switch.dsc_hub_manual_takeover",
    "manual_takeover_switch": "switch.dsc_hub_manual_takeover",
    "tent_manual_override": "switch.dsc_hub_tent_manual_override",
    "humidifier_intake_routing": "switch.dsc_hub_humidifier_intake_routing",
    "recirc_de-strat_pulse": "switch.dsc_hub_recirc_de_strat_pulse",
    "recirc_de_strat_pulse": "switch.dsc_hub_recirc_de_strat_pulse",
    "auto_photoperiod": "switch.dsc_hub_auto_photoperiod",
    "photoperiod_switch": "switch.dsc_hub_auto_photoperiod",
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
    "number.dsc_hub_mat_root_zone_low": "mat_root-zone_low",
    "number.dsc_hub_mat_root_zone_high": "mat_root-zone_high",
    "number.dsc_hub_clone_light_hours": "clone_light_hours",
}

HUB_NUMBER_OID_TO_ENTITY: dict[str, str] = {
    "target_temp": "number.dsc_hub_target_temp",
    "rh_target_min": "number.dsc_hub_rh_target_min",
    "rh_target_max": "number.dsc_hub_rh_target_max",
    "vpd_target_min": "number.dsc_hub_vpd_target_min",
    "vpd_target_max": "number.dsc_hub_vpd_target_max",
    "clone_target_temp": "number.dsc_hub_clone_target_temp",
    "clone_rh_min": "number.dsc_hub_clone_rh_min",
    "clone_rh_max": "number.dsc_hub_clone_rh_max",
    "clone_vpd_min": "number.dsc_hub_clone_vpd_min",
    "clone_vpd_max": "number.dsc_hub_clone_vpd_max",
    "mat_root-zone_low": "number.dsc_hub_mat_root_zone_low",
    "mat_root-zone_high": "number.dsc_hub_mat_root_zone_high",
    "num_mat_rz_low": "number.dsc_hub_mat_root_zone_low",
    "num_mat_rz_high": "number.dsc_hub_mat_root_zone_high",
    "clone_light_hours": "number.dsc_hub_clone_light_hours",
    "num_clone_light_hours": "number.dsc_hub_clone_light_hours",
}

HUB_FAN_OID_TO_ENTITY: dict[str, str] = {
    "fan_intake_main": "fan.dsc_hub_4_inch_intake_fan_main",
    "4_inch_intake_fan__main_": "fan.dsc_hub_4_inch_intake_fan_main",
    "fan_intake_clone": "fan.dsc_hub_4_inch_intake_fan_2x4",
    "4_inch_intake_fan__2x4_": "fan.dsc_hub_4_inch_intake_fan_2x4",
    "fan_exhaust_recirc": "fan.dsc_hub_6_inch_exhaust_room",
    "6_inch_exhaust__room_": "fan.dsc_hub_6_inch_exhaust_room",
    "fan_exhaust_out": "fan.dsc_hub_6_inch_exhaust_outside",
    "6_inch_exhaust__outside_": "fan.dsc_hub_6_inch_exhaust_outside",
}

HUB_FAN_ENTITY_TO_OID: dict[str, str] = {
    "fan.dsc_hub_4_inch_intake_fan_main": "4_inch_intake_fan__main_",
    "fan.dsc_hub_4_inch_intake_fan_2x4": "4_inch_intake_fan__2x4_",
    "fan.dsc_hub_6_inch_exhaust_room": "6_inch_exhaust__room_",
    "fan.dsc_hub_6_inch_exhaust_outside": "6_inch_exhaust__outside_",
}

HUB_LIGHT_OID_TO_ENTITY: dict[str, str] = {
    "light_sf1000": "light.dsc_hub_sf1000_dimmer",
    "sf1000_dimmer": "light.dsc_hub_sf1000_dimmer",
}

HUB_LIGHT_ENTITY_TO_OID: dict[str, str] = {
    "light.dsc_hub_sf1000_dimmer": "sf1000_dimmer",
}

HUB_SELECT_OID_TO_ENTITY: dict[str, str] = {
    "control_strategy": "select.dsc_hub_control_strategy",
    "priority_tent_select": "select.dsc_hub_priority_tent",
    "priority_tent": "select.dsc_hub_priority_tent",
    "grow_stage": "select.dsc_hub_grow_stage",
    "clone_mode": "select.dsc_hub_clone_mode",
    "clone_photo_select": "select.dsc_hub_clone_photoperiod",
    "clone_photoperiod": "select.dsc_hub_clone_photoperiod",
}

HUB_SELECT_ENTITY_TO_OID: dict[str, str] = {
    "select.dsc_hub_control_strategy": "control_strategy",
    "select.dsc_hub_priority_tent": "priority_tent",
    "select.dsc_hub_grow_stage": "grow_stage",
    "select.dsc_hub_clone_mode": "clone_mode",
    "select.dsc_hub_clone_photoperiod": "clone_photoperiod",
}

# ESPHome object_id → hub.values metric key (exact match — id and name-slug variants)
HUB_SENSOR_OID_TO_KEY: dict[str, str] = {
    "temp_sensor": "temp_c",
    "tent_temperature": "temp_c",
    "humidity_sensor": "rh_pct",
    "tent_humidity": "rh_pct",
    "vpd_sensor": "vpd_kpa",
    "vpd_kpa": "vpd_kpa",
    "vpd__kpa_": "vpd_kpa",
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
    "clone_vpd__kpa_": "clone_vpd_kpa",
    "hub_heartbeat": "heartbeat",
    "heartbeat": "heartbeat",
    "uptime_s": "uptime",
    "uptime": "uptime",
    # Ladder fire countdowns
    "sens_hum_countdown": "humidifier_fire_countdown",
    "humidifier_fire_countdown": "humidifier_fire_countdown",
    "sens_dehum_countdown": "dehumidifier_fire_countdown",
    "dehumidifier_fire_countdown": "dehumidifier_fire_countdown",
    "sens_heater_countdown": "heater_fire_countdown",
    "heater_fire_countdown": "heater_fire_countdown",
    "sens_ac_countdown": "ac_fire_countdown",
    "ac_fire_countdown": "ac_fire_countdown",
    "sens_mat_countdown": "grow_mat_fire_countdown",
    "grow_mat_fire_countdown": "grow_mat_fire_countdown",
    "sens_clone_hum_countdown": "clone_humidifier_fire_countdown",
    "clone_humidifier_fire_countdown": "clone_humidifier_fire_countdown",
    # Ladder cooldown remaining
    "sens_hum_cooldown": "humidifier_cooldown_remaining",
    "humidifier_cooldown_remaining": "humidifier_cooldown_remaining",
    "sens_dehum_cooldown": "dehumidifier_cooldown_remaining",
    "dehumidifier_cooldown_remaining": "dehumidifier_cooldown_remaining",
    "sens_heater_cooldown": "heater_cooldown_remaining",
    "heater_cooldown_remaining": "heater_cooldown_remaining",
    "sens_ac_cooldown": "ac_cooldown_remaining",
    "ac_cooldown_remaining": "ac_cooldown_remaining",
    "sens_mat_cooldown": "grow_mat_cooldown_remaining",
    "grow_mat_cooldown_remaining": "grow_mat_cooldown_remaining",
    "sens_clone_hum_cooldown": "clone_humidifier_cooldown_remaining",
    "clone_humidifier_cooldown_remaining": "clone_humidifier_cooldown_remaining",
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
    "root-zone_sensor_fault": "binary_sensor.dsc_hub_root_zone_sensor_fault",
    "emergency_failsafe": "binary_sensor.dsc_hub_emergency_failsafe",
    "climate_sensor_fault": "binary_sensor.dsc_hub_climate_sensor_fault",
    "aux_sensor_fault": "binary_sensor.dsc_hub_aux_sensor_fault",
    "coherence_mismatch": "binary_sensor.dsc_hub_coherence_mismatch",
    "coherence_mismatch_bs": "binary_sensor.dsc_hub_coherence_mismatch",
    "pot1_espnow_link": "binary_sensor.dsc_hub_pot1_esp_now_link",
    "pot1_esp_now_link": "binary_sensor.dsc_hub_pot1_esp_now_link",
    "pot1_esp-now_link": "binary_sensor.dsc_hub_pot1_esp_now_link",
    "pot2_espnow_link": "binary_sensor.dsc_hub_pot2_esp_now_link",
    "pot2_esp_now_link": "binary_sensor.dsc_hub_pot2_esp_now_link",
    "pot2_esp-now_link": "binary_sensor.dsc_hub_pot2_esp_now_link",
    "pot3_espnow_link": "binary_sensor.dsc_hub_pot3_esp_now_link",
    "pot3_esp_now_link": "binary_sensor.dsc_hub_pot3_esp_now_link",
    "pot3_esp-now_link": "binary_sensor.dsc_hub_pot3_esp_now_link",
    "pot4_espnow_link": "binary_sensor.dsc_hub_pot4_esp_now_link",
    "pot4_esp_now_link": "binary_sensor.dsc_hub_pot4_esp_now_link",
    "pot4_esp-now_link": "binary_sensor.dsc_hub_pot4_esp_now_link",
}

# Text sensor object_id → fleet.values key (firmware string, not float)
HUB_TEXT_SENSOR_OID_TO_KEY: dict[str, str] = {
    "firmware_version": "firmware_version",
    "rf_status": "rf_status",
}
