"""Space (tent) + attached equipment — local SoT for photoperiod/energy."""

from __future__ import annotations

import json
import sqlite3
import time
from pathlib import Path
from typing import Any

from .paths import DEFAULT_DB

KIT_SPACES: tuple[dict[str, Any], ...] = (
    {
        "space_id": "4x8",
        "kind": "tent",
        "size_label": "4×8",
        "size_m2": 2.97,
        "extra": {},
    },
    {
        "space_id": "2x4",
        "kind": "tent",
        "size_label": "2×4",
        "size_m2": 0.74,
        "extra": {},
    },
)

# Researched / kit nameplate defaults — operator Update in Settings.
KIT_DEVICE_DEFAULTS: tuple[dict[str, Any], ...] = (
    {
        "space_id": "2x4",
        "device_id": "sf1000",
        "label": "SF1000",
        "watts": 100.0,
        "duty_source": "photoperiod",
        "enabled": True,
    },
    {
        "space_id": "4x8",
        "device_id": "main_fixture",
        "label": "4×8 fixture (nameplate)",
        "watts": 480.0,
        "duty_source": "photoperiod",
        "enabled": True,
    },
)


def _connect(db_path: Path | None = None) -> sqlite3.Connection:
    path = db_path or DEFAULT_DB
    path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(path))
    conn.row_factory = sqlite3.Row
    return conn


def init_space_tables(db_path: Path | None = None) -> None:
    with _connect(db_path) as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS space (
              space_id TEXT PRIMARY KEY,
              kind TEXT NOT NULL DEFAULT 'tent',
              size_label TEXT NOT NULL DEFAULT '',
              size_m2 REAL,
              extra_json TEXT NOT NULL DEFAULT '{}',
              updated_at REAL NOT NULL
            );
            CREATE TABLE IF NOT EXISTS space_device (
              space_id TEXT NOT NULL,
              device_id TEXT NOT NULL,
              label TEXT NOT NULL DEFAULT '',
              watts REAL NOT NULL DEFAULT 0,
              duty_source TEXT NOT NULL DEFAULT 'photoperiod',
              enabled INTEGER NOT NULL DEFAULT 1,
              extra_json TEXT NOT NULL DEFAULT '{}',
              updated_at REAL NOT NULL,
              PRIMARY KEY (space_id, device_id)
            );
            """
        )
        conn.commit()


def list_spaces(db_path: Path | None = None) -> list[dict[str, Any]]:
    init_space_tables(db_path)
    with _connect(db_path) as conn:
        rows = conn.execute(
            "SELECT space_id, kind, size_label, size_m2, extra_json, updated_at FROM space ORDER BY space_id"
        ).fetchall()
    out: list[dict[str, Any]] = []
    for r in rows:
        try:
            extra = json.loads(r["extra_json"] or "{}")
        except json.JSONDecodeError:
            extra = {}
        out.append(
            {
                "space_id": r["space_id"],
                "kind": r["kind"],
                "size_label": r["size_label"],
                "size_m2": r["size_m2"],
                "extra": extra,
                "updated_at": r["updated_at"],
            }
        )
    return out


def ensure_kit_spaces(db_path: Path | None = None) -> list[dict[str, Any]]:
    init_space_tables(db_path)
    now = time.time()
    with _connect(db_path) as conn:
        for spec in KIT_SPACES:
            conn.execute(
                """
                INSERT INTO space(space_id, kind, size_label, size_m2, extra_json, updated_at)
                VALUES(?, ?, ?, ?, ?, ?)
                ON CONFLICT(space_id) DO UPDATE SET
                  kind=excluded.kind,
                  size_label=excluded.size_label,
                  size_m2=excluded.size_m2
                """,
                (
                    spec["space_id"],
                    spec["kind"],
                    spec["size_label"],
                    spec["size_m2"],
                    json.dumps(spec.get("extra") or {}, separators=(",", ":")),
                    now,
                ),
            )
        for dev in KIT_DEVICE_DEFAULTS:
            existing = conn.execute(
                "SELECT 1 FROM space_device WHERE space_id=? AND device_id=?",
                (dev["space_id"], dev["device_id"]),
            ).fetchone()
            if existing:
                continue
            conn.execute(
                """
                INSERT INTO space_device(space_id, device_id, label, watts, duty_source, enabled, extra_json, updated_at)
                VALUES(?, ?, ?, ?, ?, ?, '{}', ?)
                """,
                (
                    dev["space_id"],
                    dev["device_id"],
                    dev["label"],
                    float(dev["watts"]),
                    dev["duty_source"],
                    1 if dev.get("enabled", True) else 0,
                    now,
                ),
            )
        conn.commit()
    return list_spaces(db_path)


def list_space_devices(space_id: str, *, db_path: Path | None = None) -> list[dict[str, Any]]:
    init_space_tables(db_path)
    with _connect(db_path) as conn:
        rows = conn.execute(
            """
            SELECT space_id, device_id, label, watts, duty_source, enabled, extra_json, updated_at
            FROM space_device WHERE space_id=? ORDER BY device_id
            """,
            (str(space_id),),
        ).fetchall()
    out: list[dict[str, Any]] = []
    for r in rows:
        try:
            extra = json.loads(r["extra_json"] or "{}")
        except json.JSONDecodeError:
            extra = {}
        out.append(
            {
                "space_id": r["space_id"],
                "device_id": r["device_id"],
                "label": r["label"],
                "watts": float(r["watts"]),
                "duty_source": r["duty_source"],
                "enabled": bool(r["enabled"]),
                "extra": extra,
                "updated_at": r["updated_at"],
            }
        )
    return out


def upsert_space_device(
    space_id: str,
    device: dict[str, Any],
    *,
    db_path: Path | None = None,
) -> dict[str, Any]:
    init_space_tables(db_path)
    ensure_kit_spaces(db_path)
    device_id = str(device.get("device_id") or "").strip()
    if not device_id:
        raise ValueError("device_id required")
    now = time.time()
    label = str(device.get("label") or device_id)
    watts = float(device.get("watts") or 0.0)
    duty_source = str(device.get("duty_source") or "photoperiod")
    enabled = 1 if device.get("enabled", True) else 0
    extra = device.get("extra") if isinstance(device.get("extra"), dict) else {}
    with _connect(db_path) as conn:
        conn.execute(
            """
            INSERT INTO space_device(space_id, device_id, label, watts, duty_source, enabled, extra_json, updated_at)
            VALUES(?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(space_id, device_id) DO UPDATE SET
              label=excluded.label,
              watts=excluded.watts,
              duty_source=excluded.duty_source,
              enabled=excluded.enabled,
              extra_json=excluded.extra_json,
              updated_at=excluded.updated_at
            """,
            (
                str(space_id),
                device_id,
                label,
                watts,
                duty_source,
                enabled,
                json.dumps(extra, separators=(",", ":")),
                now,
            ),
        )
        conn.commit()
    devices = list_space_devices(space_id, db_path=db_path)
    return next(d for d in devices if d["device_id"] == device_id)
