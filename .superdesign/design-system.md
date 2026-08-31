# DSC Hub — design system

Operator SPA for a two-tent grow kit (4×8 flower + 2×4 clone/veg). Product path is ESPHome hub/panel/probes plus Pi DSC-Brain. Home Assistant is optional lab soak, not source of truth.

## Product context / JTBD

- Operator sees **Want → Got → Need → act**. Gauges, chips, and labels must match real Light / Climate / Root state — no blank WebGL, fake Sankey, or status collage that looks live when it is not.
- Language is **Probe / Plant** only (never Seat / POT in chrome). Expected / calendar stage is not live plant state.
- Live kit probes are 1–2. pot3/4 are retired from the kit.
- Honesty rail is first-class: missing sensors, offline hub, demo mode must be visible.

## Key surfaces

| Route | Role |
|---|---|
| `#/live/overview` | Daily ops home |
| `#/ops/home` | Legacy Dash dump (this design target) — Lovelace-parity collage |
| `#/live/climate` | Climate Want/Got |
| `#/live/root` | Root / irrigation |
| `#/live/light` | Photoperiod / DLI |
| `#/grow/roster` | Plant roster |
| `#/fleet` | Kit inventory |
| `#/settings/*` | Hub / brain / device |

## Branding

- Wordmark line: **DSC - A Plausible Deniability Project.**
- Mark: rounded square + droplet/leaf (stroke, currentColor). Source: `homeassistant/custom_components/dsc_hub/www/assets/brand/dsc-brand-mark.svg`.
- Logo must render as the real mark in the brand row — never initials, emoji, or invented SVG.

## Color (CSS variables — use these exact values)

| Token | Value | Use |
|---|---|---|
| `--dsc-black` | `#0b0e14` | Page / document bg |
| `--dsc-black-2` / `--dsc-gray-1` | `#12171f` | Panel / glass base |
| `--dsc-gray-2` | `#1a2230` | Raised surface |
| `--dsc-gray-3` | `#243044` | Borders / lines |
| `--dsc-gray-4` / `--dsc-gray-5` | `#8b95a8` | Muted text (`.dsc-muted`) |
| `--dsc-white` | `#e8eef8` | Primary text |
| `--dsc-blue` / `--dsc-teal` | `#26c6da` | Brand / Live accent, teal buttons, icons |
| `--dsc-blue-dim` | `rgba(38, 198, 218, 0.4)` | Tab/border glow |
| `--dsc-purple` | `#a78bfa` | Tune section |
| `--dsc-neon` | `#66bb6a` | OK / in-band / brand SVG fallback |
| `--dsc-orange` | `#ff8a65` | Warn / action |
| `--dsc-amber` | `#ffb74d` | Demo banner / caution |
| `--dsc-bad` | `#ef5350` | Alert / out of band |
| `--dsc-glass` | `rgba(18, 23, 31, 0.78)` | Card fill |
| `--dsc-glass-border` | `rgba(36, 48, 68, 0.55)` | Card stroke |
| `--dsc-shadow` | `0 8px 24px rgba(0, 0, 0, 0.45)` | Elevation |
| `--dsc-radius` | `10px` | Cards / chips |
| `--dsc-radius-lg` | `14px` | Larger panels |

Page wash: radial cyan glows on `#0b0e14` (see `.dsc-root`).

`--dsc-muted` is referenced in CSS but **not declared** — treat muted as `--dsc-gray-5`.

## Type

- UI: `"Segoe UI", "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif`
- Mono / SURFACE stamp: `"Cascadia Code", "IBM Plex Mono", ui-monospace, monospace`
- Page title: strong, ~1.35rem. Card titles: 0.72–0.8rem, tracked, teal icon 14px.
- Brand title: 1.05rem / 700 / 0.04em tracking.
- SURFACE version: 12px, 0.08em tracking, muted.

## Layout

- Shell max-width 1600px, padding 16×20×28, column flex.
- Brand row (mark 36px + title | SURFACE) → optional demo banner → honesty rail → primary tabs (Live Grow Tune Fleet Settings) → secondary tabs → page.
- Live secondary: Overview, Climate, 4×8, 2×4, Root, Light, then demoted Twin / Mission / Dash (Legacy).
- Dash Home (`/ops/home`) is a **vertical dump**: PageHeader → now-strip chips → cannalib tiles → banners → alerts → ESP chips → hub link → running/fan chips → grow log + narrator → operational now → band gauges → CFM/lung + air path → today → roster + kit pulse → root/tank.
- Cards: `.dsc-card` glass, radius 10, shadow. KPI tiles in chip-rows. 2-col grid collapses at narrow width.
- Buttons: `.dsc-btn` dark pill; `.primary` cyan fill; `.teal` cyan outline.

## Motion

- Honesty / duty chips: pulse, breathe, glow, fan-spin — only when the bound entity is actually on/live.
- Boot bar: teal→neon→blue indeterminate (respect `prefers-reduced-motion`).
- Page wash: parallax pixel-star layers behind the shell (`ParallaxStars`). Decorative atmosphere only — not a live sensor viz. Frozen under `prefers-reduced-motion`.
- Do not animate empty gauges to look alive.

## Honesty rules (non-negotiable)

- Missing / unavailable / unknown → "—" or explicit gap chip, never a fake number.
- Stale held readings → `HELD` tag + muted tone.
- Demo mode → amber banner "Simulated room".
- Probe/Plant language only.

## Reproduction vs variation

- Ground-truth drafts must match current chrome and Dash dump structure.
- New-style branches may change hierarchy, density, and contrast **inside this palette and type**. Do not invent serif display fonts, pink/purple marketing gradients, or generic SaaS dashboards.
