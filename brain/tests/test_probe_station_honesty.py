"""Dual-home probe station thereabouts must not lie when home Modbus/fault disagree."""

from __future__ import annotations

import tempfile
import time
from pathlib import Path

import pytest

from dsc_brain.fleet_state import FleetState, SeatState, update_fleet_state
from dsc_brain.settings import init_settings_db, upsert_inventory
from dsc_brain.soil_tests import list_probe_stations


@pytest.fixture()
def station_db(monkeypatch: pytest.MonkeyPatch) -> Path:
    with tempfile.TemporaryDirectory() as tmp:
        db = Path(tmp) / "dsc_ops.sqlite3"
        monkeypatch.setenv("DSC_DATA", str(Path(tmp)))
        monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", db)
        init_settings_db(db)
        yield db


def test_list_probe_stations_withholds_thereabouts_when_home_modbus_dark(station_db: Path) -> None:
    upsert_inventory(
        "pot2",
        {
            "extra": {
                "role": "probe_station",
                "idle_home_pot_id": "pot1",
                "tent": "2x4",
                "reading_mode": "idle",
            }
        },
        station_db,
        create=True,
    )
    fleet = FleetState()
    fleet.pots["pot1"] = SeatState(
        "pot1",
        True,
        "fw",
        {
            "moisture_pct": 55.0,
            "soil_temp_c": 22.0,
            "binaries": {"modbus_probe_online": False, "sensor_fault": False},
        },
        time.time(),
    )
    fleet.pots["pot2"] = SeatState("pot2", False, "fw", {}, time.time())
    update_fleet_state(fleet)

    stations = list_probe_stations()
    st = next(s for s in stations if s["seat_id"] == "pot2")
    assert st["home_modbus_ok"] is False
    assert st["home_trustworthy"] is False
    assert "moisture_pct" not in st["thereabouts"]


def test_list_probe_stations_shows_home_when_trustworthy(station_db: Path) -> None:
    upsert_inventory(
        "pot2",
        {
            "extra": {
                "role": "probe_station",
                "idle_home_pot_id": "pot1",
                "tent": "2x4",
                "reading_mode": "idle",
            }
        },
        station_db,
        create=True,
    )
    fleet = FleetState()
    fleet.pots["pot1"] = SeatState(
        "pot1",
        True,
        "fw",
        {
            "moisture_pct": 55.0,
            "soil_temp_c": 22.0,
            "binaries": {"modbus_probe_online": True, "sensor_fault": False},
        },
        time.time(),
    )
    update_fleet_state(fleet)

    stations = list_probe_stations()
    st = next(s for s in stations if s["seat_id"] == "pot2")
    assert st["home_trustworthy"] is True
    assert st["thereabouts"]["moisture_pct"] == 55.0
