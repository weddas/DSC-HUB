# AUDIT closure — DSC-HUB 7.3

**Date:** 2026-08-27  
**Brain target:** `192.168.86.48:8787`

## Software delivered

| Area | Status |
|------|--------|
| Version truth 7.3.0 | PASS |
| Phase E shim simplified | PASS — native fleet + computed extras merge |
| Graph re-audit | PASS — [`GRAPH-REAUDIT-7.3.md`](GRAPH-REAUDIT-7.3.md) + [`screens-7.3/`](screens-7.3/) |
| Flow Sankey air/heat/humidity | PASS — experimental · [`FLOW-SANKEY.md`](../brain/FLOW-SANKEY.md) · [`FLOW-SANKEY-SOAK-7.3.md`](FLOW-SANKEY-SOAK-7.3.md) |
| Leaf VPD history + UI | PASS — [`LEAF-VPD.md`](../brain/LEAF-VPD.md) |
| N-016 lab wet wizard | PASS (UI) — backend gap noted in [`LAB-WET-CAL.md`](../ops/LAB-WET-CAL.md) |
| N-014 heater temp OOS latch | PASS — computed binary |
| Sensor trust thresholds documented | PASS — N-020..023 in `sensor_trust.py` |
| IIFE cleanup (Dash airflow) | PASS — `AirPathMap` replaces LegacyCardHost on Dash |
| R3F Twin (Pi SPA) | PASS — [`TWIN-R3F.md`](../brain/TWIN-R3F.md) · [`TWIN-PARITY-7.3.md`](TWIN-PARITY-7.3.md) · [`NEON-API-SOAK-7.3.md`](NEON-API-SOAK-7.3.md) |
| Lovelace YAML retired | PASS — [`LOVELACE-RETIRED.md`](../ops/LOVELACE-RETIRED.md) · archive `docs/archive/lovelace-7.3/`; source tree removed |

## Operator gates

| Gate | Status |
|------|--------|
| Live deploy | PASS — 2026-08-27 |
| island-proof | PASS — post-deploy |
| z2m TS0201 pair | OPEN — [`docs/ops/ZIGBEE-RECOVERY.md`](../ops/ZIGBEE-RECOVERY.md) |
| FlowSankey 48h soak | IN PROGRESS — until ~2026-08-29 |
| F-001–F-008 hardware | Honest UI only |

## Tests

- `pytest brain/tests/test_brain_pi.py` — **61/61** pass
- Frontend `npm run build:spa` + `tsc --noEmit` — clean

## Signoff

- [x] 7.3 software pass in tree
- [x] Live deploy + island-proof green
- [ ] z2m radio proof (operator)
- [ ] FlowSankey 48h soak closeout
