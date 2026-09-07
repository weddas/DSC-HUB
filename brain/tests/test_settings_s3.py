"""Settings Pass S3: alert prefs, automation defaults, settings journal, journals & storage, archive."""

from __future__ import annotations

import json
import time
import zipfile
import io
from pathlib import Path

import pytest


@pytest.fixture()
def db(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> Path:
    monkeypatch.setenv("DSC_DATA", str(tmp_path))
    path = tmp_path / "dsc_ops.sqlite3"
    from dsc_brain import dsc_core_journal, journal_snapshot, plant_journal, room_model, settings, space_journal, space_model

    for mod in (settings, dsc_core_journal, journal_snapshot, plant_journal, space_journal, space_model, room_model):
        monkeypatch.setattr(mod, "DEFAULT_DB", path, raising=False)
    settings.init_settings_db(path)
    return path


def _client():
    from fastapi.testclient import TestClient

    from dsc_brain.api import app

    return TestClient(app)


def test_alert_prefs_roundtrip_and_guards(db: Path) -> None:
    from dsc_brain.alert_prefs import FAILSAFE_ID, get_alert_prefs, patch_alert_prefs

    assert get_alert_prefs() == {"alerts": {}, "quiet_hours": None}
    out = patch_alert_prefs({"alerts": {"binary_sensor.dsc_hub_aux_sensor_fault": {"enabled": False, "severity": "warn"}}, "quiet_hours": {"start": "22:00", "end": "07:00"}})
    assert out["alerts"]["binary_sensor.dsc_hub_aux_sensor_fault"] == {"enabled": False, "severity": "warn"}
    assert out["quiet_hours"] == {"start": "22:00", "end": "07:00"}
    with pytest.raises(ValueError):
        patch_alert_prefs({"alerts": {FAILSAFE_ID: {"enabled": False}}})
    with pytest.raises(ValueError):
        patch_alert_prefs({"alerts": {"x": {"severity": "loud"}}})
    with pytest.raises(ValueError):
        patch_alert_prefs({"quiet_hours": {"start": "22:00", "end": "22:00"}})
    assert patch_alert_prefs({"quiet_hours": None})["quiet_hours"] is None


def test_automation_defaults(db: Path) -> None:
    from dsc_brain.automation_defaults import get_automation_defaults, patch_automation_defaults

    assert get_automation_defaults() == {"debounce_s": 0, "release_s": 0, "window": None}
    out = patch_automation_defaults({"debounce_s": 120, "window": {"start": "20:00", "end": "06:00"}})
    assert out["debounce_s"] == 120 and out["window"]["start"] == "20:00"
    with pytest.raises(ValueError):
        patch_automation_defaults({"release_s": -1})
    assert patch_automation_defaults({"window": None})["window"] is None


def test_settings_patch_journals_changes_and_masks_secrets(db: Path) -> None:
    from dsc_brain.dsc_core_journal import list_core_native

    client = _client()
    r = client.patch("/settings", json={"settings": {"leaf_offset_c": "1.5", "cannalib_api_key": "k-1"}})
    assert r.status_code == 200
    notes = [e["note"] for e in list_core_native(limit=20)]
    assert any("Leaf-to-air offset: 2 → 1.5 (operator)" in n for n in notes)
    key_notes = [n for n in notes if "CannaLib API key" in n]
    assert key_notes and "k-1" not in key_notes[0] and "(set)" in key_notes[0]
    # Unchanged value → no entry.
    before = len(list_core_native(limit=50))
    client.patch("/settings", json={"settings": {"leaf_offset_c": "1.5"}})
    assert len(list_core_native(limit=50)) == before
    # Tagged view for the Logs "Settings changes" scope.
    tagged = client.get("/journal/core?tag=settings").json()
    assert tagged["total"] >= 2 and all("settings" in e["tags"] for e in tagged["entries"])


def test_journal_retention_preview_confirm_and_archive_immunity(db: Path) -> None:
    from dsc_brain.journal_storage import archive_plant, get_retention, preview_retention, prune_journals
    from dsc_brain.plant_journal import add_plant_entry

    old = time.time() - 40 * 86400
    add_plant_entry("plant:aaa", old, "old note", db_path=db)
    add_plant_entry("plant:aaa", None, "fresh note", db_path=db)
    add_plant_entry("plant:bbb", old, "old archived", db_path=db)
    archive_plant("plant:bbb", reason="retired", header={"nickname": "Bee"}, db_path=db)

    pv = preview_retention("plant", 30, db_path=db)
    assert pv["would_delete"] == 1  # plant:aaa's old row; plant:bbb is archived → immune
    assert preview_retention("plant", 0, db_path=db)["would_delete"] == 0

    client = _client()
    # Without confirm nothing is stored or deleted.
    r = client.patch("/settings/journals", json={"retention": {"plant": 30}})
    assert r.status_code == 200 and r.json()["stored"] is False and r.json()["would_delete"] == 1
    assert get_retention()["plant"] == 0
    r = client.patch("/settings/journals", json={"retention": {"plant": 30}, "confirm": True})
    assert r.json()["stored"] is True and r.json()["removed"] == {"plant": 1}
    assert get_retention()["plant"] == 30
    assert prune_journals(db_path=db) == {"plant": 0}
    with pytest.raises(ValueError):
        preview_retention("nope", 1, db_path=db)


def test_storage_stats_and_exports(db: Path) -> None:
    from dsc_brain.plant_journal import add_plant_entry

    add_plant_entry("plant:aaa", None, "hello, csv", tags=["note"], db_path=db)
    client = _client()
    stats = client.get("/settings/journals").json()
    kinds = {j["kind"]: j for j in stats["journals"]}
    assert kinds["plant"]["rows"] == 1 and kinds["plant"]["retention_days"] == 0
    assert stats["db_bytes"] > 0
    shares = sum(j["share_bytes"] for j in stats["journals"]) + stats["fleet_history"]["share_bytes"] + stats["archive"]["share_bytes"]
    assert abs(shares - stats["db_bytes"]) <= max(64, stats["db_bytes"] * 0.1)

    js = client.get("/journals/export?kind=plant&id=plant:aaa&format=json")
    assert js.status_code == 200 and js.json()["count"] == 1 and js.json()["entries"][0]["note"] == "hello, csv"
    assert js.json()["entries"][0]["tags"] == ["note"]
    cs = client.get("/journals/export?kind=plant&format=csv")
    assert cs.status_code == 200 and "hello, csv" in cs.text and cs.text.startswith("id,")
    assert client.get("/journals/export?kind=nope").status_code == 400
    z = client.get("/journals/export.zip?kinds=plant,core")
    names = zipfile.ZipFile(io.BytesIO(z.content)).namelist()
    assert any(n.startswith("dsc-plant-") and n.endswith(".json") for n in names)
    assert any(n.startswith("dsc-core-") and n.endswith(".csv") for n in names)


def test_archive_roster_slot_and_grow_record_export(db: Path) -> None:
    from dsc_brain.journal_storage import archive_roster_slot, get_archive, list_archives
    from dsc_brain.plant_journal import add_plant_entry
    from dsc_brain.space_journal import add_space_entry

    add_plant_entry("plant:cc1", None, "topped", db_path=db)
    add_space_entry("4x8", None, "role flip", source="system", db_path=db)
    slot = {"slot": 3, "plant_uuid": "plant:cc1", "nickname": "Ceecee", "strain": "Test OG", "sprout": "2026-08-01", "tent": "4x8", "pot": "1"}
    out = archive_roster_slot(slot, reason="harvested", db_path=db)
    assert out and out["entry_count"] == 1 and out["tent_entry_count"] == 1 and out["nickname"] == "Ceecee"
    listed = list_archives(db_path=db)
    assert listed[0]["plant_id"] == "plant:cc1" and listed[0]["reason"] == "harvested"
    full = get_archive(listed[0]["id"], db_path=db)
    assert full["entries"][0]["note"] == "topped" and "snapshot" in full["entries"][0]

    client = _client()
    z = client.get(f"/journals/archive/{listed[0]['id']}/export")
    assert z.status_code == 200
    names = zipfile.ZipFile(io.BytesIO(z.content)).namelist()
    assert {"grow-record.json", "plant-journal.csv", "tent-journal.csv", "header.json"} <= set(names)
    assert client.get("/journals/archive/999/export").status_code == 404
    assert client.get("/journals/archive").json()["archives"][0]["nickname"] == "Ceecee"
    # A slot with no plant id is a no-op, never an error.
    assert archive_roster_slot({"slot": 4}, db_path=db) is None


def test_alerts_and_defaults_routes(db: Path) -> None:
    client = _client()
    a = client.get("/settings/alerts").json()
    assert a["alerts"] == {} and a["failsafe_id"].endswith("emergency_failsafe")
    r = client.patch("/settings/alerts", json={"alerts": {"binary_sensor.dsc_hub_aux_sensor_fault": {"enabled": False}}, "quiet_hours": {"start": "22:00", "end": "06:30"}})
    assert r.status_code == 200 and r.json()["quiet_hours"]["end"] == "06:30"
    assert client.patch("/settings/alerts", json={"alerts": {a["failsafe_id"]: {"enabled": False}}}).status_code == 400
    assert client.patch("/settings/alerts", json={"clear_quiet_hours": True}).json()["quiet_hours"] is None
    d = client.get("/settings/automation-defaults").json()
    assert d["defaults"]["debounce_s"] == 0 and d["max_conditions"] == 8
    assert client.patch("/settings/automation-defaults", json={"debounce_s": 30}).json()["defaults"]["debounce_s"] == 30
    assert client.patch("/settings/automation-defaults", json={"window": {"start": "x", "end": "y"}}).status_code == 400
    tagged = client.get("/journal/core?tag=settings").json()
    assert any("quiet hours" in e["note"] for e in tagged["entries"])
    assert any("New-rule debounce" in e["note"] for e in tagged["entries"])
