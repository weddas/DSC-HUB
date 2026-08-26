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
| [`docs/ops/DSC-HUB-DOCKER.md`](ops/DSC-HUB-DOCKER.md) | Pi cutover / island proof |
| [`docs/ops/SONOFF-FLASH.md`](ops/SONOFF-FLASH.md) | Sonoff LAN/fallback OTA after bridge retirement |
| [`docs/brain/FLEET-INGEST.md`](brain/FLEET-INGEST.md) | Panel plaintext, appliance OID/lock, zigbee placement, computed cal (7.1.1) |

## Phases

- **A** Architecture + Notion docs
- **B** Brain core (this tree starts B)
- **C** Webserver MVP
- **D** Close loop + Pi appliance driver; HA optional integration
- **7.0 / 7.1** Pi island product: FleetSnapshot SPA, appliance driver replaces ETH01 bridge, Overview + calibration (7.1)
- **7.1.1** Island closeout: panel labels/plaintext ingest, `grow_mat_demand` + `host_lock`, calibration in computed paths, zigbee-by-placement
