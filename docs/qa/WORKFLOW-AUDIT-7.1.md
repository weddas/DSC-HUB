# Workflow audit — DSC-HUB 7.1 as an operator product

**Date:** 2026-08-27  
**Brain:** `http://192.168.86.48:8787` (`dsc-brain.local`) · `/health` 200 · surface **7.1.0** · expected firmware **7.0.0.0**  
**Not:** `.30` (different MAC; SSH/8787 closed)  
**Scope:** Can a grower finish each real job? Code + live SPA. No destructive writes, no flash, no network apply, no heater/heatmat/fan slams, no second dummy plant.

Sibling audits (do not conflate):

| Doc | Question |
|-----|----------|
| [`DESIGN-AUDIT-7.1.md`](DESIGN-AUDIT-7.1.md) | Does it look like a product? |
| [`INTERACTIVE-AUDIT-7.1.md`](INTERACTIVE-AUDIT-7.1.md) | Does each control behave? |
| **This file** | Can the grower complete the chain? |

**Live fleet (this pass, do not treat as soak-stable):** hub / panel / pot1 / pot2 / pot4 / 4× Sonoffs online on AP `DSC-Brain` (`10.42.0.1/24`). Roster `[]`. pot3 inventory **OOS** (not in `/fleet.pots`). Full Auto **on**, takeover **off**, grow stage **Off**, clone mode **Custom**. Heatmat demand **on**, relay **on** (root 18.4 °C vs want 20–22). SF1000 **on** brightness **1**. Both photoperiod windows **open**. Light debt **15.5 h**. Compose draft leftover from the reverted pot3 demo (see WF2).

---

## Verdict

**Not shippable as a daily operator tool.** Climate glance + appliance auto is a working island (Brain, no HA). Plant lifecycle, pot1 health, firmware, and alert→action are not closed loops. A grower can watch tents and (carefully) drive climate. They cannot trust the landing-page pot strip, cannot safely walk away from Compose after a retire, and cannot update firmware from the product they were sold.

| Closed-loop today | Theater / broken chain |
|-------------------|------------------------|
| Overview T/RH/VPD + fan duties + grow log | Overview P1 moisture (live 21.9%, UI `—`) |
| Appliance demand → Sonoff relay (proven 2026-08-26; heatmat live now) | Settings Queue OTA (sqlite “queued”, no worker) |
| Full Auto / takeover / fan override → hub Native API | Alert chip → playbook **text** (no jump to the control) |
| Add-as-Plant commit+assign + auto-stage + 2×4 hub write (proven once, reverted) | Compose leftover after retire (one click re-seats pot3) |
| `/history` for mapped entities (tent T, pot2, pot1-in-DB) | Settings panel card OFFLINE while `/fleet` panel is up |
| Settings inventory checkbox → `fleet_inventory` | Dual in-service SoT (inventory vs hub pot switches) |
| CannaLib / Ollama **Test** buttons + catalog status | 4×8 “light” = window proxy until GPIO lamp |
| pot3 OOS inventory flag (F-003) | Calibrate Start is live (fans/lamp), not a dry-run |
| Island: SPA + fleet on Pi AP without HA | Learning `/learning` empty; Zigbee list empty |

---

## Top 8 breaks

1. **P0 — P1 moisture hole on Overview.** `/fleet` pot1 `moisture_pct=21.9`, `/history` has a dense 6 h series, Overview Root strip is grey `—`. `ENTITY_FLEET_MAP` has `sensor.dsc_probe1_got_moisture` but not `sensor.dsc_probe1_soil_moisture`; Overview reads `_soil_moisture` only. Pots 2–4 have both keys. Landing page lies about pot1.
2. **P0 — Retire leaves a loaded gun on Compose.** Roster empty, pot3 OOS, hub stage Off/Custom — but helpers still show Northern Lights, nickname `QA Dummy (pot3 test)`, sprout 2026-07-09, **assign pot 3**, tent 2×4. `retire_plant` clears pot helpers + roster row, not the build draft. Confirm dialog will happily write pot3 again.
3. **P0 — Firmware/OTA in the SPA is a ticket stub.** `POST /settings/esphome/jobs` inserts `queued` and tells the operator to open `:6052` or `docker exec`. Live jobs for control + hub still queued from ~05:00Z. Recovery is `flash-*-fallback*.sh` / USB — not a grower workflow.
4. **P1 — Dual in-service truth.** Inventory pot1/2/4 `true`, hub `switch.dsc_hub_potN_in_service` all **off**. Settings checkbox patches inventory. Fleet/Learning toggles are dead on Pi. Mat votes all off while heatmat demand is on. Operator cannot answer “is this pot in the control loop?”
5. **P1 — Settings seat id `control` ≠ fleet `panel`.** Panel is online at `.11` / 7.0.0.0. Settings card is **CONTROL OFFLINE** (`resolveSeat` only matches `"panel"`). pot3 OOS is also shown OFFLINE because it is omitted from `/fleet.pots`.
6. **P1 — Alert → playbook does not hand off.** Inspector shows what/fix prose. No button to Light/Climate/Root except the Capacity-offline banner. Last night’s dark-period lines sit in the grow log as history, not a job.
7. **P1 — Hub-link honesty vs `/fleet`.** Already logged: banner can say HUB LINK DOWN while `hub.online=true`. This pass Overview honesty rail was **Kit honest** and gauges live — the lie is intermittent, so operators still cannot trust the chip.
8. **P1 — `/fleet/computed` ~6 s + hash-nav wedge.** SPA can land on “Connecting to fleet…” (title fallback 7.0.0) after a hash jump. In-app tabs recovered. No error boundary. Daily use from a bookmark is fine; deep-link / CDP / refresh races are not.

---

## Workflows

Priority: **P0** blocks a daily job or can re-arm hardware by accident. **P1** job completable only with tribal knowledge or a second SoT. **P2** polish / missing confirmation that does not strand the grower.

### 1. Land on Overview, understand tent health, jump to a problem

| | |
|--|--|
| **Start** | `http://192.168.86.48:8787/` → `#/live/overview` (default). |
| **Steps** | Read Bands (4×8 / 2×4 / Room + Root). Fan duty chips. Running chips. Root strip. Grow log. Header **Climate** / **Mission**. |
| **Success** | Operator names the worst tent metric and reaches the page that can change it in ≤2 clicks. |
| **Live** | Gauges live: 4×8 ~24 °C / 58–62% / VPD drifting then in-band; 2×4 in-band; Root **18.4 °C amber**; P2 **19.4–19.5% amber**; P1/P3/P4 grey. Fans 9–30%. MAT running. Grow log current (demand + stage). Kit honest. |
| **Breaks** | **P0** P1 moisture hole (see top 8). **P1** amber gauge click opens **history drawer**, not Climate/Root command. Fan chips → Climate (good). Pot name chips → Root (good). Running chips are not buttons (IA-P1-3). **P1** moisture band hardcoded 30–70 vs Root want (FOLLOWUPS). **P1** no critical-alert banner when Root is cold and mat is already on — grower must infer. History drawer leaked onto later routes (Close ×2 still in a11y tree). |
| **Missing confirmation** | n/a (read path). |
| **Dead ends** | P1/P3/P4 “no data” with no “why” (P1 is a map bug; P3 is OOS; P4 is a null probe). |
| **Closed-loop?** | **Partial.** Climate health yes; pot1 and “jump to the actuator” no. |

### 2. Add-as-Plant

| | |
|--|--|
| **Start** | Grow → Compose. |
| **Steps** | Strain → nickname → sprout → vessel/mix → assign pot + tent → **Commit + assign** (DecisionLayer) → `script.dsc_build_plant_commit_and_assign` → roster row + pot helpers → `apply_clone_tent_automation` (hub clone mode / grow stage / hours) if tent is 2×4 and takeover off / hub online. |
| **Success** | Roster shows the plant; pot seat named; Overview/Root show it; hub stage/mode match (proven 2026-08-27, then reverted). |
| **Live (audit only)** | Roster `[]`. Compose **still filled**: Northern Lights, `QA Dummy (pot3 test)`, sprout 2026-07-09, assign **3**, tent **2×4**. Auto-stage chip **not visible**. Nutrient slots **disabled**. Did not commit. |
| **Breaks** | **P0** leftover draft after retire (WF-P0-2). **P1** first-assign during hub reconnect can claim applied while hub still Off/Custom (`apply_clone_tent_automation` now refuses offline + retries — acceptance note). **P1** climate-want uses assign pot, not “Climate apply pot”. **P2** mix/nutrition disabled until catalog pick. |
| **Missing confirmation** | Commit paths have DecisionLayer. Strain pick writes helpers immediately (IA-P1-12). |
| **Dead ends** | Empty roster has no “clear draft” or “you have an unsaved leftover” warning. |
| **Closed-loop?** | **Yes, once** (acceptance #5). **Unsafe to repeat** until draft is cleared on retire. **Theater** if you only look at Compose after revert — it looks like a plant is mid-build. |

### 3. Change sprout date / tent / see auto-stage

| | |
|--|--|
| **Start** | Compose sprout field, or Roster/Root **Plant seat** sprout + tent. |
| **Steps** | Compose: `input_datetime.dsc_build_sprout_date` → computed `sensor.dsc_build_expected_stage`. Seat: blur sprout → `datetime.dsc_potN_sprout_date` → `update_pot_recipe` + `apply_clone_tent_automation`. Tent: `input_select.dsc_potN_tent` → same. `/roster/{seat}` PATCH also derives stage from sprout. |
| **Success** | Day count + stage chip update; 2×4 plants rewrite hub clone mode / grow stage / hours (Mother / 18 h for late veg). |
| **Live** | No seated plant — seat editors have nothing to persist (`update_pot_recipe` raises “No plant on pot”). Compose sprout filled but auto-stage chip absent this pass (`/fleet/computed` lag). |
| **Breaks** | **P1** empty roster is a dead end for the seat path. **P1** auto-stage chip missing on live Compose. **P1** hub write skipped if takeover on or hub offline (honest reason in API; UI does not surface it). |
| **Missing confirmation** | Seat sprout/tent commit on blur, no undo (IA-P1-5). |
| **Dead ends** | Grower with no plant cannot preview auto-stage without filling Compose (and risking commit). |
| **Closed-loop?** | **Code yes, live empty-roster no.** Proven on pot3 demo then reverted. |

### 4. Drive 2×4 vs 4×8 lighting / climate from UI

| | |
|--|--|
| **Start** | Climate (zone chips All / 4×8 / 2×4 / Room), or Live → 4×8 / 2×4 / Light. |
| **Steps** | Set tent targets (`number.dsc_hub_*` vs `clone_*`). Priority tent select. Photoperiod / min dark / clone hours on Light. Fan sliders only with fan override. SF1000 is the **2×4** lamp. 4×8 Got is the **window** until a GPIO lamp exists. |
| **Success** | Changing 2×4 targets does not silently rewrite 4×8; windows and lamp match the intended tent; UI says which tent is priority. |
| **Live (read)** | Priority **2×4 Clone**. Full Auto on. Both windows **open**. SF1000 on @ 1/255. Light debt 15.5 h, delivered ~2.5 h. Grow stage **Off** (4×8 expected hours 0 in older audit; window still open this morning — photoperiod vs stage Off is a honesty gap). Clone 18 h Independent. |
| **Breaks** | **P1** 4×8 light is a window proxy (documented on Light page; still easy to treat as a fixture). **P1** grow stage Off + window open + SF1000 “on” at PWM 1 — three stories. **P0-adjacent** Light SF1000 toggle writes immediately (IA-P0-6); not clicked. Fan sliders live — not moved. |
| **Missing confirmation** | Target numbers / lamp / fans write without DecisionLayer. |
| **Dead ends** | Twin/4×8/2×8 cockpits need a seated pot for seat log (`callWS` history is HA-shaped; on Pi `callWS` is a no-op → empty tent log). |
| **Closed-loop?** | **Climate targets + fans: yes (hub).** **4×8 lighting: theater** until GPIO lamp. **2×4 lamp: closed** if you accept PWM 1 as “on”. **Did not write.** |

### 5. Appliance demand / takeover / full auto

| | |
|--|--|
| **Start** | Climate → Command. |
| **Steps** | Full Auto / Master takeover / Fan override. Demand tiles Heat / Cool / Hum / Dehum / Mat / Mister. Brain `POST /control/demand` or hub switch via `/control/service`. Appliance driver follows hub demand → Sonoff relay. |
| **Success** | Tile on → relay on (one driver tick lag on off, by design). Takeover pauses auto. Full Auto restores ladder. |
| **Live (read)** | Full Auto **on**, takeover **off**. Heat/Hum/Dehum **off**. **Mat on**, heatmat relay **on**. Cool ○ / C-HUM ○ (AC + mister planned OOS). Dehumidifier cooldown ~109 s at first poll. |
| **Breaks** | **P0** one-click writes, no DecisionLayer (IA-P0-1). **P1** uncommitted appliance-driver alias fix (heatmat chatter if clean checkout). **P1** Cool still looks armed when AC is capacity-offline. **Did not toggle heater/heatmat.** |
| **Missing confirmation** | Entire command row. Inspector can toggle the same switches (IA-P0-5). |
| **Dead ends** | None if you already know takeover vs demand vs relay. Grow log shows demand edges, not “relay proved”. |
| **Closed-loop?** | **Yes** (acceptance #1 + live mat). **Unsafe UX** for a daily grower. |

### 6. Calibrate a device (fan CFM / light)

| | |
|--|--|
| **Start** | Fleet → Calibrate (fan / light tabs). Tune → Learning is a second entry (kit toggles + wizard). |
| **Steps** | Fan: pick duct → **Start session** → `script.dsc_cal_start` sets `dsc_cal_active` and is intended to hold fans → enter m/s → save point → brain `device_calibration` + helpers. Light: **sets SF1000 brightness per step** then saves lux/PAR. Abort restores (claimed). |
| **Success** | ≥2 points/duct; Climate CFM uses measured curve; `sensor.dsc_cfm_curves_status` moves off estimate. |
| **Live** | Inspected UI only. **Not dry-run.** Did not Start / Save. `/learning` events `[]`. |
| **Breaks** | **P1** Start is a live hold (IA-P1-13). Light wizard `setLightLevel` is a live lamp write. **P2** no “this will move fans now” beyond honesty copy. |
| **Missing confirmation** | Start / Save / Abort exist; Start is not a DecisionLayer. |
| **Dead ends** | Without an anemometer the wizard still offers Start. Curves stay rated. |
| **Closed-loop?** | **API+UI wired** (acceptance #10–11). **Not a grower-safe dry-run.** Field CFM still gated on hardware (FOLLOWUPS anemometer). |

### 7. Settings: fleet seats, Zigbee, CannaLib/Ollama, network

| | |
|--|--|
| **Start** | Fleet → Settings. |
| **Steps** | Inventory cards + In service checkbox (`PATCH /settings/inventory/{seat}`). Assignment table. Network SSID/PSK/channel + **Apply network** (DecisionLayer → `POST /settings/network/apply`). Integrations URLs + Test. Zigbee Permit join / Stop. Backup export/import. Save settings. |
| **Success** | Seats show IP/fw/uptime/online/in_service that match `/fleet`. Tests return ok. Permit-join flips a real coordinator. Apply is refused unless confirmed — and we did not apply. |
| **Live** | Cards present. Hub + Sonoffs + pot1/2/4 **ONLINE** 7.0.0.0. **CONTROL OFFLINE** (seat_id mismatch). **pot3 OFFLINE** (OOS omitted from fleet pots) with In service **unchecked** (correct OOS). Zigbee devices `[]`; `zigbee_permit_join` setting already `"true"`. CannaLib `remote_api` ok (sample_count **1**, not 5). Ollama URL `192.168.86.2:11434` / `llama3.1:8b`. DHCP map has **no MACs**. Did not Test (would hit LAN services — read-only but skipped). Did not Apply network. |
| **Breaks** | **P0** In service writes immediately, including hub (IA-P0-2). **P1** control vs panel; pot3 OFFLINE vs OOS. **P2** Zigbee permit join has no live countdown / no devices. **P2** assignment Function/Placement empty for whole fleet. |
| **Missing confirmation** | Apply network **has** DecisionLayer. In service / Permit join / Reload catalogs / backup import do not. |
| **Dead ends** | Permit join with empty device list and no coordinator health chip. |
| **Closed-loop?** | **Inventory + integration tests: yes.** **Zigbee: API stub.** **Network apply: armed, unproven this pass.** |

### 8. History / graphs: find a metric, see it update

| | |
|--|--|
| **Start** | Click a gauge (Overview/Climate) → HISTORY drawer; or Tune → Analytics; or inspector timespan. |
| **Steps** | `GET /history?entity_id=&hours=` via `history_ops.ENTITY_METRIC_MAP`. Sparklines on Overview use `useHistory`. Climate `useEntitySeries`. |
| **Success** | Series has points; newest point moves with live; timespan 1h/6h/24h/48h/Cycle/Photo works. |
| **Live** | Tent T: dense 6 h series (~20.0 → 20.7 → live ~24 °C — **history last points were cooler than the live gauge**, so the drawer can look “stuck” vs now if the operator opened an old span). Pot2 moisture: ~19.5 throughout. Pot1 moisture: **history full, Overview gauge empty**. Drawer stayed mounted after leaving Overview. |
| **Breaks** | **P0** P1 gauge vs history split. **P1** drawer leak (IA-P1-1). **P2** unmapped entities return `points: []` with “no history yet” (honest, easy to read as “sensor dead”). |
| **Missing confirmation** | n/a. |
| **Dead ends** | Alert binaries / grow-log lines are not the same store as `/history`. |
| **Closed-loop?** | **Yes for mapped hub + pot2.** **No for Overview P1.** |

### 9. Alerts → playbook / related control

| | |
|--|--|
| **Start** | Overview banner chips (when `ALERT_ENTITY_IDS` are on) or inspector from a chip. Honesty rail gaps. Grow log warnings. Light status chips. |
| **Steps** | Click → `EntityInspector` + `playbookFor` (what / fix). Snooze until reboot. Optional toggle if switch/light. |
| **Success** | Grower reads the cause and lands on the page/control that fixes it. |
| **Live** | No critical banner (alert count 0 / no `binary_sensor.*` in the playbook set on). Honesty **Kit honest**. Grow log still lists last-night **clone dark-period violation** (not a live chip). Light page has a dark-violation chip **when live**. |
| **Breaks** | **P1** playbook `fix` is prose (“Open Light”) not a button — except Capacity offline → Climate. **P1** grow-log warnings are not alerts. **P1** Root 18.4 °C + mat on is not an alert, so the “jump to problem” job skips the actual problem. Inspector toggle is a second demand path (IA-P0-5) — not clicked. |
| **Missing confirmation** | Snooze is one click. |
| **Dead ends** | Banner-empty + grow-log-full. Operator thinks all-clear. |
| **Closed-loop?** | **Catalog exists. Handoff is theater** except one banner. |

### 10. Out-of-service pot / retire plant

| | |
|--|--|
| **Start** | Settings In service; or Compose **Retire pot**; or (intended) Fleet kit toggles. |
| **Steps** | OOS: `PATCH` inventory `in_service`. Retire: `script.dsc_plant_retire` → delete roster seat, clear pot name/stage/tent/sprout, empty roster slot. **Does not flip in_service.** |
| **Success** | Plant gone from roster/Overview; pot3 stays OOS (F-003); no leftover draft; hub stage not left on Mother. |
| **Live** | Roster `[]`. pot3 `in_service=false`. Hub stage Off / clone Custom. **Compose draft still pot3.** Hub pot1–4 in_service switches **off** while inventory pot1/2/4 **on**. pot3 absent from `/fleet.pots`. Did not toggle in_service. |
| **Breaks** | **P0** leftover Compose (WF-P0-2). **P1** dual SoT. **P1** Settings shows pot3 OFFLINE not OOS. **P1** Fleet/Learning in-service toggles dead (IA-P0-4) — only Settings checkbox works. Retire confirm exists; OOS checkbox does not. |
| **Missing confirmation** | Retire has DecisionLayer (“does not change in-service”). OOS does not. |
| **Dead ends** | Grower retires, sees empty roster, returns to Compose, thinks they still have a plant to assign. |
| **Closed-loop?** | **Retire roster: yes. Retire product: no. OOS: inventory only.** pot3 left OOS this pass. |

### 11. Firmware / OTA / flash recovery

| | |
|--|--|
| **Start** | Settings → ESPHome table, or ops scripts on the Pi. |
| **Steps (SPA)** | Queue OTA / Queue compile → `esphome_jobs` row. Copy says one build at a time. |
| **Steps (ops, do not run)** | `services/dsc-hub/pi/flash-sonoff-fallback-remote.sh` (LAN OTA then fallback AP). `flash-hub-fallback-remote.sh`. `flash-sonoff-lan.ps1`. USB for bricks. `island-proof.ps1` / `.sh` after. |
| **Success** | Seat reports `firmware_version` 7.0.0.0; job leaves `queued` → `running` → `done` in UI. |
| **Live** | All in-service seats **7.0.0.0**. Jobs: control + hub **queued** (stale). Detail: open dashboard `:6052` or `docker exec`. FOLLOWUPS: leftover `esphome run dsc-hub.yaml` PID on Pi since Aug 26. Fallback script can hang on `iw scan` (timeout 30 recommended). **Did not queue, did not flash.** |
| **Breaks** | **P0** SPA OTA is theater (WF-P0-3). **P0** Queue OTA has no confirm (IA-P0-3). **P2** Settings “Last seen” column shows firmware string or “offline”, not a job state machine. |
| **Missing confirmation** | Queue OTA / compile. |
| **Dead ends** | Grower clicks Queue, sees JSON `queued`, nothing flashes. |
| **Closed-loop?** | **Fleet truth: yes (read).** **SPA OTA: theater.** **Ops scripts: real, expert-only.** |

### 12. Island proof: HA off, Brain only

| | |
|--|--|
| **Start** | Docs: `docs/DSC-BRAIN.md`, `docs/HA-SCAFFOLD.md`. Script: `services/dsc-hub/pi/island-proof.sh` (health, hub online, pot3 warn, ingest audit, SPA bundle). Operator still confirms Nest/HA automations off. |
| **Steps** | Run island-proof against `:8787`. Confirm fleet on `DSC-Brain` / `10.42.0.x`. Use SPA without HA. |
| **Success** | `/health` ok; hub online; pots+panel+sonoffs on AP; SPA loads; climate/demand work with HA Core off. |
| **Live** | This entire audit used **Brain only** (`:8787`). Hub `wifi_ssid=DSC-Brain`, IPs `.10–.24` / `.50–.55`. `ha_handshake_age=null`. Acceptance signed `verify-brain` + `island-proof` green 2026-08-26. HA is lab soak, not in the path. **Did not power off HA** (out of scope / destructive to house soak). |
| **Breaks** | **P1** island-proof does not assert Sonoff relays or SPA routes — hub online + bundle grep. **P1** Settings/panel seat mismatch makes the island look one-device down. **P2** DHCP reservation still points humans at `.30`. |
| **Missing confirmation** | Script says operator must confirm HA automations off — not automated. |
| **Dead ends** | None for “can I run without HA?” — **yes**. |
| **Closed-loop?** | **Yes as architecture + current fleet.** Proof script is a smoke, not a product QA suite. |

---

## Live inventory (this pass)

| Seat | Inventory in_service | `/fleet` online | Settings card | Notes |
|------|----------------------|-----------------|---------------|--------|
| hub | yes | yes 7.0.0.0 | ONLINE | Full Auto on |
| control / panel | yes | panel yes `.11` | **CONTROL OFFLINE** | seat_id mismatch |
| pot1 | yes | yes, moisture **21.9** | ONLINE | Overview gauge **empty** |
| pot2 | yes | yes, moisture **19.5** | ONLINE | Overview amber |
| pot3 | **no** | omitted from pots | **OFFLINE** | OOS correct; card lie |
| pot4 | yes | yes, moisture **null** | ONLINE | Probe empty (hardware) |
| heater / heatmat / hum / dehum | yes | yes 7.0.0.0 | ONLINE | heatmat relay **on** |

Compose leftover: `compose_helpers_json` still has the pot3 QA dummy. `plant_roster_slots_json` all empty. pot3 left **OOS**.

---

## Shippable-or-not

A grower can **watch** 4×8 / 2×4 / room and see the ladder fire in the grow log. The island Brain is the product path; HA is not required for that glance.

A grower **cannot** yet:

- Trust pot1 on the page they land on.
- Finish a plant and walk away — Compose will offer to put it back on pot3.
- Update firmware from Settings.
- Follow an alert to the switch that fixes it.
- Say which in-service flag the hub is using.

**Ship 7.1 as a climate island + proven demand path. Do not ship 7.1 as a daily grow-ops console** until WF-P0-1..3 are closed. P1s above are the next coherent pass (one SoT for seats, one handoff from alert to control, one retire that actually ends the job).

---

## Method / files read

Live: `/health`, `/fleet`, `/roster`, `/settings`, `/settings/zigbee/devices`, `/settings/network`, `/settings/catalog/status`, `/settings/esphome/devices`, `/settings/esphome/jobs`, `/grow-log`, `/learning`, `/history` (tent T, pot1, pot2). SPA: Overview, Compose, Settings (browser). Climate/Light/Calibrate/Roster traced in source; hash-nav to Climate once bounced the SPA to “Connecting…” then Overview.

Code: `OverviewPage.tsx`, `DashHomeSections.tsx`, `ComposePlant.tsx`, `GrowPages.tsx`, `ClimatePage.tsx`, `LightPage.tsx`, `CalibratePage.tsx`, `SettingsPage.tsx`, `EntityInspector.tsx`, `alertPlaybook.ts`, `entityFleetMap.ts`, `routes.ts`, `useBrain.tsx`, `brain/dsc_brain/{api,compose_ops,control_ops,history_ops,esphome_jobs,computed_ops,fleet_state}.py`, `services/dsc-hub/pi/island-proof.sh`, `docs/DSC-BRAIN.md`, `docs/qa/LIVE-ACCEPTANCE-7.1.md`.

**Did not:** commit, deploy, flash, apply network, toggle heater/heatmat, start cal, create a plant, leave pot3 in service.
