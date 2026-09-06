"""Operator automation rules — a flat trigger → action list.

v1 is deliberately narrow and safe:

* **Triggers** read one HA-shaped fleet entity and compare it (numeric or
  string / boolean).
* **Actions** are limited to the two effects that are already safe operator
  moves — raise a UI banner, and take an inventory seat out of service. No
  relay switching, no setpoint writes.
* Every rule is **disabled by default**.
* Edge-triggered with owned-state tracking, so a rule only ever clears the
  banner / OOS it set itself.
* **Fails closed**: a missing target entity, an offline hub, or a non-numeric
  value for a numeric comparison is treated as "not firing" (and clears any
  effect this rule owned).

This is the operator-facing generalisation of the Zigbee recipe engine
(`zigbee_policies.evaluate_device_policies`) — same effect vocabulary, any fleet
condition as the trigger.
"""

from __future__ import annotations

import json
import logging
import re
import time
from typing import Any

from .fleet_state import FleetState, get_fleet_state, update_fleet_state
from .settings import get_setting, list_inventory, set_setting, upsert_inventory

_logger = logging.getLogger(__name__)

SETTING_RULES = "automation_rules"
SETTING_STATE = "automation_rules_state"

_RULE_ID_RE = re.compile(r"^[a-z][a-z0-9_]{1,47}$")
_NUMERIC_OPS = frozenset({"gt", "lt", "gte", "lte"})
_STRING_OPS = frozenset({"eq", "ne"})
_BOOL_OPS = frozenset({"is", "is_not"})
VALID_OPS = _NUMERIC_OPS | _STRING_OPS | _BOOL_OPS
VALID_ACTIONS = frozenset({"banner", "oos_seat", "zigbee_switch"})
VALID_TONES = frozenset({"critical", "warn", "info"})

_TRUEISH = frozenset({"on", "true", "1", "yes", "open", "wet"})
_FALSEISH = frozenset({"off", "false", "0", "no", "closed", "dry"})


# --------------------------------------------------------------------------- IO


def load_automation_rules() -> list[dict[str, Any]]:
    raw = get_setting(SETTING_RULES, "")
    if not raw:
        return []
    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        return []
    if not isinstance(parsed, list):
        return []
    out: list[dict[str, Any]] = []
    for row in parsed:
        try:
            out.append(_normalize_rule(row))
        except ValueError:
            continue
    return out


def _normalize_rule(row: Any) -> dict[str, Any]:
    if not isinstance(row, dict):
        raise ValueError("rule must be an object")
    rid = str(row.get("id") or "").strip().lower()
    if not _RULE_ID_RE.match(rid):
        raise ValueError(f"invalid rule id {rid!r} — slug, lowercase, 2–48 chars")

    trig = row.get("trigger") or {}
    if not isinstance(trig, dict):
        raise ValueError("trigger must be an object")
    entity_id = str(trig.get("entity_id") or "").strip()
    if not entity_id or "." not in entity_id:
        raise ValueError("trigger.entity_id must be a domain.object id")
    op = str(trig.get("op") or "").strip().lower()
    if op not in VALID_OPS:
        raise ValueError(f"invalid trigger.op {op!r}")
    value = trig.get("value")
    if op in _NUMERIC_OPS:
        try:
            value = float(value)  # type: ignore[arg-type]
        except (TypeError, ValueError) as exc:
            raise ValueError(f"trigger.value must be numeric for op {op}") from exc
    elif op in _BOOL_OPS:
        value = _coerce_bool(value)
        if value is None:
            raise ValueError("trigger.value must be boolean-ish for is/is_not")
    else:
        value = str(value if value is not None else "")

    action = row.get("action") or {}
    if not isinstance(action, dict):
        raise ValueError("action must be an object")
    atype = str(action.get("type") or "").strip().lower()
    if atype not in VALID_ACTIONS:
        raise ValueError(f"invalid action.type {atype!r}")
    params = action.get("params") if isinstance(action.get("params"), dict) else {}
    clean_params: dict[str, Any] = {}
    if atype == "banner":
        text = str(params.get("text") or "").strip()
        if not text:
            raise ValueError("banner action needs params.text")
        tone = str(params.get("tone") or "warn").strip().lower()
        clean_params = {"text": text, "tone": tone if tone in VALID_TONES else "warn"}
    elif atype == "oos_seat":
        seat = str(params.get("seat_id") or "").strip()
        if not seat:
            raise ValueError("oos_seat action needs params.seat_id")
        clean_params = {"seat_id": seat}
        banner = str(params.get("banner") or "").strip()
        if banner:
            clean_params["banner"] = banner
    elif atype == "zigbee_switch":
        fn = str(params.get("friendly_name") or "").strip()
        if not fn:
            raise ValueError("zigbee_switch action needs params.friendly_name")
        clean_params = {
            "friendly_name": fn,
            # ON while the trigger holds, OFF when it clears (invert to flip).
            "on_when_firing": bool(params.get("on_when_firing", True)),
        }

    return {
        "id": rid,
        "name": str(row.get("name") or rid).strip()[:80] or rid,
        "enabled": bool(row.get("enabled", False)),
        "trigger": {"entity_id": entity_id, "op": op, "value": value},
        "action": {"type": atype, "params": clean_params},
    }


def save_automation_rules(rules: Any) -> list[dict[str, Any]]:
    if not isinstance(rules, list):
        raise ValueError("rules must be a list")
    cleaned: list[dict[str, Any]] = []
    seen: set[str] = set()
    for row in rules:
        rule = _normalize_rule(row)
        if rule["id"] in seen:
            raise ValueError(f"duplicate rule id: {rule['id']}")
        seen.add(rule["id"])
        cleaned.append(rule)
    set_setting(SETTING_RULES, json.dumps(cleaned))
    # Drop owned-state for rules that no longer exist (clear their effects first).
    state = _load_state()
    stale = [rid for rid in state if rid not in seen]
    if stale:
        fleet = get_fleet_state()
        for rid in stale:
            _clear_effect(rid, state[rid], fleet)
            state.pop(rid, None)
        update_fleet_state(fleet)
        _save_state(state)
    return cleaned


def _load_state() -> dict[str, dict[str, Any]]:
    raw = get_setting(SETTING_STATE, "")
    if not raw:
        return {}
    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        return {}
    return parsed if isinstance(parsed, dict) else {}


def _save_state(state: dict[str, dict[str, Any]]) -> None:
    set_setting(SETTING_STATE, json.dumps(state))


# ---------------------------------------------------------------------- helpers


def _coerce_bool(value: Any) -> bool | None:
    if isinstance(value, bool):
        return value
    if isinstance(value, (int, float)):
        return bool(value)
    s = str(value).strip().lower()
    if s in _TRUEISH:
        return True
    if s in _FALSEISH:
        return False
    return None


def _entity_state(states: dict[str, dict[str, Any]], entity_id: str) -> str | None:
    ent = states.get(entity_id)
    if not isinstance(ent, dict):
        return None
    st = ent.get("state")
    if st is None:
        return None
    s = str(st).strip()
    if s.lower() in ("", "unavailable", "unknown", "none"):
        return None
    return s


def _trigger_fires(
    trigger: dict[str, Any],
    states: dict[str, dict[str, Any]],
    hub_online: bool,
) -> bool:
    """True only when the condition is met with usable evidence. Fails closed."""
    if not hub_online:
        return False
    raw = _entity_state(states, str(trigger["entity_id"]))
    if raw is None:
        return False
    op = trigger["op"]
    if op in _NUMERIC_OPS:
        try:
            cur = float(raw)
        except ValueError:
            return False
        target = float(trigger["value"])
        if op == "gt":
            return cur > target
        if op == "lt":
            return cur < target
        if op == "gte":
            return cur >= target
        return cur <= target
    if op in _BOOL_OPS:
        cur_b = _coerce_bool(raw)
        if cur_b is None:
            return False
        want = bool(trigger["value"])
        return cur_b == want if op == "is" else cur_b != want
    # string
    want_s = str(trigger["value"])
    return raw == want_s if op == "eq" else raw != want_s


# ----------------------------------------------------------------------- effects


def _publish_banners(fleet: FleetState, banners: list[dict[str, Any]]) -> None:
    fleet.system = dict(fleet.system)
    fleet.system["critical_banners"] = list(banners)


def _current_banners(fleet: FleetState) -> list[dict[str, Any]]:
    raw = (fleet.system or {}).get("critical_banners")
    return [b for b in raw if isinstance(b, dict)] if isinstance(raw, list) else []


def _set_banner(fleet: FleetState, banner_id: str, text: str, tone: str) -> None:
    banners = [b for b in _current_banners(fleet) if str(b.get("id")) != banner_id]
    banners.append(
        {
            "id": banner_id,
            "text": text,
            "tone": tone,
            "updated_at": time.time(),
            "source": "automation_rule",
        }
    )
    _publish_banners(fleet, banners)


def _drop_banner(fleet: FleetState, banner_id: str) -> None:
    _publish_banners(fleet, [b for b in _current_banners(fleet) if str(b.get("id")) != banner_id])


def _apply_effect(rule: dict[str, Any], fleet: FleetState) -> dict[str, Any]:
    rid = rule["id"]
    action = rule["action"]
    params = action["params"]
    owned: dict[str, Any] = {
        "firing": True,
        "owned_banner": None,
        "owned_seat": None,
        "owned_switch": None,
    }
    banner_id = f"auto-{rid}"
    if action["type"] == "banner":
        _set_banner(fleet, banner_id, params["text"], params["tone"])
        owned["owned_banner"] = banner_id
    elif action["type"] == "oos_seat":
        seat = params["seat_id"]
        upsert_inventory(seat, {"in_service": False})
        owned["owned_seat"] = seat
        text = params.get("banner") or f"{rule['name']}: {seat} taken out of service by a rule"
        _set_banner(fleet, banner_id, text, "warn")
        owned["owned_banner"] = banner_id
    elif action["type"] == "zigbee_switch":
        fn = params["friendly_name"]
        on = bool(params.get("on_when_firing", True))
        try:
            from .zigbee_mqtt import set_zigbee_state

            set_zigbee_state(fn, on)
        except Exception as exc:  # noqa: BLE001
            _logger.warning("automation zigbee_switch %s -> %s failed: %s", fn, on, exc)
        owned["owned_switch"] = {"friendly_name": fn, "on_when_firing": on}
    return owned


def _clear_effect(rid: str, owned: dict[str, Any], fleet: FleetState) -> None:
    if owned.get("owned_banner"):
        _drop_banner(fleet, str(owned["owned_banner"]))
    seat = owned.get("owned_seat")
    if seat:
        upsert_inventory(str(seat), {"in_service": True})
    sw = owned.get("owned_switch")
    if isinstance(sw, dict) and sw.get("friendly_name"):
        try:
            from .zigbee_mqtt import set_zigbee_state

            set_zigbee_state(str(sw["friendly_name"]), not bool(sw.get("on_when_firing", True)))
        except Exception as exc:  # noqa: BLE001
            _logger.warning("automation zigbee_switch clear failed: %s", exc)


# ------------------------------------------------------------------- evaluate


def evaluate_automation_rules(
    fleet: FleetState | None = None,
    inventory: list[dict[str, Any]] | None = None,
) -> dict[str, Any]:
    """Run every enabled rule against the current fleet. Edge-triggered.

    Safe to call on every fleet broadcast — it only writes when a rule crosses
    an edge. Returns a per-rule summary for the settings UI.
    """
    fleet = fleet or get_fleet_state()
    inv = inventory if inventory is not None else list_inventory()
    states = fleet.to_hass_states(inv)
    hub_online = bool(fleet.hub and fleet.hub.online)

    rules = load_automation_rules()
    state = _load_state()
    changed = False
    summary: list[dict[str, Any]] = []

    for rule in rules:
        rid = rule["id"]
        prev = state.get(rid) or {}
        was_firing = bool(prev.get("firing"))
        fires = rule["enabled"] and _trigger_fires(rule["trigger"], states, hub_online)

        if fires and not was_firing:
            state[rid] = _apply_effect(rule, fleet)
            changed = True
        elif not fires and was_firing:
            _clear_effect(rid, prev, fleet)
            state.pop(rid, None)
            changed = True

        summary.append(
            {
                "id": rid,
                "name": rule["name"],
                "enabled": rule["enabled"],
                "firing": bool(state.get(rid, {}).get("firing")),
                "trigger": rule["trigger"],
                "action": rule["action"],
            }
        )

    if changed:
        update_fleet_state(fleet)
        _save_state(state)

    return {"rules": summary, "hub_online": hub_online}


def automation_rules_summary() -> dict[str, Any]:
    """Read-only view for the settings GET — rules + which are firing now."""
    state = _load_state()
    rules = load_automation_rules()
    return {
        "rules": [
            {
                **rule,
                "firing": bool(state.get(rule["id"], {}).get("firing")),
            }
            for rule in rules
        ]
    }
