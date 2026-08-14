# Cannalib catalog API — ops runbook

Full-corpus strain/product search API for DSC-HUB. Serves **~195 266** `strain_canonical` rows from the densified brain SQLite — **not** the HA static 10k index under `/local/dsc-catalog/`.

| Field | Value |
|---|---|
| Service | `cannalib` `0.2.1-stdlib` |
| Code | `services/cannalib/standalone_server.py` (stdlib only; no pip) |
| Compose | `services/cannalib/docker-compose.yml` |
| Host | Unraid **Digital-Gateway** `192.168.86.2` |
| Share | `Y:` = `Digital-Documents` on this same box (not a second NAS) |
| Public URL | `https://cannalib.plausible-deniability.net` |
| LAN URL | `http://192.168.86.2:8790` |
| Origin (tunnel) | `http://127.0.0.1:8790` |
| Follow-up | N-087-CANNALIB (`docs/FOLLOWUPS.md`) |

---

## 1. Credentials & auth

There is **no username / password** on this API. Auth is a single shared **API key** header (or none, while catalog is public).

### 1.1 Current deploy secrets

| Secret | Purpose | Where set | Current value |
|---|---|---|---|
| `CANNALIB_API_KEY` | Metrics auth; optional full-API lock | Compose env on Unraid stack `cannalib` | `MDFSLeCDOKhu1hJzTsjV3HmOkDSXoJUbehSeMGslS8U` |
| HA `input_text.dsc_cannalib_api_key` | Same key for REST metrics + cards | Home Assistant helper | Set 2026-08-12 (matches compose) |
| HA `input_text.dsc_cannalib_base_url` | Public base URL for sensors/cards | Home Assistant helper | `https://cannalib.plausible-deniability.net` |

**Header name:** `X-Cannalib-Key` (override with `CANNALIB_API_KEY_HEADER`).

**Username / password:** none. Do not invent Basic Auth for this service unless you add it deliberately in front (Cloudflare Access / NPM).

### 1.2 Auth modes

| Mode | Env | Catalog `/v1/catalogs/*`, `/v1/corpus` | `/v1/metrics` |
|---|---|---|---|
| **Public catalog (current)** | `CANNALIB_REQUIRE_API_KEY=false`, `CANNALIB_METRICS_REQUIRE_KEY=true`, key set | Open (rate-limited) | Key required |
| Full private | `CANNALIB_REQUIRE_API_KEY=true` + key set | Key required | Key required |
| Metrics open (not recommended) | `CANNALIB_METRICS_REQUIRE_KEY=false` or empty key | Open | Open |

### 1.3 Example authenticated call

```bash
curl -sS -H "X-Cannalib-Key: MDFSLeCDOKhu1hJzTsjV3HmOkDSXoJUbehSeMGslS8U" \
  https://cannalib.plausible-deniability.net/v1/metrics
```

### 1.4 Rotate the key

1. Generate a new random value (32+ bytes, URL-safe).
2. Update `CANNALIB_API_KEY` in:
   - `services/cannalib/docker-compose.yml`
   - Unraid Compose Manager stack editor (if it holds a copy — stack uses **external** path to the repo compose; recreate still required)
3. Compose **Recreate** stack `cannalib` (env is baked at container create).
4. Paste the same value into HA `input_text.dsc_cannalib_api_key`.
5. Update this doc’s credentials table.
6. Confirm: metrics without key → `401`; with key → JSON.

### 1.5 Operator logins (not Cannalib-specific)

These are existing infra accounts — Cannalib does not create its own:

| System | Login | Notes |
|---|---|---|
| Unraid Digital-Gateway | Your Unraid web UI user | Docker / Compose Manager / File Manager |
| Cloudflare Zero Trust / Dash | Your Cloudflare account | Tunnel **Wordpress**, zone `plausible-deniability.net` |
| Home Assistant | Your HA user | Helpers + REST sensors |

No Cannalib DB user: SQLite is file-mounted **read-only**; no Postgres/MySQL.

---

## 2. Network & Cloudflare

### 2.1 Addresses

| Layer | Address |
|---|---|
| Container listen | `0.0.0.0:8790` |
| Host publish | `192.168.86.2:8790` → container `8790` |
| Tunnel origin | `http://127.0.0.1:8790` (host network path from `CloudflaredTunnel`) |
| Public hostname | `cannalib.plausible-deniability.net` |
| TLS | Cloudflare edge HTTPS → origin **HTTP** (no TLS on container) |

### 2.2 Tunnel (live)

| Field | Value |
|---|---|
| Tunnel name | **Wordpress** |
| Tunnel id | `9bf3f88d-9f4d-4726-8391-c7ad3e81a228` |
| Runner | Unraid container **CloudflaredTunnel** (host network) |
| Zone | `plausible-deniability.net` (id `4eb7ce33b8ac73556265f9641fbfe3e1`) |
| Public hostname | Subdomain `cannalib` + domain `plausible-deniability.net` |
| Path | *(empty)* — not `^/blog` |
| Service type | HTTP |
| Service URL | `127.0.0.1:8790` |
| DNS | CNAME created by CF Save (“Successfully updated DNS Record for cannalib…”) |

Sibling routes on the same tunnel (do not disturb):

- `digital-emotions.net` → `http://10.10.10.12:80`
- `stream.digital-emotions.net` → `http://127.0.0.1:8280`

NPM is **not** required for this hostname.

### 2.3 Proxy trust

`CANNALIB_TRUST_PROXY=true` (required behind CF). Client IP for rate limits comes from `CF-Connecting-IP` / `X-Forwarded-For`. Leave `false` only when hitting `:8790` directly with no proxy.

---

## 3. Unraid / Compose stack

| Field | Value |
|---|---|
| Stack name | `cannalib` |
| Compose Manager project path | `/boot/config/plugins/compose.manager/projects/cannalib` |
| External compose path | `/mnt/user/Digital-Documents/Digital Stealth Care/Projects/DSC-HUB/services/cannalib` |
| Compose file | `docker-compose.yml` (default discovery) |
| Image | `python:3.12-slim` |
| Container name | `cannalib` |
| Command | `python -u /app/standalone_server.py` |
| Restart | `unless-stopped` |
| Network (typical) | `cannalib_default` bridge; port map `8790:8790` |

### Recreate after env / mount changes

Unraid Docker → Compose stacks → `cannalib` → **Force Update** / **Compose Recreate**, or from Compose Manager JS: `composeUpRecreate`.

Plain **Restart** does **not** pick up new env vars.

Windows clients usually have no `docker` CLI and no SSH to this box — use the Unraid UI.

---

## 4. Mounts

All binds are **`:ro`**. Root filesystem is also `read_only: true` with `tmpfs: /tmp`.

| Host path (Unraid) | Container | Mode | Why |
|---|---|---|---|
| `.../DSC-HUB/services/cannalib/standalone_server.py` | `/app/standalone_server.py` | ro | Live code; edit on share → recreate/restart to load |
| `.../DSC-HUB/brain/data/dsc_brain.sqlite3` | `/data/dsc_brain.sqlite3` | ro | Full research corpus |
| `.../DSC-HUB/brain/data/dsc_brain.sqlite3-wal` | `/data/dsc_brain.sqlite3-wal` | ro | WAL sibling — **required** |
| `.../DSC-HUB/brain/data/dsc_brain.sqlite3-shm` | `/data/dsc_brain.sqlite3-shm` | ro | SHM sibling — **required** |

Full host prefix:

`/mnt/user/Digital-Documents/Digital Stealth Care/Projects/DSC-HUB/`

Windows / SMB: `Y:\Digital Stealth Care\Projects\DSC-HUB\...`

**Do not** mount only the main `.sqlite3` file. Without `-wal`/`-shm`, queries fail or see a stale empty DB.

**Do not** mount the whole `brain/data` directory (backup noise / wrong files).

### Hardening mounts / caps

- `read_only: true`
- `tmpfs: /tmp`
- `security_opt: [no-new-privileges:true]`
- `cap_drop: [ALL]`

---

## 5. Environment variables

| Variable | Current | Meaning |
|---|---|---|
| `CANNALIB_DB_PATH` | `/data/dsc_brain.sqlite3` | SQLite path inside container |
| `CANNALIB_REQUIRE_API_KEY` | `false` | Lock all `/v1/*` when `true` |
| `CANNALIB_METRICS_REQUIRE_KEY` | `true` | Key `/v1/metrics` when key set |
| `CANNALIB_API_KEY` | *(see §1.1)* | Shared secret |
| `CANNALIB_TRUST_PROXY` | `true` | Trust CF client IP headers |
| `CANNALIB_RATE_LIMIT_ENABLED` | `true` | Soft per-IP limits |
| `CANNALIB_RATE_LIMIT_RPM` | `120` | Sustained rate |
| `CANNALIB_RATE_LIMIT_BURST` | `40` | Burst tokens |
| `CANNALIB_COOLDOWN_BASE_S` | `0.25` | Progressive sleep base |
| `CANNALIB_COOLDOWN_MAX_S` | `8` | Cap sleep |
| `CANNALIB_COOLDOWN_429_AFTER` | `3` | Hard 429 after streak |
| `CANNALIB_MAX_Q_LEN` | `120` | Max `q` query length |
| `CANNALIB_MAX_LIMIT` | `50` | Max `limit` |
| `CANNALIB_HOST` | default `0.0.0.0` | Bind (optional) |
| `CANNALIB_PORT` | default `8790` | Listen port (optional) |
| `CANNALIB_CORS_ORIGINS` | default `*` | CORS (browser HA cards) |

---

## 6. HTTP API

Methods: **GET / HEAD / OPTIONS** only. POST/PUT/PATCH/DELETE → `405`.

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/health` or `/v1/health` | none | Liveness; shows `trust_proxy`, `auth` |
| GET | `/` | none | Tiny service stub |
| GET | `/v1/corpus` | public\* | Counts; prove uncapped |
| GET | `/v1/catalogs/strains?q=&limit=` | public\* | Full-corpus typeahead |
| GET | `/v1/catalogs/strains/{id}` | public\* | Hydrate one strain |
| GET | `/v1/catalogs/nutrients?q=&limit=` | public\* | Products |
| GET | `/v1/catalogs/mediums?q=&limit=` | public\* | Products |
| GET | `/v1/catalogs/lights?q=&limit=` | public\* | Products |
| GET | `/v1/metrics` | **key** | HA traffic / corpus snapshot |
| GET | `/robots.txt` `/ai.txt` `/llms.txt` | none | Disallow crawlers |

\*Public while `CANNALIB_REQUIRE_API_KEY=false`. Soft rate limits + bot UA blocks still apply.

### Smoke tests

```bash
curl -sS https://cannalib.plausible-deniability.net/health
curl -sS "https://cannalib.plausible-deniability.net/v1/catalogs/strains?q=blue%20dream&limit=2"
curl -sS https://cannalib.plausible-deniability.net/v1/corpus
curl -sS http://192.168.86.2:8790/health
```

Expect corpus `strains` ≈ **195266**.

---

## 7. Home Assistant

| Piece | Path / entity |
|---|---|
| Package | `homeassistant/packages/dsc_v4_cannalib_api.yaml` |
| Base URL helper | `input_text.dsc_cannalib_base_url` |
| API key helper | `input_text.dsc_cannalib_api_key` |
| Sensors | `sensor.dsc_cannalib_api_hits`, `…_bytes_in`, `…_bytes_out`, `…_corpus_strains`, `…_bw_summary` |
| Online | `binary_sensor.dsc_cannalib_api_online` |
| Home tiles | `homeassistant/dashboards/modules/view_home.yaml` |
| Cards | `homeassistant/www/dsc-build-plant-card.js`, `dsc-catalog-browse-card.js` |

Cards call `GET {base}/v1/catalogs/{domain}?q=&limit=` and send `X-Cannalib-Key` when the helper is non-empty. Local JSON under `/local/dsc-catalog/` remains **offline fallback** (capped).

REST poll: every 30s → `{base}/v1/metrics` with UA `HomeAssistant/DSC-HUB cannalib-ha`.

---

## 8. Security posture (honest)

| Control | Status |
|---|---|
| Read-only SQLite (`mode=ro` + `query_only`) | yes |
| Read-only rootfs + drop all caps | yes |
| GET-only, no body parsers | yes |
| Metrics keyed | yes (current) |
| Catalog public | yes (by design) |
| Bot UA block | soft |
| Rate limits | soft; real brake is CF + WAF later |
| Scrapable by browser-like clients | **yes** — not a secrets store |

Flip private: set `CANNALIB_REQUIRE_API_KEY=true`, recreate, keep HA key in sync.

---

## 9. Related files

| Path | Role |
|---|---|
| `services/cannalib/standalone_server.py` | API implementation |
| `services/cannalib/docker-compose.yml` | Deploy SoT for env + mounts |
| `services/cannalib/README.md` | Short overview → points here |
| `brain/data/dsc_brain.sqlite3` (+ wal/shm) | Corpus SoT |
| `homeassistant/packages/dsc_v4_cannalib_api.yaml` | HA sensors/helpers |
| `docs/FOLLOWUPS.md` § N-087-CANNALIB | Open follow-ups (HA key paste, optional FTS) |

---

## 10. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `{"detail":"not found"}` on `/v1/search` | Wrong path | Use `/v1/catalogs/strains?q=` |
| Empty / SQL errors | Missing WAL/SHM mounts | Mount all three DB files |
| `trust_proxy: false` after compose edit | Container not recreated | Compose Recreate |
| Metrics `401` from HA | Helper key empty / mismatch | Paste compose key into `input_text.dsc_cannalib_api_key` |
| Public hostname 502/timeout | Tunnel route or container down | Check CF ingress + `docker`/stack status + `:8790` LAN |
| Rate limits all from one IP | `TRUST_PROXY=false` behind CF | Set true + recreate |
| CF dash “url is required” | Type HTTPS by mistake / empty URL binding | Type **HTTP**, URL `127.0.0.1:8790`, empty path |

---

*Last verified: 2026-08-12 — public HTTPS health/search/corpus OK; `trust_proxy: true`; metrics keyed.*
