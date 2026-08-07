# LIVE-UI — DSC-HUB custom panel (surface 6.0.0)

React + Vite product panel hosted inside Home Assistant (WashData pattern).

| Surface | Role |
|---|---|
| Sidebar | **DSC-HUB** → `/dsc-hub` (custom panel) |
| Deep routes | Hash routes: `/dsc-hub#/ops/home`, `#/plant/catalog`, … |
| Lovelace fallback | `dsc-hub-pro` YAML — `show_in_sidebar: false` |
| Surface version | `sensor.dsc_ha_surface_version` **6.0.0** |
| Integration | `homeassistant/custom_components/dsc_hub/` |
| Enable | `dsc_hub:` in configuration.yaml (see snippet) |

## Build

```bash
cd homeassistant/custom_components/dsc_hub/frontend
npm install
npm run build   # emits www/dsc-hub-panel.js (CSS inlined)
```

Prefer building on a local disk if the NAS share stalls `npm`.

## Deploy

`scripts/ha-sync.sh` syncs `custom_components/dsc_hub` (Python + www + assets).
Then: HA **Developer Tools → YAML → Check configuration** → restart Core
(or reload custom integrations if supported) so the panel registers.

## Visual system

Black / gray / neon green / white · tabbed primary+secondary · press feedback ·
soft shadows · glowing live charts · desktop-first grid with narrow tile reflow.

## Acceptance

- [ ] Sidebar **DSC-HUB** opens `/dsc-hub` (not Lovelace YAML title)
- [ ] Primary tabs Ops · Plant · Advanced · System
- [ ] Secondary tabs navigate hash routes
- [ ] Ops Home shows hub/climate KPIs when entities are live
- [ ] Graphs pulse on live series; buttons depress on press
- [ ] WashData / Overview / Frigate unchanged
- [ ] Narrow viewport tiles columns without breaking desktop layout
