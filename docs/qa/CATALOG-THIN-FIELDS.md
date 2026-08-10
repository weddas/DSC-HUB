# Catalog thin fields & targeted rescrape chase

**Audience:** merge/scrape workers planning the next fill pass.  
**Updated:** 2026-08-10 (match-expand pass).  
**Workset evidence:** local `C:\DSC\collation\dsc_brain.sqlite3` after subtype + observation widen.

Do **not** invent values. Each row is something thin or missing and what would honestly fill it.

| Priority | Category / field | Evidence now | Blocked by | Suggested chase |
|---|---|---|---|---|
| P0 | `review` bodies | `review=0`; CannaReviews staging is `login_gated` / aggregates; `dsc_reviews_cannareviews.json` has counts only | Medauth / login PDP | Separate medauth scrape → project via `project_reviews_from_raw.py` |
| P0 | `grow_trait.height_cm_*` | ~2% filled (1780/89590); many payloads have `grow_height` text only | Parser / height_band coverage | Finish Leafly height_band projection; parse bank height text into cm |
| P1 | Subtype differentiation | `subtype_of`≈9086 links; many subtypes are name-only (no own chem/grow/notes) | Incomplete bank/SF pages | Targeted SF/bank PDP for high-degree subtypes (auto / F2 / bx cuts) |
| P1 | SeedFinder completeness | Variant `seedfinder`≈10k; scrape still running / journal live | CF + scrape quiet | When quiet: `merge_staging_to_master.py --only seedfinder --no-link` |
| P1 | StrainDB | Parked `DEFERRED_CF` n≈289 | Cloudflare | Resume only after headed CF unlock |
| P1 | `science_alias` | ~970 after OG-spacing + promotes; still thin vs ~182k canonical | Exact bank slug↔name pairs not fully promoted | Alias harvest from staging `name`/`slug` exact pairs |
| P2 | `nutrient_product` / `medium_product` | 3 / 1 | Wave D not run | Brand crawl Wave D |
| P2 | Herbies / Zamnesia notes | Staging present but `description` empty (page_text_excerpt only) → 0 `bank_note` | Scrape shape | Re-scrape PDP description fields or map excerpt carefully |
| P2 | CannaReviews descriptions | Only ~11 of 4195 have `description` | Public scrape thin | Medauth PDP or richer public fields if available |
| P2 | `observation.kind=grow_note` | 0 rows after widen (sources lack `grow_notes`) | Field absent in bank payloads | Forums + grow diaries; map when field appears |
| P2 | Master `raw_record` | 0 by design | Staging holds fat | Keep; document families without note fields |
| P2 | Strain imagery `media_asset` | 0 for strains; lights have PPFD/spectrum | Not scraped | Optional image pass later |
| P3 | Want bands on canonical | Rare in `summary_json` | HA curation pass | Separate HA Want pass — not collation SoT |
| P3 | `lineage_unresolved` leftovers | ~9.7k after junk quarantine | No exact canonical | Manual alias / subtype when bases appear; no fuzzy SoT |
| P3 | Duplicate `o g` vs `og` canonicals | ~68 pairs aliased, not merged | Attachments on both | Later merge pass with attachment move — chase only |

## Categories in use (post match-expand)

| Kind / table | Role | Notes |
|---|---|---|
| `strain_canonical` | Identity hub | ~182k |
| `strain_variant` | Bank SKU claims | |
| `chemistry_profile` | Append-only lab/catalog chem | Popular names have thousands of lab rows — intentional |
| `grow_trait` | Grow metrics | Height thin |
| `observation.bank_note` | Marketing / PDP description | ~69.5k |
| `observation.forum_post` | Forum bodies | ~1.5k |
| `observation.grow_note` | Grow diary field | **Added as kind; 0 rows until sources provide `grow_notes`** |
| `review` | User review bodies | Empty until medauth |
| `entity_link.parent_of` | Lineage SoT | Structured only; tree quarantined |
| `entity_link.subtype_of` | Genetic subtype → base | **New** this pass |
| `entity_link.exact_name_norm` | Chem/variant ↔ canonical | |
| `science_alias` | Exact alias → canonical | Incl. `o g`↔`og` |
| `lineage_unresolved` | Exact-fail parent queue | |
| `entity_link_quarantine` | Removed junk / tree noise | |

## Explicit non-goals for chase

- Fuzzy/LLM collapse of names into parents
- Stripping F2/bx/OG tokens to force matches
- Starting CF/medauth scrapes from this doc alone (needs operator gate)
