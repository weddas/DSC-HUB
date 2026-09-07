"""Hub tunables (S2): brain-owned desired values, sync states, reconcile, stage presets."""

from __future__ import annotations

import asyncio
import time
from pathlib import Path

import pytest

from dsc_brain.fleet_state import FleetState, SeatState


@pytest.fixture()
def db(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> Path:
    monkeypatch.setenv("DSC_DATA", str(tmp_path))
    path = tmp_path / "dsc_ops.sqlite3"
    from dsc_brain import dsc_core_journal, journal_snapshot, settings

    monkeypatch.setattr(settings, "DEFAULT_DB", path, raising=False)
    monkeypatch.setattr(dsc_core_journal, "DEFAULT_DB", path, raising=False)
    monkeypatch.setattr(journal_snapshot, "DEFAULT_DB", path, raising=False)
    settings.init_settings_db(path)
    from dsc_brain import hub_tunables

    hub_tunables.reset_for_tests()
    return path


def _fleet(controls: dict, *, online: bool = True) -> FleetState:
    state = FleetState()
    state.hub = SeatState("hub", online, "8.0.0.0", {"controls": controls}, time.time())
    return state


def _ctrl(**kv: object) -> dict:
    return {k: {"state": str(v)} for k, v in kv.items()}


BASE = _ctrl(**{
    "number.dsc_hub_target_temp": "25.0",
    "number.dsc_hub_ladder_wait_heat": "120.0",
    "select.dsc_hub_control_strategy": "VPD First",
    "switch.dsc_hub_auto_photoperiod": "on",
    "select.dsc_hub_grow_stage": "Vegetative",
})
BASE["select.dsc_hub_control_strategy"]["options"] = ["VPD First", "RH First"]
BASE["number.dsc_hub_ladder_wait_heat"].update({"min": 60, "max": 600, "step": 10, "unit_of_measurement": "s"})


def test_adopt_then_synced(db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    from dsc_brain import hub_tunables as ht

    fleet = _fleet(BASE)
    monkeypatch.setattr(ht, "_fleet", lambda: fleet)
    adopted = ht.adopt_missing(ht.hub_controls(fleet), db)
    assert "number.dsc_hub_target_temp" in adopted
    assert "number.dsc_hub_ladder_wait_heat" in adopted
    rows = {r["entity_id"]: r for r in ht.list_tunables(db, fleet)["rows"]}
    assert rows["number.dsc_hub_target_temp"]["state"] == "synced"
    assert rows["number.dsc_hub_target_temp"]["desired"] == "25"
    # Native attrs win over the fallback table.
    assert rows["number.dsc_hub_ladder_wait_heat"]["min"] == 60
    assert rows["number.dsc_hub_ladder_wait_heat"]["unit"] == "s"
    # Entities the firmware did not report are `missing`, not invented.
    assert rows["number.dsc_hub_sunrise_duration"]["state"] == "missing"
    assert rows["number.dsc_hub_sunrise_duration"]["hub"] is None


def test_set_desired_validates_and_states(db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    from dsc_brain import hub_tunables as ht

    fleet = _fleet(BASE)
    monkeypatch.setattr(ht, "_fleet", lambda: fleet)
    ht.adopt_missing(ht.hub_controls(fleet), db)

    with pytest.raises(ValueError):
        ht.set_desired("number.dsc_hub_ladder_wait_heat", 5000, db_path=db)
    with pytest.raises(ValueError):
        ht.set_desired("select.dsc_hub_control_strategy", "Nope", db_path=db)
    with pytest.raises(ValueError):
        ht.set_desired("switch.dsc_hub_auto_photoperiod", "maybe", db_path=db)
    with pytest.raises(ValueError):
        ht.set_desired("sensor.dsc_hub_temperature", 1, db_path=db)

    row = ht.set_desired("number.dsc_hub_ladder_wait_heat", 184, db_path=db)  # snaps to step 10
    assert row["desired"] == "180"
    assert row["state"] == "pending"  # echo still 120, push queued
    assert row["source"] == "operator"

    # Hub offline → held.
    offline = _fleet(BASE, online=False)
    rows = {r["entity_id"]: r for r in ht.list_tunables(db, offline)["rows"]}
    assert rows["number.dsc_hub_ladder_wait_heat"]["state"] == "held"

    # Hub changed a synced value on its own → differs (never silently overwritten).
    changed = _fleet({**BASE, "number.dsc_hub_target_temp": {"state": "23.0"}})
    rows = {r["entity_id"]: r for r in ht.list_tunables(db, changed)["rows"]}
    assert rows["number.dsc_hub_target_temp"]["state"] == "differs"
    assert rows["number.dsc_hub_target_temp"]["hub"] == "23"
    monkeypatch.setattr(ht, "_fleet", lambda: changed)
    adopted = ht.adopt("number.dsc_hub_target_temp", db)
    assert adopted["state"] == "synced" and adopted["desired"] == "23"


def test_reconcile_pushes_confirms_and_respects_takeover(db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    from dsc_brain import hub_tunables as ht

    pushes: list[tuple[str, str]] = []

    async def fake_push(entity_id: str, desired: str) -> None:
        pushes.append((entity_id, desired))

    monkeypatch.setattr(ht, "_push_entity", fake_push)
    fleet = _fleet(BASE)
    monkeypatch.setattr(ht, "_fleet", lambda: fleet)
    ht.adopt_missing(ht.hub_controls(fleet), db)
    ht.set_desired("number.dsc_hub_ladder_wait_heat", 180, db_path=db)

    # Takeover on → nothing pushed.
    takeover = _fleet({**BASE, "switch.dsc_hub_manual_takeover": {"state": "on"}})
    asyncio.run(ht.on_fleet_poll(takeover, db))
    assert pushes == []
    assert ht.list_tunables(db, takeover)["blocked"] is True

    # Takeover off → pushed once, then waits on the echo.
    asyncio.run(ht.on_fleet_poll(fleet, db))
    assert pushes == [("number.dsc_hub_ladder_wait_heat", "180")]
    asyncio.run(ht.on_fleet_poll(fleet, db))
    assert len(pushes) == 1  # within PUSH_RETRY_SEC — no re-push
    rows = {r["entity_id"]: r for r in ht.list_tunables(db, fleet)["rows"]}
    assert rows["number.dsc_hub_ladder_wait_heat"]["state"] == "pending"

    # Echo arrives → synced, pending cleared.
    echoed = _fleet({**BASE, "number.dsc_hub_ladder_wait_heat": {"state": "180.0"}})
    asyncio.run(ht.on_fleet_poll(echoed, db))
    rows = {r["entity_id"]: r for r in ht.list_tunables(db, echoed)["rows"]}
    assert rows["number.dsc_hub_ladder_wait_heat"]["state"] == "synced"


def test_stage_change_stamps_presets_only_when_brain_owns(db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    from dsc_brain import hub_tunables as ht
    from dsc_brain.stage_rail import patch_stage_rail

    pushes: list[tuple[str, str]] = []

    async def fake_push(entity_id: str, desired: str) -> None:
        pushes.append((entity_id, desired))

    monkeypatch.setattr(ht, "_push_entity", fake_push)
    patch_stage_rail("Flowering", {"temp": 23.5, "vpd_max": 1.5}, db)

    # Firmware without the switch (or switch off): the hub keeps its baked table.
    fleet = _fleet(BASE)
    monkeypatch.setattr(ht, "_fleet", lambda: fleet)
    asyncio.run(ht.on_fleet_poll(fleet, db))
    flowered = _fleet({**BASE, "select.dsc_hub_grow_stage": {"state": "Flowering"}})
    monkeypatch.setattr(ht, "_fleet", lambda: flowered)
    out = asyncio.run(ht.on_fleet_poll(flowered, db))
    assert out["stage"] is None
    assert not any(e == "number.dsc_hub_target_temp" for e, _ in pushes)

    # Switch on → the brain's (edited) preset lands on the five targets.
    ht.reset_for_tests()
    owned = _fleet({**BASE, "switch.dsc_hub_brain_stage_targets": {"state": "on"}})
    monkeypatch.setattr(ht, "_fleet", lambda: owned)
    asyncio.run(ht.on_fleet_poll(owned, db))
    owned_flower = _fleet({**BASE, "switch.dsc_hub_brain_stage_targets": {"state": "on"}, "select.dsc_hub_grow_stage": {"state": "Flowering"}})
    monkeypatch.setattr(ht, "_fleet", lambda: owned_flower)
    out = asyncio.run(ht.on_fleet_poll(owned_flower, db))
    assert out["stage"]["stage"] == "Flowering"
    assert out["stage"]["written"]["number.dsc_hub_target_temp"] == "23.5"
    assert out["stage"]["written"]["number.dsc_hub_vpd_target_max"] == "1.5"
    assert ("number.dsc_hub_target_temp", "23.5") in pushes


def test_stage_rail_patch_validate_reset(db: Path) -> None:
    from dsc_brain.stage_rail import list_stage_rail, patch_stage_rail, reset_stage_rail, targets_for_stage

    rows = list_stage_rail(db)
    assert [r["stage"] for r in rows][:2] == ["Germination", "Seedling"]
    assert not any(r["changed"] for r in rows)
    row = patch_stage_rail("Vegetative", {"temp": 27}, db)
    assert row["temp"] == 27 and row["changed"] is True and row["default"]["temp"] == 26
    with pytest.raises(ValueError):
        patch_stage_rail("Vegetative", {"temp": 40}, db)
    with pytest.raises(ValueError):
        patch_stage_rail("Vegetative", {"vpd_min": 1.5, "vpd_max": 1.0}, db)
    with pytest.raises(ValueError):
        patch_stage_rail("Bloom", {"temp": 20}, db)
    assert targets_for_stage("Vegetative", db)["temp"] == 27
    assert not any(r["changed"] for r in reset_stage_rail(None, db))


def test_hub_tunables_api(db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    from fastapi.testclient import TestClient

    from dsc_brain import hub_tunables as ht
    from dsc_brain.api import app

    fleet = _fleet(BASE)
    monkeypatch.setattr(ht, "_fleet", lambda: fleet)
    monkeypatch.setattr("dsc_brain.api.get_fleet_state", lambda: fleet, raising=False)

    async def fake_push(entity_id: str, desired: str) -> None:
        return None

    monkeypatch.setattr(ht, "_push_entity", fake_push)
    client = TestClient(app)

    listed = client.get("/settings/hub-tunables")
    assert listed.status_code == 200
    body = listed.json()
    assert body["hub_online"] is True
    ids = {r["entity_id"] for r in body["rows"]}
    assert "number.dsc_hub_ladder_wait_heat" in ids and "switch.dsc_hub_brain_stage_targets" in ids

    bad = client.patch("/settings/hub-tunables", json={"entity_id": "number.dsc_hub_ladder_wait_heat", "value": 9999})
    assert bad.status_code == 400
    ok = client.patch("/settings/hub-tunables", json={"entity_id": "number.dsc_hub_ladder_wait_heat", "value": 200})
    assert ok.status_code == 200
    assert ok.json()["row"]["desired"] == "200"
    assert ok.json()["row"]["state"] == "pending"

    rail = client.get("/settings/stage-rail").json()
    assert len(rail["rows"]) == 10 and rail["brain_owns"] is False
    patched = client.patch("/settings/stage-rail", json={"stage": "Seedling", "fields": {"rh_max": 78}})
    assert patched.status_code == 200 and patched.json()["row"]["rh_max"] == 78
    assert client.patch("/settings/stage-rail", json={"stage": "Seedling", "fields": {"rh_max": 200}}).status_code == 400
    assert client.post("/settings/stage-rail/reset?stage=Seedling").status_code == 200

    rs = client.get("/settings/root-steering-targets").json()
    assert rs["targets"]["ec_target_ms"] == 2.2
    assert client.patch("/settings/root-steering-targets", json={"targets": {"ec_target_ms": 2.6}}).json()["targets"]["ec_target_ms"] == 2.6
    assert client.patch("/settings/root-steering-targets", json={"targets": {"nope": 1}}).status_code == 400
