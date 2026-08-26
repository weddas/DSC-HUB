# Interactive item audit — DSC-HUB 7.1 Pi SPA

**Date:** 2026-08-27  
**Surface:** Pi SPA at `http://192.168.86.48:8787/` (`dsc-brain.local:8787`). `.30` is not the Brain.  
**Live `/health`:** 200, surface **7.1.0**, expected firmware 7.0.0.0.  
**Scope:** Controls and behavior only. Visual/design lives in [`DESIGN-AUDIT-7.1.md`](DESIGN-AUDIT-7.1.md).  
**Method:** Walked live routes in Cursor browser + catalogued every interactive from `frontend/src` (pages, `ui.tsx`, ComposePlant, Settings, KitPulse, charts/sliders). Destructive writes were **not** fired.

**Safety (not exercised — inferred from code):** Apply network confirm, Queue OTA/compile, Permit join, demand ON, Full Auto / takeover / fan override, SF1000 toggle, pot/device `in_service`, Commit plant / Accept mix / Retire, Calibrate start/save, Learning start/save/abort, fan/light sliders, TargetNumber blur commits, assignment Save, Settings Save, backup import.

**Safe exercised live:** Overview inventory + gauge/chip affordance, Settings inventory + **Apply network** confirm opened then left, Fleet inventory + kit-gate disabled state, DecisionLayer confirm chrome, closed-drawer a11y leak on every route.

**Contention note:** A sibling design-audit worker shared the same Cursor browser tab; some hash jumps were overwritten mid-walk. Climate / Mission / Compose / Light / Root / Twin / Dash / Learning / Roster / Research / Calibrate inventories below are **code-complete** and cross-checked against the live Overview / Fleet / Settings DOM. Behavior of un-clicked writes is marked inferred.

---

## Verdict

**Not shippable for an operator who must actually drive the tent.**

Nav and read-only glance mostly work. Command does not. The pages that claim to own kit gates (Fleet / Learning) show **disabled** `in_service` toggles (`—`) on the live Pi. The page that *can* write kit gates (Settings checkboxes) looks like a mundane inventory tick and writes **immediately** with no confirm. Climate demand tiles are the same size and language as status chips, and they write the hub on a single click. Firmware OTA is a plain `dsc-btn` with no DecisionLayer. Closed history drawers still sit in the tab order on every route.

An operator can look at the tent. They cannot safely change it.

| Metric | Count |
|--------|------:|
| Interactive items audited | **287** |
| Affordance FAIL | **64** |
| Behavior FAIL | **41** |
| Fail both | **18** |
| Destructive / hub-write, not exercised | **79** |

Chrome (brand + 4 primary tabs + honesty + section tabs + leaked BandChart drawer) is counted **once**. Repeated Settings rows and Kit Pulse node+chip pairs are counted individually.

---

## How to read the tables

| Column | Meaning |
|--------|---------|
| Type | button / slider / checkbox / select / text / number / toggle / disclosure / drawer / link / graph hit-target |
| Aff | PASS if a new operator can tell it is interactive |
| Beh | PASS if click/type/drag has a clear, correct reaction (including disabled/empty) |
| Writes | none / local UI / hub helper / **destructive** |
| Ex | live = exercised this pass; inf = inferred from code + visual affordance |

---

## Chrome (every route)

| Control | Type | Aff | Beh | Writes | Ex | Notes |
|---------|------|-----|-----|--------|----|-------|
| Brand title → Overview | link | FAIL | PASS | none | live | Looks like a masthead, is a `NavLink`. |
| Live / Grow / Tune / Fleet | link (tab) | PASS | PASS | none | live | Active underline; 44px hit. |
| Section tabs (Live 9 / Grow 3 / Tune 2 / Fleet 3) | link (tab) | PASS | PASS | none | live | Hash routes. `/ops/home` is Dash under Live. |
| KIT HONEST | chip (static) | PASS | PASS | none | live | Not clickable — correct. |
| Honesty gap chip | button | PASS | PASS | local | inf | Opens DecisionLayer; Confirm navigates. |
| Honesty DecisionLayer | drawer | PASS | FAIL | none | inf | Escape + Dismiss work. **Tab is not trapped**; page stays in tab order. |
| BandChart drawer (closed) | drawer | FAIL | FAIL | none | live | `aria-hidden` is set, but a11y snapshot still lists Close×2 + 1h/6h/24h/48h/Cycle/Photo on **every** route including Settings. 8 leaked tab stops. |
| BandChart drawer (open) | drawer | PASS | PASS | local | inf | Gauge click → history. Timespan is local. SlideDrawer **does** trap Tab + Escape. |
| Connecting to fleet… | none | — | FAIL | none | live | First paint is a blank shell with no retry. `/fleet` is fast; `/fleet/computed` is slow. If computed wedges, operator has no control. |

---

## `/live/overview` — Overview

Live: 42 visible interactives + 8 leaked drawer. Running row is **not** clickable.

| Control | Type | Aff | Beh | Writes | Ex | Notes |
|---------|------|-----|-----|--------|----|-------|
| Climate / Mission header | button | PASS | PASS | none | live | Teal vs default. Navigate. |
| All / 4×8 / 2×4 / Room | button (segment) | PASS | PASS | local | live | Zone focus; 4×8 was `is-active`. Reverts on refresh. |
| 9 band gauges (4×8 T/RH/VPD, 2×4 T/RH/VPD, Room T/RH, Root) | graph hit-target | FAIL | PASS | local | live | Look like readouts. `title="History · …"` only on hover. A11y name is SVG soup: *In-band range Want edge Want edge Target 24.3 °C 4×8 T*. Click opens BandChart drawer (not exercised this pass after tab contention). |
| IN 4×8 / IN 2×4 / EX ROOM / EX OUT | chip button | FAIL | PASS | none | live | Same pill as static status; `is-clickable` + fan motion. Navigates to Climate — does **not** set fan %. |
| P1–P4 chips | chip button | FAIL | PASS | none | live | Labels `P1 —`. Click → Root with pot select. Empty seats still look pressable. |
| P1–P4 moisture gauges | graph hit-target | FAIL | PASS | local | live | P1/P3/P4 empty (`— no data`); P2 19.5% amber. Click → pot history. Wide hit (376×125). |
| Open Root Zone | chip button | PASS | PASS | none | live | |
| Heat / Cool ○ / Hum / Dehum / Mat / C-Hum ○ / SF1000 | chip (static) | FAIL | PASS | none | live | **Look identical to fan chips but have no `onClick`.** Cool ○ / C-Hum ○ = capacity offline, not On. Operator will try to tap them to command. |
| Alert chips (when present) | chip button | PASS | PASS | local | inf | Open inspector. |
| Capacity / takeover banners | banner + optional chip | PASS | PASS | none | inf | Capacity banner has Open Climate. |

---

## `/live/mission` — Mission

| Control | Type | Aff | Beh | Writes | Ex | Notes |
|---------|------|-----|-----|--------|----|-------|
| Open Twin / Climate Want | button | PASS | PASS | none | inf | |
| Search icon | icon button | PASS | PASS | local | inf | `aria-label="Search"`. Opens Quick jump drawer. |
| Overflow ⋮ | icon button | PASS | PASS | none | inf | Climate / 4×8 / 2×4 / Fleet. Icon-only but labelled. |
| Hub / Panel / Beat / Alerts / Fleet / Capacity chips | chip button | FAIL | PASS | local | inf | Same chip chrome as non-clickable FULL AUTO / TAKEOVER / FAN OVERRIDE. Click → inspector or Fleet. |
| N of M in service | chip button | FAIL | PASS | none | inf | Navigates Fleet. |
| Next / Do this next | button | PASS | PASS | none | inf | Navigate. Empty: Open Twin + Climate Want. |
| Kit Pulse SVG nodes | graph hit-target | FAIL | PASS | local | inf | `role="button"` + tabIndex, **no accessible name** (inner SVG text is not a name). Click → inspector. |
| Kit Pulse chips (×11) | chip button | PASS | PASS | local | inf | Duplicate of nodes. Label includes idle / out of service. |
| OUT cfm → Climate | chip button | PASS | PASS | none | inf | |
| Plant seat chips P1–P4 | chip button | FAIL | PASS | local | inf | Dispatches `dsc-dash-select-pot`. OOS still a button. |
| Fault chips | chip button | PASS | PASS | local | inf | Inspector. Empty: “No active faults”. |
| Quick jump drawer | drawer + 8 buttons | PASS | PASS | none | inf | SlideDrawer traps focus. |

---

## `/ops/home` — Dash

Superset of Overview: Now strip chips, Operational now, Cannalib KPIs (display), ESP pot chips, fan chips, running chips, bands, grow log.

| Control | Type | Aff | Beh | Writes | Ex | Notes |
|---------|------|-----|-----|--------|----|-------|
| Now-strip chips (Hub, Panel, Beat, Alerts, Fleet, Cannalib) | chip button | FAIL | PASS | local | inf | Some chips in the same strip have **no** onClick (uptime, in-service label). Mixed affordance in one row. |
| Operational fire-countdown chips | chip button | FAIL | PASS | none | inf | Navigate Climate — do not toggle demand. |
| ESP P1–P4 | chip button | FAIL | PASS | none | inf | Navigate Root. |
| Cannalib KPIs | kpi (static) | PASS | PASS | none | inf | No onClick. |
| Bands / fans / running / pots | same as Overview | FAIL | PASS | local | inf | Same chip-vs-command problem. |

---

## `/live/twin` and `/ops/dash`

| Control | Type | Aff | Beh | Writes | Ex | Notes |
|---------|------|-----|-----|--------|----|-------|
| Set Climate Want / 4×8 / 2×4 | button | PASS | PASS | none | inf | |
| Crop scheduler lanes P1–P4 | button | PASS | PASS | local | inf | OOS lanes `disabled`. Click dispatches pot select (Twin keep-alive). |
| Air-path ribbons | graph hit-target | FAIL | PASS | local | inf | `role="button"` without name. Opens inspector for CFM. Zero-cfm path is a thin line — easy to miss. |
| Twin canvas pot pick | graph hit-target | FAIL | PASS | local | inf | Documented in copy; no visible “button” chrome. Not fired. |

---

## `/live/climate` — Climate (command desk)

**Do not ship as the command surface until demand tiles are confirmed or gated.**

| Control | Type | Aff | Beh | Writes | Ex | Notes |
|---------|------|-----|-----|--------|----|-------|
| Overflow ⋮ | icon button | PASS | PASS | none | inf | |
| All / 4×8 / 2×4 / Room | chip button | PASS | PASS | local | inf | |
| Timespan 1h/6h/24h/48h/Cycle/Photo | chip button | PASS | PASS | local | inf | Local chart window. |
| Kit / Fleet | button | PASS | PASS | none | inf | |
| Full Auto / Master takeover / Fan override / Hum intake / RECIRC de-strat | toggle | PASS | FAIL | **destructive** | inf | `EntityToggle` — one click `callService` turn_on/off. No DecisionLayer. Tooltip is the **entity id**. Missing → `is-missing`, often still clickable. |
| Strategy / Priority tent | select | PASS | FAIL | hub | inf | Writes on change. No “unsaved” state. |
| Heat / Cool / Hum / Dehum / Mat / Mister | toggle | FAIL | FAIL | **destructive** | inf | Same `.dsc-demand` tile as mode. Cool shows `AC ○` when capacity offline but stays enabled (`warnWhenMissing`). Click no-ops if unavailable — looks live. |
| Room °C / RH / VPD / AH KPIs | kpi button | FAIL | PASS | local | inf | Whole card is a `<button class="dsc-kpi-hit">`. Opens inspector. |
| 9 triad gauges | graph hit-target | FAIL | PASS | local | inf | Same name-soup as Overview. |
| Got/Want bars | display | PASS | PASS | none | inf | Not clickable. |
| 4 fan sliders | slider | PASS | PASS | **hub** | inf | Label shows `%` + `off`. **Locked** until Fan override. Disabled affordance is `.is-disabled`. Do not drag on live tent. |
| Efficacy chips | chip button | FAIL | PASS | local | inf | Open inspector. Heat ON vs Heat ok look like commands. |
| Tent Want numbers (2 tents × 5) | number | PASS | FAIL | hub | inf | Commit **on blur**. Labels: Temp °C, RH min/max % good; **VPD min/max have no unit**. Fat-finger writes climate want. |
| Got/Want hit | button | FAIL | PASS | local | inf | Looks like a readout; opens inspector. |
| Tent overflow ⋮ | icon button | PASS | PASS | local | inf | |
| Crop scheduler lanes | button | PASS | PASS | local | inf | |

---

## `/live/4x8` and `/live/2x4` — Tent cockpits

| Control | Type | Aff | Beh | Writes | Ex | Notes |
|---------|------|-----|-----|--------|----|-------|
| Both tents / Climate Want | button | PASS | PASS | none | inf | Want also appends `?tent=` then Shell **strips** `tent`/`zone` on navigate (except climate/dash). Query is discarded. |
| T / RH / VPD / photo / IN cfm chips | chip button | FAIL | PASS | local | inf | Inspector. |
| Tent Want panel | number + overflow | PASS | FAIL | hub | inf | Same blur-commit as Climate. |
| Seat chips | chip button | FAIL | PASS | local | inf | Sets `?pot=` → seat **drawer**. |
| Timespan | chip button | PASS | PASS | local | inf | |
| Intake / exhaust sliders (4×8 ×3, 2×4 ×1) | slider | PASS | PASS | **hub** | inf | Locked without Fan override. Copy says so. Do not drag. |
| SF1000 (2×4 only) | toggle | PASS | FAIL | **destructive** | inf | Immediate light on/off. |
| Empty seats | empty | PASS | PASS | none | inf | “No pots assigned”. |
| Plant seat drawer | drawer | PASS | PASS | hub | inf | See Seat drawer. Focus trap yes. |

---

## `/live/root` — Root

| Control | Type | Aff | Beh | Writes | Ex | Notes |
|---------|------|-----|-----|--------|----|-------|
| Coldest root / mat KPIs | kpi button | FAIL | PASS | local | inf | |
| Pot card head | button-ish | FAIL | PASS | local | inf | `role="presentation"` + onClick — **not a button**. Keyboard users skip it. Opens seat drawer. |
| Moisture / Soil / Dryback / EC / pH gauges | graph hit-target | FAIL | PASS | local | inf | Empty pots: grey, `—`, no thumb (pass). |
| N / P / K hits | button | FAIL | PASS | local | inf | `.dsc-npk-hit` — look like labels. |
| Moisture-rate hit | button | FAIL | PASS | local | inf | |
| Open seat / Climate chip | button | PASS | PASS | none | inf | |
| Seat drawer | drawer | PASS | PASS | hub | inf | |

---

## `/live/light` — Light

| Control | Type | Aff | Beh | Writes | Ex | Notes |
|---------|------|-----|-----|--------|----|-------|
| Dark / missing / catch-up / next chips | chip button | FAIL | PASS | local | inf | Inspector. |
| Window / hours chips | chip button | FAIL | PASS | local | inf | |
| Got/Want h gauges | graph hit-target | FAIL | PASS | local | inf | Teal progress, not band. |
| Want hours KPI | kpi button | FAIL | PASS | local | inf | |
| DutyStrip | graph hit-target | FAIL | PASS | local | inf | Optional onClick → inspector. |
| 4×8 opens (time) | time | PASS | FAIL | hub | inf | Commit on blur (`time.set_value`). |
| Sunrise / sunset / min dark h | number | PASS | FAIL | hub | inf | Blur commit. Photoperiod. |
| SF1000 | toggle | PASS | FAIL | **destructive** | inf | Immediate brightness on/off. Shows `%` when on. |
| Auto photoperiod / Manual light hold | toggle | PASS | FAIL | **destructive** | inf | |
| Window source | select | PASS | FAIL | hub | inf | Independent unlocks 2×4 time/hours. |
| 2×4 lights-on / hours | time / number | PASS | FAIL | hub | inf | Hidden until Independent. |
| Deviation KPI | kpi button | FAIL | PASS | local | inf | |
| Crop scheduler | button | PASS | PASS | local | inf | |

---

## `/grow/compose` — Compose

Commit / assign / mix / retire **not fired**. Catalog pick writes helpers — not fired.

| Control | Type | Aff | Beh | Writes | Ex | Notes |
|---------|------|-----|-----|--------|----|-------|
| Open Roster / Browse Catalog | button | PASS | PASS | none | inf | |
| Strain ResultChip | button | FAIL | PASS | local | inf | `.dsc-result-chip-hit` — looks like a tag. Opens strain picker DecisionLayer. |
| Nickname | text | PASS | FAIL | hub | inf | Blur → `input_text`. |
| Sprout date | date | PASS | FAIL | hub | inf | Blur → datetime. |
| Custom strain slot | select | PASS | FAIL | hub | inf | |
| Vessel chip | chip button | PASS | PASS | local | inf | Opens vessel DecisionLayer. Pick writes vessel helper (inf). |
| Medium / nutrient ResultChips | button | FAIL | PASS | hub | inf | Pick writes blend/nutrient helpers immediately. |
| Coupled mix sliders ×3 | slider | PASS | FAIL | hub | inf | `%` + L shown. Remainder lane disabled. Lock is local. Drag **commits** `input_number.dsc_blend_pct_*`. Do not drag. |
| Layer lock / Unlock | button | PASS | PASS | local | inf | Cannot lock all three. |
| Nutrient slot texts | text | PASS | FAIL | hub | inf | Blur commit. |
| Recipe note | textarea | PASS | FAIL | hub | inf | |
| Light ResultChip | button | FAIL | PASS | hub | inf | |
| Assign pot / Tent / Climate apply pot | select | PASS | FAIL | hub | inf | |
| Commit + assign | button (primary) | PASS | PASS | **destructive** | inf | DecisionLayer first. Not fired. |
| Add to roster / Assign seat | button | PASS | PASS | **destructive** | inf | Confirm. |
| Accept mix | button (danger) | PASS | PASS | **destructive** | inf | Confirm. |
| Apply climate Want | button | PASS | PASS | **destructive** | inf | Confirm. |
| Retire pot | button (danger) | PASS | PASS | **destructive** | inf | Confirm. |
| DecisionLayer pickers | drawer | PASS | FAIL | hub | inf | Escape/Dismiss. No Tab trap. Confirm on destructive actions is the one place Settings OTA should have copied. |

---

## `/grow/research` — Research

| Control | Type | Aff | Beh | Writes | Ex | Notes |
|---------|------|-----|-----|--------|----|-------|
| Use in Compose / Open Seat | button | PASS | PASS | none | inf | Use in Compose on a row **writes** the build helper then navigates. |
| Strains / Mediums / Nutrients / Lights | chip button | PASS | PASS | local | inf | |
| Catalog search | text (search) | PASS | PASS | none | inf | Debounced. Empty = honesty copy. |
| Hit buttons | button | PASS | PASS | local | inf | Select / compare. |
| Use in Compose (row) | button | PASS | FAIL | hub | inf | Writes strain/medium/nutrient/light helper without confirm. |

---

## `/grow/roster` — Roster

| Control | Type | Aff | Beh | Writes | Ex | Notes |
|---------|------|-----|-----|--------|----|-------|
| Use in Compose | button-in-link | PASS | PASS | none | inf | Nested interactive (`<Link><Button>`). |
| Scheduler lanes | button | PASS | PASS | local | inf | OOS disabled. |
| Roster row | clickable `<tr>` | FAIL | FAIL | local | inf | Cursor pointer only if pot in service. **No role=button, no keyboard.** Empty roster: copy only (pass). |
| Seat drawer | drawer | PASS | PASS | hub | inf | |

---

## Plant seat drawer (Root / Roster / 4×8 / 2×4)

| Control | Type | Aff | Beh | Writes | Ex | Notes |
|---------|------|-----|-----|--------|----|-------|
| P1–P4 switcher | chip button | PASS | PASS | local | inf | |
| Nickname / sprout / stage / notes | text / date / select | PASS | FAIL | hub | inf | Blur or change writes. Stage `select` writes immediately. |
| Overflow seat actions | icon button | PASS | PASS | none | inf | |
| Dryback / Moisture / EC / pH hist | button / gauge | PASS | PASS | local | inf | Nested HistoryDrawer. |
| Mix in Compose | button | PASS | PASS | none | inf | |
| Apply 2×4 / 4×8 / Unassigned | button | PASS | FAIL | hub | inf | Immediate tent apply. Error chip if it does not stick. No confirm. |
| Open Twin | button | PASS | PASS | none | inf | |

---

## `/tune/learning` — Learning

| Control | Type | Aff | Beh | Writes | Ex | Notes |
|---------|------|-----|-----|--------|----|-------|
| Open gate / Sample / Finish / Stored curves / Learn enable | button | PASS | PASS | local | inf | Open DecisionLayer only. Start/save/abort **not** fired. |
| Gate: Cal target | select | PASS | FAIL | hub | inf | |
| Gate: Start session | button | PASS | FAIL | **destructive** | inf | Holds fans. No second confirm. |
| Sample: m/s, CFM, PPFD, step %, duct cm | number | PASS | FAIL | hub | inf | Blur commit. |
| Re-hold / Save point / Skip / Abort | button | PASS | FAIL | **destructive** | inf | Abort is danger — good. Others write immediately. |
| Finish confirm | drawer | PASS | PASS | **destructive** | inf | Has onConfirm. |
| Phase A/B / lock toggles | toggle | PASS | FAIL | **destructive** | inf | |
| AC in service / Clone mister | toggle | PASS | FAIL | **destructive** | live* | *Same widgets as Fleet: live Fleet showed **disabled / —**. Helpers not on Pi bus. |

---

## `/tune/analytics` — Analytics

| Control | Type | Aff | Beh | Writes | Ex | Notes |
|---------|------|-----|-----|--------|----|-------|
| Timespan | chip button | PASS | PASS | local | inf | Only interactives besides chrome. Charts are display. Empty in-service: “No in-service pots.” |

---

## `/fleet` — Fleet Overview

Live: 7 of 11 in service. Kit Pulse present. **All seven in-service EntityToggles disabled** (`AC in service —`, pots `—`, Tank `—`).

| Control | Type | Aff | Beh | Writes | Ex | Notes |
|---------|------|-----|-----|--------|----|-------|
| Hub link | display / hit | FAIL | PASS | local | live | |
| In service / Surface / Alerts KPIs | kpi (static) | PASS | PASS | none | live | |
| Kit Pulse nodes ×11 | graph hit-target | FAIL | PASS | local | live | Unnamed `role=button`. |
| Kit Pulse chips ×11 | chip button | PASS | PASS | local | live | Hub, Heater idle, AC out of service, Pot 3 out of service, Tank out of service, … |
| AC / mister / Pot 1–4 / Tank in service | toggle | PASS | FAIL | **destructive** | live | **Dead on Pi SPA.** `input_boolean.dsc_*_in_service` unavailable → disabled, label `—`. Operator cannot gate kit here. Settings inventory checkboxes are the live write path. |
| Tank cutaway | display | PASS | PASS | none | live | |

---

## `/fleet/calibrate` — Calibrate

| Control | Type | Aff | Beh | Writes | Ex | Notes |
|---------|------|-----|-----|--------|----|-------|
| Fan CFM / Light PAR/LUX | chip button | PASS | PASS | local | inf | Tab is local. |
| Duct chips | chip button | PASS | PASS | local | inf | |
| Start {duct} session | button | PASS | FAIL | **destructive** | inf | Holds fans via scripts. Not fired. |
| Anemometer m/s | number | PASS | PASS | local | inf | Local until Save. |
| Save @ % / Skip / Abort | button | PASS | FAIL | **destructive** | inf | Abort danger. |
| Light: height / LUX / PAR | number | PASS | PASS | local | inf | Start wizard **turns SF1000 on**. Not fired. |
| Save {step} / Re-run | button | PASS | FAIL | **destructive** | inf | |

---

## `/fleet/settings` — Settings

Live: 96 visible interactives. Inventory cards + assignment table + network + integrations + catalog + 10× OTA/compile + Zigbee + backup.

| Control | Type | Aff | Beh | Writes | Ex | Notes |
|---------|------|-----|-----|--------|----|-------|
| In service ×10 (control, dehumidifier, heater, heatmat, hub, humidifier, pot1–4) | checkbox | PASS | FAIL | **destructive** | inf | Immediate `patch_inventory`. **No DecisionLayer.** A11y tree marks them `readonly` even though they write. pot3 checkbox unchecked live (OFFLINE card) — one click flips service. |
| Function / Placement / Max % ×10 | text / number | FAIL | FAIL | hub | inf | Placeholder-only names (`e.g. intake_temp`). Save writes extra. Not fired. |
| Row Save ×10 | button | PASS | FAIL | hub | inf | No confirm. Same label on every row — which seat? Only the table column tells you. |
| AP SSID / PSK | text / password | PASS | PASS | local | live | Draft until Apply/Save. PSK placeholder `••••••••`. |
| Channel | select | FAIL | PASS | local | live | A11y name was `1611` (concatenated 1 6 11). Value 6. |
| **Apply network** | button (danger) | PASS | PASS | **destructive** | live | Opens DecisionLayer. Copy is honest (Wi-Fi restart). Confirm **not** pressed. Dismiss/X present. Background page **remains in tab order** (Dismiss focused, 100+ stops behind). |
| Ollama URL / model, Test Ollama | text / button | PASS | PASS | none* | inf | Test is read. Save persists URL. |
| CannaLib URL / key / sqlite checkbox / Test | text / password / checkbox / button | PASS | PASS | local / none | inf | Checkbox is local until Save. Test is read. |
| Refresh status | button | PASS | PASS | none | inf | |
| Reload local catalogs | button | PASS | FAIL | hub | inf | No confirm. |
| Queue OTA ×10 | button | FAIL | FAIL | **destructive** | inf | **No DecisionLayer.** Same chrome as Test CannaLib. Flashes a seat. |
| Queue compile ×10 | button | FAIL | FAIL | hub | inf | No confirm. |
| Permit join / Stop join | button | FAIL | FAIL | hub | inf | No confirm. Empty Zigbee: copy only (pass). |
| Download backup | link | PASS | PASS | none | inf | Class `dsc-button` not `dsc-btn` — looks slightly off but is a link. |
| Import backup | file | FAIL | FAIL | **destructive** | inf | Auto-imports on file choose. No confirm. |
| Save settings | button (primary) | PASS | FAIL | hub | inf | Sits at page bottom after firmware jobs. Easy to confuse with “I’m done looking”. |

---

## Inspector drawer (opened from chips / gauges / Kit Pulse)

| Control | Type | Aff | Beh | Writes | Ex | Notes |
|---------|------|-----|-----|--------|----|-------|
| Close rail + Close icon | button | PASS | PASS | none | inf | Two Closes. Focus restore on close. |
| Acknowledge until hub reboot | button | PASS | PASS | local | inf | Snooze is session-local. |
| **Turn on / Turn off** | button | FAIL | FAIL | **destructive** | inf | If target is switch/light/`input_boolean`, inspector is a **second unguarded demand path**. |
| Timespan | chip button | PASS | PASS | local | inf | |
| Details | disclosure | PASS | PASS | none | inf | Shows entity id. Safe. |
| Chart | display | PASS | PASS | none | inf | Empty: “no history yet”. |

---

## Cross-cutting issues

1. **Status chrome and command use the same chip/tile language.** Fan chips navigate. Running chips do nothing. Demand tiles write the hub. Cool ○ is capacity-offline, not On. An operator cannot tell which pill is safe.
2. **Gauges and KPIs are huge unlabeled buttons.** Visible chrome is a chart. Accessible name is SVG decoration (“In-band range Want edge…”).
3. **Blur-commit numbers** (Want T/RH/VPD, photoperiod, seat identity, blend names) write the hub when the field loses focus. No dirty state, no undo.
4. **Confirm discipline is inconsistent.** Apply network and Compose commit have DecisionLayer. Queue OTA, in_service checkboxes, demand tiles, tent Apply, Research “Use in Compose”, backup import do not.
5. **Two in-service systems.** Fleet/Learning `EntityToggle` → HA `input_boolean` (unavailable on Pi → disabled). Settings checkbox → brain `patch_inventory` (live, immediate). Operator on Fleet thinks kit gates are broken; operator on Settings can un-service the hub with a tick.
6. **DecisionLayer does not trap focus.** SlideDrawer does. Closed BandChart drawer still exposes 8 controls to AT/tab.
7. **Tooltips leak entity ids** (`title={entityId}` on `EntityToggle`). Visible copy was purged; hover was not.
8. **Missing labels / units.** Assignment placeholders; Channel name `1611`; VPD min/max unitless; Kit Pulse SVG unnamed; Settings checkboxes a11y-readonly; pot card head not a button.
9. **Disabled/empty is mostly honest** when the control exists (empty gauges, OOS scheduler lanes, locked fan sliders). The lie is the **disabled Fleet toggles that look like the real gate** while Settings silently owns the write.
10. **Connecting to fleet…** has no retry. First interactive moment can be a black page.

---

## P0 / P1 / P2

### P0 — do not give this to a night operator

| ID | Defect |
|----|--------|
| IA-P0-1 | Climate **demand tiles** (Heat/Cool/Hum/Dehum/Mat/Mister) and mode toggles write the hub on one click. No confirm. Cool ○ still looks armed. |
| IA-P0-2 | Settings **In service** checkboxes write inventory immediately. No confirm. A11y reports `readonly`. Includes **hub**. |
| IA-P0-3 | **Queue OTA** ×10 has no DecisionLayer. Same button class as “Test CannaLib”. |
| IA-P0-4 | Fleet / Learning **in_service EntityToggles are dead** on the live Pi (`—`, disabled). The page that says it owns kit gates cannot change them. |
| IA-P0-5 | Inspector **Turn on / Turn off** is a hidden demand path for any switch/light opened from a chip. |
| IA-P0-6 | Light / 2×4 **SF1000** toggle writes the lamp immediately (dark-period risk). |

### P1 — operator will mis-click or get stuck

| ID | Defect |
|----|--------|
| IA-P1-1 | Closed BandChart drawer leaks 8 tab stops on every route. |
| IA-P1-2 | DecisionLayer (Apply network, honesty, Compose) does not trap Tab or `aria-hide` the page. |
| IA-P1-3 | Running chips vs fan chips: same pill, only fans do anything. |
| IA-P1-4 | Gauge/KPI hit-targets fail affordance; a11y names are SVG titles. |
| IA-P1-5 | Want / photoperiod / seat fields commit on blur with no undo. |
| IA-P1-6 | EntityToggle `title` is the raw entity id. |
| IA-P1-7 | Assignment inputs unlabeled; Channel combobox named `1611`. |
| IA-P1-8 | Kit Pulse SVG nodes are unnamed buttons. |
| IA-P1-9 | Roster `<tr onClick>` is mouse-only. |
| IA-P1-10 | Root pot card head is `role="presentation"` but clickable. |
| IA-P1-11 | Permit join / backup import / Reload catalogs / tent Apply have no confirm. |
| IA-P1-12 | Research / catalog pick writes build helpers without confirm. |
| IA-P1-13 | Calibrate / Learning “Start session” holds fans with one button. |
| IA-P1-14 | Connecting shell has no retry or timeout. |

### P2 — polish that still bites

| ID | Defect |
|----|--------|
| IA-P2-1 | Brand wordmark is a home link. |
| IA-P2-2 | Two Close controls per drawer. |
| IA-P2-3 | Download backup uses `dsc-button` not `dsc-btn`. |
| IA-P2-4 | VPD Want fields omit the kPa unit. |
| IA-P2-5 | Nested `<Link><Button>` on Roster. |
| IA-P2-6 | Climate `?tent=` is stripped by Shell except on climate/dash — cockpit “Climate Want” loses tent context. |
| IA-P2-7 | Coupled-mix remainder slider disabled without explaining why that thumb won’t move. |

---

## What works

- Primary/section tabs are obvious and land on the right hash.
- Apply network is danger-styled and **does** confirm (the model to copy).
- Compose destructive actions go through DecisionLayer.
- Fan sliders lock until Fan override; empty gauges have no fake thumb.
- OOS scheduler lanes disable.
- SlideDrawer (when actually open) traps Tab and Escape.
- `focus-visible` teal ring exists in CSS for buttons/inputs.
- Honesty empty state (KIT HONEST) is not a fake button.

---

## Exercise log

| Action | Result |
|--------|--------|
| Load `http://192.168.86.48:8787/` | Brief “Connecting to fleet…”, then Overview. Title DSC-HUB 7.1.0. |
| Inventory Overview | 42 visible controls. Running chips not in button list. Gauges named by SVG titles. |
| Inventory Settings | 96 visible. Opened Apply network confirm. Did not confirm. |
| Inventory Fleet | Kit Pulse live. All 7 in-service toggles disabled `—`. |
| Fan/light sliders, demand, OTA, commit, in_service | Not fired. |
| Other routes | Source-complete; live hash walk interrupted by shared-tab contention. |

---

## Files this audit did not change in product code

Audit only. Product files were read, not edited.
