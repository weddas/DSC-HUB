# brain/tests/test_plant_journal.py
from pathlib import Path

from dsc_brain.plant_journal import add_plant_entry, list_plant_journal


def test_plant_journal_follows_plant_id(tmp_path: Path):
    db = tmp_path / "ops.sqlite3"
    a = add_plant_entry("plant-a", 1000.0, "saw nanners — observation only", db_path=db)
    add_plant_entry("plant-b", 1001.0, "other plant", db_path=db)
    rows = list_plant_journal("plant-a", db_path=db)
    assert len(rows) == 1
    assert rows[0]["id"] == a["id"]
    assert rows[0]["provenance"] == "plant"
    assert rows[0]["source"] == "operator"


def test_system_source_allowed(tmp_path: Path):
    db = tmp_path / "ops.sqlite3"
    row = add_plant_entry(
        "plant-a",
        None,
        "Dark-period violation",
        source="system",
        tags=["dark_violation"],
        db_path=db,
    )
    assert row["source"] == "system"
    assert row["tags"] == ["dark_violation"]
