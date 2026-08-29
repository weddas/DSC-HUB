# Local webserver UI spec

**In one line:** Thin client of the brain API — presentation, advanced control, updates. Canonical host: Pi `:8787`.

Notion: [Local webserver UI](https://app.notion.com/p/3b52b4cda37081c19048e794d4bdf819)

## Surfaces (product SPA)

| Route | Job |
|---|---|
| `#/live/overview` | Default landing — vitals, honesty rail, HubLink, pending-reassert banner |
| `#/live/root` | Probe Got cards; stations thereabouts; vacant ≠ station ≠ planted |
| `#/live/light` · Climate | `lightViewModel` + shared-air demand chips (Bar 1) |
| `#/grow/roster` · `#/grow/compose` | Roster lifecycle + Plant Wizard; `probeLabel` chrome |
| `#/fleet` · `#/fleet/calibrate` | Fleet + SoftCal / soil cal; Need chips from `need_summary` |
| `#/settings/...` | Blast-radius Settings (probe stations = dock/role, not detach) |

> **HA wireframe (N-086):** Home Assistant `/dsc-hub-pro/catalog` is the interim research browser. Durable catalog browse calls brain APIs — reuse labels, not HA helper coupling ([`docs/HA-SCAFFOLD.md`](../HA-SCAFFOLD.md)).

## Honesty surfaces (tip `6230383` + binary bus `cc288d7`)

SPA is a **client** of brain honesty — see [`HONESTY.md`](HONESTY.md).

| Chrome | Source |
|---|---|
| Root HOME ONLINE / DARK / FAULT | Station API `home_trustworthy` / Modbus / fault — withhold gauges when untrustworthy |
| Root SENSOR FAULT / PROBE DARK | `readPotTrust` via `useEntityBus` — **`fleetLiveState` maps Pi binaries to `on`/`off`** (not `1`/`0`); gauges blank when fault/dark |
| Roster / Tune Need | `sensor.dsc_probe{N}_need_summary` + want min/max bands from computed |
| Light schedule | `time.dsc_hub_lights_on_time` / clone (hub TimeState ingest) via `lightViewModel` |
| PENDING REASSERT | `binary_sensor.dsc_brain_hub_override_active` attr `pending_reassert` — HubLinkLine + Dash banner |
| Probe language | `probeLabel(n)` on Roster / Compose / Root / Tune |

Bundle after binary fix: **`index-CLqaVJXR.js`**. Shot: `docs/qa-screenshots-2026-08-29/honesty-root-fault.png`.

Bar 2 assign/move/detach lifecycle developer SoT: draft [#139](https://github.com/weddas/DSC-HUB/pull/139). SoftCal ≠ idle_home ≠ tent ≠ detach ≠ retire.

## API dependency

Reads/writes go through brain HTTP (`brain/dsc_brain/api.py`), including:

- `GET /health`, `GET /fleet`, `GET /fleet/computed`, `GET /ws/fleet`
- Probe stations / soil tests (thereabouts + honesty flags)
- Roster: `PATCH /roster/pots/{n}`, `POST /roster/detach/{n}`, `POST /roster/assign`, `POST /roster/move`
- `POST /control/service` (scripts: `dsc_plant_detach` / `_assign_slot` / `_move` / `_retire`)
- Catalogs, Want, decision, settings, SoftCal

Do not invent a third assignment, Want, or schedule story in the browser.

## Non-goals

- Three.js cinematic Dash as primary ops
- Embedding fat strain dumps in the browser
- Requiring Home Assistant for product ops
- Dual isolated HVAC rooms / Twin as controller

## Host

Pi 4 4GB+ LAN (`http://dsc-brain.local` or Pi IP `:8787`). Deploy: [`../ops/DSC-HUB-DOCKER.md`](../ops/DSC-HUB-DOCKER.md).
