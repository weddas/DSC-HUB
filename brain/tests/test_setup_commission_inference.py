"""A kit that predates the wizard must not look uncommissioned once its fleet has reported."""

from __future__ import annotations

import time
from pathlib import Path

from dsc_brain.fleet_state import FleetState, SeatState, update_fleet_state
from dsc_brain.kit_commission import add_setup_debt, get_setup_state, hub_expected_for_commission


def test_inferred_from_hub_last_seen(temp_db: Path) -> None:
    update_fleet_state(FleetState())
    st = get_setup_state(temp_db)
    assert st["commissioned"] is False and st["commissioned_inferred"] is False

    f = FleetState()
    f.hub = SeatState("hub", True, "8.1.0.0", {}, time.time())
    update_fleet_state(f)
    st = get_setup_state(temp_db)
    assert st["commissioned"] is False  # never written back from a GET
    assert st["commissioned_inferred"] is True and "hub" in st["inferred_reason"]


def test_hub_required_unless_its_flash_was_skipped(temp_db: Path) -> None:
    # A hub that is online at the expected firmware has its not_flashed debt reconciled away
    # (correctly) — start from a fleet that has never reported so the debt sticks.
    update_fleet_state(FleetState())
    assert hub_expected_for_commission(temp_db) is True
    add_setup_debt("not_flashed:hub", temp_db)
    assert hub_expected_for_commission(temp_db) is False
