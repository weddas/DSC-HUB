"""History read path: whole-window bucketing, generic entity resolution, throttled writes."""

from __future__ import annotations

import time

import pytest

from dsc_brain import history_ops, settings
from dsc_brain.computed_history import record_computed_states
from dsc_brain.settings import (
    _LAST_RECORDED,
    connect,
    list_history_bucketed,
    record_history,
    record_history_throttled,
)


def bulk(db, seat, metric, rows):
    """Insert (ts, value) rows through one connection — record_history opens a connection per row."""
    conn = connect(db)
    conn.executemany(
        "INSERT INTO fleet_history(seat_id, metric, value, ts) VALUES(?, ?, ?, ?)",
        [(seat, metric, v, t) for t, v in rows],
    )
    conn.commit()
    conn.close()


@pytest.fixture
def db(tmp_path, monkeypatch):
    # connect(None) resolves the DB from DSC_DATA, so point the env at tmp — not just DEFAULT_DB.
    monkeypatch.setenv("DSC_DATA", str(tmp_path))
    path = tmp_path / "dsc_ops.sqlite3"
    monkeypatch.setattr(settings, "DEFAULT_DB", path)
    connect(path).close()
    _LAST_RECORDED.clear()
    return path


def test_bucketed_covers_the_whole_window(db):
    now = 1_800_000_000.0
    since = now - 7 * 24 * 3600
    # One sample a minute for a week — 10 080 rows, far more than any chart wants.
    bulk(db, "hub", "vpd_kpa", [(since + i * 60, 1.0 + (i % 60) / 100.0) for i in range(10_080)])
    pts = list_history_bucketed("hub", "vpd_kpa", since, max_points=336, until_ts=now, db_path=db)
    assert 300 <= len(pts) <= 336
    assert pts[0]["ts"] < since + 3600  # the first bucket sits at the start of the window …
    assert pts[-1]["ts"] > now - 3600  # … and the last at the end — not just the newest 2000 samples
    assert all(1.0 <= p["value"] <= 1.6 for p in pts)


def test_bucketed_returns_raw_when_short(db):
    now = 1_800_000_000.0
    for i in range(10):
        record_history("hub", "temp_c", 20.0 + i, now - 100 + i * 10, db)
    pts = list_history_bucketed("hub", "temp_c", now - 200, max_points=720, until_ts=now, db_path=db)
    assert [p["value"] for p in pts] == [20.0 + i for i in range(10)]


def test_bucketed_binary_stays_crisp(db):
    now = 1_800_000_000.0
    since = now - 3600
    bulk(db, "hub", "switch_dsc_hub_heater_demand", [(since + i, 1.0 if i >= 1800 else 0.0) for i in range(3600)])
    pts = list_history_bucketed("hub", "switch_dsc_hub_heater_demand", since, max_points=60, until_ts=now, db_path=db)
    assert set(p["value"] for p in pts) <= {0.0, 1.0}
    assert pts[0]["value"] == 0.0 and pts[-1]["value"] == 1.0


def test_resolve_generic_shapes():
    r = history_ops.resolve_entity_metric
    assert r("sensor.dsc_hub_vpd_kpa") == ("hub", "vpd_kpa")  # static map
    assert r("switch.dsc_hub_heater_demand") == ("hub", "switch_dsc_hub_heater_demand")
    assert r("switch.dsc_hub_manual_takeover") == ("hub", "switch_dsc_hub_manual_takeover")
    assert r("number.dsc_hub_vpd_target_min") == ("hub", "number_dsc_hub_vpd_target_min")
    assert r("binary_sensor.dsc_hub_light_catchup_active") == ("hub", "bin_dsc_hub_light_catchup_active")
    assert r("binary_sensor.dsc_hub_4x8_window_open") == ("hub", "window_4x8_open")  # static wins
    assert r("sensor.dsc_hub_dynamic_co2_ppm") == ("hub", "dynamic_co2_ppm")
    assert r("sensor.dsc_probe3_moisture_pct") == ("pot3", "moisture_pct")
    assert r("sensor.dsc_lights_on_today_4x8") == ("computed", "sensor.dsc_lights_on_today_4x8")
    assert r("binary_sensor.dsc_clone_dark_period_violation") == ("computed", "binary_sensor.dsc_clone_dark_period_violation")
    assert r("light.dsc_hub_sf1000_dimmer") == ("hub", "sf1000_on")
    assert r("input_number.dsc_cal_ppfd_100") is None
    assert r("") is None
    assert history_ops.is_tracked("sensor.dsc_hub_heartbeat")
    assert not history_ops.is_tracked("sensor.somebody_else")


def test_query_uses_resolver_and_buckets(db, monkeypatch):
    now = 1_800_000_000.0
    bulk(db, "hub", "switch_dsc_hub_heater_demand", [(now - 5000 + i, float(i % 2)) for i in range(5000)])
    pts = history_ops.query_entity_history("switch.dsc_hub_heater_demand", hours=2, max_points=100, now=now)
    assert 50 <= len(pts) <= 100
    assert all(set(p) == {"t", "v"} for p in pts)


def test_throttled_writes_on_change_or_heartbeat(db):
    t0 = 1_800_000_000.0
    assert record_history_throttled("hub", "number_dsc_hub_vpd_target_min", 1.2, t0, db_path=db)
    assert not record_history_throttled("hub", "number_dsc_hub_vpd_target_min", 1.2, t0 + 10, db_path=db)
    assert record_history_throttled("hub", "number_dsc_hub_vpd_target_min", 1.3, t0 + 20, db_path=db)
    assert not record_history_throttled("hub", "number_dsc_hub_vpd_target_min", 1.3, t0 + 200, db_path=db)
    assert record_history_throttled("hub", "number_dsc_hub_vpd_target_min", 1.3, t0 + 400, db_path=db)
    pts = list_history_bucketed("hub", "number_dsc_hub_vpd_target_min", t0 - 1, until_ts=t0 + 500, db_path=db)
    assert [p["value"] for p in pts] == [1.2, 1.3, 1.3]


def test_record_computed_states(db):
    states = {
        "sensor.dsc_lights_on_today_4x8": {"state": "3.25", "attributes": {}},
        "binary_sensor.dsc_clone_dark_period_violation": {"state": "off", "attributes": {}},
        "sensor.dsc_hub_grow_stage_text": {"state": "Flower", "attributes": {}},  # not numeric → skipped
        "select.dsc_hub_grow_stage": {"state": "Flower"},  # wrong domain → skipped
    }
    t0 = time.time()
    assert record_computed_states(states, now=t0) == 2
    assert record_computed_states(states, now=t0 + 5) == 0  # unchanged, inside heartbeat
    pts = history_ops.query_entity_history("sensor.dsc_lights_on_today_4x8", hours=1, now=t0 + 6)
    assert pts and pts[-1]["v"] == 3.25
