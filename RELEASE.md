# DSC-HUB v4 — Release notes / cutover map

Canonical how-to:

- **Fresh install:** [`INSTALL.md`](INSTALL.md)
- **Upgrade from live v2.4 / early v4:** [`UPGRADE.md`](UPGRADE.md)
- **HA detail:** [`homeassistant/README.md`](homeassistant/README.md)
- **ESPHome stubs:** [`homeassistant/esphome/README.md`](homeassistant/esphome/README.md)

Repo: https://github.com/weddas/DSC-HUB · **`master`**

---

## What this release is

| Layer | State |
|---|---|
| Firmware package bodies | Remote-git safe (no `!secret` in bodies) |
| Local stubs (`firmware/v4/dsc-*.yaml`) | Secrets + MACs/tag; `!include` bodies |
| HA stubs (`homeassistant/esphome/`) | Pull bodies from GitHub `@master` |
| HA helpers | All `homeassistant/packages/dsc_v4_*.yaml` |
| Automations | Demand followers + safety nets + scribe |
| Dashboard | `dsc-hub-v4-dashboard.yaml` UX **v0.2** (URL **`dsc-hub-v4`**) |
| Hub ↔ panel tag | **`54727` (`0xD5C7`)** |
| Panel | **DSC-CONTROL 4.0.11** |
| Hub mat votes | `switch.dsc_hub_mat_vote_pot_1`…`4` (POT3 defaults OFF) |

### Recent cut (docs + flash notes)

- **Panel package YAML hotfix:** Restored `#` on the v4.0.11 header changelog lines in `dsc-control-common.yaml` — uncommented `v4.0.11:` made HA git-pull Install fail (`not a valid YAML file` / `expected '<document start>'` at `substitutions:`). Docs: see Panel reconnect table in [`firmware/v4/README.md`](firmware/v4/README.md). No firmware behaviour change — re-Validate / Install after pull.
- **Panel binary_sensor parking (ESPHome 2026.7):** `binary_sensor.template` rejects `update_interval` — stripped invalid `update_interval: never` + unused lambdas (UI already reads `gv_*`). Sensor/text_sensor mirrors still use `update_interval: never`.
- **Phase 1 optimise (4.0.11):** Panel `refresh_ui` reads `gv_*` live (mirrors parked); hub+panel 30 s Wi‑Fi channel poll; pots/Sonoffs `power_save_mode: none` + logger INFO; Sonoff/HA demand re-assert after failsafe; HA alert-count pinned entity list; dashboard Home/Trends lightened; Tank EC gauge `max: 3000`.
- **Panel 4.0.10:** Page-gated `refresh_ui` @ 5 s + slower template mirrors — fixes A8 glyph / task-WDT reboot loops after HA connected on 4.0.9. USB flash recommended until stable.
- **Panel 4.0.9:** HA API plaintext + mDNS disabled — fixes Noise `HANDSHAKESTATE_SETUP_FAILED` → heap double-free. Add by IP with **no** encryption key.
- **Hub:** per-pot grow-mat vote switches — exclude a dying probe without a reflash.
- **Panel 4.0.8:** Soil NPK drill-down; hold-to-lock; tap-challenge; Connections link health; Pulse VPD micro-trend.
- **Dashboard v0.2:** Home nav chips; narrator collapsed; Root Zone nested (mat votes source of truth).

**Flash / apply (this cut):**

| Piece | How it lands | Manual HA step? |
|---|---|---|
| Panel 4.0.11 | ESPHome Install (**USB** if heap-sensitive) | None if already on plaintext API |
| Hub channel poll | ESPHome Install (hub OTA) | No |
| Pots + Sonoffs | ESPHome Install (OTA) | No |
| Dashboard lighten + Tank EC gauge | **Not** via OTA | Re-paste `dsc-hub-v4-dashboard.yaml` |
| `dsc_v4_alert_count.yaml` | Package swap | Restart / reload template entities |
| `automations.yaml` followers | Merge | Reload automations |

This cut: **flash pots/Sonoffs → hub → panel 4.0.11**, then Beyond-OTA paste alert-count package + automations + dashboard. Wire contract / tag `54727` unchanged.

---

## Beyond OTA — what never auto-updates

ESPHome **Validate/Install** (OTA or USB) only updates device firmware pulled from git stubs. These HA surfaces are **copied by hand** and stay stale until you swap them:

| Surface | Path | When you must re-apply |
|---|---|---|
| Lovelace dashboard | `homeassistant/dashboards/dsc-hub-v4-dashboard.yaml` | Any dashboard UX / entity layout change |
| Helper packages | `homeassistant/packages/dsc_v4_*.yaml` | New sensors, templates, unique_ids, helper renames |
| Automations | `homeassistant/automations.yaml` | New followers, alerts, scribe rules |

**Rule of thumb:** if the commit message or “Recent cut” table says dashboard / packages / automations changed, OTA alone is incomplete — do the HA paste/copy + restart before expecting the UI to match.

Day-to-day firmware-only edits:

```
Cursor edit → commit/push → ESPHome Validate/Install (affected devices only)
```

Hub + panel: flash together when tag, MAC, or `0xD*` wire contract changes.

---

## Quick checklist (upgrade path)

1. [ ] Push/pull this `master` (HA stubs need it online)
2. [ ] Delete old DSC packages on HA (`dsc_dashboard_v3`, `dsc_tank`, `dsc_pots_*`, …)
3. [ ] Install all `dsc_v4_*.yaml` packages + merge automations + new dashboard URL
4. [ ] Replace ESPHome device YAMLs with `homeassistant/esphome/` stubs
5. [ ] Restart HA → Validate → flash hub then panel (if tag changed) → pots/Sonoffs as needed
6. [ ] Verify ESP-NOW, followers, tank EC, alert count chip
7. [ ] After incremental cuts: check **Beyond OTA** — re-paste dashboard / swap helpers if listed

Full steps: [`UPGRADE.md`](UPGRADE.md).

---

## Not in this release (hardware / product backlog)

- POT3 soil-probe replacement
- SCD41 true CO₂
- Clone humidifier / mister + follower
- WT32-ETH01 gateway
- 4×8 light on GPIO5
- Panel v0.2 remainder: per-device power pages, VPD curve editor, canvas charts
  (4.0.7 soil NPK · 4.0.8 hold/gate/link · 4.0.9 plaintext API · 4.0.10 page-gated refresh · 4.0.11 gv_* live UI)
  LDR auto-dim still deferred
