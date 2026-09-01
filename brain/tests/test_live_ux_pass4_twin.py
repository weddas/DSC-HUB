# brain/tests/test_live_ux_pass4_twin.py
"""Pass 4 Phase A — Twin hybrid Got + history ingest guards."""

from __future__ import annotations

import time
from pathlib import Path
from types import SimpleNamespace

import pytest

from dsc_brain.computed_ops import _hub_values_for_light_loop
from dsc_brain.esphome_client import _record_hub_chart_history
from dsc_brain.history_ops import ENTITY_METRIC_MAP, query_entity_history
from dsc_brain.runtime_history import HistoryMemo, RuntimeMemo
from dsc_brain.settings import record_history


def _point_db(monkeypatch: pytest.MonkeyPatch, temp_db: Path) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", temp_db)
    monkeypatch.setattr("dsc_brain.paths.DEFAULT_DB", temp_db)


def _fleet(*, twin: dict | None = None, extras: dict | None = None) -> SimpleNamespace:
    controls: dict = {}
    if twin is not None:
        controls["light.dsc_hub_twin_sf1000"] = twin
    if extras:
        controls.update(extras)
    hub = SimpleNamespace(values={"controls": controls, "sensors": {}})
    return SimpleNamespace(hub=hub)


def test_got_hours_4x8_prefers_twin_when_available_and_healthy(
    temp_db: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    _point_db(monkeypatch, temp_db)
    midnight = time.time() - 7200.0
    # Twin on for 1h; window only open 0.25h — hybrid must pick Twin.
    record_history("hub", "twin_sf1000_on", 1.0, midnight + 60, temp_db)
    record_history("hub", "twin_sf1000_on", 1.0, midnight + 3660, temp_db)
    record_history("hub", "twin_sf1000_on", 0.0, midnight + 3661, temp_db)
    record_history("hub", "window_4x8_open", 1.0, midnight + 60, temp_db)
    record_history("hub", "window_4x8_open", 0.0, midnight + 960, temp_db)

    runtime = RuntimeMemo(history=HistoryMemo(), midnight=midnight)
    out = _hub_values_for_light_loop(
        _fleet(twin={"state": "on", "brightness": 200}),
        runtime,
    )
    twin_h = runtime.hours_today("hub", "twin_sf1000_on")
    window_h = runtime.hours_today("hub", "window_4x8_open")
    assert twin_h > window_h
    assert out["got_hours_4x8"] == twin_h
    assert out.get("got_hours_4x8_source") == "twin"


def test_got_hours_4x8_falls_back_to_window_without_twin(
    temp_db: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    _point_db(monkeypatch, temp_db)
    midnight = time.time() - 3600.0
    record_history("hub", "window_4x8_open", 1.0, midnight + 10, temp_db)
    record_history("hub", "window_4x8_open", 0.0, midnight + 1810, temp_db)

    runtime = RuntimeMemo(history=HistoryMemo(), midnight=midnight)
    out = _hub_values_for_light_loop(_fleet(twin=None), runtime)
    assert out["got_hours_4x8"] == runtime.hours_today("hub", "window_4x8_open")
    assert out.get("got_hours_4x8_source") == "window"


def test_got_hours_4x8_falls_back_when_twin_history_unhealthy(
    temp_db: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    _point_db(monkeypatch, temp_db)
    midnight = time.time() - 3600.0
    # Twin entity present but no on/brightness samples today → window.
    record_history("hub", "window_4x8_open", 1.0, midnight + 10, temp_db)
    record_history("hub", "window_4x8_open", 1.0, midnight + 100, temp_db)

    runtime = RuntimeMemo(history=HistoryMemo(), midnight=midnight)
    out = _hub_values_for_light_loop(
        _fleet(twin={"state": "off", "brightness": 0}),
        runtime,
    )
    assert out["got_hours_4x8"] == runtime.hours_today("hub", "window_4x8_open")
    assert out.get("got_hours_4x8_source") == "window"


def test_got_hours_4x8_rejects_unavailable_twin_entity(
    temp_db: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    _point_db(monkeypatch, temp_db)
    midnight = time.time() - 3600.0
    record_history("hub", "twin_sf1000_on", 1.0, midnight + 10, temp_db)
    record_history("hub", "window_4x8_open", 1.0, midnight + 10, temp_db)

    runtime = RuntimeMemo(history=HistoryMemo(), midnight=midnight)
    out = _hub_values_for_light_loop(
        _fleet(twin={"state": "unavailable"}),
        runtime,
    )
    assert out["got_hours_4x8"] == runtime.hours_today("hub", "window_4x8_open")
    assert out.get("got_hours_4x8_source") == "window"


def test_twin_history_ingest_records_on_and_brightness(
    temp_db: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    _point_db(monkeypatch, temp_db)
    now = time.time()
    _record_hub_chart_history(
        {
            "light.dsc_hub_twin_sf1000": {"state": "on", "brightness": 128},
        },
        {},
        now,
    )
    from dsc_brain.settings import list_history

    on_rows = list_history("hub", "twin_sf1000_on", now - 10, db_path=temp_db)
    bri_rows = list_history("hub", "twin_sf1000_brightness", now - 10, db_path=temp_db)
    assert on_rows and float(on_rows[0]["value"]) == 1.0
    assert bri_rows and float(bri_rows[0]["value"]) > 0.5


def test_twin_history_ingest_off_is_zero(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    _point_db(monkeypatch, temp_db)
    now = time.time()
    _record_hub_chart_history(
        {"light.dsc_hub_twin_sf1000": {"state": "off", "brightness": 0}},
        {},
        now,
    )
    from dsc_brain.settings import list_history

    on_rows = list_history("hub", "twin_sf1000_on", now - 10, db_path=temp_db)
    bri_rows = list_history("hub", "twin_sf1000_brightness", now - 10, db_path=temp_db)
    assert on_rows and float(on_rows[0]["value"]) == 0.0
    assert bri_rows and float(bri_rows[0]["value"]) == 0.0


def test_history_ops_maps_twin_to_on_metric_for_dutystrip() -> None:
    assert ENTITY_METRIC_MAP["light.dsc_hub_twin_sf1000"] == ("hub", "twin_sf1000_on")


def test_query_entity_history_returns_twin_on_series(
    temp_db: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    _point_db(monkeypatch, temp_db)
    now = time.time()
    record_history("hub", "twin_sf1000_on", 1.0, now - 30, temp_db)
    record_history("hub", "twin_sf1000_on", 0.0, now - 5, temp_db)
    pts = query_entity_history("light.dsc_hub_twin_sf1000", hours=1.0)
    assert len(pts) >= 2
    assert all("t" in p and "v" in p for p in pts)
    assert pts[-1]["v"] in (0.0, 1.0)
