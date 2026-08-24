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
}

HUB_SELECT_ENTITY_TO_OID: dict[str, str] = {v: k for k, v in HUB_SELECT_OID_TO_ENTITY.items()}

HUB_SWITCH_OID_TO_ENTITY: dict[str, str] = {v: k for k, v in HUB_SWITCH_ENTITY_TO_OID.items()}
HUB_NUMBER_OID_TO_ENTITY: dict[str, str] = {v: k for k, v in HUB_NUMBER_ENTITY_TO_OID.items()}
