"""Proxy HA-shaped service calls to Native API / settings on Pi."""

from __future__ import annotations

import asyncio
import logging
import re
from typing import Any

from .api_lock import host_lock
from .native_api import make_api_client
from .compose_ops import handle_script, update_pot_recipe
from .compose_store import get_helper, set_helper
from .settings import list_inventory, list_roster, upsert_inventory
from .stage_model import clone_mode_for_stage, stage_family, tent_id

_logger = logging.getLogger(__name__)

from .hub_controls import (
    HUB_FAN_ENTITY_TO_OID,
    HUB_LIGHT_ENTITY_TO_OID,
    HUB_NUMBER_ENTITY_TO_OID,
    HUB_SELECT_ENTITY_TO_OID,
    HUB_SWITCH_ENTITY_TO_OID,
    HUB_SWITCH_OID_TO_ENTITY,
)

_IN_SERVICE_ENTITY_TO_SEAT: dict[str, str] = {
    "input_boolean.dsc_ac_in_service": "ac",
    "input_boolean.dsc_clone_humidifier_in_service": "mister",
    "input_boolean.dsc_probe1_in_service": "pot1",
    "input_boolean.dsc_probe2_in_service": "pot2",
    "input_boolean.dsc_probe3_in_service": "pot3",
    "input_boolean.dsc_probe4_in_service": "pot4",
    "input_boolean.dsc_tank_in_service": "tank",
}

_SONOFF_RELAY_ENTITY_TO_SEAT: dict[str, str] = {
    "switch.dsc_heater_main_relay": "heater",
    "switch.dsc_heatmat_main_relay": "heatmat",
    "switch.dsc_humidifier_main_relay": "humidifier",
    "switch.dsc_de_humidifier_main_relay": "dehumidifier",
}

# Seats with demand switches but no physical Sonoff relay seat (guard writes).
_PHANTOM_RELAY_SEATS = frozenset({"ac", "mister"})

_INVENTORY_HUB_IN_SERVICE_OID: dict[str, str] = {
    "ac": "ac_in_service",
    "mister": "clone_humidifier_in_service",
    "pot1": "pot1_in_service",
    "pot2": "pot2_in_service",
    "pot3": "pot3_in_service",
    "pot4": "pot4_in_service",
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


_MANUAL_TAKEOVER_EID = "switch.dsc_hub_manual_takeover"


def _switch_key_for_entity(keys: dict[str, int], entity_id: str, primary_oid: str) -> int | None:
    """Resolve Native API key; accept slug + legacy object_id aliases."""
    if primary_oid in keys:
        return keys[primary_oid]
    for oid, eid in HUB_SWITCH_OID_TO_ENTITY.items():
        if eid == entity_id and oid in keys:
            return keys[oid]
    return None


async def _hub_switch(entity_id: str, on: bool) -> dict[str, Any]:
    oid = HUB_SWITCH_ENTITY_TO_OID.get(entity_id)
    if not oid:
        raise ValueError(f"unsupported hub switch {entity_id}")
    row = _inventory_row("hub")
    host = (row or {}).get("host") or ""
    api_key = _api_key(row, "hub")
    if not host:
        raise RuntimeError("hub host not configured in inventory")

    alias_oids = {o for o, e in HUB_SWITCH_OID_TO_ENTITY.items() if e == entity_id}
    keys = await _ensure_switch_keys(
        host, api_key, "hub", set(HUB_SWITCH_ENTITY_TO_OID.values()) | alias_oids
    )
    key = _switch_key_for_entity(keys, entity_id, oid)
    if key is None:
        raise RuntimeError(f"hub switch {oid} not found")

    client = make_api_client(host, api_key)
    async with host_lock(host):
        try:
            await client.connect(login=True)
            client.switch_command(key, on)
            state = "on" if on else "off"
            # Persist policy switch so /fleet/computed hass_extras + failover
            # see on/off even when hub poll lags or resets the live control.
            if entity_id == _MANUAL_TAKEOVER_EID:
                set_helper(entity_id, state)
            return {"entity_id": entity_id, "state": state}
        finally:
            try:
                await client.disconnect()
            except Exception:  # noqa: BLE001
                pass


async def _hub_in_service_switch(seat_id: str, on: bool) -> dict[str, Any]:
    """Push inventory in_service to the hub ESP switch (not exposed on control proxy)."""
    oid = _INVENTORY_HUB_IN_SERVICE_OID.get(seat_id)
    if not oid:
        return {"skipped": seat_id}
    row = _inventory_row("hub")
    host = (row or {}).get("host") or ""
    api_key = _api_key(row, "hub")
    if not host:
        raise RuntimeError("hub host not configured in inventory")

    keys = await _ensure_switch_keys(host, api_key, "hub_in_service", set(_INVENTORY_HUB_IN_SERVICE_OID.values()))
    key = keys.get(oid)
    if key is None:
        raise RuntimeError(f"hub in_service switch {oid} not found")

    client = make_api_client(host, api_key)
    async with host_lock(host):
        try:
            await client.connect(login=True)
            client.switch_command(key, on)
            entity_id = HUB_SWITCH_OID_TO_ENTITY.get(oid, f"switch.dsc_hub_{oid}")
            return {"entity_id": entity_id, "state": "on" if on else "off"}
        finally:
            try:
                await client.disconnect()
            except Exception:  # noqa: BLE001
                pass


async def sync_inventory_in_service_to_hub(seat_id: str, in_service: bool) -> dict[str, Any]:
    """Mirror fleet inventory in_service onto hub ESP switches when inventory PATCHes."""
    return await _hub_in_service_switch(seat_id, in_service)


async def _sonoff_switch(entity_id: str, on: bool) -> dict[str, Any]:
    seat_id = _SONOFF_RELAY_ENTITY_TO_SEAT.get(entity_id)
    if not seat_id:
        raise ValueError(f"unsupported sonoff switch {entity_id}")
    if seat_id in _PHANTOM_RELAY_SEATS:
        raise RuntimeError(f"{seat_id} has no physical relay seat — use hub demand switch")
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
    async with host_lock(host):
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
    async with host_lock(host):
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
    async with host_lock(host):
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
    async with host_lock(host):
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
    async with host_lock(host):
        try:
            await client.connect(login=True)
            client.select_command(key, option)
            return {"entity_id": entity_id, "state": option}
        finally:
            try:
                await client.disconnect()
            except Exception:  # noqa: BLE001
                pass


def _date_from_service(data: dict[str, Any]) -> str:
    raw = str(data.get("date") or data.get("datetime") or data.get("value") or "")
    return raw[:10] if raw else ""


def _control_state(entity_id: str) -> str:
    if entity_id == _MANUAL_TAKEOVER_EID:
        helper = get_helper(entity_id)
        if helper is not None and str(helper) != "":
            return str(helper)
    try:
        from .fleet_state import get_fleet_state

        fleet = get_fleet_state()
        if not fleet.hub:
            return ""
        controls = (fleet.hub.values or {}).get("controls") or {}
        entry = controls.get(entity_id) or {}
        return str(entry.get("state") or "")
    except Exception:  # noqa: BLE001
        return ""


def _clone_hours_for_stage(stage: str) -> float:
    return 12.0 if stage_family(stage) == "flower" else 18.0


def _hub_is_online() -> bool:
    try:
        from .fleet_state import get_fleet_state

        fleet = get_fleet_state()
        return bool(fleet.hub and getattr(fleet.hub, "online", False))
    except Exception:  # noqa: BLE001
        return False


async def _hub_select_retry(entity_id: str, option: str) -> dict[str, Any]:
    try:
        return await _hub_select(entity_id, option)
    except Exception:  # noqa: BLE001
        await asyncio.sleep(1.0)
        return await _hub_select(entity_id, option)


def _seated_clone_recipe() -> dict[str, Any] | None:
    """First roster row with a seated plant in the 2×4 tent (not tent-only ghosts)."""
    for row in list_roster():
        recipe = row.get("recipe") or {}
        if tent_id(str(recipe.get("tent") or row.get("tent") or "")) != "clone":
            continue
        name = str(recipe.get("plant_name") or recipe.get("nickname") or "").strip()
        strain = str(row.get("strain_id") or recipe.get("strain_display") or "").strip()
        if not name and not strain:
            continue
        return recipe
    return None


async def apply_clone_tent_automation() -> dict[str, Any]:
    """Drive 2x4 Climate Mode from roster when takeover is off.

    Never writes select.dsc_hub_grow_stage (4×8 stage is main-tent owned).
    Follow Plants numbers are written by apply_follow_plants.
    """
    takeover = _control_state("switch.dsc_hub_manual_takeover")
    if takeover == "on":
        return {"applied": False, "reason": "takeover on"}
    if not _hub_is_online():
        return {"applied": False, "reason": "hub offline"}
    recipe = _seated_clone_recipe()
    if not recipe:
        return {"applied": False, "reason": "no seated 2x4 plant"}
    stage = str(recipe.get("growth_stage") or recipe.get("stage") or "")
    mode = clone_mode_for_stage(stage)
    writes: dict[str, Any] = {"stage": stage}
    if mode:
        try:
            await _hub_select_retry("select.dsc_hub_clone_mode", mode)
            writes["clone_mode"] = mode
        except Exception as exc:  # noqa: BLE001
            _logger.warning("clone_mode write failed: %s", exc)
            set_helper("select.dsc_hub_clone_mode", mode)
            writes["clone_mode"] = mode
            writes["clone_mode_local"] = True
    from .climate_mode import is_follow_plants_mode
    from .follow_plants import apply_follow_plants

    if mode and is_follow_plants_mode(mode):
        follow = await apply_follow_plants(force=True)
        writes["follow_plants"] = follow
        return {"applied": bool(follow.get("applied")), **writes}

    hours = _clone_hours_for_stage(stage)
    photo = "Follow 4x8" if stage_family(stage) == "flower" else "Independent"
    try:
        await _hub_select_retry("select.dsc_hub_clone_photoperiod", photo)
        writes["clone_photoperiod"] = photo
    except Exception as exc:  # noqa: BLE001
        _logger.warning("clone_photoperiod write failed: %s", exc)
        set_helper("select.dsc_hub_clone_photoperiod", photo)
        writes["clone_photoperiod"] = photo
    try:
        await _hub_number("number.dsc_hub_clone_light_hours", hours)
        writes["clone_light_hours"] = hours
    except Exception as exc:  # noqa: BLE001
        _logger.warning("clone_light_hours write failed: %s", exc)
        set_helper("number.dsc_hub_clone_light_hours", hours)
        writes["clone_light_hours"] = hours
    return {"applied": True, **writes}


def _maybe_persist_pot_edit(entity_id: str, value: str) -> None:
    pot_tent = re.match(r"input_select\.dsc_probe([1-4])_tent$", entity_id)
    if pot_tent:
        try:
            update_pot_recipe(int(pot_tent.group(1)), {"tent": value})
        except ValueError:
            pass
        return
    pot_sprout = re.match(r"(?:input_datetime|datetime)\.dsc_probe([1-4])_sprout_date$", entity_id)
    if pot_sprout and value:
        try:
            update_pot_recipe(int(pot_sprout.group(1)), {"sprout_date": value})
        except ValueError:
            pass
        return
    pot_stage = re.match(r"select\.dsc_probe([1-4])_growth_stage$", entity_id)
    if pot_stage and value:
        try:
            update_pot_recipe(int(pot_stage.group(1)), {"growth_stage": value})
        except ValueError:
            pass
        return
    pot_name = re.match(r"text\.dsc_probe([1-4])_plant_name$", entity_id)
    if pot_name:
        try:
            update_pot_recipe(int(pot_name.group(1)), {"plant_name": value})
        except ValueError:
            pass


async def call_service_proxy(domain: str, service: str, data: dict[str, Any]) -> dict[str, Any]:
    from .demo_mode import is_demo_mode

    if is_demo_mode():
        from .demo_simulator import demo_call_service

        return await demo_call_service(domain, service, data)

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
        if entity_id in HUB_SWITCH_ENTITY_TO_OID:
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
        _maybe_persist_pot_edit(entity_id, option)
        if entity_id.startswith("select.dsc_probe") and entity_id.endswith("_growth_stage"):
            await apply_clone_tent_automation()
        return {"entity_id": entity_id, "state": option}

    if domain == "input_select" and service == "select_option":
        option = str(data.get("option", ""))
        if not option:
            raise ValueError("option required")
        set_helper(entity_id, option)
        _maybe_persist_pot_edit(entity_id, option)
        if entity_id.endswith("_tent"):
            await apply_clone_tent_automation()
        return {"entity_id": entity_id, "state": option}

    if domain in ("input_text", "text") and service == "set_value":
        value = str(data.get("value", ""))
        set_helper(entity_id, value)
        _maybe_persist_pot_edit(entity_id, value)
        return {"entity_id": entity_id, "state": value}

    if domain == "input_datetime" and service == "set_datetime":
        date = _date_from_service(data)
        if date:
            set_helper(entity_id, date)
            _maybe_persist_pot_edit(entity_id, date)
            if "sprout_date" in entity_id:
                await apply_clone_tent_automation()
            return {"entity_id": entity_id, "state": date}
        raise ValueError("date required")

    if domain == "datetime" and service == "set_value":
        date = _date_from_service(data)
        if date:
            set_helper(entity_id, date)
            _maybe_persist_pot_edit(entity_id, date)
            if "sprout_date" in entity_id:
                await apply_clone_tent_automation()
            return {"entity_id": entity_id, "state": date}
        raise ValueError("date required")

    if domain == "script" and service == "turn_on":
        result = handle_script(entity_id, data)
        if entity_id in (
            "script.dsc_build_plant_commit_and_assign",
            "script.dsc_plant_assign_to_pot",
            "script.dsc_plant_retire",
        ):
            auto = await apply_clone_tent_automation()
            if isinstance(result, dict):
                result = {**result, "clone_automation": auto}
        return result

    raise ValueError(f"unsupported service {domain}.{service}")


def call_service_sync(domain: str, service: str, data: dict[str, Any]) -> dict[str, Any]:
    return asyncio.run(call_service_proxy(domain, service, data))
