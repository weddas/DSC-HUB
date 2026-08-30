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

## Settings → Zigbee (tip `f7b4e80`)

Device Kit Zigbee rows: **Role · Zone · Task** with capability-filtered selects; **Show all** escape.

| Task | Params UI | Act |
|------|-----------|-----|
| No task | — | Datapoint only |
| Liquid level → appliance OOS | Appliance · Problem when · Banner | OOS + force relay + banner |
| Floor flood → alert | Problem when · Banner (no Appliance) | Banner + grow-log only |

Climate sensors stay **No task**. Kit liquid tanks may publish wet on `occupancy` — not motion. Overview shows `critical_banners` from policy edges.

SoT: [ZIGBEE-ROLE-TASK.md](ZIGBEE-ROLE-TASK.md) · SPA bundle `index-Cj_Rsb-d.js` · radio ops [ZIGBEE-RECOVERY.md](../ops/ZIGBEE-RECOVERY.md).

## Climate Zigbee honesty (tip `f7b4e80`)

Climate **Zigbee by role** card splits climate temp/RH from safety:

- Safety chips: **Wet/Dry** from `zigbee_by_role` (raw).
- **Problem/Clear** only when Task ≠ `none` and `fleet.system.zigbee_policy_state[ieee].problem` is present — SPA must not invent Clear from Dry alone.
- Distinct floor roles (`leak_floor_room` / `_4x8` / `_2x4`) so two sensors do not clobber one honesty row.

Helper: `isZigbeeSafetyLeakRole` / `zigbeeFloodBannerTemplate` in `fleetApi.ts`.
