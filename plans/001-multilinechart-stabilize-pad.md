# 001 — Stabilize MultiLineChart `pad` for exhaustive-deps

- **Status**: TODO
- **Commit**: `05e8471`
- **Severity**: HIGH
- **Category**: Bugs & correctness
- **Rule**: `react-doctor/exhaustive-deps`
- **Estimated scope**: 1 file (`src/viz/charts.tsx`), small

## Problem

`MultiLineChart` recreates `pad` as a new object every render (`charts.tsx:274`). Several `useMemo` / `useCallback` hooks capture `pad` / `pad.t` / `pad.l` etc. but omit them from dependency arrays. React Doctor reports stale-`pad` risk on the hot chart path (Root seat history, Analytics, Climate series).

```274:274:homeassistant/custom_components/dsc_hub/frontend/src/viz/charts.tsx
  const pad = { l: 40, r: hasRight ? 40 : 14, t: 16, b: 28 };
```

Affected hooks (current deps omit `pad*`):

```316:327:homeassistant/custom_components/dsc_hub/frontend/src/viz/charts.tsx
  const gridLeft = useMemo(() => {
    ...
      const y = pad.t + frac * (height - pad.t - pad.b);
    ...
  }, [model, height]);
```

Same pattern at lines ~340 (`gridRight`), ~354 (`timeTicks`), ~368 (`clientToChartX`), ~417 (`hoverSamples`). Model builder at ~314 also flagged for stale `pad`.

Browser QA also saw collapsed history X-axis labels (`11:29` five times) — fix deps/pad first; if axis collapse remains, that is a separate time-span bug outside this plan.

## Target

Canonical recipe (`react-doctor/exhaustive-deps`): *Move recreated values into the callback or stabilize them before adding them. Add every reactive capture when you provide a dependency array.*

Stabilize `pad` with `useMemo` keyed on `hasRight` (only field that changes), then depend on `pad` (or primitive `pad.l`…`pad.b`) in every hook that reads it:

```tsx
  const pad = useMemo(
    () => ({ l: 40, r: hasRight ? 40 : 14, t: 16, b: 28 }),
    [hasRight],
  );

  const gridLeft = useMemo(() => {
    if (!model) return [];
    const ticks = 4;
    const out: { y: number; label: string }[] = [];
    for (let i = 0; i <= ticks; i++) {
      const frac = i / ticks;
      const v = model.left.max - frac * (model.left.max - model.left.min);
      const y = pad.t + frac * (height - pad.t - pad.b);
      out.push({ y, label: v.toFixed(Math.abs(v) >= 100 ? 0 : 1) });
    }
    return out;
  }, [model, height, pad]);

  // gridRight, timeTicks, clientToChartX, hoverSamples, and the model useMemo:
  // add `pad` (or pad.l/pad.r/pad.t/pad.b) to each dependency array that reads pad.
```

Do **not** suppress the rule.

## Repo conventions to follow

- Imports stay at top of module (no inline imports).
- Prefer `useMemo` for derived layout constants already used elsewhere in this file (`chartStale`, model builder).
- Exemplar: nearby `chartStale` `useMemo` in the same `MultiLineChart` function.

## Steps

1. At `charts.tsx:274`, wrap `pad` in `useMemo(..., [hasRight])`.
2. Add `pad` to dependency arrays at the flagged sites (~314, 327, 340, 354, 368, 417). Prefer depending on the whole `pad` object once it is memoized.
3. Do not change chart geometry numbers, colors, or public props.
4. Re-read diff; no unrelated churn in `ArcGauge` or other exports.

## Boundaries

- Do NOT redesign ArcGauge, Root layout, or NPK.
- Do NOT add dependencies.
- STOP if `MultiLineChart` / `pad` usage has drifted from commit `05e8471`.

## Verification

- **Mechanical**:
  - From `homeassistant/custom_components/dsc_hub/frontend`: `cmd /c npx.cmd react-doctor@latest --scope changed` — `exhaustive-deps` on `charts.tsx` MultiLineChart sites cleared; score not lower.
  - `npm run typecheck` (or project equivalent) passes.
- **Behavior check**: Open `#/tune/analytics` and a Root plant seat history chart; confirm series still draw, hover crosshair still tracks, left/right axes still labeled. React DevTools Profiler: toggling series should not show spurious rememo storms beyond tick updates.
- **Done when**: targeted `exhaustive-deps` diagnostics for these lines are gone; charts still render on Pi SPA after deploy/hot-patch.
