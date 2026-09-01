# brain/tests/test_space_journal.py
from pathlib import Path

from dsc_brain.plant_journal import add_plant_entry, list_plant_journal
from dsc_brain.space_journal import add_space_entry, list_space_journal


def test_space_native_and_occupant_rollup(tmp_path: Path):
    db = tmp_path / "ops.sqlite3"
    add_space_entry("4x8", 2000.0, "tent leak sensor wet", source="system", db_path=db)
    add_plant_entry("p1", 2100.0, "plant note in 4x8", db_path=db)
    add_plant_entry("p2", 2200.0, "other tent plant", db_path=db)

    # Occupants of 4x8 are only p1 — history still on each plant after "move"
    rows = list_space_journal("4x8", occupant_plant_ids=["p1"], db_path=db)
    provenances = {r["provenance"] for r in rows}
    assert "space" in provenances
    assert "plant" in provenances
    plant_rows = [r for r in rows if r["provenance"] == "plant"]
    assert all(r["plant_id"] == "p1" for r in plant_rows)

    # Move: p1 no longer occupant — plant journal unchanged
    after_move = list_space_journal("4x8", occupant_plant_ids=[], db_path=db)
    assert all(r["provenance"] == "space" for r in after_move)
    assert len(list_plant_journal("p1", db_path=db)) == 1
