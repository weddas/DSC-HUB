# DSC-HUB v2.4 — Full Update Package

**Everything, in the order it has to happen.** Start here, not with the other docs.

**Firmware:** `2.4.0-alpha` · **Built:** 2026-07-18
**Hub build:** RAM 33.9% · Flash 58.8% · **0 errors, 0 warnings**

---

## ⚠️ Read this before you touch anything

Two things will bite you if you skip them.

### 1. This rotation forces a full re-flash of all 9 devices

The hub's API key and AP password are **burned** — they've been through chat and
upload logs more than once. Moving them into `secrets.yaml` doesn't unburn them.
**Only generating new ones does.** New keys are compiled in, so every device gets
re-flashed. There's no partial version of this.

### 2. 🔴 Rotating an OTA password over OTA is chicken-and-egg

The uploader authenticates with the **new** password against a device still
running the **old** one. It fails. The rule:

| Device's *current* OTA password | Re-flash route |
|---|---|
| **None** | ✅ OTA works — nothing to authenticate against |
| **Exists, and you're changing it** | 🔌 **USB/serial required, once** |

**Known:** the hub has **no** OTA password (found 18 Jul — it was never on the
housekeeping list). The Sonoffs have **none** either (found 16 Jul in
`dsc-heater`). So those five go over OTA.

**Unknown:** the four pots still run the v0 monolithic configs. **Check before
you start:**

```bash
grep -A3 '^ota:' /path/to/your/deployed/dsc-pot1.yaml
```

- No `password:` → OTA is fine.
- Has one → that pot needs a USB flash. Get the cable out before you begin, not
  at 1 a.m. with a tent full of unmanaged plants.

---

## What changed

> **The SF1000 is the 2x4's light. The 4x8 has no lamp.**

That one move inverted the entire light-accounting layer — including a
dark-period alarm that was silently watching the wrong tent. Full detail in
`changelog.md`; the *why* in `notes-comments.md`.

**New since the v2.4a you flashed on 17 Jul:**
- Two photoperiod window exports (the 4x8's virtual window had no entity at all)
- `%u` cast cleanup → first ever 0-warning hub build
- Plant Name / Growth Stage restored to the pot package
- **Hub secrets de-inlined + OTA password added** ← new this round

---

## 📁 What's in here

```
DSC-HUB-v2.4/
├── README.md                    ← you are here
├── install-instructions.md      ← the detailed §-by-§ walkthrough
├── changelog.md                 ← what changed and why
├── notes-comments.md            ← design rationale + what's still open
├── .gitignore                   ← the first line matters more than the rest
│
├── esphome/                     → copy FLAT into /config/esphome/
│   ├── generate-secrets.sh      ← run this FIRST
│   ├── dsc-hub-v2_4.yaml
│   ├── dsc-pot-common.yaml      + dsc-pot1..4.yaml
│   └── dsc-sonoff-common.yaml   + dsc-heater / heatmat / humidifier / de-humidifier
│
├── homeassistant/
│   ├── packages/dsc-v24-light-helpers.yaml   → /config/packages/
│   ├── automations.yaml                      → merge into yours (Rev B)
│   └── dashboards/dsc-hub-v2_4-dashboard.yaml → paste via Raw config editor
│
└── qa/qa_alpha.cpp
```

> **`esphome/` is deliberately flat.** ESPHome resolves `secrets.yaml` **only
> from the config file's own directory** — never the parent. A `nodes/`
> subfolder would force you to duplicate secrets into it, which defeats the
> entire point. Verified, not assumed.

---

## 🔢 The sequence

Roughly **90 min**, most of it compiling. Do it when the tents can go ~20 min
without automation — the Sonoffs come up OFF by design.

| # | Step | Time |
|---|---|---|
| 0 | Back up | 5 min |
| 1 | Generate secrets | 2 min |
| 2 | Stage the ESPHome dir | 2 min |
| 3 | Flash hub | 10 min |
| 4 | Light helpers | 10 min |
| 5 | Automations (Rev B) | 10 min |
| 6 | Flash 4 pots | 25 min |
| 7 | Flash 4 Sonoffs | 15 min |
| 8 | Dashboard | 10 min |

### 0 · Back up

```bash
cp automations.yaml automations.yaml.v23-backup
cp configuration.yaml configuration.yaml.v23-backup
cp -r packages/ packages.v23-backup/
```

Export the v3 dashboard: **⋮ → Raw configuration editor → select all → save to a
file.** Don't delete v3 — run them side by side.

**Note your tuned values now** — they live in NVS and survive a re-flash, but if
anything resets you'll want them: mat band, clone hum hysteresis, min-off times,
ramp floor.

### 1 · Generate secrets

```bash
cd /config/esphome
./generate-secrets.sh
```

Then **edit `secrets.yaml`** — set `wifi_ssid` and `wifi_password` (the two
`CHANGEME` lines). Everything else is generated.

**Confirm `.gitignore` has `secrets.yaml` in it before any `git add`.** Ever.

> I deliberately did **not** generate keys and hand them to you. Anything that
> arrives through a chat window is burned on arrival — that is precisely how the
> current ones died. The script runs on your machine; the keys never leave it.

### 2 · Stage the ESPHome dir

Copy everything from `esphome/` **flat** into `/config/esphome/`, alongside the
`secrets.yaml` you just made.

### 3 · Flash the hub — FIRST, always

```bash
esphome run dsc-hub-v2_4.yaml
```

The hub currently has no OTA password, so this goes over the air. Afterwards it
has one, and every future flash uses it.

**Verify** (`Developer Tools → States → dsc_hub_`):

- [ ] `sensor.dsc_hub_firmware_version` = **`2.4.0-alpha`**
- [ ] `binary_sensor.dsc_hub_4x8_window_open` exists
- [ ] `binary_sensor.dsc_hub_2x4_window_open` exists
- [ ] `binary_sensor.dsc_hub_root_zone_sensor_fault` exists
- [ ] `number.dsc_hub_sf1000_ramp_floor` exists
- [ ] `sensor.dsc_hub_heater_fire_countdown` exists

HA will prompt to **re-enter the ESPHome API key** — it changed. Paste
`dsc_hub_api_key` from `secrets.yaml`.

**If the firmware string is wrong, stop.** Everything downstream depends on this.

### 4 · Light helpers → `install-instructions.md` §3

Delete **five** old definitions from `packages/dsc_dashboard_v3.yaml`, then drop
in `dsc-v24-light-helpers.yaml`.

> ⚠️ **Delete the five definitions, not the file.** That package also carries the
> `dsc_hub_link` alias (which reconciles the firmware's
> `dsc_hub_ha_link_status` with what every dashboard references), plus the
> airflow flux proxies and every runtime counter.

### 5 · Automations → `install-instructions.md` §4

Rev B uses your **canonical `dsc_follower_*` IDs**. If you pasted the earlier Rev
A, **delete its four `dsc_v24_follow_*` automations first** or you'll have eight
followers racing four relays.

Then **restart HA** — not just reload. Followers are edge-triggered; only a real
restart fires the `homeassistant: start` resync leg. *That's exactly how the
17 Jul "demand ON, mat off" symptom happened.*

### 6 · Flash the pots → `install-instructions.md` §5

**Flash POT2 first** as the canary — not POT1 (it drives the mat), not POT3
(faulted probe). §5 covers the entity_id outcome you're checking for.

```bash
esphome run dsc-pot2.yaml    # then pot1, pot3, pot4
```

- [ ] `sensor.dsc_pot1_soil_temperature` reads real — **the mat depends on it**
- [ ] `binary_sensor.dsc_hub_root_zone_sensor_fault` = `off`

### 7 · Flash the Sonoffs

```bash
esphome run dsc-heater.yaml dsc-heatmat.yaml dsc-humidifier.yaml dsc-de-humidifier.yaml
```

Each comes up **OFF** (`restore_mode: ALWAYS_OFF` — the runaway fix). The
followers' reconnect trigger re-asserts any live demand within ~5s.

### 8 · Dashboard → `install-instructions.md` §7

**New dashboard, URL exactly `dsc-hub-v2-4`** (the internal nav links depend on
it). Raw config editor → paste → save. Leave v3 alone until you trust this.

---

## ✅ Done when

- [ ] All 9 devices online on new keys
- [ ] No `_2` duplicate entities (search `_2` — should be empty)
- [ ] No automation shows "Unknown entity"
- [ ] Search automations for `dsc_v24_follow` → **nothing**
- [ ] **4x8 Main → LIGHTING reads "none fitted"** ← the headline fix
- [ ] **2x4 Clone → SF1000 card present** ← the light lives here now
- [ ] Root Zone → P and K columns populated
- [ ] Root Zone → EC PLANT UPTAKE renders
- [ ] `secrets.yaml` is **not** in `git status`

---

## 👀 First 48 hours

The defaults are **bench estimates**. Two want your eyes — full detail in
`install-instructions.md` §8.

**First clone sunrise** — smooth fade from black = ramp floor right. A visible
*jump* = floor too high, trim `number.dsc_hub_sf1000_ramp_floor`. Runtime
tunable, no reflash.

**First mat cycles** — `Trends → Root zone vs mat runs vs the band`. Root zone
should live between the dashed lines; blocks long and few. If it tracks the
dotted *air* line, the probe is blind and you're back on v2.3 behaviour.

---

## 🔥 Rollback

```bash
esphome run dsc-hub-v2_3.yaml
```

Restore the backups, restart HA, switch back to the v3 dashboard.

**Rollback is clean for firmware** — v2.4 adds entities rather than renaming
them, so v2.3 finds what it expects.

**One catch:** v2.3 configs reference the **old** secrets. Keep
`secrets.yaml.old-*` until you're confident, or v2.3 won't build.

---

## 📋 Still open — see `notes-comments.md` §7

| Item | Severity |
|---|---|
| Recorder retention — Phase 0 shipped a 120d snippet; **verify it's applied** | 🟡 |
| Scribe triple-reporting — lives in your *existing* entries; retune first | 🟡 |
| POT3 probe swap-test — gates the multi-pot mat sense point | 🟡 |
| `qa_rig.cpp` Suites 1–6 — still assume v2.3 topology | 🟡 Beta gate |

**Three Notion checkboxes are stale** and should be closed:
- `rootzone_temp_entity` — verified correct (`sensor.dsc_pot1_soil_temperature`;
  the pot **sensors** are canonical, only text/select carry legacy prefixes)
- Hub link mismatch — Phase 0's alias closed it
- Clone LED follower — deleted 17 Jul

**And one belongs on the list that never was:** the hub's own secrets. The
housekeeping item named pots and Sonoffs; the hub was never on it, which is how
an unauthenticated OTA endpoint survived on the device that drives every fan,
the SF1000, and all six demand rungs.
