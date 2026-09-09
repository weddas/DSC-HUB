# Plan — Estimated DLI (fixture PPFD map × delivered photoperiod)

**Date:** 2026-09-10
**Status:** Design / not started
**Tracker row:** "Opportunity: estimate DLI from the fixture's maker PPFD map x photoperiod hours…"
**Author:** live-8.2.0 walkthrough

---

## 1. Problem / opportunity

DLI (Daily Light Integral, mol/m²/day) is the single most important light metric for a grow, and right now every desk shows **"DLI unavailable — needs canopy PPFD — no PAR sensor and no fixture calibration."** A permanent blank on the headline light number is a big gap.

We can produce an **estimated** DLI from data/assets that already exist, in the app's established "honest estimate" style (cf. energy "not a bill"), without any new hardware.

## 2. Current state (verified 2026-09-10)

- The lights catalog **has the fixture**: `GET /v1/catalogs/lights?q=sf1000` → `spider_farmer_sf1000` ("SF1000 100W Full"). List items are minimal (`id,name,brand,kind`); the photometric/PPFD-map payload is **not yet transcribed** — the Light page confirms: "No CannaLib record for spider_farmer_sf1000 yet. Import the light in Kit › CannaLib and transcribe its map before this card can draw it."
- A **PPFD asset store exists**: `GET /dsc-catalog/ppfd/` → 200. Fixture PPFD maps are "local static assets under /dsc-catalog/ppfd/, never vendor hotlinks" (Integrations page).
- A **PPFD map card + placement logic already exist** (`frontend/.../ppfdField.ts` twin placement rules; the Light "maker PPFD map" card reads the CannaLib lights store via the brain proxy).
- Zone light config is known: fixture per zone (`extra.catalog_id`), intensity (SF1000 100%), photoperiod (12h rail), nameplate watts (SF1000 100W; the 4×8 "fixture (nameplate)" 480W has **no catalog record**).
- The Light desk already tracks **delivered** light-hours vs want ("Got / Want h", "Deviation today -7.85h").

## 3. Inputs required to compute canopy PPFD → DLI

```
PPFD_canopy (µmol/m²/s) = mapLookup(fixture.ppfd_map, canopy_point, ref_height)
                          × (dim_pct / ref_dim_pct)
                          × heightScale(canopy_distance, ref_height)   # see §5
DLI (mol/m²/day)        = PPFD_canopy × light_seconds_delivered / 1e6
```

- `fixture.ppfd_map` — transcribed maker grid (PPFD at grid positions, at a reference height + reference dim %). **This is the missing asset today.**
- `canopy_point` — center of canopy (or per-plant position from the twin placement rules already in `ppfdField.ts`).
- `canopy_distance` — fixture-to-canopy height. **Operator input** (no rangefinder); default to the maker's reference height with a caveat.
- `dim_pct` — from the light state (SF1000 100%).
- `light_seconds_delivered` — from the Light desk's tracked delivered hours (running DLI) and the scheduled remaining hours (projected end-of-day DLI).

## 4. Tiered honesty (which number to show, given what's available)

| Tier | Available | DLI shown |
|---|---|---|
| **0 (today)** | no PAR sensor, no transcribed map | `—` "DLI unavailable — import the fixture PPFD map, or add a PAR sensor" (already honest — just make the CTA actionable) |
| **1** | transcribed maker map + operator canopy height | `~X mol · estimate (SF1000 map @ 45 cm, 100%)` — running (delivered) + projected (end-of-day) |
| **2** | PAR sensor at canopy | measured PPFD → real DLI, labelled "measured" |

The feature ships Tier 1; Tier 0 stays as the honest fallback; Tier 2 is future (PAR sensor).

## 5. The hard part — height scaling

Maker maps are published at one or two reference heights (e.g. 12"/18"). Real canopy distance varies. Options:

- **(A) Map-per-height**: transcribe the maker's maps at each published height; interpolate between them. Most accurate; more transcription.
- **(B) Single map + inverse-square scale**: `heightScale = (ref_height / canopy_distance)²`, valid only in the far field and over-corrects near the panel. Cheap but must be labelled "approx".

**Recommendation:** support (A) when multiple maps are transcribed, fall back to (B) with a visible "approx (single-height map)" caveat. Never hide which one is in use — this is the honesty line.

## 6. Edge cases

| Case | Behaviour |
|---|---|
| Fixture not in catalog (the 4×8 480 W fixture) | `—` "no catalog record for this fixture — import it in Kit › CannaLib" |
| Catalog fixture but no transcribed map | `—` "import the fixture's PPFD map" (Tier 0) |
| No canopy height entered | Use maker reference height, label "at maker ref height — set your canopy distance for accuracy" |
| Multiple fixtures over one zone | Sum PPFD contributions at the canopy point |
| Dim % unknown / fixture off | DLI = running delivered only; if off all day → 0 with "lamp off today" |
| Photoperiod crosses midnight / changed mid-day | Use **actual delivered** seconds (Light desk already computes this), not scheduled, for the running number; show projected separately |
| Implausible PPFD from a bad map (e.g. >2000 at canopy) | plausibility clamp + `—`+reason (reuse the brain plausibility layer) |

## 7. Surfaces

- **Light desk DLI card** (primary) — running DLI, projected end-of-day, target band for the stage, and the provenance line.
- **Overview / Climate DLI slot** (currently "DLI unavailable") — the running estimate.
- **Per-plant** (optional, later) — using the twin placement point per plant (`ppfdField.ts`).

## 8. Implementation sketch

**Content/asset**
- Transcribe the SF1000 maker PPFD map into `/dsc-catalog/ppfd/spider_farmer_sf1000.*` (the store + card path already exist). Define the map schema (grid, ref height(s), ref dim %, units).

**Brain**
- Per-zone `estimated_dli` computed field: mapLookup × dim × heightScale × delivered/projected seconds; `basis`, `estimate`, `tier` fields; plausibility clamp. Compute brain-side so all desks agree (single source, cf. the Want-band drift lesson).
- Add a per-zone `canopy_distance_cm` setting (Settings › Light or the Calibrate flow).

**SPA**
- DLI cards read the brain field; render running + projected + band + provenance; the Tier-0 CTA deep-links to Kit › CannaLib import / Calibrate.
- Reuse `ppfdField.ts` for per-plant placement (later).

## 9. Test plan

- Unit (brain): map lookup at center vs edge; dim scaling; height scaling (A interpolation, B inverse-square) with the "approx" flag; delivered-vs-projected split; multi-fixture sum; plausibility clamp; all honest-hole cases → `—`+reason.
- Content: SF1000 map transcription validated against the maker datasheet at the reference height.
- Live: 4×8 (480 W fixture, no catalog record) → Tier 0 honest message; 2×4 (SF1000, once mapped) → Tier 1 estimate that tracks the delivered hours across the photoperiod.

## 10. Open questions (operator's call)

1. Where does canopy distance get entered — Settings › Light per zone, or during the Calibrate walk?
2. Transcribe SF1000 maps at how many heights (accuracy vs effort)?
3. Show DLI target band per stage from the catalog/`want` profile, or a fixed veg/flower default?
4. The 4×8 480 W fixture has no catalog id — import it, or let the operator enter a nameplate PPF and derive a flat estimate?
