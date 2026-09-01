"""DSC-Core facility journal — above rooms; system + rollup of all rooms."""

from __future__ import annotations

import json
import sqlite3
import time
from pathlib import Path
from typing import Any

from .paths import DEFAULT_DB
from .room_journal import list_room_journal
from .room_model import ensure_kit_rooms, list_rooms


def _connect(db_path: Path | None = None) -> sqlite3.Connection:
    path = db_path or DEFAULT_DB
    path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(path))
    conn.row_factory = sqlite3.Row
    return conn


def init_core_journal_tables(db_path: Path | None = None) -> None:
    with _connect(db_path) as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS dsc_core_journal (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              occurred_at REAL NOT NULL,
              note TEXT NOT NULL DEFAULT '',
              source TEXT NOT NULL DEFAULT 'operator',
              tags_json TEXT NOT NULL DEFAULT '[]',
              created_at REAL NOT NULL
            )
            """
        )
        conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_dsc_core_journal_ts ON dsc_core_journal(occurred_at DESC)"
        )
        conn.commit()


def add_core_entry(
    occurred_at: float | None,
    note: str,
    *,
    source: str = "operator",
    tags: list[str] | None = None,
    db_path: Path | None = None,
) -> dict[str, Any]:
    init_core_journal_tables(db_path)
    ts = float(occurred_at) if occurred_at is not None else time.time()
    src = str(source or "operator").strip() or "operator"
    if src not in ("operator", "system"):
        src = "operator"
    tag_list = [str(t).strip() for t in (tags or []) if str(t).strip()]
    created = time.time()
    with _connect(db_path) as conn:
        cur = conn.execute(
            """
            INSERT INTO dsc_core_journal(occurred_at, note, source, tags_json, created_at)
            VALUES(?, ?, ?, ?, ?)
            """,
            (ts, str(note or "").strip(), src, json.dumps(tag_list, separators=(",", ":")), created),
        )
        conn.commit()
        row_id = int(cur.lastrowid or 0)
    return {
        "id": row_id,
        "occurred_at": ts,
        "note": str(note or "").strip(),
        "source": src,
        "tags": tag_list,
        "created_at": created,
        "provenance": "core",
    }


def list_core_native(*, limit: int = 100, db_path: Path | None = None) -> list[dict[str, Any]]:
    init_core_journal_tables(db_path)
    with _connect(db_path) as conn:
        rows = conn.execute(
            """
            SELECT id, occurred_at, note, source, tags_json, created_at
            FROM dsc_core_journal
            ORDER BY occurred_at DESC, id DESC LIMIT ?
            """,
            (int(limit),),
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
                "occurred_at": r["occurred_at"],
                "note": r["note"],
                "source": r["source"],
                "tags": tags,
                "created_at": r["created_at"],
                "provenance": "core",
            }
        )
    return out


def list_core_journal(*, limit: int = 100, db_path: Path | None = None) -> list[dict[str, Any]]:
    """Core-native + rolled room journals (tents + plants included via room rollup)."""
    ensure_kit_rooms(db_path)
    native = list_core_native(limit=limit, db_path=db_path)
    rooms = list_rooms(db_path)
    rolled: list[dict[str, Any]] = []
    per = max(10, int(limit) // max(1, len(rooms) or 1))
    for room in rooms:
        rid = str(room.get("room_id") or "")
        if not rid:
            continue
        for row in list_room_journal(rid, limit=per, db_path=db_path):
            rolled.append({**row, "facility": "dsc_core"})
    merged = native + rolled
    merged.sort(key=lambda r: (float(r.get("occurred_at") or 0), int(r.get("id") or 0)), reverse=True)
    return merged[: int(limit)]
