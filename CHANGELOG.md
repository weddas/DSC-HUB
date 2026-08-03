# Changelog

## Fleet expected release stays on 5.1.3 firmware train (2026-08-03)

- Keep `input_text.dsc_expected_release` (and fleet chip fallbacks) on **5.1.3**.
- HA surface remains **5.1.5** — do not bump expected with the surface string;
  that produced a false FLEET WARN against hub/pots still on 5.1.3.
- Ops: [`homeassistant/README.md`](homeassistant/README.md) (Fleet expected vs HA
  surface) · [`docs/qa/LIVE-FLEET-EXPECTED.md`](docs/qa/LIVE-FLEET-EXPECTED.md).

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
