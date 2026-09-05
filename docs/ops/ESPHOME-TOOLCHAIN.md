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
| Job runner | `brain/dsc_brain/esphome_jobs.py` shells `<esphome_bin> compile|run` with `cwd=firmware/v4`, `PLATFORMIO_CORE_DIR=/var/lib/dsc-hub/platformio`. Serialised, one at a time. |
| Status / update API | `GET /settings/esphome/toolchain`, `POST /settings/esphome/toolchain/update`, `GET|POST /settings/esphome/rollout` (`brain/dsc_brain/esphome_toolchain.py`). |
| Settings UI | Settings → Device → **ESPHome** card: installed / latest / pinned-min, **Update ESPHome**, per-seat drift, **Open ESPHome Dashboard**, fleet-reflash prompt. |

Settings keys (`brain/dsc_brain/settings.py`): `esphome_bin`, `esphome_project_dir`,
`esphome_dashboard_url`, `esphome_fleet_ota_prompt`, `last_built_esphome`.

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

## Open item — containerised brain vs venv

`services/dsc-hub/docker-compose.yml` runs the brain in `dsc-hub-brain`, which
does **not** mount `firmware/v4` or the venv. Options, pick one on the Pi:

- **A.** Bind-mount `/opt/dsc-hub-repo/firmware/v4` (rw) and `/opt/dsc-esphome-venv`
  into `dsc-hub-brain`, set `DSC_ESPHOME_BIN=/opt/dsc-esphome-venv/bin/esphome`.
- **B.** Point `esphome_bin` at a wrapper that `docker exec`s the (deprecated,
  now `2026.6.5`) `dsc-hub-esphome` container.
- **C.** Run the brain on the host instead of in a container.

Until one is chosen, `queue OTA` from the SPA fails with a clear "esphome CLI not
found" and the `pi/flash-*-remote.sh` scripts remain the flash path. The
`dsc-hub-esphome` compose service is kept (image bumped to `2026.6.5`) as the
fallback and should be removed once every kit is on the systemd unit.
