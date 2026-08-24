# Local webserver UI spec

**In one line:** Thin client of the brain API — presentation, advanced control, updates.

Notion: [Local webserver UI](https://app.notion.com/p/3b52b4cda37081c19048e794d4bdf819)

**Pi tip (`c1a451a`):** SPA reads **FleetSnapshot** (`GET /fleet` / `WS /ws/fleet`) including **`hub.values.controls`**; writes via **`POST /control/service`** (switch/number/fan/light/select); charts via **`GET /history`**. Climate / toggles / fans / targets use **`useFleetEntity`**. Ops: [`docs/qa/PI-APPLIANCE-7.0.md`](../qa/PI-APPLIANCE-7.0.md).

## Surfaces (MVP)

| Route | Job |
|---|---|
| `/` / `#/…` hash routes | Ops overview (vitals, ladder summary, alerts) via FleetSnapshot |
| `/plant` | Build a Plant + roster + catalog browse (research) |

> **HA wireframe (N-086):** Home Assistant `/dsc-hub-pro/catalog` is the interim
> research browser over `/local/dsc-catalog/*.json`. The durable web `/plant`
> browse mode will call brain catalog APIs — reuse section jobs/labels, not HA
> helper coupling ([`docs/HA-SCAFFOLD.md`](../HA-SCAFFOLD.md)).
| `/advanced` | Profiles, cal, overrides (API calls only) |
| `/updates` | Brain version, catalog reload, firmware flash checklist |

## Dual-mode data path

| Mode | Reads | Writes | Charts |
|---|---|---|---|
| **Pi** (`VITE_DSC_PI=1` / `source="pi"`) | FleetSnapshot + `hub.values.controls` via `useFleetEntity` | `POST /control/service` | `GET /history` |
| **HA panel** (`source="ha"`) | `fleetFromHass(hass)` / HA entity state | `hass.callService` | HA history WS |

Frontend SoT: `hooks/useFleet.tsx`, `hooks/useFleetEntity.ts`, `lib/fleetControlMap.ts`, `lib/fleetModel.ts`, `lib/fleetApi.ts`, `hooks/useFleetActions.ts`, `hooks/useHistory.ts`.

```mermaid
flowchart LR
  fleet[FleetSnapshot] --> ufe[useFleetEntity]
  ufe -->|controls_hit| ui[Climate_UI]
  ufe -->|miss| hass[useHass]
  ui -->|callService| proxy["POST /control/service"]
```

## API dependency

All Pi reads/writes go through brain HTTP API (`brain/dsc_brain/api.py`):

- `GET /health`
- `GET /fleet` (+ optional `?include_hass=true`)
- `WS /ws/fleet`
- `POST /control/service`
- `GET /history?entity_id=&hours=`
- `GET /catalogs/strains?q=`
- `GET /want/{strain_id}`
- `GET/PATCH /roster/...`
- `GET /decision/last` (dry-run proposals)
- `POST /admin/reload-catalogs`
- Settings / inventory / network / esphome / backup / zigbee routes (see runbook)

## Non-goals (v1)

- Three.js cinematic Dash parity on the Pi image
- Embedding fat strain dumps in the browser
- Requiring Home Assistant on the product path

## Host

Pi 4 4GB LAN (`http://dsc-brain.local:8787` or `http://10.42.0.1:8787`). Static UI ships via `npm run build:spa` → `brain/static` → `Dockerfile.prebuilt`.
