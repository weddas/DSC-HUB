# LIVE-UI — Unified HA product shell (N-086)

Operator / developer runbook for the single **DSC-HUB** Lovelace product:
four primary sections aligned to [`docs/brain/WEBUI.md`](../brain/WEBUI.md).

| Surface | Role |
|---|---|
| Dashboard URL | **`/dsc-hub-pro/ops`** (default landing) |
| Sidebar | One entry: **DSC-HUB** |
| Primary tabs | Ops · Plant · Advanced · System |
| Surface version | `sensor.dsc_ha_surface_version` **5.1.13** |
| Shared chrome | `custom:dsc-app-nav-card` |
| Catalog Explorer | `custom:dsc-catalog-browse-card` @ `/dsc-hub-pro/catalog` |
| Compose | `custom:dsc-build-plant-card` @ `/dsc-hub-pro/plant-build` |

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
   present (N-087 committed index: `with_height=21` of 2500 — UI shows **not in
   catalog** when absent, never invents).
4. Open detail: chem / Want bands / missing honesty line.
5. Compare 2–3 rows side-by-side.
6. **Use in Build** seeds composition helpers and navigates to `plant-build`.
7. Nutrients show dose / stage when indexed; lights show PPFD URL when present.

Indexes: `/local/dsc-catalog/*.json` (schema v2). Default rebuild projects
**strains from research SQLite** (cap 2500); nutrients/mediums/lights still from
packs/dumps — see [`CATALOG-RESEARCH-CORPUS.md`](CATALOG-RESEARCH-CORPUS.md).

```bash
python scripts/build_catalog_search_indexes.py
# then scripts/sync-hacs-dist.sh / Sync / ha-sync.sh
```

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
- [x] Surface **5.1.13**; Sync **boot=auto** / started; JSON `fixtures` / `want_bands` intact

Related: [`LIVE-UI-BUILD-A-PLANT.md`](LIVE-UI-BUILD-A-PLANT.md) ·
[`CATALOG-RESEARCH-CORPUS.md`](CATALOG-RESEARCH-CORPUS.md) · FOLLOWUPS **N-086** / **N-087**
