# DSC-HUB ? Master follow-up list

Standing process for every plan:

1. **Start:** read this file; pull in-scope items into the plan  
2. **During:** note findings, warnings, incomplete fixes, red flags  
3. **End:** append a dated section (do not leave soak/log issues in chat only)

Categories: `red-flag` ? `soak` ? `deferred` ? `next-plan` ? `out-of-scope` ? `done`

---

## Seed ? deep dive + OOS pass (2026-08-03)

### deferred (hard / site)

| ID | Item | Notes |
|---|---|---|
| F-001 | Physical AC hardware + follower relay | In-service stays OFF until installed |
| F-002 | Physical clone mister + follower | In-service stays OFF |
| F-003 | Replace/repair POT3 probe | In-service OFF; mat vote excluded |
| F-004 | Nest / home AP channel lock | No router changes in DSC scope |
| F-005 | Multi-lever learn baseline engine | Fans+mat air-lever gate is interim |
| F-006 | HA-link flap root-cause campaign | Softened bounce in 5.1.x; still ~frequent offs |
| F-007 | Panel OOM / LVGL discipline | Panel on 5.1.14 heap healthier; keep watching |
| F-008 | SCD41 / real CO? sensor | ADC dynamic CO? demoted to informational |
| F-009 | Full Auto ? complete climate with reduced kit | UX honesty; capacity offline cues |

### next-plan

| ID | Item | Notes |
|---|---|---|
| N-001 | Preferred BSSID ? current while Lock ON | Self-customize relearn exists; verify after hub 5.1.3 flash |
| N-002 | Fleet version skew cleanup | Flash Control/pots if still on old wifi stubs |
| N-003 | Soak warnings from OOS deploy | Fill after ~30 min post-flash soak |
| N-004 | Orphan helper cull pass | `dsc_leaf_offset` wired ? `sensor.dsc_leaf_vpd_kpa` / `dsc_clone_leaf_vpd_kpa` (2026-08-04 cal pass). Sankey UI gone ? `dsc_airflow_direct_room` / `dsc_airflow_room_return` still unused (optional cull) |
| N-005 | Cooldown / open-loop wait retune | Evidence-based only; no site hardcodes |

### out-of-scope

| ID | Item |
|---|---|
| X-001 | Whole-house non-DSC purge |
| X-002 | Building physical AC/mister/POT3 in software alone |

### Process note

After each execution pass, append:

```markdown
## YYYY-MM-DD ? <plan name>

### soak
- ?

### red-flag
- ?

### next-plan
- ?
```

---

## 2026-08-03 ? Device out-of-service + deep-dive follow-through

### done (this pass)

- Single `*_in_service` gate (AC / mister / pots); retired `*_actuator_wired`
- Soft capacity / reduced-kit cues; pot alerts gated; alert_count no dead-demand
- Hub 5.1.3 OTA: Full Auto skips OOS rungs; emergency fans-only if AC OOS
- HA surface 5.1.3 synced (`2499faf` / `bce6543`); dashboard In-service UI
- `docs/FOLLOWUPS.md` created

### soak (~30+ min post hub 5.1.3 flash)

- Hub link stayed **on**; uptime ~3000 s; FW **5.1.3**; HA surface **5.1.3**
- Full Auto **on**; `ac_auto` / `clone_humidifier_auto` **off**; AC/mister demands **off**
- Reduced kit: `AC, Clone mister, POT3`; no POT3 chemistry alerts
- First OTA attempt reset mid-upload; second (and version-string) OTA OK
- Preferred AP mismatch still **on** (`58:D9:D5:D7:AA:82` vs preferred `C4:E3:CE:68:73:93`)
- Alert count ~9 dominated by real pot1/2/4 moisture/pH + preferred mismatch (not OOS spam)

### next-plan / soak carry

| ID | Item | Notes |
|---|---|---|
| N-001 | Preferred BSSID ? current while Lock ON | Still open after 5.1.3 |
| N-002 | Flash Control/pots if wifi stubs not live | Mesh patches in tree; verify versions |
| N-006 | Full Auto NVS after OTA | Came up Full Auto **off** once after flash; operator re-armed |
| N-007 | Purge orphan `dsc_ac_actuator_wired` entity if still in registry | Entity registry leftover |
| N-008 | UNC-path ESPHome compile | Windows build must use local temp, not NAS path |

### red-flag

- None new blocking climate control during soak

---

## 2026-08-03 ? Crop-steering + response learning (HA surface 5.1.4)

### done (this pass ? repo)

- Packages: `dsc_v4_strain_catalog`, `dsc_v4_nutrient_catalog`, `dsc_v4_pots_coherence`,
  `dsc_v4_actuator_efficacy` (+ automations available-gates, core reduced-kit)
- Want/Need/Got, peer offsets, Capture peer baseline, Apply expected stage
- Nutrient stock / next mix / Accept mix QA (no pumps)
- Relative dryback + cross-pot coherence + learned ?EC/?moisture
- Temp OOS (flashing) vs Operator Lockout; demand inhibit for hum/dehum/clone mister
- Dashboard: Strains + pot subviews, Nutrient Science, Climate Temp/Lockout UI
- Surface string **5.1.4**; README + CHANGELOG; data mirrors under `homeassistant/data/`
- Quality-bar Cursor rule (user + `.cursor/rules/quality-bar.mdc`) from earlier in session

### flash

- **No firmware changes** this pass ? OTA flash skipped (HA-only). Hub remains on prior 5.1.3 train until a future hub bump.

### soak (fleet baseline via HA MCP; new packages not live until sync)

Observed live before package deploy:

- Hub link **on**; Full Auto **on**; tent ~21.0 ?C / ~71% RH
- AC / clone mister in-service **off**; POT3 in-service **off**; POT1/2/4 **on**
- Humidifier/dehumidifier demands **off**; dehum relay **off**
- Active alert count **9** (pre-existing; not attributed to this pass)

**Blocked:** SSH to HAOS refused (ports 22/22222 closed from this host); no local HA_TOKEN for `ha-sync.sh`. New entities (`sensor.dsc_pot*_got_*`, Temp OOS, etc.) cannot soak until packages reach `/config/packages/` (git push ? HA sync workflow, or manual copy + reload).

### next-plan

| ID | Item | Notes |
|---|---|---|
| N-009 | **Deploy HA 5.1.4 packages + dashboard** | Commit/push or manual sync; then reload YAML / restart helpers; verify Strains + Nutrient Science views |
| N-010 | Post-deploy soak 25?30 min | Confirm Temp OOS latch, Accept mix stock burn, Want/Need/Got entities, no climate red flags |
| N-011 | Promote custom strain/nutrient slots ? git YAML | When customs stabilize |
| N-012 | Pump dosing from Accept mix | Hardware deferred |
| N-013 | Closed-loop dryback irrigation | Track-only dryback shipped |
| N-014 | AC/heater efficacy Temp OOS | Same latch pattern as hum/dehum |
| N-015 | Deeper coherence / multi-feature learning | v1 = rules + EWMA |
| N-016 | Lab wet calibration of probes | Peer sync v2 shipped (HA MAD median); lab buffer procedure + ESP scale still open |
| N-017 | **Strain + sprout date on pot ESP (NVS)** | Probe stays in pot until harvest ? genetics/age must travel with the node like `plant_name` / `growth_stage`; HA Want/Need/Got should read pot entities after flash |
| N-018 | Wire HA strain catalog to pot-native strain/sprout once N-017 ships | Drop duplicate HA-only sprout/strain as source of truth; keep Want bands / catalog in HA |

### red-flag

- **Live HA still on pre-5.1.4 surface** until N-009 ? do not treat crop-steering UI as production until sync confirms `sensor.dsc_ha_surface_version` = `5.1.4`

---

## 2026-08-03 ? Commit/push e0ffeaf + soak (HA sync blocked)

### done

- Commit **`e0ffeaf`** pushed to `master`: HA surface 5.1.4 crop-steering packages + dashboard
- Cancelled stuck prior HA sync run `30789286359` (queued ~3h)

### soak (~25 min fleet, post-push)

| Check | T0 | T+10 | T+25 |
|---|---|---|---|
| Hub link | on | on | on |
| Full Auto | on | on | on |
| Tent | 20.9 ?C / 71% RH | 20.9 / 72 | 20.9 / 72 |
| Dehum demand | off | off | off |
| Alert count | 9 | 9 | 9 |
| AC / mister / POT3 in-service | off | off | off |
| POT1 in-service | on | on | on |

No climate control regression during soak window.

### red-flag

- **Resolved 2026-08-03 evening:** `unraid-ha-deploy` runner online; repo Actions secrets set; Terminal & SSH on HAOS with deploy key; Actions HA sync succeeded (`30809723980`). Primary add-on path also at tip `796847d` / surface **5.1.4**.
- **Remaining:** Rotate exposed runner PAT + MCP/HA long-lived token when convenient. Keep Unraid `unraid-ha-deploy` Autostart ON.

### next-plan carry

| ID | Item | Notes |
|---|---|---|
| N-009 | Deploy HA 5.1.4 | **Done** ? add-on + Actions HA sync both green |
| N-010 | Post-deploy entity soak | After sync: Temp OOS, Strains, Nutrient Science, Got sensors |
| N-017 | Strain + sprout on pot ESP | Probe stays until harvest |
| N-018 | HA reads pot-native strain/sprout | After N-017 |

---

## Airflow status card (2026-08-03)

### done

- Replaced Climate Engine `power-flow-card-plus` AIRFLOW FLOW MAP with `custom:dsc-airflow-map-card` (real ducts, % blend OUT/RECIRC, source T/RH carry, room appliances, vol/ACH mass chips).
- HACS `dist/DSC-HUB.js` now bundles system map + airflow map; sync script updated.
- **2026-08-03 evening:** live HA still served pre-bundle `/local/dsc-system-map-card.js` behind cache-buster `?v=5.1.0`. Deployed 33KB bundle + bumped resource to `?v=5.1.6-airflow`; card defines and renders. ha-sync now auto-bumps the resource query on www deploys.

### deferred

- N-004 optional cull of unused Sankey template sensors (`dsc_airflow_direct_room`, `dsc_airflow_room_return`) ? concept covered by live CFM edges; leave helpers until a dedicated orphan pass.

---

## 2026-08-03 ? HA 5.1.5 finish crop UI + N-017/N-018

### done (this pass ? repo)

- **Honesty:** 5.1.4 packages were live but Strains / Nutrient Science / Want?Need?Got UI never landed (dead Tank chips). Surface **5.1.5** finishes that UI.
- Dashboard: `path: strains`, `path: nutrient-science`, plant-console strain/sprout/Need, Root Zone dryback & coherence, Clone Mister Temp OOS status parity
- Pot firmware **5.1.3**: `select.strain` + `datetime.sprout_date` NVS (`dsc-pot-common.yaml`)
- N-018: strain catalog prefers pot entities with HA `input_*` fallback; `script.dsc_migrate_strain_sprout_ha_to_pot`
- CHANGELOG / README corrected

### flash

- Order: **POT2 canary ? POT1 ? POT4 ? POT3** (USB if POT3 still down)
- After each online: confirm `sensor.dsc_potN_firmware_version` = **5.1.3**; run Migrate HA?pot from Strains view

### soak (N-010)

- Strains / Nutrient Science navigate; Want/Need/Got + Accept mix; Temp OOS entities (`input_boolean.dsc_*_temp_oos`); no climate red flags ~25?30 min

### next-plan carry

| ID | Item | Notes |
|---|---|---|
| N-010 | Post-deploy soak | After 5.1.5 sync + pot flashes |
| N-011 | Promote customs ? git | When stable |
| N-012?N-016 | Pumps / irrigation / AC efficacy / deeper learn / wet cal | Deferred |
| N-017 | Strain + sprout on pot ESP | **Done in tree** ? flash remaining |
| N-018 | HA reads pot-native | **Done in tree** ? soak after flash |

### red-flag

- Rotate exposed runner PAT + HA long-lived token when convenient
- Unraid `unraid-ha-deploy` Autostart ON

### flash result (2026-08-03 evening)

- POT2/POT1/POT4 OTA to **5.1.3** ? confirmed `Firmware Version` + `Strain` + `Sprout Date` entities; sprout set to 2026-08-03 on flashed pots
- POT3 offline (`.local` + `192.168.86.40:3232` refused) ? **USB flash still required**
- HA surface **5.1.5** live (`FLEET` chip may warn until `input_text.dsc_expected_release` is 5.1.3 firmware train; surface string stays 5.1.5)
- Strains + Nutrient Science views confirmed in browser; migrate button present; sprout copied via native API for pot1/2/4

---

## Airflow STATUS layout + Lovelace resources (2026-08-03)

### done
- AIRFLOW STATUS card layout rewrite: perimeter chips, no center pile; live browser verify ? chip AABB overlaps = 0; resource `?v=layoutfix3-restore`
- `dsc-hub-sync` now bundles system-map + airflow into `dsc-system-map-card.js` / `DSC-HUB.js` (was overwriting with system-map-only and breaking the airflow element)
- `ha-sync.sh` resource bump now refuses tiny/empty jq output and keeps a `.bak` before replace

### red-flag
- **F-010** Live `/config/.storage/lovelace_resources` was wiped to 0 bytes during a cache-bust + `ha core restart` race. Rebuilt from HACS `www/community` (57 items). If any custom card is missing after this, re-add via HACS or Settings ? Dashboards ? Resources. Prefer **stop core ? edit resources ? start core** for future bumps; never `mv` over the file while core is restarting without a size check.

### deferred
- Keep a dated copy of `lovelace_resources` on the NAS/repo (sanitized) so rebuild is not from community folder heuristics
- Confirm browser_mod / any non-HACS module resources survived the rebuild

---

## Lovelace www bundle overwrite (2026-08-04)

### red-flag
- **F-011** /config/www/dsc-system-map-card.js was overwritten back to **system-map-only (~10KB)** after a sync, so Lovelace showed a config error for `custom:dsc-airflow-map-card` (element missing). Redeployed full bundle (~61KB) + cache-bust `?v=fix-?`. Likely cause: `dsc-hub-sync` add-on still running an older image that copies unbundled `www/dsc-system-map-card.js`, or a sync path that does not concatenate airflow. **Fix:** rebuild/update the dsc-hub-sync add-on from current master (bundling is in-tree), or turn off `sync_www` on that add-on until updated; prefer `ha-sync.sh` for www deploys. **2026-08-04 late:** bundle now also includes Three.js + `dsc-the-dash-card` (~789KB). Add-on must concatenate `vendor/three.min.js` + `dsc-the-dash-card.js` or The Dash will 404 the custom element again.

---

## The Dash v1 (2026-08-04)

### done
- New view `path: dash` + `custom:dsc-the-dash-card` (Three.js tents/ducts, flow diagram, pot charts, timeline)
- Sync scripts updated to bundle Three + Dash into `dsc-system-map-card.js` / `DSC-HUB.js`

### open
- Scene fidelity still below the reference mockup (richer plants, carbon/fan detail, stronger volumetric air, denser duct manifold)
- Prefer `hass.callWS({ type: 'lovelace/resources/update' })` for cache-bust during iteration ? avoid repeated `ha core restart` (slow; SSH drops)

---

## 2026-08-04 ? Dashboard repair + module unification

### done
- **Legacy DSC capture:** Notion [DSC legacy grow-cycle dashboard (2026-08-04)](https://app.notion.com/p/3b22b4cda37081cdb9edcba587a73b53) under DSC-HUB Wiki; repo archive `docs/archive/lovelace.dashboard_dsc.2026-08-04.json`
- **Legacy cleanup:** removed `dashboard_dsc` from `lovelace_dashboards`; HA storage file renamed `lovelace.dashboard_dsc.archived.2026-08-04` (hard-refresh sidebar if DSC still visible)
- **Pro modules:** `homeassistant/dashboards/dsc-hub-v4-dashboard.yaml` shell + `dashboards/modules/view_*.yaml` (!include). **Dash view left as pass-through only.**
- **History view** (`path: history`): soil EC/moisture/NPK charts moved off Root Zone expanders; apexcharts replaced with mini-graph (apex 2.2.3 `disabled is extraneous` vs HA 2026.7)
- Root Zone: guarded pots table, dryback layout, POT3 pH OOS conditional, uptake table restored with `?` guards
- Trends plotly heights reduced (overflow)

### next-plan (from Notion follow-ups)
- Replicate/modify when kit returns: multi-probe canopy map, germ/dry tent, cure fridge, stage-band VPD instrument
- Bump apexcharts-card when a build accepts HA `disabled` injection ? then restore richer History charts if desired
- Disable unused house-era registry entities (canopy/VPD) in a careful orphan pass (N-007 style)

### red-flag
- None new for climate control; sidebar may cache old DSC entry until browser/HA frontend refresh

---

## The Dash airflow path (2026-08-04)

### done
- Removed central filter-machine mental model from 3D ducts (room intakes, cascade 2x4->4x8, 4x8 DUMP/RECIRC only; small OUT muffler)
- Flow rail: Intake Environment (room T/RH/VPD) -> Intake CFM (2x4 / cascade / 4x8) -> 4x8 exhaust split (OUT %+CFM / RECIRC %+CFM)
- Heat mat attributed to 2x4 only (scene glow + Active gear + editor copy)
- Editor lists CFM/room/mat entity ids; topology fixed (not on-glass editable)
- ha-sync + dsc-hub-sync now copy dashboards/modules/view_*.yaml
- Restored mangled HA modules that caused Unnamed empty views (F-012)

### red-flag
- F-012: modular views break if modules missing or incorrectly indented under title
- Windows www bundling: use Node binary concat; PowerShell Get-Content can corrupt JS Unicode

### open
- Continue climbing 3D fidelity vs mockup; particle paths already follow the new ducts

---

## CFM mass balance on The Dash (2026-08-04)

### done
- The Dash exhaust OUT/RECIRC absolute CFM now = intake throughput x dump/recirc split (split still from exhaust nameplate ratio / fan %)

### deferred / honesty
- sensor.dsc_cfm_exhaust_* remain pct x nameplate (6in 440 CFM max each) with cal curves unset ? Climate/Learning still see ~300+ CFM open-air estimates. Real duct CFM needs Learning fan cal curves. Until then those sensors are capacity proxies, not mass-balanced flow.

## 2026-08-04 ? Calibration first pass closeout

### shipped (HA surface 5.1.6; pot FW 5.1.4 pending OTA)

- ESP pot provenance: `text.soil_cal_method` / `text.soil_cal_last` / `binary_sensor.soil_calibrated`; Reset clears; Cal set_action stamps `manual` (`firmware/v4/dsc-pot-common.yaml` 5.1.4)
- Root Zone: provenance chips + Reset Sensor Calibration per pot
- Peer sync v2: MAD-hardened `script.dsc_pots_capture_peer_baseline`; last-sync stamp/method/status; auto-after-water settle+cooldown (`dsc_v4_sensor_cal.yaml`) ? **HA Got offsets only**
- Peer divergence summary sensors (?pH / ?EC / ?moisture max vs median) ? dashboard only, no alerts
- Leaf offset wired ? `sensor.dsc_leaf_vpd_kpa` / `dsc_clone_leaf_vpd_kpa`; Main 4x8 leaf ?T + chart series
- README: SHT ? DHT22; package map + Want/Need/Got peer sync note

### deferred (not in this pass ? next-plan IDs)

| ID | Item | Notes |
|---|---|---|
| N-016 | Lab wet buffer / two-point ESP scale | Peer sync v2 ? lab truth |
| N-019 | Push peer offsets ? ESP Cal Offset (SoT) | After HA sync soaks; refuse if scale?1 unless confirm |
| N-020 | Sensor trust layer | Stuck / peer-MAD alerts / mat-vote gates ? soak thresholds first |
| N-021 | Raw+cal dual publish on pot | Entity churn; provenance covers ?was adjusted? for now |
| N-022 | DHT tent/room/clone disagreement alerts | False-positive risk |
| N-023 | Tank EC/pH bias cal | Unit multiplier + uptake exist; bias needs procedure |
| F-008 | SCD41 / real CO? | Unrelated; leave ADC shape-only |

### discoveries / errors / opportunities (this pass)

| ID | Finding | Action |
|---|---|---|
| N-024 | Dual-stack risk: ESP Cal Offset/Scale **and** HA peer offsets can both be non-zero ? Got double-corrects vs ESP-NOW | Warn binary or UI cue before N-019; document operator rule ?peer OR ESP, not both? |
| N-025 | Provenance entities unavailable until pot OTA 5.1.4; dashboard shows unavailable until flash | Flash pots; expected_release / fleet note optional |
| N-026 | Auto peer sync on moisture_rate may fire on non-water events; cooldown+settle mitigate | Tune settle/cooldown after live waterings; consider Require button confirm |
| N-027 | ESPHome Cal ``set_action`` YAML anchors ? first pot compile validates stamp path | Fixed to ``set_action: &cal_stamp_manual_action`` (no root ``.`` key); still verify on first compile |
| N-028 | Leaf VPD is HA-only; climate control still uses hub air VPD | Intentional; leaf VPD is operator honesty, not control input (unless later promoted) |
| N-004 update | leaf_offset no longer orphan | Done this pass |

### soak / deploy

- **HA packages + dashboard:** sync / reload for surface **5.1.6**
- **Pot OTA 5.1.4:** required for provenance chips; flash canary POT2 first
- Do not treat peer Got as lab-calibrated until N-016

### red-flag

- None for climate control from this HA-only peer path. ESP-NOW mat still sees **uncalibrated-by-peer** soil values until N-019.


## 2026-08-04 ? Calibration SoT push-to-ESP closeout

### shipped (HA surface 5.1.7; pot FW 5.1.5 pending OTA)

- Dual-stack warn: `binary_sensor.dsc_potN_dual_cal_stack` + fleet + summary (N-024) ? Strains/Root Zone cues
- `script.dsc_pots_push_peer_offsets_to_esp`: additive HA peer ? ESP Cal Offset (pH/EC/moisture), zero HA offsets, scale?1 guard + Force (N-019)
- Pot FW **5.1.5**: `button.Mark Soil Cal Peer Median` stamps method after push (avoids set_action stuck on `manual`)
- Auto peer sync **Require Confirm** default on (N-026) ? settle then status/notify, no silent Capture
- `dsc_expected_release` initial **5.1.5**; surface **5.1.7**

### deferred (still open)

| ID | Item | Notes |
|---|---|---|
| N-016 | Lab wet buffer / two-point ESP scale | Peer push ? lab truth |
| N-020 | Sensor trust layer | Post-SoT soak thresholds |
| N-021 | Raw+cal dual publish | Entity churn |
| N-022 | DHT disagreement alerts | False-positive risk |
| N-023 | Tank bias cal | Separate |
| F-008 | SCD41 / real CO2 | Unrelated |
| N-025 | Pot OTA provenance/push buttons live | Operator: flash 5.1.5 canary POT2 then fleet |
| N-026 tune | Settle/cooldown after real shared watering | Confirm gate shipped; tune values later |

### discoveries / opportunities

| ID | Finding | Action |
|---|---|---|
| N-029 | Push skips Mark button if pot still on FW <5.1.5 (entity missing) ? offsets still written | Flash pots; status text already notes 5.1.5+ |
| N-030 | Temp/NPK peer channels not in push (pH/EC/moisture only) | Intentional; expand if needed |
| N-031 | During number.set_value before Mark, brief method=manual flicker possible | Acceptable; Mark overwrites |
| N-027 | set_action anchors | Still verify on first 5.1.5 compile |

### soak / deploy

1. Sync HA packages/dashboard ? reload ? confirm surface **5.1.7**, dual-stack + Push button
2. OTA pots **5.1.5** (POT2 canary) ? Mark button + peer_median stamp
3. Capture peer baseline ? dual-stack may light ? Push peer ? ESP ? dual-stack clears; soil_* ? prior Got; ESP-NOW matches

### red-flag

- None in-repo. Until pot OTA, Push still merges offsets but provenance stamp may no-op (N-029).

---

## 2026-08-04 ? The Dash 3D cinematic full-inclusion pass

### done
- Cinematic tent scene in `dsc-the-dash-card.js` + `vendor/dsc-dash-fx.js` (ACES, selective bloom composer, soft/depth-soft particles, flow ribbons, curl haze, color ramps)
- Topology honesty: Room ? intakes ? cascade 2?4?4?8 ? OUT/RECIRC; heat mat 2?4 only; no central filter machine
- Product detail: flex rings, fans/muffler, mat bloom, tent ACH layered haze, room lung slices, SF1000 shafts, legend path highlight
- Bundle order: system-map + airflow + three.min + dsc-dash-fx + the-dash (Node binary concat)
- Live verify on `/dsc-hub-pro/dash` with Lovelace resource **type `js`** (not `module` ? IIFE THREE must be classic)

### red-flag
- **F-013** `dsc-hub-sync` add-on (still **5.1.2** image until rebuilt) overwrote `/config/www/dsc-system-map-card.js` to ~10KB system-map-only, wiping Three/Dash. **Mitigation (in-tree):** refuse bundles <500KB; fall back to `dist/dsc-system-map-card.js`; never replace a live >=500KB card with a tiny staged file; Lovelace resource must stay `res_type: js`. **Done 2026-08-04:** add-on rebuilt to **5.1.3**; sync staged 845901-byte cinematic bundle + vendor FX/three (F-013 closed on HA).

### next-plan / deferred
- Rebuild dsc-hub-sync add-on from current tree so F-013 guards are live
- Optional offline GLTF accents if still below product-shot bar after soak (primitives currently accepted)
- True depth-buffer soft particles (sample DepthTexture) if layered haze + view-Z fade still feel harsh against duct solids
- Prefer `hass.callWS(lovelace/resources/update)` cache-bust; avoid core restart races (F-010)

### constraint preserved
- Air Path rail not redesigned (legend hover/click only)

---

## 2026-08-04 ? Strains peer-sync UI preflight (before Push)

### done (live)
- Created missing UI helpers `input_boolean.dsc_peer_sync_require_confirm` (on) + `input_boolean.dsc_peer_push_force` (off) ? package reload had not created them
- Peer sync status card: no Entity not found; Confirm ON ? Force OFF
- Push preflight: script present; HA peer offsets non-zero on POT1/2/4; ESP scales all 1.0; dual-stack OK

### discoveries
| ID | Finding | Action |
|---|---|---|
| N-032 | Pot ESP entity IDs use `dsc_pot_N_*` (underscore), not `dsc_potN_*` ? Strain/Sprout rows were wrong | Fixed in `view_strains.yaml`; same bug still in `view_home.yaml` |
| N-033 | Live pots still FW **5.1.4** (repo 5.1.5) ? Mark Soil Cal Peer Median absent | Push still merges offsets (N-029); OTA 5.1.5 for stamp |
| N-034 | UI-created helpers vs package helpers same entity_id | Prefer one Core restart later so packages own them; avoid duplicate UI helpers |

### soak
- Commit/push `view_strains.yaml` (mushroom?entities + pot_* IDs) so live Strains clears remaining Strain/Sprout Entity not found
- Fix `view_home.yaml` pot Strain/Sprout entity IDs (N-032)
- Operator: Push peer ? ESP when ready; optional pot OTA 5.1.5 after
- Hold to reset all captures: `script.dsc_pots_reset_peer_captures` + Strains hold card (HA offsets only; ESP Cal untouched) ? needs package/dashboard sync

---

## 2026-08-04 — Next Pass Full Inclusion (3→2→1→4)

### done
- **Pass 3 Cal SoT:** HA surface 5.1.7; pots 1/2/4 OTA to FW **5.1.5** (POT3 USB/F-003 still unavailable). Capture→Push with ESP range clamp + Mark entity-id dual form (dsc_potN / dsc_pot_N). Methods peer_median; dual-stack cleared (POT4 residual beyond pH ±2 clamp zeroed after push). N-027 compile OK. README surface → 5.1.7. N-025/N-029 closed for online pots.
- **Pass 2 CFM honesty:** sensor.dsc_cfm_exhaust_{out,recirc}_allocated (Σ intake × fan-% split); vent BTU/moisture + airflow-map use allocated; capacity proxies keep honesty attr; Climate/Learning labels linear-vs-curve. No invented cal curves.
- **Pass 1 Dash fidelity:** DepthTexture on DSCDashFX composer + layer-split soft particles; offline glTF accents under www/assets/dash/ + loadSimpleGltf with primitive fallback.
- **Pass 4 Housekeeping:** Culled unused dsc_airflow_* Sankey helpers; *_actuator_wired absent from registry (N-007); README/qa Sankey/wired wording cleaned.

### soak / operator
- POT3 USB flash to 5.1.5 when online (F-003)
- Optional anemometer Learning curves still unset — capacity proxies remain nameplate until measured
- POT4 peer wanted pH beyond ESP ±2; ESP SoT clamped at -2.0 (honest residual cleared)

### deferred (unchanged)
- N-016 lab wet cal; N-020–023 trust/alerts/tank; N-026 settle tune after real waterings

### red-flag
- None new for climate control. Keep Lovelace resource 
es_type: js; cache-bust via 
esources/update only (F-010).
