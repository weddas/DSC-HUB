"""Room journal — room-native + read-time child tent (space) rollup."""

from __future__ import annotations

import json
import sqlite3
import time
from pathlib import Path
from typing import Any

from .journal_snapshot import (
    build_journal_fleet_context,
    capture_journal_snapshot,
    ensure_journal_snapshot_column,
    snapshot_from_json,
)
from .paths import DEFAULT_DB
from .room_model import ensure_kit_rooms, spaces_for_room
from .space_journal import list_space_journal
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


def list_room_native(room_id: str, *, limit: int = 100, db_path: Path | None = None) -> list[dict[str, Any]]:
    init_room_journal_tables(db_path)
    rid = str(room_id or "").strip()
    with _connect(db_path) as conn:
        rows = conn.execute(
            """
            SELECT id, room_id, occurred_at, note, source, tags_json, created_at, snapshot_json
            FROM room_journal WHERE room_id=?
            ORDER BY occurred_at DESC, id DESC LIMIT ?
            """,
            (rid, int(limit)),
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
                "room_id": r["room_id"],
                "occurred_at": r["occurred_at"],
                "note": r["note"],
                "source": r["source"],
                "tags": tags,
                "created_at": r["created_at"],
                "provenance": "room",
                "snapshot": snapshot_from_json(r["snapshot_json"]),
            }
        )
    return out


def list_room_journal(
    room_id: str,
    *,
    limit: int = 100,
    db_path: Path | None = None,
) -> list[dict[str, Any]]:
    """Room-native + child tent journals (which already include plant rollups)."""
    ensure_kit_rooms(db_path)
    rid = str(room_id or "").strip()
    native = list_room_native(rid, limit=limit, db_path=db_path)
    rolled: list[dict[str, Any]] = []
    space_ids = spaces_for_room(rid, db_path=db_path)
    per = max(10, int(limit) // max(1, len(space_ids) or 1))
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
    return merged[: int(limit)]
