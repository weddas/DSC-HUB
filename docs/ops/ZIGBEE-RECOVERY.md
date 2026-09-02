# Zigbee2MQTT radio recovery (SkyConnect / TS0201)

**Brain:** `http://192.168.86.48:8787` · Settings → Zigbee  
**No factory reset** without explicit operator approval.

## Symptoms

- Settings shows **RADIO DOWN** / `bridge_state: offline`
- z2m container crash-loop: `HOST_FATAL_ERROR` in logs
- `bridge/devices` empty; permit join has no effect

## Pi checks

```bash
# One z2m container, one data volume
docker ps -a --filter name=z2m
ls -la /var/lib/dsc-hub/z2m/

# USB stick
ls -l /dev/ttyACM0
dmesg | tail -30 | grep -i tty
```

## Adapter firmware

Repo default: `adapter: ember` in `services/dsc-hub/zigbee2mqtt/configuration.yaml` (z2m 2.x).

**Policy B (DSC default):** deploy ember first. If logs still show `HOST_FATAL_ERROR`, probe the stick with `universal-silabs-flasher --device <by-id> probe`.

Live 2026-08-29 finding: SkyConnect was running **OpenThread SPINEL** (`SL-OPENTHREAD/2.7.2`), not Zigbee NCP — ember cannot start. Flash Zigbee NCP:

```bash
# z2m stopped; host path (Pi .env already uses by-id → ttyUSB0)
DEV=/dev/serial/by-id/usb-Nabu_Casa_SkyConnect_v1.0_*
universal-silabs-flasher --device "$DEV" probe
universal-silabs-flasher --device "$DEV" flash --firmware skyconnect_zigbee_ncp_7.5.1.0.gbl
# firmware from https://github.com/NabuCasa/silabs-firmware-builder/releases (Zigbee NCP, not OpenThread RCP)
```

After flash: timeout-start z2m; expect `EZSP started`, revision `7.5.1`, MQTT `bridge/state` online, `/health` `radio_up=true`. Prefer keeping pairing DB when already Zigbee; Thread→Zigbee forms a new network.

1. Sync repo config to `/var/lib/dsc-hub/z2m/configuration.yaml` on Pi (or edit in place).
2. Confirm `adapter: ember` and `port: /dev/ttyACM0` (or compose `ZIGBEE_DEVICE` by-id).
3. Soft-restart z2m only (`docker kill` + `docker start` if compose restart hangs SSH).
4. Drivers: Linux CDC-ACM — `ls -l /dev/ttyACM0` and `dmesg | grep -i tty` after USB plug.

**Do not** wipe `database.db` or coordinator unless operator approves — that unpairs all devices.

## Pair TS0201 temp/humidity

Built-in z2m converters handle Tuya `TS0201` (`0x0402` + `0x0405`). No DSC-HUB device library required.

1. Confirm **RADIO UP** (+ **JOIN OPEN**) in Settings → Device Kit → Zigbee.
2. **Permit join (~4 min / 254s)** — brain API `POST /settings/zigbee/permit-join` with `{"enabled":true,"duration_s":254}`. Pi keep-open waiters may refresh this automatically.
3. Put sensor in pairing mode (hold reset ~5s until LED blinks). If it was on the pre-flash network, **factory-reset** it first.
4. Verify MQTT: `mosquitto_sub -h 127.0.0.1 -t 'zigbee2mqtt/+' -v`
   - Expect `temperature` and `humidity` on device topic; Settings should show an **Unbound** row within a few seconds (page polls while JOIN OPEN).
5. Assign **Role** (e.g. `canopy_4x8` / `canopy_2x4`) and Zone → **Save roles**. Unbound sensors must not fill canopy. Auto-integrate scripts on Pi may bind the first end device as `canopy_4x8`.

**After Thread→Zigbee flash:** the coordinator formed a **new** network (live channel often **11**). Previously paired end devices will not rejoin — factory-reset them, then pair again while JOIN OPEN.

## Pi maintenance

**Do not** `docker kill` / `docker restart` z2m (or brain) without a host `timeout` — bare kill has hung the Docker daemon and taken down SSH/8787 on this Pi.

**Also:** even `timeout N docker kill -s KILL` **and** `timeout N docker restart` have hung this Pi
(2026-08-30 ~17:13 kill; ~18:32 brain `docker restart` for JOIN OPEN honesty hotpatch). Prefer:

1. `docker cp` SPA/static only when possible (no process restart),
2. After a **fresh power-cycle** (Docker healthy, `/health` already answering): timed `docker stop` + `docker start`,
3. Operator **power-cycle** if Docker is already wedged — do not keep issuing stop/restart/kill.

Safe pattern when a restart is unavoidable **and** `/health` is already up:

```bash
echo Digital | sudo -S timeout 15 docker stop dsc-hub-brain
echo Digital | sudo -S timeout 30 docker start dsc-hub-brain
# If ping/SSH die: power-cycle the Pi — do not keep issuing docker commands.
```

Legacy (still timeout-wrapped; last resort before power-cycle):

```bash
echo Digital | sudo -S timeout 8 docker kill -s KILL dsc-hub-z2m || true
echo Digital | sudo -S timeout 15 docker start dsc-hub-z2m
```

Prefer editing `/var/lib/dsc-hub/z2m/configuration.yaml` in place; if the file is **0 bytes**, restore from `configuration_backup_v*.yaml` before any restart.

Kill stale log-follow if present:

```bash
pgrep -af 'esphome run dsc-hub.yaml' && sudo kill <pid>
```

## Wet / Dry vs Problem (Climate honesty)

Kit leak/liquid sensors often publish wet as MQTT `occupancy` (liquid present) — **not** PIR motion. Climate chips:

| Chip | Source | Rule |
|------|--------|------|
| Wet / Dry | Raw MQTT / by_role reading | Presentation only |
| Problem / Clear | `fleet.system.zigbee_policy_state[ieee].problem` | Only after `evaluate_device_policies` for a bound recipe (`floor_flood_alert` banner-only; `tank_full_appliance` may OOS) |

Pass 5 seeds `zigbee_device_policies` on binding reapply / cache apply (`load_zigbee_policies`) and mirrors on `save_zigbee_policies` so SPA can resolve `recipe_id` without waiting for MQTT — it still must **not** invent Problem from wet. After brain restart, `policy_state` is empty until the next evaluate; GATE prove re-seeds dry MQTT. Pytest: `test_zigbee_reapply_seeds_device_policies_for_spa_recipe`.

Roles: `leak_floor_room` / `leak_floor_4x8` / `leak_floor_2x4` (2×4 parked without HW). Walk: [`../qa/LIVE-UX-PASS5-WALK-2026-09.md`](../qa/LIVE-UX-PASS5-WALK-2026-09.md) · program SoT: [`../brain/LIVE-UX-HONESTY.md`](../brain/LIVE-UX-HONESTY.md) · hotpatch habit: [`PI-HOTPATCH.md`](PI-HOTPATCH.md).

## Deploy after code changes

From studio LAN (mapped `Y:` drive):

```powershell
powershell -ExecutionPolicy Bypass -File "Y:\Digital Stealth Care\Projects\DSC-HUB\services\dsc-hub\pi\studio-deploy.ps1"
```
