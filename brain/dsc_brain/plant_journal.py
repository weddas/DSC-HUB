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
from .journal_actions import clean_fields, summarise, wants_snapshot
from .paths import default_db, DEFAULT_DB
from .db import open_db, schema_once


def _connect(db_path: Path | None = None) -> sqlite3.Connection:
    path = db_path or default_db()
    return open_db(path)


def init_plant_journal_tables(db_path: Path | None = None) -> None:
    with _connect(db_path) as conn:
        if not schema_once(conn, "plant_journal"):
            return
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
        _ensure_action_columns(conn)
        conn.commit()


def _ensure_action_columns(conn: sqlite3.Connection) -> None:
    """Add ``action``/``fields_json`` to an existing table (Pass S6).

    Additive and idempotent, the same shape as ensure_journal_snapshot_column: journals on
    a live rig predate this and must keep every row they already hold. An old entry reads
    back as action "note" with no fields, which is exactly what it was.
    """
    have = {r["name"] for r in conn.execute("PRAGMA table_info(plant_journal)")}
    if "action" not in have:
        conn.execute("ALTER TABLE plant_journal ADD COLUMN action TEXT NOT NULL DEFAULT 'note'")
    if "fields_json" not in have:
        conn.execute("ALTER TABLE plant_journal ADD COLUMN fields_json TEXT NOT NULL DEFAULT '{}'")


def add_plant_entry(
    plant_id: str,
    occurred_at: float | None,
    note: str,
    *,
    source: str = "operator",
    tags: list[str] | None = None,
    action: str = "note",
    fields: dict[str, Any] | None = None,
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
    act = str(action or "note").strip().lower() or "note"
    clean = clean_fields(act, fields or {})
    # Only freeze the room's state for actions that declare they want it. A bare note does
    # not need 40 sensor readings attached; a feed does.
    if wants_snapshot(act):
        fleet_ctx = fleet if fleet is not None else build_journal_fleet_context()
        snapshot = capture_journal_snapshot("plant", pid, fleet_ctx)
    else:
        snapshot = {}
    snapshot_raw = json.dumps(snapshot, separators=(",", ":"))
    with _connect(db_path) as conn:
        cur = conn.execute(
            """
            INSERT INTO plant_journal(
              plant_id, occurred_at, note, source, tags_json, created_at, snapshot_json,
              action, fields_json
            )
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                pid,
                ts,
                str(note or "").strip(),
                src,
                json.dumps(tag_list, separators=(",", ":")),
                created,
                snapshot_raw,
                act,
                json.dumps(clean, separators=(",", ":")),
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
        "action": act,
        "fields": clean,
        "summary": summarise(act, clean),
    }


def _plant_row_to_dict(r: sqlite3.Row) -> dict[str, Any]:
    try:
        tags = json.loads(r["tags_json"] or "[]")
    except json.JSONDecodeError:
        tags = []
    if not isinstance(tags, list):
        tags = []
    keys = r.keys()
    action = (r["action"] if "action" in keys else None) or "note"
    try:
        fields = json.loads((r["fields_json"] if "fields_json" in keys else None) or "{}")
    except json.JSONDecodeError:
        fields = {}
    if not isinstance(fields, dict):
        fields = {}
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
        "action": action,
        "fields": fields,
        "summary": summarise(action, fields),
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
            SELECT id, plant_id, occurred_at, note, source, tags_json, created_at, snapshot_json,
                   action, fields_json
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
    occurred_at: float | None = None,
    db_path: Path | None = None,
) -> dict[str, Any]:
    init_plant_journal_tables(db_path)
    pid = str(plant_id or "").strip()
    eid = int(entry_id)
    with _connect(db_path) as conn:
        row = conn.execute(
            """
            SELECT id, plant_id, occurred_at, note, source, tags_json, created_at, snapshot_json,
                   action, fields_json
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
        if occurred_at is not None:
            sets.append("occurred_at=?")
            params.append(float(occurred_at))
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
            SELECT id, plant_id, occurred_at, note, source, tags_json, created_at, snapshot_json,
                   action, fields_json
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
