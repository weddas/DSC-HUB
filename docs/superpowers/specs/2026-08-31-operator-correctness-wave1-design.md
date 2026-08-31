# Operator correctness Wave 1 — SoftCal, Build-a-Plant, cal UX, input stability

**Date:** 2026-08-31  
**Status:** approved for Wave 1 implement (goal continuation 2026-08-31)  
**Goal:** DSC operator polish (Zigbee + extra hardware parked)  
**Parent plan:** Cursor plan `DSC operator polish goal` / waves 1–5

## Problem

Operators cannot treat SoftCal, Build-a-Plant, and fan calibration as one honest path:

1. Kit probes 1–2 may still have `assigned_plant_id` while SoftCal looks “ready” with no assignment chrome.
2. Calibration types lack a shared **What / Process / Expected outcome** strip.
3. Build-a-Plant nickname (and other `EntityText` drafts) can disappear if the operator hits **Next** without blurring.
4. Native `<select>` menus can clip under cards / panels with `overflow: hidden`.
5. Learning and Fleet → Calibrate both touch the same fan hold helpers — dual-door confusion.

## Goals

1. Honest probe assignment on SoftCal / Soil Test / lab wet (no silent auto-detach).
2. Uniform outcome strip for fan, SoftCal, lab wet, soil test, peer.
3. Fleet → Calibrate is guided fan-session source of truth; Learning points there.
4. Flush text drafts on Next / Commit so nickname survives step changes.
5. Fix select stacking / overflow so dropdowns are usable.
6. Pi evidence (screenshots or fleet JSON) for the above.

## Non-goals (this wave)

- CannaLib full browse / multi-field search / icons / strain images (Wave 2)
- Local cropped PPFD maps (Wave 3)
- Twin HELD / Sankey MASS IMBALANCE / plant UUID migrate close-out (Wave 4)
- Page motion, gauge load animation, HF model install (Wave 5)
- Force-detach when opening SoftCal
- Anemometer procurement; fan dry-run without live hold (warn only)
- N-016 lab wet ESP truth rewrite

## Decisions

| Topic | Choice |
|-------|--------|
| SoftCal vs assigned plant | SoftCal **allowed** on assigned probes; show chip `Probe N · plant:… · SoftCal OK` |
| Auto-detach | **No** — Roster detach remains SoT |
| Fan session home | **Fleet → Calibrate**; Learning deep-link + copy only |
| Nickname | Flush drafts in `goNext` / commit before reading helpers |
| Approach | Honesty-first UX pass (not mega-wizard merge) |

## Probe + SoftCal / Soil / lab

```text
SoftCal chip = Probe N · {plant:{uuid} or nickname | Unassigned} · SoftCal OK
If assigned on Soil Test / lab wet:
  Banner: Probe has a plant — SoftCal OK; detach before Soil Test move if relocating the probe
```

Live baseline (2026-08-31): pot1 and pot2 **assigned**; SoftCal hardware-ready either way.

## Calibration strips (copy contract)

| Type | What | Process (summary) | Expected outcome |
|------|------|-------------------|------------------|
| Fan | Map duct % → CFM with anemometer | Select duct → sample 25–100% → save points | `sensor.dsc_cfm_curves_status` reflects that duct; **Start holds live fans** |
| SoftCal | Soft offsets vs tap / after-water | Pick probe → capture phases → apply | Offsets on ESP SoftCal plane; dual-stack blocks apply if active |
| Lab wet | Stamp one channel with buffer | Rinse → buffer → stamp → re-seat | Lab wet script success; peer median ≠ substitute |
| Soil test | Hold reading at station timing | Station → target → timing → move → capture → confirm | Confirmed soil-test row in brain history |
| Peer | Capture / push peer offsets | Capture baseline → push to ESP | Peer script status; peer ≠ lab |

## Build-a-Plant + input stability

- `EntityText` exposes flush (or shared `flushEntityTextDrafts()`); `PlantWizard.goNext` and commit call it before helper reads.
- Keep existing focus guards against hub tick overwrite while focused.
- Compose assign / catalog native selects: raise stacking; audit `.dsc-decision-panel` / `.dsc-wizard-panel` `overflow: hidden` so lists are not clipped.

## Learning

Existing link to `/fleet/calibrate` stays. Copy: guided fan session lives on Calibrate; this page edits the same helpers.

## File map

| Area | Files |
|------|--------|
| SoftCal chip | `homeassistant/.../SoftCalWizard.tsx` |
| Soil/lab banners + strips | `CalibratePage.tsx`, `SoilTestWizard.tsx`, SoftCal |
| Learning copy | `LearningWizard.tsx` |
| Nickname flush | `PlantWizard.tsx`, `ui.tsx` (`EntityText`) |
| Stacking | `styles/dsc.css` |
| FOLLOWUPS | `docs/FOLLOWUPS.md` after evidence |

## Acceptance

1. SoftCal shows Probe N assignment (plant id/nickname or Unassigned).
2. Soil Test / lab wet show assigned warning when plant bound.
3. Each cal surface shows What / Process / Expected outcome.
4. Nickname typed then **Next** without blur still present on review/commit.
5. Native assign/strain selects not clipped (visual check).
6. Fan Start copy states live hold; curve status honest if incomplete.
7. Pi evidence for 1–4 (screenshots and/or fleet JSON).

## Later waves (same goal)

2. CannaLib browse/search/icons/images  
3. Local cropped PPFD  
4. Twin/Sankey honesty + UUID migrate verify  
5. Visual polish + AI architect (keep Pi SoftCal/Ollama; HF greenhouse TS offline later)
