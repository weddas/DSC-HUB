# Firmware Home-Assistant removal — status & remaining spec

The HA lab was retired 2026-09; the SPA/brain phases landed in PRs #181/#182.
This file tracks the firmware layer.

## Done (phase 2 — hub glass feeds off HA)

`firmware/v4/dsc-hub-v4_0.yaml` no longer imports anything from a Home
Assistant server:

| Was | Now |
|---|---|
| `ha_plant_1..4` `platform: homeassistant` (read `text.dsc_probe{n}_plant_name`) | `api: actions: - action: set_plant_name(idx:int, name:string)` → `plant_name_{n}` → `script.execute: tx_names`. The brain pushes on every roster edit. |
| `rootzone_temp_1..4` `platform: homeassistant` (mat-loop fallback source) | deleted. `pick()` / `live()` in the mat source-select are ESP-NOW-only (`rz_now_*` + `rz_now_*_at`, 150 s freshness gate) — the HA arg is gone from the lambdas and all 8 call sites. |
| `substitutions:` `rootzone_temp_entity*`, `pot*_plant_entity` | removed (only the identity/secrets stub `substitutions:` remains). |
| commented `zigbee_canopy_temp/rh` `platform: homeassistant` example | removed. |
| `firmware/v4/dsc-control-ha-bus.yaml` (367-line HA-sensor bus, unreferenced by any Pi `packages:`) | `git rm`. |
| `firmware/v4/dsc-control.yaml` comments referencing the HA bus | scrubbed. |

**Brain side (`brain/dsc_brain/hub_native.py` + `compose_store.py`):**
`push_plant_name(pot_n, name)` finds the hub's `set_plant_name` `UserService`
via `list_entities_services()` and calls `client.execute_service(...)`.
`push_plant_name_bg()` dispatches it fire-and-forget (task on a running loop,
else a daemon thread; no-op in demo mode). `compose_store.set_helper()` fires
it whenever `text.dsc_probe{1-4}_plant_name` changes — the same signal the
retired `ha_plant_*` sensors used to read — so all existing roster-edit call
sites (`assign_to_pot`, `update_pot_recipe`, `retire_plant`, plant-probe
attach/detach) push automatically. Fail-closed: hub offline / action missing /
non-hub inventory ⇒ the panel keeps its last name until the next good push.

`homeassistant.event:` in `dsc-control-common.yaml` (`esphome.dsc_panel_hub_cmd`,
panel → hub command channel over the native API) is **kept** — it is the live
command path the brain consumes; the HA-shaped dialect on the brain is
sanctioned (AGENTS.md).

**Compile-verified 2026-09-06:** `esphome config` passes for every `firmware/v4`
entry point (hub, hub-kit, control, control-kit, pot1–4 + kits, four Sonoffs) on
ESPHome 2026.8.0 as train **8.0.0.0** (`project: version` + `firmware_version`
sensors bumped; `EXPECTED_FIRMWARE` follows). The kit hub stub had to gain the
`fleet_heal` package — `dsc-hub-espnow-primary.yaml` reads `ota_blocked` /
`fix_active` / `emit_evt` from it and the stub had not built since those globals
moved. **Fleet reflash still pending** — the on-device checks below run at the
Pi gate (`docs/FOLLOWUPS.md`).

### Verify on device (phase 2)
- `esphome config firmware/v4/dsc-hub.yaml` (+ `dsc-hub-kit.yaml`) → exit 0.
- Boot with **no HA on the network** (there is none) → hub boots clean, no
  `platform: homeassistant` "waiting for API" log spam for plant / rootzone.
- Rename a plant in the SPA → panel OLED plant-name line updates within a few
  seconds (brain → `set_plant_name` → `tx_names` → ESP-NOW 0xD4). Retire a
  plant → its line clears.
- Heat-mat rootzone soak: cold-pot (mat holds), faulted-probe (excluded by
  Mat Vote), stale ESP-NOW link (>150 s → `rz_stale` → soft fault → clone-air
  fallback, no false "have a live probe" from a removed HA mirror).

## Done (phase 1 — SNTP-only time)

`platform: homeassistant` **time** sources removed from `firmware/v4/`:

| File | Was | Now |
|---|---|---|
| `dsc-hub-v4_0.yaml` | `time: [sntp_time, grow_time(HA)]` | `time: [sntp_time]` |
| `dsc-control-common.yaml` | `time: [sntp_time, ha_time(HA)]` | `time: [sntp_time]` |
| `dsc-pot-common.yaml` | `time: [sntp_time, ha_time(HA)]` | `time: [sntp_time]` |

Every `id(sntp_time).now().is_valid() || id(<ha>_time).now().is_valid()` →
`id(sntp_time).now().is_valid()`, and every
`auto now = id(sntp_time).now(); if (!now.is_valid()) now = id(<ha>_time).now();`
→ `auto now = id(sntp_time).now();` (hub ×3, control ×2, pot ×3).

**Phase-1 follow-up (this PR):** #190 removed the `grow_time` *definition* from
`dsc-hub-v4_0.yaml` but missed four `now = id(grow_time).now()` fallback call
sites in the hub's included packages — `dsc-hub-espnow-primary.yaml` ×1,
`dsc-hub-fleet-heal.yaml` ×3 — which left `id(grow_time)` dangling. Those
lines are dropped here (same rationale).

**Why this is behaviour-identical on the Pi product:** the HA time platform only
syncs from a connected Home Assistant. There is none. `<ha>_time.now()` was never
valid, so the `|| ha_time` clause never contributed and the `if (!now.is_valid())`
fallback never fired. `clock_valid` was already effectively `sntp_time` alone.

**Still requires a firmware re-cut + fleet reflash to take effect** — the running
fleet keeps the old (functionally identical) build until reflashed.

### Verify on device
- `esphome config firmware/v4/dsc-hub.yaml` (and `dsc-control.yaml`, `dsc-pot1.yaml`) → exit 0.
- Boot with **no internet** → `binary_sensor.Clock Valid` = off; photoperiod
  holds last-known window (no invented catch-up). Restore internet → clock
  valid, schedule resumes. Confirm on both hub and panel.
- Panel OLED clock line renders once SNTP lands.
- Pot cal-timestamp buttons (`Mark Soil Cal …`) stamp a real ISO time.

## Remaining

Nothing on the firmware layer. `homeassistant.event:` in `dsc-control-common.yaml`
is intentionally retained (see phase 2 note above) as the panel → hub command
channel. If ESP-NOW TX is later un-parked, revisit it then.

## Rollout

Stage the reflash through the ESPHome rollout (Settings → Device → ESPHome →
**Canary Probe 2 first** → **Release the rest**, serialised, **hub last**;
`/settings/esphome/rollout?mode=canary|rest|all`). `project: version` is
**8.0.0.0** and the `CHANGELOG.md` line is in place; what remains is the gate.
