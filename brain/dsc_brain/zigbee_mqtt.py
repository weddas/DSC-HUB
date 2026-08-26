"""Zigbee2MQTT canopy / extra plug ingest."""

from __future__ import annotations

import json
import logging
import os
import threading
import time
from typing import Any, Callable

from .fleet_state import get_fleet_state, update_fleet_state
from .settings import get_setting, list_inventory

_logger = logging.getLogger(__name__)

try:
    import paho.mqtt.client as mqtt
except ImportError:  # pragma: no cover
    mqtt = None  # type: ignore[assignment]


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


class ZigbeeMqttIngest:
    def __init__(self) -> None:
        self._thread: threading.Thread | None = None
        self._client: Any = None
        self._running = False
        self._canopy: dict[str, Any] = {}
        self._devices: list[dict[str, Any]] = []
        self._devices_updated_at: float | None = None
        self._device_states: dict[str, dict[str, Any]] = {}
        self._by_placement: dict[str, dict[str, Any]] = {}

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
                client.subscribe("zigbee2mqtt/+")
                client.subscribe("zigbee2mqtt/bridge/devices")

        client.on_connect = on_connect
        try:
            client.connect(host, port, 60)
            self._client = client
            client.loop_start()
            while self._running:
                time.sleep(1.0)
        except Exception as exc:  # noqa: BLE001
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


_ingest = ZigbeeMqttIngest()


def start_zigbee_ingest() -> None:
    _ingest.start()


def stop_zigbee_ingest() -> None:
    _ingest.stop()


def get_zigbee_devices() -> list[dict[str, Any]]:
    return list(_ingest._devices)


def get_zigbee_device_states() -> dict[str, dict[str, Any]]:
    return dict(_ingest._device_states)


def get_zigbee_by_placement() -> dict[str, dict[str, Any]]:
    return dict(_ingest._by_placement)


def set_permit_join(enabled: bool, callback: Callable[[bool], None] | None = None) -> None:
    """Publish zigbee2mqtt bridge permit_join (best-effort)."""
    if mqtt is None or _ingest._client is None:
        return
    payload = json.dumps({"permit_join": enabled})
    _ingest._client.publish("zigbee2mqtt/bridge/request/permit_join", payload)
    if callback:
        callback(enabled)
