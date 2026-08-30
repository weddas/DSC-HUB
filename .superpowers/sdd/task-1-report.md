# Task 1 Report — `problem_when` polarity in evaluator (TDD)

**Status:** DONE  
**Branch:** (unchanged — working tree)  
**Commit:** none (per user rule: commit only when asked)  
**Runtime code changed:** yes

## What was done

Generalized `tank_full_appliance` evaluator with `problem_when` polarity so dry/inactive can mean problem (humidifier empty) while preserving default wet=problem for dehum tank full.

### Steps completed (TDD)

1. **RED — Write failing tests**  
   Added `test_problem_when_inactive_oos_on_dry`, `test_problem_when_inactive_clears_on_wet`, and `test_banner_template` to `brain/tests/test_zigbee_policies.py`.

2. **RED — Run tests (expect FAIL)**  
   ```
   cd brain && python -m pytest tests/test_zigbee_policies.py::test_problem_when_inactive_oos_on_dry -v
   ```
   **Evidence:** dry + `problem_when=inactive` returned `action=clear` instead of `active` (always used raw active).

3. **GREEN — Implement**  
   - `evaluate_device_policies`: compute `problem_when` param, derive `problem = active if active-polarity else (not active)`, edge-detect on `problem`, store both `active` (raw) and `problem` in `zigbee_policy_state`.
   - Recipe catalog: label → "Liquid level → appliance OOS"; added `problem_when` default, `device_classes`, `param_schema`.
   - Added `banner_template(seat_id, problem_when)` for SPA defaults.

4. **GREEN — Run full policy tests (expect PASS)**  
   ```
   cd brain && python -m pytest tests/test_zigbee_policies.py -q
   ```
   **Evidence:** `12 passed in 2.56s`

5. **Commit** — skipped (user did not ask).

## Self-review

| Brief requirement | Met |
|-------------------|-----|
| Keep recipe id `tank_full_appliance` | yes |
| Label → "Liquid level → appliance OOS" | yes |
| `problem_when: active\|inactive` param | yes |
| Invert raw when `inactive` for problem edge | yes |
| Store raw + problem in policy state | yes |
| `device_classes`, `param_schema` on catalog | yes |
| `banner_template(seat_id, problem_when)` helper | yes |
| Occupancy unchanged in `normalize_binary_active` | yes (no edit) |
| Existing dehum wet→OOS / dry→restore tests pass | yes |
| TDD RED→GREEN | yes |

## Test summary

`12 passed` — all `test_zigbee_policies.py` including new inactive-polarity dry-OOS and wet-restore cases; existing tank_full and MQTT ingest tests unchanged.

## Concerns

1. **`test_dry_does_not_clobber_manual_oos` prev state** — still seeds legacy `active: True`; now correctly treated as prior problem via fallback (same as review fix).
2. **SPA not updated** — Settings still shows old label "Tank full → appliance OOS" in `SettingsPage.tsx`; Task 2+ scope.
3. **Invalid `problem_when` values** — silently fall back to `active`; no grow-log or API validation error (acceptable for v1 per brief).

## Files touched

| Path | Action |
|------|--------|
| `brain/dsc_brain/zigbee_policies.py` | `problem_when` eval, catalog/schema, `banner_template` |
| `brain/tests/test_zigbee_policies.py` | 3 new tests |
| `.superpowers/sdd/task-1-report.md` | this report |

## Review fix — legacy `zigbee_policy_state` edge detect

**Finding:** After upgrade, entries with only legacy `active` (old problem/wet state) could mis-compare against new raw `active`, wrongly re-firing `_apply_active` on first evaluate.

**Change:** In `evaluate_device_policies`, previous problem for edge detect now uses `prev["problem"]` when present, else falls back to legacy `prev["active"]`. Still stores both `active` (raw) and `problem` on every evaluate.

**Test:** `test_legacy_policy_state_active_means_problem_no_refire` — seeds `{recipe_id, active: True}`, evaluates wet with `problem_when=active`, asserts `changed` is False and no relay force.

**Test run:**
```
cd brain && python -m pytest tests/test_zigbee_policies.py -q
13 passed in 2.32s
```

**Commit:** none (per user rule).
