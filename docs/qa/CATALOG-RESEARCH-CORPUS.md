# Catalog research corpus (N-087)

## Mission

Build a **research-scale archival plant catalog** (science + seed + lights + nutrients + media), then **project** a slim subset into HA Catalog indexes. The product does not ship the whole DB; we still gather the whole thing so relationships and coverage can be researched honestly.

| Layer | Job now | Later |
|---|---|---|
| Research SQLite (`brain/data/dsc_brain.sqlite3`) | Massive breadth + provenance + links | Source of truth for exports |
| HA `/local/dsc-catalog/*.json` | Thin projection (cap ~2500 strains) | Product browse/typeahead |
| Community export | Open/redistributable subset only | Public package after legal review |

## Schema highlights

- `strain_canonical` + `strain_variant` (breeder children)
- `chemistry_profile` (science evidence rows)
- `grow_trait`, `entity_link`, `science_alias`
- `attribute_kv` + `schema_extension_log` (never silently drop unfamiliar fields on seed/product rows)
- `source_record.redistributable` gates community export
- `media_asset` for cropped PPFD/spectrum graphs
- `followup_gap` for missing/unparseable expected fields

## Pipelines

```text
Wave A  scripts/import_strains_openthc.py
        scripts/import_strains_seedcity.py
        scripts/import_strains_wikileaf.py
        scripts/import_lab_terpenes_cannlytics.py
        scripts/import_strains_budprofiles.py   # if live
Wave B  scripts/scrape_seed_banks.py
Wave C  scripts/ingest_ppfd_maps.py
Wave D  scripts/import_nutrients_mediums_packs.py (+ brand dumps)
Merge   scripts/ingest_corpus_dumps.py --reset --link
Report  scripts/report_science_seed_links.py
HA      scripts/build_catalog_search_indexes.py
Export  scripts/export_community_catalog.py
```

Fat dumps under `homeassistant/data/dsc_*.json` and `media/` are **gitignored**. Commit importers, schema, crop tools, gap/link docs, and slim HA indexes.

## Honesty rules

- Never invent height / chem ranges / PPFD cell grids.
- Science↔seed links use exact `name_norm` (+ variant) with confidence/provenance.
- Bank HTML scrapes stay `redistributable=false` until legal review.
- Unfamiliar seed/product fields → `attribute_kv` (lab full rows stay in `payload_json`).

See also: [`CATALOG-SCIENCE-SEED-LINKS.md`](CATALOG-SCIENCE-SEED-LINKS.md), [`CATALOG-GAPS.md`](CATALOG-GAPS.md), FOLLOWUPS **N-087**.
