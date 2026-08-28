"""Shared pytest fixtures for brain tests."""

from __future__ import annotations

import tempfile
from pathlib import Path

import pytest

from dsc_brain.settings import init_settings_db


@pytest.fixture()
def temp_db(monkeypatch: pytest.MonkeyPatch) -> Path:
    with tempfile.TemporaryDirectory() as tmp:
        db = Path(tmp) / "dsc_ops.sqlite3"
        monkeypatch.setenv("DSC_DATA", str(Path(tmp)))
        init_settings_db(db)
        yield db
