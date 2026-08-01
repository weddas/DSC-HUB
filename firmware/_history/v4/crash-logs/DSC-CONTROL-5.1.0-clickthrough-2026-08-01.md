# DSC-CONTROL 5.1.0 — click-through / wake session (2026-08-01)

**Firmware:** 5.1.0 · compiled `2026-08-01 23:17:11 +1000` (post SoftAP/`dsc_fleet_setup` omit)  
**Device:** 192.168.86.73 · ESPHome 2026.7.3 / IDF 5.5.5

## Timeline (AEST / device log clocks)

| Time | Event |
|------|--------|
| 23:34:54 | Boot OK · project 5.1.0 · heap ~62 KB / largest 47 KB |
| 23:35:48 | `safe_mode` cleared boot-loop counter |
| 23:37:42 | Idle screensaver · backlight → 12% |
| ~23:41 | **Wake from sleep** → reboot · `Fault - Unknown` PC `0x4011796C` · `lv_draw_unit_draw_letter` |
| 23:42:13–23:42:20 | Rapid reboot loop · `StoreProhibited` PC `0x4010BC9B` · `update_obj_state` ← `lv_obj_add_state` (touch press path) |
| 23:42:51–23:43:10 | More reboots · again `lv_draw_unit_draw_letter` |
| ~23:43:40+ | API TCP connects but **`Timeout waiting for HelloResponse after 30.0s`** |
| **~23:45** | **HARD FREEZE** — glass totally locked, no panic reboot; power-cycle required |

## Fault families this session

1. **Wake / label draw** — `lv_draw_unit_draw_letter` (same as prior SoftAP-era dumps; here after stable idle).
2. **Touch state UAF** — `StoreProhibited` in `update_obj_state` / `lv_obj_add_state` (press, not only release).
3. **Hard lock** — no crash banner; loop wedged (Hello never completes). Distinct from panic reboot.

## Notes

- SoftAP DRAM omit fixed idle stability (~6 min) but did **not** fix interaction crashes.
- Local uncommitted mitigation (panel **5.1.1**): defer saver hide + `refresh_ui` 120 ms after wake; drop saver `on_click` double-wake. **Not on device yet** for this session.
- Freeze time recorded for correlation: **2026-08-01 ~23:45 AEST**.

## Repro — hard freeze #2

| Field | Value |
|-------|--------|
| Time | **~23:47 AEST** (2026-08-01) |
| Action | Trying to **turn off RECIRC De-Strat** (`sw_destrat` / Modes) |
| Symptom | Totally locked up (same class as ~23:45 freeze) |
| Likely path | Settings → Modes → tap `sw_destrat` → `hub_cmd` op 19 |

UI: `sw_destrat` label "RECIRC De-Strat"; command via `hub_cmd` (coord bit 1 = destrat).

### Log correlation (post–power-cycle #1)

| Time | Event |
|------|--------|
| after 23:43 Hello timeout | Power-cycle #1 (freeze #1) — **no crash banner** on next boot ⇒ hard lock, not panic |
| 23:46:10 | API Hello OK · HA link ON · backlight 100% · LED amber↔red |
| **23:47:02** | `esphome.ota set Warning flag: unspecified` → API disconnect — aligns with **RECIRC De-Strat freeze #2** |
| 23:48:09 | Reconnected · Status LED amber (power-cycle #2 or wedged loop briefly recovered) |

Freezes leave **no** `CRASH DETECTED` dump; panics leave letter-draw / `StoreProhibited` banners.

## Repro — unlock + lock-begin (log file 5)

Source: `c:\Users\cmgwe\Downloads\dsc-control-logs (5).txt` (continues same 5.1.0 session).

| Time | Event |
|------|--------|
| 23:58:13–22 | Sleep 12% → wake 100% |
| ~23:58–23:59 | **Unlock from lock** → `lv_draw_unit_draw_letter` reboot storm |
| then | Host `Errno 113` — device gone (freeze or brown-out reboot) |
| **00:04:45** | Boot; previous crash still letter-draw; stack includes `lv_label_event` / `draw_main` |
| 00:05:13 | OTA Warning + disconnect (hard-lock stall signature) — consistent with **hold-to-lock begin freeze** on Main |
| 00:07:29 | OTA Warning again |
| 00:08:20 | Fresh boot OK, heap ~63 KB |

Lock-begin and unlock share the same family: **HUD/overlay + label redraw under active touch**.
