# Local webserver UI (Pi SPA)

**In one line:** Thin client of the brain API — presentation, advanced control, updates. Brain remains truth.

Notion: [Local webserver UI](https://app.notion.com/p/3b52b4cda37081c19048e794d4bdf819)

## Tip (`e66f136` — 7.4 WiP)

| | |
|---|---|
| Surface | Still **7.3.0** until Phase E `7.4.0` |
| SPA bundle (spa-dist) | `index-DRfGbdor` (+ `tune-fleet-BAlAwrDX` · `calibrate-bAnlu7dA` · `twin-three-CeTvdkW_` · `AirflowParticleScene`) |
| Default landing | `#/live/overview` |
| Demo | `#` same routes; banner when `GET /health` → `mode=demo` — [`DEMO-MODE.md`](DEMO-MODE.md) |

## Primary sections

| Section | Default path | Job |
|---------|--------------|-----|
| Live | `/live/overview` | Fleet vitals, climate, tents, root, light, demoted twin/mission/dash |
| Grow | `/grow/roster` | Compose (Plant Wizard), research, roster |
| Tune | `/tune/learning` | Learning + analytics |
| Fleet | `/fleet` | Overview, calibrate, settings |

Secondary Live tabs demote Twin / Mission / Dash (`demoted: true` in `routes.ts`) so Overview + Climate + tents stay primary.

## 7.4 SPA surfaces (software)

| Surface | Notes |
|---------|-------|
| Photoperiod timeline | Light page 24h strips — [`PHOTOPERIOD-TIMELINE.md`](PHOTOPERIOD-TIMELINE.md) |
| Airflow particle viz | Climate “Air path” lazy R3F scaffold — [`AIRFLOW-VIZ-7.4.md`](../qa/AIRFLOW-VIZ-7.4.md); SVG `AirPathMap` + FlowSankey still present |
| Demo banner | `DemoBanner` polls `/health` |
| Rehome checklist / DLI / grow-log filter | UX polish on tip; no separate runbook yet |

## API dependency (canonical)

Reads/writes go through brain HTTP (`brain/dsc_brain/api.py`):

- `GET /health` · `GET /fleet` · `GET /fleet/computed` · `WS /ws/fleet`
- `POST /control/service` · `POST /control/demand`
- Settings, catalogs, history, grow-log, decision tick

In demo mode, hardware/network apply endpoints return **403** — see [`DEMO-MODE.md`](DEMO-MODE.md).

## Host

- Live Pi: `http://dsc-brain.local:8787` or `10.42.0.1:8787` / studio `.48`
- Public demo compose: host **8788** → container 8787

## Non-goals

- Browser owning catalog DB or Want/Need math as SoT
- Reviving Lovelace YAML as product UI ([archive](../archive/lovelace-7.3/))

## Related

- [`DEMO-MODE.md`](DEMO-MODE.md) · [`DECISION_LOOP.md`](DECISION_LOOP.md) · [`../DSC-BRAIN.md`](../DSC-BRAIN.md)
- Deploy / hash sync: [`../ops/DSC-HUB-DOCKER.md`](../ops/DSC-HUB-DOCKER.md)
