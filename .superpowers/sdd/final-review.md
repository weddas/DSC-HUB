# Final Review — Zigbee Role vs Task operator path (Tasks 1–5)

**Reviewer:** Senior whole-branch (read-only)  
**Date:** 2026-08-30  
**Spec:** `docs/superpowers/specs/2026-08-30-zigbee-role-vs-task-operator-design.md`  
**Plan:** `docs/superpowers/plans/2026-08-30-zigbee-role-vs-task-operator.md`  
**Progress:** `.superpowers/sdd/progress-zigbee-role-vs-task.md`  
**Verification:** `cd brain; python -m pytest tests/test_zigbee_policies.py tests/test_zigbee_capability.py -q` → **26 passed**

---

## Overall verdict

### **Ready with minors**

The branch delivers the approved operator path end-to-end: capability-filtered Role/Zone/Task in Settings, generalized `tank_full_appliance` with `problem_when` polarity and editable banners, sticky `capability_override` for mis-fingerprinted liquid sensors, and Pi evidence for both humidifier-empty (inactive) and live dehum tank (active). No critical spec violations or Pi-safety regressions found.

**Merge-ready as working tree:** Yes — safe to commit when the user asks. Optional minors below can land in a follow-up pass; none block commit or Pi hotpatch.

---

## Plan coverage (Tasks 1–5)

| Task | Scope | Status | Notes |
|------|-------|--------|-------|
| 1 | `problem_when` polarity, catalog/schema, `banner_template`, legacy state | ✅ | Legacy `prev_problem` from old `active` key fixed + tested |
| 2 | `infer_capability_class`, filter helpers, devices API fields | ✅ | Plug inference intentionally deferred |
| 3 | `capability_override` persist on bind | ✅ | Friendly-name fallback allowlist includes override |
| 4 | Settings SPA filtered selects, Show all, liquid params, help copy | ✅ | Unbound → clears policy params (post–Task 4 fix) |
| 5 | Pi hotpatch + evidence, FOLLOWUPS | ✅ | `timeout 25 docker restart`; QA + live ieee smoke |

### Spec acceptance criteria

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | Climate Role + No task → datapoint only, zero Task side effects | ✅ | `test_no_task_is_noop`; `test_zigbee_canopy_role_fills_canopy` (no policy) |
| 2 | Temp/RH: climate roles only; liquid Task behind Show all | ✅ | `filter_recipes_climate_none_only`; SPA `filterZigbeeRecipesForClass` |
| 3 | Humidifier empty: dry=problem + custom banner → OOS; wet clears if owned | ✅ | `test_problem_when_inactive_*`; Pi QA ieee dry→OOS / wet→clear |
| 4 | Existing dehum tank ieee + Show all for occupancy liquid | ✅ | Pi live `0xa4c138b9e2b9b690` wet→OOS / dry→clear; override path tested |
| 5 | Spec/FOLLOWUPS document deferrals | ✅ | Later recipes in FOLLOWUPS; zone UX deferred in spec non-goals |

---

## Honesty assessment

| Area | Verdict | Detail |
|------|---------|--------|
| Evaluator polarity | ✅ | `problem = raw if active else not raw`; edges act on `problem`, not raw |
| Policy state | ✅ | Fleet `zigbee_policy_state` stores `active`, `problem`, `problem_when` |
| Banners | ✅ | Template defaults match seat + polarity; operator edit preserved in SPA |
| Overview banners | ✅ | From `critical_banners` only (unchanged path) |
| Safety row display | ⚠️ partial | MQTT ingest sets raw `wet` on `by_role`; UI does not yet show policy-derived `problem` vs raw (spec: “may show”) |
| Settings labels | ✅ | “Liquid level → appliance OOS”; Problem when labels honest |
| Unbound / No task | ✅ | Evaluator no-ops on `none`; unbound save clears params |

---

## YAGNI / scope discipline

**Well scoped**

- Single recipe id `tank_full_appliance`; no duplicate humidifier recipe.
- Server-side filters only; no free-form IFTTT or recipe catalog dump.
- `capability_override` only when operator uses Show all + safety leak role on motion/other.
- Hidden `force_relay` / `banner_tone` — defaults preserved, no extra UI.

**Correct deferrals (spec / plan aligned)**

- Plug class inference (`state`-only → `other`).
- Zone list not class-filtered; no role-hint zone prefill in SPA.
- `suggested_roles` not used in Task filter (only `device_classes`; sufficient for current catalog).
- Safety-row policy honesty in Live/Climate UI.

No over-engineering observed in the diff surface reviewed.

---

## Test gaps

| Gap | Severity | Notes |
|-----|----------|-------|
| Invalid `capability_override` save/load | Minor | Implementation raises on bad save; load drops invalid — untested |
| Expose-only inference before first MQTT | Minor | Path exists via `expose_props`; no dedicated test |
| `zigbee_policy_state` field assertions | Minor | Polarity tests assert OOS/banner, not fleet state shape |
| SPA filter/template unit tests | Minor | Brain has 13 capability tests; frontend mirrors untested |
| Climate + policy `none` single integration test | Minor | Covered by composition of existing tests, not one named case |
| Migration: empty params → merged defaults on load | Minor | Behavior via `save_zigbee_policies` merge; no explicit migration test |

**Suite health:** 26/26 targeted tests pass; existing `test_brain_pi` zigbee canopy/bindings tests remain compatible.

---

## Pi safety

| Check | OK |
|-------|-----|
| Hotpatch used `timeout 25 docker restart dsc-hub-brain` (not bare kill) | ✅ |
| Brain modules only (`zigbee_policies.py`, `zigbee_mqtt.py`) + SPA static cp | ✅ |
| Live dehum path verified after re-bind script | ✅ |
| QA ieee left on Pi for soak | ⚠️ remove when undesired (ops, not code) |

Task 5 noted live tank **policy was missing on disk** and was restored via `.audit/zb-bind-tank-occ.sh` — a data/ops gap, not an evaluator regression. Migration defaults behave correctly once policy is present.

---

## Findings

### Critical

*None.*

### Important

1. **Safety row policy honesty not in operator UI** — Spec allows safety `by_role` to show raw wet plus whether the policy considers it a problem (`zigbee_policy_state.problem`). Backend stores it; Live/Climate/Settings do not surface it. Operators debugging inactive-polarity sensors may misread raw wet/dry alone. Park in FOLLOWUPS unless operators ask immediately.

2. **Live tank policy absence on Pi** — Evidence required manual policy restore. Consider a one-time desk note or audit script checklist so kit ieee always has merged defaults after upgrade. Not a code blocker; worth an ops runbook line in `ZIGBEE-RECOVERY.md`.

### Minor

1. **`suggested_roles` unused in recipe filter** — Brain and SPA filter on `device_classes` only. Fine for v1 single recipe; revisit when adding role-scoped recipes without matching `device_classes`.

2. **Plug capability class never inferred** — `filter_roles_for_class("plug", …)` exists but inference never returns `"plug"`. Matches plan deferral.

3. **Zone UX deferred** — All four zones always shown; no role-hint prefill on role change. Spec-acceptable v1.

4. **Stale `spa-dist/assets/index-*.js` bundles** — `index.html` points at `index-nLu-U8CF.js` (Pi-deployed); older hashes remain in tree. Hygiene only; prune on commit if desired.

5. **Grow-log reason string** — `_apply_active` still logs `reason=tank_full` for humidifier-empty path (cosmetic).

6. **FOLLOWUPS spec row** — Framework spec marked **done**; Role-vs-Task spec row still **approved** while implement row is **done (live)**. Optional doc tidy.

7. **No frontend tests** for `filterZigbee*` / `zigbeeBannerTemplate` parity with brain.

---

## Per-task review rollup

| Task | Prior gate | Final branch note |
|------|------------|-------------------|
| 1 | Approved | Legacy `prev_problem` fix landed (`test_legacy_policy_state_*`) |
| 2 | Approved | Persist completed in Task 3 |
| 3 | Approved | Friendly-name allowlist fix confirmed in `get_zigbee_devices` |
| 4 | Approved | Unbound params clear implemented in `onBindingChange` |
| 5 | Complete (report) | Pi evidence matches spec acceptance 3–4 |

---

## Recommendation

**Ship the working tree** when the user requests commit. The implementation matches the approved spec and plan; Pi evidence closes the operator loop for both polarities; tests are green.

**Optional before or right after commit**

- Remove QA binding `0xqa_task5_inactive` on Pi if soak complete.
- Prune orphan `spa-dist/assets/index-*.js` files; keep only `index-nLu-U8CF.js` referenced by `index.html`.
- Add invalid-override + policy-state assertion tests if touching this area again.
- FOLLOWUPS entry for safety-row `problem` display when operators need it.

---

## Files reviewed (primary)

- `brain/dsc_brain/zigbee_policies.py`
- `brain/dsc_brain/zigbee_mqtt.py`
- `brain/tests/test_zigbee_policies.py` (13 tests)
- `brain/tests/test_zigbee_capability.py` (13 tests)
- `homeassistant/.../frontend/src/pages/SettingsPage.tsx` (ZigbeeBindRow + save)
- `homeassistant/.../frontend/src/lib/fleetApi.ts` (filters + template)
- `docs/FOLLOWUPS.md` (implement row)
- `.superpowers/sdd/task-{1..5}-review.md` / `task-5-report.md`
