# Task 6 Report: Pass 2 — Climate Pi prove + walk fill

**Status:** complete (gate **GREEN**)  
**Branch:** master  
**Date:** 2026-09-01  
**Commit:** `bb6cf1a` — prove(climate): Pass 2 Pi hotpatch walk gate green

## Summary

Hotpatched SPA `index-CzcL7cKc.js` to Pi `dsc@192.168.86.48`, verified index hash, HTTP-proved reduced_kit / canopy / CFM, browser-walked `#/live/climate` (zone matrix + Light schedule chips), filled the Climate walk (all gates pass), parked AirPathMap cascade alias in FOLLOWUPS, and left Overview unblocked. Did **not** push.

## Deliverables

| Item | Path | Notes |
|------|------|-------|
| Prove script | `.audit/live-ux-climate-prove.ps1` | Pack SPA → pscp/plink → verify live index |
| Remote helper | `.audit/live-ux-climate-prove.sh` | docker cp static + HTTP reduced_kit/canopy/CFM |
| Screenshot helper | `.audit/live-ux-climate-screenshots.py` | Playwright zone matrix + Light schedule |
| Evidence JSON | `.audit/live-ux-climate-prove-evidence.json` | All prove gates `ok: true` |
| Walk (filled) | `docs/qa/LIVE-UX-CLIMATE-WALK-2026-09.md` | Every cell pass + evidence |
| Screenshots | `docs/qa-screenshots-2026-09-01-live-ux/climate-*` | all / 4x8 / 2x4 / room / sankey / canopy / safety / light / fullpage + text |
| FOLLOWUPS | `docs/FOLLOWUPS.md` | Pass 2 live prove + AirPathMap park reconfirm |

## Hotpatch / HTTP

- Local/live bundle: `assets/index-CzcL7cKc.js`
- index.html sha256: `4ecda6acb935666e25b0cce883389b2b732d645253cd100c516365a460fbca02`
- Brain modules: **not** redeployed (SPA-only)
- `binary_sensor.dsc_reduced_kit=off`; planned_oos includes POT3/POT4; offline lead has neither
- `/fleet` canopy: role `canopy_4x8`, live T/RH
- CFM: 5/5 allocated sensors present (incl. cascade_2x4)

## Browser

Full Auto ON (not Capacity offline); zone All/4×8/2×4/Room; Climate Mode ≠ Light SCHEDULE · FOLLOW; Sankey AIR CFM + MASS CHIP GATED; canopy bound labeled; Wet/Dry Dry + Clear from policy. Screenshots under `docs/qa-screenshots-2026-09-01-live-ux/`.

## Pytest

`5 passed` — `tests/test_live_ux_climate_honesty.py` + `tests/test_reduced_kit.py`

## Gate

| Gate | Result |
|------|--------|
| G0–G9 | **pass** |
| Honesty + Light UX + HTTP + Browser checklists | **pass** |
| Overall Pass 2 Climate | **GREEN** |

## Concerns / parks

- **AirPathMap cascade ← intake 2×4** — SVG still aliases cascade ribbon to `intakeClone`; FlowSankey honesty green — parked, does not block Overview.
- **Canopy unbound empty** — live kit bound; unbound never-fill proven by SPA copy + Task 5 path (no live unbind during prove).
- CFM allocated values fluctuate with fan duty; presence + Sankey air-only / gated mass chip are the honesty gates.

## Out of scope

- Push to remote
- Overview Pass 3 (Task 7+) — Climate gate is green so parent may proceed
- AirPathMap cascade sensor wiring (parked)
