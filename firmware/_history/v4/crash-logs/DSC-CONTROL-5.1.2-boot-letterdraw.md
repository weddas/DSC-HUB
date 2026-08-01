# DSC-CONTROL 5.1.2 — boot letter-draw loop (post-USB)

**Date:** 2026-08-02 · **Device:** @ 192.168.86.177  
**Firmware:** compiled `2026-08-02 04:05:49` (post-push USB of 5.1.2)  
**Log:** `dsc-control-logs.txt`

## Symptoms

- New build (not 03:15 / 5.1.1) still crash-loops.
- Handshake → disconnect; often **no** `Project … version` line (dies during early app log / first paint).
- `Fault - Unknown` core 1 · PC `0x40118F08` → `lv_draw_unit_draw_letter`.

## Conclusion

5.1.2 indev/wake deferrals were insufficient. Crash is **boot-time first LVGL paint** under peak heap, not only wake/unlock.

## Fix (5.1.3)

- `lvgl: paused: true` + `resume_on_input: false`
- `on_boot`: log heap → delay 5s → log heap → `boot_ui_ready` → `lvgl.resume`
- Gate `refresh_ui` + intervals on `boot_ui_ready`
- Remove unused `mdi_34` font face
