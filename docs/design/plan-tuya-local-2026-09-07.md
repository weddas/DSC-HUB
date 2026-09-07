# DSC-HUB Tuya local lane — SmartLife Wi-Fi devices as kit devices without the cloud

> Drafted 2026-09-07 on `feat/dashboard-v2`.
> Companion to [`plan-settings-2026-09-07.md`](./plan-settings-2026-09-07.md) (Devices › sub-tabs, pass S5) and the Zigbee add → role/zone/task → integrate path already live in `brain/dsc_brain/zigbee_mqtt.py`.
> Operator direction: SmartLife/Tuya devices should work with DSC-HUB **as devices, locally**. Route chosen 2026-09-07: **local Tuya protocol (tinytuya)**, not reflash, not a cloud bridge.

## Status

- **2026-09-07 — drafted.** Repo swept for the Zigbee lane (ingest, bindings, catalog, policies, automation action, SPA bind row), the appliance driver, the compose network shape and the settings KV. Tracker rows logged (see [Tracker rows](#tracker-rows)).
- **2026-09-07 — operator answers in:** Wi-Fi plugs and a water tester (all Wi-Fi); a Tuya IoT account exists but the setup must explain the key export for others; DHCP reservations / WAN blocking fine if explained. The water tester moved into T1 as its own archetype.
- **2026-09-07 — Pass T1 landed** on `feat/dashboard-v2` (uncommitted, not hotpatched). Evidence: `docs/FOLLOWUPS.md` § Tuya local lane: Pass T1 landed. Operator guide: [`docs/ops/TUYA-LOCAL-SETUP.md`](../ops/TUYA-LOCAL-SETUP.md). Open: real-device gate on the Pi, then T2 → T3.

## TL;DR

Tuya devices come in two families. **Tuya Zigbee** devices already work: zigbee2mqtt has converters for them and a Tuya `ZY-ZTH02` has been bound to the canopy role since 2026-08-30. **Tuya Wi-Fi** devices (the usual SmartLife plugs, bulbs, IR blasters, Wi-Fi hygrometers, water testers) only talk to the Tuya cloud out of the box and had no lane in DSC-HUB.

The plan adds a **second local device lane** beside Zigbee, speaking Tuya's LAN protocol directly from the brain over TCP 6668 with the `tinytuya` library. Once each device's local key is known, the lane is fully local: no Tuya account, no internet, no bridge container. The lane reuses everything the Zigbee track already built, so a Tuya plug is added, bound to a role/zone/task, reported honestly, and driven by a rule through the same surfaces a Zigbee plug uses. Device types are introduced one at a time; **smart plug / relay / water tester** first.

Two things the operator should know before choosing this route over reflashing:

1. **The local key comes from Tuya once.** It is only obtainable through a free Tuya IoT Platform developer account linked to the SmartLife app, using the `tinytuya wizard` on a PC. The brain never talks to that account; the operator pastes the wizard's `devices.json` into Settings. Re-pairing a device in SmartLife rotates its key.
2. **A Tuya plug has no hub failsafe.** The heater / humidifier / dehumidifier / heat-mat path runs on hub demand → Sonoff with a 45 s stale cut-out. A Tuya plug keeps its last state when the brain dies. The lane therefore serves the **auxiliary `plug_*` roles** (pump, dosing, backup dehum, aux fan) and sensor roles; it does not replace the appliance path.

---

## What the operator has to tell us (answered 2026-09-07)

| Question | Answer | Effect |
|---|---|---|
| Which devices, by type | Wi-Fi plugs and a water quality tester | `smart_plug`, `smart_switch` and `water_tester` archetypes in T1 |
| Wi-Fi or Tuya-Zigbee-hub per device | All Wi-Fi | Nothing moves to the Zigbee coordinator |
| Free Tuya IoT sign-up acceptable for the key pull? | Already has one; the setup must cover it for other people | Step 1 of the add drawer and `docs/ops/TUYA-LOCAL-SETUP.md` explain the export end to end |
| DHCP reservations and WAN blocking at the router? | Fine as long as the device setup is well explained | Step 2 of the add drawer states the fixed-IP requirement and why; the guide covers WAN blocking |

---

## Part 1 — How the Tuya LAN protocol fits the brain

**Protocol.** Every Tuya Wi-Fi device runs a LAN server on TCP 6668 and broadcasts its presence on UDP 6666/6667 every few seconds. Payloads are AES-encrypted with a per-device **local key** (protocol 3.1 / 3.3 / 3.4 / 3.5). State is a map of numbered **DPS** (data points): a plug is typically `1` switch, `9` countdown, `17` energy add, `18` current mA, `19` power W×10, `20` voltage V×10. `tinytuya` (pure Python, MIT, maintained) implements all versions, `status()` polling, `set_value()` writes, a persistent socket with heartbeat for pushed updates, and the wizard that pulls keys.

**Container network.** The brain runs on the compose bridge network `dsc` (`services/dsc-hub/docker-compose.yml`). Outbound TCP to LAN devices works through NAT. UDP broadcast discovery does **not** reach the container. Consequences:

- Devices are registered with an explicit IP (from the wizard's `devices.json` or typed). Operator guidance: DHCP reservation per device.
- No auto-discovery in T1. A later pass may add a tiny host-network discovery helper (`tinytuya.deviceScan()` in a `network_mode: host` sidecar publishing to `dsc/tuya/discovered` on the existing Mosquitto). Not needed to ship.

**Single-socket firmware.** Tuya firmware since ~3.3 accepts one local client at a time. While the brain holds the socket, the SmartLife app falls back to cloud for that device (or fails if WAN is blocked). This is the intended end state; the UI says so on the device row.

**Where it does not fit.** `zigbee_mqtt.py` is keyed on zigbee2mqtt topics and IEEE addresses and its ingest is MQTT-driven. Tuya has no bridge topic and no IEEE. The lane is a **sibling module**, not a branch inside the Zigbee ingest, but it feeds the same `by_role` model so the fleet and the SPA see one set of bound roles.

---

## Part 2 — Design (as landed in T1)

### 2.1 Data model (tier S, brain KV)

`tuya_devices` (JSON, keyed by Tuya device id):

```json
{
  "bf1234abcd…": {
    "name": "Tent pump plug",
    "ip": "192.168.1.61",
    "local_key": "…",
    "version": "3.4",
    "type": "smart_plug",
    "dps_map": {"state": 1, "power": 19, "energy": 17, "current": 18, "voltage": 20},
    "scales": {"power": 0.1, "voltage": 0.1, "current": 0.001, "energy": 0.01},
    "enabled": true,
    "added_at": 1757222400
  }
}
```

- `type` names a **Tuya device-type archetype** in `tuya_catalog.py`, the mirror of `zigbee_catalog.py`: `capability_class`, datapoints with units, `can_actuate`, suggested roles, and the **default DPS map + scales** for that archetype. `dps_map` / `scales` on the device are the operator-editable override for units the catalog does not know yet (Edit › Advanced).
- `local_key` is stored like the seat API keys; `GET` routes never echo it (`local_key_set` instead).

`tuya_device_bindings` (JSON, keyed by device id) uses **exactly the Zigbee binding shape**: `role`, `zone`, `alias`, `enabled`, `capability_override`. The validators live in the shared `device_bindings.py`, which both lanes call. Policies (task recipes) live in the shared `zigbee_device_policies` store keyed by device id, so `evaluate_device_policies` serves both lanes unchanged.

### 2.2 The lane: `brain/dsc_brain/tuya_local.py`

- **One worker thread per enabled device** (`tinytuya.Device`, persistent socket, 2 s receive timeout, heartbeat every 9 s, full `status()` every 30 s, reconnect with backoff 5 → 60 s, tinytuya's own retry limit 1). Pushed DPS give state on physical button presses instead of polling lag. Writes are queued to the worker so one socket is ever open per device.
- **Normalise DPS → datapoint row** through the device's `dps_map` and `scales`.
- **Feed the shared role model.** `zigbee_mqtt.register_role_provider` + `stamp_role_buckets` merge Tuya rows into `zigbee_by_role` / `zigbee_by_placement` / canopy at every write point. Role conflicts span lanes: one role, one device, regardless of radio.
- **Honesty.** `link`: `live` (report within 30 s) · `stale` · `offline` (60 s / socket down) · `key_changed` (payload will not decrypt). `write_state`: `pending` → `synced` on the DPS echo, `differs` when the echo disagrees (someone toggled it in the app), `failed`.
- **Actuation.** `set_tuya_state(device_id, on)` best-effort, never raises.
- **Demo mode.** Lane not started; routes refuse writes.

### 2.3 Automation and policies

- `VALID_ACTIONS` gained `tuya_switch` (`params.device_id`, `on_when_firing`); fire and clear mirror `zigbee_switch`.
- `GET /settings/devices/actuatable` returns a **lane-tagged** list (`{"lane": "zigbee"|"tuya", "id", "friendly_name", "alias", "role"}`); `/settings/zigbee/actuatable` stays for compatibility. The rule editor lists **Zigbee switch** and **Tuya plug** as separate actions fed from the one list (a single "Switch a plug" picker is the remaining part of tracker row 2).
- `RELAY_TARGETS` is untouched: Tuya plugs are not relays in the appliance sense.

### 2.4 Entities

Every datapoint of a bound device exports as `sensor./binary_sensor.dsc_tuya_<role>_<key>` (never `dsc_zigbee_` for a Wi-Fi device); the rule engine's age lookup and `AGE_PREFIXES` cover both prefixes. Energy/power history recording is T2.

### 2.5 API routes

| Route | Purpose |
|---|---|
| `GET /settings/tuya/devices` | Registered devices with live state, health, masked key. |
| `POST /settings/tuya/devices/import` | Body is the `tinytuya` wizard `devices.json`; upserts, never overwrites a type / DPS map / binding, reports entries that lack an IP. |
| `PUT /settings/tuya/devices/{id}` | Edit name / ip / version / type / dps_map / scales / enabled; rotate key. |
| `DELETE /settings/tuya/devices/{id}` | Removes device, binding and policy; **409** while a rule references it (returns the rule names). |
| `POST /settings/tuya/devices/{id}/probe`, `POST /settings/tuya/probe` | One-shot `status()` (5 s, one attempt): proves ip + key + version, returns raw DPS + a type guess, or the error code with a hint. A device with a live worker returns its cached DPS instead of opening a second socket. |
| `POST /settings/tuya/devices/{id}/set` | Manual toggle; journaled. |
| `GET/PUT /settings/tuya/bindings` | Same body as the Zigbee bindings routes. |
| `GET /settings/tuya/device-types`, `GET /settings/tuya/health` | Catalog; lane health (also on `/health`). |

### 2.6 Settings surface

`TuyaLocalCard` under **The kit › Devices** (`#tuya`), beside Zigbee until the S5 sub-tab restructure. Add flow is a two-step drawer, each stating What → Process → Expected:

1. **Get the keys** — the Tuya IoT project + app-account link + `tinytuya wizard` explained; paste `devices.json`; Import.
2. **Reach each device** — per imported device: IP, protocol version, **Probe** (raw DPS + type guess, or the specific failure with a hint), type, Save. "Done — bind roles" returns to the table.

Binding happens in the shared bind row (`ZigbeeBindRow`, device id through the `ieee` prop); a honesty sub-row under each device shows link, ON/OFF, write state, datapoints and On / Off / Probe / Edit / Remove. Edit drawer: name, IP, protocol, type, enabled, key rotate, Advanced DPS map + scales. Delete asks first and relays the brain's 409. A standing note: *Tuya plugs keep their last state if the brain stops; use them for pumps, dosing and aux fans.*

### 2.7 Security and privacy

- Local keys never leave the Pi; masked in every GET; to be excluded from setup-profile export (S4) by default.
- No outbound call from the brain to Tuya; `tinytuya`'s cloud module is not imported.
- Operator guide covers blocking the devices' WAN access at the router.

---

## Part 3 — Device types, one at a time

| Order | Archetype | DPS default | Roles | Pass |
|---|---|---|---|---|
| 1 | `smart_plug` (single gang, optional metering) | `1` state · `17/18/19/20` energy/current/power/voltage | `plug_pump`, `plug_dosing`, `plug_backup_dehum`, `plug_fan_aux` | T1 ✓ |
| 2 | `smart_switch` (relay/in-wall, no metering) | `1` state | `plug_fan_aux`, `plug_pump` | T1 ✓ |
| 3 | `water_tester` (Wi-Fi multi-parameter) | `8` temp ×0.1 · `106` pH ×0.01 · `111` TDS · `116` EC · `121` salinity · `126` SG ×0.001 · `131` ORP · `136` CF ×0.1 — common Tuya profile, **verify by Probe** | `reservoir_4x8`, `reservoir_2x4`, `reservoir_room` (kind `water`) | T1 ✓ (defaults unverified on the operator's unit) |
| 4 | `thermo_hygrometer` (Wi-Fi T/RH) | `1` temp×0.1 · `2` humidity | canopy/room climate roles | T2 |
| 5 | `power_strip` (multi-gang) | `1..N` per channel, each channel bound separately | `plug_*` | T2 |
| 6 | `power_meter` | vendor-specific, operator DPS map | `meter_wall` | when asked |
| — | bulbs, IR blasters, curtains | — | — | not planned |

---

## Part 4 — Passes

Both tents at the same point per pass; verify with `cd brain && python -m pytest -q`, `cd frontend && npx tsc --noEmit && npm run build`, and the Pi hotpatch; close with a FOLLOWUPS write-up.

| Pass | Scope | Acceptance |
|---|---|---|
| **T1 — Plug lane, end to end** (landed 2026-09-07) | `tinytuya` in `requirements.txt`; `tuya_catalog.py` (plug + switch + water tester); `tuya_local.py`; shared `device_bindings.py`; role-provider merge into the shared buckets; routes in 2.5; `tuya_switch` action + lane-tagged actuatable list; SPA card with the two-step drawer, shared bind row + honesty line, edit drawer, rule-editor picker; `brain/tests/test_tuya_local.py` against a fake `tinytuya.Device`. | Dev-pane gate passed against a local brain (import → probe hint → type save → BOUND → actuatable → rule action). **Real-device gate on the Pi still open:** a real SmartLife plug imported, probed, bound to `plug_pump`, `LIVE` with W; a rule toggles it `PENDING → SYNCED`; a toggle in the SmartLife app shows `DIFFERS`; pulling its power shows `OFFLINE` within 60 s; the water tester's DPS map confirmed by Probe. |
| **T2 — Sensors, strips, energy** | `thermo_hygrometer` and `power_strip` archetypes; per-channel bindings; canopy from a Wi-Fi hygrometer with the same offsets as Zigbee; `power`/`energy` and the tester's pH/EC into history and the space energy model; Help page for WAN blocking and the wizard. | A Wi-Fi hygrometer bound to a canopy role drives the same canopy chip a Zigbee one does; a two-gang strip binds each gang to its own role; Logs trends show plug W, kWh and reservoir pH/EC; energy attribution appears on the zone only when bound. |
| **T3 — Discovery and resilience** | Host-network discovery helper publishing to MQTT; "Found on the LAN, not registered" list on the card; socket-busy detection with the "close the SmartLife app" hint. | A new plug on the LAN appears in the found list within 30 s with its id and ip. |

Order: T1 → real-device gate → T2 → T3.

---

## Alternatives considered

| Route | Why not (as the primary lane) |
|---|---|
| Reflash to ESPHome | Highest fit (native-API seat, same as every other node) but most SmartLife hardware since 2021 is Beken BK7231, not ESP; OpenBeken via cloudcutter is per-SKU effort and off the ESPHome toolchain. Stays the documented recommendation for ESP-based units. |
| Tuya cloud API | Not local; defeats the product's Pi-only path. Never. |
| tinytuya → MQTT bridge container | Same keys, one more process, and a topic dialect the brain would have to invent; the lane in-process reuses the appliance driver's thread pattern instead. |
| Home Assistant `localtuya` | HA lab retired 2026-09; do not revive. |

## Tracker rows

Logged to the Notion tracker on 2026-09-07 (Area "Zigbee / Automation" unless noted):

1. Tuya local lane: SmartLife Wi-Fi devices as kit devices over the LAN protocol (this document) — Suggested Feature, High, anchor row. *Needs Verification* since T1 landed.
2. Automation switch targets and the bind row are Zigbee-specific; generalise to lane-tagged devices — Suggested Change, Medium. *Needs Verification*: shared `device_bindings.py` + lane-tagged actuatable list done; `DeviceBindRow` rename and the single plug picker remain.
3. Brain container on the bridge network cannot hear LAN UDP discovery; needs a host-network discovery helper — Workflow Issue, Low (Area "Architecture"). Open for T3.
