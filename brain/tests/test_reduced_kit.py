# brain/tests/test_reduced_kit.py
from dsc_brain.dash_computed import _reduced_kit


def test_pot4_retired_is_planned_not_capacity_offline():
    inv = [
        {"seat_id": "pot1", "in_service": True},
        {"seat_id": "pot2", "in_service": True},
        {"seat_id": "pot3", "in_service": False},
        {"seat_id": "pot4", "in_service": False},
        {"seat_id": "ac", "in_service": False},
        {"seat_id": "mister", "in_service": False},
        {"seat_id": "tank", "in_service": False},
    ]
    active, attrs = _reduced_kit(inv)
    assert active is False
    assert "POT4" in attrs["planned_oos"]
    assert "POT3" in attrs["planned_oos"]
    assert "POT4" not in attrs["offline"]


def test_pot1_oos_is_capacity_offline():
    inv = [
        {"seat_id": "pot1", "in_service": False},
        {"seat_id": "pot2", "in_service": True},
        {"seat_id": "pot3", "in_service": False},
        {"seat_id": "pot4", "in_service": False},
    ]
    active, attrs = _reduced_kit(inv)
    assert active is True
    assert "POT1" in attrs["offline"]
