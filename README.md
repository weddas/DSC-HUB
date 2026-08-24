# DSC-HUB Pro

Indoor grow climate fleet: **ESPHome hub**, **CYD touch panel** (DSC-CONTROL),
**soil pots**, and **Sonoff demand followers** — local-first ladder control.
Home Assistant is the **lab soak / optional shell**; product destination is a
**Pi offline brain** + local webserver ([`docs/DSC-BRAIN.md`](docs/DSC-BRAIN.md),
Notion [Product layers](https://app.notion.com/p/3b52b4cda37081c2bcafc85d3407556c)).

**Current release tag:** [**v5.1.0**](https://github.com/weddas/DSC-HUB/releases/tag/v5.1.0)  
**Live lab train (in tree):** firmware **6.1.0.0** on ESPHome **2026.8.0** · HA surface **7.2.0** · Sync **5.1.3+**  
**Product kit train:** SoftAP / ESP-NOW shaped (`*-kit.yaml`) — see [`SETUP.md`](SETUP.md). Live lab diverges (studio Wi-Fi + HA bus).

---

## Why DSC-HUB

- **Hub owns climate** — dehumidifier → humidifier → heater → AC → mat ladder
  with reality gates, failsafe, and min-off (HA never drives those safety rails).
- **Lab live bus: HA Native API** — panel commands and pot soil via Home Assistant
  on **Digital-Emotions Studio** (2.4 GHz). ESP-NOW stays in tree as **parked**.
- **ETH01 bridge** — ethernet at `192.168.86.66`; SoftAP `DSC-Anchor` disabled after
  cutover. Optional Sonoff API client; HA demand followers are primary.
- **DSC-HUB Pro** dashboard (`/dsc-hub-pro`) — Home, Climate, Learning, tents,
  Root Zone, Tank, Light, Trends, System.
- **Build a Plant** (`/dsc-build-plant/build`) — separate composition dashboard
  (strain · soil % · nutrients · light · climate Want → roster / pot).
- **Learn Phase A + B** — Phase A EMA efficiencies & ETA; Phase B (opt-in)
  rate-limited writes to ladder **wait bases** only.
- **Fleet version chip** — at-a-glance `ok` / `warn` / `error` vs expected **6.1.0.0** train.
- **Push → all Sync HAOS** — packages, Pro dashboard, www, ESPHome stubs;
  **device firmware stays manual Install** (never auto-flash).

```mermaid
flowchart LR
  Pots[Pots] -->|Native_API| HA[Home_Assistant]
  Panel[DSC_CONTROL] -->|Native_API| HA
  Hub[Hub_ladder] -->|Native_API| HA
  Sonoffs[Sonoff_relays] -->|Native_API| HA
  HA -->|homeassistant_sensors| Hub
  HA -->|homeassistant_action| Hub
  HA -->|demand_followers| Sonoffs
  Bridge[DSC_BRIDGE_eth] -.->|optional_API_client| Sonoffs
  Hub --> LearnA[PhaseA_EMA] --> LearnB[PhaseB_waits]
  Sync[dsc_hub_sync] --> Pro[dsc-hub-pro]
```

---

## Start here

| Doc | When |
|---|---|
| [`SETUP.md`](SETUP.md) | **Product unbox** — SoftAP kit without HA |
| [`docs/qa/PI-APPLIANCE-7.0.md`](docs/qa/PI-APPLIANCE-7.0.md) | **Pi product 7.0** — FleetSnapshot SPA, `/control`/`/history`, prebuilt deploy, noise_psk, AP |
| [`docs/DSC-BRAIN.md`](docs/DSC-BRAIN.md) | Pi offline brain + webserver product shape |
| [`docs/HA-SCAFFOLD.md`](docs/HA-SCAFFOLD.md) | HA = lab soak; promote-don't-deepen |
| [`brain/README.md`](brain/README.md) | Catalog SQLite / Want / API stub (Phase B) |
| [`INSTALL.md`](INSTALL.md) | Lab HA + fleet bring-up |
| [`UPGRADE.md`](UPGRADE.md) | 5.0 → 5.1 cutover (add-on Update + flash) |
| [`RELEASE.md`](RELEASE.md) | What’s new, rollout checklist |
| [`scripts/ADDON.md`](scripts/ADDON.md) | Lab HA delivery — HAOS Sync add-on |
| [`docs/qa/FIRMWARE-QA-5.1.0.md`](docs/qa/FIRMWARE-QA-5.1.0.md) | Firmware Validate / flash QC |
| [`docs/qa/ADDON-QA-5.1.0.md`](docs/qa/ADDON-QA-5.1.0.md) | Sync add-on QC |
| [`homeassistant/README.md`](homeassistant/README.md) | Packages, HACS, entity notes |
| [`docs/qa/LIVE-UI-BUILD-A-PLANT.md`](docs/qa/LIVE-UI-BUILD-A-PLANT.md) | Build a Plant composition ops (N-083) |
| [`firmware/v4/README.md`](firmware/v4/README.md) | Local validate / flash |

**HAOS delivery:** Settings → Add-ons → Repositories → `https://github.com/weddas/DSC-HUB`
→ install / Update **DSC-HUB Sync** **5.1.3**. Push to `master` → poll (~60s) →
packages / dashboard / www / ESPHome stubs land in `/config`.

---

## Fleet at 6.1.x (live lab train)

| Device | Config | Version | Studio LAN |
|---|---|---|---|
| Hub | `dsc-hub.yaml` → v4_0 + fleet-heal (no ESP-NOW include) | **6.1.0.0** | `.180` |
| Panel | `dsc-control.yaml` → common + `dsc-control-ha-bus.yaml` | **6.1.0.0** | `.177` |
| Pots 1–4 | `dsc-pot{N}.yaml` → pot-common (Modbus 2026.8) | **6.1.0.0** | `.181` / `.182` / `.183` / `.49` |
| Bridge | `dsc-bridge.yaml` → ethernet-only | **6.1.0.0** | eth `.66` |
| Sonoffs | heater / heatmat / humidifier / de-humidifier | **6.1.0.0** | `.50` / `.51` / `.54` / `.184` |
| Kits | `*-kit.yaml` SoftAP product path | kit train | SoftAP `192.168.4.x` |
| Sync add-on | `dsc-hub-sync/` | **5.1.3+** | — |
| HA surface | `sensor.dsc_ha_surface_version` | **7.2.0** | — |

USB flash order (lab cutover): hub → Pot2 canary → pots → Sonoffs → panel → soak → prove OTA → **bridge SoftAP off last**. Living backlog: [`docs/FOLLOWUPS.md`](docs/FOLLOWUPS.md).

---

## Home Assistant surfaces

| Piece | Path |
|---|---|
| Sync add-on | [`dsc-hub-sync/`](dsc-hub-sync/) (**5.1.4+** ships Build a Plant + catalog) |
| Lovelace (Pro) | `homeassistant/dashboards/dsc-hub-v4-dashboard.yaml` → URL **`dsc-hub-pro`** |
| Lovelace (Build a Plant) | `homeassistant/dashboards/dsc-build-plant-dashboard.yaml` → URL **`dsc-build-plant`** |
| Packages | `homeassistant/packages/dsc_v4_*.yaml` (incl. `dsc_v4_panel_ha_bus.yaml`) |
| Config snippet | `homeassistant/configuration.snippet.yaml` (Pro + Build a Plant) |
| ESPHome stubs | `homeassistant/esphome/dsc-*.yaml` |

After Sync lands new `input_*` helpers: **restart HA Core once**.

Set notify target: `input_text.dsc_notify_service` (e.g. `notify.mobile_app_your_phone`).

---

## Secrets & radios

```bash
cd firmware/v4
cp secrets.yaml.template secrets.yaml   # or ./generate-secrets.sh
```

Never commit `secrets.yaml`. Studio Wi-Fi lives in Notion **API Keys & Credentials**
and gitignored secrets only — not in FOLLOWUPS or git.

**Lab:** Native API on studio LAN. **Kit:** SoftAP + ESP-NOW pairing still documented in SETUP.
`espnow_cmd_tag` **54727** kept for parked / kit builds.

Sonoffs have no ESP-NOW — demand followers need HA (lab primary path).

## Validate

```bash
# N-008: compile from local tree, not the UNC repo
cd C:\Users\cmgwe\esphome-dsc\v4
esphome version   # expect 2026.8.0
esphome config dsc-hub.yaml
esphome config dsc-control.yaml
esphome config dsc-pot1.yaml
esphome config dsc-heater.yaml
esphome config dsc-bridge.yaml
```

## Flash order (lab USB cutover)

1. Hub · 2. Pot2 canary · 3. Pot1/4/3 · 4. Sonoffs · 5. Panel · 6. Bridge last (SoftAP off)
After soak + one wireless Install each of ESP32 + Sonoff, **OTA is the path**.

Firmware Install is always **manual**. Sync never auto-flashes. The fleet version
chip stays `warn`/`error` until every device reports **6.1.0.0**.
