# Task 3 Report: Pass 1 — Light Pi prove + walk fill

**Status:** complete (gate **green**)  
**Branch:** master  
**Date:** 2026-09-01

## Summary

Hotpatched SPA `index-DYFvyI2i.js` to Pi `dsc@192.168.86.48`, ran HTTP energy honesty for both tents, browser-walked `#/live/light`, filled the Light walk (all gates pass), restored schedule stress, and recorded Pass 1 in FOLLOWUPS. Climate (Task 4) is **unblocked**.

## Deliverables

| Item | Path | Notes |
|------|------|-------|
| Prove script | `.audit/live-ux-light-prove.ps1` | Pack SPA → pscp/plink → verify live index |
| Remote helper | `.audit/live-ux-light-prove.sh` | docker cp static + HTTP E1/E2/E3 + journals + G8 |
| Screenshot helper | `.audit/live-ux-light-screenshots.py` | Playwright captures for walk |
| Evidence JSON | `.audit/live-ux-light-prove-evidence.json` | All prove gates `ok: true` |
| Walk (filled) | `docs/qa/LIVE-UX-LIGHT-WALK-2026-09.md` | Every cell pass + evidence |
| Screenshots | `docs/qa-screenshots-2026-09-01-live-ux/` | top / energy / journals / crop / fullpage + text dump |
| FOLLOWUPS | `docs/FOLLOWUPS.md` | Pass 1 section (hashes + DutyStrip park) |

## Hotpatch / HTTP

- Local/live bundle: `assets/index-DYFvyI2i.js`
- index.html sha256: `146bfc0dc8233e85fefccc6924939aa21e96e5ceb816a603c62e5100d3521ea9`
- Brain modules: **not** redeployed (Task 1 was tests-only)
- E1/E2 both spaces: Estimate + `apply: false`; confirm=false → 400
- E3 pause/cancel plans #6/#7; E4 force-tick via `se-force-tick.py` plans #8/#9 cancelled
- Restore: 4×8 `06:00:00`, 2×4 helper `20:00:00`; pending-flips `[]`

## Browser (both tents)

Got/Want, DARK, Follow vs Independent, Twin/SF1000 OFF, DLI calibrate CTA (both), ENERGY (ESTIMATE), occupancy journals with SPACE provenance + disabled-Save hint, Expected stage rails, banners (Dark OK / hold OFF / auto ON). Screenshots under `docs/qa-screenshots-2026-09-01-live-ux/`.

## Gate

| Gate | Result |
|------|--------|
| G0–G8 | **pass** |
| Honesty + Light UX + Energy + Browser checklists | **pass** |
| Overall Pass 1 Light | **GREEN** |

## Concerns / parks

- **2×4 DutyStrip `0.0H ON` vs Got ≈12h** — parked (SV-P1-6); does not fail Got/Want honesty. Logged in walk Notes + FOLLOWUPS.
- Fleet `time.dsc_hub_clone_lights_on_time` often empty under Follow 4×8; restore proven via force-tick helper print + journal cancels.

## Out of scope

- Push to remote
- Climate Pass 2 (Task 4+) — not started; Light gate is green so parent may proceed
