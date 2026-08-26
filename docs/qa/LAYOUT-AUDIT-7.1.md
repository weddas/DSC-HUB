# Layout audit — DSC-HUB 7.1.0

**Date:** 2026-08-27  
**Scope:** Element layout only (grid, alignment, spacing, overflow, overlap, clipping, z-index, card containment, breakpoints, sticky headers, empty-state height, control wrapping).  
**Not this audit:** theme/tokens (DESIGN-AUDIT-7.1.md), copy/usability (UX), interaction, workflow, gauges-as-semantics, graphs, wiring. DESIGN-AUDIT was read, not rewritten.

**Live:** `http://192.168.86.48:8787/` (Brain). `.30` is not the Brain. Surface 7.1.0.  
**Viewports:** desktop 1440×900 and phone 390×844.  
**Guardrails:** pot3 left out of service. Did not Apply network, fire demand, commit plant, or deploy.

**Routes checked:** **17** unique pages (redirects `/` `/live` `/grow` `/tune` skipped as aliases).

| # | Route | Desktop 1440 | Phone 390 |
|---|---|---|---|
| 1 | `/live/overview` | yes | yes |
| 2 | `/live/mission` | yes | yes |
| 3 | `/ops/home` (Dash) | yes | yes |
| 4 | `/live/twin` | yes | yes |
| 5 | `/live/climate` | yes | yes |
| 6 | `/live/4x8` | yes | yes |
| 7 | `/live/2x4` | yes (after Grow hop) | yes |
| 8 | `/live/root` | yes (after Grow hop) | yes |
| 9 | `/live/light` | yes (after Grow hop) | yes |
| 10 | `/grow/compose` | yes | yes |
| 11 | `/grow/research` | yes | chrome only this pass (tent-fight mid-walk) |
| 12 | `/grow/roster` | yes | chrome only this pass (same) |
| 13 | `/tune/learning` | yes | yes |
| 14 | `/tune/analytics` | yes | yes |
| 15 | `/fleet` | yes | yes |
| 16 | `/fleet/calibrate` | yes | yes |
| 17 | `/fleet/settings` | yes | yes (metrics; JPEG shot timed out on 10k-px DOM) |

**Overflow / overlap count:** **10** distinct defects (element-vs-viewport, sibling collision, or card escape). Plus **1** nav-vs-content fight that is layout-adjacent.

---

## Verdict

**Desktop is operator-usable** on Overview, Climate, Compose, Mission, Fleet, Settings, Root, Light, Twin — cards stay in the 1600px shell, gauges stay in cards, Mission/Fleet Kit Pulse is contained (1351×420). **Dash Home is not:** the two-up sections are a 12-column accident.

**Phone is operator-usable for glance** (Overview bands, Fleet Kit Pulse, Tune). **It is not usable for Settings tables or Dash two-up**, and Live’s nine secondary tabs plus page-header actions clip without wrapping. A drawer rail labeled “Cl…” peeks on every route.

---

## Top 8 defects

| # | Pri | Defect | Where |
|---|---|---|---|
| 1 | **P0** | `.dsc-grid--2` is undeclared. Children auto-place into **one of twelve columns** (~103px desktop, ~34px at 390). Grow log, narrator, roster, and Kit Pulse crush; chips wrap and overlap. | Dash `/ops/home` |
| 2 | **P0** | Settings tables have no horizontal scroller. Assignment table **627px**, ESPHome **419px** vs 390 viewport; OTA/compile buttons sit off-screen. | `/fleet/settings` |
| 3 | **P1** | Closed drawer rail peeks from the right (`translateX(105%)` + `left: -28px`, `z-index: 80`). Visible “Cl…” on every route at both widths. | chrome / History + seat drawers |
| 4 | **P1** | `TentCockpitPage` writes `?tent=` via `setFocus`; `App.tsx` strips `tent` except on Climate/Dash. Replace-navigate fight **blocks leaving 4×8/2×4** until another section remounts. | `/live/4x8`, `/live/2x4` |
| 5 | **P1** | `.dsc-page-header` is a nowrap flex; actions `flex-shrink: 0`. Compose “Browse Catalog” clipped; Mission/Twin action buttons measure past 390. 4×8 header **364px** tall. | Compose, Mission, Twin, 4×8, Light |
| 6 | **P1** | Live secondary tabs are 896px in a 366px row. `overflow-x: auto` + fade mask — Twin/Climate/4×8/2×4/Root/Light are off-screen with no scroll hint beyond the fade. | Live chrome @ 390 |
| 7 | **P1** | Dash Kit Pulse leftover: Mission/Fleet constellation is a full-width contained SVG (332×445 at 390, 1351×420 at 1440). Dash puts the same component in the broken 1/12 column (69×893 / 0×919). | Dash vs Mission/Fleet |
| 8 | **P2** | No `position: sticky` anywhere. Climate ~4.4k / 5.6k px, Settings ~5.7k / 10.6k px, Dash ~4.0k / 4.9k px — chrome and Command/Save scroll away. | Climate, Settings, Dash, Root |

---

## Shell / breakpoints (source)

- `.dsc-shell`: column flex, `max-width: 1600px`, padding 16/20 → 12px under 720.
- `.dsc-grid`: 12 × `minmax(0, 1fr)`, gap 14. Col spans collapse at **1100** (3/4 → 6, 8 → 12) and **720** (all → 12).
- **Missing:** `.dsc-grid--2` (used twice on Dash Home).
- Tabs: `overflow-x: auto`, `white-space: nowrap`. Secondary has an 85% fade mask.
- `.dsc-page-header`: space-between, **no wrap**. Actions do not shrink.
- Tables: `width: 100%` only — **no overflow wrapper**.
- Kit Pulse CSS containment (7.1.2): bordered SVG surface — works when the parent is full width.
- Twin keepalive: `position: fixed; z-index: -1` when idle (correctly out of flow).
- Drawers: `z-index: 80`; closed panel `translateX(105%)` is not enough to hide the 28px rail.
- **Sticky count:** 0 on every route.

---

## Per-route notes

### `/live/overview` — Overview
**Desktop:** 13 gauges in band cells; no card overflow; 4-pot strip `repeat(4, minmax(0,1fr))` sits in the Root card. Page ~1463px. Header fits. Secondary 9 tabs fit at 1440.  
**Phone:** Bands stay a 3-col row (tight but contained). Pots **77px** each. Secondary clips after Dash. Header 126px (title + Climate/Mission). Drawer rail peek.  
**Layout:** usable glance. P2 cramped pots / row tags.

### `/live/mission` — Mission
**Desktop:** Kit Pulse **contained** — SVG 1351×420, chips below, no card escape. Page ~1301px.  
**Phone:** Kit 332×445 still contained. Header **189px**; teal action buttons measure to x=500–715 (past 390).  
**Layout:** desktop good. Phone header overflow (P1).

### `/ops/home` — Dash
**Desktop:** Status chips wrap. System map lives in `.dsc-legacy-host` `max-height: min(52vh, 520px)` — map can clip. **P0:** two `.dsc-grid.dsc-grid--2` blocks computed as twelve ~102.6px tracks; children 103px. Kit Pulse inner 69×893. Chips (“Dehumidifier idle” / “Humidifier idle”, “Clone mister out of service”) wrap and overlap.  
**Phone:** same grids → **34px / 32px** children; kit width **0**. Grow log vs narrator collide. Page ~4878px.  
**Screenshot:** [`layout-audit-dash-kitpulse-1440.png`](screens-7.1.2/layout-audit-dash-kitpulse-1440.png), [`layout-audit-dash-grid-390.png`](screens-7.1.2/layout-audit-dash-grid-390.png).

### `/live/twin` — Twin
**Desktop:** keepalive host `min-height: min(68vh, 700px)` — scene contained, no document overflow-x.  
**Phone:** header 189px; 4×8/2×4 cockpit buttons overflow (r=405 / 528). WebGL viewport is short but usable.

### `/live/climate` — Climate
**Desktop:** every block is `dsc-col-12` — Command, triad, T/RH/VPD charts, air path, fans, efficacy stack to **4379px**. Gauges in matrix; no card overflow.  
**Phone:** **5579px**. Header 105px. Zone chips + timespan wrap (`flex-wrap`).  
**Layout:** no overflow. P2 density — nothing 2-up at 1440.

### `/live/4x8` and `/live/2x4` — tent cockpits
**Desktop:** stacked col-12 (targets, scheduler, air path, seat chips, history, fans). Page ~2.0k. Seat chips wrap. Empty seat uses `.dsc-empty`.  
**Phone:** 4×8 header **364px** (subtitle + Twin/Climate actions). 2×4 header 301px.  
**Nav vs content (P1):** mount `setFocus(tent)` writes `?tent=main|clone`; App strips it on these paths → hash walker and in-page tab clicks can stick on the cockpit. Leaving via Grow remount works.

### `/live/root` — Root
**Desktop:** 3× `dsc-col-4` KPIs then per-pot `dsc-col-12` cards. No gauge overflow.  
**Phone:** cols stack to 12. Page ~4173px. Header 84px (no extra actions). Usable, long.

### `/live/light` — Light
**Desktop:** 6+6 then 12.  
**Phone:** header 126px. Contained.

### `/grow/compose` — Compose
**Desktop:** 2×2 of `dsc-col-6`. Mix rows 652px inside cards — no overflow.  
**Phone:** cols stack. Mix rows **332px in 366px cards** (tracks squeeze; no card escape this pass). Header actions **324px** — “Browse Catalog” clipped. Drawer rail overlaps the right edge.  
**Screenshot:** [`layout-audit-compose-390.png`](screens-7.1.2/layout-audit-compose-390.png).

### `/grow/research` — Research
**Desktop:** page ~563px — short catalog chrome, empty-state height modest (not a hole). Header actions (Use in Compose / Open Seat) fit at 1440; will clip at 390 like Compose.

### `/grow/roster` — Roster
**Desktop:** table 1351px, fits. Page ~891px. Seat drawer is the same rail-peek chrome.

### `/tune/learning` — Learning
**Desktop / phone:** page 573 / 755. Secondary 3 tabs fit at 390. No overflow. Wizard steps wrap via `.dsc-row-actions`.

### `/tune/analytics` — Analytics
**Desktop / phone:** 684 / 705. Contained. Secondary fits.

### `/fleet` — Fleet
**Desktop:** Kit Pulse same as Mission — **contained** 1351×420. 3× `dsc-col-4` KPIs. Page ~1979px.  
**Phone:** Kit 332×445 contained. Secondary 371 vs 366 (slight fade). Usable.

### `/fleet/calibrate` — Calibrate
**Desktop / phone:** 367 / 494 — one card, short empty-ish wizard. P2 empty-state height (not a broken hole, just sparse).

### `/fleet/settings` — Settings
**Desktop:** 8 `section.dsc-card` stacked (~5662px). Inventory `dsc-col-4` = 3-across. Device cards nested inside the inventory section (card-in-card, P2). Three tables at 1351px — fit. Network / Integrations labels stack; Apply network **not clicked**.  
**Phone:** inventory stacks to 12. Assignment table **627px overflow**, ESPHome **419px overflow** + buttons at x=650. Page **10598px**. Zigbee empty line 21px — fine. No sticky “Save settings”.  
**Screenshot (desktop top):** [`layout-audit-settings-1440.png`](screens-7.1.2/layout-audit-settings-1440.png) — capture timed out; metrics stand. Phone table shot timed out on the 10k-px tree.

---

## Checks requested

| Check | Result |
|---|---|
| Elements colliding | Dash Kit Pulse chips + Grow log/narrator at 1/12 (and 34px). Not on Mission/Fleet. |
| Text truncated without `title` | Brand wraps (21px). Result chips have ellipsis+nowrap; no live truncation hit at 1440. Compose “Browse Catalog” is **clipped**, not ellipsized. |
| Buttons wrapping badly | Dash OOS chips 70×77–98 at desktop; header actions **don’t wrap** (they clip). Running chips on Dash wrap acceptably. |
| Gauges overflowing cards | **0** at 1440. Overview phone gauges stay in band cells (tight). |
| Tables vs viewport | Settings + Roster OK at 1440. **Settings fail at 390.** |
| Nav vs content | Secondary Live overflow at 390. **Cockpit tent-param fight** (P1). Rail peek overlays content. |
| Settings section stacking | Vertical stack of 8; no collision. Too long without sticky save. |
| Kit Pulse leftover | Mission/Fleet **fixed**. Dash **still broken** (parent grid, not the SVG CSS). |
| Sticky headers | None. |
| Empty-state height | Calibrate/Research short; Zigbee one-liner OK; P3 empty gauges are Grey `—` (gauge audit, not layout). |

---

## Screenshots (this audit)

Prefix `layout-audit-*` only — sibling `space-audit-*` / `ux-pass2-*` / DESIGN / GAUGE files not overwritten.

| File | What |
|---|---|
| [`layout-audit-dash-kitpulse-1440.png`](screens-7.1.2/layout-audit-dash-kitpulse-1440.png) | P0: roster + Kit Pulse in ~103px columns, chip overlap |
| [`layout-audit-dash-grid-390.png`](screens-7.1.2/layout-audit-dash-grid-390.png) | P0: Grow log / narrator at ~34px |
| [`layout-audit-overview-390.png`](screens-7.1.2/layout-audit-overview-390.png) | Secondary clip + drawer “Cl…” + tight bands |
| [`layout-audit-compose-390.png`](screens-7.1.2/layout-audit-compose-390.png) | Header action clip + rail peek |
| [`layout-audit-overview-rail-1440.png`](screens-7.1.2/layout-audit-overview-rail-1440.png) | Overview desktop (rail less obvious at 1440; peek measured 8px) |

---

## Suggested fixes (not applied)

1. Define `.dsc-grid--2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }` and collapse to 1 col under 720. Or wrap those Dash children in `dsc-col-6`.
2. Wrap every `.dsc-table` in `overflow-x: auto`.
3. Hide `.dsc-drawer-rail` when the drawer is closed, or translate ≥ `calc(100% + 28px)`.
4. Stop writing `?tent=` from TentCockpit, **or** stop stripping it on cockpit routes — pick one owner.
5. `.dsc-page-header { flex-wrap: wrap; }` and let actions wrap/full-width under 720.

---

## Files edited

- `docs/qa/LAYOUT-AUDIT-7.1.md` (this file)
- `docs/FOLLOWUPS.md` (N-LAYOUT-* P0/P1)
- `docs/qa/screens-7.1.2/layout-audit-*.png` (screenshots listed above)

No application source changed. No commit. No deploy.
