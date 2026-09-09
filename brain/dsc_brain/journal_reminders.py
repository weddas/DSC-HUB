"""Watering / feeding cadence reminders — the last piece of Pass S6.

A reminder here is **not** an alarm clock. It is anchored to the grow journal: "water this
plant every 3 days" means *3 days since the last watering ENTRY*, so logging a watering is
what moves the next due date. A phone reminder nags on a fixed schedule whether or not you
did the thing; this one knows, because the journal already records it.

Three rules the plan is explicit about, all load-bearing:

* **Nothing here actuates.** A due reminder is a card that says "you said every 3 days, it
  has been 4". The hub is never told, no relay moves, no pump runs. Irrigation is a
  separate, safety-gated path.
* **They render as alert cards tagged REMINDER**, sharing the Alerts desk and its quiet
  hours — one place the operator looks, rather than a second inbox.
* **A reminder is per plant or per tent**, matching how growing actually works: a feed
  schedule belongs to a plant, a "check the reservoir" cadence to a tent.

Design note on overdue-ness: due and overdue are the same state with different ages, so the
API returns `due_in_s` (negative when late) rather than a boolean. A card that says "4 days
since, you asked for 3" is actionable; "OVERDUE" alone is not.
"""

from __future__ import annotations

import json
import sqlite3
import time
from pathlib import Path
from typing import Any

from .db import schema_once
from .settings import connect as _connect_settings

# What a reminder can be keyed to. Deliberately a subset of the action catalogue: these are
# the recurring husbandry tasks. "Defoliate every N days" is not a thing anyone wants.
REMINDABLE_ACTIONS = ("water", "feed", "flush", "note")

SCOPE_KINDS = ("plant", "space")

MIN_EVERY_DAYS = 0.25  # six hours — below this it is a timer, not a husbandry cadence
MAX_EVERY_DAYS = 90.0

REMINDER_SCHEMA = """
CREATE TABLE IF NOT EXISTS journal_reminder (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  scope_kind TEXT NOT NULL,
  scope_id TEXT NOT NULL,
  action TEXT NOT NULL,
  every_days REAL NOT NULL,
  label TEXT NOT NULL DEFAULT '',
  enabled INTEGER NOT NULL DEFAULT 1,
  anchor_ts REAL,
  snooze_until REAL,
  created_at REAL NOT NULL,
  updated_at REAL NOT NULL
);
"""


def _connect(db_path: Path | None = None) -> sqlite3.Connection:
    # settings.connect resolves DSC_DATA per call — see journal_media._connect for why
    # binding paths.DEFAULT_DB at import time is wrong here.
    return _connect_settings(db_path)


def init_reminder_tables(db_path: Path | None = None) -> None:
    with _connect(db_path) as conn:
        if not schema_once(conn, "journal_reminder"):
            return
        conn.executescript(REMINDER_SCHEMA)
        conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_journal_reminder_scope "
            "ON journal_reminder(scope_kind, scope_id)"
        )
        conn.commit()


def _validate(scope_kind: str, scope_id: str, action: str, every_days: float) -> tuple[str, str, str, float]:
    kind = str(scope_kind or "").strip().lower()
    if kind not in SCOPE_KINDS:
        raise ValueError(f"scope_kind must be one of {list(SCOPE_KINDS)}")
    sid = str(scope_id or "").strip()
    if not sid:
        raise ValueError("scope_id required")
    act = str(action or "").strip().lower()
    if act not in REMINDABLE_ACTIONS:
        raise ValueError(f"action must be one of {list(REMINDABLE_ACTIONS)}")
    try:
        days = float(every_days)
    except (TypeError, ValueError) as exc:
        raise ValueError("every_days must be a number") from exc
    if not (MIN_EVERY_DAYS <= days <= MAX_EVERY_DAYS):
        raise ValueError(f"every_days must be between {MIN_EVERY_DAYS} and {MAX_EVERY_DAYS}")
    return kind, sid, act, days


def create_reminder(
    scope_kind: str,
    scope_id: str,
    action: str,
    every_days: float,
    *,
    label: str = "",
    anchor_ts: float | None = None,
    db_path: Path | None = None,
) -> dict[str, Any]:
    kind, sid, act, days = _validate(scope_kind, scope_id, action, every_days)
    init_reminder_tables(db_path)
    now = time.time()
    with _connect(db_path) as conn:
        cur = conn.execute(
            """
            INSERT INTO journal_reminder(scope_kind, scope_id, action, every_days, label,
                                         enabled, anchor_ts, snooze_until, created_at, updated_at)
            VALUES(?, ?, ?, ?, ?, 1, ?, NULL, ?, ?)
            """,
            (kind, sid, act, days, str(label or "")[:80], anchor_ts, now, now),
        )
        conn.commit()
        rid = int(cur.lastrowid or 0)
    return get_reminder(rid, db_path=db_path) or {}


def update_reminder(reminder_id: int, patch: dict[str, Any], *, db_path: Path | None = None) -> dict[str, Any]:
    init_reminder_tables(db_path)
    current = get_reminder(reminder_id, db_path=db_path)
    if current is None:
        raise ValueError("no such reminder")
    every = patch.get("every_days", current["every_days"])
    action = patch.get("action", current["action"])
    _validate(current["scope_kind"], current["scope_id"], action, every)
    sets: list[str] = []
    args: list[Any] = []
    if "every_days" in patch:
        sets.append("every_days = ?"); args.append(float(every))
    if "action" in patch:
        sets.append("action = ?"); args.append(str(action).strip().lower())
    if "label" in patch:
        sets.append("label = ?"); args.append(str(patch["label"] or "")[:80])
    if "enabled" in patch:
        sets.append("enabled = ?"); args.append(1 if patch["enabled"] else 0)
    if "anchor_ts" in patch:
        sets.append("anchor_ts = ?"); args.append(patch["anchor_ts"])
    if not sets:
        return current
    sets.append("updated_at = ?"); args.append(time.time())
    args.append(int(reminder_id))
    with _connect(db_path) as conn:
        conn.execute(f"UPDATE journal_reminder SET {', '.join(sets)} WHERE id = ?", args)
        conn.commit()
    return get_reminder(reminder_id, db_path=db_path) or {}


def snooze_reminder(reminder_id: int, hours: float, *, db_path: Path | None = None) -> dict[str, Any]:
    """Hide a due reminder for a while. The cadence is untouched — this only moves the card.

    Snoozing is not "done": doing the thing means logging the entry, which is what actually
    resets the cadence. Conflating the two would let a plant go unwatered while the journal
    said otherwise.
    """
    init_reminder_tables(db_path)
    try:
        h = float(hours)
    except (TypeError, ValueError) as exc:
        raise ValueError("hours must be a number") from exc
    if not (0 < h <= 24 * 14):
        raise ValueError("snooze must be between 0 and 336 hours")
    until = time.time() + h * 3600.0
    with _connect(db_path) as conn:
        cur = conn.execute(
            "UPDATE journal_reminder SET snooze_until = ?, updated_at = ? WHERE id = ?",
            (until, time.time(), int(reminder_id)),
        )
        conn.commit()
        if not cur.rowcount:
            raise ValueError("no such reminder")
    return get_reminder(reminder_id, db_path=db_path) or {}


def delete_reminder(reminder_id: int, *, db_path: Path | None = None) -> bool:
    init_reminder_tables(db_path)
    with _connect(db_path) as conn:
        cur = conn.execute("DELETE FROM journal_reminder WHERE id = ?", (int(reminder_id),))
        conn.commit()
        return bool(cur.rowcount)


def _row_to_dict(r: sqlite3.Row) -> dict[str, Any]:
    return {
        "id": int(r["id"]),
        "scope_kind": r["scope_kind"],
        "scope_id": r["scope_id"],
        "action": r["action"],
        "every_days": float(r["every_days"]),
        "label": r["label"] or "",
        "enabled": bool(r["enabled"]),
        "anchor_ts": float(r["anchor_ts"]) if r["anchor_ts"] is not None else None,
        "snooze_until": float(r["snooze_until"]) if r["snooze_until"] is not None else None,
        "created_at": float(r["created_at"]),
        "updated_at": float(r["updated_at"]),
    }


def get_reminder(reminder_id: int, *, db_path: Path | None = None) -> dict[str, Any] | None:
    init_reminder_tables(db_path)
    conn = _connect(db_path)
    try:
        row = conn.execute("SELECT * FROM journal_reminder WHERE id = ?", (int(reminder_id),)).fetchone()
    finally:
        conn.close()
    return _row_to_dict(row) if row else None


def _last_entry_ts(conn: sqlite3.Connection, rem: dict[str, Any]) -> float | None:
    """When this reminder's action was last logged in its scope.

    This is the whole point: the cadence runs from what the journal SAYS HAPPENED, not from
    when the reminder was created. Log a watering and the next one moves out by itself.
    """
    table = "plant_journal" if rem["scope_kind"] == "plant" else "space_journal"
    scope_col = "plant_id" if rem["scope_kind"] == "plant" else "space_id"
    try:
        row = conn.execute(
            f"SELECT MAX(occurred_at) AS ts FROM {table} WHERE {scope_col} = ? AND action = ?",
            (rem["scope_id"], rem["action"]),
        ).fetchone()
    except sqlite3.DatabaseError:
        # space_journal has no `action` column (actions are plant-scope) — a tent reminder
        # therefore runs off its anchor alone rather than pretending to track entries.
        return None
    return float(row["ts"]) if row and row["ts"] is not None else None


def list_reminders(
    *, scope_kind: str | None = None, scope_id: str | None = None,
    now: float | None = None, db_path: Path | None = None,
) -> list[dict[str, Any]]:
    """Every reminder with its computed due state."""
    init_reminder_tables(db_path)
    ts = now if now is not None else time.time()
    conn = _connect(db_path)
    try:
        sql = "SELECT * FROM journal_reminder"
        args: list[Any] = []
        where: list[str] = []
        if scope_kind:
            where.append("scope_kind = ?"); args.append(str(scope_kind))
        if scope_id:
            where.append("scope_id = ?"); args.append(str(scope_id))
        if where:
            sql += " WHERE " + " AND ".join(where)
        sql += " ORDER BY scope_kind, scope_id, action"
        rows = [_row_to_dict(r) for r in conn.execute(sql, args)]
        for rem in rows:
            last = _last_entry_ts(conn, rem)
            # No entry yet: fall back to the anchor, then to when it was created. A brand
            # new reminder should not fire instantly just because nothing is logged.
            basis = last if last is not None else (rem["anchor_ts"] or rem["created_at"])
            due_at = basis + rem["every_days"] * 86400.0
            snoozed = rem["snooze_until"] is not None and rem["snooze_until"] > ts
            rem["last_done_ts"] = last
            rem["last_done_source"] = "journal" if last is not None else ("anchor" if rem["anchor_ts"] else "created")
            rem["due_at"] = due_at
            rem["due_in_s"] = due_at - ts          # negative = late
            rem["snoozed"] = snoozed
            rem["due"] = bool(rem["enabled"] and not snoozed and due_at <= ts)
    finally:
        conn.close()
    return rows


def due_reminders(*, now: float | None = None, db_path: Path | None = None) -> list[dict[str, Any]]:
    """Just the ones the Alerts desk should show as REMINDER cards."""
    return [r for r in list_reminders(now=now, db_path=db_path) if r["due"]]


def describe(rem: dict[str, Any]) -> str:
    """The card's one line: what was asked for, and how far past it we are.

    "Water · every 3 days · 4 days since the last one" beats "OVERDUE" — the operator can
    act on the second without opening anything.
    """
    label = rem.get("label") or f"{str(rem['action']).capitalize()}"
    every = rem["every_days"]
    every_text = f"every {every:g} day{'s' if every != 1 else ''}"
    late_s = -float(rem.get("due_in_s") or 0.0)
    if rem.get("last_done_ts") is None:
        return f"{label} · {every_text} · nothing logged yet"
    days_since = (time.time() - float(rem["last_done_ts"])) / 86400.0
    return f"{label} · {every_text} · {days_since:.1f} days since the last one"
