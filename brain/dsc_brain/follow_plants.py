"""Pi-owned Follow Plants: strictest Want intersection → clone_* numbers only."""

from __future__ import annotations

import logging
from typing import Any

from .climate_mode import is_follow_plants_mode, migrate_legacy_clone_mode
from .compose_store import get_helper, set_helper
from .settings import list_roster
from .stage_model import expected_stage, stage_family, tent_id

_logger = logging.getLogger(__name__)

# Mirror SPA tentWant.ts STAGE_RAIL / hub apply_stage (Temp ±1.5 for target).
_STAGE_RAIL: dict[str, dict[str, float]] = {
    "Germination": {"temp": 25, "vpd_min": 0.4, "vpd_max": 0.8, "rh_min": 70, "rh_max": 80, "light_hours": 18},
    "Seedling": {"temp": 24, "vpd_min": 0.5, "vpd_max": 0.8, "rh_min": 65, "rh_max": 75, "light_hours": 18},
    "Early Vegetative": {"temp": 25, "vpd_min": 0.7, "vpd_max": 1.0, "rh_min": 60, "rh_max": 70, "light_hours": 18},
    "Vegetative": {"temp": 26, "vpd_min": 0.8, "vpd_max": 1.1, "rh_min": 55, "rh_max": 65, "light_hours": 18},
    "Late (Push) Vegetative": {"temp": 26, "vpd_min": 1.0, "vpd_max": 1.2, "rh_min": 50, "rh_max": 60, "light_hours": 18},
    "Early Flowering": {"temp": 25, "vpd_min": 1.0, "vpd_max": 1.2, "rh_min": 50, "rh_max": 55, "light_hours": 12},
    "Flowering": {"temp": 24, "vpd_min": 1.2, "vpd_max": 1.4, "rh_min": 45, "rh_max": 50, "light_hours": 12},
    "Late Flowering": {"temp": 22, "vpd_min": 1.3, "vpd_max": 1.5, "rh_min": 40, "rh_max": 45, "light_hours": 12},
    "Final 48-72h Flowering": {"temp": 21, "vpd_min": 1.4, "vpd_max": 1.6, "rh_min": 35, "rh_max": 45, "light_hours": 12},
    "Dry Mode": {"temp": 19, "vpd_min": 0.8, "vpd_max": 1.0, "rh_min": 55, "rh_max": 62, "light_hours": 0},
}


def intersect_bands(bands: list[tuple[float, float]]) -> tuple[float, float] | None:
    """Strictest intersection. None if empty or inverted (min > max)."""
    if not bands:
        return None
    lo = max(b[0] for b in bands)
    hi = min(b[1] for b in bands)
    if lo > hi:
        return None
    return (lo, hi)


def _rail_for_stage(stage: str) -> dict[str, float] | None:
    s = (stage or "").strip()
    if not s or s in ("Off", "Custom", "—", "unknown"):
        return None
    if s in _STAGE_RAIL:
        return _STAGE_RAIL[s]
    for key, rail in _STAGE_RAIL.items():
        if key in s or s in key:
            return rail
    return None


def _plant_stage(recipe: dict[str, Any], row: dict[str, Any]) -> str:
    stage = str(recipe.get("growth_stage") or recipe.get("stage") or "").strip()
    if stage and stage not in ("unknown", "—"):
        return stage
    sprout = str(recipe.get("sprout_date") or row.get("sprout_date") or "").strip()
    if not sprout:
        return ""
    try:
        from datetime import date

        d0 = date.fromisoformat(sprout[:10])
        days = (date.today() - d0).days
        auto = bool(recipe.get("autoflower") or row.get("autoflower"))
        return expected_stage(days, auto=auto)
    except Exception:  # noqa: BLE001
        return ""


def _bands_for_plant(recipe: dict[str, Any], row: dict[str, Any]) -> dict[str, tuple[float, float]] | None:
    stage = _plant_stage(recipe, row)
    rail = _rail_for_stage(stage)
    if not rail:
        return None
    return {
        "temp": (rail["temp"] - 1.5, rail["temp"] + 1.5),
        "rh": (rail["rh_min"], rail["rh_max"]),
        "vpd": (rail["vpd_min"], rail["vpd_max"]),
        "light_hours": (rail["light_hours"], rail["light_hours"]),
    }


def clone_tent_plant_rows() -> list[dict[str, Any]]:
    """Roster rows with a seated plant in the 2×4 (name or strain)."""
    out: list[dict[str, Any]] = []
    for row in list_roster():
        recipe = dict(row.get("recipe") or {})
        if tent_id(str(recipe.get("tent") or row.get("tent") or "")) != "clone":
            continue
        name = str(recipe.get("plant_name") or recipe.get("nickname") or "").strip()
        strain = str(row.get("strain_id") or recipe.get("strain_display") or "").strip()
        if not name and not strain:
            continue
        out.append({"row": row, "recipe": recipe})
    return out


def resolve_follow_plants_targets(
    plants: list[dict[str, Any]] | None = None,
) -> dict[str, Any] | None:
    """
    Strictest Want intersection for 2×4 plants.
    Returns number payload or None to refuse (empty / inverted) — hold last Custom.
    """
    items = plants if plants is not None else clone_tent_plant_rows()
    if not items:
        return None
    temp_bands: list[tuple[float, float]] = []
    rh_bands: list[tuple[float, float]] = []
    vpd_bands: list[tuple[float, float]] = []
    light_hours: list[float] = []
    stages: list[str] = []
    for item in items:
        recipe = item.get("recipe") or {}
        row = item.get("row") or {}
        bands = _bands_for_plant(recipe, row)
        if not bands:
            continue
        stage = _plant_stage(recipe, row)
        if stage and stage not in stages:
            stages.append(stage)
        temp_bands.append(bands["temp"])
        rh_bands.append(bands["rh"])
        vpd_bands.append(bands["vpd"])
        light_hours.append(bands["light_hours"][0])
    temp = intersect_bands(temp_bands)
    rh = intersect_bands(rh_bands)
    vpd = intersect_bands(vpd_bands)
    if temp is None or rh is None or vpd is None:
        return None
    return {
        "clone_temp": round((temp[0] + temp[1]) / 2.0, 1),
        "clone_rh_min": rh[0],
        "clone_rh_max": rh[1],
        "clone_vpd_min": vpd[0],
        "clone_vpd_max": vpd[1],
        "clone_light_hours": min(light_hours) if light_hours else 18.0,
        "stages": stages,
        "plant_count": len(items),
    }


async def apply_follow_plants(*, force: bool = False) -> dict[str, Any]:
    """Write clone_* numbers when Climate Mode is Follow Plants (or force). Never grow_stage."""
    from .control_ops import (
        _control_state,
        _hub_is_online,
        _hub_number,
        _hub_select_retry,
    )

    takeover = _control_state("switch.dsc_hub_manual_takeover")
    if takeover == "on":
        return {"applied": False, "reason": "takeover on"}
    if not _hub_is_online():
        return {"applied": False, "reason": "hub offline"}

    mode_raw = _control_state("select.dsc_hub_clone_mode") or get_helper(
        "select.dsc_hub_clone_mode", ""
    )
    mode = migrate_legacy_clone_mode(mode_raw)
    if not force and not is_follow_plants_mode(mode):
        return {"applied": False, "reason": f"mode is {mode or 'unset'}"}

    targets = resolve_follow_plants_targets()
    if targets is None:
        return {
            "applied": False,
            "reason": "empty or inverted intersection",
            "honesty": "hold_last_custom",
        }

    writes: dict[str, Any] = {"mode": mode, "stages": targets["stages"]}
    number_map = {
        "number.dsc_hub_clone_target_temp": targets["clone_temp"],
        "number.dsc_hub_clone_rh_min": targets["clone_rh_min"],
        "number.dsc_hub_clone_rh_max": targets["clone_rh_max"],
        "number.dsc_hub_clone_vpd_min": targets["clone_vpd_min"],
        "number.dsc_hub_clone_vpd_max": targets["clone_vpd_max"],
        "number.dsc_hub_clone_light_hours": targets["clone_light_hours"],
    }
    for eid, value in number_map.items():
        try:
            await _hub_number(eid, float(value))
            writes[eid] = value
        except Exception as exc:  # noqa: BLE001
            _logger.warning("Follow Plants write %s failed: %s", eid, exc)
            set_helper(eid, value)
            writes[eid] = value
            writes[f"{eid}_local"] = True

    # Atomic photoperiod with Follow Plants: Independent unless all flower → Follow 4x8.
    families = {stage_family(s) for s in targets["stages"] if stage_family(s)}
    photo = "Follow 4x8" if families == {"flower"} else "Independent"
    try:
        await _hub_select_retry("select.dsc_hub_clone_photoperiod", photo)
        writes["clone_photoperiod"] = photo
    except Exception as exc:  # noqa: BLE001
        _logger.warning("Follow Plants photoperiod failed: %s", exc)
        set_helper("select.dsc_hub_clone_photoperiod", photo)
        writes["clone_photoperiod"] = photo

    return {"applied": True, **writes, "targets": targets}
