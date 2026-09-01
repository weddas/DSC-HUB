# Live UX — Light desk walk (Pass 1)

**Spec:** [`docs/superpowers/specs/2026-09-01-live-ux-honesty-program-design.md`](../superpowers/specs/2026-09-01-live-ux-honesty-program-design.md) §2  
**Plan:** [`docs/superpowers/plans/2026-09-01-live-ux-honesty-program.md`](../superpowers/plans/2026-09-01-live-ux-honesty-program.md)  
**Prove script:** `.audit/live-ux-light-prove.ps1` (Task 3)  
**Screenshots:** `docs/qa-screenshots-2026-09-01-live-ux/`  
**Evidence:** `.audit/live-ux-light-prove-evidence.json`  
**Live bundle:** `assets/index-DYFvyI2i.js` (sha256 index.html `146bfc0dc8233e85…`)  
**Date:** 2026-09-01

---

## Gates

| Gate | Result | Evidence |
|------|--------|----------|
| G0 Hotpatch | **pass** | Prove script: local/live `index-DYFvyI2i.js`; index sha256 match; Windows curl verify |
| G1 Got/Want/DARK/Follow (both tents) | **pass** | Fleet Want 12.0 both; Got ≈11.99 / ≈12.0; windows `off` → DARK; 2×4 Schedule · Follow 4×8. Screenshots `light-both-tents-top.png` |
| G2 Twin / SF1000 honesty | **pass** | Twin OFF + GPIO honesty copy; SF1000 OFF chip (no live-lamp theater). Page text + screenshot |
| G3 DLI (both tents) | **pass** | Both tents: “DLI estimate needs SF1000 PPFD calibration — Fleet → Calibrate.” |
| G4 Energy Estimate + confirm gate | **pass** | HTTP E1/E2 both spaces; UI “4×8/2×4 ENERGY (ESTIMATE)” + Learning never auto-applies. `light-energy-both.png` |
| G5 Tent occupancy journals | **pass** | SPACE provenance chips; Save disabled + “Add text to enable Save”. `light-journals-both.png` |
| G6 Pytest (`test_live_ux_light_honesty`) | **pass** | `3 passed` locally (Task 1 / reconfirmed Task 3) |
| G7 Browser matrix | **pass** | B1–B16 below; screenshots + `light-page-text.txt` |
| G8 Restore (no active shift plans) | **pass** | Plans #6–#9 cancelled; pending-flips `[]`; 4×8 lights-on `06:00:00`; force-tick restored both tents |

---

## Honesty checklist (§2)

| Check | 4×8 | 2×4 | Notes |
|-------|-----|-----|-------|
| Got hours match fleet/helper SoT | **pass** | **pass** | Fleet Got ≈11.99 / ≈12.0; gauges show 12.0 |
| Want hours match fleet/helper SoT | **pass** | **pass** | Fleet Want 12.0 both; UI Want hours 12h |
| WINDOW OPEN vs DARK matches real switch state | **pass** | **pass** | `binary_sensor.*_window_open=off` → DARK chips |
| Schedule Follow 4×8 vs Independent chips honest | **pass** | **pass** | 2×4 Schedule · Follow 4×8; Climate · Follow 4×8 distinct |
| Twin SF1000 / SF1000 OFF — no live-lamp theater without GPIO | **pass** | **pass** | Twin OFF + GPIO copy; SF1000 OFF |
| Stage rail / draft tones read as Expected, not live plant | **pass** | **pass** | “outside · Early Flowering · 12h rail” / “in-band · stage rail” |
| DLI: estimate only with calibrated PPFD | **pass** | **pass** | Uncalibrated → estimate withheld (CTA path) |
| DLI: honest calibrate CTA when uncalibrated | **pass** | **pass** | Both tents show Fleet → Calibrate CTA (Task 2 fix live) |
| Energy panel labeled Estimate | **pass** | **pass** | Titles ENERGY (ESTIMATE); honesty sentence + Learning clause |
| Energy suggestions not applyable (`apply: false`) | **pass** | **pass** | HTTP apply:false; UI “Start gradual…” requires confirm path |
| Shift/gradual requires `confirm=true` | **pass** | **pass** | HTTP confirm=false → 400 both spaces |
| Tent occupancy journal provenance (observations only) | **pass** | **pass** | SPACE chips; operator prove notes + system slide rows |
| No lighting controls on plant cards | **pass** | **pass** | Crop scheduler roster rows = stage/identity only |
| Dark-violation banner matches real state | **pass** | **pass** | DARK PERIOD OK; clone dark violation off |
| Manual hold banner matches real state | **pass** | **pass** | Manual light hold OFF; override binary off |
| Auto-photoperiod banner matches real state | **pass** | **pass** | Auto photoperiod ON matches `switch.dsc_hub_auto_photoperiod=on` |

---

## Light UX checklist (§2)

| Check | Result | Notes |
|-------|--------|-------|
| Card hierarchy (Got/Want → schedule → energy → journals) | **pass** | Top cards → crop scheduler → energy → journals |
| Spacing / disabled Save clarity | **pass** | “Add text to enable Save” on empty tent note |
| Climate Want deep-link honest (not live climate editor) | **pass** | Header “Climate Want →”; 2×4 “Climate mode (Follow 4x8) →” |
| Help tips / What→Process→Expected accurate | **pass** | Stage rail Expected copy; GPIO/window SoT tips present |

---

## Energy matrix (both tents)

| Step | 4×8 | 2×4 | Notes |
|------|-----|-----|-------|
| E1 estimate + suggestions (`apply: false`) | **pass** | **pass** | label Estimate; apply false; n=4 suggestions |
| E2 confirm=false → 400 | **pass** | **pass** | “confirm=true required — no silent schedule changes” |
| E3 pause + cancel | **pass** | **pass** | plans #6/#7 paused then cancelled |
| E4 force-tick + restore lights-on | **pass** | **pass** | `se-force-tick.py`: 4×8 06:00→05:45→06:00; 2×4 20:00→20:15→20:00; plans #8/#9 cancelled |

---

## Browser checklist

| ID | Tent | Result | Notes |
|----|------|--------|-------|
| B1 Got/Want hours | 4×8 | **pass** | Gauge 12.0 / Want 12h; fleet SoT match |
| B2 WINDOW OPEN vs DARK | 4×8 | **pass** | DARK; window off |
| B3 Follow vs Independent schedule chips | 4×8 | **pass** | Own schedule (Independent path); 06:00–18:00 |
| B4 Twin / SF1000 OFF honesty | 4×8 | **pass** | TWIN SF1000 OFF + GPIO copy |
| B5 DLI / calibrate CTA | 4×8 | **pass** | Calibrate CTA visible |
| B6 Energy Estimate panel | 4×8 | **pass** | Est. $1.83/day · 5.76 kWh |
| B7 Tent occupancy journal | 4×8 | **pass** | SPACE provenance; prove note present |
| B8 Got/Want hours | 2×4 | **pass** | Gauge 12.0 / Want 12h; deviation 0.00h |
| B9 WINDOW OPEN vs DARK | 2×4 | **pass** | DARK; window off |
| B10 Follow vs Independent schedule chips | 2×4 | **pass** | Schedule · Follow 4×8 (not Independent) |
| B11 Twin / SF1000 OFF honesty | 2×4 | **pass** | SF1000 OFF |
| B12 DLI / calibrate CTA | 2×4 | **pass** | Same calibrate CTA as 4×8 |
| B13 Energy Estimate panel | 2×4 | **pass** | Est. $0.38/day · 1.20 kWh |
| B14 Tent occupancy journal | 2×4 | **pass** | SPACE provenance; prove note present |
| B15 Stage rail = Expected (not live plant) | both | **pass** | Expected stage rail chips; crop scheduler Expected |
| B16 Banners (dark-violation / manual hold / auto-photoperiod) | both | **pass** | Dark OK; hold OFF; auto ON on 2×4 |

**Parked (not a gate fail):** 2×4 DutyStrip / SF1000 24H · ACTUAL shows `0.0H ON` / 0 cycles while Got ≈12h — history strip vs photoperiod Got SoT (SV-P1-6 / Task 2). Documented; Got/Want chips remain honest.

---

## Restore

| Tent | Pre lights-on | Post restore | Plans left active? |
|------|---------------|--------------|--------------------|
| 4×8 | `06:00:00` | `06:00:00` | **no** (plans cancelled; pending-flips empty) |
| 2×4 | `20:00:00` (helper via force-tick) | `20:00:00` | **no** |

Fleet `time.dsc_hub_clone_lights_on_time` may read empty while Follow 4×8; helper restore confirmed by force-tick print + journal cancel rows.
