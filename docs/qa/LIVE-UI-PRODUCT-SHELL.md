# LIVE-UI — Unified HA product shell (N-086)

> **Superseded for day-to-day ops by surface 7.0.** The React custom panel at
> `/dsc-hub` is now **Live / Grow / Tune / Fleet** — see
> [`LIVE-UI-CUSTOM-PANEL.md`](LIVE-UI-CUSTOM-PANEL.md) and
> [`VERSION-TRAINS.md`](VERSION-TRAINS.md). This page remains the Lovelace
> YAML / Catalog Explorer lab-scaffold record (N-086).

Operator / developer runbook for the single **DSC-HUB** Lovelace product:
four primary sections aligned to [`docs/brain/WEBUI.md`](../brain/WEBUI.md).

| Surface | Role |
|---|---|
| Dashboard URL | **`/dsc-hub-pro/ops`** (YAML fallback; sidebar hidden when React panel is enabled) |
| Sidebar (product) | **DSC-HUB** → `/dsc-hub` React panel (surface **7.0.0**) |
| Primary tabs (Lovelace YAML) | Ops · Plant · Advanced · System (historical N-086) |
| Primary tabs (React 7.0) | Live · Grow · Tune · Fleet |
| Surface version | `sensor.dsc_ha_surface_version` **7.0.0** |
| Shared chrome (YAML) | `custom:dsc-app-nav-card` |
| Catalog Explorer | `custom:dsc-catalog-browse-card` @ `/dsc-hub-pro/catalog` (also Grow · Research) |
| Compose | `custom:dsc-build-plant-card` @ `/dsc-hub-pro/plant-build` (also Grow · Compose) |

HA is the **lab scaffold / wireframe** for the later Pi webserver. Do not treat
`input_*` coupling as durable product SoT — see [`docs/HA-SCAFFOLD.md`](../HA-SCAFFOLD.md).

## Route map (HA ↔ future web)

| Product section | HA path | Future web (WEBUI) |
|---|---|---|
| Ops | `/dsc-hub-pro/ops` | `/` |
| Plant (hub) | `/dsc-hub-pro/plant` | `/plant` |
| Compose | `/dsc-hub-pro/plant-build` | `/plant` compose mode |
| Catalog browse | `/dsc-hub-pro/catalog` | `/plant` research / browse mode |
| Fleet seats | `/dsc-hub-pro/strains` | roster / Want–Need–Got |
| Mix lab | `/dsc-hub-pro/nutrient-science` | plant / mix tools |
| Advanced | `/dsc-hub-pro/advanced` | `/advanced` |
| System | `/dsc-hub-pro/system` | `/updates` (+ diagnostics) |

### Ops subviews

`home` · `dash` (The Dash cinema) · `climate` · `main-4x8` · `clone-2x4` ·
`root-zone` · `tank` · `lighting`

### Advanced subviews

`learning` · `trends` · `history`

## Catalog Explorer acceptance

1. Open **Plant → Catalog** (`/dsc-hub-pro/catalog`).
2. Domain tabs: Strains · Nutrients · Mediums · Lights.
3. Filter strains by text; Want temp band overlap when indexed; height only when
   present (many dumps lack height — UI shows **not in catalog**, never invents).
4. Open detail: chem / Want bands / missing honesty line.
5. Compare 2–3 rows side-by-side.
6. **Use in Build** seeds composition helpers and navigates to `plant-build`.
7. Nutrients show dose / stage when indexed; lights show PPFD URL when present.

Indexes: `/local/dsc-catalog/*.json` (schema v2). Rebuild:
`python scripts/build_catalog_search_indexes.py` then
`scripts/sync-hacs-dist.sh` / Sync / `ha-sync.sh`.

## Cutover notes

- Old `/dsc-build-plant/build` dashboard stub redirects operators to Plant;
  `show_in_sidebar: false` in `configuration.snippet.yaml`.
- Deep-links in Strains / Nutrient Science now point at `/dsc-hub-pro/plant-build`
  and `/dsc-hub-pro/catalog`.
- Bundle concat includes nav + catalog cards (`sync-hacs-dist.sh`, Sync add-on,
  `ha-sync.sh`).

## Browser smoke checklist

- [x] Sidebar: one **DSC-HUB** entry
- [x] Four primary tabs only
- [x] Ops → Plant → Catalog compare → Use in Build
- [x] Compose typeahead / assign still live (`/dsc-hub-pro/plant-build`)
- [x] Advanced · System · Lighting PPFD subview reachable
- [x] Surface **5.1.12**; Sync **boot=auto** / started; JSON `fixtures` / `want_bands` intact

Related: [`LIVE-UI-BUILD-A-PLANT.md`](LIVE-UI-BUILD-A-PLANT.md) · FOLLOWUPS **N-086**
