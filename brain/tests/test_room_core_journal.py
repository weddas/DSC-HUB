# brain/tests/test_room_core_journal.py
from pathlib import Path

from dsc_brain.dsc_core_journal import add_core_entry, list_core_journal
from dsc_brain.plant_journal import add_plant_entry
from dsc_brain.room_journal import add_room_entry, list_room_journal
from dsc_brain.room_model import KIT_ROOM_ID, ensure_kit_rooms
from dsc_brain.space_journal import add_space_entry


def test_hierarchy_rollup_plant_to_core(tmp_path: Path, monkeypatch):
    db = tmp_path / "ops.sqlite3"
    ensure_kit_rooms(db)
    monkeypatch.setattr(
        "dsc_brain.room_journal.occupant_plant_ids_for_space",
        lambda space_id: ["plant:a"] if space_id == "2x4" else ["plant:b"],
    )
    add_plant_entry("plant:a", None, "Leaf obs 2x4", db_path=db)
    add_plant_entry("plant:b", None, "Leaf obs 4x8", db_path=db)
    add_space_entry("2x4", None, "Tent note 2x4", db_path=db)
    add_space_entry("4x8", None, "Tent note 4x8", db_path=db)
    add_room_entry(KIT_ROOM_ID, None, "Room humidity note", db_path=db)
    add_core_entry(None, "Facility system pulse", source="system", tags=["facility"], db_path=db)

    room = list_room_journal(KIT_ROOM_ID, limit=50, db_path=db)
    provenances = {r.get("provenance") for r in room}
    assert "room" in provenances
    assert "space" in provenances
    assert "plant" in provenances
    notes = " ".join(r["note"] for r in room)
    assert "Tent note 2x4" in notes and "Tent note 4x8" in notes
    assert "Leaf obs" in notes

    core = list_core_journal(limit=80, db_path=db)
    core_notes = " ".join(r["note"] for r in core)
    assert "Facility system pulse" in core_notes
    assert "Room humidity note" in core_notes
    assert any(r.get("provenance") == "core" for r in core)
