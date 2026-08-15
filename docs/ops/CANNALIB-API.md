# Cannalib catalog API — moved to CannaLib

The live API, corpus, and scrape pipeline are no longer part of DSC-HUB.

| | |
|---|---|
| Repo | `Y:\Digital Stealth Care\Projects\CannaLib` |
| Ops | `CannaLib/docs/ops/CANNALIB-API.md` |
| Public | https://cannalib.plausible-deniability.net |
| LAN | http://192.168.86.2:8790 |

Hub still owns the **client**:

- `homeassistant/packages/dsc_v4_cannalib_api.yaml`
- `dsc-build-plant-card.js` / `dsc-catalog-browse-card.js`
- curated Want YAML
- capped `www/dsc-catalog/` indexes (built by CannaLib, synced here)

Live catalog is the CannaLib API (`input_text.dsc_cannalib_base_url`). Hub does not own the corpus.

Pull capped offline indexes (from this repo):

```text
python scripts/build_catalog_search_indexes.py
```

Runs the CannaLib builder, then copies `CannaLib/publish/dsc-catalog/*.json` into `homeassistant/www/dsc-catalog/` and `dist/dsc-catalog/`. CannaLib never writes into this tree.

**Unraid:** Recreate stack `cannalib` so mounts pick up CannaLib paths (see `services/cannalib/docker-compose.yml` trampoline). Then point Compose Manager at `.../Projects/CannaLib/services/cannalib`.
