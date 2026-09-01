# Local webserver UI spec

**In one line:** Thin client of the brain API — presentation, advanced control, updates.

Notion: [Local webserver UI](https://app.notion.com/p/3b52b4cda37081c19048e794d4bdf819)

**Tip:** `3d1ead4` · spa-dist `index-DYFvyI2i.js` (+ `calibrate-DcOg5koY.js` · `tune-fleet-B5F45eEz.js` · `twin-three-BjdbWAdH.js`) · space-energy walk [`../qa/SPACE-ENERGY-PI-WALK-2026-09.md`](../qa/SPACE-ENERGY-PI-WALK-2026-09.md) · Live UX Pass 1 [`LIVE-UX-HONESTY.md`](LIVE-UX-HONESTY.md)

## Product SPA (Pi `:8787`)

Hash-routed React SPA under `homeassistant/custom_components/dsc_hub/frontend` (built into `spa-dist` / brain static). Default landing `#/live/overview`.

| Route (hash) | Job |
|--------------|-----|
| `#/live/overview` | Kit honesty, vitals, **Room journal** + **DSC-Core journal** |
| `#/live/light` | Tent clocks, PhotoperiodTimeline, LightEnergyPanel, TentOccupancyJournal |
| `#/live/climate` | Climate Mode + air path / CFM honesty |
| `#/live/root` | Probe Got/Need / SoftCal entry |
| `#/grow/*` | Roster, Compose wizard, plant mini journal |
| `#/settings` | Spaces/devices/tariff/Learning (`SpaceEnergySettingsCard`), Zigbee, inventory |
| `#/tune/*` | Seat Learning log — **not** energy Learning |

## Space / energy / journals (this tip)

| Surface | Status |
|---------|--------|
| PlantMiniJournal · TentOccupancyJournal · LightEnergyPanel | **live** |
| RoomJournal · CoreJournal on Overview | **live** (`grow_room` → Core rollup) |
| `/rooms` · `/journal/room/*` · `/journal/core` | **live** |
| Approve-only shifts (`confirm=true`) · Learning `apply: false` | **live** both tents |

Developer SoT: [`SPACE-ENERGY-JOURNAL.md`](SPACE-ENERGY-JOURNAL.md) · [`PHOTOPERIOD-TIMELINE.md`](PHOTOPERIOD-TIMELINE.md) · [`LIVE-UX-HONESTY.md`](LIVE-UX-HONESTY.md).

## API dependency

All reads/writes go through brain HTTP (`brain/dsc_brain/api.py`), including:

- `GET /health` · `GET /fleet` · `GET /fleet/computed` · `GET /ws/fleet`
- `GET/POST /journal/plant|space|room|core` · `GET /rooms` · `GET/POST /spaces` · `/energy/*`
- `GET /catalogs/strains?q=` · roster / control / history routes

## Non-goals

- Embedding fat strain dumps in the browser
- Requiring Home Assistant for product ops
- Silent schedule mutate from SPA without confirm

## Host

Pi 4 4GB+ LAN (`http://dsc-brain.local:8787` or IP). Windows hotpatch: PuTTY `pscp`/`plink` `-batch -hostkey` — see `.audit/space-energy-pi-closure.ps1`.

## Related MVP stub note

Early `/` `/plant` `/advanced` `/updates` wireframes below remain historical intent for a thin static shell; the **shipping** operator desk is the hash SPA above.

### Historical MVP routes (scaffold)

| Route | Job |
|---|---|
| `/` | Ops overview (vitals, ladder summary, alerts) |
| `/plant` | Build a Plant + roster + catalog browse (research) |
| `/advanced` | Profiles, cal, overrides (API calls only) |
| `/updates` | Brain version, catalog reload, firmware flash checklist |

> **HA wireframe (N-086):** Home Assistant `/dsc-hub-pro/catalog` is the interim research browser over `/local/dsc-catalog/*.json`. Durable browse mode calls brain catalog APIs — reuse section jobs/labels, not HA helper coupling ([`docs/HA-SCAFFOLD.md`](../HA-SCAFFOLD.md)).
