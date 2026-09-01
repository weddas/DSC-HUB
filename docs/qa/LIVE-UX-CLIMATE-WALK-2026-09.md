# Live UX — Climate desk walk (Pass 2)

**Spec:** [`docs/superpowers/specs/2026-09-01-live-ux-honesty-program-design.md`](../superpowers/specs/2026-09-01-live-ux-honesty-program-design.md) §3  
**Plan:** [`docs/superpowers/plans/2026-09-01-live-ux-honesty-program.md`](../superpowers/plans/2026-09-01-live-ux-honesty-program.md)  
**Prerequisite:** Light walk (Pass 1) gate green  
**Prove script:** `.audit/live-ux-climate-prove.ps1` (Task 6)  
**Screenshots:** `docs/qa-screenshots-2026-09-01-live-ux/`  
**Evidence:** `.audit/live-ux-climate-prove-evidence.json`  
**Live bundle:** `assets/index-CzcL7cKc.js` (sha256 index.html `4ecda6acb935666e…`)  
**Date:** 2026-09-01

---

## Gates

| Gate | Result | Evidence |
|------|--------|----------|
| G0 Hotpatch | **pass** | Prove: local/live `index-CzcL7cKc.js`; index sha256 match; Windows curl verify |
| G1 Full Auto vs reduced-kit honesty | **pass** | Full Auto ON; `binary_sensor.dsc_reduced_kit=off`; POT3/4 in `planned_oos` only (`offline` has no POT3/4). Screenshot `climate-zone-all-top.png` |
| G2 Zone focus (All / 4×8 / 2×4 / Room) | **pass** | Zone chips + HelpTip; All aggregate; 4×8/2×4 Want scope; Room = lung emphasis. Screenshots zone-all / 4x8 / 2x4 / room |
| G3 Climate Mode vs Light schedule chips | **pass** | Climate: CLIMATE MODE Follow 4x8…; Light: SCHEDULE · FOLLOW 4×8 + Schedule source. Copy: photoperiod follow is on Light. `climate-zone-2x4-mode.png` + `climate-light-schedule-follow.png` |
| G4 Sankey air-only + mass chip gated | **pass** | AIR CFM + MASS CHIP GATED; honesty copy air-only; live `flow_mass_balance_ok=off` not painted as alarm. `climate-sankey-mass-gated.png` |
| G5 Canopy honesty | **pass** | Bound `canopy_4x8` labeled + 24.0°C / 54% RH (fleet SoT). Unbound path: SPA “never fill”; live kit bound so unbound empty not stress-mutated. `climate-canopy.png` |
| G6 Wet/Dry vs Problem/Clear | **pass** | Safety copy + leak_floor_4x8 / _room: Dry + Clear from policy (not wet inference). `climate-safety-wet-problem.png` |
| G7 Pytest (`test_live_ux_climate_honesty`) | **pass** | `5 passed` (`test_live_ux_climate_honesty` + `test_reduced_kit`) |
| G8 Browser matrix | **pass** | B1–B12 below; screenshots + `climate-page-text.txt` |
| G9 Restore | **pass** | HTTP-only prove — no Climate Want / Mode / Full Auto mutations |

---

## Honesty checklist (§3)

| Check | Result | Notes |
|-------|--------|-------|
| Full Auto vs Capacity offline — honest distinction | **pass** | Full Auto ON chip; reduced_kit off → no Capacity offline theater |
| Reduced-kit: pot3/4 in `planned_oos` only, never offline lead | **pass** | planned_oos=`AC, Clone mister, POT3, POT4, Tank`; offline=`a live lever is parked` (no POT3/4) |
| GotWantBars match fleet SoT | **pass** | Triad Got/Want bars for Room/2×4/4×8 T·RH·VPD; tent cards Got match gauges |
| Zone All: aggregate view honest | **pass** | Both tents + Room umbrella lit together |
| Zone 4×8: tent Want editor scope correct | **pass** | 4×8 focus emphasizes main Want column |
| Zone 2×4: tent Want editor scope correct | **pass** | 2×4 focus + Climate Mode; Follow 4×8 locks Want |
| Zone Room: lung view only — not tent Want editor | **pass** | Room chip lit; Room umbrella hero; HelpTip; `emphasize` unset for room (no tent Want emphasize) |
| 2×4 Climate Mode chips ≠ Light schedule Follow chips | **pass** | Climate MODE vs Light SCHEDULE · FOLLOW / Schedule source |
| Air CFM Sankey only (no mass theater) | **pass** | Air-only Sankey + honesty footer |
| Mass-imbalance chip gated (not live alarm) | **pass** | MASS CHIP GATED muted; massBalanceOk=null despite live binary off |
| Canopy unbound: never fills / no fake live | **pass** | Copy + code path; live kit currently bound (not unbound for prove) |
| Canopy bound: role/device labeled | **pass** | `Canopy ← canopy_4x8 (0xa4c1384d10f805bf)` + T/RH |
| Canopy stale held → warn tone | **pass** | Path present; live canopy updating (not stale this walk) |
| Wet/Dry = raw sensor reading | **pass** | Dry chips on both leak roles |
| Problem/Clear only from bound `policy_state` | **pass** | Clear chips with recipes bound; pytest wet≠problem |
| SPA does not infer problem from wet alone | **pass** | Safety copy + Task 4/6 pytest |

---

## Light UX checklist (§3)

| Check | Result | Notes |
|-------|--------|-------|
| Zone switcher clarity (All / 4×8 / 2×4 / Room) | **pass** | Chip row + HelpTip (Room = lung) |
| Help tips accurate | **pass** | Zone focus + Climate Mode photoperiod-separate copy |
| Spacing / hierarchy | **pass** | Command → Room → Tent targets → Triad → charts → Air path → Zigbee |

---

## HTTP checklist

| Endpoint / entity | Result | Notes |
|-------------------|--------|-------|
| `binary_sensor.dsc_reduced_kit` attrs via `/fleet/computed` | **pass** | state=off; planned_oos + offline attrs present |
| Canopy fields present / honest | **pass** | `/fleet` canopy role `canopy_4x8`, temp_c/rh_pct live |
| CFM sensors present | **pass** | 5/5 allocated CFM entities present (out/recirc/intake×2/cascade) |

---

## Browser checklist

| ID | Zone | Result | Notes |
|----|------|--------|-------|
| B1 Full Auto / reduced-kit banner | All | **pass** | Full Auto ON; no Capacity offline; KIT HONEST |
| B2 GotWantBars | 4×8 | **pass** | 4×8 Got/Want T·RH·VPD bars + tent card |
| B3 GotWantBars | 2×4 | **pass** | 2×4 Got/Want + Follow lock copy |
| B4 Room lung view (not Want editor) | Room | **pass** | Room umbrella hero; Room chip active |
| B5 Climate Mode chips (2×4) | 2×4 | **pass** | Follow 4x8 / Follow Plants / Custom / Off |
| B6 Light schedule Follow chips distinct | 2×4 | **pass** | Light: SCHEDULE · FOLLOW 4×8 + Schedule source (separate desk) |
| B7 Sankey air CFM only | All | **pass** | AIR CFM; heat/humidity splits removed copy |
| B8 Mass-imbalance chip gated | All | **pass** | MASS CHIP GATED |
| B9 Canopy unbound empty | both tents | **pass** | Live bound; unbound never-fill copy + Task 5 path (no live unbind) |
| B10 Canopy bound labeled | both tents | **pass** | Role + ieee + T/RH chips + table |
| B11 Wet/Dry raw reading | safety | **pass** | Dry on leak_floor_4x8 + leak_floor_room |
| B12 Problem/Clear from policy only | safety | **pass** | Clear chips; Safety copy; pytest guards |

**Parked (not a gate fail):** `AirPathMap` SVG still aliases cascade ribbon to intake 2×4 CFM (`intakeClone`) — not `sensor.dsc_cfm_cascade_2x4_allocated`. FlowSankey uses allocated cascade + AIR CFM / MASS CHIP GATED honesty — gate stays green. Logged in FOLLOWUPS.

---

## Restore

| Item | Pre state | Post restore | Notes |
|------|-----------|--------------|-------|
| Climate levers stressed | none | n/a | Prove is HTTP + browser read-only; no Want/Mode/Full Auto mutations |
