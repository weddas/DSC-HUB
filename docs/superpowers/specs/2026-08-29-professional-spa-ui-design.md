# Professional SPA UI redesign (hobby → operator)

**Date:** 2026-08-29  
**Status:** Approved direction — Approach 1 (Mycodo split + kit SoT); ship **A → B → C**  
**Goal:** Restore operator confidence with honest kit model, professional Root/Live, then Settings by blast radius.

## Problem

SURFACE 7.3.0 on Pi still presents a 4-seat hobby desk: pot3/4 OOS cards, “Open POT2 seat”, clipped glow gauges, empty NPK/Rate/dryback, experimental Sankey + blank Three.js canvases, Settings as one Fleet scroll. Interrogate + thermo-nuclear + browser QA (2026-08-29) agree the wound is **model/IA**, not paint.

## Approach (locked)

**Mycodo-style split:** Live/Grow/Tune = ops; Settings = Hub / Brain / Device / API / Network / Server / General by blast radius. One kit SoT. Device funnel: discover → role → in-service → Brain consumes.

Phased delivery (user ordered **A, then B, then C**):

| Pass | Name | Outcome |
|------|------|---------|
| **A** | Kit truth + Root honesty | Probes 1–2 only on Live Root; Probe/Plant language; honest metrics; readable gauges |
| **B** | Live visual system | Overview → Climate → tents → Root → Light: one visual language; one CFM viz; Sankey/Three.js gated or gone |
| **C** | Settings tree | Promote Settings; seven sections; device-add funnel |

Research/interrogate between passes. Reflect when friction repeats.

---

## Pass A — Kit truth + Root honesty (this pass)

### A1. Kit source of truth

- Export `KIT_PROBE_NUMBERS = [1, 2] as const` (or `ACTIVE_PROBES`) from `seatModel.ts`.
- `ALL_POT_NUMBERS = [1,2,3,4]` remains only for **Device → Advanced restore** / entity map completeness — **not** for Live Root, honesty rail OOS nag, Fleet kit pulse defaults, or idle-home options.
- Root, `sensorHonesty` pot OOS list, TuneFleet inventory toggles (default), Kit Pulse spokes, `IDLE_POT_OPTIONS` → **KIT_PROBE_NUMBERS only**.
- Do not render planned-OOS 3/4 as Live cards. Subtitle: `N of 2 probes in service` (never “of 4 pots”).

### A2. Vocabulary

| Term | Meaning | UI |
|------|---------|-----|
| **Probe N** | Hardware node (`dsc_probeN`) | Card title, inventory |
| **Plant** | Roster organism | Plant name on card; drawer title |
| **Assignment** | Plant ↔ probe link | Not “seat” |

Kill chrome: “POT”, “Seat”, “Open … seat”. Card click / one “Open plant” control opens drawer. Query may stay `?pot=` internally until a later rename; operator-visible copy uses Probe/Plant.

### A3. In-service SoT

Root and Live use `isPotInServiceWithFleet` (inventory first, helper mirror). No dual story vs Fleet toggles.

### A4. Metrics honesty (Root)

| Metric | Rule |
|--------|------|
| Moisture, soil °C, EC, pH | `useHeldReading` + fleet map ids Root actually reads (`soil_ec` aliases resolved) |
| Dryback, moisture rate | Show value only if entity/fleet metric exists; else **No channel** / omit gauge — not empty dial pretending scale |
| N / P / K | Same hold path as Rate **or** hide chips until mapped; if shown and EC-derived, label **from EC** — never SoftCal as independent |

Fix `ENTITY_FLEET_MAP` / `potGotEntity` / `useHeldReading` so EC (and dryback/rate if present on bus) resolve on Pi path. Align CSS class `dsc-pot-card` with JSX (rename scar).

### A5. Gauges (Root)

- **Layout:** primary instruments in one **horizontal** row (wrap only below ~640px); NPK/Rate as compact chips under EC, not peer gauges.
- **Geometry:** 180° top semicircle or horizontal bar with **printed min / mid / max** and Want edges as numbers.
- **Glow:** single treatment (SVG **or** CSS, not both); expand viewBox / `overflow: visible` so glow never clips.
- Delete dead `segments` prop **or** actually render labeled guide — no lying API.

### A6. Out of pass A

- Full Settings tree (C).
- Climate Sankey / Three.js / Twin resize (B) — except: do not expand pot3/4 into those surfaces while touching honesty.
- Stage SoT split (Amnesia Late vs Early) — file under Grow follow-ups; mention in honesty if it confuses Root.

### A7. Verification (A done when)

Browser on `.48:8787` `#/live/root`:

1. No POT 3 / POT 4 cards.
2. No “Open … seat” / “POT2” chrome (Probe/Plant only).
3. Subtitle uses 2-probe kit.
4. Moisture/EC/pH show held values when bus has data; NPK either values+label or absent — not four permanent `—` chips without reason.
5. Gauge glow not clipped; min/max visible.
6. Create/delete plant still works; roster refresh regression not worsened.

---

## Pass B — Live visual system (scoped)

One composition language across Live secondaries. **One** CFM surface (`AirPathMap`); remove or feature-flag Sankey + R3F airflow/Twin until canvas resize works. Horizontal Want/Got where Root set the pattern. Font scale tokens (no random micro-labels). Demoted Twin/Mission/Dash stay demoted; blank Twin must not ship as “Orbit” theater.

## Pass C — Settings (scoped)

Promote Settings out of Fleet dump. Sections: **Hub / Brain / Device / API / Network / Server / General**. Device: discover → assign → in-service. Inventory group “Probes” not “Pots”. OTA/apply honesty closed loops (SETTINGS-AUDIT-7.1).

---

## Non-goals (all passes)

- Fake data for missing sensors.
- Expanding kit back to 4 probes without operator Device restore.
- Purple-glow hobby restyle without SoT fix.

## References

- Interrogate A/C + thermo-nuclear 2026-08-29; browser QA `docs/FOLLOWUPS.md` 2026-08-29; `docs/qa-screenshots-2026-08-29/`.
- OSS IA: Mycodo Data vs Setup vs Configure; ESPHome Adopt; HA Settings split; prior OSS comparison in session.
