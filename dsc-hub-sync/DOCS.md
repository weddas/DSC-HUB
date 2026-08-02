# DSC-HUB Sync add-on

Pulls [weddas/DSC-HUB](https://github.com/weddas/DSC-HUB) and copies HA surfaces
into `/config` whenever the tracked git ref moves (default: `master`).

**Add-on version:** **5.1.2**

| Version surface | Who owns it | Current |
|---|---|---|
| Add-on binary (`config.yaml` `version`) | Supervisor Update | **5.1.2** |
| Sync marker `surface_version` (`SURFACE_VERSION` in script) | Add-on write | **5.1.0** (fleet train label) |
| HA packages / Pro dashboard | Synced YAML → `sensor.dsc_ha_surface_version` | **5.1.1** |

Do not conflate those three. Updating the add-on does not flash devices; syncing
packages does not bump the add-on binary.

## What it syncs

| Repo path | HA destination |
|---|---|
| `homeassistant/packages/dsc_v4_*.yaml` | `/config/packages/` |
| `homeassistant/dashboards/dsc-hub-v4-dashboard.yaml` | `/config/dashboards/` |
| `homeassistant/www/dsc-system-map.*` | `/config/www/` (default on) |
| `homeassistant/esphome/dsc-*.yaml` | `/config/esphome/` (**default on**) |
| `firmware/v4/components/dsc_fleet_setup/` | `/config/esphome/components/dsc_fleet_setup/` (**5.1.2**, with `sync_esphome`) |

Also writes:

- `/config/dsc-hub-sync.version` — marker `surface_version` + SHA
- `/config/packages/dsc_v4_sync_marker.yaml` — `sensor.dsc_hub_sync_sha`

Never touches `secrets.yaml` or `.storage/`. Never auto-flashes ESP devices.

Copies are staged under `/data/sync_stage` then promoted; on failure the add-on
restores the last-good snapshot under `/data/last_good_sync`.

## ESPHome stubs (important)

Synced stubs pull package bodies from GitHub with **`ref: master`** (not the
`v5.1.0` tag). Refresh intervals vary:

| Stub family | Typical `refresh` | Intent |
|---|---|---|
| Hub / panel | `0s` during active flash cycles | Pick up pushes immediately |
| Pots / Sonoffs | `1h` | Stable pull cadence |

Kit SoftAP YAML still needs `dsc_fleet_setup` on the HA host. **5.1.2** copies
that component beside the stubs so `esphome config` / Install does not fail with
a missing local `external_components` path. Lab stubs intentionally omit SoftAP
fleet-setup packages (compile-time WiFi + MACs).

## Reloads (when `reload_after_sync`)

`homeassistant.reload_core_config`, `automation.reload`, `script.reload`,
`template.reload`, `frontend.reload_themes`.

`lovelace.reload` is **not** called — it 400s on current HA Core; YAML dashboards
refresh on next navigation.

**Restart HA Core once** after a major cut (new `input_*` helpers) — reload alone
often does not create them. The add-on posts a persistent notification reminder.

## One-time HA setup

1. Install / Update add-on **5.1.2**, start, wait for first sync.
2. Merge configuration snippet (packages + YAML dashboard `dsc-hub-pro`).
3. Restart Home Assistant once.
4. Remove duplicate DSC automation ids from UI if present.
5. Set `input_text.dsc_notify_service` to your notify entity.
6. Confirm `/config/esphome/components/dsc_fleet_setup` exists before kit Validate.

## Options

| Option | Default | Meaning |
|---|---|---|
| `repository` | `https://github.com/weddas/DSC-HUB.git` | Git remote |
| `ref` | `master` | Branch or tag |
| `poll_seconds` | `60` | Fetch interval |
| `sync_www` | `true` | SYSTEM MAP assets |
| `sync_esphome` | **`true`** | Overwrite ESPHome stubs **and** copy `dsc_fleet_setup` |
| `reload_after_sync` | `true` | Broader reload set |

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Packages update but dashboard looks old | Browser / Lovelace cache | Hard-refresh; re-open `/dsc-hub-pro/…` |
| New `input_*` missing after sync | Reload ≠ create helpers | Restart HA Core once |
| Kit Validate: missing `dsc_fleet_setup` | Add-on older than 5.1.2 or `sync_esphome: false` | Update add-on; enable sync; wait one poll |
| Fleet chip HA surface lags | Packages not synced / Core not restarted | Check `sensor.dsc_ha_surface_version` (**5.1.1**) vs sync SHA |
| Sync marker still shows `5.1.0` | Expected — script train label | Use package sensor for surface train |
| Auth / empty sync | Bad token or `ref` | Read add-on log (failures are explicit) |

## Private repos

Use a deploy key or HTTPS token in the `repository` URL the Supervisor can reach.
Auth failures appear clearly in the add-on log (no silent empty sync).

## Support

[INSTALL.md](https://github.com/weddas/DSC-HUB/INSTALL.md) ·
[UPGRADE.md](https://github.com/weddas/DSC-HUB/UPGRADE.md) ·
[scripts/ADDON.md](https://github.com/weddas/DSC-HUB/blob/master/scripts/ADDON.md) ·
[docs/qa/ADDON-QA-5.1.0.md](https://github.com/weddas/DSC-HUB/blob/master/docs/qa/ADDON-QA-5.1.0.md)
