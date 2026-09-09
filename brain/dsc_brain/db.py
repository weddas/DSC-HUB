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
_schema_done: set[tuple[str, str]] = set()


def _key(path: Path) -> str:
    try:
        return str(path.resolve())
    except OSError:
        return str(path)


def open_db(path: Path | str) -> sqlite3.Connection:
    """Open ``path`` with Row rows, a busy timeout and (once per process) WAL journaling."""
    p = Path(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(p), timeout=BUSY_TIMEOUT_S)
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


def schema_once(conn: sqlite3.Connection, name: str) -> bool:
    """True the first time ``name``'s schema should run for this database in this process.

    Callers do ``if not schema_once(conn, "cameras"): return`` at the top of their
    ``CREATE TABLE IF NOT EXISTS`` block so the DDL (and its write lock) runs once at first
    use instead of on every request.
    """
    key = (db_file(conn), name)
    if key in _schema_done:
        return False
    with _lock:
        if key in _schema_done:
            return False
        _schema_done.add(key)
    return True


def ensure_schema(conn: sqlite3.Connection, name: str, sql: str) -> None:
    """Run ``sql`` (a DDL script) once per database file per process."""
    if schema_once(conn, name):
        conn.executescript(sql)


def reset_schema_cache() -> None:
    """Forget every schema pass — after a factory reset drops the tables, or between tests."""
    with _lock:
        _schema_done.clear()
        _wal_done.clear()
