# Pass 4 Task 5 report — Phase B integrated re-walk inventory

**Status:** DONE_WITH_CONCERNS  
**Branch:** `master`  
**Pushed:** no  
**Phase C:** not started (debt intentionally left open)

## Commits

- `84a3387` — docs(pass4): Phase B re-walk inventory and findings
- `2f5bdf0` — docs(sdd): record Pass 4 Task 5 commit hash in report
- `557de02` — docs(sdd): note Pass 4 Task 5 commit range in progress

**Range:** `84a3387..557de02`

## What landed

- Phase B matrix filled in `docs/qa/LIVE-UX-PASS4-WALK-2026-09.md` (B1–B12)
- Phase B findings table filled (named parks + canopy/zigbee gap + minor parks)
- Inventory artifacts: `.audit/live-ux-pass4-phaseb-inventory.{py,json}`, `docs/qa-screenshots-2026-09-01-live-ux/pass4-b-*`
- **No crash-only code fixes** (none required)
- **Did not clear debt** (Phase C owns SV-P1-6 / AirPathMap / GAUGE-P0-1 / canopy fill)

## Matrix summary

| Result | Checks |
|--------|--------|
| **pass** | B1 B2 B3 B4 B5 B7 B8 B9 B10 B11 B12 |
| **fail** | B6 (Wet/Dry Safety UI absent — `zigbee_by_role` empty) |

Live bundle still `assets/index-BEjnawnp.js`.

## Findings count

**6** rows in Phase B findings table:

| # | Severity | Topic | Disposition |
|---|----------|-------|-------------|
| 1 | P0 | SV-P1-6 DutyStrip 2×4 0.0H vs Got ~12h | in-scope |
| 2 | P0 | AirPathMap cascade ← intakeClone (96 vs cascade 83.3) | in-scope |
| 3 | P0 | GAUGE-P0-1 Overview moisture 30–70 vs potWantBand | in-scope |
| 4 | P1 | Canopy/Zigbee bindings present but fleet planes empty | in-scope |
| 5 | P2 | Manual Light Hold sticky ON | pass5 |
| 6 | P3 | Energy confirm=false → 422 (not 400) | pass5 |

## Concerns

- B6 fail is environmental/brain payload (`zigbee_by_role` / `fleet.canopy` empty), not a SPA crash — Phase C should decide fix vs Pass 5 if Zigbee ingest is flaky.
- Twin Actual shows `0.0H ON` with cycles while Twin OFF — less severe than classic “lamp ON + 0.0H”, but clone DutyStrip vs Got ~12h remains the SV-P1-6 hole.
- Playwright must use `domcontentloaded` (not `networkidle`) against `:8787` SPA websockets.
- cursor-ide-browser tab API flaked this session; inventory used browser-use MCP + Playwright.

## Out of scope (not done)

- Phase C debt closeout / fixes
- Task 7 full gate stress + FOLLOWUPS write-up
- Push to remote
