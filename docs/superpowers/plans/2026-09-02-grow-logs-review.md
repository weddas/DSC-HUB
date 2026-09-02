# Grow → Logs — Review & journals Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship unified journal presentation (embedded 3-of-10 teasers + Grow → Logs full browser with edit/compare/trends) and retire siloed `#/tune/analytics` via redirect.

**Architecture:** One journal stack — `useJournalScope` + `JournalEntryList` + `JournalScopePanel` with `variant=embedded|full`. Brain adds `snapshot_json` on POST and PATCH/DELETE for operator rows only. Grow → Logs page wraps full variant with hierarchy sidebar, detail drawer, compare mode, and trends panel.

**Tech Stack:** Pi DSC-Brain (FastAPI + SQLite), React SPA, ECharts via existing chart hooks, pytest, vitest optional for hook tests

**Spec:** [`docs/superpowers/specs/2026-09-02-grow-logs-review-design.md`](../specs/2026-09-02-grow-logs-review-design.md)

## Global Constraints

- Embedded surfaces: **`GET limit=10`**, show **3 visible rows**, scroll within **~10-row** cap
- Full browser: **`limit=50` + `offset`** pagination; operator PATCH/DELETE only; **403** on `source=system`
- **`snapshot_json`** captured on POST only (frozen at save); honest `—` for missing probes
- **Single component stack** — no duplicate journal list markup in Room/Core/Tent/Plant cards
- **`#/tune/analytics`** → **`#/grow/logs?view=trends&scope=4x8`** (default)
- Grow log stream: **GET only** in v1
- No new chart library; reuse `useChartHours`, `/history`, `MultiLineChart`
- Both tents parity where Light shows tent journals; Overview room+core teasers above bands
- Park off-scope in `docs/FOLLOWUPS.md`; commit when operator asks

## File map

| Path | Role |
|------|------|
| `brain/dsc_brain/{plant,space,room,dsc_core}_journal.py` | `snapshot_json` column + PATCH/DELETE |
| `brain/dsc_brain/journal_snapshot.py` | **Create** — scope → snapshot dict from fleet/computed |
| `brain/dsc_brain/api.py` | PATCH/DELETE routes; pagination query params |
| `brain/tests/test_journal_api.py` | Extend — snapshot, 403, offset |
| `frontend/src/components/journal/JournalScopePanel.tsx` | **Create** — unified panel |
| `frontend/src/components/journal/JournalEntryList.tsx` | **Create** — list + scroll/visibleRows |
| `frontend/src/components/journal/JournalEntryRow.tsx` | **Create** — row + snapshot chips |
| `frontend/src/hooks/useJournalScope.ts` | **Create** — fetch/post/patch/delete |
| `frontend/src/pages/GrowLogsPage.tsx` | **Create** — full browser shell |
| `frontend/src/pages/OverviewPage.tsx`, `LightPage.tsx`, `PlantSeatPanel.tsx` | Swap to embedded panel |
| `frontend/src/routes.ts`, `App.tsx` | Grow Logs tab + redirect |
| `frontend/src/pages/TuneFleetPages.tsx` | Analytics → redirect or thin wrapper |
| `frontend/src/styles/dsc.css` | `.dsc-journal-teaser-scroll` max-height |
| `docs/qa/GROW-LOGS-WALK-2026-09.md` | **Create** — prove walk |

---

### Task 1: Brain — schema + snapshot helper

**Files:**
- Create: `brain/dsc_brain/journal_snapshot.py`
- Modify: `brain/dsc_brain/plant_journal.py`, `space_journal.py`, `room_journal.py`, `dsc_core_journal.py`
- Test: `brain/tests/test_journal_snapshot.py`

**Interfaces:**
- Produces: `capture_journal_snapshot(scope_kind: str, scope_id: str, fleet: dict) -> dict[str, Any]`
- Produces: `add_*_entry(...)` returns `snapshot` key in response dict

- [ ] **Step 1: Failing test** — plant scope with mocked fleet returns moisture/ec keys

```python
def test_plant_snapshot_includes_probe_metrics(monkeypatch):
    fleet = {"computed": {"pots": {"pot1": {"moisture_pct": 42.0, "ec_us": 1.2}}}}
    snap = capture_journal_snapshot("plant", "plant:slot:1", fleet)
    assert snap["moisture_pct"] == 42.0
```

- [ ] **Step 2:** Run `pytest brain/tests/test_journal_snapshot.py -v` — expect FAIL
- [ ] **Step 3:** Implement `journal_snapshot.py` using existing computed/fleet shapes; add `snapshot_json` column via `ALTER` in each `init_*_tables` (idempotent)
- [ ] **Step 4:** Wire snapshot into all four `add_*_entry` functions on INSERT
- [ ] **Step 5:** pytest PASS; commit

---

### Task 2: Brain — PATCH/DELETE + pagination

**Files:**
- Modify: `brain/dsc_brain/{plant,space,room,dsc_core}_journal.py` — `update_*_entry`, `delete_*_entry`
- Modify: `brain/dsc_brain/api.py` — routes + `JournalPatchBody`
- Test: `brain/tests/test_journal_api.py`

**Interfaces:**
- Produces: `PATCH /journal/plant/{plant_id}/{entry_id}`, same pattern for space/room/core
- Produces: `DELETE` same; `GET` accepts `limit` (default 100) + `offset` (default 0)

- [ ] **Step 1: Failing tests**

```python
def test_patch_operator_entry(client, temp_db):
    # POST then PATCH note
    ...

def test_patch_system_entry_forbidden(client, temp_db):
    # insert source=system → PATCH → 403
    ...

def test_delete_operator_entry(client, temp_db):
    ...

def test_get_journal_offset(client, temp_db):
    # seed 15 rows, limit=10 offset=10 → 5 rows
    ...
```

- [ ] **Step 2:** Implement update/delete with source guard; list queries add `OFFSET`
- [ ] **Step 3:** `pytest brain/tests/test_journal_api.py -v` PASS
- [ ] **Step 4:** Commit

---

### Task 3: SPA — shared journal stack

**Files:**
- Create: `frontend/src/hooks/useJournalScope.ts`
- Create: `frontend/src/components/journal/JournalEntryRow.tsx`
- Create: `frontend/src/components/journal/JournalEntryList.tsx`
- Create: `frontend/src/components/journal/JournalScopePanel.tsx`
- Modify: `frontend/src/lib/fleetApi.ts` — `patchJournalEntry`, `deleteJournalEntry`, extend `JournalEntry` type with `snapshot`
- Modify: `frontend/src/styles/dsc.css`

**Interfaces:**
- Produces: `useJournalScope(scope, { limit, offset })` → `{ entries, loading, error, reload, save, update, remove }`
- Produces: `JournalScopePanel({ scope, variant, fetchLimit?, visibleRows?, showCompose?, footerHref? })`

- [ ] **Step 1:** Extend `fleetApi.ts` PATCH/DELETE helpers per scope kind
- [ ] **Step 2:** Implement `JournalEntryList` — when `variant="embedded"`, CSS class limits height to ~10 rows and shows first `visibleRows` without hiding data (scroll container holds all fetched rows, max 10)
- [ ] **Step 3:** Implement `JournalScopePanel` with compose + footer link `Open full journal` → `/grow/logs?scope=...`
- [ ] **Step 4:** `npm run build:spa` green; commit src (spa-dist when operator asks for hotpatch)

---

### Task 4: Embedded surfaces — Overview + Light + plant seat

**Files:**
- Modify: `frontend/src/pages/OverviewPage.tsx` — replace `RoomJournal`/`CoreJournal` with embedded panels; reposition above bands if buried
- Modify: `frontend/src/pages/LightPage.tsx` — replace `TentOccupancyJournal` ×2
- Modify: `frontend/src/components/PlantSeatPanel.tsx` — replace `PlantMiniJournal`
- Delete or re-export thin wrappers from old journal components (deprecate duplicate list code)

- [ ] **Step 1:** Overview — `<JournalScopePanel scope={{ kind: "room", id: "grow_room" }} variant="embedded" fetchLimit={10} visibleRows={3} />` + core equivalent
- [ ] **Step 2:** Light — space scopes `4x8` and `2x4`
- [ ] **Step 3:** Plant seat — `scope={{ kind: "plant", id: plantId }}` with datetime compose (preserve plant-only datetime-local)
- [ ] **Step 4:** Remove dead list markup from `RoomJournal.tsx` etc. or make them one-line re-exports
- [ ] **Step 5:** Browser smoke Overview + Light; commit

---

### Task 5: Grow → Logs page + nav

**Files:**
- Create: `frontend/src/pages/GrowLogsPage.tsx`
- Modify: `frontend/src/routes.ts` — add `{ id: "logs", label: "Logs", path: "/grow/logs", icon: "catalog" }` (or new icon if registered)
- Modify: `frontend/src/App.tsx` — lazy route `/grow/logs`
- Modify: `frontend/src/routes.ts` `LEGACY_REDIRECTS` if needed

**Interfaces:**
- Produces: `GrowLogsPage` reads `?scope=` and `?view=trends` query params
- Sidebar scopes: plants from roster, fixed 4x8/2x4/room/core/grow_log

- [ ] **Step 1:** Layout — left scope nav, center `JournalScopePanel variant="full" fetchLimit={50}`
- [ ] **Step 2:** Grow log tab uses existing `get_grow_log` + `growLogFilter` (not JournalScopePanel)
- [ ] **Step 3:** Register nav tab under Grow; default `/grow/logs?scope=room`
- [ ] **Step 4:** Deep link from embedded footer opens correct scope; commit

---

### Task 6: Full browser — edit, highlight, delete, compare

**Files:**
- Modify: `frontend/src/pages/GrowLogsPage.tsx`
- Create: `frontend/src/components/journal/JournalEntryDetail.tsx`
- Create: `frontend/src/components/journal/JournalComparePane.tsx`

- [ ] **Step 1:** Detail drawer — edit note, `occurred_at` (datetime-local), tags highlight toggle, delete confirm; disabled for `source=system`
- [ ] **Step 2:** Compare mode — checkbox/select two entries → `JournalComparePane` side-by-side notes + snapshots
- [ ] **Step 3:** Load more button increments `offset` by 50 on full panel
- [ ] **Step 4:** pytest brain + manual browser compare smoke; commit

---

### Task 7: Trends panel + Analytics redirect

**Files:**
- Create: `frontend/src/components/journal/LogsTrendsPanel.tsx` (relocate logic from `TuneAnalyticsPage`)
- Modify: `frontend/src/pages/TuneFleetPages.tsx` — `TuneAnalyticsPage` → `<Navigate to="/grow/logs?view=trends&scope=4x8" replace />`
- Modify: `frontend/src/pages/GrowLogsPage.tsx` — show `LogsTrendsPanel` when `view=trends` or entry action “Chart this moment”

**Interfaces:**
- Consumes: `useChartHours`, `useEntitySeries`, entity sets per scope (mirror former Analytics + scope defaults)
- Chart window: ±6h around selected `occurred_at` when opened from entry

- [ ] **Step 1:** Extract tent T/RH + root moisture charts into `LogsTrendsPanel`
- [ ] **Step 2:** Entry action sets `chartAnchorTs` state and opens panel
- [ ] **Step 3:** Compare mode adds two vertical markers on shared chart (or dual mini charts)
- [ ] **Step 4:** Verify `#/tune/analytics` redirect; commit

---

### Task 8: Walk, FOLLOWUPS, prove

**Files:**
- Create: `docs/qa/GROW-LOGS-WALK-2026-09.md`
- Modify: `docs/FOLLOWUPS.md` — Grow Logs landed section
- Optional: `.audit/grow-logs-prove.ps1` — HTTP journal CRUD + limit=10

- [ ] **Step 1:** Fill walk — embedded 3/10, full browser edit, compare, trends redirect
- [ ] **Step 2:** Pi hotpatch if brain changed (`docker stop -t 20` + `start`); HTTP prove
- [ ] **Step 3:** FOLLOWUPS dated section; commit when operator asks

---

## Spec coverage checklist

| Spec requirement | Task |
|------------------|------|
| Embedded 3 visible / 10 fetch / scroll | 3, 4 |
| Open full journal deep link | 3, 5 |
| Grow → Logs hierarchy sidebar | 5 |
| Unified component stack | 3, 4 |
| PATCH/DELETE operator only | 2, 6 |
| snapshot_json on POST | 1 |
| Compare two entries | 6 |
| Trends + analytics redirect | 7 |
| Grow log separate stream | 5 |
| Success criteria walk | 8 |

## Execution handoff

Plan saved to [`docs/superpowers/plans/2026-09-02-grow-logs-review.md`](2026-09-02-grow-logs-review.md).

**Two execution options:**

1. **Subagent-driven (recommended)** — fresh subagent per task, review between tasks  
2. **Inline** — execute tasks in this session with checkpoints

Which approach do you want?
