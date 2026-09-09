"""db.migrate: ordered, append-only, recorded per database file, resumable."""

from __future__ import annotations

from pathlib import Path

import pytest

from dsc_brain import db as dsc_db

V1 = "CREATE TABLE IF NOT EXISTS widgets (id INTEGER PRIMARY KEY, name TEXT);"
V2 = "ALTER TABLE widgets ADD COLUMN colour TEXT;"


def _cols(conn, table: str) -> list[str]:
    return [r[1] for r in conn.execute(f"PRAGMA table_info({table})")]


def test_migrate_records_version_and_applies_in_order(tmp_path: Path) -> None:
    dsc_db.reset_schema_cache()
    path = tmp_path / "m.sqlite3"
    conn = dsc_db.open_db(path)
    assert dsc_db.migrate(conn, "widgets", [V1]) == 1
    assert dsc_db.schema_version(conn, "widgets") == 1
    assert _cols(conn, "widgets") == ["id", "name"]
    conn.close()

    # A later release appends a step: only the new step runs.
    dsc_db.reset_schema_cache()
    conn = dsc_db.open_db(path)
    assert dsc_db.migrate(conn, "widgets", [V1, V2]) == 2
    assert _cols(conn, "widgets") == ["id", "name", "colour"]
    assert dsc_db.schema_version(conn, "widgets") == 2
    conn.close()

    # Re-running with the same steps is a no-op (ALTER would otherwise fail).
    dsc_db.reset_schema_cache()
    conn = dsc_db.open_db(path)
    assert dsc_db.migrate(conn, "widgets", [V1, V2]) == 2
    conn.close()


def test_failed_step_leaves_previous_version(tmp_path: Path) -> None:
    dsc_db.reset_schema_cache()
    path = tmp_path / "f.sqlite3"
    conn = dsc_db.open_db(path)
    with pytest.raises(Exception):
        dsc_db.migrate(conn, "widgets", [V1, "ALTER TABLE nope ADD COLUMN x TEXT;"])
    assert dsc_db.schema_version(conn, "widgets") == 1
    assert _cols(conn, "widgets") == ["id", "name"]
    conn.close()


def test_pre_mechanism_database_adopts_version_one(tmp_path: Path) -> None:
    """A database whose tables were created by the old CREATE-on-connect path."""
    dsc_db.reset_schema_cache()
    path = tmp_path / "old.sqlite3"
    conn = dsc_db.open_db(path)
    conn.executescript(V1)
    conn.commit()
    assert dsc_db.schema_version(conn, "widgets") == 0
    assert dsc_db.migrate(conn, "widgets", [V1]) == 1
    conn.close()
