# DSC-HUB v4.0.0-alpha.1 — Install (from scratch)

Fresh Home Assistant + ESPHome bring-up for release **`v4.0.0-alpha.1`**
(hub firmware string matches the GitHub tag).

Repo: https://github.com/weddas/DSC-HUB · tag **`v4.0.0-alpha.1`** · branch **`master`**

---

## File → destination map

Copy from this repo into your HA config. Paths on the left are relative to the
repo root; destinations are under Home Assistant `/config/`.

| Repo source | Destination |
|---|---|
| `homeassistant/packages/dsc_v4_*.yaml` (all `dsc_v4_*.yaml` files) | `/config/packages/` |
| `homeassistant/dashboards/dsc-hub-v4-dashboard.yaml` | `/config/dashboards/dsc-hub-v4-dashboard.yaml` (YAML-mode Lovelace) |
| `homeassistant/esphome/dsc-*.yaml` (all device stubs) | `/config/esphome/` |
| `homeassistant/www/dsc-system-map-card.js` | `/config/www/dsc-system-map-card.js` |
| `homeassistant/www/dsc-system-map.svg` | `/config/www/dsc-system-map.svg` |
| `firmware/v4/secrets.yaml.template` | `/config/esphome/secrets.yaml` (fill in; never commit) |

Merge [`homeassistant/configuration.snippet.yaml`](homeassistant/configuration.snippet.yaml) into `configuration.yaml` (packages + YAML dashboard):

```yaml
homeassistant:
  packages: !include_dir_named packages

lovelace:
  mode: storage
  dashboards:
    dsc-hub-v4:
      mode: yaml
      title: DSC-HUB
      icon: mdi:sprout
      show_in_sidebar: true
      filename: dashboards/dsc-hub-v4-dashboard.yaml
```

Filenames under `packages/` must use **underscores** — HA rejects hyphens in
`!include_dir_named` package slugs.

After the one-time copy (or first auto-sync), enable push deploy:
[`scripts/HA-SYNC-BOOTSTRAP.md`](scripts/HA-SYNC-BOOTSTRAP.md).

---

## 0. Prerequisites

- Home Assistant with [ESPHome](https://esphome.io/) add-on (or external ESPHome)
- HACS custom cards listed in [`homeassistant/README.md`](homeassistant/README.md)
- Router: **fixed 2.4 GHz channel** for hub + panel + pots (mesh channel hops break ESP-NOW)
- Filled `/config/esphome/secrets.yaml` from the template above

Mobile push alerts for pot/tank package notifiers are **not** shipped in this
alpha (they previously targeted a non-existent notify service). Climate /
safety alerts live in `dsc_v4_automations.yaml` — edit notify targets there to
match your devices (e.g. `notify.mobile_app_…`).

---

## 1. Packages

Copy every file:

| File → `/config/packages/` | Purpose |
|---|---|
| `dsc_v4_core_helpers.yaml` | Hub link, fans, airflow, photoperiod, runtimes |
| `dsc_v4_climate_physics.yaml` | Plant specs, ACH/AH/BTU/moisture sensors |
| `dsc_v4_climate_learn.yaml` | Phase A EMA learning + ETA / headroom gauges |
| `dsc_v4_light_helpers.yaml` | Lights-on today, dark-period, deviation |
| `dsc_v4_tank.yaml` | Tank EC/pH/temp + Tuya warn sync automation |
| `dsc_v4_pots_stats.yaml` | Daily max/min, 7d baselines, rates |
| `dsc_v4_pots_correlation.yaml` | EC vs tank, uptake slope |
| `dsc_v4_pots_alerts.yaml` | Per-pot alert binary sensors (no push notifier) |
| `dsc_v4_alert_count.yaml` | `sensor.dsc_active_alert_count` for Home chip |
| `dsc_v4_automations.yaml` | Demand followers, alerts, scribe, safe-off |

---

## 2. Automations

Included via package [`dsc_v4_automations.yaml`](homeassistant/packages/dsc_v4_automations.yaml)
(copied with the other packages above). Do **not** also merge the deprecated
repo-root stub `homeassistant/automations.yaml` — it would duplicate ids.

Includes: Sonoff demand followers, clone dark-period + root-zone alerts,
grow-log scribe, hub-offline safe-off, emergency/climate/aux fault alerts.
Learning EMA samples ship in `dsc_v4_climate_learn.yaml`.

---

## 3. Dashboard

Prefer **YAML mode** (required for git-push sync):

1. Add the `lovelace:` block from the snippet above to `configuration.yaml`
2. Copy [`homeassistant/dashboards/dsc-hub-v4-dashboard.yaml`](homeassistant/dashboards/dsc-hub-v4-dashboard.yaml) → `/config/dashboards/`
3. Restart HA once; sidebar should show **DSC-HUB** at URL **`dsc-hub-v4`**
4. If an older **UI-managed** dashboard already owns `dsc-hub-v4`, remove or rename it first

### SYSTEM MAP card (Home view)

**Preferred:** install via HACS — [`scripts/HACS-FRONTEND.md`](scripts/HACS-FRONTEND.md)
(custom repo `https://github.com/weddas/DSC-HUB`, category **Dashboard**).

**Manual fallback:**

1. Copy the two `www/` files into `/config/www/` (see map above)
2. Settings → Dashboards → ⋮ → Resources → Add resource  
   - URL: `/local/dsc-system-map-card.js`  
   - Type: **JavaScript**
3. Hard-refresh the browser after the first dashboard load

---

## 4. ESPHome stubs

Copy every `homeassistant/esphome/dsc-*.yaml` → `/config/esphome/`.

| Stub → `/config/esphome/` | Pulls from GitHub (`@v4.0.0-alpha.1` / `master`) |
|---|---|
| `dsc-hub.yaml` | `dsc-hub-v4_0.yaml` + `dsc-hub-espnow-primary.yaml` |
| `dsc-control.yaml` | `dsc-control-common.yaml` (+ glyphs) |
| `dsc-heater.yaml` / `dsc-heatmat.yaml` / `dsc-humidifier.yaml` / `dsc-de-humidifier.yaml` | `dsc-sonoff-common.yaml` |
| `dsc-pot1.yaml` … `dsc-pot4.yaml` | `dsc-pot-common.yaml` |

Edit MACs / `espnow_cmd_tag` in the stubs if your hardware differs.
Do **not** put `secrets.yaml` in git.

For this alpha cut, prefer stub `ref: v4.0.0-alpha.1` (or pin after clone) so
Install pulls the tagged bodies; `master` is fine once you are tracking tip.

---

## 5. Restart + flash

1. Restart Home Assistant
2. ESPHome → Validate each device (set `refresh: 0d` once if the git cache is empty/stale, then restore `1d`)
3. Flash USB the first time per device; OTA after

### Flash order

1. Hub — **`dsc-hub.yaml`**
2. Panel — **`dsc-control.yaml`** (same `espnow_cmd_tag` as hub)
3. Pots — POT2 canary, then 1 / 3 / 4
4. Sonoffs — any order

### Verify

- [ ] Panel ESP-NOW UP; a panel command moves a hub entity
- [ ] `sensor.dsc_hub_firmware_version` = **`4.0.0-alpha.1`**
- [ ] `binary_sensor.dsc_hub_emergency_failsafe` exists
- [ ] Four `binary_sensor.dsc_hub_potN_esp_now_link` exist
- [ ] Demand ON → matching Sonoff relay ON
- [ ] Dashboard Home shows hub/panel chips; alert chip uses `sensor.dsc_active_alert_count`
- [ ] Tank card reads `sensor.dsc_tank_ec_normalized` (check Tuya entity names if blank)

---

## Day-to-day after install

```
Cursor edit → commit/push → HA sync Action (packages / dashboard / www)
                         → ESPHome Validate/Install (changed devices only)
```

With the Unraid self-hosted runner configured ([`scripts/HA-SYNC-BOOTSTRAP.md`](scripts/HA-SYNC-BOOTSTRAP.md)),
pushes to `master` that touch `homeassistant/**` auto-deploy helpers, automations,
dashboard, and SYSTEM MAP assets. Firmware Install stays manual.

Hub + panel: flash **together** when `espnow_cmd_tag`, MAC, or wire packets change.

See also: [`RELEASE.md`](RELEASE.md) · [`homeassistant/README.md`](homeassistant/README.md) · [`firmware/v4/README.md`](firmware/v4/README.md)
