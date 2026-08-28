"""Climate Mode taxonomy + clone automation guards."""

from __future__ import annotations

import asyncio
from pathlib import Path

import pytest


def test_climate_mode_migrate_and_idx() -> None:
    from dsc_brain.climate_mode import (
        CLIMATE_MODE_OPTIONS,
        clone_mode_idx,
        is_external_targets_mode,
        is_follow_plants_mode,
        migrate_legacy_clone_mode,
    )

    assert CLIMATE_MODE_OPTIONS == ("Follow 4x8", "Follow Plants", "Custom", "Off")
    assert migrate_legacy_clone_mode("Clones & Seedlings") == "Follow Plants"
    assert migrate_legacy_clone_mode("Mother") == "Custom"
    assert migrate_legacy_clone_mode("Follow Plants") == "Follow Plants"
    assert clone_mode_idx("Follow 4x8") == 0
    assert clone_mode_idx("Follow Plants") == 1
    assert clone_mode_idx("Custom") == 2
    assert clone_mode_idx("Off") == 3
    assert clone_mode_idx("Germination") is None
    assert is_external_targets_mode("Follow Plants")
    assert is_follow_plants_mode("Clones & Seedlings")


def test_apply_clone_tent_never_writes_grow_stage(
    temp_db: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.control_ops import apply_clone_tent_automation
    from dsc_brain.fleet_state import FleetState, SeatState, update_fleet_state

    hub = SeatState("hub", online=True)
    update_fleet_state(FleetState(hub=hub))
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
        lambda eid: "off" if "takeover" in eid else "",
    )
    monkeypatch.setattr(
        "dsc_brain.control_ops._seated_clone_recipe",
        lambda: {"growth_stage": "Vegetative", "plant_name": "X", "tent": "2x4"},
    )
    monkeypatch.setattr(
        "dsc_brain.follow_plants.clone_tent_plant_rows",
        lambda: [
            {
                "row": {},
                "recipe": {"growth_stage": "Vegetative", "plant_name": "X", "tent": "2x4"},
            }
        ],
    )
    result = asyncio.run(apply_clone_tent_automation())
    assert result.get("applied") is True
    assert "grow_stage" not in result
    assert all(e != "select.dsc_hub_grow_stage" for e, _ in wrote)
