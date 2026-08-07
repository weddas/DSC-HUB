# Strain data sources

- `dsc_strain_catalog.yaml`: commit-worthy curated Want bands used for Home Assistant promotion.
- `dsc_strains_popular.json`: generated MVP fixture with 40 familiar names.
- `dsc_lab_terpenes_mvp.json`: generated slim synthetic chemistry fixtures for index behavior.
- `dsc_strains_merged.json`: generated local merge output.

The JSON files are MVP development data, not a full bank/laboratory crawl and
not cultivation or potency guidance. Recreate missing fixtures with
`python scripts/seed_mvp_catalog_data.py`, then merge with
`python scripts/merge_strain_catalogs.py --write --chemistry`.
