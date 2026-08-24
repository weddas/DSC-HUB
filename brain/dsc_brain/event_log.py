"""Grow log — Pi-native mirror of HA logbook.log on input_boolean.dsc_event_log."""

from __future__ import annotations

import time
from typing import Any

from .settings import connect

GROW_LOG_NAME = "Grow log"

_LAST_MSG: dict[str, float] = {}
_DEDUPE_SEC = 90.0


def record_grow_log(message: str, *, ts: float | None = None, dedupe: bool = True) -> None:
    msg = str(message).strip()
    if not msg:
        return
    now = ts or time.time()
    if dedupe:
        prev = _LAST_MSG.get(msg)
        if prev is not None and now - prev < _DEDUPE_SEC:
            return
        _LAST_MSG[msg] = now
    conn = connect()
    conn.execute(
        "INSERT INTO grow_event_log(message, ts) VALUES(?, ?)",
        (msg, now),
    )
    conn.commit()
    conn.close()


def list_grow_log(*, hours: float = 24.0, limit: int = 100) -> list[dict[str, Any]]:
    since = time.time() - hours * 3600.0
    conn = connect()
    rows = conn.execute(
        """
        SELECT id, message, ts FROM grow_event_log
        WHERE ts >= ?
        ORDER BY ts DESC
        LIMIT ?
        """,
        (since, limit),
    ).fetchall()
    conn.close()
    return [{"id": r["id"], "message": r["message"], "ts": r["ts"]} for r in rows]
