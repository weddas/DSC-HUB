# DSC-HUB v2 dashboard — target design and implementation plan

> Drafted 2026-09-06. Source design: Claude Design project **DSC-HUB UI Mockups**,
> file `DSC-HUB v2.dc.html` (https://claude.ai/design/p/bd2c2bea-660f-4181-b342-db0095914dab?file=DSC-HUB+v2.dc.html).
> Local copies of the design source and its reference assets live in [`mockups/`](./mockups/) —
> see [What was imported](#what-was-imported). **Merged to master** as PR #199 (`8f95ff6`, 2026-09-07).
> Developer SoT (concise): [`docs/brain/WEBUI.md`](../brain/WEBUI.md) · [`docs/brain/ZONE-MODEL.md`](../brain/ZONE-MODEL.md).

## Status

- **2026-09-07 — Pass A–I spike + interaction pass merged** via PR #199 (`feat/dashboard-v2` → `master`). Evidence and deferred items: `docs/FOLLOWUPS.md` § 2026-09-07. Dev against the live brain: `npm run dev` in `frontend/` proxies every non-Vite path to `dsc-brain.local:8787` (`DSC_BRAIN_ORIGIN` overrides).
- **2026-09-07 — Pass A landed** on branch `feat/dashboard-v2`: navigation rebuild, tokens + Fira type + grid wash, the reveal-language primitives, Overview 2a on live data, first derived-metric slice.
- **2026-09-07 — Pass B landed** (same branch): Climate desk in the 1d layout — VPD · MASTER hero with band track and in-band time, setpoints by phase, the per-zone VPD chart with history (band, lights-off shade, stage/alert markers, compare ghosts, 24 h → 7 d), equipment tiles with direction of pull and slope-based ETAs, heat lines and fan glyphs. `MultiLineChart` gained `shades`. Evidence: `docs/FOLLOWUPS.md` § Pass B.
- **2026-09-07 — Pass C landed** (same branch): brain `zone_model.py` + `GET/PATCH /zones` (roles in `space.extra_json`, system journal entry per flip, honest effects list, 5 tests, suite 331 green); SPA `useZoneMeta` + role-aware `useZones` (Dry rail / no band), Settings › Zones with the 3b before/after confirm, role chip + "not enforced" lamp tag on Overview. The flip records and re-bands; actuator enforcement is the control-pass follow-up. Evidence: `docs/FOLLOWUPS.md` § Pass C.
- **2026-09-07 — Pass D landed** (same branch): Alerts desk in the 1j layout — active-now cards with "what the hub did" from the grow log, 24 h history with zone + ALERT/HUB/NOTE tags, the automation-v2 rules table with live state and an enabled switch. Evidence: `docs/FOLLOWUPS.md` § Pass D.
- **2026-09-07 — Pass E landed** (same branch): Light desk on the 2a clocks with tone-bordered tent panels, every control kept, plus real fixtures (nameplate watts) and the SF1000 calibration PPFD slot. Evidence: `docs/FOLLOWUPS.md` § Pass E.
- **2026-09-07 — Pass F landed** (same branch): Root desk — heat-mat panel, honest shots/irrigation tile (OOS until a pump is bound), plant-as-card probe panels with steering phase, and the per-probe dry-back sawtooth with EC on the right axis. Evidence: `docs/FOLLOWUPS.md` § Pass F.
- **2026-09-07 — Pass G landed** (same branch): CannaLib desk in the reveal language with the "runs in DSC-HUB" table from the roster + zone history, lineage only when the catalog carries it. Evidence: `docs/FOLLOWUPS.md` § Pass G.
- **2026-09-07 — Pass H landed** (same branch): phone density on every desk (no page wider than 375 px; sentence-length tags wrap instead of widening the page), the refresh pulse on triad and VPD numerals via `useFreshFlag`, and an honest "brain predates zones" message when the hub's brain has no `/zones`. Cure-vessel frame stays parked. Evidence: `docs/FOLLOWUPS.md` § Pass H.
- **2026-09-07 — Pass I spike done (laptop half)**: model manifest + `TwinViewport` (lazy chunk, wire look from tokens, 30 fps cap, hidden/out-of-view pause) + `TwinPanel` (in-view mount, honest still on phones) + `#/twin-spike`. Laptop: GLB 385 KB loads in ~370 ms, 30 fps at the cap, 2.5 ms/frame GPU-synced, ~350 draw calls; production chunk 315 KB gzip (shared with the airflow scene). Phone half is the operator's (`#/twin-spike?force3d=1`). Evidence: `docs/FOLLOWUPS.md` § Pass I spike.
- **2026-09-07 — Interaction pass landed** (same branch): `Tooltip` primitive + `ReadingTip` (exact value · polled · was · want · provenance) on triad cells and the VPD hero; `EntityToggle` press → waiting → confirmed flash / failed shake with the brain's reason. Evidence: `docs/FOLLOWUPS.md` § interaction pass.
- Next: Pass I proper (bindings, device models, Overview/Climate placement) once the phone number is in — see [Passes](#passes-end-to-end-both-tents-at-the-same-point-in-each). Before it: operator hotpatch of brain + SPA and the brain control pass for zone roles.

## TL;DR

The v2 design is the target for the operator SPA. It has three layers, and they stack:

| Layer | Frames | What it decides | Priority |
|---|---|---|---|
| **Turn 2 — the reveal language** | 2a Home, 2b Facility | *How everything looks.* Square bordered panels, legend labels floating on the border, mono uppercase 10 px labels, teal eyebrow + white sentence headline, bordered square status tags, arc triad, duty bars, two clocks, "grey means no data". This is the SPA's own reveal-video look, applied to the new information architecture. | **1 — apply first, everywhere** |
| **Turn 3 — the scaling model** | 3a Scale ladder, 3b Flip role | *How the app scales and what a zone is.* Site › Room (lung) › Zone › Plant. A zone has a **role** (Grow · Dry · Cure · Empty) that flips without re-creating it; density comes from zone count, never a user "mode". | **2 — the data model behind every screen** |
| **Turn 1 — the full app** | 1a–1o | *What each screen contains.* Overview (home / facility / empty), Climate, Crop steering, Lighting recipes, Propagation, Post-harvest, CannaLib, Alerts, Settings › Zones, three mobile frames, component sheet. Drawn in the older rounded style; restyle in the 2a language when built (the designer's own "try next"). | **3 — screen by screen** |

The single most valuable move is **Pass A** below: land the 2a Overview on the real Pi with real entities. Everything after that reuses its primitives.

## What was imported

| Path | What it is |
|---|---|
| `mockups/DSC-HUB v2.dc.html` | The design source (turns 3 → 2 → 1, newest first). Sample data + tone logic in the `data-dc-script` block at the bottom. |
| `mockups/ios-frame.jsx`, `mockups/support.js` | Design-canvas runtime scaffolding (iPhone frame component, template runtime). Reference only — nothing to port. |
| `mockups/github.md` | The designer's own sync note (repo files it read per screen). |
| `mockups/uploads__DSC-HUB_Mockup_Prompt.md` | The brief the operator wrote (home grower ↔ craft facility, screens 1–10, visual direction, non-goals, sample numbers). |
| `mockups/reference/frames__reveal-0[0-7].png` | Eight frames from `Dsc-Hub-Reveal.mp4` — the current SPA filmed as a product reveal. They *are* the 2a language: "One room breathes for every tent", "The lung, in percentages", "T, RH and VPD — only together", "Two desks, two clocks", "Grey means no data", "Inventory gates, not fake helpers", "A live catalog behind the grow", "Nothing enters the curve unaccepted". |
| `mockups/reference/uploads__brand-*.png` | The DSC-HUB one-pager ("Watches. Decides. Acts.") — brand voice + the 3:07 AM "you slept through it" story that 2a's mission line quotes. |
| `mockups/reference/uploads__pasted-*.png` | Two crops the operator pasted: tent metric tiles (T / RH / VPD + Lights / Dehumidifier / EX OUT / Heat mat / Mister OOS) and the one-line "02:04 Humidity spiked…" mission strip. |
| `frontend/public/models/grow-tent-120x60x210.glb` (+ `docs/design/models/src/*.obj/.mtl`) | Operator-authored 3D model of the 2×4 clone tent (120 × 60 × 210 cm), exported from "three-d-stage" via THREE.GLTFExporter r184. 118 named nodes (panels, doors, zips, two observation windows, vent window, five vent ports with sleeve/ring/iris, two cable ports, poles, rails, floor tray), seven materials (`shell_black`, `foil_lining`, `trim_green`, `roller_silver`, `window_acrylic` α 0.14, `frame_steel`, `tray_pvc`), no animations, bounds normalised to ±1. See [3D twin, revisited](#3d-twin-revisited). |

Import route that worked (the `DesignSync` tool needs `/design-login` from an interactive session, which this session could not run): open the project in the logged-in Chrome, call the page's own `OmeletteService/ListFiles` and `GetFile` JSON endpoints, base64-decode, and hand the text to the OS clipboard through a user-gesture button (Chrome refuses `clipboard.writeText` without a click; ~3 MB per copy is the practical ceiling).

## Design principles to hold to (from the brief, the reveal frames and AGENTS.md)

1. **One zone card serves a tent and a container.** Density comes from the grid (2-up with labels and bars → 4-up compact → strip table), "nothing is re-designed, only revealed" (1o).
2. **T, RH and VPD only together**, VPD is the master number, temp/RH are its inputs; the band label sits next to it (`kPa · 1.0–1.2`).
3. **Colour is for state only.** In band `#66bb6a`, drifting `#ffb74d`, out of band `#ef5350`, no data `#8b95a8`, **lamp on `#f5c26b`** (new). Chrome stays quiet. Phase chips: Veg green · Gen teal · Bulk violet · Finish orange · Dry amber · Cure grey — one colour each, everywhere.
4. **Grey means no data. Nothing here is a guess.** Every reading that is held/stale/unmeasured is labelled (`HELD 14m`, `—`, `not measured`, dashed border for OOS). This is already the house rule; the design just makes it typographic.
5. **The room is the umbrella lung.** Tents nest inside the room panel; intake/exhaust duties belong to the room; the 2×4 clock follows the 4×8 unless set independent.
6. **Every heading is a sentence.** `LIVE · OVERVIEW` eyebrow (teal, 10 px, .18em) over "One room breathes for every tent." (IBM Plex Sans 26/700) over a muted 12 px sub-line.
7. **The hub acts before it calls you.** Alerts read as a story with timestamps ("fans first 02:04, dehumidifier 02:09, back in range 02:19 — you slept through it") and a single `OPEN MISSION →` affordance, not a red wall.
8. **Invented data stays invented until the hardware exists — but derived data is real.** CO₂, measured PPFD, per-site substrate EC/VWC, cure pucks, propagation counts, water activity, terpene retention and facility KPIs are tagged INVENTED in the design: they render as `—` slots with a "possible with …" device hint, never as sample numbers. Values that come from formulas or relationships between sensors the kit already has (leaf VPD, dew point, in-band %, time-to-setpoint, DLI estimate, dry-back %, energy) are first-class and carry a provenance line — see [Derived metrics layer](#derived-metrics-layer).

## Current state vs target (gap map)

Screens captured on the live Pi at `dsc-brain.local:8787` on 2026-09-06 (hub was offline at the time — which itself is a good test of the honesty rules).

| Surface | Today | Design target | Gap |
|---|---|---|---|
| **Shell** | Brand row → demo banner → honesty rail → Live/Grow/Fleet/Settings pills → secondary pills with subtitles → page. Glass cards, radius 10–14, star-field wash. | 2a: `LIVE · OVERVIEW` eyebrow + sentence headline; bordered status tags top-right (`HUB ONLINE`, `BEAT #1313`, `PROBE 2 HELD`, `1 CRITICAL`); rounded-square panels; 32 px grid wash. 1a: one flat desk row. | **Navigation is rebuilt** (see [Navigation](#navigation)) — the operator's top complaint. Then typography, panel geometry, status-tag primitive. |
| **Overview** | Vertical dump: status strip → photoperiod card → two journal panels → "Climate bands" chips → fan-duty chips → running chips → root/tank → grow log → fleet stamp. | 2a: mission line → **Room lung panel** wrapping two tent panels (arc triad each + WANT / appliance / lamp tags) → 3-col row: duty bars · two clocks · compact grow log. 2b at facility count. 3a rungs decide layout by zone count. | Restructure. **Journals removed** (decided; `#/logs` owns them). Triad from `ArcGauge`, duties as bars not chips, clocks from `TentLightClock`, grow log as `time · glyph · text` rows. |
| **Climate** | Command card → Room umbrella chips → Triad gauge matrix → three ECharts (T / RH / VPD) → Air path → Zigbee by role → Fan duty % → Efficacy. | 1d: VPD hero (56 px) with band track + `in band 22 h 40` → temp/RH/CO₂/PPFD tiles → **setpoints-by-phase table** → one chart with band shading, phase marker, lights-off shade, 24 h / 7 d / cycle segmented → **equipment tiles with direction of pull** (Lights ON 86 % · Dehumidifier ↓ RH pulling 61 → 58 · Humidifier IDLE arms below 56 %). | Add VPD-hero + band-track, phase setpoint table, chart target band + lights-off shade, equipment tile primitive. Command/Zigbee/Air path stay, restyled. |
| **Light** | Two hero cards (4×8, 2×4) with schedule rails, twin lamp, schedule source, follow banner. Already the "two desks, two clocks" model. | 1f: recipe library (INVENTED), intensity-by-day-of-cycle chart with ramps, spectrum mix (only if the driver exposes channels), PPFD map (only with a PAR sensor), driver mapping, energy tile. 2a clocks panel: `STATE DARK · ON IN 4h 53m`, rails, ramp/twin/draw line "tariff × local watts, not a bill". | Restyle rails to the 2a clocks; add intensity-by-day only when the schedule model gains a day-of-cycle dimension; PPFD stays `uncal` until a PAR sensor is bound. |
| **Root** | Probe cards with arc gauges, notes, auto root-steering, Soil test wizard. | 1e: phase timeline (Gen → Bulk → Finish), **dry-back sawtooth with EC on the right axis**, today's shots, shot editor, per-site overnight strip. 3a rung 1: plant-as-card with moisture / root °C / EC / pH and a sparkline. | Sawtooth chart from existing moisture history (real). Shots/shot editor gated on irrigation hardware (F-001/F-002 are on hold → honest OOS tile, not a form). |
| **Mission** | Triage: hub link, kit pulse, lung CFM, plant probes, faults. | 1j Alerts & automation: **Active now** cards (zone · title · what the hub did · since · CTA), **History 24 h**, **Rules table** (condition · scope · hub action → then notify · fired 30 d · toggle). | Automation v2 rules already exist in the brain + Settings editor; surface them here as the rules table. Rewrite the alert card copy to the "what the hub did" pattern. |
| **Fleet** | Kit pulse, Kit & in service, Tank, Learning, Calibrate. Reveal frame 12/16 already shows these in the language. | No v2 frame. Keep; restyle to square panels; inventory gates as the `IN / OUT` table. | Style only. |
| **Grow › Research (CannaLib)** | Catalog picker/table; reveal frame 14. | 1i strain detail: lineage, flowering days, aroma/terp chips, awards, **"runs in DSC-HUB"** table from journals. | Detail view + journal rollup per strain. Gaps shown as gaps (frame 14 rule). |
| **Settings › Device** | Kit inventory, OOS toggles, Zigbee role binding. | 1k Settings › Zones: name & type (Tent / Container / Room / Dry-Cure) → cultivar from CannaLib (pre-fills recipe, bands) → discovered sensors & equipment with roles. 3b role switcher (GROW · DRY · CURE · EMPTY) with before/after card diff and "what the flip does / won't do". | New Zones section on top of the existing device inventory; role flip is a brain feature (see Pass C). |
| **Mobile** | Responsive collapse of the desktop layout only. | 1l–1n: phone frames — zones as a compact list with bottom tab bar (Zones · Post-harvest · CannaLib · Alerts), one-zone climate with 64 px VPD, cure-vessel detail. | Bottom tab bar + list density at < 480 px. Cure vessel deferred with Post-harvest. |
| **Empty state** | n/a | 1c "No zones yet — add your first tent". | Only meaningful once zones are data, not constants. |
| **Propagation, Post-harvest cure vessels, KPIs** | none | 1g, 1h, 1b KPI row, 3a rung 4 KPIs. | **Parked.** No hardware or data path; log as future features, do not scaffold fake tiles. Dry *role* (3b) is in scope because it only needs T/RH + a lamp lock. |

## Navigation

Today: brand row → demo banner → honesty rail → four primary pills (Live · Grow · Fleet · Settings) → a second pill row per section (Live alone has seven: Overview · Climate · 4×8 · 2×4 · Root · Light · Mission) → page. What is broken: two rows of pills that look alike; zone tabs (4×8, 2×4) sitting next to desk tabs (Climate, Light) so the same reading has two homes; "Mission" and "Fleet" are brand words, not operator words; Settings hides eight sections behind one pill; on a phone all of it collapses into a wrapping pill soup.

Target (from 1a's flat nav, 1d's zone breadcrumb + per-zone sub-tabs, and 1l's bottom bar), adapted to what the hub actually has:

**One flat desk row, always visible.** Desks are *what you are looking at*, never *which zone*:

```
Overview · Climate · Root · Light · Plants · CannaLib · Logs · Alerts · Kit        ⚙ Settings
```

- Nine desks plus a gear. Labels are plain horticultural words; "Mission" → **Alerts**, "Fleet" → **Kit**, "Grow › Research" → **CannaLib**, "Grow › Roster / Compose" → **Plants**.
- Active desk: 2 px underline in the desk's accent (teal for grow desks, blue for live desks, purple for Kit) — the 1a pattern, no filled pills.
- Status tags (`HUB ONLINE`, `BEAT #1313`, `PROBE 2 HELD`, `1 CRITICAL`) sit at the right of the headline row, not in a separate honesty rail; the rail's overflow list becomes a popover on the tag.

**Zone is context, not a tab.** Climate, Root and Light get a zone strip under the headline: `ROOM · 4×8 · 2×4 · ALL` (the existing `useZoneFocus` compare/main/clone/room, persisted as `?zone=`). Overview zone cards deep-link into a desk with that zone selected (`#/climate?zone=4x8`). At facility scale the strip becomes a zone picker with search (1d's `Overview › C3 · Container 3` breadcrumb).

**Sub-tabs only where a desk has real sub-surfaces**, rendered as 1d's small underline row inside the page header:
- Plants: Roster · Compose
- Kit: Inventory · Learning · Calibrate
- Settings: Zones · Devices · Hub · Brain · Network · Server · System · General (a left rail on desktop, a list on mobile — not pills)

**Mobile (< 640 px):** bottom bar `Overview · Climate · Plants · Alerts · More` (More opens a sheet with the remaining desks and Settings). The zone strip becomes a horizontal chip scroller. Headline shrinks to 20 px.

**Routes.** New canonical paths, with every current path redirected (extend `LEGACY_REDIRECTS`):

| New | Replaces |
|---|---|
| `#/overview` | `/live/overview`, `/`, `/ops/*` |
| `#/climate?zone=` | `/live/climate`, `/live/4x8`, `/live/2x4` (zone tabs become `?zone=`) |
| `#/root?zone=` | `/live/root` |
| `#/light?zone=` | `/live/light` |
| `#/plants/roster`, `#/plants/compose` | `/grow/roster`, `/grow/compose` |
| `#/cannalib` | `/grow/research` |
| `#/logs` | `/grow/logs`, `/tune/analytics`, `/advanced/*` |
| `#/alerts` | `/live/mission` |
| `#/kit`, `#/kit/learning`, `#/kit/calibrate` | `/fleet`, `/fleet/learning`, `/fleet/calibrate` |
| `#/settings/:section` | unchanged; `zones` added |

Files: `routes.ts` (new `DESKS` table replaces `PRIMARY_TABS` / `SECONDARY_TABS`; `sectionFromPath` goes away), `App.tsx` shell, `styles/dsc.css` (`.dsc-desk-nav`, `.dsc-zone-strip`, `.dsc-bottom-bar`), `hooks/useZoneFocus.tsx` (read/write `?zone=`), `alertPlaybook.ts` routes, and the 41 `navigate("/…")` call sites across pages and components (counted 2026-09-06) — introduce a `paths.ts` helper (`paths.climate({ zone })`) so no string paths survive the rewrite.

## Derived metrics layer

The brief's most valuable numbers are relationships between sensors the kit already has. They are real, not INVENTED, and belong on the cards with a provenance line ("from T + RH", "estimated from fixture map"). Proposed `frontend/src/lib/derived/` (pure functions over the entity bus + `useHistory`), with the brain owning any that drive control:

| Derived value | From | Where it shows |
|---|---|---|
| Leaf VPD (air VPD − leaf offset, default −1.5 °C) | T, RH | Triad sub-label, Climate hero (`leaf −1.2` in 1d) |
| Dew point, absolute humidity (g/m³), moisture to remove to reach RH target | T, RH | Climate equipment tile sub-line (`pulling 61 → 58 · 14 min` = load ÷ observed removal rate) |
| Rate of change (°C/h, %RH/h) and **time-to-setpoint** | history | Equipment tiles, alert copy |
| **In-band %** over 24 h and over the cycle | history vs bands | VPD hero (`in band 22 h 40`), zone card, CannaLib "runs" table |
| Room vs tent Δ (lung effectiveness), intake/exhaust duty per day | room + tent T/RH, fan duties | Room legend, duty bars footer |
| **DLI estimate** | photoperiod × fixture PPFD map at hang height (`lib/dliEstimate.ts` exists) | Light desk, Overview lamp tag (`LAMP ON · 640 PPFD` becomes an estimate with the map's provenance) |
| Lamp on outside schedule | lamp state vs schedule | Alerts rule (already the design's rule #2) |
| Energy kWh/day and cost | watts × on-hours × tariff (exists) | Two-clocks footer, "not a bill" |
| **Dry-back %** per irrigation cycle, dry-back rate, next-feed estimate | probe moisture history | Root sawtooth, plant card (`dry-back −14 % · next feed 11:40`) |
| EC stacking trend, root-zone Δ vs air (heat-mat effectiveness) | probe EC / soil °C, air T | Root, 2×4 `MAT ON · 21.3 °C` tag |
| Day of cycle, days to phase change | roster start date + phase plan | Phase chip, Climate setpoints table |
| g/W, g/plant, cost per run | harvest weight logged in the journal × energy | CannaLib "runs in DSC-HUB", only once a harvest is logged |

Device-dependent values keep their slot but never a number: CO₂ (`— · possible with an NDIR sensor`), measured PPFD (`— · PAR sensor at canopy`), per-site substrate EC/VWC (`— · substrate probes`), cure RH/CO₂ (`— · vessel puck`), water activity (`— · log daily` as in 3b). The slot hint is the product hook the operator described — it tells the grower what device would deliver the number.

## Motion and depth

Operator ask (2026-09-06): spinning fan blades, heat lines off the mat, a minor pulse on refresh, glows on errors, more depth. House rule stays: **motion only when the bound entity is truly live**; everything drops to static under `prefers-reduced-motion`; transform/opacity only (no layout animation); `dsc.css` already has `dsc-fan-spin`, `dsc-chip-pulse/duty/breathe`, `dsc-icon-glow`, `dsc-gauge-live` — extend, don't fork.

| Effect | Spec | Bound to |
|---|---|---|
| **Fan blades** | Fan glyph rotates; `animation-duration = 2.2 s − duty × 1.9 s` (10 % → slow, 100 % → 0.3 s); stopped at 0 % or offline; no blur. Used on duty bars, equipment tiles, the 3D fan nodes. | `fan.*` duty %, availability |
| **Heat lines off the mat** | Three wavy strokes rising above the mat glyph, `dsc-heat-rise` 1.8 s staggered, opacity 0 → .6 → 0; amplitude scales with mat − air Δ°C. Off when the mat is off; dashed static glyph when OOS. | `switch.*heat_mat*`, mat/soil °C |
| **Refresh pulse** | When the entity bus tick changes a value, the numeral gets `.is-fresh` for 600 ms: opacity .7 → 1 and a 2 px teal underline sweep. Never on unchanged values. Panel legend shows `UPDATED 34s`. | bus tick + value diff |
| **Error glow** | Tone `bad` panels, tags and 3D nodes: slow box-shadow / emissive glow in `--dsc-bad-dim`, 2.4 s, while the condition is active; `warn` pulses once then holds; OOS never animates (dashed border is the whole signal). | tone from `zoneTone` |
| **Depth** | Elevation tokens `--dsc-elev-0..3` (shadow + 1 px inner top highlight `rgba(255,255,255,.04)`); panels `rgba(18,23,31,.6)` over the grid wash so the grid reads through; hover lifts one level (`translateY(-1px)`); legend-on-border; drawers at `elev-3` with blur. | — |
| **Control depress** | `:active` sinks 1 px and drops the shadow (primitives.md); actuators run a three-state flow: press → **waiting for brain to confirm** (dots on that button only, per the split-busy-flag rule) → confirmed flash (neon outline 400 ms) or failed (one `bad` shake + toast). | `EntityToggle` optimistic draft + bus confirm |
| **Gauge/arc entrance** | Existing `dsc-gauge-in`; arcs animate to value on first byte only, never on every tick. | — |

## Glanceable state: gauges, icons, trends

Colour stays for state only; shape and motion carry speed and activity.

- **Arc gauges** (`ArcGauge`, tone-coloured, band-aware) on the triad; **progress rings** (`progress` mode) for fan duty %, lamp %, day-of-cycle.
- **Trend arrow + 1 h delta** on every metric tile (`▲ 0.4 °C/h`, `▼ 3 %/h`), from history slope; flat within a deadband.
- **Sparkline** (24 h) on every metric in wide density, on hover in compact density (`Sparkline` exists).
- **Activity dot** — last-update recency: teal < 60 s, grey-dashed when held/stale, with the `HELD 14m` tag.
- **Phase chip**, **lamp dot** (glow when on), **alert badge** count, **direction of pull** glyphs (`↓ RH`, `↑ T`) on equipment tiles.
- **Icon set** — landed 2026-09-07 as the operator's *DSC-HUB Cultivation Icons v5* (165 mono SVGs, `docs/design/icons/dsc-hub-icons-v5`, generated into `iconSet.ts` by `scripts/gen-dsc-hub-icons.py`; gallery https://claude.ai/code/artifact/c76c0a86-d629-4154-aae7-ea90a800d567). `--on` = tone class; `--oos` = `.is-oos` dashed strokes, no second file. Nothing is missing from the set any more; unplaced glyphs are listed in `docs/FOLLOWUPS.md` § icons v5.
- **Duty bars** for fans (4 px, % on the right) and **stacked day bars** for lamp on-hours and energy.

## Interaction

- **Hover** (300 ms delay) → `Tooltip` primitive: exact value with unit, time of reading, last change (`61 % · 03:14 · was 64 % at 02:51`), want band, provenance for derived values ("from T + RH, leaf −1.5 °C"). Charts get a crosshair with every series at that time. Touch: first tap = tooltip, second tap = open.
- **Click** → the existing inspector drawer (`InspectorHost` / `EntityInspector`) with `HistoryDrawer` timespans, the alert playbook, provenance, related entities and a link to the owning desk. Zone card header → desk with `?zone=`; any metric → its chart; any equipment tile → its control with the confirm flow.
- **Control confirmation** — `EntityToggle` already routes through `DecisionLayer` when `confirm` is set; make confirm the default for every actuator that moves air, heat or light, with the depress → waiting → confirmed/failed states above. Abort stays enabled while the write is in flight.
- **Per-zone VPD chart with history** — `ZoneVpdChart`, one per grow space (4×8, 2×4, room), built on `viz/charts.tsx` + `useEntitySeries`/`useHistory`: air VPD trace, leaf VPD dashed, **this zone's band** shaded (stepped when bands changed with phase), lights-off shade from this zone's schedule, phase markers, alert markers, ranges 24 h / 7 d / cycle / custom, compare toggle ghosts the other zones, hover crosshair shows T · RH · VPD · want. Placement: mini (26 px) in the Overview zone panel that expands in place; full hero on Climate; trends tab on Logs. Band history needs `number.*` history from the brain (`useHistory` on number entities) or journal snapshots — confirm during Pass B.

## 3D twin, revisited

The Twin scene was retired on 2026-09-06 because it duplicated Root with worse legibility, ignored the component library and rendered blank WebGL "theater". It comes back on different terms now that the operator can author real models of spaces, devices and sensors (first model: the 2×4 tent above).

**Rules for the reboot**
1. Every coloured or moving part is **bound by node name to a live entity**; unbound parts render static grey. No demo motion.
2. The twin is a **view of Zone state**, never a data source; it uses the same tooltip and inspector as the cards, so nothing is only visible in 3D.
3. **Holographic wire**, not photoreal — the reveal-frame-00 look: teal/green wire over the grid wash, translucent shell (`window_acrylic` stays α .14), materials mapped to tokens (`trim_green` → tent accent, `foil_lining` → dim white).
4. Performance: lazy `twin-three` chunk (already in `vite.config.ts` `manualChunks`), mount only when in view, pause when hidden, 30 fps cap, static pre-rendered PNG on phones and under reduced-motion.
5. It never replaces a number; it shows *where* the number is.

**Model pipeline**
- Author in three-d-stage → export GLB (Draco optional) → `frontend/public/models/<slug>.glb`.
- Paste-ready briefs for every object (shared header, node names, materials, anchors, budgets, manifest rows, authoring order): `docs/design/models/BRIEFS.md`.
- `frontend/public/models/manifest.json`: `{ slug, kind: tent|room|device|sensor, dims_cm, anchors: { node → role } }`. The tent's `vent_port_roof_*`, `vent_port_side_*`, `cable_port_*`, `door_*`, `observation_window_*`, `floor_tray` are the anchors where fans, ducts, cables, probes and trays attach.
- Node naming convention for new models: `<device>_<role>[_n]` — `fan_intake`, `fan_exhaust`, `fan_blades` (the rotating child), `lamp_main`, `mat_1`, `probe_1`, `dehum`, `humidifier`, `heater`, `mister`, `hub`, `plug_n`.
- `lib/twin/bindings.ts`: per-zone map `anchor role → entity id` (from the Zone model's bound sensors/appliances), so a model is reusable across zones.
- Devices to model next, in the order they unlock views: 4×8 tent (240 × 120 × 210), SF1000 lamp, 4″ inline fan + duct, heat mat, probe stake, dehumidifier, Sonoff plug, hub box, room shell.

**Where it appears**
- Overview at the 2–6 rung: optional `3D | cards` toggle on the Room lung panel — the room as a wire box with the tents inside (reveal frame 00), fan/lamp/mat states live.
- Climate: per-zone twin inside the zone panel with airflow particles along duct paths (reuse `AirflowParticleScene` path logic) scaled by learned CFM.
- Root: probe stakes at their tray positions, moisture tone per probe.
- Kit: the device inventory drawn in place; `OUT` devices grey and dashed.

**3D motion**: fan blades rotate by duty; heat shimmer sprite above the mat; lamp emissive by brightness inside the photoperiod; particles by CFM; error = emissive pulse on the offending device; doors/vents static unless a sensor reports them.

## Design-system deltas (`frontend/src/styles/dsc.css`, `docs/design/tokens.*`)

Proposed additions; each is a real token, not an inline value:

| Token | Value | Why |
|---|---|---|
| `--dsc-lamp` / `--dsc-lamp-dim` | `#f5c26b` / `rgba(245,194,107,.5)` | "Light on" is its own state colour in every frame; today lamp state borrows amber/teal. |
| `--dsc-phase-veg/gen/bulk/finish/dry/cure` | `#66bb6a · #26c6da · #a78bfa · #ff8a65 · #ffb74d · #8b95a8` | Phase chips, one colour each, everywhere (1o). Aliases of existing hues except `finish` (`--dsc-orange` reuse) — document the aliasing. |
| `--dsc-rail` | `#c98a2e` | The lit segment on photoperiod rails (2a clocks). |
| `--dsc-radius-sm` | `4px` | **Decided: rounded-edged squares.** Panels, tags, chips, tiles and inputs use this; `--dsc-radius` (10) and `-lg` (14) remain for drawers, modals, toasts and public surfaces. |
| `--dsc-label` type role | `10px · .16em · uppercase · mono` | The eyebrow/legend label used on every panel. Add `.dsc-eyebrow` and `.dsc-legend` classes. |
| Fonts | see [Type](#type) | **Decided: not IBM Plex, a similar pair.** Self-hosted under `frontend/public/fonts/` (the Pi is LAN-only — no Google Fonts), first in the `--dsc-font` / `--dsc-mono` stacks so Windows and the Pi render alike. |
| Grid wash | `linear-gradient` 32 px grid at 3 % teal over `--dsc-black` | **Decided: grid wash** replaces the `dsc-stars` field on operator surfaces (`.dsc-root` background); `ParallaxStars` stays mountable for public/help pages. |

### Type

The design's look is a humanist grotesk with a matching mono, tabular figures, OFL-licensed, available as woff2. Candidates, closest to IBM Plex first:

| Pair | Why | Notes |
|---|---|---|
| **Fira Sans + Fira Mono** (recommended) | Same humanist, slightly technical voice as Plex; Fira Mono has the same "engineered" feel as Plex Mono; both carry tabular figures; weights 400/500/600/700 available; OFL. | `@fontsource/fira-sans`, `@fontsource/fira-mono` (npm, self-host, ~30 KB per weight woff2 latin subset). Use `font-variant-numeric: tabular-nums` on every numeric element. |
| Source Sans 3 + Source Code Pro | Adobe's humanist pair, very close x-height to Plex, excellent numerals. | `@fontsource/source-sans-3`, `@fontsource/source-code-pro`. Slightly softer than Plex. |
| Inter + JetBrains Mono | The default "dashboard" pair; Inter is neutral rather than humanist. | Fine but reads more generic than the reveal frames. |
| Geist + Geist Mono | Modern, very technical; mono is strong. | Less humanist than Plex. |

Decision for Pass A: Fira Sans (UI, 400/500/600/700) + Fira Mono (numbers, labels, 400/500), latin subset only, `font-display: swap`, with `"Segoe UI", system-ui` and `"Cascadia Code", ui-monospace` as fallbacks. Budget ≈ 180 KB woff2 total.

Primitives to add (all keyed to tokens, no raw hex — `primitives.md` rules apply):

- `Panel` — bordered square panel with a **legend label floating on the top border** (`ROOM · UMBRELLA LUNG · 22.6 °C · 64.7 % · 0.91 kPa`), tone-coloured border (`teal` room, `ok/warn/bad` tent). Wraps `Card`.
- `StatusTag` — square bordered uppercase tag (`HUB ONLINE`, `PROBE 2 HELD`, `1 CRITICAL`, `DARK PERIOD OK`); dashed border = OOS. Replaces the pill `StatusChip` on operator surfaces (keep `StatusChip` for the honesty rail until it is restyled).
- `PhaseChip` — `VEG / GEN / BULK / FINISH / DRY / CURE`.
- `Triad` — three `ArcGauge` + label + value + unit cells in a row (`TEMPERATURE · RELATIVE HUMIDITY · VAPOUR PRESSURE DEFICIT`), stale → grey arc + `HELD 14m` tag.
- `ZoneCard` — 1o anatomy: name · phase chip · day · lamp dot · alert badge / cultivar / VPD hero + temp + RH / footer `CO₂ · EC · VWC` (footer slots show `—` when unmeasured). `density="wide" | "compact" | "row"`.
- `DutyBars` — `IN 4×8 · IN 2×4 · EX ROOM · EX OUT` 4 px bars with % (replaces the fan chips on Overview).
- `TwoClocks` — the 2a clocks panel built on `TentLightClock` / `PhotoperiodTimeline`.
- `EquipmentTile` — name · state (`ON / IDLE / ARMED / OOS / %`) · direction of pull (`↓ RH`, `↑ T`) · sub-line (`pulling 61 → 58 · 14 min`, `arms below 56 %`).
- `MissionLine` — the one-line alert story with `OPEN MISSION →`.
- `MetricTile` — tabular figure + unit + delta or sparkline.
- Chart options in `viz/charts.tsx`: `markArea` target band behind the trace, `markLine` phase boundary, lights-off shade, dual-axis sawtooth (VWC left, EC right, shot ticks on the baseline).
- `ScaleLadder` — pure function `(zones) => "plant" | "tents" | "compact" | "strip"` driving Overview layout (3a).

## Data model work (brain)

Today the SPA hard-codes two spaces (`4x8`, `2x4`) plus `grow_room` / `dsc_core` for journals, and phase lives in `select.dsc_hub_grow_stage`. The design needs a `Zone` object:

```
Zone { id, name, kind: tent|container|rack|room, parent: room id | null,
       role: grow|dry|cure|empty, phase: veg|gen|bulk|finish (grow only), day, started_at,
       cultivar: CannaLib ref | null, bands: per-phase {vpd,temp,rh}, sensors: bound entity ids,
       appliances: bound + allowed-to-act, capabilities: {co2, ppfd, substrate_ec, ...} }
```

- **Phase 1 (SPA only):** a `lib/zoneModel.ts` view-model that builds two Zone objects from the existing entities (`sensor.dsc_hub_tent_*`, `sensor.dsc_hub_clone_*`, `number.dsc_hub_*_target_*`, grow stage select, roster summary). Overview, Climate and the cards consume Zones; nothing on the wire changes.
- **Phase 2 (brain):** `GET /zones`, `PATCH /zones/{id}` (name, role, cultivar, bands), Settings › Zones UI (1k). Role flip (3b) closes the grow run into the journal, parks probes, locks the lamp, swaps the rule set — the pieces already exist (journals, OOS gates, automation v2 rules) and need composing.
- **Capabilities gate rendering.** A zone without `co2` never shows a CO₂ slot as a number; it shows `—` (compact) or hides the tile (wide). This is how the INVENTED items stay honest.

## Passes (end-to-end, both tents at the same point in each)

Per the standing preference: one coherent pass at a time, 4×8 and 2×4 together, polish first-class. Each pass ends with `npx tsc --noEmit`, `npm run build`, a Pi hotpatch, screenshots against the design frame, and a dated `docs/FOLLOWUPS.md` section.

**Pass A — Navigation + language + Overview (2a, 2b via 3a).**
1. *Navigation first* (the operator's top complaint): the flat desk row, gear Settings, zone strip with `?zone=`, sub-tab rows, bottom bar, new routes + full legacy redirect table, status tags in the headline row. Every existing page keeps working under its new path before anything is restyled.
2. Tokens: `--dsc-radius-sm`, `--dsc-lamp`, phase colours, `--dsc-rail`, grid wash, Fira Sans/Mono self-hosted.
3. Primitives: `Panel` / `StatusTag` / `Triad` / `ZoneCard` / `DutyBars` / `TwoClocks` / `MissionLine` / compact grow log.
4. New `OverviewPage`: journals removed; `ScaleLadder` with the two real zones rendering the 2a layout and a fixture rendering 2b. First derived values land here (leaf VPD, in-band %, DLI estimate on the lamp tag, day of cycle).
5. Honesty: hub-offline, held probe, OOS mister all visible as in 2a; device-dependent slots show `—` + "possible with …".

**Pass B — Climate desk (1d in 2a language).** VPD hero + band track, setpoints-by-phase table (reads current bands; phase-driven bands land with Pass C), single chart with band/phase/lights-off, `EquipmentTile` row wired to real demand switches and the escalation ladder.

**Pass C — Zone model + role flip (3a/3b, 1k).** `zoneModel.ts` → brain `/zones` → Settings › Zones → role switcher with before/after diff; Dry role bands (T 15–18, RH 55–62 master, lamp locked). Phase chips replace the free-text grow stage.

**Pass D — Alerts & automation on Mission (1j).** Active-now cards with "what the hub did", 24 h history from the grow log, rules table from automation v2.

**Pass E — Light desk restyle (2a clocks, parts of 1f).** Clocks panel, driver mapping, energy tile with the "not a bill" line; PPFD/spectrum/recipe library stay gated.

**Pass F — Root / steering (1e, 3a rung 1).** Dry-back sawtooth from probe moisture history, plant-as-card for the single-tent rung, shot editor as an honest OOS tile until irrigation hardware exists.

**Pass G — CannaLib strain detail (1i).** Detail view + "runs in DSC-HUB" from journals.

**Pass H — Mobile (1l, 1m).** Bottom tab bar, compact zone list, one-zone climate. Cure vessel (1n) waits for Post-harvest.

**Pass I — 3D twin reboot.** After Pass C (needs Zone bindings). Model manifest + bindings, `TwinViewport` (lazy chunk, in-view mount, wire style), tent model in the Overview room panel and the Climate zone panel, fan/lamp/mat/probe bindings with the 3D motion rules, tooltip + inspector parity, phone fallback. A one-day **spike after Pass A** loads `grow-tent-120x60x210.glb` on the Pi bundle and measures load time and frame rate on the operator's phone and laptop before any UI is built on it.

**Cross-cutting in every pass:** the motion, glanceable-state and interaction sections above are acceptance criteria for each pass, not a polish pass at the end (fan blades and error glow land with Pass A's duty bars; heat lines with Pass B's equipment tiles; per-zone VPD chart with Pass B; control confirmation with the first actuator each pass touches).

**Parked (log as features, do not scaffold):** Propagation (1g), cure vessels / water activity / terpene trend (1h, 1n), facility KPIs (1b row, 3a rung 4), recipe library drag-to-apply (1f), spectrum mix, CO₂ and PPFD readings, per-site substrate probes.

## Frame → route → files

| Frame | Route | Files touched |
|---|---|---|
| 2a / 2b / 3a | `#/live/overview` | `pages/OverviewPage.tsx`, `components/DashHomeSections.tsx`, `components/TentLightClock.tsx`, `components/ui.tsx`, `styles/dsc.css`, new `lib/zoneModel.ts`, `lib/scaleLadder.ts` |
| 1d | `#/live/climate` | `pages/ClimatePage.tsx`, `viz/charts.tsx`, `lib/tentWant.ts`, `lib/climateMode.ts` |
| 1e | `#/live/root` | `pages/RootPage.tsx`, `components/PlantProbePanel.tsx`, `hooks/useHistory.ts`, `viz/charts.tsx` |
| 1f / 2a clocks | `#/live/light` | `pages/LightPage.tsx`, `components/PhotoperiodTimeline.tsx`, `components/energy/*` |
| 1j | `#/live/mission` | `pages/LiveMissionPage.tsx`, `lib/alertPlaybook.ts`, `components/settings/*` (automation rules) |
| 1i | `#/grow/research` | `pages/GrowPages.tsx`, `components/CatalogResearch.tsx`, `lib/journalApi.ts` |
| 1k / 3b | `#/settings/device` (+ new `zones` section) | `pages/SettingsPage.tsx`, `routes.ts`, brain `/zones` |
| 1l–1n | all | `App.tsx` shell, `styles/dsc.css` breakpoints |
| 1o | — | `components/ui.tsx`, `docs/design/primitives.md` |
| Per-zone VPD chart | Overview, Climate, Logs | new `components/ZoneVpdChart.tsx`, `viz/charts.tsx`, `hooks/useEntitySeries.ts`, `components/BandChartHost.tsx` |
| Motion / interaction | all | `styles/dsc.css` (keyframes, `--dsc-elev-*`), `iconSvg.ts`, new `components/Tooltip.tsx`, `components/EntityInspector.tsx`, `components/ui.tsx` (`EntityToggle` states) |
| 3D twin (reveal frame 00) | Overview, Climate, Root, Kit | `frontend/public/models/*.glb` + `manifest.json`, new `lib/twin/bindings.ts`, new `components/twin/TwinViewport.tsx`, `components/airflow/lungRoomPaths.ts`, `vite.config.ts` (`twin-three` chunk) |

## Decisions (operator, 2026-09-06)

| Question | Decision | Consequence in this plan |
|---|---|---|
| Panel geometry | **Rounded-edged squares** — square panels with a small radius, not the turn-1 pills. | `--dsc-radius-sm: 4px` on panels, tags, chips and tiles; keep `--dsc-radius` / `-lg` only for drawers, modals and public surfaces. Legend-on-border stays. |
| Fonts | **Not IBM Plex — find a similar pair.** | Self-host **Fira Sans + Fira Mono** (see [Type](#type)); fallbacks Source Sans 3 + Source Code Pro. |
| Background | **Grid wash.** | 32 px teal grid at 3 % on `--dsc-black` replaces the `dsc-stars` field on operator surfaces; stars stay available for public/help pages. |
| INVENTED values | Many are **examples of what is possible and hints at the devices that would deliver them**; but many high-value numbers are **derived from formulas or relationships between existing sensors** and must be shown. | New [Derived metrics layer](#derived-metrics-layer). Device-dependent slots show `—` plus a "possible with …" hint instead of a fake number. |
| Navigation | **Completely change it — it is the most broken part of the current dash.** | New [Navigation](#navigation) section; it becomes the first thing Pass A lands. |
| Journals on Overview | **Remove.** | Both `JournalScopePanel`s leave `OverviewPage`; Grow › Logs (now `#/logs`) is the only journal surface. The compact grow log (events, not notes) stays in 2a's third column. |

## Tracker

Design-gap findings from this review are logged in the Notion **DSC-HUB Issue & Recommendation Tracker** (Status: Idea / Not Started) — one row per pass, the parked features, the Overview journals duplication, the navigation rebuild (High) and the derived metrics layer. Font packages verified on npm 2026-09-06: `@fontsource/fira-sans`, `@fontsource/fira-mono`, `@fontsource/source-sans-3`, `@fontsource/source-code-pro` (all 5.3.0).
