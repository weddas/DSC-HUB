# Design audit — DSC-HUB 7.1.0

**Date:** 2026-08-26  
**Scope:** Pi SPA (`homeassistant/custom_components/dsc_hub/frontend`) + brain Settings API

## Palette (HA Dash)

| Token | Value | Usage |
|-------|-------|-------|
| bg | `#0b0e14` | page background |
| panel | `#12171f` | cards |
| line | `#243044` | borders |
| text | `#e8eef8` | primary text |
| accent | `#26c6da` | actions, links |
| ok | `#66bb6a` / `#00E676` | healthy state |
| warn | `#ffb74d` | caution |
| bad | `#ef5350` | fault |

Applied in `dsc.css`, `gaugeTheme.ts`, chart stroke/fill sweeps.

## Information architecture

| Area | Verdict | Notes |
|------|---------|-------|
| Default landing | **Improved** | Overview replaces Mission as entry; Mission kept |
| Critical banner | **Good** | Active alerts + fault chips on Overview |
| Side drawer / inspector | **Existing** | Alert chips open inspector |
| Settings depth | **Improved** | Full device cards + assignment table |
| Calibrate | **New** | Tabbed fan + light wizards |

## Charts & motion

- MultiLineChart / Sparkline / GotWantBars: mount draw-in + eased value transitions (**done**).
- Gauges: existing `useEased` retained.

## Twin (Three.js)

- `spa-dist/dsc-the-dash-card.js` — proportions match 4×8 + 2×4 tent layout; fan ducts positioned intake/exhaust; sensor glow tied to live entity bus (**sanity pass — no structural changes required**).

## Icons & graphics

| Gap | Priority | Action |
|-----|----------|--------|
| Per-device glyphs in Overview cards | low | Follow-up: map seat_id → mdi icon set |
| Animated relay “pulse” on appliance chips | low | Optional CSS when `relay_on` |
| Zigbee device type icons | low | When canopy sensors land |

## Writable / data presentation

- pot1 moisture history entity added to `history_ops.ENTITY_METRIC_MAP`.
- Fleet cards show firmware from `firmware_version` sensor (not ESPHome framework version).
- Decimals: held readings + gauge formatters unchanged; no float runoff observed on clone VPD.

## Follow-ups (not blocking 7.1)

- Hub AP stability after `docker restart` — document AP restart in deploy runbook.
- Panel fleet ingest lag after CYD flash — allow 2–3 min boot before proof.
- Full Lovelace parity audit deferred (HA = soak shell only).

**Audit verdict:** **Ship 7.1** — theme, overview, calibration, and settings completeness meet the plan; icon polish deferred to FOLLOWUPS.

---

## Addendum — 7.1.2 interface remediation (2026-08-27)

### Root cause: unstyled Pi SPA (token scoping)

The Pi SPA at `:8787` served `dsc.css` fine (HTTP 200) but rendered unstyled — serif
fonts, native controls, black-on-white. Every design token was scoped to
`:host, .dsc-root`; the HA panel mounts `.dsc-root` inside its shadow root
(`panel-element.tsx`), but the standalone SPA entry mounted only `.dsc-shell`, so
`var(--dsc-*)` resolved to nothing across the whole document.

**Fix (belt and braces):**

- `dsc.css` — token block now declared on `:root, :host, .dsc-root`, plus island
  document base rules (`html/body/#root` height, background, font) that are inert
  inside the panel shadow root.
- `main.tsx` — SPA tree now wrapped in `<div className="dsc-root">`, mirroring the
  panel mount. The HA panel path is untouched.
- Page title is now set dynamically from the brain `/health` surface version
  (`DSC-HUB 7.1.0` live); `index.html` fallback title de-versioned to `DSC-HUB`.

### Copy purge

All user-visible jargon rewritten to plain human copy across ~18 files:
ComposePlant, CoupledMix, TuneFleetPages, LearningWizard, LightPage, CalibratePage,
DashHomeSections, DashHomePage, LiveMissionPage, GrowPages, CatalogResearch,
TankCutaway, RootPage, ClimatePage, CropScheduler, EntityInspector,
`lib/alertPlaybook.ts`, `lib/kitInventory.ts`. Rules applied: no entity IDs, no
HA/scripts/helpers/SoT/OOS/hole/greenwash vocabulary. Honesty semantics kept in
user terms — "No data", "Not measured", "Recorded by the hub", "Out of service".
The **Bridge / firmware** card was deleted from Fleet (bridge retired; firmware
truth lives on Settings device cards). EntityInspector keeps the raw entity ID but
behind a collapsed "Details" disclosure.

A rendered-DOM scan of all 17 routes on the live Pi found zero banned terms
(single hit on Settings was the phrase "FLEET INVENTORY").

### Affordance + icon pass

- `dsc.css`: native `input[type=range]` (track + thumb), `select` (custom chevron),
  text/number inputs, and checkboxes skinned under the fixed token scope;
  `focus-visible` teal ring on all interactive elements.
- Button hierarchy `.dsc-btn-primary/-secondary/-danger` via a new `variant` prop on
  `Button`; applied to Compose actions (Commit + assign = primary, Accept mix =
  danger), Learning wizard, Calibrate steps (Save = primary, Abort/Reset = danger),
  and Settings "Apply network" (danger + new DecisionLayer confirm).
- Kit Pulse constellation contained in a bordered card sub-surface; appliance nodes
  and chips pulse (`duty` motion + CSS glow) only when the relay is actually on;
  reduced-motion respected.
- Per-device glyphs: Settings fleet inventory cards (seat_id → icon), Overview
  "Running" chips (climate/tank/root/clone/lighting), Zigbee table type icons.

### Verification (2026-08-27, live Pi 192.168.86.30)

- `npm run build:spa` + `npm run build` both pass. `tsc --noEmit` reports 23
  pre-existing errors, none on lines touched by this pass (repo gates on Vite only;
  logged in FOLLOWUPS).
- Deployed via `deploy-brain.ps1` — `/health` 200 (surface 7.1.0), new bundle
  `index-BOmgI-vi.js` served, all four sonoffs online at 7.0.0.0 before and after.
- All 17 routes screenshotted to [`screens-7.1.2/`](screens-7.1.2/): themed fonts and
  colors everywhere, button hierarchy visible, sliders/checkboxes skinned, no jargon,
  no Bridge card. No state-writing control was clicked.

---

## Pass 2 — gauge color semantics (2026-08-27)

### Defects (user screenshots)

1. **Inconsistent arc colors** — RH rendered full red while temp was green and VPD cyan; ROOT 18.4 was `is-bad` but the value arc stayed cyan. Each metric used its own palette (`colorAtValue`) instead of one severity scale.
2. **Unlabeled fragment bars** — band-guide segments used the wrong SVG y-sign, so arcs sat below the viewBox and only clipped red/teal stubs showed beside each gauge.
3. **P3 empty state** — NaN still drew a 0-length round-cap dash (stray handle) and kept the `%` unit. P1/P4 same.
4. **ROOT vs sparkline** — alert class and sparkline hue did not share a tone.

### Semantic (one rule, same thresholds as `zoneTone`)

| Color | Meaning |
|-------|---------|
| green (`#66bb6a` / `--dsc-neon`) | in band (± one 12% grace margin) |
| amber (`#ffb74d`) | drifting (out of band up to 3 margins) or held/stale |
| red (`#ef5350`) | out of band beyond 3 margins (alert) |
| grey (`#8b95a8`) | no data |
| teal | live reading with **no** band configured (progress counters, room triad) |

Scale guides are the same red | amber | green | amber | red. Sparklines and Got/Want bars use `toneCssColor`. Bands card legend: *Green = in band · amber = drifting · red = alert · grey = no data*. Empty gauges: grey track only, `—` / `no data`, no ticks, no value path, no orphaned handle.

### Fixes applied (workspace)

- `gaugeTheme.ts` — shared `bandGuideSegments`
- `charts.tsx` — y-up `arcPoint`, top-side sweep, tone-driven stroke, skip value path when `!hasData`
- `DashHomeSections.tsx` — temp ±2 bands, tone-colored sparklines, moisture 30–70, P3 chip muted when unnamed
- `ClimatePage.tsx` / `RootPage.tsx` / `LightPage.tsx` — same semantic; Got/Want hours is a teal progress counter (not a false-red band)
- `zoneTone.ts` — `toneCssColor` + `defaultBandMargin`
- `dsc.css` — `.dsc-gauge.is-muted`; band-cell chrome follows tone (ROOT not permanently gold); selected-row `is-lit` is teal, not amber-as-warning
- `useBrain.tsx` — `/fleet/computed` in-flight lock + 5s poll (was 2s vs ~6.4s endpoint)
- `deploy-brain-remote.sh` — always `docker cp` SPA static (BuildKit was serving cached `index-BOmgI-vi.js`)

### Live verify (2026-08-27, Brain `192.168.86.48:8787`)

Pi LAN IP moved off `192.168.86.30` (SSH/8787 closed). Verified and deployed at **`http://192.168.86.48:8787/`**.

- **Pre-fix live bundle** `index-C2ljYtOO.js` still painted rainbow band fragments (five opacity-0.32 red/amber/green arcs). ROOT 18.4 °C was `is-bad` / red (band 20–24 °C is drifting, not alert). P3 empty track used `stroke-linecap="round"` (stray thumb).
- `npm run build:spa` + `npm run build` → **`index-DwSYxFmR.js`**. Deployed with `deploy-brain.ps1 -PiHost 192.168.86.48` (image rebuild + `docker cp` SPA static). `/health` 200, surface 7.1.0. HTML and script src both serve `index-DwSYxFmR.js`.
- **Post-deploy DOM:** gauges are grey track only when empty (`stroke-linecap="butt"`, `—` / `no data`, no value path, no range inputs). Rainbow fragments gone. ROOT 18.4 °C is **`is-warn` / amber** (1.6 ° below 20 °C want; inside the 3× margin — drifting, not red). In-band highlight titled “In-band range”; want ticks titled “Want edge”. Band-cell chrome follows tone (ROOT is not permanently gold). Selected row highlight is teal, not amber-as-warning.
- Tent T/RH/VPD were grey no-data for this verify (hub banner still “link down” after container recreate; `/fleet` `hub.online=true`). P2 moisture also no-data this pass — empty treatment matches P3.
- Screenshots: [`screens-7.1.2/ux-pass2-overview-gauges.png`](screens-7.1.2/ux-pass2-overview-gauges.png), [`ux-pass2-pots.png`](screens-7.1.2/ux-pass2-pots.png), [`ux-pass2-root.png`](screens-7.1.2/ux-pass2-root.png), [`ux-pass2-root-p3.png`](screens-7.1.2/ux-pass2-root-p3.png).

**Pass 2 verdict:** live semantics match the table. ROOT is amber only while drifting; red is reserved for >3 margins out of band. P3 empty has no slider handle.

### Closeout verify (same morning, after interrupt)

Picked up after a frozen worker. Cursor IDE browser cannot reach LAN (`chrome-error`); verified in local Chrome at `http://dsc-brain.local:8787/` (A **192.168.86.48**). Live bundle **`index-DwSYxFmR.js`**. `/health` 200, surface 7.1.0.

| Check | Live | Tone |
|-------|------|------|
| 4×8 RH 58.5% (want 50–60) | green | in-band — no longer full-red |
| 4×8 VPD 1.26 kPa | amber | drifting |
| ROOT 18.4 °C (want 20–22) | amber | drifting — not red (1 °C floor on temp margin) |
| P1 / P3 / P4 | grey `—` / `no data` | no value path, no HELD ghost, no range thumb |
| P2 19.5% (30–70 moisture) | amber | dry / drifting |
| Track | grey + one green in-band slice | rainbow fragment chips gone |

Root page POT 3: five muted gauges (`Moisture` / `Soil °C` / `Dryback` / `EC` / `pH`) all `—` / `no data`. Empty `useHeldReading` is no longer stale-without-a-value.

Screenshots: [`ux-pass2-overview-gauges.png`](screens-7.1.2/ux-pass2-overview-gauges.png), [`ux-pass2-overview-pots.png`](screens-7.1.2/ux-pass2-overview-pots.png), [`ux-pass2-climate.png`](screens-7.1.2/ux-pass2-climate.png), [`ux-pass2-root.png`](screens-7.1.2/ux-pass2-root.png), [`ux-pass2-root-p3.png`](screens-7.1.2/ux-pass2-root-p3.png).

Remaining closeout edits (workspace, not a second commit): `zoneTone` treats missing value before stale and floors °C margin at 1 °; `ArcGauge` draws grey track + in-band highlight only; `useHeldReading` empty state is `stale: false`. ComposePlant / roster / sprout / auto-stage / `appliance_driver.py` untouched. No commit.

---

## Pointer — Settings completeness (2026-08-27)

Settings honesty/completeness is a separate audit: [`SETTINGS-AUDIT-7.1.md`](SETTINGS-AUDIT-7.1.md). Design pass does not cover OTA theater, Apply-network copy, control/panel id, or the HA kv dump on `GET /settings`.

Controls and behavior (not visuals): [`INTERACTIVE-AUDIT-7.1.md`](INTERACTIVE-AUDIT-7.1.md). Operator workflows (can a grower finish each job): [`WORKFLOW-AUDIT-7.1.md`](WORKFLOW-AUDIT-7.1.md). First-run mental model: [`UX-AUDIT-7.1.md`](UX-AUDIT-7.1.md).

---

## Full design audit (2026-08-27)

**Method:** Cursor IDE browser on live Brain `http://192.168.86.48:8787/` (`.30` is not the Brain; several stray tabs hit it and were ignored). `/health` `7.1.0`, HTML served `index-DwSYxFmR.js`. Hash-walked all 17 operator routes. Opened Fleet Kit Pulse → Hub inspector + Details. Expanded nothing that writes grow state (no Apply network, no firmware jobs, no demand tiles, no Commit, no pot3 in_service). First paint sat on chrome-less “Connecting to fleet…” (title fallback `DSC-HUB 7.0.0` in `main.tsx`) until `/fleet` returned (~1.2 s this morning). Twin keepalive canvas intercepted clicks on 2×4 (Details / nav). Browser session then dropped; new `audit-full-*.png` temp files were reaped before copy. Defect visuals still match same-morning files in [`screens-7.1.2/`](screens-7.1.2/) plus the live DOM extract below.

**Ship verdict:** **Not shippable as a 7.1.2 operator surface.** Pass 1/2 made the SPA *look* like a product (tokens, Overview gauges, empty tracks). The IA, honesty, and chrome are still a kit of overlapping desks. Do not polish further until the landing story is one page and the leftover Lovelace/Twin/click-steal layer is cut or caged.

### Per-route verdict

| Route | Verdict | Notes |
|-------|---------|-------|
| `/live/overview` | **issues** | Best climate glance. P1 moisture grey `—` while Root/fleet have 21.8% (**WF-P0-1**). ROOT 18.4 °C amber holds. Filter “4×8” teal vs Overview tab green — two selected languages. Grow log is demand/stage spam. |
| `/live/mission` | **issues** | Triage wall. `7 of 11 in service` red next to All clear / FLEET OK. `Got M 21.80000114440918`. Age `20402.7890625`. Kit Pulse duplicates Fleet. Copy still says “seats, lung.” |
| `/ops/home` (Dash) | **issues** | Overview with extra junk. CannaLib tiles all `—`. **System map IIFE** (`LegacyCardHost` / `dsc-system-map-card`) paints **HUB OFFLINE** while the chip row says HUB ONLINE. FLEET **7.0.0** vs surface 7.1.0. Same Age float. |
| `/live/twin` | **issues** | Copy is fine; 3D lives. Crop scheduler + air-path “umbrella lung” still bolted under the canvas. Canvas count 0 in a 1.6 s extract — warmup is invisible. |
| `/live/climate` | **issues** | Real command desk, but it *looks* like a status board. Demand tiles (`dsc-demand`) are one-click writes (**IA-P0-1**). “NO PLANT/STAGE RAIL” × many. Room VPD `—` / no data while tent VPDs live. Recirc de-strat / master takeover / lung-poisoning copy. |
| `/live/4x8` | **issues** | Twin cockpit works (ducts, “from 2×4”). Empty tent still shows crop rail + `0 seat(s)` + `W— · Need —` + PHOTO ON. Canvas steals clicks. |
| `/live/2x4` | **issues** | Same cockpit, better scene. `M 21.80000114440918`. SF1000 ON chip vs `SF1000 0%` control. Fan sliders disabled (honest lock copy). |
| `/live/root` | **issues** | Gauge empty-states hold. **“4 of 4 pots in service”** while Fleet Kit Pulse has pot3 OOS (**REL-P0-2**). P1 21.8% / P2 19.5% painted `is-ok` (want 0–45) vs Overview P2 amber (30–70). |
| `/live/light` | **issues** | Equal cards. `Got / Want h` 0.00 both tents classed `is-ok` — next to the Overview legend that is “in band.” 2×4 want is 18 h. “no plant/stage rail” everywhere. GPIO-window honesty copy is good. |
| `/grow/compose` | **issues** | Card grid is the most designed grow surface. Live draft still holds **Northern Lights / Day 48** after empty roster (**WF-P0-2**). Σ 0% amber is honest. Button row (Commit / Assign / Accept mix) hierarchy exists. |
| `/grow/research` | **clean-ish** | Catalog browse works; empty detail is honest. “BRAIN CATALOG PROXY (REMOTE API OR LOCAL FALLBACK)” is engineer chrome. |
| `/grow/roster` | **issues** | Empty table is readable. Crop scheduler still screams `W— · Need —` over eight empty slots. |
| `/tune/learning` | **issues** | Wizard chrome is clear. Duplicates Calibrate. Dead in-service toggles show `—` (**IA-P0-4**). |
| `/tune/analytics` | **clean-ish** | Charts render; moisture pack matches Root numbers. Subtitle correctly defers climate to Climate. |
| `/fleet` | **issues** | Kit Pulse is the one good topology. Age float. **7/11 green** (pass 1 screenshot had it red). Alerts `0` subtitle is “CFM from Learning (anemometer).” Chip row overflows. Naming: Hum vs Humidifier, P1 vs Pot 1. |
| `/fleet/calibrate` | **clean** | Focused wizard, one primary teal Start, amber 0/4 curves. Best single-job page in the SPA. |
| `/fleet/settings` | **issues** | Inventory cards are complete enough to scan. CONTROL OFFLINE + In service yes. `e.g. intake_temp` placeholders. Queue OTA ×10 same chrome as Test CannaLib. Honesty/completeness owned by SETTINGS audit — design just looks like a dump. |

### Severity-ranked defects

#### P0 — operator cannot trust what they see, or cannot use the chrome

| ID | Defect | Where |
|----|--------|-------|
| **DA-P0-1** | Twin keepalive `<canvas>` sits over the page and **eats clicks** (Details, nav). CSS promised `z-index: -1` + `pointer-events: none` when idle; on 2×4/4×8 `is-active` the canvas is the hit target. | `TwinKeepAlive.tsx`, `dsc.css` `.dsc-twin-keepalive` |
| **DA-P0-2** | Dash **System map** (Lovelace IIFE) shows **HUB OFFLINE** while React chrome shows **HUB ONLINE** / KIT HONEST. Same lie class as the old banner follow-up, now inside the “everything running” page. | `DashHomePage.tsx` `LegacyCardHost tag="dsc-system-map-card"` |
| **DA-P0-3** | Landing P1 moisture is grey no-data; Root/Mission/Analytics show 21.8%. Two stories on the first page an operator opens. | `DashHomeSections.tsx` vs `entityFleetMap.ts` — already **WF-P0-1** |
| **DA-P0-4** | Root subtitle **“4 of 4 pots in service”** while Fleet Pulse / inventory have pot3 out of service. `isPotInService` defaults missing `input_boolean` to ON. | `seatModel.ts`, `RootPage.tsx` — already **REL-P0-2** |

#### P1 — wrong language, wrong color, or the desk is the wrong desk

| ID | Defect | Where |
|----|--------|-------|
| **DA-P1-1** | `Age 20402.7890625` — raw `String(uptime)` on every Hub link row (Mission, Dash, Fleet). | `HubLinkLine.tsx` |
| **DA-P1-2** | `Got M 21.80000114440918` / seat chip `M 21.80000114440918` — `seat.moisture` is the raw entity string. Pass 1 claimed no float runoff. | `seatModel.ts` `buildPlantSeat`, `LiveMissionPage.tsx`, `LivePages.tsx` |
| **DA-P1-3** | Same moisture, two tones: Overview P2 19.5% `is-warn` (hardcoded 30–70); Root P1/P2 `is-ok` (`potWantBand` default 0–45). | `DashHomeSections.tsx`, `tentWant.ts` — already in FOLLOWUPS |
| **DA-P1-4** | Light `Got / Want h` 0.00 classed `is-ok` (green). Pass 2 called this a teal progress counter; the gauge still wears the in-band class next to a legend that says green = in band. 2×4 want is 18 h. | `LightPage.tsx` `ArcGauge` |
| **DA-P1-5** | Live has **nine** secondary tabs. Overview, Dash, and Mission all claim “glance.” Climate is a tab *and* a header button. Operator has to learn the product’s org chart. | `routes.ts` `SECONDARY_TABS.live` |
| **DA-P1-6** | Jargon the copy purge missed: **KIT HONEST** (`Honesty.tsx`), History drawer **“THIN RECORDER”** + “same series as **HA Home** gauge popups”, Climate/Twin **lung**, **NO PLANT/STAGE RAIL**, crop chips **`W— · Need —`**, Fleet Alerts subtitle **CFM from Learning**, Surface card **“Panel product shell.”** Entity id `binary_sensor.dsc_hub_link` is in the inspector a11y name even with Details collapsed. | `Honesty.tsx`, `charts.tsx` `emptyLabel`, `HistoryDrawer` / `BandChartHost`, `CfmBadge.tsx`, `ClimatePage.tsx`, `CropScheduler.tsx`, `EntityInspector.tsx` |
| **DA-P1-7** | Fleet **7/11** painted green (healthy). Pass 1 screenshot had it red. Incomplete kit is not in-band. | Fleet overview KPI |
| **DA-P1-8** | Connecting splash is a blank `dsc-root` + muted sentence. No spinner, no brand, no retry. Title lies `7.0.0` until fleet loads. | `main.tsx` — already **IA-P1-14** |
| **DA-P1-9** | Closed history drawer still exposes Close ×2 + timespan in the a11y tree on every route. Looks like a stuck drawer in snapshots. | `chrome.tsx` `SlideDrawer` — already **IA-P1-1** |
| **DA-P1-10** | Climate/2×4/4×8 **command tiles look like status chips**. Running chips on Overview look like the clickable fan chips. Button vs chrome is not a system. | `ClimatePage.tsx` `dsc-demand`, `DashHomeSections.tsx` — pairs **IA-P0-1** / **IA-P1-3** |

#### P2 — polish, only after the above

- Brand line “A Plausible Deniability Project.” is a joke, not an operator product name.
- Vertical 4×8 / 2×4 / ROOM row labels on Overview — low contrast, rotated.
- COOL ○ / C-HUM ○ unexplained glyph vs grey-off.
- Grow log: dozens of `Stage - Off; Clone - Custom` lines.
- Kit Pulse abbreviations vs chip full names.
- Research “BRAIN CATALOG PROXY…” eyebrow.
- Calibrate / Learning are the same job twice.
- Selected-tab green vs selected-filter teal vs HA dash teal — three “I’m on” colors.

### Foundation vs surface polish

**Foundation (do not dress this):**

1. **Information architecture.** Live is nine pages because nobody killed Mission/Dash after Overview landed. Twin is a keepalive that owns the pointer. Dash still hosts a Lovelace system-map card. That is not a theme bug.
2. **Honesty splits.** Inventory `in_service` ≠ `input_boolean` default-on ≠ hub switch. P1 moisture entity map hole. System map vs React hub chip. Compose draft survives retire. The UI is faithfully rendering three sources of truth.
3. **Color contract is only enforced on Overview climate gauges.** Root, Light hours, Fleet 7/11, and Running chips do not share `zoneTone`. Pass 2 fixed one desk.

**Surface (pass 1/2 actually did this):**

- Token scope (`:root` / `.dsc-root`) — SPA is themed, not unstyled.
- Overview T/RH/VPD + ROOT amber/green/grey match the legend. Empty gauges are grey `—` / no data, no stray thumbs.
- Button variants exist (Calibrate Start, Compose Commit / Accept mix).
- Most entity IDs are behind Details (inspector still leaks them to AT).
- Settings has real device cards. Calibrate is a real wizard.

### What pass 1/2 fixed vs what regressed

| Claim | Live 2026-08-27 |
|-------|-----------------|
| Unstyled SPA | **Fixed.** Tokens hold on `.48` / `index-DwSYxFmR.js`. |
| Jargon purge / zero banned terms | **Partial.** No `entity_id` in Overview body. **HA Home**, **thin recorder**, **KIT HONEST**, **lung**, **W—**, **NO PLANT/STAGE RAIL** still ship. |
| Gauge semantics | **Hold on Overview climate + ROOT temp.** **Broken** on Root moisture vs Overview strip, Light hours `is-ok`, Fleet 7/11 green. |
| P3 empty no handle | **Holds.** |
| Overview landing | **Holds as default hash.** First paint is still the connecting void. P1 moisture hole makes the landing dishonest. |
| No float runoff | **Regressed.** Mission / 2×4 seat chips print IEEE leftovers. Age is an unformatted float. |
| Twin sanity | **3D draws** on 2×4/4×8. **Unusable as chrome** because the canvas steals clicks. |
| Settings completeness | Cards exist. Design still reads as an inventory dump; SETTINGS audit owns the lies. |
| `/fleet/computed` wedge | **Improved.** Cold computed ~1.2 s this morning; connecting splash still has no timeout. |

### Honest close

This is not a compliment pass. The Overview triad *looks* like 7.1.2. The product is still **three glances, a leftover Lovelace map, a WebGL layer that owns the mouse, and two in-service clocks**. Calibrate, Analytics, and the Overview *climate* strip are the only surfaces I would let a grower keep open. Everything else is either a duplicate desk or a place where the color/copy lies. First-run mental model / language / a11y: [`UX-AUDIT-7.1.md`](UX-AUDIT-7.1.md).
