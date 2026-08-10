const ASSET_BASE = "/dsc_hub/assets";

const ICONS = {
  ops: "icons/dsc-icon-ops.svg",
  plant: "icons/dsc-icon-plant.svg",
  advanced: "icons/dsc-icon-advanced.svg",
  system: "icons/dsc-icon-system.svg",
  home: "icons/dsc-icon-home.svg",
  dash: "icons/dsc-icon-dash.svg",
  climate: "icons/dsc-icon-climate.svg",
  tent: "icons/dsc-icon-tent.svg",
  clone: "icons/dsc-icon-clone.svg",
  root: "icons/dsc-icon-root.svg",
  tank: "icons/dsc-icon-tank.svg",
  lighting: "icons/dsc-icon-lighting.svg",
  build: "icons/dsc-icon-build.svg",
  catalog: "icons/dsc-icon-catalog.svg",
  strains: "icons/dsc-icon-strains.svg",
  nutrient: "icons/dsc-icon-nutrient.svg",
  learning: "icons/dsc-icon-learning.svg",
  trends: "icons/dsc-icon-trends.svg",
  history: "icons/dsc-icon-history.svg",
  alert: "icons/dsc-icon-alert.svg",
  ok: "icons/dsc-icon-ok.svg",
  settings: "icons/dsc-icon-settings.svg",
  brand: "brand/dsc-brand-mark.svg",
  wordmark: "brand/dsc-brand-wordmark.svg",
  gauge: "gauges/dsc-gauge-arc.svg",
  more: "icons/dsc-icon-more.svg",
  search: "icons/dsc-icon-search.svg",
  close: "icons/dsc-icon-close.svg",
  seat: "icons/dsc-icon-seat.svg",
} as const;

export type IconName = keyof typeof ICONS;

export function iconUrl(name: IconName): string {
  return `${ASSET_BASE}/${ICONS[name]}`;
}
