# brain/tests/test_schedule_shift.py
from pathlib import Path

import pytest

from dsc_brain.schedule_shift import (
    cancel_shift_plan,
    create_shift_plan,
    request_flip,
    resolve_flip,
    tick_shift_plans,
)


def test_create_requires_confirm(tmp_path: Path):
    db = tmp_path / "ops.sqlite3"
    with pytest.raises(ValueError, match="confirm"):
        create_shift_plan(
            "2x4",
            from_on="06:00:00",
            to_on="22:00:00",
            want_hours=12,
            policy="veg_style",
            confirm=False,
            db_path=db,
        )


def test_tick_steps_and_completes(tmp_path: Path):
    db = tmp_path / "ops.sqlite3"
    applied: list[tuple[str, str]] = []

    def set_on(space_id: str, lights_on: str) -> None:
        applied.append((space_id, lights_on))

    plan = create_shift_plan(
        "2x4",
        from_on="06:00:00",
        to_on="06:45:00",
        want_hours=12,
        policy="veg_style",
        confirm=True,
        db_path=db,
    )
    # force due
    from dsc_brain.schedule_shift import _connect

    with _connect(db) as conn:
        conn.execute("UPDATE schedule_shift_plan SET next_step_at=0 WHERE id=?", (plan["id"],))
        conn.commit()
    stepped = tick_shift_plans(now=1.0, set_lights_on=set_on, db_path=db)
    assert stepped
    assert applied
    assert applied[0][1] == "06:30:00"


def test_flip_pending_does_not_mutate(tmp_path: Path):
    db = tmp_path / "ops.sqlite3"
    req = request_flip("4x8", plant_id="p1", from_hours=18, to_hours=12, db_path=db)
    assert req["status"] == "pending"
    denied = resolve_flip(req["id"], approve=False, db_path=db)
    assert denied["status"] == "denied"


def test_pause_policy_does_not_step(tmp_path: Path):
    db = tmp_path / "ops.sqlite3"
    applied: list[tuple[str, str]] = []
    plan = create_shift_plan(
        "2x4",
        from_on="06:00:00",
        to_on="22:00:00",
        want_hours=12,
        policy="pause",
        confirm=True,
        db_path=db,
    )
    assert plan["status"] == "paused"
    from dsc_brain.schedule_shift import _connect

    with _connect(db) as conn:
        conn.execute(
            "UPDATE schedule_shift_plan SET status='active', next_step_at=0 WHERE id=?",
            (plan["id"],),
        )
        conn.commit()
    stepped = tick_shift_plans(now=1.0, set_lights_on=lambda s, t: applied.append((s, t)), db_path=db)
    assert stepped == []
    assert applied == []


def test_flower_strict_caps_step_and_holds_want_hours(tmp_path: Path):
    db = tmp_path / "ops.sqlite3"
    applied: list[str] = []
    plan = create_shift_plan(
        "2x4",
        from_on="06:00:00",
        to_on="22:00:00",
        want_hours=12,
        policy="flower_strict",
        confirm=True,
        db_path=db,
    )
    from dsc_brain.schedule_shift import _connect, get_shift_plan

    with _connect(db) as conn:
        conn.execute("UPDATE schedule_shift_plan SET next_step_at=0 WHERE id=?", (plan["id"],))
        conn.commit()
    tick_shift_plans(now=1.0, set_lights_on=lambda _s, t: applied.append(t), db_path=db)
    # Shortest path 06:00 → 22:00 is backward → 15 min step lands 05:45
    assert applied == ["05:45:00"]
    after = get_shift_plan(plan["id"], db_path=db)
    assert float(after["want_hours"]) == 12.0
    assert after["from_on"] == "05:45:00"
