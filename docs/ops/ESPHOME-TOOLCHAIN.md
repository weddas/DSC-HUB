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
`esphome_fleet_ota_prompt`, `last_built_esphome`.

## Update ESPHome to latest

1. Settings → Device → ESPHome. The card shows **installed** vs **latest** (PyPI,
   only when Ethernet is up) vs the **pinned min**.
2. **Update ESPHome →** runs `pip install -U esphome` in the venv, then
   `systemctl restart dsc-esphome-dashboard`. Refused if a compile/OTA job is
   queued/running, if offline, or if latest is below the pinned `min_version`.
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
| `dashboard` | no local CLI, but `GET {esphome_dashboard_api}/version` answers | `POST {api}/compile` \| `/upload` with `configuration=<yaml>`, log streamed back, success inferred from output (no exit code) |
| `none` | neither | job fails clean; `pi/flash-*-remote.sh` is the manual path |

Settings keys: `esphome_dashboard_api` (brain→dashboard, default
`http://dsc-hub-esphome:6052`) is separate from `esphome_dashboard_url` (the
browser link, default `http://dsc-brain.local:6052`).

`installed()` and per-device `deployed` version come from `{api}/version` and
`{api}/devices` — no binary needed for the Settings card to be accurate.

### Validated 2026-09-06 against the live Pi dashboard

`GET http://dsc-brain.local:6052/version` → `{"version":"2025.12.4"}`;
`/devices` → 47 configs with `current_version` / `deployed_version`.
`installed()` returned `2025.12.4`, `min_version()` `2026.6.5`, `meets_min` **False**
(the running `esphome/esphome:2025.12.4` container is below the new pin — bump it,
or move to the venv unit). `build_backend()` → `dashboard`. The `POST /compile`
and `/upload` path is written to the dashboard API but has **not** been fired at a
live device yet — needs one deliberate on-device compile + OTA test.

The `dsc-hub-esphome` compose service is kept (image bumped `2025.12.4` →
`2026.6.5`) as the current build backend; the `dsc-esphome-dashboard` systemd
venv unit is the forward path for host deployments. Collapse to one once every
kit is migrated.
