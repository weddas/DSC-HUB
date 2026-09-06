"""Global tuning multipliers and sensor offsets (7.2)."""

from __future__ import annotations

import json
from typing import Any

from .settings import get_setting, set_setting

DEFAULT_MODIFIERS: dict[str, Any] = {
    "fan_demand_scale": 1.0,
    "light_brightness_scale": 1.0,
    # Pot-moisture "dry" reference line on the Root band charts — was a hardcoded 30.
    "moisture_dry_pct": 30.0,
    "temp_offset_c": {"room": 0.0, "clone": 0.0, "main": 0.0},
    "rh_offset_pct": {"room": 0.0, "clone": 0.0, "main": 0.0},
    "sensor_clamp": {
        "temp_c": {"min": -5.0, "max": 50.0},
        "rh_pct": {"min": 0.0, "max": 100.0},
    },
}


def _clamp(value: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, value))


def get_global_modifiers() -> dict[str, Any]:
    raw = get_setting("global_modifiers", "")
    if not raw:
        return dict(DEFAULT_MODIFIERS)
    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        return dict(DEFAULT_MODIFIERS)
    if not isinstance(parsed, dict):
        return dict(DEFAULT_MODIFIERS)
    out = json.loads(json.dumps(DEFAULT_MODIFIERS))
    for key in ("fan_demand_scale", "light_brightness_scale", "moisture_dry_pct"):
        if key in parsed:
            try:
                out[key] = float(parsed[key])
            except (TypeError, ValueError):
                pass
    for zone_key in ("temp_offset_c", "rh_offset_pct"):
        if isinstance(parsed.get(zone_key), dict):
            for zone in ("room", "clone", "main"):
                if zone in parsed[zone_key]:
                    try:
                        out[zone_key][zone] = float(parsed[zone_key][zone])
                    except (TypeError, ValueError):
                        pass
    return out


def set_global_modifiers(patch: dict[str, Any]) -> dict[str, Any]:
    current = get_global_modifiers()
    for key in ("fan_demand_scale", "light_brightness_scale"):
        if key in patch:
            v = float(patch[key])
            current[key] = _clamp(v, 0.5, 1.5)
    if "moisture_dry_pct" in patch:
        try:
            current["moisture_dry_pct"] = _clamp(float(patch["moisture_dry_pct"]), 5.0, 80.0)
        except (TypeError, ValueError):
            pass
    for zone_key in ("temp_offset_c", "rh_offset_pct"):
        if isinstance(patch.get(zone_key), dict):
            for zone, val in patch[zone_key].items():
                if zone in current[zone_key]:
                    try:
                        current[zone_key][zone] = float(val)
                    except (TypeError, ValueError):
                        pass
    set_setting("global_modifiers", json.dumps(current))
    return current


def apply_temp_rh_offsets(
    temp_c: float | None,
    rh_pct: float | None,
    zone: str,
) -> tuple[float | None, float | None, bool]:
    """Return (temp, rh, clamped) after global offsets."""
    mods = get_global_modifiers()
    clamp_cfg = mods.get("sensor_clamp") or {}
    t_lo = float((clamp_cfg.get("temp_c") or {}).get("min", -5))
    t_hi = float((clamp_cfg.get("temp_c") or {}).get("max", 50))
    rh_lo = float((clamp_cfg.get("rh_pct") or {}).get("min", 0))
    rh_hi = float((clamp_cfg.get("rh_pct") or {}).get("max", 100))
    t_off = float((mods.get("temp_offset_c") or {}).get(zone, 0))
    rh_off = float((mods.get("rh_offset_pct") or {}).get(zone, 0))
    clamped = False
    out_t = temp_c
    out_rh = rh_pct
    if temp_c is not None:
        try:
            out_t = float(temp_c) + t_off
            if out_t < t_lo or out_t > t_hi:
                clamped = True
            out_t = _clamp(out_t, t_lo, t_hi)
        except (TypeError, ValueError):
            out_t = temp_c
    if rh_pct is not None:
        try:
            out_rh = float(rh_pct) + rh_off
            if out_rh < rh_lo or out_rh > rh_hi:
                clamped = True
            out_rh = _clamp(out_rh, rh_lo, rh_hi)
        except (TypeError, ValueError):
            out_rh = rh_pct
    return out_t, out_rh, clamped


def scale_fan_demand_pct(pct: float | None) -> float | None:
    if pct is None:
        return None
    mods = get_global_modifiers()
    scale = float(mods.get("fan_demand_scale", 1.0))
    return _clamp(float(pct) * scale, 0.0, 100.0)


def scale_light_brightness_pct(pct: float | None) -> float | None:
    if pct is None:
        return None
    mods = get_global_modifiers()
    scale = float(mods.get("light_brightness_scale", 1.0))
    return _clamp(float(pct) * scale, 0.0, 100.0)
