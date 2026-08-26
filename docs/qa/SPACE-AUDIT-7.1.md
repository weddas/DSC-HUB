# Space / density audit — DSC-HUB 7.1 Pi SPA

**Date:** 2026-08-27  
**Brain:** `http://192.168.86.48:8787/` (`dsc-brain.local` A **192.168.86.48**) · surface **7.1.0**  
**Not:** `192.168.86.30` (different MAC; not the Brain)  
**Question:** Does the first viewport earn its pixels? Can the operator **act** on daily pages without scrolling?  
**Owns:** density and priority — wasted chrome, above-the-fold usefulness, empty / skinny cards, scroll-to-act, buried controls, duplicate headers, padding vs content.  
**Does not own:** overflow, overlap, alignment — that is LAYOUT-AUDIT.

**Method:** Playwright Chrome, first-viewport screenshots at **1280×720** and **390×844**. Hash routes opened on a **fresh page** each time (`Page.goto` hash-jump blanks `#root` — same CDP artifact as FOLLOWUPS 7.1.2). No clicks on demand, Apply network, In service, Commit, or pot3. Metrics: [`screens-7.1.2/space-audit-metrics.json`](screens-7.1.2/space-audit-metrics.json).

**Safety this pass:** pot3 not put in service. No plant commit. No Apply network. No demand fire.

---

## Sibling audits (cite, do not rewrite)

| Doc | Question | This audit |
|-----|----------|------------|
| [`LAYOUT-AUDIT-7.1.md`](LAYOUT-AUDIT-7.1.md) (e85fb105) | Overflow / overlap / alignment | **Not in the workspace** at write time. Not rewritten. |
| [`DESIGN-AUDIT-7.1.md`](DESIGN-AUDIT-7.1.md) | Theme, tokens, copy, gauge color | Visual language only. |
| [`UX-AUDIT-7.1.md`](UX-AUDIT-7.1.md) | First-run mental model | **UX-P0-1** (nine Live tabs / three homes) is the IA reason the chrome is tall. We score the **pixel cost**. |
| [`INTERACTIVE-AUDIT-7.1.md`](INTERACTIVE-AUDIT-7.1.md) | Control behavior / confirms | Climate Command tiles are visible at 1280 — they are also unguarded (**IA-P0-1**). Density ≠ safety. |

---

## Executive verdict

**An operator cannot complete a daily act without scrolling** on Overview, Compose, Settings, or Fleet, at either viewport. Climate at 1280 is the only daily page where a control cluster (Command / demand) is fully on the first fold — and that cluster is the dangerous one.

Shared chrome is a **199 px** stack at 1280 (brand 36 + honesty 30 + primary 47 + secondary 42, plus 16 px shell pad) **before** the page header. Page title + subtitle add another **63 px**. Content starts at **y=278 (39% of 720)**. On 390, the same stack is 201 px, but the page header wraps: content starts **y=280–406 (33–48% of 844)**.

Worst waste is not padding inside a card. It is **TwinKeepAlive mounted above `<Routes>`** on Twin / 4×8 / 2×4: a `min(70vh, 720px)` canvas pushes the page header to **y=940–1005**. The first fold is a 3D hero with no cockpit, no fans, no seats.

---

## Shared chrome (every route)

Source: `App.tsx` `Shell` + `dsc.css` `.dsc-shell` / `.dsc-brand-row` / `.dsc-primary-tabs` / `.dsc-secondary-tabs` / `.dsc-page-header`.

```
16 pad
36 brand  ("DSC - A Plausible Deniability Project." + SURFACE 7.1.0)
10 gap
30 honesty rail (KIT HONEST)
10 gap
47 Live | Grow | Tune | Fleet
 8 gap
42 Overview Mission Dash Twin Climate 4×8 2×4 Root Light   (or Grow/Tune/Fleet subset)
16 gap
63 page header (icon + H1 + essay subtitle + duplicate CTAs)
——
278 px to first card @ 1280×720
```

| Layer | Job | Density verdict |
|-------|-----|-----------------|
| Brand tagline | Joke wordmark | **Waste.** Operator needs Brain/hub, not a 52-char title. Cross-ref **UX-P1-1**. |
| SURFACE 7.1.0 | Version | Repeated on Fleet KPI, Hub Link chips, Settings subtitle. |
| KIT HONEST | Sensor-gap chip | Fine when empty; still a full row for one pill. |
| Primary tabs | Section switch | Necessary. 44 px min-height is touch-honest. |
| Secondary pills | Page switch | Live has **9**. At 390 only Overview / Mission / Dash fit; Climate is off-screen. Confirms **UX-P1-6**. |
| PageHeader | Repeats the active pill + a paragraph | **Duplicate header.** Climate / Mission buttons on Overview duplicate pills 40 px above. |

`.dsc-card { min-height: 88px; padding: 14px 16px }` is not the villain. The villain is four chrome rows plus an H1 that restates the nav.

---

## Daily pages — can they act without scrolling?

Daily = Overview, Compose, Climate, Settings, Fleet.

| Route | 1280 first fold | 390 first fold | Act without scroll? |
|-------|-----------------|----------------|---------------------|
| **Overview** | Bands card only (4×8 + most of 2×4). Room/root, **Fan duties, Running, Root & tank, Grow log** buried. | Same card, ~1.5 gauge rows. 2×4 clipped. | **No.** Glance only; no duty, no pot, no log. |
| **Compose** | Strain + Vessel+mix. **Nutrition + Light+assign (Commit)** buried. | Strain fields + leftover “QA Dummy (pot3 test)”. Vessel header only. | **No.** Commit / assign / Accept mix are card 4 of 4. |
| **Climate** | Command + strategy/priority + demand tiles. **Room umbrella, Want, triad gauges, charts** buried (`scrollH` 4651). | Command half-grid. No gauges. | **1280: command only.** **390: no.** Want/gauges always below. |
| **Settings** | Fleet inventory wall — 3 of ~10 device cards (CONTROL / DEHUM / HEATER). MAC/uptime/RSSI are `—`. **In-service for the rest, assignment, Network, Save** buried (`scrollH` 5905 / 10827). | One device (CONTROL OFFLINE) + empty `—` rows. | **No.** Accordion vs wall — this is a wall. |
| **Fleet** | 7/11 + Surface 7.1.0 + Alerts 0. Kit Pulse top clipped. **Kit / In service toggles + Tank** buried. | Same three KPIs stacked; Pulse header only. | **No.** Toggles are below a constellation. |

**Answer:** **No** on the daily pages, except Climate Command at desktop (which is not the job the operator came to do — they came to see T/RH/VPD vs Want).

---

## Per-route above-the-fold notes

Waste score: **1** tight · **3** typical SPA · **5** first fold is chrome or empty hero.

### Live

| Route | Shots | 1280 | 390 | Waste | Notes |
|-------|-------|------|-----|------:|-------|
| Overview | [1280](screens-7.1.2/space-audit-overview-1280.png) · [390](screens-7.1.2/space-audit-overview-390.png) | Bands 600 px tall. 6 gauges on fold; Room row + duties off. Skinny arcs in wide cells. Climate/Mission CTAs duplicate pills. | Chrome + essay + legend + zone pills before one gauge row. | **5** | Subtitle promises duties / root / log. None of those are on the fold. |
| Mission | [1280](screens-7.1.2/space-audit-mission-1280.png) · [390](screens-7.1.2/space-audit-mission-390.png) | NEXT card = “no gaps” + **Open Twin / Climate Want again**. Hub Link skinny-wide. Pulse clipped. Seats / faults buried. | NEXT + Hub Link only. | **4** | Triage page whose triage diagram is below the fold. |
| Twin | [1280](screens-7.1.2/space-audit-twin-1280.png) · [390](screens-7.1.2/space-audit-twin-390.png) | 70 vh canvas. Page header at y=1005. Air path / scheduler buried. Model sits in a black field. | Same: canvas is the fold. | **5** | Hero empty of *operator* work. Twin is the product; chrome still stacks *above* it, then the H1 *below* it. |
| Climate | [1280](screens-7.1.2/space-audit-climate-1280.png) · [390](screens-7.1.2/space-audit-climate-390.png) | Command first (good priority). Strategy / Priority tent are one word in a full-width row. Gauges/Want off fold. | Hub chip + zone + timespan + Kit/Fleet, then half of Command. | **4** | Daily climate *reading* requires scroll. Daily climate *writing* does not (1280). |
| 4×8 | [1280](screens-7.1.2/space-audit-4x8-1280.png) · [390](screens-7.1.2/space-audit-4x8-390.png) | Keepalive canvas. Header “4×8 tent · 0 seats” below fold. Fans / history / seats buried. | Canvas only. | **5** | Cockpit is not a cockpit until you scroll past the twin. |
| 2×4 | [1280](screens-7.1.2/space-audit-2x4-1280.png) · [390](screens-7.1.2/space-audit-2x4-390.png) | Same keepalive. 1 seat claimed. Same bury. | Canvas only. | **5** | Same defect as 4×8. |
| Root | [1280](screens-7.1.2/space-audit-root-1280.png) · [390](screens-7.1.2/space-audit-root-390.png) | Coldest / mat hours are skinny-wide KPIs. POT 1 moisture only. POT 2–4 buried. Header “4 of 4 pots in service.” | KPI stack; POT 1 header. | **4** | Four pots, one on the fold. |
| Light | [1280](screens-7.1.2/space-audit-light-1280.png) · [390](screens-7.1.2/space-audit-light-390.png) | Two hero cards. WANT HOURS is a large empty box (0 h / 18 h). Auto photoperiod / hold clipped. | 4×8 card only. | **4** | Act (hold / auto) is below two 0.00 h gauges. |
| Dash (`/ops/home`) | [1280](screens-7.1.2/space-audit-dash-1280.png) · [390](screens-7.1.2/space-audit-dash-390.png) | CannaLib tiles (API / hits / bandwidth) own the fold. **Bands / running / grow log** buried. | Same tiles. | **5** | Third home (**UX-P0-1**). First fold is catalog telemetry, not the crop. |

### Grow

| Route | Shots | 1280 | 390 | Waste | Notes |
|-------|-------|------|-----|------:|-------|
| Compose | [1280](screens-7.1.2/space-audit-compose-1280.png) · [390](screens-7.1.2/space-audit-compose-390.png) | Strain + vessel visible. Honesty paragraph + page subtitle stack. Commit row in Light+assign (card 4). Live leftover: **QA Dummy (pot3 test)** / Northern Lights / Day 48 — not touched. | Strain only. | **4** | Scroll-to-commit. Nutrition is eight empty slots waiting below. |
| Research | [1280](screens-7.1.2/space-audit-research-1280.png) · [390](screens-7.1.2/space-audit-research-390.png) | Browse + Detail on fold. | Same, taller chrome. | **2** | Best Grow density. Search is the job and it is on screen. |
| Roster | [1280](screens-7.1.2/space-audit-roster-1280.png) · [390](screens-7.1.2/space-audit-roster-390.png) | Scheduler + roster table. | Scheduler only; roster buried. | **3** | 390: the seat list is the job and it is off-screen. |

### Tune

| Route | Shots | 1280 | 390 | Waste | Notes |
|-------|-------|------|-----|------:|-------|
| Learning | [1280](screens-7.1.2/space-audit-learning-1280.png) · [390](screens-7.1.2/space-audit-learning-390.png) | Two skinny-left wizard cards. Open gate is on fold. Kit toggles clipped. | Wizards fit; kit clipped. | **3** | Horizontal waste, not scroll-to-start. |
| Analytics | [1280](screens-7.1.2/space-audit-analytics-1280.png) · [390](screens-7.1.2/space-audit-analytics-390.png) | T+RH chart (duplicate of Climate) + root pack. | Same. | **3** | First card is explicitly “secondary.” |

### Fleet

| Route | Shots | 1280 | 390 | Waste | Notes |
|-------|-------|------|-----|------:|-------|
| Fleet | [1280](screens-7.1.2/space-audit-fleet-1280.png) · [390](screens-7.1.2/space-audit-fleet-390.png) | Three padded KPIs (7/11, 7.1.0, 0). Pulse clipped. Version ×3. | KPIs stacked; Pulse title only. | **4** | Service toggles — the act — are below the art. |
| Calibrate | [1280](screens-7.1.2/space-audit-calibrate-1280.png) · [390](screens-7.1.2/space-audit-calibrate-390.png) | Fan/Light chips + “1 · Select duct” on fold. | Same. | **2** | Wizard start is honest. |
| Settings | [1280](screens-7.1.2/space-audit-settings-1280.png) · [390](screens-7.1.2/space-audit-settings-390.png) | Inventory wall. 3 cards × empty MAC/uptime/RSSI. 18 cards on page; 4 on fold. Device assignment / Network / Integrations / Save at the bottom of 5905 px. | 1 card. 10827 px scroll. | **5** | Asked: accordion vs wall. **Wall.** |

---

## Density defects

### P0

| ID | Defect | Evidence |
|----|--------|----------|
| **SP-P0-1** | Shared chrome + duplicate page header eat 39% of 1280 / up to 48% of 390 before the first card. Live secondary is nine pills; Climate is not on the 390 fold. | Metrics `chromePx` 199 / 201; `contentStart` 278–406. Overview 390 shot. Cross-ref **UX-P0-1**, **UX-P1-6**. |
| **SP-P0-2** | `TwinKeepAlive` is **above** `<Routes>` and `is-active` on Twin / 4×8 / 2×4 with `min-height: min(70vh, 720px)`. First fold is a 3D hero. Cockpit header starts at y≈940–1184. Fans, seats, history never appear above the fold. | `TwinKeepAlive.tsx` + `.dsc-twin-keepalive.is-active`. Twin/4×8/2×4 shots. `cards inFold = 0/6`. |
| **SP-P0-3** | Settings is a vertical wall of device cards (no `<details>` / accordion). Daily act (remaining In-service, assignment, Network, Save) is hundreds of pixels down. Empty `—` fields (MAC, uptime, RSSI) inflate each card. | Settings 1280/390. `scrollH` 5905 / 10827. Buried includes POT3 OFFLINE … DEVICE ASSIGNMENT. |
| **SP-P0-4** | Overview Bands is a 600 px card (legend + zone pills + three gauge rows). Fan duties / Running / Root strip — the rest of the promised glance — are at y=892+. Gauges are skinny in wide cells (max-width 118 px in a third of 1280). | Overview shots + metrics `BANDS.h=600`, buried `FAN DUTIES` … `GROW LOG`. |

### P1

| ID | Defect | Evidence |
|----|--------|----------|
| **SP-P1-1** | Duplicate headers and CTAs: page H1 restates the active pill; Overview Climate/Mission buttons; Mission NEXT repeats Open Twin / Climate Want; Fleet title + Fleet Overview pill. | Overview / Mission / Fleet 1280. **UX-P1-3** (two “Overview” labels) is the naming half. |
| **SP-P1-2** | Compose: Commit + assign / Accept mix live in **Light + assign**, card 4 of 4. Nutrition is eight empty slots. 390 fold is nickname + sprout only. | Compose shots. Buried `NUTRITION`, `LIGHT + ASSIGN`. |
| **SP-P1-3** | Fleet first fold is three low-value KPIs (in-service count, surface version already in chrome, alerts 0). Kit Pulse — the map — is clipped. In-service toggles below. | Fleet 1280/390. |
| **SP-P1-4** | Climate: triad / Want / room KPIs below a Command wall. Strategy and Priority tent are one token in a 12-col card. 390 never shows a climate number except Hub °C. | Climate shots. Buried `ROOM UMBRELLA`, `TRIAD`. |
| **SP-P1-5** | Root: Coldest / mat hours are 70% empty width. Only POT 1 on fold. Four-pot job needs four pots or a strip. | Root 1280. |
| **SP-P1-6** | Light: WANT HOURS empty boxes + 0.00 h gauges bury Auto photoperiod / Manual hold. | Light 1280. |
| **SP-P1-7** | Dash/Home first fold is CannaLib bandwidth tiles. Bands — the crop — are buried. Third home of **UX-P0-1** also fails density. | Dash shots. |
| **SP-P1-8** | Learning / Mission Hub Link: skinny content hugging the left of a 1600-max card (`max-width: 1600` on `.dsc-shell`). | Learning / Mission 1280. |

### P2

| ID | Defect |
|----|--------|
| **SP-P2-1** | Brand tagline + SURFACE + page-subtitle essays (Climate “umbrella lung”, Overview “operational glance — …”). Copy cost is height. **UX-P1-1**. |
| **SP-P2-2** | Analytics leads with a Climate-duplicate chart. |
| **SP-P2-3** | Research / Calibrate / Learning start are acceptable; leave them alone if the chrome stack is fixed. |
| **SP-P2-4** | `.dsc-card` min-height 88 px and 14×16 padding are fine once chrome is collapsed. Do not “tighten cards” first. |

---

## What to compress first (density only — not a layout rewrite)

1. **Collapse chrome to two rows** on desktop: brand+status | primary+secondary. Drop the page H1 when the secondary pill is already lit, or make the pill the title. Recovers ~80–120 px.
2. **Move TwinKeepAlive below the page header** (or overlay the canvas *inside* the Twin route only). 4×8 / 2×4 should open on vitals + fans, with twin as a strip or toggle — not 70 vh before the H1.
3. **Settings accordion** by role (hub / pots / sonoffs / panel). Default-open: offline + OOS. Empty `—` fields collapse.
4. **Overview Bands → one row of 4×8 + 2×4 T/RH/VPD** (or a 2×3 without Room until selected). Duties + root strip must share the first 720.
5. **Compose:** Light+assign / Commit sticky or first. Nutrition slots behind “Add nutrient.”
6. **Climate:** triad or Want on the fold; Command is a compact chip row, not a 14-card page.

Do not start with card-padding nips. The foundation is the chrome stack and the keepalive hero.

---

## Live observations (not acted)

- Compose helpers still show **QA Dummy (pot3 test)** / Northern Lights / Day 48 Late Veg. pot3 was **not** put in service this pass.
- Root header: **4 of 4 pots in service.** Settings inventory list includes **POT3 OFFLINE**. Policy remains OOS — not toggled.
- 2×4 cockpit reports **1 seat**; 4×8 reports **0 seats**.
- Gauge “empty” counts in the JSON helper over-fire (value nodes split). Screenshots are source of truth for readings.

---

## Screenshots

All under [`docs/qa/screens-7.1.2/`](screens-7.1.2/) as `space-audit-<route>-1280.png` and `space-audit-<route>-390.png`.

Routes: `overview` `mission` `twin` `climate` `4x8` `2x4` `root` `light` `compose` `research` `roster` `learning` `analytics` `fleet` `calibrate` `settings` `dash`.

Sibling files in that folder (pot3-fullgrow-*, ux-pass2-*, etc.) were **not** overwritten.

---

## Sign-off

- Routes scored: **17 × 2 viewports = 34** first-fold shots.  
- Worst space waste: **TwinKeepAlive 70 vh above Twin / 4×8 / 2×4**, then **Settings inventory wall**, then **shared chrome + Overview Bands**.  
- Top 8: **SP-P0-1 … SP-P0-4**, **SP-P1-1 … SP-P1-4**.  
- Daily act without scroll: **No** (Climate Command at 1280 only — not the climate job).  
- **No commit. No deploy.**
