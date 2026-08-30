"""Tests for Bar 3 root_steering SoT."""

from __future__ import annotations

from pathlib import Path

import pytest


def test_phase_lights_off_is_p0(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", temp_db)
    from dsc_brain.root_steering import compute_phase

    snap = compute_phase(reading_ok=True, lights_on=False, dryback_pct=30.0, override=False)
    assert snap["phase"] == "P0"
    assert snap["act_allowed"] is False


def test_phase_shallow_dryback_p1(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", temp_db)
    from dsc_brain.root_steering import compute_phase

    snap = compute_phase(reading_ok=True, lights_on=True, dryback_pct=5.0, override=False)
    assert snap["phase"] == "P1"
    assert snap["act_allowed"] is True


def test_phase_generative_p3(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", temp_db)
    from dsc_brain.root_steering import compute_phase

    snap = compute_phase(reading_ok=True, lights_on=True, dryback_pct=40.0, override=False)
    assert snap["phase"] == "P3"


def test_probe_not_ok_blocks(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", temp_db)
    from dsc_brain.root_steering import compute_phase

    snap = compute_phase(reading_ok=False, lights_on=True, dryback_pct=10.0, override=False)
    assert snap["phase"] is None
    assert snap["reason"] == "probe_not_ok"
    assert snap["act_allowed"] is False


def test_override_blocks_act(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", temp_db)
    from dsc_brain.root_steering import compute_phase

    snap = compute_phase(reading_ok=True, lights_on=True, dryback_pct=5.0, override=True)
    assert snap["phase"] is None
    assert snap["reason"] == "manual_override"


def test_fleet_snapshot(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", temp_db)
    from dsc_brain.root_steering import build_root_steering_snapshot

    class _Pot:
        online = True
        values = {"dryback_pct": 8.0}

    snap = build_root_steering_snapshot({"pot1": _Pot()}, lights_on=True)
    assert snap["pots"]["pot1"]["phase"] == "P1"
