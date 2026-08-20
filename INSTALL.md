# DSC-HUB — Install (from scratch)

Fresh Home Assistant + ESPHome bring-up for **HA surface 7.2.0** and
**expected firmware 6.1.0.0** (live lab: studio Wi-Fi + HA Native API bus).

Repo: https://github.com/weddas/DSC-HUB · branch **`master`**
(last tagged GitHub release may still be **v5.1.0**).

> **Lab scaffold path.** Live lab joins studio Wi-Fi with HA as the bus —
> [`docs/qa/STUDIO-WIFI-HA-BUS.md`](docs/qa/STUDIO-WIFI-HA-BUS.md).
> Product unbox without HA is SoftAP — [`SETUP.md`](SETUP.md).
> Pi brain / local webserver destination: [`docs/DSC-BRAIN.md`](docs/DSC-BRAIN.md).
> HA iteration rules: [`docs/HA-SCAFFOLD.md`](docs/HA-SCAFFOLD.md).

**Preferred ongoing delivery (lab HA):** HAOS add-on — [`scripts/ADDON.md`](scripts/ADDON.md)  
**Kit SoftAP (product / no HA first):** [`SETUP.md`](SETUP.md)  
**Upgrading an existing site:** [`UPGRADE.md`](UPGRADE.md)

---

## File → destination map

| Repo source | Destination |
|---|---|
| `homeassistant/packages/dsc_v4_*.yaml` | `/config/packages/` |
| `homeassistant/custom_components/dsc_hub/` | `/config/custom_components/dsc_hub/` (React panel) |
| `homeassistant/dashboards/dsc-hub-v4-dashboard.yaml` | `/config/dashboards/` (YAML Lovelace **fallback**) |
| `homeassistant/dashboards/dsc-build-plant-dashboard.yaml` | `/config/dashboards/` (Build a Plant) |
| `homeassistant/esphome/dsc-*.yaml` | `/config/esphome/` |
| `homeassistant/www/dsc-system-map.*` | `/config/www/` (bundled cards) |
| `homeassistant/www/dsc-catalog/*.json` | `/config/www/dsc-catalog/` (Build a Plant typeahead) |
| `firmware/v4/components/{dsc_api_client,dsc_anchor_ap,dsc_fleet_setup}` | `/config/esphome/components/` (bridge + kit) |
| `firmware/v4/secrets.yaml.template` | `/config/esphome/secrets.yaml` (fill in; never commit) |

Merge [`homeassistant/configuration.snippet.yaml`](homeassistant/configuration.snippet.yaml)
into `configuration.yaml` (packages + panel + YAML dashboards **`dsc-hub-pro`**
fallback and **`dsc-build-plant`**).

### Add-on (recommended)

1. Settings → Add-ons → Repositories → `https://github.com/weddas/DSC-HUB`
2. Install **DSC-HUB Sync** → Start (defaults include `sync_esphome: true`)
3. Wait for “Synced to …” · confirm `/config/dsc-hub-sync.version`
4. Merge configuration snippet → **Restart HA Core once** (creates new helpers)

Further pushes to `master` update packages / fallback dashboard / www / stubs automatically.
Firmware Install stays **manual**.

---

## 0. Prerequisites

- HAOS + ESPHome add-on
- HACS cards listed in [`homeassistant/README.md`](homeassistant/README.md)
- Fixed 2.4 GHz channel for hub + panel + pots
- Filled `/config/esphome/secrets.yaml`

### Notify target (edit once)

Set `input_text.dsc_notify_service` to your mobile notify entity, e.g.
`notify.mobile_app_your_phone`. Climate alerts call `script.dsc_notify`
([`dsc_v4_notify.yaml`](homeassistant/packages/dsc_v4_notify.yaml)).

---

## 1. Packages (all `dsc_v4_*.yaml`)

Includes core helpers, climate physics, **Learn Phase A+B**, light helpers, tank,
pots stats/correlation/alerts, alert count, automations, **version/fleet status**,
**root zone coldest/hottest**, notify.

After first 7.2 sync: restart Core once if Phase B / fleet sensors are missing.

Suggested recorder includes (optional): learn eff/samples, ladder wait numbers,
fire countdowns, fleet version status.

---

## 2. UI

**Primary:** custom panel **`/dsc-hub`**. Sidebar title is DSC-HUB, **not**
“DSC-HUB Pro”.

**Fallback:** YAML mode URL **`dsc-hub-pro`** (ops) and **`dsc-build-plant`**
(composition). Do not hide the YAML fallback — `/dsc-hub-pro/ops` must still
render. Ops checklist:
[`docs/qa/LIVE-UI-BUILD-A-PLANT.md`](docs/qa/LIVE-UI-BUILD-A-PLANT.md).

---

## 3. ESPHome stubs

| Stub | Body | Expect after flash |
|---|---|---|
| `dsc-hub.yaml` | hub v4_0 + **espnow-parked** | **6.1.0.0** |
| `dsc-control.yaml` | control-common + **ha-bus** | **6.1.0.0** |
| pots | pot-common (Modbus 2026.8) | **6.1.0.0** |
| `dsc-bridge.yaml` | bridge-common · SoftAP **off** | **6.1.0.0** |
| Sonoffs | sonoff-common (studio LAN) | **6.1.0.0** |

Stub `ref: master` (or tag when cut). Kits Validate even if not flashed on lab.
Lab HA bus ops: [`docs/qa/STUDIO-WIFI-HA-BUS.md`](docs/qa/STUDIO-WIFI-HA-BUS.md).
Bridge needs `firmware/v4/components/dsc_api_client` beside the stub (Sync copies
when `sync_esphome: true`, or flash from `firmware/v4/`). Lab keeps
`enable_anchor: false`. Secrets: `dsc_bridge_*`, four `dsc_*_host` (studio IPs).

### Flash order (USB cutover)

1. Hub · 2. Pot2 canary · 3. Pot1/4/3 · 4. Sonoffs · 5. Panel · 6. **Bridge last** (SoftAP off)

After soak + one wireless Install each of ESP32 + Sonoff, **OTA is the path**.
Do **not** OTA pots while Modbus/hardware is OOS.

### Verify

- [ ] `sensor.dsc_hub_firmware_version` = **6.1.0.0** (and peers that are flashed)
- [ ] `sensor.dsc_ha_surface_version` = **7.2.0**
- [ ] `sensor.dsc_fleet_version_status` → **ok** (expected 6.1.0.0)
- [ ] Sidebar **`/dsc-hub`** + Learning Phase B controls present (B default off)
- [ ] Lovelace `/dsc-hub-pro/ops` still renders
- [ ] Panel Connections shows ESP-NOW **PARKED**; glass vitals via HA; Sonoffs follow HA demand

---

## Day-to-day

```
Cursor edit → push master
  → DSC-HUB Sync (~60s) → packages / dashboard / www / stubs / bridge components
  → Restart HA once if new helpers
  → ESPHome Validate/Install (changed devices only)
```

See [`RELEASE.md`](RELEASE.md) rollout checklist · [`docs/qa/`](docs/qa/).
