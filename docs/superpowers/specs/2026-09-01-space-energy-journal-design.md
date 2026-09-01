# Space-owned photoperiod, energy learning & journal hierarchy — Design

**Date:** 2026-09-01  
**Status:** implemented locally 2026-09-01 — Pi hotpatch + live walk pending  
**Domain:** cannabis-domain honesty; Pi brain local SoT  
**Related:** Light clocks/timeline (`lightSchedule`, `TentLightClock`), `dsc_ops.sqlite3`, roster plant UUIDs, dark-period violation sensors

## Problem

Operators want to shift lighting windows (e.g. night-on for heat + tariff) and estimate costs, without herm risk from abrupt or silent schedule changes. Photoperiod must stay **space-owned** (not plant-owned). History must distinguish plant vs tent vs room issues. Learning must tolerate short expensive outliers but surface when a bad pattern becomes the norm — still never auto-apply.

## Goals

1. Local-first energy calculator (device watts × hours × tariff bands) with researched defaults and Settings **Update**.
2. Suggest cheaper **slides** (same light/dark ratio) and optional **gradual ramp** after explicit confirm; A/B/C flower policy chosen by operator with risk copy.
3. **No** automatic lighting window or ratio change without direct approval; one plant cannot override the tent.
4. Photoperiod **flip** (ratio change) → banner + notify only; never auto-flip.
5. Plant mini journal (datetime + note) follows the plant; tent journal = space-native events + rollup of occupants; room follows same pattern when used.
6. System events (light errors, flips, moves, ramp lifecycle) write to the relevant plant/space journals.
7. Suggest plant moves between spaces when better; never auto-move.
8. Learning: ignore 1–2 day outliers; when pattern is sticky, planning banner + re-ranked suggestions — operator decides.
9. Extensible spaces/devices (add/remove tents and equipment); kit ships two tents for manageable live grow.

## Non-goals

- Live retailer / Amber APIs
- Auto plant moves or auto schedule apply
- Invented HVAC kWh without meters
- Full multi-room product UI beyond the extensible model
- Day-to-day price chasing
- Diagnosing herms from journal keywords alone (observation ≠ diagnosis)

## Approach

**Brain SoT on Pi** (`dsc_ops.sqlite3` + APIs). SPA is the operator desk. Defaults from kit/research; every numeric/tariff/device value manually Update-able in Settings.

---

## §1 Data model & local defaults

**Tables (illustrative):**

| Store | Role |
|-------|------|
| `plant_journal` | `plant_id`, `occurred_at`, `note`, optional `tags`, `source` (`operator` \| `system`), `created_at` |
| `space_journal` | `space_id` (tent/room), space-native events + same shape; rollup is **read-time collation** of occupant plant rows while assigned |
| `energy_tariff` | Local TOU bands: label, start/end HH:MM, $/kWh |
| `energy_device` | Device on a **space**: label, watts, duty source, enabled |
| `space` / `space_device` | Extensible tents (size/type) and attached equipment (lights, fans, ducting) |
| `schedule_shift_plan` | Tent-scoped ramp: from/to lights-on, step_min, policy `pause` \| `flower_strict` \| `veg_style`, status, next_step_at — advances only after confirmed plan |

**Defaults:** nameplate watts from existing helpers when present else kit published values; AU-style Off-peak/Shoulder/Peak bands with placeholder $/kWh labeled edit-me; veg step 30 min/day, flower_strict 15 min/day.

**Clock honesty:** lights-on is HH:MM[:SS] only; date-shaped datetime helpers do not count as schedule.

---

## §2 Energy calculator, suggestions & Learning

**Estimate:** local watts × hours in each tariff band → per-device and space rollup; labeled Estimate.

**Suggestions:** slide same ratio across clock; rank alternatives (e.g. Night heat, Max off-peak, Current) with $ delta and plant-risk summary. CTAs: **Start gradual plan…** or **Set lights-on now** (separate confirm). Never silent apply.

**Learning (local duty-hour proxies + tariff math):**
- Prefer plant outcome over $ for short outliers (1–2 days); default Settings: “prefer growth during short outliers.”
- When pattern is the **norm** (sustained N days / M of K — tunable): planning signal and re-rank suggestions; **no auto schedule change**.
- Example: Night heat wins on tariff but heater duty rises enough that proxy cost loses → demote and explain tents/schedule may be out of sync.
- Operator can disable Learning, reset history, or mark “this schedule works / doesn’t.”
- Honesty: “Learned from duty hours + your tariff — not a utility bill.”

---

## §3 Ramp, flips, multi-plant safety

| Event | Behavior |
|-------|----------|
| **Slide** | Same ratio, move lights-on; suggest + optional ramp after Confirm |
| **Flip** | Ratio change (e.g. toward 12/12); banner + notify; never auto |

**A/B/C** (operator chooses when starting a ramp): Pause / Flower-strict / Veg-style — with risk copy from stage, dark violations, grow-log, journal hits. Contested herm science labeled contested.

**Tent-scoped photoperiod:** one plant wanting flip/conflict → conflict banner (who agrees/conflicts); operator approves tent change, keeps current, or moves plant. Never auto-flip tent for one plant.

**Approved ramp:** brain steps lights-on daily per policy; cancel anytime; each step/cancel/complete → journal.

---

## §3b Journal hierarchy

```text
Plant journal  →  follows the plant for life
       ↓ (while occupying)
Tent / space journal  →  space-native + rollup of occupant plant rows
       ↓
Room journal  →  room-native + rollup of child tents (same pattern)
```

Collation at read time; provenance chips (Plant vs Tent vs Room). Do not squash plant notes into a single tent blob.

**Auto system rows** (`source=system`): lighting errors / dark violations, flip requested/approved/denied, ramp lifecycle, plant moves.

---

## §3c Space owns lighting

| Layer | Owns |
|-------|------|
| **Space** | Size/type, lights/fans/ducting, photoperiod window + want hours, energy devices, space journal |
| **Plant** | Identity, stage story, plant journal, assignment to probe/space |
| **Room** | Optional parent; room journal + rollup — not per-tent photoperiod unless explicitly defined |

Dev kit: two tents (4×8 / 2×4) with real plants. Architecture supports add/remove spaces and devices.

---

## §4 SPA surfaces

- **Roster / plant:** mini journal only; no lighting controls on plant.
- **Tent desk:** occupancy journal (space + rollup); photoperiod/energy entry points.
- **Light:** clocks/timeline + Energy panel + ramp confirm; flip/conflict/Learning banners.
- **Settings:** Spaces CRUD, devices + watts Update, tariff bands, Learning toggles.
- **Ops banners:** CTAs to Tent/Light/Journal — never auto-apply.

---

## §5 Testing

- Journal CRUD; plant-follow on move; tent rollup provenance  
- Mutate schedule/ratio only via approve APIs  
- Flip/conflict: one plant cannot change tent alone  
- Ramp respects A/B/C; flower_strict never shortens dark below want  
- Energy + Learning: outliers ignored; norm planning only; never auto-apply  
- HH:MM lights-on honesty  

SPA smoke: plant journal → tent rollup; suggest → confirm ramp; Settings Update.

---

## Cannabis-domain alignment

- Observations (journal) ≠ diagnoses; don’t invent herm from a keyword.  
- Contested herm/stress claims labeled contested.  
- Evidence tiers for any “learned” cost claim (duty proxy vs metered).  
- Space-owned environment; plant carries genetics/history/journal.

## Post-ship (encode on yes only)

Offer a project / cannabis-domain skill fragment: space-owned photoperiod, no silent schedule changes, journal hierarchy, outlier-vs-norm Learning.

## Research inputs (brainstorm)

Photoperiod night-length / night-break risk; sliding window vs ratio change; TOU lighting as dominant load; hobby calculators as W×h×$/kWh. Minute-scale safe-shift limits are mostly practice (veg ~30–45 min/day; flower much stricter) — product defaults stay conservative and operator-chosen.
