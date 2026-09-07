# DSC-HUB Tuya local lane — SmartLife Wi-Fi devices as kit devices without the cloud

> Drafted 2026-09-07 on `feat/dashboard-v2`. Nothing in this document is implemented.
> Companion to [`plan-settings-2026-09-07.md`](./plan-settings-2026-09-07.md) (Devices › sub-tabs, pass S5) and the Zigbee add → role/zone/task → integrate path already live in `brain/dsc_brain/zigbee_mqtt.py`.
> Operator direction: SmartLife/Tuya devices should work with DSC-HUB **as devices, locally**. Route chosen 2026-09-07: **local Tuya protocol (tinytuya)**, not reflash, not a cloud bridge.

## Status

- **2026-09-07 — drafted.** Repo swept for the Zigbee lane (ingest, bindings, catalog, policies, automation action, SPA bind row), the appliance driver, the compose network shape and the settings KV. Tracker rows logged (see [Tracker rows](#tracker-rows)).
- Next: operator confirms the device list (see [What the operator has to tell us](#what-the-operator-has-to-tell-us)), then Pass T1.

## TL;DR

Tuya devices come in two families. **Tuya Zigbee** devices already work: zigbee2mqtt has converters for them and a Tuya `ZY-ZTH02` has been bound to the canopy role since 2026-08-30. **Tuya Wi-Fi** devices (the usual SmartLife plugs, bulbs, IR blasters, Wi-Fi hygrometers) only talk to the Tuya cloud out of the box and have no lane in DSC-HUB.

The plan adds a **second local device lane** beside Zigbee, speaking Tuya's LAN protocol directly from the brain over TCP 6668 with the `tinytuya` library. Once each device's local key is known, the lane is fully local: no Tuya account, no internet, no bridge container. The lane reuses everything the Zigbee track already built, so a Tuya plug is added, bound to a role/zone/task, reported honestly, and driven by a rule through the same surfaces a Zigbee plug uses. Device types are introduced one at a time; **smart plug / relay** first.

Two things the operator should know before choosing this route over reflashing:

1. **The local key comes from Tuya once.** It is only obtainable through a free Tuya IoT Platform developer account linked to the SmartLife app, using the `tinytuya wizard` on a PC. The brain never talks to that account; the operator pastes the wizard's `devices.json` into Settings. Re-pairing a device in SmartLife rotates its key.
2. **A Tuya plug has no hub failsafe.** The heater / humidifier / dehumidifier / heat-mat path runs on hub demand → Sonoff with a 45 s stale cut-out. A Tuya plug keeps its last state when the brain dies. The lane therefore serves the **auxiliary `plug_*` roles** (pump, dosing, backup dehum, aux fan) and sensor roles; it does not replace the appliance path.

---

## What the operator has to tell us

The pass cannot be sized until this is known:

| Question | Why it matters |
|---|---|
| Which devices, by SmartLife name and product type (plug · bulb · hygrometer · IR blaster · power strip · other) | Decides which device-type archetype ships in T1 and which wait. Plugs and relays are T1; multi-gang strips need per-DPS channels; bulbs and IR blasters are out of scope until asked. |
| Does the SmartLife app list each as **Wi-Fi** or as a device under a **Tuya Zigbee hub**? | Zigbee ones move to the Pi's coordinator today with no code. |
| Is a free Tuya IoT Platform sign-up acceptable for the one-time key pull? | If not, the only local route is reflashing (ESPHome for ESP-based units, OpenBeken via cloudcutter for BK7231 units). |
| Can the router give each device a DHCP reservation and, ideally, block its WAN access? | The brain container is on a bridge network and cannot hear Tuya's UDP discovery broadcasts, so the IP must be stable. WAN blocking is what makes "local" mean local. |

---

## Part 1 — How the Tuya LAN protocol fits the brain

**Protocol.** Every Tuya Wi-Fi device runs a LAN server on TCP 6668 and broadcasts its presence on UDP 6666/6667 every few seconds. Payloads are AES-encrypted with a per-device **local key** (protocol 3.1 / 3.3 / 3.4 / 3.5). State is a map of numbered **DPS** (data points): a plug is typically `1` switch, `9` countdown, `17` energy add, `18` current mA, `19` power W×10, `20` voltage V×10. `tinytuya` (pure Python, MIT, maintained) implements all versions, `status()` polling, `set_value()` writes, a persistent socket with heartbeat for pushed updates, and the wizard that pulls keys.

**Container network.** The brain runs on the compose bridge network `dsc` (`services/dsc-hub/docker-compose.yml`). Outbound TCP to LAN devices works through NAT. UDP broadcast discovery does **not** reach the container. Consequences:

- Devices are registered with an explicit IP (from the wizard's `devices.json` or typed). Operator guidance: DHCP reservation per device.
- No auto-discovery in T1. A later pass may add a tiny host-network discovery helper (`tinytuya.deviceScan()` in a `network_mode: host` sidecar publishing to `dsc/tuya/discovered` on the existing Mosquitto). Not needed to ship.

**Single-socket firmware.** Tuya firmware since ~3.3 accepts one local client at a time. While the brain holds the socket, the SmartLife app falls back to cloud for that device (or fails if WAN is blocked). This is the intended end state; the UI says so on the device row.

**Where it does not fit.** `zigbee_mqtt.py` is keyed on zigbee2mqtt topics and IEEE addresses and its ingest is MQTT-driven. Tuya has no bridge topic and no IEEE. The lane is a **sibling module**, not a branch inside the Zigbee ingest, but it feeds the same `by_role` model so the fleet and the SPA see one set of bound roles.

---

## Part 2 — Design

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
    "scales": {"power": 0.1, "voltage": 0.1, "current": 0.001},
    "enabled": true,
    "added_at": 1757222400
  }
}
```

- `type` names a **Tuya device-type archetype** in a new `tuya_catalog.py`, the mirror of `zigbee_catalog.py`: `capability_class`, datapoints with units, `can_actuate`, suggested roles, and the **default DPS map + scales** for that archetype. `dps_map` on the device is the operator-editable override for units the catalog does not know yet (shown under "Advanced").
- `local_key` is stored like the seat API keys and masked with a `set` indicator in the SPA (the `ap_psk` pattern from the settings plan). `GET` routes never echo it.

`tuya_device_bindings` (JSON, keyed by device id) uses **exactly the Zigbee binding shape**: `role`, `zone`, `alias`, `enabled`, `capability_override`. Same validators (`_valid_roles`, `_VALID_ZONES`, `_CLASS_ROLE_KINDS`) lifted into a small shared `device_bindings.py` so both lanes call one implementation. `tuya_device_policies` likewise reuses the recipe catalog and `evaluate_device_policies` (which already accepts an opaque address; the Tuya device id is that address).

### 2.2 The lane: `brain/dsc_brain/tuya_local.py`

Mirrors the `ZigbeeMqttIngest` shape and the appliance driver's thread discipline:

- **One worker thread per enabled device** (`tinytuya.Device` with `set_socketPersistent(True)`, `receive()` loop, heartbeat every 9 s, reconnect with backoff 5 → 60 s). Persistent sockets give pushed state on physical button presses instead of 5 s polling lag. Fallback to `status()` polling every 5 s for protocol 3.1 units.
- **Normalise DPS → datapoint row** through the device's `dps_map` and `scales`: `{"friendly_name": name, "updated_at": now, "role", "zone", "state": bool, "power": W, "energy": kWh, …}`. Temperature/humidity rows pass through `apply_temp_rh_offsets` with the zone → space mapping exactly as the Zigbee ingest does.
- **Feed the shared role model.** `_by_role[role]` and `_device_states[name]` live in the lane; `apply_tuya_cache_to_state()` stamps `tuya_device_states`, `tuya_by_role`, `tuya_device_bindings`, `tuya_health` onto `FleetState.system`, and the canopy recompute reads climate rows from **both** lanes. Role conflicts (`_role_conflict_map`) span lanes: one role, one device, regardless of radio.
- **Honesty.** A row is `LIVE` when `updated_at` is within 30 s, `STALE` after that, `OFFLINE` when the socket has been down for 60 s. A write is `PENDING` until the device's DPS echo confirms it (`receive()` after `set_value()`), then `SYNCED`; a `DIFFERS` state when the echo disagrees (someone toggled it in the app). Same vocabulary as hub tunables.
- **Actuation.** `set_tuya_state(device_id, on)` → `set_value(dps_map["state"], on)`, best-effort status dict, never raises (the `set_zigbee_state` contract).
- **Demo mode.** Honest empty state in T1 (no fake Tuya devices); the demo simulator gains one plug only when a dashboard surface needs it.

### 2.3 Automation and policies

- `VALID_ACTIONS` gains `tuya_switch` with `params.device_id` and `on_when_firing`; execution and clear mirror the `zigbee_switch` branches in `automation_rules.py`.
- `GET /settings/devices/actuatable` returns a **lane-tagged** list (`{"lane": "zigbee"|"tuya", "id", "friendly_name", "alias", "role"}`); the existing `/settings/zigbee/actuatable` stays for compatibility. The SPA rule editor shows one "Switch a plug" picker and writes whichever action type the chosen lane needs.
- `RELAY_TARGETS` is untouched: Tuya plugs are not relays in the appliance sense.
- Policies (`recipe_id`, `problem_when`, `oos_seat`, banners) work unchanged because the evaluator only needs an address, a friendly name and a payload.

### 2.4 History and energy

Tuya plugs with power metering report `power` and `energy`; the lane records them through `record_history_throttled` under `sensor.tuya_<id>_power` / `_energy` so Logs trends and the space energy model can use them. Space energy attribution stays operator-explicit (bind the plug to a zone), never inferred.

### 2.5 API routes

| Route | Purpose |
|---|---|
| `GET /settings/tuya/devices` | Registered devices with live state, health, masked key. |
| `POST /settings/tuya/devices/import` | Body is the `tinytuya` wizard `devices.json` (list of `{id, name, key, ip?, version?, mac?}`); upserts, never overwrites a role binding, reports which entries lack an IP. |
| `PUT /settings/tuya/devices/{id}` | Edit name / ip / version / type / dps_map / enabled; rotate key. |
| `DELETE /settings/tuya/devices/{id}` | Removes device, binding and policy; refuses while a rule references it (returns the rule names). |
| `POST /settings/tuya/devices/{id}/probe` | One-shot `status()` for the add flow: proves ip + key + version before the operator binds anything; returns raw DPS so an unknown unit can be mapped. |
| `GET/PUT /settings/tuya/bindings` | Same body as the Zigbee bindings routes. |
| `GET/PUT /settings/tuya/policies` | Same body as the Zigbee policies routes. |
| `POST /settings/tuya/devices/{id}/set` | Manual toggle from the device row; journaled. |
| `GET /settings/tuya/device-types` | The archetype catalog. |

All under the existing brain API key and the demo-mode write refusal.

### 2.6 Settings surface

Lives under **The kit › Devices** as a sub-tab beside Zigbee (S5 restructure) — **Tuya (local)**. Until S5 lands it is a card on `DevicesSettingsPage.tsx` below the Zigbee card.

Add flow (a drawer, three steps, each stating What → Process → Expected per the calibration-surface rule):

1. **Get the keys** — explains the one-time wizard on a PC (`pip install tinytuya`, `python -m tinytuya wizard`), what it produces, and that the brain never contacts Tuya. Textarea or file drop for `devices.json`.
2. **Reach the device** — table of imported entries: name, id, ip (editable), version, **Probe** button per row → LIVE with raw DPS, or the specific failure (no route · wrong key · version mismatch · socket busy). Type select filtered to archetypes whose default DPS map matches what the probe returned.
3. **Bind** — the existing bind row (`ZigbeeBindRow` generalised to `DeviceBindRow` with a lane prop): capability class → role/zone filtered selects → task/recipe → policy params. Identical to Zigbee so the operator learns one flow.

Device row afterwards: name · type chip · `LIVE / STALE / OFFLINE` · state (with `PENDING / DIFFERS`) · power W when metered · role/zone · Toggle · Edit · Remove. A standing note on the card: *"Tuya plugs keep their last state if the brain stops. Use them for pumps, dosing and aux fans; the heater, humidifier, dehumidifier and heat mat stay on the hub-driven relays."*

### 2.7 Security and privacy

- Local keys never leave the Pi; masked in every GET; excluded from setup-profile export (S4) by default with an explicit include toggle.
- No outbound call from the brain to Tuya; `tinytuya`'s cloud module is not imported.
- Operator guidance page (Help) on blocking the devices' WAN access at the router, with the note that the SmartLife app then stops working for those devices, which is the point.

---

## Part 3 — Device types, one at a time

| Order | Archetype | DPS default | Roles | Pass |
|---|---|---|---|---|
| 1 | `smart_plug` (single gang, optional metering) | `1` state · `17/18/19/20` energy/current/power/voltage | `plug_pump`, `plug_dosing`, `plug_backup_dehum`, `plug_fan_aux` | T1 |
| 2 | `smart_switch` (relay/in-wall, no metering) | `1` state | `plug_fan_aux`, `plug_pump` | T1 |
| 3 | `thermo_hygrometer` (Wi-Fi T/RH) | `1` temp×0.1 · `2` humidity | canopy/room climate roles | T2 |
| 4 | `power_strip` (multi-gang) | `1..N` per channel, each channel bound separately | `plug_*` | T2 |
| 5 | `power_meter` | `101…` vendor-specific, operator DPS map | `meter_wall` | when asked |
| — | bulbs, IR blasters, curtains | — | — | not planned |

---

## Part 4 — Passes

Both tents at the same point per pass; verify with `cd brain && python -m pytest -q`, `cd frontend && npx tsc --noEmit && npm run build`, and the Pi hotpatch; close with a FOLLOWUPS write-up.

| Pass | Scope | Acceptance |
|---|---|---|
| **T1 — Plug lane, end to end** | `tinytuya` in `requirements.txt`; `tuya_catalog.py` (plug + switch); `tuya_local.py` worker threads, normalisation, honesty states, `set_tuya_state`; shared `device_bindings.py` extracted from the Zigbee module (Zigbee behaviour unchanged, its tests still green); `apply_tuya_cache_to_state` + cross-lane canopy/role conflict; routes in 2.5; `tuya_switch` action + lane-tagged actuatable list; SPA card with the three-step drawer, `DeviceBindRow`, device rows, rule-editor picker; `brain/tests/test_tuya_local.py` against a fake `tinytuya.Device` (no network). | A real SmartLife plug imported from `devices.json`, probed, bound to `plug_pump` in `4x8`, shows `LIVE` with W on the Devices card and on the zone's plug chip; a rule toggles it and the row goes `PENDING → SYNCED` within one echo; toggling it in the SmartLife app shows `DIFFERS` then re-syncs on the next rule tick; pulling the plug's power shows `OFFLINE` within 60 s with no fake state; deleting it while a rule references it is refused with the rule name; Zigbee tests unchanged. |
| **T2 — Sensors, strips, energy** | `thermo_hygrometer` and `power_strip` archetypes; per-channel bindings; canopy from a Wi-Fi hygrometer with the same offsets as Zigbee; `power`/`energy` into history and the space energy model; Help page for WAN blocking and the wizard. | A Wi-Fi hygrometer bound to a canopy role drives the same canopy chip a Zigbee one does; a two-gang strip binds each gang to its own role; Logs trends show plug W and kWh; energy attribution appears on the zone only when bound. |
| **T3 — Discovery and resilience** | Host-network discovery helper publishing to MQTT; "Found on the LAN, not registered" list on the card; key-rotation detection (persistent decrypt failure → `KEY CHANGED` state with the re-import hint); socket-busy detection with the "close the SmartLife app" hint. | A new plug on the LAN appears in the found list within 30 s with its id and ip; re-pairing a plug in SmartLife shows `KEY CHANGED` instead of `OFFLINE`. |

Order: T1 → T2 → T3. T1 waits on the operator's device list only to pick the first archetype's DPS defaults; the code path is the same for any plug.

---

## Alternatives considered

| Route | Why not (as the primary lane) |
|---|---|
| Reflash to ESPHome | Highest fit (native-API seat, same as every other node) but most SmartLife hardware since 2021 is Beken BK7231, not ESP; OpenBeken via cloudcutter is per-SKU effort and off the ESPHome toolchain. Stays the documented recommendation for ESP-based units. |
| Tuya cloud API | Not local; defeats the product's Pi-only path. Never. |
| tinytuya → MQTT bridge container | Same keys, one more process, and a topic dialect the brain would have to invent; the lane in-process reuses the appliance driver's thread pattern instead. |
| Home Assistant `localtuya` | HA lab retired 2026-09; do not revive. |

## Tracker rows

Logged to the Notion tracker on 2026-09-07 (Area "Zigbee / Automation"):

1. Tuya local lane: SmartLife Wi-Fi devices as kit devices over the LAN protocol (this document) — Suggested Feature, High, anchor row.
2. Automation switch targets and the bind row are Zigbee-specific; generalise to lane-tagged devices (`DeviceBindRow`, `/settings/devices/actuatable`, shared `device_bindings.py`) — Suggested Change, Medium.
3. Brain container on the bridge network cannot hear LAN UDP discovery (Tuya, and any future mDNS-less device); needs a host-network discovery helper — Workflow Issue, Low.
