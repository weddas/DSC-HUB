# Local webserver UI spec

**In one line:** Thin client of the brain API — presentation, advanced control, updates. Canonical host: Pi `:8787`.

Notion: [Local webserver UI](https://app.notion.com/p/3b52b4cda37081c19048e794d4bdf819)

## Surfaces (product SPA)

| Route | Job |
|---|---|
| `#/live/overview` | Default landing — vitals, honesty rail, HubLink |
| `#/live/root` | Probe Got cards; vacant ≠ station ≠ planted (Bar 2 assignment chrome) |
| `#/grow/roster` · `#/grow/compose` | Roster lifecycle + Plant Wizard create |
| `#/fleet` · `#/fleet/calibrate` | Fleet + SoftCal / soil cal |
| `#/settings/...` | Blast-radius Settings (probe stations = dock/role, not detach) |

> **HA wireframe (N-086):** Home Assistant `/dsc-hub-pro/catalog` is the interim research browser. Durable catalog browse calls brain APIs — reuse labels, not HA helper coupling ([`docs/HA-SCAFFOLD.md`](../HA-SCAFFOLD.md)).

Plant ↔ probe assign / move / **detach**: [`PLANT-PROBE-LIFECYCLE.md`](PLANT-PROBE-LIFECYCLE.md) (tip `fe55e4e`, bundle `index-CEeqi1BT.js`). SoftCal ≠ idle_home ≠ tent ≠ detach ≠ retire.

## API dependency

Reads/writes go through brain HTTP (`brain/dsc_brain/api.py`), including:

- `GET /health`, `GET /fleet`, `GET /fleet/computed`, `GET /ws/fleet`
- Roster: `PATCH /roster/pots/{n}`, `POST /roster/detach/{n}`, `POST /roster/assign`, `POST /roster/move`
- `POST /control/service` (scripts: `dsc_plant_detach` / `_assign_slot` / `_move` / `_retire`)
- Catalogs, Want, decision, settings, SoftCal

SPA is a **client** — do not invent a third assignment story in the browser.

## Non-goals

- Three.js cinematic Dash as primary ops
- Embedding fat strain dumps in the browser
- Requiring Home Assistant for product ops

## Host

Pi 4 4GB+ LAN (`http://dsc-brain.local` or Pi IP `:8787`). Deploy: [`../ops/DSC-HUB-DOCKER.md`](../ops/DSC-HUB-DOCKER.md).
