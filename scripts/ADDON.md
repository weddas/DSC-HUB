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
| **This add-on** | HA surfaces + stubs |
| HACS Dashboard | Optional SYSTEM MAP — [`HACS-FRONTEND.md`](HACS-FRONTEND.md) |
| [`ha-sync.sh`](ha-sync.sh) | Non-HAOS alternate (+ Lovelace `?v=` cache-bust) |
| ESPHome Install | Firmware only (manual) |

### Lovelace cache note

Unlike [`ha-sync.sh`](ha-sync.sh) (which rewrites
`/local/dsc-system-map-card.js?v=` in `.storage/lovelace_resources`), this
add-on **does not** touch `.storage/`. After a www card-bundle change on a
Sync-primary site, bump the resource query in
**Settings → Dashboards → Resources** (or hard-refresh) so browsers drop the
pre-bundle script. Runbook: [`HA-SYNC-BOOTSTRAP.md`](HA-SYNC-BOOTSTRAP.md) §5;
follow-up **N-020**.

QA: [`docs/qa/ADDON-QA-5.1.0.md`](../docs/qa/ADDON-QA-5.1.0.md)
