# Task 2 Report — Capability class inference (TDD)

**Status:** DONE  
**Branch:** (unchanged — working tree)  
**Commit:** none (per user rule: commit only when asked)  
**Runtime code changed:** yes

## What was done

Added capability-class inference and catalog filtering helpers in `zigbee_mqtt.py`, wired `capability_class` (and optional `capability_override`) onto each device from `get_zigbee_devices()`, and stored `expose_props` from Z2M bridge device payloads for honest class fingerprinting before first MQTT state.

### Steps completed (TDD)

1. **RED — Write failing tests**  
   Created `brain/tests/test_zigbee_capability.py` with 12 tests covering:
   - `infer_capability_class` (climate, liquid, motion, liquid-over-climate priority, other)
   - `filter_roles_for_class` (climate excludes leak roles; liquid safety-only; motion unbound-only)
   - `filter_recipes_for_class` (liquid includes `tank_full_appliance`; climate none-only)
   - `get_zigbee_devices` capability from live state keys and binding `capability_override`

2. **RED — Run tests (expect FAIL)**  
   ```
   cd brain; python -m pytest tests/test_zigbee_capability.py -q
   ```
   **Evidence:** 12 failed — `ImportError` for missing helpers; `KeyError: 'capability_class'` on device rows.

3. **GREEN — Implement**  
   - `infer_capability_class(exposes_props, state_keys)` — liquid > climate > motion > other; occupancy wet signal unchanged in policies layer.
   - `filter_roles_for_class(class, roles)` — climate→`kind: climate`; liquid→`kind: safety`; plug→`kind: plug`; motion/other→unbound only.
   - `filter_recipes_for_class(class, recipes)` — always includes `none`; others require `capability_class` in recipe `device_classes`.
   - `_expose_properties_from_exposes` + `expose_props` on bridge device rows (`_update_devices`, successful `device_interview`).
   - `get_zigbee_devices()` sets `capability_class`; sets `capability_override` when binding carries override (Task 3 will persist on save).

4. **GREEN — Run full test suite (expect PASS)**  
   ```
   cd brain; python -m pytest tests/test_zigbee_capability.py tests/test_zigbee_policies.py -q
   ```
   **Evidence:** `25 passed in 2.29s`

5. **Commit** — skipped (user did not ask).

## Self-review

| Brief requirement | Met |
|-------------------|-----|
| `infer_capability_class(exposes_props, state_keys) -> str` | yes |
| `filter_roles_for_class(class, roles) -> list` | yes |
| `filter_recipes_for_class(class, recipes) -> list` | yes |
| Device dict gains `capability_class` | yes |
| Optional `capability_override` on device when binding has it | yes |
| climate → kind climate (+ unbound) | yes |
| liquid → kind safety (+ unbound) | yes |
| plug → kind plug (+ unbound) | yes |
| motion/other → unbound only | yes |
| Recipes filter by `device_classes` intersection; always `none` | yes |
| Wire into `get_zigbee_devices()` | yes |
| Exposes from bridge definition when cached | yes |
| Fallback to `_device_states` keys | yes |
| Binding `capability_override` applied | yes |
| TDD RED→GREEN | yes |
| No git commit | yes |

## Test summary

`25 passed` — 12 new capability tests + 13 existing policy tests unchanged.

## Concerns / follow-ups

1. **Plug inference weak** — brief leaves `state`-only devices as `other`; plug kind filtering exists but inference does not yet return `plug` (deferred until device-type refinement).
2. **Task 3 scope** — `save_zigbee_bindings` does not yet accept/persist `capability_override`; read path works when override is present in stored JSON.
3. **SPA not updated** — Settings filtered selects remain Task 4; server helpers ready for API consumers.
4. **`definition` on device rows** — now stored from bridge list for expose extraction; slightly larger device payload (acceptable for Settings honesty).

## Files touched

| Path | Action |
|------|--------|
| `brain/dsc_brain/zigbee_mqtt.py` | inference/filter helpers, expose_props cache, `get_zigbee_devices` wiring |
| `brain/tests/test_zigbee_capability.py` | new — 12 tests |
| `.superpowers/sdd/task-2-report.md` | this report |
