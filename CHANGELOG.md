# Changelog

## v5.1.0 — 2026-08-01

- Force **5.1.0** across lab + kit firmwares, Sonoffs, Sync add-on, stubs, docs.
- Learn **Phase B** (opt-in): rate-limited HA→hub ladder wait bases only.
- Learning UI refresh (A+B), fleet version-status chip, coldest/hottest root sensors.
- Sync harden: `sync_esphome` default true, atomic stage + rollback, version/SHA marker,
  broader reloads, restart hint for new helpers.
- Notify via `input_text.dsc_notify_service`; door magnet UX; dead-demand / NO ACTUATOR cues.
- DSC-HUB Pro only (`dsc-hub-pro`); push updates all Sync-equipped HAOS (firmware still manual).

## v5.0.0

- First major cut: HAOS Sync add-on, automations package, YAML Lovelace `dsc-hub-pro`,
  hub firmware **5.0.0**, kit SoftAP path.
