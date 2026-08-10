# DSC-HUB — Upgrade

**New installs:** [`INSTALL.md`](INSTALL.md) for the **live train** (firmware **5.2.0** · HA surface **6.2.0**).  
**Version model:** [`docs/qa/VERSION-TRAINS.md`](docs/qa/VERSION-TRAINS.md)

Repo: https://github.com/weddas/DSC-HUB · last tag **`v5.1.0`** · branch **`master`** (ahead of tag)

---

## Live train (5.1.x → firmware 5.2.0 + HA surface 6.2.0)

Use this for any Sync HAOS already on a 5.1.x cut (or mixed post-tag patches).

1. Push / pull current **`master`** (live train; marketing tag may still be `v5.1.0`).
2. On **each** HAOS: Supervisor → **Update DSC-HUB Sync** to **5.1.4+** → Start/restart.
3. Confirm log “Synced to …” and `/config/dsc-hub-sync.version`.
4. Keep `sync_esphome: true` (default for 5.1+ installs).
5. **Restart HA Core once** — new `input_*` / panel / pot-tent helpers need restart.
6. Confirm:
   - `sensor.dsc_ha_surface_version` = **6.2.0**
   - `input_text.dsc_expected_release` = **5.2.0** (firmware only — do not set to `6.2.0`)
   - Sidebar **DSC-HUB** → `/dsc-hub` (React panel) when `dsc_hub:` is enabled
7. Disable leftover storage dashboards named DSC-HUB / `dsc-hub-v4` if still present.
8. ESPHome: Validate/Install every device to firmware **5.2.0** (hub → Control → pots → bridge → Sonoffs).
9. Fleet chip → **ok** (firmware major.minor). Surface **6.2.0** beside firmware **5.2.0** is expected.

### Behavioral notes (still true)

- Phase B writes **only** `number.dsc_hub_ladder_wait_*` — never failsafe / min-off / fans.
- Hub reconnect: safe-off + follower resync only (**no** snapshot restore).
- Notify: set `input_text.dsc_notify_service` (replaces hardcoded mobile_app targets).
- Orphan automations: remove any leftover UI ids matching old `dsc_v24_*` / duplicate followers.
- Lab door magnet entity `lock.4x8_humidifier_photo_lab_lock` is a **room door release**
  (label fixed on dashboard; entity id unchanged).
- SoftAP-primary membership + bridge ESP-NOW: [`docs/brain/F010_APPLIANCE_BRIDGE.md`](docs/brain/F010_APPLIANCE_BRIDGE.md).
- Surface string lockstep (package + `SURFACE_VERSION` + panel fallbacks): [`docs/qa/LIVE-UI-CUSTOM-PANEL.md`](docs/qa/LIVE-UI-CUSTOM-PANEL.md).

---

## 5.0.0 → 5.1.0 (tagged cut — historical)

Use only when catching a site still below the **v5.1.0** tag before joining the live train above.

1. Push / pull tag **`v5.1.0`** (or `master` containing it).
2. On **each** HAOS: Supervisor → **Update DSC-HUB Sync** to **5.1.0** → Start/restart.
3. Confirm log “Synced to …” and `/config/dsc-hub-sync.version` shows `version=5.1.0`.
4. If options still have `sync_esphome: false`, set **true** (5.1 default for new installs).
5. **Restart HA Core once** — new `input_*` / Phase B / version helpers need restart.
6. Confirm `/dsc-hub-pro/home`, fleet helpers present, Learning Phase B **off**.
7. Disable leftover storage dashboards named DSC-HUB / `dsc-hub-v4` (Pro YAML only).
8. ESPHome: Update All / Install every device to firmware **5.1.0** (lab + field kits).
9. Then continue with **Live train** steps to reach firmware **5.2.0** / surface **6.2.0**.

---

## Legacy v2.4 / early v4 → Sync workflow

Use this section only when migrating an **already-running** old site onto git-pull
ESPHome + Sync add-on.

### A. Delete old HA packages

Remove duplicates before adding `dsc_v4_*` (same `unique_id`s create silent `*_2` entities):

- `dsc_dashboard_v3.yaml`, `dsc_v24_*`, old `dsc_tank` / `dsc_pots_*` / `dsc_alert_count`
- Any older core helpers that redefine `dsc_hub_link`, fan %, tank EC

### B. Install the HA pack

1. Prefer Sync add-on **5.1.4+** over hand-copy.
2. Merge [`configuration.snippet.yaml`](homeassistant/configuration.snippet.yaml) —
   dashboard keys **`dsc-hub-pro`** + **`dsc-build-plant`** (remove `dsc-hub-v4:`).
   Enable `dsc_hub:` for the React panel when ready.
3. Restart HA; remove duplicate DSC automations from UI storage.
4. Cut over storage Pro → YAML Pro (delete storage dashboard, restart once).

### C. ESPHome stubs + flash

1. Stubs from [`homeassistant/esphome/`](homeassistant/esphome/) with `ref: master` (or current tag)
2. Keep `secrets.yaml`; match `hub_mac` / `panel_mac` / `espnow_cmd_tag` **54727**
3. Flash hub → panel → pots → bridge → Sonoffs when firmware packages change

### Post-flash checks

- [ ] Firmware entities = **5.2.0** (major.minor train)
- [ ] `sensor.dsc_ha_surface_version` = **6.2.0**
- [ ] Fleet status **ok** (firmware only)
- [ ] Panel ESP-NOW UP; Sonoff followers OK (bridge path preferred)
- [ ] No `*_2` twin entities
- [ ] Tank EC scale via `input_number.dsc_tank_ec_multiplier`

### Rollback

Restore last-good packages/dashboard (Sync keeps a snapshot) or prior firmware builds.
Hub and panel must share a matching `espnow_cmd_tag`.

---

## Day-to-day

```
push master → Sync (~60s) → optional Core restart for new helpers
           → ESPHome Install (manual, per device)
```

See [`RELEASE.md`](RELEASE.md) · [`docs/qa/VERSION-TRAINS.md`](docs/qa/VERSION-TRAINS.md) ·
[`docs/qa/ADDON-QA-5.1.0.md`](docs/qa/ADDON-QA-5.1.0.md).
