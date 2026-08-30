# Task 1 Review — `problem_when` polarity in evaluator

**Reviewer:** subagent (task-scoped gate)  
**Date:** 2026-08-30  
**Artifacts:** task-1-brief.md, task-1-report.md, task-1-review-pkg.diff, spec `2026-08-30-zigbee-role-vs-task-operator-design.md`

---

## Verdict

| Gate | Result |
|------|--------|
| **Spec compliance (Task 1 scope)** | ✅ |
| **Task quality** | **Approved** |

Task 1 delivers the evaluator-side `problem_when` polarity, catalog/schema updates, and `banner_template` helper as specified. Out-of-scope items (SPA label, capability filtering, migration script) are correctly deferred.

---

## Spec compliance (Task 1 scope)

### Met

- Recipe id remains `tank_full_appliance`; catalog label updated to **Liquid level → appliance OOS**.
- Evaluator accepts `problem_when: "active" | "inactive"` with invalid values falling back to `"active"`.
- Problem edge uses inverted raw when `problem_when == "inactive"`:
  `problem = active if problem_when == "active" else (not active)`.
- Edge detection and `_apply_active` / `_apply_clear` run on `problem`, not raw `active`.
- `zigbee_policy_state` stores `active` (raw), `problem`, and `problem_when` for honesty.
- Recipe catalog adds `device_classes`, `suggested_roles`, `param_schema` (seat_id, problem_when, banner).
- `banner_template(seat_id, problem_when)` helper present for SPA defaults.
- `normalize_binary_active` unchanged — occupancy remains last-resort wet signal.
- TDD flow evidenced: failing inactive-polarity test, implementation, 12/12 policy tests passing (per report; not re-run here).
- New tests cover humidifier empty (dry → OOS, wet → restore) using `occupancy` payload.
- Default dehum wet=problem behavior preserved via `default_params.problem_when = "active"` and existing tests.

### Gaps (non-blocking for Task 1)

- **SPA / Settings UI** still shows old task label — explicitly Task 2+; not a Task 1 miss.
- **No explicit migration test** for partial/empty stored params → merged defaults on save/evaluate (behavior is present via `save_zigbee_policies` default merge; acceptable for this task).
- **Honesty state not asserted in tests** — implementation writes `active` + `problem` to fleet state, but new tests do not read back `zigbee_policy_state` (see Minor).

---

## Code quality

### Strengths

- Polarity logic is localized and readable; param sanitization is defensive.
- Return payloads include both `active` and `problem`, aligning with spec honesty goals.
- `banner_template` covers both appliance × polarity combinations with sensible copy.
- Tests follow existing patterns (temp_db, fleet reset, relay mock) and integrate with MQTT ingest paths.
- Scope discipline: only `zigbee_policies.py` + tests touched; no unrelated refactors.

### Findings

#### Important

1. **Legacy `zigbee_policy_state` without `problem` key** — Edge detect uses `prev_problem = prev.get("problem")` only. Pre-upgrade entries that stored `{ "active": true }` without `problem` will treat `prev_problem` as `None` on the next wet reading (`problem=True`), causing a false edge and re-firing `_apply_active` (duplicate banner/grow-log). Not a correctness break (OOS stays OOS), but noisy on Pi upgrade. Consider deriving `prev_problem` from legacy `prev["active"]` + stored/default `problem_when` when `problem` is absent. Implementer noted related concern in report.

#### Minor

1. **Policy-state honesty untested** — Brief calls out storing raw + problem for honesty; no test asserts fleet `zigbee_policy_state` after evaluate (e.g. dry/inactive → `{ active: false, problem: true }`).
2. **`test_problem_when_inactive_oos_on_dry` thin assertions** — Confirms OOS and `action=active` but not banner text or `out["problem"]`.
3. **`banner_template("humidifier", "active")`** returns FULL copy — semantically odd for humidifier-empty use case; only matters if SPA picks active polarity for humidifier (unlikely operator path).
4. **Grow-log reason still `tank_full`** in `_apply_active` — pre-existing string; humidifier-empty path logs same reason tag (cosmetic).
5. **PEP8 spacing** — single blank line between `_apply_active` and `_apply_clear` (two preferred); negligible.

---

## Checklist vs brief

| Requirement | Status |
|-------------|--------|
| Files: `zigbee_policies.py`, `test_zigbee_policies.py` | ✅ |
| `test_problem_when_inactive_oos_on_dry` | ✅ |
| `test_problem_when_inactive_clears_on_wet` | ✅ |
| Evaluator `problem_when` + inverted problem edge | ✅ |
| Store raw + problem in policy state | ✅ (impl; not tested) |
| Catalog label + schema + device_classes | ✅ |
| `banner_template` helper | ✅ |
| Occupancy unchanged | ✅ |
| No commit (user rule) | ✅ |
| Full `test_zigbee_policies.py` pass | ✅ (per report) |

---

## Recommendation

**Approve Task 1** for merge into the working branch / continuation to Task 2.

Optional follow-up before Pi hotpatch (can be Task 1.1 or folded into Task 2): legacy `prev_problem` derivation to avoid duplicate OOS on first post-upgrade wet reading; add one test seeding old `{ active: true }` state and asserting `changed=False` on repeat wet.
