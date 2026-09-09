"""Placement as data — the record the twin renders from.

`plan-spatial-layout-2026-09-10.md` S4. The rig's layout was 36 hand-written `<Placed>`
calls with literal offsets, so nothing could be moved without an edit and a rebuild.

Two properties matter more than the CRUD:

* the stored shape is **the same shape `Placed` consumes**, so persisting and rendering
  cannot drift into a translation layer;
* only OVERRIDES are stored, so a rig with no rows renders exactly as it always did and
  moving something is reversible by deleting one row.
"""

from __future__ import annotations

import pytest

from dsc_brain.placement_model import (
    clear_placement,
    get_placement,
    list_placements,
    normalise_placement,
    set_placement,
)


@pytest.fixture()
def db(tmp_path, monkeypatch):
    monkeypatch.setenv("DSC_DATA", str(tmp_path))
    return None


# --------------------------------------------------------------------------------------
# The record
# --------------------------------------------------------------------------------------


def test_an_anchor_placement_round_trips() -> None:
    """The 4x8 exhaust fan, exactly as RigScene writes it today."""
    out = normalise_placement({"at": {"parent": "tent4x8", "anchor": "fan_exhaust"}})
    assert out == {"at": {"parent": "tent4x8", "anchor": "fan_exhaust"}}


def test_a_free_placement_keeps_its_offset_and_rotation() -> None:
    """The heater: no anchor describes where it sits, so it is an offset from the tent."""
    out = normalise_placement(
        {
            "at": {"parent": "tent4x8", "anchor": "", "offset": [-1.02, 0, -0.32]},
            "rotation": [0, 0.6283, 0],
        }
    )
    assert out["at"]["offset"] == [-1.02, 0.0, -0.32]
    assert out["rotation"] == [0.0, 0.6283, 0.0]


def test_an_empty_anchor_is_legal_and_means_the_parents_origin() -> None:
    out = normalise_placement({"at": {"parent": "tent4x8", "anchor": ""}})
    assert out["at"]["anchor"] == ""


def test_a_world_position_is_the_other_shape() -> None:
    out = normalise_placement({"at": {"position": [0, 0, 0]}})
    assert out == {"at": {"position": [0.0, 0.0, 0.0]}}


def test_parent_and_position_together_are_refused() -> None:
    """One would render and the other be silently ignored, with no way to tell which."""
    with pytest.raises(ValueError, match="not both"):
        normalise_placement({"at": {"parent": "tent4x8", "position": [0, 0, 0]}})


def test_neither_parent_nor_position_is_refused() -> None:
    with pytest.raises(ValueError, match="needs either a parent"):
        normalise_placement({"at": {}})


def test_a_placement_needs_an_at() -> None:
    with pytest.raises(ValueError, match="needs an `at`"):
        normalise_placement({"rotation": [0, 0, 0]})


@pytest.mark.parametrize("bad", [[1, 2], [1, 2, 3, 4], "nope", [1, 2, "x"]])
def test_a_vector_that_is_not_three_numbers_is_refused(bad) -> None:  # noqa: ANN001
    with pytest.raises(ValueError, match="three numbers"):
        normalise_placement({"at": {"position": bad}})


def test_self_takes_one_anchor_or_two_for_a_midpoint() -> None:
    assert normalise_placement({"at": {"position": [0, 0, 0]}, "self": "duct_in"})["self"] == "duct_in"
    both = normalise_placement({"at": {"position": [0, 0, 0]}, "self": ["duct_in", "duct_out"]})
    assert both["self"] == ["duct_in", "duct_out"]


def test_self_rejects_a_shape_that_is_neither() -> None:
    with pytest.raises(ValueError, match="anchor name"):
        normalise_placement({"at": {"position": [0, 0, 0]}, "self": ["a", "b", "c"]})


def test_scale_takes_a_number_or_a_vector() -> None:
    assert normalise_placement({"at": {"position": [0, 0, 0]}, "scale": 2})["scale"] == 2.0
    assert normalise_placement({"at": {"position": [0, 0, 0]}, "scale": [1, 2, 3]})["scale"] == [1.0, 2.0, 3.0]


def test_absent_optionals_stay_absent() -> None:
    """A record must not sprout a rotation of zero it was never given — the scene's own
    default and an explicit [0,0,0] are different statements."""
    out = normalise_placement({"at": {"parent": "tent4x8", "anchor": "lamp_main"}})
    assert "rotation" not in out
    assert "self" not in out
    assert "scale" not in out
    assert "offset" not in out["at"]


# --------------------------------------------------------------------------------------
# The store
# --------------------------------------------------------------------------------------


def test_a_fresh_rig_has_no_overrides(db) -> None:  # noqa: ANN001
    """Nothing stored means the twin renders from the scene, exactly as before."""
    assert list_placements() == {}


def test_set_then_get(db) -> None:  # noqa: ANN001
    set_placement(
        "fanExOut",
        {"at": {"parent": "tent4x8", "anchor": "fan_exhaust_2"}, "self": "duct_in"},
        space_id="4x8",
    )
    got = get_placement("fanExOut")
    assert got == {"at": {"parent": "tent4x8", "anchor": "fan_exhaust_2"}, "self": "duct_in"}


def test_moving_something_overwrites_rather_than_duplicates(db) -> None:  # noqa: ANN001
    set_placement("heater", {"at": {"parent": "tent4x8", "anchor": "", "offset": [-1.0, 0, 0]}})
    set_placement("heater", {"at": {"parent": "tent4x8", "anchor": "", "offset": [1.0, 0, 0]}})
    assert len(list_placements()) == 1
    assert get_placement("heater")["at"]["offset"] == [1.0, 0.0, 0.0]


def test_clearing_puts_it_back_where_the_scene_says(db) -> None:  # noqa: ANN001
    set_placement("heater", {"at": {"position": [1, 0, 1]}})
    assert clear_placement("heater") is True
    assert get_placement("heater") is None
    assert list_placements() == {}


def test_clearing_something_unplaced_says_so(db) -> None:  # noqa: ANN001
    assert clear_placement("never_placed") is False


def test_a_bad_placement_never_reaches_the_store(db) -> None:  # noqa: ANN001
    with pytest.raises(ValueError):
        set_placement("bad", {"at": {"parent": "tent4x8", "position": [0, 0, 0]}})
    assert get_placement("bad") is None


def test_an_instance_id_is_required(db) -> None:  # noqa: ANN001
    with pytest.raises(ValueError, match="instance_id required"):
        set_placement("  ", {"at": {"position": [0, 0, 0]}})


def test_list_carries_the_space_so_the_desk_can_group_by_tent(db) -> None:  # noqa: ANN001
    set_placement("fanIntake2x4", {"at": {"parent": "tent2x4", "anchor": "fan_intake"}}, space_id="2x4")
    rows = list_placements()
    assert rows["fanIntake2x4"]["space_id"] == "2x4"
