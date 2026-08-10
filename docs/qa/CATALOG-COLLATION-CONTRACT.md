# Catalog collation contract (N-087)

**Status:** durable architecture — remember this. Merge, ingest, and schema work must align here.  
**Audience:** merge workers, importers, HA projection, future wordcloud/lineage UI.  
**Related:** [`CATALOG-RESEARCH-CORPUS.md`](CATALOG-RESEARCH-CORPUS.md), FOLLOWUPS **N-087**, `brain/dsc_brain/corpus_schema.py`.

---

## Three layers

| Layer | Role | Examples |
|---|---|---|
| **Canonical** | Shared identity + consensus evidence | `strain_canonical`; reviews / grow notes / lab chem / consensus grow traits attach here |
| **Variant** | Bank / breeder claims for a named cut | `strain_variant` (props from PDPs; not the place for forum anecdotes) |
| **Observation** | Sourced, append-only facts | review / note / edge rows keyed by `source_id`; never squash |

**Flow:** observation/review/note/edge ← sourced append-only → feed **canonical** (reviews, notes, chem, consensus grow) and **variant** (bank claims). Mermaid and wordclouds are **views**, not sources of truth.

---

## Grow notes & observations

- Grow **notes** and **observations** are **documents**, not columns on canonical.
- **Keep each note.** Never squash / merge / “best of” into a single field.
- **Hooks (required / optional):**
  - `canonical_id` (`name_norm`) — required
  - `variant_id` — optional
  - `source_record` / `source_id` — required
  - `date` (observed / posted / scraped) — when known
- **Typed extracts only when sure** (flowering days, height cm, climate, etc.) → also write `grow_trait` with the **same** `source_id`. Ambiguous prose stays note-only.
- **Forums** = note factories (long, noisy, high volume).
- **Bank PDPs** = shorter, higher-trust **variant** notes (and typed `grow_trait` when parseable).

---

## Reviews → collate → wordcloud

1. **Store raw reviews** (full text + provenance). Do not pre-summarize into canonical.
2. **Collate at read time** (by canonical / variant / source filters).
3. **Wordcloud** = derived projection only — never SoT; rebuild anytime from stored reviews.
4. **CannaReviews:** full review bodies need **medauth**; public scrape ≠ full corpus.
5. **Lab chem ≠ review vibes.** Chemistry rows and review sentiment stay separate tables/projections; do not blend into one “effects” field.

---

## Lineage in-DB

- Graph lives in SQLite via **`entity_link`** (or a future `lineage_edge` alias of the same shape).
- Predicates: **`parent_of` / `child_of`** (and related methods as needed).
- Every edge carries **`source_id`** (or `source` provenance) and may keep **unresolved literals** (parent name string not yet matched to a canonical).
- **Mermaid** (`lineage_mermaid`, exports) is a **view** of the graph — regenerate from edges; do not treat diagram text as the graph.
- Cross-ref queries (parents of X, children of Y, unresolved queue) must work against the DB, not against Mermaid strings.

---

## Practical merge order

1. **Merge contract first**
   - Match keys: `name_norm`, variant `id` / `name_norm::breeder`, chem/grow ids, `entity_link` ids.
   - Trust ladder: lab chem > bank typed PDP > directory scrape > forum note (still keep all; ladder guides UI default, not deletion).
   - Conflict = **keep both** (INSERT OR IGNORE / additive rows). Never invent a blended chem or grow range.
2. **`entity_link` on every genetics parse** — parent/child edges + unresolved literals when match fails.
3. **Observation / review ingest without `attribute_kv`** — documents in dedicated tables or `raw_record`; never explode review text or score spam into KV.
4. **Wordcloud builder later** — after raw reviews land and collate-at-read is stable.

---

## Honesty (non-negotiable)

- Never invent height / flowering / chem / lineage.
- Conflicting evidence: keep both with provenance.
- Staging holds FULL payloads; master stays matchable typed + rich `payload_json`.
- `attribute_kv` only for small bank/product overflow — never bulk scores or review bodies.

---

## Schema gaps vs this contract (as of 2026-08-10)

See FOLLOWUPS **N-087-COLLATION**.

**Landed (schema v4, additive):**
- First-class `observation` + `review` tables (append-only; provenance via `source_id` / optional `raw_record_id`).
- Helpers: `add_observation`, `add_review`, `add_lineage_edge`.
- Lineage SoT: `entity_link.method='parent_of'` with `from=parent → to=child`. Unresolved parents use `from_kind='name_literal'`. No inverse `child_of` rows (invert at read time).
- Idempotent projectors: `scripts/project_lineage_edges.py`, `project_observations_from_raw.py`, `project_reviews_from_raw.py`.
- Opt-in dual-write from `ingest_strain_row` when row carries note/review/parent fields — still keeps `raw_record` / chem / grow.

**Debt cleanup (2026-08-10, local `C:\DSC\collation\` then copy-back `*.pre_collation_debt`):**
- Quarantine table `entity_link_quarantine`: moved ~240k `seedfinder:lineage_tree` edges (`reason=lineage_tree_not_sot`). Tree/mermaid are never SoT.
- Structured-only re-project; silent `MAX_PARENTS_PER_FIELD=16` removed — oversize lists → `followup_gap` (`oversize_parent_list`), not truncate. Live `parent_of` ≈43.7k (max child degree ≤19).
- Exact literal resolve + `lineage_unresolved` queue (~10.4k distinct / ~14.6k edges). Includes `*null` suffix bug fix; junk `null` parents tagged `junk_literal_null`.
- Observations widened from staging banks/forums: ≈65.7k (`bank_note`≈64.2k, `forum_post`≈1.5k). CannaReviews descriptions → `bank_note` when present (rare in public scrape).
- `review=0` is correct: public CannaReviews + `dsc_reviews_cannareviews.json` are aggregates/`login_gated` only — no review bodies on disk. Projector skip counters: `skipped_login_gated` / `skipped_description_only` / `skipped_no_review_body`.

**Match-expand (2026-08-10, bak `*.pre_match_expand`):**
- Hard rule: `O.G.` / `F2` / `bx` / `cut` / `auto` stay in identity — never strip-to-match.
- `entity_link.method='subtype_of'` (~9.1k): subtype → base when base exact-matches (e.g. `auto blue dream` → `blue dream`).
- `o g`↔`og` exact `science_alias` hygiene (~68 pairs); junk literal quarantine (`null` / `Unknown *` / geo / marketing).
- Observations ≈71k (`bank_note`≈69.5k + forums); kind `grow_note` supported (0 rows until sources expose `grow_notes`).
- Thin-field chase list: [`CATALOG-THIN-FIELDS.md`](CATALOG-THIN-FIELDS.md).

**Catalog densify (2026-08-10, bak `*.pre_catalog_densify`):**
- Numeric height text → `grow_trait.height_cm_*` (~2% → ~12%); never invent cm from Short/Med/Tall.
- HA browse projection surfaces `height_band` from grow payload (ordinal; separate from `height_cm`).
- Exact bank slug↔name `science_alias` harvest + merch/SKU cleanup filter.
- Observations widened (forums `grow_note`, Herbies/Zamnesia filtered excerpts).
- **SeedFinder quiet merge** (orphan journal recovered; scrape PID dead): typed `--no-link` → canonical≈188.6k, SF variants≈22.8k, obs≈99.5k; `subtype_of`≈9.6k. StrainDB / medauth still chase-only.
- **HA indexes refreshed (`d4cdcab`):** see § HA browse index rebuild ops.

**Still deferred:** wordcloud / collate-at-read UI; CannaReviews full review bodies (login/medauth); requiring `grow_trait` → observation FKs; SF scrape resume for remaining sitemap.

---

## HA browse index rebuild ops (`d4cdcab`)

**Intent:** ship densified master coverage into Build a Plant / Catalog typeahead without widening the browser payload.

**What changed (verified committed indexes):**

| Index | Cap | Live count | Notes |
|---|---|---|---|
| `dsc_strains_search_index.json` | 2500 | **2500** | `built_at` **2026-08-10T07:51:40Z**; `with_want=12`, `with_height=12` (cm), `with_height_band=1` |
| `dsc_nutrients_search_index.json` | 1500 | **3** | Pack seeds only |
| `dsc_mediums_search_index.json` | 800 | **5** | Pack seeds only |
| `dsc_lights_search_index.json` | 800 | **517** | Photometrics pack + dumps |

Previous strain meta (`built_at` 2026-08-09T06:01Z) had `with_height=6` and **no** `with_height_band` counter. Rebuild doubled cm coverage in the capped slice and exposes ordinal bands when present.

```mermaid
flowchart LR
  master["dsc_brain.sqlite3"] --> proj["catalog_sqlite_projection.py"]
  yaml["dsc_strain_catalog.yaml"] --> proj
  proj --> builder["build_catalog_search_indexes.py"]
  packs["nutrient/medium/light packs"] --> builder
  builder --> www["homeassistant/www/dsc-catalog/"]
  builder --> dist["dist/dsc-catalog/"]
  www --> ui["Build a Plant / Catalog browse"]
```

### How to rebuild

```text
# Default: SQLite projection when brain/data/dsc_brain.sqlite3 exists
python scripts/build_catalog_search_indexes.py

# Optional: skip SQLite; dump JSON only
python scripts/build_catalog_search_indexes.py --from-dumps

# Optional: explicit workset DB
python scripts/build_catalog_search_indexes.py --db C:\DSC\collation\dsc_brain.sqlite3
```

Writes both `homeassistant/www/dsc-catalog/*_search_index.json` and `dist/dsc-catalog/` (same payloads). Sync / ha-sync / Sync add-on **5.1.4+** copy www indexes to `/local/dsc-catalog/`; HACS Redownload alone does **not**.

### Strain projection rules (verified)

- Order: curated YAML first, then `strain_canonical` `ORDER BY curated DESC, name` capped at **2500**.
- Batched JOIN over chemistry / grow_trait / variant (not N+1).
- `height_cm` from `grow_trait.height_cm_*` only; `with_height` counts rows with cm.
- `height_band` from grow `payload_json` (`height_band` or nested `grow.height_band`); `with_height_band` is a **separate** meta counter.
- Never invent cm from Short/Medium/Tall.
- Dump-only path (`--from-dumps` / SQLite missing) does **not** emit `height_band` / `with_height_band`.

### Pitfalls

| Symptom | Cause | Fix |
|---|---|---|
| Typeahead empty after rebuild | Indexes not on HA `/config/www/dsc-catalog/` | Sync 5.1.4+ / `ha-sync.sh` / manual copy |
| `with_height` still low in UI | Cap slice is alphabetical+curated, not densify-ranked | Expected until cap raise / paging; corpus densify ≠ browse slice |
| `with_height_band` ≈ 0–few | Leafly bands mostly outside first 2500 names | Honest; do not invent bands or expand cap casually |
| Stale meta after local rebuild | Browser cache | Hard-refresh; confirm `built_at` in JSON |
| Slow rebuild on NAS SQLite | Network DB I/O | Run against local workset copy, then commit indexes |
