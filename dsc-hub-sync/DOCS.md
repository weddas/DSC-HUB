# DSC-HUB Sync add-on

Pulls [weddas/DSC-HUB](https://github.com/weddas/DSC-HUB) and copies HA surfaces
into `/config` whenever the tracked git ref moves (default: `master`).

**Add-on version:** **5.1.3** — cinematic www bundle (system map + airflow +
THREE + Dash FX + The Dash) with **F-013 size/fallback guards**. Also syncs
`dashboards/modules/view_*.yaml` and `esphome/components/dsc_fleet_setup`.
HA surface version is independent (`sensor.dsc_ha_surface_version`).

## What it syncs

| Repo path | HA destination |
|---|---|
| `homeassistant/packages/dsc_v4_*.yaml` | `/config/packages/` |
| `homeassistant/dashboards/dsc-hub-v4-dashboard.yaml` | `/config/dashboards/` |
| `homeassistant/dashboards/modules/view_*.yaml` | `/config/dashboards/modules/` |
| `homeassistant/www/*` → **bundled** card JS + SVG + vendor | `/config/www/` (default on) |
| `homeassistant/esphome/dsc-*.yaml` | `/config/esphome/` (**default on**) |
| `firmware/v4/components/dsc_fleet_setup` | `/config/esphome/components/` |

Also writes:

- `/config/dsc-hub-sync.version` — surface version + SHA
- `/config/packages/dsc_v4_sync_marker.yaml` — `sensor.dsc_hub_sync_sha`

Never touches `secrets.yaml` or `.storage/`. Never auto-flashes ESP devices.

Copies are staged under `/data/sync_stage` then promoted; on failure the add-on
restores the last-good snapshot under `/data/last_good_sync`.

## www bundle (F-013)

When `sync_www` is on, Sync **concatenates** (does not copy the map source alone):

1. `www/dsc-system-map-card.js`
2. `www/dsc-airflow-map-card.js`
3. `www/vendor/three.min.js`
4. `www/vendor/dsc-dash-fx.js`
5. `www/dsc-the-dash-card.js`

→ `/config/www/dsc-system-map-card.js` **and** `DSC-HUB.js` (same bytes).

| Guard | Rule |
|---|---|
| Min size | Refuse promote if staged `< 500000` bytes |
| Dist fallback | If www inputs incomplete, use `dist/dsc-system-map-card.js` |
| Demotion | Never replace live `>= 500000` with staged `< 500000` |

Healthy cinematic bundle ≈ **846 KB**. Lovelace resource must be classic
**`js`** (not `module`). Ops: [`docs/qa/LIVE-UI-WWW-BUNDLE-GUARDS.md`](../docs/qa/LIVE-UI-WWW-BUNDLE-GUARDS.md).

## Reloads (when `reload_after_sync`)

`homeassistant.reload_core_config`, `automation.reload`, `script.reload`,
`template.reload`, `lovelace.reload`.

**Restart HA Core once** after a major cut (new `input_*` helpers) — reload alone
often does not create them. The add-on posts a persistent notification reminder.

## One-time HA setup

1. Install / Update add-on **5.1.3**, start, wait for first sync.
2. Merge configuration snippet (packages + YAML dashboard `dsc-hub-pro`).
3. Restart Home Assistant once.
4. Remove duplicate DSC automation ids from UI if present.
5. Set `input_text.dsc_notify_service` to your notify entity.
6. Confirm `/config/www/dsc-system-map-card.js` is ~846 KB (not ~10 KB).

## Options

| Option | Default | Meaning |
|---|---|---|
| `repository` | `https://github.com/weddas/DSC-HUB.git` | Git remote |
| `ref` | `master` | Branch or tag |
| `poll_seconds` | `60` | Fetch interval |
| `sync_www` | `true` | Bundle + install www cards / SVG / vendor |
| `sync_esphome` | **`true`** | Overwrite ESPHome stubs and copy `dsc_fleet_setup` component |
| `reload_after_sync` | `true` | Broader reload set |

## Private repos

Use a deploy key or HTTPS token in the `repository` URL the Supervisor can reach.
Auth failures appear clearly in the add-on log (no silent empty sync).

## Support

[INSTALL.md](https://github.com/weddas/DSC-HUB/INSTALL.md) ·
[UPGRADE.md](https://github.com/weddas/DSC-HUB/UPGRADE.md) ·
[scripts/ADDON.md](https://github.com/weddas/DSC-HUB/blob/master/scripts/ADDON.md) ·
[docs/qa/LIVE-UI-WWW-BUNDLE-GUARDS.md](https://github.com/weddas/DSC-HUB/blob/master/docs/qa/LIVE-UI-WWW-BUNDLE-GUARDS.md) ·
[docs/qa/ADDON-QA-5.1.0.md](https://github.com/weddas/DSC-HUB/blob/master/docs/qa/ADDON-QA-5.1.0.md)
