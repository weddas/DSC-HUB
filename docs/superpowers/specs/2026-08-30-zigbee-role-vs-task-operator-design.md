# Zigbee Role vs Task — operator path (liquid level + datapoints)

**Date:** 2026-08-30  
**Status:** approved  
**Extends:** [2026-08-30-zigbee-device-tasks-design.md](./2026-08-30-zigbee-device-tasks-design.md)  
**Depends on:** [2026-08-29-zigbee-roles-onboarding-design.md](./2026-08-29-zigbee-roles-onboarding-design.md)

## Problem

Operators need one Settings path for every Zigbee device, covering both:

1. **Datapoint only** — e.g. temp/RH on Canopy 4×8 feeds existing climate automations (Want→Got), with **no** OOS/banner/relay.
2. **Act on a condition** — e.g. liquid sensor → humidifier empty or dehumidifier full → appliance OOS + honest banner.

The first proving recipe hard-coded dehumidifier + “wet = problem.” Operators must choose **how their device works** (polarity), **which appliance**, and **banner copy**. A second physical scenario (humidifier empty) must not become a one-off wire.

## Goals

1. **Role** routes data into fleet consumers (canopy, climate by_role, safety status). Role alone never runs Task actions.
2. **Task** is optional. **No task** = report/consume only.
3. One curated liquid Task with **operator params**: appliance, problem polarity, editable banner.
4. Same path for dehum-full and humid-empty; migrate existing `tank_full_appliance` bindings without re-pair.
5. Unbound devices never steal canopy or drive actuators.
6. **Role, Zone, and Task selects are filtered by device capability** so a temp/RH sensor offers climate placements (canopy / intake / exhaust / room / heights), not liquid OOS tasks by default — and a liquid sensor offers tank/floor roles + liquid tasks, not canopy.

## Non-goals

- Free-form IFTTT / multi-condition graphs / arbitrary MQTT rules
- Dumping a large recipe catalog in one pass (later recipes still one-at-a-time, e.g. floor flood = banner-only)
- Replacing Role catalog or climate Follow Plants logic
- Requiring a Task for climate sensors
- Inventing a free-form “height cm” field in this pass — heights are expressed as **distinct Roles** (canopy / intake / exhaust / room / clone dome), not one role with N clones

## Operator model (Settings → Zigbee)

```text
Permit join → device row (Unbound)
       ↓
  Infer capability class from z2m exposes / model
       ↓
  Role + Zone + Task selects = filtered lists for that class
       ↓
  Save roles & tasks
```

### Capability class (from device)

Derived server-side (and echoed on devices API) from Zigbee2MQTT `definition.exposes` + recent state keys:

| Class | Signals (any of) | Role kinds offered | Tasks offered |
|-------|------------------|--------------------|---------------|
| `climate` | temperature, humidity | `climate` (+ Unbound) | **No task** only (v1) |
| `liquid` / safety | water_leak, leak, moisture; also occupancy when operator has used as liquid (see note) | `safety` leak_tank, leak_floor (+ Unbound) | No task + Liquid level → appliance OOS |
| `plug` | state/switch on plug | `plug` | No task (+ later plug recipes) |
| `other` | none of the above | Unbound + full catalog behind **Show all** | No task + any recipe behind **Show all** |

**Mis-fingerprint escape:** Settings row always has **Show all roles / tasks** (collapsed). Needed for SNZB-03-fingerprinted liquid sensors that only expose `occupancy` — class may look like motion; operator opens full lists and picks `leak_tank` + liquid Task.

**Occupancy-only devices:** default class `motion` → roles none useful / Unbound + Show all. Once bound to `leak_tank` with liquid Task, treat as liquid for that ieee (sticky override in policy or binding `capability_override`).

### Filtered selects

- **Role** — selectable list of roles whose `kind` matches device class (plus Unbound). Example temp sensor: Canopy 4×8, Canopy 2×4, Intake, Exhaust, Room / ambient, Clone dome — so the operator can place sensors at different tent heights/positions without seeing Pump plug or Tank leak.
- **Zone** — selectable list relevant to that role/class: climate → `4x8` / `2x4` / `room` / `shared`; safety → same zone set (tank may be 4x8); default zone prefilled from role hint (canopy_4x8 → 4x8).
- **Task** — selectable list of recipes whose `suggested_roles` / `device_classes` intersect this device (plus No task). Temp sensor: only No task. Liquid: No task + Liquid level → appliance OOS.

One role per consume slot still applies (two devices on `canopy_4x8` → CONFLICT chip). Multiple heights = **different roles** (e.g. canopy + intake + exhaust), not duplicate canopy rows.

### Walkthrough A — Temp on intake (datapoint)

1. Permit join; pair temp/RH.
2. Role list shows climate placements only → pick **Intake** · Zone **4×8** · Task **No task**.
3. Save → feeds `zigbee_by_role.intake` for existing automations; no OOS.

### Walkthrough A2 — Multiple heights in one tent

1. Pair three climate sensors.
2. Assign **Canopy 4×8**, **Intake**, **Exhaust** (each from the climate-filtered Role list) · Zone **4×8** · Task **No task**.
3. Climate page shows each by role; canopy consumer still prefers canopy_4x8 for Want→Got canopy slot.

### Walkthrough B — Humidifier empty → OOS

1. Permit join; pair liquid sensor (or Show all if mis-fingerprinted).
2. Role list shows safety: **Tank / reservoir leak** · Zone as appropriate.
3. Task list shows **Liquid level → appliance OOS** (+ No task).
4. Params: **Appliance** = humidifier · **Problem when** = Dry / inactive · **Banner** editable.
5. Save.

### Walkthrough C — Dehumidifier full (existing kit)

Same Task. **Appliance** = dehumidifier · **Problem when** = Wet / active · **Banner** default FULL copy.
## Software shape

### Role vs Task (invariant)

| Layer | Setting | Effect |
|-------|---------|--------|
| Binding | `zigbee_device_bindings` role/zone/enabled | Routes MQTT into `zigbee_by_role` / canopy / safety `wet` display |
| Policy | `zigbee_device_policies` recipe + params | Only if `recipe_id` ≠ `none`: evaluate and act |

Evaluator must not run actuator actions when recipe is `none` or unbound. Climate Roles with No task remain datapoints only.

### Recipe: generalize liquid level

**Keep recipe id** `tank_full_appliance` for migration; change catalog **label** to “Liquid level → appliance OOS” (description notes full/empty via polarity). Do not introduce a second recipe id for humidifier empty.

| Param | Values | Notes |
|-------|--------|--------|
| `seat_id` | `dehumidifier` \| `humidifier` (allow-list of demand seats) | Operator **Appliance** |
| `problem_when` | `active` \| `inactive` | Operator **Problem when** — how *this* device works |
| `force_relay` | `off` (default) | Safety: problem → force off |
| `banner` | string | Operator-editable; template default from seat + polarity |
| `banner_tone` | `critical` (default) | |

Default params for new attachments: `seat_id=dehumidifier`, `problem_when=active`, template FULL banner (preserves today’s dehum behavior).

**Evaluate:**

1. `raw = normalize_binary_active(payload)` (`water_leak`… then `occupancy` as today).
2. If `raw is None`: no-op.
3. `problem = raw if problem_when == "active" else (not raw)`.
4. On problem edge → OOS seat, force relay, upsert banner, own OOS, grow-log.
5. On clear edge → clear banner; restore seat only if policy-owned.

### Settings SPA

Device row columns: Device · Model · Status · **Role** · **Zone** · **Task**.

Each of Role / Zone / Task is a **\<select\>** (or equivalent) populated from **filtered** options for that row’s capability class — not the full global dump. Link/control: **Show all** to reveal the unfiltered catalogs (power users / mis-fingerprint).

When Task = liquid-level recipe, show inline (or expand) controls:

- Appliance select  
- Problem when: Wet/active = problem | Dry/inactive = problem  
- Banner text field (prefilled from template; dirty until Save)

When Task = No task: hide those controls; clear policy recipe to `none` on Save.

Help copy (short): *Role is where this sensor lives (intake, canopy, tank…). Task is optional action — leave No task to only report into Live/Climate.*

### API

Unchanged endpoints; policies payload carries params:

```json
{
  "0x…": {
    "recipe_id": "tank_full_appliance",
    "enabled": true,
    "params": {
      "seat_id": "humidifier",
      "problem_when": "inactive",
      "force_relay": "off",
      "banner": "Humidifier EMPTY - refill",
      "banner_tone": "critical"
    }
  }
}
```

`GET /settings/zigbee/recipes` exposes param schema / allowed seats / defaults / `device_classes` (or `suggested_roles`) so SPA can filter Tasks.

`GET /settings/zigbee/devices` (or roles payload) includes per-device `capability_class` plus optional `capability_override` so lists stay honest after Show-all binds.

### Migration

Existing ieee with `tank_full_appliance` and empty/partial params → defaults `seat_id=dehumidifier`, `problem_when=active`, existing banner string. Live dehum tank binding stays valid without re-pair.

### Honesty

- Banner text must match polarity (no “FULL” when problem_when is dry/empty).
- Overview critical banner from `critical_banners` only.
- Safety role row may show raw wet + whether policy considers problem active.

## Acceptance

1. Operator can bind a climate sensor Role + No task and see it drive canopy/climate with zero Task side effects (unit or Pi check).
2. Temp/RH device Role select offers climate placements (including intake / canopy / exhaust for multi-height) and does **not** list liquid OOS Task unless Show all.
3. Operator can bind a second liquid sensor: humidifier + dry=problem + custom banner → empty OOS/banner; wet clears if owned.
4. Existing dehum tank ieee still works after migration defaults; Show all still available for occupancy-fingerprinted liquid sensors.
5. Spec documents Role-only vs Task + capability-filtered selects; FOLLOWUPS keeps later recipes one-at-a-time.

## Out of scope this design (FOLLOWUPS)

- `floor_flood_alert` and other recipes  
- Continuous height (cm) field / N sensors sharing one role id  
- Auto-suggest Task from Role (nice-to-have)  
- Motion-class recipes