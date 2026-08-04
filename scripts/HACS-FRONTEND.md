# HACS — DSC-HUB Lovelace cards (Dashboard)

Install the DSC-HUB Lovelace cards from this GitHub repo as a
**HACS custom repository** (category: **Dashboard**).

One resource (`DSC-HUB.js`) registers:

- `custom:dsc-system-map-card` — neon isometric SYSTEM MAP
- `custom:dsc-airflow-map-card` — GUI-first isometric **tent airflow scene**
  (room size, tents, wall ports, fans, carbon filters, exhaust into room or
  through wall). Open **Edit card** for the visual editor; Add card uses DSC defaults.
- `custom:dsc-the-dash-card` — **The Dash** Three.js ops surface (tents/ducts,
  mass-balanced air-path rail, pot charts, timeline). Requires `THREE` from
  `vendor/three.min.js` bundled **before** the Dash source.

## Add the custom repository

1. Open **HACS** in Home Assistant  
2. ⋮ (menu) → **Custom repositories**  
3. Repository: `https://github.com/weddas/DSC-HUB`  
4. Type / Category: **Dashboard** (plugin)  
5. **Add**

## Install / update

1. HACS → **Dashboard** (or search “DSC-HUB System Map”)  
2. **DSC-HUB System Map** → **Download** / **Redownload**  
3. Restart Home Assistant when HACS prompts (or reload resources)  
4. Hard-refresh the browser (Ctrl+F5)

HACS registers the resource automatically (typically
`/hacsfiles/DSC-HUB/DSC-HUB.js`). The system-map SVG ships beside it in `dist/`.

After The Dash ship, expect **`DSC-HUB.js` ≈ 800 KB**. If the file is ~10 KB
(system-map only) or ~33–61 KB (system+airflow without Three/Dash), Redownload
from current `master` — The Dash custom element will be missing otherwise.

## Use in Lovelace

```yaml
type: custom:dsc-system-map-card
title: DSC-HUB
```

```yaml
type: custom:dsc-airflow-map-card
title: AIRFLOW STATUS
```

```yaml
type: custom:dsc-the-dash-card
title: DSC-HUB // ADVANCED CULTIVATION CONTROL
subtitle: Zonal Cultivation Hub — 2-Tent System
```

The Pro dashboard ships The Dash at `/dsc-hub-pro/dash`
(`modules/view_dash.yaml`). Edit the card in the Lovelace UI for entity
overrides; duct topology is fixed in the card (not on-glass editable).

Optional entity overrides — see [`homeassistant/README.md`](../homeassistant/README.md).
Ops / triage: [`docs/qa/LIVE-UI-THE-DASH.md`](../docs/qa/LIVE-UI-THE-DASH.md).

## Browser Mod (required for popups)

The dashboard's popup layer (graph enlarge, appliance consoles, pot
detail) fires `browser_mod.popup`. Unlike the cards above, **Browser Mod
is a HACS *Integration***, not a Dashboard plugin:

1. HACS → **Integrations** → search **Browser Mod** → **Download**
2. Restart Home Assistant
3. **Settings → Devices & Services → Add Integration → Browser Mod**
4. Hard-refresh the browser (Ctrl+F5)

Without it, popup `tap_action`s silently do nothing — no error is shown.

## Layout (what HACS downloads)

| Path | Role |
|---|---|
| [`hacs.json`](../hacs.json) | HACS manifest (repo root) |
| [`dist/DSC-HUB.js`](../dist/DSC-HUB.js) | Bundled cards (repo-name match) |
| [`dist/dsc-system-map-card.js`](../dist/dsc-system-map-card.js) | Same bundle (legacy `/local` filename) |
| [`dist/dsc-system-map.svg`](../dist/dsc-system-map.svg) | System map artwork |
| [`dist/dsc-airflow-map-card.js`](../dist/dsc-airflow-map-card.js) | Airflow standalone source |
| [`dist/dsc-the-dash-card.js`](../dist/dsc-the-dash-card.js) | Dash standalone (needs THREE) |
| [`dist/vendor/three.min.js`](../dist/vendor/three.min.js) | THREE global (bundled before Dash) |

| `homeassistant/www/*` | **Source of truth** — run `scripts/sync-hacs-dist.sh` after edits |

CI workflow [`.github/workflows/hacs-dist.yml`](../.github/workflows/hacs-dist.yml)
keeps `dist/` synced on pushes that touch `homeassistant/www/`.

**Windows:** use `sync-hacs-dist.sh` / Node binary concat — PowerShell
`Get-Content` can corrupt JS Unicode (FOLLOWUPS).

## Packages / dashboard YAML (not HACS)

Helpers, automations, and the full Lovelace dashboard are **not** HACS
plugins — they deploy via [`ha-sync.sh`](ha-sync.sh) / Unraid runner
([`HA-SYNC-BOOTSTRAP.md`](HA-SYNC-BOOTSTRAP.md)) or the Sync add-on.

| Surface | Delivery |
|---|---|
| SYSTEM MAP + AIRFLOW + The Dash cards | **HACS Dashboard** (this doc) or www bundle |
| `packages/dsc_v4_*.yaml` + YAML shell + `modules/` + www fallback | Git push → HA sync |
| ESPHome firmware | Validate/Install (manual) |
