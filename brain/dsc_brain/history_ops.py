"""Entity ↔ fleet history mapping for Pi UI charts."""

from __future__ import annotations

import time
from typing import Any

from .settings import list_history, list_history_bucketed

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
    "sensor.dsc_probe1_soil_moisture": ("pot1", "moisture_pct"),
    "sensor.dsc_probe2_soil_moisture": ("pot2", "moisture_pct"),
    "sensor.dsc_probe3_soil_moisture": ("pot3", "moisture_pct"),
    "sensor.dsc_probe4_soil_moisture": ("pot4", "moisture_pct"),
    # SPA potGotEntity prefers got_* when live; same fleet_history metrics.
    "sensor.dsc_probe1_got_moisture": ("pot1", "moisture_pct"),
    "sensor.dsc_probe2_got_moisture": ("pot2", "moisture_pct"),
    "sensor.dsc_probe3_got_moisture": ("pot3", "moisture_pct"),
    "sensor.dsc_probe4_got_moisture": ("pot4", "moisture_pct"),
    "sensor.dsc_probe1_soil_temperature": ("pot1", "soil_temp_c"),
    "sensor.dsc_probe2_soil_temperature": ("pot2", "soil_temp_c"),
    "sensor.dsc_probe3_soil_temperature": ("pot3", "soil_temp_c"),
    "sensor.dsc_probe4_soil_temperature": ("pot4", "soil_temp_c"),
    "sensor.dsc_probe1_soil_conductivity": ("pot1", "ec_us"),
    "sensor.dsc_probe2_soil_conductivity": ("pot2", "ec_us"),
    "sensor.dsc_probe3_soil_conductivity": ("pot3", "ec_us"),
    "sensor.dsc_probe4_soil_conductivity": ("pot4", "ec_us"),
    # Legacy alias — prefer soil_conductivity when both exist in ingest
    "sensor.dsc_probe1_soil_ec": ("pot1", "ec_us"),
    "sensor.dsc_probe2_soil_ec": ("pot2", "ec_us"),
    "sensor.dsc_probe3_soil_ec": ("pot3", "ec_us"),
    "sensor.dsc_probe4_soil_ec": ("pot4", "ec_us"),
    "sensor.dsc_probe1_got_ec": ("pot1", "ec_us"),
    "sensor.dsc_probe2_got_ec": ("pot2", "ec_us"),
    "sensor.dsc_probe3_got_ec": ("pot3", "ec_us"),
    "sensor.dsc_probe4_got_ec": ("pot4", "ec_us"),
    "sensor.dsc_probe1_soil_ph": ("pot1", "ph"),
    "sensor.dsc_probe2_soil_ph": ("pot2", "ph"),
    "sensor.dsc_probe3_soil_ph": ("pot3", "ph"),
    "sensor.dsc_probe4_soil_ph": ("pot4", "ph"),
    "sensor.dsc_probe1_got_ph": ("pot1", "ph"),
    "sensor.dsc_probe2_got_ph": ("pot2", "ph"),
    "sensor.dsc_probe3_got_ph": ("pot3", "ph"),
    "sensor.dsc_probe4_got_ph": ("pot4", "ph"),
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
    # Twin / SF1000 → binary on for DutyStrip (brightness still ingested separately).
    "light.dsc_hub_twin_sf1000": ("hub", "twin_sf1000_on"),
    "light.dsc_hub_sf1000_dimmer": ("hub", "sf1000_on"),
    "switch.dsc_hub_grow_mat_demand": ("hub", "switch_dsc_hub_grow_mat_demand"),
}


# Hub numeric values the ESPHome client records verbatim under their key
# (esphome_client: `for metric, value in values.items()`), addressable as
# `sensor.dsc_hub_<key>` without a hand-written map entry.
HUB_VALUE_KEYS: frozenset[str] = frozenset(
    {
        "temp_c", "rh_pct", "room_temp_c", "room_rh_pct", "clone_temp_c", "clone_rh_pct",
        "vpd_kpa", "clone_vpd_kpa", "room_vpd_kpa", "leaf_vpd_kpa", "clone_leaf_vpd_kpa",
        "co2_sensor_voltage", "dynamic_co2_ppm", "wifi_rssi", "uptime", "heartbeat",
        "api_down_age", "ha_handshake_age", "link_recovery_bounces",
        "light_delivered_hours", "light_debt_hours", "mister_delivered_hours", "mister_debt_hours",
        "vpd_main_band_hours", "vpd_clone_band_hours", "vpd_main_band_debt_hours", "vpd_clone_band_debt_hours",
        "dehumidifier_fire_countdown", "humidifier_fire_countdown", "heater_fire_countdown",
        "ac_fire_countdown", "grow_mat_fire_countdown", "clone_humidifier_fire_countdown",
        "humidifier_cooldown_remaining", "dehumidifier_cooldown_remaining", "ac_cooldown_remaining",
        "heater_cooldown_remaining", "grow_mat_cooldown_remaining", "clone_humidifier_cooldown_remaining",
    }
)

# Seat the brain uses for its own computed entities (computed_history.py).
COMPUTED_SEAT = "computed"


# Binaries a pot node publishes itself (esphome_client POT_BINARY_OID_TO_KEY values).
POT_DEVICE_BINARIES = frozenset({"sensor_fault", "modbus_probe_online", "clock_valid"})


def resolve_entity_metric(entity_id: str) -> tuple[str, str] | None:
    """entity_id → (seat_id, metric), or None when the recorder has no such series.

    Static map first (hand-curated names), then the generic shapes the recorder writes:
    hub controls (`switch.dsc_hub_*`, `number.dsc_hub_*`), hub binaries
    (`binary_sensor.dsc_*` → `bin_*`), raw hub values (`sensor.dsc_hub_<key>`), probe values
    (`sensor.dsc_probe<n>_<key>`), and the brain's computed entities (seat `computed`,
    metric = entity_id)."""
    key = ENTITY_METRIC_MAP.get(entity_id)
    if key:
        return key
    eid = (entity_id or "").strip()
    if not eid or "." not in eid:
        return None
    domain, obj = eid.split(".", 1)
    if domain == "switch" and obj.startswith("dsc_hub_"):
        return ("hub", f"switch_{obj}")
    if domain == "number" and obj.startswith("dsc_hub_"):
        return ("hub", f"number_{obj}")
    if domain == "binary_sensor" and obj.startswith("dsc_hub_"):
        return ("hub", f"bin_{obj}")
    if domain == "sensor" and obj.startswith("dsc_hub_") and obj[len("dsc_hub_"):] in HUB_VALUE_KEYS:
        return ("hub", obj[len("dsc_hub_"):])
    if domain == "sensor" and obj.startswith("dsc_probe") and "_" in obj[9:]:
        n, _, rest = obj[9:].partition("_")
        if n.isdigit() and rest:
            return (f"pot{n}", rest)
    # Device-published probe binaries (recorded per seat as bin_<key>); computed trust
    # flags (sensor_stuck, untrusted) stay with the computed seat below.
    if domain == "binary_sensor" and obj.startswith("dsc_probe") and "_" in obj[9:]:
        n, _, rest = obj[9:].partition("_")
        if n.isdigit() and rest in POT_DEVICE_BINARIES:
            return (f"pot{n}", f"bin_{rest}")
    if domain in ("sensor", "binary_sensor") and obj.startswith("dsc_"):
        return (COMPUTED_SEAT, eid)
    return None


def is_tracked(entity_id: str) -> bool:
    return resolve_entity_metric(entity_id) is not None


def is_recorded(entity_id: str) -> bool:
    """True when at least one sample has ever been written for this entity's series.

    `tracked` only says the recorder knows the name; the probe fault binaries were
    tracked:True for weeks with zero rows, which read as "healthy and recorded".
    """
    src = resolve_entity_metric(entity_id)
    if src is None:
        return False
    from .settings import history_has_rows

    return history_has_rows(src[0], src[1])


def query_entity_history(
    entity_id: str,
    hours: float = 6.0,
    max_points: int = 720,
    *,
    now: float | None = None,
) -> list[dict[str, Any]]:
    """Points for one entity over the last `hours`, the whole window represented in at
    most `max_points` buckets (see `list_history_bucketed`)."""
    key = resolve_entity_metric(entity_id)
    if not key:
        return []
    seat_id, metric = key
    until = time.time() if now is None else now
    since = until - hours * 3600.0
    rows = list_history_bucketed(seat_id, metric, since, max_points=max_points, until_ts=until)
    return [{"t": int(r["ts"] * 1000), "v": float(r["value"])} for r in rows if r.get("value") is not None]
