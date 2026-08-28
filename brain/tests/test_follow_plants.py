"""Follow Plants intersection + apply guards."""

from __future__ import annotations

import asyncio
from pathlib import Path

import pytest

from dsc_brain.follow_plants import intersect_bands, resolve_follow_plants_targets


def test_intersect_bands_strictest_and_refuse() -> None:
    assert intersect_bands([(20.0, 28.0), (22.0, 26.0)]) == (22.0, 26.0)
    assert intersect_bands([(20.0, 22.0), (24.0, 26.0)]) is None
    assert intersect_bands([]) is None


def test_resolve_follow_plants_empty_refuses() -> None:
    assert resolve_follow_plants_targets([]) is None


def test_resolve_follow_plants_happy_path() -> None:
    plants = [
        {
            "row": {},
            "recipe": {"growth_stage": "Seedling", "plant_name": "A", "tent": "2x4"},
        },
        {
            "row": {},
            "recipe": {"growth_stage": "Vegetative", "plant_name": "B", "tent": "2x4"},
        },
    ]
    targets = resolve_follow_plants_targets(plants)
    assert targets is not None
    assert targets["clone_rh_min"] >= 55  # veg looser low? seedling 65–75 ∩ veg 55–65 → 65–65
    assert targets["clone_rh_min"] == 65
    assert targets["clone_rh_max"] == 65
    assert targets["plant_count"] == 2
    assert "grow_stage" not in targets


def test_apply_follow_plants_writes_numbers_not_grow_stage(
    temp_db: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.fleet_state import FleetState, SeatState, update_fleet_state
    from dsc_brain.follow_plants import apply_follow_plants

    update_fleet_state(FleetState(hub=SeatState("hub", online=True)))
    wrote: list[tuple[str, str]] = []

    async def fake_select(entity_id: str, option: str) -> dict:
        wrote.append((entity_id, option))
        return {"ok": True}

    async def fake_number(entity_id: str, value: float) -> dict:
        wrote.append((entity_id, str(value)))
        return {"ok": True}

    monkeypatch.setattr("dsc_brain.control_ops._hub_select_retry", fake_select)
    monkeypatch.setattr("dsc_brain.control_ops._hub_number", fake_number)
    monkeypatch.setattr("dsc_brain.control_ops._hub_is_online", lambda: True)
    monkeypatch.setattr(
        "dsc_brain.control_ops._control_state",
        lambda eid: (
            "off"
            if "takeover" in eid
            else ("Follow Plants" if "clone_mode" in eid else "")
        ),
    )
    monkeypatch.setattr(
        "dsc_brain.follow_plants.clone_tent_plant_rows",
        lambda: [
            {
                "row": {},
                "recipe": {"growth_stage": "Seedling", "plant_name": "A", "tent": "2x4"},
            }
        ],
    )
    result = asyncio.run(apply_follow_plants())
    assert result["applied"] is True
    assert all(e != "select.dsc_hub_grow_stage" for e, _ in wrote)
    assert any(e.startswith("number.dsc_hub_clone_") for e, _ in wrote)
