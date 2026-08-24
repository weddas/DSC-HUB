# DSC Pi brain (Phase B start)

Offline brain package: load curated catalogs into SQLite, resolve Want bands, dry-run decision ticks, expose FastAPI + FleetSnapshot SPA APIs, and drive Sonoffs on the Pi path.

Canonical product story: [`docs/DSC-BRAIN.md`](../docs/DSC-BRAIN.md) · ops [`docs/qa/PI-APPLIANCE-7.0.md`](../docs/qa/PI-APPLIANCE-7.0.md) · Notion [Product layers](https://app.notion.com/p/3b52b4cda37081c2bcafc85d3407556c)

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
| `dsc_brain/fleet_state.py` | Live FleetSnapshot SoT for SPA |
| `dsc_brain/hub_controls.py` | Hub entity_id ↔ object_id maps (controls + sensors + binaries) |
| `dsc_brain/climate_math.py` | Tent/clone VPD from T/RH (ingest finalize) |
| `dsc_brain/compose_store.py` / `compose_ops.py` | Pi-native helpers + Build-a-Plant / cal scripts |
| `dsc_brain/computed_ops.py` / `dash_computed.py` | `hass_extras` for SPA |
| `dsc_brain/event_log.py` | Grow log (`GET /grow-log`) |
| `dsc_brain/control_ops.py` | `POST /control/service` → Native API / helpers / scripts |
| `dsc_brain/history_ops.py` | `GET /history` entity → fleet_history points (incl. room/clone) |
| `dsc_brain/native_api.py` | ESPHome 2026+ client factory (`noise_psk`) |
| `dsc_brain/esphome_client.py` | Fleet Native API ingest (`hub.values` vitals / `controls` / `binaries` + grow-log events) |
| `dsc_brain/appliance_driver.py` | Hub demand → Sonoff `main_relay` (Pi path) |
| `dsc_brain/hub_native.py` | Proposal emit path to hub |
| `dsc_brain/network_apply.py` | hostapd/dnsmasq render (AP PSK from settings) |
| `dsc_brain/settings.py` | Defaults + inventory seats (`10.42.0.x`) |
| `dsc_brain/api.py` | FastAPI + SPA surface |
| `dsc_brain/cli.py` | Offline ops without a server |
| `scripts/clear_hub_wifi_pref.py` | Clear hub preferred BSSID / Lock WiFi AP |
| `static/` | Prebuilt SPA assets (from `npm run build:spa`) |

Catalog authoring remains under `homeassistant/data/` until packs move; the brain **loads** them without needing Home Assistant.
