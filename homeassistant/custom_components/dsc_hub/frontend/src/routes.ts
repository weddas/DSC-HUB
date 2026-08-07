export type PrimarySection = "ops" | "plant" | "advanced" | "system";

export interface TabRoute {
  id: string;
  label: string;
  path: string;
  icon: string;
}

export const PRIMARY_TABS: { id: PrimarySection; label: string; path: string; icon: string }[] = [
  { id: "ops", label: "Ops", path: "/ops", icon: "ops" },
  { id: "plant", label: "Plant", path: "/plant", icon: "plant" },
  { id: "advanced", label: "Advanced", path: "/advanced", icon: "advanced" },
  { id: "system", label: "System", path: "/system", icon: "system" },
];

export const SECONDARY_TABS: Record<PrimarySection, TabRoute[]> = {
  ops: [
    { id: "home", label: "Home", path: "/ops/home", icon: "home" },
    { id: "dash", label: "Dash", path: "/ops/dash", icon: "dash" },
    { id: "climate", label: "Climate", path: "/ops/climate", icon: "climate" },
    { id: "main-4x8", label: "Main 4×8", path: "/ops/main-4x8", icon: "tent" },
    { id: "clone-2x4", label: "Clone 2×4", path: "/ops/clone-2x4", icon: "clone" },
    { id: "root-zone", label: "Root zone", path: "/ops/root-zone", icon: "root" },
    { id: "tank", label: "Tank", path: "/ops/tank", icon: "tank" },
    { id: "lighting", label: "Lighting", path: "/ops/lighting", icon: "lighting" },
  ],
  plant: [
    { id: "hub", label: "Hub", path: "/plant", icon: "plant" },
    { id: "build", label: "Build", path: "/plant/build", icon: "build" },
    { id: "catalog", label: "Catalog", path: "/plant/catalog", icon: "catalog" },
    { id: "strains", label: "Strains", path: "/plant/strains", icon: "strains" },
    { id: "nutrient", label: "Nutrient science", path: "/plant/nutrient", icon: "nutrient" },
  ],
  advanced: [
    { id: "learning", label: "Learning", path: "/advanced/learning", icon: "learning" },
    { id: "trends", label: "Trends", path: "/advanced/trends", icon: "trends" },
    { id: "history", label: "History", path: "/advanced/history", icon: "history" },
  ],
  system: [{ id: "overview", label: "Overview", path: "/system", icon: "system" }],
};

export function sectionFromPath(pathname: string): PrimarySection {
  if (pathname.includes("/plant")) return "plant";
  if (pathname.includes("/advanced")) return "advanced";
  if (pathname.includes("/system")) return "system";
  return "ops";
}
