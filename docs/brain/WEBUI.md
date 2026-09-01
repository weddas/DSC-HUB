# Local webserver UI spec

**In one line:** Thin client of the brain API — presentation, advanced control, updates. Live SPA on Pi `:8787`.

Notion: [Local webserver UI](https://app.notion.com/p/3b52b4cda37081c19048e794d4bdf819)

**Tip (v7.4.0 signed off):** `32836fe` · spa-dist `index-K2_ziUnM.js` (+ `calibrate-BqnIG9Rc.js` · `tune-fleet-C9fzhOX5.js` · `twin-three-BjdbWAdH.js`) · [SPA-MODULE-MAP.md](SPA-MODULE-MAP.md) · [KIT-SCOPE.md](KIT-SCOPE.md) · [FLOW-SANKEY.md](FLOW-SANKEY.md) · [SURFACE-VERSION.md](SURFACE-VERSION.md) · [ROSTER-STOCK.md](ROSTER-STOCK.md) · [PLANT-WIZARD.md](PLANT-WIZARD.md) · [PLANT-PROBE-LIFECYCLE.md](PLANT-PROBE-LIFECYCLE.md) · [R3F-CANVAS.md](R3F-CANVAS.md) · [ZIGBEE-POLICY-UI.md](ZIGBEE-POLICY-UI.md)  
**Prior (Post-mega D-C-A-B):** `f029702` · `index-CXq-NptO.js`  
**Prior Mega Pass:** `a307dc7` · `index-DlMHgtYz.js`  
**Prior audit:** `a2f5f08` / `3a452f0` · `index-D7pAmjOB.js`  
**Prior (computed refresh + compose honesty):** `149657d`  
**Prior (10-slot stock):** `15d7016`

## Surfaces (product SPA)

| Route | Job |
|---|---|
| `#/ops/home` | Ops overview (vitals, honesty, Cannalib stale banner when offline) |
| `#/live/climate` | Climate — airflow R3F wrap + Zigbee Wet/Dry · Problem/Clear |
| `#/live/twin` | Twin 3D — ResizeObserver canvas wrap |
| `#/grow/roster` | Plant roster — detach / assign / **slot Delete** via `RosterLifecycleDialogs`; vacant strip vs roster claims |
| `#/grow/compose` | Plant Wizard orchestrator + `plantWizard/*Step` — stock or seated create; preset label on review |
| `#/fleet/calibrate` | SoftCal / soil cal |
| `#/settings` | Inventory + Zigbee via `components/settings/*` (bind row + live policy chips), advanced |

> **HA wireframe:** optional lab panel only. Product SoT is the Pi SPA + brain HTTP ([`docs/HA-SCAFFOLD.md`](../HA-SCAFFOLD.md)).

## API dependency (roster / compose)

Reads/writes go through brain HTTP (`brain/dsc_brain/api.py`):

- `GET /health` · `GET /fleet` · `GET /fleet/computed` · `GET /ws/fleet`
- `POST /control/service` (compose helpers + `script.dsc_*`)
- `POST /roster/detach/{pot}` · `POST /roster/assign` · `POST /roster/move`
- `POST /roster/slots/{n}/retire` — destroy stock/detached/active by slot (1–10); clears `plant_uuid`
- `GET /v1/catalogs/{kind}` · `GET /want/{strain_id}`
- `POST /admin/reload-catalogs`

Capacity: `ROSTER_SLOT_COUNT = 10` in `compose_store.py`. Kit probes for operator chrome: `KIT_PROBE_NUMBERS` = 1–2 ([KIT-SCOPE.md](KIT-SCOPE.md)). Module ownership after D splits: [SPA-MODULE-MAP.md](SPA-MODULE-MAP.md).

### Client refresh contract (tip `149657d`+)

`BrainProvider` (`useBrain.tsx`):

- Serializes `/fleet/computed` via a promise chain so `refresh()` / WS / 5s poll never drop a retire/update behind an in-flight request
- Cache-busts computed with `?_=${Date.now()}` (`fleetApi.get_fleet_computed`)
- Bumps React `tick` after each successful computed apply so roster tables re-render

`GrowPages.confirmRetire` (tip `3a452f0`): after slot retire + `refreshBrain`, close the probe drawer when `retirePot === pot` (URL), then clear retire state — do not scan a stale pre-refresh `slots` array.

Compose: nickname sync reads live DOM; Light footer = **Skip light** when unset — [PLANT-WIZARD.md](PLANT-WIZARD.md).  
Assign sprout/stage + vacant strip — [ROSTER-STOCK.md](ROSTER-STOCK.md).

### Deploy / hotpatch

Windows lab path: [`../ops/PI-HOTPATCH.md`](../ops/PI-HOTPATCH.md) (`pscp`/`plink`, not OpenSSH `scp`). Verify served `index.html` hash matches spa-dist (`index-K2_ziUnM.js` on tip).

## Non-goals

- Inventing Got / Need / catalog chem when producers are missing
- Inferring Zigbee **Problem** from Wet alone ([ZIGBEE-POLICY-UI.md](ZIGBEE-POLICY-UI.md))
- Blank R3F canvases without sizing wraps ([R3F-CANVAS.md](R3F-CANVAS.md))
- Embedding fat strain dumps in the browser
- Requiring Home Assistant for product ops

## Host

Pi 4 4GB+ LAN (`http://dsc-brain.local:8787` or IP). Deploy spa-dist with brain image / hot-patch.

## Related

- [SPA-MODULE-MAP.md](SPA-MODULE-MAP.md) · [KIT-SCOPE.md](KIT-SCOPE.md)
- [PLANT-WIZARD.md](PLANT-WIZARD.md) · [PLANT-PROBE-LIFECYCLE.md](PLANT-PROBE-LIFECYCLE.md) · [ROSTER-STOCK.md](ROSTER-STOCK.md)
- [R3F-CANVAS.md](R3F-CANVAS.md) · [ZIGBEE-POLICY-UI.md](ZIGBEE-POLICY-UI.md)
- Post-mega closure: [`../qa/AUDIT-CLOSURE-2026-09-D-C-A-B.md`](../qa/AUDIT-CLOSURE-2026-09-D-C-A-B.md) · Mega Pass: [`../qa/AUDIT-CLOSURE-2026-09.md`](../qa/AUDIT-CLOSURE-2026-09.md)
- Architecture: [../DSC-BRAIN.md](../DSC-BRAIN.md)
- Verify: `pytest brain/tests/test_roster_stress.py -q` · `npm run test:compose`
