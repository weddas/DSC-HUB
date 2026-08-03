# DSC-HUB Sync add-on

Pulls [weddas/DSC-HUB](https://github.com/weddas/DSC-HUB) and copies HA surfaces
into `/config` whenever the tracked git ref moves (default: `master`).

**Add-on version:** **5.1.2** (also syncs `esphome/components/dsc_fleet_setup`; HA surface still **5.1.0**)

## What it syncs

| Repo path | HA destination |
|---|---|
| `homeassistant/packages/dsc_v4_*.yaml` | `/config/packages/` |
| `homeassistant/dashboards/dsc-hub-v4-dashboard.yaml` | `/config/dashboards/` |
| `homeassistant/www/dsc-system-map.*` | `/config/www/` (default on) |
| `homeassistant/esphome/dsc-*.yaml` | `/config/esphome/` (**default on** in 5.1.0) |

Also writes:

- `/config/dsc-hub-sync.version` — surface version + SHA
- `/config/packages/dsc_v4_sync_marker.yaml` — `sensor.dsc_hub_sync_sha`

Never touches `secrets.yaml` or `.storage/`. Never auto-flashes ESP devices.
(Contrast: Unraid [`ha-sync.sh`](../scripts/ha-sync.sh) may rewrite only the
`/local/dsc-system-map-card.js?v=` entry in `lovelace_resources` for cache-bust —
this add-on does not; operators bump Resources manually after a card-bundle
change. See [`HA-SYNC-BOOTSTRAP.md`](../scripts/HA-SYNC-BOOTSTRAP.md) §5 / N-020.)

Copies are staged under `/data/sync_stage` then promoted; on failure the add-on
restores the last-good snapshot under `/data/last_good_sync`.

## Reloads (when `reload_after_sync`)

`homeassistant.reload_core_config`, `automation.reload`, `script.reload`,
`template.reload`, `lovelace.reload`.

**Restart HA Core once** after a major cut (new `input_*` helpers) — reload alone
often does not create them. The add-on posts a persistent notification reminder.

## One-time HA setup

1. Install / Update add-on **5.1.0**, start, wait for first sync.
2. Merge configuration snippet (packages + YAML dashboard `dsc-hub-pro`).
3. Restart Home Assistant once.
4. Remove duplicate DSC automation ids from UI if present.
5. Set `input_text.dsc_notify_service` to your notify entity.

## Options

| Option | Default (5.1.0) | Meaning |
|---|---|---|
| `repository` | `https://github.com/weddas/DSC-HUB.git` | Git remote |
| `ref` | `master` | Branch or tag |
| `poll_seconds` | `60` | Fetch interval |
| `sync_www` | `true` | SYSTEM MAP assets |
| `sync_esphome` | **`true`** | Overwrite ESPHome stubs (`ref: v5.1.0`) and copy `firmware/v4/components` → `/config/esphome/components` |
| `reload_after_sync` | `true` | Broader reload set |

## Private repos

Use a deploy key or HTTPS token in the `repository` URL the Supervisor can reach.
Auth failures appear clearly in the add-on log (no silent empty sync).

## Support

[INSTALL.md](https://github.com/weddas/DSC-HUB/INSTALL.md) ·
[UPGRADE.md](https://github.com/weddas/DSC-HUB/UPGRADE.md) ·
[scripts/ADDON.md](https://github.com/weddas/DSC-HUB/blob/master/scripts/ADDON.md) ·
[docs/qa/ADDON-QA-5.1.0.md](https://github.com/weddas/DSC-HUB/blob/master/docs/qa/ADDON-QA-5.1.0.md)
