"""Coldest root must ignore Modbus-dark / sensor-fault pots."""

from __future__ import annotations

from types import SimpleNamespace

from dsc_brain.dash_computed import _coldest_root_zone


def _pot(n: int, soil_temp_c: float, *, fault: bool = False, modbus: bool = True) -> SimpleNamespace:
    return SimpleNamespace(
        online=True,
        values={
            "soil_temp_c": soil_temp_c,
            "binaries": {"sensor_fault": fault, "modbus_probe_online": modbus},
        },
    )


def test_coldest_skips_faulted_and_modbus_dark(monkeypatch):
    monkeypatch.setattr("dsc_brain.dash_computed.get_helper", lambda *_a, **_k: "on")
    fleet = SimpleNamespace(
        pots={
            "pot1": _pot(1, 18.0, fault=True, modbus=False),
            "pot2": _pot(2, 22.0, fault=True, modbus=False),
        }
    )
    t, pot = _coldest_root_zone(fleet)
    assert t is None
    assert pot == "none"


def test_coldest_uses_trusted_soil_temp(monkeypatch):
    monkeypatch.setattr("dsc_brain.dash_computed.get_helper", lambda *_a, **_k: "on")
    fleet = SimpleNamespace(
        pots={
            "pot1": _pot(1, 18.0, fault=True, modbus=False),
            "pot2": _pot(2, 21.5, fault=False, modbus=True),
        }
    )
    t, pot = _coldest_root_zone(fleet)
    assert t == 21.5
    assert pot == "2"
