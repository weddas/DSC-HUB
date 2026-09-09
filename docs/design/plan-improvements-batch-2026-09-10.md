# Plan — Improvement batch specs (2026-09-10 walkthrough)

Dev-ready specs for the improvement/extension ideas from the live 8.2.0 walkthrough, grouped by theme. Each names the existing feature it builds on (grounded during the walkthrough), a concrete design, key edge cases, the surfaces it touches, and a rough effort. The three biggest live in their own docs: `plan-harvest-window-*.md`, `plan-estimated-dli-*.md`, `plan-unified-want-editor-*.md`.

Cross-cutting principle observed on this rig: **compute derived state once in the brain and let every surface read it** — the Want-band drift and the pH/CO2 mis-labels all came from per-view recomputation or ungated raw values. Every spec below follows that rule and the app's honesty convention (`—` + reason over a fabricated number).

---

## A. Alerts & automation

### A1. Probe-dark alert (off the reading-based dark timer)
- **Problem:** the dark timer (built this cycle) shows `DARK 24H 47M` on the Runtz Punch probe — a live D62 flowering plant with no soil data for >1 day — but only as a chip; no alert fires. The catalogue's "Root-zone probes" alert is about heat-mat reliance, not a plant losing its probe.
- **Grounding:** `binary_sensor.dsc_probe<n>_reading_dark` already exposes `dark_since` / `dark_for_s` (verified in `/fleet/computed`: `probe1 dark_since 1788879194`).
- **Design:** add a catalogue alert **"Probe dark"** in Settings › Alerts, keyed off `dark_for_s > threshold` (operator-set, default 2–6 h), default severity WARN. Per-probe. Uses the existing alert delivery (toast/tone/quiet-hours).
- **Edges:** OOS probe → no alert; probe intended-idle (mobile station at home) → suppress or separate copy; debounce so a brief null doesn't page.
- **Surfaces:** Settings › Alerts catalogue; Alerts desk; Overview mission line. **Effort:** S.

### A2. Starter automation rule templates
- **Problem:** Settings › Automation shows "No rules yet" and Add-rule opens a blank compound-condition form (entity datalist + operator + value + action). High barrier.
- **Grounding:** builder verified — entity datalist (49 entities), operators (`> < ≥ ≤ is …`), actions (Raise banner / Seat OOS / Zigbee / Tuya / Hold relay / Move setpoint), severity.
- **Design:** ship one-click templates that pre-fill the builder for editing: "Probe dark > 4h → banner", "Tent temp > 30 °C → critical banner", "RH > 65% while dehumidifier idle → warn", "VPD out of band > 2h → warn". A "Templates" strip above the empty state.
- **Edges:** templates must reference only entities present on this kit; a template whose entity is absent is greyed with why. **Surfaces:** Settings › Automation. **Effort:** S.

### A3. Away / vacation mode
- **Problem:** per-alert severity + quiet hours exist, but no single "I'm away" switch.
- **Design:** an Away toggle that (a) mutes toast/tone below CRITICAL, (b) optionally raises debounce so transients don't page, (c) shows "AWAY since <date>" on Overview, (d) still logs everything. Never touches the emergency failsafe.
- **Edges:** must not suppress failsafe/critical; auto-clear prompt on return. **Surfaces:** Settings › Alerts (delivery) + Overview. **Effort:** S–M.

### A4. Alerts desk filtering / grouping
- **Problem:** the 24h history is dominated by HUB demand churn + repeated zigbee-CLEAR NOTEs + restart advisories; real ALERTs are buried. Logs has "Hide system rows"; the Alerts desk has no filter.
- **Design:** severity filter (ALERT/HUB/NOTE), a "collapse repeats across restarts" toggle (the dedupe already does adjacent `×N`), and a default that de-emphasises routine demand toggles.
- **Edges:** collapsing must not hide distinct events that merely share text. **Surfaces:** Alerts desk. **Effort:** S. **Pairs with** the two Alerts bug rows (advisory-as-ALERT, zigbee jargon).

---

## B. Irrigation / root

### B1. Predicted next-feed ETA
- **Problem:** each Root probe card shows `next feed —` (blank) though the steering computes the live dry-back rate (Probe 2: `-6.06 %/h`) and the P1–P3 / VWC targets are set.
- **Design (brain):** `next_feed_eta = (current_vwc − trigger_vwc) / dryback_rate`; expose per probe; label "projected". Works with no pump bound.
- **Edges:** rising/flat VWC (no valid ETA) → `—`; dark probe → `—`; clamp absurd ETAs. **Surfaces:** Root probe card. **Effort:** S. **Pairs with** B2.

### B2. Dry-run shot-plan preview (no pump bound)
- **Problem:** Root honestly withholds the shot editor when no pump is bound, but the steering still computes dry-back + phase — the intelligence is invisible.
- **Design:** render a **read-only** "would-be shot plan" (target VWC, next shot size/time, phase P1–P3), tagged "preview — no pump bound, nothing is actuated".
- **Edges:** never expose an actuation control in preview; make the "bind a pump" CTA obvious. **Surfaces:** Root Shots/Irrigation section. **Effort:** M.

### B3. Reservoir / feed management
- **Problem:** the tank seat is a thin OOS card (`LEVEL NOT MEASURED · PUMP OFF · EC — / pH — / T —`); Settings › Root already defines an EC target (2.2 mS/cm).
- **Design:** when the tank is in service with a level/EC/pH probe bound: feed EC/pH vs target with dosing hints ("feed EC below target — add nutrients"), a level gauge, a low-level reminder; tie into the shot planner.
- **Edges:** all honest holes when no probe bound; dosing hints are guidance, never auto-dose. **Surfaces:** Kit tank card + Root. **Effort:** M–L.

---

## C. Metrics honesty & coverage

### C1. Surface "climate debt" like the Light deviation
- **Problem:** the Light desk shows "DEVIATION TODAY −7.85h"; the hub already computes the climate equivalent (`vpd_main_band_debt_hours = 18.0`, `light_debt_hours`) but desks only show "in band Xh of 24h".
- **Design:** surface the existing band-debt as a "debt today" chip on Climate/Overview VPD (and temp/RH) cards, consistent with Light.
- **Edges:** **first verify the debt counters actually advance** — main+clone both read exactly `18.0`, which may be capped/stuck (check before shipping). **Surfaces:** Climate/Overview cards. **Effort:** S (+ a brain check).

### C2. Fan-curve calibration coverage transparency
- **Problem:** only `CURVES 1/4` are measured — 3 of 4 fans report nameplate (`fan % × rating`) but the CFM numbers don't say so; this is the root of the tracked "−200 CFM under-pressure alarm from a flat calibration" class.
- **Design:** badge uncalibrated fan CFM as "est (nameplate)" vs "measured"; show an "X of 4 fan curves measured" coverage chip linking to Calibrate.
- **Surfaces:** Climate equipment fan tiles + Overview fan-duty card. **Effort:** S.

### C3. Consolidate the two CFM calibration surfaces
- **Problem:** Kit › Learning and Fleet › Calibrate edit the **same** `input_number.dsc_cal_*` / `script.dsc_cal_*` helpers; the app warns "pick one surface per fan session". Two editors over one state = footgun.
- **Design:** make Calibrate the single canonical flow; render Learning's overlapping controls read-only (or remove), linking to Calibrate. (Same one-canonical-editor pattern as the Want editor.)
- **Surfaces:** Kit › Learning, Fleet › Calibrate. **Effort:** S–M.

### C4. Real energy from Tuya plug power vs nameplate
- **Problem:** the Light energy card is nameplate × hours × tariff ("not a bill"); the Tuya lane (T1) is landed and the operator has metering plugs.
- **Design:** when a power-metering plug is bound to a fixture/appliance, use its reported W for that device's energy line, labelled "measured" vs "estimate"; nameplate stays the fallback. Also validates the learned appliance/fan curves.
- **Edges:** plug offline → fall back to estimate with a note; sum per-zone. **Surfaces:** Light/Climate energy cards. **Effort:** M.

---

## D. Analytics & records

### D1. Operator event annotations on charts
- **Problem:** charts already draw `lights off` / `stage change` / `alert` markers, but the operator can't add their own (watered, defoliated, feed change).
- **Design:** render existing plant/tent journal entries (timestamped) as an optional marker layer on the matching charts; add a "mark event now" affordance that writes a journal note.
- **Edges:** marker density limiting; per-scope filtering. **Surfaces:** all chart drawers + Root substrate chart. **Effort:** M. **Reuses** the existing marker layer + journals.

### D2. Cross-run comparison / harvest report
- **Problem:** grow records freeze a plant's whole cycle on retire, and Logs compares scopes **within** a run — nothing compares **this run vs a past run**.
- **Design:** a "compare with a past grow record" mode in Logs › Trends (overlay VPD/DLI/dry-back curves, days-to-finish), and a per-run **harvest report** (achieved bands, deviations, actual vs the strain's `flowering_days`). Feeds off the harvest-window feature's expected-vs-actual.
- **Edges:** aligning runs of different lengths (align on flip, not calendar); missing metrics in older records. **Surfaces:** Logs + System › Grow records. **Effort:** L.

---

## E. Navigation & operator QOL

### E1. Global command palette
- **Problem:** Settings has "Find a setting"; there's no global jump.
- **Design:** Cmd/Ctrl-K palette searching desks / settings / devices / plants / alerts, deep-linking with the right scope params. Promote the existing settings search into it. **Effort:** M.

### E2. Mobile bottom-nav: promote Root & Light
- **Problem:** mobile bottom bar is Overview/Climate/Plants/Alerts/More; Root and Light (core grow desks) are under "More".
- **Design:** promote Root & Light into the bar, or make the four quick-slots operator-configurable in Preferences. **Surfaces:** mobile shell. **Effort:** S.

### E3. Wall / kiosk glance mode
- **Problem:** Preferences already has a 125% "wall display" scale + AUTO density, but no dedicated kiosk view; an idle open desk is also the flood-tab reboot risk.
- **Design:** a `#/kiosk` route — large read-only cards, auto-rotating zone vitals (T/RH/VPD, light state, probe/dark, active alerts), wake-lock, no polling storms, tap-to-exit. **Effort:** M.

### E4. Scheduled auto-backup to the NAS
- **Problem:** System backup is manual "Download backup" only; 45 days of history + journals live on a USB SSD.
- **Design:** optional nightly auto-backup to a NAS target (SMB/rsync) with retention count and last-success/last-error chip; reuse the existing backup bundler. **Surfaces:** Settings › System › Backup. **Effort:** M.

### E5. OTA flashes timed to the dark period
- **Problem:** OTA is queued and applied whenever; flashing reboots a node, disturbing a live photoperiod.
- **Design:** a queue option "apply at the next dark period for this seat's tent", using the photoperiod schedule the Light desk already knows. **Surfaces:** Settings › Devices › Firmware. **Effort:** S–M.

### E6. Twin what-if → approve-only apply
- **Problem:** the Twin what-if panel is preview-only ("nothing is written"); a good simulation dead-ends.
- **Design:** an "apply as approve-only plan" path from a what-if state into the same gradual/approve-only mechanism the Light energy suggestions use ("Start gradual…"). Preview-only stays the default.
- **Edges:** live-grow guardrails — staged + explicitly confirmed, never immediate. **Surfaces:** Twin. **Effort:** M.

---

## Suggested sequencing

1. **Quick honesty/coverage wins (S):** C2 fan-cal coverage, C1 climate debt (after the counter check), A1 probe-dark alert, B1 next-feed ETA, E2 mobile nav.
2. **Editor/consolidation (kills bug classes):** unified Want editor (own doc), C3 CFM-surface consolidation.
3. **Grower value (M–L):** harvest window (own doc) → estimated DLI (own doc) → D2 cross-run/harvest report; B2/B3 irrigation; C4 real energy.
4. **QOL:** A2 templates, A3 away mode, A4 alerts filtering, D1 annotations, E1 palette, E3 kiosk, E4 backup, E5 OTA timing, E6 twin apply.
