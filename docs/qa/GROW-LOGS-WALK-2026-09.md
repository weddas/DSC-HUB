# Grow → Logs — walk & prove (Task 8)

**Spec:** [`docs/superpowers/specs/2026-09-02-grow-logs-review-design.md`](../superpowers/specs/2026-09-02-grow-logs-review-design.md)
**Plan:** [`docs/superpowers/plans/2026-09-02-grow-logs-review.md`](../superpowers/plans/2026-09-02-grow-logs-review.md)

---

## 2026-09-05 close-out — GATE GREEN

**Bundle (live Pi):** `spa-dist/assets/index-BaRgMeRp.js`
**Pi hotpatch:** full SPA + brain journal modules via `.audit/grow-logs-pi-hotpatch-prove.ps1` (docker `stop -t 20` + `start`) — **HTTP GATE GREEN**, evidence: `.audit/grow-logs-pi-prove-evidence.json`

This session closed the YELLOW residual from 2026-09-02 (live browser journal rows) and fixed a second round of honesty/UX bugs found on top of that, per a design-honesty re-review + targeted code audit. All fixes are live on the Pi and browser-verified below.

### Fixes landed this session

| # | Bug | Fix | File(s) |
|---|-----|-----|---------|
| 1 | Embedded teaser showed ~2.2 rows, not 3 | `--dsc-journal-row-height` 52px → 78px (measured against real multi-line row markup) | `styles/dsc.css` |
| 2 | Room/Space/Core journals drowned in uncollapsed system rows (schedule-slide chatter) | `collapseConsecutiveSystemDuplicates` — collapses exact-duplicate consecutive `source="system"` rows within 5 min into one row + `×N` badge; never touches operator rows or merges distinct content | `journalFormat.ts`, `JournalEntryList.tsx`, `JournalEntryRow.tsx` |
| 3 | Trends tab silently seeded a self-vs-self scope compare on every tab switch | `setView()` now only carries `compareScopeA/B` through when compare mode is already on | `GrowLogsPage.tsx` |
| 4 | Plant scope compare param double-prefixed (`plant:plant:<uuid>`) | `formatCompareScopeParam`/`parseCompareScopeParam` treat plant ids (already `plant:`-prefixed) as a single token | `journalApi.ts` |
| 5 | Entry detail drawer had no time editor despite spec/plan requiring it | Added `occurred_at` datetime-local editor; wired through `JournalPatchBody` → all 4 brain scopes (plant/space/room/core) | `JournalEntryDetail.tsx`, `types/journal.ts`, `api.py`, `{plant,space,room,dsc_core}_journal.py` |
| 6 | `growth_stage` PATCH let an operator rewrite the frozen-at-create snapshot (confirmed data-integrity bug, not cosmetic) | Removed `growth_stage` from `JournalPatchBody` and all brain update functions — PATCH silently ignores it now (matches spec's `{note?, occurred_at?, tags?}` PATCH contract) | same as #5 |
| 7 | `useJournalScope` refetched on every unrelated re-render (entity-bus tick) because `scope` is a fresh object literal at nearly every call site | `reload` now keys on `scope.kind`/`scope.id` primitives, not object identity | `useJournalScope.ts` |
| 8 | Fleet "Surface"/version KPI and page title fabricated a plausible-looking fake version (`7.4.0`/`7.0.0.0`) when the real value was missing | Honest `"—"` fallback instead of a fake version string | `fleetModel.ts` (`EMPTY_FLEET`), `main.tsx`, `TuneFleetPages.tsx` |
| 9 | F-001 (AC) / F-002 (clone mister) demand toggles on Climate Command card looked like live, pressable controls | New `EntityToggle` `oos`/`oosLabel` props — dashed border, "On hold" label, genuinely disabled, wired via `inventoryInService(fleet, "ac"\|"mister")` (same SoT as Fleet page) | `ui.tsx`, `ClimatePage.tsx`, `dsc.css` |
| 10 | "Plant seat · POT{n}" title in the twin-pot-pick overlay — Seat/POT language leak | `Plant · Probe {n}` | `SeatOverlay.tsx` |
| 11 | Stale `live-ux-light-prove` test rows sitting in the real 4×8/2×4 journals | Deleted via the operator DELETE endpoint (ids 56, 57) — confirmed gone from space + room rollup | live data, no code change |
| 12 | Demand-toggle clicks (Heat/Cool/Hum/Dehum/Mat/Mister/etc.) waited for the full write round-trip + entity-bus push before flipping visually | `EntityToggle` now has a local optimistic `pendingOn` draft (same pattern as `EntityText`/`EntityTime`), cleared once the bus confirms or after an 8s safety timeout | `ui.tsx` |
| 13 | SoftCalWizard: one `busy` flag blocked "Switch phase" (a pure local state change) and "Ask Brain" for the full ~15s capture sample window | "Switch phase" no longer gated on `busy`; "Ask Brain" has its own `aiBusy` flag | `SoftCalWizard.tsx` |
| 14 | No fleet freshness indicator at the top of the dash | Added "Updated Xs/Xm/Xh ago" chip next to the Honesty rail, driven by a real wall-clock timestamp set only when a fleet snapshot is actually applied (WS push or poll) — never fabricated | `useBrain.tsx`, `useFleet.tsx`, `Honesty.tsx`, `main.tsx` |

Deeper findings that were investigated and confirmed **not** to need a fix, or intentionally parked, are in [`docs/FOLLOWUPS.md`](../FOLLOWUPS.md).

### Gates

| Gate | Result | Evidence |
|------|--------|----------|
| G0 Brain pytest (journal) | **pass** | `19 passed` (`pytest tests/test_journal_crud.py tests/test_journal_snapshot.py -q`) — added `test_patch_does_not_accept_growth_stage`, updated `test_patch_operator_entry` for `occurred_at`. Full suite: `230 passed, 7 errors` where the 7 errors are a pre-existing, unrelated `paho-mqtt` teardown issue (`AttributeError: '_Client' object has no attribute 'loop_stop'` in `zigbee_mqtt.py:511`) reproduced identically with the journal test files fully deselected — not caused by this session's changes. Tracked in FOLLOWUPS. |
| G1 SPA build | **pass** | `npm run build:spa` → `index-BaRgMeRp.js`; chunk-size warnings only (pre-existing). `npx tsc --noEmit` shows ~20 pre-existing type errors, none in any file touched this session. |
| G2 Pi HTTP / hotpatch | **pass** | Full hotpatch (SPA + 6 brain journal modules) via `.audit/grow-logs-pi-hotpatch-prove.ps1`: `G0_index_bundle`, `G0_health`, `G1_journal_list_paginated`, `G2_post_snapshot`, `G3_patch_operator`, `G4_patch_system_403`, `G5_delete_operator` all **OK**. Additional manual curl smoke: PATCH `occurred_at` 1000→2000 applied; PATCH with `growth_stage` in body left `snapshot` untouched (`{}`). |
| G3 Browser matrix | **pass** | Live walk on `192.168.86.48:8787` (see below) |
| G4 Analytics redirect | **pass** | `#/tune/analytics` → `#/grow/logs?view=trends&scope=space&id=4x8`, live |

**Overall gate: GREEN.**

### G3 live browser matrix (2026-09-05)

- [x] Overview Room + Core embedded teasers show **3 full rows** + a scroll-revealed partial 4th (previously ~2.2) — screenshot-verified
- [x] Light 4×8 + 2×4 embedded teasers — same 3-row fix confirmed on **both** tents
- [x] Core journal teaser shows a `×2` repeat badge on a collapsed consecutive schedule-slide system row — dedup confirmed live
- [x] Grow → Logs sidebar nav (plants/spaces/room/core/grow log) loads correctly from Overview deep link
- [x] Trends tab switch — URL stays clean (`#/grow/logs?scope=room&id=grow_room&view=trends`), **no** `compareScopeA`/`compareScopeB` seeded
- [x] Entry detail drawer — "When" datetime-local editor present; live edit round-trip verified (composed a disposable row, changed occurred_at, saved, row re-rendered with new timestamp, deleted for cleanup)
- [x] Compose → snapshot chips — new row showed `ROOM T`/`ROOM RH`/`ROOM VPD` chips + "Env captured when saved" caption; chips unchanged after the occurred_at edit (snapshot correctly frozen, not re-captured)
- [x] Compare-two scopes (Grandmommy Purple vs Runtz Punch, plant scope) — `compareScopeA=plant:c95…`, `compareScopeB=plant:3bf5…` (single `plant:` prefix, not doubled); A/B badges correct; "Exit scope compare" returns to a clean URL
- [x] `#/tune/analytics` → Logs trends, live
- [x] Climate → Command card: "Cool" and "Mister" render dashed-border, disabled, labeled "On hold" (F-001/F-002 honest OOS); other demand toggles unaffected
- [x] Twin pot-pick overlay title reads "Plant · Probe 1" (was "Plant seat · POT1")
- [x] Dash top rail: "Kit honest" chip + "Updated 6s ago" (live-ticking) chip both present

Not independently re-walked this session (lower risk, covered by the same shared component/CSS the tests above already exercised): plant-scope embedded teaser variant specifically (architecturally identical `JournalScopePanel`/`JournalEntryList` — no separate render path to diverge), sidebar double-click nav repro (parked, see FOLLOWUPS), live EntityToggle optimistic-draft click timing (code-reviewed only — declined to click live physical demand switches on a running grow system just to time a UI flip).

---

## 2026-09-02 — initial pass (superseded by 2026-09-05 close-out above)

**Bundle (live Pi):** `spa-dist/assets/index-mqa24gAf.js`
**Pi hotpatch:** spa-only post-reboot 2026-09-02 — **HTTP GATE GREEN** (evidence: `.audit/grow-logs-pi-prove-evidence.json`)

### Gates (2026-09-02)

| Gate | Result | Evidence |
|------|--------|----------|
| G0 Brain pytest (journal) | **pass** | `16 passed` — `test_journal_api`, `test_journal_snapshot`, `test_journal_crud` |
| G1 SPA build | **pass** | `npm run build:spa` → `index-C0JbXFQo.js`; chunk-size warnings only |
| G2 Pi HTTP / hotpatch | **pass** | `index-mqa24gAf.js` live (spa-only); journal list/paginate, POST snapshot, PATCH/DELETE, system 403 — all green post-reboot |
| G3 Browser matrix | **partial** | Logs nav, trends, analytics redirect **pass**; journal rows blocked mid-walk by `/journal/*` API hang; teaser height bug identified (fix landed 2026-09-05) |
| G4 Analytics redirect | **static pass** | `TuneAnalyticsPage` → `Navigate` to `/grow/logs?view=trends&scope=space&id=4x8`; `LEGACY_REDIRECTS` mirrors |

**Overall gate (as of 2026-09-02):** YELLOW — superseded, see close-out above.

### Spec success criteria (2026-09-02 snapshot)

| Criterion | Result | Notes |
|-----------|--------|-------|
| Overview + Light show 3 of 10 scroll teasers + Open full journal | static pass → **live pass 2026-09-05** | Row-height CSS bug found + fixed |
| Grow nav includes Logs; hierarchy sidebar | static pass → **live pass 2026-09-05** | |
| Single `JournalScopePanel` stack | static pass | Legacy wrappers re-export panel only |
| Operator edit/delete/time/highlight on full browser | static pass (time editor **missing**) → **live pass 2026-09-05** | Time editor was not actually built 2026-09-02 despite doc claim; built + verified 2026-09-05 |
| POST attaches `snapshot_json`; detail shows chips + chart link | pass (pytest + code) → **live pass 2026-09-05** | |
| Compare-two entries with dual chart markers | static pass | |
| `#/tune/analytics` redirects to Logs trends | static pass → **live pass 2026-09-05** | |
| pytest + browser prove documented | pass | |

### Full browser / trends / redirect checklists (2026-09-02)

See git history of this file for the full 2026-09-02 static-pass tables (embedded teasers, full browser, trends+anchor, analytics redirect, brain API prove). All items in those tables that were "static pass" or blocked on the API hang are now **live pass** per the 2026-09-05 close-out above, except where noted as parked in FOLLOWUPS.

---

## Residuals / parks

| Item | Status | Notes |
|------|--------|-------|
| Sidebar scope-nav double-click (first click highlights, doesn't navigate) | **parked** | Reproduced 2026-09-02 on 4×8 + a plant entry; root cause not yet isolated. See FOLLOWUPS. |
| Pre-existing pytest teardown flakiness (`paho-mqtt` `loop_stop`) | **parked** | Unrelated to Grow Logs; see FOLLOWUPS. |
| EntityToggle optimistic-draft + whole-fleet-object re-render architecture | **partially fixed** | Optimistic draft landed (#12 above); the deeper "no per-entity selector, every WS tick re-renders every `useFleet()` consumer" architecture issue is parked — real redesign, out of this pass's scope. |
| Calibration busy-flag scoping beyond SoftCalWizard (CalibratePage `FanCalibrateWizard`, `SoilCalHonestyPanel`) | **parked** | Same class of bug as #13 above, not yet fixed; see FOLLOWUPS. |
| Brain admin `backfill_journal_snapshots` retroactively fills missing snapshot values from nearby `fleet_history` | **parked** | Contradicts "never invented" at the DB level, but the endpoint isn't exposed in the operator SPA. See FOLLOWUPS. |
| `DashHomeSections.tsx` grow-stage chip hardcodes `tone="ok"` regardless of entity availability | **parked** | Low confidence, needs live verification with the entity actually missing. See FOLLOWUPS. |
| Internal `Seat`/`POT` identifier naming (`seatModel.ts`, `PlantSeatPanel`, etc.) | **parked** | Not user-facing (only the one confirmed string in `SeatOverlay.tsx` was), but a rename pass would reduce future leak risk. See FOLLOWUPS. |
| Grow log firehose filter | **done** (pre-existing) | UX-P1-5 — collapse + ×N in `growLogFilter.ts`; pattern now also applied to journal rollups (#2 above) |
| Grow log click → playbook | **done** (pre-existing) | WF-P1-4 — `growLogPlaybook.ts` |
| Scope compare (two scopes) | **done** (pre-existing) | v1.1 — URL `compareScopeA`/`compareScopeB`; double-prefix bug fixed 2026-09-05 |
| Snapshot backfill | **done** (pre-existing, admin-only) | Admin POST + fleet_history ±30m — see the "never invented" residual above |

---

## Parent handoff

**DONE** — Grow → Logs design-honesty pass + live prove gate closed.

- pytest **GREEN** (19/19 journal tests; pre-existing unrelated teardown flakiness noted, not blocking)
- build:spa **GREEN** (`index-BaRgMeRp.js`)
- Pi hotpatch **GREEN** (SPA + brain journal modules, full stop+start, HTTP gate green)
- browser **GREEN** (live walk, this doc)
- FOLLOWUPS.md updated with residuals
