# DSC offline brain — architecture memo

**In one line:** Local fleet + Pi brain is the product; a local webserver presents and controls; Home Assistant is a lab scaffold.

Notion (canonical Wiki): [Product layers](https://app.notion.com/p/3b52b4cda37081c2bcafc85d3407556c) · [Pi offline brain](https://app.notion.com/p/3b52b4cda370818e8b66f671689f7a57)

**Ops SoT (7.0 tip `f10ad40`):** [`docs/qa/PI-APPLIANCE-7.0.md`](qa/PI-APPLIANCE-7.0.md) — LAN map, AP PSK, **noise_psk**, WiFi-pref clear, brain env recreate, **FleetSnapshot SPA**, **Phase E** `/fleet` vs `/fleet/computed`, **ESPHome 2026 dual-slug ingest**, **`hub.values.controls`** + room/clone + Pi VPD + binaries, native Compose helpers/scripts, `/control/service` + `/control/demand` + `/history` + `/grow-log`, **`useEntityBus`**, **Dockerfile.prebuilt** + eth0 + **verify-brain** / **brain-ci**, **fleet flash / island-proof / soak** scripts. Live audit: [`docs/AUDIT-2026-08-26.md`](AUDIT-2026-08-26.md) · Soak: [`docs/ops/SOAK-2026-08-26.md`](ops/SOAK-2026-08-26.md).

## Layers

| Layer | Owns | Does not own |
|---|---|---|
| **Hub** | Ladder, failsafes, PWM, ESP-NOW mesh (parked on Pi path) | Catalogs, long history, composition UI |
| **Pi brain** | Catalogs, Want/Need, roster, Learning, setpoint proposals, appliance driver, FleetState + hub controls/sensors/binaries/text, compose helpers, computed extras, grow log, ingest audit gates | Hard safety if Pi unplugged |
| **Webserver** | Presentation, advanced control, Dash Home / FleetState UI, updates (`useEntityBus` / `useFleetEntity` client) | Catalog SoT / Want math |
| **DSC-CONTROL** | Field glass (Native API on Pi path) | Seed catalogues |
| **HA (optional)** | Lab prototypes, soak, Companion notify | Long-term product SoT |

**Authority:** Pi decides and proposes; hub refuses or clamps. On Pi 7.0, Sonoffs are driven by `appliance_driver` (hub demand → Native API `main_relay` via `noise_psk`), not ETH01. SPA writes go through `POST /control/service` (or `/control/demand`). Hub switch/number/fan/light/select **readback** lands in `hub.values.controls`; room/clone vitals, fire/cooldown sensors, and window/light-catchup/safety binaries land in `hub.values` / `hub.values.binaries` on each ingest poll. Unmapped ESPHome object_ids are silent data loss — tip `53ecec7` dual-maps critical slugs and CI-guards them.

## Repo map

| Path | Role |
|---|---|
| [`brain/`](../brain/) | Pi brain package (catalog store, Want, decision loop, API, appliance driver) |
| [`brain/dsc_brain/fleet_state.py`](../brain/dsc_brain/fleet_state.py) | Live FleetSnapshot SoT for SPA |
| [`brain/dsc_brain/hub_controls.py`](../brain/dsc_brain/hub_controls.py) | Shared entity_id ↔ object_id maps (legacy C++ id + ESPHome 2026 name-slug) |
| [`brain/scripts/audit_hub_ingest.py`](../brain/scripts/audit_hub_ingest.py) | Live hub OID vs map audit (`--critical-only`) |
| [`brain/dsc_brain/climate_math.py`](../brain/dsc_brain/climate_math.py) | Pi-side tent/clone VPD from T/RH |
| [`brain/dsc_brain/compose_store.py`](../brain/dsc_brain/compose_store.py) / [`compose_ops.py`](../brain/dsc_brain/compose_ops.py) | Pi-native HA helpers + Build-a-Plant / cal scripts |
| [`brain/dsc_brain/computed_ops.py`](../brain/dsc_brain/computed_ops.py) / [`dash_computed.py`](../brain/dsc_brain/dash_computed.py) | `hass_extras` for SPA (CFM, roster, runtime, dash flags, cooldowns) |
| [`brain/dsc_brain/event_log.py`](../brain/dsc_brain/event_log.py) | Grow log SoT (`GET /grow-log`) |
| [`brain/dsc_brain/control_ops.py`](../brain/dsc_brain/control_ops.py) | HA-shaped service proxy → Native API + helpers/scripts |
| [`brain/dsc_brain/history_ops.py`](../brain/dsc_brain/history_ops.py) | Entity → fleet_history chart points (incl. room/clone) |
| [`brain/dsc_brain/native_api.py`](../brain/dsc_brain/native_api.py) | ESPHome 2026+ `APIClient(…, noise_psk=…)` factory |
| [`services/dsc-hub/`](../services/dsc-hub/) | Docker Compose + prebuilt Dockerfile + Pi deploy / eth0 / verify scripts |
| [`docs/qa/PI-APPLIANCE-7.0.md`](qa/PI-APPLIANCE-7.0.md) | Pi appliance ops runbook |
| [`docs/AUDIT-2026-08-26.md`](AUDIT-2026-08-26.md) | Phase 1 live ingest / FleetState deploy audit |
| [`SETUP.md`](../SETUP.md) | SoftAP kit unbox (no-Pi product path) |
| [`INSTALL.md`](../INSTALL.md) | HA lab bring-up (scaffold) |
| [`docs/HA-SCAFFOLD.md`](HA-SCAFFOLD.md) | Promote-don't-deepen rules |
| [`docs/brain/`](brain/) | Specs: decision loop, web UI, appliance bridge history |

## Phases

- **A** Architecture + Notion docs
- **B** Brain core
- **C** Webserver MVP (FleetSnapshot SPA; tip `4aa67c5` ops-page native reads; tip `bfd6495` Dash Home + native Compose/Learning; tip `53ecec7` ingest recovery + FleetState deploy gates)
- **D** Close loop + Pi appliance driver (`c4eb97f` / AP PSK `8867b33` / Native API `db85cbc` / FleetSnapshot `47f6622` / hub.controls `c1a451a` / entitybus `4aa67c5` / Dash Home `bfd6495` / ingest recovery `53ecec7`); HA optional integration
