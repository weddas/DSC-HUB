# DSC-HUB — Install (from scratch)

Fresh Home Assistant + ESPHome bring-up for **HA surface 7.2.0** and
**expected firmware 6.0.0.0** (live SoftAP fleet).

Repo: https://github.com/weddas/DSC-HUB · branch **`master`**
(last tagged GitHub release may still be **v5.1.0**).

> **Lab scaffold path.** Product unbox without HA is SoftAP — [`SETUP.md`](SETUP.md).
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
| `dsc-hub.yaml` | hub v4_0 + espnow | **6.0.0.0** |
| `dsc-control.yaml` | control-common | **6.0.0.0** |
| pots | pot-common | **6.0.0.0** |
| `dsc-bridge.yaml` | bridge-common + SoftAP Anchor | **6.0.0.0** |
| Sonoffs | sonoff-common (dual API client) | **6.0.0.0** |

Stub `ref: master` (or tag when cut). Kits Validate even if not flashed on lab.
Bridge needs `firmware/v4/components/dsc_api_client` and `dsc_anchor_ap` beside
the stub (Sync copies both when `sync_esphome: true`, or flash from
`firmware/v4/`). Secrets: `dsc_bridge_*`, `dsc_anchor_ap_password`, four
`dsc_*_host`.

### Flash order

1. Hub · 2. Panel · 3. Pots · 4. **Bridge (ETH01)** · 5. Sonoffs

This 7.2.0 pass OTAs **hub** (Control if it is on HA). Do **not** OTA pots
while Modbus/hardware is OOS.

### Verify

- [ ] `sensor.dsc_hub_firmware_version` = **6.0.0.0** (and peers that are flashed)
- [ ] `sensor.dsc_ha_surface_version` = **7.2.0**
- [ ] `sensor.dsc_fleet_version_status` → **ok** (expected 6.0.0.0; no false 5.2.0 warn)
- [ ] Sidebar **`/dsc-hub`** + Learning Phase B controls present (B default off)
- [ ] Lovelace `/dsc-hub-pro/ops` still renders
- [ ] Panel ESP-NOW UP; Bridge Anchor SoftAP up; Sonoffs follow via bridge (HA followers fallback)

---

## Day-to-day

```
Cursor edit → push master
  → DSC-HUB Sync (~60s) → packages / dashboard / www / stubs / bridge components
  → Restart HA once if new helpers
  → ESPHome Validate/Install (changed devices only)
```

See [`RELEASE.md`](RELEASE.md) rollout checklist · [`docs/qa/`](docs/qa/).
