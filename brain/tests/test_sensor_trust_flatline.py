"""A frozen probe is flat, not zero-slope: jitter of a few tenths must not hide a flatline."""

from __future__ import annotations

import time

from dsc_brain import sensor_trust as st


def _rows(values: list[float], hours: float = 5.0) -> list[dict]:
    now = time.time()
    n = len(values)
    return [{"ts": now - hours * 3600 + i * (hours * 3600 / max(n - 1, 1)), "value": v} for i, v in enumerate(values)]


def test_jittering_flatline_is_flat(monkeypatch):
    # 4 distinct values over 5 h — the pot1 signature the slope test missed for 24 h
    vals = [19.9, 19.8, 20.0, 19.9] * 10
    monkeypatch.setattr(st, "list_history", lambda *_a, **_k: _rows(vals))
    flat = st._moisture_flatline(1)
    assert flat is not None
    span, hours, n = flat
    assert span <= st._FLAT_SPAN_MAX_PCT and hours >= st._FLAT_MIN_HOURS and n == 40


def test_drying_probe_is_not_flat(monkeypatch):
    vals = [round(45.0 - i * 0.4, 1) for i in range(40)]  # ~3 %/h dry-back
    monkeypatch.setattr(st, "list_history", lambda *_a, **_k: _rows(vals))
    flat = st._moisture_flatline(2)
    assert flat is not None and flat[0] > st._FLAT_SPAN_MAX_PCT


def test_sparse_history_is_undecided(monkeypatch):
    monkeypatch.setattr(st, "list_history", lambda *_a, **_k: _rows([20.0] * 5))
    assert st._moisture_flatline(1) is None
    monkeypatch.setattr(st, "list_history", lambda *_a, **_k: _rows([20.0] * 40, hours=1.0))
    assert st._moisture_flatline(1) is None  # 40 samples but only one hour
