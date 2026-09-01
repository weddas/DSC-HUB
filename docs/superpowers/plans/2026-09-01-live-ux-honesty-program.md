# Live UX Honesty Program Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship honesty + light UX across Live Light → Climate → Overview with full stress prove and filled walk docs per desk before advancing; leave Pass 4/5 as later brainstorm stubs.

**Architecture:** One program, three sequential desk task blocks. Each block: inventory honesty gaps → TDD/fix brain+SPA → `build:spa` + Pi hotpatch → pytest + HTTP + browser matrix → fill walk → gate. Shared honesty contract from the design; both tents parity every pass.

**Tech Stack:** Pi DSC-Brain FastAPI, React SPA (`:8787`), pytest, PuTTY plink/pscp, Cursor browser

**Spec:** [`docs/superpowers/specs/2026-09-01-live-ux-honesty-program-design.md`](../specs/2026-09-01-live-ux-honesty-program-design.md)

## Global Constraints

- Honesty + light UX only — no new control subsystems, Twin PWM, Zigbee recipes, chart-library swaps
- Both `4x8` and `2x4` at the same development point in every desk pass
- Full stress per desk (pytest + Pi HTTP + browser) before next desk; restore any mutate stress
- pot3/4 = `planned_oos` only; never Capacity offline lead; F-001/F-002 honest OOS
- No schedule mutate without `confirm=true`; Learning/suggestions `apply: false`
- Commit only when asked; Pi passwords never in walk/FOLLOWUPS bodies
- Pass 4 (integrated) and Pass 5 (follow-up) are stubs — do not invent requirements beyond parking FOLLOWUPS for later `/brainstorming`

## File map (program)

| Path | Responsibility |
|------|----------------|
| `docs/qa/LIVE-UX-LIGHT-WALK-2026-09.md` | Pass 1 gate table |
| `docs/qa/LIVE-UX-CLIMATE-WALK-2026-09.md` | Pass 2 gate table |
| `docs/qa/LIVE-UX-OVERVIEW-WALK-2026-09.md` | Pass 3 gate table |
| `docs/qa-screenshots-2026-09-01-live-ux/` | Dated screenshots |
| `.audit/live-ux-light-prove.ps1` (+ `.sh` helpers as needed) | Light Pi prove |
| `.audit/live-ux-climate-prove.ps1` | Climate Pi prove |
| `.audit/live-ux-overview-prove.ps1` | Overview Pi prove |
| `brain/tests/test_live_ux_light_honesty.py` | Light brain/API invariants |
| `brain/tests/test_live_ux_climate_honesty.py` | Climate/reduced-kit/policy display invariants |
| `brain/tests/test_live_ux_overview_honesty.py` | Overview-fed fleet/journal invariants |
| `homeassistant/.../frontend/src/pages/LightPage.tsx` | Light desk SPA |
| `.../ClimatePage.tsx` | Climate desk SPA |
| `.../OverviewPage.tsx` | Overview desk SPA |
| `.../components/energy/*`, `.../journal/*`, `FlowSankey.tsx` | Supporting honesty surfaces |
| `docs/FOLLOWUPS.md` | Park off-scope; dated closure notes |

---

### Task 0: Program scaffolding (walks + screenshot dir)

**Files:**
- Create: `docs/qa/LIVE-UX-LIGHT-WALK-2026-09.md`
- Create: `docs/qa/LIVE-UX-CLIMATE-WALK-2026-09.md`
- Create: `docs/qa/LIVE-UX-OVERVIEW-WALK-2026-09.md`
- Create: `docs/qa-screenshots-2026-09-01-live-ux/.gitkeep`

**Interfaces:**
- Produces: empty gate tables matching design §2–§4 checklist rows (Result/Evidence columns blank until prove)

- [ ] **Step 1: Write Light walk scaffold**

Create `docs/qa/LIVE-UX-LIGHT-WALK-2026-09.md` with gates: G0 hotpatch, both-tent Got/Want/DARK/Follow, Twin/SF1000 honesty, DLI, energy Estimate+confirm, journals, restore; browser B-rows for 4x8 and 2x4.

- [ ] **Step 2: Write Climate + Overview walk scaffolds**

Same pattern for Climate (Full Auto/reduced-kit, zone focus, Climate Mode vs Light schedule chips, Sankey air-only, canopy, Wet/Dry vs Problem) and Overview (KIT HONEST, banners vs grow log, photoperiod glance vs Light, Room/Core journals, root/bands grey).

- [ ] **Step 3: Screenshot dir**

```powershell
New-Item -ItemType Directory -Force -Path "docs/qa-screenshots-2026-09-01-live-ux" | Out-Null
Set-Content -Path "docs/qa-screenshots-2026-09-01-live-ux/.gitkeep" -Value ""
```

- [ ] **Step 4: Commit when asked** (do not commit until operator requests)

---

### Task 1: Pass 1 — Light honesty tests (brain/API)

**Files:**
- Create: `brain/tests/test_live_ux_light_honesty.py`
- Reuse: `brain/tests/test_energy_model.py`, `test_journal_api.py`, `test_space_energy_stress.py` patterns (`_point_db` monkeypatch all `DEFAULT_DB` bindings)

**Interfaces:**
- Consumes: `/energy/estimate`, `/energy/suggestions`, `/energy/shift/plan`, space journals
- Produces: pytest module that fails if `apply` is true or confirm gate missing

- [ ] **Step 1: Write failing/guard tests**

```python
# brain/tests/test_live_ux_light_honesty.py
def test_both_spaces_estimate_labeled_and_suggestions_never_apply(client):
    for sid in ("4x8", "2x4"):
        est = client.get("/energy/estimate", params={"space_id": sid, "lights_on": "06:00:00", "want_hours": 12})
        assert est.status_code == 200 and est.json().get("ok") is True
        assert "Estimate" in (est.json().get("estimate_label") or "Estimate")
        sug = client.get("/energy/suggestions", params={"space_id": sid, "lights_on": "06:00:00", "want_hours": 12})
        assert sug.json().get("apply") is False
        assert all(s.get("apply") is False for s in sug.json().get("suggestions") or [])

def test_shift_confirm_gate_both_spaces(client):
    for sid in ("4x8", "2x4"):
        bad = client.post("/energy/shift/plan", json={
            "space_id": sid, "from_on": "06:00:00", "to_on": "08:00:00",
            "want_hours": 12, "policy": "pause", "confirm": False,
        })
        assert bad.status_code == 400
```

Use the same `_point_db` + `TestClient` fixture pattern as `test_space_energy_stress.py`.

- [ ] **Step 2: Run tests**

```powershell
cd brain; python -m pytest tests/test_live_ux_light_honesty.py -q --tb=short
```

Expected: PASS (guards). If FAIL, fix brain before SPA polish.

- [ ] **Step 3: Add journal provenance smoke (both spaces)**

Post space notes to `2x4` and `4x8`; GET lists include notes with space provenance fields present (match existing journal API shape).

---

### Task 2: Pass 1 — Light SPA honesty + light UX

**Files:**
- Modify: `homeassistant/custom_components/dsc_hub/frontend/src/pages/LightPage.tsx`
- Modify as needed: `.../components/energy/LightEnergyPanel.tsx`, `.../components/journal/TentOccupancyJournal.tsx`
- Build: `npm.cmd run build:spa` from `homeassistant/custom_components/dsc_hub/frontend`

**Interfaces:**
- Consumes: fleet helpers, energy APIs, journal APIs
- Produces: SPA bundle with honest chips/copy; no new subsystems

- [ ] **Step 1: Inventory gaps on live `#/live/light`**

Browser both tents: Got/Want, DARK vs WINDOW OPEN, Follow vs Independent, Twin/SF1000 OFF copy, DLI calibrate CTA, Energy Estimate label, journal provenance. List mismatches in the Light walk “Notes” column (not FOLLOWUPS unless out of scope).

- [ ] **Step 2: Fix honesty/copy/UX in SPA**

Only change what fails inventory: wrong live-lamp copy when GPIO absent; disabled Save clarity; hierarchy/spacing; ensure Energy never implies auto-apply; keep Climate Want deep-link honest.

- [ ] **Step 3: build:spa**

```powershell
cd homeassistant\custom_components\dsc_hub\frontend
npm.cmd run build:spa
```

Expected: `spa-dist/index.html` references new `index-*.js`.

---

### Task 3: Pass 1 — Light Pi prove + walk fill

**Files:**
- Create: `.audit/live-ux-light-prove.ps1` (mirror `space-energy-pi-closure.ps1`: pack SPA+brain if needed, pscp/plink, HTTP energy both spaces, pull evidence JSON)
- Modify: `docs/qa/LIVE-UX-LIGHT-WALK-2026-09.md` (fill every cell)
- Screenshots → `docs/qa-screenshots-2026-09-01-live-ux/`

**Interfaces:**
- Consumes: built `spa-dist`, brain if API fixes shipped
- Produces: filled Light walk; evidence JSON optional under `.audit/`

- [ ] **Step 1: Hotpatch SPA (and brain if Task 1 changed modules)**

Use plink/pscp only (`dsc-pi-hotpatch.mdc`). Verify live index hash matches `spa-dist/index.html`.

- [ ] **Step 2: HTTP + browser matrix**

Both tents: estimate/suggestions/confirm=false; UI Got/Want/DARK/Follow/energy/journals. Save screenshots.

- [ ] **Step 3: Fill Light walk; gate**

All rows green. If schedule stress used: restore lights-on both tents; no active plans. **Do not start Climate until this gate passes.**

- [ ] **Step 4: FOLLOWUPS note for Pass 1** (hashes, parks) when closing the desk

---

### Task 4: Pass 2 — Climate honesty tests

**Files:**
- Create: `brain/tests/test_live_ux_climate_honesty.py`
- Reuse: `brain/tests/test_reduced_kit.py`, zigbee policy tests as reference

**Interfaces:**
- Consumes: `_reduced_kit`, fleet extras shapes
- Produces: assertions pot3/4 in `planned_oos`, never offline lead when only planned

- [ ] **Step 1: Write reduced-kit + policy display guards**

```python
def test_reduced_kit_pot34_planned_not_offline_lead(temp_db, monkeypatch):
    # point DEFAULT_DB; list_inventory; _reduced_kit
    active, attrs = _reduced_kit(list_inventory(temp_db))
    assert "POT4" not in attrs.get("offline", "")
    assert "POT3" not in attrs.get("offline", "")
    planned = attrs.get("planned_oos", "")
    assert "POT3" in planned and "POT4" in planned
```

Add a test that documents SPA must not infer problem from wet alone (comment + optional pure helper if one exists; otherwise browser-only in Task 6 — do not invent a new policy engine).

- [ ] **Step 2: pytest**

```powershell
cd brain; python -m pytest tests/test_live_ux_climate_honesty.py tests/test_reduced_kit.py -q --tb=short
```

Expected: PASS

---

### Task 5: Pass 2 — Climate SPA honesty + light UX

**Files:**
- Modify: `.../pages/ClimatePage.tsx`
- Modify as needed: `.../components/FlowSankey.tsx`, safety chip rendering in ClimatePage

- [ ] **Step 1: Inventory `#/live/climate`**

Full Auto vs Capacity offline, zone All/4×8/2×4/Room copy, Climate Mode chips ≠ Light schedule Follow, Sankey air-only + no mass-imbalance theater, canopy unbound empty, Wet/Dry vs Problem/Clear.

- [ ] **Step 2: Fix SPA mismatches only**

- [ ] **Step 3: `npm.cmd run build:spa`**

---

### Task 6: Pass 2 — Climate Pi prove + walk fill

**Files:**
- Create: `.audit/live-ux-climate-prove.ps1`
- Modify: `docs/qa/LIVE-UX-CLIMATE-WALK-2026-09.md`

- [ ] **Step 1: Hotpatch; verify index hash**

- [ ] **Step 2: HTTP** — `binary_sensor.dsc_reduced_kit` attrs via `/fleet/computed`; canopy fields; CFM sensors present

- [ ] **Step 3: Browser matrix + screenshots; fill Climate walk; gate**

**Do not start Overview until Climate walk is green.**

---

### Task 7: Pass 3 — Overview honesty tests

**Files:**
- Create: `brain/tests/test_live_ux_overview_honesty.py`

**Interfaces:**
- Consumes: `/rooms`, `/journal/room/grow_room`, `/journal/core`, `/health`

- [ ] **Step 1: Write API guards**

```python
def test_overview_journal_stack_reachable(client):
    assert client.get("/rooms").status_code == 200
    assert "grow_room" in {r["room_id"] for r in client.get("/rooms").json()["rooms"]}
    assert client.get("/journal/room/grow_room").status_code == 200
    assert client.get("/journal/core").status_code == 200
    assert client.get("/health").status_code == 200
```

- [ ] **Step 2: pytest PASS**

---

### Task 8: Pass 3 — Overview SPA honesty + light UX

**Files:**
- Modify: `.../pages/OverviewPage.tsx`
- Touch: `RoomJournal.tsx`, `CoreJournal.tsx` only if provenance/UX fails inventory

- [ ] **Step 1: Inventory `#/live/overview`**

KIT HONEST, critical banners vs grow log, photoperiod glance vs Light SoT, Room/Core journals, grey OOS bands.

- [ ] **Step 2: Fix SPA; build:spa**

---

### Task 9: Pass 3 — Overview Pi prove + program close

**Files:**
- Create: `.audit/live-ux-overview-prove.ps1`
- Modify: `docs/qa/LIVE-UX-OVERVIEW-WALK-2026-09.md`
- Modify: `docs/FOLLOWUPS.md` — dated Live UX Passes 1–3 section
- Modify: `docs/superpowers/specs/2026-09-01-live-ux-honesty-program-design.md` — status for Passes 1–3 complete; Pass 4/5 still stubs

- [ ] **Step 1: Hotpatch; HTTP health/rooms/journals/fleet banners**

- [ ] **Step 2: Browser + screenshots; fill Overview walk**

- [ ] **Step 3: Cross-check Overview photoperiod glance against Light SoT (both tents)**

- [ ] **Step 4: Program close notes**

FOLLOWUPS: bundle hashes, any parks for Pass 4 brainstorm. Spec status: Passes 1–3 implemented/proven; Pass 4/5 remain stubs pending `/brainstorming`.

- [ ] **Step 5: Stop** — do not invent Pass 4/5 work; offer Pass 4 brainstorm when operator ready

---

## Execution note

Prefer one coherent pass per desk with polish in-scope. Operator approved full stress between desks. Hardware stays parked. After Overview gate, operator queue remains: CannaLib prod → FlowSankey verify → Zigbee one-recipe — unless Pass 4 brainstorm reorders.
