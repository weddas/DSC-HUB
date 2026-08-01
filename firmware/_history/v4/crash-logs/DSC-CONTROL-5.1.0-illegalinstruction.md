# DSC-CONTROL 5.1.0 — IllegalInstruction crash-loop

**Date:** 2026-08-01 · **Device:** ESP32-2432S028R (CYD, no PSRAM) @ 192.168.86.73

## Symptoms

- Flash to project **5.1.0** (ESPHome 2026.7.3 / IDF 5.5.5) succeeded.
- API handshake briefly OK, then disconnect; HA still shows 5.1.0 / link often on.
- Repeated `*** CRASH DETECTED ON PREVIOUS BOOT ***` on **core 1**:
  - `Fault - IllegalInstruction` PC `0x40088580` (IRAM)
  - `Fault - Unknown` PC `0x4011CA4C` (IROM; backtrace shape matches prior LVGL stacks)
- Cycle ~40–60 s. Addr2line unavailable (no local `.elf` / toolchain).

## Root cause hypothesis

Not a new panel UI regression — **5.1.0 only bumped `project.version`** on the panel body.

v5.0 lab stub added `dsc-fleet-setup-control-lab.yaml` with `enabled: false`, but
`dsc_fleet_setup` still **`AUTO_LOAD`ed `web_server_base` + `json`**. That brings
back the captive/web-server DRAM cost that v4.0.1 explicitly removed from this
CYD. Under ESP-IDF 5.5 the failure presents as IllegalInstruction / Unknown
instead of the older StoreProhibited / task WDT signatures — same class of
fault: heap too tight for LVGL on core 1.

Secondary: `hub_cmd` was switched to `id(fleet_setup).hub_mac()`, forcing the
fleet component into every lab panel build; `auto_add_peer: true` was also new.

`sram1_as_iram` bootloader warning is **not** the fix — firmware correctly keeps
it off (costs DRAM; see comments in `dsc-control-common.yaml`).

## Fix (2026-08-01)

1. **All lab stubs** omit `dsc-fleet-setup-*-lab.yaml` (hub / control / pots).
2. Hub `dsc-hub-espnow-primary.yaml` TX address → `${panel_mac}` (no `id(fleet_setup)`).
3. Control `hub_cmd` → `${hub_mac}`; `auto_add_peer: false`.
4. Comment on `dsc_fleet_setup` AUTO_LOAD: even `enabled: false` still instantiates
   WebServerBase — lab must not include the component at all.

Kit SoftAP (`*-kit.yaml`) still includes fleet packages when provisioning is wanted.

## Flash note

HA ESPHome stub still **git-pulls `master`**. Until this lands on GitHub + Sync,
OTA from HA will rebuild the broken tree. Prefer: commit/push → Sync → Install
with `use_address: 192.168.86.73`, or USB serial if OTA window is too short.

## Verify

- Log line `DSC-CONTROL 5.1.0 up — free_heap=… largest=…` (largest ideally ≫ 12 KB).
- No crash banners for several minutes; API Hello stays up.
- ESP-NOW glass↔hub still works (static `${hub_mac}` peer).
