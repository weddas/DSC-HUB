# Proposed patches to `frontend/src/styles/dsc.css`

> Draft, 2026-09-06. **Do not apply without operator approval.** Every entry below is either a token add, a token remove, or a call-site fix. No visual change on the operator surface if applied wholesale — the point is to close the "declared-but-unused" and "referenced-but-undeclared" gaps and unlock the public/light themes.

## Add — accent dims

```css
:root, :host, .dsc-root {
  --dsc-amber-dim: rgba(255, 183, 77, 0.45);
  --dsc-bad-dim:   rgba(239, 83, 80, 0.4);
}
```

Rationale: `TankCutaway.tsx`, `DemoBanner`, `BandChartHost.tsx` all inline these rgba values today. Declaring them makes the vessel/banner/chart layer themeable.

## Add — vessel token pack

```css
:root, :host, .dsc-root {
  --dsc-vessel-fabric:      rgba(180, 210, 190, 0.85);
  --dsc-vessel-plastic:     rgba(160, 190, 170, 0.9);
  --dsc-vessel-water:       rgba(120, 210, 230, 0.95);
  --dsc-vessel-teal-fill:   rgba(38, 198, 218, 0.22);
  --dsc-vessel-teal-hint:   rgba(38, 198, 218, 0.12);
}
```

Then follow-up in `lib/vesselSpec.ts`, `TankCutaway.tsx`, `KitPulse.tsx` to consume these instead of inline rgba. Call sites, not shipped in this patch.

## Add — semantic aliases

```css
:root, :host, .dsc-root {
  --dsc-brand-ink:  var(--dsc-white);
  --dsc-brand-mark: var(--dsc-teal);
  --dsc-link:       var(--dsc-teal);
  --dsc-focus-ring: var(--dsc-teal-glow);
}
```

No visible change on operator; unlocks the `public` and `light` themes.

## Add — spacing scale

```css
:root, :host, .dsc-root {
  --dsc-space-1: 4px;
  --dsc-space-2: 8px;
  --dsc-space-3: 12px;
  --dsc-space-4: 16px;
  --dsc-space-5: 24px;
  --dsc-space-6: 40px;
}
```

Declaration only. Do not sweep-replace existing inline `gap`/`padding` in this patch; migrate opportunistically.

## Add — chip / pill radius

```css
:root, :host, .dsc-root {
  --dsc-radius-full: 9999px;
}
```

## Add — display type scale (guarded)

```css
:root, :host, .dsc-root {
  --dsc-font-display: "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;
  --dsc-fs-h3: 20px;
  --dsc-fs-h2: 30px;
  --dsc-fs-h1: 44px;
}
```

Declared on `:root` so a public surface can consume them, but the operator SPA must not reference these directly — the operator style sheet does not use them.

## Remove — dead tokens

```css
/* delete */
--dsc-bad-soft: #ef5350;
--dsc-gray-4:  #8b95a8;
--dsc-ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);   /* unless wired into skeleton keyframe per primitives.md */
--dsc-neon-glow: rgba(0, 230, 118, 0.4);              /* unless wired into ok-chip glow per primitives.md */
```

Recommend keep `--dsc-neon-glow` and `--dsc-ease-in-out` and **wire them in** rather than delete. Removing them loses the "ok" glow affordance which reads flatter than warn/bad, and loses the skeleton easing.

## Fix — undefined `--dsc-*` fallbacks in call sites

None of these need a token declaration — they need the **call site** to reference the correct existing token. Track as `docs/FOLLOWUPS.md` items to sweep separately from this patch:

| File                         | Current                          | Fix                                    |
| ---------------------------- | -------------------------------- | -------------------------------------- |
| `pages/SetupPage.tsx`        | `var(--dsc-danger, #c44)`        | `var(--dsc-bad)`                       |
| `viz/charts.tsx`             | `getCssVar("--dsc-green", "…")`  | `getCssVar("--dsc-neon", "#66bb6a")`   |
| `viz/charts.tsx`             | `getCssVar("--dsc-green-dim", …)`| `getCssVar("--dsc-neon-dim", "…")`     |
| component styles             | `var(--dsc-border, #3a4452)`     | `var(--dsc-gray-3)`                    |
| component styles             | `var(--dsc-muted-fg, #94a3b8)`   | `var(--dsc-gray-5)`                    |
| component styles             | `var(--dsc-surface, #12141a)`    | `var(--dsc-black-2)`                   |
| component styles             | `var(--dsc-text, #eef1f8)`       | `var(--dsc-white)`                     |
| journal browser              | `var(--dsc-journal-row-height)`  | declare `40px` or drop usage           |
| journal browser              | `var(--dsc-journal-visible-rows)`| declare `3` or drop usage              |

## Fix — inline hex in SVG viz layer

Not in this stylesheet patch — captured for the call-site sweep:

- `components/AirPathMap.tsx` — `fill="#b388ff"`, `stroke="#ff8a65"` → token consumers.
- `components/TankCutaway.tsx` — `fill="rgba(38,198,218,0.22)"` → `var(--dsc-vessel-teal-fill)` after the vessel pack lands.
- `components/KitPulse.tsx` — `"rgba(38,198,218,0.12)"` → `var(--dsc-vessel-teal-hint)`.
- `components/BandChartHost.tsx` — `"#22c55e88"`, `"#ef444488"` → `var(--dsc-neon-dim)`, `var(--dsc-bad-dim)`.

## Motion — reduce-motion cleanup

Current:

```css
@media (prefers-reduced-motion: reduce) {
  .dsc-stars-layer { animation: none; }
}
```

Proposed:

```css
@media (prefers-reduced-motion: reduce) {
  .dsc-stars-layer { animation: none; transform: none; }
  .dsc-stars-echo  { display: none; }
}
```

The current rule leaves the parallax layers stranded mid-drift after any motion resume; the fix parks them cleanly at rest.

## Theme scoping (for landing `public` / `light` variants later)

None of the above patches introduce a `[data-dsc-theme="…"]` selector. When `themes/public.css` and `themes/light-mode.css` are extracted, they will live in separate stylesheets loaded on-demand, not folded into this file. Keep `dsc.css` as the operator surface source of truth.

## Est. line delta

Approximate diff against current 3,922-line `dsc.css`:

- Adds: ~24 lines (tokens + `prefers-reduced-motion` two-liner).
- Removes: 2–4 lines (dead tokens if the "delete" recommendation is taken).
- Net: +20 to +22 lines.

Below the "> ~20 shipped-code lines → ask first" guardrail — this is exactly the threshold moment. Flagging for operator approval before landing.
