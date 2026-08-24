"""Proxy HA-shaped service calls to Native API / settings on Pi."""

from __future__ import annotations

import asyncio
import logging
from typing import Any

from .native_api import make_api_client
from .compose_ops import handle_script
from .compose_store import set_helper
from .settings import list_inventory, upsert_inventory

_logger = logging.getLogger(__name__)

from .hub_controls import (
    HUB_FAN_ENTITY_TO_OID,
    HUB_LIGHT_ENTITY_TO_OID,
    HUB_NUMBER_ENTITY_TO_OID,
    HUB_SELECT_ENTITY_TO_OID,
    HUB_SWITCH_ENTITY_TO_OID,
)

_IN_SERVICE_ENTITY_TO_SEAT: dict[str, str] = {
    "input_boolean.dsc_ac_in_service": "ac",
    "input_boolean.dsc_clone_humidifier_in_service": "mister",
    "input_boolean.dsc_pot1_in_service": "pot1",
    "input_boolean.dsc_pot2_in_service": "pot2",
    "input_boolean.dsc_pot3_in_service": "pot3",
    "input_boolean.dsc_pot4_in_service": "pot4",
    "input_boolean.dsc_tank_in_service": "tank",
}

_SONOFF_RELAY_ENTITY_TO_SEAT: dict[str, str] = {
    "switch.dsc_heater_main_relay": "heater",
    "switch.dsc_heatmat_main_relay": "heatmat",
    "switch.dsc_humidifier_main_relay": "humidifier",
    "switch.dsc_de_humidifier_main_relay": "dehumidifier",
    "switch.dsc_ac_main_relay": "ac",
    "switch.dsc_clone_humidifier_main_relay": "mister",
}

_NUMBER_ENTITY_TO_OID = HUB_NUMBER_ENTITY_TO_OID

_switch_keys: dict[str, dict[str, int]] = {}
_number_keys: dict[str, dict[str, int]] = {}
_fan_keys: dict[str, dict[str, int]] = {}
_light_keys: dict[str, dict[str, int]] = {}
_select_keys: dict[str, dict[str, int]] = {}
_select_options: dict[str, dict[str, list[str]]] = {}


def _inventory_row(seat_id: str) -> dict[str, Any] | None:
    for row in list_inventory():
        if row.get("seat_id") == seat_id:
            return row
    return None


def _api_key(row: dict[str, Any] | None, seat_id: str) -> str:
    import os

    if row and row.get("api_key"):
        return str(row["api_key"])
    env_key = f"DSC_{seat_id.upper()}_API_KEY"
    return os.environ.get(env_key, "")


async def _ensure_entity_keys(
    host: str,
    api_key: str,
    cache_key: str,
    object_ids: set[str],
    store: dict[str, dict[str, int]],
) -> dict[str, int]:
    if cache_key in store and all(oid in store[cache_key] for oid in object_ids):
        return store[cache_key]

    client = make_api_client(host, api_key)
    try:
        await client.connect(login=True)
        entities, _services = await client.list_entities_services()
        keys: dict[str, int] = dict(store.get(cache_key, {}))
        for ent in entities:
            oid = str(getattr(ent, "object_id", ""))
            if oid in object_ids and hasattr(ent, "key"):
                keys[oid] = int(ent.key)
        store[cache_key] = keys
        return keys
    finally:
        try:
            await client.disconnect()
        except Exception:  # noqa: BLE001
            pass


async def _ensure_select_meta(
    host: str,
    api_key: str,
    cache_key: str,
    object_ids: set[str],
) -> tuple[dict[str, int], dict[str, list[str]]]:
    keys = await _ensure_entity_keys(host, api_key, cache_key, object_ids, _select_keys)
    if cache_key in _select_options and all(oid in _select_options[cache_key] for oid in object_ids):
        return keys, _select_options[cache_key]

    client = make_api_client(host, api_key)
    try:
        await client.connect(login=True)
        entities, _services = await client.list_entities_services()
        opts: dict[str, list[str]] = dict(_select_options.get(cache_key, {}))
        for ent in entities:
            oid = str(getattr(ent, "object_id", ""))
            if oid in object_ids and hasattr(ent, "options"):
                opts[oid] = list(getattr(ent, "options", []) or [])
        _select_options[cache_key] = opts
        return keys, opts
    finally:
        try:
            await client.disconnect()
        except Exception:  # noqa: BLE001
            pass


async def _ensure_switch_keys(host: str, api_key: str, cache_key: str, object_ids: set[str]) -> dict[str, int]:
    return await _ensure_entity_keys(host, api_key, cache_key, object_ids, _switch_keys)


async def _ensure_number_keys(host: str, api_key: str, cache_key: str, object_ids: set[str]) -> dict[str, int]:
    return await _ensure_entity_keys(host, api_key, cache_key, object_ids, _number_keys)


async def _hub_switch(entity_id: str, on: bool) -> dict[str, Any]:
    oid = _HUB_SWITCH_ENTITY_TO_OID.get(entity_id)
    if not oid:
        raise ValueError(f"unsupported hub switch {entity_id}")
    row = _inventory_row("hub")
    host = (row or {}).get("host") or ""
    api_key = _api_key(row, "hub")
    if not host:
        raise RuntimeError("hub host not configured in inventory")

    keys = await _ensure_switch_keys(host, api_key, "hub", set(_HUB_SWITCH_ENTITY_TO_OID.values()))
    key = keys.get(oid)
    if key is None:
        raise RuntimeError(f"hub switch {oid} not found")

    client = make_api_client(host, api_key)
    try:
        await client.connect(login=True)
        client.switch_command(key, on)
        return {"entity_id": entity_id, "state": "on" if on else "off"}
    finally:
        try:
            await client.disconnect()
        except Exception:  # noqa: BLE001
            pass


async def _sonoff_switch(entity_id: str, on: bool) -> dict[str, Any]:
    seat_id = _SONOFF_RELAY_ENTITY_TO_SEAT.get(entity_id)
    if not seat_id:
        raise ValueError(f"unsupported sonoff switch {entity_id}")
    row = _inventory_row(seat_id)
    if not row or not row.get("in_service"):
        raise RuntimeError(f"{seat_id} not in service")
    host = row.get("host") or ""
    api_key = _api_key(row, seat_id)
    if not host:
        raise RuntimeError(f"{seat_id} host not configured")

    keys = await _ensure_switch_keys(host, api_key, seat_id, {"main_relay"})
    key = keys.get("main_relay")
    if key is None:
        raise RuntimeError(f"{seat_id} main_relay not found")

    client = make_api_client(host, api_key)
    try:
        await client.connect(login=True)
        client.switch_command(key, on)
        return {"entity_id": entity_id, "state": "on" if on else "off"}
    finally:
        try:
            await client.disconnect()
        except Exception:  # noqa: BLE001
            pass


async def _hub_number(entity_id: str, value: float) -> dict[str, Any]:
    oid = _NUMBER_ENTITY_TO_OID.get(entity_id)
    if not oid:
        raise ValueError(f"unsupported hub number {entity_id}")
    row = _inventory_row("hub")
    host = (row or {}).get("host") or ""
    api_key = _api_key(row, "hub")
    if not host:
        raise RuntimeError("hub host not configured")

    keys = await _ensure_number_keys(host, api_key, "hub", set(_NUMBER_ENTITY_TO_OID.values()))
    key = keys.get(oid)
    if key is None:
        raise RuntimeError(f"hub number {oid} not found")

    client = make_api_client(host, api_key)
    try:
        await client.connect(login=True)
        client.number_command(key, value)
        return {"entity_id": entity_id, "state": str(value)}
    finally:
        try:
            await client.disconnect()
        except Exception:  # noqa: BLE001
            pass


async def _hub_fan(entity_id: str, percentage: int) -> dict[str, Any]:
    oid = HUB_FAN_ENTITY_TO_OID.get(entity_id)
    if not oid:
        raise ValueError(f"unsupported hub fan {entity_id}")
    row = _inventory_row("hub")
    host = (row or {}).get("host") or ""
    api_key = _api_key(row, "hub")
    if not host:
        raise RuntimeError("hub host not configured")

    keys = await _ensure_entity_keys(host, api_key, "hub", set(HUB_FAN_ENTITY_TO_OID.values()), _fan_keys)
    key = keys.get(oid)
    if key is None:
        raise RuntimeError(f"hub fan {oid} not found")

    pct = max(0, min(100, int(percentage)))
    client = make_api_client(host, api_key)
    try:
        await client.connect(login=True)
        client.fan_command(key, state=pct > 0, speed_level=pct)
        return {"entity_id": entity_id, "state": "on" if pct > 0 else "off", "percentage": pct}
    finally:
        try:
            await client.disconnect()
        except Exception:  # noqa: BLE001
            pass


async def _hub_light(entity_id: str, on: bool, brightness: int | None = None) -> dict[str, Any]:
    oid = HUB_LIGHT_ENTITY_TO_OID.get(entity_id)
    if not oid:
        raise ValueError(f"unsupported hub light {entity_id}")
    row = _inventory_row("hub")
    host = (row or {}).get("host") or ""
    api_key = _api_key(row, "hub")
    if not host:
        raise RuntimeError("hub host not configured")

    keys = await _ensure_entity_keys(host, api_key, "hub", set(HUB_LIGHT_ENTITY_TO_OID.values()), _light_keys)
    key = keys.get(oid)
    if key is None:
        raise RuntimeError(f"hub light {oid} not found")

    client = make_api_client(host, api_key)
    try:
        await client.connect(login=True)
        if on and brightness is not None:
            client.light_command(key, state=True, brightness=max(0, min(255, brightness)))
        else:
            client.light_command(key, state=on)
        return {"entity_id": entity_id, "state": "on" if on else "off"}
    finally:
        try:
            await client.disconnect()
        except Exception:  # noqa: BLE001
            pass


async def _hub_select(entity_id: str, option: str) -> dict[str, Any]:
    oid = HUB_SELECT_ENTITY_TO_OID.get(entity_id)
    if not oid:
        raise ValueError(f"unsupported hub select {entity_id}")
    row = _inventory_row("hub")
    host = (row or {}).get("host") or ""
    api_key = _api_key(row, "hub")
    if not host:
        raise RuntimeError("hub host not configured")

    keys, _opts = await _ensure_select_meta(host, api_key, "hub", set(HUB_SELECT_ENTITY_TO_OID.values()))
    key = keys.get(oid)
    if key is None:
        raise RuntimeError(f"hub select {oid} not found")

    client = make_api_client(host, api_key)
    try:
        await client.connect(login=True)
        client.select_command(key, option)
        return {"entity_id": entity_id, "state": option}
    finally:
        try:
            await client.disconnect()
        except Exception:  # noqa: BLE001
            pass


async def call_service_proxy(domain: str, service: str, data: dict[str, Any]) -> dict[str, Any]:
    entity_id = str(data.get("entity_id", ""))
    if not entity_id:
        raise ValueError("entity_id required")

    if domain == "input_boolean":
        seat = _IN_SERVICE_ENTITY_TO_SEAT.get(entity_id)
        if seat:
            if service == "turn_on":
                on = True
            elif service == "turn_off":
                on = False
            elif service == "toggle":
                row = _inventory_row(seat)
                on = not bool((row or {}).get("in_service", False))
            else:
                raise ValueError(f"unsupported input_boolean service {service}")
            upsert_inventory(seat, {"in_service": on})
            return {"entity_id": entity_id, "state": "on" if on else "off"}
        if entity_id.startswith("input_boolean.dsc_"):
            from .compose_store import get_helper

            if service == "turn_on":
                on = True
            elif service == "turn_off":
                on = False
            elif service == "toggle":
                on = get_helper(entity_id, "off") != "on"
            else:
                raise ValueError(f"unsupported input_boolean service {service}")
            set_helper(entity_id, "on" if on else "off")
            return {"entity_id": entity_id, "state": "on" if on else "off"}
        raise ValueError(f"unsupported input_boolean {entity_id}")

    if domain == "switch":
        if entity_id in _HUB_SWITCH_ENTITY_TO_OID:
            if service == "turn_on":
                on = True
            elif service == "turn_off":
                on = False
            elif service == "toggle":
                on = True
            else:
                raise ValueError(f"unsupported switch service {service}")
            return await _hub_switch(entity_id, on)
        if entity_id in _SONOFF_RELAY_ENTITY_TO_SEAT:
            on = service == "turn_on"
            if service == "turn_off":
                on = False
            return await _sonoff_switch(entity_id, on)
        raise ValueError(f"unsupported switch {entity_id}")

    if domain in ("number", "input_number") and service in ("set_value", "set"):
        value = data.get("value")
        if value is None:
            raise ValueError("value required")
        if entity_id in _NUMBER_ENTITY_TO_OID:
            return await _hub_number(entity_id, float(value))
        set_helper(entity_id, float(value))
        return {"entity_id": entity_id, "state": str(value)}

    if domain == "fan":
        if entity_id in HUB_FAN_ENTITY_TO_OID:
            if service == "turn_on":
                pct = int(data.get("percentage", 100))
                return await _hub_fan(entity_id, pct)
            if service == "turn_off":
                return await _hub_fan(entity_id, 0)
            if service == "set_percentage":
                pct = data.get("percentage")
                if pct is None:
                    raise ValueError("percentage required")
                return await _hub_fan(entity_id, int(pct))
            raise ValueError(f"unsupported fan service {service}")
        raise ValueError(f"unsupported fan {entity_id}")

    if domain == "light":
        if entity_id in HUB_LIGHT_ENTITY_TO_OID:
            if service == "turn_on":
                bri = data.get("brightness")
                return await _hub_light(entity_id, True, int(bri) if bri is not None else None)
            if service == "turn_off":
                return await _hub_light(entity_id, False)
            raise ValueError(f"unsupported light service {service}")
        raise ValueError(f"unsupported light {entity_id}")

    if domain == "select" and service == "select_option":
        option = str(data.get("option", ""))
        if not option:
            raise ValueError("option required")
        if entity_id in HUB_SELECT_ENTITY_TO_OID:
            return await _hub_select(entity_id, option)
        set_helper(entity_id, option)
        return {"entity_id": entity_id, "state": option}

    if domain == "input_select" and service == "select_option":
        option = str(data.get("option", ""))
        if not option:
            raise ValueError("option required")
        set_helper(entity_id, option)
        return {"entity_id": entity_id, "state": option}

    if domain in ("input_text", "text") and service == "set_value":
        value = str(data.get("value", ""))
        set_helper(entity_id, value)
        return {"entity_id": entity_id, "state": value}

    if domain == "input_datetime" and service == "set_datetime":
        date = str(data.get("date", ""))
        if date:
            set_helper(entity_id, date)
            return {"entity_id": entity_id, "state": date}
        raise ValueError("date required")

    if domain == "datetime" and service == "set_value":
        date = str(data.get("date", ""))
        if date:
            set_helper(entity_id, date)
            return {"entity_id": entity_id, "state": date}
        raise ValueError("date required")

    if domain == "script" and service == "turn_on":
        return handle_script(entity_id, data)

    raise ValueError(f"unsupported service {domain}.{service}")


def call_service_sync(domain: str, service: str, data: dict[str, Any]) -> dict[str, Any]:
    return asyncio.run(call_service_proxy(domain, service, data))
