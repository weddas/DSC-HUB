# Input audit — DSC-HUB Pi SPA 7.1

**Date:** 2026-08-27  
**Surface:** Pi SPA `http://192.168.86.48:8787/` (`dsc-brain.local`). `.30` is not the Brain.  
**`/health`:** `ok`, version/surface `7.1.0`, expected firmware `7.0.0.0`.  
**Scope:** Form inputs only — text, number, select, checkbox, slider, date/time, search/typeahead, file. Buttons, demand tiles, and EntityToggles are the sibling [INTERACTIVE-AUDIT-7.1](INTERACTIVE-AUDIT-7.1.md). Visual chrome is [DESIGN-AUDIT-7.1](DESIGN-AUDIT-7.1.md).  
**Not this pass:** Commit plant, Apply network, Save settings, save calibration, Start cal session, fire demand, toggle In service, change a live plant sprout/stage.

## Method

- Source map of every `<input>` / `<select>` / `<textarea>` in `frontend/src`.
- Live hash-walk of all primary routes on `.48` (dedicated tab).
- Typed only in local-until-commit fields (catalog search, Calibrate light drafts, Settings SSID / Max % drafts) and restored them.
- Persist-on-blur / persist-on-change fields: inspected values, min/max/step, disabled state. Did not leave a changed blur.

## Verdict

**Forms are not operator-safe.**  
Compose tells the grower “Each action asks you to confirm before anything is saved,” then writes helpers on blur and select-change via `POST /control/service`. Climate Want numbers write the live hub the same way. Eight nutrient slots and the whole Learning number grid are disabled on the live Pi, so the nutrition and anemometer forms look real and do nothing.

| Metric | Value |
|---|---|
| Input instances (primary surfaces, no tent-page double-count) | **143** |
| Unique roles scored | **59** |
| Roles failed | **41** |
| Fail rate | **69%** |
| Operator-safe? | **No** |

Instance tally: Compose 32 (31 on-page + strain search drawer) · Research 1 · Roster seat 4 · Climate 16 · Light 7 · Learning drawers 31 · Calibrate light 3 · Settings 49. 4×8 / 2×4 cockpits reuse Climate Want + fan sliders (not added again). Fan-session m/s was not opened (would start a hold).

---

## Top 8 input defects

1. **Confirm copy is a lie.** Compose footer says every action confirms first. Nickname, sprout date, custom slot, tent, assign pot, tank L, strength %, layer names, recipe note, and mix sliders write on blur/change with no DecisionLayer. Roster nickname / sprout / stage do the same to the live pot.
2. **Nutrition form is dead.** Slots 1–8 name + ml/L are `disabled`. Helpers are not on the Pi bus. “Add from catalog” still tries `input_text.dsc_nutrient_N_name`. Empty slots stay empty because they cannot be filled.
3. **Learning numbers are dead, and the fallback range is wrong.** Sample (m/s, CFM, PPFD, ducts), EMA α, min samples, and 20 curve points are disabled. `TargetNumber` defaults `max=100` when attributes are missing. HA YAML allows CFM 1500 / PPFD 3000 / m/s 50 — a live write would silently clamp CFM to 100.
4. **Climate Want writes the running room on blur.** Temp / RH / VPD have no confirm. VPD labels omit kPa. min/max render as `0–100` with step 0.01. A typo of `10` is 10 kPa, not 1.0.
5. **Photoperiod clocks are empty and disabled.** `time.dsc_hub_lights_on_time` and `time.dsc_hub_clone_lights_on_time` show blank, `disabled`. Sunrise / sunset / min dark / 2×4 hours still write on blur.
6. **In-service checkboxes write immediately** (`PATCH /settings/inventory/{seat}`). Ten seats, including hub. No confirm. Same finding as IA-P0-2; called out here because they are the only real checkboxes in the SPA besides CannaLib fallback.
7. **AP PSK is a live value in a password field.** Masked on screen; full secret in the DOM / `GET /settings`. Placeholder already says `••••••••`. Save settings patches network + integrations in one shot with no confirm. Settings audit already flagged the API leak (do not repeat the value).
8. **Catalog typeahead honesty flickers.** Empty open flashes “No catalog hits — empty is honesty, not a placeholder,” then fills from the brain proxy. Research search has no `<label>`. Placeholder says “options are not culled.” Query `Northern Lights` correctly returns `Northern Lights indica 00 Seeds Bank`. `<script>…` correctly yields empty. Empty browse lists merch-ish / note titles (`"VPD" for drying`).

---

## Write path (all routes)

| Path | When | Used by |
|---|---|---|
| `POST /control/service` | blur / change / slider release | `EntityText`, `EntitySelect`, `EntityDatetime`, `EntityTime`, `TargetNumber`, mix sliders |
| `PATCH /settings` | Save settings | integrations + network fields together |
| `PATCH /settings/inventory/{seat}` | checkbox change or row Save | In service; Function / Placement / Max % |
| `POST /settings/network/apply` | Apply network (not fired) | AP SSID / PSK / channel |
| `POST /settings/calibration/{id}` | Calibrate Save (not fired) | light LUX/PAR/height; fan session m/s |
| Local React state | until Save / pick / dismiss | catalog `q`, Calibrate light drafts, Settings drafts, Learning gate UI |
| Catalog pick | immediate helper write | strain / medium / nutrient / light → `input_text` / `input_number` / `input_select` |

`useFleetActions` on the Pi SPA is brain `/control/*`, not HA `callService`.

---

## Per-route tables

Verdict: **Pass** / **Fail**. Skin on live 7.1.0 is token-scoped (`#12171f` field, teal focus ring) unless noted.

### Live — Overview / Mission / Twin / Root / Home / Fleet / Analytics

No form inputs. Timespan chips are buttons (interactive audit).

### Live — Climate (`/#/live/climate`)

Live values: 2×4 **25 °C · 55–65 % · 0.8–1.1**; 4×8 **26 °C · 50–60 % · 1.0–1.2**. Strategy **VPD**. Priority tent **2x4 Clone**. Fan sliders locked at 15 / 15 / 30 / 15 % (override off). Hint on every Want number: `no plant/stage rail`.

| Label | Type | Units / step | Placeholder | Validation | Writes | Skin | Error text | Verdict |
|---|---|---|---|---|---|---|---|---|
| Strategy | select | — | — | options VPD / Temperature / Humidity | immediate `/control/service` | skinned | none | **Fail** — no confirm |
| Priority tent | select | — | — | 4x8 Main / 2x4 Clone | immediate | skinned | none | **Fail** — no confirm |
| Temp °C ×2 | number | °C / 0.5 | — | DOM min 0 max **100** | blur → `number.dsc_hub_*_target_temp` | skinned | silent clamp | **Fail** |
| RH min/max % ×2 | number | % / 1 | — | 0–100 | blur | skinned | silent clamp; min>max only a hint tone | **Fail** |
| VPD min/max ×2 | number | **unit missing** / 0.01 | — | 0–100 (should be ~0–2.5 kPa) | blur | skinned | silent clamp | **Fail** |
| Intake 4×8 / 2×4, Exhaust room / outside | range | % / 1 | — | 0–100, disabled until Fan override | pointer-up → `fan.set_percentage` | skinned | n/a while locked | **Pass** (honest lock) |

### Live — 4×8 / 2×4 cockpits

Same Want numbers + the fans for that tent. 2×4: Temp 25 / RH 55–65 / VPD 0.8–1.1 + Intake 2×4 slider. Crop-scheduler pot click opens `SeatOverlayHost` on the **current** page (nickname / sprout / stage travel with you). Overlay dismissed after inspect.

### Live — Light (`/#/live/light`)

Window source **Independent**. 2×4 hours **18**. Sunrise / sunset **30**. Min dark **4**.

| Label | Type | Units / step | Placeholder | Validation | Writes | Skin | Error text | Verdict |
|---|---|---|---|---|---|---|---|---|
| 4×8 opens | time | — | — | **disabled, value empty** | would be `time.set_value` | skinned | none | **Fail** |
| Sunrise min | number | min? / **0.1** | — | 0–100 | blur | skinned | silent clamp | **Fail** |
| Sunset min | number | min? / 0.1 | — | 0–100 | blur | skinned | silent clamp | **Fail** |
| Min dark h | number | h / 0.1 | — | 0–100; hint `no plant/stage rail` | blur | skinned | silent clamp | **Fail** |
| Window source | select | — | — | Follow 4x8 / Independent | immediate | skinned | none | **Fail** |
| 2×4 lights-on | time | — | — | **disabled, empty** | would be `time.set_value` | skinned | none | **Fail** |
| 2×4 hours | number | h / 0.1 | — | 0–100 | blur | skinned | silent clamp | **Fail** |

SF1000 / Auto photoperiod / Manual hold are `EntityToggle` buttons (interactive audit, IA-P0-6).

### Grow — Compose (`/#/grow/compose`)

Live draft (do not commit): strain **Northern Lights**, nickname **QA Dummy (pot3 test)**, sprout **2026-07-09**, custom slot **1**, assign pot **3**, tent **2x4**, climate apply **Fleet**, tank **20 L**, strength **100 %**, mix Σ **0 %**, fixture **No fixture**. Auto-stage chip did not render (same as WF-P1-6).

| Label | Type | Units / step | Placeholder | Validation | Writes | Skin | Error text | Verdict |
|---|---|---|---|---|---|---|---|---|
| Nickname | text | — | — | none / no maxLength | blur → `input_text.dsc_build_nickname` | skinned | none | **Fail** |
| Sprout date | date | ISO date | — | empty skipped on some paths | blur → `input_datetime.dsc_build_sprout_date` | skinned | none | **Fail** — live draft, inspect only |
| Custom strain slot | select | — | — | auto, 1–5 | change immediate | skinned | none | **Fail** |
| Strain search | search | — | “Type to search — options are not culled” | local `q`; 200 ms debounce | local until pick | skinned | empty-flash then hits; XSS query → honest empty | **Fail** honesty / **Pass** query |
| Layer 1–3 name | text | — | — | none | blur | skinned | none | **Fail** |
| Layer % | range ×3 | % / 1 | — | 0–100; remainder disabled | drag-end → three `input_number.dsc_blend_pct_*` | skinned; **no label** on the slider | Σ chip warns ≠100 | **Fail** |
| Tank L | number | L / 0.5 | — | 0–100 | blur | skinned | silent clamp | **Fail** |
| Strength % | number | % / 1 | — | 0–100 | blur | skinned | silent clamp | **Fail** |
| Slot 1–8 | text | — | — | **disabled** | would be `input_text.dsc_nutrient_N_name` | looks like an input, greyed | none | **Fail** |
| ml/L ×8 | number | ml/L / 0.1 | — | **disabled**; DOM 0–100 | would be `input_number.dsc_nutrient_N_dose_ml_l` | greyed | none | **Fail** |
| Recipe note | textarea | — | — | none | blur | skinned | none | **Fail** |
| Assign pot | select | — | — | none, 1–4 | change immediate | skinned | none | **Fail** |
| Tent | select | — | — | 4x8 / 2x4 | change immediate | skinned | none | **Fail** |
| Climate apply pot | select | — | — | Fleet, 1–4 | change immediate; **WF-P1-5** apply script reads assign pot instead | skinned | none | **Fail** |

Catalog coupling: pick writes strain name immediately (`input_text.dsc_build_strain`). Height/THC chips only after a pick (not tested — would persist). Vessel chips write `input_select.dsc_build_vessel` + blend litres (not clicked). `VesselSelect` exists in source and is **not mounted**.

Copy vs behavior: “Each action asks you to confirm before anything is saved” is false for every field above. Confirm is only on Commit / Assign / Mix / Want / Retire **buttons**.

### Grow — Research (`/#/grow/research`)

| Label | Type | Units | Placeholder | Validation | Writes | Skin | Error text | Verdict |
|---|---|---|---|---|---|---|---|---|
| *(none)* | search | — | “Type to search — options are not culled” | same CatalogPicker | local until “Use in Compose” | skinned | empty-flash | **Fail** — unlabeled |

### Grow — Roster (`/#/grow/roster`)

Table has no inputs. Seat drawer / overlay (P1 opened: empty name, empty sprout, empty stage, notes disabled — “Not on roster”).

| Label | Type | Units | Placeholder | Validation | Writes | Skin | Error text | Verdict |
|---|---|---|---|---|---|---|---|---|
| Nickname | text | — | — | none | blur → `text.dsc_potN_plant_name` | skinned | none | **Fail** — live pot |
| Sprout date | date | — | — | empty skip | blur → `datetime.dsc_potN_sprout_date` | skinned | none | **Fail** — inspect only |
| Growth stage | select | — | — | Germination … Final 48-72h | change immediate | skinned; a11y name dumps all options | none | **Fail** |
| Roster notes | textarea | — | — | disabled when no roster slot | blur → `input_text.dsc_plant_roster_N_notes` | greyed | none | **Pass** (honest disable) |

### Tune — Learning (`/#/tune/learning`)

On-page: no inputs (toggles are buttons). Drawers:

| Drawer | Label | Type | Units / step | State | Writes | Verdict |
|---|---|---|---|---|---|---|
| Sample | m/s, CFM, PPFD, Step %, four duct cm | number | DOM 0–100 / 0.1 | **all disabled**, empty | blur → `input_number.dsc_cal_*` / `dsc_duct_*` | **Fail** |
| Learn enable | EMA α, Min samples | number | 0–100 / 0.1 | **disabled**, empty | blur | **Fail** |
| Stored curves | @25/50/75/100% × OUT, RECIRC, Intake 4×8, Intake 2×4, SF1000 PPFD (20) | number | 0–100 / 0.1 | **disabled**, empty | blur | **Fail** |
| Gate | Cal target | select | — | not separately snapshotted; `EntitySelect` | change → `input_select.dsc_cal_target` | inspect only |

HA YAML (`dsc_v4_device_cal.yaml`): m/s 0–50 step 0.01; CFM 0–1500; PPFD 0–3000. Live DOM max 100 because attributes never arrive.

### Fleet — Calibrate (`/#/fleet/calibrate`)

Fan tab (pick phase): no number field until Start session (**not started**). Light tab — local until Save (typed overflow, restored):

| Label | Type | Units / step | Placeholder | Validation | Writes | Skin | Error text | Verdict |
|---|---|---|---|---|---|---|---|---|
| Sensor height (cm) | number | cm / default 1; **no max** | — | min 1; empty valid; 999999 accepted | local until Save | skinned | none until Save | **Fail** overflow |
| LUX @ 25% dim | number | lux; min 0; **no max** | — | empty valid; junk coerced empty; −1 native underflow (no UI) | local until Save | skinned | Save: “Enter the LUX reading…” | **Fail** overflow |
| PAR µmol/m²/s (optional) | number | µmol/m²/s; min 0; **no max** | — | same | local until Save | skinned | optional — empty OK | **Fail** overflow |

Fan session m/s (code, not live-opened): local until Save; min 0 step 0.01; placeholder `e.g. 3.2` or last helper; no max. Save rejects `ms <= 0` with honest status text. Starting the session would hold fans — skipped.

### Fleet — Settings (`/#/fleet/settings`)

Ten inventory cards (control, dehum, heater, heatmat, hub, hum, pot1–4). POT3 card **OFFLINE** (inventory OOS — WF-P1-3). Assignment table: 10× Function / Placement / Max %. Integrations populated: Ollama `http://192.168.86.2:11434` / `llama3.1:8b`; CannaLib `http://192.168.86.2:8790`; API key empty. SSID typed `AUDIT-TEST-SSID` then restored to `DSC-Brain`. Max % overflow 999 is native-invalid; no visible error; left empty.

| Label | Type | Units | Placeholder | Validation | Writes | Skin | Error text | Verdict |
|---|---|---|---|---|---|---|---|---|
| In service ×10 | checkbox | — | — | none | **immediate** `PATCH /settings/inventory/{seat}` | teal custom box | none | **Fail** (IA-P0-2) |
| Function ×10 | text | — | `e.g. intake_temp` | none | local until row Save | skinned | none | **Fail** unlabeled vs row (IA-P1-7) |
| Placement ×10 | text | — | `e.g. 4x8 intake duct` | none | local until row Save | skinned | none | same |
| Max % ×10 | number | % / min 1 max 100 | `100` | native overflow; empty allowed | local until row Save | skinned | **no UI text** | **Fail** |
| AP SSID | text | — | — | none | local until Apply network | skinned | none | **Pass** if Apply stays unused |
| AP PSK | password | — | `••••••••` | none | local until Apply; **value prefilled** | masked | none | **Fail** secret in DOM |
| Channel | select | — | — | 1 / 6 / 11 only | local until Apply | skinned; a11y name `1611` | none | **Pass** range / **Fail** a11y |
| Ollama URL | text | URL | `http://192.168.86.2:11434` | none | Save settings (no confirm) | skinned | Test result JSON only | **Fail** |
| Ollama model | text | — | — | none | Save settings | skinned | none | **Fail** |
| CannaLib API URL | text | URL | — | none | Save settings | skinned | none | **Fail** |
| CannaLib API key | password | — | — | none | Save settings | empty | none | **Pass** empty |
| Use on-Pi sqlite fallback | checkbox | — | — | — | local until Save settings | teal | none | **Fail** unlabeled grouping |
| Import backup | file | `.zip` | — | none | **immediate** import | native file | result JSON | **Fail** (IA-P1-11) |

---

## Cross-cutting

### Units and decimals

| Family | Claimed unit | Live step | Live max | Honesty |
|---|---|---|---|---|
| Tent temp | °C in label | 0.5 | **100** | Unit OK; range not grow-safe |
| RH | % in label | 1 | 100 | OK |
| VPD | **omitted** | 0.01 | **100** | Should be kPa, ~0–2.5 |
| Tank | L in label | 0.5 | 100 | OK for a tank; no litres on vessel slider |
| Strength / mix / fans | % | 1 | 100 | OK |
| Nutrient dose | ml/L | 0.1 | 100 (dead) | OK if enabled |
| Sunrise / sunset | “min” | **0.1** | 100 | Minutes should be integers |
| Min dark / 2×4 hours | h | 0.1 | 100 | 100 h is not a day |
| Cal LUX / PAR / height | in label | default 1 | **none** | Overflow accepted |
| Learning CFM / PPFD | label only | 0.1 | **100** | HA allows 1500 / 3000 |

VPD live values render as `1` and `1.2`, not `1.00`. Temp live `25` / `26` (no forced `.0`).

### Missing or weak labels

- Research search: no label (placeholder only).
- Coupled-mix sliders: name field is labeled; the range is not.
- Settings Function / Placement / Max %: header-only, not `<label for>`.
- Channel combobox accessible name concatenates `1611`.
- Growth stage accessible name dumps the entire option list.
- Catalog placeholder is operator-facing jargon (“not culled”).

### Validation pattern

`TargetNumber` on blur: non-finite → revert to last live, **no message**; finite → `Math.min(max, Math.max(min, v))` then write. Overflow is silent. Empty number is not an error. Text fields have no maxLength, no duplicate-strain check, no special-char reject (catalog search correctly treats junk as no hits). Date empty does not write. Native `min`/`max` on Settings Max % and Calibrate height/LUX exist but are not surfaced as copy.

### Autofill / CannaLib

Pi path: `GET /v1/catalogs/{strains|mediums|nutrients|lights}?q=&limit=100`. Live source chip: **Cannalib** — “Brain catalog proxy (remote API or local fallback).” Typeahead works after ~200–600 ms. Empty browse is not cultivar-clean. Pick writes helpers immediately (IA-P1-12). Strain chip on Compose already showed Northern Lights **before** this pass; we did not pick a new one.

### Skin / affordance

Token pass from 7.1.2 holds: text/number/search/password/date/time/textarea share panel fill + teal focus; range has custom thumb; checkbox is a teal box. Disabled nutrient / learning / time fields still **look like inputs** (same chrome, dimmed). Fan sliders look like inputs and are honestly locked. In-service checkboxes look clickable and **are** — that is the danger.

### Error-text honesty

| Situation | What the UI says | What happens |
|---|---|---|
| Compose save | “Each action asks you to confirm…” | Fields already persisted |
| Catalog first paint | “No catalog hits — empty is honesty” | Hits arrive ~600 ms later |
| TargetNumber overflow | nothing | value clamped, then written |
| Nutrient slots | “Empty slots stay empty” | They stay empty because they are disabled |
| Learning sample | “Values save when you leave the field” | Fields cannot be typed |
| Calibrate LUX empty + Save | “Enter the LUX reading…” | Honest — only after Save |
| Settings Max % 999 | nothing | native invalid; Save still clickable |
| Tent apply (roster) | “the hub rejected it” | **REL-P1-4** — often a vocabulary reject, not hub |

---

## Priority

### P0

| ID | Defect |
|---|---|
| **IN-P0-1** | Compose confirm-copy vs persist-on-blur/change for identity, mix, assigns. Operator can believe the plant is a draft. Live draft already points at pot 3 (WF-P0-2). |
| **IN-P0-2** | Nutrient slot inputs disabled on the live Pi. Nutrition form is theatre. |
| **IN-P0-3** | Learning / cal helper numbers disabled; `TargetNumber` max fallback 100 would clamp CFM/PPFD if the bus ever lights up. |

Cross-ref, not re-owned: IA-P0-2 (In service immediate), Settings audit PSK in `GET /settings`, IA-P1-5 (Want/seat blur, no undo).

### P1

| ID | Defect |
|---|---|
| **IN-P1-1** | 4×8 / 2×4 lights-on `<input type="time">` disabled and empty. Photoperiod start cannot be typed. |
| **IN-P1-2** | Climate/Light `TargetNumber` uses entity min/max or **0–100**. VPD unlabeled; 100 °C / 100 kPa / 100 h accepted then written on blur. |
| **IN-P1-3** | Catalog empty-state lie on first paint; Research search unlabeled; placeholder jargon; empty browse not cultivar-filtered. |
| **IN-P1-4** | Calibrate light height/LUX/PAR have no max; 999999 is valid until Save (LUX-only). |
| **IN-P1-5** | Save settings patches AP + Ollama + CannaLib with no confirm (Apply network does confirm). |

### P2

- Sunrise/sunset step 0.1 for minutes.
- No maxLength on nicknames / recipe / assignment text.
- No duplicate-strain or empty-nickname check before Commit (button path, not typed).
- Mix remainder slider has no numeric twin.
- `VesselSelect` unused; vessel is chips only.
- File input uses native chrome (acceptable) but imports immediately.
- No radio inputs in the SPA.

---

## Safety log

| Action | Result |
|---|---|
| Catalog search `Northern Lights` | 1 hit; not picked |
| Catalog search `<script>…` | 0 hits; drawer dismissed |
| Settings SSID typed then restored | `DSC-Brain` |
| Settings Max % 999 / 0 / empty | native validity only; left empty |
| Calibrate height 999999 / −1 / empty | restored to 45 |
| Calibrate LUX/PAR overflow | restored empty |
| Commit / Apply network / Save settings / Save cal / Start session / demand / In service | **not fired** |
| Roster / overlay sprout | inspected empty on P1; Compose sprout left `2026-07-09` |

---

## Distinct from sibling 7.1 audits

This file owns **form fields**. Do not treat it as the clickable census (INTERACTIVE), Settings completeness (SETTINGS), workflow jobs (WORKFLOW), device/fleet (DEVICE), or relationship graph (RELATIONSHIP). Overlaps are cross-referenced, not rewritten.

## Files inspected (read-only)

`ComposePlant.tsx`, `CatalogPicker.tsx`, `catalog.ts`, `CoupledMix.tsx`, `TentTargets.tsx`, `LearningWizard.tsx`, `CalibratePage.tsx`, `SettingsPage.tsx`, `GrowPages.tsx`, `ClimatePage.tsx`, `LightPage.tsx`, `LivePages.tsx`, `TuneFleetPages.tsx`, `CatalogResearch.tsx`, `CropScheduler.tsx`, `SeatOverlay.tsx`, `VesselGlyph.tsx`, `ui.tsx`, `useFleetActions.ts`, `fleetApi.ts`, `dsc.css`, `App.tsx`, `dsc_v4_device_cal.yaml`.
