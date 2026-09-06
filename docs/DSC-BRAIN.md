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

**Decision 2026-09-06 — shadow mode stays.** Proposals do not become `*_demand` writes, because:

1. The `*_demand` switches are owned by the hub's Full Auto ladder; a brain write is re-asserted by the hub on its next tick (the Climate page already says so). Writing them would be a fight, not control.
2. `emit_proposal` only ever proposes `demand_on` (`temp_c_low` → heater, `rh_pct_high` → dehumidifier, …); there is no `demand_off` proposal, so "real writes" would latch appliances on with nothing to release them.
3. The brain already acts where it owns the surface: setpoints and modes via `/control/service` (clamped by the ESP), Zigbee tasks, automation rules (cut-outs, operator-owned switches, clamped setpoints), and the Sonoff appliance driver.

The path to brain-driven demand is a firmware change, not a flag: a hub *brain-owned demand* mode in which the ladder yields the `*_demand` switches while the brain is fresh (and takes them back on staleness), plus symmetric on/off proposals with hysteresis. Tracked as a Suggested Feature. Until then the honest wording is "brain proposes, hub applies".
