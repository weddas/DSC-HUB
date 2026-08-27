# DSC-HUB 7.0.0 — Pi appliance (Docker Compose)

Raspberry Pi 4 product stack: brain + SPA (`:8787`), optional local CannaLib fallback (`:8790`), Mosquitto, Zigbee2MQTT (SkyConnect), ESPHome dashboard (`:6052`).

## Quick start (Pi)

1. Flash **Raspberry Pi OS Lite 64-bit** with Raspberry Pi Imager (hostname `dsc-brain`, SSH key).
2. Clone this repo onto USB SSD; mount data at `/var/lib/dsc-hub`.
3. Run `sudo services/dsc-hub/pi/pi-bootstrap.sh`.
4. Copy `services/dsc-hub/env.example` → `services/dsc-hub/.env` and fill secrets (Notion **API Keys & Credentials**).
   - Fill `firmware/v4/secrets.yaml` from `secrets.yaml.template` (Pi WiFi: `DSC-Brain` / `Digital1`).
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

## Deploy brain to Pi (Windows → DSC-Brain AP)

From repo root when Pi is on `10.42.0.1`:

```powershell
services/dsc-hub/pi/deploy-brain.ps1
```

This builds the Pi SPA, uploads brain Python + static, then on the Pi:
1. Tries `docker compose build brain` (needs Docker Hub / eth0)
2. Falls back to hot-patch if offline
3. Logs deploy mode: `image-build` or `hot-patch`
4. Waits up to **90s** for `hub.online` on `/fleet` (ingest warmup after AP drop)

Studio LAN one-shot (NAS/`Y:`): `services/dsc-hub/pi/studio-deploy.ps1` → deploy → verify → island-proof. Defaults **`192.168.86.48`**. Hub-ingest wait details: [`docs/ops/DEPLOY-PROOF.md`](../../docs/ops/DEPLOY-PROOF.md).

Verify after deploy:

```bash
curl -s http://10.42.0.1:8787/health
curl -s http://10.42.0.1:8787/fleet | jq '.hub.online, .surface, .inventory | length'
```

Hard refresh `http://10.42.0.1:8787/#/fleet` (Ctrl+Shift+R).

From Windows after deploy:

```powershell
services/dsc-hub/pi/verify-brain.ps1
services/dsc-hub/pi/island-proof.ps1
```

`verify-brain` WARNs if hub still offline; `island-proof` waits (default 90s) then fails hard if still offline.

Pi layout: `/opt/dsc-hub` (compose), `/opt/dsc-hub-repo` (full repo for builds). Bootstrap creates both symlinks.

`brain/static/` is a deploy artifact (gitignored). `deploy-brain.ps1` builds the SPA into `spa-dist/`, packs it into the brain image or hot-patches `/app/static/`.

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

Until island proof succeeds, tree may ship as `7.0.0` with fleet firmware train `7.0.0.0`.

## Not on the Pi

- Ollama (remote URL in Settings)
- HA Core / house ZHA
- CannaLib scrape / master DB (NAS)

See `docs/ops/DSC-HUB-DOCKER.md` for cutover and acceptance.
