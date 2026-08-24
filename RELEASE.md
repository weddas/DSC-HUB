# DSC-HUB · Pi product **7.0.0-dev** / firmware **7.0.0.0** · HA lab surface **7.2.0**

**Pi appliance (tip `c4eb97f`):** brain + SPA on `:8787`, `wifi-pi` fleet on
`10.42.0.0/24`, appliance driver replaces ETH01. Ops:
[`docs/qa/PI-APPLIANCE-7.0.md`](docs/qa/PI-APPLIANCE-7.0.md) · Compose:
[`services/dsc-hub/README.md`](services/dsc-hub/README.md). Tag `v7.0.0` only after island soak.

**HA lab (historical honesty):** sidebar panel **`/dsc-hub`** may still report surface
**7.2.0**; Lovelace YAML at `/dsc-hub-pro/*` remains hidden fallback. Do not conflate
lab Nest IPs with Pi AP seats.

| | |
|---|---|
| **Pi brain / SPA** | **`7.0.0-dev`** until soak |
| **Expected Pi firmware** | **`7.0.0.0`** |
| **HA surface (lab)** | `sensor.dsc_ha_surface_version` = **`7.2.0`** |
| **Last GitHub tag** | `v5.1.0` (historical cut) |
| **ESP-NOW tag** | **`54727` (`0xD5C7`)** — parked on Pi path; kit SoftAP still uses mesh |
| **Phase B mat wait** | Ceiling **≤ 300 s** |

**Install:** Pi → [`docs/qa/PI-APPLIANCE-7.0.md`](docs/qa/PI-APPLIANCE-7.0.md) · HA lab → [`INSTALL.md`](INSTALL.md) · Kit SoftAP → [`SETUP.md`](SETUP.md) ·
**Upgrade:** [`UPGRADE.md`](UPGRADE.md) · **Add-on:** [`scripts/ADDON.md`](scripts/ADDON.md) ·
**QA:** [`docs/qa/`](docs/qa/)

Repo: https://github.com/weddas/DSC-HUB · branch **`master`**

> Hardware OOS stays gated: AC, clone mister, POT3, tank. See
> [`docs/FOLLOWUPS.md`](docs/FOLLOWUPS.md).

---

## What’s new in v7.0 (Pi release)

| Layer | Change |
|---|---|
| **Brain** | Fleet ingest, Settings/inventory, appliance driver, Zigbee hooks, SPA on `:8787` |
| **Docker** | `services/dsc-hub` — brain, cannalib fallback, mosquitto, z2m, ESPHome dashboard |
| **Firmware** | **7.0.0.0** + `*-wifi-pi.yaml`; hub ESP-NOW parked |
| **Appliances** | Hub demand → Sonoff `main_relay` via brain (ETH01 superseded on product path) |

## What’s new in v5.1.0 (historical HA cut)

| Layer | Change |
|---|---|
| **Fleet version** | Force **5.1.0** on hub, panel, pots, Sonoffs, **all kits**, add-on, stubs |
| **Learn Phase B** | Opt-in HA→hub ladder wait writes; floors/ceils; lock; never failsafe/min-off/fans |
| **Learning UI** | Phase A+B status, wait entities, resets, last-sample age |
| **Fleet chip** | `sensor.dsc_fleet_version_status` on Home + System table |
| **Root zone** | `sensor.dsc_coldest_root_zone_temp` / hottest (voted + plausible) |
| **Notify** | `input_text.dsc_notify_service` + `script.dsc_notify` |
| **Sync** | Atomic stage copy, last-good rollback, version/SHA marker, broader reloads, `sync_esphome` default **true** |
| **Door magnet** | Lab `lock.4x8_*` labeled as **room door release** |
| **QoL** | Multi-lever sample skip, alert-count plant-spec zeros, dead-demand chip, AC/mister NO ACTUATOR cues |

**Not in this cut:** auto-flash ESP devices; hub reconnect snapshot-restore;
remote ESP log capture; renaming `dsc_v4_*` filenames.

---

## Rollout (7.2.0 surface / 6.0.0.0 fleet)

- [ ] Sync packages / www / React panel (add-on or `scripts/ha-sync.sh`)
- [ ] Hard-reload HA; confirm sidebar **`/dsc-hub`** chrome says **7.2.0**
- [ ] Fleet chip: expected **6.0.0.0**, no false 5.2.0 warn
- [ ] OTA **hub** only this pass if firmware YAML changed (Control if on HA; **not** pots)
- [ ] Lovelace `/dsc-hub-pro/ops` still renders (fallback, not the sidebar name)

Firmware Install remains **manual** per device.

---

## Beyond OTA

| Surface | Deploy |
|---|---|
| Packages / Pro dashboard / www | Sync add-on on push |
| ESPHome stubs (`ref: v5.1.0`) | Sync (`sync_esphome: true`) |
| Sync add-on binary | Supervisor **Update** once per HAOS |
| Device firmware | Manual Validate/Install |

```
Cursor edit → push master → DSC-HUB Sync (~60s)
                          → ESPHome Install (devices, manual)
```
