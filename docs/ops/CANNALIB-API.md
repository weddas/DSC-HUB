# Cannalib catalog API — moved to CannaLib

The live API, corpus, and scrape pipeline live in the **CannaLib** project.
DSC-HUB owns the **Pi brain client** (Settings Integrations + `/v1/catalogs/…`
proxy) and an optional thin sidecar under `services/cannalib/`.

| | |
|---|---|
| Repo | `Y:\Digital Stealth Care\Projects\CannaLib` |
| Ops | `CannaLib/docs/ops/CANNALIB-API.md` |
| Public | https://cannalib.plausible-deniability.net |
| LAN gateway | http://192.168.86.2:8790 |
| Pi stack (sidecar) | http://cannalib:8790 inside `dsc-hub` compose (`--profile thin-catalog`) |

## Pi brain (8.x)

- **Settings → Integrations → CannaLib API URL** is the source of truth for Compose / Research `CatalogPicker` on the Pi SPA (`VITE_DSC_PI=1` → brain `/v1/catalogs/…` proxy).
- Compose env default for the brain service leaves `CANNALIB_API_URL` empty unless set in `.env`. Point it at the public/LAN CannaLib, or at `http://cannalib:8790` only when the thin-catalog profile is actually running.
- **Local fallback:** when remote fails and **Use on-Pi sqlite fallback** is checked, brain reads `CANNALIB_DB_PATH` (default `/cannalib/dsc_brain.sqlite3`, volume-shared with the optional `cannalib` service). If no DB is mounted, `/v1/catalogs/*` returns **503** with an explicit message — no silent empty results.
- Slim Want YAML (`/catalogs/*`) remains the last tier inside the brain proxy when the corpus DB is absent.
- **Lights detail (Light desk maker PPFD):** SPA `fetchLightDetail` → brain `GET /v1/catalogs/lights/{light_id}` (proxied to CannaLib). Returns the structured light record (`ppfd_maps`, spectra, provenance). Binding + field model: [`../brain/PPFD-FIELD.md`](../brain/PPFD-FIELD.md).

## Thin-catalog sidecar vs SD bake

`services/dsc-hub/docker-compose.yml` defines an optional `cannalib` service:

| Fact | Source |
|---|---|
| Opt-in profile | `profiles: ["thin-catalog"]` — **not** started by default compose |
| Build context | `../cannalib` → repo `services/cannalib/` (Dockerfile + `standalone_server.py`) |
| Image tag | `dsc-hub-cannalib:8.1.0` |
| Data | read-only `${DSC_DATA}/cannalib` → `/data` |

**Honesty for a baked SD card (tip `50ee584` / merge `4ef6696`):** the linux bake
**does** ship the profile pieces:

1. `.audit/kit-linux-bake.ps1` packs `services/cannalib` into the upload tar.
2. `bake-on-linux.sh` stages `/opt/cannalib` so compose’s `../cannalib` resolves
   for an on-card rebuild, and `docker save`s `dsc-hub-cannalib:<version>` with
   the brain image (`"${ARR[@]+"${ARR[@]}"}"` so `set -u` survives a missing
   Dockerfile).

```bash
docker compose --profile thin-catalog up -d
# on an 8.1.0 card: uses preloaded dsc-hub-cannalib image (offline)
```

Default kit catalog path stays: remote CannaLib URL (Settings) → optional on-Pi
sqlite under `/var/lib/dsc-hub/cannalib/` → slim Want YAML. Thin-catalog is still
**opt-in** — default boot is brain + mosquitto + z2m only. Card bake runbook:
[`../../services/dsc-hub/image/README.md`](../../services/dsc-hub/image/README.md).

## Offline indexes / Unraid

Pull capped offline indexes (from this repo):

```text
python scripts/build_catalog_search_indexes.py
```

Runs the CannaLib builder, then copies publish indexes into the catalog trees
CannaLib documents. CannaLib never writes into DSC-HUB trees on its own.

**Unraid:** Recreate stack `cannalib` so mounts pick up CannaLib paths (see
`services/cannalib/docker-compose.yml` trampoline). Then point Compose Manager at
`.../Projects/CannaLib/services/cannalib`.
