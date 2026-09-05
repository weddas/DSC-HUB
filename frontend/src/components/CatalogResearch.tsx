import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CatalogPicker } from "./CatalogPicker";
import { Button, Card, StatusChip } from "./ui";
import { useEntityBus } from "../hooks/useEntityBus";
import { useFleetActions } from "../hooks/useFleetActions";
import { catalogMediaBase, fetchStrainDetail, hasLocalPpfdMap, loadPpfdManifest, resolveKitPpfdUrl, searchCatalog, type CatalogItem, type CatalogKind } from "../lib/catalog";
import { applyCatalogPick, applyLightPick } from "../lib/composePlantLogic";

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
      return hasLocalPpfdMap(rec) ? "local crop" : "—";
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

function chemistryTier(item: CatalogItem, sourceNote: string): { label: string; tone: "ok" | "warn" | "muted" } {
  const via = String(item.matched_via ?? "").toLowerCase();
  if (via === "science_alias" || item.science_alias) {
    return { label: "Lab alias · verified tier", tone: "ok" };
  }
  if (item.composition && typeof item.composition === "object") {
    return { label: "Bank claim · catalog NPK", tone: sourceNote.includes("local") ? "warn" : "ok" };
  }
  return { label: "No chemistry on file", tone: "muted" };
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

function licensedMediaUrls(
  detail: Record<string, unknown> | null,
  base: string,
): string[] {
  if (!detail) return [];
  const evidence = detail.evidence as { media?: { sample?: unknown[] } } | undefined;
  const sample = evidence?.media?.sample;
  if (!Array.isArray(sample)) return [];
  const out: string[] = [];
  for (const raw of sample) {
    if (!raw || typeof raw !== "object") continue;
    const row = raw as Record<string, unknown>;
    const entity = String(row.entity_id ?? row.kind ?? "").toLowerCase();
    if (entity.includes("comparative")) continue;
    const license = String(row.license ?? row.license_id ?? row.license_type ?? "").toUpperCase();
    if (license && !/(CC0|CC_BY|PUBLIC_DOMAIN)/.test(license)) continue;
    const src = String(row.source_url ?? row.url ?? row.path ?? "").trim();
    if (!src) continue;
    if (src.startsWith("/")) out.push(`${base.replace(/\/$/, "")}${src}`);
    else if (src.startsWith("http")) out.push(src);
  }
  return out.slice(0, 3);
}

export function CatalogResearch() {
  const { state, entity } = useEntityBus();
  const { callService } = useFleetActions();
  const navigate = useNavigate();
  const [kind, setKind] = useState<CatalogKind>("strain");
  const [selected, setSelected] = useState<CatalogItem | null>(null);
  const [compare, setCompare] = useState<CatalogItem[]>([]);
  const [recent, setRecent] = useState<CatalogItem[]>([]);
  const [sourceNote, setSourceNote] = useState("");
  const [hydrate, setHydrate] = useState<Record<string, unknown> | null>(null);
  const [hydrateNote, setHydrateNote] = useState("");
  const [ppfdManifest, setPpfdManifest] = useState<Record<string, { local_path?: string; file?: string }>>({});
  const fields = useMemo(() => compareFields(kind), [kind]);
  const mediaUrls = useMemo(
    () => licensedMediaUrls(hydrate, catalogMediaBase(state)),
    [hydrate, state],
  );
  const lightPpfdUrl = useMemo(
    () => (kind === "light" ? resolveKitPpfdUrl(selected, ppfdManifest) : null),
    [kind, selected, ppfdManifest],
  );

  useEffect(() => {
    void loadPpfdManifest().then(setPpfdManifest);
  }, []);

  useEffect(() => {
    void searchCatalog(kind, "", state, 8).then((r) => setSourceNote(r.note));
    // Tick-stable: do not refetch the source chip on every hass identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind]);

  useEffect(() => {
    if (kind !== "strain" || !selected) {
      setHydrate(null);
      setHydrateNote("");
      return;
    }
    const id = String(selected.id || selected.name_norm || "").trim();
    if (!id) {
      setHydrate(null);
      setHydrateNote("No strain id — cannot hydrate media.");
      return;
    }
    let cancelled = false;
    setHydrateNote("Hydrating…");
    void fetchStrainDetail(id, state).then((detail) => {
      if (cancelled) return;
      setHydrate(detail);
      if (!detail) {
        setHydrateNote("No licensed image (hydrate miss).");
        return;
      }
      const n = Number((detail.evidence as { media?: { n?: number } } | undefined)?.media?.n ?? 0);
      const filled = (detail.evidence as { media?: { filled_from?: { note?: string } } } | undefined)
        ?.media?.filled_from;
      if (n > 0 && filled?.note) {
        setHydrateNote(filled.note);
      } else {
        setHydrateNote(n > 0 ? "" : "No licensed image on file.");
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind, selected?.id, selected?.name]);

  const sendToCompose = (item: CatalogItem | null) => {
    if (!item) return;
    setRecent((prev) => [item, ...prev.filter((x) => x.name !== item.name)].slice(0, 5));
    if (kind === "light") {
      const fixtureOptions = (entity("input_select.dsc_light_fixture")?.attributes?.options as string[]) || [];
      applyLightPick(item, callService, fixtureOptions);
    } else {
      applyCatalogPick(kind, item, callService, state);
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
        {recent.length ? (
          <StatusChip label={`Recent: ${recent.map((r) => r.name).slice(0, 2).join(", ")}`} tone="muted" />
        ) : null}
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
                {kind === "strain" ? (
                  <div className="dsc-catalog-media" style={{ marginBottom: 10 }}>
                    {mediaUrls.length ? (
                      <div className="dsc-chip-row" style={{ gap: 8 }}>
                        {mediaUrls.map((src) => (
                          <img
                            key={src}
                            src={src}
                            alt=""
                            style={{
                              maxWidth: 140,
                              maxHeight: 100,
                              objectFit: "cover",
                              borderRadius: 6,
                              border: "1px solid rgba(120,160,130,0.25)",
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="dsc-muted" style={{ fontSize: 12, margin: 0 }}>
                        {hydrateNote || "No licensed image."}
                      </p>
                    )}
                  </div>
                ) : null}
                {kind === "light" ? (
                  <div className="dsc-catalog-media" style={{ marginBottom: 10 }}>
                    {lightPpfdUrl ? (
                      <img
                        src={lightPpfdUrl}
                        alt="Local PPFD map crop"
                        style={{
                          maxWidth: "100%",
                          maxHeight: 180,
                          objectFit: "contain",
                          borderRadius: 6,
                          border: "1px solid rgba(120,160,130,0.25)",
                        }}
                      />
                    ) : (
                      <p className="dsc-muted" style={{ fontSize: 12, margin: 0 }}>
                        No local PPFD crop on file
                        {selected.ppfd_url && String(selected.ppfd_url).startsWith("http")
                          ? " (manufacturer CDN not shown)"
                          : ""}
                        .
                      </p>
                    )}
                  </div>
                ) : null}
                {kind === "nutrient" ? (
                  <StatusChip
                    label={chemistryTier(selected, sourceNote).label}
                    tone={chemistryTier(selected, sourceNote).tone}
                  />
                ) : null}
                <dl className="dsc-detail-list">
                  {fields.map((f) => (
                    <div key={f.key}>
                      <dt>{f.label}</dt>
                      <dd>{fieldValue(selected, f.key)}</dd>
                    </div>
                  ))}
                </dl>
                <div className="dsc-row-actions">
                  <Button primary onClick={() => sendToCompose(selected)}>
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
