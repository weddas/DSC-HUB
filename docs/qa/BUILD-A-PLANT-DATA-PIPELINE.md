# Build a Plant — data pipeline (N-085)

```mermaid
flowchart LR
  master["dsc_brain.sqlite3"] --> idx["build_catalog_search_indexes.py"]
  curated["dsc_strain_catalog.yaml"] --> idx
  dumps["Fat dumps gitignored"] --> idx
  idx --> www["/local/dsc-catalog"]
  www --> card["Build a Plant card"]
  curated --> promote["promote_strain_catalog_to_ha.py"]
  promote --> ha["sensor.dsc_strain_catalog want_bands"]
  ha --> want["Want templates"]
  card -->|"Assign bridge"| seat["POT plant_name + Custom K"]
```

Default index build prefers SQLite projection (`height_cm` + `height_band`); `--from-dumps`
falls back to merged/dump JSON without band meta. Rebuild ops:
[`CATALOG-COLLATION-CONTRACT.md`](CATALOG-COLLATION-CONTRACT.md) § HA browse index rebuild.

## SoT

| Layer | Authoritative |
|---|---|
| Live seat | `text.dsc_potN_plant_name`, strain select, sprout |
| Chemistry Want | Catalog want_bands → Custom helpers → Generic stage |
| Climate Want | Custom temp/RH ≠0 only |
| Draft inventory | 8-slot roster |
| Mix | Shared nutrient slots + Accept (soak: no stock burn) |
| Fat dumps | Local only (gitignore) |
| Research corpus | `brain/data/dsc_brain.sqlite3` (gitignored) |
| Slim indexes | Committed under `www/dsc-catalog` / `dist/dsc-catalog` (`d4cdcab`: strains 2500 / `with_height=12` / `with_height_band=1`) |

## MVP gate (unblocks UI)

- Merged dump with chemistry on ≥1 selectable strain
- ≥1 light with `ppfd_url` in index/pack
- Nutrient + medium indexes non-empty
- Full ~36k crawl is best-effort, not a browser blocker

## Assign failure modes

- Free-text strain not in pot select → fill Custom slot + select `Custom K`
- No free Custom → persistent notification (no silent fail)
- Nickname always → `text.dsc_potN_plant_name` (+ underscore variant)
