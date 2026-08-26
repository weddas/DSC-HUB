"""Serialize ESPHome Native API sessions per host (single-client devices)."""

from __future__ import annotations

import asyncio
from collections import defaultdict

_locks: dict[str, asyncio.Lock] = defaultdict(asyncio.Lock)


def host_lock(host: str) -> asyncio.Lock:
    return _locks[host or "default"]
