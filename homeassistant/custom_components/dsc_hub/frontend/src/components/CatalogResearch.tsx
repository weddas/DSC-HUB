import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CatalogPicker } from "./CatalogPicker";
import { Button, Card, StatusChip } from "./ui";
import { useHass } from "../hooks/useHass";
import { searchCatalog, type CatalogItem, type CatalogKind } from "../lib/catalog";

const DOMAINS: { id: CatalogKind; label: string }[] = [
  { id: "strain", label: "Strains" },
  { id: "medium", label: "Mediums" },
  { id: "nutrient", label: "Nutrients" },
  { id: "light", label: "Lights" },
];

export function CatalogResearch() {
  const { callService, state } = useHass();
  const navigate = useNavigate();
  const [kind, setKind] = useState<CatalogKind>("strain");
  const [selected, setSelected] = useState<CatalogItem | null>(null);
  const [compare, setCompare] = useState<CatalogItem[]>([]);
  const [sourceNote, setSourceNote] = useState("");

  useEffect(() => {
    void searchCatalog(kind, "", state, 8).then((r) => setSourceNote(r.note));
  }, [kind, state]);

  const rows = useMemo(() => {
    const keys = ["name", "type", "breeder", "height_cm_min", "flowering_days_min", "thc_min"];
    return keys;
  }, []);

  const useInCompose = (item: CatalogItem | null) => {
    if (!item) return;
    if (kind === "strain") {
      void callService("input_text", "set_value", { entity_id: "input_text.dsc_build_strain", value: item.name });
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
            <CatalogPicker
              kind={kind}
              onPick={(item) => setSelected(item)}
            />
          </Card>
        </div>
        <div className="dsc-col-6">
          <Card className="dsc-glass" title="Detail" icon="roster">
            {!selected ? (
              <p className="dsc-muted">Pick a row. Missing fields stay blank.</p>
            ) : (
              <>
                <h3 style={{ marginTop: 0 }}>{selected.name}</h3>
                <dl className="dsc-detail-list">
                  {rows.map((k) => (
                    <div key={k}>
                      <dt>{k}</dt>
                      <dd>{selected[k] != null && selected[k] !== "" ? String(selected[k]) : "—"}</dd>
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
                        prev.some((p) => p.name === selected.name) ? prev : [...prev, selected].slice(0, 3),
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
                      <th key={c.name}>{c.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((k) => (
                    <tr key={k}>
                      <td>{k}</td>
                      {compare.map((c) => (
                        <td key={c.name}>{c[k] != null && c[k] !== "" ? String(c[k]) : "—"}</td>
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
