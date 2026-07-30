# DSC-CONTROL v4.0.2 — the runtime crashes, and six UI defects
**Newcastle indoor grow automation · 28 Jul 2026 · panel firmware only**

> **Hub and pots need nothing.** The 0xD1 / 0xD2 / 0xD3 / 0xDC wire contract is
> byte-for-byte unchanged and `verify_v4` still passes clean. This is a panel-only
> flash, exactly like v4.0.1 was.

---

## 1. One sentence

v4.0.1 fixed the boot loop and then the panel started dying **after** boot — two
different crashes, 100–240 seconds in, both from the same cause, and that cause
was never a leak: it was **animation shredding the heap into pieces too small to
use**.

Everything in §5 that looks like a cosmetic fix is a crash fix. That is the
single most important thing in this document.

---

## 2. What the log actually showed

Three boots between 03:38:53 and 03:45:00. Boot A ran 25 seconds and reset. Boot
B ran about 130 seconds and died. Boot C ran about 240 seconds and died
*differently*. Only Boot C's ending was new information — it arrived in the Web
Serial paste, not in the file — and it is the one that made the diagnosis
certain.

### Boot B — the render loop hung

```
[03:40:59][W][lvgl:998]: Failed to allocate 768 bytes for draw buffer
[03:40:59][W][lvgl:000]: [Warn] lv_draw_buf_create_ex: No memory: 24x32, cf: 14, stride: 24, 768Byte,
[03:41:04]E (120751) task_wdt: Task watchdog got triggered.
[03:41:04]E (120751) task_wdt:  - loopTask (CPU 1)
[03:41:04]E (120751) task_wdt: Aborting.
```

Read the timestamps: the allocation fails at `03:40:59` and the watchdog fires at
`03:41:04`. **Exactly five seconds.** That is the ESP-IDF Task Watchdog default,
and `Aborting.` means the build has `CONFIG_ESP_TASK_WDT_PANIC=y`. So this is not
a crash at the allocation — LVGL's draw path took the failure, went into a state
it never came out of, and `loopTask` simply stopped feeding the dog until the
watchdog killed it.

Now decode what failed. `24x32, cf: 14` — in LVGL 9, colour format **14 is
`LV_COLOR_FORMAT_A8`**, an 8-bit alpha mask. 24 × 32 × 1 byte = 768. This is not
a screen buffer, a widget, or a page. **It is the alpha mask for a single glyph**
— one character, being drawn once. The panel could not find 768 contiguous bytes
to draw one letter.

### Boot C — a NULL pointer, from the same starvation

```
[E][lvgl:1023]: Failed to allocate 300 bytes
Guru Meditation Error: Core 1 panic'ed (StoreProhibited).
EXCCAUSE: 0x0000001d   EXCVADDR: 0x00000000   A2: 0x00000000
PC: 0x4000c46c
```

`EXCCAUSE 0x1d` is StoreProhibited. `EXCVADDR 0x00000000` with `A2 = 0` is a
write to address zero. `PC 0x4000c46c` is **ROM `memset`**. Put together: a
300-byte `lv_malloc` returned NULL, nothing checked it, and the code went
straight on to `memset(NULL, …)`.

Two crash signatures, two failing sizes, two entirely different failure modes —
and both are the same event. *An allocation that should have succeeded did not.*
LVGL's internal error handling differs between the draw-buffer path (returns and
wedges) and the plain-malloc path (returns NULL and gets dereferenced), which is
the only reason they look different at all.

### What it was not

**It was not a leak.** I counted every LVGL object the panel builds:

| Widget | Count |
|---|---|
| labels | 362 |
| buttons | 119 |
| generic objs | 75 |
| bars | 8 |
| roller | 1 |
| **total** | **565** |

ESPHome's LVGL integration constructs **all** pages and **all** widgets during
`setup()` — nothing is lazy, nothing is built on page change. Those 565 objects
(~75–95 KB) are a fixed floor established before the first frame and never added
to. The panel that crashed at 240 s was holding exactly the same objects as the
panel at 2 s.

**And it was not simple exhaustion either.** 768 bytes and 300 bytes are tiny.
A panel with 20 KB free that cannot serve 768 bytes does not have a *capacity*
problem. It has a **fragmentation** problem.

---

## 3. Why fragmentation, specifically — the two facts that make this bite

These are the load-bearing details. Neither is obvious from the ESPHome docs.

**① ESPHome sets `LV_USE_STDLIB_MALLOC = LV_STDLIB_CUSTOM`.** LVGL is normally
built with its own internal memory pool, and a pool absorbs exactly this kind of
churn — allocations of one size cycling in and out. ESPHome turns that off.
Every `lv_malloc` in this firmware goes **straight to the ESP-IDF system heap**,
sharing it with WiFi, the API, ESP-NOW and everything else. There is no buffer
between LVGL's allocation pattern and the real heap.

**② Draw buffers are 32-byte aligned.** `LV_DRAW_BUF_ALIGN` is 32 on ESP32, so
`lv_alloc_draw_buf` calls `heap_caps_aligned_alloc(32, size, MALLOC_CAP_8BIT)`.
An aligned allocation cannot use a free block that merely *fits* — it needs one
that fits **and** starts on a 32-byte boundary, so it discards the leading bytes
of any block that doesn't. Aligned allocators fragment a heap dramatically faster
than plain `malloc`, and they starve dramatically earlier on a fragmented one.

Combine them and glyph rendering — a per-glyph, per-draw, 32-byte-aligned A8
mask off the shared system heap — becomes the most fragmentation-hostile thing
the panel does. And this firmware was doing it *continuously*.

---

## 4. The three engines that were doing it continuously

### `SCROLL_CIRCULAR` — the big one

Five labels carried `long_mode: SCROLL_CIRCULAR`: the WiFi sub-line on the
CONNECTIONS page, and all four plant-name labels on the DEVICES page.

`SCROLL_CIRCULAR` is not a text style. It starts an **`lv_anim` that runs at the
display refresh rate**, and every frame it moves the text and invalidates the
label. Invalidate means redraw; redraw means **LVGL takes a fresh 32-byte-aligned
A8 mask for every glyph, every frame, and frees it again**.

A 12-character name at ~30 fps is roughly 360 aligned alloc/free cycles per
second, from one label. Five labels. Forever, while the panel is awake.

That is the mechanism. It is also why the panel would survive 100–240 s and then
die *on whichever page it happened to be sitting on* — the heap is being
confettied at a steady rate from boot, and it crosses the threshold when it
crosses it.

**Fixed:** all five → `long_mode: DOT`. Renders once, sits still, truncates with
an ellipsis. (ESPHome's enum is `DOT`, not `DOTS` — it rejects the plural.) The
WiFi sub-line also went 180 → 200 px wide, which stops `SSID · -xxdBm` colliding
with the value column and is why it needed to scroll in the first place.

### The breathing lambda — 11 icons at 4 Hz

An interval script pulsed `text_opa` on the device icons every 250 ms to make
them breathe. A style change invalidates the label too, so each tick redrew 11
`mdi_22` icons — each one a fresh aligned mask of roughly 484 bytes. A steady
few KB per second of aligned allocation, for as long as the panel is on.

**Fixed:** 250 ms → **500 ms**, phases 24 → 12, with the maths rewritten so the
opacity ramp is still exactly 90 → 255 over the same **6-second** cycle. Half the
redraw rate. It is a slow fade nobody can count frames on; it looks identical.

### `refresh_ui` — 41 labels a second, mostly unchanged

`refresh_ui` runs at 1 Hz and rewrote about 41 labels every pass. The trap is
that **`lv_label_set_text` calls `lv_realloc` unconditionally** — it does not
compare against the current text — and then invalidates the label, forcing the
full glyph-mask redraw. Most of those 41 labels had not changed. Room temperature
does not move every second.

**Fixed:** a `setl` helper, and all **52** `lv_label_set_text` call sites inside
`refresh_ui` swapped to it:

```cpp
auto setl = [](lv_obj_t* o, const char* s){
  const char* c = lv_label_get_text(o);
  if (c == nullptr || strcmp(c, s) != 0) lv_label_set_text(o, s);
};
```

A `strcmp` in place of a realloc plus a redraw. On a quiet second the cost of
`refresh_ui` goes to approximately nothing.

The nine `lv_label_set_text` calls **outside** `refresh_ui` were deliberately
left alone — flashlight percentage, the hold-to-lock hints, the editor title.
They are event-driven, they fire when a human does something, and they are not
part of any loop.

---

## 5. The six UI defects

Reported as: *"EOP-Home is also comming up saying its in the DSC HUB, Pots have
missing icon, and text is clashing. Vertical scroller and last chip is cut off by
tabs"* — plus one more found while fixing those.

### ① The panel identified itself as the hub

```
[I][app:153]: Project digital_emotions.dsc-hub version 4.0.1
```

The panel's own `esphome:` block carried `project: name: "digital_emotions.dsc-hub"`.
It was inherited when DSC-CONTROL was split out of the hub work and never
changed, so HA read the panel's device metadata and filed it under the hub.
**Fixed:** `digital_emotions.dsc-control`, version `4.0.2`. Cosmetic in HA;
confusing everywhere else.

### ② The "missing icon" is a missing em dash — not an icon

Every □ in the photos is **U+2014 EM DASH**. It was being emitted from four YAML
label defaults and four C++ lambdas — the empty-plant `"P%d · %s"` fallback,
`"N/P/K —"`, the empty-SSID fallback, `"ENGAGED — you own outputs"` — and it was
never declared in `cyd_glyphs.yaml`, so LVGL drew its missing-glyph box for every
one. No MDI icon was ever missing; the MDI font is a separate glyph set and was
always complete.

**Fixed:** `—` added to the glyph list (now 98 glyphs). Glyph bitmaps live in
flash, so this costs **zero RAM**. It is also fully deterministic — it was
never intermittent and it was never related to the crashes.

### ③ Text clashing — arithmetic, in two places

The four soil cards on the SOIL page were 40 px tall with a 1 px border and
`pad_all: 6`, leaving **26 px** of interior. They stack an `f_small` name row
(Montserrat 12, ~15 px line height) over an `f_body` values row (Montserrat 14,
~18 px) = **33 px needed**. The two rows were laid over each other by about 7 px.
It never fitted — this was true on the first build and nobody had looked closely.

**Fixed:** height 40 → 42, `pad_top`/`pad_bottom` 6 → 2 (left/right stay at 6 so
the N/P/K column keeps its width) = **36 px interior against 33 needed**. The
header moved up 3 px and the cards up 6 to buy the room; the last card now ends
at y=194, six pixels clear of the tab bar.

**Then the same defect turned up on the CONNECTIONS page**, un-reported: those
rows are 42 px with the same border and padding = 28 px interior, same 33 px of
content. Same fix, same result. Worth knowing that this was a pattern in the
card style, not a one-off on one page.

### ④ Scrollbar and last row cut off by the tab bar

The tab bar is an LVGL **`top_layer`** object at `x:0 y:200 w:320 h:40`. It is
referenced exactly once in the whole file — its own definition — which means
nothing ever hides it. **It covers y=200..240 on every page, unconditionally.**

Meanwhile `clone_scroll` and `main_scroll` were **240 px tall with no
`pad_bottom`**. So the viewport *and* its AUTO scrollbar both ran the full height
of the screen, and the bottom 40 px of both were permanently behind the bar.
Scrolled to the end, the last row landed 17 px underneath it.

**Fixed** across all twelve scroll containers — viewports clipped to end exactly
where the bar begins, and `pad_bottom` to keep the last row off the edge:

| Container | Height | `pad_bottom` |
|---|---|---|
| `clone_scroll`, `main_scroll` | 240 → **200** | none → **8** |
| `ctrl_scroll` | 240 → **200** | 48 → **10** |
| the nine `set_*_scroll` pages | 204 → **164** | 44 → **8** |

Two dead spacer labels at `y: 408` and `y: 546` — previously propping the scroll
extent open — were deleted.

Verified arithmetically off the shipping YAML, not by eye:

```
tab bar occupies y=200..240 on the top layer, always

clone_scroll  vp=200 content=408 maxscroll=208 -> last row bottom on screen = 192  OK
main_scroll   vp=200 content=546 maxscroll=346 -> last row bottom on screen = 192  OK
ctrl_scroll   vp=200 pad_bottom=10 -> flex last item bottom lands at 190           OK
settings x9   y=36 vp=164 -> viewport ends at 200, pad_bottom=8 -> last item 192   OK
```

### ⑤ The ESP-NOW row was lying

The CONNECTIONS page had an ESP-NOW row that read *"arrives with hub firmware"*
next to a dead grey icon and an em dash — written before the hub's ESP-NOW layer
shipped, on a panel whose **entire telemetry path has been ESP-NOW since v4.0**.

**Fixed:** it is now driven live from `gv_hub_last` (the millis stamp written by
the 0xD1 vitals handler) inside `refresh_ui`. The hub broadcasts vitals every
2 s, so 6 s of silence — three missed broadcasts — reads DOWN:

```cpp
uint32_t hub_age = nowms - id(gv_hub_last);
bool espn = id(gv_hub_last) != 0 && hub_age < 6000;
setc(id(conn_espnow_ic),  espn ? NEON : RED);
setl(id(conn_espnow_val), espn ? "LINKED" : "DOWN");
```

with a sub-line of `hub vitals %us ago` when up, `silent %um / %uh / %ud` when
down, and `no hub packet yet` before the first packet ever arrives.

Deliberately **not** derived from the WiFi or API state. ESP-NOW is independent
of both, and the entire point of this panel is that it keeps working when they
are down — so this is now the one row that tells you whether the link you
actually depend on is alive.

### ⑥ Heap numbers you can see

The v4.0.1 diagnostic sensors existed but you had to go looking for them in HA.
Given §2, **largest free block matters more than free total** — both crashes were
small requests failing while the heap still held usable bytes. That is now logged
directly, at INFO, with a warning band:

```cpp
float blk = id(panel_free_block).state;
if (isnan(blk))          ESP_LOGI("heap", "free=%.0f B  largest_block=(pending)", x);
else if (blk < 12000.0f) ESP_LOGW("heap", "LOW  free=%.0f B  largest_block=%.0f B  <- LVGL draw buffers start failing near here", x, blk);
else                     ESP_LOGI("heap", "free=%.0f B  largest_block=%.0f B", x, blk);
```

*(Attempted first as a per-tag `logs: {debug: DEBUG}` override — ESPHome rejects
any per-tag level **more** verbose than the global level. Emitting the reading
from an `on_value` lambda at INFO is strictly better anyway: global DEBUG would
flood the console and consume the very RAM being measured.)*

---

## 6. And the RAM fix v4.0.1 was supposed to be

`advanced: sram1_as_iram: true` — the headline edit of v4.0.1, credited with
**~40 KB** in that document's table — **recovers zero heap.** It is removed.

The bootloader's *"Bootloader supports SRAM1 as IRAM (+40KB)"* is true and it is
not about the heap. SRAM1 is reachable through two address windows: a data window
(`0x3FFE_0000`, where the DRAM heap lives) and an instruction window
(`0x400A_0000`). The option hands the region to the **instruction** window, and
the linker must then carve the data alias of that same region **out of the DRAM
heap** or the two would overlap. Net: +40 KB IRAM, −40 KB DRAM, **0 KB heap**.
The panel was never short of IRAM.

It also carried a real hazard: the setting requires a bootloader built with it,
and an ESPHome **OTA does not rewrite the bootloader**. A panel still carrying an
older bootloader would have taken the new app and boot-looped into a
**USB-only** recovery. On something screwed to a wall, that is a screwdriver.

**So v4.0.1's genuine recovery was ~20–25 KB (edits 3 and 4), not ~60 KB.** That
is the whole story of why it booted and then died: enough headroom to get through
`setup()`, not enough to absorb the fragmentation churn in §4.

The DRAM trims that actually work were kept and extended — WiFi buffers 4/8/8,
AMPDU RX/TX off, `CONFIG_ESP_WIFI_MGMT_SBUF_NUM: 8`, LWIP TCP counts 8, send/recv
windows 2880, `TCPIP_RECVMBOX_SIZE` 16, `ESP_SYSTEM_EVENT_QUEUE_SIZE` 16,
`minimum_chip_revision: "3.1"` (rev 3.1 silicon confirmed in the boot log), and
`captive_portal` still gone with `wifi: ap:` kept so fallback-AP OTA recovery
still works.

Two things deliberately **not** done:

* **`CONFIG_LWIP_MAX_SOCKETS` was set to 6, then removed.** ESPHome auto-sizes it
  from the sockets api/ota/mdns actually claim; the generated value is 10.
  Hard-coding 6 would have fought the framework for a couple of KB and risked
  running the panel out of sockets. Let it size itself.
* **IPv6 was left alone.** It is already off by default on esp32
  (`cv.SplitDefault(CONF_ENABLE_IPV6, esp32=False)`); the generated sdkconfig
  confirms `CONFIG_LWIP_IPV6=n`. No `network:` block needed.

---

## 7. What was verified

The sandbox cannot complete a PlatformIO toolchain download (the TLS proxy blocks
`github.com`, and only `framework-espidf` and `tool-esp_install` are cached — no
cross-compiler), so `esphome compile` cannot finish here. **Codegen is the gate
instead**, and it is a strong one: generating `main.cpp` resolves every lambda
`id()`, so a clean generate proves there are no dangling references anywhere in
5,000 lines of YAML. Everything below actually ran:

* `esphome config dsc-control.yaml` → exit 0, `INFO Configuration is valid!`
* Codegen → `main.cpp`, **1,689,766 bytes**
* **Host semantic harness** — `setl`, the ESP-NOW block and the breathing maths
  extracted into `check.cpp` against **real LVGL 9 signatures**
  (`char* lv_label_get_text(const lv_obj_t*)`,
  `void lv_label_set_text(lv_obj_t*, const char*)`) and compiled with
  `g++ -std=c++17 -Wall -Wextra -Wformat=2 -fsyntax-only` → **clean**
* **`setl` scope safety proved before the swap** — every nested lambda in
  `refresh_ui` that writes a label captures by `[&]`, and `setl` is declared
  ahead of all of them. Every generated call site's second argument was then
  pulled out of `main.cpp` and confirmed `const char*`-convertible.
* **Glyph audit** (PyYAML walk of the LVGL tree with `text_font` inheritance and
  `${substitution}` resolution) → 98 glyphs, **zero real problems**. The one
  reported hit is `0x0a` inside `"…drive every output\nfrom HA…"` — LVGL treats
  `\n` as a line break, not a glyph. False positive.
* **Byte-level non-ASCII scan** of the whole YAML outside comments → only `·`,
  `—`, `°`. All three declared.
* **`verify_v4.cpp` → `==== ALL PASS (0 failures) ====`** — the 0xD1/0xD2/0xD3/0xDC
  contract is untouched, so **hub and pots do not need reflashing**.
* **Generated-artefact checks:** `LvglComponent({cyd_display}, 8` ·
  `SRAM1_REGION_AS_IRAM` **absent** from both sdkconfigs ·
  `CONFIG_ESP32_REV_MIN_3_1=y` · every WiFi/LWIP trim present ·
  `CONFIG_LWIP_IPV6=n` · `CONFIG_LWIP_MAX_SOCKETS=10` (ESPHome-sized) ·
  `SCROLL_CIRCULAR` **0 refs** · `captive_portal` **0 refs** · `sram1_as_iram`
  present only as the config-dump comment `// sram1_as_iram: false` ·
  `gv_hub_last` 15 refs · `hub_cmd` 154 · `page_set_` 135 · `setl` 111
* **Layout arithmetic** re-derived from the shipping YAML (§5④), not eyeballed.

---

## 8. Flashing this

OTA by name should work now — mDNS came up clean on the v4.0.1 boots:

```
esphome run dsc-control.yaml
```

Keep `cyd_glyphs.yaml` beside it; the panel `!include`s it and the em-dash fix
lives there, not in the main file.

**Then watch it for ten minutes.** The old failure took 100–240 s, so a panel
that is still drawing after ten minutes has cleared the bar that v4.0.1 failed.
The heap line now prints on its own in the log:

```
[I][heap]: free=51284 B  largest_block=38912 B
```

Comfortable is 40 KB+ free with a largest block above ~20 KB. If
`largest_block` ever starts drifting down toward 12 KB you will get
`[W][heap]: LOW …` — that is the panel telling you it is back in the state that
produced these two crashes, before it crashes.

**Rollback:** re-flash v4.0.1 or v4.0. All three panel builds speak the identical
wire contract, so the hub and pots never care which one is on the wall.

---

## 9. Still open

* **`[W][touchscreen:031]: Touch Polling Stopped. You can safely remove the
  'update_interval:' variable`** still fires even though `update_interval:` was
  removed in v4.0.1. Harmless — it means the interrupt-driven path is active,
  which is what we want — but the message is being emitted from something other
  than the line it names, and I have not chased where yet.

* **The Nest channel hazard is live and unfixed.** The log shows
  `[I][espnow:261]: Wifi Channel is changed from 1 to 6.` on every boot, two
  BSSIDs (`58:D9:D5:D7:AA:82` / `…AA:E2`) on a 192.168.86.x subnet — a Google/Nest
  mesh. ESP-NOW rides the WiFi channel, and Nest hardware will not let you pin
  2.4 GHz. If the mesh ever puts the panel and the hub on different channels,
  **telemetry stops with no error anywhere**. The new ESP-NOW row (§5⑤) is now the
  thing that would show it — it will read DOWN within six seconds. The real fix,
  if it ever bites, is a small dedicated AP on a fixed channel for the DSC fleet.

* **`espnow_cmd_tag` is still the default `43981` (0xABCD).** It is a
  replay/sanity guard, not encryption. Change it in *both*
  `dsc-hub-espnow-primary.yaml` and `dsc-control.yaml` when convenient.

Cosmetic and safely ignorable, unchanged from v4.0.1: `gpio_pullup_en(85): GPIO
number error` (GPIO36/39 are input-only pads with no internal pull-up) and
`lvgl took a long time for an operation (325 ms)` on the first full render.
