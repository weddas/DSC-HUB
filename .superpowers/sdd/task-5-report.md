# Task 5 Report: Pass 2 — Climate SPA honesty + light UX

**Status:** complete  
**Branch:** master  
**Date:** 2026-09-01

## Summary

Inventoried live `#/live/climate` against `/fleet` + `/fleet/computed` (Pi `192.168.86.48:8787`) and design §3. Fixed four SPA honesty/UX mismatches in `ClimatePage.tsx` / `FlowSankey.tsx`. Rebuilt SPA → `index-CzcL7cKc.js`. Climate walk left empty for Task 6. Did not push.

## Inventory (live Pi)

| Check | Fleet / API | SPA before | Verdict |
|-------|-------------|------------|---------|
| Full Auto on | `switch.dsc_hub_tent_full_auto_mode` = on | Full Auto chip path | match |
| Capacity offline SoT | `binary_sensor.dsc_reduced_kit` = **off**; `planned_oos` has POT3/4/AC/mister/tank; `offline` placeholder only | Used `fleet.system.reduced_kit` (unset on `/fleet`) | **fixed** — read entity bus |
| Zone All / 4×8 / 2×4 / Room | FOCUS_OPTIONS + HelpTip (Room = lung) | present | match |
| Climate Mode ≠ Light schedule | `select.dsc_hub_clone_mode` = Follow 4x8; photoperiod separate entity; TentTargets “Climate mode” + Light “Schedule ·” | no photoperiod Follow chip on Climate | match (none-found) |
| Sankey air-only | FlowSankey air model; heat/humidity removed | air-only | match |
| Mass-imbalance chip | live `binary_sensor.dsc_flow_mass_balance_ok` = **off** (would theater) | `massBalanceOk={null}` | match; **UX** gated chip label added |
| Cascade CFM | `sensor.dsc_cfm_cascade_2x4_allocated` ≈ 147 CFM | resolved **wrong** ids (`dsc_cfm_cascade[_allocated]`) → always omit | **fixed** |
| Canopy bound | fleet.canopy role `canopy_4x8`, 24.2°C / 53% RH | role chip OK; T/RH via entity bus often empty | **fixed** — fleet.canopy SoT; unbound never paints T/RH |
| Wet/Dry vs Problem | `leak_floor_4x8` / `_room` wet=false; policy_state.problem=false; recipes bound | Wet/Dry raw + Problem only when recipe≠none + boolean problem | match; **UX** unknown Wet/Dry → muted |
| GotWantBars / Triad | tent Want numbers + held Got | present | match (browser prove Task 6) |

## Gaps fixed

1. **Sankey cascade entity** — Climate FlowSankey now resolves `sensor.dsc_cfm_cascade_2x4_allocated` (soak SoT). Prior ids never existed on the Pi bus, so cascade was always omitted.
2. **Full Auto vs Capacity offline** — `reducedKit` now uses `state("binary_sensor.dsc_reduced_kit") === "on"` (computed hass_extras), not `fleet.system.reduced_kit`.
3. **Canopy honesty** — Prefer live held → fleet.canopy → held stale; require `canopyRole` before painting T/RH; unbound never fills from leftover held.
4. **Wet/Dry unknown tone** — `Wet/Dry —` uses `muted` (not optimistic `ok`).
5. **Mass chip gated label** — FlowSankey shows muted “Mass chip gated” when `massBalanceOk` is null so operators see the gate, not a silent omission.

## None-found (evidence)

- Zone focus copy / HelpTip already distinguishes Room vs tent Want editor.
- 2×4 Climate Mode on TentTargets labeled “Climate mode”; photoperiod Follow stays on Light (`Schedule · Follow 4×8`).
- Wet/Problem chip contract already matched Task 4 guards (raw wet; Problem only from bound `policy_state`).
- `massBalanceOk={null}` already blocked live mass-imbalance theater (`flow_mass_balance_ok` is off on kit).

## Files changed

| Path | Change |
|------|--------|
| `.../src/pages/ClimatePage.tsx` | cascade id; reducedKit SoT; canopy fleet read; Wet muted; Sankey honesty copy |
| `.../src/components/FlowSankey.tsx` | explicit “Mass chip gated” when null |
| `.../spa-dist/*` | `build:spa` → `index-CzcL7cKc.js` |
| `docs/FOLLOWUPS.md` | Pass 2 SPA row + AirPathMap cascade park |
| `.superpowers/sdd/task-5-report.md` | this report |
| `.superpowers/sdd/progress.md` | Task 5 complete |

## Build

```powershell
cd homeassistant\custom_components\dsc_hub\frontend
npm.cmd run build:spa
```

Exit 0 → `spa-dist/assets/index-CzcL7cKc.js`.

## Commit

```
70e9231 fix(spa): Climate desk honesty cascade canopy and Capacity SoT
41a5986 docs(sdd): record Task 5 commit hash in report
3a7bf18 docs(sdd): extend Task 5 progress range through report commit
```

Files: ClimatePage.tsx, FlowSankey.tsx, spa-dist (`index-CzcL7cKc.js`), FOLLOWUPS, task-5 brief/report, progress.


## Concerns / parks

- **Live SPA not hotpatched** — repo `spa-dist` only; Pi still serves `index-DYFvyI2i.js` until Task 6 prove.
- **AirPathMap cascade** — SVG still aliases cascade to intake 2×4 CFM; parked in FOLLOWUPS (out of this brief’s file list).
- **Browser MCP** — Cursor browser tab did not mount the SPA (`#root` empty); inventory used HTTP fleet/computed. Task 6 browser matrix still required.
- **Walk doc** — intentionally not filled (Task 6).

## Out of scope (not done)

- Push to remote
- Climate walk fill / Pi hotpatch (Task 6)
- Overview Pass 3
- New Zigbee recipes, Twin, R3F rewrite
