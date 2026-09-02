"""Space journal — space-native rows + read-time occupant plant rollup."""

from __future__ import annotations

import json
import sqlite3
import time
from collections.abc import Callable
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
from .plant_journal import count_plant_journal, list_plant_journal


OccupantResolver = Callable[[str], list[str]]


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
        ensure_journal_snapshot_column(conn, "space_journal")
        conn.commit()


def add_space_entry(
    space_id: str,
    occurred_at: float | None,
    note: str,
    *,
    source: str = "operator",
    tags: list[str] | None = None,
    db_path: Path | None = None,
    fleet: dict[str, Any] | None = None,
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
    fleet_ctx = fleet if fleet is not None else build_journal_fleet_context()
    snapshot = capture_journal_snapshot("space", sid, fleet_ctx)
    snapshot_raw = json.dumps(snapshot, separators=(",", ":"))
    with _connect(db_path) as conn:
        cur = conn.execute(
            """
            INSERT INTO space_journal(
              space_id, occurred_at, note, source, tags_json, created_at, snapshot_json
            )
            VALUES(?, ?, ?, ?, ?, ?, ?)
            """,
            (
                sid,
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
        "space_id": sid,
        "occurred_at": ts,
        "note": str(note or "").strip(),
        "source": src,
        "tags": tag_list,
        "created_at": created,
        "provenance": "space",
        "snapshot": snapshot,
    }


def _space_row_to_dict(r: sqlite3.Row) -> dict[str, Any]:
    try:
        tags = json.loads(r["tags_json"] or "[]")
    except json.JSONDecodeError:
        tags = []
    if not isinstance(tags, list):
        tags = []
    return {
        "id": r["id"],
        "space_id": r["space_id"],
        "occurred_at": r["occurred_at"],
        "note": r["note"],
        "source": r["source"],
        "tags": tags,
        "created_at": r["created_at"],
        "provenance": "space",
        "snapshot": snapshot_from_json(r["snapshot_json"]),
    }


def count_space_native(space_id: str, *, db_path: Path | None = None) -> int:
    init_space_journal_tables(db_path)
    sid = str(space_id or "").strip()
    with _connect(db_path) as conn:
        row = conn.execute(
            "SELECT COUNT(*) AS n FROM space_journal WHERE space_id=?",
            (sid,),
        ).fetchone()
    return int(row["n"] if row else 0)


def list_space_native(
    space_id: str,
    *,
    limit: int = 50,
    offset: int = 0,
    db_path: Path | None = None,
) -> list[dict[str, Any]]:
    init_space_journal_tables(db_path)
    sid = str(space_id or "").strip()
    with _connect(db_path) as conn:
        rows = conn.execute(
            """
            SELECT id, space_id, occurred_at, note, source, tags_json, created_at, snapshot_json
            FROM space_journal WHERE space_id=?
            ORDER BY occurred_at DESC, id DESC
            LIMIT ? OFFSET ?
            """,
            (sid, int(limit), int(offset)),
        ).fetchall()
    return [_space_row_to_dict(r) for r in rows]


def update_space_entry(
    space_id: str,
    entry_id: int,
    *,
    note: str | None = None,
    tags: list[str] | None = None,
    db_path: Path | None = None,
) -> dict[str, Any]:
    init_space_journal_tables(db_path)
    sid = str(space_id or "").strip()
    eid = int(entry_id)
    with _connect(db_path) as conn:
        row = conn.execute(
            """
            SELECT id, space_id, occurred_at, note, source, tags_json, created_at, snapshot_json
            FROM space_journal WHERE id=? AND space_id=?
            """,
            (eid, sid),
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
            return _space_row_to_dict(row)
        params.extend([eid, sid])
        conn.execute(
            f"UPDATE space_journal SET {', '.join(sets)} WHERE id=? AND space_id=?",
            params,
        )
        conn.commit()
        updated = conn.execute(
            """
            SELECT id, space_id, occurred_at, note, source, tags_json, created_at, snapshot_json
            FROM space_journal WHERE id=? AND space_id=?
            """,
            (eid, sid),
        ).fetchone()
    if updated is None:
        raise ValueError("journal entry not found")
    return _space_row_to_dict(updated)


def delete_space_entry(
    space_id: str,
    entry_id: int,
    *,
    db_path: Path | None = None,
) -> None:
    init_space_journal_tables(db_path)
    sid = str(space_id or "").strip()
    eid = int(entry_id)
    with _connect(db_path) as conn:
        row = conn.execute(
            "SELECT source FROM space_journal WHERE id=? AND space_id=?",
            (eid, sid),
        ).fetchone()
        if row is None:
            raise ValueError("journal entry not found")
        if str(row["source"] or "") != "operator":
            raise JournalForbiddenError("system journal rows are read-only")
        conn.execute("DELETE FROM space_journal WHERE id=? AND space_id=?", (eid, sid))
        conn.commit()


def list_space_journal(
    space_id: str,
    *,
    limit: int = 50,
    offset: int = 0,
    occupant_plant_ids: list[str] | None = None,
    resolve_occupants: OccupantResolver | None = None,
    db_path: Path | None = None,
) -> list[dict[str, Any]]:
    """Space-native rows plus occupant plant journal rows (read-time collation)."""
    sid = str(space_id or "").strip()
    fetch_cap = int(offset) + int(limit)
    native = list_space_native(sid, limit=fetch_cap, db_path=db_path)
    plant_ids = list(occupant_plant_ids or [])
    if not plant_ids and resolve_occupants is not None:
        plant_ids = list(resolve_occupants(sid) or [])
    rolled: list[dict[str, Any]] = []
    per_plant = max(10, fetch_cap // max(1, len(plant_ids) or 1))
    for pid in plant_ids:
        for row in list_plant_journal(pid, limit=per_plant, db_path=db_path):
            rolled.append({**row, "space_id": sid, "provenance": "plant"})
    merged = native + rolled
    merged.sort(key=lambda r: (float(r.get("occurred_at") or 0), int(r.get("id") or 0)), reverse=True)
    return merged[int(offset) : int(offset) + int(limit)]


def count_space_journal(
    space_id: str,
    *,
    occupant_plant_ids: list[str] | None = None,
    resolve_occupants: OccupantResolver | None = None,
    db_path: Path | None = None,
) -> int:
    sid = str(space_id or "").strip()
    plant_ids = list(occupant_plant_ids or [])
    if not plant_ids and resolve_occupants is not None:
        plant_ids = list(resolve_occupants(sid) or [])
    total = count_space_native(sid, db_path=db_path)
    for pid in plant_ids:
        total += count_plant_journal(pid, db_path=db_path)
    return total
