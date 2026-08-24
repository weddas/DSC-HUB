# Changelog

## Unreleased

- **DSC-HUB 7.0 Pi release (`c4eb97f`)** — Pi appliance: Docker stack
  (`services/dsc-hub`), brain fleet/settings/appliance driver + SPA `:8787`,
  firmware **7.0.0.0** `wifi-pi` train (`10.42.0.0/24`), hub ESP-NOW parked,
  ETH01 demand path superseded by `appliance_driver.py`. Ops:
  `docs/qa/PI-APPLIANCE-7.0.md`. Tree stays `7.0.0-dev` until island soak + tag.
- **SoftAP-local fleet cutover 6.0.0.0** — Hub/Control/Pot1/2/4/Sonoffs SoftAP-only
  STA (`DSC-Anchor` + BSSID pin + SoftAP static IPs); Nest STA removed; SoftAP-down
  recovery = device Fallback AP (Control has no captive_portal — RAM). Fleet Fix
  SoftAP-strict gates; Lock/0xD0 SoftAP-guard; HA sticky SoftAP `.4.x` hosts;
  `expected_release` **6.0.0.0**. SoftAP NAPT OTA still unproven (`10054`) —
  Nest-hold bootstrap used only for dual-network → SoftAP-local flash. Pot3 OOS
  (dead hardware). Spec: `docs/superpowers/specs/2026-08-10-softap-fleet-star-design.md`.
- **ETH01 bridge 5.2.0 (F-010 / F-012 / F-013)** — WT32-ETH01 SoftAP channel
  anchor (`DSC-Anchor`), ESP-NOW `0xD8` appliance demand → Noise native API
  client to Sonoffs (HA-down actuation), broadcast `0xD1` vitals mirror to HA
  over Ethernet. Kit SoftAP role=`bridge`. HA package `dsc_v4_bridge.yaml` +
  Pro System cards. SoftAP via `dsc_anchor_ap` (ESPHome forbids `wifi:`+`ethernet:`).
  F-011 portal host on ETH01 still deferred; F-014 kit SoftAP hello deferred.
  **Superseded on Pi 7.0 product path** by brain appliance driver.
- **Pi offline brain (Phase A/B → 7.0)** — Product destination documented in Notion [Product layers](https://app.notion.com/p/3b52b4cda37081c2bcafc85d3407556c) + [`docs/DSC-BRAIN.md`](docs/DSC-BRAIN.md). `brain/` package: catalogs, Want, decision ticks, FastAPI + SPA, fleet ingest, appliance driver. Specs: [`docs/brain/`](docs/brain/). HA is lab scaffold ([`docs/HA-SCAFFOLD.md`](docs/HA-SCAFFOLD.md)).
- **Build a Plant Full Inclusion (N-085)** — Pro Home/Root Zone roster context, Nutrient Science calculator/deep-link/CANNA stage packs, Lighting catalog controls, short-stock-safe Accept, refreshed catalog indexes, and HA surface **5.1.11**.
- **Build a Plant (N-083)** — Separate product surface: dashboard `dsc-build-plant`, Lit card `dsc-build-plant-card`, package `dsc_v4_build_plant.yaml` (soil % blend, plant roster, mix calculator, Apply climate Want). Slim `/local/dsc-catalog/` search indexes via `scripts/build_catalog_search_indexes.py`. Vivosun NEXT_DATA enrich (wattage/PPE/stated point-PPFD/datasheets); keyword-labeled map URLs still **0** on CDN hashes. Wired into `sync-hacs-dist.sh` / `ha-sync.sh` (bundle + catalog + dashboard copy).
- **Sync 5.1.4 (N-084)** — HAOS Sync add-on concatenates Build a Plant into www/`DSC-HUB.js`, stages `dsc-build-plant-dashboard.yaml` + `www/dsc-catalog/`. Rebuild add-on after Update (≤5.1.3 stopped at The Dash). Ops: `docs/qa/LIVE-UI-BUILD-A-PLANT.md`.
- **Light photometrics (PPFD / spectrum)** — `clean_light_map_assets.py` strips non-image map URLs; `dsc_light_pack_photometrics.yaml` + `dsc_v4_light_catalog.yaml` surface map URLs + stated W/PPF/PPE for SF1000/SF2000/SE7000, Mars Hydro FC-E3000/TS1000, Digi-Lumen, Treegers.
- **Catalog → Pro dash (N-082)** — Strains / Nutrient Science / Lighting views wired to catalog packs; SF1000 nameplate watts sync into climate physics.
- **Medium pack (N-064)** — `dsc_medium_pack_canna_coco.yaml` + `dsc_v4_medium_catalog.yaml` (CANNA Coco Professional Plus).
- **Light/tent slug hygiene (N-070/N-077/N-071)** — canonical `spider_farmer`; Vivosun D2C owner pin.
- **Strain merge + HA picker (N-058/N-060/N-062/N-054–N-056)** — `merge_strain_catalogs.py --write --chemistry` → `dsc_strains_merged.json` (**36881** unique / **73571** input; chemistry on **2397**). Herbies dump finalized at **3873**. HA package wired via `promote_strain_catalog_to_ha.py` (catalog `want_bands`, split custom EC, curated picker seeds).
- **Curated nutrient pack (N-053)** — `dsc_nutrient_pack_canna_coco.yaml` (CANNA Coco A+B @ 4.0 ml/L) seeded into `dsc_v4_nutrient_catalog.yaml` initials.
- **Bunnings AU retailer dumps** — nutrients / additives / mediums via category SSR tiles + PDP `__NEXT_DATA__` (`scripts/import_*_bunnings.py` + `bunnings_common.py`). Dumps `dsc_{nutrients,additives,mediums}_bunnings.json` (+ medium category splits). `apis.prod` product API = 401 (unused); robots: no `/search`. See `NUTRIENT_SOURCES.md` / `ADDITIVE_SOURCES.md` / `MEDIUM_SOURCES.md`.
- **Grow-medium dumps (N-064 foundation)** — schema v1 per-SKU rows (`dsc_medium_catalog.schema.md`) with category taxonomy + size/composition/pH/EC when stated. Grow Kings importer `scripts/import_mediums_growkings.py` → `dsc_mediums_growkings.json` + per-category splits + `_gk_mediums_brands.json` / `_gk_mediums_categories.json`. See `homeassistant/data/MEDIUM_SOURCES.md`.
- **Nutrient dumps (N-053 foundation)** — schema v1 per-bottle rows (`dsc_nutrient_catalog.schema.md`) with pack links + `charts`/`feed_plans`/`vpd`/`notes`/`source_urls`. Grow Kings importer `scripts/import_nutrients_growkings.py` → `dsc_nutrients_growkings.json` + brand index `_gk_brands.json`. Manufacturer catalogs are parallel sibling dumps (`dsc_nutrients_<brandslug>.json`); see `homeassistant/data/NUTRIENT_SOURCES.md`.
- **Additive dumps (N-053 adjacent)** — same bottle/pack schema for Grow Kings `/collections/supplements-additives` via `scripts/import_additives_growkings.py` → `dsc_additives_growkings.json` + `_gk_additives_brands.json`; `category` = `additive`\|`supplement`. See `dsc_additive_catalog.schema.md` / `ADDITIVE_SOURCES.md`.
- **Strain catalog schema v2** — expanded `homeassistant/data/dsc_strain_catalog.yaml` (+ `.schema.md`) with lineage, cannabinoids, sensory, growing, timing, split EC Want (seedling/veg/flower), optional climate Want, external IDs; promote script emits v2 shape. Live HA picker wired via `want_bands` (N-054).
- **BudProfiles import** — `scripts/import_strains_budprofiles.py` fills `dsc_strains_budprofiles.json` (~11k, gitignored) and merges a popular enriched set into the YAML catalog (`curated=false` default Want). Re-run: `--enrich-popular --merge-yaml`.
- **OpenTHC VDB import** — `scripts/import_strains_openthc.py` pulls official `strains.json` (~12.8k ULIDs, gitignored) and cross-links `external.openthc_id` into BudProfiles / popular / YAML by normalized name.
- **More strain dumps (merge deferred)** — Kushy (~9.5k), Cannabis Intelligence CSV (~15.7k), BudProfiles breeders/studies, Seed City CC0 (~8.9k), Herbies UK (~3.8k), Royal Queen Seeds (~181), Fast Buds (~165), Barney's Farm (~111), Dutch Passion EN (~176), Wikileaf via grow_data MIT CSV (~2793). Inventory via `scripts/merge_strain_catalogs.py` (no `--write` yet). See `homeassistant/data/STRAIN_SOURCES.md`. SeedFinder API dead; Seedsman skipped (JS SPA); Wikipedia/Wikidata probed and skipped (~34 Wikidata / ~84 wiki names — too thin).

## Hub 5.1.11 — Full Auto default startup (2026-08-07)

- **Boot policy:** every start forces Full Auto + `arm_full_auto` unless
  Manual Takeover was restored ON. Stale NVS Full Auto OFF can no longer
  leave fans/ladder/photoperiod idle after a recovery reboot (closes the
  5 Aug overnight drop class).
- Ladder Auto globals (humidifier / dehumidifier / heater / grow mat)
  now default **true** on fresh NVS so the stack is armed before the
  first climate tick. AC / clone mister remain gated by in-service.
- Mid-session Full Auto OFF still works until the next reboot.

## Hub 5.1.10 / Control 5.1.17 / Pots 5.1.8 — kill post-connect roam scans (2026-08-06)

- **ESP-NOW flap:** ESPHome `post_connect_roaming` defaults **true** and runs
  off-channel Wi‑Fi scans every 5 min when RSSI &lt; −49 (hub sits ~−70). The
  single radio leaves Nest ch11 while STA stays “connected”; `espnow` only
  *observes* that as `Wifi Channel is changed 11→N` (not a peer hunt).
  `dsc-hub-logs (5)`: one 1…14 storm at 09:50, no OOM, Link Recovery = 0.
- Set `post_connect_roaming: false` on hub/Control/pot lab+kit WiFi packages.
  Preferred-BSSID Lock already owns Nest pin; roam scans fought that pin.

## Hub 5.1.9 — ESP-NOW TX cadence (2026-08-05)

- **N-037:** One outbound ESP-NOW frame every 5s — alternate medium `0xD0`
  (sparse `0xD7`) and large vitals (sparse config/soil/names). Register
  broadcast peer so sends do not channel-sweep off Nest. 15s TX backoff on
  send fail. Stops the 5.1.8 OOM + `11→1…14→11` thrash seen in soak logs.
  *(Note: OOM fixed; residual channel thrash on 5.1.9 was post-connect roam
  scans — closed in 5.1.10.)*

## Hub 5.1.8 + Control 5.1.16 + Pots 5.1.7 — fleet self-heal train (2026-08-05)

- **Light quota** (5.1.6/5.1.7) retained; lateral **VPD band** + **mister duty** ledgers.
- **Settings coherence** receipt (epoch+hash) detect+flag only on HA link restore.
- **Fleet RF:** 0xD0 v2 heartbeat, 0xD5 peer cards, 0xD7 peer TIME; hub REJOIN/JUMP;
  RF shorthand sensor; CHX hygiene cue (F-004 ops).
- **EVT bus** + HA autofix map (API_BLIP, FAILSAFE, FOLLOWER_DRIFT, FIX_*, COHERENCE);
  freshness TTL; FIX_ACTIVE defers safe-off / blocks OTA; Pre-OTA Quiesce button.
- **Fleet clock:** Australia/Sydney SNTP fleet-wide; `clock_valid` gate; pots leave HA-only.
- **Control Fleet Fix:** hold-to-run; Starting-only UI; 5-strike skip; ASCII status;
  glyphs `…`/`–` + ASCII Fix strings; Bluetooth row removed.
- **Sim gates:** `scripts/cyd_glyph_audit.py`, `cyd_layout_check.py`, `fleet_fix_sim.py`.

## Hub 5.1.7 — light-quota first-ledger seed (2026-08-05)

- **Plant-critical:** first OTA of 5.1.6 mid-dark seeded `delivered_s=0` and
  invented ~18h catch-up debt → SF1000 on with window shut. Rev-1 NVS seed
  credits elapsed nominal (or marks the day paid if past window) so upgrade
  never blazes the dark period.

## Hub 5.1.6 — light-quota + debt catch-up (2026-08-05)

- **Plant-critical:** photoperiod is now a hub NVS ledger (`delivered_s` /
  debt), not a pure clock window. After mid-window outages the SF1000
  stays/re-lights past nominal off while debt remains and remaining dark
  > **Min Dark Hours** (default 4h). Leftover debt folds into the next
  cycle capped at +2h. HA dark-period violation exempts catch-up; Lighting
  view shows Delivered / Debt / Catch-up.
- Motivated by Jul–Aug 2026 history (recurring mid-window theft; HA
  `unavailable` cannot meter photons) and the 5 Aug ~5.5h hole.

## Hub 5.1.5 — photoperiod NVS / mid-window dark (2026-08-05)

- **Plant-critical:** recovery reboot could restore Auto Photoperiod **OFF** from
  stale NVS while Full Auto had kept it true only in RAM → SF1000 dark mid
  cycle (~5.5h on 5 Aug). Sync after `arm_full_auto` + photoperiod switch;
  on_boot re-arms photoperiod whenever Takeover is clear.
- **HA guard (pre-flash):** re-arm photoperiod if disarmed >45s without Takeover;
  `binary_sensor.dsc_clone_light_missing_in_window` + alert if dark mid-window >2min.

## HA surface 5.1.8 + fleet patch train (2026-08-04)

- **Cal truth:** lab wet two-point → ESP (`script.dsc_pots_apply_lab_wet_to_esp`,
  docs/LAB-WET-CAL.md); pot FW **5.1.6** raw sensors + `lab_buffer` stamp.
- **Trust:** `dsc_v4_sensor_trust.yaml` — stuck pots, peer-MAD alerts, DHT
  disagreement cue, optional mat-vote clear; tank EC/pH bias (N-023).
- **Learn F-005:** multi-lever residual attribution (no longer skips when ≥2
  air appliances co-run). Activity shows lever mix. Fleet coherence score (N-015).
- **F-009:** Home keep-up gaps + Full Auto honesty copy on reduced kit.
- **F-006:** hub **5.1.4** API/handshake age + last recovery reason; HA flap
  counter 24h. Hub still needs physical power cycle if `.33` dead.
- **N-011:** promote customs preview script + `scripts/promote_customs_to_yaml.py`.
- **Control 5.1.15:** VPD editor, Pulse ASCII sparkline, per-device power page.
- **Dash FX:** MeshLine ribbons + GPU curl haze (Tube/CPU fallback flags).
- **Anemometer:** docs/ANEMOMETER-CFM.md + `sensor.dsc_cfm_curves_status`.
- **N-005 / N-026:** no wait/settle retune without hub soak evidence (documented).
- **N-013:** skipped this pass (track-only dryback remains).
- Follow-ups: [`docs/FOLLOWUPS.md`](docs/FOLLOWUPS.md).

## HA surface 5.1.7 — Cal SoT push + Dash (2026-08-04)

- Peer → ESP push, dual-stack warn, allocated CFM honesty, The Dash cinematic.
- Detail lives in FOLLOWUPS dated 2026-08-04 sections.

## HA surface 5.1.6 — Calibration peer sync (2026-08-04)

- Peer sync v2 (MAD), leaf VPD wire-up, pot provenance (FW 5.1.4).

## HA surface 5.1.5 — finish crop UI + pot-native strain (2026-08-03)

- **Honest cutover:** 5.1.4 shipped packages + Climate Temp OOS + dead Tank chips;
  Strains / Nutrient Science / Want·Need·Got UI were missing. This surface lands them.
- Dashboard: `/dsc-hub-pro/strains`, `/dsc-hub-pro/nutrient-science`, plant-console
  strain/sprout/Need, Root Zone dryback & coherence, Clone Mister Temp OOS parity.
- **N-017:** pot firmware **5.1.3** — `select.strain` + `datetime.sprout_date` on NVS.
- **N-018:** Want/Need/Got prefer pot entities; HA `input_*` fallback; migrate script
  `script.dsc_migrate_strain_sprout_ha_to_pot`.
- Follow-ups: [`docs/FOLLOWUPS.md`](docs/FOLLOWUPS.md).

## HA surface 5.1.4 — crop-steering packages (2026-08-03)

- **Strains / Want·Need·Got (packages):** catalog + sprout age, peer offsets (Got =
  raw + offset), soft pH/EC cues, Apply expected stage, Capture peer baseline.
- **Nutrient Science (packages):** stock room, next-mix recipe, purchase list,
  **Accept mix** QA (burns stock; pumps deferred).
- **Fluctuations (packages):** relative dryback; cross-pot coherence; learned
  ΔEC/Δmoisture.
- **Actuator efficacy:** humidifier / dehumidifier / clone mister — no space
  response → **Temp OOS** (flashing) + demand inhibit; separate **Operator
  Lockout** never auto-cleared. Climate Temp/Lockout UI landed; Strains /
  Nutrient Science views deferred to **5.1.5** (Tank chips pointed at missing paths).
- Follow-ups: [`docs/FOLLOWUPS.md`](docs/FOLLOWUPS.md).

## HA surface 5.1.3 + hub OOS / in-service (2026-08-03)

- **Single in-service gate** replaces `*_actuator_wired` for AC, clone mister,
  and pots (defaults: AC/mister/POT3 off). Soft **capacity offline** / reduced-kit
  cues — not problem alerts in `dsc_active_alert_count`.
- **Full Auto stays usable:** skips OOS rungs; next-best levers (AC OOS →
  OUT/RECIRC; mister OOS → no demand; pot OOS → no mat vote / chem alerts).
  Emergency ≥35 °C: fans-only when AC OOS.
- Hub NVS `*_in_service` switches + HA sync automation; humidifier refuses
  fire at/above RH ceiling; pot alerts gated on in-service.
- Dashboard In-service toggles; learn/mesh copy (Activity, ETA, Sync≠flash).
- Master follow-ups: [`docs/FOLLOWUPS.md`](docs/FOLLOWUPS.md).

## HA surface 5.1.2 + hub/pot mesh & learn (2026-08-03)

- **Learn UX:** `sensor.dsc_learn_activity` plain-English (“Learning humidifier
  (2/5)…” / “Waiting — 2 air appliances…”). Dashboard Learning card uses it.
  Gate open ≠ measuring — Activity is the source of truth.
- **Phase A samples again with Full Auto:** fans + grow mat no longer count as
  contaminating levers. Air appliances train when exactly one of hum/dehum/
  heater/AC is ON. Mat/vent have their own clean gates.
- **Energy:** hub humidifier no-extraction interlock (mirror heater) — do not
  dump bought moisture outside while humidifying (RH overflow still wins).
- **Mesh:** Control/pots `fast_connect: false`; pot `api.reboot_timeout: 0s`;
  hub preferred-AP pin retries after cooldown and **relearns** preferred from
  current after 30 min stuck off preferred (production-safe, no hardcoded MAC).
- **Derived cues:** preferred-AP mismatch, humidifier/heater vent conflict,
  ineffective humidifier/heater/mat suspects.
- Docs: Lock/Remember/0xD0 adopt only — no “paste BSSID into stubs.”

## Mode ownership + cohesive dashboard (2026-08-03)

- **Grow Stage Custom** + firmware write guards for 4x8 temp/RH/VPD (same
  pattern as Clone Mode). Dashboard locked readout + Switch to Custom.
- **Full Auto** fan lock cue + read-only % chips; editable fan cards only with
  Override/Takeover (or Full Auto off). Hub `on_speed_set` warn while curve owns PWM.
- Photoperiod **Follow 4x8** locks clone light hours + lights-on time;
  SF1000 **Schedule owns brightness** cue (Manual Light Hold unlock).
- Home **Now / Running / Operational now / Bands** composition (nav chip strip
  dropped; Running nested under SYSTEM MAP). Follow-aware gauge segments.
- Root Zone above-fold **Pots + Mat**; EC / moisture / NPK charts in History
  expanders. Climate **Command** ownership strip.

## Clone mode locks climate targets (2026-08-03)

- Dashboard **2x4 Clone**: temp / RH / VPD editors only when Clone Mode is
  **Custom**. Named modes / Follow / Off show a locked band readout plus a
  one-tap **Switch to Custom**.
- Hub firmware rejects non-Custom writes to those five numbers (HA entity UI
  / panel included); `apply_clone_mode` still stamps presets via a latch.
- Light hours + photoperiod stay editable in every mode.

## Hub — link recovery + AP pin (2026-08-03)

- Soften API bounce/reboot: require a dead HA client (≥180s / ≥300s) or
  wedged-while-connected handshake (≥10 / ≥15 min). Handshake automation
  lag alone no longer bounces WiFi (overnight reboot storm).
- Lock WiFi AP: mismatch bounce backoff (120s, max 3/boot); `fast_connect:
  false` so bounce can scan onto preferred BSSID; delayed on_boot
  `wifi_ap_learn_or_pin` after recovery associate.
- Preferred BSSID operationally aligned to current healthy Nest point
  when Lock was fighting a stronger alternate AP.

## Hub — NVS sync on mode change (2026-08-03)

- DSC-HUB: flush restore-backed mode globals (`full_auto_mode`,
  `ha_takeover_active`) to NVS immediately on Full Auto / Manual Takeover /
  Manual Override / OLED+panel fan live-adjust transitions.
- Closes the gap where `flash_write_interval: 60s` let an API-recovery reboot
  resurrect a stale Full Auto OFF after an explicit ON (3 Aug 2026 incident).

## v5.1.10 — 2026-08-02

- DSC-CONTROL **5.1.10**: A/B twin of 5.1.9 with `sram1_as_iram: false`.
- Everything else identical (8% LVGL buffer, Wi-Fi/LWIP starve, SIZE,
  lean UI). USB-flash and compare `UI armed` free_heap/largest to
  5.1.9 (~153 KB / 98 KB). Winner becomes the fleet default.

## v5.1.9 — 2026-08-02

- DSC-CONTROL **5.1.9**: experimental `sram1_as_iram: true`.
- Re-measure after the 5.1.6 lean cut + 5.1.8 starve pass. v4.0.1 found
  **+0 free DRAM** (option extends IRAM and reserves the DRAM alias);
  bootloader "+40KB" is IRAM, not heap. Keep if `UI armed` largest=
  improves; revert if it drops.
- **USB flash only** — OTA does not update the bootloader; mismatch
  bricks to a boot loop until USB recovery.

## v5.1.8 — 2026-08-02

- DSC-CONTROL **5.1.8**: more DRAM for LVGL without touching `sram1_as_iram`.
- LVGL `buffer_size` **8%** (~12.3 KB; was 10%).
- Wi-Fi `STATIC_RX` **3**; LWIP `MAX_ACTIVE/LISTENING_TCP` **3**;
  `TCP_SND/WND` **1440**.
- `compiler_optimization: SIZE`, `loop_task_stack_size: 8192`.
- **Still no `sram1_as_iram`** — ESPHome's "+40KB" bootloader hint is IRAM,
  not heap; enabling it carves 40 KB out of DRAM (v4.0.1 postmortem) and
  risks OTA brick on an old bootloader.

## v5.1.7 — 2026-08-02

- DSC-CONTROL **5.1.7**: apply CYD-without-PSRAM harden checklist where
  ESPHome allows it.
- LVGL `buffer_size` **10%** (~320×24×2 = 15.3 KB single partial buffer).
- Wi-Fi `DYNAMIC_RX/TX_BUFFER_NUM` **4** (was 8) — starve TCP stack for
  contiguous DRAM.
- Already in place (no change): hide-not-destroy pages, TFT+touch on
  **separate SPI** buses, no SD mount, font `bpp` 2, plaintext API /
  mDNS off, paint-free `hub_cmd`, staged boot. PSRAM tips N/A on this
  board. Raw FreeRTOS LVGL mutex / core-pin is ESPHome `loopTask`.

## v5.1.6 — 2026-08-02

- DSC-CONTROL **5.1.6**: lean cut — now that 5.1.5 survives boot, restore
  the 4.0.11-era "what glass must do" scope instead of the full drill-in UI.
- Kept: vitals tabs (Pulse/Clone/Main/Soil + soil detail) and their fan
  +/- `hub_cmd` rows; Full Auto, RECIRC De-Strat, Manual Takeover (via
  `open_gate`); Auto Photoperiod, Manual Light Hold, Humidifier Routing —
  all now **inline** on `page_control` (Modes & Automation drill-in gone);
  staged boot, `boot_ui_ready`, `hub_cmd` paint-free, `confirm_takeover`,
  Connections/Alerts overlays, backlight (monochromatic).
- Removed entirely: torch/flashlight (`fl_screen` + apply/open/close +
  swipe-down-to-open); idle sleep/screensaver (`go_sleep`/`on_idle`/
  `panel_sleeping` — locking is manual only now); onboard RGB status LED
  (`status_led`/`led_r`/`led_g`/`led_b` + the LED machine in `refresh_ui`);
  every settings drill page (`page_set_profile`/`mainclim`/`cloneclim`/
  `light`/`mat`/`timers`/`destrat`/`panel` + `page_set_modes`); the
  select-roller editor overlay; green heartbeat (`sw_greenhb`).
- `lock_overlay` trimmed to clock + LOCKED + hint (dropped the `lk_*`
  appliance-icon strip); **visible** lock glyph on `lock_hit` (top-right —
  hold to lock; hold the overlay to unlock). No torch.
- Net: fewer widgets/globals, smaller `refresh_ui` — same crash-safety
  rules from 5.1.2–5.1.5 still apply (no `sram1_as_iram`, no
  `lv_label_set_text` under the `hub_cmd` tap).

## v5.1.5 — 2026-08-02

- DSC-CONTROL **5.1.5**: USB log proved 5.1.4 dies on first full LVGL paint
  after resume (`Failed to allocate 220–640 B` / draw-buffer OOM → WDT).
- Staged boot: hide tabbar → `page_boot` lite resume → pause → show Pulse +
  tabbar → arm `boot_ui_ready` (no `refresh_ui` during lite paint).
- Drop `mdi_28` (tabs use `mdi_22`); Montserrat/MDI font `bpp` 4→2.
- Do **not** re-enable `sram1_as_iram` (v4.0.2: costs DRAM; bootloader
  warning is IRAM, not heap).

## v5.1.4 — 2026-08-02

- DSC-CONTROL **5.1.4**: longer LVGL pause (12 s + optional 10 s if heap
  largest < 18 KB) before first paint; `hub_cmd` no longer calls
  `lv_label_set_text` under the tap (Full Auto / Modes crash path) — grey
  pending comes from the dirty-drain `refresh_ui`.

## v5.1.3 — 2026-08-02

- DSC-CONTROL **5.1.3**: 5.1.2 still crash-looped in `lv_draw_unit_draw_letter`
  at boot (compile `04:05`, project line never printed).
- Start LVGL **paused**; resume after 5 s once heap settles; gate all
  `refresh_ui` / dirty-drain on `boot_ui_ready`; drop unused `mdi_34` font.

## v5.1.2 — 2026-08-02

- DSC-CONTROL **5.1.2**: kill `lv_draw_unit_draw_letter` crash-loop (core 1 /
  Fault-Unknown) seen on 5.1.0–5.1.1 after wake / unlock / lock.
- Keep `panel_sleeping` through wake defer; coalesce paints with `ui_dirty` +
  200 ms drain; `touch_guard` blocks tab `refresh_ui` under active indev.
- No full `refresh_ui` on wake, unlock/lock commit, or ESP-NOW confirm.
- Hold HUD show deferred off the press callback; lock row icons `mdi_22`.

## v5.1.1 — 2026-08-01

- DSC-CONTROL glass: **instant** grey pending on every +/- and toggle; neon when
  hub ESP-NOW echoes (HA colours unchanged). Multi-tap accumulates from pending.
- Kill freezes: defer overlay hide / `refresh_ui` after wake, unlock, lock commit;
  bar-only hold HUD; lock only from dedicated hit / Settings row (no page hold).
- Idle sleep reuses lock overlay (tap to wake); 12% backlight for 5 min then off.
- Harder LVGL scroll (`scroll_limit` 40); multi-alert list from bell/strip.
- Lean: drop dead `saver` overlay; paint alert rows in-place (no string buffer);
  remove plant/sky HUD + `mdi_grow` font.
- Panel project **5.1.1**.

## v5.1.0 — 2026-08-01

- Force **5.1.0** across lab + kit firmwares, Sonoffs, Sync add-on, stubs, docs.
- Learn **Phase B** (opt-in): rate-limited HA→hub ladder wait bases only.
- Learning UI refresh (A+B), fleet version-status chip, coldest/hottest root sensors.
- Optional Learning **device cal**: L×W×H→m³ Apply helpers, multi-point fan CFM /
  SF1000 PPFD curves (`dsc_v4_device_cal`); live sensors stay % × nameplate until ≥2 points.
- Sync harden: `sync_esphome` default true, atomic stage + rollback, version/SHA marker,
  broader reloads, restart hint for new helpers.
- Notify via `input_text.dsc_notify_service`; door magnet UX; dead-demand / NO ACTUATOR cues.
- DSC-HUB Pro only (`dsc-hub-pro`); push updates all Sync-equipped HAOS (firmware still manual).

## v5.0.0

- First major cut: HAOS Sync add-on, automations package, YAML Lovelace `dsc-hub-pro`,
  hub firmware **5.0.0**, kit SoftAP path.
