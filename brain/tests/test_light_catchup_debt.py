"""The hub's catch-up debt must reach the desk as an entity.

It travels /fleet -> _hub_values_for_light_loop (an explicit WHITELIST) -> build_light_loop
-> the snapshot -> emit_light_loop. Adding the field at either end is not enough: the
whitelist in the middle silently drops anything it does not name, which is exactly how this
shipped publishing None while /fleet showed 7.85.
"""

from __future__ import annotations

from types import SimpleNamespace


def test_the_whitelist_copies_the_debt_through() -> None:
    from dsc_brain.computed_ops import _hub_values_for_light_loop

    fleet = SimpleNamespace(
        hub=SimpleNamespace(values={"light_debt_hours": 7.85, "light_delivered_hours": 6.15, "controls": {}})
    )
    runtime = SimpleNamespace(hours_today=lambda *_a, **_k: None)

    out = _hub_values_for_light_loop(fleet, runtime)
    assert out.get("light_debt_hours") == 7.85, "the whitelist dropped the debt again"


def test_the_debt_reaches_the_snapshot_and_an_entity() -> None:
    from dsc_brain.light_loop import build_light_loop, emit_light_loop

    snap = build_light_loop(
        helpers={},
        hub_values={"light_debt_hours": 7.85, "sf1000_on": False},
        now_ts=1_788_000_000.0,
    )
    assert snap.light_debt_hours == 7.85

    published: dict[str, object] = {}

    def set_entity(states, entity_id, value, **kwargs):  # noqa: ANN001, ARG001
        published[entity_id] = value

    emit_light_loop({}, snap, set_entity)
    assert published.get("sensor.dsc_hub_light_debt_hours") == 7.85


def test_no_debt_publishes_nothing_rather_than_zero() -> None:
    """A hub that never reported a debt is not a hub reporting zero debt."""
    from dsc_brain.light_loop import build_light_loop, emit_light_loop

    snap = build_light_loop(helpers={}, hub_values={"sf1000_on": False}, now_ts=1_788_000_000.0)
    assert snap.light_debt_hours is None

    published: dict[str, object] = {}

    def set_entity(states, entity_id, value, **kwargs):  # noqa: ANN001, ARG001
        published[entity_id] = value

    emit_light_loop({}, snap, set_entity)
    assert "sensor.dsc_hub_light_debt_hours" not in published
