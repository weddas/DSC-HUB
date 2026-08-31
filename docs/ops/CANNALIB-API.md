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
- kit PPFD maps under `www/dsc-catalog/ppfd/` (Wave 3)

## Pi brain (7.x)

- **Settings → Integrations → CannaLib API URL** is the source of truth for Compose / Research `CatalogPicker` on the Pi SPA (`VITE_DSC_PI=1` → brain `/v1/catalogs/…` proxy).
- Compose env default: `CANNALIB_API_URL=http://cannalib:8790` (local sidecar). Gateway URL is for Unraid / studio LAN only.
- **Local fallback:** when remote fails and **Use on-Pi sqlite fallback** is checked, brain reads `CANNALIB_DB_PATH` (default `/cannalib/dsc_brain.sqlite3`, volume-shared with the `cannalib` service). If no DB is mounted, `/v1/catalogs/*` returns **503** with an explicit message — no silent empty results.
- Slim Want YAML (`/catalogs/*`) remains the last tier inside the brain proxy when the corpus DB is absent.

### Catalog endpoints (brain proxy — tip `28953ae`)

| Method | Path | Notes |
|---|---|---|
| `GET` | `/v1/catalogs/{kind}?q=&limit=&offset=` | `kind`: strains · nutrients · mediums · lights. `limit` 1–100; `offset` 0–500000 |
| `GET` | `/v1/catalogs/strains/{strain_id}` | Live strain_tree hydrate (licensed media when present) |
| `GET` | `/v1/media/assets/{asset_id}` | Same-origin media bytes for Pi Research cards |

**Offset honesty:** if remote returns the same first id as `offset=0` while requested `offset>0`, brain treats remote offset as ignored and falls through to on-Pi sqlite `OFFSET` (`integrations.catalog_search`). Hub trampoline `services/cannalib/standalone_server.py` implements offset; production CDN deploy is still deferred (FOLLOWUPS).

**SPA client:** `frontend/src/lib/catalog.ts` — Pi uses brain proxy; HA panel may hit CannaLib base URL directly. `catalogMediaBase` is `""` on Pi so media stays same-origin. Developer SoT: [`docs/brain/OPERATOR-POLISH.md`](../brain/OPERATOR-POLISH.md).

### Kit PPFD (local only)

```text
python scripts/fetch_kit_ppfd_maps.py
# optional crop: python scripts/crop_kit_ppfd_maps.py
```

Archives SF1000 / SF2000 / SE7000 / TS1000 under `homeassistant/www/dsc-catalog/ppfd/` + `manifest.json`. SPA refuses manufacturer CDN URLs at render time.

Pull capped offline indexes (from this repo):

```text
python scripts/build_catalog_search_indexes.py
```

Runs the CannaLib builder, then copies `CannaLib/publish/dsc-catalog/*.json` into `homeassistant/www/dsc-catalog/` and `dist/dsc-catalog/`. CannaLib never writes into this tree. Tip `94705f0` HACS-synced `dist/` lights index after PPFD rewrite.

**Unraid:** Recreate stack `cannalib` so mounts pick up CannaLib paths (see `services/cannalib/docker-compose.yml` trampoline). Then point Compose Manager at `.../Projects/CannaLib/services/cannalib`.
