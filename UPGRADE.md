# DSC-HUB — Upgrade

**New installs:** [`INSTALL.md`](INSTALL.md) for **v5.1.0**.

Repo: https://github.com/weddas/DSC-HUB · tag **`v5.1.0`** · branch **`master`**

---

## 5.0.0 → 5.1.0 (all Sync HAOS)

1. Push / pull tag **`v5.1.0`** (or `master` containing it).
2. On **each** HAOS: Supervisor → **Update DSC-HUB Sync** to **5.1.0** → Start/restart.
3. Confirm log “Synced to …” and `/config/dsc-hub-sync.version` shows `version=5.1.0`.
4. If options still have `sync_esphome: false`, set **true** (5.1 default for new installs).
5. **Restart HA Core once** — new `input_*` / Phase B / version helpers need restart.
6. Confirm `/dsc-hub-pro/home`, fleet chip HA surface **5.1.0**, Learning Phase B **off**.
7. Disable leftover storage dashboards named DSC-HUB / `dsc-hub-v4` (Pro YAML only).
8. ESPHome: Update All / Install every device to firmware **5.1.0** (lab + field kits).
9. Fleet chip → **ok**.

### Behavioral notes

- Phase B writes **only** `number.dsc_hub_ladder_wait_*` — never failsafe / min-off / fans.
- Hub reconnect: safe-off + follower resync only (**no** snapshot restore).
- Notify: set `input_text.dsc_notify_service` (replaces hardcoded mobile_app targets).
- Orphan automations: remove any leftover UI ids matching old `dsc_v24_*` / duplicate followers.
- Lab door magnet entity `lock.4x8_humidifier_photo_lab_lock` is a **room door release**
  (label fixed on dashboard; entity id unchanged).

---

## Legacy v2.4 / early v4 → Sync workflow

Use this section only when migrating an **already-running** old site onto git-pull
ESPHome + Sync add-on.

### A. Delete old HA packages

Remove duplicates before adding `dsc_v4_*` (same `unique_id`s create silent `*_2` entities):

- `dsc_dashboard_v3.yaml`, `dsc_v24_*`, old `dsc_tank` / `dsc_pots_*` / `dsc_alert_count`
- Any older core helpers that redefine `dsc_hub_link`, fan %, tank EC

### B. Install the v5.1 HA pack

1. Prefer Sync add-on **5.1.0** over hand-copy.
2. Merge [`configuration.snippet.yaml`](homeassistant/configuration.snippet.yaml) —
   dashboard key **`dsc-hub-pro`** only (remove `dsc-hub-v4:`).
3. Restart HA; remove duplicate DSC automations from UI storage.
4. Cut over storage Pro → YAML Pro (delete storage dashboard, restart once).

### C. ESPHome stubs + flash

1. Stubs from [`homeassistant/esphome/`](homeassistant/esphome/) with `ref: v5.1.0`
2. Keep `secrets.yaml`; match `hub_mac` / `panel_mac` / `espnow_cmd_tag` **54727**
3. Flash hub → panel → pots → Sonoffs when firmware packages change

### Post-flash checks

- [ ] Firmware entities = **5.1.0**
- [ ] Fleet status **ok**
- [ ] Panel ESP-NOW UP; Sonoff followers OK
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

### Sync add-on after the `v5.1.0` tag

On each HAOS, Supervisor **Update** to Sync **5.1.2** (not only the 5.1.0
release binary). That revision stages `firmware/v4/components/dsc_fleet_setup`
into `/config/esphome/components/` so kit SoftAP Validate works. HA packages on
`master` report surface **5.1.1** via `sensor.dsc_ha_surface_version`; the sync
marker’s `surface_version` may still read **5.1.0** (train label).

See [`dsc-hub-sync/DOCS.md`](dsc-hub-sync/DOCS.md) · [`RELEASE.md`](RELEASE.md) ·
[`docs/qa/ADDON-QA-5.1.0.md`](docs/qa/ADDON-QA-5.1.0.md).
