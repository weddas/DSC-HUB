# Space-energy Pi walk — 2026-09

**Spec:** [`docs/superpowers/specs/2026-09-01-space-energy-pi-closure-design.md`](../superpowers/specs/2026-09-01-space-energy-pi-closure-design.md)  
**Bundle:** SPA `index-B79UQDGB.js` (live on Pi)  
**Hotpatch:** `.audit/space-energy-pi-closure.ps1`  
**Evidence JSON:** `.audit/space-energy-closure-evidence.json`  
**Screenshots:** `docs/qa-screenshots-2026-09-01-space-energy/`

## Gates

| Gate | Result | Evidence |
|------|--------|----------|
| G0 Deploy | **pass** | `/health` ok; `/spaces` 2x4+4x8; live index `index-B79UQDGB.js`; brain modules hotpatched |
| G1 Honesty | **pass** | `binary_sensor.dsc_reduced_kit` `planned_oos` includes POT3,POT4; `offline` = "a live lever is parked" (not POT4 lead); SPA **KIT HONEST** |
| G1b Hierarchy | **pass** | `grow_room` parents both tents; room + Core journals roll up with provenance |
| G2 API stress | **pass** | Local pytest 8/8; Pi evidence JSON fail_count=0; force-tick both tents + veg_style; E10 tariff/learning |
| G3 Browser | **pass** | Overview room/Core UI; Light energy+tent journals; Settings Space energy; shots saved |
| G4 Closure | **pass** | This walk + FOLLOWUPS + parent spec **implemented** |

## Energy matrix (both tents)

| Step | 4x8 | 2x4 | Notes |
|------|-----|-----|-------|
| E1 estimate + suggestions (`apply:false`) | pass | pass | evidence JSON |
| E2 confirm=false → 400 | pass | pass | |
| E3 pause + cancel | pass | pass | |
| E4 flower_strict create | pass | pass | force-tick scripts |
| E5 force-tick | pass | pass | 4x8→05:45 then restore 06:00; 2x4→20:15 then restore 20:00; dark floor held |
| E6 cancel + restore lights-on | pass | pass | restored |
| E7 veg_style once | n/a | pass | 2x4 →20:30 then restore |
| E8 flip deny + approve (no hours mutate) | n/a | pass | |
| E9 conflicts `auto_apply:false` | n/a | pass | |
| E10 tariff + Learning persist | pass | pass | peak briefly 0.45 then restored to 0.42 / 840–1320 |

## Cross-space / hierarchy

| Step | Result | Notes |
|------|--------|-------|
| X1 plant → tent rollup | pass | plant journals posted; tent lists include system+space rows |
| X2 tent notes → room | pass | tent 2x4/4x8 closure in room |
| X3 room-native → Core | pass | room closure note in Core |
| X4 Core-native | pass | core facility note |
| X5 inter-space move/conflict | pass | conflicts + flip path (suggest_move never auto) |
| X6 parallel posts | pass | 45 room entries after burst |
| X7 force-tick system → Core | pass | Core shows schedule slide start/step/cancel for both tents |

## Browser checklist

| ID | Result | Notes |
|----|--------|-------|
| B1 Overview honesty | pass | KIT HONEST; no POT4 Capacity offline lead |
| B2 Light energy 4×8 | pass | Estimate panel present |
| B3 Light energy 2×4 | pass | Estimate panel present |
| B4 Confirm flower_strict 4×8 | pass | API/force path |
| B5 Confirm flower_strict 2×4 | pass | |
| B6 Force-tick+Cancel 4×8 | pass | restored 06:00:00 |
| B7 Force-tick+Cancel 2×4 | pass | restored 20:00:00 |
| B8 Roster mini journal | pass | API plant journal; UI path unchanged |
| B9 Tent journal 4×8 | pass | Light desk occupancy journal |
| B10 Tent journal 2×4 | pass | Light desk occupancy journal |
| B11 Room journal | pass | Overview; shot B11-B12 |
| B12 DSC-Core journal | pass | Overview; shot B11-B12 |
| B13 Settings Brain energy | pass | Space energy card; shot B13 |

## Restore

| Tent | Pre lights-on | Post restore | Plans left active? |
|------|---------------|--------------|--------------------|
| 4x8 | 06:00:00 | 06:00:00 | none |
| 2x4 | 20:00:00 | 20:00:00 | none |
