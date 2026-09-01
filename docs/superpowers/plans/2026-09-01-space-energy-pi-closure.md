# Space-energy Pi Closure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish room + DSC-Core journals, full-parity energy stress on both tents, Pi hotpatch, and walk evidence so the parent space-energy feature can be marked implemented.

**Architecture:** Extend `dsc_ops.sqlite3` with `room` / `room_journal` / `dsc_core_journal` and `space.room_id`; read-time rollups plant→tent→room→Core. Hotpatch via plink/pscp; stress with pytest + Pi HTTP + browser.

**Tech Stack:** Pi FastAPI brain, SQLite, React SPA, PuTTY plink/pscp, pytest

**Spec:** [`docs/superpowers/specs/2026-09-01-space-energy-pi-closure-design.md`](../specs/2026-09-01-space-energy-pi-closure-design.md)

## Global Constraints

- No schedule mutate without `confirm=true`; Learning/`apply` always false for suggestions
- Both `4x8` and `2x4` get identical mutate + force-tick treatment; restore lights-on after
- Journal observations ≠ diagnoses; provenance chips never squash
- pot3/4 planned OOS only; never Capacity offline lead
- Commit only when asked; Pi passwords never in docs

---

### Task 1: Room model + seed `grow_room`

**Files:**
- Create: `brain/dsc_brain/room_model.py`
- Modify: `brain/dsc_brain/space_model.py` — add `room_id` column / backfill
- Test: `brain/tests/test_room_model.py`

**Interfaces:**
- Produces: `ensure_kit_rooms(db_path) -> list[dict]`, `list_rooms()`, `spaces_for_room(room_id)`, `set_space_room(space_id, room_id)`
- Seed: `grow_room` parents `4x8` and `2x4`

- [x] **Step 1:** Failing tests for seed + parent link
- [x] **Step 2:** Implement tables + ensure
- [x] **Step 3:** pytest PASS

---

### Task 2: Room journal + DSC-Core journal

**Files:**
- Create: `brain/dsc_brain/room_journal.py`, `brain/dsc_brain/dsc_core_journal.py`
- Test: `brain/tests/test_room_core_journal.py`

**Interfaces:**
- Produces: `add_room_entry`, `list_room_journal` (room-native + child tent journals via `list_space_journal`)
- Produces: `add_core_entry`, `list_core_journal` (core-native + all rooms’ rolled lists)
- Provenance: `plant|space|room|core`

- [x] **Step 1:** Failing rollup tests (X1–X4 shape)
- [x] **Step 2:** Implement
- [x] **Step 3:** pytest PASS

---

### Task 3: HTTP + fleetApi + system bubble to Core

**Files:**
- Modify: `brain/dsc_brain/api.py` — `/rooms`, `/journal/room/{id}`, `/journal/core`
- Modify: `schedule_shift.py` / `photoperiod_conflict.py` — facility-scoped rows also `add_core_entry`
- Modify: `fleetApi.ts`
- Test: `brain/tests/test_journal_api.py` (extend)

- [x] **Step 1:** API tests
- [x] **Step 2:** Wire routes + Core bubble on dark/flip/ramp
- [x] **Step 3:** pytest PASS

---

### Task 4: SPA room + Core journals (Ops/Dash)

**Files:**
- Create: `frontend/src/components/journal/RoomJournal.tsx`, `CoreJournal.tsx`
- Modify: Ops/Dash page (find Overview or LiveMission / DashHome)
- Build: `npm.cmd run build:spa`

- [x] **Step 1:** UI components
- [x] **Step 2:** Wire Dash
- [x] **Step 3:** build:spa green

---

### Task 5: Stress suite

**Files:**
- Create: `brain/tests/test_space_energy_stress.py`
- Covers: E1–E10 both spaces (force-tick with restore), X1–X7, confirm gate, reduced_kit

- [x] **Step 1:** Write stress tests
- [x] **Step 2:** pytest PASS

---

### Task 6: Pi audit script + walk doc scaffold

**Files:**
- Create: `.audit/space-energy-pi-closure.ps1`
- Create: `docs/qa/SPACE-ENERGY-PI-WALK-2026-09.md` (empty gates)

- [x] **Step 1:** Script hotpatch modules+SPA + HTTP burst both tents + force-tick restore
- [x] **Step 2:** Walk template with all matrix rows

---

### Task 7: Pi execute G0–G4

**Files:**
- Modify: walk doc, FOLLOWUPS, parent spec status, skill if needed

- [x] **Step 1:** Run hotpatch
- [x] **Step 2:** G1 honesty + G1b hierarchy
- [x] **Step 3:** G2 API stress on Pi
- [x] **Step 4:** G3 browser automation + screenshots
- [x] **Step 5:** G4 closure docs; parent spec **implemented**

---

## Execution note

Prefer one coherent pass. Operator approved environment disruption. Do not mark parent spec implemented until walk rows are filled.
