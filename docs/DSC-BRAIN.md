# DSC offline brain — architecture memo

**In one line:** Local fleet + Pi brain is the product; a local webserver presents and controls; Home Assistant is a lab scaffold.

Notion (canonical Wiki): [Product layers](https://app.notion.com/p/3b52b4cda37081c2bcafc85d3407556c) · [Pi offline brain](https://app.notion.com/p/3b52b4cda370818e8b66f671689f7a57)

**Ops SoT (7.0 tip):** [`docs/qa/PI-APPLIANCE-7.0.md`](qa/PI-APPLIANCE-7.0.md) — LAN map, AP PSK, **noise_psk** Native API, WiFi-pref clear, brain env recreate, **FleetSnapshot SPA**, **`hub.values.controls`** + `/control` (fan/light/select) + `/history`, **Dockerfile.prebuilt** + eth0 bring-up.

## Layers

| Layer | Owns | Does not own |
|---|---|---|
| **Hub** | Ladder, failsafes, PWM, ESP-NOW mesh (parked on Pi path) | Catalogs, long history, composition UI |
| **Pi brain** | Catalogs, Want/Need, roster, Learning, setpoint proposals, appliance driver, FleetState + hub controls | Hard safety if Pi unplugged |
| **Webserver** | Presentation, advanced control, updates (`useFleetEntity` client) | Catalog SoT / Want math |
| **DSC-CONTROL** | Field glass (Native API on Pi path) | Seed catalogues |
| **HA (optional)** | Lab prototypes, soak, Companion notify | Long-term product SoT |

**Authority:** Pi decides and proposes; hub refuses or clamps. On Pi 7.0, Sonoffs are driven by `appliance_driver` (hub demand → Native API `main_relay` via `noise_psk`), not ETH01. SPA writes go through `POST /control/service`. Hub switch/number/fan/light/select **readback** lands in `hub.values.controls` on each ingest poll.

## Repo map

| Path | Role |
|---|---|
| [`brain/`](../brain/) | Pi brain package (catalog store, Want, decision loop, API, appliance driver) |
| [`brain/dsc_brain/fleet_state.py`](../brain/dsc_brain/fleet_state.py) | Live FleetSnapshot SoT for SPA |
| [`brain/dsc_brain/hub_controls.py`](../brain/dsc_brain/hub_controls.py) | Shared entity_id ↔ object_id maps (ingest + control proxy) |
| [`brain/dsc_brain/control_ops.py`](../brain/dsc_brain/control_ops.py) | HA-shaped service proxy → Native API (incl. fan/light/select) |
| [`brain/dsc_brain/history_ops.py`](../brain/dsc_brain/history_ops.py) | Entity → fleet_history chart points |
| [`brain/dsc_brain/native_api.py`](../brain/dsc_brain/native_api.py) | ESPHome 2026+ `APIClient(…, noise_psk=…)` factory |
| [`services/dsc-hub/`](../services/dsc-hub/) | Docker Compose + prebuilt Dockerfile + Pi deploy / eth0 scripts |
| [`docs/qa/PI-APPLIANCE-7.0.md`](qa/PI-APPLIANCE-7.0.md) | Pi appliance ops runbook |
| [`SETUP.md`](../SETUP.md) | SoftAP kit unbox (no-Pi product path) |
| [`INSTALL.md`](../INSTALL.md) | HA lab bring-up (scaffold) |
| [`docs/HA-SCAFFOLD.md`](HA-SCAFFOLD.md) | Promote-don't-deepen rules |
| [`docs/brain/`](brain/) | Specs: decision loop, web UI, appliance bridge history |

## Phases

- **A** Architecture + Notion docs
- **B** Brain core
- **C** Webserver MVP (FleetSnapshot SPA; tip `c1a451a` adds control readback + Climate wiring)
- **D** Close loop + Pi appliance driver (`c4eb97f` / AP PSK `8867b33` / Native API `db85cbc` / FleetSnapshot `47f6622`); HA optional integration
