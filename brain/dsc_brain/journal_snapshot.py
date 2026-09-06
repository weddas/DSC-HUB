"""Capture scope-appropriate env readings for journal entries at save time."""

from __future__ import annotations

import json
import sqlite3
import time
from pathlib import Path
from typing import Any

from .climate_mode import migrate_legacy_clone_mode
from .compose_store import get_helper, get_roster_slots
from .computed_ops import build_computed_hass_states
from .fleet_state import get_fleet_state
from .paths import DEFAULT_DB
from .plant_probe import parse_slot_plant_id
from .settings import list_history, list_inventory, list_roster
from .stage_model import tent_id


class JournalForbiddenError(Exception):
    """Raised when mutating a system-sourced journal row."""


def ensure_journal_snapshot_column(conn: sqlite3.Connection, table: str) -> None:
    """Idempotent migration: add snapshot_json to a journal table."""
    cols = {r[1] for r in conn.execute(f"PRAGMA table_info({table})").fetchall()}
    if "snapshot_json" in cols:
        return
    try:
        conn.execute(
            f"ALTER TABLE {table} ADD COLUMN snapshot_json TEXT NOT NULL DEFAULT '{{}}'"
        )
    except sqlite3.OperationalError as exc:
        # check-then-act race: a concurrent writer (parallel journal posts) added
        # the column between our PRAGMA and this ALTER. Harmless.
        if "duplicate column name" not in str(exc).lower():
            raise


def snapshot_from_json(raw: str | None) -> dict[str, Any]:
    try:
        snap = json.loads(raw or "{}")
    except json.JSONDecodeError:
        snap = {}
    return snap if isinstance(snap, dict) else {}


def build_journal_fleet_context() -> dict[str, Any]:
    """Live fleet dict plus computed hass_extras for snapshot capture."""
    state = get_fleet_state()
    inventory = list_inventory()
    ctx = state.to_dict()
    ctx["hass_extras"] = build_computed_hass_states(state, inventory)
    return ctx


def _maybe_float(val: Any) -> float | None:
    if val is None:
        return None
    try:
        return float(val)
    except (TypeError, ValueError):
        return None


def _pot_values(fleet: dict[str, Any], pot_id: str) -> dict[str, Any]:
    pots = fleet.get("pots") or {}
    computed_pots = (fleet.get("computed") or {}).get("pots") or {}
    pot = pots.get(pot_id) or computed_pots.get(pot_id) or {}
    if isinstance(pot, dict):
        values = pot.get("values")
        if isinstance(values, dict):
            return values
        return pot
    values = getattr(pot, "values", None)
    return values if isinstance(values, dict) else {}


def _hub_values(fleet: dict[str, Any]) -> dict[str, Any]:
    hub = fleet.get("hub") or {}
    if isinstance(hub, dict):
        return hub.get("values") or {}
    return getattr(hub, "values", None) or {}


def _hass_extra_state(fleet: dict[str, Any], entity_id: str) -> Any:
    extras = fleet.get("hass_extras") or {}
    ent = extras.get(entity_id) or {}
    if not isinstance(ent, dict):
        return None
    st = ent.get("state")
    if st in (None, "", "unavailable", "unknown"):
        return None
    return st


def _resolve_pot_for_plant(plant_id: str) -> str | None:
    slot_n = parse_slot_plant_id(plant_id)
    if slot_n:
        for slot in get_roster_slots():
            if int(slot.get("slot") or 0) != slot_n:
                continue
            pot = str(slot.get("pot") or "")
            if pot.isdigit():
                return f"pot{pot}"
            break

    for row in list_inventory():
        seat_id = str(row.get("seat_id") or "")
        if not seat_id.startswith("pot"):
            continue
        extra = row.get("extra") or {}
        if str(extra.get("assigned_plant_id") or "") == plant_id:
            return seat_id
    return None


def _plant_growth_stage(plant_id: str, fleet: dict[str, Any]) -> str | None:
    pot_id = _resolve_pot_for_plant(plant_id)
    if pot_id:
        n = pot_id.replace("pot", "")
        stage = _hass_extra_state(fleet, f"select.dsc_probe{n}_growth_stage")
        if stage:
            return str(stage)
        row = next((r for r in list_roster() if r.get("seat_id") == pot_id), None)
        if row:
            recipe = row.get("recipe") or {}
            gs = recipe.get("growth_stage") or row.get("stage")
            if gs:
                return str(gs)
    slot_n = parse_slot_plant_id(plant_id)
    if slot_n:
        for slot in get_roster_slots():
            if int(slot.get("slot") or 0) == slot_n:
                gs = slot.get("growth_stage") or slot.get("stage")
                if gs:
                    return str(gs)
    return None


def _capture_plant_snapshot(plant_id: str, fleet: dict[str, Any]) -> dict[str, Any]:
    snap: dict[str, Any] = {}
    stage = _plant_growth_stage(plant_id, fleet)
    if stage:
        snap["growth_stage"] = stage
    pot_id = _resolve_pot_for_plant(plant_id)
    if pot_id:
        values = _pot_values(fleet, pot_id)
        for key in ("moisture_pct", "ec_us", "ph"):
            v = _maybe_float(values.get(key))
            if v is not None:
                snap[key] = v
    return snap


def _capture_space_snapshot(space_id: str, fleet: dict[str, Any]) -> dict[str, Any]:
    tid = tent_id(space_id)
    hub = _hub_values(fleet)
    snap: dict[str, Any] = {}

    if tid == "clone":
        for src_key, dst_key in (
            ("clone_temp_c", "temp_c"),
            ("clone_rh_pct", "rh_pct"),
            ("clone_vpd_kpa", "vpd_kpa"),
        ):
            v = _maybe_float(hub.get(src_key))
            if v is not None:
                snap[dst_key] = v
        window_key = "window_2x4_open"
        lights_entity = "sensor.dsc_lights_on_today_2x4"
        mode = migrate_legacy_clone_mode(
            get_helper("select.dsc_hub_clone_mode", "")
            or get_helper("select.dsc_hub_clone_photoperiod", "")
        )
        if mode:
            snap["climate_mode"] = mode
    else:
        for key in ("temp_c", "rh_pct", "vpd_kpa"):
            v = _maybe_float(hub.get(key))
            if v is not None:
                snap[key] = v
        window_key = "window_4x8_open"
        lights_entity = "sensor.dsc_lights_on_today_4x8"

    window = hub.get(window_key)
    if window is not None:
        snap["window_open"] = bool(window)

    lights_h = _hass_extra_state(fleet, lights_entity)
    if lights_h is not None:
        lh = _maybe_float(lights_h)
        if lh is not None:
            snap["lights_on_today_h"] = lh

    return snap


def _capture_room_snapshot(fleet: dict[str, Any]) -> dict[str, Any]:
    hub = _hub_values(fleet)
    snap: dict[str, Any] = {}
    for key in ("room_temp_c", "room_rh_pct", "room_vpd_kpa"):
        v = _maybe_float(hub.get(key))
        if v is not None:
            snap[key] = v
    return snap


def _capture_core_snapshot(fleet: dict[str, Any]) -> dict[str, Any]:
    snap: dict[str, Any] = {}
    version = fleet.get("version") or fleet.get("expected_firmware")
    if version:
        snap["brain_version"] = str(version)
    alert = _hass_extra_state(fleet, "sensor.dsc_active_alert_count")
    if alert is not None:
        try:
            snap["active_alert_count"] = int(float(alert))
        except (TypeError, ValueError):
            pass
    return snap


def capture_journal_snapshot(
    scope_kind: str,
    scope_id: str,
    fleet: dict[str, Any],
) -> dict[str, Any]:
    """Build scope-appropriate snapshot dict from fleet/computed context."""
    kind = str(scope_kind or "").strip().lower()
    if kind == "plant":
        return _capture_plant_snapshot(scope_id, fleet)
    if kind == "space":
        return _capture_space_snapshot(scope_id, fleet)
    if kind == "room":
        return _capture_room_snapshot(fleet)
    if kind == "core":
        return _capture_core_snapshot(fleet)
    return {}


HISTORY_BACKFILL_WINDOW_SEC = 30 * 60

_SCOPE_TABLE: dict[str, tuple[str, str | None]] = {
    "plant": ("plant_journal", "plant_id"),
    "space": ("space_journal", "space_id"),
    "room": ("room_journal", "room_id"),
    "core": ("dsc_core_journal", None),
}


def _expected_history_keys(scope_kind: str, scope_id: str) -> list[str]:
    kind = str(scope_kind or "").strip().lower()
    if kind == "plant":
        return ["moisture_pct", "ec_us", "ph"]
    if kind == "space":
        keys = ["temp_c", "rh_pct", "vpd_kpa", "window_open"]
        if str(scope_id).strip() == "2x4":
            return keys
        return keys
    if kind == "room":
        return ["room_temp_c", "room_rh_pct", "room_vpd_kpa"]
    return []


def _history_metric_for_key(
    scope_kind: str,
    scope_id: str,
    key: str,
    *,
    plant_id: str | None = None,
) -> tuple[str, str] | None:
    kind = str(scope_kind or "").strip().lower()
    if kind == "plant":
        pot_id = _resolve_pot_for_plant(str(plant_id or scope_id))
        if not pot_id:
            return None
        mapping = {
            "moisture_pct": (pot_id, "moisture_pct"),
            "ec_us": (pot_id, "ec_us"),
            "ph": (pot_id, "ph"),
        }
        return mapping.get(key)
    if kind == "space":
        sid = str(scope_id).strip()
        if sid == "2x4":
            mapping = {
                "temp_c": ("hub", "clone_temp_c"),
                "rh_pct": ("hub", "clone_rh_pct"),
                "vpd_kpa": ("hub", "clone_vpd_kpa"),
                "window_open": ("hub", "window_2x4_open"),
            }
        else:
            mapping = {
                "temp_c": ("hub", "temp_c"),
                "rh_pct": ("hub", "rh_pct"),
                "vpd_kpa": ("hub", "vpd_kpa"),
                "window_open": ("hub", "window_4x8_open"),
            }
        return mapping.get(key)
    if kind == "room":
        mapping = {
            "room_temp_c": ("hub", "room_temp_c"),
            "room_rh_pct": ("hub", "room_rh_pct"),
            "room_vpd_kpa": ("hub", "room_vpd_kpa"),
        }
        return mapping.get(key)
    return None


def _nearest_history_value(
    seat_id: str,
    metric: str,
    target_ts: float,
    *,
    window_sec: float = HISTORY_BACKFILL_WINDOW_SEC,
    db_path: Path | None = None,
) -> float | bool | None:
    since = target_ts - window_sec
    rows = list_history(seat_id, metric, since, db_path=db_path)
    best: tuple[float, float] | None = None
    for row in rows:
        ts = float(row.get("ts") or 0)
        if abs(ts - target_ts) > window_sec:
            continue
        dist = abs(ts - target_ts)
        if best is None or dist < best[0]:
            val = row.get("value")
            if val is None:
                continue
            best = (dist, float(val))
    if best is None:
        return None
    val = best[1]
    if metric.startswith("window_") or metric.endswith("_open"):
        return bool(val)
    return val


def _snapshot_missing_keys(snap: dict[str, Any], expected: list[str]) -> list[str]:
    if not snap:
        return list(expected)
    return [key for key in expected if key not in snap]


def _backfill_snapshot_from_history(
    scope_kind: str,
    scope_id: str,
    occurred_at: float,
    snap: dict[str, Any],
    *,
    plant_id: str | None = None,
    db_path: Path | None = None,
) -> dict[str, Any]:
    expected = _expected_history_keys(scope_kind, scope_id)
    missing = _snapshot_missing_keys(snap, expected)
    if not missing:
        return snap
    merged = dict(snap)
    filled: list[str] = []
    for key in missing:
        src = _history_metric_for_key(scope_kind, scope_id, key, plant_id=plant_id)
        if not src:
            continue
        val = _nearest_history_value(src[0], src[1], occurred_at, db_path=db_path)
        if val is not None:
            merged[key] = val
            filled.append(key)
    if filled:
        # Mark reconstructed-after-the-fact values so a reader never mistakes a
        # ±30 min history sample for a value frozen at compose time.
        meta = dict(merged.get("_backfill") or {})
        meta["keys"] = sorted(set(meta.get("keys", [])) | set(filled))
        meta["at"] = time.time()
        merged["_backfill"] = meta
    return merged


def backfill_journal_snapshots(
    scope_kind: str,
    scope_id: str | None = None,
    limit: int = 100,
    *,
    db_path: Path | None = None,
) -> dict[str, Any]:
    """Backfill empty snapshot_json on operator journal rows from fleet_history.

    Samples fleet_history nearest to occurred_at within ±30 minutes using the same
    seat/metric keys as history_ops entity charts. Leaves keys empty when no history
    exists (honest — no fabricated readings).
    """
    kind = str(scope_kind or "").strip().lower()
    table_info = _SCOPE_TABLE.get(kind)
    if table_info is None:
        raise ValueError(f"unsupported scope kind: {scope_kind}")
    table, id_col = table_info
    path = db_path or DEFAULT_DB
    path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(path))
    conn.row_factory = sqlite3.Row
    ensure_journal_snapshot_column(conn, table)

    params: list[Any] = ["operator"]
    where = "source=?"
    if id_col and scope_id is not None:
        where += f" AND {id_col}=?"
        params.append(str(scope_id).strip())
    params.append(int(limit))

    rows = conn.execute(
        f"""
        SELECT id, occurred_at, snapshot_json{', ' + id_col if id_col else ''}
        FROM {table}
        WHERE {where}
        ORDER BY occurred_at DESC
        LIMIT ?
        """,
        params,
    ).fetchall()

    updated = 0
    examined = 0
    skipped = 0
    for row in rows:
        examined += 1
        snap = snapshot_from_json(row["snapshot_json"])
        sid = str(scope_id or (row[id_col] if id_col else "") or "")
        plant_id = sid if kind == "plant" else None
        merged = _backfill_snapshot_from_history(
            kind,
            sid,
            float(row["occurred_at"]),
            snap,
            plant_id=plant_id,
            db_path=path,
        )
        if merged == snap:
            skipped += 1
            continue
        conn.execute(
            f"UPDATE {table} SET snapshot_json=? WHERE id=?",
            (json.dumps(merged, separators=(",", ":")), int(row["id"])),
        )
        updated += 1
    conn.commit()
    conn.close()
    return {
        "scope_kind": kind,
        "scope_id": scope_id,
        "examined": examined,
        "updated": updated,
        "skipped": skipped,
    }
