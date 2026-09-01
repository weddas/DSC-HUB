# Pass 4 Task 4 report — Phase A Pi smoke (Twin software)

**Status:** DONE (Phase A GREEN)  
**Branch:** `master`  
**Pushed:** no  
**Phase B:** not started (out of scope)

## Commits

- `48b443d` — prove(pass4): Phase A Twin Pi smoke and hub light brightness scale

## What landed

- `.audit/live-ux-pass4-prove.ps1` + `.audit/live-ux-pass4-prove.sh` — Phase A hotpatch (SPA `index-BEjnawnp.js` + brain) + Twin smoke
- Hotpatch uses `docker kill` + `start` (not bare `restart` — hang risk)
- Waits for hub online / Twin in controls before A7
- Brain fix: hub light brightness 0–255 → aioesphomeapi 0–1; ingest maps 0–1 → 0–255
- Phase A rows filled in `docs/qa/LIVE-UX-PASS4-WALK-2026-09.md`
- Evidence: `.audit/live-ux-pass4-prove-evidence.json`

## Prove summary

| Gate | Result |
|------|--------|
| A_G0_index_bundle (`index-BEjnawnp.js`) | pass |
| A_G0_health | pass |
| A7_twin_entity_available | pass |
| A7_twin_turn_on_brightness (HTTP accept; optical N/A) | pass |
| A7_twin_restore | pass |
| A_hybrid_got_attrs (`got_source` twin/window) | pass |

Post-fix (warm hub): `turn_on` brightness 128 fleet-persisted `on/128`. Browser Light: Twin honesty + GPIO5 reserved + Got · Twin + Twin SF1000 24H Actual + toggle OFF.

Pytest: `tests/test_live_ux_pass4_twin.py` → **8 passed**

## Concerns

- First attempt used `docker restart` and hung the Pi (~15 min down; needed recovery). Scripts now use kill/start.
- Immediately after brain restart, Twin may be absent from `hass_extras` until hub reconnect (~15–40s); prove waits on `/fleet` controls.
- Fleet on/off can lag or flake right after restart; warm-hub commands persist. turn_off sometimes needs retries (Manual Light Hold still ON).
- Optical / GPIO5 physical wire-up still deferred — never claim wired.
- Phase B inventory not run.

## Out of scope (not done)

- Phase B re-walk / Task 5+
- Push to remote
- Full Task 7 gate stress
