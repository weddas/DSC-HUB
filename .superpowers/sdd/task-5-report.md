# Task 5 Report — Hub failover temporary override + re-plan

**Status:** DONE  
**Branch:** `feat/brain-control-recovery-bar1`  
**Commit:** `bb8bfce` — `feat(brain): hub reconnect temporary override and re-assert TTL`  
**Runtime code changed:** yes

## What was done

Hub reconnect with manual takeover records a temporary override (TTL 900s); clear of takeover or TTL expiry clears override and forces Want→act when takeover is off. SPA shows override via HubLinkLine chip + Overview banner on `binary_sensor.dsc_brain_hub_override_active`.

### Steps completed (TDD)

1. **RED — Write failing tests**  
   Created `brain/tests/test_hub_failover.py` verbatim from the brief.

2. **RED — Run tests (expect FAIL)**  
   ```
   cd brain && python -m pytest tests/test_hub_failover.py -v
   ```
   **Evidence:** collection error  
   `ModuleNotFoundError: No module named 'dsc_brain.hub_failover'`  
   `ERROR tests/test_hub_failover.py` / `1 error in 0.22s`

3. **GREEN — Implement `hub_failover.py`**  
   - `HubOverride` dataclass: `active`, `forced`, `since_ts`  
   - `note_reconnect(snapshot, takeover, now)` — takeover → active override with forced snapshot; else inactive  
   - `should_reassert(..., ttl_sec=900)` — True when active and age ≥ TTL  
   - `evaluate_failover` — TTL or takeover clear → clear override + `force_reassert`  
   - `on_hub_reconnect` — only offline→online  
   - `emit_override_entity` → `binary_sensor.dsc_brain_hub_override_active`

4. **Wire**  
   - `esphome_client._apply_readings` hub path: reconnect → `note_reconnect` + grow log  
   - `decision_loop.decision_tick`: hold emit while override active; force Want→act on clear/TTL when takeover off  
   - `computed_ops`: emit binary; on `force_reassert` call `decision_tick`  
   - SPA: HubLinkLine `RECONNECT OVERRIDE` chip; Overview banner when binary on

5. **GREEN — Run tests (expect PASS)**  
   ```
   cd brain && python -m pytest tests/test_hub_failover.py -v
   ```
   **Evidence:**  
   `test_reconnect_with_takeover_sets_override PASSED`  
   `test_reconnect_without_takeover_no_override PASSED`  
   `2 passed in 0.03s`

6. **SPA build** — `npm.cmd run build:spa` success; bundle `index-fFZO7204.js`

7. **Commit** with brief message (no push).

## Self-review

| Brief requirement | Met |
|-------------------|-----|
| Exact HubOverride / note_reconnect / should_reassert signatures | yes |
| TTL default 900s | yes |
| Wire reconnect ingest → override → re-assert | yes |
| Emit `binary_sensor.dsc_brain_hub_override_active` | yes |
| SPA chip/banner | yes |
| TDD RED→GREEN + pytest PASS | yes |

## Concerns

1. ~~**TTL while takeover still ON** clears the temporary-override binary but does not emit commands~~ **FIXED** via sticky `pending_reassert` — later takeover clear forces Want→act.
2. **No scheduled decision tick** outside computed emit / API — re-assert on TTL depends on computed rebuild cadence (~cold/hot cache). Fine for Bar 1; a dedicated timer would be tighter.
3. **Module-global override state** is process-local (lost on brain restart) — acceptable for temporary override.

## Files touched

| Path | Action |
|------|--------|
| `brain/dsc_brain/hub_failover.py` | created |
| `brain/tests/test_hub_failover.py` | created |
| `brain/dsc_brain/decision_loop.py` | override hold + force re-assert |
| `brain/dsc_brain/esphome_client.py` | reconnect → note_reconnect |
| `brain/dsc_brain/computed_ops.py` | emit binary + re-assert tick |
| `frontend/.../HubLinkLine.tsx` | override chip |
| `frontend/.../DashHomeSections.tsx` | Overview banner |
| `frontend/spa-dist/*` | rebuilt bundle |
| `.superpowers/sdd/task-5-report.md` | this report |

---

## Important fix — sticky `pending_reassert` after TTL under takeover

**Status:** FIXED  
**Commit:** `fix(brain): sticky pending_reassert after TTL under takeover`

### Problem

TTL while takeover stayed ON cleared the override binary and returned `force_reassert` once, but emit was gated by takeover. After that, override was inactive with no sticky flag, so a later takeover clear never re-asserted Want→act.

### Fix

- `HubOverride.pending_reassert` sticky bit
- TTL under takeover → clear `active`, set `pending_reassert=True`, `force_reassert=False`
- Takeover clear with active **or** pending → clear sticky, `force_reassert=True`

### Test evidence

```
cd brain && python -m pytest tests/test_hub_failover.py -v
```

```
tests/test_hub_failover.py::test_reconnect_with_takeover_sets_override PASSED
tests/test_hub_failover.py::test_reconnect_without_takeover_no_override PASSED
tests/test_hub_failover.py::test_ttl_under_takeover_then_clear_forces_reassert PASSED
3 passed in 0.08s
```

New coverage: reconnect+takeover → wait >900s → clear takeover → `force_reassert` / `emit` true.
