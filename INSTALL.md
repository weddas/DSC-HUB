# DSC-HUB v5.1.0 — Install (from scratch)

Fresh Home Assistant + ESPHome bring-up for release **`v5.1.0`**
(fleet firmware, Sync add-on, and HA surface all report **`5.1.0`**).

Repo: https://github.com/weddas/DSC-HUB · tag **`v5.1.0`** · branch **`master`**

**Preferred ongoing delivery:** HAOS add-on — [`scripts/ADDON.md`](scripts/ADDON.md)  
**Kit SoftAP (no HA first):** [`SETUP.md`](SETUP.md)  
**Upgrading an existing site:** [`UPGRADE.md`](UPGRADE.md)

---

## File → destination map

| Repo source | Destination |
|---|---|
| `homeassistant/packages/dsc_v4_*.yaml` | `/config/packages/` |
| `homeassistant/dashboards/dsc-hub-v4-dashboard.yaml` | `/config/dashboards/` (YAML-mode Lovelace) |
| `homeassistant/esphome/dsc-*.yaml` | `/config/esphome/` |
| `homeassistant/www/dsc-system-map.*` | `/config/www/` |
| `firmware/v4/secrets.yaml.template` | `/config/esphome/secrets.yaml` (fill in; never commit) |

Merge [`homeassistant/configuration.snippet.yaml`](homeassistant/configuration.snippet.yaml)
into `configuration.yaml` (packages + YAML dashboard **`dsc-hub-pro`**).

### Add-on (recommended)

1. Settings → Add-ons → Repositories → `https://github.com/weddas/DSC-HUB`
2. Install **DSC-HUB Sync** **5.1.0** → Start (defaults include `sync_esphome: true`)
3. Wait for “Synced to …” · confirm `/config/dsc-hub-sync.version`
4. Merge configuration snippet → **Restart HA Core once** (creates new helpers)

Further pushes to `master` update packages / Pro dashboard / www / stubs automatically.
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

After first 5.1 sync: restart Core once if Phase B / fleet sensors are missing.

Suggested recorder includes (optional): learn eff/samples, ladder wait numbers,
fire countdowns, fleet version status.

---

## 2. Dashboard

YAML mode URL **`dsc-hub-pro`** only. Disable any storage dashboard still named
DSC-HUB / `dsc-hub-v4`. Sidebar: single **DSC-HUB Pro** entry.

---

## 3. ESPHome stubs

| Stub | Body | Expect after flash |
|---|---|---|
| `dsc-hub.yaml` | hub v4_0 + espnow | **5.1.0** |
| `dsc-control.yaml` | control-common | **5.1.14** |
| pots / Sonoffs | pot-common / sonoff-common | **5.1.0** |

Stub `ref: v5.1.0` (or `master` on lab stubs). Kits Validate even if not flashed on lab.
Panel is on a lean-cut **5.1.x** patch train; fleet chip compares major.minor.

### Flash order

1. Hub · 2. Panel · 3. Pots · 4. Sonoffs

### Verify

- [ ] `sensor.dsc_hub_firmware_version` = **5.1.0** (and peers)
- [ ] `sensor.dsc_control_firmware_version` = **5.1.14** (or current panel patch)
- [ ] `sensor.dsc_ha_surface_version` = **5.1.1**
- [ ] `sensor.dsc_fleet_version_status` → **ok** after all flashes
- [ ] `binary_sensor.dsc_hub_panel_link` tracks glass ESP-NOW (not HA API)
- [ ] `/dsc-hub-pro/home` + Learning Phase B controls present (B default off)
- [ ] Sonoff followers: short HA blips do **not** kill heater; offline ≥30 s safe-off

---

## Day-to-day

```
Cursor edit → push master
  → DSC-HUB Sync (~60s) → packages / dashboard / www / stubs
  → Restart HA once if new helpers
  → ESPHome Validate/Install (changed devices only)
```

See [`RELEASE.md`](RELEASE.md) rollout checklist · [`docs/qa/`](docs/qa/).
