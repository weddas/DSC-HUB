# brain/tests/test_light_loop.py
from dsc_brain.light_loop import build_light_loop


def test_follow_4x8_inherits_main_schedule():
    snap = build_light_loop(
        helpers={
            "time.dsc_hub_lights_on_time": "18:00:00",
            "select.dsc_hub_clone_photoperiod": "Follow 4x8",
            "switch.dsc_hub_auto_photoperiod": "on",
            "number.dsc_hub_min_dark_hours": "12",
            "sensor.dsc_expected_light_hours": "12",
        },
        hub_values={"sf1000_on": True, "sf1000_brightness": 0.0},
        now_ts=0.0,
    )
    assert snap.clone_follows_main is True
    assert snap.schedule_valid is True
    assert snap.sf_on is True
    # brightness 0 with on=True must still be represented honestly in snapshot
    assert snap.sf_brightness == 0.0


def test_missing_main_on_time_invalidates_follow_schedule():
    snap = build_light_loop(
        helpers={
            "time.dsc_hub_lights_on_time": "",
            "select.dsc_hub_clone_photoperiod": "Follow 4x8",
            "switch.dsc_hub_auto_photoperiod": "on",
        },
        hub_values={},
        now_ts=0.0,
    )
    assert snap.schedule_valid is False
    assert "no schedule" in snap.honesty.lower() or "unset" in snap.honesty.lower()


def test_independent_clone_does_not_claim_follow():
    snap = build_light_loop(
        helpers={
            "time.dsc_hub_lights_on_time": "18:00:00",
            "select.dsc_hub_clone_photoperiod": "Independent",
            "number.dsc_hub_clone_light_hours": "18",
        },
        hub_values={},
        now_ts=0.0,
    )
    assert snap.clone_follows_main is False
