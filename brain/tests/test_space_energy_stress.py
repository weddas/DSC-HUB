# brain/tests/test_space_energy_stress.py
"""Stress matrix for space energy + journal hierarchy (both tents + Core)."""

from __future__ import annotations

from concurrent.futures import ThreadPoolExecutor
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


def test_confirm_gate_and_both_spaces_estimate(client: TestClient) -> None:
    for sid in ("4x8", "2x4"):
        est = client.get("/energy/estimate", params={"space_id": sid, "lights_on": "20:00:00", "want_hours": 12})
        assert est.status_code == 200
        assert est.json()["ok"] is True
        sugg = client.get("/energy/suggestions", params={"space_id": sid, "lights_on": "20:00:00", "want_hours": 12})
        assert all(s.get("apply") is False for s in sugg.json()["suggestions"])
    bad = client.post(
        "/energy/shift/plan",
        json={
            "space_id": "2x4",
            "from_on": "20:00:00",
            "to_on": "22:00:00",
            "want_hours": 12,
            "policy": "flower_strict",
            "confirm": False,
        },
    )
    assert bad.status_code == 400


def test_flower_strict_force_tick_both_spaces(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    _point_db(monkeypatch, temp_db)
    from dsc_brain.compose_store import get_helper, set_helper
    from dsc_brain.schedule_shift import _connect, cancel_shift_plan, create_shift_plan, tick_shift_plans

    for sid, entity in (
        ("4x8", "time.dsc_hub_lights_on_time"),
        ("2x4", "time.dsc_hub_clone_lights_on_time"),
    ):
        set_helper(entity, "20:00:00")
        before = get_helper(entity, "")
        plan = create_shift_plan(
            sid,
            from_on="20:00:00",
            to_on="22:00:00",
            want_hours=12,
            policy="flower_strict",
            confirm=True,
            db_path=temp_db,
        )
        with _connect(temp_db) as conn:
            conn.execute("UPDATE schedule_shift_plan SET next_step_at=0 WHERE id=?", (plan["id"],))
            conn.commit()

        applied: list[str] = []

        def set_on(space_id: str, lights_on: str) -> None:
            applied.append(f"{space_id}:{lights_on}")
            ent = (
                "time.dsc_hub_lights_on_time"
                if space_id in ("4x8", "main")
                else "time.dsc_hub_clone_lights_on_time"
            )
            set_helper(ent, lights_on)

        tick_shift_plans(now=1.0, set_lights_on=set_on, db_path=temp_db)
        assert applied, f"expected force-tick apply for {sid}"
        cancel_shift_plan(int(plan["id"]), db_path=temp_db)
        set_helper(entity, before)


def test_cross_space_room_core_rollup(client: TestClient) -> None:
    client.post("/journal/plant/plant:stress-a", json={"note": "obs a"})
    client.post("/journal/plant/plant:stress-b", json={"note": "obs b"})
    client.post("/journal/space/2x4", json={"note": "tent 2x4"})
    client.post("/journal/space/4x8", json={"note": "tent 4x8"})
    client.post("/journal/room/grow_room", json={"note": "room note"})
    client.post("/journal/core", json={"note": "core note"})
    room = client.get("/journal/room/grow_room")
    assert room.status_code == 200
    notes = " ".join(e["note"] for e in room.json()["entries"])
    assert "tent 2x4" in notes and "tent 4x8" in notes and "room note" in notes
    core = client.get("/journal/core")
    core_notes = " ".join(e["note"] for e in core.json()["entries"])
    assert "core note" in core_notes and "room note" in core_notes


def test_parallel_journal_posts(client: TestClient) -> None:
    def post_pair(i: int) -> None:
        client.post("/journal/space/2x4", json={"note": f"p2-{i}"})
        client.post("/journal/space/4x8", json={"note": f"p4-{i}"})

    with ThreadPoolExecutor(max_workers=8) as pool:
        list(pool.map(post_pair, range(24)))
    room = client.get("/journal/room/grow_room?limit=200")
    assert room.status_code == 200
    assert len(room.json()["entries"]) >= 20


def test_reduced_kit_pot4_planned(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    _point_db(monkeypatch, temp_db)
    from dsc_brain.dash_computed import _reduced_kit
    from dsc_brain.settings import list_inventory

    active, attrs = _reduced_kit(list_inventory(temp_db))
    assert "POT4" not in attrs.get("offline", "")
    planned = attrs.get("planned_oos", "")
    assert "POT3" in planned or "POT4" in planned or active is False
