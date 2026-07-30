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
- `espnow_cmd_tag` — currently **43981** (`0xABCD`) on both  

If tags differ, the hub silently drops panel commands.

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
