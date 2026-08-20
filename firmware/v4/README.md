# DSC-HUB firmware v4

Working directory for ESPHome configs. Current fleet release string:
**Live lab train:** hub / Control / bridge / pots / Sonoffs **6.1.0.0** on ESPHome
**2026.8.0** (studio Wi-Fi + HA Native API bus; ESP-NOW/SoftAP parked for lab).
HA surface **7.2.0**. Tagged marketing cut may still say `v5.1.0`.
Ops: [docs/qa/STUDIO-WIFI-HA-BUS.md](../../docs/qa/STUDIO-WIFI-HA-BUS.md).
See CHANGELOG / FOLLOWUPS.

Firmware QA: [docs/qa/FIRMWARE-QA-5.1.0.md](../../docs/qa/FIRMWARE-QA-5.1.0.md).
Repo [README](../../README.md) and [INSTALL.md](../../INSTALL.md) for from-scratch HA setup.
Standalone SoftAP unboxing (no HA): [SETUP.md](../../SETUP.md).

## Local vs HA

| Where | What |
|---|---|
| Here (`firmware/v4/`) | Stubs `!include` package bodies for Cursor edits + local flash. |
| [`homeassistant/esphome/`](../../homeassistant/esphome/) | Same stubs with **git-pull** packages from GitHub. |

Entry points (local lab): `dsc-hub.yaml`, `dsc-control.yaml`, `dsc-bridge.yaml`, `dsc-pot1.yaml`, …
Kit SoftAP setup: `dsc-hub-kit.yaml`, `dsc-control-kit.yaml`, `dsc-pot{1..4}-kit.yaml`, `dsc-bridge-kit.yaml`

WiFi is split into `dsc-*-wifi-lab.yaml` / `dsc-*-wifi-kit.yaml` so kit builds omit compile-time SSIDs.
**Lab:** studio STA + reserved LAN IPs; hub includes `dsc-hub-espnow-parked.yaml` (no primary);
panel includes `dsc-control-ha-bus.yaml`; bridge `enable_anchor: false`.
**Kit:** SoftAP portal (`components/dsc_fleet_setup/`) + real ESP-NOW primary; bridge may host
`DSC-Anchor` + `components/dsc_api_client/` (F-010).

Package bodies are remote-git safe (no `!secret`). Stubs pass credentials (and hub/panel MACs + `espnow_cmd_tag`) as substitutions.

Pots (`dsc-pot-common` **5.1.6+**): each soil channel has **Cal … Offset** / **Cal … Scale**
config numbers (NVS). Formula `raw * scale + offset` applies before range/median and feeds
HA + ESP-NOW. **Soil * Raw** diagnostic templates reverse cal for lab wet measured points.
**Reset Sensor Calibration** restores defaults and clears provenance. **Mark Soil Cal Peer Median**
(5.1.5+) and **Mark Soil Cal Lab Buffer** (5.1.6+) stamp method after HA push / lab wet.

## Panel (DSC-CONTROL **6.1.0.0** · HA bus)

Package bodies: [`dsc-control-common.yaml`](dsc-control-common.yaml) +
[`dsc-control-ha-bus.yaml`](dsc-control-ha-bus.yaml) (lab stub only).

| Feature | Notes |
|---|---|
| Soil / climate cards | Lab: HA `homeassistant` sensors → `gv_*` (no ESP-NOW 0xD1/0xD2/0xD3) |
| Commands | `hub_cmd` → `esphome.dsc_panel_hub_cmd` → HA package `dsc_v4_panel_ha_bus` |
| Hold-to-lock | Hold ~3 s on primary tabs; hold lock screen to unlock |
| Demand / takeover gate | Confirm → Engage (not one stray tap) |
| Connections | Wi‑Fi channel; ESP-NOW shows **PARKED** on lab train |
| AP pin | Kit SoftAP path only. Lab stubs keep `00:00:00:00:00:00` — never bake a site MAC into YAML. |
| Pulse VPD trend | 12×5 min ring → one label (no canvas charts) |
| HA API | **Plaintext** (no Noise); **mDNS off** — add by IP only (**required** for lab bus) |
| Stability | Page-gated `refresh_ui`; 30 s Wi‑Fi channel poll |

After UI flashes: watch serial `boot` / `heap` lines. If the panel boot-loops, use **USB** not OTA until a clean up line prints. See [`../_history/v4/crash-logs/`](../_history/v4/crash-logs/).

### Panel HA API reconnect (lab bus)

The `api:` block lives in [`dsc-control-common.yaml`](dsc-control-common.yaml). **No Noise encryption** — LVGL RAM left the Noise handshake failing and the teardown path double-freed the heap. mDNS is **disabled**. ESPHome’s “Unable to connect… includes an `api` section” toast is **generic** — it does **not** mean the YAML is missing `api:`.

On the **lab** train the HA API is the vitals/command bus, not optional diagnostics.

| Check | What to do |
|---|---|
| Panel boot-looping / no Wi‑Fi | USB flash; serial must show a clean Control up line. OTA will not recover a looping board. |
| Host / mDNS | **IP only** — studio reservation **`192.168.86.177`** (`use_address` in `dsc-control-wifi-lab.yaml`). Do not use `dsc-control.local`. |
| Encryption | Leave the key **blank** when adding/reconfiguring. If HA still has an old encrypted entry, **delete it** and re-add. |
| Stale SoftAP host | Delete any `192.168.4.x` / old **dsc-cyd1** ESPHome devices after cutover. |
| Secrets on HA | Still need `dsc_control_ota_password` / `_ap_password` for Install/fallback AP. |
| Stub on HA | `/config/esphome/dsc-control.yaml` must pull `dsc-control-ha-bus.yaml`; Validate before Install. |
| Taps no-op on hub | Sync `dsc_v4_panel_ha_bus.yaml` + restart Core; confirm `esphome.dsc_panel_hub_cmd` events. |
| Bundle fails: `… is not a valid YAML file` / `expected '<document start>'` | Almost always a **header comment** in the package body that lost its `#`. Fix on git, push, set stub `refresh: 0d`, Validate again. |

**Package header rule:** changelog lines in package bodies must stay `#` comments.

Full cutover checklist: [docs/qa/STUDIO-WIFI-HA-BUS.md](../../docs/qa/STUDIO-WIFI-HA-BUS.md).

### Phase 1 fleet notes (stability + snappiness)

| Device | Change | Flash |
|---|---|---|
| Pots + Sonoffs | `power_save_mode: none` + `logger: INFO` | OTA fine |
| Hub | 30 s Wi‑Fi channel poll (silent Nest hops) | OTA fine |
| Panel 4.0.11 | Live `gv_*` UI + channel poll | **USB** if heap-sensitive / still looping |
| HA packages / automations / dashboard | Push sync (or copy) + reload | See [`../../RELEASE.md`](../../RELEASE.md) · [`../../scripts/HA-SYNC-BOOTSTRAP.md`](../../scripts/HA-SYNC-BOOTSTRAP.md) |

## Hub mat votes

In [`dsc-hub-v4_0.yaml`](dsc-hub-v4_0.yaml): `Mat Vote Pot 1`–`4` (`switch.dsc_hub_mat_vote_pot_N`). OFF pots are skipped by coldest/hottest root-zone voting (5–45 °C filter still applies). POT3 defaults OFF.

## Quick validate

```bash
esphome config dsc-hub.yaml
esphome config dsc-control.yaml
esphome config dsc-heater.yaml
esphome config dsc-pot1.yaml
g++ -std=c++17 -Wall -Wextra -O2 -o verify_v4 verify_v4.cpp && ./verify_v4
```

Requires `secrets.yaml` in this folder (gitignored). Start from `secrets.yaml.template` if needed.

`espnow_cmd_tag` is **54727** (`0xD5C7`) on hub + panel — flash both after changing it.

Fleet bring-up / cutover: [`../../INSTALL.md`](../../INSTALL.md) · [`../../UPGRADE.md`](../../UPGRADE.md).
