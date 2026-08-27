# Local webserver UI (Pi SPA)

**In one line:** Thin client of the brain API — presentation, advanced control, updates. Pi SPA at `:8787` is product SoT (7.3).

Notion: [Local webserver UI](https://app.notion.com/p/3b52b4cda37081c19048e794d4bdf819)

## Surfaces (7.3)

| Section | Default route | Job |
|---------|---------------|-----|
| **Live** | `/live/overview` | Overview vitals, Climate (leaf VPD + FlowSankey), tents, Root, Light |
| **Grow** | `/grow/roster` | Compose / Research / Roster |
| **Tune** | `/tune/learning` | Learning + Analytics |
| **Fleet** | `/fleet` | Inventory overview, Calibrate, Settings |

Demoted Live tabs: Twin (`/live/twin`), Mission, Dash (`/ops/home`). Legacy paths redirect via `LEGACY_REDIRECTS` in `routes.ts`.

### 7.3 feature anchors

| Feature | Where | Doc |
|---------|-------|-----|
| Leaf VPD charts | Climate + BandChartHost | [`LEAF-VPD.md`](LEAF-VPD.md) |
| Flow Sankey air/heat/humidity | Climate → Air path | [`FLOW-SANKEY.md`](FLOW-SANKEY.md) |
| R3F Twin | `/live/twin`, `/ops/dash` | [`TWIN-R3F.md`](TWIN-R3F.md) |
| Lab wet wizard UI | Fleet → Calibrate | [`../ops/LAB-WET-CAL.md`](../ops/LAB-WET-CAL.md) |
| Lovelace retired | — | [`../ops/LOVELACE-RETIRED.md`](../ops/LOVELACE-RETIRED.md) |

## API dependency

Reads/writes go through brain HTTP (`brain/dsc_brain/api.py`) on Pi:

- `GET /health`, `GET /fleet`, `GET /fleet/computed`, `GET /ws/fleet`
- `POST /control/service`, `POST /control/demand`
- `GET /history`, grow-log, settings, catalogs, decision tick
- SPA static assets served with the brain container

HA custom panel dual-mode still uses `hass.callService` when `VITE_DSC_PI` is unset.

## Build notes

- SPA: `npm run build:spa` with `vite.spa.config.ts` (`VITE_DSC_PI=1`).
- Code splits: `tune-fleet`, `calibrate`, `twin-three` chunks.
- Quality: `tsc --noEmit` + `.github/workflows/frontend-ci.yml`.

## Non-goals

- Embedding fat strain dumps in the browser
- Requiring Home Assistant for island ops
- Restoring Lovelace YAML as a second SoT

## Host

Pi 4 4GB+ — `http://dsc-brain.local:8787` or `http://10.42.0.1:8787` (AP) / studio `http://192.168.86.48:8787`.
