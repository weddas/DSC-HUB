# DSC-HUB — HACS Dashboard plugin

Published from [`dist/`](.). Source of truth: [`homeassistant/www/`](../homeassistant/www/)
(separate card sources).

After editing a card or SVG, run:

```bash
./scripts/sync-hacs-dist.sh
```

Or push to `master` and let [`.github/workflows/hacs-dist.yml`](../.github/workflows/hacs-dist.yml) sync.

## What lands in `dist/`

| File | Contents |
|---|---|
| `DSC-HUB.js` | **Bundle** = system map + airflow (HACS resource name) |
| `dsc-system-map-card.js` | **Same bundle** under the legacy `/local` filename |
| `dsc-airflow-map-card.js` | Standalone airflow source (optional / debug) |
| `dsc-system-map.svg` | SYSTEM MAP artwork |

`dsc-system-map-card.js` in `dist/` is **not** a copy of the www system-map
source alone — it is the concatenated bundle so existing Lovelace resources
named `/local/dsc-system-map-card.js` register both custom elements.

Install / triage: [`../scripts/HACS-FRONTEND.md`](../scripts/HACS-FRONTEND.md).
Topology + pitfalls: [`../homeassistant/README.md`](../homeassistant/README.md).
