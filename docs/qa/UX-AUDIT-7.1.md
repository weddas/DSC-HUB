# UX audit — DSC-HUB 7.1 Pi SPA (mental model / first-run)

**Date:** 2026-08-27  
**Brain:** `http://192.168.86.48:8787/` (`dsc-brain.local`) · surface **7.1.0** · fleet firmware **7.0.0.0**  
**Not:** `192.168.86.30` (different MAC; not the Brain)  
**Question:** Can a tired grower understand and trust the product in 60 seconds?  
**Method:** First-time operator walk in Cursor browser. No network apply, flash, demand ON, commit plant, or pot `in_service`.  
**Live `/fleet` this pass:** `hub.online=true`, panel online, pot1/2/4 online, pot3 inventory OOS, grow stage **Off**, clone mode **Custom**, priority tent **2x4 Clone**, heatmat demand/relay ON, SF1000 on at brightness 1.

Sibling audits (do not conflate):

| Doc | Question |
|-----|----------|
| [`DESIGN-AUDIT-7.1.md`](DESIGN-AUDIT-7.1.md) | Does it look like a product? |
| [`INTERACTIVE-AUDIT-7.1.md`](INTERACTIVE-AUDIT-7.1.md) | Does each control behave? |
| [`WORKFLOW-AUDIT-7.1.md`](WORKFLOW-AUDIT-7.1.md) | Can the grower finish each job? |
| **This file** | Can they form a true picture of tents / pots / appliances / Brain? |

---

## 60-second first-run verdict

**No.** A tired grower can see that two tents have air numbers. They cannot tell what this product *is*, which room is the clone tent, whether the Brain is up, or whether pot 1 is empty or lying.

Landing (`/` → `#/live/overview`) at 1920×1080:

1. Brand reads **“DSC - A Plausible Deniability Project.”** — a joke, not a grow console.
2. The only global status chip is **KIT HONEST**. That is an internal sensor-gap term. It does not mean the crop is fine.
3. Four primary tabs + **nine** Live destinations. No “you are here” beyond a green pill. Overview also offers **Climate** and **Mission** as page actions — a third way to leave the landing page.
4. Nine T/RH/VPD gauges. Legend is good (green/amber/red/grey). Labels are **4×8 / 2×4 / Room / Root**, not “flower tent / clone tent.”
5. **No hub / Brain chip on Overview.** Dash and Mission have `HUB ONLINE` / `HUB LINK`. The page a first-timer gets does not.
6. Root strip: **P1 / P3 / P4 = `—` / no data**, P2 = 19.5% amber. `/fleet` pot1 moisture was **21.8%** the same minute. Empty and live are indistinguishable. Cross-ref **WF-P0-1**.
7. Grow log is a firehose: dozens of `Stage - Off; Clone - Custom` lines plus dehumidifier chatter. Last night’s dark-period warnings are buried.
8. Closed History drawer stays in the accessibility tree with the line *“same series as HA Home gauge popups.”*

After 60 seconds the mental model is: “a dense engineering dashboard about 4×8 and 2×4.” It is not: “the Brain is running; this tent is veg; these pots have plants; that appliance is on purpose.”

**Shippable for a non-engineer operator: no.** An engineer who already named the kit can glance climate. A grower who did not build it cannot trust it.

---

## Top 8 UX defects

| # | ID | Pri | Defect |
|---|----|-----|--------|
| 1 | UX-P0-1 | P0 | Live has **three homes** (Overview, Mission, Dash titled “Home”) plus Twin. Nine secondary tabs mix places (4×8, 2×4) with jobs (Climate, Light, Root). First-run question “where do I stand?” has no single answer. |
| 2 | UX-P0-2 | P0 | Tent names are not one word. Nav = **4×8 / 2×4**. Hub selects = **4x8 Main / 2x4 Clone**. Clone mode = **Mother / Custom / Follow 4x8**. Grow log = **Clone - Custom** and **clone mode: Mother**. Climate subtitle calls them “grow rooms and transfer/storage.” Same two boxes, four vocabularies. Cross-ref **REL-P1-4**. |
| 3 | UX-P0-3 | P0 | Landing **omits Brain/hub health**. KIT HONEST is the only chrome status. `/fleet` `hub.online=true` this pass; Overview does not say so. Dash/Mission chips are a different product. |
| 4 | UX-P0-4 | P0 | **Empty ≠ zero ≠ out of service ≠ live.** Overview P1 `no data` while fleet has moisture; P3 looks like P1 (OOS hidden as empty); P4 is a true empty (online, null sensors). Grower cannot tell which. Cross-ref **WF-P0-1**, **WF-P1-3**. |
| 5 | UX-P1-1 | P1 | User-visible leftovers: brand joke; **KIT HONEST**; Climate **“umbrella lung”**; Twin **“hass ticks”**; History **“HA Home gauge popups”**; Want fields **“no plant/stage rail”**; Settings **ESPHome / sonoff_*** role slugs. Copy purge in DESIGN-AUDIT did not finish the first-run surfaces. |
| 6 | UX-P1-2 | P1 | Cognitive load: Overview 9 gauges + 4 fan chips + 7 running chips + 4 pot chips + 4 pot gauges + 50+ grow-log rows. Climate is a command wall (~97 interactive refs). Nothing tells a tired person what matters *now*. |
| 7 | UX-P1-3 | P1 | A11y: gauge buttons named `In-band range Want edge Want edge Target 24.3 °C 4×8 T`; closed History drawer leaks Close×2 + timespan on every route (cross-ref **IA-P1-1**); secondary tabs `min-height: 40px`; Climate has unnamed buttons. |
| 8 | UX-P1-4 | P1 | Error recovery is a black page. Hash change can leave `#root` empty (title flipped to 7.0.0 once). No error boundary, no “reload Overview.” 404 exists (`Go Overview`) but render death does not use it. Cross-ref **WF-P1-7**. |

---

## Information architecture

### Nav label vs what the page does

| Nav | Title on page | What it actually is | First-run fit |
|-----|---------------|---------------------|---------------|
| Live | — | Section, not a page. Lands on Overview. | OK if Overview is *the* home. It is not exclusive. |
| Overview | Overview | Climate glance + fans + running + pots + grow log. **No hub chip.** | Best landing. Still a subset of Dash. |
| Mission | Mission | “Triage glance — Next, faults, seats, lung.” | Second home. Engineer word. |
| Dash | **Home** | Lovelace-parity wall: hub strip, system map, CannaLib, narrator. | Third home. Nav ≠ title. |
| Twin | Twin | 3D house + air path. Subtitle still mentions hass ticks. | “Twin” is not a grower word. |
| Climate | Climate | Command + wants + triad + fans + efficacy. | Correct name; too much for glance. |
| 4×8 | 4×8 tent | Tent cockpit. | Size, not role. |
| 2×4 | 2×4 tent | Clone/mother cockpit. | Size, not role. |
| Root | Root | Pot matrix. | OK once you know “root” = pots. |
| Light | Light | Photoperiod desk. 4×8 “Got” is a **window**, not a lamp. | Name oversells. |
| Grow | Compose (default) | Soil blend / commit / Want handoff. | First Grow click is **build**, not “what’s planted.” |
| Research | Research | CannaLib catalog. | Fine as a library. |
| Roster | Roster | Seats. | This should be Grow’s landing. |
| Tune | Learning (default) | Fan-curve sample/accept. | Name overlaps **Calibrate**. |
| Analytics | Analytics | Root moisture charts. Climate charts live on Climate. | Honest subtitle; odd home for Tune. |
| Fleet | Fleet | Kit pulse + in-service (toggles **dead** on Pi). | “Fleet” = appliances + pots + hub. |
| Calibrate | Calibrate | Fan + light curves. | Same job as Learning, different door. |
| Settings | Settings | Inventory, network, OTA, integrations. | Engineer shop. |

### Overview as landing

`/` and `/live` redirect to Overview. That is the right default. It is then undermined by:

- Overview header actions to Climate and Mission.
- Nine Live siblings of equal visual weight.
- Fleet’s first sub-tab also named **Overview** — `aria-current` on Fleet Overview looks like Live Overview if you only read the second row.

### Dead ends / “where am I?”

- Clicking Mission or Twin **changed the hash** while the heading and gauges stayed on Overview, then a later snapshot was a **blank `#0b0e14` page** (0 refs). Brand + KIT HONEST vanished. No “something broke.”
- `/ops/home` is Dash but stays under Live (sectionFromPath). URL says `ops`; chrome says Live → Dash → title Home.
- Unknown hash has a real 404 (`Not found` + **Go Overview**). Render crash does not.
- Grow Compose → “open Roster to assign a seat” is the only breadcrumb. There is no “you have 0 plants.”
- Light still in the fade-masked overflow on a narrow Live row — easy to miss that Light exists.

---

## Language

| Surface (live) | Copy | Grower reading |
|----------------|------|----------------|
| Brand | DSC - A Plausible Deniability Project. | Not a product name. |
| Honesty rail | KIT HONEST | Sounds like a joke or a lie-detector. Means “no sensor-gap chips.” |
| Overview subtitle | Operational glance — alerts, area vitals, duties, root strip, grow log. | Engineer inventory of widgets. |
| Climate subtitle | Room is the umbrella lung. … T, RH, VPD only together. | Metaphor + triad rule, not “set the room.” |
| Climate fields | `no plant/stage rail` (accessible name on every Want spinner) | Debug string. Stage is **Off**, so the rail is empty — say that. |
| Twin body | “no longer snaps home on hass ticks” | HA leftover in the product. |
| History drawer | “same series as HA Home gauge popups” | HA leftover. Always in the a11y tree. |
| Mission | Climate Want, lung, HUB ONLINE | Command language, not crop language. |
| Compose | roster commit, Want handoff | Pipeline jargon. |
| Settings cards | `sonoff_dehumidifier`, Role `panel`, seat `control` | Hardware SKUs. CONTROL OFFLINE while `/fleet.panel.online=true` (WF-P1-2). |
| Running chips | HEAT, COOL, HUM, DEHUM, MAT, **C-HUM**, SF1000 | C-HUM = clone mister. SF1000 = the 2×4 lamp. Not labeled as such. |
| Grow log | `Stage - Off; Clone - Custom` × tens; `clone mode: Mother`; `Late (Push) Vegetative` | Stage list vs clone-mode list vs tent size. |

Stage option list on the hub (live): Germination → … → Late (Push) Vegetative → … → Dry Mode → Custom → **Off**. Clone mode: Follow 4x8 / Clones & Seedlings / **Mother** / Custom / Off. Those are three different axes (4×8 recipe, 2×4 recipe, photoperiod parent). The UI never draws that triangle.

---

## Cognitive load

- **Overview** is a dashboard of dashboards: band grid (filter All/4×8/2×4/Room that still showed all three rows when 4×8 was selected), fan duties, running, pot chips *and* pot gauges, grow log. Two representations of pots fight.
- **Grow log** polls 80 events / 24 h. Demand flicker and `Stage - Off; Clone - Custom` drown the four dark-period warnings. No filter, no “plants only.”
- **Climate** stacks command chips, strategy, priority tent, six appliance tiles, room KPIs, two tent Want editors, triad gauges, air path, fan sliders, efficacy (“buying kW because the lung could not transfer”), crop scheduler. First-run cannot find “is it too dry?”
- **Settings** cards repeat Online + In service + a footer checkbox for the same fact. Empty `—` rows (MAC, Function, Placement) add noise, not honesty.
- Gauges are labeled (T / RH / VPD). That is better than unlabeled. The accessible *name* is still SVG title soup, so a screen reader does not get “4×8 temperature 24.3, in band.”

---

## Trust (stale vs live, empty vs zero, hub vs fleet)

| Claim | Live fact this pass | Grower conclusion |
|-------|---------------------|-------------------|
| KIT HONEST | Honesty rail empty | “Kit is fine” — no statement about plants or hub. |
| Overview pots | P1/P3/P4 `no data`, P2 19.5% | P1 looks dead. `/fleet` pot1 `moisture_pct=21.8`. |
| P3 | Same grey empty as P1 | Inventory OOS, not in `/fleet.pots`. Should say **out of service**. |
| P4 | Grey empty | Online, null sensors — a true empty. Same chrome as P1/P3. |
| Overview hub | Absent | Cannot know if the Brain is up without opening Dash/Mission/Settings. |
| Settings CONTROL | OFFLINE, Online: no | `/fleet.panel.online=true` at 10.42.0.11, fw 7.0.0.0. |
| Settings In service | Checked on OFFLINE control | Offline ≠ out of service. Two greens/reds, one checkbox. |
| SURFACE 7.1.0 vs Fleet 7.0.0.0 | Both shown | Two version stories (SPA vs firmware). Fine if labeled; Overview footer is easy to miss. |
| Room VPD | Climate `— kPa` while 4×8/2×4 have VPD | Room triad is incomplete; looks like a fault. |
| Held / stale | Not seen on Overview this pass (numbers were moving) | HELD VITALS exists on Mission only. |

Historical **HUB OFFLINE vs `/fleet` online** is already in FOLLOWUPS. This walk’s complementary finding: Overview does not show the chip at all, so the grower cannot even be *wrong* about hub state — they never form it.

---

## Accessibility

| Check | Live / code | Verdict |
|-------|-------------|---------|
| Contrast (body `#e8eef8` on `#0b0e14`) | Pass | Primary text is fine. |
| Muted / idle tabs `#8b95a8` on `#0b0e14` | ~6.5:1 | AA for 14px+; tight for 12px legend and SURFACE. |
| Focus | `focus-visible` teal ring on tabs/buttons | Present. |
| Hit targets | Primary tabs 44px; secondary 40px; chips smaller | Secondary row fails 44×44. |
| Reduced motion | `@media (prefers-reduced-motion)` on page/btn/tab/pulse + charts | Present. Not verified with the OS flag this pass. |
| Gauge names | Concatenated SVG titles | Fail. Cross-ref **IA-P1-4**. |
| History drawer closed | `aria-hidden` on root, but `role="dialog"` + focusable Close/1h/6h… still in snapshot | Fail. Cross-ref **IA-P1-1**. |
| Climate Want | `aria` name includes `no plant/stage rail` | Fail. |
| Climate | Several `role="button"` with empty names | Fail. |
| Brand link | Entire joke string is the accessible name | Fail as a landmark. |
| Skip link / live region | None observed | Fail for “where am I after nav.” |

---

## Consistency (color + buttons + model)

**Color (gauges — agree with DESIGN pass 2):** green in-band, amber drifting, red alert, grey no data. Overview legend states this. **Running chips break it:** COOL and C-HUM used **amber** to mean *on*, not *drifting*. Same amber as 4×8 VPD / Root 18.4 °C. Teal is both “no band configured” and the Climate action button.

**Button hierarchy:** Overview Climate = teal, Mission = default. Compose Commit is primary (code). Climate Full Auto is a large green card among equal demand tiles (behavior is INTERACTIVE). Status chips and nav pills share the same rounded language — glance vs go is weak.

**Model map a grower needs (not drawn):**

```
Brain (Pi / DSC-HUB / SURFACE)  →  Hub radio  →  tents + appliances + pots
     never named on Overview         "HUB" on Dash/Mission only
4×8 = flower/main tent
2×4 = clone/mother tent (mode, not size)
Pots 1–4 = plants (or empty, or OOS)
Sonoffs = Heat / Hum / Dehum / Mat  (C-HUM = mister)
```

Live chrome uses **DSC / KIT / HUB / SURFACE / Fleet / Pi appliance** and never **Brain**. The Wi-Fi is `DSC-Brain`. Three names for one box.

---

## Mobile / 390px

Live 390px pass **did not complete** — Cursor browser lost the tab (sibling hash-jumps + blank `#root`). From CSS + the 1920 walk:

- Live secondary is a horizontal scroller with a right-edge fade (`mask-image`). Nine pills will clip **Light** (and maybe Root) with no “more” control.
- Secondary `min-height: 40px` is worse on a phone.
- Overview band grid is 3×3 — at 390px it will stack into a long number list. Filter All/4×8/2×4/Room becomes the only way to cut load, but 4×8 selected still showed all rows on desktop.

Treat a real 390px walk as a follow-up, not a pass.

---

## Route walk (this pass)

| Route | How seen | First-run note |
|-------|----------|----------------|
| `#/live/overview` | Live screenshot + a11y tree | Landing. See 60-second verdict. |
| `#/live/mission` | Click | Hash changed; content stayed Overview, then blank. |
| `#/live/climate` | Live screenshot + a11y | Command wall. Room VPD empty. `no plant/stage rail`. |
| `#/live/twin` | Click | Hash changed; Overview content remained. |
| `#/fleet` | Interactive snapshot | Kit Pulse + dead in-service toggles. Duplicate Hub/Heater names. |
| `#/fleet/settings` | Live screenshot | CONTROL OFFLINE vs panel online. ESPHome / sonoff slugs. |
| `#/ops/home`, `#/live/4x8`, `#/live/2x4`, `#/live/root`, `#/live/light`, Grow/Tune | Code + sibling live notes | Titles in the IA table. Twin/4×8/2×4 share one 3D keep-alive. |
| Unknown hash | Code | 404 + Go Overview — good, unused on crash. |

Destructive controls were not pressed.

---

## What is already honest

- Grey `—` / `no data` on empty gauges (no fake zero). Design pass 2.
- Band legend in prose, not color-only.
- 404 is explicit, not a silent Mission redirect.
- Compose/Research copy says empty catalog fields stay empty.
- pot3 OOS is omitted from some Live surfaces on purpose — but Overview still paints a P3 hole that looks like P1.

---

## Recommended cut (mental model only)

Not a build plan. If one pass is allowed:

1. **One Live home** (Overview). Park Mission + Dash behind Fleet or a single “More” menu. Twin stays a view of the tents, not a peer of Climate.
2. **One tent vocabulary** on chrome: Flower tent / Clone tent (size in a subtitle). Kill Mother-as-tent.
3. **Hub chip on Overview** from `/fleet.hub.online`. Rename KIT HONEST to “Sensors OK” or hide when idle.
4. **Pot strip:** live value or “no probe” or “out of service” — never the same `—`.
5. Accessible name = `4×8 temperature 24.3 degrees, in band`. Unmount closed drawers. Error boundary → Go Overview.

---

**Audit verdict:** **Not shippable** for a non-engineer operator. Climate numbers render. The product story does not.
