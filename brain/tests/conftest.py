"""Shared pytest fixtures for brain tests."""

from __future__ import annotations

import os
import tempfile
from pathlib import Path

import pytest

from dsc_brain.settings import init_settings_db


@pytest.fixture(autouse=True, scope="session")
def _never_touch_the_real_data_dir() -> Path:
    """Point DSC_DATA at a scratch dir for the WHOLE session, before any test runs.

    Without this, a test that exercises an ingest/climate path with no ``temp_db`` writes
    into ``brain/data/dsc_ops.sqlite3`` — the developer's own ops database. That was
    invisible while the only side effect was an extra grow-log row; it stopped being
    invisible when the leaf-VPD advisory started persisting a "already announced" settings
    key, because a test run could then suppress a real one-time advisory.

    Session-scoped and set via ``os.environ`` rather than monkeypatch so that subprocesses
    spawned by tests (the toolchain and usb-flash suites) inherit it too — a child process
    is exactly how the last stray write was escaping.

    Per-test ``temp_db`` still overrides this with its own directory.
    """
    with tempfile.TemporaryDirectory(ignore_cleanup_errors=True) as tmp:
        previous = os.environ.get("DSC_DATA")
        os.environ["DSC_DATA"] = tmp
        init_settings_db(Path(tmp) / "dsc_ops.sqlite3")
        try:
            yield Path(tmp)
        finally:
            if previous is None:
                os.environ.pop("DSC_DATA", None)
            else:
                os.environ["DSC_DATA"] = previous


@pytest.fixture()
def temp_db(monkeypatch: pytest.MonkeyPatch) -> Path:
    # ignore_cleanup_errors: Windows often locks dsc_ops.sqlite3 briefly after TestClient.
    with tempfile.TemporaryDirectory(ignore_cleanup_errors=True) as tmp:
        db = Path(tmp) / "dsc_ops.sqlite3"
        monkeypatch.setenv("DSC_DATA", str(Path(tmp)))
        init_settings_db(db)
        yield db
