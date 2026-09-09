# Plan — Expected harvest window (flip + flowering_days)

**Date:** 2026-09-10
**Status:** Design / not started
**Tracker row:** "Opportunity: derive and show each plant's expected flower-finish / harvest window from the strain's flowering_days…" (DSC-HUB Issue & Recommendation Tracker)
**Author:** live-8.2.0 walkthrough

---

## 1. Problem / opportunity

Every plant card shows **elapsed** time only — the roster reads `W9 · 62d · Flowering · Need —`, the crop scheduler shows a stage rail, and the Overview tent card shows the day count. Nowhere does the app show the **expected finish** — the single forward-looking number a grower actually plans around ("~1 week to expected harvest").

The data to compute it already exists:

- The CannaLib strain record carries **`flowering_days`** (verified live: `Gelato` → `63`, plus `height_cm`, a per-strain `want` profile, and `type`). Retrieved via `GET /v1/catalogs/strains?q=…` list items and `GET /v1/catalogs/strains/<id>`.
- The plant record carries **`sprout_date`**, **`stage`/`growth_stage`**, **`strain_id`**, **`tent`**, and **`plant_uuid`** (verified via `GET /roster` and `sensor.dsc_plant_roster_summary` in `/fleet/computed`).

This is the same "honest estimate from data we already have" pattern the app uses for energy ("estimate, not a bill") and the proposed estimated-DLI — so it fits the house style.

## 2. Current state (verified 2026-09-10)

`GET /roster` per seat:

```json
{ "seat_id": "pot1", "strain_id": "Runtz Punch", "stage": "flower",
  "updated_at": 1788686769.9, "tent": "4x8", "sprout_date": "2026-07-09",
  "growth_stage": "Flowering",
  "recipe": { "plant_name": "...", "sprout_date": "2026-07-09", "growth_stage": "Flowering", ... } }
```

The roster's "62d" is **days since `sprout_date`** (2026-07-09 → 2026-09-10 = 63 d). Stage is `flower` / `Flowering`.

## 3. The gap that makes this non-trivial

**There is no stored `flip_date`** (the day the plant entered flower). `flowering_days` is measured **from flip**, not from sprout, so a correct photoperiod countdown needs the flip date. Options:

- **(A) Add a `flip_date` field** to the plant record, set automatically when `stage` transitions to `flower` (and editable by the operator — flips that predate this feature won't have one).
- **(B) Derive flip_date from the journal** — stage changes are already journaled (the "Stage — Early Flowering" entries seen on the Alerts desk / tent journal). Find the most recent stage→flower entry for the plant_uuid.

**Recommendation: do both.** Add `flip_date` as the source of truth (A); on first run / for pre-existing plants, backfill it from the journal (B); if neither is available, fall back to an operator prompt and a clearly-labelled estimate (see §6). Autoflowers don't flip — handle separately (§5).

## 4. The maths

```
photoperiod plant:
  flip_date        = stored flip_date  (or journal-derived, or operator-set)
  expected_finish  = flip_date + strain.flowering_days
  days_remaining   = expected_finish - today
  flower_day       = today - flip_date            # "flower day N of flowering_days"

autoflower plant (catalog format = "Autoflower"):
  # autos are not flipped; flowering_days from the catalog is typically total
  # seed-to-harvest for autos — treat it as total age from sprout
  expected_finish  = sprout_date + flowering_days
  days_remaining   = expected_finish - today
```

`strain.flowering_days` and the **Autoflower/Photoperiod** format both come from the catalog (`type`, and the format filter already used in Compose). Pick the branch from the catalog format; if unknown, default to photoperiod-from-flip and label the basis.

## 5. Edge cases (must all be handled honestly — this is a live-grow tool)

| Case | Behaviour |
|---|---|
| No catalog match for the strain | Show `—` with "no catalog flowering time" (never guess) |
| Catalog has no `flowering_days` | Same `—` + reason |
| Plant is pre-flower (veg/seedling) | Don't show a finish date; show "flips to flower to start the clock" |
| Photoperiod, no `flip_date` and none derivable | Show "set the flip date to see the finish" (operator prompt), not a sprout-based guess |
| Autoflower | Use sprout + flowering_days; label "auto — from sprout" |
| `flowering_days` is a range in the source | Show a window (earliest–latest), not a false-precision single day |
| Overdue (today > expected_finish) | Show "past expected finish by N d — check trichomes" (informational, never alarming) |
| Multiple plants in a tent, different strains | Per-plant finish; tent card shows the **latest** finish (harvest-the-tent view) |
| Strain flowering_days present but source is junk (e.g. 0 or >200) | Plausibility clamp (e.g. 35–120 d for flower phase); out of range → `—` + reason. Mirrors the soil-plausibility layer already in the brain. |

## 6. Honesty / labelling

Follow the existing provenance convention (the desks already tag derived values, e.g. "derived, not measured", "estimate, not a bill"):

- Label the number **"expected (from catalog flowering time)"**.
- Name the basis: **"from flip 2026-08-01 + 63 d (Gelato)"** or **"auto — from sprout"**.
- When estimated/uncertain, say so; when unknowable, show `—` with the reason — never a fabricated date.

## 7. Surfaces (where it shows)

1. **Plants roster** (`#/plants/roster`) — new column / chip: `~9 d to finish · exp 2026-10-03` next to the existing `W9 · 62d · Flowering`.
2. **Crop scheduler** (shared component on Light + Plants) — a target marker on the stage rail at `flip + flowering_days`, and "ON FOR / OFF IN"-style "finish in N d".
3. **Overview tent card** — a small "harvest ~N d" line under the stage chip; tent shows the latest plant's finish.
4. **Tent cockpit** — same, alongside the plant list.
5. **(Optional) a harvest-reminder alert** — see §9.

## 8. Implementation sketch

**Brain**
- Plant model: add `flip_date` (nullable ISO date). Set it when `stage` transitions to `flower`; expose it on `/roster` and in `sensor.dsc_plant_roster_summary`.
- One-time backfill: derive `flip_date` for existing flowering plants from the tent/plant journal's most-recent stage→flower entry; leave null if not found.
- New computed field per plant (brain-side so every consumer agrees — avoid the multi-view drift seen with Want bands): `expected_finish`, `days_remaining`, `flower_day`, `basis` string, `estimate` bool. Source `flowering_days` + `format` from the catalog proxy the brain already calls (`/v1/catalogs/strains/<id>`); cache per strain.
- Plausibility clamp on `flowering_days` (reuse the existing clamp/plausibility layer).

**SPA**
- Read the brain-computed fields (do **not** recompute per-view — one source of truth).
- Render on the four surfaces above with the provenance label.

**API**
- Extend `/roster` and the roster summary with the computed block; no new endpoint required.

## 9. Natural extensions (log separately, don't scope-creep this)

- **Harvest-reminder alert**: a catalogue alert "approaching expected finish" (e.g. `days_remaining <= operator threshold`), pairing with the proposed "probe dark" alert and starter-rule-templates work.
- **Seed the stage rail timing** from `flowering_days` so the crop scheduler's flower segment length is strain-accurate.
- **Cross-run comparison**: actual finish vs expected feeds the proposed harvest-report / run-over-run comparison.

## 10. Test plan

- Unit (brain): photoperiod (flip + days), autoflower (sprout + days), missing flip, missing catalog, junk flowering_days (clamped), range flowering_days, overdue, pre-flower. Assert `—`+reason where unknowable.
- Backfill: a flowering plant with a journalled flip → correct `flip_date`; one without → null (no guess).
- SPA: all four surfaces show the same numbers (single source), correct provenance label, and `—`+reason on the honest-hole cases.
- Live: Runtz Punch / Grandmommy Purple (both `sprout_date` 2026-07-09, `stage` flower, no stored flip yet) → after backfill, a real finish date; before backfill, the "set flip date" prompt, never a sprout-based guess.

## 11. Open questions (operator's call)

1. Should the roster day-count switch to **flower-day** ("F-day 40 of 63") once flowering, or keep sprout-age and add finish separately? (Recommend: keep sprout-age, add flower-day + finish.)
2. Autoflower `flowering_days` semantics in the catalog — total seed-to-harvest, or flower-only? Confirm against a known auto before shipping the auto branch.
3. Reminder threshold default (e.g. 7 d) and whether it's an alert vs. a passive chip.
