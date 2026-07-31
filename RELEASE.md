# DSC-HUB **v4.0.0-alpha.1**

First published alpha of the v4 ESP-NOW-primary fleet. The release tag matches
the hub (primary brain) firmware string:

| | |
|---|---|
| **GitHub tag** | `v4.0.0-alpha.1` |
| **Hub** `sensor.dsc_hub_firmware_version` | **`4.0.0-alpha.1`** |
| **Panel** | DSC-CONTROL **4.0.11** |
| **Pots** | `dsc-pot-common` **4.0.1** |
| **Dashboard** | UX **v0.2** · URL **`dsc-hub-v4`** |
| **ESP-NOW tag** | **`54727` (`0xD5C7`)** on hub **and** panel |

**Install from scratch:** [`INSTALL.md`](INSTALL.md) (file → destination map).

Repo: https://github.com/weddas/DSC-HUB · branch **`master`**

---

## What this alpha is

| Layer | State |
|---|---|
| Hub climate + ESP-NOW primary | Live — Full Auto boot persist / re-arm |
| Panel glass ↔ hub | ESP-NOW primary; HA API plaintext (no Noise) |
| HA helpers | All `homeassistant/packages/dsc_v4_*.yaml` |
| Automations | Demand followers + safety nets + scribe |
| Dashboard | `dsc-hub-v4-dashboard.yaml` + optional SYSTEM MAP card |
| Pot/tank push notifiers | **Removed** (bad notify target) — alert **binary sensors** remain |

This is a line-in-the-sand cut: usable day-to-day, not feature-complete.

---

## From-scratch file map (summary)

| Repo | HA destination |
|---|---|
| `homeassistant/packages/dsc_v4_*.yaml` | `/config/packages/` |
| `homeassistant/automations.yaml` | `/config/automations.yaml` (merge or include) |
| `homeassistant/dashboards/dsc-hub-v4-dashboard.yaml` | Lovelace URL **`dsc-hub-v4`** |
| `homeassistant/esphome/dsc-*.yaml` | `/config/esphome/` |
| `homeassistant/www/dsc-system-map.*` | `/config/www/` + Lovelace resource |
| `firmware/v4/secrets.yaml.template` | `/config/esphome/secrets.yaml` |

Full steps: [`INSTALL.md`](INSTALL.md).

---

## Beyond OTA — what never auto-updates

ESPHome Install only updates device firmware. Re-copy by hand when these change:

| Surface | Path |
|---|---|
| Lovelace | `homeassistant/dashboards/dsc-hub-v4-dashboard.yaml` |
| Packages | `homeassistant/packages/dsc_v4_*.yaml` |
| Automations | `homeassistant/automations.yaml` |
| SYSTEM MAP assets | `homeassistant/www/dsc-system-map.*` |

```
Cursor edit → commit/push → ESPHome Validate/Install (devices)
                         → re-copy HA files above if listed in the cut
```

Hub + panel: flash together when tag, MAC, or `0xD*` wire contract changes.

---

## Flash order (first bring-up)

1. Hub (`dsc-hub.yaml`) → expect firmware **`4.0.0-alpha.1`**
2. Panel (`dsc-control.yaml`) → **4.0.11** (USB if heap-sensitive)
3. Pots → Sonoffs

---

## Not in this alpha (backlog)

- POT3 soil-probe replacement / SCD41 CO₂ / ETH01 gateway
- Clone humidifier / mister follower + AC follower wiring
- 4×8 light on GPIO5
- Pot/tank mobile push notifiers (re-add with a real `notify.mobile_app_…` target)
- Panel remainder: power pages, VPD curve editor, canvas charts, LDR auto-dim
- SYSTEM MAP visual polish (shipped baseline card only)

---

## Related docs

| Doc | When |
|---|---|
| [`INSTALL.md`](INSTALL.md) | Fresh bring-up |
| [`homeassistant/README.md`](homeassistant/README.md) | Packages, HACS, SYSTEM MAP |
| [`firmware/v4/README.md`](firmware/v4/README.md) | Validate / flash / panel reconnect |
| [`UPGRADE.md`](UPGRADE.md) | Legacy — only if migrating an old live site |
