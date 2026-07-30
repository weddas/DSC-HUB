# DSC-HUB

Indoor grow automation fleet: ESPHome hub, CYD touch panel (DSC-CONTROL), soil pots, and Sonoff demand followers.

## Canonical firmware

**Active source of truth:** [`firmware/v4/`](firmware/v4/)

| Device | Config |
|---|---|
| Hub | `dsc-hub-v4_0.yaml` (+ `dsc-hub-espnow-primary.yaml`) |
| Touch panel | `dsc-control.yaml` (+ `cyd_glyphs.yaml`) |
| Pots 1–4 | `dsc-pot{1..4}.yaml` → `dsc-pot-common.yaml` |
| Sonoffs | `dsc-heater` / `heatmat` / `humidifier` / `de-humidifier` → `dsc-sonoff-common.yaml` |

Crash logs and YAML backups live in [`firmware/_history/v4/`](firmware/_history/v4/). Legacy trees are under `_Archive_Legacy_Code/`.

The older path `firmware/DSC-HUB v4/` is superseded — do not edit it.

## Home Assistant

Canonical dashboard + packages: [`homeassistant/`](homeassistant/)

| Piece | File |
|---|---|
| Lovelace | `homeassistant/dashboards/dsc-hub-v4-dashboard.yaml` (URL: `dsc-hub-v4`) |
| Helpers | `packages/dsc-v4-core-helpers.yaml` + `dsc-v4-light-helpers.yaml` |
| Automations | `homeassistant/automations.yaml` |

See [`homeassistant/README.md`](homeassistant/README.md) for install order and known live-HA gaps.

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
esphome config dsc-hub-v4_0.yaml
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
