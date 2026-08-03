# HACS — DSC-HUB Lovelace cards (Dashboard)

Install the DSC-HUB Lovelace cards from this GitHub repo as a
**HACS custom repository** (category: **Dashboard**).

One resource (`DSC-HUB.js`) registers both:

- `custom:dsc-system-map-card` — neon isometric SYSTEM MAP
- `custom:dsc-airflow-map-card` — hybrid AIRFLOW STATUS map

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
| [`dist/DSC-HUB.js`](../dist/DSC-HUB.js) | Bundled cards (repo-name match) |
| [`dist/dsc-system-map-card.js`](../dist/dsc-system-map-card.js) | Same bundle (legacy `/local` filename) |
| [`dist/dsc-system-map.svg`](../dist/dsc-system-map.svg) | System map artwork |
| [`dist/dsc-airflow-map-card.js`](../dist/dsc-airflow-map-card.js) | Airflow card standalone source |

| `homeassistant/www/*` | **Source of truth** — run `scripts/sync-hacs-dist.sh` after edits |

CI workflow [`.github/workflows/hacs-dist.yml`](../.github/workflows/hacs-dist.yml)
keeps `dist/` synced on pushes that touch `homeassistant/www/`.

## Packages / dashboard YAML (not HACS)

Helpers, automations, and the full Lovelace dashboard are **not** HACS
plugins — they deploy via [`ha-sync.sh`](ha-sync.sh) / Unraid runner
([`HA-SYNC-BOOTSTRAP.md`](HA-SYNC-BOOTSTRAP.md)).

| Surface | Delivery |
|---|---|
| SYSTEM MAP + AIRFLOW STATUS cards | **HACS Dashboard** (this doc) |
| `packages/dsc_v4_*.yaml` + YAML dashboard + www fallback | Git push → HA sync |
| ESPHome firmware | Validate/Install (manual) |

## Cache after card updates

| Path | How the browser picks up new JS |
|---|---|
| **HACS** `/hacsfiles/DSC-HUB/DSC-HUB.js` | HACS **Redownload** (new asset hash / resource) + hard-refresh |
| **ha-sync** `/local/dsc-system-map-card.js?v=…` | Script rewrites `?v=` in `.storage/lovelace_resources` to `5.1.6-airflow-<UTC>` then `lovelace.reload` — see [`HA-SYNC-BOOTSTRAP.md`](HA-SYNC-BOOTSTRAP.md) §5 |
| **Sync add-on** `/local/…` | Overwrites www files only — **no** `?v=` rewrite today; bump Resources manually or hard-refresh after a bundle change |

Do not mix HACS and `/local` for the same cards — double-register fights are
harder to diagnose than a stale cache.
