"""Hub reconnect failover: temporary override + re-assert TTL."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

DEFAULT_TTL_SEC = 900.0
OVERRIDE_ENTITY_ID = "binary_sensor.dsc_brain_hub_override_active"


@dataclass
class HubOverride:
    active: bool
    forced: dict[str, str] = field(default_factory=dict)
    since_ts: float = 0.0


_current: HubOverride = HubOverride(active=False, forced={}, since_ts=0.0)


def get_override() -> HubOverride:
    return _current


def reset_override() -> None:
    """Test helper — clear module override state."""
    global _current
    _current = HubOverride(active=False, forced={}, since_ts=0.0)


def note_reconnect(snapshot: dict, takeover: bool, now: float) -> HubOverride:
    """Record reconnect ingest. Takeover → temporary override; else no override."""
    global _current
    if not takeover:
        _current = HubOverride(active=False, forced={}, since_ts=now)
        return _current
    forced = {str(k): str(v) for k, v in (snapshot or {}).items()}
    _current = HubOverride(active=True, forced=forced, since_ts=now)
    return _current


def should_reassert(override: HubOverride, now: float, *, ttl_sec: float = DEFAULT_TTL_SEC) -> bool:
    """True when an active override has exceeded TTL and must re-assert Want→act."""
    if not override.active:
        return False
    return (now - override.since_ts) >= ttl_sec


def clear_override(*, now: float | None = None) -> HubOverride:
    """Clear temporary override (TTL expiry or explicit takeover clear)."""
    global _current
    ts = now if now is not None else _current.since_ts
    _current = HubOverride(active=False, forced={}, since_ts=ts)
    return _current


def note_takeover_cleared(now: float) -> HubOverride:
    """Explicit clear of switch.dsc_hub_manual_takeover → drop override + re-assert."""
    if not _current.active:
        return _current
    return clear_override(now=now)


def on_hub_reconnect(
    *,
    was_online: bool,
    is_online: bool,
    snapshot: dict,
    takeover: bool,
    now: float,
) -> HubOverride | None:
    """Fire note_reconnect only on offline→online transition."""
    if was_online or not is_online:
        return None
    return note_reconnect(snapshot, takeover, now)


def evaluate_failover(
    *,
    takeover: bool,
    now: float,
    ttl_sec: float = DEFAULT_TTL_SEC,
    override: HubOverride | None = None,
) -> tuple[HubOverride, bool]:
    """
    Advance failover policy.

    Returns (override, force_reassert).
    force_reassert when TTL expired or takeover cleared while override was active;
    both paths clear the temporary override.
    """
    o = override if override is not None else _current
    if not o.active:
        return o, False

    if not takeover:
        cleared = clear_override(now=now)
        return cleared, True

    if should_reassert(o, now, ttl_sec=ttl_sec):
        cleared = clear_override(now=now)
        return cleared, True

    return o, False


def emit_override_entity(states: dict[str, Any], override: HubOverride, set_entity: Any) -> None:
    """Emit binary_sensor.dsc_brain_hub_override_active for SPA."""
    set_entity(
        states,
        OVERRIDE_ENTITY_ID,
        "on" if override.active else "off",
        available=True,
        attributes={
            "since_ts": override.since_ts,
            "forced": dict(override.forced),
            "ttl_sec": DEFAULT_TTL_SEC,
        },
    )


def snapshot_from_hub_values(values: dict[str, Any] | None) -> dict[str, str]:
    """Flatten hub controls / lights into a forced-state snapshot for override."""
    if not values:
        return {}
    out: dict[str, str] = {}
    controls = values.get("controls") or {}
    for eid, ctrl in controls.items():
        if not isinstance(ctrl, dict):
            continue
        st = ctrl.get("state")
        if st is None:
            continue
        # Prefer short keys for known actuators; keep entity id otherwise.
        if eid == "light.dsc_hub_sf1000_dimmer":
            out["sf1000"] = str(st)
        elif eid.startswith("switch.dsc_hub_") and eid.endswith("_demand"):
            short = eid.removeprefix("switch.dsc_hub_").removesuffix("_demand")
            out[short] = str(st)
        else:
            out[eid] = str(st)
    if "sf1000_on" in values and "sf1000" not in out:
        out["sf1000"] = "on" if values.get("sf1000_on") else "off"
    return out
