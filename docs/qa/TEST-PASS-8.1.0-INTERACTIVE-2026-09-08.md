# DSC-HUB 8.1.0 — interactive (write-enabled) test pass, 2026-09-08

Companion to `TEST-PASS-8.1.0-2026-09-08.md`, which was **read-only**. This pass
was browser-driven with writes authorised by the operator, against the live rig
(brain 8.1.0 on `192.168.86.48:8787`, fleet 8.1.0.0).

Every row below says **COMPLETED**, **BLOCKED** or **NEEDS RE-RUN**, and why. The
honest gaps are listed as prominently as the passes — several areas of the plan
were not reachable, and one test physically took the rig down.

---

## Headline

The pass found **26 new defects** — three Critical — verified five
previously-logged entries, reversed one that had been closed wrongly, and caused
**two unplanned outages** (both traced to the same root-on-USB fragility).

### The one architectural theme worth fixing first

Five separate defects are the same idea: **stability is treated as
correctness.** Nothing in the stack asks whether a reading is *physically
possible* — only whether it is *settled*.

| Layer | Mechanism | Why it fails |
|---|---|---|
| Firmware | Republishes a failed probe's last Modbus read forever | A frozen value is maximally stable |
| `probe1_sensor_stuck` | Detects "stuck" sensors | Fires on absent data, not frozen data |
| `quality_score` | `100 − variance*10` | The steadier a dead sensor, the better it scores |
| `sensor_clamp` | Range guard, `temp_c.max 50.0` | Sits **exactly on** the sensor's rail value |
| `plausible_vpd_kpa` | Plausibility predicate | Dead code — zero callers |

Chained, they produced pot1: a loose connector opens → firmware latches
19.9 % / 48 µS / pH 5.0 → the stuck detector stays quiet → a soil test certifies
it **100/100, confirmed** → an earlier pass closes it as "resolved" → the frozen
value feeds heat-mat control for 24 h. Fixing this one idea closes a whole class.

Three results matter most:

1. **The photoperiod anchor cannot be written from the SPA at all**, because of a
   one-character `object_id` mismatch.
2. **The Pi's clock is 7 minutes slow and has never NTP-synced**, which took the
   hub's `clock_valid` false and closed the 4×8 photoperiod window ~6.4 h early
   on a day-61 flowering tent.
3. **A failed soil probe keeps publishing its last reading forever**, so a dead
   probe is indistinguishable from a healthy one — and the brain's own
   stuck-sensor detector missed a 24 h flatline entirely.

| # | Finding | Severity |
|---|---|---|
| 1 | Photoperiod anchor unwritable — `lights_on_time` vs `lights-on_time` | **Critical** |
| 2 | Fleet-wide time failure — Pi 7 min slow, never synced, no NTP for the SoftAP; hub `clock_valid` false; photoperiod closed 6.4 h early | **Critical** |
| 3 | Failed Modbus probe latches its last value forever — dead probe looks healthy | **Critical** |
| 4 | Root FS on USB SSD — a webcam *and* a plain `docker restart` each took the host down | High |
| 5 | `probe1_sensor_stuck` missed a 24 h flatline; fires on null, not on frozen | High |
| 6 | `fleet.canopy` is one global slot — the 2×4 canopy sensor's live data is discarded | High |
| 7 | EC Want bands are feed-water values compared against **bulk** substrate EC — band unreachable | High |
| 8 | Exhaust capacity is 93 % nameplate but stamped `measured`; pressure figure inherits it | High |
| 9 | Overview vs Climate disagree on "Want"; rail chips use a different band than the number shown | High |
| 10 | Hub's VPD in-band counter wrong by ~40× (0.16 h vs a measured 6.85 h) | High |
| 11 | Compose assigns an occupied probe with no warning; new plants default to "Flowering day 61" | High |
| 12 | CannaLib strain detail blank for every strain — schema mismatch; 230 KB / 8 s payloads | High |
| 13 | USB flash wizard: `firmware_dir` empty in the running brain; `bridge` has no `.bin` | High |
| 14 | SPA computes freshness across two clocks — a wrong server clock blanks live probes | High |
| 15 | pot1 probe dead (operator root cause: Dupont connectors need soldering) | High |
| 16 | Settings caches failed fetches forever — false "OLD BRAIN" / "fetch failed" | Medium |
| 17 | Railed sensor values written to history and fed into VPD during a known fault | Medium |
| 18 | Hub stage selector ≠ plant/expected stage; active band follows the plant | Medium |
| 19 | `heater_temp_oos_latch` doesn't latch — 70 transitions in 48 h; runtime gate is cumulative-today | Medium |
| 20 | Journal stamps the four-part *firmware* version into `brain_version` | Medium |
| 21 | `Bounces —` / `RF —` on Alerts **and** Kit while both values are live | Medium |
| 22 | Range sliders are mouse-only — arrow keys inert | Medium |
| 23 | Probe fault binary sensors report `tracked:True` but record no history | Medium |
| 24 | Brain ingests `soil_moisture_raw`, discarding on-device calibration | Medium |
| 25 | System OS/journal log viewer never works, and misdiagnoses why ("not a Pi") | Medium |
| 26 | Kit ALERTS tile carries the Air Path panel's caption | Low |
| 27 | Network MAC column empty for all 10 devices though ESPHome returns it | Low |
| 28 | `/fleet` has no polling fallback — WS dies, seat values freeze while computed keeps updating | High |
| 29 | `fleet.canopy` is one global slot — 2×4 canopy sensor's live 26.3 °C / 47 % discarded | High |
| 30 | Plausibility layer inert — `sensor_clamp` PATCH 200-and-discarded, clamps sit **on** the rails, `plausible_vpd_kpa` dead | High |
| 31 | Soil-test `quality_score` is variance-only — both tests 100/100 with EC 0, N 0, K 0, pH 7.9 | Medium |
| 32 | Energy estimate `ok:false` both spaces; suggestions compute `delta_vs_current` against zero | Medium |

### Verifications against previously-logged entries

| Existing entry | Result |
|---|---|
| `time.set_value` had no branch in the control proxy | **Still broken** — branch now exists, but the lookup inside it uses the wrong `object_id`. Root cause identified (finding 1). |
| Air-path numbers imply critical over-pressure | **Still present** — but the pressure sign is *correct*; the defect is mixed allocated/measured bases. Details below. |
| Air Path map is unreadable | **Still present** at 1600 px — four specific defects enumerated. |
| Efficacy panel chips render em-dashes | **Appears fixed** — all chips carry values. Caveat: the no-data path was not exercised. |
| CannaLib lights by-id 404s | **Still reproducible**, and correctly scoped to lights — strains by-id return 200. |

All logged to the Notion tracker with reproduction steps.

---

## A. Overview — every interactive element

**Status: COMPLETED.** 52 interactive elements enumerated and exercised.

| Element group | Result |
|---|---|
| Nav links ×11 | all route correctly |
| Honesty-gap disclosure | expands/collapses; correctly attributed the gap to `HUB OFFLINE` |
| Metric drill-downs (T / RH / VPD, both tents) | drawer opens, all 6 ranges (1h/6h/24h/48h/Cycle/Photo) re-render with distinct data |
| Appliance chips (HEAT/COOL/HUM/DEHUM/MAT/…) | navigate to Climate as designed |
| OOS chips, "Not reporting" chips | honest, non-alarming, as intended |
| Camera placeholders ×2 | correct empty state |
| Fan duty rows ×4, Open Light/Root/Climate/Logs links | all navigate |

**Zero JS console errors** during normal operation. (The only console errors in
the session were network failures during the outage in §H.)

Staleness handling on the live desks was **excellent** and deserves recording:
while the hub was offline the header moved `UPDATED 0S → 2M → 18M`, the canopy
chip flipped to `STALE`, and the honesty-gap counter explained exactly which
claim the kit could no longer make. This is the behaviour Settings fails to
match (finding 5).

---

## B. Write-then-undo — brain-side state

**Status: COMPLETED.**

| Target | Write | Verify | Undo | Restored? |
|---|---|---|---|---|
| Preferences › High contrast (browser-local) | toggled on | nav badge `1 CHANGED → 2 CHANGED` | toggled off | ✅ badge back to `1 CHANGED` |
| Root steering › EC target | 2.2 → **2.6** | `SAVED` badge + `RESET` affordance appeared; API confirmed `targets.ec_target_ms=2.6`, `defaults` untouched, **no other field mutated** | UI `reset` control | ✅ back to 2.2 |

The `PATCH` was cleanly scoped — only the edited key changed. The `SAVED` /
`PENDING` / `RESET` affordances are well-designed and honest.

**Final state verified byte-identical to baseline** for
`root-steering-targets`, `global-modifiers`, `stage-rail`, `probe-stations`,
`alerts`, `automations`, `cameras`.

---

## C. Write-then-undo — hub entities

**Status: PARTIALLY BLOCKED, then CRITICAL FAILURE FOUND.**

Initially **BLOCKED**: the hub node was offline, and the SPA correctly greyed out
every hub-owned control (`full_auto_mode`, `tent_manual_override`,
`humidifier_intake_routing`, `recirc_de_strat_pulse` all marked `unavailable`,
setpoint fields rendered non-interactive). That is correct behaviour, not a bug —
but it gates the tests.

After the operator power-cycled, the hub returned and all controls became live
(`FULL AUTO ON`, heater `pushing 21.5 → 18.0`).

Then the photoperiod re-anchor (§D) exposed **finding 1**, which means hub
*time* writes are broken product-wide.

**NEEDS RE-RUN:** hub switch/number/select writes (Full Auto, manual takeover,
fan override, strategy, priority tent) were **not** exercised. Once the hub came
back the session had already committed to diagnosing finding 1, and toggling
actuators on a live flowering tent was not worth doing casually. A full audit of
the map (below) suggests these *should* work — but that is inference, not a test.

**Mapping audit (completed):** every brain→hub `object_id` map cross-checked
against the live hub entity list:

| Map | Mapped | Live | Missing |
|---|---|---|---|
| SWITCH | 19 | 31 | **1** — `manual_light_hold_switch` (hub publishes `manual_light_hold`) |
| NUMBER | 38 | 39 | 0 |
| SELECT | 5 | 5 | 0 |
| TIME | 2 | 2 | **2** — both, see finding 1 |

So the blast radius is bounded: all time writes and one switch are broken;
numbers and selects are clean.

---

## D. Crop scheduler re-anchor

**Status: COMPLETED as a test — and it FAILED, revealing finding 1.**

The UI behaviour is exactly as specified:

- Set either end → **the other back-solves from the 12 h rail** ✅
- Correct across midnight: `15:00` → `03:00` ✅
- **Preview before write**: `⚠ PENDING 06:00 → 15:00`, with `Apply now` / `Cancel` ✅
- Live header stays at the current value until applied ✅
- On failure: **`Write failed — schedule unchanged`** — honest ✅

The write itself fails. Instrumenting `fetch` in the page captured it:

```
POST /control/service
{"domain":"time","service":"set_value",
 "data":{"entity_id":"time.dsc_hub_lights_on_time","time":"15:00:00"}}
→ 503 {"detail":"hub time lights_on_time not found"}
```

**Cause:** ESPHome derives `object_id` from `name:`, not `id:`.

```yaml
# firmware/v4/dsc-hub-v4_0.yaml:2956
name: "Lights-On Time"    # → object_id  lights-on_time   (hyphen)
id: lights_on_time        # ← brain maps to this          (underscore)
```

Live hub confirms `TimeInfo object_id=lights-on_time key=205631832`.
`brain/dsc_brain/hub_controls.py:266` maps the underscore form, so
`keys.get("lights_on_time")` misses at `control_ops.py:337`.

Notably `HUB_SENSOR_OID_TO_KEY` already defends against this exact hazard
(it lists both `vpd_kpa` and `vpd__kpa_` variants, commented "id and name-slug
variants"). The time map is the one place that forgot.

**The read path is broken the same way.** After the hub was confirmed holding
`15:00`, `/fleet/computed` continued reporting `time.dsc_hub_lights_on_time =
06:00:00` for 60 s+ of polling. The desk shows a photoperiod that is not the one
the hub is running.

The Light desk's own `LIGHTS ON` field is worse: it accepts input and **sends no
request at all** — a silent no-op. (Confirms the existing logged finding about
Light desk writes never reaching the hub.)

**Operator-requested change applied.** Mid-session the operator asked for
15:00 on / 03:00 off. Since the product could not do it, it was written directly
to the correct entity key after confirming intent:

```
c.time_command(205631832, 15, 0, 0)
→ TimeState(key=205631832, hour=15, minute=0, second=0)   ✅ on the hub
```

This was **not** restored — it is a deliberate operational change, not test
scaffolding. Note the brain UI will keep displaying `06:00` until finding 1 is
fixed, and the lamps are currently on a manual plug outside hub control, so the
hub will not switch them at 03:00 until they are handed back to it.

---

## E. Cameras

**Status: BLOCKED — the test caused an outage.**

Plugging the USB webcam directly into the Pi browned out the USB bus. Because
`/` and `/boot/firmware` are on a **USB-attached Samsung T1 SSD**
(`lsblk … sda TRAN=usb`), the root filesystem went away under a running system.

Symptoms, in the order they confused the diagnosis:

| Probe | Result |
|---|---|
| `GET /openapi.json` | 200 — in-memory, no disk needed |
| `GET /` | **200 but 0 bytes** — `index.html` unreadable |
| `/health`, `/fleet`, `/rooms`, `/settings`, +4 more | **500** |
| TCP 22 | connects, then aborts mid-handshake |
| Recovery | none — required a power cycle |

Not disk space (51 G of 459 G used). The pre-crash journal was never flushed, so
`journalctl --list-boots` shows only the current boot — consistent with losing
the device it writes to.

**No camera testing was performed.** Capture, snapshot, MJPEG, retention,
timelapse, zone thumbnail and the Devices › Cameras drawer are all **untested**.
`GET /cameras` matches baseline (no camera was ever added).

**To re-run:** powered USB hub only. Never attach peripherals directly to this
Pi while root is on USB. This applies to the §F flash test too.

---

## F. USB flash wizard

**Status: PARTIALLY COMPLETED.**

**The zero-byte regression is genuinely fixed** — confirmed, close that concern.
The 8.1.0 stage carries eight real binaries:

```
control.bin 1,385,184   hub.bin  1,287,040   pot1/pot2.bin 1,141,424
heater/heatmat.bin 475,472   humidifier/dehumidifier.bin 475,488
```

Byte-identical between bake source and `stage-8.1.0`.

**But the running brain cannot see any of them.** `GET
/settings/usb-flash/manifest` reports `firmware_dir:
/app/services/dsc-hub/firmware/kit`, which is **empty inside the container**. The
mounted volume `/firmware` is empty and has no `kit/` at all. The real binaries
live under `/opt/dsc-hub-bake-*` on the host — unmounted. So the wizard
advertises nine flashable roles and can serve zero.

Also: `bridge` is advertised with `bridge.bin`, but no `bridge.bin` exists in any
location — nine roles, eight binaries. And the bridge boot note contains a
double-encoded em dash (`â€"`).

**NOT DONE:** no flash was attempted. `ports` returns `{"ports":[]}` (no adapter),
`jobs` returns `{"jobs":[]}`. Every kit seat is live on 8.1.0.0 and reflashing one
was out of scope. **End-to-end flash remains untested** and needs a bench seat.

---

## G. Visual, performance, responsive

**Status: COMPLETED.**

**Responsive (375 px):** good. Real mobile bottom nav (Overview/Climate/Plants/
Alerts/More), cards stack, gauges legible. **No horizontal page overflow** —
`scrollWidth == clientWidth == 375`. Long grow-log lines use ellipsis truncation
by design, not clipping.

**Performance:** no jank observed. Route transitions and drawer opens were
immediate. Median API latency ~75 ms (unchanged from the read-only pass).

**One measurable inefficiency, now with a second cost:** `/fleet/computed` polls
every 5 s at ~42 KB. During debugging this flushed the browser's 500-entry
network buffer within ~40 s, making it impossible to inspect a write after the
fact — the `fetch` interceptor in §D was only necessary because of it. Already
logged as Low; worth noting it also hurts diagnosability.

**Not attempted:** accessibility (contrast, keyboard nav, screen reader) and
light/dark theming. The SPA appears dark-only; no theme toggle was found.

---

## H. Unplanned: outage and recovery

Documented in §E and finding 2. Recovery was clean — four containers back, all
previously-500ing routes at 200, SPA index serving 729 bytes, **no data loss**
(all 13 settings surfaces byte-identical to their pre-outage snapshots).

**Process finding worth carrying forward:** the pre-agreed restore points lived in
`/tmp/testbaseline/`, and `/tmp` is **tmpfs**. The reboot destroyed all 13 of
them. Baselines for a write-testing session must not live on tmpfs. They were
re-captured to an off-box location before any further writes; sizes matched the
originals, so nothing was actually lost — but only by luck.

---

## I. Corrections on the record

Six of my own conclusions were wrong during this pass and were corrected. They
are listed together because the pattern matters more than any one of them: in
every case the error came from accepting a reading without asking what else
would have to be true.

| Claim I made | What was actually true |
|---|---|
| "Hub link is flapping" (filed High) | The flapping was the developing USB brownout. 0 disconnects / 0 failsafes after reboot vs 8 / 3 before. Downgraded, re-attributed. |
| "The brain's ingestion has stalled" (filed Critical) | **No stall.** I was differencing Pi timestamps against my own clock. Withdrawn. |
| "The tester's Windows clock is 7 min fast" | **Backwards.** Windows was ~3 s off true; the **Pi** is 7.08 min slow and never NTP-synced. This became finding #2. |
| "Air-path intake/exhaust are swapped" | Not swapped — two different allocation bases. `−112 cfm` is genuinely correct under-pressure. |
| "Pages render slowly" | ~100 ms to content on every route. The blank screenshots were the pane capturing before paint. |
| "pot1's frozen 18.7 °C drove the heat mat's 72 % duty" | Unproven — pot2's real range (17.7–21.3 °C) straddles the arm band and could account for it. Stated as participation, not causation. |

The withdrawn ingestion-stall finding is the costly one: I acted on it and
restarted the brain, which rebooted the host. The tell was visible and I
explained it away — the brain was reporting `last_seen` ages **longer than the
container had been alive**, which is arithmetically impossible.

## I-bis. The original hub-link correction

The hub-flapping finding was filed **High** early in the session (15 % packet
loss, 8 disconnects, 3 `Sonoff failsafe OFF` firings in 6 h) and attributed to
the hub node.

That attribution was **wrong for the serious half**. After the brownout reboot:

| | Before (6 h) | After (15 min) |
|---|---|---|
| Hub disconnects | 8 | **0** |
| Failsafe firings | 3 | **0** |
| Packet loss | 15 % | **0 %** |

The flapping was the developing power fault, not the hub. What survives is
narrower: the hub answers at 81 ms avg / 256 ms max against the panel's 8.5 ms,
with no loss. Downgraded to Medium / Needs Verification pending a soak.

---

---

## J. Second sweep — the pages the first sweep skipped

The first sweep covered only Overview and Climate. The operator correctly
pointed out that issues existed which had not been found. This sweep walked the
rest.

### Alerts — COMPLETED

Renders correctly: `Nothing active · 0 rules · 0 firing now`, 24 h history
grouped ALERT → HUB → NOTE (the apparent out-of-order timestamps are that
grouping, by design), and an honest disclosure that fired counts are not yet
recorded.

**Found:** the LINK panel renders `Bounces —` and `RF —` while
`link_recovery_bounces = 0.0` and `wifi_rssi = -34.0` are live in `/fleet`.
`Up 40M` in the same row is populated, so the panel *can* read hub values.
Zero bounces is good news being suppressed — and these are exactly the two
numbers an operator would come here for during the link trouble seen earlier.

### Kit — COMPLETED

Inventory, Learning and Calibrate all render. `KIT PULSE` radial diagram is
good. `6/9 in service` is correct (AC, mister, tank out of service).

**Found:** the `ALERTS` summary tile is captioned
`"CFM from Learning (anemometer)."` — the Air Path panel's caption, verbatim.
`IN SERVICE` in the same row has no caption at all, suggesting the captions are
offset by one. Same `Bounces —` / `RF —` chips as Alerts, so that defect spans
at least two desks.

### Logs — COMPLETED, including a write/undo

Journal browser renders with scope tree, filters, Trends / Compare scopes /
Compare entries / Export CSV.

**Journal write-then-undo: COMPLETED.**

| Step | Result |
|---|---|
| Create room note via UI | `id=693`, `provenance=room`, `room_id=grow_room` |
| Env snapshot captured | `room_temp_c 22.8 · room_rh_pct 51.6 · room_vpd_kpa 1.343` |
| Delete | `{"ok":true,"deleted_id":693}`, total `1434 → 1433`, id gone |

The audit trail also correctly captured the §B root-steering write *and* its
undo, in order.

**Found:** journal snapshots stamp `brain_version = "8.1.0.0"` — the four-part
*fleet firmware* stamp — while the brain is `8.1.0`. Entries with `space` or
`room` provenance carry no version at all, so two thirds of journal rows have no
version provenance. This conflates the two version schemes the project
deliberately keeps separate.

Minor, not filed: `GET /journal/room/{unknown_id}` returns `200 {"total":0}`
rather than 404, so "no such room" is indistinguishable from "no entries".

### CannaLib — COMPLETED

Catalog resolves to `BRAIN CATALOG / CANNALIB`, 12 hits, filters render.

**Found (High):** the strain detail pane is blank for every strain. The SPA
calls the correct route and gets `200`, but the response is schema
`strain_tree_v1`, whose top level is
`schema, id, name_norm, name, focus, matched_via, source, evidence, branches` —
none of `type`, `breeder`, `want`, `height`, `flower`, `thc`. Only `name`
matches, which is why `Name` is the single field that renders.

A cold brain briefly returns a small **curated** record (663 B) that *does* have
those fields; every warm call returns `strain_tree_v1` at 138–230 KB taking up
to 8.6 s. So the pane can look correct immediately after a restart and never
again.

The known lights-404 entry is **correctly scoped** — strains by-id return 200,
lights by-id 404. Different mechanisms, same outcome: the CannaLib detail
surface resolves nothing for either kind.

### Plants — COMPLETED

Roster renders two plants (`#1 Grandmommy Purple / Probe 2`,
`#4 Runtz Punch / Probe 1`), both active, with Edit / Detach / Delete. Crop
scheduler duplicated from Climate. No new defects.

Confirms the read-path half of finding 1 from the UI: the scheduler shows
`LIGHTS ON 06:00` while the hub is holding `15:00`.

### Twin — BLOCKED (environment, not a defect)

Chrome renders — layer toggles (Air/Heat/Humidity/Light/Plants/Devices/Labels),
camera presets, legend. But `canvas: 0`, zero GLB requests, `FPS —`.

**This is not a product bug and must not be filed as one.** The `twin-three`
chunk loads fine (all 5 chunks present) and WebGL is available in the pane
(`ANGLE / RTX 3090`). The blocker is that **the Browser pane fires zero
`requestAnimationFrame` callbacks**:

```
rafFramesIn2s: 0    rafFires: false    visibilityState: "visible"
```

An rAF-driven three.js scene cannot initialise under those conditions. **Twin
rendering is unverified** and needs a real browser.

### Performance — measured, and it is good

An earlier impression that pages rendered slowly was **wrong**, and worth
correcting: the blank screenshots were the pane capturing before paint, not app
lag. Measured time-to-content per route:

```
#/kit 102 ms · #/logs 104 ms · #/plants 105 ms
#/alerts 111 ms · #/root 101 ms · #/light 103 ms
```

~100 ms on every route. **No performance defect.**

---

---

## K. Third sweep — driving the dash as a grower, and interrogating the numbers

The operator's feedback part-way through was fair and worth recording: the pass
had been reading values and accepting them rather than asking *"is that right?"*,
and had been API-diving rather than **using** the dashboard. Both were true. This
section is what changed when that was corrected.

### Real grower tasks, driven through the UI

| Task | Result |
|---|---|
| *"The 2×4 is empty — put a plant in it"* | **Found a High.** Compose offered Probe 1 (holding a live day-61 flowering plant), accepted it silently through all five steps, and presented `Add plant to Probe 1`. Sprout date pre-fills from the existing plants, so a new clone composes as "Flowering · day 61". Draft discarded; roster verified unchanged. |
| *"Tell me if the tent goes over 28 °C"* | **Cannot be done.** Settings › Alerts is a fixed catalogue of built-in conditions with severity toggles only. The Alerts desk says "Edit rules in Settings", which does not lead to rule authoring. Automation › Add rule does exist and produced a usable draft (`tent_temperature > 32`, banner action, debounce/release/window) — removed cleanly. |
| *"Should I water?"* | **Found three.** The Root desk blanked every probe value as `SENSOR FAULT / PROBE DARK` while data was 3 s old — one half client-clock, one half real device flags. Led to the pot1 flatline. |
| Journal write/undo | **COMPLETE.** Created a room note via the UI (`id=693`, env snapshot captured), deleted it, `total 1434 → 1433`. |
| Fan demand scale write/undo | **COMPLETE, and found a Medium.** Drag works and persists (1.00 → 0.50, `SAVED`, brain confirmed). Keyboard does nothing — 13 Left and 5 Right presses moved it zero steps while focused. Restored to 1.0 and verified byte-identical. |

### Interrogating numbers instead of reading them

Four things had been *seen* earlier in the pass and accepted. Re-examined:

- **`vpd_main_band_hours = 0.16`** against a desk reading "in band 6h 43 of 24 h".
  Integrated 1,469 history samples over the live 1.2–1.4 band: **6.85 h**. The
  desk is right; the hub counter is wrong by ~40×.
- **`exhaust_capacity_total = 118.6`, honesty `measured_capacity_not_allocated`** —
  but `exhaust_recirc = 110.0` carries `capacity_proxy_nameplate`. 93 % of a
  "measured" total is a datasheet number, and the headline `Negative pressure
  −112 cfm` inherits it.
- **`got_source: "twin"`** on the 4×8 delivered-light figure, stamped
  `honesty: ok` — a modelled value labelled like a measured one.
- **`soil_moisture 20.9` vs `soil_moisture_raw 19.9`** on the device, with the
  brain storing 19.9 — the on-device calibration never reaches any desk.

### The EC question, settled with the operator's water test

The operator tested the feed: **pH 6.64, EC 2656 ppm** (≈3.8 mS/cm on the 700
scale, ≈5.3 on the 500 scale). pot2, freshly saturated with it, peaked at
**394 µS** and drained through 326 → 262 → 195.

`brain/dsc_brain/want.py` sets `ec_us` bands of 400–800 / 1000–1600 / 1600–2400
for seedling / veg / flower — textbook **feed-water** EC. The firmware comments
state plainly that the probe reports **bulk** EC (`N/P/K: DERIVED from bulk EC`).
Those are different physical quantities, and bulk runs several times lower, so
the flower band is unreachable by construction and EC reads "too low" forever —
in the dangerous direction, since it invites heavier feeding.

pH cross-checks cleanly (feed 6.64, pot2 6.4–6.5), which isolates the fault to
the EC channel's unit domain rather than the probe.

### The watering, watched live

pot2 tracked it perfectly and pot1 did not move at all:

```
        moisture      EC        pH
pot2    27.2 → 61.6   76 → 394  6.0 → 6.4     then drained 59.9 / 58.8 / 57.7 / 47.9
pot1    19.9 → 19.9   48 → 48   5.0 → 5.0     (fresh data, simply unchanging)
```

24 h of history: pot1 produced **4 distinct moisture values** across 579 samples;
pot2 produced **113** across 797. A node reboot then dropped pot1 to `None`,
proving the values had been latched, not measured. **This reverses the earlier
"RESOLVED BY REFLASH" entry** — the reflash restored numbers, not sensing.

Operator root cause: the probe is on Dupont connectors that disconnect when
bumped, and needs soldering.

---

## L. Fourth sweep — pulling the "stability ≠ correctness" thread

Having named the pattern, the remaining sweep looked for more of it, and for
whatever else the untouched surfaces held.

### The plausibility layer is inert — three parts, all verified

```
PATCH /settings/global-modifiers  {"sensor_clamp":{"temp_c":{"max":45.0}}}
  -> HTTP 200
GET   /settings/global-modifiers
  -> temp_c.max = 50.0            unchanged, silently discarded
```

`set_global_modifiers` (`global_modifiers.py:56`) reads only
`fan_demand_scale`, `light_brightness_scale`, `moisture_dry_pct`,
`temp_offset_c` and `rh_offset_pct`. `sensor_clamp` is *consumed* by
`apply_temp_rh_offsets` but can never be *set*. The codebase already knows —
`settings_manifest.py:134` carries the note *"patch route accepts clamps
(tracker: set_global_modifiers ignores sensor_clamp)"*. The 200 is the part that
should not stand.

Worse, the defaults sit **on** the rails: `temp_c.max 50.0`, `rh_pct.max 100.0`
— exactly the values the 4×8 sensor railed to on 2026-09-08. The one failure a
clamp exists to catch is the one it is configured to admit, and the operator
cannot tighten it.

And `plausible_vpd_kpa()` (`climate_math.py:24`) has **zero callers** repo-wide.

### Soil-test scoring rewards dead sensors

```python
quality = max(0.0, min(100.0, 100.0 - variance * 10))     # soil_tests.py:284
```

Both stored tests scored **100.0**:

```
08-31  moist 17.7  ec 0.0  ph 7.9  N 0  P null  K 0   quality 100  confirmed
08-28  moist 19.0  ec 9.0  ph 6.5  N 0  P null  K 0   quality 100  confirmed
```

EC 0.0 in moist substrate, pH 1.4 above `want_ph_max`, and a perfect score —
because the values were steady. The rejection path's message is telling:
*"readings not stable — wait for solid capture"*. Instability is the only thing
that can fail a capture.

### Energy: broken estimate, and suggestions that invert

```
GET /energy/estimate?space_id=4x8  -> ok:false  "no schedule: lights-on unset"
GET /energy/estimate?space_id=2x4  -> ok:false  (same)
```

Downstream of the `lights-on_time` read failure. But the suggestions endpoint
still returns three confident options, each differenced against that zero:

```
max_offpeak  22:00  total 1.1808  delta_vs_current 1.1808
night_heat   20:00  total 1.3152  delta_vs_current 1.3152
morning      06:00  total 1.8336  delta_vs_current 1.8336
```

`delta == total` throughout. The proof is `morning` — `lights_on 06:00` is the
schedule the brain already believes is current, so its delta must be zero; it
claims **+$1.83**. Every option, including the cheapest, presents as a cost
*increase*.

### Two data paths, one screen

`/fleet/computed` polls every 5 s over HTTP. `/fleet` is **never** requested —
334 fleet-matching network entries, none to `/fleet`. The snapshot arrives only
by WebSocket, and `applyFleet` stamps `lastUpdatedAt = Date.now()` client-side,
so `UPDATED 42M AGO` means exactly what it says.

Measured consequence: the Overview showed `PROBE 2 · 48%` while the API returned
**43.7 %** — 42 minutes of drain missing, rendered as a live number beside a
5-second-old VPD.

### The 2×4 canopy sensor is discarded

```
zigbee_by_role:  canopy_4x8  22.6 °C / 51 %      <- published
                 canopy_2x4  26.3 °C / 47 %      <- thrown away
```

`_recompute_canopy` (`zigbee_mqtt.py:575`) iterates the canopy roles and
`break`s after the first, and only singular `sensor.dsc_canopy_temperature` /
`_humidity` are published. The discarded reading is a 2.7 °C canopy-to-air delta
in a tent whose air is 23.6 °C — precisely what a canopy sensor is mounted to
reveal.

---

## Honest gaps — what this pass did NOT cover

| Area | Why | To run it |
|---|---|---|
| **Cameras, entirely** | the test caused an outage | powered USB hub |
| **USB flash end-to-end** | would reflash a live seat; no adapter attached | bench seat |
| **Twin 3D rendering** | Browser pane fires no rAF — cannot initialise | real browser |
| **Hub switch/number/select writes** | hub offline for the first half; not revisited | hub online, deliberate window |
| **Alert config / automation rule writes** | not reached | next pass |
| **Stage rail / probe station writes** | not reached | next pass |
| **Kit Calibrate wizard interaction** | rendered only; anemometer walk not run | with an anemometer |
| **Accessibility** | not attempted | dedicated a11y pass |
| **Hub latency soak** | single sample | full photoperiod |

Every page is now walked. What remains unrun is the physical-hardware work
(cameras, flashing, calibration), the actuator writes that were deliberately not
performed on a live flowering tent, and accessibility.
