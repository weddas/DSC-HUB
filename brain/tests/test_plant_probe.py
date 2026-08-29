# brain/tests/test_plant_probe.py
from __future__ import annotations

from pathlib import Path

import pytest


@pytest.fixture()
def plant_db(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> Path:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", temp_db)
    from dsc_brain.compose_ops import assign_to_pot, commit_to_roster
    from dsc_brain.compose_store import default_roster_slots, save_roster_slots, set_helper

    save_roster_slots(default_roster_slots())
    set_helper("input_text.dsc_build_strain", "Amnesia Blue")
    set_helper("input_text.dsc_build_nickname", "Amnesia")
    set_helper("input_datetime.dsc_build_sprout_date", "2026-07-09")
    set_helper("input_select.dsc_build_tent", "4x8")
    set_helper("input_select.dsc_build_assign_pot", "1")
    commit_to_roster()
    assign_to_pot("1")
    return temp_db


def test_detach_keeps_slot_clears_probe(plant_db: Path) -> None:
    from dsc_brain.compose_store import get_helper, get_roster_slots
    from dsc_brain.plant_probe import detach_plant_from_probe
    from dsc_brain.settings import list_roster

    result = detach_plant_from_probe(1)
    assert result["detached"] is True
    assert result["slot"] == 1
    assert list_roster() == []
    assert get_helper("text.dsc_probe1_plant_name", "x") == ""
    assert get_helper("text.dsc_probe1_assigned_plant_id", "x") == ""
    slot = next(s for s in get_roster_slots() if s["slot"] == 1)
    assert slot["pot"] == "none"
    assert slot["status"] == "detached"
    assert slot["nickname"] == "Amnesia"
    assert slot.get("plant_stash")


def test_assign_after_detach_restores_probe(plant_db: Path) -> None:
    from dsc_brain.compose_store import get_helper
    from dsc_brain.plant_probe import assign_plant_to_probe, detach_plant_from_probe
    from dsc_brain.settings import list_roster

    detach_plant_from_probe(1)
    assigned = assign_plant_to_probe(1, 2)
    assert assigned["pot"] == 2
    rows = list_roster()
    assert len(rows) == 1
    assert rows[0]["seat_id"] == "pot2"
    assert get_helper("text.dsc_probe2_plant_name", "") == "Amnesia"
    assert get_helper("text.dsc_probe2_assigned_plant_id", "") == "slot:1"
    assert get_helper("text.dsc_probe1_plant_name", "x") == ""


def test_move_plant_atomic(plant_db: Path) -> None:
    from dsc_brain.compose_store import get_helper
    from dsc_brain.plant_probe import move_plant
    from dsc_brain.settings import list_roster

    moved = move_plant(1, 2)
    assert moved["moved"] is True
    seats = {r["seat_id"] for r in list_roster()}
    assert seats == {"pot2"}
    assert get_helper("text.dsc_probe1_plant_name", "x") == ""
    assert get_helper("text.dsc_probe2_plant_name", "") == "Amnesia"


def test_assign_rejects_occupied_probe(plant_db: Path) -> None:
    from dsc_brain.compose_store import default_roster_slots, get_roster_slots, save_roster_slots, update_roster_slot
    from dsc_brain.plant_probe import assign_plant_to_probe
    import pytest

    slots = get_roster_slots()
    # fabricate a second detached plant on slot 2
    update_roster_slot(
        2,
        {
            "status": "detached",
            "pot": "none",
            "nickname": "Clone",
            "strain": "Clone Strain",
            "plant_stash": '{"strain_id":"clone","stage":"veg","recipe":{"plant_name":"Clone","nickname":"Clone","tent":"clone"}}',
        },
    )
    with pytest.raises(ValueError, match="already has a plant"):
        assign_plant_to_probe(2, 1)
