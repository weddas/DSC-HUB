"""Unknown brain-API paths must 404 as JSON, never serve the SPA index with 200.

Live finding 2026-09-06: a newer SPA calling a route an older brain lacks
(e.g. /settings/automations/targets) got index.html back and failed as a JSON
parse error instead of a clean 404.
"""

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
        monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", db)
        init_settings_db(db)
        yield db


def test_is_api_path_classifies_first_segment() -> None:
    from dsc_brain.api import is_api_path

    assert is_api_path("settings/automations/targets")
    assert is_api_path("settings")
    assert is_api_path("WS/fleet")
    assert is_api_path("control/service")
    assert not is_api_path("dsc-catalog/ppfd/manifest.json")
    assert not is_api_path("grow/logs")
    assert not is_api_path("")


def test_unknown_settings_route_is_json_404(temp_db: Path) -> None:
    from fastapi.testclient import TestClient

    from dsc_brain.api import app

    client = TestClient(app)
    resp = client.get("/settings/no-such-route")
    assert resp.status_code == 404
    assert resp.headers["content-type"].startswith("application/json")
    assert "no such brain route" in resp.json()["detail"]

    resp = client.get("/fleet/nope/deeper")
    assert resp.status_code == 404
    assert resp.headers["content-type"].startswith("application/json")
