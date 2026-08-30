# Zigbee device tasks (universal path)

**Date:** 2026-08-30  
**Status:** in progress — operator path extended in [2026-08-30-zigbee-role-vs-task-operator-design.md](./2026-08-30-zigbee-role-vs-task-operator-design.md)  
**Depends on:** [2026-08-29-zigbee-roles-onboarding-design.md](./2026-08-29-zigbee-roles-onboarding-design.md)

## Problem

Role + Zone binding routes climate sensors into fleet consumers, but there is no product path to say: *when this Zigbee device is active, do this task* (OOS an appliance, force a relay, raise a critical Live banner, grow-log). Hardcoding one leak→dehum path would teach the wrong lesson.

## Goals

1. **Same path for every Zigbee device** after bind: optionally attach a curated **Task / Recipe**.
2. Ship the **framework once**; add recipes **one at a time** (no massive catalog dump).
3. First proving recipe: **dehumidifier tank full** → dehumidifier OOS + force relay off + MASSIVE critical banner; clear on dry only if policy-owned.
4. Unbound devices and bound devices with **no task** never drive actuators or banners.

## Non-goals

- Free-form IFTTT / multi-condition graphs
- Building every future recipe in this pass
- ZHA rewrite; cloud orchestrate; independent HVAC rooms

## Architecture

```text
Permit join → Unbound → Role+Zone bind (existing)
                         ↓
              optional Task/Recipe (new)
                         ↓
              MQTT state → policy evaluator
                         ↓
         actions: seat_oos | force_relay | critical_banner | grow_log
```

### SoT

- `zigbee_device_bindings` — unchanged (ieee → role/zone).
- `zigbee_device_policies` — ieee → `{ recipe_id, enabled, params }`.
- Recipe registry in code (`RECIPE_CATALOG`): id, label, when/clear conditions, default params, required role hints.
- Active banners on `fleet.system.critical_banners[]` for SPA.

### Action enum

| Action | Behavior |
|--------|----------|
| `seat_oos` | `upsert_inventory(seat, in_service=False)`; set `policy_owned_oos` flag for that seat/policy |
| `seat_restore` | restore in_service only if flag owned by this policy |
| `force_relay` | force Sonoff/main relay off or on (bypass OOS early-return when forcing off for safety) |
| `critical_banner` | upsert banner id into fleet critical_banners (full-width Live) |
| `grow_log` | `record_grow_log` |

### First recipe: `tank_full_appliance`

- **When active** (normalized wet/leak/contact ON): OOS `dehumidifier`, force relay off, banner “Dehumidifier tank FULL — empty tank”, grow-log.
- **When clear** (dry): clear banner; restore dehumidifier if policy-owned; grow-log.
- Role hint: `leak_tank` (new) or any leak-class; operator may bind first then pick recipe.

### Later recipes (FOLLOWUPS only this pass)

- `floor_flood_alert` — banner + grow-log only
- etc.

## API / SPA

- `GET /settings/zigbee/recipes`
- `GET/PUT /settings/zigbee/policies`
- Settings device row: **Task** select after Role/Zone (None + recipe list).
- Overview: full-width critical banner strip from `critical_banners`.

## Acceptance

- Any bound ieee can attach/clear a policy via API/Settings.
- Tank recipe: wet → OOS + banner; dry → clear if owned (unit tests + Pi evidence).
- Spec + FOLLOWUPS record “one recipe at a time” extension rule.
