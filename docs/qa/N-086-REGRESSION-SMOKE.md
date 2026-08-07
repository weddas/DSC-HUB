# N-086 regression smoke — product shell + non-DSC surfaces

Date: 2026-08-07. Live HA `192.168.86.3` (2026.8.0).

## Verdict

**No damage found** to non-DSC dashboards, HACS cards, or unrelated integrations.
DSC product shell navigation + entity helpers behave as intended.

## DSC-HUB shell

| Check | Result |
|---|---|
| Primary tabs Ops · Plant · Advanced · System | OK |
| All 19 Pro paths (ops…history) + redirect stub | Loaded; no custom-element / card-config errors |
| Catalog → Use in Build | Seeds `input_text.dsc_build_strain` (`Blue Dream`) → `/plant-build` |
| Surface | `sensor.dsc_ha_surface_version` = **5.1.12** |
| Catalog / mix / light helpers | Present (`strain_catalog`, `mix_calculator`, `dsc_light_fixture=SF1000`) |
| Hub offline | Pre-existing (`dsc_hub_uptime` / panel link unavailable) — not a shell regression |

## Non-DSC surfaces

| Surface | Result |
|---|---|
| Overview + all Overview tabs (Lighting…Energy Dash) | OK, zero card-load errors |
| Devices / Network / Home-Lighting-Control / Weather / Garden Care | OK |
| Energy / History / Activity / Media / Calendar / To-do / Settings / HACS | OK |
| Frigate / Music Assistant / ESPHome Builder / File editor / WashData / Node-RED / Tailscale / Sonorium | Panels resolve with correct titles; no card errors |
| Lovelace resources | **60/60** vs N-085 backup; only DSC cache-buster query strings changed |
| Config check | `ha core check` passed |
| Integrations / entities | 198 config entries, ~13k registry entities, 41 custom_components (frigate, hacs, mass_queue present) |

## Honesty notes

- Many `unavailable` states (hub ESP, some lights/media) predate N-086; shell still renders.
- `dsc-build-plant` panel remains registered with `show_in_sidebar: false` (redirect stub by design).
