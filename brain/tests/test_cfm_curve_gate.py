"""A stored fan calibration only counts as measured when it behaves like the fan it names.

Two gates, both learned from live 4x8 data on 2026-09-10:

* the exhaust-out curve read 14.3 at every duty step — flat, yet stamped `measured_curve`,
  interpolated to a horizontal line, and published as the intake side of a -199.9 CFM
  under-pressure alarm ("the system is MORE wrong for having been calibrated");
* the 2x4 intake curve read 5.0/7.5/8.0/9.0 against a 200 CFM nameplate — a clean monotonic
  rise at 4.5 % of the fan's rating, so almost certainly an anemometer's m/s. It passed the
  span gate that fixed the flat case, and kept the alarm alive at -218.5 CFM.

Neither had a test, which is how the second half of the fix went missing.
"""

from __future__ import annotations

from dsc_brain.computed_ops import _cfm_from_pct_memoized, _curve_points_usable

# The live 4x8 calibrations, verbatim off the Pi.
FLAT_OUT = [(25.0, 14.3), (50.0, 14.3), (75.0, 14.3), (100.0, 14.3)]
FLAT_INTAKE_MAIN = [(25.0, 6.8), (50.0, 6.9), (75.0, 6.8), (100.0, 6.8)]
RISING_BUT_TINY = [(25.0, 5.0), (50.0, 7.5), (75.0, 8.0), (100.0, 9.0)]
GOOD = [(25.0, 60.0), (50.0, 110.0), (75.0, 160.0), (100.0, 195.0)]


def test_flat_curve_is_not_a_measurement() -> None:
    assert not _curve_points_usable(FLAT_OUT, 440.0)
    assert not _curve_points_usable(FLAT_INTAKE_MAIN, 200.0)


def test_rising_curve_an_order_of_magnitude_under_nameplate_is_a_unit_error() -> None:
    # Passes the span/monotonic gate on its own...
    assert _curve_points_usable(RISING_BUT_TINY)
    # ...and is still rejected once it is judged against the fan it describes.
    assert not _curve_points_usable(RISING_BUT_TINY, 200.0)


def test_a_curve_may_not_beat_its_own_nameplate() -> None:
    over = [(25.0, 200.0), (50.0, 400.0), (75.0, 600.0), (100.0, 800.0)]
    assert not _curve_points_usable(over, 200.0)


def test_a_plausible_curve_still_counts() -> None:
    assert _curve_points_usable(GOOD, 200.0)


def test_fewer_than_two_live_points_is_uncalibrated() -> None:
    assert not _curve_points_usable([(25.0, 0.0), (50.0, 90.0)], 200.0)


def _cfm(points: list[tuple[float, float]], pct: float, plate: float) -> tuple[float, str, str]:
    helpers: dict[str, object] = {}
    memo = {"p": points}
    return _cfm_from_pct_memoized(pct, plate, "p", helpers, memo)


def test_rejected_curves_fall_back_to_nameplate_and_say_which_way_they_failed() -> None:
    _v, model, honesty = _cfm(FLAT_OUT, 50.0, 440.0)
    assert model == "linear"
    assert honesty == "capacity_proxy_nameplate_flat_calibration"

    val, model, honesty = _cfm(RISING_BUT_TINY, 50.0, 200.0)
    assert model == "linear"
    assert honesty == "capacity_proxy_nameplate_calibration_implausible_vs_nameplate"
    # ...and the proxy answers with the fan's own scale instead of 7.5 CFM.
    assert val == 100.0


def test_a_good_curve_is_still_read_off_the_curve() -> None:
    val, model, honesty = _cfm(GOOD, 50.0, 200.0)
    assert (model, honesty) == ("curve", "measured_curve")
    assert val == 110.0
