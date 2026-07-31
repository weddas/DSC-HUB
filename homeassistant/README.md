# Home Assistant — DSC-HUB v4

Canonical HA surface for firmware [`firmware/v4/`](../firmware/v4/).

## Layout

| Path | Role |
|---|---|
| `dashboards/dsc-hub-v4-dashboard.yaml` | Lovelace UX **v0.2** (9 views). URL **must** be `dsc-hub-v4`. Flow: Home → Climate → tents → Root Zone → Tank/Light/Trends/System. |
| `packages/dsc_v4_core_helpers.yaml` | Hub link, fan %, airflow Sankey (CFM), photoperiod, leaf offset, appliance runtimes, dead-demand cues |
| `packages/dsc_v4_climate_physics.yaml` | Settable plant specs (CFM/volumes/L/day/W), ACH/AH/BTU/moisture sensors, spec verification |
| `packages/dsc_v4_light_helpers.yaml` | Lights-on today, clone dark-period, deviation |
| `packages/dsc_v4_tank.yaml` | Tank EC/pH/temp helpers + Tuya warn sync |
| `packages/dsc_v4_pots_stats.yaml` | Per-pot daily max/min + 7d baselines + rates |
| `packages/dsc_v4_pots_correlation.yaml` | EC vs tank + uptake slope |
| `packages/dsc_v4_pots_alerts.yaml` | Per-pot moisture/pH/temp/EC/N alerts |
| `packages/dsc_v4_alert_count.yaml` | `sensor.dsc_active_alert_count` for Home chip |
| `automations.yaml` | Demand followers, climate/safety alerts, grow-log scribe |
| `esphome/` | Thin device stubs — pull firmware packages from GitHub |

## ESPHome (all devices)

Canonical edit path: Cursor → `firmware/v4/` → push.

On HA: copy `homeassistant/esphome/dsc-*.yaml` into `/config/esphome/`.
Stubs pull package bodies from `github.com/weddas/DSC-HUB` (`master`,
refresh daily). Secrets stay in HA `secrets.yaml` only.

Hub + panel: flash as a pair when `espnow_cmd_tag` / wire contract changes.

See [`esphome/README.md`](esphome/README.md).

## Install

1. In `configuration.yaml` (if not already):

```yaml
homeassistant:
  packages: !include_dir_named packages
```

Copy **all** `packages/dsc_v4_*.yaml` into `/config/packages/` (or symlink this folder).
Filenames must use underscores — HA `!include_dir_named` rejects hyphens in the package slug.

If you already have live copies of `dsc_tank.yaml` / `dsc_pots_*.yaml` /
`dsc_dashboard_v3.yaml` / `dsc_v24_light_helpers.yaml` / `dsc_alert_count.yaml`,
**remove those first** — same `unique_id`s would create silent `*_2` twins.

After swapping `dsc_v4_pots_alerts.yaml`, remove any leftover
`binary_sensor.dsc_potN_temp_out_of_range` entities from the registry if the
new `…_root_zone_temp_out_of_range` sensors appear (unique_id rename).

2. Merge `automations.yaml` entries into HA (UI or `automation: !include`).  
   If older `dsc_v24_follow_*` Rev A automations exist, delete them first.

3. Create a new dashboard → **Edit dashboard → ⋮ → Raw configuration editor** → paste `dsc-hub-v4-dashboard.yaml`.  
   Set the dashboard URL to **`dsc-hub-v4`**.

   **Ongoing:** dashboard YAML is **not** updated by ESPHome OTA. When `RELEASE.md` says the dashboard changed, re-paste the raw config (same URL). Same rule for `packages/dsc_v4_*.yaml` and `automations.yaml` — copy/merge by hand, then restart or reload.

4. Restart Home Assistant (followers need `homeassistant: start` to resync).

5. Entity registry: rename any leftover plant/stage ids to:

- `text.dsc_pot1_plant_name` … `text.dsc_pot4_plant_name`
- `select.dsc_pot1_growth_stage` … `select.dsc_pot4_growth_stage`

## Fan entity_ids

Core helpers assume ESPHome default slugs from hub friendly names. If your registry differs, edit the four `fan.dsc_hub_*` ids in `dsc_v4_core_helpers.yaml` once.

## Notifier

Alerts call `notify.chriss_iphone_max`. Change that target in `automations.yaml` if needed.

## HACS cards

mushroom · apexcharts-card · power-flow-card-plus · sankey-chart · plotly-graph-card · mini-graph-card · gauge-card-pro · modern-circular-gauge · logbook-card · auto-entities · vertical-stack-in-card · card-mod · bar-card · ph-meter-temperature · **expander-card**

## Local custom card — SYSTEM MAP

Neon isometric live map (`custom:dsc-system-map-card`) on the Home view. Not a HACS card — ship from this repo:

1. Copy both files into Home Assistant `/config/www/`:
   - [`www/dsc-system-map.svg`](www/dsc-system-map.svg) — standalone animated SVG (open in a browser for a demo loop)
   - [`www/dsc-system-map-card.js`](www/dsc-system-map-card.js) — Lovelace card that loads the SVG and binds fan %, SF1000, appliance demands, priority tent, failsafe, and climate labels
2. **Settings → Dashboards → ⋮ → Resources → Add resource**
   - URL: `/local/dsc-system-map-card.js`
   - Type: **JavaScript** (not JavaScript Module — the card is a classic IIFE)
3. Re-paste [`dashboards/dsc-hub-v4-dashboard.yaml`](dashboards/dsc-hub-v4-dashboard.yaml) (Home already includes the **SYSTEM MAP** FILL section).
4. Hard-refresh the browser (or clear frontend cache) so `/local/` picks up the new files.

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

## Still outside this folder (hardware / live site)

- Clone humidifier follower — parked until mister hardware
- AC follower / Sonoff stub — not in repo (demand is live on hub)
- Water-tester entity names (`sensor.water_tester_*`) — match your Tuya ids
- Recorder `purge_keep_days: ~120` — HA config, not firmware
- Fixed-channel AP — ops (see root README / RELEASE.md)
- POT3 probe swap, SCD41, ETH01 gateway — post-release hardware

## Firmware pairing

| Piece | Version |
|---|---|
| Hub | `4.0` (+ mat vote switches) |
| Panel | **`4.0.10`** |
| Dashboard | UX **v0.2** |
| `espnow_cmd_tag` | `54727` (`0xD5C7`) on hub **and** panel |

**Mat votes:** `switch.dsc_hub_mat_vote_pot_1`…`4` — Root Zone is source of truth; Climate links there.

Full cutover: [`../INSTALL.md`](../INSTALL.md) (fresh) · [`../UPGRADE.md`](../UPGRADE.md) (from live) · [`../RELEASE.md`](../RELEASE.md).
