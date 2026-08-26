# Graph / chart audit — DSC-HUB 7.1

**Date:** 2026-08-27  
**Surface:** Pi SPA `homeassistant/custom_components/dsc_hub/frontend` + Brain `/history`  
**Live:** `http://192.168.86.48:8787/` (Brain). `.30` is not the Brain.  
**Distinct from:** GAUGE-AUDIT (rings / meters / GotWant bars), UX, DESIGN, INTERACTIVE, WORKFLOW, SETTINGS, ZIGBEE, INPUT, DEVICE.

This pass owns **time-series graphs and charts only**: `MultiLineChart`, `Sparkline`, lighting / appliance **DutyStrip** plots. Air-path diagrams, Twin canvas, crop-scheduler lanes, and gauges are out of scope except where they open a history chart.

**Method:** code (source, window, downsample, axes, units, tooltip, empty/error, timezone) then live browser on every route that plots. pot3 stayed OOS. No setpoint writes. No demand fire.

**Screens:** `docs/qa/screens-7.1.2/graph-audit-*`

---

## Verdict

**Charts are not operator-honest.**

| | |
|---|---|
| Graph surfaces counted | **19** |
| P0 + P1 fails | **16** |
| Fail rate | **84%** |
| Closest-to-honest | Climate **6h** Temperature and Humidity (mapped hub series, live, local clock) |
| Operator-honest? | **No** |

6h tent T / RH / VPD traces exist and move with the tent. That is the only working core. Around it: unmapped series that still appear in legends, 48h windows that **drop the newest points**, step-hold that **paints stale values to now**, lighting duty strips that read **0.0h on** while the lamp and windows are on, and a last-value chip that reports **Room** as if it were the tent.

---

## How a chart is built (shared stack)

| Layer | What it does | Honesty risk |
|---|---|---|
| Ingest | `esphome_client` `record_history(seat, metric, value)` ~5s when the reading is numeric | High-rate constants (coldest root) blow the row cap |
| Store | `fleet_history` SQLite | No downsample at write |
| API | `GET /history?entity_id=&hours=` → `history_ops.query_entity_history` | **Unmapped entity → `[]` with HTTP 200** |
| Query | `list_history` `ORDER BY ts ASC LIMIT 2000` | **Keeps oldest 2000, drops newest** |
| Client | `useHistory` → uniform-index downsample (1h/60, 6h/96, 24h/144, 48h/192) | Peaks can vanish; not min/max envelope |
| Merge | `useEntitySeries` + `stepHoldSeries` | Gaps held; **last good extended to `Date.now()`** |
| Draw | `MultiLineChart` SVG (not Recharts) | `lastSyncAt` is discarded (`void lastSyncAt`); no stale chip on the plot |
| Clock | `fmtTime` = `new Date(t).getHours()` browser local | Same house TZ as the tent **if** the operator's browser is Sydney. **No date** on 24h/48h ticks |

Ghost overlay (`withPriorGhost` / HistoryDrawer) shifts the prior window forward. Same color, dashed. Easy to read as a second live tent.

Empty default copy: **"thin recorder"** — jargon, and it is used both for “no rows” and “unmapped entity.” `useEntitySeries` ignores `useHistory.error`. HTTP failure and “not in map” look identical.

---

## Live Brain `/history` (2026-08-27 ~06:40 AEST)

| Entity | 6h n | 24h n | 48h n | Last age | Notes |
|---|---:|---:|---:|---|---|
| `sensor.dsc_hub_tent_temperature` | 364 | 1785 | **2000** | 0.8 min | 48h last point **~27h ago** (cap) |
| `sensor.dsc_hub_tent_humidity` | — | 1786 | — | live | Mapped |
| `sensor.dsc_hub_vpd_kpa` | — | 1788 | — | live | Mapped |
| `sensor.dsc_hub_room_temperature` / humidity | — | 1786 | — | live | Mapped |
| `sensor.dsc_hub_room_vpd_kpa` / `room_vpd` | **0** | **0** | **0** | — | **Not in `ENTITY_METRIC_MAP`** |
| `sensor.dsc_hub_clone_*` T/RH/VPD | — | ~1787 | — | live | Mapped |
| `sensor.dsc_fan_exhaust_outside_pct` / `room_pct` | **0** | **0** | **0** | — | **Not mapped; chart is empty** |
| `sensor.dsc_coldest_root_zone_temp` | **2000** | **2000** | **2000** | 6h window ends **~5.6h ago** | Cap + constant write |
| `sensor.dsc_pot1_soil_moisture` | 395 | 1966 | **2000** | live / 48h last **~27h ago** | 21.8–23.2% |
| `sensor.dsc_pot1_got_moisture` | **0** | **0** | **0** | — | Seat helper prefers this when present |
| `sensor.dsc_pot1_soil_ec` / `got_ec` / `soil_conductivity` | **0** | **0** | **0** | — | **EC not ingested** |
| `sensor.dsc_pot1_soil_ph` | 395 | 1967 | — | live | Mapped; `got_ph` is 0 |
| `sensor.dsc_pot2_soil_moisture` | 393 | 1969 | **2000** | live / 48h truncated | 2.9–20.4% (real swing) |
| `sensor.dsc_pot3_soil_moisture` | **0** | **0** | **0** | — | pot3 OOS — correct empty |
| `sensor.dsc_pot4_soil_moisture` / temp | **0** | **0** | **0** | — | pot4 **in service**, values **null** |
| `binary_sensor.dsc_hub_4x8_window_open` | **0** | **0** | **0** | — | Duty strip unmapped |
| `light.dsc_hub_sf1000_dimmer` | **0** | **0** | **0** | — | Duty strip unmapped |
| `switch.dsc_heater_main_relay` | — | 453 | — | ~7 min | Mapped; demand switch is not |

Hub live values have `temp_c` / `vpd_kpa` / `clone_vpd_kpa` — **no `room_vpd_*`**. Pots report `moisture_pct`, `soil_temp_c`, `ph` — **no `ec_us`**.

---

## Per-graph table

Verdict: **PASS** = operator can trust the trace for the labeled window. **FAIL** = P0/P1 honesty break. **WARN** = usable with a named lie.

| ID | Graph | Route | Source | Window | Downsample | Axes / units | Tooltip | Empty / error | TZ | Live | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| G01 | Temperature (Room / 2×4 / 4×8) | `/live/climate` | hub `temp_c` / `clone_temp_c` / `room_temp_c` + ghost | Timespan (default 6h, session-shared) | index | Left °C, auto-pad; Want T dashed | HH:mm + nearest point, no gap timeout | Default “thin recorder” unused here | Browser local, no date | 6h live 20–24.8°C; last chip **23.7°C = Room**, not 4×8 | **FAIL P1** |
| G02 | Humidity | `/live/climate` | hub RH trio + ghost | same | index | **Forced 0–100 %** | same | — | same | 6h live ~52–75%; last chip **Room %** | **FAIL P1** |
| G03 | VPD | `/live/climate` | tent + clone mapped; **Room unmapped** | same | index | Auto kPa | same | Room line absent; **no last chip** | same | Legend lists Room; series empty | **FAIL P0** |
| G04 | Fan duty % | `/live/climate` | `sensor.dsc_fan_exhaust_*_pct` | same | — | 0–100, step | — | **"thin recorder"** live | — | Sliders show 15/45% **now**; plot empty | **FAIL P0** |
| G05 | Tent history T+RH | `/live/4x8` | tent T + RH, dual axis | Timespan | index | Left °C / right 0–100% | nearest | — | HH:mm only | 6h works; 48h truncated | **FAIL P1** |
| G06 | Tent history T+RH | `/live/2x4` | clone T + RH | same | index | same | same | — | same | same pattern | **FAIL P1** |
| G07 | Tent T+RH (secondary) | `/tune/analytics` | tent T + RH | Timespan incl. **48h** | index | Dual; **RH extrema drawn as “max 81.9” on temp plot** | nearest | — | 48h ticks look reversed (no date) | 48h newest dropped + hold-to-now | **FAIL P0** |
| G08 | Root pack moisture | `/tune/analytics` | `potGotEntity` (got_* vs soil_*) | same | index | Left auto (not 0–100) | nearest | P3/P4 empty still **in legend** | **All ticks `06:50` at 48h** | P3 OOS plotted; P4 in-service null | **FAIL P0** |
| G09 | Got history M + EC | `/grow/roster?pot=1` | moisture fallback `soil_moisture` (OK); EC `got_ec` / conductivity (**0 rows**) | 6h fixed in seat | 72 | Left % / right **0–100 if EC ≤100 or empty** | nearest | EC line missing; copy still “EC over time shown” | local | Moisture 21.8% live; EC not ingested | **FAIL P1** |
| G10 | Band sparklines ×9 | `/live/overview` | `useHistory(id, 24, 96)` no hold | 24h | 96 | None (spark) | none | Root = **flat line** (stale/truncated) | none | 8/9 have shape; VPD **end spike** (hold/live join) | **FAIL P1** |
| G11 | Band sparklines ×9 | `/ops/home` | same cells | 24h | 96 | none | none | same Root flat | none | Same stack as G10 | **FAIL P1** |
| G12 | Pot VWC sparklines ×4 | `/live/root` | `useEntitySeries` per pot | default 6h | 96 | none | none | Empty spark = blank box (P3/P4) | none | First fold hid them under Twin chrome | **FAIL P1** |
| G13 | 4×8 window 24h | `/live/light` | DutyStrip → `/history` **unmapped** | 24h / 720 | — | Hours bar, no ticks | none | Grey track; **0 cycles · 0.0h on** | last = `toLocaleTimeString` | Live chip **WINDOW OPEN**; plot says off | **FAIL P0** |
| G14 | SF1000 24h | `/live/light` | DutyStrip → `light.dsc_hub_sf1000_dimmer` **unmapped** | 24h | — | same | none | **0.0h on** | same | Live chip **SF1000 ON** | **FAIL P0** |
| G15 | Heat mat 24h | `/live/root` | DutyStrip unmapped | 24h | — | same | none | 0 cycles / 0.0h; bar invisible on dark | same | KPI “Heat mat today 4.0 h” contradicts strip | **FAIL P0** |
| G16 | BandChart drawer | Overview gauge click | `BandChartHost` multi-zone + ghosts | default 24h / pots 48h | ≤288 | per kind; pot dual % / °C | nearest | “Thin recorder” if all series <2 pts | local | Same map holes (Room VPD, pot got_*, 48h cap) | **FAIL P1** |
| G17 | HistoryDrawer | Seat / hist buttons | one entity + prior ghost | Timespan | maxPoints | auto | nearest | **Thin recorder** on unmapped (dryback, got_*, lights) | local | Drawer on roster showed **blank + Thin recorder** | **FAIL P1** |
| G18 | EntityInspector chart | KPI / alert click | `useEntitySeries` | Timespan; binary forced 24h | 288 binary | binary 0–1 step | nearest | “no history yet” | local | AH / CFM / fan% / demand / dryback all unmapped | **FAIL P1** |
| G19 | Inspector DutyStrip | binary inspector | same as G13–G15 | 24h | 720 | bar | none | empty if unmapped | local | Same map | **FAIL P1** |

**Not graphs (excluded):** Learning wizard (no plot), Twin 3D, Air path schematic, Crop scheduler lanes, ArcGauge / GotWantBars (GAUGE-AUDIT), Mission (no `MultiLineChart`).

---

## Priorities

### P0 — operator will make a wrong call

| ID | Defect | Evidence |
|---|---|---|
| **GR-P0-1** | `list_history` `LIMIT 2000 ASC` **drops the newest points**. 48h tent T / pot moisture last sample is ~27h old; UI still labels the axis as a full 48h and `stepHoldSeries` flatlines the missing half to now. Coldest-root hits the cap inside a **6h** window. | API: tent T 48h n=2000, `lastAgeMin≈1612`. Analytics 48h screenshot: long flat + “max 81.9” debris. |
| **GR-P0-2** | **Step-hold to now** with no stale mark. `stepHoldSeries` appends `{t: now, v: last}`. `MultiLineChart` voids `lastSyncAt`. A dead series looks live and flat. | Root sparkline flat at 18.4°C; coldest-root 6h payload ends 5.6h ago. |
| **GR-P0-3** | **Fan duty chart is empty** while live sliders show duty. Entities not in `ENTITY_METRIC_MAP` / `ENTITY_FLEET_MAP`. | Live: n=0; screenshot `graph-audit-climate-fan.png` — “thin recorder” + OUT/RECIRC legend. |
| **GR-P0-4** | **Room VPD is in the VPD legend and first in the series list, with zero history.** Last-value chip blank. Hub ingest has no `room_vpd`. | `/history` n=0 both ids; Climate VPD last chip missing (`graph-audit-climate-vpd.png`). |
| **GR-P0-5** | **Lighting duty plots say 0.0h on / 0 cycles** while the page says window open and SF1000 on. Unmapped binaries. | `graph-audit-light.png`; `/history` n=0 for window + dimmer. |
| **GR-P0-6** | **Heat-mat 24h strip 0.0h** vs Root KPI “Heat mat today **4.0 h**.” | `graph-audit-root.png`. |
| **GR-P0-7** | Analytics **48h VWC** x-axis is five copies of the same `HH:mm`; P3 (OOS) and P4 (null) stay in the legend. `potGotEntity` can select `got_moisture` (0 history) over `soil_moisture` (full history). | `graph-audit-analytics-48h.png`; got_* n=0 vs soil n≈1967. |

### P1 — dishonest or hiding the signal

| ID | Defect | Evidence |
|---|---|---|
| **GR-P1-1** | Last-value chip is **series[0]**, not the tent. Climate T/RH advertise Room °C / Room % as the chart’s “now.” | DOM + `graph-audit-climate-vpd.png` / temp shots. |
| **GR-P1-2** | Dual-axis **extrema labels are un-united**. RH max **81.9** prints on the temp chart; reads as 81.9°C. | `graph-audit-analytics-48h.png`. |
| **GR-P1-3** | Band-severity recolor + glow + ghost = **orange smear**. Legend dots stay teal/grey and do not match the stroke the operator sees. | `graph-audit-climate-temp.png`, `graph-audit-climate-vpd.png`. |
| **GR-P1-4** | **EC never recorded.** Seat chart still legends EC and says “EC over time shown.” Right axis stays 0–100 when EC is empty or in mS. | Fleet pot keys: moisture / soil_temp / ph only. `/history` EC n=0. |
| **GR-P1-5** | 24h/48h ticks are **HH:mm only** — two mornings look like the clock ran backwards. | Analytics 48h: `06:56 … 06:50`. |
| **GR-P1-6** | Downsample is **index stride**, not extrema. Tooltip nearest-point has **no max-distance** — a hover can label a sample hours away. | `useHistory.downsample`, `hoverSamples`. |
| **GR-P1-7** | Unmapped inspector / drawer entities fail **silent** (`[]` + Thin recorder). HistoryDrawer still prints the raw entity id. | Roster HISTORY drawer blank (`graph-audit-roster-p1-got.png`). |
| **GR-P1-8** | Overview / Dash **Root sparkline** is a held flat; VPD sparks show a **needle spike at the right** (hold join / live append). No window label on the spark. | `graph-audit-overview-bands.png`. |
| **GR-P1-9** | Duty track is **grey-on-near-black** — empty 24h looks like a missing widget, not “off all night.” | Light + Root screens. |
| **GR-P1-10** | `useChartHours` **sessionStorage is global**. 48h on Analytics is 48h on Climate. Ghost fetch doubles hours up to 48 and then hits GR-P0-1. | `STORAGE_KEY = dsc_chart_hours`. |

### P2 — polish after the lies are gone

| ID | Defect |
|---|---|
| **GR-P2-1** | Humidity 0–100 is honest for the unit and **compresses** a 52–75% night. Prefer 40–80 or pad around the band. |
| **GR-P2-2** | Climate T Want overlay is 4×8 only; 2×4 Want is missing. VPD card has no target band rect (stroke-only). |
| **GR-P2-3** | Empty copy “thin recorder” / “Multi-zone history — same series as HA Home gauge popups.” |
| **GR-P2-4** | Sparkline `<2` points renders an empty box with no “no history” text. |
| **GR-P2-5** | Min/max SVG labels collide with the line (`max 24.5` on Climate T). |

---

## Route pass (live, no writes)

| Route | Graphs | Notes |
|---|---|---|
| `/live/overview` | 9 sparklines; BandChart drawer | Root spark dead-flat. P1 gauge “no data” is GAUGE/WF, not this pass. |
| `/live/climate` | 4 MultiLineCharts | T/RH 6h real; VPD Room hole; Fan empty. **Do not touch Command.** |
| `/live/4x8` `/live/2x4` | 1 dual-axis each | Below TwinKeepAlive fold (SPACE-AUDIT). |
| `/live/root` | 4 pot sparks (below fold) + heat-mat DutyStrip | Header “4 of 4 in service” vs inventory pot3 **false**. pot3 not enabled this pass. |
| `/live/light` | 2 DutyStrips | Contradiction with ON / WINDOW OPEN. Deviation KPI is a gauge click, not a plot. |
| `/ops/home` | 9 sparklines (same as Overview) | Same Root/VPD spark defects. |
| `/tune/analytics` | 2 MultiLineCharts | 48h is the smoking-gun window. |
| `/tune/learning` | **none** | Wizard only — no plot to audit. |
| `/grow/roster` | Got history in seat drawer | `?pot=1` moisture live; EC empty; leftover HISTORY drawer Thin recorder. |
| `/live/twin` | none (3D) | Out of scope. |

---

## Top 8 defects

1. **48h (and busy 6h) history returns the oldest 2000 rows** — newest climate / VWC is deleted; the chart flatlines the hole to now.  
2. **Step-hold to `Date.now()`** with no stale/held mark — dead series look live.  
3. **Fan duty plot is a labeled empty** (“thin recorder”) while sliders show live %.  
4. **Lighting duty = 0.0h on** while SF1000 and 4×8 window are on.  
5. **Heat-mat strip 0.0h** vs “4.0 h today” on the same Root page.  
6. **Room VPD legend with no series**; VPD last chip blank because Room is first.  
7. **Analytics 48h VWC axis stuck on one clock time**; P3 OOS + P4 null still legend.  
8. **Last chip / dual-axis extrema lie** (Room °C as the climate “now”; RH 81.9 as a temp max).

---

## What is actually good

- Custom SVG `MultiLineChart` (crosshair, pin, dual axis, step, band-severity) is the right primitive — the **data contract** is the turd, not the renderer.  
- 6h tent / room / clone **T and RH** and tent/clone **VPD** are dense, local-clock, and match `/fleet` live values.  
- `stateToNumber` does **not** chart `unavailable` as 0. Missing points are held last-good, not zero-filled. That is the right rule **if** the hold is labeled.  
- pot3 OOS has **no moisture history** — correct. This pass did not put it in service.  
- Browser clock (AEST) matches grow-log AM/PM. No UTC-vs-tent offset seen on 6h charts.

---

## Fix order (do not start with glow)

1. `list_history`: `ORDER BY ts DESC LIMIT n` then reverse — or raise the cap and **prefer newest**.  
2. Map fan %, room VPD, window/light/mat binaries, `got_*` aliases, dryback. Ingest `ec_us` or stop legending EC.  
3. Stop extending hold to now **or** paint the held tail as dashed + “held”. Surface `lastSyncAt`.  
4. Last chip = focused tent / primary series, with unit. Dual-axis extrema need axis + unit.  
5. 24h/48h ticks need a **date** (or `Ddd HH:mm`).  
6. DutyStrip: map history; if empty, say “No on/off history” — not a blank bar that reads as 0h while the lamp is on.

---

## Files read (no product code changed)

- `frontend/src/viz/charts.tsx`
- `frontend/src/hooks/useHistory.ts`, `useEntitySeries.ts`, `useChartHours.ts`
- `frontend/src/lib/chartSeries.ts`, `seriesHold.ts`, `fleetApi.ts`, `entityFleetMap.ts`, `seatModel.ts`
- `frontend/src/pages/ClimatePage.tsx`, `LivePages.tsx`, `TuneFleetPages.tsx`, `GrowPages.tsx`, `LightPage.tsx`, `RootPage.tsx`, `DashHomeSections.tsx`
- `frontend/src/components/HistoryDrawer.tsx`, `BandChartHost.tsx`, `EntityInspector.tsx`, `DutyStrip.tsx`
- `brain/dsc_brain/history_ops.py`, `settings.py` (`list_history`), `api.py` (`/history`), `esphome_client.py` (ingest)

---

## Screenshots

| File | What |
|---|---|
| `graph-audit-overview-bands.png` | Overview sparks; Root flat |
| `graph-audit-climate-temp.png` / `-vpd.png` / `-fan.png` | 6h climate + empty fan |
| `graph-audit-analytics.png` / `-48h.png` | Dual-axis lie + 48h VWC collapse |
| `graph-audit-light.png` | Duty 0.0h vs ON |
| `graph-audit-root.png` | Heat-mat strip vs 4.0 h KPI |
| `graph-audit-4x8-tent-history.png` / `graph-audit-2x4-tent-history.png` | Cockpit dual-axis |
| `graph-audit-dash.png` | Dash = same 9 sparks |
| `graph-audit-roster-p1-got.png` | HISTORY drawer Thin recorder |
| `graph-audit-climate-top.png` / `-page.png` / `-48h-temp.png` / `graph-audit-roster.png` | Supporting |

---

**Audit verdict:** Do not treat these charts as soak evidence for 48h, lighting hours, fan history, Room VPD, EC, or root-coldest until GR-P0-1…7 are fixed. 6h tent T/RH is the only series I would use tonight.
