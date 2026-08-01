# DSC-HUB Sync add-on

Pulls [weddas/DSC-HUB](https://github.com/weddas/DSC-HUB) and copies the HA
surfaces into `/config` whenever the tracked git ref moves (default: `master`).

## What it syncs

| Repo path | HA destination |
|---|---|
| `homeassistant/packages/dsc_v4_*.yaml` | `/config/packages/` |
| `homeassistant/dashboards/dsc-hub-v4-dashboard.yaml` | `/config/dashboards/` |
| `homeassistant/www/dsc-system-map.*` | `/config/www/` (optional) |
| `homeassistant/esphome/dsc-*.yaml` | `/config/esphome/` (optional, off by default) |

Never touches `secrets.yaml` or `.storage/`.

After each sync it reloads packages + automations via the Supervisor Core API
(optional).

## One-time HA setup

1. Install this add-on, start it, wait for the first sync.
2. Merge [`homeassistant/configuration.snippet.yaml`](https://github.com/weddas/DSC-HUB/blob/master/homeassistant/configuration.snippet.yaml)
   into `/config/configuration.yaml` (packages + YAML-mode dashboard `dsc-hub-pro`).
3. Restart Home Assistant once.
4. If you previously pasted DSC automations into the UI / `automations.yaml`,
   delete those duplicate ids (they now live in `packages/dsc_v4_automations.yaml`).
5. Optional: install the SYSTEM MAP card via HACS Dashboard custom repo, or rely
   on the `www/` files this add-on syncs.

## Options

| Option | Default | Meaning |
|---|---|---|
| `repository` | `https://github.com/weddas/DSC-HUB.git` | Git remote |
| `ref` | `master` | Branch or tag |
| `poll_seconds` | `60` | How often to fetch GitHub |
| `sync_www` | `true` | Copy SYSTEM MAP assets |
| `sync_esphome` | `false` | Also overwrite ESPHome stubs |
| `reload_after_sync` | `true` | Reload packages / automations after copy |

## Force a sync

Restart the add-on, or push a new commit to `master` and wait up to `poll_seconds`.

## Support

Repo docs: [INSTALL.md](https://github.com/weddas/DSC-HUB/blob/master/INSTALL.md) ·
[scripts/ADDON.md](https://github.com/weddas/DSC-HUB/blob/master/scripts/ADDON.md)
