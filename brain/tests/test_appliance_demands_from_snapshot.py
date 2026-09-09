"""The appliance driver reads hub demands from the ingest snapshot, not its own session."""

from __future__ import annotations

import asyncio
import time

import pytest

from dsc_brain import appliance_driver as drv
from dsc_brain.fleet_state import FleetState, SeatState, update_fleet_state

HUB_ROW = {"seat_id": "hub", "in_service": True, "host": "10.0.0.1"}


def _publish(controls: dict, *, online: bool = True, age_s: float = 0.0) -> None:
    f = FleetState()
    f.hub = SeatState("hub", online, "8.1.0.0", {"controls": controls}, time.time() - age_s)
    update_fleet_state(f)


def test_reads_only_discovered_demand_switches() -> None:
    _publish(
        {
            "switch.dsc_hub_heater_demand": {"state": "on"},
            "switch.dsc_hub_humidifier_demand": {"state": "off"},
            # grow_mat_demand deliberately absent: an alias must not be reported as False
        }
    )
    out = asyncio.run(drv._read_hub_demands(HUB_ROW))
    assert out == {"heater_demand": True, "humidifier_demand": False}


def test_stale_or_dark_hub_is_none() -> None:
    _publish({"switch.dsc_hub_heater_demand": {"state": "on"}}, age_s=drv.STALE_SEC + 1)
    assert asyncio.run(drv._read_hub_demands(HUB_ROW)) is None
    _publish({"switch.dsc_hub_heater_demand": {"state": "on"}}, online=False)
    assert asyncio.run(drv._read_hub_demands(HUB_ROW)) is None


def test_no_host_is_none() -> None:
    _publish({"switch.dsc_hub_heater_demand": {"state": "on"}})
    assert asyncio.run(drv._read_hub_demands({"seat_id": "hub", "in_service": True})) is None
