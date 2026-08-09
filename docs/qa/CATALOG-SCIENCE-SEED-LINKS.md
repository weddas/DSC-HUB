# Catalog science ↔ seed links

Generated: 2026-08-07T14:37:43Z

Matching policy: exact `name_norm` → canonical parent; also link matching variants. Fuzzy matches are not applied unless logged with confidence < 1.0.

**Linker implementation (2026-08-09):** `brain/dsc_brain/corpus.py` `link_science_to_seed` is set-based `INSERT…SELECT` (NAS-safe). Prefer one end-link via `merge_staging_to_master.py --link-only` after typed `--no-link` family merges — see [`CATALOG-RESEARCH-CORPUS.md`](CATALOG-RESEARCH-CORPUS.md) § Merge-link ops. Table counts below are a mid-ingest snapshot; post exclusive local-SSD finish, FOLLOWUPS records master `entity_link≈2752186` and end-link ~1.61M new variant edges.

## Coverage

| Metric | Count |
|---|---|
| Chemistry profiles | 330046 |
| Seed canonical | 56962 |
| Seed variants | 17559 |
| Chem→seed edges | 865383 |
| Distinct chem with ≥1 link | 329976 |
| Chem with no seed match (gaps) | 70 |

## By method

| Method | Edges |
|---|---|
| `exact_name_norm` | 865383 |

## Sample links

| Chem name | → kind | → id | method | conf |
|---|---|---|---|---|
| Blue Dream | `strain_canonical` | `blue dream` | `exact_name_norm` | 1.0 |
| Blue Dream | `strain_variant` | `blue dream::unknown breeder` | `exact_name_norm` | 1.0 |
| Blue Dream | `strain_variant` | `blue dream::garden of green` | `exact_name_norm` | 1.0 |
| Blue Dream | `strain_variant` | `blue dream::nirvana seeds` | `exact_name_norm` | 1.0 |
| Blue Dream | `strain_variant` | `blue dream::oo seeds` | `exact_name_norm` | 1.0 |
| Blue Dream | `strain_variant` | `blue dream::cali weed seeds` | `exact_name_norm` | 1.0 |
| Blue Dream | `strain_variant` | `blue dream::seed city bulk cannabis seeds` | `exact_name_norm` | 1.0 |
| Blue Dream | `strain_variant` | `blue dream::spliff seeds` | `exact_name_norm` | 1.0 |
| Blue Dream | `strain_variant` | `blue dream::humboldt seed organisation` | `exact_name_norm` | 1.0 |
| Blue Dream | `strain_variant` | `blue dream::seedsman seeds` | `exact_name_norm` | 1.0 |
| Blue Dream | `strain_variant` | `blue dream::the bulldog seeds` | `exact_name_norm` | 1.0 |
| Blue Dream | `strain_variant` | `blue dream::bc bud depot` | `exact_name_norm` | 1.0 |
| Blue Dream | `strain_variant` | `blue dream::barneys farm seeds` | `exact_name_norm` | 1.0 |
| Hyperdrive | `strain_canonical` | `hyperdrive` | `exact_name_norm` | 1.0 |
| Blueberry | `strain_canonical` | `blueberry` | `exact_name_norm` | 1.0 |
| Blueberry | `strain_variant` | `blueberry::dj short` | `exact_name_norm` | 1.0 |
| Blueberry | `strain_variant` | `blueberry::dutch passion seeds` | `exact_name_norm` | 1.0 |
| Blueberry | `strain_variant` | `blueberry::seed city bulk cannabis seeds` | `exact_name_norm` | 1.0 |
| Blueberry | `strain_variant` | `blueberry::phoenix cannabis seeds` | `exact_name_norm` | 1.0 |
| Blueberry | `strain_variant` | `blueberry::oo seeds` | `exact_name_norm` | 1.0 |
| Blueberry | `strain_variant` | `blueberry::bsf seeds` | `exact_name_norm` | 1.0 |
| Blueberry | `strain_variant` | `blueberry::dj short seeds` | `exact_name_norm` | 1.0 |
| Blueberry | `strain_variant` | `blueberry::seedsman seeds` | `exact_name_norm` | 1.0 |
| Blueberry | `strain_variant` | `blueberry::zambeza seeds` | `exact_name_norm` | 1.0 |
| Blueberry | `strain_variant` | `blueberry::nirvana seeds` | `exact_name_norm` | 1.0 |
