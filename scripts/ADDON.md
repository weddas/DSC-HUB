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
DSC-HUB Sync ──stage/cp──► /config/packages|dashboards(+modules)|www|esphome
    │                        + dsc-hub-sync.version + sync SHA sensor
    └── Supervisor API ──► core / automation / script / template / lovelace reload
```

**Dashboard:** copies the Pro shell **and** `dashboards/modules/view_*.yaml`
(required for `!include` views — missing modules → empty/Unnamed tabs).

**www:** concatenates system-map + airflow + `vendor/three.min.js` +
`dsc-the-dash-card.js` into `/config/www/dsc-system-map-card.js` (and
`DSC-HUB.js`). Expect **~800 KB**. Older add-on images that copy
system-map-only (~10 KB) break AIRFLOW and The Dash (F-011).

Sources: [`dsc-hub-sync/`](../dsc-hub-sync/) · [`repository.yaml`](../repository.yaml).
The Dash ops: [`docs/qa/LIVE-UI-THE-DASH.md`](../docs/qa/LIVE-UI-THE-DASH.md).

## Related

| Channel | Role |
|---|---|
| **This add-on** | HA surfaces + stubs |
| HACS Dashboard | Optional card bundle — [`HACS-FRONTEND.md`](HACS-FRONTEND.md) |
| [`ha-sync.sh`](ha-sync.sh) | Non-HAOS alternate (+ Lovelace `?v=` cache-bust) |
| ESPHome Install | Firmware only (manual) |

QA: [`docs/qa/ADDON-QA-5.1.0.md`](../docs/qa/ADDON-QA-5.1.0.md)
