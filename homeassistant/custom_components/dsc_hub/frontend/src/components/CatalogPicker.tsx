import { useEffect, useMemo, useState } from "react";
import { useHass } from "../hooks/useHass";
import { searchCatalog, type CatalogItem, type CatalogKind, type CatalogSource } from "../lib/catalog";
import { StatusChip } from "./ui";

export function CatalogPicker({
  kind,
  onPick,
  placeholder,
}: {
  kind: CatalogKind;
  onPick: (item: CatalogItem) => void;
  placeholder?: string;
}) {
  const { state } = useHass();
  const [q, setQ] = useState("");
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [source, setSource] = useState<CatalogSource>("local");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const handle = window.setTimeout(() => {
      setBusy(true);
      void searchCatalog(kind, q, state, 40).then((res) => {
        if (cancelled) return;
        setItems(res.items);
        setSource(res.source);
        setNote(res.note);
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

  const list = useMemo(() => items, [items]);

  return (
    <div className="dsc-catalog-picker">
      <div className="dsc-chip-row" style={{ marginBottom: 8 }}>
        <StatusChip
          label={source === "cannalib" ? "Cannalib" : "Local JSON"}
          tone={source === "cannalib" ? "ok" : "warn"}
        />
        {note ? <span className="dsc-muted" style={{ fontSize: 12 }}>{note}</span> : null}
      </div>
      <input
        type="search"
        value={q}
        placeholder={placeholder || "Type to search — options are not culled"}
        onChange={(e) => setQ(e.target.value)}
        autoComplete="off"
      />
      <ul className="dsc-catalog-hits">
        {busy && !list.length ? <li className="dsc-muted">Searching…</li> : null}
        {!busy && !list.length ? (
          <li className="dsc-muted">No catalog hits — empty is honesty, not a placeholder.</li>
        ) : null}
        {list.map((item, i) => (
          <li key={`${item.id || item.name}-${i}`}>
            <button type="button" onClick={() => onPick(item)}>
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
