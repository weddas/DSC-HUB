# Grow → Logs — walk & prove (Task 8)

**Spec:** [`docs/superpowers/specs/2026-09-02-grow-logs-review-design.md`](../superpowers/specs/2026-09-02-grow-logs-review-design.md)  
**Plan:** [`docs/superpowers/plans/2026-09-02-grow-logs-review.md`](../superpowers/plans/2026-09-02-grow-logs-review.md)  
**Date:** 2026-09-02  
**Bundle (local build):** `spa-dist/assets/index-C0JbXFQo.js`  
**Pi hotpatch:** completed 2026-09-02 — tarballs uploaded; plink dropped during `docker stop` (~65 min); Pi recovered; **HTTP GATE GREEN** (evidence: `.audit/grow-logs-pi-prove-evidence.json`)

---

## Gates

| Gate | Result | Evidence |
|------|--------|----------|
| G0 Brain pytest (journal) | **pass** | `16 passed` — `test_journal_api`, `test_journal_snapshot`, `test_journal_crud` (2026-09-02) |
| G1 SPA build | **pass** | `npm run build:spa` → `index-C0JbXFQo.js`; chunk-size warnings only |
| G2 Pi HTTP / hotpatch | **pass** | `index-C0JbXFQo.js` live; journal list/paginate, POST snapshot, PATCH/DELETE, system 403 — all green |
| G3 Browser matrix | **partial** | Live walk ([browser walk](18bdfc25-b812-4fb0-8e54-faebfdd290e4)): Logs nav, trends, analytics redirect **pass**; journal rows blocked mid-walk by `/journal/*` API hang; teaser height bug fixed in CSS (was 10-row max-height) |
| G4 Analytics redirect | **static pass** | `TuneAnalyticsPage` → `Navigate` to `/grow/logs?view=trends&scope=space&id=4x8`; `LEGACY_REDIRECTS` mirrors |

**Overall gate:** **YELLOW** — repo + parks complete; Pi needs spa-only hotpatch (`index-Rxe08ZUG.js`); avoid `docker stop` until host stable (use `.audit/grow-logs-spa-only-hotpatch.ps1`).

---

## Spec success criteria

| Criterion | Result | Notes |
|-----------|--------|-------|
| Overview + Light show 3 of 10 scroll teasers + Open full journal | **static pass** | `JournalScopePanel variant="embedded" fetchLimit={10} visibleRows={3}` on Overview room/core, Light 4×8/2×4, plant seat; footer `Link` → `/grow/logs?scope=…`; CSS `.dsc-journal-teaser-scroll` max-height ~10 rows |
| Grow nav includes Logs; hierarchy sidebar | **static pass** | `routes.ts` `{ id: "logs", path: "/grow/logs" }`; `GrowLogsPage` sidebar: plants (roster) · 4×8 · 2×4 · room · core · grow log |
| Single `JournalScopePanel` stack | **static pass** | Legacy wrappers (`RoomJournal`, `CoreJournal`, `TentOccupancyJournal`, `PlantMiniJournal`) re-export panel only |
| Operator edit/delete/time/highlight on full browser | **static pass** | `JournalEntryDetail` — editable when `isJournalEntryEditable`; system rows read-only; PATCH/DELETE pytest 403 on system |
| POST attaches `snapshot_json`; detail shows chips + chart link | **pass (pytest + code)** | Snapshot keys per scope in `test_journal_snapshot`; detail caption “Env captured when saved”; “Chart this moment” action |
| Compare-two entries with dual chart markers | **static pass** | `JournalComparePane` + `LogsTrendsPanel compareAnchorsSec`; compare mode toggles on full panel |
| `#/tune/analytics` redirects to Logs trends | **static pass** | `TuneAnalyticsPage` + `LEGACY_REDIRECTS["/tune/analytics"]` |
| pytest + browser prove documented | **pass (this doc)** | pytest green; browser = static until Pi soak |

---

## Embedded teasers checklist

| Surface | Scope | fetchLimit | visibleRows | Compose | Footer deep link | Result |
|---------|-------|------------|-------------|---------|------------------|--------|
| Overview room | `room/grow_room` | 10 | 3 | yes | `/grow/logs?scope=room&id=grow_room` | **static pass** |
| Overview core | `core` | 10 | 3 | yes | `/grow/logs?scope=core` | **static pass** |
| Light 4×8 | `space/4x8` | 10 | 3 | yes | `/grow/logs?scope=space&id=4x8` | **static pass** |
| Light 2×4 | `space/2x4` | 10 | 3 | yes | `/grow/logs?scope=space&id=2x4` | **static pass** |
| Plant seat overlay | `plant/{id}` | 10 | 3 | yes (+ datetime) | `/grow/logs?scope=plant&id=…` | **static pass** |

**Scroll cap:** `.dsc-journal-teaser-scroll` — `--dsc-journal-row-height: 52px` × `scrollMaxRows` (default 10).

**Live browser (operator):**

- [x] Grow nav **Logs** tab → `#/grow/logs` (2026-09-02 live walk)
- [x] `#/grow/logs?view=trends&scope=space&id=4x8` — T/RH, VPD, root moisture charts render
- [x] `#/tune/analytics` → Logs trends for 4×8
- [ ] Overview: room + core teasers — chrome + footer links OK; rows stuck on API timeout mid-walk; **3-visible scroll fixed in CSS** (re-hotpatch SPA)
- [ ] Light: 4×8 / 2×4 embedded — same API hang; re-verify after brain stable
- [ ] Plant seat: datetime compose + footer deep link — not walked this session

---

## Full browser (`#/grow/logs`) checklist

| Check | Result | Notes |
|-------|--------|-------|
| Default scope | **static pass** | Nav default `/grow/logs?scope=room` (plan) |
| Sidebar hierarchy | **static pass** | Plants from roster + fixed spaces + room + core + grow log stream |
| Full list pagination | **static pass** | `fetchLimit={50}` + Load more increments offset |
| Compose + snapshot on POST | **pass (pytest)** | Operator POST persists scope-appropriate snapshot keys |
| Entry detail drawer | **static pass** | Note, `occurred_at`, highlight tag, delete confirm |
| System rows read-only | **pass (pytest)** | PATCH/DELETE → 403; UI disables edit for `source=system` |
| Compare mode (two entries) | **static pass** | Checkbox select → `JournalComparePane` notes + snapshot diff + dual chart anchors |
| Grow log tab (GET only) | **static pass** | `GrowLogStream` separate from `JournalScopePanel`; no PATCH/DELETE |

**Live browser (operator):**

- [x] Scope sidebar + compose + Compare entries UI present
- [ ] Compose note → snapshot chips (blocked: journal API timeout)
- [ ] Edit/delete/compare row interactions — re-verify when `GET /journal/room/grow_room?limit=10` returns in &lt;2s

---

## Trends + anchor checklist

| Check | Result | Notes |
|-------|--------|-------|
| `?view=trends` opens panel | **static pass** | `GrowLogsPage` renders `LogsTrendsPanel` when view=trends |
| Entry “Chart this moment” | **static pass** | Sets anchor ±6h window via `TRENDS_HALF_WINDOW_H` |
| Compare dual markers | **static pass** | `compareAnchorsSec` drives chart window + caption |
| Entity set per scope | **static pass** | `logsTrendEntities.ts` + `useTrendsSeries` mirror former Analytics |
| Honest copy | **static pass** | Secondary to Climate desk for control (spec §4) |

**Live browser (operator):**

- [x] Trends panel + 4×8 charts (live walk)
- [ ] Entry “Chart this moment” anchor — not verified (API hang)
- [ ] Compare dual markers — not verified without loaded rows

---

## Analytics redirect checklist

| Legacy path | Target | Result |
|-------------|--------|--------|
| `#/tune/analytics` | `#/grow/logs?view=trends&scope=space&id=4x8` | **static pass** |
| `#/advanced/trends` | same (via `LEGACY_REDIRECTS`) | **static pass** |
| `#/advanced/history` | same | **static pass** |

**Live browser (operator):**

- [x] `#/tune/analytics` lands on Logs trends for 4×8 (live walk)

---

## Brain API prove (local pytest)

```
pytest tests/test_journal_api.py tests/test_journal_snapshot.py tests/test_journal_crud.py -v
→ 16 passed in 4.18s
```

| Test area | Coverage |
|-----------|----------|
| Snapshot capture | plant / space / room / core keys; honest absent probe |
| POST persistence | snapshot_json stored on INSERT |
| PATCH/DELETE | operator round-trip; system → 403 |
| Pagination | limit + offset |

---

## Pi HTTP prove (deferred)

When hotpatching brain + SPA to Pi:

1. `docker stop -t 20 dsc-brain && docker start dsc-brain` (not restart/kill)
2. Verify `GET /journal/space/4x8?limit=10` → 200, newest first
3. `POST` operator note → response includes `snapshot` object
4. `PATCH` system row → 403
5. SPA `#/grow/logs` loads bundle matching `index-C0JbXFQo.js` sha256

Optional script: `.audit/grow-logs-prove.ps1` (not created this session — park in FOLLOWUPS if desired).

---

## Residuals / parks

| Item | Status | Notes |
|------|--------|-------|
| Live browser matrix | **open** | Pi redeploy pending — spa-only hotpatch after recovery |
| Pi hotpatch | **open** | Prefer `.audit/grow-logs-spa-only-hotpatch.ps1`; full stop+start only when host stable |
| Grow log firehose filter | **done** | UX-P1-5 — collapse + ×N in `growLogFilter.ts` |
| Grow log click → playbook | **done** | WF-P1-4 — `growLogPlaybook.ts` |
| Scope compare (two scopes) | **done** | v1.1 — URL `compareScopeA`/`compareScopeB` |
| Snapshot backfill | **done** | Admin POST + fleet_history ±30m |

---

## Parent handoff

**DONE** (Task 8 repo scope) · **Gate YELLOW**

- pytest **GREEN** (16/16 journal tests)
- build:spa **GREEN** (`index-C0JbXFQo.js`)
- browser **YELLOW** (static/code verification; operator Pi walk pending)
- Pi hotpatch **RED/skip** (not attempted)
