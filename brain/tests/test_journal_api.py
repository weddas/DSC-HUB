# brain/tests/test_journal_api.py
from pathlib import Path

import pytest


def test_journal_space_energy_api(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from fastapi.testclient import TestClient

    from dsc_brain.api import app

    client = TestClient(app)

    plant = client.post("/journal/plant/plant:api-test", json={"note": "Leaf observation", "tags": ["obs"]})
    assert plant.status_code == 200
    assert plant.json()["note"] == "Leaf observation"

    listed = client.get("/journal/plant/plant:api-test")
    assert listed.status_code == 200
    assert len(listed.json()["entries"]) >= 1

    space_post = client.post("/journal/space/2x4", json={"note": "Tent humidity note"})
    assert space_post.status_code == 200

    spaces = client.get("/spaces")
    assert spaces.status_code == 200
    ids = {s["space_id"] for s in spaces.json()["spaces"]}
    assert "2x4" in ids and "4x8" in ids

    est = client.get("/energy/estimate", params={"space_id": "2x4", "lights_on": "06:00:00", "want_hours": 12})
    assert est.status_code == 200
    assert est.json()["ok"] is True
    assert "Estimate" in est.json()["estimate_label"]

    sugg = client.get(
        "/energy/suggestions",
        params={"space_id": "2x4", "lights_on": "06:00:00", "want_hours": 12},
    )
    assert sugg.status_code == 200
    assert sugg.json()["apply"] is False
    assert all(s.get("apply") is False for s in sugg.json()["suggestions"])

    bad = client.post(
        "/energy/shift/plan",
        json={
            "space_id": "2x4",
            "from_on": "06:00:00",
            "to_on": "22:00:00",
            "want_hours": 12,
            "policy": "veg_style",
            "confirm": False,
        },
    )
    assert bad.status_code == 400

    ok_plan = client.post(
        "/energy/shift/plan",
        json={
            "space_id": "2x4",
            "from_on": "06:00:00",
            "to_on": "22:00:00",
            "want_hours": 12,
            "policy": "pause",
            "confirm": True,
        },
    )
    assert ok_plan.status_code == 200
    assert ok_plan.json()["status"] == "paused"

    flip = client.post(
        "/energy/flip/request",
        json={"space_id": "2x4", "plant_id": "plant:api-test", "from_hours": 18, "to_hours": 12},
    )
    assert flip.status_code == 200
    assert flip.json()["status"] == "pending"

    from dsc_brain.compose_store import get_helper

    # Flip must not mutate lights-on helper
    before = get_helper("time.dsc_hub_clone_lights_on_time", None)
    pending = client.get("/energy/shift/pending-flips")
    assert pending.status_code == 200
    assert any(f["status"] == "pending" for f in pending.json()["flips"])
    after = get_helper("time.dsc_hub_clone_lights_on_time", None)
    assert before == after

    conflicts = client.get(
        "/energy/conflicts",
        params={"space_id": "2x4", "plant_id": "plant:api-test", "plant_want_hours": 12, "space_want_hours": 18},
    )
    assert conflicts.status_code == 200
    assert conflicts.json()["auto_apply"] is False
    assert conflicts.json()["banners"]

    rooms = client.get("/rooms")
    assert rooms.status_code == 200
    room_ids = {r["room_id"] for r in rooms.json()["rooms"]}
    assert "grow_room" in room_ids

    room_post = client.post("/journal/room/grow_room", json={"note": "Room HVAC observation"})
    assert room_post.status_code == 200
    room_list = client.get("/journal/room/grow_room")
    assert room_list.status_code == 200
    assert any(e["note"] == "Room HVAC observation" for e in room_list.json()["entries"])

    core_post = client.post("/journal/core", json={"note": "Facility power note"})
    assert core_post.status_code == 200
    core_list = client.get("/journal/core")
    assert core_list.status_code == 200
    assert any(e["note"] == "Facility power note" for e in core_list.json()["entries"])
    alias = client.get("/journal/dsc-core")
    assert alias.status_code == 200
    assert len(alias.json()["entries"]) >= 1
