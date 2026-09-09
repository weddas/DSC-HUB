# Plan — Entity **resolution** single source of truth

**Date:** 2026-09-10
**Status:** Design / not started
**Tracker rows:** "~660 hand-synced HA-shaped entity ids across two languages, with four client-side resolution layers"; the pH-114 mapping bug (root cause)
**Author:** live-8.2.0 walkthrough

---

## 1. What's already done (don't re-spec it)

The **id-table** half of this problem is solved and should be left alone:

- `brain/dsc_brain/entity_tables.py` is the single Python source of the `<domain>.dsc_<thing>_<metric>` tables.
- `brain/scripts/gen_entity_maps.py` emits the TypeScript mirrors into `frontend/src/lib/generated/`; `--check` diffs and exits 1 on drift.
- `brain/tests/test_entity_maps_generated.py` + `npm run gen:entities:check` fail the build on a one-sided rename. Also `test_entity_table_consistency.py`, `test_hub_maps_match_firmware_names.py`.

So "660 ids hand-synced across two languages" is **no longer true for the static tables**. This spec is about the part that is still ad-hoc and is where bugs actually occur.

## 2. The real remaining problem — runtime resolution

Two layers still resolve entities **outside** the generated SSoT, and both have bitten us:

1. **Device → metric matching in the brain.** The pH-114 bug was `POT_MAP` matching object_ids by substring (`"soil_ph"` ⊂ `"soil_phosphorus"`) in `esphome_client.py` — a hand-written matcher, *not* part of `entity_tables.py`. Fixed pointwise (`_pot_field_for`, trailing-token match) but the **matching logic itself isn't generated, tested against the tables, or centralised**, so the next channel collision is a fresh bug.
2. **~12 SPA components resolve ids themselves.** `AirPathMap`, `CoupledMix`, `DutyStrip`, `EntityInspector`, `EquipmentTiles`, `HistoryDrawer`, `LogsTrendsPanel`, `LearningWizard`, `PlantProbePanel`, the three `plantWizard/*` steps… each reach into entity ids / maps. That's the "four client-side resolution layers" — string-building and lookups spread across the UI, any of which can drift from the brain's actual emission.

## 3. Goal

Extend the SSoT from *static ids* to *runtime resolution*: **one** device-object-id → (seat, metric) resolver in the brain (generated/validated against `entity_tables.py`), and **one** SPA resolver every component calls.

## 4. Design

**Brain — one resolver, table-driven**
- Move all device→metric matching (POT_MAP and friends) into a single `resolve` module whose mapping is **derived from `entity_tables.py`** (or lives beside it and is covered by the same `--check`).
- Matching is **exact / trailing-token**, never substring (enshrine the `_pot_field_for` fix as the only matcher). Add a `_raw` suffix rule once, centrally.
- A test enumerates every firmware object_id the fleet actually emits (there's already `test_hub_maps_match_firmware_names.py`) and asserts each resolves to exactly one (seat, metric) — and that no two channels can collide (the pH/phosphorus assertion becomes a general property test).

**SPA — one resolver**
- A single `resolveEntity()` in `frontend/src/lib/` over the generated maps; every component imports it instead of building ids or holding its own lookup. Grep-guard (lint rule / test) against raw `sensor.dsc_`/`switch.dsc_` string construction outside the generated layer.

**Contract test (the payoff)**
- One property test: for every entity the brain can emit, the SPA's `resolveEntity` and the brain's resolver agree on (seat, metric, unit). This is what would have caught pH-114 *before* the Pi.

## 5. Edge cases / risks

| Case | Handling |
|---|---|
| `_raw` vs calibrated channels | one central suffix rule; tested both ways |
| Channel present on device but not in tables | resolver returns "unknown, ignored" + logs once (never guesses a metric) |
| Two firmware channels map to one metric | property test fails the build |
| Legacy plant/seat ids | `migrate_legacy_plant_ids()` already exists (api.py) — fold its mapping into the one resolver |
| A metric the SPA needs but the brain never emits | the generated map marks it absent; the SPA shows an honest hole, not a blank |

## 6. Scope boundary

This is a **refactor to prevent a bug class**, not a feature. It should be behaviour-preserving (like the id-table codegen was: "every table is a verbatim transcription"). Land it behind the existing test gates; no device/host/network effects.

## 7. Test plan

- The new property test (every emitted id resolves uniquely, brain==SPA).
- Re-run `test_plausibility_layer.py` (pot mapping) against the centralised matcher.
- Snapshot: SPA renders identically before/after (no id changed).
- Lint/test guard: no raw `dsc_` id construction outside `frontend/src/lib/generated` + the one resolver.

## 8. Open questions

1. Generate the resolver too, or keep it hand-written beside the tables under the same `--check`?
2. How strict to make the SPA lint guard (fail build vs warn) on raw id construction in existing components during migration?
