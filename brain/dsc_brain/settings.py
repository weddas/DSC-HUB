"""Persistent settings + fleet inventory (Pi appliance SoT)."""

from __future__ import annotations

import json
import os
import sqlite3
import time
from pathlib import Path
from typing import Any

from .paths import DEFAULT_DB, _default_brain

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
    {"seat_id": "pot3", "role": "pot", "host": "10.42.0.23", "in_service": False},
    {"seat_id": "pot4", "role": "pot", "host": "10.42.0.24", "in_service": False},
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
}


def connect(db_path: Path | None = None) -> sqlite3.Connection:
    if db_path is None:
        base = Path(os.environ.get("DSC_DATA", str(_default_brain)))
        path = base / "dsc_ops.sqlite3"
    else:
        path = db_path
    path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(path)
    conn.row_factory = sqlite3.Row
    conn.executescript(SETTINGS_SCHEMA)
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
    if get_setting("pot3_f003_gate", "", db_path) != "applied":
        conn.execute("UPDATE fleet_inventory SET in_service=0 WHERE seat_id='pot3'")
        conn.execute(
            "INSERT INTO settings(key, value) VALUES('pot3_f003_gate', 'applied') "
            "ON CONFLICT(key) DO UPDATE SET value='applied'"
        )
    if get_setting("pot4_retired_gate", "", db_path) != "applied":
        conn.execute("UPDATE fleet_inventory SET in_service=0 WHERE seat_id='pot4'")
        conn.execute(
            "INSERT INTO settings(key, value) VALUES('pot4_retired_gate', 'applied') "
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
_SETTINGS_RESPONSE_STRIP = frozenset({"compose_helpers_json", "plant_roster_slots_json"})


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


def list_roster(db_path: Path | None = None) -> list[dict[str, Any]]:
    conn = connect(db_path)
    rows = conn.execute(
        "SELECT seat_id, strain_id, stage, recipe_json, updated_at FROM roster ORDER BY seat_id"
    ).fetchall()
    conn.close()
    out: list[dict[str, Any]] = []
    for r in rows:
        item = dict(r)
        recipe = json.loads(item.pop("recipe_json") or "{}")
        item["recipe"] = recipe
        item["tent"] = recipe.get("tent") or "unassigned"
        item["sprout_date"] = recipe.get("sprout_date") or ""
        item["growth_stage"] = recipe.get("growth_stage") or item.get("stage")
        out.append(item)
    return out


def upsert_roster(seat_id: str, patch: dict[str, Any], db_path: Path | None = None) -> dict[str, Any]:
    conn = connect(db_path)
    row = conn.execute(
        "SELECT seat_id, strain_id, stage, recipe_json, updated_at FROM roster WHERE seat_id=?",
        (seat_id,),
    ).fetchone()
    now = time.time()
    if row:
        data = dict(row)
        recipe = json.loads(data["recipe_json"] or "{}")
    else:
        data = {"seat_id": seat_id, "strain_id": None, "stage": "veg", "updated_at": now}
        recipe = {}
    if "strain_id" in patch:
        data["strain_id"] = patch["strain_id"]
    if "stage" in patch:
        data["stage"] = patch["stage"]
    if "recipe" in patch and isinstance(patch["recipe"], dict):
        recipe.update(patch["recipe"])
    data["updated_at"] = now
    conn.execute(
        """
        INSERT INTO roster(seat_id, strain_id, stage, recipe_json, updated_at)
        VALUES(?, ?, ?, ?, ?)
        ON CONFLICT(seat_id) DO UPDATE SET
          strain_id=excluded.strain_id,
          stage=excluded.stage,
          recipe_json=excluded.recipe_json,
          updated_at=excluded.updated_at
        """,
        (seat_id, data["strain_id"], data["stage"], json.dumps(recipe), now),
    )
    conn.commit()
    conn.close()
    data["recipe"] = recipe
    data.pop("recipe_json", None)
    return data


def delete_roster(seat_id: str, db_path: Path | None = None) -> bool:
    conn = connect(db_path)
    cur = conn.execute("DELETE FROM roster WHERE seat_id=?", (seat_id,))
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
