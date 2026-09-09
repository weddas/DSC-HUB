"""Plausibility: clamps are editable and read back, a railed reading is rejected (None),
the hub's fault flags mask their zone, and VPD never outlives its inputs."""

from __future__ import annotations

from pathlib import Path

import pytest


def test_sensor_clamp_patch_round_trips_and_validates(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.global_modifiers import get_global_modifiers, set_global_modifiers

    assert get_global_modifiers()["sensor_clamp"]["temp_c"]["max"] == 45.0  # inside the 50 °C rail
    saved = set_global_modifiers({"sensor_clamp": {"temp_c": {"max": 42.0}}})
    assert saved["sensor_clamp"]["temp_c"] == {"min": -5.0, "max": 42.0}
    assert get_global_modifiers()["sensor_clamp"]["temp_c"]["max"] == 42.0  # actually stored and read back
    with pytest.raises(ValueError):
        set_global_modifiers({"sensor_clamp": {"temp_c": {"min": 50.0, "max": 40.0}}})
    with pytest.raises(ValueError):
        set_global_modifiers({"sensor_clamp": {"rh_pct": {"max": 140.0}}})
    with pytest.raises(ValueError):
        set_global_modifiers({"sensor_clamp": {"pressure": {"max": 1.0}}})


def test_railed_reading_is_rejected_not_clamped(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.global_modifiers import apply_temp_rh_offsets

    t, rh, bad = apply_temp_rh_offsets(50.0, 100.0, "main")  # the 2026-09-08 fault signature
    assert t is None and rh is None and bad is True
    t, rh, bad = apply_temp_rh_offsets(47.0, 60.0, "main")  # above the clamp, below the rail
    assert t is None and rh == 60.0 and bad is True
    t, rh, bad = apply_temp_rh_offsets(24.0, 100.0, "main")  # saturation with a sane temperature is real
    assert t == 24.0 and rh == 100.0 and bad is False


def test_hub_pipeline_drops_railed_values_and_their_vpd(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.climate_math import finalize_hub_climate
    from dsc_brain.esphome_client import _apply_hub_climate_modifiers, _scrub_faulted_climate

    values = {"temp_c": 50.0, "rh_pct": 100.0, "vpd_kpa": 0.0, "room_temp_c": 22.0, "room_rh_pct": 55.0, "binaries": {}}
    _apply_hub_climate_modifiers(values)
    finalize_hub_climate(values)
    _scrub_faulted_climate(values)
    assert values["temp_c"] is None and values["rh_pct"] is None
    assert values["vpd_kpa"] is None  # the hub template's 0.0 must not survive its inputs
    assert values["sensor_clamp_active"] is True and "temp_c" in values["implausible"]
    assert values["room_temp_c"] == 22.0 and values["room_vpd_kpa"] is not None


def test_fault_binary_masks_its_zone(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.climate_math import finalize_hub_climate
    from dsc_brain.esphome_client import _apply_hub_climate_modifiers, _scrub_faulted_climate

    values = {
        "temp_c": 24.0,
        "rh_pct": 60.0,
        "clone_temp_c": 23.0,
        "clone_rh_pct": 65.0,
        "binaries": {"binary_sensor.dsc_hub_climate_sensor_fault": True},
    }
    _apply_hub_climate_modifiers(values)
    finalize_hub_climate(values)
    _scrub_faulted_climate(values)
    assert values["temp_c"] is None and values["rh_pct"] is None and values["vpd_kpa"] is None
    assert values["clone_temp_c"] == 23.0 and values["clone_vpd_kpa"] is not None  # aux zone untouched
    assert "temp_c" in values["climate_fault_masked"]
