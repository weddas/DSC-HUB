# Changelog

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
