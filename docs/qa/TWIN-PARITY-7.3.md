# Twin parity — 7.3 R3F vs 7.1.2 IIFE

**Date:** 2026-08-27  
**Live:** `http://192.168.86.48:8787/#/live/twin`

## Verdict

**PASS (functional)** — R3F wireframe twin honors pot trust/OOS/held contract; **visual cinematic parity deferred** to a future pass.

| Contract | 7.1.2 IIFE | 7.3 R3F | Status |
|----------|------------|---------|--------|
| Pot OOS dashed | yes | dashed wireframe | PASS |
| Untrusted pot | yes | dashed + grey | PASS |
| Hub held freeze | yes | stops rotation | PASS |
| Focus tent main/clone | yes | tent box visibility | PASS |
| rAF pause off-route | yes | Canvas unmount / hidden | PASS |
| Cinematic materials / FX | full | wireframe stub | DEFERRED |

## Screenshots

| Baseline | 7.3 |
|----------|-----|
| [`screens-7.1.2/live-twin.png`](../screens-7.1.2/live-twin.png) | [`screens-7.3/live-twin-r3f-v2.png`](screens-7.3/live-twin-r3f-v2.png) |

## Layout polish (7.3.0)

Twin canvas portals into `#dsc-twin-slot` on `/live/twin` so the scene sits under the page header (not below Crop scheduler).

See [`NEON-API-SOAK-7.3.md`](NEON-API-SOAK-7.3.md).
