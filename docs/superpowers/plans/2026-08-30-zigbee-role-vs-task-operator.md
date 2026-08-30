# Zigbee Role vs Task operator path — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let operators bind any Zigbee device via capability-filtered Role/Zone/Task selects, with optional liquid Task params (appliance + problem polarity + editable banner) so humidifier-empty and dehumidifier-full share one recipe without one-off wiring; climate sensors stay Role-only datapoints.

**Architecture:** Infer `capability_class` from z2m exposes/state; filter role/zone/recipe lists in Settings; generalize `tank_full_appliance` with `problem_when` + `seat_id` + banner params; keep Role bindings as data routing and Task policies as optional actuators. Show-all + sticky `capability_override` for mis-fingerprints.

**Tech Stack:** Python `zigbee_policies.py` / `zigbee_mqtt.py` / FastAPI, React Settings SPA, pytest, Pi hotpatch (`timeout` docker restart only).

## Global Constraints

- Spec: `docs/superpowers/specs/2026-08-30-zigbee-role-vs-task-operator-design.md` (approved)
- Parent: `docs/superpowers/specs/2026-08-30-zigbee-device-tasks-design.md`
- Keep recipe id `tank_full_appliance`; change label only
- Pi: never bare `docker kill`; prefer `timeout 25 docker restart` or SPA-only `docker cp`
- Commit only when user asks
- Occupancy remains a wet signal in `normalize_binary_active` (already live)

### File map

| File | Responsibility |
|------|----------------|
| `brain/dsc_brain/zigbee_policies.py` | `problem_when`, banner templates, recipe label/schema, evaluate polarity |
| `brain/dsc_brain/zigbee_mqtt.py` | `capability_class` inference; devices API fields; optional override persist |
| `brain/dsc_brain/api.py` | Pass-through if devices already expose new fields |
| `brain/tests/test_zigbee_policies.py` | Polarity + humidifier empty + schema |
| `brain/tests/test_zigbee_capability.py` (new) | Class inference + filter helpers |
| `homeassistant/.../SettingsPage.tsx` | Filtered selects, Show all, Task param controls |
| `homeassistant/.../fleetApi.ts` | Types for capability / recipe schema |
| `docs/FOLLOWUPS.md` | Mark implement done when verified |

---

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

### Task 2: Capability class inference (TDD)

**Files:**
- Create: `brain/tests/test_zigbee_capability.py`
- Modify: `brain/dsc_brain/zigbee_mqtt.py` (helpers + `get_zigbee_devices`)

**Interfaces:**
- Produces:
  - `infer_capability_class(exposes_props: set[str], state_keys: set[str]) -> str`
  - `filter_roles_for_class(class: str, roles: list) -> list`
  - `filter_recipes_for_class(class: str, recipes: list) -> list`
  - Device dict gains `capability_class`, optional `capability_override`

- [ ] **Step 1: Failing tests**

```python
from dsc_brain.zigbee_mqtt import infer_capability_class, filter_roles_for_class

def test_infer_climate():
    assert infer_capability_class({"temperature", "humidity"}, set()) == "climate"

def test_infer_liquid_from_water_leak():
    assert infer_capability_class({"water_leak", "battery"}, set()) == "liquid"

def test_infer_occupancy_alone_is_motion():
    assert infer_capability_class({"occupancy", "battery"}, set()) == "motion"

def test_filter_climate_roles_exclude_leak():
    roles = filter_roles_for_class("climate", get_zigbee_role_catalog())
    ids = {r["id"] for r in roles}
    assert "intake" in ids and "canopy_4x8" in ids
    assert "leak_tank" not in ids
    assert "unbound" in ids
```

- [ ] **Step 2: Run — expect FAIL** (import/missing)

- [ ] **Step 3: Implement inference**

```python
def infer_capability_class(exposes: set[str], state_keys: set[str] | None = None) -> str:
    keys = {*(exposes or), *((state_keys) or set())}
    keys = {str(k).lower() for k in keys}
    if keys & {"water_leak", "leak", "moisture"}:
        return "liquid"
    if keys & {"temperature", "humidity"}:
        return "climate"
    if keys & {"state"} and not (keys & {"temperature", "humidity"}):
        # weak plug hint — refine with device type if needed
        pass
    if "occupancy" in keys and not (keys & {"water_leak", "temperature"}):
        return "motion"
    return "other"
```

Map class → role kinds: climate→`climate`; liquid→`safety`; plug→`plug`; motion/other→`none` (Unbound only until Show all).

Wire into `get_zigbee_devices()`: compute class from bridge definition exposes if cached, else from `_device_states` keys; apply binding `capability_override` if set.

- [ ] **Step 4: Tests PASS**

Run: `cd brain && python -m pytest tests/test_zigbee_capability.py tests/test_zigbee_policies.py -q`

---

### Task 3: Persist capability_override on bind (optional sticky)

**Files:**
- Modify: `brain/dsc_brain/zigbee_mqtt.py` `save_zigbee_bindings` / binding schema
- Modify: `brain/tests/test_zigbee_capability.py`

- [ ] **Step 1: Test** — save binding with `capability_override: "liquid"`; `get_zigbee_devices` reports class liquid even if exposes are occupancy-only
- [ ] **Step 2: Implement** — allow optional `capability_override` on binding row; SPA sets it when operator picks a safety role via Show all on a motion-class device
- [ ] **Step 3: Tests PASS**

---

### Task 4: Settings SPA — filtered selects + Task params

**Files:**
- Modify: `homeassistant/custom_components/dsc_hub/frontend/src/pages/SettingsPage.tsx`
- Modify: `homeassistant/custom_components/dsc_hub/frontend/src/lib/fleetApi.ts`
- Build: SPA `npm run build` (or project’s spa build script) → `spa-dist`

**Interfaces:**
- Consumes: `device.capability_class`, recipe `device_classes` / `param_schema`, roles `kind`
- Produces: Save still `put_zigbee_bindings` + `put_zigbee_policies` with full params

- [ ] **Step 1: Types in fleetApi** — recipes include `device_classes?`, `param_schema?`; devices include `capability_class?`

- [ ] **Step 2: ZigbeeBindRow** — props: `capabilityClass`, `showAll`, `onToggleShowAll`, filtered role/zone/recipe options; when recipe is liquid-level, render:
  - `<select>` Appliance (dehumidifier/humidifier)
  - `<select>` Problem when (labels: “Wet / active = problem”, “Dry / inactive = problem”)
  - `<input>` Banner text
  - Changing appliance/polarity refreshes banner from template **only if** banner still equals previous template (don’t clobber custom edits)

- [ ] **Step 3: Filter helpers (client)** — mirror server rules; if `showAll`, use full catalogs

- [ ] **Step 4: Help copy** under table: *Role is where this sensor lives. Task is optional — No task only reports into Live/Climate.*

- [ ] **Step 5: Build SPA** and smoke-check Settings types compile

---

### Task 5: Pi hotpatch + evidence

**Files:** audit scripts under `.audit/` as needed

- [ ] **Step 1:** Hotpatch `zigbee_policies.py` + `zigbee_mqtt.py` with `timeout 25 docker restart dsc-hub-brain` (not bare kill)
- [ ] **Step 2:** docker cp SPA static
- [ ] **Step 3:** Evidence MQTT inject on a policy with `seat_id=humidifier`, `problem_when=inactive`, dry → OOS + banner; wet → clear
- [ ] **Step 4:** Confirm existing `0xa4c138b9e2b9b690` still dehum-full (active) after migration defaults
- [ ] **Step 5:** Update `docs/FOLLOWUPS.md` implement row to **done (live)** with evidence note

---

## Spec coverage checklist

| Spec requirement | Task |
|------------------|------|
| Role-only datapoint (No task) | 4 (UI) + existing bindings |
| Humidifier empty via polarity | 1 |
| Operator C: appliance + polarity + banner | 1 + 4 |
| Capability-filtered Role/Zone/Task | 2 + 4 |
| Show all / occupancy override | 3 + 4 |
| Migrate keep `tank_full_appliance` id | 1 |
| Multi-height = distinct climate roles | 2 filters + 4 (no new roles) |

---

## Execution handoff

Plan complete and saved to `docs/superpowers/plans/2026-08-30-zigbee-role-vs-task-operator.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** — fresh subagent per task, review between tasks  
2. **Inline Execution** — this session, executing-plans with checkpoints  

Which approach?
