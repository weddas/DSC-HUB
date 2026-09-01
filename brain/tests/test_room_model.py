# brain/tests/test_room_model.py
from pathlib import Path

from dsc_brain.room_model import KIT_ROOM_ID, ensure_kit_rooms, room_id_for_space, spaces_for_room


def test_grow_room_parents_both_tents(tmp_path: Path):
    db = tmp_path / "ops.sqlite3"
    rooms = ensure_kit_rooms(db)
    assert any(r["room_id"] == KIT_ROOM_ID for r in rooms)
    kids = spaces_for_room(KIT_ROOM_ID, db_path=db)
    assert set(kids) == {"2x4", "4x8"}
    assert room_id_for_space("4x8", db_path=db) == KIT_ROOM_ID
    assert room_id_for_space("2x4", db_path=db) == KIT_ROOM_ID
