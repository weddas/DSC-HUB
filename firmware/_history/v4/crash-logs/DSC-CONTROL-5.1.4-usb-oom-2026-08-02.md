# DSC-CONTROL 5.1.4 — USB serial OOM after resume (2026-08-02)

Source: `y:\from putty.txt` (PuTTY 115200).

## Verdict

**5.1.4 is on the panel** and the pause/resume path runs. It dies on the
**first full LVGL paint** after `resume`, not during Wi‑Fi/setup.

## Cycle (every reboot)

1. `DSC-CONTROL 5.1.4 paused — free_heap≈53KB largest≈47KB`
2. Wi‑Fi → `192.168.86.177`
3. `DSC-CONTROL 5.1.4 resume — free_heap≈51–52KB largest≈47KB`
4. `lvgl took a long time for an operation (~330–355 ms)`
5. Then one of:
   - `Failed to allocate 220/640 bytes`
   - `Failed to allocate 512 bytes for draw buffer` / `No memory: 16x32 … 512Byte`
   - `StoreProhibited` / `abort()` / `task_wdt` on `loopTask`
6. Reboot → safe_mode countdown → eventually `SAFE MODE IS ACTIVE`

## Follow-up

**5.1.5**: staged lite resume (`page_boot`), drop `mdi_28`, font `bpp` 4→2.
Do not re-enable `sram1_as_iram` (see v4.0.2 postmortem — costs DRAM).
