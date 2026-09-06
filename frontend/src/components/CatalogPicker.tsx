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
import { Button, StatusChip, Icon } from "./ui";
import type { IconName } from "../icons";

const PAGE_SIZE = 50;

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

function strainRowIcon(item: CatalogItem): IconName {
  const t = String(item.type ?? "").toLowerCase();
  const name = String(item.name ?? "").toLowerCase();
  if (/\bauto/.test(name) || t.includes("auto")) return "strainAuto";
  if (t.includes("indica") && !t.includes("sativa")) return "strainIndica";
  if (t.includes("sativa") && !t.includes("indica")) return "strainSativa";
  if (t.includes("hybrid") || (t.includes("indica") && t.includes("sativa"))) return "strainHybrid";
  return "roster";
}

function itemKey(item: CatalogItem): string {
  return String(item.id || item.name_norm || item.name || "");
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
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [strainFilters, setStrainFilters] = useState<StrainSearchFilters>(DEFAULT_STRAIN_FILTERS);
  const hitsRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    let cancelled = false;
    const handle = window.setTimeout(() => {
      setBusy(true);
      setOffset(0);
      void searchCatalog(kind, q, state, PAGE_SIZE, 0)
        .then((res) => {
          if (cancelled) return;
          setItems(res.items);
          setSource(res.source);
          setNote(res.note);
          setHasMore(res.items.length >= PAGE_SIZE);
          setBusy(false);
        })
        .catch(() => {
          if (cancelled) return;
          setItems([]);
          setHasMore(false);
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

  const loadMore = async () => {
    const nextOffset = items.length;
    setLoadingMore(true);
    try {
      const res = await searchCatalog(kind, q, state, PAGE_SIZE, nextOffset);
      setSource(res.source);
      setNote(res.note);
      const seen = new Set(items.map(itemKey));
      const appended = res.items.filter((it) => {
        const k = itemKey(it);
        if (!k || seen.has(k)) return false;
        seen.add(k);
        return true;
      });
      if (!appended.length) {
        setHasMore(false);
        return;
      }
      setItems((prev) => [...prev, ...appended]);
      setHasMore(res.items.length >= PAGE_SIZE);
      setOffset(nextOffset);
    } catch {
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  const list = useMemo(() => {
    if (kind !== "strain") return items;
    return filterStrainItems(items, strainFilters);
  }, [items, kind, strainFilters]);

  useEffect(() => {
    hitsRef.current?.scrollTo({ top: 0 });
  }, [q, strainFilters, kind]);

  const resultNote =
    kind === "strain" && list.length !== items.length
      ? `${list.length} of ${items.length} hits after filters`
      : list.length
        ? `${list.length} hit${list.length === 1 ? "" : "s"}${hasMore ? "+" : ""}`
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
          {note ? <span className="dsc-muted" style={{ fontSize: "var(--dsc-fs-sm)" }}>{note}</span> : null}
          {resultNote ? <span className="dsc-muted" style={{ fontSize: "var(--dsc-fs-sm)" }}>{resultNote}</span> : null}
        </div>
      </div>
      <label className="dsc-catalog-search">
        <Icon name="search" size={14} color="var(--dsc-gray-5)" motion={busy ? "spin" : undefined} />
        <input
          type="search"
          value={q}
          placeholder={
            placeholder ||
            (kind === "strain"
              ? "Search name, type, breeder, summary…"
              : "Type to search — options are not culled")
          }
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
          <li key={`${itemKey(item)}-${i}`}>
            <button type="button" onClick={() => onPick(item)}>
              <Icon
                name={kind === "strain" ? strainRowIcon(item) : catalogKindIcon(kind)}
                size={13}
                color="var(--dsc-teal)"
              />
              <strong>{item.name}</strong>
              {item.type ? <em>{String(item.type)}</em> : null}
              {item.breeder ? <span className="dsc-muted">{String(item.breeder)}</span> : null}
            </button>
          </li>
        ))}
      </ul>
      {hasMore && !busy ? (
        <div className="dsc-row-actions" style={{ marginTop: 8 }}>
          <Button variant="secondary" busy={loadingMore} onClick={() => void loadMore()}>
            {`Load more (${PAGE_SIZE})`}
          </Button>
          {offset > 0 ? (
            <span className="dsc-muted" style={{ fontSize: "var(--dsc-fs-sm)" }}>
              Showing {items.length}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
