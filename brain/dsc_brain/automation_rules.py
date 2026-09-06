"""Operator automation rules — trigger group → action, edge-triggered, fail-closed.

v2 keeps the v1 contract and widens it carefully:

* **Triggers** are a group ``{all: [cond, ...]}`` / ``{any: [cond, ...]}`` of
  conditions. A v1 flat ``trigger`` object loads unchanged as a one-condition
  ``all`` group. Each condition reads one HA-shaped entity from a merged,
  read-only view of raw fleet states *plus* the SPA's computed entities
  (CFM, VPD, alert counts — ``computed_ops.build_computed_hass_states``).
* Per-rule **time window** (local time, wraps past midnight), **debounce**
  (condition must hold ``debounce_s`` before firing) and **release**
  (must be clear ``release_s`` before clearing). Per-condition **hysteresis**
  (numeric ops latch until the value crosses back by the margin) and
  **max_age_s** (a reading older than its device's last-seen horizon is
  treated as unusable — fail closed; values with no timestamp can never pass).
* **Actions** add ``relay`` and ``setpoint`` on top of banner / oos_seat /
  zigbee_switch. Both go through ``control_ops.call_service_proxy`` (demo
  mode, key caches) and are restricted to explicit allow-lists — see
  ``RELAY_TARGETS`` / ``SETPOINT_TARGETS`` for the safety boundary and why.
  Both capture the previous state at fire time and restore it on clear.
* Every rule is **disabled by default**, edge-triggered with owned-state
  tracking (a rule only clears what it set), and **fails closed**: hub offline,
  missing entity, non-numeric value, stale reading → that condition is false.
  Actuator write failures are logged and never raise out of the evaluator.
"""

from __future__ import annotations

import asyncio
import json
import logging
import re
import time
from datetime import datetime
from typing import Any, Callable

from .fleet_state import FleetState, get_fleet_state, update_fleet_state
from .settings import get_setting, list_inventory, set_setting, upsert_inventory

_logger = logging.getLogger(__name__)

SETTING_RULES = "automation_rules"
SETTING_STATE = "automation_rules_state"

_RULE_ID_RE = re.compile(r"^[a-z][a-z0-9_]{1,47}$")
_HHMM_RE = re.compile(r"^([01]\d|2[0-3]):([0-5]\d)$")
_NUMERIC_OPS = frozenset({"gt", "lt", "gte", "lte"})
_STRING_OPS = frozenset({"eq", "ne"})
_BOOL_OPS = frozenset({"is", "is_not"})
VALID_OPS = _NUMERIC_OPS | _STRING_OPS | _BOOL_OPS
VALID_ACTIONS = frozenset({"banner", "oos_seat", "zigbee_switch", "relay", "setpoint"})
VALID_TONES = frozenset({"critical", "warn", "info"})
MAX_CONDITIONS = 8

_TRUEISH = frozenset({"on", "true", "1", "yes", "open", "wet"})
_FALSEISH = frozenset({"off", "false", "0", "no", "closed", "dry"})

# Injectable clock (tests). ``_now`` is epoch seconds; ``_local_hm`` maps an
# epoch to local (hour, minute) — the Pi runs in the grow's local timezone.
_now: Callable[[], float] = time.time


def _local_hm(now: float) -> tuple[int, int]:
    dt = datetime.fromtimestamp(now)
    return dt.hour, dt.minute


# ------------------------------------------------------------ safety boundary
#
# The Pi brain decision loop (decision_loop → hub_native.HUB_EMIT_MAP) and the
# hub firmware ladder own every ``switch.dsc_hub_*_demand`` output, and
# ``appliance_driver`` mirrors those demands onto the Sonoff ``main_relay``
# every 2 s (with a commanded-state cache and a stale-hub failsafe OFF). A rule
# that wrote any of those directly would fight the loop — or, worse, hold a
# heater ON where the failsafe no longer looks. So:
#
#   * Hub switches are allowed only when nothing in the brain asserts them:
#     operator holds / takeover / routing preferences. Mode switches that
#     change *who owns* the outputs (tent_full_auto_mode, auto_photoperiod)
#     stay operator-only — too much blast radius for an automation.
#   * Sonoff appliance relays are allowed as **cut-out only**
#     (``on_when_firing`` must be false): the rule turns the relay OFF via the
#     control proxy and takes the seat out of service so the appliance driver
#     stops mirroring hub demand onto it (the same pattern the Zigbee
#     tank-full task uses). On clear the seat is restored and the driver
#     re-asserts the relay from live hub demand. Turning a Sonoff relay ON
#     from a rule is rejected at save time.
RELAY_TARGETS: dict[str, dict[str, Any]] = {
    "switch.dsc_hub_manual_takeover": {
        "kind": "hub",
        "label": "Hub manual takeover",
        "cutout_only": False,
        "why": "Operator-owned takeover flag; the brain reads it and never writes it.",
    },
    "switch.dsc_hub_tent_manual_override": {
        "kind": "hub",
        "label": "4x8 manual override",
        "cutout_only": False,
        "why": "Operator-owned tent override; not in HUB_EMIT_MAP or the hub ladder.",
    },
    "switch.dsc_hub_manual_light_hold": {
        "kind": "hub",
        "label": "Manual light hold",
        "cutout_only": False,
        "why": "LIGHT-only schedule hold; operator clear path, no loop writer.",
    },
    "switch.dsc_hub_humidifier_intake_routing": {
        "kind": "hub",
        "label": "Humidifier intake routing",
        "cutout_only": False,
        "why": "Air-path routing preference; nothing in the brain asserts it.",
    },
    "switch.dsc_hub_recirc_de_strat_pulse": {
        "kind": "hub",
        "label": "Recirc de-strat pulse",
        "cutout_only": False,
        "why": "De-strat pulse enable; operator preference, no loop writer.",
    },
    "switch.dsc_heater_main_relay": {
        "kind": "sonoff",
        "seat_id": "heater",
        "label": "Heater relay (cut-out)",
        "cutout_only": True,
        "why": "Loop-driven via appliance_driver; rules may only hold it OFF (seat OOS while firing).",
    },
    "switch.dsc_heatmat_main_relay": {
        "kind": "sonoff",
        "seat_id": "heatmat",
        "label": "Heat mat relay (cut-out)",
        "cutout_only": True,
        "why": "Loop-driven via appliance_driver; rules may only hold it OFF (seat OOS while firing).",
    },
    "switch.dsc_humidifier_main_relay": {
        "kind": "sonoff",
        "seat_id": "humidifier",
        "label": "Humidifier relay (cut-out)",
        "cutout_only": True,
        "why": "Loop-driven via appliance_driver; rules may only hold it OFF (seat OOS while firing).",
    },
    "switch.dsc_de_humidifier_main_relay": {
        "kind": "sonoff",
        "seat_id": "dehumidifier",
        "label": "Dehumidifier relay (cut-out)",
        "cutout_only": True,
        "why": "Loop-driven via appliance_driver; rules may only hold it OFF (seat OOS while firing).",
    },
}

# Setpoint targets = HUB_NUMBER_ENTITY_TO_OID numbers the control proxy already
# routes, with the ESP clamps from firmware/v4/dsc-hub-v4_0.yaml (num_* min/max/
# step). The hub firmware clamps again on its side; we clamp before writing so
# the stored rule and the write agree. ``clone_*`` numbers are Pi-owned while
# the 2×4 Climate Mode is Follow Plants (follow_plants.py rewrites them ~12h and
# on roster change) — a rule write is skipped, not fought, while that holds.
SETPOINT_TARGETS: dict[str, dict[str, Any]] = {
    "number.dsc_hub_target_temp": {"label": "4x8 target temp", "min": 15.0, "max": 32.0, "step": 0.5, "unit": "°C"},
    "number.dsc_hub_rh_target_min": {"label": "4x8 RH min", "min": 20.0, "max": 90.0, "step": 1.0, "unit": "%"},
    "number.dsc_hub_rh_target_max": {"label": "4x8 RH max", "min": 20.0, "max": 95.0, "step": 1.0, "unit": "%"},
    "number.dsc_hub_vpd_target_min": {"label": "4x8 VPD min", "min": 0.4, "max": 1.6, "step": 0.1, "unit": "kPa"},
    "number.dsc_hub_vpd_target_max": {"label": "4x8 VPD max", "min": 0.4, "max": 1.8, "step": 0.1, "unit": "kPa"},
    "number.dsc_hub_clone_target_temp": {
        "label": "2x4 target temp", "min": 15.0, "max": 32.0, "step": 0.5, "unit": "°C", "pi_owned_when": "follow_plants",
    },
    "number.dsc_hub_clone_rh_min": {
        "label": "2x4 RH min", "min": 20.0, "max": 90.0, "step": 1.0, "unit": "%", "pi_owned_when": "follow_plants",
    },
    "number.dsc_hub_clone_rh_max": {
        "label": "2x4 RH max", "min": 20.0, "max": 95.0, "step": 1.0, "unit": "%", "pi_owned_when": "follow_plants",
    },
    "number.dsc_hub_clone_vpd_min": {
        "label": "2x4 VPD min", "min": 0.2, "max": 1.6, "step": 0.1, "unit": "kPa", "pi_owned_when": "follow_plants",
    },
    "number.dsc_hub_clone_vpd_max": {
        "label": "2x4 VPD max", "min": 0.2, "max": 1.8, "step": 0.1, "unit": "kPa", "pi_owned_when": "follow_plants",
    },
    "number.dsc_hub_mat_root_zone_low": {"label": "Mat root-zone low", "min": 12.0, "max": 26.0, "step": 0.5, "unit": "°C"},
    "number.dsc_hub_mat_root_zone_high": {"label": "Mat root-zone high", "min": 14.0, "max": 28.0, "step": 0.5, "unit": "°C"},
    "number.dsc_hub_clone_light_hours": {
        "label": "2x4 light hours", "min": 0.0, "max": 24.0, "step": 1.0, "unit": "h", "pi_owned_when": "follow_plants",
    },
}

# Sonoff relay entity → fleet seat (mirrors control_ops._SONOFF_RELAY_ENTITY_TO_SEAT).
_SONOFF_RELAY_SEAT: dict[str, str] = {
    eid: str(meta["seat_id"]) for eid, meta in RELAY_TARGETS.items() if meta.get("kind") == "sonoff"
}

# Entity-id prefixes whose readings carry a device last-seen timestamp
# (``max_age_s`` is satisfiable). Anything else — computed entities, canopy,
# helpers — has no timestamp and a ``max_age_s`` condition can never pass.
_HUB_AGE_PREFIXES = (
    "sensor.dsc_hub_",
    "binary_sensor.dsc_hub_",
    "switch.dsc_hub_",
    "number.dsc_hub_",
    "select.dsc_hub_",
    "fan.dsc_hub_",
    "light.dsc_hub_",
    "time.dsc_hub_",
)
_PROBE_AGE_RE = re.compile(r"^(?:sensor|binary_sensor)\.dsc_probe([1-4])_")
# Any datapoint of a bound Zigbee device: sensor./binary_sensor.dsc_zigbee_<role>_<key>.
_ZIGBEE_AGE_RE = re.compile(r"^(?:sensor|binary_sensor)\.dsc_zigbee_(.+)$")
AGE_PREFIXES: list[str] = [
    *_HUB_AGE_PREFIXES,
    "sensor.dsc_probe",
    "binary_sensor.dsc_probe",
    "sensor.dsc_zigbee_",
    "binary_sensor.dsc_zigbee_",
    *_SONOFF_RELAY_SEAT.keys(),
]


def timestamp_source(entity_id: str) -> str | None:
    """Which device timestamp backs this entity, or None (max_age_s unsatisfiable)."""
    if entity_id.startswith(_HUB_AGE_PREFIXES):
        return "hub"
    if _PROBE_AGE_RE.match(entity_id):
        return "probe"
    if entity_id in _SONOFF_RELAY_SEAT:
        return "sonoff"
    if _ZIGBEE_AGE_RE.match(entity_id):
        return "zigbee"
    return None


def automation_targets() -> dict[str, Any]:
    """Allow-listed relay / setpoint targets for the settings UI (never hardcoded in the SPA)."""
    return {
        "relays": [
            {
                "entity_id": eid,
                "label": meta["label"],
                "kind": meta["kind"],
                "cutout_only": bool(meta.get("cutout_only")),
                "why": meta["why"],
            }
            for eid, meta in RELAY_TARGETS.items()
        ],
        "setpoints": [
            {
                "entity_id": eid,
                "label": meta["label"],
                "min": meta["min"],
                "max": meta["max"],
                "step": meta["step"],
                "unit": meta["unit"],
                "pi_owned_when": meta.get("pi_owned_when"),
            }
            for eid, meta in SETPOINT_TARGETS.items()
        ],
        "age_prefixes": list(AGE_PREFIXES),
        "entities": live_zigbee_entities(),
    }


def live_zigbee_entities() -> list[dict[str, Any]]:
    """Entities currently exported for bound Zigbee devices - trigger suggestions for the SPA."""
    try:
        states = get_fleet_state().to_hass_states(list_inventory())
    except Exception:  # noqa: BLE001 - suggestions only, never break the targets endpoint
        return []
    out: list[dict[str, Any]] = []
    for eid in sorted(states):
        if ".dsc_zigbee_" not in eid:
            continue
        st = states[eid]
        attrs = st.get("attributes") if isinstance(st.get("attributes"), dict) else {}
        if eid.startswith("binary_sensor."):
            kind = "bool"
        elif _is_number(st.get("state")):
            kind = "number"
        else:
            kind = "string"
        out.append(
            {
                "entity_id": eid,
                "role": attrs.get("zigbee_role"),
                "key": attrs.get("zigbee_key"),
                "unit": attrs.get("unit_of_measurement"),
                "kind": kind,
            }
        )
    return out


def _is_number(v: Any) -> bool:
    try:
        float(str(v))
        return True
    except (TypeError, ValueError):
        return False


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


def _normalize_condition(raw: Any, where: str) -> dict[str, Any]:
    if not isinstance(raw, dict):
        raise ValueError(f"{where} must be an object")
    if "all" in raw or "any" in raw:
        raise ValueError(f"{where}: nested groups are not supported — one all/any level only")
    entity_id = str(raw.get("entity_id") or "").strip()
    if not entity_id or "." not in entity_id:
        raise ValueError(f"{where}.entity_id must be a domain.object id")
    op = str(raw.get("op") or "").strip().lower()
    if op not in VALID_OPS:
        raise ValueError(f"invalid {where}.op {op!r}")
    value = raw.get("value")
    if op in _NUMERIC_OPS:
        try:
            value = float(value)  # type: ignore[arg-type]
        except (TypeError, ValueError) as exc:
            raise ValueError(f"{where}.value must be numeric for op {op}") from exc
    elif op in _BOOL_OPS:
        value = _coerce_bool(value)
        if value is None:
            raise ValueError(f"{where}.value must be boolean-ish for is/is_not")
    else:
        value = str(value if value is not None else "")

    cond: dict[str, Any] = {"entity_id": entity_id, "op": op, "value": value}

    hyst = raw.get("hysteresis")
    if hyst not in (None, ""):
        if op not in _NUMERIC_OPS:
            raise ValueError(f"{where}.hysteresis only applies to gt/lt/gte/lte")
        try:
            hyst_f = float(hyst)
        except (TypeError, ValueError) as exc:
            raise ValueError(f"{where}.hysteresis must be numeric") from exc
        if hyst_f < 0:
            raise ValueError(f"{where}.hysteresis must be ≥ 0")
        if hyst_f > 0:
            cond["hysteresis"] = hyst_f

    max_age = raw.get("max_age_s")
    if max_age not in (None, ""):
        try:
            age_f = float(max_age)
        except (TypeError, ValueError) as exc:
            raise ValueError(f"{where}.max_age_s must be numeric") from exc
        if age_f <= 0:
            raise ValueError(f"{where}.max_age_s must be > 0")
        cond["max_age_s"] = age_f
    return cond


def _normalize_trigger(trig: Any) -> dict[str, Any]:
    if not isinstance(trig, dict):
        raise ValueError("trigger must be an object")
    if "all" in trig or "any" in trig:
        if "all" in trig and "any" in trig:
            raise ValueError("trigger must be either all or any, not both")
        mode = "all" if "all" in trig else "any"
        conds = trig.get(mode)
        if not isinstance(conds, list) or not conds:
            raise ValueError(f"trigger.{mode} must be a non-empty list of conditions")
        if len(conds) > MAX_CONDITIONS:
            raise ValueError(f"trigger.{mode} allows at most {MAX_CONDITIONS} conditions")
        return {mode: [_normalize_condition(c, f"trigger.{mode}[{i}]") for i, c in enumerate(conds)]}
    # v1 flat trigger → single-condition all-group.
    return {"all": [_normalize_condition(trig, "trigger")]}


def _normalize_window(win: Any) -> dict[str, str] | None:
    if win in (None, "", {}):
        return None
    if not isinstance(win, dict):
        raise ValueError("window must be {start, end}")
    start = str(win.get("start") or "").strip()
    end = str(win.get("end") or "").strip()
    if not start and not end:
        return None
    if not _HHMM_RE.match(start) or not _HHMM_RE.match(end):
        raise ValueError("window.start / window.end must be HH:MM")
    if start == end:
        raise ValueError("window.start and window.end must differ (omit the window for always)")
    return {"start": start, "end": end}


def _normalize_seconds(raw: Any, name: str) -> float:
    if raw in (None, ""):
        return 0.0
    try:
        v = float(raw)
    except (TypeError, ValueError) as exc:
        raise ValueError(f"{name} must be numeric seconds") from exc
    if v < 0:
        raise ValueError(f"{name} must be ≥ 0")
    return v


def clamp_setpoint(entity_id: str, value: float) -> float:
    meta = SETPOINT_TARGETS[entity_id]
    lo, hi, step = float(meta["min"]), float(meta["max"]), float(meta["step"])
    v = min(hi, max(lo, float(value)))
    if step > 0:
        v = lo + round((v - lo) / step) * step
        v = min(hi, max(lo, v))
    return round(v, 3)


def _normalize_action(action: Any) -> dict[str, Any]:
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
    elif atype == "relay":
        eid = str(params.get("entity_id") or "").strip()
        meta = RELAY_TARGETS.get(eid)
        if meta is None:
            raise ValueError(
                f"relay target {eid or '(none)'} is not allowed — loop-owned outputs cannot be rule targets; "
                f"allowed: {', '.join(RELAY_TARGETS)}"
            )
        on = bool(params.get("on_when_firing", not meta.get("cutout_only")))
        if meta.get("cutout_only") and on:
            raise ValueError(f"{eid} is loop-driven; a rule may only hold it OFF while firing (on_when_firing=false)")
        clean_params = {"entity_id": eid, "on_when_firing": on}
    elif atype == "setpoint":
        eid = str(params.get("entity_id") or "").strip()
        meta = SETPOINT_TARGETS.get(eid)
        if meta is None:
            raise ValueError(
                f"setpoint target {eid or '(none)'} is not allowed; allowed: {', '.join(SETPOINT_TARGETS)}"
            )
        try:
            value = float(params.get("value"))  # type: ignore[arg-type]
        except (TypeError, ValueError) as exc:
            raise ValueError("setpoint action needs a numeric params.value") from exc
        clean_params = {
            "entity_id": eid,
            "value": clamp_setpoint(eid, value),
            "restore_on_clear": bool(params.get("restore_on_clear", True)),
        }
    return {"type": atype, "params": clean_params}


def _normalize_rule(row: Any) -> dict[str, Any]:
    if not isinstance(row, dict):
        raise ValueError("rule must be an object")
    rid = str(row.get("id") or "").strip().lower()
    if not _RULE_ID_RE.match(rid):
        raise ValueError(f"invalid rule id {rid!r} — slug, lowercase, 2–48 chars")
    return {
        "id": rid,
        "name": str(row.get("name") or rid).strip()[:80] or rid,
        "enabled": bool(row.get("enabled", False)),
        "trigger": _normalize_trigger(row.get("trigger") or {}),
        "window": _normalize_window(row.get("window")),
        "debounce_s": _normalize_seconds(row.get("debounce_s"), "debounce_s"),
        "release_s": _normalize_seconds(row.get("release_s"), "release_s"),
        "action": _normalize_action(row.get("action") or {}),
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
            if state[rid].get("firing"):
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


def _coerce_ts(raw: Any) -> float | None:
    if raw is None or isinstance(raw, bool):
        return None
    if isinstance(raw, (int, float)):
        v = float(raw)
        return v / 1000.0 if v > 1e12 else v  # z2m may report epoch ms
    try:
        return datetime.fromisoformat(str(raw).replace("Z", "+00:00")).timestamp()
    except ValueError:
        return None


def _entity_timestamp(fleet: FleetState, entity_id: str) -> float | None:
    """Device last-seen backing this entity, or None when no timestamp exists."""
    src = timestamp_source(entity_id)
    if src == "hub":
        return fleet.hub.last_seen if fleet.hub else None
    if src == "probe":
        m = _PROBE_AGE_RE.match(entity_id)
        seat = fleet.pots.get(f"pot{m.group(1)}") if m else None
        return seat.last_seen if seat else None
    if src == "sonoff":
        seat = fleet.sonoffs.get(_SONOFF_RELAY_SEAT[entity_id])
        return seat.last_seen if seat else None
    if src == "zigbee":
        m = _ZIGBEE_AGE_RE.match(entity_id)
        rest = m.group(1) if m else ""
        system = fleet.system or {}
        # `rest` is "<role_slug>_<datapoint>"; role slugs may themselves contain
        # underscores (leak_floor vs leak_floor_4x8), so take the longest role prefix.
        best: tuple[int, dict[str, Any]] | None = None
        for bucket in ("zigbee_by_placement", "zigbee_by_role"):
            for key, row in (system.get(bucket) or {}).items():
                if not isinstance(row, dict):
                    continue
                key_slug = str(key).lower().replace(" ", "_").replace("/", "_")[:48]
                if rest == key_slug or rest.startswith(key_slug + "_"):
                    if best is None or len(key_slug) > best[0]:
                        best = (len(key_slug), row)
        if best is not None:
            row = best[1]
            return _coerce_ts(row.get("last_seen")) or _coerce_ts(row.get("updated_at"))
    return None


def _computed_states(fleet: FleetState, inventory: list[dict[str, Any]]) -> dict[str, dict[str, Any]]:
    """The SPA's computed entities (hass_extras). Failure → empty (fail closed)."""
    try:
        from .computed_ops import build_computed_hass_states

        out = build_computed_hass_states(fleet, inventory)
        return out if isinstance(out, dict) else {}
    except Exception as exc:  # noqa: BLE001
        _logger.warning("automation computed view unavailable: %s", exc)
        return {}


def _rule_conditions(rule: dict[str, Any]) -> list[dict[str, Any]]:
    trig = rule["trigger"]
    return list(trig.get("all") or trig.get("any") or [])


def _build_view(
    fleet: FleetState,
    inventory: list[dict[str, Any]],
    rules: list[dict[str, Any]],
) -> dict[str, dict[str, Any]]:
    """Merged read-only state view: raw fleet + computed extras (computed wins).

    Computed states are only built when an armed rule references something the
    raw view lacks (or a relay/setpoint action needs a hub control snapshot).
    """
    raw = fleet.to_hass_states(inventory)
    needs_computed = False
    for rule in rules:
        if not rule["enabled"]:
            continue
        if rule["action"]["type"] in ("relay", "setpoint"):
            needs_computed = True
            break
        if any(c["entity_id"] not in raw for c in _rule_conditions(rule)):
            needs_computed = True
            break
    if not needs_computed:
        return raw
    return {**raw, **_computed_states(fleet, inventory)}


def _window_open(window: dict[str, str] | None, now: float) -> bool:
    if not window:
        return True
    h, m = _local_hm(now)
    cur = h * 60 + m
    sh, sm = (int(x) for x in window["start"].split(":"))
    eh, em = (int(x) for x in window["end"].split(":"))
    start, end = sh * 60 + sm, eh * 60 + em
    if start < end:
        return start <= cur < end
    return cur >= start or cur < end  # wraps past midnight


def _condition_true(
    cond: dict[str, Any],
    view: dict[str, dict[str, Any]],
    fleet: FleetState,
    hub_online: bool,
    now: float,
    latched: bool,
) -> bool:
    """One condition with usable evidence. Fails closed on any doubt."""
    if not hub_online:
        return False
    eid = str(cond["entity_id"])
    raw = _entity_state(view, eid)
    if raw is None:
        return False
    max_age = cond.get("max_age_s")
    if max_age is not None:
        ts = _entity_timestamp(fleet, eid)
        if ts is None or now - ts > float(max_age):
            return False
    op = cond["op"]
    if op in _NUMERIC_OPS:
        try:
            cur = float(raw)
        except ValueError:
            return False
        target = float(cond["value"])
        hyst = float(cond.get("hysteresis") or 0.0) if latched else 0.0
        if op == "gt":
            return cur > target - hyst
        if op == "lt":
            return cur < target + hyst
        if op == "gte":
            return cur >= target - hyst
        return cur <= target + hyst
    if op in _BOOL_OPS:
        cur_b = _coerce_bool(raw)
        if cur_b is None:
            return False
        want = bool(cond["value"])
        return cur_b == want if op == "is" else cur_b != want
    want_s = str(cond["value"])
    return raw == want_s if op == "eq" else raw != want_s


def _trigger_true(
    rule: dict[str, Any],
    view: dict[str, dict[str, Any]],
    fleet: FleetState,
    hub_online: bool,
    now: float,
    latched: bool,
) -> bool:
    if not _window_open(rule.get("window"), now):
        return False
    trig = rule["trigger"]
    if "any" in trig:
        return any(_condition_true(c, view, fleet, hub_online, now, latched) for c in trig["any"])
    return all(_condition_true(c, view, fleet, hub_online, now, latched) for c in trig["all"])


# ------------------------------------------------------------------ actuators


def _log_task_failure(task: "asyncio.Task[Any]") -> None:
    try:
        exc = task.exception()
    except asyncio.CancelledError:
        return
    if exc is not None:
        _logger.warning("automation actuator write failed: %s", exc)


def _service(domain: str, service: str, data: dict[str, Any]) -> bool:
    """Route a write through control_ops.call_service_proxy; never raises.

    Called from the sync ``/fleet`` handler (threadpool → run our own loop) and
    from the async ``/ws/fleet`` loop (running loop → schedule a task).
    """
    try:
        from .control_ops import call_service_proxy

        coro = call_service_proxy(domain, service, data)
        try:
            loop = asyncio.get_running_loop()
        except RuntimeError:
            loop = None
        if loop is not None:
            task = loop.create_task(coro)
            task.add_done_callback(_log_task_failure)
            return True
        asyncio.run(coro)
        return True
    except Exception as exc:  # noqa: BLE001
        _logger.warning("automation %s.%s %s failed: %s", domain, service, data.get("entity_id"), exc)
        return False


def _follow_plants_active(view: dict[str, dict[str, Any]], fleet: FleetState) -> bool:
    mode = _control_snapshot(view, fleet, "select.dsc_hub_clone_mode")
    if mode is None:
        try:
            from .compose_store import get_helper

            mode = str(get_helper("select.dsc_hub_clone_mode", "") or "")
        except Exception:  # noqa: BLE001
            return False
    try:
        from .climate_mode import is_follow_plants_mode, migrate_legacy_clone_mode

        return is_follow_plants_mode(migrate_legacy_clone_mode(mode or ""))
    except Exception:  # noqa: BLE001
        return False


def _resync_sonoff_relay(seat_id: str) -> None:
    """After restoring a cut-out seat, hand the relay back to the appliance driver.

    Forcing OFF through the driver's own safety path resets its commanded-state
    cache so the next 2 s tick re-asserts from live hub demand.
    """
    try:
        from .demo_mode import is_demo_mode

        if is_demo_mode():
            return
        from .appliance_driver import force_set_sonoff_relay_sync

        force_set_sonoff_relay_sync(seat_id, False)
    except Exception as exc:  # noqa: BLE001
        _logger.warning("automation relay resync %s failed: %s", seat_id, exc)


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


def _seat_in_service(seat_id: str) -> bool | None:
    for row in list_inventory():
        if str(row.get("seat_id")) == seat_id:
            return bool(row.get("in_service"))
    return None


def _control_snapshot(view: dict[str, dict[str, Any]], fleet: FleetState, entity_id: str) -> str | None:
    """Current hub control state for restore-on-clear: merged view first, raw hub controls as fallback."""
    st = _entity_state(view, entity_id)
    if st is not None:
        return st
    controls = (fleet.hub.values.get("controls") if fleet.hub else None) or {}
    ctrl = controls.get(entity_id)
    if isinstance(ctrl, dict):
        return _entity_state({entity_id: {"state": ctrl.get("state")}}, entity_id)
    return None


def _apply_effect(rule: dict[str, Any], fleet: FleetState, view: dict[str, dict[str, Any]]) -> dict[str, Any]:
    rid = rule["id"]
    action = rule["action"]
    params = action["params"]
    owned: dict[str, Any] = {
        "firing": True,
        "fired_at": _now(),
        "owned_banner": None,
        "owned_seat": None,
        "owned_switch": None,
        "owned_relay": None,
        "owned_setpoint": None,
        "last_error": None,
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
            owned["last_error"] = f"zigbee write failed: {exc}"
        owned["owned_switch"] = {"friendly_name": fn, "on_when_firing": on}
    elif action["type"] == "relay":
        eid = params["entity_id"]
        meta = RELAY_TARGETS.get(eid) or {}
        on = bool(params.get("on_when_firing", False))
        relay: dict[str, Any] = {"entity_id": eid, "on_when_firing": on, "kind": meta.get("kind")}
        if meta.get("kind") == "sonoff":
            seat = str(meta["seat_id"])
            relay["seat_id"] = seat
            relay["restore_in_service"] = _seat_in_service(seat)
            ok = _service("switch", "turn_off", {"entity_id": eid})
            upsert_inventory(seat, {"in_service": False})
            _set_banner(fleet, banner_id, f"{rule['name']}: {seat} relay held OFF by a rule", "warn")
            owned["owned_banner"] = banner_id
        else:
            relay["restore"] = _control_snapshot(view, fleet, eid)  # "on" / "off" / None
            ok = _service("switch", "turn_on" if on else "turn_off", {"entity_id": eid})
        if not ok:
            owned["last_error"] = f"relay write to {eid} failed (see brain log)"
        owned["owned_relay"] = relay
    elif action["type"] == "setpoint":
        eid = params["entity_id"]
        meta = SETPOINT_TARGETS.get(eid) or {}
        value = clamp_setpoint(eid, float(params["value"]))
        prev_raw = _control_snapshot(view, fleet, eid)
        prev: float | None
        try:
            prev = float(prev_raw) if prev_raw is not None else None
        except ValueError:
            prev = None
        sp: dict[str, Any] = {
            "entity_id": eid,
            "value": value,
            "restore": prev if params.get("restore_on_clear", True) else None,
            "skipped": None,
        }
        if meta.get("pi_owned_when") == "follow_plants" and _follow_plants_active(view, fleet):
            sp["skipped"] = "follow_plants"
            sp["restore"] = None
            owned["last_error"] = f"{eid} is Pi-owned while 2x4 mode is Follow Plants — write skipped"
            _logger.info("automation setpoint %s skipped: Follow Plants owns clone_* numbers", eid)
        else:
            ok = _service("number", "set_value", {"entity_id": eid, "value": value})
            if not ok:
                owned["last_error"] = f"setpoint write to {eid} failed (see brain log)"
        owned["owned_setpoint"] = sp
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
    relay = owned.get("owned_relay")
    if isinstance(relay, dict) and relay.get("entity_id"):
        eid = str(relay["entity_id"])
        if relay.get("kind") == "sonoff" and relay.get("seat_id"):
            seat_id = str(relay["seat_id"])
            prev_in_service = relay.get("restore_in_service")
            upsert_inventory(seat_id, {"in_service": True if prev_in_service is None else bool(prev_in_service)})
            _resync_sonoff_relay(seat_id)
        else:
            restore = relay.get("restore")
            if restore in ("on", "off"):
                want_on = restore == "on"
            else:
                want_on = not bool(relay.get("on_when_firing", False))
            _service("switch", "turn_on" if want_on else "turn_off", {"entity_id": eid})
    sp = owned.get("owned_setpoint")
    if isinstance(sp, dict) and sp.get("entity_id") and sp.get("restore") is not None:
        eid = str(sp["entity_id"])
        if eid in SETPOINT_TARGETS:
            _service("number", "set_value", {"entity_id": eid, "value": clamp_setpoint(eid, float(sp["restore"]))})


# ------------------------------------------------------------------- evaluate


def evaluate_automation_rules(
    fleet: FleetState | None = None,
    inventory: list[dict[str, Any]] | None = None,
) -> dict[str, Any]:
    """Run every enabled rule against the current fleet. Edge-triggered.

    Safe to call on every fleet broadcast — it only writes when a rule crosses
    an edge (after debounce / release). Returns a per-rule summary for the
    settings UI. Never raises for an actuator write failure.
    """
    fleet = fleet or get_fleet_state()
    inv = inventory if inventory is not None else list_inventory()
    hub_online = bool(fleet.hub and fleet.hub.online)
    now = _now()

    rules = load_automation_rules()
    view = _build_view(fleet, inv, rules)
    state = _load_state()
    changed = False
    summary: list[dict[str, Any]] = []

    for rule in rules:
        rid = rule["id"]
        prev = state.get(rid) or {}
        was_firing = bool(prev.get("firing"))
        raw_true = rule["enabled"] and _trigger_true(rule, view, fleet, hub_online, now, latched=was_firing)
        debounce = float(rule.get("debounce_s") or 0.0)
        release = float(rule.get("release_s") or 0.0)

        if raw_true and not was_firing:
            since = float(prev.get("pending_since") or now)
            if now - since >= debounce:
                try:
                    state[rid] = _apply_effect(rule, fleet, view)
                except Exception as exc:  # noqa: BLE001
                    _logger.warning("automation rule %s apply failed: %s", rid, exc)
                    state[rid] = {"firing": True, "fired_at": now, "last_error": str(exc)}
            else:
                state[rid] = {"firing": False, "pending_since": since}
            changed = True
        elif raw_true and was_firing:
            if prev.get("release_since") is not None:
                prev.pop("release_since", None)
                state[rid] = prev
                changed = True
        elif not raw_true and was_firing:
            since = float(prev.get("release_since") or now)
            if now - since >= release:
                try:
                    _clear_effect(rid, prev, fleet)
                except Exception as exc:  # noqa: BLE001
                    _logger.warning("automation rule %s clear failed: %s", rid, exc)
                state.pop(rid, None)
            else:
                prev["release_since"] = since
                state[rid] = prev
            changed = True
        elif rid in state:  # not true, not firing → drop any pending timer
            state.pop(rid, None)
            changed = True

        cur = state.get(rid, {})
        summary.append(
            {
                **rule,
                "firing": bool(cur.get("firing")),
                "pending": cur.get("pending_since") is not None and not cur.get("firing"),
                "releasing": cur.get("release_since") is not None and bool(cur.get("firing")),
                "last_error": cur.get("last_error"),
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
    out: list[dict[str, Any]] = []
    for rule in rules:
        cur = state.get(rule["id"], {})
        out.append(
            {
                **rule,
                "firing": bool(cur.get("firing")),
                "pending": cur.get("pending_since") is not None and not cur.get("firing"),
                "releasing": cur.get("release_since") is not None and bool(cur.get("firing")),
                "last_error": cur.get("last_error"),
            }
        )
    return {"rules": out}
