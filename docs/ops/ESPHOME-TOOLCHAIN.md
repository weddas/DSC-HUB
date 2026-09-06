# ESPHome toolchain (v8, ESPHome-only)

DSC-HUB builds every device from `firmware/v4/`. There is no Home Assistant in
the build or update path: the running per-device ESPHome version comes from the
native API, "latest" comes from PyPI, and updates are `pip`/`esphome` in a Pi
venv.

## Pieces

| Piece | Where |
|---|---|
| Version pin | `esphome: min_version: "2026.6.5"` in `dsc-hub-v4_0.yaml`, `dsc-control-common.yaml`, `dsc-pot-common.yaml`, `dsc-sonoff-common.yaml`. Builds on older ESPHome fail fast. |
| Toolchain venv | `/opt/dsc-esphome-venv` — provisioned by `dsc-esphome-venv-setup.service` (→ `services/dsc-hub/pi/dsc-esphome-venv-setup.sh`), floored to `2026.6.5`. Separate from the brain venv. Updated from the container via `dsc-esphome-update.path` → `pi/dsc-esphome-host.sh`. |
| Dashboard | `dsc-esphome-dashboard.service` runs `esphome dashboard` on `0.0.0.0:6052`. Reachable at `http://dsc-brain.local:6052` (hostname `dsc-brain` + avahi). |
| Job runner | `brain/dsc_brain/esphome_jobs.py` — `build_backend()` picks: local `<esphome_bin> compile|run` (`cwd=firmware/v4`, `PLATFORMIO_CORE_DIR`), or the dashboard WebSocket. Serialised, one at a time. Probe seats map to `dsc-potN.yaml`. |
| Status / update API | `GET /settings/esphome/toolchain`, `POST /settings/esphome/toolchain/update`, `POST /settings/esphome/toolchain/rollback`, `GET|POST /settings/esphome/rollout?mode=all|canary|rest` (`brain/dsc_brain/esphome_toolchain.py`). |
| Settings UI | Settings → Device → **ESPHome** card: installed / latest / pinned-min, build backend + disk free, **Update ESPHome**, **Roll back**, secrets / helper / disk chips, per-seat drift, **Open ESPHome Dashboard**, canary → release-the-rest rollout. |

Settings keys (`brain/dsc_brain/settings.py`): `esphome_bin`, `esphome_project_dir`,
`esphome_dashboard_url` (browser link), `esphome_dashboard_api` (brain→dashboard),
`esphome_fleet_ota_prompt`, `last_built_esphome`, `esphome_rollout_canary`,
`esphome_compose_file` + `esphome_compose_update_cmd` (legacy container self-update,
`{file}` placeholder — removed with that backend).

## Update ESPHome to latest

1. Settings → Device → ESPHome. The card shows **installed** vs **latest** (PyPI,
   only when Ethernet is up) vs the **pinned min**.
2. **Update ESPHome →** the mechanism follows `build_backend()` (table below):
   host helper on the shipping kit, `pip` on a bare-venv brain, compose bump on
   the legacy container. Refused if a compile/OTA job is queued/running, if
   offline, if the target is below the pinned `min_version`, or under 1.5 GiB free.
   **Roll back to X** appears once a change is on record.
3. When the venv version moves, the card offers **Canary <probe> first** or
   **Reflash whole fleet**; after the canary rejoins, **Release the rest (hub last)**.
   Nothing flashes until you confirm (`esphome_fleet_ota_prompt`).

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

## Build backend — how the brain reaches ESPHome

`services/dsc-hub/docker-compose.yml` runs the brain in `dsc-hub-brain`
(`python:3.12-slim`): no `esphome` binary, no `firmware/v4`, no Docker socket, no
systemd. So on the shipping kit the brain **never shells `esphome`** — it drives the
host **ESPHome dashboard** (`dsc-esphome-dashboard.service`, venv at
`/opt/dsc-esphome-venv`, port 6052) over HTTP/WebSocket for compile + OTA, and
hands **toolchain updates** to a host helper through files in the ops dir the
container already bind-mounts.

`esphome_toolchain.build_backend()` picks automatically:

| Result | When | compile / OTA | Update ESPHome |
|---|---|---|---|
| `venv` | `esphome_bin` resolves to a real file / PATH entry (host or bare-venv brain) | `subprocess` in `firmware/v4`, streamed, real exit code | `pip install -U esphome` in that venv, restart the dashboard unit |
| `venv-host` | no local CLI; `GET {esphome_dashboard_api}/version` answers **and** `<ops>/esphome-host/capabilities.json` exists (written by `pi/dsc-esphome-host.sh`) — **the shipping topology** | dashboard WebSocket `/compile` or `/upload`: `{"type":"spawn","configuration":<yaml>}`, stream `{"event":"line"}`, finish on `{"event":"exit","code":N}` | write `<ops>/esphome-host/request.json`; `dsc-esphome-update.path` fires `dsc-esphome-update.service` → `dsc-esphome-host.sh update` (disk guard, `pip install esphome==<target>` as `dsc`, `systemctl restart dsc-esphome-dashboard`, `result.json`); the brain tails `progress.log` into the job row |
| `dashboard` | a dashboard answers but no helper file: the legacy `dsc-hub-esphome` container (`dashboard_legacy: true`), or a host unit deployed before the helper | same WebSocket path | legacy: compose image-tag bump + redeploy (or the exact steps when no `docker`); host-without-helper: refused with `sudo systemctl enable --now dsc-esphome-update.path` |
| `none` | nothing reachable | job fails clean; `pi/flash-fleet-remote.sh` is the manual path | refused |

### Host helper protocol (`<ops>/esphome-host/`, default `/var/lib/dsc-hub/ops/esphome-host/`)

| File | Direction | Content |
|---|---|---|
| `capabilities.json` | host → brain | `{"helper":true,"esphome_version","project_dir","secrets_present","disk_free_bytes","min_free_bytes","written_at"}` — written by `dsc-esphome-venv-setup.sh`, by the dashboard wrapper on every start, and after every update |
| `request.json` | brain → host | `{"job_id","action":"update" or "rollback","target":"x.y.z"}` (atomic rename) |
| `progress.log` | host → brain | streamed pip output |
| `result.json` | host → brain | `{"job_id","ok","from","to","exit_code","message","log_tail"}`; the brain deletes it after consuming |

Status fields the Settings card reads: `build_backend`, `dashboard_legacy`,
`host_helper`, `secrets_present`, `disk_free_gb` / `disk_free_ok` (update refused
under 1.5 GiB), `rollback_target`, `canary`.

Settings keys: `esphome_dashboard_api` (brain→dashboard; empty = the
`DSC_ESPHOME_DASHBOARD_API` env compose sets = `http://host.docker.internal:6052`,
the host unit over the bridge with a `host-gateway` extra_host) is separate from
`esphome_dashboard_url` (the browser link, default `http://dsc-brain.local:6052`).
`_dash_get()` still falls back to the legacy container name during a cutover.
`DSC_ESPHOME_HOST_DIR` overrides the handshake dir on the brain side;
`DSC_ESPHOME_OPS_DIR` / `DSC_ESPHOME_PROJECT_DIR` in `/etc/dsc-hub/esphome.env` on
the host side.

### Roll back

`POST /settings/esphome/toolchain/rollback` (Settings → **Roll back to X**) reinstalls
the version the last successful change came from (`from_version` of the newest
`done` row in `esphome_toolchain_jobs`), same guard rails, downgrade allowed. Never
offered below the pinned `min_version`.

### Fleet rollout — canary first

After a toolchain change the card offers **Canary <probe> first** (default `pot2`,
else the first in-service probe) and **Reflash whole fleet**. `POST
/settings/esphome/rollout?mode=canary` flashes only the canary; the card then shows
its job state and, once the probe reports the new ESPHome version, **Release the
rest (N, hub last)** → `?mode=rest`. `last_built_esphome` is only stamped when the
rest (or the whole fleet) is queued, so the prompt persists through the canary
phase. The canary record is discarded if the toolchain moves again.

### Secrets on kits

The bake owns the keys: `image/bake-on-linux.sh` requires (or generates)
`firmware/v4/secrets.yaml` on the bake host, `bake-firmware.sh` compiles the kit
`.bin` files from it, and the same file ships in the image at
`/opt/dsc-hub/firmware/v4/secrets.yaml` (`0600 dsc:dsc`, never git). One bake =
one kit = one key set, so later on-Pi OTA builds agree with the baked binaries.
The card shows **No firmware secrets** when the helper reports it missing.

### Units on the Pi

| Unit | Role |
|---|---|
| `dsc-esphome-venv-setup.service` | one-shot: create `/opt/dsc-esphome-venv`, install `esphome==<pin>`, publish capabilities |
| `dsc-esphome-dashboard.service` | `esphome dashboard <firmware/v4>` on `0.0.0.0:6052` via `pi/dsc-esphome-dashboard-run.sh` (refreshes capabilities on every start) |
| `dsc-esphome-update.path` + `.service` | watch `request.json` → `pi/dsc-esphome-host.sh update` |

All three are installed/enabled by `pi/deploy-brain-remote.sh` (remote layout,
`/opt/dsc-hub-repo/firmware/v4`), `image/bake-on-linux.sh` + `install-from-payload.sh`,
`image/bake-sd-image.sh` and `image/stage-dsc/01-dsc-hub.sh` (SD layout,
`/opt/dsc-hub/firmware/v4`). The `esphome` compose service is behind
`profiles: ["legacy-esphome"]` (rollback only) and is removed once the Pi gate
passes on both layouts (decided 2026-09-06).

### Manual fallbacks (no Docker)

`pi/flash-fleet-remote.sh [pass] [seats…]` — host venv, hosts from the brain
inventory, default order `pot2 pot1 heater heatmat humidifier dehumidifier control hub`
(canary first, hub last). `flash-hub-fallback-remote.sh`,
`flash-sonoff-fallback-remote.sh`, `flash-sonoff-lan-remote.sh` use the same venv.

### Validated

* 2026-09-06 against the live Pi dashboard (pre-helper): `GET :6052/version`,
  `/devices` (47 configs), `esphome config dsc-hub.yaml` valid on 2026.8.x, a
  `2099.1.0` pin correctly rejected, `/compile` and `/upload` confirmed as WebSocket
  endpoints. The live `/upload` OTA had not yet been fired at a device.
* 2026-09-06 dev box: `esphome config` sweep over every `firmware/v4` entry point
  on ESPHome 2026.8.0 with the 8.0.0.0 project version — see `CHANGELOG.md`.
* **Pi gate (both layouts) still pending** — see `docs/FOLLOWUPS.md` for the gate
  write-up once it runs.
