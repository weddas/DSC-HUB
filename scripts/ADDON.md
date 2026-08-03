# DSC-HUB Sync — Home Assistant add-on

**Primary delivery** for packages, automations, Pro dashboard, www, and ESPHome
stubs on HAOS. **v5.1.0** defaults `sync_esphome: true` and writes a version/SHA marker.

## Install (once)

1. Settings → Add-ons → Repositories → `https://github.com/weddas/DSC-HUB`
2. Install **DSC-HUB Sync** → **Start**
3. Defaults: `ref: master`, `poll_seconds: 60`, `sync_esphome: true`
4. Log shows “Synced to …” · `/config/dsc-hub-sync.version` present
5. Merge [`configuration.snippet.yaml`](../homeassistant/configuration.snippet.yaml)
   → **restart HA once**
6. Remove duplicate DSC automations from the UI if needed

**Push to `master` → within ~60s** packages / dashboard / www / stubs update.
Device firmware: **manual** ESPHome Install only.

## Architecture

```
GitHub master / tag
    │  (poll)
    ▼
DSC-HUB Sync 5.1.0 ──stage/cp──► /config/packages|dashboards|www|esphome
    │                              + dsc-hub-sync.version + sync SHA sensor
    └── Supervisor API ──► core / automation / script / template / lovelace reload
```

Sources: [`dsc-hub-sync/`](../dsc-hub-sync/) · [`repository.yaml`](../repository.yaml).

## Related

| Channel | Role |
|---|---|
| **This add-on** | HA surfaces + stubs (primary on HAOS) |
| HACS Dashboard | Optional SYSTEM MAP / airflow — [`HACS-FRONTEND.md`](HACS-FRONTEND.md) |
| GHA **HA sync** + [`ha-sync.sh`](ha-sync.sh) | Alternate / backup path via Unraid `unraid-ha-deploy` — [`HA-SYNC-BOOTSTRAP.md`](HA-SYNC-BOOTSTRAP.md) |
| ESPHome Install | Firmware only (manual) |

Sites running **both** add-on and GHA: either path can land packages; gate on
`sensor.dsc_ha_surface_version`. Keep the Unraid runner Autostart ON so the
GHA path does not silently queue forever after a host reboot.

QA: [`docs/qa/ADDON-QA-5.1.0.md`](../docs/qa/ADDON-QA-5.1.0.md) ·
post-deploy soak: [`docs/qa/LIVE-SOAK-5.1.4.md`](../docs/qa/LIVE-SOAK-5.1.4.md)
