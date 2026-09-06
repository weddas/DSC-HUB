# ESPHome toolchain (v8, ESPHome-only)

DSC-HUB builds every device from `firmware/v4/`. There is no Home Assistant in
the build or update path: the running per-device ESPHome version comes from the
native API, "latest" comes from PyPI, and updates are `pip`/`esphome` in a Pi
venv.

## Pieces

| Piece | Where |
|---|---|
| Version pin | `esphome: min_version: "2026.6.5"` in `dsc-hub-v4_0.yaml`, `dsc-control-common.yaml`, `dsc-pot-common.yaml`, `dsc-sonoff-common.yaml`. Builds on older ESPHome fail fast. |
| Toolchain venv | `/opt/dsc-esphome-venv` — provisioned by `dsc-esphome-venv-setup.service` (→ `services/dsc-hub/pi/dsc-esphome-venv-setup.sh`), floored to `2026.6.5`. Separate from the brain venv. |
| Dashboard | `dsc-esphome-dashboard.service` runs `esphome dashboard` on `0.0.0.0:6052`. Reachable at `http://dsc-brain.local:6052` (hostname `dsc-brain` + avahi). |
| Job runner | `brain/dsc_brain/esphome_jobs.py` — `build_backend()` picks: local `<esphome_bin> compile|run` (`cwd=firmware/v4`, `PLATFORMIO_CORE_DIR`), or `POST` to the dashboard. Serialised, one at a time. |
| Status / update API | `GET /settings/esphome/toolchain`, `POST /settings/esphome/toolchain/update`, `GET|POST /settings/esphome/rollout` (`brain/dsc_brain/esphome_toolchain.py`). |
| Settings UI | Settings → Device → **ESPHome** card: installed / latest / pinned-min, build backend, **Update ESPHome**, per-seat drift, **Open ESPHome Dashboard**, fleet-reflash prompt. |

Settings keys (`brain/dsc_brain/settings.py`): `esphome_bin`, `esphome_project_dir`,
`esphome_dashboard_url` (browser link), `esphome_dashboard_api` (brain→dashboard),
`esphome_fleet_ota_prompt`, `last_built_esphome`, `esphome_compose_file` +
`esphome_compose_update_cmd` (container-backend self-update, `{file}` placeholder).

## Update ESPHome to latest

1. Settings → Device → ESPHome. The card shows **installed** vs **latest** (PyPI,
   only when Ethernet is up) vs the **pinned min**.
2. **Update ESPHome →** the mechanism follows `build_backend()`:
   - `venv` — `pip install -U esphome` in the venv, then
     `systemctl restart dsc-esphome-dashboard`.
   - `dashboard` (containerised kit) — rewrite `image: esphome/esphome:<tag>` in
     the compose file (`esphome_compose_file`, default
     `services/dsc-hub/docker-compose.yml`) and run the redeploy
     (`esphome_compose_update_cmd`, default `docker compose -f <file> pull esphome
     && docker compose -f <file> up -d esphome`). A host without `docker` (the
     brain container) bumps the tag and returns the exact Pi steps as a `manual`
     job — it never errors.
   Refused in all cases if a compile/OTA job is queued/running, if offline, or if
   latest is below the pinned `min_version`.
3. When the venv version moves, the card offers **Reflash fleet** — one click
   enqueues an OTA per in-service seat, serialised, **hub last**. Nothing flashes
   until you confirm (`esphome_fleet_ota_prompt`).

## Bump the pinned `min_version`

Do this deliberately, not on every ESPHome release:

1. Update the venv (`Update ESPHome`, or `sudo -u dsc /opt/dsc-esphome-venv/bin/pip install -U esphome`).
2. `cd firmware/v4 && /opt/dsc-esphome-venv/bin/esphome config dsc-hub.yaml` → exit 0
   for hub / control / a pot / a sonoff.
3. Run the firmware QA rig (`scripts/run_sim_gates.sh`) → 0 violations.
4. Bump `min_version:` in the four `esphome:` blocks + `PIN=` in
   `dsc-esphome-venv-setup.sh` + `PINNED_MIN_VERSION` in `esphome_toolchain.py`,
   add a `CHANGELOG.md` line.
5. Reflash the fleet (Settings → **Reflash fleet**, or the `pi/flash-fleet-remote.sh`
   fallback).

## Build backend — resolved: the dashboard IS the build service

`services/dsc-hub/docker-compose.yml` runs the brain in `dsc-hub-brain`
(`python:3.12-slim`), which has no `esphome` binary, no `firmware/v4`, and no
Docker socket. So the brain does not shell `esphome` on the containerised kit —
it talks to the **ESPHome dashboard over HTTP**, which already has `firmware/v4`
mounted at `/config` and is reachable on the `dsc` compose network.

`esphome_toolchain.build_backend()` picks automatically:

| Result | When | compile/OTA path |
|---|---|---|
| `venv` | `esphome_bin` resolves to a real file / PATH entry (host or bind-mounted venv) | `subprocess` — streamed, real exit code |
| `dashboard` | no local CLI, but `GET {esphome_dashboard_api}/version` answers | drive the dashboard's **WebSocket** command endpoint (`ws://…/compile` \| `/upload`): send `{"type":"spawn","configuration":<yaml>}`, stream `{"event":"line"}`, finish on `{"event":"exit","code":N}` (real exit code). Uses `websockets` (already a brain dep). |
| `none` | neither | job fails clean; `pi/flash-*-remote.sh` is the manual path |

Settings keys: `esphome_dashboard_api` (brain→dashboard, default
`http://host.docker.internal:6052` — the **host** `dsc-esphome-dashboard` venv
unit, reached over the bridge; compose sets it explicitly and adds the
`host-gateway` extra_host) is separate from `esphome_dashboard_url` (the browser
link, default `http://dsc-brain.local:6052`). `_dash_get()` falls back to the
legacy container name `http://dsc-hub-esphome:6052` when the primary is down, so a
kit mid-cutover keeps working.

`installed()` and per-device `deployed` version come from `{api}/version` and
`{api}/devices` — no binary needed for the Settings card to be accurate.

### Default backend: the host venv dashboard unit (2026-09-06)

The `esphome` service in `docker-compose.yml` is now behind
`profiles: ["legacy-esphome"]` — it does **not** start by default (it and the host
unit would both bind `:6052`). The default backend is the host
`dsc-esphome-dashboard.service` (venv at `/opt/dsc-esphome-venv`, provisioned by
`dsc-esphome-venv-setup.service`), served by
`pi/dsc-esphome-dashboard-run.sh` which resolves the `firmware/v4` project dir per
layout (`/opt/dsc-hub-repo/firmware/v4` for remote-deploy, `/opt/dsc-hub/firmware/v4`
for SD; pin it with `DSC_ESPHOME_PROJECT_DIR` in `/etc/dsc-hub/esphome.env`). The
unit is `Restart=on-failure` and the wrapper exits 0 when the venv or firmware
tree isn't present yet, so it never crash-loops.

* Bakers: `image/bake-on-linux.sh` stages the wrapper + `esphome.env`;
  `image/bake-sd-image.sh` and `image/stage-dsc/01-dsc-hub.sh` enable both units;
  `pi/deploy-brain-remote.sh` installs/enables them, writes `esphome.env`, and
  `docker rm -f dsc-hub-esphome`.
* **Roll back:** `docker compose --profile legacy-esphome up -d esphome` and
  `sudo systemctl stop dsc-esphome-dashboard` (then set `esphome_dashboard_api`
  back to `http://dsc-hub-esphome:6052`, or leave it — the fallback finds it).
* **Not yet Pi-validated:** SD-bake kits need `firmware/v4` shipped in the payload
  (only `firmware/kit/` binaries ship today) for the dashboard to serve configs;
  smoke-test venv provisioning + `:6052` up + a brain compile route before relying
  on it.
* Self-update from a containerised brain still can't `pip` the host venv — that
  path stays the guided/`manual` one (or run `Update ESPHome` from a host-venv
  brain deploy where `build_backend()` is `venv`).

### Validated 2026-09-06 against the live Pi dashboard

`GET http://dsc-brain.local:6052/version` → `{"version":"2025.12.4"}`;
`/devices` → 47 configs with `current_version` / `deployed_version`.
`installed()` returned `2025.12.4`, `min_version()` `2026.6.5`, `meets_min` **False**
(the running `esphome/esphome:2025.12.4` container is below the new pin — bump it,
or move to the venv unit). `build_backend()` → `dashboard`.

`esphome config firmware/v4/dsc-hub.yaml` with the pin → **"Configuration is
valid!"** (esphome 2026.8.2, i.e. ≥ pin). Raising the pin to `2099.1.0` →
`esphome config` fails *"Your ESPHome version is too old. Please update to at
least 2099.1.0."* — the gate works.

`/compile` and `/upload` on the dashboard are **WebSocket** endpoints
(`HTTP 101` on upgrade; plain POST → `405`). `_run_job_via_dashboard()` drives
them via `websockets.sync.client`. The `/upload` (live OTA) path has **not** been
fired at a device.

~~The `dsc-hub-esphome` compose service is kept … as the current build backend~~
**Superseded 2026-09-06** — see "Default backend: the host venv dashboard unit"
above. The container is now `--profile legacy-esphome` (rollback only); the host
`dsc-esphome-dashboard` unit is the default. Remove the container service once
every kit is baked/deployed on the unit and SD `firmware/v4` shipping is sorted.
