"""Leaf VPD has ONE definition: es(leaf) - es(air)*rh/100.

Until 2026-09-09 the hub published `compute_vpd_kpa(leaf_t, rh)` = es(leaf)*(1-rh/100),
which treats the measured RH as if it were measured at leaf temperature, while the SPA's
derived layer used the physically correct form. One label, two quantities. These tests pin
the corrected formula AND pin the brain's two implementations to each other so they cannot
drift apart again.
"""

from __future__ import annotations

import math

import pytest

from dsc_brain.climate_math import compute_leaf_vpd_kpa, compute_vpd_kpa, finalize_hub_climate


def _svp(t: float) -> float:
    return 0.6108 * math.exp((17.27 * t) / (t + 237.3))


def test_leaf_vpd_is_leaf_saturation_minus_air_vapour_pressure() -> None:
    air, rh, leaf = 26.0, 60.0, 24.0  # leaf 2 C cooler, the default offset
    expected = _svp(leaf) - _svp(air) * 0.60
    assert compute_leaf_vpd_kpa(air, rh, leaf) == pytest.approx(round(expected, 3), abs=1e-3)


def test_leaf_vpd_differs_from_the_old_form_and_is_lower() -> None:
    """The old spelling overstated leaf VPD: it subtracted es(LEAF)*rh instead of es(AIR)*rh,
    and a cooler leaf has the smaller saturation pressure."""
    air, rh, leaf = 26.0, 60.0, 24.0
    corrected = compute_leaf_vpd_kpa(air, rh, leaf)
    old_form = compute_vpd_kpa(leaf, rh)  # es(leaf) * (1 - rh/100)
    assert corrected is not None and old_form is not None
    assert corrected < old_form
    # The gap is real, not rounding: >2 % of the value at a 2 C offset.
    assert (old_form - corrected) / old_form > 0.02


def test_the_gap_widens_with_the_leaf_offset() -> None:
    air, rh = 26.0, 60.0
    gaps = []
    for offset in (1.0, 3.0, 5.0):
        corrected = compute_leaf_vpd_kpa(air, rh, air - offset)
        old_form = compute_vpd_kpa(air - offset, rh)
        assert corrected is not None and old_form is not None
        gaps.append(old_form - corrected)
    assert gaps[0] < gaps[1] < gaps[2]


def test_at_zero_offset_the_two_forms_agree() -> None:
    """Sanity anchor: with leaf == air the distinction vanishes."""
    assert compute_leaf_vpd_kpa(26.0, 60.0, 26.0) == pytest.approx(compute_vpd_kpa(26.0, 60.0), abs=1e-3)


@pytest.mark.parametrize(
    "air,rh,leaf",
    [
        (None, 60.0, 24.0),
        (26.0, None, 24.0),
        (26.0, 60.0, None),
        (99.0, 60.0, 97.0),   # railed air temp
        (26.0, 60.0, 99.0),   # railed leaf temp
        (26.0, 140.0, 24.0),  # railed RH
        (26.0, 0.0, 24.0),    # RH 0 is out of the accepted band, like compute_vpd_kpa
        ("x", 60.0, 24.0),
    ],
)
def test_missing_or_railed_inputs_yield_none_not_a_number(air, rh, leaf) -> None:
    assert compute_leaf_vpd_kpa(air, rh, leaf) is None


def test_brain_and_derived_layer_now_agree() -> None:
    """The whole point of the correction: climate_math and derived_metrics must publish the
    SAME quantity for the same inputs, or the label lies again."""
    from dsc_brain.derived_metrics import leaf_vpd

    for air, rh, offset in ((26.0, 60.0, 2.0), (22.5, 45.0, 1.5), (30.0, 75.0, 3.0)):
        mine = compute_leaf_vpd_kpa(air, rh, air - offset)
        theirs = leaf_vpd(air, rh, leaf_offset_c=offset)
        assert mine is not None
        assert theirs.value is not None, theirs
        assert mine == pytest.approx(theirs.value, abs=2e-3), (air, rh, offset)


def test_finalize_hub_climate_publishes_the_corrected_leaf_values() -> None:
    values: dict = {"temp_c": 26.0, "rh_pct": 60.0, "clone_temp_c": 24.0, "clone_rh_pct": 70.0, "leaf_offset_c": 2.0}
    finalize_hub_climate(values)
    assert values["leaf_vpd_kpa"] == pytest.approx(compute_leaf_vpd_kpa(26.0, 60.0, 24.0), abs=1e-3)
    assert values["clone_leaf_vpd_kpa"] == pytest.approx(compute_leaf_vpd_kpa(24.0, 70.0, 22.0), abs=1e-3)
    # and NOT the old spelling
    assert values["leaf_vpd_kpa"] != compute_vpd_kpa(24.0, 60.0)


def test_rebase_is_journalled_once(monkeypatch: pytest.MonkeyPatch) -> None:
    """The recorded series changes meaning, so the discontinuity must be written down."""
    import dsc_brain.climate_math as cm

    logged: list[str] = []
    monkeypatch.setattr(cm, "_LEAF_VPD_REBASE_NOTED", False)
    monkeypatch.setattr("dsc_brain.event_log.record_grow_log", lambda msg, **kw: logged.append(msg))

    for _ in range(3):
        finalize_hub_climate({"temp_c": 26.0, "rh_pct": 60.0, "leaf_offset_c": 2.0})

    assert len(logged) == 1, logged
    assert "not comparable" in logged[0].lower()
