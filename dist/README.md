# DSC-HUB — HACS Dashboard plugin

Published from [`dist/`](dist/). Source of truth: [`homeassistant/www/`](../homeassistant/www/).

After editing card / FX sources, run:

```bash
./scripts/sync-hacs-dist.sh
```

Or push to `master` and let [`.github/workflows/hacs-dist.yml`](../.github/workflows/hacs-dist.yml)
sync (`chore(hacs): sync dist/ from homeassistant/www`).

Concat order: system-map → airflow → `vendor/three.min.js` → `vendor/dsc-dash-fx.js`
→ the-dash. Expect ~846–852 KB. Offline `www/assets/dash/*.gltf` accents are
**not** packaged here — see [`../docs/qa/LIVE-UI-CFM-ALLOCATED.md`](../docs/qa/LIVE-UI-CFM-ALLOCATED.md).

Install instructions: [`../scripts/HACS-FRONTEND.md`](../scripts/HACS-FRONTEND.md).
