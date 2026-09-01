# Live UX Pass 4 — Twin-first Integrated Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship Twin 4×8 software path (as if present), inventory Live via re-walk findings → debt closeout, full-stress gate with mandatory FOLLOWUPS + GPIO5 handoff.

**Architecture:** Approach A — Phase A Twin hybrid Got/DutyStrip → Phase B inventory re-walk (findings table) → Phase C consume findings + named parks → Gate full stress + FOLLOWUPS write-up.

**Tech Stack:** Pi DSC-Brain, React SPA, pytest, plink/pscp, history_ops / light_loop / LightPage / AirPathMap / Overview

**Spec:** [`docs/superpowers/specs/2026-09-01-live-ux-pass4-twin-integrated-design.md`](../specs/2026-09-01-live-ux-pass4-twin-integrated-design.md)

## Global Constraints

- Twin software as if present; **do not require physical lamp** for gate
- **GPIO5** = reserved Twin SF1000 PWM — document; never claim physically wired
- 4×8 Got **hybrid**: Twin when available + healthy on/brightness history; else window
- Phase B inventories and passes findings to Phase C; C clears in-scope list
- Named parks always: SV-P1-6 DutyStrip, AirPathMap cascade, GAUGE-P0-1 moisture band
- Full stress gate; **FOLLOWUPS dated section is gate-blocking**
- Both tents parity where desks expose them; Zigbee/F-001/F-002 still parked
- Commit when operator asked / during SDD execution; no secrets in docs

## File map

| Path | Role |
|------|------|
| `brain/dsc_brain/light_loop.py` / `computed_ops.py` / `history_ops.py` / `esphome_client.py` | Hybrid Got + Twin history |
| `brain/tests/test_live_ux_pass4_twin.py` | Twin hybrid + history guards |
| `.../pages/LightPage.tsx`, `DutyStrip.tsx` | Twin UI, Actual strip source |
| `.../components/AirPathMap.tsx` | Cascade CFM SoT |
| Overview moisture / `potWantBand` consumers | GAUGE-P0-1 |
| `docs/qa/LIVE-UX-PASS4-WALK-2026-09.md` | Walk + Phase B findings |
| `.audit/live-ux-pass4-prove.ps1` | Gate hotpatch/prove |
| `docs/FOLLOWUPS.md` | Gate write-up + GPIO5 |

---

### Task 1: Walk scaffold + GPIO5 handoff stub

**Files:**
- Create: `docs/qa/LIVE-UX-PASS4-WALK-2026-09.md`
- Modify: `docs/FOLLOWUPS.md` — short stub row noting GPIO5 reserved (expand at gate)

- [ ] **Step 1:** Walk with Phase A/B/C/Gate tables + empty **Phase B findings** table (severity, desk, evidence, in-scope|pass5)
- [ ] **Step 2:** FOLLOWUPS one-liner: Hub GPIO5 reserved for Twin SF1000 PWM (physical later)
- [ ] **Step 3:** Commit

---

### Task 2: Phase A — Twin hybrid Got (brain)

**Files:**
- Modify: `brain/dsc_brain/computed_ops.py` (`_light_runtime_snapshot` / `got_hours_4x8`)
- Modify: `brain/dsc_brain/light_loop.py` if needed
- Modify: `brain/dsc_brain/esphome_client.py` / `history_ops.py` — ensure Twin on/brightness history
- Test: `brain/tests/test_live_ux_pass4_twin.py`

**Interfaces:**
- Produces: `got_hours_4x8` prefers Twin-derived hours when Twin available + healthy history; else `window_4x8_open` hours
- Produces: history metric for Twin suitable for DutyStrip (on/off or brightness→on)

- [ ] **Step 1: Failing tests** for hybrid preference and window fallback
- [ ] **Step 2: Implement minimal hybrid Got + history ingest**
- [ ] **Step 3: pytest PASS**
- [ ] **Step 4: Commit**

---

### Task 3: Phase A — Light SPA Twin + DutyStrip

**Files:**
- Modify: `homeassistant/.../pages/LightPage.tsx`
- Possibly: `DutyStrip.tsx` / history entity id for 4×8 Actual

- [ ] **Step 1:** When Twin available: honesty copy as live actuator; GPIO5 reserved (not “wired”); DutyStrip/Actual uses Twin (or hybrid entity), not window-only
- [ ] **Step 2:** Confirm toggle/brightness UX; build:spa
- [ ] **Step 3:** Commit src + spa-dist

---

### Task 4: Phase A Pi smoke (Twin software)

**Files:**
- Create or extend: `.audit/live-ux-pass4-prove.ps1` (Phase A section)
- Hotpatch SPA+brain; HTTP Twin entity; browser Light Twin controls (no physical lamp)

- [ ] **Step 1:** Hotpatch; verify index hash
- [ ] **Step 2:** Twin entity available; brightness/on command round-trip accepted (optical output N/A)
- [ ] **Step 3:** Fill Phase A rows in Pass 4 walk; commit

---

### Task 5: Phase B — Integrated re-walk inventory

**Files:**
- Modify: `docs/qa/LIVE-UX-PASS4-WALK-2026-09.md` — Phase B matrix + **findings table filled**

- [ ] **Step 1:** Browser + HTTP inventory Light/Climate/Overview (both tents)
- [ ] **Step 2:** Minimal crash-only fixes if needed
- [ ] **Step 3:** Fill Phase B findings (include named parks if still open); commit — **do not clear debt here**

---

### Task 6: Phase C — Named parks + B findings

**Files:**
- `AirPathMap.tsx` — cascade ← `sensor.dsc_cfm_cascade_2x4_allocated`
- Overview moisture / shared band helper — align `potWantBand`
- DutyStrip / history for 2×4 if still 0.0H while ON
- Any other in-scope B findings

- [ ] **Step 1:** Tests where brain/helpers change
- [ ] **Step 2:** SPA fixes; build:spa
- [ ] **Step 3:** Mark each finding fixed or deferred (Pass 5) in walk; commit

---

### Task 7: Gate — full stress + FOLLOWUPS write-up

**Files:**
- `.audit/live-ux-pass4-prove.ps1` complete
- Fill entire Pass 4 walk
- `docs/FOLLOWUPS.md` — **full** Pass 4 gate section (passed/failed/flakes/residuals/Pass 5 parks/GPIO5/hashes)
- Update Pass 4 design status; parent program pointer

- [ ] **Step 1:** Hotpatch final bundle
- [ ] **Step 2:** pytest + HTTP + browser full matrix; restore stress
- [ ] **Step 3:** FOLLOWUPS write-up (gate-blocking)
- [ ] **Step 4:** Commit; stop — offer Pass 5 brainstorm

---

## Execution note

Prefer subagent-driven per task. Operator may physical-wire GPIO5 later tonight/tomorrow — software must already behave as if Twin present.
