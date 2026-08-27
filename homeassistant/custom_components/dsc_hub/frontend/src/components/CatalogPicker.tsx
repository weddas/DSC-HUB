import { useEffect, useMemo, useRef, useState } from "react";
import { useEntityBus } from "../hooks/useEntityBus";
import {
  DEFAULT_STRAIN_FILTERS,
  filterStrainItems,
  searchCatalog,
  type CatalogItem,
  type CatalogKind,
  type CatalogSource,
  type StrainFormatFilter,
  type StrainSearchFilters,
  type StrainTypeFilter,
} from "../lib/catalog";
import { StatusChip, Icon } from "./ui";
import type { IconName } from "../icons";

function catalogKindIcon(kind: CatalogKind): IconName {
  switch (kind) {
    case "strain":
      return "roster";
    case "medium":
      return "root";
    case "nutrient":
      return "nutrient";
    case "light":
      return "lighting";
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

export function CatalogPicker({
  kind,
  onPick,
  placeholder,
}: {
  kind: CatalogKind;
  onPick: (item: CatalogItem) => void;
  placeholder?: string;
}) {
  const { state } = useEntityBus();
  const [q, setQ] = useState("");
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [source, setSource] = useState<CatalogSource>("local");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [strainFilters, setStrainFilters] = useState<StrainSearchFilters>(DEFAULT_STRAIN_FILTERS);
  const hitsRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    let cancelled = false;
    const handle = window.setTimeout(() => {
      setBusy(true);
      void searchCatalog(kind, q, state, 100)
        .then((res) => {
          if (cancelled) return;
          setItems(res.items);
          setSource(res.source);
          setNote(res.note);
          setBusy(false);
        })
        .catch(() => {
          if (cancelled) return;
          setItems([]);
          setNote("Catalog search failed — try again.");
          setBusy(false);
        });
    }, 200);
    return () => {
      cancelled = true;
      window.clearTimeout(handle);
    };
    // Intentionally not keyed on `state` identity (tick-stable search).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind, q]);

  const list = useMemo(() => {
    if (kind !== "strain") return items;
    return filterStrainItems(items, strainFilters);
  }, [items, kind, strainFilters]);

  useEffect(() => {
    hitsRef.current?.scrollTo({ top: 0 });
  }, [list, q, strainFilters]);

  const resultNote =
    kind === "strain" && list.length !== items.length
      ? `${list.length} of ${items.length} hits after filters`
      : list.length
        ? `${list.length} hit${list.length === 1 ? "" : "s"}`
        : "";

  return (
    <div className="dsc-catalog-picker">
      <div className="dsc-catalog-picker-head">
        <Icon name={catalogKindIcon(kind)} size={16} color="var(--dsc-teal)" />
        <div className="dsc-chip-row" style={{ marginBottom: 0, flex: 1 }}>
          <StatusChip
            icon={source === "cannalib" ? "research" : "catalog"}
            label={source === "cannalib" ? "Cannalib" : "Local JSON"}
            tone={source === "cannalib" ? "ok" : "warn"}
          />
          {busy ? <StatusChip icon="search" motion="breathe" label="Searching…" tone="muted" /> : null}
          {note ? <span className="dsc-muted" style={{ fontSize: 12 }}>{note}</span> : null}
          {resultNote ? <span className="dsc-muted" style={{ fontSize: 12 }}>{resultNote}</span> : null}
        </div>
      </div>
      <label className="dsc-catalog-search">
        <Icon name="search" size={14} color="var(--dsc-gray-5)" motion={busy ? "spin" : undefined} />
        <input
          type="search"
          value={q}
          placeholder={placeholder || "Type to search — options are not culled"}
          onChange={(e) => setQ(e.target.value)}
          autoComplete="off"
        />
      </label>
      {kind === "strain" ? (
        <div className="dsc-catalog-filters" aria-label="Strain search filters">
          <label>
            Type
            <select
              value={strainFilters.type}
              onChange={(e) =>
                setStrainFilters((f) => ({ ...f, type: e.target.value as StrainTypeFilter }))
              }
            >
              <option value="all">All types</option>
              <option value="indica">Indica</option>
              <option value="sativa">Sativa</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </label>
          <label>
            Format
            <select
              value={strainFilters.format}
              onChange={(e) =>
                setStrainFilters((f) => ({ ...f, format: e.target.value as StrainFormatFilter }))
              }
            >
              <option value="all">All formats</option>
              <option value="auto">Autoflower</option>
              <option value="photo">Photoperiod</option>
            </select>
          </label>
          <label className="dsc-catalog-filter-breeder">
            Seed bank / breeder
            <input
              type="search"
              value={strainFilters.breeder}
              placeholder="e.g. Herbies, Barney's"
              onChange={(e) => setStrainFilters((f) => ({ ...f, breeder: e.target.value }))}
              autoComplete="off"
            />
          </label>
        </div>
      ) : null}
      <ul className="dsc-catalog-hits" ref={hitsRef}>
        {busy && !list.length ? <li className="dsc-muted">Searching…</li> : null}
        {!busy && !list.length ? (
          <li className="dsc-muted">
            {kind === "strain" && items.length
              ? "No hits match filters — widen type/format or clear breeder."
              : "No catalog hits — empty is honesty, not a placeholder."}
          </li>
        ) : null}
        {list.map((item, i) => (
          <li key={`${item.id || item.name}-${i}`}>
            <button type="button" onClick={() => onPick(item)}>
              <Icon name={catalogKindIcon(kind)} size={13} color="var(--dsc-teal)" />
              <strong>{item.name}</strong>
              {item.type ? <em>{String(item.type)}</em> : null}
              {item.breeder ? <span className="dsc-muted">{String(item.breeder)}</span> : null}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
