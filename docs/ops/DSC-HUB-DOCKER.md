# DSC-HUB Pi appliance — operations

**Release:** DSC-HUB 7.0.0 firmware / brain **7.1.0** / island packet **7.1.2**.

**Developer SoT:** [`FLEET-INGEST.md`](../brain/FLEET-INGEST.md) · [`FLEET-TRUTH.md`](../brain/FLEET-TRUTH.md) · [`SETTINGS-OPS.md`](../brain/SETTINGS-OPS.md) · [`SONOFF-FLASH.md`](SONOFF-FLASH.md) · [`WEBUI.md`](../brain/WEBUI.md) · closure [`AUDIT-CLOSURE-7.1.2.md`](../qa/AUDIT-CLOSURE-7.1.2.md)

## Network

- **AP:** `DSC-Brain` 2.4 GHz, locked channel (1/6/11), WPA2 · `max_num_sta=32` after Apply network.
- **Subnet:** `10.42.0.0/24`, Pi AP `10.42.0.1`.
- **eth0:** House uplink (optional). Studio LAN default **`192.168.86.48`** in deploy/flash scripts (not `.30`).
- **Avahi:** `dsc-brain.local` → prefer over sticky DHCP IPs.

Fleet DHCP reservations live in `/etc/dsc-hub/dnsmasq.conf` (bootstrap template). After flash, add device MACs from Settings inventory.

## Cutover checklist

1. Bootstrap Pi (`pi-bootstrap.sh`), compose up, `/health` green.
2. Move SkyConnect from Unraid; z2m sees coordinator.
3. Build firmware **7.0.0.0** (`wifi-pi` stubs); rotate Noise API keys → `.env` + Notion.
4. Flash order: hub → pot2 canary → remaining pots → Sonoffs → panel.
5. Disable HA demand-follower automations and HA ESPHome integrations (do not delete packages until soak).
6. Hub ESP-NOW parked on Pi path; brain polls hub demand switches and drives Sonoff relays (45s stale OFF).
7. **Island proof:** Nest + HA off; tent on Pi AP; fleet chip `7.0.0.0`.
8. With eth0 up: Settings → Test Ollama + Test CannaLib green.
9. With eth0 down: integrations HELD; catalog uses local fallback if present.
10. Stamp git tag `v7.0.0` only after soak.

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

- Uptime Kuma: `GET http://dsc-brain.local:8787/health` (includes `zigbee.mqtt_connected`)
- Fleet WS: `ws://dsc-brain.local:8787/ws/fleet`
- Online seat expiry: **120 s** without Native API sample → `online=false`
- Soak: `services/dsc-hub/pi/setup-soak-cron.sh` · [`SOAK-2026-08-26.md`](SOAK-2026-08-26.md)

## Honesty boundaries

- Pi power-off → AP dies; Sonoffs failsafe OFF.
- Brain container restart (deploy/`compose up`) briefly drops the hub AP; hub and fleet devices rejoin within ~2 min. Expect a short fleet-offline window on every deploy — not a fault.
- Apply network restarts `dsc-hub-ap.service` — confirm via DecisionLayer; use eth0 SSH while diagnosing.
- Inventory `in_service` is seat SoT; hub switches mirror on PATCH.
- `GET /settings` never returns plaintext AP PSK (`ap_psk_set` only).
- LLM prose is not catalog SoT.
- Zigbee plugs are additive; climate legs stay on Sonoffs.

## HA lab note

HA custom panel may still show surface **7.2.0** in lab. Product appliance is firmware **7.0.0.0** / brain **7.1.0** on Pi (SPA bundle `index-BoHeNp3o`).
