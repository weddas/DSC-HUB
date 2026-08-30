"""Zigbee capability class inference and catalog filtering."""

from __future__ import annotations

from pathlib import Path

import pytest


def test_infer_climate() -> None:
    from dsc_brain.zigbee_mqtt import infer_capability_class

    assert infer_capability_class({"temperature", "humidity"}, set()) == "climate"


def test_infer_liquid_from_water_leak() -> None:
    from dsc_brain.zigbee_mqtt import infer_capability_class

    assert infer_capability_class({"water_leak", "battery"}, set()) == "liquid"


def test_infer_occupancy_alone_is_motion() -> None:
    from dsc_brain.zigbee_mqtt import infer_capability_class

    assert infer_capability_class({"occupancy", "battery"}, set()) == "motion"


def test_infer_liquid_wins_over_climate_keys() -> None:
    from dsc_brain.zigbee_mqtt import infer_capability_class

    assert infer_capability_class({"water_leak", "temperature"}, set()) == "liquid"


def test_infer_other_when_unknown() -> None:
    from dsc_brain.zigbee_mqtt import infer_capability_class

    assert infer_capability_class({"battery", "linkquality"}, set()) == "other"


def test_filter_climate_roles_exclude_leak() -> None:
    from dsc_brain.zigbee_mqtt import filter_roles_for_class, get_zigbee_role_catalog

    roles = filter_roles_for_class("climate", get_zigbee_role_catalog())
    ids = {r["id"] for r in roles}
    assert "intake" in ids and "canopy_4x8" in ids
    assert "leak_tank" not in ids
    assert "unbound" in ids


def test_filter_liquid_roles_safety_only() -> None:
    from dsc_brain.zigbee_mqtt import filter_roles_for_class, get_zigbee_role_catalog

    roles = filter_roles_for_class("liquid", get_zigbee_role_catalog())
    ids = {r["id"] for r in roles}
    assert "leak_tank" in ids and "leak_floor" in ids
    assert "intake" not in ids
    assert "unbound" in ids


def test_filter_motion_roles_unbound_only() -> None:
    from dsc_brain.zigbee_mqtt import filter_roles_for_class, get_zigbee_role_catalog

    roles = filter_roles_for_class("motion", get_zigbee_role_catalog())
    ids = {r["id"] for r in roles}
    assert ids == {"unbound"}


def test_filter_recipes_liquid_includes_tank_full() -> None:
    from dsc_brain.zigbee_mqtt import filter_recipes_for_class
    from dsc_brain.zigbee_policies import get_recipe_catalog

    recipes = filter_recipes_for_class("liquid", get_recipe_catalog())
    ids = {r["id"] for r in recipes}
    assert "none" in ids
    assert "tank_full_appliance" in ids


def test_filter_recipes_climate_none_only() -> None:
    from dsc_brain.zigbee_mqtt import filter_recipes_for_class
    from dsc_brain.zigbee_policies import get_recipe_catalog

    recipes = filter_recipes_for_class("climate", get_recipe_catalog())
    ids = {r["id"] for r in recipes}
    assert ids == {"none"}


def test_get_zigbee_devices_capability_class_from_state(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    from dsc_brain.zigbee_mqtt import _ingest, get_zigbee_devices

    _ingest._devices = [
        {
            "ieee_address": "0xclimate",
            "friendly_name": "intake_sensor",
            "type": "EndDevice",
        }
    ]
    _ingest._device_states = {
        "intake_sensor": {
            "friendly_name": "intake_sensor",
            "temperature": 22.0,
            "humidity": 55.0,
        }
    }
    devices = get_zigbee_devices()
    end = next(d for d in devices if d["ieee_address"] == "0xclimate")
    assert end["capability_class"] == "climate"
    _ingest._devices = []
    _ingest._device_states = {}


def test_get_zigbee_devices_capability_override(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    from dsc_brain.zigbee_mqtt import _ingest, get_zigbee_devices

    monkeypatch.setattr(
        "dsc_brain.zigbee_mqtt.load_zigbee_bindings",
        lambda: {
            "0xmotion": {
                "role": "leak_tank",
                "enabled": True,
                "capability_override": "liquid",
            }
        },
    )
    _ingest._devices = [
        {
            "ieee_address": "0xmotion",
            "friendly_name": "occ_sensor",
            "type": "EndDevice",
            "expose_props": ["occupancy", "battery"],
        }
    ]
    _ingest._device_states = {
        "occ_sensor": {"friendly_name": "occ_sensor", "occupancy": True}
    }
    devices = get_zigbee_devices()
    end = next(d for d in devices if d["ieee_address"] == "0xmotion")
    assert end["capability_class"] == "liquid"
    assert end.get("capability_override") == "liquid"
    _ingest._devices = []
    _ingest._device_states = {}


def test_save_binding_capability_override_persists(
    temp_db: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """Saved binding keeps capability_override; get_zigbee_devices honors it."""
    monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", temp_db)
    from dsc_brain.zigbee_mqtt import (
        _ingest,
        get_zigbee_devices,
        load_zigbee_bindings,
        save_zigbee_bindings,
    )

    saved = save_zigbee_bindings(
        {
            "0xmotion": {
                "role": "leak_tank",
                "zone": "4x8",
                "enabled": True,
                "friendly_name": "occ_sensor",
                "capability_override": "liquid",
            }
        }
    )
    assert saved["0xmotion"]["capability_override"] == "liquid"
    loaded = load_zigbee_bindings()
    assert loaded["0xmotion"]["capability_override"] == "liquid"

    _ingest._devices = [
        {
            "ieee_address": "0xmotion",
            "friendly_name": "occ_sensor",
            "type": "EndDevice",
            "expose_props": ["occupancy", "battery"],
        }
    ]
    _ingest._device_states = {
        "occ_sensor": {"friendly_name": "occ_sensor", "occupancy": True}
    }
    devices = get_zigbee_devices()
    end = next(d for d in devices if d["ieee_address"] == "0xmotion")
    assert end["capability_class"] == "liquid"
    assert end.get("capability_override") == "liquid"
    _ingest._devices = []
    _ingest._device_states = {}
