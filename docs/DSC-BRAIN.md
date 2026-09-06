# DSC offline brain — architecture memo

**In one line:** Local fleet + Pi brain is the product; a local webserver presents and controls; Home Assistant is a lab scaffold.

Notion (canonical Wiki): [Product layers](https://app.notion.com/p/3b52b4cda37081c2bcafc85d3407556c)

## Layers

| Layer | Owns | Does not own |
|---|---|---|
| **Hub** | Ladder, failsafes, PWM, ESP-NOW mesh | Catalogs, long history, composition UI |
| **Pi brain** | Catalogs, Want/Need, roster, Learning, setpoint proposals | Hard safety if Pi unplugged |
| **Webserver** | Presentation, advanced control, update UX | Catalog SoT / Want math |
| **DSC-CONTROL** | Field glass over ESP-NOW | Seed catalogues |
| **HA (optional)** | Lab prototypes, soak, Companion notify | Long-term product SoT |

**Authority:** Pi decides and proposes; hub refuses or clamps.

## Repo map

| Path | Role |
|---|---|
| [`brain/`](../brain/) | Pi brain package (catalog store, Want, decision loop, API stub) |
| [`SETUP.md`](../SETUP.md) | SoftAP kit unbox (product path) |
| [`INSTALL.md`](../INSTALL.md) | HA lab bring-up (scaffold) |
| [`docs/HA-SCAFFOLD.md`](HA-SCAFFOLD.md) | Promote-don't-deepen rules |
| [`docs/brain/`](brain/) | Specs: decision loop, web UI, Pi appliance path |

## Phases

- **A** Architecture + Notion docs
- **B** Brain core (this tree starts B)
- **C** Webserver MVP
- **D** Close loop + Pi appliance driver; HA optional integration

## Hub demand proposals are shadow-mode (documented 2026-09-06)

`hub_native.emit_proposal` **logs** the decision loop's demand proposals (`emitted: "logged"`) and does **not** write the hub's `*_demand` switches. Today the hub ladder drives the demand outputs; the brain's real authority is:

- setpoints and modes it writes through `/control/service` (operator-confirmed),
- Zigbee **tasks** (`zigbee_policies`: appliance OOS + banners),
- **automation rules** (Sonoff cut-outs, operator-owned hub switches, ESP-clamped setpoints), and
- the Sonoff **appliance driver**, which mirrors hub demand every 2 s and forces every relay OFF when the hub goes dark (also for out-of-service seats).

Flipping proposals from "logged" to real `*_demand` writes is an explicit product decision (tracker row *hub_native.emit_proposal only logs demand*). Until it is made, no SPA surface may describe the brain as driving demand outputs — the honest wording is "brain proposes, hub applies".
