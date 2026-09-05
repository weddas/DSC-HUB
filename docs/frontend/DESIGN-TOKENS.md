# DSC-HUB SPA — design tokens & status-tone vocabulary

Single source of truth for the `dsc.css` theme. Written for the Zigbee new-UX
rollout (`plans/` → Phase 0) but applies app-wide. If a value here disagrees with
`frontend/src/styles/dsc.css`, the CSS wins and this file is stale — fix it.

Scope: this documents what already exists. It does **not** introduce a new
palette. The only new surface is the "settings table (new-UX)" primitive block
described in §5.

---

## 1. Where tokens live

Tokens are declared on three selectors together so no mount surface loses the
cascade:

```css
:root, :host, .dsc-root { --dsc-…: … }
```

- `:root` — island SPA document (`/` on `:8787`).
- `:host` — retired HA panel shadow root (kept for safety; HA is dead as of 2026-09).
- `.dsc-root` — explicit mount wrapper.

Never read a raw hex in a component. Always `var(--dsc-…)`. When a fallback is
genuinely needed, use `var(--dsc-teal, #26c6da)` with the real current value.

---

## 2. Colour tokens

### 2.1 Surfaces / structure

| Token | Value | Role |
|---|---|---|
| `--dsc-black` | `#0b0e14` | app background |
| `--dsc-black-2` | `#12171f` | raised panel / popover background |
| `--dsc-gray-1` | `#12171f` | card gradient stop, quiet fill, row zebra |
| `--dsc-gray-2` | `#1a2230` | input / button background |
| `--dsc-gray-3` | `#243044` | borders, table rules, dividers |
| `--dsc-gray-4` | `#8b95a8` | body text on glass (help body) |
| `--dsc-gray-5` | `#8b95a8` | **muted text / labels / icons** (see tone `muted`) |
| `--dsc-muted` | `#8b95a8` | alias of gray-5 for prose |
| `--dsc-white` | `#e8eef8` | primary text |
| `--dsc-glass` | `rgba(18,23,31,.78)` | glass card fill |
| `--dsc-glass-border` | `rgba(36,48,68,.55)` | glass card border |

`--dsc-gray-4` and `--dsc-gray-5` are the same hex today; keep using `-5` for
labels/icons and `-4` only where existing glass-body code already does, so a
future split stays possible.

### 2.2 Accents

| Token | Value | Role |
|---|---|---|
| `--dsc-teal` / `--dsc-blue` | `#26c6da` | primary accent, links, focus, "live" data. **Same hex** — tracked as a deferred alias cleanup; treat `teal` as canonical for new code. |
| `--dsc-teal-dim` | `rgba(38,198,218,.45)` | accent border |
| `--dsc-teal-glow` | `rgba(38,198,218,.55)` | accent glow |
| `--dsc-neon` | `#66bb6a` | **tone `ok`** — healthy Want→Got, "in service", primary CTA fill |
| `--dsc-neon-dim` | `rgba(102,187,106,.32)` | `ok` border |
| `--dsc-purple` | `#a78bfa` | Fleet section accent, "clone/2×4" segment |
| `--dsc-amber` | `#ffb74d` | **tone `warn`** |
| `--dsc-orange` | `#ff8a65` | secondary warm accent (rare) |
| `--dsc-bad` / `--dsc-bad-soft` | `#ef5350` | **tone `bad`** |
| `--dsc-soil-1..4` | greens/tans | Root / soil viz series only |

### 2.3 Type / geometry

| Token | Value |
|---|---|
| `--dsc-font` | `"Segoe UI","IBM Plex Sans",ui-sans-serif,system-ui,sans-serif` |
| `--dsc-mono` | `"Cascadia Code","IBM Plex Mono",ui-monospace,monospace` |
| `--dsc-radius` | `10px` (cards, inputs, buttons) |
| `--dsc-radius-lg` | `14px` (glass cards) |
| `--dsc-shadow` | `0 8px 24px rgba(0,0,0,.45)` |
| `--dsc-shadow-tight` | `0 2px 8px rgba(0,0,0,.55)` |

Spacing is not tokenised. The de-facto scale in `dsc.css` is **2 / 4 / 6 / 8 /
10 / 12 / 14 / 16 px**; stay on it. Card padding is `14px 16px`; table cell
padding is `8px 6px`.

---

## 3. Status-tone vocabulary — `ok` / `warn` / `bad` / `muted`

One meaning, app-wide. Every status chip, KPI tone, gauge state, and the new
settings-table health/value cells map to exactly one of these four. Do not invent
a fifth (`info`, `pending`, `drifting`…) — fold it into one of these plus a
label.

| Tone | Colour token | Meaning | Use when |
|---|---|---|---|
| **`ok`** | `--dsc-neon` (green) | Live and within target / nominal. | A reading is fresh **and** in band; a device is bound and reporting; "in service"; a job succeeded. |
| **`warn`** | `--dsc-amber` | Live but out of band, **or** degraded but not failed, **or** an operator decision is pending. | Reading fresh but outside Want; battery low; link quality poor; permit-join open; unbound device that should be bound. |
| **`bad`** | `--dsc-bad` (red) | Failed / offline / unsafe, needs attention now. | Radio down; MQTT offline; a bound safety policy is in `problem`; toolchain below pinned min; a job errored. |
| **`muted`** | `--dsc-gray-5` (grey) | No opinion. Not an alarm. | Out of service; feature not configured; value genuinely unknown; a device type we don't score. |

### 3.1 The `stale` / held state is **not** a tone

A value we had, that has since gone quiet, is **stale** — rendered as its last
number in `muted` colour plus a `⏸` / `HELD` marker and (where space allows) an
age. It is distinct from:

- `muted` alone = we never had a value / don't care.
- `bad` = the thing that produces the value has failed.

Staleness **fails closed**: with no timestamp evidence, treat a reading as stale
rather than assume it is live. See `useHeldReading` / `useTimestampedReading`
(§6) and `ZIGBEE_ROLE_STALE_MS` in `pages/ClimatePage.tsx`.

### 3.2 Component mapping

| Surface | `ok` | `warn` | `bad` | `muted` |
|---|---|---|---|---|
| `StatusChip tone=` | `"ok"` | `"warn"` | `"bad"` | `"muted"` |
| `.dsc-status-*` text class | `-ok` | `-warn` | `-bad` | `-muted` |
| `.dsc-chip--*` | `--ok` | `--warn` | `--bad` | `--muted` |
| `Kpi tone=` | `"ok"` | `"warn"` | `"bad"` | `"muted"` (also `"normal"`) |
| Gauge (`viz/charts`) | `.is-ok` | `.is-warn` | `.is-bad` | `.is-muted` |
| Settings table (new-UX, §5) | `.is-ok` | `.is-warn` | `.is-bad` | `.is-muted` on `td` |

`Kpi tone="normal"` means "no tone, but honour `stale`" — it renders `muted` when
`stale` is set, otherwise unstyled. New code should pass an explicit tone.

---

## 4. HelpTip placement convention

`<HelpTip>` (the `?` disc) has **one** standard position: **trailing the thing it
explains, on the same line as its title/header**, after any status chips.

- Card with a header row → `HelpTip` is the last child of that header row.
- `PageHeader` → pass it in `actions`, rightmost.
- A single control → immediately after the control's `<label>` text, before the
  input.

Do not stack a HelpTip above a card, put it before the title, or float it in a
corner. The body opens below-left by default and flips below-right when it is the
last child of a `.dsc-chip-row` / `.dsc-status-strip`.

---

## 5. Settings table (new-UX) primitive

Defined in `frontend/src/components/settings/SettingsTable.tsx`, styled by the
`/* —— settings tables (new-UX) —— */` block in `dsc.css`. It is a thin,
opinionated layer over the existing `.dsc-table` + `.dsc-table-scroll`:

- `SettingsTable` — scroll wrapper + `<table class="dsc-table dsc-table--settings">`
  + `<thead>` from a `columns` prop. Optional `caption` and trailing `help`
  slot (§4 position).
- `HealthCell` — battery % / link quality / "seen 3m ago" as compact stacked
  bits, each toned per §3 (`warn` when `battery ≤ 20` or `linkquality < 40`;
  `muted` when absent).
- `StaleValueCell` — a number + unit; `muted` + `⏸` + age when `stale`.
- `InlineEditCell` — click-to-edit text (device rename). Commits on blur/Enter,
  reverts on Escape. Never fires per-keystroke.
- `SelectCell` — a bare `<select>` sized for a dense row.

All cells accept `tone?: "ok" | "warn" | "bad" | "muted"` and nothing else.
Rows stay one logical record; a secondary detail row (task params) uses
`colSpan` and `.dsc-settings-subrow`, matching the current `ZigbeeBindRow`
pattern.

No visible change lands with the primitive itself — Phases 1–4 migrate surfaces
onto it.

---

## 6. Held / timestamped readings

| Hook | Input | Output | Use |
|---|---|---|---|
| `useHeldReading(entityId)` | HA/fleet entity id | `{ value, stale, heldAt, live }` | Hub/tent climate sensors on Live/Climate. |
| `useTimestampedReading(value, updatedAtSec, staleMs?)` | a raw number + its epoch-seconds timestamp | `{ value, stale }` | Zigbee-by-role values and anything else that arrives with its own `updated_at` in the fleet snapshot rather than as an entity. Pure, no subscription. Fails closed (no timestamp ⇒ `stale`). Default `staleMs` = `ZIGBEE_ROLE_STALE_MS` (10 min). |

---

## 7. Checklist for a new dense settings surface

1. Wrap in `SettingsTable` with an explicit `columns` array.
2. Every status uses one of the four tones (§3); nothing invents a fifth.
3. Every number that can go quiet routes through `useTimestampedReading` /
   `useHeldReading` and renders `stale` per §3.1 — no confident last value.
4. One `HelpTip`, trailing the header (§4).
5. Inline edits use `InlineEditCell` — draft-local, commit on blur, no
   round-trip gating the row.
6. Colours via `var(--dsc-…)` only.
