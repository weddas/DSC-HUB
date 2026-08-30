# Zigbee roles + onboarding design

**Date:** 2026-08-29  
**Status:** approved (plan Sec1 lock)  
**Stack:** zigbee2mqtt:2 + Mosquitto + Nabu Casa SkyConnect — **not** ZHA

## Problem

Zigbee is a stub, not a product path ([docs/qa/ZIGBEE-AUDIT-7.1.md](../../qa/ZIGBEE-AUDIT-7.1.md)). Radio often DOWN (`HOST_FATAL_ERROR` / adapter mismatch). Settings can list devices and free-text placements, but there is no role model, and the first T/RH payload can silently own `fleet.canopy`. Growers cannot reliably: permit join → see a new device → assign what it is for → have Climate/Overview/Twin consume it.

## Goals

1. Coordinator **RADIO UP** on SkyConnect (`adapter: ember`; EmberZNet 7.4.x if policy B escalates after measured failure).
2. Operator flow: **Permit join** (`{"time": N}`) → device appears **Unbound** → assign **Role + Zone** → Brain routes MQTT into role consumers.
3. **Unbound** devices never write canopy/climate fleet slots.
4. Ops runbook covers USB CDC-ACM path, flasher, ember config, and the bind flow.

## Non-goals

- Migrating to ZHA or dual-running ZHA + z2m
- Factory-reset of the Zigbee network without explicit operator OK
- Shipping Brain consumers for plugs/buttons/CO2/lux/leak in v1 (catalog rows only)
- Modeling 4×8 and 2×4 as independent HVAC rooms

## Architecture

```text
SkyConnect USB ──► dsc-hub-z2m (ember)
                      ▼ MQTT zigbee2mqtt/#
                 Mosquitto
                      ▼
                 ZigbeeMqttIngest
                      │  zigbee_device_bindings (ieee → role/zone)
                      ▼
                 system.zigbee_by_role + selective fleet.canopy
                      ▼
                 Settings / Climate / Overview / Twin
```

## Data model

Setting key `zigbee_device_bindings` (JSON object, **ieee-keyed**):

```json
{
  "0x00124b001234abcd": {
    "role": "canopy_4x8",
    "zone": "4x8",
    "alias": "Canopy main",
    "enabled": true,
    "friendly_name": "0x00124b001234abcd"
  }
}
```

- Bindings follow **ieee** (stable). Friendly name may change in z2m.
- One ieee → one role. Two devices claiming the same role: last save wins; Settings shows a **conflict** chip.
- Zones: `4x8` | `2x4` | `room` | `shared` (drive SoftCal / global_modifiers T/RH offsets).
- Migrate legacy `zigbee_placements` (friendly_name → label) on read when ieee is known; stop treating placements-only as SoT.

## Role catalog

### v1 bind + consume

| role | Consumer |
|------|----------|
| `canopy_4x8` | `fleet.canopy` (preferred); `sensor.dsc_canopy_*`; `sensor.dsc_zigbee_canopy_4x8_*` |
| `canopy_2x4` | clone canopy path; may fill `fleet.canopy` only if no `canopy_4x8` |
| `intake` | by-role entities; Climate diagnostic |
| `exhaust` | by-role entities |
| `room` | room baseline |
| `clone_dome` | clone microclimate |

Default for new devices: **unbound** (listed only).

### Catalog-only until a later wave has a consumer

`plug_backup_dehum`, `plug_pump`, `plug_dosing`, `plug_fan_aux`, `meter_wall`, `button_override`, `presence_room`, `co2_tent`, `lux_canopy`, `soil_moisture_*`, `door_tent`.

**2026-08-30 device-tasks wave:** `leak_tank` (and optional `leak_floor`) are no longer forever catalog-only — they feed `zigbee_by_role` safety rows and the universal Task/Recipe path (`docs/superpowers/specs/2026-08-30-zigbee-device-tasks-design.md`). First recipe: `tank_full_appliance`. Add further recipes one at a time.

## Canopy / ingest rules

1. Missing binding → status **Unbound**; state under `zigbee_device_states` only.
2. On bind → map ieee/friendly_name → role; update `system.zigbee_by_role[role]`.
3. **Only** `canopy_4x8` / `canopy_2x4` write `fleet.canopy` (prefer 4x8; else 2x4; else leave empty). Never steal from unbound T/RH.
4. `to_hass_states` publishes `sensor.dsc_zigbee_<role>_temperature|_humidity` for enabled climate binds with data.
5. Kill legacy “first temperature/humidity seen wins” aggregate.

## Operator process

1. RADIO UP required → Permit join (~2 min) → put hardware in pair mode.
2. Device row appears (poll while JOIN OPEN).
3. Set **Role** + **Zone** (+ optional alias) → Save binding.
4. Next MQTT state **or Save bindings** fills that role’s fleet/Climate/Twin consumers (Save re-applies cached device states immediately).
5. Optional **Task / Recipe** (Settings Task column) — curated actions when the device is active; see device-tasks design. Unbound or “No task” never drives actuators/banners.

## API / SPA

- `GET /settings/zigbee/devices` — enrich with `binding`, `status` (`unbound`|`bound`|`conflict`), optional `suggested_roles` from z2m exposes.
- `PUT /settings/zigbee/bindings` — `{bindings: {ieee: {...}}}`; validate role enum.
- `GET /settings/zigbee/roles` — catalog for selects.
- `GET /settings/zigbee/recipes` + `GET/PUT /settings/zigbee/policies` — device tasks (ieee → recipe).
- Permit join already publishes `{"time": N}` in brain; Settings must forward duration.
- Settings Device → Zigbee table: Name, Model, Status, Role, Zone, Task, Save. Replace free-text Placements SoT.

## Radio foundation (ZB0)

- Repo + Pi: `serial.adapter: ember` in [`services/dsc-hub/zigbee2mqtt/configuration.yaml`](../../../services/dsc-hub/zigbee2mqtt/configuration.yaml).
- Flash policy **B**: try ember on current FW; flash EmberZNet **7.4.x** only if `HOST_FATAL_ERROR` persists. Do not wipe pairing DB without operator OK.
- Compose device map `/dev/ttyACM0` (or by-id); keep restart cap; document in [`docs/ops/ZIGBEE-RECOVERY.md`](../../ops/ZIGBEE-RECOVERY.md).

## Files

- [`brain/dsc_brain/zigbee_mqtt.py`](../../../brain/dsc_brain/zigbee_mqtt.py)
- [`brain/dsc_brain/api.py`](../../../brain/dsc_brain/api.py)
- [`brain/dsc_brain/fleet_state.py`](../../../brain/dsc_brain/fleet_state.py)
- [`homeassistant/custom_components/dsc_hub/frontend/src/pages/SettingsPage.tsx`](../../../homeassistant/custom_components/dsc_hub/frontend/src/pages/SettingsPage.tsx)
- [`brain/tests/test_brain_pi.py`](../../../brain/tests/test_brain_pi.py)
- Ops: [`docs/ops/ZIGBEE-RECOVERY.md`](../../ops/ZIGBEE-RECOVERY.md)

## Acceptance

- `/health` zigbee `radio_up=true` stable ≥15m (or dated blocker if stick FW requires desk flash).
- Permit join lists a new end device when hardware pairs.
- Bind → `/fleet` role path updates; unbound T/RH does not set canopy (unit + live).
- Screenshot: Settings Unbound → Bound.
- FOLLOWUPS ZB-P0 / ZB-P1 rows closed or dated with evidence.
