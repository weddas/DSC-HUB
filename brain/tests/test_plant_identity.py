"""A plant is not a probe.

The `roster` table made it one: `seat_id` was the PRIMARY KEY, so a plant *was* its pot.
Three things followed from that, and each is pinned below:

* moving a plant meant deleting one row and inventing another, so nothing survived the move;
* retiring a plant DELETEd the only record that it had ever existed;
* removing a probe took the plant with it — very nearly what happened when pot3/pot4 were
  retired on 2026-09-10 with two plants mid-flower.

The plant now owns its identity and the probe is a placement it currently occupies. The id
is the same `plant:<uuid>` form `plant_probe.ensure_plant_uuid` already minted for compose
slots, so there is one identity for a plant rather than two.
"""

from __future__ import annotations

import json
import time
from pathlib import Path

import pytest

from dsc_brain.settings import (
    connect,
    delete_roster,
    init_settings_db,
    list_plants,
    list_roster,
    migrate_roster_to_plants,
    set_plant_seat,
    upsert_roster,
)


def _seed_legacy(db: Path, seat: str, name: str, strain: str, sprout: str = "2026-07-09") -> None:
    """A plant written the old seat-keyed way, as the live rig had them."""
    conn = connect(db)
    conn.execute(
        "INSERT INTO roster(seat_id, strain_id, stage, recipe_json, updated_at) VALUES(?,?,?,?,?)",
        (
            seat,
            strain,
            "flower",
            json.dumps(
                {
                    "plant_name": name,
                    "nickname": name,
                    "strain_display": name,
                    "sprout_date": sprout,
                    "tent": "main",
                    "growth_stage": "Flowering",
                }
            ),
            time.time(),
        ),
    )
    conn.commit()
    conn.close()


@pytest.fixture()
def db(tmp_path, monkeypatch) -> Path:
    monkeypatch.setenv("DSC_DATA", str(tmp_path))
    path = tmp_path / "dsc_ops.sqlite3"
    init_settings_db(path)
    return path


@pytest.fixture()
def live(db: Path) -> Path:
    """The two flowering plants that were on the rig when this was written."""
    _seed_legacy(db, "pot1", "Runtz Punch", "Runtz Punch")
    _seed_legacy(db, "pot2", "Grandmommy Purple", "grandmommy_purple")
    migrate_roster_to_plants(db)
    return db


# --------------------------------------------------------------------------------------
# Migration
# --------------------------------------------------------------------------------------


def test_existing_plants_get_an_identity(live: Path) -> None:
    rows = list_roster(live)
    assert len(rows) == 2
    for r in rows:
        assert r["plant_id"], "every plant carries its own id"
        assert r["plant_id"].startswith("plant:")
        assert r["plant_id"] != r["seat_id"], "the id is not the seat"


def test_migration_preserves_what_the_grower_cares_about(live: Path) -> None:
    by_seat = {r["seat_id"]: r for r in list_roster(live)}
    runtz = by_seat["pot1"]
    assert runtz["recipe"]["plant_name"] == "Runtz Punch"
    assert runtz["stage"] == "flower"
    assert runtz["growth_stage"] == "Flowering"
    assert runtz["sprout_date"] == "2026-07-09"
    assert runtz["tent"] == "main"


def test_created_at_is_the_sprout_date_not_the_last_edit(live: Path) -> None:
    """A plant's birthday is when it sprouted; updated_at is when someone last touched it."""
    plants = list_plants(db_path=live)
    for p in plants:
        assert p["created_at"] < time.time() - 86400, "seeded 2026-07-09, not just now"


def test_migration_is_one_shot(live: Path) -> None:
    assert migrate_roster_to_plants(live) == 0
    assert len(list_roster(live)) == 2


def test_the_legacy_table_is_left_intact_for_rollback(live: Path) -> None:
    conn = connect(live)
    n = conn.execute("SELECT COUNT(*) AS n FROM roster").fetchone()["n"]
    conn.close()
    assert n == 2, "roster is copied from, never emptied"


# --------------------------------------------------------------------------------------
# The operations the old shape could not express
# --------------------------------------------------------------------------------------


def test_a_plant_survives_being_moved(live: Path) -> None:
    """The headline. Under `roster` this was delete-and-recreate: a different plant."""
    runtz = next(r for r in list_roster(live) if r["seat_id"] == "pot1")
    pid = runtz["plant_id"]

    set_plant_seat(pid, None, live)  # off its probe
    set_plant_seat(pid, "pot1", live)  # and back

    again = next(r for r in list_roster(live) if r["seat_id"] == "pot1")
    assert again["plant_id"] == pid, "same plant, not a new one"
    assert again["recipe"]["plant_name"] == "Runtz Punch"
    assert again["sprout_date"] == "2026-07-09", "its history came with it"


def test_a_plant_can_sit_off_a_probe(live: Path) -> None:
    """Unplaced is a real state — a plant on the bench still exists."""
    pid = next(r for r in list_roster(live) if r["seat_id"] == "pot2")["plant_id"]
    set_plant_seat(pid, None, live)

    assert [r["seat_id"] for r in list_roster(live)] == ["pot1"]
    unplaced = [p for p in list_plants(db_path=live) if p["seat_id"] is None]
    assert len(unplaced) == 1
    assert unplaced[0]["plant_id"] == pid


def test_two_plants_cannot_share_a_probe(live: Path) -> None:
    runtz = next(r for r in list_roster(live) if r["seat_id"] == "pot1")
    with pytest.raises(ValueError, match="already holds"):
        set_plant_seat(runtz["plant_id"], "pot2", live)


def test_retiring_keeps_the_record(live: Path) -> None:
    """It used to DELETE. The grow log kept the events; nothing kept the plant."""
    assert delete_roster("pot2", live) is True

    assert [r["seat_id"] for r in list_roster(live)] == ["pot1"]
    assert len(list_plants(db_path=live)) == 1, "living plants"
    everything = list_plants(include_retired=True, db_path=live)
    assert len(everything) == 2
    retired = next(p for p in everything if p["retired_at"])
    assert retired["recipe"]["plant_name"] == "Grandmommy Purple"
    assert retired["seat_id"] is None, "the probe is free again"


def test_the_probe_is_free_after_a_retirement(live: Path) -> None:
    """Retiring frees the seat, so the next plant can go in without a unique clash."""
    delete_roster("pot2", live)
    fresh = upsert_roster("pot2", {"strain_id": "blue-dream", "recipe": {"nickname": "Blue Dream"}}, live)
    assert fresh["seat_id"] == "pot2"
    assert fresh["plant_id"].startswith("plant:")
    assert len({p["plant_id"] for p in list_plants(include_retired=True, db_path=live)}) == 3


def test_retiring_nothing_says_so(live: Path) -> None:
    delete_roster("pot1", live)
    assert delete_roster("pot1", live) is False


# --------------------------------------------------------------------------------------
# The historical read shape still works, so existing readers do not break
# --------------------------------------------------------------------------------------


def test_list_roster_still_looks_like_a_roster(live: Path) -> None:
    for r in list_roster(live):
        assert {"seat_id", "strain_id", "stage", "recipe", "tent", "sprout_date", "growth_stage"} <= set(r)


def test_upsert_updates_in_place_rather_than_making_a_second_plant(live: Path) -> None:
    before = next(r for r in list_roster(live) if r["seat_id"] == "pot1")["plant_id"]
    upsert_roster("pot1", {"stage": "flower", "recipe": {"notes": "day 63"}}, live)
    after = [r for r in list_roster(live) if r["seat_id"] == "pot1"]
    assert len(after) == 1
    assert after[0]["plant_id"] == before
    assert after[0]["recipe"]["notes"] == "day 63"
    assert after[0]["recipe"]["plant_name"] == "Runtz Punch", "the patch merged, not replaced"
