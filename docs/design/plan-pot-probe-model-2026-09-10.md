# Plan — Pot / probe / plant / station data-model decoupling

**Date:** 2026-09-10
**Status:** Design / not started
**Tracker rows:** the "'Probe 2' means two different entities at once" bug; the operator note "every pot will have a probe… no longer the case"
**Author:** live-8.2.0 walkthrough

---

## 1. Current model (verified in `brain/dsc_brain/plant_probe.py`)

> "Probe = hardware **potN**. Plant = durable **UUID** (migrated from legacy slot:N). Assignment = inventory `extra.assigned_plant_id` plus a **pot-keyed roster row** while live. `idle_home` remains **Soil Test dock only** — never use it as plant assignment."

So today:
- The hardware sensor node is **`potN`** (pot1–pot4); the UI calls it **"Probe N"**.
- A **plant** (UUID) is assigned to a `potN` via `extra.assigned_plant_id` + a pot-keyed roster slot.
- `idle_home` is a separate "Soil Test dock" concept — but the Root "thereabouts" panel surfaces it as **"Probe 2 · IDLE · HOME DARK · Home Probe 1"**.

## 2. Why it hurts (observed live)

- **"Probe 2" denotes two different things at once**: an IDLE mobile station homed in 2×4 (thereabouts: `HOME DARK / READING STALE / Home Probe 1`) **and** the live 4×8 Grandmommy Purple probe (`READING LIVE`, pH 6.20). Same label, contradictory state.
- The name **`potN` conflates three concepts**: the *device*, the *probe*, and the *pot/vessel*. The model assumes 1 pot ⇒ 1 probe ⇒ 1 plant.
- The operator has stated this assumption is now false: **not every pot has a probe**; probes can be **mobile** (spot-check), and pots/plants don't map 1:1 to the four `potN` nodes.

## 3. Target model (separate the four concepts)

| Entity | Is | Identity | Notes |
|---|---|---|---|
| **Seat** | a hardware endpoint (the ESPHome node currently called `potN`) | `seat_id` | already exists; keep as the device layer |
| **Probe** | a soil sensor | `probe_id` | may be **fixed** at a seat or **mobile** (spot-check); has a live reading + trust/dark state |
| **Pot / vessel** | a growing container | `pot_id` | holds a plant; may or may not have a fixed probe |
| **Plant** | the durable grow subject | `plant_uuid` (exists today) | lives in a pot; read by whichever probe is in that pot |
| **Station / dock** | a home for a mobile probe | `station_id` | the current `idle_home` "Soil Test dock" — **never** a plant assignment |

**Relationships:** plant → pot (1:1 while planted) · pot → probe (0..1, the probe currently reading it) · probe → seat *or* station (where it physically is) · a plant's readings come from the probe in its pot, whichever that is.

The key change: **a plant's soil data is sourced by "the probe currently in this plant's pot," not by a fixed `potN`.** A mobile probe placed in a pot for a soil test temporarily becomes that pot's probe; when returned to its dock it's a station-homed probe again — and the UI must never show the two roles under one ambiguous "Probe N".

## 4. Design

**Brain**
- Introduce `probe_id` and `pot_id` distinct from `seat_id`; keep `plant_uuid`. `plant_probe.py` becomes the **plant↔pot↔probe** SoT (it's already "Bar 2" for plant↔probe).
- Resolve a plant's readings through `pot → current probe → reading` rather than `potN` directly.
- Keep `idle_home`/station strictly as a dock; a station-homed probe reports "thereabouts (last known at dock)", clearly typed, never as a plant reading.
- Reading-trust (`sensor_trust.py`, the dark timer) attaches to **probe_id**, so "probe dark" follows the physical probe wherever it is.

**SPA**
- Disambiguate labels: a plant card shows the **plant + its pot + the probe currently reading it** (e.g. "Grandmommy Purple · Pot 2 · Probe P-2 (live)"); the thereabouts panel shows **mobile probes at their docks** with a distinct badge and id — never the same "Probe 2" string.
- Roster shows plant→pot; a pot with no probe shows an honest "no probe in this pot" state instead of faking one.

## 5. Migration (must be non-destructive on a live grow)

- Today's `potN` seats map 1:1 to seat=probe=pot for the existing kit; generate `probe_id`/`pot_id` from the current `potN` so nothing moves on day one.
- `migrate_legacy_plant_ids()` already migrated slot:N → UUID; extend the same pattern to emit the new pot/probe ids.
- Existing `extra.assigned_plant_id` + pot-keyed roster rows carry over unchanged; the decoupling only *adds* the ability for a probe to be mobile / a pot to lack a probe.

## 6. Edge cases

| Case | Handling |
|---|---|
| Pot with no probe | plant card shows "no probe — soil data unavailable" (honest hole), steering withholds per-pot dryback |
| Mobile probe placed in a pot for a soil test | that probe becomes the pot's probe for the session; its readings attribute to the plant, tagged "spot check" |
| Probe returned to dock | reverts to station-homed "thereabouts"; the pot goes back to no-probe (or its fixed probe) |
| Two probes near one pot | explicit "which probe reads this pot" selection; never auto-guess |
| Re-assign a probe that still claims a roster row | `release_conflicting_slot_pots()` already handles the stale-claim cleanup — extend to the pot/probe split |
| Heat-mat / steering that "relies on probe N" | rebind those to `pot_id` (the plant's pot), so control follows the plant, not the node number |

## 7. Test plan

- Model: plant↔pot↔probe↔station relationships round-trip; a plant with no probe; a mobile probe moving dock→pot→dock; two plants, one shared mobile probe over time.
- Non-destructive migration: current live kit (pot1=Runtz Punch, pot2=Grandmommy Purple) produces identical desks after migration.
- UI: no surface renders the same id for a station and a live plant probe (regression for the collision bug).
- Trust: "probe dark" follows the probe across seat/dock/pot moves.

## 8. Open questions (operator's call)

1. Is a pot's probe ever **auto**-inferred (by proximity/last-in) or always an explicit bind?
2. Should the four `potN` nodes keep fixed probes by default, with mobile probes as the exception, or is everything mobile-by-default now?
3. Naming shown to the operator — "Pot 2 / Probe P-2", or plant-name-first with pot/probe as secondary?
4. Does steering/heat-mat bind to the pot (follows the plant) or stay node-bound? (Recommend pot-bound.)
