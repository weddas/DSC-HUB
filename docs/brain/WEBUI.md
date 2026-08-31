# Local webserver UI spec

**In one line:** Thin client of the brain API — presentation, advanced control, updates.

Notion: [Local webserver UI](https://app.notion.com/p/3b52b4cda37081c19048e794d4bdf819)

## Surfaces (MVP)

| Route | Job |
|---|---|
| `/` | Ops overview (vitals, ladder summary, alerts) |
| `/plant` | Build a Plant + roster + catalog browse (research) |

> **HA wireframe (N-086):** Home Assistant `/dsc-hub-pro/catalog` is the interim
> research browser over `/local/dsc-catalog/*.json`. The durable web `/plant`
> browse mode will call brain catalog APIs — reuse section jobs/labels, not HA
> helper coupling ([`docs/HA-SCAFFOLD.md`](../HA-SCAFFOLD.md)).
| `/advanced` | Profiles, cal, overrides (API calls only) |
| `/updates` | Brain version, catalog reload, firmware flash checklist |

## API dependency

All reads/writes go through brain HTTP API (`brain/dsc_brain/api.py`):

- `GET /health`
- `GET /v1/catalogs/{kind}?q=&limit=&offset=` (strains / nutrients / mediums / lights)
- `GET /v1/catalogs/strains/{strain_id}` (strain_tree hydrate)
- `GET /v1/media/assets/{asset_id}` (licensed media proxy)
- `GET /want/{strain_id}`
- `POST /roster/...`
- `GET /decision/last` (dry-run proposals)
- `GET /fleet/computed` (extras; must stay HTTP 200 — see sensor_trust)
- `POST /admin/reload-catalogs`

Catalog client SoT: [`docs/ops/CANNALIB-API.md`](../ops/CANNALIB-API.md) · [OPERATOR-POLISH.md](OPERATOR-POLISH.md).

## Non-goals (v1)

- Embedding fat strain dumps in the browser
- Requiring Home Assistant
- Inventing cultivar photos / CDN PPFD / estimated Sankey heat when producers are absent

## Host

Pi 4 4GB LAN (`http://dsc-brain.local` or IP `:8787`). HashRouter SPA ships in `spa-dist/`.

## Live operator SPA — tip `94705f0`

Pi `:8787` HashRouter SPA (not only the MVP table above). Atmosphere + Waves 1–5:

| | |
|---|---|
| Mount | `DscRoot` → pinned `ParallaxStars` (decorative) + scrolling `.dsc-root-body` |
| Assignment | `lib/probeAssignment.ts` — SoftCal chip / Soil·lab banner; **no** auto-detach |
| Cal strips | `CalOutcomeStrip` on SoftCal, Soil Test, fan, light, tank, lab wet, peer |
| Nickname | `flushEntityTextDrafts` / `peekEntityTextDraft` before PlantWizard Next/commit |
| Fan SoT | `/fleet/calibrate` — Learning deep-links only |
| Catalog | offset Load more · type icons · media hydrate · kit PPFD local |
| Viz honesty | ECharts gauges/graphs; Sankey air-only; Twin moisture/HELD |
| spa-dist | `index-JuWgMbJV.js` · `calibrate-BNJCw6ba.js` · `tune-fleet-DFrH_SAo.js` · `twin-three-B0t1gmm4.js` |

SoT: [OPERATOR-WAVE1.md](OPERATOR-WAVE1.md) · [OPERATOR-POLISH.md](OPERATOR-POLISH.md).
