"""Mobile soil probe tests — confirmed snapshots vs idle thereabouts (7.2)."""

from __future__ import annotations

import json
import statistics
import time
import uuid
from typing import Any

from .fleet_state import get_fleet_state
from .settings import connect, get_setting, list_inventory, set_setting, upsert_inventory, upsert_roster

SOIL_CHANNELS = (
    "moisture_pct",
    "soil_temp_c",
    "ec_us",
    "ph",
    "nitrogen",
    "phosphorus",
    "potassium",
)

TIMING_NOTES = frozenset(
    {"before_water", "after_water", "during_water", "outside_water", "adhoc"}
)

STABILITY_VARIANCE_MAX = 2.5  # moisture % stddev
STABILITY_SECONDS = 45
STABILITY_MIN_SAMPLES = 3

_active: dict[str, dict[str, Any]] = {}


def _ensure_schema(conn: Any) -> None:
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS soil_tests (
          id TEXT PRIMARY KEY,
          ts REAL NOT NULL,
          probe_seat_id TEXT NOT NULL,
          tent TEXT NOT NULL,
          target_pot_id TEXT NOT NULL,
          roster_seat_id TEXT,
          plant_label TEXT NOT NULL DEFAULT '',
          mode TEXT NOT NULL,
          timing_note TEXT NOT NULL,
          notes TEXT NOT NULL DEFAULT '',
          readings_json TEXT NOT NULL,
          stable_seconds REAL NOT NULL DEFAULT 0,
          quality_score REAL NOT NULL DEFAULT 0,
          confirmed INTEGER NOT NULL DEFAULT 1
        )
        """
    )


def _probe_station_config(seat_id: str) -> dict[str, Any]:
    for row in list_inventory():
        if row["seat_id"] != seat_id:
            continue
        extra = row.get("extra") or {}
        if isinstance(extra, str):
            try:
                extra = json.loads(extra)
            except json.JSONDecodeError:
                extra = {}
        return {
            "seat_id": seat_id,
            "role": extra.get("role") or row.get("role"),
            "tent": extra.get("tent") or "2x4",
            "idle_home_pot_id": extra.get("idle_home_pot_id") or "",
            "reading_mode": extra.get("reading_mode") or "idle",
        }
    return {}


def _is_probe_station_seat(seat_id: str) -> bool:
    cfg = _probe_station_config(seat_id)
    return cfg.get("role") == "probe_station"


def list_probe_stations() -> list[dict[str, Any]]:
    out: list[dict[str, Any]] = []
    fleet = get_fleet_state()
    for row in list_inventory():
        extra = row.get("extra") or {}
        if isinstance(extra, str):
            try:
                extra = json.loads(extra)
            except json.JSONDecodeError:
                extra = {}
        if extra.get("role") != "probe_station":
            continue
        seat_id = str(row["seat_id"])
        idle_home = str(extra.get("idle_home_pot_id") or "")
        thereabouts: dict[str, Any] = {}
        online = False
        if idle_home and idle_home in fleet.pots:
            thereabouts = dict(fleet.pots[idle_home].values or {})
            online = bool(fleet.pots[idle_home].online)
        elif seat_id in fleet.pots:
            thereabouts = dict(fleet.pots[seat_id].values or {})
            online = bool(fleet.pots[seat_id].online)
        out.append(
            {
                "seat_id": seat_id,
                "tent": extra.get("tent") or "2x4",
                "idle_home_pot_id": idle_home,
                "reading_mode": extra.get("reading_mode") or "idle",
                "thereabouts": thereabouts,
                "online": online,
            }
        )
    return out


def patch_probe_station(seat_id: str, patch: dict[str, Any]) -> dict[str, Any]:
    for row in list_inventory():
        if row["seat_id"] != seat_id:
            continue
        extra = dict(row.get("extra") or {})
        if "idle_home_pot_id" in patch:
            extra["idle_home_pot_id"] = str(patch["idle_home_pot_id"])
        if "tent" in patch:
            extra["tent"] = str(patch["tent"])
        extra["role"] = "probe_station"
        extra.setdefault("probe_attached", True)
        return upsert_inventory(seat_id, {"extra": extra})
    raise KeyError(seat_id)


def _readings_from_pot(pot_id: str) -> dict[str, float | None]:
    fleet = get_fleet_state()
    pot = fleet.pots.get(pot_id)
    if not pot:
        return {k: None for k in SOIL_CHANNELS}
    v = pot.values or {}
    return {
        "moisture_pct": v.get("moisture_pct"),
        "soil_temp_c": v.get("soil_temp_c"),
        "ec_us": v.get("ec_us"),
        "ph": v.get("ph"),
        "nitrogen": v.get("nitrogen"),
        "phosphorus": v.get("phosphorus"),
        "potassium": v.get("potassium"),
    }


def _stability(samples: list[dict[str, float | None]]) -> tuple[bool, float, dict[str, float | None]]:
    if len(samples) < STABILITY_MIN_SAMPLES:
        return False, 0.0, samples[-1] if samples else {k: None for k in SOIL_CHANNELS}
    moist = [s["moisture_pct"] for s in samples if s.get("moisture_pct") is not None]
    if len(moist) < STABILITY_MIN_SAMPLES:
        return False, 0.0, samples[-1]
    std = statistics.pstdev(moist) if len(moist) > 1 else 999.0
    stable = std <= STABILITY_VARIANCE_MAX
    avg = samples[-1]
    for key in SOIL_CHANNELS:
        vals = [s[key] for s in samples if s.get(key) is not None]
        if vals:
            avg[key] = sum(vals) / len(vals)
    return stable, std, avg


def start_soil_test(body: dict[str, Any]) -> dict[str, Any]:
    test_id = str(uuid.uuid4())
    probe_seat = str(body["probe_seat_id"])
    target_pot = str(body["target_pot_id"])
    cfg = _probe_station_config(probe_seat)
    if cfg.get("role") != "probe_station":
        raise ValueError(f"{probe_seat} is not a probe station")
    tent = str(body.get("tent") or cfg.get("tent") or "2x4")
    mode = str(body.get("mode") or "roster")
    timing = str(body.get("timing_note") or "adhoc")
    if timing not in TIMING_NOTES:
        raise ValueError(f"invalid timing_note {timing}")
    extra_patch = {"reading_mode": "testing"}
    merged = {k: v for k, v in cfg.items() if k not in ("seat_id",)}
    merged.update(extra_patch)
    merged["role"] = "probe_station"
    upsert_inventory(probe_seat, {"extra": merged})
    session = {
        "id": test_id,
        "started_at": time.time(),
        "probe_seat_id": probe_seat,
        "target_pot_id": target_pot,
        "tent": tent,
        "roster_seat_id": body.get("roster_seat_id"),
        "plant_label": str(body.get("plant_label") or ""),
        "mode": mode,
        "timing_note": timing,
        "notes": str(body.get("notes") or ""),
        "samples": [],
        "idle_home_pot_id": cfg.get("idle_home_pot_id"),
    }
    _active[test_id] = session
    return {"id": test_id, "status": "capturing", "session": _public_session(session)}


def poll_soil_test(test_id: str) -> dict[str, Any]:
    session = _active.get(test_id)
    if not session:
        row = get_confirmed_test(test_id)
        if row:
            return {"id": test_id, "status": "confirmed", "test": row}
        raise KeyError(test_id)
    reading = _readings_from_pot(session["target_pot_id"])
    session["samples"].append({**reading, "ts": time.time()})
    window = session["samples"][-10:]
    stable, variance, avg = _stability(window)
    elapsed = time.time() - session["started_at"]
    return {
        "id": test_id,
        "status": "stable" if stable else "capturing",
        "stable": stable,
        "variance": variance,
        "elapsed_s": round(elapsed, 1),
        "current": reading,
        "average": avg,
        "sample_count": len(session["samples"]),
    }


def confirm_soil_test(test_id: str) -> dict[str, Any]:
    session = _active.pop(test_id, None)
    if not session:
        raise KeyError(test_id)
    window = session["samples"][-10:]
    stable, variance, avg = _stability(window)
    if not stable:
        _active[test_id] = session
        raise ValueError("readings not stable — wait for solid capture")
    quality = max(0.0, min(100.0, 100.0 - variance * 10))
    now = time.time()
    row = {
        "id": test_id,
        "ts": now,
        "probe_seat_id": session["probe_seat_id"],
        "tent": session["tent"],
        "target_pot_id": session["target_pot_id"],
        "roster_seat_id": session.get("roster_seat_id"),
        "plant_label": session.get("plant_label") or "",
        "mode": session["mode"],
        "timing_note": session["timing_note"],
        "notes": session.get("notes") or "",
        "readings_json": json.dumps(avg),
        "stable_seconds": now - session["started_at"],
        "quality_score": quality,
        "confirmed": 1,
    }
    conn = connect()
    _ensure_schema(conn)
    conn.execute(
        """
        INSERT INTO soil_tests(
          id, ts, probe_seat_id, tent, target_pot_id, roster_seat_id, plant_label,
          mode, timing_note, notes, readings_json, stable_seconds, quality_score, confirmed
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        """,
        (
            row["id"],
            row["ts"],
            row["probe_seat_id"],
            row["tent"],
            row["target_pot_id"],
            row["roster_seat_id"],
            row["plant_label"],
            row["mode"],
            row["timing_note"],
            row["notes"],
            row["readings_json"],
            row["stable_seconds"],
            row["quality_score"],
            row["confirmed"],
        ),
    )
    conn.commit()
    conn.close()
    roster_id = session.get("roster_seat_id")
    if roster_id:
        recipe_patch = {"last_soil_test": {**row, "readings": avg}}
        upsert_roster(str(roster_id), {"recipe": recipe_patch})
    cfg = _probe_station_config(session["probe_seat_id"])
    upsert_inventory(
        session["probe_seat_id"],
        {"extra": {**cfg, "reading_mode": "idle", "role": "probe_station"}},
    )
    return {
        "test": _serialize_row(row),
        "return_home_pot_id": session.get("idle_home_pot_id"),
        "message": "Return probe to idle home pot for safety.",
    }


def cancel_soil_test(test_id: str) -> dict[str, Any]:
    session = _active.pop(test_id, None)
    if not session:
        return {"cancelled": False}
    cfg = _probe_station_config(session["probe_seat_id"])
    upsert_inventory(
        session["probe_seat_id"],
        {"extra": {**cfg, "reading_mode": "idle", "role": "probe_station"}},
    )
    return {"cancelled": True, "id": test_id}


def list_soil_tests(roster_seat_id: str | None = None, limit: int = 50) -> list[dict[str, Any]]:
    conn = connect()
    _ensure_schema(conn)
    if roster_seat_id:
        rows = conn.execute(
            """
            SELECT * FROM soil_tests WHERE roster_seat_id=? AND confirmed=1
            ORDER BY ts DESC LIMIT ?
            """,
            (roster_seat_id, limit),
        ).fetchall()
    else:
        rows = conn.execute(
            "SELECT * FROM soil_tests WHERE confirmed=1 ORDER BY ts DESC LIMIT ?",
            (limit,),
        ).fetchall()
    conn.close()
    return [_serialize_row(dict(r)) for r in rows]


def get_confirmed_test(test_id: str) -> dict[str, Any] | None:
    conn = connect()
    _ensure_schema(conn)
    row = conn.execute("SELECT * FROM soil_tests WHERE id=?", (test_id,)).fetchone()
    conn.close()
    if not row:
        return None
    return _serialize_row(dict(row))


def init_probe_station_defaults() -> None:
    """One-time defaults: pot2 → 2x4 probe station, pot4 → 4x8."""
    if get_setting("probe_station_defaults_v1") == "applied":
        return
    defaults = {
        "pot2": {"role": "probe_station", "tent": "2x4", "idle_home_pot_id": "pot2", "probe_attached": True},
        "pot4": {"role": "probe_station", "tent": "4x8", "idle_home_pot_id": "pot4", "probe_attached": True},
    }
    for seat_id, extra in defaults.items():
        try:
            row = next(r for r in list_inventory() if r["seat_id"] == seat_id)
            merged = dict(row.get("extra") or {})
            merged.update(extra)
            upsert_inventory(seat_id, {"extra": merged})
        except StopIteration:
            pass
    set_setting("probe_station_defaults_v1", "applied")


def _public_session(session: dict[str, Any]) -> dict[str, Any]:
    return {k: session[k] for k in session if k != "samples"}


def _serialize_row(row: dict[str, Any]) -> dict[str, Any]:
    readings = {}
    try:
        readings = json.loads(row.get("readings_json") or "{}")
    except json.JSONDecodeError:
        pass
    return {
        "id": row["id"],
        "ts": row["ts"],
        "probe_seat_id": row["probe_seat_id"],
        "tent": row["tent"],
        "target_pot_id": row["target_pot_id"],
        "roster_seat_id": row.get("roster_seat_id"),
        "plant_label": row.get("plant_label") or "",
        "mode": row["mode"],
        "timing_note": row["timing_note"],
        "notes": row.get("notes") or "",
        "readings": readings,
        "stable_seconds": row.get("stable_seconds"),
        "quality_score": row.get("quality_score"),
        "confirmed": bool(row.get("confirmed")),
    }


def is_probe_station_idle(seat_id: str) -> bool:
    cfg = _probe_station_config(seat_id)
    return cfg.get("role") == "probe_station" and cfg.get("reading_mode", "idle") == "idle"
