"""Serialize ESPHome Native API sessions per host (single-client devices).

This used to be a dict of ``asyncio.Lock``. An asyncio.Lock binds itself to the first
event loop that touches it, and the brain talks to devices from several: the uvicorn loop
(ingest, appliance driver, WebSocket writes), FastAPI's threadpool via ``asyncio.run``
(``/control/service``, automation actuators), and the paho MQTT thread via a fresh
``asyncio.run`` for the Zigbee safety cut-out. A waiter queued on a lock owned by another
loop is never woken, so the cut-out could hang forever exactly when it mattered.

The lock is now a plain ``threading.Lock`` acquired in a worker thread with a bounded wait,
so it serialises across loops and threads alike and a wedged device session turns into a
``TimeoutError`` for the next caller instead of an infinite hang.
"""

from __future__ import annotations

import asyncio
import threading
from collections import defaultdict

ACQUIRE_TIMEOUT_S = 30.0
POLL_S = 0.02


class HostLock:
    """``async with host_lock(host):`` — usable from any loop; never binds to one."""

    __slots__ = ("_lock", "host")

    def __init__(self, host: str) -> None:
        self.host = host
        self._lock = threading.Lock()

    async def __aenter__(self) -> "HostLock":
        # Non-blocking try + a short async sleep, never a thread parked in acquire(): a
        # blocked worker thread outlives a cancelled task and lifespan shutdown then waits
        # the full timeout joining it (seen as 30 s TestClient teardowns). Polling every
        # 20 ms is far below any device session's duration and is cancellation-safe.
        loop = asyncio.get_running_loop()
        deadline = loop.time() + ACQUIRE_TIMEOUT_S
        while not self._lock.acquire(blocking=False):
            if loop.time() >= deadline:
                raise TimeoutError(f"ESPHome host {self.host!r} busy for {ACQUIRE_TIMEOUT_S:.0f}s")
            await asyncio.sleep(POLL_S)
        return self

    async def __aexit__(self, *_exc: object) -> None:
        self._lock.release()

    def locked(self) -> bool:
        return self._lock.locked()


_locks: dict[str, HostLock] = {}
_registry_lock = threading.Lock()


def host_lock(host: str) -> HostLock:
    key = host or "default"
    lock = _locks.get(key)
    if lock is None:
        with _registry_lock:
            lock = _locks.get(key)
            if lock is None:
                lock = _locks[key] = HostLock(key)
    return lock
