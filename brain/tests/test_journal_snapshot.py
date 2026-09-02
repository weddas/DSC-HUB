# brain/tests/test_journal_snapshot.py
from pathlib import Path

import pytest

from dsc_brain.journal_snapshot import capture_journal_snapshot
from dsc_brain.plant_journal import add_plant_entry
from dsc_brain.space_journal import add_space_entry
from dsc_brain.room_journal import add_room_entry
from dsc_brain.dsc_core_journal import add_core_entry


def test_plant_snapshot_includes_probe_metrics(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(
        "dsc_brain.journal_snapshot._resolve_pot_for_plant",
        lambda _pid: "pot1",
    )
    fleet = {
        "pots": {
            "pot1": {
                "values": {"moisture_pct": 42.0, "ec_us": 1.2, "ph": 6.1},
                "online": True,
            }
        },
        "hass_extras": {
            "select.dsc_probe1_growth_stage": {"state": "Vegetative"},
        },
    }
    snap = capture_journal_snapshot("plant", "plant:test-uuid", fleet)
    assert snap["moisture_pct"] == 42.0
    assert snap["ec_us"] == 1.2
    assert snap["ph"] == 6.1
    assert snap["growth_stage"] == "Vegetative"


def test_plant_snapshot_honest_when_unassigned(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(
        "dsc_brain.journal_snapshot._resolve_pot_for_plant",
        lambda _pid: None,
    )
    snap = capture_journal_snapshot("plant", "plant:orphan", {"pots": {}})
    assert "moisture_pct" not in snap
    assert "ec_us" not in snap


def test_space_snapshot_4x8_keys() -> None:
    fleet = {
        "hub": {
            "values": {
                "temp_c": 24.1,
                "rh_pct": 58.0,
                "vpd_kpa": 1.02,
                "window_4x8_open": True,
            }
        },
        "hass_extras": {
            "sensor.dsc_lights_on_today_4x8": {"state": "11.5"},
        },
    }
    snap = capture_journal_snapshot("space", "4x8", fleet)
    assert snap["temp_c"] == 24.1
    assert snap["rh_pct"] == 58.0
    assert snap["vpd_kpa"] == 1.02
    assert snap["window_open"] is True
    assert snap["lights_on_today_h"] == 11.5


def test_space_snapshot_2x4_keys(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(
        "dsc_brain.journal_snapshot.get_helper",
        lambda key, default="": "Follow Plants" if "clone_mode" in key else default,
    )
    fleet = {
        "hub": {
            "values": {
                "clone_temp_c": 22.0,
                "clone_rh_pct": 65.0,
                "clone_vpd_kpa": 0.95,
                "window_2x4_open": False,
            }
        },
        "hass_extras": {
            "sensor.dsc_lights_on_today_2x4": {"state": "8.25"},
        },
    }
    snap = capture_journal_snapshot("space", "2x4", fleet)
    assert snap["temp_c"] == 22.0
    assert snap["rh_pct"] == 65.0
    assert snap["vpd_kpa"] == 0.95
    assert snap["window_open"] is False
    assert snap["lights_on_today_h"] == 8.25
    assert snap["climate_mode"] == "Follow Plants"


def test_room_snapshot_keys() -> None:
    fleet = {
        "hub": {
            "values": {
                "room_temp_c": 21.5,
                "room_rh_pct": 52.0,
                "room_vpd_kpa": 1.15,
            }
        }
    }
    snap = capture_journal_snapshot("room", "grow_room", fleet)
    assert snap["room_temp_c"] == 21.5
    assert snap["room_rh_pct"] == 52.0
    assert snap["room_vpd_kpa"] == 1.15


def test_core_snapshot_keys() -> None:
    fleet = {
        "version": "7.0.0.0",
        "hass_extras": {
            "sensor.dsc_active_alert_count": {"state": "3"},
        },
    }
    snap = capture_journal_snapshot("core", "dsc_core", fleet)
    assert snap["brain_version"] == "7.0.0.0"
    assert snap["active_alert_count"] == 3


def test_add_plant_entry_persists_snapshot(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    db = tmp_path / "ops.sqlite3"
    fleet = {
        "pots": {"pot1": {"values": {"moisture_pct": 55.0, "ec_us": 900.0}}},
        "hass_extras": {},
    }
    monkeypatch.setattr(
        "dsc_brain.journal_snapshot._resolve_pot_for_plant",
        lambda _pid: "pot1",
    )
    row = add_plant_entry("plant-a", 1000.0, "probe note", db_path=db, fleet=fleet)
    assert row["snapshot"]["moisture_pct"] == 55.0
    assert row["snapshot"]["ec_us"] == 900.0


def test_add_space_entry_persists_snapshot(tmp_path: Path) -> None:
    db = tmp_path / "ops.sqlite3"
    fleet = {
        "hub": {"values": {"temp_c": 23.0, "rh_pct": 60.0, "vpd_kpa": 1.0, "window_4x8_open": True}},
        "hass_extras": {"sensor.dsc_lights_on_today_4x8": {"state": "10"}},
    }
    row = add_space_entry("4x8", 1000.0, "tent note", db_path=db, fleet=fleet)
    assert row["snapshot"]["temp_c"] == 23.0
    assert row["snapshot"]["lights_on_today_h"] == 10.0


def test_add_room_entry_persists_snapshot(tmp_path: Path) -> None:
    db = tmp_path / "ops.sqlite3"
    fleet = {"hub": {"values": {"room_temp_c": 20.0, "room_rh_pct": 48.0, "room_vpd_kpa": 1.2}}}
    row = add_room_entry("grow_room", 1000.0, "room note", db_path=db, fleet=fleet)
    assert row["snapshot"]["room_temp_c"] == 20.0


def test_add_core_entry_persists_snapshot(tmp_path: Path) -> None:
    db = tmp_path / "ops.sqlite3"
    fleet = {
        "version": "7.1.0.0",
        "hass_extras": {"sensor.dsc_active_alert_count": {"state": "0"}},
    }
    row = add_core_entry(1000.0, "core note", db_path=db, fleet=fleet)
    assert row["snapshot"]["brain_version"] == "7.1.0.0"
    assert row["snapshot"]["active_alert_count"] == 0


def test_backfill_space_snapshot_from_history(tmp_path: Path) -> None:
    from dsc_brain.journal_snapshot import backfill_journal_snapshots
    from dsc_brain.settings import record_history

    db = tmp_path / "ops.sqlite3"
    add_space_entry(
        "4x8",
        1000.0,
        "old note",
        db_path=db,
        fleet={"hub": {"values": {}}, "hass_extras": {}},
    )
    record_history("hub", "temp_c", 23.5, ts=1000.0, db_path=db)
    record_history("hub", "rh_pct", 55.0, ts=1000.0, db_path=db)

    result = backfill_journal_snapshots("space", "4x8", limit=10, db_path=db)
    assert result["updated"] == 1
    assert result["examined"] == 1

    from dsc_brain.space_journal import list_space_journal

    rows = list_space_journal("4x8", db_path=db)
    assert rows[0]["snapshot"]["temp_c"] == 23.5
    assert rows[0]["snapshot"]["rh_pct"] == 55.0


def test_backfill_plant_snapshot_honest_without_history(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    from dsc_brain.journal_snapshot import backfill_journal_snapshots

    db = tmp_path / "ops.sqlite3"
    monkeypatch.setattr(
        "dsc_brain.journal_snapshot._resolve_pot_for_plant",
        lambda _pid: "pot1",
    )
    add_plant_entry(
        "plant-x",
        2000.0,
        "no history",
        db_path=db,
        fleet={"pots": {}, "hass_extras": {}},
    )

    result = backfill_journal_snapshots("plant", "plant-x", limit=10, db_path=db)
    assert result["updated"] == 0
    assert result["skipped"] == 1

    from dsc_brain.plant_journal import list_plant_journal

    rows = list_plant_journal("plant-x", db_path=db)
    assert "moisture_pct" not in rows[0]["snapshot"]


def test_backfill_skips_when_snapshot_complete(tmp_path: Path) -> None:
    from dsc_brain.journal_snapshot import backfill_journal_snapshots

    db = tmp_path / "ops.sqlite3"
    fleet = {
        "hub": {"values": {"temp_c": 24.0, "rh_pct": 50.0, "vpd_kpa": 1.0, "window_4x8_open": True}},
        "hass_extras": {"sensor.dsc_lights_on_today_4x8": {"state": "9"}},
    }
    add_space_entry("4x8", 1000.0, "complete", db_path=db, fleet=fleet)

    result = backfill_journal_snapshots("space", "4x8", limit=10, db_path=db)
    assert result["updated"] == 0
    assert result["skipped"] == 1
