# Task 3 Review — Persist `capability_override` on bind

**Reviewer:** subagent (read-only)  
**Date:** 2026-08-30  
**Artifacts:** `task-3-brief.md`, `task-3-report.md`  
**Verification:** `cd brain; python -m pytest tests/test_zigbee_capability.py -v` → **13 passed in 0.27s**

---

## Verdict

| Gate | Result |
|------|--------|
| **Spec** | ✅ |
| **Quality** | **Approved** |

Task 3 closes the Task 2 gap: optional `capability_override` round-trips through binding I/O and `get_zigbee_devices()` honors a persisted liquid override on occupancy-only hardware. SPA write path remains Task 4.

---

## Spec compliance

### Brief requirements

| Requirement | Status | Notes |
|-------------|--------|-------|
| Optional `capability_override` on binding row | ✅ | Saved only when present and valid |
| Persist through `save_zigbee_bindings` | ✅ | Validated against `_CLASS_ROLE_KINDS` keys; written to `zigbee_device_bindings` setting |
| Persist through `load_zigbee_bindings` | ✅ | Included when stored value is a valid class key |
| Test: save `liquid` override; occupancy-only → class `liquid` | ✅ | `test_save_binding_capability_override_persists` uses real DB (`temp_db`), no load monkeypatch |
| `get_zigbee_devices` reports class + override | ✅ | End-to-end after save/load |
| TDD RED→GREEN | ✅ | Report + new test; 13/13 pass |
| No commit | ✅ | |

### Operator spec (`2026-08-30-zigbee-role-vs-task-operator-design.md`)

| Spec point | Status | Notes |
|------------|--------|-------|
| Sticky override in binding `capability_override` | ✅ | Task 2 read path + Task 3 persist |
| Occupancy-only → liquid after Show-all bind | ✅ | Persisted override drives `_resolve_device_capability_class` |
| API includes `capability_class` + optional `capability_override` | ✅ | Unchanged from Task 2; now survives reload |
| SPA sets override on Show-all safety bind | ⚠️ deferred | Explicitly Task 4; not a Task 3 miss |

---

## Quality assessment

### Strengths

1. **Minimal, focused diff** — Only binding load/save schema extended; no unrelated API or SPA churn.
2. **End-to-end persistence test** — Uses `temp_db` + `save_zigbee_bindings` → `load_zigbee_bindings` → `get_zigbee_devices()` without monkeypatching load (stronger than Task 2’s override test).
3. **Validation on write** — Invalid override raises `ValueError` at save time; load silently drops bad stored values (defensive for hand-edited JSON).
4. **Consistent with Task 2** — `_resolve_device_capability_class` unchanged; persist completes the mis-fingerprint story from the spec.
5. **Full replace semantics** — `save_zigbee_bindings` writes the entire cleaned map; omitting `capability_override` on a row clears it on save (contrary to report concern #2 below when SPA sends full binding payload).

### Implementation notes (verified)

```242:247:brain/dsc_brain/zigbee_mqtt.py
                    override = row.get("capability_override")
                    if override:
                        cap = str(override).lower()
                        if cap in _CLASS_ROLE_KINDS:
                            binding["capability_override"] = cap
```

```278:283:brain/dsc_brain/zigbee_mqtt.py
        override = row.get("capability_override")
        if override is not None and override != "":
            cap = str(override).lower()
            if cap not in _CLASS_ROLE_KINDS:
                raise ValueError(f"invalid capability_override: {override}")
            binding["capability_override"] = cap
```

---

## Findings

### Critical

*None.*

### Important

1. **Report claims untested behavior** — Self-review table marks “invalid override rejected on save” and “invalid override ignored on load” as met, but no tests assert `pytest.raises(ValueError)` on bad save or load dropping `"not_a_class"`. Implementation looks correct; add two small tests before Task 4 if SPA will surface save errors.

2. **Pre-existing: friendly_name fallback strips override in `get_zigbee_devices`** — When ieee lookup misses but `_binding_for_friendly` hits, the API binding is filtered to `(role, zone, alias, enabled, friendly_name)` only, dropping `capability_override`. Persist test passes because ieee `"0xmotion"` resolves directly. Fix in Task 4 or a small follow-up: include `capability_override` in that allowlist.

### Minor

1. **Clearing override** — Report notes SPA must omit override on revert. With full-map save, omitting the key clears it; document for Task 4 SPA so partial PATCH-style saves are not introduced.

2. **No explicit `null` clear sentinel** — Omit-vs-never-set is the only clear path; sufficient for v1.

3. **Duplicate override coverage** — `test_get_zigbee_devices_capability_override` (monkeypatched load) plus new persist test; acceptable; persist test is the authoritative one for Task 3.

---

## Global constraints check

| Constraint | OK |
|------------|-----|
| Spec: role-vs-task operator design | ✅ |
| Keep recipe id `tank_full_appliance` | ✅ (unchanged) |
| No commit required | ✅ |
| Occupancy wet signal (policies layer) | ✅ (unchanged) |

---

## Recommendation

**Approve Task 3.** Proceed to Task 4 (SPA filtered selects + set/clear `capability_override` on Show-all safety bind). Optional hardening: invalid-override save/load tests; add `capability_override` to `get_zigbee_devices` friendly-name fallback allowlist.
