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
