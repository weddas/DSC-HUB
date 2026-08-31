# Extractable Superdesign DraftComponents

Menu of operator-SPA primitives worth extracting as Superdesign DraftComponents.
No full source here — see `components.md` and `layouts.md`.

Layout: Shell, HonestyRail, DemoBanner, PageHeader.
Basic: Button, Card, Kpi, StatusChip, IconButton, OverflowMenu.

---

## AppShell / Shell

- **Name:** AppShell (export `Shell` in source)
- **Source path:** `homeassistant/custom_components/dsc_hub/frontend/src/App.tsx`
- **Category:** Layout
- **Description:** Operator chrome: brand row, DemoBanner, HonestyRail, primary tabs (Live/Grow/Tune/Fleet/Settings), secondary tabs, SeatOverlayHost, hashed Routes, TwinKeepAlive. HashRouter URLs are `#/live/overview` etc.
- **Extractable props (state/nav that change per page):**
  - `surfaceVersion` (string, default `"7.3.0"`) — brand-row SURFACE stamp
  - Active primary section from location (`live` | `grow` | `tune` | `fleet` | `settings`)
  - Active secondary tab path
  - Route outlet (page body)
- **Hardcoded elements:**
  - Brand copy: `DSC - A Plausible Deniability Project.`
  - Brand NavLink target `/live/overview`
  - `PRIMARY_TABS` / `SECONDARY_TABS` from `src/routes.ts`
  - Class names: `dsc-shell`, `dsc-brand-row`, `dsc-primary-tabs`, `dsc-secondary-tabs`
  - Providers live on `App`, not `Shell` (`HassProvider`, `ZoneFocusProvider`, `InspectorProvider`, `BandChartProvider`)

---

## HonestyRail

- **Name:** HonestyRail
- **Source path:** `homeassistant/custom_components/dsc_hub/frontend/src/components/Honesty.tsx`
- **Category:** Layout
- **Description:** Top rail of kit-honesty chips. Empty kit → single `Kit honest` ok chip. Gaps → up to 6 warn/bad chips plus overflow `+N`; chip click opens DecisionLayer with gap detail and CTA navigate.
- **Extractable props (state/nav that change per page):**
  - `gaps?: HonestyGap[]` — inject list; omit to compute from fleet/entity bus
  - Per-gap: `id`, `label`, `tone`, `detail`, `cta`, `href`
- **Hardcoded elements:**
  - Empty label `Kit honest`
  - Slice of 6 visible chips
  - DecisionLayer titles/confirm labels from gap
  - Overflow list + DecisionLayer
  - Class `dsc-honesty-rail`

---

## DemoBanner

- **Name:** DemoBanner
- **Source path:** `homeassistant/custom_components/dsc_hub/frontend/src/components/DemoBanner.tsx`
- **Category:** Layout
- **Description:** Software-only demo warning. Fetches `/health`; renders only when `mode === "demo"` and the SPA is not embedded in an iframe (HA panel).
- **Extractable props (state/nav that change per page):**
  - None from parent. Internal: `health.mode`, `health.detail`
  - Visibility: hidden when embedded or not demo
- **Hardcoded elements:**
  - StatusChip `Simulated room` tone warn
  - Copy: `Software-only WiP demo. No hardware, LAN, or live grow room connected.`
  - Class `dsc-demo-banner`
  - Fetch path `/health`

---

## PageHeader

- **Name:** PageHeader
- **Source path:** `homeassistant/custom_components/dsc_hub/frontend/src/components/ui.tsx`
- **Category:** Layout
- **Description:** Page title block with optional teal icon, subtitle, primary CTA, and overflow/actions slot.
- **Extractable props (state/nav that change per page):**
  - `title` (string)
  - `subtitle?` (string)
  - `icon?` (IconName)
  - `primaryAction?` (ReactNode)
  - `actions?` (ReactNode)
- **Hardcoded elements:**
  - Icon color `var(--dsc-teal)`, size 22
  - Classes `dsc-page-header`, `dsc-page-title`, `dsc-muted` subtitle

---

## Button

- **Name:** Button
- **Source path:** `homeassistant/custom_components/dsc_hub/frontend/src/components/ui.tsx`
- **Category:** Basic
- **Description:** Pressable control. Legacy flags `primary` / `teal` plus `variant` (`primary` | `secondary` | `danger`). Optional leading Icon with motion.
- **Extractable props (state/nav that change per page):**
  - `children`
  - `onClick?`
  - `disabled?`
  - `type?` (`button` | `submit`)
  - `primary?` / `teal?` / `variant?`
  - `icon?` / `iconMotion?`
- **Hardcoded elements:**
  - Base class `dsc-btn`; variant classes `primary`, `teal`, `dsc-btn-primary|secondary|danger`
  - Icon size 14

---

## Card

- **Name:** Card
- **Source path:** `homeassistant/custom_components/dsc_hub/frontend/src/components/ui.tsx`
- **Category:** Basic
- **Description:** Glass panel section with optional title + teal icon.
- **Extractable props (state/nav that change per page):**
  - `title?`
  - `icon?` (IconName)
  - `children`
  - `className?` / `style?`
- **Hardcoded elements:**
  - Class `dsc-card` / `dsc-card-title`
  - Title icon size 14, color `var(--dsc-teal)`

---

## Kpi

- **Name:** Kpi
- **Source path:** `homeassistant/custom_components/dsc_hub/frontend/src/components/ui.tsx`
- **Category:** Basic
- **Description:** Metric tile built on Card. Tone + optional HELD tag + optional history click.
- **Extractable props (state/nav that change per page):**
  - `label`, `value`, `unit?`, `sub?`
  - `tone?` (`normal` | `ok` | `warn` | `bad` | `muted`)
  - `stale?` (adds `is-stale` + HELD)
  - `onClick?` (wraps tile as history button)
  - `icon?`
- **Hardcoded elements:**
  - Tone classes `dsc-status-ok|warn|bad|muted`
  - HELD tag `dsc-held-tag`
  - History title `History · ${label}`

---

## StatusChip

- **Name:** StatusChip
- **Source path:** `homeassistant/custom_components/dsc_hub/frontend/src/components/ui.tsx`
- **Category:** Basic
- **Description:** Compact status pill. Button when `onClick` is set, otherwise span.
- **Extractable props (state/nav that change per page):**
  - `label`
  - `tone?` (`ok` | `bad` | `warn` | `muted`)
  - `pulse?` / `motion?` (`pulse` | `duty` | `breathe` | `fan` | `glow`)
  - `icon?`
  - `onClick?` / `title?`
- **Hardcoded elements:**
  - Classes `dsc-chip dsc-chip--${tone}` plus motion
  - `motion === "fan"` forces fan Icon + `dsc-fan-spin`
  - Icon size 11

---

## IconButton

- **Name:** IconButton
- **Source path:** `homeassistant/custom_components/dsc_hub/frontend/src/components/chrome.tsx`
- **Category:** Basic
- **Description:** Square icon-only button with aria-label/title. Used by OverflowMenu and drawers.
- **Extractable props (state/nav that change per page):**
  - `label` (accessible name)
  - `icon` (IconName)
  - `onClick?`
  - `expanded?` (aria-expanded)
  - `className?`
- **Hardcoded elements:**
  - Class `dsc-icon-btn`
  - Icon size 16

---

## OverflowMenu

- **Name:** OverflowMenu
- **Source path:** `homeassistant/custom_components/dsc_hub/frontend/src/components/chrome.tsx`
- **Category:** Basic
- **Description:** More-actions kebab that opens a click-outside/Escape menu. Ignores HA more-info dialog clicks.
- **Extractable props (state/nav that change per page):**
  - `items` — `{ id, label, onSelect }[]`
  - `label?` (default `"More actions"`)
- **Hardcoded elements:**
  - Trigger IconButton icon `"more"`
  - Classes `dsc-overflow`, `dsc-overflow-menu`
  - role `menu` / `menuitem`
