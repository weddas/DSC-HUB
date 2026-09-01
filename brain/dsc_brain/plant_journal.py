"""Plant mini journal — follows plant_id for life."""

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


def init_plant_journal_tables(db_path: Path | None = None) -> None:
    with _connect(db_path) as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS plant_journal (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              plant_id TEXT NOT NULL,
              occurred_at REAL NOT NULL,
              note TEXT NOT NULL DEFAULT '',
              source TEXT NOT NULL DEFAULT 'operator',
              tags_json TEXT NOT NULL DEFAULT '[]',
              created_at REAL NOT NULL
            )
            """
        )
        conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_plant_journal_plant ON plant_journal(plant_id, occurred_at DESC)"
        )
        conn.commit()


def add_plant_entry(
    plant_id: str,
    occurred_at: float | None,
    note: str,
    *,
    source: str = "operator",
    tags: list[str] | None = None,
    db_path: Path | None = None,
) -> dict[str, Any]:
    init_plant_journal_tables(db_path)
    pid = str(plant_id or "").strip()
    if not pid:
        raise ValueError("plant_id required")
    ts = float(occurred_at) if occurred_at is not None else time.time()
    src = str(source or "operator").strip() or "operator"
    if src not in ("operator", "system"):
        src = "operator"
    tag_list = [str(t).strip() for t in (tags or []) if str(t).strip()]
    created = time.time()
    with _connect(db_path) as conn:
        cur = conn.execute(
            """
            INSERT INTO plant_journal(plant_id, occurred_at, note, source, tags_json, created_at)
            VALUES(?, ?, ?, ?, ?, ?)
            """,
            (pid, ts, str(note or "").strip(), src, json.dumps(tag_list, separators=(",", ":")), created),
        )
        conn.commit()
        row_id = int(cur.lastrowid or 0)
    return {
        "id": row_id,
        "plant_id": pid,
        "occurred_at": ts,
        "note": str(note or "").strip(),
        "source": src,
        "tags": tag_list,
        "created_at": created,
        "provenance": "plant",
    }


def list_plant_journal(
    plant_id: str,
    *,
    limit: int = 100,
    db_path: Path | None = None,
) -> list[dict[str, Any]]:
    init_plant_journal_tables(db_path)
    pid = str(plant_id or "").strip()
    with _connect(db_path) as conn:
        rows = conn.execute(
            """
            SELECT id, plant_id, occurred_at, note, source, tags_json, created_at
            FROM plant_journal WHERE plant_id=?
            ORDER BY occurred_at DESC, id DESC
            LIMIT ?
            """,
            (pid, int(limit)),
        ).fetchall()
    out: list[dict[str, Any]] = []
    for r in rows:
        try:
            tags = json.loads(r["tags_json"] or "[]")
        except json.JSONDecodeError:
            tags = []
        if not isinstance(tags, list):
            tags = []
        out.append(
            {
                "id": r["id"],
                "plant_id": r["plant_id"],
                "occurred_at": r["occurred_at"],
                "note": r["note"],
                "source": r["source"],
                "tags": tags,
                "created_at": r["created_at"],
                "provenance": "plant",
            }
        )
    return out
