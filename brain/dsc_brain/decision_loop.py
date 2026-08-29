"""Decision tick: Want vs Got → Need + proposal (hub must clamp)."""

from __future__ import annotations

import time
import uuid
from typing import Any

from .hub_failover import (
    DEFAULT_TTL_SEC,
    HubOverride,
    evaluate_failover,
    get_override,
)
from .want import resolve_want

try:
    from .hub_native import emit_proposal_sync
except ImportError:  # pragma: no cover
    emit_proposal_sync = None  # type: ignore[assignment,misc]


def _status(value: float | None, band: list[float] | None) -> str:
    if value is None or not band:
        return "unknown"
    lo, hi = band
    if value < lo:
        return "low"
    if value > hi:
        return "high"
    return "ok"


def decision_tick(
    *,
    seat: str,
    strain_id: str | None,
    stage: str = "veg",
    got: dict[str, float | None] | None = None,
    custom_want: dict[str, Any] | None = None,
    manual_takeover: bool = False,
    emit: bool = False,
    hub_override: HubOverride | None = None,
    now: float | None = None,
    ttl_sec: float = DEFAULT_TTL_SEC,
    db_path=None,
) -> dict[str, Any]:
    """Compute a proposal. ``emit=True`` reserved for Phase D hub write path.

    While a reconnect temporary override is active, hold full re-assert until TTL
    or explicit clear of ``switch.dsc_hub_manual_takeover``; then force Want→act.
    """
    got = got or {}
    ts = time.time() if now is None else now
    override = hub_override if hub_override is not None else get_override()
    override, force_reassert = evaluate_failover(
        takeover=manual_takeover,
        now=ts,
        ttl_sec=ttl_sec,
        override=override,
    )

    resolved = resolve_want(
        strain_id=strain_id,
        stage=stage,
        custom=custom_want,
        db_path=db_path,
    )
    want = resolved["want"]
    need = {
        "temp_c": _status(got.get("temp_c"), want.get("temp_c")),
        "rh_pct": _status(got.get("rh_pct"), want.get("rh_pct")),
        "ph": _status(got.get("ph"), want.get("ph")),
        "ec_us": _status(got.get("ec_us"), want.get("ec_us")),
        "moisture_pct": _status(got.get("moisture_pct"), want.get("moisture_pct")),
    }

    advisories: list[str] = []
    commands: list[dict[str, Any]] = []
    for metric, status in need.items():
        if status == "low":
            advisories.append(f"{metric} below Want")
        elif status == "high":
            advisories.append(f"{metric} above Want")

    hold_for_override = override.active and not force_reassert
    do_emit = bool(emit or force_reassert) and not hold_for_override and not manual_takeover

    if manual_takeover and not force_reassert:
        advisories.append("Manual Takeover asserted — brain will not emit cmds")
    elif hold_for_override:
        advisories.append("Hub reconnect override active — holding re-assert until TTL/clear")
    elif do_emit:
        if force_reassert:
            advisories.append("Hub override cleared — forcing Want→act re-assert")
        proposal_cmds: list[dict[str, Any]] = []
        for metric, status in need.items():
            if status == "low":
                proposal_cmds.append({"type": "demand_on", "metric": f"{metric}_low"})
            elif status == "high":
                proposal_cmds.append({"type": "demand_on", "metric": f"{metric}_high"})
        if emit_proposal_sync and proposal_cmds:
            emit_results = emit_proposal_sync(proposal_cmds)
            commands.extend(emit_results)
        elif not proposal_cmds:
            commands.append({"type": "noop", "reason": "all metrics in band"})
        else:
            commands.append({"type": "noop", "reason": "hub emit unavailable"})

    return {
        "tick_id": str(uuid.uuid4()),
        "ts": ts,
        "seat": seat,
        "want_meta": {
            "source": resolved["source"],
            "stage": resolved["stage"],
            "strain_id": resolved["strain_id"],
        },
        "want": want,
        "got": got,
        "need": need,
        "commands": commands,
        "advisories": advisories,
        "safety": {
            "hub_must_clamp": True,
            "emit": do_emit,
            "manual_takeover": manual_takeover,
            "hub_override_active": override.active,
            "force_reassert": force_reassert,
        },
    }
