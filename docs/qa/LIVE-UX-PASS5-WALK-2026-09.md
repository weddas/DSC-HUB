# Live UX Pass 5 walk — Follow-up backlog (2026-09)

**Spec:** [`docs/superpowers/specs/2026-09-01-live-ux-pass5-followup-design.md`](../superpowers/specs/2026-09-01-live-ux-pass5-followup-design.md)  
**Plan:** [`docs/superpowers/plans/2026-09-01-live-ux-pass5-followup.md`](../superpowers/plans/2026-09-01-live-ux-pass5-followup.md)  
**Status:** **Pass 5 proven** — Tasks 2–7 complete; gate **GREEN**  
**Evidence:** `.audit/live-ux-pass5-prove-evidence.json` · `.audit/live-ux-pass5-task5-evidence.json` · `docs/qa-screenshots-2026-09-01-live-ux/pass5-*`

## Parks

| Item | Result | Notes |
|------|--------|-------|
| Manual Light Hold clear (operator confirm) | **pass** | Operator confirm (Tasks 6–7). Control map gap fixed: `switch.dsc_hub_manual_light_hold` → `HUB_SWITCH_ENTITY_TO_OID` (`manual_light_hold_switch`). Cleared via `POST /control/service` `{domain:switch,service:turn_off,data:{entity_id}}`. Live `hass_extras` **off**; SPA **MANUAL LIGHT HOLD OFF**; no “hold is on” banner |
| Energy confirm=false → 400 | **pass** | Both `4x8`/`2x4` POST `/energy/shift/plan` → **400**; GATE prove asserts exact 400 |
| GPIO5 soft-gate or optical | **pass (soft-gate)** | Twin present (`off`, bri=255). Light SPA: GPIO5 **reserved / not physically wired**. Optical N/A |
| Wet/Dry + Problem (via Zigbee task) | **pass** | Task 5 resume evidence `.audit/live-ux-pass5-task5-evidence.json` `ok=true`; GATE re-seed dry MQTT; `policy_state.problem=false` both desks |

## CannaLib prod

| Check | Result | Notes |
|-------|--------|-------|
| Prod offset HTTP distinct pages | **pass** | Prod HTTPS + LAN `:8790` `q=kush&limit=3&offset=0\|3` distinct (`0.2.2-stdlib`) |
| Pi Load more / Test CannaLib vs prod | **pass** | `test-cannalib` ok; catalog `remote_api`; Load-more distinct. **No redeploy.** |
| MP-030/034 closed | **pass** | FOLLOWUPS notes updated 2026-09-01 |

## FlowSankey verify

| Check | Result | Notes |
|-------|--------|-------|
| Cascade ≠ intake 2×4 HTTP | **pass** | cascade **83.3** ≠ intake **96.2** (GATE) |
| Air CFM / no EXPERIMENTAL / mass gated | **pass** | Browser: **AIR CFM** + **MASS CHIP GATED**; no EXPERIMENTAL |
| AirPathMap cascade allocated | **pass** | **cascade 83** (not 96) |
| Graduate in FOLLOWUPS | **pass** | Graduated |

## Zigbee one-recipe Wet/Problem

| Check | Result | Notes |
|-------|--------|-------|
| by_role / bindings populated | **pass** | Keys: `canopy_4x8`, `leak_tank`, `leak_floor_room`, `leak_floor_4x8`. Policies: desks `floor_flood_alert`; tank `tank_full_appliance` |
| Wet/Dry MQTT live | **pass** | Resume script (no docker kill) occupancy wet→dry room + 4×8; by_role wet false at dry end; evidence JSON |
| Problem/Clear from policy_state | **pass** | `floor_flood_alert`; `problem` bool only from policy_state (SPA no wet→problem inference). GATE: both desks `problem=false` after dry re-seed |
| leak_floor_2x4 | **parked** | No HW — MP-042 |

## Soak + re-walk

| Desk | Result | Notes |
|------|--------|-------|
| Soak | **pass** | Short soak after Hold clear + Zigbee re-seed + GATE HTTP |
| Light both tents | **pass** | `#/live/light` — Got·Twin; GPIO5 reserved; Twin OFF; MANUAL LIGHT HOLD **OFF**; 2×4 WINDOW; both DARK. `pass5-light.png` |
| Climate both tents | **pass** | KIT HONEST; AIR CFM + MASS CHIP GATED; cascade 83; Wet/Dry + Problem/Clear honesty; Climate Mode Follow 4x8. `pass5-climate*.png` |
| Overview both tents | **pass** | HUB ONLINE; Canopy stub; both DARK / Follow; journals; Root Want. `pass5-overview*.png` |

## Gate

| Gate | Result | Notes |
|------|--------|-------|
| G0 hotpatch/sha | **pass** | Live = local `assets/index-BoyhWWR_.js`; index.html sha256 `d00bd5a4be5f2188c566b62618e7be3de828d26990e435915974c1bcd4cb92c8`. **No SPA hotpatch.** Brain Hold map: docker **stop+start** (not kill) |
| G1 pytest | **pass** | 122 passed — live_ux twin/climate/light/overview + zigbee_policies + brain_pi + space_energy_stress |
| G2 HTTP | **pass** | Twin round-trip; cascade 83.3; energy 400; journals; zigbee by_role + policy_state; Hold off; DutyStrip |
| G3 browser | **pass** | Three desks inventory `pass5-g-browser-inventory.json` — no honesty fails |
| G4 restore | **pass** | Twin off; pause plans cancelled; `pending_flips=[]`; lights-on unchanged |
| G5 walk filled | **pass** | this file |
| G6 FOLLOWUPS write-up | **pass** | dated Pass 5 gate section |
