# DSC-HUB

Indoor grow automation fleet: ESPHome hub, CYD touch panel (DSC-CONTROL), soil pots, and Sonoff demand followers.

**Current release:** [**v5.0.0**](https://github.com/weddas/DSC-HUB/releases/tag/v5.0.0) — hub firmware **`5.0.0`**

## Docs (start here)

| Doc | When |
|---|---|
| [`INSTALL.md`](INSTALL.md) | **From-scratch** HA + fleet bring-up (file → destination map) |
| [`SETUP.md`](SETUP.md) | **Standalone SoftAP unboxing** (no HA) — HUB + Control + pots |
| [`scripts/ADDON.md`](scripts/ADDON.md) | **Primary delivery** — HAOS add-on (packages / dashboard / www) |
| [`RELEASE.md`](RELEASE.md) | This alpha cut, HA sync vs firmware Install, backlog |
| [`homeassistant/README.md`](homeassistant/README.md) | Packages, dashboard, HACS, SYSTEM MAP |
| [`scripts/HACS-FRONTEND.md`](scripts/HACS-FRONTEND.md) | Optional HACS Dashboard card |
| [`scripts/HA-SYNC-BOOTSTRAP.md`](scripts/HA-SYNC-BOOTSTRAP.md) | Optional Unraid runner (non-add-on path) |
| [`firmware/v4/README.md`](firmware/v4/README.md) | Local validate / flash entry points |

**HAOS delivery:** Settings → Add-ons → Repositories → add `https://github.com/weddas/DSC-HUB`
→ install **DSC-HUB Sync**. Push to `master` → add-on polls GitHub (~60s) → packages /
dashboard / www land in `/config`. Details: [`scripts/ADDON.md`](scripts/ADDON.md).

ESPHome OTA updates firmware only (manual Validate/Install).

## Canonical firmware

**Active source of truth:** [`firmware/v4/`](firmware/v4/)

| Device | Config | Version (this alpha) |
|---|---|---|
| Hub | stub `dsc-hub.yaml` → `dsc-hub-v4_0.yaml` + `dsc-hub-espnow-primary.yaml` | **`5.0.0`** |
| Touch panel | stub `dsc-control.yaml` → `dsc-control-common.yaml` (+ `cyd_glyphs.yaml`) | **4.0.11** |
| Pots 1–4 | `dsc-pot{1..4}.yaml` → `dsc-pot-common.yaml` | **4.0.1** |
| Sonoffs | `dsc-heater` / `heatmat` / `humidifier` / `de-humidifier` → `dsc-sonoff-common.yaml` | common package |

**HA ESPHome deploy:** thin stubs in [`homeassistant/esphome/`](homeassistant/esphome/) pull package bodies from this GitHub repo. Edit in Cursor → push → Validate/Install in ESPHome. Flash hub + panel together when the ESP-NOW tag or wire contract changes.

Crash logs and YAML backups live in [`firmware/_history/v4/`](firmware/_history/v4/). Legacy trees are under `_Archive_Legacy_Code/`.

## Home Assistant

Canonical dashboard + packages + ESPHome stubs: [`homeassistant/`](homeassistant/)

| Piece | File |
|---|---|
| **HAOS Sync add-on** | [`dsc-hub-sync/`](dsc-hub-sync/) · [`scripts/ADDON.md`](scripts/ADDON.md) |
| Lovelace | `homeassistant/dashboards/dsc-hub-v4-dashboard.yaml` (YAML mode, URL: `dsc-hub-pro`) |
| Helpers + automations | `homeassistant/packages/dsc_v4_*.yaml` |
| Config snippet | `homeassistant/configuration.snippet.yaml` |
| ESPHome stubs | `homeassistant/esphome/dsc-*.yaml` (git-pull package bodies) |
| SYSTEM MAP | HACS optional · or add-on `www/` sync — [`scripts/HACS-FRONTEND.md`](scripts/HACS-FRONTEND.md) |
| Push deploy (alt) | [`scripts/ha-sync.sh`](scripts/ha-sync.sh) Unraid/GHA if not using the add-on |

## Secrets

```bash
cd firmware/v4
# Either use your existing secrets.yaml (already gitignored), or:
cp secrets.yaml.template secrets.yaml
# or generate fresh keys:
./generate-secrets.sh   # then set wifi_ssid / wifi_password
```

Never commit `secrets.yaml`. Never paste it into chat.

## ESP-NOW panel ↔ hub

Both sides must share the same values:

- Panel `hub_mac` ↔ hub WiFi MAC  
- Hub `panel_mac` ↔ panel WiFi MAC  
- `espnow_cmd_tag` — **54727** (`0xD5C7`) on both (rotated off the default `0xABCD`)

If tags differ, the hub silently drops panel commands. **Flash hub and panel together** after a tag change.

**Dual path:** ESP-NOW is primary for panel↔hub (works with HA down). The hub’s HA entities stay the dashboard/Sonoff surface — panel commands drive those same entities, and HA changes rebroadcast to the panel (`tx_panel_sync` / `0xD1`–`0xD4`). Plant names live on each pot (permanent); the hub mirrors them from HA and relays to the panel as `0xD4`.

**Nest / mesh WiFi:** ESP-NOW follows the STA channel. Google Nest and similar meshes hop 2.4 GHz without warning. If the hub and panel land on different channels, telemetry stops with no protocol error — the panel ESP-NOW row goes DOWN and a channel-hop alert may fire. Fix: a small dedicated 2.4 GHz AP on a **fixed channel** for the DSC fleet (hub + panel + pots).

**Sonoffs:** ESP8285 appliances have no ESP-NOW. Demand switches need Home Assistant to move relays. Climate fans/SF1000 still run locally without HA.

## Wire-contract check

```bash
cd firmware/v4
g++ -std=c++17 -Wall -Wextra -O2 -o verify_v4 verify_v4.cpp && ./verify_v4
```

## Validate before flash

From `firmware/v4/` (ESPHome CLI or HA ESPHome add-on):

```bash
esphome config dsc-hub.yaml
esphome config dsc-control.yaml
esphome config dsc-pot1.yaml
esphome config dsc-heater.yaml
```

Panel heap health (after UI changes): watch log lines from `heap` and boot — free heap and largest block. Comfort: largest block ≥ ~20 KB; warn below ~12 KB. See `_history/v4/crash-logs/DSC-CONTROL-v4.0.2-postmortem.md`. Panel **4.0.11** (live `gv_*` UI + page-gated refresh + plaintext API): flash **USB** if still WDT-looping; add HA by IP with **no** encryption key. HA git-pull Install failing with `not a valid YAML file` on `dsc-control-common.yaml` usually means a package header comment lost its `#` — see [`firmware/v4/README.md`](firmware/v4/README.md).

**Grow mat:** hub exposes `switch.dsc_hub_mat_vote_pot_1`…`4` so a bad probe can be excluded without a reflash (Root Zone dashboard is the HA surface).

## Flash order (first bring-up)

1. Hub  
2. Panel (pair with hub)  
3. Pots  
4. Sonoffs  

Otherwise OTA + HA encryption keys / ESP-NOW tag get out of sync.
