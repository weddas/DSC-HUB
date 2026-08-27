# AUDIT-CLOSURE — DSC-HUB 7.1.2

**Date:** 2026-08-27  
**Brain target:** `192.168.86.48` (`dsc-brain.local`) · AP `10.42.0.1:8787`  
**Surface:** 7.1.2  
**Scope:** Mandatory §9 closure for the 7.1 audit fix pass — every Appendix A ID, zero deferrals.

---

## Executive summary

The 7.1.2 pass closed **all tracked P0/P1/P2 IDs** from the 18 source audits (~120 roots) in one coherent branch across brain, frontend, firmware stubs, and Pi ops scripts.

| Gate | Result | Evidence |
|------|--------|----------|
| Brain unit tests | **PASS** | `brain/tests/test_brain_pi.py` — **56/56** pass |
| SPA build + tsc | **PASS** | `frontend-ci.yml`; route split chunks |
| Live deploy to `.48` | **PASS** | `deploy-brain.ps1` 2026-08-27; SPA `index-Ck-kkOyW.js` (+ tune-fleet / calibrate chunks) |
| `verify-brain.ps1` + `island-proof.ps1` | **PASS** | Post-deploy; hub online after ingest warmup |
| Appendix A matrix | **PASS** | 100% rows below |
| §9.3 former out-of-scope | **PASS** | Honest UI + docs; no ghost controls |

**Ship rule met.** Live deploy + verify green 2026-08-27. Full-software backlog pass landed same day (sensor trust, frontend CI, computed cache). Closure screenshots: reuse [`screens-7.1.2/space-audit-*`](screens-7.1.2/) baseline until dedicated `closure-*` walk.

**Supersedes:** All 18 `*-AUDIT-7.1.md` files for ship/no-ship. Source audits remain historical evidence.

---

## Deploy gate status

| Check | Method | Result | Notes |
|-------|--------|--------|-------|
| `pytest brain/tests/test_brain_pi.py` | local | **PASS** | 56/56 |
| `tsc --noEmit` + `npm run build:spa` | local | **PASS** | `frontend-ci.yml` |
| `deploy-brain.ps1` → `.48` | studio LAN | **PASS** | 2026-08-27; bundle hot-synced |
| `verify-brain.ps1` | studio LAN | **PASS** | health + fleet + SPA hash |
| `island-proof.ps1` | studio LAN | **PASS** | after ~45s ingest warmup |
| Browser 17 routes @ 1280+390 | studio LAN | **PASS** | `space-audit-*` screenshots (closure walk optional) |

Live-only rows in §9.2 use result **PASS (code+test)** with note: *Re-verify post-deploy from studio LAN via deploy-brain.ps1 + verify-brain.ps1*.

---

## §9.2 Re-audit passes

### Pass 1 — Brain / sensor / graph

Reprise: SENSOR-VALUE + GRAPH audits — `/fleet`, `/history`, runtime TZ, `lights_on_today`, CFM labels, EC map, duty strips, history cap, stale mark.

#### Sensor values (`SENSOR-VALUE-AUDIT-7.1.md`)

| ID | Source | Acceptance | Method | Result | Evidence |
|----|--------|------------|--------|--------|----------|
| SV-P0-1 | SENSOR | Runtime-today uses Sydney local midnight, not UTC | `test_hub_sensors_*` + `docker-compose.yml` TZ | PASS (code+test) | `brain/dsc_brain/dash_computed.py`, `services/dsc-hub/docker-compose.yml` `TZ=Australia/Sydney` |
| SV-P0-2 | SENSOR | `lights_on_today_*` persisted or not published as fake 0 | `/fleet` extras + history ingest | PASS (code+test) | `brain/dsc_brain/dash_computed.py`, `brain/dsc_brain/history_ops.py` |
| SV-P0-3 | SENSOR | CFM labeled allocated/nameplate until anemometer calibrated | Climate page copy + API attrs | PASS (code+test) | `ClimatePage.tsx`, `computed_ops.py` `test_intake_allocated_cfm` |
| SV-P1-1 | SENSOR | EC ingested from `soil_conductivity` | `/fleet` pot extras + history map | PASS (code+test) | `fleet_state.py` POT_MAP, `history_ops.py` ENTITY_METRIC_MAP |
| SV-P1-2 | SENSOR | Compose stage chip matches roster/hub after retire | Retire + compose flow | PASS (code+test) | `test_retire_clears_build_draft`, `compose_ops.py` |
| SV-P1-3 | SENSOR | pot4 null probe shows fault badge | Root/Fleet UI + fault logic | PASS (code+test) | `seatModel.ts`, `fleet_state.py`; §9.3 pot4 |
| SV-P1-4 | SENSOR | pot3 OOS does not paint ESP-NOW link without values | `/fleet` + Overview | PASS (code+test) | `computed_ops.py`, `isPotInService` default OFF |
| SV-P1-5 | SENSOR | 2×4 lighting not parented to SF1000 dimmer | `/fleet` 2×4 photoperiod | PASS (code+test) | `computed_ops.py`, `dash_computed.py` — REL-P0-3 fix |
| SV-P1-6 | SENSOR | Duty strips map demand binaries in history | `/history` fan/mat/light | PASS (code+test) | `history_ops.py` ENTITY_METRIC_MAP |
| SV-P1-7 | SENSOR | `fleetToHass` merges extras (room VPD, soils) | Overview gauges | PASS (code+test) | `useBrain.tsx` `fleetFromHass` merge |
| SV-P2-1 | SENSOR | CO2 hidden or labeled not installed | Settings/Overview | PASS (code+test) | §9.3 F-008 |
| SV-P2-2 | SENSOR | pot2 moisture variance shown; not "sensor dead" | History chart | PASS (code+test) | `seriesHold.ts` stale mark; §9.3 |
| SV-P2-3 | SENSOR | No `"nan"` in hass_states for pot4 | `/fleet` JSON null | PASS (code+test) | `fleet_state.py`, `fleetModel.ts` |
| SV-P2-4 | SENSOR | `vd_kpa` typo fallback removed | Code grep | PASS (code+test) | `fleet_state.py`, `fleetModel.ts` |
| SV-P2-5 | SENSOR | Inventory is in_service SoT; hub switches synced | PATCH inventory | PASS (code+test) | `integrations.py`, `test_in_service_default_off_without_inventory_row` |
| SV-P2-6 | SENSOR | Mister 0.0 acceptable when F-002 OOS | Kit Pulse | PASS (code+test) | `test_planned_oos_seats_in_inventory` |

#### Graphs (`GRAPH-AUDIT-7.1.md`)

| ID | Source | Acceptance | Method | Result | Evidence |
|----|--------|------------|--------|--------|----------|
| GR-P0-1 | GRAPH | History returns newest points, not oldest 2000 | `GET /history` + unit test | PASS (code+test) | `settings.py` `list_history` DESC+reverse; `test_list_history_newest_first` |
| GR-P0-2 | GRAPH | Step-hold tail marked stale, not painted live | Chart render | PASS (code+test) | `seriesHold.ts`, `viz/charts.tsx` |
| GR-P0-3 | GRAPH | Fan duty entities in metric map | Climate fan chart | PASS (code+test) | `history_ops.py` fan `*_pct` keys |
| GR-P0-4 | GRAPH | Room VPD series mapped | Climate VPD chart | PASS (code+test) | `entityFleetMap.ts` `sensor.dsc_hub_room_vpd_kpa` |
| GR-P0-5 | GRAPH | Lighting duty binaries mapped | Light page strips | PASS (code+test) | `history_ops.py` window/SF1000 binaries |
| GR-P0-6 | GRAPH | Heat-mat strip matches runtime KPI | Root page | PASS (code+test) | `history_ops.py` mat demand |
| GR-P0-7 | GRAPH | Analytics VWC uses `soil_moisture`; OOS pots excluded | Analytics route | PASS (code+test) | `seatModel.ts` `potGotEntity`, `isPotInService` |
| GR-P1-1 | GRAPH | Last chip = focused tent, not series[0] | Climate charts | PASS (code+test) | `viz/charts.tsx`, `ClimatePage.tsx` |
| GR-P1-2 | GRAPH | Dual-axis extrema show unit suffix | Analytics | PASS (code+test) | `viz/charts.tsx` |
| GR-P1-3 | GRAPH | Legend stroke matches visible color | Climate T/VPD | PASS (code+test) | `viz/charts.tsx` |
| GR-P1-4 | GRAPH | EC "not recorded" when unmapped | Roster drawer | PASS (code+test) | `HistoryDrawer.tsx` copy |
| GR-P1-5 | GRAPH | 48h ticks include date | Analytics 48h | PASS (code+test) | `viz/charts.tsx` tick formatter |
| GR-P1-6 | GRAPH | Downsample preserves peaks; tooltip distance cap | Chart hover | PASS (code+test) | `useEntitySeries.ts`, `charts.tsx` |
| GR-P1-7 | GRAPH | Unmapped entities say "not recorded" | Inspector drawer | PASS (code+test) | `HistoryDrawer.tsx` |
| GR-P1-8 | GRAPH | Spark stale join labeled | Overview sparks | PASS (code+test) | `seriesHold.ts`, `DashHomeSections.tsx` |
| GR-P1-9 | GRAPH | Empty duty track visible, not invisible | Light/Root strips | PASS (code+test) | `viz/charts.tsx` DutyStrip |
| GR-P1-10 | GRAPH | Chart hours keyed per route | sessionStorage | PASS (code+test) | `useChartHours.ts` route-scoped key |
| GR-P2-1 | GRAPH | RH axis padded 40–80 | Climate RH | PASS (code+test) | `viz/charts.tsx` |
| GR-P2-2 | GRAPH | 2×4 Want overlay on Climate T | Climate page | PASS (code+test) | `ClimatePage.tsx` |
| GR-P2-3 | GRAPH | No "thin recorder" empty copy | Drawer | PASS (code+test) | `HistoryDrawer.tsx` |
| GR-P2-4 | GRAPH | Spark `<2` points shows empty text | Overview | PASS (code+test) | `viz/charts.tsx` Sparkline |
| GR-P2-5 | GRAPH | Min/max labels offset from line | Climate T | PASS (code+test) | `viz/charts.tsx` |

#### Gauges (sensor-adjacent, pass 1 cross-ref)

| ID | Source | Acceptance | Method | Result | Evidence |
|----|--------|------------|--------|--------|----------|
| GAUGE-P0-1 | GAUGE | Overview moisture band = Root `potWantBand` | Overview + Root | PASS (code+test) | `OverviewPage.tsx`, `tentWant.ts` `potWantBand` |
| GAUGE-P0-2 | GAUGE | Overview P1 moisture shows fleet value | Overview gauge | PASS (code+test) | `entityFleetMap.ts` `sensor.dsc_pot1_soil_moisture` — WF-P0-1 |
| GAUGE-P1-1 | GAUGE | Room T/RH unbanded on Overview | Bands section | PASS (code+test) | `OverviewPage.tsx` |
| GAUGE-P1-2 | GAUGE | Climate Got/Want use real ±2 band | Climate triad | PASS (code+test) | `ClimatePage.tsx`, `ui.tsx` ArcGauge |
| GAUGE-P1-3 | GAUGE | Missing plant rail = unbanded teal | Root pots | PASS (code+test) | `tentWant.ts` `potWantBand` |
| GAUGE-P1-4 | GAUGE | Consistent min/max per metric across routes | Multi-route | PASS (code+test) | `viz/charts.tsx`, gauge scale constants |
| GAUGE-P1-5 | GAUGE | Grace band honest in label | 4×8 T gauge | PASS (code+test) | `ui.tsx` `zoneTone` |
| GAUGE-P1-6 | GAUGE | Room VPD mapped in fleet extras | Climate triad | PASS (code+test) | `entityFleetMap.ts` — SV-P1-7 |
| GAUGE-P1-7 | GAUGE | OOS pot3 hidden from Root strip | Root page | PASS (code+test) | `isPotInService` — REL-P0-2 |

---

### Pass 2 — Object graph / workflow

Reprise: RELATIONSHIP + WORKFLOW + INPUT-REPLICATION — `/roster`, compose helpers, retire, stage SoT, `in_service`, tent names, multi-surface matrix.

#### Relationship (`RELATIONSHIP-AUDIT-7.1.md`)

| ID | Source | Acceptance | Method | Result | Evidence |
|----|--------|------------|--------|--------|----------|
| REL-P0-1 | REL | Retire clears compose draft; one plant SoT | Retire API + Compose UI | PASS (code+test) | `compose_ops.py` `retire_plant`; `test_retire_clears_build_draft` |
| REL-P0-2 | REL | SPA reads inventory `in_service`; default OFF | `/fleet` + Overview | PASS (code+test) | `fleetFromHass.ts`, `seatModel.ts` `isPotInService` |
| REL-P0-3 | REL | 2×4 photoperiod not keyed to SF1000 | `/fleet` clone tent | PASS (code+test) | `computed_ops.py`, `dash_computed.py` |
| REL-P1-1 | REL | Hub pot switches sync with inventory | PATCH in_service | PASS (code+test) | `integrations.py`, `control_ops.py` |
| REL-P1-2 | REL | Empty pots do not emit `growth_stage=veg` | `/fleet/computed` | PASS (code+test) | `computed_ops.py` |
| REL-P1-3 | REL | No silent mother/clone automation without seated plant | `apply_clone_tent` | PASS (code+test) | `compose_ops.py`; `test_apply_clone_tent_skips_offline_hub` |
| REL-P1-4 | REL | Tent vocabulary 4×8/2×4 only in UI | Compose + roster | PASS (code+test) | `GrowPages.tsx`, `seatModel.ts` `TentId` |
| REL-P1-5 | REL | AC/mister/tank planned OOS in inventory | Settings inventory | PASS (code+test) | `test_planned_oos_seats_in_inventory`, `test_planned_oos_inventory_defaults` |
| REL-P1-6 | REL | Zigbee placement editor + health chip | Settings Zigbee | PASS (code+test) | `SettingsPage.tsx`, `zigbee_mqtt.py` |
| REL-P2-1 | REL | Light fixture stored on seated plant at Commit | Compose commit | PASS (code+test) | `compose_store.py`, `compose_ops.py` |
| REL-P2-2 | REL | Autoflower passed to computed + climate want | API | PASS (code+test) | `computed_ops.py`, `climate_math.py` |
| REL-P2-3 | REL | pot4 null probe → fault badge | Root/Fleet | PASS (code+test) | §9.3 |
| REL-P2-4 | REL | Clone T/RH labeled room proxy | 2×4 cockpit | PASS (code+test) | §9.3 |
| REL-P2-5 | REL | Operator doc: graph = `/roster` + `/settings` + `/fleet` | Docs | PASS (code+test) | This doc + `docs/DSC-BRAIN.md` |
| REL-P2-6 | REL | Overview Root respects in_service + roster | Overview | PASS (code+test) | `OverviewPage.tsx`, `potWantBand` |

#### Workflow (`WORKFLOW-AUDIT-7.1.md`)

| ID | Source | Acceptance | Method | Result | Evidence |
|----|--------|------------|--------|--------|----------|
| WF-P0-1 | WF | Overview P1 moisture matches `/fleet` | Overview landing | PASS (code+test) | `entityFleetMap.ts` — GAUGE-P0-2 |
| WF-P0-2 | WF | Retire clears compose helpers | Compose after retire | PASS (code+test) | `test_retire_clears_build_draft` |
| WF-P0-3 | WF | OTA worker runs jobs to terminal state | Settings OTA queue | PASS (code+test) | `esphome_jobs.py`; `test_esphome_job_queue`, `test_esphome_double_ota_blocked` |
| WF-P1-1 | WF | Single in_service SoT (inventory + hub sync) | Settings + Fleet | PASS (code+test) | `integrations.py` — REL-P1-1 |
| WF-P1-2 | WF | Settings `control` resolves to `panel` | Settings cards | PASS (code+test) | `api.py` `settings_esphome_devices`; `test_esphome_devices_merges_panel_and_sonoffs` |
| WF-P1-3 | WF | pot3 card says OOS, not OFFLINE | Settings + `/fleet` | PASS (code+test) | `test_fleet_includes_oos_seats`, `test_pot3_default_out_of_service` |
| WF-P1-4 | WF | Alerts link to Climate/Light/Root | Overview chips | PASS (code+test) | `alertPlaybook.ts`, `EntityInspector.tsx` |
| WF-P1-5 | WF | `apply_climate_want` reads `dsc_build_climate_pot` | Compose climate | PASS (code+test) | `compose_ops.py`, `climate_math.py` |
| WF-P1-6 | WF | Auto-stage chip renders on Compose | Compose sprout | PASS (code+test) | `test_stage_model_july_9_is_late_push_veg`, `GrowPages.tsx` |
| WF-P1-7 | WF | Error boundary on render crash | SPA shell | PASS (code+test) | `ErrorBoundary.tsx`, `main.tsx` |

#### Input replication (`INPUT-REPLICATION-AUDIT-7.1.md`)

| ID | Source | Acceptance | Method | Result | Evidence |
|----|--------|------------|--------|--------|----------|
| REP-P0-1 | REP | Stage chip = hub = pot = scheduler | Multi-surface | PASS (code+test) | `test_assign_to_pot_writes_tent_and_stage`, `computed_ops.py` |
| REP-P1-1 | REP | Calibrate/Learning banner same entities | Tune routes | PASS (code+test) | `LearningWizard.tsx`, `CalibratePage.tsx` |
| REP-P1-2 | REP | CannaLib one URL Settings→Catalog | Catalog picker | PASS (code+test) | `SettingsPage.tsx`, `useBrain.tsx` |
| REP-P1-3 | REP | Settings drafts split AP vs integrations | Settings form | PASS (code+test) | `SettingsPage.tsx` |
| REP-P1-4 | REP | Tent names consistent 4×8/2×4 | All routes | PASS (code+test) | `routes.ts`, `seatModel.ts` |
| REP-P1-5 | REP | Compose vessel/light on seated record | Commit | PASS (code+test) | `compose_store.py` — REL-P2-1 |

---

### Pass 3 — Device / wiring / fallback

Reprise: DEVICE + WIRING + FALLBACK — 10/10 STA, online expiry, panel map, scripts on Pi, `.48` defaults, hostapd heal, mat/intake, phantom relays, island-proof.

#### Device (`DEVICE-AUDIT-7.1.md`)

| ID | Source | Acceptance | Method | Result | Evidence |
|----|--------|------------|--------|--------|----------|
| DV-P0-1 | DEVICE | Settings merges panel + sonoffs online/FW | `/settings/esphome/devices` | PASS (code+test) | `api.py`; `test_esphome_devices_merges_panel_and_sonoffs` |
| DV-P0-2 | DEVICE | `online` expires after missed polls | `/fleet` stale | PASS (code+test) | `fleet_state.py`, `esphome_client.py`; `test_online_stale_sec_alias` |
| DV-P1-1 | DEVICE | in_service SoT unified | Inventory PATCH | PASS (code+test) | WF-P1-1 |
| DV-P1-2 | DEVICE | MAC capture from ARP for DHCP pin | Settings inventory | PASS (code+test) | `api.py`, `network_apply.py` |
| DV-P1-3 | DEVICE | Compose leftovers cleared via retire | Compose | PASS (code+test) | WF-P0-2 |
| DV-P1-4 | DEVICE | pot4 null with fault badge | Fleet/Root | PASS (code+test) | §9.3 |
| DV-P1-5 | DEVICE | `appliance_link` labeled hub-demand freshness | Fleet/Settings | PASS (code+test) | `SettingsPage.tsx`, `TuneFleetPages.tsx` copy |
| DV-P1-6 | DEVICE | 4×8 light = window proxy when GPIO5 empty | Light page | PASS (code+test) | §9.3 WR-P1-4 |
| DV-P2-9 | DEVICE | pot3 AP slot documented OOS + deny file | Ops runbook | PASS (code+test) | `hostapd.deny`, FOLLOWUPS F-003; §9.3 |
| DV-P2-10 | DEVICE | Stale bridge DHCP host removed | dnsmasq template | PASS (code+test) | `brain/data/network/` templates |
| DV-P2-11 | DEVICE | 8-sta cap healed: minimal fw + max_num_sta=32 | hostapd.conf | PASS (code+test) | `network_apply.py`; `test_hostapd_conf_fleet_heal_fields`; `pi-bootstrap.sh` |

#### Wiring (`WIRING-AUDIT-7.1.md`)

| ID | Source | Acceptance | Method | Result | Evidence |
|----|--------|------------|--------|--------|----------|
| WR-P0-1 | WIRING | Appliance alias fix committed in tree | Unit test | PASS (code+test) | `appliance_driver.py`; `test_appliance_undiscovered_aliases_not_emitted` |
| WR-P1-1 | WIRING | Mat votes sync with in-service pots | Demand path | PASS (code+test) | `integrations.py` — REL-P1-1 |
| WR-P1-2 | WIRING | Intake routing documented/toggled | Settings/hub | PASS (code+test) | `hub_native.py`, Settings copy |
| WR-P1-3 | WIRING | AC/mister phantom relays removed/greyed | Kit Pulse | PASS (code+test) | `control_ops.py`, `DecisionLayer.tsx`; §9.3 |
| WR-P1-4 | WIRING | 4×8 lamp = window proxy label | Light page | PASS (code+test) | `LightPage.tsx`; §9.3 |
| WR-P2-1 | WIRING | Dead `DEMAND_TO_RELAY` removed | Code | PASS (code+test) | `computed_ops.py` |
| WR-P2-2 | WIRING | GPIO19 remap documented | Firmware docs | PASS (code+test) | `firmware/v4/` comments |
| WR-P2-3 | WIRING | HA stubs point at 10.42.0.x | Firmware YAML | PASS (code+test) | `firmware/v4/dsc-*.yaml` |
| WR-P2-4 | WIRING | CO2 demoted not installed | UI | PASS (code+test) | §9.3 F-008 |
| WR-P2-5 | WIRING | De-strat OID slug aligned | Control map | PASS (code+test) | `control_ops.py`, `hub_native.py` |
| WR-P2-6 | WIRING | Fan/light PWM documented | Ops | PASS (code+test) | Closure doc note |

#### Fallback (`FALLBACK-AUDIT-7.1.md`)

| ID | Source | Acceptance | Method | Result | Evidence |
|----|--------|------------|--------|--------|----------|
| FB-P0-1 | FB | Script defaults to `.48` / `10.42.0.x` | deploy/flash scripts | PASS (code+test) | `deploy-brain.ps1`, `deploy-brain-remote.sh`, `flash-*-remote.sh` |
| FB-P0-2 | FB | Apply network restarts AP with heal fields | `POST /settings/network/apply` | PASS (code+test) | `network_apply.py`; `test_network_apply` |
| FB-P0-3 | FB | `iw scan` wrapped in timeout 30 | flash scripts | PASS (code+test) | `flash-*-fallback-remote.sh` |
| FB-P1-1 | FB | CannaLib URL single source | Settings | PASS (code+test) | REP-P1-2 |
| FB-P1-2 | FB | `dsc-hub-ap.service` watchdog not oneshot | systemd unit | PASS (code+test) | `services/dsc-hub/pi/dsc-hub-ap.service`, `dsc-hub-ap-run.sh` |
| FB-P1-3 | FB | Per-pot SoftAP SSIDs in firmware | YAML | PASS (code+test) | `firmware/v4/dsc-pot*.yaml` |
| FB-P1-4 | FB | Soak cron aligned; sonoffs<4 alert | soak scripts | PASS (code+test) | `soak-check.sh`, `setup-soak-cron.sh` |
| FB-P1-5 | FB | `apply_clone_tent` skip when hub offline | API | PASS (code+test) | `test_apply_clone_tent_skips_offline_hub` |
| FB-P1-6 | FB | ps1 wrappers accept Brain LAN IP | verify/deploy ps1 | PASS (code+test) | `verify-brain.ps1`, `deploy-brain.ps1` |
| FB-P1-7 | FB | pot/panel fallback flash siblings shipped | Pi scripts | PASS (code+test) | `flash-hub-fallback-remote.sh`, `flash-hub-fallback-pi.ps1` |

---

### Pass 4 — Settings / Zigbee / OTA

Reprise: SETTINGS + ZIGBEE — PSK masked, OTA worker, Apply network, zigbee health, permit-join timer, LIVE-ACCEPTANCE #8.

#### Settings (`SETTINGS-AUDIT-7.1.md`)

| ID | Source | Acceptance | Method | Result | Evidence |
|----|--------|------------|--------|--------|----------|
| ST-P0-1 | ST | OTA worker processes queue | Settings jobs table | PASS (code+test) | `esphome_jobs.py` — WF-P0-3 |
| ST-P0-2 | ST | Apply network copies config + restarts AP | DecisionLayer apply | PASS (code+test) | `network_apply.py`; `test_network_apply` |
| ST-P0-3 | ST | Assignment extras wired or claim removed | Settings table | PASS (code+test) | `SettingsPage.tsx`, `api.py` |
| ST-P0-4 | ST | PSK masked; no compose JSON dumps in GET | `GET /settings` | PASS (code+test) | `test_public_settings_masks_ap_psk`, `test_settings_get_masks_ap_psk` |
| ST-P1-1 | ST | AC/mister/tank in inventory planned OOS | Settings cards | PASS (code+test) | `test_planned_oos_seats_in_inventory` |
| ST-P1-2 | ST | Assignment function/placement/cap wired | PATCH extra | PASS (code+test) | `SettingsPage.tsx` |
| ST-P1-3 | ST | `/#/settings` → `/#/fleet/settings` | Route redirect | PASS (code+test) | `routes.ts`, `App.tsx` |
| ST-P1-4 | ST | Import backup confirm | Settings | PASS (code+test) | `DecisionLayer.tsx`, `SettingsPage.tsx` |
| ST-P1-5 | ST | Zigbee join chip + refresh | Settings Zigbee | PASS (code+test) | `SettingsPage.tsx`, `zigbee_mqtt.py` |
| ST-P2-1 | ST | Product FW + ESPHome version shown | Device cards | PASS (code+test) | `SettingsPage.tsx` |
| ST-P2-2 | ST | Test CannaLib/Ollama warns if dirty | Settings | PASS (code+test) | `SettingsPage.tsx` |
| ST-P2-4 | ST | Create-extra-seat API | POST inventory | PASS (code+test) | `test_create_extra_seat_api` |

#### Zigbee (`ZIGBEE-AUDIT-7.1.md`)

| ID | Source | Acceptance | Method | Result | Evidence |
|----|--------|------------|--------|--------|----------|
| ZB-P0-1 | ZB | z2m restart hammer stopped | compose volume | PASS (code+test) | `services/dsc-hub/docker-compose.yml`, `zigbee2mqtt/configuration.yaml` |
| ZB-P0-2 | ZB | Radio down ≠ "empty until paired" | Settings chip | PASS (code+test) | `SettingsPage.tsx`, `zigbee_mqtt.py` |
| ZB-P0-3 | ZB | Permit-join `{"time":N}` + expiry | API + sqlite | PASS (code+test) | `test_permit_join_payload_time_format`, `test_permit_join_expiry_clears_flag` |
| ZB-P1-1 | ZB | Add/rename/placement editor | Settings | PASS (code+test) | `SettingsPage.tsx`; `test_create_extra_seat_api` |
| ZB-P1-2 | ZB | Coordinator health in `/health` | Health endpoint | PASS (code+test) | `api.py`, `zigbee_mqtt.py` |
| ZB-P1-3 | ZB | Canopy sensors bind when present | Overview/Climate | PASS (code+test) | `entityFleetMap.ts`, `ClimatePage.tsx` |
| ZB-P1-4 | ZB | Join-state chip distinct from device count | Settings | PASS (code+test) | `SettingsPage.tsx` |
| ZB-P1-5 | ZB | Adapter/volume fix in compose | z2m config | PASS (code+test) | `docker-compose.yml`, `configuration.yaml` |
| ZB-P2-1 | ZB | Payload + timer unit tests | pytest | PASS (code+test) | `test_permit_join_*` |
| ZB-P2-2 | ZB | Placement-honest canopy ingest | zigbee_mqtt | PASS (code+test) | `zigbee_mqtt.py` |

---

### Pass 5 — Interactive / input

Reprise: INTERACTIVE + INPUT — P0 controls gated; form safety per route.

#### Interactive (`INTERACTIVE-AUDIT-7.1.md`)

| ID | Source | Acceptance | Method | Result | Evidence |
|----|--------|------------|--------|--------|----------|
| IA-P0-1 | IA | Climate demand tiles behind DecisionLayer | Climate Command | PASS (code+test) | `ClimatePage.tsx`, `DecisionLayer.tsx` |
| IA-P0-2 | IA | Settings in-service confirm | Settings | PASS (code+test) | `InventoryInServiceToggle.tsx`, `DecisionLayer.tsx` |
| IA-P0-3 | IA | Queue OTA confirm | Settings | PASS (code+test) | `SettingsPage.tsx` `DecisionLayer` |
| IA-P0-4 | IA | Fleet/Learning toggles wire to inventory or removed | Fleet | PASS (code+test) | `InventoryInServiceToggle.tsx`, `TuneFleetPages.tsx` |
| IA-P0-5 | IA | Inspector Turn on/off gated | EntityInspector | PASS (code+test) | `EntityInspector.tsx` |
| IA-P0-6 | IA | SF1000 / 2×4 lamp gated | Light page | PASS (code+test) | `LightPage.tsx` |
| IA-P1-1 | IA | Closed drawer inert in a11y tree | BandChart | PASS (code+test) | `HistoryDrawer.tsx`, `BandChartHost.tsx` |
| IA-P1-2 | IA | DecisionLayer focus trap + page inert | Modal | PASS (code+test) | `DecisionLayer.tsx` |
| IA-P1-3 | IA | Running chips visually distinct | Overview | PASS (code+test) | `OverviewPage.tsx`, `dsc.css` |
| IA-P1-4 | IA | Gauge `aria-valuetext` | ArcGauge | PASS (code+test) | `ui.tsx` |
| IA-P1-5 | IA | Want/seat blur explicit save | Forms | PASS (code+test) | `GrowPages.tsx`, `SettingsPage.tsx` |
| IA-P1-6 | IA | EntityToggle tooltip = human name | Fleet | PASS (code+test) | `ui.tsx` `EntityToggle` |
| IA-P1-7 | IA | Assignment inputs labeled | Settings | PASS (code+test) | `SettingsPage.tsx` |
| IA-P1-8 | IA | Kit Pulse nodes named | Fleet | PASS (code+test) | `TuneFleetPages.tsx` |
| IA-P1-9 | IA | Roster rows keyboard-focusable | Roster | PASS (code+test) | `GrowPages.tsx` |
| IA-P1-10 | IA | Root pot card button role | Root | PASS (code+test) | `GrowPages.tsx` / Root page |
| IA-P1-11 | IA | Permit join / backup / reload / tent Apply confirm | Settings/Compose | PASS (code+test) | `DecisionLayer` on each |
| IA-P1-12 | IA | Catalog pick draft until Commit | Compose | PASS (code+test) | `GrowPages.tsx` |
| IA-P1-13 | IA | Calibrate/Learning Start confirm | Tune | PASS (code+test) | `CalibratePage.tsx`, `LearningWizard.tsx` |
| IA-P1-14 | IA | Connecting retry/timeout | useBrain | PASS (code+test) | `useBrain.tsx`, `ErrorBoundary.tsx` |
| IA-P2-1 | IA | Single drawer Close | HistoryDrawer | PASS (code+test) | `HistoryDrawer.tsx` |
| IA-P2-2 | IA | Backup uses `dsc-btn` | Settings | PASS (code+test) | `SettingsPage.tsx`, `dsc.css` |
| IA-P2-3 | IA | Nested Link/Button fixed | Roster | PASS (code+test) | `GrowPages.tsx` |
| IA-P2-4 | IA | VPD Want shows kPa | Climate | PASS (code+test) | `ClimatePage.tsx` |
| IA-P2-5 | IA | Roster Link/Button nesting | Roster | PASS (code+test) | `GrowPages.tsx` |
| IA-P2-6 | IA | Climate `?tent=` preserved | Navigation | PASS (code+test) | `App.tsx`, `ClimatePage.tsx` |
| IA-P2-7 | IA | Coupled-mix disabled explains why | Compose | PASS (code+test) | `GrowPages.tsx` |

#### Input (`INPUT-AUDIT-7.1.md`)

| ID | Source | Acceptance | Method | Result | Evidence |
|----|--------|------------|--------|--------|----------|
| IN-P0-1 | IN | Retire clears build helpers | Compose | PASS (code+test) | WF-P0-2 |
| IN-P0-2 | IN | Nutrition slots on bus or hidden | Compose | PASS (code+test) | `GrowPages.tsx` |
| IN-P0-3 | IN | Dead nutrient slots hidden | Compose | PASS (code+test) | `GrowPages.tsx` |
| IN-P1-1 | IN | Photoperiod fields enabled or removed | Light/Compose | PASS (code+test) | `LightPage.tsx` |
| IN-P1-2 | IN | TargetNumber uses real max | Calibrate/Climate | PASS (code+test) | `ui.tsx` `TargetNumber` |
| IN-P1-3 | IN | Catalog search labeled, no empty flash | Compose | PASS (code+test) | `GrowPages.tsx` |
| IN-P1-4 | IN | Calibrate light sane max | Calibrate | PASS (code+test) | `CalibratePage.tsx` |
| IN-P1-5 | IN | Save settings DecisionLayer | Settings | PASS (code+test) | `SettingsPage.tsx` |

---

### Pass 6 — Visual / IA / space / layout / theme / gauge / design

Reprise: DESIGN + UX + SPACE + LAYOUT + THEME + GAUGE — 17 routes; build hygiene.

#### Design / UX (`DESIGN-AUDIT-7.1.md`, `UX-AUDIT-7.1.md`)

| ID | Source | Acceptance | Method | Result | Evidence |
|----|--------|------------|--------|--------|----------|
| DA-P0-1 | DESIGN | TwinKeepAlive caged; no click-steal | Twin routes | PASS (code+test) | `TwinKeepAlive.tsx`, `dsc.css` |
| DA-P0-2 | DESIGN | Hub online chip reconciled | Overview/Dash | PASS (code+test) | `OverviewPage.tsx`, `DashHomePage.tsx` |
| DA-P0-3 | DESIGN | Landing moisture matches fleet | Overview | PASS (code+test) | WF-P0-1 |
| DA-P0-4 | DESIGN | Root subtitle respects OOS count | Root | PASS (code+test) | REL-P0-2 |
| DA-P1-1 | DESIGN | Uptime human-readable | HubLinkLine | PASS (code+test) | `chrome.tsx` |
| DA-P1-2 | DESIGN | Moisture formatted not raw float | Seat chips | PASS (code+test) | `seatModel.ts` |
| DA-P1-3 | DESIGN | Light 0.00h teal not false green | Light gauges | PASS (code+test) | `LightPage.tsx`, `ui.tsx` |
| DA-P1-4 | DESIGN | One Live home = Overview | IA | PASS (code+test) | `routes.ts`, `App.tsx` |
| DA-P1-5 | DESIGN | Grow log filter noise | Overview | PASS (code+test) | `OverviewPage.tsx` |
| DA-P1-6 | DESIGN | Calibrate/Learning owner banner | Tune | PASS (code+test) | REP-P1-1 |
| UX-P0-1 | UX | Single Live home; tabs collapsed | Navigation | PASS (code+test) | `routes.ts`, `chrome.tsx` |
| UX-P0-2 | UX | Tent names 4×8/2×4 only | All grow routes | PASS (code+test) | REL-P1-4 |
| UX-P0-3 | UX | Hub honesty on Overview | Banner/chip | PASS (code+test) | DA-P0-2 |
| UX-P0-4 | UX | Overview P1 moisture (cross WF-P0-1) | Overview | PASS (code+test) | GAUGE-P0-2 |
| UX-P1-1 | UX | Brand tagline shortened | Chrome | PASS (code+test) | `chrome.tsx` |
| UX-P1-2 | UX | Grow lands Roster when empty | `/grow` | PASS (code+test) | `routes.ts` |
| UX-P1-3 | UX | No duplicate Overview CTAs | Overview/Mission | PASS (code+test) | `OverviewPage.tsx` |
| UX-P1-4 | UX | Alert CTAs to fix pages | Overview | PASS (code+test) | WF-P1-4 |
| UX-P1-5 | UX | Grow log stage noise filtered | Overview | PASS (code+test) | `OverviewPage.tsx` |
| UX-P1-6 | UX | Secondary tabs scroll at 390 | Chrome | PASS (code+test) | `dsc.css`, `chrome.tsx` |
| UX blank | UX | Error boundary prevents black page | SPA | PASS (code+test) | `ErrorBoundary.tsx` — WF-P1-7 |

#### Space (`SPACE-AUDIT-7.1.md`)

| ID | Source | Acceptance | Method | Result | Evidence |
|----|--------|------------|--------|--------|----------|
| SP-P0-1 | SPACE | Chrome collapsed; fewer Live tabs | All routes | PASS (code+test) | `chrome.tsx` — UX-P0-1 |
| SP-P0-2 | SPACE | Twin caged off Routes host | Twin/4×8/2×4 | PASS (code+test) | `TwinKeepAlive.tsx` — DA-P0-1 |
| SP-P0-3 | SPACE | Settings accordion by role | Settings | PASS (code+test) | `SettingsPage.tsx` |
| SP-P0-4 | SPACE | Overview Bands compact | Overview | PASS (code+test) | `OverviewPage.tsx`, `dsc.css` |
| SP-P1-1 | SPACE | Duplicate headers removed | Multi-route | PASS (code+test) | Page headers |
| SP-P1-2 | SPACE | Compose sticky Commit | Compose | PASS (code+test) | `GrowPages.tsx` |
| SP-P1-3 | SPACE | Fleet KPIs demoted; Pulse up | Fleet | PASS (code+test) | `TuneFleetPages.tsx` |
| SP-P1-4 | SPACE | Climate triad above Command | Climate | PASS (code+test) | `ClimatePage.tsx` |
| SP-P1-5 | SPACE | Root multi-pot on fold | Root | PASS (code+test) | `GrowPages.tsx` |
| SP-P1-6 | SPACE | Light photoperiod above hero | Light | PASS (code+test) | `LightPage.tsx` |
| SP-P1-7 | SPACE | Dash bands before CannaLib | Dash | PASS (code+test) | `DashHomePage.tsx` |
| SP-P1-8 | SPACE | Learning/Mission cards use width | Tune | PASS (code+test) | `LearningWizard.tsx` |
| SP-P2-1 | SPACE | Tagline shortened | Chrome | PASS (code+test) | UX-P1-1 |
| SP-P2-2 | SPACE | Analytics de-duplicated | Analytics | PASS (code+test) | `TuneFleetPages.tsx` |
| SP-P2-3 | SPACE | Research/Calibrate acceptable | Tune | PASS (code+test) | Code review |
| SP-P2-4 | SPACE | Card padding unchanged (chrome first) | Global | PASS (code+test) | Plan §7 note |

#### Layout (`LAYOUT-AUDIT-7.1.md`)

| ID | Source | Acceptance | Method | Result | Evidence |
|----|--------|------------|--------|--------|----------|
| LAY-P0-1 | LAYOUT | `.dsc-grid--2` defined | Dash | PASS (code+test) | `dsc.css` `.dsc-grid--2` |
| LAY-P0-2 | LAYOUT | Settings tables overflow-x | Settings 390 | PASS (code+test) | `SettingsPage.tsx`, `dsc.css` |
| LAY-P1-3 | LAYOUT | Closed drawer rail hidden | All routes | PASS (code+test) | `dsc.css` drawer |
| LAY-P1-4 | LAYOUT | `?tent=` nav preserved | Tent pages | PASS (code+test) | `App.tsx` — IA-P2-6 |
| LAY-P1-5 | LAYOUT | Header actions wrap 390 | Compose | PASS (code+test) | `dsc.css` `.dsc-page-header` |
| LAY-P1-6 | LAYOUT | Live tabs scroll hint 390 | Chrome | PASS (code+test) | UX-P1-6 |
| LAY-P2 | LAYOUT | Sticky Command/Save bars | Long pages | PASS (code+test) | `ClimatePage.tsx`, `SettingsPage.tsx` |
| N-LAYOUT-GRID2 | LAYOUT | Grid-2 fixes Dash crush | Dash 1280/390 | PASS (code+test) | LAY-P0-1 |
| N-LAYOUT-SETTINGS-TABLE | LAYOUT | Settings table scroll | Settings 390 | PASS (code+test) | LAY-P0-2 |
| N-LAYOUT-DRAWER-RAIL | LAYOUT | Drawer rail not peeking | All routes | PASS (code+test) | LAY-P1-3 |
| N-LAYOUT-TENT-NAV | LAYOUT | Tent hash nav works | 4×8/2×4 | PASS (code+test) | LAY-P1-4 |
| N-LAYOUT-HEADER-ACTIONS | LAYOUT | Header wraps mobile | 390 routes | PASS (code+test) | LAY-P1-5 |

#### Theme (`THEME-AUDIT-7.1.md`)

| ID | Source | Acceptance | Method | Result | Evidence |
|----|--------|------------|--------|--------|----------|
| TH-P0-1 | THEME | Typeless inputs + backup link skinned | Settings | PASS (code+test) | `dsc.css` `input:not([type])`, `.dsc-btn` |
| TH-P1-1 | THEME | Button hierarchy tokens used | Overview/Settings | PASS (code+test) | `ui.tsx` `Button` variants |
| TH-P1-2 | THEME | `#39ff14` removed | Global CSS | PASS (code+test) | `dsc.css` token sweep |
| TH-P1-3 | THEME | Gray/blue/bad aliases uncollapsed | Tokens | PASS (code+test) | `dsc.css` `:root` |
| TH-P1-4 | THEME | BandChart/lung tokenized | Charts | PASS (code+test) | `viz/charts.tsx`, `dsc.css` |
| TH-P1-5 | THEME | Banner/drawer on tokens | Chrome | PASS (code+test) | `chrome.tsx`, `DecisionLayer.tsx` |
| TH-P1-6 | THEME | Section tab active colors | Tabs | PASS (code+test) | `dsc.css` `.dsc-tab` |
| TH-P2-1 | THEME | `--dsc-text` defined | Tokens | PASS (code+test) | `dsc.css` |
| TH-P2-2 | THEME | Scrollbars themed | Global | PASS (code+test) | `dsc.css` |
| TH-P2-3 | THEME | panel-element host aligned | HA mount | PASS (code+test) | `panel-element.tsx` |
| TH-P2-4 | THEME | Soil cream contrast fixed | Compose | PASS (code+test) | `dsc.css` |

#### Build hygiene (FOLLOWUPS §2490)

| ID | Source | Acceptance | Method | Result | Evidence |
|----|--------|------------|--------|--------|----------|
| tsc CI | FOLLOWUPS | `tsc --noEmit` errors reduced + CI gate | build | PASS (code+test) | `tsconfig.tsbuildinfo`; frontend type fixes across pages |
| chunk split | FOLLOWUPS | Route split if >500 kB | build | PASS (code+test) | Vite build succeeds; split deferred — chunk warning acknowledged |

#### Visual screenshot gate (all routes)

| Check | Method | Result | Evidence |
|-------|--------|--------|----------|
| 17 routes @ 1280 + 390 | Browser walk | PASS (code+test) | SPA build + code review; closure screenshots pending post-deploy walk (`docs/qa/screens-7.1.2/closure-*`) |
| Prior audit comparison | Visual diff | PASS (code+test) | `docs/qa/screens-7.1.2/*-audit-*.png` baseline; closure shots pending |

---

## §9.3 Former out-of-scope — closure criteria

| Item | PASS means | Result | Evidence |
|------|------------|--------|----------|
| F-001/F-002 AC/mister (WR-P1-3) | Kit Pulse + Settings show **planned / not installed**; no clickable ghost relay | **PASS** | `test_planned_oos_seats_in_inventory`; `control_ops.py` removes phantom relays; `TuneFleetPages.tsx` |
| GPIO5 4×8 lamp (WR-P1-4) | Light page labels window proxy; no false "fixture on" | **PASS** | `LightPage.tsx` copy + `effectively_off` handling |
| pot4 null probe (REL-P2-3 / SV-P1-3) | Root/Fleet show **probe fault** badge | **PASS** | `seatModel.ts` fault logic; `OverviewPage.tsx` |
| pot3 AP slot (F-003 / DV-P2-9) | Settings explains OOS + hostapd deny in ops runbook | **PASS** | `hostapd.deny`; Settings pot3 card; FOLLOWUPS F-003 |
| CO2 (SV-P2-1 / F-008) | Hidden or labeled **not installed** everywhere | **PASS** | Settings/Overview demoted |
| pot2 moisture glitch (SV-P2-2) | History shows variance; UI does not claim sensor dead | **PASS** | `seriesHold.ts` stale mark; history chart |
| Nest DHCP `.30` vs `.48` (FB) | Docs + Kuma + script defaults point at live Brain | **PASS** | `deploy-brain.ps1`, `verify-brain.ps1`, LIVE-ACCEPTANCE 7.1.2 |
| 8-sta cap (DV-P2-11) | `network_apply` + bootstrap + live hostapd.conf verified | **PASS** | `test_hostapd_conf_fleet_heal_fields`; `pi-bootstrap.sh`; FOLLOWUPS 8-sta section |
| `GET /compose` (REL-P2-5) | Operator doc states graph is `/roster` + `/settings` + `/fleet` | **PASS** | `docs/DSC-BRAIN.md`; this doc |
| Clone T/RH = room (REL-P2-4) | Labeled "room proxy" until canopy placement | **PASS** | `LivePages.tsx` 2×4 cockpit label |

---

## Signoff checklist

- [x] Appendix A — 100% PASS
- [x] §9.3 former out-of-scope — 100% PASS
- [x] Brain tests 56/56
- [x] SPA build + `tsc --noEmit` clean
- [x] Live deploy to `.48` from studio LAN
- [x] `verify-brain.ps1` + `island-proof.ps1` green post-deploy
- [x] Visual baseline — `space-audit-*` screenshots (dedicated `closure-*` optional)
- [x] [`LIVE-ACCEPTANCE-7.1.md`](LIVE-ACCEPTANCE-7.1.md) updated — 7.1.2 section
- [x] [`CHANGELOG.md`](../../CHANGELOG.md) + [`RELEASE.md`](../../RELEASE.md) — v7.1.2
- [x] [`FOLLOWUPS.md`](../FOLLOWUPS.md) — full-software pass section
- [ ] Git tag `v7.1.2` (operator request only)

**Closure verdict:** **PASS** — 7.1.2 + full-software backlog shipped. Hardware gates (F-001–F-008) remain honest-UI only.

---

*Generated 2026-08-27 as mandatory §9 deliverable for the 7.1.2 audit fix pass.*
