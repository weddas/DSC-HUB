# Catalog thin fields & targeted rescrape chase

**Audience:** merge/scrape workers planning the next fill pass.  
**Updated:** 2026-08-10 (post densify + SeedFinder quiet merge + HA index refresh `d4cdcab`).  
**Workset evidence:** local `C:\DSC\collation\dsc_brain.sqlite3`.

Do **not** invent values. Each row is something thin or missing and what would honestly fill it.

| Priority | Category / field | Evidence now | Blocked by | Suggested chase |
|---|---|---|---|---|
| P0 | `review` bodies | `review=0` | Medauth / login PDP | Medauth scrape → `project_reviews_from_raw.py` |
| P1 | `grow_trait.height_cm_*` | **~12.2%** (12407/102141) after SF grow merge | Text without units | More numeric parsers; bands stay ordinal |
| P1 | SeedFinder completeness | **Merged** partial (~22.8k variants / 22.8k raw); sitemap was ~40k | Scrape resume | Resume PW scrape for remainder; re-merge `--no-link` when quiet |
| P1 | StrainDB | `DEFERRED_CF` n≈289 | Cloudflare | Explicit unlock only |
| P1 | Subtype differentiation | `subtype_of`≈9605 after SF | Thin subtype chem/notes | Targeted PDP for high-degree subtypes |
| P2 | `science_alias` | ~23.5k; merch SKU aliases cleaned (~181 deleted) | Residual accessory noise | Keep merch filter on harvest |
| P2 | SF end-link | **Done** `d4cdcab` era (+283k variant edges) | — | Re-run `--link-only` only after future SF typed merges |
| P2 | HA browse height/band coverage | Cap slice `with_height=12` / `with_height_band=1` of 2500 | Cap order ≠ densify rank | Raise cap / page later; do not invent |
| P2 | `nutrient_product` / `medium_product` | 3 / 1 (HA indexes nutrients **3** / mediums **5**) | Wave D | Brand crawl |
| P2 | CannaReviews descriptions | Thin public | Medauth | Medauth PDP |
| P2 | `observation.kind=grow_note` | **1431** forums | Banks lack field | More diaries |
| P3 | `lineage_unresolved` | ~8.8k after junk+resolve | No exact match | Alias when bases appear; no fuzzy |
| P3 | Want bands | Rare | HA curation | Separate pass |

## Snapshot (post SF merge)

| Metric | Approx |
|---|---|
| `strain_canonical` | ~188.6k |
| `strain_variant` | ~89.1k (seedfinder ≈22.8k) |
| `grow_trait` | ~102.1k |
| `observation` | ~99.5k (`bank_note`≈96.6k) |
| `subtype_of` | ~9605 |
| `science_alias` | ~23.5k |

## Explicit non-goals

- Fuzzy/LLM parent collapse; strip F/OG/bx for matching
- Inventing cm from Short/Medium/Tall
- Starting StrainDB/medauth without operator gate
