# DSC-HUB v2.4.1 — Install / Flash Guide

*(Prepend to install-instructions.md. v2.4 sections below remain valid
for anything not yet rolled out.)*

## §0 · What this release touches

| Piece | File | Action |
|---|---|---|
| Hub firmware | `esphome/dsc-hub-v2_4_1.yaml` | flash (replaces dsc-hub-v2_4.yaml) |
| Pot package | `esphome/dsc-pot-common.yaml` (v2.4.1) | flash all 4 pots (POT2 canary first) |
| Sonoffs | unchanged from v2.4 | nothing to do if already on v2.4 |
| HA automations / dashboard / helpers | `homeassistant/` | see §3 |
| Secrets | `espnow_key` NEW | see §1 |

## §1 · Secrets — one new key

Add to `secrets.yaml` on the **hub and all four pots** (the SAME value
everywhere — it authenticates the ESP-NOW payloads):

```yaml
espnow_key: "<one random string, e.g. openssl rand -hex 16>"
```

Everything else in secrets is unchanged from v2.4 (if you haven't
rotated the burned v2.3 keys yet, do it in this same pass —
`generate-secrets.sh`).

## §2 · Router — lock the AP channel

ESP-NOW rides the WiFi channel. Set the 2.4 GHz channel to a FIXED
number (not Auto) on the router. A channel hop only degrades the link
to the HA path (the fallback chain covers it), but lock it anyway.

## §3 · Flash order

1. **Hub first**: `esphome run dsc-hub-v2_4_1.yaml`
   Safe alone — the ESP-NOW consumer just hears silence and every pot
   rides its HA mirror until the pots are flashed.
   Verify after boot:
   - [ ] `Tent Full Auto Mode` / stage / targets survived (NVS intact)
   - [ ] log shows `level: INFO` chatter only, ladder tags visible
   - [ ] `binary_sensor.dsc_hub_root_zone_sensor_fault` = off (HA path)
   - [ ] the four `POTn ESP-NOW Link` sensors exist (off for now)
2. **POT2 as canary** (not POT1 — drives the mat; not POT3 — faulted):
   `esphome run dsc-pot2.yaml`
   - [ ] `binary_sensor.dsc_hub_pot2_esp_now_link` turns ON within ~2 min
   - [ ] `sensor.dsc_pot2_soil_temperature` still updates in HA (API path intact)
3. **Remaining pots**, then:
   - [ ] all four link sensors ON (POT3's temp link works even with its
         faulted moisture probe)
   - [ ] restart HA once: mat behaviour must NOT change during the
         restart (that's the whole point) — watch `Grow Mat Demand`

## §4 · Home Assistant

- `homeassistant/automations.yaml` — Rev B pack (unchanged from v2.4 if
  already installed; the threshold-template guards in the alert
  automations are the only v2.4.1 delta — reload automations).
- `homeassistant/dsc-hub-v2_4-dashboard.yaml` — v2.4.1 adds the per-pot
  ESP-NOW link chips on the Root Zone view. Paste over the dashboard
  raw config.
- `dsc-v24-light-helpers.yaml` — unchanged; keep as installed.

## §5 · Post-flash sanity (10 minutes in front of the tent)

- [ ] Drive RH under its floor (or wait for evening dry-down): the
  humidifier now logs `RH x% (floor y%) VPD a (ceil b) -> HUMIDIFIER`
- [ ] Watch a hot spell: OUT/exchange fans must visibly ramp BEFORE
  any `AC Demand` (log says `fans saturated` or `fans useless`)
- [ ] Nudge `Mat Root-Zone Low` above the current coldest pot: mat
  fires on the coldest pot's number, log names it
- [ ] Move the SF1000 slider in HA mid-window: `Manual Light Hold`
  must latch ON (this was broken in v2.4) — then clear it
- [ ] Pull one pot's plug: its link sensor drops, mat keeps running on
  the HA mirror / remaining pots; no alert storm

## §6 · Rollback

Keep `dsc-hub-v2_4.yaml` — flashing it back fully reverts the hub.
Pots: v2.4 pot-common (ESP-NOW parked) reverts the sender half. No HA
entity migrations to unwind.

---
---

# DSC-HUB v2.4 — Complete Install Instructions

**Everything needed to take the system from its current state to fully-deployed
v2.4.** This is the detailed walkthrough; `README.md` is the condensed running
order; `changelog.md` is what changed; `notes-comments.md` is why.

**Firmware:** `2.4.0-alpha` · **Devices:** 9 (1 hub + 4 pots + 4 Sonoffs)
**Time:** ~90 min, most of it compiling.

---

## ⚠️ Read before you start — three things that will bite you

### 1. This is a secrets rotation → every device gets re-flashed

The hub and node keys are **burned** (they've been through chat/upload logs).
Moving them into `secrets.yaml` doesn't unburn them — only generating new ones
does. New keys are compiled in, so all 9 devices re-flash. There is no partial
version.

### 2. 🔴 Rotating an OTA password *over OTA* is chicken-and-egg

The uploader authenticates with the **new** password against a device running the
**old** one → it fails.

| Device's *current* OTA password | Route |
|---|---|
| **None** | ✅ OTA works |
| **Exists and changing** | 🔌 **USB/serial, once** |

- **Hub:** no OTA password → OTA. ✅
- **Sonoffs:** no OTA password → OTA. ✅
- **Pots:** still on v0 monolithic — **unknown**. Check each:
  ```bash
  grep -A3 '^ota:' /path/to/deployed/dsc-pot1.yaml
  ```
  A `password:` line → that pot needs USB. Find the cable *now*, not at 1 a.m.

### 3. You're already on v2.4a — this is a RE-flash

The hub was flashed to v2.4a on 17 Jul (3,671 lines). This build adds the two
window exports, the `%u` cleanup, and the secrets/OTA fix. **Tuned NVS values
survive a re-flash; YAML defaults reset.**

---

## §0 · Back up

```bash
# From your HA config dir
cp automations.yaml            automations.yaml.v23-backup
cp configuration.yaml          configuration.yaml.v23-backup
cp -r packages/                packages.v23-backup/
```

Export the current dashboard: **⋮ → Raw configuration editor → select all → save
to a file**. Keep v3 — you'll run both side by side.

**Note your tuned values** (they survive a reflash, but note them anyway): mat
band, clone-hum hysteresis, min-off times, ramp floor.

---

## §1 · Generate secrets

Every config in this release references `!secret` — nothing builds without this.

```bash
cd /config/esphome
./generate-secrets.sh
```

Then **edit `secrets.yaml`** — set `wifi_ssid` and `wifi_password` (the two
`CHANGEME` lines). All 30 device keys are generated for you.

- [ ] `.gitignore` contains `secrets.yaml` **before any `git add`**
- [ ] `secrets.yaml` is mode 600 (the script sets this)

> Keys are generated **on your machine and never leave it**. Nothing here was
> handed to you through a chat window — that's how the old ones died.

---

## §2 · Stage the ESPHome directory

Copy all 12 files from the package `esphome/` folder **flat** into
`/config/esphome/`, next to `secrets.yaml`.

> **Flat, not nested.** ESPHome resolves `secrets.yaml` **only from the config
> file's own directory**, never a parent. A `nodes/` subfolder would force you to
> duplicate secrets into it. Verified, not assumed.

Files: `dsc-hub-v2_4.yaml` · `dsc-pot-common.yaml` · `dsc-pot1..4.yaml` ·
`dsc-sonoff-common.yaml` · `dsc-heater/heatmat/humidifier/de-humidifier.yaml` ·
`generate-secrets.sh`.

---

## §3 · Flash the hub — FIRST, always

Everything downstream references entities that don't exist until this runs.

```bash
esphome run dsc-hub-v2_4.yaml
```

Goes over OTA (hub currently has no OTA password; afterwards it has one).

**HA will prompt to re-enter the ESPHome API key** — it changed. Paste
`dsc_hub_api_key` from `secrets.yaml`.

**Verify** (`Developer Tools → States → dsc_hub_`):

- [ ] `sensor.dsc_hub_firmware_version` = **`2.4.0-alpha`**
- [ ] `binary_sensor.dsc_hub_4x8_window_open` exists
- [ ] `binary_sensor.dsc_hub_2x4_window_open` exists
- [ ] `binary_sensor.dsc_hub_root_zone_sensor_fault` exists
- [ ] `number.dsc_hub_mat_root_zone_low` / `_high` exist
- [ ] `number.dsc_hub_sf1000_ramp_floor` exists
- [ ] `sensor.dsc_hub_heater_fire_countdown` exists

**If the firmware string is wrong, stop and fix the flash** — don't debug the
dashboard.

---

## §4 · Light helpers

> **Referenced from:** `dsc-v24-light-helpers.yaml` header

They live in **`packages/dsc_dashboard_v3.yaml`** (the 18-helper Phase 0 layer).

### 4a. Delete these five v2.3 definitions

- [ ] `DSC Lights On Today 2x4` (history_stats on `switch.dsc_hub_clone_led_demand`)
- [ ] `DSC Lights On Today 4x8` (history_stats on the SF1000)
- [ ] `DSC Main Dark Period Violation`
- [ ] `DSC Lights Deviation Today`
- [ ] any pre-existing `DSC Clone Expected Light Hours`

> ⚠️ **Delete the five definitions, NOT the file.** That package also carries the
> `dsc_hub_link` alias, the airflow flux proxies, and every runtime counter.

### 4b. Keep

- [ ] `sensor.dsc_expected_light_hours` — still correct (4×8's real schedule)
- [ ] `sensor.dsc_next_light_event`

### 4c. Load the new file

Drop `dsc-v24-light-helpers.yaml` into `/config/packages/`.

```
Developer Tools → YAML → Check configuration → Restart
```

**Verify:**
- [ ] `sensor.dsc_lights_on_today_2x4` / `_4x8` — have values, no `_2` twins
- [ ] `binary_sensor.dsc_clone_dark_period_violation` exists, reads `off`
- [ ] search `_2` → **nothing** (a `_2` twin means §4a was incomplete)

---

## §5 · Automations (Rev B)

> **Referenced from:** `automations.yaml` header

### 5a. Already done — nothing to delete

- [x] Clone LED follower — deleted 17 Jul 26. **Do not un-comment** (retired
      entity → "failed to set up"). *Rule: lights are never followers.*

### 5b. If you pasted the earlier Rev A — undo it

- [ ] Delete any automation whose id starts `dsc_v24_follow_` (four of them) — they
      collide with the canonical `dsc_follower_*` IDs and would race the relays.

### 5c. Followers — a one-line addition, not a replace

Your four canonical followers are correct; **keep them**. Add this **third
trigger** to each (relay entity per follower):

```yaml
    - trigger: state
      entity_id: switch.dsc_heater_main_relay      # per follower
      from: "unavailable"
      for: "00:00:05"
```

Relays: `switch.dsc_heater_main_relay` · `switch.dsc_heatmat_main_relay` ·
`switch.dsc_humidifier_main_relay` · `switch.dsc_de_humidifier_main_relay`.

> **Why:** the Sonoff `restore_mode: ALWAYS_OFF` (the runaway fix) means a rebooted
> node comes up OFF while demand is still ON. The demand never *changed*, and HA
> never restarted, so nothing re-fires — the mat sits dead on a cold night. Same
> class as the 17 Jul "demand ON, mat off" symptom, through a new door.

### 5d. Keep untouched

- [ ] `dsc_hub_offline_safe_off` (30 s group-off + `notify.chriss_iphone_max`)
- [ ] `dsc_follower_clone_humidifier` (parked)
- [ ] existing Scribe automations · fan-test scripts

### 5e. Add from `automations.yaml` Rev B

- [ ] §B alerts — clone dark-period violation, root-zone probe fault
- [ ] §C Scribe — mat closed-loop, clone photoperiod, node test mode

```
Developer Tools → YAML → Reload automations
```

Then **restart HA — not just reload.** Followers are edge-triggered; only a real
restart fires the `homeassistant: start` resync leg. *That's exactly how the
17 Jul grow-mat symptom happened.*

**Verify:**
- [ ] no "Unknown entity"
- [ ] search automations for `dsc_v24_follow` → nothing
- [ ] toggle `switch.dsc_hub_heater_demand` → `switch.dsc_heater_main_relay`
      follows within ~1 s

---

## §6 · Flash the pots

> **Referenced from:** dashboard Root Zone page

**Flash POT2 first** as the canary — not POT1 (drives the mat), not POT3 (faulted).

```bash
esphome run dsc-pot2.yaml
```

Check `Developer Tools → States → text.4x8_dsc_pot_2_plant_name`:

- **Has a value** → entity_ids preserved (Outcome A). Flash the rest.
- **Unavailable, and `text.dsc_pot2_plant_name` appeared** → Outcome B (below).

> **The entity_id situation** — inconsistent *by history, not design*: POT1/2
> carry a `4x8_` prefix, POT4 a `grow_tent_` one, POT3 is already canonical. They
> were renamed in HA at different times. The dashboard uses the existing IDs.
> The pot **sensors** (`sensor.dsc_pot1_soil_temperature` etc.) are already
> canonical — which is why `rootzone_temp_entity` is correct as-shipped.

**Outcome B fix** — either rename the new entity back in Settings → Devices
(2 min/pot, dashboard untouched), or let them land canonical and find/replace in
the dashboard (`text.4x8_dsc_pot_1_` → `text.dsc_pot1_`, etc.). The clean route is
worth doing eventually.

```bash
esphome run dsc-pot1.yaml
esphome run dsc-pot3.yaml
esphome run dsc-pot4.yaml
```

**Verify:**
- [ ] `sensor.dsc_pot1_soil_temperature` reads real — **the mat depends on it**
- [ ] `binary_sensor.dsc_hub_root_zone_sensor_fault` = `off`

---

## §7 · Flash the Sonoffs

```bash
esphome run dsc-heater.yaml
esphome run dsc-heatmat.yaml
esphome run dsc-humidifier.yaml
esphome run dsc-de-humidifier.yaml
```

Each comes up **OFF** (`restore_mode: ALWAYS_OFF`). The follower reconnect trigger
(§5c) re-asserts any live demand within ~5 s.

**Verify:**
- [ ] all 4 `switch.dsc_*_main_relay` present and reachable
- [ ] all 4 `binary_sensor.dsc_*_test_mode` present, reading `off`

---

## §8 · Dashboard

**New dashboard — do not overwrite v3 yet.**

1. Settings → Dashboards → **+ Add Dashboard** → New from scratch
2. Title `DSC-HUB v2.4` · URL **`dsc-hub-v2-4`** (must match — internal nav uses
   `/dsc-hub-v2-4/`)
3. Open → ⋮ → **Raw configuration editor** → paste `dsc-hub-v2_4-dashboard.yaml` →
   Save

### HACS dependencies (all already required by v3 — nothing new)

`mushroom` · `apexcharts-card` · `power-flow-card-plus` · `sankey-chart` ·
`plotly-graph-card` · `mini-graph-card` · `gauge-card-pro` ·
`modern-circular-gauge` · `logbook-card` · `auto-entities` ·
`vertical-stack-in-card` · `card-mod` · `bar-card` · `expander-card` ·
`ph-meter-temperature`

**Verify:**
- [ ] all 9 views load, no red "Custom element doesn't exist"
- [ ] Home → System Pulse = **HUB ONLINE**, no unexpected alerts
- [ ] **4×8 Main → LIGHTING reads "none fitted"** ← headline fix
- [ ] **2×4 Clone → SF1000 card present** ← light lives here now
- [ ] Root Zone → POT MATRIX shows P and K columns populated
- [ ] Root Zone → EC PLANT UPTAKE renders

---

## §9 · Recorder retention — verify, don't assume

Phase 0 shipped a `purge_keep_days: 120` snippet, but the plan is "pending
install". A grow cycle is 90–120 days; the default 10-day purge shreds the Scribe
and every long chart before the cycle ends.

**Check:**
```bash
grep purge_keep_days /config/configuration.yaml
```

- Present at 120 → closed.
- Absent → add it (`notes-comments.md` §4 has the block + a DB-size note, and the
  better weekly-export option).

---

## §10 · First 48 hours — the actual test

Defaults are **bench estimates**. Two want your eyes.

### First clone sunrise — ramp floor

Watch it live, or `2×4 Clone → SF1000 brightness — the ramp` after:

| You see | Meaning | Fix |
|---|---|---|
| Smooth fade from black ✅ | floor right | — |
| Visible **jump** | floor too high | lower `number.dsc_hub_sf1000_ramp_floor` |
| First minutes dark | floor too low | raise it |

Default 32%. Runtime — no reflash.

### First mat cycles — root-zone band

`Trends → Root zone vs mat runs vs the band`:
- root zone **between the dashed lines**
- mat blocks long and few
- root zone tracking the dotted *air* line → probe blind, back on v2.3 behaviour
  (check Root-Zone Sensor Fault)

### Clone humidifier cycling

`2×4 Clone → cyc/h` chip should be **≤3**. Higher → widen
`number.dsc_hub_clone_hum_hysteresis` (already +6 vs v2.3's +2).

### Fold the keepers back

Values you tune live in **NVS only**. At the next version bump, fold keepers into
YAML defaults with a commit saying *why* — else a future reflash reverts them.

---

## §11 · Verify-everything checklist

- [ ] All 9 devices online on new keys
- [ ] `secrets.yaml` **not** in `git status`
- [ ] No `_2` duplicate entities
- [ ] No automation "Unknown entity"; no `dsc_v24_follow` survivors
- [ ] Firmware string `2.4.0-alpha`
- [ ] 4×8 = "none fitted" · 2×4 = SF1000 present
- [ ] P/K columns + EC uptake render
- [ ] Recorder retention confirmed at 120 (or consciously deferred)
- [ ] First-sunrise + first-mat-cycle watched

---

## 🔥 Rollback

```bash
esphome run dsc-hub-v2_3.yaml       # or your v2.3 folder path
```

Restore `automations.yaml.v23-backup` + `packages.v23-backup/`, restart HA, switch
back to the v3 dashboard (never deleted — §8).

**Firmware rollback is clean** — v2.4 adds entities rather than renaming them.

**One catch:** v2.3 configs reference the **old** secrets. Keep `secrets.yaml.old-*`
until you're confident, or v2.3 won't build.
