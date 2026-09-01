# brain/tests/test_energy_model.py
from pathlib import Path

from dsc_brain.energy_model import estimate_space_day, suggest_slides
from dsc_brain.space_model import ensure_kit_spaces


def test_estimate_and_suggestions(tmp_path: Path):
    db = tmp_path / "ops.sqlite3"
    ensure_kit_spaces(db)
    est = estimate_space_day("2x4", lights_on="06:00:00", want_hours=12.0, db_path=db)
    assert est["ok"] is True
    assert est["total_cost"] > 0
    assert "Estimate" in est["estimate_label"]
    night = estimate_space_day("2x4", lights_on="22:00:00", want_hours=12.0, db_path=db)
    sugg = suggest_slides("2x4", current_on="06:00:00", want_hours=12.0, db_path=db)
    assert any(s["id"] == "night_heat" for s in sugg)
    assert all(s.get("apply") is False for s in sugg)
    assert night["ok"] is True


def test_unset_lights_on_honest(tmp_path: Path):
    db = tmp_path / "ops.sqlite3"
    ensure_kit_spaces(db)
    est = estimate_space_day("2x4", lights_on="2026-08-29", want_hours=12.0, db_path=db)
    assert est["ok"] is False
