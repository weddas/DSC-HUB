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
