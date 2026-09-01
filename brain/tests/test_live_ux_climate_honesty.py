# brain/tests/test_live_ux_climate_honesty.py
"""Pass 2 — Climate honesty guards (reduced-kit planned OOS, wet vs policy problem)."""

from __future__ import annotations

from pathlib import Path

import pytest


def _point_db(monkeypatch: pytest.MonkeyPatch, temp_db: Path) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    monkeypatch.setattr("dsc_brain.paths.DEFAULT_DB", temp_db)
    for mod in (
        "dsc_brain.settings",
        "dsc_brain.compose_store",
        "dsc_brain.plant_journal",
        "dsc_brain.space_journal",
        "dsc_brain.space_model",
        "dsc_brain.room_model",
        "dsc_brain.room_journal",
        "dsc_brain.dsc_core_journal",
        "dsc_brain.facility_journal",
        "dsc_brain.energy_model",
        "dsc_brain.energy_learning",
        "dsc_brain.schedule_shift",
        "dsc_brain.photoperiod_conflict",
        "dsc_brain.space_occupants",
    ):
        try:
            monkeypatch.setattr(f"{mod}.DEFAULT_DB", temp_db)
        except Exception:
            pass


def test_reduced_kit_pot34_planned_not_offline_lead(
    temp_db: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    """Kit pot3/pot4 are planned OOS — never Capacity offline lead when only planned."""
    _point_db(monkeypatch, temp_db)
    from dsc_brain.dash_computed import _reduced_kit
    from dsc_brain.settings import list_inventory

    active, attrs = _reduced_kit(list_inventory(temp_db))
    offline = attrs.get("offline", "")
    assert "POT4" not in offline
    assert "POT3" not in offline
    planned = attrs.get("planned_oos", "")
    assert "POT3" in planned and "POT4" in planned
    # Default kit inventory keeps pot1/pot2 in service — reduced active only for live capacity gaps.
    assert active is False or "POT1" not in offline


def test_wet_without_bound_recipe_does_not_set_policy_problem(
    temp_db: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    """
    Climate Wet/Dry is the raw sensor edge; Problem/Clear comes only from bound
    policy_state after evaluate_device_policies runs a recipe.

    SPA must not infer Problem from occupancy/wet alone — browser proof in Task 6.
    """
    monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", temp_db)
    from dsc_brain.fleet_state import get_fleet_state, update_fleet_state
    from dsc_brain.zigbee_policies import evaluate_device_policies, save_zigbee_policies

    fleet = get_fleet_state()
    fleet.system = dict(fleet.system)
    fleet.system["zigbee_policy_state"] = {}
    update_fleet_state(fleet)

    save_zigbee_policies(
        {"0xocc": {"recipe_id": "none", "enabled": True, "params": {}}}
    )
    out = evaluate_device_policies(
        ieee="0xocc",
        friendly_name="liquid_sensor",
        payload={"occupancy": True},
    )
    assert out is None
    policy_state = get_fleet_state().system.get("zigbee_policy_state") or {}
    assert "0xocc" not in policy_state


def test_wet_is_not_problem_when_policy_problem_when_inactive(
    temp_db: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    """
    When problem_when=inactive, wet (active=True) is not a policy problem edge.

    SPA Problem/Clear chips must read policy_state.problem — not raw wet/dry.
    """
    monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", temp_db)
    monkeypatch.setattr(
        "dsc_brain.appliance_driver.force_set_sonoff_relay_sync",
        lambda *_a, **_k: None,
    )
    from dsc_brain.fleet_state import get_fleet_state, update_fleet_state
    from dsc_brain.zigbee_policies import evaluate_device_policies, save_zigbee_policies

    fleet = get_fleet_state()
    fleet.system = dict(fleet.system)
    fleet.system["zigbee_policy_state"] = {}
    fleet.system["critical_banners"] = []
    update_fleet_state(fleet)

    save_zigbee_policies(
        {
            "0xhum": {
                "recipe_id": "tank_full_appliance",
                "enabled": True,
                "params": {
                    "seat_id": "humidifier",
                    "problem_when": "inactive",
                    "banner": "Humidifier EMPTY - refill",
                },
            }
        }
    )
    out = evaluate_device_policies(
        ieee="0xhum",
        friendly_name="tank",
        payload={"occupancy": True},
    )
    assert out is not None
    assert out["active"] is True
    assert out["problem"] is False
    st = get_fleet_state().system["zigbee_policy_state"]["0xhum"]
    assert st["active"] is True
    assert st["problem"] is False
