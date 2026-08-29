# Brain Control Recovery (Bar 2) — Plant ↔ Probe Lifecycle

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make assign / move / **detach** first-class so a plant can leave a probe without being retired, and Live/Root/Roster/Compose stay coherent without hard reload.

**Spec:** `docs/superpowers/specs/2026-08-29-brain-control-recovery-design.md` §Bar 2  
**Prior:** Bar 1 shipped on `master` (`f0d18ce`).  
**Domain (settled — climate-mode design, no second arena):** three objects — **Probe** (hardware), **Plant** (roster identity), **Assignment** (`assigned_plant_id` on probe: roster plant key | empty). `idle_home` = Soil Test dock only, not the measured plant.

**Out of this plan:** P0–P3 irrigation, Twin as control, AI, full pot→probe entity flash migration, SoftAP docs.

## Done predicate (falsifiable)

On Pi SPA **without hard reload**, after each op + brain refresh:

1. **Detach** — plant stays in roster (`status` active/unassigned, `pot=none`); probe helpers / Root seat show vacant (no plant name); `assigned_plant_id` empty; probe_station seats unchanged.
2. **Assign** — roster plant with `pot=none` binds to a vacant kit probe; Root + Roster show the same name/stage/tent.
3. **Move** — plant leaves probe A and appears on probe B in one operator action (atomic server-side); no ghost plant on A.
4. **Layers stay distinct** — SoftCal ≠ idle_home unassign ≠ tent unassign ≠ detach ≠ retire.
5. Automated tests cover detach/assign/move; Pi screenshots prove Root + Roster before/after detach.

## Scope / effort

| Unit | Rough size |
|------|------------|
| T0 Inventory + baseline harness | S |
| T1 Brain assignment SoT (`plant_probe.py`) | M |
| T2 Wire assign/detach/move APIs + retire leaves assignment clear | M |
| T3 SPA: Detach / Assign / Move on Roster + Root seat | M |
| T4 Honesty: Root vacant vs station vs plant; refresh paths | S |
| T5 Pi verify + decision trail | S |

**Blockers:** Live kit is pot1+pot2 only — verify on those. Do not require pot3/4 hardware.

**Rigor:** High (domain one-way door already settled in climate-mode design). Skip arena (laziness — shape concrete). Verify each unit before the next. Decision trail at `.audit/bar2-plant-probe.tsv`.

## Architecture

**Transitional plant key:** roster slot number as plant id (`slot:N`) until a dedicated plant UUID exists. Probe inventory `extra.assigned_plant_id` stores `slot:N` or `""`. Pot-keyed roster rows (`seat_id=potN`) remain the live join while assigned; detach deletes/clears pot row and keeps slot recipe JSON.

```text
Roster slot (plant identity) ──assigned──► Probe potN
         │                                    │
         │ pot=none when detached             │ idle_home only if probe_station
         ▼                                    ▼
   Compose / Roster list              Root Got / soil / trust
```

**Forbidden:** Retire as the only way to clear a probe. SPA inventing a third assignment story. Treating idle_home clear as plant detach.

## File map

| Path | Responsibility |
|------|----------------|
| `brain/dsc_brain/plant_probe.py` | assign / detach / move pure ops + helpers |
| `brain/tests/test_plant_probe.py` | unit tests |
| `brain/dsc_brain/compose_ops.py` | call plant_probe from assign/retire; stop destroying plant on detach path |
| `brain/dsc_brain/api.py` | REST: POST assign / detach / move |
| `frontend/src/lib/fleetApi.ts` | client wrappers |
| `frontend/src/pages/GrowPages.tsx` | Detach + Assign actions (retire stays separate) |
| `frontend/src/components/PlantSeatPanel.tsx` | Detach / Move from seat drawer |
| `frontend/src/pages/RootPage.tsx` | vacant vs plant vs station chrome from assignment |
| `docs/qa-screenshots-*/bar2-*.png` | evidence |
| `.audit/bar2-plant-probe.tsv` | decision trail |

## Global constraints

- Brain SoT; SPA client only.
- Soft ≠ probe home ≠ tent unassign ≠ detach ≠ retire.
- Kit probes 1–2 for live verify; 3–4 may be OOS.
- Windows: `npm.cmd`; PowerShell commits (no bash heredoc).
- Commit when plan steps say so / user asks.

---

### Task 0: Inventory + baseline harness

**Files:**
- Create: `docs/superpowers/research/2026-08-29-plant-probe-lifecycle-inventory.md`
- Create: `brain/scripts/bar2_assignment_baseline.py` (or tests fixture) that prints current assignment matrix from helpers + inventory + slots

- [ ] **Step 1:** Document current APIs (assign_to_pot, retire_plant, patch_probe_station) vs Bar 2 gaps
- [ ] **Step 2:** Capture baseline assignment matrix (local or Pi) into research doc / `.audit` evidence
- [ ] **Step 3:** Confirm FOLLOWUPS Aug-28 “unassign” is idle_home/clear_role only — not plant detach

---

### Task 1: Brain `plant_probe` SoT

**Files:**
- Create: `brain/dsc_brain/plant_probe.py`
- Create: `brain/tests/test_plant_probe.py`

**Interfaces:**

```python
def detach_plant_from_probe(pot_n: int) -> dict  # keeps slot; clears pot join + helpers + assigned_plant_id
def assign_plant_to_probe(slot_num: int, pot_n: int) -> dict  # fails if probe occupied
def move_plant(from_pot: int, to_pot: int) -> dict  # atomic detach+assign or swap-safe
```

- [ ] **Step 1:** Write failing tests for detach keeps nickname/strain on slot, clears plant_name helper
- [ ] **Step 2:** Implement ops; persist `assigned_plant_id` on inventory extra + helper mirror
- [ ] **Step 3:** `pytest brain/tests/test_plant_probe.py` green

---

### Task 2: Wire API + retire semantics

**Files:**
- Modify: `brain/dsc_brain/api.py`, `compose_ops.py`
- Modify: `assign_to_pot` to set `assigned_plant_id`
- Modify: `retire_plant` to clear assignment then wipe plant (still destructive)

- [ ] **Step 1:** POST `/roster/detach/{pot_n}`, `/roster/assign`, `/roster/move`
- [ ] **Step 2:** Retire still empties slot; detach does not
- [ ] **Step 3:** Tests for API or ops integration

---

### Task 3: SPA lifecycle actions

**Files:**
- Modify: `fleetApi.ts`, `GrowPages.tsx`, `PlantSeatPanel.tsx` (and Compose only if needed)

- [ ] **Step 1:** API client methods
- [ ] **Step 2:** Roster: Detach (not Delete), Assign-to-probe for `pot=none` rows, Move
- [ ] **Step 3:** Plant seat drawer: Detach + Move; keep Retire separate with copy that says plant is destroyed
- [ ] **Step 4:** `npm.cmd run build` (or project’s SPA build) succeeds

---

### Task 4: Root / honesty chrome

**Files:**
- Modify: `RootPage.tsx`, possibly `seatModel.ts`, `DashHomeSections` plant strip

- [ ] **Step 1:** Vacant probe (no assignment) ≠ probe_station ≠ planted
- [ ] **Step 2:** After detach, Overview/Root update via existing brain refresh (no hard reload)

---

### Task 5: Pi verify

- [ ] **Step 1:** Hot-patch brain + SPA to Pi
- [ ] **Step 2:** Smoke detach on pot1 or pot2; screenshot Root + Roster before/after
- [ ] **Step 3:** Re-assign; screenshot
- [ ] **Step 4:** Append VERIFY rows to `.audit/bar2-plant-probe.tsv`
- [ ] **Step 5:** FOLLOWUPS note Bar 2 closed / leftovers

## Self-review

| Gate | Check |
|------|-------|
| Spec | Matches design §Bar 2 done-when |
| Layers | Five ops distinct in UI copy |
| Tests | plant_probe unit tests |
| Pi | Screenshots exist |
| Trail | `.audit/bar2-plant-probe.tsv` |
