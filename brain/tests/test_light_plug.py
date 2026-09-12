"""Lamp-on-a-plug driver — intent, the holds, and the drift re-assert.

No network and no Tuya lane: ``tuya_role_rows`` and ``set_tuya_state`` are patched, so
these tests are about the decision, not the transport.
"""

from __future__ import annotations

import datetime
import time
from typing import Any

import pytest

from dsc_brain import light_plug
from dsc_brain.fleet_state import FleetState, SeatState

ROLE = "plug_light_4x8"
WINDOW = "binary_sensor.dsc_hub_4x8_window_open"
DEVICE = "bf0123456789abcdef"


def make_fleet(
    *,
    window: bool | None = True,
    online: bool = True,
    age_s: float = 5.0,
    clock_valid: bool = True,
    failsafe: bool = False,
    auto_photoperiod: str = "on",
    takeover: str = "off",
    now: float | None = None,
) -> FleetState:
    now = time.time() if now is None else now
    binaries: dict[str, Any] = {
        "binary_sensor.dsc_hub_clock_valid": clock_valid,
        "binary_sensor.dsc_hub_emergency_failsafe": failsafe,
    }
    if window is not None:
        binaries[WINDOW] = window
    hub = SeatState(
        "hub",
        online=online,
        values={
            "binaries": binaries,
            "controls": {
                "switch.dsc_hub_auto_photoperiod": {"state": auto_photoperiod},
                "switch.dsc_hub_manual_takeover": {"state": takeover},
            },
        },
        last_seen=now - age_s,
    )
    state = FleetState()
    state.hub = hub
    return state


@pytest.fixture(autouse=True)
def _clean() -> Any:
    light_plug.reset_state()
    yield
    light_plug.reset_state()


@pytest.fixture
def lane(monkeypatch: pytest.MonkeyPatch) -> dict[str, Any]:
    """Patched Tuya surface: one bound lamp plug, recording every write."""
    box: dict[str, Any] = {"row": {"device_id": DEVICE, "link": "live", "state": False}, "writes": []}

    def role_rows() -> dict[str, dict[str, Any]]:
        return {ROLE: dict(box["row"])} if box["row"] is not None else {}

    def set_state(device_id: str, on: bool) -> dict[str, Any]:
        box["writes"].append((device_id, on))
        return {"ok": True, "device_id": device_id}

    import dsc_brain.tuya_local as tuya_local

    monkeypatch.setattr(tuya_local, "tuya_role_rows", role_rows)
    monkeypatch.setattr(tuya_local, "set_tuya_state", set_state)
    return box


# ----------------------------------------------------------------- intent


def test_window_open_turns_the_lamp_on(lane: dict[str, Any]) -> None:
    out = light_plug.tick_lamp_plugs(make_fleet(window=True))
    assert lane["writes"] == [(DEVICE, True)]
    assert out["acted"][0]["why"] == "window"


def test_window_closed_turns_the_lamp_off(lane: dict[str, Any]) -> None:
    light_plug.tick_lamp_plugs(make_fleet(window=False))
    assert lane["writes"] == [(DEVICE, False)]


def test_unchanged_intent_does_not_rewrite_every_tick(lane: dict[str, Any]) -> None:
    fleet = make_fleet(window=True)
    light_plug.tick_lamp_plugs(fleet)
    lane["row"]["state"] = True
    for _ in range(5):
        light_plug.tick_lamp_plugs(fleet)
    assert lane["writes"] == [(DEVICE, True)], "a steady window must not spam the plug"


def test_unbound_role_does_nothing(lane: dict[str, Any]) -> None:
    lane["row"] = None
    light_plug.tick_lamp_plugs(make_fleet(window=True))
    assert lane["writes"] == []


# ----------------------------------------------------------------- the holds


@pytest.mark.parametrize(
    ("kwargs", "fragment"),
    [
        ({"online": False}, "offline"),
        ({"age_s": 600.0}, "stale"),
        ({"clock_valid": False}, "clock invalid"),
        ({"takeover": "on"}, "takeover"),
        ({"auto_photoperiod": "off"}, "auto photoperiod off"),
        ({"window": None}, "does not report"),
    ],
)
def test_unknown_state_holds_rather_than_guessing(
    lane: dict[str, Any], kwargs: dict[str, Any], fragment: str
) -> None:
    out = light_plug.tick_lamp_plugs(make_fleet(**kwargs))
    assert lane["writes"] == [], f"{fragment}: must not command"
    assert fragment in out["held"][0]["reason"]


def test_emergency_failsafe_forces_off_rather_than_holding(lane: dict[str, Any]) -> None:
    lane["row"]["state"] = True
    light_plug.tick_lamp_plugs(make_fleet(window=True, failsafe=True))
    assert lane["writes"] == [(DEVICE, False)]


def test_a_hold_does_not_erase_intent(lane: dict[str, Any]) -> None:
    """Hub blips out and back; the lamp must not be re-commanded on recovery."""
    fleet_on = make_fleet(window=True)
    light_plug.tick_lamp_plugs(fleet_on)
    lane["row"]["state"] = True
    light_plug.tick_lamp_plugs(make_fleet(online=False))
    light_plug.tick_lamp_plugs(fleet_on)
    assert lane["writes"] == [(DEVICE, True)]


# ----------------------------------------------------------------- drift


def test_drift_is_re_asserted_against_what_the_plug_reports(lane: dict[str, Any]) -> None:
    now = time.time()
    light_plug.tick_lamp_plugs(make_fleet(window=True, now=now), now=now)
    lane["row"]["state"] = True
    # Someone switched it at the wall; the plug now reports off.
    lane["row"]["state"] = False
    light_plug.tick_lamp_plugs(make_fleet(window=True, now=now + 10), now=now + 10)
    assert lane["writes"] == [(DEVICE, True)], "too soon to re-assert"

    later = now + light_plug.REASSERT_S + 1
    out = light_plug.tick_lamp_plugs(make_fleet(window=True, now=later), now=later)
    assert lane["writes"] == [(DEVICE, True), (DEVICE, True)]
    assert out["acted"][0]["why"] == "drift"


def test_offline_plug_is_not_treated_as_drift(lane: dict[str, Any]) -> None:
    now = time.time()
    light_plug.tick_lamp_plugs(make_fleet(window=True, now=now), now=now)
    lane["row"]["link"] = "offline"
    lane["row"]["state"] = False
    later = now + light_plug.REASSERT_S + 1
    light_plug.tick_lamp_plugs(make_fleet(window=True, now=later), now=later)
    assert lane["writes"] == [(DEVICE, True)], "an offline plug reports nothing to disagree with"


# ----------------------------------------------------------------- status


def test_status_always_flags_the_missing_failsafe(lane: dict[str, Any], monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(light_plug, "get_fleet_state", lambda: make_fleet(window=True))
    lamps = {row["role"]: row for row in light_plug.status()["lamps"]}
    assert lamps[ROLE]["bound"] is True
    assert lamps[ROLE]["needs_vendor_off_backstop"] is True
    assert lamps[ROLE]["want"] is True
    assert lamps["plug_light_2x4"]["bound"] is False


def test_lamp_roles_are_in_the_shared_role_catalogue() -> None:
    from dsc_brain.zigbee_mqtt import ZIGBEE_ROLE_CATALOG

    by_id = {str(r["id"]): r for r in ZIGBEE_ROLE_CATALOG}
    for role in light_plug.LAMP_ROLES:
        assert role in by_id, f"{role} must exist for a plug to bind to it"
        assert by_id[role]["kind"] == "plug", "lamp roles bind to plug-class devices"


# ----------------------------------------------------------------- the task: plateau


def _controls(lights_on="15:00:00", rise=30.0, fall=30.0):
    return {
        "time.dsc_hub_lights_on_time": {"state": lights_on},
        "number.dsc_hub_sunrise_duration": {"state": rise},
        "number.dsc_hub_sunset_duration": {"state": fall},
    }


def _at(hhmm: str) -> float:
    h, m = (int(x) for x in hhmm.split(":"))
    return datetime.datetime.now().replace(hour=h, minute=m, second=0, microsecond=0).timestamp()


# 12 h window: debt + delivered = target, which is how the driver recovers the length.
def _values(delivered_h: float, window_h: float = 12.0):
    return {"light_delivered_hours": delivered_h, "light_debt_hours": window_h - delivered_h}


@pytest.mark.parametrize(
    ("clock", "delivered", "on", "why"),
    [
        ("15:05", 0.08, False, "sunrise ramp"),      # 5 min in — dimmer owns the ramp
        ("15:29", 0.48, False, "sunrise ramp"),      # still ramping
        ("15:31", 0.52, True, "plateau"),            # ramp done — lamp joins
        ("20:00", 5.0, True, "plateau"),             # mid-window
        ("02:29", 11.48, True, "plateau"),           # 02:30 is the sunset edge — still plateau
        ("02:35", 11.58, False, "sunset ramp"),      # sunset started — lamp drops out
    ],
)
def test_plateau_keeps_the_ramp_shoulders_for_the_dimmable_fixture(clock, delivered, on, why):
    got, reason = light_plug.plateau_ok(_values(delivered), _controls(), _at(clock))
    assert got is on, f"{clock}: {reason}"
    assert why in reason


def test_plateau_falls_back_to_full_window_when_geometry_is_unknown():
    ok, reason = light_plug.plateau_ok({}, _controls(), _at("15:05"))
    assert ok is True and "unknown" in reason, "never withhold light over a missing number"


def test_full_mode_is_on_for_the_whole_window(lane):
    light_plug.tick_lamp_plugs(make_fleet(window=True))
    assert lane["writes"] == [(DEVICE, True)], "default task-less behaviour is unchanged"


# ----------------------------------------------------------------- the task: countdown


@pytest.fixture
def dps(monkeypatch: pytest.MonkeyPatch) -> list[tuple[str, int, object]]:
    """Record raw datapoint writes and give the plug a countdown datapoint."""
    writes: list[tuple[str, int, object]] = []
    import dsc_brain.tuya_local as tuya_local

    monkeypatch.setattr(tuya_local, "set_tuya_dp", lambda d, i, v: writes.append((d, i, v)) or {"ok": True})
    monkeypatch.setattr(light_plug, "_countdown_index", lambda _d: 2)
    return writes


def _params(**kw):
    base = {"window_mode": "full", "countdown_backup": "off", "countdown_margin_min": 15}
    base.update(kw)
    return base


def test_countdown_is_not_armed_unless_the_task_enables_it(lane, dps, monkeypatch):
    monkeypatch.setattr(light_plug, "task_params", lambda _d: _params())
    light_plug.tick_lamp_plugs(make_fleet(window=True))
    assert dps == [], "opt-in only"


def test_countdown_is_pushed_past_lights_off(lane, dps, monkeypatch):
    monkeypatch.setattr(light_plug, "task_params", lambda _d: _params(countdown_backup="on"))
    now = _at("20:00")
    fleet = make_fleet(window=True, now=now)
    fleet.hub.values["controls"].update(_controls())
    fleet.hub.values.update(_values(5.0))
    light_plug.tick_lamp_plugs(fleet, now=now)
    assert len(dps) == 1
    _dev, index, seconds = dps[0]
    # 5 h into a 12 h window = 7 h left, plus a 15 min margin.
    assert index == 2
    assert seconds == pytest.approx((7 * 60 + 15) * 60, abs=120)


def test_countdown_is_disarmed_when_the_lamp_should_be_off(lane, dps, monkeypatch):
    monkeypatch.setattr(light_plug, "task_params", lambda _d: _params(countdown_backup="on"))
    now = _at("20:00")
    fleet = make_fleet(window=True, now=now)
    fleet.hub.values["controls"].update(_controls())
    fleet.hub.values.update(_values(5.0))
    light_plug.tick_lamp_plugs(fleet, now=now)
    dps.clear()
    light_plug.tick_lamp_plugs(make_fleet(window=False, now=now + 1), now=now + 1)
    assert dps == [(DEVICE, 2, 0)], "a stale deadline must not cut a later window short"


def test_countdown_is_not_rewritten_every_tick(lane, dps, monkeypatch):
    monkeypatch.setattr(light_plug, "task_params", lambda _d: _params(countdown_backup="on"))
    now = _at("20:00")
    fleet = make_fleet(window=True, now=now)
    fleet.hub.values["controls"].update(_controls())
    fleet.hub.values.update(_values(5.0))
    for i in range(5):
        light_plug.tick_lamp_plugs(fleet, now=now + i * 2)
    assert len(dps) == 1


def test_recipe_is_invisible_to_the_sensor_evaluator():
    """The safety cut-outs must not try to run a time-triggered task."""
    from dsc_brain.zigbee_policies import get_recipe_catalog

    recipe = next(r for r in get_recipe_catalog() if r["id"] == light_plug.LAMP_RECIPE_ID)
    assert recipe.get("when") is None, "evaluate_device_policies bails on `not recipe.get('when')`"
    assert recipe.get("trigger") == "photoperiod"
