# Home Assistant — DSC-HUB v4

Canonical HA surface for firmware [`firmware/v4/`](../firmware/v4/).

## Layout

| Path | Role |
|---|---|
| `dashboards/dsc-hub-v4-dashboard.yaml` | Lovelace (9 views). Dashboard URL **must** be `dsc-hub-v4`. |
| `packages/dsc-v4-core-helpers.yaml` | Hub link, fan %, airflow Sankey, photoperiod, leaf offset, appliance runtimes |
| `packages/dsc-v4-light-helpers.yaml` | Lights-on today, clone dark-period, deviation |
| `packages/dsc-v4-tank.yaml` | Tank EC/pH/temp helpers + Tuya warn sync |
| `packages/dsc-v4-pots-stats.yaml` | Per-pot daily max/min + 7d baselines + rates |
| `packages/dsc-v4-pots-correlation.yaml` | EC vs tank + uptake slope |
| `packages/dsc-v4-pots-alerts.yaml` | Per-pot moisture/pH/temp/EC/N alerts |
| `packages/dsc-v4-alert-count.yaml` | `sensor.dsc_active_alert_count` for Home chip |
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

Copy **all** `packages/dsc-v4-*.yaml` into `/config/packages/` (or symlink this folder).

If you already have live copies of `dsc_tank.yaml` / `dsc_pots_*.yaml` /
`dsc_dashboard_v3.yaml` / `dsc_v24_light_helpers.yaml` / `dsc_alert_count.yaml`,
**remove those first** — same `unique_id`s would create silent `*_2` twins.

2. Merge `automations.yaml` entries into HA (UI or `automation: !include`).  
   If older `dsc_v24_follow_*` Rev A automations exist, delete them first.

3. Create a new dashboard → **Edit dashboard → ⋮ → Raw configuration editor** → paste `dsc-hub-v4-dashboard.yaml`.  
   Set the dashboard URL to **`dsc-hub-v4`**.

4. Restart Home Assistant (followers need `homeassistant: start` to resync).

5. Entity registry: rename any leftover plant/stage ids to:

- `text.dsc_pot1_plant_name` … `text.dsc_pot4_plant_name`
- `select.dsc_pot1_growth_stage` … `select.dsc_pot4_growth_stage`

## Fan entity_ids

Core helpers assume ESPHome default slugs from hub friendly names. If your registry differs, edit the four `fan.dsc_hub_*` ids in `dsc-v4-core-helpers.yaml` once.

## Notifier

Alerts call `notify.chriss_iphone_max`. Change that target in `automations.yaml` if needed.

## HACS cards

mushroom · apexcharts-card · power-flow-card-plus · sankey-chart · plotly-graph-card · mini-graph-card · gauge-card-pro · modern-circular-gauge · logbook-card · auto-entities · vertical-stack-in-card · card-mod · bar-card · ph-meter-temperature

## Still outside this folder (hardware / live site)

- Clone humidifier follower — parked until mister hardware
- Water-tester entity names (`sensor.water_tester_*`) — match your Tuya ids
- Recorder `purge_keep_days: ~120` — HA config, not firmware
- Fixed-channel AP — ops (see root README / RELEASE.md)
- POT3 probe swap, SCD41, ETH01 gateway — post-release hardware

## Firmware pairing

| Piece | Version |
|---|---|
| Hub | `4.0` |
| Panel | `4.0.4`+ |
| `espnow_cmd_tag` | `54727` (`0xD5C7`) on hub **and** panel |

Full cutover: [`../INSTALL.md`](../INSTALL.md) (fresh) · [`../UPGRADE.md`](../UPGRADE.md) (from live) · [`../RELEASE.md`](../RELEASE.md).
