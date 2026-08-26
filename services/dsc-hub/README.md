# DSC-HUB 7.0.0 — Pi appliance (Docker Compose)

Raspberry Pi 4 product stack: brain + SPA (`:8787`), optional local CannaLib fallback (`:8790`), Mosquitto, Zigbee2MQTT (SkyConnect), ESPHome dashboard (`:6052`).

Full ops: [`docs/qa/PI-APPLIANCE-7.0.md`](../../docs/qa/PI-APPLIANCE-7.0.md) · Cutover: [`docs/ops/DSC-HUB-DOCKER.md`](../../docs/ops/DSC-HUB-DOCKER.md).

## Quick start (Pi)

1. Flash **Raspberry Pi OS Lite 64-bit** with Raspberry Pi Imager (hostname `dsc-brain`, SSH key).
2. Clone this repo onto USB SSD; mount data at `/var/lib/dsc-hub`.
3. Run `sudo services/dsc-hub/pi/pi-bootstrap.sh` (default `DSC_AP_PSK` matches fleet firmware — see Notion *DSC-Brain Pi AP*). Creates `/opt/dsc-hub` + `/opt/dsc-hub-repo` symlinks.
4. Copy `services/dsc-hub/env.example` → `services/dsc-hub/.env` and fill secrets (Notion **API Keys & Credentials**).
   - Fill `firmware/v4/secrets.yaml` from `secrets.yaml.template` — `wifi_ssid`/`wifi_password` must match Pi AP SSID/`DSC_AP_PSK` (fleet default in Notion *DSC-Brain Pi AP*; do not invent a second password).
   - Noise API keys (`DSC_HUB_API_KEY`, …) must match firmware `api.encryption.key` — brain uses them as **noise_psk** (ESPHome 2026+).
   - If a live Pi still has hostapd passphrase `changeme-dsc-brain`, run `services/dsc-hub/pi/fix-ap-psk.sh`.
   - After `.env` changes: `services/dsc-hub/pi/recreate-brain-env.sh` (or deploy path that force-recreates brain). Hot-patch alone does not reload env.
   - Stale hub SoftAP/Nest BSSID lock: copy `brain/scripts/clear_hub_wifi_pref.py` to `/tmp/` then `services/dsc-hub/pi/clear-hub-wifi-pref.sh`.
   - From Windows when the Pi is on LAN: `services/dsc-hub/pi/sync-cutover.ps1`
5. Copy CannaLib checkpoint sqlite to `/var/lib/dsc-hub/cannalib/dsc_brain.sqlite3`.
6. Plug SkyConnect (USB2); set `ZIGBEE_DEVICE` in `.env`.
7. `sudo systemctl start dsc-hub-ap.service` then `dsc-hub-compose.service` (compose unit passes `--env-file /opt/dsc-hub/.env`).

## Services

| Service   | Port   | Role                                      |
|-----------|--------|-------------------------------------------|
| brain     | 8787   | FastAPI + React SPA, fleet/control/history |
| cannalib  | 8790   | Offline catalog fallback (read-only)      |
| mosquitto | 1883   | Internal MQTT (z2m + brain)               |
| zigbee2mqtt | —    | SkyConnect coordinator                    |
| esphome   | 6052   | OTA / compile dashboard (AP-only)         |

## Deploy brain to Pi (Windows → DSC-Brain AP)

From repo root when Pi is on `10.42.0.1`:

```powershell
services/dsc-hub/pi/deploy-brain.ps1
```

This builds the Pi SPA on the laptop (`npm run build:spa`), uploads brain Python + `static/` + `Dockerfile.prebuilt`, then on the Pi:

1. Brings **eth0** up (`bring-up-eth0.sh`) so Docker can pull base images / DNS
2. Tries `docker compose build --pull brain` (**prebuilt SPA**, no Node on Pi)
3. `up -d --force-recreate brain` on success (`DEPLOY_MODE=image-build`)
4. Falls back to force-recreate + **hot-patch** (`docker cp` `dsc_brain/` + `static/`) if offline
5. Logs deploy mode: `image-build` or `hot-patch`

Verify after deploy:

```bash
curl -s http://10.42.0.1:8787/health
curl -s http://10.42.0.1:8787/fleet | jq '.hub.online, .surface, (.inventory|length)'
curl -s 'http://10.42.0.1:8787/history?entity_id=sensor.dsc_hub_tent_temperature&hours=1'
```

Hard refresh `http://10.42.0.1:8787/#/ops/home` (Ctrl+Shift+R). Tip SPA assets include `index-BXZwXQYP.js` (FleetState Dash Home + dual-slug ingest).

From Windows after deploy:

```powershell
services/dsc-hub/pi/verify-brain.ps1
```

Pi layout: `/opt/dsc-hub` (compose), `/opt/dsc-hub-repo` (full repo for builds). Bootstrap creates both symlinks.

`brain/static/` is a deploy artifact (gitignored). `deploy-brain.ps1` builds the SPA into `spa-dist/`, packs it into the brain image or hot-patches `/app/static/`. Prefer **image-build** after ingest/map changes. Ops: [`docs/qa/PI-APPLIANCE-7.0.md`](../../docs/qa/PI-APPLIANCE-7.0.md) · Audit: [`docs/AUDIT-2026-08-26.md`](../../docs/AUDIT-2026-08-26.md).

## Build brain image (dev)

```bash
cd services/dsc-hub
# Requires spa-dist copied into brain/static first (deploy script does this)
docker compose build brain
docker compose --env-file .env up -d
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
- Node toolchain (SPA is prebuilt off-Pi)
