# Probe / plant / assignment model

**In one line:** Hardware probe ≠ roster plant ≠ dock assignment. Entity ids are `dsc_probeN_*` (renamed from `dsc_potN`); assignment is a separate field from idle dock.

Verified tips: `654d0f8` (rename / `assigned_plant_id` / `cal_session`) + `18849da` (kit probe1+2; Expected-stage chips). Against `firmware/v4/dsc-pot-common.yaml`, hub providers, SPA `kitInventory.ts` / Plant\* chips, brain `dash_computed.py` / `sensor_trust.py`. **Live OTA:** hub + pot1 + pot2 + control @ 7.0.0.0 — see [`PROBE-RENAME-CLEANUP.md`](../qa/PROBE-RENAME-CLEANUP.md) and [`ESPHOME-OTA-PI.md`](../ops/ESPHOME-OTA-PI.md).

## Live kit (2026-08-29)

| Seat | Role | In kit? |
|------|------|---------|
| hub | ESP-NOW / climate | Yes |
| pot1 / pot2 (`dsc_probe1/2`) | Soil probes | Yes |
| pot3 / pot4 | YAML + flash map only | **No** — planned OOS (`plannedWhenOff`, seed `in_service: false`, flash defaults omit) |
| control | CYD panel | Yes |

SPA labels seats **Probe N** (`kitInventory.ts`). Brain `_inventory_in_service` defaults `pot3`/`pot4` off when inventory row missing. Do **not** chase F-003 hardware for pot3 — retired from kit.

## Three objects

| Object | Meaning | Tip SoT |
|--------|---------|---------|
| **Probe** | Physical Modbus soil stick + ESP seat | Device `name: dsc_probeN`, friendly **DSC-Probe #N**; entities `sensor.dsc_probeN_*` |
| **Plant** | Roster organism (strain, sprout, stage, notes) | Grow Roster / Plant Seat; brain roster rows |
| **Assignment** | Which plant this probe’s Got represents | Firmware `text.dsc_probeN_assigned_plant_id` (roster id \| empty); brain peer MAD skips vacant |

```mermaid
flowchart TB
  Probe["DSC-Probe #N<br/>dsc_probeN entities"]
  Plant["Roster plant<br/>strain / sprout / stage"]
  Dock["idle_home<br/>Soil Test return dock"]
  Assign["assigned_plant_id<br/>Got represents this plant"]
  Probe -->|"dock only"| Dock
  Probe -->|"measured plant"| Assign
  Assign --> Plant
```

## Do not conflate

| Action | Layer | API / UI |
|--------|--------|----------|
| Unassign idle home | Probe ↔ dock | `PATCH` probe station `idle_home_pot_id: ""` — keeps probe role |
| Remove probe role | Probe demotion | `clear_role` — frees dock; seat no longer probe_station |
| Retire plant | Roster | Plant Seat delete / retire — **not** the same as unassign |
| Soft ≠ lab | Calibration | SoftCal → HA offsets; lab wet → ESP — see [`SOFT-CAL.md`](../ops/SOFT-CAL.md) |

## Entity rename (shipped in tree)

| Before | After |
|--------|--------|
| `dsc_potN_*` / dual `dsc_pot_N_*` | `dsc_probeN_*` (single form) |
| Friendly “Pot N” | **DSC-Probe #N** |
| Hub `packet_transport` providers | Must match `dsc_probeN` device names |

**Secrets stay:** `dsc_potN_api_key` / `_ota_password` / `_ap_password` — do **not** rename secret keys.

YAML stubs remain named `dsc-potN.yaml` / `DSC-ProbeN.yaml` for path stability; **device `name:`** is `dsc_probeN`.

## Assignment + peer MAD

- Firmware: `text.dsc_probeN_assigned_plant_id` — optimistic, restore, vacant = `""` (not `"Unassigned"`).
- Brain `sensor_trust._exclude_from_peer_mad`: probe_station **or** empty `assigned_plant_id` → skip peer MAD.
- Inventory `extra.assigned_plant_id` is also read when present.
- Follow Plants still primarily keys 2×4 via roster tent + seated name/strain (not fully switched to assigned_plant_id yet).

## Expected stage chips (calendar age ≠ live Got)

SPA chips in Plant Wizard / Plant Seat / Plant Extra show **Expected · …** (muted), derived from sprout calendar / `sensor.dsc_build_expected_stage`.

| Signal | Meaning | SoT |
|--------|---------|-----|
| **Expected · {stage}** | Calendar age model only | Sprout date + stage bands |
| **Growth stage select** | Operator / roster live stage | Plant Seat select / roster `growth_stage` |
| Probe `select.dsc_probeN_growth_stage` | Seat mirror when bound | Not the calendar Expected chip |

Do **not** read an Expected chip as live plant state or Climate Mode stage. Tip `18849da` relabeled chips so operators cannot confuse them with Got.

## Probe-station fields (Settings)

`soil_tests._probe_station_config` / `patch_probe_station`:

- `role: "probe_station"`
- `tent` (`2x4` / `4x8`)
- `idle_home_pot_id` — empty string unassigns dock
- `reading_mode` (`idle` / active soil-test)
- `probe_attached`

Defaults seed pot2 → 2×4 and pot4 → 4x8 (`init_probe_station_defaults`). pot4 stays a **config default only** while out of kit — do not treat as live hardware.

## Pitfalls

- Flash **hub providers before / with** probes — mismatched provider names drop soil ESP-NOW.
- Orphan HA entities `sensor.dsc_potN_*` after rediscovery — cleanup checklist (mostly done 2026-08-29).
- Dual `in_service`: inventory SoT vs hub switch — rename does not fix sync by itself.
- Soft ≠ probe home ≠ tent unassign ≠ plant retire ≠ assigned_plant_id clear.
- Expected chip ≠ Growth stage select ≠ Climate Mode.

## Related

- [`CLIMATE-MODE-POLICY.md`](CLIMATE-MODE-POLICY.md)
- [`SOFT-CAL.md`](../ops/SOFT-CAL.md) · [`ESPHOME-OTA-PI.md`](../ops/ESPHOME-OTA-PI.md)
- Cleanup: [`../qa/PROBE-RENAME-CLEANUP.md`](../qa/PROBE-RENAME-CLEANUP.md)
- Spec: [`../superpowers/specs/2026-08-29-climate-mode-probe-rebuild-design.md`](../superpowers/specs/2026-08-29-climate-mode-probe-rebuild-design.md)
