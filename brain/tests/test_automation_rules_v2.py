"""Automation rule engine v2 — compound triggers, timing, relay/setpoint actions."""

from __future__ import annotations

from pathlib import Path
from typing import Any

import pytest

TEMP = "sensor.dsc_hub_tent_temperature"
RH = "sensor.dsc_hub_tent_humidity"


def _fleet(temp_c: float | None = None, rh: float | None = None, online: bool = True, last_seen: float | None = None):
    from dsc_brain.fleet_state import get_fleet_state, update_fleet_state

    f = get_fleet_state()
    f.hub.online = online
    if temp_c is None:
        f.hub.values.pop("temp_c", None)
    else:
        f.hub.values["temp_c"] = temp_c
    if rh is None:
        f.hub.values.pop("rh_pct", None)
    else:
        f.hub.values["rh_pct"] = rh
    if last_seen is not None:
        f.hub.last_seen = last_seen
    update_fleet_state(f)
    return f


def _banners():
    from dsc_brain.fleet_state import get_fleet_state

    return get_fleet_state().system.get("critical_banners") or []


def _has_banner(rid: str) -> bool:
    return any(b.get("id") == f"auto-{rid}" for b in _banners())


def _rule(**over: Any) -> dict[str, Any]:
    base: dict[str, Any] = {
        "id": "hot_tent",
        "name": "Tent too hot",
        "enabled": True,
        "trigger": {"entity_id": TEMP, "op": "gt", "value": 30},
        "action": {"type": "banner", "params": {"text": "4x8 running hot", "tone": "warn"}},
    }
    base.update(over)
    return base


@pytest.fixture()
def engine(temp_db: Path, monkeypatch: pytest.MonkeyPatch):
    """Engine with a frozen, steerable clock and no computed-view build."""
    monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", temp_db)
    from dsc_brain import automation_rules as ar

    clock = {"now": 1_000_000.0, "hm": (12, 0)}
    monkeypatch.setattr(ar, "_now", lambda: clock["now"])
    monkeypatch.setattr(ar, "_local_hm", lambda now: clock["hm"])
    monkeypatch.setattr(ar, "_computed_states", lambda fleet, inv: {})
    # Fresh fleet each test (module-level singleton).
    from dsc_brain.fleet_state import FleetState, update_fleet_state

    update_fleet_state(FleetState())
    return ar, clock


@pytest.fixture()
def service_calls(monkeypatch: pytest.MonkeyPatch) -> list[tuple[str, str, dict[str, Any]]]:
    calls: list[tuple[str, str, dict[str, Any]]] = []

    async def fake_proxy(domain: str, service: str, data: dict[str, Any]) -> dict[str, Any]:
        calls.append((domain, service, dict(data)))
        return {"entity_id": data.get("entity_id"), "state": "ok"}

    monkeypatch.setattr("dsc_brain.control_ops.call_service_proxy", fake_proxy)
    return calls


# ------------------------------------------------------------ normalization


def test_v1_flat_trigger_loads_as_single_all_group(engine) -> None:
    ar, _ = engine
    saved = ar.save_automation_rules([_rule()])
    assert saved[0]["trigger"] == {"all": [{"entity_id": TEMP, "op": "gt", "value": 30.0}]}
    assert saved[0]["window"] is None
    assert saved[0]["debounce_s"] == 0.0 and saved[0]["release_s"] == 0.0
    # and it still evaluates exactly like v1
    _fleet(temp_c=33.0)
    assert ar.evaluate_automation_rules()["rules"][0]["firing"] is True
    assert _has_banner("hot_tent")


def test_group_validation(engine) -> None:
    ar, _ = engine
    with pytest.raises(ValueError):
        ar.save_automation_rules([_rule(trigger={"all": []})])
    with pytest.raises(ValueError):
        ar.save_automation_rules([_rule(trigger={"all": [{"entity_id": TEMP, "op": "gt", "value": 1}], "any": []})])
    with pytest.raises(ValueError, match="nested"):
        ar.save_automation_rules([_rule(trigger={"all": [{"any": [{"entity_id": TEMP, "op": "gt", "value": 1}]}]})])
    with pytest.raises(ValueError, match="hysteresis"):
        ar.save_automation_rules([_rule(trigger={"entity_id": TEMP, "op": "eq", "value": "x", "hysteresis": 1})])
    with pytest.raises(ValueError, match="max_age_s"):
        ar.save_automation_rules([_rule(trigger={"entity_id": TEMP, "op": "gt", "value": 1, "max_age_s": 0})])
    with pytest.raises(ValueError, match="HH:MM"):
        ar.save_automation_rules([_rule(window={"start": "25:00", "end": "06:00"})])
    with pytest.raises(ValueError, match="debounce_s"):
        ar.save_automation_rules([_rule(debounce_s=-1)])


def test_all_group_requires_every_condition(engine) -> None:
    ar, _ = engine
    ar.save_automation_rules(
        [
            _rule(
                trigger={
                    "all": [
                        {"entity_id": TEMP, "op": "gt", "value": 30},
                        {"entity_id": RH, "op": "gte", "value": 70},
                    ]
                }
            )
        ]
    )
    _fleet(temp_c=33.0, rh=50.0)
    assert ar.evaluate_automation_rules()["rules"][0]["firing"] is False
    _fleet(temp_c=33.0, rh=75.0)
    assert ar.evaluate_automation_rules()["rules"][0]["firing"] is True
    # one condition losing its evidence blocks the whole all-group (fail closed)
    _fleet(temp_c=33.0, rh=None)
    assert ar.evaluate_automation_rules()["rules"][0]["firing"] is False
    assert not _has_banner("hot_tent")


def test_any_group_tolerates_missing_input(engine) -> None:
    ar, _ = engine
    ar.save_automation_rules(
        [
            _rule(
                trigger={
                    "any": [
                        {"entity_id": "sensor.dsc_missing_thing", "op": "gt", "value": 1},
                        {"entity_id": TEMP, "op": "gt", "value": 30},
                    ]
                }
            )
        ]
    )
    _fleet(temp_c=33.0)
    assert ar.evaluate_automation_rules()["rules"][0]["firing"] is True
    _fleet(temp_c=20.0)
    assert ar.evaluate_automation_rules()["rules"][0]["firing"] is False


# ----------------------------------------------------------------- windows


def test_window_gates_firing(engine) -> None:
    ar, clock = engine
    ar.save_automation_rules([_rule(window={"start": "09:00", "end": "17:00"})])
    _fleet(temp_c=33.0)
    clock["hm"] = (8, 59)
    assert ar.evaluate_automation_rules()["rules"][0]["firing"] is False
    clock["hm"] = (9, 0)
    assert ar.evaluate_automation_rules()["rules"][0]["firing"] is True
    clock["hm"] = (17, 0)  # end is exclusive → clears
    assert ar.evaluate_automation_rules()["rules"][0]["firing"] is False
    assert not _has_banner("hot_tent")


def test_window_wraps_past_midnight(engine) -> None:
    ar, clock = engine
    ar.save_automation_rules([_rule(window={"start": "22:00", "end": "06:00"})])
    _fleet(temp_c=33.0)
    for hm, expect in (((21, 59), False), ((22, 0), True), ((23, 30), True), ((0, 0), True), ((5, 59), True), ((6, 0), False), ((12, 0), False)):
        clock["hm"] = hm
        assert ar.evaluate_automation_rules()["rules"][0]["firing"] is expect, hm


# ------------------------------------------------------- debounce / release


def test_debounce_requires_continuous_hold(engine) -> None:
    ar, clock = engine
    ar.save_automation_rules([_rule(debounce_s=30)])
    _fleet(temp_c=33.0)
    out = ar.evaluate_automation_rules()["rules"][0]
    assert out["firing"] is False and out["pending"] is True
    clock["now"] += 10
    assert ar.evaluate_automation_rules()["rules"][0]["firing"] is False
    # condition drops → pending timer resets
    _fleet(temp_c=20.0)
    out = ar.evaluate_automation_rules()["rules"][0]
    assert out["firing"] is False and out["pending"] is False
    _fleet(temp_c=33.0)
    clock["now"] += 25
    assert ar.evaluate_automation_rules()["rules"][0]["firing"] is False  # only 0 s held since reset
    clock["now"] += 30
    assert ar.evaluate_automation_rules()["rules"][0]["firing"] is True
    assert _has_banner("hot_tent")


def test_release_holds_effect_until_clear_persists(engine) -> None:
    ar, clock = engine
    ar.save_automation_rules([_rule(release_s=60)])
    _fleet(temp_c=33.0)
    assert ar.evaluate_automation_rules()["rules"][0]["firing"] is True
    _fleet(temp_c=20.0)
    out = ar.evaluate_automation_rules()["rules"][0]
    assert out["firing"] is True and out["releasing"] is True
    assert _has_banner("hot_tent")
    # bounces back true → release timer cancelled
    _fleet(temp_c=33.0)
    clock["now"] += 40
    out = ar.evaluate_automation_rules()["rules"][0]
    assert out["firing"] is True and out["releasing"] is False
    _fleet(temp_c=20.0)
    clock["now"] += 30
    assert ar.evaluate_automation_rules()["rules"][0]["firing"] is True  # 0 s since new release start
    clock["now"] += 60
    assert ar.evaluate_automation_rules()["rules"][0]["firing"] is False
    assert not _has_banner("hot_tent")


# -------------------------------------------------------------- hysteresis


def test_hysteresis_latches_until_crossed_back(engine) -> None:
    ar, _ = engine
    ar.save_automation_rules([_rule(trigger={"entity_id": TEMP, "op": "gt", "value": 30, "hysteresis": 2})])
    _fleet(temp_c=29.0)
    assert ar.evaluate_automation_rules()["rules"][0]["firing"] is False  # not latched: needs > 30
    _fleet(temp_c=30.5)
    assert ar.evaluate_automation_rules()["rules"][0]["firing"] is True
    _fleet(temp_c=29.0)
    assert ar.evaluate_automation_rules()["rules"][0]["firing"] is True  # latched: > 28 still holds
    _fleet(temp_c=28.0)
    assert ar.evaluate_automation_rules()["rules"][0]["firing"] is False  # crossed back by margin
    assert not _has_banner("hot_tent")


def test_hysteresis_for_lt(engine) -> None:
    ar, _ = engine
    ar.save_automation_rules([_rule(trigger={"entity_id": TEMP, "op": "lt", "value": 18, "hysteresis": 1.5})])
    _fleet(temp_c=17.0)
    assert ar.evaluate_automation_rules()["rules"][0]["firing"] is True
    _fleet(temp_c=19.0)
    assert ar.evaluate_automation_rules()["rules"][0]["firing"] is True  # < 19.5 still latched
    _fleet(temp_c=19.5)
    assert ar.evaluate_automation_rules()["rules"][0]["firing"] is False


# ----------------------------------------------------------------- max age


def test_max_age_fails_closed_on_stale_reading(engine) -> None:
    ar, clock = engine
    ar.save_automation_rules([_rule(trigger={"entity_id": TEMP, "op": "gt", "value": 30, "max_age_s": 120})])
    _fleet(temp_c=33.0, last_seen=clock["now"] - 10)
    assert ar.evaluate_automation_rules()["rules"][0]["firing"] is True
    _fleet(temp_c=33.0, last_seen=clock["now"] - 300)
    assert ar.evaluate_automation_rules()["rules"][0]["firing"] is False
    assert not _has_banner("hot_tent")


def test_max_age_unsatisfiable_without_timestamp(engine) -> None:
    ar, _ = engine
    assert ar.timestamp_source("sensor.dsc_cfm_exhaust_out") is None
    assert ar.timestamp_source(TEMP) == "hub"
    assert ar.timestamp_source("sensor.dsc_probe1_soil_moisture") == "probe"
    ar.save_automation_rules(
        [_rule(trigger={"entity_id": TEMP, "op": "gt", "value": 30, "max_age_s": 3600})]
    )
    from dsc_brain.fleet_state import get_fleet_state

    _fleet(temp_c=33.0)
    get_fleet_state().hub.last_seen = None  # no timestamp at all
    assert ar.evaluate_automation_rules()["rules"][0]["firing"] is False


def test_probe_max_age_uses_probe_last_seen(engine) -> None:
    ar, clock = engine
    from dsc_brain.fleet_state import SeatState, get_fleet_state, update_fleet_state

    f = get_fleet_state()
    f.hub.online = True
    f.pots["pot1"] = SeatState("pot1", True, None, {"moisture_pct": 12.0}, clock["now"] - 5)
    update_fleet_state(f)
    ar.save_automation_rules(
        [_rule(id="dry", trigger={"entity_id": "sensor.dsc_probe1_soil_moisture", "op": "lt", "value": 20, "max_age_s": 60})]
    )
    assert ar.evaluate_automation_rules()["rules"][0]["firing"] is True
    f.pots["pot1"].last_seen = clock["now"] - 600
    update_fleet_state(f)
    assert ar.evaluate_automation_rules()["rules"][0]["firing"] is False


# ------------------------------------------------------- computed entities


def test_computed_entity_condition(engine, monkeypatch: pytest.MonkeyPatch) -> None:
    ar, _ = engine
    built: list[int] = []

    def fake_computed(fleet, inv):
        built.append(1)
        return {"sensor.dsc_cfm_exhaust_out": {"entity_id": "sensor.dsc_cfm_exhaust_out", "state": "42.5", "attributes": {}}}

    monkeypatch.setattr(ar, "_computed_states", fake_computed)
    ar.save_automation_rules(
        [_rule(id="low_cfm", trigger={"entity_id": "sensor.dsc_cfm_exhaust_out", "op": "lt", "value": 50})]
    )
    _fleet(temp_c=25.0)
    assert ar.evaluate_automation_rules()["rules"][0]["firing"] is True
    assert built  # computed view was consulted


def test_computed_view_not_built_when_raw_suffices(engine, monkeypatch: pytest.MonkeyPatch) -> None:
    ar, _ = engine
    built: list[int] = []
    monkeypatch.setattr(ar, "_computed_states", lambda f, i: built.append(1) or {})
    ar.save_automation_rules([_rule()])
    _fleet(temp_c=25.0)
    ar.evaluate_automation_rules()
    assert not built


# ------------------------------------------------------------------ relays


def test_relay_target_allow_list_enforced_at_save(engine) -> None:
    ar, _ = engine
    with pytest.raises(ValueError, match="not allowed"):
        ar.save_automation_rules(
            [_rule(action={"type": "relay", "params": {"entity_id": "switch.dsc_hub_heater_demand", "on_when_firing": True}})]
        )
    with pytest.raises(ValueError, match="not allowed"):
        ar.save_automation_rules([_rule(action={"type": "relay", "params": {}})])
    # sonoff relays: cut-out only
    with pytest.raises(ValueError, match="only hold it OFF"):
        ar.save_automation_rules(
            [_rule(action={"type": "relay", "params": {"entity_id": "switch.dsc_heater_main_relay", "on_when_firing": True}})]
        )
    ok = ar.save_automation_rules(
        [_rule(action={"type": "relay", "params": {"entity_id": "switch.dsc_heater_main_relay", "on_when_firing": False}})]
    )
    assert ok[0]["action"]["params"] == {"entity_id": "switch.dsc_heater_main_relay", "on_when_firing": False}


def test_hub_relay_fires_and_restores_previous_state(engine, service_calls) -> None:
    ar, _ = engine
    eid = "switch.dsc_hub_manual_light_hold"
    ar.save_automation_rules([_rule(id="hold_light", action={"type": "relay", "params": {"entity_id": eid, "on_when_firing": True}})])
    f = _fleet(temp_c=33.0)
    f.hub.values["controls"] = {eid: {"state": "off"}}
    out = ar.evaluate_automation_rules()["rules"][0]
    assert out["firing"] is True and out["last_error"] is None
    assert service_calls == [("switch", "turn_on", {"entity_id": eid})]

    _fleet(temp_c=20.0)
    assert ar.evaluate_automation_rules()["rules"][0]["firing"] is False
    assert service_calls[-1] == ("switch", "turn_off", {"entity_id": eid})


def test_hub_relay_restore_honours_prior_on(engine, service_calls) -> None:
    ar, _ = engine
    eid = "switch.dsc_hub_manual_takeover"
    ar.save_automation_rules([_rule(id="take", action={"type": "relay", "params": {"entity_id": eid, "on_when_firing": True}})])
    f = _fleet(temp_c=33.0)
    f.hub.values["controls"] = {eid: {"state": "on"}}  # operator already had it on
    ar.evaluate_automation_rules()
    _fleet(temp_c=20.0)
    ar.evaluate_automation_rules()
    assert service_calls[-1] == ("switch", "turn_on", {"entity_id": eid})  # restored to prior ON, not blindly OFF


def test_sonoff_cutout_oos_seat_and_restores(engine, service_calls, monkeypatch: pytest.MonkeyPatch) -> None:
    ar, _ = engine
    from dsc_brain.settings import list_inventory, upsert_inventory

    resync: list[tuple[str, bool]] = []
    monkeypatch.setattr("dsc_brain.appliance_driver.force_set_sonoff_relay_sync", lambda s, on: resync.append((s, on)))
    upsert_inventory("humidifier", {"in_service": True, "role": "sonoff_humidifier"}, create=True)
    eid = "switch.dsc_humidifier_main_relay"
    ar.save_automation_rules(
        [_rule(id="wet_cut", action={"type": "relay", "params": {"entity_id": eid, "on_when_firing": False}})]
    )
    _fleet(temp_c=33.0)
    ar.evaluate_automation_rules()
    assert ("switch", "turn_off", {"entity_id": eid}) in service_calls
    row = next(r for r in list_inventory() if r["seat_id"] == "humidifier")
    assert row["in_service"] is False
    assert _has_banner("wet_cut")

    _fleet(temp_c=20.0)
    ar.evaluate_automation_rules()
    row = next(r for r in list_inventory() if r["seat_id"] == "humidifier")
    assert row["in_service"] is True
    assert resync == [("humidifier", False)]  # handed back to the appliance driver
    assert not _has_banner("wet_cut")
    # never a turn_on on a sonoff relay from the rule engine
    assert not any(c[1] == "turn_on" for c in service_calls)


# --------------------------------------------------------------- setpoints


def test_setpoint_allow_list_and_clamp_at_save(engine) -> None:
    ar, _ = engine
    with pytest.raises(ValueError, match="not allowed"):
        ar.save_automation_rules(
            [_rule(action={"type": "setpoint", "params": {"entity_id": "number.dsc_hub_sunrise_duration", "value": 5}})]
        )
    with pytest.raises(ValueError, match="numeric"):
        ar.save_automation_rules(
            [_rule(action={"type": "setpoint", "params": {"entity_id": "number.dsc_hub_target_temp", "value": "hot"}})]
        )
    saved = ar.save_automation_rules(
        [_rule(action={"type": "setpoint", "params": {"entity_id": "number.dsc_hub_target_temp", "value": 45}})]
    )
    assert saved[0]["action"]["params"]["value"] == 32.0  # ESP max
    saved = ar.save_automation_rules(
        [_rule(action={"type": "setpoint", "params": {"entity_id": "number.dsc_hub_vpd_target_min", "value": 0.01}})]
    )
    assert saved[0]["action"]["params"]["value"] == 0.4  # ESP min
    assert ar.clamp_setpoint("number.dsc_hub_target_temp", 24.3) == 24.5  # step 0.5


def test_setpoint_writes_clamped_and_restores(engine, service_calls) -> None:
    ar, _ = engine
    eid = "number.dsc_hub_target_temp"
    ar.save_automation_rules([_rule(id="cool_down", action={"type": "setpoint", "params": {"entity_id": eid, "value": 22}})])
    f = _fleet(temp_c=33.0)
    f.hub.values["controls"] = {eid: {"state": "26.0"}}
    out = ar.evaluate_automation_rules()["rules"][0]
    assert out["firing"] is True
    assert service_calls == [("number", "set_value", {"entity_id": eid, "value": 22.0})]
    _fleet(temp_c=20.0)
    ar.evaluate_automation_rules()
    assert service_calls[-1] == ("number", "set_value", {"entity_id": eid, "value": 26.0})


def test_setpoint_no_restore_when_disabled_or_unknown(engine, service_calls) -> None:
    ar, _ = engine
    eid = "number.dsc_hub_rh_target_max"
    ar.save_automation_rules(
        [_rule(id="rh_cap", action={"type": "setpoint", "params": {"entity_id": eid, "value": 60, "restore_on_clear": False}})]
    )
    f = _fleet(temp_c=33.0)
    f.hub.values["controls"] = {eid: {"state": "70"}}
    ar.evaluate_automation_rules()
    _fleet(temp_c=20.0)
    ar.evaluate_automation_rules()
    assert len(service_calls) == 1  # fire only, no restore


def test_setpoint_skipped_while_follow_plants_owns_clone_numbers(engine, service_calls) -> None:
    ar, _ = engine
    eid = "number.dsc_hub_clone_target_temp"
    ar.save_automation_rules([_rule(id="clone_cool", action={"type": "setpoint", "params": {"entity_id": eid, "value": 20}})])
    f = _fleet(temp_c=33.0)
    f.hub.values["controls"] = {eid: {"state": "24"}, "select.dsc_hub_clone_mode": {"state": "Follow Plants"}}
    out = ar.evaluate_automation_rules()["rules"][0]
    assert out["firing"] is True
    assert "Follow Plants" in str(out["last_error"])
    assert service_calls == []
    _fleet(temp_c=20.0)
    ar.evaluate_automation_rules()
    assert service_calls == []  # nothing written → nothing restored


# ------------------------------------------------------------- robustness


def test_evaluator_never_raises_when_write_fails(engine, monkeypatch: pytest.MonkeyPatch) -> None:
    ar, _ = engine

    async def boom(domain, service, data):
        raise RuntimeError("hub host not configured")

    monkeypatch.setattr("dsc_brain.control_ops.call_service_proxy", boom)
    ar.save_automation_rules(
        [
            _rule(id="r1", action={"type": "relay", "params": {"entity_id": "switch.dsc_hub_manual_light_hold", "on_when_firing": True}}),
            _rule(id="r2", action={"type": "setpoint", "params": {"entity_id": "number.dsc_hub_target_temp", "value": 20}}),
        ]
    )
    _fleet(temp_c=33.0)
    out = ar.evaluate_automation_rules()
    assert [r["firing"] for r in out["rules"]] == [True, True]
    assert all("failed" in str(r["last_error"]) for r in out["rules"])
    _fleet(temp_c=20.0)
    out = ar.evaluate_automation_rules()  # clear path also swallows the failure
    assert [r["firing"] for r in out["rules"]] == [False, False]


def test_targets_endpoint_shape(engine) -> None:
    ar, _ = engine
    t = ar.automation_targets()
    relays = {r["entity_id"]: r for r in t["relays"]}
    assert "switch.dsc_hub_heater_demand" not in relays  # loop-owned, never offered
    assert relays["switch.dsc_heater_main_relay"]["cutout_only"] is True
    assert relays["switch.dsc_hub_manual_takeover"]["cutout_only"] is False
    sps = {s["entity_id"]: s for s in t["setpoints"]}
    assert sps["number.dsc_hub_target_temp"]["min"] == 15.0 and sps["number.dsc_hub_target_temp"]["max"] == 32.0
    assert sps["number.dsc_hub_clone_rh_min"]["pi_owned_when"] == "follow_plants"
    assert "sensor.dsc_hub_" in t["age_prefixes"]


def test_put_rejects_disallowed_target_with_400(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", temp_db)
    from fastapi.testclient import TestClient

    from dsc_brain.api import app

    with TestClient(app) as client:
        resp = client.put(
            "/settings/automations",
            json={"rules": [_rule(action={"type": "relay", "params": {"entity_id": "switch.dsc_hub_ac_demand", "on_when_firing": True}})]},
        )
        assert resp.status_code == 400
        assert "not allowed" in resp.json()["detail"]
        resp = client.get("/settings/automations/targets")
        assert resp.status_code == 200
        assert any(r["entity_id"] == "switch.dsc_hub_manual_light_hold" for r in resp.json()["relays"])


def test_deleting_firing_relay_rule_restores(engine, service_calls) -> None:
    ar, _ = engine
    eid = "switch.dsc_hub_tent_manual_override"
    ar.save_automation_rules([_rule(id="ovr", action={"type": "relay", "params": {"entity_id": eid, "on_when_firing": True}})])
    f = _fleet(temp_c=33.0)
    f.hub.values["controls"] = {eid: {"state": "off"}}
    ar.evaluate_automation_rules()
    ar.save_automation_rules([])
    assert service_calls[-1] == ("switch", "turn_off", {"entity_id": eid})
