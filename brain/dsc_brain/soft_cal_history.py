"""Soft-cal session history (Pi SQLite) — rebuild in-scope."""

from __future__ import annotations

import json
import sqlite3
import time
from pathlib import Path
from typing import Any

from .paths import DEFAULT_DB


def _connect(db_path: Path | None = None) -> sqlite3.Connection:
    path = db_path or DEFAULT_DB
    path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(path))
    conn.row_factory = sqlite3.Row
    return conn


def init_soft_cal_history(db_path: Path | None = None) -> None:
    with _connect(db_path) as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS soft_cal_sessions (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              ts REAL NOT NULL,
              probe_n INTEGER NOT NULL,
              phase TEXT NOT NULL,
              payload TEXT NOT NULL
            )
            """
        )
        conn.commit()


def record_soft_cal_session(
    probe_n: int,
    phase: str,
    payload: dict[str, Any],
    *,
    db_path: Path | None = None,
) -> dict[str, Any]:
    init_soft_cal_history(db_path)
    ts = time.time()
    with _connect(db_path) as conn:
        cur = conn.execute(
            "INSERT INTO soft_cal_sessions (ts, probe_n, phase, payload) VALUES (?, ?, ?, ?)",
            (ts, int(probe_n), str(phase), json.dumps(payload, separators=(",", ":"))),
        )
        conn.commit()
        return {"id": cur.lastrowid, "ts": ts, "probe_n": probe_n, "phase": phase}


def list_soft_cal_sessions(
    *,
    probe_n: int | None = None,
    limit: int = 50,
    db_path: Path | None = None,
) -> list[dict[str, Any]]:
    init_soft_cal_history(db_path)
    q = "SELECT id, ts, probe_n, phase, payload FROM soft_cal_sessions"
    args: list[Any] = []
    if probe_n is not None:
        q += " WHERE probe_n = ?"
        args.append(int(probe_n))
    q += " ORDER BY ts DESC LIMIT ?"
    args.append(int(limit))
    with _connect(db_path) as conn:
        rows = conn.execute(q, args).fetchall()
    out: list[dict[str, Any]] = []
    for row in rows:
        try:
            payload = json.loads(row["payload"])
        except json.JSONDecodeError:
            payload = {}
        out.append(
            {
                "id": row["id"],
                "ts": row["ts"],
                "probe_n": row["probe_n"],
                "phase": row["phase"],
                "payload": payload,
            }
        )
    return out
