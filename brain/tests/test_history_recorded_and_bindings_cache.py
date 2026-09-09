"""Probe fault binaries are recorded per seat; /history distinguishes never-recorded;
Zigbee bindings come from a cache the save invalidates; a hub write says it is unconfirmed."""

from __future__ import annotations

from pathlib import Path

import pytest


def test_probe_device_binaries_resolve_to_the_pot_seat():
    from dsc_brain.history_ops import resolve_entity_metric

    assert resolve_entity_metric("binary_sensor.dsc_probe1_sensor_fault") == ("pot1", "bin_sensor_fault")
    assert resolve_entity_metric("binary_sensor.dsc_probe2_modbus_probe_online") == ("pot2", "bin_modbus_probe_online")
    # computed trust flags stay with the computed recorder
    assert resolve_entity_metric("binary_sensor.dsc_probe1_sensor_stuck")[0] == "computed"


def test_history_reports_recorded_separately_from_tracked(temp_db: Path, monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", temp_db)
    import time

    from fastapi.testclient import TestClient

    from dsc_brain.api import app
    from dsc_brain.settings import record_history

    monkeypatch.setattr("dsc_brain.settings._last_history_prune", time.time())
    client = TestClient(app)
    r = client.get("/history", params={"entity_id": "binary_sensor.dsc_probe1_sensor_fault", "hours": 1}).json()
    assert r["tracked"] is True and r["recorded"] is False and r["points"] == []
    record_history("pot1", "bin_sensor_fault", 1.0, ts=time.time() - 60, db_path=temp_db)
    r = client.get("/history", params={"entity_id": "binary_sensor.dsc_probe1_sensor_fault", "hours": 1}).json()
    assert r["recorded"] is True and len(r["points"]) == 1


def test_bindings_cache_is_invalidated_by_save(monkeypatch: pytest.MonkeyPatch):
    from dsc_brain import zigbee_mqtt as zm

    calls = {"n": 0}

    def fake_load():
        calls["n"] += 1
        return {"0xabc": {"role": "canopy_4x8", "enabled": True}}

    monkeypatch.setattr(zm, "load_zigbee_bindings", fake_load)
    zm.invalidate_bindings_cache()
    zm.cached_zigbee_bindings()
    zm.cached_zigbee_bindings()
    assert calls["n"] == 1  # second read served from the cache
    zm.invalidate_bindings_cache()
    zm.cached_zigbee_bindings()
    assert calls["n"] == 2


def test_hub_write_response_is_marked_unconfirmed():
    import inspect

    from dsc_brain import control_ops as co

    src = inspect.getsource(co._hub_number)
    assert '"confirmed": False' in src
