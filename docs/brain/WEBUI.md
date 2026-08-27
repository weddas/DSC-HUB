# Local webserver UI spec

**In one line:** Thin client of the brain API — presentation, advanced control, updates.

Notion: [Local webserver UI](https://app.notion.com/p/3b52b4cda37081c19048e794d4bdf819)

**Pi SPA SoT (7.2):** served from brain `:8787` — bundle `index-DQgIy3uk` (+ tune-fleet / calibrate chunks). Default landing `#/live/overview`.

## Surfaces (Pi SPA)

| Route | Job |
|---|---|
| `/live/overview` | Operational Overview (default home) |
| `/live/climate` | Climate charts; Zigbee-by-placement; **experimental** `SankeyFlowPrototype` (mass-balance CFM — not control SoT) |
| `/fleet/calibrate` | Fan/light cal + **SoilTestWizard** (probe workflow) |
| `/fleet/settings` | Inventory, Zigbee, integrations, **Global modifiers** |
| `/grow/*` | Compose / Research / Roster |

Legacy MVP paths (`/`, `/plant`, `/advanced`) redirected via `LEGACY_REDIRECTS` in `routes.ts`.

> **HA wireframe (N-086):** Home Assistant `/dsc-hub-pro/catalog` remains lab research over `/local/dsc-catalog/*.json`. Product browse uses brain catalog APIs ([`docs/HA-SCAFFOLD.md`](../HA-SCAFFOLD.md)).

## API dependency

All reads/writes go through brain HTTP API (`brain/dsc_brain/api.py`), including 7.2:

- `GET|PATCH /settings/global-modifiers` — [`GLOBAL-MODIFIERS.md`](GLOBAL-MODIFIERS.md)
- `GET|PATCH /settings/probe-stations*` · `/soil-tests*` — [`SOIL-PROBE.md`](SOIL-PROBE.md)
- `GET /settings/zigbee/health|devices` · permit-join — [`ZIGBEE-RECOVERY.md`](../ops/ZIGBEE-RECOVERY.md)
- `GET /health`, `/fleet`, `/fleet/computed`, `/history`, catalogs, `/control/service`

## Non-goals

- Treating Sankey prototype as closed-loop control
- Embedding fat strain dumps in the browser
- Requiring Home Assistant for island operation

## Host

Pi 4 4GB LAN (`http://dsc-brain.local` or studio `http://192.168.86.48:8787`).
