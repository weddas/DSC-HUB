# Task 2 Report: Settings — shared task params + safety role helper

## Status: Complete

SPA-only changes per brief. No commits made.

## Files changed

| File | Change |
|------|--------|
| `homeassistant/custom_components/dsc_hub/frontend/src/lib/fleetApi.ts` | Extended `isZigbeeSafetyLeakRole`; added `zigbeeFloodBannerTemplate` |
| `homeassistant/custom_components/dsc_hub/frontend/src/pages/SettingsPage.tsx` | Generalized task-params UI for tank + flood recipes |

## Implementation summary

### fleetApi.ts

- **`isZigbeeSafetyLeakRole(roleId)`** — now returns true for `leak_tank`, `leak_floor`, and any id starting with `leak_floor_` (covers `leak_floor_room`, `leak_floor_4x8`, `leak_floor_2x4`).
- **`zigbeeFloodBannerTemplate(problemWhen)`** — mirrors brain `flood_banner_template`: `"Floor water detected"` (active) / `"Floor dry alarm — check sensor"` (inactive).

### SettingsPage.tsx

- Constants: `TANK_TASK_ID`, `FLOOD_TASK_ID`, `TASK_PARAM_IDS` Set.
- **`taskParamDefaults(recipeId, recipe)`** — flood path returns `problem_when`, `banner`, `banner_tone`; tank path preserves existing seat/appliance defaults.
- **`showTaskParams`** — `role !== "unbound" && TASK_PARAM_IDS.has(recipeId)`.
- Recipe change handler seeds params via `taskParamDefaults` for both tank and flood.
- **`updateTaskParam`** — flood updates only polarity + banner (auto-regenerates via `zigbeeFloodBannerTemplate`); tank keeps appliance + polarity + banner (via `zigbeeBannerTemplate`).
- **Appliance `<select>`** — rendered only when `recipeId === TANK_TASK_ID`.
- **Fallback arrays** — roles include three space-specific floor leak roles; recipes include `floor_flood_alert`.

## Build

```text
cd homeassistant/custom_components/dsc_hub/frontend
npm.cmd run build:spa
```

- **Exit code:** 0
- **Output:** `spa-dist/assets/index-CqcbMep5.js` (new hash), plus CSS/chunk assets

## Self-review

| Brief requirement | Done? | Notes |
|-------------------|-------|-------|
| Extend `isZigbeeSafetyLeakRole` | ✓ | Matches brief verbatim |
| Add `zigbeeFloodBannerTemplate` | ✓ | Text matches brain `flood_banner_template` |
| `TASK_PARAM_IDS` Set | ✓ | |
| `taskParamDefaults` helper | ✓ | Flood + tank branches |
| Shared task-params panel | ✓ | Both recipes show Problem when + Banner |
| Appliance select tank-only | ✓ | Conditional on `TANK_TASK_ID` |
| Fallback roles (3 space floor) | ✓ | room / 4×8 / 2×4 |
| Fallback flood recipe | ✓ | |
| `npm run build:spa` exit 0 | ✓ | |
| No commit | ✓ | |

### Concerns / follow-ups

1. **No unit tests in SPA** — helpers are thin mirrors of brain; brain tests cover banner templates. SPA build is the gate for this task.
2. **`liquidRecipe` variable name** in `ZigbeeBindRow` is now misnamed (holds current recipe, not tank-only) — cosmetic only; rename optional in a polish pass.
3. **Role auto-override to `liquid` class** — existing behavior for `isZigbeeSafetyLeakRole` now also triggers for `leak_floor_*` ids, which is intended.

## Brain files

Untouched per task scope (Task 1 uncommitted brain work remains separate).

---

## Task 2 review fix — recipe-change param seeding

### Status: Fixed

Review finding: when the Task/recipe `<select>` changed in `ZigbeeBindRow`, `taskParamDefaults(nextRecipe, liquidRecipe)` passed the **current** recipe catalog row (`recipeId`), so tank↔flood switches seeded the wrong banner/defaults.

### Change

| File | Change |
|------|--------|
| `homeassistant/custom_components/dsc_hub/frontend/src/pages/SettingsPage.tsx` | Recipe `onChange` now resolves `allRecipes.find((r) => r.id === nextRecipe)` for `taskParamDefaults`; removed unused misnamed `liquidRecipe` variable |

### Build (post-fix)

```text
cd homeassistant/custom_components/dsc_hub/frontend
npm.cmd run build:spa
```

- **Exit code:** 0
- **Output:** `spa-dist/assets/index-Cl2q9nOC.js` (new hash), plus CSS/chunk assets
- **Duration:** ~3.7s

### No commit

Per instructions — fix remains uncommitted.
