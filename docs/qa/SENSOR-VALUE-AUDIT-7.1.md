# Sensor-value audit — DSC-HUB 7.1

**Date:** 2026-08-27  
**Scope:** The **numbers** — every live sensor and computed reading. Distinct from GAUGE/GRAPH (presentation), DEVICE (online/firmware), WIRING (relays), ZIGBEE (join).  
**Brain:** `http://192.168.86.48:8787` (`/health` `7.1.0` / surface `7.1.0`). `.30` is not the Brain.  
**Method:** code inventory (`computed_ops`, `hub_controls`, `dash_computed`, `fleet_state`, `esphome_client`, compose helpers, `device_calibration`) + live `GET /fleet`, `GET /fleet?include_hass&include_computed`, `GET /fleet/computed`, `/roster`, `/settings/calibration/*`, `/settings/zigbee/devices` + Pi `dsc_ops.sqlite3` history + SPA Overview / Climate / Compose / Calibrate / Root / 2×4 (read-only).  
**Not done:** save calibration, fire demand, Apply network, pot3 in service.  
**Cited:** [LIVE-ACCEPTANCE-7.1.md](LIVE-ACCEPTANCE-7.1.md) (fleet 7.0.0.0; pot3 OOS after demo revert; calibration empty; Zigbee list empty).

**Verdict:** An operator **can trust the tent/room T·RH and the two live pot probes** (and Pi-recomputed VPD). They **cannot trust hours, CFM, Compose age, or “today” runtimes** as digits. The climate triad is a working system. The computed layer is not.

---

## Environment (audit window)

| Item | Live |
|------|------|
| Poll `/fleet` | 2026-08-27 **06:40:06 AEST** (`updated_at` 1787776806) |
| Poll 2 + computed | **06:43:28 AEST** |
| SPA walk | **06:45–06:49 AEST** on `:8787` |
| Hub | online, `10.42.0.10`, fw `7.0.0.0`, last_seen age **36 s** then **~15 s** |
| Panel | online `10.42.0.11` |
| Pots | pot1/2/4 in_service + online; **pot3 OOS** (not ingested) |
| Roster | `[]` |
| Zigbee / canopy | `devices: []`, `canopy: {}` |
| Calibration DB | all `{calibrations: []}` — `0/4` CFM curves, no light PAR |
| Pi host TZ | `Australia/Sydney` (AEST) |
| Brain container TZ | **UTC** (runtime “today” uses this) |

There is no `GET /control` or `GET /compose`. Control readback is `hub.values.controls` on `/fleet`. Compose numbers are helpers + `hass_extras` from `/fleet/computed`.

---

## Inventory counts

| Class | Count | Notes |
|-------|------:|-------|
| Computed `hass_extras` `sensor.*` | 52 | CFM, fans %, runtimes, alerts, compose leftovers, CannaLib holes |
| Computed `binary_sensor.*` | 22 | faults, windows, ESP-NOW links, efficacy suspects |
| Hub climate keys (live) | 8 | tent / clone / room T·RH + tent/clone VPD |
| Hub diagnostic numerics | 18 | CO2 ADC, light hours, countdowns, band/mister hours, RSSI, uptime |
| Pot probe keys published | 12 | 4 seats × moist/temp/pH; EC **never ingested** |
| Pot keys with a live number | 6 | pot1 + pot2 only |
| Aliased HA ids (`tent_*` = `hub_*`) | 6 | same float, two entity ids |
| **Published sensor/computed keys** | **~86** | unique ids an operator can land on |

Mismatch / stale / honesty defects this pass: **14** (8 P0/P1 new or reconfirmed as *value* bugs).

---

## Value table

`last_seen` ages are vs fleet `updated_at` at 06:40 unless noted. **UI** = Overview / Climate / Compose / Calibrate / Root as marked.

### A. Hub climate (physical) — trust

| Key | Source | Unit | Live 06:43 | Fresh | UI | Range | Notes |
|-----|--------|------|------------|-------|-----|-------|-------|
| `temp_c` → `sensor.dsc_hub_temperature` / `_tent_temperature` | Hub SHT `tent_temperature` | °C | 22.0 | ~15 s | Overview **21.9**; Climate **21.8** (06:48) | 15–35 tent | Live drift, not a swap. All °C — **no °F mix**. |
| `rh_pct` → `_humidity` / `_tent_humidity` | Hub `tent_humidity` | % | 64.0 | ~15 s | Ov **64.5**; Cl **64.8** | 0–100 | Above 4×8 Want max **60**. Digit is honest; control is off. |
| `vpd_kpa` → `_vpd` / `_vpd_kpa` | **Pi** `finalize_hub_climate` (Magnus), not hub template | kPa | 0.952 | same T/RH | Ov **0.93**; Cl **0.92** | 0–3.5 | Rechecked: 22.0 °C / 64 % → 0.952. In Want 1.0–1.2 at 06:40 (1.005), then slipped out. |
| `clone_temp_c` | Hub clone probe | °C | 23.6 | ~15 s | Ov **23.5**; Cl **23.4**; 2×4 **23.6** | 15–35 | Clone ≈ room, not swapped with 4×8 (cooler). |
| `clone_rh_pct` | Hub | % | 63.9 | ~15 s | Ov **64.1**; 2×4 **64** | 0–100 | In 2×4 Want 55–65. |
| `clone_vpd_kpa` | Pi from clone T/RH | kPa | 1.052 | same | Ov **1.04**; Cl **1.03**; 2×4 **1.05** | 0–3.5 | |
| `room_temp_c` | Hub room | °C | 23.7 | ~15 s | Ov **23.6**; Cl **23.6** | 10–40 | |
| `room_rh_pct` | Hub room | % | 60.9 | ~15 s | Ov **61.1**; Cl **61** | 0–100 | |
| Room VPD | **Not published** on extras; `fleetFromHass` can compute; `ENTITY_FLEET_MAP` omits it | kPa | (23.7 / 60.9 → ~1.07) | — | Climate Room VPD **—** | 0–3.5 | **Hole.** T+RH live, VPD blank. Already GAUGE-P1-6. Do not invent on the Brain. |
| `sensor.dsc_coldest_root_zone_temp` | min in-service pot `soil_temp_c` (helpers vote default on) | °C | **18.4** (pot 1) | pot last_seen 7 s | Ov Root **18.4**; Root KPI **18.4** | 5–45 plausibility | Matches pot1. Below mat band 20–22. |

### B. Pot probes — mixed

Firmware: Modbus register × 0.1, user scale/offset default 1/0, out-of-range → **NAN** (honest). Unit **%** (VWC-like), **not raw ADC**. N-016 lab wet cal still open — treat as uncalibrated VWC.

| Key | Source | Unit | Live | Fresh | UI | Range | Notes |
|-----|--------|------|------|-------|-----|-------|-------|
| pot1 `moisture_pct` | `soil_moisture` | % | 21.9 | 7 s | Root **21.9**; 2×4 seat **21.899…** (IEEE); Overview strip **hole / not 21.9** | 0–100 | History today 21.8–22.0 (stuck-stable). WF-P0-1: Overview reads `_soil_moisture`, map has only `_got_moisture` for pot1. |
| pot1 `soil_temp_c` | `soil_temperature` | °C | 18.4 | 7 s | Root **18.4** | −20–60 | Soil, not air. |
| pot1 `ph` | `soil_ph` | pH | 6.30 | 7 s | Root **6.30** | 3–9 | |
| pot2 `moisture_pct` | same | % | 19.5 | 4 s | Root **19.5** | 0–100 | History today **2.9–19.6** — 2.9 is a probe dip, not VWC truth. |
| pot2 `soil_temp_c` | same | °C | 18.5 | 4 s | Root **18.5** | | |
| pot2 `ph` | same | pH | 7.20 | 4 s | Root **7.20** | | High for media; in firmware range. |
| pot1/2 `ec_us` | firmware `soil_conductivity` | µS/cm | **never ingested** | — | Root EC **—** | 0–20000 | `POT_MAP` looks for `soil_ec`. OID is `soil_conductivity`. **Mis-map.** N/P/K same story (not in map). |
| pot4 moist/temp/pH | same | | **null / nan** | last_seen **0.1 s** (device online) | Root **— no data** | | Honest UI. `hass_states` can stringify `nan`. History: 449 null rows today. Hardware isolate still open. |
| pot3 * | skipped (OOS) | | absent from `pots` | — | Root **empty gauges**; “4 of 4 in service” | | Must stay OOS. REL-P0-2 / GAUGE-P1-7. |

### C. Computed airflow — do not treat as a sensor

| Key | Formula | 06:43 | Honesty attr | UI | Notes |
|-----|---------|-------|--------------|-----|-------|
| Fan % IN main / 2×4 / EX room / EX out | hub fan `percentage` (`speed_level`) | **27 / 15 / 45 / 15** | live PWM | Overview duties **match**; Climate sliders **match**; 2×4 intake **15%** | 06:40 was 15/15/30/15 — Full Auto hunting, not a dual-source bug. |
| `sensor.dsc_cfm_*` (4 nameplate) | `pct/100 ×` helper max (200 / 200 / 440 / 440) | 54 / 30 / 66 / 198 | `linear` `capacity_proxy_nameplate` | Climate prefers **allocated** | 0/4 curves. Calibrate page: **0/4 CURVES · SESSION IDLE**. |
| `sensor.dsc_cfm_*_allocated` (4) | Σ opposite side × this fan’s % share | IN **169.7 / 94.3**; EX **21.0 / 63.0** | mass-balance split | 2×4 **IN 94 cfm**; Climate **in 170 / in 94 / dump 21 / recirc 63** | Allocated intake Σ **264** vs allocated exhaust Σ **84**. NP alert uses **nameplate** (84 vs 264) — opposite story. |
| Label | — | — | — | Climate / 2×4: **“CFM from Learning (anemometer).”** | **False.** No anemometer rows. |

Nameplate intake 54+30=84 < exhaust 66+198=264 → `binary_sensor.dsc_live_intake_over_exhaust` **off** (correct for the nameplate model). The air-path digits the operator sees are the allocated pair.

### D. Hours / runtimes — do not trust

| Key | Claimed | Recomputed local midnight | UI | Defect |
|-----|---------|---------------------------|-----|--------|
| `sensor.dsc_dehumidifier_runtime_today` | **19.09 h** | **5.36 h** (408 rows) | not on Overview fold | Container **UTC** midnight (Aug 26 00:00Z) = 20.8 h window. Exact match 19.09. Local AEST “today” is 5.36. |
| `sensor.dsc_growmat_runtime_today` | 3.93–3.98 h | 3.43–3.44 h | Root **4.0 h** | Same UTC skew (~0.5 h). |
| `sensor.dsc_heater_runtime_today` | 0.36 h | 0.36 h | Climate “Heater today **21M**” | Happened after local midnight so it agrees. |
| `sensor.dsc_humidifier_runtime_today` | 0.04 h | 0.04 h | — | Same. |
| `sensor.dsc_lights_on_today_4x8` | **0.0 h** | **never recorded** | (Today chip when shown) `0.0h / 0h` | Metric `binary_dsc_hub_4x8_window_open` has **0** history rows. Window is **on**. Fake zero. |
| `sensor.dsc_lights_on_today_2x4` | **0.0 h** | **never recorded** | vs Want **18.0 h** | Metric `light_dsc_hub_sf1000_dimmer` never written. Hub `light_delivered_hours` = **2.64**. |
| `sensor.dsc_expected_light_hours` | 0.0 | grow_stage **Off** | 4×8 Want **0.0H** | Consistent with stage Off; windows still open. |
| `sensor.dsc_clone_expected_light_hours` | 18.0 | clone Independent 18 h | 2×4 Want **18.0H** | |
| DutyStrip “Heat mat 24h” | — | demand history exists | **0 CYCLES · 0.0H ON** vs KPI **4.0 h** | `/history` map has no demand-switch rows. Same-page lie. |

### E. Compose / leftovers

| Key | API | UI Compose | Truth |
|-----|-----|------------|-------|
| `sensor.dsc_build_days_since_sprout` | **48** | **DAY 48** | Roster `[]`. Leftover helper from pot3 demo (LIVE-ACCEPTANCE #5 reverted). |
| `sensor.dsc_build_expected_stage` | Late (Push) Vegetative | **AUTO STAGE · LATE (PUSH) VEGETATIVE** | Hub `grow_stage` = **Off**. Three-way disagreement. |
| Strain helper | Northern Lights | **STRAIN Northern Lights** | Not assigned. |
| `input_select.dsc_build_assign_pot` | 3 (poll 1 extras) | pots 1–4 offered | **Do not assign pot3.** |
| `sensor.dsc_plant_roster_summary` | `0 occupied` | — | Honest. |
| pot1 tent helper | `clone` | 2×4 seat P1 | No plant; tent helper leftover. |

### F. Light / CO2 / Zigbee / diagnostics

| Key | Live | UI | Honesty |
|-----|------|-----|---------|
| SF1000 | state **on**, brightness **1**/255 ≈ 0.4% | 2×4 **SF1000 ON** + slider **0%**; `binary_sensor.dsc_light_effectively_off` **on** (threshold 5%) | Three stories. |
| `number.dsc_hub_sf1000_effective_off_pct` | **5.0** (helper fallback) | — | Live hub `sf1000_ramp_floor` is **0.0**. Dual source. |
| `dynamic_co2_ppm` / `co2_sensor_voltage` | **172.87** / **0.142 V** both polls (frozen) | not on Overview/Climate | ADC estimate; F-008. Ambient indoor ≠ 173 ppm. Do not promote. |
| `light_delivered_hours` / `light_debt_hours` | 2.64 / 15.36 | not shown as those ids | More honest than `lights_on_today_*` = 0. |
| Zigbee canopy T/RH | absent | — | Placement unused. ZB-P1-3. |
| pot3 `esp_now_link` | hub **true** | — | Seat OOS, no numbers. Link bit is decorative. |
| `root_zone_sensor_fault` | **off** | — | pot4 all-null does not trip it (pot1/2 soil T in 5–45). |
| Countdowns / mister hours | 0.0 | — | Idle 0 vs no-data: demand is actually off; mister is OOS (F-002). |
| CannaLib extras | `unavailable` / “— MB” | Compose catalog empty fields stay empty | Honest hole. |

---

## Surface agreement (API ↔ SPA)

| Surface | Climate triad | Root moist/T/pH | CFM | Hours | Compose age |
|---------|---------------|-----------------|-----|-------|-------------|
| API `/fleet` + extras | SoT | pot1/2 SoT; pot4 null | nameplate + allocated | UTC “today” | Day 48 leftover |
| Overview | **Agrees** (live drift) | **P1 hole** (WF-P0-1); P2–P4 empty/null | duties = fan **%** (honest) | not on fold | — |
| Climate | **Agrees**; Room VPD **—** | P3 listed | **Allocated** + “anemometer” lie | Heater 21M OK | — |
| 2×4 | **Agrees** | P1 21.9 IEEE | **94 allocated** | Want 18 h vs got 0 | — |
| Root | — | **Agrees** pot1/2; pot3 empty; pot4 — | — | 4.0 h vs strip 0.0 h | — |
| Compose | — | — | — | — | **48 / Late Veg** vs roster empty |
| Calibrate | — | — | **0/4 curves** agrees | — | — |

Hub chip on Climate (“HUB 21.8°C”) is **4×8 tent**, not room. Correct for `hub.values.temp_c`.

---

## Honesty themes

| Theme | Finding |
|-------|---------|
| Stale shown as live | Compose Day 48 / Late Veg / Northern Lights after roster revert. |
| °C / °F | All climate UI and entities are **°C**. No mix this pass. |
| VWC vs raw ADC | Firmware publishes scaled **%** (register × 0.1). Not ADC. Uncalibrated (N-016). |
| Intake CFM computed | Yes — nameplate linear and allocated split. Neither is measured. |
| Soil vs air | Root 18.4 °C vs tent 22 / clone 23.6 / room 23.7. Not swapped. |
| Pot vs tent | pot1 helper tent=`clone` but no plant; 4×8 air is the cooler tent. |
| Zigbee unused | Canopy keys exist in code; live `{}`. |
| Fake zero vs no-data | `lights_on_today_*` = **0.0 available**; pot4 / EC / Room VPD = **—**. Held-reading path does not map unavailable→0. Runtime 19.09 is a **wrong** number, not a zero. |
| pot3 | OOS. Do not enable. Surfaces that default `in_service` on still paint it. |

---

## P0 / P1 / P2

### P0 — operator will act on a wrong digit

| ID | Defect | Evidence |
|----|--------|----------|
| **SV-P0-1** | `*_runtime_today` uses **container UTC midnight**, not AEST | Dehum API **19.09 h** = ON time since 2026-08-26 00:00Z. Local today **5.36 h**. Window at 06:45 AEST is 6.75 h — 19 h is impossible as “today”. |
| **SV-P0-2** | `lights_on_today_{4x8,2x4}` are **permanent fake zeros** | History metrics never written (`all=0`). Windows open; hub delivered **2.64 h**. UI can show `0.0h / 0h` and `0.0h / 18h`. |
| **SV-P0-3** | Air-path CFM labeled **anemometer / Learning** while showing **allocated** proxies | Calibrate **0/4**. Climate: in 170 + 94, dump 21, recirc 63. NP check uses nameplate (inverted story). |

Already filed (do not re-work): **WF-P0-1 / GAUGE-P0-2** Overview P1 moisture hole; **REL-P0-2** “4 of 4 pots” / pot3 gauges.

### P1

| ID | Defect | Evidence |
|----|--------|----------|
| **SV-P1-1** | EC (and N/P/K) **not ingested** | Firmware `soil_conductivity`; `POT_MAP` key `soil_ec`. Root EC **—** on live pots. |
| **SV-P1-2** | Compose **Day 48 / Late Veg** leftover | extras + Compose UI vs roster `[]` vs hub stage Off. |
| **SV-P1-3** | pot4 **online + nulls**; root fault **off** | last_seen 0.1 s; fault logic ORs any plausible pot. Dead probe hidden. |
| **SV-P1-4** | pot3 ESP-NOW link **on** while OOS / no values | hub binaries. |
| **SV-P1-5** | Light **ON** / **0%** / **effectively off** | brightness 1; extras `dsc_light_effectively_off=on`; 2×4 chip ON. |
| **SV-P1-6** | DutyStrip 24 h **0.0H** vs runtime KPI | demand switches not in `history_ops.ENTITY_METRIC_MAP`. |
| **SV-P1-7** | `BrainProvider.fleetToHass` does **not** merge `fleetFromHass` | extras-only holes (room VPD, pot soils on Overview `num()`). |

Already filed: **GAUGE-P1-6** room VPD; **ZB-P1-3** canopy unused; **DA-P1-2** IEEE moisture; **REL-P0-3** 2×4 hours parented to SF1000 (compounded by SV-P0-2).

### P2

| ID | Defect |
|----|--------|
| SV-P2-1 | Frozen ADC CO2 173 ppm in `hub.values` only — keep demoted (F-008). |
| SV-P2-2 | pot2 moisture history 2.9–19.6 % today — probe glitch, not a map bug. |
| SV-P2-3 | `hass_states` can emit pot4 state `"nan"` while `/fleet` JSON is `null`. |
| SV-P2-4 | `vd_kpa` typo fallback in `fleet_state.py` / `fleetModel.ts` (unused live). |
| SV-P2-5 | Hub `potN_in_service` switches all **off** vs inventory true — extras ignore them; inventory is SoT. |
| SV-P2-6 | Mister delivered/debt 0.0 while F-002 OOS — acceptable idle zero. |

---

## What an operator can trust

**Yes:** 4×8 / 2×4 / room **°C and %**, Pi **VPD** on those two tents, pot1/2 **moisture / soil °C / pH** on Root, fan **duty %**, relay-on vs demand (not this audit), Calibrate **0/4**.

**No:** any **CFM** digit, any **“today” hour** except by coincidence, **Compose stage/day**, Overview **P1 moisture**, **EC**, **Room VPD**, **lights on today**, pot3/pot4 as if they were producing numbers.

---

## Files read (not edited)

`brain/dsc_brain/{computed_ops,hub_controls,dash_computed,fleet_state,esphome_client,climate_math,history_ops,device_calibration,compose_ops}.py`  
`frontend/src/lib/{entityFleetMap,fleetFromHass,fleetModel,cfmProvenance,sensorHonesty,seatModel}.ts`  
`frontend/src/{hooks/useBrain.tsx,hooks/useEntityBus.ts,hooks/useHeldReading.ts,pages/OverviewPage.tsx,pages/ClimatePage.tsx,pages/RootPage.tsx,components/DashHomeSections.tsx}`  
`firmware/v4/DSC-Probe-common.yaml` (soil pipeline)  
`docs/qa/LIVE-ACCEPTANCE-7.1.md`
