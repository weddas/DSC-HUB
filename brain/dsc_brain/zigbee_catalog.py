"""Zigbee device-type archetypes.

Reference data the SPA uses to guide "add device -> pick a role -> use it in a
rule". Each type names the capability_class it fingerprints as, the datapoints it
exposes (trigger sources), whether the automation engine can drive it
(``can_actuate`` -> a ``zigbee_switch`` rule action), and the built-in roles it
usually fits.

New types are added here one at a time, not dumped in bulk (AGENTS.md).
"""

from __future__ import annotations

from typing import Any

ZIGBEE_DEVICE_TYPES: list[dict[str, Any]] = [
    {
        "id": "thermo_hygrometer",
        "label": "Thermometer / hygrometer",
        "capability_class": "climate",
        "datapoints": [
            {"key": "temperature", "unit": "°C", "kind": "number"},
            {"key": "humidity", "unit": "%", "kind": "number"},
        ],
        "suggested_roles": ["canopy_4x8", "canopy_2x4", "intake", "exhaust", "room", "clone_dome"],
        "can_trigger": True,
        "can_actuate": False,
    },
    {
        "id": "air_quality",
        "label": "Air sensor (CO₂ / VOC / PM)",
        "capability_class": "other",
        "datapoints": [
            {"key": "co2", "unit": "ppm", "kind": "number"},
            {"key": "voc", "unit": "ppb", "kind": "number"},
            {"key": "pm25", "unit": "µg/m³", "kind": "number"},
        ],
        "suggested_roles": ["co2_tent"],
        "can_trigger": True,
        "can_actuate": False,
    },
    {
        "id": "illuminance",
        "label": "Light / lux sensor",
        "capability_class": "other",
        "datapoints": [{"key": "illuminance_lux", "unit": "lx", "kind": "number"}],
        "suggested_roles": ["lux_canopy"],
        "can_trigger": True,
        "can_actuate": False,
    },
    {
        "id": "motion",
        "label": "Motion / occupancy",
        "capability_class": "motion",
        "datapoints": [{"key": "occupancy", "unit": "", "kind": "bool"}],
        "suggested_roles": [],
        "can_trigger": True,
        "can_actuate": False,
    },
    {
        "id": "contact",
        "label": "Door / window contact",
        "capability_class": "safety",
        "datapoints": [{"key": "contact", "unit": "", "kind": "bool"}],
        "suggested_roles": ["door_tent"],
        "can_trigger": True,
        "can_actuate": False,
    },
    {
        "id": "leak",
        "label": "Water leak",
        "capability_class": "liquid",
        "datapoints": [{"key": "water_leak", "unit": "", "kind": "bool"}],
        "suggested_roles": [
            "leak_floor",
            "leak_floor_room",
            "leak_floor_4x8",
            "leak_floor_2x4",
            "leak_tank",
        ],
        "can_trigger": True,
        "can_actuate": False,
    },
    {
        "id": "smart_plug",
        "label": "Smart plug",
        "capability_class": "plug",
        "datapoints": [
            {"key": "state", "unit": "", "kind": "bool"},
            {"key": "power", "unit": "W", "kind": "number"},
            {"key": "energy", "unit": "kWh", "kind": "number"},
        ],
        "suggested_roles": ["plug_pump", "plug_dosing", "plug_backup_dehum", "plug_fan_aux"],
        "can_trigger": True,
        "can_actuate": True,
    },
    {
        "id": "smart_switch",
        "label": "Relay / switch",
        "capability_class": "plug",
        "datapoints": [{"key": "state", "unit": "", "kind": "bool"}],
        "suggested_roles": ["plug_fan_aux", "plug_pump"],
        "can_trigger": True,
        "can_actuate": True,
    },
    {
        "id": "fan",
        "label": "Fan controller",
        "capability_class": "plug",
        "datapoints": [
            {"key": "state", "unit": "", "kind": "bool"},
            {"key": "fan_mode", "unit": "", "kind": "enum"},
        ],
        "suggested_roles": ["plug_fan_aux"],
        "can_trigger": True,
        "can_actuate": True,
    },
    {
        "id": "button",
        "label": "Button / remote",
        "capability_class": "motion",
        "datapoints": [{"key": "action", "unit": "", "kind": "enum"}],
        "suggested_roles": ["button_override"],
        "can_trigger": True,
        "can_actuate": False,
    },
    {
        "id": "power_meter",
        "label": "Energy meter",
        "capability_class": "meter",
        "datapoints": [
            {"key": "power", "unit": "W", "kind": "number"},
            {"key": "energy", "unit": "kWh", "kind": "number"},
        ],
        "suggested_roles": ["meter_wall"],
        "can_trigger": True,
        "can_actuate": False,
    },
]

_ACTUATABLE_IDS = frozenset(t["id"] for t in ZIGBEE_DEVICE_TYPES if t["can_actuate"])
ACTUATABLE_ROLE_KINDS = frozenset({"plug"})


def get_zigbee_device_types() -> list[dict[str, Any]]:
    return [dict(t) for t in ZIGBEE_DEVICE_TYPES]


_DATAPOINT_UNITS: dict[str, str] = {}
for _t in ZIGBEE_DEVICE_TYPES:
    for _dp in _t.get("datapoints", []):
        _key = str(_dp.get("key") or "").lower()
        _unit = str(_dp.get("unit") or "")
        if _key and _unit and _key not in _DATAPOINT_UNITS:
            _DATAPOINT_UNITS[_key] = _unit


def datapoint_unit(key: str) -> str | None:
    """Unit for a datapoint key as the device-type catalog documents it (None if unitless/unknown)."""
    return _DATAPOINT_UNITS.get(str(key).lower())
