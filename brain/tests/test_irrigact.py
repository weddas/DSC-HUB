"""IrrigAct unit tests."""

from __future__ import annotations

from pathlib import Path

import pytest


def test_irrigation_oos_without_pump(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", temp_db)
    from dsc_brain.irrigact import irrigation_shot
    from dsc_brain.zigbee_mqtt import save_zigbee_bindings

    save_zigbee_bindings({})
    out = irrigation_shot(pot_id="pot1")
    assert out["ok"] is False
    assert out["status"] == "oos"
    assert out["reason"] == "no_pump_seat"


def test_irrigation_commands_plug_pump(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", temp_db)
    from dsc_brain.irrigact import irrigation_shot
    from dsc_brain.zigbee_mqtt import _ingest, save_zigbee_bindings

    save_zigbee_bindings(
        {
            "0xpump": {
                "role": "plug_pump",
                "zone": "4x8",
                "enabled": True,
                "friendly_name": "pump1",
            }
        }
    )
    published: list[tuple[str, str]] = []

    class _Client:
        def publish(self, topic: str, payload: str) -> None:
            published.append((topic, payload))

    _ingest._client = _Client()
    out = irrigation_shot(pot_id="pot2", duration_s="3")
    assert out["ok"] is True
    assert out["status"] == "commanded"
    assert out["seat"]["friendly_name"] == "pump1"
    assert published and published[0][0] == "zigbee2mqtt/pump1/set"
    assert "ON" in published[0][1]
