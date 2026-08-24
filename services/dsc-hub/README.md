# DSC-HUB 7.0.0 — Pi appliance (Docker Compose)

Raspberry Pi 4 product stack: brain + SPA (`:8787`), optional local CannaLib fallback (`:8790`), Mosquitto, Zigbee2MQTT (SkyConnect), ESPHome dashboard (`:6052`).

## Quick start (Pi)

1. Flash **Raspberry Pi OS Lite 64-bit** with Raspberry Pi Imager (hostname `dsc-brain`, SSH key).
2. Clone this repo onto USB SSD; mount data at `/var/lib/dsc-hub`.
3. Run `sudo services/dsc-hub/pi/pi-bootstrap.sh`.
4. Copy `services/dsc-hub/env.example` → `services/dsc-hub/.env` and fill secrets (Notion **API Keys & Credentials**).
   - Fill `firmware/v4/secrets.yaml` from `secrets.yaml.template` (Pi WiFi SSID/PSK from Notion **API Keys & Credentials** / `.env` — never commit).
   - From Windows when the Pi is on LAN: `services/dsc-hub/pi/sync-cutover.ps1`
5. Copy CannaLib checkpoint sqlite to `/var/lib/dsc-hub/cannalib/dsc_brain.sqlite3`.
6. Plug SkyConnect (USB2); set `ZIGBEE_DEVICE` in `.env`.
7. `sudo systemctl start dsc-hub-ap.service` then `dsc-hub-compose.service`.

## Services

| Service   | Port   | Role                                      |
|-----------|--------|-------------------------------------------|
| brain     | 8787   | FastAPI + React SPA, fleet/settings APIs  |
| cannalib  | 8790   | Offline catalog fallback (read-only)      |
| mosquitto | 1883   | Internal MQTT (z2m + brain)               |
| zigbee2mqtt | —    | SkyConnect coordinator                    |
| esphome   | 6052   | OTA / compile dashboard (AP-only)         |

## Build brain image (dev)

```bash
cd services/dsc-hub
docker compose build brain
docker compose up -d
```

Health: `curl http://localhost:8787/health`

## Version matrix (cutover)

| Artifact        | Target      |
|-----------------|-------------|
| Firmware        | 7.0.0.0     |
| Brain / SPA     | 7.0.0       |
| Docker images   | 7.0.0       |

Until island proof succeeds, tree stays `7.0.0-dev`.

## Not on the Pi

- Ollama (remote URL in Settings)
- HA Core / house ZHA
- CannaLib scrape / master DB (NAS)

See `docs/ops/DSC-HUB-DOCKER.md` and `docs/qa/PI-APPLIANCE-7.0.md` for cutover, APIs, and acceptance.
