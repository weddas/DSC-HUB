# DSC kit SD-card installer — design

**Date:** 2026-09-06  
**Status:** Approved  
**Release:** **8.0.0** (kit SD-card installer major)  
**Product:** Full-kit release — flash SD → Pi 4/5 boots → SPA onboarding brings up brain, USB-flashes ESP/Sonoff fleet, SoftAP/LAN join, Zigbee bind.

## Decisions (locked)

| Topic | Choice |
|-------|--------|
| Scope | Full kit installer (not brain-only) |
| ESP/Sonoff firmware | USB plug-into-Pi; SPA flash wizard (esptool + baked binaries) |
| Image fullness | Fat image — offline kit bring-up without internet |
| Updates | If Ethernet is up, allow full update pulls (images/catalogs/brain/SPA) |
| Hardware | Raspberry Pi 4 + Pi 5 (single aarch64 image family) |
| First-boot network | Ethernet preferred: SPA on LAN IP + mDNS; SoftAP only when no usable Ethernet |
| Zigbee stack | Always include Mosquitto + Zigbee2MQTT (SkyConnect-ready) |
| Catalog on card | Thin local only (`data/` YAML + optional thin cannalib/sqlite fallback) — **not** the fat Unraid/public CannaLib corpus |
| Packaging approach | Factory Raspberry Pi OS–based image (`.img.xz`) for Raspberry Pi Imager Custom OS |

## Goals

- A user can flash one SD card, insert it into a kit Pi, and complete kit setup without a second PC and without internet.
- Onboarding is one SPA wizard: USB flash → fleet Wi‑Fi/SoftAP join → Zigbee role/task bind → go live.
- Ethernet, when present, unlocks full version updates; lack of Ethernet must not block first kit bring-up.
- Reuse existing Pi appliance pieces (`pi-bootstrap.sh`, SoftAP units, `docker-compose.yml`, Zigbee Settings) — bake their result into the image rather than inventing a parallel stack.

## Non-goals

- Reviving Home Assistant lab / HACS / Sync.
- Windows/Mac companion USB flashers as the primary path.
- Shipping pot3/4 or F-001/F-002 as kit defaults (honest OOS / Advanced only).
- Online-first thin cards that require a pull before the SPA works.
- Compile-from-source on the Pi as the required first-flash path (baked firmware binaries only for kit roles).
- Shipping the full remote CannaLib corpus (~195k strains) on the SD card.

## §1 Architecture

**Deliverable:** one aarch64 factory image (`.img.xz`) for Pi 4 and Pi 5.

**Critical always-on (kit bring-up):**

- Docker + compose: DSC-Brain (SPA on `:8787`), Mosquitto, Zigbee2MQTT
- Pi-only repo slice: built SPA, kit catalogs under `data/`, kit firmware binaries
- USB flash stack: host esptool, `udev` rules, serial-by-id detection
- SoftAP tooling: hostapd / dnsmasq (existing `/etc/dsc-hub` pattern)

**Catalog (thin, not critical-path peer to Z2M):**

- Kit uses baked `data/` YAML plus brain local fallback (`cannalib_use_local_fallback`).
- Optional thin cannalib sidecar/sqlite may remain for API shape / compose compatibility — it is **not** the fat Unraid corpus; do not market or health-gate Setup as “full CannaLib online.”
- Ethernet Update may later point brain at a remote CannaLib URL; offline kits stay on thin local.

**First-boot network (Pi operator AP — distinct from hub/bridge SoftAP):**

1. If Ethernet has a usable link → do **not** start the **Pi** SoftAP; publish SPA via LAN IP and mDNS (`dsc-brain.local`; hostname `dsc-brain`).
2. If no usable Ethernet → start **Pi** SoftAP so the operator can reach Setup; this is not the hub `DSC-Setup-*` or bridge `DSC-Anchor` networks used by ESP fleet membership.
3. After commission, Ethernet may be added later for **full update pulls**; Pi SoftAP after commission follows add-device / AP policy (see Open points).

**Control plane:** Pi DSC-Brain remains Want→Got→Need→act SoT. HA-shaped entity / `call_service` dialect stays on the brain only.

## §2 Image layout and services

Build on existing paths; the factory image is the **baked outcome** of bootstrap so first unbox never runs `apt` or `git clone`.

| Path | Role |
|------|------|
| `/opt/dsc-hub` | Compose project + baked repo slice (brain sources/image, SPA dist, firmware, catalogs) |
| `/var/lib/dsc-hub` | Persistent runtime: `z2m`, `mosquitto`, ops, firmware cache, backups; optional thin `cannalib` sqlite if sidecar kept |
| `/etc/dsc-hub` | SoftAP hostapd/dnsmasq templates |
| Docker image store | Pre-loaded images for offline `compose up` |

**Boot units:**

- `dsc-hub-compose.service` — always enable/start
- SoftAP units (`dsc-hub-ap` and related) — start **only when no usable Ethernet**
- Avahi — mDNS when on LAN
- Serial console stripped from cmdline so SkyConnect ACM is not stolen (existing bootstrap behavior)

**Release pipeline:**

- pi-gen (or equivalent) produces versioned `.img.xz`
- Kit version = image tag + brain `/health` version + compose image digests (shown together in UI)
- Ethernet Update refreshes that version set as one operator action; offline Update states no-link honestly

**ESPHome as a compose service** is not required for first USB flash. Optional later for advanced rebuilds; kit onboarding uses baked binaries + host esptool.

## §3 Onboarding / USB flash wizard

**Entry:** SPA Setup (first visit or `#/setup`) when kit is not commissioned. Same wizard on LAN or SoftAP.

**Phases (linear, resumable):**

1. **Welcome + network status** — show LAN vs SoftAP; state that Ethernet enables later full updates.
2. **USB flash** — one device at a time:
   - Detect serial (`/dev/serial/by-id`)
   - Operator picks kit role: Hub → Panel → Probe 1–2 → ETH01 bridge → Sonoffs (heater / heatmat / humidifier / dehumidifier as kit allows)
   - Flash matching **baked** firmware via host esptool
   - Honest failure copy for missing port, wrong chip, bootloader/boot-mode (especially Sonoffs); never green on fail
   - Skip allowed with explicit “not flashed” debt visible until resolved or Advanced
3. **Fleet Wi‑Fi / SoftAP join** — guide existing hub SoftAP portal path; bridge Ethernet + SoftAP notes; Sonoffs onto home LAN when bridge/Ethernet path exists (local-only SoftAP without Ethernet cannot reach Sonoffs on a separate LAN — wizard must say so).
4. **Zigbee** — SkyConnect present check; permit join; **role / zone / task** binding via existing Settings model (`capability_class`, optional override, `problem_when`). No fake devices if radio missing.
5. **Go live** — require brain health, hub online (when expected), Mosquitto + Z2M up; mark kit commissioned.

**Safety:**

- Flash API local-only / setup-gated; single flash job at a time
- Do not gate wizard Next on unrelated entity-bus round-trips (local draft until bus catches up — existing SPA rule)

## §4 Updates, errors, verification

### Updates

- Operator-triggered **Update** in Settings (also reachable from Setup if not commissioned).
- **Full pull only when Ethernet is up** (compose images, catalogs, SPA/brain artifacts as defined by the kit version bundle).
- No Ethernet → honest “no link / offline” — running kit unchanged.
- UI must not claim “updated” unless image tag, brain version, and compose digests match the target bundle.

### Errors

- USB / boot-mode failures → specific retry copy
- SoftAP / Pi WiFi STA slot limits → document flash/join order; prefer Ethernet setup when available (known cyfmac / station-cap follow-ups stay operational constraints, not silent theater)
- Missing SkyConnect → Zigbee phase blocked with plug-coordinator guidance
- Compose/brain unhealthy after ops → Setup health fail; recovery prefers `docker stop -t 20` + `start` (existing Pi ops rule), not opaque restart loops in UI

### Verification / release gate

- CI builds or smoke-builds the image pipeline for aarch64
- Bench matrix: Pi 4 and Pi 5 cold boot from the card
  - SPA reachable on Ethernet path **and** SoftAP path (separately)
  - One USB flash dry-run against a real or fixture serial device
  - Brain health + Mosquitto + Z2M up
- Kit soak: hub + one probe join; one Zigbee bind smoke; one Ethernet Update cycle when linked

## Components (boundaries)

| Unit | Responsibility | Depends on |
|------|----------------|------------|
| Factory image (pi-gen) | OS + packages + preloaded Docker + baked `/opt` + first-boot policy | Repo release tag |
| Network policy service | Choose SoftAP vs LAN-only; mDNS | eth0 / wlan0 state |
| Compose stack | brain, mosquitto, z2m (critical); thin cannalib optional | `/var/lib/dsc-hub`, preloaded images |
| SPA Setup wizard | Phases 1–5 UX, honesty, commission flag | Brain APIs |
| Brain flash API | Enumerate serial, run esptool job, stream status | Host serial, firmware store |
| Update service | Ethernet check + version bundle apply | Registry/network or local bundle |
| Zigbee Settings | Existing role/task bind | Z2M + Mosquitto |

## Data flow (happy path)

```text
Flash .img.xz → Pi boot → network policy
  ├─ eth up → mDNS/LAN → SPA Setup
  └─ no eth → SoftAP → SPA Setup
SPA Setup → flash API (USB) → firmware on device
         → SoftAP/LAN join guides → fleet online
         → Z2M permit + role bind
         → commission = true
Later eth → Update → new kit version bundle
```

## Open points (resolve in plan, not blockers for this spec)

1. Exact SoftAP SSID/PSK defaults for **factory** cards vs lab (`DSC-Brain` / bootstrap defaults) — ship with documented kit credentials in Notion, never in git.
2. Post-commission SoftAP: off until “Add device window”, vs remain available on wlan0 when Ethernet is primary.
3. Keep thin cannalib container (soften brain `depends_on`) vs drop container and rely on `data/` + local fallback only.
4. Image distribution channel (GitHub Release asset vs private kit download) — ops choice, same artifact format.

## Related existing work

- `services/dsc-hub/pi/pi-bootstrap.sh`, `dsc-hub-ap.service`, `dsc-hub-compose.service`
- `services/dsc-hub/docker-compose.yml`
- `SETUP.md` SoftAP fleet unbox (update HA wording when implementing)
- Zigbee onboarding specs: `2026-08-29-zigbee-roles-onboarding-design.md`, `2026-08-30-zigbee-role-vs-task-operator-design.md`
- SoftAP fleet: `2026-08-10-softap-fleet-star-design.md`
