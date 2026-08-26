# Theme audit — DSC-HUB 7.1 (tokens only)

**Date:** 2026-08-27  
**Surface:** Pi SPA at `http://192.168.86.48:8787/` (`dsc-brain.local`). **`.30` is not the Brain.**  
**Scope:** CSS variables, attach points, scale, leftover HA/Mushroom, contrast, unused tokens, live bundle vs source.  
**Not this pass:** DESIGN-AUDIT visual language, LAYOUT/SPACE, interactive behavior, pot3 OOS, Apply network, demand writes.  
**Sibling docs:** [`DESIGN-AUDIT-7.1.md`](DESIGN-AUDIT-7.1.md), SETTINGS / INTERACTIVE / WORKFLOW / UX audits.

**Method:** source inventory of `dsc.css` / `main.tsx` / `index.html` / `panel-element.tsx` / viz palettes; live GET of HTML + CSS; computed styles on loaded Overview / Climate / Root / Compose / Settings via CDP. Headless Chrome screenshots only caught the connecting flash (fleet XHR not waited). No commit, no deploy, pot3 left OOS, Apply network / demand not fired.

---

## Verdict

**Attach is fixed and live.** Tokens are on `:root` **and** `.dsc-root` is mounted. The 7.1.2 white-page bug (tokens scoped to `:host, .dsc-root` while the island SPA only had `.dsc-shell`) is **not** reproducing on `.48`.

**The theme still lies in places.** Most chrome looks applied, then Settings paints **white native inputs**, most routes ignore the 7.1.2 button hierarchy, leftover **lime `#39ff14`** still washes “ok” chips, and several drawers/charts/banners bypass the scale with Tailwind / dank-green / sky hex.

| Check | Live |
|-------|------|
| Bundle | `index-DwSYxFmR.js` + `index-8hBHNvOx.css` (matches `spa-dist`) |
| Token block | `:root,:host,.dsc-root{--dsc-black:#0b0e14;…}` |
| `.dsc-root` on loaded routes | **yes** (1), `.dsc-shell` inside it |
| `:root` tokens resolve | `--dsc-black #0b0e14`, `--dsc-white #e8eef8`, `--dsc-teal/#26c6da`, `--dsc-neon #66bb6a` |
| Body computed | `color rgb(232,238,248)` / `bg rgb(11,14,20)` / `Segoe UI, IBM Plex Sans` |
| `--dsc-text` | **empty** (undefined; wordmark falls back to `#eef1f8`) |
| Mushroom / `ha-card` classes | **0** on the island SPA |
| Hierarchy on Compose | 1 primary / 3 secondary / 2 danger (source + live count) |
| Hierarchy on Settings | **0** primary/secondary; 1 danger (Apply network); 1 **legacy** `.primary` (Save settings = neon, not teal) |
| Hierarchy on Overview / Climate / Root | teal + plain `.dsc-btn` only |

---

## Token attach map

```
island SPA document
  :root  ── token block + html/body/#root base
  #root
    .dsc-root   ── same token block (belt) + radial wash
      .dsc-shell ── layout only; MUST NOT be the token host
        App chrome / pages

HA panel shadow root (not the Pi :8787 path)
  :host  ── token block from inlined DSC_PANEL_CSS
         ── PLUS hardcoded :host { background:#0a0e18; color:#eef1f8 }
  .dsc-root
    .dsc-shell
```

| Selector | Job | Live Pi SPA |
|----------|-----|-------------|
| `:root` | Island document tokens | **Attached.** Computed on `html`. This is what saved the SPA after 7.1.2. |
| `:host` | HA panel shadow root | Inert on `:8787`. Still ships a **second** host paint (`#0a0e18` / `#eef1f8`) that is not `--dsc-black` / `--dsc-white`. |
| `.dsc-root` | Explicit mount wrapper | **Live.** `main.tsx` wraps loading, error, and the app. CDP: `hasRoot=true`, `shellInRoot=true`. |
| `.dsc-shell` | Max-width column | **Not a token host.** Prior bug: this was the only wrapper, so `var(--dsc-*)` resolved to nothing. |

`index.html` has no theme link of its own; Vite injects `dsc.css`. Connecting state (`main.tsx`) already wraps `.dsc-root` > `.dsc-shell`, so the flash is dark + muted, not serif-on-white. Headless shots in [`screens-7.1.2/`](screens-7.1.2/) show that flash only.

---

## Inventory

### Declared tokens (34)

All on `:root, :host, .dsc-root` in `frontend/src/styles/dsc.css`.

| Group | Tokens | Notes |
|-------|--------|-------|
| Surfaces | `--dsc-black` `#0b0e14`, `--dsc-black-2` `#12171f`, `--dsc-gray-1` `#12171f`, `--dsc-gray-2` `#1a2230`, `--dsc-gray-3` `#243044` | **`--dsc-black-2` ≡ `--dsc-gray-1`** — card gradient is same-to-same |
| Muted | `--dsc-gray-4` `#8b95a8`, `--dsc-gray-5` `#8b95a8` | **Identical.** No muted step. Placeholder and label are the same paint |
| Accent | `--dsc-blue` `#26c6da`, `--dsc-teal` `#26c6da` + dim/glow | **`--dsc-blue` ≡ `--dsc-teal`.** Live vs Grow section color cannot differ |
| Status | `--dsc-neon` `#66bb6a`, `--dsc-amber` `#ffb74d`, `--dsc-bad` / `--dsc-bad-soft` `#ef5350` | **`--dsc-bad` ≡ `--dsc-bad-soft`** |
| Glow leftovers | `--dsc-neon-glow` `rgba(0,230,118,.4)` | **Unused** |
| Unused hue | `--dsc-orange` `#ff8a65` | **Unused as `var()`.** AirPath/Lung hardcode the hex instead |
| Soil | `--dsc-soil-1`…`4` | Used by `VesselGlyph` |
| Glass / type / radius / shadow | `--dsc-glass`, `--dsc-glass-border`, `--dsc-white`, `--dsc-font`, `--dsc-mono`, `--dsc-radius` `10px`, `--dsc-radius-lg` `14px`, `--dsc-shadow`, `--dsc-shadow-tight` | No type **size** scale. Radius 8 / 12 / 999 hardcoded beside the two tokens |

**Ghost:** `--dsc-text` is referenced on `.dsc-brand-wordmark` and **never declared**.

### Unused / collapsed

| Token | Status |
|-------|--------|
| `--dsc-neon-glow` | declared, zero `var()` reads |
| `--dsc-orange` | declared, zero `var()` reads |
| `--dsc-text` | read, not declared |
| `--dsc-blue` / `--dsc-teal` | alias, not a pair |
| `--dsc-gray-4` / `--dsc-gray-5` | alias |
| `--dsc-black-2` / `--dsc-gray-1` | alias |
| `--dsc-bad` / `--dsc-bad-soft` | alias |

### Hardcoded bypass (count)

**~48 literals that do not go through `var(--dsc-*)`**, excluding the 12 SVG hexes in `gaugeTheme.ts` / `GAUGE_PALETTE` that intentionally mirror tokens (SVG presentation attrs cannot use `var()`).

| Bucket | Count | Where |
|--------|------:|-------|
| Lime `#39ff14` / `rgba(57,255,20,…)` | 8 rules | chips, demand-on, secondary active tab, soil glow — Mushroom/ESPHome neon leftover |
| Settings typeless `<input>` | 6 fields | assignment function/placement, AP SSID, Ollama URL/model, CannaLib URL — **browser white chrome** |
| BandChartHost Tailwind | 13 | `#f97316` `#22c55e` `#94a3b8` `#3b82f6` `#fbbf24` `#ef4444` + alpha |
| AirPathMap / LungLoop | 8 | `#ff8a65` (orange token unused), `#b388ff` (not even `--dsc-purple`) |
| Banner / narrator | 6 | slate `#0f172a`, sky `#38bdf8`, amber `#fbbf24`, red `#ef4444` — Tailwind, not HA Dash |
| Drawer / decision dank | 2 | `#121a16` / `#0a100e` — old green-black, not `--dsc-black` |
| panel-element `:host` | 2 | `#0a0e18` / `#eef1f8` |
| Danger / teal-primary text | 5 | `#041018` `#ff9e9b` `#ffd7d5` `#06121a` |
| vesselSpec + soil pot | ~7 | fabric/felt/pet rgba + `#1a1410` |
| Band-cell / gauge rgba | ~10 | `#0c121c`, `#82a5e6`, `#2ec4d6` (teal-ish 46,196,214 ≠ 38,198,218) |

No Mushroom component classes, no `ha-card`, no `--primary-color` / `--rgb-*` HA vars in the SPA source. Leftovers are **palette fossils**, not HACS markup.

---

## Live vs source

| Artifact | Live `.48` | Workspace `spa-dist` |
|----------|------------|----------------------|
| HTML script | `/assets/index-DwSYxFmR.js` | same |
| HTML css | `/assets/index-8hBHNvOx.css` | same |
| CSS bytes | 39007 | 39008 (trailing newline) |
| CSS prefix | `:root,:host,.dsc-root{--dsc-black: #0b0e14;…` | same |
| `/health` | `surface: 7.1.0` | — |

Source `dsc.css` token block matches the live minified sheet. No stale unthemed bundle.

Hash-jump / CDP navigate can unmount `#root` to “Connecting to fleet…” (title fallback **7.0.0**) — already **WF-P1-7**. The connecting paint is still tokenized. In-app tab clicks remount.

---

## Route notes (theme only)

### Overview (`#/live/overview`)

Themed. `.dsc-root` present. Header CTA is **legacy** `<Button teal>`, Mission is plain `.dsc-btn`. Banners use off-token slate/red. Gauges use hex mirrors (acceptable). Opening a band chart pulls **Tailwind** series colors.

### Compose (`#/grow/compose`)

Themed once fleet returns. **Only route that actually uses the hierarchy tokens** (live count: 1 / 3 / 2). Catalog search is `type="search"` (skinned). Seat nickname on Roster is typeless but sits under `.dsc-seat-editors` which has its own token rules.

### Settings (`#/fleet/settings`)

Chrome themed; **controls are not.**

- Typeless `<input>` (no `type="text"`) **do not match** `input[type="text"]` in `dsc.css`. Browser default = white field, gray placeholder. Live screenshot: assignment FUNCTION/PLACEMENT and the Network/Integrations fields are light islands.
- `type="password"` / `type="number"` / `type="checkbox"` **are** skinned.
- Save settings = `.dsc-btn.primary` (neon green + `--dsc-black` text), not `.dsc-btn-primary` (teal).
- Apply network = `.dsc-btn-danger` (`#ff9e9b` on `rgba(239,83,80,.14)`). Not clicked.
- Backup `<a class="dsc-button">` — **no such class in CSS.** Naked inherited link.

### Other loaded surfaces

Climate / Root: themed cards, lime ok-chips, zero hierarchy variants. Secondary “Root” pill is neon text on lime wash. Active **primary** tab computed color is **white**, not `--dsc-blue` / `--dsc-teal` — `.dsc-tab.active` (later) wins over `.dsc-tab--live.active`.

---

## Contrast

| Pair | Ratio (approx) | Verdict |
|------|----------------|---------|
| `--dsc-white` on `--dsc-black` | ~16:1 | Pass |
| `--dsc-gray-5` `#8b95a8` on `--dsc-black` | ~6.3:1 | AA ok, AAA fail; small 0.72rem labels feel washed |
| `--dsc-gray-5` on `--dsc-gray-2` cards | ~5.5:1 | Borderline; Settings “Role / IP / host” reads faint |
| Neon `#66bb6a` on lime `rgba(57,255,20,.08)` | ~5:1 on near-black | Green-on-green; “ok” and “active secondary” smear |
| Teal `#26c6da` on `#041018` (hierarchy primary) | ~10:1 | Pass — **unused** on most routes |
| Neon `#66bb6a` on `#0b0e14` (legacy `.primary`) | ~8:1 | Pass, but it is a **second** primary |
| Cream `rgba(244,247,244,.92)` on `--dsc-soil-3` `#c4a35a` | ~2:1 | **Fail** — soil layer labels |
| White `#fff` field + inherited `--dsc-white` text | — | **Light-on-light risk** if a UA inherits color; Chromium used default dark text this pass |
| No-data gauge grey on `#0c121c` wash | low | Root DRYBACK / EC “no data” is easy to miss |

There is no light theme. “Light-on-light” here is **light chrome on a dark product** (white inputs) and **light green on light green** (ok chips / secondary active), not a second color scheme.

---

## Button hierarchy (tokens exist, almost nobody uses them)

`ui.tsx` still has three ways to mean “important”:

| API | Class | Paint |
|-----|-------|-------|
| `variant="primary"` | `.dsc-btn-primary` | teal fill, `#041018` text |
| `primary` boolean | `.dsc-btn.primary` | **neon** fill, `--dsc-black` text |
| `teal` boolean | `.dsc-btn.teal` | teal wash, white text |

7.1.2 added `variant`. Compose / Calibrate / Learning use it. Overview, Mission, Climate, Light, Dash, Honesty rail, Settings Save, DecisionLayer confirm still use `primary` / `teal`. Live Settings: 38 `.dsc-btn`, **zero** `.dsc-btn-primary` / `-secondary`.

---

## P0 / P1 / P2

### P0

| ID | Defect |
|----|--------|
| **TH-P0-1** | Token input skin is `input[type=text\|number\|search\|…]`. Settings (and any other typeless `<input>`) miss it and render **UA white fields**. Settings is a primary operator route. Fix: skin `input:not([type])` / `input[type="text"]` together, **or** put `type="text"` on every field. Same hole for `.dsc-button` (typo — backup link). |

No remaining attach P0. `.dsc-root` is live.

### P1

| ID | Defect |
|----|--------|
| **TH-P1-1** | Dual button systems. Hierarchy tokens unused on Overview / Settings / most Live routes. Legacy `.primary` is neon; new primary is teal. |
| **TH-P1-2** | Lime `#39ff14` leftover on ok-chips, demand-on, secondary active. Fights `--dsc-neon` `#66bb6a` (FOLLOWUPS 7.1 already said kill `#39ff14`). |
| **TH-P1-3** | Collapsed scale: blue≡teal, gray-4≡gray-5, black-2≡gray-1, bad≡bad-soft. Section colors and muted steps cannot express what the names claim. |
| **TH-P1-4** | BandChartHost + AirPathMap + LungLoop hardcoded Tailwind / `#b388ff`. Charts and lung diagrams are a second product. |
| **TH-P1-5** | Banner / narrator / drawer / decision panel off-token (slate-sky, dank `#121a16`). Look applied until you put them next to a `.dsc-card`. |
| **TH-P1-6** | `.dsc-tab--*` section colors are dead (later `.dsc-tab.active` forces white). Twin IIFE + `.dsc-legacy-host { background:#000 }` stay outside the scale. |

### P2

| ID | Defect |
|----|--------|
| **TH-P2-1** | `--dsc-text` undefined; `--dsc-orange` / `--dsc-neon-glow` unused. |
| **TH-P2-2** | No type-size tokens; radius 8/12/999 hardcoded; scrollbar unthemed. |
| **TH-P2-3** | panel-element `:host` `#0a0e18` / `#eef1f8` ≠ `--dsc-black` / `--dsc-white`. Island SPA unaffected. |
| **TH-P2-4** | Soil-layer cream on gold; connecting muted is AA-only. |

---

## Top 8 defects

1. **Settings typeless inputs skip token skin** — white UA chrome (TH-P0-1).  
2. **Button hierarchy unused** outside Compose / Calibrate / Learning; two different “primary” paints (TH-P1-1).  
3. **Lime `#39ff14` ok-wash** vs `--dsc-neon` (TH-P1-2).  
4. **Collapsed aliases** — blue=teal, gray-4=gray-5 (TH-P1-3).  
5. **BandChart / lung hardcoded hex** (TH-P1-4).  
6. **Banner / drawer / narrator off-token** (TH-P1-5).  
7. **Section tab colors dead** + Twin/legacy `#000` (TH-P1-6).  
8. **Ghost `--dsc-text` + unused orange/neon-glow**; `.dsc-button` typo (TH-P2-1 / TH-P0-1).

---

## Screenshots

| File | What it shows |
|------|----------------|
| [`screens-7.1.2/theme-audit-overview.png`](screens-7.1.2/theme-audit-overview.png) | Headless connecting flash — **themed** (`--dsc-black` + muted), not the old white page |
| [`screens-7.1.2/theme-audit-compose.png`](screens-7.1.2/theme-audit-compose.png) | Same connecting flash (Compose hash) |
| [`screens-7.1.2/theme-audit-settings.png`](screens-7.1.2/theme-audit-settings.png) | Same connecting flash (Settings hash) |

Loaded Overview / Compose / Settings / Root were inspected live (CDP computed styles). Shared Chrome was contested by sibling tabs; headless has no wait for `/fleet`. Loaded Settings white-input surface was confirmed in the interactive session (assignment + Network fields). Do not treat the three PNGs as hydrated route proof.

---

## Counts (for the report line)

| Metric | N |
|--------|--:|
| Declared tokens | **34** |
| Ghost / unused | 1 ghost (`--dsc-text`), 2 unused (`--dsc-orange`, `--dsc-neon-glow`) |
| Collapsed aliases | 4 pairs |
| Hardcoded bypass literals | **~48** (plus 12 justified SVG mirrors) |
| `.dsc-root` live | **yes** |
| Mushroom / HA class leftovers | **0** (palette fossils only) |

---

## Files edited this pass

- `docs/qa/THEME-AUDIT-7.1.md` (this file)
- `docs/FOLLOWUPS.md` (TH-P0 / TH-P1 only)
- `docs/qa/screens-7.1.2/theme-audit-overview.png`
- `docs/qa/screens-7.1.2/theme-audit-compose.png`
- `docs/qa/screens-7.1.2/theme-audit-settings.png`

No app source, no commit, no deploy.
