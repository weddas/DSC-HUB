import type { CatalogItem, CatalogKind } from "./catalog";

export const NUTRIENT_SLOTS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export type SoilLayer = { name: string; pct: number };

export type SoilPreset = { id: string; label: string; layers: SoilLayer[] };

export const SOIL_PRESETS: SoilPreset[] = [
  {
    id: "coco100",
    label: "100% Coco",
    layers: [
      { name: "Coco coir", pct: 100 },
      { name: "", pct: 0 },
      { name: "", pct: 0 },
    ],
  },
  {
    id: "coco70perl30",
    label: "70/30 Coco · Perlite",
    layers: [
      { name: "Coco coir", pct: 70 },
      { name: "Perlite", pct: 30 },
      { name: "", pct: 0 },
    ],
  },
  {
    id: "living",
    label: "Living soil",
    layers: [
      { name: "Living soil", pct: 100 },
      { name: "", pct: 0 },
      { name: "", pct: 0 },
    ],
  },
  {
    id: "peatperl",
    label: "Peat · Perlite",
    layers: [
      { name: "Peat moss", pct: 70 },
      { name: "Perlite", pct: 30 },
      { name: "", pct: 0 },
    ],
  },
];

type CallService = (domain: string, service: string, data: Record<string, unknown>) => Promise<void> | void;

type EntityState = (id: string, fallback?: string) => string;

export function applyBlendLayers(
  layers: SoilLayer[],
  callService: CallService,
): void {
  for (let n = 1; n <= 3; n++) {
    const part = layers[n - 1];
    void callService("input_text", "set_value", {
      entity_id: `input_text.dsc_blend_component_${n}_name`,
      value: part?.name ?? "",
    });
    void callService("input_number", "set_value", {
      entity_id: `input_number.dsc_blend_pct_${n}`,
      value: part?.pct ?? 0,
    });
  }
}

export function applyCatalogPick(
  kind: CatalogKind,
  item: CatalogItem,
  callService: CallService,
  state: EntityState,
): void {
  if (kind === "strain") {
    void callService("input_text", "set_value", {
      entity_id: "input_text.dsc_build_strain",
      value: item.name,
    });
    return;
  }

  if (kind === "medium") {
    const composition =
      item.composition && typeof item.composition === "object"
        ? Object.entries(item.composition)
            .filter(([, pct]) => Number.isFinite(Number(pct)) && Number(pct) > 0)
            .slice(0, 3)
            .map(([name, pct]) => ({ name: String(name), pct: Number(pct) }))
        : [];
    if (composition.length) {
      applyBlendLayers(
        [
          composition[0] ?? { name: "", pct: 0 },
          composition[1] ?? { name: "", pct: 0 },
          composition[2] ?? { name: "", pct: 0 },
        ],
        callService,
      );
    } else {
      applyBlendLayers([{ name: item.name, pct: 100 }, { name: "", pct: 0 }, { name: "", pct: 0 }], callService);
    }
    return;
  }

  if (kind === "nutrient") {
    for (const n of NUTRIENT_SLOTS) {
      const name = state(`input_text.dsc_nutrient_${n}_name`, "");
      const inv = state(`input_boolean.dsc_nutrient_${n}_in_inventory`) === "on";
      if (!name || name === "unknown" || !inv) {
        void callService("input_text", "set_value", {
          entity_id: `input_text.dsc_nutrient_${n}_name`,
          value: item.name,
        });
        if (item.dose_ml_l != null && Number.isFinite(Number(item.dose_ml_l))) {
          void callService("input_number", "set_value", {
            entity_id: `input_number.dsc_nutrient_${n}_dose_ml_l`,
            value: Number(item.dose_ml_l),
          });
        }
        void callService("input_boolean", "turn_on", {
          entity_id: `input_boolean.dsc_nutrient_${n}_in_inventory`,
        });
        break;
      }
    }
    return;
  }

}

export function applyLightPick(
  item: CatalogItem,
  callService: CallService,
  fixtureOptions: string[],
): void {
  const match = fixtureOptions.find((o) =>
    o.toLowerCase().includes(String(item.name || "").toLowerCase().slice(0, 18)),
  );
  if (match) {
    void callService("input_select", "select_option", {
      entity_id: "input_select.dsc_light_fixture",
      option: match,
    });
  } else {
    void callService("input_text", "set_value", {
      entity_id: "input_text.dsc_light_custom_name",
      value: item.name,
    });
  }
}

export function blendSummary(state: EntityState): string {
  const parts: string[] = [];
  for (let n = 1; n <= 3; n++) {
    const name = state(`input_text.dsc_blend_component_${n}_name`, "");
    const pctRaw = state(`input_number.dsc_blend_pct_${n}`, "0");
    const pct = Number(pctRaw);
    if (name && name !== "unknown" && Number.isFinite(pct) && pct > 0) {
      parts.push(`${name} ${Math.round(pct)}%`);
    }
  }
  return parts.length ? parts.join(" · ") : "Not set";
}

export function activeNutrientNames(state: EntityState): string[] {
  return NUTRIENT_SLOTS.map((n) => state(`input_text.dsc_nutrient_${n}_name`, "")).filter(
    (name) => name && name !== "unknown" && name !== "unavailable",
  );
}
