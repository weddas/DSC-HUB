# DSC-HUB 7.0.0 — Pi appliance (Docker Compose)

Raspberry Pi 4 product stack: brain + SPA (`:8787`), optional local CannaLib fallback (`:8790`), Mosquitto, Zigbee2MQTT (SkyConnect), ESPHome dashboard (`:6052`).

## Quick start (Pi)

1. Flash **Raspberry Pi OS Lite 64-bit** with Raspberry Pi Imager (hostname `dsc-brain`, SSH key).
2. Clone this repo onto USB SSD; mount data at `/var/lib/dsc-hub`.
3. Run `sudo services/dsc-hub/pi/pi-bootstrap.sh` (default `DSC_AP_PSK` matches fleet firmware — see Notion *DSC-Brain Pi AP*).
4. Copy `services/dsc-hub/env.example` → `services/dsc-hub/.env` and fill secrets (Notion **API Keys & Credentials**).
   - Fill `firmware/v4/secrets.yaml` from `secrets.yaml.template` — `wifi_ssid`/`wifi_password` must match Pi AP SSID/`DSC_AP_PSK` (fleet default documented in Notion *DSC-Brain Pi AP*; do not invent a second password).
   - Noise API keys (`DSC_HUB_API_KEY`, …) must match firmware `api.encryption.key` — brain uses them as **noise_psk** (ESPHome 2026+).
   - If a live Pi still has hostapd passphrase `changeme-dsc-brain`, run `services/dsc-hub/pi/fix-ap-psk.sh`.
   - After `.env` changes: `services/dsc-hub/pi/recreate-brain-env.sh` (or deploy path that force-recreates brain). Hot-patch alone does not reload env.
   - Stale hub SoftAP/Nest BSSID lock: copy `brain/scripts/clear_hub_wifi_pref.py` to `/tmp/` then `services/dsc-hub/pi/clear-hub-wifi-pref.sh`.
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

Full runbook: [`docs/qa/PI-APPLIANCE-7.0.md`](../../docs/qa/PI-APPLIANCE-7.0.md). Cutover checklist: [`docs/ops/DSC-HUB-DOCKER.md`](../../docs/ops/DSC-HUB-DOCKER.md).
