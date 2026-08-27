# DSC-HUB ? Master follow-up list

Standing process for every plan:

1. **Start:** read this file; pull in-scope items into the plan  
2. **During:** note findings, warnings, incomplete fixes, red flags  
3. **End:** append a dated section (do not leave soak/log issues in chat only)

Categories: `red-flag` ? `soak` ? `deferred` ? `next-plan` ? `out-of-scope` ? `done`

---

## 2026-08-27 — Full software backlog pass (single coordinated pass)

> **CLOSED 2026-08-27** — All software/code items from the backlog plan landed in-tree. Hardware installs remain honest-UI only.

### Closed (software)

| Phase | Deliverable |
|-------|-------------|
| 0 | 7.1.2 closure docs, CHANGELOG/RELEASE, LIVE-ACCEPTANCE signoff, deploy gates PASS |
| 1 | `tsc --noEmit` clean, `frontend-ci.yml`, route lazy split, `tsconfig.tsbuildinfo` gitignore |
| 2 | `/fleet/computed` hot/cold cache + `runtime_history.py`; Phase E `hass_extras` shim removed from `useBrain`; ladder-wait OIDs |
| 3 | Zigbee honest `radio_up` / permit-join expiry; placement editor — **live stick still HOST_FATAL_ERROR** (hardware/config; UI shows radio down) |
| 4 | CannaLib URL unity, compose volume, honest sqlite fallback (503), `CANNALIB-API.md` |
| 5 | `sensor_trust.py` (stuck/MAD/DHT), Calibrate soil/tank tabs, Learning ownership banner, `dsc_v4_sensor_trust.yaml` |
| 6 | Twin THREE preload (`ensureLocalCards`), grow-log noise filter, code-split chunks |
| 7 | Pot UART `rx_timeout: 15`, `sensor_fault` binary in firmware YAML — **fleet OTA not run** (Nest-path primary) |
| 8 | `soak-check.sh` adds `/fleet/computed` latency alert; DHCP `.48` docs closed |
| 10 | Brain tests 56/56; closure audit updated |

### Remains (hardware / ops — not software)

| Item | Notes |
|------|-------|
| F-001–F-008 | AC/mister/tank/CO2/GPIO5 lamp — honest OOS rows only |
| pot4 probe | Fault badge path; probe swap is field work |
| Zigbee stick | z2m crash-loop on Pi — operator approval for stick recovery (no factory reset without OK) |
| Anemometer CFM | Nameplate until two calibration points |
| Fleet OTA | Per-pot SoftAP SSIDs in YAML; apply via Nest OTA when scheduled |
| Pin DHCP `.30` | Optional Nest reservation — docs use `.48` |
| Redeploy | Run `studio-deploy.ps1` from studio LAN to ship this pass to `.48` (agent network SSH timeout 2026-08-27) |
| Pi maintenance | Kill stale `esphome run dsc-hub.yaml` PID on next SSH (harmless log-follow) |

---

## 2026-08-27 — Layout audit 7.1 (Pi SPA)

> **CLOSED 2026-08-27 (7.1.2)** — All P0/P1 audit items fixed. See [`docs/qa/AUDIT-CLOSURE-7.1.2.md`](qa/AUDIT-CLOSURE-7.1.2.md). Historical notes retained below.

Source: `docs/qa/LAYOUT-AUDIT-7.1.md`. Live Brain `192.168.86.48:8787`. No deploy, no commit, pot3 left OOS, Apply network / demand not fired.

| ID | Pri | Item |
|---|---|---|
| N-LAYOUT-GRID2 | P0 | `.dsc-grid--2` is used on Dash Home (`DashHomePage.tsx`) but never defined in `dsc.css`. 12-col auto-place crushes Grow log / narrator / roster / Kit Pulse to ~103px (desktop) / ~34px (390). Kit Pulse leftover containment. |
| N-LAYOUT-SETTINGS-TABLE | P0 | Settings assignment + ESPHome tables have no `overflow-x` wrapper; 627px / 419px tables vs 390 viewport. Queue OTA/compile buttons sit off-screen. |
| N-LAYOUT-DRAWER-RAIL | P1 | Closed History/seat drawer rail (`translateX(105%)` + `left: -28px`) peeks as "Cl…" on every route at 1440 and 390. `z-index: 80`. |
| N-LAYOUT-TENT-NAV | P1 | `TentCockpitPage` `setFocus(tent)` writes `?tent=` while `App.tsx` strips it except on Climate/Dash — replace-navigate fight blocks leaving 4×8/2×4 via hash/tabs until a section remount. |
| N-LAYOUT-HEADER-ACTIONS | P1 | `.dsc-page-header` is nowrap flex; actions `flex-shrink: 0`. Compose "Browse Catalog" clipped at 390; Mission/Twin header buttons measure past the viewport. 4×8 header hits 364px tall. |

## 2026-08-27 — pot3 Add-as-Plant demo blocked (Pi SSH/HTTP down)

> **CLOSED 2026-08-27 (7.1.2)** — Demo completed on `.48`; pot3 reverted OOS. Screens + JSON in `docs/qa/screens-7.1.2/pot3-fullgrow-*`. Historical notes retained below.

- **Symptom:** After a successful brain deploy and pot3 enable/retire, a second `deploy-brain.ps1` upload failed. `192.168.86.30` still pings; TCP 22 and 8787 refuse/timeout. AP `10.42.0.1` is unreachable (hostapd likely down with userspace).
- **Last known live state:** roster empty; pot3 **still in_service true**; takeover off / full auto on. Revert pot3 OOS when the Pi is reachable.
- **Code is in-tree** (tent selector, sprout/auto-stage, 2x4 automation). Centerpiece screenshots `pot3-fullgrow-step*.png` not taken.
- **Do not** power-cycle Understairs Network Outlet to recover — that would take the whole closet with it.

## 2026-08-27 — 7.1.2 closure triage

Verdict pass over open items below (history untouched; line refs point at the original entries). Basis: bridge retired from project, studio WiFi is SoT, live fleet verified 2026-08-26 on 7.0.0.0.

### retired (superseded — bridge removed / studio WiFi is SoT)

| Item | Ref | Verdict |
|---|---|---|
| F-010 appliance bridge soak note | L~1439 | Retired — ETH01 bridge removed from project; Sonoffs follow hub demand via brain |
| F-011 SoftAP portal host on ETH01 | L~969 / L~989 | Retired — no bridge to invert onto; kit portal question moot on studio WiFi |
| F-012 channel-anchor SoftAP | L~982 | Retired — no `DSC-Anchor`; studio AP / Pi AP are the WiFi SoT |
| F-013 hub HA wired presence mirror | L~983 | Retired — bridge Ethernet mirror gone; Native API ingest is the live bus |
| F-014 bridge SoftAP kit hello | L~990 | Retired — bridge hardware retired |
| N-038 stale EVT republish | L~676 | Retired — ESP-NOW EVT path parked; cosmetic on a dead bus |
| N-039 pot 0xD7 calendar vs epoch | L~677 | Retired — ESP-NOW diagnostic on a parked protocol |
| N-096 F-010 board BOM + ESP-NOW demand protocol | L~1432 | Retired — HA-optional climate now runs through the Pi brain, not a bridge BOM |
| SoftAP NAPT OTA broken / Nest-hold workaround | L~1923–1927 | Retired — no SoftAP OTA path in service; OTA is studio LAN / USB |
| "Resume SoftAP/ESP-NOW deepening" deferrals | L~2271 / L~2309 / L~2376 | Retired as standing tasks — ESP-NOW code stays parked in tree; nothing schedules a resume |

### closed (verified done live 2026-08-26)

| Item | Ref | Evidence |
|---|---|---|
| Hub firmware flash to 7.0.0.0 | L~2399 | Hub live reports `7.0.0.0` (`/fleet` → `hub.firmware`; AUDIT-2026-08-26 sign-off) |
| N-002 fleet version skew | L~34 | All in-service seats report `7.0.0.0` via `firmware_version` text sensor |
| Pot FW display cosmetic | — | Pots now report product semver `7.0.0.0` (generic `firmware_version` text sensor), not ESPHome framework |
| N-067 hub placement / Nest RSSI | L~1366 | Obsolete post-studio cutover — hub on studio AP / Pi AP, Nest path gone |
| N-068 Build-a-Plant typeahead browser verify | L~1384 | Compose replaced the Lovelace card; typeahead card retired with it |
| Sonoff cutover rows | L~2361–2366 | Sonoffs live on studio LAN, brain appliance driver drives relays; cutover soak done 2026-08-26 |
| Non-critical hub ingest (~50 entities) | L~2407 | Closed this pass — audit §4 inventory mapped in `hub_controls.py` (binary 7 / number 22 / sensor 16 / switch 18 / text 6, slug + legacy ids); informational only, no control-proxy rows, no alert-path changes; `test_hub_ingest_informational_oids_mapped` |
| Intake `*_allocated` CFM | L~2256 | Closed this pass — `sensor.dsc_cfm_intake_main_allocated` / `sensor.dsc_cfm_intake_2x4_allocated` in `computed_ops.py` (Σ exhaust split by intake pct share, curve-or-nameplate); `test_intake_allocated_cfm` |

### keep open (explicit gates — do not close)

| Item | Gate |
|---|---|
| F-001 AC relay | Hardware install |
| F-002 clone mister | Hardware install |
| F-003 POT3 probe replacement | Hardware (probe swap) |
| POT4 probe isolate (L~1941 / L~2017) | Hardware — POT2 known-good probe swap test |
| F-008 SCD41 real CO2 sensor | Hardware |
| GPIO5 4x8 lamp | Hardware — window stays Got proxy until wired |
| DSC-Tank firmware | Hardware — dummy contract only |
| Anemometer CFM field readings | Operator measurement session |
| Phase E `hass_extras` shim drop (L~2408) | Gated on 24h dash soak |
| N-020..023 tuning soaks | Evidence-based thresholds; leave soaking |
| R3F Twin extract | Parked until neon APIs soak |

### dist/ ↔ www/ Dash IIFE sync check (Get-FileHash SHA256, 2026-08-27)

- 16 of 18 shared files **match** (cards, catalog indexes, vendor, gltf, svg).
- `dsc-system-map-card.js` **differs by design** — dist ships the fat concat (1,073,562 B, includes THREE), www ships the thin loader (10,644 B).
- `DSC-HUB.js` **drifts**: dist copy is byte-identical to dist's fat `dsc-system-map-card.js` (hash `0F55B895…`), but `homeassistant/www/DSC-HUB.js` is a different build (1,041,269 B, hash `AFE21DFC…`) — stale umbrella bundle in www; resync on next frontend deploy pass (frontend owned by the SPA track).
- `dist/README.md` has no www counterpart (docs-only, expected).

Counts: **10 retired / 8 closed / 11 kept open.**

---

## Seed ? deep dive + OOS pass (2026-08-03)

### deferred (hard / site)

| ID | Item | Notes |
|---|---|---|
| F-001 | Physical AC hardware + follower relay | In-service stays OFF until installed |
| F-002 | Physical clone mister + follower | In-service stays OFF |
| F-003 | Replace/repair POT3 probe | In-service OFF; mat vote excluded |
| F-004 | SoftAP preferred-BSSID mismatch (CHX) | Nest router channel lock remains out-of-scope; SoftAP-primary is the heal path |
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
| N-004 | Orphan helper cull pass | `dsc_leaf_offset` wired → leaf VPD sensors (2026-08-04). Sankey `dsc_airflow_*` helpers culled + registry purged (2026-08-05 Full Inclusion Pass 4) |
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
| N-006 | Full Auto NVS after OTA | **Closed 5.1.11** — boot forces Full Auto ON unless Takeover |
| N-007 | Purge orphan `dsc_ac_actuator_wired` entity if still in registry | Done 2026-08-05 Full Inclusion Pass 4 (registry strip + core restart) |
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

- N-004 optional cull of unused Sankey template sensors — **done 2026-08-05** (repo helpers + live `dsc_airflow_sankey.yaml` removed).

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

## 2026-08-04 ? Next Pass Full Inclusion (3?2?1?4)

### done
- **Pass 3 Cal SoT:** HA surface 5.1.7; pots 1/2/4 OTA to FW **5.1.5** (POT3 USB/F-003 still unavailable). Capture?Push with ESP range clamp + Mark entity-id dual form (dsc_potN / dsc_pot_N). Methods peer_median; dual-stack cleared (POT4 residual beyond pH ?2 clamp zeroed after push). N-027 compile OK. README surface ? 5.1.7. N-025/N-029 closed for online pots.
- **Pass 2 CFM honesty:** sensor.dsc_cfm_exhaust_{out,recirc}_allocated (? intake ? fan-% split); vent BTU/moisture + airflow-map use allocated; capacity proxies keep honesty attr; Climate/Learning labels linear-vs-curve. No invented cal curves.
- **Pass 1 Dash fidelity:** Bloom composer + soft-particle/curl shaders (`tDepth`/`uHasDepth`); DepthTexture **safe-default off** (WebKit solids bug — see 2026-08-05 closeout). Offline glTF accents under www/assets/dash/ + loadSimpleGltf with primitive fallback.
- **Pass 4 Housekeeping:** Culled unused dsc_airflow_* Sankey helpers; *_actuator_wired absent from registry (N-007); README/qa Sankey/wired wording cleaned.

### soak / operator
- POT3 USB flash to 5.1.5 when online (F-003)
- Optional anemometer Learning curves still unset ? capacity proxies remain nameplate until measured
- POT4 peer wanted pH beyond ESP ?2; ESP SoT clamped at -2.0 (honest residual cleared)

### deferred (unchanged)
- N-016 lab wet cal; N-020?023 trust/alerts/tank; N-026 settle tune after real waterings

### red-flag
- None new for climate control. Keep Lovelace resource `res_type: js`; cache-bust via `lovelace/resources/update` only (F-010).

---

## 2026-08-04 ? Ops + residual debt closeout

### done
- **N-032:** [`view_home.yaml`](homeassistant/dashboards/modules/view_home.yaml) Strain/Sprout ? `select.dsc_pot_N_strain` / `date.dsc_pot_N_sprout_date` (matches Strains).
- **N-034:** Active helpers `input_boolean.dsc_peer_sync_require_confirm` + `dsc_peer_push_force` live with package names; purged orphan registry rows `*_non_1_scale*` / `*_require_confirm_2`.
- **OTA:** POT2 re-flashed to FW **5.1.5** (was still 5.1.4); Mark Peer Median present (`button.dsc_pot_2_mark_soil_cal_peer_median`). POT1/POT4 already 5.1.5. Control already **5.1.14** (no flash).
- **Dash residuals:** `flange.gltf` loaded via `loadSimpleGltf` (primitive fallback); curl haze DepthTexture soft-intersect + `registerSoftParticleMaterial`. Node-concat bundle ~855KB; Lovelace `?v=ops-debt-*` via `resources/update` (`res_type: js`).
- **Accepted approximations (not rewritten):** MeshLine/Line2 still Tube ribbons; GPUComputation still CPU curl.

### audit (live)
| Check | Result |
|---|---|
| HA surface | **5.1.7** |
| POT1/2/4 FW | **5.1.5** / dual-stack off / method `peer_median` |
| POT3 | ICMP to `.40` OK; **OTA :3232 refused** ? USB/F-003 still required |
| Control | **5.1.14** (matches tree) |
| Preferred AP mismatch | **off** (N-001 verify OK this soak) |
| Hub link / hub FW | **off / unavailable** ? hub `.33` not pinging at closeout |
| Allocated CFM | **unavailable** (depends on hub fan/% entities) |

### soak / operator
- Recover DSC-HUB (power / WiFi / API) ? climate + CFM honesty consumers dark until hub_link returns
- POT3 USB flash to 5.1.5 when probe/path available (F-003)
- Anemometer Learning curves still unset

### deferred (unchanged)
- N-016 lab wet; N-020?023 trust/alerts/tank; N-026 settle tune; MeshLine/GPUComputation real implementations

### red-flag
- **Hub offline** at closeout (`binary_sensor.dsc_hub_link=off`, ping `.33` loss) ? not introduced by Dash/www changes; blocks climate + allocated CFM. Prefer hub recovery before any core restart. Keep F-010 cache-bust discipline.

## 2026-08-04 ? Sensing/learn debt + verify + docs (HA 5.1.8)

### verify (Phase 0)

| ID | Result |
|---|---|
| Hub link | **FAIL** ? dsc_hub_link=off, ping .33 100% loss; needs **physical power cycle** (no smart-plug path) |
| N-001 preferred AP | **BLOCKED** (hub offline; last soak was off/OK) |
| N-017/018 strain/sprout IDs | **PASS in tree** (Home/Strains dsc_pot_N_*); live MCP exposes only soil subset |
| N-019/024/025/029 | **PASS in tree**; pots 1/2/4 had live soil; POT3 soil unavailable |
| N-032/034 | **PASS in tree** (prior ops closeout) |
| Sankey/wired cull | **PASS** ? no irflow_direct_room / *_actuator_wired entities in packages |

### done (this pass ? repo)

- N-016 lab wet wizard + docs/LAB-WET-CAL.md; pot FW 5.1.6 raw + lab_buffer mark
- N-020/022 trust package; N-023 tank bias; N-021 raw publish
- N-026: confirm gate kept; settle/cooldown **unchanged** (no shared-watering evidence while hub dark)
- Anemometer: docs/ANEMOMETER-CFM.md + sensor.dsc_cfm_curves_status (operator measures)
- F-005 multi-lever residual learn; N-015 fleet coherence score
- N-005: **no wait retune** ? hub offline, insufficient soak evidence
- F-009 keep-up gaps + Home honesty copy
- F-006 hub 5.1.4 diagnostics (API/handshake age, bounce reason) + HA flap counter
- N-011 promote preview script + scripts/promote_customs_to_yaml.py
- Control 5.1.15 VPD editor / ASCII sparkline / power detail
- Dash MeshLine + GPU curl (fallback flags remain)
- Docs: README/CHANGELOG/HA+FW READMEs aligned to live train; surface **5.1.8**

### red-flag

- Hub was offline at start (`.33` loss). **Recovered during pass** (ping OK ~205 ms). Still flash hub **5.1.4** for F-006 diagnostics; prefer no core restart races (F-010).

### deferred / soak carry

- Operator: power-cycle hub ? flash hub 5.1.4, pots 5.1.6, Control 5.1.15
- Operator: run lab buffers + anemometer curves on site
- N-013 skipped (explicit)
- F-001/F-002/F-003/F-004/F-008/N-012/N-014 unchanged
- N-005/N-026 retune after hub-up soak + real watering

---

## 2026-08-05 — Dash tents black-canvas recovery

### red-flag / fix
- **Symptom:** Dash 3D viewport fully black (tents/ducts “gone”) while overlays/CFM still looked nominal.
- **Cause:** Bloom `createComposer` DepthTexture/FBO path; HA SPA `location.href` cache-bust kept the old `customElements.define` class until full reload.
- **Mitigation (live):** Bloom composer temporarily disabled → direct `renderer.render`; DepthTexture hardened for when composer returns; tick try/catch; flange glTF clones geometry.
- **Operator:** After www deploys, **hard-refresh** the Dash tab (reload), not just navigate.

---

## 2026-08-05 — Next Pass Full Inclusion closeout (3→2→1→4)

### done
- **Pass 3 Cal SoT:** Live surface **5.1.8** (plan floor 5.1.7 met); pots 1/2/4 FW **5.1.6** (plan floor 5.1.5); dual-stack **off**; method **peer_median**; Mark Peer Median present. POT3 still USB/F-003. README surface train **5.1.8**. N-025/N-029 closed for online pots; N-016 still open (peer ≠ lab wet).
- **Pass 2 CFM honesty:** `sensor.dsc_cfm_exhaust_{out,recirc}_allocated` live (~15 / ~31 CFM); Climate vent BTU / Learning / airflow-map consume allocated; nameplate `sensor.dsc_cfm_*` remain capacity proxies. No invented `dsc_cal_cfm_*` curves.
- **Pass 1 Dash fidelity:** Bloom composer on (single-pass when no depth tex); soft-particle + curl shaders with `tDepth`/`uHasDepth` (depth-soft gated). **DepthTexture attached then safely detached by default** — WebKit/Chromium depth-clear bug made opaques fail while particles drew (haze-only / black tents). View-Z soft fade remains the live path; reattach is opt-in later. Offline glTF accents under `www/assets/dash/` + `loadSimpleGltf` primitive fallback. Node-concat bundle ~875KB; `res_type: js` + `resources/update` + **hard reload**. Screenshot `/dsc-hub-pro/dash`: tents + ducts + particles + fan accent; no Configuration error.
- **Pass 4 Housekeeping:** Packages already culled Sankey helpers; **removed live-only** `/config/packages/dsc_airflow_sankey.yaml` (not in repo — was recreating entities on every boot); WS purged `dsc_airflow_*`; `*_actuator_wired` absent (N-004/N-007). Live dashboards use `sensor.dsc_cfm_*` / allocated only.

### audit (live at closeout)
| Check | Result |
|---|---|
| HA surface | **5.1.8** |
| Hub link | **on** |
| POT1/2/4 FW | **5.1.6** / dual-stack off / `peer_median` |
| POT3 | USB/F-003 still |
| Allocated OUT/RECIRC | **~11.5 / ~34.5** CFM (varies with fan %) |
| Dash | tents solid + bloom composer **on**; DepthTexture default **off** (honest) |
| Sankey package | **removed** live `dsc_airflow_sankey.yaml`; registry **0** airflow/wired leftovers |

### soak / operator
- POT3 USB flash when probe available (F-003)
- Optional anemometer Learning curves still unset — capacity proxies honest until measured
- After any www deploy: hard-refresh Dash tab (F-010)

### deferred (unchanged / narrowed)
- N-016 lab wet cal; N-020–023 already partly shipped in 5.1.8 sensing pass — leave soak
- True DepthTexture soft-intersect **opt-in** after a browser that clears depth correctly with color+depth FBO (do not re-enable by default)
- MeshLine/GPUComputation remain accepted approximations

### red-flag
- None new for climate. Keep Lovelace `res_type: js`; cache-bust via `lovelace/resources/update` only; always **location.reload()** after Dash www deploys.

---

## 2026-08-05 — Full Auto overnight drop (probe)

### finding
- **Not** Manual Takeover this time (unlike 3 Aug 02:11).
- Hub **API-recovery reboot ~02:59 AEST** (uptime reset to ~1.3s). Came back Full Auto **OFF** from NVS; second reboot ~06:03 still OFF; re-armed ~08:28. HA showed ON through flaps until the 02:20 outage.
- Implies NVS had OFF at reboot despite live ON before disconnect (stale flash and/or local drop+sync during the dark window). `sync_mode_prefs` is in hub **5.1.4** tree — soak whether every ON path actually flushes.
- Chronic **HA link flaps** all morning (F-006); preferred BSSID currently matches associated `58:D9:D5:D7:AA:E2`, Lock ON.

### plant-critical escalation
- Auto Photoperiod also restored **OFF** at 02:59 (NVS desync: Full Auto climate loop kept it true in RAM only).
- SF1000 dark **02:59–08:28** while Independent window was still open (17:00 + 18h → 11:00). ~5.5h mid-cycle dark.

### fix (repo — flash hub + sync HA packages)
- Hub **5.1.5**: sync after `arm_full_auto` / photoperiod switch; on_boot re-arms photoperiod when Takeover clear.
- Hub **5.1.6**: on-hub light-quota ledger + debt catch-up under min dark floor (HA cannot meter during flaps).
- Hub **5.1.7**: first-ledger NVS seed so mid-dark OTA cannot invent catch-up debt (5.1.6 first-flash blaze).
- Hub **5.1.11**: boot **forces Full Auto ON** (unless Takeover) — stale NVS OFF can no longer leave the stack idle after recovery reboot.
- HA: `binary_sensor.dsc_clone_light_missing_in_window`; GUARD re-arms photoperiod if disarmed >45s without Takeover; ALERT if light missing in window >2min; dark-period violation exempts catch-up.

### next
| ID | Item | Notes |
|---|---|---|
| N-030 | Flash hub **5.1.7** + sync HA light helpers / Lighting view | **Done** 5 Aug — 5.1.7 live; catch-up idle, debt 0 mid-dark after ledger seed |
| F-006 | HA-link flap / recovery reboot storm | Still the upstream driver of these mode surprises |

---

## 2026-08-05 — Pot fleet clock + RF card + pre-compile sim gates

### done (repo)

- Pot FW **5.1.7** (`firmware/v4/dsc-pot-common.yaml`): SNTP time (`sntp_time`) alongside existing `ha_time`; global `clock_valid` recomputed every 15s from `sntp_time.now().is_valid() || ha_time.now().is_valid()`; `binary_sensor.dsc_pot_N_clock_valid`.
- 0xD0 v2 RX: soft-adopt hub-preferred BSSID only when the pot has none yet; if a preferred AP is already set, log-only (does not fight an already-settled v1 adoption).
- 0xD5 TX "RF card" every 10s: role byte `2+fleet_pot_index` (1-4) else bare `2`, wifi channel, RSSI, associated/preferred BSSID shorthand (last-byte-pair) with presence flags.
- 0xD7 RX TIME: while `!clock_valid`, publishes epoch to diagnostic `text_sensor.last_peer_time` (ESPHome's `ESPTime`/`sntp`/`homeassistant` time platforms expose no public "set now" — cannot mark `clock_valid` true from a peer broadcast without a custom time component).
- New substitution `fleet_pot_index` (default `"0"`) set per-stub (`dsc-pot{1..4}.yaml` and `-kit` variants already had/now have `pot_index`/`fleet_pot_index` wired) so the 0xD5 role byte is correct without depending on `dsc_fleet_setup` being present (lab stubs don't include that component).
- `dsc_fleet_setup.h`: added `pot_index()` getter (kit-side component identity; not required by the substitution path above, kept as it's a clean and likely-useful accessor).
- New pre-compile gates (`scripts/`): `cyd_glyph_audit.py` (non-ASCII scan of `dsc-control-common.yaml` vs `cyd_glyphs.yaml` + MDI PUA escapes), `cyd_layout_check.py` (LVGL sibling-label position-overlap heuristic; hard-fail only on `page_boot`/`Connections` exact duplicates), `fleet_fix_sim.py` (20 pure-Python assertions: light-quota catch-up budget, first-ledger NVS seed, RF status codes, EVT TTL freshness, fix-attempt state machine). `run_sim_gates.ps1` / `run_sim_gates.sh` run all three fail-fast; all three pass clean (`pwsh`/`powershell -File` not on PATH as `pwsh` on this box — use `powershell -ExecutionPolicy Bypass -File` or `bash`).

### red-flag / fix (found via fleet_fix_sim, fixed same pass)

- **RF status code FAR was dead code** (`dsc-hub-fleet-heal.yaml` `rf_status_ts`): `WEAK` (`rssi < -80`) was checked before `FAR` (`rssi < -90`); since every FAR RSSI also satisfies WEAK's threshold, `code` always latched to `WEAK` first and the second `if` (guarded on `code == "OK"`) could never fire — no device could ever report `FAR`. Fixed by checking `FAR` first. `fleet_fix_sim.py`'s RF-code model now encodes the corrected precedence (was reproducing the same bug before the fix, which is exactly how the sim caught it).

### discoveries

| ID | Finding | Action |
|---|---|---|
| N-035 | Hub has no RX handler for 0xD5 "RF card" and no TX for 0xD7 "TIME" yet — pots will broadcast 0xD5 every 10s and listen for 0xD7 with no hub counterpart currently wired | Hub-side pass: add `espnow.on_receive` 0xD5 aggregation (mirrors what `dsc-hub-fleet-heal.yaml`'s RF Status sensor already computes locally per-hub-radio, but for each pot) + a periodic 0xD7 broadcast (epoch from `homeassistant`/`sntp` time) so `last_peer_time` on pots actually gets fed |
| N-036 | `cyd_glyph_audit.py`/`cyd_layout_check.py` found `dsc-control-common.yaml` and `cyd_glyphs.yaml` already clean (0 missing glyphs, 0 position dupes on gated pages) — another pass in this session had already converted non-ASCII UI strings to ASCII/declared glyphs before this pass ran; scripts are validating the *current* state, not re-doing that work | None — gates green, keep them in CI/pre-compile going forward |

### soak / operator

- Flash pots to **5.1.7**; confirm `binary_sensor.dsc_pot_N_clock_valid` and (once hub RX exists, N-035) that a fleet RF summary appears hub-side
- Run `scripts/run_sim_gates.ps1` (or `.sh`) before any future `dsc-control-common.yaml` or fleet-heal packet-format change

---

## 2026-08-05 — Fleet self-heal flash soak

### live train
- Hub **5.1.9** (`458b2e0` ESP-NOW cadence; prior `a1f5d76` REJOIN → `link_wifi_bounce`)
- Control **5.1.16**
- Pots **5.1.7** on 1 / 2 / 4; pot3 OTA upload failed (still F-003 / offline)

### soak snapshot (dark window)
- Light delivered **18.0h**, debt **0**, catch-up **off**; Auto Photoperiod **on**; SF1000 **off**
- `clock_valid` **on** hub + Control + pots 1/2/4
- Hub RF `RF|H|E2A|E2A|11|-58|OK` — no CHX; **F-004 Nest channel lock not indicated** this soak
- `fix_active` off; coherence mismatch off; EVT saw `API_BLIP` on reconnect (expected)

### closed
- Hub **5.1.9** live on glass 5 Aug **18:29** AEST (`Project digital_emotions.dsc-hub version 5.1.9`). Pass complete.

### residual
| ID | Item | Notes |
|---|---|---|
| F-003 | Pot3 USB/OTA | Compile OK; upload exit 1 — device unreachable |
| N-035 | 0xD5 RX + 0xD7 TX | **Closed in tree** (`dsc-hub-espnow-primary.yaml`); confirm pot `last_peer_time` updates on soak |
| N-038 | Stale EVT republish | Still open — cosmetic |
| N-039 | Pot 0xD7 calendar vs epoch | Still open — diagnostic only |

---

## 2026-08-05 — Hub 5.1.8 soak log: ESP-NOW OOM + channel sweep

### source
`dsc-hub-logs (4).txt` (~14:51–15:31 AEST), FW **5.1.8**.

### plant / quota (OK)
- Light delivered **18.0h**, debt **0**, SF1000 **OFF**, photoperiod entities present; RF status stays `…|11|…|OK` when reported.

### red-flag
- **~178** `espnow: Failed to send … Our of memory` across the hour (broadcast `FF:FF:…` and panel `30:76:F5:E9:22:0C`).
- **Channel sweep storms**: rapid `Wifi Channel is changed from 11 → N → 11` for N=1…14 (ESP-NOW broadcast path thrashing STA channel). Clustered with OOM bursts (~every few minutes).
- `espnow` warning flag set/cleared repeatedly; one `api Max connections (3), rejecting 192.168.86.10`; log ends with API disconnect/reconnect.
- `Last EVT` stuck republishing stale `API_BLIP` (no fresh detail) — noisy, not plant-critical.

### likely cause
New 5s `tx_fleet_heartbeat` / `tx_peer_time` broadcast load on top of 2s vitals + 10s soil/config; ESP-NOW TX buffers exhaust → component retries/sweeps channels off Nest ch11 then snaps back.

### next
| ID | Item | Notes |
|---|---|---|
| N-037 | Cap / coalesce hub ESP-NOW TX; never channel-sweep while STA associated; gate broadcast when send fails | **Fixed + live** hub **5.1.9** (`458b2e0`); verified on glass logs 5 Aug 18:29 — `Project … version 5.1.9` |
| N-038 | EVT last-per-code freshness: don't re-publish identical `API_BLIP` every few seconds | HA autofix dedupe assumes change |
| F-004 | Nest channel lock | Not indicated this soak (RF stays ch11 OK between sweeps); sweeps are hub-local, not Nest hop |
| N-039 | Pot 0xD7 RX expects u32 epoch; hub/Control use calendar fields | Align pot parser to Control calendar pack (or dual-decode) |

---

## 2026-08-05 — Main dashboard “stopped working” (hub API wedge)

### symptom
- `/dsc-hub-pro/dash` + Home showed HUB OFFLINE / `--` climate / 0 CFM. Lovelace bundle healthy (~864KB); not F-011 stub wipe.
- ~147 `dsc_hub_*` unavailable; Control 5.1.16 + pots 1/2/4 OK.

### diagnosis
- Hub on Wi-Fi (`192.168.86.33`) but native API **ListEntities hangs 60s** then peer reset. DeviceInfo OK (`project 5.1.9`).
- ESP-NOW silent (Control hello-ping; pot “hub never heard this boot”).
- `:6053` flaps; OTA `:3232` often closed. `max_connections: 3` + competing probes worsen wedge.
- No smart-plug path for hub (same as prior FOLLOWUPS).

### actions taken (remote)
- HA Core restart; ESPHome DSC-HUB disable/enable; Fleet Fix + restart button presses; aioesphomeapi DeviceInfo OK / ListEntities fail; HA entry left **enabled** for post–power-cycle reconnect.
- HA surface bookkeeping: `sensor.dsc_ha_surface_version` + `input_text.dsc_expected_release` → **5.1.9** (package deployed).

### operator
| ID | Item | Notes |
|---|---|---|
| N-040 | **Physical power-cycle DSC-HUB** | **Done** 6 Aug — hub **5.1.10** live (ESPHome Logs handshake OK; compiled 12:16 AEST) |
| N-041 | After power cycle: confirm `dsc_hub_link=on`, FW 5.1.9, Dash climate/CFM live | Partial — HA got link+5.1.10+temps/CFM once after entry reload, then ListEntities 60s timeout / flap (`ESP/link HA flaps 24h 112`). Close Builder Logs before HA reconnect |
| N-042 | Soak whether 5.1.9 ESP-NOW cadence still OOMs under load | Superseded by 5.1.10 roam fix; still soak ListEntities under HA-only (no competing log client) |
| N-043 | HA ListEntities vs ESPHome Logs | Builder log session + HA setup can race `max_connections: 3`; ListEntities alone ~15s when healthy — keep Logs closed until `dsc_hub_link=on` |

---

## 2026-08-06 — Hub / ESP-NOW flap investigation (live)

### runtime (pre-fix probe, ~110s)
- `scripts/debug_hub_flap_probe.py` → `debug-91519d.log`: **9 mode flips** in 20 samples (~2.5s).
- ICMP **12/20**, API `:6053` **13/20**, OTA `:3232` **11/20`.
- Modes seen: `alive` / `wifi_down` / `partial` / `ota_only` (OTA up while ICMP+API dead).
- HA: early snapshot had `DSC Hub Link=off` + ~all `dsc_hub_*` unavailable; later samples `on`. Pots 1/2/4 soil still live; pot3 unavailable (F-003).

### hypotheses (open)
| ID | Hypothesis | Status |
|---|---|---|
| A | Hub WiFi STA path flapping (Nest/RF) | Partial — ICMP loss real; roam scans amplify |
| B | Native API intermittent / wedge (`:6053`) | Confirmed in probe + log client disconnects |
| C | Half-alive OTA-only state | Confirmed in probe samples |
| D | ESP-NOW OOM / channel-sweep (N-037 peer hunt) | **OOM rejected** (0 in log5); channel lines are STA observer not peer hunt |
| E | Link-recovery bounce amplifying flaps | **Rejected** — Link Recovery Bounces=0, reason=none |
| F | ESPHome `post_connect_roaming` off-channel scans | **Confirmed** — default true, RSSI~-70 &lt; -49 gate; 1…14 storm while RF stays E2A/ch11 |

### fix (in tree, needs flash)
- Hub **5.1.10** / Control **5.1.17** / Pots **5.1.8**: `post_connect_roaming: false` on all lab+kit WiFi packages.
- Verify: soak hub logs ≥15 min with **zero** `Wifi Channel is changed` storms; Panel ESP-NOW stays LINKED; ping loss down.

### next
- Flash hub 5.1.10 first (OTA when `:3232` up, else power-cycle then OTA); then Control/pots
- Do **not** flash speculative FW until A–C vs D–E separated; N-040 still applies if ListEntities hangs again |

---

## 2026-08-06 — Fleet post_connect_roaming OTA pass

### shipped
- Commit `4257209` on `master`: `post_connect_roaming: false` + hub **5.1.10** / Control **5.1.17** / pots **5.1.8**.
- Local compile (UNC path broken for IDF — built from `C:\Users\cmgwe\esphome-dsc\v4`).

### OTA results
| Device | Result |
|---|---|
| Control `.177` | **OK** — live logs `Project … dsc-control version 5.1.17` |
| POT1 `.47` | **OK** |
| POT2 `.22` | **OK** |
| POT4 `.49` | **OK** |
| POT3 `.40` | **SKIP** — `:3232` closed (F-003) |
| Hub `.33` | **BLOCKED** — connect/auth/chunk timeouts; WiFi flap; hung mid-upload. Still needs **physical power-cycle (N-040)** then `python -m esphome upload dsc-hub.yaml --device 192.168.86.33` from local build tree |

### soak
- Hub 5.1.10 soak **not started** — device still on prior FW until power-cycle + OTA succeeds.
- After hub flash: ≥15 min logs, zero `Wifi Channel is changed` storms.

---

## 2026-08-06 — Separate Exhaust Ducts + Residual Closeout

### done
- **Pass A/B Dash ducts:** OUT and RECIRC no longer share a roof Y-stub. OUT exits **rear** of 4×8 → outdoor vent + muffler; RECIRC exits **front** toward room. Shared coral/violet Y-ramp removed. Intakes aligned; cascade flattened to constant height. Flex rings on OUT/RECIRC; idle coral/violet shell so both legs read at 0 CFM. Fans/muffler/flanges re-seated on independent curves.
- **Pass C deploy:** Node-concat ~875KB; `res_type: js` + `resources/update` + hard reload. Composer on; DepthTexture default off. Screenshot `/dsc-hub-pro/dash`: tents + separate OUT/RECIRC solids; no Configuration error.
- **Pass D residuals (software):** Control **5.1.17** / pots **5.1.8** match tree — no OTA. N-001 `binary_sensor.dsc_wifi_preferred_ap_mismatch=off`. Climate/Learning still label capacity proxy vs allocated. No invented CFM curves. No commit (not requested).

### audit (live at closeout)
| Check | Result |
|---|---|
| HA surface | **5.1.10** |
| Hub link / hub FW | **off / unavailable** (allocated CFM dark; skip hub OTA this pass) |
| Control / POT1/2/4 | **5.1.17** / **5.1.8** |
| Preferred AP mismatch | **off** |
| Dash ducts | OUT rear + RECIRC front; idle glow; DepthTexture off |

### soak / operator
- Recover hub (power / API) → confirm link + allocated CFM; flash hub **5.1.10** when `:3232` up (prior FOLLOWUPS)
- POT3 USB / F-003; N-016 lab wet; anemometer curves still operator
- Hard-refresh Dash after www deploys (F-010)

### deferred (unchanged)
- DepthTexture default-on; MeshLine/GPUComputation rewrite; F-001/F-002 physical AC/mister; N-012/N-013 pumps/irrigation

### red-flag
- Hub offline at closeout — climate CFM honesty consumers unavailable until hub_link returns. Not introduced by duct geometry.

---

## 2026-08-06 — Right-wall Recirc, CFM Air, Models, Hub Hold

### done
- **RECIRC:** Moved to **4×8 right wall** (+X ≈ 4.05) per annotated screenshot; OUT stays rear (−Z) → outdoor vent. Cinch-port collars at duct pierces; HUD notes `OUT rear / RECIRC right wall`.
- **CFM air:** Retired ambient `createCurlHaze` room fog (FEATURES.gpuCurlHaze=false). Duct `mkAir` streams CFM-scaled (speed/active count, tight centerline). Added `mixClone`/`mixMain` in-tent swirl. Cascade plume enters 4×8 mix instead of leaping to OUT.
- **Models (incremental):** Cloudline-like inline fan primitives (housing + flanges), denser aluminum flex rings, tent poles/fabric already present + cinch ports. DepthTexture still safe-default off.
- **Hub hold:** Card caches last-known-good live snapshot while `dsc_hub_link` on; on dropout shows HELD/OFFLINE timer + footer `ESP/link:` line from cached diagnostics (API/handshake/bounces/RF/EVT/flaps). No invented ESP serial tail.

### audit (live)
| Check | Result |
|---|---|
| RECIRC fan world pos | ~`(4.59, 1.47, 0.3)` right wall |
| OUT fan | rear ~`(2.55, 1.9, -1.58)` |
| Composer / depth | on / off |
| Hub | **off** — status `OFFLINE // hub Xs`; footer flaps line; hold activates after first good sample |
| Bundle | ~883KB Node-concat + hard reload |

### soak / operator
- Hub power-cycle + flash **5.1.10** (prior) so CFM streams + hold path can soak with live mass-balance
- After hub returns: confirm HELD clears and last-good was used during outage
- POT3 / N-016 / anemometer still operator

### deferred
- ~~Photoreal tent/plant GLTF rebuild; DepthTexture default-on; MeshLine/GPU curl real impl~~ → see **2026-08-06 Deferred FX closeout** below

### red-flag
- Hub still offline — CFM air animates only when held CFM or live CFM > 0; zero-CFM idle is intentional honesty.

---

## 2026-08-06 — Deferred FX closeout (MeshLine / GPU curl / Depth opt-in / models)

### done
- **MeshLine ribbons:** Real screen-space MeshLine attrs (`previous`/`next`/`side`) + width/resolution uniforms; tube fallback retained via `FEATURES.tubeRibbonFallback`. Live: 5 `DSCDashFX.FlowRibbon` with `previous` attrs.
- **GPU confined curl:** `createConfinedCurlHaze` (GPU shader wrap in AABB; CPU fallback). Wired to `mixClone`/`mixMain` (not room fog). Live: 2 `DSCDashFX.ConfinedCurl`. Ambient room curl stays retired.
- **DepthTexture:** Remains **default off**. Composer attaches then detaches unless `FEATURES.depthSoftParticles`; `enableDepthTexture(force)` opt-in API exported. Live `post.depthTexture === false`.
- **Models (incremental, not full photoreal GLTF rebuild):** Leaflet-tier plants (pot rim/soil/fan leaves); Cloudline fans with badge + flange bolts + denser blades. Existing offline muffler/housing/flange glTF accents unchanged.
- **Deploy:** Node-concat with `\n` separators → `dist/dsc-system-map-card.js` ~898KB; SCP + `lovelace/resources/update` `?v=deferred2-*` + hard reload. Verified FEATURES + scene objects on `/dsc-hub-pro/dash`.

### audit (live)
| Check | Result |
|---|---|
| FEATURES | meshLineRibbon **true**, gpuCurlHaze **true**, depthSoftParticles **false** |
| Scene | 5 MeshLine ribbons, 2 confined curls, depth tex off |
| Bundle | ~898KB |

### soak / operator
- Hard-refresh after www deploys (F-010). Screenshot tool flaked this pass — visual soak on operator refresh.
- Hub still offline → CFM stream soak waits on hub recovery (prior).

### deferred (narrowed / remaining)
- Full photoreal tent/plant **authored GLTF** packs (beyond incremental primitives)
- DepthTexture **default-on** — still blocked on WebKit/Chromium color+depth FBO clear bug; keep opt-in only
- Hardware: POT3 USB / F-003; N-016 lab wet; anemometer; F-001/F-002 AC/mister; hub flash when online

### red-flag
- None new from FX pass. Do **not** flip `depthSoftParticles` default true.

---

## 2026-08-06 — Pass B/C deepen (CFM honesty + model fidelity)

### done
- **Pass B:** Absolute CFM only for duct/fan/particle motion (removed fan-% fake motion at 0 CFM). Cascade plume mixes in 4×8 then biases toward OUT vs RECIRC by `outShare`/`recircShare`. `mixMain` intensity = intake+cascade (no out double-count); mix curl center pulls toward weighted exhaust ports. ACH floors to 0 when dead; room lung bob gated on recirc CFM.
- **Pass C:** Tent eave/ridge poles + front door/zipper strip. Intake curves pierce front walls; cinch at room-side + wall pierce. Cascade flex rings; denser Al flex (~48–52). Duct soft particles `depthTest: true`.
- **Deploy:** Node-concat ~901KB → `/local/dsc-system-map-card.js` + hard reload.

### soak / operator
- With hub live: confirm intake→mix→OUT/RECIRC split reads; at 0 CFM no particle/lung bob (idle shells OK).
- Visual: right-wall RECIRC cinch, rear OUT, denser flex, tent door zipper.

### deferred
- Full photoreal GLTF tents/plants; DepthTexture default-on; hardware soak items unchanged.

---

## 2026-08-06 — Photoreal surfaces (tents + plants)

### done
- **Surfaces in `dsc-dash-fx`:** `createFabricTexture`, `createMylarTexture`, `createLeafTexture`, `createSoilTexture`, `createPhotorealSurfaces` (+ optional `createLeafGeometry`).
- **Tents:** Oxford fabric map on shells/door; crinkled mylar lining map; PVC viewing window (`MeshPhysicalMaterial` when available); exposure 1.12.
- **Plants:** Serrated leaf albedo+alpha on plane leaflets (7-finger tall / 5-finger clone), denser tiers + cola tip; soil texture on media surface.
- **Deploy:** ~911KB Node-concat; `?v=photoreal-*` + hard reload.

### honesty
- Still procedural/canvas photoreal cues — not scanned/authored GLTF packs. Next step if wanted: offline multi-mesh GLTF plants/tents.

### deferred
- Authored multi-mesh GLTF tent/plant packs; DepthTexture default-on; hardware soak.

---

## 2026-08-06 — Air flow rewrite (kill blur-box)

### done
- Removed confined GPU curl mix + ACH blue volume boxes (read as bouncing blur balls in a box).
- **Intake streams** ride ducts; **flowClone/flowMain** continue pierce → mid-tent pool → pull to exits.
- **OUT/RECIRC** start *inside* the tent at the port then ride the duct (suction cue).
- Cascade: duct → 4×8 pool → OUT/RECIRC by share. Plants left alone.
- Deploy ~911KB; hard reload required.

### soak
- Needs absolute CFM > 0 (live or held) to see streams; 0 CFM stays quiet by design.

---

## 2026-08-07 — Visual-language reset + smoke-test air

### done
- Product-shot chrome (quieter HUD, no scanlines), camera bias for right-wall RECIRC, denser fabric/mylar/floor.
- **Air language:** soft particle wisps for room capture (suck*), tent pool (flow*), and terminus discharge (plume*) — not dashed monorails.
- **Removed geometric cone/sphere “fans”** after they recreated blur-soup (blue intake blobs / purple exit cone / red glow ball). Capture & exit are wisp particles only; pierce cue tiny; mat heat quiet.
- Topology/CFM honesty unchanged (quiet at 0 CFM; held OK). Bundle `?v=nowispblob-*` ~924KB.

### acceptance / proof
- Hard-refresh `/dsc-hub-pro/dash` with CFM>0 (live or HELD). Glance: converging wisps into intakes, pool fill in tents, expanding wisps past OUT/RECIRC ends — **no** solid translucent cones.

### deferred
- Authored GLTF tents; DepthTexture default-on; fake air at 0 CFM.

### done
- **Lighting:** Ceiling fixtures + wash PointLight + twin SpotLights over tents; floor bounce; warmer key / cooler fill; tent fills react to clone light / intake CFM. Floor sheen + lit ceiling plane (room no longer a black void).
- **Air (HVAC pathline cinema):** Soft additive smoke-test shafts + port jet flares gated by CFM; streak particles (elongated sprites); stronger MeshLine ribbons with CFM-scaled dash speed/width. Keeps intake→pool→exhaust story (no blur-box curl).
- **Bloom:** Slightly stronger for shafts/ribbons. Bundle ~916KB on HA www.

### soak
- Hard-refresh Dash (?v= bump). Streams need CFM > 0 (live/held).

---

## 2026-08-06 — Air journey polish

### done
- Phase-paced journeys: fast duct suck, slow mid-tent pool dwell, accelerating exhaust pull.
- In-tent dashed guide ribbons (clone→cascade, main→OUT, main→RECIRC) CFM-gated.
- Intake port jets at pierce; stronger shafts/jets; denser streak particles.
- Deploy ~bundle on HA; hard-refresh required.

---

## 2026-08-07 — DSC OS exploration (research)

Memo: [`docs/DSC-OS-EXPLORATION.md`](DSC-OS-EXPLORATION.md). Research only; no image/firmware work.

### next-plan

| ID | Item | Notes |
|---|---|---|
| N-050 | Pi 5 HAOS golden-backup / Sync bootstrap experiment | Stock HAOS + SSD; time box→Pro dash; capture friction |
| N-051 | Optional Ollama 3B sidecar soak on kit Pi | Advisor only; never ladder authority; watch RAM vs ESPHome |

### deferred

| ID | Item | Notes |
|---|---|---|
| F-010 | ESP-NOW appliance bridge (Sonoffs without HA) | **Superseded 2026-08-08** — see ETH01 pass below |
| F-011 | SoftAP / kit portal offload onto ETH01 | Deferred; kit portal still on hub |

---

## 2026-08-08 — ETH01 bridge pass (F-010 + F-012 + F-013)

Firmware: `dsc-bridge.yaml` / `dsc-bridge-kit.yaml` · `components/dsc_api_client/` · hub `0xD8` + broadcast `0xD1`.

### closed / soak

| ID | Item | Notes |
|---|---|---|
| F-010 | Appliance bridge | ETH01 Noise client → Sonoff `main_relay`; 45s stale OFF; HA followers fallback |
| F-012 | Channel anchor SoftAP | `DSC-Anchor` fixed ch11; fleet prefer BSSID via Lock WiFi / 0xD0 |
| F-013 | Hub HA wired presence | Read-only ESP-NOW→Ethernet vitals/demand mirror (writes still hub API) |

### deferred

| ID | Item | Notes |
|---|---|---|
| F-011 | SoftAP portal host on ETH01 | Invert kit host after F-010/12 soak |
| F-014 | Bridge SoftAP kit hello without `wifi:` | ESPHome forbids `wifi:` + `ethernet:`; SoftAP is `dsc_anchor_ap`. Kit satellite STA join to hub `DSC-Setup-*` deferred — paste `sensor.dsc_bridge_anchor_bssid` into hub `bridge_mac` / Lock WiFi after first ethernet boot |
| F-015 | ha-sync copy ESPHome external components | **Mitigated** — bridge `external_components` now git-pulls `firmware/v4/components`; Sync still only SCP stubs when `SYNC_ESPHOME=1` |

### mitigated-by

| ID | Item | Notes |
|---|---|---|
| F-004 | SoftAP preferred-BSSID mismatch (CHX) | SoftAP-primary is the heal path; Nest router lock remains OOS |
| F-006 | HA-link flap | Monitoring can use bridge Ethernet mirror; hub `:6053` still for writes/OTA |

---

## 2026-08-07 — Product landscape + strain/feed data (research)

Memo: [`docs/DSC-PRODUCT-RESEARCH.md`](DSC-PRODUCT-RESEARCH.md).

### next-plan

| ID | Item | Notes |
|---|---|---|
| N-052 | Strain import spike (BudProfiles → draft catalog) | **Done** import script + full JSON + popular YAML merge; Want still default/`curated=false` |
| N-053 | One curated nutrient recipe pack (YAML) | **Done** (2026-08-07): `dsc_nutrient_pack_canna_coco.yaml` — CANNA Coco A+B @ **4.0 ml/L** each (40 ml/10 L from mfr dump); wired into `dsc_v4_nutrient_catalog.yaml` slot initials |
| N-053a | Fix mangled bash fence in `NUTRIENT_SOURCES.md` | **Done** (2026-08-07): coherent status table rebuilt from on-disk dumps + stubs; broken fences / Hy-Gen duplicate / stub side-files cleaned. |
| N-053b | AU retailer brand gaps → mfr sites | **Partial (2026-08-07):** Plagron mfr **47** nut + **86** add; Dr. Dank Primo A&B **2** (TG additives-only remain); FloraFlex mfr **114**. **Still blocked:** Giant Nutrients (not on Fran's/AU dumps); Growee = dosing hardware not nutrients. |
| N-053c | Rebuild incomplete `ADDITIVE_SOURCES.md` (+ stub side-files) | **Done** (2026-08-07): status table rebuilt from on-disk `dsc_additives_*.json` (96 rows); merged/deleted `ADDITIVE_SOURCES_{growhard,house_garden,advanced_nutrients,au_retailers}.md` stubs. |
| N-064 | Curated grow-medium / substrate pack (YAML) | **Done** (2026-08-07): `dsc_medium_pack_canna_coco.yaml` + `dsc_v4_medium_catalog.yaml` (CANNA Coco Professional Plus + optional Aqua Clay; pairs with N-053) |
| N-054 | Wire catalog seeds into HA picker / Want templates | **Done** (2026-08-07): `promote_strain_catalog_to_ha.py` — 53 picker options + `want_bands` on `sensor.dsc_strain_catalog`; Want templates look up catalog / custom / stage |
| N-055 | HA custom slots: split veg/flower EC + optional climate Want | **Done** (2026-08-07): custom slots have `ec_seedling/veg/flower` min/max + optional temp/RH (0=unset) |
| N-056 | Human-curate popular Want bands (`curated=true`) | **Done** (2026-08-07): 48 YAML picker seeds marked `curated:true` with DSC photoperiod defaults accepted for HA seed set |
| N-057 | OpenTHC VDB import + cross-link | **Done** `import_strains_openthc.py`; ~12.8k ids; name-match link (bank-variant collisions possible) |
| N-058 | Keep collecting strain dumps; big merge later | **Done** (2026-08-07): `--write` merge → `dsc_strains_merged.json` **36881** unique / **73571** input (26 dumps); bank props overlay (N-060) included |
| N-059 | Seed-bank HTML dumps | **Done on disk:** Herbies **3873**, RQS **181**, FastBuds **165**, Barney **110**, DutchPassion **176**; Seedsman skipped (JS SPA) |
| N-060 | Merge overlay: bank `*_props` → shared fields | Dedupe by name/OpenTHC; prefer numeric THC over qualitative labels (DP “High”) |
| N-061 | ToS / robots revisit before any public redistribution of bank dumps | Local research dumps only today; not a legal opinion |

### deferred

| ID | Item | Notes |
|---|---|---|
| F-011 | Licensed nutrient catalog API (Hortibase or similar) | Only if product needs multi-brand feeds at scale |

### out-of-scope

- Scraping Leafly/Hortibase/brand PDFs as a product data pipeline; cloning OGB StrainDB

---

## 2026-08-07 — Archive/GitHub strain dump survey

### done (this pass)

- Surveyed Wayback (SeedFinder API / Herbies catalog JSON), GitHub, HF, Kaggle
- Imported **Seed City CC0** dump: `scripts/import_strains_seedcity.py` → `dsc_strains_seedcity.json` (~8.9k)
- Documented candidates + skips in `homeassistant/data/STRAIN_SOURCES.md`

### next-plan

- N-058 merge pass should include Seed City alongside Herbies/RQS/FastBuds/Barney/DutchPassion for grow-field overlay

### deferred

- SeedFinder bulk recovery: no Wayback dump found; stays blocked without ToS plan

---

## 2026-08-07 — Other seed-bank dumps (RQS / Fast Buds / Barney / Dutch Passion)

### done (this pass)

- Importers: `import_strains_fastbuds.py`, `import_strains_barneys.py`, `import_strains_dutchpassion.py`; RQS regex + tyson category
- Full polite crawls complete on disk: RQS **181**, FastBuds **165**, Barney **110** (dump; 111 pages/ck), DutchPassion **176**, Herbies **3873**
- Herbies: mid-run deaths recovered via `--resume --delay 0.65` (+ `_herbies_resume_loop.py` wrapper); final dump `count=3873` / `pages_fetched=3873` matches sitemap
- Cleared earlier inventory false alarm (smoke dumps 20/5 vs docs) — RQS + Herbies now full dumps on disk
- Seedsman skipped (JS SPA); root sitemap 404s documented — use robots `Sitemap:`
- Docs: `STRAIN_SOURCES.md`, `.gitignore`; N-060/N-061 follow-ups
- Follow-up: `merge_strain_catalogs.py` DUMPS already includes Herbies + FastBuds / Barney / Dutch Passion (still no `--write`)

### next-plan

- N-060 bank props overlay in big merge
- Filter Barney non-seed SKUs — importer now skips no-Genetics/THC pages; re-run to drop Candy/Gas Pack + rolling papers from dump
- Fast Buds dump includes third-party bank lines sold on FB; `breeder` is shop name today — refine in merge

---

## 2026-08-07 — Wikipedia / Wikidata strain probe

### done (this pass)

- SPARQL + MediaWiki API probe: Wikidata cannabis strains ~34 (identity-only); enwiki list ~84 name/prose; category ~23 pages
- **Skipped dump** — field poverty vs bank/API dumps; documented in `STRAIN_SOURCES.md` with CC0 / CC BY-SA notes

### deferred

- Revisit Wikidata only if structured cultivar props (breeder / parentage / chem) grow meaningfully

---

## 2026-08-07 — Lab terpenes / scientific chem overlay

### done (this pass)

- Surveyed Cannlytics (HF CC-BY-4.0), MaxValue terpene parser, state COAs, SDP, USDA hemp, OpenTHC labs, BudProfiles studies, flavonoids
- **Imported companions** (gitignored; no `--write` merge):
  - `import_lab_terpenes_maxvalue.py` → `dsc_lab_terpenes_maxvalue.json` (27114 profiles)
  - `import_lab_terpenes_cannlytics.py` → `dsc_lab_terpenes_cannlytics_nv.json` (4210 profiles)
- Schema: documented future `chemistry.*` overlay; sensory stays qualitative until merge
- Honest split: MD/HI have strain names but not terpene *profiles*; NV has profiles but product_name only
- Did **not** scrape Leafly; did **not** interrupt Herbies crawl; did **not** run catalog `--write` merge

### next-plan

| ID | Item | Notes |
|---|---|---|
| N-062 | Lab terpene merge-by-name | **Done** (2026-08-07): `--write --chemistry` attaches `chemistry.*` by `name_norm`; **2397**/36881 seeds; MaxValue preferred over Cannlytics NV; never genetics |
| N-063 | Cannlytics strain-named states | Revisit MD/HI if per-analyte terpenes appear; until then cannabinoid-only |

### deferred

- Leafly / Leaflyer dumps (ToS)
- Strain Data Project (no open CSV)
- USDA hemp bulk (wrong shape / market)
- Flavonoid×strain open dumps (none found)
- MaxValue redistributability clarification (no upstream LICENSE)

---

## 2026-08-07 — XML / CSV raw dump survey

### done (this pass)

- Surveyed GitHub, Wayback CDX, Kaggle/HF, gov open data, shop feeds
- Imported **Wikileaf grow_data MIT CSV**: `import_strains_wikileaf.py` → `dsc_strains_wikileaf.json` (2793)
- Documented full find/skip table under **XML / CSV raw finds** in `STRAIN_SOURCES.md`
- Did **not** interrupt Herbies/RQS full crawls

### next-plan

| ID | Item | Notes |
|---|---|---|
| N-062 | Lab terpene merge-by-name | **Done** (2026-08-07): see merge section — `--chemistry` on write; companions still inventoried separately |

### deferred

- Leaflyer / Kaggle Leafly CSV: available as files but stay skipped (ToS / provenance)
- Seed shop Google Merchant XML / Shopify `products.csv`: none found public

- NUTRIENT_SOURCES.md parallel-agent thrash (**fixed 2026-08-07**): rebuilt coherent status table from on-disk `dsc_nutrients_*.json` + stubs; removed `NUTRIENT_SOURCES_nutrifield.md` / `_cyco.md` / `*.tmp` stubs.

## Agent notes (off-plan)

- N-xxx: NUTRIENT_SOURCES.md thrash from parallel brand-agent writes — **mitigated** (rebuild + stubs merged 2026-08-07); still prefer append-only / serialize if another multi-brand wave starts.
- N-xxx: ADDITIVE_SOURCES.md parallel-agent stub side-files — **mitigated** (rebuild + stubs merged/deleted 2026-08-07 as N-053c); prefer append-only / serialize if another multi-brand wave starts.
- House & Garden nutrients dump (`dsc_nutrients_house_garden.json`): `category` often null (mega-menu taxonomy vs main CTA); starter-kit expand left some rows titled "View Feed Charts" — fix in a nutrients follow-up, not additives.
- Grow mediums LECA: Balls Expanded Clay has no discoverable manufacturer catalogue — GK/Accent PDP only; revisit if an official site appears.
- Grow mediums perlite: `growy` Premium Perlite 10L is Grow Kings–only (growy.com.au unreachable / no mfr catalogue); Exfoliators covers AU grade catalogue.
- Grow mediums propagation: ROOT!T official `rootit.com` is a parked lander — dump uses Grow Kings PDP copy only until a real manufacturer catalogue returns.
- Grow mediums rockwool: GROWOOL has no public manufacturer catalogue — AU floc/granulate captured via Grow Kings SKUs only; revisit if an official site appears.
- Additives honesty empties: Hydro Axis + Silvan on GK supplements are pressure sprayers only — `dsc_additives_hydro_axis.json` / `dsc_additives_silvan.json` intentionally `count=0`.
- THC additives: ApexGrow dose strings like `2 to 4ml per litre` (no space before unit) may under-parse `dose_rates`; `dose_text` still captured — tighten regex later.
- Additives batch (Vitality/Ezi Oil/De-Ozzy/Yield Masta/Way to Grow/Ezi Root/Higgins): no manufacturer storefront found — GK PDP dumps only; Uber mfr Shopify 402; Green Pad Wix product-page URLs thin (catalogue index + GK Junior); revisit if official catalogues appear.
- Additives batch (Rootex/Kraken/ROOT!T/Guardian/Dutchfest/SOS): no usable manufacturer product catalogue (Bass Labs SSL/non-product; dutchfest.com = festival; rootit.com empty) — GK vendor-fallback dumps only; SOS Liquid Biochar may overlap FUTURE SOIL; revisit if official catalogues appear.
- AU Shopify retailers (2026-08-07): scraped The Grow Guys / Happy Hydro / Accent / Fran's / TG Hydro / Apex Grow / Hydro Hub via `import_au_retailer_catalog.py`. Non-viable: hydroexperts 403; hydrocity/hydroking/hygrotech DNS; greenthumb/hydrogarden non-Shopify. Fran's vendor revisit (2026-08-07): **no Giant Nutrients**; Growee = dosing hardware; FloraFlex on Fran's = irrigation only — nutrients from floraflex.com (**114**). Hydro Hub `nutrients` collection mixes additives. Checkpoint `os.replace` on SMB shares fails intermittently — importer now falls back to direct write.
- Growth Technology additives: manufacturer PDPs are marketing-thin (NPK/dose rarely on overview; rates often only on download.php pictorials/labels). Dump records link provenance only — enrich later from label images/SDS if licensed for OCR, or curated secondary sources. AJAX grid intermittently 500s on later pages (importer keeps partial + seeds core hydro slugs).
- GK manufacturer-brand gap fill (2026-08-07): `_gk_brands.json` / `_gk_additives_brands.json` now have **0** missing `dsc_nutrients_*` / `dsc_additives_*` dumps (45 + 75). Parallel agents + retailer carve (`import_au_retailer_catalog.py`) filled high-SKU gaps; do not re-scrape identical retailer collections. NAS `os.replace` on checkpoints still races under concurrent writers — prefer `--resume` + direct-write fallback; avoid two processes on the same brand.

---

## 2026-08-07 — Intl retailers shipping to AU

### done (this pass)

- Verified AU shipping / regional stores for Spider Farmer AU, Mars Hydro AU, Vivosun en-AU, Hytec (worldwide DDU), Hydro Bros (AU country picker)
- Importers: `import_retailer_hytec.py`, `import_retailer_hydrobros.py`, shared `_dsc_intl_shopify.py`
- Hytec dumps: lights **194**, tents **217**, nutrients **201**, additives **530**, mediums **64**
- Hydro Bros dumps: lights **107**, tents **83**, nutrients **718**, mediums **170** (no additives collection)
- Brand indexes `_hytec_*_brands.json` / `_hydrobros_*_brands.json`; SOURCE docs + FOLLOWUPS + gitignore
- **Intl brand carves:** `import_from_intl_retailer_dumps.py --preset chase` → **38** sibling dumps (lights 7, tents 6, nutrients 9, additives 9, mediums 7); summary `_intl_retailer_carve_summary.json`
- Did **not** duplicate Grow Kings lights/tents or manufacturer D2C brand dumps (siblings)
- Seeds: no new bank dumps (Hytec/Hydro Bros have no seed collections; AU seed shipping not claimed)

### deferred / blocked

| ID | Item | Notes |
|---|---|---|
| N-065 | AC Infinity checkout AU confirm | Policy HTML has no AU; FAQ says use checkout dropdown |
| N-066 | Growell / Hydrobuilder / Horticulture Source / Secret Jardin webshop | Skip: UK-only / no AU / 403 / 404 |
| N-067 | Seed dumps from intl hydro shops | No seed collections; do not claim AU seed shipping without explicit ToS |
| N-068 | Enrich Hytec/Hydro Bros bottle dose parsers | First pass is volume/NPK-thin retailer copy; mfr siblings preferred for rates |
| N-069 | MIGRO full catalogue | `products.json` empty; HTML only 4 ARAY SKUs — need JS/API or Tavily-deep crawl for full ARAY/UV range |
| N-070 | Dual Spider Farmer dump slugs | **Done** (2026-08-07): canonical `spider_farmer`; removed `dsc_lights_spiderfarmer` / `dsc_tents_spiderfarmer`; woo intl writes underscore slug |
| N-071 | `dsc_tents_vivosun` race | **Mitigated** (2026-08-07): pin file `_vivosun_dump_owner.json` — D2C owns `dsc_*_vivosun.json`; GK proxies must use `_gk` suffix |

### agent notes

- Spider Farmer AU / Mars Hydro AU are WooCommerce (not Shopify `products.json`) — brand agents own photometric dumps
- Vivosun en-AU storefront is SPA-ish — brand agent / regional site; shipping to AU confirmed on help page

- Bunnings nutrients/additives/mediums (2026-08-07): **canonical on-disk dumps** (do not trust intermediate run-log counts from parallel agents):
  - `dsc_nutrients_bunnings.json` **253** SKUs — `imported_at` **2026-08-06T18:59:24Z**
  - `dsc_additives_bunnings.json` **137** SKUs — `imported_at` **2026-08-06T18:59:24Z** (same write wave; brands index **12** incl. Unknown for 2 empty-brand SKUs)
  - `dsc_mediums_bunnings.json` **99** SKUs — `imported_at` **2026-08-06T18:50:13Z**
  - **Race:** two agents crawled overlapping tracks. Stale log snapshots (`_bunnings_nutrients_run.log` **296** SKUs; `_bunnings_additives_run.log` **98** / `run2` **94**) are pre–Seasol-routing-fix. Final counts are post-pass after Seasol seaweed vs PowerFeed fix (do not match `fertilisers` in category path). Prefer dump `imported_at` over run logs.
  - robots Disallow `/search` — no keyword scrape for hydro nutes / calmag / bloom booster beyond category heuristics; revisit only if a robots-allowed listing path appears.

---

## 2026-08-07 — AU seed retailers + brand gap list

### done (this pass)

- Inventory: existing `dsc_strains_*.json` counts documented; Herbies full dump **3873** on disk
- AU retailer dumps (schema v2, `curated:false`, no merge):
  - Seedsman Australia WC → `dsc_strains_seedsman_au.json` (**1263** after merch filter)
  - Cannabiz Seed → `dsc_strains_cannabiz.json` (**99**)
  - Sacred Seeds Australia → `dsc_strains_sacredseeds.json` (**67**)
  - Mediseed Man → `dsc_strains_mediseedman.json` (**82**, thin props)
  - Weed Seeds Express AU sitemap → `dsc_strains_weedseedsexpress.json` (**363**)
- Brand gap index: `homeassistant/data/_au_seed_brands.json` via `build_au_seed_brands.py`
- Scripts: `strain_wc_common.py`, `import_strains_{seedsman_au,cannabiz,sacredseeds,mediseedman,weedseedsexpress}.py`
- Docs/gitignore updated; did **not** scrape Leafly/SeedFinder; did **not** merge catalogs

### next-plan

| ID | Item | Notes |
|---|---|---|
| N-069 | Parallel manufacturer scrapes from `_au_seed_brands.json` | Priority: Blimburn, Green House Seed Co, DNA Genetics, Sweet Seeds, Sensi, Humboldt, The Plug |
| N-070 | MSNL Magento product-only feed | Flat sitemap mixes hubs; needs cleaner URL filter or HTML listing crawl |
| N-071 | Confirm Herbies final dump count ≈ 3873 | **Done** — `dsc_strains_herbies.json` count **3873** |

### deferred

- `seedshere.com.au` / `ozseeds.com.au` — DNS dead
- Australia Bud Supply — not a seed catalog (flower/vape)
- Seedsman.com global SPA — still skipped

## 2026-08-07 — Grow-light manufacturer chase

### done (this pass)

- Coordinator already had `dsc_lights_growkings.json` (**221**) + `_gk_lights_brands.json` (**41** brands) — not re-scraped
- Manufacturer dumps with strong map coverage: Spider Farmer **314** (PPFD+spectrum maps 100%), Digi-Lumen **23** (PPFD maps 100%), Treegers **12** (beam/spectrum/PPFD maps), Viparspectra **15** (beam maps)
- Lumatek kept as GK proxy (official site rebuild/PDF only)
- All 41 GK index brands have `dsc_lights_<slug>.json` (mfr or retailer-proxy)
- Bunnings: **7** Sansi/LetPot houseplant grow lights
- Docs: `LIGHT_SOURCES.md` + `dsc_light_catalog.schema.md`

### next-plan

| ID | Item | Notes |
|---|---|---|
| N-072 | Lumatek re-scrape when public PDPs return | Currently password/rebuild + catalogue PDF only |
| N-073 | AC Infinity / Adjust-A-Wings / Pro Grow / Hortitek mfr HTML crawls | Shopify `products.json` 404 or 429; GK proxy is placeholder |
| N-074 | Guard empty mfr crawls from wiping GK proxies | Failed Shopify crawls wrote count=0 over good splits once |

### deferred

- Roleadro / Spectrum King / Bestva / Phlizon — DNS dead
- Hi-Par official domain refused / DNS fail

## 2026-08-07 — Grow-tent manufacturer brand chase

### done (this pass)

- Used `_gk_tents_brands.json` + `dsc_tents_growkings.json` (**85** SKUs); **no** Grow Kings re-scrape
- Per-brand dumps for all **15** GK brands; manufacturer/AU-retail overwrites for Gorilla, Homebox (A-Grade), AC Infinity, Spider Farmer, Vivosun, Bud Box
- Docs: `TENT_SOURCES.md` brand→count→URL table; gitignore already covers `dsc_tents_*.json`

### next-plan

| ID | Item | Notes |
|---|---|---|
| N-075 | Sea-Hawk / Power-House manufacturer catalogues | No public mfr SKU site found; GK-split only |
| N-076 | Mammoth official mfr crawl | Dutch Mammoth Tents line; GK has Pro HC only |
| N-077 | Deduplicate `dsc_tents_spider_farmer` vs `dsc_tents_spiderfarmer` | **Done** (2026-08-07): kept richer `spider_farmer` (105); removed alt (83) |
| N-078 | Homebox.net SKU feed if/when published | Currently A-Grade AU proxy |
| N-081 | Light photometrics pack (PPFD/spectrum URLs) | **Done** (2026-08-07): `clean_light_map_assets.py` + `dsc_light_pack_photometrics.yaml` + `dsc_v4_light_catalog.yaml`; Vivosun still 0 maps (JS storefront) |
| N-082 | Catalog → Pro dash surface | **Done** (2026-08-07): Strains / Nutrient Science / Lighting views show catalog packs; SF1000 nameplate watts sync → `input_number.dsc_sf1000_w` |
| N-083 | Build a Plant (separate surface) | **Done** (2026-08-07): `dsc-build-plant` dashboard + card + `dsc_v4_build_plant.yaml`; Vivosun stated PPE/PPFD/datasheets; map URLs still 0 |
| N-084 | Sync add-on Build a Plant parity | **Done** (docs train): Sync **5.1.4** concat + dashboard YAML + `www/dsc-catalog/`; rebuild add-on after merge |

### deferred

- Garden HighPro / Lighthouse / Secret Jardin Dark Room — not in GK brand index this pass (prior chase list); resume if added to coordinator

## 2026-08-07 — Build a Plant (N-083)

### done
- Separate dashboard URL **`dsc-build-plant`** (`dsc-build-plant-dashboard.yaml` + `configuration.snippet.yaml`)
- Package `dsc_v4_build_plant.yaml`: soil % blend (sum-100), 8-slot plant roster, `sensor.dsc_mix_calculator`, Want temp/RH sensors, `script.dsc_apply_climate_want` / `dsc_build_plant_commit` / `dsc_plant_assign_to_pot`
- Lit card `www/dsc-build-plant-card.js` + `dist/` copy; search indexes under `www/dsc-catalog/`
- Vivosun importer: `__NEXT_DATA__` wattage / PPE / stated point-PPFD / PDF datasheets; map URLs still **0** (CDN hashes unlabeled)
- **N-084:** Sync add-on **5.1.4** now matches `ha-sync.sh` / HACS dist (dashboard + catalog + bundle concat). Ops runbook: [`docs/qa/LIVE-UI-BUILD-A-PLANT.md`](qa/LIVE-UI-BUILD-A-PLANT.md)

### verify (operator)
- Rebuild Sync **5.1.4+** (or HACS Redownload + manual catalog) — Sync ≤5.1.3 stopped concat at The Dash
- Ensure `dsc-build-plant` dashboard is registered (configuration.snippet)
- Reload packages; open `/dsc-build-plant/build`
- Soil sliders valid only at 100%; mix ml = dose × tank L × strength%
- Apply climate Want no-ops when custom temp/RH are 0
- Search indexes under `/local/dsc-catalog/`

### extension points & gaps (next pass)

| Goal | Extend | Gap |
|---|---|---|
| Multi-nutrient mix calculator | Slots 1–8 + Accept mix + `sensor.dsc_mix_calculator` | Stage/week recipes, recipe packs, short-stock gating, pumps (N-012) |
| Soil % splits | `dsc_blend_*` + card stacked bar | Dump composition % not auto-loaded |
| Plant inventory | 8 roster slots | Seed counts / plant IDs / mother stock |
| Apply climate Want | Custom temp/RH → hub targets | Catalog seeds lack climate bands (by design) |
| Vivosun / light graphs | NEXT_DATA photometrics + datasheets | Still **0** keyword-labeled map image URLs |
| Search / select | `/local/dsc-catalog/` indexes | Strain index capped at **10000** of densified master |

### deferred
- OCR of PPFD heatmaps; pump dosing; absorbing Build a Plant into The Dash / Pro tabs

## 2026-08-07 — Dash air: kill glow spheres (filaments)

### done
- Screenshot still showed blue/red/purple **glow spheres** after cone removal — root causes: dense soft particles + bloom, **OUT ventGlow plane**, matGlow, and shell re-boost when both exhaust legs live.
- Suck/exit remade as **~10 discrete streamline filaments** (streak sprites, low opacity) — not filled volumes.
- Quieted ventGlow/matGlow; CFM-gated vent slat emissive; removed neon shell re-boost; bloom threshold↑/strength↓.
- Deployed \?v=nofanblobs-*\ (~924KB). **Hard location.reload required** (F-010).

### acceptance
- After hard reload at CFM>0 (HELD OK): intakes show converging filament fans, RECIRC/OUT show expanding filaments past terminus, **no** large translucent spheres/cones at those ports.

### deferred
- Authored GLTF; DepthTexture default-on; fake air at 0 CFM.

## 2026-08-07 — AU seed brand-gap mfr dumps (Blimburn / HMC / Greenhouse)

### done
- Importers: `import_strains_blimburn.py`, `import_strains_happy_munkey.py`, `import_strains_greenhouse.py` (schema v2, polite+checkpoint, `curated:false`, no merge)
- Dumps: Blimburn **1355** (`blimburnseeds.com` WC Store API); Happy Munkey **50** (HMC filter on same API); Greenhouse **118** (`shop.greenhouseseeds.nl` PDP prose)
- `STRAIN_SOURCES.md` updated; SMB-safe checkpoint fallback in `strain_wc_common` / greenhouse importer

### next-plan
| ID | Item | Notes |
|---|---|---|
| N-079 | Re-run Greenhouse with tighter skip list | A few USA/landrace limited-edition sitemap locs 404 |
| N-080 | Herbies crawl finish | **Done** — dump **3873** / sitemap **3873** |

### deferred
- No Leafly / SeedFinder; no live catalog merge

---

## 2026-08-07 — Continual ESP API drops (debug d1f7fb)

### runtime
- Logs closed soak: hub **29%** alive / **38** flips; Control **93%** / 6 flips.
- Post-reload soak: hub **13%** alive (4/30), wifi_down 15/30.
- Brief HA live window: Lock **ON**, preferred==associated `58:D9:D5:D7:AA:E2`, RSSI **-63**, FW 5.1.10.
- Flaps 24h climbed **59 → 74** during session. TCP :6053 often open while HA entities unavailable (wedge).

### verdicts
| ID | Result |
|---|---|
| G Builder vs HA | Rejected as primary |
| A Hub WiFi path | **Confirmed primary** |
| B/C API/hello | Confirmed secondary |
| F roam storms | Rejected (5.1.10, 0 storms) |
| Lock/BSSID missing | Rejected when live — already locked to E2A |

### in tree / deployed
| Item | Status |
|---|---|
| Hub stub `wifi_bssid: 58:D9:D5:D7:AA:E2` + FW **5.1.12** | **OTA done** — HA reports FW 5.1.12 when live; BSSID pinned E2 |
| HA `dsc_hub_api_reclaim_after_outage` in `dsc_v4_fleet_heal.yaml` | **Deployed 7 Aug 2026** (first SCP missed reclaim block — 8424B truncated; redeploy 9491B + core restart). Entity `on`, `restored:false`. Manual trigger proved `reload_config_entry` + notify + 5 min cooldown (trace `0da6eff7`). |

### operator
| ID | Item | Notes |
|---|---|---|
| N-065 | Power-cycle hub then OTA 5.1.12 | **Done** (OTA succeeded earlier this session) |
| N-066 | Deploy reclaim package + core restart | **Done** after redeploy (verify automation stays `on`, not `restored`) |
| N-067 | Hub placement / Nest — RSSI ~−65 vs Control stable | Still open — WiFi path flaps remain primary; reclaim is band-aid for HA wedge only |

### red-flag
- Hub WiFi path still flapping hard; Dash HELD is honest. Climate continues on hub local stack when API is dark.

---

## 2026-08-07 — Build a Plant search UX fix

### done (this pass)
- Root cause: typeahead looked up `_indexes["strain"]` etc. while catalog keys are `strains` / `mediums` / `nutrients` / `lights` — always empty hits.
- Mojibake: fancy Unicode (`·` `—` `…` `≠`) in card/dashboard strings → ASCII.
- Predictive dropdowns + keyboard nav + catalog status chip; skip hass re-render while search open.
- Deployed `/config/www/dsc-build-plant-card.js` + rebuilt `dsc-system-map-card.js` / `DSC-HUB.js` (bundle registers card first); cache-busted lovelace resources; HA core restarted.

### deferred / next
| ID | Item | Notes |
|---|---|---|
| N-068 | Interactive browser verify Build a Plant typeahead | cursor-ide-browser had no tab; browser-use blocked on Chrome remote-debugging Allow. Operator: Ctrl+F5 `/dsc-build-plant/build`, confirm dropdowns + no mojibake. |
| N-069 | Commit Build a Plant UX when asked | Repo changes left uncommitted (sibling agent owns commit/push). |


## 2026-08-07 — Build a Plant Full Inclusion Pass (N-085)

### honesty (tree vs prior Done claims)

| ID | Prior claim | Reality at pass start | Action |
|---|---|---|---|
| N-054 | promote + want_bands Done | `promote_strain_catalog_to_ha.py` missing; `dsc_strain_catalog.yaml` = 2 Generic seeds; no want_bands attrs | Rebuilt in this pass (JSON want_bands) |
| N-055 | custom climate + stage EC Done | temp/RH helpers absent; flat ec_min/max only | Finished in this pass |
| N-058 / N-062 | merged ~36k + chemistry Done | `dsc_strains_merged.json` + importers **missing on disk** (never git) | MVP merge + toolchain; full crawl still best-effort |
| N-064 | medium pack Done | no `dsc_v4_medium_catalog.yaml` | Landed |
| N-081 | light photometrics Done | pack YAML present; many dumps missing | MVP PPFD wired; HA 2026.8 JSON fixtures |

### shipped

| ID | Item | Notes |
|---|---|---|
| N-085 | Build a Plant Full Inclusion | Surface **5.1.11**; assign bridge + Pro cross-links + chem/PPFD selectable; POT3 browser evidence [`docs/qa/N-085-POT3-BROWSER.md`](qa/N-085-POT3-BROWSER.md); Sync add-on image **5.1.4** on HA, **stopped / boot=manual** until push |

### deferred (unchanged)
- plant_id nursery DB; Dash merge; pumps N-012; irrigation N-013; PPFD OCR; N-061 public dumps
- Hub/ESP offline during soak: `text.dsc_pot3_plant_name` + `number.dsc_hub_target_*` writes not live-proven
- Re-enable Sync only after N-085 commit/push (or Sync will overwrite live packages from old master)

---

## 2026-08-07 — Pi brain + local webserver product shape

Notion hub: [Product layers](https://app.notion.com/p/3b52b4cda37081c2bcafc85d3407556c) (Wiki Architecture + Eng Ops pointer). Repo memo: [`docs/DSC-BRAIN.md`](DSC-BRAIN.md).

### done (this pass)

| ID | Item | Notes |
|---|---|---|
| N-090 | Notion Product layers doc pass | Hub + 12 child pages; Wiki home / Architecture / Roadmap / Eng Ops wired; diagrams |
| N-091 | Repo architecture + HA scaffold docs | `docs/DSC-BRAIN.md`, `docs/HA-SCAFFOLD.md`, `docs/brain/*` |
| N-092 | Brain catalog SQLite + Want + dry-run tick | `brain/dsc_brain/` CLI + FastAPI stub; loads curated packs without HA |
| N-093 | F-010 bridge design + ETH01 firmware | **Done 2026-08-08** — `dsc-bridge*.yaml` + `dsc_api_client`; sketch retired |

### next-plan

| ID | Item | Notes |
|---|---|---|
| N-094 | Brain hub ESPHome API client | Ingest live Got; still dry-run cmds until soak |
| N-095 | Webserver MVP (ops + Build a Plant + updates) | Spec: `docs/brain/WEBUI.md` |
| N-096 | F-010 board BOM + ESP-NOW demand protocol | Blocks honest HA-optional climate |
| N-097 | Promote Want templates to call shared brain rules | Keep HA soak; stop deepening HA-only SoT |

### deferred

| ID | Item | Notes |
|---|---|---|
| F-010 | ESP-NOW appliance bridge (Sonoffs without HA) | **Done 2026-08-08** — ETH01 pass; soak open |
| F-014 | HAOS golden appliance / Integration “app” shell | Optional packaging only — not product SoT |

### out-of-scope (unchanged)

- Custom Yocto/Balena “DSC Linux”; forking HAOS Buildroot for branded img
- Ollama on Pi4 4GB kit brain

---

## 2026-08-07 — Unified HA Product Shell (N-086)

### shipped

| ID | Item | Notes |
|---|---|---|
| N-086 | Unified HA product shell | One sidebar **DSC-HUB**; primary **Ops · Plant · Advanced · System**; Build folded into Plant; Catalog Explorer browse/compare; surface **5.1.12**; runbook [`docs/qa/LIVE-UI-PRODUCT-SHELL.md`](qa/LIVE-UI-PRODUCT-SHELL.md) |

### deferred / honesty

- Strain dump **height** mostly absent (`with_height` often 0) — UI never invents; full Herbies recrawl out of scope
- Remove `dsc-build-plant` lovelace entry entirely after redirect soak
- Pi webserver / brain API cutover of Build+Catalog cards remains N-095 track
- Unrelated local `brain/` scaffold churn left out of this pass

---

## 2026-08-07 — Catalog Massive Rescrape (N-087)

### shipped

| ID | Item | Notes |
|---|---|---|
| N-087 | Research corpus + HA projection | SQLite science↔seed schema (`corpus_schema` / `corpus.py`); Wave A OpenTHC (~12.8k) + Seed City CC0 (~8.9k) + Wikileaf grow_data (~2.8k) + Cannlytics MD labs (30k rows); Wave B bank scrapers (ILGM/Herbies/RQS + discovery list); Wave C PPFD download/crop → `media_asset` + [`docs/qa/CATALOG-GAPS.md`](qa/CATALOG-GAPS.md); ingest + link report + community export stub; HA indexes from SQLite projection; surface **5.1.13**; runbook [`docs/qa/CATALOG-RESEARCH-CORPUS.md`](qa/CATALOG-RESEARCH-CORPUS.md); **collation SoT:** [`docs/qa/CATALOG-COLLATION-CONTRACT.md`](qa/CATALOG-COLLATION-CONTRACT.md) |
| N-087b | DB DUMP + public dataset expansion | Local `DB DUMP` ingest (`import_local_db_dump.py`): Seed City local, Leafly flat/features, replication labs (~215k), pickle archive; GitHub Kushy MIT (~9.5k) + MaxValue terpenes (~43k); discovery list for Mendeley/CT/SDP; corpus rebuilt with slim typed payloads (raw dumps remain SoT for overflow) |
| N-087c | Multi-DB staging → master ingest | Per-source staging under `brain/data/staging/<family>.sqlite3` with **FULL** `raw_record` payloads (NAS >1 TB; multi-GB OK); master `dsc_brain.sqlite3` receives matched typed+chem+grow+links via `merge_staging_to_master.py` (additive; keep both chem when conflicting); never explode bulk scores into `attribute_kv`; runbook updated in [`CATALOG-RESEARCH-CORPUS.md`](qa/CATALOG-RESEARCH-CORPUS.md) |
| N-087-COLLATION | Collation contract (notes / reviews / lineage) | Durable architecture in [`CATALOG-COLLATION-CONTRACT.md`](qa/CATALOG-COLLATION-CONTRACT.md). **2026-08-10 v4 + debt + match-expand:** `observation`/`review`; `parent_of` SoT; `subtype_of` (~9.1k); junk/tree quarantine; observations≈71k; review=0 honest. Thin chase: [`CATALOG-THIN-FIELDS.md`](qa/CATALOG-THIN-FIELDS.md). Workset `C:\DSC\collation\`; baks `pre_collation_debt` + `pre_match_expand`. |
| N-087-DENSIFY | Catalog densify (height / aliases / notes) | Offline pass after match-expand: numeric height text → `height_cm_*`; HA `height_band` surface; exact bank slug↔name `science_alias`; forum `grow_note` + filtered Herbies/Zamnesia excerpts. Chase-only: StrainDB CF, medauth reviews, SF merge-when-quiet. Workset `C:\DSC\collation\`; bak `pre_catalog_densify`. Thin chase: [`CATALOG-THIN-FIELDS.md`](qa/CATALOG-THIN-FIELDS.md). |

### deferred / honesty

- BudProfiles API offline (empty shell dump)
- SeedFinder alphabetical pages are JS-rendered — sitemap scrape in progress then **CF-blocked** (~10.3k/40638 as of 2026-08-09; see S-SEEDFINDER). Resume after browser CF; full SF dump still incomplete.
- Seedsman / some bank list routes 404 or bot-walled — discovery list retained for next wave
- Cannlytics uses MD state CSV (strain_name present); full multi-state / `data/all` (~2.5GB) not ingested this pass
- **2026-08-08 Cannlytics HF expand (job #3):** `import_lab_terpenes_cannlytics.py` multi-state → dumps `dsc_lab_terpenes_cannlytics_{state}.json` + staging `cannlytics_expand.sqlite3` (CC-BY-4.0). CSV OK: ny/ut/mi/hi/ma/nv/fl (+ ca CSV cached). **404 xlsx-only:** wa/ct/co. **No strain names:** ri/or. Staging ~82k chem / ~73k unique (`attribute_kv=0`); unique-first projection; pesticide panels stay in dumps/CSV not master attrs. CA full JSON dump skipped (SMB Errno 22 on multi-GB write); CA staging interrupted mid-pass — resume `python scripts/run_lab_state_expand.py --state ca` then `merge_staging_to_master.py --only cannlytics_expand` when master unlocked. Do not pull `data/all`.
- Bank HTML scrapes stay `redistributable=false` until legal review; open export = OpenTHC + Seed City + Wikileaf + Cannlytics CC-BY + Kushy MIT (+ MaxValue when license clear)
- Full public GitHub dump upload of research scrapes deferred
- Pi webserver UI over full corpus remains out of scope (N-095 track)
- `build_catalog_search_indexes` SQLite projection is N+1 per canonical (slow on network DB) — batch JOIN refactor later
- HA strain projection capped at 2500 of ~57k canonical; raise cap or page when UI needs it
- Nutrient/medium brand dumps still thin (pack seeds only this pass); Wave D brand crawl next
- Parquet `train-00000-of-00002.parquet` is **image+label only** (158 rows) — not strain chem; correctly skipped (not an allowlist problem)
- Deep DB DUMP staging pass (`import_db_dump_deep.py`) wrote 11 families under `brain/data/staging/`; **merge into master was blocked by concurrent master writers** — re-run `python scripts/merge_staging_to_master.py` (or `_n087_merge_retry.py`) when exclusive
- Mendeley “800+ strains effects+chemistry” and Strain Data Project need manual DOI/license fetch
- NAS SQLite I/O errors on 50MB+ dump reads — keep lab dumps slim; raw CSVs stay in DB DUMP
- First bloated ingest (~6GB attribute_kv explosion) taught: bulk dumps must not mirror every Leafly score into `attribute_kv` — use staging `raw_record` (full payloads OK) + typed master merge (N-087c)
- Fan-out workers: write only own `brain/data/staging/<family>.sqlite3`; serialize `merge_staging_to_master` + HA index rebuild (no concurrent master writers)
- **strain-database.com**: Cloudflare human check (HTTP 403) — authenticate in browser at https://strain-database.com/strains then re-run scrape_strain_directories.py --dir strain_database
- **2026-08-08 strain-database.com**: Script ready (`scripts/scrape_strain_database.py` + `lineage_to_mermaid.py` → dump `dsc_strains_straindatabase.json` + staging `strain_database.sqlite3` full raw + `lineage_mermaid`). HTTPS scrapers still get CF 403. Cookie path: pass CF in normal Chrome → **close Chrome briefly** (Cookies DB is exclusive-locked while Chrome runs) → `python scripts/chrome_cookies_for_domain.py` (writes `homeassistant/data/_strain_database_cookies.json` + scraper jar) → `python scripts/scrape_strain_database.py --import-chrome-cookies --stage`. Or: copy `%LOCALAPPDATA%\Google\Chrome\User Data\Default\Network\Cookies` manually and pass `--cookies-db`. Never use chrome://.
- Leafly / Weedmaps / Wikileaf live HTML bot-walled; use local Leafly dumps
- Attitude Seedbank domain parked (HugeDomains); North Atlantic live HTML HTTP 403 (local dump ~2959 still usable); Alchimia list regex was wrong — real PDPs are `*-product-N.php` via `en/sitemap-products.xml` (5433 locs; Cannabis seeds filter → **3098** in `dsc_strains_alchimia.json` + `brain/data/staging/alchimia.sqlite3`, `scripts/scrape_alchimia.py`, redistributable=false)
- Forum thread scrapes: first-pass XenForo public scrape done via `scripts/scrape_xenforo_forums.py` — 420mag 400 / phenohunter 400 / mjpassion 300 → `dsc_forum_*.json` + `brain/data/staging/forum_*.sqlite3` (no invented chem; chemistry_profile=0). Resume via checkpoints. CF-walled forums still pending auth (THCfarmer/ICMag/Grasscity/UK420/etc.)
- **2026-08-08 storefront/forum discovery probe** (`scripts/_probe_storefront_forum_discovery.py` → `homeassistant/data/_probe_discovery_2026-08-08.json`): many bank configs wrongly assumed Shopify `/collections|products/`. WooCommerce `/product/` ready: DC Seed Exchange (~1k sitemap), Multiverse Beans (**full product-sitemap1–17 ≈ 2986** PDPs, not just sitemap1 ~200), Weed Seeds Express (sitemap-en ~364 `/product/`). Crop King product-sitemap ~997. Seedsman list 404/SPA but USA sitemap `us-en/{slug}` works (~1.7k+ truncated). Greenhouse catalog is `shop.greenhouseseeds.nl` (not marketing root). Dead/DNS: Beaver, Organic Earth; Growers Choice coming-soon. Forums public high-yield: 420 Magazine, Phenohunter, Marijuana Passion; CF 403: THCfarmer/ICMag/Grasscity/UK420/etc.
- **Seedsman USA fan-out (2026-08-08):** list routes 404/SPA; scrape path is sitemap → GraphQL PDP (`urlResolver`→sku→`products`). Script `scripts/scrape_seedsman.py` → dump `dsc_strains_seedsman.json` (**2206**, redistributable=false) + staging `brain/data/staging/seedsman.sqlite3` (raw_record **2206**, grow **2101**, chem **1413**, attribute_kv=0). Sitemap PDPs 2389; prefilter merch ~61; skipped product_empty 39 / resolver_miss 87 / not_seed 1. HTML shell empty (ScandiPWA); `seeds_effect_filter` unused (effects=0). Do not use old list-page bank config in `scrape_seed_banks.py` for Seedsman.
- Woo bank fan-out scraper: `scripts/scrape_wc_seed_banks.py` (Multiverse + Weed Seeds Express → dumps + `bank_multiverse` / `bank_weedseedsexpress` staging)
  - **Weed Seeds Express**: dump **364** / staging raw_record **364** (`sitemap-en.xml`; redistributable=false)
  - **Multiverse Beans**: sitemap **2986** locs → live dump **1452** (skipped_404 **1530** stale sitemap); staging raw_record **1452**; thin chem on PDP (lineage/breeder-rich)
- **Crop King + DC Seed Exchange fan-out** (`scripts/scrape_cropking_dcseed.py` + `_resume_bank_scrape.py` batches): sitemap-first. Dumps `dsc_strains_{cropking,dcseedexchange}.json` + staging `{cropking,dcseedexchange}.sqlite3` FULL `raw_record`; redistributable=false. Host kills long runs ~15m — use batched resume (`--batch-limit`). Later merge via `merge_staging_to_master.py --only cropking,dcseedexchange`. Crop King has 4 product sitemaps (~3990 PDPs), not only sitemap1’s ~997. DC WooCommerce `/product/` (~1654). Checkpoint saves use atomic `.tmp` replace.
- DoltHub marijuana_data API 400; WA aggregate SQL timed out (local Replication_Data is SoT)
- Concurrent NAS SQLite writers cause lock storms — serialize ingest/link/index jobs
- Re-ingest needed for post-scrape dumps if first ingest saw empty shells: CannaConnection 200, Crop King 55 (Hytiva superseded 2026-08-08 — see below; Zamnesia/SeedSupreme/Herbies/ILGM/RQS full dumps superseded 2026-08-08 — see priority banks note)
- **Priority seed banks full sitemap scrapes (2026-08-08):** Expanded beyond smoke dumps (~40–50). Sitemap-first via `scripts/scrape_seed_banks.py` (Herbies/RQS/Zamnesia) + `scripts/scrape_bank_sitemaps.py` (ILGM/SeedSupreme). CREATE_NO_WINDOW launches; **no master merge**. Counts (dump = staging `raw_record`): Herbies **4142**/4142 → `bank_herbies.sqlite3`; ILGM **375**/375 → `bank_ilgm`; RQS **188**/188 → `bank_royal_queen`; Zamnesia **2299** (sitemap 2291 + resume extras) → `bank_zamnesia`; SeedSupreme **537**/537 → `bank_seed_supreme`. Transient timeouts/502s recovered on retry; no hard bot-wall aborts. Follow-up: staging `attribute_kv` still non-zero on these bank families (grow/chem typed OK) — trim KV on next staging ingest pass; merge via `merge_staging_to_master.py --only bank_herbies,bank_ilgm,bank_royal_queen,bank_zamnesia,bank_seed_supreme` when exclusive.
- **Hytiva fan-out #1 (2026-08-08):** `scripts/scrape_hytiva.py` → dump `dsc_strains_hytiva.json` (**3559**) + staging **`brain/data/staging/hytiva.sqlite3`** (raw_record **3559**, canonical **3529**, chem **1979**, grow **51**, **attribute_kv=0**, redistributable=false). Typed merge into master printed OK; post-merge `corpus_stats` hit master lock storm — re-run `python scripts/merge_staging_to_master.py --only hytiva --no-link --no-search` when writers are idle. Hybrid list still +25 at `--max-pages 200` (possible truncation beyond ~5k hybrids); one transient `WinError 10054` on `/strains/hybrid/royal-wappa` (retry in `_finish_hytiva.py`). No CF. Serialize master merges across fan-out workers.
- **DB DUMP inventory (N-087c read-only):** Cannabis Intelligence MIT imported — dump `dsc_strains_cannabis_intelligence.json` (15739) + staging `cannabis_intelligence.sqlite3` (canonical 14573 / variant 15394 / chem 4587 / grow 13175 / raw 15739 / `attribute_kv=0`); master merge landed source + chem 4587 + grow 13175 + links 4587 (variant `source_id` counts may drop if later merges overwrite the same `name_norm::breeder` id). North Atlantic via `import_strains_northatlantic.py`; Leafly flat over-slimmed (re-enrich allowlist, never full `attribute_kv`); parquet train vision blobs — skip; MaxValue terpenes already imported.
- **Phytochem Smith lab (discovery fan-out #1):** `import_lab_phytochemical_diversity.py` → dump `dsc_lab_phytochemical_diversity.json` (full rows + terpene panels) + staging `brain/data/staging/phytochem_smith.sqlite3`; master merge = one `chemistry_profile` per `strain_slug` with rich `payload_json` (no `attribute_kv` column explosion). NAS space is ample — maximize staging/dumps.
- **Fan-out lock storm (2026-08-08):** concurrent staging merges on `dsc_brain.sqlite3` over SMB caused `database is locked` / silent hung connects; phytochem dump+staging completed (89923 raw / 3087 chem) but master merge must be serialized (`merge_staging_to_master.py --only phytochem_smith` or priority merge ORDER entry).
- **Leafly flat re-enrich (2026-08-08):** `scripts/enrich_leafly_flat.py` → staging `brain/data/staging/leafly_flat_enrich.sqlite3` (**106.8 MB**; raw_record **8492** full JSONL rows; chem **8482**; science_alias **8492**; **attribute_kv=0**). Master `payload_json` carries full non-null effect/flavor score dicts + terpene panel + cannabinoid percentiles (not KV). Master apply pending lock clear: `python -u scripts/enrich_leafly_flat.py --apply-from-staging`.
- **CannaReviews AU (2026-08-08):** `scripts/import_cannareviews_health.py` scrapes sitemap PDPs (JSON-LD + Livewire aggregates). Export APIs (`/api/v5.2.1/products/export|bulk|data/download`) are honeypots (202 → forever-processing progress). Full AUD prices + review text need medauth cookie (`--cookie`); `/products` is login-walled. Rate-limit (HTTP 429) if workers>~3 — use `--resume --workers 1 --delay 0.8`. Staging family `cannareviews`.

- **2026-08-08 strain-database Chrome cookies (ABE):** Cookies DB unlocks after full Chrome quit (Default`Network\Cookies` copyable; Profile 1 + legacy `Default\Cookies` absent). SQLite has 4 host rows (`cf_clearance`, `age_verified`, `sdb_vseed`, `techaro.lol-anubis-auth`) but decrypt fails `InvalidTag` — Local State has `app_bound_encrypted_key` (v20 ABE). `browser_cookie3` / plain DPAPI / `decrypt-cookies` (Access denied) cannot unwrap. Jar `cookie_count=0`; scrape exits before PDP; bare HTTPS PDP still **403** CF interstitial. Need ABE-capable export (elevation COM as Chrome) or non-Chrome cookie capture — quit-Chrome alone is no longer sufficient.
- **2026-08-08 strain-database alternate auth (worked):** Playwright `channel=chrome` + fresh `user_data_dir` (headed). Headless retriggers CF. `cf_clearance` jar alone fails in curl_cffi (TLS-bound). Path: `python scripts/_pw_strain_db_capture.py` then `python -u scripts/_pw_scrape_strain_database.py --limit=100 --headed` → dump + `brain/data/staging/strain_database.sqlite3`. **Cookies.txt fallback:** Chrome extension “Get cookies.txt LOCALLY” → export `strain-database.com` → `homeassistant/data/dsc_strains_straindatabase.cookies.txt` (Netscape); scraper loads it (UA/TLS may still fail — prefer Playwright). Never chrome://.

- **2026-08-08 strain-database Chrome v20 cookies**: `chrome_cookies_for_domain.py` finds 4 host rows (incl. `cf_clearance`) but decrypt fails (`v20` + `app_bound_encrypted_key` / IElevator `DecryptData` ACCESS_DENIED for non-chrome.exe). Exported jar via Playwright profile `%LOCALAPPDATA%\Temp\dsc-chrome-fresh-pw` works in-browser; `curl_cffi` still 403 (CF clearance TLS-bound). Prefer headed Playwright scrape for this source until ABE export is fixed or scrape stays in-browser.
- **2026-08-08 strain-database resume blocked (post-429):** Checkpoint/staging at **n=70** / 5000 EN (`brain/data/staging/strain_database.sqlite3` raw_record=70). After rate-limit storm, headed Playwright CF challenge briefly shows “Just a moment…” then collapses to `chrome-error://chromewebdata/` (`net::ERR_HTTP_RESPONSE_CODE_FAILURE`). Soft-navigate after that error makes it worse — catch and leave challenge HTML. Do not expect urllib/curl_cffi alone. Never chrome://.
- **2026-08-08 StrainDB paused by user:** Stop all scrape/probe traffic so CF can unlock. Early pause was n≈70; later warm progressed then re-paused. **Resume only on explicit ask.** When resumed: headed Playwright path only, polite delay (prefer **8–20s** jitter per pause file), checkpoint often; no urllib/curl_cffi-alone, no chrome://, no auto cool-down resume.
- **2026-08-09 StrainDB still paused:** `_pw_strain_db_PAUSE.txt` status=PAUSED_CF at **n=213**; `resume_after` was 2026-08-08T18:39+10; shepherd/scrape PIDs dead; not resumed. `save_cookies`/storage_state already try/except (non-fatal). Still needs CF pass / cookie re-import before headed resume — no tight retry.

## Staging→master serialize pass (2026-08-08)

### red-flag
| ID | Item | Notes |
|---|---|---|
| F-N087-LOCK | Multi-agent master SQLite contention | Concurrent `merge_staging_to_master`, nuclear PowerShell `Stop-Process` watchdogs, and NAS SMB locks killed serialized merges mid-txn (RC -1 / network errors). Need a single exclusive merge lease (file lock + no foreign killers). **2026-08-08:** `north_atlantic` staging ready (2953; prefer over `north_atlantic_local` 3043) — merge blocked after 10+ retries; master has `source_record` `northatlantic` but **0** variants/grow. **2026-08-09:** exclusive sole-writer+shepherd is the lease — keep parallel writers off; north_atlantic still in remaining queue. |
| N-087-MERGE-LINK-NAS | Exclusive merge: per-family link on NAS | **Done 2026-08-09 (mitigated):** seedsman NAS link stalled (WAL ~257MB, ~0% CPU); killed at typed boundary; finished via local-SSD `--no-link` + one end-link. See afternoon snapshot below. |
| N-087-MERGE-NOLINK | Post-family: `--no-link` + one link pass | **Done 2026-08-09:** wrapper/resume `--no-link`; commit-after-link; set-based link; `--link-only`; local-SSD runner. End-link + indexes OK. |

### deferred
| ID | Item | Notes |
|---|---|---|
| D-N087-REMAIN | Finish priority families | **Done 2026-08-09:** local-SSD exclusive drained 207-family plan (ok=205 + 2 already-OK); indexes rebuilt. |
| D-N087-BATCH | merge_staging batch inserts | Added `executemany` batches + `PRAGMA synchronous=NORMAL` in `merge_staging_to_master.py` to survive NAS latency; keep. |


- **Master SQLite lock contention (2026-08-08):** concurrent merge agents on NAS dsc_brain.sqlite3 caused long locks and intermittent process deaths (EXIT=-1) while waiting; forum merges eventually succeeded in a short unlock window. Consider a single-writer merge queue / lockfile before more fan-out merges.


- Windows agents must launch Python with CREATE_NO_WINDOW / `scripts/_win_no_window.py` / pythonw — Temp `alc_*waiter*.py` consoles steal fullscreen focus.

- **Windows console spam (2026-08-08):** Agents + Scheduled Tasks (DSC_AlcLocal, DSC_CR_*, DSC_Alc*) kept launching Temp `alc_*waiter*.py` / `alc_immediate.py` / `cmd /K` bats as visible `python.exe` consoles (file-DONE / quiet / proc waiters). Unregistered those tasks; stub-locked Temp waiters; disabled `dsc_ce_merge/*.bat` and phyto `launch_*.bat`. Do **not** spawn companion waiters — use in-shell wait or `CREATE_NO_WINDOW` / `pythonw` / `scripts/_win_no_window.py` only.

## 2026-08-08 — master SQLite corruption under concurrent SMB merges
- Live `brain/data/dsc_brain.sqlite3` hit `database disk image is malformed` / `btreeInitPage error 11` during overlapping staging merges (cannaconnection atomic, phytochem CLI, cannabis_intelligence, leafly unlock apply, serialize exclusive).
- Healthy local artifact with phytochem applied: `%TEMP%\dsc_phyto_merge_work\master_local.sqlite3` (quick_check=ok, chem=359252, phytochem_smith=3087).
- `scripts/merge_staging_to_master.py`: commit leftover txn before `PRAGMA synchronous` (Python 3.14 / connect meta upsert).
- Do not run parallel writers against master on SMB; serialize merges; prefer local merge then short apply, or single exclusive holder.
- [x] **Master merge contention (2026-08-08 → exclusive):** Sole-writer exclusive lease running (`_n087_exclusive_merge.py` + shepherd). Parallel writers must stay off master. **2026-08-09:** CannaReviews merged OK in exclusive queue; phytochem link died on NAS disk I/O (see N-087-MERGE-LINK-NAS). Still prefer local-SSD merge or `--no-link`+one link for remaining families.

## 2026-08-08 — prioritized seed-bank scrape pass

### soak
| ID | Item | Notes |
|---|---|---|
| S-BANK-RESUME | Priority bank scrapes | **2026-08-08 done (no master merge):** Crop King 3990, Herbies 4142, True North 2903, Zamnesia 2299, DC Seed 1654, SeedSupreme 537, ILGM 375, RQS 188 + Wave2 breeders. **Pacific HARD_BLOCK** 275/915 (HTTP 429×200) — resume later delay≥2s. Report: `homeassistant/data/_bank_scrape_logs/final_report.json`. |
| S-WAVE2-NEW | Wave 2 new breeders (dump+staging done) | Merge-paused Wave 2 (plan **Wave B**): extended `scrape_bank_sitemaps.py` + `SOURCE_FAMILY_MAP`. Launched via `scripts/_launch_wave2_banks.py` (CREATE_NO_WINDOW). **Done dumps+staging (raw_record full; no master merge):** Fast Buds **120** → `bank_fastbuds.sqlite3`; Barney's Farm **111** → `bank_barneys.sqlite3`; Green House shop **69** → `bank_greenhouse.sqlite3`; Mephisto **356** → `bank_mephisto.sqlite3`; DNA Genetics **85** → `bank_dna.sqlite3`; Dutch Passion **171** → `bank_dutchpassion.sqlite3` (**912** new items). StrainDB skipped (paused). |
| S-WAVE3-LIGHTS | Wave 3 lights/PPFD dumps+staging | Merge-paused Wave 3 (plan **Wave C**): rebuilt missing `dsc_lights_*.json` via `scripts/scrape_grow_lights.py` + Vivosun importer; staging `lights_*.sqlite3` + `ppfd_maps.sqlite3` only (**no master merge**). Counts: Spider Farmer **273** (ppfd rows 120), Mars Hydro AU **134** (37), Grow Kings **182**, ViparSpectra **19**, Treegers **12**, Vivosun **22**, Digi-Lumen carve **15**. PPFD archival: processed **200** / ok **194** → `homeassistant/data/media/ppfd/` (~614 files / 203 crops). Photometrics pack rebuilt (5 fixtures). |

### deferred
| ID | Item | Notes |
|---|---|---|
| D-BANK-DEAD | Unusable priority storefronts | Beaver / Organic Earth DNS fail; Night Owl / MSNL DNS fail; Great Lakes / Neptune empty shells; Growers Choice empty sitemaps; Oregon Elite WP without product-sitemap; Attitude domain parked / no usable sitemap; Quebec not WC/Shopify products.json. Revisit only with browser/manual discovery. |
| D-BREEDER-URLS | 1482 inventory lacks official URLs | Phase A queue `homeassistant/data/_breeder_scrape_queue_1482.json` used known-map + domain guesses; many Tier C/D are unresolved or wrong-host. Need Seedfinder-homepage harvest (CF/403) or curated URL map before treating C as scrapeable. |
| D-TIERA-FALSEHOST | Tier A host false-positives | Ranked `tiers.A` still includes wrong hosts (parked/hugedomains, unrelated brands) and already-covered banks (e.g. `DNA Genetics Seeds` → dnagenetics.com already `bank_dna`). Partition scrapers skip hugedomains + skip re-staging DNA into `bank_dna`. Tighten classifier host↔name match before treating A count as scrapeable. |
| S-TIERA-HALF1 | Tier A first_half / 1482-breeder scrape | **2026-08-09 probed DONE** (PIDs dead): `_tier_a_half1_results.json` updated 2026-08-08T09:55Z — attempted **96** / succeeded **68** / items **13343**; statuses ok 68 / skip_empty_catalog 19 / empty_after_scrape 8 / skip_discover_fail 1. Dump+staging only; merge deferred into exclusive queue. Earlier mid-run note (~Freedom/blim-burn) superseded. |
| S-TIERA-2ND | Tier A second_half scrape | **2026-08-09:** results mark `complete=true` — banks 96, items **2806**, ok 38 / thin 17 / empty 34 / skipped_dead 7 (`_tier_a_second_half_scrape_results.json`). Dump+staging only; no master merge. |
| D-BANK-RATE | Pacific 429 / DC Seed 503 | Pacific Seed Bank rate-limited hard (200×429) — keep delay ≥1.0s. DC Seed Exchange bursts 503 — keep delay ≥1.25s and retry failed URLs on resume (do not mark 503 as skipped). |
| D-LIGHT-MAPS | Thin photometric map URLs | ViparSpectra + Vivosun dumps still **0** keyword-labeled PPFD/spectrum map URLs after PDP enrich (JS/CDN unlabeled). DigiLumen D2C not productized — GK carve only (ppfd=0). Spider Farmer sitemap ~317 locs → dump **273** (non-PDP / duplicate locs). Resume map chase with brand HTML galleries / datasheet PDFs when merge window returns. |

## 2026-08-08 — thin-field expansion (N-087; exclusive merge now running — see 2026-08-09 snapshot)

**Assessed thinness (staging samples; no invented chem):**
- **grow_trait height (cm):** still weak globally — Leafly enrich heights are categorical only (`Short`/`Medium`/`Tall`, n≈355); Seed City / CannaConnection / RQS / Seedsman better for numeric grow.
- **flowering days:** better on bank PDPs + Leafly enrich (`grow_floweringDays` ≈3.2k non-null after projection).
- **lineage/parents:** Leafly enrich `parent_slugs` ≈5.3k; SeedFinder stalled CF ~10.3k/40638 (2026-08-09); StrainDB paused n=213; Multiverse/Alchimia lineage-rich; OpenTHC identity-only.
- **effects:** Leafly enrich ≈7.3k scored; Kushy + `leafly_github` + `medical_effects` help; Seedsman effects=0.
- **terpenes:** MaxValue + Cannlytics + phytochem + Leafly enrich panels; labs ≫ seed grow.
- **science↔seed:** 70 chem gaps remain ([`CATALOG-SCIENCE-SEED-LINKS.md`](qa/CATALOG-SCIENCE-SEED-LINKS.md)); OpenTHC/Kushy identity helps matching, not chem invention.
- **forums:** only 3/35 scraped (420mag / phenohunter / mjpassion).
- **name-only thin:** `cannia`, `strains_master`, `pickle_archive`, OpenTHC (names/type).

### shipped this pass (dump/staging only — NO master merge, no StrainDB)
| ID | Item | Notes |
|---|---|---|
| N-087-THIN-STAGE | Missing high-signal dumps → staging | Staged existing dumps: `openthc`, `wikileaf`, `kushy` (chem+effects+links), `lynch_figshare`, `leafly_github`→`leafly_flat`, `maxvalue_terpenes` |
| N-087-THIN-GROW | Leafly grow projection | New `brain/data/staging/leafly_flat_grow.sqlite3`: **7889** `grow_trait` (flowering≈3224, parents≈5355, effects-in-payload≈7351; height band Short/Med/Tall in payload — not fake cm) |
| N-087-THIN-CSV | Fresh GitHub CSVs | Re-fetched MaxValue `results.csv` + Wikileaf `ALL_data.csv` → dumps + staging refresh; discovery log `dsc_thin_field_discovery_2026-08-08.json` |

### deferred / punch-list (found, not fully ingested)
| ID | Item | Weak fields helped | Notes |
|---|---|---|---|
| D-N087-MENDELEY | Mendeley 800+ effects+chem (`6zwcgrttkp/1`) | effects, terpenes, science↔seed | **2026-08-08:** landing OK but DOI/`plu.mx` + login UI; **no credentials → skipped**. Needs manual authenticated download then dump+stage |
| D-N087-SDP | Strain Data Project | terpenes | Research site reachable; no bulk CSV URL confirmed |
| D-N087-MA-CCC | MA CCC open testing CSVs | lab chem (THC); rarely terpenes | **2026-08-08 audited:** Strain unusable — 2024 Strain blank (~440k), 2021–23 anonymized `Strain_N`, 2025 no Strain col; terpenes absent. Status dump `dsc_lab_ma_ccc.json` (verdict `no_usable_strain_names`). Prefer Cannlytics MA expand or future CCC release with names |
| D-N087-FORUM4+ | Forums beyond 3 | grow anecdotes, flowering/height notes | **Partial ship:** Rollitup **349** → `dsc_forum_rollitup.json` / `forum_rollitup.sqlite3`; OZ Stoners IPS search-pass **29** → `dsc_forum_ozstoners.json` / `forum_ozstoners.sqlite3`. **Skip:** Sensi `forum.sensiseeds.com` redirects to marketing (no XF boards). **CF 403 after retry:** Growery. Timeout still: Autoflower, OpenGrow. Prior CF: THCtalk/THCfarmer/ICMag/Grasscity/UK420 |
| D-N087-GREENHOUSE | Greenhouse EU shop | flowering, height, yield, lineage | **Shipped dump+staging:** sitemap+category crawl → **127** PDPs (`dsc_strains_greenhouse.json` / `bank_greenhouse.sqlite3`); grow_trait **118**; flowering_days **73**, height_cm **59**, parents/lineage **46**, effects **97**. Sitemap still ~541 locs but majority merch/non-PDP |
| D-N087-BANKS-THIN | Neptune / True North / Pacific / Quebec | grow + lineage | Storefronts reachable; Neptune shell thin; True North/Pacific already in bank scrape soak; Quebec not WC/Shopify products.json |
| D-N087-WAYBACK-SF | Wayback SeedFinder CDX | lineage | **Left deferred** — CDX probe OK; bulk recover still needs ToS/legal plan (do not scrape) |
| D-N087-CT-LABS | CT Open Data / Cannlytics xlsx-only states | terpenes/lab | CT portal search; WA/CT/CO xlsx-only 404 on HF CSV path — separate importer |
| D-N087-JMIR-LEAFLY | JMIR Formative 2026 Leafly reviews dataset (~7037) | effects over time | CC-BY paper claims repo dump — locate DOI/repo and stage if redistributable |
| D-N087-WIKILEAF-NLP | Wikileaf `info`/`more_info` NLP | flowering/height from free text | ≈303/2793 rows mention grow words; parse carefully, never invent numbers |
| D-N087-HEIGHT-BAND | Leafly height bands | height (ordinal) | **Done 2026-08-09:** projected 355 Short/Med/Tall → staging `leafly_height_bands` (family map fixed; no invented cm); merged `--no-link` (master grow_trait 89235→89590). |
| D-N087-MERGE-LATER | Serialize merge of new families | all above | **2026-08-09:** exclusive sole-writer running (seedsman [4/207]). Remaining thin-field families (`leafly_flat_grow`, `openthc`, `wikileaf`, `kushy`, `lynch_figshare`, refreshed `maxvalue_terpenes`, **`bank_greenhouse`**, **`forum_rollitup`**, **`forum_ozstoners`**, …) should already be in / feed the 207-family plan — do not start parallel merges. Prefer `--no-link` switch (N-087-MERGE-NOLINK) before burning more full-link hours. |
| D-GH-SITEMAP | Greenhouse shop coverage | Was 69 PDPs; now **127** via climate-zone category crawl + deeper `product_re`. Further fan-out limited (autoflowering/regular roots 404; board pages JS). |
| D-OZ-IPS-BOARDS | OZ Stoners forum boards | `?forumId=N` HTML is empty shell (JS); first-pass used `/search/?q=…&type=forums_topic`. Browser/API needed for full Grow Rooms board crawl |

### 2026-08-08 continuation (dump/staging ONLY — no master merge, no StrainDB, CREATE_NO_WINDOW)
| Path | Count / stats |
|---|---|
| `homeassistant/data/dsc_strains_greenhouse.json` | **127** (was 69); flowering **73**, height_cm **59**, parents/lineage **46**, effects **97**, yield_outdoor **67** |
| `brain/data/staging/bank_greenhouse.sqlite3` | canonical **109** / grow_trait **118** / chem **100** / raw **127** |
| `homeassistant/data/dsc_forum_rollitup.json` | **349** threads; grow_notes rich; explicit flowering/height rare in OP text |
| `brain/data/staging/forum_rollitup.sqlite3` | canonical **345** / raw **349** / chem **0** (no invented) |
| `homeassistant/data/dsc_forum_ozstoners.json` | **29** IPS topics (search discovery) |
| `brain/data/staging/forum_ozstoners.sqlite3` | canonical **29** / raw **29** |
| `homeassistant/data/dsc_lab_ma_ccc.json` | status-only; `usable_named_strain_rows=0` |
| Skipped | Mendeley (DOI/login); Wayback SeedFinder (ToS); Sensi forum (dead); Growery (CF 403) |

## 2026-08-08 — HA config warnings (sensor_cal + EVT autofix)

### done
- **Package `dsc_v4_sensor_cal` “duplicate key `alias`”:** UI-managed `/config/scripts.yaml` also defined `dsc_pots_reset_peer_captures` (same entity as the package). HA package merge fails when both declare `alias`. Removed the UI copy; package is SoT. Do not re-save that script from the UI.
- **Repair “EVT autofix … unknown action”:** issue was `service_not_found_input_text.set_value` attributed via nested script; also wrong follower entity_ids (`automation.dsc_follower_*` vs live `automation.dsc_hub_*_follows_*`). Fixed in `dsc_v4_fleet_heal.yaml` (helpers before script, `action:` syntax, correct entity_ids).

### next-plan / soak
| ID | Item | Notes |
|---|---|---|
| N-HA-UI-DUP | Cull other UI↔package collisions | Repair registry still has `validation_failed_blueprint` on several `dsc_hub_*_follows_*` automations — likely old UI/blueprint copies; confirm after soak and delete UI dupes if present |
| N-HA-EVT-REPAIR | Dismiss stale EVT repair after reload | After core restart, ignore/repair-dismiss if issue persists as stale |

## Custom panel surface 6.0.0 (2026-08-08)
- React+Vite panel at `/dsc-hub` (`custom_components/dsc_hub`); Lovelace `dsc-hub-pro` sidebar hidden.
- Legacy Dash/catalog/build cards mount via `LegacyCardHost` — need `/local` Lovelace resources still registered for those elements.
- Build tip: `npm` on NAS share can stall; build on local disk then copy `www/dsc-hub-panel.js`.
- Add-on `dsc-hub-sync` patched to stage `custom_components/dsc_hub` (rebuild add-on image to pick up).

## Custom panel surface 6.1.0 (Pass 2)
- WS `state_changed` subscription + history-seeded charts; dense Ops Home; Climate CFM; `/local` card autoload.
- Build: `pwsh -File scripts/build-dsc-hub-panel.ps1`.
- Deferred to Pass 3: native React Catalog/Build; brain HTTP client; Lovelace YAML removal.

## 2026-08-08 — catalog collation contract remembered

### done
- Durable architecture written: [`docs/qa/CATALOG-COLLATION-CONTRACT.md`](qa/CATALOG-COLLATION-CONTRACT.md) (grow notes as documents, reviews→collate→wordcloud, lineage via `entity_link`, three layers, merge order).
- Pointers: N-087 / **N-087-COLLATION** above; link from [`CATALOG-RESEARCH-CORPUS.md`](qa/CATALOG-RESEARCH-CORPUS.md); merge one-pager `brain/data/_COLLATION_CONTRACT_FOR_MERGE.txt`.
- Schema skim: no observation/review tables yet; no systematic parent_of/child_of emit; wordcloud deferred — gaps only, no refactor mid-merge.

- [x] **StrainDB `save_cookies` crash** (fixed 2026-08-08): `Session.save_cookies` now normalizes jar via `_cookies_as_map` (handles str keys / Cookie objs / `get_dict`) and never raises. Warm n=140 finalize no longer dies on cookie write; storage_state save also guarded.
- [x] **StrainDB CF / cookie re-import** — **CLOSED_NO_MORE_SCRAPING 2026-08-11** (superseded; do not resume). Was paused at n≈213 (`_pw_strain_db_PAUSE.txt`); CF/cookie unlock no longer an active chase.

## 2026-08-09 — N-087 / catalog status snapshot (probed morning AEST)

### exclusive merge (master `dsc_brain.sqlite3`)
| ID | Status | Notes |
|---|---|---|
| N-087-EXCL | **done (local-SSD)** | Finished 2026-08-09 afternoon AEST via `_n087_local_ssd_merge.py`. Stalled seedsman NAS link killed at typed boundary; remaining 205 families `--no-link` on local SSD; one end-link + indexes; master copied back (`dsc_brain.sqlite3.pre_local_ssd` bak). Summary: ok=205 fail=0 skipped_already_ok=2; canonical≈181473 chem≈602737 entity_link≈2752186 grow≈89235. |
| N-087-MERGE-LINK-NAS | **done (mitigated)** | Per-family full-chem link abandoned. Wrapper/resume pass `--no-link --no-search`; `merge_staging_to_master` commits after link; `--link-only` + set-based `link_science_to_seed`; force flag `_n087_force_no_link.flag` for live children. End-link added **1.61M** variant edges in ~164s on local SSD. |
| N-087-MERGE-NOLINK | **done** | See above; exclusive + resume scripts updated. |
| N-087-COLLATION | **done (v4 + debt + match-expand)** | Schema v4; parent_of + subtype_of; junk/tree quarantine; observations≈71k; review=0; thin chase doc. Local `C:\DSC\collation\`; baks `pre_collation_v4` / `pre_collation_debt` / `pre_match_expand`. |
| N-087-DENSIFY | **done (+ full staging drain)** | Local staging 264/268; obs≈126k; alias≈26.7k; height≈13.9%; SF merged+linked. Next scrape chase only: [`CATALOG-THIN-FIELDS.md`](qa/CATALOG-THIN-FIELDS.md). |
| N-087-MASS-MERGE-MATCH | **done (saturated 2026-08-11)** | NAS→local staging copy (268 DBs, never clobber richer local); mass `--no-link` merge; match loops until 0; link-only; HA indexes; NAS copy-back byte-equal. Corpus: canonical **195266**, links **3298344**, height_cm **60290** (~52.3%), alias **29858**, subtype_of **9983**. Height projectors fixed to fill all duplicate `name_norm` rows. Orchestrator: `scripts/_mass_merge_and_match_saturate.py`. |
| N-087-OFFLINE-EXTRA | **done 2026-08-11** | Flowering +40.7k; aliases +76.7k (Leafly/SF/OpenTHC/SKU); parent_of +34.3k; Wikileaf categorical chem rejected+purged; HA indexes 10k + curated Want enriched from brain. Scripts: project_flowering_days_from_text, project_external_id_aliases, project_leafly_parent_slugs, _offline_extra_saturate. |
| N-087-BACKUP | **done** | Durable `_BACKUP_N087_2026-08-08` (~9.5GB) present; earlier git backup commit fc8c4cc; plus `pre_local_ssd` bak before copy-back. |

### scrapes / corpus
| ID | Status | Notes |
|---|---|---|
| S-SEEDFINDER | **CLOSED (partial corpus)** | Operator 2026-08-11: **no more scraping**. PW stopped at **26390/40638** after CF/500. Quiet-merge `--no-link` landed on local (+link-only); local master ahead then copy-back. Do not relaunch SF. |
| S-STRAINDB | **CLOSED (~359)** | No more scraping. Parked HTTP-fail corpus kept as-is; do not relaunch. |
| S-MEDAUTH | **CLOSED (+94 bodies)** | No more scraping. Keep 94 review bodies already imported. Ingest server stopped. |
| S-BANK-DESC | **CLOSED** | Herbies 3986/4142 · Zamnesia 2299 · RQS 188 · SeedSupreme 31 done; Seedsman leftover empty. No further bank PDP enrich. |
| S-WAVE-D | **CLOSED (expanded)** | Apex + TG + GK + HW staged. Nutrients **867** / mediums **321**. No further Shopify brand scrapes. |
| S-TIERA-HALF1 | **done (dump/staging + merged)** | Was dump+staging; now included in local-SSD exclusive queue. |
| S-TIERA-2ND | **done (dump/staging + merged)** | Was dump+staging; now included in local-SSD exclusive queue. |
| Bank/forum dumps | **merged** | Priority banks + Wave2 + forums + thin-field families drained via local-SSD exclusive (207 plan). |

### open punch (merge speed / honesty)
- [x] After seedsman (or next safe boundary): exclusive wrapper → `--no-link` for remaining families + one link pass; commit-after-link under `--no-search`.
- [x] When exclusive idle: verify phytochem_smith chem/links on master; re-merge with `--no-link` if typed rolled back after disk I/O FAIL. (chem was **0** on copy; re-merged OK on local SSD.)
- [x] SeedFinder: Playwright resume shipped + running (urllib abandoned for CF).
- [x] StrainDB: Chrome CF capture + headed resume — then **re-paused CF** at n≈289; needs fresh operator unlock.
- [x] D-N087-HEIGHT-BAND: staging + master merge (`--no-link`); ingest accepts `height_band` / nested `grow`.
- [x] **2026-08-10:** StrainDB deferred (CF); SeedFinder continues as side task; catalog work proceeds on current master (~181k canonical).
- [x] When SeedFinder quiet: `merge_staging_to_master.py --only seedfinder --no-link --no-search` (+ end-link if needed). StrainDB merge separate / later. **Done 2026-08-10** (orphan journal cleared; partial scrape ~22.8k variants).
- [x] Optional `--link-only` after SF typed merge — **done 2026-08-10** (+283k variant edges).
- [x] Promote high-frequency unresolved literals (≥5 edges) to exact canonicals — **done** (Ruderalys etc.; geo slips quarantined).
- [x] StrainDB: resume only on explicit ask after headed CF unlock (no tight retry). **CLOSED_NO_MORE_SCRAPING 2026-08-11.**
- [x] SeedFinder scrape resume for remaining ~18k sitemap entries (optional; master already has partial). **CLOSED_NO_MORE_SCRAPING 2026-08-11.**
- [x] Rebuild HA `dsc_strains_search_index.json` from densified master when convenient. **Done 2026-08-11** (cap 10 000 + nutrients/mediums/lights) after mass-merge saturate.

### tooling landed this pass
- [`brain/data/_n087_exclusive_merge.py`](brain/data/_n087_exclusive_merge.py) / [`_n087_exclusive_merge_resume.py`](brain/data/_n087_exclusive_merge_resume.py): `--no-link`, skip OK, end-link before indexes.
- [`brain/data/_n087_local_ssd_merge.py`](brain/data/_n087_local_ssd_merge.py): NAS bypass sole-writer path.
- [`scripts/merge_staging_to_master.py`](scripts/merge_staging_to_master.py): `--link-only`, force-no-link flag/env, commit after link.
- [`brain/dsc_brain/corpus.py`](brain/dsc_brain/corpus.py): set-based `link_science_to_seed`.
- HA indexes rebuilt: `homeassistant/www/dsc-catalog/dsc_strains_search_index.json` (cap 2500) + nutrients/mediums/lights.

## Fleet bring-up (2026-08-08 evening) — live status snapshot

- Bridge `192.168.86.66` online **5.2.0**; SoftAP up ch11; Anchor BSSID `58:2A:BD:60:3C:1D`; all 4 Sonoff API links True; **Hub ESP-NOW Link False** (no 0xD8/0xD1).
- Hub stub on HA now has `bridge_mac: 58:2A:BD:60:3C:1D`; `wifi_bssid` left `00…` so Nest OTA stays possible until ESP-NOW proves green, then lock SoftAP BSSID.
- Hub/Control currently unreachable on LAN (hub last ESPHome online ~16:07; control ~16:29). Needs power-cycle + ESPHome Install for hub to pick up `bridge_mac`.
- Pot3 absent from today's flash logs / no API on LAN. Pot1 API flaky.
- HA surface package on live still reports `6.0.0` while expected train is `5.2.0` (version chip drift) — separate from bridge path.

## Fleet recovery (2026-08-09) — secrets + 5.2.0 OTA pass

- **Secrets:** Lab ↔ HA `/config/esphome/secrets.yaml` fingerprints matched for all live device keys (API/OTA/AP/espnow/hosts). Only missing kit SoftAP `dsc_setup_ap_password` — appended from lab. Components `dsc_api_client` + `dsc_anchor_ap` present under `/config/esphome/components/`.
- **Repo:** pushed `4985431` — Sonoff FW sensor + Control branding → 5.2.0; lab hub `bridge_mac` → Anchor BSSID; fleet chip no longer compares HA surface 6.x to firmware train; `generate-secrets.sh` emits bridge/anchor/host keys. `dsc_v4_version.yaml` SCP’d to HA packages.
- **OTA done (ESPHome Device Builder):**
  - Hub `.23` → **5.2.0** (logs showed Firmware Version 5.2.0)
  - Control `.177` → OTA successful (API may take minutes to settle post-LVGL boot)
  - Heater `.32` / HeatMat `.85` / Humidifier `.26` / Dehumidifier `.69` → **5.2.0** (Sonoff project + FW sensor)
  - Pot1 `.47` / Pot2 `.22` / Pot4 `.49` → OTA successful
- **Still open:** Pot3 offline (no Install path); Bridge left as-is (already 5.2.0 online earlier); confirm `binary_sensor.dsc_bridge_hub_esp_now_link` after RF settle; optional Lock WiFi to Anchor BSSID once link green.
- **Do not** run `_patch_bridge_secrets.py` on live secrets (deterministic lab placeholders).

## Hub↔Bridge ESP-NOW never links (2026-08-09 afternoon)

**Symptoms:** `binary_sensor.dsc_bridge_hub_esp_now_link` stuck `off`; `sensor.dsc_bridge_esp_now_age` capped at `600000`; Control `panel_link` / pot ESP-NOW also dark. Secrets/cmd_tag/MAC were already aligned.

**Root causes (stacked):**

1. **Nest channel split (F-004):** Hub STA on Nest reported **ch2** (`RF|H|…|2|…|CHX`); bridge SoftAP/ESP-NOW was fixed on **ch11**. Packets never meet.
2. **SoftAP preference orphans hub:** Hub wifi lab preferred `DSC-Anchor` (prio 15/20) over Nest. SoftAP on ETH01 has **no LAN/NAT** → hub can associate SoftAP, lose `.23`, and vanish from HA while ESP-NOW still fails.
3. **ESPHome ESP-NOW `WIFI_IF_STA` on SoftAP-only bridge:** Stock `espnow` adds peers with `ifidx=WIFI_IF_STA`. SoftAP flips mode to APSTA after espnow LATE init — peers left on STA drop RF. `dsc_anchor_ap` now rebinds peers onto `WIFI_IF_AP` after SoftAP comes up.

**Actions taken:**

- Live + lab bridge `anchor_channel: "2"` (match Nest). Bridge OTA’d from local non-UNC build.
- SoftAP temporarily renamed **`DSC-Anchor-hold`** (kick SoftAP clients; restore `DSC-Anchor` after hub Nest priority is flashed).
- `dsc_anchor_ap.cpp`: rebind ESP-NOW peers → `WIFI_IF_AP` after SoftAP. SCP’d to `/config/esphome/components/`.
- Hub wifi lab: **Nest priority above SoftAP** (SoftAP fallback only). Needs hub Install once LAN is back.
- Lock WiFi left OFF; preferred BSSID set to Nest `C4:E3:CE:68:73:93`.

**Blocked:** Hub `.23` still unreachable after SoftAP hold + restart — **needs physical power-cycle**. Then: confirm Nest SSID + link; Install hub wifi-priority change; restore SoftAP SSID `DSC-Anchor`; re-verify `hub_esp_now_link`.

**Follow-up design debt:** SoftAP cannot be the preferred STA path until ETH01 SoftAP bridges/NATs onto Ethernet (or Nest is locked to SoftAP channel). Track under F-004/F-012.

## Hub↔Bridge continue (2026-08-09 16:40+)

- Hub returned on Nest; RF hopped **ch2 → ch11** (`RF|H|E2A|…|11|OK`). Bridge re-aligned to **ch11** and SoftAP SSID restored to `DSC-Anchor`.
- Channel match alone still left `hub_esp_now_link` off / age `600000` — SoftAP `APSTA` flip after ESPHome ESP-NOW STA init is the remaining RF killer.
- Attempted Nest STA join on bridge (so `WIFI_IF_STA` shares Nest with hub). That build **soft-bricked remote API/OTA** (ping OK, Noise/OTA EOF; HA last bridge update ~06:52Z). SoftAP-deferred (channel-pin only, no SoftAP/Nest STA) binary is compiled locally but **cannot OTA** until bridge is power-cycled (race) or USB-flashed.
- Hub still intermittent on LAN (50–100% loss) — keep power solid while flashing bridge.
- **2026-08-09 17:05 power-cycle:** 8× OTA race still failed (`Connected` then version handshake closed). Lab↔HA bridge API/OTA fingerprints still match. **USB serial flash required** — recovery bin staged at Desktop `dsc-bridge-recovery/` (`firmware.factory.bin` + README).


## SoftAP fleet home + enhanced Fleet Fix (2026-08-10)

**Decision (goal):** SoftAP DSC-Anchor is the Wi‑Fi home for Hub / Control / Sonoffs / **pots** so they **stop flapping across home APs** (that made ESP-NOW unusable). Pots SoftAP STA pins the same channel as the hub (ESP-NOW needs it); pot data volume is tiny so SoftAP cost is fine. Home Wi‑Fi is emergency fallback only. Spec: `docs/superpowers/specs/2026-08-10-softap-fleet-star-design.md`.

**Do not Nest-first as the steady state** — that reintroduces home-AP flap and nullifies SoftAP-home. SoftAP-primary membership is the product.

**Wifi YAML rules:** SoftAP prio > home Wi‑Fi; SoftAP entry pins Anchor BSSID `58:2A:BD:60:3C:1D` (`wifi_bssid` / `softap_bssid`); home Wi‑Fi has **no** BSSID pin; **never** `00:00:00:00:00:00`.

**SoftAP STA budget:** hub + control + 4 sonoffs + 4 pots = 10; bridge `max_connections` / `CONFIG_ESP_WIFI_SOFTAP_MAX_NUM_STA` = **14**. Pot SoftAP IPs: `.12`–`.15`.

**Hard gate for HA reachability (not for SoftAP preference):**
1. SoftAP SSID up; Anchor BSSID published.
2. Static SoftAP STA can ping SoftAP gw `192.168.4.1`.
3. Route `192.168.4.0/24 via 192.168.86.66` (bridge eth static `.66`).
4. Hub SoftAP-primary at `.4.10` answers HA API.

**Bridge notes:** SoftAP `WIFI_MODE_APSTA`, max STA 10, eth static `192.168.86.66`. Hub flash = **micro-USB** / HA USB Install; bridge = USB-TTL + IO0/EN.

**2026-08-10 thrash note:** Nest-first push `5893ea6` was wrong for the design goal; SoftAP-primary + real BSSID pin restored. Orphan/Fallback was SoftAP L3 + zero-BSSID pins, not SoftAP preference itself.

**2026-08-10 SoftAP join proved:** After USB Install SoftAP-primary, hub is on SoftAP **`192.168.4.10`** (ESPHome shows it). Do **not** treat Nest reservation **`192.168.86.23`** as the hub — that IP/MAC answers as **dsc-de-humidifier** (`84:0D:8E:51:D3:B9`). SoftAP radio/BSSID/ch11 OK.

**SoftAP L3 (2026-08-10):** **Proved.** LAN/HA ping `.4.1` + hub `.4.10` (MAC `84:1F:E8:16:E6:60` SoftAP STA, wifi_mode=APSTA). Root causes: (1) SoftAP lwIP before `wifi_start` + `L2_TO_L3_COPY`; (2) espnow STA clobber — SoftAP after espnow with **stop→APSTA→config→single start** (STA→APSTA+set_config double `AP_START` asserted); (3) never manual `esp_netif_action_start`. Bridge = **OTA `.66`**.

**Pots SoftAP (2026-08-10 evening):** SoftAP-primary pots for channel pin (low data). IPs `.12`–`.15`. Bridge max STA → **14**. OTA proved: pot1 `.12`, pot2 `.13`, pot4 `.15` (API/OTA). **Pot3** still absent on Nest/SoftAP. After bridge power-cycle, Control/Sonoffs SoftAP STAs may need rejoin time (or Nest fallback OTA bounce).

**Hub↔bridge ESP-NOW (2026-08-10 night):** SoftAP Wi‑Fi OK + pot→hub ESP-NOW OK, but `hub_esp_now_link` stuck off / age `600000` (no 0xD8/0xD1 on bridge). Root cause: SoftAP host misses STA **broadcast** ESP-NOW + peers needed on `WIFI_IF_AP`. Fix: hub unicasts 0xD8/0xD1 to SoftAP MAC; bridge forces hub+broadcast peers onto `WIFI_IF_AP`. **Proved 2026-08-11:** hub OTA from Nest `.55` → SoftAP `.4.10`; `hub_esp_now_link=true`, age ~1s.

## 2026-08-10 — subtype own-source chem/notes chase

- [x] Honest projector `scripts/project_subtype_chem_from_own_sources.py` (never copies parent photoperiod chem/notes onto auto/F2/bx subtypes).
- [x] Ran on local master `C:\DSC\collation\dsc_brain.sqlite3` + NAS via local work-copy/copyback. Summary: `C:\DSC\collation\_subtype_chem_own_sources_summary.json`.
- [x] `project_subtype_links.py` re-run: 0 new links (9703 subtype_of; 14333 base_missing still).
- **Coverage:** chem 7105→7129 (+24 staging typed); bank_note 4800→4952 (+152 staging raw). Still lacking chem **2574** / notes **4751** — no honest own-source left on disk.
- [x] **next-plan:** targeted F2/bx/auto PDP scrapes for remaining subtype chem/notes — **deferred under CATALOG-THIN-FIELDS no-scrape policy** (accepted thin gaps; not “chem filled”). SoftAP out of scope.

## 2026-08-10 — DSC-Dashboard visual inspiration

### done (2026-08-11 visual pass 6.2.0)
- Glass HUD tokens + Build result-first slide-out search + soil cross-section
- Plant Seat React page (soil / age / recipe / Got) + tent apply
- `input_select.dsc_potN_tent` + `script.dsc_apply_pot_to_tent`; Dash lerp + pot pick
- Ops Home / Root Zone / Strains wired to Plant Seat; surface **6.2.0**

### next-plan
- (none for this visual pass — live HA smoke + Sync deploy still operator-gated)

## 2026-08-11 — DSC-Dashboard operator polish 6.3.0

### done
- Dual-axis MultiLineChart (time axis, hover, sync pulse, Want band overlays)
- Per-tent Want editors (Main + Clone temp/RH/VPD) on Ops Home / Climate / zones
- ArcGauge target/band/extrema; real kPa VPD
- Full Auto + strategy/priority + fans + intake routing/RECIRC + kit in-service
- Theme/icons: seat SVG, PageHeader icons, chip/toggle icons, wordmark, search/settings/close, tokenized colors
- Dash world-anchored glass HUD + VPD mini + stronger bloom; Build connector glow
- Surface **6.3.0** (`const.py` + `dsc_v4_version.yaml` + panel chrome); panel rebuilt

### next-plan / soak
- Deploy via `ha-sync` / add-on; confirm live `sensor.dsc_ha_surface_version` = **6.3.0**
- Smoke Pass 3 checklist in `docs/qa/LIVE-UI-CUSTOM-PANEL.md`

## 2026-08-11 — F-004 SoftAP retarget (Nest-lock jam cleared)

- [x] HA `dsc_v4_fleet_heal.yaml`: CHX persistent notify + binary display name → SoftAP orphan / preferred mismatch (unique_id `dsc_nest_channel_split` kept). EVT CHX notify SoftAP wording.
- [x] `dsc_v4_alert_count.yaml`: dropped `dsc_wifi_preferred_ap_mismatch` from Home chip (same class as CHX — no double-count).
- [x] `dsc_v4_core_helpers.yaml`: Lock mismatch renamed SoftAP Lock Mismatch (unique_id stable).
- [x] Standing F-004 definition: SoftAP preferred-BSSID mismatch; Nest router lock remains OOS.
- [x] Deploy packages to HA + dismiss `dsc_f004_chx`; template reload refreshed SoftAP display names.
- [x] Hub flashed from HA ESPHome Device Builder **2026.7.4** → SoftAP `192.168.4.10` / `DSC-Anchor`; `hub_esp_now_link` on; Lock WiFi AP on.
- **Ops note:** Nest-orphan OTA needs temporary `use_address` / HA ESPHome entry host = Nest IP; after SoftAP rejoin set both back to `192.168.4.10` (package `dsc-hub-wifi-lab.yaml` hardcodes SoftAP `use_address`).

## 2026-08-11 — DSC-Dashboard Surface 7.0 rebuild

### done
- Primary IA → **Live / Grow / Tune / Fleet** (Ops/Plant/Advanced/System retired with redirects).
- Guided chrome: honesty rail, NextRecommended, PageHeader primary CTAs; Mission trimmed of Climate chart wall.
- Climate tent segment Main|Clone|Compare; Main/Clone ZoneBoard pages removed from nav.
- Twin keep-alive host (persist \dsc-the-dash-card\ — Lit+React overlay fitness **FAIL**; salvage = keep-alive + in-card HUD, not R3F this pass).
- Modern dark **full colour** tokens (blue/purple/green/teal); surface **7.0.0**.
- Grow Compose→Research→Roster; Tune Learning+Analytics; Fleet densify + map.

### next-plan / deferred
- R3F Twin rewrite still on the table if keep-alive + in-card HUD cannot hit inspiration quality after soak.
- Curated MDI-in-panel if custom SVG registry gaps remain on Mode/demand chips.
- Native React Catalog/Build (still Lit hosts); Lovelace YAML removal still deferred.
- Port remaining Lovelace Climate ladder / Learning cal wizard depth into Tune/Live.

## 2026-08-11 — Surface 7.1 prep freeze

### Inspiration pack (`docs/assets/inspiration/`)
- Existing: ops-dash-hud-vpd, ops-dash-climate-glass, build-a-plant-flow
- Added: mission-chip-strip(.png), mission-blip-wipe, mission-blip-ops-home, mission-online-ops, gemini-mission-modern, airflow-card-verify

### Entity freeze (recorder expected — default include, no DSC exclude found)
| Role | Entity |
|------|--------|
| Hub link | `sensor.dsc_hub_uptime`, `sensor.dsc_hub_heartbeat`, `binary_sensor.dsc_hub_panel_link` |
| Climate Got | `sensor.dsc_hub_tent_temperature`, `_humidity`, `_vpd_kpa`, `_room_temperature`, `sensor.dsc_hub_clone_*` |
| Want | `number.dsc_hub_target_temp`, `number.dsc_hub_rh_target_*`, `number.dsc_hub_vpd_target_*`, clone equivalents |
| CFM | `sensor.dsc_cfm_exhaust_{out,recirc}_allocated` (prefer) + nameplate `sensor.dsc_cfm_exhaust_{out,recirc}` |
| Pot Got | `sensor.dsc_pot{N}_got_{moisture,ec,ph}` fallback soil_*; `sensor.dsc_pot{N}_dryback_pct` |
| Identity | `text.dsc_pot{N}_plant_name`, `datetime.dsc_pot{N}_sprout_date`, `select.dsc_pot{N}_growth_stage`, `input_select.dsc_pot{N}_tent` |

### Visual tokens (7.1)
- Canvas: lifted indigo-slate; active chrome blue/cyan; green = live/ON only; stale = muted + HELD; kill dank `#39ff14` brand wash on Twin.

### Deferred art
- Authored GLTF tents/plants/fans — later pass (real GLTFLoader required).

## 2026-08-11 — Icons: root cause was **no deploy**

### honesty
- Inline-SVG icon fix was built locally (562KB panel) but live HA kept serving old mask-based panel (547KB) until SCP + core restart.
- After deploy: 54 `.dsc-icon` nodes with SVG in shadow DOM; SURFACE **7.1.1**.
- Control Center demand icons were present but **14px** on ~90px tiles — looked empty; bumped to 22px teal.
- `PANEL OFF —` false positive on HA-ONLY path — gated to true offline only.

### finish-pass misses (still)
- Live API blip soak (HELD + OFF timer + reconnect) not operator-proven.
- Climate airflow-map hard-reload soak not screenshot-proven after bundle push.
- Twin on-scene pot chips not visually confirmed on live Twin tab.

### problem
Live HA served `/dsc_hub/dsc-hub-panel.js` (200) but `/dsc_hub/assets/icons/*` **404**. Icons used CSS `mask-image` against those URLs → blank chrome.

### fix
- Embed SVG bodies in `frontend/src/iconSvg.ts` (regen: `python scripts/gen-dsc-hub-icon-svg.py`).
- `Icon` renders inline SVG via `currentColor` (no asset fetch).
- Wordmark also inlined.
- `frontend.py` also mounts whole `www` at `/dsc_hub` so synced assets still work.

## 2026-08-11 — DSC-Dashboard Surface 7.1.1 finish gaps

### done
- Panel/beat OFF duration chips + honesty polish.
- Root Rate column + learned-EC honesty on seat + Analytics (attrs only).
- Twin on-scene pot glass chips (`projectPotAnchors`) + cyan intake/path bias; Node-concat `homeassistant/www/DSC-HUB.js` + `dist/` (~1.0MB).
- Research/Compose honesty handoff + Use-in-Compose / Open Seat CTAs.
- Panel rebuild via `scripts/build-dsc-hub-panel.ps1`; surface **7.1.1** (`const.py` + `dsc_v4_version.yaml` + chrome).

### soak / honesty
- Agent browser to `http://192.168.86.3:8123/dsc-hub` stayed on HA Loading (no session) — **live blip hold + airflow-map hard-reload soak needs operator after sync/deploy**.
- Bundle self-check (local): `projectPotAnchors` + cyan `0x26c6da` pathColors in concat; panel build contains Rate / PANEL OFF / SURFACE 7.1.1.
- Note: mid-pass NAS reverted uncommitted source once; finish pass re-applied via local TEMP then copy-back + verify.

### still parked
- R3F Twin, authored GLTF packs, DepthTexture-on, inventing CFM/PPFD, Pi WEBUI, full Learning wizard math.

## 2026-08-11 — DSC-Dashboard Surface 7.1 ship

### done
- Prep inspiration pack + entity freeze (this file).
- Hold last-known vitals + HUB OFFLINE / OFF Xm chips; reconnect clears hold.
- Apply-to-tent: direct `input_select.select_option` + script `error: true` + inline entity_id.
- Sharp contrast tokens (blue/cyan active chrome).
- Gauge/KPI → History drawer + 1h|6h|24h|48h timespan.
- Twin/airflow: leaders, cyan Got marker, allocated CFM + airflow-map host on Climate.
- Mission modern gauges/sparklines/GotWant/trend; Main/Clone tent cockpits restored.
- Seat Want/Got/Need + inline editors + dryback/history; Root fleet matrix.
- Learning densify + Analytics root pack; surface **7.1.0** (superseded by **7.1.1** finish).

### soak / next
- ~~Live blip soak / airflow-map hard reload~~ → tracked under **7.1.1** soak (operator after deploy).
- R3F / authored GLTF still deferred.

## 2026-08-11 — SoftAP OTA via NAPT is broken; Nest-hold OTA path

- **Symptom:** SoftAP-path OTA (HA Device Builder and laptop → `192.168.4.x`) dies mid-upload (`ERROR receiving chunk result` / `WinError 10054` / timeout) on ESP8266 Sonoffs and ESP32 hub/pots. Nest-path OTA works. MTU clamp **1280** in `dsc_anchor_ap` did **not** clear the fail — Phase A SoftAP OTA exit remains **unproven**.
- **Workaround used (pre SoftAP-local cutover only):** Temporary bridge SoftAP SSID `DSC-Anchor-hold` → dual-network STAs fall to Nest → OTA → restore `DSC-Anchor`. **Do not** SoftAP-hold after SoftAP-local firmware is on a device (no Nest STA).
- **Do not** treat SoftAP NAPT OTA as healthy until a full binary uploads to SoftAP STA reliably. Recovery for SoftAP-local bricks = device **Fallback AP** / USB.

## 2026-08-11 — SoftAP-local cutover **6.0.0.0** (Phases C–F close)

### done
- SoftAP-fleet flashed SoftAP-local **6.0.0.0** / ESPHome **2026.7.4**: Hub `.10`, Control `.11`, Pot1/2/4 `.12/.13/.15`, Sonoffs `.20–.23`. SoftAP `DSC-Anchor` restored; Hub ESP-NOW green; Sonoff SoftAP `api_link` green.
- Nest SoftAP-fleet OTA listeners: **absent** after cutover.
- HA ESPHome entry hosts sticky SoftAP map (wrote while core stopped so in-memory Nest hosts could not overwrite). Device Builder stubs SoftAP `use_address`.
- HA Fleet Fix button pressed on Control SoftAP (glass Trip 3 soak still operator).

### out of scope / open
- **Pot3 dead** — ignore; do not gate success on `.14`.
- SoftAP NAPT OTA still broken (see section above).
- Glass Fleet Fix hold soak + optional SoftAP-down Fallback smoke — operator Trip 3 residual.
- ~~Pot4 SoftAP `.15` ESP-NOW Link lag~~ → **root cause 2026-08-11:** SoftAP/API fine (`192.168.4.15`, MAC `EC:E3:34:7B:E7:A8`, fw 6.0.0.0). **Modbus soil probe all NaN** (raw + calibrated). Hub `POT4 ESP-NOW Link` is freshness of plausible `soil_temperature` (5–45 °C) — dead probe looks like “won’t connect”. Pot1/2 soil live. Physical: reseat RS485 probe / power-cycle Pot4; swap probe with Pot2 to isolate cable vs board. Diagnostic honesty: Link False ≠ radio fail when sensor NaN (consider separate sensor-fault cue).
- Lab stubs still pass unused Nest `wifi_ssid` / `wifi_password` substitutions (cleanup when stubs next touched).

## 2026-08-11 — Twin roofs + single-tent + OOS hide

### done
- Room ceiling + tent fabric roofs ~10% opacity; mylar walls-only (no ceiling) so interiors stay readable.
- Twin HUD: hide cyan leaders when HUD is anchored; inline T/RH/VPD SVG icons; status wrap; wider pot chips.
- Main/Clone (/live/main, /live/clone): Twin keep-alive with ocusTent single-tent scene.
- Deactivated pots (input_boolean.dsc_potN_in_service = off): omitted from Mission seats/ESP chips, Root matrix/dryback, tent cockpits, seat pot chips, Twin chips/poses; honesty no longer names OOS pots. Fleet in-service toggles remain so pots can return.

### soak
- Hard-reload Twin + Main + Clone after deploy; confirm pot3 gone when OOS; roofs see-through; no cyan HUD ovals.

### still parked
- R3F Twin / authored GLTF / inventing CFM-PPFD (unchanged).


## 2026-08-12 — Twin/Mission climate history + lit gauges

### root cause
- Dash etchHistory only read 
esult[entityId]; HA often returns [[states]] → empty series. Empty hist locked for 60s.
- Panel callWS had no connection.sendMessagePromise fallback → Mission sparks often unseeded.

### done
- Normalize history array/dict; retry empty climate hist sooner.
- Twin charts: 2×4 + 4×8 Temp/RH/VPD (6 panes); amber glow when that tent's lights are on (2×4 = SF1000; 4×8 = no lamp yet).
- Mission Live gauges: same 2×4 / 4×8 T·RH·VPD groups + lit glow.

## 2026-08-12 — Tent pass (all tents) + 4×8 photoperiod glow

### done
- 4×8 Twin/Mission/airflow glow: prefer future `main_light` if present; else `binary_sensor.dsc_hub_4x8_window_open` (honest schedule/heat proxy — no GPIO5 lamp yet). Main tent light-bar/shafts driven like clone.
- Twin focus framing: Main/Clone cockpits orbit toward the active tent.
- Main/Clone cockpits: VPD + PHOTO/SF1000 chips, Want targets (single tent), tent fan strip, Twin keep-alive.
- Airflow-map: main LIGHT mark no longer mis-points at SF1000; clone gets SF1000; Climate honesty note updated.

### soak
- Hard-reload Twin / Main / Clone / Climate after `/local/DSC-HUB.js?v=7.1.4-tent-pass`. Confirm 4×8 amber when window open; airflow LIGHT marks; cockpit chips.

### still parked
- Real 4×8 PWM lamp entity (GPIO5) — wire `entities.main_light` when instrumented.
- SoftAP NAPT OTA (fleet update path) — separate from Twin UI.
- R3F Twin / authored GLTF / inventing CFM-PPFD.

---

## 2026-08-12 — Cannalib full-corpus API (N-087-CANNALIB)

**Moved 2026-08-15:** corpus, scrapers, API, and this ops runbook now live in sibling **`Y:\Digital Stealth Care\Projects\CannaLib`**. Hub keeps cards, Want YAML, and capped indexes. Stub: [`docs/ops/CANNALIB-API.md`](ops/CANNALIB-API.md). Remaining CannaLib work: `CannaLib/FOLLOWUPS.md`.

**Ops SoT (credentials, mounts, tunnel, HA):** `CannaLib/docs/ops/CANNALIB-API.md`

### done
- Stdlib service `services/cannalib/standalone_server.py` on Digital-Gateway (`:8790`): full `strain_canonical` (~195k), not HA 10k index.
- Hardening: RO rootfs, `cap_drop ALL`, DB `:ro` + WAL/SHM mounts, GET-only, keyed `/v1/metrics`, soft rate limits (no lock-held sleep), capped `q`/`limit`, no exception leak.
- HA package + Home tiles; cards typeahead via cannalib with local JSON fallback.
- Verified LAN: `/health`, search Blue Dream, `/v1/corpus` = 195266. Metrics → 401 without key.
- **N-087-CANNALIB-DEPLOY**: CF tunnel (Wordpress) public hostname `cannalib.plausible-deniability.net` → `http://127.0.0.1:8790`; DNS CNAME created. Public HTTPS `/health`, `/v1/catalogs/strains`, `/v1/corpus` OK. `CANNALIB_TRUST_PROXY=true` live.
- Ops runbook written (`docs/ops/CANNALIB-API.md`).
- **N-087-CANNALIB-HA-KEY**: Deployed `dsc_v4_cannalib_api.yaml` to HA `/config/packages/` (fixed `max: 255`); set `input_text.dsc_cannalib_api_key`; sensors online (`corpus` 195266, `api_online` on).
- **2026-08-15 Research card**: `ensureLocalCards` now loads dedicated `/local/dsc-*-card.js` (was only trying stale `DSC-HUB.js` / wrong `dsc-system-map-card.js`). Deployed cards + rebuilt panel; Research hosts `dsc-catalog-browse-card` again.
- **2026-08-17 cutover:** remade corpus **175,778** strains. Cards typeahead all four domains via API. `/local/dsc-catalog` sqlite export (867/321/696 products). Strain `{id}` hydrate + reference-images tab. Recreate `cannalib` from **CannaLib** compose, not Hub.

### next-plan
| ID | Item | Notes |
|---|---|---|
| N-087-CANNALIB-FTS | FTS5 + hybrid alias search on CannaLib 0.3.4 | Built on remade master; Recreate CannaLib compose (not Hub). |
| CL-DEPLOY-RECREATE | Unraid Recreate onto CannaLib mounts | Trampoline compose in `services/cannalib/`; then delete Hub `brain/data/dsc_brain.sqlite3*` |

### deferred
- Cloudflare WAF custom rules / Access hard-private mode until abuse appears.
- Flip `CANNALIB_REQUIRE_API_KEY=true` if catalog must stop being publicly scrapeable.
- WordPress site scaffold on plausible-deniability.net (separate from API).

## 2026-08-15 — POT3 / POT4 Modbus (not a firmware regression)

Operator: soldered RS485 contacts + replaced MAX transceiver on pots 3 and 4; still “modbus issues.” Live check vs pots 1/2 (same `dsc-pot-common` **6.0.0.0**).

### what is true
- **Modbus YAML did not change.** UART GPIO17/16, DE/RE GPIO4, 4800 8N1, slave `1`, holding `0x0000–0x0006`. SoftAP 6.0.0.0 only moved Wi‑Fi home. Pots **1 and 2** on that exact binary have live soil (P1 49.5% / 20.9 °C / 295 µS / pH 6.0; P2 26.1% / 21.7 °C / 200 µS / pH 6.6). Same code cannot be “broken only on 3 and 4.”
- **POT3 ESP is on SoftAP** `192.168.4.14` (ICMP + API `:6053` + OTA `:3232` open). HA still had *all* `dsc_pot3_*` **unavailable** (firmware/uptime/wifi included) — that is **API-not-bound**, not a Modbus decode. Old Nest `.40` still pings but is **not** ESPHome (6053/3232 closed). If HA’s ESPHome entry still points at `.40`, it will never attach. Confirm host = `192.168.4.14`.
- **POT4 ESP is off SoftAP** `192.168.4.15` (no ping, no 6053/3232). Worse than 2026-08-11 (then API was fine, soil all NaN). After the rework the node is not on the fleet AP — bench unpowered, **Fallback AP**, or the rework took out 3V3/EN/Wi‑Fi, not just the MAX.
- Hub `POT3/4 ESP-NOW Link` stays **off** while soil_temperature is missing/NaN. That bit is **probe freshness**, not radio. P1/P2 links were **on**.
- F-003 (POT3 probe) and the 2026-08-11 POT4 NaN note are still the live faults. Soldering + MAX swap did not close them.
- **ESPHome 2026.6+ / 2026.7 Modbus timing is a real suspect for POT4’s Aug 11 death, not a universal break.** 2026.6 cut inter-frame timeout from ~50 ms to spec 3.5 char-times ([esphome#17180](https://github.com/esphome/esphome/issues/17180), still open). 2026.7 then shipped a Modbus parser rewrite. Fleet SoftAP flash was **2026.7.4** — same day POT4 went all-NaN while POT1/2 on that binary stayed live. At 4800 baud the window is ~9 ms; sloppy JXCT inter-byte gaps + a weak MAX/cable miss it, a clean bus does not. Workaround (no YAML `frame_delay` yet): `uart.rx_full_threshold: 1` and `rx_timeout: 10`–`20`. Does **not** explain POT3’s long-standing dead probe, or POT4 being off `.15` after the rework. Still do the POT2 probe swap; add the UART soften on the next pot OTA.

### isolate (do this, in order)
1. **POT4 power / AP:** USB serial boot. If it is on `DSC-POT#4 Fallback`, it will not be at `.15`. Rejoin `DSC-Anchor` → `.15` before judging Modbus.
2. **Swap test (the only isolation that matters):** move **POT2’s known-good probe + cable** onto the POT3 (then POT4) board. Readings appear → original probe/cable is dead. Still NaN / “no response” → board-side (DE/RE GPIO4, A/B, probe VCC 5–24 V, MAX type/orientation).
3. Do **not** keep replacing MAX chips on both dead pots without that swap — POT3 was already a documented dead probe (0.0% then offline). Two dead probes + two reworked boards look like “firmware changed.”
4. Post-MAX checklist if the good probe still fails on that board: MAX3485 (3.3 V) vs MAX485 (5 V); pin-1 orientation; DE+RE both on GPIO4; A/B not swapped; RO←RX / DI→TX; probe VCC not 3.3 V-only; replacement probe baud/address (some clones are **9600** / not addr `1`).

### honesty leftover
- Separate **ESP online** vs **Modbus probe online** cues so Link-off is not read as radio fail (noted 2026-08-11; still open).

### 2026-08-15 USB serial (POT3 then POT4, COM3 CP210x)
- **POT3:** ESP-IDF 5.5.5, ESPHome **2026.7.4** compiled 2026-08-13 22:59, project **5.2.0**. Joins Anchor → `.14`. Modbus: `Stop waiting for response from 1 ~2000ms` → `device=1 set offline`. No CRC / no partial frame.
- **POT4:** same IDF/ESPHome, compiled **2026-08-11 12:48** (SoftAP cutover), project **6.0.0.0**. Joins Anchor → `.15` (was dark on LAN until this USB boot). Same mute Modbus, no CRC. RSSI weaker than POT3 on the bench.
- UART soften will not fix either. Both ESPs are fine; slave `1` is silent on both buses.


## 2026-08-15 — DSC-Dash UI audit (select-off / nav / drawers)

Operator: cannot type / dropdowns select off; requested full Dash+panel audit.

### root cause (not cosmetic)
- **N-093-DASH-FOCUS:** `HassProvider` `isDscEntity` matches **all** `input_*` + every `dsc_*` `state_changed` → global `tick` → controlled `EntitySelect` / fan sliders / seat drafts fight the DOM. Lovelace `DscTheDashEditor.set hass` full `innerHTML` wipe is a second hard path.
- Full register: canvas `dsc-dash-full-audit` (I-01…I-26 + data layer D-01…D-20).

### next-plan
| ID | Item | Notes |
|---|---|---|
| N-093-DASH-FOCUS | Fix tick filter + drafts + editor idle render | P0 — unblocks typing/selects |
| N-093-DASH-NAV | Twin `data-nav` → `#/live/*`; retire `/dsc-hub-pro` CTAs | P0/P1 |
| N-093-DASH-TWIN | Soft `setFocusTent` without `_renderShell`; pause rAF when hidden | P1 |
| N-093-DASH-HISTORY | Stabilize `useHistory` deps (no refetch per tick) | P1 |
| N-093-DASH-DRAWER | Focus trap + overflow menu close races | P1 |

### data IA / coverage (2026-08-15 addendum — audit only, no UI impl)
Data-scientist pass: page decisions × datapoint families (Got/Want/Need honesty). Canvas section **Data coverage** + D-IDs. Do not invent values; surface package/Dash entities already present.

| ID | Item | Sev | Notes |
|---|---|---|---|
| N-094-DATA-MISSION-NEED | Mission plant chips → Got M + Need triage | P0 | D-01 — seatModel already has fields |
| N-094-DATA-LIGHT-SCHED | Light: next_event + clone/main expected/delivered hours | P0 | D-02 / D-10 — Dash binds; React Light thin |
| N-094-DATA-WANT-BANDS | Seat Want EC/pH bands + Need explanation | P0 | D-03 — packages have want_* ; UI moisture-only |
| N-094-DATA-MISSION-CFM | Mission secondary CFM / lung OK chip | P1 | D-04 / D-09 — shared honesty badge |
| N-094-DATA-HUB-LINK | Fleet (+ Mission) hub_link suite not uptime proxy | P1 | D-05 — match Dash pill |
| N-094-DATA-ANALYTICS-POTS | Analytics: all in-service pots not Pot1-only | P1 | D-06 |
| N-094-DATA-ROOT-COLS | Root matrix: soil °C (+ NPK secondary) | P1 | D-07 |
| N-094-DATA-ROLE-SPLIT | Mission triage vs Climate command ownership | P1 | D-08 — cut duplicate controls |
| N-094-DATA-POT-TRUST | Root/Mission: stuck/untrusted/peer_divergence | P1 | D-11 |
| N-094-DATA-OOS-COUNT | OOS pot count honesty (not silent omit) | P2 | D-12 |
| N-094-DATA-GOT-SOT | Align Dash soil_* vs React got_* | P2 | D-13 |
| N-094-DATA-LEARN-SCOPE | Learning: port wizard or demote CFM echo | P2 | D-14 |
| N-094-DATA-EFFICACY | Climate demand + efficacy/suspect strip | P2 | D-15 |
| N-094-DATA-COCKPIT-NEED | Main/Clone chips: Need (+ dryback warn) | P2 | D-16 |
| N-094-DATA-ROOM-AH | Climate room RH / AH | P2 | D-17 |
| N-094-DATA-ROSTER-NEED | Roster optional Need column | P2 | D-18 |
| N-094-DATA-TANK | Tank card when hardware entities exist | P3 | D-19 |
| N-094-DATA-BRIDGE | Fleet bridge/ESP-NOW/firmware table | P3 | D-20 |

### UX / design-systems (2026-08-15 addendum — audit only, no UI impl)
UI/UX pass: one Dash, progressive disclosure (DecisionLayer), unused paid primitives, vessel silhouette, coupled mix. Canvas section **UX / design-systems** + U-IDs. Do not reskin Lovelace IIFEs; port onto React chrome/viz after the primitives exist.

| ID | Item | Sev | Notes |
|---|---|---|---|
| N-095-UX-DECISION | DecisionLayer fade overlay + Help slot + ResultChip write-back | P0 | U-02 / U-12 / U-17 / U-19 / U-22 |
| N-095-UX-VESSEL | VesselSpec silhouette + volumeL + material; share Compose/Roster/Root | P0 | U-03 / U-20 — not a 4:5 rounded box |
| N-095-UX-MIX | Coupled blend sliders always 100%; lock + remainder; L recipe | P0 | U-04 — retire "must sum 100" homework |
| N-095-UX-COMPOSE | Port Compose/Research off LegacyCardHost onto DecisionLayer + vessel + mix | P0 | U-01 / U-10 / U-18 — CatalogPicker Combobox |
| N-095-UX-GHOST | GhostSeries (last 24h / cycle / sibling tent) + HistoryDrawer targets | P1 | U-05 / U-08 / U-13 / U-16 |
| N-095-UX-MISSION | Slim Mission glance; command → Climate or DecisionLayer | P1 | U-06 — pairs D-08 |
| N-095-UX-POT-OVERLAY | Twin/Mission pot pick opens seat overlay, not /live/root hop | P1 | U-09 — pairs I-15 |
| N-095-UX-TWIN-CHROME | Twin as Three.js canvas in glass; strip Dash HUD / data-nav product | P1 | U-07 — pairs I-05 / N-093-DASH-NAV |
| N-095-UX-LIGHT-VIZ | Light: next-event + hours gauge + photoperiod spark | P1 | U-14 — pairs D-02 / D-10 |
| N-095-UX-PRIMITIVES | Use paid viz (GotWantBars, ResultChip, gauges); drop dead LiveLineChart | P1 | U-11 |
| N-095-UX-MAP-HOSTS | Airflow + system map inherit dsc.css or React topology (no inset IIFE) | P2 | U-15 |
| N-095-UX-ROOM-CHIP | Climate Room chip when RH/AH glance lands | P3 | U-21 — pairs D-17 / I-23 |

### 3D / realtime viz (2026-08-15 addendum — audit + plan only, no 3D/UI impl)
3D Artist pass: neon wireframe only (cyan/teal/purple on dark, `dsc.css` tokens). Existing Twin is a cinematic lung wearing plastic pots, cartoon leaflets, HVAC furniture, and HELD-still-alive particles. Climate airflow-map and Fleet system-map are misplaced twins. Canvas section **3D / realtime viz** + T-IDs. Do not invent sensor values; HELD/unavailable = dim / dashed / no glow.

| ID | Item | Sev | Notes |
|---|---|---|---|
| N-096-3D-HONESTY | Twin HELD freeze + OOS/unassigned dashed empty pads | P0 | T-02 / T-04 — last-good wisps currently keep flying |
| N-096-3D-STYLE | CUT terracotta pots, leaflet canopies, fabric/soil maps; neon wire tents | P0 | T-01 / VIZ-02 — style lock vs Dash cinematic |
| N-096-3D-MAP-CUT | CUT Climate `dsc-airflow-map-card` (clone labeled Reservoir); REHOME Fleet system-map | P0 | T-05 / T-09 / U-15 — wrong page |
| N-096-3D-VESSEL | VesselSpec neon glass: moisture column from floor, EC slab on top, dryback albedo, soil-T glow | P0 | T-06 / U-03 — swappable 25L fabric bag / 20L tall PET |
| N-096-3D-LIGHT-PROXY | 4×8 shafts dashed + tagged Window proxy until GPIO lamp | P0/P1 | T-03 / I-18 — not a fake fixture |
| N-096-3D-HUD | Strip Dash IIFE HUD; pause hidden Twin rAF; Main/Clone canvas-only | P1 | T-10 / T-14 / U-07 — pairs I-05 / I-11 / I-12 |
| N-096-3D-PLANT | Generic neon plant extra (stage/Need/photoperiod/stress decay); no cultivar mesh | P1 | T-07 — no Grow Narrator copy engine exists |
| N-096-3D-TANK | Dummy DSC-Tank contract (pump/level helpers) + cutaway; bind `dsc_v4_tank.yaml` tester | P1 | T-08 / D-19 — Fleet copy is stale; no firmware tank |
| N-096-3D-KIT-PULSE | Wildcard: Kit Pulse / Grow Health constellation with holes for missing kit | P1 | T-19 / T-20 — Mission + Fleet glance |
| N-096-3D-LUNG | Wildcard: extract Lung Loop (cascade 2×4→4×8; allocated solid / nameplate dashed) | P1 | T-13 / D-04 / D-09 — unique 3D, currently trapped |
| N-096-3D-DEAD-MESH | CUT appliance cubes, ACH slices, WEEK ? timeline; restyle grow mat to neon plate | P2 | T-11 / T-12 / T-15 / T-16 / T-18 |

---

## 2026-08-16 — DSC-HUB panel bar-raise (waves 0–8)

React `/dsc-hub` is the product. Lovelace IIFEs remain as Twin scene host + leftover Lovelace cards.

### honesty
A prior note marked waves 1–8 done. That was files/sketches. **Only Wave 0 had been acceptance-tested** (type/select/slider while climate ticks). Later waves are incomplete until soak says otherwise.

### done and holding
- Wave 0: DSC-only tick debounce, drafts on select/slider/TargetNumber/seat notes, history deps, editor idle, drawer a11y

### raised this pass (not a full-wave stamp)
- Twin: `hideHud` on `/live/twin` and other Twin hosts so the IIFE is canvas-only (React chrome owns nav)
- Compose: nickname/recipe/blend names/nutrient doses draft-on-focus; commit + assign + accept-mix go through DecisionLayer confirm; 8 nutrient slots + tank × strength ml; vessel copy onto `input_select.dsc_potN_vessel` on assign
- Coupled mix: drag drafts remainder locally; commit percents on pointerup
- Light: DecisionLayer writes `time.dsc_hub_lights_on_time`, ramps, min dark, clone Independent start/hours from Lovelace lighting
- Mission: dropped the command T/RH MultiLineChart (Climate owns it)
- Learning: sample inputs use TargetNumber drafts; finish overlay calls `script.dsc_cal_finish` (no invented accept-curve script)

### still not the bar
- Wave 5 3D: terracotta cut exists; VesselSpec moisture column / Need tone in Twin is still a first cut; Twin IIFE is not an R3F rewrite
- Wave 6: LungLoop/KitPulse/tank cutaway are diagrams, not extracted Twin math / constellation
- Wave 7: Research compare + Analytics still thin vs IIFE Research/Learning YAML
- Wave 8 parked: Assist/MCP opt-in, GPIO 4×8 lamp, Cannalib FTS, R3F extract notes

### next-plan / hardware leftovers (not skipped)
| ID | Item | Notes |
|---|---|---|
| I-25 | Assist/MCP expose | Opt-in only — [`docs/ASSIST-MCP.md`](ASSIST-MCP.md). Do not silently expose the house. |
| GPIO5 4×8 lamp | Wire `entities.main_light` when instrumented | Twin shafts stay dashed Window proxy until then. |
| DSC-Tank firmware | Map dummy ids 1:1 | See comments in `homeassistant/packages/dsc_v4_tank_dummies.yaml`. Tester EC/pH already in `dsc_v4_tank.yaml`. |
| R3F extract | After neon APIs | Soft APIs live on IIFE + [`dsc-twin-api.ts`](../homeassistant/custom_components/dsc_hub/frontend/src/lib/dsc-twin-api.ts). Do not rewrite a lying scene. |
| N-087-CANNALIB-FTS | Catalog typeahead FTS5 | Landed on CannaLib remade master (`search_docs_fts` + `science_alias`). Hub cards 7.1.8-cutover. |
| POT3/4 Modbus | Hardware isolate | Already in this file — not a panel task. |

### soak
- Type/select/Compose nickname while hub ticks after HA hard-reload
- `/live/twin` shows canvas only (no IIFE HUD/charts/rail)
- Light schedule times/hours stay put while ticks; Independent unlocks clone fields
- Twin tab-away: rAF paused (no GPU spin)
- Vessel YAML: reload HA so `input_select.dsc_build_vessel` exists

## 2026-08-16 — Waves 1–8 bar close

Wave 1 was already holding. This pass raised waves 2–7 to the panel bar and kept Wave 8 documented rather than faked.

### done this close
- Wave 2: CoupledMix remainder always Σ=100; CFM badge on printed CFM; ResultChip / GotWantBars on Climate/Light/seat; Light schedule Confirm overlay
- Wave 3: Mission triage only; Climate command + demands + efficacy; Light window-proxy; Root Soil °C / NPK toggle / trust tone; cockpit Need + dryback (no act glow when untrusted); Roster Need + vessel glyph; Room T/RH/AH
- Wave 4: Native Compose/Research (CatalogPicker uncapped 100, sprout date, 8 nutrient slots, vessel + coupled mix, DecisionLayer commit/assign/mix/Want, Research compare fields from IIFE). IIFE remains Lovelace-only.
- Wave 5: Neon glass vessels via setPots (silhouette / moisture column / EC slab / dryback albedo / soilT / Need rim); dashed pads; HELD freezes wisps + mat pulse; 4×8 dashed Window proxy until GPIO; HUD off on Twin/Main/Clone; React owns tent slots. Twin is still the Dash IIFE, not R3F.
- Wave 6: LungLoop per-leg allocated vs nameplate; KitPulse constellation holes (including tank); TankCutaway bound to tester + dummy helpers; Fleet bridge table. Airflow-map / system-map not hosted in the panel.
- Wave 7: HistoryDrawer prior-window ghost; Cycle/Photo timespan; Analytics in-service pots; LearningWizard ports view_learning + climate-learn YAML (gate/sample/accept/curves/Phase A-B); PlantExtra neon chips — no cultivar mesh, no narrator
- Wave 8: Assist opt-in in `docs/ASSIST-MCP.md`; GPIO `entities.main_light` stays empty; Cannalib still LIKE; R3F extract parked until neon APIs soak

### honesty
Wave 5 fabric tent walls / R3F rewrite were not in scope. Do not claim soak until hard-reload + type/select while ticks.

### soak
- Type/select/Compose nickname while hub ticks
- `/live/twin` canvas only; tab-away pauses rAF
- Light Independent unlocks clone start/hours
- Reload HA packages for `dsc_v4_vessel.yaml` + tank dummies

## 2026-08-16 — GitHub junk cleanup

Removed ~520 tracked scrape/backup/scratch files from git (working tree + index). Tracked count **1018 → 498**. Dashboard/panel, `_Archive_Legacy_Code`, and `firmware/_history` were not touched.

### done
- `.gitignore` now blanks root `/_*`, `scripts/_*`, `homeassistant/data/_*` + `*.json` dumps, runtime `*.log`/`*.err`/`*.pid`, firmware compile scratch, brain scrape PIDs
- Deleted cookie jar `homeassistant/data/_strain_database_cookies.json` (strain-database.com `cf_clearance` / Anubis session). Treat those cookies as burned.
- Curated YAML catalogs remain the only tracked files under `homeassistant/data/`

### red-flag
- Cookie jar is gone from HEAD-to-be, but **still lives in git history**. This pass did **not** rewrite history. Optional later BFG / `git filter-repo` if the jar must disappear from old commits.

### next-plan
- Commit this cleanup separately (do not mix with `scripts/ha-sync.sh` or in-progress panel work)
- Optional: history purge of `_strain_database_cookies.json`

## 2026-08-16 — Kit Pulse, Twin steer, scheduler, air path

Operator-facing tents are **4×8** and **2×4** (HA entity ids unchanged). This pass wired kit honesty, inspector, Twin orbit/wisps/ports, Crop Scheduler, spatial air path, Climate triad, Root cards, and Light.

### done
- Mission/Fleet Kit Pulse is a clickable constellation over the full kit (heater, mat, AC, hum/dehum/mister, pots, tank). Planned OOS is dashed inventory, not a red hole.
- `binary_sensor.dsc_reduced_kit` is unexpected loss only. Lovelace Home + honesty rail match.
- Entity inspector: runtime, duty strip, playbook, snooze until hub reboot (`sensor.dsc_hub_uptime` last_changed).
- Twin IIFE: frame camera only on focus-mode change; pointer capture; mouth bloom + extra ribbons vs CFM; 4×8/2×4 pages show one tent + labeled cascade port.
- Lovelace Dash timeline/flow match the React scheduler and spatial air-path SVG.
- Climate Room+2×4+4×8 triad, step-hold charts, Want-band severity, statistics entities (names slug to `sensor.dsc_hub_*_mean_24h`).
- Root per-pot cards + human mat duration; Light two equal hero cards + 4×8 window-proxy honesty.

### soak
- Reload HA templates/stats so `sensor.dsc_hub_room_vpd_kpa` and `dsc_v4_climate_stats.yaml` means exist before Climate 24h Want bars light up.
- Hard-reload panel + Lovelace Dash so `dsc-the-dash-card.js` orbit/wisp/port changes load (cache-bust www).
- `/live/twin` orbit does not snap on hass ticks; `/live/4x8` is one tent + “from 2×4” port; `/live/2x4` inverse.
- Planned OOS (AC, clone mister, POT3) does not pulse REDUCED KIT.

### red-flag
- None new. Physical AC / mister / POT3 still F-001–F-003.

### next-plan
- If Lovelace is served from repo `dist/dsc-the-dash-card.js` instead of `homeassistant/www/`, copy the www IIFE — they can drift.
- GPIO 4×8 lamp (`entities.main_light`) still empty — window remains the Got proxy.
- Intake `*_allocated` CFM sensors are not in packages yet; exhaust allocated exists. Trust line will stay mixed/nameplate on intakes until Learning writes them.

### deferred
- Full R3F Twin extract (still lying until neon APIs soak).
- Hosting Lovelace airflow/system-map cards inside the panel.
- New `*_in_service` helpers for heater/hum/dehum/heat mat.

## 2026-08-16 — Kit Pulse remaining holes

Closed Twin clone-cascade hide, Room VPD id, Light draft extrema, tent air-path focus, inspector chips, Grow scheduler, Climate prior-window ghosts. No plan-file edit. Types + frontend build clean.

### done
- Twin IIFE: pads/actors follow tent focus (not forced `visible=true` every tick). `/live/4x8` hides 2×4 body + clone pots. `/live/2x4` hides 4×8 + main pots, keeps 2×4 intake + “to 4×8” stub **and cascade wisps**. Twin (focus null) still shows both. Copied www → `dist/dsc-the-dash-card.js`. Orbit-on-mode-change unchanged.
- Room VPD: template renamed “DSC Hub Room VPD kPa” + `default_entity_id: sensor.dsc_hub_room_vpd_kpa`. Climate falls back to `sensor.dsc_hub_room_vpd` if the kPa id is missing. Stats already target `sensor.dsc_hub_room_vpd_kpa`. 24h/48h unique_ids still slug to `sensor.dsc_hub_*_mean_24h` / `_48h`.
- Light: min-dark and Independent 2×4 hours score the typed draft (`TargetNumber` `onLive` + `draftTone`). 4×8 hours chip scores implied photoperiod `24 − min-dark` (there is no 4×8 hours number entity; stage still owns `sensor.dsc_expected_light_hours`). 4×8 Got remains window-proxy.
- Tent cockpit `AirPathMap` `focus`: that tent + room + cascade port stub. Twin/Climate keep the four-zone map. CfmTrustLine stays one sentence.
- Inspector on Climate Room AH / Cool / Hum / Dehum / heater-today (+ heat ineffective), cockpit photo/window + CFM, Light hours-rail chips.
- Compact `CropScheduler` on Grow Roster (same React card, not Twin-only).
- Climate T/RH/VPD MultiLineCharts: muted prior-window ghost via `useEntitySeries({ withGhost: true })`. No CFM invented. Unavailable still not plotted as 0. Step-hold kept.

### soak
- Reload HA templates/packages so `default_entity_id` / rename actually registers `sensor.dsc_hub_room_vpd_kpa` (existing unique_id installs may keep `sensor.dsc_hub_room_vpd` until registry picks up the lock — frontend fallback covers that). Confirm stats VPD means attach to the live template id.
- Hard-reload Lovelace Dash + panel so the Dash IIFE cache-busts. Confirm `/live/4x8` has **no clone pots**, `/live/2x4` cascade wisps still move toward “to 4×8” when CFM > 0 and freeze when CFM is 0.
- Type min-dark / Independent 2×4 hours and watch extrema chips update before commit.

### red-flag
- None new. Physical AC / mister / POT3 still F-001–F-003.

### next-plan
- GPIO 4×8 lamp still empty — window remains Got proxy.
- Intake `*_allocated` CFM still missing; tent-page trust line stays nameplate/mixed until Learning writes them.

## 2026-08-16 — ESP-NOW on the shelf

**Decision:** stop deepening ESP-NOW as the product radio. Public write-up: [ESP-NOW or Maybe Later](https://plausible-deniability.net/esp-now-or-maybe-later/).

Climate ladder stays on the hub. Appliances follow the path that stays up (HA / Ethernet bridge). Pots may report without pretending they are a mesh. ESP-NOW code stays in tree as parked, not a promise.

### why
- One radio, two jobs. Home mesh hops broke same-channel ESP-NOW (F-004).
- Real-time cadence + more nodes → TX OOM / channel thrash (5.1.8 soak), not more coverage.
- Workarounds landed and still were not boring: TX cap (5.1.9), kill `post_connect_roaming` (5.1.10), SoftAP pin, `WIFI_IF_AP` rebind, unicast vs broadcast, ETH01 appliance bridge, probe-NaN ≠ radio fail.

### deferred
- Pick ESP-NOW back up only when ESPHome / ESP-NOW is boring on a multi-node, same-channel, real-time fleet. Do not resume SoftAP/ESP-NOW deepening as the default next task.

---

## 2026-08-17 — Surface 7.2.0 / Fleet 6.0.0.0 completion pass

Software-closable audit lies + Bug Box items landed **in git working tree**. Live HA still serves **7.1.3 / 7.1.4**. No commit/push this pass. Notion not marked Fixed (no post-sync soak). Leave Fix Approved for the operator.

### soak

- **Compile hub:** PASS from `C:\Users\cmgwe\esphome-dsc\v4` (`esphome compile dsc-hub.yaml`, 2026.7.4).
- **OTA hub:** FAILED from this laptop. Hub Native API is up (`binary_sensor.dsc_hub_link` on, IP **192.168.4.10** on **DSC-Anchor**). `192.168.86.33:3232` refused (stale Nest address). HA ESPHome Builder shows DSC-HUB **Offline**. Need a host with the SoftAP route (`192.168.4.0/24` via ETH01) or Builder once it can see the device.
- **Control OTA:** skipped. `sensor.dsc_control_firmware_version` / heap **unavailable**. F-007 stays open.
- **Pots:** not OTAd (Modbus/hardware).
- **HA sync:** blocked. `HA_TOKEN` unset; SSH `root@192.168.86.3` publickey denied. Add-on cannot pull unpushed work.
- **Assist I-25:** still no DSC entities exposed (`GetLiveContext` name `dsc` empty).
- Live kit gates holding: AC / mister / POT3 / tank in-service **off**; `dsc_reduced_kit` **off**.
- Live tank alerts **still on** (packages not synced) — two Mission alerts remain tester EC/pH.
- Climate while hub up: Room **22.1 °C / 65 % / 0.94 kPa**, not Got 0.0.
- Twin React: **THREE.js not loaded — redeploy DSC-HUB bundle** (live panel not the 7.2.0 build).
- Flap count 24h **357** (Phase 1 was 327). Handshake/OTA not on the box yet so this is not post-fix evidence.

### done (repo only — prove on HA after sync)

- Versions 7.2.0 / 6.0.0.0; RELEASE/INSTALL `/dsc-hub`; www→dist SHA match; compose key stripped.
- Tank alerts + alert_count gated on `dsc_tank_in_service`.
- FOLLOWER_DRIFT clone mister entity + real dehum relay; AC/clone relay→ON resync; bridge `script.dsc_notify`; MAD no longer untrusts all pots; Phase B mat wait ceil ≤300 s snapped to 5 s.
- React C1–C8 (prior session) + rebuilt panel 7.2.0.
- Hub D1–D10 already/now in `dsc-hub-v4_0.yaml` (room_live clear, Auto OFF parity, emergency dehum, reboot skip in safety, panel-only no bounce, handshake 90/180/300, ledger freeze/credit ≥0.5%, `photo_dur_was_zero` re-seed, `potN_espnow_link` via `rz_rx_*`). Control D11 never-heard-this-boot reboot skip already present.
- Build-a-Plant: `date.dsc_pot_N_sprout_date` write, custom fill-or-zero Want, roster-full no-op, Fleet Apply refuses last-wins, Want resolvers dual-form, Sync F-015 `dsc_api_client`/`dsc_anchor_ap` + atomic promote.

### red-flag

- SoftAP-only hub is API-visible to HA but **OTA-invisible** to the Windows agent and to ESPHome Builder. That is the flap/OTA path until a route or a Builder-online window exists. Do not pretend 192.168.86.33 is the hub.

### deferred

- ESP-NOW protocol deepening (0xD5 layout, 0xD0/0xD7 cadence, SoftAP BSSID adopt, Nest-STA Sonoff) remains parked.
- F-001–F-003, GPIO lamp, tank firmware, SCD41, allocated CFM, F-007 until Control is on HA.
- Bug Box Fixed + Fix Approved: **after** HA sync + hub OTA + I2–I8 re-soak.

### next-plan

1. Operator: `HA_TOKEN` or push+Sync, then hard-reload.
2. OTA hub from HA (or a machine on 192.168.4.0/24). Confirm `sensor.dsc_ha_link_flap_count_24h` after handshake 90/180/300.
3. Re-run Wave I soak on 7.2.0 chrome. Then Notion Fixed-with-evidence.

---

## 2026-08-17 — Twin THREE.js missing on `/live/twin`

The red **THREE.js not loaded — redeploy DSC-HUB bundle** on Twin was not stale HA assets. React `ensureLocalCards` loaded `/local/dsc-the-dash-card.js` alone. That IIFE reads the `THREE` global at `_renderShell` time; the dedicated card is not the fat concat. `ha-sync.sh` also concatenated `vendor/three.min.js` into `DSC-HUB.js` and never published `/config/www/vendor/three.min.js`.

### done

- Loader now injects `vendor/three.min.js` → `vendor/dsc-dash-fx.js` → dash card, and falls back to the umbrella bundle if the standalone THREE script 404s.
- `ha-sync.sh` copies `three.min.js` to `/config/www/vendor/`.
- Panel rebuilt (`dsc-hub-panel.js` contains `/local/vendor/three.min.js`).
- Gate: `python scripts/check_twin_three_prereq.py`.

### soak

- Still needs HA sync + hard-reload to prove Twin paints the scene on the box. Live HA was 7.1.x at last soak; 7.2.0 query-string is a new cache-buster vs that.

## 2026-08-20 — Studio Wi-Fi cutover (kill ESP-NOW)

Hybrid lab path: **HA Native API is the live bus.** ESP-NOW / SoftAP stay in tree for kit builds; live lab joins **Digital-Emotions Studio** (2.4 GHz) on ESPHome **2026.8.0**, project train **6.1.0.0**.

### done (repo)

- Notion + gitignored secrets for studio SSID (password never in git/FOLLOWUPS).
- Lab wifi packages → studio STA; Sonoff/pot/hub/control `lan_ip` + `use_address`.
- Hub: dropped `dsc-hub-espnow-primary` include; soil/votes HA-primary.
- Panel: `dsc-control-ha-bus.yaml` + `hub_cmd` → `dsc_panel_hub_cmd` event; ESP-NOW TX/keepalive/RF card parked; Connections shows ESP-NOW **PARKED**.
- HA: `dsc_v4_panel_ha_bus.yaml`; fleet-heal/CHX copy retargeted; bridge helpers SoftAP parked; ESPHome stubs off `192.168.4.x`.
- Pots: Modbus `turnaround_time` + UART soften + `probe_online` binary.
- Bridge: SoftAP/ESP-NOW body parked; Sonoff API hosts on studio LAN; `dsc_anchor_ap` not loaded on lab stub.
- README mermaid + kit-vs-lab split.

### LAN map (free IPs — old Nest reclaim was occupied)

| Device | IP |
|---|---|
| Hub | 192.168.86.180 |
| Control | 192.168.86.177 |
| Pot1–4 | .181 / .182 / .183 / .49 |
| Heater / heatmat / humidifier / dehumidifier | .50 / .51 / .54 / .184 |
| Bridge eth | .66 (unchanged) |

Do **not** reclaim .33/.39/.40/.47/.23 — other hosts answered there at cutover.

### soak / next-plan (operator)

1. pfSense DHCP reservations for the table above; confirm studio AP is 2.4 GHz, same LAN as HA, no client isolation.
2. Pin HA Device Builder add-on to **2026.8.0** (laptop CLI already 2026.8.0).
3. USB order: hub → Pot2 canary → pots → Sonoffs → panel → soak ≥30 min → prove OTA (one ESP32 + one Sonoff) → **bridge SoftAP off last**.
4. Re-add ESPHome integrations by new IPs; delete SoftAP hosts (`192.168.4.x`).
5. Push/Sync packages so `dsc_v4_panel_ha_bus` lands; restart Core once.
6. No ESP USB-UART adapter was present this session (COM1 / Blackmagic only) — physical flash blocked here.

### deferred

- Pi-brain hub-LAN bus when HA down.
- Optional studio BSSID pin after soak.
- Resume ESP-NOW only if ESPHome makes multi-node same-channel boring (standing deferral).
- F-003 POT3 probe hardware; mute slaves stay hardware until probe swap.


### compile (2026-08-20 session)

- ESPHome CLI **2026.8.0**: all 11 stubs esphome compile PASS from C:\Users\cmgwe\esphome-dsc\v4 (hub, control, pot1-4, 4 Sonoffs, bridge).
- Bridge fix: dsc_api_client noise-c pin **0.1.11 → 0.1.21** (2026.8 conflict).
- Hub: dsc-hub-espnow-parked.yaml no-op TX scripts + panel_last_ms stamp while API connected.
- Panel events: esphome.dsc_panel_hub_cmd (ESPHome event prefix required).

---

## 2026-08-26 — Pi ingest recovery + FleetState deploy

### done

- Hub ingest maps: dual ESPHome 2026 slug + legacy C++ ids (`hub_controls.py`, `esphome_client.py`, `dash_computed.py`).
- `audit_hub_ingest.py --critical-only`; CI `brain-ci.yml` + `test_hub_ingest_critical_oids_mapped`.
- Full `deploy-brain.ps1` → Pi `image-build`; SPA `index-BXZwXQYP.js`.
- `docs/AUDIT-2026-08-26.md` with live `/fleet` evidence.

### soak

- 24h dash soak on Pi — confirm ladder countdown chips track live fires.
- Hub firmware flash to 7.0.0.0 when binary ready (live 6.0.0.0 → fleet warn is honest).

### red-flag

- POT3 still in-service in Pi inventory while moisture null — reconcile with F-003 before trusting root-zone gates.

### next-plan

- Map non-critical hub entities (ladder waits, hub-side `*_in_service` switches) when tuning UI needs them.
- Phase E: drop `hass_extras` / Pi `fleetToHass` shim after page migration soak.

---

## 2026-08-27 — 7.1.2 interface remediation follow-ups

> **CLOSED 2026-08-27 (full-software pass)** — `tsc --noEmit` clean, `frontend-ci.yml`, route code split, ErrorBoundary landed. Historical notes retained below.

- Frontend `tsc --noEmit` carries **23 pre-existing errors** (unused imports, `SeriesPoint[].at` lib target, `useBrain` Promise<null> generic, SettingsPage `unknown`→ReactNode, CalibratePage `icon="light"` not in IconName). Builds pass because both build scripts are Vite-only with no type gate. Worth a dedicated cleanup pass + adding `tsc --noEmit` to CI.
- SPA chunk is 512 kB minified (Vite warns >500 kB) — consider route-level code splitting.
- One-off: during CDP-driven screenshots, hash-jumping via `Page.navigate` from `/live/climate` → `/live/4x8` once left `#root` empty (React unmount, no console error). Not reproducible via in-app navigation or `location.hash` — likely a CDP artifact, but the SPA has no error boundary; adding one would make any future render crash visible instead of a black page.

---

## 2026-08-27 — Pi AP 8-station cap (brcmfmac) — FIXED

### root cause

- DSC-Brain (Pi 4 B, BCM43455) onboard WiFi in AP mode capped at **exactly 8 associated stations** with the default/standard brcmfmac firmware. Fleet needs 10; the 2 losers rotated per AP restart and fell into ESPHome fallback SoftAPs. `dmesg` symptom: `brcmf_cfg80211_del_station: SCB_DEAUTHENTICATE_FOR_REASON failed -512`. hostapd never logged a rejection (its default limit is 2007) and `iw list` does not expose the cap — it is internal to the firmware blob.
- Baseline evidence (pre-fix, 01:12 AEST): 8/8 stations, hub (.10) + dehumidifier (.55) locked out.

### fix applied (on Pi, 2026-08-27 ~02:30 AEST)

1. **Minimal firmware variant** (frees chip heap for more STA slots):
   `sudo update-alternatives --set cyfmac43455-sdio.bin /lib/firmware/cypress/cyfmac43455-sdio-minimal.bin` → reboot. Was `-standard` (auto mode, 7.45.234-era); now boots `wl0: Nov 1 2021 version 7.45.241 (1a2f2fa CY)` minimal.
2. **`/etc/dsc-hub/hostapd.conf`** (backup at `hostapd.conf.bak-20260827`): added `max_num_sta=32`, `macaddr_acl=0`, `deny_mac_file=/etc/dsc-hub/hostapd.deny`.
3. **`/etc/dsc-hub/hostapd.deny`**: contains stray non-fleet client `34:6f:24:da:41:77` (Digital-Matter, was leasing 10.42.0.132) so it can never take a fleet slot. Verified not associated post-fix.

### result

- **10/10 stations stable for 15 min** post-reboot; all fleet IPs (.10 .11 .21–.24 .50 .51 .54 .55) pinged UP simultaneously in 18/20 polls (misses were single-ping latency blips). Nothing left in fallback SoftAP; no rescue needed.
- dsc-hub-ap.service active, wlan0 10.42.0.1/24, all 5 docker containers up, `/health` ok (7.1.0).

### revert (if minimal firmware misbehaves)

- `sudo update-alternatives --set cyfmac43455-sdio.bin /lib/firmware/cypress/cyfmac43455-sdio-standard.bin && sudo reboot` (or `--auto cyfmac43455-sdio.bin` to return to auto/standard).
- hostapd config revert: restore `/etc/dsc-hub/hostapd.conf.bak-20260827`.

### notes / soak

- Minimal firmware drops some offload features; community reports perf degradation ~15–20 **active** clients. Fleet is 10–11 — fine, but note if the AP ever grows.
- POT3 (10.42.0.23) associates and holds a slot while out-of-service in inventory (ties into F-003).
- No USB WiFi NIC present (`lsusb`: CP210x + CH340 serial, Samsung SSD only) — second-AP option would need hardware if ever revisited.
- Rescue-script incident (~01:41–02:10): `/tmp/flash-sonoff-fallback-remote.sh` hung >25 min on a single `iw dev wlan0 scan` spinning at 100% CPU with wlan0 down; killed only that stuck `iw` PID, script's own timeout+EXIT trap then restored the AP cleanly. If the script is reused, wrap the scan in `timeout 30`.
- Stale root process on Pi since Aug 26 14:35: `esphome run dsc-hub.yaml --device 10.42.0.10` (PID 687046) still running — harmless log-follow, but kill on next maintenance touch.

---

## 2026-08-27 — appliance driver alias fix — in workspace, not yet committed

> **CLOSED 2026-08-27 (7.1.2)** — Fix in tree + unit test. See [`docs/qa/AUDIT-CLOSURE-7.1.2.md`](qa/AUDIT-CLOSURE-7.1.2.md) WR-P0-1. Historical notes retained below.

- During the heatmat demand→relay proof (acceptance #1), `brain/dsc_brain/appliance_driver.py` `_read_hub_demands` was emitting undiscovered `DEMAND_TO_SEAT` aliases as False; the phantom `growmat_demand` overwrote the real `grow_mat_demand` ON every ~2 s tick → heatmat relay physically chattered ON/OFF (~10 s period, `fleet_history` 16:52–16:55Z). Fixed to only report object_ids discovered on the hub; heatmat then proved cleanly (details in `docs/ops/SOAK-2026-08-26.md`).
- **Workspace source is present** (confirmed 2026-08-27 closure coordinator): `_read_hub_demands` → `_demands_from_discovered` reports discovered oids only. Live on the Pi since 16:57Z 2026-08-26 (`/opt/dsc-hub-repo/brain` synced, `dsc-hub-brain:7.0.0` rebuilt). This pass did **not** redeploy.
- Unit test landed: `test_appliance_undiscovered_aliases_not_emitted` in `brain/tests/test_brain_pi.py` (undiscovered aliases must not be emitted as False).
- Still **not git-committed**. Signoff commit must include `appliance_driver.py` + the test, or a clean-checkout deploy will regress the chatter bug.
- Changelog/release bullets drafted at [`docs/qa/RELEASE-7.1.2-DRAFT.md`](qa/RELEASE-7.1.2-DRAFT.md) — siblings fill tent selector / sprout-date / pot3 Add-as-Plant / UX pass 2.

---

## 2026-08-27 — DSC-Brain DHCP moved off .30

> **CLOSED 2026-08-27 (full-software pass)** — Docs, deploy scripts, Kuma/LIVE-ACCEPTANCE, and closure audit now point at **`.48` / `dsc-brain.local`**. Pin DHCP back to `.30` is ops-only if desired.

- Category: `ops`
- After the overnight hang/reboot, `dsc-brain.local` resolved to **192.168.86.48** (TTL 64). `.30` still pings (TTL 255, MAC `E8-16-56-53-EC-AD`) but SSH/:8787 refused — not the Pi.
- Pin a Nest DHCP reservation for the Pi MAC back to `.30`, or update docs/Kuma to `.48` / mDNS.

## 2026-08-27 — Overview banner says HUB OFFLINE while `/fleet` hub.online is true

> **CLOSED 2026-08-27 (7.1.2)** — Hub online chip reconciled. See [`docs/qa/AUDIT-CLOSURE-7.1.2.md`](qa/AUDIT-CLOSURE-7.1.2.md) DA-P0-2. Historical notes retained below.

- Category: `next-plan`
- During the pot3 full-grow demo the SPA banner stayed **HUB LINK DOWN / HUB OFFLINE** even while `GET /fleet` reported `hub.online=true` and Native API selects succeeded. Do not treat the banner as fleet truth until the link chip is reconciled.

## 2026-08-27 — Overview pot moisture band ≠ Root pot want

> **CLOSED 2026-08-27 (7.1.2)** — Shared `potWantBand`. See [`docs/qa/AUDIT-CLOSURE-7.1.2.md`](qa/AUDIT-CLOSURE-7.1.2.md) GAUGE-P0-1. Historical notes retained below.

- Category: `next-plan`
- Overview Root & tank hardcodes moisture 30–70 (`DashRootTankSection`). Root page uses `potWantBand`. Live: Overview P2 19.5% is amber; Root POT 2 moisture 19.5% is green. Same reading, two stories. Align the Overview strip to the seat want band.

## 2026-08-27 — `/fleet/computed` is ~6.4s and the SPA used to poll it every 2s

> **CLOSED 2026-08-27 (full-software pass)** — Hot/cold cache + `runtime_history.py` memo; `soak-check.sh` alerts if >3s. Poll guard (5s + in-flight) retained. Historical notes retained below.

- Category: `next-plan`
- Cold curls of `http://192.168.86.30:8787/fleet/computed` consistently take ~6.4s. The SPA was polling every 2s, so three requests piled up, starved `/fleet` + the websocket, and the UI wedged on "Connecting to fleet…".
- Frontend guard landed in UX pass 2 (`useBrain.tsx`): in-flight lock + 5s poll. That unblocks the dashboard; it does **not** make `/fleet/computed` fast.
- Next: profile the computed helpers on the Pi (likely a serial HA/state walk) and cache or slim the payload. Do not raise the poll rate again until the endpoint is under ~1s.

---

## 2026-08-27 — relationship audit 7.1 (object graph)

> **CLOSED 2026-08-27 (7.1.2)** — All P0/P1 audit items fixed. See [`docs/qa/AUDIT-CLOSURE-7.1.2.md`](qa/AUDIT-CLOSURE-7.1.2.md). Historical notes retained below.

Source: [`docs/qa/RELATIONSHIP-AUDIT-7.1.md`](qa/RELATIONSHIP-AUDIT-7.1.md). Distinct from DEVICE / ZIGBEE / WORKFLOW / INPUT-REPLICATION. pot3 left OOS. No commit/demand/OTA/permit-join/tent write.

### red-flag (P0)

| ID | Item | Notes |
|---|---|---|
| REL-P0-1 | Three plant records, UI has no single SoT | SQLite `/roster` empty; 8-slot JSON empty; compose helpers still hold Northern Lights / QA Dummy → pot3 / 2×4 plus pot1 helper name `Amnesia Blue`. Revert cleared the seat, not the draft. |
| REL-P0-2 | SPA seat graph never sees inventory `in_service` | `fleetToHass` merges `/fleet/computed` extras only; extras omit `input_boolean.dsc_potN_in_service`; `isPotInService` defaults missing to ON → pot3 re-enters the plant/tent UI while inventory is OOS. |
| REL-P0-3 | 2×4 photoperiod parented to 4×8 SF1000 | `LivePages` / `PlantExtra` / clone dark-period / `dsc_lights_on_today_2x4` all use `light.dsc_hub_sf1000_dimmer`. Lighting derived from the wrong tent. |

### next-plan (P1)

| ID | Item | Notes |
|---|---|---|
| REL-P1-1 | Dual in-service SoT | Hub FW `switch.dsc_hub_potN_in_service` all off; brain inventory pot1/2/4 on. Mat demand ON, votes off, no plants. |
| REL-P1-2 | Empty pots synthesize `veg` + ghost tent | Computed `growth_stage=veg` with no roster row; pot1 tent=`clone` → 2×4 cockpit can count a phantom plant. |
| REL-P1-3 | No mother/clone plant edge | `clone_mode=Mother` is a lighting preset. Automation first-wins among 2×4 recipes and writes hub `grow_stage`. |
| REL-P1-4 | Tent vocabulary / silent default | `tent_id()` unknown → `main`. Slots store `4x8`/`2x4`; pot helpers store `main`/`clone`. Apply-tent error blames the hub. |
| REL-P1-5 | Appliance demand not on inventory | No `demand_oid` in `extra`. AC/mister are demand-only (no seat). `reduced_kit` binary stays off while attributes list planned OOS. |
| REL-P1-6 | Zigbee placement graph empty | 0 devices, 0 placements; `zigbee_permit_join=true` leftover. Do not toggle join from this item. |

---

## 2026-08-27 — Settings completeness / honesty (7.1 audit)

> **CLOSED 2026-08-27 (7.1.2)** — All P0/P1 audit items fixed. See [`docs/qa/AUDIT-CLOSURE-7.1.2.md`](qa/AUDIT-CLOSURE-7.1.2.md). Historical notes retained below.

Source: [`docs/qa/SETTINGS-AUDIT-7.1.md`](qa/SETTINGS-AUDIT-7.1.md). Live Brain `192.168.86.48:8787` / `dsc-brain.local`. Danger controls not fired.

### red-flag

- ESPHome Queue OTA/compile is a sqlite ticket with no worker; copy says flashes go over the air. Two jobs already `queued` (control, hub).
- Apply network copy says it restarts the hub Wi-Fi; `apply_network_configs()` only writes hostapd/dnsmasq files.
- Settings seat `control` does not resolve `fleet.panel` — live panel shows as CONTROL OFFLINE.
- `GET /settings` returns AP PSK in plaintext and unused HA dumps (`compose_helpers_json`, `plant_roster_slots_json`).

### next-plan

- One in-service SoT: Settings sqlite vs disabled Fleet Overview `input_boolean`s vs hub `switch.dsc_hub_*_in_service` (pots 1–3 off while inventory pot1/2/4 on). AC / mister / tank missing from Settings inventory.
- Device assignment extras (`function` / `placement` / `capability_max_pct`) are write-only. No extra-sensor or Zigbee placement UI.
- Show product FW 7.0.0.0 **and** ESPHome 2025.12.4; stamp sonoff/panel online+FW on the ESPHome table (live sonoffs currently “offline” there).
- Zigbee: join-state chip, refresh, stick-down honesty. Sqlite `zigbee_permit_join=true` vs z2m yaml `permit_join: false`; device list empty.
- Import backup needs a confirm. Map `/#/settings` → `/#/fleet/settings`. Per-device calibration is `/fleet/calibrate` only (DB empty).

## 2026-08-27 — Interactive audit 7.1 (controls / behavior)

> **CLOSED 2026-08-27 (7.1.2)** — All P0/P1 audit items fixed. See [`docs/qa/AUDIT-CLOSURE-7.1.2.md`](qa/AUDIT-CLOSURE-7.1.2.md). Historical notes retained below.

Source: [`docs/qa/INTERACTIVE-AUDIT-7.1.md`](qa/INTERACTIVE-AUDIT-7.1.md). Visual/design is a sibling pass. Do not treat Fleet toggles or demand tiles as safe until these land.

### red-flag (P0)

- **IA-P0-1** Climate demand tiles (Heat/Cool/Hum/Dehum/Mat/Mister) and mode toggles write the hub on one click. No DecisionLayer. Cool ○ still looks armed when AC is capacity-offline.
- **IA-P0-2** Settings **In service** checkboxes (`patch_inventory`) write immediately, including **hub**. No confirm. A11y tree marks them `readonly`.
- **IA-P0-3** Settings **Queue OTA** ×10 has no confirm — same button chrome as Test CannaLib.
- **IA-P0-4** Fleet / Learning `input_boolean` in-service `EntityToggle`s are **dead on the live Pi** (disabled, `—`). Kit gates only work via Settings checkboxes.
- **IA-P0-5** Entity inspector **Turn on / Turn off** is a second unguarded demand path for switch/light/`input_boolean`.
- **IA-P0-6** Light / 2×4 **SF1000** `EntityToggle` writes the lamp immediately (dark-period risk).

### next-plan (P1)

- **IA-P1-1** Closed BandChart history drawer leaks 8 tab stops (Close×2 + timespan) on every route.
- **IA-P1-2** DecisionLayer does not trap Tab or hide the page (Apply network, honesty, Compose pickers).
- **IA-P1-3** Overview/Dash Running chips look identical to clickable Fan chips but do nothing.
- **IA-P1-4** Gauge/KPI hit-targets look like readouts; a11y name is SVG title soup.
- **IA-P1-5** Want / photoperiod / seat fields commit on blur with no undo.
- **IA-P1-6** `EntityToggle` tooltip is the raw entity id.
- **IA-P1-7** Settings assignment inputs unlabeled; Channel combobox a11y name `1611`.
- **IA-P1-8** Kit Pulse SVG nodes are unnamed `role="button"`.
- **IA-P1-9** Roster rows are mouse-only `<tr onClick>`.
- **IA-P1-10** Root pot card head is clickable with `role="presentation"`.
- **IA-P1-11** Permit join / backup import / Reload catalogs / tent Apply have no confirm.
- **IA-P1-12** Research / catalog pick writes build helpers without confirm.
- **IA-P1-13** Calibrate / Learning “Start session” holds fans with one button.
- **IA-P1-14** “Connecting to fleet…” has no retry/timeout.

## 2026-08-27 — Workflow audit 7.1 (operator jobs)

> **CLOSED 2026-08-27 (7.1.2)** — All P0/P1 audit items fixed. See [`docs/qa/AUDIT-CLOSURE-7.1.2.md`](qa/AUDIT-CLOSURE-7.1.2.md). Historical notes retained below.

Source: [`docs/qa/WORKFLOW-AUDIT-7.1.md`](qa/WORKFLOW-AUDIT-7.1.md). Distinct from design (visuals) and interactive (per-control). These are chain breaks: grower cannot finish the job.

### red-flag (P0)

- **WF-P0-1** Overview P1 moisture is grey `—` while `/fleet` pot1 is 21.9% and `/history?entity_id=sensor.dsc_pot1_soil_moisture` has hours of points. `ENTITY_FLEET_MAP` maps `sensor.dsc_pot1_got_moisture` but **not** `sensor.dsc_pot1_soil_moisture` (pots 2–4 have both). Overview Root strip reads `_soil_moisture` only. Operator cannot see pot1 health on the landing page.
- **WF-P0-2** Retire does not clear the Compose draft. Live helpers still hold Northern Lights / `QA Dummy (pot3 test)` / sprout `2026-07-09` / assign pot **3** / tent 2×4 after roster `[]` and pot3 OOS. One **Commit + assign** re-seats pot3. `retire_plant` never resets `input_text.dsc_build_*` / `input_select.dsc_build_assign_pot`.
- **WF-P0-3** Settings **Queue OTA** is a sqlite row only (`status=queued`, detail says open `:6052` or `docker exec`). Two stale jobs (control + hub) from ~05:00Z still queued. No worker. Firmware recovery is ops scripts, not the SPA.

### next-plan (P1)

- **WF-P1-1** Dual in-service SoT: inventory pot1/2/4 `in_service=true`, hub `switch.dsc_hub_potN_in_service` all **off**. Settings checkbox writes inventory only. Fleet/Learning `input_boolean` toggles are dead on Pi (IA-P0-4). Grower cannot tell which gate the mat/alerts actually use.
- **WF-P1-2** Settings seat `control` vs fleet `panel`: `/fleet` `panel.online=true` (10.42.0.11, fw 7.0.0.0) but Settings card is **CONTROL OFFLINE** because `resolveSeat` only matches `seatId === "panel"`.
- **WF-P1-3** pot3 OOS is hidden from `/fleet.pots`, so Settings shows pot3 **OFFLINE** (not “out of service”). Honesty lie.
- **WF-P1-4** Alert → playbook is prose only. Inspector has no “open Climate / Light / Root” CTA except the Capacity-offline banner. Grow log dark-period lines are not clickable.
- **WF-P1-5** `apply_climate_want` reads `dsc_build_assign_pot`, not `dsc_build_climate_pot`. UI label “Climate apply pot” is a dead selector.
- **WF-P1-6** Compose auto-stage chip (`sensor.dsc_build_expected_stage`) did not render on live Compose despite sprout `2026-07-09` (computed extras lag / `/fleet/computed` ~6s). Seat sprout/tent editors require a seated plant; empty roster is a dead end for workflow 3.
- **WF-P1-7** Hash-jump / CDP navigate can unmount `#root` to “Connecting to fleet…” (title fallback 7.0.0). In-app tab clicks recovered; no error boundary (already noted in interface follow-ups).

## 2026-08-27 — Device audit 7.1 (physical + ESPHome fleet)

> **CLOSED 2026-08-27 (7.1.2)** — All P0/P1 audit items fixed. See [`docs/qa/AUDIT-CLOSURE-7.1.2.md`](qa/AUDIT-CLOSURE-7.1.2.md). Historical notes retained below.

Source: [`docs/qa/DEVICE-AUDIT-7.1.md`](qa/DEVICE-AUDIT-7.1.md). Distinct from Zigbee. Read-only; pot3 left OOS.

**Live counts:** inventory 10/10; in-service 9/9 online at `7.0.0.0`; AP 10/10 (pot3 still associated). `appliance_link` true; heatmat demand/relay ON, other Sonoffs OFF/OFF. Brain is `.48`; `.30` is not the Brain (reconfirmed). pot3 `in_service` **false** — the morning “still in_service true” outage note is superseded.

### red-flag (P0)

- **DV-P0-1** Settings ESPHome table + `resolveSeat("control")` tell the operator live nodes are dead. `/settings/esphome/devices` only merges online/FW for `hub` + `pots{}` — panel and all four Sonoffs render **offline** while `/fleet` has them at `7.0.0.0`. Same alias hole as **WF-P1-2**; the table makes it fleet-wide. Fix: map `control`→`panel`, merge `sonoffs` + `panel` in `settings_esphome_devices`.
- **DV-P0-2** Ingest never expires `online`. Failed Native API poll keeps the previous `SeatState`. Overview/Fleet will say online when the node is dead. Expire after N missed cycles (serial poll is ~30–90 s — do not use a 45 s cut).

### next-plan (P1)

- **DV-P1-1** Dual `in_service` SoT (same as **WF-P1-1**): inventory pot1/2/4 on; hub `switch.dsc_hub_potN_in_service` all off. Settings writes sqlite only.
- **DV-P1-2** Inventory `mac` all null; live `dnsmasq` reservations are IP-only. Operator cannot pin a radio to a seat from Settings. ARP on the Pi has the MACs (see audit table).
- **DV-P1-3** Compose leftovers still target pot3 (same as **WF-P0-2**). Do **not** flip pot3 `in_service` to clean this up.
- **DV-P1-4** pot4 in service + online + `7.0.0.0` with moisture/soil T/pH **null**. Kit map can show idle. Hardware isolate still open.
- **DV-P1-5** `system.appliance_link` is hub-demand freshness (`hub_ok`), not per-Sonoff reachability. True today because all four are up.
- **DV-P1-6** Grow stage Off but `4x8_window_open` true; SF1000 `on` at PWM 1; grow-log dark-period violations.

### deferred (P2)

- pot3 holds an AP slot while OOS (F-003).
- Live `dnsmasq.conf` still has `dhcp-host=10.42.0.5,dsc-bridge`.
- 8-sta cap not firing (10/10, minimal blob, `max_num_sta=32`); `update-alternatives` **Best** is still `cyfmac43455-sdio-standard.bin` — `--auto` would regress.

---

## 2026-08-27 — Input audit 7.1 (form fields)

> **CLOSED 2026-08-27 (7.1.2)** — All P0/P1 audit items fixed. See [`docs/qa/AUDIT-CLOSURE-7.1.2.md`](qa/AUDIT-CLOSURE-7.1.2.md). Historical notes retained below.

Source: [`docs/qa/INPUT-AUDIT-7.1.md`](qa/INPUT-AUDIT-7.1.md). Distinct from INTERACTIVE (clickables). Live `.48` / `dsc-brain.local`. Did not Commit, Apply network, Save settings, save cal, start a fan hold, toggle In service, or change a live plant sprout.

**Counts:** 143 input instances · 59 roles scored · **41 fail (69%)**. Forms are **not operator-safe**.

### red-flag (P0)

| ID | Item | Notes |
|---|---|---|
| IN-P0-1 | Compose confirm-copy vs persist-on-blur | Footer says every action confirms. Nickname / sprout / slot / tent / assign / tank / strength / layer names / recipe write `POST /control/service` on blur or change. Live draft still Northern Lights / QA Dummy / pot 3 (WF-P0-2). |
| IN-P0-2 | Nutrient slots 1–8 dead | Name + ml/L `disabled` on the live Pi. Helpers not on the bus. “Add from catalog” writes the same missing entities. |
| IN-P0-3 | Learning numbers dead + max=100 fallback | Sample / EMA / 20 curve points disabled. `TargetNumber` uses `attributes.max ?? 100`. HA YAML CFM 1500 / PPFD 3000 / m/s 50 — a future write would clamp CFM to 100. |

Already owned elsewhere (do not duplicate work): IA-P0-2 In service immediate; Settings audit PSK in `GET /settings`; IA-P1-5 Want/seat blur no undo.

### next-plan (P1)

| ID | Item | Notes |
|---|---|---|
| IN-P1-1 | Photoperiod time inputs dead | `4×8 opens` and `2×4 lights-on` disabled and empty. Sunrise/sunset/min dark/2×4 hours still persist on blur. |
| IN-P1-2 | TargetNumber range/units | Climate VPD unlabeled, DOM 0–100 kPa. Temp max 100 °C. Light hours max 100. Silent clamp, no error text. |
| IN-P1-3 | Catalog empty-flash + unlabeled search | First paint “No catalog hits” then proxy fills. Research search has no label. Placeholder “options are not culled.” Empty browse not cultivar-clean. Typeahead itself works. |
| IN-P1-4 | Calibrate light no max | Height/LUX/PAR accept 999999. Error only on Save, and only for LUX ≤ 0. |
| IN-P1-5 | Save settings is one unguarded PATCH | AP + Ollama + CannaLib together. Apply network has DecisionLayer; Save settings does not. |

---

## 2026-08-27 — Wiring audit 7.1 (physical + firmware channels)

> **CLOSED 2026-08-27 (7.1.2)** — All P0/P1 audit items fixed. See [`docs/qa/AUDIT-CLOSURE-7.1.2.md`](qa/AUDIT-CLOSURE-7.1.2.md). Historical notes retained below.

Source: [`docs/qa/WIRING-AUDIT-7.1.md`](qa/WIRING-AUDIT-7.1.md). Distinct from DEVICE (seats/IPs), RELATIONSHIP (plant graph), ZIGBEE. Read-only; no demand slam; pot3 left OOS.

**Counts:** 9 wired actuator channels (4 Sonoff GPIO12 + 4 fan PWM + SF1000); 7 sensor buses; 3 named demands with no GPIO (AC, mister, GPIO5). `appliance_link` true = hub-poll freshness, not outlet proof.

### red-flag (P0)

- **WR-P0-1** Uncommitted `growmat_demand` alias fix — same gate as the 2026-08-27 appliance-driver FOLLOWUPS entry. Clean-checkout deploy will chatter the heatmat again. Do not re-slam to prove it.

### next-plan (P1)

- **WR-P1-1** Heatmat ON via clone-air proxy: hub `potN_in_service` + all `mat_vote_pot_*` OFF while inventory pot1/2/4 are in service. Switch name says root-zone; ladder is heating because clone air 23.7 °C < 25 °C. Wiring consequence of **DV-P1-1** — sync hub pot in-service / votes to inventory, or the mat name is a lie.
- **WR-P1-2** `humidifier_intake_routing` live **OFF**; firmware default ON “matches confirmed physical placement.” No inventory `extra.placement`. Either the humidifier moved or the toggle drifted — plume steering is off either way.
- **WR-P1-3** `control_ops` + Kit Pulse still name `switch.dsc_ac_main_relay` / `switch.dsc_clone_humidifier_main_relay`. No GPIO, no inventory seats (F-001 / F-002). Demand switches are honest-off; the relay entity ids are ghosts.

F-001 / F-002 / GPIO5 4×8 lamp stay in the keep-open hardware list — not re-opened here.

---

## 2026-08-27 — Fallback / recovery audit 7.1

> **CLOSED 2026-08-27 (7.1.2)** — All P0/P1 audit items fixed. See [`docs/qa/AUDIT-CLOSURE-7.1.2.md`](qa/AUDIT-CLOSURE-7.1.2.md). Historical notes retained below.

Source: [`docs/qa/FALLBACK-AUDIT-7.1.md`](qa/FALLBACK-AUDIT-7.1.md). Distinct from DEVICE (seat health), SETTINGS, ZIGBEE. Read-only; SoftAP/join left off.

**Live:** Brain `.48` / `dsc-brain.local`; `.30` not Brain. AP 10/10, `max_num_sta=32`. `/health` 7.1.0. Fallback flash scripts **not on the Pi**.

### red-flag (P0)

- **FB-P0-1** Recovery wrappers / LAN-first OTA still aim at `192.168.86.30` and studio `192.168.86.50/.51/.54/.184`. Fleet is `10.42.0.x`. `.51` and `.54` still ping on the house LAN — wrong-box flash risk. Fix defaults to `.48` / `dsc-brain.local` and OTA `10.42.0.50+` first.
- **FB-P0-2** `network_apply.render_hostapd_conf` and `pi-bootstrap.sh` omit `max_num_sta=32` + deny. Copy-Apply or re-bootstrap undoes the 8-sta heal and orphans two seats into SoftAP. Cross-ref SETTINGS Apply-lie + DEVICE `--auto` blob note.
- **FB-P0-3** `flash-sonoff-fallback-remote.sh` (untracked, CRLF) and `flash-hub-fallback-remote.sh` are not on the Pi. Unbounded `iw scan` already hung hostapd once. No on-box recover path; wrap scan in `timeout 30`.

### next-plan (P1)

- **FB-P1-1** CannaLib “local fallback” is a lie: `local_db_present=false` and `catalog_search` never reads sqlite.
- **FB-P1-2** `dsc-hub-ap.service` is oneshot — hostapd death after start is silent. Need a real recover/watchdog (not another flash script).
- **FB-P1-3** All pots share `DSC-POT Fallback Hotspot` — two-pot SoftAP collision.
- **FB-P1-4** Live soak cron ≠ repo `soak-check.sh`. 15:00Z logged `sonoffs=2/4` with no alert. T+24h not closed.
- **FB-P1-5** `apply_clone_tent_automation` skip/retry has no unit test; helper fallback can look applied. Couples to DV-P0-2 stale `hub.online`.
- **FB-P1-6** `deploy-brain` / `verify-brain` / `island-proof` / `soak-check` ps1 default `10.42.0.1` — dead from studio LAN Windows.
- **FB-P1-7** No pot/control flash-fallback script (hub + Sonoff only).

---

## 2026-08-27 — Input replication audit 7.1 (multi-surface honesty)

> **CLOSED 2026-08-27 (7.1.2)** — All P0/P1 audit items fixed. See [`docs/qa/AUDIT-CLOSURE-7.1.2.md`](qa/AUDIT-CLOSURE-7.1.2.md). Historical notes retained below.

Source: [`docs/qa/INPUT-REPLICATION-AUDIT-7.1.md`](qa/INPUT-REPLICATION-AUDIT-7.1.md). Distinct from INPUT-AUDIT (per-field validation — file not in tree this pass), SETTINGS, INTERACTIVE, RELATIONSHIP, WORKFLOW. Live `.48`. No plant commit, Apply network, cal save, demand, or pot3 in-service.

Replication **confirms** REL-P0-1 (three plant records) and REL-P0-2 (Crop Scheduler treats missing `in_service` helper as ON). Not re-opened as new IDs.

### red-flag (P0)

| ID | Item | Notes |
|---|---|---|
| REP-P0-1 | Stage / clone-mode chips are not the Compose plant | Live: Compose auto-stage **Late (Push) Vegetative**; hub `grow_stage` **Off**; all pot `growth_stage` **veg** (empty-roster default); Crop Scheduler expected stage **—**. Grow log 06:06–06:11 flipped Late Push Veg / Mother → Off / Custom. No SPA editor on those chips. `apply_clone_tent_automation` + hub are silent writers. |

### next-plan (P1)

| ID | Item | Notes |
|---|---|---|
| REP-P1-1 | Calibrate vs Learning are clone skins | Calibrate: local m/s until Save. Learning: `TargetNumber` blur on the same `input_number.dsc_cal_*`. Merge or label one owner. |
| REP-P1-2 | CannaLib URL ≠ catalog search | Settings `cannalib_api_url` is not what Pi `CatalogPicker` fetches (`/v1/catalogs`). Dash CANNALIB OFF is a third copy. |
| REP-P1-3 | Settings Save vs Apply share one draft blob | Typing CannaLib then Apply persists integrations; typing SSID then Save persists AP without applying Wi-Fi. Split drafts. |
| REP-P1-4 | 4×8 Want hours parented to hub stage Off | `sensor.dsc_expected_light_hours=0` while Compose day-48 veg and 2×4 hours=18. |
| REP-P1-5 | Seat drafts + two litre fields | `PlantSeatPanel` resyncs only on pot change. Compose Tank L ≠ vessel L (`dsc_mix_tank_liters` vs `dsc_blend_total_l`). |

---

## 2026-08-27 — Full design audit (visual / IA)

> **CLOSED 2026-08-27 (7.1.2)** — All P0/P1 audit items fixed. See [`docs/qa/AUDIT-CLOSURE-7.1.2.md`](qa/AUDIT-CLOSURE-7.1.2.md). Historical notes retained below.

Source: [`docs/qa/DESIGN-AUDIT-7.1.md`](qa/DESIGN-AUDIT-7.1.md) § Full design audit (2026-08-27). Live Brain `.48:8787`, bundle `index-DwSYxFmR.js`. Distinct from INTERACTIVE / WORKFLOW / SETTINGS / RELATIONSHIP. Do not treat as a theme-tweak list.

### red-flag (P0)

| ID | Item | Notes |
|---|---|---|
| DA-P0-1 | Twin keepalive canvas steals clicks on 2×4 / 4×8 | `TwinKeepAlive.tsx` + `.dsc-twin-keepalive.is-active`. Click on Hub Details intercepted by `<canvas>`. Cage pointer-events to the Twin host only. |
| DA-P0-2 | Dash System map says HUB OFFLINE while React says HUB ONLINE | `DashHomePage.tsx` `LegacyCardHost` / `dsc-system-map-card`. Same honesty class as the Overview banner follow-up; this is the leftover Lovelace island. Cut or bind to fleet hub.online. |

Already logged (do not duplicate work): **WF-P0-1** Overview P1 moisture hole; **REL-P0-2** SPA never sees inventory `in_service` (Root “4 of 4 pots in service”).

### next-plan (P1)

| ID | Item | Notes |
|---|---|---|
| DA-P1-1 | Hub link Age is a raw float (`20402.7890625`) | `HubLinkLine.tsx` `String(uptime)` — format with `fmtDurationMs` / hours. |
| DA-P1-2 | Seat moisture IEEE leftover (`Got M 21.80000114440918`) | `seatModel.buildPlantSeat` + Mission / 2×4 chips. Format to 1 decimal. Pass 1 claimed no runoff. |
| DA-P1-3 | Light hours gauge wears `is-ok` at 0.00 h | `LightPage.tsx` ArcGauge. Collides with Overview “green = in band.” Use teal-muted progress, not in-band green. |
| DA-P1-4 | Live IA: Overview ≈ Dash ≈ Mission | `routes.ts` — nine Live tabs. Kill or demote Dash/Mission before more polish. |
| DA-P1-5 | Jargon leftovers after the copy purge | KIT HONEST (`Honesty.tsx`); History “THIN RECORDER” + “HA Home gauge popups”; lung / NO PLANT/STAGE RAIL / `W— · Need —`; Fleet Alerts subtitle is `CfmTrustLine`; “Panel product shell.” |
| DA-P1-6 | Fleet 7/11 KPI is green | Incomplete kit is not in-band. Pass 1 screenshot had it red. |

Already logged: Overview vs Root moisture bands (FOLLOWUPS 2026-08-27); **IA-P1-14** connecting splash; **IA-P1-1** closed-drawer tab leak; **IA-P0-1** / **IA-P1-3** demand tiles vs chrome.

---

## 2026-08-27 — Gauge audit 7.1 (rings / bars / bands)

> **CLOSED 2026-08-27 (7.1.2)** — All P0/P1 audit items fixed. See [`docs/qa/AUDIT-CLOSURE-7.1.2.md`](qa/AUDIT-CLOSURE-7.1.2.md). Historical notes retained below.

Source: [`docs/qa/GAUGE-AUDIT-7.1.md`](qa/GAUGE-AUDIT-7.1.md). Distinct from UX / DESIGN (broader UI). Rainbow fragments confirmed gone. pot3 left OOS. No demand / setpoint / commit.

### red-flag (P0)

| ID | Item | Notes |
|---|---|---|
| GAUGE-P0-1 | Overview vs Root moisture two-story | Overview hardcodes 30–70; Root uses `potWantBand` (default **0–45** when plant Want missing). Live P2 **19.4% amber vs green**. Elevates the earlier “Overview pot moisture band ≠ Root pot want” next-plan. Align both to the seat rail; missing rail = unbanded teal, not a fake in-band. |
| GAUGE-P0-2 | Overview P1 grey empty while fleet/Root show 21.8% | Same hole as **WF-P0-1** (`ENTITY_FLEET_MAP` misses `sensor.dsc_pot1_soil_moisture`). Gauge pass re-confirmed on `.48`. Fix once. |

### next-plan (P1)

| ID | Item | Notes |
|---|---|---|
| GAUGE-P1-1 | Overview Room T/RH inherit 4×8 Want | Climate room triad is correctly teal / no band. Lung is not the tent. |
| GAUGE-P1-2 | Climate Got/Want T always neon | Rows pass a single `want`, so `zoneTone` has no band. 4×8 Got 23 / Want 26 still green. Pass ±2 min/max. |
| GAUGE-P1-3 | `potWantBand` moisture default `{0,45}` | Dryback-shaped fake band. `lo > 0` also rejects a real 0 min. |
| GAUGE-P1-4 | Scale mismatch across pages | 4×8 T 10–40 vs 15–35; 2×4 VPD 0–2 vs 0–2.5. Number matches needle on one page only. |
| GAUGE-P1-5 | ±2 + 1 °C grace paints a 3 ° miss green | 4×8 T 23.0 / Want 26 was green; amber only after 22.7. |
| GAUGE-P1-6 | Room VPD `—` beside live T+RH | `sensor.dsc_hub_room_vpd_kpa` not on the fleet map. Do not invent kPa. |
| GAUGE-P1-7 | Root still paints five empty pot3 gauges | Kit Pulse / inventory OOS; `isPotInService` defaults missing boolean on. **REL-P0-2**. Hide the row — do not enable pot3. |

---

## 2026-08-27 — Zigbee full-path audit 7.1

> **CLOSED 2026-08-27 (7.1.2)** — All P0/P1 audit items fixed. See [`docs/qa/AUDIT-CLOSURE-7.1.2.md`](qa/AUDIT-CLOSURE-7.1.2.md). Historical notes retained below.

Source: [`docs/qa/ZIGBEE-AUDIT-7.1.md`](qa/ZIGBEE-AUDIT-7.1.md). Distinct from SETTINGS (UI catalog), DEVICE (ESPHome fleet), RELATIONSHIP (placement graph note). No deploy, no stick reset, permit-join **not** opened.

**Live:** Brain `.48` `/health` 7.1.0. End devices **0**. `dsc-hub-z2m` RestartCount **98**, `HOST_FATAL_ERROR`. SkyConnect v1.0 present. `database.db` 0 bytes. `/fleet.canopy` `{}`. Stale sqlite `zigbee_permit_join=true` **cleared to `false`** this pass (z2m was down; MQTT no-op). Relates to SETTINGS leftover + REL-P1-6.

**Verdict:** Zigbee is a stub, not a product path. MUST “devices can be added” and “user-defined function/placement/settings” both fail.

### red-flag (P0)

| ID | Item | Notes |
|---|---|---|
| ZB-P0-1 | z2m crash-loops; coordinator never up | Serial opens, EZSP `HOST_FATAL_ERROR`. Empty pairing DB. Stop the restart hammer before more ASH resets. Leading hypothesis: `adapter: ember` vs older SkyConnect EZSP firmware — confirm, do not factory-reset from this item. |
| ZB-P0-2 | “Zigbee devices can be added” is a lie | Settings empty-state + LIVE-ACCEPTANCE #8 PASS (“empty until paired”) hide a dead radio. |
| ZB-P0-3 | Permit-join payload/timer/flag | Publishes `{"permit_join": bool}`; z2m 2.13 wants `{"time": N}`. `duration_s` unused. Sqlite flag never expires. Frontend off — this is the only join door. |

### next-plan (P1)

| ID | Item | Notes |
|---|---|---|
| ZB-P1-1 | No create-extra-seat API | `PATCH /settings/inventory/{id}` 404s unknown seats. Cannot add a user-defined device. |
| ZB-P1-2 | No Zigbee rename / function / placement UI | `_placement_map` + `zigbee_placements` have no editor. Assignment table is the 10 ESPHome seats only. |
| ZB-P1-3 | Overview / Climate ignore canopy | Hub tent/clone/room only. `sensor.dsc_canopy_*` never bound. Intake T/RH would stay invisible. |
| ZB-P1-4 | No z2m / stick health on `/health` or Settings | Empty list ≠ stick-down. |
| ZB-P1-5 | Dual z2m volume mounts | Repo `configuration.yaml` bind vs `/var/lib/dsc-hub/z2m` (0-byte config, empty db). Backup of the data dir can miss the live file. |

---

## 2026-08-27 — UX / first-run mental model (7.1)

> **CLOSED 2026-08-27 (7.1.2)** — All P0/P1 audit items fixed. See [`docs/qa/AUDIT-CLOSURE-7.1.2.md`](qa/AUDIT-CLOSURE-7.1.2.md). Historical notes retained below.

Source: [`docs/qa/UX-AUDIT-7.1.md`](qa/UX-AUDIT-7.1.md). Distinct from DESIGN (visual), INTERACTIVE (per-control), WORKFLOW (job chains). Live Overview / Climate / Fleet / Settings on `.48`. No writes.

Already logged — do not duplicate work: **WF-P0-1** / **GAUGE-P0-2** (P1 moisture hole); **WF-P1-2** (CONTROL vs panel); **WF-P1-3** (pot3 empty vs OOS); **WF-P1-7** (no error boundary); **IA-P1-1** / **IA-P1-4** (drawer leak / gauge names); **REL-P1-4** (tent vocabulary in data); **DA-P1-4** / **DA-P1-5** (Live IA + jargon, filed as P1 visual); **REP-P1-1** (Calibrate vs Learning); Overview HUB OFFLINE vs `/fleet` (2026-08-27 next-plan).

### red-flag (P0)

| ID | Item | Notes |
|---|---|---|
| UX-P0-1 | Three homes + nine Live tabs | Overview / Mission / Dash(title Home) / Twin are peer destinations. Elevate **DA-P1-4**: a tired grower cannot answer “where am I?” in 60s. One Live home; demote the rest. |
| UX-P0-2 | Four names for two tents | Chrome 4×8/2×4 vs hub `4x8 Main`/`2x4 Clone` vs clone mode Mother/Custom vs grow log `Clone - Custom`. Elevate **REL-P1-4** to chrome copy, not just slot strings. |
| UX-P0-3 | Overview has no Brain/hub chip | KIT HONEST is the only global status. Dash/Mission show HUB ONLINE. Landing never forms “is the Brain up?” even when `/fleet.hub.online=true`. |
| UX-P0-4 | Empty / live / OOS share one `—` | Mental-model face of **WF-P0-1** + **WF-P1-3**. P1 looked dead (fleet 21.8%); P3 looked the same (OOS); P4 is a true empty. Three states, one glyph. |

### next-plan (P1)

| ID | Item | Notes |
|---|---|---|
| UX-P1-1 | First-run copy leftovers | Brand “Plausible Deniability”; KIT HONEST; Twin “hass ticks”; History “HA Home gauge popups”; Climate “umbrella lung” + a11y `no plant/stage rail`. Overlaps **DA-P1-5** — keep one fix list. |
| UX-P1-2 | Grow lands on Compose, not Roster | First Grow click is “build a blend.” Zero-plant state is not the default. |
| UX-P1-3 | Two Overview labels | Live Overview and Fleet Overview are both “Overview” in the second nav row. |
| UX-P1-4 | Amber means two things | Gauge amber = drifting. Running COOL/C-HUM amber = on. Same token, two stories. |
| UX-P1-5 | Grow log is a firehose | 80 rows / 24h of demand flicker + `Stage - Off; Clone - Custom`. Dark-period warnings drown. Filter or collapse repeats. |
| UX-P1-6 | 390px Live row clips Light | Secondary tabs are a fade-masked scroller, 40px tall. Live phone pass not completed (tab died). Confirm at 390px. |

---

## 2026-08-27 — Space / density (7.1)

> **CLOSED 2026-08-27 (7.1.2)** — All P0/P1 audit items fixed. See [`docs/qa/AUDIT-CLOSURE-7.1.2.md`](qa/AUDIT-CLOSURE-7.1.2.md). Historical notes retained below.

Source: [`docs/qa/SPACE-AUDIT-7.1.md`](qa/SPACE-AUDIT-7.1.md). Distinct from LAYOUT (overflow/overlap — that file was not in tree). Live first-fold at 1280×720 and 390×844 on `.48`. No writes.

Already logged — do not duplicate: **UX-P0-1** (nine Live tabs / three homes — IA reason chrome is tall); **UX-P1-1** (brand tagline); **UX-P1-3** (two Overview labels); **UX-P1-6** (390 clips Live pills — **confirmed** this pass: Climate is off the 390 fold).

### red-flag (P0)

| ID | Item | Notes |
|---|---|---|
| SP-P0-1 | Chrome + duplicate page header | Brand + honesty + two tab rows + H1 = content starts y=278 (39% of 720) / y=280–406 on 390. Collapse to two chrome rows; drop restated H1. |
| SP-P0-2 | TwinKeepAlive 70vh above Twin / 4×8 / 2×4 | Mounted before `<Routes>`. Page header at y≈940–1184. Cockpit (fans, seats, history) never on the first fold. Move canvas below header or make it a strip on tent pages. |
| SP-P0-3 | Settings inventory wall | No accordion. 18 cards; 3 on 1280 fold / 1 on 390. Empty `—` MAC/uptime/RSSI. Assignment / Network / Save at 5905–10827 px. Accordion by role; default-open offline+OOS. |
| SP-P0-4 | Overview Bands bury the glance | Bands card 600 px. Fan duties / Running / Root & tank / Grow log at y=892+. One compact 4×8+2×4 row so duties+root share 720. |

### next-plan (P1)

| ID | Item | Notes |
|---|---|---|
| SP-P1-1 | Duplicate CTAs | Overview Climate/Mission buttons; Mission NEXT repeats Open Twin / Climate Want. |
| SP-P1-2 | Compose scroll-to-commit | Commit + assign is card 4 (Light + assign). Nutrition is eight empty slots. Sticky act or lead with assign. |
| SP-P1-3 | Fleet KPI chrome | 7/11 + Surface 7.1.0 (already in header) + Alerts 0 own the fold. Pulse clipped; in-service toggles below. |
| SP-P1-4 | Climate Want/gauges below Command | 1280 can hit demand without seeing T/RH/VPD. 390 shows Hub °C only. Put triad or Want on the fold. |
| SP-P1-5 | Root one-pot fold | Coldest/mat KPIs skinny-wide; only POT 1 visible. |
| SP-P1-6 | Light WANT HOURS empty boxes | Auto photoperiod / hold clipped under 0.00 h heroes. |
| SP-P1-7 | Dash CannaLib tiles first | `/ops/home` fold is catalog bandwidth, not bands. |
| SP-P1-8 | Skinny-left wide cards | Learning wizards and Mission Hub Link hug the left of max-width 1600. |

---

## 2026-08-27 — Sensor-value audit 7.1

> **CLOSED 2026-08-27 (7.1.2)** — All P0/P1 audit items fixed. See [`docs/qa/AUDIT-CLOSURE-7.1.2.md`](qa/AUDIT-CLOSURE-7.1.2.md). Historical notes retained below.

Source: [`docs/qa/SENSOR-VALUE-AUDIT-7.1.md`](qa/SENSOR-VALUE-AUDIT-7.1.md). Distinct from GAUGE (rings), DEVICE (online/fw), WIRING (relays), ZIGBEE (join). Live `.48` `/health` 7.1.0. pot3 left OOS. No cal save / demand / Apply network.

Already logged — do not duplicate: **WF-P0-1 / GAUGE-P0-2** (Overview P1 moisture hole); **REL-P0-2 / GAUGE-P1-7** (4 of 4 / pot3 gauges); **GAUGE-P1-6** (Room VPD —); **ZB-P1-3** (canopy unused); **REL-P0-3** (2×4 hours parented to SF1000); **F-003 / POT4 isolate / F-008 / anemometer** (hardware keep-open).

### red-flag (P0)

| ID | Item | Notes |
|---|---|---|
| SV-P0-1 | `*_runtime_today` is UTC “today” | Brain container TZ UTC; host AEST. Dehum extras **19.09 h** at 06:45 AEST = ON since 2026-08-26 00:00Z. Local midnight recompute **5.36 h**. Set container `TZ=Australia/Sydney` or compute midnight in Sydney. |
| SV-P0-2 | `lights_on_today_{4x8,2x4}` permanent **0.0** | Metrics never written to `fleet_history` (`all=0`). 4×8 window on; hub `light_delivered_hours` **2.64**. Record light/window 0/1 or stop publishing 0.0 as a live hour. |
| SV-P0-3 | Air-path CFM labeled anemometer; digits are allocated proxies | Calibrate **0/4**. Climate shows in 170/94, dump 21, recirc 63. NP alert uses nameplate (inverted). Say “nameplate / allocated” or hide CFM until two curve points exist. |

### next-plan (P1)

| ID | Item | Notes |
|---|---|---|
| SV-P1-1 | EC not ingested | Firmware `soil_conductivity`; `POT_MAP` only `soil_ec`. Root EC — on live pot1/2. Map conductivity (+ N/P/K if we keep them as derived). |
| SV-P1-2 | Compose Day 48 / Late Veg leftover | extras + Compose vs roster `[]` vs hub stage Off. Clear build helpers on retire/revert. |
| SV-P1-3 | pot4 online + nulls; root fault stays off | Any other pot with soil T 5–45 clears the fault. Surface the dead probe without enabling pot3. |
| SV-P1-4 | pot3 ESP-NOW link on while OOS | Hub binary true; seat not ingested. Don’t paint a link without numbers. |
| SV-P1-5 | SF1000 ON / 0% / effectively_off | brightness 1; extras effectively_off on; 2×4 chip ON. One story. |
| SV-P1-6 | DutyStrip 24 h is 0.0H vs runtime KPI | Demand switches missing from `history_ops.ENTITY_METRIC_MAP`. |
| SV-P1-7 | `fleetToHass` skips `fleetFromHass` | extras-only holes feed Overview `num(soil_moisture)` and Climate room VPD. |

---

## 2026-08-27 — Theme tokens (7.1)

> **CLOSED 2026-08-27 (7.1.2)** — All P0/P1 audit items fixed. See [`docs/qa/AUDIT-CLOSURE-7.1.2.md`](qa/AUDIT-CLOSURE-7.1.2.md). Historical notes retained below.

Source: [`docs/qa/THEME-AUDIT-7.1.md`](qa/THEME-AUDIT-7.1.md). Distinct from DESIGN (visual language), SPACE, LAYOUT. Live `.48` / `dsc-brain.local`. pot3 left OOS. Apply network / demand not fired.

Already logged — do not duplicate: **WF-P1-7** (hash-jump unmount / connecting flash); **UX-P1-4** (amber = drift vs on — semantics, not attach). 7.1.2 attach fix (`:root` + `.dsc-root` wrap) **is live** — not reopened.

### red-flag (P0)

| ID | Item | Notes |
|---|---|---|
| TH-P0-1 | Typeless Settings `<input>` skip token skin | `input[type=text]` does not match `<input>` with no type. Assignment / AP SSID / Ollama / CannaLib render UA **white** fields. Backup link is `dsc-button` (no CSS). Skin `input:not([type])` or add `type="text"`. |

### next-plan (P1)

| ID | Item | Notes |
|---|---|---|
| TH-P1-1 | Button hierarchy unused | `.dsc-btn-primary/-secondary/-danger` live only on Compose / Calibrate / Learning. Overview / Settings Save still `primary`/`teal` (neon vs teal “primary”). |
| TH-P1-2 | Lime `#39ff14` leftover | ok-chips, demand-on, secondary active. Fights `--dsc-neon` `#66bb6a`. 7.1 already said kill this wash. |
| TH-P1-3 | Collapsed token aliases | `--dsc-blue`≡`--dsc-teal`, `--dsc-gray-4`≡`--dsc-gray-5`, `--dsc-black-2`≡`--dsc-gray-1`, `--dsc-bad`≡`--dsc-bad-soft`. |
| TH-P1-4 | Chart / lung hex bypass | `BandChartHost` Tailwind (`#f97316` `#22c55e` `#3b82f6`…); AirPath/Lung `#b388ff`. |
| TH-P1-5 | Banner / drawer / narrator off-token | Slate-sky banners; dank `#121a16` drawers. |
| TH-P1-6 | Section tab colors dead | `.dsc-tab.active` forces white over `.dsc-tab--*`. Twin / `.dsc-legacy-host` `#000` stay outside the scale. |

---

## 2026-08-27 — Graph / chart audit 7.1

> **CLOSED 2026-08-27 (7.1.2)** — All P0/P1 audit items fixed. See [`docs/qa/AUDIT-CLOSURE-7.1.2.md`](qa/AUDIT-CLOSURE-7.1.2.md). Historical notes retained below.

Source: [`docs/qa/GRAPH-AUDIT-7.1.md`](qa/GRAPH-AUDIT-7.1.md). Distinct from GAUGE (rings/meters/bars), UX, DESIGN, THEME, SPACE. Live `.48` `/history` + every plot route. pot3 left OOS. No setpoint / demand writes.

Already logged — do not duplicate the row, **do escalate**: **SV-P1-6** (DutyStrip 0.0h vs runtime KPI) → lighting + heat-mat are **P0** when the page also says ON / 4.0 h today. **SV-P1-7** (extras-only room VPD) is the ingest half of **GR-P0-4**.

### red-flag (P0)

| ID | Item | Notes |
|---|---|---|
| GR-P0-1 | History `LIMIT 2000 ASC` drops newest | `list_history` keeps the oldest 2000. 48h tent T / pot moisture last point ~27h old; coldest-root hits the cap inside 6h. `stepHold` then paints the hole to now. Newest-first or raise cap. |
| GR-P0-2 | Step-hold to now, no stale mark | `stepHoldSeries` appends `{t: now, v: last}`. Chart voids `lastSyncAt`. Root spark / truncated 48h look live and flat. |
| GR-P0-3 | Fan duty chart empty | `sensor.dsc_fan_exhaust_*_pct` not in `ENTITY_METRIC_MAP`. Climate plot = “thin recorder” while sliders show live %. |
| GR-P0-4 | Room VPD legend, no series | `sensor.dsc_hub_room_vpd_kpa` / `room_vpd` unmapped; hub values have no room VPD. Climate VPD last chip blank (Room is series[0]). |
| GR-P0-5 | Light duty 0.0h while ON | 4×8 window + SF1000 binaries unmapped. Page: WINDOW OPEN / SF1000 ON. Strip: 0 cycles · 0.0h on. Elevate **SV-P1-6**. |
| GR-P0-6 | Heat-mat strip 0.0h vs 4.0 h KPI | Same DutyStrip map hole on Root. |
| GR-P0-7 | Analytics 48h VWC axis collapsed | All ticks the same `HH:mm`. `potGotEntity` can pick `got_moisture` (0 history) over `soil_moisture`. P3 OOS + P4 null stay in the legend. |

### next-plan (P1)

| ID | Item | Notes |
|---|---|---|
| GR-P1-1 | Last chip is series[0] (Room) | Climate T/RH “now” is Room, not 4×8. |
| GR-P1-2 | Dual-axis extrema un-united | RH max 81.9 prints on the temp chart. |
| GR-P1-3 | Severity glow + ghost smear | Legend colors ≠ stroke the operator sees. |
| GR-P1-4 | EC never ingested, still legend | Pots have moisture / soil T / pH only. Seat copy “EC over time shown.” |
| GR-P1-5 | 24h/48h ticks HH:mm only | Two mornings look reversed. Need a date. |
| GR-P1-6 | Index downsample + nearest tooltip | Peaks can vanish; hover labels a point hours away. |
| GR-P1-7 | Unmapped history fails silent | `[]` + Thin recorder. Drawer still shows entity id. |
| GR-P1-8 | Overview/Dash Root spark held-flat | VPD sparks needle-spike at the right (hold join). |
| GR-P1-9 | Duty track invisible when empty | Grey-on-near-black reads as a missing widget. |
| GR-P1-10 | Chart hours sessionStorage is global | 48h on Analytics is 48h on Climate; ghost fetch then hits GR-P0-1. |


