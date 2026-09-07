# DSC — token reference

> Draft, 2026-09-06. Extends `frontend/DESIGN-TOKENS.md` and mirrors `frontend/src/styles/dsc.css` `:root, :host, .dsc-root` block.
> Everything marked `proposed` is a Phase 5 candidate and does not exist in the shipped `dsc.css` today.

Every `--dsc-*` custom property below is either (a) shipped in `dsc.css` and consumed somewhere in `frontend/src/`, or (b) marked `proposed` and gated on operator approval before landing.

The canonical export is [`tokens.json`](./tokens.json) — flat map for consumption by external surfaces (PD-family public pages, external dashboards, future Playground/HA panel embeds).

## Cascade contract

Tokens are declared on **three** selectors so no mount surface can lose the cascade:

- `:root` — island SPA document (`:8787`)
- `:host` — Home Assistant panel shadow root (retired 2026-09, kept as safety)
- `.dsc-root` — active wrapper div rendered by `DscRoot` in `ParallaxStars.tsx`

External surfaces that want the token layer need to set `data-dsc-theme="operator"` (or `"public"`) on their document root and import the theme's `.css` file — see [`themes/operator.md`](./themes/operator.md) and [`themes/public.md`](./themes/public.md).

## Color — surfaces

| Token             | Value                       | Role                                                  | Status |
| ----------------- | --------------------------- | ----------------------------------------------------- | ------ |
| `--dsc-black`     | `#0b0e14`                   | App background                                        | live   |
| `--dsc-black-2`   | `#12171f`                   | Raised panel, popover                                 | live   |
| `--dsc-gray-1`    | `#12171f`                   | Alias of `--dsc-black-2` (card gradient, row zebra)   | live   |
| `--dsc-gray-2`    | `#1a2230`                   | Input, button fill                                    | live   |
| `--dsc-gray-3`    | `#243044`                   | Border, divider, table rule                           | live   |
| `--dsc-gray-4`    | `#8b95a8`                   | Alias of `--dsc-gray-5`                               | **dead** — unused outside `dsc.css` |
| `--dsc-gray-5`    | `#8b95a8`                   | Muted text, label, icon                               | live   |
| `--dsc-muted`     | `#8b95a8`                   | Alias of `--dsc-gray-5` for prose                     | live   |
| `--dsc-white`     | `#e8eef8`                   | Primary text                                          | live   |
| `--dsc-glass`     | `rgba(18, 23, 31, 0.78)`    | Glass card fill                                       | live   |
| `--dsc-glass-border` | `rgba(36, 48, 68, 0.55)` | Glass card border                                     | live   |

## Color — accents

| Token             | Value                            | Role                                                | Status |
| ----------------- | -------------------------------- | --------------------------------------------------- | ------ |
| `--dsc-teal`      | `#26c6da`                        | **Grow** accent, links, focus                       | live   |
| `--dsc-teal-dim`  | `rgba(38, 198, 218, 0.45)`       | Teal border, subtle accent                          | live   |
| `--dsc-teal-glow` | `rgba(38, 198, 218, 0.55)`       | Teal glow (focus, active tab)                       | live   |
| `--dsc-blue`      | `#4f9dff`                        | **Live** accent (Live tab, 4x8 main segment)        | live   |
| `--dsc-blue-dim`  | `rgba(79, 157, 255, 0.4)`        | Blue border, glow                                   | live   |
| `--dsc-purple`    | `#a78bfa`                        | **Fleet** accent                                    | live   |
| `--dsc-purple-dim`| `rgba(167, 139, 250, 0.35)`      | Purple border                                       | live   |
| `--dsc-neon`      | `#66bb6a`                        | Tone `ok`, CTA fill                                 | live   |
| `--dsc-neon-dim`  | `rgba(102, 187, 106, 0.32)`      | Neon border                                         | live   |
| `--dsc-neon-glow` | `rgba(0, 230, 118, 0.4)`         | Neon glow                                           | **dead** — unused outside `dsc.css` |
| `--dsc-amber`     | `#ffb74d`                        | Tone `warn`                                         | live   |
| `--dsc-amber-dim` | `rgba(255, 183, 77, 0.45)`       | Amber border, banner glow                           | **proposed** — captures inline rgba in `TankCutaway`, `DemoBanner` |
| `--dsc-orange`    | `#ff8a65`                        | Warm accent (airflow)                               | live   |
| `--dsc-bad`       | `#ef5350`                        | Tone `bad`, offline, failed                         | live   |
| `--dsc-bad-dim`   | `rgba(239, 83, 80, 0.4)`         | Bad border, subtle alert                            | **proposed** — captures `#ef444488` in `BandChartHost` |
| `--dsc-bad-soft`  | `#ef5350`                        | Alias of `--dsc-bad`                                | **dead** — unused |

## Color — domain (soil / root)

| Token         | Value      | Role                          | Status |
| ------------- | ---------- | ----------------------------- | ------ |
| `--dsc-soil-1`| `#5b9f6b`  | Root viz — living medium      | live (consumed in `lib/vesselSpec.ts`) |
| `--dsc-soil-2`| `#4a8f9f`  | Root viz — moisture           | live (`lib/vesselSpec.ts`) |
| `--dsc-soil-3`| `#c4a35a`  | Root viz — dry medium         | live (`lib/vesselSpec.ts`) |
| `--dsc-soil-4`| `#8d6e63`  | Root viz — coco / substrate   | live (`lib/vesselSpec.ts`) |

## Color — vessels (proposed)

Vessel/tank SVGs currently hardcode custom rgba values (`vesselSpec.ts`, `TankCutaway.tsx`, `KitPulse.tsx`). Propose a small domain token pack so the vessel viz layer can be re-skinned per theme without editing `.tsx` files.

| Token                | Value                       | Role                          | Status |
| -------------------- | --------------------------- | ----------------------------- | ------ |
| `--dsc-vessel-fabric`| `rgba(180, 210, 190, 0.85)` | Fabric pot silhouette         | proposed |
| `--dsc-vessel-plastic`| `rgba(160, 190, 170, 0.9)` | Plastic pot silhouette        | proposed |
| `--dsc-vessel-water` | `rgba(120, 210, 230, 0.95)` | Water level fill              | proposed |
| `--dsc-vessel-teal-fill` | `rgba(38, 198, 218, 0.22)` | Tank teal fill (was inline) | proposed |
| `--dsc-vessel-teal-hint` | `rgba(38, 198, 218, 0.12)` | Kit pulse teal (was inline) | proposed |

## Color — semantic aliases (proposed)

Semantic aliases let the wordmark, mark, and cross-surface components be recolored per theme without hunting through call sites.

| Token              | Default (operator)  | Role                                   | Status |
| ------------------ | ------------------- | -------------------------------------- | ------ |
| `--dsc-brand-ink`  | `var(--dsc-white)`  | Wordmark text, primary display text    | proposed |
| `--dsc-brand-mark` | `var(--dsc-teal)`   | Mark stroke, brand-accent hairline     | proposed |
| `--dsc-link`       | `var(--dsc-teal)`   | Links (kept teal on operator)          | proposed |
| `--dsc-focus-ring` | `var(--dsc-teal-glow)` | Focus outline glow                  | proposed |

## Color — shadow root escape hatches (dead/reject)

The Phase 1 scan found several `--dsc-*` fallbacks referenced in components but never declared. Each is a bug: the fallback silently masks the missing declaration. Do not add these to `dsc.css` — instead, fix the call site.

| Token (referenced)   | Where                    | Fix                                              |
| -------------------- | ------------------------ | ------------------------------------------------ |
| `--dsc-danger`       | `pages/SetupPage.tsx`    | Rename usage to `--dsc-bad`                      |
| `--dsc-green`        | `viz/charts.tsx`         | Delete from `TOKEN_HEX`; use `--dsc-neon`        |
| `--dsc-green-dim`    | `viz/charts.tsx`         | Delete from `TOKEN_HEX`; use `--dsc-neon-dim`    |
| `--dsc-border`       | (referenced) `#3a4452`   | Rename usage to `--dsc-gray-3`                   |
| `--dsc-muted-fg`     | (referenced) `#94a3b8`   | Rename usage to `--dsc-gray-5`                   |
| `--dsc-surface`      | (referenced) `#12141a`   | Rename usage to `--dsc-black-2`                  |
| `--dsc-text`         | (referenced) `#eef1f8`   | Rename usage to `--dsc-white`                    |
| `--dsc-journal-row-height`     | Journal browser | Declare as `40px` if used; otherwise delete    |
| `--dsc-journal-visible-rows`   | Journal browser | Declare as `3` if used; otherwise delete       |

## Typography

| Token              | Value                                                                                | Role                          | Status |
| ------------------ | ------------------------------------------------------------------------------------ | ----------------------------- | ------ |
| `--dsc-font`       | `"Segoe UI", "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif`                 | Body / UI                     | live   |
| `--dsc-mono`       | `"Cascadia Code", "IBM Plex Mono", ui-monospace, monospace`                         | Code, SURFACE stamp           | live   |
| `--dsc-font-display` | `"IBM Plex Sans", ui-sans-serif, system-ui, sans-serif` (weight 300, `letter-spacing: -0.02em`) | Public-surface hero / section headline | **proposed** — public only |
| `--dsc-fs-xs`      | `11px`                                                                               | Tiny helper text              | live   |
| `--dsc-fs-sm`      | `12px`                                                                               | Small text (most-used)        | live   |
| `--dsc-fs-md`      | `13px`                                                                               | Label, secondary body         | live   |
| `--dsc-fs-lg`      | `14px`                                                                               | Body base, card head          | live   |
| `--dsc-fs-h3`      | `20px`                                                                               | Public card headline          | **proposed** — public only |
| `--dsc-fs-h2`      | `30px`                                                                               | Public section headline       | **proposed** — public only |
| `--dsc-fs-h1`      | `44px`                                                                               | Public hero headline          | **proposed** — public only |

## Geometry

| Token              | Value                              | Role                          | Status |
| ------------------ | ---------------------------------- | ----------------------------- | ------ |
| `--dsc-radius`     | `10px`                             | Card, input, button           | live   |
| `--dsc-radius-lg`  | `14px`                             | Large glass panel             | live   |
| `--dsc-radius-full`| `9999px`                           | Chip, pill                    | **proposed** — captures ad-hoc `border-radius: 9999px` |
| `--dsc-shadow`     | `0 8px 24px rgba(0, 0, 0, 0.45)`   | Elevated drop                 | live   |
| `--dsc-shadow-tight`| `0 2px 8px rgba(0, 0, 0, 0.55)`   | Subtle elevation              | live   |

## Spacing (proposed)

`frontend/src/**/*.tsx` has ~60 unique inline `gap` / `padding` / `margin` values ranging 4-24px. Propose a 4px-based scale so operator + public surfaces share rhythm.

| Token           | Value  | Suggested use                    | Status |
| --------------- | ------ | -------------------------------- | ------ |
| `--dsc-space-1` | `4px`  | Micro-gap (icon + text)          | proposed |
| `--dsc-space-2` | `8px`  | Standard gap (chip row, buttons) | proposed |
| `--dsc-space-3` | `12px` | Card inner padding, banner gap   | proposed |
| `--dsc-space-4` | `16px` | Section gap, card outer margin   | proposed |
| `--dsc-space-5` | `24px` | Row separator, section rhythm    | proposed |
| `--dsc-space-6` | `40px` | Public-surface section rhythm    | proposed |

## Motion

| Token                | Value                                    | Role                       | Status |
| -------------------- | ---------------------------------------- | -------------------------- | ------ |
| `--dsc-ease`         | `cubic-bezier(0.22, 1, 0.36, 1)`         | Placement / entrance settle| live   |
| `--dsc-ease-in-out`  | `cubic-bezier(0.65, 0, 0.35, 1)`         | Standard in-out            | **dead** — defined but never used |
| `--dsc-ease-spring`  | `cubic-bezier(0.34, 1.4, 0.64, 1)`       | Press / release            | live   |
| `--dsc-dur-1`        | `120ms`                                  | Fast transition            | live   |
| `--dsc-dur-2`        | `220ms`                                  | Medium transition          | live   |
| `--dsc-dur-3`        | `360ms`                                  | Slow transition (drawer, chart morph) | live |
| `--dsc-stagger-step` | `34ms`                                   | Stagger step               | live   |

## `.dsc-root` scoped (star field)

Live in `.dsc-root` only — do not promote to `:root`.

| Token              | Value                                                | Role                          | Status |
| ------------------ | ---------------------------------------------------- | ----------------------------- | ------ |
| `--dsc-stars-far`  | `color-mix(in srgb, var(--dsc-white) 38%, transparent)` | Distant star layer         | live   |
| `--dsc-stars-mid`  | `color-mix(in srgb, var(--dsc-teal)  42%, transparent)` | Mid star layer             | live   |
| `--dsc-stars-near` | `color-mix(in srgb, var(--dsc-white) 62%, transparent)` | Near star layer            | live   |
| `--dsc-stars-speed`| `0.4`                                                | Parallax base speed           | live (default in keyframe calc) |

## Ordering when consuming from an external surface

If a public site imports the token layer alongside its own CSS reset:

1. Import `themes/operator.css` (or `themes/public.css`) **before** any component CSS.
2. Add `data-dsc-theme="operator"` (or `"public"`) to the document root.
3. Wrap the app in a `.dsc-root` div only if you want the star field. Public surfaces should skip it — the wash is atmospheric, not a public-hero look.
4. Fonts (`Segoe UI`, `IBM Plex Sans`, `Cascadia Code`, `IBM Plex Mono`) are declared but not `@font-face`-loaded — public surfaces must load them via `@fontsource/*` or Google Fonts before mount.

## Consumer-side JS access

The token layer is CSS-first. When JS needs a resolved hex (charts, canvas, WebGL), use the pattern in `frontend/src/viz/charts.tsx`:

```ts
const TOKEN_HEX = {
  teal:   getCssVar("--dsc-teal",   "#26c6da"),
  neon:   getCssVar("--dsc-neon",   "#66bb6a"),
  amber:  getCssVar("--dsc-amber",  "#ffb74d"),
  bad:    getCssVar("--dsc-bad",    "#ef5350"),
  gray3:  getCssVar("--dsc-gray-3", "#243044"),
  gray5:  getCssVar("--dsc-gray-5", "#8b95a8"),
  white:  getCssVar("--dsc-white",  "#e8eef8"),
  orange: getCssVar("--dsc-orange", "#ff8a65"),
  purple: getCssVar("--dsc-purple", "#a78bfa"),
};
```

Remove `--dsc-green` / `--dsc-green-dim` from that table (they alias nothing).
