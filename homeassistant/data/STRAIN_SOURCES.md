# Strain data sources (N-087 research corpus)

Working fat dumps live under `homeassistant/data/` (**gitignored**). Rebuild with Wave A/B importers, then ingest:

```text
python scripts/import_strains_openthc.py
python scripts/import_strains_seedcity.py
python scripts/import_strains_wikileaf.py
python scripts/import_lab_terpenes_cannlytics.py --max-rows 30000
python scripts/scrape_seed_banks.py --limit 80
python scripts/ingest_corpus_dumps.py --reset --link
python scripts/report_science_seed_links.py
python scripts/build_catalog_search_indexes.py
python scripts/export_community_catalog.py
```

| Dump / source | Role | Redistributable? |
|---|---|---|
| `dsc_strains_openthc.json` | OpenTHC VDB varieties | yes (upstream open) |
| `dsc_strains_seedcity.json` | Seed City CC0 HF dataset (~8910) | yes (CC0) |
| `dsc_strains_wikileaf.json` | Wikileaf-derived grow_data mirror | yes if MIT mirror |
| `dsc_lab_terpenes_cannlytics.json` | Cannlytics lab results (MD sample) | yes (CC-BY-4.0) |
| `dsc_strains_{herbies,rqs,ilgm,…}.json` | Bank HTML research scrapes | **no** until legal review |
| `dsc_strain_catalog.yaml` | Curated Want bands (committed) | DSC curated |
| `dsc_strains_popular.json` | MVP fixture seed | local |

Research SQLite: `brain/data/dsc_brain.sqlite3` (gitignored). HA browse indexes: `homeassistant/www/dsc-catalog/*_search_index.json` (committed projection).

See [`docs/qa/CATALOG-RESEARCH-CORPUS.md`](../docs/qa/CATALOG-RESEARCH-CORPUS.md).
