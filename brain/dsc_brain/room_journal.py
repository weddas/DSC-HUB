"""Room journal — room-native + read-time child tent (space) rollup."""

from __future__ import annotations

import json
import sqlite3
import time
from pathlib import Path
from typing import Any

from .journal_snapshot import (
    JournalForbiddenError,
    build_journal_fleet_context,
    capture_journal_snapshot,
    ensure_journal_snapshot_column,
    snapshot_from_json,
)
from .paths import DEFAULT_DB
from .room_model import ensure_kit_rooms, spaces_for_room
from .space_journal import count_space_journal, list_space_journal
from .space_occupants import occupant_plant_ids_for_space


def _connect(db_path: Path | None = None) -> sqlite3.Connection:
    path = db_path or DEFAULT_DB
    path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(path))
    conn.row_factory = sqlite3.Row
    return conn


def init_room_journal_tables(db_path: Path | None = None) -> None:
    with _connect(db_path) as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS room_journal (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              room_id TEXT NOT NULL,
              occurred_at REAL NOT NULL,
              note TEXT NOT NULL DEFAULT '',
              source TEXT NOT NULL DEFAULT 'operator',
              tags_json TEXT NOT NULL DEFAULT '[]',
              created_at REAL NOT NULL
            )
            """
        )
        conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_room_journal_room ON room_journal(room_id, occurred_at DESC)"
        )
        ensure_journal_snapshot_column(conn, "room_journal")
        conn.commit()


def add_room_entry(
    room_id: str,
    occurred_at: float | None,
    note: str,
    *,
    source: str = "operator",
    tags: list[str] | None = None,
    db_path: Path | None = None,
    fleet: dict[str, Any] | None = None,
) -> dict[str, Any]:
    init_room_journal_tables(db_path)
    rid = str(room_id or "").strip()
    if not rid:
        raise ValueError("room_id required")
    ts = float(occurred_at) if occurred_at is not None else time.time()
    src = str(source or "operator").strip() or "operator"
    if src not in ("operator", "system"):
        src = "operator"
    tag_list = [str(t).strip() for t in (tags or []) if str(t).strip()]
    created = time.time()
    fleet_ctx = fleet if fleet is not None else build_journal_fleet_context()
    snapshot = capture_journal_snapshot("room", rid, fleet_ctx)
    snapshot_raw = json.dumps(snapshot, separators=(",", ":"))
    with _connect(db_path) as conn:
        cur = conn.execute(
            """
            INSERT INTO room_journal(
              room_id, occurred_at, note, source, tags_json, created_at, snapshot_json
            )
            VALUES(?, ?, ?, ?, ?, ?, ?)
            """,
            (
                rid,
                ts,
                str(note or "").strip(),
                src,
                json.dumps(tag_list, separators=(",", ":")),
                created,
                snapshot_raw,
            ),
        )
        conn.commit()
        row_id = int(cur.lastrowid or 0)
    return {
        "id": row_id,
        "room_id": rid,
        "occurred_at": ts,
        "note": str(note or "").strip(),
        "source": src,
        "tags": tag_list,
        "created_at": created,
        "provenance": "room",
        "snapshot": snapshot,
    }


def _room_row_to_dict(r: sqlite3.Row) -> dict[str, Any]:
    try:
        tags = json.loads(r["tags_json"] or "[]")
    except json.JSONDecodeError:
        tags = []
    if not isinstance(tags, list):
        tags = []
    return {
        "id": r["id"],
        "room_id": r["room_id"],
        "occurred_at": r["occurred_at"],
        "note": r["note"],
        "source": r["source"],
        "tags": tags,
        "created_at": r["created_at"],
        "provenance": "room",
        "snapshot": snapshot_from_json(r["snapshot_json"]),
    }


def count_room_native(room_id: str, *, db_path: Path | None = None) -> int:
    init_room_journal_tables(db_path)
    rid = str(room_id or "").strip()
    with _connect(db_path) as conn:
        row = conn.execute(
            "SELECT COUNT(*) AS n FROM room_journal WHERE room_id=?",
            (rid,),
        ).fetchone()
    return int(row["n"] if row else 0)


def list_room_native(
    room_id: str,
    *,
    limit: int = 50,
    offset: int = 0,
    db_path: Path | None = None,
) -> list[dict[str, Any]]:
    init_room_journal_tables(db_path)
    rid = str(room_id or "").strip()
    with _connect(db_path) as conn:
        rows = conn.execute(
            """
            SELECT id, room_id, occurred_at, note, source, tags_json, created_at, snapshot_json
            FROM room_journal WHERE room_id=?
            ORDER BY occurred_at DESC, id DESC LIMIT ? OFFSET ?
            """,
            (rid, int(limit), int(offset)),
        ).fetchall()
    return [_room_row_to_dict(r) for r in rows]


def update_room_entry(
    room_id: str,
    entry_id: int,
    *,
    note: str | None = None,
    tags: list[str] | None = None,
    db_path: Path | None = None,
) -> dict[str, Any]:
    init_room_journal_tables(db_path)
    rid = str(room_id or "").strip()
    eid = int(entry_id)
    with _connect(db_path) as conn:
        row = conn.execute(
            """
            SELECT id, room_id, occurred_at, note, source, tags_json, created_at, snapshot_json
            FROM room_journal WHERE id=? AND room_id=?
            """,
            (eid, rid),
        ).fetchone()
        if row is None:
            raise ValueError("journal entry not found")
        if str(row["source"] or "") != "operator":
            raise JournalForbiddenError("system journal rows are read-only")
        sets: list[str] = []
        params: list[Any] = []
        if note is not None:
            sets.append("note=?")
            params.append(str(note).strip())
        if tags is not None:
            tag_list = [str(t).strip() for t in tags if str(t).strip()]
            sets.append("tags_json=?")
            params.append(json.dumps(tag_list, separators=(",", ":")))
        if not sets:
            return _room_row_to_dict(row)
        params.extend([eid, rid])
        conn.execute(
            f"UPDATE room_journal SET {', '.join(sets)} WHERE id=? AND room_id=?",
            params,
        )
        conn.commit()
        updated = conn.execute(
            """
            SELECT id, room_id, occurred_at, note, source, tags_json, created_at, snapshot_json
            FROM room_journal WHERE id=? AND room_id=?
            """,
            (eid, rid),
        ).fetchone()
    if updated is None:
        raise ValueError("journal entry not found")
    return _room_row_to_dict(updated)


def delete_room_entry(
    room_id: str,
    entry_id: int,
    *,
    db_path: Path | None = None,
) -> None:
    init_room_journal_tables(db_path)
    rid = str(room_id or "").strip()
    eid = int(entry_id)
    with _connect(db_path) as conn:
        row = conn.execute(
            "SELECT source FROM room_journal WHERE id=? AND room_id=?",
            (eid, rid),
        ).fetchone()
        if row is None:
            raise ValueError("journal entry not found")
        if str(row["source"] or "") != "operator":
            raise JournalForbiddenError("system journal rows are read-only")
        conn.execute("DELETE FROM room_journal WHERE id=? AND room_id=?", (eid, rid))
        conn.commit()


def list_room_journal(
    room_id: str,
    *,
    limit: int = 50,
    offset: int = 0,
    db_path: Path | None = None,
) -> list[dict[str, Any]]:
    """Room-native + child tent journals (which already include plant rollups)."""
    ensure_kit_rooms(db_path)
    rid = str(room_id or "").strip()
    fetch_cap = int(offset) + int(limit)
    native = list_room_native(rid, limit=fetch_cap, db_path=db_path)
    rolled: list[dict[str, Any]] = []
    space_ids = spaces_for_room(rid, db_path=db_path)
    per = max(10, fetch_cap // max(1, len(space_ids) or 1))
    for sid in space_ids:
        for row in list_space_journal(
            sid,
            limit=per,
            resolve_occupants=occupant_plant_ids_for_space,
            db_path=db_path,
        ):
            rolled.append({**row, "room_id": rid})
    merged = native + rolled
    merged.sort(key=lambda r: (float(r.get("occurred_at") or 0), int(r.get("id") or 0)), reverse=True)
    return merged[int(offset) : int(offset) + int(limit)]


def count_room_journal(room_id: str, *, db_path: Path | None = None) -> int:
    ensure_kit_rooms(db_path)
    rid = str(room_id or "").strip()
    total = count_room_native(rid, db_path=db_path)
    for sid in spaces_for_room(rid, db_path=db_path):
        total += count_space_journal(sid, resolve_occupants=occupant_plant_ids_for_space, db_path=db_path)
    return total
