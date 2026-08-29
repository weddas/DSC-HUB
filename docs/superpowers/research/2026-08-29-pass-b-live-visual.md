# Pass B — Live visual system (research + decisions)

**Date:** 2026-08-29  
**Status:** Implementing (gate first, then token polish)

## Evidence

- Browser QA (`docs/qa-screenshots-2026-08-29/`): Twin blank 300×150; Climate Sankey MASS IMBALANCE; R3F airflow particle canvas unreliable on Pi.
- Thermo-nuclear + design spec: **one** CFM surface; do not ship blank theater as Orbit.
- OSS IA (Mycodo / HA): live ops ≠ experimental viz; demote until honest.

## Decisions (locked for Pass B)

1. **Sole CFM UI:** `AirPathMap` on Climate (and tent cockpits that already embed it).
2. **Gate:** Remove `FlowSankey` + `AirflowParticleViz` from Climate page tree; keep component files for a later graduate flag.
3. **Twin / Ops dash:** Same `LiveTwinPage` route — replace WebGL mount with honest “unavailable” card; keep demoted nav. `TwinKeepAlive` should not warm THREE on those paths while gated.
4. **Root pattern:** Horizontal Want/Got already set by Pass A; Climate/Light adopt readable type + honesty notes, not a full restyle this pass.
5. **Out of B:** Settings tree (C); fleet NPK producers; SoftCal 1–4 pickers.

## Verify when B done

On `.48:8787`:

1. `#/live/climate` — Air path only; no Sankey / particle canvas.
2. `#/live/twin` and `#/ops/dash` — honesty card, no blank WebGL.
3. Pass A Root checks still hold after redeploy.
