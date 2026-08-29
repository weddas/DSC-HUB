# Local webserver UI spec

**In one line:** Thin client of the brain API — presentation, advanced control, updates. Canonical host: Pi `:8787`.

Notion: [Local webserver UI](https://app.notion.com/p/3b52b4cda37081c19048e794d4bdf819)

## Surfaces (7.3 product SPA)

| Route | Job |
|---|---|
| `#/live/overview` | Default landing — vitals, honesty rail, HubLink |
| `#/live/climate` | Tent climate + **one** Air path CFM surface |
| `#/live/4x8` · `#/live/2x4` | Tent cockpits |
| `#/live/root` | Probe 1–2 Root cards (kit SoT) |
| `#/live/light` | Photoperiod / light |
| `#/grow/roster` · `#/grow/compose` | Plant roster + wizard |
| `#/tune/learning` · `#/tune/analytics` | Learning / analytics |
| `#/fleet` · `#/fleet/calibrate` | Fleet overview + SoftCal / soil cal |
| `#/settings/{hub,brain,device,api,network,server,general}` | Blast-radius Settings (Pass C) |
| `#/ops/dash` · `#/live/twin` | Demoted Twin — honesty / gated |

Legacy `#/plant`, `#/advanced`, old `#/ops/*` redirect into the tree above.

Kit model, Pass A–C, pitfalls: [`KIT-SOT-SPA.md`](KIT-SOT-SPA.md). Soil NPK / dryback / rate producers: [`../ops/FLEET-SOIL-METRICS.md`](../ops/FLEET-SOIL-METRICS.md). Design: [`../superpowers/specs/2026-08-29-professional-spa-ui-design.md`](../superpowers/specs/2026-08-29-professional-spa-ui-design.md).

## API dependency

Reads/writes go through brain HTTP (`brain/dsc_brain/api.py`), including:

- `GET /health`, `GET /fleet`, `GET /fleet/computed` (`hass_extras` for derived soil metrics)
- `GET/POST` roster, catalogs, Want, decision, settings, SoftCal history
- `POST /control/service`, `/control/demand`
- `GET /history`, `/grow-log`, `/ws/fleet`

SPA merges `/fleet/computed` extras into fleet hass state so Root held readings see dryback/rate/NPK.

## Non-goals

- Three.js cinematic Dash as primary ops
- Embedding fat strain dumps in the browser
- Requiring Home Assistant for product ops
- Inventing NPK / dryback when producers are missing

## Host

Pi 4 4GB+ LAN (`http://dsc-brain.local` or `192.168.86.48:8787`). Deploy: [`../ops/DSC-HUB-DOCKER.md`](../ops/DSC-HUB-DOCKER.md) · verify skill `dsc-spa-pi-verify`.
