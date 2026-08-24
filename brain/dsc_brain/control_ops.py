"""Proxy HA-shaped service calls to Native API / settings on Pi."""

from __future__ import annotations

import asyncio
import logging
from typing import Any

from .native_api import make_api_client
from .settings import list_inventory, upsert_inventory

_logger = logging.getLogger(__name__)

_IN_SERVICE_ENTITY_TO_SEAT: dict[str, str] = {
    "input_boolean.dsc_ac_in_service": "ac",
    "input_boolean.dsc_clone_humidifier_in_service": "mister",
    "input_boolean.dsc_pot1_in_service": "pot1",
    "input_boolean.dsc_pot2_in_service": "pot2",
    "input_boolean.dsc_pot3_in_service": "pot3",
    "input_boolean.dsc_pot4_in_service": "pot4",
    "input_boolean.dsc_tank_in_service": "tank",
}

_HUB_DEMAND_ENTITY_TO_OID: dict[str, str] = {
    "switch.dsc_hub_heater_demand": "heater_demand",
    "switch.dsc_hub_humidifier_demand": "humidifier_demand",
    "switch.dsc_hub_dehumidifier_demand": "dehumidifier_demand",
    "switch.dsc_hub_grow_mat_demand": "growmat_demand",
    "switch.dsc_hub_ac_demand": "ac_demand",
    "switch.dsc_hub_clone_humidifier_demand": "clone_humidifier_demand",
}

_SONOFF_RELAY_ENTITY_TO_SEAT: dict[str, str] = {
    "switch.dsc_heater_main_relay": "heater",
    "switch.dsc_heatmat_main_relay": "heatmat",
    "switch.dsc_humidifier_main_relay": "humidifier",
    "switch.dsc_de_humidifier_main_relay": "dehumidifier",
    "switch.dsc_ac_main_relay": "ac",
    "switch.dsc_clone_humidifier_main_relay": "mister",
}

_HUB_SWITCH_ENTITY_TO_OID: dict[str, str] = {
    **_HUB_DEMAND_ENTITY_TO_OID,
    "switch.dsc_hub_tent_full_auto_mode": "full_auto_switch",
    "switch.dsc_hub_manual_takeover": "manual_takeover_switch",
    "switch.dsc_hub_tent_manual_override": "tent_manual_override",
    "switch.dsc_hub_humidifier_intake_routing": "humidifier_intake_routing",
    "switch.dsc_hub_recirc_de_strat_pulse": "recirc_de_strat_pulse",
}

_NUMBER_ENTITY_TO_OID: dict[str, str] = {
    "number.dsc_hub_target_temp": "target_temp",
    "number.dsc_hub_rh_target_min": "rh_target_min",
    "number.dsc_hub_rh_target_max": "rh_target_max",
    "number.dsc_hub_vpd_target_min": "vpd_target_min",
    "number.dsc_hub_vpd_target_max": "vpd_target_max",
    "number.dsc_hub_clone_target_temp": "clone_target_temp",
    "number.dsc_hub_clone_rh_min": "clone_rh_min",
    "number.dsc_hub_clone_rh_max": "clone_rh_max",
    "number.dsc_hub_clone_vpd_min": "clone_vpd_min",
    "number.dsc_hub_clone_vpd_max": "clone_vpd_max",
}

_switch_keys: dict[str, dict[str, int]] = {}
_number_keys: dict[str, dict[str, int]] = {}


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


async def _ensure_switch_keys(host: str, api_key: str, cache_key: str, object_ids: set[str]) -> dict[str, int]:
    if cache_key in _switch_keys and all(oid in _switch_keys[cache_key] for oid in object_ids):
        return _switch_keys[cache_key]

    client = make_api_client(host, api_key)
    try:
        await client.connect(login=True)
        entities, _services = await client.list_entities_services()
        keys: dict[str, int] = dict(_switch_keys.get(cache_key, {}))
        for ent in entities:
            oid = str(getattr(ent, "object_id", ""))
            if oid in object_ids and hasattr(ent, "key"):
                keys[oid] = int(ent.key)
        _switch_keys[cache_key] = keys
        return keys
    finally:
        try:
            await client.disconnect()
        except Exception:  # noqa: BLE001
            pass


async def _ensure_number_keys(host: str, api_key: str, cache_key: str, object_ids: set[str]) -> dict[str, int]:
    if cache_key in _number_keys and all(oid in _number_keys[cache_key] for oid in object_ids):
        return _number_keys[cache_key]

    client = make_api_client(host, api_key)
    try:
        await client.connect(login=True)
        entities, _services = await client.list_entities_services()
        keys: dict[str, int] = dict(_number_keys.get(cache_key, {}))
        for ent in entities:
            oid = str(getattr(ent, "object_id", ""))
            if oid in object_ids and hasattr(ent, "key"):
                keys[oid] = int(ent.key)
        _number_keys[cache_key] = keys
        return keys
    finally:
        try:
            await client.disconnect()
        except Exception:  # noqa: BLE001
            pass


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


async def call_service_proxy(domain: str, service: str, data: dict[str, Any]) -> dict[str, Any]:
    entity_id = str(data.get("entity_id", ""))
    if not entity_id:
        raise ValueError("entity_id required")

    if domain == "input_boolean":
        seat = _IN_SERVICE_ENTITY_TO_SEAT.get(entity_id)
        if not seat:
            raise ValueError(f"unsupported input_boolean {entity_id}")
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
        raise ValueError(f"unsupported number {entity_id}")

    raise ValueError(f"unsupported service {domain}.{service}")


def call_service_sync(domain: str, service: str, data: dict[str, Any]) -> dict[str, Any]:
    return asyncio.run(call_service_proxy(domain, service, data))
