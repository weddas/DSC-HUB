# brain/tests/test_journal_crud.py
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from dsc_brain.plant_journal import add_plant_entry


@pytest.fixture()
def client(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> TestClient:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    monkeypatch.setattr("dsc_brain.paths.DEFAULT_DB", temp_db)
    for mod in (
        "dsc_brain.plant_journal",
        "dsc_brain.space_journal",
        "dsc_brain.room_journal",
        "dsc_brain.dsc_core_journal",
    ):
        monkeypatch.setattr(f"{mod}.DEFAULT_DB", temp_db)
    from dsc_brain.api import app

    return TestClient(app)


def test_patch_operator_entry(client: TestClient) -> None:
    created = client.post("/journal/plant/plant:crud", json={"note": "before edit", "tags": ["a"]})
    assert created.status_code == 200
    entry_id = created.json()["id"]

    resp = client.patch(
        f"/journal/plant/plant:crud/{entry_id}",
        json={"note": "after edit", "tags": ["highlight"], "growth_stage": "Vegetative"},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["note"] == "after edit"
    assert body["tags"] == ["highlight"]
    assert body["snapshot"]["growth_stage"] == "Vegetative"
    assert body["source"] == "operator"


def test_patch_system_entry_forbidden(client: TestClient) -> None:
    row = add_plant_entry(
        "plant:sys",
        1000.0,
        "system row",
        source="system",
        tags=["dark_violation"],
    )
    resp = client.patch(
        f"/journal/plant/plant:sys/{row['id']}",
        json={"note": "should fail"},
    )
    assert resp.status_code == 403


def test_delete_operator_entry(client: TestClient) -> None:
    created = client.post("/journal/plant/plant:del", json={"note": "delete me"})
    assert created.status_code == 200
    entry_id = created.json()["id"]

    deleted = client.delete(f"/journal/plant/plant:del/{entry_id}")
    assert deleted.status_code == 200
    assert deleted.json()["ok"] is True

    listed = client.get("/journal/plant/plant:del")
    assert listed.status_code == 200
    assert listed.json()["total"] == 0
    assert listed.json()["entries"] == []


def test_delete_system_entry_forbidden(client: TestClient) -> None:
    row = add_plant_entry(
        "plant:sys-del",
        1000.0,
        "system row",
        source="system",
    )
    resp = client.delete(f"/journal/plant/plant:sys-del/{row['id']}")
    assert resp.status_code == 403


def test_get_journal_pagination(client: TestClient) -> None:
    plant_id = "plant:page"
    for i in range(15):
        resp = client.post(f"/journal/plant/{plant_id}", json={"note": f"note-{i}", "occurred_at": 2000.0 + i})
        assert resp.status_code == 200

    page1 = client.get(f"/journal/plant/{plant_id}", params={"limit": 10, "offset": 0})
    assert page1.status_code == 200
    body1 = page1.json()
    assert body1["total"] == 15
    assert body1["limit"] == 10
    assert body1["offset"] == 0
    assert len(body1["entries"]) == 10

    page2 = client.get(f"/journal/plant/{plant_id}", params={"limit": 10, "offset": 10})
    assert page2.status_code == 200
    body2 = page2.json()
    assert body2["total"] == 15
    assert body2["limit"] == 10
    assert body2["offset"] == 10
    assert len(body2["entries"]) == 5
