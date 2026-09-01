# Task 2 Report: Pass 1 — Light SPA honesty + light UX

**Status:** complete  
**Branch:** master  
**Date:** 2026-09-01

## Summary

Inventoried live `#/live/light` against fleet SoT and design §2. Fixed three honesty/UX mismatches (2×4 DLI calibrate CTA parity, Energy honesty sentence join, journal disabled-Save clarity) plus a light Climate Want nav cue. SPA rebuild references `index-DYFvyI2i.js`. Walk doc left for Task 3.

## Inventory (live Pi `192.168.86.48:8787`)

Fleet `hass_extras` vs SPA (browser):

| Check | Fleet / API | Live SPA | Verdict |
|-------|-------------|----------|---------|
| 4×8 Want hours | `sensor.dsc_expected_light_hours` = 12.0 | Want hours 12h | match |
| 4×8 Got hours | `sensor.dsc_lights_on_today_4x8` ≈ 11.99 | Got/Want gauge progress | match |
| 4×8 WINDOW vs DARK | `binary_sensor.dsc_hub_4x8_window_open` = off | DARK chip | match |
| Twin OFF | `light.dsc_hub_twin_sf1000` = off + available | TWIN SF1000 OFF; honesty copy cites GPIO when available | match |
| 2×4 Want | `sensor.dsc_clone_expected_light_hours` = 12.0 | Want hours 12h | match |
| 2×4 Got | `sensor.dsc_lights_on_today_2x4` ≈ 12.0 | Got/Want gauge | match |
| Schedule Follow | `select.dsc_hub_clone_photoperiod` = Follow 4x8 | Schedule · Follow 4×8 | match |
| Climate Mode distinct | `select.dsc_hub_clone_mode` = Follow 4x8 | separate Climate · Follow 4x8 chip + Climate deep-link | match |
| SF1000 OFF | dimmer = off | SF1000 OFF | match |
| DLI uncalibrated | `input_number.dsc_cal_ppfd_*` absent | 4×8 CTA present; **2×4 CTA missing** | **fixed** |
| Energy Estimate | `/energy/estimate` `estimate_label=Estimate`, suggestions `apply:false` | both tents titled `energy (estimate)`; Start gradual… + confirm gate | match (copy punct fixed) |
| Journals | `/journal/space/*` provenance `space` | provenance chips; Save disabled when empty **without hint** | **fixed** |
| Dark / hold / auto banners | dark=off, hold=off, auto=on | Dark period OK; no false manual banner | match |
| Climate Want deep-link | navigates `/live/climate` | honest nav (not inline climate editor) | match (+ arrow cue) |

### Gaps fixed

1. **2×4 DLI calibrate CTA** — when PPFD uncalibrated, 4×8 showed Fleet → Calibrate; 2×4 rendered nothing. Both tents now show the same honest CTA.
2. **Energy honesty punctuation** — API `honesty` lacks a trailing stop; SPA appended ` Learning never…` → “bill Learning”. Now normalizes a sentence end before the Learning clause.
3. **Disabled Save clarity** — empty tent note left Save disabled with no reason. Shows “Add text to enable Save” (and “Saving…” while busy).
4. **Climate Want cue** — label `Climate Want →` to read as desk navigation, not an in-place editor.

### None-found (evidence)

- Twin/SF1000 OFF copy with GPIO present: honest (Twin chip + window Got SoT).
- Card hierarchy Got/Want → schedule → energy → journals already correct.
- Energy never auto-apply: panel copy + confirm UI; API `apply: false` (Task 1).
- Stage rails read as Expected (outside / in-band · stage rail), not live plant.

## Files changed

| Path | Change |
|------|--------|
| `.../src/pages/LightPage.tsx` | 2×4 DLI CTA; Climate Want → |
| `.../src/components/energy/LightEnergyPanel.tsx` | honesty sentence join |
| `.../src/components/journal/TentOccupancyJournal.tsx` | disabled Save hint |
| `.../spa-dist/*` | `build:spa` → `index-DYFvyI2i.js` |

## Build

```powershell
cd homeassistant\custom_components\dsc_hub\frontend
npm.cmd run build:spa
```

`spa-dist/index.html` → `/assets/index-DYFvyI2i.js` (exit 0).

## Commit

```
038bdb5 fix(spa): Light desk honesty CTAs and Save clarity
```

Files: LightPage.tsx, LightEnergyPanel.tsx, TentOccupancyJournal.tsx, spa-dist (`index-DYFvyI2i.js`), task-2-report.md.

## Concerns

- **DutyStrip vs Got (2×4):** SF1000 24h strip showed `0.0H ON` while Got sensor ≈ 12h — history strip vs photoperiod Got SoT. Not fixed here (not lamp-copy theater); Task 3 should note it on the walk.
- **Live SPA not hotpatched:** fixes are in repo `spa-dist` only; Pi still serves prior bundle until Task 3 hotpatch.
- **Walk doc:** intentionally not filled (Task 3).
- **Climate Want:** only a nav arrow cue; Climate desk honesty is Pass 2.
