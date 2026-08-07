# DSC Pi brain (Phase B)

Offline brain package: load curated catalogs into SQLite, resolve Want bands, dry-run decision ticks, and expose a small HTTP API.

Canonical product story: [`docs/DSC-BRAIN.md`](../docs/DSC-BRAIN.md) · Ops runbook: [`docs/qa/DSC-BRAIN-PHASE-B.md`](../docs/qa/DSC-BRAIN-PHASE-B.md) · Notion [Product layers](https://app.notion.com/p/3b52b4cda37081c2bcafc85d3407556c)

## Quick start

```bash
cd brain
python3 -m pip install -r requirements.txt
python3 -m dsc_brain.cli init-db
python3 -m dsc_brain.cli reload-catalogs
python3 -m dsc_brain.cli want generic_photoperiod
python3 -m dsc_brain.cli tick --seat pot1 --strain generic_photoperiod --temp 26.1 --rh 58
python3 -m dsc_brain.api   # http://127.0.0.1:8787/docs
```

Expect roughly `strains: 12`, `nutrients: 2`, `mediums: 1`, `lights: 7` after reload on current curated packs.

## Layout

| Path | Role |
|---|---|
| `dsc_brain/catalog.py` | YAML/JSON packs → SQLite |
| `dsc_brain/want.py` | Want resolution (custom → catalog → stage) |
| `dsc_brain/decision_loop.py` | Need vs Got + proposal |
| `dsc_brain/api.py` | FastAPI surface for future web UI |
| `dsc_brain/cli.py` | Offline ops without a server |
| `data/dsc_brain.sqlite3` | Local DB (gitignored) |

Catalog authoring remains under `homeassistant/data/` until packs move; the brain **loads** them without needing Home Assistant.

## Constraints

- `emit=True` is still dry-run (noop command) until Phase D hub client
- CLI Got fields today: `--temp` / `--rh` only
- CLI `search` kinds are singular; API `/catalogs/` accepts singular or plural
- Do not flash `firmware/v4/dsc-appliance-bridge.yaml` (F-010 sketch)
