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
| Panel | **DSC-CONTROL 4.0.8** |
| Hub mat votes | `switch.dsc_hub_mat_vote_pot_1`…`4` (POT3 defaults OFF) |

### Recent cut (docs + flash notes)

- **Hub:** per-pot grow-mat vote switches — exclude a dying probe without a reflash.
- **Panel 4.0.8:** Soil NPK drill-down (0xD3/0xD4); hold-to-lock on primary pages; tap-challenge for Manual Takeover + appliance demands; Connections shows Wi‑Fi channel + ESP-NOW RX age/TX seq; Pulse 1h VPD micro-trend (label only). Hold HUD is strcmp-guarded + 250 ms tap grace to avoid heap churn / boot loops.
- **Dashboard v0.2:** Home nav chips; narrator collapsed; Root Zone nested (mat votes source of truth); Climate mat expander links to Root Zone.

**Flash:** hub (mat votes) + panel **USB first** if the glass is looping; then OTA. Reload Lovelace raw config for dashboard UX.
---

## Quick checklist (upgrade path)

1. [ ] Push/pull this `master` (HA stubs need it online)
2. [ ] Delete old DSC packages on HA (`dsc_dashboard_v3`, `dsc_tank`, `dsc_pots_*`, …)
3. [ ] Install all `dsc_v4_*.yaml` packages + merge automations + new dashboard URL
4. [ ] Replace ESPHome device YAMLs with `homeassistant/esphome/` stubs
5. [ ] Restart HA → Validate → flash hub then panel (if tag changed) → pots/Sonoffs as needed
6. [ ] Verify ESP-NOW, followers, tank EC, alert count chip

Full steps: [`UPGRADE.md`](UPGRADE.md).

---

## Day-to-day

```
Cursor edit → commit/push → ESPHome Validate/Install (only affected devices)
```

Hub + panel: flash together when tag, MAC, or `0xD*` wire contract changes.

---

## Not in this release (hardware / product backlog)

- POT3 soil-probe replacement
- SCD41 true CO₂
- Clone humidifier / mister + follower
- WT32-ETH01 gateway
- 4×8 light on GPIO5
- Panel v0.2 remainder: per-device power pages, VPD curve editor, canvas charts
  (4.0.7 soil NPK detail · 4.0.8 hold-to-lock, demand gate, link health, VPD micro-trend)
  LDR auto-dim still deferred
