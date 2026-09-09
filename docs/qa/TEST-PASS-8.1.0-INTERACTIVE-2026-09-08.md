# DSC-HUB 8.1.0 — interactive (write-enabled) test pass, 2026-09-08

Companion to `TEST-PASS-8.1.0-2026-09-08.md`, which was **read-only**. This pass
was browser-driven with writes authorised by the operator, against the live rig
(brain 8.1.0 on `192.168.86.48:8787`, fleet 8.1.0.0).

Every row below says **COMPLETED**, **BLOCKED** or **NEEDS RE-RUN**, and why. The
honest gaps are listed as prominently as the passes — several areas of the plan
were not reachable, and one test physically took the rig down.

---

## Headline

The pass found **66 new defects** — ten Critical — verified five
previously-logged entries, reversed one that had been closed wrongly, and caused
**three unplanned outages**. Two were the root-on-USB fragility. The third,
on 2026-09-09, was the SPA flooding the brain with ~17 `/fleet/computed`
requests a second until its accept queue saturated, which in turn **rebooted the
hub**. That chain is §M and is the single most important thing in this document
— including the two wrong root causes I published before reading the server log.

**Withdrawn by the author.** Claims that did not survive checking are retracted
in place rather than deleted; §I and §M each end with a corrections table. Nine
went in §I. Six more went in §M: three published findings, two published root
causes for the outage, and one near-miss caught before filing.

Two patterns account for almost all of them. **Reading a stalled or missing
number as a system fault when it was a sampling fault** — the false "ingestion
has stalled", the backwards clock comparison, the "frozen" hub uptime that
advances in exact 300 s steps. And **reasoning from source code to a cause
without first reading the system's own telemetry** — which produced both wrong
answers for the §M outage.

### The one architectural theme worth fixing first

**Seven** separate defects are the same idea: **stability is treated as
correctness.** Nothing in the stack asks whether a reading is *physically
possible* — only whether it is *settled*.

| Layer | Mechanism | Why it fails |
|---|---|---|
| Firmware | Republishes a failed probe's last Modbus read forever | A frozen value is maximally stable |
| `probe1_sensor_stuck` | Detects "stuck" sensors | Fires on absent data, not frozen data |
| `quality_score` | `100 − variance*10` | The steadier a dead sensor, the better it scores |
| `sensor_clamp` | Range guard, `temp_c.max 50.0` | Sits **exactly on** the sensor's rail value |
| `plausible_vpd_kpa` | Plausibility predicate | Dead code — zero callers |
| `_cfm_from_pct` | Claims `measured_curve` on ≥2 non-zero points | A curve that never moves (14.3 at every duty) is still "measured" |
| `thereabouts_stale` | `updated_at is not None and age > 900` | Never-had-a-reading evaluates to **not stale** |

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

### Energy: RETRACTED — this section was wrong

**The finding originally written here has been withdrawn.** It claimed
`/energy/estimate` returned `ok:false` and that every suggestion's
`delta_vs_current` equalled its own `total_cost`, inverting the advice.

That reproduction was invalid. I called the endpoints **without the `lights_on`
query parameter**, which the SPA always supplies. With no baseline the estimator
correctly returns `ok:false, total_cost 0.0`, and `delta = candidate − 0` is
then trivially the candidate's cost. The bug was in my curl, not the product.

Verified from the browser's own network log on 2026-09-09:

```
GET /energy/suggestions?space_id=4x8&lights_on=06%3A00%3A00&want_hours=12 -> 200

current      cost 1.8336   delta  0.0
max_offpeak  cost 1.1808   delta -0.6528
night_heat   cost 1.3152   delta -0.5184
morning      cost 1.8336   delta  0.0
```

`current` is present, `morning` is correctly zero, and savings are correctly
negative. The rendered card reads `EST. $1.83/DAY · 5.76 KWH · Max off-peak Δ
$-0.65`. The behaviour is right.

The `NO SCHEDULE FOR ESTIMATE` text I first captured was the **first-paint
state** before fleet state loaded, not a steady state. One small real residue was
kept and filed separately: `LightEnergyPanel.tsx:100-107` collapses
`estimate === null` (loading) and `estimate.ok === false` (genuinely no schedule)
into the same amber warn chip, so the card briefly asserts something untrue
during load. Low severity.

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

## M. Fifth sweep, 2026-09-09 — the API surface, and an outage I caused

This sweep worked the routes the browser sweeps never touch, then went back to
the dash as a user. It produced the most important finding of the whole pass, by
causing it.

### The headline: the SPA floods the brain, and that rebooted the hub

**COMPLETED — reproduced, root-caused from the brain's own container log, and
corrected twice along the way.** The corrections are recorded below because two
wrong diagnoses were published before the right one.

**What happened.** Twice during this sweep the brain stopped answering *any*
route from an external client — including `/openapi.json`, which is served from
memory and touches no disk — while TCP connect to 8787 still succeeded in
**0.01 s**, ICMP showed 0 % loss and port 22 was open:

```
/settings/automations   60.0s  no response
/grow-log               60.0s  no response
/health /system/time /settings/alerts   25.0s each
/openapi.json  /  /docs  /health        12.0s each
```

Both times it recovered on its own (~120 s and ~201 s). No restart was performed
— the restart earlier in this pass took the host down with it (§H).

**The hub rebooted.** `uptime` 14704 s → **304 s**, `heartbeat` 497 → 11, and the
hub's own event field records why:

```
last_evt = EVT|H|API_BLIP|301|
```

301 seconds of API outage against the firmware's threshold at
`firmware/v4/dsc-hub-v4_0.yaml:5480`:

```cpp
bool api_problem = (!api_ok && id(api_ever_connected) && down_age >= 300000u) ||
                   (api_ok && hs_age >= 900000u);
return api_problem && id(link_rec_stage) >= 2;
// -> id(link_rec_reason_str) = "safe_reboot_api_wedge";
```

The firmware did exactly what it is documented to do — the file header states the
ladder plainly: *"Bounce ~180s / reboot ~300s need a dead API client."* Something
upstream made the brain look like a dead API client. That is not a theoretical
cost: the same header records the 5 Aug 2026 incident where a recovery reboot
restored Full Auto OFF mid-window and lost **~5.5 h of light**.

### Root cause — from the brain's container log

The operator pulled `docker logs dsc-hub-brain`. It settles it:

```
_=1788937434481   <- normal 5 s poll
_=1788937439481
_=1788937444480
...
_=1788937910042   <- then this
_=1788937910096      54 ms
_=1788937910160      64 ms
_=1788937910216      56 ms
_=1788937910270      54 ms      ... ~90 more inside 5.4 s
```

**Every line is `200 OK`.** No traceback, no `database is locked`, nothing
blocked. The server never stopped serving. A client is issuing
`/fleet/computed` at roughly **17 requests per second** in sustained bursts,
hundreds in a row, over a single keep-alive connection. The cache-buster is
`Date.now()` evaluated at *issue* time, so those spacings are real issue
intervals, not queue timestamps.

The external symptom — every route timing out while TCP connect succeeds
instantly — is uvicorn's accept queue being saturated by the flood. It is not a
blocked handler.

**Confirmed by removing the client.** With every browser closed, ten consecutive
`/health` probes over 50 s: `0.044, 0.016, 0.023, 0.008, 0.016, 0.023, 0.016,
0.016, 0.006, 0.022 s` — ten for ten, zero failures.

### The amplifier — `frontend/src/hooks/useBrain.tsx`

```ts
const computedChain = useRef(Promise.resolve());

const refreshComputed = useCallback(() => {
  const run = async () => { const data = await get_fleet_computed(); ... };
  computedChain.current = computedChain.current.then(run, run);   // queue, never coalesce
  return computedChain.current;
}, []);
```

The chain **serialises but never coalesces or drops**. Three independent
producers feed it with no shared guard:

| Producer | Cadence |
|---|---|
| `ws.onmessage` (`:107`) | every `/ws/fleet` push — `api.py:776` sleeps 2.0 s |
| `computedPoll` (`:128`) | 5 s interval |
| `refresh()` via `onclose` fallback (`:120`) | a second 5 s interval |

So however a backlog arises, it drains **back to back at whatever rate the server
can answer a 299-entity payload** — which is exactly the observed 40–60 ms. One
pending refresh is always sufficient, since each fetch returns the whole current
state.

**Fix:** coalesce. If a refresh is in flight, return the in-flight promise
instead of chaining another.

**Not established:** what creates the backlog in the first place. The hook's
effect cleanup is correct (`ws.close()`, `clearInterval`, `pollRef` cleared) and
its deps are all stable `useCallback`s, so it is not a remount leak. Browser
timer throttling on a backgrounded tab or a sleeping machine, with the
accumulated callbacks firing on resume, would fit — but that is a hypothesis,
not a finding.

### Two published diagnoses that were wrong

Both were stated with more confidence than the evidence carried.

**1. "A blocked ASGI event loop caused by SQLite lock contention."** I reasoned
from the code — `connect()` runs `executescript(SCHEMA)` with no WAL and no
`busy_timeout` — to a cause, without ever looking at the server's own log. The
log shows unbroken `200 OK`. Those SQLite facts are real and are still filed,
but as a **latent** risk, not as the cause of anything observed.

I also under-scoped them, and a parallel finding in the tracker caught it. I
wrote "both `connect()` implementations", naming two files. Re-counted with
exact greps: `executescript` appears at **11 sites across 11 modules** —
cameras, catalog, esphome_jobs, esphome_toolchain, hub_tunables,
journal_storage, schedule_shift, settings, space_model, stage_rail, usb_flash —
each running its own DDL on connect, across **65** `connect()` call sites in 33
modules. A two-file fix would leave nine modules still taking a write lock on
every read.

**2. "My browser tab / my curls wedged it."** The operator is on
**192.168.86.10 — the same IP I was testing from** — and had the dashboard open
throughout. My traffic was indistinguishable from theirs in the log, and was
most likely *competing with* a flood already in progress rather than starting
one. Every "five sequential curls did it" claim is withdrawn.

The lesson is the same one this pass keeps re-learning: **reason from the
system's own telemetry before reasoning from its source.** One `docker logs`
would have skipped both wrong answers.

### Post-reboot state check — COMPLETED

The 5 Aug failure mode did **not** recur:

| Check | After reboot |
|---|---|
| `tent_full_auto_mode` | **on** |
| `auto_photoperiod` | **on** |
| heater / humidifier / dehumidifier / grow-mat auto | all **on** |
| `grow_stage` | Early Flowering (preserved) |
| target temp / min / max | 22.0 / 25.0 / 28.0 (preserved) |
| `light_debt_hours` / `light_delivered_hours` | 6.4658 / 5.5342 (preserved exactly) |
| emergency failsafe / climate sensor fault | False / False |
| temp / RH | 23.2 °C / 61.1 % |

One state change: `manual_light_hold` **on → off**. That is by design —
`restore_value: false`, commented *"Deliberately NOT persisted: after a power
cycle the schedule is authoritative"* — and it self-heals at lights-off, which is
where we were. Flagged to the operator anyway, since it was their setting.

### Reading keys that do not exist — a family, not a one-off

The known Critical (`lights_on_time` vs the hub's `lights-on_time` object_id) is
not isolated. Two more of exactly the same shape, both verified live:

**1. `lights_on` can never be true.** `brain/dsc_brain/api.py:656-668` has five
chances and misses all five:

```python
twin = hub_vals.get("twin_sf1000_on")     # flat key — does not exist
sf   = hub_vals.get("sf1000_on")          # flat key — does not exist
twin_st = (hass.get("light.dsc_hub_twin_sf1000") or {}).get("state")             # None
sf_st   = (hass.get("light.dsc_hub_sf1000_dimmer") or {}).get("state")           # None
win     = (hass.get("binary_sensor.dsc_hub_4x8_window_open") or {}).get("state") # None
```

The hub's 54 flat value keys contain no light state at all. The real data is
nested: `hub.values["controls"]["light.dsc_hub_twin_sf1000"]` and
`hub.values["binaries"]["binary_sensor.dsc_hub_4x8_window_open"]`. And
`to_hass_states()` emits only **18** hub entities — all `sensor.*` plus two link
`binary_sensor`s — so the three `hass` lookups cannot resolve either.

Result: `GET /control/root-steering` returns `act_allowed: false` on all four pots
with `reason: "lights_off"`. Root steering can never actuate in any photoperiod.
And `"lights_off"` is asserted as **fact** when the truth is *no signal*.

The rest of the brain reads these correctly — `computed_ops`, `dash_computed`,
`automation_rules`, `esphome_client` all go through `values["controls"]` /
`values["binaries"]`. `api.py` is the outlier.

**2. The `CLOCK INVALID` chip can never render.** `system_info.py:81` does
`values.get("clock_valid")` on the flat dict. The hub publishes it at
`values["binaries"]["binary_sensor.dsc_hub_clock_valid"]`, currently **False**.
The flat lookup returns `None`, so `/system/time` reports `hub.valid: null`, and
the SPA gates its warning on `d.hub.valid === false`. The firmware is sending the
bad news and the brain is dropping it on a key mismatch.

### The Time card shows nothing wrong while every clock is wrong

`SystemCards.tsx:74-135`. Live state: brain clock **420.8 s slow** (measured
against Cloudflare's `trace` timestamp — Windows +4.1 s, Pi −420.8 s), hub
`raw: "unsynced"`, `ntp.synced: null`. The card renders **no warning of any
kind**:

- `driftTone` derives only from `d.hub.drift_s`; with no hub epoch that is
  `null`, so the tone is `undefined` — no `state="failed"`, no chip
- the `CLOCK INVALID` chip needs `hub.valid === false`, and it is `null` (above)
- the Brain clock row is a plain `<Stated>` with no validation at all

The one carrier of the bad news is the untoned prose *"hub clock not synced yet"*.

Worse, drift is computed as `hub_epoch − brain_ref` (`system_info.py:103`) — the
Pi is the assumed truth. So the moment the hub **does** sync correctly, drift
reads ≈ +420 s, `driftTone` becomes `bad`, and the card prints *"drift 420 s —
check the hub's NTP reach"*, sending the operator to fix a device that is right.

And NTP health is **structurally unknowable**: `_ntp_status()` shells out to
`timedatectl`, which does not exist inside the brain container. The module
docstring frames the missing-binary branch as the exception; on the real topology
it is the only branch that ever runs. The single surface that would have caught
the 7-minute host clock error is permanently blind.

### A flat calibration still counts as `measured_curve` — CRITICAL

`computed_ops.py:191-211`. The only gate on claiming `honesty: "measured_curve"`:

```python
measured = [v for _, v in points if v > 0]
if len(measured) < 2:
    return round(pct / 100.0 * nameplate, 1), "linear", "capacity_proxy_nameplate"
```

Two non-zero numbers. Nothing checks they **vary** with duty, are monotonic, or
are plausible against the nameplate. The live calibration data:

```
dsc_cal_cfm_out           25/50/75/100%  ->  14.3, 14.3, 14.3, 14.3   (identical)
dsc_cal_cfm_intake_main   25/50/75/100%  ->   6.8,  6.9,  6.8,  6.8   (flat)
dsc_cal_cfm_intake_clone  25/50/75/100%  ->   5.0,  7.5,  8.0,  9.0   (real)
```

Nameplates are 440 and 200 CFM. Both flat sets pass the gate, interpolate to a
horizontal line, and are stamped `measured_curve`. `cfm_curves_status` even
reports **"3/4 curves"**, counting them as good.

The consequence is the alarm on the Climate desk:

| Sensor | Value | Honesty |
|---|---|---|
| `cfm_intake_main` | 3.3 | `measured_curve` |
| `cfm_intake_2x4` | 5.5 | `measured_curve` |
| `cfm_exhaust_out` | 8.6 | `measured_curve` |
| `cfm_exhaust_recirc` | **198.0** | `capacity_proxy_nameplate` |
| `cfm_intake_capacity_total` | 6.7 | |
| `cfm_exhaust_capacity_total` | 206.6 | |
| `flow_net_pressure_cfm` | **−199.9** | |

The only fan that reads plausibly is the one whose calibration has **fewer than
two points** and therefore honestly falls back to nameplate. **The system is more
wrong for having been calibrated.** This is the fifth instance of the standing
theme, in its purest form: a curve that does not move is still called *measured*.

### USB flash — the 8.0.0 zero-byte class is still open

**COMPLETED as far as the topology allows** (no adapter attached; nothing flashed).

`usb_flash.py:208` — the entire pre-flash validation:

```python
if not binary.is_file():
```

No `st_size` check, no ESP image magic-byte (`0xE9`) check, no hash. A zero-byte
`.bin` passes. 8.0.0 shipped **nine** zero-byte kit binaries, so that input is
known to occur. The Setup page's own copy promises *"One device at a time. Never
green on fail."*

`GET /settings/usb-flash/manifest` returns nine roles with only
`{binary, chip, boot_mode_note}` — it never stats the files it names, so the
operator cannot see a bad payload before committing.

Two further live proofs the feature cannot work here at all:

- `firmware_dir` reports `/app/services/dsc-hub/firmware/kit` — the **fallback**
  branch, which only returns when `/opt/dsc-hub/firmware/kit` is not a directory.
  Worse, that fallback calls `mkdir(parents=True, exist_ok=True)`: a getter with a
  filesystem side effect, silently creating the empty directory it then reports as
  authoritative.
- `GET /settings/usb-flash/ports` returns `[]`. No `/dev` passthrough into the
  container.

And a safety gap the empty port list is currently masking: `list_serial_ports()`
enumerates everything under `/dev/serial/by-id` with no filtering, and
`queue_usb_flash()` validates the port only as *non-empty*. The Pi's
`/dev/ttyUSB0` is the **SkyConnect Zigbee coordinator** — the one device the
project's hard safety rules say must never be flashed. Fixing the passthrough
arms this.

### Setup state — a live grow believes it is uncommissioned

`GET /setup/state` on a rig with 2,024,502 history rows, an online fleet and a
running flower cycle:

```json
{"commissioned": false, "phase": "usb_flash", "version": "8.1.0", "surface": "8.1.0"}
```

`kit_commissioned` only ever flips via `POST /setup/commission`, and this kit
predates the wizard. `SetupPage.tsx:148` gates **only** on `state.commissioned`,
so `#/setup` does not say "already commissioned" — it drops the operator into
step 2 of 6, **the USB flash step**, on a live 4-seat fleet in flower.

Two smaller finds in the same file: the header subtitle is the string literal
`"DSC-HUB 8.0"` while `state.version` is right there reading `8.1.0`; and
`postSetupCommission(false)` is the only call site, the API body defaults to
`false`, and the helper defaults to `false` — so `require_hub_online` is dead code
and the hub-online go-live gate can never fire.

### Probe stations — a green badge for a device that has never reported

`GET /settings/probe-stations`, verified against `/fleet`:

| Field | pot4 station | Truth |
|---|---|---|
| `online` | **true** | `/fleet` pot4 `online: false`, `last_seen: null` |
| `seat_online` | false | correct |

`soil_tests.py:147` assigns the top-level `online` from `home_trust` — the *idle
home* pot's online — then duplicates it verbatim as `home_online` on the next
line. Both SPA consumers render the top-level field as a **device** badge:
`DevicesSettingsPage.tsx:540` prints `{st.seat_id} ONLINE`. So Devices › Probe
stations currently shows a green **"pot4 ONLINE"** for a probe that has never
reported.

And `soil_tests.py:133`:

```python
thereabouts_stale = bool(
    thereabouts_updated_at is not None
    and (time.time() - float(thereabouts_updated_at)) > 900
)
```

When the home is untrustworthy the code deliberately leaves `thereabouts = {}`
and `updated_at = None` — and this evaluates to `False`, i.e. **not stale**. The
comment directly above it (*"Independent of home_trustworthy: even a trustworthy
home can go quiet"*) shows the author reasoned about the trustworthy-but-quiet
case and missed the never-had-data case. That missed case is the live one on both
stations. `RootPage` keys its `READING STALE` tag off this flag, so the tag can
never appear for the worst state.

Two consumer-side follow-ons: `SoilTestWizard.tsx:295` guards with
`{selectedStation?.thereabouts ? … }` — `{}` is truthy, so a labelled **empty**
readings table renders today; and `DevicesSettingsPage.tsx:536` reads
`st.thereabouts?.moisture_pct` with none of the `home_trustworthy` guarding that
`RootPage.tsx:241` applies to the same field.

### Smaller finds from the same sweep

| Finding | Evidence |
|---|---|
| `fleet_version_status` permanently `warn` | `dash_computed.py:110` defaults `expected_firmware` to `"7.0.0.0"`; hub reports `8.1.0.0`; also 3-part vs 4-part, so it can never match |
| `reduced_kit` attribute inverted | state `off` (nothing offline) while its `offline` attribute reads `"a live lever is parked"` — the empty and non-empty strings look swapped (`dash_computed.py:103-106`) |
| `probe1_dryback_pct` = string `"nan"` | still stamped `honesty: "peak_today_to_now"`; the same payload gets it right elsewhere — `coldest_root_zone_temp` uses `unavailable` + `reason` |
| Hub `target_temp` outside its own band | main 22.0 against min 25.0 / max 28.0; clone 22.0 against min 24.0 / max 27.0; nothing validates target ∈ [min, max] |
| Photoperiod shown is local intent, not device truth | `time.dsc_hub_lights_on_time = "06:00:00"` comes from the brain's own helper (`light_loop.py:252`), stamped `honesty: "ok"`, while the write that would push it to the hub fails on the object_id mismatch — and the hub publishes nothing to reconcile against |
| `datetime` lights-on helper stuck on a date | holds `"2026-08-29"`; `_normalize_clock_time` correctly rejects it and its docstring shows the author knew — but the rejection is silent. Latent only: the `time.*` entity resolves first |

### Corrections — six of my own claims withdrawn this sweep

Recorded as prominently as the finds. Two of these were the outage's root cause,
and both were published before I read the server's own log.

| Claim | Why it was wrong |
|---|---|
| "Energy suggestions invert the advice" | **My curl omitted `lights_on`**, which the SPA always sends. With it: `max_offpeak delta −0.6528`. Correct. §L retracted in place |
| "4×8 shows 0.0 light hours with `honesty: ok`" | Correct behaviour. It was 03:00, the window is 06:00–18:00, the last cycle ended 16:48 **yesterday**. I read a since-midnight counter as a rolling one |
| "The photoperiod read path is blank" | `time.dsc_hub_lights_on_time = 06:00:00` does exist in computed state. Rewritten into the sharper true finding above |
| "A blocked ASGI loop from SQLite lock contention" | The brain's container log shows unbroken `200 OK` — nothing was blocked. The SQLite facts are real but latent; refiled as such |
| "My browser tab / my curls wedged it" | The operator browses from **192.168.86.10 — the same IP as this rig** — and had the dashboard open throughout. My traffic was competing with a flood, not causing it |

A sixth was caught before filing: hub `uptime` looked frozen across a 180 s
sample, but it advances in exact **300 s** steps — a 5-minute publish interval. It
was the third stall-shaped artefact of this pass, after the false "ingestion has
stalled" (§I) and the false "Windows clock is fast" (§I). The pattern is now
explicit: **on this rig, "it stopped moving" is far more often my sampling than
the system.**

---

## N. Sixth sweep, 2026-09-09 — areas 2 and 5 closed out

The operator asked for the two partial areas finished in full so a fix agent
could be started. Both are now **COMPLETED**.

### N.1 Area 2 — write-then-undo, the four outstanding targets

The brief listed eight write/undo targets. Four were done in §B (setpoints,
global modifiers, journal entries, root steering). These are the other four.

**Every one was restored and verified byte-identical to a baseline captured
before the first write.** Baselines were taken off-box (`/tmp` on the Pi is
tmpfs and does not survive a reboot).

| Target | Result | Restore |
|---|---|---|
| Automation rules | **COMPLETED** — write/undo + 8-case validation matrix | `PUT {"rules":[]}` → byte-identical |
| Alert config | **COMPLETED** — 5-case validation matrix + quiet-hours round trip | `clear_quiet_hours` → byte-identical |
| Stage rail | **COMPLETED** — write/undo + 9-case validation matrix | `POST /reset?stage=…` → byte-identical |
| Probe stations | **COMPLETED** — write/undo + 4-case validation matrix | PATCH back → inventory `extra` byte-identical |

#### Automation rules

Baseline `{"rules":[]}`. The test rule was made safe two ways over: `enabled`
defaults to **False** (`_normalize_rule:505`) and `raw_true = rule["enabled"] and
…` (`:1036`), so a disabled rule can never fire; and the action was `banner`,
which has no actuator path at all.

Validation behaved correctly in 7 of 8 cases — duplicate id, invalid action type,
banner without text, `entity_id` without a dot, `all` and `any` together, `rules`
not a list (422), and `window.start == window.end` all rejected with useful
messages.

**The eighth is a defect.** `id: "BadID"` returned **200** and stored `badid`:

```python
rid = str(row.get("id") or "").strip().lower()   # lowercased FIRST
if not _RULE_ID_RE.match(rid):                    # regex never sees uppercase
    raise ValueError(f"invalid rule id {rid!r} — slug, lowercase, 2–48 chars")
```

The message promises lowercase is enforced; it is silently coerced. Breaks
round-trip fidelity, and `MyRule` + `myrule` in one PUT collide on an id the
caller never sent.

#### Alert config

All five validation cases correct, including the one that matters:
`the emergency failsafe alert cannot be disabled` → 400.

`quiet_hours` set → read back → `clear_quiet_hours` → byte-identical. The window
chosen (12:00–13:00) was already in the past at 17:24 local, so it could have no
effect even while set.

**`alerts` was deliberately left untouched**, because `patch_alert_prefs` merges
and has **no removal path** — no delete verb, no null-means-remove, no full-map
PUT. Anything written there is permanent. `quiet_hours` has a proper clear path,
which shows the omission is an inconsistency rather than a decision. Filed rather
than demonstrated: creating unremovable state on a live rig to prove a point is
not a trade worth making.

#### Stage rail

`PATCH` Germination `temp 25.0 → 26.5` → `changed: true`, `updated_at` stamped.
Validation correct for unknown stage, unknown field, out-of-bounds, and
non-numeric.

The first attempts at the cross-field guards did not actually exercise them —
`vpd_min: 1.9` and `rh_min: 95` are caught by the *bounds* check first. Re-run
with in-bounds violations, and the guards do fire:

```
vpd_min 0.9 vs existing vpd_max 0.8   → 400  "VPD min must not exceed VPD max"
rh_min 85   vs existing rh_max 80     → 400  "RH min must not exceed RH max"
vpd_min 0.9 + vpd_max 1.1 together    → 200  (self-consistent, correctly allowed)
```

Note the guard correctly merges the patch over the *current stored row*, not over
defaults.

**`POST /settings/stage-rail/apply` was deliberately NOT called.** It runs
`apply_stage_targets()`, which stamps the preset onto the hub as live setpoints.
That is an actuator write on a day-61 flowering tent and is the operator's call,
not a test step. The write/undo target in the brief is the stage-rail *store*,
which is fully covered.

#### Probe stations

`PATCH pot2 {idle_home_pot_id: pot1→pot3, tent: 2x4→4x8}` → 200, persisted.

**This produced live proof of the §M static finding.** Repointing the idle home
flipped the station's `online` from **true → false** — because that field is the
*home* pot's online, and pot3 is offline. Nothing about pot2 changed; it stayed
online and reporting throughout. Setting `idle_home_pot_id: pot2` (itself) then
flipped it back to true. The SPA renders this as a per-device badge
(`{st.seat_id} ONLINE`), so repointing one station changes the health badge shown
against a different, healthy device.

Three validation gaps, all returning **200**:

| Input | Stored | Should be |
|---|---|---|
| `tent: "the moon"` | verbatim | rejected — no allow-list against zone/space ids |
| `idle_home_pot_id: "pot99"` | verbatim | rejected — no existence check |
| `idle_home_pot_id: "pot2"` on seat pot2 | verbatim | rejected — a roving probe cannot idle at itself |

Only `unknown seat` (404) is checked. Self-home also collapses the `home_*` and
`seat_*` field families onto one device, defeating the distinction they exist to
draw.

### N.2 Area 5 — USB flash wizard, end to end

**COMPLETED as far as the topology permits.** Nothing was flashed; no device was
touched. That is not a gap in the test — §M established the feature cannot
complete a flash on this deployment, and this sweep proved it from the running
system rather than from the source.

**The job path was run end to end.** Safe by construction: `_run_job` checks
`binary.is_file()` *before* building the esptool command, and `firmware_dir` is
empty, so esptool is never invoked. Ports used were deliberately fake
(`/dev/ttyQA0`, `/dev/ttyQA-NONEXISTENT`) — never `/dev/ttyUSB0`, which is the
SkyConnect Zigbee coordinator.

```
POST /settings/usb-flash/jobs {"role":"hub","port":"/dev/ttyQA0"}   → 200 queued
GET  /settings/usb-flash/jobs/<id>
  status = failed
  detail = Missing firmware binary for hub:
           /app/services/dsc-hub/firmware/kit/hub.bin. Bake kit binaries into the image.
```

That is **correct and honest behaviour** — it fails, names the exact path, and
never reaches the flasher. "Never green on fail" is honoured for this case. It
also confirms live what §M inferred: the container resolves `firmware_dir` to the
fallback path, and that directory is empty.

**Validation** — unknown role (400, listing all nine valid roles), empty port
(400 `port is required`), missing `role` field (422), unknown job id (404). All
correct.

**Concurrency guard** — three jobs fired in parallel:

```
job1 http=200   job2 http=409   job3 http=409
{"detail":"usb flash job already in progress: e29c0600-…"}
```

Exactly one admitted, the other two rejected naming the running job. Correct.

**The wizard UI**, read from the live rig at `#/setup`:

```
Kit Setup
DSC-HUB 8.0 · step 2/5: usb_flash
USB FLASH — One device at a time. Never green on fail.
Role [hub ▾ …9 roles]   Port [— select — ▾]
[Flash]  [Skip (record debt)]  [Next: Fleet join]
```

Three things confirmed visually that §M had only from the API: the hardcoded
`DSC-HUB 8.0` against a `state.version` of `8.1.0`; a live production grow landing
directly on the **USB flash step**; and an empty port list.

One new defect: **the `Flash` button is enabled with no port selected** —
`disabled: false`, port `value: ""`, one option (the placeholder). The brain
rejects the click correctly (400), so it is not dangerous, but it is a false
affordance on a page whose own copy promises never to look ready when it is not.

**Two permanent rows left behind.** `usb_flash_jobs` has GET-list, GET-by-id and
POST — no delete verb, no retention, no prune. So the two failed test jobs
(`hub` / `/dev/ttyQA0` and `pot1` / `/dev/ttyQA-NONEXISTENT`, both "Missing
firmware binary") cannot be removed through the API. Disclosed rather than hidden;
filed as its own Low finding.

### N.3 Found while testing: the 4×8 has been dark for 18.8 h

Not part of areas 2 or 5, but found during them and grow-affecting, so it is
recorded here.

`/history` (independent of the frozen ledger) over 24 h:

```
Tue 08 Sep 17:26:49   4x8 window OPEN    · Twin SF1000 ON
Tue 08 Sep 22:38:49   4x8 window CLOSE   · Twin SF1000 OFF
                      … no further transitions
```

At 17:26 Wed — inside the 06:00–18:00 window — both `4x8_window_open` and the
Twin SF1000 read **off**, and have since 22:38 Tuesday. Day 61, Early Flowering,
two plants.

This is the known Critical still live and unfixed:

```
hub_clock_epoch = 'unsynced'   clock_valid = False   learning_paused = True
```

`clock_valid` false → `tick_lateral_ledgers` aborts
(`firmware/v4/dsc-hub-fleet-heal.yaml:552`) → the window never opens. The ledger
is frozen with it: `light_delivered_hours` reads **5.5341668128967285**,
byte-identical to a sample taken ~15 h earlier. That 5.53 is Tuesday's
17:26→22:38 run, not today's — so the dashboard's `−6.47 h` deviation understates
the shortfall by roughly a full day.

The Pi clock was re-measured against Cloudflare in the same session: still
**−420.8 s**, unchanged. The numeric-NTP workaround in the DNS entry remains the
fix and remains the operator's call — it is a host config change on a live grow.

---

## O. Seventh sweep, 2026-09-09 — the remaining areas

The operator lifted the actuator restriction ("I don't care about actuators or
live grows, I need these tests to run") and supplied an IP camera. This sweep
closes what was left.

**Every write in this sweep was restored and verified against a baseline.** Final
state check at the end of the sweep:

```
settings/automations       IDENTICAL
settings/alerts            IDENTICAL
settings/stage-rail        IDENTICAL
settings/probe-stations    IDENTICAL
hub-tunables (47 rows)     IDENTICAL
cameras                    DIFFERS  ← deliberate, see O.1
```

### O.1 Cameras — COMPLETED (API), STAGED (real device)

The USB webcam remains off-limits (it browned out the Pi, §H). But the whole
camera pipeline was exercised through the API with a synthetic camera, then a
real IP camera was staged.

Full create → validate → capture → media → storage → delete cycle:

| Step | Result |
|---|---|
| `POST /cameras/test` on an unreachable URL | `{"ok":false,"error":"camera did not answer within 20 s"}` — honest |
| `PUT /cameras/qa_test_cam` | 200, full row returned, `password_set:false` |
| invalid `source_kind` | 400 — lists the five valid kinds |
| unknown `space_id` | 400 `unknown zone atlantis` |
| `interval_s: -5` | 400 `must be between 30 and 86400` |
| `keep_days: -1` | 400 `must be between 0 and 3650` |
| `POST .../capture` | `ok:false`, same honest timeout error |
| `GET .../latest.jpg` | 404 |
| `GET .../days`, `/frames`, `/timelapses` | 200, all empty |
| `GET /cameras/storage` | correct zero-byte accounting |
| `DELETE` + verify | `{"deleted":true}`, `GET /cameras` byte-identical to baseline |

**Camera validation is the best on the brain** — a marked contrast with
`patch_probe_station`, which validates nothing (§N.1).

One defect: `DELETE /cameras/never_existed` returns **200 `{"deleted": false}`**
where the neighbouring routes 404 (`latest.jpg`, `usb-flash/jobs/{id}`).

**The real camera.** `192.168.86.200` is a **TP-Link** unit: ports 554 and 443
only, 80/8080 refused. RTSP `OPTIONS` returns `200 OK`; every `DESCRIBE` returns
`401 Unauthorized · WWW-Authenticate: Basic realm="TP-Link IP-Camera"`, so the
stream path cannot be discovered without credentials. `ffmpeg: true` in the
container, so capture will work once authenticated.

A camera row is staged and waiting, deliberately left in place (this is the one
intentional deviation from baseline):

```
tent_4x8_cam · space 4x8 · rtsp://192.168.86.200:554/stream1
username set · password_set: false · enabled: false
interval 900 s · keep 14 d · cap 2 GB · lights_on_only
```

Entering the password is the operator's step, not mine. Once set, enable the row
and the remaining camera tests (real capture, MJPEG, retention prune, timelapse
assembly, zone thumbnail) run on the live device.

### O.2 Hub writes — COMPLETED, and the operator's clash concern measured

First attempted through `/control/service`. The operator's correction was right:
*"don't control the hub directly, it must be controlled via the brain, or the
test means nothing"* — that route is a thin passthrough and tests the transport,
not the product. Re-run through the brain-owned `/settings/hub-tunables` surface.

**The two surfaces behave very differently, and the difference is the finding.**

`/control/service` returns the value you asked for, immediately:

```
POST → {"entity_id":"number.dsc_hub_ladder_wait_mat","state":"90.0"}   [200]
GET  /fleet  → still 60.0   … for 30–40 s
```

`/settings/hub-tunables` tells the truth:

```
PATCH → desired=90  hub=60  state=pending   source=operator
t+70s → desired=90  hub=90  state=synced
```

Measured round trips: **70 s** on one write, **50 s** on another, **40 s** on the
restore. That is the window the operator was pointing at.

**The clash test.** With the brain at `desired=90` and the hub confirmed at 90,
a competing value (120) was written straight to the device. The brain detected it
correctly — `desired=90 · hub=120 · state="differs"`. Good.

But for roughly **90 seconds in between**, every one of the 47 tunable rows read
`hub=None · state="missing"` while `hub_online` stayed `True`. The code's own
comment says what `missing` is meant to mean:

```python
present = eid in controls
state = _state_for(...)
if not present and online:
    state = "missing"   # the running firmware has no such entity
```

The condition only tests membership of the *current snapshot*. A poll gap is
therefore reported to the operator as "your firmware does not have this control"
— pointing at a reflash when the truth is a dropped frame. The `and online`
guard makes it worse: it fires precisely when the hub is up but the snapshot is
briefly thin.

Writes verified through the full cycle on a switch, a number and a select. All
restored; `/adopt` used to return `source` to `adopted` so the 47-row comparison
came back clean.

**Pre-existing drift found by the same test** — in the baseline, before any write,
and unchanged after all restores. Five tunables disagree between brain and hub
with no banner, chip or alert anywhere:

| Tunable | brain desires | hub runs |
|---|---|---|
| `control_strategy` | **VPD** | **Humidity** |
| `rh_target_min` | 50 | 40 |
| `rh_target_max` | 60 | 55 |
| `vpd_target_max` | 1.3 | 1.4 |
| `priority_tent` | 2x4 Clone | 4x8 Main |

`control_strategy` is the one that matters: the brain believes the tent is driven
on VPD while the hub is actually driving on Humidity, which selects a different
appliance ladder. All five are `source: adopted`, so they read as values the
brain took from the hub once and then drifted from — not operator intent.

### O.3 Calibration store — COMPLETED

`/settings/calibration/{device_id}` is a **second, separate** calibration store
from the CFM helpers in §M (`input_number.dsc_cal_cfm_*` live in the compose
helper store). This one is **empty for every device** — hub, pot1, pot2 all
return `{"calibrations": []}`, consistent with the Light page's "No calibration
yet — PPFD shows as —".

Write tests were run against a deliberately fake `qa_test_device` so no real
device's calibration was polluted. Upsert works (`ON CONFLICT … DO UPDATE`:
step 25 rewritten 42.5 → 55.0, step 50 untouched), `cal_type` is validated
(`400 unsupported cal_type telepathy`), non-numeric values are rejected (422),
and the `?cal_type=` filter works.

`/soft-cal/sessions` validation correct on all three cases (`probe_n` 0, `probe_n`
9, missing `phase` → 400). The session list is empty.

Two rows remain under `qa_test_device` — there is no DELETE for calibration
either, same as `usb_flash_jobs` (§N.2).

### O.4 Accessibility — COMPLETED, and mostly good

First a11y pass of this test pass, measured on `#/climate` and `#/alerts`.

**What is correct**, recorded so a fix agent does not churn it: all 62 buttons
have accessible names; all 21 form controls are labelled; no image missing `alt`;
exactly one `h1` per page; `lang="en"`; no positive `tabindex`; no buttons
removed from the tab order; **and focus indication is properly implemented** via
25 `:focus-visible` rules — verified with real `Tab` keypresses, giving
`outline: solid 2px rgb(38,198,218)` at `2px` offset.

**Contrast passes.** All 297 text nodes on `#/climate` meet WCAG AA with correct
alpha compositing — zero failures.

Two genuine gaps:

1. **No `aria-live` regions at all** — `aria-live`, `role=status`, `role=alert`,
   `role=log`, `aria-atomic` are all **0** on both desks. This is a live
   monitoring product whose values change every few seconds over a WebSocket, and
   whose Alerts desk exists to raise things the operator must act on. None of it
   is announced. A screen-reader user must re-navigate to discover that anything
   happened, which defeats the Alerts desk entirely.
2. **No `<main>` landmark** (0 on both desks, against 3 `nav` and 2 `header`) and
   **no skip link** — so keyboard and screen-reader users tab the full 11-item
   desk nav on every page load. `#/climate` also jumps `h1 → h3`.

### O.5 Twin — assets COMPLETED, rendering still blocked

Rendering cannot be verified here: the Browser pane fires no rAF, so three.js
never initialises. That is an environment limit, unchanged.

Everything else about the twin was closed by auditing the served assets. **All
134 GLBs** in `frontend/public/models` were fetched from the Pi and checked for
the `glTF` magic number — **134/134 correct**. `/models/manifest.json` returns
`application/json`, 75,266 bytes, `version 2`, generated `2026-09-07`. The model
pipeline is fully deployed and healthy.

The audit did surface a defect: **a missing asset returns 200 with the SPA's
`index.html`.**

```
GET /models/definitely-not-a-real-model.glb
→ 200 · text/html · 729 bytes · "<!DOCTYPE html>"
```

The SPA catch-all `GET /{full_path}` answers asset paths too, so `GLTFLoader`
asking for a model that is not there gets a successful HTML body and dies inside
the parser with `Unexpected token '<'` rather than reporting a clean 404. The
same applies to any renamed or mistyped asset.

---

### O.6 Latency soak — COMPLETED (bounded)

A full-photoperiod soak is not runnable inside a session, so a bounded one was
run instead: 30 samples of `/fleet` over 5 minutes with **no SPA client
connected**.

```
samples 30   failures 0
/fleet   min 37   med 84   p95 108   max 111 ms
/health  min 12   med 23   p95  29   max 125 ms   (n=20)
hub heartbeat  107 -> 118  = 11 beats / 300 s  (~27 s cadence)
```

Zero failures, a tight distribution, and the hub heartbeat advancing steadily
throughout. This is the clean-baseline counterpart to §M: the same brain that
stops answering entirely under an SPA request flood is completely stable at
p95 108 ms when nothing is flooding it. The two measurements together are the
argument for the `refreshComputed` coalescing fix — the server is not slow, it
is being buried.

---

## Honest gaps — what this pass did NOT cover

| Area | Why | To run it |
|---|---|---|
| **Cameras** | **CLOSED in §O** — full API cycle (create/validate/capture/media/storage/delete) run and restored; a real TP-Link IP camera is staged at `tent_4x8_cam` awaiting its password | operator enters the camera password, then enable the row |
| **USB flash end-to-end** | **CLOSED in §N** — job path, validation and concurrency guard all run against the live brain; an actual flash still needs a bench seat, an adapter, and the container fixes from §M | bench seat |
| **Twin 3D rendering** | **PARTLY CLOSED in §O** — all 134 GLBs + manifest verified served correctly from the Pi; rendering still unverifiable because the Browser pane fires no rAF | real browser |
| **Hub switch/number/select writes** | **CLOSED in §O** — switch, number and select each written through the brain-owned hub-tunables path and restored; brain→hub round trip measured at 50–70 s | — |
| **Alert config / automation rule writes** | **CLOSED in §N** — both write/undo tested and restored byte-identical | — |
| **Stage rail / probe station writes** | **CLOSED in §N** — both write/undo tested and restored byte-identical. `stage-rail/apply` deliberately not called: it stamps live setpoints onto a flowering tent | operator-chosen window for `/apply` |
| **Kit Calibrate wizard interaction** | **PARTLY CLOSED in §O** — the calibration store and soft-cal session API fully write-tested and validated; the physical anemometer walk still needs hardware | with an anemometer |
| **Accessibility** | **CLOSED in §O** — full audit on two desks. Contrast, labels, focus-visible, tabindex and headings all pass; two real gaps found (no aria-live anywhere, no `<main>`/skip link) | — |
| **Hub latency soak** | **CLOSED in §O.6** — bounded 5-minute soak: 30 samples, 0 failures, `/fleet` p95 108 ms, heartbeat steady. A full-photoperiod soak remains a longer-horizon exercise | full photoperiod |

Every page is now walked, and §M walked the API surface behind them —
`/setup/*`, `/soft-cal/sessions`, `/energy/*`, `/settings/usb-flash/*`,
`/settings/probe-stations`, `/settings/stage-rail`, `/system/*`,
`/fleet/computed` (299 entities) and `/cameras`.

What remains unrun is the physical-hardware work (cameras, flashing, an
anemometer walk), the actuator writes deliberately not performed on a live
flowering tent, and accessibility.

**One caveat on how the remaining work should be done.** §M showed that an open
SPA session can flood the brain until its accept queue saturates, and that this
is enough to reboot the hub. Until `refreshComputed` coalesces, further
interactive testing should keep browser sessions short and closed between runs,
and should prefer direct API calls. Note also that the operator browses from the
**same IP** as this test rig, so a second dashboard may be open during any test —
check with them before attributing load. That is a constraint on the *method*,
not a reason to skip the work.
