# brain/tests/test_energy_learning.py
from pathlib import Path

from dsc_brain.energy_learning import planning_signal, record_sample


def test_outlier_window_no_planning_signal(tmp_path: Path):
    db = tmp_path / "ops.sqlite3"
    record_sample("2x4", "night_heat", day_key="2026-09-01", estimated_cost=1.0, heater_duty_h=8.0, db_path=db)
    record_sample("2x4", "current", day_key="2026-09-01", estimated_cost=1.2, heater_duty_h=1.0, db_path=db)
    sig = planning_signal("2x4", "night_heat", db_path=db)
    assert sig["planning_signal"] is False
    assert sig["apply"] is False


def test_sticky_norm_raises_planning_signal(tmp_path: Path):
    db = tmp_path / "ops.sqlite3"
    for i in range(5):
        day = f"2026-09-{i+1:02d}"
        record_sample(
            "2x4",
            "night_heat",
            day_key=day,
            estimated_cost=1.0,
            heater_duty_h=10.0,
            db_path=db,
        )
        record_sample(
            "2x4",
            "current",
            day_key=day,
            estimated_cost=1.2,
            heater_duty_h=1.0,
            db_path=db,
        )
    sig = planning_signal("2x4", "night_heat", db_path=db)
    assert sig["planning_signal"] is True
    assert sig["apply"] is False
