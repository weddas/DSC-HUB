# Pages — render dependency trees

Recursive local JSX imports. Hooks/lib with no JSX omitted. Paths from `homeassistant/custom_components/dsc_hub/frontend/`.
All ten pages sit in `Shell` (`src/App.tsx`). Inspector/BandChart hosts are App-level providers; listed where the page opens them.

---

## 1. `/ops/home` — DashHomePage (DESIGN TARGET)

`src/pages/DashHomePage.tsx` — legacy Lovelace-parity dump. Demoted Live tab.

```
src/pages/DashHomePage.tsx
  src/components/ui.tsx
    src/components/DecisionLayer.tsx
      src/components/ui.tsx
  src/components/HelpTip.tsx
  src/components/AirPathMap.tsx
    src/components/CfmBadge.tsx
      src/components/ui.tsx
    src/components/ui.tsx
    src/components/InspectorHost.tsx
      src/components/EntityInspector.tsx
        src/components/chrome.tsx
          src/components/ui.tsx
          src/components/VesselGlyph.tsx
        src/components/ui.tsx
        src/components/DecisionLayer.tsx
        src/viz/charts.tsx
          src/viz/EChart.tsx
        src/components/HistoryDrawer.tsx
          src/components/chrome.tsx
          src/viz/charts.tsx
          src/components/ui.tsx
        src/components/DutyStrip.tsx
  src/components/HubLinkLine.tsx
    src/components/ui.tsx
    src/components/HelpTip.tsx
  src/components/KitPulse.tsx
    src/components/ui.tsx
  src/components/CfmBadge.tsx
    src/components/ui.tsx
  src/components/DashHomeSections.tsx
    src/components/ui.tsx
    src/viz/charts.tsx
      src/viz/EChart.tsx
    src/components/TentLightClock.tsx
      src/components/ui.tsx
  src/components/InspectorHost.tsx
    src/components/EntityInspector.tsx
      … (see AirPathMap branch)
  src/components/BandChartHost.tsx
    src/components/chrome.tsx
    src/components/HistoryDrawer.tsx
    src/components/ui.tsx
    src/viz/charts.tsx
      src/viz/EChart.tsx
```

DashHomeSections exports used by this page: `DashNowStrip`, `DashCannalibTiles`, `DashConditionalBanners`, `DashEspLinkChips`, `DashRunningChips`, `DashFanChips`, `DashGrowLog`, `DashOperationalNow`, `DashBandsGrid`, `DashTodaySection`, `DashRootTankSection`, `activeAlertIds`, `fmtUptime`.

Page-local primitives: `Button`, `Card`, `Kpi`, `PageHeader`, `HelpTip`, `AirPathMap`, `HubLinkLine`, `KitPulse`, `CfmTrustLine`.

---

## 2. `/live/overview` — OverviewPage

`src/pages/OverviewPage.tsx`

```
src/pages/OverviewPage.tsx
  src/components/ui.tsx
    src/components/DecisionLayer.tsx
      src/components/ui.tsx
  src/components/DashHomeSections.tsx
    src/components/ui.tsx
    src/viz/charts.tsx
      src/viz/EChart.tsx
    src/components/TentLightClock.tsx
      src/components/ui.tsx
  src/components/TentLightClock.tsx
    src/components/ui.tsx
  src/components/BandChartHost.tsx
    src/components/chrome.tsx
      src/components/ui.tsx
      src/components/VesselGlyph.tsx
    src/components/HistoryDrawer.tsx
      src/components/chrome.tsx
      src/viz/charts.tsx
      src/components/ui.tsx
    src/components/ui.tsx
    src/viz/charts.tsx
      src/viz/EChart.tsx
  src/components/HelpTip.tsx
```

DashHomeSections used: `activeAlertIds`, `DashBandsGrid`, `DashConditionalBanners`, `DashFanChips`, `DashGrowLog`, `DashRootTankSection`, `DashRunningChips`.

---

## 3. `/live/climate` — LiveClimatePage

Export `LiveClimatePage` lives in `src/pages/ClimatePage.tsx` (re-exported from `src/pages/LivePages.tsx`).

```
src/pages/ClimatePage.tsx
  src/components/ui.tsx
    src/components/DecisionLayer.tsx
      src/components/ui.tsx
  src/components/chrome.tsx
    src/components/ui.tsx
    src/components/VesselGlyph.tsx
  src/components/HistoryDrawer.tsx
    src/components/chrome.tsx
    src/viz/charts.tsx
      src/viz/EChart.tsx
    src/components/ui.tsx
  src/components/AirPathMap.tsx
    src/components/CfmBadge.tsx
      src/components/ui.tsx
    src/components/ui.tsx
    src/components/InspectorHost.tsx
      src/components/EntityInspector.tsx
        … (chrome, DecisionLayer, charts, HistoryDrawer, DutyStrip)
  src/components/FlowSankey.tsx
    src/viz/EChart.tsx
    src/viz/charts.tsx
    src/components/ui.tsx
  src/components/CropScheduler.tsx
    src/components/ui.tsx
    src/components/VesselGlyph.tsx
    src/components/TentLightClock.tsx
      src/components/ui.tsx
  src/components/TentTargets.tsx
    src/components/chrome.tsx
    src/components/ui.tsx
    src/components/InspectorHost.tsx
  src/components/InspectorHost.tsx
  src/components/HelpTip.tsx
  src/viz/charts.tsx
    src/viz/EChart.tsx
  src/components/DashHomeSections.tsx   (SHARED_AIR_FAN_PCT, fanPctChip — also TentLightClockStrip/charts)
    src/components/ui.tsx
    src/viz/charts.tsx
    src/components/TentLightClock.tsx
```

---

## 4. `/live/root` — LiveRootPage

Export `LiveRootPage` in `src/pages/RootPage.tsx` (re-exported from `LivePages.tsx`).

```
src/pages/RootPage.tsx
  src/components/ui.tsx
    src/components/DecisionLayer.tsx
      src/components/ui.tsx
  src/components/chrome.tsx
    src/components/ui.tsx
    src/components/VesselGlyph.tsx
  src/components/DutyStrip.tsx
  src/components/SoilTestWizard.tsx
    src/components/ui.tsx
    src/components/DecisionLayer.tsx
  src/components/HelpTip.tsx
  src/components/InspectorHost.tsx
    src/components/EntityInspector.tsx
      … (chrome, DecisionLayer, charts, HistoryDrawer, DutyStrip)
  src/viz/charts.tsx
    src/viz/EChart.tsx
  src/components/VesselGlyph.tsx
  src/pages/GrowPages.tsx  (re-exports PlantSeatPanel)
    src/components/PlantSeatPanel.tsx
      src/components/DecisionLayer.tsx
      src/components/chrome.tsx
      src/components/HistoryDrawer.tsx
        src/components/chrome.tsx
        src/viz/charts.tsx
        src/components/ui.tsx
      src/components/ui.tsx
      src/components/RehomeChecklist.tsx
      src/viz/charts.tsx
        src/viz/EChart.tsx
      src/components/PlantExtra.tsx
        src/components/ui.tsx
      src/components/VesselGlyph.tsx
```

---

## 5. `/live/light` — LiveLightPage

Export `LiveLightPage` in `src/pages/LightPage.tsx` (re-exported from `LivePages.tsx`).

```
src/pages/LightPage.tsx
  src/components/ui.tsx
    src/components/DecisionLayer.tsx
      src/components/ui.tsx
  src/components/CropScheduler.tsx
    src/components/ui.tsx
    src/components/VesselGlyph.tsx
    src/components/TentLightClock.tsx
      src/components/ui.tsx
  src/components/DutyStrip.tsx
  src/components/PhotoperiodTimeline.tsx
  src/components/TentLightClock.tsx
    src/components/ui.tsx
  src/components/TentTargets.tsx
    src/components/chrome.tsx
      src/components/ui.tsx
      src/components/VesselGlyph.tsx
    src/components/ui.tsx
    src/components/InspectorHost.tsx
  src/components/InspectorHost.tsx
    src/components/EntityInspector.tsx
      … (chrome, DecisionLayer, charts, HistoryDrawer, DutyStrip)
  src/components/HelpTip.tsx
  src/viz/charts.tsx
    src/viz/EChart.tsx
```

---

## 6. `/live/mission` — LiveMissionPage

`src/pages/LiveMissionPage.tsx`

```
src/pages/LiveMissionPage.tsx
  src/components/ui.tsx
    src/components/DecisionLayer.tsx
      src/components/ui.tsx
  src/components/chrome.tsx
    src/components/ui.tsx
    src/components/VesselGlyph.tsx
  src/components/Honesty.tsx
    src/components/ui.tsx
    src/components/DecisionLayer.tsx
  src/components/HubLinkLine.tsx
    src/components/ui.tsx
    src/components/HelpTip.tsx
  src/components/HelpTip.tsx
  src/components/VesselGlyph.tsx
  src/components/CfmBadge.tsx
    src/components/ui.tsx
  src/components/KitPulse.tsx
    src/components/ui.tsx
  src/components/InspectorHost.tsx
    src/components/EntityInspector.tsx
      … (chrome, DecisionLayer, charts, HistoryDrawer, DutyStrip)
```

Honesty import is `NextRecommendedCard` (not the rail — rail is Shell).

---

## 7. `/grow/roster` — GrowRosterPage

`src/pages/GrowPages.tsx` (`GrowRosterPage`). File also exports Compose/Research and re-exports `PlantSeatPanel`.

```
src/pages/GrowPages.tsx
  src/components/ComposePlant.tsx          (alias → PlantWizard; used by Compose page)
    src/components/PlantWizard.tsx
      src/components/CatalogPicker.tsx
        src/components/ui.tsx
      src/components/CoupledMix.tsx
        src/components/ui.tsx
      src/components/DecisionLayer.tsx
      src/components/VesselGlyph.tsx
      src/components/ui.tsx
      src/components/TentTargets.tsx
        src/components/chrome.tsx
        src/components/ui.tsx
        src/components/InspectorHost.tsx
  src/components/CatalogResearch.tsx       (used by Research page)
    src/components/CatalogPicker.tsx
      src/components/ui.tsx
    src/components/ui.tsx
  src/components/DecisionLayer.tsx
    src/components/ui.tsx
  src/components/chrome.tsx
    src/components/ui.tsx
    src/components/VesselGlyph.tsx
  src/components/ui.tsx
  src/components/HelpTip.tsx
  src/components/PlantSeatPanel.tsx
    src/components/DecisionLayer.tsx
    src/components/chrome.tsx
    src/components/HistoryDrawer.tsx
      src/components/chrome.tsx
      src/viz/charts.tsx
        src/viz/EChart.tsx
      src/components/ui.tsx
    src/components/ui.tsx
    src/components/RehomeChecklist.tsx
    src/viz/charts.tsx
    src/components/PlantExtra.tsx
      src/components/ui.tsx
    src/components/VesselGlyph.tsx
  src/components/VesselGlyph.tsx
  src/components/CropScheduler.tsx
    src/components/ui.tsx
    src/components/VesselGlyph.tsx
    src/components/TentLightClock.tsx
      src/components/ui.tsx
```

---

## 8. `/fleet` — FleetOverviewPage

`src/pages/TuneFleetPages.tsx` (`FleetOverviewPage`). Lazy from `src/routes.ts`.

```
src/pages/TuneFleetPages.tsx
  src/components/ui.tsx
    src/components/DecisionLayer.tsx
      src/components/ui.tsx
  src/components/HelpTip.tsx
  src/components/InventoryInServiceToggle.tsx
    src/components/DecisionLayer.tsx
    src/components/ui.tsx
  src/components/HistoryDrawer.tsx
    src/components/chrome.tsx
      src/components/ui.tsx
      src/components/VesselGlyph.tsx
    src/viz/charts.tsx
      src/viz/EChart.tsx
    src/components/ui.tsx
  src/components/LearningWizard.tsx
    src/components/ui.tsx
    src/components/DecisionLayer.tsx
    src/components/TentTargets.tsx
      src/components/chrome.tsx
      src/components/ui.tsx
      src/components/InspectorHost.tsx
  src/components/TankCutaway.tsx
    src/components/ui.tsx
  src/components/KitPulse.tsx
    src/components/ui.tsx
  src/components/HubLinkLine.tsx
    src/components/ui.tsx
    src/components/HelpTip.tsx
  src/components/CfmBadge.tsx
    src/components/ui.tsx
  src/viz/charts.tsx
    src/viz/EChart.tsx
  src/components/InspectorHost.tsx
    src/components/EntityInspector.tsx
      … (chrome, DecisionLayer, charts, HistoryDrawer, DutyStrip)
```

Fleet page itself uses: `PageHeader`, `HelpTip`, `HubLinkLine`, `Kpi`, `KitPulse`, `TankCutaway`, `InventoryInServiceToggle`, `CfmTrustLine`. LearningWizard/HistoryDrawer/MultiLineChart sit on sibling Tune pages in the same module.

---

## 9. `/settings/:section` — SettingsPage

`src/pages/SettingsPage.tsx` — hub/brain/device/api/network/server/general. Mostly local JSX + shared primitives; fleet/zigbee via `fleetApi` (no JSX).

```
src/pages/SettingsPage.tsx
  src/components/ui.tsx
    src/components/DecisionLayer.tsx
      src/components/ui.tsx
  src/components/HelpTip.tsx
  src/components/DecisionLayer.tsx
    src/components/ui.tsx
```

---

## 10. `/tune/learning` — TuneLearningPage

`src/pages/TuneFleetPages.tsx` (`TuneLearningPage`). Lazy from `src/routes.ts`.

```
src/pages/TuneFleetPages.tsx
  src/components/ui.tsx
    src/components/DecisionLayer.tsx
      src/components/ui.tsx
  src/components/HelpTip.tsx
  src/components/LearningWizard.tsx
    src/components/ui.tsx
    src/components/DecisionLayer.tsx
    src/components/TentTargets.tsx
      src/components/chrome.tsx
        src/components/ui.tsx
        src/components/VesselGlyph.tsx
      src/components/ui.tsx
      src/components/InspectorHost.tsx
        src/components/EntityInspector.tsx
          … (chrome, DecisionLayer, charts, HistoryDrawer, DutyStrip)
```

`TuneLearningPage` body is `PageHeader` + `LearningWizard`. Sibling exports in the same file (`TuneAnalyticsPage`, `FleetOverviewPage`) pull HistoryDrawer/TankCutaway/KitPulse/HubLinkLine/CfmBadge/charts — listed under `/fleet` above.
