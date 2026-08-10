# F-010 / F-012 / F-013 — ETH01 SoftAP fleet home + appliance bridge

**In one line:** WT32-ETH01 hosts SoftAP `DSC-Anchor` (NAPT + ESP-NOW on `WIFI_IF_AP`), drives Sonoffs on the SoftAP subnet, and mirrors hub vitals to HA over Ethernet.

**Design:** [`docs/superpowers/specs/2026-08-10-softap-fleet-star-design.md`](../superpowers/specs/2026-08-10-softap-fleet-star-design.md)  
**Ops runbook:** [`docs/qa/SOFTAP-FLEET-HOME.md`](../qa/SOFTAP-FLEET-HOME.md)

## Topology

```mermaid
flowchart LR
  pots["Pots"] -->|"ESP-NOW star"| hub["Hub SoftAP STA .10"]
  hub -->|"ESP-NOW 0xD8 / 0xD1"| bridge["ETH01 SoftAP + NAPT"]
  control["Control SoftAP STA .11"] -->|"ESP-NOW + SoftAP STA"| hub
  sonoffs["Sonoffs SoftAP STA .20-.23"] -->|"Noise API"| bridge
  bridge -->|"Ethernet"| ha["HA / LAN"]
  hub -->|"SoftAP STA + NAPT"| ha
```

| Path | Role |
|---|---|
| Hub demand `0xD8` → bridge → Sonoff Noise API | HA-down actuation |
| Hub vitals `0xD1` broadcast → bridge HA mirror | Ethernet telemetry |
| Hub / Control / Sonoffs STA → `DSC-Anchor` | Fleet Wi‑Fi home + channel pin |
| Pots → hub ESP-NOW only | SoftAP not preferred (star) |
| HA followers | Idempotent fallback when HA up |

## SoftAP networking (v1)

| Item | Value |
|---|---|
| SSID | `DSC-Anchor` |
| Gateway | `192.168.4.1/24` |
| Client addressing | **Static map** — no SoftAP DHCPS in v1 (`esp_netif_dhcps_*` omitted in ESPHome builds) |
| Forwarding | LwIP IP forward + IPv4 NAPT on SoftAP netif |
| ESP-NOW ifidx | `WIFI_IF_AP` after SoftAP up (peers rebound) |
| Max STA | 10 (hub + control + 4 Sonoffs + headroom) |
| sdkconfig | `CONFIG_LWIP_IP_FORWARD`, `CONFIG_LWIP_IPV4_NAPT`, `CONFIG_ESP_WIFI_SOFTAP_MAX_NUM_STA=10` |

### Static SoftAP leases

| Device | SoftAP IP | `use_address` / host |
|---|---|---|
| Hub | `192.168.4.10` | lab wifi package |
| Control | `192.168.4.11` | lab wifi package |
| Heater | `192.168.4.20` | `dsc_heater_host` / `softap_ip` |
| Heatmat | `192.168.4.21` | `dsc_heatmat_host` / `softap_ip` |
| Humidifier | `192.168.4.22` | `dsc_humidifier_host` / `softap_ip` |
| Dehumidifier | `192.168.4.23` | `dsc_dehumidifier_host` / `softap_ip` |

HA → SoftAP clients needs a host route: `192.168.4.0/24 via <bridge ETH IP>` (lab: `192.168.86.66`).

## Wi‑Fi membership

| Device | SoftAP | Nest / home | Notes |
|---|---|---|---|
| Hub | primary + static IP | emergency fallback | Prefer Anchor BSSID via Lock / `bridge_mac` / `0xD0` |
| Control | primary + static IP | fallback | Glass Fleet Fix |
| Pots | last-resort only | OTA / optional LAN | ESP-NOW to hub |
| Sonoffs | primary + static IP | fallback | Bridge on/off only |
| Bridge | SoftAP AP | no Nest STA in v1 | Nest STA join previously soft-bricked OTA |

## Fleet Fix (glass)

Primary UX is glass (works without HA). HA button remains a duplicate trigger.

1. `FIX_ACTIVE=1` (`0xDC` op **60**) → hub blocks OTA / HA safe-off grace  
2. `FLEET_JUMP` (op **62**) → hub pins preferred SoftAP BSSID (`bridge_mac`) + WiFi bounce; EVT `FLEET_JUMP`  
3. Poll hub vitals → Control SoftAP bounce → pot link bits (star wait)  
4. Success gate: SoftAP preferred match (when known) + hub beat + pots OK  
5. `FIX_ACTIVE=0` → return to Connections  

Code: `fleet_fix_run` in `dsc-control-common.yaml`; `rf_fleet_jump_arm` in `dsc-hub-fleet-heal.yaml`.

## Firmware

| Path | Role |
|---|---|
| [`firmware/v4/dsc-bridge.yaml`](../../firmware/v4/dsc-bridge.yaml) | Lab stub |
| [`firmware/v4/dsc-bridge-kit.yaml`](../../firmware/v4/dsc-bridge-kit.yaml) | Kit (ethernet + SoftAP; SoftAP hello deferred F-014) |
| [`firmware/v4/components/dsc_api_client/`](../../firmware/v4/components/dsc_api_client/) | Noise native API client |
| [`firmware/v4/components/dsc_anchor_ap/`](../../firmware/v4/components/dsc_anchor_ap/) | SoftAP + NAPT with ethernet (ESPHome forbids `wifi:`+`ethernet:`) |
| `dsc-*-wifi-lab.yaml` / `dsc-sonoff-common.yaml` | SoftAP-primary membership + static IPs |

## Sensors / secrets

- `sensor.dsc_bridge_anchor_bssid` — SoftAP **AP MAC** (prefer this into hub `bridge_mac` / Lock WiFi)
- `binary_sensor.dsc_bridge_anchor_softap_up` — SoftAP up
- `sensor.dsc_bridge_anchor_channel` — pinned channel (lab default 11)
- Secrets: `dsc_bridge_*`, `dsc_anchor_ap_password`, four `dsc_*_host` SoftAP IPs

## Safety

- Bridge respects demand OFF as hard
- No fresh `0xD8` for 45s → all four relays OFF
- Sonoff API-loss grace still applies if **all** clients disconnect
- Manual button test mode still local stop (bridge skips commands)

## Acceptance

- SoftAP up; Anchor BSSID published; ESP-NOW peers on `WIFI_IF_AP`
- Hub on SoftAP has path to HA API (with HA SoftAP route)
- `binary_sensor.dsc_bridge_hub_esp_now_link` can go on
- Bridge toggles a Sonoff at SoftAP static IP (HA powered off)
- Glass Fleet Fix sends ops 60/62 and shows ASCII boot status through the walk

## Deferred / still open

- **F-011** — move kit `DSC-Setup-*` portal host onto ETH01
- **F-014** — bridge SoftAP satellite hello without ESPHome `wifi:` (paste Anchor BSSID into hub)
- **F-015** — Sync copy of `dsc_api_client` + `dsc_anchor_ap` to HA `/config/esphome/components/`
- L2 SoftAP↔Ethernet bridge (v1 uses NAPT + host route instead)
- Pots as SoftAP STAs (non-goal)
