# LIVE-UI — DSC-HUB custom panel (surface 6.3.0)

React + Vite product panel hosted inside Home Assistant (WashData pattern).

| Surface | Role |
|---|---|
| Sidebar | **DSC-HUB** → `/dsc-hub` (custom panel) |
| Deep routes | Hash routes: `/dsc-hub#/ops/home`, `#/plant/catalog`, … |
| Lovelace fallback | `dsc-hub-pro` YAML — `show_in_sidebar: false` |
| Surface version | `sensor.dsc_ha_surface_version` **6.3.0** |
| Integration | `homeassistant/custom_components/dsc_hub/` |
| Enable | `dsc_hub:` in configuration.yaml (see snippet) |

## Build

Prefer the local-disk script (NAS shares stall `npm`):

```powershell
powershell -ExecutionPolicy Bypass -File scripts/build-dsc-hub-panel.ps1
```

This copies `frontend/` → `%TEMP%`, runs `npm ci` + `npm run build`, then copies
`dsc-hub-panel.js` (+ map/assets) back to `homeassistant/custom_components/dsc_hub/www/`.

Manual equivalent:

```bash
cd homeassistant/custom_components/dsc_hub/frontend
npm install
npm run build   # emits www/dsc-hub-panel.js (CSS inlined)
```

## Deploy

`scripts/ha-sync.sh` syncs `custom_components/dsc_hub` (Python + www + assets).
Then: HA **Developer Tools → YAML → Check configuration** → restart Core
(or reload custom integrations if supported) so the panel registers.

**Note:** the `dsc-hub-sync` add-on image still needs a rebuild to pick up
`custom_components` staging from git. Panel JS under `/local` / integration
`www` updates on sync after the Python package is present.

## Visual system

Black / gray / neon green / teal / amber / white · glass HUD · tabbed primary+secondary ·
slide-out search drawers · overflow ⋯ / gear actions · press feedback · soft shadows ·
dual-axis glowing charts with time axis + hover + Want bands · Full Auto Mode card ·
per-tent Want editors · demand toggles with neon ON edge · desktop-first grid
with narrow tile reflow · Plant Seat (soil / age / tent apply) · Dash world HUD callouts.

## Pass 3 acceptance (6.3)

- [ ] Live climate: dual axes readable; X times present; hover shows time + T + RH
- [ ] Main/Clone charts use that tent’s Want overlays; edit Want → HA numbers update
- [ ] Gauges show band ticks, target, extrema; VPD in real kPa
- [ ] Full Auto + strategy + priority write HA; honesty chip on reduced kit
- [ ] Fan override ON → four fan % sliders write
- [ ] In-service toggles (AC / mister / pots) on Climate + System
- [ ] Seat tab icon ≠ Root; page headers + chips have icons; wordmark in brand row
- [ ] Search icon opens slide-out; settings/gear reachable; drawer close ≠ more
- [ ] Dash callouts both tents with RH band + VPD mini; bloom stronger
- [ ] `sensor.dsc_ha_surface_version` reads **6.3.0**

## Pass 2 acceptance (still true)

- [ ] Cold open `/dsc-hub#/ops/home` — tent T/RH charts populate from history within seconds
- [ ] Status strip reflects hub / panel / beat / alerts / fleet
- [ ] Plant seat chips on Home open `/ops/plant-seat?pot=N`
- [ ] Demand toggles (Heat/Cool/Hum/Dehum/Mat) call HA and match tent reality
- [ ] Pot ESP-NOW chips + manual takeover / fan override visible
- [ ] Ops · Climate shows VPD gauges + CFM / fan % KPIs and sparklines
- [ ] Ops · Dash / Plant · Catalog load without visiting Lovelace first (auto `/local` inject)
- [ ] Ops · Dash pot click / chip → Plant Seat; Apply to tent lerps plant on Dash
- [ ] Plant · Build result chips + slide-out search; soil cross-section; Commit+assign
- [ ] WashData / Overview / Frigate / other non-DSC panels unchanged
- [ ] Narrow viewport tiles columns without breaking desktop layout

## Pass 1 (still true)

- [ ] Sidebar **DSC-HUB** opens `/dsc-hub` (not Lovelace YAML title)
- [ ] Primary tabs Ops · Plant · Advanced · System
- [ ] Secondary tabs navigate hash routes
