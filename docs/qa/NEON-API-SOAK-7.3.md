# Neon API soak — Twin 7.3

**Date:** 2026-08-27  
**Engine:** R3F on Pi SPA (`VITE_DSC_PI=1`); legacy IIFE retained for HA panel path.

| API | Contract | R3F equivalent |
|-----|----------|----------------|
| `pause(bool)` | Stop rAF when tab hidden / route inactive | Canvas unmount when not visible |
| `setFocusTent(mode)` | Camera emphasis main/clone/both | Wireframe tent visibility filter |
| `setHeld(bool)` | Freeze motion when hub link down | `held` stops useFrame rotation |
| `setPots(VesselLive[])` | Pot meshes + trust/OOS | WireBox per pot; dashed when OOS/untrusted |
| `setUiChrome({hideHud})` | Hide IIFE HUD | React owns chrome; no IIFE HUD on Pi |

## Signoff

- [x] R3F module `frontend/src/twin/DscTwinCanvas.tsx`
- [x] `TwinKeepAlive` selects R3F when `VITE_DSC_PI=1`
- [x] OOS/untrusted pots render dashed wireframe
- [ ] Visual parity screenshot vs 7.1.2 baseline (operator post-deploy)

Legacy [`dsc-the-dash-card.js`](../../homeassistant/www/dsc-the-dash-card.js) remains for HA `/dsc-hub` until that path migrates.

Developer runbook: [`docs/brain/TWIN-R3F.md`](../brain/TWIN-R3F.md).
