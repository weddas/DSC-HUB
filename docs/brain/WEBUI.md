# Local webserver UI spec

**In one line:** Thin client of the brain API — presentation, advanced control, updates.

Notion: [Local webserver UI](https://app.notion.com/p/3b52b4cda37081c19048e794d4bdf819)

**Ship (tip `86f8c2e` / 7.1.2 closure):** Brain/SPA surface **7.1.2**; firmware train **7.0.0.0**; SPA entry **`index-Ck-kkOyW`** (+ `tune-fleet` / `calibrate` chunks). Default landing **Operational Overview**. Frontend CI + route split: [`FRONTEND-CI.md`](FRONTEND-CI.md). Computed extras: [`COMPUTED-CACHE.md`](COMPUTED-CACHE.md). Sensor trust: [`SENSOR-TRUST.md`](SENSOR-TRUST.md). Catalog: [`../ops/CANNALIB-API.md`](../ops/CANNALIB-API.md). Acceptance: [`LIVE-ACCEPTANCE-7.1.md`](../qa/LIVE-ACCEPTANCE-7.1.md) · closure: [`AUDIT-CLOSURE-7.1.2.md`](../qa/AUDIT-CLOSURE-7.1.2.md).

> Draft PRs **#108** / **#109** add fleet-truth / settings / studio-deploy runbooks — prefer those once merged; do not duplicate here.

## Surfaces (7.1 SPA)

| Route | Job |
|---|---|
| `/live/overview` | Default ops landing (vitals / gauges / alerts) |
| `/live/climate` · `/live/root` · `/live/light` · tents | Zone pages |
| `/ops/home` | Dash Home (band charts, filtered grow log) |
| `/tune/learning` · `/tune/analytics` | Lazy `tune-fleet` chunk |
| `/fleet` · `/fleet/calibrate` · `/fleet/settings` | Fleet overview + Calibrate chunk + Settings |
| `/grow/*` | Compose / Research / Roster (CannaLib proxy) |

Hash router under Pi `:8787` (and HA panel dual-mode). Hard-refresh after deploy.

## API dependency

Reads/writes go through brain HTTP API (`brain/dsc_brain/api.py`):

- `GET /health` · `GET /fleet` · `GET /fleet/computed` · `WS /ws/fleet`
- `POST /control/service` · `POST /control/demand`
- `GET /history` · `GET /grow-log` · `GET /roster`
- `GET|PATCH /settings*` · `GET /settings/catalog/status`
- `GET /v1/catalogs/{kind}` (proxy → CannaLib / local sqlite / 503)
- Catalog / Want / decision endpoints as before

## Developer build

See [`FRONTEND-CI.md`](FRONTEND-CI.md) — `tsc --noEmit` + `npm run build:spa` required; CI enforces on frontend path changes.

## Non-goals

- Three.js cinematic Dash parity as product SoT
- Embedding fat strain dumps in the browser
- Requiring Home Assistant on Pi island
- Reintroducing ETH01 bridge UI as the Sonoff path
- Inventing height/chem/PPFD/NPK in the UI

## Host

Pi 4 4GB+ — studio LAN default **`192.168.86.48`** / `http://dsc-brain.local:8787` or AP `http://10.42.0.1:8787`. Ops: [`DSC-HUB-DOCKER.md`](../ops/DSC-HUB-DOCKER.md). Deploy: `services/dsc-hub/pi/studio-deploy.ps1` (docs PR #109).
