# HACS — DSC-HUB Lovelace cards (Dashboard)

Install the DSC-HUB Lovelace cards from this GitHub repo as a
**HACS custom repository** (category: **Dashboard**).

One resource (`DSC-HUB.js` ≡ `dsc-system-map-card.js`, **~846 KB**) registers:

- `custom:dsc-system-map-card` — neon isometric SYSTEM MAP
- `custom:dsc-airflow-map-card` — GUI-first isometric **tent airflow scene**
  (room size, tents, wall ports, fans, carbon filters, exhaust into room or
  through wall). Open **Edit card** for the visual editor; Add card uses DSC defaults.
- `custom:dsc-the-dash-card` — Three.js cinematic tent/duct ops view (needs
  vendored THREE + `dsc-dash-fx` inside the same classic `js` resource)

**Do not** install `homeassistant/www/dsc-system-map-card.js` alone (~10 KB
source). Publishers must concatenate — see
[`docs/qa/LIVE-UI-WWW-BUNDLE-GUARDS.md`](../docs/qa/LIVE-UI-WWW-BUNDLE-GUARDS.md).

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
| [`dist/DSC-HUB.js`](../dist/DSC-HUB.js) | Cinematic bundle (~846 KB, repo-name match) |
| [`dist/dsc-system-map-card.js`](../dist/dsc-system-map-card.js) | Same bundle (legacy `/local` filename) |
| [`dist/dsc-system-map.svg`](../dist/dsc-system-map.svg) | System map artwork |
| [`dist/dsc-airflow-map-card.js`](../dist/dsc-airflow-map-card.js) | Airflow card standalone source |
| [`dist/dsc-the-dash-card.js`](../dist/dsc-the-dash-card.js) | Dash standalone source |
| [`dist/vendor/`](../dist/vendor/) | `three.min.js` + `dsc-dash-fx.js` (also inside bundle) |

| `homeassistant/www/*` | **Source of truth** — run `scripts/sync-hacs-dist.sh` after edits |

**Concat order:** system-map → airflow → `vendor/three.min.js` →
`vendor/dsc-dash-fx.js` → `dsc-the-dash-card.js` (Node/binary concat; avoid
PowerShell `Get-Content` — Unicode corruption).

CI workflow [`.github/workflows/hacs-dist.yml`](../.github/workflows/hacs-dist.yml)
keeps `dist/` synced on pushes that touch `homeassistant/www/`.

After Redownload: `wc -c` the served JS — expect **≥ 500000** (healthy ~846 KB).
~10 KB ⇒ stub; ~33–61 KB ⇒ pre-THREE era.

## Publish matrix

| Path | www bundle | Modules `view_*.yaml` | Lovelace `?v=` |
|---|---|---|---|
| **Sync add-on ≥ 5.1.3** | Five-part concat + F-013 guards | Yes | No (manual / WS) |
| **`ha-sync.sh`** | Five-part concat | Yes | `dash-<UTC>` |
| **HACS Redownload** | Uses `dist/` bundle | No | HACS resource URL |

## Packages / dashboard YAML (not HACS)

Helpers, automations, and the full Lovelace dashboard are **not** HACS
plugins — they deploy via Sync / [`ha-sync.sh`](ha-sync.sh)
([`HA-SYNC-BOOTSTRAP.md`](HA-SYNC-BOOTSTRAP.md) / [`ADDON.md`](ADDON.md)).

| Surface | Delivery |
|---|---|
| SYSTEM MAP + AIRFLOW + The Dash cards | **HACS** and/or Sync/ha-sync www bundle |
| `packages/dsc_v4_*.yaml` + YAML dashboard + modules | Git push → Sync / ha-sync |
| ESPHome firmware | Validate/Install (manual) |
