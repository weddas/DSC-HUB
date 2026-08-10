# Catalog thin fields & targeted rescrape chase

**Audience:** merge/scrape workers planning the next fill pass.  
**Updated:** 2026-08-10 (post densify + SF end-link + unresolved promote harden `096acb4` / guards `c1d6881`).  
**Workset evidence:** local `C:\DSC\collation\dsc_brain.sqlite3`.  
**Ops:** [`CATALOG-COLLATION-CONTRACT.md`](CATALOG-COLLATION-CONTRACT.md) § Unresolved promote ops.

Do **not** invent values. Each row is something thin or missing and what would honestly fill it.

| Priority | Category / field | Evidence now | Blocked by | Suggested chase |
|---|---|---|---|---|
| P0 | `review` bodies | `review=0` | Medauth / login PDP | Medauth scrape → `project_reviews_from_raw.py` |
| P1 | `grow_trait.height_cm_*` | **~12.2%** (12407/102141) after SF grow merge | Text without units | More numeric parsers; bands stay ordinal |
| P1 | SeedFinder completeness | **Merged** partial (~22.8k variants / 22.8k raw); sitemap was ~40k | Scrape resume | Resume PW scrape for remainder; re-merge `--no-link` when quiet |
| P1 | StrainDB | `DEFERRED_CF` n≈289 | Cloudflare | Explicit unlock only |
| P1 | Subtype differentiation | `subtype_of`≈9631 after SF + promote | Thin subtype chem/notes | Targeted PDP for high-degree subtypes |
| P2 | `science_alias` | ~23.6k (incl. `promote_unresolved_literal`) | Residual accessory noise | Keep merch filter on harvest |
| P2 | SF end-link | **Done** (~3.09M `entity_link`) | — | Re-run `--link-only` only after new SF typed merge |
| P2 | `nutrient_product` / `medium_product` | 3 / 1 | Wave D | Brand crawl |
| P2 | CannaReviews descriptions | Thin public | Medauth | Medauth PDP |
| P2 | `observation.kind=grow_note` | **1431** forums | Banks lack field | More diaries |
| P3 | `lineage_unresolved` | **~8.7k** after junk + promote harden/guards | No exact match / UI + shape garbage rejected | Alias when bases appear; re-quarantine chrome; **no fuzzy** |
| P3 | Want bands | Rare | HA curation | Separate pass |

## Snapshot (post SF merge + end-link + promote)

| Metric | Approx |
|---|---|
| `strain_canonical` | ~188.7k |
| `strain_variant` | ~89.1k (seedfinder ≈22.8k) |
| `grow_trait` | ~102.1k · height_cm ~12.2% |
| `observation` | ~99.5k (`bank_note`≈96.6k, `grow_note` 1431) |
| `subtype_of` | ~9631 |
| `science_alias` | ~23.6k |
| `entity_link` | ~3.09M (incl. SF end-link) |
| `lineage_unresolved` | ~8.7k |

## Promote / quarantine notes

- `promote_unresolved_literals.py` is exact-only (`--min-edges` default 5, `--limit` 200). Rejects `classify()` junk, place-ish `SKIP_NORMS`, literals `>60` chars or `>8` norm words, and UI/review-chrome (`family tree map`, `show all`, `no reviews yet`, …).
- Extra shape guards (`c1d6881`): skip newlines, leading `>` / `(`, pure-digit `name_norm`, and photoperiod chrome (`feminized photoperiod`, `landrace influence`).
- `quarantine_junk_literals.py` MARKETING phrases now include the same review-chrome / germination-test fragments so slipped parents leave the live graph before promote.
- Leftover `lineage_unresolved` is honest debt — do not invent parents to drain it.

## Explicit non-goals

- Fuzzy/LLM parent collapse; strip F/OG/bx for matching
- Promoting UI chrome / long marketing sentences / photoperiod descriptors / digit-only literals into `strain_canonical`
- Inventing cm from Short/Medium/Tall
- Starting StrainDB/medauth without operator gate
