# DSC-HUB Pi appliance — operations

**Release:** DSC-HUB 7.0.0 — The Pi Release · tip **`c1eaedd`** (7.4 software WiP; surface still **7.3.0**).

## Network

- **AP:** `DSC-Brain` 2.4 GHz, locked channel (1/6/11), WPA2.
- **Subnet:** `10.42.0.0/24`, Pi AP `10.42.0.1`.
- **eth0:** House uplink (optional). Climate runs island; Ollama + remote CannaLib need uplink.
- **Avahi:** `dsc-brain.local`

Fleet DHCP reservations live in `/etc/dsc-hub/dnsmasq.conf` (bootstrap template). After flash, add device MACs from Settings inventory.

## Software-only demo (not the Pi fleet)

Isolated Compose — **no** ESPHome / MQTT / Zigbee / LAN keys. Host port **8788**. Public hostname: `brain-demo.plausible-deniability.net` (Cloudflare tunnel → `:8788`).

```bash
docker compose -f services/dsc-hub/docker-compose.demo.yml up -d --build
# or on NAS: services/dsc-hub/pi/deploy-brain-demo-remote.sh
curl -s http://localhost:8788/health   # mode=demo
```

Runbook: [`docs/brain/DEMO-MODE.md`](../brain/DEMO-MODE.md). Never point demo inventory at private hosts or set `DSC_*_API_KEY`. Soft calibrate / lab wet: [`LAB-WET-CAL.md`](LAB-WET-CAL.md). Plant seat / probe layers: [`../brain/PLANT-SEAT.md`](../brain/PLANT-SEAT.md).

## Deploy: SkipSpaBuild

`services/dsc-hub/pi/deploy-brain.ps1 -SkipSpaBuild` reuses the existing `spa-dist/` tree (NAS-safe when `npm run build:spa` already ran or committed hashes are current). Default path still builds SPA then packs static into the brain image / hot-patch.

After any SPA change that must land on Pi: build (or omit `-SkipSpaBuild`), commit matching `spa-dist` hashes when the tree tracks them, hard-refresh `:8787`.

Current tip spa-dist entry: `index-DL1EcjhX.js` (+ `calibrate-D1D5CnxU` · `tune-fleet-IPnSFs3d`).

**Pitfall (tips `39d7f88`→`c1eaedd`):** HubLinkLine Up/Down + Beat honesty + desk-wide `HelpTip` landed in **source** only. Committed `tune-fleet-IPnSFs3d` / `index-DL1EcjhX` still lack `dsc-help-tip` until the next `npm run build:spa` / deploy without `-SkipSpaBuild`. See [`../brain/HELP-TIP.md`](../brain/HELP-TIP.md).

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

- Uptime Kuma: `GET http://dsc-brain.local:8787/health`
- Fleet WS: `ws://dsc-brain.local:8787/ws/fleet`

## Honesty boundaries

- Pi power-off → AP dies; Sonoffs failsafe OFF.
- Brain container restart (deploy/`compose up`) briefly drops the hub AP; hub and fleet devices rejoin within ~2 min. Expect a short fleet-offline window on every deploy — not a fault.
- LLM prose is not catalog SoT.
- Zigbee plugs are additive; climate legs stay on Sonoffs.

## HA lab note

HA custom panel may lag Pi surface. Product appliance SPA on Pi is SoT (`:8787`). Lovelace YAML retired (7.3 archive).
