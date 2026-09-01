# Space-energy Pi closure & journal hierarchy level-up — Design

**Date:** 2026-09-01  
**Status:** implemented 2026-09-01 — walk [`docs/qa/SPACE-ENERGY-PI-WALK-2026-09.md`](../../qa/SPACE-ENERGY-PI-WALK-2026-09.md); parent space-energy **implemented**
**Parent feature:** [`2026-09-01-space-energy-journal-design.md`](2026-09-01-space-energy-journal-design.md) (code shipped `a22050a`; Pi prove incomplete)  
**Domain:** cannabis-domain honesty; Pi brain local SoT; space-owned photoperiod

## Problem

Local space-energy / plant→tent journals shipped on `master` but are not proven on the live kit. Room and facility (**DSC-Core**) journal layers from the parent spec were never built. Closure must level both tents to the same development point, stress cross-space operations, and leave durable Pi evidence — environment disruption during force-tick is acceptable if restored and documented.

## Goals

1. Hotpatch brain + SPA to Pi; prove live bundle hash and API health.
2. Honesty gate: Capacity offline must not treat retired pot3/4 as unexpected live capacity.
3. Full operational prove of energy estimates, suggestions, approve-only shifts, flips, conflicts, Learning — on **both** `4x8` and `2x4`.
4. Implement missing **room** + **DSC-Core** journal stack in `dsc_ops.sqlite3`; stress plant↔tent↔room↔Core rollups and inter-space ops.
5. Pytest stress + Pi HTTP burst + browser automation; walk doc with no blank matrix rows.
6. Mark parent space-energy spec **implemented** only after G0–G4 evidence.

## Non-goals

- Live Amber / retailer tariff APIs
- Auto-apply Learning or silent schedule mutate
- Auto plant moves
- Separate SQLite file for Core (same `dsc_ops.sqlite3`)
- Renaming DSC-Core when adding rooms later
- Committing Pi passwords

## Constraints (operator-locked)

| Choice | Decision |
|--------|----------|
| Risk | Full mutate path including force-tick on live desks |
| Stress depth | Pytest + HTTP burst + browser automation |
| Force-tick | Allowed even in dark; dark-violation / catch-up noise is intentional proof, then Cancel + restore lights-on |
| Tents | **Parity:** `4x8` and `2x4` identical mutate + journal treatment |
| Policies | Prefer `flower_strict` where flowering; also prove `veg_style` at least once |
| DSC-Core | Facility journal **above** room: system events + rollup of all rooms |
| Room | Seeded `grow_room` parents both kit tents; more rooms later without renaming Core |

## Approach

**Gate-then-stress:** Deploy → honesty gate → build/verify room+Core → API stress (both spaces + hierarchy) → browser stress → closure docs. Fail-fast on G0/G1 before force-tick.

Reuse Windows plink/pscp hotpatch patterns (`.audit/stress-*-hotpatch.ps1`, `dsc-pi-hotpatch.mdc`); never OpenSSH `scp` for passworded agent shells.

---

## §1 Pass gates

| Gate | Must pass before next |
|------|------------------------|
| **G0 Deploy** | Modules + SPA on Pi; `/health` ok; live `index-*.js` matches built hash; `/spaces`, `/fleet/computed` 200 |
| **G1 Honesty** | `binary_sensor.dsc_reduced_kit`: pot3/4 only in `planned_oos`, never lead `offline` when only planned OOS |
| **G1b Hierarchy** | `grow_room` seeded; `GET` room + Core journals return coherent rollups |
| **G2 API stress** | Full matrix below (local pytest + against Pi) |
| **G3 Browser stress** | Automation + screenshots; every walk row filled |
| **G4 Closure** | Walk doc; FOLLOWUPS; parent spec status **implemented** |

Stop on G0/G1 fail. G2/G3 fail → FOLLOWUPS red-flag; do not mark parent spec implemented.

---

## §2 Journal hierarchy (build + prove)

```text
Plant journal        →  follows plant_id for life
       ↓ occupy
Tent space journal   →  space-native + occupant plant rollup   (4x8, 2x4)
       ↓ parent room_id
Room journal         →  room-native + child tent rollup (+ their plant rows)
       ↓
DSC-Core journal     →  facility/system-native + rollup of all rooms
```

**Storage (same `dsc_ops.sqlite3`):**

| Store | Role |
|-------|------|
| `plant_journal` | existing |
| `space_journal` | existing tent/space |
| `room` | `room_id`, label, extra; seed `grow_room` |
| `space.room_id` / link | parent `4x8`/`2x4` → `grow_room` |
| `room_journal` | room-native rows |
| `dsc_core_journal` | facility-native / system facility rows |

**Rules:**

- Collation at **read time**; provenance `plant | space | room | core`. Never squash lower layers into one blob.
- Operator notes = observations ≠ diagnoses; contested herm language labeled contested.
- System events write the tightest relevant layer **and** bubble tags to Core when facility-scoped (dark violation, ramp lifecycle, flip lifecycle, capacity honesty, cross-tent moves).

**HTTP:**

- `GET/POST /journal/room/{room_id}`
- `GET/POST /journal/core` (canonical); `/journal/dsc-core` may redirect or alias to the same handler
- `GET /rooms` (ensure seed on read if missing)
- Existing `/journal/plant/*`, `/journal/space/*` unchanged in contract

**SPA:** Tent journals remain on Light. Primary room + Core UI lives on **Ops/Dash** (Settings Brain may deep-link). Plant card still has **no** lighting controls.

---

## §3 Deploy

1. Hotpatch brain modules: existing space-energy set **plus** new modules `room_model.py`, `room_journal.py`, `dsc_core_journal.py` (or one `facility_journal.py` exporting room + core helpers — plan picks one file layout without splitting the public API) and API wiring; also `dash_computed`, `settings` (pot4 gate), `computed_ops`, `light_loop` as needed.
2. SPA build → plink/pscp pack into `dsc-hub-brain` `/app/static/`.
3. Restart or reload so `grow_room` seed + `pot4_retired_gate` apply.
4. Smoke: health, spaces, rooms, core journal empty-or-seeded list.

---

## §4 Energy / schedule stress (both tents)

For **each** of `4x8` and `2x4`:

| Step | Action | Pass |
|------|--------|------|
| E1 | `GET /energy/estimate`, `/energy/suggestions` | Labeled Estimate; all `apply: false` |
| E2 | Shift `confirm=false` | HTTP 400 |
| E3 | Create `pause` plan + cancel | Journal system rows; no lights-on change |
| E4 | Create `flower_strict` `confirm=true` | Plan active; system journal start |
| E5 | Force `next_step_at=0` + tick | Lights-on may move; system step journal; dark-violation OK if intentional |
| E6 | Cancel + restore lights-on | Helpers match pre-record; cancel journal |
| E7 | At least one `veg_style` create→force-tick→cancel on one tent | Policy proven |
| E8 | Flip request → deny; request → approve | Pending list; approve does **not** mutate hours helpers |
| E9 | `GET /energy/conflicts` | `auto_apply: false`; suggest_move never auto |
| E10 | Tariff PUT + Learning PATCH | Persist; Learning never applies schedule |

4×8 is **not** read-only.

---

## §5 Cross-space operational stress (required)

| Step | Action | Pass |
|------|--------|------|
| X1 | Plant journal entries in occupants of each tent | Appear in that tent rollup with `provenance=plant` |
| X2 | Tent-native notes on both spaces | Appear in `grow_room` rollup with tent provenance |
| X3 | Room-native note on `grow_room` | In room list + Core rollup |
| X4 | Core-native / facility system row | In Core list |
| X5 | Inter-space op: plant move **or** conflict suggest-move path between tents | Plant journal follows plant; both tent rollups + room/Core remain coherent |
| X6 | Parallel posts into both tents under load | Room + Core reads consistent; no lost provenance |
| X7 | Facility-tagged system events from force-ticks | Visible at Core (and room when room-scoped) |

Missed X-row = fail the pass.

---

## §6 Artifacts

| Artifact | Role |
|----------|------|
| `brain/tests/test_room_core_journal.py` | Hierarchy unit tests |
| `brain/tests/test_space_energy_stress.py` | Edge + load matrix (both spaces + X1–X7) |
| `.audit/space-energy-pi-closure.ps1` (+ remote bash if needed) | Hotpatch assist + Pi HTTP burst + force-tick both tents + evidence JSON |
| Browser automation | Full B-checklist both desks + journals + Settings + Overview honesty |
| `docs/qa/SPACE-ENERGY-PI-WALK-2026-09.md` | Gate table; every matrix cell filled |
| `docs/qa-screenshots-2026-09-01-space-energy/` | Dated shots |
| FOLLOWUPS dated section | Hotpatch hashes; intentional dark proof; closure |

---

## §7 Browser checklist

| ID | Surface | Pass |
|----|---------|------|
| B1 | Overview | Capacity offline not led by POT3/POT4 |
| B2–B3 | Light energy 4×8 and 2×4 | Estimates + suggestions |
| B4–B5 | Confirm flower_strict both tents | Plans created |
| B6–B7 | Force-tick + Cancel both | Step/cancel visible; restore lights-on |
| B8 | Roster plant mini journal | Save + list; no lighting controls |
| B9–B10 | Tent occupancy journals both | Space note + provenance chips |
| B11 | Room journal UI | Room note + rollup |
| B12 | DSC-Core journal UI | Core/facility + rollup |
| B13 | Settings → Brain → Space energy | Watts, tariff, Learning Update |

---

## §8 Error handling & restore

- Record pre lights-on for both tents before any force-tick.
- After each force-tick path: Cancel plan; restore lights-on if drifted; note dark-violation system rows as intentional.
- Do not leave active shift plans on either tent at pass end.
- Secrets stay in Notion / existing deploy scripts — never in FOLLOWUPS bodies.

## §9 Success

Pass is complete when G0–G4 are green, every matrix row in the walk doc is filled, both tents and the full journal stack (plant→tent→room→Core) have live evidence, and the parent space-energy design status is **implemented**.

## Related

- Parent: `docs/superpowers/specs/2026-09-01-space-energy-journal-design.md`
- Plan (parent): `docs/superpowers/plans/2026-09-01-space-energy-journal.md`
- Skill: `.cursor/skills/dsc-space-photoperiod-journal/SKILL.md`
- Hotpatch: `.cursor/rules/dsc-pi-hotpatch.mdc`, `.audit/stress-*-hotpatch.ps1`
