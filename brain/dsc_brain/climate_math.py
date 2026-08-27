"""Climate calculations — Pi-native mirrors of ESPHome template sensors."""

from __future__ import annotations

import math


def compute_vpd_kpa(temp_c: float | None, rh_pct: float | None) -> float | None:
    """Magnus-style VPD (kPa) from air temp (°C) and RH (%)."""
    if temp_c is None or rh_pct is None:
        return None
    try:
        t = float(temp_c)
        rh = float(rh_pct)
    except (TypeError, ValueError):
        return None
    if not (-10.0 < t < 60.0) or not (0.0 < rh <= 100.0):
        return None
    svp = 0.6108 * math.exp((17.27 * t) / (t + 237.3))
    avp = svp * (rh / 100.0)
    return round(max(0.0, svp - avp), 3)


def plausible_vpd_kpa(value: float | None) -> bool:
    if value is None:
        return False
    try:
        v = float(value)
    except (TypeError, ValueError):
        return False
    return 0.0 <= v <= 3.5


def finalize_hub_climate(values: dict) -> None:
    """Normalize VPD from live T/RH — hub template can be stomped by number-entity ingest."""
    tent_vpd = compute_vpd_kpa(values.get("temp_c"), values.get("rh_pct"))
    if tent_vpd is not None:
        values["vpd_kpa"] = tent_vpd
    clone_vpd = compute_vpd_kpa(values.get("clone_temp_c"), values.get("clone_rh_pct"))
    if clone_vpd is not None:
        values["clone_vpd_kpa"] = clone_vpd
    room_vpd = compute_vpd_kpa(values.get("room_temp_c"), values.get("room_rh_pct"))
    if room_vpd is not None:
        values["room_vpd_kpa"] = room_vpd
    leaf_offset = values.get("leaf_offset_c")
    if leaf_offset is None:
        try:
            from .settings import get_setting

            leaf_offset = float(get_setting("leaf_offset_c", "2") or 2)
        except (TypeError, ValueError):
            leaf_offset = 2.0
    if values.get("temp_c") is not None and values.get("rh_pct") is not None:
        leaf_t = float(values["temp_c"]) - float(leaf_offset)
        leaf_vpd = compute_vpd_kpa(leaf_t, values.get("rh_pct"))
        if leaf_vpd is not None:
            values["leaf_vpd_kpa"] = leaf_vpd
    if values.get("clone_temp_c") is not None and values.get("clone_rh_pct") is not None:
        clone_leaf_t = float(values["clone_temp_c"]) - float(leaf_offset)
        clone_leaf_vpd = compute_vpd_kpa(clone_leaf_t, values.get("clone_rh_pct"))
        if clone_leaf_vpd is not None:
            values["clone_leaf_vpd_kpa"] = clone_leaf_vpd
