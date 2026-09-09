"""Guards for the entity tables that describe ACTUATION.

A relay mapping that drifts between copies silently commands the wrong device, so these
pin every remaining copy to the single source of truth in entity_tables.py, and pin the
Kit's declared entity ids to something that actually produces them.
"""

from __future__ import annotations

from dsc_brain.entity_tables import KIT_DEFS, SONOFF_FW, SONOFF_RELAY, SONOFF_RELAY_TO_SEAT

# KIT_DEFS is a LIST of rows keyed by "id"; index it once for the assertions below.
KIT_BY_ID = {str(row["id"]): row for row in KIT_DEFS}


def test_relay_inverse_is_a_true_inverse() -> None:
    assert SONOFF_RELAY_TO_SEAT == {e: s for s, e in SONOFF_RELAY.items()}
    assert len(SONOFF_RELAY_TO_SEAT) == len(SONOFF_RELAY), "two seats share a relay entity"


def test_every_brain_copy_of_the_relay_table_is_the_shared_one() -> None:
    """These used to be three independent literals; they are now imports. If someone
    re-literalises one, this fails."""
    from dsc_brain.computed_ops import _SONOFF_RELAY_ENTITIES
    from dsc_brain.control_ops import _SONOFF_RELAY_ENTITY_TO_SEAT as ctrl
    from dsc_brain.demo_simulator import _SONOFF_RELAY_ENTITY_TO_SEAT as demo

    assert _SONOFF_RELAY_ENTITIES is SONOFF_RELAY
    assert ctrl is SONOFF_RELAY_TO_SEAT
    assert demo is SONOFF_RELAY_TO_SEAT


def test_relay_targets_agree_with_the_source_of_truth() -> None:
    """automation_rules derives its map from RELAY_TARGETS, which carries extra metadata and
    so is not folded — but it must still describe the same relays."""
    from dsc_brain.automation_rules import RELAY_TARGETS

    sonoff = {eid: str(meta["seat_id"]) for eid, meta in RELAY_TARGETS.items() if meta.get("kind") == "sonoff"}
    assert sonoff == SONOFF_RELAY_TO_SEAT


def test_kit_firmware_ids_are_the_ones_the_brain_publishes() -> None:
    """The dehumidifier row asked for `dsc_de_humidifier_firmware_version` (split), which
    nothing produced, so its Kit chip was permanently blank. Any Kit firmware id must match
    SONOFF_FW, which is what actually gets published."""
    for seat, entity in SONOFF_FW.items():
        row = KIT_BY_ID.get(seat)
        if row and row.get("firmware_entity"):
            assert row["firmware_entity"] == entity, seat


def test_kit_declared_ids_have_no_stale_de_humidifier_spelling() -> None:
    """The RELAY id genuinely is `de_humidifier` — that split spelling is real for the relay
    and must not be "corrected" — but nothing else should carry it."""
    assert SONOFF_RELAY["dehumidifier"] == "switch.dsc_de_humidifier_main_relay"
    for seat, row in KIT_BY_ID.items():
        for key, val in row.items():
            if key in ("relay_entity", "id") or not isinstance(val, str):
                continue
            assert "de_humidifier" not in val, f"{seat}.{key} = {val}"


def test_kit_cycles_today_ids_are_produced_by_the_brain() -> None:
    """These were declared by the Kit tiles and produced by nothing, so 'cycles today' was
    blank forever. dash_computed now emits both."""
    import inspect

    from dsc_brain import dash_computed

    src = inspect.getsource(dash_computed)
    for seat in ("heater", "humidifier"):
        declared = (KIT_BY_ID.get(seat) or {}).get("cycles_today")
        if declared:
            assert f'"{declared}"' in src, f"{declared} declared by KIT_DEFS but not produced"
