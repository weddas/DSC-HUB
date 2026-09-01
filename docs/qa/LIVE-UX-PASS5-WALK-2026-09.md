# Live UX Pass 5 walk — Follow-up backlog (2026-09)

**Spec:** [`docs/superpowers/specs/2026-09-01-live-ux-pass5-followup-design.md`](../superpowers/specs/2026-09-01-live-ux-pass5-followup-design.md)  
**Plan:** [`docs/superpowers/plans/2026-09-01-live-ux-pass5-followup.md`](../superpowers/plans/2026-09-01-live-ux-pass5-followup.md)  
**Status:** Tasks 2–4 in progress (energy / CannaLib / Sankey); Hold + Zigbee + soak/gate remain

## Parks

| Item | Result | Notes |
|------|--------|-------|
| Manual Light Hold clear (operator confirm) | pending | **Not cleared** this pass — operator confirm still required |
| Energy confirm=false → 400 | **pass** | Both `4x8`/`2x4` POST `/energy/shift/plan` → **400**; `.audit/live-ux-pass5-prove.ps1` asserts exact 400 (not 422); evidence `.audit/live-ux-pass5-prove-evidence.json` |
| GPIO5 soft-gate or optical | pending | Reserved / unwired — optical N/A |
| Wet/Dry + Problem (via Zigbee task) | pending | Owned by Task 5 |

## CannaLib prod

| Check | Result | Notes |
|-------|--------|-------|
| Prod offset HTTP distinct pages | **pass** | Prod HTTPS + LAN `:8790` `q=kush&limit=3&offset=0\|3` distinct (`0.2.2-stdlib`); ids `strain_kush…` vs `strain_afghani_kush` |
| Pi Load more / Test CannaLib vs prod | **pass** | `test-cannalib` ok; catalog status `remote_api`; brain proxy offset 0 vs 3 and Load-more `limit=50&offset=50` distinct. Temporarily pointed Settings URL at prod HTTPS — same green — then restored LAN `http://192.168.86.2:8790`. **No redeploy.** |
| MP-030/034 closed | **pass** | FOLLOWUPS notes updated 2026-09-01; secrets not recorded |

## FlowSankey verify

| Check | Result | Notes |
|-------|--------|-------|
| Cascade ≠ intake 2×4 HTTP | **pass** | `sensor.dsc_cfm_cascade_2x4_allocated`=**83.3** ≠ `sensor.dsc_cfm_intake_2x4_allocated`=**96.2** |
| Air CFM / no EXPERIMENTAL / mass gated | **pass** | Browser Climate Air path: **AIR CFM** + **MASS CHIP GATED**; no EXPERIMENTAL; Sankey honesty copy present |
| AirPathMap cascade allocated | **pass** | SVG shows **cascade 83** beside intake 96 / 58; Climate wires `dsc_cfm_cascade_2x4_allocated` |
| Graduate in FOLLOWUPS | **pass** | FlowSankey verify/graduate marked done in FOLLOWUPS |

## Zigbee one-recipe Wet/Problem

| Check | Result | Notes |
|-------|--------|-------|
| by_role / bindings populated | pending | |
| Wet/Dry MQTT live | pending | liquid occupancy |
| Problem/Clear from policy_state | pending | floor_flood preferred |
| leak_floor_2x4 | pending | bind or park |

## Soak + re-walk

| Desk | Result | Notes |
|------|--------|-------|
| Soak | pending | short |
| Light both tents | pending | |
| Climate both tents | pending | |
| Overview both tents | pending | |

## Gate

| Gate | Result | Notes |
|------|--------|-------|
| G0 hotpatch/sha | pending | |
| G1 pytest | pending | |
| G2 HTTP | pending | |
| G3 browser | pending | |
| G4 restore | pending | |
| G5 walk filled | pending | |
| G6 FOLLOWUPS write-up | pending | blocking |
