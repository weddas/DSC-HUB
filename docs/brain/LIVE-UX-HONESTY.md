# Live UX honesty program (Light → Climate → Overview → Pass 4 Twin)

**Intent:** Keep operator Live desks behaviorally honest — gauges/chips/labels match real Want→Got fleet state; Expected/stage rails never read as live plant or live lamp; both tents stay at the same development point.

**Tip:** `ca106d7` · spa-dist `index-BEjnawnp.js` (+ `calibrate-DcOg5koY.js` · `tune-fleet-B5F45eEz.js`)  
**Status:** Pass 1 Light **gate green** · Pass 2 Climate **gate green** · Pass 3 Overview **gate green**. Passes 1–3 program **closed**. **Pass 4 Twin-first Phase A code landed** (Tasks 1–3: walk scaffold, hybrid Got, Light Twin + DutyStrip Actual) — **not** Phase B/C/gate green (no Pi smoke, no filled walk gate, GPIO5 still reserved). Pass 5 remains stub.

**Spec / plan:**  
[`../superpowers/specs/2026-09-01-live-ux-honesty-program-design.md`](../superpowers/specs/2026-09-01-live-ux-honesty-program-design.md) ·  
[`../superpowers/plans/2026-09-01-live-ux-honesty-program.md`](../superpowers/plans/2026-09-01-live-ux-honesty-program.md) ·  
Pass 4: [`../superpowers/specs/2026-09-01-live-ux-pass4-twin-integrated-design.md`](../superpowers/specs/2026-09-01-live-ux-pass4-twin-integrated-design.md) ·  
[`../superpowers/plans/2026-09-01-live-ux-pass4-twin-integrated.md`](../superpowers/plans/2026-09-01-live-ux-pass4-twin-integrated.md) ·  
Pass 4 reports: [`.superpowers/sdd/pass4-task-2-report.md`](../../.superpowers/sdd/pass4-task-2-report.md) · [`.superpowers/sdd/pass4-task-3-report.md`](../../.superpowers/sdd/pass4-task-3-report.md) ·  
Task 8: [`.superpowers/sdd/task-8-report.md`](../../.superpowers/sdd/task-8-report.md) ·  
Task 9: [`.superpowers/sdd/task-9-report.md`](../../.superpowers/sdd/task-9-report.md)

## Architecture

```mermaid
flowchart LR
  subgraph desks [Live desks]
    L[Light Pass 1]
    C[Climate Pass 2]
    O[Overview Pass 3]
  end
  subgraph p4 [Pass 4 Twin-first]
    A[Phase A Twin software]
    B[Phase B re-walk inventory]
    Cdebt[Phase C debt closeout]
    G[Full-stress gate + FOLLOWUPS]
  end
  subgraph prove [Per-desk prove]
    py[pytest honesty module]
    http[Pi HTTP burst]
    br[Browser matrix + screenshots]
    walk[Fill LIVE-UX-*-WALK]
  end
  L --> py --> http --> br --> walk
  walk -->|gate green| C
  C --> py
  walk -->|gate green| O
  O --> py
  walk -->|Passes 1-3 closed| A
  A --> B --> Cdebt --> G
  fleet["/fleet + /fleet/computed"] --> L
  fleet --> C
  fleet --> O
  twinEnt["light.dsc_hub_twin_sf1000"] --> A
  journals["/journal/* /rooms /energy/*"] --> L
  journals --> O
  zigbee["zigbee_policy_state"] --> C
```

| Pass | Desk | Walk | Pytest | Tip status |
|------|------|------|--------|------------|
| 1 | Light | [`LIVE-UX-LIGHT-WALK-2026-09.md`](../qa/LIVE-UX-LIGHT-WALK-2026-09.md) | `test_live_ux_light_honesty.py` | **GREEN** (prove spa was `index-DYFvyI2i.js`) |
| 2 | Climate | [`LIVE-UX-CLIMATE-WALK-2026-09.md`](../qa/LIVE-UX-CLIMATE-WALK-2026-09.md) | `test_live_ux_climate_honesty.py` | **GREEN** (live spa was `index-CzcL7cKc.js`) |
| 3 | Overview | [`LIVE-UX-OVERVIEW-WALK-2026-09.md`](../qa/LIVE-UX-OVERVIEW-WALK-2026-09.md) | `test_live_ux_overview_honesty.py` | **GREEN** (`index-C8GkS5XE.js` · Task 9 prove) |
| 4 | Twin-first integrated | [`LIVE-UX-PASS4-WALK-2026-09.md`](../qa/LIVE-UX-PASS4-WALK-2026-09.md) (scaffold; Phase A code landed, prove pending) | `test_live_ux_pass4_twin.py` | **Phase A code** on `ca106d7` — B/C/gate **open** |
| 5 | Follow-up | — | — | **stub** after Pass 4 gate |

Screenshots: `docs/qa-screenshots-2026-09-01-live-ux/`. Evidence: `.audit/live-ux-light-prove-evidence.json` · `.audit/live-ux-climate-prove-evidence.json` · `.audit/live-ux-overview-prove-evidence.json`.

## Shared honesty contract

| Rule | Meaning |
|------|---------|
| Want→Got→Need | Bind to fleet/brain; missing → grey / OOS / unbound — never fake live |
| Expected ≠ live | Stage rails / calendar / draft tones are Expected only |
| Kit capacity | pot3/4 in `planned_oos` only — never Capacity offline lead |
| Cross-desk | Overview photoperiod glance matches Light SoT; Climate Mode ≠ Light schedule Follow chips |
| Wet vs Problem | Wet/Dry = raw sensor; Problem/Clear only from bound `policy_state` |
| Energy | Estimates labeled; suggestions `apply: false`; shift needs `confirm=true` |
| Journals | Provenance chips (`plant`/`space`/`room`/`core`); observations only |
| History ≠ live | Grow-log amber rows are past notables — not live `critical_banners` |
| Twin PWM | Software entity may be live; **never claim physical GPIO5 wire-up** until operator confirms |

## Pass 1 — Light (codepaths)

| Guard | Codepath |
|-------|----------|
| Estimate label + suggestions never apply | `GET /energy/estimate` · `GET /energy/suggestions` (`estimate_label`, `apply: false`) |
| Shift confirm gate | `POST /energy/shift/plan` with `confirm: false` → `400` |
| Space journal provenance | `POST/GET /journal/space/{4x8\|2x4}` → `provenance=space`, `source=operator` |
| SPA | `LightPage`, `LightEnergyPanel`, `TentOccupancyJournal`, Twin/SF1000 OFF honesty, DLI calibrate CTA |

Prove script: `.audit/live-ux-light-prove.ps1`. Both tents required.

**Pass 4 Phase A tip honesty (4×8 Got hybrid):** When Twin is available + history healthy, brain prefers `twin_sf1000_on` (else brightness) hours and emits `got_source=twin|window` on `sensor.dsc_lights_on_today_4x8`. SPA DutyStrip Actual binds Twin when available; window binary only when Twin absent. GPIO5 remains **reserved** (not wired).

## Pass 2 — Climate (codepaths)

| Guard | Codepath |
|-------|----------|
| pot3/4 planned OOS | `dash_computed._reduced_kit` — `planned_oos` contains POT3/POT4; `offline` must not |
| Wet without recipe ≠ problem | `zigbee_policies.evaluate_device_policies` with `recipe_id=none` → no `policy_state` row |
| `problem_when=inactive` | Wet/`occupancy: true` → `active=true`, `problem=false` |
| SPA | Zone All/4×8/2×4/Room; Climate Mode chips; air-only `FlowSankey`; canopy unbound never fills; Wet/Dry + Problem/Clear chips |

Prove script: `.audit/live-ux-climate-prove.ps1`. **Parked (Pass 4 Phase C):** `AirPathMap` still synthesizes cascade from `intakeClone` (lines ~106–111) even though `FlowSankey` uses `sensor.dsc_cfm_cascade_2x4_allocated`.

## Pass 3 — Overview (codepaths)

### API guards (pytest)

| Guard | Codepath |
|-------|----------|
| Rooms seed | `GET /rooms` → 200; kit `grow_room` present (`room_model.ensure_kit_rooms`) |
| Room journal | `GET /journal/room/grow_room` → 200 |
| Core journal | `GET /journal/core` → 200 |
| Health | `GET /health` → 200 |

### SPA honesty (Task 8 — `0d95cdb` / spa `index-C8GkS5XE.js`)

```mermaid
flowchart TB
  overview[OverviewPage]
  photo[Photoperiod glance TentLightClockStrip]
  roomJ[RoomJournal provenance tones]
  coreJ[CoreJournal provenance tones]
  root[DashRootTankSection isPotInServiceWithFleet]
  grow[DashGrowLog history caption]
  banners[critical_banners live policy]
  fleet["/fleet inventory + helpers"]
  jr["/journal/room|core"]
  overview --> photo
  overview --> roomJ
  overview --> coreJ
  overview --> root
  overview --> grow
  overview --> banners
  fleet --> root
  jr --> roomJ
  jr --> coreJ
  photo -->|same SoT| lightDesk[Light desk clocks]
```

| Honesty gap | Codepath | Behavior |
|-------------|----------|----------|
| Photoperiod glance | `OverviewPage.tsx` + `TentLightClockStrip` | Caption: glance-only, same schedule SoT as Light (incl. Follow 4×8); edit on Light desk |
| Room journal provenance | `RoomJournal.tsx` | Native `room` = ok tone; space rollup = warn; plant = muted; space/plant id chips; Save disabled until note text |
| Core journal provenance | `CoreJournal.tsx` | Native `core` = ok; room/space/plant rollups toned; Save enable hint; empty state |
| Root strip OOS | `DashHomeSections.DashRootTankSection` | `isPotInServiceWithFleet` — OOS forces muted chip + NaN gauge (“No data”), never leftover Got |
| Grow log vs critical | `DashGrowLog` | Caption: amber rows = past notables, **not** live policy banners (`system.critical_banners`) |
| Bands legend | Overview HelpTip + bands subtitle | Grey = no data **or** out of service |

### Pi prove (Task 9 — tip `2d44c52`)

| Item | Path |
|------|------|
| Prove script | `.audit/live-ux-overview-prove.ps1` (+ `.sh` helper + Playwright screenshots) |
| Evidence | `.audit/live-ux-overview-prove-evidence.json` (all gates `ok: true`) |
| Walk | [`LIVE-UX-OVERVIEW-WALK-2026-09.md`](../qa/LIVE-UX-OVERVIEW-WALK-2026-09.md) — G0–G9 **pass** |
| Live index sha256 | `40ec4848fb8974335be024a91897c507c393edb500826dde244d7434c93cea25` |

**Proven live:** KIT HONEST / hub.online / canopy bound; empty `critical_banners` vs grow-log history caption; Overview photoperiod glance parity with Light SoT (both tents + Follow chip); Room/Core journals list + provenance; root/bands/fan OOS greying.

**Parked into Pass 4 Phase C (still open on tip):** Overview moisture band hardcodes 30–70 vs Root Want (`GAUGE-P0-1`); DutyStrip Actual vs ON (`SV-P1-6`); `AirPathMap` cascade ← intake alias.

## Pass 4 — Twin-first integrated (Phase A code; B/C/gate open)

**Do not invent gate green.** Tip `ca106d7` landed Phase A Tasks 1–3 (code + unit tests). Task 4 Pi smoke, Phase B re-walk, Phase C parks, and gate prove remain open.

```mermaid
flowchart TD
  A[Phase A Twin PWM software] -->|Tasks 1-3 code| Aok[Hybrid Got + DutyStrip Twin]
  Aok --> B[Phase B integrated re-walk]
  B -->|findings table| C[Phase C debt closeout]
  C --> G[Gate: pytest + Pi HTTP + browser]
  G --> F[FOLLOWUPS dated write-up required]
  F -->|green| P5[Pass 5 stub brainstorm]
```

| Phase | Intent | Verified tip `ca106d7` | Still open |
|-------|--------|------------------------|------------|
| A | Twin software as if present | Hybrid `got_hours_4x8` + `got_source`; ingest `twin_sf1000_on`+brightness; Light Twin honesty + DutyStrip Actual; pytest `test_live_ux_pass4_twin.py`; walk scaffold | Task 4 Pi smoke / optical not required |
| B | Inventory re-walk | Walk file present (scaffold) | Findings table empty |
| C | Clear B + named parks | Parks still open in source | SV-P1-6 2×4 / AirPathMap cascade / GAUGE-P0-1 |
| Gate | Full stress | Prove scripts not landed | `.audit/live-ux-pass4-prove.*` + FOLLOWUPS gate write-up |

### Twin hybrid codepaths (verified Phase A)

```mermaid
flowchart TB
  twin[light.dsc_hub_twin_sf1000] --> ingest[esphome_client twin_sf1000_on + brightness]
  ingest --> hist[(hub history)]
  hist --> hybrid["_got_hours_4x8_hybrid"]
  window[window_4x8_open] --> hybrid
  hybrid -->|available + healthy| twinGot[got_source twin]
  hybrid -->|else| winGot[got_source window]
  twinGot --> sensor[sensor.dsc_lights_on_today_4x8]
  winGot --> sensor
  sensor --> spa[LightPage Got chip + honesty]
  twin --> duty[DutyStrip Actual entity]
  twin -->|unavailable| dutyWin[DutyStrip window binary]
```

| Layer | Path | Behavior today |
|-------|------|----------------|
| Firmware | `firmware/v4/dsc-hub-v4_0.yaml` | LEDC GPIO5 → `light_twin_sf1000` / HA `light.dsc_hub_twin_sf1000`; PWM module must be wired for live optical brightness |
| Brain map | `hub_controls.py` | `twin_sf1000` ↔ `light.dsc_hub_twin_sf1000` |
| History | `esphome_client.py` + `history_ops.py` | Records `twin_sf1000_on` (0/1) + `twin_sf1000_brightness`; DutyStrip maps Twin → `twin_sf1000_on` |
| Got hours | `computed_ops._got_hours_4x8_hybrid` → `light_loop.emit_light_loop` | Prefer Twin on-hours when entity available + ≥1 Twin sample since midnight; else window; attrs `got_source` + window-fallback honesty |
| SPA Light | `LightPage.tsx` (`index-BEjnawnp.js`) | Twin toggle+brightness; `Got · Twin` / `Got · Window` chip; DutyStrip Actual = Twin when available; GPIO5 **reserved** copy |
| Tests | `brain/tests/test_live_ux_pass4_twin.py` | Hybrid prefer/fallback + ingest + ENTITY_METRIC_MAP |
| Ops SoT | [`../ops/TWIN-SF1000.md`](../ops/TWIN-SF1000.md) | Entity map + GPIO5 handoff |

**Healthy history caveat:** first poll after local midnight may briefly fall back to window until ingest writes a Twin point — SPA chip warns `Got · Window`.

**Operator handoff:** Hub **GPIO5** = reserved Twin SF1000 PWM module — software treats Twin as live actuator; never claim physically wired until operator confirms. Expand at Pass 4 gate (Task 7).

## Developer verify

```bash
cd brain
python -m pytest \
  tests/test_live_ux_light_honesty.py \
  tests/test_live_ux_climate_honesty.py \
  tests/test_live_ux_overview_honesty.py \
  tests/test_live_ux_pass4_twin.py \
  tests/test_light_loop.py -q
```

Windows Pi prove (after `build:spa` + plink/pscp hotpatch):

```powershell
.audit/live-ux-light-prove.ps1
.audit/live-ux-climate-prove.ps1
.audit/live-ux-overview-prove.ps1
# Pass 4: .audit/live-ux-pass4-prove.ps1 when Task 4/7 land
```

## Ops pitfalls

- Advance desks only when the prior walk is **fully filled** and gate green — pytest alone is not enough (Pass 3 pytest is only G6).
- Hotpatch with PuTTY `pscp`/`plink` `-batch -hostkey` (OpenSSH `scp` password-hangs in agent shells).
- Restore any schedule stress; leave **no** active shift plans / pending flips.
- Never paste Pi passwords, API keys, or Wi-Fi secrets into walks / FOLLOWUPS / Wiki.
- Do not conflate Climate Mode Follow 4×8 with Light schedule Follow 4×8 — different desks, different chips.
- Grow-log amber ≠ Overview `critical_banners` / `dsc-banner--critical-live`.
- Pass 4 Phase A **code** ≠ Pass 4 **gate green** — need Pi smoke + filled walk + FOLLOWUPS gate write-up.
- Twin entity available ≠ optical PWM wired — GPIO5 reserved until physical handoff.
- Cold/unhealthy Twin history → honest window Got (chip + sensor attrs), not silent Twin hours.

## Related

- [`SPACE-ENERGY-JOURNAL.md`](SPACE-ENERGY-JOURNAL.md) — journal/energy HTTP SoT  
- [`PHOTOPERIOD-TIMELINE.md`](PHOTOPERIOD-TIMELINE.md) — Light clocks/SVG  
- [`WEBUI.md`](WEBUI.md) — SPA routes  
- [`../ops/TWIN-SF1000.md`](../ops/TWIN-SF1000.md) — Twin entity / GPIO5 ops  
- Notion [Local webserver UI](https://app.notion.com/p/3b52b4cda37081c19048e794d4bdf819) · [Pi offline brain](https://app.notion.com/p/3b52b4cda370818e8b66f671689f7a57) · [Photoperiod & Lighting](https://app.notion.com/p/39c2b4cda3708194a606fa0b1e6098a2)
