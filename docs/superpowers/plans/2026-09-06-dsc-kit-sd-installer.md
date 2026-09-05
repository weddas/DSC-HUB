# DSC Kit SD-Card Installer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship **DSC-HUB 8.0.0** — a factory aarch64 Pi 4/5 SD image that boots offline to DSC-Brain SPA Setup, USB-flashes kit firmware on the Pi, joins the fleet, binds Zigbee, and allows full updates only when Ethernet is up.

**Architecture:** Bake today’s Pi appliance (`pi-bootstrap`, SoftAP units, compose) into a pi-gen image. Add host network policy (Ethernet → LAN/mDNS SPA; no Ethernet → Pi SoftAP). Extend brain with kit commission + USB flash (baked binaries + host esptool — not the existing docker ESPHome OTA compile jobs). SPA `#/setup` wizard drives the flow. Thin local catalogs only; fat CannaLib stays remote.

**Tech Stack:** Raspberry Pi OS / pi-gen, systemd, Docker Compose, FastAPI brain, React SPA, host esptool, Mosquitto, Zigbee2MQTT

**Spec:** [`docs/superpowers/specs/2026-09-06-dsc-kit-sd-installer-design.md`](../specs/2026-09-06-dsc-kit-sd-installer-design.md)

## Global Constraints

- **Product version 8.0.0** — brain `__version__`, `DSC_SURFACE_VERSION`, compose image tags, and `/health` surface must read `8.0.0` for this release
- Pi 4 + Pi 5, single aarch64 image family; fat offline first boot
- Critical compose: brain + Mosquitto + Z2M (SkyConnect-ready); thin catalog only — never health-gate Setup on full CannaLib
- USB flash on Pi via SPA; one job at a time; honest failures; kit roles Hub → Panel → Probe 1–2 → bridge → Sonoffs
- pot3/4 and F-001/F-002 are not kit defaults
- Pi SoftAP ≠ hub `DSC-Setup-*` ≠ bridge `DSC-Anchor`
- Full update pulls only when Ethernet is up; offline Update is honest no-link
- Existing OTA/compile path (`esphome_jobs.py` docker exec) stays for advanced/server; kit Setup uses new USB flash path
- Commit only when asked; kit AP credentials live in Notion, never in git
- Hotpatch prefers `docker stop -t 20` + `start`; PuTTY plink/pscp on Windows

## File map (decomposition)

| Path | Responsibility |
|------|----------------|
| `services/dsc-hub/docker-compose.yml` | Soften/remove hard cannalib dependency for kit critical path |
| `services/dsc-hub/docker-compose.kit.yml` (create if needed) | Kit overlay: no fat catalog assumptions; optional thin cannalib profile |
| `services/dsc-hub/pi/dsc-hub-net-policy.sh` | Decide SoftAP vs LAN-only from eth carrier |
| `services/dsc-hub/pi/dsc-hub-net-policy.service` | Boot + carrier change hook |
| `services/dsc-hub/pi/dsc-hub-compose.service` | Stop requiring AP before compose when Ethernet-first |
| `services/dsc-hub/pi/pi-bootstrap.sh` | Align with factory bake; install net-policy + esptool/udev |
| `brain/dsc_brain/kit_commission.py` | Commission flag + setup status persistence |
| `brain/dsc_brain/usb_flash.py` | Serial enumerate + esptool job queue (baked firmware map) |
| `brain/dsc_brain/kit_update.py` | Ethernet gate + version bundle status |
| `brain/dsc_brain/network_apply.py` | Extend `network_status()` with eth carrier / mode / mDNS |
| `brain/dsc_brain/api.py` | Routes: `/setup/*`, `/settings/usb-flash/*`, `/settings/update/*` |
| `brain/tests/test_kit_setup.py` | Commission, flash map, ethernet gate, network mode |
| `frontend/src/pages/SetupPage.tsx` | Wizard phases 1–5 |
| `frontend/src/lib/setupApi.ts` | Fetch helpers for setup/flash/update |
| `frontend/src/routes.ts` / `App.tsx` | `#/setup` route + redirect when not commissioned |
| `services/dsc-hub/image/` | pi-gen config, stage scripts, bake checklist |
| `.audit/kit-sd-bench.ps1` | Pi 4/5 cold-boot + SoftAP/Eth + flash dry-run gates |
| `SETUP.md` / `INSTALL.md` / `README.md` | Pi SD unbox path; retire HA-first wording |

**Reuse, do not reinvent:** Zigbee Settings bind APIs; `network_apply` hostapd templates; `pi-bootstrap` AP configs; kit YAMLs under `firmware/v4/*-kit.yaml` as **source** for prebuilt binaries (binaries live under `/var/lib/dsc-hub/firmware` or `/opt/dsc-hub/firmware`).

**Execution note:** Tasks 1–6 deliver a working Setup vertical on a live Pi (hotpatchable). Tasks 7–8 produce the factory image + release gate. Prefer subagent-driven execution; park off-scope findings in `docs/FOLLOWUPS.md`.

---

### Task 1: Kit compose critical path (thin catalog) + version 8.0.0

**Also bump product version to 8.0.0** in this task:
- `brain/dsc_brain/__init__.py` → `__version__ = "8.0.0"`
- `brain/dsc_brain/paths.py` → default `DSC_SURFACE_VERSION` `"8.0.0"`
- `brain/dsc_brain/api.py` module docstring Pi Release 8.0.0
- `services/dsc-hub/docker-compose.yml` brain image tag / surface env defaults → 8.0.0
- `brain/tests/test_brain_pi.py` version assertions → 8.0.0

**Files:**
- Modify: `services/dsc-hub/docker-compose.yml`
- Create (optional): `services/dsc-hub/docker-compose.kit.yml`
- Modify: `brain/dsc_brain/settings.py` defaults if needed (`cannalib_use_local_fallback` stays `true`)
- Create: `brain/dsc_brain/kit_commission.py` (stub `setup_health` for catalog honesty)
- Test: `brain/tests/test_kit_setup.py` (catalog honesty helpers)
- Version files listed above

**Interfaces:**
- Produces: kit stack starts with `brain`, `mosquitto`, `zigbee2mqtt` without requiring remote CannaLib
- Produces: if thin `cannalib` service kept, it is under Compose `profiles: [thin-catalog]` or soft `depends_on` (brain must start if cannalib absent)
- Produces: `__version__` / surface / health read `8.0.0`

- [ ] **Step 1:** Write failing test that setup health payload treats catalog as `thin_local` / non-blocking when remote cannalib is down

```python
def test_setup_health_catalog_is_thin_non_blocking():
    from dsc_brain.kit_commission import setup_health
    h = setup_health(fleet_online=False, zigbee_up=False, eth_up=False, cannalib_remote_ok=False)
    assert h["catalog"]["mode"] == "thin_local"
    assert h["catalog"]["blocking"] is False
```

- [ ] **Step 2:** Implement minimal `setup_health` stub in `kit_commission.py` so the test can pass; flesh fields in Task 3

- [ ] **Step 3:** Soften compose: remove hard brain→cannalib requirement for kit path (profile or drop `depends_on`)

- [ ] **Step 4:** `pytest brain/tests/test_kit_setup.py::test_setup_health_catalog_is_thin_non_blocking -v` → PASS

- [ ] **Step 5:** Commit when asked — `fix(compose): kit critical path without fat cannalib`

---

### Task 2: Host network policy (Ethernet vs Pi SoftAP)

**Files:**
- Create: `services/dsc-hub/pi/dsc-hub-net-policy.sh`
- Create: `services/dsc-hub/pi/dsc-hub-net-policy.service`
- Modify: `services/dsc-hub/pi/dsc-hub-compose.service` (do not `Wants=` AP unconditionally)
- Modify: `services/dsc-hub/pi/pi-bootstrap.sh` (install + enable net-policy; keep cyfmac pin)
- Modify: `brain/dsc_brain/network_apply.py` — extend status
- Test: `brain/tests/test_kit_setup.py`

**Interfaces:**
- Produces shell contract:
  - `eth_carrier_up` → stop/disable runtime start of `dsc-hub-ap.service`; ensure avahi hostname `dsc-brain`
  - else → start `dsc-hub-ap.service`
- Produces `network_status()` extras:
  - `operator_mode`: `"ethernet" | "softap"`
  - `eth_carrier`: bool
  - `spa_urls`: list[str] (e.g. `http://<ip>:8787`, `http://dsc-brain.local:8787`, SoftAP `http://10.42.0.1:8787`)

- [ ] **Step 1:** Failing tests for `operator_mode` derivation from carrier flag (pure Python helper)

```python
def test_operator_mode_from_carrier():
    from dsc_brain.network_apply import operator_mode_for_carrier
    assert operator_mode_for_carrier(True) == "ethernet"
    assert operator_mode_for_carrier(False) == "softap"
```

- [ ] **Step 2:** Implement `operator_mode_for_carrier` + extend `network_status()` (read `/sys/class/net/eth0/carrier` when present; else `eth_carrier=False`)

- [ ] **Step 3:** Write `dsc-hub-net-policy.sh` that starts/stops `dsc-hub-ap.service` from carrier; unit `Type=oneshot` + `WantedBy=multi-user.target`; optional `path`/`networkd` dispatcher later

- [ ] **Step 4:** Adjust compose unit so AP is not a hard prerequisite when Ethernet-first

- [ ] **Step 5:** pytest PASS for helper + status shape

- [ ] **Step 6:** Commit when asked — `feat(pi): ethernet-first SoftAP network policy`

---

### Task 3: Kit commission + setup health API

**Files:**
- Create: `brain/dsc_brain/kit_commission.py`
- Modify: `brain/dsc_brain/api.py`
- Modify: `brain/dsc_brain/settings.py` or ops sqlite — persist `kit_commissioned` bool + setup phase checkpoints
- Test: `brain/tests/test_kit_setup.py`

**Interfaces:**
- Produces:
  - `get_setup_state() -> dict` with `commissioned: bool`, `phase: str`, `debt: list[str]`
  - `set_setup_phase(phase: str) -> dict`
  - `mark_commissioned() -> dict` (validates go-live gates)
  - `setup_health(...) -> dict` — brain up, mosquitto/z2m (from existing health), hub online optional until expected, catalog thin non-blocking
- HTTP:
  - `GET /setup/state`
  - `POST /setup/phase` body `{ "phase": "welcome"|"usb_flash"|"fleet_join"|"zigbee"|"go_live" }`
  - `POST /setup/commission`
  - `GET /setup/health`

- [ ] **Step 1:** Failing API/unit tests — cannot commission while brain health false; can set phases; catalog never blocks

- [ ] **Step 2:** Implement persistence + validators (go-live requires brain ok + mosquitto/z2m up; hub online required only if hub listed as flashed/not skipped)

- [ ] **Step 3:** Wire FastAPI routes; demo mode forbids commission mutate

- [ ] **Step 4:** pytest PASS

- [ ] **Step 5:** Commit when asked — `feat(brain): kit setup commission API`

---

### Task 4: USB flash API (baked binaries + host esptool)

**Files:**
- Create: `brain/dsc_brain/usb_flash.py`
- Modify: `brain/dsc_brain/api.py`
- Create: `services/dsc-hub/firmware/kit-manifest.json` (role → binary filename + chip)
- Document binary bake: prebuild from `firmware/v4/dsc-*-kit.yaml` into image firmware dir (script in Task 7)
- Test: `brain/tests/test_kit_setup.py` (mock subprocess)

**Interfaces:**
- Kit roles (ordered): `hub`, `panel`/`control`, `pot1`, `pot2`, `bridge`, `heater`, `heatmat`, `humidifier`, `dehumidifier`
- Produces:
  - `list_serial_ports() -> list[dict]` (`device`, `by_id`, `vid_pid`, `chip_hint`)
  - `queue_usb_flash(role: str, port: str) -> dict` — 409 if job running
  - `get_usb_flash_job(job_id) -> dict` — `queued|running|done|failed` + honest `detail`
- HTTP:
  - `GET /settings/usb-flash/ports`
  - `GET /settings/usb-flash/manifest`
  - `POST /settings/usb-flash/jobs` `{ "role", "port" }`
  - `GET /settings/usb-flash/jobs` / `GET /settings/usb-flash/jobs/{id}`
- Flash command shape (host, not docker esphome OTA):

```bash
esptool.py --port /dev/ttyUSB0 write_flash 0x0 /opt/dsc-hub/firmware/kit/hub.bin
```

(Exact offset/chip flags come from manifest per role; Sonoff entries must include boot-mode note string for SPA.)

- [ ] **Step 1:** Failing tests — unknown role 400; second queue while running 409; failed esptool → status `failed` with stderr tail; success → `done`

- [ ] **Step 2:** Implement job table (sqlite alongside ops or reuse pattern from `esphome_jobs.py` but **separate** table `usb_flash_jobs`)

- [ ] **Step 3:** Wire API; refuse in demo mode; single-flight lock

- [ ] **Step 4:** pytest PASS with mocked `subprocess`

- [ ] **Step 5:** Commit when asked — `feat(brain): USB kit flash job API`

---

### Task 5: SPA Setup wizard

**Files:**
- Create: `frontend/src/pages/SetupPage.tsx`
- Create: `frontend/src/lib/setupApi.ts`
- Modify: `frontend/src/routes.ts`, `frontend/src/App.tsx`
- Modify: Settings entry “Open Setup” / General link
- Build: `frontend` `npm run build`

**Interfaces:**
- Consumes Task 3–4 HTTP + existing Zigbee settings endpoints (`/settings/zigbee/*`)
- Route: `/setup` (hash router)
- If `GET /setup/state` → `commissioned === false`, App redirects unknown deep-links optionally; always allow `#/setup`
- Phases UI:
  1. Welcome + `operator_mode` / `spa_urls` from `/settings/network`
  2. USB flash — port select, role select, flash, poll job; boot-mode copy from manifest; skip adds debt
  3. Fleet join — short honest guides (hub SoftAP / bridge / Sonoff LAN caveat)
  4. Zigbee — reuse permit-join + bind UI patterns from Settings (extract shared bits if needed)
  5. Go live — `/setup/health` + Commission button

- [ ] **Step 1:** Add route + empty Setup page that loads `/setup/state`

- [ ] **Step 2:** Implement phases 1–2 against live/mock APIs; never show success on failed job

- [ ] **Step 3:** Phases 3–5; Commission calls `POST /setup/commission` and navigates to `/live/overview` on success

- [ ] **Step 4:** `npm run build` + `npx tsc --noEmit` green

- [ ] **Step 5:** Commit when asked — `feat(spa): kit Setup wizard`

---

### Task 6: Ethernet-gated Update

**Files:**
- Create: `brain/dsc_brain/kit_update.py`
- Modify: `brain/dsc_brain/api.py`
- Modify: `frontend/src/pages/SettingsPage.tsx` (Server/General) + Setup link
- Test: `brain/tests/test_kit_setup.py`

**Interfaces:**
- Produces:
  - `update_status() -> { eth_up, current: {image, brain, digests}, target?: ..., can_full_pull: bool }`
  - `start_full_update() -> dict` — **400/409 with honest body if not `eth_up`**
- HTTP: `GET /settings/update`, `POST /settings/update/pull`
- SPA: Update button disabled + honesty when `can_full_pull === false`; never claim updated without matching versions

- [ ] **Step 1:** Failing tests for ethernet gate

```python
def test_full_update_rejected_without_ethernet():
    from dsc_brain.kit_update import start_full_update
    try:
        start_full_update(eth_up=False)
        assert False, "expected rejection"
    except ValueError as e:
        assert "ethernet" in str(e).lower() or "link" in str(e).lower()
```

- [ ] **Step 2:** Implement status + stub pull orchestrator (compose pull / load from documented bundle path); wire UI honesty

- [ ] **Step 3:** pytest PASS; SPA build green

- [ ] **Step 4:** Commit when asked — `feat(brain): ethernet-gated kit update`

---

### Task 7: Factory image bake (pi-gen)

**Files:**
- Create: `services/dsc-hub/image/README.md` (build host requirements, outputs)
- Create: `services/dsc-hub/image/pi-gen-config` (or stage overlay scripts)
- Create: `services/dsc-hub/image/stage-dsc/XX-packages`, `XX-dsc-hub`, `XX-docker-preload`
- Create: `services/dsc-hub/image/bake-firmware.sh` — compile kit bins into `firmware/kit/` + manifest
- Modify: `pi-bootstrap.sh` / systemd units copied into stage
- CI: optional workflow later; local build instructions required in README

**Bake contents:**
- Raspberry Pi OS Lite 64-bit base
- Docker + compose plugin; preload `dsc-hub-brain`, mosquitto, z2m images
- `/opt/dsc-hub` tree: compose, SPA dist, firmware/kit, data catalogs
- esptool + udev rules for common USB-UART
- net-policy + SoftAP templates; hostname `dsc-brain`
- **No** fat CannaLib DB

- [ ] **Step 1:** Document exact build commands in `services/dsc-hub/image/README.md`

- [ ] **Step 2:** Add stage scripts that install packages and copy `/opt/dsc-hub` from a release artifact directory

- [ ] **Step 3:** `bake-firmware.sh` produces binaries + `kit-manifest.json` for Task 4 roles (probe 1–2 only in default kit list)

- [ ] **Step 4:** Produce `.img.xz` on a Linux aarch64/x86 builder; smoke-boot on Pi 4 or Pi 5

- [ ] **Step 5:** Commit when asked — `feat(image): pi-gen DSC kit factory stage`

---

### Task 8: Bench gate + docs

**Files:**
- Create: `.audit/kit-sd-bench.ps1`
- Modify: `SETUP.md`, `INSTALL.md`, `README.md` — SD flash → Setup wizard; remove HA-first install as product path
- Modify: `docs/FOLLOWUPS.md` — park residuals (post-commission AP policy, distribution channel, thin cannalib keep/drop)

**Bench script gates:**
1. Brain `/health` after cold boot
2. `/settings/network` shows expected `operator_mode` for Eth-connected vs SoftAP-only runs
3. `/setup/state` commissioned false on fresh image
4. `/settings/usb-flash/ports` returns without 500
5. Mosquitto/Z2M up (Z2M may be on-failure if no stick — honesty check)
6. Optional: one real USB flash dry-run

- [ ] **Step 1:** Write bench script + doc updates

- [ ] **Step 2:** Run bench against hotpatched live Pi for Tasks 1–6; against SD image when Task 7 exists

- [ ] **Step 3:** FOLLOWUPS write-up for open points from spec

- [ ] **Step 4:** Commit when asked — `docs: kit SD installer unbox + bench gates`

---

## Spec coverage checklist

| Spec item | Task |
|-----------|------|
| Factory `.img.xz` Pi 4/5 | 7 |
| Offline fat bring-up | 7 + 1 |
| Eth → LAN/mDNS; else Pi SoftAP | 2 |
| Always Mosquitto + Z2M | 1, 7 |
| Thin catalog / not fat CannaLib | 1, 7 |
| USB flash wizard on Pi | 4, 5 |
| Fleet join + Zigbee bind | 5 |
| Commission / go live | 3, 5 |
| Ethernet full update pulls | 6 |
| Honest errors | 4, 5, 6 |
| Bench Pi 4/5 + SoftAP/Eth | 8 |
| Pi SoftAP ≠ hub/bridge SoftAP | 2, 5 copy + SETUP.md |

## Open points (park in FOLLOWUPS during Task 8)

1. Factory SoftAP SSID/PSK defaults — Notion only  
2. Post-commission Pi SoftAP policy  
3. Keep thin cannalib container vs `data/` + fallback only (Task 1 chooses one; document)  
4. Image distribution channel  

---

## Self-review notes

- Existing `esphome_jobs.py` is **OTA/compile via docker** — USB path is intentionally separate (`usb_flash.py`) to match the approved “baked binary + host esptool” design.
- `dsc-hub-compose.service` currently `Wants=dsc-hub-ap.service` — Task 2 must change that for Ethernet-first.
- No placeholders left for critical behaviors; Update pull orchestrator may start as compose pull against a documented registry, then grow to offline bundle load without changing the HTTP contract.
