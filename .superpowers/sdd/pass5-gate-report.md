# Pass 5 gate report — Tasks 6–7 soak + full gate

**Status:** DONE  
**Gate:** **GREEN**  
**Date:** 2026-09-01  
**Pushed:** no

## Summary

Pass 5 Tasks 6–7 closed the five-pass Live UX program: Manual Hold cleared (control-map fix + operator POST), Zigbee Wet→Problem walk filled from Task 5 evidence, short soak + three-desk browser re-walk honesty-green, GATE HTTP/pytest GREEN, FOLLOWUPS write-up committed. Parent + Pass 5 design marked **proven**.

## Commits

| SHA | Message |
|-----|---------|
| `d07cbd9` | feat(pass5): clear Hold, GATE GREEN, close Live UX program |

## Hashes

| Artifact | Value |
|----------|-------|
| SPA bundle | `assets/index-BoyhWWR_.js` |
| index.html sha256 | `d00bd5a4be5f2188c566b62618e7be3de828d26990e435915974c1bcd4cb92c8` |
| Brain hotpatch | `hub_controls.py` Hold → `HUB_SWITCH_ENTITY_TO_OID` via docker **stop+start** (no kill) |
| Evidence | `.audit/live-ux-pass5-prove-evidence.json` (`ok=true`) |
| Zigbee evidence | `.audit/live-ux-pass5-task5-evidence.json` (`ok=true`) |
| Browser | `docs/qa-screenshots-2026-09-01-live-ux/pass5-*` + `pass5-g-browser-inventory.json` |

## Gate matrix

| Gate | Result |
|------|--------|
| G0 | **pass** — index hash match; no SPA hotpatch required |
| G1 | **pass** — 122 pytest |
| G2 | **pass** — Twin / energy 400 / cascade 83.3 / Zigbee policy_state / Hold off |
| G3 | **pass** — Light/Climate/Overview both tents; no honesty fails |
| G4 | **pass** — Twin off; plans cancelled; pending_flips=[] |
| G5 | **pass** — walk filled |
| G6 | **pass** — FOLLOWUPS Pass 5 gate section |

## Key landings

1. **Hold write path** — was ingest-only; now controllable via `/control/service` `{domain,service,data}`; cleared **off** on live Pi + SPA.
2. **Zigbee** — Task 5 resume (no docker kill) LIVE GREEN; GATE dry MQTT re-seed after stop/start.
3. **Prove harness** — `.audit/live-ux-pass5-prove.ps1` `PASS5_PHASE=GATE` extended (Windows HTTP; no kill).

## Concerns (non-blocking)

1. Prefer **docker stop+start** over kill — Task 5 kill hung the Pi; stop+start recovered cleanly this gate.
2. Hold / Twin fleet lag ~1 poll after command — wait before asserting.
3. `policy_state` clears on brain restart until MQTT event — dry-pub re-seeds.
4. Hardware parks remain: GPIO5 optical, `leak_floor_2x4`.

## Program

**Passes 1–5 proven.** Five-pass Live UX honesty program **closed**.
