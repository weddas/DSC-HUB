# Climate Mode + DSC-Probe rebuild — design

**Date:** 2026-08-29  
**Status:** **approved** — Climate Mode + SoftCal Raw (`9343be6`); probe rename / `cal_session` / SoftCal history (`654d0f8`); Pi ESPHome DNS pin + Control ESPHome 2025.12 OTA path + pot3/4 kit retirement (`18849da`). Live OTA: hub + pot1 + pot2 + control @ 7.0.0.0. Ops: `docs/brain/CLIMATE-MODE-POLICY.md`, `PROBE-PLANT-MODEL.md`, `docs/ops/SOFT-CAL.md`, `ESPHOME-OTA-PI.md`.  
**Source:** `docs/superpowers/plans/2026-08-29-pre-rebuild-interrogate.md`  
**Plan:** `docs/superpowers/plans/2026-08-29-climate-mode-probe-rebuild.md`

## Goal

Make 2×4 Climate Mode a **policy** select (not a second stage engine), put **Follow Plants** Want resolution on the Pi, split **probe · plant · assignment**, **rename entities** Pot→Probe, and make SoftCal / trends honest (one ESP NVS cal plane, burst Modbus, no phantom channels).

## Approved Act-On (locked)

| # | Decision |
|---|----------|
| 1 | Climate Mode **policy only**: `Follow 4x8` · `Follow Plants` · `Custom` · `Off` |
| 2 | Panel protocol **version bump + hub/panel co-flash** (idx 0–4 must not silently remap) |
| 3 | **Follow Plants is Pi-owned** — roster/Want on Pi; Pi writes `clone_*` numbers ~12h + on change; ESP mode = don’t stamp |
| 4 | **Kill** brain `grow_stage` writes from `apply_clone_tent_automation` |
| 5 | Fix **`grow_stage` panel clamp** Off→Custom (0–11) |
| 6 | **Probe rename = entity rename** (override: not friendly-name-only / not “keep `dsc_potN` forever”) |
| 7 | SoftCal: **burst Modbus / Raw / one cal plane (ESP NVS)**; gate `dual_cal_stack` |
| 8 | Consider set is **in scope**: idle dock vs `assigned_plant_id`; intersection refuse-empty; one stage SoT; atomic photoperiod; `soil_ec`→`conductivity`; strip plant NVS after roster SoT; lab-wet dead script; pause ESP-NOW mid-cal |

## Climate Mode taxonomy (shared FW / brain / SPA)

Canonical string options on `select.dsc_hub_clone_mode` (display name may stay “Climate Mode” in SPA):

| Option | `clone_mode_idx` (post-bump) | ESP behavior | Who writes numbers |
|--------|------------------------------|--------------|--------------------|
| `Follow 4x8` | 0 | Live-resolve against main stage targets; **no** preset stamp | Hub stage numbers |
| `Follow Plants` | 1 | **No** preset stamp; treat like Custom for sliders + accept Pi writes | Pi Follow Plants job |
| `Custom` | 2 | Sliders untouched; operator/Pi may write | Operator |
| `Off` | 3 | 2×4 inactive; SF1000 dark | — |

**Aliases (NVS migrator, not shown long-term):**

| Legacy | Maps to |
|--------|---------|
| `Clones & Seedlings` | `Follow Plants` (or hold last Custom numbers once, then mode Follow Plants — prefer: migrate mode→Follow Plants, leave numbers) |
| `Mother` | `Custom` (leave numbers; Mother stamp removed) |

**Fail-closed:** unknown option → log + **no stamp** (never else→Clones wet presets).

**Not on wire:** full growth-stage list. Stages stay on `grow_stage` (4×8) and plant Want (roster).

**Atomic follow:** when entering `Follow 4x8` or `Follow Plants`, set `clone_photo_select` with the same policy (Follow 4x8 photo vs Independent for Follow Plants unless plant Want says otherwise — document in Follow Plants job).

### Follow Plants (Pi)

1. Collect plants assigned to probes whose seat/tent is 2×4 (via `assigned_plant_id`, not pot helpers forever).
2. Resolve each plant’s Want (age→stage→band, strain catalog).
3. **Strictest intersection** of Temp/RH/VPD bands; if inverted / empty → **refuse** (hold last Custom numbers; honesty chip; no ghost veg).
4. Write `number.dsc_hub_clone_*` only; do **not** write `grow_stage`.
5. Triggers: every **12h**, plus roster/sprout/assign/`assigned_plant_id` change.
6. Empty 2×4 plants: hold last Custom / honesty — no ghost veg stage stamp.

### Panel protocol

- Bump protocol / vitals field so old panels don’t remap idx.
- Ship **paired flash checklist**: hub + panel same release.
- Fix grow_stage option index clamp to include Off (0–11).

## Probe · plant · assignment

Three objects:

| Object | Meaning |
|--------|---------|
| **Probe** | Hardware DSC-Probe #1–4; sensors; SoftCal; idle dock |
| **Plant** | Roster plant (strain, sprout, Want/Got) |
| **Assignment** | `assigned_plant_id` on probe: roster id \| `None` |

- **`idle_home`**: dock only (Soil Test return). **Not** the measured plant.
- **`assigned_plant_id`**: which plant Got represents; dropdown under each probe (roster \| None).
- **Vacant:** empty string / None — never `"Unassigned"` / ghost veg.
- **Want/Got keyed by plant id** (join probe→plant); do not key forever by pot seat.
- **0xD4 plant names** reminted from roster via assignment, not pot NVS helpers.
- **Dual `in_service`:** inventory SoT → hub mirror.
- **Peer MAD:** exclude `probe_station` / unassigned probes (HA + brain agree).

### Entity rename (approved override)

Rename is **real entity migration**, not friendly-name-only:

| Legacy | Target (canonical) |
|--------|--------------------|
| `dsc_potN_*` / `dsc_pot_N_*` | `dsc_probeN_*` (collapse dual resolve) |
| HA object_ids, unique_ids, brain maps, SPA, history `seat_id` | migrate with shim soak window |

Ship order still sequences UI + brain maps first, then flash/migrate unique_ids, then strip plant fields from probe NVS. SoftAP static map docs update Pot→Probe labels; IPs may stay.

After migration soak: **strip** `plant_name` / `strain` / `sprout` from probe NVS.

## Calibration / SoftCal

- **One cal plane:** SoftCal/lab → ESP NVS scale/offset; **zero HA offsets** after push.
- SoftCal averages **Soil \* Raw** (or session identity scale/offset), not double-calibrated `soil_*`.
- Require **≥3 unique Modbus timestamps** or UI “cached not σ”.
- Firmware **`cal_session`:** burst Modbus 2–5s for 30–60s, then restore 60s; on-device median/MAD → Cal Capture diagnostic.
- **Pause/flag ESP-NOW** during burst so mat ignores mid-cal.
- Gate SoftCal commit if `dual_cal_stack` on.
- Temp co-read quality gate (reject wild ΔT).
- Align SoftCal to Modbus edge if burst FW not flashed yet.
- Lab wet: wire SPA to real two-point script **or** move soak math onto ESP; delete dead `script.dsc_potN_lab_wet_cal` calls.
- Soft-cal **session history** table in brain (**in scope**).
- Do **not** SoftCal N/P/K as independent channels.
- Stamp `soil_cal_last` from SNTP when HA time invalid.

## Trends / history

- Map `soil_conductivity` in `history_ops`; kill phantom `soil_ec`-only paths.
- Chart Got only if Got series exists; else soil/raw.
- Long trends on Pi `fleet_history`; ESP ring only for cal session.
- History `seat_id` = hardware probe id through rename soak.

## Deslop / ops

- Collapse `dsc_potN` vs `dsc_pot_N` after unique_id migrate.
- Archive lovelace dual paths = docs only.
- Calibrate vs Learning: **pick one** fan/light commit model.
- FlowSankey / Phase 0 soak: **deferred**, don’t couple.
- Deploy: C: RepoRoot or sync spa→Y: before pack; Docker `demo-fleet-seed.json` in build context.
- HelpTip: Soft ≠ probe home ≠ tent ≠ retire.

## Verification gates (before flash)

1. Unknown `clone_mode` does not stamp Clones.
2. Clone automation never writes `grow_stage`.
3. Follow Plants writes clone numbers; empty intersection refuses.
4. Panel+hub paired flash checklist.
5. SoftCal unique-sample count in smoke/UI.
6. Relationship audit REL-P1-1/2/3 after phase 0.

## Out of scope / deferred

- FlowSankey EXPERIMENTAL soak coupling.
- PD help publish (blocked on WP/tunnel — separate).
- Hardware Phase0 soak expansion beyond what’s needed for rename/cal.

## Ship order (locked)

1. This design + implementation plan.
2. Brain: kill `grow_stage` overwrite; Follow Plants job; intersection; taxonomy module.
3. Firmware: policy modes + else-safe + protocol bump + Off clamp; `cal_session` burst + ESP-NOW flag.
4. SoftCal honesty + cal SoT + history_ops + session history.
5. Probe entity rename + `assigned_plant_id` UI + dual-resolve collapse.
6. NVS plant strip + SoftAP label docs after soak; REL audit.
