"""Pass S6 — cadence reminders.

The thing that separates these from a phone alarm: they are anchored to the JOURNAL. "Water
every 3 days" means three days since the last watering ENTRY, so logging a watering is what
moves the next due date. These tests pin that, and pin the two ways it could quietly go
wrong — a brand-new reminder firing instantly, and snoozing being mistaken for done.
"""

from __future__ import annotations

import time
from pathlib import Path

import pytest

DAY = 86400.0


def test_a_new_reminder_does_not_fire_immediately(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    """With nothing logged there is no last-done, so it must fall back to its creation time.
    Falling back to zero would make every new reminder due the moment it is saved."""
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.journal_reminders import create_reminder, list_reminders

    create_reminder("plant", "p1", "water", 3.0)
    rem = list_reminders()[0]

    assert rem["due"] is False
    assert rem["last_done_source"] == "created"
    assert rem["due_in_s"] == pytest.approx(3 * DAY, abs=60)


def test_logging_the_action_moves_the_next_due_date(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    """The whole point: the cadence runs off what the journal says happened."""
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.journal_reminders import create_reminder, list_reminders
    from dsc_brain.plant_journal import add_plant_entry

    now = time.time()
    # Anchored four days ago with a three-day cadence -> due.
    create_reminder("plant", "p1", "water", 3.0, anchor_ts=now - 4 * DAY)
    assert list_reminders(now=now)[0]["due"] is True

    # Log a watering NOW; the reminder should stand down on its own.
    add_plant_entry("p1", now, "watered", action="water", fields={"amount_l": 2.0}, fleet={})
    after = list_reminders(now=now)[0]

    assert after["due"] is False, "logging the action did not reset the cadence"
    assert after["last_done_source"] == "journal"
    assert after["due_in_s"] == pytest.approx(3 * DAY, abs=60)


def test_a_different_action_does_not_satisfy_the_reminder(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    """Feeding is not watering. Matching on any entry would let a plant dry out silently."""
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.journal_reminders import create_reminder, list_reminders
    from dsc_brain.plant_journal import add_plant_entry

    now = time.time()
    create_reminder("plant", "p1", "water", 3.0, anchor_ts=now - 4 * DAY)
    add_plant_entry("p1", now, "fed", action="feed", fields={"ec": 1.8}, fleet={})

    assert list_reminders(now=now)[0]["due"] is True


def test_another_plants_entry_does_not_satisfy_it(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.journal_reminders import create_reminder, list_reminders
    from dsc_brain.plant_journal import add_plant_entry

    now = time.time()
    create_reminder("plant", "p1", "water", 3.0, anchor_ts=now - 4 * DAY)
    add_plant_entry("p2", now, "watered the other one", action="water", fleet={})

    assert list_reminders(now=now)[0]["due"] is True


def test_snoozing_hides_the_card_but_is_not_done(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    """Snooze moves the CARD, never the cadence. Treating it as done would let the journal
    claim a plant was watered when it was not."""
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.journal_reminders import create_reminder, list_reminders, snooze_reminder

    now = time.time()
    rem = create_reminder("plant", "p1", "water", 3.0, anchor_ts=now - 4 * DAY)
    snooze_reminder(rem["id"], 12)

    after = list_reminders(now=now)[0]
    assert after["due"] is False and after["snoozed"] is True
    # Still late underneath — the condition is untouched.
    assert after["due_in_s"] < 0
    assert after["last_done_ts"] is None

    # And it comes back when the snooze expires.
    later = list_reminders(now=now + 13 * 3600)[0]
    assert later["due"] is True


def test_disabled_reminders_never_come_due(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.journal_reminders import create_reminder, list_reminders, update_reminder

    now = time.time()
    rem = create_reminder("plant", "p1", "water", 3.0, anchor_ts=now - 9 * DAY)
    update_reminder(rem["id"], {"enabled": False})

    assert list_reminders(now=now)[0]["due"] is False


def test_validation_refuses_nonsense(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.journal_reminders import create_reminder, snooze_reminder

    with pytest.raises(ValueError, match="scope_kind"):
        create_reminder("room", "r1", "water", 3.0)
    with pytest.raises(ValueError, match="action"):
        create_reminder("plant", "p1", "defoliate", 3.0)
    with pytest.raises(ValueError, match="every_days"):
        create_reminder("plant", "p1", "water", 0.01)
    with pytest.raises(ValueError, match="every_days"):
        create_reminder("plant", "p1", "water", 500)
    with pytest.raises(ValueError, match="scope_id"):
        create_reminder("plant", "", "water", 3.0)

    rem = create_reminder("plant", "p1", "water", 3.0)
    with pytest.raises(ValueError, match="snooze"):
        snooze_reminder(rem["id"], 0)


def test_a_tent_reminder_runs_off_its_anchor(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    """space_journal has no action column — actions are plant-scope — so a tent reminder
    must fall back to its anchor rather than erroring or pretending to track entries."""
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.journal_reminders import create_reminder, list_reminders

    now = time.time()
    create_reminder("space", "4x8", "note", 7.0, label="Check the reservoir", anchor_ts=now - 8 * DAY)
    rem = list_reminders(now=now)[0]

    assert rem["due"] is True
    assert rem["last_done_source"] == "anchor"


def test_the_card_line_says_what_to_do(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.journal_reminders import create_reminder, describe, list_reminders
    from dsc_brain.plant_journal import add_plant_entry

    now = time.time()
    create_reminder("plant", "p1", "water", 3.0, label="Water Gelato")
    add_plant_entry("p1", now - 4 * DAY, "watered", action="water", fleet={})
    rem = list_reminders(now=now)[0]

    line = describe(rem)
    assert "Water Gelato" in line
    assert "every 3 days" in line
    assert "4.0 days since" in line, line
