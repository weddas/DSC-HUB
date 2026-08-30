# Zigbee policy honesty + floor flood alert

**Date:** 2026-08-31  
**Status:** approved  
**Extends:** [2026-08-30-zigbee-role-vs-task-operator-design.md](./2026-08-30-zigbee-role-vs-task-operator-design.md), [2026-08-30-zigbee-device-tasks-design.md](./2026-08-30-zigbee-device-tasks-design.md)  
**Closes FOLLOWUPS:** Policy problem vs raw wet in UI; next recipe `floor_flood_alert` (one only)

## Problem

1. Brain already stores `zigbee_policy_state[ieee].{active, problem, problem_when}` for bound Tasks, but Live/Climate do not surface **problem vs clear**. Operators debugging inverted polarity see only raw wet/dry (or nothing for safety rows).
2. Floor water needs the same Role → Task path as tank→OOS, but **banner + grow-log only** — no appliance seat or relay.
3. Two desk liquid sensors must cover **room** and **4×8** at once. `zigbee_by_role` is keyed by role id (last writer wins), so two devices cannot share a single `leak_floor` role without clobbering the Climate honesty row.

## Goals

1. Climate honesty: for each bound safety leak role, show **Wet/Dry** primary; when that ieee has Task ≠ `none` and policy state exists, add secondary **Problem/Clear** from `zigbee_policy_state.problem` (SPA must not re-derive from wet alone).
2. Add one recipe: `floor_flood_alert` — opposite-edge clear; params `problem_when` + `banner`; never OOS / force_relay.
3. Distinct floor roles so both desk sensors publish honesty rows: room and 4×8; catalog also includes **2×4** as a selectable space (no evidence bind required this pass).
4. Pi evidence: tank Task still shows wet + problem badge; both desk sensors bound as flood Tasks (room + 4×8) with wet→banner / dry→clear and no seat OOS.
5. Leave a clear extension path for **multiple sensors per space** later (not implemented this pass).

## Non-goals

- Sticky / dismiss banners; auto-timeout clear
- Additional recipes beyond `floor_flood_alert`
- Twin safety chips; Settings bind-row redesign beyond shared task-params
- Changing tank OOS semantics or inventing a free-form IFTTT graph
- Implementing multi-sensor-per-space now (catalog/roles stay one ieee per role id this pass; see extension below)

## Decisions (approved)

| Topic | Choice |
|-------|--------|
| Wet vs problem UI | **B** — Wet/Dry primary; Problem/Clear badge only when Task bound + policy state present |
| Flood banner clear | **A** — opposite edge only |
| Flood params | **B** — `problem_when` + `banner` |
| Architecture | Extend shared evaluator; no separate flood module |
| Live bind | Both desk sensors as flood: one room, one 4×8 |

## Architecture

```text
MQTT → normalize wet → by_role[safety_role] {wet, zone, …}
                    → evaluate_device_policies(ieee)
                         problem = f(wet, problem_when)
                         zigbee_policy_state[ieee]
                         edge → banner (+ optional seat OOS for tank only)

Climate Zigbee card
  climate rows (existing)
  safety rows: Wet/Dry + optional Problem/Clear from policy_state[ieee]
```

### Distinct floor roles

Add catalog roles (kind `safety`) — one **primary** slot per space this pass:

| id | label | Intended zone | This pass |
|----|-------|----------------|-----------|
| `leak_floor_room` | Water leak (floor · room) | `room` | Evidence bind (desk) |
| `leak_floor_4x8` | Water leak (floor · 4×8) | `4x8` | Evidence bind (desk) |
| `leak_floor_2x4` | Water leak (floor · 2×4) | `2x4` | Catalog + Settings only (future bind) |

Keep existing `leak_floor` as a generic safety role (still valid / Show-all). Recipe filters and SPA helpers (`isZigbeeSafetyLeakRole`) treat **all** `leak_floor*` ids as safety leak roles.

**Evidence bind (desk sensors):**

| ieee (from prior pair) | Role | Zone | Task |
|------------------------|------|------|------|
| `0xa4c1385a686af7df` or `0xa4c1380d734f2033` | `leak_floor_room` | `room` | `floor_flood_alert` |
| the other | `leak_floor_4x8` | `4x8` | `floor_flood_alert` |

Operator may swap which ieee maps to which role; both must be bound and live before close. Do **not** require a 2×4 bind for acceptance.

### Future: multiple sensors per space

This pass: one ieee per role id (`by_role[role]` last-writer-wins — unchanged).

Later (FOLLOWUPS / separate design), allow N sensors per space without one-off wiring:

1. **Preferred:** indexed role slots in catalog, e.g. `leak_floor_4x8`, `leak_floor_4x8_b`, `leak_floor_room_b` (same pattern as multi-height climate roles) — each keeps its own honesty row + `zb-policy-{ieee}` banner.
2. **Alternative:** `zigbee_by_role` safety values become lists keyed by ieee (bigger SPA/brain change).

Do not use zone alone to multiplex devices under one role id. Policies already evaluate **per ieee**, so multi-sensor banners work as soon as each ieee has a unique role (or list row) + Task.

### Recipe `floor_flood_alert`

| Field | Value |
|-------|--------|
| Label | Floor flood → alert |
| `device_classes` | `liquid`, `safety` |
| `suggested_roles` | `leak_floor_room`, `leak_floor_4x8`, `leak_floor_2x4`, `leak_floor` |
| Defaults | `problem_when: active`, `banner: "Floor water detected"`, `banner_tone: critical` |
| Params | `problem_when`, `banner` only |
| Problem edge | Upsert `zb-policy-{ieee}` critical banner + grow-log |
| Clear edge | Remove that banner only |
| Never | `seat_id`, inventory OOS, `force_relay` |

Polarity and edge detection stay in the shared `evaluate_device_policies` path (same as tank). Empty seat already skips OOS/relay in `_apply_active` / `_apply_clear`.

Default banner when polarity changes (SPA helper):

- `problem_when=active` → `Floor water detected`
- `problem_when=inactive` → `Floor dry alarm — check sensor` (operator may edit)

### Climate / Overview honesty

**Climate — Zigbee by role card**

- Keep climate temp/RH table as today.
- Add safety subsection or rows for bound `leak_*` roles from `zigbee_by_role`.
- Columns / chips: Role, Zone, Device, **Wet|Dry**, and if Task bound: **Problem|Clear**.
- Resolve ieee from `zigbee_device_bindings` (role → ieee) then read `zigbee_policy_state[ieee]`.
- No policy / recipe `none` → omit Problem/Clear chip (do not invent Clear).

**Overview**

- Critical banners unchanged (`critical_banners` SoT).
- Do not add a second conflicting wet collage; optional thin safety chips only if they mirror Climate SoT exactly (same wet + problem). Prefer Climate as the primary honesty surface this pass if Overview is already banner-heavy.

### Settings

- Task list includes `floor_flood_alert` for liquid/safety (+ Show all).
- Shared **task params** UI when recipe is `tank_full_appliance` **or** `floor_flood_alert`:
  - Always: Problem when, Banner
  - Tank only: Appliance (seat), force-relay stays in defaults server-side
- Unbound / No task still clears policy params.

## Acceptance

1. Unit: `floor_flood_alert` wet→banner, no inventory OOS; dry→clear; `problem_when=inactive` inverted; tank regressions green.
2. Unit/filter: new floor roles in safety filter; recipes filtered correctly.
3. SPA: Climate safety row shows Wet/Dry; with Task + policy state, Problem/Clear matches backend `problem`.
4. Pi: existing dehum tank Task still wet↔problem aligned with banner.
5. Pi: both desk sensors bound (`leak_floor_room` + `leak_floor_4x8`, zones `room`/`4x8`, Task `floor_flood_alert`); each wet→own banner; dry→that banner clears; dehumidifier/humidifier seats unchanged by flood edges.

## Out of scope / FOLLOWUPS

- Further recipes after this one
- Dismissible sticky flood banners
- Multi-sensor-per-space (indexed `*_b` roles or list-valued safety `by_role`) — path sketched above; implement when a second sensor is needed in the same space
- Live bind / evidence for `leak_floor_2x4` when hardware is placed in the 2×4 tent
