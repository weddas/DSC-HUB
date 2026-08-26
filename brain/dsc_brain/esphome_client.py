"""ESPHome Native API ingest — hub, pots, Sonoffs."""

from __future__ import annotations

import asyncio
import logging
import os
import time
from typing import Any

from .appliance_driver import get_appliance_status
from .climate_math import finalize_hub_climate
from .event_log import record_grow_log
from .fleet_state import FleetState, SeatState, get_fleet_state, update_fleet_state
from .hub_controls import (
    HUB_BINARY_OID_TO_ENTITY,
    HUB_FAN_OID_TO_ENTITY,
    HUB_LIGHT_OID_TO_ENTITY,
    HUB_NUMBER_OID_TO_ENTITY,
    HUB_SELECT_OID_TO_ENTITY,
    HUB_SENSOR_OID_TO_KEY,
    HUB_SWITCH_OID_TO_ENTITY,
    HUB_TEXT_SENSOR_OID_TO_KEY,
)
from .native_api import make_api_client
from .paths import EXPECTED_FIRMWARE, SURFACE_VERSION
from .settings import list_inventory, record_history

_logger = logging.getLogger(__name__)

_PREV_HUB_DEMANDS: dict[str, str] = {}
_BOOT_GROW_LOGGED = False

# object_id suffix → fleet values key (pots only — hub uses exact OID map)
POT_MAP = {
    "soil_moisture": "moisture_pct",
    "soil_temperature": "soil_temp_c",
    "soil_ec": "ec_us",
    "soil_ph": "ph",
}


class EsphomeIngest:
    """Background asyncio loop subscribing to fleet Native API."""

    def __init__(self) -> None:
        self._task: asyncio.Task[None] | None = None
        self._running = False

    def start(self) -> None:
        if self._task is not None:
            return
        try:
            loop = asyncio.get_running_loop()
        except RuntimeError:
            _logger.warning("ESPHome ingest not started — no running event loop")
            return
        self._running = True
        self._task = loop.create_task(self._run())

    async def stop(self) -> None:
        self._running = False
        if self._task:
            self._task.cancel()
            try:
                await self._task
            except asyncio.CancelledError:
                pass

    async def _run(self) -> None:
        while self._running:
            try:
                state = await self._poll_once()
                update_fleet_state(state)
            except Exception as exc:  # noqa: BLE001
                _logger.warning("ESPHome ingest poll failed: %s", exc)
            await asyncio.sleep(5.0)

    async def _poll_once(self) -> FleetState:
        prev = get_fleet_state()
        state = FleetState(surface=SURFACE_VERSION)
        state.hub = prev.hub
        state.panel = prev.panel
        state.pots = dict(prev.pots)
        state.sonoffs = dict(prev.sonoffs)
        state.canopy = dict(prev.canopy)
        state.system = dict(prev.system)

        inventory = {r["seat_id"]: r for r in list_inventory()}
        try:
            import aioesphomeapi  # noqa: F401
        except ImportError:
            _logger.debug("aioesphomeapi not installed — ingest idle")
            return state

        seat_order = sorted(
            inventory.items(),
            key=lambda item: (0 if item[0] == "hub" else 1, item[0]),
        )

        for seat_id, row in seat_order:
            if not row.get("in_service"):
                continue
            host = row.get("host") or os.environ.get(f"DSC_{seat_id.upper()}_HOST")
            api_key = row.get("api_key") or os.environ.get(f"DSC_{seat_id.upper()}_API_KEY", "")
            if not host:
                continue
            role = row.get("role", "")
            try:
                readings = await _fetch_device(host, api_key or "", role, seat_id)
                self._apply_readings(state, seat_id, role, readings)
            except Exception as exc:  # noqa: BLE001
                _logger.debug("ESPHome %s @ %s: %s", seat_id, host, exc)

        appliance = get_appliance_status()
        state.system["appliance_link"] = appliance.get("hub_ok", False)
        state.system["relays"] = dict(appliance.get("relays", {}))
        for seat_id, relay_on in appliance.get("relays", {}).items():
            sonoff = state.sonoffs.get(seat_id)
            if sonoff is not None:
                sonoff.values["relay_on"] = relay_on

        _finalize_hub_binaries(state)
        return state

    def _apply_readings(
        self,
        state: FleetState,
        seat_id: str,
        role: str,
        readings: dict[str, Any],
    ) -> None:
        now = time.time()
        fw = readings.get("firmware", EXPECTED_FIRMWARE)
        values = readings.get("values", {})
        if role == "hub":
            global _BOOT_GROW_LOGGED
            state.hub = SeatState("hub", True, fw, values, now)
            controls = values.get("controls") or {}
            if not _BOOT_GROW_LOGGED:
                stage = (controls.get("select.dsc_hub_grow_stage") or {}).get("state", "")
                mode = (controls.get("select.dsc_hub_clone_mode") or {}).get("state", "")
                bits = [b for b in (f"Stage - {stage}" if stage else None, f"Clone - {mode}" if mode else None) if b]
                if bits:
                    record_grow_log("; ".join(bits))
                _BOOT_GROW_LOGGED = True
            for eid, ctrl in controls.items():
                if eid.startswith("switch.dsc_hub_") and eid.endswith("_demand"):
                    metric = eid.replace(".", "_").replace("switch_", "switch_")
                    on = 1.0 if ctrl.get("state") == "on" else 0.0
                    record_history("hub", metric, on, now)
                    st = str(ctrl.get("state", "off"))
                    prev = _PREV_HUB_DEMANDS.get(eid)
                    if prev is not None and prev != st:
                        label = eid.split(".")[-1].replace("dsc_hub_", "").replace("_demand", "").replace("_", " ")
                        record_grow_log(f"{'▶' if st == 'on' else '■'} {label.title()} demand {st}")
                    _PREV_HUB_DEMANDS[eid] = st
            for eid, ctrl in controls.items():
                if not eid.startswith("select.dsc_hub_"):
                    continue
                st = str(ctrl.get("state", ""))
                key = f"select:{eid}"
                prev = _PREV_HUB_DEMANDS.get(key)
                if prev is not None and prev != st and st:
                    name = eid.split(".")[-1].replace("dsc_hub_", "").replace("_", " ")
                    record_grow_log(f"◆ {name}: {st}")
                if st:
                    _PREV_HUB_DEMANDS[key] = st
            binaries = values.get("binaries") or {}
            for eid, on in binaries.items():
                if not eid.startswith("binary_sensor.dsc_"):
                    continue
                key = f"bin:{eid}"
                st = "on" if on else "off"
                prev = _PREV_HUB_DEMANDS.get(key)
                if prev is not None and prev != st and st == "on":
                    if "dark_period" in eid:
                        record_grow_log("⚠ Clone dark-period violation — SF1000 on outside the 2x4 window")
                    elif "root_zone_sensor_fault" in eid:
                        record_grow_log("⚠ Root-zone probes offline — mat fell back to clone-air control")
                _PREV_HUB_DEMANDS[key] = st
        elif role == "panel":
            state.panel = SeatState("panel", True, fw, values, now)
        elif role == "pot":
            state.pots[seat_id] = SeatState(seat_id, True, fw, values, now)
        elif role.startswith("sonoff"):
            state.sonoffs[seat_id] = SeatState(seat_id, True, fw, values, now)

        for metric, value in values.items():
            if isinstance(value, (int, float)):
                record_history(seat_id, metric, float(value), now)


async def _fetch_device(host: str, api_key: str, role: str, seat_id: str) -> dict[str, Any]:
    """Connect briefly and read entity states."""
    client = make_api_client(host, api_key)
    await client.connect(login=True)
    values: dict[str, Any] = {}
    fw = EXPECTED_FIRMWARE
    try:
        info = await client.device_info()
        if info and getattr(info, "esphome_version", None):
            fw = str(info.esphome_version)
        states: dict[int, Any] = {}

        def on_state(state: Any) -> None:
            states[state.key] = state

        entities, _services = await client.list_entities_services()
        key_to_object: dict[int, str] = {}
        binary_keys: set[int] = set()
        for ent in entities:
            if hasattr(ent, "key") and hasattr(ent, "object_id"):
                oid = str(ent.object_id)
                key_to_object[int(ent.key)] = oid
                if oid in HUB_BINARY_OID_TO_ENTITY:
                    binary_keys.add(int(ent.key))

        unsub = client.subscribe_states(on_state)
        await asyncio.sleep(5.0 if role == "hub" else 3.0)
        if role == "hub" and binary_keys:
            missing = binary_keys - set(states.keys())
            if missing:
                await asyncio.sleep(3.0)

        if role == "hub":
            values.update(_hub_sensors_from_states(states, key_to_object))
            values.update(_hub_text_sensors_from_states(states, key_to_object))
            values["controls"] = _hub_controls_from_states(states, key_to_object, entities)
            values["binaries"] = _hub_binaries_from_states(states, key_to_object, entities)
            finalize_hub_climate(values)
            hub_fw = values.get("firmware_version")
            if hub_fw:
                fw = str(hub_fw).strip()
        elif role == "pot":
            for key, st in states.items():
                object_id = key_to_object.get(key, "")
                if object_id == "firmware_version":
                    pot_fw = str(getattr(st, "state", "")).strip()
                    if pot_fw:
                        fw = pot_fw
                for suffix, field in POT_MAP.items():
                    if object_id.endswith(suffix) or suffix in object_id:
                        try:
                            values[field] = float(st.state)
                        except (TypeError, ValueError):
                            values[field] = st.state
                        break

        if unsub:
            unsub()

        values["host"] = host
        values["seat_id"] = seat_id
    finally:
        await client.disconnect()
    return {"firmware": fw, "values": values}


def _hub_sensors_from_states(
    states: dict[int, Any],
    key_to_object: dict[int, str],
) -> dict[str, Any]:
    """Exact object_id map only — no suffix fallthrough (prevents number entities stomping VPD)."""
    out: dict[str, Any] = {}
    for key, st in states.items():
        object_id = key_to_object.get(key, "")
        field = HUB_SENSOR_OID_TO_KEY.get(object_id)
        if not field:
            continue
        raw = getattr(st, "state", None)
        if raw is None:
            continue
        if field == "heartbeat":
            out[field] = raw
            continue
        try:
            out[field] = float(raw)
        except (TypeError, ValueError):
            out[field] = raw
    return out


def _hub_text_sensors_from_states(
    states: dict[int, Any],
    key_to_object: dict[int, str],
) -> dict[str, Any]:
    out: dict[str, Any] = {}
    for key, st in states.items():
        object_id = key_to_object.get(key, "")
        field = HUB_TEXT_SENSOR_OID_TO_KEY.get(object_id)
        if not field:
            continue
        raw = getattr(st, "state", None)
        if raw is None:
            continue
        out[field] = str(raw).strip()
    return out


def _hub_controls_from_states(
    states: dict[int, Any],
    key_to_object: dict[int, str],
    entities: list[Any],
) -> dict[str, dict[str, Any]]:
    """Build HA-shaped control readback for hub switches/numbers/fans/selects/light."""
    select_options: dict[str, list[str]] = {}
    for ent in entities:
        oid = str(getattr(ent, "object_id", ""))
        if oid in HUB_SELECT_OID_TO_ENTITY and hasattr(ent, "options"):
            select_options[oid] = list(getattr(ent, "options", []) or [])

    controls: dict[str, dict[str, Any]] = {}

    def put(entity_id: str, state: str, **attrs: Any) -> None:
        entry: dict[str, Any] = {"state": state}
        entry.update(attrs)
        controls[entity_id] = entry

    for key, st in states.items():
        object_id = key_to_object.get(key, "")
        if object_id in HUB_SWITCH_OID_TO_ENTITY:
            entity_id = HUB_SWITCH_OID_TO_ENTITY[object_id]
            on = bool(getattr(st, "state", False))
            if isinstance(st.state, str):
                on = st.state.lower() in ("on", "true", "1")
            put(entity_id, "on" if on else "off")
        elif object_id in HUB_NUMBER_OID_TO_ENTITY:
            entity_id = HUB_NUMBER_OID_TO_ENTITY[object_id]
            try:
                put(entity_id, str(float(st.state)))
            except (TypeError, ValueError):
                put(entity_id, str(getattr(st, "state", "")))
        elif object_id in HUB_FAN_OID_TO_ENTITY:
            entity_id = HUB_FAN_OID_TO_ENTITY[object_id]
            on = bool(getattr(st, "state", False))
            pct = int(getattr(st, "speed_level", 0) or 0)
            put(entity_id, "on" if on else "off", percentage=pct)
        elif object_id in HUB_LIGHT_OID_TO_ENTITY:
            entity_id = HUB_LIGHT_OID_TO_ENTITY[object_id]
            on = bool(getattr(st, "state", False))
            bri = int(getattr(st, "brightness", 0) or 0)
            put(entity_id, "on" if on else "off", brightness=bri)
        elif object_id in HUB_SELECT_OID_TO_ENTITY:
            entity_id = HUB_SELECT_OID_TO_ENTITY[object_id]
            state = str(getattr(st, "state", "") or "")
            opts = select_options.get(object_id, [])
            put(entity_id, state, options=opts)

    return controls


def _hub_binaries_from_states(
    states: dict[int, Any],
    key_to_object: dict[int, str],
    entities: list[Any] | None = None,
) -> dict[str, bool]:
    """Map hub template binary sensors; skip OIDs with no RX yet (dash_computed pot fallback)."""
    binaries: dict[str, bool] = {}
    for key, st in states.items():
        object_id = key_to_object.get(key, "")
        entity_id = HUB_BINARY_OID_TO_ENTITY.get(object_id)
        if not entity_id:
            continue
        on = bool(getattr(st, "state", False))
        if isinstance(getattr(st, "state", None), str):
            on = str(st.state).lower() in ("on", "true", "1")
        binaries[entity_id] = on
    return binaries


def _finalize_hub_binaries(state: FleetState) -> None:
    """Fill hub ESP/link binaries when template sensors did not publish this poll."""
    if not state.hub or not state.hub.online:
        return
    now = time.time()
    binaries = dict(state.hub.values.get("binaries") or {})
    for n in range(1, 5):
        eid = f"binary_sensor.dsc_hub_pot{n}_esp_now_link"
        if eid in binaries:
            continue
        pot = state.pots.get(f"pot{n}")
        fresh = (
            pot is not None
            and pot.online
            and pot.last_seen is not None
            and now - float(pot.last_seen) < 150.0
        )
        binaries[eid] = fresh
    root_eid = "binary_sensor.dsc_hub_root_zone_sensor_fault"
    if root_eid not in binaries:
        any_plausible = False
        for n in range(1, 5):
            pot = state.pots.get(f"pot{n}")
            if not pot or not pot.online:
                continue
            soil_t = pot.values.get("soil_temp_c")
            if soil_t is None:
                continue
            try:
                if 5.0 <= float(soil_t) <= 45.0:
                    any_plausible = True
                    break
            except (TypeError, ValueError):
                continue
        binaries[root_eid] = not any_plausible
    state.hub.values["binaries"] = binaries


_ingest = EsphomeIngest()


def start_esphome_ingest() -> None:
    _ingest.start()


async def stop_esphome_ingest() -> None:
    await _ingest.stop()
