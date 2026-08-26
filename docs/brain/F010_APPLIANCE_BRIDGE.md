# F-010 / F-012 / F-013 — ETH01 appliance bridge (archived)

> **Superseded (DSC-HUB 7.0+ / closed 7.1.1+):** Bridge removed from the Pi product path. DSC-Brain polls hub demand switches and drives Sonoff relays via Native API (`brain/dsc_brain/appliance_driver.py`). Live ops: [`FLEET-INGEST.md`](FLEET-INGEST.md) · [`../ops/SONOFF-FLASH.md`](../ops/SONOFF-FLASH.md).

**In one line (historical):** WT32-ETH01 followed hub demand over ESP-NOW, drove Sonoffs without HA, SoftAP-pinned the fleet channel, and mirrored hub vitals to HA over Ethernet.

## Current product path

```
Hub demand ──Native API──► Pi appliance_driver ──main_relay──► Sonoff relays
```

- Stale hub demand (>45s) → relays OFF
- Per-host `host_lock` serializes API sessions (7.1.1)
- Emit **discovered** demand OIDs only — undiscovered aliases must not default OFF (7.1.2 heatmat chatter fix)

## Archive locations

| Stub / component | Where now |
|---|---|
| `dsc-bridge*.yaml` | [`firmware/_history/v4/`](../../firmware/_history/v4/) |
| `dsc_api_client` / `dsc_anchor_ap` | Still under `firmware/v4/components/` for archaeology / lab only |

Do **not** flash archived bridge YAML for Pi island installs.

## Historical path (lab archaeology)

```
Hub demand ──ESP-NOW 0xD8──► DSC-BRIDGE ──native API──► Sonoff relays
Hub vitals ──ESP-NOW 0xD1 broadcast──► Bridge HA mirror (Ethernet)
Fleet STA ──prefer DSC-Anchor SoftAP BSSID──► fixed channel (F-012)
```

## Deferred (parked with bridge)

- **F-011** — move kit `DSC-Setup-*` portal host onto ETH01
- **F-014** — bridge SoftAP satellite hello without ESPHome `wifi:`
