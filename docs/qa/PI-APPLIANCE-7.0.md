# DSC-HUB 7.0 — Pi appliance ops

**Intent:** Product path is a Raspberry Pi 4 island (`DSC-Brain` AP) running brain + SPA + MQTT/Zigbee + ESPHome dashboard. Hub keeps ladder safety. Brain polls hub demand switches and drives Sonoff `main_relay` over Native API. ETH01 bridge and hub ESP-NOW are **parked** on this path.

**Tip commit:** `c1a451a` · **Firmware:** `7.0.0.0` · **Brain/SPA:** `7.0.0-dev` until island soak + tag `v7.0.0`.

Prior tips still apply: Pi appliance ship (`c4eb97f`), AP PSK alignment (`8867b33`), Native API **noise_psk** + WiFi-pref clear + env recreate (`db85cbc`), FleetSnapshot SPA + `/control` + `/history` + **Dockerfile.prebuilt** (`47f6622`). This tip **polls hub control state** into `hub.values.controls` and wires Climate / EntityToggle / fans / targets through **`useFleetEntity`** (Pi-native readback with HA fallback).

Compose quick start: [`services/dsc-hub/README.md`](../../services/dsc-hub/README.md) · Cutover checklist: [`docs/ops/DSC-HUB-DOCKER.md`](../ops/DSC-HUB-DOCKER.md) · Architecture: [`docs/DSC-BRAIN.md`](../DSC-BRAIN.md) · SPA contract: [`docs/brain/WEBUI.md`](../brain/WEBUI.md)

---

## Architecture

```mermaid
flowchart LR
  subgraph pi [Pi_DSC_Brain]
    AP[wlan0_AP_10.42.0.1]
    Brain[brain_SPA_8787]
    Z2M[zigbee2mqtt]
    MQTT[mosquitto]
    ESPDash[esphome_6052]
    Brain --> MQTT
    Z2M --> MQTT
  end
  Hub[Hub_ladder] -->|Native_API_vitals| Brain
  Panel[DSC_CONTROL] -->|Native_API| Brain
  Pots[Pots] -->|Native_API| Brain
  Brain -->|poll_demand_switches| Hub
  Brain -->|command_main_relay| Sonoffs[Sonoff_relays]
  SPA[React_SPA] -->|FleetSnapshot_WS| Brain
  SPA -->|control_history| Brain
  Hub -.->|ESP_NOW_parked| Panel
  eth0[eth0_uplink_optional] --> AP
```

| Layer | Owns | Does not own |
|---|---|---|
| Hub | Ladder, failsafes, min-off, PWM | Catalog SoT, Sonoff drive on Pi path |
| Brain | Inventory, fleet ingest, appliance driver, Want/decision, SPA API | Hard safety if Pi power dies |
| SPA | Presentation + HA-shaped control/history proxies | Catalog SoT / Want math |
| Sonoffs | Local `main_relay` + API-loss grace | Climate policy |
| eth0 | Optional Ollama / remote CannaLib / Docker Hub pulls | Climate island (AP alone is enough) |

---

## Version trains (do not conflate)

| Train | SoT | Notes |
|---|---|---|
| **Pi product** | FW **7.0.0.0**, brain/SPA **7.0.0(-dev)** | `*-wifi-pi.yaml`, `10.42.0.0/24` |
| HA lab soak | Surface **7.2.0**, prior studio FW **6.1.0.0** | Still valid for Unraid/HA; not the Pi island |
| Kit SoftAP | `*-kit.yaml` | Product unbox without Pi; separate path |

---

## Pi subnet map

Defaults from `brain/dsc_brain/settings.py` + `firmware/v4/dsc-*.yaml` stubs + bootstrap `dnsmasq.conf`:

| Seat | Host | Stub / package |
|---|---|---|
| Pi AP | `10.42.0.1` (`dsc-brain.local`) | `pi-bootstrap.sh` hostapd/dnsmasq |
| Hub | `10.42.0.10` | `dsc-hub.yaml` → `dsc-hub-wifi-pi.yaml` + parked ESP-NOW |
| Control | `10.42.0.11` | `dsc-control.yaml` → `dsc-control-wifi-pi.yaml` |
| Pot1–4 | `10.42.0.21`–`.24` | `dsc-pot{N}.yaml` → `dsc-pot-wifi-pi.yaml` |
| Heater / heatmat | `.50` / `.51` | Sonoff stubs + `dsc-sonoff-wifi-pi.yaml` |
| Humidifier / dehumidifier | `.54` / `.55` | same |
| Bridge (lab only) | eth archaeology | **Not** on Pi product path |

After first flash, paste device MACs into Settings inventory / `/etc/dsc-hub/dnsmasq.conf` `dhcp-host=` lines so reservations stick.

---

## AP PSK alignment (fleet must match)

**Constraint:** Pi hostapd passphrase, brain `ap_psk` / `DSC_AP_PSK`, and firmware `wifi_password` (Pi stubs) must be the **same** shared secret. Mismatch → devices never join `DSC-Brain`.

Tip `8867b33` aligned code defaults to the fleet shared PSK (same value as `services/dsc-hub/README.md` / `env.example`). Canonical store: Notion **API Keys & Credentials** → *DSC-Brain Pi AP (fleet Wi-Fi)*. Do **not** paste the live PSK into Wiki or PR bodies.

| Path | Behavior |
|---|---|
| `brain/dsc_brain/settings.py` | `DEFAULT_SETTINGS["ap_psk"]` = fleet default; `init_settings_db` upgrades `''` or `changeme-dsc-brain` → fleet default |
| `brain/dsc_brain/network_apply.py` | `render_hostapd_conf` fallback when unset: fleet default (was placeholder) |
| `services/dsc-hub/pi/pi-bootstrap.sh` | `DSC_AP_PSK` default = fleet default |
| `services/dsc-hub/env.example` | `DSC_AP_PSK=` fleet default |
| `services/dsc-hub/pi/fix-ap-psk.sh` | One-shot: if live `/etc/dsc-hub/hostapd.conf` still has `wpa_passphrase=changeme-dsc-brain`, rewrite + restart `dsc-hub-ap.service` |

```mermaid
flowchart TD
  secrets[firmware_secrets_wifi_password] --> flash[wifi_pi_flash]
  env[DSC_AP_PSK_or_settings_ap_psk] --> apply[network_apply_hostapd]
  boot[pi_bootstrap_hostapd] --> live[/etc/dsc-hub/hostapd.conf]
  apply --> live
  live --> ap[DSC_Brain_AP]
  flash --> sta[Fleet_STA]
  ap --> sta
```

**Live Pi already bootstrapped before the tip:** run `bash services/dsc-hub/pi/fix-ap-psk.sh` on the Pi (or set Settings `ap_psk` + network apply, then copy rendered hostapd and restart AP). Confirm firmware secrets `wifi_password` matches before expecting STA joins.

---

## Native API auth (ESPHome 2026+)

Firmware exposes Noise encryption (`api.encryption.key` ← secret `dsc_*_api_key`). Brain clients must pass that key as **`noise_psk`**, not legacy password positional auth.

Factory: `brain/dsc_brain/native_api.py` → `make_api_client(host, api_key)`.

| Caller | Role |
|---|---|
| `esphome_client.py` | Fleet vitals ingest (hub / pots / Sonoffs / panel) |
| `appliance_driver.py` | Hub demand poll + Sonoff `main_relay` commands |
| `hub_native.py` | Proposal path connect (emit still mostly logged) |
| `brain/scripts/clear_hub_wifi_pref.py` | One-shot hub WiFi-pref clear |

Keys come from inventory `api_key`, else `DSC_<SEAT>_API_KEY` / settings / compose `.env` (`DSC_HUB_API_KEY`, …). Canonical store: Notion **API Keys & Credentials** — never paste live Noise keys into Wiki/PRs.

```mermaid
flowchart LR
  secrets[firmware_api_encryption_key] --> device[ESP_device_6053]
  env[DSC_SEAT_API_KEY_or_inventory] --> factory[make_api_client]
  factory -->|noise_psk| device
```

**Pitfall:** Passing the key as the third positional `password` argument to `APIClient` fails against ESPHome 2026 Noise-only devices (connect/login errors; ingest and appliance driver look “dead”).

### Async start (must have a running loop)

`EsphomeIngest.start()` and `start_appliance_driver()` use `asyncio.get_running_loop()` and create the background task only when called from a live loop. If started with no running loop they log a warning and **return without scheduling** (silent no-op is gone). Subscribe helpers that are sync in current `aioesphomeapi` are not `await`ed.

---

## Appliance driver (replaces ETH01)

Code: `brain/dsc_brain/appliance_driver.py` (via `make_api_client`).

| Constraint | Value |
|---|---|
| Poll | every **2 s** |
| Hub → seat map | `heater_demand`→`heater`, `humidifier_demand`→`humidifier`, `dehumidifier_demand`→`dehumidifier`, `growmat_demand`→`heatmat` |
| Sonoff switch | object_id `main_relay` |
| Stale failsafe | no successful hub demand read for **45 s** → all mapped relays **OFF** |
| Auth | inventory `api_key` else env/settings → **noise_psk** |

Hub ESP-NOW package on Pi stubs: `dsc-hub-espnow-parked.yaml` (no primary mesh). Bridge demand path is lab archaeology — see [`docs/brain/F010_APPLIANCE_BRIDGE.md`](../brain/F010_APPLIANCE_BRIDGE.md).

---

## Clear stale hub WiFi preference

**Intent:** After SoftAP/Nest → Pi AP moves, hub NVS may still hold **Preferred WiFi BSSID** and **Lock WiFi AP**. Lock + stale BSSID causes mismatch-bounce / refusal to stay on `DSC-Brain`.

Hub entities (firmware `dsc-hub-v4_0.yaml`): switch `lock_wifi_ap`, text `preferred_wifi_bssid`, button `clear_preferred_wifi_ap` (“Clear Preferred WiFi AP”).

| Script | Role |
|---|---|
| `brain/scripts/clear_hub_wifi_pref.py` | Native API: lock OFF → press clear button (else blank preferred text) |
| `services/dsc-hub/pi/clear-hub-wifi-pref.sh` | Pi wrapper: read `DSC_HUB_API_KEY` from `/opt/dsc-hub/.env`, run script in `dsc-hub-brain`, print `/fleet` hub online + link bits |

```bash
# On the Pi (hub at 10.42.0.10)
cp /opt/dsc-hub-repo/brain/scripts/clear_hub_wifi_pref.py /tmp/
bash /opt/dsc-hub-repo/services/dsc-hub/pi/clear-hub-wifi-pref.sh
```

Env overrides for the Python script: `HUB_HOST` (default `10.42.0.10`), `HUB_KEY` or `DSC_HUB_API_KEY` (or `/tmp/hub_key.txt` after the wrapper).

---

## Reload brain container env on deploy

Compose only picks up `.env` changes when the brain service is **recreated**. Tip `db85cbc` folds that into remote deploy and adds a one-shot helper.

| Script | Role |
|---|---|
| `services/dsc-hub/pi/deploy-brain-remote.sh` | After sync: copy `.env` → `/tmp/dsc-hub-compose.env`, remove accidental `.env\r` Windows duplicate, `docker compose … up -d --force-recreate brain`, then hot-patch `dsc_brain/` |
| `services/dsc-hub/pi/recreate-brain-env.sh` | Same recreate + hot-patch + `KEYLEN` / `/health` / `/fleet` checks (optional sudo password arg) |

```mermaid
flowchart TD
  envfile["/opt/dsc-hub/.env"] --> tmp["/tmp/dsc-hub-compose.env"]
  tmp --> recreate["compose_force_recreate_brain"]
  code["repo_brain_dsc_brain"] --> docker_cp["docker_cp_into_container"]
  recreate --> docker_cp
  docker_cp --> restart["restart_dsc-hub-brain"]
```

**Pitfall:** Windows upload can leave a filename literally `.env\r` beside `.env`. Scripts delete that duplicate before recreate. Hot-patch alone does **not** refresh `DSC_HUB_API_KEY` inside the container — recreate does.

---

## Public HTTP / WS surface

Brain listens on **`:8787`** (`dsc_brain.api`). SPA is served from `/` when `brain/static/` (or image `/app/static`) is built.

| Method | Path | Role |
|---|---|---|
| GET | `/health` | version, surface, expected firmware |
| GET | `/fleet` | **FleetSnapshot** + inventory (`?include_hass=true` adds legacy hass-shaped map) |
| WS | `/ws/fleet` | FleetSnapshot + inventory ~2 s |
| POST | `/control/service` | HA-shaped `{domain, service, data}` → Native API / inventory |
| GET | `/history` | `entity_id` + `hours` (0.25–168) → `{t,v}` points from `fleet_history` |
| GET/PATCH | `/settings` | settings blob |
| PATCH | `/settings/inventory/{seat_id}` | host / mac / api_key / in_service |
| GET/PATCH | `/roster`, `/roster/{seat_id}` | plant seats |
| GET | `/learning` | learning log |
| POST | `/settings/integrations/test-ollama` | uplink probe |
| POST | `/settings/integrations/test-cannalib` | catalog probe |
| POST | `/settings/zigbee/permit-join` | z2m permit join |
| GET/POST | `/settings/network`, `/settings/network/apply` | AP/dnsmasq apply hooks |
| GET/POST | `/settings/esphome/devices`, `/settings/esphome/jobs` | OTA job queue |
| GET/POST | `/settings/backup/export`, `/settings/backup/import` | ops zip |
| GET | `/v1/catalogs/{kind}` | CannaLib prefer → local slim |
| GET | `/catalogs/{kind}`, `/want/{id}`, POST `/decision/tick` | local catalog / Want / dry-run |

OpenAPI: `http://dsc-brain.local:8787/docs`.

---

## FleetSnapshot SPA (native fleet state)

**Intent:** Pi UI reads typed fleet seats (`hub` / `panel` / `pots` / `sonoffs` / `system`), not HA `entity_id` strings. HA panel path stays dual-mode for lab soak.

```mermaid
flowchart TD
  ingest[esphome_ingest] --> fs[FleetState]
  appl[appliance_driver] --> fs
  ingest -->|hub.values.controls| fs
  fs --> get["GET /fleet"]
  fs --> ws["WS /ws/fleet"]
  get --> provider[FleetProvider_source_pi]
  ws --> provider
  provider --> entityHook[useFleetEntity]
  entityHook --> pages[Climate_EntityToggle_Fans_Targets]
  pages -->|callService| ctrl["POST /control/service"]
  pages -->|charts| hist["GET /history"]
  ctrl --> native[Native_API_noise_psk]
  hist --> sqlite[fleet_history_sqlite]
```

| Path | Role |
|---|---|
| `brain/dsc_brain/fleet_state.py` | Product SoT snapshot (`to_dict`, optional `to_hass_states`) |
| `brain/dsc_brain/hub_controls.py` | Shared HA `entity_id` ↔ ESPHome `object_id` maps (ingest + writes) |
| `brain/dsc_brain/esphome_client.py` | Hub poll fills `hub.values.controls` via `_hub_controls_from_states` |
| `frontend/src/lib/fleetModel.ts` | `FleetSnapshot` / `parseFleetSnapshot` (mirrors brain) |
| `frontend/src/hooks/useFleet.tsx` | `FleetProvider` — `source: "pi" \| "ha"` |
| `frontend/src/hooks/useFleetEntity.ts` | Pi: read `hub.values.controls[entity_id]`; else HA `useHass` |
| `frontend/src/lib/fleetControlMap.ts` | Control state / available / attributes helpers |
| `frontend/src/lib/fleetFromHass.ts` | HA lab adapter; also mirrors controls into hass-shaped map when present |
| `frontend/src/lib/fleetApi.ts` | `get_fleet_state`, `call_service`, `get_entity_history` |
| `frontend/src/hooks/useFleetActions.ts` | Pi → `/control/service`; HA → `hass.callService` |
| `frontend/src/hooks/useHistory.ts` | Pi → `/history`; HA → history WS |
| `frontend/src/main.tsx` | Pi boot: `BrainProvider` → `FleetProvider source="pi"` |

**Constraint:** Default `GET /fleet` does **not** include `hass_states` (tests assert this). Pass `?include_hass=true` only for legacy consumers.

### Hub control readback (`hub.values.controls`)

**Intent:** Climate UI and toggles need HA-shaped control **state**, not only vitals. On each hub Native API poll, brain builds `hub.values.controls` keyed by HA `entity_id`.

```mermaid
flowchart LR
  hub[Hub_Native_API] --> poll[esphome_client_fetch]
  maps[hub_controls_maps] --> poll
  poll --> ctrl["hub.values.controls"]
  ctrl --> fleet["GET_/fleet_WS"]
  fleet --> ufe[useFleetEntity]
  ufe -->|source_pi| ui[Climate_toggles_fans]
  ufe -->|miss_or_ha| hass[useHass_fallback]
```

| Domain | Map (in `hub_controls.py`) | Entry shape |
|---|---|---|
| `switch` | demand + Full Auto / Manual Takeover / override / routing / recirc pulse | `{ state: "on"\|"off" }` |
| `number` | tent + clone temp / RH / VPD targets | `{ state: "<float string>" }` |
| `fan` | intake main/clone, exhaust recirc/out | `{ state, percentage }` |
| `light` | SF1000 dimmer | `{ state, brightness }` |
| `select` | control strategy, priority tent | `{ state, options[] }` |

**Consumers:** `EntityToggle`, fan sliders, `TentTargets`, Climate Full Auto / fan-override chips via `useFleetEntity(entityId)`. When `source === "pi"` and the entity is present under `controls`, UI uses that state; otherwise it falls back to HA (panel mode / unmapped ids).

**Verify:**

```bash
curl -s http://10.42.0.1:8787/fleet | jq '.hub.values.controls["number.dsc_hub_target_temp"]'
# expect: {"state":"24.5"} (or current setpoint)
```

### Control proxy (`control_ops.py`)

`POST /control/service` body: `{ "domain", "service", "data": { "entity_id", … } }`. Maps live in `hub_controls.py` (same allow-list as ingest).

| Domain | Allowed | Services | Effect |
|---|---|---|---|
| `input_boolean` | mapped in-service entities | `turn_on` / `turn_off` / `toggle` | `upsert_inventory(…, in_service=)` |
| `switch` | hub demand/mode switches + Sonoff `main_relay` | `turn_on` / `turn_off` (/ `toggle` on hub) | Native API `switch_command` |
| `number` / `input_number` | hub targets (temp/RH/VPD/clone bands) | `set_value` / `set` | Native API `number_command` |
| `fan` | 4 mapped hub fans | `turn_on` / `turn_off` / `set_percentage` | `fan_command` (speed_level 0–100) |
| `light` | `light.dsc_hub_sf1000_dimmer` | `turn_on` / `turn_off` | `light_command` (optional `brightness` 0–255) |
| `select` | strategy + priority tent | `select_option` | `select_command` (`option` required) |

Unsupported entity/service → **400**. Hub host missing / seat OOS / entity key not found → **503**. Sonoff writes require inventory `in_service`.

### History (`history_ops.py`)

Maps a fixed set of HA-shaped `entity_id`s → `(seat_id, metric)` in `fleet_history` (hub temp/RH/VPD, pot soil, Sonoff relay on). Unmapped ids return **empty** `points` (not 404). Hours clamp **0.25–168**.

Example:

```bash
curl -s 'http://10.42.0.1:8787/history?entity_id=sensor.dsc_hub_tent_temperature&hours=6'
curl -s -X POST http://10.42.0.1:8787/control/service \
  -H 'Content-Type: application/json' \
  -d '{"domain":"number","service":"set_value","data":{"entity_id":"number.dsc_hub_target_temp","value":24.5}}'
curl -s -X POST http://10.42.0.1:8787/control/service \
  -H 'Content-Type: application/json' \
  -d '{"domain":"fan","service":"set_percentage","data":{"entity_id":"fan.dsc_hub_4_inch_intake_fan_main","percentage":40}}'
```

---

## Prebuilt SPA image + eth0 bring-up

**Intent:** Pi should not compile Node on-device. Windows/dev builds the SPA; deploy packs static into `brain/static` and builds `Dockerfile.prebuilt` (Python-only). Image builds need house uplink (Docker Hub); eth0 bring-up runs before compose build.

| Artifact | Role |
|---|---|
| `services/dsc-hub/brain/Dockerfile.prebuilt` | `python:3.12-slim` + `dsc_brain` + prebuilt `static` + slim `homeassistant/data` — **no Node stage** |
| `services/dsc-hub/docker-compose.yml` | `build.dockerfile: …/Dockerfile.prebuilt`; compose systemd passes `--env-file /opt/dsc-hub/.env` |
| `services/dsc-hub/pi/deploy-brain.ps1` | `npm run build:spa` → tarball static + brain → pscp Dockerfile.prebuilt + `bring-up-eth0.sh` |
| `services/dsc-hub/pi/deploy-brain-remote.sh` | eth0 up → `compose build --pull brain` → `up -d --force-recreate`; else hot-patch `dsc_brain/` + `static/` |
| `services/dsc-hub/pi/bring-up-eth0.sh` | `ip link set eth0 up` + dhcpcd/dhclient/nmcli; may write Docker `daemon.json` DNS (IPv4) and restart docker |
| `services/dsc-hub/pi/dsc-hub-eth0.service` | Optional oneshot: `dhcpcd -b eth0` before docker |
| `pi-bootstrap.sh` | Symlinks `/opt/dsc-hub` (compose) and `/opt/dsc-hub-repo` (full tree for builds/hot-patch) |

```mermaid
flowchart TD
  spa["npm_run_build:spa"] --> static[brain_static]
  static --> tar[upload_tarballs]
  tar --> eth0[bring_up_eth0]
  eth0 --> build["compose_build_brain_prebuilt"]
  build -->|ok| recreate[force_recreate_brain]
  build -->|fail| hotpatch[docker_cp_dsc_brain_and_static]
  recreate --> health["GET /health"]
  hotpatch --> health
```

**Deploy modes (logged):** `image-build` when compose build succeeds; `hot-patch` when offline / Hub pull fails (Python+static copied into running container after force-recreate).

```powershell
# From Windows when Pi is on DSC-Brain AP
services/dsc-hub/pi/deploy-brain.ps1
```

```bash
curl -s http://10.42.0.1:8787/health
curl -s http://10.42.0.1:8787/fleet | jq '.hub.online, .surface, (.inventory|length)'
# Hard-refresh SPA (Ctrl+Shift+R) — hashed assets under /assets/
```

**Pitfalls:** AP-only Pi often cannot pull `python:3.12-slim` → expect `hot-patch`. Broken IPv6 Docker DNS on island → `bring-up-eth0.sh` sets explicit IPv4 DNS. Windows `.env` CRLF → deploy still normalizes LF and deletes `.env\r` before recreate.

---

## Docker stack

Compose: `services/dsc-hub/docker-compose.yml` (Pi arm64 — **not** Unraid Compose Manager).

| Service | Port | Role |
|---|---|---|
| brain | 8787 | FastAPI + prebuilt SPA |
| cannalib | 127.0.0.1:8790 | read-only local catalog fallback |
| mosquitto | internal 1883 | z2m ↔ brain |
| zigbee2mqtt | — | SkyConnect; permit-join from Settings |
| esphome | 6052 | dashboard over `/firmware/v4` |

Env template: `services/dsc-hub/env.example`. Secrets live in Notion **API Keys & Credentials** and gitignored `.env` / `firmware/v4/secrets.yaml` — **never** paste live keys or AP PSKs into Wiki/PRs.

---

## Cutover (operator)

1. Flash Pi OS Lite 64-bit (hostname `dsc-brain`), clone repo to SSD, data under `/var/lib/dsc-hub`.
2. `sudo services/dsc-hub/pi/pi-bootstrap.sh` → edit `.env` (AP PSK from Notion credentials) → copy CannaLib checkpoint sqlite → set `ZIGBEE_DEVICE` by-id.
3. `systemctl start dsc-hub-ap.service` then `dsc-hub-compose.service`; `curl http://dsc-brain.local:8787/health`.
4. Build/flash FW **7.0.0.0** (`wifi-pi` packages) with `wifi_ssid`/`wifi_password` matching the Pi AP. Order: **hub → Pot2 canary → pots → Sonoffs → panel**.
5. Disable HA demand-follower automations / HA ESPHome integrations for the tent (keep packages until soak).
6. Island proof: Nest + HA off; tent on Pi AP; fleet chip / health `expected_firmware` **7.0.0.0**.
7. eth0 up: Settings → Test Ollama + Test CannaLib. eth0 down: integrations HELD; local cannalib fallback if present.
8. Tag `v7.0.0` only after soak.

---

## Troubleshooting / pitfalls

| Symptom | Likely cause | Fix |
|---|---|---|
| Fleet never joins `DSC-Brain` | AP PSK ≠ firmware `wifi_password` | Align secrets + `.env` / Settings; see **AP PSK alignment**; live placeholder → `fix-ap-psk.sh` |
| Hub joins then flaps / stays off preferred AP | Stale preferred BSSID + Lock WiFi AP | Run **Clear stale hub WiFi preference** scripts |
| Ingest/appliance silent; `:6053` connect fails | Key passed as password not `noise_psk` | Tip `db85cbc` factory; recreate brain so `.env` Noise keys load |
| “ESPHome ingest / appliance not started” in logs | `start()` called with no running event loop | Start from FastAPI lifespan / async context only |
| Relays stuck / all OFF | Hub API unreachable >45 s | Check inventory host/keys; `/health` + hub `:6053`; recreate brain env if key empty (`KEYLEN=0`) |
| Wrong Sonoff | seat not `in_service` or missing `main_relay` | Settings inventory; ESPHome entity list |
| Devices on Nest IPs | Flashed lab/studio stubs | Re-flash Pi stubs (`*-wifi-pi.yaml`); clear SoftAP/Nest statics + hub WiFi pref |
| SkyConnect missing | serial console stole ACM | Bootstrap strips `console=serial0`; use `/dev/serial/by-id/…` |
| SPA 503 / blank assets | static not uploaded / stale hash | `npm run build:spa` then `deploy-brain.ps1`; hard refresh |
| Deploy logs `hot-patch` always | eth0 down / Docker Hub unreachable | Plug cable; run `bring-up-eth0.sh`; retry build |
| `/control/service` 400 | entity not in allow-lists | Only mapped hub/Sonoff/in-service entities (see **Control proxy** / `hub_controls.py`) |
| `/control/service` 503 | hub host/key missing or seat OOS | Inventory + recreate brain env; confirm `noise_psk` |
| Climate toggles stuck unavailable on Pi | `hub.values.controls` missing entity / hub offline | Confirm hub online on `/fleet`; wait one ingest cycle; check map in `hub_controls.py` |
| Fan % / light brightness wrong in UI | reading HA while on Pi, or stale SPA | Use tip SPA (`useFleetEntity`); hard-refresh; confirm `controls[…].percentage` / `.brightness` |
| Charts empty on Pi | unmapped `entity_id` or no samples | See `history_ops.ENTITY_METRIC_MAP`; wait for ingest |
| Catalog empty offline | no local sqlite + remote down | Place checkpoint under `/var/lib/dsc-hub/cannalib/` |
| Pi power loss | AP dies; relays failsafe OFF | Expected honesty boundary — hub ladder alone cannot reach Sonoffs |
| DHCP vs static Sonoffs | range starts at `.50` | Always set `dhcp-host=` MAC reservations after flash |
| HA panel still 7.2.0 | lab surface | OK — product appliance is **7.0.0** on Pi |
| Conflating `192.168.86.x` with `10.42.0.x` | Nest/studio vs Pi island | Use Pi map above for product path |

---

## Dev acceptance

```bash
pip install -r brain/requirements.txt pytest
pytest brain/tests -q

esphome config firmware/v4/dsc-hub.yaml
esphome config firmware/v4/dsc-control.yaml

cd homeassistant/custom_components/dsc_hub/frontend
npm install && npm run build:spa
```

Monitoring: Uptime Kuma → `GET /health`; fleet WS → `ws://dsc-brain.local:8787/ws/fleet`.
