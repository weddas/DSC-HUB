# LIVE-UI — DSC-HUB custom panel (surface 7.1.x)

React + Vite product panel hosted inside Home Assistant (WashData pattern).
Operator path after the Waves 1–8 bar close: **native Grow · Climate Command · neon Twin** —
ops runbook [`LIVE-UI-BAR-RAISE.md`](LIVE-UI-BAR-RAISE.md).

| Surface | Role |
|---|---|
| Sidebar | **DSC-HUB** → `/dsc-hub` (custom panel) |
| Deep routes | Hash routes: `/dsc-hub#/live/mission`, `#/live/climate`, `#/grow/compose`, `#/fleet`, … |
| Legacy redirects | `#/ops/*`, `#/plant/*`, `#/advanced/*`, `#/system` → Live/Grow/Tune/Fleet |
| Lovelace fallback | `dsc-hub-pro` YAML — `show_in_sidebar: false` |
| Surface version (operator SoT) | `sensor.dsc_ha_surface_version` **7.1.3** (package) |
| Integration / chrome | `SURFACE_VERSION` **7.1.4** · App chrome **7.1.4** · `BUNDLE_V` **`7.1.7-bar-raise`** |
| Integration path | `homeassistant/custom_components/dsc_hub/` |
| Enable | `dsc_hub:` in configuration.yaml (see snippet) |

## Build

Prefer the local-disk script (NAS shares stall `npm`):

```powershell
powershell -ExecutionPolicy Bypass -File scripts/build-dsc-hub-panel.ps1
```

Manual:

```bash
cd homeassistant/custom_components/dsc_hub/frontend
npm install
npm run build   # emits www/dsc-hub-panel.js (CSS inlined)
```

After Twin/Dash edits, concat `/local/DSC-HUB.js` from `homeassistant/www/` card order
(`dsc-system-map` → `dsc-airflow-map` → three → dash-fx → dash → build → catalog → app-nav)
and hard-reload Lovelace/panel.

## Visual system (7.1)

Sharper contrast: lifted indigo-slate · **blue/cyan** active chrome · green = live/ON only ·
amber HELD/stale · Twin leaders + cyan Got markers / cyan intake piping (no dank `#39ff14` brand wash).
Neon glass vessels + HUD-off cockpits are part of the bar-raise Twin path — see
[`LIVE-UI-BAR-RAISE.md`](LIVE-UI-BAR-RAISE.md).

## Pass 7.1.1 finish gaps (ancestry — superseded for ops by bar-raise)

- [x] Panel/beat OFF duration chips (`PANEL OFF Xm` / `BEAT OFF Xm`) when dark
- [x] Root Rate column (`sensor.dsc_pot{N}_soil_moisture_rate`)
- [x] Learned-EC honesty subtitle on seat Got history + Analytics P1 EC (attrs only; never invent)
- [x] Twin on-scene pot glass chips + cyan intake/path bias; Node-concat `DSC-HUB.js` (~1.0MB)
- [x] Research/Compose empty honesty + Use-in-Compose / Open Seat CTAs
- [ ] Live blip soak (HELD + OFF timer + reconnect) — **needs logged-in HA after sync** (agent browser hit auth/loading wall)
- [ ] Climate airflow-map after `/local/DSC-HUB.js` hard reload — **needs deploy**; bundle includes `dsc-airflow-map-card` define

## Pass 7.1 acceptance

- [x] Hub/API blip: KPIs/gauges **hold last good** + HELD; chips **HUB OFFLINE** + **OFF Xm** (no `0.0` wipe) — code path shipped; live flap soak operator
- [ ] Reconnect: chips green; values snap live; charts reseed — operator after sync
- [x] Click Tent T gauge → History drawer; 1h|6h|24h|48h reloads series
- [x] Apply Main/Clone/Unassigned from seat — no Invalid option
- [x] Live tabs include **Main** + **Clone** cockpits
- [x] Root fleet matrix dryback/EC/Need/**Rate**; seat edits name/sprout/stage without Compose
- [x] Climate hosts airflow-map + allocated CFM honesty
- [x] Learning shows learn status / CFM alloc vs nameplate
- [x] Active chrome blue/cyan
- [x] Surface strings present in-tree (package **7.1.3** SoT; chrome/const **7.1.4**; bundle tag **`7.1.7-bar-raise`**) — live HA after package reload / hard-reload

## Pass 7.0 acceptance (still)

- [x] Primary tabs Live / Grow / Tune / Fleet
- [x] Default `#/live/mission` + NextRecommended
- [x] Twin keep-alive across tabs
- [x] Grow Compose → Research → Roster
- [x] Honesty rail + reduced-kit / keepup / OOS
- [x] Legacy `#/ops/*` redirects

## Pass 3 / prior

- [x] Dual-axis charts, Want overlays, gauges, Full Auto / fans / in-service still work
- [x] Twin HUD callouts both tents with RH band + VPD mini + leaders
