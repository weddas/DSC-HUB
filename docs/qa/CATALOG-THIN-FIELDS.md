# Catalog thin fields & next-scrape chase

**Audience:** next scrape / fill pass.  
**Updated:** 2026-08-10 (height NLP + Wave D lite + SF resume).  
**Workset:** `C:\DSC\collation\` (+ NAS master copy-back).

## Landed from existing disks + light scrapes

| Deliverable | Evidence / scripts |
|---|---|
| Staging drain | 264 local staging DBs → obs ≈126k / 224 sources |
| Height cm NLP | `height_cm_*` **~43.5%** (44376/102141) — `scripts/project_height_cm_from_text.py` |
| Height bands | payload `height_band` ≈5145 — `scripts/project_height_bands_from_text.py` (no fake cm) |
| Wave D lite | Grow Kings Shopify → nutrients **416** / mediums **255** — `scripts/scrape_growkings_nutrients_mediums.py` |
| SeedFinder | PW scrape **resumed** (~22853/40638); `catalog_fetch.Checkpoint.save()` NAS replace fallback |

Operator detail: [`CATALOG-COLLATION-CONTRACT.md`](CATALOG-COLLATION-CONTRACT.md) § Height NLP + bands / Wave D lite.

## Still thin / scrape targets

| Priority | Field | Blocked by | Next |
|---|---|---|---|
| P0 | `review` bodies | Medauth | Login PDP scrape |
| P0 | Remaining height (~56% empty) | No numeric text in payloads | Bank/Leafly pages with cm/in |
| P1 | SeedFinder remainder | Running | Let PW finish → quiet re-merge `--no-link` |
| P1 | StrainDB | `DEFERRED_CF` | Explicit unlock only |
| P1 | Wave D depth | GK has titles only | Manufacturer PDPs for NPK/dose; more brands |
| P1 | Subtype chem/notes | Name-only subtypes | Targeted F2/bx/auto PDPs |
| P2 | Herbies/Zamnesia `description` | Excerpt-only notes | Re-scrape description DOM |
| P3 | Want / imagery | Not scraped | Separate passes |

## Snapshot

| Metric | Count |
|---|---|
| `strain_canonical` | ~189k |
| `observation` | ~126k |
| `grow_trait` height filled | ~44376 (~43.5%) |
| `height_band` in payload | ~5145 |
| `nutrient_product` / `medium_product` | 416 / 255 |
| `review` | 0 |
| SeedFinder scrape | resumed ~22.8k/40.6k |

## Non-goals without unlock

StrainDB CF, medauth, inventing cm from Short/Med/Tall, fuzzy lineage, strip F/OG/bx.
