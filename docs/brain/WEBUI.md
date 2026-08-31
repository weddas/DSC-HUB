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
- `GET /catalogs/strains?q=`
- `GET /want/{strain_id}`
- `POST /roster/...`
- `GET /decision/last` (dry-run proposals)
- `POST /admin/reload-catalogs`

## Non-goals (v1)

- Three.js cinematic Dash parity
- Embedding fat strain dumps in the browser
- Requiring Home Assistant

## Host

Pi 4 4GB LAN (`http://dsc-brain.local` or IP). Static UI can ship later; API stub is first.

## Live operator SPA — tip `bae50fa`

Pi `:8787` HashRouter SPA (not the MVP route table above). Atmosphere + Wave 1 honesty:

| | |
|---|---|
| Mount | `DscRoot` → pinned `ParallaxStars` (decorative) + scrolling `.dsc-root-body` |
| Assignment | `lib/probeAssignment.ts` — SoftCal chip / Soil·lab banner; **no** auto-detach |
| Cal strips | `CalOutcomeStrip` on SoftCal, Soil Test, fan, lab wet, peer |
| Nickname | `flushEntityTextDrafts` / `peekEntityTextDraft` before PlantWizard Next/commit |
| Fan SoT | `/fleet/calibrate` — Learning deep-links only |
| spa-dist | `index-XS57jN-m.js` · `calibrate-CpykSWoW.js` · `tune-fleet-CvWffS4i.js` |

Prior tip `8f4c3e1` moved gauges/graphs/Sankey to Apache ECharts (still in this SPA train; hashes above supersede `index-DLMlcKND.js`). Draft SoT PR [#147](https://github.com/weddas/DSC-HUB/pull/147) for full ECharts doc.

SoT: [OPERATOR-WAVE1.md](OPERATOR-WAVE1.md).
