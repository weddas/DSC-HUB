# Task 4 Report — Settings SPA filtered selects + Task params

**Status:** DONE  
**Branch:** (unchanged — working tree)  
**Commit:** none (per user rule)  
**Runtime code changed:** yes (SPA + tiny backend allowlist)

## What was done

Settings → Zigbee device rows now filter Role/Task options by `capability_class`, expose **Show all** for mis-fingerprinted devices, render liquid-task params inline, and persist `capability_override` when operator binds a safety leak role on a motion-class device.

### Steps completed

1. **Types + filter helpers in `fleetApi.ts`**
   - `ZigbeeRole`, `ZigbeeRecipe` (with `device_classes`, `param_schema`, `default_params`)
   - `filterZigbeeRolesForClass`, `filterZigbeeRecipesForClass` mirror brain rules
   - `zigbeeBannerTemplate()` mirrors `banner_template()` for SPA defaults

2. **`ZigbeeBindRow`**
   - Filtered Role/Zone/Task selects; per-row **Show all** toggle
   - Liquid task (`tank_full_appliance`): Appliance, Problem when, Banner text
   - Banner auto-refreshes from template when seat/polarity changes **only if** banner still equals previous template (or empty)
   - Show-all + safety leak role on motion/other → sets `capability_override: "liquid"`; cleared when role reverts

3. **Settings page wiring**
   - Draft bindings carry optional `capability_override`; policies carry full params on Save
   - Help copy: Role vs optional Task
   - Current selection kept visible even when filtered lists shrink

4. **Backend tiny fix**
   - `get_zigbee_devices` friendly-name binding fallback allowlist includes `capability_override`

5. **Build SPA**
   ```
   npm.cmd run build:spa
   ```
   **Evidence:** success; bundle `spa-dist/assets/index-B146_V8-.js`

## Self-review

| Brief requirement | Met |
|-------------------|-----|
| Recipe types: `device_classes`, `param_schema` | yes |
| Device `capability_class` consumed | yes |
| Filtered Role/Task (climate / liquid / motion+other) | yes |
| Show all → full catalogs | yes |
| Liquid task params UI | yes |
| Banner template refresh without clobbering custom | yes |
| `capability_override` on Show-all safety bind | yes |
| Help copy under table | yes |
| Save `put_zigbee_bindings` + `put_zigbee_policies` | yes |
| Friendly-name fallback allowlist fix | yes |
| `build:spa` success | yes |
| No git commit | yes |

## Concerns / follow-ups

1. **Explicit override clear on save** — omitting `capability_override` from draft clears it in UI state; server still retains prior override if old binding row exists until Save without the key (Task 3 note). Current Save sends full draft per ieee without stale override when role changes away from safety.
2. **Zone filtering** — all four zones remain available for every class (spec allows same set for climate/safety v1).

## Post-review fix (2026-08-30)

- **Unbound clears policy params** — `onBindingChange` now sets `params: {}` when role becomes `unbound` (not just `recipe_id: "none"`), so stale liquid-task params are not saved after unbinding.

## Files touched

| Path | Action |
|------|--------|
| `frontend/src/lib/fleetApi.ts` | types, filters, `zigbeeBannerTemplate` |
| `frontend/src/pages/SettingsPage.tsx` | `ZigbeeBindRow`, drafts, help copy |
| `brain/dsc_brain/zigbee_mqtt.py` | allowlist includes `capability_override` |
| `frontend/spa-dist/*` | rebuilt bundle |
| `.superpowers/sdd/task-4-report.md` | this report |
