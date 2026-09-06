# DSC-HUB — Upgrade (8.x, Pi-only)

**New installs:** [`INSTALL.md`](INSTALL.md). **Unboxing a kit:** [`SETUP.md`](SETUP.md).

Repo: https://github.com/weddas/DSC-HUB · branch **`master`** · releases are tagged (`v8.0.0-AlphaPi`, …).

There is no Home Assistant in the upgrade path. Everything below happens in the
Pi SPA (`http://dsc-brain.local:8787`, or `http://10.42.0.1:8787` on the kit
hotspot) or, as a fallback, over SSH on the Pi.

---

## What gets upgraded

| Layer | Where it lives | How it moves |
|---|---|---|
| DSC-Brain + SPA | `dsc-hub-brain` container (compose) | **Settings → Server → Kit update** (Ethernet-gated pull + restart), or `pi/deploy-brain-remote.sh` from a dev box |
| ESPHome build toolchain | host venv `/opt/dsc-esphome-venv` (`dsc-esphome-dashboard.service` on `:6052`) | **Settings → Device → ESPHome → Update ESPHome** (host helper runs `pip`, restarts the dashboard); **Roll back to X** if a bump misbehaves |
| Device firmware (hub, panel, probes, Sonoffs) | compiled from `firmware/v4/` on the Pi, flashed OTA | **Settings → Device → ESPHome → Canary … first → Release the rest** (or **Reflash whole fleet**), one job at a time, **hub last** |

Firmware train **8.0.0.0** pins ESPHome `min_version: "2026.6.5"`; a toolchain
below that refuses to build. Details: [`docs/ops/ESPHOME-TOOLCHAIN.md`](docs/ops/ESPHOME-TOOLCHAIN.md).

---

## Routine upgrade (brain first, then firmware)

1. **Brain / SPA.** Settings → Server → Kit update → **Check** → **Update** (needs
   the Pi on Ethernet). The brain restarts; the page reloads on the new bundle.
   The Settings → System card shows the running version.
2. **ESPHome toolchain** (only when the card says *Update available*). Settings →
   Device → ESPHome → **Update ESPHome → x.y.z**. Watch the log; the card flips to
   the new *Installed* and offers the rollout.
3. **Firmware.** Same card → **Canary Probe 2 first**. Wait for *Canary OK*
   (the probe reports the new ESPHome version), then **Release the rest (N, hub
   last)**. Each device is compiled and flashed in turn through the build worker.
   Live/Overview keep serving the last-known values while a device reboots.
4. **Verify.** Settings → Device: every row shows the expected firmware
   (`8.0.0.0`) and *online*; Overview fleet chip **ok**.

Nothing flashes without a confirm click. A failed job stops the queue at that
device — fix it (job log on the card, or **Logs ↗** into the ESPHome dashboard)
and re-queue just that seat.

---

## Bumping the pinned ESPHome (`min_version`)

Do this deliberately, not on every ESPHome release. Steps live in
[`docs/ops/ESPHOME-TOOLCHAIN.md`](docs/ops/ESPHOME-TOOLCHAIN.md#bump-the-pinned-min_version):
update the venv, `esphome config` every entry point, run `scripts/run_sim_gates`,
bump the four `esphome:` blocks + `PIN=` in `dsc-esphome-venv-setup.sh` +
`PINNED_MIN_VERSION` in `esphome_toolchain.py`, changelog line, reflash.

---

## Fallbacks (SSH on the Pi)

| Situation | Command |
|---|---|
| SPA rollout unavailable | `sudo bash /opt/dsc-hub/pi/flash-fleet-remote.sh <sudo-pass> [seats…]` — host venv, hosts from the brain inventory, canary first / hub last |
| Hub stuck on its fallback hotspot | `flash-hub-fallback-remote.sh` |
| Sonoffs on the AP island | `flash-sonoff-lan-remote.sh`; on their fallback AP: `flash-sonoff-fallback-remote.sh` |
| Toolchain by hand | `sudo -u dsc /opt/dsc-esphome-venv/bin/pip install esphome==<ver>` then `sudo systemctl restart dsc-esphome-dashboard` |
| Brain by hand | `docker compose -f /opt/dsc-hub/docker-compose.yml pull brain && … up -d brain` (prefer `docker stop -t 20` + `start` over `restart`) |

All of these need `firmware/v4/secrets.yaml` on the Pi (baked kits ship it at
`/opt/dsc-hub/firmware/v4/secrets.yaml`, `0600 dsc:dsc`).

---

## Rollback

- **Toolchain:** Settings → Device → ESPHome → **Roll back to X** (the version the
  last successful change came from), or the pip command above.
- **Firmware:** re-queue the affected seats after rolling the toolchain back; the
  YAML is the same, so a rebuild on the previous ESPHome reproduces the previous
  binary. Hub and panel must keep a matching `espnow_cmd_tag` (**54727**).
- **Brain:** `docker compose … up -d brain` on the previous image tag, or
  Settings → Backup → import the last export.

---

## From 7.x (Home Assistant lab) to 8.x

The HA lab (packages, HACS, Sync add-on, Lovelace) was retired in 2026-09 and
nothing in 8.x reads from or writes to a Home Assistant. Devices flashed from
the old HA ESPHome add-on keep working — they are just behind:

1. Bring the Pi up on 8.x ([`INSTALL.md`](INSTALL.md) / factory image).
2. Copy your `firmware/v4/secrets.yaml` to the Pi (keys are compiled in; keep the
   same set or plan to reflash everything over USB).
3. Settings → Device → ESPHome → **Reflash whole fleet** (hub last). The 8.0.0.0
   build drops every `platform: homeassistant` entity (SNTP-only clock, native-API
   plant names, ESP-NOW-only root-zone), so the fleet no longer waits on an HA
   that is not there.
4. Decommission the HA integrations at your leisure — they are not consulted.

See [`docs/FIRMWARE-HA-REMOVAL.md`](docs/FIRMWARE-HA-REMOVAL.md) and
[`docs/HA-SCAFFOLD.md`](docs/HA-SCAFFOLD.md).
