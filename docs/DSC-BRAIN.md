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
| [`docs/brain/`](brain/) | Specs: decision loop, web UI, fleet ingest, compose stage |
| [`docs/ops/DSC-HUB-DOCKER.md`](ops/DSC-HUB-DOCKER.md) | Pi cutover + soak cron |
| [`docs/ops/SONOFF-FLASH.md`](ops/SONOFF-FLASH.md) | Sonoff/hub OTA after bridge retirement |

**Tip (`ab49dd8` / 7.1.2):** Panel plaintext ingest; appliance discovered-OID demands (no phantom `growmat_demand` OFF); Compose tent + sprout stage; SPA gauge green/amber/red/grey. See [`brain/FLEET-INGEST.md`](brain/FLEET-INGEST.md) · [`brain/WEBUI.md`](brain/WEBUI.md) · [`brain/COMPOSE-STAGE.md`](brain/COMPOSE-STAGE.md).

## Phases

- **A** Architecture + Notion docs
- **B** Brain core (this tree starts B)
- **C** Webserver MVP
- **D** Close loop + Pi appliance driver; HA optional integration
