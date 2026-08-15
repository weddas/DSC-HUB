export type CatalogKind = "strain" | "medium" | "nutrient" | "light";

export type CatalogSource = "cannalib" | "local";

export interface CatalogItem {
  id?: string;
  name: string;
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
  matched_via?: string;
  [key: string]: unknown;
}

export interface CatalogSearchResult {
  items: CatalogItem[];
  source: CatalogSource;
  note: string;
}

const CANNALIB_DEFAULT = "https://cannalib.plausible-deniability.net";

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

async function searchLocal(kind: CatalogKind, q: string): Promise<CatalogItem[]> {
  const r = await fetch(INDEX_FILE[kind], { cache: "no-store" });
  if (!r.ok) return [];
  const items = asItems(await r.json());
  const needle = q.trim().toLowerCase();
  if (!needle) return items.slice(0, 40);
  return items.filter((it) => itemName(it).toLowerCase().includes(needle)).slice(0, 40);
}

export async function searchCatalog(
  kind: CatalogKind,
  q: string,
  state: (id: string, fallback?: string) => string,
  limit = 24,
): Promise<CatalogSearchResult> {
  try {
    const domain = API_KIND[kind];
    const url = `${cannalibBase(state)}/v1/catalogs/${domain}?q=${encodeURIComponent(q || "")}&limit=${limit}`;
    const r = await fetch(url, { headers: cannalibHeaders(state), cache: "no-store" });
    if (!r.ok) throw new Error(`cannalib ${r.status}`);
    const items = asItems(await r.json()).slice(0, limit);
    if (items.length || kind === "strain") {
      return {
        items,
        source: "cannalib",
        note: "Cannalib full corpus",
      };
    }
  } catch {
    /* local fallback */
  }
  const local = await searchLocal(kind, q);
  return {
    items: local,
    source: "local",
    note: "Cannalib unreachable — local JSON index (capped)",
  };
}
