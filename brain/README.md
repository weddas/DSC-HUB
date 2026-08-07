# DSC Pi brain (Phase B start)

Offline brain package: load curated catalogs into SQLite, resolve Want bands, dry-run decision ticks, and expose a small HTTP API.

Canonical product story: [`docs/DSC-BRAIN.md`](../docs/DSC-BRAIN.md) · Notion [Product layers](https://app.notion.com/p/3b52b4cda37081c2bcafc85d3407556c)

## Quick start

```bash
cd brain
python -m pip install -r requirements.txt
python -m dsc_brain.cli init-db
python -m dsc_brain.cli reload-catalogs
python -m dsc_brain.cli want generic_photoperiod
python -m dsc_brain.cli tick --seat pot1 --strain generic_photoperiod --temp 26.1 --rh 58
python -m dsc_brain.api   # http://127.0.0.1:8787/docs
```

## Layout

| Path | Role |
|---|---|
| `dsc_brain/catalog.py` | YAML/JSON packs → SQLite |
| `dsc_brain/want.py` | Want resolution |
| `dsc_brain/decision_loop.py` | Need vs Got + proposal |
| `dsc_brain/api.py` | FastAPI surface for future web UI |
| `dsc_brain/cli.py` | Offline ops without a server |

Catalog authoring remains under `homeassistant/data/` until packs move; the brain **loads** them without needing Home Assistant.
