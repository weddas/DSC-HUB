"""Bar 3 crop-steering SoT — P0–P3 phase from probe + photoperiod.

SPA and IrrigAct must read this module (or fleet.system.root_steering), never invent phase.
"""

from __future__ import annotations

import json
from typing import Any, Literal

from .settings import get_setting, set_setting

PhaseId = Literal["P0", "P1", "P2", "P3"]

DEFAULT_TARGETS: dict[str, float] = {
    "dryback_p1_max_pct": 10.0,
    "dryback_p2_max_pct": 25.0,
    "dryback_p3_min_pct": 25.0,
    "vwc_target_day_pct": 55.0,
    "vwc_target_night_pct": 50.0,
    "ec_target_ms": 2.2,
}


def _load_targets() -> dict[str, float]:
    raw = get_setting("root_steering_targets", "")
    out = dict(DEFAULT_TARGETS)
    if raw:
        try:
            parsed = json.loads(raw)
            if isinstance(parsed, dict):
                for k, v in parsed.items():
                    if k in out:
                        try:
                            out[k] = float(v)
                        except (TypeError, ValueError):
                            pass
        except json.JSONDecodeError:
            pass
    return out


def is_root_steering_override() -> bool:
    return get_setting("root_steering_override", "false").lower() == "true"


def set_root_steering_override(enabled: bool) -> None:
    set_setting("root_steering_override", "true" if enabled else "false")


def compute_phase(
    *,
    reading_ok: bool,
    lights_on: bool,
    dryback_pct: float | None,
    override: bool | None = None,
    targets: dict[str, float] | None = None,
) -> dict[str, Any]:
    """Return steering snapshot for one pot.

    Vocabulary (Growlink / HA-Irrigation-Strategy style):
    - P0 overnight / lights-off maintenance
    - P1 early lights-on, shallow dryback
    - P2 mid-day vegetative dryback band
    - P3 generative / larger dryback
    """
    t = targets or _load_targets()
    ov = is_root_steering_override() if override is None else override

    if not reading_ok:
        return {
            "phase": None,
            "reason": "probe_not_ok",
            "dryback_pct": dryback_pct,
            "lights_on": lights_on,
            "override": ov,
            "targets": t,
            "act_allowed": False,
        }

    if ov:
        return {
            "phase": None,
            "reason": "manual_override",
            "dryback_pct": dryback_pct,
            "lights_on": lights_on,
            "override": True,
            "targets": t,
            "act_allowed": False,
        }

    if not lights_on:
        return {
            "phase": "P0",
            "reason": "lights_off",
            "dryback_pct": dryback_pct,
            "lights_on": False,
            "override": False,
            "targets": t,
            "act_allowed": False,
        }

    db = dryback_pct
    if db is None:
        return {
            "phase": None,
            "reason": "dryback_unknown",
            "dryback_pct": None,
            "lights_on": True,
            "override": False,
            "targets": t,
            "act_allowed": False,
        }

    p1 = float(t["dryback_p1_max_pct"])
    p2 = float(t["dryback_p2_max_pct"])
    phase: PhaseId
    if db < p1:
        phase = "P1"
        reason = "shallow_dryback"
    elif db < p2:
        phase = "P2"
        reason = "vegetative_band"
    else:
        phase = "P3"
        reason = "generative_dryback"

    return {
        "phase": phase,
        "reason": reason,
        "dryback_pct": db,
        "lights_on": True,
        "override": False,
        "targets": t,
        "act_allowed": phase in ("P1", "P2", "P3"),
    }


def build_root_steering_snapshot(
    pots: dict[str, Any],
    *,
    lights_on: bool,
    reading_ok_by_pot: dict[str, bool] | None = None,
) -> dict[str, Any]:
    """Fleet-facing SoT: per potN steering + global override/targets."""
    ok_map = reading_ok_by_pot or {}
    by_pot: dict[str, Any] = {}
    for pot_id, pot in (pots or {}).items():
        values = getattr(pot, "values", None) or {}
        if isinstance(pot, dict):
            values = pot.get("values") or {}
        dryback = values.get("dryback_pct")
        try:
            dryback_f = float(dryback) if dryback is not None else None
        except (TypeError, ValueError):
            dryback_f = None
        reading_ok = bool(ok_map.get(pot_id, getattr(pot, "online", True)))
        by_pot[str(pot_id)] = compute_phase(
            reading_ok=reading_ok,
            lights_on=lights_on,
            dryback_pct=dryback_f,
        )
    return {
        "override": is_root_steering_override(),
        "targets": _load_targets(),
        "lights_on": lights_on,
        "pots": by_pot,
    }
