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
| [`docs/brain/`](brain/) | Specs: decision loop, web UI, Zigbee Role/Task, root steering + IrrigAct |
| [`docs/brain/ZIGBEE-ROLE-TASK.md`](brain/ZIGBEE-ROLE-TASK.md) | Settings Zigbee Role vs Task + liquid polarity |
| [`docs/brain/ROOT-STEERING.md`](brain/ROOT-STEERING.md) | Bar 3 P0–P3 + IrrigAct shot path (tip `bce7ca9`) |
| [`docs/ops/SOFT-CAL.md`](ops/SOFT-CAL.md) | SoftCal Raw offsets + SoftCal AI advice |
| [`docs/ops/TWIN-SF1000.md`](ops/TWIN-SF1000.md) | Twin SF1000 GPIO5 vs clone lamp |
| [`docs/ops/ZIGBEE-RECOVERY.md`](ops/ZIGBEE-RECOVERY.md) | z2m / SkyConnect radio recovery |

## Phases

- **A** Architecture + Notion docs
- **B** Brain core (this tree starts B)
- **C** Webserver MVP
- **D** Close loop + Pi appliance driver; HA optional integration
