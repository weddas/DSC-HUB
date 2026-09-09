"""Derived metrics: every value carries its provenance, and every missing input
yields an honest hole rather than a fabricated number.

The point of most of these cases is negative: given a sensor that is absent, railed,
zero, or nonsense, the module must return `unavailable` with the missing input named
and `value is None` -- and a control signal must return `action=None` ("no opinion"),
never a silent "off".
"""

from __future__ import annotations

import math

import pytest

from dsc_brain.derived_metrics import (
    ControlSignal,
    Derived,
    absolute_humidity,
    air_vpd,
    condensation_guard,
    condensation_margin,
    dehumidify_signal,
    dew_point,
    dli,
    evaluate_zone,
    leaf_vpd,
    moisture_load,
    saturation_vapour_pressure_kpa,
    vpd_correction_signal,
    vpd_deficit,
)

T = 24.0
RH = 60.0
BAND_VPD = {"min": 1.0, "max": 1.4}
BAND_RH = {"min": 45.0, "max": 55.0}
BAND_T = {"min": 22.0, "max": 26.0}


def _assert_honest_hole(d: Derived, needle: str) -> None:
    """The whole contract for an unavailable value, in one place."""
    assert d.value is None, f"{d.key} fabricated {d.value!r}"
    assert d.resolved is False
    assert d.provenance == "", f"{d.key} claims provenance for a value it does not have"
    assert d.unavailable, f"{d.key} is unavailable with no reason"
    assert needle in d.unavailable, f"{d.key}: {d.unavailable!r} does not mention {needle!r}"


def _assert_honest_value(d: Derived) -> None:
    assert d.value is not None and math.isfinite(d.value)
    assert d.provenance, f"{d.key} resolved without provenance"
    assert d.unavailable is None


# --------------------------------------------------------------------------- #
# Resolved values carry provenance
# --------------------------------------------------------------------------- #


def test_psychrometrics_match_the_reference_numbers() -> None:
    assert saturation_vapour_pressure_kpa(24.0) == pytest.approx(2.984, abs=0.005)
    vpd = air_vpd(T, RH)
    _assert_honest_value(vpd)
    assert vpd.value == pytest.approx(1.194, abs=0.005)
    assert "T + RH" in vpd.provenance

    dew = dew_point(T, RH)
    _assert_honest_value(dew)
    assert dew.value == pytest.approx(15.76, abs=0.05)

    ah = absolute_humidity(T, RH)
    _assert_honest_value(ah)
    assert ah.value == pytest.approx(13.05, abs=0.05)


def test_dli_is_ppfd_times_photoperiod_with_the_curve_named() -> None:
    d = dli(420, 18, source="calibrated")
    _assert_honest_value(d)
    assert d.value == pytest.approx(27.216, abs=0.001)
    assert "18 h photoperiod" in d.provenance
    assert d.assumption and "calibration curve" in d.assumption
    assert d.possible_with and "PAR sensor" in d.possible_with
    # A live PAR reading drops the assumption instead of keeping a stale caveat.
    assert dli(420, 18, source="measured").assumption is None


# --------------------------------------------------------------------------- #
# Missing inputs -> honest holes, never numbers
# --------------------------------------------------------------------------- #


@pytest.mark.parametrize(
    ("temp_c", "rh_pct", "needle"),
    [
        (None, RH, "needs air temperature"),
        (T, None, "needs relative humidity"),
        (None, None, "needs air temperature and relative humidity"),
        ("", RH, "needs air temperature"),
        ("nonsense", RH, "needs air temperature"),
        (float("nan"), RH, "needs air temperature"),
        (float("inf"), RH, "needs air temperature"),
        (True, RH, "needs air temperature"),  # a bool is not a reading
    ],
)
def test_every_psychrometric_refuses_a_missing_input(temp_c, rh_pct, needle) -> None:
    for builder in (air_vpd, dew_point, absolute_humidity):
        _assert_honest_hole(builder(temp_c, rh_pct), needle)
    _assert_honest_hole(leaf_vpd(temp_c, rh_pct, leaf_offset_c=1.5), needle)
    _assert_honest_hole(condensation_margin(temp_c, rh_pct), needle)
    _assert_honest_hole(moisture_load(temp_c, rh_pct, rh_band=BAND_RH, temp_band=BAND_T), needle)


@pytest.mark.parametrize(
    ("temp_c", "rh_pct", "needle"),
    [
        (99.0, RH, "outside the plausible range"),
        (-50.0, RH, "outside the plausible range"),
        (T, 140.0, "outside the plausible range"),
        (T, -3.0, "outside the plausible range"),
    ],
)
def test_railed_readings_are_rejected_not_clamped(temp_c, rh_pct, needle) -> None:
    # The 2026-09-08 fault signature: a railed sensor must not leak a derived number.
    _assert_honest_hole(air_vpd(temp_c, rh_pct), needle)
    _assert_honest_hole(absolute_humidity(temp_c, rh_pct), needle)


def test_zero_rh_has_no_dew_point_and_says_so() -> None:
    _assert_honest_hole(dew_point(T, 0.0), "0 %")
    # ...but VPD at 0 % RH is a real number, not a hole.
    _assert_honest_value(air_vpd(T, 0.0))


# --------------------------------------------------------------------------- #
# Assumptions ride on the value
# --------------------------------------------------------------------------- #


def test_leaf_vpd_states_its_assumption_and_drops_it_when_a_sensor_exists() -> None:
    assumed = leaf_vpd(T, RH, leaf_offset_c=1.5)
    _assert_honest_value(assumed)
    assert assumed.assumption and "assumed" in assumed.assumption
    assert assumed.possible_with and "IR leaf" in assumed.possible_with

    measured = leaf_vpd(T, RH, leaf_temp_c=22.5)
    _assert_honest_value(measured)
    assert measured.assumption is None
    assert "leaf sensor bound" in measured.provenance
    # Same physical offset -> same number; only the honesty differs.
    assert measured.value == pytest.approx(assumed.value)
    # Leaf VPD sits below air VPD because the leaf is cooler.
    assert measured.value < air_vpd(T, RH).value


def test_leaf_vpd_without_a_sensor_or_an_offset_is_unavailable(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("dsc_brain.derived_metrics._leaf_offset_setting", lambda: None)
    _assert_honest_hole(leaf_vpd(T, RH), "leaf temperature or a leaf/air offset")


def test_condensation_margin_is_an_upper_bound_without_a_surface_probe() -> None:
    bound = condensation_margin(T, RH)
    _assert_honest_value(bound)
    assert bound.assumption and "coldest surface assumed" in bound.assumption
    probed = condensation_margin(T, RH, surface_temp_c=18.0)
    _assert_honest_value(probed)
    assert probed.assumption is None
    assert probed.value < bound.value  # the real cold surface is closer to the dew point


def test_moisture_load_names_its_ceiling_and_falls_back_honestly() -> None:
    load = moisture_load(T, RH, rh_band=BAND_RH, temp_band=BAND_T)
    _assert_honest_value(load)
    assert load.value > 0  # 60 % against a 55 % ceiling is water to remove
    assert "55 % ceiling at 24.0 C" in load.provenance
    assert load.assumption is None

    no_temp_band = moisture_load(T, RH, rh_band=BAND_RH)
    _assert_honest_value(no_temp_band)
    assert no_temp_band.assumption and "CURRENT air temperature" in no_temp_band.assumption

    _assert_honest_hole(moisture_load(T, RH), "needs an RH band")
    _assert_honest_hole(moisture_load(T, RH, rh_band={"min": 60, "max": 40}), "needs an RH band")


# --------------------------------------------------------------------------- #
# Band-relative values
# --------------------------------------------------------------------------- #


def test_vpd_deficit_is_signed_and_zero_inside_the_band() -> None:
    assert vpd_deficit(1.2, BAND_VPD).value == 0.0
    assert vpd_deficit(0.8, BAND_VPD).value == pytest.approx(-0.2)
    assert vpd_deficit(1.6, BAND_VPD).value == pytest.approx(0.2)
    assert vpd_deficit(1.2, [1.0, 1.4]).value == 0.0
    _assert_honest_hole(vpd_deficit(None, BAND_VPD), "needs a VPD reading")
    _assert_honest_hole(vpd_deficit(1.2, None), "needs a VPD band")
    _assert_honest_hole(vpd_deficit(1.2, {"min": 1.4, "max": 1.0}), "needs a VPD band")


@pytest.mark.parametrize(
    ("ppfd", "hours", "needle"),
    [
        (None, 18, "needs canopy PPFD"),
        (420, None, "needs a photoperiod rail"),
        (None, None, "needs canopy PPFD and a photoperiod rail"),
        (0, 18, "not a positive number"),
        (420, 0, "not a positive number"),
        (-5, 18, "not a positive number"),
    ],
)
def test_dli_never_invents_light(ppfd, hours, needle) -> None:
    _assert_honest_hole(dli(ppfd, hours), needle)


# --------------------------------------------------------------------------- #
# Control signals: no inputs means NO OPINION, never a silent off
# --------------------------------------------------------------------------- #


def _assert_undecided(sig: ControlSignal) -> None:
    assert sig.action is None, f"{sig.key} took a control decision it could not justify"
    assert sig.decided is False
    assert sig.unavailable, f"{sig.key} is undecided with no reason"
    assert "cannot decide" in sig.reason


def test_dehumidify_signal_decides_on_absolute_humidity() -> None:
    wet = dehumidify_signal(T, 75.0, rh_band=BAND_RH, temp_band=BAND_T)
    assert wet.action == "dehumidify"
    assert wet.provenance
    dry = dehumidify_signal(T, 35.0, rh_band=BAND_RH, temp_band=BAND_T)
    assert dry.action == "idle"
    # Sitting on the ceiling: hold rather than chatter the relay.
    on_ceiling = dehumidify_signal(24.0, 55.0, rh_band=BAND_RH, temp_band={"min": 24.0, "max": 24.0})
    assert on_ceiling.action == "hold"


def test_dehumidify_signal_has_no_opinion_without_inputs() -> None:
    _assert_undecided(dehumidify_signal(None, None, rh_band=BAND_RH, temp_band=BAND_T))
    _assert_undecided(dehumidify_signal(T, RH))  # no RH rail at all
    _assert_undecided(dehumidify_signal(99.0, RH, rh_band=BAND_RH))  # railed sensor


def test_condensation_guard_flags_risk_and_defers_when_blind() -> None:
    clear = condensation_guard(T, RH)
    assert clear.action == "clear"
    assert "coldest surface assumed" in clear.reason  # the verdict names what it rests on
    risky = condensation_guard(T, RH, surface_temp_c=16.0)
    assert risky.action == "at_risk"
    _assert_undecided(condensation_guard(None, RH))


def test_vpd_correction_points_the_right_way_and_defers_without_a_band() -> None:
    assert vpd_correction_signal(1.8, BAND_VPD).action == "lower_vpd"
    assert vpd_correction_signal(0.6, BAND_VPD).action == "raise_vpd"
    assert vpd_correction_signal(1.2, BAND_VPD).action == "hold"
    _assert_undecided(vpd_correction_signal(1.2, None))
    _assert_undecided(vpd_correction_signal(None, BAND_VPD))


# --------------------------------------------------------------------------- #
# The whole-zone bundle
# --------------------------------------------------------------------------- #


def test_a_blind_zone_produces_zero_numbers_and_zero_decisions() -> None:
    out = evaluate_zone()
    assert out["derived"], "the bundle must still list every metric it knows about"
    for key, row in out["derived"].items():
        assert row["value"] is None, f"{key} produced a number with no inputs at all"
        assert row["unavailable"], f"{key} is unavailable with no reason"
        assert row["provenance"] == ""
    for key, sig in out["signals"].items():
        assert sig["action"] is None, f"{key} decided something with no inputs at all"
        assert sig["unavailable"]


def test_a_live_zone_resolves_everything_it_can_and_labels_the_rest() -> None:
    out = evaluate_zone(
        temp_c=T,
        rh_pct=RH,
        vpd_kpa=1.2,
        leaf_offset_c=1.5,
        vpd_band=BAND_VPD,
        rh_band=BAND_RH,
        temp_band=BAND_T,
        ppfd=420,
        photoperiod_hours=18,
    )
    for key, row in out["derived"].items():
        if row["value"] is None:
            assert row["unavailable"], f"{key} unavailable without a reason"
        else:
            assert row["provenance"], f"{key} resolved without provenance"
    assert out["derived"]["dli"]["value"] == pytest.approx(27.216, abs=0.001)
    assert out["derived"]["vpd_deficit"]["value"] == 0.0
    assert out["signals"]["vpd_correction"]["action"] == "hold"
    assert out["signals"]["dehumidify"]["action"] == "dehumidify"


def test_zone_bundle_falls_back_to_derived_vpd_when_the_hub_publishes_none() -> None:
    # No vpd_kpa supplied, so the band comparison uses the VPD derived from T + RH
    # (1.19 kPa at 24 C / 60 % RH, which sits inside 1.0-1.4).
    out = evaluate_zone(temp_c=T, rh_pct=RH, vpd_band=BAND_VPD)
    assert out["derived"]["vpd_deficit"]["value"] == 0.0
    assert out["signals"]["vpd_correction"]["action"] == "hold"
    # ...and with no T/RH either there is nothing to fall back to.
    blind = evaluate_zone(vpd_band=BAND_VPD)
    assert blind["derived"]["vpd_deficit"]["value"] is None
    assert blind["signals"]["vpd_correction"]["action"] is None
