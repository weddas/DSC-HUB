# DSC-HUB

Indoor grow automation fleet: ESPHome hub, CYD touch panel (DSC-CONTROL), soil pots, and Sonoff demand followers.

## Docs (start here)

| Doc | When |
|---|---|
| [`INSTALL.md`](INSTALL.md) | Fresh HA + fleet bring-up |
| [`UPGRADE.md`](UPGRADE.md) | Moving from live v2.4 / early v4 onto this repo |
| [`RELEASE.md`](RELEASE.md) | Release map + short checklist |
| [`homeassistant/README.md`](homeassistant/README.md) | Packages, dashboard, HACS |
| [`firmware/v4/README.md`](firmware/v4/README.md) | Local validate / flash entry points |

## Canonical firmware

**Active source of truth:** [`firmware/v4/`](firmware/v4/)

| Device | Config |
|---|---|
| Hub | stub `dsc-hub.yaml` → `dsc-hub-v4_0.yaml` + `dsc-hub-espnow-primary.yaml` |
| Touch panel | stub `dsc-control.yaml` → `dsc-control-common.yaml` (+ `cyd_glyphs.yaml`) |
| Pots 1–4 | `dsc-pot{1..4}.yaml` → `dsc-pot-common.yaml` |
| Sonoffs | `dsc-heater` / `heatmat` / `humidifier` / `de-humidifier` → `dsc-sonoff-common.yaml` |

**HA ESPHome deploy:** thin stubs in [`homeassistant/esphome/`](homeassistant/esphome/) pull package bodies from this GitHub repo. Edit in Cursor → push → Validate/Install in ESPHome. Flash hub + panel together when the ESP-NOW tag or wire contract changes.

Crash logs and YAML backups live in [`firmware/_history/v4/`](firmware/_history/v4/). Legacy trees are under `_Archive_Legacy_Code/`.

The older path `firmware/DSC-HUB v4/` is superseded — do not edit it.

## Home Assistant

Canonical dashboard + packages + ESPHome stubs: [`homeassistant/`](homeassistant/)

| Piece | File |
|---|---|
| Lovelace | `homeassistant/dashboards/dsc-hub-v4-dashboard.yaml` (URL: `dsc-hub-v4`) |
| Helpers | `homeassistant/packages/dsc-v4-*.yaml` |
| Automations | `homeassistant/automations.yaml` |
| ESPHome stubs | `homeassistant/esphome/dsc-*.yaml` (git-pull package bodies) |

## Secrets

```bash
cd firmware/v4
# Either use your existing secrets.yaml (already gitignored), or:
cp secrets.yaml.template secrets.yaml
# or generate fresh keys:
./generate-secrets.sh   # then set wifi_ssid / wifi_password
```

Never commit `secrets.yaml`. Never paste it into chat.

## ESP-NOW panel ↔ hub

Both sides must share the same values:

- Panel `hub_mac` ↔ hub WiFi MAC  
- Hub `panel_mac` ↔ panel WiFi MAC  
- `espnow_cmd_tag` — **54727** (`0xD5C7`) on both (rotated off the default `0xABCD`)

If tags differ, the hub silently drops panel commands. **Flash hub and panel together** after a tag change.

**Dual path:** ESP-NOW is primary for panel↔hub (works with HA down). The hub’s HA entities stay the dashboard/Sonoff surface — panel commands drive those same entities, and HA changes rebroadcast to the panel (`tx_panel_sync` / `0xD1`–`0xD4`). Plant names live on each pot (permanent); the hub mirrors them from HA and relays to the panel as `0xD4`.

**Nest / mesh WiFi:** ESP-NOW follows the STA channel. Google Nest and similar meshes hop 2.4 GHz without warning. If the hub and panel land on different channels, telemetry stops with no protocol error — the panel ESP-NOW row goes DOWN and a channel-hop alert may fire. Fix: a small dedicated 2.4 GHz AP on a **fixed channel** for the DSC fleet (hub + panel + pots).

**Sonoffs:** ESP8285 appliances have no ESP-NOW. Demand switches need Home Assistant to move relays. Climate fans/SF1000 still run locally without HA.

## Wire-contract check

```bash
cd firmware/v4
g++ -std=c++17 -Wall -Wextra -O2 -o verify_v4 verify_v4.cpp && ./verify_v4
```

## Validate before flash

From `firmware/v4/` (ESPHome CLI or HA ESPHome add-on):

```bash
esphome config dsc-hub.yaml
esphome config dsc-control.yaml
esphome config dsc-pot1.yaml
esphome config dsc-heater.yaml
```

Panel heap health (after UI changes): watch log lines from `heap` — free heap and largest block. See `_history/v4/crash-logs/DSC-CONTROL-v4.0.2-postmortem.md`.

## Flash order (key rotation only)

1. Hub  
2. Pots  
3. Sonoffs  
4. Panel  

Otherwise OTA + HA encryption keys get out of sync.
