# DSC-CONTROL v4.0.1 — boot-loop post-mortem and RAM-recovery patch
**Newcastle indoor grow automation · 26 Jul 2026 · panel firmware only**

> **SUPERSEDED BY v4.0.2 — do not flash v4.0.1.**
> The boot-loop diagnosis in §1–3 is correct and still worth reading. The fix in
> §4 was **partly wrong**: edit 1 (`sram1_as_iram`) recovered zero heap and was
> the largest number in the table. v4.0.1 shipped with about a third of the
> headroom it thought it had, booted successfully, then died at runtime 100–240 s
> later — twice, two different ways. Corrections are boxed inline below.
> The runtime crashes and their real cause: `DSC-CONTROL-v4.0.2-postmortem.md`.

---

## 1. What happened

The first v4.0 flash of DSC-CONTROL boot-looped **eight times** before the ninth
boot survived. The log shows one `POWERON_RESET` followed by eight
`SW_CPU_RESET`, and every one of those eight ends the same way:

```
abort() was called at PC 0x401a591e
  __wrap___cxa_allocate_exception
  operator new(unsigned int)
```

That signature is unambiguous. `operator new` failed, tried to throw
`std::bad_alloc`, and because C++ exceptions are disabled on this build the
runtime called `abort()` instead of throwing. **The panel ran out of DRAM.**

This is not a logic fault. Nothing in the control path, the ESP-NOW handler, the
opcode map or the nested settings drill-down is wrong — the firmware simply did
not have enough free heap left to run once everything had been constructed.

The corroborating evidence is spread through the whole log:

* `[W][lvgl:998]: Failed to allocate 153600 bytes for draw buffer` — on **all
  nine** boots. LVGL asked for a full-frame 320×240×16-bit buffer, failed, and
  silently fell back to a 1/8 buffer.
* `E (2412) mdns_responder: Cannot allocate memory (allocate_txt(277), free
  heap: 16 bytes)` — sixteen bytes. Not sixteen kilobytes.
* `[E][espnow:193]: esp_now_init failed: ESP_ERR_ESPNOW_NO_MEM` on **seven of
  nine** boots. ESP-NOW could not even allocate its own mutex, which means on
  those boots the panel had no telemetry link at all.
* 49 × `[E][lvgl:000]: [Error] lv_realloc: couldn't reallocate memory`.
* Free-heap samples logged during setup: 16, 32 (×7), 60, 72 (×2), 76, 80, 176
  and 4068 bytes.

## 2. Why the crash line kept moving

The three crash sites were `dsc-control.yaml:4566` (×3), `:4755` (×2) and
`:4797` (×5) — all inside `refresh_ui`, reached via
`IntervalTrigger::update()` → `Script::execute()`.

Those three lines have nothing structurally in common. `:4566` builds a
`std::string`; `:4755` is the backlight `LightCall`, which constructs a
`LightTransitionTransformer`. What they share is that each is **the first line
in `refresh_ui` that asks the heap for anything**. With ~30 bytes free, whichever
allocation the scheduler reached first was the one that died. The wandering line
number is a symptom of exhaustion, not of three separate bugs.

## 3. Why boot 9 "worked" — and why that was luck, not a fix

On the ninth boot mDNS happened to fail *before* ESP-NOW initialised. Its failure
released enough heap that `esp_now_init` could finally get its mutex:

```
I (2434) ESPNOW: espnow [version: 2.0] init
```

The panel then ran clean for about two minutes, took touch input, and looked
healthy. It was not healthy. It was a coin-flip that landed the right way up,
and every subsequent reboot — power blip, OTA, HA restart — would have re-rolled
it. Left alone this would have come back, probably at the least convenient time.

## 4. The fix — six edits

The boot log itself recommends two of them, which is how you know the headroom
was there to be taken.

| # | Edit | Why | Recovered |
|---|---|---|---|
| 1 | ~~`advanced: sram1_as_iram: true`~~ **WRONG — reverted in v4.0.2** | See the correction box below. | **0 KB** |
| 2 | `advanced: minimum_chip_revision: "3.1"` | The log prints *"Chip rev >= 3.0 detected. Set minimum_chip_revision: 3.1"*. Drops the older-silicon compatibility shims. | small, free |
| 3 | `CONFIG_ESP_WIFI_{STATIC_RX,DYNAMIC_RX,DYNAMIC_TX}_BUFFER_NUM` → 6 / 16 / 16 (from 10 / 32 / 32) | WiFi is the **backup** path on this panel. ESP-NOW frames are 48–58 bytes; the trimmed counts are still comfortable for the HA API and OTA. | **~20 KB** |
| 4 | `captive_portal:` removed (`wifi: ap:` **kept**) | It pulls in the async web server *and* a DNS server purely to serve a WiFi-setup page that baked-in credentials make unreachable anyway. Keeping `ap:` means OTA-over-fallback-AP recovery still works. | several KB |
| 5 | `lvgl: buffer_size: 12%` | **Load-bearing.** See below. | protects 1–3 |
| 6 | touchscreen `update_interval:` line removed | With `interrupt_pin` set, XPT2046 stops polling; the boot log asks for the line to go. | cosmetic |

Plus: project version → `4.0.1`, a `debug:` component, and two diagnostic
sensors (below).

> ### ⚠️ Correction (28 Jul 2026, written while fixing v4.0.2)
>
> **Edit 1 recovered nothing, and this document originally claimed it recovered
> the single largest slice. That claim was wrong.** It is corrected here rather
> than quietly deleted, because the wrong number is the reason v4.0.1 was
> expected to hold and did not.
>
> The bootloader line *"Bootloader supports SRAM1 as IRAM (+40KB)"* is true and
> it is also not about the heap. On the ESP32, SRAM1 is reachable through **two
> different address windows**: a data window (`0x3FFE_0000`, byte-addressable,
> where the DRAM heap lives) and an instruction window (`0x400A_0000`). Setting
> `sram1_as_iram` hands the region to the **instruction** window so more code can
> run from IRAM — and to do that safely the linker must then **carve the data
> alias of that same region out of the DRAM heap**, or the two windows would
> alias onto each other and code would be overwritten by heap allocations.
>
> So the net effect on free DRAM is: **+40 KB of IRAM, −40 KB of DRAM, 0 KB of
> heap.** This panel is not short of IRAM. It was short of exactly the thing the
> option gives away. The `abort()` in §1 came from `operator new` on the **DRAM**
> heap; edit 1 could never have touched it.
>
> There is a second reason to be glad it is gone. `sram1_as_iram` requires a
> bootloader built with the same setting. ESP-IDF ≥ 5.1 handles this, but an
> ESPHome **OTA does not rewrite the bootloader** — it replaces the app only. Any
> panel still carrying an older bootloader from a previous flash would have taken
> the new app, mapped SRAM1 as IRAM without the bootloader agreeing, and bricked
> to a boot loop recoverable **only over USB**. On a wall-mounted panel that is a
> screwdriver, not a re-flash.
>
> **Corrected recovery for v4.0.1: ~20–25 KB, all of it from edits 3 and 4.**
> That is real, and it is why v4.0.1 genuinely fixed the boot loop. It is also
> only about a third of what this table promised — which is precisely why the
> panel booted and then died 100–240 seconds later. See
> `DSC-CONTROL-v4.0.2-postmortem.md`.
>
> `sram1_as_iram: true` is **removed** in v4.0.2. Nothing else in edits 2–6
> changes.

### Why edit 5 is load-bearing

Reading the ESPHome LVGL allocator (`lvgl_esphome.cpp:719-745`): when
`buffer_size` is unset it defaults to 0, and LVGL asks for a **full**
`width × height × depth/8` buffer *first*, only falling back to 1/8 on failure.
That is exactly what the log shows — the 153,600-byte request failing on all
nine boots.

So if edits 3–4 had landed on their own, that 153,600-byte grab would have kept
failing anyway (25 KB recovered is nowhere near 150 KB) — but the *reasoning*
still holds and this edit still earns its place, because it removes a
150 KB-sized question mark from the boot path instead of leaving it to luck. Had
the recovery been the 60 KB this table originally claimed, the grab would have
started *nearly* succeeding, which is worse than either outcome.

`buffer_size: 12%` maps to frac 8 → 19,200 bytes — **exactly what the panel was
already running on** after every fallback. The picture is byte-for-byte
identical; the difference is that the allocation is now deliberate and the
recovered RAM stays recovered. Verified in the generated code:
`LvglComponent({cyd_display}, 8`.

**And 12 % is already the floor.** ESPHome buckets the percentage rather than
using it directly (`display.py`): `>= 0.75 → 1`, `>= 0.375 → 2`, `> 0.19 → 4`,
else `8`. Every value in (0 %, 19 %] therefore produces frac **8** and the
identical 19,200-byte buffer. `6%` and `12%` are the same firmware; there is no
smaller draw buffer to ask for, and lowering this number again is not available
as a lever if the panel ever needs more RAM. Worth knowing before reaching for it.

### New: heap visibility in HA

```yaml
sensor:
  - platform: debug
    free:
      name: "Panel Free Heap"
      id: panel_free_heap
      entity_category: diagnostic
    block:
      name: "Panel Largest Free Block"
      entity_category: diagnostic
```

Two diagnostic entities, updating every 60 s. **Watch these after the flash.**
Rough reading: comfortable is 40 KB+; below ~15 KB, stop adding widgets to the
panel. *Largest Free Block* matters as much as *Free Heap* — a fragmented heap
with 30 KB free in 2 KB fragments will still fail an 8 KB allocation.

## 5. What was verified

* `esphome config dsc-control.yaml` → exit 0, `INFO Configuration is valid!`
* `esphome compile` → `main.cpp` generated, 1,683,779 bytes. (The sandbox then
  fails only on the blocked PlatformIO toolchain download — you compile on the HA
  host, as always.) Codegen resolves every lambda `id()`, so a clean generate
  proves no dangling references.
* ~~Generated `sdkconfig` confirms `CONFIG_ESP_SYSTEM_ESP32_SRAM1_REGION_AS_IRAM=y`~~,
  `CONFIG_ESP32_REV_MIN_3_1=y` and the three trimmed WiFi buffer values.
  *(Correction: that symbol being `=y` was verified and reported as a success. It
  was — the setting did what it says. What was never verified is that the setting
  helps, and it does not. Confirming a flag is set is not the same as confirming
  it works; see the correction box in §4. In v4.0.2 the same sdkconfig is checked
  for that symbol's **absence**.)*
* Nothing functional moved: `gv_hub_last` 7 refs (ESP-NOW receive intact),
  `hub_cmd` 152 refs (command path intact), all nine `page_set_*` sub-pages
  present, `captive_portal` 0 refs, `LvglComponent({cyd_display}, 8`.
* `verify_v4.cpp` wire-contract QA unchanged and still ALL PASS — the 0xD1 /
  0xD2 / 0xD3 / 0xDC contract was not touched, so **the hub and pots do not need
  reflashing**.

## 6. Flashing this

**Use USB, or OTA by IP address.** mDNS is marked FAILED on the build currently
running, so `dsc-control.local` will not resolve until this fix lands:

```
esphome run dsc-control.yaml --device 192.168.86.<panel-ip>
```

(or just pick the USB port). After this flash mDNS should come up normally and
OTA-by-name works again.

## 7. Three other things the log showed — not fixed by this patch

**HA API handshake failed.**
`[W][api.connection:2532]: 192.168.86.3: Socket operation failed
HANDSHAKESTATE_SPLIT_FAILED errno=11`. Two candidates: the noise handshake
allocation failed at 4 KB free (in which case this fix cures it), or HA is
holding a stale key from the old `dsc-cyd1` device. Retest after the flash. If it
persists: delete the old `dsc-cyd1` device in HA, re-add `dsc-control`, and paste
the `dsc_control_api_key` value. This affects OTA-by-name and HA entities only —
**not** telemetry or control, which are ESP-NOW.

**mDNS marked FAILED.** `[E][component:188]: mdns is marked FAILED`. A
downstream symptom of the OOM, and the reason for §6. Should clear itself.

**The ESP-NOW channel risk is live.** The log shows
`[I][espnow:261]: Wifi Channel is changed from 1 to 6`, two BSSIDs
(`58:D9:D5:D7:AA:82` and `…AA:E2`) and a 192.168.86.x subnet — a Google/Nest
mesh. That is exactly the hazard flagged in install step 1: *ESP-NOW rides the
WiFi channel; an auto-hop silently splits the link.* Nest hardware does not let
you pin the 2.4 GHz channel, so if the mesh ever moves the panel and the hub onto
different channels, telemetry stops with no error anywhere. If that ever
materialises, the fix is a small dedicated 2.4 GHz AP on a fixed channel for the
DSC fleet, or an ESP-NOW channel-lock in firmware. Worth knowing about; not worth
acting on until it bites.

Also cosmetic and safely ignorable: `gpio_pullup_en(85): GPIO number error` —
GPIO36 (touch interrupt) and GPIO39 (touch MISO) are input-only pads with no
internal pull-up. And `[W][component:473]: lvgl took a long time for an operation
(368 ms)` is the first full render; normal.

## 8. Hub and pots

Not affected, and **deliberately not touched**. The hub runs the `arduino`
framework with zero LVGL blocks — it has none of this pressure and it is running
clean. ~~`sram1_as_iram: true` is available as optional insurance there if you
ever want it~~ — **do not put it on the hub either.** It costs the hub 40 KB of
DRAM to buy IRAM the hub has no use for, and carries the same
bootloader-mismatch brick risk over OTA. There was never anything to gain.

---

**Rollback:** re-flash the v4.0 `dsc-control.yaml`. The wire contract is
unchanged, so a v4.0 panel and a v4.0.1 panel are interchangeable on the link.
The same is true of v4.0.2 — all three panel builds speak the identical
0xD1/0xD2/0xD3/0xDC contract, so the hub and pots never care which one is on the
wall.
