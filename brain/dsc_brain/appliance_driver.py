"""Pi appliance path — hub demand switches → Sonoff main_relay (replaces ETH01 bridge)."""

from __future__ import annotations

import asyncio
import logging
import os
import time
from typing import Any

from .native_api import make_api_client
from .settings import get_setting, list_inventory, record_history

_logger = logging.getLogger(__name__)

# Hub template switch object_id → fleet seat_id (Native API on Pi subnet).
DEMAND_TO_SEAT: dict[str, str] = {
    "heater_demand": "heater",
    "humidifier_demand": "humidifier",
    "dehumidifier_demand": "dehumidifier",
    "growmat_demand": "heatmat",
}

STALE_SEC = 45.0
POLL_SEC = 2.0
SONOFF_SWITCH_OBJECT = "main_relay"

_status: dict[str, Any] = {
    "hub_ok": False,
    "relays": {},
    "last_hub_seen": None,
    "updated_at": 0.0,
}

_relay_commanded: dict[str, bool] = {}
_hub_switch_keys: dict[str, int] = {}
_sonoff_switch_keys: dict[str, int] = {}
_last_hub_ok = 0.0

_task: asyncio.Task[None] | None = None
_running = False


def get_appliance_status() -> dict[str, Any]:
    return dict(_status)


def _api_key_for(seat_id: str, row: dict[str, Any]) -> str:
    key = row.get("api_key") or ""
    if key:
        return key
    env_key = f"DSC_{seat_id.upper()}_API_KEY"
    return os.environ.get(env_key, "") or get_setting(f"dsc_{seat_id}_api_key", "")


async def _read_hub_demands(hub_row: dict[str, Any]) -> dict[str, bool] | None:
    host = hub_row.get("host") or ""
    api_key = _api_key_for("hub", hub_row) or get_setting("dsc_hub_api_key", "")
    if not host:
        return None

    client = make_api_client(host, api_key)
    try:
        await client.connect(login=True)
        entities, _services = await client.list_entities_services()
        global _hub_switch_keys
        if not _hub_switch_keys:
            for ent in entities:
                oid = str(getattr(ent, "object_id", ""))
                if oid in DEMAND_TO_SEAT and hasattr(ent, "key"):
                    _hub_switch_keys[oid] = int(ent.key)

        key_to_oid = {v: k for k, v in _hub_switch_keys.items()}
        live: dict[int, bool] = {}

        def on_state(state: Any) -> None:
            oid = key_to_oid.get(getattr(state, "key", -1))
            if oid:
                live[oid] = bool(getattr(state, "state", False))

        unsub = client.subscribe_states(on_state)
        await asyncio.sleep(0.8)
        if unsub:
            unsub()

        out: dict[str, bool] = {}
        for oid in DEMAND_TO_SEAT:
            out[oid] = live.get(oid, False)
        return out
    except Exception as exc:  # noqa: BLE001
        _logger.debug("hub demand read failed @ %s: %s", host, exc)
        return None
    finally:
        try:
            await client.disconnect()
        except Exception:  # noqa: BLE001
            pass


async def _set_sonoff_relay(seat_id: str, on: bool, inventory: dict[str, dict[str, Any]]) -> None:
    if _relay_commanded.get(seat_id) is on:
        return

    row = inventory.get(seat_id)
    if not row or not row.get("in_service"):
        return
    host = row.get("host") or ""
    api_key = _api_key_for(seat_id, row)
    if not host:
        return

    client = make_api_client(host, api_key)
    try:
        await client.connect(login=True)
        global _sonoff_switch_keys
        if seat_id not in _sonoff_switch_keys:
            entities, _services = await client.list_entities_services()
            for ent in entities:
                if str(getattr(ent, "object_id", "")) == SONOFF_SWITCH_OBJECT and hasattr(ent, "key"):
                    _sonoff_switch_keys[seat_id] = int(ent.key)
                    break
        key = _sonoff_switch_keys.get(seat_id)
        if key is None:
            _logger.warning("Sonoff %s missing %s switch entity", seat_id, SONOFF_SWITCH_OBJECT)
            return
        client.switch_command(key, on)
        _relay_commanded[seat_id] = on
        record_history(seat_id, "relay_on", 1.0 if on else 0.0, time.time())
        _logger.info("appliance %s main_relay -> %s", seat_id, "ON" if on else "OFF")
    except Exception as exc:  # noqa: BLE001
        _logger.warning("Sonoff %s @ %s command failed: %s", seat_id, host, exc)
    finally:
        try:
            await client.disconnect()
        except Exception:  # noqa: BLE001
            pass


async def _tick_once() -> None:
    global _last_hub_ok

    inventory_list = list_inventory()
    inventory = {str(r["seat_id"]): r for r in inventory_list}
    hub_row = inventory.get("hub")
    now = time.time()
    relays: dict[str, bool] = dict(_relay_commanded)

    if not hub_row or not hub_row.get("in_service"):
        _publish_status(False, relays, now)
        return

    demands = await _read_hub_demands(hub_row)
    if demands is not None:
        _last_hub_ok = now
        for object_id, on in demands.items():
            seat_id = DEMAND_TO_SEAT[object_id]
            await _set_sonoff_relay(seat_id, on, inventory)
            relays[seat_id] = on
    elif now - _last_hub_ok > STALE_SEC:
        _logger.warning("hub demand stale >%ss — Sonoff failsafe OFF", int(STALE_SEC))
        for seat_id in set(DEMAND_TO_SEAT.values()):
            await _set_sonoff_relay(seat_id, False, inventory)
            relays[seat_id] = False
        _relay_commanded.clear()

    hub_fresh = demands is not None or (now - _last_hub_ok <= STALE_SEC)
    _publish_status(hub_fresh and _last_hub_ok > 0, relays, now)


def _publish_status(hub_ok: bool, relays: dict[str, bool], now: float) -> None:
    global _status
    _status = {
        "hub_ok": hub_ok,
        "relays": relays,
        "last_hub_seen": _last_hub_ok if _last_hub_ok > 0 else None,
        "updated_at": now,
    }


async def _run() -> None:
    while _running:
        try:
            await _tick_once()
        except Exception as exc:  # noqa: BLE001
            _logger.warning("appliance driver tick failed: %s", exc)
        await asyncio.sleep(POLL_SEC)


def start_appliance_driver() -> None:
    global _task, _running
    if _task is not None:
        return
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        _logger.warning("Appliance driver not started — no running event loop")
        return
    _running = True
    _task = loop.create_task(_run())
    _logger.info("Pi appliance driver started (hub demand → Sonoff relays)")


async def stop_appliance_driver() -> None:
    global _task, _running
    _running = False
    if _task:
        _task.cancel()
        try:
            await _task
        except asyncio.CancelledError:
            pass
        _task = None
