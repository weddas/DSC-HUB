# brain/tests/test_space_model.py
from pathlib import Path

from dsc_brain.space_model import (
    ensure_kit_spaces,
    init_space_tables,
    list_space_devices,
    list_spaces,
    upsert_space_device,
)


def test_ensure_kit_spaces_idempotent(tmp_path: Path):
    db = tmp_path / "ops.sqlite3"
    init_space_tables(db)
    first = ensure_kit_spaces(db)
    second = ensure_kit_spaces(db)
    assert {s["space_id"] for s in first} == {"4x8", "2x4"}
    assert {s["space_id"] for s in second} == {"4x8", "2x4"}
    assert len(list_spaces(db)) == 2
    by_id = {s["space_id"]: s for s in list_spaces(db)}
    assert by_id["4x8"]["size_label"]
    assert by_id["2x4"]["size_label"]


def test_upsert_space_device_attach(tmp_path: Path):
    db = tmp_path / "ops.sqlite3"
    init_space_tables(db)
    ensure_kit_spaces(db)
    row = upsert_space_device(
        "2x4",
        {
            "device_id": "sf1000",
            "label": "SF1000",
            "watts": 100.0,
            "duty_source": "photoperiod",
            "enabled": True,
        },
        db_path=db,
    )
    assert row["device_id"] == "sf1000"
    assert row["watts"] == 100.0
    devices = list_space_devices("2x4", db_path=db)
    assert len(devices) == 1
    assert devices[0]["label"] == "SF1000"
    # update watts
    upsert_space_device(
        "2x4",
        {
            "device_id": "sf1000",
            "label": "SF1000",
            "watts": 120.0,
            "duty_source": "photoperiod",
            "enabled": True,
        },
        db_path=db,
    )
    assert list_space_devices("2x4", db_path=db)[0]["watts"] == 120.0
