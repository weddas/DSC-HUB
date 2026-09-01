"""Room hierarchy under DSC-Core — kit seeds grow_room parenting both tents."""

from __future__ import annotations

import json
import sqlite3
import time
from pathlib import Path
from typing import Any

from .paths import DEFAULT_DB
from .space_model import ensure_kit_spaces, init_space_tables, list_spaces

KIT_ROOM_ID = "grow_room"
KIT_ROOM = {
    "room_id": KIT_ROOM_ID,
    "label": "Grow room",
    "extra": {},
}
KIT_ROOM_SPACES = ("4x8", "2x4")


def _connect(db_path: Path | None = None) -> sqlite3.Connection:
    path = db_path or DEFAULT_DB
    path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(path))
    conn.row_factory = sqlite3.Row
    return conn


def init_room_tables(db_path: Path | None = None) -> None:
    init_space_tables(db_path)
    with _connect(db_path) as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS room (
              room_id TEXT PRIMARY KEY,
              label TEXT NOT NULL DEFAULT '',
              extra_json TEXT NOT NULL DEFAULT '{}',
              updated_at REAL NOT NULL
            )
            """
        )
        cols = {r[1] for r in conn.execute("PRAGMA table_info(space)").fetchall()}
        if "room_id" not in cols:
            conn.execute("ALTER TABLE space ADD COLUMN room_id TEXT")
        conn.commit()


def list_rooms(db_path: Path | None = None) -> list[dict[str, Any]]:
    init_room_tables(db_path)
    with _connect(db_path) as conn:
        rows = conn.execute(
            "SELECT room_id, label, extra_json, updated_at FROM room ORDER BY room_id"
        ).fetchall()
    out: list[dict[str, Any]] = []
    for r in rows:
        try:
            extra = json.loads(r["extra_json"] or "{}")
        except json.JSONDecodeError:
            extra = {}
        out.append(
            {
                "room_id": r["room_id"],
                "label": r["label"],
                "extra": extra,
                "updated_at": r["updated_at"],
                "spaces": spaces_for_room(str(r["room_id"]), db_path=db_path),
            }
        )
    return out


def ensure_kit_rooms(db_path: Path | None = None) -> list[dict[str, Any]]:
    init_room_tables(db_path)
    ensure_kit_spaces(db_path)
    now = time.time()
    with _connect(db_path) as conn:
        conn.execute(
            """
            INSERT INTO room(room_id, label, extra_json, updated_at)
            VALUES(?, ?, ?, ?)
            ON CONFLICT(room_id) DO UPDATE SET
              label=excluded.label
            """,
            (
                KIT_ROOM["room_id"],
                KIT_ROOM["label"],
                json.dumps(KIT_ROOM.get("extra") or {}, separators=(",", ":")),
                now,
            ),
        )
        for sid in KIT_ROOM_SPACES:
            conn.execute(
                "UPDATE space SET room_id=?, updated_at=? WHERE space_id=?",
                (KIT_ROOM_ID, now, sid),
            )
        conn.commit()
    return list_rooms(db_path)


def spaces_for_room(room_id: str, *, db_path: Path | None = None) -> list[str]:
    init_room_tables(db_path)
    with _connect(db_path) as conn:
        rows = conn.execute(
            "SELECT space_id FROM space WHERE room_id=? ORDER BY space_id",
            (str(room_id),),
        ).fetchall()
    return [str(r["space_id"]) for r in rows]


def set_space_room(space_id: str, room_id: str | None, *, db_path: Path | None = None) -> dict[str, Any]:
    init_room_tables(db_path)
    ensure_kit_spaces(db_path)
    now = time.time()
    with _connect(db_path) as conn:
        conn.execute(
            "UPDATE space SET room_id=?, updated_at=? WHERE space_id=?",
            (str(room_id) if room_id else None, now, str(space_id)),
        )
        conn.commit()
    spaces = list_spaces(db_path)
    # list_spaces may not yet expose room_id — return explicit
    return {"space_id": space_id, "room_id": room_id, "updated_at": now}


def room_id_for_space(space_id: str, *, db_path: Path | None = None) -> str | None:
    init_room_tables(db_path)
    with _connect(db_path) as conn:
        row = conn.execute(
            "SELECT room_id FROM space WHERE space_id=?", (str(space_id),)
        ).fetchone()
    if not row:
        return None
    rid = row["room_id"]
    return str(rid) if rid else None
