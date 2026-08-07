"""Want band resolution — catalog → custom → stage default."""

from __future__ import annotations

from typing import Any

from .catalog import get_strain

# Conservative stage fallbacks when no catalog/custom Want exists.
STAGE_DEFAULTS: dict[str, dict[str, list[float]]] = {
    "seedling": {
        "ph": [5.8, 6.5],
        "ec_us": [400, 800],
        "moisture_pct": [50, 70],
        "temp_c": [22, 26],
        "rh_pct": [60, 75],
    },
    "veg": {
        "ph": [5.8, 6.5],
        "ec_us": [1000, 1600],
        "moisture_pct": [45, 70],
        "temp_c": [20, 28],
        "rh_pct": [45, 70],
    },
    "flower": {
        "ph": [5.8, 6.5],
        "ec_us": [1600, 2400],
        "moisture_pct": [45, 65],
        "temp_c": [18, 26],
        "rh_pct": [40, 55],
    },
}


def _band(want: dict[str, Any], key: str) -> list[float] | None:
    val = want.get(key)
    if isinstance(val, (list, tuple)) and len(val) >= 2:
        try:
            return [float(val[0]), float(val[1])]
        except (TypeError, ValueError):
            return None
    return None


def resolve_want(
    *,
    strain_id: str | None = None,
    stage: str = "veg",
    custom: dict[str, Any] | None = None,
    db_path=None,
) -> dict[str, Any]:
    """Return normalized Want bands and provenance.

    Precedence:
    1. Custom bands when provided (non-empty)
    2. Catalog want for strain_id
    3. Stage defaults
    """
    stage_key = (stage or "veg").lower().strip()
    if stage_key not in STAGE_DEFAULTS:
        stage_key = "veg"

    source = "stage_default"
    want: dict[str, Any] = dict(STAGE_DEFAULTS[stage_key])

    if strain_id:
        strain = get_strain(strain_id, db_path=db_path)
        if strain and strain.get("want"):
            catalog_want = dict(strain["want"])
            # Map stage-specific EC if present.
            if stage_key == "veg" and "ec_veg_us" in catalog_want:
                catalog_want["ec_us"] = catalog_want["ec_veg_us"]
            elif stage_key == "flower" and "ec_flower_us" in catalog_want:
                catalog_want["ec_us"] = catalog_want["ec_flower_us"]
            elif stage_key == "seedling" and "ec_seedling_us" in catalog_want:
                catalog_want["ec_us"] = catalog_want["ec_seedling_us"]
            want.update({k: v for k, v in catalog_want.items() if _band(catalog_want, k) or k.startswith("ec")})
            source = f"catalog:{strain_id}"

    if custom:
        applied = False
        for key, val in custom.items():
            if isinstance(val, (list, tuple)) and len(val) >= 2:
                try:
                    lo, hi = float(val[0]), float(val[1])
                except (TypeError, ValueError):
                    continue
                if lo == 0 and hi == 0:
                    continue
                want[key] = [lo, hi]
                applied = True
            elif isinstance(val, (int, float)) and float(val) != 0:
                # Single-sided custom climate (e.g. temp target) → tight band
                want[key] = [float(val), float(val)]
                applied = True
        if applied:
            source = "custom"

    normalized = {k: _band(want, k) for k in ("ph", "ec_us", "moisture_pct", "temp_c", "rh_pct")}
    normalized = {k: v for k, v in normalized.items() if v is not None}
    return {
        "source": source,
        "stage": stage_key,
        "strain_id": strain_id,
        "want": normalized,
    }
