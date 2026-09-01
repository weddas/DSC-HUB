# Live UX Pass 5 — Follow-up Backlog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish Pass 4 parks + CannaLib prod + FlowSankey verify + Zigbee one-recipe Wet/Problem path, then soak, re-walk three Live desks, and gate GREEN with mandatory FOLLOWUPS — closing the five-pass Live UX program.

**Architecture:** Coherent Pass 5 closeout — soft parks → queue verify/prove (CannaLib → Sankey → Zigbee) → soak/re-walk → full stress gate. No new recipe ID; no new 48h Sankey soak unless verify fails.

**Tech Stack:** Pi DSC-Brain, React SPA, pytest, plink/pscp, CannaLib standalone, Z2M/MQTT, FlowSankey/AirPathMap

**Spec:** [`docs/superpowers/specs/2026-09-01-live-ux-pass5-followup-design.md`](../specs/2026-09-01-live-ux-pass5-followup-design.md)

## Global Constraints

- Parks + queue items all required — **not** parks-only success
- Zigbee: existing curated recipe only (`floor_flood_alert` preferred); Wet raw MQTT; Problem from `policy_state` only
- CannaLib: verify-close first; redeploy only if Pi Load more fails
- FlowSankey soak already closed — live re-prove + graduate
- Manual Hold clear **only with operator confirm**
- Energy `confirm=false` → **400**
- GPIO5 soft-gate if unwired; never claim wired without physical
- Hotpatch: plink/pscp; prefer `docker kill`+`start` over `restart`
- Gate FOLLOWUPS write-up is **blocking**
- Both tents parity on re-walk; no secrets in docs

## File map

| Path | Role |
|------|------|
| `docs/qa/LIVE-UX-PASS5-WALK-2026-09.md` | Walk + prove tables |
| `docs/FOLLOWUPS.md` | Stub + gate write-up |
| Parent + Pass 5 design/plan | Program status |
| `brain/tests/test_space_energy_stress.py` / prove scripts | Energy 400 |
| `.audit/live-ux-pass5-prove.ps1` | Gate hotpatch/prove |
| Climate Safety / zigbee policies / fleet | Wet/Problem |
| `FlowSankey.tsx` / `AirPathMap.tsx` | Sankey verify (read/fix only if broken) |
| CannaLib compose / `standalone_server.py` | Prod redeploy if needed |
| CatalogPicker / brain catalogs proxy | Load more prove |

---

### Task 1: Walk scaffold + parent pointer

**Files:**
- Create: `docs/qa/LIVE-UX-PASS5-WALK-2026-09.md`
- Modify: `docs/FOLLOWUPS.md` — Pass 5 stub row
- Modify: `docs/superpowers/specs/2026-09-01-live-ux-honesty-program-design.md` — Pass 5 in progress

- [ ] **Step 1:** Walk with tables for Parks / CannaLib / Sankey / Zigbee / Soak / Re-walk / Gate
- [ ] **Step 2:** FOLLOWUPS stub: Pass 5 in progress; queue items listed
- [ ] **Step 3:** Parent status → Pass 5 implementing
- [ ] **Step 4:** Commit

---

### Task 2: Parks soft — energy 400 + Hold + GPIO5

**Files:**
- `.audit/live-ux-*-prove.ps1` / new `live-ux-pass5-prove.ps1` — assert energy status **400**
- Light Hold clear path (SPA/API) — only after operator confirm recorded in walk
- Twin / GPIO5 honesty copy check

- [ ] **Step 1:** Confirm operator: clear sticky Manual Light Hold? If yes, clear + restore; if no, park with reason
- [ ] **Step 2:** Prove `POST /energy/shift/plan` confirm=false → **400**; fix any 422 path
- [ ] **Step 3:** GPIO5: soft-gate honesty if unwired; optical only if wired
- [ ] **Step 4:** Fill walk Parks section; commit

---

### Task 3: CannaLib prod verify-close

**Files / ops:**
- HTTP prove script evidence
- Pi Settings `cannalib_api_url` / CatalogPicker Load more
- Redeploy only if Load more fails: CannaLib compose + `services/cannalib/standalone_server.py`

- [ ] **Step 1:** Record prod+LAN `/v1/catalogs/strains?q=kush&limit=3&offset=0|3` distinct pages
- [ ] **Step 2:** Pi Test CannaLib + Load more against prod; fail → redeploy then re-prove
- [ ] **Step 3:** Close MP-030/034 in FOLLOWUPS notes; walk; commit

---

### Task 4: FlowSankey live verify

**Files:**
- Browser Climate Air path; HTTP CFM sensors
- Fix only if honesty broken (`FlowSankey.tsx` / `AirPathMap.tsx`)

- [ ] **Step 1:** HTTP cascade ≠ intake 2×4 allocated
- [ ] **Step 2:** Browser: Air CFM chip; no EXPERIMENTAL; mass chip absent; AirPathMap cascade
- [ ] **Step 3:** FOLLOWUPS graduate; walk; commit

---

### Task 5: Zigbee one-recipe Wet/Problem

**Files:**
- Brain zigbee bindings / `zigbee_by_role` / policies
- Climate Safety Wet/Dry + Problem chips
- Tests if binding/reapply gaps

- [ ] **Step 1:** Ensure bindings + by_role for floor_flood (or tank); reapply if empty
- [ ] **Step 2:** Live Wet/Dry MQTT reading; Problem/Clear from policy_state only
- [ ] **Step 3:** `leak_floor_2x4` bind if HW else park
- [ ] **Step 4:** Walk + pytest; commit

---

### Task 6: Soak + three-desk re-walk

**Files:**
- `docs/qa/LIVE-UX-PASS5-WALK-2026-09.md` re-walk sections
- Screenshots under `docs/qa-screenshots-*/pass5-*`

- [ ] **Step 1:** Short soak after queue landings
- [ ] **Step 2:** Light + Climate + Overview browser matrix both tents
- [ ] **Step 3:** Restore plans/Twin; Hold state per operator; commit walk evidence

---

### Task 7: Gate + FOLLOWUPS

**Files:**
- `.audit/live-ux-pass5-prove.ps1` + evidence JSON
- `docs/FOLLOWUPS.md` full Pass 5 gate section
- Parent + Pass 5 design status → **proven**

- [ ] **Step 1:** Hotpatch if SPA/brain changed; pytest + HTTP + browser
- [ ] **Step 2:** Fill walk Gate; write FOLLOWUPS (passed/failed/flakes/residuals/parks/hashes)
- [ ] **Step 3:** Mark Pass 5 proven; commit; stop — offer next program only if asked

---

## Execution notes

- Prefer subagent-driven tasks; commit when asked or per SDD task close
- Do not invent Pass 6; park true OOS in FOLLOWUPS
- Operator Hold confirm is a hard gate for Hold clear — ask in chat before mutating
