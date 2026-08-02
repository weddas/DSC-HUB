# DSC-HUB Sync add-on QA / QC — v5.1.x (add-on **5.1.2**)

Checklist filename kept for continuity with the 5.1 release train. Verify the
**add-on binary** is **5.1.2**; HA surface packages report **5.1.1**.

## Install / Update

- [ ] Supervisor shows add-on version **5.1.2**
- [ ] Defaults: `sync_esphome: true`, `sync_www: true`, `reload_after_sync: true`
- [ ] `ref: master` (or pin tag after cut) · auto-start enabled
- [ ] First start logs “Synced to …” and writes `/config/dsc-hub-sync.version`
- [ ] `packages/dsc_v4_sync_marker.yaml` created → `sensor.dsc_hub_sync_sha`
- [ ] `/config/esphome/components/dsc_fleet_setup` present after sync

## Push → sync contract

- [ ] Push test commit → watched HAOS sync within `poll_seconds`
- [ ] Lands: `dsc_v4_*.yaml`, Pro dashboard, www (if enabled), ESPHome stubs
- [ ] Lands: `esphome/components/dsc_fleet_setup` when `sync_esphome: true`
- [ ] Reloads: core config, automation, script, template, themes (not `lovelace.reload`)
- [ ] Persistent notification: synced SHA + restart hint for new helpers
- [ ] Restart HA Core once → Phase B helpers / version sensors present
- [ ] `sensor.dsc_ha_surface_version` = **5.1.1** (package train; marker may still say 5.1.0)

## Product surfaces

- [ ] `/dsc-hub-pro/home` only (no duplicate `dsc-hub-v4` sidebar)
- [ ] Dashboard header / QA notes match Pro **v5.1.1** (4-col + Browser Mod)
- [ ] Fleet chip: HA surface ok after sync; full **ok** only after firmware flash
- [ ] Learning Phase A+B UI loads; Phase B default **off**
- [ ] Door magnet card labeled room door release
- [ ] Notify uses `script.dsc_notify` / `input_text.dsc_notify_service`

## ESPHome stubs

- [ ] Stubs show `ref: master` (not pinned solely to `v5.1.0`)
- [ ] Hub/panel `refresh: 0s` during flash cycles (or raised later for stability)
- [ ] Kit Validate succeeds with local `components/dsc_fleet_setup`
- [ ] Lab Validate does **not** require SoftAP fleet-setup packages

## Negative paths

- [ ] Bad `ref` → clear error, no silent empty sync
- [ ] Failed copy → last-good rollback restores prior packages/dashboard
- [ ] Private repo: auth documented / token path works
- [ ] `sync_esphome: false` → stubs/components unchanged (document ops risk)

## Multi-system

- [ ] Second HAOS with Sync gets same packages without hand-copy
- [ ] Each HAOS Updates add-on **once** for **5.1.2** script/defaults

## Upgrade 5.0.0 → 5.1.x

- [ ] Update add-on → enable `sync_esphome` if still false on old options
- [ ] Confirm **5.1.2** so kit component path lands
- [ ] One Core restart for new `input_*`
- [ ] Orphan `dsc_v24_*` automations removed if any remain in UI storage

## Sign-off

| Role | Date | Notes |
|---|---|---|
| | | |
