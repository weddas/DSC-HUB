# brain/tests/test_photoperiod_conflict.py
from pathlib import Path

from dsc_brain.photoperiod_conflict import record_dark_violation, space_conflict_banners
from dsc_brain.plant_journal import list_plant_journal
from dsc_brain.space_journal import list_space_native


def test_conflict_suggests_move_never_auto():
    banners = space_conflict_banners(
        "2x4",
        plant_id="plant:test",
        plant_want_hours=12.0,
        space_want_hours=18.0,
        mate_count=1,
    )
    assert len(banners) == 1
    assert banners[0]["suggest_move"]["auto_move"] is False
    assert banners[0]["suggest_move"]["to_space_id"] == "4x8"
    assert banners[0]["auto_apply"] is False


def test_no_conflict_when_aligned():
    assert (
        space_conflict_banners(
            "2x4",
            plant_id="plant:test",
            plant_want_hours=18.0,
            space_want_hours=18.0,
            mate_count=1,
        )
        == []
    )


def test_dark_violation_journals(tmp_path: Path):
    db = tmp_path / "ops.sqlite3"
    record_dark_violation("2x4", "Dark interrupted", plant_id="plant:a", db_path=db)
    assert any("Dark" in r["note"] for r in list_space_native("2x4", db_path=db))
    assert any("Dark" in r["note"] for r in list_plant_journal("plant:a", db_path=db))
