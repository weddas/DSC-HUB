# brain/tests/test_live_ux_overview_honesty.py
"""Pass 3 — Overview honesty guards (journal stack reachable, grow_room present)."""

from __future__ import annotations

from pathlib import Path

import pytest
from fastapi.testclient import TestClient


def _point_db(monkeypatch: pytest.MonkeyPatch, temp_db: Path) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    monkeypatch.setattr("dsc_brain.paths.DEFAULT_DB", temp_db)
    for mod in (
        "dsc_brain.settings",
        "dsc_brain.compose_store",
        "dsc_brain.plant_journal",
        "dsc_brain.space_journal",
        "dsc_brain.space_model",
        "dsc_brain.room_model",
        "dsc_brain.room_journal",
        "dsc_brain.dsc_core_journal",
        "dsc_brain.facility_journal",
        "dsc_brain.energy_model",
        "dsc_brain.energy_learning",
        "dsc_brain.schedule_shift",
        "dsc_brain.photoperiod_conflict",
        "dsc_brain.space_occupants",
    ):
        try:
            monkeypatch.setattr(f"{mod}.DEFAULT_DB", temp_db)
        except Exception:
            pass


@pytest.fixture()
def client(temp_db: Path, monkeypatch: pytest.MonkeyPatch):
    _point_db(monkeypatch, temp_db)
    from dsc_brain.api import app
    from dsc_brain.room_model import ensure_kit_rooms
    from dsc_brain.space_model import ensure_kit_spaces

    ensure_kit_spaces(temp_db)
    ensure_kit_rooms(temp_db)
    with TestClient(app) as c:
        yield c


def test_overview_journal_stack_reachable(client: TestClient) -> None:
    assert client.get("/rooms").status_code == 200
    assert "grow_room" in {r["room_id"] for r in client.get("/rooms").json()["rooms"]}
    assert client.get("/journal/room/grow_room").status_code == 200
    assert client.get("/journal/core").status_code == 200
    assert client.get("/health").status_code == 200
