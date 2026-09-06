"""Operator automation rule engine — trigger/action, edge-trigger, fail-closed."""

from __future__ import annotations

from pathlib import Path

import pytest


def _fleet(temp_c: float | None = None, online: bool = True):
    from dsc_brain.fleet_state import get_fleet_state, update_fleet_state

    f = get_fleet_state()
    f.hub.online = online
    if temp_c is None:
        f.hub.values.pop("temp_c", None)
    else:
        f.hub.values["temp_c"] = temp_c
    update_fleet_state(f)
    return f


def _banners():
    from dsc_brain.fleet_state import get_fleet_state

    return get_fleet_state().system.get("critical_banners") or []


def _rule(**over):
    base = {
        "id": "hot_tent",
        "name": "Tent too hot",
        "enabled": True,
        "trigger": {"entity_id": "sensor.dsc_hub_tent_temperature", "op": "gt", "value": 30},
        "action": {"type": "banner", "params": {"text": "4x8 running hot", "tone": "warn"}},
    }
    base.update(over)
    return base


def test_validation_rejects_bad_rules(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", temp_db)
    from dsc_brain.automation_rules import save_automation_rules

    with pytest.raises(ValueError):
        save_automation_rules([_rule(id="Bad Id")])
    with pytest.raises(ValueError):
        save_automation_rules([_rule(trigger={"entity_id": "sensor.x", "op": "bogus", "value": 1})])
    with pytest.raises(ValueError):
        save_automation_rules([_rule(action={"type": "relay", "params": {}})])
    with pytest.raises(ValueError):
        save_automation_rules([_rule(action={"type": "oos_seat", "params": {}})])
    with pytest.raises(ValueError):
        save_automation_rules([_rule(id="dup"), _rule(id="dup")])


def test_numeric_trigger_edge(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", temp_db)
    from dsc_brain.automation_rules import evaluate_automation_rules, save_automation_rules

    save_automation_rules([_rule()])

    _fleet(temp_c=28.0)
    evaluate_automation_rules()
    assert not [b for b in _banners() if b.get("id") == "auto-hot_tent"]

    _fleet(temp_c=33.0)
    out = evaluate_automation_rules()
    assert out["rules"][0]["firing"] is True
    fired = [b for b in _banners() if b.get("id") == "auto-hot_tent"]
    assert len(fired) == 1
    assert fired[0]["source"] == "automation_rule"
    assert fired[0]["text"] == "4x8 running hot"

    # still firing -> no duplicate banner
    evaluate_automation_rules()
    assert len([b for b in _banners() if b.get("id") == "auto-hot_tent"]) == 1

    # falls back in band -> cleared
    _fleet(temp_c=27.0)
    out = evaluate_automation_rules()
    assert out["rules"][0]["firing"] is False
    assert not [b for b in _banners() if b.get("id") == "auto-hot_tent"]


def test_disabled_rule_never_fires(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", temp_db)
    from dsc_brain.automation_rules import evaluate_automation_rules, save_automation_rules

    save_automation_rules([_rule(enabled=False)])
    _fleet(temp_c=40.0)
    out = evaluate_automation_rules()
    assert out["rules"][0]["firing"] is False
    assert not _banners()


def test_fails_closed_when_hub_offline_or_missing(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", temp_db)
    from dsc_brain.automation_rules import evaluate_automation_rules, save_automation_rules

    save_automation_rules([_rule()])
    # value would match, but hub is dark
    _fleet(temp_c=40.0, online=False)
    assert evaluate_automation_rules()["rules"][0]["firing"] is False
    assert not _banners()

    # hub online but the target entity has no value
    _fleet(temp_c=None, online=True)
    assert evaluate_automation_rules()["rules"][0]["firing"] is False


def test_oos_seat_action_round_trips(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", temp_db)
    from dsc_brain.automation_rules import evaluate_automation_rules, save_automation_rules
    from dsc_brain.settings import list_inventory, upsert_inventory

    upsert_inventory("aux_fan", {"in_service": True, "role": "appliance"}, create=True)
    save_automation_rules(
        [
            _rule(
                id="hot_kill_fan",
                action={"type": "oos_seat", "params": {"seat_id": "aux_fan"}},
            )
        ]
    )

    _fleet(temp_c=35.0)
    evaluate_automation_rules()
    row = next(r for r in list_inventory() if r["seat_id"] == "aux_fan")
    assert row["in_service"] is False
    assert [b for b in _banners() if b.get("id") == "auto-hot_kill_fan"]

    _fleet(temp_c=20.0)
    evaluate_automation_rules()
    row = next(r for r in list_inventory() if r["seat_id"] == "aux_fan")
    assert row["in_service"] is True
    assert not [b for b in _banners() if b.get("id") == "auto-hot_kill_fan"]


def test_deleting_a_firing_rule_clears_its_effect(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", temp_db)
    from dsc_brain.automation_rules import evaluate_automation_rules, save_automation_rules

    save_automation_rules([_rule()])
    _fleet(temp_c=33.0)
    evaluate_automation_rules()
    assert [b for b in _banners() if b.get("id") == "auto-hot_tent"]

    save_automation_rules([])  # rule removed
    assert not [b for b in _banners() if b.get("id") == "auto-hot_tent"]
