# Pre-rebuild findings — Climate Mode A + DSC-Probe uncouple + ESP cal

**Date:** 2026-08-29  
**Trigger:** Operator asked for full stages + Follow Plants on Climate Mode, Pot1–4 → DSC-Probe #N with home plant dropdown, plus ESP cal/trend cleverness — **research + interrogate before rebuild**.  
**Tavily Research:** `tavily_research` plan limit (432); used codebase exploration + `tavily_search` + multi-model interrogate instead.

### External research notes (ESPHome cal patterns)

- Community practice: sample faster during setup, then apply **median** / sliding window before `calibrate_linear` — not 1 Hz averages of a 60s holding register. ([HA community soil moisture](https://community.home-assistant.io/t/soil-moisture-sensor-output-as-a-percentage/250885), [random results / median](https://community.home-assistant.io/t/moisture-sensor-random-results/763599))
- ESPHome docs: multi-point `calibrate_linear` / NTC-style multi-temp points for two-point honesty — matches our lab-wet path, not SoftCal soft offsets. ([Sensor Component](https://esphome.io/components/sensor))
- Takeaway for DSC: temporary `cal_session` Modbus burst + median/MAD on device; keep long trends on Pi; one cal plane (ESP NVS) to avoid HA+ESP double correction.

## Intent (reviewed)

> Expand 2×4 Climate Mode (Follow 4x8 / Follow Plants @ ~12h plant Want intersection / full stages / Custom / Off) on firmware, and completely remove Pot1–4 as plant identity in favour of DSC-Probe #1–4 with Home plant (roster | None). Harvest ESP calibration/trend opportunities and deslop dual pot/probe identity before rebuilding.

## Interrogate reviewers

| Reviewer | Model | Outcome |
|----------|--------|---------|
| A | claude-fable (requested) | Usage-capped → unavailable |
| B | gpt-5.6-sol → inherit retry | Strong critical set |
| C | grok-4.6 | Strong critical set |
| D | opus-5 capped → composer-2.5-fast | Strong critical set |

Consensus across B/C/D is high-confidence.

---

## Lead judgment

### Act On (ship blockers — fix in design before flash/rename)

1. **Do not put the full stage rail on `clone_mode`.** Firmware already calls it “not a second stage engine.” Parallel `grow_stage` + stage-laden `clone_mode` = two engines. **Consensus B/C/D.**  
   → Policy select only: `Follow 4x8` · `Follow Plants` · `Custom` · `Off` (+ migrate aliases Mother/Clones). Stage stamps/Want resolution stay Pi/`grow_stage` (4×8) / plant Want.

2. **`apply_clone_mode` else→Clones stamp is a climate fault** for any new option name. Follow Plants / Germination would get wet-clone RH. **Consensus.**  
   → Exhaustive branches; unknown = no stamp / fail closed.

3. **Panel wire protocol is idx 0–4 (`CMODE_N[]`, `clampi(0,4)`, vitals u8).** Expanding options without version bump + hub/panel co-flash remaps modes. **Consensus.**  
   → Protocol bump or string/hash modes; never ship hub-only.

4. **Follow Plants cannot live as ESP-native Want intersection** — roster/strain/sprout aren’t on the MCU. **Consensus.**  
   → Pi owns 12h (and on change) job → writes `clone_*` numbers; ESP `Follow Plants` only means “targets externally owned / don’t preset-stamp” (mirror Follow 4x8 early-return pattern).

5. **Brain `apply_clone_tent_automation` writes 4×8 `grow_stage` from 2×4 recipes today** (REL-P1-3). Follow Plants without killing that overwrites main tent. **Consensus.**  
   → Delete/gate that write before any Follow Plants work.

6. **`grow_stage` panel clamp 0–10 already maps Off→Custom.** Fix in same rebuild wave. **Consensus.**

7. **Probe rename ≠ entity rename without migration.** Keep `dsc_potN_*` object_ids initially; friendly name DSC-Probe #N; add `assigned_plant_id | None` separate from `idle_home` dock. **Consensus.**  
   → Three objects: probe / plant / assignment. Don’t merge idle dock with measured plant.

8. **SoftCal 15×1s on 60s Modbus is false σ.** SoftCal samples calibrated `soil_*`, stacks HA offsets on ESP cal. **Consensus + explore.**  
   → Burst Modbus / state_changed sampling; SoftCal against Raw or push-to-ESP SoT; gate on dual_cal_stack.

### Consider

- Split `idle_home` (dock) vs `assigned_plant_id` (which plant Got represents) explicitly in API + Settings dropdown UX.  
- Intersection semantics for mixed 2×4 plants (strictest band vs refuse empty).  
- One stage list SoT (`GROWTH_STAGE_FALLBACK` vs `STAGE_ORDER` Dry/Off).  
- Photoperiod (`clone_photo_select`) set atomically with Follow Plants.  
- History `soil_ec` vs `soil_conductivity` alias pass.  
- Strip plant NVS fields from probe firmware after roster SoT.  
- Lab wet SPA dead script vs real `dsc_pots_apply_lab_wet_to_esp`.  
- ESP cal-session: pause/flag ESP-NOW so mat doesn’t chase mid-cal values.

### Noted

- N/P/K are EC-derived — don’t SoftCal them as independent channels.  
- Panel 0xD1 still says pot1–4 link bits (cosmetic until protocol bump).  
- Hub already has 12×5min trend rings — don’t duplicate long trends on pot flash; burst only for cal.  
- Dual `in_service` SoT (hub switch vs inventory) remains after rename unless synced.

### Dismissed

- “Just rename pot→probe in the SPA” as sufficient — reviewers correctly show three SoTs (NVS / roster / HA). Cosmetic-only is worse dual identity.  
- Full Approach A as “dump all stages onto ESP select” — directionally wanted by operator, but **execution as first imagined is unsafe**; policy-mode A + Pi Follow Plants is the judo that still honors firmware-owned Climate Mode intent.

---

## Revised recommendation (still “A-shaped”, safer)

| Piece | Ownership |
|-------|-----------|
| Climate Mode select | ESP policy: Follow 4x8 · Follow Plants · Custom · Off (+ aliases) |
| Stage presets for 2×4 | Pi writes clone numbers from stage rail / plant Want — not a second stage select |
| Follow Plants @12h | Pi intersect assigned plants in 2×4 → clone Temp/RH/VPD |
| DSC-Probe #N | Friendly name + `assigned_plant_id`; keep entity ids until shim soak |
| Idle dock | Keep `idle_home` separate from assigned plant |
| Cal SoT | Prefer ESP NVS; SoftCal burst + Raw or push-then-zero HA |

---

## Large suggestion list (go through before rebuild)

### Climate / Follow Plants
1. Policy-only `clone_mode` (no full stage list on wire).  
2. Fix `apply_clone_mode` exhaustive / fail-closed.  
3. Protocol version + panel co-flash matrix.  
4. Kill `grow_stage` writes from `apply_clone_tent_automation`.  
5. Pi Follow Plants job: 12h + on roster/sprout/assign; write clone numbers only.  
6. Mixed-seat intersection: document strictest band; refuse inverted bands.  
7. Empty 2×4 plants: hold last Custom / honesty chip — no ghost veg.  
8. NVS string migrator Mother/Clones → aliases.  
9. Fix `grow_stage` Off clamp 0–11.  
10. Atomic clone_mode + clone_photo when following.  
11. SPA tip: Follow Plants vs Follow 4x8 vs Custom.  
12. Central mode taxonomy shared FW/brain/SPA (no string scatter).

### Probe / plant model
13. Objects: probe · plant · assignment.  
14. Friendly rename DSC-Probe #1–4; keep `dsc_potN` ids phase 0.  
15. `assigned_plant_id` dropdown (roster | None) under each probe.  
16. Keep `idle_home` as dock only (Soil Test return).  
17. Strip plant_name/strain/sprout from probe NVS after migration.  
18. Remint 0xD4 plant names from roster, not pot helpers.  
19. Want/Got keyed by plant id (or join probe→plant), not pot seat forever.  
20. Vacant seats: empty string, not “Unassigned”/ghost veg.  
21. Dual `in_service` sync: inventory SoT → hub mirror.  
22. Peer MAD must exclude probe_station / unassigned probes (HA + brain agree).

### Calibration / ESP cleverness
23. SoftCal: require N unique Modbus timestamps (≥3) or show “cached not σ”.  
24. Firmware `cal_session`: burst Modbus 2–5s for 30–60s, then restore 60s.  
25. SoftCal average `Soil * Raw` (or session identity scale/offset).  
26. One cal plane: SoftCal/lab → ESP NVS; zero HA offsets after push.  
27. Gate SoftCal commit if `dual_cal_stack` on.  
28. Temp co-read quality gate on capture (reject wild ΔT).  
29. Pause or flag ESP-NOW during burst so mat ignores mid-cal.  
30. Align SoftCal to Modbus edge if no burst FW yet.  
31. On-device burst median/MAD → one `Cal Capture` diagnostic.  
32. Lab wet: wire SPA to real two-point script; or move soak math onto ESP.  
33. Soft-cal session history table in brain (deferred → now in-scope for rebuild).  
34. Don’t SoftCal N/P/K as independent measured channels.  
35. Stamp `soil_cal_last` from SNTP when HA time invalid.

### Trends / history deslop
36. Map `soil_conductivity` in `history_ops` (kill phantom `soil_ec` only).  
37. Chart Got only if Got time series exists; else soil/raw.  
38. Keep long trends on Pi `fleet_history`; ESP ring only for cal session.  
39. Probe history seat_id = hardware id through rename soak.

### Deslop / dead paths
40. Delete/fix lab wet nonexistent `script.dsc_potN_lab_wet_cal` calls.  
41. Collapse `dsc_potN` vs `dsc_pot_N` dual resolve after unique_id migrate.  
42. Remove archive lovelace dual paths from active mental model (docs only).  
43. Calibrate vs Learning duplicate fan/light commit models — pick one.  
44. FlowSankey EXPERIMENTAL / Phase 0 soak — stay deferred, don’t couple.  
45. Deploy: prefer C: RepoRoot or sync spa before Y: pack (already burned once).  
46. Docker prebuilt `demo-fleet-seed.json` must exist in build context.  
47. Document Soft ≠ probe home ≠ tent ≠ retire in operator HelpTip on Root/Settings.

### Verification gates before flash
48. Tests: unknown clone_mode does not stamp Clones.  
49. Tests: clone automation never writes `grow_stage`.  
50. Tests: Follow Plants writes clone numbers; empty intersection refuses.  
51. Panel+hub paired flash checklist.  
52. SoftCal unique-sample count assertion in smoke/UI.  
53. Relationship audit re-run (REL-P1-1/2/3) after phase 0.

---

## Suggested ship order

1. Design doc revise (policy Climate Mode + three-object probe/plant/assignment).  
2. Brain: kill grow_stage overwrite; add Follow Plants job; intersection rules.  
3. Firmware: policy modes + else-safe + protocol bump + Off clamp; cal_session burst.  
4. SoftCal honesty + cal SoT.  
5. Probe friendly rename + assigned_plant_id UI (entity ids stable).  
6. Later: entity id migration / NVS plant strip after soak.

**Act-On + full suggestion list approved 2026-08-29** (operator override: probe rename = entity rename). Spec: `docs/superpowers/specs/2026-08-29-climate-mode-probe-rebuild-design.md`. Plan: `docs/superpowers/plans/2026-08-29-climate-mode-probe-rebuild.md`.
