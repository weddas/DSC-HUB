# DSC-HUB Pi appliance — operations

**Release:** DSC-HUB 7.0.0 — The Pi Release. Tip includes AP PSK default alignment (`8867b33`).

**Full ops runbook:** [`docs/qa/PI-APPLIANCE-7.0.md`](../qa/PI-APPLIANCE-7.0.md) (architecture, LAN map, **AP PSK alignment**, API surface, appliance driver, pitfalls).  
**Compose / bootstrap:** [`services/dsc-hub/README.md`](../../services/dsc-hub/README.md).

## Network

- **AP:** `DSC-Brain` 2.4 GHz, locked channel (1/6/11), WPA2.
- **PSK:** Shared fleet secret — brain `ap_psk` / `DSC_AP_PSK` / hostapd / firmware `wifi_password` must match. Canonical value in Notion **API Keys & Credentials** (*DSC-Brain Pi AP*). Tip `8867b33` removed `changeme-dsc-brain` defaults; live Pi with that placeholder → `services/dsc-hub/pi/fix-ap-psk.sh`.
- **Subnet:** `10.42.0.0/24`, Pi AP `10.42.0.1`.
- **eth0:** House uplink (optional). Climate runs island; Ollama + remote CannaLib need uplink.
- **Avahi:** `dsc-brain.local`

Fleet DHCP reservations live in `/etc/dsc-hub/dnsmasq.conf` (bootstrap template). After flash, add device MACs from Settings inventory. Default seats: hub `.10`, control `.11`, pots `.21–.24`, Sonoffs `.50/.51/.54/.55`.

## Cutover checklist

1. Bootstrap Pi (`pi-bootstrap.sh`), compose up, `/health` green. Confirm AP PSK matches firmware secrets (Notion credentials).
2. Move SkyConnect from Unraid; z2m sees coordinator.
3. Build firmware **7.0.0.0** (`wifi-pi` stubs); rotate Noise API keys → `.env` + Notion **API Keys & Credentials** (never paste live keys into Wiki/PRs).
4. Flash order: hub → pot2 canary → remaining pots → Sonoffs → panel.
5. Disable HA demand-follower automations and HA ESPHome integrations (do not delete packages until soak).
6. Hub ESP-NOW parked on Pi path; brain polls hub demand switches and drives Sonoff relays (45s stale OFF) via `appliance_driver.py`.
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

- Uptime Kuma: `GET http://dsc-brain.local:8787/health`
- Fleet WS: `ws://dsc-brain.local:8787/ws/fleet`

## Honesty boundaries

- Pi power-off → AP dies; Sonoffs failsafe OFF.
- LLM prose is not catalog SoT.
- Zigbee plugs are additive; climate legs stay on Sonoffs.

## HA lab note

HA custom panel may still show surface **7.2.0** in lab. Product appliance is **7.0.0** on Pi.
