# DSC-CONTROL 5.1.1 — `lv_draw_unit_draw_letter` crash-loop

**Date:** 2026-08-02 · **Device:** ESP32-2432S028R (CYD, no PSRAM) @ **192.168.86.177**
**Firmware:** 5.1.1 · ESPHome 2026.7.3 / IDF 5.5.5 · compiled `2026-08-02 03:15:49`

## Symptoms

- API handshake briefly OK, then disconnect / errno 113.
- `*** CRASH DETECTED ON PREVIOUS BOOT ***`
  - `Fault - Unknown` · **core 1** · PC `0x40118C50`
  - Decoded: `lv_draw_unit_draw_letter` @ `lv_draw_label.c` (local ELF may be stale; symbol matches 5.1.0 dumps)
- Loop ~1–2 min. Same family as 5.1.0 wake/unlock letter-draw storms.

## Why 5.1.1 was incomplete

120 ms deferrals still:

1. Cleared `panel_sleeping` **before** defer → `interactive` true while overlay up / finger down.
2. Called **full `refresh_ui`** on wake and unlock/lock commit.
3. Showed hold HUD (`clear_flag` + `lv_label_set_text`) from `hold_tick` mid-press.
4. ESP-NOW `confirm_paint` → immediate `refresh_ui.execute()` (can land under touch).

## Fix (5.1.2)

- Keep sleeping through wake defer; `ui_dirty` + 200 ms drain instead of inline full refresh.
- `touch_guard_until` + skip interactive tab paint while holding / waking / guarded.
- Defer hold HUD show off the indev stack; no `refresh_ui` on wake/unlock/confirm.
- Lock icons `mdi_34` → `mdi_22` (smaller A8 masks).

## Verify

- Boot: `DSC-CONTROL 5.1.2 up — free_heap=… largest=…`
- No crash banners for several minutes through: idle sleep → tap wake → hold-lock → hold-unlock → Modes toggles.
- Logs: `sensor.dsc_control_firmware_version` → **5.1.2**
