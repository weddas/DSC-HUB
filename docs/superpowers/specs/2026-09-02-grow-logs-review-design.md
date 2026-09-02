# Grow → Logs — Review, journals & trends — Design

**Date:** 2026-09-02  
**Status:** **approved** (2026-09-02) — plan [`2026-09-02-grow-logs-review.md`](../plans/2026-09-02-grow-logs-review.md)  
**Parent:** [`2026-09-01-space-energy-journal-design.md`](2026-09-01-space-energy-journal-design.md) · skill [`dsc-space-photoperiod-journal`](../../../.cursor/skills/dsc-space-photoperiod-journal/SKILL.md)  
**Domain:** Grow Review — read, compare, trend; journal UX; consolidate siloed analytics  
**Replaces (redirect):** `#/tune/analytics` → Grow → Logs trends view

## Problem

Operator observations (journals), operational messages (grow log), and sensor trends (Analytics, Climate charts, HistoryDrawer) live in **three parallel tracks** with no cross-links. Live desks render **full journal lists** (40–80 rows, unbounded height). There is **no edit/delete**, no compare, no env snapshot at note time, and `#/tune/analytics` duplicates a thin slice of Climate/root charts in a siloed Tune tab.

Peers ([Grow with Jane](https://growithjane.com/), [Isley](https://github.com/ababoude/isley), [GrowVPD Pro](https://growvpd.pro/)) unify **timeline + charts + sensor context** on a grow diary; DSC already has the hierarchy (plant → tent → room → core) and `fleet_history` — but not a **read-and-review** home.

## Goals

1. **Embedded mini-surfaces** (Overview, Light, plant seat): fetch **10**, show **3** visible rows, **scroll within ~10-row cap**, **Open full journal** deep-link to Grow → Logs.
2. **Grow → Logs** (`#/grow/logs`): hierarchy scope nav (A) — Plant · 4×8 · 2×4 · Room · Core · Grow log; full list, search/pagination, edit operator rows, compare-two, trends panel.
3. **One journal stack** — shared hook + list + row components; embedded vs full is **layout props only**, not duplicate fetch/render logic.
4. **Env snapshot on save** — operator POST attaches scope-appropriate sensor readings (`snapshot_json`); trends panel charts around `occurred_at`.
5. **Retire silo** — `#/tune/analytics` redirects to Logs trends view; Tune stays calibration/Learning-focused.

## Non-goals

- Unified Jane-style single stream merging grow log + observations on Overview (grow log stays separate compact scroll)
- Run/batch entity (`grow_run`) v1 — compare is entry/scope/time, not harvest-batch model
- Photo journal / community growlogs
- Auto-backfill historical `sf1000_on` or journal snapshots for old rows
- New chart library; Mission Triage / Dash legacy rewrite
- Edit/delete **system** journal rows or grow-log events

## Constraints (operator-locked)

| Choice | Decision |
|--------|----------|
| Nav home | **Grow → Logs** (`#/grow/logs`) |
| Overview / Light | **Compact teasers only** (3 visible / 10 fetch / scroll); trends secondary on Overview |
| Scope nav (Logs) | **Hierarchy A** — plant · 4×8 · 2×4 · room · core · grow log |
| Component model | **Single stack** — `useJournalScope` + `JournalEntryList` + `JournalScopePanel`; `variant=embedded\|full` |
| Embedded fetch | Always **`limit=10`** |
| Operator vs system | Operator rows PATCH/DELETE; system rows read-only |
| Snapshots | Server-written on POST; read-only in UI |
| Analytics redirect | `#/tune/analytics` → `#/grow/logs?view=trends&scope=…` |
| Honesty | Snapshots labeled captured-at-save; missing probe → `—`; no fake live on backdated `occurred_at` beyond stored snapshot |

---

## §1 Information architecture

```text
Live (control — Want→Got)
├── Overview ── JournalScopePanel embedded ──► /grow/logs?scope=room|core
├── Light ──── JournalScopePanel embedded ──► /grow/logs?scope=4x8|2x4
├── Climate (no journal)
└── …

Grow (plan + review)
├── Roster
├── Compose
├── Research
└── Logs  ← NEW
    ├── Scope sidebar: plants (roster) · 4×8 · 2×4 · room · core · grow log
    ├── Main: JournalScopePanel full + entry detail / edit
    ├── Compare: two entries or two scopes (split detail + dual chart markers)
    └── Trends panel: charts for scope + time window (absorbs Analytics)

Tune
└── analytics → redirect /grow/logs?view=trends
```

**Deep links:** `Open full journal` → `#/grow/logs?scope={kind}&id={optional}&entry={optional}`.

**Overview layout:** Room + Core **teasers above** climate bands; grow log remains separate compact operational scroll (not merged into observation list).

---

## §2 SPA — unified journal presentation

### Shared module

| Unit | Responsibility |
|------|------------------|
| `useJournalScope(scope, { limit })` | Fetch, reload, POST; maps scope kind → API path |
| `JournalEntryRow` | Timestamp, provenance chip, note, source, snapshot chips, highlight styling |
| `JournalEntryList` | Renders rows; `visibleRows`, `scrollMax`, `variant` |
| `JournalScopePanel` | Card/shell: help copy, optional compose, list, footer link |

### Props contract

```tsx
JournalScopePanel {
  scope: { kind: "plant"|"space"|"room"|"core"|"grow_log"; id?: string }
  variant: "embedded" | "full"
  fetchLimit?: number        // default 10 embedded, 50 full
  visibleRows?: number       // embedded default 3
  scrollMaxRows?: number     // embedded default 10 (CSS max-height)
  showCompose?: boolean
  footerHref?: string        // default auto /grow/logs?scope=…
}
```

### Surface matrix

| Surface | variant | fetchLimit | visibleRows | compose | footer |
|---------|---------|------------|-------------|---------|--------|
| Overview room/core | embedded | 10 | 3 | yes | Open full journal |
| Light 4×8 / 2×4 | embedded | 10 | 3 | yes | Open full journal |
| Plant seat overlay | embedded | 10 | 3 | yes (+ datetime) | Open full journal |
| Grow → Logs | full | 50 + offset | all | yes | — |

**Migration:** Replace `RoomJournal`, `CoreJournal`, `TentOccupancyJournal`, `PlantMiniJournal` with thin `JournalScopePanel` wrappers — delete duplicate list markup.

### Grow → Logs page

- **Left sidebar:** hierarchy scopes; plant list from roster assigned slots
- **Center:** `JournalScopePanel variant="full"` with search/filter (source, date range v1.1 optional)
- **Right / drawer:** entry detail — edit note, time, tags, highlight; delete with confirm
- **Compare mode:** select two entries → split pane + dual mini-charts at each `occurred_at`
- **Trends panel:** `view=trends` query opens chart strip (entities per scope); replaces Tune Analytics cards

---

## §3 Brain API & data model

### Journal tables (plant, space, room, dsc_core)

Add column to each:

```sql
snapshot_json TEXT NOT NULL DEFAULT '{}'
```

Existing columns unchanged: `id`, scope key, `occurred_at`, `note`, `source`, `tags_json`, `created_at`.

### HTTP (per scope + unified alias optional)

| Method | Path pattern | Body / query | Rules |
|--------|--------------|--------------|-------|
| GET | `/journal/{scope}/…` | `limit`, `offset` | Newest first; embedded callers pass `limit=10` |
| POST | same | `{ note, occurred_at?, tags? }` | `source=operator`; server fills `snapshot_json` |
| PATCH | `/journal/{scope}/…/{id}` | `{ note?, occurred_at?, tags? }` | **403** if `source=system` |
| DELETE | `/journal/{scope}/…/{id}` | — | **403** if `source=system` |

**Grow log:** `GET /grow-log` only in v1 (sidebar stream); no PATCH/DELETE.

### Entry shape (JSON)

```json
{
  "id": 1,
  "scope": { "kind": "space", "id": "4x8" },
  "provenance": "space",
  "plant_id": null,
  "occurred_at": 1788268990.0,
  "note": "Defoliated lower fan leaves.",
  "source": "operator",
  "tags": ["highlight"],
  "snapshot": { "temp_c": 24.1, "rh_pct": 58, "vpd_kpa": 1.02 },
  "created_at": 1788268991.0
}
```

### Snapshot capture (on POST)

Brain reads live fleet/computed at save time (not recomputed on PATCH unless explicit “refresh snapshot” v1.1 — **v1: snapshot frozen at create only**).

| Scope | snapshot keys (v1) |
|-------|-------------------|
| **plant** | `growth_stage`, `moisture_pct`, `ec_us`, `ph` (assigned probe; honest absent if unassigned) |
| **space** `4x8` / `2x4` | `temp_c`, `rh_pct`, `vpd_kpa`, `window_open`, `lights_on_today_h`, `climate_mode` or photoperiod chip |
| **room** | `room_temp_c`, `room_rh_pct`, `room_vpd_kpa` |
| **core** | `brain_version`, `active_alert_count` (light facility rollup) |

Implementation reuses `ENTITY_METRIC_MAP` / computed snapshot helpers — same SoT as Climate and former Analytics.

---

## §4 Trends & compare

### Chart this moment

From entry detail: open trends panel with default window **±6h** around `occurred_at`; entity set from scope (plant → probe moisture/EC; 4×8 → tent T/RH/VPD + window; room → room sensors).

Uses existing `useChartHours`, `/history`, ECharts `MultiLineChart` — no new chart library.

### Compare two

- **Entry compare:** pick A and B → side-by-side notes + snapshots + dual chart markers
- **Scope compare (v1.1):** two scopes same date range — optional follow-up

### Analytics redirect

- `#/tune/analytics` → `#/grow/logs?view=trends&scope=4x8` (default scope 4×8; preserve query overrides)
- Legacy `#/advanced/trends` chain already points at analytics — ends at Logs trends

**Tune Analytics page:** remove or stub redirect only; root moisture + tent T/RH charts live under Logs trends panel with honest copy (“secondary to Climate desk for control”).

---

## §5 Error handling & honesty

- Missing snapshot field → omit chip, never `0` theater
- Backdated `occurred_at` → snapshot still “at save time”; UI caption: “Env captured when saved”
- System rows: no edit/delete; provenance chips unchanged
- Grow log: operational only; filters reuse `growLogFilter`
- Secrets never in journal bodies or snapshots

---

## §6 Testing & prove

| Layer | Tests |
|-------|--------|
| Brain | PATCH/DELETE 403 on system; operator round-trip; snapshot keys present on POST; pagination offset |
| SPA | Embedded renders max 3 visible + scroll; fetch limit 10; footer link href; redirect route |
| Walk | Overview/Light teasers + Logs full browser + trends panel + compare smoke |

Park in FOLLOWUPS: roster journal wiring (if not already on seat panel only), grow-log click → playbook deep-link (WF-P1-4).

---

## §7 Success criteria

- [ ] Overview + Light show **3 of 10** scroll teasers with **Open full journal**
- [ ] Grow nav includes **Logs**; hierarchy sidebar works
- [ ] Single `JournalScopePanel` stack; no duplicate journal list components
- [ ] Operator edit/delete/time/highlight on full browser
- [ ] POST attaches `snapshot_json`; detail shows chips + chart link
- [ ] Compare-two entries with dual chart markers
- [ ] `#/tune/analytics` redirects to Logs trends
- [ ] pytest + browser prove documented in walk/FOLLOWUPS

---

## References

- Existing journal modules: `brain/dsc_brain/{plant,space,room,dsc_core}_journal.py`, `brain/dsc_brain/api.py`
- History: `brain/dsc_brain/history_ops.py`, `frontend/src/hooks/useHistory.ts`
- Former Analytics: `frontend/src/pages/TuneFleetPages.tsx` (`TuneAnalyticsPage`)
- Peer patterns: Grow with Jane Growlog Charts; Isley sensor-linked activity logs
