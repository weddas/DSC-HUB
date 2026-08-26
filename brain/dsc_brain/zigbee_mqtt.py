"""Zigbee2MQTT canopy / extra plug ingest."""

from __future__ import annotations

import json
import logging
import os
import threading
import time
from typing import Any, Callable

from .fleet_state import FleetState, get_fleet_state, update_fleet_state

_logger = logging.getLogger(__name__)

try:
    import paho.mqtt.client as mqtt
except ImportError:  # pragma: no cover
    mqtt = None  # type: ignore[assignment]


class ZigbeeMqttIngest:
    def __init__(self) -> None:
        self._thread: threading.Thread | None = None
        self._client: Any = None
        self._running = False
        self._canopy: dict[str, Any] = {}
        self._devices: list[dict[str, Any]] = []
        self._devices_updated_at: float | None = None

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
        if "temperature" in payload:
            self._canopy["temp_c"] = payload.get("temperature")
        if "humidity" in payload:
            self._canopy["rh_pct"] = payload.get("humidity")
        self._canopy["last_topic"] = topic
        self._canopy["updated_at"] = time.time()
        state = get_fleet_state()
        state.canopy = dict(self._canopy)
        update_fleet_state(state)

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
                    "model": (item.get("definition") or {}).get("model") if isinstance(item.get("definition"), dict) else item.get("model"),
                    "vendor": (item.get("definition") or {}).get("vendor") if isinstance(item.get("definition"), dict) else item.get("vendor"),
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


def set_permit_join(enabled: bool, callback: Callable[[bool], None] | None = None) -> None:
    """Publish zigbee2mqtt bridge permit_join (best-effort)."""
    if mqtt is None or _ingest._client is None:
        return
    payload = json.dumps({"permit_join": enabled})
    _ingest._client.publish("zigbee2mqtt/bridge/request/permit_join", payload)
    if callback:
        callback(enabled)
