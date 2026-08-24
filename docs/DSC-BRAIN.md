# DSC offline brain — architecture memo

**In one line:** Local fleet + Pi brain is the product; a local webserver presents and controls; Home Assistant is a lab scaffold.

Notion (canonical Wiki): [Product layers](https://app.notion.com/p/3b52b4cda37081c2bcafc85d3407556c) · [Pi offline brain](https://app.notion.com/p/3b52b4cda370818e8b66f671689f7a57)

**Ops SoT (7.0 tip):** [`docs/qa/PI-APPLIANCE-7.0.md`](qa/PI-APPLIANCE-7.0.md) — LAN map, AP PSK alignment, public API, appliance driver, pitfalls.

## Layers

| Layer | Owns | Does not own |
|---|---|---|
| **Hub** | Ladder, failsafes, PWM, ESP-NOW mesh (parked on Pi path) | Catalogs, long history, composition UI |
| **Pi brain** | Catalogs, Want/Need, roster, Learning, setpoint proposals, appliance driver | Hard safety if Pi unplugged |
| **Webserver** | Presentation, advanced control, update UX | Catalog SoT / Want math |
| **DSC-CONTROL** | Field glass (Native API on Pi path) | Seed catalogues |
| **HA (optional)** | Lab prototypes, soak, Companion notify | Long-term product SoT |

**Authority:** Pi decides and proposes; hub refuses or clamps. On Pi 7.0, Sonoffs are driven by `appliance_driver` (hub demand → Native API `main_relay`), not ETH01.

## Repo map

| Path | Role |
|---|---|
| [`brain/`](../brain/) | Pi brain package (catalog store, Want, decision loop, API, appliance driver) |
| [`services/dsc-hub/`](../services/dsc-hub/) | Docker Compose + `pi-bootstrap.sh` / `fix-ap-psk.sh` |
| [`docs/qa/PI-APPLIANCE-7.0.md`](qa/PI-APPLIANCE-7.0.md) | Pi appliance ops runbook |
| [`SETUP.md`](../SETUP.md) | SoftAP kit unbox (no-Pi product path) |
| [`INSTALL.md`](../INSTALL.md) | HA lab bring-up (scaffold) |
| [`docs/HA-SCAFFOLD.md`](HA-SCAFFOLD.md) | Promote-don't-deepen rules |
| [`docs/brain/`](brain/) | Specs: decision loop, web UI, appliance bridge history |

## Phases

- **A** Architecture + Notion docs
- **B** Brain core
- **C** Webserver MVP
- **D** Close loop + Pi appliance driver (tip `c4eb97f` / AP PSK fix `8867b33`); HA optional integration
