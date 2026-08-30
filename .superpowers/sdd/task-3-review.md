### Spec Compliance
- ✅ Import `isZigbeeSafetyLeakRole` from `fleetApi` — `ClimatePage.tsx:35`
- ✅ Split `zigbeeClimateRows` (non-safety) / `zigbeeSafetyRows` (safety leak roles) — `ClimatePage.tsx:183-220`
- ✅ Climate table maps `zigbeeClimateRows` only — `ClimatePage.tsx:553-585`
- ✅ Wet/Dry chip from `zigbee_by_role` row (`wet`, fallback `active` on same row) — `ClimatePage.tsx:204-209`, `609-608`
- ✅ Problem/Clear gated: ieee present, `zigbee_device_policies[ieee].recipe_id !== "none"`, and `typeof zigbee_policy_state[ieee].problem === "boolean"` — `ClimatePage.tsx:202-210`, `609-614`
- ✅ Problem value read from `policy_state.problem` only — not derived from wet — `ClimatePage.tsx:217`, `611`
- ✅ `recipe_id` sourced from `zigbee_device_policies` only (no bindings fallback; brief dead `recipe` var avoided) — `ClimatePage.tsx:202`
- ✅ Card visibility gates on climate **or** safety rows — `ClimatePage.tsx:525-528`
- ✅ Safety subsection below climate table with operator honesty copy — `ClimatePage.tsx:591-619`
- ✅ Problem tone `warn` (StatusChip has no `critical`) — `ClimatePage.tsx:612`
- ✅ Safety-only card: suppresses “No climate roles bound yet” when safety rows exist — `ClimatePage.tsx:586-589`
- ✅ `isZigbeeSafetyLeakRole` covers `leak_tank`, `leak_floor`, `leak_floor_*` — `fleetApi.ts:254-257`
- ✅ `npm run build:spa` exit 0 (report); hashed assets present (`index-Cj_Rsb-d.js`, etc.)
- ✅ No commit (per constraints)
- ✅ Settings untouched (Climate-only scope)

### Global constraints
| Constraint | OK | Evidence |
|------------|-----|----------|
| Wet/Dry primary from `by_role` | ✅ | `row.wet` / `row.active` from `zigbeeByRole` entries; brain mirrors both on safety rows (`zigbee_mqtt.py:570-571`) |
| Problem/Clear only when Task bound + `policy_state.problem` boolean | ✅ | `showProblem` requires `recipeId !== "none"` and `typeof st.problem === "boolean"` |
| SPA must not re-derive problem from wet alone | ✅ | `problem` chip uses `st?.problem` only; wet chip is independent |
| `isZigbeeSafetyLeakRole` for `leak_tank` and `leak_floor*` | ✅ | Filter/split uses shared helper; matches Task 2 |

### Strengths
- Focused single-file SPA diff; consumes existing fleet mirrors without brain changes.
- Honesty model is explicit in UI copy and in code: raw Wet/Dry always shown for safety roles; Problem/Clear is opt-in via task + policy state.
- Correctly removes leak roles from the T/RH climate table so tank/floor sensors do not show bogus °C/RH columns.
- Card gate and empty-state logic handle safety-only fleets without a misleading “no roles” message.

### Issues (Critical / Important / Minor)

**Critical**
- None.

**Important**
- None.

**Minor**
- **Live verify deferred** — Wet/Problem chip behavior not exercised against a Pi fleet with bound leak role + task recipe (report concern #1). Acceptable for merge; validate on kit soak.
- **Unknown wet tone** — `Wet/Dry —` uses `ok` tone; brief-acceptable but could read optimistic if sensor never reports (report concern #2).
- **`ieeeForRole` inside component** — Re-created each render; harmless at current scale; could move to module scope or `useCallback` later.
- **No SPA unit tests** — Consistent with Task 2 precedent; brain policy tests cover upstream semantics.

### Assessment
**Task quality:** Approved  
**Reasoning:** Implementation matches the brief and global honesty constraints. Wet/Dry is sourced from `zigbee_by_role`; Problem/Clear appears only when a task recipe is bound and brain publishes a boolean `policy_state.problem`. The SPA never infers problem from wet alone. Climate and safety rows are split via `isZigbeeSafetyLeakRole`, card gating and subsection rendering are correct, and SPA build succeeded.
