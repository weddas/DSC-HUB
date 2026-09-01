# brain/tests/test_roster_stress.py — edge cases from 10-plant browser stress test
from __future__ import annotations

import json
from pathlib import Path

import pytest


@pytest.fixture()
def roster_db(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> Path:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", temp_db)
    from dsc_brain.compose_store import default_roster_slots, save_roster_slots

    save_roster_slots(default_roster_slots())
    return temp_db


def _fill_slot(slot_num: int, *, status: str = "stock", tent: str = "4x8", pot: str = "none") -> None:
    from dsc_brain.compose_store import update_roster_slot

    update_roster_slot(
        slot_num,
        {
            "status": status,
            "nickname": f"Plant{slot_num}",
            "strain": f"Strain{slot_num}",
            "sprout": "2026-07-09",
            "tent": tent,
            "pot": pot,
            "plant_uuid": f"plant:uuid-{slot_num}",
        },
    )


def test_default_roster_has_ten_slots(roster_db: Path) -> None:
    from dsc_brain.compose_store import ROSTER_SLOT_COUNT, default_roster_slots, get_roster_slots

    assert ROSTER_SLOT_COUNT == 10
    assert len(default_roster_slots()) == 10
    assert len(get_roster_slots()) == 10


def test_roster_migrates_eight_to_ten_slots(roster_db: Path) -> None:
    from dsc_brain.compose_store import ROSTER_SLOTS_KEY, get_roster_slots, get_setting

    legacy = [
        {
            "slot": i,
            "status": "empty" if i > 2 else "stock",
            "nickname": f"Legacy{i}" if i <= 2 else "",
            "strain": f"S{i}" if i <= 2 else "",
            "blend": "",
            "recipe": "",
            "sprout": "",
            "tent": "4x8" if i <= 2 else "",
            "pot": "none",
            "seed_count": 0,
            "notes": "",
        }
        for i in range(1, 9)
    ]
    from dsc_brain.compose_store import save_roster_slots

    save_roster_slots(legacy)
    slots = get_roster_slots()
    assert len(slots) == 10
    assert slots[0]["nickname"] == "Legacy1"
    assert slots[9]["status"] == "empty"
    persisted = json.loads(get_setting(ROSTER_SLOTS_KEY, "[]"))
    assert len(persisted) == 10


def test_commit_raises_when_roster_full(roster_db: Path) -> None:
    from dsc_brain.compose_ops import commit_to_roster
    from dsc_brain.compose_store import ROSTER_SLOT_COUNT, set_helper

    for i in range(1, ROSTER_SLOT_COUNT + 1):
        _fill_slot(i)
    set_helper("input_text.dsc_build_strain", "Overflow Strain")
    set_helper("input_text.dsc_build_nickname", "Overflow")
    with pytest.raises(RuntimeError, match="Roster full"):
        commit_to_roster()


def test_commit_stock_does_not_require_probe(roster_db: Path) -> None:
    from dsc_brain.compose_ops import commit_to_roster
    from dsc_brain.compose_store import get_roster_slots, set_helper

    set_helper("input_text.dsc_build_strain", "Stock Only")
    set_helper("input_text.dsc_build_nickname", "StockNick")
    set_helper("input_select.dsc_build_assign_pot", "none")
    set_helper("input_select.dsc_build_tent", "4x8")
    result = commit_to_roster()
    assert result["slot"] == 1
    slot = get_roster_slots()[0]
    assert slot["status"] == "stock"
    assert slot["pot"] == "none"


def test_retire_roster_slot_stock(roster_db: Path) -> None:
    from dsc_brain.compose_ops import retire_roster_slot
    from dsc_brain.compose_store import get_roster_slots

    _fill_slot(3, status="stock")
    result = retire_roster_slot(3)
    assert result["retired"] is True
    assert result["removed_seat"] is None
    slot = get_roster_slots()[2]
    assert slot["status"] == "empty"
    assert slot.get("plant_uuid") in ("", None)


def test_retire_roster_slot_active_clears_probe(roster_db: Path) -> None:
    from dsc_brain.compose_ops import assign_to_pot, commit_to_roster, retire_roster_slot
    from dsc_brain.compose_store import get_helper, get_roster_slots, set_helper
    from dsc_brain.settings import list_roster

    set_helper("input_text.dsc_build_strain", "Active Plant")
    set_helper("input_text.dsc_build_nickname", "Active")
    set_helper("input_select.dsc_build_assign_pot", "1")
    commit_to_roster()
    assign_to_pot("1")
    assert list_roster()
    result = retire_roster_slot(1)
    assert result["removed_seat"] == "pot1"
    assert list_roster() == []
    assert get_helper("text.dsc_probe1_plant_name", "x") == ""
    assert get_roster_slots()[0]["status"] == "empty"


def test_retire_roster_slot_already_empty_raises(roster_db: Path) -> None:
    from dsc_brain.compose_ops import retire_roster_slot

    with pytest.raises(ValueError, match="already empty"):
        retire_roster_slot(5)


def test_assign_to_pot_rejects_occupied_probe(roster_db: Path) -> None:
    from dsc_brain.compose_ops import assign_to_pot, commit_to_roster
    from dsc_brain.compose_store import set_helper, update_roster_slot

    set_helper("input_text.dsc_build_strain", "First")
    set_helper("input_text.dsc_build_nickname", "First")
    set_helper("input_select.dsc_build_assign_pot", "1")
    commit_to_roster()
    assign_to_pot("1")
    update_roster_slot(
        2,
        {
            "status": "stock",
            "nickname": "Second",
            "strain": "Second Strain",
            "pot": "none",
        },
    )
    set_helper("input_text.dsc_build_strain", "Second Strain")
    set_helper("input_text.dsc_build_nickname", "Second")
    set_helper("input_select.dsc_build_assign_pot", "1")
    with pytest.raises(ValueError, match="already has a plant"):
        assign_to_pot("1")


def test_commit_releases_stale_probe_claim(roster_db: Path) -> None:
    from dsc_brain.compose_ops import commit_to_roster
    from dsc_brain.compose_store import get_roster_slots, set_helper, update_roster_slot

    update_roster_slot(
        1,
        {
            "status": "detached",
            "nickname": "Stale",
            "strain": "Stale Strain",
            "pot": "2",
        },
    )
    set_helper("input_text.dsc_build_strain", "New On Two")
    set_helper("input_text.dsc_build_nickname", "New")
    set_helper("input_select.dsc_build_assign_pot", "2")
    set_helper("input_select.dsc_build_tent", "2x4")
    commit_to_roster()
    slots = {int(s["slot"]): s for s in get_roster_slots()}
    assert slots[1]["pot"] == "none"
    assert slots[2]["pot"] == "2"
    assert slots[2]["status"] == "active"


def test_api_retire_slot(roster_db: Path) -> None:
    from fastapi.testclient import TestClient

    from dsc_brain.api import app

    _fill_slot(4)
    client = TestClient(app)
    resp = client.post("/roster/slots/4/retire")
    assert resp.status_code == 200
    assert resp.json()["retired"] is True
    resp2 = client.post("/roster/slots/4/retire")
    assert resp2.status_code == 400


def test_api_retire_slot_out_of_range(roster_db: Path) -> None:
    from fastapi.testclient import TestClient

    from dsc_brain.api import app

    client = TestClient(app)
    assert client.post("/roster/slots/0/retire").status_code == 400
    assert client.post("/roster/slots/11/retire").status_code == 400


def test_commit_and_assign_carries_sprout_to_pot_and_slot(roster_db: Path) -> None:
    """ST-P0-5: sprout/stage must survive commit+assign (roster slot + pot recipe)."""
    from dsc_brain.compose_ops import commit_and_assign
    from dsc_brain.compose_store import get_roster_slots, set_helper
    from dsc_brain.computed_ops import build_computed_hass_states, invalidate_computed_cache
    from dsc_brain.fleet_state import get_fleet_state
    from dsc_brain.settings import list_roster

    set_helper("input_text.dsc_build_strain", "Afternoon Brunch")
    set_helper("input_text.dsc_build_nickname", "Brunch")
    set_helper("input_datetime.dsc_build_sprout_date", "2026-07-09")
    set_helper("input_select.dsc_build_assign_pot", "1")
    set_helper("input_select.dsc_build_tent", "4x8")
    commit_and_assign()

    rows = {r["seat_id"]: r for r in list_roster()}
    recipe = rows["pot1"]["recipe"]
    assert recipe.get("sprout_date") == "2026-07-09"
    slots = {int(s["slot"]): s for s in get_roster_slots()}
    active = next(s for s in slots.values() if s.get("pot") == "1")
    assert active.get("sprout") == "2026-07-09"

    invalidate_computed_cache()
    computed = build_computed_hass_states(get_fleet_state())
    assert computed["sensor.dsc_probe1_days_since_sprout"]["state"] not in ("", "unknown", "unavailable")
    assert computed["sensor.dsc_probe1_expected_stage"]["state"] not in ("", "unknown", "unavailable")
