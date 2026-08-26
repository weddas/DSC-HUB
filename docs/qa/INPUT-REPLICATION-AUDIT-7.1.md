# Input replication audit — DSC-HUB 7.1 (UX)

**Date:** 2026-08-27  
**Surface:** Pi SPA `http://192.168.86.48:8787/` (`dsc-brain.local:8787`). `.30` is not the Brain.  
**Live `/health`:** 200, surface **7.1.0**, expected firmware 7.0.0.0.  
**Scope:** REPLICATION — the same operator value or control appearing in more than one place, cloned input skins, and whether those copies stay honest.  
**Not this audit:** per-field validation, units, and write-path correctness. That is INPUT-AUDIT (`INPUT-AUDIT-7.1.md`). That file was **not in tree** when this pass closed; this document does not rewrite it.  
**Siblings left alone:** DESIGN, INTERACTIVE, WORKFLOW, UX, SETTINGS, ZIGBEE, DEVICE, GAUGE, GRAPH, RELATIONSHIP, FALLBACK.

**Method**

1. Mapped every writable/operator value in `frontend/src` to every surface that shows or edits it (Compose, Settings, Climate, Overview, Dash/Home, 4×8, 2×4, Light, Root/seat, Roster, Research, Learning, Calibrate, Fleet, Mission).
2. Live: Overview, Climate, 4×8, Compose, Dash/Home. Compared `/settings` + `/fleet` + `/fleet/computed`. Changed **only** in-memory / non-commit drafts. **Did not** Commit plant, Apply network, save calibration, fire demand, or put pot3 in service.
3. Hash-jump via CDP remounted the SPA onto “Connecting to fleet…” and once emptied `#root` (known INTERACTIVE/FOLLOWUPS artifact). Later Settings / Learning / Calibrate / Research / Roster walks are code + API, marked below.

**Safety:** no plant commit, no network apply, no cal save, no demand, pot3 left OOS in inventory.

---

## Verdict

**Multi-surface inputs are not operator-safe.**

Entity-bound copies that share one `number.*` / `switch.*` (Climate Want editors on Climate + 4×8 + 2×4; takeover / Full Auto chips vs Climate toggles) stay honest: one SoT, blur/click commits, siblings refresh from the bus.

The dangerous copies are the ones that **look like the same field** but bind different stores, default a missing helper to a live value, or let a background writer overwrite a chip the operator treats as fact. Live 2026-08-27 already shows that split: Compose auto-stage **Late (Push) Vegetative**, hub stage **Off**, every pot `growth_stage` **veg**, roster empty, pot3 OOS in sqlite and still a Crop Scheduler lane.

| Metric | Count |
|--------|------:|
| Replicated operator values (2+ surfaces) | **22** |
| Copies that diverge / lie | **11** |
| Honest same-entity replicas | **8** |
| Cloned input skins with different commit models | **3** |

---

## Top 8 defects

| # | Pri | Defect |
|---|-----|--------|
| 1 | **P0** | **Stage is four facts.** Compose chip = `sensor.dsc_build_expected_stage` (live **Late (Push) Vegetative**, day 48 from sprout 2026-07-09). Overview / Dash / grow log = `select.dsc_hub_grow_stage` (**Off**). Seat editor = `select.dsc_potN_growth_stage`. Crop Scheduler lane = `sensor.dsc_potN_expected_stage` (missing → **—**). Computed still emits **veg** for empty pots (`stage = row.get("stage") or "veg"`). Grow log 06:06–06:11 flipped Late Push Veg / Mother → Off / Custom with no operator editor on those chips. |
| 2 | **P0** | **`in_service` replicas do not share a bus.** Settings checkbox → sqlite inventory (pot3 **false**). Fleet / Learning `EntityToggle` → `input_boolean.dsc_*_in_service` (**missing** from `/fleet/computed`; live toggles disabled / — — SETTINGS + INTERACTIVE). Crop Scheduler / Overview pot chips use `isPotInService`, which treats missing as **ON**. pot3 is an Unassigned live lane and an Overview **P3 —** button. Hub `switch.dsc_hub_pot*_in_service` all **off**. Same gate, three stories. Object-graph detail: RELATIONSHIP REL-P0-2 / REL-P1-1. |
| 3 | **P0** | **Plant identity is a draft, a dump, and an empty seat.** Compose Nickname `QA Dummy (pot3 test)` + strain Northern Lights + tent **2x4** + assign pot **3**. Roster slots all empty. Computed `text.dsc_potN_plant_name` all empty. Settings `compose_helpers_json` still has `text.dsc_pot1_plant_name=Amnesia Blue`. Crop Scheduler / Overview show **P1 —**. Operator cannot tell which copy is the plant. Object-graph: REL-P0-1. |
| 4 | **P1** | **Two cal UIs, one entity set, two commit models.** Calibrate (`/fleet/calibrate`) keeps anemometer m/s in **local React state** until Save. Learning Sample uses `TargetNumber` on `input_number.dsc_cal_reading_ms` (blur-commit) plus a separate Save point. Same labels (m/s, step %, duct). Opening both looks like two independent instruments. Did not start a session this pass. |
| 5 | **P1** | **CannaLib URL is not the search the pickers run.** Settings Integrations binds `settings.cannalib_api_url` (`http://192.168.86.2:8790`) and “Save settings”. Compose / Research `CatalogPicker` on the Pi (`VITE_DSC_PI=1`) hits `/v1/catalogs/…` (brain proxy) and never reads that field. HA-panel path would use `input_text.dsc_cannalib_base_url` (**missing** from extras). Dash chip **CANNALIB OFF**. Three “CannaLib” copies. |
| 6 | **P1** | **Settings is one draft blob, two commit buttons.** AP SSID / PSK / channel, Ollama, and CannaLib all live in `settings` React state. **Save settings** PATCHes the whole object (including AP) without applying Wi-Fi. **Apply network** calls `save()` then `apply_network()` — so a typed CannaLib URL rides along. Intra-page silent sibling persist. Apply-restart honesty is SETTINGS’ P0; this row is the shared-draft lie. |
| 7 | **P1** | **Lighting hours copies do not share a parent.** Light page edits `number.dsc_hub_clone_light_hours` (live **18**). Crop Scheduler / Light KPI show `sensor.dsc_clone_expected_light_hours` (**18** — honest pair) and `sensor.dsc_expected_light_hours` (**0** because hub stage is Off). Compose’s auto-stage is Late Push Veg. Operator sees “Want 0h” on 4×8 next to a draft plant that is day 48 veg. |
| 8 | **P1** | **Cloned skins that do not stay in sync while typing.** `PlantSeatPanel` name/sprout/stage drafts resync only when `pot` changes, not when the entity bus moves. Crop Scheduler always shows the committed entity. Compose **Tank L** (`input_number.dsc_mix_tank_liters`) and vessel **20 L** (`input_number.dsc_blend_total_l`) sit on the same page with the same number and different stores. Catalog search `q` is per-`CatalogPicker` instance (Compose drawer ≠ Research). |

---

## How to read the matrix

| Sync | Meaning |
|------|---------|
| **honest** | Same store; siblings match after commit; draft isolation is labeled or local-until-blur. |
| **diverge** | Copies show different values, or one is a default/ghost. |
| **clone-skin** | Same widget pattern, different bind or commit. |
| **status-only** | Second surface is a chip/readout of the first (OK if it cannot be mistaken for an editor). |

SoT = the store a write actually hits.

---

## Matrix — value → surfaces → sync / honesty

### Climate Want (setpoints)

| Value | SoT | Surfaces | Label / unit / default | Commit | Sync |
|-------|-----|----------|------------------------|--------|------|
| 4×8 T | `number.dsc_hub_target_temp` | Climate TentTargets; 4×8 TentTargets; Overview/Dash band “Want”; Compose “Apply climate Want” (script) | Temp °C / 26.0 live | TargetNumber blur | **honest** Climate↔4×8 (both 26). Overview is readout. Compose apply is a second writer (not fired). |
| 4×8 RH min/max | `number.dsc_hub_rh_target_*` | same | RH % / 50–60 | blur | **honest** |
| 4×8 VPD min/max | `number.dsc_hub_vpd_target_*` | same | VPD (no kPa on editor) / 1.0–1.2 | blur | **honest** Climate↔4×8. Dash Operational Now band 1.0–1.2. |
| 2×4 T | `number.dsc_hub_clone_target_temp` | Climate; 2×4 | Temp °C / 25.0 | blur | **honest** (Climate live 25). |
| 2×4 RH / VPD | `number.dsc_hub_clone_rh_*` / `*_vpd_*` | Climate; 2×4; Dash VPD band (Follow uses 4×8 numbers) | RH 55–65, VPD 0.8–1.1 | blur | **honest** when clone_mode ≠ Follow. Dash live: Custom, uses clone band. |
| Want rail hint | `tentWant.ts` from hub stage / clone_mode | TentTargets “no plant/stage rail” | — | n/a | **diverge** — chips say no rail because hub stage is Off / roster empty, while Compose shows Late Push Veg. |

Live in-memory: did **not** blur a setpoint (blur writes the hub). Code + dual-page read: Climate and 4×8 showed the same committed numbers.

### Mode / takeover

| Value | SoT | Surfaces | Commit | Sync |
|-------|-----|----------|--------|------|
| Master takeover | `switch.dsc_hub_manual_takeover` | Climate EntityToggle; Mission/Dash/Overview mode chip; inspector | click (unguarded — INTERACTIVE) | **honest** status-only siblings. Live OFF. |
| Full Auto | `switch.dsc_hub_tent_full_auto_mode` | Climate toggle; Dash “Full Auto” | click | **honest**. Live ON. |
| Fan override | `switch.dsc_hub_tent_manual_override` | Climate toggle; fan sliders enable; Dash “Fan override” | click | **honest**. Live OFF; sliders disabled on Climate + 4×8. |
| Strategy | `select.dsc_hub_control_strategy` | Climate select; Dash chip | change | **honest**. Live VPD. |
| Priority tent | `select.dsc_hub_priority_tent` | Climate select; Dash “Priority 2x4 Clone” | change | **honest**. Live 2x4 Clone. |

### Stage / clone mode / lighting hours

| Value | SoT | Surfaces | Label / default | Commit | Sync |
|-------|-----|----------|-----------------|--------|------|
| Compose auto stage | `sensor.dsc_build_expected_stage` from `input_datetime.dsc_build_sprout_date` | Compose chip only | “Auto stage · …” / Late Push Veg | sprout blur | **diverge** vs hub + pots |
| Hub grow stage | `select.dsc_hub_grow_stage` | Overview/Dash chips; grow log; `tentWant` 4×8 rail; Light 4×8 Want hours | “Off” live. **No SPA editor.** | `apply_clone_tent_automation` + hub | **diverge** — silent overwrite. Grow log 06:06 Late Push Veg, 06:11 Off. |
| Pot growth stage | `select.dsc_potN_growth_stage` | PlantSeatPanel `<select>` | options from entity; computed default **veg** | change | **diverge** — all four pots **veg** with empty roster |
| Pot expected stage | `sensor.dsc_potN_expected_stage` | Crop Scheduler lane (`seat.stage`) | — if no sprout | derived | **diverge** — missing in extras; lanes show **—** |
| Clone mode | `select.dsc_hub_clone_mode` | Dash/Overview chip; `tentWant` 2×4; grow log | Custom live. **No SPA editor.** | automation + hub | **diverge** — 06:06 Mother, then Custom |
| 2×4 light hours | `number.dsc_hub_clone_light_hours` | Light TargetNumber (Independent only) | “2×4 hours” | blur | editor |
| 2×4 Want hours | `sensor.dsc_clone_expected_light_hours` | Light KPI; Crop Scheduler chip | 18.0 | derived | **honest** vs editor (18=18) |
| 4×8 Want hours | `sensor.dsc_expected_light_hours` | Light KPI; Crop Scheduler | 0.0 (stage Off) | derived from hub stage | **diverge** vs Compose day-48 veg |
| 4×8 opens / min dark | `time.dsc_hub_lights_on_time`, `number.dsc_hub_min_dark_hours` | Light only | — | blur | single surface (not replicated) |
| Window source | `select.dsc_hub_clone_photoperiod` | Light | Follow vs Independent | change | unlocks 2×4 hours; Crop Scheduler does not say which |

### Plant identity / tent / sprout

| Value | SoT | Surfaces | Commit | Sync |
|-------|-----|----------|--------|------|
| Compose nickname | `input_text.dsc_build_nickname` | Compose EntityText | blur | draft. Live **QA Dummy (pot3 test)** |
| Pot plant name | `text.dsc_potN_plant_name` from **roster recipe** in computed | Seat Nickname; Crop Scheduler; Overview P chips | seat blur → `text.set_value` | **diverge** — extras empty; helpers dump still has Amnesia Blue on pot1 |
| Roster nickname | `sensor.dsc_plant_roster_summary` slots | Roster; seat “Roster #” | Commit plant (not fired) | **diverge** — all 8 slots empty |
| Compose sprout | `input_datetime.dsc_build_sprout_date` | Compose date | blur | **2026-07-09** → day 48 |
| Pot sprout | `datetime.dsc_potN_sprout_date` | Seat date | blur | extras empty |
| Compose tent | `input_select.dsc_build_tent` | Compose select | change | live **2x4** |
| Pot tent | `input_select.dsc_potN_tent` | Seat chips; Crop Scheduler; 4×8/2×4 seat lists | `select_option` | pot1 **clone** in extras (matches 2×4 lane); pot2/4 unassigned; roster empty |
| Assign pot | `input_select.dsc_build_assign_pot` | Compose | change | live **3** while pot3 inventory OOS |
| Seat name/sprout/stage drafts | React state in `PlantSeatPanel` | drawer only | blur / change | **clone-skin** — resync on `pot` only; sibling Crop Scheduler stays on entity |

### In service / kit

| Value | SoT | Surfaces | Commit | Sync |
|-------|-----|----------|--------|------|
| Inventory in_service | sqlite `fleet_inventory` | Settings checkbox (immediate PATCH); Settings card “In service: yes/no” | checkbox | Settings SoT. pot3 false. |
| Helper in_service | `input_boolean.dsc_*_in_service` | Fleet + Learning EntityToggle; `isPotInService` | toggle → `upsert_inventory` | **diverge** — extras **MISSING**; Fleet/Learning dead (INTERACTIVE IA-P0-4); Crop Scheduler defaults ON |
| Hub in_service | `switch.dsc_hub_*_in_service` | not edited in SPA; extras all **off** | hub | **diverge** vs inventory pot1/2/4 on |
| AC / mister | inventory + helper | Settings (missing seats); Learning + Fleet toggles | see above | SETTINGS: AC/mister/tank absent from Settings cards |

### Network / CannaLib / catalog search

| Value | SoT | Surfaces | Commit | Sync |
|-------|-----|----------|--------|------|
| AP SSID / PSK / channel | `settings.ap_*` sqlite | Settings Network only | Save settings **or** Apply network (both persist) | single editor; **clone-skin** dual commit. PSK also in GET plaintext (SETTINGS). |
| Device RSSI | fleet seat | Settings card | n/a | related, not the SSID |
| CannaLib API URL / key | `settings.cannalib_*` | Settings Integrations | Save settings | **diverge** vs pickers |
| Catalog search `q` | local React per picker | Compose DecisionLayer; Research | debounce 200ms fetch | **clone-skin** — independent queries. Pi fetch = brain proxy, not Settings URL |
| CannaLib status | `binary_sensor.dsc_cannalib_api_online` | Dash chip CANNALIB OFF | n/a | **status-only**; does not reflect Settings URL draft |

### Cal / mix / fans / light / demand

| Value | SoT | Surfaces | Commit | Sync |
|-------|-----|----------|--------|------|
| Cal target | `input_select.dsc_cal_target` | Learning EntitySelect; Calibrate chip index (local until Start) | select vs local | **clone-skin** |
| Cal m/s | `input_number.dsc_cal_reading_ms` | Learning TargetNumber; Calibrate local `<input>` | blur vs Save | **clone-skin / diverge** while typing |
| Cal step / ducts / PPFD | same `input_number.dsc_cal_*` | Learning grid; Calibrate writes on Save | blur vs Save | **clone-skin** |
| Vessel litres | `input_number.dsc_blend_total_l` | Compose vessel pick | pick writes | live 20 |
| Mix tank L | `input_number.dsc_mix_tank_liters` | Compose “Tank L” + “Tank 20 L” chip | blur | **diverge-capable** — same page, two 20s |
| Fan % | `fan.dsc_hub_*` | Climate sliders; 4×8/2×4 sliders | pointer-up | **honest** same entity; both locked without override |
| SF1000 | `light.dsc_hub_sf1000_dimmer` | Light toggle; Live 2×4 chip; LivePages | click | **honest** bind; INTERACTIVE owns unguarded write |
| Mat demand | `switch.dsc_hub_grow_mat_demand` | Climate; Root; Dash “Mat live” | click | **honest** bind. Live ON. Not fired. |
| Device function / placement | inventory `extra` | Settings card (read) + assignment table (draft until Save) | Save row | intra-page stale sibling until Save (SETTINGS: write-only extras) |

---

## Live notes (2026-08-27, `.48`)

| Surface | What matched | What lied |
|---------|--------------|-----------|
| Climate | Takeover OFF, Full Auto ON, Want 2×4 25/55–65/0.8–1.1 and 4×8 26/50–60/1.0–1.2 | Crop Scheduler P3 Unassigned (not OOS). P1 name **—** while tent 2×4. TentTargets “no plant/stage rail”. |
| 4×8 | Same 4×8 Want numbers as Climate | Same ghost P3 lane. Fan sliders locked 15/30/15. |
| Overview | Bands use those Wants. P1–P4 names **—**. Grow log shows stage/clone flips | P3 is a pot button. No stage chip on this page’s bands header (Dash/Home owns Operational Now). |
| Dash/Home (`#/ops/home`) | Operational Now: Off / Custom / VPD / Priority 2x4 / Full Auto. 4×8 VPD band 1.0–1.2. CANNALIB OFF. 7 of 11 in service | Off/Custom vs Compose Late Push Veg. P3 “direct” link chip still present. |
| Compose | Nickname, sprout 2026-07-09, auto-stage Late Push Veg, assign **3**, tent **2x4**, Tank L 20, vessel 20 L | Looks like a live plant aimed at OOS pot3. Nutrient slots disabled. Not committed. |
| `/settings` API | Inventory pot3 `in_service=false`; pot1/2/4 true. AP `DSC-Brain`. CannaLib URL set | `compose_helpers_json` still holds the draft plant + Amnesia Blue. Roster JSON empty. |
| `/fleet/computed` | Setpoints, compose sprout/stage, hub Off/Custom, clone hours 18 | No `input_boolean.dsc_*_in_service`. No pot expected_stage. Pot names empty. Pot stages **veg**. Hub pot in_service switches off. |

In-memory diverge (no commit): Compose identity already disagrees with every seat/overview copy without typing. Climate Want editors were left unfocused so a sibling page would still show the bus value (TargetNumber drops unfocused drafts on unmount). Catalog search independence is code-true (`useState` per picker); not re-typed after the SPA remount.

---

## Cloned input skins

| Skin | Used on | Same bind? | Same commit? |
|------|---------|------------|--------------|
| `TargetNumber` | TentTargets, Light hours, Compose tank/dose, Learning cal | sometimes | blur-commit always — honest when entity is shared |
| `EntityText` / seat `<input>` | Compose nickname vs seat Nickname | **no** (build vs pot) | both blur, different domains (`input_text` vs `text`) |
| `EntityDatetime` vs seat date | Compose sprout vs pot sprout | **no** | `input_datetime.set_datetime` vs `datetime.set_value` |
| `EntitySelect` vs seat tent chips | Compose tent vs `input_select.dsc_potN_tent` | **no** | options `4x8/2x4` vs `clone/main/unassigned` (REL-P1-4) |
| `EntityToggle` vs Settings checkbox | Fleet/Learning vs Settings in_service | **no** | service vs PATCH; live only PATCH works |
| `CatalogPicker` | Compose drawer, Research | same search fn | pick writes build helpers (Compose) vs local selected (Research) |
| Calibrate wizard vs Learning wizard | `/fleet/calibrate` vs `/tune/learning` | overlapping cal entities | local+Save vs blur+script |

---

## What is already honest

- Climate / 4×8 / 2×4 Want **editors** that share `number.dsc_hub_*` stay aligned after blur.
- Takeover / Full Auto / strategy / priority chips on Dash are readouts of the Climate command row.
- Fan sliders on Climate and tent cockpits share entities and both lock when override is off.
- 2×4 `clone_light_hours` and `clone_expected_light_hours` matched at 18.

Those are not enough. The operator-facing words “stage”, “plant”, “in service”, and “CannaLib” each have more than one store.

---

## Priority actions (this audit only)

**P0**

1. One stage SoT on the SPA: either hub `grow_stage` is the chip **and** Compose auto-stage writes it with a visible “applied” state, or chips show pot/compose derived values and stop pretending the hub Off/Custom pair is the crop. Stop emitting `veg` for empty pots.
2. Project inventory `in_service` into the entity bus the SPA actually reads (`fleetToHass` extras or a fleet field). `isPotInService` must not default missing to ON. pot3 must not be a scheduler lane while sqlite says OOS.
3. One plant-identity strip: Compose draft labeled **draft**; seats/overview read roster/pot only. Clear or hide `compose_helpers_json` ghosts after retire (REL-P0-1).

**P1**

4. Kill or merge Calibrate vs Learning so one wizard owns `dsc_cal_*`.
5. Bind Compose/Research search to the same CannaLib config Settings tests, or drop the Settings URL from the operator story.
6. Split Settings network draft from integrations draft (or make Apply/Save say what they persist).
7. Derive 4×8 Want hours from the same stage the operator sees on Compose/seats, or label “hub stage Off → 0h”.
8. Resync seat drafts on entity tick; do not show two litre fields that look like one tank.

**P2**

- Catalog search `q` not shared across Compose/Research is acceptable if the drawer title stays “Search …”.
- Device assignment card vs table stale-until-Save: SETTINGS already owns the write-only extras.

---

## Distinct from INPUT-AUDIT

If `INPUT-AUDIT-7.1.md` lands later, it should own: clamp/step/unit, disabled nutrient slots, date ISO shape, `TargetNumber` min/max, password field behavior. This file owns: **which copy is SoT, silent overwrite, stale sibling, clone-skin**.

---

## Files edited this pass

- `docs/qa/INPUT-REPLICATION-AUDIT-7.1.md` (this file)
- `docs/FOLLOWUPS.md` (new P0/P1 only)

No commit. No deploy.
