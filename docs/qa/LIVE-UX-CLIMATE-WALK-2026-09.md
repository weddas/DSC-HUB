# Live UX — Climate desk walk (Pass 2)

**Spec:** [`docs/superpowers/specs/2026-09-01-live-ux-honesty-program-design.md`](../superpowers/specs/2026-09-01-live-ux-honesty-program-design.md) §3  
**Plan:** [`docs/superpowers/plans/2026-09-01-live-ux-honesty-program.md`](../superpowers/plans/2026-09-01-live-ux-honesty-program.md)  
**Prerequisite:** Light walk (Pass 1) gate green  
**Prove script:** `.audit/live-ux-climate-prove.ps1` (planned)  
**Screenshots:** `docs/qa-screenshots-2026-09-01-live-ux/`  
**Developer runbook:** [`docs/brain/LIVE-UX-HONESTY.md`](../brain/LIVE-UX-HONESTY.md) (Pass 2)  
**Prerequisite status:** Light walk **GREEN** (`985a2c4`)  
**Pytest tip:** `2feb837` — `brain/tests/test_live_ux_climate_honesty.py` **SHIPPED** (brain guards only; desk still blank)

---

## Gates

| Gate | Result | Evidence |
|------|--------|----------|
| G0 Hotpatch | | |
| G1 Full Auto vs reduced-kit honesty | | |
| G2 Zone focus (All / 4×8 / 2×4 / Room) | | |
| G3 Climate Mode vs Light schedule chips | | |
| G4 Sankey air-only + mass chip gated | | |
| G5 Canopy honesty | | |
| G6 Wet/Dry vs Problem/Clear | | |
| G7 Pytest (`test_live_ux_climate_honesty`) | **code shipped** | Tip `2feb837` — fill after prove-machine re-run |
| G8 Browser matrix | | |
| G9 Restore | | |

---

## Honesty checklist (§3)

| Check | Result | Notes |
|-------|--------|-------|
| Full Auto vs Capacity offline — honest distinction | | |
| Reduced-kit: pot3/4 in `planned_oos` only, never offline lead | | |
| GotWantBars match fleet SoT | | |
| Zone All: aggregate view honest | | |
| Zone 4×8: tent Want editor scope correct | | |
| Zone 2×4: tent Want editor scope correct | | |
| Zone Room: lung view only — not tent Want editor | | |
| 2×4 Climate Mode chips ≠ Light schedule Follow chips | | |
| Air CFM Sankey only (no mass theater) | | |
| Mass-imbalance chip gated (not live alarm) | | |
| Canopy unbound: never fills / no fake live | | |
| Canopy bound: role/device labeled | | |
| Canopy stale held → warn tone | | |
| Wet/Dry = raw sensor reading | | |
| Problem/Clear only from bound `policy_state` | | |
| SPA does not infer problem from wet alone | | |

---

## Light UX checklist (§3)

| Check | Result | Notes |
|-------|--------|-------|
| Zone switcher clarity (All / 4×8 / 2×4 / Room) | | |
| Help tips accurate | | |
| Spacing / hierarchy | | |

---

## HTTP checklist

| Endpoint / entity | Result | Notes |
|-------------------|--------|-------|
| `binary_sensor.dsc_reduced_kit` attrs via `/fleet/computed` | | |
| Canopy fields present / honest | | |
| CFM sensors present | | |

---

## Browser checklist

| ID | Zone | Result | Notes |
|----|------|--------|-------|
| B1 Full Auto / reduced-kit banner | All | | |
| B2 GotWantBars | 4×8 | | |
| B3 GotWantBars | 2×4 | | |
| B4 Room lung view (not Want editor) | Room | | |
| B5 Climate Mode chips (2×4) | 2×4 | | |
| B6 Light schedule Follow chips distinct | 2×4 | | |
| B7 Sankey air CFM only | All | | |
| B8 Mass-imbalance chip gated | All | | |
| B9 Canopy unbound empty | both tents | | |
| B10 Canopy bound labeled | both tents | | |
| B11 Wet/Dry raw reading | safety | | |
| B12 Problem/Clear from policy only | safety | | |

---

## Restore

| Item | Pre state | Post restore | Notes |
|------|-----------|--------------|-------|
| Climate levers stressed | | | |
