"""Local energy estimates + slide suggestions (no auto-apply)."""

from __future__ import annotations

import json
import sqlite3
import time
from pathlib import Path
from typing import Any

from .paths import DEFAULT_DB
from .space_model import ensure_kit_spaces, list_space_devices, list_spaces

# Placeholder AU-style bands — operator Update in Settings.
DEFAULT_TARIFF: tuple[dict[str, Any], ...] = (
    {"band_id": "offpeak", "label": "Off-peak", "start_min": 22 * 60, "end_min": 7 * 60, "rate_per_kwh": 0.18},
    {"band_id": "shoulder", "label": "Shoulder", "start_min": 7 * 60, "end_min": 14 * 60, "rate_per_kwh": 0.28},
    {"band_id": "peak", "label": "Peak", "start_min": 14 * 60, "end_min": 22 * 60, "rate_per_kwh": 0.42},
)


def _connect(db_path: Path | None = None) -> sqlite3.Connection:
    path = db_path or DEFAULT_DB
    path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(path))
    conn.row_factory = sqlite3.Row
    return conn


def init_energy_tables(db_path: Path | None = None) -> None:
    with _connect(db_path) as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS energy_tariff (
              band_id TEXT PRIMARY KEY,
              label TEXT NOT NULL,
              start_min INTEGER NOT NULL,
              end_min INTEGER NOT NULL,
              rate_per_kwh REAL NOT NULL,
              updated_at REAL NOT NULL
            )
            """
        )
        conn.commit()


def ensure_default_tariff(db_path: Path | None = None) -> list[dict[str, Any]]:
    init_energy_tables(db_path)
    now = time.time()
    with _connect(db_path) as conn:
        for band in DEFAULT_TARIFF:
            exists = conn.execute(
                "SELECT 1 FROM energy_tariff WHERE band_id=?", (band["band_id"],)
            ).fetchone()
            if exists:
                continue
            conn.execute(
                """
                INSERT INTO energy_tariff(band_id, label, start_min, end_min, rate_per_kwh, updated_at)
                VALUES(?, ?, ?, ?, ?, ?)
                """,
                (
                    band["band_id"],
                    band["label"],
                    int(band["start_min"]),
                    int(band["end_min"]),
                    float(band["rate_per_kwh"]),
                    now,
                ),
            )
        conn.commit()
    return list_tariff(db_path)


def list_tariff(db_path: Path | None = None) -> list[dict[str, Any]]:
    init_energy_tables(db_path)
    with _connect(db_path) as conn:
        rows = conn.execute(
            "SELECT band_id, label, start_min, end_min, rate_per_kwh, updated_at FROM energy_tariff ORDER BY start_min"
        ).fetchall()
    return [
        {
            "band_id": r["band_id"],
            "label": r["label"],
            "start_min": int(r["start_min"]),
            "end_min": int(r["end_min"]),
            "rate_per_kwh": float(r["rate_per_kwh"]),
            "updated_at": r["updated_at"],
        }
        for r in rows
    ]


def upsert_tariff_band(band: dict[str, Any], *, db_path: Path | None = None) -> dict[str, Any]:
    ensure_default_tariff(db_path)
    band_id = str(band.get("band_id") or "").strip()
    if not band_id:
        raise ValueError("band_id required")
    now = time.time()
    with _connect(db_path) as conn:
        conn.execute(
            """
            INSERT INTO energy_tariff(band_id, label, start_min, end_min, rate_per_kwh, updated_at)
            VALUES(?, ?, ?, ?, ?, ?)
            ON CONFLICT(band_id) DO UPDATE SET
              label=excluded.label,
              start_min=excluded.start_min,
              end_min=excluded.end_min,
              rate_per_kwh=excluded.rate_per_kwh,
              updated_at=excluded.updated_at
            """,
            (
                band_id,
                str(band.get("label") or band_id),
                int(band.get("start_min") or 0),
                int(band.get("end_min") or 0),
                float(band.get("rate_per_kwh") or 0),
                now,
            ),
        )
        conn.commit()
    return next(b for b in list_tariff(db_path) if b["band_id"] == band_id)


def _minutes_in_band(on_min: int, hours: float, start_min: int, end_min: int) -> float:
    """How many hours of a lit window [on_min, on_min+hours) fall in [start,end) (wrap OK)."""
    lit = max(0.0, float(hours)) * 60.0
    if lit <= 0:
        return 0.0
    total = 0.0
    for i in range(int(lit)):
        m = (on_min + i) % (24 * 60)
        if start_min < end_min:
            in_band = start_min <= m < end_min
        else:
            # wraps midnight
            in_band = m >= start_min or m < end_min
        if in_band:
            total += 1.0
    return total / 60.0


def parse_hhmm_to_min(val: str) -> int | None:
    text = str(val or "").strip()
    parts = text.split(":")
    if len(parts) < 2:
        return None
    try:
        h, m = int(parts[0]), int(parts[1])
    except ValueError:
        return None
    if h > 23 or m > 59:
        return None
    return h * 60 + m


def estimate_space_day(
    space_id: str,
    *,
    lights_on: str,
    want_hours: float,
    db_path: Path | None = None,
) -> dict[str, Any]:
    ensure_kit_spaces(db_path)
    ensure_default_tariff(db_path)
    on_min = parse_hhmm_to_min(lights_on)
    if on_min is None:
        return {
            "space_id": space_id,
            "ok": False,
            "honesty": "no schedule: lights-on unset or not HH:MM",
            "estimate_label": "Estimate",
            "devices": [],
            "total_kwh": 0.0,
            "total_cost": 0.0,
            "by_band": {},
        }
    hours = float(want_hours) if want_hours > 0 else 12.0
    tariff = list_tariff(db_path)
    devices = [d for d in list_space_devices(space_id, db_path=db_path) if d.get("enabled")]
    by_band: dict[str, float] = {b["band_id"]: 0.0 for b in tariff}
    device_rows: list[dict[str, Any]] = []
    total_kwh = 0.0
    total_cost = 0.0
    for d in devices:
        watts = float(d.get("watts") or 0)
        if d.get("duty_source") != "photoperiod":
            # Always-on approximation for non-photoperiod devices (fans): 24h at watts
            kwh = watts * 24.0 / 1000.0
            # cost at weighted average of bands by hours
            cost = 0.0
            for b in tariff:
                h = _minutes_in_band(0, 24.0, int(b["start_min"]), int(b["end_min"]))
                cost += (watts * h / 1000.0) * float(b["rate_per_kwh"])
                by_band[b["band_id"]] = by_band.get(b["band_id"], 0.0) + (watts * h / 1000.0) * float(
                    b["rate_per_kwh"]
                )
        else:
            kwh = watts * hours / 1000.0
            cost = 0.0
            for b in tariff:
                h = _minutes_in_band(on_min, hours, int(b["start_min"]), int(b["end_min"]))
                part = (watts * h / 1000.0) * float(b["rate_per_kwh"])
                cost += part
                by_band[b["band_id"]] = by_band.get(b["band_id"], 0.0) + part
        total_kwh += kwh
        total_cost += cost
        device_rows.append(
            {
                "device_id": d["device_id"],
                "label": d["label"],
                "watts": watts,
                "kwh": round(kwh, 4),
                "cost": round(cost, 4),
            }
        )
    return {
        "space_id": space_id,
        "ok": True,
        "honesty": "Estimate from local watts × hours × tariff — not a utility bill",
        "estimate_label": "Estimate",
        "lights_on": lights_on,
        "want_hours": hours,
        "devices": device_rows,
        "total_kwh": round(total_kwh, 4),
        "total_cost": round(total_cost, 4),
        "by_band": {k: round(v, 4) for k, v in by_band.items()},
    }


def suggest_slides(
    space_id: str,
    *,
    current_on: str,
    want_hours: float,
    db_path: Path | None = None,
) -> list[dict[str, Any]]:
    """Ratio-fixed slides — suggestions only; never apply."""
    cur = estimate_space_day(space_id, lights_on=current_on, want_hours=want_hours, db_path=db_path)
    candidates = [
        ("current", current_on),
        ("night_heat", "20:00:00"),
        ("max_offpeak", "22:00:00"),
        ("morning", "06:00:00"),
    ]
    out: list[dict[str, Any]] = []
    for key, on in candidates:
        if parse_hhmm_to_min(on) is None:
            continue
        est = estimate_space_day(space_id, lights_on=on, want_hours=want_hours, db_path=db_path)
        if not est.get("ok"):
            continue
        delta = float(est["total_cost"]) - float(cur.get("total_cost") or 0)
        out.append(
            {
                "id": key,
                "label": {
                    "current": "Current",
                    "night_heat": "Night heat",
                    "max_offpeak": "Max off-peak",
                    "morning": "Morning",
                }.get(key, key),
                "lights_on": on,
                "want_hours": want_hours,
                "total_cost": est["total_cost"],
                "delta_vs_current": round(delta, 4),
                "honesty": est["honesty"],
                "apply": False,
            }
        )
    out.sort(key=lambda r: (r["id"] != "current", r["total_cost"]))
    return out
