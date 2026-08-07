# F-010 — ESP-NOW appliance bridge

**In one line:** Sonoffs cannot speak ESP-NOW; a bridge must follow hub demand without Home Assistant.

Notion: [Appliance bridge gap](https://app.notion.com/p/3b52b4cda3708107bfaeff8d9b8b1398)

## Today (honest)

```
Hub demand switch ──HA API──► HA automation ──► Sonoff relay
```

ESP8285 Sonoff BASIC R2 has no ESP-NOW. Control warns when appliances need HA.

## Destination

```
Hub demand ──ESP-NOW──► Bridge (ESP32) ──GPIO / Wi-Fi local──► Relays
```

Options ranked:

1. **ESP32 bridge node** on ESP-NOW with hub peer; drives relays via GPIO expanders or UART to existing Sonoffs replaced later
2. **Replace Sonoffs** with ESP32 relay modules that speak ESP-NOW natively (cleaner long-term)
3. Keep HA followers as **optional mirror** when HA is present

## Safety

- Bridge must respect hub demand OFF as hard
- API-loss / peer-loss → relays OFF (same failsafe class as Sonoff `api` loss today)
- Manual button on appliance still local stop

## Firmware sketch

Stub package: [`firmware/v4/dsc-appliance-bridge.yaml`](../../firmware/v4/dsc-appliance-bridge.yaml)  
Not production-flashed until board BOM and peer protocol are frozen.

## Acceptance

- HA powered off; hub raises humidifier demand; relay follows within 2s
- Hub clears demand; relay off
- Bridge peer lost; relay off
- Control Connections UI no longer claims “appliances need HA” when bridge online
