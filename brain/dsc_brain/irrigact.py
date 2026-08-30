"""IrrigAct — Brain-commanded irrigation shots with honest OOS."""

from __future__ import annotations

import json
import time
from typing import Any

from .event_log import record_grow_log
from .zigbee_mqtt import _ingest, load_zigbee_bindings

try:
    import paho.mqtt.client as mqtt
except ImportError:  # pragma: no cover
    mqtt = None  # type: ignore[assignment]


def resolve_pump_seat() -> dict[str, Any] | None:
    """Return bound Zigbee plug_pump seat, or None if missing."""
    bindings = load_zigbee_bindings()
    for ieee, row in bindings.items():
        if not isinstance(row, dict):
            continue
        if str(row.get("role") or "") != "plug_pump":
            continue
        if not row.get("enabled", True):
            continue
        friendly = str(row.get("friendly_name") or "").strip()
        if not friendly:
            continue
        return {
            "kind": "zigbee_plug_pump",
            "ieee": str(ieee),
            "friendly_name": friendly,
            "zone": str(row.get("zone") or "shared"),
        }
    return None


def irrigation_shot(*, pot_id: str = "", duration_s: float = 2.0) -> dict[str, Any]:
    """Command one shot. Guardrails: max duration, pump seat required."""
    max_s = 30.0
    dur = max(0.5, min(float(duration_s or 2.0), max_s))
    seat = resolve_pump_seat()
    if seat is None:
        out = {
            "ok": False,
            "status": "oos",
            "reason": "no_pump_seat",
            "pot_id": pot_id or None,
            "detail": "No Zigbee plug_pump role bound — irrigation act withheld",
        }
        record_grow_log(f"irrigact OOS pot={pot_id or '-'} reason=no_pump_seat")
        return out

    topic = f"zigbee2mqtt/{seat['friendly_name']}/set"
    payload = json.dumps({"state": "ON", "on_time": int(dur)})
    published = False
    if mqtt is not None and getattr(_ingest, "_client", None) is not None:
        try:
            _ingest._client.publish(topic, payload)
            published = True
        except Exception as exc:  # noqa: BLE001
            out = {
                "ok": False,
                "status": "error",
                "reason": "mqtt_publish_failed",
                "pot_id": pot_id or None,
                "seat": seat,
                "detail": str(exc),
            }
            record_grow_log(f"irrigact FAIL pot={pot_id or '-'} seat={seat['friendly_name']} err={exc}")
            return out

    if not published:
        out = {
            "ok": False,
            "status": "oos",
            "reason": "mqtt_offline",
            "pot_id": pot_id or None,
            "seat": seat,
            "detail": "Brain MQTT client offline — shot not sent",
        }
        record_grow_log(f"irrigact OOS pot={pot_id or '-'} reason=mqtt_offline seat={seat['friendly_name']}")
        return out

    out = {
        "ok": True,
        "status": "commanded",
        "pot_id": pot_id or None,
        "seat": seat,
        "duration_s": dur,
        "topic": topic,
        "ts": time.time(),
    }
    record_grow_log(
        f"irrigact SHOT pot={pot_id or '-'} seat={seat['friendly_name']} ieee={seat['ieee']} dur={dur}s"
    )
    return out
