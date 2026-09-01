# Cannalib catalog API — moved to CannaLib

The live API, corpus, and scrape pipeline are no longer part of DSC-HUB.

| | |
|---|---|
| Repo | `Y:\Digital Stealth Care\Projects\CannaLib` |
| Ops | `CannaLib/docs/ops/CANNALIB-API.md` |
| Public | https://cannalib.plausible-deniability.net |
| LAN gateway | http://192.168.86.2:8790 |
| Pi stack (sidecar) | http://cannalib:8790 inside `dsc-hub` compose |

Hub still owns the **client**:

- `homeassistant/packages/dsc_v4_cannalib_api.yaml`
- `dsc-build-plant-card.js` / `dsc-catalog-browse-card.js`
- curated Want YAML
- capped `www/dsc-catalog/` indexes (built by CannaLib from sqlite, synced here)

## Pi brain (7.x)

- **Settings → Integrations → CannaLib API URL** is the source of truth for Compose / Research `CatalogPicker` on the Pi SPA (`VITE_DSC_PI=1` → brain `/v1/catalogs/…` proxy).
- Compose env default: `CANNALIB_API_URL=http://cannalib:8790` (local sidecar). Gateway URL is for Unraid / studio LAN only.
- **Local fallback:** when remote fails and **Use on-Pi sqlite fallback** is checked, brain reads `CANNALIB_DB_PATH` (default `/cannalib/dsc_brain.sqlite3`, volume-shared with the `cannalib` service). If no DB is mounted, `/v1/catalogs/*` returns **503** with an explicit message — no silent empty results.
- Slim Want YAML (`/catalogs/*`) remains the last tier inside the brain proxy when the corpus DB is absent.

Pull capped offline indexes (from this repo):

```text
python scripts/build_catalog_search_indexes.py
```

Runs the CannaLib builder, then copies `CannaLib/publish/dsc-catalog/*.json` into `homeassistant/www/dsc-catalog/` and `dist/dsc-catalog/`. CannaLib never writes into this tree.

**Unraid:** Recreate stack `cannalib` so mounts pick up CannaLib paths (see `services/cannalib/docker-compose.yml` trampoline). Then point Compose Manager at `.../Projects/CannaLib/services/cannalib`.

## Lab gateway offset (tip `f029702`)

Post-mega track **A** verified offset/pagination against the LAN gateway (`http://192.168.86.2:8790`): `/v1/catalogs/strain?offset=0` vs `offset=3` return distinct rows (`/settings/catalog/status` remote ok). Kit uses that LAN URL — external prod CDN deploy is N/A for this lab path. Evidence: [`../qa/AUDIT-CLOSURE-2026-09-D-C-A-B.md`](../qa/AUDIT-CLOSURE-2026-09-D-C-A-B.md).
