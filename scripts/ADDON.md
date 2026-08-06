# DSC-HUB Sync — Home Assistant add-on

**Primary delivery** for packages, automations, Pro + Build a Plant dashboards,
www (incl. `/local/dsc-catalog/`), and ESPHome stubs on HAOS. Add-on **5.1.4**
concatenates Build a Plant into `DSC-HUB.js` (parity with `ha-sync.sh`).
**v5.1.0** defaults `sync_esphome: true` and writes a version/SHA marker.

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
DSC-HUB Sync 5.1.4 ──stage/cp──► /config/packages|dashboards|www|esphome
    │                              + dsc-catalog + dsc-hub-sync.version
    └── Supervisor API ──► core / automation / script / template reload
```

Sources: [`dsc-hub-sync/`](../dsc-hub-sync/) · [`repository.yaml`](../repository.yaml).

**5.1.4 delta:** stages `dsc-build-plant-dashboard.yaml`, appends
`dsc-build-plant-card.js` to the www bundle, copies `www/dsc-catalog/*.json`.
Rebuild the add-on after Update — Sync ≤5.1.3 stopped concat at The Dash and
could demote a HACS-complete live bundle (**N-084**).

## Related

| Channel | Role |
|---|---|
| **This add-on** | HA surfaces + stubs |
| HACS Dashboard | Cards (element only for Build a Plant) — [`HACS-FRONTEND.md`](HACS-FRONTEND.md) |
| [`ha-sync.sh`](ha-sync.sh) | Non-HAOS alternate (already had Build a Plant) |
| ESPHome Install | Firmware only (manual) |

QA: [`docs/qa/ADDON-QA-5.1.0.md`](../docs/qa/ADDON-QA-5.1.0.md) ·
Build a Plant: [`docs/qa/LIVE-UI-BUILD-A-PLANT.md`](../docs/qa/LIVE-UI-BUILD-A-PLANT.md)
