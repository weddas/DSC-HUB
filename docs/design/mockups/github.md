repo: weddas/DSC-HUB
branch: master
path: frontend/src

## Last sync
date: 2026-09-06T12:40:00Z

### Updated in this project
- DSC-HUB v2.dc.html: full-app mockups from uploads/DSC-HUB_Mockup_Prompt.md (Overview home/facility/empty, Climate, Steering, Lighting, Propagation, Post-harvest, CannaLib, Alerts, Settings, 3 mobile, component sheet)
- Turn 3 (3a–3c): data-viz compositions built on charts.tsx / PhotoperiodTimeline primitives
- Turn 2 (2a–2c): Overview variants inspired by matt8707/hass-config, UI-Lovelace-Minimalist, ha-fusion and docs/assets/inspiration
- Lifted real brand mark + tab/card icons from frontend/src/iconSvg.ts
- Read SPA design system (.superdesign/design-system.md), routes, Overview/Fleet pages, ui.tsx primitives
- Copied 5 QA reference screenshots (docs/qa/screens-7.1.2)
- Built DSC-HUB Mockups.dc.html: Dashboard, Resources, Settings, Fleet/Admin options (desktop + mobile)

## Screen map
| Screen | Repo files |
|---|---|
| v2 all screens | frontend/src/pages/*, frontend/src/viz/charts.tsx, .superdesign/design-system.md, data/*.yaml |
| Dashboard (1a–1c) | frontend/src/pages/OverviewPage.tsx, frontend/src/components/DashHomeSections.tsx, frontend/src/App.tsx |
| Resources (1d–1f) | frontend/src/pages/GrowPages.tsx, frontend/src/components/CatalogResearch.tsx, data/*.yaml |
| Settings (1g–1h) | frontend/src/pages/SettingsPage.tsx, frontend/src/components/settings/* |
| Admin / Fleet (1i–1j) | frontend/src/pages/TuneFleetPages.tsx, frontend/src/components/KitPulse.tsx, frontend/src/components/HubLinkLine.tsx |
| Data viz (3a–3c) | frontend/src/viz/charts.tsx, frontend/src/components/PhotoperiodTimeline.tsx, frontend/src/components/DutyStrip.tsx |
| Overview v2 (2a–2c) | docs/assets/inspiration/*, frontend/src/pages/OverviewPage.tsx |
| Chrome / tokens / icons | frontend/src/routes.ts, frontend/src/components/ui.tsx, frontend/src/iconSvg.ts, .superdesign/design-system.md |
