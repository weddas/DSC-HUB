# HA vs brain control inventory (2026-08-29)

Bar 1 Task 1 — gap list only. Sources: `homeassistant/packages/dsc_v4_light_helpers.yaml`, `dsc_v4_core_helpers.yaml`, `dsc_v4_automations.yaml`, `dsc_v4_climate_physics.yaml`; brain `computed_ops.py`, `dash_computed.py`, `hub_controls.py`, `esphome_client.py`; SPA `LightPage.tsx`, `lightSchedule.ts`, `DashHomeSections.tsx` (RUNNING / Today / SF).

Brain column vocabulary: **emitted** = `set_entity` / computed write; **passthrough hub** = Native API ingest via `hub_controls` + `_emit_hub_controls`; **missing** = no brain path for the SPA entity id.

SPA paths live under `homeassistant/custom_components/dsc_hub/frontend/src/` (plan shorthand `frontend/src/`).

## Light / photoperiod

| entity | HA package | brain today | SPA | gap |
|--------|------------|-------------|-----|-----|
| `sensor.dsc_lights_on_today_2x4` | `dsc_v4_light_helpers.yaml` history_stats on `light.dsc_hub_sf1000_dimmer` ON | **emitted** `computed_ops` from `runtime.hours_today("hub","window_2x4_open")` | LightPage Got 2×4 KPI; `DashTodaySection` 2×4 chip | **Wrong SoT vs HA golden** — brain counts clone *window*, HA counts *lamp*. Dual story for “hours on today.” |
| `sensor.dsc_lights_on_today_4x8` | same file history_stats on `binary_sensor.dsc_hub_4x8_window_open` | **emitted** from `window_4x8_open` runtime | LightPage Got 4×8; DashToday 4×8 chip | Metric aligned with HA (window). No `light_loop` honesty attrs yet. |
| `sensor.dsc_expected_light_hours` | `dsc_v4_core_helpers.yaml` template from `select.dsc_hub_grow_stage` (veg 18 / flower 12 / else 0) | **emitted** `dash_computed._expected_light_hours` | LightPage want/gauges; `lightSchedule.readTentPhotoperiodInput("main")`; DashToday denom | Emitted OK; still parallel HA template if packages stay live (dual-run risk). |
| `sensor.dsc_clone_expected_light_hours` | `dsc_v4_light_helpers.yaml` template (Off→0, Follow 4x8→main expected, else `number.dsc_hub_clone_light_hours`) | **emitted** `dash_computed._clone_expected_light_hours` | LightPage want 2×4; DashToday denom | Same dual-run risk; Follow path depends on photoperiod select passthrough. |
| `sensor.dsc_lights_deviation_today` | `dsc_v4_light_helpers.yaml` template: prefer `sensor.dsc_hub_light_delivered_hours − expected`, else `lights_on_today_2x4 − expected` | **missing** | LightPage deviation KPI | **Bar 1 blocker** — SPA reads a sensor brain never emits. |
| `sensor.dsc_hub_light_delivered_hours` | Hub firmware sensor; HA deviation prefers it | Fleet key `light_delivered_hours` in `HUB_SENSOR_OID_TO_KEY` only — **not** `set_entity` to this id | Indirect (HA template only) | **missing entity emit** — Got/deviation cannot prefer delivered hours on brain bus. |
| `switch.dsc_hub_auto_photoperiod` | Hub switch; `dsc_v4_automations.yaml` plant-safety re-arm if OFF >45s without takeover | **passthrough hub** (+ control proxy) | LightPage toggle; override banner | Passthrough OK. HA re-arm guard **not ported** to brain. |
| `time.dsc_hub_lights_on_time` | Hub ESPHome `datetime` `lights_on_time` (type time); HA/SPA id `time.*` (`panel_ha_bus` also cites `datetime.*`) | **missing** — no datetime/time map in `hub_controls` / `_hub_controls_from_states` | LightPage `EntityTime`; `lightSchedule` main clocks; Follow 4x8 validity | **Critical** — schedule start absent from brain SoT → Follow 4x8 + “NO SCHEDULE” collage. Domain `time` vs `datetime` naming drift. |
| `time.dsc_hub_clone_lights_on_time` | Hub `clone_lights_on_time` | **missing** (same) | LightPage Independent 2×4 on-time | Same ingest gap for independent clone schedule. |
| `select.dsc_hub_clone_photoperiod` | Hub select | **passthrough hub** + writes (`control_ops` / `follow_plants`) | LightPage Schedule source; `tentPhotoperiodFollowsMain` | Passthrough OK; SPA still derives clocks locally in `lightSchedule.ts`. |
| `light.dsc_hub_sf1000_dimmer` | Hub light | **passthrough hub** | LightPage ON/%; DashRunning SF chip; TentLightClock lamp; DLI | Passthrough OK. **Third story:** DashRunning treats ON as `state==on && brightness>=1`; LightPage uses `state==on` alone. |
| `binary_sensor.dsc_hub_4x8_window_open` | Hub binary | **passthrough hub** | LightPage window; DashToday glow; TentLightClock main | OK. |
| `binary_sensor.dsc_hub_2x4_window_open` | Hub binary | **passthrough hub** | TentLightClock clone; dark-violation inputs | OK. Used by brain got-hours for 2×4 (see wrong SoT above). |
| `binary_sensor.dsc_clone_dark_period_violation` | `dsc_v4_light_helpers.yaml` template | **emitted** `dash_computed` | LightPage banner; DashRunning SF tone | Emitted OK; HA template dual if packages live. |
| `binary_sensor.dsc_clone_light_missing_in_window` | `dsc_v4_light_helpers.yaml` template (+ HA alert/re-arm automation) | **missing** emit (only counted in alert tally if already present) | LightPage missing banner | **missing** brain port of HA plant-critical binary. |
| `number.dsc_hub_clone_light_hours` | Hub number | **passthrough hub** | LightPage Independent hours draft | OK. |
| `number.dsc_hub_min_dark_hours` | Hub number (informational map) | **passthrough hub** (ingest) | LightPage dark draft | OK. |
| *(module)* photoperiod / Follow 4x8 loop | Firmware window + HA templates/automations | **No `light_loop.py`** — want/got/deviation/SF not one snapshot | SPA `lightSchedule.ts` computes lit/dark clocks client-side | **Third control story** — Task 2 target. |

## Climate / demand / shared air

| entity | HA package | brain today | SPA | gap |
|--------|------------|-------------|-----|-----|
| `switch.dsc_hub_heater_demand` | Hub; `dsc_v4_automations.yaml` relay follower | **passthrough hub** | DashRunning Heat; ClimatePage; LightPage “buying heat” | Passthrough OK; brain does not yet own Want→Need→act ladder as single SoT. |
| `switch.dsc_hub_ac_demand` | same | **passthrough hub** | DashRunning Cool; ClimatePage | OK passthrough. |
| `switch.dsc_hub_humidifier_demand` | same | **passthrough hub** | DashRunning Hum; ClimatePage; Operational fire row | OK. |
| `switch.dsc_hub_dehumidifier_demand` | same | **passthrough hub** | DashRunning Dehum; ClimatePage | OK. |
| `switch.dsc_hub_grow_mat_demand` | same | **passthrough hub** | DashRunning Mat; ClimatePage | OK. |
| `switch.dsc_hub_clone_humidifier_demand` | same | **passthrough hub** | DashRunning C-Hum; ClimatePage Mister | OK. |
| `select.dsc_hub_clone_mode` | Hub select (Follow 4x8 climate inheritance) | **passthrough hub** | LightPage climate chip; DashOperationalNow | Shared-air Follow is select only — no coupled climate loop port yet. |
| `select.dsc_hub_priority_tent` | Hub select | **passthrough hub** | ClimatePage; DashOperationalNow | Shared-duct priority visible; not a full shared-air planner. |
| `select.dsc_hub_control_strategy` | Hub select | **passthrough hub** | ClimatePage | OK. |
| `select.dsc_hub_grow_stage` | Hub select | **passthrough hub** (feeds expected hours emit) | DashOperationalNow; expected-hours path | OK for stage→want hours. |
| `fan.dsc_hub_4_inch_intake_fan_main` / `_2x4` / exhaust room / outside | Hub fans | **passthrough hub**; % mirrored as `sensor.dsc_fan_*_pct` in `computed_ops` | DashFanChips; ClimatePage | Shared plant labeled OK; SPA must not treat as four rooms. |
| `sensor.dsc_vent_heat_dump_btu` | `dsc_v4_climate_physics.yaml` template (allocated OUT CFM × ΔT) | **missing** | LightPage lights-buying-heat; ClimatePage | **missing** brain emit of HA shared-air heat-dump math. |
| `sensor.dsc_heater_runtime_today` | HA history / helpers | **emitted** via `RUNTIME_ENTITIES` in `computed_ops` | DashToday Heat chip | OK. |
| `sensor.dsc_humidifier_cycles_last_hour` | — | **emitted** `dash_computed` | DashToday Hum chip | OK. |
| Fire countdowns `sensor.dsc_hub_*_fire_countdown` | Hub sensors | **emitted** from hub values in `dash_computed` | DashOperationalNow | OK when hub online. |

## Manual takeover / link

| entity | HA package | brain today | SPA | gap |
|--------|------------|-------------|-----|-----|
| `switch.dsc_hub_manual_takeover` | Hub; gates photoperiod re-arm / light-missing | **passthrough hub** (+ control proxy); read in `control_ops` / `follow_plants` / `decision_loop` flag | ClimatePage Master takeover; Dash banners; Operational mode chip | Passthrough OK. **No `hub_failover.py`** reconnect override → temporary override → re-plan yet. |
| `switch.dsc_hub_manual_light_hold` | Hub (ingest-only map) | **passthrough hub** ingest (no `HUB_SWITCH_ENTITY_TO_OID` control row) | LightPage toggle / override banner | Readable; write path may be incomplete vs demand switches. |
| `switch.dsc_hub_tent_manual_override` | Hub | **passthrough hub** | ClimatePage Fan override; Dash banner | OK. |
| `switch.dsc_hub_tent_full_auto_mode` | Hub | **passthrough hub** | ClimatePage Full Auto | OK. |
| `binary_sensor.dsc_hub_ha_link_status` | Hub binary | **passthrough hub** | (link honesty / bridge packages) | Present for link; failover protocol still missing. |
| `switch.dsc_hub_humidifier_intake_routing` / `switch.dsc_hub_recirc_de_strat_pulse` | Hub | **passthrough hub** | ClimatePage shared-air levers | OK as hub mirrors. |

## Priority gaps for Bar 1

1. **Add `light_loop` SoT** — one snapshot for main/clone want hours, Follow 4x8 validity, SF on/%, got hours, deviation, honesty; emit existing sensor ids from that loop (Task 2). Kill SPA `lightSchedule.ts` as a competing schedule engine.
2. **Ingest/emit schedule times** — map hub `lights_on_time` / `clone_lights_on_time` onto `time.dsc_hub_lights_on_time` (+ clone) so Follow 4x8 cannot claim schedule while the bus shows unset.
3. **Align `sensor.dsc_lights_on_today_2x4` with HA golden** — Got must track SF1000 (or hub `light_delivered_hours`), not `window_2x4_open`.
4. **Emit `sensor.dsc_lights_deviation_today`** (and expose `sensor.dsc_hub_light_delivered_hours` when hub publishes delivered hours) so LightPage deviation is not a dead bind.
5. **Port plant-critical light binaries / guards** — `binary_sensor.dsc_clone_light_missing_in_window` emit; auto-photoperiod re-arm policy currently only in `dsc_v4_automations.yaml`.
6. **Unify SF ON semantics** across LightPage, TentLightClock, and DashRunning (brightness 0 + state on must be one honest story).
7. **Shared-air honesty** — emit or honestly omit `sensor.dsc_vent_heat_dump_btu`; keep demand tiles = hub passthrough + brain command ack (Climate Task later).
8. **Hub failover** — manual takeover + reconnect override → temporary override → brain re-plan (`hub_failover.py`, later Bar 1 task); SPA must show that story, not invent a third commander.
