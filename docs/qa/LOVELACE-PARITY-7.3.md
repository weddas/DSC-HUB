# Lovelace parity matrix — 7.3 retirement

**Date:** 2026-08-27  
**Archive:** [`docs/archive/lovelace-7.3/`](../archive/lovelace-7.3/)

Pi SPA `:8787` is the product SoT. Lovelace `/dsc-hub-pro` YAML is archived and no longer synced to HA.

| Lovelace view (archived) | React route | Parity |
|--------------------------|-------------|--------|
| Climate | `/live/*` | PASS — charts, Got/Want, FlowSankey |
| Main / Clone / Root / Light | `/live/main`, `/live/clone`, `/live/4x8`, `/live/2x4`, `/live/root`, `/live/light` | PASS |
| Twin / Dash | `/live/twin`, `/ops/dash` | PASS — R3F twin on Pi SPA |
| Learning / Trends / History | `/tune/*` | PASS — Tune fleet pages |
| Tank / Nutrient | `/tune/*`, Calibrate tank tab | PASS — honest dummy when OOS |
| Ops / System / Fleet | `/fleet`, `/ops/*` | PASS |
| Catalog / Plant build | Compose in SPA (no LegacyCardHost) | PASS — Pi path skips IIFE cards |

## Sync changes

- `scripts/ha-sync.sh` — dashboard copy skipped (7.3)
- `dsc-hub-sync` — dashboard staging skipped (7.3)
- `homeassistant/configuration.snippet.yaml` — `lovelace.dashboards` commented

## Emergency ops

Use Pi SPA `:8787` or export archived YAML from `docs/archive/lovelace-7.3/` if HA Lovelace must be restored manually. Full restore steps: [`docs/ops/LOVELACE-RETIRED.md`](../ops/LOVELACE-RETIRED.md).
