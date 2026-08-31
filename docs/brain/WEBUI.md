# Local webserver UI spec

**In one line:** Thin client of the brain API — presentation, advanced control, updates.

Notion: [Local webserver UI](https://app.notion.com/p/3b52b4cda37081c19048e794d4bdf819)

## Surfaces (product SPA on tip `15d7016`)

| Route | Job |
|---|---|
| `#/live/overview` | Ops overview (vitals, honesty chips, alerts) |
| `#/live/climate` · `#/live/root` · `#/live/light` | Live Want→Got gauges (ECharts) + Climate Air path / Sankey |
| `#/grow/roster` · `#/grow/compose` | Roster + Plant Wizard (Compose) |
| `#/grow/research` | Catalog Research (CannaLib offset / media / kit PPFD) |
| `#/fleet/calibrate` | SoftCal / Soil / lab / fan / peer (CalOutcomeStrip) |
| `#/settings/*` | Integrations, Zigbee Role/Task, Device inventory |

> **HA wireframe (N-086):** Home Assistant `/dsc-hub-pro/catalog` is the interim
> research browser over `/local/dsc-catalog/*.json`. Pi SPA Research calls brain
> catalog APIs — reuse section jobs/labels, not HA helper coupling
> ([`docs/HA-SCAFFOLD.md`](../HA-SCAFFOLD.md)).

## Tip `15d7016` developer SoT

| Topic | Doc |
|---|---|
| Operator Wave 1 (SoftCal chip, strips, star wash) | [OPERATOR-WAVE1.md](OPERATOR-WAVE1.md) |
| Waves 2–5 (CannaLib, PPFD, Twin, air Sankey) | [OPERATOR-POLISH.md](OPERATOR-POLISH.md) |
| ECharts gauges / lines / Sankey | [VIZ-ECHARTS.md](VIZ-ECHARTS.md) |
| SoftCal Raw + AI + sessions API | [`../ops/SOFT-CAL.md`](../ops/SOFT-CAL.md) |
| CannaLib brain proxy | [`../ops/CANNALIB-API.md`](../ops/CANNALIB-API.md) |

**spa-dist hashes:** `index-Bx0-MSV-.js` · `calibrate-CadBxMGV.js` · `tune-fleet-DouQtSz_.js` · `twin-three-B0t1gmm4.js` · CSS `index-YHuXqGUv.css`.

Roster / stock Compose / slot retire SoT may land via open draft PR #150 (`ROSTER-STOCK` · `PLANT-WIZARD` · `PLANT-PROBE-LIFECYCLE`) — prefer that PR for capacity/`POST /roster/slots/{n}/retire`.

## API dependency

All reads/writes go through brain HTTP API (`brain/dsc_brain/api.py`):

- `GET /health`
- `GET /v1/catalogs/{kind}?q=&limit=&offset=`
- `GET /v1/catalogs/strains/{id}` · `GET /v1/media/assets/{id}`
- `GET /want/{strain_id}`
- `POST /roster/...` · `POST /roster/slots/{n}/retire`
- `GET /decision/last` (dry-run proposals)
- `POST /ai/soft-cal-advice` · `GET|POST /soft-cal/sessions`
- `POST /admin/reload-catalogs`

## Non-goals

- Inventing cultivar photos, CDN PPFD, or Sankey heat/humidity splits
- Embedding fat strain dumps in the browser
- Requiring Home Assistant for product ops
- SoftCalWizard pretending session history exists before it POSTs `/soft-cal/sessions`

## Host

Pi 4 4GB LAN (`http://dsc-brain.local` or IP), SPA on `:8787`.
