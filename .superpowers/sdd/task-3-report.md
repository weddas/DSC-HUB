# Task 3 Report — Climate safety honesty (Wet/Dry + Problem/Clear)

**Status:** DONE  
**Commit:** none (per instructions)

## What was done

`ClimatePage.tsx` now splits Zigbee roles into climate vs safety (`isZigbeeSafetyLeakRole`). Climate table shows T/RH roles only. Safety subsection shows Wet/Dry chips from raw `wet`/`active`; Problem/Clear only when `zigbee_device_policies[ieee].recipe_id !== "none"` and `zigbee_policy_state[ieee].problem` is boolean. Card gates on climate **or** safety rows. Problem tone uses `warn` (no `critical` in StatusChip).

## Build

```
cd homeassistant/custom_components/dsc_hub/frontend && npm run build:spa
exit 0 — vite 6.4.3, 163 modules, ~4.4s
```

New assets: `index-Cj_Rsb-d.js`, `calibrate-ojEKvnJ8.js`, `tune-fleet-JEAIzL5O.js` (+ maps).

## Self-review

| Brief requirement | Met |
|-------------------|-----|
| Import `isZigbeeSafetyLeakRole` | yes |
| Split `zigbeeClimateRows` / `zigbeeSafetyRows` | yes |
| `recipe_id` from `zigbee_device_policies` only | yes |
| Omit Problem/Clear when recipe none or no policy state | yes |
| Gate card on climate or safety | yes |
| Safety chip subsection below climate table | yes |
| `npm run build:spa` exit 0 | yes |
| No commit | yes |
| Settings untouched | yes |

## Concerns

1. **Live verify** — Wet/Problem chips need fleet with bound leak role + task recipe on Pi; not exercised in this pass.
2. **Unknown wet** — `Wet/Dry —` uses `ok` tone; acceptable per brief but could read optimistic if sensor never reports.

## Files touched

| Path | Action |
|------|--------|
| `homeassistant/custom_components/dsc_hub/frontend/src/pages/ClimatePage.tsx` | climate/safety split + safety chips |
| `homeassistant/custom_components/dsc_hub/frontend/spa-dist/**` | rebuild output |
| `.superpowers/sdd/task-3-report.md` | this report |
