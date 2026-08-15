# Cannalib catalog API

Public hostname: **https://cannalib.plausible-deniability.net**

Full-corpus search (`strain_canonical` ~195k+), not the HA static 10k index.

**Ops runbook (credentials, mounts, tunnel, HA, rotate key):**  
[`docs/ops/CANNALIB-API.md`](../../docs/ops/CANNALIB-API.md)

## Endpoints

| Path | Purpose |
|---|---|
| `GET /v1/catalogs/strains?q=&limit=` | Typeahead over **all** strains (+ aliases) |
| `GET /v1/catalogs/strains/{id}` | Hydrate one strain |
| `GET /v1/catalogs/{nutrients\|mediums\|lights}?q=` | Product tables |
| `GET /v1/corpus` | Counts |
| `GET /v1/metrics` | Hits + bytes (requires `X-Cannalib-Key`) |
| `GET /health` | Liveness |
| `GET /robots.txt` `/ai.txt` `/llms.txt` | Disallow crawlers |

## Quick facts

| | |
|---|---|
| Host | Unraid Digital-Gateway `192.168.86.2:8790` |
| Tunnel | Wordpress → `http://127.0.0.1:8790` |
| Auth | No user/password — API key header only |
| Catalog | Public by default; metrics keyed |
| Code | `standalone_server.py` + `docker-compose.yml` |
| HA | `dsc_v4_cannalib_api.yaml` — paste key into `input_text.dsc_cannalib_api_key` |

## Flip to private later

1. Rotate / set `CANNALIB_API_KEY`.
2. `CANNALIB_REQUIRE_API_KEY=true` + Compose Recreate.
3. Same key in `input_text.dsc_cannalib_api_key`. Details in the ops runbook.
