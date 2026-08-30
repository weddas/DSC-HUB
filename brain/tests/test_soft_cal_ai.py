"""SoftCal / climate AI guardrail tests."""

from __future__ import annotations

import asyncio
from pathlib import Path

import pytest


def test_advice_filters_unknown_actions(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", temp_db)
    from dsc_brain import soft_cal_ai

    def _fake_tick(**_k: object) -> dict:
        return {
            "need": {"moisture_pct": "low"},
            "want": {},
            "advisories": ["moisture_pct below Want"],
            "commands": [
                {"type": "demand_on", "metric": "moisture_pct_low"},
                {"type": "hack_relay", "metric": "evil"},
            ],
        }

    monkeypatch.setattr(soft_cal_ai, "decision_tick", _fake_tick)

    async def _no_ollama(_p: str) -> None:
        return None

    monkeypatch.setattr(soft_cal_ai, "_ollama_narrative", _no_ollama)

    out = asyncio.run(
        soft_cal_ai.soft_cal_climate_advice(
            seat="pot1",
            got={"moisture_pct": 20.0},
        )
    )
    types = {a["type"] for a in out["actions"]}
    assert "hack_relay" not in types
    assert "demand_on" in types
    assert "advise_only" in types
    assert out["guardrail"]
