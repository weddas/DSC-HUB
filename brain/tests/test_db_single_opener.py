"""Every database is opened through db.open_db — with one documented exception.

open_db carries the busy timeout, Row factory and once-per-process WAL that the 2026-09-09
request-flood outage taught us to want everywhere. A bare sqlite3.connect skips all three,
and the skip is invisible until something contends for the file.
"""

from __future__ import annotations

import re
from pathlib import Path

BRAIN = Path(__file__).resolve().parents[1] / "dsc_brain"

# The ONE legitimate direct connect: the CannaLib catalog is opened read-only. open_db
# would mkdir its parent and set journal_mode=WAL, and WAL on a read-only mount is exactly
# what made every catalog query silently return 0 rows on 7.0.0.
READ_ONLY_EXCEPTIONS = {"integrations.py"}

_CONNECT = re.compile(r"\bsqlite3\.connect\s*\(")


def test_only_db_py_and_the_read_only_catalog_open_sqlite_directly() -> None:
    offenders: list[str] = []
    for path in sorted(BRAIN.glob("*.py")):
        if path.name in {"db.py", *READ_ONLY_EXCEPTIONS}:
            continue
        for i, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
            if _CONNECT.search(line) and not line.lstrip().startswith("#"):
                offenders.append(f"{path.name}:{i}: {line.strip()}")

    assert not offenders, (
        "these open sqlite directly instead of via db.open_db:\n  "
        + "\n  ".join(offenders)
        + "\nUse open_db unless the database is genuinely read-only; if it is, add the "
        "module to READ_ONLY_EXCEPTIONS here with a comment saying why."
    )


def test_the_read_only_exception_is_still_read_only() -> None:
    """If that connect ever loses its ro guard, the exception above stops being valid."""
    source = (BRAIN / "integrations.py").read_text(encoding="utf-8")
    assert "?mode=ro" in source, "the catalog connect must stay read-only"
    assert "PRAGMA query_only=ON" in source, "the read-only contract must be enforced, not assumed"
