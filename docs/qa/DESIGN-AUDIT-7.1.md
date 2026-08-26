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
