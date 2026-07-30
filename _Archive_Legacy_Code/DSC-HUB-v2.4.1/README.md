# DSC-HUB v2.4.1 — Full Update Package

**Everything, in the order it has to happen.** Start here, not with the other docs.

**Firmware:** `2.4.1-alpha` · **Built:** 2026-07-19
**Verification:** `esphome config` clean (hub arduino + pots esp-idf, ESPHome
2026.6.5) · QA rig **24.29 M checks, 0 violations** (nine suites)

---

## ⚡ v2.4.1 in one paragraph

Three control defects from the **19 Jul incident** fixed in the hub firmware —
the AC could fire before the fans ever tried (fans-first is now an enforced
gate), the humidifier rungs were blind to VPD (now VPD-aware with no-war
guards), and the closed-loop mat sensed POT1 only so a cold POT4 was invisible
(now all four pots through a plausibility filter, plus a hot-runaway guard that
cuts the mat and flushes the 2×4 with the fans). Plus: the Manual Light Hold
latch was dead while the schedule was armed (fixed), the hub no longer
self-reboots on HA outages, ~80% less steady-state API chatter, and **ESP-NOW
pot→hub links are LIVE** — the mat's sense loop now survives HA restarts.
Details: `changelog.md` (v2.4.1 section) and `dsc-hub-v2_4_1-fix-notes.md`.

> If you're coming from a deployed v2.4: this is a **hub + pots re-flash and a
> dashboard/automations paste** — no Sonoff changes, no entity renames, one new
> secret (`espnow_key`). See `install-instructions.md` §0–§5 (v2.4.1 section).

> If you're still on v2.3: do the full v2.4 sequence below first — it all still
> applies — just flash `dsc-hub-v2_4_1.yaml` instead of the old hub file.

---

## ⚠️ Read this before you touch anything

Two things will bite you if you skip them.

### 1. The v2.4 secrets rotation still stands

The old hub/node keys are **burned** — they've been through chat and upload logs.
If you haven't rotated yet, `generate-secrets.sh` does all 9 devices (and now
seeds `espnow_key` for the ESP-NOW link). New keys are compiled in, so every
device gets re-flashed. There's no partial version.

### 2. 🔴 Rotating an OTA password over OTA is chicken-and-egg

The uploader authenticates with the **new** password against a device still
running the **old** one. It fails. The rule:

| Device's *current* OTA password | Re-flash route |
|---|---|
| **None** | ✅ OTA works — nothing to authenticate against |
| **Exists, and you're changing it** | 🔌 **USB/serial required, once** |

If you already deployed v2.4 (keys rotated, OTA passwords in place) this doesn't
bite again — v2.4.1 re-flashes authenticate with the passwords you already have.

---

## 📁 What's in here

```
DSC-HUB-v2.4.1/
├── README.md                    ← you are here
├── install-instructions.md      ← v2.4.1 flash guide + full v2.4 walkthrough
├── changelog.md                 ← v2.4.1 + v2.4, what changed and why
├── notes-comments.md            ← design rationale + honest open list (+§11)
├── dsc-hub-v2_4_1-fix-notes.md  ← the 19 Jul incident analysis, fix by fix
├── .gitignore                   ← the first line matters more than the rest
│
├── esphome/                     → copy FLAT into /config/esphome/
│   ├── generate-secrets.sh      ← run FIRST (if not already rotated)
│   ├── dsc-hub-v2_4_1.yaml      ← NEW — replaces dsc-hub-v2_4.yaml
│   ├── dsc-pot-common.yaml      ← UPDATED (v2.4.1: ESP-NOW provider live)
│   ├── dsc-pot1..4.yaml         ← unchanged stubs
│   └── dsc-sonoff-common.yaml   + dsc-heater / heatmat / humidifier /
│                                  de-humidifier — unchanged from v2.4
│
├── homeassistant/
│   ├── packages/dsc-v24-light-helpers.yaml    → /config/packages/ (unchanged)
│   ├── automations.yaml                       → merge (Rev B + v2.4.1 guards)
│   └── dashboards/dsc-hub-v2_4-dashboard.yaml → paste via Raw config editor
│                                                (v2.4.1: ESP-NOW link chips)
│
└── qa/
    ├── qa_rig_v241.cpp          ← NEW — nine suites, 24.3M checks
    ├── extract_bodies.py        ← re-extracts the lambdas from the hub YAML
    ├── climate_body.cpp / photo_body.cpp / clonephoto_body.cpp  (generated)
    ├── qa_alpha.cpp             ← v2.4 alpha harness (superseded, kept)
    └── README.md                ← how to run the rig
```

> **`esphome/` is deliberately flat.** ESPHome resolves `secrets.yaml` **only
> from the config file's own directory** — never the parent. A `nodes/`
> subfolder would force you to duplicate secrets into it, which defeats the
> entire point. Verified, not assumed.

---

## 🔢 The sequence (from a deployed v2.4)

Roughly **40 min**. The hub flash is safe mid-grow (NVS tuning survives; fans
resume within seconds of boot).

| # | Step | Time |
|---|---|---|
| 0 | Back up (see v2.4 §0 below — same drill) | 5 min |
| 1 | Add `espnow_key` to secrets on hub + 4 pots (same value) | 2 min |
| 2 | Lock the router's 2.4 GHz channel (not Auto) | 2 min |
| 3 | Flash hub: `esphome run dsc-hub-v2_4_1.yaml` | 10 min |
| 4 | Flash pots — POT2 canary first, then 1/3/4 | 15 min |
| 5 | Automations reload + dashboard paste | 5 min |
| 6 | §5 post-flash sanity checks (install-instructions) | 10 min |

**Verify after the hub flash:**

- [ ] `sensor.dsc_hub_firmware_version` = **`2.4.1-alpha`**
- [ ] the four `binary_sensor.dsc_hub_potN_esp_now_link` entities exist
- [ ] `binary_sensor.dsc_hub_root_zone_sensor_fault` = off (HA path carries it
      until the pots flash)
- [ ] tuned values (mat band, hysteresis, ramp floor) survived — they're NVS

**Verify after each pot flash:**

- [ ] its `potN_esp_now_link` turns ON within ~2 min
- [ ] its `sensor.dsc_potN_soil_*` entities still update in HA

**The one live test worth doing:** restart HA and watch `Grow Mat Demand` — it
must not blink. That's the ESP-NOW link doing its job.

---

## ✅ Done when

- [ ] Firmware string `2.4.1-alpha`
- [ ] All four ESP-NOW link sensors ON
- [ ] HA restart no longer perturbs the mat
- [ ] A hot spell shows fans ramping BEFORE any AC demand (log: `fans
      saturated` / `fans useless`)
- [ ] A VPD-over-ceiling spell fires the humidifier (log shows both numbers)
- [ ] Moving the SF1000 slider mid-window latches `Manual Light Hold`
- [ ] `secrets.yaml` is **not** in `git status`

---

## 👀 First 48 hours

The v2.4 watch-list still applies (first sunrise ramp floor, first mat cycles —
`install-instructions.md` §10). New for v2.4.1: watch one full evening
transition and confirm the ladder log lines now name both RH *and* VPD with
their thresholds — that's your evidence the 19 Jul class of silence is gone.

---

## 🔥 Rollback

```bash
esphome run dsc-hub-v2_4.yaml     # the v2.4 hub file — keep it around
```

Pots: the v2.4 `dsc-pot-common.yaml` (ESP-NOW parked) reverts the sender half.
No entity renames in v2.4.1, so dashboards and automations don't care which hub
firmware is running.

---

## 📋 Still open — see `notes-comments.md` §8

| Item | Severity |
|---|---|
| Recorder retention — verify the 120 d snippet is applied | 🟡 |
| Scribe triple-reporting + threshold-guard pass on old alerts | 🟡 |
| POT3 probe swap-test (no longer blocks anything — still fix it) | 🟡 |
| Fan airflow calibration (anemometer sweep) | 🟢 |
| PAR/lux sensor in the 2×4 dark period | 🟢 |
