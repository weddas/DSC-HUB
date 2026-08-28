# Airflow visualization — 7.4 architecture

**Status:** Scaffold **landed** (still on tip `8208461`) — `AirflowParticleViz` + lazy `AirflowParticleScene` on Climate “Air path”. Trim panel / full particle field / CFD hints still incomplete (Phase D2).  
**Reference demo:** `y:\gemini-code-1787831771428.html`  
**Coexists with:** static `AirPathMap.tsx` SVG ribbons + experimental `FlowSankey` (keep CFM trust lines)

---

## Caller usage (target)

```tsx
// ClimatePage.tsx — lung room card
<AirflowParticleViz
  readings={{
    intakeMain: cfmMain,      // sensor.dsc_cfm_intake_main_allocated
    intakeClone: cfmClone,    // sensor.dsc_cfm_intake_2x4_allocated
    exhaustOutside: cfmOut,   // sensor.dsc_cfm_exhaust_outside_allocated
    exhaustRecirc: cfmRecirc, // sensor.dsc_cfm_exhaust_room_allocated
  }}
  trim={{
    intakeMainPct: fanPct("fan.dsc_hub_4_inch_intake_fan_main"),
    intakeClonePct: fanPct("fan.dsc_hub_4_inch_intake_fan_2x4"),
    exhaustOutsidePct: fanPct("fan.dsc_hub_6_inch_exhaust_outside"),
    exhaustRecircPct: fanPct("fan.dsc_hub_6_inch_exhaust_room"),
  }}
  manualOverride={fanOverride}
  onTrimChange={(fanId, pct) => setFanTrim(fanId, pct)} // only when override ON
  onPathInspect={(pathId) => inspector.open(...)}
/>
```

Operator story: **calibration stays authoritative** (allocated CFM from hub). Trim sliders scale *display flow* and *particle speed/count* proportionally so the user sees “what if I pull 20% off intake 2×4” without rewriting cal tables.

---

## Module map

| Module | Role |
|--------|------|
| `components/airflow/AirflowParticleViz.tsx` | R3F canvas shell, lazy-loaded |
| `components/airflow/useAirflowSim.ts` | Maps CFM + trim → path weights, speeds, colors |
| `components/airflow/lungRoomPaths.ts` | CatmullRom splines: dual intake → tent volumes → outside + recirc exhaust |
| `components/airflow/ParticleField.tsx` | BufferGeometry particles (ported from demo) |
| `components/airflow/FanTrimPanel.tsx` | Reuses `EntityFanSlider` when `switch.dsc_hub_tent_manual_override` on |
| `lib/airflowEffects.ts` | Pure: estimated ΔT/ΔRH hints from trim delta (honest “directional”, not CFD) |

---

## Type sketch

```ts
type AirPathId = "intake_main" | "intake_clone" | "exhaust_outside" | "exhaust_recirc";

type PathSim = {
  id: AirPathId;
  curve: THREE.CatmullRomCurve3;
  share: number;       // 0..1 particle allocation
  speed: number;       // progress per second × trim
  spread: { x: number; z: number }; // tent volume
  cfm: CfmReading;
};

type TrimState = Record<AirPathId, number>; // 0..100 display scale

function buildPathSims(readings: CfmBundle, trim: TrimState): PathSim[];
function particleColor(progress: number, path: AirPathId): THREE.Color;
```

---

## Synthesis decision (arena-style)

**Chosen:** Single R3F canvas with **four splines** (not one merged graph):

1. Outside intake → 4×8 floor → 4×8 canopy → **outside exhaust**
2. Outside intake → 2×4 floor → 2×4 canopy → **recirc exhaust**
3. (Optional v2) Recirc loop segment visible when `exhaustRecirc` > threshold

**Rejected:** Extend SVG `AirPathMap` with animated dashes — doesn’t convey volume/expansion; user demo already proves particle readability.

**Rejected:** Full CFD / pressure field — over scope; hub already exposes allocated CFM.

### Particle behavior (from demo, adapted)

- Progress along spline; reset at 1.0
- **Volume expansion** inside tent segment (sin² envelope on path parameter 0.3–0.7)
- Color: cool intake → warm canopy → hot exhaust
- Particle count ∝ `sqrt(cfm × trim)` capped for GPU (mobile HA panel: default 2000)

### Trim semantics

- When **manual override off**: trim locked at live fan %; sliders disabled (existing Climate behavior)
- When **on**: slider adjusts `fan.*` entity; viz reads back state; show delta chip “−12% CFM vs calibrated”

### Effects panel (honest)

Side card, not fake precision:

| Trim change | UI hint |
|-------------|---------|
| ↓ intake 2×4 | “Less fresh air to clone tent — RH may rise” |
| ↑ exhaust outside | “More lung-room vacuum — recirc share drops” |

Copy from existing honesty strings + `CfmTrustLine` provenance.

---

## Three.js / R3F notes (research summary)

- Stack already in `package.json`: `three`, `@react-three/fiber`, `@react-three/drei`
- Lazy `React.lazy(() => import('./AirflowParticleViz'))` on Climate tab to avoid Light page bundle cost
- Use `Points` + manual buffer updates in `useFrame` (demo pattern) — InstancedMesh overkill
- `prefers-reduced-motion`: static snapshot with CFM-weighted bar fallback
- Touch: disable OrbitControls on panel; single-finger pass-through scroll

---

## Implementation phases

1. **D2a** — `lungRoomPaths.ts` + static scene (wireframe boxes) behind feature flag
2. **D2b** — ParticleField wired to live CFM (no trim)
3. **D2c** — FanTrimPanel + effects hints
4. **D2d** — Remove SVG ribbons when parity signed off

## Interrogate before merge

Run `/interrogate` on scaffold + Climate integration diff.
