# Plant ↔ probe lifecycle inventory (2026-08-29)

Bar 2 baseline before code. Spec: recovery design §Bar 2.

## Three objects (settled)

| Object | Meaning today | Gap |
|--------|---------------|-----|
| **Probe** | Hardware `potN` / inventory seat; soil Got | OK |
| **Plant** | Dual: roster **slots** (1–8) + pot-keyed `roster` table row | Plant cannot survive without a pot seat |
| **Assignment** | `extra.assigned_plant_id` read for peer MAD only | **Never written** by assign/retire |

`idle_home_pot_id` / `clear_role` = probe **station** dock / demote. Not plant detach.

## APIs today

| Op | Path | Effect | Bar 2 need |
|----|------|--------|------------|
| Assign | `compose_ops.assign_to_pot` | Writes pot-keyed roster + helpers; updates slot.pot | Must also set `assigned_plant_id` |
| Retire | `compose_ops.retire_plant` | Deletes roster row + empties slot + clears helpers | Keep as destroy-plant |
| Unassign home | `PATCH .../probe-stations` `idle_home_pot_id=""` | Clears dock only | Keep distinct |
| Clear role | `clear_role=true` | Demotes probe_station | Keep distinct |
| **Detach** | — | — | **Missing** |
| **Move** | — | — | **Missing** (operator must retire+recompose) |

## SPA today

| Surface | Can detach plant from probe? | Notes |
|---------|------------------------------|-------|
| Settings probe stations | No (home/role only) | FOLLOWUPS 2026-08-28 “done” is this layer |
| Roster GrowPages | Delete = **retire** | Subtitle says “clears probe assignment” but destroys plant |
| PlantSeatPanel | Tent unassign ≠ detach | No Detach action |
| Compose PlantWizard | Assign / Retire | No Detach |
| Root | Display only | Vacant vs station vs plant muddled when assignment empty |

## FOLLOWUPS claim vs truth

Aug-28 “Probe unassign + plant full edit/delete” = Settings idle_home/clear_role + roster edit/delete(retire). **Not** Bar 2 detach. Operator still must retire to free a probe.

## Highest-risk unknown

Detach that only clears helpers while leaving pot-keyed roster (or vice versa) → Root/Roster diverge. Atomic slot stash + delete pot row is the fix.

## Atomic units (this plan)

T0 inventory (this doc) → T1 `plant_probe` → T2 API wire → T3 SPA → T4 Root honesty → T5 Pi verify.

## Post-implementation note (same day)

Landed on `master` tip `fe55e4e`: `plant_probe` write path, detach≠retire, move, SPA actions, compose `assigned_plant_id` sync, Root stations refresh on `tick`. **Pi verify closed** (`.audit/bar2-plant-probe.tsv` · shots `bar2-*.png`). Dual-home soak remains **next-plan**. Aug-28 FOLLOWUPS “unassign done” remains dock/role only.

Developer SoT: [`../../brain/PLANT-PROBE-LIFECYCLE.md`](../../brain/PLANT-PROBE-LIFECYCLE.md).
