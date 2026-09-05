# DSC-HUB 8.0.0 — factory SD image

Build a Raspberry Pi OS Lite **aarch64** `.img.xz` for **Pi 4 and Pi 5** with brain, SPA, Mosquitto, Z2M, USB flash tooling, and Ethernet-first SoftAP policy baked in.

## Output

- `deploy/dsc-hub-8.0.0-arm64.img.xz` (name may vary)
- Kit firmware binaries under `/opt/dsc-hub/firmware/kit/` + `kit-manifest.json`
- Preloaded Docker images: `dsc-hub-brain:8.0.0`, `eclipse-mosquitto:2`, `koenkk/zigbee2mqtt:2`

## Build host

- Linux aarch64 with Docker (kit Pi is fine) — **no WSL/Docker on the Windows agent**
- Windows driver: `.audit/kit-linux-bake.ps1` (plink/pscp → Pi)
- **Caution:** full `docker build` + image pulls on the Pi can saturate CPU/IO and briefly drop the host off the network. Prefer off-peak; if ping dies, wait for recovery (or power-cycle) then resume — do not hammer plink.

## Commands

```bash
# On Linux builder / Pi (as root or docker-capable user):
export DSC_BAKE_OUT=/opt/dsc-hub-bake-out DSC_VERSION=8.0.0
bash services/dsc-hub/image/bake-on-linux.sh
# → deploy/dsc-hub-8.0.0-payload.tar.gz + dsc-hub-8.0.0-docker.tar.gz

# Optional SD inject (needs stock raspios lite .img + root):
sudo bash services/dsc-hub/image/bake-sd-image.sh /path/to/raspios-lite-arm64.img
# → deploy/dsc-hub-8.0.0-arm64.img.xz
```

```powershell
# From Windows (repo):
.\.audit\kit-linux-bake.ps1 -SkipSpaBuild            # payload + docker on Pi
.\.audit\kit-linux-bake.ps1 -SkipSpaBuild -MakeSdImage  # also download lite OS + inject (large)
```

## Stages (this tree)

| Path | Role |
|------|------|
| `stage-dsc/00-packages` | hostapd, dnsmasq, avahi, docker, esptool, python3-serial |
| `stage-dsc/01-dsc-hub` | copy `/opt/dsc-hub`, systemd units, net-policy |
| `stage-dsc/02-docker-preload` | `docker load` kit images |
| `bake-firmware.sh` | compile kit bins from `firmware/v4/*-kit.yaml` into `firmware/kit/` |

## First boot

1. `dsc-hub-net-policy` — SoftAP only if eth0 carrier down
2. `dsc-hub-compose` — brain `:8787`, mosquitto, z2m
3. Operator opens SPA (`dsc-brain.local:8787` or SoftAP `10.42.0.1:8787`) → `#/setup`

## Explicit non-goals on the card

- Fat CannaLib corpus (thin local / YAML only; optional `--profile thin-catalog`)
- Compile-from-source as required first flash path

## Next

Wire docker preload + packages into a fuller pi-gen later if needed. Current path: **payload/docker bake on Pi** then **bake-sd-image.sh** inject into official Lite arm64.

**2026-09-06 bake attempt:** `bake-on-linux` reached `docker build dsc-hub-brain:8.0.0` (pip install) then Pi became unreachable (100% ping loss). Resume after host recovers — artifacts not yet in `deploy/`.
