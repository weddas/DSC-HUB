# Local webserver UI (SPA)

**In one line:** Thin client of the brain API — presentation, Settings, fleet, updates.

Shipped with DSC-HUB **7.0** as the React SPA bundled into the brain image (`brain/static/`, built via `homeassistant/custom_components/dsc_hub/frontend` `npm run build:spa`). Served at `http://dsc-brain.local:8787/`.

Notion: [Local webserver UI](https://app.notion.com/p/3b52b4cda37081c19048e794d4bdf819) · Ops: [`docs/qa/PI-APPLIANCE-7.0.md`](../qa/PI-APPLIANCE-7.0.md)

## Surfaces

| Route / area | Job |
|---|---|
| Ops / home | Fleet vitals, ladder summary, alerts (`GET /fleet`, `WS /ws/fleet`) |
| Plant / Build | Roster + catalog browse (`/roster`, `/v1/catalogs/*`) |
| Settings | Inventory, integrations (Ollama/CannaLib), Zigbee permit-join, network apply, ESPHome jobs, backup |
| Advanced | Profiles / cal / overrides via API only |

HA `/dsc-hub` remains a **lab** surface (may show **7.2.0**). Product glass on Pi is this SPA (**7.0.0-dev** until soak).

## API dependency

Primary reads/writes go through `brain/dsc_brain/api.py` (see runbook API table). Highlights:

- `GET /health` — version, surface, expected firmware
- `GET /fleet` · `WS /ws/fleet`
- `GET|PATCH /settings` · inventory / roster / learning
- `POST /settings/integrations/test-*`
- `GET /v1/catalogs/{kind}` · `POST /decision/tick`
- `GET|POST /settings/esphome/*` · backup export/import

## Non-goals (v1)

- Three.js cinematic Dash parity
- Embedding fat strain dumps in the browser
- Requiring Home Assistant on the Pi island

## Host

Pi 4 4GB+ USB SSD (`http://dsc-brain.local:8787` or `10.42.0.1:8787`).
