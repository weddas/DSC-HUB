# Live UX Pass 5 — Follow-up backlog closeout — Design

**Date:** 2026-09-01  
**Status:** **approved for implementation** — plan [`2026-09-01-live-ux-pass5-followup.md`](../plans/2026-09-01-live-ux-pass5-followup.md)  
**Parent:** [`2026-09-01-live-ux-honesty-program-design.md`](2026-09-01-live-ux-honesty-program-design.md) (Passes 1–4 proven; Pass 5 closes the program)  
**Domain:** Pass 4 parks + operator queue (CannaLib prod · FlowSankey verify · Zigbee one-recipe) + soak / three-desk re-walk

## Problem

Pass 4 gate is GREEN, but recurring leftovers keep resurfacing: sticky Manual Light Hold, energy `confirm=false` status-code drift, Wet/Dry MQTT silence, GPIO5 optical N/A, plus the long-parked operator queue (CannaLib prod offset, FlowSankey verify, Zigbee one curated recipe path). Pass 5 finishes these end-to-end — not parks-only — then soaks and re-walks Light/Climate/Overview so the five-pass Live UX program can close.

## Goals

1. Clear **Pass 4 parks** with honesty: Hold clear **only after operator confirm**; energy reject canonical **400**; Wet/Dry MQTT + Problem/Clear prove; GPIO5 soft-gate if unwired else optical.
2. **Start and finish** CannaLib prod offset (verify-close; redeploy only if Pi Load more fails).
3. **Start and finish** FlowSankey verify / graduate (soak already closed — live re-prove + FOLLOWUPS).
4. **Start and finish** Zigbee **one curated recipe path** (Wet→Problem via bound `policy_state`; no catalog dump; no new recipe ID).
5. Short soak + full Light/Climate/Overview regression re-walk (both tents).
6. Gate GREEN with **mandatory full FOLLOWUPS write-up**; mark parent program Pass 5 **proven**.

## Non-goals

- Inventing a new recipe ID / multi-sensor recipe without a named pick
- New 48h FlowSankey soak unless live verify fails
- F-001/F-002 install; pot3/4 restore; chart-library swaps
- Claiming Twin physically wired or optical success without GPIO5 wire-up
- Silent schedule mutate; Mission Triage rewrite

## Constraints (operator-locked)

| Choice | Decision |
|--------|----------|
| Scope | Parks **+** CannaLib prod **+** FlowSankey verify **+** Zigbee one-recipe, then soak/re-walk |
| Zigbee | End-to-end **existing** curated recipe (`floor_flood_alert` preferred, else `tank_full_appliance`); Wet/Dry raw MQTT; Problem only from `policy_state` |
| CannaLib | Verify-close first (prod already paginates `offset`); redeploy only if Pi Load more / proxy fails |
| FlowSankey | Live re-prove honesty; soak doc stays closed |
| Hold | Clear sticky Manual Light Hold **only with operator confirm** |
| GPIO5 | Soft-gate honesty if unwired; optical prove only if wired |
| Energy | Canonical `confirm=false` → **400** |
| Gate FOLLOWUPS | Mandatory dated write-up from gate evidence |

## Approach

```text
Task 1  Walk scaffold + parent pointer
Task 2  Parks soft (energy 400 normalize; Hold after confirm; GPIO5 soft/optical)
Task 3  CannaLib prod verify-close (+ redeploy if needed)
Task 4  FlowSankey live verify + graduate
Task 5  Zigbee one-recipe Wet/Problem path
Task 6  Soak + Light/Climate/Overview re-walk
Task 7  Gate + FOLLOWUPS → Pass 5 proven
```

---

## §1 Parks

**Manual Light Hold** — Do not auto-clear during stress. Ask operator; on confirm, clear Hold, restore clean Light state, record in walk.

**Energy confirm** — `/energy/shift/plan` with `confirm=false` must return **400** (tests already assert). Normalize prove scripts; eliminate any 422 drift documentation as “canonical.”

**Wet/Dry + Problem** — Owned by §4 Zigbee (same park, one prove).

**GPIO5** — If Twin PWM unwired: keep reserved honesty (never “wired”). If wired: brightness stick + optical note in FOLLOWUPS.

---

## §2 CannaLib prod (MP-030 / MP-034)

**Endpoint:** `/v1/catalogs/strains?q=&limit=&offset=`

**Baseline (2026-09-01):** Public `https://cannalib.plausible-deniability.net` and LAN `:8790` both return distinct offset pages (health `0.2.2-stdlib`).

**Done when:**
1. Walk/evidence records prod offset HTTP prove  
2. Pi brain/SPA Load more against prod does **not** repeat head page / false local OFFSET fallback  
3. FOLLOWUPS MP-030/034 closed  

Redeploy trampoline/`standalone_server` + CannaLib compose **only if** (2) fails. Secrets stay in Notion / gitignored ops.

---

## §3 FlowSankey verify

Soak closed in [`docs/qa/FLOW-SANKEY-SOAK-7.3.md`](../../qa/FLOW-SANKEY-SOAK-7.3.md).

**Live prove:** Climate Air path — `Air CFM` chip; no EXPERIMENTAL; mass chip gated (`massBalanceOk={null}`); cascade allocated ≠ intake 2×4; AirPathMap uses `sensor.dsc_cfm_cascade_2x4_allocated`.

**Done when:** Browser + HTTP green; FOLLOWUPS marks FlowSankey verify / graduate **done**.

---

## §4 Zigbee one-recipe (Wet/Problem)

**One curated path** — Prefer bound `floor_flood_alert` (banner-only, never OOS). Secondary: `tank_full_appliance` (may OOS).

**Prove:**
- `zigbee_by_role` / bindings populated (reapply if empty)  
- Wet/Dry from liquid occupancy MQTT (not PIR motion)  
- Problem/Clear only from bound `policy_state` (SPA must not infer problem from wet)  
- `leak_floor_2x4` bind only if HW present; else park  

No new recipe catalog entries this pass.

---

## §5 Soak + three-desk re-walk

Short soak after queue landings. Fill Light / Climate / Overview walks (both tents) for regressions vs Passes 1–4 honesty contract. Restore Twin/plans/flips; Hold cleared only if operator confirmed.

---

## §6 Gate + FOLLOWUPS

**Prove:** pytest + Pi hotpatch (`docker kill`+`start`) + HTTP + browser three desks + filled Pass 5 walk.

**FOLLOWUPS (gate-blocking)** dated section: passed / failed / flakes / residuals / parks / GPIO5 handoff / hashes / CannaLib+Sankey+Zigbee finish notes.

Parent program status → **Pass 5 proven** (five-pass Live UX closed).

---

## Error handling & restore

- Record pre-stress lights/Hold/Twin; restore; no active shift plans  
- Never claim optical PWM without wire-up  
- No secrets in walk/FOLLOWUPS  

## Success criteria

- [ ] Parks closed or honestly parked with reason  
- [ ] CannaLib prod offset + Pi Load more green  
- [ ] FlowSankey verify graduated in FOLLOWUPS  
- [ ] Zigbee Wet→Problem one-recipe path green  
- [ ] Three-desk re-walk green  
- [ ] Gate GREEN + FOLLOWUPS committed  
- [ ] Parent design: Pass 5 proven  
