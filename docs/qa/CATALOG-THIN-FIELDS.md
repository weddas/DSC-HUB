# Catalog thin fields & on-disk corpus

**Audience:** offline densify / HA projection only.  
**Updated:** 2026-08-11 — mass-merge saturated + offline extra keys (flowering / external aliases / lineage).  
**Workset:** `C:\DSC\collation\dsc_brain.sqlite3` (NAS copy-back verified).

## Policy

Do **not** resume SeedFinder, StrainDB, CannaReviews/medauth, bank PDP enrich, or Wave D Shopify crawls for ~1–2 weeks. Remaining thin fields are accepted gaps or future offline projection only.

## Landed corpus (post offline-extra)

| Metric | Count |
|---|---:|
| `strain_canonical` | 195 266 |
| `strain_variant` | 97 576 |
| `observation` | 132 789 |
| `review` | 94 |
| `science_alias` | 106 923 |
| `entity_link` | ~3 340 984 |
| `parent_of` | 78 889 |
| `subtype_of` | 9 983 |
| `height_cm_*` filled | 60 290 / 115 277 (~52.3%) |
| `flowering_days_*` filled | 97 520 / 115 277 (~84.6%) |
| `chemistry_profile` | 612 192 (Wikileaf categorical HTML rejected) |
| `nutrient_product` / `medium_product` | 867 / 321 |
| `light_fixture` | 696 |
| Local staging DBs | 268 |
| HA strain search cap | 10 000 |

## Extra relationship keys used this pass

| Key | Projector | Result |
|---|---|---|
| flowering text / weeks | `project_flowering_days_from_text.py` | +40 707 fills |
| Leafly slug, SF strain/breeder slug, OpenTHC stub/ULID, unique SKU | `project_external_id_aliases.py` | +76 716 aliases |
| Leafly `parent_slugs` | `project_leafly_parent_slugs.py` | +6 664 parent edges |
| structured parents | `project_lineage_edges.py` | +28 754 edges |
| lineage literals | `resolve_lineage_literals.py` | 1 188 rewritten |
| Wikileaf numeric chem | `project_wikileaf_chem_from_staging.py` | **0** (categorical only — honesty reject) |

## Accepted thin / non-goals

| Item | Why |
|---|---|
| Remaining SF ~14k | Closed mid-scrape (~1–2 weeks) |
| StrainDB beyond ~359 | Closed on HTTP wall |
| More review bodies | Closed (94 kept) |
| Invent cm from Short/Med/Tall | Forbidden |
| Wikileaf “Very High” → % | Forbidden (was briefly mis-parsed from Angular attrs; purged) |
| Parent chem → subtype copy | Forbidden |
| Fuzzy lineage | Forbidden |

HA: search indexes rebuilt; curated Want re-promoted; curated seeds enriched with brain height/flowering/chem when exact name matches (`enrich_curated_catalog_from_brain.py`).
