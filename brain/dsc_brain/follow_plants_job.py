"""Periodic Follow Plants refresh (~12h) + on-demand hook."""

from __future__ import annotations

import asyncio
import logging
import time
from typing import Any

_logger = logging.getLogger(__name__)

FOLLOW_PLANTS_INTERVAL_SEC = 12 * 3600
_task: asyncio.Task[None] | None = None
_last_run_monotonic: float = 0.0


async def tick_follow_plants(*, force: bool = False) -> dict[str, Any]:
    global _last_run_monotonic
    from .follow_plants import apply_follow_plants

    result = await apply_follow_plants(force=force)
    _last_run_monotonic = time.monotonic()
    if result.get("applied"):
        _logger.info("Follow Plants applied: %s", result.get("stages"))
    elif result.get("reason"):
        _logger.debug("Follow Plants skip: %s", result.get("reason"))
    return result


async def _loop() -> None:
    await asyncio.sleep(30.0)  # boot settle
    while True:
        try:
            await tick_follow_plants(force=False)
        except Exception:  # noqa: BLE001
            _logger.exception("Follow Plants tick failed")
        await asyncio.sleep(FOLLOW_PLANTS_INTERVAL_SEC)


def start_follow_plants_job() -> None:
    global _task
    if _task and not _task.done():
        return
    _task = asyncio.create_task(_loop(), name="dsc-follow-plants")


async def stop_follow_plants_job() -> None:
    global _task
    if _task and not _task.done():
        _task.cancel()
        try:
            await _task
        except asyncio.CancelledError:
            pass
    _task = None


def last_follow_plants_age_sec() -> float | None:
    if _last_run_monotonic <= 0:
        return None
    return time.monotonic() - _last_run_monotonic
