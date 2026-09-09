"""Auto-reconcile of HUB DIFFERS stalemates.

`differs` means the hub reports a value the brain did not write. The 2026-09-07 decision is
that such a change is never SILENTLY overwritten, so the automatic modes here are opt-in,
debounced, guarded against a flip-flop war, and journalled. These tests pin each of those,
because every one of them is a way an automatic fixer could quietly do harm on a live grow.
"""

from __future__ import annotations

import asyncio
from pathlib import Path

import pytest


def _controls(value: str) -> dict:
    return {"number.dsc_hub_target_temp": {"state": value, "min": 15, "max": 32, "step": 0.5}}


def _rows(desired: str, *, differs_since: float = 0.0, fixes: int = 0, window: float = 0.0) -> dict:
    return {
        "number.dsc_hub_target_temp": {
            "desired": desired, "unit": "°C", "updated_at": 0.0, "source": "operator",
            "pending": 0, "pushed_at": 0.0, "attempts": 0, "last_error": "",
            "differs_since": differs_since, "auto_fixes": fixes, "auto_window_start": window,
        }
    }


def test_default_is_manual_so_a_deploy_changes_nothing(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.hub_tunables import DEFAULT_AUTO_MODE, get_auto_mode

    assert DEFAULT_AUTO_MODE == "manual"
    assert get_auto_mode() == "manual"


def test_manual_mode_never_touches_a_differing_row(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain import hub_tunables as ht

    done = asyncio.run(ht._auto_reconcile(_rows("22"), _controls("25"), now=10_000.0))
    assert done == [], "manual mode acted on a stalemate"


def test_first_sight_of_a_disagreement_only_starts_the_clock(
    temp_db: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    """An echo lags an ingest poll. Acting on the first sighting would treat that lag as a
    hub-side change and fight it."""
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain import hub_tunables as ht

    ht.set_auto_mode("hub_wins")
    done = asyncio.run(ht._auto_reconcile(_rows("22"), _controls("25"), now=10_000.0))
    assert done == [], "acted before the debounce had even started"


def test_hub_wins_adopts_only_after_the_debounce(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain import hub_tunables as ht

    ht.set_auto_mode("hub_wins")
    started = 10_000.0

    early = asyncio.run(ht._auto_reconcile(
        _rows("22", differs_since=started), _controls("25"), now=started + ht.AUTO_DEBOUNCE_SEC - 1
    ))
    assert early == [], "adopted before the debounce elapsed"

    late = asyncio.run(ht._auto_reconcile(
        _rows("22", differs_since=started), _controls("25"), now=started + ht.AUTO_DEBOUNCE_SEC + 1
    ))
    assert len(late) == 1
    assert late[0]["mode"] == "hub_wins"
    assert late[0]["to"] == "25", "hub_wins must take the HUB's value"


def test_brain_wins_pushes_the_brains_value(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain import hub_tunables as ht

    ht.set_auto_mode("brain_wins")
    pushed: list[tuple[str, str]] = []

    async def fake_push(eid: str, value: str) -> None:
        pushed.append((eid, value))

    monkeypatch.setattr(ht, "_push_entity", fake_push)
    started = 10_000.0
    done = asyncio.run(ht._auto_reconcile(
        _rows("22", differs_since=started), _controls("25"), now=started + ht.AUTO_DEBOUNCE_SEC + 1
    ))

    assert pushed == [("number.dsc_hub_target_temp", "22")], "brain_wins must push the BRAIN's value"
    assert done and done[0]["to"] == "22"


def test_a_row_in_flight_is_left_alone(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    """pending means a push is already going; auto-fixing on top would double-write."""
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain import hub_tunables as ht

    ht.set_auto_mode("brain_wins")
    rows = _rows("22", differs_since=1.0)
    rows["number.dsc_hub_target_temp"]["pending"] = 1

    done = asyncio.run(ht._auto_reconcile(rows, _controls("25"), now=99_999.0))
    assert done == []


def test_the_flip_flop_guard_stands_down(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    """If the hub keeps re-asserting its own value, brain_wins would fight it every poll.
    After the cap the row is left to a human instead of looping."""
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain import hub_tunables as ht

    ht.set_auto_mode("brain_wins")

    async def fake_push(eid: str, value: str) -> None:
        return None

    monkeypatch.setattr(ht, "_push_entity", fake_push)
    now = 10_000.0
    rows = _rows("22", differs_since=1.0, fixes=ht.AUTO_MAX_FIXES, window=now - 60)

    done = asyncio.run(ht._auto_reconcile(rows, _controls("25"), now=now))
    assert done == [], "kept fighting the hub past the cap"


def test_agreement_clears_the_differ_clock(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain import hub_tunables as ht

    ht.set_auto_mode("hub_wins")
    done = asyncio.run(ht._auto_reconcile(
        _rows("25", differs_since=1.0), _controls("25"), now=99_999.0
    ))
    assert done == [], "acted on a row that actually agrees"


def test_an_invalid_mode_is_refused(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.hub_tunables import set_auto_mode

    with pytest.raises(ValueError, match="mode must be one of"):
        set_auto_mode("whatever_wins")
