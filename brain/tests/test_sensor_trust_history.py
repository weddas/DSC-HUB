"""sensor_trust must tolerate sparse / null history values."""

from __future__ import annotations

from dsc_brain.sensor_trust import _moisture_rate_per_hour


def test_moisture_rate_skips_null_history_values(monkeypatch):
    rows = [
        {"ts": 1_000.0, "value": None},
        {"ts": 1_800.0, "value": 40.0},
        {"ts": 3_600.0, "value": 38.0},
    ]
    monkeypatch.setattr("dsc_brain.sensor_trust.list_history", lambda *_a, **_k: rows)
    rate = _moisture_rate_per_hour(1)
    assert rate is not None
    # (38 - 40) / ((3600-1800)/3600) = -2 / 0.5 = -4 %/h
    assert abs(rate - (-4.0)) < 1e-6


def test_moisture_rate_none_when_only_nulls(monkeypatch):
    monkeypatch.setattr(
        "dsc_brain.sensor_trust.list_history",
        lambda *_a, **_k: [{"ts": 1.0, "value": None}, {"ts": 2.0, "value": None}],
    )
    assert _moisture_rate_per_hour(2) is None


def test_moisture_rate_none_when_single_point(monkeypatch):
    monkeypatch.setattr(
        "dsc_brain.sensor_trust.list_history",
        lambda *_a, **_k: [{"ts": 1.0, "value": 42.0}],
    )
    assert _moisture_rate_per_hour(1) is None
