"""Zigbee device tasks — tank_full_appliance and universal path."""

from __future__ import annotations

from pathlib import Path
from typing import Any

import pytest


def _seat(seat_id: str, db: Path) -> dict[str, Any]:
    from dsc_brain.settings import list_inventory

    return next(r for r in list_inventory(db) if r["seat_id"] == seat_id)


def test_normalize_binary_active() -> None:
    from dsc_brain.zigbee_policies import normalize_binary_active

    assert normalize_binary_active({"water_leak": True}) is True
    assert normalize_binary_active({"water_leak": False}) is False
    assert normalize_binary_active({"leak": "wet"}) is True
    assert normalize_binary_active({"leak": "dry"}) is False
    assert normalize_binary_active({"occupancy": True}) is True
    assert normalize_binary_active({"occupancy": False}) is False
    # Explicit leak wins over occupancy when both present
    assert normalize_binary_active({"water_leak": False, "occupancy": True}) is False
    assert normalize_binary_active({"temperature": 22.0}) is None


def test_no_task_is_noop(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", temp_db)
    from dsc_brain.zigbee_policies import evaluate_device_policies, save_zigbee_policies

    save_zigbee_policies(
        {"0xleak": {"recipe_id": "none", "enabled": True, "params": {}}}
    )
    out = evaluate_device_policies(
        ieee="0xleak",
        friendly_name="tank_sensor",
        payload={"water_leak": True},
    )
    assert out is None
    assert _seat("dehumidifier", temp_db)["in_service"] is True


def test_tank_full_wet_oos_and_banner(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", temp_db)
    forced: list[tuple[str, bool]] = []
    monkeypatch.setattr(
        "dsc_brain.appliance_driver.force_set_sonoff_relay_sync",
        lambda seat, on: forced.append((seat, on)),
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
            "0xleak1": {
                "recipe_id": "tank_full_appliance",
                "enabled": True,
                "params": {"seat_id": "dehumidifier"},
            }
        }
    )
    out = evaluate_device_policies(
        ieee="0xleak1",
        friendly_name="tank_sensor",
        payload={"water_leak": True},
    )
    assert out and out["changed"] is True and out["action"] == "active"
    assert _seat("dehumidifier", temp_db)["in_service"] is False
    assert forced == [("dehumidifier", False)]
    banners = get_fleet_state().system.get("critical_banners") or []
    assert any("tank FULL" in str(b.get("text", "")) for b in banners)


def test_tank_full_dry_restores_owned_oos(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
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
            "0xleak2": {
                "recipe_id": "tank_full_appliance",
                "enabled": True,
                "params": {},
            }
        }
    )
    evaluate_device_policies(
        ieee="0xleak2", friendly_name="tank_sensor", payload={"water_leak": True}
    )
    assert _seat("dehumidifier", temp_db)["in_service"] is False

    out = evaluate_device_policies(
        ieee="0xleak2", friendly_name="tank_sensor", payload={"water_leak": False}
    )
    assert out and out["action"] == "clear"
    assert _seat("dehumidifier", temp_db)["in_service"] is True
    banners = get_fleet_state().system.get("critical_banners") or []
    assert not any(str(b.get("id", "")).startswith("zb-policy-0xleak2") for b in banners)


def test_dry_does_not_clobber_manual_oos(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", temp_db)
    monkeypatch.setattr(
        "dsc_brain.appliance_driver.force_set_sonoff_relay_sync",
        lambda *_a, **_k: None,
    )

    from dsc_brain.fleet_state import get_fleet_state, update_fleet_state
    from dsc_brain.settings import set_setting, upsert_inventory
    from dsc_brain.zigbee_policies import (
        SETTING_OWNED_OOS,
        evaluate_device_policies,
        save_zigbee_policies,
    )

    save_zigbee_policies(
        {
            "0xleak": {
                "recipe_id": "tank_full_appliance",
                "enabled": True,
                "params": {},
            }
        }
    )
    upsert_inventory("dehumidifier", {"in_service": False})
    set_setting(SETTING_OWNED_OOS, "{}")

    fleet = get_fleet_state()
    fleet.system = dict(fleet.system)
    fleet.system["zigbee_policy_state"] = {
        "0xleak": {"recipe_id": "tank_full_appliance", "active": True}
    }
    update_fleet_state(fleet)

    evaluate_device_policies(
        ieee="0xleak", friendly_name="tank_sensor", payload={"water_leak": False}
    )
    assert _seat("dehumidifier", temp_db)["in_service"] is False


def test_unbound_ieee_without_policy_noop(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", temp_db)
    from dsc_brain.zigbee_policies import evaluate_device_policies

    assert (
        evaluate_device_policies(
            ieee="0xunknown",
            friendly_name="x",
            payload={"water_leak": True},
        )
        is None
    )


def test_recipes_and_policies_api(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", temp_db)
    from fastapi.testclient import TestClient

    from dsc_brain.api import app

    client = TestClient(app)
    recipes = client.get("/settings/zigbee/recipes").json()["recipes"]
    assert any(r["id"] == "tank_full_appliance" for r in recipes)
    assert any(r["id"] == "none" for r in recipes)

    put = client.put(
        "/settings/zigbee/policies",
        json={
            "policies": {
                "0xleak": {
                    "recipe_id": "tank_full_appliance",
                    "enabled": True,
                    "params": {"seat_id": "dehumidifier"},
                }
            }
        },
    )
    assert put.status_code == 200
    got = client.get("/settings/zigbee/policies").json()["policies"]
    assert got["0xleak"]["recipe_id"] == "tank_full_appliance"


def test_mqtt_ingest_runs_tank_recipe(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", temp_db)
    monkeypatch.setattr(
        "dsc_brain.appliance_driver.force_set_sonoff_relay_sync",
        lambda *_a, **_k: None,
    )

    from dsc_brain.zigbee_mqtt import _ingest, save_zigbee_bindings
    from dsc_brain.zigbee_policies import save_zigbee_policies

    save_zigbee_bindings(
        {
            "0xleak": {
                "role": "leak_tank",
                "zone": "4x8",
                "enabled": True,
                "friendly_name": "tank_sensor",
            }
        }
    )
    save_zigbee_policies(
        {
            "0xleak": {
                "recipe_id": "tank_full_appliance",
                "enabled": True,
                "params": {},
            }
        }
    )
    _ingest._devices = [
        {"ieee_address": "0xleak", "friendly_name": "tank_sensor", "type": "EndDevice"}
    ]
    _ingest._by_role = {}
    _ingest._canopy = {}

    class _Msg:
        topic = "zigbee2mqtt/tank_sensor"
        payload = b'{"water_leak": true}'

    _ingest._on_message(None, None, _Msg())
    assert _seat("dehumidifier", temp_db)["in_service"] is False
    assert _ingest._by_role.get("leak_tank", {}).get("wet") is True


def test_banner_template() -> None:
    from dsc_brain.zigbee_policies import banner_template

    assert banner_template("dehumidifier", "active") == "Dehumidifier tank FULL - empty tank"
    assert banner_template("humidifier", "inactive") == "Humidifier EMPTY - refill"


def test_legacy_policy_state_active_means_problem_no_refire(
    temp_db: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    """Upgrade: old state stored problem in `active`; must not re-fire on same wet edge."""
    monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", temp_db)
    forced: list[tuple[str, bool]] = []
    monkeypatch.setattr(
        "dsc_brain.appliance_driver.force_set_sonoff_relay_sync",
        lambda seat, on: forced.append((seat, on)),
    )
    from dsc_brain.fleet_state import get_fleet_state, update_fleet_state
    from dsc_brain.zigbee_policies import evaluate_device_policies, save_zigbee_policies

    save_zigbee_policies(
        {
            "0xleg": {
                "recipe_id": "tank_full_appliance",
                "enabled": True,
                "params": {"seat_id": "dehumidifier", "problem_when": "active"},
            }
        }
    )
    fleet = get_fleet_state()
    fleet.system = dict(fleet.system)
    fleet.system["zigbee_policy_state"] = {
        "0xleg": {"recipe_id": "tank_full_appliance", "active": True}
    }
    fleet.system["critical_banners"] = []
    update_fleet_state(fleet)

    out = evaluate_device_policies(
        ieee="0xleg", friendly_name="tank_sensor", payload={"water_leak": True}
    )
    assert out is not None
    assert out["changed"] is False
    assert "action" not in out
    assert forced == []


def test_problem_when_inactive_oos_on_dry(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    # humidifier empty: dry → OOS
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
        ieee="0xhum", friendly_name="tank", payload={"occupancy": False}
    )
    assert out and out["action"] == "active"
    assert _seat("humidifier", temp_db)["in_service"] is False


def test_problem_when_inactive_clears_on_wet(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    # after empty OOS, wet → restore
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
            "0xhum2": {
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
    evaluate_device_policies(
        ieee="0xhum2", friendly_name="tank", payload={"occupancy": False}
    )
    assert _seat("humidifier", temp_db)["in_service"] is False

    out = evaluate_device_policies(
        ieee="0xhum2", friendly_name="tank", payload={"occupancy": True}
    )
    assert out and out["action"] == "clear"
    assert _seat("humidifier", temp_db)["in_service"] is True
    banners = get_fleet_state().system.get("critical_banners") or []
    assert not any(str(b.get("id", "")).startswith("zb-policy-0xhum2") for b in banners)


def test_mqtt_ingest_occupancy_as_tank_wet(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    """SNZB-03-fingerprinted liquid sensors publish wet on occupancy."""
    monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", temp_db)
    monkeypatch.setattr(
        "dsc_brain.appliance_driver.force_set_sonoff_relay_sync",
        lambda *_a, **_k: None,
    )

    from dsc_brain.zigbee_mqtt import _ingest, save_zigbee_bindings
    from dsc_brain.zigbee_policies import save_zigbee_policies

    save_zigbee_bindings(
        {
            "0xocc": {
                "role": "leak_tank",
                "zone": "4x8",
                "enabled": True,
                "friendly_name": "tank_occ",
            }
        }
    )
    save_zigbee_policies(
        {
            "0xocc": {
                "recipe_id": "tank_full_appliance",
                "enabled": True,
                "params": {},
            }
        }
    )
    _ingest._devices = [
        {"ieee_address": "0xocc", "friendly_name": "tank_occ", "type": "EndDevice"}
    ]
    _ingest._by_role = {}
    _ingest._canopy = {}

    class _Msg:
        topic = "zigbee2mqtt/tank_occ"
        payload = b'{"occupancy": true}'

    _ingest._on_message(None, None, _Msg())
    assert _seat("dehumidifier", temp_db)["in_service"] is False
    assert _ingest._by_role.get("leak_tank", {}).get("wet") is True
