# DSC-HUB brain control recovery — design

> Date: 2026-08-29  
> Status: draft for user review (brainstorm locked; not yet implemented)  
> Source chat: Professional UI redesign / control honesty  
> Peers consulted: OpenGrowBox (room-loop), HAGR (VPD + crop-steering shape)

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
5. OGB bar: “would a grower trust this page against the room?” — yes for Light, Climate, Overview.

### Bar 2 done when

- Detach probe from plant and reassign without hard reload; Root/Roster/Compose stay coherent.

### Non-goals (this design)

- Replacing brain with OGB product  
- Modeling 4x8 and 2x4 as **independent** HVAC rooms (they share ducting / exhaust / intake)  
- Dual-running HA + brain as equal controllers  
- More SPA polish passes before bar 1

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
