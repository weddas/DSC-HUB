# DSC-HUB Sync — Home Assistant add-on

**Primary delivery** for packages, automations, Pro dashboard, www, and ESPHome
stubs on HAOS. **v5.1.3** concatenates SYSTEM MAP + AIRFLOW into
`/config/www/dsc-system-map-card.js` (and `DSC-HUB.js`) so one `/local`
Lovelace resource registers both custom elements.

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
DSC-HUB Sync 5.1.3 ──stage/cp──► /config/packages|dashboards|www|esphome
    │                              + dsc-hub-sync.version + sync SHA sensor
    │                              www: SVG + bundled card JS (+ standalone airflow)
    └── Supervisor API ──► core / automation / script / template / lovelace reload
```

Sources: [`dsc-hub-sync/`](../dsc-hub-sync/) · [`repository.yaml`](../repository.yaml).

Card publish contract (source vs bundle): [`HACS-FRONTEND.md`](HACS-FRONTEND.md).

## Related

| Channel | Role |
|---|---|
| **This add-on** | HA surfaces + stubs + www card **bundle** (≥5.1.3) |
| HACS Dashboard | Optional SYSTEM MAP + AIRFLOW — [`HACS-FRONTEND.md`](HACS-FRONTEND.md) |
| [`ha-sync.sh`](ha-sync.sh) | Non-HAOS alternate (same www bundle) |
| ESPHome Install | Firmware only (manual) |

QA: [`docs/qa/ADDON-QA-5.1.0.md`](../docs/qa/ADDON-QA-5.1.0.md) ·
airflow smoke: [`docs/qa/LIVE-UI-AIRFLOW-STATUS.md`](../docs/qa/LIVE-UI-AIRFLOW-STATUS.md)
