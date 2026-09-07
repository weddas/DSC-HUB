# Theme — operator (dark, dense)

> Draft, 2026-09-06. The current DSC-HUB SPA look, refined. Consumes [`../tokens.md`](../tokens.md).

## Trigger

`data-dsc-theme="operator"` on the document root. The SPA is operator by default — no attribute needed for the island document. External surfaces (an embedded ops panel, HA panel, second-screen display) declare this attribute to opt in.

## What stays exactly as it is

The current dark surface is doing its job. Do not touch:

- `--dsc-black` background, `--dsc-white` primary text, `--dsc-glass` panels.
- Accent-per-section: Grow teal, Live blue, Fleet purple.
- Star field wash (`.dsc-stars`, `--dsc-stars-*`), scoped to `.dsc-root`.
- 14px body base, `--dsc-fs-xs..lg` helper scale.
- Motion vocabulary: `--dsc-ease`, `--dsc-ease-spring`, `--dsc-dur-1..3`, `--dsc-stagger-step`.

## What refines

Small, evidence-driven corrections. Each maps to a `patches/dsc.css.proposed.md` entry.

### 1. Fix the undefined fallback tokens

`--dsc-danger`, `--dsc-green`, `--dsc-green-dim`, `--dsc-border`, `--dsc-muted-fg`, `--dsc-surface`, `--dsc-text`, `--dsc-journal-row-height`, `--dsc-journal-visible-rows` are referenced but never declared. Each is a latent bug — the fallback silently masks the missing declaration. **Fix call sites, do not add tokens.** Mapping in [`../tokens.md`](../tokens.md#color--shadow-root-escape-hatches-deadreject).

### 2. Retire dead tokens

`--dsc-bad-soft`, `--dsc-gray-4`, `--dsc-neon-glow`, `--dsc-ease-in-out` are defined but never consumed outside `dsc.css` itself. Either delete or wire in:

- `--dsc-bad-soft` — delete. `--dsc-bad` alone is enough; the "soft" flavor is achieved via `color-mix`.
- `--dsc-gray-4` — delete. Aliases `--dsc-gray-5`.
- `--dsc-neon-glow` — wire into the `ok` chip and healthy-state gauge glow, or delete. Recommend wire — the `ok` chip currently has no glow and reads flatter than warn/bad.
- `--dsc-ease-in-out` — wire into the skeleton keyframe (per `primitives.md`), or delete.

### 3. Add the domain gaps

The vessel viz, tank cutaway, and kit pulse SVGs currently inline rgba values that don't reference tokens. Add:

- `--dsc-amber-dim` (real dim, not the current bare use in banners)
- `--dsc-bad-dim` (captures `#ef444488` in `BandChartHost`)
- `--dsc-vessel-fabric`, `--dsc-vessel-plastic`, `--dsc-vessel-water`, `--dsc-vessel-teal-fill`, `--dsc-vessel-teal-hint`

Then edit the SVG components to `fill="var(--dsc-vessel-teal-fill)"`. This unlocks a public-surface re-skin without editing the vessel `.tsx` files.

### 4. Add the semantic aliases

- `--dsc-brand-ink`, `--dsc-brand-mark`, `--dsc-link`, `--dsc-focus-ring`.

On operator these map to `--dsc-white` / `--dsc-teal` / `--dsc-teal` / `--dsc-teal-glow`. No visible change. But now the same call sites will theme cleanly under `public` and any future light variant.

### 5. Add the spacing scale

`--dsc-space-1..6`. Add as declarations only. Do not rewrite existing `gap: 8px` inline; migrate opportunistically. The scale is there so new work stops inventing values.

### 6. Density tune

The Phase 1 grep found some card padding at 10px, some at 12px, some at 16px. Pick a rule:

- Card outer margin between siblings: `var(--dsc-space-4)` (16px).
- Card inner padding: `var(--dsc-space-3)` (12px) on `.dsc-fs-sm`-dense cards, `var(--dsc-space-4)` (16px) on cards with a head + body + actions.
- Chip row gap: `var(--dsc-space-2)` (8px).
- Section rhythm on a page: `var(--dsc-space-5)` (24px).

## Star field policy

`.dsc-stars` stays. It's atmospheric, not decorative theater. But:

- The 3-layer parallax runs at `--dsc-stars-speed: 0.4`. Under `prefers-reduced-motion: reduce`, drop to 0 (currently `animation: none`, which strands the layers where they parked). Fix: set `transform: none` too, or set `--dsc-stars-speed: 0` under the media query.
- Under `prefers-contrast: more`, the current 0.35 opacity is fine — no change.
- On pages with heavy data density (Root, Calibrate), consider dimming the wash via a `.dsc-root[data-dense="true"]` class that sets the stars' opacity to 0.5 of default. Doing so keeps atmosphere without competing with numeric readouts.

## Focus policy

Every interactive receives `outline: 2px solid var(--dsc-focus-ring)` on `:focus-visible`, with `outline-offset: 2px`. This is currently inconsistent; the audit found several `outline: none` without a replacement (finding for the Notion tracker).

## Public-image guard

Even the operator SPA is occasionally visible in shared screenshots. Two rules:

1. Never fake sensors. If a panel is `Simulated room`, the demo banner is above the fold on every screen the sim covers.
2. Held/stale readings carry timestamp. `held @ 03:14` beats `—` beats nothing.

## Verification checklist (for landing the patch)

- [ ] `frontend/src/App.tsx` and page entries render unchanged pixel-for-pixel with the new tokens declared (visual diff).
- [ ] `npx tsc --noEmit` in `frontend/` clean.
- [ ] `npm run build` succeeds; the emitted `spa-dist/assets/index-*.css` no longer contains inline `#c44`, `#22c55e88`, `#ef444488`.
- [ ] `data-dsc-theme="operator"` on the document has no visible effect vs no attribute (default). Missing attribute = operator.
