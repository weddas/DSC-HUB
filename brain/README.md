# DSC Pi brain (7.0)

Offline brain package: catalogs + Want + decision ticks, fleet Native API ingest, **appliance driver** (hub demand → Sonoff relays), Settings/inventory, Zigbee permit-join hooks, and FastAPI + bundled SPA on **`:8787`**.

Canonical product story: [`docs/DSC-BRAIN.md`](../docs/DSC-BRAIN.md) · Ops: [`docs/qa/PI-APPLIANCE-7.0.md`](../docs/qa/PI-APPLIANCE-7.0.md) · Compose: [`services/dsc-hub/README.md`](../services/dsc-hub/README.md) · Notion [Product layers](https://app.notion.com/p/3b52b4cda37081c2bcafc85d3407556c)

**Version:** `__version__` / surface default **`7.0.0-dev`**; expected firmware **`7.0.0.0`** (`DSC_EXPECTED_FIRMWARE`).

## Quick start (dev host)

```bash
cd brain
python -m pip install -r requirements.txt
python -m dsc_brain.cli init-db
python -m dsc_brain.cli reload-catalogs
python -m dsc_brain.cli want generic_photoperiod
python -m dsc_brain.cli tick --seat pot1 --strain generic_photoperiod --temp 26.1 --rh 58
python -m dsc_brain.api   # http://127.0.0.1:8787/docs
pytest tests -q
```

Pi appliance: bootstrap + `docker compose` under `services/dsc-hub/` (not this folder alone).

## Layout

| Path | Role |
|---|---|
| `dsc_brain/catalog.py` | YAML/JSON packs → SQLite |
| `dsc_brain/want.py` | Want resolution |
| `dsc_brain/decision_loop.py` | Need vs Got + proposal |
| `dsc_brain/api.py` | FastAPI + SPA mount + lifespan workers |
| `dsc_brain/appliance_driver.py` | Hub demand switches → Sonoff `main_relay` (45s stale OFF) |
| `dsc_brain/fleet_state.py` / `esphome_client.py` | Native API ingest |
| `dsc_brain/settings.py` | Settings + inventory + roster SoT (`10.42.0.x` defaults) |
| `dsc_brain/integrations.py` | Ollama / CannaLib probes + catalog proxy |
| `dsc_brain/zigbee_mqtt.py` | MQTT ingest / permit-join |
| `dsc_brain/cli.py` | Offline ops without a server |
| `static/` | Bundled SPA (`npm run build:spa` in HA frontend) |

Catalog authoring remains under `homeassistant/data/` until packs move; the brain **loads** them without needing Home Assistant. Research corpus (N-087) lives in the sibling CannaLib repo.
