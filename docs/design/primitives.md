# DSC — primitives

> Draft, 2026-09-06. Reusable UI primitives keyed to [`tokens.md`](./tokens.md). Existing implementations live under `frontend/src/components/` (notably `ui.tsx` and `chrome.tsx`) — this doc specifies the intended shape; discrepancies with shipped code are captured as findings, not silent edits.

Rules that apply to every primitive:

- **No raw hex** in the component. Use `var(--dsc-…)` or the `TOKEN_HEX` table for ECharts.
- **No raw `fontSize` px** in JSX style. Use `var(--dsc-fs-*)` — including ECharts config where the option accepts CSS strings.
- **Focus ring:** `outline: 2px solid var(--dsc-focus-ring)` `outline-offset: 2px`. Never `outline: none` without an explicit replacement.
- **Disabled state:** `opacity: 0.55` `cursor: not-allowed` `pointer-events: none`. Never hide by graying color alone — the affordance must read as inert.
- **Motion:** enter/place with `var(--dsc-ease) var(--dsc-dur-2)`, press with `var(--dsc-ease-spring) var(--dsc-dur-1)`, all subject to `prefers-reduced-motion`.
- **Contrast:** every foreground/background pair listed passes WCAG AA for body text (4.5:1) against the stated surface; hero display text on public surfaces passes AAA (7:1).

## Button

Sizes: `sm` (28px), `md` (36px, default), `lg` (44px). Padding scales with `--dsc-space-2` / `--dsc-space-3` / `--dsc-space-4`.

| Variant     | Background            | Text                | Border                          | Hover                                 |
| ----------- | --------------------- | ------------------- | ------------------------------- | ------------------------------------- |
| primary     | `var(--dsc-teal)`     | `var(--dsc-black)`  | none                            | shift bg to color-mix(teal 88%, white)|
| secondary   | `var(--dsc-gray-2)`   | `var(--dsc-white)`  | `1px solid var(--dsc-gray-3)`   | border → `var(--dsc-teal-dim)`        |
| ghost       | `transparent`         | `var(--dsc-white)`  | `1px solid transparent`         | bg → `rgba(255,255,255,0.04)`         |
| danger      | `var(--dsc-bad)`      | `var(--dsc-white)`  | none                            | shift bg to color-mix(bad 88%, black) |
| link        | `transparent`         | `var(--dsc-link)`   | none, underline on hover        | text → color-mix(teal 88%, white)     |

States:
- `default` → variant defaults above
- `hover` → variant hover row
- `focus-visible` → outline ring, no other change
- `active` → transform `translateY(1px)`, `--dsc-shadow-tight` sinks
- `disabled` → opacity 0.55, no hover/active

Loading: replace label with a 14px inline spinner (currentColor). Text is announced via `aria-live="polite"`.

## Chip / pill / tag

Height 22px, `--dsc-radius-full`, `padding: 0 var(--dsc-space-2)`, `font: var(--dsc-fs-sm)`.

| Variant       | Background                       | Text                  | Border                            | Use                              |
| ------------- | -------------------------------- | --------------------- | --------------------------------- | -------------------------------- |
| neutral       | `var(--dsc-gray-2)`              | `var(--dsc-gray-5)`   | `1px solid var(--dsc-gray-3)`     | Meta, category                    |
| ok            | `color-mix(neon 12%, transparent)`| `var(--dsc-neon)`    | `1px solid var(--dsc-neon-dim)`   | Healthy, in-service               |
| warn          | `color-mix(amber 12%, transparent)`| `var(--dsc-amber)`  | `1px solid var(--dsc-amber-dim)`  | Out of band, pending decision     |
| bad           | `color-mix(bad 12%, transparent)`| `var(--dsc-bad)`      | `1px solid var(--dsc-bad-dim)`    | Failed, offline                   |
| grow          | `color-mix(teal 12%, transparent)`| `var(--dsc-teal)`    | `1px solid var(--dsc-teal-dim)`   | Grow-context tag                  |
| live          | `color-mix(blue 12%, transparent)`| `var(--dsc-blue)`    | `1px solid var(--dsc-blue-dim)`   | Live-context tag                  |
| fleet         | `color-mix(purple 12%, transparent)`| `var(--dsc-purple)`| `1px solid var(--dsc-purple-dim)` | Fleet-context tag                 |
| held / stale  | `var(--dsc-gray-2)`              | `var(--dsc-gray-5)`   | `1px dashed var(--dsc-gray-3)`    | Held reading, stale, awaiting live|

`held` variant carries a dot prefix (⏸ or ✱) — the visual language of "we know this isn't live" is required, not decorative.

## Card / panel

Three flavors:

- **glass** (default over star field) — `background: var(--dsc-glass)`, `border: 1px solid var(--dsc-glass-border)`, `backdrop-filter: blur(6px)`, `box-shadow: var(--dsc-shadow)`.
- **solid** — `background: var(--dsc-black-2)`, `border: 1px solid var(--dsc-gray-3)`, no blur.
- **quiet** — `background: transparent`, `border: 1px solid var(--dsc-gray-3)`, used inside dense lists.

Padding: `var(--dsc-space-3)` inner (12px), `var(--dsc-space-4)` outer margin between cards. Radius: `var(--dsc-radius-lg)` (14px). Card head uses `var(--dsc-fs-lg)` weight 600, muted subtitle uses `var(--dsc-fs-sm)` `var(--dsc-gray-5)`.

Never nest glass inside glass — the blur stack reads as smudge. Nest solid inside glass, or drop back to quiet.

## Tab / segmented control

Existing implementation: `.dsc-primary-tabs`, `.dsc-tab--grow|live|fleet` (in `dsc.css`).

Rules:
- One accent per tab family. Grow → teal, Live → blue, Fleet → purple.
- Active tab: `border-bottom: 2px solid var(--dsc-{accent})`, `color: var(--dsc-{accent})`, `text-shadow: 0 0 12px var(--dsc-{accent}-glow)` for the grow variant only; other accents use `-dim` (no glow) to keep them from stealing focus.
- Inactive tab: `color: var(--dsc-gray-5)`, hover → `color: var(--dsc-white)`.
- Segmented control (tent segments, mode switches): `border-radius: var(--dsc-radius)`, active fill uses `color-mix({accent} 14%, transparent)` with a `1px solid var(--dsc-{accent}-dim)` border.

## Banner (demo / warn / error / info)

Existing implementation: `.dsc-demo-banner` in `dsc.css` (amber). Generalize:

| Variant | Background                             | Border                              | Icon color             | Use                              |
| ------- | -------------------------------------- | ----------------------------------- | ---------------------- | -------------------------------- |
| info    | `color-mix(teal 6%, transparent)`      | `1px solid var(--dsc-teal-dim)`     | `var(--dsc-teal)`      | "Learning off", policy notes     |
| demo    | `color-mix(amber 8%, transparent)`     | `1px solid var(--dsc-amber-dim)`    | `var(--dsc-amber)`     | Simulated room, no live probes   |
| warn    | `color-mix(amber 8%, transparent)`     | `1px solid var(--dsc-amber-dim)`    | `var(--dsc-amber)`     | Out of band, pending confirm     |
| error   | `color-mix(bad 8%, transparent)`       | `1px solid var(--dsc-bad-dim)`      | `var(--dsc-bad)`       | Brain offline, action failed     |

Padding `var(--dsc-space-3) var(--dsc-space-4)`, radius `12px`, icon 18px left, primary text `var(--dsc-fs-md)` `var(--dsc-white)`, secondary text `var(--dsc-fs-sm)` `var(--dsc-gray-5)`.

Never a modal for what a banner can carry. Never a banner for what a chip carries.

## Gauge / arc (ECharts only)

Per operator preference, no additional chart libraries. Arc gauges use `frontend/src/viz/charts.tsx` with `TOKEN_HEX`.

Spec:
- Track: `TOKEN_HEX.gray3` at 100% opacity, thickness 8px.
- Fill: accent hex from `TOKEN_HEX` (`teal` for grow, `blue` for live, `neon` for ok, `amber` for warn, `bad` for bad). Thickness 8px, `endCap: round`.
- Center label: `fontFamily: var(--dsc-font)`, `fontSize: 24`, `color: TOKEN_HEX.white`, `fontWeight: 600`.
- Sub label: `fontSize: 11 → var(--dsc-fs-xs)`, `color: TOKEN_HEX.gray5`.
- Sub label must always answer *what · process · expected* — never just a number.
- Held / stale: fill → dashed track (`lineDash: [4, 4]`), sub label → "held @ 03:14".
- Empty (no data): fill absent, center label → `—`, sub label → "not enough data" (never "N/A").

## Form controls

Input / textarea:
- Height 36px, padding `0 var(--dsc-space-3)`.
- `background: var(--dsc-gray-2)`, `border: 1px solid var(--dsc-gray-3)`, `border-radius: var(--dsc-radius)`.
- `color: var(--dsc-white)`, `font: var(--dsc-fs-lg) var(--dsc-font)`.
- Placeholder: `color: var(--dsc-gray-5)`, italic disallowed.
- `:focus` → `border-color: var(--dsc-teal)`, `outline: 2px solid var(--dsc-focus-ring)`, `outline-offset: 2px`.

Select:
- Same as input; caret icon 12px on right in `var(--dsc-gray-5)`.
- Options panel: `background: var(--dsc-black-2)`, `border: 1px solid var(--dsc-gray-3)`, `box-shadow: var(--dsc-shadow)`.

Switch:
- 34x20px, `border-radius: var(--dsc-radius-full)`.
- Off: `background: var(--dsc-gray-2)`, thumb `var(--dsc-gray-5)`.
- On: `background: var(--dsc-teal-dim)`, thumb `var(--dsc-teal)`.
- Motion: thumb translates `--dsc-dur-2` `--dsc-ease`.

Slider:
- Track 4px, `background: var(--dsc-gray-3)`, fill `var(--dsc-teal)`, thumb 16px `var(--dsc-teal)` with `box-shadow: 0 0 0 4px var(--dsc-teal-dim)`.
- Focus ring on the thumb.

## Empty state

Not a placeholder. It's a labeled affordance.

- Icon 32px, `color: var(--dsc-gray-5)`, centered.
- Head `var(--dsc-fs-lg)` `var(--dsc-white)` weight 600 — one line, imperative or descriptive ("No probes attached", "Waiting for brain to confirm hold").
- Sub `var(--dsc-fs-sm)` `var(--dsc-gray-5)` — one sentence explaining *why* and *what unblocks it*.
- Action `Button.secondary` if there's a next step. Never a bare "Retry" — say what retry does.

Ban "No data" and "N/A" as terminal empty-state text. Always say what is missing and what it depends on.

## Skeleton

Placeholder for content genuinely loading, not for pretending we have data.

- Rows: 14px tall, `border-radius: var(--dsc-radius)`, `background: linear-gradient(90deg, var(--dsc-gray-2), var(--dsc-gray-3), var(--dsc-gray-2))`, `background-size: 200% 100%`, `animation: dsc-skeleton 1.2s var(--dsc-ease-in-out) infinite`.
- Skeletons must clear on **first byte**, not on `settled`. Two rows or fewer per card. Never skeleton a gauge — show the empty state.
- Under `prefers-reduced-motion`, drop the animation and hold a mid-gray fill.

## Toast

Bottom-right, stacked bottom-up, max 3 visible.

- 320px wide, `background: var(--dsc-black-2)`, `border: 1px solid var(--dsc-gray-3)`, `border-radius: var(--dsc-radius)`, `box-shadow: var(--dsc-shadow)`.
- Left 3px accent stripe by variant: teal (info), neon (success), amber (warn), bad (error).
- Title `var(--dsc-fs-md)` `var(--dsc-white)`, body `var(--dsc-fs-sm)` `var(--dsc-gray-5)`.
- Auto-dismiss: success 4s, info 6s, warn 8s, error stays until dismissed (they should not silently vanish).
- Enter `var(--dsc-dur-2)` `var(--dsc-ease)` from `translateX(24px)`; exit `var(--dsc-dur-1)` `var(--dsc-ease-spring)` reverse.

## HelpTip

Existing implementation: `HelpTip.tsx`. Reaffirm the spec — do not fork it:

- Trigger: 14px `?` disc, `border: 1px solid var(--dsc-gray-3)`, `color: var(--dsc-gray-5)`, `background: transparent`.
- Popover: solid card variant, max-width 320px, prose `var(--dsc-fs-sm)` `var(--dsc-white)`.
- Trigger sits **after** the label it explains, not inside a heading. Trigger must be keyboard-focusable and dismissable with Escape.

## Honesty rail (existing pattern, keep)

`Honesty.tsx` renders labeled chips for missing sensors, offline probes, demo mode. This is a first-class DSC pattern — public dashboards adapted from DSC-HUB should keep it, not hide it. If a public surface can't show a live honesty rail, it shows a compact "Last verified 03:14" stamp using `--dsc-mono`.

## Findings (fold into Notion tracker)

Primitives that ship but drift from spec, worth logging:

1. `.dsc-btn.teal` in `dsc.css` uses a subtle teal glow on hover; primary spec above says shift bg color-mix. Reconcile.
2. `.dsc-demo-banner` uses `border-radius: 12px` inline; spec says `12px` — matches, but the banner primitive should read from `--dsc-radius-lg` (14px) or a new `--dsc-radius-md` (12px). Pick one and document.
3. `Toast` component (if it exists) — confirm auto-dismiss timings match this spec, and that errors do not auto-dismiss.
4. Skeleton usage — audit whether gauges are ever skeletoned; per spec they should show empty state instead.
5. Some chips in `Honesty.tsx` may use bare hex — Phase 1 didn't confirm; worth a targeted grep during Phase 5 patch drafting.
