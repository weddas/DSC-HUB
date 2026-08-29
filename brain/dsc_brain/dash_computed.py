"""Dash/Home view entities — Pi-native mirrors of HA template + REST sensors."""

from __future__ import annotations

import datetime
import time
from typing import Any
from zoneinfo import ZoneInfo

import httpx

from .compose_store import get_helper
from .event_log import record_grow_log
from .sensor_trust import emit_sensor_trust
from .integrations import cannalib_base_url, cannalib_headers
from .runtime_history import HistoryMemo, RuntimeMemo, cycle_count_since, midnight_ts
from .settings import record_history

_CANNALIB_CACHE: dict[str, Any] = {"ts": 0.0, "data": {}}
_SYDNEY_TZ = ZoneInfo("Australia/Sydney")
_PREV_DARK_VIOLATION = False


def _midnight_ts() -> float:
    return midnight_ts()


def _coldest_root_zone(fleet: Any) -> tuple[float | None, str]:
    votes = 0
    for n in range(1, 5):
        if get_helper(f"switch.dsc_hub_mat_vote_pot_{n}", "on") == "on":
            votes += 1
    best_t: float | None = None
    best_pot = "none"
    for n in range(1, 5):
        vote_on = get_helper(f"switch.dsc_hub_mat_vote_pot_{n}", "on") == "on"
        if votes > 0 and not vote_on:
            continue
        seat = (fleet.pots or {}).get(f"pot{n}")
        if not seat or not seat.online:
            continue
        raw = seat.values.get("soil_temp_c")
        if raw is None:
            continue
        try:
            t = float(raw)
        except (TypeError, ValueError):
            continue
        if not (5 < t < 45):
            continue
        if best_t is None or t < best_t:
            best_t = t
            best_pot = str(n)
    return best_t, best_pot


def _inventory_in_service(inventory: list[dict[str, Any]] | None, seat_id: str, default: bool = True) -> bool:
    for row in inventory or []:
        if row.get("seat_id") == seat_id:
            return bool(row.get("in_service", default))
    defaults = {"ac": False, "mister": False, "pot3": False, "pot4": False, "tank": False}
    return defaults.get(seat_id, default)


def _reduced_kit(inventory: list[dict[str, Any]] | None) -> tuple[bool, dict[str, str]]:
    planned: list[str] = []
    offline: list[str] = []
    if not _inventory_in_service(inventory, "ac", False):
        planned.append("AC")
    if not _inventory_in_service(inventory, "mister", False):
        planned.append("Clone mister")
    if not _inventory_in_service(inventory, "pot3", False):
        planned.append("POT3")
    if not _inventory_in_service(inventory, "tank", False):
        planned.append("Tank")
    for label, key in (
        ("Humidifier (temp)", "input_boolean.dsc_humidifier_temp_oos"),
        ("Dehumidifier (temp)", "input_boolean.dsc_dehumidifier_temp_oos"),
        ("Humidifier (lock)", "input_boolean.dsc_humidifier_operator_lockout"),
        ("Dehumidifier (lock)", "input_boolean.dsc_dehumidifier_operator_lockout"),
        ("Clone mister (temp)", "input_boolean.dsc_clone_humidifier_temp_oos"),
        ("Clone mister (lock)", "input_boolean.dsc_clone_humidifier_operator_lockout"),
    ):
        if get_helper(key, "off") == "on":
            offline.append(label)
    for n in (1, 2, 4):
        if not _inventory_in_service(inventory, f"pot{n}", True):
            offline.append(f"POT{n}")
    active = len(offline) > 0
    return active, {
        "planned_oos": ", ".join(planned) if planned else "",
        "offline": ", ".join(offline) if offline else "a live lever is parked",
    }


def _fleet_version_status(fleet: Any) -> tuple[str, str]:
    expected = getattr(fleet, "expected_firmware", None) or "7.0.0.0"
    exp_short = ".".join(str(expected).split(".")[:3])
    drift = False
    if fleet.hub and fleet.hub.online and fleet.hub.firmware:
        hub_maj = ".".join(str(fleet.hub.firmware).split(".")[:3])
        if hub_maj != exp_short:
            drift = True
    for seat in list((fleet.pots or {}).values()) + list((fleet.sonoffs or {}).values()):
        if not seat.online or not seat.firmware:
            continue
        maj = ".".join(str(seat.firmware).split(".")[:3])
        if maj != exp_short:
            drift = True
            break
    status = "warn" if drift else "ok"
    return status, exp_short


def _control_state(states: dict[str, dict[str, Any]], eid: str) -> str | None:
    ent = states.get(eid)
    if not ent:
        return None
    st = ent.get("state")
    if st in (None, "unavailable", "unknown"):
        return None
    return str(st)


def _expected_light_hours(grow_stage: str) -> float:
    veg = {
        "Germination",
        "Seedling",
        "Early Vegetative",
        "Vegetative",
        "Late (Push) Vegetative",
    }
    flwr = {
        "Early Flowering",
        "Flowering",
        "Late Flowering",
        "Final 48-72h Flowering",
    }
    if grow_stage in veg:
        return 18.0
    if grow_stage in flwr:
        return 12.0
    return 0.0


def _clone_expected_light_hours(states: dict[str, dict[str, Any]]) -> float:
    clone_mode = _control_state(states, "select.dsc_hub_clone_mode") or get_helper("select.dsc_hub_clone_mode", "Clones & Seedlings")
    if clone_mode == "Off":
        return 0.0
    photo = _control_state(states, "select.dsc_hub_clone_photoperiod") or get_helper("select.dsc_hub_clone_photoperiod", "Independent")
    if photo == "Follow 4x8" or clone_mode == "Follow 4x8":
        grow_stage = _control_state(states, "select.dsc_hub_grow_stage") or get_helper("select.dsc_hub_grow_stage", "Germination")
        return _expected_light_hours(grow_stage)
    try:
        return float(_control_state(states, "number.dsc_hub_clone_light_hours") or get_helper("number.dsc_hub_clone_light_hours", 18))
    except (TypeError, ValueError):
        return 18.0


def _emit_hub_controls(states: dict[str, dict[str, Any]], fleet: Any, set_entity: Any) -> None:
    """Mirror live hub controls/binaries into hass_extras when hub is online."""
    if not fleet.hub or not fleet.hub.online:
        return
    controls = fleet.hub.values.get("controls") or {}
    for eid, ctrl in controls.items():
        attrs: dict[str, Any] = {}
        if ctrl.get("options"):
            attrs["options"] = ctrl["options"]
        if ctrl.get("percentage") is not None:
            attrs["percentage"] = ctrl["percentage"]
        if ctrl.get("brightness") is not None:
            attrs["brightness"] = ctrl["brightness"]
        set_entity(states, eid, ctrl.get("state", "unavailable"), available=True, attributes=attrs or None)

    binaries = fleet.hub.values.get("binaries") or {}
    for eid, on in binaries.items():
        set_entity(states, eid, "on" if on else "off", available=True)


def _dark_period_violation(states: dict[str, dict[str, Any]]) -> bool:
    sf_on = _control_state(states, "light.dsc_hub_sf1000_dimmer") == "on"
    clone_window = _control_state(states, "binary_sensor.dsc_hub_2x4_window_open") == "on"
    catchup = _control_state(states, "binary_sensor.dsc_hub_light_catchup_active") == "on"
    return bool(sf_on and not clone_window and not catchup)


def _cannalib_snapshot() -> dict[str, Any]:
    now = time.time()
    if now - _CANNALIB_CACHE["ts"] < 30 and _CANNALIB_CACHE["data"]:
        return _CANNALIB_CACHE["data"]
    base = cannalib_base_url()
    out: dict[str, Any] = {"online": False, "hits": 0, "bytes_in": 0, "bytes_out": 0, "corpus_strains": 0, "summary": "— MB"}
    if not base:
        _CANNALIB_CACHE.update(ts=now, data=out)
        return out
    headers = cannalib_headers()
    try:
        with httpx.Client(timeout=4.0) as client:
            metrics = client.get(f"{base}/v1/metrics", headers=headers)
            if metrics.status_code == 200:
                data = metrics.json()
                out["online"] = True
                out["hits"] = int(data.get("hits_total") or data.get("hits") or 0)
                out["bytes_in"] = int(data.get("bytes_in_total") or data.get("bytes_in") or 0)
                out["bytes_out"] = int(data.get("bytes_out_total") or data.get("bytes_out") or 0)
            corpus = client.get(f"{base}/v1/corpus", headers=headers)
            if corpus.status_code == 200:
                cdata = corpus.json()
                strains = cdata.get("strains") or cdata.get("corpus", {}).get("strains")
                if strains is not None:
                    out["corpus_strains"] = int(strains)
            if out["online"]:
                mb = (out["bytes_in"] + out["bytes_out"]) / (1024 * 1024)
                out["summary"] = f"{mb:.1f} MB"
    except Exception:
        pass
    _CANNALIB_CACHE.update(ts=now, data=out)
    return out


def emit_dash_entities(
    states: dict[str, dict[str, Any]],
    fleet: Any,
    *,
    set_entity: Any,
    inventory: list[dict[str, Any]] | None = None,
    runtime: RuntimeMemo | None = None,
) -> None:
    """Add Home-dash entities into hass_extras map."""
    runtime_memo = runtime or RuntimeMemo()
    history = runtime_memo.history

    uptime = 0.0
    if fleet.hub and fleet.hub.online:
        up = fleet.hub.values.get("uptime")
        if up is not None:
            try:
                uptime = float(up)
            except (TypeError, ValueError):
                uptime = 0.0
    set_entity(states, "sensor.dsc_hub_uptime", uptime, available=fleet.hub.online if fleet.hub else False, attributes={"unit_of_measurement": "s"})

    fv_status, fv_exp = _fleet_version_status(fleet)
    set_entity(
        states,
        "sensor.dsc_fleet_version_status",
        fv_status,
        available=True,
        attributes={"expected": fv_exp},
    )

    cann = _cannalib_snapshot()
    set_entity(states, "binary_sensor.dsc_cannalib_api_online", "on" if cann["online"] else "off", available=True)
    set_entity(states, "sensor.dsc_cannalib_api_hits", cann["hits"], available=cann["online"])
    set_entity(states, "sensor.dsc_cannalib_bytes_in", cann["bytes_in"], available=cann["online"])
    set_entity(states, "sensor.dsc_cannalib_bytes_out", cann["bytes_out"], available=cann["online"])
    set_entity(states, "sensor.dsc_cannalib_corpus_strains", cann["corpus_strains"], available=cann["online"])
    set_entity(states, "sensor.dsc_cannalib_bandwidth_summary", cann["summary"], available=True, attributes={"hits": cann["hits"]})

    reduced, reduced_attrs = _reduced_kit(inventory)
    set_entity(states, "binary_sensor.dsc_reduced_kit", "on" if reduced else "off", available=True, attributes=reduced_attrs)

    coldest, col_pot = _coldest_root_zone(fleet)
    if coldest is not None:
        set_entity(
            states,
            "sensor.dsc_coldest_root_zone_temp",
            round(coldest, 2),
            available=True,
            attributes={"pot": col_pot, "unit_of_measurement": "°C"},
        )
        record_history("hub", "coldest_root_c", float(coldest), time.time())

    since_hour = time.time() - 3600
    set_entity(states, "sensor.dsc_humidifier_cycles_last_hour", cycle_count_since("hub", "switch_dsc_hub_humidifier_demand", since_hour, history=history), available=True)
    set_entity(states, "sensor.dsc_dehumidifier_runtime_today", runtime_memo.hours_today("hub", "switch_dsc_hub_dehumidifier_demand"), available=True, attributes={"unit_of_measurement": "h"})
    set_entity(states, "sensor.dsc_ac_runtime_today", runtime_memo.hours_today("hub", "switch_dsc_hub_ac_demand"), available=True, attributes={"unit_of_measurement": "h"})

    _emit_hub_controls(states, fleet, set_entity)

    # Expected light hours: owned by light_loop (emit_light_loop overwrites). Do not
    # pre-emit dash stage-default hours — that was dual-home theater before overwrite.

    global _PREV_DARK_VIOLATION
    dark_violation = _dark_period_violation(states)
    set_entity(states, "binary_sensor.dsc_clone_dark_period_violation", "on" if dark_violation else "off", available=True)
    if dark_violation and not _PREV_DARK_VIOLATION:
        record_grow_log("⚠ Clone dark-period violation — SF1000 on outside the 2x4 window")
    _PREV_DARK_VIOLATION = dark_violation

    emit_sensor_trust(states, fleet, set_entity=set_entity, inventory=inventory)

    ac_oos = get_helper("input_boolean.dsc_ac_in_service", "off") != "on"
    mister_oos = get_helper("input_boolean.dsc_clone_humidifier_in_service", "off") != "on"
    set_entity(states, "binary_sensor.dsc_ac_capacity_offline", "on" if ac_oos else "off", available=True)
    set_entity(states, "binary_sensor.dsc_clone_humidifier_capacity_offline", "on" if mister_oos else "off", available=True)

    root_fault = _control_state(states, "binary_sensor.dsc_hub_root_zone_sensor_fault") == "on"
    set_entity(states, "binary_sensor.dsc_hub_root_zone_sensor_fault", "on" if root_fault else "off", available=True)

    for n in range(1, 5):
        eid = f"binary_sensor.dsc_hub_pot{n}_esp_now_link"
        hub_bin = (fleet.hub.values.get("binaries") or {}).get(eid) if fleet.hub else None
        if hub_bin is not None:
            set_entity(states, eid, "on" if hub_bin else "off", available=True)
        elif eid not in states:
            pot = (fleet.pots or {}).get(f"pot{n}")
            link = "on" if pot and pot.online else "off"
            set_entity(states, eid, link, available=True)

    # Hub-published countdowns when live; otherwise honest zero.
    countdown_keys = {
        "sensor.dsc_hub_humidifier_fire_countdown": "humidifier_fire_countdown",
        "sensor.dsc_hub_dehumidifier_fire_countdown": "dehumidifier_fire_countdown",
        "sensor.dsc_hub_heater_fire_countdown": "heater_fire_countdown",
        "sensor.dsc_hub_ac_fire_countdown": "ac_fire_countdown",
        "sensor.dsc_hub_grow_mat_fire_countdown": "grow_mat_fire_countdown",
        "sensor.dsc_hub_clone_humidifier_fire_countdown": "clone_humidifier_fire_countdown",
    }
    hub_vals = fleet.hub.values if fleet.hub else {}
    for eid, key in countdown_keys.items():
        raw = hub_vals.get(key)
        val = float(raw) if raw is not None else 0.0
        set_entity(states, eid, val, available=fleet.hub.online if fleet.hub else False)

    cooldown_keys = {
        "sensor.dsc_hub_humidifier_cooldown_remaining": "humidifier_cooldown_remaining",
        "sensor.dsc_hub_dehumidifier_cooldown_remaining": "dehumidifier_cooldown_remaining",
        "sensor.dsc_hub_heater_cooldown_remaining": "heater_cooldown_remaining",
        "sensor.dsc_hub_ac_cooldown_remaining": "ac_cooldown_remaining",
        "sensor.dsc_hub_grow_mat_cooldown_remaining": "grow_mat_cooldown_remaining",
        "sensor.dsc_hub_clone_humidifier_cooldown_remaining": "clone_humidifier_cooldown_remaining",
    }
    for eid, key in cooldown_keys.items():
        raw = hub_vals.get(key)
        val = float(raw) if raw is not None else 0.0
        set_entity(
            states,
            eid,
            val,
            available=fleet.hub.online if fleet.hub else False,
            attributes={"unit_of_measurement": "s"},
        )
