# DSC-HUB v5.0.0 — Install (from scratch)

Fresh Home Assistant + ESPHome bring-up for release **`v5.0.0`**
(hub firmware string matches the GitHub tag).

Repo: https://github.com/weddas/DSC-HUB · tag **`v5.0.0`** · branch **`master`**

**Preferred ongoing delivery:** HAOS add-on — [`scripts/ADDON.md`](scripts/ADDON.md)  
**Kit SoftAP (no HA first):** [`SETUP.md`](SETUP.md)

---

## File → destination map

Copy from this repo into your HA config (or let the **DSC-HUB Sync** add-on do it
after install). Paths on the left are relative to the repo root; destinations are
under Home Assistant `/config/`.

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

### Add-on (recommended after first files land)

1. Settings → Add-ons → ⋮ → **Repositories** → add `https://github.com/weddas/DSC-HUB`
2. Install **DSC-HUB Sync** → Start  
3. Further pushes to `master` update packages / dashboard / www automatically  

Details: [`scripts/ADDON.md`](scripts/ADDON.md).  
Optional: HACS SYSTEM MAP card — [`scripts/HACS-FRONTEND.md`](scripts/HACS-FRONTEND.md).  
Optional Unraid GHA path: [`scripts/HA-SYNC-BOOTSTRAP.md`](scripts/HA-SYNC-BOOTSTRAP.md).

---

## 0. Prerequisites

- Home Assistant OS (for the Sync add-on) with [ESPHome](https://esphome.io/) add-on
- HACS custom cards listed in [`homeassistant/README.md`](homeassistant/README.md)
- Router: **fixed 2.4 GHz channel** for hub + panel + pots (mesh channel hops break ESP-NOW)
- Filled `/config/esphome/secrets.yaml` from the template above

Mobile push alerts for pot/tank package notifiers are **not** shipped.
Climate / safety alerts live in `dsc_v4_automations.yaml` — edit notify targets
there to match your devices (e.g. `notify.mobile_app_…`).

---

## 1. Packages

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

Included via package [`dsc_v4_automations.yaml`](homeassistant/packages/dsc_v4_automations.yaml).
Do **not** also merge the deprecated stub `homeassistant/automations.yaml`.

---

## 3. Dashboard

Prefer **YAML mode** (required for add-on / git sync):

1. Add the `lovelace:` block from the snippet above to `configuration.yaml`
2. Copy dashboard YAML → `/config/dashboards/` (or let the add-on sync it)
3. Restart HA once; sidebar shows **DSC-HUB** at URL **`dsc-hub-v4`**
4. Remove any older **UI-managed** dashboard that owned `dsc-hub-v4`

### SYSTEM MAP card

**Preferred:** HACS — [`scripts/HACS-FRONTEND.md`](scripts/HACS-FRONTEND.md)  
**Or:** add-on / manual `www/` copy + resource `/local/dsc-system-map-card.js` (JavaScript).

---

## 4. ESPHome stubs

Copy every `homeassistant/esphome/dsc-*.yaml` → `/config/esphome/`.

| Stub → `/config/esphome/` | Pulls from GitHub (`@v5.0.0` / `master`) |
|---|---|
| `dsc-hub.yaml` | `dsc-hub-v4_0.yaml` + `dsc-hub-espnow-primary.yaml` |
| `dsc-control.yaml` | `dsc-control-common.yaml` (+ glyphs) |
| Sonoffs / pots | `dsc-sonoff-common.yaml` / `dsc-pot-common.yaml` |

Prefer stub `ref: v5.0.0` for this cut; `master` once tracking tip.
Do **not** put `secrets.yaml` in git.

---

## 5. Restart + flash

1. Restart Home Assistant  
2. ESPHome → Validate (set `refresh: 0d` once if git cache stale, then `1d`)  
3. Flash USB first time; OTA after  

### Flash order

1. Hub — expect **`5.0.0`**  
2. Panel — **4.0.11** (same `espnow_cmd_tag`)  
3. Pots — POT2 canary, then 1 / 3 / 4  
4. Sonoffs  

### Verify

- [ ] Panel ESP-NOW UP; panel command moves a hub entity  
- [ ] `sensor.dsc_hub_firmware_version` = **`5.0.0`**  
- [ ] Demand ON → matching Sonoff relay ON  
- [ ] Dashboard URL `dsc-hub-v4` loads; alert chip uses `sensor.dsc_active_alert_count`  

---

## Day-to-day after install

```
Cursor edit → commit/push master
  → DSC-HUB Sync add-on (~60s) → packages / dashboard / www
  → ESPHome Validate/Install (changed devices only)
```

Hub + panel: flash **together** when `espnow_cmd_tag`, MAC, or wire packets change.

See also: [`RELEASE.md`](RELEASE.md) · [`scripts/ADDON.md`](scripts/ADDON.md) · [`homeassistant/README.md`](homeassistant/README.md) · [`firmware/v4/README.md`](firmware/v4/README.md)
