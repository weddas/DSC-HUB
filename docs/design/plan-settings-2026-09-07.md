# DSC-HUB settings & preferences — the full knob catalogue and the page architecture

> Drafted 2026-09-07 on `feat/dashboard-v2`, after the v2 dashboard passes A–H. Passes S1 and S2 are implemented (see Status); the rest is plan.
> Companion to [`plan-v2-dashboard-2026-09-06.md`](./plan-v2-dashboard-2026-09-06.md); this plan owns the gear icon.
> Operator brief for this pass: *"as transparent as possible, allowing for easy GUI customisations and configurations"*
> and a settings surface *"designed for easy navigation, logical grouping, and depth of settings."*

## Status

- **2026-09-07 — drafted.** Inventory swept across `frontend/src`, `brain/dsc_brain` and the hub helper entity ids the brain references. Peer notes taken from AROYA, Growlink and Home Assistant (see [Peer notes](#peer-notes)). Tracker rows logged (see [Tracker rows](#tracker-rows)).
- **2026-09-07 — journals + cameras direction** (see [Journals as grow journals, plus cameras](#journals-as-grow-journals-plus-cameras-operator-direction-2026-09-07)): grow-journal parity with sensor-backed entries, manual notes and images from the dash, fixed-mount IP cameras per tent with timelapse and per-plant regions for canopy tracking. Settings rows added (3.11a), passes S6–S7, tracker rows 14–15.
- **2026-09-07 — operator decisions in** (see [Decisions](#decisions-2026-09-07)): metric only, no light theme, stage-rail overrides include the firmware change, hub tunables become brain-owned desired state with the hub's NVS as the built-in fallback, single owner (no people/roles), per-journal retention + size + download + archive. Two more tracker rows logged.
- **2026-09-07 — Pass S1 landed** on `feat/dashboard-v2` (uncommitted, not hotpatched): preference store + `usePreference`, appearance applied through root data attributes, `SettingRow` / `SettingsCard` / `Toggle` / `Segmented` / `Stated`, brain `GET /settings/manifest` (+ test), `useGlobalModifiers` + per-row `useSaveState`, `SettingsLayout` with the grouped rail, live status subtitles, search and anchors, the eleven section pages, legacy redirects, `SettingsPage.tsx` deleted. Evidence: `docs/FOLLOWUPS.md` § Settings Pass S1. Rows without a consumer yet are not rendered (no dead toggles). `SettingsDrawer` waits for its first consumer in S5.
- **2026-09-07 — Pass S2 landed** (same branch, uncommitted, firmware not flashed): brain `hub_tunables` (43 entities, adopt-on-first-run, validated desired values, sync states, reconcile under the failover rules, core-journal entries) + `stage_rail` table + firmware `Brain Stage Targets` switch gating `apply_stage`; routes for tunables / stage rail / root steering targets; native number ranges in the fleet snapshot; `HubTunableRow` / `StageRailCard` on Climate, Light, Root, Sensors, Network; leaf offset single-sourced from the brain; the Light desk's sunrise/sunset/min-dark writes now reach the hub (they were landing in a brain helper). Evidence: `docs/FOLLOWUPS.md` § Settings Pass S2.
- **2026-09-07 — Pass S3 landed** (same branch, uncommitted): settings-change journal (core entries tagged `settings`, Logs › Settings changes), alert catalogue (per-alert enable/severity, quiet hours, failsafe always on, warn baseline + info for config nags), in-page delivery (toast + tone, push stays INVENTED), automation new-rule defaults, journals & storage (per-journal retention with download-before-delete, db/disk/per-journal sizes, JSON/CSV/zip exports, plant grow-record archive on retire). Evidence: `docs/FOLLOWUPS.md` § Settings Pass S3.
- **2026-09-07 — Passes S5 + S4 landed** (same branch, uncommitted, firmware not flashed): `SettingsDrawer`; Devices as five sub-tabs (Inventory rows → seat drawer, Assignment, Zigbee with a bind drawer, Cameras, Firmware + Toolchain & drivers); System gains Time (brain/NTP/hub clock + drift via the new Hub Clock text sensor), live Failover state, About with kit setup + brain route health, Developer (entity ids, provenance mode, INVENTED rows, force 3D, raw snapshot, tunables sync table, change log), Setup profile export/import with a diff, Reset (preferences, typed-confirm factory reset); Integrations demo-mode row; Network names card. Evidence: `docs/FOLLOWUPS.md` § Settings Passes S5 + S4.
- Next: Pass S6 (grow journal + media), then S7b (camera regions, drift, canopy, markers).

## TL;DR

DSC-HUB has roughly **190 tunable values** today, spread over **four storage tiers** that the operator cannot tell apart from the UI, and the Settings page shows about a third of them. The rest are either hub firmware helpers with no settings home (hysteresis, min-off times, ladder waits, sunrise ramps, trust thresholds), brain constants with no UI at all (root steering targets, failover TTL, stale horizons), or SPA constants (stage rail presets, chart ranges, the leaf-VPD offset) that duplicate a brain value and drift from it.

There are **zero operator preferences**: no units, no theme, no default desk, no persisted chart range, no notification controls. The "General" tab is prose.

The plan:

1. **A settings model with provenance.** Every setting row states *who owns it* (this browser · this hub · the brain · the ESP firmware), *what it is right now*, *what the default is*, *where it takes effect*, and *when it last changed*. That is what "transparent" means in practice: not more knobs, but no hidden ones.
2. **Group by the question the operator asks**, not by which process stores the answer. Twelve sections in three groups: **You** (Preferences, Alerts), **The grow** (Zones, Climate, Light, Root, Sensors, Automation), **The kit** (Devices, Integrations, Network, System). Depth capped at three levels: rail → section → one drawer.
3. **A browser-side preference store** for display/units/navigation choices, with a `usePreference` hook and an export so a phone can adopt a laptop's setup.
4. **Bring the hub's own helpers into the settings surface** as first-class rows with the ESP as their stated owner, instead of leaving them reachable only through the entity inspector.
5. **Split the 1816-line `SettingsPage.tsx`** into one file per section as the vehicle for all of the above.

---

## Decisions (2026-09-07)

Operator answers to the six open questions, and what each changes in the plan.

| # | Question | Decision | Effect on the plan |
|---|---|---|---|
| 1 | °F? | **No. Everything stays metric.** | Units card lists each unit as a stated fact (°C, kPa, mS/cm or µS/cm, % VWC, µmol/m²/s, kWh, m³/h with CFM shown for fan nameplates). No unit switches except conductivity scale and airflow. `useUnits` still exists so formatting has one home, but it carries no conversions. |
| 2 | Light theme? | **No.** | Theme row removed. `themes/light-mode.md` stays an exploration for public surfaces only. Appearance keeps grid wash, motion, depth, text scale, high contrast, state-colour set, density. |
| 3 | Stage-rail overrides need firmware. | **Do the firmware change too.** | S2 includes the hub change described in [Hub tunables](#hub-tunables-brain-owned-desired-state-hub-nvs-as-fallback). The presets table is editable from day one of S2. |
| 4 | Who owns hub tunables? | **Brain-owned desired state, hub NVS as the built-in fallback** (the hybrid the operator asked about; design below). | Tier H rows write to the brain, never straight to `/control/service`. New brain table + sync state per row. |
| 5 | Who uses this? | **Growers, power users, enthusiasts, commercial and community. One user: the device owner.** No people/roles/PIN. | People rows dropped entirely. Power-user needs are met by a **Show advanced rows** preference and by **setup profiles** (export/import of preferences + presets as one JSON, shareable in the community). |
| 6 | Journal retention? | **Per-journal retention in days, 0 = indefinite; show database size and per-journal size; download any journal, and offer the download before a retention cut deletes anything; archive plant and tent journals when a plant is retired or harvested as the full history of that grow.** | New **Journals & storage** card in System and the archive flows in [Journals](#journals-retention-size-download-archive). S3 grows to carry it. |

### Hub tunables: brain-owned desired state, hub NVS as fallback

**What exists.** The hub firmware already restores 30 numbers from NVS on boot (`restore_value: true`) and its `apply_stage_boot` script deliberately re-labels without touching targets, so a hub that reboots with no brain keeps running on its last tunables. The brain's re-assert (`hub_failover`, `decision_loop`) covers *demand* (Want→act on switches) only; it holds no copy of targets, hysteresis, ladder waits or ramps. Today those are written straight to the hub from a desk or the inspector, and the hub's NVS is their only home. The fan loop and the climate ladder run on the hub and stay there.

**The model.**

1. **Desired lives in the brain.** New table `hub_tunables(entity_id, desired, unit, updated_at, source)` seeded on first run by *adopting* the hub's current values, so nothing changes behaviour on upgrade.
2. **Settings writes to the brain** (`PATCH /settings/hub-tunables`), which validates against the entity's native `min/max/step`, stores desired, pushes through the existing `_hub_number` / `_hub_select` / `_hub_switch` paths, and journals the change.
3. **The brain reads the echo** from the next fleet poll and exposes a sync state per entity in `/fleet/computed`: `SYNCED` · `PENDING` (pushed, echo not yet seen) · `HELD` (hub offline, push queued) · `HUB DIFFERS` (hub reports a value the brain did not write).
4. **Reconnect reconciliation** uses the failover rules already there: while `manual_takeover` is on, nothing is pushed; on takeover clear or TTL expiry (`force_reassert`), queued tunables push with the demand re-assert. A value that changed on the hub side while the brain was away is *not* silently overwritten: the row shows `HUB DIFFERS` with the two values and two actions, **Adopt hub value** (brain takes it) or **Push brain value**. The hub keeps running on its own value in the meantime, which is the fallback.
5. **Stage presets.** Brain table `stage_rail(stage, temp, vpd_min, vpd_max, rh_min, rh_max, light_hours)` seeded from today's `STAGE_RAIL`; the SPA reads it instead of its constant. On stage change the brain writes the five targets and the light hours. Firmware change (small): a `switch.dsc_hub_brain_stage_targets` (`restore_value`) and, in `apply_stage`, skip the five numeric writes when that switch is on **and** the brain has been seen within the handshake window (`ha_handshake`); otherwise fall through to the baked table. A hub with no brain therefore still applies a sane stage on the panel, and a hub with a brain applies the operator's table.

**Why not the alternatives.** Writing straight to the hub (today) leaves the brain unable to show provenance or history, and cannot survive a hub re-flash. Moving the loops to the brain contradicts the Pi-only product path and the hub's standalone safety story. The hybrid keeps the control loops where they are and only moves *knowledge of the intended values* to the brain.

### Journals: retention, size, download, archive

Journals today: `plant_journal`, `space_journal` (tent), `room_journal`, `dsc_core_journal` (facility), `grow_event_log` (the hub-did grow log), `learning_log`, `soft_cal_sessions`, and `fleet_history` (the only one with retention, 45 days). Retiring a roster slot deletes the roster row and leaves its journal rows orphaned by `plant_id`.

| Piece | Design |
|---|---|
| **Retention per journal** | One row per journal in System › Journals & storage: days (0 = indefinite, the default for all journals except fleet history), rows, oldest entry, estimated size. Brain KV `journal_retention_json`. Prune is throttled and best-effort like fleet history. Archived entries are never pruned. |
| **Size** | `GET /settings/system/storage`: database file size, free space on the card, per-table row count and size (SQLite `dbstat` when available, else rows × average row length), fleet-history stats folded in. Shown as a stacked bar with one segment per journal. |
| **Download** | `GET /journals/{kind}/{id}/export?format=json|csv` for any journal or archive, and `GET /settings/system/storage/export?kinds=…` for a zip of several. JSON carries the frozen `snapshot_json` per entry; CSV flattens it. |
| **Download before deletion** | Reducing a retention value opens a `DecisionLayer` confirm that states exactly what will go (`312 entries older than 2026-06-09 across 2 journals`) with **Download first** as the primary action and **Delete without download** as the secondary. Nothing is pruned until the confirm returns. |
| **Archive on retire / harvest** | Retiring or harvesting a roster slot moves that plant's journal into `plant_journal_archive` with a header: plant, strain, sprout date, retire/harvest date, zones it lived in, probe assignments, final stage, and the harvest note. The tent journal for that run is snapshotted alongside as the run's environment record. Archives are immune to retention, downloadable as a single **grow record** bundle, and listed under Logs › Archive. Roster retire today calls `delete_roster`; it gains the archive step first. |
| **Manual archive** | Any plant or tent journal can be archived from Logs without retiring, for "end of run" bookkeeping; archived journals are read-only. |

### Journals as grow journals, plus cameras (operator direction, 2026-09-07)

The operator's frame: DSC-HUB journals are a grow journal in the sense consumer apps offer (Grow with Jane: log watering, feeding, transplanting, notes and photos per plant, stage tracking seed to harvest, reminders, charts over the log), **but every entry is backed by the kit's sensors** (the frozen `snapshot_json` already does this), **tents get fixed-mount IP cameras** for live view and timelapse, **each plant is tagged as a region in the fixed frame** so its canopy area can be tracked over time, and **the operator can add their own notes and images from the dash** at any time.

What that means for settings. Nothing here is built; the rows exist so the settings surface has a home for them from S1.

| Area | Settings rows | Tier | Notes |
|---|---|---|---|
| **Journal actions** | Action types the log offers (water, feed, transplant, defoliate, train, top, flip, flush, harvest, custom) with per-type default fields (amount L, EC, pH, note) and whether each type auto-freezes a sensor snapshot | N | Grow with Jane parity for manual entries. Custom types are operator-defined. Lives in **Alerts › Reminders** for cadence and **System › Journals & storage** for types. |
| **Reminders** | Per plant or per tent: water / feed cadence, next-due, snooze; quiet hours shared with Alerts | N | Rendered as alert cards with a `REMINDER` tag; the hub does not act on them. |
| **Manual media** | Max image size (default 4 MB, resized server-side to 1600 px long edge), accepted types, per-journal media retention (follows the journal's retention unless set), storage path | N | Attachments table `journal_media(id, journal_kind, entry_id, path, w, h, bytes, created_at)`; files on disk under `DSC_DATA/media/`, never in SQLite; counted in the storage card. Upload from the dash entry composer and from the phone camera. |
| **Cameras** | One drawer per camera under **Devices › Cameras**: name, zone binding, source (`rtsp://`, MJPEG or HTTP snapshot URL), credentials (stored in the brain KV masked like `ap_psk`; entered by the operator), snapshot cadence, enabled | S | A camera is a space device (`/spaces/{id}/devices` with `kind: camera`), so it shows on the zone card and in the twin manifest. Fixed mount is a stated assumption in the drawer: *"Frame must not move; plant regions are pixel regions."* |
| **Timelapse** | Per camera: interval (default 10 min), lights-on only (default on, from the zone's photoperiod), keep frames for N days (0 = indefinite), storage cap per camera (GB), assemble daily / weekly / on harvest, output resolution and fps | N | Snapshot-based (`ffmpeg` assembly on the Pi), never continuous recording. Frames under `media/camera/{id}/`; storage card shows per-camera bytes and the cap. Reducing retention or the cap uses the same download-before-delete confirm. |
| **Plant regions** | Per camera: polygon per plant drawn on the reference frame, linked to a roster slot; re-tag prompt when the plant moves or the frame check fails | S | Table `camera_regions(camera_id, plant_id, polygon_json, set_at)`. Frame-drift check: compare a corner patch of each new frame with the reference; on drift, mark regions `STALE` and ask to re-tag rather than track a wrong area. |
| **Canopy area** | Derived metric per plant from its region: green-pixel area in cm² using the tent's known dimensions, daily; shown on the plant card and in Logs trends with provenance *"camera region, uncalibrated until a scale marker is set"* | derived | **Decided 2026-09-07:** cm² with the uncalibrated label until a marker is set. Follows the derived-metrics rule from the dashboard plan: real formula, provenance line, `—` until a region exists. |
| **Reference markers** | Per camera, optional: one or more reference points or lines drawn on the frame with their real-world length or spacing (a scale marker, a line on the tent wall, a grid on the floor tray); calibration state `UNCALIBRATED · SCALE SET · GRID SET` | S | **Decided 2026-09-07:** markers and lines on tent walls come later as reference points. Table `camera_markers(camera_id, kind, points_json, length_cm, set_at)`. A scale marker turns cm² real for the plane it sits in; a wall line plus a floor grid allow a perspective correction later without re-tagging plants. The drift check uses the markers when they exist, the corner patch otherwise. Physical markers are the operator's (tape, printed grid); the drawer only records where they are in the frame. |
| **Auto entries** | Which events write a journal entry with a frame attached: stage change, harvest, alert fired, reminder done, daily photo at a set time | N | Daily photo at a fixed time is the timelapse's own frame, not a second capture. |
| **Live view** | Per camera: show on the zone card (thumbnail refresh seconds), open full view on click; low-bandwidth mode on phone | B | Preference, per browser. |
| **Privacy** | Local only, no outbound; cameras and media are excluded from setup-profile export; included in backup export only when the operator ticks *include media* | — | Stated on the Cameras page, not a toggle. |

Constraints to hold to: the Pi 4/5 kit brain has no GPU, so decoding is snapshot-based and any per-frame analysis runs at the timelapse cadence, not live; media lives on disk with its own retention because it dwarfs the SQLite journals; the archive bundle for a retired plant includes its cropped region frames so the grow record is visual as well as numeric; INVENTED until a camera is bound: the zone card shows a dashed `CAMERA` slot with *"possible with an IP camera bound to this tent"*.

Peer source for parity: [Grow with Jane](https://apps.apple.com/us/app/grow-with-jane-grow-journal/id1467850558) (watering, feeding, transplanting, notes, photos, stage tracking, reminders, growlog charts).

---

## Part 1 — What "transparent" has to mean here

The AGENTS.md house rule is behavioural honesty: chips and gauges match real state. Applied to settings, honesty has five parts. Each one is a column or affordance on every setting row, delivered by one primitive (`SettingRow`, see [Primitives](#primitives)).

| Requirement | Row affordance | Today |
|---|---|---|
| **Owner is visible.** Who holds the value: this browser, the brain's SQLite, the hub ESP's NVS, or an ESP firmware constant. | Scope badge: `THIS BROWSER` · `BRAIN` · `HUB` · `FIRMWARE` | Invisible. `leaf_offset_c` sits next to AP channel with no hint that one restarts Wi-Fi and the other changes a formula. |
| **Default is visible and one click away.** | `default 2 °C` chip; `Reset` action; changed-from-default rows carry a dot in the rail count. | No defaults shown anywhere; no reset. |
| **Effect is stated before it is applied.** What changes, where it shows, whether an actuator moves. | Description line + `DecisionLayer` confirm when an actuator or the network is affected (already the pattern for zone flips). | Partial: Network apply and permit-join confirm; brain and hub values do not. |
| **Value is what the system is actually using.** | Rows read back after save; the desk that consumes the value links to the row (`Edit in Settings › Light › Tariff`) and the row links to the desk. | SPA `DEFAULT_LEAF_OFFSET_C = -1.5` while the brain uses `leaf_offset_c = 2`: two "leaf VPD" numbers from one setting. |
| **History is kept.** | `Changed 2 h ago · was 1.2` on the row; a *Settings changes* filter in Logs (system journal entries, the Pass C pattern). | Only zone flips are journaled. |

Two further rules keep transparency from becoming noise:

- **Advanced is a disclosure, not a separate page.** Hysteresis, ladder waits, MAD thresholds and de-strat pulses live under an `Advanced` toggle inside their section, with the same row primitive. They are not hidden in a "Brain" tab whose name says nothing about what is inside.
- **Invented stays invented.** Push notifications, people/roles, and cloud sync appear as rows that say what they *would* do and what backing they need, in the dashed OOS style. No toggles that do nothing.

---

## Part 2 — Where a value lives (the four tiers)

Every knob in the catalogue is tagged with one of these. The tier decides the write path, the save UX, and the failure story.

| Tier | Store | Write path | Save UX | Fails when |
|---|---|---|---|---|
| **B — This browser** | `localStorage` under one namespaced key (`dsc.prefs.v1`) via `usePreference` | synchronous | autosave, no button | never; per device, so a phone and a laptop differ (by design) |
| **N — Brain KV** | `settings` table (`settings.py` `DEFAULT_SETTINGS`, 22 keys + JSON blobs like `global_modifiers`, `automation_rules`) | `PATCH /settings` and the per-domain routes | autosave on blur with toast, *or* explicit Save where a group must apply together (AP SSID + PSK + channel) | brain older than SPA (route missing → the Pass D content-type guard) |
| **S — Brain structured** | dedicated tables: zones/spaces, roster, tariff bands, energy learning, journals, zigbee bindings/policies, calibration | domain routes (`/zones`, `/spaces/*/tariff`, `/settings/zigbee/*`) | per-entity drawer with Save; confirm when effects list is non-empty | same |
| **H — Hub ESP** | ESPHome `number.` / `select.` / `switch.` / `time.` entities in NVS, ~70 of them (`*.dsc_hub_*`), plus the panel/probe `input_*` helpers. **Desired value is held by the brain** (`hub_tunables`, see [Decisions](#hub-tunables-brain-owned-desired-state-hub-nvs-as-fallback)); the hub's NVS copy is the fallback | Settings → `PATCH /settings/hub-tunables` → brain pushes via native API, reads the echo, re-pushes on reconnect under the failover rules | write-through with the confirmed/failed flash (`EntityToggle` pattern) plus a sync state `SYNCED · PENDING · HELD · HUB DIFFERS`; `DecisionLayer` when an actuator may move | hub offline → row shows `HELD`, push queued; hub changed locally → `HUB DIFFERS` with adopt / push |
| **F — Firmware constant** | compiled into ESPHome YAML or a brain module constant (`STALE_SEC = 45`, `MAX_CONDITIONS = 8`, irrigation shot 2 s) | not writable | shown read-only with a `FIRMWARE` badge and the file that owns it | — |

A brain-side **settings manifest** (`GET /settings/manifest`) is the single source for tier, default, range, unit, description and "consumers" per key, so the SPA never hardcodes a default again. Hub entities get their range from the native API attributes (`min`/`max`/`step`), which the brain already sees.

---

## Part 3 — The catalogue

Legend for the **Today** column: `UI` shown in Settings now · `desk` editable on a desk (Climate/Light/Root) but not in Settings · `inspector` reachable only through the entity inspector · `const` a constant in code, no UI · `none` does not exist. **Tier** as in Part 2. **Proposed home** is a section › card in [Part 4](#part-4--page-architecture).

### 3.1 Preferences › Appearance (tier B, this browser)

| Setting | Default | Today | Proposed home | Notes |
|---|---|---|---|---|
| Theme | Dark | `const` | — | **Decided: no light theme.** No row. |
| Show advanced rows | Off | `none` | Preferences › Appearance | Power-user switch: every `Advanced` disclosure opens by default. |
| Grid wash | On | `const` (Pass A) | Appearance | Off falls back to a flat panel ground. |
| Motion | Full | `const` | Appearance | Full · Reduced · Off. Reduced honours `prefers-reduced-motion`; Off also disables fan spin, heat lines and the fresh pulse. |
| Fresh pulse on new readings | On | `const` (`useFreshFlag`) | Appearance | |
| Depth / glow | On | `const` | Appearance | Glass and glow tokens → flat borders when off (helps projectors and cheap panels). |
| Text scale | 100 % | `none` | Appearance | 90 / 100 / 110 / 125 %. Applied as a root `font-size`; tokens are rem-based. |
| High contrast | Off | `none` | Appearance | Swaps `--dsc-gray-3/5` for the AA-safe pair in `tokens.md`. |
| State colour set | Default | `none` | Appearance | Default · Deuteranopia-safe · Monochrome + glyphs. State colours are the only colour in the app (design principle 3), so this is one token swap. |
| Density | Auto | `const` (scale ladder by zone count) | Appearance | Auto · Comfortable · Compact. Auto is the 1o rule; the override exists for wall displays. |

### 3.2 Preferences › Units & formats (tier B)

| Setting | Default | Today | Proposed home | Notes |
|---|---|---|---|---|
| Temperature | °C | `const` | Units | **Decided: metric only.** Stated, not chosen. Every `formatReading` call still goes through one `useUnits` hook so precision and symbols have one home. |
| VPD | kPa | `const` | Units | Stated. |
| Conductivity | mS/cm | `const` | Units | mS/cm · µS/cm (both metric; the probes report µS). No ppm scales. Root desk EC axis and CannaLib. |
| Substrate moisture | % VWC | `const` | Units | Stated. |
| Light | PPFD µmol/m²/s, DLI mol/m²/d | `const` | Units | Stated. |
| Energy & cost | kWh, `$` | `const` (`$` hardcoded in `TwoClocks`) | Units | Currency symbol free text, 3 chars. |
| Airflow | m³/h | `const` (CFM today) | Units | m³/h primary; CFM shown in parentheses on fan rows because nameplates and the `dsc_cfm_*` helpers are CFM. |
| Time | 24 h | `const` | Units | 24 h · 12 h. Clocks, journals, tooltips. |
| Date | `2026-09-07` | mixed | Units | ISO · D MMM · MM/DD. |
| Relative times | "14 m ago" | `const` | Units | Relative · Absolute · Both (tooltips already show both). |
| Precision | per metric | `const` | Units › Advanced | Decimal places per metric (T 1, RH 0, VPD 2, EC 2, VWC 0). Advanced disclosure. |
| First day of week | Monday | `none` | Units | Journals/trends week boundaries. |

### 3.3 Preferences › Home & navigation (tier B)

| Setting | Default | Today | Proposed home | Notes |
|---|---|---|---|---|
| Landing desk | Overview | `const` | Home | Any desk, or "Last visited". |
| Default zone focus | 4×8 | `const` (`useZoneFocus`) | Home | Zone id, or "Last used". |
| Desk order and visibility | Pass A order | `const` (`routes.ts` `DESKS`) | Home | Drag to reorder; hide desks the kit does not use (CannaLib without a catalog, Root without probes). A hidden desk stays reachable by URL. Peer: Home Assistant's sidebar editor. |
| Phone bottom bar | Overview · Climate · Plants · Alerts · More | `const` | Home | Pick 4 of the desks. |
| Remember sub-tab per desk | On | `const` | Home | Climate Room/Tent, Plants, Kit, Settings. |
| Mission line on Overview | On | `const` | Home | |
| Journal teasers on Overview | Off | `const` (removed in Pass A) | Home | Operator removed them; the row records that choice and allows it back. |
| Tooltip open delay | 300 ms | `const` (`Tooltip.tsx`) | Home › Advanced | |

### 3.4 Preferences › Charts & history (tier B unless noted)

| Setting | Default | Today | Proposed home | Notes |
|---|---|---|---|---|
| Default chart range | 24 h | `sessionStorage` (`useChartHours`, options 1/6/24/48) | Charts | Persist in the preference store. Add 7 d (the `ZoneVpdChart` already offers it) and 30 d gated on retention. |
| Band shading | On | `const` | Charts | |
| Lights-off shading | On | `const` (`lightsOffShades`) | Charts | |
| Stage and alert markers | On | `const` | Charts | |
| Compare ghost by default | Off | `const` | Charts | Which zone ghosts onto which. |
| Hold gap display | 2 s / 5 min | `const` (`charts.tsx` `HOLD_GAP_MS`, `MAX_HOLD_TO_NOW_MS`) | Charts › Advanced | How long a series is drawn flat before a gap opens. |
| Trends half-window | 6 h | `const` (`TRENDS_HALF_WINDOW_H`) | Charts › Advanced | Logs trends around an event. |
| Reading stale horizon | 10 min | `const` (`TIMESTAMPED_READING_STALE_MS`) | Charts › Advanced | When a timestamped reading turns `HELD`. Display-side; the brain's `STALE_SEC = 45` is a separate control-side horizon and is shown read-only beside it. |
| Offline cooldown | 25 s | `const` (`OFFLINE_COOLDOWN_MS`) | Charts › Advanced | How long a seat must be silent before the UI calls it offline. |
| History retention | 45 days | `UI` (System) — tier N `fleet_history_retention_days` | System › Storage (stays), linked from Charts | Brain-owned; the Charts card shows it read-only with a link. |

### 3.5 Alerts & notifications

| Setting | Default | Today | Tier | Proposed home | Notes |
|---|---|---|---|---|---|
| Per-alert enable | On | `none` (playbook is a fixed map in `alertPlaybook.ts`, 14 alerts) | N | Alerts › Catalogue | One row per alert id: enabled, severity override, "hub acts" summary from the playbook. Disabling an alert hides it; the brain still logs it. |
| Snooze durations | 1 h / 8 h / 24 h | `localStorage` (`useAlertSnooze`, per boot key) | B | Alerts › Delivery | Snooze state stays per browser; the preset list is a preference. |
| Seen-for horizon | per alert | `const` (`useAlertSince`) | B | Alerts › Delivery | |
| In-page toast | On | `none` | B | Alerts › Delivery | |
| Browser sound | Off | `none` | B | Alerts › Delivery | Critical only · All · Off. |
| Quiet hours | Off | `none` | N | Alerts › Delivery | Applies to sound and, later, push. Never suppresses the emergency failsafe. |
| Push to phone | — | `none` | — | Alerts › Delivery | **INVENTED** row: "possible with a notification relay on the brain". No toggle until backing exists (FOLLOWUPS Pass D deferred item). |
| Recipients | — | `none` | — | — | **Decided: single owner.** Dropped; push, when backed, goes to the owner's devices. |
| Alert history retention | follows journals | `none` | N | Alerts › Delivery | |
| Automation rules v2 | — | `UI` (Brain tab, `AutomationRulesCard`) | N | **Automation** (own section) | Moves out of "Brain". Rule count in the rail. |
| Rule defaults: debounce / release / window | none | `const` per rule | N | Automation › Defaults | Defaults applied to new rules. `MAX_CONDITIONS = 8` shown read-only, tier F. |

### 3.6 Zones (tier S)

| Setting | Default | Today | Proposed home | Notes |
|---|---|---|---|---|
| Name, role, notes | kit names | `UI` (Pass C) | Zones | Keep the 3b before/after confirm. |
| Room membership, order | kit | `none` | Zones › drawer | Order drives Overview grid order. |
| Dimensions (m) | 1.2×0.6×2.1 / 2.4×1.2×2.1 | `none` (twin manifest has them) | Zones › drawer | Feeds volume-based derived metrics and the twin. |
| Cultivar / roster link | — | `desk` (Plants) | Zones › drawer | Read-only summary with a link; roster stays the owner. |
| Per-zone temp / RH offset | 0 / 0 | `UI` (Brain › global modifiers, `temp_offset_c`/`rh_offset_pct` keyed room·clone·main) | **Sensors** › Offsets (cross-linked from the zone drawer) | Today's "global" modifiers are already per-zone; name them so. |
| Leaf-to-air offset | 2 °C (brain) / −1.5 °C (SPA) | `UI` (Brain) + `const` | Sensors › Offsets | **Finding:** two sources. Make the SPA read the brain value; allow per-zone override later when an IR leaf sensor exists (hint row). |
| Priority tent | — | `inspector` (`select.dsc_hub_priority_tent`) | Zones | Tier H. Which tent wins when the room lung cannot satisfy both. |
| Clone climate mode | Follow 4x8 | `desk` (Climate, `select.dsc_hub_clone_mode`) | stays on the desk; listed in Zones with a link | Policy, not a preference. |
| Clone photoperiod independence | Follow | `desk` (`select.dsc_hub_clone_photoperiod`) | stays on the desk; listed | |

### 3.7 Climate (tier H unless noted)

| Setting | Default | Today | Proposed home | Notes |
|---|---|---|---|---|
| Stage rail presets (T, VPD min/max, RH min/max, hours) × 10 stages | `STAGE_RAIL` in `tentWant.ts`, mirrors `apply_stage` in hub firmware | `const` (SPA) + `F` (hub) | Climate › Stage presets | **Decided: editable, firmware change included.** Brain table `stage_rail` seeded from today's values, per-cell reset, the SPA reads it; the brain writes the active stage's targets on stage change; the hub's `apply_stage` defers to the brain when `switch.dsc_hub_brain_stage_targets` is on and the brain is alive, else uses its baked table. See [Decisions](#hub-tunables-brain-owned-desired-state-hub-nvs-as-fallback). |
| Active stage | — | `desk` | stays on the desk; shown here read-only | |
| Target temp / RH min·max / VPD min·max (4×8) | firmware | `desk` (`number.dsc_hub_target_temp`, `_rh_target_min/max`, `_vpd_target_min/max`) | Climate › Targets | Desk stays primary; Settings shows the same rows so "what is the hub aiming at" has one answer. |
| Clone targets (temp, RH, VPD) | firmware | `inspector` (`number.dsc_hub_clone_*`) | Climate › Targets | Currently only reachable through the inspector unless Custom mode. |
| VPD band target hours | firmware | `inspector` (`number.dsc_hub_vpd_band_target_hours`) | Climate › Targets | |
| Control strategy | firmware | `inspector` (`select.dsc_hub_control_strategy`) | Climate › Control | |
| Tent full-auto / manual override / manual takeover | Auto | `desk` + `inspector` | Climate › Control | Read-only mirror with link; these are live controls, not settings. |
| Per-appliance auto / in-service | Auto / On | `desk` + `UI` (inventory) | Devices › Inventory (in-service) · Climate › Control (auto) | |
| Hysteresis (clone humidifier) | firmware | `inspector` (`number.dsc_hub_clone_hum_hysteresis`) | Climate › Advanced | |
| Min-off times (heater, humidifier, clone humidifier, mat) | firmware | `inspector` (`number.dsc_hub_*_min_off_time`) | Climate › Advanced | Compressor and element protection; explain that in the description. |
| Ladder waits (ac, dehum, heat, hum, mat) | firmware | `inspector` (`number.dsc_hub_ladder_wait_*`) | Climate › Advanced | The order the hub escalates. |
| De-strat pulse (enable, length, level, period) | firmware | `inspector` (`switch.dsc_hub_recirc_de_strat_pulse`, `number.dsc_hub_de_strat_pulse_*`) | Climate › Advanced | |
| Humidifier intake routing | firmware | `inspector` (`switch.dsc_hub_humidifier_intake_routing`) | Climate › Advanced | |
| Fan demand scale | 1.0 (0.5–1.5) | `UI` (Brain) — tier N | Climate › Fans | |
| Fan max CFM (intake clone/main, out, recirc) and duct diameters | panel helpers | `desk` (Calibrate) — panel `input_number.dsc_cfm_*`, `dsc_duct_*` | Climate › Fans (read-only, link to Calibrate) | Calibration owns the write. |
| Mister target hours / min-off hours | firmware | `inspector` | Climate › Advanced | On hold hardware (F-002); render dashed OOS. |
| AC auto / demand / in-service | — | `inspector` | Climate › Control | On hold (F-001); dashed. |

### 3.8 Light (tier H unless noted)

| Setting | Default | Today | Proposed home | Notes |
|---|---|---|---|---|
| Lights-on time (4×8, 2×4) | firmware | `desk` (`time.dsc_hub_lights_on_time`, `_clone_lights_on_time`) | Light › Schedule | Desk stays primary. **Open finding** (Notion `…8143`): the hub's on-time is not in `/fleet`; the row must show the hub's value, not the SPA's assumption. |
| Photoperiod hours (clone) / auto photoperiod | firmware | `desk` (`number.dsc_hub_clone_light_hours`, `switch.dsc_hub_auto_photoperiod`) | Light › Schedule | |
| Min dark hours | firmware | `inspector` (`number.dsc_hub_min_dark_hours`) | Light › Schedule | Guards the 2×4 dark violation alert. |
| Sunrise / sunset duration | firmware | `inspector` (`number.dsc_hub_sunrise_duration`, `_sunset_duration`) | Light › Schedule | |
| SF1000 target brightness / ramp floor / effective-off % | firmware | `inspector` | Light › Fixtures › Advanced | |
| Light brightness scale | 1.0 (0.5–1.5) | `UI` (Brain) — tier N | Light › Fixtures | |
| Fixtures and nameplate watts | `/spaces` devices | `desk` (Pass E fixtures panel) — tier S | Light › Fixtures | Drawer per fixture: name, watts, PPFD map asset. |
| PPFD calibration value | panel `input_number.dsc_cal_ppfd_100` | `desk` (Calibrate) | Light › Fixtures (read-only, link) | |
| Schedule shift / flip policy | `veg_style` | `desk` (confirm flow) | stays on the desk | Actions, not settings. |
| Energy learning (enabled, prefer growth outliers, outlier days 2, norm days 5) | tier S | `desk` (Learning wizard) | Light › Learning | Also mirror `input_boolean.dsc_climate_learn_enabled`, `dsc_learn_alpha`, `dsc_learn_min_samples` (panel) under Advanced. |
| Tariff bands (label, start, end, rate) | default bands | `UI` (Brain › `SpaceEnergySettingsCard`) — tier S | Light › Tariff | Moves from Brain. `LightPage` already says "Edit in Settings › Brain"; the link becomes `Settings › Light › Tariff`. |
| Lock Wi-Fi AP (hub) | firmware | `inspector` (`switch.dsc_hub_lock_wifi_ap`) | Network › Hub radio | Listed here only because it is a hub switch; belongs to Network. |

### 3.9 Root & irrigation

| Setting | Default | Today | Tier | Proposed home | Notes |
|---|---|---|---|---|---|
| Steering targets: dry-back P1 max 10 %, P2 max 25 %, P3 min 25 %, VWC day 55 % / night 50 %, EC 2.2 mS/cm | `root_steering.py` | `const` (brain loads from settings if present, no UI) | N | Root › Steering | Rows with the P1–P3 explanation from the desk. |
| Steering auto / manual | Auto | `desk` | N | Root › Steering (mirror) | |
| Heat-mat root-zone low / high | firmware | `inspector` (`number.dsc_hub_mat_root_zone_low/high`) | H | Root › Heat mat | |
| Mat votes per pot | firmware | `inspector` (`switch.dsc_hub_mat_vote_pot_N`) | H | Root › Heat mat | Which probes may call for heat. |
| Moisture "dry" reference line | 30 % (5–80) | `UI` (Brain › global modifiers) | N | Root › Steering | |
| Manual shot duration | 2 s | `const` (`RootPage`) | B | Root › Irrigation | Per-browser is wrong for an actuator: make it tier N with a hard cap. |
| Pump binding | — | `UI` (Device › Zigbee bindings `plug_pump`) | S | Root › Irrigation (read-only, link to Devices) | |
| Tank: EC/pH bias and multiplier, level, plant type, stage | panel helpers | `desk` (Compose) | H | Root › Tank (read-only, link) | On hold hardware; dashed. |

### 3.10 Sensors & trust

| Setting | Default | Today | Tier | Proposed home | Notes |
|---|---|---|---|---|---|
| Per-zone temp / RH offsets | 0 | `UI` (Brain) | N | Sensors › Offsets | From 3.6. |
| Sensor clamps (T −5…**45** °C, RH 0…100 %) | `global_modifiers.sensor_clamp` | `UI`/API (patchable + read back; tip `17aa6bd`) | N | Sensors › Offsets › Advanced | Reject outside bounds (do not clamp-to-rail). See [`docs/brain/PLAUSIBILITY.md`](../brain/PLAUSIBILITY.md). |
| DHT disagreement thresholds (ΔT 4 °C, ΔRH 15 %) | panel `input_number.dsc_dht_delta_*` | `inspector` | H | Sensors › Trust | |
| Peer MAD thresholds (pH 0.6, EC 250, moisture 12) | panel `input_number.dsc_trust_mad_*` | `inspector` | H | Sensors › Trust | |
| Stuck-rate max 0.02 %/h, stuck-on 45 min, MAD-on 20 min, DHT on 15 / off 5 min | `sensor_trust.py` | `const` | F → N | Sensors › Trust › Advanced | Promote to brain KV with defaults; until then read-only with the file named. |
| Soil-test stability (variance 2.5, 45 s, 3 samples) | `soil_tests.py` | `const` | F | Sensors › Calibration (read-only) | |
| Probe in-service (1–4) | 1–2 on | `UI` (inventory) + `switch.dsc_hub_potN_in_service` | S + H | Devices › Inventory | One row, both writes, with the hub's echo shown. |
| Probe station idle home / tent | — | `UI` (Device) | S | Devices › Assignment | |
| Calibration (per device) | — | `desk` (Calibrate page) | S | Sensors › Calibration (index + links) | Settings lists last calibration per device and links; the wizard stays where it is. |

### 3.11 Devices & kit (tier S unless noted)

Everything on today's Device tab stays, regrouped into sub-tabs: **Inventory** (seats, in-service, host, add seat, advanced restore), **Assignment** (probe → plant, stations), **Zigbee** (permit join, catalogue, roles, bindings, recipes, policies, health), **Cameras** (new, see 3.11a), **Firmware** (ESPHome toolchain, compile/OTA, job history, dashboard link — absorbs today's *Server* tab). Rows to add:

| Setting | Default | Today | Notes |
|---|---|---|---|
| Expected firmware | `DSC_EXPECTED_FIRMWARE` | shown in General | Firmware sub-tab, read-only. |
| Fleet OTA prompt | true | `const`-ish (`esphome_fleet_ota_prompt`, tier N, no UI) | Firmware. |
| ESPHome dashboard URL / API base / bin / project dir | defaults | tier N, no UI | Firmware › Advanced. |
| Sonoff relay object, poll 2 s, stale 45 s | `appliance_driver.py` | `const` | Firmware › Advanced, read-only tier F. |
| Kit commissioned / setup phase / setup debt | — | tier N, Setup wizard | System › About (read-only) with "Re-run setup". |

### 3.11a Cameras & media

Rows are specified in [Decisions › Journals as grow journals, plus cameras](#journals-as-grow-journals-plus-cameras-operator-direction-2026-09-07): camera drawers under Devices › Cameras (source, zone, credentials, cadence), timelapse rows (interval, lights-on only, retention, cap, assembly), plant regions and the canopy-area derived metric, manual media limits, auto-entry events, live-view preference. Storage for frames and uploads is on disk and appears in System › Journals & storage per camera and per journal.

### 3.12 Integrations (tier N)

| Setting | Today | Notes |
|---|---|---|
| Ollama base URL, model, test | `UI` (API) | Keep. |
| CannaLib API URL, key, local fallback, test | `UI` (API) | Keep; key masked with `set` indicator like `ap_psk`. |
| Catalog reload, status | `UI` (Brain) | Moves here. |
| PPFD map assets | `const` (`/dsc-catalog/ppfd/`) | Read-only row listing what is installed. |
| Demo mode | `DSC_DEMO_MODE` env | Read-only badge; explains why writes are refused. |

### 3.13 Network (tier N + H)

Keep today's rows (AP SSID/PSK/channel with Apply confirm, Ethernet mode/static, internet check) and add: hub `lock_wifi_ap` (tier H), mDNS name `dsc-brain.local` (read-only), SoftAP SPA URL (read-only `SOFTAP_SPA_URL`), Wi-Fi channel split alert cross-link.

### 3.14 System

| Card | Rows | Today |
|---|---|---|
| Backup | export, import (confirm) | `UI` (Hub tab) |
| Journals & storage | database size + free space; one row per journal (plant, tent, room, facility, grow log, learning, soft-cal, fleet history) with retention days (0 = indefinite), rows, oldest, size, **Download**; retention cut → confirm with **Download first**; archive list with grow-record download. Design in [Decisions › Journals](#journals-retention-size-download-archive). | `UI` (fleet history only) |
| Logs | source, verbosity, download | `UI` (System) |
| Power | restart brain, reboot, shutdown (confirm) | `UI` (System) |
| Time | timezone, NTP status, hub clock vs brain clock drift | `none` — **finding:** photoperiod windows depend on hub local time and nothing shows whether the Pi and the ESP agree. |
| Failover | hub override TTL 900 s (`hub_failover.DEFAULT_TTL_SEC`), HA handshake number, `pending_reassert` state | `const` + `inspector` |
| About | surface version, expected firmware, SPA bundle SHA, brain route health (which optional routes the running brain serves), kit setup state | `UI` (General) |
| Developer | show entity ids on tiles, provenance mode (every derived number shows its formula), raw `/fleet` snapshot viewer, feature flags (`twin-spike`, `force3d`), show INVENTED slots, hub tunables sync table (desired · hub · state), settings change log | `none` |
| Setup profile | export / import one JSON of preferences + stage presets + alert catalogue + hub tunables desired values, for a second device or for sharing with the community; import shows a diff and never touches network or inventory | `none` |
| Reset | reset browser preferences; factory reset brain data (double confirm, typed zone name) | `none` |

---

## Part 4 — Page architecture

### Information architecture

Three levels, never four.

```
L1  rail (desktop) / list (phone)          L2  section page                    L3  drawer
─────────────────────────────────────      ─────────────────────────────      ─────────────────
YOU        Preferences   THIS BROWSER      cards, each a group of rows        one entity:
           Alerts        12 · 1 snoozed    Advanced disclosure per card       a zone, a rule,
THE GROW   Zones         3                 anchors (#tariff) for deep links   a fixture, a seat,
           Climate       HUB · 4×8 VEG                                        a Zigbee device
           Light
           Root
           Sensors       2 offsets set
           Automation    5 rules · 1 firing
THE KIT    Devices       1 offline
           Integrations
           Network       AP ch 6
           System        45 d history
```

- **Rail** (`SETTINGS_TABS` becomes grouped): label, icon, and a live *status subtitle* computed from the section's data (count of changed-from-default rows, a firing rule, an offline seat). The subtitle is the transparency hook at L1: the rail tells you where something is non-default before you open it.
- **Section page**: eyebrow `SETTINGS · CLIMATE`, sentence headline, then cards. Every card is a `Panel` with a legend label (the 2a language), rows inside, an `Advanced` disclosure at the bottom when the card has one. Cards load independently and degrade per the Pass D rule (old brain → "brain predates X" inside that card only).
- **Drawer**: opens from a row's chevron on the right (desktop, 420 px) or as a full page (phone). Has its own Save; closing with unsaved changes asks. Rule editor, zone editor, fixture editor, device detail and Zigbee bind row all become drawers instead of inline expansions, which is what shrinks the Device tab's 18-card wall (tracker SP-P0-3).
- **Search**: a filter box above the rail (`/` focuses it). Matches on label, description, key, entity id. Results are rows, grouped by section, and clicking one opens the section scrolled to the row. This is the escape hatch for "I know the name but not the group".
- **Deep links**: every row has an id → `#/settings/light#tariff`. Desks link to rows (`Edit in Settings › Light › Tariff`), rows link back to the desk that consumes them (`Used by: Light desk, Overview zone card`). The `consumers` list comes from the manifest.

### Grouping rationale

| Group | Why these together | Peer precedent |
|---|---|---|
| **You** | Anything that changes only what *this person on this device* sees, plus how they are told. Badge `THIS BROWSER` on Preferences; Alerts is mixed-tier but the question is personal. | AROYA "user settings" (notifications, language) split from facility setup; Home Assistant profile page. |
| **The grow** | The agronomic model, in the desk order the operator already knows (Climate · Light · Root), plus Zones (the container), Sensors (what the readings are trusted to mean) and Automation (what the hub does about it). Same names as the desks, so a link from a desk lands where the operator expects. | Growlink's setpoints-vs-rules split: setpoints are daily operator work, rules are set once at commissioning; AROYA rooms/zones under Setup. |
| **The kit** | Hardware and plumbing. Changes here have the widest blast radius (Wi-Fi restart, OTA, reboot). | Home Assistant Devices & services → Protocols → System. |

### Save semantics by tier

| Tier | Pattern |
|---|---|
| B | Autosave on change; row flashes `saved`. No Save button anywhere in Preferences. |
| N | Autosave on blur with a toast and undo (5 s). Groups that must apply atomically (AP trio, tariff band) use a card-level Save. |
| S | Drawer Save; `DecisionLayer` confirm when the brain returns a non-empty effects list (zones already do this). |
| H | Write to the brain's desired table; row shows `PENDING` until the hub's echo matches, then `SYNCED`; `DecisionLayer` confirm when the manifest marks the entity `actuates: true`. `HELD` (queued) when the hub is offline; `HUB DIFFERS` with adopt / push when the hub holds another value. |
| F | No control; value, unit, owner file. |

### Primitives

- **`SettingRow`** — label, description, control slot, scope badge, default chip + reset, changed-at line, `HELD`/`FIRMWARE` states, deep-link id, optional `consumers`. One component; every section uses it. Replaces the bespoke `<label>` blocks in `SettingsPage.tsx` and fixes the untyped-input skin bug (tracker TH-P0-1) in one place.
- **`SettingsCard`** — `Panel` + rows + `Advanced` disclosure + independent load/error state.
- **`SettingsDrawer`** — right sheet / phone page with Save and dirty guard, built on `DecisionLayer`'s modal layer.
- **`usePreference<T>(key)`** — typed read/write on the browser store with defaults from a `PREFERENCE_DEFAULTS` table; `useUnits()` and `useTheme()` derive from it.
- **`useSettingsManifest()`** — fetches `/settings/manifest` once; rows take default, range, unit, tier and consumers from it.

### Mobile

Rail collapses to a grouped list with the status subtitles; a section is a page with a back chevron; drawers are pages. The bottom bar's *More* sheet gets a Settings entry that opens the list. Search stays at the top of the list.

### Route map

| Old | New |
|---|---|
| `/settings/general` | `/settings/preferences` (appearance, units, home, charts as anchors) |
| `/settings/brain` | split: `/settings/sensors` (offsets, clamps), `/settings/climate#fans` (fan scale), `/settings/light#tariff`, `/settings/automation` (rules), `/settings/integrations#catalog` |
| `/settings/hub` | `/settings/system#backup` |
| `/settings/server` | `/settings/devices/firmware` |
| `/settings/device` | `/settings/devices` (+ `/inventory` `/assignment` `/zigbee` `/firmware`) |
| `/settings/api` | `/settings/integrations` |
| `/settings/zones`, `/settings/network`, `/settings/system` | unchanged |

`routes.ts` `LEGACY_REDIRECTS` grows by these seven entries; `lib/paths.ts` gains `settings(section, anchor?)`.

---

## Part 5 — Passes

Each pass keeps both tents at the same point, verifies with `npx tsc --noEmit` + `npm run build` + the pane, and closes with a FOLLOWUPS write-up.

| Pass | Scope | Acceptance |
|---|---|---|
| **S1 — Foundation** | `usePreference` store + `PREFERENCE_DEFAULTS`; `SettingRow` / `SettingsCard` / `SettingsDrawer`; split `SettingsPage.tsx` into `pages/settings/{Preferences,Alerts,Zones,Climate,Light,Root,Sensors,Automation,Devices,Integrations,Network,System}Page.tsx` (the existing cards move, not rewritten); grouped rail with status subtitles; search; route map + redirects; brain `GET /settings/manifest`. Preferences › Appearance + Units + Home + Charts fully working. | Every existing control still works on the live Pi; °F shows on every temperature; chart range survives a reload; `/settings/brain` redirects; no page wider than 375 px. |
| **S2 — The grow sections + hub ownership** | Brain `hub_tunables` table with adopt-on-first-run, `PATCH /settings/hub-tunables`, echo + sync state in `/fleet/computed`, reconnect reconciliation under the failover rules; `stage_rail` table + the firmware switch in `apply_stage`; Climate / Light / Root / Sensors rows for every hub helper as tier-H `SettingRow`s; steering targets UI; tariff and learning move to Light; per-zone offsets and clamps to Sensors; leaf offset single-sourced. | Each hub number shows `SYNCED` within one poll of a write; a write while the hub is offline shows `HELD` and lands on reconnect; a value changed from the ESPHome web UI shows `HUB DIFFERS` with both values; changing a stage-preset cell then selecting that stage moves the hub's targets; a hub booted with no brain still applies the baked stage table; SPA leaf VPD equals the brain's within rounding. |
| **S3 — Alerts, Automation, Journals** | Alert catalogue with enable/severity (brain KV), delivery card (toast, sound, quiet hours, snooze presets), INVENTED row for push; Automation section with rule defaults; settings-change journal entries and the Logs filter; **Journals & storage**: `journal_retention_json`, `/settings/system/storage`, per-journal export (JSON/CSV), download-before-delete confirm, `plant_journal_archive` + archive step on retire/harvest, Logs › Archive list with grow-record download. | Disabling an alert hides it on Alerts desk and Overview mission line; quiet hours silence sound but never the failsafe; every setting write from S1–S3 appears in Logs; cutting a retention value offers the download and deletes nothing until confirmed; retiring a plant produces an archive whose export contains every entry and snapshot; storage sizes add up to the database file size within 10 %. |
| **S4 — System & transparency** | Time card (tz, NTP, hub/brain drift), failover TTL, brain route health, developer card (entity ids, provenance mode, raw snapshot, feature flags, hub tunables sync table), setup-profile export/import, reset flows with typed confirm. | Setup profile export → import on a second device reproduces preferences and presets and changes nothing under Network or Devices; provenance mode shows a formula on every derived number. |
| **S5 — Devices restructure** | Device tab → five sub-tabs with drawers; inventory accordion by role, offline/OOS open by default (SP-P0-3); Firmware absorbs Server; Cameras sub-tab present as an honest empty state ("no camera bound") with the drawer schema. | Device page fold shows ≥ 6 seats at 1280 and ≥ 3 at 390; Zigbee bind is a drawer. |
| **S6 — Grow journal + media** | Journal action types + per-type fields, manual notes and image upload from the dash entry composer, `journal_media` on disk, reminders as `REMINDER` alert cards, media in the storage card and in retention/download/archive. | A watering entry from the phone with a photo lands in the plant journal with a frozen snapshot; the storage card shows the bytes; the archive bundle contains the image. |
| **S7 — Cameras** | **Core landed 2026-09-07** — `brain/dsc_brain/cameras.py` + `/cameras/*`, `docs/cameras.md`; five source kinds (USB on the brain · snapshot · MJPEG · RTSP · motionEye satellite Pi), poller with lights-on gate, retention + cap, timelapse, zone-card thumbnail + viewer, Devices › Cameras drawer. Cameras are a `camera` table, not `space_device` rows (those drive energy); `/spaces` carries `cameras[]`. Open: regions, drift check, canopy area, markers, auto entries. Camera device kind on spaces, camera drawer (source, zone, credentials, cadence), snapshot poller, timelapse rows + assembly, live thumbnail on the zone card, plant-region tagging on the reference frame with drift check, canopy-area derived metric with provenance, auto entries with a frame. | A bound camera shows a thumbnail on its zone card within one cadence; timelapse assembles on schedule and appears in Logs; a tagged plant shows canopy cm² on its card with `—` until tagged; a nudged camera marks regions STALE instead of tracking a wrong area. |

Order: S1 → S2 → S3 → S5 → S4 → S6 → S7. S5 before S4 because the Device wall is the operator's loudest open UX finding; S6 before S7 because cameras write into the media and journal model S6 creates.

---

## Open questions for the operator

All six original questions are answered in [Decisions](#decisions-2026-09-07). Remaining small ones, none blocking S1:

1. **Archive on harvest vs on retire.** The plan archives on either; if harvest should also close the tent journal for that run automatically, say so, otherwise the tent snapshot is taken but the tent journal keeps running.
2. **Export formats.** JSON always; CSV assumed wanted for spreadsheets. PDF grow record is not planned.
3. **Airflow display.** m³/h primary with CFM in parentheses on fan rows, or CFM primary because the nameplates are CFM.

## Peer notes

Taken 2026-09-07 for the grouping rationale only; vendor names stay out of the UI (brief §5).

- AROYA: rebuilt app puts devices, rooms, zones and facility configuration under one **Setup** area; user-level settings (notifications, language, biometric login) are separate. Alerts are custom ranges per metric. Sources: [AROYA app rebuild](https://aroya.io/whats-new/rebuilt-aroya-app-streamlines-work-and-keeps-teams-connected), [custom alert ranges](https://aroya.helpdocs.io/article/osm7lh8hfg-setting-custom-alert-ranges), [assigning sensors to rooms and zones](https://aroya.helpdocs.io/article/qf9k1gut4x-video-how-to-assign-sensors-to-rooms-and-zones).
- Growlink: **setpoints** (room-level target + offset + deadband, edited daily by cultivation managers) are deliberately separated from **rules** (set once at commissioning, rarely touched). Configure Equipment and Modules live under a settings cog; devices show Auto/manual state. Sources: [setpoints guide](https://www.growlink.com/setpoints), [portal & app](https://knowledgebase.growlink.com/growlink-portal-app-information), [manual task overrides](https://knowledgebase.growlink.com/mobile-app-manual-task-overrides).
- Home Assistant 2026: Settings menu is Devices & services · Automations & scenes · Areas, labels & zones · Dashboards · People · System · About, with a **Protocols** section (Zigbee, Z-Wave, Matter, Thread) and the sidebar editor on the user's profile page. Sources: [2026.1 release](https://www.home-assistant.io/blog/2026/01/07/release-20261/), [settings menu discussion](https://community.home-assistant.io/t/2026-8-0-settings-menu/1020266), [configuration](https://www.home-assistant.io/integrations/config/).
- TrolMaster Hydro-X: device settings / alarm settings / system settings as three top menus; system holds reset and firmware. Source: [HCS-2 manual](https://manuals.plus/trolmaster/hcs-2-hydro-x-pro-controller-manual).

What was borrowed: user-vs-facility split (AROYA, HA) → **You / The grow / The kit**; setpoints-vs-rules (Growlink) → Climate targets as daily rows, Automation as its own section; protocol grouping (HA) → Zigbee and Firmware as Devices sub-tabs; sidebar editor (HA) → desk order and visibility preference.

## Tracker rows

Logged to the Notion tracker on 2026-09-07 (Area "Settings" unless noted):

1. No operator preference layer (units, theme, landing desk, chart range persistence) — Suggested Feature, High.
2. General tab is prose; subtitle promises "kit language and operator notes" that do not exist — UX Issue, Medium.
3. Leaf-VPD offset has two sources: SPA constant −1.5 °C vs brain `leaf_offset_c` 2 °C — Bug, Medium (Area "Honesty / Live Desks").
4. ~40 hub tunables (hysteresis, min-off, ladder waits, sunrise/sunset, SF1000 ramp, trust thresholds) reachable only via the entity inspector — UX Issue, High.
5. Root steering targets have no UI — Suggested Change, Medium.
6. Sensor clamps are read but `set_global_modifiers` cannot write them — Bug, Low (Area "Brain API").
7. No timezone / NTP / clock-drift surface although photoperiods depend on hub local time — Suggested Feature, Medium.
8. Manual irrigation shot duration is a hardcoded 2 s — Suggested Change, Low.
9. Settings changes are not journaled (only zone flips are) — Suggested Feature, Medium.
10. Settings page has no search or deep-link anchors; 1816-line single file — Workflow Issue, Medium (Area "Architecture").
11. Settings restructure plan (this document) — Suggested Change, High, anchor row.
12. Hub tunables have no brain-side desired copy; brain re-assert covers demand only — Suggested Change, High (added after the operator's decision 4).
13. Journals: per-journal retention, storage sizes, download, download-before-delete, archive on retire/harvest — Suggested Feature, High (decision 6).
14. Grow-journal parity: action types with fields, reminders, manual notes and image upload from the dash, media on disk with retention — Suggested Feature, High.
15. Per-tent fixed-mount IP cameras: live view, snapshot timelapse, plant regions in the fixed frame, canopy-area derived metric — Suggested Feature, High.
