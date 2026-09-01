# Local webserver UI spec

**In one line:** Thin client of the brain API — presentation, advanced control, updates. Live SPA on Pi `:8787`.

Notion: [Local webserver UI](https://app.notion.com/p/3b52b4cda37081c19048e794d4bdf819)

**Tip (computed refresh + compose honesty):** `149657d` · spa-dist `index-DsUt6Y4m.js` (+ `calibrate-BBqbkhla.js` · `tune-fleet-BdNG_Y6Z.js`) · [ROSTER-STOCK.md](ROSTER-STOCK.md) · [PLANT-WIZARD.md](PLANT-WIZARD.md)  
**Prior (10-slot stock):** `15d7016`

## Surfaces (product SPA)

| Route | Job |
|---|---|
| `#/live/overview` | Ops overview (vitals, honesty, banners) |
| `#/grow/roster` | Plant roster — detach / assign / **slot Delete** |
| `#/grow/compose` | Plant Wizard — stock or seated create |
| `#/fleet/calibrate` | SoftCal / soil cal |
| `#/settings` | Inventory, Zigbee bind, advanced |

> **HA wireframe:** optional lab panel only. Product SoT is the Pi SPA + brain HTTP ([`docs/HA-SCAFFOLD.md`](../HA-SCAFFOLD.md)).

## API dependency (roster / compose)

Reads/writes go through brain HTTP (`brain/dsc_brain/api.py`):

- `GET /health` · `GET /fleet` · `GET /fleet/computed` · `GET /ws/fleet`
- `POST /control/service` (compose helpers + `script.dsc_*`)
- `POST /roster/detach/{pot}` · `POST /roster/assign` · `POST /roster/move`
- `POST /roster/slots/{n}/retire` — destroy stock/detached/active by slot (1–10)
- `GET /v1/catalogs/{kind}` · `GET /want/{strain_id}`
- `POST /admin/reload-catalogs`

Capacity: `ROSTER_SLOT_COUNT = 10` in `compose_store.py`. Kit probes for operator chrome: `KIT_PROBE_NUMBERS` = 1–2.

### Client refresh contract (tip `149657d`)

`BrainProvider` (`useBrain.tsx`):

- Serializes `/fleet/computed` via a promise chain so `refresh()` / WS / 5s poll never drop a retire/update behind an in-flight request
- Cache-busts computed with `?_=${Date.now()}` (`fleetApi.get_fleet_computed`)
- Bumps React `tick` after each successful computed apply so roster tables re-render

Compose: nickname sync reads live DOM; Light footer = **Skip light** when unset — [PLANT-WIZARD.md](PLANT-WIZARD.md).

## Non-goals

- Inventing Got / Need / catalog chem when producers are missing
- Embedding fat strain dumps in the browser
- Requiring Home Assistant for product ops

## Host

Pi 4 4GB+ LAN (`http://dsc-brain.local:8787` or IP). Deploy spa-dist with brain image / hot-patch.

## Related

- [PLANT-WIZARD.md](PLANT-WIZARD.md) · [PLANT-PROBE-LIFECYCLE.md](PLANT-PROBE-LIFECYCLE.md) · [ROSTER-STOCK.md](ROSTER-STOCK.md)
- Architecture: [../DSC-BRAIN.md](../DSC-BRAIN.md)
