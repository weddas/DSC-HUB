# Home Assistant — DSC-HUB v4

Canonical HA surface for firmware [`firmware/v4/`](../firmware/v4/).

## Layout

| Path | Role |
|---|---|
| `dashboards/dsc-hub-v4-dashboard.yaml` | Lovelace UX **v0.2** (10 views). URL **must** be `dsc-hub-pro`. Flow: Home → Climate → Learning → tents → Root Zone → Tank/Light/Trends/System. |
| `packages/dsc_v4_core_helpers.yaml` | Hub link, fan %, airflow Sankey (CFM), photoperiod, leaf offset, appliance runtimes, dead-demand cues |
| `packages/dsc_v4_climate_physics.yaml` | Settable plant specs (CFM/volumes/L/day/W), ACH/AH/BTU/moisture sensors, spec verification |
| `packages/dsc_v4_climate_learn.yaml` | Phase A EMA lever-efficiency observer + minutes-to-target / headroom gauges |
| `packages/dsc_v4_light_helpers.yaml` | Lights-on today, clone dark-period, deviation |
| `packages/dsc_v4_tank.yaml` | Tank EC/pH/temp helpers + Tuya warn sync |
| `packages/dsc_v4_pots_stats.yaml` | Per-pot daily max/min + 7d baselines + rates |
| `packages/dsc_v4_pots_correlation.yaml` | EC vs tank + uptake slope |
| `packages/dsc_v4_pots_alerts.yaml` | Per-pot moisture/pH/temp/EC/N alert binaries |
| `packages/dsc_v4_alert_count.yaml` | `sensor.dsc_active_alert_count` for Home chip |
| `packages/dsc_v4_automations.yaml` | Demand followers, climate/safety alerts, grow-log scribe |
| `configuration.snippet.yaml` | Paste-once: packages include + YAML-mode `dsc-hub-pro` dashboard |
| `automations.yaml` | Deprecated stub — points at the package above |
| `www/dsc-system-map.*` | SYSTEM MAP Lovelace card + SVG → `/config/www/` |
| `esphome/` | Thin device stubs — pull firmware packages from GitHub |

## ESPHome (all devices)

Canonical edit path: Cursor → `firmware/v4/` → push.

On HA: copy `homeassistant/esphome/dsc-*.yaml` into `/config/esphome/`.
Stubs pull package bodies from `github.com/weddas/DSC-HUB` (`master`,
refresh daily). Secrets stay in HA `secrets.yaml` only.

Hub + panel: flash as a pair when `espnow_cmd_tag` / wire contract changes.

See [`esphome/README.md`](esphome/README.md).

## Install (from scratch)

Full file → destination map: [`../INSTALL.md`](../INSTALL.md).

Quick copy list:

| This folder | HA `/config/` |
|---|---|
| `packages/dsc_v4_*.yaml` | `packages/` (helpers, learn, automations) |
| `dashboards/dsc-hub-v4-dashboard.yaml` | `dashboards/` (YAML-mode URL **`dsc-hub-pro`**) |
| `esphome/dsc-*.yaml` | `esphome/` |
| `www/dsc-system-map.*` | `www/` + resource `/local/dsc-system-map-card.js` |

Merge [`configuration.snippet.yaml`](configuration.snippet.yaml) into HA `configuration.yaml`
(packages + YAML Lovelace). Filenames under `packages/` must use underscores.
Restart HA after the first copy / `configuration.yaml` change.

**Ongoing:** install the **DSC-HUB Sync** add-on ([`../scripts/ADDON.md`](../scripts/ADDON.md))
so pushes to `master` update packages, dashboard, and www automatically.
Firmware Install stays manual — see [`../RELEASE.md`](../RELEASE.md).

## Fan entity_ids

Core helpers assume ESPHome default slugs from hub friendly names. If your registry differs, edit the four `fan.dsc_hub_*` ids in `dsc_v4_core_helpers.yaml` once.

## Notifier

Climate / safety automations in `dsc_v4_automations.yaml` use a mobile notify
target — edit those services to match your HA devices (`notify.mobile_app_…`).
Package pot/tank **push** notifiers are not shipped in **v5.0.0**
(alert binary sensors remain).

## HACS cards

mushroom · apexcharts-card · power-flow-card-plus · sankey-chart · plotly-graph-card · mini-graph-card · gauge-card-pro · modern-circular-gauge · logbook-card · auto-entities · vertical-stack-in-card · card-mod · bar-card · ph-meter-temperature · **expander-card**

## Local custom card — SYSTEM MAP

Neon isometric live map (`custom:dsc-system-map-card`) on the Home view.

### Preferred — HACS Dashboard custom repository

1. HACS → ⋮ → **Custom repositories**
2. Repository: `https://github.com/weddas/DSC-HUB`
3. Category: **Dashboard**
4. Download **DSC-HUB System Map**, restart/reload when prompted, hard-refresh browser

HACS serves `/hacsfiles/DSC-HUB/DSC-HUB.js` (+ SVG beside it). Full steps:
[`../scripts/HACS-FRONTEND.md`](../scripts/HACS-FRONTEND.md).

### Manual fallback (`/config/www/`)

1. Copy both files into Home Assistant `/config/www/` (or rely on ha-sync):
   - [`www/dsc-system-map.svg`](www/dsc-system-map.svg)
   - [`www/dsc-system-map-card.js`](www/dsc-system-map-card.js)
2. **Settings → Dashboards → ⋮ → Resources → Add resource**
   - URL: `/local/dsc-system-map-card.js`
   - Type: **JavaScript** (not JavaScript Module — the card is a classic IIFE)
3. Ensure the dashboard includes the **SYSTEM MAP** card (YAML dashboard already does).
4. Hard-refresh the browser.

Optional entity overrides via card YAML:

```yaml
type: custom:dsc-system-map-card
title: DSC-HUB
entities:
  fan_out: sensor.dsc_fan_exhaust_outside_pct
  light: light.dsc_hub_sf1000_dimmer
```

## Climate capacity envelope

The **hub firmware** owns the escalation ladder (fans first → appliances →
>35°C failsafe). HA only mirrors four Sonoff relays and surfaces alerts —
it must not duplicate ladder logic.

| Device | Owner | Role |
|---|---|---|
| OUT / RECIRC / intakes | Hub fans | First responder; heat reuse; negative-pressure budget |
| Humidifier / dehumidifier / heater / grow mat | Hub demand → HA follower → Sonoff | Wired actuators |
| AC | Hub `ac_demand` only | **No follower** — summer / lights-on heat can stall at room temp |
| Clone mister | Hub `clone_humidifier_demand` only | **Parked** until mister hardware |
| Shared room appliances | Priority tent when both live | Non-priority tent is local levers only |

### Scenario keep-up matrix (code-walked)

| Scenario | Can tents keep up? |
|---|---|
| A. Warm room + lights dumping heat | **No if AC unwired** — fans exchange to room temp only |
| B. Cold dry night, 4x8 priority | **Yes** for air via heater/hum; clone RH needs intake plume |
| C. Clone overheat, 4x8 has priority | **Partial** — local flush helps; shared AC serves priority |
| D. High RH flower + dehum lag | **Yes** if dehum follower healthy; moisture wins over heat reuse |
| E. Root zone cold / POT3 faulted | **Yes** (voted pots); air-proxy if all probes die |
| F. Root runaway (≥ High+1) | **Yes** — mat OFF + fan flush |
| G. Emergency ≥35°C | Fans yes; **AC only if wired** |
| H. Opposite climates both tents | **Structural limit** — priority wins room appliances |
| I. Hub offline ≥30s | Appliances safe-off; fans continue if hub up |
| J. Clone dry, no mister | **No local RH lever** — room humidifier + routing only |

Capacity verdict: fan ladder + heat reuse + reality gates are strong.
Hard holes today are **AC actuation** and **clone mister actuation**.

### Plant specs (settable — not hardcoded)

Install [`packages/dsc_v4_climate_physics.yaml`](packages/dsc_v4_climate_physics.yaml).
Nameplate values live as `input_number.dsc_*` (fan max CFM, tent/room m³,
heater W, dehum L/day, hum mL/h, AC BTU/h, light watts). Change them when
hardware is swapped; Sankey + capacity sensors recompute from those helpers.

Verification binaries (`binary_sensor.dsc_plant_specs_*`) flag incomplete
floors, intake CFM > exhaust CFM, AC wired with 0 BTU/h, and zeroed
appliance rates. Status: `sensor.dsc_plant_specs_status` (`ok` / `warn` / `error`).

### Response-rate learning (Phase A — observe + predict)

Install [`packages/dsc_v4_climate_learn.yaml`](packages/dsc_v4_climate_learn.yaml)
alongside the physics package.

While each lever is ON (and emergency / manual takeover / climate-sensor
fault are clear), a 5-minute EMA samples real `ΔT/min` and `ΔAH/min` and
stores effectiveness vs nameplate (`input_number.dsc_learn_eff_*`, clamped
0.1–2.0×). When sample count ≥ `input_number.dsc_learn_min_samples`, those
coeffs scale **predictions only**:

| Sensor | Role |
|---|---|
| `sensor.dsc_minutes_to_temp_target` | ETA to `number.dsc_hub_target_temp` |
| `sensor.dsc_minutes_to_rh_target` | ETA to RH band mid |
| `sensor.dsc_heat_balance_btu_learned` | Heat headroom with trusted scales |
| `sensor.dsc_moisture_net_rate_learned` | Moisture headroom with trusted scales |
| `sensor.dsc_learn_status` | `disabled` / `gated` / `warming` / `partial` / `ready` |

Phase A does **not** write hub persistence waits, fan curves, or failsafe.
**Phase B** (opt-in, default off): `input_boolean.dsc_climate_learn_phase_b_enabled`
rate-limits writes to `number.dsc_hub_ladder_wait_*` only. Lock with
`input_boolean.dsc_learn_phase_b_locked` after manual edits.
Reset coeffs: `script.dsc_climate_learn_reset`. Reset waits: `script.dsc_climate_learn_reset_waits`.

Dashboard: **Learning** (`/dsc-hub-pro/learning`) — Phase A+B status, waits, ETA,
efficiencies, charts, settings.

## Tank / Tuya entity map

Package [`packages/dsc_v4_tank.yaml`](packages/dsc_v4_tank.yaml) expects lab-style
water tester entities. Alias or rename in HA to match:

| DSC helper / sensor | Typical Tuya / integration id |
|---|---|
| Tank EC raw | `sensor.water_tester_ec` (or site-specific) |
| Tank pH | `sensor.water_tester_ph` |
| Tank temp | `sensor.water_tester_temperature` |
| EC scale | `input_number.dsc_tank_ec_multiplier` (`1` or `1000`) |

Door magnet (lab): `lock.4x8_humidifier_photo_lab_lock` = **room door release**,
not humidifier lock — entity id kept for compatibility.

## Still outside this folder (hardware / live site)

- Clone humidifier / AC physical actuators — demands live; followers gated by wired flags
- Recorder `purge_keep_days: ~120` — HA config
- Fixed-channel AP — ops (root README)
- POT3 probe swap, SCD41, ETH01 — post-release hardware

## Firmware pairing (**v5.1.0**)

| Piece | Version |
|---|---|
| Hub / panel / pots / Sonoffs / kits | **`5.1.0`** |
| Sync add-on / HA surface | **`5.1.0`** |
| Dashboard | DSC-HUB Pro |
| `espnow_cmd_tag` | `54727` (`0xD5C7`) on hub **and** panel |

**Mat votes:** `switch.dsc_hub_mat_vote_pot_1`…`4` — Root Zone is source of truth; Climate links there.

Bring-up: [`../INSTALL.md`](../INSTALL.md) · add-on: [`../scripts/ADDON.md`](../scripts/ADDON.md) · release: [`../RELEASE.md`](../RELEASE.md).
