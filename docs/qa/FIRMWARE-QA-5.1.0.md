# Firmware QA / QC — v5.1.0

Commit checklist for lab + kit packages. Firmware Install is always **manual**.

## Pre-flash

- [ ] All `project.version` in hub / control / pot / sonoff commons = **`5.1.0`**
- [ ] Kit stubs (`*-kit.yaml`, `*-wifi-kit.yaml`, `dsc-fleet-setup-*-kit.yaml`) Validate
- [ ] Lab stubs Validate: hub, control, pot1–4, heater, heatmat, humidifier, de-humidifier
- [ ] `espnow_cmd_tag` = **54727** on hub **and** panel
- [ ] `g++ … verify_v4.cpp && ./verify_v4` passes (wire contract)
- [ ] Hub exposes `number.dsc_hub_ladder_wait_{dehum,hum,heat,ac,mat}` (NVS)

## Flash order (lab)

1. [ ] Hub → reports `sensor.dsc_hub_firmware_version` = **5.1.0**
2. [ ] Panel → **5.1.0**; ESP-NOW link UP; heap comfortable
3. [ ] Pots 1–4 → **5.1.0**; soil + ESP-NOW
4. [ ] Sonoffs → **5.1.0**; followers track demands

## Behavioral smoke

- [ ] Ladder: dehum → hum → heat → AC → mat with reality gates
- [ ] Mat uses coldest **voted** plausible pot (not POT1-only)
- [ ] Failsafe >35 °C owns outputs; learn gate closes
- [ ] Hub API blip under 25s → heater/mat/hum relays **stay ON** (follower debounce); offline ≥30s → safe-off; followers resync on return (**no** snapshot restore)
- [ ] API-blip case: Control still LINKED, HA hub unavailable under 25s → heater stays ON; handshake/API dead ≥5 min while WiFi up → NVS sync + safe_reboot (≤2×/boot); Full Auto re-arms
- [ ] Hub `Lock WiFi AP` learns preferred BSSID; 0xD0 handshake carries it; pots accept and reconnect to that exact BSSID; Control adopts during Starting; ladder nudge→WiFi bounce→reboot
- [ ] Phase B wait numbers accepted; `run_climate_logic` starts from bases then gates
- [ ] Phase B off by default in HA; enabling writes waits only (not failsafe/min-off/fans)
- [ ] Panel heap: free + largest free block healthy after UI pages

## Kits

- [ ] SoftAP / wifi-kit configs **Validate** (flash optional on lab)
- [ ] No leftover `5.0.0` / `4.0.x` `project.version` in kit path
- [ ] Each pot stub sets `fleet_pot_index: "1"`…`"4"`; kit passes it as `pot_index: ${fleet_pot_index}` (see [`FLEET-POT-INDEX-5.1.9.md`](FLEET-POT-INDEX-5.1.9.md))

## Sign-off

| Role | Date | Notes |
|---|---|---|
| | | |
