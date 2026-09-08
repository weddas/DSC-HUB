# DSC-HUB Pi appliance — operations

**Release:** DSC-HUB **8.1.0** (brain/SPA) · expected firmware **8.0.0.0**.
Upgrade path: [`../../UPGRADE.md`](../../UPGRADE.md). SD bake:
[`../../services/dsc-hub/image/README.md`](../../services/dsc-hub/image/README.md).

## Network

- **AP:** `DSC-Brain` 2.4 GHz, locked channel (1/6/11), WPA2.
- **Subnet:** `10.42.0.0/24`, Pi AP `10.42.0.1`.
- **eth0:** House uplink (optional). Climate runs island; Ollama + remote CannaLib need uplink.
- **Avahi:** `dsc-brain.local`
- **ESPHome:** host venv `/opt/dsc-esphome-venv`, `dsc-esphome-dashboard.service` on `:6052`, `dsc-esphome-update.path` for toolchain updates from the brain container ([`ESPHOME-TOOLCHAIN.md`](ESPHOME-TOOLCHAIN.md))

Fleet DHCP reservations live in `/etc/dsc-hub/dnsmasq.conf` (bootstrap template). After flash, add device MACs from Settings inventory.

## Cutover checklist

1. Bootstrap Pi (`pi-bootstrap.sh`), compose up, `/health` green (`version` / `surface` **8.1.0**).
2. Move SkyConnect from Unraid; z2m sees coordinator.
3. Build firmware **8.0.0.0** (`wifi-pi` stubs); rotate Noise API keys → `.env` + Notion.
4. Flash order: pot2 canary → remaining pots → Sonoffs → panel → **hub last** (Settings → Devices → Firmware, or `pi/flash-fleet-remote.sh`).
5. (HA lab retired 2026-09 — nothing to disable; the fleet no longer reads any `platform: homeassistant` entity.)
6. Hub ESP-NOW parked on Pi path; brain polls hub demand switches and drives Sonoff relays (45s stale OFF).
7. **Island proof:** Nest off; tent on Pi AP; fleet chip `8.0.0.0`.
8. With eth0 up: Settings → Test Ollama + Test CannaLib green.
9. With eth0 down: integrations HELD; catalog uses local fallback if present.
10. GitHub release [`v8.1.0`](https://github.com/weddas/DSC-HUB/releases/tag/v8.1.0) is published (2026-09-08) — Kit Update Check reads `releases/latest` and offers brain bumps when `_is_newer` is true.

## Acceptance tests

```bash
# Brain unit tests
pip install -r brain/requirements.txt pytest
pytest brain/tests -q

# Firmware config (on host with esphome, or the Pi venv /opt/dsc-esphome-venv/bin/esphome)
esphome config firmware/v4/dsc-hub.yaml
esphome config firmware/v4/dsc-control.yaml

# SPA build (bundled into brain image)
cd frontend
npm install && npm run build
```

## Monitoring

- Uptime Kuma: `GET http://dsc-brain.local:8787/health`
- Fleet WS: `ws://dsc-brain.local:8787/ws/fleet`

## Cameras (S7 core)

Brain images install **ffmpeg**. Compose maps `${DSC_CAMERA_DEVICE:-/dev/null}` → container `/dev/video0` so kits without a webcam still start. Set `DSC_CAMERA_DEVICE=/dev/video0` in `services/dsc-hub/.env` and recreate the brain container when a USB webcam is on the Pi. Operator guide: [`docs/cameras.md`](../cameras.md). Hotpatch helper: `.audit/cameras-pi-hotpatch.ps1`.

## SPA production builds

Before hotpatching a SPA that touches twin / Three.js / lazy routes, run `vite preview` — Vite **dev** does not reproduce the Rollup chunk graph. See [`SPA-PROD-BUNDLE.md`](SPA-PROD-BUNDLE.md).

## Honesty boundaries

- Pi power-off → AP dies; Sonoffs failsafe OFF.
- Brain container restart (deploy/`compose up`) briefly drops the hub AP; hub and fleet devices rejoin within ~2 min. Expect a short fleet-offline window on every deploy — not a fault.
- LLM prose is not catalog SoT.
- Zigbee plugs are additive; climate legs stay on Sonoffs.

## HA lab note

HA custom panel may still show surface **7.2.0** in lab. Product appliance is **7.0.0** on Pi.
