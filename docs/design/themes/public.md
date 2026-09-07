# Theme — public (PD-family surface)

> Draft, 2026-09-06. Anchor `[needs-PD-verification]` — every claim about matching `plausible-deniability.net` is a placeholder until the real site is inspected.
> Consumes [`../tokens.md`](../tokens.md).

## Trigger

`data-dsc-theme="public"` on the document root. Pair with an import of `themes/public.css` (to be extracted from `dsc.css` — currently everything is bundled in the operator sheet).

## Intent

DSC-HUB is dense on purpose. The public surface is the opposite: quiet, high contrast, one thing per screen. Same tokens, different assignments.

Where operator says "give me every reading in a small font", public says "one honest sentence, one gauge, one CTA".

## Token overrides

The `public` theme is a **remapping** of existing tokens, not a new palette. Everything below overrides via `[data-dsc-theme="public"]` selector — the base `dsc.css` declarations stay untouched.

### Surface (still dark, less pigment)

```css
[data-dsc-theme="public"] {
  --dsc-black:        #0d1117;   /* subtle lift from #0b0e14 — reads less clinical */
  --dsc-black-2:      #161c26;
  --dsc-glass:        rgba(22, 28, 38, 0.72);
  --dsc-glass-border: rgba(48, 62, 88, 0.5);
}
```

`[needs-PD-verification]` — if PD is a light surface, the whole block above flips. See `light-mode.md` for the parallel exploration.

### Accent (dial down noise)

Public surfaces get **one** accent per page. Teal remains the primary — grow context is DSC's core. Live blue and Fleet purple are operator-only. Do not import them into public without cause.

```css
[data-dsc-theme="public"] {
  --dsc-link:       var(--dsc-teal);
  --dsc-brand-ink:  var(--dsc-white);
  --dsc-brand-mark: var(--dsc-teal);
}
```

### Type (display scale kicks in)

```css
[data-dsc-theme="public"] {
  /* Load @fontsource/ibm-plex-sans weights 300, 400, 600 in the public page shell. */
  --dsc-font-display: "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;
}
[data-dsc-theme="public"] h1 { font: 300 var(--dsc-fs-h1)/1.1 var(--dsc-font-display); letter-spacing: -0.02em; }
[data-dsc-theme="public"] h2 { font: 300 var(--dsc-fs-h2)/1.2 var(--dsc-font-display); letter-spacing: -0.01em; }
[data-dsc-theme="public"] h3 { font: 600 var(--dsc-fs-h3)/1.3 var(--dsc-font); }
[data-dsc-theme="public"] p  { font: 400 var(--dsc-fs-lg)/1.55 var(--dsc-font); color: var(--dsc-white); }
[data-dsc-theme="public"] small,
[data-dsc-theme="public"] .meta { font: 400 var(--dsc-fs-sm)/1.5 var(--dsc-font); color: var(--dsc-gray-5); }
```

Contrast check:
- `#e8eef8` on `#0d1117` = 15.4:1 (AAA) — passes for body and hero. ✓
- `#8b95a8` on `#0d1117` = 6.1:1 (AA large; AA normal for `≥18px`) — meta text only. ✓
- `#26c6da` on `#0d1117` = 8.7:1 (AAA large; AA normal) — headline + link. ✓

### Spacing (breathes)

```css
[data-dsc-theme="public"] section { padding-block: var(--dsc-space-6); }
[data-dsc-theme="public"] .container { max-width: 960px; margin-inline: auto; padding-inline: var(--dsc-space-4); }
[data-dsc-theme="public"] .card-row { gap: var(--dsc-space-5); }
```

`--dsc-space-6` (40px) is the public rhythm; operator never uses it.

### Motion (calmer)

Public surfaces halve the motion vocabulary:

```css
[data-dsc-theme="public"] * {
  --dsc-dur-1: 100ms;
  --dsc-dur-2: 180ms;
  --dsc-dur-3: 300ms;
}
```

No spring easing on public — everything settles with `--dsc-ease`. The spring feels playful and doesn't match "honest" tone.

## Component reassignments

- **Star field:** off. Public hero uses a single soft radial wash (see below), not the 3-layer parallax. The star field is a signature of the operator SPA and shouldn't leak out.
- **Cards:** solid variant only. No glass — the blur reads as chrome-y on a public page. `background: var(--dsc-black-2)`, `border: 1px solid var(--dsc-gray-3)`.
- **Chips:** neutral / ok / warn / bad only. No accent-family chips (grow/live/fleet) on public.
- **Buttons:** primary + link only. No danger, no ghost — public pages don't destroy data.
- **Honesty rail:** replaced by a compact `Last verified 03:14` mono-font stamp in the page footer. If a public page shows a number, it timestamps that number.
- **Gauges:** allowed, but at most one per page. No dashboards on public.

## Hero pattern

```html
<section class="hero" data-dsc-theme="public">
  <div class="wash" aria-hidden="true"></div>
  <div class="container">
    <p class="eyebrow">Grow room brain</p>
    <h1>The room runs itself. You see the truth about it.</h1>
    <p class="lede">
      DSC is the operator brain and dashboard for small, closed-loop grow rooms.
      It reads sensors, decides, and tells you what it did.
    </p>
    <a class="cta" href="/get">Read the docs →</a>
    <p class="meta">Last verified 03:14 UTC</p>
  </div>
</section>
```

Styles for the wash:

```css
.hero .wash {
  position: absolute; inset: 0; z-index: -1;
  background:
    radial-gradient(ellipse 900px 500px at 20% 20%, color-mix(in srgb, var(--dsc-teal) 12%, transparent), transparent 60%),
    radial-gradient(ellipse 700px 400px at 90% 10%, color-mix(in srgb, var(--dsc-white) 4%, transparent), transparent 55%);
}
```

Same brand atmosphere as `.dsc-stars`, none of the motion.

## Copy voice on public

Match `brand.md` — calm, exact, honest. Two extra rules for public specifically:

- Never marketing verbs. No "empower", "optimize", "seamless".
- Numbers with base. "42% of 24h" not "42%".
- CTAs read as intent, not verbs. "Read the docs" not "Learn more". "See a room" not "View demo".

## Findings for the tracker

- Public surface currently has no dedicated stylesheet — `dsc.css` bundles everything. Extract `themes/operator.css` and `themes/public.css` at build time so a public page doesn't ship the operator chrome.
- No `@font-face` declarations in `dsc.css` — public surface loading `IBM Plex Sans` needs `@fontsource/ibm-plex-sans` or a Google Fonts link, or the display face silently falls back.
- No favicon / logo file exists yet under `frontend/public/brand/` — public surfaces have nothing to embed. Add.
