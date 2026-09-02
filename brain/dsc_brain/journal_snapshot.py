"""Capture scope-appropriate env readings for journal entries at save time."""

from __future__ import annotations

import json
import sqlite3
from typing import Any

from .climate_mode import migrate_legacy_clone_mode
from .compose_store import get_helper, get_roster_slots
from .computed_ops import build_computed_hass_states
from .fleet_state import get_fleet_state
from .plant_probe import parse_slot_plant_id
from .settings import list_inventory, list_roster
from .stage_model import tent_id


class JournalForbiddenError(Exception):
    """Raised when mutating a system-sourced journal row."""


def ensure_journal_snapshot_column(conn: sqlite3.Connection, table: str) -> None:
    """Idempotent migration: add snapshot_json to a journal table."""
    cols = {r[1] for r in conn.execute(f"PRAGMA table_info({table})").fetchall()}
    if "snapshot_json" not in cols:
        conn.execute(
            f"ALTER TABLE {table} ADD COLUMN snapshot_json TEXT NOT NULL DEFAULT '{{}}'"
        )


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
