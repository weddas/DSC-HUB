# Home Assistant as lab scaffold

**In one line:** Use HA to iterate fast in a real tent; do not make HA helpers the long-term home of catalogs or grower logic.

Notion: [HA as lab scaffold](https://app.notion.com/p/3b52b4cda370810b9801c53d93a10c13)

## Rules

1. **Durable logic** (catalog schema, Want resolution, roster, Learning math) is expressed as **repo data + testable functions** under [`brain/`](../brain/) first.
2. Wire into HA packages/cards only when you need **live soak**.
3. **Promote** stable rules into the Pi brain; do not invent new SoT that only exists as `input_*` graphs.
4. Lovelace Pro / Build a Plant cards are **prototypes** for the future webserver — reuse UX ideas, not `hass` entity_id coupling.
5. Sync + HACS remain the **lab delivery** path (`INSTALL.md`). Product unbox is SoftAP (`SETUP.md`).
6. **Live lab bus (6.1.x):** HA Native API carries panel vitals/commands and demand followers on studio Wi-Fi. SoftAP/ESP-NOW stay kit-only — see [`docs/qa/STUDIO-WIFI-HA-BUS.md`](qa/STUDIO-WIFI-HA-BUS.md).

## When HA is still right

- Companion notify before brain has its own notify story
- Recorder / Trends while brain history is immature
- Your current live tent soak
- **Lab glass ↔ hub command/vitals bus** after the studio Wi-Fi cutover (until Pi-brain LAN bus exists)

## When to stop deepening HA

- New Want/Need rules that cannot run offline
- New catalog SoT only inside package template attributes
- Product install docs that require HA before SoftAP + Control work
