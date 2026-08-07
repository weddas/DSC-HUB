# LIVE-UI — Unified HA product shell (N-086)

Operator / developer runbook for the **Lovelace** N-086 product shell:
four primary sections aligned to [`docs/brain/WEBUI.md`](../brain/WEBUI.md).

> **Surface 6.0.0 cutover:** the sidebar product UI is now the React custom
> panel at `/dsc-hub` — see [`LIVE-UI-CUSTOM-PANEL.md`](LIVE-UI-CUSTOM-PANEL.md).
> This page documents the **YAML Lovelace fallback** (`dsc-hub-pro`,
> `show_in_sidebar: false`) and the N-086 route/card model still reused by
> `LegacyCardHost` inside the panel.

| Surface | Role |
|---|---|
| **Primary (6.0.0)** | `/dsc-hub` React panel — sidebar **DSC-HUB** |
| Lovelace fallback URL | **`/dsc-hub-pro/ops`** (sidebar hidden) |
| Primary tabs | Ops · Plant · Advanced · System |
| Surface version | `sensor.dsc_ha_surface_version` **6.0.0** (was 5.1.12 at N-086 land) |
| Shared chrome (YAML) | `custom:dsc-app-nav-card` |
| Catalog Explorer | `custom:dsc-catalog-browse-card` (panel `#/plant/catalog` or YAML `/catalog`) |
| Compose | `custom:dsc-build-plant-card` (panel `#/plant/build` or YAML `/plant-build`) |

HA is the **lab scaffold / wireframe** for the later Pi webserver. Do not treat
`input_*` coupling as durable product SoT — see [`docs/HA-SCAFFOLD.md`](../HA-SCAFFOLD.md).

## Route map (HA ↔ future web)

| Product section | Panel (6.0.0) | Lovelace fallback | Future web (WEBUI) |
|---|---|---|---|
| Ops | `/dsc-hub#/ops/home` | `/dsc-hub-pro/ops` | `/` |
| Plant (hub) | `/dsc-hub#/plant` | `/dsc-hub-pro/plant` | `/plant` |
| Compose | `/dsc-hub#/plant/build` | `/dsc-hub-pro/plant-build` | `/plant` compose mode |
| Catalog browse | `/dsc-hub#/plant/catalog` | `/dsc-hub-pro/catalog` | `/plant` research / browse mode |
| Fleet seats | `/dsc-hub#/plant/strains` | `/dsc-hub-pro/strains` | roster / Want–Need–Got |
| Mix lab | `/dsc-hub#/plant/nutrient` | `/dsc-hub-pro/nutrient-science` | plant / mix tools |
| Advanced | `/dsc-hub#/advanced/learning` | `/dsc-hub-pro/advanced` | `/advanced` |
| System | `/dsc-hub#/system` | `/dsc-hub-pro/system` | `/updates` (+ diagnostics) |

### Ops subviews

`home` · `dash` (The Dash cinema) · `climate` · `main-4x8` · `clone-2x4` ·
`root-zone` · `tank` · `lighting`

### Advanced subviews

`learning` · `trends` · `history`

## Catalog Explorer acceptance

1. Open **Plant → Catalog** (`/dsc-hub#/plant/catalog` or YAML `/dsc-hub-pro/catalog`).
2. Domain tabs: Strains · Nutrients · Mediums · Lights.
3. Filter strains by text; Want temp band overlap when indexed; height only when
   present (many dumps lack height — UI shows **not in catalog**, never invents).
4. Open detail: chem / Want bands / missing honesty line.
5. Compare 2–3 rows side-by-side.
6. **Use in Build** seeds composition helpers and navigates to Compose
   (`#/plant/build` / `plant-build`).
7. Nutrients show dose / stage when indexed; lights show PPFD URL when present.

Indexes: `/local/dsc-catalog/*.json` (schema v2). Rebuild:
`python scripts/build_catalog_search_indexes.py` then
`scripts/sync-hacs-dist.sh` / Sync / `ha-sync.sh`.

## Cutover notes

- **6.0.0:** merge `dsc_hub:` + hide Lovelace sidebar (`configuration.snippet.yaml`);
  restart Core so the custom panel registers. Ops checklist:
  [`LIVE-UI-CUSTOM-PANEL.md`](LIVE-UI-CUSTOM-PANEL.md).
- Old `/dsc-build-plant/build` dashboard stub redirects operators to Plant;
  `show_in_sidebar: false` in `configuration.snippet.yaml`.
- Deep-links in Strains / Nutrient Science still target YAML Compose/Catalog
  paths; panel hash routes are the operator default after 6.0.0.
- Bundle concat includes nav + catalog cards (`sync-hacs-dist.sh`, Sync add-on,
  `ha-sync.sh`) — still required for `LegacyCardHost` mounts inside the panel.

## Browser smoke checklist

- [x] Sidebar: one **DSC-HUB** entry → `/dsc-hub` (custom panel)
- [x] Four primary tabs only
- [x] Ops → Plant → Catalog compare → Use in Build
- [x] Compose typeahead / assign still live (`#/plant/build` or YAML fallback)
- [x] Advanced · System · Lighting PPFD subview reachable
- [x] Surface **6.0.0**; Sync ships `custom_components/dsc_hub`; catalog JSON intact
- [ ] Lovelace `dsc-hub-pro` remains reachable with sidebar hidden (fallback soak)

Related: [`LIVE-UI-CUSTOM-PANEL.md`](LIVE-UI-CUSTOM-PANEL.md) ·
[`LIVE-UI-BUILD-A-PLANT.md`](LIVE-UI-BUILD-A-PLANT.md) · FOLLOWUPS **N-086** / **6.0.0**
