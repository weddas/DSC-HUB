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
from .fleet_state import fleet_state_lock
from .global_modifiers import apply_temp_rh_offsets
from .hub_failover import on_hub_reconnect, snapshot_from_hub_values
from .hub_controls import (
    HUB_BINARY_OID_TO_ENTITY,
    HUB_FAN_OID_TO_ENTITY,
    HUB_LIGHT_OID_TO_ENTITY,
    HUB_NUMBER_OID_TO_ENTITY,
    HUB_SELECT_OID_TO_ENTITY,
    HUB_SENSOR_OID_TO_KEY,
    HUB_SWITCH_OID_TO_ENTITY,
    HUB_TEXT_SENSOR_OID_TO_KEY,
    HUB_TIME_OID_TO_ENTITY,
)
from .api_lock import host_lock
from .native_api import make_api_client
from .paths import EXPECTED_FIRMWARE, SURFACE_VERSION
from .settings import list_inventory, record_history, record_history_throttled
from .zigbee_mqtt import apply_zigbee_cache_to_state

_logger = logging.getLogger(__name__)

_PREV_HUB_DEMANDS: dict[str, str] = {}
_BOOT_GROW_LOGGED = False

# Hub mode/ownership switches worth an audit line in the grow-log when they flip.
_HUB_MODE_SWITCHES: dict[str, str] = {
    "switch.dsc_hub_manual_takeover": "Manual takeover",
    "switch.dsc_hub_tent_full_auto_mode": "Full Auto",
    "switch.dsc_hub_tent_manual_override": "Fan override",
    "switch.dsc_hub_manual_light_hold": "Manual light hold",
}

# object_id suffix → fleet values key (pots only — hub uses exact OID map)
POT_MAP = {
    "soil_moisture": "moisture_pct",
    "soil_temperature": "soil_temp_c",
    "soil_ec": "ec_us",
    "soil_conductivity": "ec_us",
    "soil_ph": "ph",
    "soil_nitrogen": "nitrogen",
    "soil_phosphorus": "phosphorus",
    "soil_potassium": "potassium",
}

# Physically/practically plausible ranges for the calibrated soil metrics. A probe's
# on-device calibration can be wrong (seen live: pH 114 from a raw 6.8), and since the
# desks now trust the live reading over the firmware fault flag, an impossible calibrated
# value would render straight onto the gauge. Reject out-of-range values so the gauge shows
# "no data" instead of a garbage number; the raw channel and the rejected value are kept.
# pH and moisture are hard physical bounds; the rest are generous sanity limits that never
# clip a legitimate reading.
# Only the channels the probe actually MEASURES. N/P/K are derived from EC downstream
# (the desks label them "from EC"), not raw probe reads, so they are not clamped here —
# the EC bound below covers their source.
SOIL_PLAUSIBLE: dict[str, tuple[float, float]] = {
    "ph": (0.0, 14.0),
    "moisture_pct": (0.0, 100.0),
    "soil_temp_c": (-10.0, 70.0),
    "ec_us": (0.0, 20000.0),
}

def _reject_implausible_soil(values: dict[str, Any]) -> list[str]:
    """Null out calibrated soil readings outside their physical range, in place.

    Keeps the rejected number under ``<field>_implausible`` and records the rejected field
    names under ``soil_implausible`` for honest surfacing. Raw channels are never touched.
    Returns the list of rejected fields.
    """
    rejected: list[str] = []
    for field, (lo, hi) in SOIL_PLAUSIBLE.items():
        v = values.get(field)
        if isinstance(v, bool):
            continue
        if isinstance(v, (int, float)) and not (lo <= float(v) <= hi):
            values[f"{field}_implausible"] = float(v)
            values[field] = None
            rejected.append(field)
    if rejected:
        values["soil_implausible"] = rejected
    return rejected


POT_BINARY_OID_TO_KEY: dict[str, str] = {
    "clock_valid_bs": "clock_valid",
    "clock_valid": "clock_valid",
    "probe_online_bs": "modbus_probe_online",
    "modbus_probe_online": "modbus_probe_online",
    "sensor_fault_bs": "sensor_fault",
    "sensor_fault": "sensor_fault",
}

_ONLINE_STALE_SEC = 120.0

_FAN_HISTORY_METRICS: dict[str, str] = {
    "fan.dsc_hub_4_inch_intake_fan_main": "fan_intake_main_pct",
    "fan.dsc_hub_4_inch_intake_fan_2x4": "fan_intake_2x4_pct",
    "fan.dsc_hub_6_inch_exhaust_outside": "fan_exhaust_outside_pct",
    "fan.dsc_hub_6_inch_exhaust_room": "fan_exhaust_room_pct",
}

_WINDOW_HISTORY_METRICS: dict[str, str] = {
    "binary_sensor.dsc_hub_4x8_window_open": "window_4x8_open",
    "binary_sensor.dsc_hub_2x4_window_open": "window_2x4_open",
}

ONLINE_STALE_SEC = _ONLINE_STALE_SEC


class EsphomeIngest:
    """Background asyncio loop subscribing to fleet Native API."""

    def __init__(self) -> None:
        self._task: asyncio.Task[None] | None = None
        self._running = False
        # Shallow copy of the system dict each poll started from (see _run's merge).
        self._poll_base_system: dict[str, Any] = {}

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
                from .tuya_local import apply_tuya_cache_to_state

                with fleet_state_lock():
                    # The poll started from a copy of `system` taken seconds ago. Anything
                    # another writer (Zigbee, Tuya, automation banners) stored since would
                    # be silently rolled back if we published that copy, so start from the
                    # LATEST system dict and lay only the keys this poll actually wrote on
                    # top — a value the poll did not reassign is still the same object.
                    base = self._poll_base_system
                    merged = dict(get_fleet_state().system)
                    for key, val in state.system.items():
                        if key not in base or base[key] is not val:
                            merged[key] = val
                    state.system = merged
                    # Zigbee MQTT may have advanced canopy during the poll — stamp the
                    # ingest cache so we never clobber role-bound climate.
                    apply_zigbee_cache_to_state(state)
                    # Tuya lane rows ride the same role buckets; its own keys are stamped here.
                    apply_tuya_cache_to_state(state)
                    update_fleet_state(state)
                # Brain-owned hub tunables: adopt new entities, confirm echoes, push what is
                # queued (never while takeover / reconnect override holds). Never raises.
                from .hub_tunables import on_fleet_poll

                await on_fleet_poll(state)
                from .journal_storage import maybe_prune_journals

                maybe_prune_journals()
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
        # Same value objects as `state.system` starts with — see the merge in `_run`.
        self._poll_base_system = dict(state.system)

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

        # Plan first, fetch every device concurrently (different hosts, different locks),
        # then apply in seat order. Sequential fetches — each holding a session 3–8 s —
        # made one full pass take ~30 s, so the hub half of the snapshot was already
        # ~25 s old by the time it was published and up to ~60 s old before the next one.
        plan: list[tuple[str, dict[str, Any], str, str | None, str, str]] = []
        for seat_id, row in seat_order:
            role = row.get("role", "")
            host = row.get("host") or os.environ.get(f"DSC_{seat_id.upper()}_HOST")
            api_key = row.get("api_key") or os.environ.get(f"DSC_{seat_id.upper()}_API_KEY", "")
            # Panel firmware disables Noise (RAM); plaintext API only.
            if role == "panel":
                api_key = row.get("api_key") or ""
            if not row.get("in_service"):
                # in_service gates WRITES, not observation. An out-of-service Sonoff
                # whose relay is physically ON is exactly the state the failsafe exists
                # for, so keep reading it (read-only) instead of going blind.
                kind = "oos_read" if role.startswith("sonoff") and host else "oos_mark"
            elif not host:
                kind = "skip"
            else:
                kind = "read"
            plan.append((seat_id, row, role, host, api_key or "", kind))

        async def fetch(seat_id: str, host: str, api_key: str, role: str) -> dict[str, Any] | Exception:
            try:
                return await _fetch_device(host, api_key, role, seat_id)
            except Exception as exc:  # noqa: BLE001
                return exc

        to_fetch = [(sid, host, key, role) for sid, _row, role, host, key, kind in plan if kind in ("read", "oos_read")]
        fetched = await asyncio.gather(*(fetch(sid, host or "", key, role) for sid, host, key, role in to_fetch))
        results: dict[str, dict[str, Any] | Exception] = {sid: res for (sid, _h, _k, _r), res in zip(to_fetch, fetched)}

        for seat_id, _row, role, host, _api_key, kind in plan:
            if kind == "skip":
                continue
            if kind == "oos_mark":
                self._mark_oos_seat(state, seat_id, role, prev)
                continue
            res = results.get(seat_id)
            if isinstance(res, dict):
                self._apply_readings(state, seat_id, role, res)
                if kind == "oos_read":
                    seat = state.sonoffs.get(seat_id)
                    if seat is not None:
                        seat.values["in_service"] = False
                continue
            if kind == "oos_read":
                _logger.debug("ESPHome OOS %s @ %s: %s", seat_id, host, res)
                self._mark_oos_seat(state, seat_id, role, prev)
            else:
                _logger.debug("ESPHome %s @ %s: %s", seat_id, host, res)
                self._mark_stale_seat(state, seat_id, role, prev)

        self._expire_unpolled_seats(state, prev, inventory)

        appliance = get_appliance_status()
        state.system["appliance_link"] = appliance.get("hub_ok", False)
        state.system["appliance_link_note"] = (
            "Hub demand poll freshness; not per-Sonoff reachability"
        )
        state.system["relays"] = dict(appliance.get("relays", {}))
        state.system["relay_demand"] = dict(appliance.get("demand", {}))
        relay_poll_ts = time.time()
        commanded_map = appliance.get("relays", {}) or {}
        demand_map = appliance.get("demand", {}) or {}
        for seat_id, sonoff in state.sonoffs.items():
            cmd = commanded_map.get(seat_id)
            dem = demand_map.get(seat_id)
            if cmd is not None:
                sonoff.values["relay_commanded"] = bool(cmd)
            if dem is not None:
                sonoff.values["relay_demand"] = bool(dem)
            # relay_on is the device's own polled contact state (see _fetch_device);
            # it is never overwritten from the driver. History records the observed
            # state when the seat was polled, else the last command as the best proxy.
            observed = sonoff.values.get("relay_on")
            if isinstance(observed, bool) and sonoff.online:
                record_history(seat_id, "relay_on", 1.0 if observed else 0.0, relay_poll_ts)
            elif cmd is not None:
                record_history(seat_id, "relay_on", 1.0 if cmd else 0.0, relay_poll_ts)

        _finalize_hub_binaries(state)
        return state

    def _mark_oos_seat(
        self,
        state: FleetState,
        seat_id: str,
        role: str,
        prev: FleetState,
    ) -> None:
        prior = self._prior_seat(prev, seat_id, role)
        values = dict(prior.values if prior else {})
        values["in_service"] = False
        seat = SeatState(seat_id, False, prior.firmware if prior else None, values, prior.last_seen if prior else None)
        self._place_seat(state, seat_id, role, seat)

    def _mark_stale_seat(
        self,
        state: FleetState,
        seat_id: str,
        role: str,
        prev: FleetState,
    ) -> None:
        prior = self._prior_seat(prev, seat_id, role)
        if prior is None:
            return
        values = dict(prior.values)
        values["in_service"] = True
        seat = SeatState(seat_id, prior.online, prior.firmware, values, prior.last_seen)
        self._place_seat(state, seat_id, role, seat)

    def _expire_unpolled_seats(
        self,
        state: FleetState,
        prev: FleetState,
        inventory: dict[str, Any],
    ) -> None:
        now = time.time()
        for seat_id, row in inventory.items():
            if not row.get("in_service"):
                continue
            role = row.get("role", "")
            seat = self._current_seat(state, seat_id, role)
            if seat is None:
                continue
            last = seat.last_seen
            if last is not None and now - last > _ONLINE_STALE_SEC:
                seat.online = False

    @staticmethod
    def _prior_seat(prev: FleetState, seat_id: str, role: str) -> SeatState | None:
        if role == "hub":
            return prev.hub
        if role == "panel":
            return prev.panel
        if role == "pot":
            return prev.pots.get(seat_id)
        if role.startswith("sonoff"):
            return prev.sonoffs.get(seat_id)
        return None

    @staticmethod
    def _current_seat(state: FleetState, seat_id: str, role: str) -> SeatState | None:
        if role == "hub":
            return state.hub
        if role == "panel":
            return state.panel
        if role == "pot":
            return state.pots.get(seat_id)
        if role.startswith("sonoff"):
            return state.sonoffs.get(seat_id)
        return None

    @staticmethod
    def _place_seat(state: FleetState, seat_id: str, role: str, seat: SeatState) -> None:
        if role == "hub":
            state.hub = seat
        elif role == "panel":
            state.panel = seat
        elif role == "pot":
            state.pots[seat_id] = seat
        elif role.startswith("sonoff"):
            state.sonoffs[seat_id] = seat

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
            prev_hub = get_fleet_state().hub
            was_online = bool(prev_hub and prev_hub.online)
            state.hub = SeatState("hub", True, fw, values, now)
            controls = values.get("controls") or {}
            takeover_ctrl = controls.get("switch.dsc_hub_manual_takeover") or {}
            takeover = str(takeover_ctrl.get("state", "off")).lower() == "on"
            ov = on_hub_reconnect(
                was_online=was_online,
                is_online=True,
                snapshot=snapshot_from_hub_values(values),
                takeover=takeover,
                now=now,
            )
            if ov is not None and ov.active:
                record_grow_log("Hub reconnect — temporary override until TTL/clear")
            if not _BOOT_GROW_LOGGED:
                stage = (controls.get("select.dsc_hub_grow_stage") or {}).get("state", "")
                mode = (controls.get("select.dsc_hub_clone_mode") or {}).get("state", "")
                bits = [b for b in (f"Stage - {stage}" if stage else None, f"Clone - {mode}" if mode else None) if b]
                if bits:
                    record_grow_log("; ".join(bits))
                _BOOT_GROW_LOGGED = True
            for eid, ctrl in controls.items():
                if eid.startswith("switch.dsc_hub_") and not eid.endswith("_demand"):
                    # Mode / ownership switches: on change or every 5 min (charts + audits).
                    record_history_throttled("hub", eid.replace(".", "_"), 1.0 if ctrl.get("state") == "on" else 0.0, now)
                elif eid.startswith("number.dsc_hub_"):
                    # Setpoints and rails: the band history the VPD chart needs.
                    try:
                        record_history_throttled("hub", eid.replace(".", "_"), float(ctrl.get("state")), now)
                    except (TypeError, ValueError):
                        pass
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
            # Mode/ownership switches are as consequential as a demand flip but were
            # never mirrored to the grow-log (only *_demand switches and selects were).
            for eid, label in _HUB_MODE_SWITCHES.items():
                ctrl = controls.get(eid)
                if not ctrl:
                    continue
                st = str(ctrl.get("state", "off")).lower()
                key = f"mode:{eid}"
                prev = _PREV_HUB_DEMANDS.get(key)
                if prev is not None and prev != st:
                    record_grow_log(f"◆ {label} {'on' if st == 'on' else 'off'}")
                _PREV_HUB_DEMANDS[key] = st
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
                if eid.startswith("binary_sensor.dsc_hub_"):
                    record_history_throttled("hub", "bin_" + eid.split(".", 1)[1], 1.0 if on else 0.0, now)
                key = f"bin:{eid}"
                st = "on" if on else "off"
                prev = _PREV_HUB_DEMANDS.get(key)
                if prev is not None and prev != st and st == "on":
                    if "dark_period" in eid:
                        record_grow_log("⚠ Clone dark-period violation — SF1000 on outside the 2x4 window")
                    elif "root_zone_sensor_fault" in eid:
                        record_grow_log("⚠ Root-zone probes offline — mat fell back to clone-air control")
                _PREV_HUB_DEMANDS[key] = st
            _record_hub_chart_history(controls, binaries, now)
        elif role == "panel":
            state.panel = SeatState("panel", True, fw, values, now)
        elif role == "pot":
            state.pots[seat_id] = SeatState(seat_id, True, fw, values, now)
        elif role.startswith("sonoff"):
            state.sonoffs[seat_id] = SeatState(seat_id, True, fw, values, now)

        for metric, value in values.items():
            if isinstance(value, (int, float)):
                record_history(seat_id, metric, float(value), now)
        # Device binaries (sensor_fault, modbus_probe_online, clock_valid, ...) live nested
        # under values["binaries"], so the numeric loop above never saw them and no seat
        # but the hub ever had a fault history — a dead probe's failure had no timeline.
        if role != "hub":
            for key, on in (values.get("binaries") or {}).items():
                record_history_throttled(seat_id, f"bin_{key}", 1.0 if on else 0.0, now)


def _record_hub_chart_history(
    controls: dict[str, dict[str, Any]],
    binaries: dict[str, bool],
    now: float,
) -> None:
    for fan_entity, metric in _FAN_HISTORY_METRICS.items():
        ctrl = controls.get(fan_entity)
        if not ctrl:
            continue
        pct = float(ctrl.get("percentage") or 0) if ctrl.get("state") == "on" else 0.0
        record_history("hub", metric, pct, now)
    light = controls.get("light.dsc_hub_sf1000_dimmer")
    if light:
        on = light.get("state") == "on"
        bri = float(light.get("brightness") or 0)
        # Controls store 0–255; tolerate accidental 0–1.
        if 0.0 < bri <= 1.0:
            bri_pct = bri * 100.0
        else:
            bri_pct = bri / 255.0 * 100.0
        val = bri_pct if on and bri > 0 else 0.0
        # Binary on for DutyStrip / inspector; brightness kept for charts.
        record_history("hub", "sf1000_on", 1.0 if on else 0.0, now)
        record_history("hub", "sf1000_brightness", val, now)
    twin = controls.get("light.dsc_hub_twin_sf1000")
    if twin:
        on = twin.get("state") == "on"
        bri = float(twin.get("brightness") or 0)
        if 0.0 < bri <= 1.0:
            bri_pct = bri * 100.0
        else:
            bri_pct = bri / 255.0 * 100.0
        val = bri_pct if on and bri > 0 else 0.0
        # Binary on for Got / DutyStrip; brightness kept for charts.
        record_history("hub", "twin_sf1000_on", 1.0 if on else 0.0, now)
        record_history("hub", "twin_sf1000_brightness", val, now)
    for eid, metric in _WINDOW_HISTORY_METRICS.items():
        if eid not in binaries:
            continue
        record_history("hub", metric, 1.0 if binaries[eid] else 0.0, now)


async def _fetch_device(host: str, api_key: str, role: str, seat_id: str) -> dict[str, Any]:
    """Connect briefly and read entity states."""
    client = make_api_client(host, api_key)
    async with host_lock(host):
        await client.connect(login=True)
        values: dict[str, Any] = {}
        fw = EXPECTED_FIRMWARE
        try:
            info = await client.device_info()
            mac = getattr(info, "mac_address", None) if info else None
            if mac:
                values["mac"] = str(mac)
            if info and getattr(info, "esphome_version", None):
                fw = str(info.esphome_version)
                # Keep the ESPHome framework release for every role — `fw` is
                # overwritten below by the product train (8.0.0.0), and the
                # toolchain card / canary check compare against THIS.
                values["esphome_version"] = str(info.esphome_version)
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
                _apply_hub_climate_modifiers(values)
                finalize_hub_climate(values)
                _scrub_faulted_climate(values)
                hub_fw = values.get("firmware_version")
                if hub_fw:
                    fw = str(hub_fw).strip()
            elif role == "pot":
                binaries: dict[str, bool] = {}
                for key, st in states.items():
                    object_id = key_to_object.get(key, "")
                    for suffix, field in POT_MAP.items():
                        if object_id.endswith(suffix) or suffix in object_id:
                            # `soil_moisture_raw` contains `soil_moisture`, so with a plain
                            # substring match whichever state arrived last won and the
                            # on-device calibration was silently discarded. Raw channels
                            # are kept under their own key and never shadow the calibrated one.
                            target = f"{field}_raw" if object_id.endswith("_raw") else field
                            try:
                                values[target] = float(st.state)
                            except (TypeError, ValueError):
                                values[target] = st.state
                            break
                    bin_field = POT_BINARY_OID_TO_KEY.get(object_id)
                    if bin_field is not None:
                        raw = getattr(st, "state", None)
                        binaries[bin_field] = raw in (True, "on", "ON", 1, "1")
                # Reject physically-impossible calibrated readings (e.g. a probe's bad
                # on-device pH cal turning raw 6.8 into 114). The gauge then shows "no data"
                # instead of a garbage number; the rejected value is kept under
                # <field>_implausible and the raw channel is untouched.
                _reject_implausible_soil(values)
                if binaries:
                    values["binaries"] = binaries

            elif role.startswith("sonoff"):
                # Physical relay state straight from the device — the only honest
                # source (the appliance driver knows what it commanded, the hub what
                # it demands; neither is the contact).
                for key, st in states.items():
                    if key_to_object.get(key, "") == "main_relay":
                        raw = getattr(st, "state", None)
                        values["relay_on"] = raw in (True, "on", "ON", 1, "1")
                        break

            # Product firmware stamp from Firmware Version text sensor (all roles).
            for key, st in states.items():
                object_id = key_to_object.get(key, "")
                if object_id != "firmware_version":
                    continue
                product_fw = str(getattr(st, "state", "")).strip()
                if product_fw:
                    fw = product_fw
                    values["firmware_version"] = product_fw
                break

            if unsub:
                unsub()

            values["host"] = host
            values["seat_id"] = seat_id
        finally:
            await client.disconnect()
    return {"firmware": fw, "values": values}


def _apply_hub_climate_modifiers(values: dict[str, Any]) -> None:
    """Apply global temp/RH offsets before VPD recompute."""
    pairs = (
        ("temp_c", "rh_pct", "main"),
        ("clone_temp_c", "clone_rh_pct", "clone"),
        ("room_temp_c", "room_rh_pct", "room"),
    )
    rejected: list[str] = []
    for t_key, rh_key, zone in pairs:
        had_t = values.get(t_key) is not None
        had_rh = values.get(rh_key) is not None
        t, rh, bad = apply_temp_rh_offsets(values.get(t_key), values.get(rh_key), zone)
        # Write the result back even when it is None: a rejected reading must not survive
        # as the raw railed number it started as.
        if had_t:
            values[t_key] = t
            if t is None:
                rejected.append(t_key)
        if had_rh:
            values[rh_key] = rh
            if rh is None:
                rejected.append(rh_key)
        if bad and not (had_t or had_rh):
            rejected.append(zone)
    if rejected:
        values["sensor_clamp_active"] = True
        values["implausible"] = rejected


# Which climate keys each hub fault binary vouches for.
_FAULT_MASKS: tuple[tuple[str, tuple[str, ...]], ...] = (
    ("binary_sensor.dsc_hub_climate_sensor_fault", ("temp_c", "rh_pct", "vpd_kpa", "leaf_vpd_kpa")),
    ("binary_sensor.dsc_hub_aux_sensor_fault", ("room_temp_c", "room_rh_pct", "room_vpd_kpa", "clone_temp_c", "clone_rh_pct", "clone_vpd_kpa", "clone_leaf_vpd_kpa")),
)
_VPD_FROM: tuple[tuple[str, str, tuple[str, ...]], ...] = (
    ("temp_c", "rh_pct", ("vpd_kpa", "leaf_vpd_kpa")),
    ("clone_temp_c", "clone_rh_pct", ("clone_vpd_kpa", "clone_leaf_vpd_kpa")),
    ("room_temp_c", "room_rh_pct", ("room_vpd_kpa",)),
)


def _scrub_faulted_climate(values: dict[str, Any]) -> None:
    """After offsets + VPD: honour the hub's own fault flags and never keep a VPD whose
    inputs are gone. The hub template VPD would otherwise outlive a rejected T/RH."""
    binaries = values.get("binaries") or {}
    masked: list[str] = []
    for eid, keys in _FAULT_MASKS:
        if bool(binaries.get(eid)):
            for k in keys:
                if values.get(k) is not None:
                    values[k] = None
                    masked.append(k)
    for t_key, rh_key, vpd_keys in _VPD_FROM:
        if values.get(t_key) is None or values.get(rh_key) is None:
            for k in vpd_keys:
                if values.get(k) is not None:
                    values[k] = None
    if masked:
        values["climate_fault_masked"] = masked


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
    number_meta: dict[str, dict[str, Any]] = {}
    for ent in entities:
        oid = str(getattr(ent, "object_id", ""))
        if oid in HUB_SELECT_OID_TO_ENTITY and hasattr(ent, "options"):
            select_options[oid] = list(getattr(ent, "options", []) or [])
        elif oid in HUB_NUMBER_OID_TO_ENTITY and hasattr(ent, "min_value"):
            # Native range so the brain validates desired values against the firmware's own
            # bounds (hub_tunables) and the SPA never hardcodes a min/max again.
            meta: dict[str, Any] = {}
            for src, dst in (("min_value", "min"), ("max_value", "max"), ("step", "step")):
                try:
                    meta[dst] = float(getattr(ent, src))
                except (TypeError, ValueError):
                    pass
            unit = getattr(ent, "unit_of_measurement", None)
            if unit:
                meta["unit_of_measurement"] = str(unit)
            number_meta[oid] = meta

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
            meta = number_meta.get(object_id, {})
            try:
                put(entity_id, str(float(st.state)), **meta)
            except (TypeError, ValueError):
                put(entity_id, str(getattr(st, "state", "")), **meta)
        elif object_id in HUB_FAN_OID_TO_ENTITY:
            entity_id = HUB_FAN_OID_TO_ENTITY[object_id]
            on = bool(getattr(st, "state", False))
            pct = int(getattr(st, "speed_level", 0) or 0)
            put(entity_id, "on" if on else "off", percentage=pct)
        elif object_id in HUB_LIGHT_OID_TO_ENTITY:
            entity_id = HUB_LIGHT_OID_TO_ENTITY[object_id]
            on = bool(getattr(st, "state", False))
            # Native API brightness is typically 0.0–1.0; tolerate legacy 0–255.
            bri_raw = float(getattr(st, "brightness", 0) or 0)
            if 0.0 < bri_raw <= 1.0:
                bri = int(round(bri_raw * 255))
            else:
                bri = int(bri_raw)
            put(entity_id, "on" if on else "off", brightness=bri)
        elif object_id in HUB_SELECT_OID_TO_ENTITY:
            entity_id = HUB_SELECT_OID_TO_ENTITY[object_id]
            state = str(getattr(st, "state", "") or "")
            opts = select_options.get(object_id, [])
            put(entity_id, state, options=opts)
        elif object_id in HUB_TIME_OID_TO_ENTITY:
            entity_id = HUB_TIME_OID_TO_ENTITY[object_id]
            if bool(getattr(st, "missing_state", False)):
                put(entity_id, "")
            else:
                try:
                    hour = int(getattr(st, "hour", 0) or 0)
                    minute = int(getattr(st, "minute", 0) or 0)
                    second = int(getattr(st, "second", 0) or 0)
                    put(entity_id, f"{hour:02d}:{minute:02d}:{second:02d}")
                except (TypeError, ValueError):
                    put(entity_id, str(getattr(st, "state", "") or ""))

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
