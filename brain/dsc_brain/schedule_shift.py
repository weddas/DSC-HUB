"""Approve-only photoperiod slide plans and flip requests — never silent mutate."""

from __future__ import annotations

import json
import sqlite3
import time
from pathlib import Path
from typing import Any, Callable

from .energy_model import parse_hhmm_to_min
from .paths import DEFAULT_DB
from .plant_journal import add_plant_entry
from .space_journal import add_space_entry

SetLightsOnFn = Callable[[str, str], None]

POLICY_STEP_MIN = {
    "pause": 0,
    "flower_strict": 15,
    "veg_style": 30,
}


def _connect(db_path: Path | None = None) -> sqlite3.Connection:
    path = db_path or DEFAULT_DB
    path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(path))
    conn.row_factory = sqlite3.Row
    return conn


def init_shift_tables(db_path: Path | None = None) -> None:
    with _connect(db_path) as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS schedule_shift_plan (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              space_id TEXT NOT NULL,
              from_on TEXT NOT NULL,
              to_on TEXT NOT NULL,
              want_hours REAL NOT NULL,
              policy TEXT NOT NULL,
              status TEXT NOT NULL DEFAULT 'active',
              next_step_at REAL,
              created_at REAL NOT NULL,
              updated_at REAL NOT NULL
            );
            CREATE TABLE IF NOT EXISTS photoperiod_flip_request (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              space_id TEXT NOT NULL,
              plant_id TEXT,
              from_hours REAL,
              to_hours REAL,
              status TEXT NOT NULL DEFAULT 'pending',
              note TEXT NOT NULL DEFAULT '',
              created_at REAL NOT NULL,
              updated_at REAL NOT NULL
            );
            """
        )
        conn.commit()


def _fmt_min(m: int) -> str:
    m = m % (24 * 60)
    return f"{m // 60:02d}:{m % 60:02d}:00"


def create_shift_plan(
    space_id: str,
    *,
    from_on: str,
    to_on: str,
    want_hours: float,
    policy: str,
    confirm: bool,
    db_path: Path | None = None,
) -> dict[str, Any]:
    if not confirm:
        raise ValueError("confirm=true required — no silent schedule changes")
    pol = str(policy or "").strip()
    if pol not in POLICY_STEP_MIN:
        raise ValueError("policy must be pause|flower_strict|veg_style")
    if parse_hhmm_to_min(from_on) is None or parse_hhmm_to_min(to_on) is None:
        raise ValueError("from_on/to_on must be HH:MM")
    init_shift_tables(db_path)
    now = time.time()
    status = "paused" if pol == "pause" else "active"
    with _connect(db_path) as conn:
        cur = conn.execute(
            """
            INSERT INTO schedule_shift_plan(
              space_id, from_on, to_on, want_hours, policy, status, next_step_at, created_at, updated_at
            ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                str(space_id),
                from_on,
                to_on,
                float(want_hours),
                pol,
                status,
                now + 86400.0 if status == "active" else None,
                now,
                now,
            ),
        )
        conn.commit()
        plan_id = int(cur.lastrowid or 0)
    add_space_entry(
        space_id,
        now,
        f"Schedule slide plan #{plan_id} started ({pol}) {from_on} → {to_on}",
        source="system",
        tags=["schedule_slide"],
        db_path=db_path,
    )
    return get_shift_plan(plan_id, db_path=db_path)


def get_shift_plan(plan_id: int, *, db_path: Path | None = None) -> dict[str, Any]:
    init_shift_tables(db_path)
    with _connect(db_path) as conn:
        r = conn.execute("SELECT * FROM schedule_shift_plan WHERE id=?", (int(plan_id),)).fetchone()
    if not r:
        raise KeyError(f"plan {plan_id} not found")
    return dict(r)


def cancel_shift_plan(plan_id: int, *, db_path: Path | None = None) -> dict[str, Any]:
    init_shift_tables(db_path)
    now = time.time()
    with _connect(db_path) as conn:
        conn.execute(
            "UPDATE schedule_shift_plan SET status='cancelled', updated_at=? WHERE id=?",
            (now, int(plan_id)),
        )
        conn.commit()
    plan = get_shift_plan(plan_id, db_path=db_path)
    add_space_entry(
        plan["space_id"],
        now,
        f"Schedule slide plan #{plan_id} cancelled",
        source="system",
        tags=["schedule_slide"],
        db_path=db_path,
    )
    return plan


def tick_shift_plans(
    *,
    now: float | None = None,
    set_lights_on: SetLightsOnFn | None = None,
    db_path: Path | None = None,
) -> list[dict[str, Any]]:
    """Advance active plans one step. Requires set_lights_on callback to mutate hub time."""
    init_shift_tables(db_path)
    ts = float(now if now is not None else time.time())
    with _connect(db_path) as conn:
        rows = conn.execute(
            "SELECT * FROM schedule_shift_plan WHERE status='active'"
        ).fetchall()
    stepped: list[dict[str, Any]] = []
    for r in rows:
        plan = dict(r)
        if plan.get("next_step_at") is not None and float(plan["next_step_at"]) > ts:
            continue
        step = POLICY_STEP_MIN.get(str(plan["policy"]), 0)
        if step <= 0:
            continue
        cur = parse_hhmm_to_min(str(plan["from_on"]))
        target = parse_hhmm_to_min(str(plan["to_on"]))
        if cur is None or target is None:
            continue
        # shortest direction on clock
        delta = (target - cur + 24 * 60) % (24 * 60)
        if delta > 12 * 60:
            delta = delta - 24 * 60
        if abs(delta) <= step:
            new_on = str(plan["to_on"])
            done = True
        else:
            move = step if delta > 0 else -step
            new_on = _fmt_min(cur + move)
            done = False
        if set_lights_on is not None:
            set_lights_on(str(plan["space_id"]), new_on)
        # Ratio-fixed slide: want_hours never changes here — flower_strict dark floor = 24 - want_hours.
        status = "completed" if done else "active"
        next_at = None if done else ts + 86400.0
        with _connect(db_path) as conn:
            conn.execute(
                """
                UPDATE schedule_shift_plan
                SET from_on=?, status=?, next_step_at=?, updated_at=?
                WHERE id=?
                """,
                (new_on, status, next_at, ts, int(plan["id"])),
            )
            conn.commit()
        add_space_entry(
            plan["space_id"],
            ts,
            f"Schedule slide plan #{plan['id']} stepped to {new_on}"
            + (" (complete)" if done else "")
            + f" · want_hours={plan['want_hours']} (dark floor held)",
            source="system",
            tags=["schedule_slide"],
            db_path=db_path,
        )
        stepped.append(get_shift_plan(int(plan["id"]), db_path=db_path))
    return stepped


def request_flip(
    space_id: str,
    *,
    plant_id: str | None,
    from_hours: float,
    to_hours: float,
    note: str = "",
    db_path: Path | None = None,
) -> dict[str, Any]:
    """Create pending flip — never changes schedule."""
    init_shift_tables(db_path)
    now = time.time()
    with _connect(db_path) as conn:
        cur = conn.execute(
            """
            INSERT INTO photoperiod_flip_request(
              space_id, plant_id, from_hours, to_hours, status, note, created_at, updated_at
            ) VALUES(?, ?, ?, ?, 'pending', ?, ?, ?)
            """,
            (
                str(space_id),
                str(plant_id) if plant_id else None,
                float(from_hours),
                float(to_hours),
                str(note or ""),
                now,
                now,
            ),
        )
        conn.commit()
        rid = int(cur.lastrowid or 0)
    msg = f"Photoperiod flip requested on {space_id}: {from_hours}h → {to_hours}h (pending approval)"
    add_space_entry(space_id, now, msg, source="system", tags=["flip_request"], db_path=db_path)
    if plant_id:
        add_plant_entry(str(plant_id), now, msg, source="system", tags=["flip_request"], db_path=db_path)
    return get_flip_request(rid, db_path=db_path)


def get_flip_request(req_id: int, *, db_path: Path | None = None) -> dict[str, Any]:
    init_shift_tables(db_path)
    with _connect(db_path) as conn:
        r = conn.execute("SELECT * FROM photoperiod_flip_request WHERE id=?", (int(req_id),)).fetchone()
    if not r:
        raise KeyError(f"flip {req_id} not found")
    return dict(r)


def list_pending_flips(*, db_path: Path | None = None) -> list[dict[str, Any]]:
    init_shift_tables(db_path)
    with _connect(db_path) as conn:
        rows = conn.execute(
            "SELECT * FROM photoperiod_flip_request WHERE status='pending' ORDER BY id DESC"
        ).fetchall()
    return [dict(r) for r in rows]


def resolve_flip(
    req_id: int,
    *,
    approve: bool,
    db_path: Path | None = None,
) -> dict[str, Any]:
    """Approve/deny flip request. Approve only marks approved — caller must apply hours with confirm."""
    init_shift_tables(db_path)
    now = time.time()
    status = "approved" if approve else "denied"
    with _connect(db_path) as conn:
        conn.execute(
            "UPDATE photoperiod_flip_request SET status=?, updated_at=? WHERE id=?",
            (status, now, int(req_id)),
        )
        conn.commit()
    req = get_flip_request(req_id, db_path=db_path)
    msg = f"Photoperiod flip {status} on {req['space_id']}"
    add_space_entry(req["space_id"], now, msg, source="system", tags=["flip"], db_path=db_path)
    if req.get("plant_id"):
        add_plant_entry(str(req["plant_id"]), now, msg, source="system", tags=["flip"], db_path=db_path)
    return req
