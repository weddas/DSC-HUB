# Plant Wizard (Build a Plant)

**In one line:** Stepper at `/grow/compose` replaces the old four-card compose grid; writes the same HA helpers / scripts via `composePlantLogic`.

**Route:** `/grow/compose` (Grow → Compose)  
**Code:** `PlantWizard.tsx` · `composePlantLogic.ts` · `CatalogPicker.tsx` · alias `ComposePlant.tsx` → `PlantWizard`

## Intent

Operators add a plant to roster + pot without hunting across Strain / Soil / Nutrients / Light cards. Required steps gate Next; Feed and Light are optional skips.

Day-2 edits (rename, sprout, stage, notes, retire, probe home) are **not** wizard steps — see [PLANT-SEAT.md](PLANT-SEAT.md).

## Steps

```mermaid
flowchart LR
  plant[1 Plant] --> soil[2 Pot and soil]
  soil --> feed[3 Feed optional]
  feed --> light[4 Light optional]
  light --> review[5 Review and add]
  review --> commit[commit + assign scripts]
```

| Step | Must have | Writes |
|------|-----------|--------|
| **Plant** | Strain + pot ≠ `none` | `input_text.dsc_build_strain`, nickname, sprout, tent, pot |
| **Pot & soil** | Vessel label | `input_select.dsc_build_vessel`, blend helpers, `input_number.dsc_blend_total_l` |
| **Feed** | Optional | First free nutrient slot 1–8 (+ dose when catalog has `dose_ml_l`) |
| **Light** | Optional | `input_select.dsc_light_fixture` or `input_text.dsc_light_custom_name` |
| **Review** | Confirm | Vessel → pot seat; then `script.dsc_build_plant_commit_and_assign` (fallback: commit + `dsc_plant_assign_to_pot`) |

Soil quick presets (`SOIL_PRESETS`): 100% Coco, 70/30 Coco·Perlite, Living soil, Peat·Perlite — each fills blend component 1–3 via `applyBlendLayers`. Custom 3-layer mix stays behind **Custom 3-layer blend** (`CoupledMix`).

## Catalog picks

| Kind | Behavior |
|------|----------|
| Strain | Sets build strain; client filters type / auto\|photo / breeder (`filterStrainItems`) — API still only `q` + `limit` |
| Medium | Uses `composition` (≤3 layers) or 100% named medium |
| Nutrient | First empty/out-of-inventory slot; turns inventory on |
| Light | Fuzzy-match fixture options (first 18 chars); else custom name |

Strain browse also drops merch SKUs (`isStrainCultivar`) — capsules/rosin/mg lots are not cultivars.

## Constraints

- Does **not** invent catalog climate / chem / height when the pack lacks them.
- Expected stage chips come from hub sensors (`sensor.dsc_build_expected_stage`, days-since-sprout) after sprout date — not client math.
- Advanced Review actions (roster-only, assign-only, apply Want, retire) stay folded; primary CTA is commit+assign with `DecisionLayer` confirm.
- HA dual-mode and Pi (`VITE_DSC_PI=1`) both use the same wizard; catalog search prefers brain `/v1/catalogs/*` on Pi.

## Related

- Post-create edit / delete / probe unassign: [PLANT-SEAT.md](PLANT-SEAT.md)
- Pipeline / indexes: [`../qa/BUILD-A-PLANT-DATA-PIPELINE.md`](../qa/BUILD-A-PLANT-DATA-PIPELINE.md)
- CannaLib ops: [`../ops/CANNALIB-API.md`](../ops/CANNALIB-API.md)
- Routes: [`WEBUI.md`](WEBUI.md)
- Notion: [Catalogs and Build a Plant](https://app.notion.com/p/3b52b4cda37081a6b661f7e4697b39cf)
