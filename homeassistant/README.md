# Home Assistant — DSC-HUB v4

Canonical HA surface for firmware [`firmware/v4/`](../firmware/v4/).

## Layout

| Path | Role |
|---|---|
| `dashboards/dsc-hub-v4-dashboard.yaml` | Lovelace (9 views). Dashboard URL **must** be `dsc-hub-v4`. |
| `packages/dsc-v4-core-helpers.yaml` | Link alias, fan %, airflow proxies, photoperiod, tank EC, event log, runtimes |
| `packages/dsc-v4-light-helpers.yaml` | Lights-on today, clone dark-period, deviation |
| `automations.yaml` | Demand followers, alerts, grow-log scribe |

## Install

1. In `configuration.yaml` (if not already):

```yaml
homeassistant:
  packages: !include_dir_named packages
```

Copy the two package files into `/config/packages/` (or symlink this folder).

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

## Still outside this folder (live HA / Notion)

These are referenced by the dashboard but are site-specific or never lived in git:

- Full appliance runtime/cycle history_stats beyond heater/humidifier (optional)
- `dsc_hub_offline_safe_off` group-OFF belt (keep from live HA if present)
- Clone humidifier follower (parked until mister hardware)
- Over-temp / climate-fault phone alerts (HA Audit J01 — confirm live)
- Water-tester entity names (`sensor.water_tester_*`) — match your Tuya integration
- Recorder `purge_keep_days: ~120` for grow-cycle history
- Fixed-channel AP ops (see repo root README — Nest mesh)

## Firmware pairing

| Piece | Version |
|---|---|
| Hub | `4.0` |
| Panel | `4.0.4`+ |
| `espnow_cmd_tag` | `54727` (`0xD5C7`) on hub **and** panel |
