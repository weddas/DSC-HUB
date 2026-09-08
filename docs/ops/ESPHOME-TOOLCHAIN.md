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
| Build service (`:6052`) | `dsc-esphome-dashboard.service` → `pi/dsc-esphome-dashboard-run.sh`: prefers `/opt/dsc-esphome-venv/bin/esphome-device-builder`, else falls back to `esphome dashboard`. Reachable at `http://dsc-brain.local:6052`. |
| Job runner | `brain/dsc_brain/esphome_jobs.py` — serialised, one at a time. Local CLI: `compile` / `run --no-logs`. Build service: **`/compile` then `/upload`** for OTA (not `/run`, not upload-only); WS uses `ping_interval=None` so quiet C++ compiles do not drop. `SEAT_YAML` maps seats → yaml (`potN` → `dsc-potN.yaml`, dehumidifier → `dsc-de-humidifier.yaml`); `queue_job` refuses when the project dir is visible and the file is missing. |
| Status / update API | `GET /settings/esphome/toolchain`, `POST /settings/esphome/toolchain/update`, `POST /settings/esphome/toolchain/rollback`, `GET|POST /settings/esphome/rollout?mode=all|canary|rest` (`brain/dsc_brain/esphome_toolchain.py`). |
| Settings UI | Settings › **Devices** › **Firmware** (`#/settings/devices#firmware`): installed / latest_supported / pinned-min, build backend + disk free, **Update ESPHome**, **Roll back**, secrets / helper / disk / held-back chips, per-seat drift, **Open ESPHome Dashboard**, canary → release-the-rest rollout. |

Settings keys (`brain/dsc_brain/settings.py`): `esphome_bin`, `esphome_project_dir`,
`esphome_dashboard_url` (browser link), `esphome_dashboard_api` (brain→dashboard),
`esphome_fleet_ota_prompt`, `last_built_esphome`, `esphome_rollout_canary`,
`esphome_compose_file` + `esphome_compose_update_cmd` (legacy container self-update,
`{file}` placeholder — removed with that backend).

## Update ESPHome to latest

1. Settings › **Devices** › **Firmware**. The card shows **installed** vs
   **latest_supported** (newest PyPI release below the dashboard ceiling; only
   when Ethernet/DNS work) vs the **pinned min**. PyPI's absolute newest may be
   higher and shown as *Newer ESPHome held back*.
2. **Update ESPHome →** the mechanism follows `build_backend()` (table below):
   host helper on the shipping kit, `pip` on a bare-venv brain, compose bump on
   the legacy container. Refused if a compile/OTA job is queued/running, if
   offline, if the target is below the pinned `min_version`, at/past the
   2026.8 dashboard boundary (unless `device_builder: true`), or under 1.5 GiB free.
   **Roll back to X** appears once a change is on record (see Roll back).
3. When the venv version moves, the card offers **Canary <probe> first** or
   **Reflash whole fleet**; after the canary rejoins, **Release the rest (hub last)**.
   Nothing flashes until you confirm (`esphome_fleet_ota_prompt`).

## Bump the pinned `min_version`

Do this deliberately, not on every ESPHome release:

1. Update the venv (`Update ESPHome`, or `sudo -u dsc /opt/dsc-esphome-venv/bin/pip install -U esphome`).
2. `cd firmware/v4 && /opt/dsc-esphome-venv/bin/esphome config …` → exit 0 for
   hub / control / a pot / a sonoff **and** a real
   `esphome compile` per family **plus** at least one SoftAP kit stub
   (`dsc-hub-kit.yaml`). Live gate lesson: `config` misses lambda C++
   (panel `lv_color_eq` / LVGL 9; hub `StringRef` / `.str()` on ESPHome 2026.x;
   kit SoftAP `ScanResultsLock` / `get_ssid().str()` on 2026.6.5).
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
host **build service** on `:6052` (`dsc-esphome-dashboard.service` →
device-builder or legacy dashboard, venv at `/opt/dsc-esphome-venv`) over
HTTP/WebSocket for compile + OTA, and hands **toolchain updates** to a host
helper through files in the ops dir the container already bind-mounts.

`esphome_toolchain.build_backend()` picks automatically:

| Result | When | compile / OTA | Update ESPHome |
|---|---|---|---|
| `venv` | `esphome_bin` resolves to a real file / PATH entry (host or bare-venv brain) | `subprocess` in `firmware/v4` (`compile` / `run --no-logs`), streamed, real exit code | `pip install -U esphome` in that venv, restart the dashboard unit |
| `venv-host` | no local CLI; `<ops>/esphome-host/capabilities.json` exists **and** the answering dash is not the legacy container — **the shipping topology**. Dashboard may be **down** (`dashboard_up: false`); update/rollback still work | dashboard WebSocket: compile = `/compile`; OTA = `/compile` → `/upload` (`{"type":"spawn","configuration":<yaml>}`, stream `{"event":"line"}`, finish on `{"event":"exit","code":N}`) | write `<ops>/esphome-host/request.json`; `dsc-esphome-update.path` fires `dsc-esphome-update.service` → `dsc-esphome-host.sh update` (disk guard, `pip install esphome==<target>` as `dsc`, `systemctl restart dsc-esphome-dashboard`, `result.json`); the brain tails `progress.log` into the job row |
| `dashboard` | a dashboard answers but no helper file: the legacy `dsc-hub-esphome` container (`dashboard_legacy: true`), or a host unit deployed before the helper | same WebSocket path | legacy: compose image-tag bump + redeploy (or the exact steps when no `docker`); host-without-helper: refused with `sudo systemctl enable --now dsc-esphome-update.path` |
| `none` | nothing reachable | job fails clean; `pi/flash-fleet-remote.sh` is the manual path | refused |

### Job runner pitfalls (live gate)

```mermaid
flowchart LR
  q[queue_job] --> yaml{yaml exists?}
  yaml -->|no + tree visible| refuse[ValueError at button]
  yaml -->|yes / tree hidden| worker[serial worker]
  worker --> backend{backend}
  backend -->|venv| cli["esphome compile / run --no-logs"]
  backend -->|venv-host / dashboard| steps["/compile then /upload"]
  steps -.->|never| run["/run tails device logs forever"]
  steps -.->|never alone| upOnly["/upload alone needs an existing binary"]
```

- **OTA path:** `_run_job_via_dashboard` always compiles first, then uploads. `/upload`
  alone fails `FileNotFoundError` on a seat never built on this Pi. `/run` attaches
  to the device log and never exits — the job stays `running` until the deadline
  and blocks the serial queue (dehumidifier, 2026-09-07).
- **Seat yaml map:** `SEAT_YAML` — probes stay `dsc-potN.yaml` (not `DSC-ProbeN.yaml`);
  dehumidifier is `dsc-de-humidifier.yaml`. Exact duplicate seat+action while
  queued/running is refused; other seats may queue behind a running job (fleet
  rollout).
- **Reaper:** `start_esphome_worker` → `_reap_stale_running` fails any row still
  `running` from a previous brain process so queue / rollout / toolchain-update
  guards are not stuck after a restart/redeploy mid-flash.
- **Deploy idle restart:** `pi/deploy-brain-remote.sh` skips
  `systemctl restart dsc-esphome-dashboard` when `pgrep -f 'esphome (run|compile|upload)'`
  matches — restarting mid-job made queued OTAs fail *Connection refused*.

### Host helper protocol (`<ops>/esphome-host/`, default `/var/lib/dsc-hub/ops/esphome-host/`)

| File | Direction | Content |
|---|---|---|
| `capabilities.json` | host → brain | `{"helper":true,"esphome_version","project_dir","secrets_present","disk_free_bytes","min_free_bytes","written_at",…}` — written by `dsc-esphome-venv-setup.sh`, by the dashboard wrapper on every start, and after every update. Optional `device_builder: true` unlocks Update past `DASHBOARD_REMOVED_FROM` (host helper does **not** emit this yet; venv-setup still only installs `esphome==pin`). |
| `request.json` | brain → host | `{"job_id","action":"update" or "rollback","target":"x.y.z"}` (atomic rename) |
| `progress.log` | host → brain | streamed pip output |
| `result.json` | host → brain | `{"job_id","ok","from","to","exit_code","message","log_tail"}`; the brain deletes it after consuming |

Helper hardening (from the live gate): the request is renamed to `.request.done` as
the first step (a leftover `request.json` makes the `.path` unit re-fire the oneshot
in a loop); pip's log tail is decoded with `errors=replace` (progress bars are not
UTF-8); the EXIT trap writes a failure `result.json` if the script dies before its
own; the helper dir is `dsc:dsc 0775` so the dashboard wrapper (runs as `dsc`) can
refresh capabilities; and pip is refused up front when `pypi.org` does not resolve
on the **host** — the Pi's `dhcpcd` wrote an empty `/etc/resolv.conf` while Docker
containers resolved through their own pinned servers.

**Host DNS (v2):** `static domain_name_servers` alone was **not** enough — dhcpcd
still emptied `resolv.conf` on the next renewal (mid fleet-reflash: hub/probe builds
failed resolving github.com). `pi/bring-up-eth0.sh` now adds `nohook resolv.conf` to
`dhcpcd.conf` and installs a static `/etc/resolv.conf` (site `192.168.86.1` +
`8.8.8.8` / `1.1.1.1`, matching Docker's pin). Site-specific first nameserver is a
known residual for other networks (FOLLOWUPS P2).

Status fields the Settings card reads: `build_backend`, `dashboard_legacy`,
`dashboard_up`, `host_helper`, `secrets_present`, `disk_free_gb` / `disk_free_ok` (update
refused under 1.5 GiB), `latest` / `latest_supported` / `latest_blocked_reason`,
`dashboard_removed_from`, `device_builder`, `rollback_target`, `canary`.

Settings keys: `esphome_dashboard_api` (brain→dashboard; empty = the
`DSC_ESPHOME_DASHBOARD_API` env compose sets = `http://host.docker.internal:6052`,
the host unit over the bridge with a `host-gateway` extra_host) is separate from
`esphome_dashboard_url` (the browser link, default `http://dsc-brain.local:6052`).
`_dash_get()` still falls back to the legacy container name during a cutover.
`DSC_ESPHOME_HOST_DIR` overrides the handshake dir on the brain side;
`DSC_ESPHOME_OPS_DIR` / `DSC_ESPHOME_PROJECT_DIR` in `/etc/dsc-hub/esphome.env` on
the host side.

### Build service: `esphome-device-builder` vs built-in dashboard

ESPHome removed the built-in `esphome dashboard` during **2026.7** (observed at
**2026.7.4** — unit exits 1 with *"The built-in dashboard has been removed from
ESPHome"* and systemd crash-loops). Tip `6f1b1fa` / `04a21db` cuts the shipping
path over to **`esphome-device-builder`** as a **binary swap**, not a brain rewrite:

```mermaid
flowchart LR
  Brain[dsc-hub-brain] -->|HTTP /version /devices| Svc[:6052 build service]
  Brain -->|WS /compile /upload ping_interval=None| Svc
  Svc -->|prefer| EDB[esphome-device-builder]
  Svc -->|fallback| Dash[esphome dashboard]
  Host[dsc-esphome-host.sh] -->|capabilities.json| Brain
  Brain -->|request.json| Host
```

`device-builder` ships `api/legacy.py` with the **same** `GET /version`,
`GET /devices`, `GET /ping` and `/compile` + `/upload` WebSocket spawn protocol
(`{event:line}` / `{event:exit}`) that `esphome_jobs` already speaks. Verified
2026-09-08 against device-builder **1.14.4** + ESPHome **2026.8.2** (compile
streamed ~320 line frames, exit 0). Upstream marks that legacy layer
**DEPRECATED** — a native multiplexed `/ws` client
(`config/version`, `devices/list`, `firmware/compile`, …) is still owed.

**Ceiling / Update gate**

- Bound: `esphome_toolchain.DASHBOARD_REMOVED_FROM = "2026.7.0"` (start of the
  removal train; exact intra-2026.7 cut is not pinned further).
- `device_builder_supported()` is true only when `capabilities.json` has
  `device_builder: true`. **Repo honesty:** `dsc-esphome-venv-setup.sh` still
  only `pip install esphome==<pin>`; `dsc-esphome-host.sh` does not yet emit
  `device_builder`. Binary present on disk ≠ Settings **Update ESPHome** unlocked
  past the bound.
- `latest()` reports PyPI newest (`latest`) and newest non-yanked release below
  the bound (`latest_supported`); Update targets the latter and refuses targets
  at/past the bound unless `device_builder` is reported.
- When the build service is down but the helper is present, backend stays
  `venv-host` (`dashboard_up: false`) so **Roll back** still works.

**Ownership traps (live cutover + bake):** run the build-service unit as `dsc`, not
root. Root-owned `.esphome` / `.device-builder*` / PlatformIO cache under the
project tree breaks the service even when the binary is correct
(`PermissionError` on `.device-builder.lock`; compiles die in ~4 s on a valid
config). Tip `502bbcb` / `521e416` fixed the bake side: `bake-on-linux.sh` **must**
run as root (docker; `dsc` is not in the docker group), so it installs an **EXIT
trap** that `chown`s shared trees back to `${DSC_SERVICE_USER:-dsc}`:

```mermaid
flowchart TD
  bake["bake-on-linux.sh as root"] --> compile["compile kit bins + docker build"]
  compile --> exitTrap["EXIT trap _restore_ownership"]
  exitTrap --> pio["PlatformIO cache"]
  exitTrap --> esphome["firmware/v4/.esphome"]
  exitTrap --> db[".device-builder* beside project"]
  exitTrap --> dockerHome["/home/dsc/.docker buildx locks"]
  exitTrap --> svc["dsc-esphome-dashboard as dsc starts clean"]
```

Covered paths: `${PLATFORMIO_CORE_DIR:-/var/lib/dsc-hub/platformio}`, bake-tree and
`/opt/dsc-hub-repo` `.esphome`, `/opt/dsc-hub-repo/firmware/v4/.device-builder*`,
and `/home/dsc/.docker` (`sudo docker` inherits `HOME=/home/dsc` — without the
trap the **next** non-root bake dies late on `buildx/.lock` after compiling all
eight binaries). Manual cleanup once cost 10 995 + 5 422 files on 2026-09-08.

### Roll back

`POST /settings/esphome/toolchain/rollback` (Settings → **Roll back to X**) reinstalls
the prior version from `esphome_toolchain_jobs`: newest row that is either
`status=done`, **or** any job whose `to_version` matches what is currently
installed (a failed update that still moved the venv — live 2026-09-06 dashboard
restart failure). Same guard rails; downgrade allowed. Never offered below the
pinned `min_version`, and never onto a release at/past `DASHBOARD_REMOVED_FROM`
unless the helper reports `device_builder: true`.

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

**Trap — fresh secrets on rebake:** `secrets.yaml` is gitignored. A naive
`bake-on-linux.sh` *generates* a new key set when the file is absent, so the
baked `.bin` files stop matching the live fleet’s OTA/API keys. Before baking
8.1.0 (or any rebake against a live grow), copy the live set
(`/opt/dsc-hub-repo/firmware/v4/secrets.yaml` or the kit image’s
`/opt/dsc-hub/firmware/v4/secrets.yaml`) into the bake tree and confirm md5s
match. Full bake runbook: [`services/dsc-hub/image/README.md`](../../services/dsc-hub/image/README.md).

### Kit SoftAP firmware bake (`dsc_fleet_setup`)

Factory USB flash uses **prebuilt** kit binaries under
`services/dsc-hub/firmware/kit/*.bin`, compiled by `image/bake-firmware.sh`
from the `*-kit.yaml` stubs — **not** the live lab YAMLs.

| Path | Uses `dsc_fleet_setup`? | Role |
|---|---|---|
| `dsc-hub-v4_0.yaml` (live hub) | **No** | Lab / in-grow OTA — SoftAP portal not compiled here |
| `dsc-hub-kit.yaml` → `dsc-fleet-setup-hub.yaml` | **Yes** | Factory SoftAP (`DSC-Setup-*`) |
| `dsc-control-kit.yaml` → `dsc-fleet-setup-satellite.yaml` | **Yes** | Satellite joins hub setup AP |
| `dsc-pot{N}-kit.yaml` → `dsc-fleet-setup-pot-kit.yaml` | **Yes** | Probe SoftAP join |
| Sonoff kit YAMLs (`dsc-heater.yaml` …) | No SoftAP component | Plain compile into `kit/*.bin` |

```mermaid
flowchart TD
  bake["bake-on-linux.sh"] --> secrets{"secrets.yaml?"}
  secrets -->|missing| gen["generate-secrets.sh"]
  secrets -->|present| fw["bake-firmware.sh"]
  gen --> fw
  fw --> compile["esphome compile *-kit.yaml"]
  compile -->|ok| pick["copy from .esphome/build/DEVDIR[role]"]
  pick --> bins["firmware.factory.bin / firmware.bin → kit/*.bin"]
  compile -->|fail / no CLI| ph["empty placeholder .bin"]
  bins --> guard{"DSC_RELEASE=1?"}
  ph --> guard
  guard -->|yes + any 0-byte| abort["bake aborts"]
  guard -->|no| stage["stage /opt/dsc-hub — hollow card possible"]
```

**Image pick (tip `d25db41`):** `bake-firmware.sh` uses a declared `DEVDIR` map
(`hub` → `dsc-hub`, `pot1` → `dsc_probe1`, …) under
`firmware/v4/.esphome/build/<name>`. Do not scrape `"Build path:"` — ESPHome
2026.8 stopped printing it, and a fully cached SUCCESS can rewrite nothing.

**Why the live fleet can look fine while the card cannot flash a kit:** OTA /
Settings › Devices › Firmware only builds the **lab** stubs. The SoftAP
component bit-rots against ESPHome Wi-Fi API moves without anyone noticing
until the next SD bake. Tip `0b06f58` / merge `4d73cfc` restored compile on
pinned **2026.6.5**:

1. Declare `hub_mac_str()` / `panel_mac_str()` in `dsc_fleet_setup.h` (defs were
   orphaned — only `bridge_mac_str()` was declared).
2. ESPHome 2026.x removed `wifi::ScanResultsLock`. Call
   `set_keep_scan_results(true)` in `setup()` so hub portal AP lists and
   satellite `DSC-Setup-*` scans still see `get_scan_result()` outside an
   active scan.
3. `WiFiScanResult::get_ssid()` returns `StringRef` — take `.str()` (length-
   honouring; not guaranteed NUL-terminated).
4. ArduinoJson: assign MAC / SSID as `std::string` so the library **copies** —
   a `char[18]` local stored by pointer dies before `serialize()`.
5. Tip `3676b87`: `dsc_fleet_setup/__init__.py` calls
   `esp32.include_builtin_idf_component("esp_http_client")` so pure **esp-idf**
   targets (panel / probes) compile — Arduino hub targets happened to pull the
   header via the Arduino library set; ESPHome 2026 excludes it by default.
6. Tip `03743b8`: pick the image from ESPHome's reported **Build path** (ANSI-
   stripped), not “newer than marker”. Cached SUCCESS rewrites nothing; the old
   freshness hunt aborted a good binary and was unscoped across roles.

**Release guard:** `bake-firmware.sh` refuses placeholders when
`DSC_RELEASE=1`. Tip `0b06f58` also makes `bake-on-linux.sh` abort under
`DSC_RELEASE=1` if any staged `firmware/kit/*.bin` is zero bytes (the hollow
8.0.0 card shipped because the bake never set the flag and compile failure
fell through to placeholders). Tip `cce5c74` commits bake/SD provenance
manifests proving 8.1.0 payload ≈4.8 MB vs 8.0.0 ≈38 KB.

**Operator pitfalls**

- `.audit/kit-linux-bake.ps1` currently exports `DSC_VERSION` only — **not**
  `DSC_RELEASE=1`. For a shippable card, set `DSC_RELEASE=1` on the bake host
  (or verify `find …/firmware/kit -name '*.bin' ! -size 0` / manifest
  `payload_bytes` after bake). The 8.1.0 card bake did set the flag on
  dsc-brain.
- Bump checklist must `esphome compile` at least one SoftAP stub
  (`dsc-hub-kit.yaml` **and** `dsc-control-kit.yaml` for esp-idf), not only
  `dsc-hub.yaml` / `esphome config`.
- Live fleet firmware train stays **8.0.0.0** — this SoftAP fix does **not**
  imply a grow reflash; it unblocks the **next** SD / USB-flash bake.
- **Retired `bridge` role:** `kit-manifest.json` + `usb_flash.KIT_ROLES` still
  advertise WT32-ETH01 `bridge.bin`, but `bake-firmware.sh` never compiles it
  (comment in script: retired to `firmware/_history`). USB flash of `bridge`
  fails with a missing binary after a clean bake. Eight kit roles are real:
  hub, control, pot1, pot2, heater, heatmat, humidifier, dehumidifier. See
  [`services/dsc-hub/image/README.md`](../../services/dsc-hub/image/README.md).
- **Thin-catalog CannaLib:** tip `50ee584` ships `services/cannalib` in the bake
  tar and `dsc-hub-cannalib:<version>` in the docker save. Profile stays
  opt-in (`profiles: ["thin-catalog"]`). See [`CANNALIB-API.md`](CANNALIB-API.md).

### Units on the Pi

| Unit | Role |
|---|---|
| `dsc-esphome-venv-setup.service` | one-shot: create `/opt/dsc-esphome-venv`, install `esphome==<pin>`, publish capabilities (does **not** yet install `esphome-device-builder`) |
| `dsc-esphome-dashboard.service` | Build service on `0.0.0.0:6052` via `pi/dsc-esphome-dashboard-run.sh` — `esphome-device-builder` when present, else `esphome dashboard` (refreshes capabilities on every start) |
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
  endpoints.
* 2026-09-06/07 **remote-deploy layout Pi gate — GREEN with fixes** (fleet to
  **8.0.0.0 / 2026.6.5**): canary → release-the-rest via `/compile`→`/upload`;
  dashboard ceiling + rollback; DNS v2; compile-then-upload (not `/run`); deploy
  idle-restart; LVGL 9 + hub `StringRef` compile fixes. Full write-up:
  `docs/FOLLOWUPS.md` § *ESPHome Pi gate*.
* **SD-image layout gate still pending** (same units bake path; not yet soak-proven
  on a fresh SD). Legacy compose profile `legacy-esphome` stays for rollback until
  that gate closes.
* 2026-09-07 tip `0b06f58` / `4d73cfc`: `dsc_fleet_setup` compiles again on
  ESPHome **2026.6.5**; `DSC_RELEASE=1` empty-bin guard on `bake-on-linux.sh`.
* 2026-09-08 tip `4ef6696` / `cce5c74`: esp-idf SoftAP + Build-path image pick +
  thin-catalog cannalib on card; provenance manifests prove real 8.1.0 payload
  (≈4.8 MB) vs hollow 8.0.0 (≈38 KB).
* 2026-09-08 tip `6f1b1fa`: `DASHBOARD_REMOVED_FROM = "2026.7.0"`; wrapper prefers
  `esphome-device-builder`; bake `DEVDIR` declared (no log scrape); WS
  `ping_interval=None`. Residual: venv-setup install + `capabilities.device_builder`
  + native `/ws` client.
* 2026-09-08 tip `89ddfa7` (aligned-card): rebake ships kit **8.1.0.0** on ESPHome
  **2026.8.2**; bake EXIT trap restores `dsc` ownership of PlatformIO /
  `.esphome` / `.device-builder*` / `~/.docker`. Live QA:
  `docs/qa/TEST-PASS-8.1.0-2026-09-08.md` (fleet `behind_count: 0`).