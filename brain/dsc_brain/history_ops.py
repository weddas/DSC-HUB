"""Entity ↔ fleet history mapping for Pi UI charts."""

from __future__ import annotations

import time
from typing import Any

from .settings import list_history

# entity_id → (seat_id, metric) stored in fleet_history
ENTITY_METRIC_MAP: dict[str, tuple[str, str]] = {
    "sensor.dsc_hub_tent_temperature": ("hub", "temp_c"),
    "sensor.dsc_hub_temperature": ("hub", "temp_c"),
    "sensor.dsc_hub_tent_humidity": ("hub", "rh_pct"),
    "sensor.dsc_hub_humidity": ("hub", "rh_pct"),
    "sensor.dsc_hub_vpd_kpa": ("hub", "vpd_kpa"),
    "sensor.dsc_hub_vpd": ("hub", "vpd_kpa"),
    "sensor.dsc_hub_room_temperature": ("hub", "room_temp_c"),
    "sensor.dsc_hub_room_humidity": ("hub", "room_rh_pct"),
    "sensor.dsc_hub_room_vpd_kpa": ("hub", "room_vpd_kpa"),
    "sensor.dsc_hub_room_vpd": ("hub", "room_vpd_kpa"),
    "sensor.dsc_hub_clone_temperature": ("hub", "clone_temp_c"),
    "sensor.dsc_hub_clone_humidity": ("hub", "clone_rh_pct"),
    "sensor.dsc_hub_clone_vpd_kpa": ("hub", "clone_vpd_kpa"),
    "sensor.dsc_hub_clone_vpd": ("hub", "clone_vpd_kpa"),
    "sensor.dsc_leaf_vpd_kpa": ("hub", "leaf_vpd_kpa"),
    "sensor.dsc_clone_leaf_vpd_kpa": ("hub", "clone_leaf_vpd_kpa"),
    "sensor.dsc_coldest_root_zone_temp": ("hub", "coldest_root_c"),
    "sensor.dsc_pot1_soil_moisture": ("pot1", "moisture_pct"),
    "sensor.dsc_pot2_soil_moisture": ("pot2", "moisture_pct"),
    "sensor.dsc_pot3_soil_moisture": ("pot3", "moisture_pct"),
    "sensor.dsc_pot4_soil_moisture": ("pot4", "moisture_pct"),
    "sensor.dsc_pot1_soil_temperature": ("pot1", "soil_temp_c"),
    "sensor.dsc_pot2_soil_temperature": ("pot2", "soil_temp_c"),
    "sensor.dsc_pot3_soil_temperature": ("pot3", "soil_temp_c"),
    "sensor.dsc_pot4_soil_temperature": ("pot4", "soil_temp_c"),
    "sensor.dsc_pot1_soil_conductivity": ("pot1", "ec_us"),
    "sensor.dsc_pot2_soil_conductivity": ("pot2", "ec_us"),
    "sensor.dsc_pot3_soil_conductivity": ("pot3", "ec_us"),
    "sensor.dsc_pot4_soil_conductivity": ("pot4", "ec_us"),
    # Legacy alias — prefer soil_conductivity when both exist in ingest
    "sensor.dsc_pot1_soil_ec": ("pot1", "ec_us"),
    "sensor.dsc_pot2_soil_ec": ("pot2", "ec_us"),
    "sensor.dsc_pot3_soil_ec": ("pot3", "ec_us"),
    "sensor.dsc_pot4_soil_ec": ("pot4", "ec_us"),
    "sensor.dsc_pot1_soil_ph": ("pot1", "ph"),
    "sensor.dsc_pot2_soil_ph": ("pot2", "ph"),
    "sensor.dsc_pot3_soil_ph": ("pot3", "ph"),
    "sensor.dsc_pot4_soil_ph": ("pot4", "ph"),
    "switch.dsc_heater_main_relay": ("heater", "relay_on"),
    "switch.dsc_heatmat_main_relay": ("heatmat", "relay_on"),
    "switch.dsc_humidifier_main_relay": ("humidifier", "relay_on"),
    "switch.dsc_de_humidifier_main_relay": ("dehumidifier", "relay_on"),
    "sensor.dsc_fan_intake_main_pct": ("hub", "fan_intake_main_pct"),
    "sensor.dsc_fan_intake_2x4_pct": ("hub", "fan_intake_2x4_pct"),
    "sensor.dsc_fan_exhaust_outside_pct": ("hub", "fan_exhaust_outside_pct"),
    "sensor.dsc_fan_exhaust_room_pct": ("hub", "fan_exhaust_room_pct"),
    "binary_sensor.dsc_hub_4x8_window_open": ("hub", "window_4x8_open"),
    "binary_sensor.dsc_4x8_window_open": ("hub", "window_4x8_open"),
    "binary_sensor.dsc_hub_2x4_window_open": ("hub", "window_2x4_open"),
    "binary_sensor.dsc_2x4_window_open": ("hub", "window_2x4_open"),
    "light.dsc_hub_sf1000_dimmer": ("hub", "sf1000_brightness"),
    "switch.dsc_hub_grow_mat_demand": ("hub", "switch_dsc_hub_grow_mat_demand"),
}


def query_entity_history(entity_id: str, hours: float = 6.0) -> list[dict[str, Any]]:
    key = ENTITY_METRIC_MAP.get(entity_id)
    if not key:
        return []
    seat_id, metric = key
    since = time.time() - hours * 3600.0
    rows = sorted(list_history(seat_id, metric, since), key=lambda r: r["ts"])
    return [{"t": int(r["ts"] * 1000), "v": float(r["value"])} for r in rows if r.get("value") is not None]
