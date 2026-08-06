# DSC Dash FX

`dsc-dash-fx.js` is the dependency-free IIFE cinematic FX bridge for The Dash: once the vendored THREE r160 global is present, it idempotently installs soft sprites, lightweight bloom composition, animated flow ribbons, atmospheric curl haze, and color-ramp texture helpers under `THREE.DSCDashFX`.

## 2026-08-04 — MeshLine ribbons + GPU curl haze

- **Flow ribbons** use a custom triangle-strip MeshLine (`buildMeshLineGeometry`) instead of `THREE.TubeGeometry`. Same dashed additive shader; `vUv.x` is arc length along the curve. Ribbons expose `mesh.userData.rebuildFlowRibbon(radius)` and `THREE.DSCDashFX.rebuildFlowRibbonGeometry(mesh, curve, tubular, radius)` for width animation from `dsc-the-dash-card.js`.
- **Curl haze** advects in the **vertex shader** (`aBasePosition` + curl-noise velocity field, `uTime` / `uIntensity` uniforms). No per-frame CPU particle loop in the default path. `update(dt, intensity)` only advances uniforms.
- **Fallback flags** on `THREE.DSCDashFX.FEATURES`:
  - `meshLineRibbon` / `tubeRibbonFallback` — set `tubeRibbonFallback: true` before first `makeFlowRibbon` to force TubeGeometry.
  - `gpuCurlHaze` / `cpuCurlHazeFallback` — CPU loop path if GPU path is disabled or fails compile.
- **Line2 / GPUComputationRenderer** are not in vendored `three.min.js`; MeshLine and shader advection are implemented inline (IIFE concat-safe, no npm deps).

## Bundle rebuild

From repo root (Git Bash / WSL / Linux):

```bash
bash scripts/sync-hacs-dist.sh
```

Concat order: `dsc-system-map-card.js` → `dsc-airflow-map-card.js` → `vendor/three.min.js` → `vendor/dsc-dash-fx.js` → `dsc-the-dash-card.js` → `dist/DSC-HUB.js` and `dist/dsc-system-map-card.js`. The `dsc-hub-sync` add-on uses the same order when staging `/config/www`.

## 2026-08-06 — In-tent guide ribbons (card consumer)

`dsc-the-dash-card.js` builds three CFM-gated dashed guides with
`makeFlowRibbon(curve, { radius: 0.03, tubular: 48, dashArray: [0.09, 0.07], … })`:

| Key | Story |
|---|---|
| `clone` | 2×4 pierce → cascade |
| `mainOut` | 4×8 pierce → OUT |
| `mainRec` | 4×8 pierce → RECIRC |

Opacity / dash offset are driven each frame from absolute-CFM intensity (same
`≥ 0.04` honesty gate as particles). If `makeFlowRibbon` is missing or throws,
guides stay null — duct streaks can still run. Journey pacing
(`journeyThroughTent` / `journeyPace`) lives entirely in the card, not this bridge.

Operator runbook: [`docs/qa/LIVE-UI-DASH-AIR-JOURNEY.md`](../../../docs/qa/LIVE-UI-DASH-AIR-JOURNEY.md).
