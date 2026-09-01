"""Space journal — space-native rows + read-time occupant plant rollup."""

from __future__ import annotations

import json
import sqlite3
import time
from collections.abc import Callable
from pathlib import Path
from typing import Any

from .paths import DEFAULT_DB
from .plant_journal import list_plant_journal


def _connect(db_path: Path | None = None) -> sqlite3.Connection:
    path = db_path or DEFAULT_DB
    path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(path))
    conn.row_factory = sqlite3.Row
    return conn


def init_space_journal_tables(db_path: Path | None = None) -> None:
    with _connect(db_path) as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS space_journal (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              space_id TEXT NOT NULL,
              occurred_at REAL NOT NULL,
              note TEXT NOT NULL DEFAULT '',
              source TEXT NOT NULL DEFAULT 'operator',
              tags_json TEXT NOT NULL DEFAULT '[]',
              created_at REAL NOT NULL
            )
            """
        )
        conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_space_journal_space ON space_journal(space_id, occurred_at DESC)"
        )
        conn.commit()


def add_space_entry(
    space_id: str,
    occurred_at: float | None,
    note: str,
    *,
    source: str = "operator",
    tags: list[str] | None = None,
    db_path: Path | None = None,
) -> dict[str, Any]:
    init_space_journal_tables(db_path)
    sid = str(space_id or "").strip()
    if not sid:
        raise ValueError("space_id required")
    ts = float(occurred_at) if occurred_at is not None else time.time()
    src = str(source or "operator").strip() or "operator"
    if src not in ("operator", "system"):
        src = "operator"
    tag_list = [str(t).strip() for t in (tags or []) if str(t).strip()]
    created = time.time()
    with _connect(db_path) as conn:
        cur = conn.execute(
            """
            INSERT INTO space_journal(space_id, occurred_at, note, source, tags_json, created_at)
            VALUES(?, ?, ?, ?, ?, ?)
            """,
            (sid, ts, str(note or "").strip(), src, json.dumps(tag_list, separators=(",", ":")), created),
        )
        conn.commit()
        row_id = int(cur.lastrowid or 0)
    return {
        "id": row_id,
        "space_id": sid,
        "occurred_at": ts,
        "note": str(note or "").strip(),
        "source": src,
        "tags": tag_list,
        "created_at": created,
        "provenance": "space",
    }


def list_space_native(
    space_id: str,
    *,
    limit: int = 100,
    db_path: Path | None = None,
) -> list[dict[str, Any]]:
    init_space_journal_tables(db_path)
    sid = str(space_id or "").strip()
    with _connect(db_path) as conn:
        rows = conn.execute(
            """
            SELECT id, space_id, occurred_at, note, source, tags_json, created_at
            FROM space_journal WHERE space_id=?
            ORDER BY occurred_at DESC, id DESC
            LIMIT ?
            """,
            (sid, int(limit)),
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
                "space_id": r["space_id"],
                "occurred_at": r["occurred_at"],
                "note": r["note"],
                "source": r["source"],
                "tags": tags,
                "created_at": r["created_at"],
                "provenance": "space",
            }
        )
    return out


OccupantResolver = Callable[[str], list[str]]


def list_space_journal(
    space_id: str,
    *,
    limit: int = 100,
    occupant_plant_ids: list[str] | None = None,
    resolve_occupants: OccupantResolver | None = None,
    db_path: Path | None = None,
) -> list[dict[str, Any]]:
    """Space-native rows plus occupant plant journal rows (read-time collation)."""
    sid = str(space_id or "").strip()
    native = list_space_native(sid, limit=limit, db_path=db_path)
    plant_ids = list(occupant_plant_ids or [])
    if not plant_ids and resolve_occupants is not None:
        plant_ids = list(resolve_occupants(sid) or [])
    rolled: list[dict[str, Any]] = []
    per_plant = max(10, int(limit) // max(1, len(plant_ids) or 1))
    for pid in plant_ids:
        for row in list_plant_journal(pid, limit=per_plant, db_path=db_path):
            rolled.append({**row, "space_id": sid, "provenance": "plant"})
    merged = native + rolled
    merged.sort(key=lambda r: (float(r.get("occurred_at") or 0), int(r.get("id") or 0)), reverse=True)
    return merged[: int(limit)]
