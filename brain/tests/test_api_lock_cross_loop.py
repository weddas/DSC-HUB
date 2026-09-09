"""host_lock must serialise sessions across event loops and threads, and never hang.

The Zigbee safety cut-out runs `asyncio.run(...)` on a fresh loop from the paho thread while
the ingest poll holds the same host on the uvicorn loop. With an asyncio.Lock the second
loop's waiter was never woken. This pins the threading-backed replacement.
"""

from __future__ import annotations

import asyncio
import threading
import time

import pytest

from dsc_brain import api_lock


def _fresh(host: str) -> api_lock.HostLock:
    api_lock._locks.pop(host, None)
    return api_lock.host_lock(host)


def test_second_loop_waits_then_proceeds() -> None:
    host = "10.0.0.99"
    _fresh(host)
    order: list[str] = []

    async def holder() -> None:
        async with api_lock.host_lock(host):
            order.append("a-in")
            await asyncio.sleep(0.4)
            order.append("a-out")

    async def waiter() -> None:
        await asyncio.sleep(0.05)  # let the holder win the lock first
        async with api_lock.host_lock(host):
            order.append("b-in")

    t = threading.Thread(target=lambda: asyncio.run(holder()))
    t.start()
    time.sleep(0.02)
    asyncio.run(waiter())  # a different event loop, same host
    t.join(timeout=5)
    assert order == ["a-in", "a-out", "b-in"], order


def test_bounded_wait_raises_instead_of_hanging(monkeypatch: pytest.MonkeyPatch) -> None:
    host = "10.0.0.98"
    lock = _fresh(host)
    monkeypatch.setattr(api_lock, "ACQUIRE_TIMEOUT_S", 0.2)
    lock._lock.acquire()  # simulate a wedged session that never releases
    try:

        async def go() -> None:
            async with api_lock.host_lock(host):
                pass

        with pytest.raises(TimeoutError):
            asyncio.run(go())
    finally:
        lock._lock.release()
