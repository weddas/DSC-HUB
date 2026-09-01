"""Bubble facility-scoped system journal rows into DSC-Core."""

from __future__ import annotations

from pathlib import Path
from typing import Any

from .dsc_core_journal import add_core_entry
from .room_journal import add_room_entry
from .room_model import KIT_ROOM_ID, room_id_for_space


def bubble_facility_system(
    note: str,
    *,
    tags: list[str] | None = None,
    space_id: str | None = None,
    db_path: Path | None = None,
) -> dict[str, Any]:
    """Write Core (+ room when space maps to a room) for facility-visible system events."""
    tag_list = list(tags or [])
    if "facility" not in tag_list:
        tag_list.append("facility")
    core = add_core_entry(None, note, source="system", tags=tag_list, db_path=db_path)
    room_row = None
    rid = KIT_ROOM_ID
    if space_id:
        rid = room_id_for_space(space_id, db_path=db_path) or KIT_ROOM_ID
    try:
        room_row = add_room_entry(rid, None, note, source="system", tags=tag_list, db_path=db_path)
    except Exception:  # noqa: BLE001
        room_row = None
    return {"core": core, "room": room_row}
