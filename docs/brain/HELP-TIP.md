# Inline `?` HelpTip (SPA chrome)

**In one line:** Native `<details>` callouts that explain a chip row without a modal or help-store JS — Escape-aware via an opaque modal-layer stack.

Architect sketch: [`docs/superpowers/plans/2026-08-28-dsc-polish-architect-sketch.md`](../superpowers/plans/2026-08-28-dsc-polish-architect-sketch.md) · mm-review: [`docs/superpowers/plans/2026-08-28-polish-pass-mm-review.md`](../superpowers/plans/2026-08-28-polish-pass-mm-review.md)

## Intent

Operators land on Overview / Climate / Grow / Fleet and see **Age / HS·HB / RF**, Want/Got colour, and desk-specific jargon. Raw floats (`Age 20402.7890625`), heartbeat ticks formatted as hours, Up-while-offline chips, and unexplained greys were audit debt (**DA-P1-1**). Tips `39d7f88` → `8fc5e33` close that path with:

1. Honest hub chips via `HubLinkLine` (`Up`/`Down` gated by link online; `HS` duration vs `HB #` count)
2. Inline `?` tips across Live / Grow / Tune / Fleet desks (including Mission / Twin / cockpit)
3. Escape ownership shared with drawers via opaque `modalLayer` symbols (not depth counters)

## Components

| Piece | Path | Contract |
|-------|------|----------|
| `HelpTip` | `frontend/src/components/HelpTip.tsx` | `<details class="dsc-help-tip">` · summary `?` · `aria-label="Help: {title}"` · Escape closes only when tip is top modal layer |
| `modalLayer` | `frontend/src/lib/modalLayer.ts` | Opaque `symbol` stack — `push` / `pop(token)` / `isTop`; out-of-order unmount cannot orphan higher layers |
| Styles | `frontend/src/styles/dsc.css` (`.dsc-help-tip*`) | Absolute popover; open z-index; max-height scroll; last-in-row opens left; `.dsc-page-header` flex-wrap |
| `HubLinkLine` | `frontend/src/components/HubLinkLine.tsx` | Online→`Up`; offline→`Down`; Bounces · RF · `HS`/`HB #` + “Hub link chips” tip |
| Duration | `frontend/src/lib/formatDuration.ts` | `fmtUptimeSeconds(s)` → `10M` / `2H 14M` / `1.5D`; `0` → `0S` (fresh, not blank) |
| Honesty rail | `Honesty.tsx` + `sensorHonesty.ts` | ≤6 chips + `+N` overflow; CTAs avoid demoted Mission; CFM nameplate → Learning |

```mermaid
flowchart TB
  tip[HelpTip details] -->|open| push["pushModalLayer → symbol"]
  tip -->|Escape if top token| close[el.open = false]
  tip -->|toggle close / unmount| pop["popModalLayer(token)"]
  drawer[DecisionLayer / SlideDrawer] --> push
  pages[Live Grow Tune Fleet] --> tip
  pages --> row[HubLinkLine]
  row --> age["online → Up · offline → Down"]
  row --> beat["HS duration OR HB # count"]
  age --> fmt[fmtUptimeSeconds]
  beat --> fmt
  age --> bus[HA entity bus + fleet vitals]
  beat --> bus
```

## HubLinkLine Age / Beat honesty (tip `deafc88` → `8fc5e33`)

Verified in `HubLinkLine.tsx`:

| Chip | When link **online** | When link **offline** | Rules |
|------|----------------------|------------------------|-------|
| **Age** | Fleet hub `uptime` → `Up {duration}` (or `—` if missing) | Positive `sensor.dsc_hub_api_down_age` → `Down {duration}`; else `Down —` | **Never** show `Up` while offline; **never** show residual `Down` while online |
| **Beat** | Prefer handshake → `HS {duration}`; else heartbeat → `HB #{n}` | Same preference | Handshake age is **time**; heartbeat is a **tick count** — never run the tick through `fmtUptimeSeconds` |
| **Bounces / RF** | HA entity bus only | `—` when missing | Grey RF ≠ alarm when kit is OOS |

**Examples:**

- `Up 2H 14M` + `HB #1847` — healthy link; uptime duration + live counter (not 1847 hours).
- `Down 3M` + `HS 12S` — offline with positive API-down age; handshake age still duration-labelled.
- `Down —` — offline but no positive down-age yet.
- Tip copy: “Never trust an Up chip next to HUB LINK DOWN.”

## ZoneFocus URL ownership (tip `3b082e5` → `8fc5e33`)

`useZoneFocus` keeps React state as SoT for tent focus. Writing `?tent=` on every route fought Shell’s strip and stuck Live tabs (N-LAYOUT-TENT-NAV residue). Tip `8fc5e33` also stops bare Climate entry from wiping in-memory focus.

| Path | Owns `?tent=` / `?zone=`? |
|------|---------------------------|
| `/live/climate` · `/ops/home` | **Yes** — `setFocus` mirrors into the query string |
| Everywhere else | **No** — `setFocus` updates React only; TentCockpit must **not** call `setFocus(tent)` on mount |

| Sync rule | Behavior |
|-----------|----------|
| URL → state | Only when path owns the query **and** `tent`/`zone` is present |
| Bare Climate URL | Keeps last in-memory focus (does not force `main`) |
| Cosmetic focus | Climate `emphasize` dims the non-focused Want column; Room is umbrella lung, not a tent Want editor |

```mermaid
flowchart LR
  click[Climate / Dash tent chip] --> setFocus
  setFocus --> state[React ZoneFocus state]
  setFocus -->|only Climate or Dash| url["URL ?tent="]
  url -->|tent or zone present| state
  bare[Bare Climate URL] -.->|no URL rewrite| state
  other[Other Live tabs] --> state
  shell[Shell strip] -->|strips foreign ?tent=| other
```

## Honesty rail + held Got (tip `8fc5e33`)

| Behavior | Contract |
|----------|----------|
| Hub / panel chips | One hub gap; panel may read “Panel limited link” when Wi‑Fi RSSI exists without panel link |
| Overflow | More than 6 gaps → `+N` opens a DecisionLayer list |
| CTAs | Beat / failsafe / panel point **Fleet** or **Overview** — not demoted Mission |
| CFM nameplate | `resolveCfm(...).kind === "nameplate"` → honesty gap → `/tune/learning` |
| TentTargets Got | Stale readings keep held numbers + `HELD` / `· held` — never lie as blank dash |

## Overview tips placement

Want · Got · Need and Colour honesty sit **beside “Climate bands”** (above `DashBandsGrid`), not on the hub status strip — tip `deafc88` moved them after mm-review.

| Tip title | Operator meaning |
|-----------|------------------|
| **Want · Got · Need** | Want = target · Got = measured · Need = gap the brain proposes |
| **Colour honesty** | Teal/green = in band · Amber = drifting · Red = out of band · Grey = no data / OOS |

## Desk tip map (tip `8fc5e33`)

| Surface | Tip title | File |
|---------|-----------|------|
| HubLinkLine (Dash / Mission / Fleet) | Hub link chips | `HubLinkLine.tsx` |
| Overview | Want · Got · Need · Colour honesty | `OverviewPage.tsx` |
| Climate | Zone focus · Full Auto vs takeover | `ClimatePage.tsx` |
| Light | Photoperiod Want | `LightPage.tsx` |
| Soft cal | Soft cal vs lab stamp | `SoftCalWizard.tsx` |
| Calibrate | Curves vs nameplate | `CalibratePage.tsx` |
| Root | Got vs idle probe | `RootPage.tsx` |
| Settings | In service | `SettingsPage.tsx` |
| Compose | Compose draft | `GrowPages.tsx` |
| Research | Catalog honesty | `GrowPages.tsx` |
| Roster | Edit vs Delete | `GrowPages.tsx` |
| Learning | Learning samples | `TuneFleetPages.tsx` |
| Analytics | Analytics pack | `TuneFleetPages.tsx` |
| Fleet | Kit pulse | `TuneFleetPages.tsx` |
| Mission (demoted) | Mission triage | `LiveMissionPage.tsx` |
| Twin (demoted) | Twin seat overlay | `LivePages.tsx` |
| Tent cockpit | Tent cockpit | `LivePages.tsx` |
| Dash (demoted) | Dash vs Overview | `DashHomePage.tsx` |

Grow secondary tabs list **Roster first** (`routes.ts`) to match `/grow/roster` landing.

## Developer pitfalls (verified tip `8fc5e33`)

React Doctor / Rules of Hooks — keep these patterns. **mm-review Act-on reversed earlier “move into effects” drafts for hold/hass:**

| Hook / site | Wrong pattern | Correct pattern (current tip) |
|-------------|---------------|-------------------------------|
| `usePanelOfflineMs` | Early-return **before** `useOfflineMs(...)` when Pi path short-circuits | Always call `useOfflineMs(...)`, then choose Pi `last_seen` vs entity result (`useHeldReading.ts`) |
| `useHeldReading` | Clear hold in `useEffect([entityId])` | Clear hold **during render** when `entityId` changes — an effect leaks the prior pot for ≥1 frame |
| `HassProvider` | Sync `hassRef.current = hass` only in `useEffect` | Assign **during render** so child accessors never see a stale hass |
| ZoneFocus | `setFocus` writes `?tent=` on every route / TentCockpit remount / bare Climate resets focus | Only Climate + Dash own the query; sync from URL only when `tent`/`zone` present |
| HelpTip Escape | Close on any Escape; depth-as-id stack | Opaque `symbol` tokens; only top layer closes |
| SlideDrawer Escape | Force DecisionLayer-style shell inert | **Reverted** — drawer lives inside `.dsc-shell`; keep presentational scrim |
| Honesty CTAs | Point Beat/failsafe at demoted Mission | Fleet / Overview / Learning as appropriate |
| TentTargets Got | Blank dash when stale | Keep held value + `HELD` styling |

`OverviewPage` must import `useFleet` — tip `8208461` closed a latent `ReferenceError`.

**Deslop:** unused `LungLoop.tsx` + `components/index.ts` barrel + `SankeyFlowPrototype` alias removed — live lung viz is `AirPathMap` (+ airflow R3F scaffold); Climate uses `FlowSankey`.

## Constraints

- Prefer native `<details>` over modals — matches PD FAQ; no help-store JS.
- Grey **RF** / OOS greys are not always faults — inventory out-of-service stays quiet on purpose.
- Do **not** invent catalog height / chem / PPFD / NPK — Research tip states blanks stay blank.
- **SPA rebuild required:** tip `8fc5e33` is source-only. Committed `spa-dist` (`index-DL1EcjhX` / `tune-fleet-IPnSFs3d`) still lacks `dsc-help-tip` until Vite + hash sync. See [`../ops/DSC-HUB-DOCKER.md`](../ops/DSC-HUB-DOCKER.md) (`-SkipSpaBuild` pitfalls).

## Residual (next polish)

| Gap | Notes |
|-----|-------|
| Rebuild spa-dist | Operators still on pre-HelpTip bundle |
| PD Help 1.2.3 live verify | WordPress-PD `1064b0d` published; tunnel/LAN intermittent — re-check when up |
| PD `help_tip()` helper | WordPress-PD only; not a SPA export |
| Full Auto on Overview | Climate has it; Overview still Want/Got/Colour only |

## Related

- [`WEBUI.md`](WEBUI.md) · [`../qa/DESIGN-AUDIT-7.1.md`](../qa/DESIGN-AUDIT-7.1.md) (DA-P1-1) · [`../FOLLOWUPS.md`](../FOLLOWUPS.md) · [`../ops/LAB-WET-CAL.md`](../ops/LAB-WET-CAL.md)
