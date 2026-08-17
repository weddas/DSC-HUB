# DSC-HUB Sync add-on

Pulls [weddas/DSC-HUB](https://github.com/weddas/DSC-HUB) and copies HA surfaces
into `/config` whenever the tracked git ref moves (default: `master`).

**Add-on version:** **5.1.4** (Build a Plant dashboard + catalog + bundle concat;
also syncs `esphome/components/dsc_fleet_setup` since 5.1.2)

## What it syncs

| Repo path | HA destination |
|---|---|
| `homeassistant/packages/dsc_v4_*.yaml` | `/config/packages/` |
| `homeassistant/dashboards/dsc-hub-v4-dashboard.yaml` | `/config/dashboards/` |
| `homeassistant/dashboards/dsc-build-plant-dashboard.yaml` | `/config/dashboards/` |
| `homeassistant/dashboards/modules/view_*.yaml` | `/config/dashboards/modules/` |
| Bundled `www` cards + SVG + vendor | `/config/www/` (default on) |
| `homeassistant/www/dsc-catalog/*.json` | `/config/www/dsc-catalog/` |
| `homeassistant/esphome/dsc-*.yaml` | `/config/esphome/` (**default on** in 5.1.0) |

Also writes:

- `/config/dsc-hub-sync.version` — surface version + SHA
- `/config/packages/dsc_v4_sync_marker.yaml` — `sensor.dsc_hub_sync_sha`

Never touches `secrets.yaml` or `.storage/`. Never auto-flashes ESP devices.

Copies are staged under `/data/sync_stage` then promoted; on failure the add-on
restores the last-good snapshot under `/data/last_good_sync`.

### www bundle concat (5.1.4)

`system-map` → `airflow` → `three.min` → `dsc-dash-fx` → `the-dash` → **`build-plant`**

Refuses staging `< 500000` bytes (F-013). Healthy size ~941 KB with Build a Plant.

When present, Sync also copies standalone `www/vendor/three.min.js` (and
`dsc-dash-fx.js`) so React Twin can load the dedicated dash IIFE without relying
only on the fat concat. Ops: [`docs/qa/TWIN-THREE-PREREQ.md`](../docs/qa/TWIN-THREE-PREREQ.md).

**N-084:** Sync ≤5.1.3 stopped at The Dash — rebuild **5.1.4+** so Sync cannot
demote a HACS-complete live bundle.

## Reloads (when `reload_after_sync`)

`homeassistant.reload_core_config`, `automation.reload`, `script.reload`,
`template.reload`, themes reload.

**Restart HA Core once** after a major cut (new `input_*` helpers) — reload alone
often does not create them. The add-on posts a persistent notification reminder.
YAML dashboards refresh on navigation (`lovelace.reload` is 400 on current Core).

## One-time HA setup

1. Install / Update add-on **5.1.4**, start, wait for first sync.
2. Merge configuration snippet (packages + YAML dashboards `dsc-hub-pro` **and**
   `dsc-build-plant`).
3. Restart Home Assistant once.
4. Remove duplicate DSC automation ids from UI if present.
5. Set `input_text.dsc_notify_service` to your notify entity.

## Options

| Option | Default (5.1.0) | Meaning |
|---|---|---|
| `repository` | `https://github.com/weddas/DSC-HUB.git` | Git remote |
| `ref` | `master` | Branch or tag |
| `poll_seconds` | `60` | Fetch interval |
| `sync_www` | `true` | SYSTEM MAP / Dash / Build a Plant assets |
| `sync_esphome` | **`true`** | Overwrite ESPHome stubs and copy `firmware/v4/components` → `/config/esphome/components` |
| `reload_after_sync` | `true` | Broader reload set |

## Private repos

Use a deploy key or HTTPS token in the `repository` URL the Supervisor can reach.
Auth failures appear clearly in the add-on log (no silent empty sync).

## Support

[INSTALL.md](https://github.com/weddas/DSC-HUB/INSTALL.md) ·
[UPGRADE.md](https://github.com/weddas/DSC-HUB/UPGRADE.md) ·
[scripts/ADDON.md](https://github.com/weddas/DSC-HUB/blob/master/scripts/ADDON.md) ·
[docs/qa/ADDON-QA-5.1.0.md](https://github.com/weddas/DSC-HUB/blob/master/docs/qa/ADDON-QA-5.1.0.md) ·
[docs/qa/LIVE-UI-BUILD-A-PLANT.md](https://github.com/weddas/DSC-HUB/blob/master/docs/qa/LIVE-UI-BUILD-A-PLANT.md)
