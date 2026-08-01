# DSC-HUB **v5.0.0**

First **major** cut after the v4 alpha line. Headline: Home Assistant surfaces
ship through a first-party **HAOS add-on** (push `master` → sync to `/config`).
Hub firmware string matches the GitHub tag.

| | |
|---|---|
| **GitHub tag** | `v5.0.0` |
| **Hub** `sensor.dsc_hub_firmware_version` | **`5.0.0`** |
| **Panel** | DSC-CONTROL **4.0.11** (flash with hub if ESP-NOW tag/wire changed) |
| **Pots** | `dsc-pot-common` **4.0.1** |
| **Dashboard** | UX **v0.2** · URL **`dsc-hub-pro`** (YAML mode) |
| **ESP-NOW tag** | **`54727` (`0xD5C7`)** on hub **and** panel |
| **HA delivery** | **DSC-HUB Sync** add-on · [`scripts/ADDON.md`](scripts/ADDON.md) |

**Install from scratch:** [`INSTALL.md`](INSTALL.md) · add-on: [`scripts/ADDON.md`](scripts/ADDON.md)  
**Kit SoftAP (no HA):** [`SETUP.md`](SETUP.md)

Repo: https://github.com/weddas/DSC-HUB · branch **`master`**

---

## What’s new in v5.0.0

| Layer | Change |
|---|---|
| **HAOS Sync add-on** | Custom add-on repo = this GitHub URL; polls `master`, copies packages / dashboard / www, reloads HA |
| Automations package | `packages/dsc_v4_automations.yaml` (no more merge into live `automations.yaml`) |
| YAML Lovelace | `configuration.snippet.yaml` — dashboard file under `/config/dashboards/` |
| HACS (optional) | SYSTEM MAP card via Dashboard custom repo (`dist/` + `hacs.json`) |
| Kit SoftAP setup | Optional factory path without HA (`SETUP.md`, `*-kit.yaml`, `dsc_fleet_setup`) |
| Hub firmware | **`5.0.0`** — WiFi moved to lab/kit packages; SoftAP provisioning path |

Still true from v4 alpha: ESP-NOW-primary panel↔hub, climate ladder on hub,
Phase A learn gauges, SYSTEM MAP card.

---

## From-scratch file map (summary)

| Repo | HA destination |
|---|---|
| `homeassistant/packages/dsc_v4_*.yaml` | `/config/packages/` (helpers + automations + learn) |
| `homeassistant/dashboards/dsc-hub-v4-dashboard.yaml` | `/config/dashboards/` (YAML-mode URL **`dsc-hub-pro`**) |
| `homeassistant/esphome/dsc-*.yaml` | `/config/esphome/` |
| `homeassistant/www/dsc-system-map.*` | `/config/www/` (or HACS) |
| `firmware/v4/secrets.yaml.template` | `/config/esphome/secrets.yaml` |

Prefer the **DSC-HUB Sync** add-on over hand-copy after the first boot:
[`scripts/ADDON.md`](scripts/ADDON.md).

Full steps: [`INSTALL.md`](INSTALL.md).

---

## Beyond OTA — HA surfaces vs firmware

ESPHome Install only updates device firmware (still **manual** per device).

**Primary HA delivery:** **DSC-HUB Sync** add-on
([`dsc-hub-sync/`](dsc-hub-sync/) · [`scripts/ADDON.md`](scripts/ADDON.md)).

| Surface | Path | Deploy |
|---|---|---|
| Packages + automations | `homeassistant/packages/dsc_v4_*.yaml` | **HAOS add-on** |
| Lovelace dashboard YAML | `homeassistant/dashboards/dsc-hub-v4-dashboard.yaml` | **HAOS add-on** |
| www SYSTEM MAP assets | `homeassistant/www/dsc-system-map.*` | **HAOS add-on** (optional) |
| SYSTEM MAP card (alt) | `dist/DSC-HUB.js` | HACS Dashboard (optional) |
| ESPHome stubs | `homeassistant/esphome/dsc-*.yaml` | Add-on option / manual · `ref: v5.0.0` |
| Device firmware | `firmware/v4/` via stubs | Manual Validate/Install |

```
Cursor edit → commit/push master → DSC-HUB Sync add-on (~60s)
                                → ESPHome Validate/Install (devices)
```

Hub + panel: flash together when tag, MAC, or `0xD*` wire contract changes.

---

## Flash order (first bring-up / hub major bump)

1. Hub (`dsc-hub.yaml` or `dsc-hub-kit.yaml`) → expect firmware **`5.0.0`**
2. Panel (`dsc-control.yaml`) → **4.0.11** (USB if heap-sensitive)
3. Pots → Sonoffs

---

## Not in this cut (backlog)

- AC / clone-mister followers (hardware)
- Auto-flash fleet on git push (intentionally never)
- Bidirectional HA→git sync

---

## Previous cut

**v4.0.0-alpha.1** — first published ESP-NOW-primary alpha (hub string matched tag).
