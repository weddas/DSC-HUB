# DSC-HUB — HACS Dashboard plugin

Published from [`dist/`](.). Source of truth: [`homeassistant/www/`](../homeassistant/www/).

After editing cards or vendor FX, run:

```bash
./scripts/sync-hacs-dist.sh
```

Or push to `master` and let [`.github/workflows/hacs-dist.yml`](../.github/workflows/hacs-dist.yml) sync.

## Bundle

`DSC-HUB.js` ≡ `dsc-system-map-card.js` — **binary concat**, expect **~846 KB**:

1. `homeassistant/www/dsc-system-map-card.js`
2. `homeassistant/www/dsc-airflow-map-card.js`
3. `homeassistant/www/vendor/three.min.js`
4. `homeassistant/www/vendor/dsc-dash-fx.js`
5. `homeassistant/www/dsc-the-dash-card.js`

Sync add-on **5.1.3** uses the same order and refuses staged files `< 500000`
bytes (F-013). See [`docs/qa/LIVE-UI-WWW-BUNDLE-GUARDS.md`](../docs/qa/LIVE-UI-WWW-BUNDLE-GUARDS.md).

Install: [`../scripts/HACS-FRONTEND.md`](../scripts/HACS-FRONTEND.md).
