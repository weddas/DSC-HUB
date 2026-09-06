"""Sonoff appliance driver — stale-hub failsafe and operator-flip cache sync.

Both findings surfaced while building automation rule engine v2 (2026-09-06):

* the failsafe must force OFF even an out-of-service seat whose relay is physically
  ON (a heater left on with no hub supervision is a safety gap), and
* an operator ``/control/service`` relay flip must land in the driver's cache so the
  next 2 s tick re-asserts hub demand instead of early-returning on stale state.
"""

from __future__ import annotations

import asyncio
import contextlib
import time

import pytest


def test_stale_hub_failsafe_forces_off_even_when_seat_oos(monkeypatch: pytest.MonkeyPatch) -> None:
    from dsc_brain import appliance_driver as drv

    calls: list[tuple[str, bool, bool]] = []

    async def fake_set(seat_id: str, on: bool, inventory: dict, *, force: bool = False) -> None:
        calls.append((seat_id, on, force))

    async def no_demands(_hub_row: dict) -> None:
        return None  # hub unreadable -> demands None -> stale path

    monkeypatch.setattr(drv, "_set_sonoff_relay", fake_set)
    monkeypatch.setattr(drv, "_read_hub_demands", no_demands)
    monkeypatch.setattr(
        drv,
        "list_inventory",
        lambda: [
            {"seat_id": "hub", "in_service": True, "host": "10.0.0.1"},
            # OOS seat with its relay physically ON (manual flip)
            {"seat_id": "heater", "in_service": False, "host": "10.0.0.2"},
        ],
    )
    drv._relay_commanded.clear()
    drv._relay_commanded["heater"] = True
    monkeypatch.setattr(drv, "_last_hub_ok", time.time() - drv.STALE_SEC - 5)

    asyncio.run(drv._tick_once())

    assert ("heater", False, True) in calls, calls
    # every driven seat is forced OFF, not just the cached ones
    forced = {seat for seat, on, force in calls if on is False and force}
    assert forced >= set(drv.DEMAND_TO_SEAT.values())
    assert not drv._relay_commanded


def test_operator_sonoff_flip_updates_driver_cache(monkeypatch: pytest.MonkeyPatch) -> None:
    from dsc_brain import appliance_driver as drv
    from dsc_brain import control_ops as co

    entity = next(e for e, seat in co._SONOFF_RELAY_ENTITY_TO_SEAT.items() if seat == "heater")

    monkeypatch.setattr(
        co, "_inventory_row", lambda seat: {"seat_id": seat, "in_service": True, "host": "10.0.0.9"}
    )
    monkeypatch.setattr(co, "_api_key", lambda _row, _seat: "")

    async def keys(_host: str, _api_key: str, _seat: str, _wanted: set) -> dict[str, int]:
        return {"main_relay": 7}

    monkeypatch.setattr(co, "_ensure_switch_keys", keys)

    @contextlib.asynccontextmanager
    async def no_lock(_host: str):
        yield

    monkeypatch.setattr(co, "host_lock", no_lock)

    class FakeClient:
        def __init__(self) -> None:
            self.cmds: list[tuple[int, bool]] = []

        async def connect(self, login: bool = True) -> None:
            return None

        def switch_command(self, key: int, on: bool) -> None:
            self.cmds.append((key, on))

        async def disconnect(self) -> None:
            return None

    fake = FakeClient()
    monkeypatch.setattr(co, "make_api_client", lambda _host, _key: fake)
    drv._relay_commanded.clear()

    out = asyncio.run(co._sonoff_switch(entity, True))

    assert out["state"] == "on"
    assert fake.cmds == [(7, True)]
    assert drv._relay_commanded["heater"] is True
