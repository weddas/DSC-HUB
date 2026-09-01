# Pass 4 Task 6 report — Phase C debt closeout

**Status:** DONE_WITH_CONCERNS  
**Date:** 2026-09-01  
**Commits:** `083c178` (fix) · `f7da4e7` (progress) — local only, not pushed  
**Bundle:** `spa-dist/assets/index-BoyhWWR_.js` (build:spa)

## Summary

Closed all in-scope Phase B findings in source. Pass 5 items deferred with reasons. Did **not** push; did **not** run Task 7 full gate.

## Fixed

| ID | Fix |
|----|-----|
| **SV-P1-6** | `sf1000_on` binary history ingest + `ENTITY_METRIC_MAP` → DutyStrip; Light 2×4 **Actual** strip = `binary_sensor.dsc_hub_2x4_window_open` (Got SoT); separate **SF1000 lamp 24h** strip |
| **AirPathMap cascade** | Required `cascade` prop from `sensor.dsc_cfm_cascade_2x4_allocated` (Climate, Overview, tent cockpits) — no `intakeClone` alias |
| **GAUGE-P0-1** | Overview Root gauges use per-probe `potWantBand`; missing Want → unbanded (no fake 30–70) |
| **Canopy / zigbee_by_role** | `_reapply_bindings_to_fleet` includes safety roles + binding stubs; canopy role without live temp; seed on empty by_role in `apply_zigbee_cache_to_state` and after devices list update |

## Deferred (pass5)

| ID | Reason |
|----|--------|
| Manual Light Hold sticky ON | Intentional hold after Phase A stress — confirm/clear at gate, do not auto-mutate |
| Energy `confirm=false` → 422 | Still blocks silent shift; status-code drift vs Pass 1 400 only |

## Tests

- `pytest tests/test_live_ux_pass4_twin.py` (+ SF1000 on/map/query guards) — **pass**
- Zigbee stub/safety/reapply guards in `test_brain_pi.py` — **pass**
- Combined focused run: **17 passed**

## Walk

`docs/qa/LIVE-UX-PASS4-WALK-2026-09.md` — Phase C rows **pass**; findings disposition column filled.

## Concerns (for Task 7)

1. **Live Wet/Dry prove** still needs MQTT payload on leak roles after hotpatch; stubs restore the Climate card but Wet/Dry may show `—` until sensor publishes. Problem/Clear still requires bound task `policy_state` (no new recipes this task).
2. **Historical SF1000 brightness samples** in SQLite are not backfilled to `sf1000_on` — strip honesty improves going forward after hotpatch.
3. **Pi hotpatch + browser re-walk** not done here (Task 7 gate owns prove).
4. Twin Actual `0.0H` with brief Phase A cycles while OFF is expected (sub-0.1h rounding) — not treated as open park.
