# DSC-HUB v2.4 — Complete Changelog

**Firmware string:** `2.4.0-alpha` · **Project:** `digital_emotions.dsc-hub`
**Codename:** *Light Topology + Closed-Loop Roots*
**Status:** Alpha — compiles clean on every device class; first-48h field-tuning pending.

> **The one-sentence version:** the SF1000 moved from the 4×8 to the 2×4 clone
> tent, and the ripple from that single physical change touches the firmware, the
> HA helper layer, every light card on the dashboard, and the safety model.
> Everything below is either that ripple or the housekeeping that rode the same
> release train.

This is the authoritative record for v2.4. Rationale lives in `notes-comments.md`;
the step-by-step is `install-instructions.md`; the running order is `README.md`.

---

## 0 · Scope at a glance

| Area | Artefact | Headline |
|---|---|---|
| Hub firmware | `dsc-hub-v2_4.yaml` | Light topology Option A · closed-loop mat · runtime tunables · window exports · clean build |
| Soil nodes | `dsc-pot-common.yaml` + 4 stubs | Shared package rollout · Plant Name / Growth Stage restored |
| Appliance nodes | `dsc-sonoff-common.yaml` + 4 stubs | `ALWAYS_OFF` runaway fix · API-loss grace · bounded test mode · OTA passwords |
| HA helpers | `dsc-v24-light-helpers.yaml` | Five light-accounting definitions re-pointed |
| HA automations | `automations.yaml` (Rev B) | Canonical followers + reconnect trigger · new alerts · v2.4 Scribe |
| Dashboard | `dsc-hub-v2_4-dashboard.yaml` | 9 views rebuilt · EC uptake · N/P/K surfaced |
| Secrets | `generate-secrets.sh` · `.gitignore` | All 9 devices rotated · hub OTA hole closed |

---

## 1 · Hub firmware — `dsc-hub-v2_4.yaml`

### 1.1 Light topology correction (Option A) — the headline

**Decided 16 Jul 2026.** The SF1000 physically hangs in the **2×4 clone tent**;
the 4×8 has **no light and no PWM module**. v2.3 parented the entire ramp engine
to the 4×8 schedule, which was simply wrong about the world.

- Ramp engine — sunrise/sunset, Manual Light Hold, write-guard, OLED light page —
  **re-parented to the clone photoperiod**.
- SF1000 is formally a **clone entity**.
- **Retired:** `switch.dsc_hub_clone_led_demand`, `switch.dsc_hub_clone_light_auto`.
- The 4×8 exposes **zero light entities**. Its photoperiod survives as a **virtual
  window** — a schedule that drives no output but still feeds Follow-4×8 clones,
  the counter-cycle thermal logic, and the OLED countdowns.
- **GPIO5 reserved** for a future 4×8 light; when it lands, the virtual schedule
  gets an output re-attached rather than rebuilt.
- **Behaviour shifts:** `Clone Mode → Off` now **darks the SF1000** (v2.3 only
  dropped the tent from arbitration); `Grow Stage → Off` no longer touches it.

### 1.2 Photoperiod window exports *(added this build)*

`lights_currently_on` was a firmware **global** (line 497), never exported — so
after 1.1 the 4×8's virtual window was invisible to HA entirely. Two new template
binary sensors close that:

| Entity | Source global | Class |
|---|---|---|
| `binary_sensor.dsc_hub_4x8_window_open` | `lights_currently_on` | `running` |
| `binary_sensor.dsc_hub_2x4_window_open` | `clone_lights_on` | `running` |

`device_class: running` is **load-bearing, not cosmetic** — the Home alert list
auto-includes `binary_sensor.dsc_*` and excludes only `connectivity` and
`running`. Without it, "window open" would raise an alert at every photoperiod,
twice a day, forever.

### 1.3 SF1000 ramp-floor remap

The 1 kΩ pull-down (bench-tested, passed) holds the dim line below the SF1000's
off-threshold — so the planned GPIO5 hard-off relay was **cancelled**. But the
driver ignores duty below its own kick-in point (~30–40%), so a naïve ramp jumps
from dark to visible.

- `min_power: 0.32` + `zero_means_zero` on the LEDC output.
- Brightness 0–100% remaps onto duty ~32–100%; **0 stays a true 0% duty**.
- Floor exposed as runtime `number.dsc_hub_sf1000_ramp_floor`, NVS-restored.
- ⚠ **32% is a bench estimate** — verify against the light on the first v2.4
  sunrise.

### 1.4 Closed-loop grow mat

v2.3 ran the mat off its own plate thermostat: a 22 °C plate setpoint left the
**root zone at 16–19 °C**. v2.4 drives mat demand off the **root-zone soil probe**.

- Sense point: `sensor.dsc_pot1_soil_temperature` (via `${rootzone_temp_entity}`).
- Band: **Mat Root-Zone Low / High** (20 / 24 °C, runtime, range 12–26 °C).
- **300 s minimum off-time** — soil is a slow thermal mass; stops cycling on lag.
- Fallback chain: **probe → v2.3 clone-air rung → mat OFF**. Safe but degraded.
- New `binary_sensor.dsc_hub_root_zone_sensor_fault` (5-min soft fault, rides out
  HA restarts).
- **POT1 only** for Alpha — a `min()` across pots waits on POT3, whose faulted
  probe reads 0.0 °C and would peg the mat on forever.

### 1.5 Clone humidifier short-cycling fix

v2.3 released at RH-min +2 — a 4% total band that made the micro-mister chatter
and flooded the Scribe.

- Release band widened to **Clone Hum Hysteresis** (runtime, default **+6%**,
  range 2–15%).
- **Clone Hum Min Off-Time** (runtime, 180 s).
- Room humidifier gets a 120 s min-off; heater 60 s (relay hygiene).
- QA jitter sim: 0 cycles in 30 min where the v2.3 band chattered.

### 1.6 Ladder timing telemetry

Firmware now publishes the control-ladder timers directly — no HA-side mirrors.

- **8 × Fire Countdown** sensors (seconds until a persisting condition fires).
- **7 × Cooldown Remaining** sensors (min-off / compressor-lock remaining).
- Covers heater, AC, humidifier, dehumidifier, grow mat, clone humidifier.
- *This makes the Dashboard-v3 HA-timer mirror layer redundant — it must not be
  built.*

### 1.7 Runtime-configurable parameters

Eight tunables moved from compiled constants to NVS state, layered on YAML
defaults:

| Tunable | Default | Range |
|---|---|---|
| SF1000 Ramp Floor | 32% | 0–50% |
| SF1000 Target Brightness | (stage) | 0–100% |
| Clone Hum Hysteresis | +6% | 2–15% |
| Clone Hum Min Off-Time | 180 s | — |
| Humidifier Min Off-Time | 120 s | — |
| Heater Min Off-Time | 60 s | — |
| Mat Root-Zone Low | 20 °C | 12–26 °C |
| Mat Root-Zone High | 24 °C | 12–26 °C |

**Watchdog and the >35 °C failsafe stay compiled-in** — never runtime-editable,
so nothing in the UI can disarm the safety net. Tuned NVS values should be folded
back into YAML defaults at the next version bump, with a commit saying *why*.

### 1.8 `%u` format-warning cleanup *(this build)*

Four ladder log lines (2531/2543/2626/2638) passed `uint32_t` into `%u` — UB by
the letter of the standard, warning noise since the v2.3 base. Fixed with explicit
`(unsigned)(x / 1000)` casts. **Result: first fully clean hub build in project
history — 0 errors, 0 warnings.**

### 1.9 Secrets de-inlined + OTA password added *(this build)*

The hub carried an **inline API key**, an **inline AP password**, and **no OTA
password at all** — and was never on the housekeeping checklist (which named only
pots and Sonoffs). All three fixed:

- `api.encryption.key` → `!secret dsc_hub_api_key`
- `ota` gains `password: !secret dsc_hub_ota_password` (was absent)
- AP password → `!secret dsc_hub_ap_password`

The old values are **burned** (chat/upload logs) — rotation means generating new
ones, not relocating old ones. See §5.

### 1.10 Housekeeping

- OLED version string fixed — prints **"rev 2.4a"** (v2.3 still said "rev 2.2").
- `project:` block added: `digital_emotions.dsc-hub` / `2.4.0-alpha`.
- ESP-NOW consumer block **parked** in-file (pot MACs + shared pot package are
  prerequisites; AP-channel-lock warning included).

---

## 2 · Soil nodes — `dsc-pot-common.yaml` + `dsc-pot1..4.yaml`

- **Shared-package rollout.** Deployed pots run monolithic v0 configs (20 s
  polling, no filters, no statistics). v2.4 moves them to `dsc-pot-common.yaml` +
  thin stubs. **Entity IDs unchanged** so dashboards survive.
- **Plant Name (`text`) + Growth Stage (`select`) restored** *(this build)* — the
  v0→v2.4 repackage had dropped them, which would have orphaned the dashboard's
  POT MATRIX and PLANT IDS cards. They live **on the node** so the label travels
  with the probe; they are labels, never control inputs.
- Growth Stage vocabulary mirrors the hub's `grow_stage` select.

---

## 3 · Appliance nodes — `dsc-sonoff-common.yaml` + 4 stubs

A single OTA reflash pass batches every node fix:

1. **`restore_mode: ALWAYS_OFF`** on all relays — the runaway fix. A node that
   loses power comes back OFF, never mid-demand. (v2.3 default `RESTORE_DEFAULT_OFF`
   + a 15-min reboot loop faithfully brought a dead heater *back on*.)
2. **API-loss interval failsafe** — relay ON + API disconnected past grace →
   relay OFF, without rebooting. Grace tuned **by consequence**: heater **60 s**,
   heatmat/humidifier **90 s**, dehumidifier **240 s** (compressor — don't
   short-cycle across routine restarts).
3. **De-inlined + rotated secrets** — API keys, OTA passwords, AP passwords.
4. **OTA passwords added** — `dsc-heater` had none (found 16 Jul): anyone on the
   LAN could flash a mains-switching device.
5. **`dsc-sonoff-common.yaml` + 4 stubs** — mirrors the pot pattern. **Entity IDs
   unchanged** (`switch.dsc_heater_main_relay` etc. are referenced by followers and
   dashboards).
6. **`project:` version block** — nodes join the versioning scheme.
7. **Relay on-time counter sensors** — firmware truth for the dashboard appliance
   cards.
8. **Bounded physical TEST MODE** — a button-initiated ON sets a `test_mode` flag
   and arms a **10-min max-runtime timer** (`test_max_runtime_ms: 600000`,
   per-node overridable). Any OFF cancels it. While active, the API-loss failsafe
   stands down — the timer is the bound. Exposed as a `Test Mode` binary_sensor so
   the Scribe/dashboards see tests. Demand/API-initiated ON gets no timer.

> The wiki's "local control survives everything" promise becomes "…survives
> everything, bounded at 10 min per press."

---

## 4 · Home Assistant

### 4.1 Light helpers — `dsc-v24-light-helpers.yaml`

Five v2.3 definitions **replaced** (delete the originals first — dup `unique_id`s):

| Entity | Change |
|---|---|
| `sensor.dsc_lights_on_today_2x4` | → SF1000. The only real photon count in the system. |
| `sensor.dsc_lights_on_today_4x8` | → 4×8 window sensor. Virtual; a schedule, not an output. |
| `binary_sensor.dsc_clone_dark_period_violation` | **New.** Replaces the 4×8 version; SF1000 on + 2×4 window shut. |
| `sensor.dsc_clone_expected_light_hours` | **New.** Resolves like the ramp engine: Off→0, Follow-4×8→4×8 stage hours, Independent→Clone Light Hours. |
| `sensor.dsc_lights_deviation_today` | Re-pointed at the 2×4 (4×8 was plan-vs-plan, always zero). |

**Left alone:** `dsc_expected_light_hours`, `dsc_next_light_event` (still describe
the 4×8's real schedule).

### 4.2 Automations — `automations.yaml` (Rev B)

> **Rev B reconciles against the canonical Code Library pack.** Rev A invented its
> own pattern — an ID collision (`dsc_v24_follow_*` vs canonical `dsc_follower_*`,
> which would race eight automations on four relays), a **safety regression**
> (triggering on `to:"on"/"off"` doesn't fire on `unavailable`, so a hub dropout
> would leave a 750 W heater running), and the wrong notifier. Superseded.

- **Four demand followers** — canonical entity-based pattern (`mode: restart`,
  bare `state` trigger, `default:`=safe-OFF catching off/unavailable/unknown,
  `homeassistant: start` resync).
- **+ one genuine addition:** a `relay from: unavailable` trigger per follower.
  `ALWAYS_OFF` (§3.1) means a rebooted node comes up OFF while demand is still ON;
  the demand never *changed* and HA never restarted, so nothing re-fires. This
  closes that gap.
- **New alerts:** clone dark-period violation (60 s persist → `notify.chriss_iphone_max`);
  root-zone probe fault (10 min persist, regression notice, no push).
- **v2.4 Scribe entries:** mat closed-loop transitions (logs root-zone temp at
  each edge), clone photoperiod boundaries, node test mode. Cover events that
  didn't exist pre-2.4, so no collision with existing Scribe.
- **Unchanged / kept:** `dsc_hub_offline_safe_off` (30 s group-off + alert),
  `dsc_follower_clone_humidifier` (parked until the mister).
- **Clone LED follower:** deleted 17 Jul 26 — retired entity, do not un-comment.

### 4.3 Dashboard — `dsc-hub-v2_4-dashboard.yaml`

3,797 lines · 9 views · path prefix `/dsc-hub-v2-4/`.

**Corrected misleading cards:**
- 4×8 Main "LIGHTING SNAPSHOT" (showed the SF1000) → **"LIGHTING — none fitted"**
  + virtual-window ribbon. Was the single most misleading card post-topology.
- Lighting page retitled "SF1000 — 4×8 MAIN" → **"SF1000 — 2×4 CLONE TENT"**.
- Stale GPIO5-relay caveat replaced with the resolved dark-period note.
- Counter-cycle ribbons rebuilt as **deliberately different shapes** — 4×8
  square-wave (schedule) vs 2×4 trapezoid (real ramp).

**New sections:**
- **⚡ EC PLANT UPTAKE** (Root Zone) — feed→uptake diagram, soil-EC-vs-tank chart,
  Δ-from-tank uptake chart, instantaneous-slope bar-card. Frames the physics: a
  pot whose EC is *climbing* has stopped drinking its salts.
- **N · P · K** — full 7-day charts + P/K columns in the POT MATRIX. **Two-thirds
  of the probe had been invisible since day one.**
- **Root-zone gauge** promoted to Home vitals (it's a control input now).
- **v2.4 Live Tunables** expanders (Climate Engine) — the 8 runtime numbers.
- **Ladder fire-countdown + cooldown telemetry** on the Climate Engine ladder.
- **Root-zone-vs-band forensics** chart (Trends) — the v2.4 acceptance test.
- Reworked System Narrator (mat heats root-zone-to-band; SF1000 in clone; 4×8
  virtual; POT3 excluded from `min()`).

### 4.4 Recorder / link

- **`dsc_hub_link` alias** — reconciles firmware `dsc_hub_ha_link_status` with the
  ID every dashboard references. Shipped in Dashboard-v3 Phase 0. **Closed** — the
  Notion checkbox for this is stale.
- **Recorder retention** — Phase 0 shipped a `purge_keep_days: 120` snippet, but
  the plan is "pending install". **Verify it's applied** before trusting long
  charts. See `notes-comments.md` §4.

---

## 5 · Secrets & repo hygiene

- **`generate-secrets.sh`** — generates a complete `secrets.yaml` with **fresh
  keys for all 9 devices** (30 keys total, matched exactly to the `!secret`
  references). Runs locally; keys never touch a chat window (which is how the old
  ones died). Refuses to overwrite; `chmod 600`.
- **`.gitignore`** — first line is `secrets.yaml`. The old keys were burned partly
  because a file like this didn't exist yet.
- **Rotation forces a full re-flash** of all 9 devices — keys are compiled in.

---

## 6 · Build verification — full compiles, every device class

Not `esphome config` — real `esphome compile`, which is the only thing that catches
C++/toolchain breaks.

| Target | Platform | RAM | Flash | Result |
|---|---|---|---|---|
| `dsc-hub-v2_4` | ESP32 (arduino) | 33.9% | 58.8% | **0 err / 0 warn** |
| `dsc-pot1` | ESP32 (esp-idf) | 26.1% | 49.6% | **0 err / 0 warn** |
| `dsc-pot3` | ESP32 (esp-idf) | 26.1% | 49.6% | **0 err / 0 warn** |
| `dsc-heater` | ESP8285 | 41.1% | 46.6% | **0 err / 0 warn** |
| `dsc-de-humidifier` | ESP8285 | 41.1% | 46.6% | **0 err / 0 warn** |

> Toolchain: ESPHome 2026.7.0. Transient Espressif registry 503s
> (`components-file.espressif.com`) were hit and retried clean — an upstream
> outage, not a config fault. The ESP8285 Sonoff compiles were the gap this
> session closed: a different toolchain from the ESP32, and `esphome config` alone
> would not have caught a C++ break.

---

## 7 · Retired in v2.4 (referenced nowhere in the shipped configs)

- `switch.dsc_hub_clone_led_demand` — ramp engine replaced the binary demand
- `switch.dsc_hub_clone_light_auto` — `auto_photoperiod` covers it
- `binary_sensor.dsc_main_dark_period_violation` → `dsc_clone_dark_period_violation`
- The Clone LED demand-follower automation (deleted 17 Jul 26)

---

## 8 · Deliberately deferred (same release train, not in these YAMLs)

| Item | Why deferred |
|---|---|
| Scribe rate-limit + VPD/RH alert exclusivity | HA-side; lives in existing Scribe entries. The hysteresis fix removes the noise *source* — retune first. |
| Recorder retention | Phase-0 snippet shipped; verify applied. |
| Fan airflow calibration (anemometer sweep) | Hardware task; proves commanded % = real air. |
| Micro-mister integration | Hardware onto the clone-humidifier rung. |
| ESP-NOW direct node→hub links | Parked block; needs pot MACs + shared pot package first. |

---

## 9 · Beta gates (before this touches flowering plants)

1. `qa_rig.cpp` Suites 1–6 update — they still assert Clone LED Demand flips
   (topology changed); add a Suite 7 for the new rungs at grid-sweep scale.
2. `rootzone_temp_entity` confirmed against the real POT entity — **verified:
   `sensor.dsc_pot1_soil_temperature`** (pot *sensors* are canonical; only
   text/select carry legacy prefixes).
3. Clone LED demand-follower deleted in HA before flashing — **done 17 Jul**.
4. First-sunrise ramp-floor verification.
