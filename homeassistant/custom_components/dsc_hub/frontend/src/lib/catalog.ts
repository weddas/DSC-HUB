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

/** Same-origin on Pi SPA so /v1/media/assets/* hits brain proxy. */
export function catalogMediaBase(state: (id: string, fallback?: string) => string): string {
  if (PI_MODE) return "";
  return cannalibBase(state);
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

export type StrainTypeFilter = "all" | "indica" | "sativa" | "hybrid";
export type StrainFormatFilter = "all" | "auto" | "photo";

export interface StrainSearchFilters {
  type: StrainTypeFilter;
  format: StrainFormatFilter;
  breeder: string;
}

export const DEFAULT_STRAIN_FILTERS: StrainSearchFilters = {
  type: "all",
  format: "all",
  breeder: "",
};

function strainFormat(item: CatalogItem): "auto" | "photo" | "unknown" {
  const name = itemName(item).toLowerCase();
  if (/\bauto[\s-]?(flower|fem|seeds?)?s?\b/.test(name)) return "auto";
  if (/\b(fem|regular|photoperiod)\b/.test(name)) return "photo";
  return "unknown";
}

/** Client-side strain filters — API only accepts q/limit. */
export function filterStrainItems(items: CatalogItem[], filters: StrainSearchFilters): CatalogItem[] {
  const breederNeedle = filters.breeder.trim().toLowerCase();
  return items.filter((item) => {
    if (filters.type !== "all") {
      const t = String(item.type ?? "").toLowerCase();
      if (!t.includes(filters.type)) return false;
    }
    const fmt = strainFormat(item);
    if (filters.format === "auto" && fmt !== "auto") return false;
    if (filters.format === "photo" && fmt === "auto") return false;
    if (breederNeedle) {
      const breeder = String(item.breeder ?? item.brand ?? "").toLowerCase();
      const name = itemName(item).toLowerCase();
      if (!breeder.includes(breederNeedle) && !name.includes(breederNeedle)) return false;
    }
    return true;
  });
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

async function searchLocal(
  kind: CatalogKind,
  q: string,
  limit = 50,
  offset = 0,
): Promise<CatalogItem[]> {
  const r = await fetch(INDEX_FILE[kind], { cache: "no-store" });
  if (!r.ok) return [];
  const items = asItems(await r.json());
  const needle = q.trim().toLowerCase();
  const matched = !needle
    ? items
    : items.filter((it) => {
        const name = itemName(it).toLowerCase();
        const type = String(it.type ?? "").toLowerCase();
        const breeder = String(it.breeder ?? it.brand ?? "").toLowerCase();
        const summary = String(it.summary ?? "").toLowerCase();
        return (
          name.includes(needle) ||
          type.includes(needle) ||
          breeder.includes(needle) ||
          summary.includes(needle)
        );
      });
  return matched.slice(offset, offset + limit);
}

export async function searchCatalog(
  kind: CatalogKind,
  q: string,
  state: (id: string, fallback?: string) => string,
  limit = 50,
  offset = 0,
): Promise<CatalogSearchResult> {
  const pageNote = offset > 0 ? ` · offset ${offset}` : "";
  if (PI_MODE) {
    try {
      const domain = API_KIND[kind];
      const url = `/v1/catalogs/${domain}?q=${encodeURIComponent(q || "")}&limit=${limit}&offset=${offset}`;
      const r = await fetch(url, { cache: "no-store" });
      if (!r.ok) throw new Error(`brain catalog ${r.status}`);
      const items = preferScienceAliasHits(filterKind(kind, asItems(await r.json())), q);
      return {
        items,
        source: "cannalib",
        note: `Brain catalog proxy (Settings → CannaLib API URL)${pageNote}`,
      };
    } catch {
      const local = preferScienceAliasHits(filterKind(kind, await searchLocal(kind, q, limit, offset)), q);
      return {
        items: local,
        source: "local",
        note: `Brain proxy unreachable — local JSON index${pageNote}`,
      };
    }
  }
  try {
    const domain = API_KIND[kind];
    const url = `${cannalibBase(state)}/v1/catalogs/${domain}?q=${encodeURIComponent(q || "")}&limit=${limit}&offset=${offset}`;
    const r = await fetch(url, { headers: cannalibHeaders(state), cache: "no-store" });
    if (!r.ok) throw new Error(`cannalib ${r.status}`);
    const items = preferScienceAliasHits(filterKind(kind, asItems(await r.json())), q);
    if (items.length || kind === "strain") {
      return {
        items,
        source: "cannalib",
        note: `CannaLib live${pageNote}`,
      };
    }
  } catch {
    /* local fallback */
  }
  const local = preferScienceAliasHits(filterKind(kind, await searchLocal(kind, q, limit, offset)), q);
  return {
    items: local,
    source: "local",
    note: `CannaLib unreachable — local JSON index${pageNote}`,
  };
}

/** Licensed strain tree hydrate (media + lineage). Honest blank when media.n=0. */
export async function fetchStrainDetail(
  strainId: string,
  state: (id: string, fallback?: string) => string,
): Promise<Record<string, unknown> | null> {
  const id = encodeURIComponent(strainId);
  if (PI_MODE) {
    try {
      const r = await fetch(`/v1/catalogs/strains/${id}`, { cache: "no-store" });
      if (!r.ok) return null;
      return (await r.json()) as Record<string, unknown>;
    } catch {
      return null;
    }
  }
  try {
    const r = await fetch(`${cannalibBase(state)}/v1/catalogs/strains/${id}`, {
      headers: cannalibHeaders(state),
      cache: "no-store",
    });
    if (!r.ok) return null;
    return (await r.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** Prefer same-origin local crops; refuse manufacturer CDN hotlinks. */
export function localPpfdMapUrl(item: CatalogItem | null | undefined): string | null {
  if (!item) return null;
  const candidates = [item.ppfd_url, item.spectrum_url, item.ppfd_local_url]
    .map((u) => String(u ?? "").trim())
    .filter(Boolean);
  for (const src of candidates) {
    if (
      src.startsWith("/local/dsc-catalog/ppfd/") ||
      src.startsWith("/dsc-catalog/ppfd/") ||
      src.startsWith("/media/ppfd/")
    ) {
      // Normalize HA /local path to Pi-served /dsc-catalog path when both exist
      if (src.startsWith("/local/dsc-catalog/")) {
        return src.replace("/local/dsc-catalog/", "/dsc-catalog/");
      }
      return src;
    }
    if (src.startsWith("ppfd/") || src.startsWith("./ppfd/")) {
      return `/dsc-catalog/${src.replace(/^\.\//, "")}`;
    }
  }
  return null;
}

export function hasLocalPpfdMap(item: CatalogItem | null | undefined): boolean {
  return localPpfdMapUrl(item) != null;
}

/** Kit fixture id → local crop path from shipped manifest (SPA + Pi static). */
let ppfdManifestCache: Record<string, { local_path?: string; file?: string }> | null = null;

export async function loadPpfdManifest(): Promise<Record<string, { local_path?: string; file?: string }>> {
  if (ppfdManifestCache) return ppfdManifestCache;
  try {
    const r = await fetch("/dsc-catalog/ppfd/manifest.json", { cache: "no-store" });
    if (!r.ok) {
      ppfdManifestCache = {};
      return ppfdManifestCache;
    }
    ppfdManifestCache = (await r.json()) as Record<string, { local_path?: string; file?: string }>;
  } catch {
    ppfdManifestCache = {};
  }
  return ppfdManifestCache;
}

/** Resolve kit light → local PPFD crop via manifest name/id hints. */
export function resolveKitPpfdUrl(
  item: CatalogItem | null | undefined,
  manifest: Record<string, { local_path?: string; file?: string }>,
): string | null {
  const direct = localPpfdMapUrl(item);
  if (direct) return direct;
  if (!item || !manifest) return null;
  const name = String(item.name || "").toLowerCase();
  const id = String(item.id || "").toLowerCase();
  const hints: [string, RegExp][] = [
    ["spider_farmer_sf1000", /sf[\s_-]?1000/],
    ["spider_farmer_sf2000", /sf[\s_-]?2000/],
    ["spider_farmer_se7000", /se[\s_-]?7000/],
    ["mars_hydro_ts1000", /ts[\s_-]?1000/],
  ];
  for (const [fid, re] of hints) {
    if (re.test(name) || re.test(id)) {
      const meta = manifest[fid];
      if (!meta) continue;
      if (meta.file) return `/dsc-catalog/ppfd/${meta.file}`;
      if (meta.local_path) {
        return String(meta.local_path).replace("/local/dsc-catalog/", "/dsc-catalog/");
      }
    }
  }
  return null;
}
