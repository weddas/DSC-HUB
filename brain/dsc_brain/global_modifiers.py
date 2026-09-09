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
    # Plausibility bounds. These sit INSIDE the sensors' rail values on purpose: a DHT/SHT
    # that has railed reports exactly 50.0 °C / 100.0 %, and a clamp AT 50/100 accepts it.
    # 45 °C in a grow tent is a fault either way. RH keeps 100 (saturation is physically
    # real); the rail pair (temp at rail) is what rejects that reading.
    "sensor_clamp": {
        "temp_c": {"min": -5.0, "max": 45.0},
        "rh_pct": {"min": 0.0, "max": 100.0},
    },
}

# Hard limits on what the clamp itself may be set to.
_CLAMP_LIMITS: dict[str, tuple[float, float]] = {"temp_c": (-40.0, 85.0), "rh_pct": (0.0, 100.0)}
# A reading at or beyond the sensor's own rail is never a measurement.
_RAIL_TEMP_C = 49.9


def _fresh_defaults() -> dict[str, Any]:
    """A deep copy. dict(DEFAULT_MODIFIERS) was shallow, so set_global_modifiers mutating
    current['temp_offset_c'][zone] wrote straight into the module-level defaults and every
    later caller with an empty setting inherited someone else's offsets."""
    return json.loads(json.dumps(DEFAULT_MODIFIERS))


def _clamp(value: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, value))


def get_global_modifiers() -> dict[str, Any]:
    raw = get_setting("global_modifiers", "")
    if not raw:
        return _fresh_defaults()
    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        return _fresh_defaults()
    if not isinstance(parsed, dict):
        return _fresh_defaults()
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
    # Stored clamps were never read back — the defaults always won, so edits could not land.
    stored_clamp = parsed.get("sensor_clamp")
    if isinstance(stored_clamp, dict):
        for ch in ("temp_c", "rh_pct"):
            row = stored_clamp.get(ch)
            if isinstance(row, dict):
                for bound in ("min", "max"):
                    if bound in row:
                        try:
                            out["sensor_clamp"][ch][bound] = float(row[bound])
                        except (TypeError, ValueError):
                            pass
    return out


def _validate_clamp(channel: str, lo: float, hi: float) -> None:
    hard_lo, hard_hi = _CLAMP_LIMITS[channel]
    if not (hard_lo <= lo < hi <= hard_hi):
        raise ValueError(f"sensor_clamp.{channel}: need {hard_lo} <= min < max <= {hard_hi}, got {lo}..{hi}")


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
    if isinstance(patch.get("sensor_clamp"), dict):
        for ch, row in patch["sensor_clamp"].items():
            if ch not in current["sensor_clamp"] or not isinstance(row, dict):
                raise ValueError(f"sensor_clamp: unknown channel {ch!r}")
            merged = dict(current["sensor_clamp"][ch])
            for bound in ("min", "max"):
                if bound in row:
                    merged[bound] = float(row[bound])
            _validate_clamp(ch, float(merged["min"]), float(merged["max"]))
            current["sensor_clamp"][ch] = merged
    set_setting("global_modifiers", json.dumps(current))
    return current


def apply_temp_rh_offsets(
    temp_c: float | None,
    rh_pct: float | None,
    zone: str,
) -> tuple[float | None, float | None, bool]:
    """Return (temp, rh, rejected) after global offsets.

    A reading outside its plausibility bounds — or a temperature sitting on the sensor's
    rail — comes back as None, not as the bound. Clamping 50.0 °C to 45.0 handed downstream
    a confident-looking number for a sensor that had railed; on 2026-09-08 that fed 47 min
    of 50 °C / 100 % into history, VPD and learning while climate_sensor_fault was already ON.
    The third value is True when either channel was rejected.
    """
    mods = get_global_modifiers()
    clamp_cfg = mods.get("sensor_clamp") or {}
    t_lo = float((clamp_cfg.get("temp_c") or {}).get("min", -5))
    t_hi = float((clamp_cfg.get("temp_c") or {}).get("max", 45))
    rh_lo = float((clamp_cfg.get("rh_pct") or {}).get("min", 0))
    rh_hi = float((clamp_cfg.get("rh_pct") or {}).get("max", 100))
    t_off = float((mods.get("temp_offset_c") or {}).get(zone, 0))
    rh_off = float((mods.get("rh_offset_pct") or {}).get(zone, 0))
    rejected = False
    out_t: float | None = temp_c
    out_rh: float | None = rh_pct
    raw_t: float | None = None
    if temp_c is not None:
        try:
            raw_t = float(temp_c)
            out_t = raw_t + t_off
            if raw_t >= _RAIL_TEMP_C or out_t < t_lo or out_t > t_hi:
                rejected = True
                out_t = None
        except (TypeError, ValueError):
            out_t = None
            rejected = True
    if rh_pct is not None:
        try:
            raw_rh = float(rh_pct)
            out_rh = raw_rh + rh_off
            railed_pair = raw_t is not None and raw_t >= _RAIL_TEMP_C and raw_rh >= 99.9
            if railed_pair or out_rh < rh_lo or out_rh > rh_hi:
                rejected = True
                out_rh = None
        except (TypeError, ValueError):
            out_rh = None
            rejected = True
    return out_t, out_rh, rejected


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
