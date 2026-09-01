# Live UX — Pass 4 integrated walk (Twin-first)

**Spec:** [`docs/superpowers/specs/2026-09-01-live-ux-pass4-twin-integrated-design.md`](../superpowers/specs/2026-09-01-live-ux-pass4-twin-integrated-design.md)  
**Plan:** [`docs/superpowers/plans/2026-09-01-live-ux-pass4-twin-integrated.md`](../superpowers/plans/2026-09-01-live-ux-pass4-twin-integrated.md)  
**Parent:** [`docs/superpowers/specs/2026-09-01-live-ux-honesty-program-design.md`](../superpowers/specs/2026-09-01-live-ux-honesty-program-design.md) (Passes 1–3 proven)  
**Prove script:** `.audit/live-ux-pass4-prove.ps1` (Tasks 4 + 7)  
**Screenshots:** `docs/qa-screenshots-2026-09-01-live-ux/`  
**Evidence:** `.audit/live-ux-pass4-prove-evidence.json` (Task 7)  
**Prior walks:** [Light](LIVE-UX-LIGHT-WALK-2026-09.md) · [Climate](LIVE-UX-CLIMATE-WALK-2026-09.md) · [Overview](LIVE-UX-OVERVIEW-WALK-2026-09.md)  
**Date:** 2026-09-01

**Constraints:** Twin software as if present; **GPIO5 reserved** for Twin SF1000 PWM (physical wire-up later — never claim wired until physical). Gate does not require optical lamp output.

---

## Phase A — Twin PWM software (4×8)

| Check | Owner | Result | Evidence |
|-------|-------|--------|----------|
| A1 Hybrid Got: Twin-derived hours when available + healthy history | brain | **pass** | Task 2 `b4ca126`; live `got_source=twin` after Phase A hotpatch (`.audit/live-ux-pass4-prove-evidence.json`) |
| A2 Hybrid Got: window fallback when Twin unavailable or history unhealthy | brain | **pass** | Task 2 pytest `test_got_hours_4x8_falls_back_*` (8 passed in `test_live_ux_pass4_twin.py`) |
| A3 Twin on/brightness history feeds DutyStrip / Got hybrid | brain | **pass** | Task 2 `esphome_client` / `history_ops` Twin metrics; DutyStrip entity `light.dsc_hub_twin_sf1000` |
| A4 Light SPA: Twin toggle/brightness when entity available | SPA | **pass** | Task 3 `index-BEjnawnp.js`; browser Light: Twin SF1000 toggle + brightness path |
| A5 DutyStrip Actual uses Twin (or hybrid), not window-only forever | SPA | **pass** | Browser: `TWIN SF1000 24H` Actual strip (not window-only) |
| A6 Honesty copy: live actuator path; GPIO5 reserved (not “wired”) | SPA | **pass** | Browser: “Twin SF1000 is the live 4×8 actuator… Hub GPIO5 is reserved… not physically wired” |
| A7 Pi smoke: Twin entity HTTP + on/brightness command round-trip | operator | **pass** | Task 4 `.audit/live-ux-pass4-prove.ps1` Phase A — all gates ok; optical N/A. Post-fix: turn_on bri=128 fleet-persisted |
| A8 Pytest Twin hybrid guards | brain | **pass** | `pytest tests/test_live_ux_pass4_twin.py` → **8 passed** |

**Live bundle:** `assets/index-BEjnawnp.js` (index.html sha256 `040b2d0ca1826392…`)  
**Phase A note:** Prefer `docker kill`+`start` over `docker restart` (restart hung Pi mid-session). Hub light brightness now normalized to aioesphomeapi 0–1.

---

## Phase B — Integrated re-walk (inventory)

| Check | Desk | Result | Evidence |
|-------|------|--------|----------|
| B1 Light: Got/Want/DARK/Follow both tents | Light | **pending** | Task 5 |
| B2 Light: Twin hybrid + SF1000 honesty (4×8 primary) | Light | **pending** | Task 5 |
| B3 Light: Energy Estimate + confirm gate both tents | Light | **pending** | Task 5 |
| B4 Light: Tent occupancy journals provenance | Light | **pending** | Task 5 |
| B5 Climate: KIT HONEST / reduced_kit / canopy | Climate | **pending** | Task 5 |
| B6 Climate: Wet/Dry vs Problem/Clear (policy-bound) | Climate | **pending** | Task 5 |
| B7 Climate: FlowSankey air CFM + mass chip gated | Climate | **pending** | Task 5 |
| B8 Overview: photoperiod glance vs Light SoT (both tents) | Overview | **pending** | Task 5 |
| B9 Overview: critical banners vs grow-log history | Overview | **pending** | Task 5 |
| B10 Overview: Room + DSC-Core journals | Overview | **pending** | Task 5 |
| B11 Overview: Root strip / fan duties / bands grey honesty | Overview | **pending** | Task 5 |
| B12 Cross-desk parity (Follow 4×8, timers, chips) | all | **pending** | Task 5 |

### Phase B findings

| Severity | Desk | Evidence | in-scope \| pass5 |
|----------|------|----------|-------------------|
| | | | |

**Named parks (must appear if still open):** SV-P1-6 / DutyStrip Actual vs ON; AirPathMap cascade ← `sensor.dsc_cfm_cascade_2x4_allocated`; GAUGE-P0-1 Overview moisture band vs Root `potWantBand`.

---

## Phase C — Debt closeout

| Check | Result | Evidence |
|-------|--------|----------|
| C1 All Phase B findings marked in-scope — fixed or explicitly deferred | **pending** | Task 6 |
| C2 SV-P1-6 / DutyStrip: 4×8 Twin Actual; 2×4 SF1000 if still 0.0H while ON | **pending** | Task 6 |
| C3 AirPathMap cascade uses `sensor.dsc_cfm_cascade_2x4_allocated` (not `intakeClone`) | **pending** | Task 6 — `AirPathMap.tsx` |
| C4 GAUGE-P0-1: Overview moisture band = Root `potWantBand`; missing Want → unbanded | **pending** | Task 6 |
| C5 Pass 5 deferrals tagged with reason in findings table | **pending** | Task 6 |

---

## Gate — full stress + FOLLOWUPS

| Gate | Result | Evidence |
|------|--------|----------|
| G0 Hotpatch final bundle + index sha256 | **pending** | Task 7 |
| G1 Pytest (Twin hybrid + touched brain edges) | **pending** | Task 7 |
| G2 HTTP: Twin entity, energy confirm, journals, fleet, CFM cascade | **pending** | Task 7 |
| G3 Browser: Light + Climate + Overview matrix + Twin controls (no physical lamp) | **pending** | Task 7 |
| G4 Restore: no active shift plans / pending flips after mutate stress | **pending** | Task 7 |
| G5 Walk fully filled (Phase A/B/C + findings disposition) | **pending** | Task 7 |
| G6 FOLLOWUPS Pass 4 gate section committed (gate-blocking) | **pending** | Task 7 — passed/failed/flakes/residuals/Pass 5 parks/GPIO5/hashes |

---

## Restore

| Item | Pre state | Post restore | Notes |
|------|-----------|--------------|-------|
| Lights-on / Twin brightness | — | — | Record before mutate stress (Task 7) |
| Shift / gradual plans | — | — | Cancel + restore per Pass 1–3 pattern |

---

## GPIO5 operator handoff

**Hub GPIO5 = reserved for Twin SF1000 PWM module** — software path treats Twin as live actuator; physical wire-up deferred. See `docs/FOLLOWUPS.md` Pass 4 stub; expand at gate (Task 7).
