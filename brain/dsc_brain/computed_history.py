"""Persist the brain's computed entities (lights-on-today, deviation, alert flags, want
bands…) so every chart and tooltip reads the record, not a number that exists only
while a browser is polling.

Seat `computed`, metric = entity_id, throttled: a row on change or every 5 minutes.
"""

from __future__ import annotations

import time
from typing import Any

from .settings import record_history_throttled

COMPUTED_SEAT = "computed"
HEARTBEAT_S = 300.0

_BOOL = {"on": 1.0, "off": 0.0, "true": 1.0, "false": 0.0}


def _numeric(state: Any) -> float | None:
    if isinstance(state, bool):
        return 1.0 if state else 0.0
    if isinstance(state, (int, float)):
        return float(state)
    raw = str(state).strip().lower()
    if raw in _BOOL:
        return _BOOL[raw]
    try:
        v = float(raw)
    except ValueError:
        return None
    return v if v == v else None  # NaN guard


def record_computed_states(states: dict[str, dict[str, Any]], now: float | None = None) -> int:
    """Record every `sensor.dsc_*` / `binary_sensor.dsc_*` computed state that parses as a
    number or on/off. Returns the number of rows written this call."""
    ts = time.time() if now is None else now
    written = 0
    for eid, ent in states.items():
        if not isinstance(ent, dict):
            continue
        if not (eid.startswith("sensor.dsc_") or eid.startswith("binary_sensor.dsc_")):
            continue
        v = _numeric(ent.get("state"))
        if v is None:
            continue
        if record_history_throttled(COMPUTED_SEAT, eid, v, ts, heartbeat_s=HEARTBEAT_S):
            written += 1
    return written


# ---- brain-owned cadence: a background task, independent of any browser polling ----------
_TASK = None
INTERVAL_S = 60.0


async def _recorder_loop() -> None:
    import asyncio
    import logging

    from .computed_ops import build_computed_hass_states
    from .fleet_state import get_fleet_state
    from .settings import list_inventory

    log = logging.getLogger(__name__)
    while True:
        try:
            states = build_computed_hass_states(get_fleet_state(), list_inventory())
            record_computed_states(states)
        except Exception as exc:  # noqa: BLE001
            log.warning("computed history tick failed: %s", exc)
        await asyncio.sleep(INTERVAL_S)


def start_computed_recorder() -> None:
    """Start the 60 s recorder on the running event loop (idempotent)."""
    global _TASK
    import asyncio

    if _TASK is not None and not _TASK.done():
        return
    _TASK = asyncio.get_event_loop().create_task(_recorder_loop())


def stop_computed_recorder() -> None:
    global _TASK
    if _TASK is not None:
        _TASK.cancel()
        _TASK = None
