"""Zigbee device tasks — curated recipes + policies for any bound ieee."""

from __future__ import annotations

import json
import logging
import time
from typing import Any

from .event_log import record_grow_log
from .fleet_state import get_fleet_state, update_fleet_state
from .settings import get_setting, set_setting, upsert_inventory

_logger = logging.getLogger(__name__)

SETTING_POLICIES = "zigbee_device_policies"
SETTING_OWNED_OOS = "zigbee_policy_owned_oos"

# Curated recipes — add one at a time. Same path for every Zigbee device.
RECIPE_CATALOG: list[dict[str, Any]] = [
    {
        "id": "none",
        "label": "No task",
        "when": None,
        "clear_when": None,
        "default_params": {},
        "description": "Device is bound only — no actuator or banner actions.",
    },
    {
        "id": "tank_full_appliance",
        "label": "Liquid level → appliance OOS",
        "when": "active",
        "clear_when": "inactive",
        "default_params": {
            "seat_id": "dehumidifier",
            "problem_when": "active",
            "force_relay": "off",
            "banner": "Dehumidifier tank FULL - empty tank",
            "banner_tone": "critical",
        },
        "device_classes": ["liquid", "safety"],
        "suggested_roles": ["leak_tank", "leak_floor"],
        "param_schema": {
            "seat_id": {"type": "enum", "values": ["dehumidifier", "humidifier"]},
            "problem_when": {"type": "enum", "values": ["active", "inactive"]},
            "banner": {"type": "string"},
        },
        "description": "When leak/tank sensor hits problem polarity: OOS seat, force relay off, critical banner. Clear on opposite edge if this policy owns OOS.",
    },
    {
        "id": "floor_flood_alert",
        "label": "Floor flood → alert",
        "when": "active",
        "clear_when": "inactive",
        "default_params": {
            "problem_when": "active",
            "banner": "Floor water detected",
            "banner_tone": "critical",
        },
        "device_classes": ["liquid", "safety"],
        "suggested_roles": [
            "leak_floor_room",
            "leak_floor_4x8",
            "leak_floor_2x4",
            "leak_floor",
        ],
        "param_schema": {
            "problem_when": {"type": "enum", "values": ["active", "inactive"]},
            "banner": {"type": "string"},
        },
        "description": "When floor sensor hits problem polarity: critical banner + grow-log only. No appliance OOS. Clear on opposite edge.",
    },
]

_VALID_RECIPES = frozenset(str(r["id"]) for r in RECIPE_CATALOG)


def get_recipe_catalog() -> list[dict[str, Any]]:
    return list(RECIPE_CATALOG)


def banner_template(seat_id: str, problem_when: str) -> str:
    """Default banner text for SPA from appliance seat and problem polarity."""
    seat = str(seat_id or "").strip().lower()
    polarity = str(problem_when or "active").strip().lower()
    if seat == "humidifier":
        if polarity == "inactive":
            return "Humidifier EMPTY - refill"
        return "Humidifier tank FULL - empty tank"
    if polarity == "inactive":
        return "Dehumidifier tank EMPTY - refill"
    return "Dehumidifier tank FULL - empty tank"


def flood_banner_template(problem_when: str) -> str:
    polarity = str(problem_when or "active").strip().lower()
    if polarity == "inactive":
        return "Floor dry alarm — check sensor"
    return "Floor water detected"


def _recipe_by_id(recipe_id: str) -> dict[str, Any] | None:
    for row in RECIPE_CATALOG:
        if row["id"] == recipe_id:
            return row
    return None


def load_zigbee_policies() -> dict[str, dict[str, Any]]:
    raw = get_setting(SETTING_POLICIES, "")
    if not raw:
        return {}
    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        return {}
    if not isinstance(parsed, dict):
        return {}
    out: dict[str, dict[str, Any]] = {}
    for ieee, row in parsed.items():
        if not ieee or not isinstance(row, dict):
            continue
        recipe_id = str(row.get("recipe_id") or "none")
        if recipe_id not in _VALID_RECIPES:
            recipe_id = "none"
        params = row.get("params") if isinstance(row.get("params"), dict) else {}
        out[str(ieee)] = {
            "recipe_id": recipe_id,
            "enabled": bool(row.get("enabled", True)),
            "params": dict(params),
        }
    return out


def save_zigbee_policies(policies: dict[str, Any]) -> dict[str, dict[str, Any]]:
    cleaned: dict[str, dict[str, Any]] = {}
    if not isinstance(policies, dict):
        raise ValueError("policies must be an object")
    for ieee, row in policies.items():
        if not ieee or not isinstance(row, dict):
            continue
        recipe_id = str(row.get("recipe_id") or "none")
        if recipe_id not in _VALID_RECIPES:
            raise ValueError(f"unknown recipe_id {recipe_id}")
        recipe = _recipe_by_id(recipe_id) or {}
        defaults = dict(recipe.get("default_params") or {})
        params_in = row.get("params") if isinstance(row.get("params"), dict) else {}
        params = {**defaults, **dict(params_in)}
        cleaned[str(ieee)] = {
            "recipe_id": recipe_id,
            "enabled": bool(row.get("enabled", True)),
            "params": params,
        }
    set_setting(SETTING_POLICIES, json.dumps(cleaned))
    # Mirror onto fleet so Climate/Settings recipe_id is live without MQTT.
    try:
        fleet = get_fleet_state()
        fleet.system = dict(fleet.system)
        fleet.system["zigbee_device_policies"] = cleaned
        update_fleet_state(fleet)
    except Exception as exc:  # noqa: BLE001
        _logger.debug("fleet policy mirror skipped: %s", exc)
    return cleaned


def normalize_binary_active(payload: dict[str, Any]) -> bool | None:
    """Return True/False if payload has a binary wet/leak/contact signal; else None.

    Prefer explicit leak keys. ``occupancy`` is last: some tank/liquid sensors are
    fingerprinted as SNZB-03 and publish liquid presence on occupancy (true=wet).
    Only devices with a task recipe evaluate this — bare occupancy sensors stay inert.
    """
    for key in ("water_leak", "leak", "moisture", "contact", "tamper", "occupancy"):
        if key not in payload:
            continue
        val = payload.get(key)
        if isinstance(val, bool):
            # contact often true=closed; for leak sensors water_leak true=wet
            if key == "contact":
                return bool(val)  # treat closed/open as active when true — recipes that need invert use params later
            return val
        if isinstance(val, (int, float)):
            return bool(val)
        s = str(val).strip().lower()
        if s in ("on", "true", "1", "wet", "leak", "leaking", "yes"):
            return True
        if s in ("off", "false", "0", "dry", "no", "clear"):
            return False
    return None


def _load_owned_oos() -> dict[str, str]:
    """seat_id → ieee that owns the OOS."""
    raw = get_setting(SETTING_OWNED_OOS, "")
    if not raw:
        return {}
    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        return {}
    if not isinstance(parsed, dict):
        return {}
    return {str(k): str(v) for k, v in parsed.items() if k and v}


def _save_owned_oos(owned: dict[str, str]) -> None:
    set_setting(SETTING_OWNED_OOS, json.dumps(owned))


def _publish_banners(banners: list[dict[str, Any]]) -> None:
    fleet = get_fleet_state()
    fleet.system = dict(fleet.system)
    fleet.system["critical_banners"] = list(banners)
    fleet.system["zigbee_device_policies"] = load_zigbee_policies()
    update_fleet_state(fleet)


def _current_banners() -> list[dict[str, Any]]:
    fleet = get_fleet_state()
    raw = (fleet.system or {}).get("critical_banners")
    if isinstance(raw, list):
        return [b for b in raw if isinstance(b, dict)]
    return []


def _upsert_banner(banner_id: str, text: str, tone: str = "critical") -> None:
    banners = [b for b in _current_banners() if str(b.get("id")) != banner_id]
    banners.append(
        {
            "id": banner_id,
            "text": text,
            "tone": tone,
            "updated_at": time.time(),
            "source": "zigbee_policy",
        }
    )
    _publish_banners(banners)


def _clear_banner(banner_id: str) -> None:
    banners = [b for b in _current_banners() if str(b.get("id")) != banner_id]
    _publish_banners(banners)


def _force_relay(seat_id: str, on: bool) -> None:
    try:
        from .appliance_driver import force_set_sonoff_relay_sync

        force_set_sonoff_relay_sync(seat_id, on)
    except Exception as exc:  # noqa: BLE001
        _logger.warning("force_relay %s -> %s failed: %s", seat_id, on, exc)


def _apply_active(ieee: str, params: dict[str, Any]) -> None:
    seat = str(params.get("seat_id") or "").strip()
    banner = str(params.get("banner") or "").strip()
    tone = str(params.get("banner_tone") or "critical")
    force = str(params.get("force_relay") or "").strip().lower()
    banner_id = f"zb-policy-{ieee}"

    # Banner first — force_relay may block (asyncio.run on MQTT thread).
    if banner:
        _upsert_banner(banner_id, banner, tone)
        record_grow_log(f"zigbee task BANNER {banner}")

    if seat:
        upsert_inventory(seat, {"in_service": False})
        owned = _load_owned_oos()
        owned[seat] = ieee
        _save_owned_oos(owned)
        record_grow_log(f"zigbee task OOS seat={seat} ieee={ieee} reason=tank_full")

    if force == "off" and seat:
        _force_relay(seat, False)
    elif force == "on" and seat:
        _force_relay(seat, True)

def _apply_clear(ieee: str, params: dict[str, Any]) -> None:
    seat = str(params.get("seat_id") or "").strip()
    banner_id = f"zb-policy-{ieee}"
    _clear_banner(banner_id)

    if seat:
        owned = _load_owned_oos()
        if owned.get(seat) == ieee:
            upsert_inventory(seat, {"in_service": True})
            owned.pop(seat, None)
            _save_owned_oos(owned)
            record_grow_log(f"zigbee task RESTORE seat={seat} ieee={ieee} reason=tank_clear")
        else:
            record_grow_log(f"zigbee task CLEAR banner only seat={seat} ieee={ieee} (OOS not policy-owned)")


def evaluate_device_policies(
    *,
    ieee: str | None,
    friendly_name: str,
    payload: dict[str, Any],
) -> dict[str, Any] | None:
    """Evaluate curated recipe for this ieee. Returns summary or None if no-op."""
    if not ieee:
        # resolve ieee from bindings by friendly name
        from .zigbee_mqtt import load_zigbee_bindings

        for addr, row in load_zigbee_bindings().items():
            if str(row.get("friendly_name") or "") == friendly_name:
                ieee = addr
                break
    if not ieee:
        return None

    policies = load_zigbee_policies()
    pol = policies.get(str(ieee))
    if not pol or not pol.get("enabled"):
        return None
    recipe_id = str(pol.get("recipe_id") or "none")
    if recipe_id in ("", "none"):
        return None
    recipe = _recipe_by_id(recipe_id)
    if not recipe or not recipe.get("when"):
        return None

    active = normalize_binary_active(payload)
    if active is None:
        return None

    params = dict(recipe.get("default_params") or {})
    params.update(dict(pol.get("params") or {}))

    problem_when = str(params.get("problem_when") or "active").strip().lower()
    if problem_when not in ("active", "inactive"):
        problem_when = "active"
    problem = active if problem_when == "active" else (not active)

    # Track raw + problem on fleet for honesty
    fleet = get_fleet_state()
    fleet.system = dict(fleet.system)
    policy_state = dict(fleet.system.get("zigbee_policy_state") or {})
    prev = policy_state.get(str(ieee))
    if isinstance(prev, dict):
        if "problem" in prev:
            prev_problem = prev.get("problem")
        else:
            # Legacy: `active` stored the problem/wet edge, not raw signal.
            prev_problem = prev.get("active")
    else:
        prev_problem = None
    policy_state[str(ieee)] = {
        "recipe_id": recipe_id,
        "active": active,
        "problem": problem,
        "problem_when": problem_when,
        "friendly_name": friendly_name,
        "updated_at": time.time(),
    }
    fleet.system["zigbee_policy_state"] = policy_state
    fleet.system["zigbee_device_policies"] = policies
    update_fleet_state(fleet)

    if prev_problem is problem:
        return {
            "ieee": ieee,
            "recipe_id": recipe_id,
            "active": active,
            "problem": problem,
            "changed": False,
        }

    if problem:
        _apply_active(str(ieee), params)
        return {
            "ieee": ieee,
            "recipe_id": recipe_id,
            "active": active,
            "problem": True,
            "changed": True,
            "action": "active",
        }
    _apply_clear(str(ieee), params)
    return {
        "ieee": ieee,
        "recipe_id": recipe_id,
        "active": active,
        "problem": False,
        "changed": True,
        "action": "clear",
    }
