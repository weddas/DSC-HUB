# DSC-HUB Sync — Home Assistant add-on

**Primary delivery** for packages, automations, Pro dashboard, www, ESPHome
stubs, and the `dsc_fleet_setup` ESPHome component on HAOS.

**Add-on binary:** **5.1.2** · HA surface packages: **5.1.1** · Sync marker train label: **5.1.0**

## Install (once)

1. Settings → Add-ons → Repositories → `https://github.com/weddas/DSC-HUB`
2. Install **DSC-HUB Sync** → **Start** (or **Update** to **5.1.2**)
3. Defaults: `ref: master`, `poll_seconds: 60`, `sync_esphome: true`
4. Log shows “Synced to …” · `/config/dsc-hub-sync.version` present
5. Confirm `/config/esphome/components/dsc_fleet_setup` exists (needed for kit SoftAP Validate)
6. Merge [`configuration.snippet.yaml`](../homeassistant/configuration.snippet.yaml)
   → **restart HA once**
7. Remove duplicate DSC automations from the UI if needed

**Push to `master` → within ~60s** packages / dashboard / www / stubs / component update.
Device firmware: **manual** ESPHome Install only.

## Architecture

```
GitHub master / tag
    │  (poll)
    ▼
DSC-HUB Sync 5.1.2 ──stage/cp──► /config/packages|dashboards|www|esphome
    │                              + esphome/components/dsc_fleet_setup
    │                              + dsc-hub-sync.version + sync SHA sensor
    └── Supervisor API ──► core / automation / script / template / themes reload
```

Sources: [`dsc-hub-sync/`](../dsc-hub-sync/) · [`repository.yaml`](../repository.yaml) ·
full ops notes: [`../dsc-hub-sync/DOCS.md`](../dsc-hub-sync/DOCS.md).

### Why 5.1.2 matters

`sync_esphome: true` now also stages
`firmware/v4/components/dsc_fleet_setup` → `/config/esphome/components/`.
Without that copy, kit SoftAP stubs fail Validate/Install on HAOS even when the
YAML stubs themselves synced correctly.

ESPHome stubs track **`ref: master`** (daily/immediate refresh), so package-body
fixes land without retagging `v5.1.0`. Firmware Install remains a separate manual
step per device.

## Related

| Channel | Role |
|---|---|
| **This add-on** | HA surfaces + stubs + fleet-setup component |
| HACS Dashboard | Optional SYSTEM MAP — [`HACS-FRONTEND.md`](HACS-FRONTEND.md) |
| [`ha-sync.sh`](ha-sync.sh) | Non-HAOS alternate |
| ESPHome Install | Firmware only (manual) |

QA: [`docs/qa/ADDON-QA-5.1.0.md`](../docs/qa/ADDON-QA-5.1.0.md)
