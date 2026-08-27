# Neon API soak — Twin 7.3

**Date:** 2026-08-27  
**Engine:** R3F on Pi SPA (`VITE_DSC_PI=1`); legacy IIFE retained for HA panel path.  
**Live:** `http://192.168.86.48:8787/#/live/twin`

| API | Contract | R3F equivalent | Live |
|-----|----------|----------------|------|
| `pause(bool)` | Stop rAF when tab hidden / route inactive | Canvas unmount when not visible | PASS |
| `setFocusTent(mode)` | Camera emphasis main/clone/both | Wireframe tent visibility filter | PASS |
| `setHeld(bool)` | Freeze motion when hub link down | `held` stops useFrame rotation | PASS |
| `setPots(VesselLive[])` | Pot meshes + trust/OOS | WireBox per pot; dashed when OOS/untrusted | PASS |
| `setUiChrome({hideHud})` | Hide IIFE HUD | React owns chrome; no IIFE HUD on Pi | PASS |

## Signoff

- [x] R3F module `frontend/src/twin/DscTwinCanvas.tsx`
- [x] `TwinKeepAlive` selects R3F when `VITE_DSC_PI=1`
- [x] OOS/untrusted pots render dashed wireframe
- [x] Twin portals into page slot (`TwinViewport`) — layout PASS
- [x] Visual parity doc — [`TWIN-PARITY-7.3.md`](TWIN-PARITY-7.3.md) (wireframe vs cinematic baseline)

Legacy [`dsc-the-dash-card.js`](../../homeassistant/www/dsc-the-dash-card.js) remains for HA `/dsc-hub` until that path migrates.
