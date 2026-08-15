import { useMemo, useState } from "react";
import { useHass } from "../hooks/useHass";
import { Button, EntityText, StatusChip } from "./ui";

const LAYER_IDS = [1, 2, 3] as const;

type PctMap = Record<number, number>;

function remainderOf(locked: Record<number, boolean>, dragged?: number | null): number {
  const rem = LAYER_IDS.find((i) => !locked[i] && i !== dragged);
  return rem ?? LAYER_IDS.find((i) => !locked[i]) ?? 3;
}

/** One remainder channel absorbs leftover so Σ is always 100. Other unlocked channels stay put. */
function computeCoupled(
  n: number,
  next: number,
  current: PctMap,
  locked: Record<number, boolean>,
): PctMap {
  const rem = remainderOf(locked, n);
  const sticky = LAYER_IDS.filter((i) => i !== n && i !== rem);
  const stickySum = sticky.reduce((a, i) => a + (Number.isFinite(current[i]) ? Math.round(current[i]) : 0), 0);
  const room = Math.max(0, 100 - stickySum);
  const use = Math.max(0, Math.min(room, Math.round(next)));
  const remVal = room - use;
  const out: PctMap = { ...current, [n]: use, [rem]: remVal };
  sticky.forEach((i) => {
    out[i] = Math.round(Number.isFinite(current[i]) ? current[i] : 0);
  });
  return out;
}

export function CoupledMix({ volumeL }: { volumeL: number }) {
  const { state, num, available, callService } = useHass();
  const [locked, setLocked] = useState<Record<number, boolean>>({ 1: false, 2: false, 3: false });
  const [dragging, setDragging] = useState<number | null>(null);
  const [drafts, setDrafts] = useState<PctMap | null>(null);

  const live: PctMap = {
    1: num("input_number.dsc_blend_pct_1", 0),
    2: num("input_number.dsc_blend_pct_2", 0),
    3: num("input_number.dsc_blend_pct_3", 0),
  };
  const pcts = drafts ?? live;

  const layers = LAYER_IDS.map((n) => ({
    n,
    name: state(`input_text.dsc_blend_component_${n}_name`, ""),
    pct: Number.isFinite(pcts[n]) ? pcts[n] : 0,
  }));

  const lockedCount = LAYER_IDS.filter((n) => locked[n]).length;
  const remainderIndex = remainderOf(locked);
  const vol = Number.isFinite(volumeL) && volumeL > 0 ? volumeL : num("input_number.dsc_blend_total_l", 20);
  const sum = layers.reduce((a, l) => a + (Number.isFinite(l.pct) ? l.pct : 0), 0);

  const commitPcts = (next: PctMap) => {
    LAYER_IDS.forEach((i) => {
      if (!available(`input_number.dsc_blend_pct_${i}`)) return;
      void callService("input_number", "set_value", {
        entity_id: `input_number.dsc_blend_pct_${i}`,
        value: next[i],
      });
    });
  };

  const finishDrag = (n: number, raw: number) => {
    const next = computeCoupled(n, raw, drafts ?? pcts, locked);
    setDrafts(null);
    setDragging(null);
    commitPcts(next);
  };

  const toggleLock = (n: number) => {
    setLocked((prev) => {
      const next = { ...prev, [n]: !prev[n] };
      const count = LAYER_IDS.filter((i) => next[i]).length;
      if (count >= LAYER_IDS.length) return prev;
      return next;
    });
  };

  const recipe = useMemo(
    () =>
      layers
        .filter((l) => l.pct > 0 && l.name && l.name !== "unknown")
        .map((l) => `${l.name} ${((vol * l.pct) / 100).toFixed(1)}L (${Math.round(l.pct)}%)`)
        .join(" · "),
    [layers, vol],
  );

  return (
    <div className="dsc-coupled-mix">
      <div className="dsc-chip-row" style={{ marginBottom: 8 }}>
        <StatusChip label={`Σ ${Math.round(sum)}%`} tone={Math.round(sum) === 100 ? "ok" : "warn"} />
        <StatusChip label={`${vol} L vessel`} tone="muted" />
        <span className="dsc-muted" style={{ fontSize: 12 }}>
          Lock any but one remainder. Remainder absorbs leftover so Σ stays 100.
        </span>
      </div>
      {LAYER_IDS.map((n) => {
        const layer = layers[n - 1];
        const isRem = n === remainderIndex && !locked[n];
        return (
          <div key={n} className="dsc-mix-row">
            <EntityText entityId={`input_text.dsc_blend_component_${n}_name`} label={`Layer ${n}`} />
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(layer.pct)}
              disabled={locked[n] || isRem}
              onPointerDown={(e) => {
                if (locked[n] || isRem) return;
                (e.target as HTMLInputElement).setPointerCapture(e.pointerId);
                setDragging(n);
                setDrafts({ ...pcts });
              }}
              onPointerUp={(e) => {
                if (dragging !== n) return;
                finishDrag(n, Number((e.target as HTMLInputElement).value));
              }}
              onPointerCancel={() => {
                setDrafts(null);
                setDragging(null);
              }}
              onLostPointerCapture={(e) => {
                if (dragging !== n) return;
                finishDrag(n, Number((e.target as HTMLInputElement).value));
              }}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (dragging === n) {
                  setDrafts(computeCoupled(n, value, drafts ?? pcts, locked));
                  return;
                }
                commitPcts(computeCoupled(n, value, pcts, locked));
              }}
            />
            <strong>{Math.round(layer.pct)}%</strong>
            <span className="dsc-mono">{((vol * layer.pct) / 100).toFixed(1)} L</span>
            <Button disabled={lockedCount >= 2 && !locked[n]} onClick={() => toggleLock(n)}>
              {locked[n] ? "Unlock" : isRem ? "Remainder" : "Lock"}
            </Button>
          </div>
        );
      })}
      <p className="dsc-muted" style={{ margin: "8px 0 0", fontSize: 12 }}>
        Recipe: {recipe || "Empty layers — scripts still read pct entities."}
      </p>
    </div>
  );
}
