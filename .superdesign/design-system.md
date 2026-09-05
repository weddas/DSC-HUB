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
| `#/live/overview` | Daily ops home — glance/dispatcher only, links out to the owning desk (does not duplicate full detail widgets) |
| `#/live/mission` | Alerts / Triage — promoted, first-class surface for "something's wrong, what do I do" |
| `#/live/climate` | Climate Want/Got — owns all band gauges, trends, efficacy, clone-mode control |
| `#/live/root` | Root / irrigation — owns all probe/moisture detail |
| `#/live/light` | Photoperiod / DLI — owns all photoperiod detail |
| `#/grow/roster` | Plant roster |
| `#/fleet` | Kit inventory, Learning (folded in from the retired Tune tab), Calibrate |
| `#/settings/*` | Hub / brain / device |
| `#/ops/home` | Legacy Dash dump — retired from nav (2026-09-05), still reachable by URL for old links/bookmarks. Do not add new content here; use Overview or Mission. |

`/live/twin` (3D Twin) was cut 2026-09-05 — it duplicated Root's probe/moisture data with worse legibility and was the one surface that ignored this component library. Old links redirect to Overview.

## Branding

- Wordmark line: **DSC - A Plausible Deniability Project.**
- Mark: rounded square + droplet/leaf (stroke, currentColor). Source: inline SVG key `brand` in `frontend/src/iconSvg.ts` (rendered via `Icon name="brand"`).
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
| `--dsc-blue` / `--dsc-teal` | `#26c6da` | Brand / Live accent (blue), Grow accent + teal buttons/icons (teal). **Known issue:** these two tokens are byte-identical today (`TH-P1-3` in `docs/qa/THEME-AUDIT-7.1.md`) — Live and Grow primary tabs are only visually distinct by label, not color. Un-aliasing them into two real colors is a deliberately deferred follow-up (touches every teal/blue call site — needs its own visual QA pass, not bundled into an IA/routing change). |
| `--dsc-blue-dim` | `rgba(38, 198, 218, 0.4)` | Tab/border glow |
| `--dsc-purple` | `#a78bfa` | Fleet section (reassigned 2026-09-05 when Tune folded into Fleet; was Tune's accent) |
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
- Brand row (mark 36px + title | SURFACE) → optional demo banner → honesty rail → primary tabs (Live Grow Fleet Settings) → secondary tabs → page.
- Live secondary: Overview, Climate, 4×8, 2×4, Root, Light, Mission (promoted — no longer demoted).
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

## Status tone vocabulary (`StatusChip` `tone` prop — closed meanings)

This is the acceptance test for every `<StatusChip>`/`ArcGauge` honesty-review pass. Before
this doc, `tone="ok"` had drifted to mean "a value exists" in some call sites instead of
"verified good" — that ambiguity is exactly what let fake-looking-live bugs ship. From
2026-09-05 on, each tone has exactly one meaning; if a call site doesn't fit one, it's `muted`,
not a default `"ok"`.

| Tone | Means | Does **not** mean |
|---|---|---|
| `ok` | The value was checked against a target/band/condition and is currently good (in band, online, succeeded, in service). | "A number came back" / "the entity resolved" / "this is just what the setting is set to." A plain informational read (a select's current value, a runtime-hours counter, a config choice) is never `ok` on that basis alone. |
| `warn` | Drifting toward an edge, or a soft violation that isn't yet critical (e.g. "buying heat," "no schedule"). | A permanent/expected state — if it's always going to show `warn` in normal operation, it should be `muted` or the check should be removed. |
| `bad` | A verified violation, fault, or offline/unavailable condition that needs attention. | Absence of data by itself — no data is `muted` with a "—" label, not `bad`, unless the *absence itself* is the fault (e.g. hub offline). |
| `muted` | Informational display: a value exists and is neither being judged nor currently actionable (a select's current mode, a cycle count, a runtime total, "no data"). | This is the correct default when in doubt — never reach for `ok` just because something rendered. |

Fixed under this spec 2026-09-05: `select.dsc_hub_grow_stage` / `select.dsc_hub_clone_mode`
chips (`components/DashHomeSections.tsx`) and the per-entity "Today Xh" runtime chip
(`components/EntityInspector.tsx`) were hardcoded `tone="ok"` regardless of value — all three
are pure informational reads and are now `muted`, matching their sibling chips.

## Card titles & HelpTip placement (house rules)

- **Card titles**: prefer a short label (1–3 words: "Bands," "Running," "Kit Pulse"). Reserve a
  longer explanatory title for a card whose whole point *is* an honesty callout (e.g. Climate's
  "Efficacy · buying kW because the lung could not transfer") — that's the exception, not the
  default. Don't retrofit existing titles for this alone; apply the rule to new cards and drift
  the rest over time.
- **HelpTip placement**: put it in the card/section header actions (next to the title), not
  inline mid-row or trailing after a chip strip. New call sites should follow the header
  placement; existing inline/trailing ones (`pages/ClimatePage.tsx`, `components/HubLinkLine.tsx`,
  `pages/OverviewPage.tsx`, others) are not a blocking rewrite.
- **Light theme**: there isn't one, and that's a deliberate choice, not an oversight — the fixed
  dark "void" palette is the mission-control aesthetic. `prefers-color-scheme` is intentionally
  unhandled. Revisit only if that decision is explicitly reopened.

## Reproduction vs variation

- Ground-truth drafts must match current chrome and Dash dump structure.
- New-style branches may change hierarchy, density, and contrast **inside this palette and type**. Do not invent serif display fonts, pink/purple marketing gradients, or generic SaaS dashboards.
