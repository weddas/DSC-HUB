"""The wizard asks for m/s because that is what the anemometer reads. Nothing converted it.

Two defects, both live until 2026-09-10:

* the desk wrote the raw reading into a store the brain consumes as CFM, so a 9 m/s sample
  became "9 CFM" against a 200 CFM fan and the curve was discarded as implausible;
* `cal_save_point` never looked at the reading at all — it read `sensor.dsc_cfm_*` back off
  the computed state and stored that, i.e. the nameplate proxy it was meant to replace.

Between them, no calibration this system ever captured could have been usable.
"""

from __future__ import annotations

import math

import pytest

from dsc_brain.compose_ops import (
    CAL_DUCT_CM_DEFAULT,
    cal_duct_cm,
    cal_save_point,
    cal_start,
    ms_to_cfm,
)
from dsc_brain.compose_store import get_cal_points, get_helper, set_helper
from dsc_brain.device_calibration import get_calibration

CLONE = "dsc_cal_cfm_intake_clone"
# Nominal metric trade sizes, matching the desk's common-size picker.
FOUR_INCH = 10.0
SIX_INCH = 15.0


def test_conversion_is_velocity_times_area() -> None:
    # 5 m/s through a 100 mm duct: pi*(0.05)^2 = 0.0078540 m2 -> 0.0393 m3/s -> 83.2 CFM.
    area = math.pi * (FOUR_INCH / 200.0) ** 2
    assert ms_to_cfm(5.0, FOUR_INCH) == pytest.approx(5.0 * area * 2118.88, abs=0.05)
    assert ms_to_cfm(5.0, FOUR_INCH) == 83.2


def test_conversion_scales_with_area_not_diameter() -> None:
    # 150 mm is 1.5x the diameter of 100 mm, so 2.25x the airflow at the same velocity.
    assert ms_to_cfm(5.0, SIX_INCH) == pytest.approx(2.25 * ms_to_cfm(5.0, FOUR_INCH), rel=0.001)


def test_no_reading_or_no_duct_is_zero_not_a_guess() -> None:
    assert ms_to_cfm(0.0, FOUR_INCH) == 0.0
    assert ms_to_cfm(5.0, 0.0) == 0.0


def test_the_live_2x4_readings_become_a_plausible_curve(temp_db) -> None:  # noqa: ANN001
    """The operator's actual numbers were fine; only the units were wrong."""
    readings = [5.0, 7.5, 8.0, 9.0]  # verbatim off the Pi, 2026-09-10
    cfm = [ms_to_cfm(v, FOUR_INCH) for v in readings]
    assert cfm == [83.2, 124.8, 133.1, 149.8]
    # ...and against the 200 CFM nameplate that is 43 %-77 %, inside the plausibility band
    # that had been rejecting the same measurements stored as "9 CFM".
    from dsc_brain.computed_ops import _curve_points_usable

    points = [(0.0, 0.0)] + list(zip([25.0, 50.0, 75.0, 100.0], cfm))
    assert _curve_points_usable(points, 200.0)


def test_duct_defaults_match_the_fans_as_built(temp_db) -> None:  # noqa: ANN001
    assert cal_duct_cm("dsc_cal_cfm_out") == SIX_INCH
    assert cal_duct_cm(CLONE) == FOUR_INCH
    assert set(CAL_DUCT_CM_DEFAULT) == {
        "dsc_cal_cfm_out",
        "dsc_cal_cfm_recirc",
        "dsc_cal_cfm_intake_main",
        "dsc_cal_cfm_intake_clone",
    }


def test_an_operator_duct_size_overrides_the_default(temp_db) -> None:  # noqa: ANN001
    set_helper("input_number.dsc_duct_intake_clone_cm", 12.5)
    assert cal_duct_cm(CLONE) == 12.5


def _arm_session(reading_ms: float, step_pct: int) -> None:
    set_helper("cal_fan_prefix", CLONE)
    cal_start()
    set_helper("input_number.dsc_cal_step_pct", step_pct)
    set_helper("input_number.dsc_cal_reading_ms", reading_ms)


def test_save_point_stores_the_reading_converted_not_the_models_own_estimate(temp_db) -> None:  # noqa: ANN001
    _arm_session(9.0, 100)
    out = cal_save_point()

    assert out["reading_ms"] == 9.0
    assert out["duct_cm"] == FOUR_INCH
    assert out["cfm"] == 149.8
    assert out["step_pct"] == 100


def test_save_point_writes_both_stores_in_cfm(temp_db) -> None:  # noqa: ANN001
    _arm_session(7.5, 50)
    cal_save_point()

    # The compose helper the brain falls back to...
    assert get_cal_points(CLONE) == {50: 124.8}
    # ...and the device_calibration row it prefers. Same number, and CFM this time.
    rows = get_calibration(CLONE, "fan_cfm")
    assert len(rows) == 1
    assert rows[0]["measured_value"] == 124.8
    assert rows[0]["unit"] == "CFM"


def test_save_point_refuses_without_a_reading(temp_db) -> None:  # noqa: ANN001
    _arm_session(0.0, 25)
    with pytest.raises(ValueError, match="no anemometer reading"):
        cal_save_point()
    assert get_cal_points(CLONE) == {}


def test_save_point_refuses_when_the_duct_size_is_unknown(temp_db) -> None:  # noqa: ANN001
    from dsc_brain import compose_ops

    _arm_session(9.0, 25)
    # A target with no default and no helper: convert-or-guess, and it must not guess.
    set_helper("cal_fan_prefix", "dsc_cal_cfm_unknown_duct")
    assert compose_ops.cal_duct_cm("dsc_cal_cfm_unknown_duct") == 0.0
    with pytest.raises(ValueError, match="duct diameter"):
        cal_save_point()


def test_step_pct_beats_a_stale_index(temp_db) -> None:  # noqa: ANN001
    """A mid-session reload used to leave the index pointing at the wrong duty."""
    _arm_session(9.0, 75)
    set_helper("cal_step_index", 0)  # stale: would have written the point at 25 %
    out = cal_save_point()
    assert out["step_pct"] == 75
    assert set(get_cal_points(CLONE)) == {75}


def test_cal_start_resets_the_step_index(temp_db) -> None:  # noqa: ANN001
    set_helper("cal_step_index", 3)
    cal_start()
    assert int(float(get_helper("cal_step_index", -1))) == 0
