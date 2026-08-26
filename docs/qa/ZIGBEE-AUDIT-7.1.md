# Zigbee audit — DSC-HUB 7.1 (full path)

**Date:** 2026-08-27  
**Scope:** Whole Zigbee path — `dsc-hub-z2m`, Mosquitto, Brain MQTT ingest, Settings/fleet APIs, SPA, placements, add-device honesty.  
**Not this doc:** Settings-page catalog only — that is [`SETTINGS-AUDIT-7.1.md`](SETTINGS-AUDIT-7.1.md). This audit owns radio → MQTT → Brain → Overview/Climate.  
**Brain:** `http://192.168.86.48:8787/` (`/health` 200, version `7.1.0` / surface `7.1.0`). `.30` is not the Brain.  
**Method:** code read + live GET + Pi SSH (`docker inspect` / `logs` / USB). Permit-join **not** enabled this pass (no 30s auto-expire in code). Stale sqlite `zigbee_permit_join=true` was cleared to `false` after the radio was confirmed down. No deploy, no stick factory-reset.

**Verdict: stub, not a working product path.**  
Live end-device count: **0**. Coordinator never initialized (`database.db` 0 bytes). `dsc-hub-z2m` crash-loops (`HOST_FATAL_ERROR`, RestartCount **98** at audit). Settings still sells “Permit join (2 min)” and “Zigbee devices can be added.”

---

## 1. Architecture (one-pager)

```text
SkyConnect USB ──► dsc-hub-z2m (koenkk/zigbee2mqtt:2 / 2.13.0)
                      │  frontend: disabled (by design)
                      │  serial: /dev/ttyACM0  adapter: ember
                      ▼  MQTT  zigbee2mqtt/#
                 dsc-hub-mosquitto:1883
                      │
                      ▼  paho subscribe  zigbee2mqtt/+
                                        zigbee2mqtt/bridge/devices
                 Brain ZigbeeMqttIngest
                      │  fleet.canopy
                      │  system.zigbee_devices / _states / _by_placement
                      ▼
                 GET /settings/zigbee/devices
                 POST /settings/zigbee/permit-join
                 GET /fleet  (+ hass_states sensor.dsc_canopy_*)
                      │
                      ▼
                 Settings card  (list + permit/stop)
                 Overview / Climate  (hub tent/clone/room only — no canopy)
```

| Layer | What exists | Live 2026-08-27 |
|-------|-------------|-----------------|
| Stick | Nabu Casa SkyConnect v1.0 on USB2 (`ttyUSB0`), compose `ZIGBEE_DEVICE` by-id → container `/dev/ttyACM0` | Serial **opens**, EZSP never starts |
| Extra USB | CH340 (`ttyUSB1`) — leftover flash dongle | Not mapped into z2m |
| z2m | `dsc-hub-z2m`, `restart: unless-stopped`, no watchdog | Crash loop ~25s; never reaches MQTT |
| Mosquitto | Internal, anonymous, persist on | Up 51m; **only Brain** connected |
| Ingest | `brain/dsc_brain/zigbee_mqtt.py` started in API lifespan | Connected; idle — no retained devices |
| Placements | `settings.zigbee_placements` JSON **or** inventory `extra.zigbee_friendly_name` + `extra.placement` | Neither set |
| Inventory | `PATCH /settings/inventory/{seat_id}` update-only (`404` on unknown seat) | 10 ESPHome seats; extras `{}` |
| SPA add | Settings “Permit join (2 min)” / “Stop join” + empty-state copy | No rename, function, placement, refresh, or coordinator health |

z2m frontend is off on purpose (`docker-compose.yml`: “brain Settings drives permit-join”). That only works if Settings is a real pairing console. It is not.

---

## 2. How the code path is supposed to work

### Discover

1. z2m publishes retained `zigbee2mqtt/bridge/devices`.
2. Ingest `_update_devices` stores ieee / friendly_name / type / model / vendor.
3. `GET /settings/zigbee/devices` returns `{devices: get_zigbee_devices()}`.
4. Settings table filters out `type === "Coordinator"` and shows the rest.

There is **no** `bridge/request/device/rename`, no interview events on the SPA, no create-inventory API. A newly joined sensor never becomes a seat.

### State ingest

- Subscribe `zigbee2mqtt/+` (one topic level) + `bridge/devices`.
- Non-bridge payloads keyed by friendly_name → `system.zigbee_device_states`.
- Placement lookup → `system.zigbee_by_placement[placement]`.
- Any `temperature` / `humidity` **also** writes a single `fleet.canopy` blob (first sensor wins, then any placement starting with `canopy` overwrites).
- `fleet_state.to_hass_states` maps canopy → `sensor.dsc_canopy_temperature` / `sensor.dsc_canopy_humidity`.
- ESPHome ingest **preserves** `state.canopy` across polls (`esphome_client.py`) so Zigbee canopy is not wiped — if it ever arrived.

### Placements

`_placement_map()`:

1. `get_setting("zigbee_placements")` — JSON object friendly_name → label. No Settings field. Key absent live.
2. Inventory extras: `zigbee_friendly_name` or `friendly_name` + `placement`. Device assignment UI writes `function` / `placement` / `capability_max_pct` on the **existing 10 seats only**, and never writes `zigbee_friendly_name`.

So a grower cannot attach “temp/humidity in fan intake” to a Zigbee sensor from the UI, even if one existed.

### Permit-join (honesty)

| Claim | Code | z2m 2.13 truth |
|-------|------|----------------|
| Button “Permit join (2 min)” | `POST` `{enabled: true}`; `PermitJoinBody.duration_s` default 120 **never forwarded** | Official payload is `{"time": 254}` on `zigbee2mqtt/bridge/request/permit_join` |
| Publish | `{"permit_join": enabled}` | Invalid for z2m 2.x (`error: Invalid payload`) |
| Auto-expire | None. Sqlite `zigbee_permit_join` sticks until Stop | z2m closes the window after `time` seconds **if** the request is valid |
| Status | No GET. UI has no chip | `bridge/response/permit_join` unread |
| Silent no-op | `set_permit_join` returns if MQTT client is missing | Brain *is* on MQTT; z2m is not |

This pass did **not** enable join. The leftover sqlite flag (`true` from an earlier click / 7.1.1 “PASS”) was set to `false` so the network is not advertised as open. z2m was down, so the MQTT publish was a no-op.

---

## 3. Live device table (names only)

| Name | Type | Source | Notes |
|------|------|--------|-------|
| *(none)* | — | `GET /settings/zigbee/devices` → `{"devices":[]}` | Ingest never received `bridge/devices` |
| SkyConnect v1.0 | Coordinator hardware | `lsusb` / `serial/by-id` | Present. Not a paired end device. |
| — | — | `/var/lib/dsc-hub/z2m/database.db` | **0 bytes** — network never formed |
| — | — | `/fleet.canopy` | `{}` |
| — | — | `/fleet.system` | keys `appliance_link`, `relays` only — no `zigbee_*` |

Inventory extras (all empty): control, dehumidifier, heater, heatmat, hub, humidifier, pot1–4.

Containers at audit (sudo docker):

| Name | Status | Image |
|------|--------|-------|
| dsc-hub-brain | Up ~20 min | `dsc-hub-brain:7.0.0` |
| dsc-hub-z2m | Up ~20s, RestartCount=98 | `koenkk/zigbee2mqtt:2` (2.13.0) |
| dsc-hub-mosquitto | Up ~51 min | `eclipse-mosquitto:2` |
| dsc-hub-esphome | Up ~51 min (healthy) | `esphome/esphome:2025.12.4` |
| dsc-hub-cannalib | Up ~51 min | `dsc-hub-cannalib:7.0.0` |

z2m log (repeating): serial open → five ASH resets → `Failed to start EZSP layer with status=HOST_FATAL_ERROR` → exit → compose restart.

**Leading hypothesis (not proven; not tested live):** `adapter: ember` against factory/older SkyConnect EZSP firmware. Ember is correct only after EmberZNet 7.4+ on the stick. Do not flip the adapter or reset the stick from this audit.

Compose mount smell: repo `configuration.yaml` bind **and** `/var/lib/dsc-hub/z2m` → `/app/data`. Volume `configuration.yaml` is **0 bytes**; live z2m is reading/writing the repo file (`version: 5` already migrated). Data dir holds empty `database.db` / `state.json: {}`.

---

## 4. Operator UI — can they add / name / place / see it?

Walked live Settings at `http://192.168.86.48:8787/#/fleet/settings` (tab `#/fleet/settings`).

| Job | Can they? | Evidence |
|-----|-----------|----------|
| Know the stick is dead | **No** | Copy: “No Zigbee devices reported yet — enable permit join, then refresh.” Looks like an empty network, not a crash-loop coordinator. No Refresh control on the card (page load only). |
| Add a device | **No** | Permit join is the only lever. Radio down; payload wrong even if radio up; no 2-minute timer. |
| Name it | **No** | Table is display-only. No `bridge/request/device/rename`. |
| Set function / placement (e.g. intake T/RH) | **No** | Assignment table is the 10 ESPHome seats. Placeholders tease `intake_temp` / `4x8 intake duct` but those extras are write-only for fans/lights and are not Zigbee seats. |
| See it on Overview | **No** | Overview binds hub `tent` / `clone` / `room` entities only. Never `sensor.dsc_canopy_*`. |
| See it on Climate | **No** | Same hub entities. No extra-sensor row. |

Climate stays on the hub’s onboard T/RH/VPD. Zigbee was explicitly labeled “separate from climate control” — that copy is honest about *intent* and dishonest about *capability* (you cannot add the extras either).

---

## 5. Gaps vs 7.1 MUST

| MUST | 7.1 claim | Live |
|------|-----------|------|
| **Zigbee devices can be added** | CHANGELOG 7.1.0 “Zigbee device list + permit join”; LIVE-ACCEPTANCE #8 **PASS** (“empty until paired”) | **FAIL.** Radio never up. Pairing API would still be wrong. Empty list was treated as success. |
| **Additional devices with user-defined function / placement / settings** | CHANGELOG 7.1.0 “function/placement/capability assignment”; 7.1.1 “per-device MQTT state + placement map” | **FAIL.** Assignment is existing-seat metadata with no consumers for Zigbee. No create-seat. No placement UI. Ingest placement map is unused because nothing publishes. |

Sibling Settings audit already flagged the empty card and leftover `permit_join=true`. This audit adds: z2m is not merely empty — it is **crash-looping**, the join MQTT schema is **invalid for 2.x**, and Overview/Climate would not show a working extra sensor anyway.

---

## 6. Defects

### P0

| ID | Defect |
|----|--------|
| **ZB-P0-1** | `dsc-hub-z2m` crash-loops (`HOST_FATAL_ERROR`). SkyConnect present; EZSP never starts. RestartCount 98. Empty `database.db`. Coordinator is not a product. |
| **ZB-P0-2** | MUST “Zigbee devices can be added” is false. Settings copy + 7.1.1 acceptance #8 treat `[]` as “not yet paired.” |
| **ZB-P0-3** | Permit-join is a lie: wrong MQTT payload for z2m 2.13, `duration_s` ignored, sqlite flag never auto-expires (was stuck `true`). Frontend disabled, so this is the only join door. |

### P1

| ID | Defect |
|----|--------|
| **ZB-P1-1** | No way to create an extra device seat. `upsert_inventory` 404s unknown ids. Function/placement/settings MUST cannot be met. |
| **ZB-P1-2** | No Zigbee rename / function / placement UI. `_placement_map` + `zigbee_placements` have no editor. Assignment table cannot bind a friendly_name. |
| **ZB-P1-3** | Overview + Climate never read canopy or `zigbee_by_placement`. A working intake T/RH sensor would stay invisible on the grow pages. |
| **ZB-P1-4** | No coordinator / z2m health on `/health`, `/fleet`, or Settings. Operator cannot tell stick-down from empty network. |
| **ZB-P1-5** | Dual compose mounts leave a 0-byte volume `configuration.yaml` vs the repo bind z2m actually mutates. Backup of `/var/lib/dsc-hub/z2m` can miss the live config. |

### P2

| ID | Defect |
|----|--------|
| **ZB-P2-1** | Zero unit tests for `zigbee_mqtt.py` (payload, expire, placement, canopy clobber). |
| **ZB-P2-2** | Canopy is a single global; first T/RH wins. Not placement-honest. |
| **ZB-P2-3** | CH340 flash dongle still on the Pi USB bus (not in z2m). Fine today; easy to grab the wrong `/dev/ttyUSB*` if by-id is ever dropped. |
| **ZB-P2-4** | `set_permit_join` is best-effort void; Brain does not subscribe `bridge/response/*`. |

---

## 7. What this pass did / did not do

- Did: `/health`, devices + fleet + settings GET, Settings UI walk, docker logs/inspect, USB census, cleared leftover `zigbee_permit_join` → `false`.
- Did not: enable permit-join, factory-reset the stick, change `adapter:`, deploy, or commit.
- Do not treat LIVE-ACCEPTANCE #8 as proof the radio works.

---

## 8. Suggested next (not this pass)

1. Stop the restart hammer (`restart: on-failure` + cap, or pause the service) before more ASH resets.
2. Confirm SkyConnect firmware vs `ember` / `ezsp` **without** a factory reset; pick the matching adapter.
3. Fix join to `{"time": N}` with a Brain-side timer and a live chip; never persist “open” without z2m ack.
4. Then, and only then: add-device story — rename, create extra seat, function/placement, Overview/Climate row keyed by placement.

---

## Files read (not edited)

`brain/dsc_brain/zigbee_mqtt.py`, `api.py` (permit-join + devices), `settings.py`, `fleet_state.py`, `esphome_client.py` (canopy preserve), `backup_ops.py` (z2m zip), `services/dsc-hub/docker-compose.yml`, `zigbee2mqtt/configuration.yaml`, `mosquitto/mosquitto.conf`, `SettingsPage.tsx`, `fleetApi.ts`, `OverviewPage.tsx`, `ClimatePage.tsx`, `docs/ops/DSC-HUB-DOCKER.md`, `CHANGELOG.md`, `docs/qa/LIVE-ACCEPTANCE-7.1.md`, `docs/qa/SETTINGS-AUDIT-7.1.md`.
