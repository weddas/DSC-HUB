# DSC-HUB brain control recovery — design

> Date: 2026-08-29  
> Status: **approved** 2026-08-29 (user) — implementation plan next  
> Source chat: Professional UI redesign / control honesty  
> Peers consulted: OpenGrowBox (start), plus HAGR, HA-Irrigation-Strategy, Mycodo, GroLab, farmOS, Growlink/AROYA domain language, open-crop-steering (see §Peers)

## Problem

The Pi SPA shows a **status collage**, not an operator desk. Single screens contradict themselves (e.g. Light: “SF1000 ON” vs 0%, Follow 4x8 vs “NO SCHEDULE”, Got hours vs Actual 0.0h). Overview fans/MAT/probe dials do not answer Want/Got/Need. Plant↔probe detach is incomplete.

**Root cause:** after the Pi move, control SoT and UI stories diverged. HA packages that once drove climate / light / demand / roster were treated as legacy while the brain + SPA invented parallel displays. Cosmetics (Pass A/B/C) painted over a broken loop.

**Goal:** fully realize DSC-HUB as grow automation — brain as the advanced successor to HA, SPA as an honest client, hub as failover actuator — with a clear recovery path. Not another polish slice.

## Locked decisions

| # | Decision |
|---|----------|
| Goal floor | Coherence + lifecycle + full product path (not a thin “one slice”) |
| Golden bar | HA-era control behavior + OGB-style “UI matches the room” |
| Control SoT | **Pi brain** — faithful Want→Got→Need→act reimplementation of HA packages, then more advanced (incl. AI later). HA optional/legacy |
| Hub online | Sensors/actuators; obeys brain |
| Hub offline | **Operator manual takeover** (force devices) |
| Reconnect | Hub pushes current sensor + takeover state → brain marks **temporary override** → brain **re-plans** and re-asserts toward wider environment / bigger goal |
| Approach | **Restore-then-advance** (port HA loops to brain; SPA client-only; no dual-run third story) |
| Bar 1 (first ship) | HA-era **parity** on control loops **plus** hub failover (manual takeover + reconnect re-plan) |
| Bar 2 (immediate next) | Plant ↔ probe assign / move / **detach** |
| Later | Advanced brain logic / AI — not before bars 1–2 |
| Physical topology | **Two tents, one shared air plant** — 4x8 (main) + 2x4 (clone) share the same ducting, exhaust, and intake setup (not two isolated OGB rooms) |

## §0 — Physical topology (hard constraint)

DSC is **two grow volumes on one HVAC skeleton**:

- **4x8 (main)** and **2x4 (clone)** are both real tents with their own climate sensors, lights, and plant/probe seats.
- They **share** ducting, **exhaust**, and **intake** (same fan plant / air path — not independent per-tent blowers as in a multi-room OGB install).
- Climate Want/Need must therefore be a **coupled** problem: clone modes like Follow 4x8 / Follow Plants are first-class because air is shared; UI must never imply two disconnected room controllers.
- Fan duties (IN 4x8 / IN 2x4 / EX ROOM / EX OUT) and CFM are labels on **one** shared plant, not four unrelated gadgets.
- Light can still differ per tent (e.g. SF1000 on 2x4 Follow 4x8 photoperiod) while air remains shared.

OGB is a **behavior bar** (UI matches the room loop), not a license to model DSC as N independent rooms.

## §Peers — what other systems teach DSC (not clones)

OGB was a **starting pointer**, not the only reference. Bar-1 design must steal patterns from several lines of work; none replace DSC’s two-tent shared-duct topology.

| Project | What it is | Steal for DSC | Do **not** steal |
|---------|------------|---------------|------------------|
| **[OpenGrowBox](https://github.com/OpenGrow-Box/OpenGrowBox-HA)** | HA integration: label devices by role, hit T/RH/VPD/light/CO₂ targets per “room” | One control loop per grow volume; dashboard = that loop; offline-capable local brain story | Unlimited independent rooms / one HVAC per room (DSC shares ducting) |
| **[HAGR](https://github.com/JakeTheRabbit/HAGR)** | Lived-in HA grow-room packages: VPD climate, ESPHome, dosing, **four-phase crop steering**, consolidated AppDaemon alerts | Package-shaped Want→act; day/night thresholds; **one severity-graded alert** instead of chip spam; leaf vs air VPD honesty | Assuming multi-zone HVAC isolation |
| **[HA-Irrigation-Strategy](https://github.com/JakeTheRabbit/HA-Irrigation-Strategy)** | Autonomous P0→P1→P2→P3 crop-steering irrigation on VWC/EC; grow-day = photoperiod; per-zone **manual override** | Photoperiod-aligned “day”; dryback/VWC as first-class Root SoT (bar 2+/later irrigation); **manual override then rejoin plan** (matches hub takeover) | Full irrigation stack as bar-1 blocker if climate/light still lie |
| **[Mycodo](https://github.com/kizniche/Mycodo)** | Pi environmental regulation: Inputs ↔ Outputs, PID, setpoint tracking over time, timers, notes on graphs | **Single regulation brain** on Pi; every UI widget bound to a real Input/Output/Function; changing setpoints over photoperiod/stage | Generic multi-room without shared-air coupling |
| **[GroLab / Open Grow](https://opengrow.pt)** | Modular hardware: GroNode brain + Power/Tank/Soil modules; store & execute schedules locally | **Brain core + edge modules** (maps to DSC brain + hub/fleet); local schedule execution when link drops | Closed commercial module SKUs as product scope |
| **[open-crop-steering](https://github.com/JakeTheRabbit)** (ecosystem, early) | Versioned immutable cultivation plans + AI runtime behind **hard guardrails** + audit | Later-bar AI: plans versioned, guardrailed, auditable — not free-form chat driving relays | AI in bar 1 |
| **[farmOS](https://github.com/farmos/farmos)** | Open farm **records / planning**, not real-time HVAC | Roster/history/compliance-style records later; don’t confuse with control SoT | Using it as the climate controller |
| **Growlink / AROYA domain** (commercial refs) | P0–P3 irrigation phases, dryback %, VWC/EC steering language | Shared vocabulary for Root honesty (dryback/rate already partial); generative vs vegetative cues | Cloud lock-in or cloning their UI |

### §Premium — what paid platforms sell (worth ≠ wallpaper)

Hobby/open stacks often ship **sensors + toggles + pretty charts**. Premium stacks (AROYA, Growlink, TrolMaster Hydro-X/Pro, Pulse Pro/Hub, TSRgrow GROWHub, and hybrids) charge for **outcomes operators will bet a crop on**:

| What you pay for | How premium does it | DSC implication |
|------------------|---------------------|-----------------|
| **Truth you can act on** | One authority for “is the light on?” / “are we in dryback?” — UI, app, and actuator agree | Kill dual stories (Light ON vs 0%; Follow 4x8 vs no schedule) |
| **Closed-loop steering** | AROYA/Growlink: WC%/EC/dryback → irrigation recipes; not moisture dials for show | Root/Overview must name metrics and drive Need, or stay empty |
| **Local industrial reliability** | TrolMaster: on-prem modular brain, daisy-chain modules, works when cloud dies; backup settings to USB | Matches DSC **brain SoT + hub offline takeover**; never cloud-only control |
| **Calibrated substrate / climate instrumentation** | Purpose-built sensors (Pulse Pro: leaf VPD, PPFD/DLI, CO₂; AROYA substrate) | Prefer honest “no channel” over fake NPK/CFM theater |
| **Recipes + photoperiod as SoT** | Stage/day recipes; sunrise/sunset lighting; grow-day = lights-on cycle | Light Want hours come from schedule engine, not a free-floating 0–24 gauge |
| **Ops / compliance layer** | TSRgrow: energy, batch/GMP-ish reporting, zone light steering at facility scale | Later bars: audit of overrides, not bar-1 blocker |
| **Service without killing the crop** | Hot-swap / remote power / service outside the room (TSRgrow narrative) | Hub/brain restart must not invent contradictory SPA state |
| **Explicit control authority** | Facilities often **combine** TrolMaster (climate/light) + Growlink (irrigation analytics) with **defined who wins** | DSC forbids silent dual-run; brain owns act; SPA never invents a third commander |

**Worth over nothing** = *repeatable harvest confidence*: fewer false alarms, fewer “why is it lying?”, fewer nights babysitting. Wallpaper 3D and contradictory chips are negative value.

### Industrial reliability ∩ sleek 3D (how premium actually splits layers)

Paid products that feel both **industrial** and **modern** almost never put the physics engine inside the glamorous view:

1. **Control plane (boring, sacred)** — setpoints, schedules, interlocks, failover, ack, override. Looks like SCADA/HMI or a dense Pro tablet (TrolMaster), not a game.  
2. **Insight plane** — charts, dryback curves, KPIs, recipes, alerts (Growlink/AROYA/Pulse). Same SoT as (1).  
3. **Presence / spatial plane (optional)** — facility map, twin, light zones (TSRgrow-style visibility). **Read-only projection** of (1), never a second controller.

**DSC rule for Twin / 3D / Overview chrome:** sleek is allowed only as a **projection of brain SoT**. If the twin or Overview cannot cite the same entity the actuator uses, it stays gated or blank with honesty — never a competing story. Shared-duct 4x8+2x4 is one air plant in both the industrial layer and any 3D air-path.

### Cross-cutting lessons for DSC bar 1

1. **One SoT per loop** (Mycodo/OGB/HAGR + premium) — Light hours ON/%/schedule must be one engine; Overview chips must be the same entities.  
2. **Photoperiod defines the grow-day** (Irrigation-Strategy/Growlink) — Follow 4x8 is inheritance of that day, not a sticker.  
3. **Manual override is first-class** (Irrigation-Strategy / TrolMaster local) — hub takeover + brain re-plan, not silent fight.  
4. **Consolidated trust** (HAGR grow_monitor) — prefer one honest alert story over contradictory status pills.  
5. **Topology beats templates** — peers with N rooms still don’t excuse modeling 4x8+2x4 as two HVAC islands when ducting is shared.  
6. **3D never owns control** (premium split) — Twin/Overview are projections or they stay gated.

## §1 — Control ownership (SoT)

**One brain, one story.** Brain owns Want → Got → Need → act for climate, light/photoperiod, demand, and roster-derived targets. Loop is a faithful port of working HA packages, then free to grow past HA.

**Hub** is not a rival brain. Online: stream + obey. Offline: manual takeover only. Reconnect: sensor/override ingest → temporary override → re-plan → re-assert.

**SPA** is a client of that loop only. Live surfaces must show the same on/off, schedule, hours, and demand the brain uses — or an explicit empty/override state. No third invented gauge story.

## §2 — Surface map (what “parity” means)

### In bar 1 (must match room / brain SoT)

| Surface | Parity means |
|---------|----------------|
| **Light / SF1000** | One schedule SoT (incl. Follow 4x8 vs independent). ON/OFF/% and “hours Got/Want/Actual/Deviation” all from the same photoperiod engine. “No schedule” only when brain truly has none — never while claiming Follow 4x8 / Auto photoperiod ON |
| **Climate** | Demand tiles and RUNNING chips reflect brain commands + hub ack; Want bands from stage/roster; no orphan “Follow X” chrome without a live mode SoT. **Coupled tents:** 2x4 vs 4x8 modes must match shared-duct policy (Follow 4x8 / Follow Plants), not two solo room loops |
| **Overview** | Climate arcs (2x4 + room/4x8), fan %, RUNNING (incl. MAT), Root strip are **labels of the same entities** the control loop uses — not a second dashboard math. Fan row = shared air plant. Probe % must name the metric (e.g. moisture) and seat meaning (plant vs station) |
| **Root (kit probes)** | Got soil from brain/fleet enrich; trust chips from real binaries; no peer/stage lies |
| **Honesty rail** | Gaps only when dual SoT (helper vs fleet) actually disagree; never as decoration |

### Explicitly out of bar 1

- Plant↔probe detach/reassign UX completeness → **bar 2**
- Twin / WebGL theater, experimental Sankey, AI planning → later
- Cosmetic IA renames without SoT fix

### Bar 2

- Assign plant ↔ probe, move, **detach/remove probe from plant** with roster + inventory + Live chrome updating without hard reload
- Idle probe-station role remains distinct from plant seat

## §3 — Data flow and failover

```text
[Sensors/actuators on Hub]
        │  telemetry (always when linked)
        ▼
   ┌─────────┐  commands (when brain linked)   ┌──────────────┐
   │   Hub   │ ◄────────────────────────────── │    Brain     │
   │         │  offline: operator forces I/O   │ Want→Got→    │
   │         │ ──────────────────────────────► │ Need→act     │
   └─────────┘  reconnect: snapshot sensors +  │ (+ later AI) │
                takeover flags                 └──────┬───────┘
                                                      │
                                                      ▼
                                               ┌──────────────┐
                                               │  SPA client  │
                                               │ read + cmds  │
                                               └──────────────┘
```

**Reconnect contract**

1. Hub sends last-known sensor snapshot + “manual takeover active” + forced device states.  
2. Brain does **not** silently discard takeover; it records a **temporary override**.  
3. Brain recomputes Want/Need from roster/stage/environment and **re-asserts** commands (override expires by policy — time and/or operator clear — exact policy in implementation plan).  
4. SPA shows override vs brain-plan explicitly until clear.

**Anti-pattern (forbidden):** SPA or Overview computing “Got hours” / “ON” from a different entity than Light’s control path.

## §4 — Acceptance and testing

### Bar 1 done when

1. Light page: no contradictory ON/%/schedule/hours on one load; Follow 4x8 has a real parent schedule or honest empty.  
2. Overview RUNNING / fans / MAT / SF1000 agree with Climate/Light for the same tick.  
3. Hub link drop → operator can force devices; reconnect → brain logs override and re-asserts; SPA shows that story.  
4. Spot-check against HA-era package behavior notes (reference docs in repo / archived packages) for climate demand + photoperiod.  
5. Peer bar: “would a grower trust this page against the room?” (OGB/Mycodo/HAGR honesty) — yes for Light, Climate, Overview; shared-duct coupling visible, not two solo rooms.

### Bar 2 done when

- Detach probe from plant and reassign without hard reload; Root/Roster/Compose stay coherent.

### Non-goals (this design)

- Replacing brain with OGB, Mycodo, GroLab, or HAGR as the product  
- Modeling 4x8 and 2x4 as **independent** HVAC rooms (they share ducting / exhaust / intake)  
- Dual-running HA + brain as equal controllers  
- More SPA polish passes before bar 1  
- Shipping full P0–P3 irrigation stack before climate/light parity (Irrigation-Strategy is a **later** Root depth reference)

## Implementation sequencing (high level)

1. **Inventory** HA package loops (light schedule, climate demand, photoperiod Follow, **shared-duct / Follow 4x8 climate**, roster→Want) vs current brain emitters — gap list only, no UI paint.  
2. **Single control API** on brain for those loops; SPA binds Live pages to it.  
3. **Kill third stories** (duplicate hour math, summary chips that ignore MAD/schedule SoT).  
4. **Hub failover protocol** (manual takeover + reconnect override).  
5. **Bar 1 verify** on Pi against room.  
6. **Bar 2** plant↔probe lifecycle.  
7. Only then: advanced brain / AI.

Detailed task breakdown belongs in the implementation plan (writing-plans), after this spec is approved.

## Open points for the plan (not blockers for this design)

- Exact override expiry policy (timeout vs explicit clear vs both).  
- Whether residual HA helpers remain as read-through mirrors during port or go dark immediately.  
- Named HA package files / commits that define “golden” photoperiod + demand (to be listed in the plan inventory step).
