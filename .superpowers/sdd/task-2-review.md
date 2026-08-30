### Spec Compliance
- ✅ Shared task params for `tank_full_appliance` and `floor_flood_alert` — `SettingsPage.tsx:130-132`, `215`, `362-398`
- ✅ Appliance `<select>` only when `recipeId === TANK_TASK_ID` — `SettingsPage.tsx:366-374`
- ✅ `isZigbeeSafetyLeakRole` true for `leak_tank`, `leak_floor`, and `leak_floor_*` — `fleetApi.ts:254-257`
- ✅ `zigbeeFloodBannerTemplate(problemWhen)` matches brain `flood_banner_template` strings — `fleetApi.ts:259-263` vs `brain/dsc_brain/zigbee_policies.py:95-99`
- ✅ Flood `taskParamDefaults` seeds `problem_when`, `banner`, `banner_tone` via flood template — `SettingsPage.tsx:143-149`
- ✅ `updateTaskParam` flood branch updates polarity + banner only; tank branch preserves appliance + relay fields — `SettingsPage.tsx:221-262`
- ✅ Recipe change seeds params via `taskParamDefaults(nextRecipe, allRecipes.find(…))` — `SettingsPage.tsx:329-335` (Important fix verified)
- ✅ Fallback roles include three space floor roles (`leak_floor_room`, `leak_floor_4x8`, `leak_floor_2x4`) — `SettingsPage.tsx:1520-1522`
- ✅ Fallback recipes include `floor_flood_alert` — `SettingsPage.tsx:1532-1537`
- ✅ `npm run build:spa` exit 0 (report post-fix); new hashed assets under `spa-dist`
- ✅ No commit (per constraints)

### Strengths
- Focused SPA-only diff; brain untouched as scoped.
- `taskParamDefaults` cleanly branches flood vs tank without duplicating the whole params panel.
- Banner auto-regeneration on polarity change mirrors existing tank behavior (`banner === prevTemplate || !banner.trim()`).
- Placeholder text switches correctly between `zigbeeFloodBannerTemplate` and `zigbeeBannerTemplate`.
- Fallback arrays give offline/catalog-miss paths the new roles and flood recipe so Settings stays usable before brain catalog sync.
- `isZigbeeSafetyLeakRole` extension correctly drives existing Show-all → `liquid` class override for all floor leak role ids.
- Important fix is minimal and correct: recipe `onChange` resolves the **next** catalog row inline; misnamed `liquidRecipe` removed.

### Issues (Critical / Important / Minor)

**Critical**
- None.

**Important**
- None. *(Prior finding resolved: recipe `onChange` now passes `allRecipes.find((r) => r.id === nextRecipe)` to `taskParamDefaults`, so tank↔flood switches seed the correct banner and defaults.)*

**Minor**
- SPA `zigbeeFloodBannerTemplate` omits `.strip()` on `problemWhen` that brain uses — only affects whitespace-padded values.
- No SPA unit tests for helpers; acceptable for this task given brain coverage and build gate.

### Assessment
**Task quality:** Approved  
**Reasoning:** Post-fix re-review confirms the Important recipe-change regression is closed. The handler now looks up the target recipe catalog row by `nextRecipe`, matching the brief’s `taskParamDefaults(nextRecipe, recipe)` contract. All other brief requirements (helpers, shared params panel, tank-only appliance select, fallback catalog entries, SPA build) remain satisfied.
