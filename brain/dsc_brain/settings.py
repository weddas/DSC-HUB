"""Persistent settings + fleet inventory (Pi appliance SoT)."""

from __future__ import annotations

import json
import sqlite3
import time
from pathlib import Path
from typing import Any

from .paths import DEFAULT_DB

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
"""

DEFAULT_INVENTORY: list[dict[str, Any]] = [
    {"seat_id": "hub", "role": "hub", "host": "10.42.0.10"},
    {"seat_id": "control", "role": "panel", "host": "10.42.0.11"},
    {"seat_id": "pot1", "role": "pot", "host": "10.42.0.21"},
    {"seat_id": "pot2", "role": "pot", "host": "10.42.0.22"},
    {"seat_id": "pot3", "role": "pot", "host": "10.42.0.23"},
    {"seat_id": "pot4", "role": "pot", "host": "10.42.0.24"},
    {"seat_id": "heater", "role": "sonoff_heater", "host": "10.42.0.50"},
    {"seat_id": "heatmat", "role": "sonoff_heatmat", "host": "10.42.0.51"},
    {"seat_id": "humidifier", "role": "sonoff_humidifier", "host": "10.42.0.54"},
    {"seat_id": "dehumidifier", "role": "sonoff_dehumidifier", "host": "10.42.0.55"},
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
}


def connect(db_path: Path | None = None) -> sqlite3.Connection:
    path = db_path or DEFAULT_DB
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
        conn.execute(
            """
            INSERT INTO fleet_inventory(seat_id, role, in_service, host, mac, api_key, extra_json)
            VALUES(?, ?, 1, ?, NULL, NULL, '{}')
            ON CONFLICT(seat_id) DO NOTHING
            """,
            (row["seat_id"], row["role"], row.get("host")),
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


def upsert_inventory(seat_id: str, patch: dict[str, Any], db_path: Path | None = None) -> dict[str, Any]:
    conn = connect(db_path)
    row = conn.execute(
        "SELECT seat_id, role, in_service, host, mac, api_key, extra_json FROM fleet_inventory WHERE seat_id=?",
        (seat_id,),
    ).fetchone()
    if not row:
        conn.close()
        raise KeyError(seat_id)
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
    conn = connect(db_path)
    rows = conn.execute(
        """
        SELECT value, ts FROM fleet_history
        WHERE seat_id=? AND metric=? AND ts>=?
        ORDER BY ts ASC
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
        item["recipe"] = json.loads(item.pop("recipe_json") or "{}")
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
