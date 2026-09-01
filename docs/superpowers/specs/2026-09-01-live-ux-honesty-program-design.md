# Live UX honesty program (five-pass) — Design

**Date:** 2026-09-01  
**Status:** **Passes 1–3 implemented/proven** (2026-09-01 Overview gate green) — plan [`2026-09-01-live-ux-honesty-program.md`](../plans/2026-09-01-live-ux-honesty-program.md). **Pass 4/5 remain stubs** pending `/brainstorming`.  
**Domain:** Operator Live desks (Light → Climate → Overview); Pi brain SoT; honesty + light UX  
**Related:** space-energy journals (implemented); kit honesty (pot3/4 planned OOS); `dsc-space-energy.mdc`, `dsc-pi-hotpatch.mdc`

## Problem

Light, Climate, and Overview are interdependent daily surfaces. Honesty debt and light UX friction span all three; fixing one desk in isolation leaves glance/desks out of sync. Hardware (Twin PWM, Zigbee recipes) stays parked until Live honesty walks are green.

## Goals

1. Run **three sequential desk passes** — Light, then Climate, then Overview — each at honesty + light UX depth.
2. Keep **both tents** (`4x8` / `2x4`) at the same development point in every pass.
3. **Full stress prove** per desk (pytest + Pi HTTP + browser matrix) before advancing.
4. Leave **Pass 4 (integrated)** and **Pass 5 (follow-up)** as stubs for later `/brainstorming` only.
5. Park off-scope finds in `docs/FOLLOWUPS.md`; do not derail desk gates.

## Non-goals

- New control subsystems, chart-library swaps, Twin PWM bring-up, Zigbee new recipes / `leak_floor_2x4` bind
- F-001/F-002 install; pot3/4 restore
- Auto-apply Learning; silent schedule mutate
- Mission Triage / Dash Legacy product rewrite
- CannaLib prod offset (queued after this program’s desk gates unless Pass 4/5 absorbs it)

## Constraints (operator-locked)

| Choice | Decision |
|--------|----------|
| Lead | UX first; hardware parked until walks green |
| Desk order | Light → Climate → Overview |
| Depth | Honesty + light UX (no deep rewrite / new subsystems) |
| Prove | Full stress per desk (pytest + HTTP burst + browser) |
| Doc shape | Single program design; all three desks fully scoped; 4th/5th stubs |
| Approach | **B** — one design, one plan with three task blocks |

## Approach

One program design with three desk sections and a shared honesty + prove contract. Execute Pass 1 → gate → Pass 2 → gate → Pass 3 → gate. Then stop for a fresh brainstorm on Pass 4, then Pass 5.

```text
Pass 1  Light desk     → full stress prove → gate
Pass 2  Climate desk   → full stress prove → gate
Pass 3  Overview desk  → full stress prove → gate
Pass 4  Integrated     → later /brainstorming (stub)
Pass 5  Follow-up      → later /brainstorming (stub)
```

---

## §1 Shared honesty contract

**Want → Got → Need**
- Gauges, chips, and labels bind to real brain/fleet state. Missing data → grey / OOS / unbound — never fake live.
- Expected / calendar / stage rails must not read as live plant or live lamp state.
- Existing help (desk HelpTip / What→Process→Expected patterns) stays honest; fix wrong copy; do not invent new help systems.

**Kit / capacity**
- pot3/4 only in `planned_oos`; never Capacity offline lead.
- F-001/F-002 honest OOS / planned only.
- KIT HONEST (or equivalent) must survive each hotpatch.

**Cross-desk**
- Overview photoperiod glance matches Light SoT for both tents.
- Climate Mode (2×4 policy) is distinct from Light schedule Follow 4×8 — chips must not conflate.
- Room / DSC-Core journals remain observation rollups (provenance chips); not diagnoses.

**Light UX budget**
- Hierarchy, spacing, disabled-state clarity, existing help — not new panels or Twin PWM wiring.

**Prove template (every desk)**
1. Local pytest for brain edges touched  
2. Pi hotpatch (plink/pscp) + HTTP checks for APIs/entities the desk reads  
3. Browser matrix both tents + screenshots  
4. Walk doc fully filled → gate opens for next desk  
5. Restore any intentional schedule/climate stress; leave no active shift plans  

---

## §2 Pass 1 — Light desk

**In scope**
- Got / Want hours, WINDOW OPEN vs DARK, Schedule Follow 4×8 vs Independent — match helpers / fleet SoT (both tents).
- Twin SF1000 / SF1000 OFF vs window-as-Got honesty (no live-lamp theater without GPIO).
- Stage rail / draft tones = Expected/rail, not live plant.
- DLI estimate only with calibrated PPFD; else honest calibrate CTA (verify both tents).
- Energy panels: labeled Estimate; suggestions not applyable; confirm gates for gradual/shift.
- Tent occupancy journals: provenance; observations only; no lighting controls on plant cards.
- Dark-violation / manual hold / auto-photoperiod banners match real switch state.
- Light UX: card hierarchy, spacing, disabled Save, Climate Want deep-link clarity.

**Out of scope**
- Twin PWM hardware, new fixtures, tariff productization, auto-apply Learning, Crop scheduler redesign.

**Walk:** `docs/qa/LIVE-UX-LIGHT-WALK-2026-09.md` (create at plan time; fill before Climate).

---

## §3 Pass 2 — Climate desk

**In scope (after Light gate)**
- Full Auto vs Capacity offline / reduced-kit honesty (pot3/4 never lead offline).
- GotWantBars + zone focus (All / 4×8 / 2×4 / Room): Room = lung, not tent Want editor.
- 2×4 Climate Mode policy chips distinct from Light schedule-follow chips.
- Air CFM Sankey only; mass-imbalance chip gated (not painted as live alarm).
- Canopy: unbound never fills; bound role/device labeled; stale held → warn tone.
- Zigbee safety: Wet/Dry = raw; Problem/Clear only from bound `policy_state`.
- Light UX: zone switcher clarity, help tips, spacing — no new climate algorithms or recipes.

**Out of scope**
- New Zigbee recipes, Twin 3D, R3F airflow canvas rewrite, F-001/F-002 install, CannaLib.

**Walk:** `docs/qa/LIVE-UX-CLIMATE-WALK-2026-09.md`.

---

## §4 Pass 3 — Overview desk

**In scope (after Climate gate)**
- KIT HONEST / hub online / canopy-unbound match fleet.
- Critical banners vs grow-log alerts: live policy distinct from history; no fake urgency.
- Photoperiod glance matches Light SoT (including Follow chip when applicable).
- Room + DSC-Core journals: provenance, save/list, coherent rollups.
- Root strip / fan duties / bands: grey when no data or OOS.
- Light UX: glance hierarchy (photoperiod → journals → vitals), help, spacing.

**Out of scope**
- Mission Triage rewrite, Dash Legacy retirement, Twin link-out, new alert playbook engine.

**Walk:** `docs/qa/LIVE-UX-OVERVIEW-WALK-2026-09.md`.

---

## §5 Pass 4 & 5 stubs

| Pass | When | This spec |
|------|------|-----------|
| **4 Integrated** | After Overview walk green | Stub — fresh `/brainstorming` for complete Live pass; may absorb parked UX debt; hardware still locked unless operator unlocks |
| **5 Follow-up** | After Pass 4 | Stub — fresh `/brainstorming` for soak fixes, FOLLOWUPS triage, deferred polish |

Do not invent Pass 4/5 requirements in the Pass 1–3 plan beyond these stubs.

---

## §6 Error handling & restore

- Record pre lights-on / relevant climate levers before any mutate stress; Cancel + restore; no active shift plans left.
- Hotpatch or prove fail → stop advancing desks; do not mark walk green.
- Secrets never in walk docs or FOLLOWUPS bodies.

## §7 Success

Passes 1–3 each have a filled walk + green stress prove; shared honesty contract held; Pass 4/5 only stubbed for later brainstorms. Parent status → **implemented** for Passes 1–3 only after Overview gate (or note partial if stopping early).

**Closure (2026-09-01):** Pass 1 Light, Pass 2 Climate, Pass 3 Overview walks filled and gates **GREEN**. Live Overview bundle `index-C8GkS5XE.js`. Do not invent Pass 4/5 requirements here — offer `/brainstorming` when operator ready.

## Artifacts

| Artifact | Role |
|----------|------|
| This design | Program SoT |
| Implementation plan | Three desk task blocks + prove templates |
| `LIVE-UX-*-WALK-2026-09.md` | Per-desk gates |
| `docs/qa-screenshots-2026-09-01-live-ux/` | Dated shots |
| FOLLOWUPS dated section | Hashes, parks, restore notes |

## Related queue (outside Passes 1–3)

After Overview gate (operator order): CannaLib prod offset → FlowSankey verify (soak already closed 2026-09-01 — confirm still green) → Zigbee one-recipe — unless Pass 4/5 brainstorms re-prioritize.
