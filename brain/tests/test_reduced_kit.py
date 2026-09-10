# brain/tests/test_reduced_kit.py
from dsc_brain.dash_computed import _reduced_kit


def test_on_hold_kit_is_planned_not_capacity_offline():
    """Kit the operator still owns but has parked belongs in planned_oos, not offline."""
    inv = [
        {"seat_id": "pot1", "in_service": True},
        {"seat_id": "pot2", "in_service": True},
        {"seat_id": "ac", "in_service": False},
        {"seat_id": "mister", "in_service": False},
        {"seat_id": "tank", "in_service": False},
    ]
    active, attrs = _reduced_kit(inv)
    assert active is False
    assert "AC" in attrs["planned_oos"]
    assert "Tank" in attrs["planned_oos"]
    assert "AC" not in attrs["offline"]


def test_a_removed_seat_is_reported_nowhere():
    """pot3/pot4 were removed on 2026-09-10, not parked.

    They used to be listed as planned-OOS for ever. A seat the operator no longer owns is
    absent from both lists — "deliberately offline" is a status for kit you still have.
    """
    inv = [
        {"seat_id": "pot1", "in_service": True},
        {"seat_id": "pot2", "in_service": True},
    ]
    _active, attrs = _reduced_kit(inv)
    joined = f"{attrs['planned_oos']} {attrs['offline']}"
    assert "POT3" not in joined
    assert "POT4" not in joined


def test_pot1_oos_is_capacity_offline():
    inv = [
        {"seat_id": "pot1", "in_service": False},
        {"seat_id": "pot2", "in_service": True},
    ]
    active, attrs = _reduced_kit(inv)
    assert active is True
    assert "POT1" in attrs["offline"]
