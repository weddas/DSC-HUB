# DSC-HUB v4 — Upgrade (from live v2.4 / early v4)

Use this when Home Assistant and the fleet are **already running** and you are
moving onto this repo’s git-pull ESPHome workflow + HA pack.

Fresh install? Use [`INSTALL.md`](INSTALL.md).

Repo: https://github.com/weddas/DSC-HUB · branch **`master`**

---

## What changes in this upgrade

| Area | Before (typical live) | After |
|---|---|---|
| ESPHome configs | Full YAML in `/config/esphome/` | Thin stubs + packages from GitHub |
| Hub flash file | `dsc-hub-v4_0.yaml` alone | **`dsc-hub.yaml`** stub |
| Panel flash file | Monolithic `dsc-control.yaml` | **`dsc-control.yaml`** stub → `dsc-control-common.yaml` |
| HA helpers | Ad-hoc `dsc_dashboard_v3`, `dsc_tank`, `dsc_pots_*`, etc. | `dsc_v4_*.yaml` packages only |
| Dashboard | Often `dsc-hub-v2-4` | URL **`dsc-hub-v4`** |
| `espnow_cmd_tag` | May still be `0xABCD` | **`54727` (`0xD5C7`)** — hub **and** panel |

---

## A. Delete old HA packages (required)

Remove these from `/config/packages/` (or disable them) **before** adding the new ones.
Same `unique_id`s left side-by-side create silent `*_2` entities the dashboard never sees:

- `dsc_dashboard_v3.yaml` (any spelling / copy)
- `dsc_v24_light_helpers.yaml` / `dsc-v24-light-helpers.yaml`
- `dsc_tank.yaml`
- `dsc_pots_stats.yaml` / `dsc_pots_correlation.yaml` / `dsc_pots_alerts.yaml`
- `dsc_alert_count.yaml`
- Any older reconstructed “core” helpers that redefine `dsc_hub_link`, fan %, airflow, tank EC

Keep unrelated house packages. Only remove DSC duplicates.

---

## B. Install the new HA pack

1. Copy **all** `homeassistant/packages/dsc_v4_*.yaml` → `/config/packages/`
   (underscores required — HA rejects hyphens in package filenames)
2. Merge [`homeassistant/automations.yaml`](homeassistant/automations.yaml)
   - Delete Rev A ids `dsc_v24_follow_*` if present (collide with `dsc_follower_*`)
   - If you already have `dsc_hub_offline_safe_off` / emergency alerts live, replace with the git copies (same ids) or delete the live duplicates first
3. Dashboard:
   - Prefer a **new** dashboard with URL **`dsc-hub-v4`**
   - Paste [`homeassistant/dashboards/dsc-hub-v4-dashboard.yaml`](homeassistant/dashboards/dsc-hub-v4-dashboard.yaml)
   - Retire or unlink the old `dsc-hub-v2-4` dashboard when happy
4. Entity registry (if still on historical names):
   - `text.dsc_potN_plant_name` / `select.dsc_potN_growth_stage` (no `4x8_` / `grow_tent_` prefixes)
5. Restart Home Assistant

---

## C. Swap ESPHome stubs

1. Backup `/config/esphome/` (copy aside)
2. Replace device YAMLs with [`homeassistant/esphome/dsc-*.yaml`](homeassistant/esphome/)
3. Confirm `/config/esphome/secrets.yaml` still has wifi + per-device keys + `espnow_key`
4. Edit stubs if needed: `hub_mac` / `panel_mac` / `espnow_cmd_tag` (must match both ends)
5. ESPHome → Validate each device
   - First pull after upgrade: temporarily set `refresh: 0d`, Validate, then set back to `1d`

---

## D. Flash firmware (order matters if tag rotated)

If hub/panel still share an old tag, you can flash one-at-a-time.
If moving to **54727**, flash **hub then panel in one sitting** (or panel will command into a void).

1. **Hub** — Install **`dsc-hub`** (stub), not the body alone  
2. **Panel** — Install **`dsc-control`**  
3. **Pots** — optional this pass if only HA/stubs changed; flash if pot-common changed  
4. **Sonoffs** — flash if sonoff-common changed  

### Post-flash checks

- [ ] Panel ESP-NOW row UP; command changes a hub number/switch
- [ ] `sensor.dsc_hub_firmware_version` = `4.0`
- [ ] `binary_sensor.dsc_hub_emergency_failsafe` exists
- [ ] Pot ESP-NOW link sensors present; mat still tracks soil temp
- [ ] Sonoff followers still mirror demand (test one appliance)
- [ ] No `*_2` twin entities for lights-on / tank EC / hub link
- [ ] Home alert chip shows a number (not `unknown`) — `sensor.dsc_active_alert_count`
- [ ] Tank EC in µS/cm; set `input_number.dsc_tank_ec_multiplier` to `1` or `1000` per your Tuya scale

---

## E. Rollback

- **HA only:** restore backed-up `/config/packages/` + old dashboard URL; restart
- **ESPHome stubs:** restore backed-up device YAMLs; Validate
- **Firmware:** reflash previous working builds from your backup / `_Archive_Legacy_Code` if needed  
  Hub and panel must stay on a **matching** `espnow_cmd_tag`

---

## Day-to-day after upgrade

```
Cursor edit → push master → ESPHome Validate/Install (affected devices only)
```

Do not edit package bodies only on the HA box — they will be overwritten on the next git refresh.

### Incremental updates (already on v4)

Firmware OTA is **not** enough when the cut also touches HA surfaces. Check [`RELEASE.md`](RELEASE.md) “Recent cut” + **Beyond OTA** before flashing:

| Changed in git | What you do on HA |
|---|---|
| `firmware/v4/*` only | ESPHome Validate/Install on affected devices |
| `dashboards/dsc-hub-v4-dashboard.yaml` | Re-paste into Lovelace raw editor (`dsc-hub-v4`) — **not** automatic |
| `packages/dsc_v4_*.yaml` | Copy/replace into `/config/packages/` → restart HA |
| `automations.yaml` | Merge/replace live automations → reload automations or restart |
| Panel boot-looping after UI flash | Prefer **USB** until boot log shows a clean `4.0.x up` line |

Example — current master cut: flash **hub** + **panel**, and **re-paste the dashboard**. Helpers/automations unchanged → no package swap.

See also: [`INSTALL.md`](INSTALL.md) · [`RELEASE.md`](RELEASE.md) · [`homeassistant/README.md`](homeassistant/README.md)
