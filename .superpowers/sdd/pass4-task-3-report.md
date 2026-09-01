# Pass 4 Task 3 report — Light SPA Twin + DutyStrip

**Status:** DONE  
**Branch:** `master`  
**Pushed:** no  
**Phase B:** not started (out of scope)

## Commits

- `5144978` — feat(spa): Light Twin honesty and DutyStrip Actual  
  Files: `LightPage.tsx`, `spa-dist` (`index-BEjnawnp.js`)

## What landed

- When `light.dsc_hub_twin_sf1000` is available:
  - Honesty copy treats Twin as the live 4×8 actuator (on/off + brightness)
  - Hub GPIO5 stated as **reserved** for Twin PWM — not physically wired
  - Got hybrid narrative: Twin on-hours when history healthy, else photoperiod window
  - `got_source` chip (`Got · Twin` / `Got · Window`) from `sensor.dsc_lights_on_today_4x8` attrs (brain Task 2)
  - Window-fallback honesty attribute surfaced when `got_source === "window"`
- 4×8 DutyStrip / Actual entity: Twin when available; window binary only when Twin absent
- Twin `EntityToggle`: lighting icon + `showBrightness` (matches 2×4 lamp UX pattern)
- `npm run build:spa` → bundle `index-BEjnawnp.js`

## Test summary

- SPA production build: **pass** (`vite build --config vite.spa.config.ts`)
- No new unit tests (UI-only); brain hybrid Got already covered by Task 2 (`b4ca126`)

## Concerns

- DutyStrip still depends on brain history for Twin (`twin_sf1000_on`); cold start / unhealthy history may show empty Actual until ingest writes points — Got chip will warn `Got · Window` in that case
- SV-P1-6 / 2×4 DutyStrip 0.0H while ON remains parked for Phase C (not this task)
- Optical / physical PWM not verified — software path only; GPIO5 handoff stays in FOLLOWUPS
- Untracked Pass 4 SDD briefs left unstaged (same as prior tasks)

## Out of scope (not done)

- Phase B re-walk / Task 4 Pi smoke
- Push to remote
