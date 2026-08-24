export type CatalogKind = "strain" | "medium" | "nutrient" | "light";

export type CatalogSource = "cannalib" | "local";

export interface CatalogItem {
  id?: string;
  name: string;
  kind?: string;
  type?: string;
  summary?: string;
  breeder?: string;
  height_cm_min?: number;
  height_cm_max?: number;
  flowering_days_min?: number;
  flowering_days_max?: number;
  thc_min?: number;
  thc_max?: number;
  dose_ml_l?: number;
  composition?: Record<string, number>;
  ppfd_url?: string;
  spectrum_url?: string;
  category?: string;
  wattage_w?: number;
  efficacy_umol_j?: number;
  has_ppfd?: boolean;
  matched_via?: string;
  science_alias?: string;
  [key: string]: unknown;
}

export interface CatalogSearchResult {
  items: CatalogItem[];
  source: CatalogSource;
  note: string;
}

const CANNALIB_DEFAULT = "https://cannalib.plausible-deniability.net";

const PI_MODE = import.meta.env.VITE_DSC_PI === "1";

const INDEX_FILE: Record<CatalogKind, string> = {
  strain: "/local/dsc-catalog/dsc_strains_search_index.json",
  medium: "/local/dsc-catalog/dsc_mediums_search_index.json",
  nutrient: "/local/dsc-catalog/dsc_nutrients_search_index.json",
  light: "/local/dsc-catalog/dsc_lights_search_index.json",
};

const API_KIND: Record<CatalogKind, string> = {
  strain: "strains",
  medium: "mediums",
  nutrient: "nutrients",
  light: "lights",
};

export function cannalibBase(state: (id: string, fallback?: string) => string): string {
  const u = state("input_text.dsc_cannalib_base_url", "");
  return (u || CANNALIB_DEFAULT).replace(/\/$/, "");
}

export function cannalibHeaders(state: (id: string, fallback?: string) => string): HeadersInit {
  const h: Record<string, string> = { Accept: "application/json" };
  const key = state("input_text.dsc_cannalib_api_key", "");
  if (key && key !== "unknown" && key !== "unavailable") h["X-Cannalib-Key"] = key;
  return h;
}

function asItems(raw: unknown): CatalogItem[] {
  if (Array.isArray(raw)) return raw as CatalogItem[];
  if (raw && typeof raw === "object") {
    const obj = raw as { items?: unknown; strains?: unknown };
    if (Array.isArray(obj.items)) return obj.items as CatalogItem[];
    if (Array.isArray(obj.strains)) return obj.strains as CatalogItem[];
  }
  return [];
}

function itemName(item: CatalogItem): string {
  return String(item.name || item.id || "").trim();
}

/**
 * Strain browse must not list merch SKUs as cultivars.
 * Prefer API `kind === "strain"`; still drop capsules/rosin/mg lots by name.
 * Does not invent alias or SKU tables.
 */
export function isStrainCultivar(item: CatalogItem): boolean {
  const kind = String(item.kind ?? "").trim().toLowerCase();
  if (kind && kind !== "strain" && kind !== "cultivar") return false;
  const name = itemName(item);
  const n = name.toLowerCase();
  if (/\bcapsules?\b/.test(n)) return false;
  if (/\brosin\b/.test(n)) return false;
  if (/\blubricant\b/.test(n)) return false;
  if (/\bthca\s+pebbles?\b/.test(n)) return false;
  if (/\d+\s*mg\b/.test(n)) return false;
  if (/^#+\s*\d+/.test(name.trim())) return false;
  return true;
}

function filterKind(kind: CatalogKind, items: CatalogItem[]): CatalogItem[] {
  if (kind !== "strain") return items;
  return items.filter(isStrainCultivar);
}

/** Rank API science_alias hits first. Never synthesizes alias mappings. */
function preferScienceAliasHits(items: CatalogItem[], q: string): CatalogItem[] {
  const needle = q.trim().toLowerCase();
  if (!needle || items.length < 2) return items;
  const score = (it: CatalogItem): number => {
    const via = String(it.matched_via ?? "").toLowerCase();
    if (via === "science_alias") return 0;
    const alias = String(it.science_alias ?? "").toLowerCase();
    if (
      alias &&
      alias
        .split(/[,;/|]/)
        .some((p) => p.trim() === needle || p.trim().includes(needle))
    ) {
      return 1;
    }
    return 2;
  };
  return [...items].sort((a, b) => score(a) - score(b));
}

async function searchLocal(kind: CatalogKind, q: string): Promise<CatalogItem[]> {
  const r = await fetch(INDEX_FILE[kind], { cache: "no-store" });
  if (!r.ok) return [];
  const items = asItems(await r.json());
  const needle = q.trim().toLowerCase();
  if (!needle) return items;
  return items.filter((it) => itemName(it).toLowerCase().includes(needle));
}

export async function searchCatalog(
  kind: CatalogKind,
  q: string,
  state: (id: string, fallback?: string) => string,
  limit = 100,
): Promise<CatalogSearchResult> {
  if (PI_MODE) {
    try {
      const domain = API_KIND[kind];
      const url = `/v1/catalogs/${domain}?q=${encodeURIComponent(q || "")}&limit=${limit}`;
      const r = await fetch(url, { cache: "no-store" });
      if (!r.ok) throw new Error(`brain catalog ${r.status}`);
      const items = preferScienceAliasHits(filterKind(kind, asItems(await r.json())), q);
      return {
        items,
        source: "cannalib",
        note: "Brain catalog proxy (remote API or local fallback)",
      };
    } catch {
      const local = preferScienceAliasHits(filterKind(kind, await searchLocal(kind, q)), q);
      return {
        items: local,
        source: "local",
        note: "Brain proxy unreachable — local JSON index",
      };
    }
  }
  try {
    const domain = API_KIND[kind];
    const url = `${cannalibBase(state)}/v1/catalogs/${domain}?q=${encodeURIComponent(q || "")}&limit=${limit}`;
    const r = await fetch(url, { headers: cannalibHeaders(state), cache: "no-store" });
    if (!r.ok) throw new Error(`cannalib ${r.status}`);
    const items = preferScienceAliasHits(filterKind(kind, asItems(await r.json())), q);
    if (items.length || kind === "strain") {
      return {
        items,
        source: "cannalib",
        note: "CannaLib live",
      };
    }
  } catch {
    /* local fallback */
  }
  const local = preferScienceAliasHits(filterKind(kind, await searchLocal(kind, q)), q);
  return {
    items: local,
    source: "local",
    note: "CannaLib unreachable — local JSON index",
  };
}
