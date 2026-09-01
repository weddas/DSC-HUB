# Local webserver UI spec

**In one line:** Thin client of the brain API — presentation, advanced control, updates.

Notion: [Local webserver UI](https://app.notion.com/p/3b52b4cda37081c19048e794d4bdf819)

**Tip:** `6ce9ea5` · spa-dist `index-BoyhWWR_.js` (+ `calibrate-CYRum8WF.js` · `tune-fleet-BPdxWQzJ.js` · `twin-three-BjdbWAdH.js`)  
**Walks:** space-energy [`../qa/SPACE-ENERGY-PI-WALK-2026-09.md`](../qa/SPACE-ENERGY-PI-WALK-2026-09.md) · Live UX [`LIVE-UX-HONESTY.md`](LIVE-UX-HONESTY.md) · Pass 5 [`../qa/LIVE-UX-PASS5-WALK-2026-09.md`](../qa/LIVE-UX-PASS5-WALK-2026-09.md)

## Product SPA (Pi `:8787`)

Hash-routed React SPA under `homeassistant/custom_components/dsc_hub/frontend` (built into `spa-dist` / brain static). Default landing `#/live/overview`.

| Route (hash) | Job |
|--------------|-----|
| `#/live/overview` | Kit honesty, vitals, photoperiod glance (same SoT as Light), **Room/Core journals** (provenance chips), root OOS grey, grow-log ≠ live banners |
| `#/live/light` | Tent clocks, PhotoperiodTimeline, LightEnergyPanel, TentOccupancyJournal, Twin SF1000 toggle+brightness when available (Got hybrid; 4×8 DutyStrip Twin Actual; 2×4 Actual = window Got; Manual Light Hold operator-clearable — Passes 1–5 **closed**; GPIO5 reserved) |
| `#/live/climate` | Climate Mode, zone focus, air CFM Sankey (graduated), cascade allocated SoT, Zigbee Wet/Dry + Problem/Clear from `policy_state` |
| `#/live/root` | Probe Got/Need / SoftCal entry |
| `#/grow/*` | Roster, Compose wizard, plant mini journal |
| `#/settings` | Spaces/devices/tariff/Learning (`SpaceEnergySettingsCard`), Zigbee, inventory |
| `#/tune/*` | Seat Learning log — **not** energy Learning |

## Space / energy / journals

| Surface | Status |
|---------|--------|
| PlantMiniJournal · TentOccupancyJournal · LightEnergyPanel | **live** |
| RoomJournal · CoreJournal on Overview | **live** (`grow_room` → Core rollup) |
| `/rooms` · `/journal/room/*` · `/journal/core` | **live** |
| Approve-only shifts (`confirm=true`) · Learning `apply: false` | **live** both tents |
| `confirm=false` → HTTP **400** (not 422) | **canonical** Pass 5 |

Developer SoT: [`SPACE-ENERGY-JOURNAL.md`](SPACE-ENERGY-JOURNAL.md) · [`PHOTOPERIOD-TIMELINE.md`](PHOTOPERIOD-TIMELINE.md).

## Live UX honesty (this tip)

| Desk | Gate | Spa / tests |
|------|------|-------------|
| Pass 1 Light | **green** (walk filled) | Prove used `index-DYFvyI2i.js`; `test_live_ux_light_honesty.py` |
| Pass 2 Climate | **green** (walk filled) | Live prove spa `index-CzcL7cKc.js`; `test_live_ux_climate_honesty.py` |
| Pass 3 Overview | **green** (Task 8 SPA + Task 9 prove) | Prove spa was `index-C8GkS5XE.js`; journals OOS/grow-log honesty; walk G0–G9 pass; `test_live_ux_overview_honesty.py` |
| Pass 4 Twin-first | **gate GREEN** (`4a40589`) | Tip spa `index-BoyhWWR_.js`; hybrid Got; DutyStrip 4×8 Twin / 2×4 window; AirPathMap cascade SoT; Overview `potWantBand`; brightness 0–255↔0–1; pytest `test_live_ux_pass4_twin.py`; GPIO5 reserved — [`../ops/TWIN-SF1000.md`](../ops/TWIN-SF1000.md) |
| Pass 5 follow-up | **gate GREEN** (`d07cbd9`) · **program closed** | Hold control map; energy 400; Zigbee Wet→Problem; FlowSankey graduated; CannaLib prod verify; walk [`../qa/LIVE-UX-PASS5-WALK-2026-09.md`](../qa/LIVE-UX-PASS5-WALK-2026-09.md) |

Developer SoT: [`LIVE-UX-HONESTY.md`](LIVE-UX-HONESTY.md) · [`../ops/TWIN-SF1000.md`](../ops/TWIN-SF1000.md).

## API dependency

All reads/writes go through brain HTTP (`brain/dsc_brain/api.py`), including:

- `GET /health` · `GET /fleet` · `GET /fleet/computed` · `GET /ws/fleet`
- `GET/POST /journal/plant|space|room|core` · `GET /rooms` · `GET/POST /spaces` · `/energy/*`
- `GET /catalogs/strains?q=` · roster / control / history routes

## Non-goals

- Embedding fat strain dumps in the browser
- Requiring Home Assistant for product ops
- Silent schedule mutate from SPA without confirm
- Inventing Problem chips from Wet/occupancy alone

## Host

Pi 4 4GB+ LAN (`http://dsc-brain.local:8787` or IP). Windows hotpatch: PuTTY `pscp`/`plink` `-batch -hostkey` — see `.audit/space-energy-pi-closure.ps1` · `.audit/live-ux-*-prove.ps1`.

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
