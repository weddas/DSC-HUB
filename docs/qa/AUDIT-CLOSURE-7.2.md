# AUDIT closure — DSC-HUB 7.2

**Date:** 2026-08-27  
**Brain target:** `192.168.86.48` (`dsc-brain.local`)

## New features (software)

| Area | Status | Notes |
|------|--------|-------|
| Global modifiers | PASS | Fan/light scale, per-zone temp/RH offsets, clamp |
| Zigbee multi-probe | PASS | Per-placement entities, modifiers on ingest |
| Soil probe workflow | PASS | probe_station defaults pot2/pot4, soil_tests API, wizard |
| Chart QoL | PASS | Room VPD in BandChartHost, unit-aware axis domains |
| Sankey prototype | PASS | Experimental on Climate page |
| ZIGBEE-RECOVERY.md | PASS | Ops doc for stick recovery + TS0201 |

## Hardware (honest UI only)

| Gate | Status |
|------|--------|
| F-001–F-008 | OOS rows — not installed |
| Zigbee stick live | Operator — radio recovery on Pi |
| Fleet OTA probe UART | Scheduled Nest path |

## Tests

- `pytest brain/tests/test_brain_pi.py` — **60/60** pass
- Frontend `tsc` + `build:spa` via CI workflow

## Signoff

- [x] Global modifiers API + Settings UI
- [x] Soil test wizard + probe stations
- [x] Zigbee per-device entities
- [x] Sankey prototype flagged experimental
- [ ] Live redeploy from studio LAN (operator)
- [ ] z2m TS0201 pair proof (operator, radio up)
