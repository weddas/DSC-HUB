# Task 4 Report: Pass 2 — Climate honesty tests (brain)

**Status:** complete  
**Branch:** master  
**Date:** 2026-09-01

## Summary

Created `brain/tests/test_live_ux_climate_honesty.py` using the `_point_db` pattern from `test_space_energy_stress.py` / `test_live_ux_light_honesty.py` and policy-state contracts from `test_zigbee_policies.py`. No brain or SPA code changes were required — existing `_reduced_kit` and `evaluate_device_policies` behavior already satisfies the honesty guards.

## Deliverables

| Item | Path | Notes |
|------|------|-------|
| Test module | `brain/tests/test_live_ux_climate_honesty.py` | 3 tests, all PASS |
| SPA changes | — | None (per brief) |
| Policy engine | — | None invented (reuses existing zigbee policy path) |

## Tests implemented

### 1. `test_reduced_kit_pot34_planned_not_offline_lead`

Points `DEFAULT_DB` at `temp_db`, calls `_reduced_kit(list_inventory(temp_db))`:

- `POT3` / `POT4` not in `offline` (Capacity lead)
- Both in `planned_oos`
- `active` is False when only planned seats are OOS (default kit inventory)

### 2. `test_wet_without_bound_recipe_does_not_set_policy_problem`

Documents SPA contract: Wet/Dry is raw; Problem/Clear only from bound `policy_state`.

- Recipe `none` + wet `occupancy` payload → `evaluate_device_policies` returns `None`
- No `zigbee_policy_state` entry for the ieee

Browser proof deferred to Task 6 (per brief).

### 3. `test_wet_is_not_problem_when_policy_problem_when_inactive`

Demonstrates raw wet ≠ policy problem when `problem_when=inactive`:

- Wet payload → `active=True`, `problem=False` in evaluate result and fleet `policy_state`

SPA must read `policy_state.problem`, not infer from wet alone.

## Test run

```powershell
cd brain; python -m pytest tests/test_live_ux_climate_honesty.py tests/test_reduced_kit.py -q --tb=short
```

```
5 passed in 1.35s
```

(3 new + 2 existing from `test_reduced_kit.py`)

## Commit

```
2feb837 test(brain): add Pass 2 climate honesty guard tests
```

Files: `brain/tests/test_live_ux_climate_honesty.py`

## Concerns / follow-ups

- **Overlap with existing coverage:** `test_reduced_kit.py` and `test_space_energy_stress.py::test_reduced_kit_pot4_planned` partially overlap on pot3/4 planned OOS. This module is the Live UX honesty program guard rail with explicit brief shapes and wet-vs-problem documentation.
- **SPA not exercised here:** Wet/Problem chip rendering on `#/live/climate` is Task 5; browser matrix is Task 6.
- **No brain fixes needed:** All guards passed on first run.

## Out of scope (not done)

- Push to remote
- SPA changes
- Task 5+ work
- New policy engine
