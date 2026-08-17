# DSC-HUB · HA surface **7.2.0** / expected firmware **6.0.0.0**

Honesty pass for the live SoftAP fleet. The sidebar panel is **`/dsc-hub`**
(not DSC-HUB Pro). Lovelace YAML at `/dsc-hub-pro/*` remains the hidden fallback.

| | |
|---|---|
| **HA surface** | `sensor.dsc_ha_surface_version` = **`7.2.0`** |
| **Expected firmware** | `input_text.dsc_expected_release` / fleet fallback = **`6.0.0.0`** |
| **Primary UI** | React panel **`/dsc-hub`** · sidebar is not “DSC-HUB Pro” |
| **Fallback Lovelace** | YAML dashboard URL **`dsc-hub-pro`** (hidden ops fallback — keep it) |
| **Last GitHub tag** | `v5.1.0` (historical cut; live train is 7.2.0 / 6.0.0.0) |
| **ESP-NOW tag** | **`54727` (`0xD5C7`)** — protocol deepening parked this pass |
| **Phase B mat wait** | Ceiling **≤ 300 s** |

**Install:** [`INSTALL.md`](INSTALL.md) · **Upgrade:** [`UPGRADE.md`](UPGRADE.md) ·
**Add-on:** [`scripts/ADDON.md`](scripts/ADDON.md) ·
**QA:** [`docs/qa/`](docs/qa/)

Repo: https://github.com/weddas/DSC-HUB · branch **`master`**

> Hardware OOS stays gated: AC, clone mister, POT3, tank. Do not flash pots
> this pass (Modbus). ESP-NOW 0xD5 / 0xD0 / SoftAP BSSID adopt stay parked.
> See [`docs/AUDIT-2026-08-17.md`](docs/AUDIT-2026-08-17.md) and
> [`docs/FOLLOWUPS.md`](docs/FOLLOWUPS.md).

---

## What’s new in v5.1.0

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
