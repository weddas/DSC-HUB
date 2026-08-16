# F-010 / F-012 / F-013 — ETH01 appliance bridge + channel anchor + HA mirror

**In one line:** WT32-ETH01 can follow hub demand (historically over ESP-NOW `0xD8`), drive Sonoffs without HA, SoftAP-pin the fleet channel, and mirror hub vitals to HA over Ethernet.

**Product posture (2026-08-16):** ESP-NOW is **parked** as the product radio. Prefer **HA demand followers** and Ethernet SoftAP membership / Noise API appliance drive. Do not deepen hub↔bridge ESP-NOW demand as the default next task — [`docs/qa/ESPNOW-PRODUCT-PARK.md`](../qa/ESPNOW-PRODUCT-PARK.md).

## Paths

```
Hub demand ──HA followers (default)──► Sonoff relays
Hub demand ──ESP-NOW 0xD8 (parked)──► DSC-BRIDGE ──native API──► Sonoff relays
Hub vitals ──ESP-NOW 0xD1 (parked)──► Bridge HA mirror (Ethernet)
Fleet STA ──prefer DSC-Anchor SoftAP BSSID──► fixed channel (F-012)
```

## Firmware

| Stub | Role |
|---|---|
| [`firmware/v4/dsc-bridge.yaml`](../../firmware/v4/dsc-bridge.yaml) | Lab |
| [`firmware/v4/dsc-bridge-kit.yaml`](../../firmware/v4/dsc-bridge-kit.yaml) | Kit (ethernet + SoftAP; SoftAP hello deferred F-014) |
| [`firmware/v4/components/dsc_api_client/`](../../firmware/v4/components/dsc_api_client/) | Noise native API client |
| [`firmware/v4/components/dsc_anchor_ap/`](../../firmware/v4/components/dsc_anchor_ap/) | SoftAP with ethernet (ESPHome forbids `wifi:`+`ethernet:`) |

## Safety

- Bridge respects demand OFF as hard
- No fresh `0xD8` for 45s → all four relays OFF
- Sonoff API-loss grace still applies if **all** clients disconnect
- Manual button test mode still local stop (bridge skips commands)

## Acceptance

- HA powered off; hub raises humidifier demand; relay follows within ~2s
- Hub clears demand; relay off
- Bridge peer lost / stale; relays off
- Control alert is “Appliances need bridge or HA” (not bare HA-only)
- Fleet prefers Anchor BSSID; ESP-NOW holds without Nest hops
- Pro System view shows bridge / anchor / Sonoff API links

## Deferred

- **F-011** — move kit `DSC-Setup-*` portal host onto ETH01
- **F-014** — bridge SoftAP satellite hello without ESPHome `wifi:` (paste Anchor BSSID into hub)
