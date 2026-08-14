"""Soft per-client rate limit with progressive cooldown (not a hard ban)."""

from __future__ import annotations

import asyncio
import threading
import time
from dataclasses import dataclass, field

from .config import settings


@dataclass
class _Bucket:
    tokens: float
    updated: float
    overage_streak: int = 0


@dataclass
class RateLimiter:
    rpm: float = 120.0
    burst: float = 40.0
    cooldown_base_s: float = 0.25
    cooldown_max_s: float = 8.0
    cooldown_429_after: int = 3
    _buckets: dict[str, _Bucket] = field(default_factory=dict)
    _lock: threading.Lock = field(default_factory=threading.Lock, repr=False)

    def _refill(self, b: _Bucket, now: float) -> None:
        rate = self.rpm / 60.0
        elapsed = max(0.0, now - b.updated)
        b.tokens = min(self.burst, b.tokens + elapsed * rate)
        b.updated = now

    def check(self, client_id: str) -> tuple[bool, float, int]:
        """Return (allowed_without_429, cooldown_s, retry_after_s).

        Soft path: allow the request after sleeping cooldown_s (caller awaits).
        Hard-soft path: after streak, set retry_after_s > 0 so caller returns 429.
        """
        if not settings.rate_limit_enabled:
            return True, 0.0, 0
        now = time.monotonic()
        with self._lock:
            b = self._buckets.get(client_id)
            if b is None:
                b = _Bucket(tokens=self.burst, updated=now)
                self._buckets[client_id] = b
            self._refill(b, now)
            if b.tokens >= 1.0:
                b.tokens -= 1.0
                b.overage_streak = 0
                return True, 0.0, 0
            # Over budget — progressive cooldown.
            b.overage_streak += 1
            deficit = 1.0 - b.tokens
            cool = min(
                self.cooldown_max_s,
                self.cooldown_base_s * (1.0 + deficit + 0.5 * (b.overage_streak - 1)),
            )
            # Still spend a fractional token so refill recovers naturally.
            b.tokens = max(0.0, b.tokens - 0.25)
            if b.overage_streak >= self.cooldown_429_after:
                retry = int(max(1, round(cool * 2)))
                return False, cool, retry
            return True, cool, 0

    async def gate(self, client_id: str) -> tuple[bool, int]:
        """Await soft cooldown. Returns (ok, retry_after). ok=False → respond 429."""
        allowed, cool, retry = self.check(client_id)
        if cool > 0:
            await asyncio.sleep(cool)
        return allowed, retry


limiter = RateLimiter(
    rpm=float(settings.rate_limit_rpm),
    burst=float(settings.rate_limit_burst),
    cooldown_base_s=float(settings.cooldown_base_s),
    cooldown_max_s=float(settings.cooldown_max_s),
    cooldown_429_after=int(settings.cooldown_429_after),
)
