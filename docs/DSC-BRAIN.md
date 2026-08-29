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

**Control recovery (Bar 1 shipped):** restore HA-era loops on the brain, SPA client-only, hub offline = manual takeover + reconnect temporary override (TTL **900s** or clear). Physical SoT: **4x8 + 2x4 share intake/exhaust**. Twin/3D is SoT projection only. See [brain/CONTROL-RECOVERY.md](brain/CONTROL-RECOVERY.md) · [design](superpowers/specs/2026-08-29-brain-control-recovery-design.md) · [Bar 1 plan](superpowers/plans/2026-08-29-brain-control-recovery-bar1.md). Tip `f0d18ce`.

## Repo map

| Path | Role |
|---|---|
| [`brain/`](../brain/) | Pi brain package (catalog store, Want, decision loop, API stub) |
| [`SETUP.md`](../SETUP.md) | SoftAP kit unbox (product path) |
| [`INSTALL.md`](../INSTALL.md) | HA lab bring-up (scaffold) |
| [`docs/HA-SCAFFOLD.md`](HA-SCAFFOLD.md) | Promote-don't-deepen rules |
| [`docs/brain/`](brain/) | Specs: decision loop, control recovery, web UI, Pi appliance path |

## Phases

- **A** Architecture + Notion docs
- **B** Brain core (this tree starts B)
- **C** Webserver MVP
- **D** Close loop + Pi appliance driver; HA optional integration
