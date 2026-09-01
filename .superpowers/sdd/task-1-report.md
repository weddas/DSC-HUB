# Task 1 Report: Pass 1 — Light honesty tests (brain/API)

**Status:** complete  
**Branch:** master  
**Date:** 2026-09-01

## Summary

Created `brain/tests/test_live_ux_light_honesty.py` using the `_point_db` + `TestClient` fixture pattern from `brain/tests/test_space_energy_stress.py`. No brain or SPA code changes were required — existing API behavior already satisfies the honesty guards.

## Deliverables

| Item | Path | Notes |
|------|------|-------|
| Test module | `brain/tests/test_live_ux_light_honesty.py` | 3 tests, all PASS |
| SPA changes | — | None (per brief) |

## Tests implemented

### 1. `test_both_spaces_estimate_labeled_and_suggestions_never_apply`

For both `4x8` and `2x4`:

- `GET /energy/estimate` → 200, `ok: true`, `estimate_label` contains `"Estimate"`
- `GET /energy/suggestions` → top-level `apply: false`, every suggestion `apply: false`

Params: `lights_on=06:00:00`, `want_hours=12` (per brief).

### 2. `test_shift_confirm_gate_both_spaces`

For both spaces:

- `POST /energy/shift/plan` with `confirm: false` → **400**

Policy: `pause`; shift `06:00:00` → `08:00:00`.

### 3. `test_journal_space_provenance_both_spaces`

Posts operator notes to `/journal/space/2x4` and `/journal/space/4x8`; GET lists assert:

- Response `space_id` matches tent
- Posted and listed entries include `space_id`, `provenance: "space"`, `source: "operator"`
- Notes round-trip in entry lists

Matches existing journal API shape from `dsc_brain.space_journal.add_space_entry` / `list_space_native`.

## Test run

```powershell
cd brain; python -m pytest tests/test_live_ux_light_honesty.py -q --tb=short
```

```
3 passed in 2.90s
```

## Commit

```
77c8541 test(brain): add Pass 1 light honesty guard tests
```

Files: `brain/tests/test_live_ux_light_honesty.py`

## Concerns / follow-ups

- **Overlap with existing coverage:** `test_space_energy_stress.py::test_confirm_gate_and_both_spaces_estimate` and `test_journal_api.py::test_journal_space_energy_api` partially overlap. This module is intentionally scoped as the Live UX honesty program guard rail with exact brief shapes and both-space coverage.
- **No brain fixes needed:** All guards passed on first run; no API regressions found.
- **Task 2+:** SPA polish for light surfaces should treat these tests as the brain contract; do not start Task 2 from this pass.

## Out of scope (not done)

- Push to remote
- SPA changes
- Task 2+ work
