"""Plant mini journal — follows plant_id for life."""

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
        ensure_journal_snapshot_column(conn, "plant_journal")
        conn.commit()


def add_plant_entry(
    plant_id: str,
    occurred_at: float | None,
    note: str,
    *,
    source: str = "operator",
    tags: list[str] | None = None,
    db_path: Path | None = None,
    fleet: dict[str, Any] | None = None,
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
    fleet_ctx = fleet if fleet is not None else build_journal_fleet_context()
    snapshot = capture_journal_snapshot("plant", pid, fleet_ctx)
    snapshot_raw = json.dumps(snapshot, separators=(",", ":"))
    with _connect(db_path) as conn:
        cur = conn.execute(
            """
            INSERT INTO plant_journal(
              plant_id, occurred_at, note, source, tags_json, created_at, snapshot_json
            )
            VALUES(?, ?, ?, ?, ?, ?, ?)
            """,
            (
                pid,
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
        "plant_id": pid,
        "occurred_at": ts,
        "note": str(note or "").strip(),
        "source": src,
        "tags": tag_list,
        "created_at": created,
        "provenance": "plant",
        "snapshot": snapshot,
    }


def _plant_row_to_dict(r: sqlite3.Row) -> dict[str, Any]:
    try:
        tags = json.loads(r["tags_json"] or "[]")
    except json.JSONDecodeError:
        tags = []
    if not isinstance(tags, list):
        tags = []
    return {
        "id": r["id"],
        "plant_id": r["plant_id"],
        "occurred_at": r["occurred_at"],
        "note": r["note"],
        "source": r["source"],
        "tags": tags,
        "created_at": r["created_at"],
        "provenance": "plant",
        "snapshot": snapshot_from_json(r["snapshot_json"]),
    }


def count_plant_journal(plant_id: str, *, db_path: Path | None = None) -> int:
    init_plant_journal_tables(db_path)
    pid = str(plant_id or "").strip()
    with _connect(db_path) as conn:
        row = conn.execute(
            "SELECT COUNT(*) AS n FROM plant_journal WHERE plant_id=?",
            (pid,),
        ).fetchone()
    return int(row["n"] if row else 0)


def list_plant_journal(
    plant_id: str,
    *,
    limit: int = 50,
    offset: int = 0,
    db_path: Path | None = None,
) -> list[dict[str, Any]]:
    init_plant_journal_tables(db_path)
    pid = str(plant_id or "").strip()
    with _connect(db_path) as conn:
        rows = conn.execute(
            """
            SELECT id, plant_id, occurred_at, note, source, tags_json, created_at, snapshot_json
            FROM plant_journal WHERE plant_id=?
            ORDER BY occurred_at DESC, id DESC
            LIMIT ? OFFSET ?
            """,
            (pid, int(limit), int(offset)),
        ).fetchall()
    return [_plant_row_to_dict(r) for r in rows]


def update_plant_entry(
    plant_id: str,
    entry_id: int,
    *,
    note: str | None = None,
    tags: list[str] | None = None,
    growth_stage: str | None = None,
    db_path: Path | None = None,
) -> dict[str, Any]:
    init_plant_journal_tables(db_path)
    pid = str(plant_id or "").strip()
    eid = int(entry_id)
    with _connect(db_path) as conn:
        row = conn.execute(
            """
            SELECT id, plant_id, occurred_at, note, source, tags_json, created_at, snapshot_json
            FROM plant_journal WHERE id=? AND plant_id=?
            """,
            (eid, pid),
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
        if growth_stage is not None:
            snap = snapshot_from_json(row["snapshot_json"])
            snap["growth_stage"] = str(growth_stage).strip()
            sets.append("snapshot_json=?")
            params.append(json.dumps(snap, separators=(",", ":")))
        if not sets:
            return _plant_row_to_dict(row)
        params.extend([eid, pid])
        conn.execute(
            f"UPDATE plant_journal SET {', '.join(sets)} WHERE id=? AND plant_id=?",
            params,
        )
        conn.commit()
        updated = conn.execute(
            """
            SELECT id, plant_id, occurred_at, note, source, tags_json, created_at, snapshot_json
            FROM plant_journal WHERE id=? AND plant_id=?
            """,
            (eid, pid),
        ).fetchone()
    if updated is None:
        raise ValueError("journal entry not found")
    return _plant_row_to_dict(updated)


def delete_plant_entry(
    plant_id: str,
    entry_id: int,
    *,
    db_path: Path | None = None,
) -> None:
    init_plant_journal_tables(db_path)
    pid = str(plant_id or "").strip()
    eid = int(entry_id)
    with _connect(db_path) as conn:
        row = conn.execute(
            "SELECT source FROM plant_journal WHERE id=? AND plant_id=?",
            (eid, pid),
        ).fetchone()
        if row is None:
            raise ValueError("journal entry not found")
        if str(row["source"] or "") != "operator":
            raise JournalForbiddenError("system journal rows are read-only")
        conn.execute("DELETE FROM plant_journal WHERE id=? AND plant_id=?", (eid, pid))
        conn.commit()
