# DSC-HUB **v5.1.0**

Full-fleet force to **5.1.0**: lab + kit firmwares, Sonoffs, Sync add-on,
HA packages, DSC-HUB Pro dashboard, and Learn Phase B (opt-in wait clamps).

| | |
|---|---|
| **GitHub tag** | `v5.1.0` |
| **Hub / panel / pots / Sonoffs** | **`5.1.0`** |
| **Sync add-on** | **`5.1.0`** (`sync_esphome: true` default) |
| **HA surface** | `sensor.dsc_ha_surface_version` = **`5.1.0`** |
| **Dashboard** | **DSC-HUB Pro** · URL **`dsc-hub-pro`** |
| **ESP-NOW tag** | **`54727` (`0xD5C7`)** |
| **Phase B** | Default **off** — wait bases only |

**Install:** [`INSTALL.md`](INSTALL.md) · **Upgrade:** [`UPGRADE.md`](UPGRADE.md) ·
**Add-on:** [`scripts/ADDON.md`](scripts/ADDON.md) ·
**QA:** [`docs/qa/`](docs/qa/)

Repo: https://github.com/weddas/DSC-HUB · branch **`master`**

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

## Rollout on all systems

- [ ] Push `master` / tag `v5.1.0`
- [ ] On **each** HAOS: Update **DSC-HUB Sync** add-on to **5.1.0** → Start/restart → wait for “Synced to …”
- [ ] Restart HA Core **once** (new Learning / version helpers)
- [ ] Confirm `/dsc-hub-pro/home` + fleet chip shows HA surface **5.1.0**
- [ ] ESPHome: Validate/Install each device to firmware **5.1.0** (lab + field kits)
- [ ] Chip → **ok**

Firmware Install remains **manual** per device.

---

## Beyond OTA

| Surface | Deploy |
|---|---|
| Packages / Pro dashboard / www | Sync add-on on push |
| ESPHome stubs (`ref: master`) + `dsc_fleet_setup` component | Sync (`sync_esphome: true`) |
| Sync add-on binary | Supervisor **Update** once per HAOS |
| Device firmware | Manual Validate/Install |

```
Cursor edit → push master → DSC-HUB Sync (~60s)
                          → ESPHome Install (devices, manual)
```

---

## Post-tag train (master after `v5.1.0`)

The tagged cut stays **5.1.0**. Master has continued patch trains — keep these
straight when reading fleet chips and Supervisor:

| Layer | On `master` now | Notes |
|---|---|---|
| Hub / pots / Sonoffs / kits | **5.1.0** | Fleet firmware train |
| Panel (DSC-CONTROL) | **5.1.14** lean-cut patches | Fleet chip compares **major.minor** |
| HA surface packages + Pro dashboard | **5.1.1** | 4-col + Browser Mod System command center |
| Sync add-on binary | **5.1.2** | Also copies `esphome/components/dsc_fleet_setup` |
| Sync marker `surface_version` | **5.1.0** | Train label in add-on script — not the package sensor |

Ops docs: [`dsc-hub-sync/DOCS.md`](dsc-hub-sync/DOCS.md) · [`scripts/ADDON.md`](scripts/ADDON.md) ·
[`docs/qa/LIVE-UI-5.1.1.md`](docs/qa/LIVE-UI-5.1.1.md).
