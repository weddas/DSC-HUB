# DSC-HUB 8.1.0 — interactive (write-enabled) test pass, 2026-09-08

Companion to `TEST-PASS-8.1.0-2026-09-08.md`, which was **read-only**. This pass
was browser-driven with writes authorised by the operator, against the live rig
(brain 8.1.0 on `192.168.86.48:8787`, fleet 8.1.0.0).

Every row below says **COMPLETED**, **BLOCKED** or **NEEDS RE-RUN**, and why. The
honest gaps are listed as prominently as the passes — several areas of the plan
were not reachable, and one test physically took the rig down.

---

## Headline

The pass found **7 new defects**, one of them Critical, and caused **one
unplanned outage** (the USB webcam test browned out the Pi). It also confirmed
one previously-suspected regression is genuinely fixed.

The single most important result: **the photoperiod anchor cannot be written from
the SPA at all**, on either desk that offers the control, because of a
one-character `object_id` mismatch. On a flowering grow that is the most
consequential setting in the product.

| # | Finding | Severity |
|---|---|---|
| 1 | Photoperiod anchor unwritable — `lights_on_time` vs `lights-on_time` | **Critical** |
| 2 | Root FS on USB SSD — webcam brownout took the whole controller down | High |
| 3 | Overview vs Climate disagree on "Want"; rail chips use a different band than the number shown | High |
| 4 | USB flash wizard: `firmware_dir` empty in the running brain; `bridge` has no `.bin` | High |
| 5 | Settings caches failed fetches forever — false "OLD BRAIN" / "fetch failed" | Medium |
| 6 | Railed sensor values written to history and fed into VPD during a known fault | Medium |
| 7 | Hub stage selector ≠ plant/expected stage; active band follows the plant | Medium |
| — | Hub link flapping (filed, then **corrected** — was the brownout, not the hub) | Medium |

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

## I. A correction on the record

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

## Honest gaps — what this pass did NOT cover

| Area | Why | To run it |
|---|---|---|
| **Cameras, entirely** | the test caused an outage | powered USB hub |
| **USB flash end-to-end** | would reflash a live seat; no adapter attached | bench seat |
| **Hub switch/number/select writes** | hub offline for the first half; not revisited | hub online, deliberate window |
| **Alert config / automation rule writes** | not reached | next pass |
| **Journal create/edit/delete** | not reached (journals showed "Loading journal…" on Light) | next pass |
| **Stage rail / probe station writes** | not reached | next pass |
| **Plants, CannaLib, Logs, Alerts, Kit, Twin pages** | not walked interactively this pass | next pass |
| **Accessibility** | not attempted | dedicated a11y pass |
| **Hub latency soak** | single sample | full photoperiod |

The plan asked for every interactive element on every page. **Overview and
Climate were covered thoroughly; Root and Light partially; Plants, CannaLib,
Logs, Alerts, Kit and Twin were not walked at all.** The outage and the
finding-1 diagnosis consumed the time those would have taken. That is a real
gap, not a rounding error.
