# Task 2 Review — Capability class inference (TDD)

**Reviewer:** subagent (read-only)  
**Date:** 2026-08-30  
**Artifacts:** `task-2-brief.md`, `task-2-report.md`, `task-2-review-pkg.diff`  
**Verification:** `cd brain; python -m pytest tests/test_zigbee_capability.py tests/test_zigbee_policies.py -q` → **25 passed**

---

## Verdict

| Gate | Result |
|------|--------|
| **Spec** | ✅ |
| **Quality** | **Approved** |

Task 2 delivers the brief’s server-side capability inference, catalog filters, and `get_zigbee_devices()` wiring with honest TDD evidence. Deferrals (override persist, plug inference, SPA) are correctly scoped to later tasks and do not block this gate.

---

## Spec compliance

### Brief requirements

| Requirement | Status | Notes |
|-------------|--------|-------|
| `infer_capability_class(exposes_props, state_keys) -> str` | ✅ | liquid > climate > motion > other; matches brief pseudocode |
| `filter_roles_for_class(class, roles) -> list` | ✅ | climate→climate kind; liquid→safety; plug→plug; motion/other→unbound only |
| `filter_recipes_for_class(class, recipes) -> list` | ✅ | always includes `none`; liquid includes `tank_full_appliance` |
| Device dict gains `capability_class` | ✅ | via `_resolve_device_capability_class` in `get_zigbee_devices()` |
| Optional `capability_override` on device row | ✅ | echoed when binding carries override |
| Wire into `get_zigbee_devices()` | ✅ | |
| Exposes from bridge definition when cached | ✅ | `expose_props` on `_update_devices` + `device_interview`; `_device_expose_props` fallback to `definition.exposes` |
| Fallback to `_device_states` keys | ✅ | `_device_state_signal_keys` excludes meta keys |
| Binding `capability_override` applied | ✅ | read path in `_resolve_device_capability_class` |
| TDD RED→GREEN | ✅ | report evidence + 12 new tests |
| No commit | ✅ | |
| Keep `tank_full_appliance` id | ✅ | unchanged; label already generalized in policies (Task 1) |
| Occupancy wet signal untouched | ✅ | `normalize_binary_active` unchanged; capability maps occupancy→`motion` separately from policy wet eval |

### Operator spec (`2026-08-30-zigbee-role-vs-task-operator-design.md`)

| Spec point | Status | Notes |
|------------|--------|-------|
| Class table (climate / liquid / plug / motion / other) | ✅ | inference + `_CLASS_ROLE_KINDS` align |
| Mis-fingerprint escape via `capability_override` | ⚠️ partial | **read path** works; **persist** explicitly Task 3 |
| API includes `capability_class` + optional `capability_override` | ✅ | on device rows from `get_zigbee_devices()` |
| Filtered role/task lists (server helpers) | ✅ | SPA consumption is Task 4 |

---

## Quality assessment

### Strengths

1. **Priority order is correct** — liquid wins over climate when both key sets present; occupancy alone → motion, not liquid (preserves SNZB-03 mis-fingerprint story + Show-all escape).
2. **Honest pre-MQTT fingerprinting** — `expose_props` cached at bridge list and successful interview so Settings can filter before first state payload.
3. **Integration tests** — `get_zigbee_devices` covered for state-key inference and override path (occupancy device forced to liquid class).
4. **No policy-layer regression** — existing 13 policy tests still pass; occupancy remains last resort in `normalize_binary_active` for task evaluation only.
5. **Focused diff** — helpers colocated in `zigbee_mqtt.py`; no unrelated SPA or API churn.

### Test coverage (12 new)

- Inference: climate, liquid, motion, liquid-over-climate, other
- Role filter: climate (excludes leak), liquid (safety only), motion (unbound only)
- Recipe filter: liquid (`none` + `tank_full_appliance`), climate (`none` only)
- Device API: state-key class, binding override

---

## Findings

### Critical

*None.*

### Important

1. **`capability_override` not round-tripped in bindings I/O** — `load_zigbee_bindings` / `save_zigbee_bindings` strip the field today. Override works only when present in an in-memory binding dict (test monkeypatch). Plan assigns persist to **Task 3**; acceptable for Task 2 but operators cannot yet get sticky liquid class after Save until Task 3 lands.

2. **`filter_recipes_for_class` uses `device_classes` only** — operator spec mentions `suggested_roles` / `device_classes` intersection. Current single recipe (`tank_full_appliance`) matches via `device_classes: ["liquid", "safety"]`, so behavior is correct for v1. Revisit when recipes rely on role-based suggestion without a matching `device_classes` entry.

### Minor

1. **No test for expose-only inference** — e.g. device row with `expose_props: ["water_leak"]` and empty `_device_states` should infer `liquid` before first MQTT publish. Implementation path exists (`_device_expose_props`); test gap only.

2. **Plug class inference deferred** — `state`-only devices fall through to `other`; `filter_roles_for_class("plug", …)` exists but inference never returns `"plug"`. Matches brief comment and report; fine until plug devices onboard.

3. **Test hygiene** — `test_get_zigbee_devices_*` declare `monkeypatch` but only the override test uses it; harmless noise.

4. **Larger device payload** — storing full `definition` on bridge rows increases Settings API payload size; report acknowledges; acceptable for operator honesty.

---

## Global constraints check

| Constraint | OK |
|------------|-----|
| Keep recipe id `tank_full_appliance` | ✅ |
| No commit required | ✅ |
| Occupancy wet signal already exists (policies layer) | ✅ — not altered |

---

## Recommendation

**Approve Task 2.** Proceed to Task 3 (persist `capability_override` on bind) and Task 4 (SPA filtered selects + Show all). Optional hardening before Task 4: add one test for `expose_props`-only inference on `get_zigbee_devices()`.
