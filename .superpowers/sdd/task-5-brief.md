# Task brief

## Global Constraints

- Spec: `docs/superpowers/specs/2026-08-30-zigbee-role-vs-task-operator-design.md` (approved)
- Parent: `docs/superpowers/specs/2026-08-30-zigbee-device-tasks-design.md`
- Keep recipe id `tank_full_appliance`; change label only
- Pi: never bare `docker kill`; prefer `timeout 25 docker restart` or SPA-only `docker cp`
- Commit only when user asks
- Occupancy remains a wet signal in `normalize_binary_active` (already live)


### Task 5: Pi hotpatch + evidence

**Files:** audit scripts under `.audit/` as needed

- [ ] **Step 1:** Hotpatch `zigbee_policies.py` + `zigbee_mqtt.py` with `timeout 25 docker restart dsc-hub-brain` (not bare kill)
- [ ] **Step 2:** docker cp SPA static
- [ ] **Step 3:** Evidence MQTT inject on a policy with `seat_id=humidifier`, `problem_when=inactive`, dry → OOS + banner; wet → clear
- [ ] **Step 4:** Confirm existing `0xa4c138b9e2b9b690` still dehum-full (active) after migration defaults
- [ ] **Step 5:** Update `docs/FOLLOWUPS.md` implement row to **done (live)** with evidence note

---
