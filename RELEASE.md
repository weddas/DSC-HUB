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
| HA helpers | All `homeassistant/packages/dsc-v4-*.yaml` |
| Automations | Demand followers + safety nets + scribe |
| Dashboard | `dsc-hub-v4-dashboard.yaml` (URL **`dsc-hub-v4`**) |
| Hub ↔ panel tag | **`54727` (`0xD5C7`)** |

---

## Quick checklist (upgrade path)

1. [ ] Push/pull this `master` (HA stubs need it online)
2. [ ] Delete old DSC packages on HA (`dsc_dashboard_v3`, `dsc_tank`, `dsc_pots_*`, …)
3. [ ] Install all `dsc-v4-*.yaml` packages + merge automations + new dashboard URL
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
- Panel v0.2 UI / LDR auto-dim
