# Brain Control Recovery (Bar 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore HA-era Want→Got→Need→act parity on Light / Climate / Overview plus hub offline manual takeover and reconnect re-plan, so the SPA never invents a third control story.

**Architecture:** Pi brain is the single control SoT (faithful port of HA package loops, then free to advance). Hub streams sensors and obeys commands online; offline operator forces devices; reconnect pushes snapshot + takeover → temporary override → brain re-plans. SPA binds Live pages to brain-emitted entities only. Two tents share one duct/exhaust/intake plant.

**Tech Stack:** Python brain (`brain/dsc_brain/`), pytest (`brain/tests/`), React SPA (`homeassistant/custom_components/dsc_hub/frontend/`), HA package YAMLs as golden reference (`homeassistant/packages/dsc_v4_*.yaml`), Pi deploy hot-patch.

**Spec:** `docs/superpowers/specs/2026-08-29-brain-control-recovery-design.md` (approved)

**Out of this plan (Bar 2 — separate plan after Bar 1 ships):** plant↔probe assign/move/detach. Full P0–P3 irrigation stack. AI. Twin WebGL as control.

## Global Constraints

- Two tents (4x8 main + 2x4 clone), **one shared** ducting / exhaust / intake — never two isolated HVAC rooms.
- SPA must not compute Got/ON/hours from a different entity than the brain control path.
- Twin / 3D / Overview chrome = **projection of brain SoT** or honest empty / gated.
- Prefer honest empty over fake channels.
- No dual-run HA + brain as equal controllers.
- Windows: use `npm.cmd` for SPA builds; PowerShell for git commits (no bash heredoc).
- Commit only when the user asks, unless a plan task step explicitly says to commit and the user chose plan execution.

## File map (Bar 1)

| Path | Responsibility |
|------|----------------|
| `docs/superpowers/research/2026-08-29-ha-vs-brain-control-inventory.md` | Gap list: HA package vs brain emitters |
| `brain/dsc_brain/light_loop.py` | Photoperiod / hours / ON SoT for 4x8 + 2x4 (new) |
| `brain/tests/test_light_loop.py` | Unit tests for schedule + Follow 4x8 inheritance |
| `brain/dsc_brain/computed_ops.py` | Emit light entities from `light_loop` |
| `brain/dsc_brain/hub_failover.py` | Link-down detection, override ingest, re-assert policy (new) |
| `brain/tests/test_hub_failover.py` | Override + re-plan tests |
| `brain/dsc_brain/decision_loop.py` / `api.py` | Wire failover into tick / reconnect |
| `frontend/src/lib/lightViewModel.ts` | Single SPA view-model for Light + Overview SF chip |
| `frontend/src/pages/LightPage.tsx` | Bind to view-model; kill contradictory chrome |
| `frontend/src/components/TentLightClock.tsx` | ON chip from same brightness/on SoT |
| `frontend/src/components/DashHomeSections.tsx` | RUNNING / SF1000 from same SoT |
| `frontend/src/pages/ClimatePage.tsx` | Demand tiles = brain command + hub ack honesty |
| `docs/qa-screenshots-*/` | Bar 1 evidence after Pi verify |

---

### Task 1: HA vs brain control inventory

**Files:**
- Create: `docs/superpowers/research/2026-08-29-ha-vs-brain-control-inventory.md`
- Read (do not rewrite yet): `homeassistant/packages/dsc_v4_light_helpers.yaml`, `dsc_v4_core_helpers.yaml` (expected light hours), `dsc_v4_automations.yaml` (auto photoperiod), `brain/dsc_brain/computed_ops.py`, `brain/dsc_brain/dash_computed.py`, `brain/dsc_brain/hub_controls.py`, `frontend/src/pages/LightPage.tsx`, `frontend/src/lib/lightSchedule.ts`

**Interfaces:**
- Produces: markdown table rows `{entity_id, ha_source, brain_source, spa_consumer, gap}` for every light/climate/demand entity LightPage + Overview RUNNING use

- [ ] **Step 1: Extract HA light entity definitions**

From `dsc_v4_light_helpers.yaml` and related packages, list at least:
`sensor.dsc_lights_on_today_2x4`, `sensor.dsc_lights_on_today_4x8`, `sensor.dsc_clone_expected_light_hours`, `sensor.dsc_expected_light_hours`, `sensor.dsc_lights_deviation_today`, `switch.dsc_hub_auto_photoperiod`, `time.dsc_hub_lights_on_time`, `select.dsc_hub_clone_photoperiod`, `light.dsc_hub_sf1000_dimmer`, `binary_sensor.dsc_hub_4x8_window_open`.

- [ ] **Step 2: Trace brain emitters**

Grep `brain/dsc_brain` for each entity id. Mark `emitted` / `passthrough hub` / `missing`.

- [ ] **Step 3: Trace SPA consumers**

For LightPage + DashHomeSections RUNNING/SF chip, note which entity each chip/gauge reads.

- [ ] **Step 4: Write inventory doc**

Use this structure:

```markdown
# HA vs brain control inventory (2026-08-29)

## Light / photoperiod
| entity | HA package | brain today | SPA | gap |
|--------|------------|-------------|-----|-----|
| ... | ... | ... | ... | ... |

## Climate / demand / shared air
| entity | ... |

## Manual takeover / link
| entity | ... |

## Priority gaps for Bar 1
1. ...
```

- [ ] **Step 5: Stop for review**

Do not change runtime code in this task. User or lead reviews inventory before Task 2.

---

### Task 2: Brain `light_loop` — single photoperiod SoT

**Files:**
- Create: `brain/dsc_brain/light_loop.py`
- Create: `brain/tests/test_light_loop.py`
- Modify: `brain/dsc_brain/computed_ops.py` (call emit from light_loop)

**Interfaces:**
- Produces:
  - `dataclass LightLoopSnapshot` with fields: `main_on_time: str | None`, `main_want_hours: float | None`, `clone_mode: str`, `clone_follows_main: bool`, `clone_want_hours: float | None`, `sf_on: bool`, `sf_brightness: float | None`, `got_hours_2x4: float | None`, `got_hours_4x8: float | None`, `deviation_2x4: float | None`, `schedule_valid: bool`, `honesty: str`
  - `def build_light_loop(*, helpers: dict, hub_values: dict, now_ts: float) -> LightLoopSnapshot`
  - `def emit_light_loop(states, snapshot, set_entity) -> None`
- Consumes: helper values for `time.dsc_hub_lights_on_time`, `select.dsc_hub_clone_photoperiod`, `switch.dsc_hub_auto_photoperiod`, hub `light_delivered_hours` / SF dimmer state as available

- [ ] **Step 1: Write failing tests**

```python
# brain/tests/test_light_loop.py
from dsc_brain.light_loop import build_light_loop


def test_follow_4x8_inherits_main_schedule():
    snap = build_light_loop(
        helpers={
            "time.dsc_hub_lights_on_time": "18:00:00",
            "select.dsc_hub_clone_photoperiod": "Follow 4x8",
            "switch.dsc_hub_auto_photoperiod": "on",
            "number.dsc_hub_min_dark_hours": "12",
            "sensor.dsc_expected_light_hours": "12",
        },
        hub_values={"sf1000_on": True, "sf1000_brightness": 0.0},
        now_ts=0.0,
    )
    assert snap.clone_follows_main is True
    assert snap.schedule_valid is True
    assert snap.sf_on is True
    # brightness 0 with on=True must still be represented honestly in snapshot
    assert snap.sf_brightness == 0.0


def test_missing_main_on_time_invalidates_follow_schedule():
    snap = build_light_loop(
        helpers={
            "time.dsc_hub_lights_on_time": "",
            "select.dsc_hub_clone_photoperiod": "Follow 4x8",
            "switch.dsc_hub_auto_photoperiod": "on",
        },
        hub_values={},
        now_ts=0.0,
    )
    assert snap.schedule_valid is False
    assert "no schedule" in snap.honesty.lower() or "unset" in snap.honesty.lower()


def test_independent_clone_does_not_claim_follow():
    snap = build_light_loop(
        helpers={
            "time.dsc_hub_lights_on_time": "18:00:00",
            "select.dsc_hub_clone_photoperiod": "Independent",
            "number.dsc_hub_clone_light_hours": "18",
        },
        hub_values={},
        now_ts=0.0,
    )
    assert snap.clone_follows_main is False
```

- [ ] **Step 2: Run tests — expect FAIL**

Run: `cd brain && python -m pytest tests/test_light_loop.py -v`  
Expected: import or missing symbol failures

- [ ] **Step 3: Implement `light_loop.py`**

Implement `build_light_loop` / `emit_light_loop` so:
- Follow 4x8 ⇒ clone want hours = main want hours; schedule invalid if main on-time missing
- Independent ⇒ clone hours from `number.dsc_hub_clone_light_hours`
- `sf_on` / `sf_brightness` from hub_values (never invent ON from hours gauge)
- `deviation_2x4 = got - want` only when both finite; else leave None (SPA shows —)

Emit (via `set_entity`) at least: existing sensor ids for got/want/deviation when values exist; add attribute `honesty` on schedule-related sensors.

- [ ] **Step 4: Wire into `computed_ops`**

Call `build_light_loop` + `emit_light_loop` from the computed emit path (same place other sensors are set). Do not leave LightPage reading stale HA-only math that brain never updates.

- [ ] **Step 5: Run tests — expect PASS**

Run: `cd brain && python -m pytest tests/test_light_loop.py -v`  
Expected: PASS

- [ ] **Step 6: Commit** (when executing this plan with user approval to commit)

```
feat(brain): light_loop SoT for photoperiod Follow 4x8 and SF state
```

---

### Task 3: SPA `lightViewModel` — one story for Light + Overview

**Files:**
- Create: `homeassistant/custom_components/dsc_hub/frontend/src/lib/lightViewModel.ts`
- Create: `homeassistant/custom_components/dsc_hub/frontend/src/lib/lightViewModel.test.ts` (or extend existing smoke pattern if no vitest — then add pure functions tested via `npx --yes tsx` script mirroring `seatApi.smoke.ts`)
- Modify: `frontend/src/pages/LightPage.tsx`
- Modify: `frontend/src/components/TentLightClock.tsx`
- Modify: `frontend/src/components/DashHomeSections.tsx` (SF / RUNNING chip)

**Interfaces:**
- Consumes: `state`/`num`/`entity` bus + entities from Task 2
- Produces:
  - `type LightDeskModel = { sfOn: boolean; sfBrightness: number | null; headerLabel: string; scheduleValid: boolean; scheduleHonesty: string; wantHours: number | null; gotHours: number | null; deviationHours: number | null; followsMain: boolean; autoPhotoperiod: boolean; manualHold: boolean }`
  - `function buildCloneLightDesk(bus): LightDeskModel`
  - Rule: `headerLabel` is `"SF1000 ON"` only if `sfOn && (sfBrightness == null || sfBrightness > 0)`; if `sfOn && sfBrightness === 0` use `"SF1000 ON · 0%"`; if `!sfOn` use `"SF1000 OFF"`
  - Rule: timeline “NO SCHEDULE” only if `!scheduleValid`; never if `followsMain && scheduleValid`

- [ ] **Step 1: Write failing unit checks**

```typescript
// lightViewModel.test.ts — run with tsx assert style
import assert from "node:assert/strict";
import { headerSfLabel } from "./lightViewModel";

assert.equal(headerSfLabel({ sfOn: true, sfBrightness: 80 }), "SF1000 ON");
assert.equal(headerSfLabel({ sfOn: true, sfBrightness: 0 }), "SF1000 ON · 0%");
assert.equal(headerSfLabel({ sfOn: false, sfBrightness: 0 }), "SF1000 OFF");
```

- [ ] **Step 2: Implement view-model + wire LightPage**

Replace ad-hoc `lightOn` header chip and Got/Want/Deviation KPIs with `buildCloneLightDesk`. PhotoperiodTimeline must receive `scheduleValid` from the model. DutyStrip remains actual history — keep, but label it “Actual” only when history exists.

- [ ] **Step 3: Wire Overview SF chip**

In `DashHomeSections.tsx`, SF RUNNING chip must use the same `headerSfLabel` / on+brightness rule (import from `lightViewModel`).

- [ ] **Step 4: Build SPA**

Run: `npm.cmd run build:spa` in `homeassistant/custom_components/dsc_hub/frontend`  
Expected: success; note new `index-*.js` hash

- [ ] **Step 5: Commit**

```
fix(spa): single light view-model for Light page and Overview SF chip
```

---

### Task 4: Climate + Overview shared-air honesty

**Files:**
- Modify: `frontend/src/pages/ClimatePage.tsx`
- Modify: `frontend/src/components/DashHomeSections.tsx`
- Modify: `frontend/src/lib/sensorHonesty.ts` (only if needed for shared-air gaps)
- Read: `brain/dsc_brain/climate_mode.py`, `follow_plants.py`

**Interfaces:**
- Produces: Overview fan row + RUNNING chips read the same demand entities Climate toggles write; banner when `switch.dsc_hub_manual_takeover` is on

- [ ] **Step 1: Document entity pairs** in a short comment block at top of DashHomeSections RUNNING map: each chip → `switch.dsc_hub_*_demand` or light entity

- [ ] **Step 2: Manual takeover banner on Overview + Climate**

When `switch.dsc_hub_manual_takeover === "on"`, show one banner: “Manual takeover — brain will re-plan on clear/reconnect” (not a second status language).

- [ ] **Step 3: Fan % chips**

Ensure IN 4x8 / IN 2x4 / EX ROOM / EX OUT use brain/hub fan pct entities already on the bus; if unavailable show muted “—” not green 0 theater.

- [ ] **Step 4: Build + commit**

```
fix(spa): Overview/Climate shared-air chips match demand SoT
```

---

### Task 5: Hub failover — temporary override + re-plan

**Files:**
- Create: `brain/dsc_brain/hub_failover.py`
- Create: `brain/tests/test_hub_failover.py`
- Modify: `brain/dsc_brain/decision_loop.py` and/or `api.py` reconnect / fleet ingest path
- Modify: SPA `HubLinkLine.tsx` or Climate banner (surface override state)

**Interfaces:**
- Produces:
  - `dataclass HubOverride = { active: bool, forced: dict[str, str], since_ts: float }`
  - `def note_reconnect(snapshot: dict, takeover: bool, now: float) -> HubOverride`
  - `def should_reassert(override: HubOverride, now: float, *, ttl_sec: float = 900) -> bool`
  - Policy (locked for Bar 1): TTL **900s** OR explicit clear of `switch.dsc_hub_manual_takeover` → re-assert. Both clear the temporary override.
- Consumes: existing `manual_takeover` flag in `decision_loop`

- [ ] **Step 1: Failing tests**

```python
from dsc_brain.hub_failover import note_reconnect, should_reassert

def test_reconnect_with_takeover_sets_override():
    o = note_reconnect({"sf1000": "on"}, takeover=True, now=1000.0)
    assert o.active is True
    assert should_reassert(o, now=1000.0, ttl_sec=900) is False
    assert should_reassert(o, now=1000.0 + 901, ttl_sec=900) is True

def test_reconnect_without_takeover_no_override():
    o = note_reconnect({}, takeover=False, now=1000.0)
    assert o.active is False
```

- [ ] **Step 2: Implement + wire**

On hub reconnect API/fleet path, call `note_reconnect`. While override active, decision loop may hold off full re-assert until TTL/clear; then force Want→act tick. Emit `binary_sensor.dsc_brain_hub_override_active` for SPA.

- [ ] **Step 3: SPA shows override**

Chip or banner when override binary is on.

- [ ] **Step 4: pytest PASS + commit**

```
feat(brain): hub reconnect temporary override and re-assert TTL
```

---

### Task 6: Pi Bar 1 verification

**Files:**
- Evidence: `docs/qa-screenshots-2026-08-29/bar1-light-*.png`, `bar1-overview-*.png`, `bar1-climate-*.png`
- Update: `docs/FOLLOWUPS.md` with Bar 1 result rows
- Use skill: `.cursor/skills/dsc-spa-pi-verify/SKILL.md` if present

- [ ] **Step 1: Hot-patch** SPA `spa-dist` + brain modules to Pi `192.168.86.48` (existing pscp/plink pattern); avoid hung restart where possible

- [ ] **Step 2: Light acceptance**

Hard-reload Light. Confirm:
1. No Follow 4x8 + “NO SCHEDULE” when `time.dsc_hub_lights_on_time` is set  
2. Header SF label matches dimmer on + brightness  
3. Got / Want / Deviation from same sensors (no free-floating 0–24 lie)  
4. Screenshots saved

- [ ] **Step 3: Overview acceptance**

SF / MAT / fans agree with Climate/Light for same tick; manual takeover banner if on.

- [ ] **Step 4: Failover smoke**

If safe: toggle manual takeover on Climate; confirm banner; clear; confirm override clears (or wait TTL in lab only).

- [ ] **Step 5: FOLLOWUPS + commit docs**

```
docs: Bar 1 Pi verify evidence for brain control recovery
```

---

## Spec coverage checklist

| Spec requirement | Task |
|------------------|------|
| Brain SoT / restore-then-advance | 1–2 |
| Light parity / no contradictory chrome | 2–3, 6 |
| Overview / Climate shared entities | 4, 6 |
| Shared duct topology | 4 (fan plant), inventory |
| Hub offline manual takeover + reconnect re-plan | 5–6 |
| Premium: 3D/Overview as projection | 3–4 (no twin work) |
| Bar 2 plant↔probe | **Deferred** — next plan |
| AI / advanced brain | Deferred |

## After Bar 1

Write `docs/superpowers/plans/2026-08-29-plant-probe-lifecycle.md` (Bar 2) only after Task 6 passes.
