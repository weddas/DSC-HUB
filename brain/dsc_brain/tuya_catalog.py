"""Tuya (SmartLife) Wi-Fi device-type archetypes — the mirror of ``zigbee_catalog``.

A Tuya device reports numbered DPS ("data points"); nothing on the wire says what
DPS 19 means. Each archetype here carries the *default* DPS map and scales for
that kind of hardware plus the same fields the Zigbee catalog uses
(``capability_class``, datapoints, ``can_actuate``, suggested roles) so the SPA
drives one add → role/zone/task → integrate path for both lanes.

The defaults are the common Tuya profiles; a unit that differs is fixed per
device with the operator-editable ``dps_map`` / ``scales`` override after a
**Probe** (which returns the raw DPS). New types are added one at a time, not
dumped in bulk (AGENTS.md).
"""

from __future__ import annotations

from typing import Any

TUYA_DEVICE_TYPES: list[dict[str, Any]] = [
    {
        "id": "smart_plug",
        "label": "Smart plug",
        "capability_class": "plug",
        "datapoints": [
            {"key": "state", "unit": "", "kind": "bool"},
            {"key": "power", "unit": "W", "kind": "number"},
            {"key": "current", "unit": "A", "kind": "number"},
            {"key": "voltage", "unit": "V", "kind": "number"},
            {"key": "energy", "unit": "kWh", "kind": "number"},
        ],
        # Tuya's standard single-gang metering plug profile.
        "dps_map": {"state": 1, "countdown": 2, "energy": 17, "current": 18, "power": 19, "voltage": 20},
        "scales": {"power": 0.1, "voltage": 0.1, "current": 0.001, "energy": 0.01},
        "suggested_roles": ["plug_light_4x8", "plug_light_2x4", "plug_pump", "plug_dosing", "plug_backup_dehum", "plug_fan_aux"],
        "can_trigger": True,
        "can_actuate": True,
        "note": "Single-gang plug; metering DPS are optional and only appear when the unit reports them.",
    },
    {
        "id": "smart_switch",
        "label": "Relay / switch",
        "capability_class": "plug",
        "datapoints": [{"key": "state", "unit": "", "kind": "bool"}],
        "dps_map": {"state": 1, "countdown": 2},
        "scales": {},
        "suggested_roles": ["plug_light_4x8", "plug_light_2x4", "plug_fan_aux", "plug_pump"],
        "can_trigger": True,
        "can_actuate": True,
        "note": "In-wall relay or breaker module, no metering.",
    },
    {
        "id": "water_tester",
        "label": "Water quality tester",
        "capability_class": "water",
        "datapoints": [
            {"key": "water_temperature", "unit": "°C", "kind": "number"},
            {"key": "ph", "unit": "pH", "kind": "number"},
            {"key": "tds", "unit": "ppm", "kind": "number"},
            {"key": "ec", "unit": "µS/cm", "kind": "number"},
            {"key": "salinity", "unit": "ppm", "kind": "number"},
            {"key": "specific_gravity", "unit": "SG", "kind": "number"},
            {"key": "orp", "unit": "mV", "kind": "number"},
            {"key": "cf", "unit": "CF", "kind": "number"},
        ],
        # Tuya multi-parameter tester profile (PH-W218 / Yieryi 6-in-1 … 8-in-1):
        # *_current DPS only — the *_warn_max / *_warn_min alarm thresholds the app
        # edits are left alone.
        "dps_map": {
            "water_temperature": 8,
            "ph": 106,
            "tds": 111,
            "ec": 116,
            "salinity": 121,
            "specific_gravity": 126,
            "orp": 131,
            "cf": 136,
        },
        "scales": {"water_temperature": 0.1, "ph": 0.01, "specific_gravity": 0.001, "cf": 0.1},
        "suggested_roles": ["reservoir_4x8", "reservoir_2x4", "reservoir_room"],
        "can_trigger": True,
        "can_actuate": False,
        "note": "Probe first: testers differ in which parameters they carry and in scale (pH ×0.01 vs ×0.1). Missing DPS simply do not report.",
    },
]

_TYPES_BY_ID: dict[str, dict[str, Any]] = {str(t["id"]): t for t in TUYA_DEVICE_TYPES}


def get_tuya_device_types() -> list[dict[str, Any]]:
    return [
        {**t, "dps_map": dict(t.get("dps_map") or {}), "scales": dict(t.get("scales") or {})}
        for t in TUYA_DEVICE_TYPES
    ]


def tuya_device_type(type_id: str) -> dict[str, Any] | None:
    t = _TYPES_BY_ID.get(str(type_id or ""))
    return dict(t) if t else None


def default_dps_map(type_id: str) -> dict[str, int]:
    t = _TYPES_BY_ID.get(str(type_id or ""))
    return {str(k): int(v) for k, v in (t.get("dps_map") or {}).items()} if t else {}


def default_scales(type_id: str) -> dict[str, float]:
    t = _TYPES_BY_ID.get(str(type_id or ""))
    return {str(k): float(v) for k, v in (t.get("scales") or {}).items()} if t else {}


_DATAPOINT_UNITS: dict[str, str] = {}
for _t in TUYA_DEVICE_TYPES:
    for _dp in _t.get("datapoints", []):
        _key = str(_dp.get("key") or "").lower()
        _unit = str(_dp.get("unit") or "")
        if _key and _unit and _key not in _DATAPOINT_UNITS:
            _DATAPOINT_UNITS[_key] = _unit


def datapoint_unit(key: str) -> str | None:
    """Unit for a datapoint key as this catalog documents it (None if unitless/unknown)."""
    return _DATAPOINT_UNITS.get(str(key).lower())


def guess_type_from_dps(dps: dict[str, Any]) -> str | None:
    """Best-effort archetype from a raw probe: which default map covers the most keys."""
    keys = {str(k) for k in (dps or {})}
    if not keys:
        return None
    best: tuple[int, str] | None = None
    for t in TUYA_DEVICE_TYPES:
        mapped = {str(v) for v in (t.get("dps_map") or {}).values()}
        hit = len(keys & mapped)
        if hit and (best is None or hit > best[0]):
            best = (hit, str(t["id"]))
    return best[1] if best else None
