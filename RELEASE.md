# DSC-HUB releases

## Pi appliance — **v7.2.0** (global modifiers + soil probes + Zigbee)

| | |
|---|---|
| **Brain / SPA** | **7.1.0** brain · surface **7.2.0** |
| **Expected firmware** | **7.0.0.0** |
| **Primary UI** | Pi SPA at `http://10.42.0.1:8787` — **Overview** default landing |
| **Studio LAN** | `http://192.168.86.48:8787` (`dsc-brain.local`) |
| **Deploy** | [`services/dsc-hub/pi/studio-deploy.ps1`](services/dsc-hub/pi/studio-deploy.ps1) |
| **Closure** | [`docs/qa/AUDIT-CLOSURE-7.2.md`](docs/qa/AUDIT-CLOSURE-7.2.md) |
| **Zigbee ops** | [`docs/ops/ZIGBEE-RECOVERY.md`](docs/ops/ZIGBEE-RECOVERY.md) |
| **Modifiers** | [`docs/brain/GLOBAL-MODIFIERS.md`](docs/brain/GLOBAL-MODIFIERS.md) |
| **Soil probe** | [`docs/brain/SOIL-PROBE.md`](docs/brain/SOIL-PROBE.md) |
| **SPA** | `index-DQgIy3uk` |

Global modifiers, mobile soil probe wizard (pot2/pot4 stations), Zigbee per-placement sensors, chart QoL, experimental Sankey on Climate. **60/60** brain tests.

**Pi SPA is SoT** — legacy `homeassistant/www/DSC-HUB.js` not required for island operation.

---

## Pi appliance — **v7.1.2** (full software backlog pass)

| | |
|---|---|
| **Brain / SPA** | **7.1.0** brain · surface **7.1.2** |
| **Expected firmware** | **7.0.0.0** |
| **Primary UI** | Pi SPA at `http://10.42.0.1:8787` — **Overview** default landing |
| **Studio LAN** | `http://192.168.86.48:8787` (`dsc-brain.local`) |
| **Git tag** | `v7.1.2` _(operator request)_ |
| **Deploy** | [`services/dsc-hub/pi/studio-deploy.ps1`](services/dsc-hub/pi/studio-deploy.ps1) or [`deploy-brain.ps1`](services/dsc-hub/pi/deploy-brain.ps1) |
| **Verify** | [`verify-brain.ps1`](services/dsc-hub/pi/verify-brain.ps1) + [`island-proof.ps1`](services/dsc-hub/pi/island-proof.ps1) |
| **Acceptance** | [`docs/qa/LIVE-ACCEPTANCE-7.1.md`](docs/qa/LIVE-ACCEPTANCE-7.1.md) §7.1.2 |
| **Closure** | [`docs/qa/AUDIT-CLOSURE-7.1.2.md`](docs/qa/AUDIT-CLOSURE-7.1.2.md) |

7.1 audit closure, frontend CI, computed cache, sensor trust, CannaLib/Zigbee honesty, Twin preload, pot UART soften. **56/56** brain tests; frontend `tsc` clean.

---

## Pi appliance — **v7.1.1** (DSC-Brain island closeout)

| | |
|---|---|
| **Brain / SPA** | **7.1.0** brain · surface **7.1.0** |
| **Expected firmware** | **7.0.0.0** |
| **Primary UI** | Pi SPA at `http://10.42.0.1:8787` — **Overview** default landing |
| **Git tag** | `v7.1.1` |
| **Deploy** | [`services/dsc-hub/pi/deploy-brain.ps1`](services/dsc-hub/pi/deploy-brain.ps1) |
| **Acceptance** | [`docs/qa/LIVE-ACCEPTANCE-7.1.md`](docs/qa/LIVE-ACCEPTANCE-7.1.md) |
| **Soak** | [`docs/ops/SOAK-2026-08-26.md`](docs/ops/SOAK-2026-08-26.md) |

Panel label OTA, fleet truth on AP, integrations verified, bridge retired.

---

## Pi appliance — **v7.1.0** (DSC-Brain island)

| | |
|---|---|
| **Brain / SPA** | **7.1.0** (`dsc-hub-brain:7.0.0` image tag — bump on next compose pass) |
| **Expected firmware** | **7.0.0.0** |
| **Primary UI** | Pi SPA at `http://10.42.0.1:8787` — **Overview** default landing |
| **Git tag** | `v7.1.0` |
| **Deploy** | [`services/dsc-hub/pi/deploy-brain.ps1`](services/dsc-hub/pi/deploy-brain.ps1) |
| **Acceptance** | [`docs/qa/LIVE-ACCEPTANCE-7.1.md`](docs/qa/LIVE-ACCEPTANCE-7.1.md) |
| **Design audit** | [`docs/qa/DESIGN-AUDIT-7.1.md`](docs/qa/DESIGN-AUDIT-7.1.md) |

Native FleetState: `/fleet`; computed dash at `/fleet/computed`. Bridge retired; appliance driver only.

---

## Pi appliance — **v7.0.0** (DSC-Brain island)

| | |
|---|---|
| **Brain / SPA** | **7.0.0** (`dsc-hub-brain:7.0.0`) |
| **Expected firmware** | **7.0.0.0** |
| **Primary UI** | Pi SPA at `http://10.42.0.1:8787` |
| **Git tag** | `v7.0.0` |
| **Deploy** | [`services/dsc-hub/pi/deploy-brain.ps1`](services/dsc-hub/pi/deploy-brain.ps1) |
| **Fleet flash** | [`services/dsc-hub/pi/flash-fleet-700.ps1`](services/dsc-hub/pi/flash-fleet-700.ps1) |
| **Island proof** | [`docs/ops/DSC-HUB-DOCKER.md`](docs/ops/DSC-HUB-DOCKER.md) + [`docs/AUDIT-2026-08-26.md`](docs/AUDIT-2026-08-26.md) |

Native FleetState: `/fleet` (no `hass_extras` on hot path); computed dash helpers at `/fleet/computed`.

---

## HA house panel — surface **7.2.0** / expected firmware **6.0.0.0**

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
