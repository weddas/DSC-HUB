# DSC-HUB — HACS Dashboard plugin

Published from [`dist/`](dist/). Source of truth: [`homeassistant/www/`](../homeassistant/www/).

`DSC-HUB.js` is the concatenated HACS resource:

- `dsc-system-map-card.js` → `custom:dsc-system-map-card`
- `dsc-airflow-map-card.js` → `custom:dsc-airflow-map-card`

Individual files stay in `dist/` for `/local` manual installs. After editing
www cards or the SVG, run:

```bash
./scripts/sync-hacs-dist.sh
```

Or push to `master` and let [`.github/workflows/hacs-dist.yml`](../.github/workflows/hacs-dist.yml) sync.

Install + redownload pitfalls: [`../scripts/HACS-FRONTEND.md`](../scripts/HACS-FRONTEND.md).
Topology / blend runbook: [`../homeassistant/README.md`](../homeassistant/README.md).
