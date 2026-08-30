### Spec Compliance
- ✅ One new recipe only (`floor_flood_alert`) — `brain/dsc_brain/zigbee_policies.py:50-72`
- ✅ Never OOS / `force_relay` — defaults omit `seat_id`/`force_relay`; `_apply_active` skips seat/relay when empty — `zigbee_policies.py:55-59`, `246-268`; asserted in `test_zigbee_policies.py:421-458`
- ✅ Distinct roles `leak_floor_room`, `leak_floor_4x8`, `leak_floor_2x4`; `leak_floor` retained — `brain/dsc_brain/zigbee_mqtt.py:42-45`
- ✅ `suggested_roles` includes room, 4×8, 2×4, and generic `leak_floor` — `zigbee_policies.py:61-66`
- ✅ Opposite-edge clear via shared evaluator (`prev_problem` edge → `_apply_clear`) — `zigbee_policies.py:352-378`; dry clear test — `test_zigbee_policies.py:461-491`
- ✅ Params `problem_when` + `banner` (no seat in schema) — `zigbee_policies.py:67-70`
- ✅ `flood_banner_template(problem_when) -> str` — `zigbee_policies.py:95-99`; tested — `test_zigbee_policies.py:526-530`
- ✅ Extend shared evaluator; no separate flood module or SPA changes — diff limited to catalog + policies + tests
- ✅ New floor roles in liquid/safety filter — `test_zigbee_capability.py:194-202`
- ✅ TDD RED→GREEN (report evidence) — `task-1-report.md:23-40`
- ⚠️ Cannot verify from diff: `31 passed` test run (report only); Pi/SPA acceptance (out of Task 1 scope)
- ⚠️ Cannot verify from diff: `floor_flood_alert` appears in `filter_recipes_for_class("liquid", …)` — logic is generic (`zigbee_mqtt.py:118-132`) but no explicit assertion added

### Strengths
- Faithful TDD: failing tests written first with documented RED failures, then minimal catalog/recipe/helper implementation.
- Correct architectural choice: reuses `_apply_active` / `_apply_clear` and `evaluate_device_policies` without a flood-specific fork; empty `seat_id` naturally yields banner-only behavior.
- Strong behavioral test for the key honesty constraint: wet edge upserts banner, leaves dehum/humidifier `in_service` and does not call `force_set_sonoff_relay_sync`.
- Recipe catalog shape matches existing `tank_full_appliance` conventions (`when`, `clear_when`, `device_classes`, `param_schema`, `banner_tone` default).
- Role entries use correct `kind: safety`, `consume: False`, and proper Unicode labels (·, ×, —).
- No unrelated files touched; tank regression tests left intact with additive test-only changes.

### Issues (Critical / Important / Minor)

**Critical**
- None.

**Important**
- None.

**Minor**
- `test_filter_recipes_liquid_includes_tank_full` still asserts only `tank_full_appliance`; brief acceptance item 2 also calls for recipes filtered correctly — adding `floor_flood_alert` to that assertion would close the loop (`test_zigbee_capability.py:68-75`).
- `test_floor_flood_dry_clears_banner` verifies banner removal and `out["problem"] is False` but does not assert persisted `zigbee_policy_state["0xflood1"]["problem"] is False` (wet test does check state) — `test_zigbee_policies.py:461-491`.
- `flood_banner_template` has no docstring while sibling `banner_template` does — minor consistency nit (`zigbee_policies.py:95-99`).

### Assessment
**Task quality:** Approved  
**Reasoning:** The diff delivers exactly what Task 1 scoped: three space floor roles, one banner-only `floor_flood_alert` recipe, the SPA helper, and TDD unit coverage for wet/dry/inverted polarity without OOS or relay side effects. Remaining gaps are minor test-completeness nits, not spec violations.
