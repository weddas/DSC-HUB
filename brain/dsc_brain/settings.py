"""Persistent settings + fleet inventory (Pi appliance SoT)."""

from __future__ import annotations

import datetime
import json
import uuid
import os
import sqlite3
import time
from pathlib import Path
from typing import Any

from .paths import DEFAULT_DB, _default_brain
from .db import ensure_schema, open_db

SETTINGS_SCHEMA = """
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS fleet_inventory (
  seat_id TEXT PRIMARY KEY,
  role TEXT NOT NULL,
  in_service INTEGER NOT NULL DEFAULT 1,
  host TEXT,
  mac TEXT,
  api_key TEXT,
  extra_json TEXT NOT NULL DEFAULT '{}'
);
CREATE TABLE IF NOT EXISTS fleet_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  seat_id TEXT NOT NULL,
  metric TEXT NOT NULL,
  value REAL,
  ts REAL NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_fleet_history_seat_metric_ts ON fleet_history(seat_id, metric, ts);
CREATE TABLE IF NOT EXISTS roster (
  seat_id TEXT PRIMARY KEY,
  strain_id TEXT,
  stage TEXT NOT NULL DEFAULT 'veg',
  recipe_json TEXT NOT NULL DEFAULT '{}',
  updated_at REAL NOT NULL
);
-- A plant is not a probe. `roster` made it one: seat_id was the PRIMARY KEY, so a plant
-- WAS its pot. Move it and it became a different row; swap the probe and the plant's
-- history went with the hardware; remove the probe and the plant went with it (which is
-- very nearly what happened when pot3/pot4 were retired on 2026-09-10).
--
-- Here the plant owns its identity and the probe is a placement it currently occupies.
-- `roster` is left in place, untouched, as a one-release rollback copy.
CREATE TABLE IF NOT EXISTS plant (
  plant_id TEXT PRIMARY KEY,
  seat_id TEXT,                              -- probe it sits at now; NULL = unplaced
  strain_id TEXT,
  stage TEXT NOT NULL DEFAULT 'veg',
  recipe_json TEXT NOT NULL DEFAULT '{}',
  created_at REAL NOT NULL,
  updated_at REAL NOT NULL,
  retired_at REAL                            -- NULL = living
);
-- One living plant per probe. Retired plants keep their last seat for history, so the
-- index has to exclude them or a re-plant at the same probe would collide.
CREATE UNIQUE INDEX IF NOT EXISTS plant_one_per_seat
  ON plant(seat_id) WHERE seat_id IS NOT NULL AND retired_at IS NULL;
CREATE TABLE IF NOT EXISTS learning_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  seat_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload_json TEXT NOT NULL DEFAULT '{}',
  ts REAL NOT NULL
);
CREATE TABLE IF NOT EXISTS grow_event_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  message TEXT NOT NULL,
  ts REAL NOT NULL
);
CREATE TABLE IF NOT EXISTS device_calibration (
  device_id TEXT NOT NULL,
  cal_type TEXT NOT NULL,
  step_key TEXT NOT NULL,
  measured_value REAL NOT NULL,
  unit TEXT NOT NULL DEFAULT '',
  created_at REAL NOT NULL,
  PRIMARY KEY (device_id, cal_type, step_key)
);
"""

DEFAULT_INVENTORY: list[dict[str, Any]] = [
    {"seat_id": "hub", "role": "hub", "host": "10.42.0.10"},
    {"seat_id": "control", "role": "panel", "host": "10.42.0.11"},
    {"seat_id": "pot1", "role": "pot", "host": "10.42.0.21"},
    {"seat_id": "pot2", "role": "pot", "host": "10.42.0.22"},
    {"seat_id": "heater", "role": "sonoff_heater", "host": "10.42.0.50"},
    {"seat_id": "heatmat", "role": "sonoff_heatmat", "host": "10.42.0.51"},
    {"seat_id": "humidifier", "role": "sonoff_humidifier", "host": "10.42.0.54"},
    {"seat_id": "dehumidifier", "role": "sonoff_dehumidifier", "host": "10.42.0.55"},
    {"seat_id": "ac", "role": "appliance", "in_service": False},
    {"seat_id": "mister", "role": "appliance", "in_service": False},
    {"seat_id": "tank", "role": "appliance", "in_service": False},
]

DEFAULT_SETTINGS: dict[str, str] = {
    "ap_ssid": "DSC-Brain",
    "ap_psk": "Digital1",
    "ap_channel": "6",
    "ollama_base_url": "",
    "ollama_model": "",
    "cannalib_api_url": "http://192.168.86.2:8790",
    "cannalib_api_key": "",
    "cannalib_use_local_fallback": "true",
    "zigbee_permit_join": "false",
    "leaf_offset_c": "2",
    "kit_commissioned": "false",
    "kit_setup_phase": "welcome",
    "kit_setup_debt": "[]",
    # ESPHome toolchain (Pi venv — no Home Assistant / Docker in the path).
    # Empty values resolve to defaults in esphome_toolchain.py / esphome_jobs.py.
    "esphome_bin": "",
    "esphome_project_dir": "",
    # Browser link shown in Settings (operator's LAN view of the dashboard).
    "esphome_dashboard_url": "http://dsc-brain.local:6052",
    # brain -> dashboard HTTP base. Empty = DSC_ESPHOME_DASHBOARD_API env, else the
    # host `dsc-esphome-dashboard` unit at http://host.docker.internal:6052 (the
    # legacy dsc-hub-esphome container name is only a runtime fallback now).
    "esphome_dashboard_api": "",
    "esphome_fleet_ota_prompt": "true",
    "last_built_esphome": "",
    # fleet_history grows ~1 row per numeric metric per seat per poll (~2s).
    # Rows older than this are pruned (best-effort, throttled). 0 disables.
    "fleet_history_retention_days": "45",
    # Manual irrigation shot length (s) for Root › Shots; irrigact caps it.
    "irrigation_shot_s": "2",
}


def connect(db_path: Path | None = None) -> sqlite3.Connection:
    if db_path is None:
        base = Path(os.environ.get("DSC_DATA", str(_default_brain)))
        path = base / "dsc_ops.sqlite3"
    else:
        path = db_path
    conn = open_db(path)
    ensure_schema(conn, "settings", SETTINGS_SCHEMA)
    return conn


def init_settings_db(db_path: Path | None = None) -> None:
    conn = connect(db_path)
    for key, value in DEFAULT_SETTINGS.items():
        conn.execute(
            "INSERT INTO settings(key, value) VALUES(?, ?) ON CONFLICT(key) DO NOTHING",
            (key, value),
        )
    for row in DEFAULT_INVENTORY:
        in_svc = 1 if row.get("in_service", True) else 0
        conn.execute(
            """
            INSERT INTO fleet_inventory(seat_id, role, in_service, host, mac, api_key, extra_json)
            VALUES(?, ?, ?, ?, NULL, NULL, '{}')
            ON CONFLICT(seat_id) DO NOTHING
            """,
            (row["seat_id"], row["role"], in_svc, row.get("host")),
        )
    # pot3 and pot4 are gone (2026-09-10) — the hardware no longer exists. The two earlier
    # gates only forced them out of service, which left them on the Fleet page for ever as
    # seats that would never come back. This deletes them instead. One-shot, because an
    # operator may legitimately re-add a third pot later and a re-seeding delete would keep
    # eating it.
    if get_setting("pot34_removed_gate", "", db_path) != "applied":
        conn.execute("DELETE FROM fleet_inventory WHERE seat_id IN ('pot3','pot4')")
        conn.execute(
            "INSERT INTO settings(key, value) VALUES('pot34_removed_gate', 'applied') "
            "ON CONFLICT(key) DO UPDATE SET value='applied'"
        )
    conn.execute("DELETE FROM fleet_inventory WHERE seat_id='bridge'")
    conn.execute(
        """
        UPDATE settings SET value='Digital1'
        WHERE key='ap_psk' AND (value='' OR value='changeme-dsc-brain')
        """
    )
    conn.commit()
    conn.close()
    # Give every existing plant its own identity. Runs after the schema is committed and
    # is a no-op once `plant` holds anything, so a normal boot costs one COUNT(*).
    migrate_roster_to_plants(db_path)


def get_setting(key: str, default: str = "", db_path: Path | None = None) -> str:
    conn = connect(db_path)
    row = conn.execute("SELECT value FROM settings WHERE key=?", (key,)).fetchone()
    conn.close()
    return row["value"] if row else default


def set_setting(key: str, value: str, db_path: Path | None = None) -> None:
    conn = connect(db_path)
    conn.execute(
        "INSERT INTO settings(key, value) VALUES(?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",
        (key, value),
    )
    conn.commit()
    conn.close()


def get_all_settings(db_path: Path | None = None) -> dict[str, str]:
    conn = connect(db_path)
    rows = conn.execute("SELECT key, value FROM settings").fetchall()
    conn.close()
    return {r["key"]: r["value"] for r in rows}


# Keys returned by GET /settings — internal HA helper dumps stay in sqlite only.
_SETTINGS_RESPONSE_STRIP = frozenset(
    {
        "compose_helpers_json",
        "plant_roster_slots_json",
        # served via /settings/automations, not the generic settings blob
        "automation_rules",
        "automation_rules_state",
        # S3 blobs — each has its own route
        "alert_prefs_json",
        "automation_defaults_json",
        "journal_retention_json",
        "hub_tunables_json",
    }
)


def public_settings(db_path: Path | None = None) -> dict[str, Any]:
    """Settings safe for the SPA: mask secrets and strip internal helper blobs."""
    raw = get_all_settings(db_path)
    out: dict[str, Any] = {}
    for key, value in raw.items():
        if key in _SETTINGS_RESPONSE_STRIP:
            continue
        out[key] = value
    out["ap_psk_set"] = bool(raw.get("ap_psk"))
    out["ap_psk"] = ""
    return out


def list_inventory(db_path: Path | None = None) -> list[dict[str, Any]]:
    conn = connect(db_path)
    rows = conn.execute(
        "SELECT seat_id, role, in_service, host, mac, api_key, extra_json FROM fleet_inventory ORDER BY seat_id"
    ).fetchall()
    conn.close()
    out: list[dict[str, Any]] = []
    for r in rows:
        item = dict(r)
        item["in_service"] = bool(item["in_service"])
        item["extra"] = json.loads(item.pop("extra_json") or "{}")
        out.append(item)
    return out


def upsert_inventory(
    seat_id: str,
    patch: dict[str, Any],
    db_path: Path | None = None,
    *,
    create: bool = False,
) -> dict[str, Any]:
    conn = connect(db_path)
    row = conn.execute(
        "SELECT seat_id, role, in_service, host, mac, api_key, extra_json FROM fleet_inventory WHERE seat_id=?",
        (seat_id,),
    ).fetchone()
    if not row:
        if not create:
            conn.close()
            raise KeyError(seat_id)
        role = str(patch.pop("role", "extra"))
        in_svc = 1 if patch.get("in_service", True) else 0
        host = patch.get("host")
        mac = patch.get("mac")
        api_key = patch.get("api_key")
        extra = dict(patch.get("extra") or {})
        conn.execute(
            """
            INSERT INTO fleet_inventory(seat_id, role, in_service, host, mac, api_key, extra_json)
            VALUES(?, ?, ?, ?, ?, ?, ?)
            """,
            (seat_id, role, in_svc, host, mac, api_key, json.dumps(extra)),
        )
        conn.commit()
        conn.close()
        result = {
            "seat_id": seat_id,
            "role": role,
            "in_service": bool(in_svc),
            "host": host,
            "mac": mac,
            "api_key": api_key,
            "extra": extra,
        }
        if "in_service" in patch:
            try:
                from .hub_native import sync_hub_in_service_sync

                sync_hub_in_service_sync(seat_id, result["in_service"])
            except Exception:  # noqa: BLE001
                pass
        return result
    data = dict(row)
    extra = json.loads(data["extra_json"] or "{}")
    if "host" in patch:
        data["host"] = patch["host"]
    if "mac" in patch:
        data["mac"] = patch["mac"]
    if "api_key" in patch:
        data["api_key"] = patch["api_key"]
    if "in_service" in patch:
        data["in_service"] = 1 if patch["in_service"] else 0
    if "extra" in patch and isinstance(patch["extra"], dict):
        extra.update(patch["extra"])
    conn.execute(
        """
        UPDATE fleet_inventory SET in_service=?, host=?, mac=?, api_key=?, extra_json=?
        WHERE seat_id=?
        """,
        (data["in_service"], data["host"], data["mac"], data["api_key"], json.dumps(extra), seat_id),
    )
    conn.commit()
    conn.close()
    data["in_service"] = bool(data["in_service"])
    data["extra"] = extra
    data.pop("extra_json", None)
    if "in_service" in patch:
        try:
            from .hub_native import sync_hub_in_service_sync

            sync_hub_in_service_sync(seat_id, data["in_service"])
        except Exception:  # noqa: BLE001
            pass
    return data


_HISTORY_PRUNE_INTERVAL_S = 3600.0
_last_history_prune: float = 0.0


def history_retention_days(db_path: Path | None = None) -> int:
    try:
        return int(float(get_setting("fleet_history_retention_days", "45", db_path)))
    except (TypeError, ValueError):
        return 45


def prune_fleet_history(
    db_path: Path | None = None,
    *,
    now: float | None = None,
    retention_days: int | None = None,
) -> int:
    """Delete fleet_history rows older than the retention window. Returns the
    row count removed. retention_days <= 0 disables pruning (returns 0)."""
    days = history_retention_days(db_path) if retention_days is None else retention_days
    if days <= 0:
        return 0
    cutoff = (now or time.time()) - days * 86400.0
    conn = connect(db_path)
    cur = conn.execute("DELETE FROM fleet_history WHERE ts < ?", (cutoff,))
    conn.commit()
    removed = cur.rowcount if cur.rowcount is not None else 0
    conn.close()
    return removed


def fleet_history_stats(db_path: Path | None = None) -> dict[str, Any]:
    conn = connect(db_path)
    row = conn.execute(
        "SELECT COUNT(*) AS rows, MIN(ts) AS oldest_ts, MAX(ts) AS newest_ts FROM fleet_history"
    ).fetchone()
    conn.close()
    return {
        "rows": int(row["rows"] or 0),
        "oldest_ts": float(row["oldest_ts"]) if row["oldest_ts"] is not None else None,
        "newest_ts": float(row["newest_ts"]) if row["newest_ts"] is not None else None,
        "retention_days": history_retention_days(db_path),
    }


def record_history(
    seat_id: str,
    metric: str,
    value: float | None,
    ts: float | None = None,
    db_path: Path | None = None,
) -> None:
    conn = connect(db_path)
    conn.execute(
        "INSERT INTO fleet_history(seat_id, metric, value, ts) VALUES(?, ?, ?, ?)",
        (seat_id, metric, value, ts or time.time()),
    )
    conn.commit()
    conn.close()

    global _last_history_prune
    nowt = time.time()
    if nowt - _last_history_prune >= _HISTORY_PRUNE_INTERVAL_S:
        _last_history_prune = nowt
        try:
            prune_fleet_history(db_path, now=nowt)
        except Exception:  # noqa: BLE001 — history pruning must never break a write
            pass


def list_history(
    seat_id: str,
    metric: str,
    since_ts: float,
    limit: int = 2000,
    db_path: Path | None = None,
) -> list[dict[str, Any]]:
    """Return history points newest-first. Keeps the newest `limit` samples in range."""
    conn = connect(db_path)
    rows = conn.execute(
        """
        SELECT value, ts FROM fleet_history
        WHERE seat_id=? AND metric=? AND ts>=?
        ORDER BY ts DESC
        LIMIT ?
        """,
        (seat_id, metric, since_ts, limit),
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def list_history_bucketed(
    seat_id: str,
    metric: str,
    since_ts: float,
    max_points: int = 720,
    until_ts: float | None = None,
    db_path: Path | None = None,
) -> list[dict[str, Any]]:
    """Every sample in [since_ts, until_ts] reduced to at most `max_points` buckets of
    equal width, oldest-first. A bucket carries the mean value and its mid time; a
    binary metric (every sample 0 or 1) rounds so on/off strips stay crisp. Unlike
    `list_history`, a long window never collapses to the newest samples — the whole
    span is represented, which is what a 7-day or 30-day chart needs."""
    until = float(until_ts if until_ts is not None else time.time())
    if max_points < 1:
        max_points = 1
    conn = connect(db_path)
    rows = conn.execute(
        """
        SELECT value, ts FROM fleet_history
        WHERE seat_id=? AND metric=? AND ts>=? AND ts<=? AND value IS NOT NULL
        ORDER BY ts ASC
        """,
        (seat_id, metric, since_ts, until),
    ).fetchall()
    conn.close()
    pts = [(float(r["ts"]), float(r["value"])) for r in rows]
    if len(pts) <= max_points:
        return [{"ts": t, "value": v} for t, v in pts]
    span = max(until - since_ts, 1e-6)
    width = span / max_points
    binary = all(v in (0.0, 1.0) for _, v in pts)
    buckets: dict[int, list[float]] = {}
    for t, v in pts:
        i = min(int((t - since_ts) / width), max_points - 1)
        buckets.setdefault(i, []).append(v)
    out: list[dict[str, Any]] = []
    for i in sorted(buckets):
        vals = buckets[i]
        mean = sum(vals) / len(vals)
        out.append({"ts": since_ts + (i + 0.5) * width, "value": float(round(mean)) if binary else mean})
    return out


_LAST_RECORDED: dict[tuple[str, str], tuple[float, float]] = {}


def history_has_rows(seat_id: str, metric: str, db_path: Path | None = None) -> bool:
    conn = connect(db_path)
    row = conn.execute(
        "SELECT 1 FROM fleet_history WHERE seat_id=? AND metric=? LIMIT 1", (seat_id, metric)
    ).fetchone()
    conn.close()
    return row is not None


def last_reading_ts(seat_id: str, metric: str, db_path: Path | None = None) -> float | None:
    """Newest ts with a non-NULL value for this series (when the sensor last produced a
    real reading), or None if it never has. Powers the 'went dark' timer."""
    conn = connect(db_path)
    row = conn.execute(
        "SELECT MAX(ts) FROM fleet_history WHERE seat_id=? AND metric=? AND value IS NOT NULL",
        (seat_id, metric),
    ).fetchone()
    conn.close()
    return float(row[0]) if row and row[0] is not None else None


def last_change_ts(
    seat_id: str, metric: str, current_value: float, *, eps: float = 1e-6, db_path: Path | None = None
) -> float | None:
    """Newest ts whose value differs from ``current_value`` — i.e. the last time this
    series actually MOVED. A probe whose reading is frozen (dead Modbus republishing its
    last value) went dark at this instant. None if it has only ever held ``current_value``."""
    conn = connect(db_path)
    row = conn.execute(
        "SELECT MAX(ts) FROM fleet_history WHERE seat_id=? AND metric=? "
        "AND value IS NOT NULL AND ABS(value - ?) > ?",
        (seat_id, metric, float(current_value), float(eps)),
    ).fetchone()
    conn.close()
    return float(row[0]) if row and row[0] is not None else None


def record_history_throttled(
    seat_id: str,
    metric: str,
    value: float,
    ts: float,
    *,
    heartbeat_s: float = 300.0,
    db_path: Path | None = None,
) -> bool:
    """Record only when the value changed or `heartbeat_s` has passed — for slow
    state (switches, setpoints, computed flags) that would otherwise add a row per
    2-second poll. Returns True when a row was written."""
    key = (seat_id, metric)
    prev = _LAST_RECORDED.get(key)
    if prev is not None and prev[0] == value and ts - prev[1] < heartbeat_s:
        return False
    record_history(seat_id, metric, value, ts, db_path)
    _LAST_RECORDED[key] = (value, ts)
    return True


def _plant_row(r: Any) -> dict[str, Any]:
    """The shape every existing reader expects, plus the plant's own id."""
    item = dict(r)
    recipe = json.loads(item.pop("recipe_json") or "{}")
    item["recipe"] = recipe
    item["tent"] = recipe.get("tent") or "unassigned"
    item["sprout_date"] = recipe.get("sprout_date") or ""
    item["growth_stage"] = recipe.get("growth_stage") or item.get("stage")
    return item


def _new_plant_id(seat_id: str, recipe: dict[str, Any], created_at: float) -> str:
    """A plant's identity. NOT the seat — that is the mistake being undone.

    Same `plant:<uuid>` format `plant_probe.ensure_plant_uuid` already mints for compose
    roster slots, so the durable record and the slot/helper layer share one id rather than
    inventing a second identity scheme for the same plant.
    """
    return f"plant:{uuid.uuid4()}"


def _adopt_slot_plant_uuid(recipe: dict[str, Any]) -> str | None:
    """Reuse the uuid the compose slot already minted for this plant, if it has one.

    Late import: compose_store reads settings, so it cannot be imported at module scope.
    """
    try:
        from .compose_store import get_roster_slots
    except Exception:  # noqa: BLE001
        return None
    name = str(recipe.get("nickname") or recipe.get("plant_name") or "").strip().lower()
    strain = str(recipe.get("strain_display") or "").strip().lower()
    if not name and not strain:
        return None
    try:
        for slot in get_roster_slots():
            uid = str(slot.get("plant_uuid") or "").strip()
            if not uid:
                continue
            if str(slot.get("nickname") or "").strip().lower() == name or (
                strain and str(slot.get("strain") or "").strip().lower() == strain
            ):
                return uid
    except Exception:  # noqa: BLE001
        return None
    return None


def migrate_roster_to_plants(db_path: Path | None = None) -> int:
    """Give every existing plant its own identity. One-shot; returns rows migrated.

    `roster` is left exactly as it was — this reads from it and writes a copy — so a bad
    migration can be rolled back by pointing the readers back at it.
    """
    conn = connect(db_path)
    try:
        already = conn.execute("SELECT COUNT(*) AS n FROM plant").fetchone()["n"]
        if already:
            return 0
        rows = conn.execute(
            "SELECT seat_id, strain_id, stage, recipe_json, updated_at FROM roster ORDER BY seat_id"
        ).fetchall()
        n = 0
        for r in rows:
            recipe = json.loads(r["recipe_json"] or "{}")
            # Sprout date is the plant's real birthday when we have it; the roster row's
            # updated_at is only when someone last touched the record.
            created = r["updated_at"]
            sprout = str(recipe.get("sprout_date") or "").strip()
            if sprout:
                try:
                    created = datetime.datetime.fromisoformat(sprout).timestamp()
                except ValueError:
                    pass
            conn.execute(
                """
                INSERT INTO plant(plant_id, seat_id, strain_id, stage, recipe_json,
                                  created_at, updated_at, retired_at)
                VALUES(?, ?, ?, ?, ?, ?, ?, NULL)
                """,
                (
                    _adopt_slot_plant_uuid(recipe) or _new_plant_id(r["seat_id"], recipe, created),
                    r["seat_id"],
                    r["strain_id"],
                    r["stage"],
                    r["recipe_json"],
                    created,
                    r["updated_at"],
                ),
            )
            n += 1
        conn.commit()
        return n
    finally:
        conn.close()


def list_roster(db_path: Path | None = None) -> list[dict[str, Any]]:
    """Living, placed plants keyed by the probe they sit at — the historical shape."""
    conn = connect(db_path)
    rows = conn.execute(
        """
        SELECT plant_id, seat_id, strain_id, stage, recipe_json, updated_at
        FROM plant WHERE retired_at IS NULL AND seat_id IS NOT NULL ORDER BY seat_id
        """
    ).fetchall()
    conn.close()
    return [_plant_row(r) for r in rows]


def list_plants(include_retired: bool = False, db_path: Path | None = None) -> list[dict[str, Any]]:
    """Every plant, placed or not — what `roster` could never answer."""
    conn = connect(db_path)
    where = "" if include_retired else "WHERE retired_at IS NULL"
    rows = conn.execute(
        f"""
        SELECT plant_id, seat_id, strain_id, stage, recipe_json, created_at, updated_at, retired_at
        FROM plant {where} ORDER BY created_at
        """
    ).fetchall()
    conn.close()
    return [_plant_row(r) for r in rows]


def set_plant_seat(plant_id: str, seat_id: str | None, db_path: Path | None = None) -> dict[str, Any]:
    """Place a plant at a probe, or take it off one (seat_id=None).

    Storage-level. `plant_probe.move_plant` is the operator-facing move that also carries
    the helpers and the compose slot; this is what durably records where it ended up.

    The operation `roster` made impossible: there, the seat WAS the plant's identity, so
    moving it meant deleting one row and inventing another with no shared history.
    """
    conn = connect(db_path)
    try:
        row = conn.execute("SELECT * FROM plant WHERE plant_id=?", (plant_id,)).fetchone()
        if not row:
            raise ValueError(f"no plant {plant_id}")
        if row["retired_at"] is not None:
            raise ValueError("that plant is retired")
        if seat_id:
            clash = conn.execute(
                "SELECT plant_id FROM plant WHERE seat_id=? AND retired_at IS NULL AND plant_id<>?",
                (seat_id, plant_id),
            ).fetchone()
            if clash:
                raise ValueError(f"{seat_id} already holds {clash['plant_id']}")
        conn.execute(
            "UPDATE plant SET seat_id=?, updated_at=? WHERE plant_id=?",
            (seat_id, time.time(), plant_id),
        )
        conn.commit()
        return _plant_row(conn.execute("SELECT plant_id, seat_id, strain_id, stage, recipe_json, updated_at FROM plant WHERE plant_id=?", (plant_id,)).fetchone())
    finally:
        conn.close()


def upsert_roster(seat_id: str, patch: dict[str, Any], db_path: Path | None = None) -> dict[str, Any]:
    """Create or update the living plant at a probe.

    Seat-addressed because that is how the desks speak ("the plant in probe 1"), but it
    resolves to a plant with its own id — so the same plant survives being moved.
    """
    conn = connect(db_path)
    row = conn.execute(
        """
        SELECT plant_id, seat_id, strain_id, stage, recipe_json, updated_at
        FROM plant WHERE seat_id=? AND retired_at IS NULL
        """,
        (seat_id,),
    ).fetchone()
    now = time.time()
    if row:
        data = dict(row)
        recipe = json.loads(data["recipe_json"] or "{}")
    else:
        data = {"plant_id": None, "seat_id": seat_id, "strain_id": None, "stage": "veg", "updated_at": now}
        recipe = {}
    if "strain_id" in patch:
        data["strain_id"] = patch["strain_id"]
    if "stage" in patch:
        data["stage"] = patch["stage"]
    if "recipe" in patch and isinstance(patch["recipe"], dict):
        recipe.update(patch["recipe"])
    data["updated_at"] = now
    if data.get("plant_id"):
        conn.execute(
            """
            UPDATE plant SET strain_id=?, stage=?, recipe_json=?, updated_at=?
            WHERE plant_id=?
            """,
            (data["strain_id"], data["stage"], json.dumps(recipe), now, data["plant_id"]),
        )
    else:
        data["plant_id"] = _new_plant_id(seat_id, recipe, now)
        conn.execute(
            """
            INSERT INTO plant(plant_id, seat_id, strain_id, stage, recipe_json,
                              created_at, updated_at, retired_at)
            VALUES(?, ?, ?, ?, ?, ?, ?, NULL)
            """,
            (data["plant_id"], seat_id, data["strain_id"], data["stage"], json.dumps(recipe), now, now),
        )
    conn.commit()
    conn.close()
    data["recipe"] = recipe
    data.pop("recipe_json", None)
    data["tent"] = recipe.get("tent") or "unassigned"
    data["sprout_date"] = recipe.get("sprout_date") or ""
    data["growth_stage"] = recipe.get("growth_stage") or data.get("stage")
    return data


def delete_roster(seat_id: str, db_path: Path | None = None) -> bool:
    """Retire the plant at a probe. Both callers are retirements, not deletions.

    It used to DELETE the row, so retiring a plant destroyed the only record it had ever
    existed — the grow log kept the events, but nothing kept the plant. It is now marked
    retired and unplaced: the probe is free, and the plant is still there to be looked up.
    """
    conn = connect(db_path)
    cur = conn.execute(
        "UPDATE plant SET retired_at=?, seat_id=NULL, updated_at=? WHERE seat_id=? AND retired_at IS NULL",
        (time.time(), time.time(), seat_id),
    )
    conn.commit()
    conn.close()
    return cur.rowcount > 0


def append_learning(
    seat_id: str,
    event_type: str,
    payload: dict[str, Any] | None = None,
    db_path: Path | None = None,
) -> None:
    conn = connect(db_path)
    conn.execute(
        "INSERT INTO learning_log(seat_id, event_type, payload_json, ts) VALUES(?, ?, ?, ?)",
        (seat_id, event_type, json.dumps(payload or {}), time.time()),
    )
    conn.commit()
    conn.close()


def list_learning(limit: int = 50, db_path: Path | None = None) -> list[dict[str, Any]]:
    conn = connect(db_path)
    rows = conn.execute(
        "SELECT id, seat_id, event_type, payload_json, ts FROM learning_log ORDER BY ts DESC LIMIT ?",
        (limit,),
    ).fetchall()
    conn.close()
    out: list[dict[str, Any]] = []
    for r in rows:
        item = dict(r)
        item["payload"] = json.loads(item.pop("payload_json") or "{}")
        out.append(item)
    return out
