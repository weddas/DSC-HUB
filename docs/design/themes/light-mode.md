# Theme — light mode (exploration)

> Draft, 2026-09-06. `status: exploration` — not a commitment, not a promise. This file exists to answer the question "can the token layer survive a light variant if we ever want one?" The answer is yes, with edits.

## Trigger (hypothetical)

`data-dsc-theme="light"` on the document root. Not shipped anywhere.

## Why explore

DSC's stated identity is dark. The operator SPA runs in low-light grow rooms; the star field, the glass panels, the deep contrast are all intentional. So the honest answer to "should DSC be light-mode too?" is: **probably not for the operator surface, possibly yes for one specific public-surface variant** (e.g. a print-friendly documentation page, a partner embed, an accessibility profile). Draft accordingly.

## Token overrides

### Surface flip

```css
[data-dsc-theme="light"] {
  --dsc-black:        #f4f6fb;   /* app background — soft off-white, not pure #fff */
  --dsc-black-2:      #eaeef5;   /* raised panel */
  --dsc-gray-1:       #eaeef5;
  --dsc-gray-2:       #dfe4ee;   /* input, button fill */
  --dsc-gray-3:       #c7cee0;   /* borders, dividers */
  --dsc-gray-5:       #58607a;   /* muted text — must stay AA on off-white */
  --dsc-muted:        #58607a;
  --dsc-white:        #12171f;   /* primary text — reuse the operator black-2 as ink */
  --dsc-glass:        rgba(255, 255, 255, 0.82);
  --dsc-glass-border: rgba(199, 206, 224, 0.65);
}
```

Contrast checks (must pass for the exploration to be worth pursuing):

- `#12171f` on `#f4f6fb` = 15.9:1 (AAA) ✓
- `#58607a` on `#f4f6fb` = 6.7:1 (AA normal) ✓
- `#26c6da` on `#f4f6fb` = 2.1:1 — **fails AA for body text**. Link/accent teal must darken on light.

### Accent overrides (required)

Light-mode teal must darken to keep contrast:

```css
[data-dsc-theme="light"] {
  --dsc-teal:      #0e8ea3;   /* darker teal, AA on off-white */
  --dsc-teal-dim:  rgba(14, 142, 163, 0.35);
  --dsc-teal-glow: rgba(14, 142, 163, 0.42);
  --dsc-blue:      #2b6fd6;
  --dsc-purple:    #6b4fce;
  --dsc-neon:      #2f8a3e;
  --dsc-amber:     #b76f00;
  --dsc-bad:       #b3271f;
}
```

Recheck:
- `#0e8ea3` on `#f4f6fb` = 4.7:1 (AA normal) ✓
- `#2f8a3e` on `#f4f6fb` = 4.5:1 (AA normal) ✓
- `#b3271f` on `#f4f6fb` = 5.9:1 (AA normal) ✓

### Shadow / glass

```css
[data-dsc-theme="light"] {
  --dsc-shadow:       0 8px 24px rgba(24, 32, 52, 0.10);
  --dsc-shadow-tight: 0 2px 8px  rgba(24, 32, 52, 0.14);
}
```

### Star field

Off. Light mode with a parallax star field looks like a mistake. `.dsc-stars` hides under `[data-dsc-theme="light"]`.

## What this exploration surfaces

1. Every accent needs a darker light-mode value. The dark palette isn't a one-flip inversion. Any real light-mode landing has to duplicate every `--dsc-*-{dim,glow}` token as well.
2. The `viz/charts.tsx` `TOKEN_HEX` table currently caches CSS var resolutions on first load. A theme switch at runtime would keep old hex until reload. If light mode is ever real, the chart color layer needs to invalidate on `data-dsc-theme` change.
3. Vessel and root viz colors probably need a light-mode remap too — soil browns on a light background can read as dirty rather than earthy.

## Recommendation

Do not ship light mode as an operator theme. If a partner or accessibility need surfaces one specific light-mode use case, revisit this file, refine the accent overrides against the actual usage, and ship it scoped to that one surface — never as a global toggle.
