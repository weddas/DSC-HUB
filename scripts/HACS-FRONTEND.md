# HACS — DSC-HUB Lovelace cards (Dashboard)

Install the DSC-HUB Lovelace cards from this GitHub repo as a
**HACS custom repository** (category: **Dashboard**).

One resource (`DSC-HUB.js`) registers:

- `custom:dsc-system-map-card` — neon isometric SYSTEM MAP
- `custom:dsc-airflow-map-card` — GUI-first isometric **tent airflow scene**
  (room size, tents, wall ports, fans, carbon filters, exhaust into room or
  through wall). Open **Edit card** for the visual editor; Add card uses DSC defaults.
- `custom:dsc-the-dash-card` — The Dash ops surface
- `custom:dsc-build-plant-card` — Build a Plant composition (separate dashboard)

Standalone `/local/dsc-build-plant-card.js` + `/local/dsc-catalog/*.json` are also
published for sites that register the builder resource separately. HACS alone
registers the custom element; **search indexes** still need Sync / ha-sync (or
manual copy of `www/dsc-catalog/`) under `/config/www/dsc-catalog/`.

Ops runbook: [`docs/qa/LIVE-UI-BUILD-A-PLANT.md`](../docs/qa/LIVE-UI-BUILD-A-PLANT.md).

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
type: custom:dsc-build-plant-card
title: Build a Plant
```

Edit the card in the Lovelace UI to configure room size, tents (1–4), routes
(wall → wall), fans, carbon filters, and whether exhaust goes **through the
wall (Outside)** or **into the room**. Advanced JSON is available in the editor
for dashboard-as-code workflows.

Optional entity overrides — see [`homeassistant/README.md`](../homeassistant/README.md).

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
| [`dist/DSC-HUB.js`](../dist/DSC-HUB.js) | Bundled cards (repo-name match; ~941 KB with Build a Plant) |
| [`dist/dsc-system-map-card.js`](../dist/dsc-system-map-card.js) | Same bundle (legacy `/local` filename) |
| [`dist/dsc-system-map.svg`](../dist/dsc-system-map.svg) | System map artwork |
| [`dist/dsc-airflow-map-card.js`](../dist/dsc-airflow-map-card.js) | Airflow card standalone source |
| [`dist/dsc-build-plant-card.js`](../dist/dsc-build-plant-card.js) | Build a Plant standalone |
| [`dist/dsc-catalog/`](../dist/dsc-catalog/) | Slim search indexes (not auto-served by HACS path) |

| `homeassistant/www/*` | **Source of truth** — run `scripts/sync-hacs-dist.sh` after edits |

CI workflow [`.github/workflows/hacs-dist.yml`](../.github/workflows/hacs-dist.yml)
keeps `dist/` synced on pushes that touch `homeassistant/www/`. On `master` it
commits `chore(hacs): sync dist/ from homeassistant/www` when `dist/` drifts.
PRs fail if `dist/` is stale — run `./scripts/sync-hacs-dist.sh` before merge.

**Visual pass 6.2.0 (`d6beefd` → HACS sync `5ccbc46`):** Dash glass + pot→tent
lerp and Build slide-out search live in `homeassistant/www/`. After that lands on
master, **HACS → DSC-HUB System Map → Redownload** + hard-refresh, or rely on
Sync www concat. The React Plant Seat page is **not** in this HACS bundle — it
ships via `custom_components/dsc_hub` (see
[`docs/qa/LIVE-UI-CUSTOM-PANEL.md`](../docs/qa/LIVE-UI-CUSTOM-PANEL.md)).

```mermaid
flowchart LR
  www["homeassistant/www"] --> script["sync-hacs-dist.sh"]
  script --> dist["dist/DSC-HUB.js"]
  dist --> hacs["HACS Redownload"]
  www --> sync["Sync www concat"]
  sync --> local["/local"]
```

## Packages / dashboard YAML (not HACS)

Helpers, automations, and the full Lovelace dashboard are **not** HACS
plugins — they deploy via [`ha-sync.sh`](ha-sync.sh) / Unraid runner
([`HA-SYNC-BOOTSTRAP.md`](HA-SYNC-BOOTSTRAP.md)).

| Surface | Delivery |
|---|---|
| SYSTEM MAP + AIRFLOW + The Dash + Build a Plant cards | **HACS Dashboard** (this doc) |
| React `/dsc-hub` panel + Plant Seat | Sync / `ha-sync` → `custom_components/dsc_hub` |
| Pot → tent SoT (`dsc_v4_pot_tent.yaml`) | Sync packages + Core restart once |
| Build a Plant catalog indexes + dashboard YAML | Sync add-on **5.1.4+** / `ha-sync.sh` |
| `packages/dsc_v4_*.yaml` + YAML dashboards + www fallback | Git push → HA sync |
| ESPHome firmware | Validate/Install (manual) |
