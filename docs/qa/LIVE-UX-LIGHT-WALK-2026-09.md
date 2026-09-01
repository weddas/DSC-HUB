# Live UX — Light desk walk (Pass 1)

**Spec:** [`docs/superpowers/specs/2026-09-01-live-ux-honesty-program-design.md`](../superpowers/specs/2026-09-01-live-ux-honesty-program-design.md) §2  
**Plan:** [`docs/superpowers/plans/2026-09-01-live-ux-honesty-program.md`](../superpowers/plans/2026-09-01-live-ux-honesty-program.md)  
**Developer runbook:** [`docs/brain/LIVE-UX-HONESTY.md`](../brain/LIVE-UX-HONESTY.md) (tip `3d1ead4` · spa `index-DYFvyI2i.js`)  
**Task 2 report:** [`.superpowers/sdd/task-2-report.md`](../../.superpowers/sdd/task-2-report.md) (SPA CTAs in repo; walk fill = Task 3)  
**Prove script:** `.audit/live-ux-light-prove.ps1` (Task 3 — may still be absent)  
**Screenshots:** `docs/qa-screenshots-2026-09-01-live-ux/`

---

## Gates

| Gate | Result | Evidence |
|------|--------|----------|
| G0 Hotpatch | | |
| G1 Got/Want/DARK/Follow (both tents) | | |
| G2 Twin / SF1000 honesty | | |
| G3 DLI (both tents) | | |
| G4 Energy Estimate + confirm gate | | |
| G5 Tent occupancy journals | | |
| G6 Pytest (`test_live_ux_light_honesty`) | | |
| G7 Browser matrix | | |
| G8 Restore (no active shift plans) | | |

---

## Honesty checklist (§2)

| Check | 4×8 | 2×4 | Notes |
|-------|-----|-----|-------|
| Got hours match fleet/helper SoT | | | |
| Want hours match fleet/helper SoT | | | |
| WINDOW OPEN vs DARK matches real switch state | | | |
| Schedule Follow 4×8 vs Independent chips honest | | | |
| Twin SF1000 / SF1000 OFF — no live-lamp theater without GPIO | | | |
| Stage rail / draft tones read as Expected, not live plant | | | |
| DLI: estimate only with calibrated PPFD | | | |
| DLI: honest calibrate CTA when uncalibrated | | | |
| Energy panel labeled Estimate | | | |
| Energy suggestions not applyable (`apply: false`) | | | |
| Shift/gradual requires `confirm=true` | | | |
| Tent occupancy journal provenance (observations only) | | | |
| No lighting controls on plant cards | | | |
| Dark-violation banner matches real state | | | |
| Manual hold banner matches real state | | | |
| Auto-photoperiod banner matches real state | | | |

---

## Light UX checklist (§2)

| Check | Result | Notes |
|-------|--------|-------|
| Card hierarchy (Got/Want → schedule → energy → journals) | | |
| Spacing / disabled Save clarity | | |
| Climate Want deep-link honest (not live climate editor) | | |
| Help tips / What→Process→Expected accurate | | |

---

## Energy matrix (both tents)

| Step | 4×8 | 2×4 | Notes |
|------|-----|-----|-------|
| E1 estimate + suggestions (`apply: false`) | | | |
| E2 confirm=false → 400 | | | |
| E3 pause + cancel | | | |
| E4 force-tick + restore lights-on | | | |

---

## Browser checklist

| ID | Tent | Result | Notes |
|----|------|--------|-------|
| B1 Got/Want hours | 4×8 | | |
| B2 WINDOW OPEN vs DARK | 4×8 | | |
| B3 Follow vs Independent schedule chips | 4×8 | | |
| B4 Twin / SF1000 OFF honesty | 4×8 | | |
| B5 DLI / calibrate CTA | 4×8 | | |
| B6 Energy Estimate panel | 4×8 | | |
| B7 Tent occupancy journal | 4×8 | | |
| B8 Got/Want hours | 2×4 | | |
| B9 WINDOW OPEN vs DARK | 2×4 | | |
| B10 Follow vs Independent schedule chips | 2×4 | | |
| B11 Twin / SF1000 OFF honesty | 2×4 | | |
| B12 DLI / calibrate CTA | 2×4 | | |
| B13 Energy Estimate panel | 2×4 | | |
| B14 Tent occupancy journal | 2×4 | | |
| B15 Stage rail = Expected (not live plant) | both | | |
| B16 Banners (dark-violation / manual hold / auto-photoperiod) | both | | |

---

## Restore

| Tent | Pre lights-on | Post restore | Plans left active? |
|------|---------------|--------------|--------------------|
| 4×8 | | | |
| 2×4 | | | |
