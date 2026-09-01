# Space Energy Journal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship space-owned photoperiod energy estimates, approval-only schedule slides/ramps, and a plant→tent journal hierarchy on the Pi brain + SPA — without silent lighting changes.

**Architecture:** Persist journals, spaces/devices, tariff, shift plans, and learning samples in `dsc_ops.sqlite3` (same pattern as `soft_cal_history.py` / `settings.connect`). Brain APIs are the only mutators of lights-on and photoperiod ratio. SPA is the operator desk (roster journal, tent occupancy journal, Light energy panel, Settings Update).

**Tech Stack:** Python FastAPI brain (`brain/dsc_brain`), SQLite, React SPA (`homeassistant/custom_components/dsc_hub/frontend`), existing `light_loop` / `lightSchedule` / roster plant UUIDs.

**Spec:** [`docs/superpowers/specs/2026-09-01-space-energy-journal-design.md`](../specs/2026-09-01-space-energy-journal-design.md)

### Tip status (`a22050a`)

| Area | Status |
|------|--------|
| Tasks 1–9 (modules, HTTP, SPA, tests) | **done (code)** — ship commit `a22050a`; spa `index-DMMGdgxP.js` |
| Task 10 Step 1 FOLLOWUPS | **done** |
| Task 10 Step 2 Pi live evidence | **pending** — keep spec “implemented locally”; do not mark live-verified yet |
| Task 10 Step 3 pytest | **done** (178 passed per FOLLOWUPS) |
| Developer SoT | [`docs/brain/SPACE-ENERGY-JOURNAL.md`](../../brain/SPACE-ENERGY-JOURNAL.md) · [`WEBUI.md`](../../brain/WEBUI.md) · [`PHOTOPERIOD-TIMELINE.md`](../../brain/PHOTOPERIOD-TIMELINE.md) |

Historical step checkboxes below remain as the original TDD trail; use the table above for tip truth.

## Global Constraints

- No plant or tent changes lighting window or ratio without explicit operator approval.
- One plant must never silently override tent photoperiod; flip = banner only until approved.
- Photoperiod and equipment are space-owned; plants occupy spaces.
- Costs are estimates (W × h × tariff); Learning uses duty-hour proxies — never invent HVAC kWh.
- Cannabis-domain: journal observations ≠ diagnoses; contested herm language labeled contested.
- Local-first; Settings Update for watts/tariff/Learning; researched defaults then override.
- Kit ships two tents for live grow; model must allow add/remove spaces and devices.
- Prefer plant outcome over $ for 1–2 day outliers; planning signal only when pattern is the norm.
- Commit only when asked; hotpatch Pi via existing plink/pscp patterns after green tests.

## File map (create / modify)

| Path | Responsibility |
|------|----------------|
| `brain/dsc_brain/space_model.py` | Space + device CRUD, seed 4x8/2x4 |
| `brain/dsc_brain/plant_journal.py` | Plant journal rows; system append helper |
| `brain/dsc_brain/space_journal.py` | Space-native rows + read-time occupant rollup |
| `brain/dsc_brain/energy_model.py` | Tariff + device watts + estimate + slide suggestions |
| `brain/dsc_brain/schedule_shift.py` | Shift plans, A/B/C step logic, approve-only apply |
| `brain/dsc_brain/energy_learning.py` | Duty samples, outlier vs norm, re-rank hints |
| `brain/dsc_brain/api.py` | HTTP routes for all of the above |
| `brain/tests/test_plant_journal.py` etc. | TDD per task |
| `frontend/src/lib/fleetApi.ts` | Client wrappers |
| `frontend/src/components/journal/*` | Mini journal + tent occupancy UI |
| `frontend/src/pages/LightPage.tsx` | Energy panel + ramp confirm (no plant lighting) |
| `frontend/src/pages/SettingsPage.tsx` / settings components | Spaces, devices, tariff, Learning |
| `frontend/src/pages/GrowPages.tsx` | Wire plant journal on roster |

---

### Task 1: SQLite schema + space seed

**Files:**
- Create: `brain/dsc_brain/space_model.py`
- Modify: `brain/dsc_brain/settings.py` (ensure tables via connect/migrate hook if that is the existing pattern)
- Test: `brain/tests/test_space_model.py`

**Interfaces:**
- Produces: `init_space_tables()`, `list_spaces()`, `ensure_kit_spaces()` → spaces `4x8`, `2x4` with size metadata; `upsert_space_device(space_id, device)`

- [ ] **Step 1: Write failing tests** for ensure_kit_spaces idempotent and device attach

- [ ] **Step 2: Run** `pytest brain/tests/test_space_model.py -v` — expect FAIL

- [ ] **Step 3: Implement** tables `space`, `space_device` on `DEFAULT_DB`; seed kit tents; defaults for SF1000 / fans from known nameplates when missing

- [ ] **Step 4: Run tests** — PASS

- [ ] **Step 5: Commit** (when user asks)

---

### Task 2: Plant journal + space journal rollup

**Files:**
- Create: `brain/dsc_brain/plant_journal.py`, `brain/dsc_brain/space_journal.py`
- Test: `brain/tests/test_plant_journal.py`, `brain/tests/test_space_journal.py`

**Interfaces:**
- Produces: `add_plant_entry(plant_id, occurred_at, note, *, source, tags)`, `list_plant_journal(plant_id)`, `add_space_entry(...)`, `list_space_journal(space_id)` → space-native + occupant plant rows with `provenance: plant|space`
- Consumes: roster assignment / tent from existing plant_probe / inventory helpers

- [ ] **Step 1: Failing tests** — plant entry follows plant_id; after “move” mock, plant history unchanged; tent list includes occupant rows with provenance

- [ ] **Step 2: pytest** — FAIL

- [ ] **Step 3: Implement** tables `plant_journal`, `space_journal`; rollup at read time (no destructive copy)

- [ ] **Step 4: pytest** — PASS

- [ ] **Step 5: Commit** (when asked)

---

### Task 3: Journal + space HTTP API

**Files:**
- Modify: `brain/dsc_brain/api.py`
- Modify: `homeassistant/.../frontend/src/lib/fleetApi.ts`
- Test: API tests in `brain/tests/test_journal_api.py` (TestClient pattern from `test_brain_pi.py`)

**Interfaces:**
- Produces: `GET/POST /journal/plant/{plant_id}`, `GET/POST /journal/space/{space_id}`, `GET/POST /spaces`, `PUT /spaces/{id}/devices/{device_id}`

- [ ] **Step 1: Failing API tests**

- [ ] **Step 2: Wire routes** — never expose silent schedule mutate here

- [ ] **Step 3: fleetApi.ts** client helpers

- [ ] **Step 4: pytest** — PASS

---

### Task 4: SPA plant mini journal + tent occupancy journal

**Files:**
- Create: `frontend/src/components/journal/PlantMiniJournal.tsx`, `TentOccupancyJournal.tsx`
- Modify: `GrowPages.tsx` (roster plant detail), Live tent or Grow tent surface
- Test: smoke script or light component test if repo pattern exists; else manual checklist in task notes

**Requirements:**
- Datetime picker + text + Save → POST plant journal
- Tent view: space rows + rolled-up plant rows; chips for provenance
- No lighting controls on plant card

- [ ] **Step 1: Build UI** against Task 3 APIs

- [ ] **Step 2: `npm.cmd run build:spa`** green

- [ ] **Step 3: Rams quick_review** on touched journal components

---

### Task 5: Energy estimate + slide suggestions (no apply)

**Files:**
- Create: `brain/dsc_brain/energy_model.py`
- Test: `brain/tests/test_energy_model.py`
- Modify: `api.py` — `GET /energy/estimate`, `GET /energy/suggestions?space_id=`

**Interfaces:**
- Produces: estimate from space devices × current lights-on/want hours × tariff bands; suggestions slide ratio-fixed windows with $ delta; label estimates

- [ ] **Step 1: Failing tests** for band split and suggestion ranking

- [ ] **Step 2: Implement** tariff table seed (AU-style placeholders) + device watts from space_device

- [ ] **Step 3: pytest** — PASS

---

### Task 6: Schedule shift plans (approve-only ramp)

**Files:**
- Create: `brain/dsc_brain/schedule_shift.py`
- Modify: `light_loop.py` only for reading normalized clock (already HH:MM honest)
- Test: `brain/tests/test_schedule_shift.py`

**Interfaces:**
- Produces: `create_plan(space_id, target_on, policy, *, confirm)` refused without confirm flag; `tick_plans(now)` steps ≤ policy max; flower_strict never shortens dark below want hours; writes system journal on start/step/cancel/complete
- Produces: `request_flip(space_id, plant_id)` → pending banner payload only; `approve_flip` / `deny_flip` explicit

- [ ] **Step 1: Failing tests** — no mutate without confirm; A pause blocks; B caps step; C 30 min; one-plant flip does not change lights-on

- [ ] **Step 2: Implement** + hook tick from existing brain loop/computed path (same cadence as other periodic jobs)

- [ ] **Step 3: pytest** — PASS

---

### Task 7: Learning outlier vs norm

**Files:**
- Create: `brain/dsc_brain/energy_learning.py`
- Test: `brain/tests/test_energy_learning.py`
- Modify: suggestions endpoint to attach learning demotions + planning flag

**Interfaces:**
- Produces: daily sample of estimated $ + heater/light duty proxies; `planning_signal` false for 1–2 day spikes; true after sustained threshold (Settings-tunable defaults)

- [ ] **Step 1: Failing tests** for outlier ignore and sticky demotion of Night-heat profile

- [ ] **Step 2: Implement** — never auto-apply schedule

- [ ] **Step 3: pytest** — PASS

---

### Task 8: Conflict / move suggestions + system journal hooks

**Files:**
- Modify: `schedule_shift.py`, `dash_computed.py` or banner source used by SPA
- Modify: dark-period / move paths to call `add_plant_entry` / `add_space_entry` with `source=system`

**Requirements:**
- Banner when plant wants flip conflicting with tent mates; suggest move to other space; never auto-move
- Dark violation → plant + space journal system rows

- [ ] **Step 1: Tests** for conflict payload and journal side effects

- [ ] **Step 2: Implement**

- [ ] **Step 3: pytest** — PASS

---

### Task 9: Light Energy panel + Settings (spaces/devices/tariff/Learning)

**Files:**
- Modify: `LightPage.tsx`, settings components under `components/settings/`
- Modify: `fleetApi.ts`

**Requirements:**
- Energy estimates + suggestions; Start gradual plan → A/B/C + risk history → Confirm
- Set lights-on now = separate confirm
- Settings: Update watts, tariff, Learning enable/reset/outlier preference
- Banners for flip/conflict/planning

- [ ] **Step 1: UI**

- [ ] **Step 2: `build:spa` + Rams quick_review**

- [ ] **Step 3: Hotpatch SPA + brain modules** (plink/pscp; avoid full api.py replace if Pi image lags — copy only new modules)

---

### Task 10: Closure docs

**Files:**
- Modify: `docs/FOLLOWUPS.md`, optional `docs/qa/AUDIT-CLOSURE-*.md`
- Offer (do not write until yes): cannabis-domain / DSC skill fragment for space-owned photoperiod + journals

- [x] **Step 1: Dated FOLLOWUPS section** (2026-09-01 — Space energy / journals)

- [ ] **Step 2: Mark spec status implemented** when Pi evidence collected (local-only until hotpatch walk)

- [x] **Step 3: Full brain pytest** `161+` green (178 passed on ship)

---

## Execution note

Prefer **subagent-driven-development** per task with TDD. Do not start Task 9 until Tasks 1–8 APIs are green. Real plants on kit: never enable auto photoperiod mutate in tests against live Pi without operator confirm.
