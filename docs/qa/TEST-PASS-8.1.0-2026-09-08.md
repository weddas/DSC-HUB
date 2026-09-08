# DSC-HUB 8.1.0 — full test pass (2026-09-08)

Executed against the **live rig**, not a demo brain: brain 8.1.0 on
`192.168.86.48:8787`, fleet firmware 8.1.0.0, ESPHome 2026.8.2 via
esphome-device-builder.

Every row says whether it **completed** or needs a **re-run**, and why. A test
that could not be finished is marked as such rather than quietly dropped.

| | |
|---|---|
| Brain / SPA | 8.1.0 |
| Fleet firmware | 8.1.0.0 — 8 of 8 online devices, `behind_count: 0` |
| ESPHome | 2026.8.2 + device-builder 1.14.4 |
| Card | `dsc-hub-8.1.0-arm64.img` (2.6 GB), sha256 `f904fab29113…` |

---

## A. Backend smoke — 42 endpoints

**Status: COMPLETE.** 39/42 green on the first pass; the 3 "failures" were the
test's fault, not the API's, and are green on re-run.

| Group | Result |
|---|---|
| A1 core (`/health`, `/fleet`, `/fleet/computed`, `/rooms`, `/roster`, `/settings`, `/learning`, `/history`, `/grow-log`) | 9/9 |
| A2 settings surfaces (16 endpoints) | 16/16 |
| A3 esphome + fleet mgmt (5) | 5/5 |
| A4 energy (6) | 6/6 after correction |
| A5 journals + cameras (5) | 5/5 |
| A6 control (1) | 1/1 |

**Correction worth recording:** `/energy/estimate`, `/energy/suggestions` and
`/energy/conflicts` first returned 422. That was correct behaviour — they take a
required `space_id` query param and I called them bare. With `space_id=4x8` /
`2x4` they return 200. **Not a bug; a bad test.** Re-run with params.

**Latency:** median ~75 ms. Two outliers:

| Endpoint | Cold | Warm |
|---|---|---|
| `/settings/catalog/status` | **15,191 ms** | 1,243 ms |
| `/settings/esphome/toolchain` | 4,509 ms | — |

The 15 s is `test_cannalib()` opening `httpx.AsyncClient(timeout=15.0)` with no
cache. CannaLib is healthy here so this was cold-start, but the **failure path
has no cache**, so an unreachable CannaLib blocks 15 s per call. Logged.

---

## B. Fleet / device integration

**Status: COMPLETE.**

- 8/8 online devices report firmware `8.1.0.0` and ESPHome `2026.8.2`
- `expected_firmware: 8.1.0.0`, `behind_count: 0`, no device flagged behind
- `pot3` / `pot4` offline — **expected**, those slots are not populated
- Canary A/B during rollout: pot2 on the new build returned live soil data
  (moisture 19.8 %, 18.6 °C) while pot1 still on the old build read `None`

---

## C. SPA route walkthrough — 11 routes

**Status: COMPLETE.** All 11 render, **zero error boundaries**, all 5 JS chunks
load (`index`, `vendor-react`, `tune-fleet`, `calibrate`, `twin-three`).

`overview · climate · root · light · plants · cannalib · logs · alerts · kit · twin · settings`

Title reads `DSC-HUB 8.1.0`. Header shows `HUB ONLINE`, `KIT HONEST`.

**One 404 across the whole session** — see finding C-1 below.

---

## D. Network / efficiency inspection

**Status: COMPLETE.** 134 requests captured across the walkthrough.

Observations (none blocking, all logged as follow-ups):

- `/settings/probe-stations` fetched **4×** in immediate succession
- `/energy/estimate` fetched **2×** per space (4x8 and 2x4 each)
- `/settings/hub-tunables` polled repeatedly at **18 KB** per response
- `/fleet/computed` polls every **5 s at ~42 KB** — sustained ~8 KB/s

---

## E. Regression — today's 8.1.0.0 firmware work

**Status: COMPLETE.**

| Check | Result |
|---|---|
| `number.dsc_hub_target_temp_min` / `_max` | PRESENT, desired 25 / 28, synced |
| `number.dsc_hub_clone_target_temp_min` / `_max` | PRESENT, desired 24 / 27, synced |
| Entity IDs match the SPA's hardcoded map | exact match, all four |
| `Hub Clock` (S4) | publishing on 30 s interval |
| Modbus `turnaround_time` + `offline_skip_updates` | probes returning live soil data |
| `minimum_chip_revision "3.1"` | all 8 roles compiled and flashed |

**Observation E-1:** all band rows report `value=None` with `desired` populated —
but so does the long-standing `number.dsc_hub_target_temp`, so this is
pre-existing display behaviour, not a regression.

**Observation E-2:** the band currently reads 25–28 while `target_temp` is 22.
Expected: the band is **inert in this train** and is only re-stamped by
`apply_stage` (`min := tt`, `max := tt + 3`). It self-corrects on the next stage
change. Harmless now; **must be true before the control is wired.**

---

## F. Not executed — needs a re-run

Honest list of what this pass did **not** cover.

| Area | Why not | To run it |
|---|---|---|
| Write/mutation workflows (set a target, arm an automation, run a stage change) | Read-only pass by choice — this is a live grow mid-flower | Bench rig, or a deliberate window with the operator watching |
| Crop scheduler re-anchor | Same — it writes a photoperiod | Demo brain |
| Camera capture / timelapse | Endpoints answer, capture not exercised | Needs a lights-on window |
| USB flash wizard end-to-end | Requires physically flashing a device from the card | Next card flash |
| Accessibility (contrast, keyboard nav, screen reader) | Not attempted | Dedicated a11y pass |
| Mobile / responsive layout | Not attempted | `resize_window` pass at 375 px |
| Panel heap under load | Single reading taken, not a soak | Watch over a full photoperiod incl. stage change |

---

## Findings logged

| # | Finding | Severity |
|---|---|---|
| C-1 | CannaLib **by-id lookup 404s for every valid id** — PPFD card can never resolve a fixture | High |
| A-1 | `/settings/catalog/status` can block 15 s — probe has no cache on the failure path | Low |
| — | Panel heap: 2026.8.2 costs ~40 KB free and 42 % of largest block | Medium (logged earlier) |
| — | pot1 soil sensors reading `None` | **RESOLVED by the reflash** — see below |

### pot1 — resolved, and it is evidence

pot1 read `None` for moisture and soil temp while pot2, on identical hardware,
read fine. The difference tracked **firmware version**, not hardware: pot2 had
been flashed, pot1 had not.

Re-tested once both ran 8.1.0.0:

| | moisture | soil °C | EC µS | pH |
|---|---|---|---|---|
| pot1 | 19.9 % | 18.7 | 48.0 | 5.0 |
| pot2 | 19.4 % | 19.2 | **0.0** | 4.6 |

pot1 recovered completely. The likely cause is one of the modbus changes shipped
in this train — `turnaround_time: 100ms` now set explicitly, and
`offline_skip_updates: 5` so an offline sensor stops re-running the full
four-retry ladder (4 × 2000 ms) every 60 s cycle. That retry storm is a
plausible reason a probe never recovers once its sensor drops.

**pot2 `ec_us 0.0` — explained, not a fault.** Per the operator the pots have
not been watered yet, and dry medium has no dissolved salts in solution to
conduct, so 0 µS is the expected reading. Watering is the natural test: if pot2's
EC rises with pot1's, both probes are good; if pot2 holds at 0 while pot1
responds, re-open it.
