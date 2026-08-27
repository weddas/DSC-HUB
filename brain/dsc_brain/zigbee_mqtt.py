"""Zigbee2MQTT canopy / extra plug ingest."""

from __future__ import annotations

import json
import logging
import os
import threading
import time
from typing import Any, Callable

from .fleet_state import get_fleet_state, update_fleet_state
from .settings import get_setting, list_inventory, set_setting

_logger = logging.getLogger(__name__)

try:
    import paho.mqtt.client as mqtt
except ImportError:  # pragma: no cover
    mqtt = None  # type: ignore[assignment]

_permit_timer: threading.Timer | None = None
_permit_lock = threading.Lock()


def _placement_map() -> dict[str, str]:
    """friendly_name → placement label (settings JSON + inventory extras)."""
    out: dict[str, str] = {}
    raw = get_setting("zigbee_placements", "")
    if raw:
        try:
            parsed = json.loads(raw)
            if isinstance(parsed, dict):
                for k, v in parsed.items():
                    if k and v:
                        out[str(k)] = str(v)
        except json.JSONDecodeError:
            pass
    for row in list_inventory():
        extra = row.get("extra") or {}
        if not isinstance(extra, dict):
            continue
        fname = extra.get("zigbee_friendly_name") or extra.get("friendly_name")
        placement = extra.get("placement")
        if fname and placement:
            out[str(fname)] = str(placement)
    return out


def _clear_permit_join_flag() -> None:
    set_setting("zigbee_permit_join", "false")


def _schedule_permit_join_expiry(duration_s: int) -> None:
    global _permit_timer
    with _permit_lock:
        if _permit_timer is not None:
            _permit_timer.cancel()
        _permit_timer = threading.Timer(float(duration_s), _clear_permit_join_flag)
        _permit_timer.daemon = True
        _permit_timer.start()


def _cancel_permit_join_expiry() -> None:
    global _permit_timer
    with _permit_lock:
        if _permit_timer is not None:
            _permit_timer.cancel()
            _permit_timer = None


class ZigbeeMqttIngest:
    def __init__(self) -> None:
        self._thread: threading.Thread | None = None
        self._client: Any = None
        self._running = False
        self._mqtt_connected = False
        self._canopy: dict[str, Any] = {}
        self._devices: list[dict[str, Any]] = []
        self._devices_updated_at: float | None = None
        self._device_states: dict[str, dict[str, Any]] = {}
        self._by_placement: dict[str, dict[str, Any]] = {}
        self._bridge_state: str | None = None
        self._bridge_state_updated_at: float | None = None

    def start(self) -> None:
        if mqtt is None:
            _logger.warning("paho-mqtt not installed")
            return
        if self._thread and self._thread.is_alive():
            return
        self._running = True
        self._thread = threading.Thread(target=self._run, daemon=True)
        self._thread.start()

    def stop(self) -> None:
        self._running = False
        self._mqtt_connected = False
        if self._client:
            self._client.loop_stop()
            self._client.disconnect()

    def _run(self) -> None:
        host = os.environ.get("MQTT_HOST", "mosquitto")
        port = int(os.environ.get("MQTT_PORT", "1883"))
        client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
        client.on_message = self._on_message

        def on_connect(_c: Any, _u: Any, _f: Any, reason_code: Any, _p: Any = None) -> None:
            if reason_code == 0 or str(reason_code) == "Success":
                self._mqtt_connected = True
                client.subscribe("zigbee2mqtt/+")
                client.subscribe("zigbee2mqtt/bridge/devices")
                client.subscribe("zigbee2mqtt/bridge/state")
            else:
                self._mqtt_connected = False

        def on_disconnect(_c: Any, _u: Any, _f: Any, reason_code: Any, _p: Any = None) -> None:
            self._mqtt_connected = False

        client.on_connect = on_connect
        client.on_disconnect = on_disconnect
        try:
            client.connect(host, port, 60)
            self._client = client
            client.loop_start()
            while self._running:
                time.sleep(1.0)
        except Exception as exc:  # noqa: BLE001
            self._mqtt_connected = False
            _logger.warning("Zigbee MQTT connect failed: %s", exc)

    def _on_message(self, _client: Any, _userdata: Any, msg: Any) -> None:
        topic = msg.topic or ""
        try:
            payload = json.loads(msg.payload.decode("utf-8"))
        except (json.JSONDecodeError, UnicodeDecodeError):
            return
        if topic == "zigbee2mqtt/bridge/devices":
            self._update_devices(payload)
            return
        if topic == "zigbee2mqtt/bridge/state":
            self._update_bridge_state(payload)
            return
        if not isinstance(payload, dict):
            return
        if not topic.startswith("zigbee2mqtt/"):
            return
        friendly_name = topic.split("/", 1)[1]
        if friendly_name.startswith("bridge"):
            return

        now = time.time()
        state_row = {
            "friendly_name": friendly_name,
            "updated_at": now,
            **payload,
        }
        self._device_states[friendly_name] = state_row

        placements = _placement_map()
        placement = placements.get(friendly_name)
        if placement:
            self._by_placement[placement] = dict(state_row)

        # Legacy aggregate canopy (first temp/humidity seen or placement canopy/*).
        if "temperature" in payload:
            self._canopy["temp_c"] = payload.get("temperature")
        if "humidity" in payload:
            self._canopy["rh_pct"] = payload.get("humidity")
        if placement and placement.lower().startswith("canopy"):
            if "temperature" in payload:
                self._canopy["temp_c"] = payload.get("temperature")
            if "humidity" in payload:
                self._canopy["rh_pct"] = payload.get("humidity")
        self._canopy["last_topic"] = topic
        self._canopy["updated_at"] = now

        fleet_state = get_fleet_state()
        fleet_state.canopy = dict(self._canopy)
        fleet_state.system = dict(fleet_state.system)
        fleet_state.system["zigbee_device_states"] = dict(self._device_states)
        fleet_state.system["zigbee_by_placement"] = dict(self._by_placement)
        fleet_state.system["zigbee_placements"] = placements
        update_fleet_state(fleet_state)

    def _update_devices(self, payload: Any) -> None:
        if not isinstance(payload, list):
            return
        devices: list[dict[str, Any]] = []
        for item in payload:
            if not isinstance(item, dict):
                continue
            devices.append(
                {
                    "ieee_address": item.get("ieee_address") or item.get("ieeeAddress"),
                    "friendly_name": item.get("friendly_name") or item.get("friendlyName"),
                    "type": item.get("type"),
                    "model": (item.get("definition") or {}).get("model")
                    if isinstance(item.get("definition"), dict)
                    else item.get("model"),
                    "vendor": (item.get("definition") or {}).get("vendor")
                    if isinstance(item.get("definition"), dict)
                    else item.get("vendor"),
                    "supported": item.get("supported"),
                    "disabled": item.get("disabled"),
                }
            )
        self._devices = devices
        self._devices_updated_at = time.time()
        state = get_fleet_state()
        state.system = dict(state.system)
        state.system["zigbee_devices"] = devices
        state.system["zigbee_devices_updated_at"] = self._devices_updated_at
        update_fleet_state(state)

    def _update_bridge_state(self, payload: Any) -> None:
        state_val: str | None = None
        if isinstance(payload, dict):
            raw = payload.get("state")
            if raw is not None:
                state_val = str(raw).lower()
        elif isinstance(payload, str):
            state_val = payload.strip().lower()
        if state_val not in ("online", "offline"):
            return
        self._bridge_state = state_val
        self._bridge_state_updated_at = time.time()
        fleet = get_fleet_state()
        fleet.system = dict(fleet.system)
        fleet.system["zigbee_bridge_state"] = state_val
        fleet.system["zigbee_bridge_state_updated_at"] = self._bridge_state_updated_at
        update_fleet_state(fleet)


_ingest = ZigbeeMqttIngest()


def start_zigbee_ingest() -> None:
    _ingest.start()


def stop_zigbee_ingest() -> None:
    _cancel_permit_join_expiry()
    _ingest.stop()


def get_zigbee_devices() -> list[dict[str, Any]]:
    return list(_ingest._devices)


def get_zigbee_device_states() -> dict[str, dict[str, Any]]:
    return dict(_ingest._device_states)


def get_zigbee_by_placement() -> dict[str, dict[str, Any]]:
    return dict(_ingest._by_placement)


def get_zigbee_health() -> dict[str, Any]:
    permit_join = get_setting("zigbee_permit_join", "false").lower() == "true"
    end_devices = [d for d in _ingest._devices if d.get("type") != "Coordinator"]
    bridge_state = _ingest._bridge_state
    radio_up = bridge_state == "online"
    if bridge_state is None and not _ingest._mqtt_connected:
        radio_note = "MQTT offline — brain cannot reach zigbee2mqtt"
    elif bridge_state == "offline":
        radio_note = "Coordinator offline — check USB stick and dsc-hub-z2m logs"
    elif bridge_state is None:
        radio_note = "Coordinator state unknown — z2m has not published bridge/state yet"
    elif radio_up:
        radio_note = "Coordinator online"
    else:
        radio_note = f"Coordinator state: {bridge_state}"
    return {
        "mqtt_connected": _ingest._mqtt_connected,
        "bridge_state": bridge_state,
        "bridge_state_updated_at": _ingest._bridge_state_updated_at,
        "radio_up": radio_up,
        "radio_note": radio_note,
        "device_count": len(_ingest._devices),
        "end_device_count": len(end_devices),
        "devices_updated_at": _ingest._devices_updated_at,
        "canopy_updated_at": _ingest._canopy.get("updated_at"),
        "permit_join": permit_join,
    }


def set_permit_join(
    enabled: bool,
    duration_s: int = 120,
    callback: Callable[[bool], None] | None = None,
) -> None:
    """Publish zigbee2mqtt bridge permit_join (best-effort). z2m 2.x expects {"time": N}."""
    if enabled:
        seconds = max(1, min(int(duration_s), 254))
        _schedule_permit_join_expiry(seconds)
    else:
        seconds = 0
        _cancel_permit_join_expiry()
    if mqtt is None or _ingest._client is None:
        return
    payload = json.dumps({"time": seconds})
    _ingest._client.publish("zigbee2mqtt/bridge/request/permit_join", payload)
    if callback:
        callback(enabled)
