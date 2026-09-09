"""The Calibrate desk has to be able to say whether a calibration is doing anything.

Before this, a stored calibration the curve gate rejected was invisible: the fan fell back
to its nameplate, every airflow number came from the rating, and the desk still showed
"calibrated". The live 2x4 intake had been in that state for days — 5.0/7.5/8.0/9.0 stored
against a 200 CFM fan, silently ignored.

`fan_calibration_summary` reads through the same helpers the live computation uses, so the
desk cannot disagree with the airflow numbers it sits next to.
"""

from __future__ import annotations

from dsc_brain.compose_store import set_helper
from dsc_brain.computed_ops import fan_calibration_summary
from dsc_brain.device_calibration import (
    clear_calibration,
    get_calibration,
    last_calibrated_at,
    set_calibration_step,
)

CLONE = "dsc_cal_cfm_intake_clone"
OUT = "dsc_cal_cfm_out"


def _by_label(summary: list[dict], label: str) -> dict:
    return next(t for t in summary if t["label"] == label)


def _seed_clone_curve(points: dict[str, float], unit: str = "m/s") -> None:
    set_helper("input_number.dsc_cfm_intake_clone_max", 200.0)
    for step, val in points.items():
        set_calibration_step(CLONE, "fan_cfm", step, val, unit)


def test_never_calibrated_says_so(temp_db) -> None:  # noqa: ANN001
    set_helper("input_number.dsc_cfm_out_max", 440.0)
    row = _by_label(fan_calibration_summary(), "OUT exhaust")
    assert row["calibrated"] is False
    assert row["source"] is None
    assert row["last_calibrated_at"] is None
    assert row["steps"] == []
    assert row["in_use"] is False
    assert row["basis"] == "capacity_proxy_nameplate"


def test_a_rejected_calibration_reports_stored_but_not_in_use(temp_db) -> None:  # noqa: ANN001
    # The verbatim live 2x4 capture: rises cleanly, but is 4.5 % of a 200 CFM fan.
    _seed_clone_curve({"25": 5.0, "50": 7.5, "75": 8.0, "100": 9.0})
    row = _by_label(fan_calibration_summary(), "Intake 2x4")

    assert row["calibrated"] is True, "the capture exists and the desk must admit it"
    assert row["in_use"] is False, "...and must not pretend it is driving anything"
    assert row["source"] == "device_calibration"
    assert row["basis"] == "capacity_proxy_nameplate_calibration_implausible_vs_nameplate"
    assert "unit mix-up" in row["why_not"]
    assert row["nameplate_cfm"] == 200.0
    assert row["measured_top"] == 9.0
    assert row["pct_of_nameplate"] == 4.5
    assert row["last_calibrated_at"] is not None
    assert len(row["steps"]) == 4


def test_the_stored_unit_is_surfaced_because_it_is_the_bug(temp_db) -> None:  # noqa: ANN001
    _seed_clone_curve({"25": 5.0, "100": 9.0}, unit="m/s")
    row = _by_label(fan_calibration_summary(), "Intake 2x4")
    # The curve is consumed as CFM; anything else stored here is the defect, not a setting.
    assert row["stored_unit"] == "m/s"


def test_a_good_calibration_reports_in_use(temp_db) -> None:  # noqa: ANN001
    _seed_clone_curve({"25": 60.0, "50": 110.0, "75": 160.0, "100": 195.0}, unit="CFM")
    row = _by_label(fan_calibration_summary(), "Intake 2x4")
    assert row["calibrated"] is True
    assert row["in_use"] is True
    assert row["basis"] == "measured_curve"
    assert row["why_not"] == ""
    assert row["pct_of_nameplate"] == 97.5


def test_helper_era_capture_is_still_shown(temp_db) -> None:  # noqa: ANN001
    # out/recirc were captured before device_calibration existed: helpers only, no timestamp.
    set_helper("input_number.dsc_cfm_out_max", 440.0)
    for step in (25, 50, 75, 100):
        set_helper(f"input_number.{OUT}_{step}", 14.3)
    row = _by_label(fan_calibration_summary(), "OUT exhaust")
    assert row["calibrated"] is True
    assert row["source"] == "compose_helpers"
    assert row["last_calibrated_at"] is None, "helper-era captures carry no timestamp"
    assert row["in_use"] is False
    assert row["basis"] == "capacity_proxy_nameplate_flat_calibration"


def test_clear_removes_the_rows_and_reports_the_count(temp_db) -> None:  # noqa: ANN001
    _seed_clone_curve({"25": 5.0, "50": 7.5, "75": 8.0, "100": 9.0})
    assert len(get_calibration(CLONE, "fan_cfm")) == 4

    assert clear_calibration(CLONE, "fan_cfm") == 4
    assert get_calibration(CLONE, "fan_cfm") == []
    assert last_calibrated_at(CLONE, "fan_cfm") is None

    row = _by_label(fan_calibration_summary(), "Intake 2x4")
    assert row["calibrated"] is False
    assert row["basis"] == "capacity_proxy_nameplate"


def test_clearing_an_uncalibrated_device_is_a_no_op(temp_db) -> None:  # noqa: ANN001
    assert clear_calibration(CLONE, "fan_cfm") == 0


def test_clear_rejects_an_unknown_cal_type(temp_db) -> None:  # noqa: ANN001
    import pytest

    with pytest.raises(ValueError):
        clear_calibration(CLONE, "not_a_cal_type")
