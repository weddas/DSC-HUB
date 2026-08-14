"""Process-lifetime traffic counters for HA tiles."""

from __future__ import annotations

import threading
import time
from dataclasses import dataclass, field


@dataclass
class Metrics:
    started_at: float = field(default_factory=time.time)
    hits_total: int = 0
    hits_blocked_bot: int = 0
    hits_rate_limited: int = 0
    hits_unauthorized: int = 0
    bytes_in: int = 0
    bytes_out: int = 0
    search_total: int = 0
    hydrate_total: int = 0
    _lock: threading.Lock = field(default_factory=threading.Lock, repr=False)

    def record_request(
        self,
        *,
        bytes_in: int = 0,
        bytes_out: int = 0,
        blocked_bot: bool = False,
        rate_limited: bool = False,
        unauthorized: bool = False,
        search: bool = False,
        hydrate: bool = False,
    ) -> None:
        with self._lock:
            self.hits_total += 1
            self.bytes_in += max(0, int(bytes_in))
            self.bytes_out += max(0, int(bytes_out))
            if blocked_bot:
                self.hits_blocked_bot += 1
            if rate_limited:
                self.hits_rate_limited += 1
            if unauthorized:
                self.hits_unauthorized += 1
            if search:
                self.search_total += 1
            if hydrate:
                self.hydrate_total += 1

    def snapshot(self) -> dict:
        with self._lock:
            uptime = max(0.0, time.time() - self.started_at)
            return {
                "uptime_s": round(uptime, 1),
                "hits_total": self.hits_total,
                "hits_blocked_bot": self.hits_blocked_bot,
                "hits_rate_limited": self.hits_rate_limited,
                "hits_unauthorized": self.hits_unauthorized,
                "bytes_in": self.bytes_in,
                "bytes_out": self.bytes_out,
                "search_total": self.search_total,
                "hydrate_total": self.hydrate_total,
                "bytes_in_mb": round(self.bytes_in / 1e6, 3),
                "bytes_out_mb": round(self.bytes_out / 1e6, 3),
            }


metrics = Metrics()
