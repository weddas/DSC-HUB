"""Hub grow-stage select vs the plants' expected stage: label differences vs phase mismatches."""

from dsc_brain.computed_ops import _stage_disagreement, _stage_phase


def test_phase_mapping():
    assert _stage_phase("Early Flowering") == "flower"
    assert _stage_phase("Late (Push) Vegetative") == "veg"
    assert _stage_phase("") is None and _stage_phase("unknown") is None


def test_same_phase_different_label_is_not_an_alarm():
    on, attrs = _stage_disagreement("Early Flowering", "Flowering")
    assert on is False and attrs["stages_differ"] is True and "same phase" in attrs["note"]


def test_phase_mismatch_is_an_alarm():
    on, attrs = _stage_disagreement("Vegetative", "Flowering")
    assert on is True and attrs["hub_phase"] == "veg" and attrs["plant_phase"] == "flower"


def test_missing_side_is_quiet():
    on, attrs = _stage_disagreement("", "Flowering")
    assert on is False and attrs["stages_differ"] is False
