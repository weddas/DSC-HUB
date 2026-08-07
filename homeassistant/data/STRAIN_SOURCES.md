# Strain data sources (N-087 research corpus)

Working fat dumps live under `homeassistant/data/` (**gitignored**). Rebuild with Wave A/B importers, then ingest:

```text
python scripts/import_db_dump_folder.py
python scripts/import_strains_openthc.py
python scripts/import_strains_seedcity.py
python scripts/import_strains_wikileaf.py
python scripts/import_strains_kushy.py
python scripts/import_strains_cannabis_intelligence.py
python scripts/import_strains_lynch_figshare.py
python scripts/import_lab_terpenes_cannlytics.py --max-rows 30000
python scripts/import_lab_terpenes_maxvalue.py
python scripts/import_lab_phytochemical_diversity.py
python scripts/import_dolthub_pointer.py
python scripts/persist_seed_breeders_inventory.py
python scripts/build_forum_discovery.py
python scripts/scrape_seed_banks.py --limit 50
python scripts/scrape_strain_directories.py --limit 120
python scripts/ingest_corpus_dumps.py --reset --link
# Prefer aggregated lab: skips dsc_lab_replication.json (215k raw) and parquet image shard by default
python scripts/report_science_seed_links.py
python scripts/build_catalog_search_indexes.py
python scripts/export_community_catalog.py
```

| Dump / source | Role | Redistributable? |
|---|---|---|
| `dsc_strains_openthc.json` | OpenTHC VDB varieties | yes (upstream open) |
| `dsc_strains_seedcity.json` / `_local.json` | Seed City CC0 (~8910; local DB DUMP richer typed grow) | yes (CC0) |
| `dsc_strains_wikileaf.json` | Wikileaf-derived grow_data mirror | yes if MIT mirror |
| `dsc_strains_kushy.json` | Kushy MIT strain CSV (~9523) | yes (MIT) |
| `dsc_strains_cannabis_intelligence.json` | Cannabis Intelligence DB (~15740; MIT) | yes (MIT) |
| `dsc_strains_lynch_figshare.json` | Lynch et al. 2016 variety/FLOCK (~322) | no (academic supplemental) |
| `dsc_strains_leafly_flat.json` | Leafly-style flattened percentiles (~8492) | **no** |
| `dsc_strains_leafly_kaggle.json` / `_github.json` / `_features.json` | Kaggle-class Leafly mirrors | **no** |
| `dsc_strains_pickle_archive.json` | DB DUMP archive (3) pickles (~1217; numpy OK) | **no** / research |
| `dsc_strains_cannia.json` | Cannia app strains.json (~1970) | **no** |
| `dsc_strains_strains_master.json` | strains-master name list (~1477) | **no** |
| `dsc_strains_medical_effects.json` | Medical/effect scores slim (~4756; full matrix in CSV SoT) | **no** |
| `dsc_strains_kushy_crosses_local.json` | Kushy crosses local CSV (~9523) | yes (MIT) |
| `dsc_strains_north_atlantic_local.json` | NAS Co local scrape dump (~3043) | **no** |
| `dsc_strains_mj_simple.json` / `project_lists.json` | Strain project type lists | **no** |
| `dsc_lab_replication_wa.json` | WA lab tests aggregated unique strains (~10k) | **no** (research) |
| `dsc_lab_phytochem_lab.json` | Phytochem agg by slug (~3087 named; ~16.5k anon in CSV) | **no** |
| `dsc_strains_parquet_train.json` | **SKIP** — image+label shard (158 rows), not strain chem | n/a |
| `dsc_lab_replication.json` | Raw 215k lab rows (skip by default; prefer `_wa`) | **no** |
| `dsc_lab_terpenes_cannlytics.json` | Cannlytics lab results | yes (CC-BY-4.0) |
| `dsc_lab_terpenes_maxvalue.json` | MaxValue terpene profiles | yes if upstream open |
| `dsc_lab_phytochemical_diversity.json` | Smith phytochem lab (~90k rows; agg→`phytochem_smith` staging) | **no** (academic) |
| `dsc_lab_dolthub_wa_pointer.json` | DoltHub `Liquidata/cannabis-testing-wa` = same as Replication_Data | **no** |
| `dsc_strains_cannaconnection.json` | CannaConnection directory scrape | **no** |
| `dsc_strains_hytiva.json` | Hytiva directory scrape | **no** |
| `dsc_strains_alchimia.json` | Alchimia `en/sitemap-products.xml` → `*-product-N.php` (Cannabis seeds) | **no** until legal review |
| `dsc_strains_{cropking,zamnesia,seedsupreme,herbies,rqs,ilgm}.json` | Bank HTML research scrapes | **no** until legal review |
| `SEED_BREEDERS.md` / `dsc_seed_breeders.json` | User inventory: ~1482 breeders + forums + banks | committed inventory |
| `dsc_forum_discovery.json` | Forum name→URL map (scrape pending) | research |
| `dsc_strain_catalog.yaml` | Curated Want bands (committed) | DSC curated |

Research SQLite: `brain/data/dsc_brain.sqlite3` (gitignored). HA browse indexes: `homeassistant/www/dsc-catalog/*_search_index.json` (committed projection).

See [`docs/qa/CATALOG-RESEARCH-CORPUS.md`](../docs/qa/CATALOG-RESEARCH-CORPUS.md).
