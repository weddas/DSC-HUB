# Climate Mode + DSC-Probe Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship approved Climate Mode policy + Pi Follow Plants + probe/plant/assignment with real entity rename + SoftCal honesty.

**Architecture:** ESP owns policy select only (`Follow 4x8` / `Follow Plants` / `Custom` / `Off`). Pi owns Want intersection and writes `clone_*` numbers. Probe entities migrate `dsc_potN` → `dsc_probeN`. SoftCal uses Raw + ESP NVS one plane.

**Tech Stack:** ESPHome YAML (hub + panel), Python brain (`dsc_brain`), React SPA (`dsc_hub` frontend), SQLite history.

**Spec:** `docs/superpowers/specs/2026-08-29-climate-mode-probe-rebuild-design.md`

## Global Constraints

- Climate Mode options exactly: `Follow 4x8` · `Follow Plants` · `Custom` · `Off` (plus NVS migrator for Mother / Clones & Seedlings).
- Never stamp clone presets on unknown mode (fail-closed).
- `apply_clone_tent_automation` / Follow Plants must **never** write `select.dsc_hub_grow_stage`.
- Empty or inverted Want intersection → refuse write; hold last Custom; honesty chip.
- Probe rename **is** entity rename to `dsc_probeN_*` (operator override).
- One cal plane: SoftCal/lab → ESP NVS; zero HA offsets after push; gate `dual_cal_stack`.
- SoftCal averages Soil * Raw; ≥3 unique Modbus timestamps or “cached not σ”.
- Do not SoftCal N/P/K as independent channels.
- FlowSankey / Phase 0 soak stay deferred — do not couple.
- Hub+panel co-flash required for protocol bump; no hub-only ship.
- Deploy: prefer C: RepoRoot or sync spa→Y: before pack; `demo-fleet-seed.json` in Docker build context.

## File map

| Area | Files |
|------|--------|
| Taxonomy | Create `brain/dsc_brain/climate_mode.py`; mirror SPA `lib/climateMode.ts` |
| Clone automation | Modify `brain/dsc_brain/control_ops.py`, `stage_model.py` |
| Follow Plants | Create `brain/dsc_brain/follow_plants.py`; wire job in brain loop/API |
| Intersection | Port strictest-band from `frontend/.../tentWant.ts` into brain |
| Firmware hub | `firmware/v4/dsc-hub-v4_0.yaml` (`clone_mode`, `apply_clone_mode`, protocol, cal_session) |
| Firmware panel | panel vitals decode for CMODE (search repo for `CMODE` / `clone_mode_idx`) |
| SoftCal | `frontend/.../softCalibrate.ts`, `SoftCalWizard.tsx`; brain cal history |
| History | `brain/dsc_brain/history_ops.py`, `fleet_state.py` |
| Probe rename | ESP pot YAML, HA packages, brain maps, SPA `seatModel` / entities |
| Tests | `brain/tests/test_brain_pi.py`, new `test_follow_plants.py`, SPA smoke |

---

### Task 1: Kill grow_stage overwrite from clone automation

**Files:**
- Modify: `brain/dsc_brain/control_ops.py` (`apply_clone_tent_automation`)
- Modify: `brain/dsc_brain/stage_model.py` (`CLONE_MODE_BY_FAMILY` → policy taxonomy)
- Test: `brain/tests/test_brain_pi.py`

**Interfaces:**
- Consumes: `_seated_clone_recipe()`, `_hub_select_retry`, `_hub_is_online`
- Produces: `apply_clone_tent_automation()` return dict **without** `grow_stage` key on success path

- [ ] **Step 1: Write the failing test**

Add to `brain/tests/test_brain_pi.py`:

```python
def test_apply_clone_tent_never_writes_grow_stage(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    import asyncio
    from dsc_brain.control_ops import apply_clone_tent_automation
    from dsc_brain.fleet_state import FleetState, update_fleet_state

    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    update_fleet_state(FleetState(hub_online=True))  # adapt to real FleetState fields
    wrote: list[tuple[str, str]] = []

    async def fake_select(entity_id: str, option: str) -> None:
        wrote.append((entity_id, option))

    monkeypatch.setattr("dsc_brain.control_ops._hub_select_retry", fake_select)
    monkeypatch.setattr("dsc_brain.control_ops._hub_number", lambda *a, **k: asyncio.sleep(0))
    monkeypatch.setattr("dsc_brain.control_ops._hub_is_online", lambda: True)
    monkeypatch.setattr("dsc_brain.control_ops._control_state", lambda eid: "off" if "takeover" in eid else "")
    monkeypatch.setattr(
        "dsc_brain.control_ops._seated_clone_recipe",
        lambda: {"growth_stage": "Vegetative", "plant_name": "X", "tent": "2x4"},
    )
    result = asyncio.run(apply_clone_tent_automation())
    assert result.get("applied") is True
    assert "grow_stage" not in result
    assert all(e != "select.dsc_hub_grow_stage" for e, _ in wrote)
```

- [ ] **Step 2: Run test — expect FAIL** (grow_stage still written)

Run: `cd brain && python -m pytest tests/test_brain_pi.py::test_apply_clone_tent_never_writes_grow_stage -v`

- [ ] **Step 3: Remove grow_stage writes**

In `apply_clone_tent_automation`, delete the entire `if stage:` block that calls `_hub_select_retry("select.dsc_hub_grow_stage", ...)`.

- [ ] **Step 4: Run test — expect PASS**

- [ ] **Step 5: Commit**

```bash
git add brain/dsc_brain/control_ops.py brain/tests/test_brain_pi.py
git commit -m "fix(brain): stop clone automation from overwriting 4x8 grow_stage"
```

---

### Task 2: Shared Climate Mode taxonomy module

**Files:**
- Create: `brain/dsc_brain/climate_mode.py`
- Create: `homeassistant/custom_components/dsc_hub/frontend/src/lib/climateMode.ts`
- Modify: `brain/dsc_brain/stage_model.py` (import policy helpers; deprecate Mother/Clones mapping for automation)
- Test: `brain/tests/test_climate_mode.py`

**Interfaces:**
- Produces:
  - `CLIMATE_MODE_OPTIONS: tuple[str, ...] = ("Follow 4x8", "Follow Plants", "Custom", "Off")`
  - `migrate_legacy_clone_mode(raw: str) -> str`
  - `clone_mode_idx(mode: str) -> int | None`  # None = unknown
  - `is_external_targets_mode(mode: str) -> bool`  # Follow 4x8 | Follow Plants

```python
# brain/dsc_brain/climate_mode.py
from __future__ import annotations

CLIMATE_MODE_OPTIONS = ("Follow 4x8", "Follow Plants", "Custom", "Off")
_LEGACY = {
    "Clones & Seedlings": "Follow Plants",
    "Mother": "Custom",
    "Clones": "Follow Plants",
}

def migrate_legacy_clone_mode(raw: str) -> str:
    s = (raw or "").strip()
    if s in CLIMATE_MODE_OPTIONS:
        return s
    return _LEGACY.get(s, s)

def clone_mode_idx(mode: str) -> int | None:
    m = migrate_legacy_clone_mode(mode)
    try:
        return CLIMATE_MODE_OPTIONS.index(m)
    except ValueError:
        return None

def is_external_targets_mode(mode: str) -> bool:
    return migrate_legacy_clone_mode(mode) in ("Follow 4x8", "Follow Plants")
```

- [ ] Tests for migrate + idx + unknown → None
- [ ] SPA mirror exports same strings for Climate Mode select labels/tips
- [ ] Commit

---

### Task 3: Follow Plants intersection + job

**Files:**
- Create: `brain/dsc_brain/follow_plants.py`
- Modify: `brain/dsc_brain/control_ops.py` (call Follow Plants when mode is Follow Plants; stop mapping stage→Mother/Clones stamps)
- Modify: brain scheduler / API tick (find existing periodic job hook — `fleet` loop or `compose_ops` assign path)
- Test: `brain/tests/test_follow_plants.py`

**Interfaces:**
- Produces:
  - `intersect_bands(bands: list[tuple[float,float]]) -> tuple[float,float] | None`  # None if empty or min>max
  - `resolve_follow_plants_targets(plants: list[dict]) -> dict | None`  # numbers or None refuse
  - `async def apply_follow_plants() -> dict`  # writes clone numbers only; reason on refuse

Behavior:
- Collect 2×4 assigned plants (prefer `assigned_plant_id` when present; until rename, seat→roster join).
- Want from plant want sensors / stage rail (`STAGE_RAIL` copy matching `tentWant.ts`).
- Strictest intersection; refuse inverted/empty.
- Empty plants → `{"applied": False, "reason": "empty 2x4"}` — no ghost veg.
- On success write: `number.dsc_hub_clone_temp`, `clone_vpd_min/max`, `clone_rh_min/max`; optionally light hours; set photoperiod Independent unless all flower→Follow 4x8 photo (document in code comment).
- Schedule: 12h + on roster/sprout/assign.

- [ ] Failing tests: inverted refuse; empty refuse; happy path writes numbers not grow_stage
- [ ] Implement + pass
- [ ] Commit

---

### Task 4: Firmware Climate Mode policy + else-safe + NVS migrator

**Files:**
- Modify: `firmware/v4/dsc-hub-v4_0.yaml` — `clone_mode` options, boot idx sync (~101–112), `apply_clone_mode` (~3887–3927), vitals broadcast
- Modify: panel firmware (locate `CMODE` / idx clamp) + protocol version constant
- Docs: add `docs/qa/PANEL-HUB-COFLASH-CHECKLIST.md`

**apply_clone_mode target behavior:**

```cpp
if (m == "Off") { /* existing Off path; idx=3 after remap */ return; }
id(clone_active) = true;
if (m == "Follow 4x8") { id(clone_mode_idx) = 0; return; }
if (m == "Follow Plants") { id(clone_mode_idx) = 1; return; }  // no stamp
if (m == "Custom") { id(clone_mode_idx) = 2; return; }
// legacy one-shot migrator on boot only — not here for unknown
ESP_LOGW("clone", "Unknown Climate Mode '%s' — no stamp", m.c_str());
return;  // FAIL CLOSED — never else→Clones
```

Options list:

```yaml
options:
  - "Follow 4x8"
  - "Follow Plants"
  - "Custom"
  - "Off"
```

Boot: map legacy Mother/Clones strings → new options + idxs 0–3.

Protocol: bump version field used by panel; panel `clampi` / `CMODE_N[]` length 4 with new labels; paired flash checklist.

- [ ] Unit/script test or documented manual gate: unknown does not stamp
- [ ] Commit hub+panel+checklist together

---

### Task 5: Fix grow_stage Off clamp (panel + hub)

**Files:** panel decode of grow_stage option index; hub if any `clampi(0,10)`.

- [ ] Expand clamp to 0–11 (12 options including Off)
- [ ] Test / checklist item
- [ ] Commit

---

### Task 6: SoftCal honesty + history_ops deslop

**Files:**
- Modify: `homeassistant/custom_components/dsc_hub/frontend/src/lib/softCalibrate.ts`
- Modify: `SoftCalWizard.tsx`
- Modify: `brain/dsc_brain/history_ops.py` (map `soil_conductivity`; drop phantom-only `soil_ec` if entity absent)
- Create/Modify: brain soft-cal session history store + API
- Lab wet: find SPA callers of `script.dsc_potN_lab_wet_cal` → real `dsc_pots_apply_lab_wet_to_esp` or ESP path

**softCalibrate changes:**
- Read `sensor.dsc_potN_soil_*_raw` (then `dsc_probeN` after rename)
- Track Modbus `last_updated` uniqueness; if unique count < 3 → `cachedNotSigma: true`
- Commit path: push ESP NVS; zero HA offsets; abort if `dual_cal_stack`
- Exclude N/P/K from SoftCal channels

- [ ] Tests/smoke for unique sample count
- [ ] Commit

---

### Task 7: Firmware cal_session burst + ESP-NOW pause

**Files:** pot common + hub if needed — `firmware/v4` pot YAMLs / `DSC-Probe-common`

- Add `cal_session` switch/script: Modbus update_interval 2–5s for 30–60s; median/MAD diagnostic; restore 60s
- Flag/pause ESP-NOW soil publishes during session
- Temp co-read gate on capture
- Stamp `soil_cal_last` from SNTP when HA time invalid

- [ ] Commit with hub/panel protocol if vitals flag added

---

### Task 8: Probe entity rename + assignment model

**Files:** ESP pot device names/ids, HA packages, `brain/dsc_brain/*` entity maps, SPA `seatModel.ts` / SoftCal / fleet UI, SoftAP docs

- Introduce `assigned_plant_id` (roster | None) per probe
- Keep `idle_home` as dock only
- Migrate object_ids `dsc_potN_*` → `dsc_probeN_*`; collapse `dsc_pot_N` dual resolve
- Remint 0xD4 from roster via assignment
- Want/Got by plant id join
- Vacant = empty string
- Dual in_service: inventory → hub
- Peer MAD exclude probe_station / unassigned
- HelpTip Soft ≠ home ≠ tent ≠ retire
- SPA Climate Mode tip: Follow Plants vs Follow 4x8 vs Custom

- [ ] Migration script + soak notes in FOLLOWUPS
- [ ] Strip plant NVS after soak (Task 8b)
- [ ] Commit in logical chunks (brain maps → SPA → firmware friendly → unique_id migrate)

---

### Task 9: Deslop / ops leftovers

- Calibrate vs Learning: pick one commit model (document choice in FOLLOWUPS + delete loser path or gate)
- Docker `demo-fleet-seed.json` in build context
- Deploy note in `scripts/deploy-brain.ps1` or README: sync spa C:→Y:
- Archive lovelace = docs only (comment in FOLLOWUPS)
- Chart Got only if series exists

- [ ] Commit

---

### Task 10: Verification gates

- [ ] Tests from Tasks 1–3 green
- [ ] SoftCal unique-sample UI assertion
- [ ] Panel+hub co-flash checklist filled once before flash
- [ ] Re-run REL-P1-1/2/3 relationship audit; record in FOLLOWUPS
- [ ] Final commit: update FOLLOWUPS Pre-rebuild row → **in progress / done**

---

## Spec coverage checklist

| Spec item | Task |
|-----------|------|
| Policy-only clone_mode | 2, 4 |
| else-safe apply_clone_mode | 4 |
| Protocol + co-flash | 4, 10 |
| Kill grow_stage writes | 1 |
| Follow Plants job | 3 |
| Intersection refuse | 3 |
| Empty hold Custom | 3 |
| NVS Mother/Clones migrator | 4 |
| grow_stage Off clamp | 5 |
| Atomic photo | 3, 4 |
| SPA tip + taxonomy | 2, 8 |
| Probe/plant/assignment + entity rename | 8 |
| SoftCal / cal_session / one plane | 6, 7 |
| history_ops soil_conductivity | 6 |
| Lab wet / deslop / deploy | 6, 9 |
| Verification gates | 10 |

## Execution

Operator approved Act-On + full list → **Inline Execution** in this session (executing-plans), starting Task 1.
