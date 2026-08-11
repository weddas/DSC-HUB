const ASSET_BASE = "/dsc_hub/assets";

const ICONS = {
  // Primary 7.0
  live: "icons/dsc-icon-ops.svg",
  grow: "icons/dsc-icon-plant.svg",
  tune: "icons/dsc-icon-advanced.svg",
  fleet: "icons/dsc-icon-system.svg",
  // Live
  mission: "icons/dsc-icon-home.svg",
  twin: "icons/dsc-icon-dash.svg",
  climate: "icons/dsc-icon-climate.svg",
  root: "icons/dsc-icon-root.svg",
  lighting: "icons/dsc-icon-lighting.svg",
  tent: "icons/dsc-icon-tent.svg",
  clone: "icons/dsc-icon-clone.svg",
  tank: "icons/dsc-icon-tank.svg",
  seat: "icons/dsc-icon-seat.svg",
  // Grow
  compose: "icons/dsc-icon-build.svg",
  research: "icons/dsc-icon-catalog.svg",
  roster: "icons/dsc-icon-strains.svg",
  nutrient: "icons/dsc-icon-nutrient.svg",
  // Tune
  learning: "icons/dsc-icon-learning.svg",
  analytics: "icons/dsc-icon-trends.svg",
  history: "icons/dsc-icon-history.svg",
  // Chrome
  alert: "icons/dsc-icon-alert.svg",
  ok: "icons/dsc-icon-ok.svg",
  settings: "icons/dsc-icon-settings.svg",
  brand: "brand/dsc-brand-mark.svg",
  wordmark: "brand/dsc-brand-wordmark.svg",
  gauge: "gauges/dsc-gauge-arc.svg",
  more: "icons/dsc-icon-more.svg",
  search: "icons/dsc-icon-search.svg",
  close: "icons/dsc-icon-close.svg",
  // Legacy aliases (redirect era / old call sites)
  ops: "icons/dsc-icon-ops.svg",
  plant: "icons/dsc-icon-plant.svg",
  advanced: "icons/dsc-icon-advanced.svg",
  system: "icons/dsc-icon-system.svg",
  home: "icons/dsc-icon-home.svg",
  dash: "icons/dsc-icon-dash.svg",
  build: "icons/dsc-icon-build.svg",
  catalog: "icons/dsc-icon-catalog.svg",
  strains: "icons/dsc-icon-strains.svg",
  trends: "icons/dsc-icon-trends.svg",
} as const;

export type IconName = keyof typeof ICONS;

export function iconUrl(name: IconName): string {
  return `${ASSET_BASE}/${ICONS[name]}`;
}
