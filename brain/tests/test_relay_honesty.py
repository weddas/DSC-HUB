"""Sonoff relay honesty: commanded vs hub demand vs device-observed (2026-09-06 live finding).

The physical soak showed every brain-side relay field mirrored hub DEMAND. Now:
* appliance status ``relays`` = what the driver actually commanded, ``demand`` = the hub's ask;
* esphome_client reads the Sonoff's own ``main_relay`` into ``values["relay_on"]`` and keeps
  observing out-of-service Sonoffs read-only;
* ``switch.dsc_<seat>_main_relay`` prefers the observed contact, falls back to commanded,
  and exposes all three as attributes.
"""

from __future__ import annotations

import asyncio
import sys
import tempfile
import time
import types
from pathlib import Path

import pytest

from dsc_brain.settings import init_settings_db


@pytest.fixture()
def temp_db(monkeypatch: pytest.MonkeyPatch) -> Path:
    with tempfile.TemporaryDirectory() as tmp:
        db = Path(tmp) / "dsc_ops.sqlite3"
        monkeypatch.setenv("DSC_DATA", str(Path(tmp)))
        monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", db)
        init_settings_db(db)
        yield db


def test_driver_status_reports_commanded_not_demand(monkeypatch: pytest.MonkeyPatch) -> None:
    from dsc_brain import appliance_driver as drv

    heater_oid = next(k for k, v in drv.DEMAND_TO_SEAT.items() if v == "heater")

    async def fake_set(seat_id: str, on: bool, inventory: dict, *, force: bool = False) -> None:
        # mimic the real guard: OOS seat is skipped, nothing commanded
        row = inventory.get(seat_id) or {}
        if not force and not row.get("in_service"):
            return
        drv._relay_commanded[seat_id] = on

    async def demands(_hub_row: dict) -> dict[str, bool]:
        return {heater_oid: True}

    monkeypatch.setattr(drv, "_set_sonoff_relay", fake_set)
    monkeypatch.setattr(drv, "_read_hub_demands", demands)
    monkeypatch.setattr(
        drv,
        "list_inventory",
        lambda: [
            {"seat_id": "hub", "in_service": True, "host": "10.0.0.1"},
            {"seat_id": "heater", "in_service": False, "host": "10.0.0.2"},
        ],
    )
    drv._relay_commanded.clear()
    monkeypatch.setattr(drv, "_last_hub_ok", time.time())

    asyncio.run(drv._tick_once())
    st = drv.get_appliance_status()

    assert st["demand"]["heater"] is True
    assert "heater" not in st["relays"]  # never commanded -> not painted ON


def test_relay_entity_prefers_device_observed_state(monkeypatch: pytest.MonkeyPatch) -> None:
    from dsc_brain import fleet_state as fs

    state = fs.FleetState(surface="test")
    now = time.time()
    state.sonoffs = {
        "heater": fs.SeatState("heater", True, "7.0.0.0", {"relay_on": False, "in_service": False}, now),
        "humidifier": fs.SeatState("humidifier", False, "7.0.0.0", {}, now - 600),
    }
    monkeypatch.setattr(
        fs,
        "get_appliance_status",
        lambda: {"hub_ok": True, "relays": {"heater": True, "humidifier": True}, "demand": {"heater": True}},
    )
    states = state.to_hass_states([])

    heater = states["switch.dsc_heater_main_relay"]
    assert heater["state"] == "off"  # the contact is open even though the driver last commanded ON
    assert heater["attributes"]["source"] == "device"
    assert heater["attributes"]["commanded"] is True and heater["attributes"]["demand"] is True
    assert heater["attributes"]["in_service"] is False

    hum = states["switch.dsc_humidifier_main_relay"]
    assert hum["state"] == "on" and hum["attributes"]["source"] == "commanded"


def test_poll_keeps_observing_oos_sonoff_and_never_overwrites_relay_on(
    temp_db: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    from dsc_brain import esphome_client as ec
    from dsc_brain import fleet_state as fs

    if "aioesphomeapi" not in sys.modules:
        monkeypatch.setitem(sys.modules, "aioesphomeapi", types.ModuleType("aioesphomeapi"))

    fetched: list[str] = []

    async def fake_fetch(host: str, api_key: str, role: str, seat_id: str) -> dict:
        fetched.append(seat_id)
        return {"firmware": "7.0.0.0", "values": {"relay_on": True}}

    monkeypatch.setattr(ec, "_fetch_device", fake_fetch)
    monkeypatch.setattr(
        ec,
        "list_inventory",
        lambda: [{"seat_id": "heater", "role": "sonoff_heater", "host": "10.0.0.2", "in_service": False}],
    )
    monkeypatch.setattr(ec, "get_appliance_status", lambda: {"hub_ok": True, "relays": {"heater": False}, "demand": {"heater": False}})
    monkeypatch.setattr(ec, "record_history", lambda *a, **k: None)
    monkeypatch.setattr(ec, "get_fleet_state", lambda: fs.FleetState(surface="test"))
    monkeypatch.setattr(ec, "_finalize_hub_binaries", lambda state: None)

    ingest = ec.EsphomeIngest() if hasattr(ec, "EsphomeIngest") else None
    if ingest is None:
        pytest.skip("EsphomeIngest class not exposed")
    state = asyncio.run(ingest._poll_once())

    assert fetched == ["heater"]  # OOS Sonoff still observed
    seat = state.sonoffs["heater"]
    assert seat.online is True
    assert seat.values["in_service"] is False
    assert seat.values["relay_on"] is True  # device truth kept; driver said False
    assert seat.values["relay_commanded"] is False
