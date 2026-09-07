# DSC — brand identity

> Draft, 2026-09-06. Extends `.superdesign/design-system.md` and `frontend/DESIGN-TOKENS.md`.
> PD anchor deferred: `plausible-deniability.net` was unreachable at drafting; every claim tagged `[needs-PD-verification]` waits on a real look at the site before it firms up.

## Positioning

**DSC** is the operator brain and dashboard for small, honest, closed-loop grow rooms — a Plausible Deniability project. It reads sensors, decides, and shows you the truth about what the room is doing. Not a lifestyle app, not a wall of gauges pretending to be data.

**One line:** *DSC runs the room and tells the truth about it.*

## Voice

Three adjectives: **calm · exact · honest**.

| We say                                                    | We don't say                                     |
| --------------------------------------------------------- | ------------------------------------------------ |
| "Twin off — photoperiod window (18h/6h)"                  | "Optimising your grow environment ✨"             |
| "Held reading — probe 2 offline since 03:14"              | "Sensor error"                                   |
| "Waiting for brain to confirm hold"                       | "Please wait…"                                   |
| "Simulated room — no live probes attached"                | "Demo mode"                                      |
| "Learning off. Update to accept 18h → 12h flip on Sunday" | "AI-powered recommendations"                     |
| "Not enough data"                                         | "N/A" / "—" with no context                      |

Copy rules:
- Every state label answers *what · process · expected* in that order when space allows.
- Never fake liveness. Blank/held/stale readings are labeled, not smoothed over.
- Prefer imperative + noun in CTAs ("Update photoperiod", "Hold twin off") over generic verbs ("Save", "Apply").
- Probe/Plant language everywhere in operator chrome. Never Seat/POT.
- Numbers first, prose second. Units always shown. Percentages get a base ("42% of 24h").

## Visual principles

1. **Atmosphere over decoration.** Ambient washes, gradients, and the `dsc-stars` field are allowed and encouraged. Sensor-shaped theater (fake Sankeys, dial arrays that aren't reading anything) is banned. If a viz stops receiving data it becomes a labeled empty state, not a still frame.
2. **One accent per surface.** Grow surfaces teal, Live surfaces blue, Fleet surfaces purple, Root/soil warm. Never mix two accents inside a single card or gauge.
3. **Honesty over polish.** A held/stale/missing reading with a clear label reads more premium than a smoothed number. Contrast on public surfaces is non-negotiable.
4. **Density earns its space.** Operator chrome is dense on purpose. Public surfaces breathe. Same brand, opposite density.
5. **Motion settles, never bounces without reason.** `--dsc-ease` for placement, `--dsc-ease-spring` only for press-release. All motion respects `prefers-reduced-motion`.

## Palette roles (keep as-is)

The Phase 1 inventory confirmed the existing role mapping is intentional and consumed. Do not remap. Refine values only where contrast or PD alignment demands.

| Token           | Role                                            |
| --------------- | ----------------------------------------------- |
| `--dsc-black`   | App background (island + `.dsc-root`)           |
| `--dsc-black-2` | Raised panels, popovers                         |
| `--dsc-gray-2`  | Input / button fill                             |
| `--dsc-gray-3`  | Borders, table rules, dividers                  |
| `--dsc-gray-5`  | Muted text, labels, icons                       |
| `--dsc-white`   | Primary text                                    |
| `--dsc-teal`    | **Grow** accent, links, focus (canonical)       |
| `--dsc-blue`    | **Live** accent (main tab, 4x8 main segment)    |
| `--dsc-purple`  | **Fleet** accent (reassigned from Tune 2026-09) |
| `--dsc-neon`    | Tone `ok` (healthy, in-service, CTA fill)       |
| `--dsc-amber`   | Tone `warn` (out of band, pending decision)     |
| `--dsc-bad`     | Tone `bad` (failed, offline)                    |
| `--dsc-orange`  | Warm accent (rare — airflow viz)                |
| `--dsc-soil-*`  | Root/soil viz series (medium, moisture, wet)    |

Known collision, tracked: `--dsc-blue` and `--dsc-teal` are semantically distinct but have historically been aliased in call sites. Un-aliasing is `TH-P1-3` in `docs/FOLLOWUPS.md`; this pass does not un-do that, but proposes we stop introducing new call sites that treat them as interchangeable.

## Type system

- **Body / UI:** `--dsc-font` — `"Segoe UI", "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif`. Keep. IBM Plex Sans is the intended web fallback if Segoe isn't available.
- **Mono:** `--dsc-mono` — `"Cascadia Code", "IBM Plex Mono", ui-monospace, monospace`. Used for SURFACE stamps and code.
- **Display (proposed, `[needs-PD-verification]`):** For public surfaces only, a wider-tracked display face for hero and section headlines. Placeholder: `"IBM Plex Sans"` weight 300, `letter-spacing: -0.02em`. Reserve `--dsc-font-display` for this. Do not introduce on operator surfaces.
- **Scale:** existing `--dsc-fs-xs..lg` (11/12/13/14) covers helper/label/meta/body. Add a display scale for public surfaces only:
  - `--dsc-fs-h1: 44px` (public hero) `proposed`
  - `--dsc-fs-h2: 30px` (public section) `proposed`
  - `--dsc-fs-h3: 20px` (public card head) `proposed`
  - Operator surfaces do **not** use these — operator hierarchy comes from weight and color, not size.

## Motion policy

- Placement / entrance: `--dsc-ease` at `--dsc-dur-2` (220ms). Staggered by `--dsc-stagger-step` (34ms) when multiple.
- Press / release: `--dsc-ease-spring` at `--dsc-dur-1` (120ms). Only on user-driven affordances.
- Long transitions (drawer open, chart morph): `--dsc-dur-3` (360ms) with `--dsc-ease`.
- Everything above becomes `animation: none` under `prefers-reduced-motion: reduce`.
- `dsc-stars` and ambient gradients dim under `prefers-contrast: more`.
- `--dsc-ease-in-out` is currently defined-but-unused. Either delete it or wire it into the drawer/modal transitions; captured as a proposed cleanup.

## Do / Don't

**Do**
- `color: var(--dsc-white)` for body text on `--dsc-black` / `--dsc-black-2`.
- `border: 1px solid var(--dsc-gray-3)` for dividers and quiet borders.
- `background: var(--dsc-glass); border: 1px solid var(--dsc-glass-border)` for elevated panels over the star field.
- `color: var(--dsc-teal)` for grow-context links and primary CTAs on grow surfaces.
- Use `var(--dsc-teal, #26c6da)` fallback only when the CSS context can't guarantee the token cascade.

**Don't**
- Never `color: "#..."` inline in JSX style. Refer tokens through `var()` or through the ECharts `TOKEN_HEX` table in `frontend/src/viz/charts.tsx`.
- Never `fontSize: 11` inline. Use `var(--dsc-fs-sm)` — this includes ECharts config where the option supports CSS-valued strings.
- Never introduce a new `--dsc-danger`/`--dsc-surface`/`--dsc-text`-shaped alias. If a role needs a token, add it in `dsc.css`, do not smuggle it as a fallback.
- Never smooth over a stale reading with a decayed last-value. Label it "held" or "stale" and show the last-good timestamp.
- Never place a decorative gauge on a public surface. Public surfaces show data or say nothing.

## Wordmark & mark

Existing:
- Wordmark: **DSC — A Plausible Deniability Project** (em-dash preferred over hyphen for typographic tightness; `.superdesign/design-system.md` currently shows a hyphen — captured as a small cleanup).
- Mark: inline SVG `brand` key in `frontend/src/iconSvg.ts` — rounded square + droplet/leaf, stroke, `currentColor`.

Proposed:
- Publish the mark as a static SVG under `frontend/public/brand/` so public surfaces and external embeds can `<img src="/brand/dsc-mark.svg">` without the SPA runtime. `[needs-PD-verification]` on whether PD wants a matching mark or keeps its own.
- Reserve `--dsc-brand-ink: var(--dsc-white)` and `--dsc-brand-mark: var(--dsc-teal)` as semantic aliases so the mark can be recolored per surface without editing call sites. `proposed`.

## Open questions (for the operator)

1. Does PD want to keep its own visual identity and DSC-HUB simply nods to it, or should PD and DSC-HUB converge on one visible identity? The answer changes whether `themes/public.md` is a re-skin of DSC or a translation of PD.
2. Is a light-mode variant in scope, or is DSC dark-only forever? Currently drafted as an exploration in `themes/light-mode.md`, not a commitment.
3. Is `TH-P1-3` (un-aliasing `--dsc-blue` from `--dsc-teal` in call sites) something we want to fold into this pass, or keep deferred?
