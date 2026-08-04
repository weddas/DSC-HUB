# DSC-HUB — HACS Dashboard plugin

Published from [`dist/`](.). Source of truth: [`homeassistant/www/`](../homeassistant/www/).

`DSC-HUB.js` / `dsc-system-map-card.js` is the **concat bundle**:

1. `dsc-system-map-card.js` (~10 KB source)
2. `dsc-airflow-map-card.js` (~50 KB)
3. `vendor/three.min.js` (~670 KB)
4. `dsc-the-dash-card.js` (~72 KB)

Expect the published file ≈ **800 KB**. Standalone airflow / Dash / THREE
copies also ship for debugging; Dash still needs THREE loaded first.

After editing cards under `homeassistant/www/`, run:

```bash
./scripts/sync-hacs-dist.sh
```

Or push to `master` and let [`.github/workflows/hacs-dist.yml`](../.github/workflows/hacs-dist.yml) sync.

Install: [`../scripts/HACS-FRONTEND.md`](../scripts/HACS-FRONTEND.md) ·
ops: [`../docs/qa/LIVE-UI-THE-DASH.md`](../docs/qa/LIVE-UI-THE-DASH.md).
