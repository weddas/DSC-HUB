# Gauge audit — DSC-HUB 7.1

**Date:** 2026-08-27  
**Surface:** Pi SPA `http://192.168.86.48:8787/` (`dsc-brain.local`). `.30` is not the Brain.  
**Live bundle:** `index-DwSYxFmR.js` · `/health` surface **7.1.0** · hub FW **7.0.0.0** · `hub.online=true`  
**Scope:** circular / linear gauges, meters, bars, setpoint bands only. Distinct from UX-AUDIT and DESIGN-AUDIT (broader UI). DESIGN-AUDIT Pass 2 already remapped colors; this pass checks whether the painted story is operator-honest.  
**Safety:** read-only. No demand, no setpoint writes, pot3 left OOS.

**Verdict:** empty / no-data treatment is honest. Rainbow fragment bars are gone from the DOM. **The system is not operator-honest** — the same reading tells two stories across Overview vs Climate vs Root, and Room is scored against tent Want.

| Headline | Result |
|---|---|
| Gauge widgets counted | **44 ArcGauge call sites**; **42 painted** this morning (13 Overview + 9 Climate + 20 Root). Plus 7 Climate Got/Want bars, 12 Kit Pulse rings, 1 tank cutaway, 3 Compose mix sliders, 3 DutyStrips. Light 2 progress rings verified in code + fleet hours (browser tab stolen before Light screenshot). |
| Semantic fail rate | **~30%** of banded / claimed-severity gauges on the live pass (7 of 23). See [Honesty](#honesty). |
| Leftover rainbow | **None painted.** Dead API leftover: `segments` still passed, `bandGuideSegments` still builds red\|amber\|green\|amber\|red, `ArcGauge` never draws them. |
| Operator-honest? | **No**, as a system. Grey `—` / `no data` / no fake zero is honest. Bands, scales, and P1 mapping are not. |

Screenshots: [`screens-7.1.2/gauge-audit-overview-bands.png`](screens-7.1.2/gauge-audit-overview-bands.png), [`gauge-audit-kitpulse-fleet.png`](screens-7.1.2/gauge-audit-kitpulse-fleet.png), [`gauge-audit-compose-mix.png`](screens-7.1.2/gauge-audit-compose-mix.png). Climate triad + Root pots were **DOM-extracted** (path count, stroke hex, class, number). Shared IDE browser was contested by sibling audits (`.30` Settings tabs); hash-jumps are unreliable (WF-P1-7).

---

## Color rule (code)

One function: `zoneTone` in `lib/zoneTone.ts`. `ArcGauge` and `GotWantBarRow` both call it.

| Tone | Color | When |
|---|---|---|
| muted | `#8b95a8` | `!Number.isFinite(value)` or `available === false` — wins over stale. Empty never paints HELD. |
| stale | `#ffb74d` | last-good hold |
| warn | `#ffb74d` | outside band by **> 1×** and **≤ 3×** grace margin |
| critical | `#ef5350` | outside band by **> 3×** margin, or `fault` |
| ok + band | `#66bb6a` | inside band ± 1× margin |
| ok, no band | `#26c6da` teal | live reading, no Want configured (progress counters, room triad, unbanded soil/pH) |

Margin = `max(12% of band span, 0.05)`, or **1 °C floor** when `unit === "°C"` (`defaultBandMargin`). Temp appliance deadband is **±2 °C** around target, so green extends to **±3 °C** from setpoint.

`useHeldReading` never maps unavailable → 0. Empty `ArcGauge`: grey track only, `stroke-linecap="butt"`, `—` / `no data`, no value path, no ticks, no orphaned handle.

Needle is a dash-length arc from min, not a pointer. On every extracted live gauge the dash fraction matched `(value - min) / (max - min)` to three decimals. Number and arc agree **on one page**. They disagree **across pages** when min/max differ (4×8 T 10–40 vs 15–35; 2×4 VPD 0–2 vs 0–2.5).

---

## Leftover rainbow

DESIGN-AUDIT Pass 2 removed unlabeled five-arc fragment bars. **Confirmed gone live:**

- Banded gauges: exactly **3** paths (grey track + one green in-band slice `opacity=0.38` titled “In-band range” + value stroke).
- Empty gauges: **1** path, butt cap, no value, no ticks.
- No `colorAtValue`, no 5-opacity fragment chips.

Leftover in source (not painted):

- `ArcGauge` still accepts unused `segments?: GaugeSegment[]`.
- Every Climate / Overview / Root call site still passes `segments={tempSegments(...)}` etc.
- `gaugeTheme.bandGuideSegments` still returns the five-color rainbow array. Dead.

---

## Live snapshot (2026-08-27 ~06:35 AEST)

`/fleet` hub: 4×8 **23.0 → 22.6 °C** / **61 → 62.3% RH** / **1.10 → 1.03 kPa**; 2×4 **23.9 → 23.7 °C** / **63.1 → 63.5% RH** / **1.09 → 1.07 kPa**; room **23.9 → 23.8 °C** / **60.9 → 60.6% RH**. Want: 4×8 T **26**, RH **50–60**, VPD **1.0–1.2**; 2×4 T **25**, RH **55–65**, VPD **0.8–1.1**; mat **20–22 °C**.  
Pots: pot1 **21.8% / 18.4 °C / pH 6.30**; pot2 **19.4% / 18.5 °C / pH 7.20**; pot3 absent (OOS); pot4 online, moisture/soil/pH **null**. Light delivered **2.52 h**. Grow-mat demand ON. pot3 not touched.

---

## Per-gauge table

| Route | Metric | Data source | Color rule | Empty / error | Live this pass |
|---|---|---|---|---|---|
| Overview `/live/overview` Bands | 4×8 T | `useHeldReading(sensor.dsc_hub_tent_temperature)` → fleet `temp_c` | ±2 °C around `number.dsc_hub_target_temp` + 1 °C grace | grey `—` | **22.6 °C amber** (want 26; green until 23.0) |
| Overview | 4×8 RH | `tent_humidity` / `rh_pct` | RH min/max + 12% | grey `—` | **62.3% amber** (want 50–60; 61.0 was green) |
| Overview | 4×8 VPD | `vpd_kpa` | VPD min/max + 12% | grey `—` | **1.03 kPa green** · scale 0–2.5 |
| Overview | 2×4 T | `clone_temperature` | ±2 + 1 °C around clone target 25 | grey `—` | **23.7 °C green** |
| Overview | 2×4 RH | `clone_humidity` | clone RH 55–65 + 12% | grey `—` | **63.5% green** |
| Overview | 2×4 VPD | `clone_vpd_kpa` | 0.8–1.1 + 12% | grey `—` | **1.07 kPa green** · **scale 0–2** (Climate uses 0–2.5) |
| Overview | Room T | `room_temperature` | **same ±2 as 4×8 tent target** | grey `—` | **23.8 °C green** — lung scored as tent |
| Overview | Room RH | `room_humidity` | **same 50–60 as 4×8** | grey `—` | **60.6% green** — lung scored as tent |
| Overview | Root | `sensor.dsc_coldest_root_zone_temp` | mat 20–22 + 1 °C | grey `—` | **18.4 °C amber** · sparkline amber |
| Overview Root & tank | P1 % | `num(sensor.dsc_probe1_soil_moisture)` — **not** in `ENTITY_FLEET_MAP` | hardcoded **30–70** | grey `—` / `no data` | **grey empty** while `/fleet` pot1 **21.8%** (WF-P0-1) |
| Overview | P2 % | `sensor.dsc_probe2_soil_moisture` | 30–70 | grey | **19.4% amber** · dash 19.4% of 0–100 |
| Overview | P3 % | `sensor.dsc_probe3_soil_moisture` | 30–70 | grey | **grey empty** (OOS, no pot in `/fleet`) |
| Overview | P4 % | `sensor.dsc_probe4_soil_moisture` | 30–70 | grey | **grey empty** (online, null moisture — honest) |
| Climate `/live/climate` triad | Room T | held `room_temp_c` | **no band → teal** | grey | **23.9 °C teal** · extrema ticks only |
| Climate | Room RH | held `room_rh_pct` | no band → teal | grey | **60.9% teal** |
| Climate | Room VPD | `sensor.dsc_hub_room_vpd_kpa` (not on fleet map) | no band | grey | **`—` / `no data`** while T+RH live |
| Climate | 2×4 T / RH / VPD | clone held + Want | ±2 / RH / VPD bands | grey | all **green** · T scale **15–35** |
| Climate | 4×8 T / RH / VPD | tent held + Want | ±2 / RH / VPD | grey | T **23.0 green** (3 ° below 26); RH **61.0 green** (1% over 60); VPD **1.10 green** · T scale **15–35** |
| Climate Got/Want | Room T | held T; Want = 24h mean | **no min/max band → always neon** | muted row | Got 23.9 · Want **—** (mean missing) · fill green |
| Climate Got/Want | 2×4 / 4×8 T | held T; Want = target only | **no ±2 band → always neon** | muted | **4×8 Got 23 Want 26 still green** |
| Climate Got/Want | 2×4 / 4×8 RH, VPD | wantMin/wantMax | `zoneTone` + 12% | muted | all neon this pass (grace) |
| Root `/live/root` | P1 Moisture | `useHeldReading(potGotEntity moisture)` | `potWantBand` or **default 0–45** | grey | **21.8% green** (same metric Overview empty / 30–70 would be amber) |
| Root | P1 Soil °C | `sensor.dsc_probe1_soil_temperature` | **no band → teal** | grey | **18.4 °C teal** (Overview Root same number **amber**) |
| Root | P1 Dryback / EC | dryback / EC entities | dryback 0–45 if moisture band max is 45; EC if want exists | grey | both **no data** |
| Root | P1 pH | fleet `ph` | no band → teal | grey | **6.30 teal** · **unit string empty** |
| Root | P2 Moisture | same | default 0–45 | grey | **19.4% green** vs Overview **amber** |
| Root | P2 Soil / pH | soil T / ph | teal | grey | 18.5 °C teal · **7.20 teal** (high, unlabeled) |
| Root | P3 ×5 | held readings | n/a | grey | five **`—` / `no data`**. Kit Pulse says OOS; Root still paints the row (`isPotInService` defaults missing boolean **on** — REL-P0-2). |
| Root | P4 ×5 | null fleet values | n/a | grey | five empty — honest |
| Root | Heat mat DutyStrip | `switch.dsc_hub_grow_mat_demand` history | teal on-windows on grey 24h | empty track | 3.9 h today (KPI) |
| Light `/live/light` | 4×8 / 2×4 Got/Want h | `lights_on_today_*` · target tick = expected hours | **progress, no band → teal** · never red | grey if NaN | code + fleet **2.52 h** delivered; not screenshot (tab lost) |
| Light | DutyStrip ×2 | window / SF1000 24h | teal on-bits | grey track | binary history, not in-band |
| Grow seat (drawer) | Dryback ArcGauge | `dryback_pct` | band 0–45 | grey | not opened this pass |
| Grow seat | Got/Want Moisture/EC/pH | seat want sensors | `zoneTone` if min/max exist | “No target bands” copy | not opened |
| Compose `/grow/compose` | Layer 1–3 sliders | mix editor | teal thumbs · **Σ 0% amber** when mix ≠ 100 | 0% is real zero of an editor | mix empty; not a climate gauge |
| Fleet `/fleet` Kit Pulse | 12 status rings | inventory + relay | teal = hub/running; grey idle/OOS; red dark; dashed OOS | dashed mute, not red hole | 7/11 in service; Heat mat glow; P3 OOS chip; P1/P2/P4 idle |
| Fleet TankCutaway | level / EC / pH / T | tank entities | teal water fill if measured; dashed shell if not; EC strip **always amber** if present; pH lid purple vs grey | no fill at 0 when unmeasured | tank OOS · “Level not measured” |
| Mission / Overview Kit Pulse | same component | same | same | same | constellation, not climate |

Units live: **°C only** (no °F). RH as **%** (not labeled %RH on the numeral — label is “RH”). Moisture as **%** (project never says VWC). VPD **kPa**. pH/EC **unlabeled**. Light **h**.

---

## Honesty

**What is honest**

- Empty is grey `—` / `no data`, not 0. P3/P4 Overview, Room VPD, dryback, EC, pot4 null moisture.
- Stale is amber + `HELD`, and empty wins over stale (`zoneTone` + `useHeldReading`).
- Number matches needle **on the same scale**.
- Overview Bands legend is printed: *Green = in band · amber = drifting · red = alert · grey = no data*.
- Light hours are documented as a progress counter, not a climate band.
- Kit Pulse chips say “idle” / “out of service” in words, not color alone.

**What is not**

1. **P1 Overview empty, Root 21.8% green, `/fleet` 21.8%.** Mapping hole (`ENTITY_FLEET_MAP` has `pot1_got_moisture` only). WF-P0-1.
2. **P2 19.4% amber on Overview (30–70) and green on Root (default 0–45).** Same soil, two stories. `potWantBand` falls through to a dryback-shaped band when plant Want sensors are missing (`lo > 0` also rejects a real 0 min).
3. **Room T/RH use tent Want on Overview and no band (teal) on Climate.** Lung is not the 4×8.
4. **4×8 T 23.0 °C vs Want 26 painted green.** ±2 deadband + 1 °C floor = ±3 °C of “in band.” Tripped amber only after 22.7.
5. **Got/Want T bars are always neon** — they pass a single `want`, so `zoneTone` has no band.
6. **4×8 T scale 10–40 (Overview) vs 15–35 (Climate).** Same 23 °C, different arc fill. **2×4 VPD 0–2 vs 0–2.5.**
7. **18.4 °C is amber Root (mat band) and teal Soil °C (no band).**
8. **pH 7.20 teal “ok”** with no band and no unit — looks healthy.

Climate charts use **±1.5 °C** for T series while gauges use **±2 °C** (`severityColor` also skips the 1 °C floor). Third story, not painted on the rings.

---

## Accessibility

| Check | Live |
|---|---|
| Contrast (numeral `#e8eef8` on `#0b0e14`) | Pass |
| Unit `#8b95a8` 10px | Borderline; empty “no data” readable |
| In-band slice opacity 0.38 | Easy to miss; ticks carry Want |
| Color-only meaning | **Fail off Overview.** Climate triad has no legend. Green/amber/red is the status channel. Clickable name is SVG title soup (`In-band range Want edge … 22.6 °C 4×8 T`) — number is announced, **“drifting” is not** (IA-P1-4). |
| `aria-label` | Label only on the SVG; no `aria-valuenow` / `aria-valuetext` |
| Empty | Button name `— no data P1` — good |
| Kit Pulse SVG nodes | Unnamed `role="button"` (IA-P1-8) |
| Reduced motion | Gauge live/breathe animations gated |

---

## P0 / P1 / P2

### P0

| ID | Defect | Cross-ref |
|---|---|---|
| **GAUGE-P0-1** | Overview vs Root moisture two-story (30–70 vs `potWantBand` / default 0–45). Live P2 19.4% amber vs green. | Elevates existing FOLLOWUPS “Overview pot moisture band ≠ Root pot want” |
| **GAUGE-P0-2** | Overview P1 grey empty while fleet + Root show 21.8%. | Already **WF-P0-1** — do not fix twice; gauge pass confirms |

### P1

| ID | Defect |
|---|---|
| **GAUGE-P1-1** | Overview Room T/RH inherit 4×8 Want. Climate room is correctly unbanded teal. Drop tent bands on the lung, or give Room its own rail. |
| **GAUGE-P1-2** | Climate Got/Want T (and Room T) pass a single `want` → fill always `--dsc-neon` even 3 ° off target. Pass `wantMin/wantMax` = ±2 (or the same band the ring uses). |
| **GAUGE-P1-3** | `potWantBand` moisture default `{0,45}` is a dryback shape. Missing plant rail should be **unbanded teal**, not fake in-band. `lo > 0` rejects a legitimate 0 min. |
| **GAUGE-P1-4** | Shared min/max per metric: 4×8 T 10–40 vs 15–35; 2×4 VPD 0–2 vs 0–2.5. Needle must mean the same thing on every page. |
| **GAUGE-P1-5** | 4×8 T grace (±2 + 1 °C) paints a 3 ° miss green. Either tighten the floor or show “3 ° below Want” in the label so green is not the only story. |
| **GAUGE-P1-6** | Room VPD entity is missing from the fleet map; triad shows `—` beside live T+RH. Map or compute kPa; do not invent. |
| **GAUGE-P1-7** | Root pot3 still renders five empty gauges while Kit Pulse / inventory say OOS (`isPotInService` default on). REL-P0-2. Hide the row, do not put pot3 in service. |

### P2

- Delete unused `segments` prop + `bandGuideSegments` callers (rainbow API leftover).
- pH / EC unit strings (`""` live).
- Overview pot gauges omit `stale`.
- Chart `severityColor` missing °C 1 ° floor; chart T band ±1.5 vs gauge ±2.
- In-band highlight contrast; visible Want labels (not title-only).
- `aria-valuetext` with tone word (in band / drifting / alert / no data).
- Tank EC strip always amber; DutyStrip teal is duty, not severity — keep, but do not reuse as climate language.
- Moisture never labeled VWC (project-wide `%` — acceptable if consistent).
- Compose layer sliders are editors (teal); Σ 0% amber is honest mix-incomplete.

---

## Top 8 defects

1. Overview P1 empty vs live 21.8% (WF-P0-1 / GAUGE-P0-2).
2. Overview P2 19.4% amber vs Root 19.4% green (GAUGE-P0-1).
3. Room T/RH scored as tent on Overview, teal-unbanded on Climate (GAUGE-P1-1).
4. 4×8 T 23.0 °C / Want 26 painted green (GAUGE-P1-5).
5. Got/Want T bars always green (GAUGE-P1-2).
6. 4×8 T and 2×4 VPD scales disagree across pages (GAUGE-P1-4).
7. 18.4 °C Root amber vs Soil °C teal; pH 7.20 teal with no band/unit.
8. pot3 five empty Root gauges vs Kit Pulse OOS (GAUGE-P1-7 / REL-P0-2). Rainbow **not** in this list — it is gone on the glass.

---

## Kit Pulse / Tank / Compose (in scope, not climate rings)

- **Kit Pulse:** status constellation. Teal ≠ in-band. Heat mat glow matched demand ON. P3 chip “out of service.” Idle in-service pots are outlined, not greenwashed as healthy soil. 7/11 matches chip text; dashed edges also mark idle appliances — slightly noisier than the chips, not a rainbow.
- **Tank:** OOS + “Level not measured”; no fake water column. Decorative teal/purple/amber, not zoneTone.
- **Compose:** no ArcGauge. Layer sliders at 0% with Σ 0% amber. Editor, not a meter of the room.

---

## What this pass did not do

- No commit, no deploy, no demand, no setpoint, pot3 not enabled.
- Light rings not screenshot (sibling tabs stole the IDE browser; values from `/fleet` + code).
- Plant-seat drawer / GrowPages Dryback not opened (would be a write-adjacent seat UI).
- Did not clobber DESIGN / INTERACTIVE / WORKFLOW / UX / SETTINGS / ZIGBEE / INPUT / DEVICE audits.
