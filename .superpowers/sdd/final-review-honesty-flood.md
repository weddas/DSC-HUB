# Final whole-branch review — Zigbee policy honesty + floor flood

**Date:** 2026-08-31  
**Scope:** Tasks 1–4 (code + docs). Task 5 Pi evidence **BLOCKED** — not evaluated as live proof.  
**Base:** `5cb0aa4e169e6a77df074b3005e2fae9a6a4817b`  
**Spec:** [`docs/superpowers/specs/2026-08-31-zigbee-policy-honesty-floor-flood-design.md`](../../docs/superpowers/specs/2026-08-31-zigbee-policy-honesty-floor-flood-design.md)  
**Plan:** [`docs/superpowers/plans/2026-08-31-zigbee-policy-honesty-floor-flood.md`](../../docs/superpowers/plans/2026-08-31-zigbee-policy-honesty-floor-flood.md)  
**Diff package:** `.superpowers/sdd/final-review-pkg-honesty-flood.diff` (+348 / −41 across 8 files)

---

## Verdict

**Ready with minors**

Tasks 1–4 implement the approved spec end-to-end in brain + SPA + FOLLOWUPS. No Critical or Important code gaps block merge once Task 5 Pi evidence is unblocked. Remaining items are test/doc nits and deferred live soak.

---

## Method

- Read spec, plan, progress log, and task 1–4 review carryovers.
- Reviewed whole-branch diff (brain, SPA, FOLLOWUPS).
- Ran pytest locally: `tests/test_zigbee_policies.py` + `tests/test_zigbee_capability.py` → **31 passed**.
- Verified liquid recipe filter includes `floor_flood_alert` at runtime (logic correct; test assertion gap noted below).
- Did **not** claim Task 5 live evidence (Pi unreachable per progress log).

---

## Spec compliance (Tasks 1–4 only)

| Spec requirement | Status | Evidence |
|------------------|--------|----------|
| Wet/Dry primary; Problem/Clear only when Task bound + `zigbee_policy_state` | ✅ | `ClimatePage.tsx` safety rows: wet from `zigbee_by_role`; `showProblem` gates on `policies[ieee].recipe_id !== "none"` and `typeof policy_state.problem === "boolean"`; chip reads `st.problem` only |
| One recipe: `floor_flood_alert` — banner + grow-log, opposite-edge clear, never OOS/relay | ✅ | `zigbee_policies.py` catalog entry omits `seat_id`/`force_relay`; shared `_apply_active`/`_apply_clear` skip seat when empty; tests `test_floor_flood_*` |
| Params `problem_when` + `banner` | ✅ | Recipe `param_schema`; Settings shared task-params panel |
| Distinct floor roles: `leak_floor_room`, `_4x8`, `_2x4`; keep generic `leak_floor` | ✅ | `zigbee_mqtt.py` catalog; Settings fallbacks |
| `isZigbeeSafetyLeakRole` treats all `leak_floor*` | ✅ | `fleetApi.ts` prefix match |
| Shared Settings task params (tank + flood; Appliance tank-only) | ✅ | `SettingsPage.tsx` `TASK_PARAM_IDS`, `taskParamDefaults`, conditional Appliance `<select>` |
| Extend shared evaluator; no flood fork module | ✅ | No evaluator fork; flood uses existing `evaluate_device_policies` path |
| Unit: flood wet→banner no OOS; dry→clear; inactive polarity; tank regressions | ✅ | 31/31 pytest pass including 4 new flood tests + all tank tests |
| Unit/filter: floor roles in safety filter | ✅ | `test_floor_space_roles_in_safety_filter` |
| FOLLOWUPS bookkeeping | ✅ | Task 4: honesty **done**; flood **done (Pi evidence pending Task 5)**; roles **done (catalog)**; multi-sensor **next-plan**; 2×4 bind **deferred** |
| Overview unchanged / no dishonest wet collage | ✅ | No Overview edits (spec: Climate primary this pass) |
| Pi desk flood + tank soak (acceptance §4–5) | ⏸ **Task 5** | Code ready; live bind/evidence not run |

---

## Task summaries

### Task 1 — Roles + `floor_flood_alert` (brain)

**Approved.** Three space floor roles added after generic `leak_floor`. Recipe catalog entry matches tank conventions (`when`, `clear_when`, `device_classes`, `banner_tone`). `flood_banner_template` mirrors SPA helper strings. TDD tests cover wet banner without OOS/relay, dry clear, and inverted `problem_when`.

Architecture is correct: empty `seat_id` in flood params lets existing `_apply_active` upsert banner + grow-log only.

### Task 2 — Settings + fleetApi helpers (SPA)

**Approved.** `isZigbeeSafetyLeakRole` extended with `leak_floor_*` prefix. `zigbeeFloodBannerTemplate` matches brain. Shared `taskParamDefaults` / `updateTaskParam` / `showTaskParams` generalize tank-only liquid params to tank + flood. Recipe `onChange` correctly resolves **next** catalog row for defaults (post-fix). Fallback roles/recipes include new floor roles and flood recipe for offline/catalog-miss paths. SPA build reported green in task reports; `spa-dist` hashed assets updated in working tree.

### Task 3 — Climate safety honesty (SPA)

**Approved.** Climate table maps non-safety roles only. Safety subsection shows Wet/Dry from `by_role` and optional Problem/Clear from `zigbee_policy_state[ieee].problem` — never derived from wet alone. Card visibility includes safety-only fleets; empty climate table suppressed when safety rows exist. Problem chip uses `warn` tone (StatusChip has no `critical`; acceptable).

### Task 4 — FOLLOWUPS

**Approved.** Dated spec/plan note; status rows match brief; flood promoted from “Later recipes” example with explicit Task 5 evidence gate.

---

## Test evidence

```
pytest tests/test_zigbee_policies.py tests/test_zigbee_capability.py -v
31 passed in 7.08s
```

New coverage:

- `test_floor_flood_wet_banner_no_oos`
- `test_floor_flood_dry_clears_banner`
- `test_floor_flood_inactive_polarity`
- `test_flood_banner_template`
- `test_floor_space_roles_in_safety_filter`

Runtime check: `filter_recipes_for_class("liquid", …)` → `{'none', 'floor_flood_alert', 'tank_full_appliance'}`.

---

## Issues

### Critical

- None.

### Important

- None.

### Minor (carryover + whole-branch)

| # | Area | Note |
|---|------|------|
| M1 | Tests | `test_filter_recipes_liquid_includes_tank_full` asserts `tank_full_appliance` only; spec acceptance §2 also expects flood recipe filter — add `floor_flood_alert` to assertion (logic already correct). |
| M2 | Tests | `test_floor_flood_dry_clears_banner` does not assert persisted `zigbee_policy_state["0xflood1"]["problem"] is False` (wet test does assert state). |
| M3 | Brain | `flood_banner_template` lacks docstring while sibling `banner_template` has one. |
| M4 | SPA | `zigbeeFloodBannerTemplate` omits `.strip()` on `problemWhen` (brain strips); edge case for whitespace-padded values only. |
| M5 | SPA | No SPA unit tests for helpers or Climate safety rows (consistent with prior Zigbee SPA tasks; brain tests cover policy semantics). |
| M6 | Soak | Climate Wet/Problem chip behavior not exercised on live Pi fleet (Task 5 blocked). Required for full acceptance, not for code merge of Tasks 1–4. |
| M7 | UX | Unknown wet (`Wet/Dry —`) uses `ok` tone; could read optimistic if sensor never reports. |
| M8 | SPA | `ieeeForRole` defined inside component body; harmless at current scale. |
| M9 | Docs | FOLLOWUPS link text vs href cosmetic inconsistency (pre-existing encoding on section separators). |

---

## Task 5 gate (explicit)

**Not done.** Progress log: Pi unreachable after sudo hang mid-hotpatch; desk flood bind/evidence not run.

When unblocked, Task 5 must verify (per spec acceptance §4–5):

1. Tank `0xa4c138b9e2b9b690` still wet↔problem aligned with OOS banner (regression).
2. Both desk sensors bound `leak_floor_room` + `leak_floor_4x8`, Task `floor_flood_alert`, zones `room`/`4x8`.
3. Each wet → own `zb-policy-{ieee}` banner; dry → that banner clears; dehum/humidifier seats unchanged.
4. Climate safety chips match fleet `zigbee_policy_state`.
5. Promote FOLLOWUPS flood row to **done (live)**.

`.audit/task5-desk-flood-run.sh` exists untracked as a helper; not reviewed as evidence.

---

## Merge recommendation

**Merge Tasks 1–4 code** when the branch is otherwise ready. The implementation matches the approved design: behavioral honesty on Climate (raw wet vs policy problem), one banner-only flood recipe on the shared evaluator, distinct floor roles, and Settings parity for tank/flood params.

**Do not** mark the feature fully accepted or close the plan until Task 5 Pi evidence completes. FOLLOWUPS correctly leaves `floor_flood_alert` at **done (Pi evidence pending Task 5)**.

Optional pre-merge polish (non-blocking): M1–M3 test/doc nits; can land in a follow-up commit or before merge at author discretion.

---

## Self-review matrix (plan vs delivered)

| Plan task | Delivered | Review |
|-----------|-----------|--------|
| Task 1: roles + recipe + pytest | ✅ | Approved |
| Task 2: Settings + helpers + build | ✅ | Approved |
| Task 3: Climate safety chips + build | ✅ | Approved |
| Task 4: FOLLOWUPS | ✅ | Approved |
| Task 5: Pi hotpatch + desk evidence | ⏸ BLOCKED | Out of scope for this review |

**Branch quality (Tasks 1–4):** Ready with minors
