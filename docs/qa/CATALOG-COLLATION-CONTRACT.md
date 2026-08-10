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

**Staging drain (2026-08-10, `c8e0cd4`):**
- Mirrored almost all NAS staging into local `C:\DSC\collation\staging` (**264/268** families). Skipped huge chem DBs already typed-merged: `maxvalue_terpenes`, `phytochem_smith`, `cannlytics_expand`, `leafly_flat_enrich`.
- Re-ran observation + alias projectors against the mirrored set (copy notes; never move/`DELETE` staging).
- Post-drain workset: obs≈**126k** (`bank_note`≈123k, forums, `grow_note` 1431; **224** observation sources); `science_alias`≈**26.7k**; height_cm≈**13.4%** (13713/102141); `subtype_of`≈9703; unresolved≈5.7k after prior promote; `review=0` still honest.
- Thin chase is **scrape-only** now — see [`CATALOG-THIN-FIELDS.md`](CATALOG-THIN-FIELDS.md). Do not re-scrape for densify/drain deliverables already on disk.
- HA browse indexes refreshed (`built_at` 2026-08-10T08:10:26Z): same caps (strains **2500**, `with_height=12`, `with_height_band=1`) — densify rank ≠ cap slice.

**Still deferred:** wordcloud / collate-at-read UI; CannaReviews full review bodies (login/medauth); requiring `grow_trait` → observation FKs; SF scrape resume for remaining sitemap; StrainDB `DEFERRED_CF` unlock; inventing cm from Short/Med/Tall; fuzzy lineage collapse.

---

## Staging drain ops (`c8e0cd4`)

**Intent:** finish projecting notes/aliases from on-disk staging before the next scrape wave. After this pass, remaining thin fields need new HTML/PDP capture — not another projector rerun on the same blobs.

```mermaid
flowchart TD
  nas["NAS staging families"] --> mirror["Local staging 264/268"]
  mirror --> obs["project_observations_from_raw"]
  mirror --> alias["harvest_bank_aliases"]
  alias --> clean["clean_merch_aliases"]
  obs --> master["dsc_brain.sqlite3"]
  clean --> master
  master --> thin["CATALOG-THIN-FIELDS scrape chase"]
  master --> idx["build_catalog_search_indexes"]
```

### Observation projector

`scripts/project_observations_from_raw.py` reads staging `raw_record` (master often has `raw_record=0`).

| Input | Behavior |
|---|---|
| Default globs | `forum_*`, `bank_*`, CannaReviews, Seedsman/Seed City/…, plus **`wikileaf.sqlite3`** |
| Bank note keys | `description`, **`info`**, **`more_info`**, **`about_info`** → kind `bank_note` |
| Grow note keys | `grow_notes` / `grow_note` → kind `grow_note` (preferred when present) |
| Forum bodies | `body` / `body_text` / … → `forum_post` |
| Filtered excerpts | `page_text_excerpt` allowed for Herbies / Zamnesia / **Royal Queen** stems only; noise filter rejects cart/cookie/login chrome |

Idempotent: copy into `observation` with provenance; never squash notes; never invent typed height from prose here.

### Alias harvest + merch/page cleanup

| Script | Job |
|---|---|
| `harvest_bank_aliases.py` | Exact bank name ↔ URL slug → `science_alias`; skip collisions / fuzzy |
| `clean_merch_aliases.py` | Delete `bank_slug_alias:*` rows that look like merch/SKU noise |

**Noise filters (harvest + clean, `c8e0cd4`):** cartridges / prerolls / batteries / THCP / gummies / `510` / weight tokens, **and** pagination chrome `page N` / `post N` (word-boundary `page|post` + digits, plus exact `^(page|post)\s+\d+$` on `alias_norm`).

```text
# Local workset example
python scripts/project_observations_from_raw.py --db C:\DSC\collation\dsc_brain.sqlite3 --staging-dir C:\DSC\collation\staging
python scripts/harvest_bank_aliases.py --db C:\DSC\collation\dsc_brain.sqlite3 --staging-dir C:\DSC\collation\staging
python scripts/clean_merch_aliases.py --db C:\DSC\collation\dsc_brain.sqlite3 --dry-run
python scripts/clean_merch_aliases.py --db C:\DSC\collation\dsc_brain.sqlite3
python scripts/build_catalog_search_indexes.py
```

### Pitfalls

- Do **not** re-scrape banks just to refill `observation` / alias after a successful drain — chase scrape-only gaps in thin-fields.
- Skipping the four huge chem staging files is intentional; they are already in master typed chem.
- `page N` / `post N` aliases are reject/delete only — never promote them as strain names.
- Cap-slice `with_height=12` can stay flat while research `height_cm_*` rises; rebuild indexes after drain but do not invent cm to fatten the browse slice.
- Prefer Unresolved promote ops docs (shape guards / UI quarantine) when draining `lineage_unresolved` — exact match only; no fuzzy.
