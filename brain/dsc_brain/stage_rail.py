"""Stage presets (the hub's ``apply_stage`` table), brain-owned and editable.

Operator decision 2026-09-07 (plan-settings § Decisions): the stage rail lives in the
brain, seeded from the firmware's baked table, and the brain writes the five 4×8 targets
when the stage changes — provided the hub's ``switch.dsc_hub_brain_stage_targets`` is on
and the hub can see the brain. A hub with no brain still applies its baked table, so a
panel-side stage change stays sane. Light hours stay firmware-owned (``stage_light_hours``
global); the column here is what the SPA labels, not what the hub runs.
"""

from __future__ import annotations

import json
from typing import Any

from .settings import connect

STAGE_RAIL_SCHEMA = """
CREATE TABLE IF NOT EXISTS stage_rail (
  stage TEXT PRIMARY KEY,
  temp REAL NOT NULL,
  vpd_min REAL NOT NULL,
  vpd_max REAL NOT NULL,
  rh_min REAL NOT NULL,
  rh_max REAL NOT NULL,
  light_hours REAL NOT NULL,
  short TEXT NOT NULL,
  sort INTEGER NOT NULL,
  updated_at REAL NOT NULL DEFAULT 0
);
"""

# Mirrors firmware/v4/dsc-hub-v4_0.yaml `apply_stage` and frontend/src/lib/tentWant.ts.
DEFAULT_STAGE_RAIL: list[dict[str, Any]] = [
    {"stage": "Germination", "temp": 25, "vpd_min": 0.4, "vpd_max": 0.8, "rh_min": 70, "rh_max": 80, "light_hours": 18, "short": "Germ"},
    {"stage": "Seedling", "temp": 24, "vpd_min": 0.5, "vpd_max": 0.8, "rh_min": 65, "rh_max": 75, "light_hours": 18, "short": "Seedling"},
    {"stage": "Early Vegetative", "temp": 25, "vpd_min": 0.7, "vpd_max": 1.0, "rh_min": 60, "rh_max": 70, "light_hours": 18, "short": "Early Veg"},
    {"stage": "Vegetative", "temp": 26, "vpd_min": 0.8, "vpd_max": 1.1, "rh_min": 55, "rh_max": 65, "light_hours": 18, "short": "Veg"},
    {"stage": "Late (Push) Vegetative", "temp": 26, "vpd_min": 1.0, "vpd_max": 1.2, "rh_min": 50, "rh_max": 60, "light_hours": 18, "short": "Push Veg"},
    {"stage": "Early Flowering", "temp": 25, "vpd_min": 1.0, "vpd_max": 1.2, "rh_min": 50, "rh_max": 55, "light_hours": 12, "short": "Early Flwr"},
    {"stage": "Flowering", "temp": 24, "vpd_min": 1.2, "vpd_max": 1.4, "rh_min": 45, "rh_max": 50, "light_hours": 12, "short": "Flower"},
    {"stage": "Late Flowering", "temp": 22, "vpd_min": 1.3, "vpd_max": 1.5, "rh_min": 40, "rh_max": 45, "light_hours": 12, "short": "Late Flwr"},
    {"stage": "Final 48-72h Flowering", "temp": 21, "vpd_min": 1.4, "vpd_max": 1.6, "rh_min": 35, "rh_max": 45, "light_hours": 12, "short": "Flush"},
    {"stage": "Dry Mode", "temp": 19, "vpd_min": 0.8, "vpd_max": 1.0, "rh_min": 55, "rh_max": 62, "light_hours": 0, "short": "Dry"},
]

STAGE_RAIL_FIELDS = ("temp", "vpd_min", "vpd_max", "rh_min", "rh_max", "light_hours")

# Hard bounds — the hub's own number ranges (firmware min/max) so a preset can never ask
# for a value the hub would refuse.
_BOUNDS: dict[str, tuple[float, float]] = {
    "temp": (15.0, 32.0),
    "vpd_min": (0.4, 1.6),
    "vpd_max": (0.4, 1.8),
    "rh_min": (20.0, 90.0),
    "rh_max": (20.0, 95.0),
    "light_hours": (0.0, 24.0),
}

# Preset field → the hub number the brain writes on a stage change (4×8 tent).
STAGE_TARGET_ENTITIES: dict[str, str] = {
    "temp": "number.dsc_hub_target_temp",
    "vpd_min": "number.dsc_hub_vpd_target_min",
    "vpd_max": "number.dsc_hub_vpd_target_max",
    "rh_min": "number.dsc_hub_rh_target_min",
    "rh_max": "number.dsc_hub_rh_target_max",
}

BRAIN_STAGE_SWITCH = "switch.dsc_hub_brain_stage_targets"


def _ensure(conn) -> None:
    conn.executescript(STAGE_RAIL_SCHEMA)
    have = {r["stage"] for r in conn.execute("SELECT stage FROM stage_rail")}
    for i, row in enumerate(DEFAULT_STAGE_RAIL):
        if row["stage"] in have:
            continue
        conn.execute(
            "INSERT INTO stage_rail(stage, temp, vpd_min, vpd_max, rh_min, rh_max, light_hours, short, sort, updated_at)"
            " VALUES(?,?,?,?,?,?,?,?,?,0)",
            (row["stage"], row["temp"], row["vpd_min"], row["vpd_max"], row["rh_min"], row["rh_max"], row["light_hours"], row["short"], i),
        )
    conn.commit()


def _row(r) -> dict[str, Any]:
    default = next((d for d in DEFAULT_STAGE_RAIL if d["stage"] == r["stage"]), None)
    out = {
        "stage": r["stage"],
        "short": r["short"],
        "temp": float(r["temp"]),
        "vpd_min": float(r["vpd_min"]),
        "vpd_max": float(r["vpd_max"]),
        "rh_min": float(r["rh_min"]),
        "rh_max": float(r["rh_max"]),
        "light_hours": float(r["light_hours"]),
        "updated_at": float(r["updated_at"] or 0),
        "default": {k: float(default[k]) for k in STAGE_RAIL_FIELDS} if default else None,
    }
    out["changed"] = bool(default) and any(abs(out[k] - float(default[k])) > 1e-9 for k in STAGE_RAIL_FIELDS)
    return out


def list_stage_rail(db_path=None) -> list[dict[str, Any]]:
    conn = connect(db_path)
    try:
        _ensure(conn)
        return [_row(r) for r in conn.execute("SELECT * FROM stage_rail ORDER BY sort")]
    finally:
        conn.close()


def targets_for_stage(stage: str, db_path=None) -> dict[str, float] | None:
    for row in list_stage_rail(db_path):
        if row["stage"] == stage:
            return {k: row[k] for k in STAGE_RAIL_FIELDS}
    return None


def _validate(stage: str, patch: dict[str, Any]) -> dict[str, float]:
    if not any(d["stage"] == stage for d in DEFAULT_STAGE_RAIL):
        raise ValueError(f"unknown stage {stage!r}")
    clean: dict[str, float] = {}
    for key, raw in patch.items():
        if key not in STAGE_RAIL_FIELDS:
            raise ValueError(f"unknown field {key!r}")
        try:
            val = float(raw)
        except (TypeError, ValueError) as exc:
            raise ValueError(f"{stage}.{key} must be numeric") from exc
        lo, hi = _BOUNDS[key]
        if val < lo or val > hi:
            raise ValueError(f"{stage}.{key} must be within {lo}–{hi}")
        clean[key] = val
    return clean


def patch_stage_rail(stage: str, patch: dict[str, Any], db_path=None) -> dict[str, Any]:
    """Update one stage's preset fields (validated against the hub's number bounds)."""
    import time

    clean = _validate(stage, patch)
    conn = connect(db_path)
    try:
        _ensure(conn)
        current = {k: float(v) for k, v in dict(conn.execute("SELECT * FROM stage_rail WHERE stage=?", (stage,)).fetchone()).items() if k in STAGE_RAIL_FIELDS}
        merged = {**current, **clean}
        if merged["vpd_min"] > merged["vpd_max"]:
            raise ValueError(f"{stage}: VPD min must not exceed VPD max")
        if merged["rh_min"] > merged["rh_max"]:
            raise ValueError(f"{stage}: RH min must not exceed RH max")
        if clean:
            sets = ", ".join(f"{k}=?" for k in clean)
            conn.execute(f"UPDATE stage_rail SET {sets}, updated_at=? WHERE stage=?", (*clean.values(), time.time(), stage))
            conn.commit()
        return _row(conn.execute("SELECT * FROM stage_rail WHERE stage=?", (stage,)).fetchone())
    finally:
        conn.close()


def reset_stage_rail(stage: str | None = None, db_path=None) -> list[dict[str, Any]]:
    conn = connect(db_path)
    try:
        _ensure(conn)
        for row in DEFAULT_STAGE_RAIL:
            if stage and row["stage"] != stage:
                continue
            conn.execute(
                "UPDATE stage_rail SET temp=?, vpd_min=?, vpd_max=?, rh_min=?, rh_max=?, light_hours=?, updated_at=0 WHERE stage=?",
                (row["temp"], row["vpd_min"], row["vpd_max"], row["rh_min"], row["rh_max"], row["light_hours"], row["stage"]),
            )
        conn.commit()
        return [_row(r) for r in conn.execute("SELECT * FROM stage_rail ORDER BY sort")]
    finally:
        conn.close()


def stage_rail_json(db_path=None) -> str:
    return json.dumps(list_stage_rail(db_path))
