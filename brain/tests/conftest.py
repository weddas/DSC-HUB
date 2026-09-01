"""Shared pytest fixtures for brain tests."""

from __future__ import annotations

import tempfile
from pathlib import Path

import pytest

from dsc_brain.settings import init_settings_db


@pytest.fixture()
def temp_db(monkeypatch: pytest.MonkeyPatch) -> Path:
    # ignore_cleanup_errors: Windows often locks dsc_ops.sqlite3 briefly after TestClient.
    with tempfile.TemporaryDirectory(ignore_cleanup_errors=True) as tmp:
        db = Path(tmp) / "dsc_ops.sqlite3"
        monkeypatch.setenv("DSC_DATA", str(Path(tmp)))
        init_settings_db(db)
        yield db
