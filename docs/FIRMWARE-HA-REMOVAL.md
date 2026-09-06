# Firmware Home-Assistant removal — status & remaining spec

The HA lab was retired 2026-09; the SPA/brain phases landed in PRs #181/#182.
This file tracks the firmware layer.

## Done (this PR — SNTP-only time)

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

## Remaining (needs the ESPHome toolchain + a device — NOT done here)

### 1. Hub `rootzone_temp_1..4` HA mirrors → delete

`dsc-hub-v4_0.yaml` ~L3216–3245: four `platform: homeassistant` sensors
(`${rootzone_temp_entity*}`) that refresh `last_valid_rootzone_time` and act as
the mat-loop's *fallback* source when a pot's ESP-NOW link is stale (<150 s
freshness gate).

- The ESP-NOW leg (`rz_now_1..4`, ~L3474+) already advances
  `last_valid_rootzone_time` on every plausible reading, so the HA mirror is a
  dead fallback on the Pi.
- **Deleting the sensors is not a one-liner:** `id(rootzone_temp).state` … are
  the 3rd/4th argument of `pick(...)` (L4276–4279) and `live(...)`
  (L5442–5445) in the mat source-select. Removing the sensors means dropping
  that argument and simplifying both helpers to ESP-NOW-only. Compile + a
  heat-mat soak (cold-pot, faulted-probe, stale-link cases) required.
- Also drop the now-unused substitutions `rootzone_temp_entity*` (L65–68) and
  the commented zigbee-mirror example (L3463–3471).

### 2. Hub `ha_plant_1..4` → `api:` service + brain call

`dsc-hub-v4_0.yaml` ~L2828–2855: reads `text.dsc_probe{N}_plant_name` from HA →
`plant_name_{N}` → `tx_names` (ESP-NOW to the panel OLED). **This is the one
inbound path with no ESP-NOW equivalent** — deleting it blind loses plant names
on the panel glass.

Replacement:

```yaml
# in the hub api: block
api:
  encryption:
    key: ${api_key_val}
  actions:
    - action: set_plant_name
      variables:
        idx: int
        name: string
      then:
        - lambda: |-
            std::string n = name.size() > 16 ? name.substr(0, 16) : name;
            switch (idx) {
              case 1: id(plant_name_1) = n; break;
              case 2: id(plant_name_2) = n; break;
              case 3: id(plant_name_3) = n; break;
              case 4: id(plant_name_4) = n; break;
            }
        - script.execute: tx_names
```

Brain side (`brain/dsc_brain/esphome_client.py`): on roster/assignment change,
for each in-service kit pot call the native-API user service
`set_plant_name(idx=<pot>, name=<plant display name or "">)`. The brain already
holds the native-API client to the hub; add an `execute_service` call keyed off
the same signal that currently drives `text.dsc_probe{N}_plant_name`.

Then delete the `ha_plant_1..4` sensor blocks + the `pot{N}_plant_entity`
substitutions (L71–74).

### 3. `dsc-control-common.yaml` `homeassistant.event:` (~L4429)

Panel → hub command path (`esphome.dsc_panel_hub_cmd` event over the native
API). The comment says "ESP-NOW TX parked", so this event **is** the live
command channel and the brain consumes it (HA-shaped dialect on the brain is
sanctioned — AGENTS.md). **Leave in place.** If ESP-NOW TX is later un-parked,
revisit.

### 4. `dsc-control-ha-bus.yaml`

367-line file of `platform: homeassistant` sensors feeding `gv_*` for the studio
Wi-Fi cutover. **Not referenced by any `packages:` in the Pi build**
(`dsc-control.yaml` includes only `wifi` + `panel`). Safe to `git rm` as retired
lab reference, or keep it clearly marked lab-only. No fleet impact either way.

## Rollout

Stage the reflash through the existing ESPHome OTA rollout
(`/settings/esphome/rollout`, serialised, **hub last**) after `esphome config`
passes for every seat. Bump the firmware `project: version` and add a
`DSC-HUB-*-CHANGELOG.md` line.
