# DSC Pi brain (Phase B start)

Offline brain package: load curated catalogs into SQLite, resolve Want bands, dry-run decision ticks, and expose a small HTTP API.

The same DB file also hosts the **N-087 research corpus** (science↔seed archival
tables). Phase B pack reload and corpus ingest are separate schemas — see
[`docs/qa/CATALOG-RESEARCH-CORPUS.md`](../docs/qa/CATALOG-RESEARCH-CORPUS.md).

Canonical product story: [`docs/DSC-BRAIN.md`](../docs/DSC-BRAIN.md) · Notion [Product layers](https://app.notion.com/p/3b52b4cda37081c2bcafc85d3407556c)

## Quick start

```bash
cd brain
python -m pip install -r requirements.txt
python -m dsc_brain.cli init-db            # curated + corpus tables
python -m dsc_brain.cli reload-catalogs    # Phase B curated packs
python -m dsc_brain.cli corpus-stats       # research corpus counts (after ingest)
python -m dsc_brain.cli want generic_photoperiod
python -m dsc_brain.cli tick --seat pot1 --strain generic_photoperiod --temp 26.1 --rh 58
python -m dsc_brain.api   # http://127.0.0.1:8787/docs
```

## Layout

| Path | Role |
|---|---|
| `dsc_brain/catalog.py` | YAML/JSON packs → SQLite (Phase B) |
| `dsc_brain/corpus_schema.py` | N-087 research corpus DDL |
| `dsc_brain/corpus.py` | Corpus ingest / link / stats helpers |
| `dsc_brain/want.py` | Want resolution |
| `dsc_brain/decision_loop.py` | Need vs Got + proposal |
| `dsc_brain/api.py` | FastAPI surface for future web UI |
| `dsc_brain/cli.py` | Offline ops without a server (`init-corpus`, `corpus-stats`, …) |

Catalog authoring remains under `homeassistant/data/` until packs move; the brain **loads** them without needing Home Assistant. Fat research dumps stay gitignored; HA browse indexes are a slim projection rebuilt by `scripts/build_catalog_search_indexes.py`.
