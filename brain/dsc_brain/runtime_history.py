"""Fleet history → runtime hours (memoized per computed build)."""

from __future__ import annotations

import datetime
import time
from typing import Any
from zoneinfo import ZoneInfo

from .settings import list_history

SYDNEY_TZ = ZoneInfo("Australia/Sydney")


def midnight_ts() -> float:
    now = datetime.datetime.now(SYDNEY_TZ)
    midnight = now.replace(hour=0, minute=0, second=0, microsecond=0)
    return midnight.timestamp()


class HistoryMemo:
    """Lazy per-build cache for fleet_history rows."""

    __slots__ = ("_rows",)

    def __init__(self) -> None:
        self._rows: dict[tuple[str, str, float], list[dict[str, Any]]] = {}

    def rows(self, seat_id: str, metric: str, since_ts: float) -> list[dict[str, Any]]:
        key = (seat_id, metric, since_ts)
        cached = self._rows.get(key)
        if cached is not None:
            return cached
        loaded = list_history(seat_id, metric, since_ts, limit=5000)
        self._rows[key] = loaded
        return loaded


class RuntimeMemo:
    """Lazy per-build cache for today's runtime integrals."""

    __slots__ = ("_hours", "history", "midnight_ts")

    def __init__(self, history: HistoryMemo | None = None, midnight: float | None = None) -> None:
        self.history = history or HistoryMemo()
        self.midnight_ts = midnight if midnight is not None else midnight_ts()
        self._hours: dict[tuple[str, str], float] = {}

    def hours_today(self, seat_id: str, metric: str) -> float:
        key = (seat_id, metric)
        cached = self._hours.get(key)
        if cached is not None:
            return cached
        hours = _integrate_runtime_hours(seat_id, metric, self.midnight_ts, self.history)
        self._hours[key] = hours
        return hours


def runtime_hours_today(
    seat_id: str,
    metric: str,
    *,
    midnight: float | None = None,
    memo: RuntimeMemo | None = None,
) -> float:
    if memo is not None:
        return memo.hours_today(seat_id, metric)
    history = HistoryMemo()
    return _integrate_runtime_hours(seat_id, metric, midnight or midnight_ts(), history)


def cycle_count_since(
    seat_id: str,
    metric: str,
    since_ts: float,
    *,
    history: HistoryMemo | None = None,
) -> int:
    rows = (history or HistoryMemo()).rows(seat_id, metric, since_ts)
    if not rows:
        return 0
    rows = sorted(rows, key=lambda r: r["ts"])
    count = 0
    prev = 0.0
    for row in rows:
        val = 1.0 if (row["value"] or 0.0) > 0.5 else 0.0
        if val > 0.5 and prev <= 0.5:
            count += 1
        prev = val
    return count


def _integrate_runtime_hours(
    seat_id: str,
    metric: str,
    since_ts: float,
    history: HistoryMemo,
) -> float:
    rows = history.rows(seat_id, metric, since_ts)
    if not rows:
        return 0.0
    rows = sorted(rows, key=lambda r: r["ts"])
    if len(rows) == 1:
        if rows[0]["value"] or 0.0:
            return round((rows[0]["value"] or 0.0) * (time.time() - rows[0]["ts"]) / 3600.0, 2)
        return 0.0
    total_sec = 0.0
    for i in range(len(rows) - 1):
        v = rows[i]["value"] or 0.0
        if v > 0.5:
            total_sec += max(0.0, rows[i + 1]["ts"] - rows[i]["ts"])
    last = rows[-1]
    if (last["value"] or 0.0) > 0.5:
        total_sec += max(0.0, time.time() - last["ts"])
    return round(total_sec / 3600.0, 2)
