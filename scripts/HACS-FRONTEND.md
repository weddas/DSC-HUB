# HACS — DSC-HUB Lovelace cards (Dashboard)

Install the DSC-HUB Lovelace cards from this GitHub repo as a
**HACS custom repository** (category: **Dashboard**).

One resource (`DSC-HUB.js`) registers:

- `custom:dsc-system-map-card` — neon isometric SYSTEM MAP
- `custom:dsc-airflow-map-card` — GUI-first isometric **tent airflow scene**
  (room size, tents, wall ports, fans, carbon filters, exhaust into room or
  through wall). Open **Edit card** for the visual editor; Add card uses DSC defaults.
- `custom:dsc-the-dash-card` — The Dash / Twin 3D ops surface
- `custom:dsc-build-plant-card` — Build a Plant composition (separate dashboard)
- `custom:dsc-app-nav-card` — product-shell nav (Lovelace fallback)
- `custom:dsc-catalog-browse-card` — Catalog Explorer (Lovelace fallback)

Standalone `/local/dsc-build-plant-card.js` + `/local/dsc-catalog/*.json` are also
published for sites that register the builder resource separately. HACS alone
registers the custom element; **search indexes** still need Sync / ha-sync (or
manual copy of `www/dsc-catalog/`) under `/config/www/dsc-catalog/`.

Ops runbook: [`docs/qa/LIVE-UI-BUILD-A-PLANT.md`](../docs/qa/LIVE-UI-BUILD-A-PLANT.md) ·
Twin keep-alive: [`docs/qa/LIVE-UI-CUSTOM-PANEL.md`](../docs/qa/LIVE-UI-CUSTOM-PANEL.md).

## Dual delivery (React panel vs Lit cards)

| Surface | Ships via | Not in HACS `dist/` |
|---|---|---|
| React `/dsc-hub` shell (Live/Grow/Tune/Fleet, honesty rail, Plant Seat drawers) | Sync → `custom_components/dsc_hub` | Correct — panel is Vite-built |
| Lit Twin / maps / Build / nav / catalog cards | Sync www concat **or** HACS `dist/DSC-HUB.js` | Plant Seat / honesty rail stay panel-only |
| Catalog JSON indexes | Sync / ha-sync → `/local/dsc-catalog/` | HACS path does not serve indexes |

**Dashboard 7.0 (`335ddc9`):** `TwinKeepAlive` hosts `custom:dsc-the-dash-card` across
routes. Load order in `ensureLocalCards.ts`:

1. `/local/DSC-HUB.js`
2. `/local/dsc-system-map-card.js` (legacy filename; same bundle)
3. `/hacsfiles/DSC-HUB/DSC-HUB.js`

Missing card → empty Twin with “did not register”. Deploy Sync www **or** HACS
Redownload, then hard-refresh.

```mermaid
flowchart LR
  www["homeassistant/www SoT"] --> script["sync-hacs-dist.sh"]
  script --> dist["dist/DSC-HUB.js"]
  dist --> hacs["HACS Redownload"]
  www --> sync["Sync www 8-file concat"]
  sync --> local["/local"]
  local --> twinKA["TwinKeepAlive"]
  hacs --> twinKA
  panel["custom_components/dsc_hub"] --> react["/dsc-hub React shell"]
  react --> twinKA
```

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

**After every `chore(hacs): sync dist/ from homeassistant/www` on master:** Redownload
+ hard-refresh if you rely on HACS (Sync sites already get www via the add-on).

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
| [`dist/DSC-HUB.js`](../dist/DSC-HUB.js) | Bundled cards (repo-name match; ~**1013 KB** / ~1.0 MB) |
| [`dist/dsc-system-map-card.js`](../dist/dsc-system-map-card.js) | Same bundle (legacy `/local` filename) |
| [`dist/dsc-system-map.svg`](../dist/dsc-system-map.svg) | System map artwork |
| [`dist/dsc-*-card.js`](../dist/) | Standalone sources (airflow / the-dash / build-plant / app-nav / catalog-browse) |
| [`dist/dsc-catalog/`](../dist/dsc-catalog/) | Slim search indexes (not auto-served by HACS path) |
| [`dist/vendor/`](../dist/vendor/) | `three.min.js` + `dsc-dash-fx.js` copies |

| `homeassistant/www/*` | **Source of truth** — run `scripts/sync-hacs-dist.sh` after edits |

### Bundle concat order (`scripts/sync-hacs-dist.sh`)

`system-map` → `airflow` → `three.min` → `dsc-dash-fx` → `the-dash` →
`build-plant` → `app-nav` → `catalog-browse`.

Sync add-on **5.1.4+** uses the same eight inputs for `/local` concat (F-013
refuses demoting a live ≥500 KB bundle).

### CI + verify

Workflow [`.github/workflows/hacs-dist.yml`](../.github/workflows/hacs-dist.yml):

- On `master` pushes that touch `homeassistant/www/**` (or the sync script /
  `hacs.json` / the workflow): rebuilds `dist/` and commits
  `chore(hacs): sync dist/ from homeassistant/www` when it drifts.
- On PRs that touch those paths (or `dist/**`): **fails** if `dist/` is stale.

Local verify after any www edit (or after a suspicious sync commit):

```bash
./scripts/sync-hacs-dist.sh
git diff --stat -- dist/   # must be empty
```

**Pitfall (2026-08-11 `60ccefb`):** a sync commit can land with `dist/` that does
**not** match `www` (Twin HUD bands / bloom / ribbon radii drifted). Treat www as
SoT; re-run the script and commit the restore. Prefer Sync `/local` when HACS and
`/local` disagree — `TwinKeepAlive` tries `/local` first.

Do **not** register both `/hacsfiles/DSC-HUB/DSC-HUB.js` and a second
`/local/dsc-*-map-card.js` resource for the same elements (double-define risk).

## Packages / dashboard YAML (not HACS)

Helpers, automations, and the full Lovelace dashboard are **not** HACS
plugins — they deploy via [`ha-sync.sh`](ha-sync.sh) / Unraid runner
([`HA-SYNC-BOOTSTRAP.md`](HA-SYNC-BOOTSTRAP.md)).

| Surface | Delivery |
|---|---|
| SYSTEM MAP + AIRFLOW + The Dash + Build a Plant (+ nav/catalog) cards | **HACS Dashboard** (this doc) |
| React `/dsc-hub` panel + Plant Seat + Want/Full Auto + honesty rail | Sync / `ha-sync` → `custom_components/dsc_hub` |
| Pot → tent SoT (`dsc_v4_pot_tent.yaml`) | Sync packages + Core restart once |
| Build a Plant catalog indexes + dashboard YAML | Sync add-on **5.1.4+** / `ha-sync.sh` |
| `packages/dsc_v4_*.yaml` + YAML dashboards + www fallback | Git push → HA sync |
| ESPHome firmware | Validate/Install (manual) |
