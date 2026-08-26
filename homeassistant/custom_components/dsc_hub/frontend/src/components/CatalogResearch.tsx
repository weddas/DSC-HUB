import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CatalogPicker } from "./CatalogPicker";
import { Button, Card, StatusChip } from "./ui";
import { useEntityBus } from "../hooks/useEntityBus";
import { useFleetActions } from "../hooks/useFleetActions";
import { searchCatalog, type CatalogItem, type CatalogKind } from "../lib/catalog";

const DOMAINS: { id: CatalogKind; label: string }[] = [
  { id: "strain", label: "Strains" },
  { id: "medium", label: "Mediums" },
  { id: "nutrient", label: "Nutrients" },
  { id: "light", label: "Lights" },
];

function fmtRange(v: unknown, unit: string): string {
  if (Array.isArray(v) && v.length >= 2) return `${v[0]}–${v[1]}${unit}`;
  if (v != null && v !== "") return `${v}${unit}`;
  return "";
}

function fieldValue(item: CatalogItem, key: string): string {
  const rec = item as CatalogItem & {
    want?: { temp_c?: number[]; rh_pct?: number[] };
    height_cm?: number | number[];
    thc_range?: number[];
    brand?: string;
    wattage_w?: number;
    efficacy_umol_j?: number;
    has_ppfd?: boolean;
    stage?: string;
  };
  switch (key) {
    case "name":
      return rec.name || "—";
    case "type":
      return rec.type || "—";
    case "breeder":
      return rec.breeder || rec.brand || "—";
    case "wantTemp":
      return rec.want?.temp_c ? rec.want.temp_c.join("–") : "—";
    case "wantRh":
      return rec.want?.rh_pct ? rec.want.rh_pct.join("–") : "—";
    case "height":
      return (
        fmtRange(rec.height_cm, "cm") ||
        (rec.height_cm_min != null ? `${rec.height_cm_min}${rec.height_cm_max != null ? `–${rec.height_cm_max}` : ""}cm` : "—")
      );
    case "thc":
      return rec.thc_range ? `${rec.thc_range.join("–")}%` : rec.thc_min != null ? `${rec.thc_min}%` : "—";
    case "flowering":
      if (rec.flowering_days_min != null) {
        return `${rec.flowering_days_min}${rec.flowering_days_max != null ? `–${rec.flowering_days_max}` : ""}d`;
      }
      return "—";
    case "brand":
      return rec.brand || "—";
    case "category":
      return rec.category || "—";
    case "dose":
      return rec.dose_ml_l != null ? `${rec.dose_ml_l} ml/L` : "—";
    case "stage":
      return rec.stage || "—";
    case "wattage":
      return rec.wattage_w != null ? `${rec.wattage_w} W` : "—";
    case "ppe":
      return rec.efficacy_umol_j != null ? String(rec.efficacy_umol_j) : "—";
    case "ppfd":
      return rec.has_ppfd || rec.ppfd_url ? "yes" : "—";
    case "composition":
      if (typeof rec.composition === "string") return rec.composition;
      if (rec.composition && typeof rec.composition === "object") {
        return Object.entries(rec.composition)
          .map(([k, v]) => `${k} ${v}%`)
          .join(" · ") || "—";
      }
      return "—";
    default: {
      const raw = rec[key];
      return raw != null && raw !== "" ? String(raw) : "—";
    }
  }
}

function compareFields(kind: CatalogKind): { key: string; label: string }[] {
  switch (kind) {
    case "strain":
      return [
        { key: "name", label: "Name" },
        { key: "type", label: "Type" },
        { key: "breeder", label: "Breeder" },
        { key: "wantTemp", label: "Temp °C" },
        { key: "wantRh", label: "RH %" },
        { key: "height", label: "Height" },
        { key: "flowering", label: "Flower" },
        { key: "thc", label: "THC" },
      ];
    case "nutrient":
      return [
        { key: "name", label: "Name" },
        { key: "brand", label: "Brand" },
        { key: "category", label: "Category" },
        { key: "dose", label: "Dose" },
        { key: "stage", label: "Stage" },
      ];
    case "light":
      return [
        { key: "name", label: "Name" },
        { key: "wattage", label: "W" },
        { key: "ppe", label: "PPE" },
        { key: "ppfd", label: "PPFD" },
      ];
    case "medium":
      return [
        { key: "name", label: "Name" },
        { key: "composition", label: "Composition" },
      ];
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

export function CatalogResearch() {
  const { state } = useEntityBus();
  const { callService } = useFleetActions();
  const navigate = useNavigate();
  const [kind, setKind] = useState<CatalogKind>("strain");
  const [selected, setSelected] = useState<CatalogItem | null>(null);
  const [compare, setCompare] = useState<CatalogItem[]>([]);
  const [sourceNote, setSourceNote] = useState("");
  const fields = useMemo(() => compareFields(kind), [kind]);

  useEffect(() => {
    void searchCatalog(kind, "", state, 8).then((r) => setSourceNote(r.note));
    // Tick-stable: do not refetch the source chip on every hass identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind]);

  const useInCompose = (item: CatalogItem | null) => {
    if (!item) return;
    if (kind === "strain") {
      void callService("input_text", "set_value", { entity_id: "input_text.dsc_build_strain", value: item.name });
    } else if (kind === "medium") {
      void callService("input_text", "set_value", {
        entity_id: "input_text.dsc_blend_component_1_name",
        value: item.name,
      });
    } else if (kind === "nutrient") {
      void callService("input_text", "set_value", { entity_id: "input_text.dsc_nutrient_1_name", value: item.name });
    } else if (kind === "light") {
      void callService("input_text", "set_value", { entity_id: "input_text.dsc_light_custom_name", value: item.name });
    }
    navigate("/grow/compose");
  };

  return (
    <div className="dsc-research">
      <div className="dsc-chip-row" style={{ marginBottom: 12 }}>
        {DOMAINS.map((d) => (
          <button
            key={d.id}
            type="button"
            className={`dsc-chip${kind === d.id ? " dsc-chip--ok" : ""}`}
            onClick={() => {
              setKind(d.id);
              setSelected(null);
              setCompare([]);
            }}
          >
            {d.label}
          </button>
        ))}
        <StatusChip label={sourceNote || "Catalog"} tone={sourceNote.includes("local") ? "warn" : "ok"} />
      </div>
      <div className="dsc-grid">
        <div className="dsc-col-6">
          <Card className="dsc-glass" title="Browse" icon="research">
            <CatalogPicker kind={kind} onPick={(item) => setSelected(item)} />
          </Card>
        </div>
        <div className="dsc-col-6">
          <Card className="dsc-glass" title="Detail" icon="roster">
            {!selected ? (
              <p className="dsc-muted">Pick an item to see its details. Fields without data stay blank.</p>
            ) : (
              <>
                <h3 style={{ marginTop: 0 }}>{selected.name}</h3>
                <dl className="dsc-detail-list">
                  {fields.map((f) => (
                    <div key={f.key}>
                      <dt>{f.label}</dt>
                      <dd>{fieldValue(selected, f.key)}</dd>
                    </div>
                  ))}
                </dl>
                <div className="dsc-row-actions">
                  <Button primary onClick={() => useInCompose(selected)}>
                    Use in Compose
                  </Button>
                  <Button
                    onClick={() =>
                      setCompare((prev) =>
                        prev.some((p) => (p.id || p.name) === (selected.id || selected.name))
                          ? prev
                          : [...prev, selected].slice(0, 3),
                      )
                    }
                  >
                    Add compare
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
        {compare.length ? (
          <div className="dsc-col-12">
            <Card className="dsc-glass" title="Compare" icon="analytics">
              <table className="dsc-table">
                <thead>
                  <tr>
                    <th>Field</th>
                    {compare.map((c) => (
                      <th key={c.id || c.name}>{c.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {fields.map((f) => (
                    <tr key={f.key}>
                      <td>{f.label}</td>
                      {compare.map((c) => (
                        <td key={c.id || c.name}>{fieldValue(c, f.key)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <Button onClick={() => setCompare([])}>Clear compare</Button>
            </Card>
          </div>
        ) : null}
      </div>
    </div>
  );
}
