# DSC-HUB Pi appliance — operations

**Release:** DSC-HUB **7.1.1** island closeout · brain/SPA **7.1.0** · firmware train **7.0.0.0**.

## Network

- **AP:** `DSC-Brain` 2.4 GHz, locked channel (1/6/11), WPA2.
- **Subnet:** `10.42.0.0/24`, Pi AP `10.42.0.1`.
- **eth0:** House uplink (optional). Climate runs island; Ollama + remote CannaLib need uplink.
- **Avahi:** `dsc-brain.local`

Fleet DHCP reservations live in `/etc/dsc-hub/dnsmasq.conf` (bootstrap template). After flash, add device MACs from Settings inventory.

## Cutover checklist

1. Bootstrap Pi (`pi-bootstrap.sh`), compose up, `/health` green.
2. Move SkyConnect from Unraid; z2m sees coordinator.
3. Build firmware **7.0.0.0** (`wifi-pi` stubs); rotate Noise API keys → `.env` + Notion.
4. Flash order: hub → pot2 canary → remaining pots → Sonoffs → panel. **Do not flash** archived `dsc-bridge*` (ETH01 retired on Pi path).
5. Sonoff OTA helpers: [`SONOFF-FLASH.md`](SONOFF-FLASH.md) (`flash-sonoff-lan*`, `flash-sonoff-fallback*`).
6. Disable HA demand-follower automations and HA ESPHome integrations (do not delete packages until soak).
7. Hub ESP-NOW parked on Pi path; brain polls hub demand switches and drives Sonoff relays (45s stale OFF). Ingest details: [`../brain/FLEET-INGEST.md`](../brain/FLEET-INGEST.md).
8. **Island proof:** Nest + HA off; tent on Pi AP; fleet chip `7.0.0.0` (panel plaintext; `grow_mat_demand` mapped).
9. With eth0 up: Settings → Test Ollama + Test CannaLib green.
10. With eth0 down: integrations HELD; catalog uses local fallback if present.
11. Stamp git tag `v7.1.1` after soak (firmware remains `7.0.0.0`).

## AP heal

If hub or seats flap after compose/AP restarts: `diag-ap.sh`, `diag-hub.sh`, `check-ap-data.sh` — see [`SONOFF-FLASH.md`](SONOFF-FLASH.md#ap--hub-diagnostics). PSK mismatch → `fix-ap-psk.sh` (values only in Notion *DSC-Brain Pi AP*).

## Acceptance tests

```bash
# Brain unit tests
pip install -r brain/requirements.txt pytest
pytest brain/tests -q

# Firmware config (on host with esphome)
esphome config firmware/v4/dsc-hub.yaml
esphome config firmware/v4/dsc-control.yaml

# SPA build (bundled into brain image)
cd homeassistant/custom_components/dsc_hub/frontend
npm install && npm run build:spa
```

## Monitoring

- Uptime Kuma: `GET http://dsc-brain.local:8787/health`
- Fleet WS: `ws://dsc-brain.local:8787/ws/fleet`

## Honesty boundaries

- Pi power-off → AP dies; Sonoffs failsafe OFF.
- LLM prose is not catalog SoT.
- Zigbee plugs are additive; climate legs stay on Sonoffs.
- Bridge configs under `firmware/_history/v4/` are archive only.

## HA lab note

HA custom panel may still show surface **7.2.0** in lab. Product appliance is brain/SPA **7.1.0** (closeout **7.1.1**) + firmware **7.0.0.0** on Pi.
