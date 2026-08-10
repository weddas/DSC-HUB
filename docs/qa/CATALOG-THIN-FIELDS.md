# Catalog thin fields & next-scrape chase

**Audience:** next scrape / fill pass (on-disk densify drained).  
**Updated:** 2026-08-10 (full local staging drain: 264/268 families).  
**Workset:** `C:\DSC\collation\` (staging mirrored from NAS except 4 huge chem DBs already typed-merged).

## Done from existing disks (do not re-scrape for these)

| Deliverable | Evidence |
|---|---|
| Bank/forum/Wikileaf notes → `observation` | ~126k obs (`bank_note`≈123k, forums, grow_note 1431); **224** observation sources |
| SeedFinder typed merge + end-link | ~22.8k SF variants; +283k science↔seed links |
| Exact aliases | `science_alias` ≈26.7k (merch/page/post cleaned) |
| Numeric height fill | `height_cm_*` ≈13.4% (13713/102141); bands still ordinal-only |
| Subtypes | `subtype_of` ≈9703 |
| Junk lineage quarantine | unresolved ≈5.7k |

Skipped local copy (already in master typed chem): `maxvalue_terpenes`, `phytochem_smith`, `cannlytics_expand`, `leafly_flat_enrich`.

## Next scrape must target (honest gaps)

| Priority | Field / category | Why thin after drain | Suggested scrape |
|---|---|---|---|
| P0 | `review` bodies | Still **0**; public CannaReviews = aggregates/`login_gated` | Medauth PDP bodies |
| P0 | `grow_trait.height_cm_*` | **~87% still empty**; remaining payloads lack numeric height | Leafly/bank pages with explicit cm/in; parser-ready text |
| P1 | StrainDB remainder | Parked `DEFERRED_CF` | Headed CF unlock then resume |
| P1 | SeedFinder remainder | Merged ~22.8k of ~40k sitemap | Resume PW scrape → quiet re-merge |
| P1 | Subtype chem/grow/notes | Many `subtype_of` name-only | Targeted PDP for F2/bx/auto/OG cuts |
| P1 | Wave D nutrients/media | `nutrient_product`=3 / `medium_product`=1 (pack seeds only) | Brand storefront crawl |
| P2 | Herbies/Zamnesia real `description` | Notes from filtered excerpts only | Re-scrape PDP description DOM |
| P2 | Height bands → usable UI | 355 bands in payload; HA surfaces `height_band` | Keep ordinal; do **not** invent cm |
| P2 | Strain imagery | No strain `media_asset` | Optional image pass |
| P3 | Want bands / HA curation | Rare on canonical | Separate HA pass |

## Snapshot

| Metric | Count |
|---|---|
| staging local | 264 sqlite |
| `strain_canonical` | ~189.3k |
| `observation` | ~126.0k |
| `science_alias` | ~26.7k |
| `subtype_of` | ~9703 |
| `grow_trait` / height filled | 102141 / 13713 (~13.4%) |
| `review` | 0 |
| `nutrient_product` / `medium_product` | 3 / 1 |

## Explicit non-goals until operator unlock

- StrainDB CF resume, medauth login scrape, inventing height cm from Short/Med/Tall, fuzzy lineage collapse, strip F/OG/bx for matching
