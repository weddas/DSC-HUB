# DSC-HUB v4 — Install (fresh)

Use this for a **new** Home Assistant + ESPHome setup, or a clean rebuild.
If you already run v2.4 / early v4, use [`UPGRADE.md`](UPGRADE.md) instead.

Repo: https://github.com/weddas/DSC-HUB · branch **`master`**

---

## 0. Prerequisites

- Home Assistant with [ESPHome](https://esphome.io/) add-on or external ESPHome
- HACS custom cards (see [`homeassistant/README.md`](homeassistant/README.md))
- Notifier `notify.chriss_iphone_max` (or edit targets in automations / tank / pot packages)
- Router: **fixed 2.4 GHz channel** for hub + panel + pots (Nest/mesh hops break ESP-NOW)
- Secrets: copy [`firmware/v4/secrets.yaml.template`](firmware/v4/secrets.yaml.template) → `/config/esphome/secrets.yaml` and fill keys

---

## 1. Home Assistant packages

In `configuration.yaml`:

```yaml
homeassistant:
  packages: !include_dir_named packages
```

Copy **every** file matching `homeassistant/packages/dsc_v4_*.yaml` into `/config/packages/`.
Use underscores in filenames — HA `!include_dir_named` rejects hyphens.

| File | Purpose |
|---|---|
| `dsc_v4_core_helpers.yaml` | Hub link, fans, airflow, photoperiod, runtimes |
| `dsc_v4_light_helpers.yaml` | Lights-on today, dark-period, deviation |
| `dsc_v4_tank.yaml` | Tank EC/pH/temp + Tuya warn sync |
| `dsc_v4_pots_stats.yaml` | Daily max/min, 7d baselines, rates |
| `dsc_v4_pots_correlation.yaml` | EC vs tank, uptake slope |
| `dsc_v4_pots_alerts.yaml` | Per-pot alert binaries + notifier |
| `dsc_v4_alert_count.yaml` | Home chip aggregate |

---

## 2. Automations

Merge [`homeassistant/automations.yaml`](homeassistant/automations.yaml) into HA
(UI or `automation: !include …`).

Includes: demand followers (4 Sonoffs), clone dark-period + root-zone alerts,
grow-log scribe, hub-offline safe-off, emergency/climate/aux fault alerts.

Tank and pot alert notifiers also ship **inside** their packages — that is intentional.

---

## 3. Dashboard

1. Create a new Lovelace dashboard
2. URL path must be exactly: **`dsc-hub-v4`**
3. Raw configuration editor → paste [`homeassistant/dashboards/dsc-hub-v4-dashboard.yaml`](homeassistant/dashboards/dsc-hub-v4-dashboard.yaml)

---

## 4. ESPHome device stubs (git-pull workflow)

Copy every `homeassistant/esphome/dsc-*.yaml` into `/config/esphome/`.

These stubs keep secrets/MACs locally and pull logic from GitHub:

| Stub | Pulls |
|---|---|
| `dsc-hub.yaml` | `dsc-hub-v4_0.yaml` + `dsc-hub-espnow-primary.yaml` |
| `dsc-control.yaml` | `dsc-control-common.yaml` (+ glyphs sibling) |
| `dsc-heater` / `heatmat` / `humidifier` / `de-humidifier` | `dsc-sonoff-common.yaml` |
| `dsc-pot1` … `dsc-pot4` | `dsc-pot-common.yaml` |

Do **not** put `secrets.yaml` in git. Edit MACs / `espnow_cmd_tag` in the stubs if your hardware differs.

---

## 5. Restart + validate

1. Restart Home Assistant
2. ESPHome → Validate each device (set `refresh: 0d` once if the git cache is empty/stale, then restore `1d`)
3. Flash USB first time per device if never adopted; OTA after

### Flash order (first fleet bring-up)

1. Hub — entry point **`dsc-hub.yaml`**
2. Panel — entry point **`dsc-control.yaml`** (pair with hub; same `espnow_cmd_tag`)
3. Pots — POT2 canary, then 1 / 3 / 4
4. Sonoffs — any order

### Verify

- [ ] Panel ESP-NOW UP; a panel command moves a hub entity
- [ ] `sensor.dsc_hub_firmware_version` = `4.0`
- [ ] `binary_sensor.dsc_hub_emergency_failsafe` exists
- [ ] Four `binary_sensor.dsc_hub_potN_esp_now_link` exist
- [ ] Demand ON → matching Sonoff relay ON
- [ ] Dashboard Home shows hub/panel chips; alert chip uses `sensor.dsc_active_alert_count`
- [ ] Tank card reads `sensor.dsc_tank_ec_normalized` (check Tuya entity names if blank)

---

## Day-to-day

```
Cursor edit → commit/push to master → ESPHome Validate/Install (only changed devices)
```

Hub + panel: flash **together** when `espnow_cmd_tag`, MAC, or wire packets change.

See also: [`UPGRADE.md`](UPGRADE.md) · [`RELEASE.md`](RELEASE.md) · [`homeassistant/README.md`](homeassistant/README.md)
