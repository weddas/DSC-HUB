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
    "sensor.dsc_pot1_soil_moisture": ("pot1", "moisture_pct"),
    "sensor.dsc_pot2_soil_moisture": ("pot2", "moisture_pct"),
    "sensor.dsc_pot3_soil_moisture": ("pot3", "moisture_pct"),
    "sensor.dsc_pot4_soil_moisture": ("pot4", "moisture_pct"),
    "sensor.dsc_pot1_soil_temperature": ("pot1", "soil_temp_c"),
    "sensor.dsc_pot2_soil_temperature": ("pot2", "soil_temp_c"),
    "sensor.dsc_pot3_soil_temperature": ("pot3", "soil_temp_c"),
    "sensor.dsc_pot4_soil_temperature": ("pot4", "soil_temp_c"),
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
}


def query_entity_history(entity_id: str, hours: float = 6.0) -> list[dict[str, Any]]:
    key = ENTITY_METRIC_MAP.get(entity_id)
    if not key:
        return []
    seat_id, metric = key
    since = time.time() - hours * 3600.0
    rows = list_history(seat_id, metric, since)
    return [{"t": int(r["ts"] * 1000), "v": float(r["value"])} for r in rows if r.get("value") is not None]
