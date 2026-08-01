# DSC-HUB Sync — Home Assistant add-on

**Primary delivery** for packages, automations, and the YAML dashboard on HAOS.

## Install (once)

1. Settings → Add-ons → ⋮ → **Repositories**
2. Add: `https://github.com/weddas/DSC-HUB`
3. Refresh → find **DSC-HUB Sync** → **Install**
4. Leave defaults (`ref: master`, `poll_seconds: 60`) → **Start**
5. Watch the add-on log until the first “Synced to …” line
6. Merge [`homeassistant/configuration.snippet.yaml`](../homeassistant/configuration.snippet.yaml)
   into `/config/configuration.yaml`, then **restart Home Assistant once**
7. Remove any duplicate DSC automations from the UI if you had them before

After that: **push to `master` → within ~60s HA packages / dashboard / www update**.

## Architecture

```
GitHub master
    │  (poll)
    ▼
DSC-HUB Sync add-on  ──cp──►  /config/packages|dashboards|www
    │
    └── Supervisor API ──► reload_core_config + automation.reload
```

Add-on sources live in [`dsc-hub-sync/`](../dsc-hub-sync/) · store metadata
[`repository.yaml`](../repository.yaml).

## Options

See add-on **Configuration** tab / [`dsc-hub-sync/DOCS.md`](../dsc-hub-sync/DOCS.md).

## Related

| Channel | Role |
|---|---|
| **This add-on** | Packages, automations package, dashboard YAML, optional www |
| HACS Dashboard | Optional SYSTEM MAP card install — [`HACS-FRONTEND.md`](HACS-FRONTEND.md) |
| [`ha-sync.sh`](ha-sync.sh) | Optional Unraid/GHA path if you are not on HAOS |
| ESPHome Validate/Install | Firmware only (manual) |
