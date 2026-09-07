# brain/tests/test_zone_model.py — zones: rooms + spaces with a role that flips in place.
from pathlib import Path

import pytest

from dsc_brain.space_journal import list_space_native
from dsc_brain.zone_model import ZONE_ROLES, get_zone, list_zones, patch_zone


def test_kit_zones_default_roles(tmp_path: Path) -> None:
    db = tmp_path / "ops.sqlite3"
    zones = {z["zone_id"]: z for z in list_zones(db)}
    assert {"grow_room", "4x8", "2x4"} <= set(zones)
    assert zones["4x8"]["role"] == "grow"
    assert zones["4x8"]["parent"] == "grow_room"
    assert zones["4x8"]["parent_label"]
    assert zones["grow_room"]["role"] == "room"
    assert set(zones["grow_room"]["children"]) == {"4x8", "2x4"}
    assert set(ZONE_ROLES) == {"grow", "dry", "cure", "empty"}


def test_role_flip_persists_and_journals(tmp_path: Path) -> None:
    db = tmp_path / "ops.sqlite3"
    res = patch_zone("4x8", {"role": "dry"}, db_path=db, fleet={}, now=1000.0)
    assert res["changed"]["role"] == {"from": "grow", "to": "dry"}
    assert res["journal_entry"] is not None
    z = get_zone("4x8", db)
    assert z["role"] == "dry"
    assert z["role_since"] == 1000.0
    assert z["role_history"][-1] == {"from": "grow", "to": "dry", "at": 1000.0}
    entries = list_space_native("4x8", db_path=db)
    assert len(entries) == 1
    assert entries[0]["source"] == "system"
    assert "Grow → Dry" in entries[0]["note"]
    assert "role" in entries[0]["tags"] and "dry" in entries[0]["tags"]
    # Same role again is a no-op: nothing changes, nothing is written.
    again = patch_zone("4x8", {"role": "dry"}, db_path=db, fleet={})
    assert again["changed"] == {}
    assert again["journal_entry"] is None
    assert len(list_space_native("4x8", db_path=db)) == 1
    # Back to grow is a second history row.
    back = patch_zone("4x8", {"role": "grow"}, db_path=db, fleet={}, now=2000.0)
    assert back["changed"]["role"] == {"from": "dry", "to": "grow"}
    assert [h["to"] for h in get_zone("4x8", db)["role_history"]] == ["dry", "grow"]


def test_rename_notes_and_rejections(tmp_path: Path) -> None:
    db = tmp_path / "ops.sqlite3"
    res = patch_zone("2x4", {"name": "  Clone tent  ", "notes": "north wall"}, db_path=db, fleet={})
    assert res["journal_entry"] is None
    z = get_zone("2x4", db)
    assert z["name"] == "Clone tent" and z["notes"] == "north wall"
    assert z["role"] == "grow"
    with pytest.raises(ValueError):
        patch_zone("2x4", {"role": "wet"}, db_path=db, fleet={})
    with pytest.raises(ValueError):
        patch_zone("2x4", {"name": "   "}, db_path=db, fleet={})
    with pytest.raises(ValueError):
        patch_zone("grow_room", {"role": "dry"}, db_path=db, fleet={})
    with pytest.raises(KeyError):
        patch_zone("nope", {"role": "dry"}, db_path=db, fleet={})
    # Rooms can be renamed.
    room = patch_zone("grow_room", {"name": "Bedroom 2"}, db_path=db, fleet={})
    assert room["zone"]["name"] == "Bedroom 2"
    assert get_zone("4x8", db)["parent_label"] == "Bedroom 2"


def test_zones_api(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    # The space/room/journal modules bind DEFAULT_DB at import time — point them at the
    # temp DB so the API test never writes into the developer's local brain database.
    from dsc_brain import room_model, space_journal, space_model

    for mod in (room_model, space_journal, space_model):
        monkeypatch.setattr(mod, "DEFAULT_DB", temp_db, raising=False)
    from fastapi.testclient import TestClient

    from dsc_brain.api import app

    client = TestClient(app)
    listed = client.get("/zones")
    assert listed.status_code == 200
    body = listed.json()
    assert {z["zone_id"] for z in body["zones"]} >= {"grow_room", "4x8", "2x4"}
    assert body["roles"] == ["grow", "dry", "cure", "empty"]
    assert body["effects"]["does_not"]["all"]

    flipped = client.patch("/zones/2x4", json={"role": "dry"})
    assert flipped.status_code == 200
    assert flipped.json()["zone"]["role"] == "dry"
    assert flipped.json()["changed"]["role"] == {"from": "grow", "to": "dry"}
    assert flipped.json()["journal_entry"]["source"] == "system"
    assert client.get("/zones").json()["zones"][-1]["role"] in ("dry", "grow")  # ordering-independent smoke

    bad = client.patch("/zones/2x4", json={"role": "wet"})
    assert bad.status_code == 400
    missing = client.patch("/zones/nope", json={"role": "dry"})
    assert missing.status_code == 404
