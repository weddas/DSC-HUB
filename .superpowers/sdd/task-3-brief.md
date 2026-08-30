# Task brief

## Global Constraints

- Spec: `docs/superpowers/specs/2026-08-30-zigbee-role-vs-task-operator-design.md` (approved)
- Parent: `docs/superpowers/specs/2026-08-30-zigbee-device-tasks-design.md`
- Keep recipe id `tank_full_appliance`; change label only
- Pi: never bare `docker kill`; prefer `timeout 25 docker restart` or SPA-only `docker cp`
- Commit only when user asks
- Occupancy remains a wet signal in `normalize_binary_active` (already live)


### Task 3: Persist capability_override on bind (optional sticky)

**Files:**
- Modify: `brain/dsc_brain/zigbee_mqtt.py` `save_zigbee_bindings` / binding schema
- Modify: `brain/tests/test_zigbee_capability.py`

- [ ] **Step 1: Test** — save binding with `capability_override: "liquid"`; `get_zigbee_devices` reports class liquid even if exposes are occupancy-only
- [ ] **Step 2: Implement** — allow optional `capability_override` on binding row; SPA sets it when operator picks a safety role via Show all on a motion-class device
- [ ] **Step 3: Tests PASS**

---
