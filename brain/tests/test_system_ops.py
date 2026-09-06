"""Host diagnostics — log tail, verbosity, power actions."""

from __future__ import annotations

import logging
from pathlib import Path

import pytest


def test_log_verbosity_round_trip_and_persist(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", temp_db)
    from dsc_brain.system_ops import apply_log_level_from_settings, log_verbosity, set_log_verbosity

    out = set_log_verbosity("DEBUG")
    assert out["level"] == "DEBUG"
    assert logging.getLogger("dsc_brain").level == logging.DEBUG
    assert log_verbosity()["level"] == "DEBUG"

    # reset the live logger, then restore from the persisted setting
    logging.getLogger("dsc_brain").setLevel(logging.WARNING)
    assert apply_log_level_from_settings() == "DEBUG"
    assert logging.getLogger("dsc_brain").level == logging.DEBUG

    set_log_verbosity("INFO")
    with pytest.raises(ValueError):
        set_log_verbosity("LOUD")


def test_tail_log_bad_source() -> None:
    from dsc_brain.system_ops import tail_log

    with pytest.raises(ValueError):
        tail_log("kernel")


def test_tail_log_shape(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", temp_db)
    from dsc_brain.system_ops import tail_log

    r = tail_log("system", 20)
    assert r["source"] == "system"
    assert set(r) >= {"source", "cmd", "ok", "lines", "exit", "hint"}
    assert isinstance(r["lines"], list)
    if not r["ok"]:
        assert r["hint"]


def test_power_action_validation_and_shape(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", temp_db)
    from dsc_brain.system_ops import power_action

    with pytest.raises(ValueError):
        power_action("format-c")

    # a command that definitely doesn't resolve -> manual, never raises, never spawns
    from dsc_brain.settings import set_setting

    set_setting("reboot_cmd", "definitely-not-a-real-binary-xyz --now")
    out = power_action("reboot")
    assert out["status"] == "manual"
    assert out["action"] == "reboot"
