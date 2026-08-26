# Local webserver UI spec

**In one line:** Thin client of the brain API — presentation, advanced control, updates.

Notion: [Local webserver UI](https://app.notion.com/p/3b52b4cda37081c19048e794d4bdf819)

**Ship (7.1.1 closeout / SPA 7.1.0):** Bundle `index-Bxr2Zt3b`; default landing **Operational Overview**; HA Dash theme tokens; Calibrate + Settings device cards. Firmware train stays **7.0.0.0**. Acceptance: [`docs/qa/LIVE-ACCEPTANCE-7.1.md`](../qa/LIVE-ACCEPTANCE-7.1.md) · ingest: [`FLEET-INGEST.md`](FLEET-INGEST.md).

## Surfaces (7.1 SPA)

| Route | Job |
|---|---|
| `/live/overview` | Default ops landing (vitals / ladder summary) |
| `/live/mission` | Mission retained |
| `/ops/home` | Dash Home (band charts, grow log) |
| `/fleet/calibrate` | Fan CFM + light PAR/LUX wizards → `/settings/calibration/{id}` |
| `/settings` | Inventory cards, assignment, Zigbee, integrations |
| `/plant` / compose | Build a Plant + roster (via control/service helpers) |

Hash router under Pi `:8787` (and HA panel dual-mode). Hard-refresh after deploy.

## API dependency

Reads/writes go through brain HTTP API (`brain/dsc_brain/api.py`):

- `GET /health` · `GET /fleet` · `GET /fleet/computed` · `WS /ws/fleet`
- `POST /control/service` · `POST /control/demand`
- `GET /history` · `GET /grow-log`
- `GET|PATCH /settings*` · `GET|POST /settings/calibration/{device_id}`
- Catalog / Want / decision endpoints as before

## Non-goals

- Three.js cinematic Dash parity as product SoT
- Embedding fat strain dumps in the browser
- Requiring Home Assistant on Pi island
- Reintroducing ETH01 bridge UI as the Sonoff path

## Host

Pi 4 4GB+ (`http://10.42.0.1:8787` or eth0). Ops cutover: [`docs/ops/DSC-HUB-DOCKER.md`](../ops/DSC-HUB-DOCKER.md). Sonoff flash: [`docs/ops/SONOFF-FLASH.md`](../ops/SONOFF-FLASH.md).
