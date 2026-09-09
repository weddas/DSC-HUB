"""Concurrent first use of a fresh database: the second thread must not skip DDL the first
has not finished, and must not fail on a missing table."""

from __future__ import annotations

import threading
import time
from pathlib import Path

from dsc_brain import db as dsc_db


def _init_slow(path: Path, name: str, delay: float) -> None:
    with dsc_db.open_db(path) as conn:
        if not dsc_db.schema_once(conn, name):
            return
        time.sleep(delay)  # simulate a slow DDL window
        conn.execute("CREATE TABLE IF NOT EXISTS t_race (id INTEGER PRIMARY KEY, v TEXT)")


def test_second_thread_waits_for_first_ddl(tmp_path: Path) -> None:
    dsc_db.reset_schema_cache()
    path = tmp_path / "race.sqlite3"
    errors: list[BaseException] = []

    def worker(delay: float, insert: str) -> None:
        try:
            _init_slow(path, "race", delay)
            conn = dsc_db.open_db(path)
            conn.execute("INSERT INTO t_race(v) VALUES (?)", (insert,))
            conn.commit()
            conn.close()
        except BaseException as exc:  # noqa: BLE001
            errors.append(exc)

    a = threading.Thread(target=worker, args=(0.4, "a"))
    b = threading.Thread(target=worker, args=(0.0, "b"))
    a.start()
    time.sleep(0.05)  # a wins the schema slot and is now inside its DDL window
    b.start()
    a.join(10)
    b.join(10)
    assert not errors, errors
    conn = dsc_db.open_db(path)
    assert conn.execute("SELECT COUNT(*) FROM t_race").fetchone()[0] == 2
    conn.close()


def test_ensure_schema_runs_once_and_marks_done(tmp_path: Path) -> None:
    dsc_db.reset_schema_cache()
    path = tmp_path / "once.sqlite3"
    c1 = dsc_db.open_db(path)
    dsc_db.ensure_schema(c1, "x", "CREATE TABLE IF NOT EXISTS t1 (id INTEGER);")
    c1.close()
    c2 = dsc_db.open_db(path)
    assert dsc_db.schema_once(c2, "x") is False  # already done for this file
    c2.close()
