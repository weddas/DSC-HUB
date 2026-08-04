# DSC-HUB Sync add-on QA / QC — v5.1.0+ (guards at **5.1.3**)

Baseline checklist from the 5.1.0 cut. **www cinematic guards require add-on
5.1.3** — see [`LIVE-UI-WWW-BUNDLE-GUARDS.md`](LIVE-UI-WWW-BUNDLE-GUARDS.md).

## Install / Update

- [ ] Supervisor shows add-on version **5.1.3** (Update if still on 5.1.2 or older)
- [ ] Defaults: `sync_esphome: true`, `sync_www: true`, `reload_after_sync: true`
- [ ] `ref: master` (or release tag after pin) · auto-start enabled
- [ ] First start logs “Synced to …” and writes `/config/dsc-hub-sync.version`
- [ ] `packages/dsc_v4_sync_marker.yaml` created → `sensor.dsc_hub_sync_sha`

## Push → sync contract

- [ ] Push test commit → watched HAOS sync within `poll_seconds`
- [ ] Lands: `dsc_v4_*.yaml`, Pro dashboard, `dashboards/modules/view_*.yaml`, www, ESPHome stubs
- [ ] www: `/config/www/dsc-system-map-card.js` **≥ 500000** bytes (~846 KB); equals `DSC-HUB.js`
- [ ] www vendor: `three.min.js` + `dsc-dash-fx.js` present under `/config/www/vendor/`
- [ ] Reloads: core config, automation, script, template, lovelace
- [ ] Persistent notification: synced SHA + restart hint for new helpers
- [ ] Restart HA Core once → Phase B helpers / version sensors present

## Product surfaces

- [ ] `/dsc-hub-pro/home` only (no duplicate `dsc-hub-v4` sidebar)
- [ ] Fleet chip: HA surface ok after sync; full **ok** only after firmware flash
- [ ] Learning Phase A+B UI loads; Phase B default **off**
- [ ] Door magnet card labeled room door release
- [ ] Notify uses `script.dsc_notify` / `input_text.dsc_notify_service`

## Negative paths

- [ ] Bad `ref` → clear error, no silent empty sync
- [ ] Failed copy → last-good rollback restores prior packages/dashboard
- [ ] Private repo: auth documented / token path works
- [ ] F-013: tiny staged bundle does **not** overwrite live ≥500 KB cinematic file
- [ ] Incomplete www inputs → dist fallback warn, or www card sync skipped (not map-only stub)

## Multi-system

- [ ] Second HAOS with Sync gets same packages without hand-copy
- [ ] Each HAOS Updates add-on **once** for **5.1.3** script/guards

## Upgrade 5.0.0 → 5.1.x / 5.1.2 → 5.1.3

- [ ] Update add-on → enable `sync_esphome` if still false on old options
- [ ] One Core restart for new `input_*`
- [ ] Orphan `dsc_v24_*` automations removed if any remain in UI storage
- [ ] After 5.1.3 Update: Dash/airflow elements present; bundle not ~10 KB

## Sign-off

| Role | Date | Notes |
|---|---|---|
| | | |
