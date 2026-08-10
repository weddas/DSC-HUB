"""N-087 research corpus SQLite schema (science + seed + overflow attrs).

Schema v3 adds `raw_record` for fat source payloads (staging overflow / sidecars)
so importers never explode high-cardinality columns into `attribute_kv`.

Schema v4 adds first-class `observation` + `review` tables (collation contract).
Additive only — never drops or rewrites existing tables.
"""

from __future__ import annotations

SCHEMA_VERSION = "4"

CORPUS_SCHEMA = """
CREATE TABLE IF NOT EXISTS meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS source_record (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT,
  license TEXT,
  redistributable INTEGER NOT NULL DEFAULT 0,
  fetched_at TEXT,
  note TEXT
);

CREATE TABLE IF NOT EXISTS strain_canonical (
  name_norm TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT,
  summary_json TEXT NOT NULL DEFAULT '{}',
  curated INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS strain_variant (
  id TEXT PRIMARY KEY,
  name_norm TEXT NOT NULL,
  name TEXT NOT NULL,
  breeder TEXT,
  source_id TEXT,
  bank_url TEXT,
  props_json TEXT NOT NULL DEFAULT '{}',
  FOREIGN KEY(name_norm) REFERENCES strain_canonical(name_norm),
  FOREIGN KEY(source_id) REFERENCES source_record(id)
);

CREATE TABLE IF NOT EXISTS chemistry_profile (
  id TEXT PRIMARY KEY,
  name_norm TEXT,
  name TEXT NOT NULL,
  source_id TEXT,
  thc_min REAL,
  thc_max REAL,
  cbd_min REAL,
  cbd_max REAL,
  top_terpenes_json TEXT,
  payload_json TEXT NOT NULL DEFAULT '{}',
  FOREIGN KEY(source_id) REFERENCES source_record(id)
);

CREATE TABLE IF NOT EXISTS grow_trait (
  id TEXT PRIMARY KEY,
  name_norm TEXT NOT NULL,
  source_id TEXT,
  height_cm_min REAL,
  height_cm_max REAL,
  flowering_days_min REAL,
  flowering_days_max REAL,
  yield_indoor TEXT,
  yield_outdoor TEXT,
  climate TEXT,
  payload_json TEXT NOT NULL DEFAULT '{}',
  FOREIGN KEY(name_norm) REFERENCES strain_canonical(name_norm),
  FOREIGN KEY(source_id) REFERENCES source_record(id)
);

CREATE TABLE IF NOT EXISTS science_alias (
  alias_norm TEXT PRIMARY KEY,
  alias TEXT NOT NULL,
  name_norm TEXT,
  source_id TEXT
);

CREATE TABLE IF NOT EXISTS entity_link (
  id TEXT PRIMARY KEY,
  from_kind TEXT NOT NULL,
  from_id TEXT NOT NULL,
  to_kind TEXT NOT NULL,
  to_id TEXT NOT NULL,
  method TEXT NOT NULL,
  confidence REAL NOT NULL DEFAULT 1.0,
  source TEXT
);

CREATE TABLE IF NOT EXISTS attribute_kv (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity_kind TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT,
  unit TEXT,
  source_id TEXT
);

-- Fat overflow: FULL source row payloads (staging overflow / sidecars).
CREATE TABLE IF NOT EXISTS raw_record (
  id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL,
  entity_kind TEXT NOT NULL,
  entity_id TEXT,
  name_norm TEXT,
  payload_json TEXT NOT NULL,
  payload_sha1 TEXT,
  stored_at TEXT,
  FOREIGN KEY(source_id) REFERENCES source_record(id)
);

-- v4: append-only grow notes / forum docs / bank note blobs (collation contract).
CREATE TABLE IF NOT EXISTS observation (
  id TEXT PRIMARY KEY,
  name_norm TEXT NOT NULL,
  variant_id TEXT,
  source_id TEXT NOT NULL,
  observed_at TEXT,
  kind TEXT NOT NULL,
  title TEXT,
  body_text TEXT NOT NULL,
  payload_json TEXT NOT NULL DEFAULT '{}',
  raw_record_id TEXT,
  created_at TEXT
);

-- v4: user/review bodies — separate from lab chem and effects vibes.
CREATE TABLE IF NOT EXISTS review (
  id TEXT PRIMARY KEY,
  name_norm TEXT NOT NULL,
  variant_id TEXT,
  source_id TEXT NOT NULL,
  observed_at TEXT,
  kind TEXT NOT NULL DEFAULT 'review',
  title TEXT,
  body_text TEXT NOT NULL,
  rating REAL,
  reviewer TEXT,
  payload_json TEXT NOT NULL DEFAULT '{}',
  raw_record_id TEXT,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS schema_extension_log (
  key TEXT PRIMARY KEY,
  entity_kind TEXT NOT NULL,
  hit_count INTEGER NOT NULL DEFAULT 0,
  suggested_table TEXT,
  status TEXT NOT NULL DEFAULT 'seen',
  first_seen_at TEXT,
  last_seen_at TEXT
);

CREATE TABLE IF NOT EXISTS light_fixture (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT,
  source_id TEXT,
  wattage_w REAL,
  ppf_umol_s REAL,
  efficacy_umol_j REAL,
  payload_json TEXT NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS nutrient_product (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT,
  category TEXT,
  source_id TEXT,
  dose_ml_l REAL,
  stage TEXT,
  npk TEXT,
  payload_json TEXT NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS medium_product (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT,
  category TEXT,
  source_id TEXT,
  composition TEXT,
  payload_json TEXT NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS media_asset (
  id TEXT PRIMARY KEY,
  entity_kind TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  source_url TEXT,
  local_path TEXT,
  crop_json TEXT,
  note TEXT
);

CREATE TABLE IF NOT EXISTS followup_gap (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity_kind TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  field TEXT NOT NULL,
  reason TEXT NOT NULL,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS export_manifest (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  include_json TEXT NOT NULL,
  note TEXT
);

CREATE TABLE IF NOT EXISTS search_docs (
  kind TEXT NOT NULL,
  id TEXT NOT NULL,
  name TEXT NOT NULL,
  haystack TEXT NOT NULL,
  PRIMARY KEY (kind, id)
);

CREATE INDEX IF NOT EXISTS idx_variant_norm ON strain_variant(name_norm);
CREATE INDEX IF NOT EXISTS idx_chem_norm ON chemistry_profile(name_norm);
CREATE INDEX IF NOT EXISTS idx_attr_entity ON attribute_kv(entity_kind, entity_id);
CREATE INDEX IF NOT EXISTS idx_link_to ON entity_link(to_kind, to_id);
CREATE INDEX IF NOT EXISTS idx_link_from ON entity_link(from_kind, from_id);
CREATE INDEX IF NOT EXISTS idx_raw_source ON raw_record(source_id);
CREATE INDEX IF NOT EXISTS idx_raw_norm ON raw_record(name_norm);
CREATE INDEX IF NOT EXISTS idx_raw_sha ON raw_record(payload_sha1);
CREATE INDEX IF NOT EXISTS idx_alias_norm ON science_alias(name_norm);
CREATE INDEX IF NOT EXISTS idx_obs_norm ON observation(name_norm);
CREATE INDEX IF NOT EXISTS idx_obs_source ON observation(source_id);
CREATE INDEX IF NOT EXISTS idx_obs_raw ON observation(raw_record_id);
CREATE INDEX IF NOT EXISTS idx_obs_kind ON observation(kind);
CREATE INDEX IF NOT EXISTS idx_rev_norm ON review(name_norm);
CREATE INDEX IF NOT EXISTS idx_rev_source ON review(source_id);
CREATE INDEX IF NOT EXISTS idx_rev_raw ON review(raw_record_id);
CREATE INDEX IF NOT EXISTS idx_rev_kind ON review(kind);
"""

# Additive DDL for existing DBs (applied by _migrate_schema).
SCHEMA_V4_OBSERVATION_REVIEW = """
CREATE TABLE IF NOT EXISTS observation (
  id TEXT PRIMARY KEY,
  name_norm TEXT NOT NULL,
  variant_id TEXT,
  source_id TEXT NOT NULL,
  observed_at TEXT,
  kind TEXT NOT NULL,
  title TEXT,
  body_text TEXT NOT NULL,
  payload_json TEXT NOT NULL DEFAULT '{}',
  raw_record_id TEXT,
  created_at TEXT
);
CREATE TABLE IF NOT EXISTS review (
  id TEXT PRIMARY KEY,
  name_norm TEXT NOT NULL,
  variant_id TEXT,
  source_id TEXT NOT NULL,
  observed_at TEXT,
  kind TEXT NOT NULL DEFAULT 'review',
  title TEXT,
  body_text TEXT NOT NULL,
  rating REAL,
  reviewer TEXT,
  payload_json TEXT NOT NULL DEFAULT '{}',
  raw_record_id TEXT,
  created_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_obs_norm ON observation(name_norm);
CREATE INDEX IF NOT EXISTS idx_obs_source ON observation(source_id);
CREATE INDEX IF NOT EXISTS idx_obs_raw ON observation(raw_record_id);
CREATE INDEX IF NOT EXISTS idx_obs_kind ON observation(kind);
CREATE INDEX IF NOT EXISTS idx_rev_norm ON review(name_norm);
CREATE INDEX IF NOT EXISTS idx_rev_source ON review(source_id);
CREATE INDEX IF NOT EXISTS idx_rev_raw ON review(raw_record_id);
CREATE INDEX IF NOT EXISTS idx_rev_kind ON review(kind);
"""
