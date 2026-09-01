# brain/tests/test_live_ux_light_honesty.py
"""Pass 1 — Light honesty guards (estimate labels, suggestions never apply, confirm gate, journal provenance)."""

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


def test_both_spaces_estimate_labeled_and_suggestions_never_apply(client: TestClient) -> None:
    for sid in ("4x8", "2x4"):
        est = client.get("/energy/estimate", params={"space_id": sid, "lights_on": "06:00:00", "want_hours": 12})
        assert est.status_code == 200 and est.json().get("ok") is True
        assert "Estimate" in (est.json().get("estimate_label") or "Estimate")
        sug = client.get("/energy/suggestions", params={"space_id": sid, "lights_on": "06:00:00", "want_hours": 12})
        assert sug.json().get("apply") is False
        assert all(s.get("apply") is False for s in sug.json().get("suggestions") or [])


def test_shift_confirm_gate_both_spaces(client: TestClient) -> None:
    for sid in ("4x8", "2x4"):
        bad = client.post(
            "/energy/shift/plan",
            json={
                "space_id": sid,
                "from_on": "06:00:00",
                "to_on": "08:00:00",
                "want_hours": 12,
                "policy": "pause",
                "confirm": False,
            },
        )
        assert bad.status_code == 400


def test_journal_space_provenance_both_spaces(client: TestClient) -> None:
    notes = {"2x4": "light honesty 2x4", "4x8": "light honesty 4x8"}
    for sid, note in notes.items():
        posted = client.post(f"/journal/space/{sid}", json={"note": note})
        assert posted.status_code == 200
        body = posted.json()
        assert body["note"] == note
        assert body["space_id"] == sid
        assert body["provenance"] == "space"
        assert body["source"] == "operator"

    for sid, note in notes.items():
        listed = client.get(f"/journal/space/{sid}")
        assert listed.status_code == 200
        assert listed.json()["space_id"] == sid
        matches = [e for e in listed.json()["entries"] if e["note"] == note]
        assert len(matches) >= 1
        entry = matches[0]
        assert entry["space_id"] == sid
        assert entry["provenance"] == "space"
        assert entry["source"] == "operator"
