# DSC-HUB v2.4 — Notes & Comments

Design rationale, judgement calls, and an honest list of what is **still broken**.
Written to the six-month standard: if it won't make sense in six months, it isn't
finished. `changelog.md` is *what* changed; this is *why*, and *what's left*.

---

## §1 · The decision that drove everything else

**Topology Option A: the SF1000 is the 2×4's light. The 4×8 has no lamp.**

Everything in this release is downstream of that. The thing worth remembering is
*why it was so invasive*: the old system had one light and two tents, and every
piece of light logic quietly assumed the light and the main tent were the same
place. Moving the lamp didn't break the code — it broke the **meaning** of the
code, which is much harder to see. Code that still compiles and still runs, but is
now lying about the world, is the most expensive kind of bug to carry.

The 4×8 keeps a photoperiod as a **virtual window**: a schedule driving no output.
It still matters, three ways:

1. Follow-4×8 clones resolve against it
2. The counter-cycle thermal logic runs off it
3. The OLED countdowns read from it

GPIO5 is reserved for a future 4×8 light. When one lands, the virtual window stays
correct and a real on-time sensor joins it — **and then any gap between the two is
a fault**, which is a genuinely useful thing to be able to detect.

### The rule the dashboard now enforces

> **4×8 light = INTENT. 2×4 light = PHOTONS.**

Every card is labelled so you never have to remember which is which. The
counter-cycle ribbons are drawn as deliberately *different shapes* — square wave
vs trapezoid — because drawing them identically would imply a symmetry that no
longer exists.

### Why Option A and not "just move the config value"

The clone tent is the counter-cycle **reservoir** — warm, humid, feeding the 4×8
during its dark period. Putting the light there makes the reservoir *literally
warmer* (the SF1000's waste heat is generated in the donor tent), which the
daisy-chain then has something real to donate. The topology isn't a constraint
we worked around; it's load-bearing.

---

## §2 · ✅ RESOLVED — the 0–10 V floor and the light leak

> **Referenced from:** `dsc-v24-light-helpers.yaml`, dashboard Lighting page

**This closes a long-running item. Both halves of the old caveat are now wrong.**

The LM358's **0.2 V residual floor** sat above the SF1000 driver's off-threshold,
so "off" wasn't off. The v3 dashboard said: *"trust true darkness only after the
GPIO5 hard-off relay lands (v2.4)."*

What actually happened:

- **The 1 kΩ pull-down works.** 0–10 V line to GND. The floor is gone.
- **The GPIO5 relay was cancelled.** Not needed. GPIO5 is reserved for a future
  4×8 light instead.
- **`zero_means_zero`** guarantees the ramp floor never leaks into the off state:
  brightness 0–100% remaps onto floor–100% duty, but **0 stays a true 0% duty**.

**Why this matters beyond the fix:** that stale caveat would have had you
distrusting a dark period that is genuinely dark, *while waiting on hardware that
is never coming*. Stale warnings are their own class of bug — they cost you
confidence in a system that's working.

### The remaining honest caveat

The dark-period alarm watches **commanded** state — the hub knows what it asked
the driver for. It cannot see:

- a physical light leak through the intake path (the **room utility light** is the
  realistic culprit — not in either tent, but in the room the 2×4 draws from)
- a driver that ignores the command

A PAR/lux sensor in the 2×4 during dark would close that last gap. Not needed for
Alpha; worth it before anything expensive flowers in there.

---

## §3 · The grow mat closed loop — why POT1 only

v2.4's headline mechanism change: the mat tracks **root-zone temperature** (POT1's
soil probe), band 20–24 °C, instead of heating air to a plate setpoint.

**The problem it fixed:** a 22 °C plate setpoint was leaving the soil at
**16–19 °C**. Air-temp control was measuring the wrong thing entirely.

### Why a single pot and not `min()` across all four

Tempting, and wrong for Alpha. **POT3's probe reads 0.0%** — a faulted sensor
would win every `min()` and peg the mat on forever. A faulted probe must never
become the control input.

Same reasoning excludes POT3 from the narrator's driest-pot calculation. *A known
fault doesn't get to cry wolf, and it doesn't get a vote.* Revisit when POT3 is
healthy (§8).

### The fallback chain

```
POT1 root-zone probe  →  clone air temp (v2.3 behaviour)  →  OFF
```

Falling back is **safe but degraded** — exactly the behaviour v2.4 existed to
replace. That's why `binary_sensor.dsc_hub_root_zone_sensor_fault` exists and why
its alert reads as a *regression notice*, not an emergency: 10-min persistence, no
repeat, no siren. Most common cause of a stale probe: **HA restarted** — the path
is pot → HA → hub, so it goes stale on every restart and recovers on its own.

### Band width

The **gap between Low and High IS the hysteresis.** Keep it ≥2 °C. Soil is a slow
thermal mass — a narrow band makes the mat chase its own lag. The min-off timer is
the second layer. The mat's own plate thermostat still bounds the surface
underneath all of it.

---

## §4 · ⚠️ STILL OPEN — recorder retention will eat your grow log

> **Referenced from:** dashboard Trends page

**Status: delivered, possibly not installed. Verify before assuming.**

The Dashboard-v3 Phase 0 package shipped a `configuration.yaml` snippet with
`recorder: 120 d` — but that plan is marked *"BUILT & DELIVERED — direct cutover
pending install"*, and the v2.4 checklist still has the retention item unchecked.
So it may be sitting in a file you never applied.

**Check first:**
```bash
grep purge_keep_days /config/configuration.yaml
```
If it's there at 120, this is closed and the checkbox is stale. If not:

### Option A — raise retention (simple)

```yaml
recorder:
  purge_keep_days: 120
  commit_interval: 30
```

**Cost:** DB growth. With ~150 DSC entities, mitigate with `exclude:` for noisy
diagnostics you'll never query historically (`sensor.dsc_hub_wifi_rssi`,
`*_uptime`, etc.).

### Option B — export the Scribe weekly (better long-term)

The Scribe writes via `logbook.log`. A weekly automation hitting the REST API to
dump the logbook gives you a permanent grow diary **independent of the recorder**
— which is what you actually want. The recorder is a cache; a grow log is a
record. Conflating them is the underlying mistake.

**Recommendation:** do **A now** (30 seconds, stops the bleeding), plan **B**
properly. Don't let A's simplicity make you forget B.

---

## §5 · ⚠️ STILL OPEN — Scribe triple-reporting noise

> **Referenced from:** `automations.yaml` §C

**The v2.4 automations do NOT fix this.** Being unambiguous, because the delivery
includes new Scribe entries and it would be easy to assume they addressed it. They
didn't — they only cover *new* v2.4 events.

### The problem

One physical event generates three log lines. RH drops → `VPD alert` + `RH alert`
+ `humidifier fired` — three entries, one thing happening. Real events drown.

### Why it wasn't fixed here

The noise lives in **your existing Scribe automations**, which aren't part of this
deliverable. Fixing it means *editing those*, not adding more. Adding entries
without seeing the originals risks duplicating what's there — making the noise
worse while claiming to fix it.

### What the fix actually needs (in order of value)

1. **Make VPD and RH alerts mutually exclusive.** Two views of one measurement.
   Biggest win, least work.
2. **Suppress alerts while the responsible appliance is already responding.** If
   the humidifier is running, "RH is low" isn't news.
3. **Rate-limit per event class** (`mode: single` + cooldown).
4. **Log cycles, not edges,** for anything that can short-cycle.

v2.4 helps *indirectly*: the widened hysteresis (+2 → +6) and min-off timers mean
fewer real transitions to report. **Retune first, then reassess** — the noise
floor may drop enough that only fix #1 is worth doing.

---

## §6 · Judgement calls worth recording

### `device_class: running` on the window sensors

Not cosmetic — **load-bearing**. The Home alert list auto-includes
`binary_sensor.dsc_*` and excludes only `connectivity` and `running`. Without the
class, "window open" raises an alert **twice a day, every day, forever**. A tiny
detail with an outsized failure mode, invisible six months later. Hence this note.

### Plant Name / Growth Stage live on the node

Not HA helpers. **The label travels with the probe** — pull the node and the plant
it was watching comes with it. They're **labels, not control inputs**. Nothing in
the hub reads them; a wrong stage mis-captions a chart but can never mis-drive an
appliance. That separation is deliberate.

### Fire countdown in firmware, not HA

The ladder countdowns are **firmware truth**, published directly. The Dashboard-v3
plan called for HA-side timer helpers to reconstruct them. **Don't build that
layer** — it's redundant and, worse, a *second source of truth that can drift from
the first*. The firmware already owns this maths, including the v2.2 reality gates
that shorten the window when room air can't help. HA can't know about those
without duplicating the logic.

### `binary_sensor.dsc_hub_link` is an alias, not a firmware entity

The firmware exposes `binary_sensor.dsc_hub_ha_link_status` ("HA Link Status").
Every dashboard references `dsc_hub_link`. They're reconciled by an alias template
in `packages/dsc_dashboard_v3.yaml`, shipped in Phase 0. It works — but it means
the link card has a dependency visible only by grepping the package. The v2.4
checklist still lists "Hub link entity mismatch" as open. **It isn't — Phase 0
closed it.** Stale checkbox. *If you ever regenerate that package, carry the
alias.*

### The 60 s persistence on the dark-period alert

The ramp engine writes the SF1000 and the window flag on the same 15 s tick, but
HA sees two separate state updates microseconds apart. A bare trigger would
false-alarm **at every single sunset** — and an alarm that cries wolf twice a day
gets muted, at which point it isn't an alarm.

### `restore_mode: ALWAYS_OFF` + reconnect re-assert

A Sonoff that loses power comes back **OFF**, never mid-demand — the runaway fix.
But that creates a gap: if demand is still live, nothing tells it to turn back on.
Hence the reconnect trigger in each follower. The API-loss grace windows are tuned
**by consequence, not symmetry**: heater 60 s, heatmat/humidifier 90 s,
dehumidifier 240 s (compressor). A heater running unsupervised is a different risk
than a mister.

### Bounded test mode

Local button control is a design promise. But an *unbounded* button-ON is a heater
someone can walk away from. The 10-min max-runtime timer keeps the promise —
"local control survives everything" becomes "…bounded at 10 min per press." Demand-
and API-initiated ON get no timer; only the physical button arms it.

---

## §6b · The hub was never on the secrets list

Worth recording, because it's a pattern not an incident.

The v2.4 housekeeping item reads: *"pot and Sonoff configs carry API keys, OTA
passwords, and AP passwords inline."* Accurate — and the hub isn't mentioned.

So it kept an **inline API key**, an **inline AP password**, and **no OTA password
at all** right through the audit that found the same hole in `dsc-heater`. The
Sonoffs each switch one appliance. The hub drives every fan, the SF1000, and all
six demand rungs. An unauthenticated OTA endpoint there is the whole grow room.

It survived because the checklist was written by walking the *node* configs, and
the hub isn't a node. **A list of things to check is also a list of things not to
check** — the item that never made the list is invisible to every review that uses
it.

Fixed in this package: all three de-inlined, OTA password added, verified with a
clean compile.

---

## §6c · Why keys are generated, never handed over

`generate-secrets.sh` runs on your machine and the keys never leave it. This isn't
ceremony. The old keys didn't die because they were *inline* — they died because
they were inline **and** the file went through chat and upload logs. Any key that
arrives through a chat window is compromised on arrival; moving it into
`secrets.yaml` doesn't unburn it. The only keys worth having are ones that never
appeared anywhere but your disk. Hence a generator, not a file of keys.

---

## §7 · Compile discipline — what "verified" means here

Every device class has a **real full `esphome compile`** behind it, not just
`esphome config`:

| Class | Target | Result |
|---|---|---|
| ESP32 arduino | hub | 0 err / 0 warn |
| ESP32 esp-idf | pot1, pot3 | 0 err / 0 warn |
| ESP8285 | heater, de-humidifier | 0 err / 0 warn |

The Sonoff (ESP8285) compiles were a **gap closed this session** — a different
toolchain from the ESP32, and `esphome config` alone would never have caught a C++
break. It was being claimed on faith until the full builds ran.

Two operational notes for next time:
- Transient **Espressif registry 503s** (`components-file.espressif.com`) look
  like config failures but aren't — retry after the registry recovers.
- Full PlatformIO compiles in a sandbox always fail at the *link/network* stage;
  RAM/Flash figures + "Successfully compiled" is the pass signal.

---

## §8 · The open list, honestly

| Item | Severity | Notes |
|---|---|---|
| **Recorder retention** | 🟡 Verify first | §4. Phase 0 shipped a 120 d snippet — confirm it's applied. |
| **Scribe triple-reporting** | 🟡 Annoying | §5. Retune first, then fix #1. |
| **Pot entity_id inconsistency** | 🟡 Trap for future-you | `install-instructions.md` §6. |
| **POT3 probe swap-test** | 🟡 Blocks mat `min()` | Gates the multi-pot sense point (§3). |
| **`qa_rig.cpp` Suites 1–6** | 🟡 Beta gate | Still assume the v2.3 topology; add Suite 7 for new rungs. |
| **Fan airflow calibration** | 🟢 Hardware | Anemometer sweep to prove commanded % = real air. |
| **Micro-mister integration** | 🟢 Parked | Onto the clone-humidifier rung. |
| **ESP-NOW node→hub** | 🟢 Parked | Needs pot MACs + shared pot package first. |
| **PAR/lux in 2×4** | 🟢 Nice to have | Closes the physical-leak gap (§2). |
| **SCD41 real CO2** | 🟢 Nice to have | Block parked; drops onto existing I2C. |

### On the "Alpha" label

It's earned, not modest. **Every device class compiles clean — 0/0 on the hub for
the first time ever** — but:

- the ramp floor (32%) and mat band (20–24 °C) are **bench estimates** that have
  never met your actual hardware
- the QA rig hasn't been updated for the new topology
- the mat's closed loop has never run a full photoperiod

The first 48 hours of watching (`install-instructions.md` §10) is not a formality.
It's the actual test.

---

## §9 · Stale Notion checkboxes (close these)

Three items the wiki still lists as open are, in fact, closed:

1. **`rootzone_temp_entity` MUST-VERIFY** — verified correct:
   `sensor.dsc_pot1_soil_temperature`. The pot *sensors* are canonical; only the
   text/select entities carry the legacy `4x8_`/`grow_tent_` prefixes.
2. **Hub link entity mismatch** — Phase 0's alias closed it (§6).
3. **Clone LED follower deletion** — done 17 Jul 26.

And one belongs on the list that never was: **the hub's own secrets** (§6b).

---

## §10 · Notion write-up (queued, not done)

Per the standing rule, several items here warrant workbook entries — but **Notion
writes need explicit approval and none was given.** Nothing has been written.

| Destination | Entry |
|---|---|
| **Lessons Learnt** | Check the Code Library *before* writing automations — the Rev A follower collision |
| **Lessons Learnt** | Moving a device breaks the *meaning* of code that still compiles (light inversion) |
| **Lessons Learnt** | `device_class: running` as an alert-filter dependency |
| **Lessons Learnt** | Stale caveats as a bug class (the GPIO5 relay text) |
| **Lessons Learnt** | A faulted sensor must never be a control input or win a `min()` |
| **Lessons Learnt** | A checklist is also a list of things not to check (the hub secrets) |
| **v2.4 Changelog** | Window exports · `%u` cleanup · pot config restore · light-layer re-point · secrets/OTA |
| **Faults & Repairs** | POT3 probe — swap-test still pending |
| **Entity Registry** | The two window sensors · root-zone fault · 8 runtime tunables · 15 ladder telemetry sensors |
| **Code Library** | The EC uptake diagram (Δ-from-tank pattern generalises) · follower pack → v2.4a with reconnect trigger |

Say the word and I'll write them up.
