# SoftAP fleet home + enhanced Fleet Fix

**Date:** 2026-08-10  
**Status:** approved for implementation  
**Related:** F-004, F-010, F-012, F-013, F-014

## Goal

Grow Wi‑Fi devices use `DSC-Anchor` SoftAP on the WT32-ETH01 as their home network. The bridge reaches HA over Ethernet and drives Sonoff on/off on the SoftAP subnet. Pots stay on the ESP-NOW hub star (no SoftAP STA). Nest is emergency fallback only.

## Topology

```
Pots ──ESP-NOW──► Hub ──ESP-NOW + SoftAP STA──► Bridge (ETH01)
Control ──ESP-NOW + SoftAP STA──► Hub / Bridge radio
Sonoffs ──SoftAP STA──► Bridge ──Noise API──► relays
Bridge ──Ethernet──► HA (192.168.86.3)
```

## SoftAP networking (v1)

| Item | Value |
|---|---|
| SSID | `DSC-Anchor` |
| SoftAP gateway | `192.168.4.1/24` (static client map; no SoftAP DHCPS in v1) |
| Forwarding | LwIP IP forward + IPv4 NAPT on SoftAP netif |
| ESP-NOW ifidx | `WIFI_IF_AP` after SoftAP up |
| Max STA | ≥10 (hub + control + 4 sonoffs + headroom) |

### Static SoftAP leases (clients)

| Device | SoftAP IP |
|---|---|
| Hub | `192.168.4.10` |
| Control | `192.168.4.11` |
| Heater | `192.168.4.20` |
| Heatmat | `192.168.4.21` |
| Humidifier | `192.168.4.22` |
| Dehumidifier | `192.168.4.23` |

Bridge `dsc_api_client` hosts use these SoftAP IPs. HA → SoftAP clients requires a host route on HA OS: `192.168.4.0/24 via 192.168.86.66` (document + apply when validating).

## Wi‑Fi membership

| Device | SoftAP | Nest | Notes |
|---|---|---|---|
| Hub | primary + static IP | fallback | Prefer Anchor BSSID via Lock / `bridge_mac` / `0xD0` |
| Control | primary + static IP | fallback | Glass Fleet Fix |
| Pots | **not preferred** | OTA/optional | ESP-NOW to hub only |
| Sonoffs | primary + static IP | fallback | Bridge on/off only |

## Fleet Fix state machine (glass)

1. `FIX_ACTIVE=1` (0xDC op 60) → hub blocks OTA / HA safe-off grace  
2. `FLEET_JUMP` (0xDC op 62) → hub pins preferred SoftAP BSSID + WiFi bounce; EVT `FLEET_JUMP`  
3. Poll hub vitals → Control SoftAP bounce → pot link bits (star wait)  
4. Success gate: SoftAP preferred match (when known) + hub beat + pots OK  
5. `FIX_ACTIVE=0` → return to Connections  

Primary UX is glass (works without HA). HA button remains a duplicate trigger.

## Non-goals (v1)

- Pots as SoftAP STAs  
- L2 SoftAP↔Ethernet bridge  
- BLE orchestration  
- Nest channel lock as primary heal path  

## Success criteria

1. SoftAP up; Anchor BSSID published; ESP-NOW peers on `WIFI_IF_AP`  
2. Hub on SoftAP has path to HA API (with HA SoftAP route)  
3. `binary_sensor.dsc_bridge_hub_esp_now_link` can go on  
4. Bridge toggles a Sonoff at SoftAP static IP  
5. Glass Fleet Fix sends ops 60/62 and shows ASCII boot status through the walk  
