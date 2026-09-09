"""The brain's one SQLite connection factory.

Every module used to open its own ``sqlite3.connect`` and several ran their ``CREATE TABLE``
script on *every* connect. With the default rollback journal that made each read take the
same lock as the ingest writer, and there was no ``busy_timeout`` anywhere, so a busy moment
surfaced as ``database is locked`` rather than a short wait. Filed as a latent risk after the
2026-09-09 outage (which the container log traced to request flooding, not to SQLite).

``open_db`` gives every caller WAL (readers never block the writer, the writer never blocks
readers) and a busy timeout; ``schema_once`` runs a module's DDL the first time that database
file is seen in this process and never again. Both are keyed on the resolved file path, so
tests that build a fresh temp database each get their own schema pass.
"""

from __future__ import annotations

import sqlite3
import threading
from pathlib import Path

BUSY_TIMEOUT_S = 5.0

_lock = threading.Lock()
_wal_done: set[str] = set()
# key -> "pending" | "done"; pending keys carry an Event set when the first caller's DDL lands.
_schema_state: dict[tuple[str, str], str] = {}
_schema_events: dict[tuple[str, str], threading.Event] = {}
SCHEMA_WAIT_S = 10.0


class _Conn(sqlite3.Connection):
    """sqlite3.Connection that runs callbacks when its `with conn:` block exits.

    The init_* helpers do their CREATE TABLE IF NOT EXISTS inside `with _connect() as conn:`;
    the block exit (commit) is the moment their schema is really on disk, so that is when
    waiters are released.
    """

    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)
        self._dsc_on_exit: list = []

    def __exit__(self, *exc):  # type: ignore[override]
        result = super().__exit__(*exc)
        callbacks, self._dsc_on_exit = self._dsc_on_exit, []
        for cb in callbacks:
            try:
                cb()
            except Exception:  # noqa: BLE001 — a bookkeeping callback must never mask the caller
                pass
        return result


def _key(path: Path) -> str:
    try:
        return str(path.resolve())
    except OSError:
        return str(path)


def open_db(path: Path | str) -> sqlite3.Connection:
    """Open ``path`` with Row rows, a busy timeout and (once per process) WAL journaling."""
    p = Path(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(p), timeout=BUSY_TIMEOUT_S, factory=_Conn)
    conn.row_factory = sqlite3.Row
    key = _key(p)
    if key not in _wal_done:
        with _lock:
            if key not in _wal_done:
                try:
                    conn.execute("PRAGMA journal_mode=WAL")
                    # WAL + NORMAL is durable across process crashes; only an OS crash can
                    # lose the last transactions, and that trade buys a much cheaper fsync.
                    conn.execute("PRAGMA synchronous=NORMAL")
                except sqlite3.DatabaseError:
                    pass  # read-only media or an exotic mount: fall back to the default journal
                _wal_done.add(key)
    return conn


def db_file(conn: sqlite3.Connection) -> str:
    """The main database file behind ``conn`` (``''`` for :memory:)."""
    row = conn.execute("PRAGMA database_list").fetchone()
    return str(row[2]) if row else ""


def _finish(key: tuple[str, str]) -> None:
    with _lock:
        _schema_state[key] = "done"
        ev = _schema_events.pop(key, None)
    if ev is not None:
        ev.set()


def schema_once(conn: sqlite3.Connection, name: str) -> bool:
    """True for the ONE caller that should run ``name``'s DDL on this database file.

    Every other caller blocks until that DDL has committed (the first caller's
    ``with conn:`` block exit, or a bounded wait) and then gets False. Marking "done" on
    the way in — as the first version did — let a second thread skip the CREATE TABLE
    the first was still running and fail on a table that did not exist yet.

    Callers use it as ``if not schema_once(conn, "cameras"): return`` inside a
    ``with _connect() as conn:`` block.
    """
    key = (db_file(conn), name)
    with _lock:
        state = _schema_state.get(key)
        if state == "done":
            return False
        if state == "pending":
            ev = _schema_events[key]
            first = False
        else:
            _schema_state[key] = "pending"
            ev = _schema_events[key] = threading.Event()
            first = True
    if first:
        hooks = getattr(conn, "_dsc_on_exit", None)
        if hooks is not None:
            hooks.append(lambda: _finish(key))
        else:
            _finish(key)  # untracked connection: no completion signal, keep the old semantics
        return True
    ev.wait(SCHEMA_WAIT_S)
    return False


def ensure_schema(conn: sqlite3.Connection, name: str, sql: str) -> None:
    """Run ``sql`` (a DDL script) once per database file per process, synchronously."""
    key = (db_file(conn), name)
    if _schema_state.get(key) == "done":
        return
    with _lock:
        if _schema_state.get(key) == "done":
            return
        pending = _schema_state.get(key) == "pending"
        if not pending:
            _schema_state[key] = "pending"
            _schema_events.setdefault(key, threading.Event())
    if pending:
        # Another caller (via schema_once) owns the DDL; wait for it rather than racing.
        ev = _schema_events.get(key)
        if ev is not None:
            ev.wait(SCHEMA_WAIT_S)
        return
    try:
        conn.executescript(sql)
    finally:
        _finish(key)


def reset_schema_cache() -> None:
    """Forget every schema pass — after a factory reset drops the tables, or between tests."""
    with _lock:
        _schema_state.clear()
        _schema_events.clear()
        _wal_done.clear()
