# Plan — The 22 Critical issues (closeout dossier)

**Date:** 2026-09-10
**Source:** DSC-HUB Issue & Recommendation Tracker, `Severity = Critical` (all 22).
**Status split (original):** **2 Open** · **12 Needs Verification** · **8 Fixed & Verified**.
**Status split (after the 2026-09-10 06:30 live sweep):** **2 Open** · **1 Needs Verification (C14, next bake)** · **19 Fixed & Verified**.
**Author:** live-8.2.0 walkthrough

> **Closeout sweep — 2026-09-10 06:30 AEST.** All 12 verifications were run live against the Pi
> (`192.168.86.48`) and the hub. **11 of 12 pass and close.** C13 passed only halfway and needed
> the rest of its own fix spec — see §2 Cluster D. Two notes in the original plan turned out to be
> stale (the SPA re-ship block, and the `.audit/kit-linux-bake.ps1` DSC_RELEASE gap). §3b records
> what the sweep found that was *not* already on the list; §3c has the deploy state.

This is a spec for *closing out* the critical tier — not re-doing work already done. Most criticals have a landed fix; what remains is (a) **2 open items** needing new work, and (b) **12 verifications** to move Needs-Verification → Fixed & Verified. The 8 done are recorded for completeness. Cross-ref the 2026-09-10 fix-pass deploy (Pi, 04:00), which already verified several of these live.

---

## 0. Status table

| # | Issue (short) | Area | Status | Actionable now? |
|---|---|---|---|---|
| 1 | Shipped 8.0.0 SD image has zero-byte kit firmware | Arch | **Open** | **Yes — re-bake** |
| 2 | Dead Modbus probe republishes last reading forever | Honesty | **Open** | **Yes — firmware (Safe=n)** |
| 3 | Pi host no DNS (empty resolv.conf) | Arch | **Fixed & Verified** | Closed 09-10 |
| 4 | SoftAP /24 has no NAT → hub SNTP can't route back | Arch | **Fixed & Verified** | Closed 09-10 |
| 5 | bring-up-eth0.sh exited early → hardening never ran | Arch | **Fixed & Verified** | Closed 09-10 |
| 6 | run_sudo tee leaked password + ExecStop=down wiped stack | Arch | **Fixed & Verified** | Closed 09-10 |
| 7 | SQLite: 16 connect sites / 10 DDL-on-connect, no WAL | Arch | **Fixed & Verified** | Closed 09-10 |
| 8 | Alerts tab left open rebooted the hub (300s API-wedge) | Arch | **Fixed & Verified** | Closed 09-10 |
| 9 | refreshComputed uncoalesced (~17 req/s bursts) | Dash | **Fixed & Verified** | Closed 09-10 — bundle *is* live |
| 10 | Photoperiod anchor unwritable (`lights_on_time` vs `lights-on_time`) | Climate | **Fixed & Verified** | Closed 09-10 |
| 11 | Root steering can never see the lights (5 lookups miss) | Climate | **Fixed & Verified** | Closed 09-10 |
| 12 | Light page shows stored intent as hub truth, honesty=ok | Climate | **Fixed & Verified** | Closed 09-10 |
| 13 | Flat calibration counts as measured_curve → −200 CFM alarm | Calib | **Fixed & Verified** | Half the fix was missing; completed `bcb8a4b` |
| 14 | dsc_fleet_setup won't compile on ESPHome 2026.6.5 | Arch | **Needs-Verify** | Still the only one open on verification — next bake |
| 15–22 | (8 × Fixed & Verified) | — | Done | — |

---

## 1. Open — needs new work (2)

### C1. Shipped 8.0.0 SD image contains zero-byte kit firmware — cannot flash a kit
- **What:** the 2026-09-06 8.0.0 bake wrote empty placeholder `.bin` for every kit role; verified on the Pi all `bridge/control/dehumidifier/heater/heatmat/hub/pot1/pot2.bin` = 0 bytes, `kit-build.json` absent. `bake-firmware.sh`'s `placeholders()` fallback only refuses under `DSC_RELEASE=1`, which the Sep-6 bake didn't set → the documented unbox/USB-flash path is broken for that image.
- **Status:** the *guard* is fixed for future bakes (DSC_RELEASE, hollow-bin abort — see C14), but the **shipped image is still broken**; the row stays Open until a good image exists.
- **Fix spec:**
  1. Re-bake 8.x with `DSC_RELEASE=1` so the empty-bin guard is armed; abort the SD inject if any `firmware/kit/*.bin` is 0 bytes or `kit-build.json` is missing.
  2. **Reuse the live `firmware/v4/secrets.yaml`** (memory: the bake stops OTAing to the fleet otherwise).
  3. ~~Note `.audit/kit-linux-bake.ps1` still doesn't export `DSC_RELEASE=1`~~ — **stale, already fixed.** Verified 2026-09-10: the driver exports it twice (`kit-linux-bake.ps1:99` and `:133`) and its own header names it as footgun #1, landed in `e351829`. `bake-on-linux.sh:72-78` also aborts on empty kit binaries when the flag is set. Nothing to do here.
  4. Archive of the bad image is on the Pi at `/opt/dsc-hub-bake-archive/2026-09-06/` — do not re-ship it.
- **Verify:** flash the new image, run the SPA USB-flash wizard, confirm a kit seat actually flashes; assert every `firmware/kit/*.bin` > 0 bytes at inject time.
- **Effort:** M (a bake + gate), needs the Pi.

### C2. A failed Modbus soil probe republishes its last reading forever — a dead probe looks healthy
- **What:** when a pot node's Modbus soil probe stops responding, the ESPHome sensors **retain and keep publishing the last good values** instead of going `unavailable`. `pot1` served a frozen `19.9% / 48µS / pH 5.0` for ≥24 h, survived a live watering unchanged, and only revealed the truth (`None` on every channel) after a node reboot. An earlier pass was fooled into "the probe recovered."
- **Status:** genuinely open. **Safe-to-fix = n** — it's a **pot-node firmware change requiring a live-seat reflash mid-flower**, the operator's call.
- **Fix spec (firmware/v4 pot node):**
  1. Give each Modbus soil sensor a **staleness/availability gate**: if the Modbus read fails (or the value hasn't changed across N polls while the transaction errors), publish `unavailable` (NaN / the house unavailable convention), don't republish the retained value.
  2. Prefer ESPHome's Modbus `on_error` / a `filters: timeout` so a comms failure marks the sensor stale rather than sticky.
  3. This is the firmware-side complement to the brain's reading-based **dark timer** (already shipped) — the dark timer infers dark from "reading stopped moving/null"; this makes the *device* tell the truth directly so the two agree.
- **Verify:** pull the Modbus probe / power the sensor down on a bench node; the channel must go `unavailable` within the timeout, and the desk must show the honest hole + the dark timer, not a frozen number.
- **Sequencing:** bundle into the **next planned pot-node flash** (never a one-off mid-flower reflash just for this). Related to `plan-pot-probe-model` (trust attaches to the probe).
- **Effort:** S firmware change, but gated on a flash window.

---

## 2. Needs Verification — fix landed, confirm live (12) → **11 closed 2026-09-10, 1 left (C14)**

> These have a committed/claimed fix; each needs one concrete check to close. Group by cluster because several are one incident.

### Cluster A — Fleet-wide time failure (rows 3, 4, 5, 6; symptom row 15 already F&V)
One incident with layered causes, all fixed in `bring-up-eth0.sh` / `pi-bootstrap.sh` / `dsc-hub-fleet-ntp.service` / `dsc-hub-compose.service`:
- **C3 empty resolv.conf** → `nohook resolv.conf` + static `/etc/resolv.conf` (192.168.86.1 / 8.8.8.8 / 1.1.1.1), commit `f4836d1`.
- **C4 SoftAP /24 no NAT** → chrony on the Pi (`allow 10.42.0.0/24`) + `dnsmasq address=/pool.ntp.org/10.42.0.1` so the fleet resolves NTP straight to the Pi + `dsc-hub-fleet-ntp.service` re-arms the udp/123 REDIRECT every boot.
- **C5 bring-up-eth0.sh early-exit** (the reason the above "fixed" rows weren't actually applied on the host) → hardening now runs on both link-state branches; deploy driver streams stderr + judges by exit code, `--warning=no-timestamp` (commit `a627d73`).
- **C6 daemon.json password leak + ExecStop=down** → daemon.json written to `/tmp`, validated with `python3 -m json.tool`, then installed; `dsc-hub-compose.service` ExecStop `down`→`stop` (`6f993a8`).
- **Single verification (after a CLEAN REBOOT — the fixes are boot-persistence fixes, so a reboot is the test):**
  - `chronyc clients` on the Pi lists `10.42.0.10/.11/.21/.22`; the fleet-NTP REDIRECT counter climbs from 0.
  - `/etc/resolv.conf` stays static after a lease renewal; `github.com`/`pypi.org` resolve.
  - `systemctl cat dsc-hub-compose` shows `ExecStop=…stop`.
  - Hub `clock_valid = True`, both photoperiod windows OPEN on the Light desk, no dark-tents symptom.
  - **Note (leave as a separate latent row):** dnsmasq upstream *forwarding* still returns no answers — NTP sidesteps it via `address=`, but other fleet DNS would fail.

- **RESULT — 2026-09-10 06:30 AEST: C3, C4, C5, C6 all PASS. Closed.** The Pi had rebooted at
  ~22:12 on 09-09 (uptime 8 h 18 m), *after* the 20:31 fix-pass deploy — so this is the clean-reboot
  test the check asked for, and every fix survived it.

  | Check | Evidence |
  |---|---|
  | C3 static resolver | `/etc/resolv.conf` = 192.168.86.1 / 8.8.8.8 / 1.1.1.1 with the DSC-HUB header; `dhcpcd.conf:52 nohook resolv.conf`; `github.com` → 4.237.22.38, `pypi.org` resolves |
  | C4 fleet NTP | `chronyc clients` lists **10.42.0.10 / .11 / .21 / .22** *and* 10.42.0.1 (33–60 packets each); REDIRECT counter **132 pkts / 10 032 bytes**, up from 0; `dsc-hub-fleet-ntp.service` enabled + active |
  | C4 chrony serving | `allow 10.42.0.0/24` present — in `/etc/chrony/conf.d/dsc-hub.conf`, not `chrony.conf` (`confdir` include); chrony tracking stratum 4 off time.cloudflare.com, offset 7 µs |
  | C5 hardening ran | `dsc-hub-eth0.service` loaded/active/exited; `net.ipv4.conf.eth0.rp_filter = 2` is applied on the live host — the value the early-exit used to skip |
  | C6 compose unit | `ExecStart=…up -d --remove-orphans`, **`ExecStop=/usr/bin/docker compose stop`**; unit enabled **and active** (it was left inactive after the 09-09 outage — that is now resolved too) |
  | Symptom (row 15) | `binary_sensor.dsc_hub_clock_valid = True`, `hub_clock_epoch` matches wall clock, hub uptime 8.5 h with no reset |

  - **Correction to this plan:** the `dnsmasq address=/pool.ntp.org/10.42.0.1` half was **never installed** —
    `/etc/dnsmasq.d/` holds only its stock README and `NetworkManager/dnsmasq-shared.d/` is empty. The
    udp/123 REDIRECT is doing the whole job on its own, and the four fleet seats are demonstrably
    syncing, so C4 closes on the redirect alone. The latent dnsmasq-forwarding row stands unchanged.
  - **The "both windows OPEN" acceptance line is stale.** It was written when the anchor was 06:00.
    The anchor is now 15:00 (12 h → 15:00–03:00), so at 06:30 both windows reading **closed is correct**.
    Clock validity, not window state, is the real check — and it passes.

### Cluster B — SQLite / flood / hub-reboot (rows 7, 8, 9)
Root cause of the 2026-09-09 hub reboot was **request flooding, not SQLite** (the brain log showed unbroken 200 OK). Two independent fixes:
- **C9 refreshComputed uncoalesced** (the amplifier) → coalesce: if a refresh is in flight, return the in-flight promise instead of chaining (`useBrain.tsx`; commit `f52abac`). **This is the actual outage fix.**
- **C7 SQLite no-WAL / DDL-on-connect** (latent, fixed on its own merits) → `db.py` `open_db()` = WAL + `synchronous=NORMAL` + 5 s busy_timeout, `schema_once()`; all connectors routed through it (commit `3a4755b`). `integrations.py` stays a deliberate read-only URI (WAL on a read-only mount zeroed catalogs on 7.0.0).
- **C8 Alerts-tab-rebooted-the-hub** = the chain of B+the firmware's 300 s API-wedge; closed by C9 (flood) + C7 (contention) + an SPA in-flight guard.
- **Verify (on the Pi):**
  - `PRAGMA journal_mode` on `dsc_ops.sqlite3` → `wal`; `-wal`/`-shm` files appear beside it.
  - Reproduce the old wedge: open the dashboard under load; brain keeps answering `/health` in ~0.02 s, no `database is locked` in `docker logs dsc-hub-brain`, **hub uptime does not reset**.
  - Network tab: `/fleet/computed` no longer bursts at ~17 req/s; one refresh in flight at a time.

- **RESULT — 2026-09-10 06:30: C7, C8, C9 all PASS. Closed.**

  | Check | Evidence |
  |---|---|
  | C7 WAL | `PRAGMA journal_mode` on `/data/dsc_ops.sqlite3` → **`wal`**; `dsc_ops.sqlite3-wal` and `-shm` both present beside it in `/var/lib/dsc-hub/ops/` |
  | C7 contention | **zero** `database is locked` in 24 h of `docker logs dsc-hub-brain`; no errors or tracebacks in the last 6 h |
  | C8/C9 no wedge | `/health` answers in **6.3–6.7 ms** over five consecutive calls; hub uptime 30 602 s (8.5 h) with **no reset**; no `safe_reboot_api_wedge` |
  | C9 coalescing | Both in-flight guards are in `frontend/src/hooks/useBrain.tsx` (`computedInflight` / `fleetInflight`, returning the pending promise) |

  - **Correction: the SPA re-ship is NOT blocking.** `f52abac` landed 09-09 **18:30**; the bundle the Pi
    serves was built 09-09 **19:47**, i.e. after it. Confirmed by content, not timestamps: the string
    `"grow log unavailable"` — introduced by `f52abac` and absent from its parent — is present in the
    live `/app/static/assets/index-P8OANue7.js`. **The coalescing fix is live on the Pi.** C9 closes.

### Cluster C — Lights / photoperiod control path (rows 10, 11, 12)
Three linked defects; the operator sets a schedule, the brain stores it, the push to the hub errors, and the page renders stored intent as device truth:
- **C10 anchor unwritable** — ESPHome slugifies `object_id` from `name:` (`"Lights-On Time"` → `lights-on_time`, hyphen), but `HUB_TIME_ENTITY_TO_OID` maps the underscore `lights_on_time` → every write 503s. **Fix:** map to the hyphen object_id (proven live: writing the correct key moved the hub's real lights-on to 15:00).
- **C11 steering can't see lights** — the 5 `lights_on` lookups in `api.py:656-668` use flat keys that don't exist; the real state is nested at `hub.values['controls']['light.dsc_hub_twin_sf1000']` and `['binaries']['binary_sensor.dsc_hub_4x8_window_open']` (every other module reads these correctly — `api.py` is the outlier). **Fix:** read from `values['controls']`/`['binaries']`; stop asserting `lights_off` as fact when it's "no signal".
- **C12 page shows stored intent as truth** — the `06:00` shown is the brain's `compose_store` helper re-emitted with `{honesty:'ok'}`, not the device's state; with C10 failing the write, the page renders unconfirmed local intent stamped OK. **Fix:** reconcile against the device (publish the hub's lights-on entity and compare); never stamp `honesty:ok` on an unconfirmed local intent.
- **Verify:** from the SPA, set the lights-on anchor → the hub's *real* `lights-on` moves (read it back off the device, not the helper); `GET /control/root-steering` returns `act_allowed:true` during the photoperiod; the Light page shows the device value and flags divergence instead of `honesty:ok`.

- **RESULT — 2026-09-10 06:30: C10, C11, C12 all PASS. Closed.** All three fixes are on master and
  behaving live; the plan listed them without commit hashes, which read as "not landed".

  | Check | Evidence |
  |---|---|
  | C10 anchor writable | `control_ops.py:_hub_time` fans out over **every alias** of the entity (`alias_oids`) and takes whichever the device exposes — it no longer depends on the underscore spelling. Live read-back off the device: `time.dsc_hub_lights_on_time = 15:00:00`, the value the corrected write set. `test_hub_maps_match_firmware_names` pins `lights-on_time` against the firmware YAML |
  | C11 steering sees lights | `api.py:_derive_lights_on` reads `hub.values['controls']` / `['binaries']`, lamp state wins, the window binary is only a fallback. Live: both lamps report `off`, so `root_steering.reason = "lights_off"` is now an **observed fact** (lamp entity answering) rather than the old "no signal" default — correct at 06:30 against a 15:00–03:00 window |
  | C12 no honesty:ok on intent | `computed_ops.py` carries `_LIGHTS_ON_DEVICE_FIRST` + `LIGHTS_ON_SOURCE_KEY`: when the hub publishes the anchor the device wins and the snapshot is stamped `source=hub`; when only the helper exists it is stamped `source=brain`. Live the hub is publishing, so the page renders the device value |

### Cluster D — Calibration honesty (row 13)
- **C13 flat calibration = measured_curve → −200 CFM alarm.** The only gate on `honesty='measured_curve'` is "≥2 non-zero points"; live data was `14.3,14.3,14.3,14.3` (flat) yet stamped measured, producing `flow_net_pressure_cfm = −199.9` and a false under-pressure alarm — "the system is MORE wrong for having been calibrated." **Fix:** require variation (range > ε across duty points) **and** a nameplate sanity band before claiming `measured_curve`; else fall back to `capacity_proxy_nameplate` and say why. `cfm_curves_status` must stop counting flat curves as "good".
- **Verify:** with the flat live calibration, the fan falls back to nameplate with an honest reason; `flow_net_pressure_cfm` is plausible and the −200 alarm clears; `cfm_curves_status` reports the flat curves as uncalibrated. (Pairs with the batch-doc "fan-cal coverage transparency" item.)

- **RESULT — 2026-09-10 06:30: PASSED ONLY HALFWAY. Half the fix spec was never written; now completed
  in `bcb8a4b`. Closed.**

  The spec above asks for two gates — *variation* **and** *a nameplate sanity band*. Only the variation
  gate landed (`_curve_points_usable`: ≥2 positive points, span ≥10 % of the top, monotonic). It
  correctly demoted the flat curves, but **the −200 alarm never cleared — it got worse, −199.9 → −218.5**,
  and `cfm_curves_status` still claimed `1/4 curves`.

  Why: the 2x4 intake calibration reads **5.0 / 7.5 / 8.0 / 9.0 against a 200 CFM nameplate** — a clean
  monotonic rise at **4.5 %** of the fan's rating, so almost certainly an anemometer's m/s, not CFM. It
  sailed through the variation gate, was stamped `measured_curve`, and became the *intake* side of
  `flow_net_pressure_cfm` while the *exhaust* side used nameplate proxy: **5.9 CFM in against 224.4 CFM out.**
  Same bug shape as the flat curve, one layer up — a number that *looks* like a measurement is trusted
  because nothing checks it against the thing it claims to measure.

  Live state at the time of the sweep:

  | Entity | Value | Honesty |
  |---|---|---|
  | `sensor.dsc_cfm_exhaust_out` | 114.4 | `capacity_proxy_nameplate_flat_calibration` ✅ variation gate working |
  | `sensor.dsc_cfm_intake_main` | 0.0 | `capacity_proxy_nameplate_flat_calibration` ✅ |
  | `sensor.dsc_cfm_intake_2x4` | **5.9** | **`measured_curve`** ❌ the miss |
  | `sensor.dsc_cfm_curves_status` | **1/4 curves** | ❌ counting the implausible one |
  | `sensor.dsc_flow_net_pressure_cfm` | **−218.5** | basis `100pct_of_a_side_is_nameplate_proxy` |

- **Fix completed (`bcb8a4b`):**
  1. `_curve_points_usable(points, nameplate)` — a curve's top point must sit within **25 %–150 % of the
     fan's nameplate**, or it is a unit error and the nameplate proxy is the more honest answer.
  2. The proxy fallback now names *which* gate failed (`…_flat_calibration` /
     `…_calibration_implausible_vs_nameplate` / `…_calibration_not_monotonic`) so the calibration screen
     is actionable instead of blanket-vague.
  3. `cfm_curves_status` judges each prefix against **its own fan's** nameplate (`_CAL_PREFIX_PLATE`).
  4. `brain/tests/test_cfm_curve_gate.py` — the gate had **no test at all**, which is exactly how the
     second half went missing. Seven cases pinned on the verbatim live numbers. Full brain suite: 579 pass.

- **Live effect (computed against the Pi's own values):** `intake_2x4` **5.9 → 67.2 CFM**,
  `cfm_curves_status` **1/4 → 0/4**, `flow_net_pressure_cfm` **−218.5 → −157.2** — both sides now
  nameplate proxy, so the subtraction is finally apples-to-apples. **Not yet deployed** (Pi push is the
  operator's call; see §3c).

- **The "−200 alarm clears" acceptance line cannot be met by calibration honesty alone** — see the two
  new rows in §3b. The number is now *honest*; it is still large, because it is a true statement about
  a tent whose exhaust capacity (224.4) genuinely exceeds its intake capacity (67.2).

### Cluster E — Firmware bake (row 14)
- **C14 — the one row still genuinely on verification.** Nothing on the Pi or in the repo can close it; it needs a bake to actually run. It is also C1's blocker, so the two move together.
- **C14 dsc_fleet_setup won't compile on ESPHome 2026.6.5** (blocks all kit bakes) → fixed on master `4d73cfc`/`0b06f58` (declares mac strings, `set_keep_scan_results(true)`, `get_ssid().str()`, ArduinoJson via std::string). **Verify on the next release bake with `DSC_RELEASE=1`:** non-empty kit bins produced, USB-flash wizard can flash the hub SoftAP. (Directly enables C1's re-bake.)

---

## 3. Fixed & Verified — record only (8)

| # | Issue | Closed by |
|---|---|---|
| 15 | Fleet-wide time failure (symptom: 4×8 window closed ~6.4 h early) | NTP synced, hub clock_valid True, windows open (2026-09-10) |
| 16 | Automation rule engine only ticked inside request handlers | `88a4faa` — `start_automation_ticker` every 2 s from lifespan; `docs/brain/CONCURRENCY.md` |
| 17 | growth_stage PATCH rewrote the frozen-at-create snapshot | removed `growth_stage` from the PATCH contract + regression test |
| 18 | Probe-chip click crashed the cockpit (`ReferenceError: probeLabel`) | import `probeLabel` from `seatModel` (`LivePages.tsx`) |
| 19 | F-001 AC / F-002 Mister toggles looked like live controls | `oos` prop on `EntityToggle` (dashed, "On hold", disabled) |
| 20 | Prod bundle circular chunk (`createContext of undefined`) | lazy() twin routes + `vendor-react` manual chunk; **verify prod build on `vite preview` before any Pi hotpatch** |
| 21 | Add-a-Plant probe assignment silently failed while UI showed success | `commitAssign` asserts the script result; throws on mismatch (`093c83b`) |
| 22 | Zigbee safety cut-out could hang forever (asyncio.Lock across loops) | `88a4faa` — `HostLock = threading.Lock` polled async with 30 s timeout |

---

## 3b. What the sweep found that was not on the list (new rows)

Three findings from the 2026-09-10 06:30 sweep that are **not** any of the 22, raised while closing C13.
None is a regression from this pass; all three were sitting under the C13 symptom.

### N1. Every stored fan calibration is ~3–5 % of its fan's nameplate — the capture path is in the wrong units
- **What:** all four live calibrations, against their nameplates: `out` 14.3 / 440 (3.3 %), `intake_main`
  6.8 / 200 (3.4 %), `intake_clone` 9.0 / 200 (4.5 %), `recirc` no points stored. Four independent
  captures landing in the same narrow band is not four bad measurements — it is one systematic unit error
  (an anemometer reporting m/s or m³/min where the store expects CFM), or a capture path that never
  applies a duct-area conversion.
- **Why it matters:** with `bcb8a4b` the system now *correctly refuses* all of them, so
  `cfm_curves_status` reads `0/4 curves` and every airflow number is a nameplate proxy. That is honest,
  but it means **the fan calibration feature has never once produced a usable curve**. The honesty fix
  reveals the problem; it does not solve it.
- **Next:** confirm the capture instrument's unit and the conversion in the cal path, then recalibrate.
  Cheap check — a 200 CFM fan at 100 % should read ~120–200 CFM at the duct, not 9.
- **Severity:** High. **Safe-to-fix:** needs the operator + the instrument; not a code-only fix.

### N2. `flow_net_pressure_cfm` and `mass_balance_ok` treat a deliberately negative-pressure tent as a fault
- **What:** `mass_balance_ok` trips whenever `|intake_capacity − exhaust_capacity|` exceeds
  `max(5 CFM, 5 %)`. A carbon-filtered grow tent is *supposed* to run exhaust-dominant — negative pressure
  is the design intent, not an imbalance. Post-fix the honest numbers are intake 67.2 vs exhaust 224.4,
  so the flag still reads `off` and always will while the fans are configured this way.
- **Also:** both entities compare **capacities** (nameplate × duty), never measured flow, yet publish a
  single hard CFM number. `flow_net_pressure_cfm` already labels its basis
  (`100pct_of_a_side_is_nameplate_proxy`) — the alarm built on top of it does not read that label.
- **This is why C13's "the −200 alarm clears" acceptance line could not be met** by calibration honesty
  alone, and it should not have been written as a C13 criterion.
- **Next:** either give the flag a signed target band (expected negative pressure) instead of
  `abs()`, or suppress it when either side's basis is a proxy — §4.3's rule applied to alarms:
  *never raise an alarm on a basis you have already labelled untrustworthy.*
- **Severity:** Medium. **Safe-to-fix:** y (brain-side, `computed_ops.py`).

### N3. The curve gate shipped with no test — the reason half of C13 went missing
- **What:** `_curve_points_usable` had **zero** test coverage before `bcb8a4b`. The C13 fix landed,
  looked right, and nothing checked the second half of its own spec against real numbers.
- **Now:** `brain/tests/test_cfm_curve_gate.py`, seven cases on the verbatim live values.
- **Systemic read:** this belongs with §4.1. An honesty gate is exactly the kind of code whose bugs are
  silent — it fails by *approving*, and approval looks like success. Honesty gates should be
  test-required, the same way §4.3 wants the honesty invariant lint-enforced.
- **Severity:** Low (process). **Status:** closed by this pass.

---

## 3c. Deploy state

Everything verified above is **already live on the Pi** — nothing in Clusters A/B/C needed a push.
The one thing this pass changed, `bcb8a4b` (C13's nameplate band), is **committed to master but not
deployed**; the Pi still computes `intake_2x4 = 5.9 / measured_curve` and `1/4 curves` until the brain
is re-shipped. It is brain-side Python only — no SPA rebuild, so the standing `vite preview` chunk-graph
rule does not apply. The push is the operator's call.

---

## 4. Cross-cutting themes (worth a systemic guard)

1. **"Stability treated as correctness"** — C2 (frozen probe), C13 (flat curve = measured), and the earlier stuck-detector rows are the same bug shape: a value that stops moving is read as valid. A general **"has this actually changed / is the source live"** gate (the dark-timer generalised) would kill the class. Ties to `plan-entity-resolution-ssot` (one resolver) and the reading-trust layer.
2. **Container-vs-host blindness** — the fleet-time cluster, the journalctl message, and the Docker-IP-as-LAN finding all stem from the brain reasoning about host facts from inside a container. A **host-side helper contract** (the `log_cmd_brain` pattern) would close all of them.
3. **Honesty stamped on unconfirmed intent** — C12 (`honesty:ok` on stored lights-on) is the headline; the rule is **never stamp OK on a value not reconciled against the device**. Should be a lint/test-level invariant.
4. **Verify prod builds before a Pi hotpatch** — C20's circular-chunk bug shipped because the dev server never chunks. The `vite preview` chunk-graph check is now the standing rule (memory).

## 5. Bottom line (rewritten after the 2026-09-10 06:30 sweep)

- **19 of 22 are closed.** Eleven of the twelve verifications passed on the first check; C13 passed only
  halfway and is closed by `bcb8a4b`.
- **1 still on verification: C14**, and only because it needs a bake to actually run. It is C1's blocker.
- **2 still need new work, both operator-gated and unchanged:**
  - **C1** — re-bake a good SD image. Every code-side guard it depends on is now confirmed in place
    (`DSC_RELEASE=1` exported by the driver, `bake-on-linux.sh` aborts on hollow bins). Needs the Pi and
    the live `firmware/v4/secrets.yaml`.
  - **C2** — pot-node Modbus staleness gate. **Safe-to-fix = n**, bundled into the next planned flash
    window, never a one-off mid-flower reflash.
- **3 new rows raised** (§3b): N1 the calibration unit error (High — the honest consequence of closing
  C13 is that no fan curve has ever been usable), N2 the pressure alarm's `abs()` semantics, N3 the
  missing test class.
- **One correction worth carrying forward:** two "blocked" notes in the original plan were stale — the
  SPA re-ship (the coalescing bundle *is* live, proven by content) and the bake driver's `DSC_RELEASE`
  gap (fixed in `e351829`). Both had been fixed and neither had been re-checked. Re-read a blocker
  before planning around it.
- The remaining risk after those close is **systemic** (§4), best handled by the four deep specs already written (`plan-entity-resolution-ssot`, `plan-pot-probe-model`, `plan-irrigation-loop`, `plan-flood-resilience`), not by more point fixes.
