# Catalog thin fields & targeted rescrape chase

**Audience:** merge/scrape workers planning the next fill pass.  
**Updated:** 2026-08-10 (catalog densify pass).  
**Workset evidence:** local `C:\DSC\collation\dsc_brain.sqlite3` after densify.  
**Ops runbooks:** [`CATALOG-COLLATION-CONTRACT.md`](CATALOG-COLLATION-CONTRACT.md) § Match-expand ops / § Catalog densify ops · corpus overview [`CATALOG-RESEARCH-CORPUS.md`](CATALOG-RESEARCH-CORPUS.md).

Do **not** invent values. Each row is something thin or missing and what would honestly fill it.

| Priority | Category / field | Evidence now | Blocked by | Suggested chase |
|---|---|---|---|---|
| P0 | `review` bodies | `review=0`; CannaReviews staging is `login_gated` / aggregates | Medauth / login PDP | Separate medauth scrape → `project_reviews_from_raw.py` |
| P1 | `grow_trait.height_cm_*` | **~12.7%** filled (11380/89590) after densify (was ~2%); bands still 355 in payload (no fake cm) | Remaining text lacks units / empty | More bank numeric height parsers; keep bands ordinal-only |
| P1 | Subtype differentiation | `subtype_of`≈9086; many name-only | Incomplete bank/SF pages | Targeted SF/bank PDP for high-degree subtypes |
| P1 | SeedFinder completeness | Journal still present (stale ~3h+); **not merged** this pass | Journal/scrape quiet | When quiet: `merge_staging_to_master.py --only seedfinder --no-link` |
| P1 | StrainDB | Parked `DEFERRED_CF` n≈289 | Cloudflare | Resume only after headed CF unlock |
| P2 | `science_alias` | **~23.2k** after bank slug harvest (was ~970); some merch/SKU noise from accessory banks | Quality filter | Optional: restrict harvest to seed-product URL patterns; drop cartridge/hashole SKUs |
| P2 | `nutrient_product` / `medium_product` | 3 / 1 | Wave D not run | Brand crawl Wave D |
| P2 | Herbies / Zamnesia notes | **Densified:** filtered `page_text_excerpt` → `bank_note` (~6.4k); real `description` still empty | Scrape shape | Prefer later PDP description re-scrape over excerpts |
| P2 | CannaReviews descriptions | Thin public `description` | Public scrape thin | Medauth PDP |
| P2 | `observation.kind=grow_note` | **1431** from forums (was 0) | Bank payloads still lack `grow_notes` | More forums / diaries |
| P2 | Master `raw_record` | 0 by design | Staging holds fat | Keep |
| P2 | Strain imagery `media_asset` | 0 for strains | Not scraped | Optional image pass later |
| P3 | Want bands on canonical | Rare in `summary_json` | HA curation | Separate HA Want pass |
| P3 | `lineage_unresolved` leftovers | ~9.7k | No exact canonical | Manual alias / subtype when bases appear |
| P3 | Duplicate `o g` vs `og` canonicals | ~68 pairs aliased, not merged | Attachments on both | Later merge with attachment move |

## Categories in use (post densify)

| Kind / table | Role | Notes |
|---|---|---|
| `strain_canonical` | Identity hub | ~182k |
| `grow_trait` | Grow metrics | height_cm ~12.7%; `height_band` in HA projection |
| `observation.bank_note` | Marketing / PDP / filtered excerpt | ~76.0k |
| `observation.forum_post` | Forum bodies | ~1.5k |
| `observation.grow_note` | Grow diary field | **1431** |
| `review` | User review bodies | Empty until medauth |
| `science_alias` | Exact alias → canonical | Incl. OG spacing + bank slug harvest |
| `entity_link.subtype_of` | Genetic subtype → base | ~9.1k |

## Explicit non-goals for chase

- Fuzzy/LLM collapse of names into parents
- Stripping F2/bx/OG tokens to force matches
- Inventing cm from Short/Medium/Tall bands
- Starting CF/medauth scrapes from this doc alone (needs operator gate)
