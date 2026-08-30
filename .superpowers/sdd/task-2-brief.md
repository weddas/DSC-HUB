# Task brief

## Global Constraints

- Spec: `docs/superpowers/specs/2026-08-30-zigbee-role-vs-task-operator-design.md` (approved)
- Parent: `docs/superpowers/specs/2026-08-30-zigbee-device-tasks-design.md`
- Keep recipe id `tank_full_appliance`; change label only
- Pi: never bare `docker kill`; prefer `timeout 25 docker restart` or SPA-only `docker cp`
- Commit only when user asks
- Occupancy remains a wet signal in `normalize_binary_active` (already live)


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
