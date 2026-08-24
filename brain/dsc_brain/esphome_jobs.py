"""ESPHome OTA / compile job queue — operator-initiated only."""

from __future__ import annotations

import json
import sqlite3
import time
import uuid
from pathlib import Path
from typing import Any

from .paths import DEFAULT_DB, EXPECTED_FIRMWARE
from .settings import connect, list_inventory

JOB_SCHEMA = """
CREATE TABLE IF NOT EXISTS esphome_jobs (
  job_id TEXT PRIMARY KEY,
  seat_id TEXT NOT NULL,
  action TEXT NOT NULL,
  yaml_name TEXT NOT NULL,
  status TEXT NOT NULL,
  detail TEXT NOT NULL DEFAULT '',
  created_at REAL NOT NULL,
  updated_at REAL NOT NULL
);
"""

SEAT_YAML: dict[str, str] = {
    "hub": "dsc-hub.yaml",
    "control": "dsc-control.yaml",
    "pot1": "dsc-pot1.yaml",
    "pot2": "dsc-pot2.yaml",
    "pot3": "dsc-pot3.yaml",
    "pot4": "dsc-pot4.yaml",
    "heater": "dsc-heater.yaml",
    "heatmat": "dsc-heatmat.yaml",
    "humidifier": "dsc-humidifier.yaml",
    "dehumidifier": "dsc-de-humidifier.yaml",
}


def _ensure_jobs(conn: sqlite3.Connection) -> None:
    conn.executescript(JOB_SCHEMA)


def list_esphome_devices() -> list[dict[str, Any]]:
    """Fleet seats with expected yaml + firmware train."""
    devices: list[dict[str, Any]] = []
    for row in list_inventory():
        seat_id = str(row["seat_id"])
        devices.append(
            {
                "seat_id": seat_id,
                "role": row.get("role"),
                "host": row.get("host"),
                "in_service": row.get("in_service"),
                "yaml": SEAT_YAML.get(seat_id),
                "expected_firmware": EXPECTED_FIRMWARE,
            }
        )
    return devices


def queue_job(seat_id: str, action: str, db_path: Path | None = None) -> dict[str, Any]:
    if action not in {"ota", "compile"}:
        raise ValueError(f"unknown action {action}")
    yaml_name = SEAT_YAML.get(seat_id)
    if not yaml_name:
        raise KeyError(seat_id)
    conn = connect(db_path)
    _ensure_jobs(conn)
    active = conn.execute(
        "SELECT job_id FROM esphome_jobs WHERE status IN ('queued','running') LIMIT 1"
    ).fetchone()
    if active and action == "compile":
        conn.close()
        raise RuntimeError("compile already queued or running — one job at a time on Pi")
    now = time.time()
    job_id = str(uuid.uuid4())
    detail = (
        "Queued — open ESPHome dashboard :6052 or docker exec dsc-hub-esphome "
        f"esphome run {yaml_name} --device <host>"
    )
    conn.execute(
        """
        INSERT INTO esphome_jobs(job_id, seat_id, action, yaml_name, status, detail, created_at, updated_at)
        VALUES(?, ?, ?, ?, 'queued', ?, ?, ?)
        """,
        (job_id, seat_id, action, yaml_name, detail, now, now),
    )
    conn.commit()
    conn.close()
    return get_job(job_id, db_path)


def list_jobs(limit: int = 20, db_path: Path | None = None) -> list[dict[str, Any]]:
    conn = connect(db_path)
    _ensure_jobs(conn)
    rows = conn.execute(
        """
        SELECT job_id, seat_id, action, yaml_name, status, detail, created_at, updated_at
        FROM esphome_jobs ORDER BY created_at DESC LIMIT ?
        """,
        (limit,),
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def get_job(job_id: str, db_path: Path | None = None) -> dict[str, Any]:
    conn = connect(db_path)
    _ensure_jobs(conn)
    row = conn.execute(
        """
        SELECT job_id, seat_id, action, yaml_name, status, detail, created_at, updated_at
        FROM esphome_jobs WHERE job_id=?
        """,
        (job_id,),
    ).fetchone()
    conn.close()
    if not row:
        raise KeyError(job_id)
    return dict(row)
