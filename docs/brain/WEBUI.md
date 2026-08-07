# Local webserver UI spec

**In one line:** Thin client of the brain API — presentation, advanced control, updates.

Notion: [Local webserver UI](https://app.notion.com/p/3b52b4cda37081c19048e794d4bdf819) · Ops: [`docs/qa/DSC-BRAIN-PHASE-B.md`](../qa/DSC-BRAIN-PHASE-B.md)

## Surfaces (MVP — Phase C, **N-095**)

| Route | Job |
|---|---|
| `/` | Ops overview (vitals, ladder summary, alerts) |
| `/plant` | Build a Plant + roster |
| `/advanced` | Profiles, cal, overrides (API calls only) |
| `/updates` | Brain version, catalog reload, firmware flash checklist |

Static UI is **not shipped** yet. Phase B exposes the API stub only.

## API dependency

All reads/writes go through brain HTTP API (`brain/dsc_brain/api.py` on `:8787`).

### Phase B — live today

| Method | Path |
|---|---|
| `GET` | `/health` |
| `POST` | `/admin/reload-catalogs` |
| `GET` | `/catalogs/{kind}?q=` (`strain`/`strains`, `nutrient`/`nutrients`, …) |
| `GET` | `/want/{strain_id}?stage=` |
| `POST` | `/decision/tick` |

OpenAPI UI: `http://127.0.0.1:8787/docs`

### Phase C / D — planned (do not call yet)

| Method | Path | When |
|---|---|---|
| `POST` | `/roster/...` | Web UI MVP |
| `GET` | `/decision/last` | Persist last proposal |
| Hub write client | (library, not REST) | Phase D emit |

## Non-goals (v1)

- Three.js cinematic Dash parity
- Embedding fat strain dumps in the browser
- Requiring Home Assistant
- Bypassing hub clamps from the browser

## Host

Pi 4 4GB LAN (`http://dsc-brain.local` or IP). Static UI can ship later; API stub is first.
