# Task 1 Report — Roles + `floor_flood_alert` recipe (TDD)

**Status:** DONE  
**Branch:** (unchanged — working tree)  
**Commit:** none (per user rule: commit only when asked)  
**Runtime code changed:** yes

## What was done

Added three space-scoped floor leak roles to the Zigbee role catalog, a banner-only `floor_flood_alert` recipe (no appliance OOS / relay force), and `flood_banner_template(problem_when)` helper for SPA defaults. Reused existing `_apply_active` / `_apply_clear` paths — flood params omit `seat_id` and `force_relay`, so only banner + grow-log fire.

### Steps completed (TDD)

1. **RED — Write failing tests**  
   Appended to `brain/tests/test_zigbee_policies.py`:
   - `test_floor_flood_wet_banner_no_oos`
   - `test_floor_flood_dry_clears_banner`
   - `test_floor_flood_inactive_polarity`
   - `test_flood_banner_template`  
   Appended to `brain/tests/test_zigbee_capability.py`:
   - `test_floor_space_roles_in_safety_filter`

2. **RED — Run tests (expect FAIL)**  
   ```
   cd brain && python -m pytest tests/test_zigbee_policies.py::test_floor_flood_wet_banner_no_oos tests/test_zigbee_policies.py::test_flood_banner_template tests/test_zigbee_capability.py::test_floor_space_roles_in_safety_filter -v
   ```
   **Evidence (3 failed):**
   - `test_floor_flood_wet_banner_no_oos` → `ValueError: unknown recipe_id floor_flood_alert`
   - `test_flood_banner_template` → `ImportError: cannot import name 'flood_banner_template'`
   - `test_floor_space_roles_in_safety_filter` → `AssertionError: 'leak_floor_room' not in {'door_tent', 'leak_floor', 'leak_tank', 'unbound'}`

3. **GREEN — Implement catalog + helper**  
   - `brain/dsc_brain/zigbee_mqtt.py`: added `leak_floor_room`, `leak_floor_4x8`, `leak_floor_2x4` after `leak_floor` in `ZIGBEE_ROLE_CATALOG`.
   - `brain/dsc_brain/zigbee_policies.py`: added `flood_banner_template(problem_when)`; added `floor_flood_alert` to `RECIPE_CATALOG` after `tank_full_appliance` with `device_classes`, `suggested_roles`, `param_schema`, and banner-only defaults (no `seat_id` / `force_relay`).

4. **GREEN — Run full policy + capability tests (expect PASS)**  
   ```
   cd brain && python -m pytest tests/test_zigbee_policies.py tests/test_zigbee_capability.py -v
   ```
   **Evidence:** `31 passed in 4.64s`

5. **Commit** — skipped (user did not ask).

## Self-review

| Brief requirement | Met |
|-------------------|-----|
| Roles `leak_floor_room`, `leak_floor_4x8`, `leak_floor_2x4` in catalog | yes |
| Roles appear in liquid/safety filter | yes |
| Recipe id `floor_flood_alert` in `RECIPE_CATALOG` | yes |
| Banner-only (no OOS, no relay force) | yes — verified by `test_floor_flood_wet_banner_no_oos` |
| Wet → critical banner; dry → clear | yes |
| `problem_when: inactive` polarity | yes |
| `flood_banner_template(problem_when)` helper | yes |
| No evaluator fork (reuse `_apply_active` / `_apply_clear`) | yes |
| Tank regressions pass | yes — all 13 existing policy tests green |
| TDD RED→GREEN | yes |

## Test summary

`31 passed` — 17 policy tests (4 new floor-flood + 13 existing tank/legacy) and 14 capability tests (1 new role filter + 13 existing).

## Concerns

1. **Brief typo `get_role_catalog`** — codebase uses `get_zigbee_role_catalog`; test uses existing name (consistent with other capability tests).
2. **SPA not updated** — `floor_flood_alert` recipe and `flood_banner_template` not wired in Settings UI; out of scope for this task.
3. **`test_filter_recipes_liquid_includes_tank_full`** — still only asserts `tank_full_appliance`; `floor_flood_alert` is also liquid-eligible but not explicitly tested (harmless; filter logic is generic).

## Files touched

| Path | Action |
|------|--------|
| `brain/dsc_brain/zigbee_mqtt.py` | 3 new floor space roles |
| `brain/dsc_brain/zigbee_policies.py` | `floor_flood_alert` recipe, `flood_banner_template` |
| `brain/tests/test_zigbee_policies.py` | 4 new tests |
| `brain/tests/test_zigbee_capability.py` | 1 new test |
| `.superpowers/sdd/task-1-report.md` | this report |
