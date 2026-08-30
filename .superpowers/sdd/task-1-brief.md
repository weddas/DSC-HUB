# Task brief

## Global Constraints

- Spec: `docs/superpowers/specs/2026-08-30-zigbee-role-vs-task-operator-design.md` (approved)
- Parent: `docs/superpowers/specs/2026-08-30-zigbee-device-tasks-design.md`
- Keep recipe id `tank_full_appliance`; change label only
- Pi: never bare `docker kill`; prefer `timeout 25 docker restart` or SPA-only `docker cp`
- Commit only when user asks
- Occupancy remains a wet signal in `normalize_binary_active` (already live)


### Task 1: `problem_when` polarity in evaluator (TDD)

**Files:**
- Modify: `brain/dsc_brain/zigbee_policies.py`
- Modify: `brain/tests/test_zigbee_policies.py`

**Interfaces:**
- Consumes: existing `normalize_binary_active`, `evaluate_device_policies`, `save_zigbee_policies`
- Produces: params `problem_when: "active"|"inactive"`; problem edge uses inverted raw when inactive

- [ ] **Step 1: Write failing tests**

```python
def test_problem_when_inactive_oos_on_dry(temp_db, monkeypatch):
    # humidifier empty: dry → OOS
    monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", temp_db)
    monkeypatch.setattr(
        "dsc_brain.appliance_driver.force_set_sonoff_relay_sync",
        lambda *_a, **_k: None,
    )
    from dsc_brain.zigbee_policies import evaluate_device_policies, save_zigbee_policies
    from dsc_brain.fleet_state import get_fleet_state, update_fleet_state
    from dsc_brain.settings import list_inventory

    fleet = get_fleet_state()
    fleet.system = dict(fleet.system)
    fleet.system["zigbee_policy_state"] = {}
    fleet.system["critical_banners"] = []
    update_fleet_state(fleet)

    save_zigbee_policies({
        "0xhum": {
            "recipe_id": "tank_full_appliance",
            "enabled": True,
            "params": {
                "seat_id": "humidifier",
                "problem_when": "inactive",
                "banner": "Humidifier EMPTY - refill",
            },
        }
    })
    out = evaluate_device_policies(
        ieee="0xhum", friendly_name="tank", payload={"occupancy": False}
    )
    assert out and out["action"] == "active"
    hum = next(r for r in list_inventory(temp_db) if r["seat_id"] == "humidifier")
    assert hum["in_service"] is False

def test_problem_when_inactive_clears_on_wet(temp_db, monkeypatch):
    # after empty OOS, wet → restore
    ...
```

- [ ] **Step 2: Run tests — expect FAIL** (unknown param / always uses raw active)

Run: `cd brain && python -m pytest tests/test_zigbee_policies.py::test_problem_when_inactive_oos_on_dry -v`

- [ ] **Step 3: Implement**

In `evaluate_device_policies`, after `active = normalize_binary_active(payload)`:

```python
problem_when = str(params.get("problem_when") or "active").strip().lower()
if problem_when not in ("active", "inactive"):
    problem_when = "active"
problem = active if problem_when == "active" else (not active)
# use `problem` for edge detect / apply_active / apply_clear
# store both raw and problem in zigbee_policy_state for honesty
```

Update recipe catalog entry:

```python
{
    "id": "tank_full_appliance",
    "label": "Liquid level → appliance OOS",
    "when": "active",  # semantic: "problem" after polarity; keep when key for catalog
    "clear_when": "inactive",
    "default_params": {
        "seat_id": "dehumidifier",
        "problem_when": "active",
        "force_relay": "off",
        "banner": "Dehumidifier tank FULL - empty tank",
        "banner_tone": "critical",
    },
    "device_classes": ["liquid", "safety"],
    "suggested_roles": ["leak_tank", "leak_floor"],
    "param_schema": {
        "seat_id": {"type": "enum", "values": ["dehumidifier", "humidifier"]},
        "problem_when": {"type": "enum", "values": ["active", "inactive"]},
        "banner": {"type": "string"},
    },
    ...
}
```

Add helper `banner_template(seat_id, problem_when) -> str` for SPA defaults.

- [ ] **Step 4: Run full policy tests — expect PASS**

Run: `cd brain && python -m pytest tests/test_zigbee_policies.py -q`

- [ ] **Step 5: Commit only if user asked**

---
