"""Software-only room simulator for public WiP demo (no hardware ingest)."""

from __future__ import annotations

import asyncio
import json
import logging
import time
from copy import deepcopy
from pathlib import Path
from typing import Any

from .climate_math import finalize_hub_climate
from .compose_store import set_helper
from .fleet_state import FleetState, SeatState, get_fleet_state, update_fleet_state
from .hub_controls import (
    HUB_FAN_ENTITY_TO_OID,
    HUB_LIGHT_ENTITY_TO_OID,
    HUB_NUMBER_ENTITY_TO_OID,
    HUB_SELECT_ENTITY_TO_OID,
    HUB_SWITCH_ENTITY_TO_OID,
)
from .paths import SURFACE_VERSION
from .settings import list_inventory, upsert_inventory

_logger = logging.getLogger(__name__)

from .paths import REPO_ROOT

_SEED_PATH = REPO_ROOT / "brain" / "data" / "demo-fleet-seed.json"
if not _SEED_PATH.is_file():
    _SEED_PATH = Path(__file__).resolve().parents[1] / "data" / "demo-fleet-seed.json"

_DEMAND_ENTITY_TO_RELAY: dict[str, str] = {
    "switch.dsc_hub_heater_demand": "heater",
    "switch.dsc_hub_humidifier_demand": "humidifier",
    "switch.dsc_hub_dehumidifier_demand": "dehumidifier",
    "switch.dsc_hub_grow_mat_demand": "heatmat",
}

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

_task: asyncio.Task[None] | None = None
_running = False
_last_tick = 0.0


def _ctrl_on(controls: dict[str, Any], entity_id: str) -> bool:
    ent = controls.get(entity_id) or {}
    st = str(ent.get("state", "off")).lower()
    return st in ("on", "true", "1")


def _ctrl_pct(controls: dict[str, Any], entity_id: str) -> float:
    ent = controls.get(entity_id) or {}
    if str(ent.get("state", "off")).lower() == "off":
        return 0.0
    if ent.get("percentage") is not None:
        try:
            return float(ent["percentage"])
        except (TypeError, ValueError):
            pass
    attrs = ent.get("attributes") or {}
    if "percentage" in attrs:
        try:
            return float(attrs["percentage"])
        except (TypeError, ValueError):
            pass


def _set_ctrl(
    controls: dict[str, Any],
    entity_id: str,
    *,
    state: str,
    attributes: dict[str, Any] | None = None,
    percentage: float | None = None,
    brightness: int | None = None,
    options: list[str] | None = None,
) -> None:
    entry: dict[str, Any] = {"state": state}
    if percentage is not None:
        entry["percentage"] = percentage
    if brightness is not None:
        entry["brightness"] = brightness
    if options is not None:
        entry["options"] = options
    if attributes:
        entry["attributes"] = attributes
    controls[entity_id] = entry


def _ensure_controls(state: FleetState) -> dict[str, Any]:
    values = state.hub.values
    controls = values.get("controls")
    if not isinstance(controls, dict):
        controls = {}
        values["controls"] = controls
    return controls


def _sync_relays_from_demands(state: FleetState) -> None:
    controls = _ensure_controls(state)
    relays = dict((state.system or {}).get("relays") or {})
    for entity_id, seat in _DEMAND_ENTITY_TO_RELAY.items():
        relays[seat] = _ctrl_on(controls, entity_id)
    system = dict(state.system or {})
    system["relays"] = relays
    system["appliance_link"] = True
    state.system = system


def get_demo_appliance_status() -> dict[str, Any]:
    state = get_fleet_state()
    relays = dict((state.system or {}).get("relays") or {})
    return {
        "hub_ok": bool(state.hub.online),
        "relays": relays,
        "last_hub_seen": time.time(),
        "updated_at": time.time(),
    }


def load_demo_seed() -> None:
    if not _SEED_PATH.is_file():
        raise FileNotFoundError(f"demo seed missing: {_SEED_PATH}")
    raw = json.loads(_SEED_PATH.read_text(encoding="utf-8"))
    state = FleetState()
    state.version = str(raw.get("version", "7.0.0.0-demo"))
    state.surface = str(raw.get("surface", SURFACE_VERSION))
    hub_raw = raw.get("hub") or {}
    state.hub = SeatState(
        "hub",
        bool(hub_raw.get("online", True)),
        hub_raw.get("firmware"),
        dict(hub_raw.get("values") or {}),
    )
    panel_raw = raw.get("panel") or {}
    state.panel = SeatState(
        "panel",
        bool(panel_raw.get("online", False)),
        panel_raw.get("firmware"),
        dict(panel_raw.get("values") or {}),
    )
    state.pots = {}
    for pid, prow in (raw.get("pots") or {}).items():
        state.pots[str(pid)] = SeatState(
            str(pid),
            bool(prow.get("online", True)),
            prow.get("firmware"),
            dict(prow.get("values") or {}),
        )
    state.sonoffs = {}
    for sid, srow in (raw.get("sonoffs") or {}).items():
        state.sonoffs[str(sid)] = SeatState(
            str(sid),
            bool(srow.get("online", True)),
            srow.get("firmware"),
            dict(srow.get("values") or {}),
        )
    state.canopy = dict(raw.get("canopy") or {})
    state.system = dict(raw.get("system") or {})
    finalize_hub_climate(state.hub.values)
    _sync_relays_from_demands(state)
    update_fleet_state(state)
    _logger.info("demo seed loaded from %s", _SEED_PATH.name)


def _physics_tick(state: FleetState, dt: float) -> None:
    values = state.hub.values
    controls = _ensure_controls(state)
    dt = max(0.25, min(dt, 3.0))

    temp = float(values.get("temp_c") or 21.0)
    rh = float(values.get("rh_pct") or 65.0)
    room_temp = float(values.get("room_temp_c") or temp + 1.5)
    room_rh = float(values.get("room_rh_pct") or rh + 3.0)
    clone_temp = float(values.get("clone_temp_c") or temp + 0.5)
    clone_rh = float(values.get("clone_rh_pct") or rh + 2.0)

    exhaust_pct = max(
        _ctrl_pct(controls, "fan.dsc_hub_6_inch_exhaust_outside"),
        _ctrl_pct(controls, "fan.dsc_hub_6_inch_exhaust_room"),
    )
    exchange = 0.02 + (exhaust_pct / 100.0) * 0.08

    if _ctrl_on(controls, "switch.dsc_hub_heater_demand"):
        temp += 0.10 * dt
        rh -= 0.04 * dt
    if _ctrl_on(controls, "switch.dsc_hub_dehumidifier_demand"):
        rh -= 0.18 * dt
        temp += 0.03 * dt
    if _ctrl_on(controls, "switch.dsc_hub_humidifier_demand"):
        rh += 0.14 * dt
    if _ctrl_on(controls, "switch.dsc_hub_ac_demand"):
        temp -= 0.12 * dt
        rh += 0.02 * dt

    temp += (room_temp - temp) * exchange * dt
    rh += (room_rh - rh) * exchange * dt

    clone_ex = exchange * 0.6
    if _ctrl_on(controls, "switch.dsc_hub_clone_humidifier_demand"):
        clone_rh += 0.10 * dt
    clone_temp += (temp - clone_temp) * clone_ex * dt
    clone_rh += (rh - clone_rh) * clone_ex * dt

    values["temp_c"] = round(max(10.0, min(40.0, temp)), 2)
    values["rh_pct"] = round(max(20.0, min(99.0, rh)), 1)
    values["room_temp_c"] = round(room_temp, 2)
    values["room_rh_pct"] = round(room_rh, 1)
    values["clone_temp_c"] = round(clone_temp, 2)
    values["clone_rh_pct"] = round(clone_rh, 1)
    values["heartbeat"] = float(values.get("heartbeat") or 0) + dt
    values["uptime"] = float(values.get("uptime") or 0) + dt

    mat_on = _ctrl_on(controls, "switch.dsc_hub_grow_mat_demand")
    for pot in state.pots.values():
        if not pot.online:
            continue
        pv = pot.values
        moisture = pv.get("moisture_pct")
        if moisture is not None:
            dry = 0.015 * dt
            if mat_on:
                dry *= 0.6
            pv["moisture_pct"] = round(max(5.0, float(moisture) - dry), 1)
        soil_t = pv.get("soil_temp_c")
        if soil_t is not None:
            target = temp - 1.5
            delta = (target - float(soil_t)) * (0.04 if mat_on else 0.01) * dt
            pv["soil_temp_c"] = round(float(soil_t) + delta, 2)

    finalize_hub_climate(values)
    _sync_relays_from_demands(state)


async def _demo_loop() -> None:
    global _last_tick
    _last_tick = time.time()
    while _running:
        await asyncio.sleep(1.0)
        state = get_fleet_state()
        now = time.time()
        dt = now - _last_tick
        _last_tick = now
        _physics_tick(state, dt)
        state.updated_at = now
        update_fleet_state(state)


def start_demo_simulator() -> None:
    global _task, _running
    if _running:
        return
    load_demo_seed()
    _running = True
    _task = asyncio.create_task(_demo_loop())
    _logger.info("demo simulator started")


async def stop_demo_simulator() -> None:
    global _task, _running
    _running = False
    if _task:
        _task.cancel()
        try:
            await _task
        except asyncio.CancelledError:
            pass
        _task = None


async def demo_call_service(domain: str, service: str, data: dict[str, Any]) -> dict[str, Any]:
    """Local-only control path — never opens Native API / MQTT."""
    entity_id = str(data.get("entity_id", ""))
    if not entity_id:
        raise ValueError("entity_id required")

    state = get_fleet_state()
    controls = _ensure_controls(state)

    if domain == "input_boolean":
        seat = _IN_SERVICE_ENTITY_TO_SEAT.get(entity_id)
        if seat:
            if service == "turn_on":
                on = True
            elif service == "turn_off":
                on = False
            elif service == "toggle":
                row = next((r for r in list_inventory() if r["seat_id"] == seat), None)
                on = not bool((row or {}).get("in_service", False))
            else:
                raise ValueError(f"unsupported input_boolean service {service}")
            upsert_inventory(seat, {"in_service": on})
            return {"entity_id": entity_id, "state": "on" if on else "off", "demo": True}
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
            return {"entity_id": entity_id, "state": "on" if on else "off", "demo": True}
        raise ValueError(f"unsupported input_boolean {entity_id}")

    if domain == "switch":
        if entity_id in HUB_SWITCH_ENTITY_TO_OID:
            if service == "turn_on":
                on = True
            elif service == "turn_off":
                on = False
            elif service == "toggle":
                on = not _ctrl_on(controls, entity_id)
            else:
                raise ValueError(f"unsupported switch service {service}")
            state_s = "on" if on else "off"
            _set_ctrl(controls, entity_id, state=state_s)
            if entity_id == "switch.dsc_hub_manual_takeover":
                set_helper(entity_id, state_s)
            _sync_relays_from_demands(state)
            update_fleet_state(state)
            return {"entity_id": entity_id, "state": state_s, "demo": True}
        if entity_id in _SONOFF_RELAY_ENTITY_TO_SEAT:
            seat = _SONOFF_RELAY_ENTITY_TO_SEAT[entity_id]
            on = service == "turn_on" or (service == "toggle" and not (state.system or {}).get("relays", {}).get(seat))
            if service == "turn_off":
                on = False
            relays = dict((state.system or {}).get("relays") or {})
            relays[seat] = on
            system = dict(state.system or {})
            system["relays"] = relays
            state.system = system
            update_fleet_state(state)
            return {"entity_id": entity_id, "state": "on" if on else "off", "demo": True}
        raise ValueError(f"unsupported switch {entity_id}")

    if domain in ("number", "input_number") and service in ("set_value", "set"):
        value = data.get("value")
        if value is None:
            raise ValueError("value required")
        if entity_id in HUB_NUMBER_ENTITY_TO_OID:
            _set_ctrl(controls, entity_id, state=str(float(value)))
            update_fleet_state(state)
            return {"entity_id": entity_id, "state": str(value), "demo": True}
        set_helper(entity_id, float(value))
        return {"entity_id": entity_id, "state": str(value), "demo": True}

    if domain == "fan" and entity_id in HUB_FAN_ENTITY_TO_OID:
        if service == "turn_off":
            pct = 0
        elif service in ("turn_on", "set_percentage"):
            pct = int(data.get("percentage", 100 if service == "turn_on" else 0))
        else:
            raise ValueError(f"unsupported fan service {service}")
        _set_ctrl(
            controls,
            entity_id,
            state="on" if pct > 0 else "off",
            percentage=pct,
        )
        update_fleet_state(state)
        return {"entity_id": entity_id, "state": "on" if pct else "off", "demo": True}

    if domain == "light" and entity_id in HUB_LIGHT_ENTITY_TO_OID:
        if service == "turn_off":
            _set_ctrl(controls, entity_id, state="off", brightness=0)
        elif service == "turn_on":
            bri = data.get("brightness")
            brightness = int(bri) if bri is not None else 255
            _set_ctrl(controls, entity_id, state="on", brightness=brightness)
        else:
            raise ValueError(f"unsupported light service {service}")
        update_fleet_state(state)
        st = controls[entity_id]["state"]
        return {"entity_id": entity_id, "state": st, "demo": True}

    if domain == "select" and service == "select_option":
        option = str(data.get("option", ""))
        if not option:
            raise ValueError("option required")
        if entity_id in HUB_SELECT_ENTITY_TO_OID:
            _set_ctrl(controls, entity_id, state=option)
            update_fleet_state(state)
            return {"entity_id": entity_id, "state": option, "demo": True}
        set_helper(entity_id, option)
        return {"entity_id": entity_id, "state": option, "demo": True}

    if domain == "input_select" and service == "select_option":
        option = str(data.get("option", ""))
        set_helper(entity_id, option)
        return {"entity_id": entity_id, "state": option, "demo": True}

    if domain in ("input_text", "text") and service == "set_value":
        value = str(data.get("value", ""))
        set_helper(entity_id, value)
        return {"entity_id": entity_id, "state": value, "demo": True}

    if domain in ("input_datetime", "datetime") and service in ("set_datetime", "set_value"):
        date = str(data.get("date") or data.get("datetime") or data.get("value") or "")[:10]
        if not date:
            raise ValueError("date required")
        set_helper(entity_id, date)
        return {"entity_id": entity_id, "state": date, "demo": True}

    if domain == "script" and service == "turn_on":
        from .compose_ops import handle_script

        result = handle_script(entity_id, data)
        if isinstance(result, dict):
            return {**result, "demo": True}
        return {"result": result, "demo": True}

    raise ValueError(f"unsupported service {domain}.{service}")


def demo_blocked() -> dict[str, Any]:
    return {
        "error": "demo_simulation",
        "detail": "Blocked in demo mode — software simulation only, no hardware or network apply.",
    }
