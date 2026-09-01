# Space-owned photoperiod, energy learning & journal hierarchy — Design

**Date:** 2026-09-01  
**Status:** draft — awaiting user review of this file before implementation plan  
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

---

## Appendix — Verified shipped baseline vs this design

**Verified on:** branch tip `75c55a5` (parent `32836fe` / master spa-dist). Labels: **SHIPPED** = code/docs present and wired; **DESIGN ONLY** = this file only (not invented as live). Do not treat DESIGN ONLY as product behavior.

### SPA source

| Item | Status | Path |
|------|--------|------|
| Operator SPA | SHIPPED | `homeassistant/custom_components/dsc_hub/frontend/src/` |
| spa-dist tip hashes | SHIPPED | `spa-dist/index.html` → `index-K2_ziUnM.js`, `calibrate-BqnIG9Rc.js`, `tune-fleet-C9fzhOX5.js`, `twin-three-BjdbWAdH.js`, `index-D0rIyyPr.css` |

### 1. Light control

| Piece | Status | Cite |
|-------|--------|------|
| Photoperiod SoT loop | SHIPPED | `brain/dsc_brain/light_loop.py` — `build_light_loop`, `emit_light_loop`, `LightLoopSnapshot` |
| Hub lights-on ingest | SHIPPED | `hub_controls.HUB_TIME_OID_TO_ENTITY` (`lights_on_time` → `time.dsc_hub_lights_on_time`); `esphome_client` TimeState ingest |
| SPA clocks / timeline | SHIPPED | `lib/lightSchedule.ts` (`readTentPhotoperiodInput`, `computeLightSchedule`, `dayScheduleSegments`); `TentLightClock.tsx`; `PhotoperiodTimeline.tsx`; `hooks/useTentLightSchedule.ts`; `pages/LightPage.tsx` |
| Dark-period / ramp floor entities | SHIPPED | `binary_sensor.dsc_clone_dark_period_violation` (`dash_computed`); `number.dsc_hub_sf1000_ramp_floor` / `min_dark_hours` (hub numbers) — **not** design `schedule_shift_plan` |
| Gradual lights-on slide / confirm ramp | DESIGN ONLY | — |

### 2. Grow log / journal

| Piece | Status | Cite |
|-------|--------|------|
| Flat grow event log | SHIPPED | Table `grow_event_log` (`settings.SETTINGS_SCHEMA`); `event_log.record_grow_log` / `list_grow_log`; API `GET /grow-log` (`api.grow_log_get`) |
| SPA consumer | SHIPPED | `fleetApi.get_grow_log`; `DashGrowLog` in `DashHomeSections.tsx`; filter `growLogFilter.ts` |
| `learning_log` + `GET /learning` | SHIPPED | Seat event log (`append_learning` / `list_learning`) — **not** design energy Learning |
| `plant_journal` / `space_journal` APIs | DESIGN ONLY | Absent from sqlite schemas |

### 3. Energy / tariff / watts

| Piece | Status | Cite |
|-------|--------|------|
| Fixture nameplate watts (catalog) | SHIPPED | Catalog DB `lights.raw_json`; photometrics / HA `wattage_w` (e.g. SF1000 100 W); SPA `PlantWizardLightStep` / `CatalogResearch` display |
| CFM / climate “nameplate” | SHIPPED | Fan/appliance capacity proxies — not TOU lighting cost |
| `energy_tariff`, `energy_device`, W×h×$/kWh calculator, Learning banners | DESIGN ONLY | No brain/SPA tariff or energy estimate routes found |

### 4. Space vs plant ownership (current model)

| Layer | Status | Behavior (verified) |
|-------|--------|---------------------|
| Tent helpers own windows | SHIPPED | 4×8: `time.dsc_hub_lights_on_time` + stage/`sensor.dsc_expected_light_hours`; 2×4: `select.dsc_hub_clone_photoperiod` Follow 4x8 \| Independent, `clone_lights_on_time`, `clone_light_hours` |
| Follow 4x8 | SHIPPED | `light_loop` `clone_follows_main`; SPA `tentPhotoperiodFollowsMain` |
| Climate Mode Follow 4x8 / Follow Plants | SHIPPED | `climate_mode.py` / `follow_plants.py` — **climate bands**, not photoperiod SoT; Follow Plants writes `clone_*` numbers |
| Plant stage → 2×4 photo write | SHIPPED | `control_ops.apply_clone_tent_automation` sets `clone_photoperiod` + `clone_light_hours` from seated 2×4 recipe (flower → Follow 4x8) |
| Plant seat rehome photo template | SHIPPED | `PlantSeatPanel.applyTent` can set Independent + 18h or main `min_dark_hours` |
| Strict space-owned photoperiod (no plant override) | DESIGN ONLY | Conflicts with current stage-automation / rehome writes |

### 5. Existing draft docs (other branches)

| Doc | Branch | Note |
|-----|--------|------|
| `docs/brain/PHOTOPERIOD-TIMELINE.md` | `cursor/engineering-documentation-e281644` (commit docs tip `863ea81`) | Present; tip `e281644` spa was `index-CZEwOtDZ.js` (stale vs `K2_ziUnM`) |
| Same path | `332e` / master tip `32836fe` / this branch | **Absent** |
| `docs/brain/WEBUI.md` light section | `e281644` | Photoperiod timeline row + grow-log API mention |
| `docs/brain/WEBUI.md` | `332e` | Rich tip SoT (`index-K2_ziUnM`) — no dedicated energy/journal; Light via SPA map links |
| `docs/brain/WEBUI.md` | this tip / master | Thin MVP stub (no Light surface table) |

### 6. Design tables in `dsc_ops.sqlite3`

| Table | Status |
|-------|--------|
| `grow_event_log` | SHIPPED |
| `learning_log` | SHIPPED (unrelated to energy Learning) |
| `plant_journal` | ABSENT (DESIGN ONLY) |
| `space_journal` | ABSENT (DESIGN ONLY) |
| `energy_tariff` | ABSENT (DESIGN ONLY) |
| `schedule_shift_plan` | ABSENT (DESIGN ONLY) |

### Recommended durable doc updates (prefer existing)

1. **Land / refresh** `docs/brain/PHOTOPERIOD-TIMELINE.md` from `e281644` onto tip SoT (`332e`/`WEBUI` merge path); retip spa hash to `index-K2_ziUnM.js`; add one paragraph: schedule is tent-helper SoT today; space-owned + ramp/journal is this design (unshipped).
2. **Update** tip `docs/brain/WEBUI.md` (prefer `332e` body over master stub): Light route → clocks/timeline modules; `GET /grow-log`; explicitly **no** plant/space journal or energy tariff APIs yet.
3. **Cross-link** this appendix from `docs/brain/WEBUI.md` / PHOTOPERIOD related — do not invent a new top-level energy runbook until implementation.
4. Keep Notion Photoperiod & Lighting + Local webserver blurbs aligned with tip hashes; do not claim tariff/journal shipped.
