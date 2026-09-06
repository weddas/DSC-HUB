import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";

import { GrowLogStream } from "../components/journal/GrowLogStream";
import { JournalComparePane } from "../components/journal/JournalComparePane";
import { JournalScopePanel } from "../components/journal/JournalScopePanel";
import { LogsTrendsPanel } from "../components/journal/LogsTrendsPanel";
import { HelpTip } from "../components/HelpTip";
import { Button, Card, PageHeader } from "../components/ui";
import { useEntityBus } from "../hooks/useEntityBus";
import { useFleet } from "../hooks/useFleet";
import {
  buildLogsSearchParams,
  formatCompareScopeParam,
  parseCompareScopeParam,
  parseLogsScopeFromSearchParams,
} from "../lib/journalApi";
import { probeAssignedPlantId, shortPlantId } from "../lib/probeAssignment";
import { rosterSlots } from "../lib/probeModel";
import type { JournalEntry, JournalScope, JournalScopeKind } from "../types/journal";

type ScopeNavItem = {
  key: string;
  label: string;
  scope: JournalScope;
  indent?: boolean;
};

function parseHighlightEntryId(params: URLSearchParams): number | null {
  const raw = params.get("highlight") ?? params.get("entry");
  if (!raw) return null;
  const id = Number.parseInt(raw, 10);
  return Number.isFinite(id) && id > 0 ? id : null;
}

function parseAnchorSec(params: URLSearchParams): number | null {
  const raw = params.get("anchor");
  if (!raw) return null;
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function plantIdForSlot(
  slot: Record<string, unknown>,
  fleet: ReturnType<typeof useFleet>,
  state: (id: string, fallback?: string) => string,
): string {
  const fromUuid = String(slot.plant_uuid ?? "").trim();
  if (fromUuid) return fromUuid;
  const probeRaw = String(slot.pot ?? "");
  const probe = Number(probeRaw.replace(/^pot/, ""));
  if (Number.isFinite(probe) && probe >= 1) {
    const fromProbe = probeAssignedPlantId(probe, fleet, state);
    if (fromProbe) return fromProbe;
  }
  const slotNum = Number(slot.slot ?? 0);
  return slotNum >= 1 ? `slot:${slotNum}` : "";
}

function scopeActive(current: JournalScope, item: JournalScope): boolean {
  if (current.kind !== item.kind) return false;
  if (current.kind === "core" || current.kind === "grow_log") return true;
  return String(current.id ?? "") === String(item.id ?? "");
}

function isCompareableScope(scope: JournalScope): boolean {
  return scope.kind === "plant" || scope.kind === "space" || scope.kind === "room";
}

function scopeCompareLabel(scope: JournalScope): string {
  if (scope.kind === "space") return scope.id === "2x4" ? "2×4" : "4×8";
  if (scope.kind === "room") return "Room";
  if (scope.kind === "plant") return shortPlantId(scope.id ?? "plant");
  return scope.kind;
}

function LogsScopeNav({
  items,
  activeScope,
  compareScopeMode,
  compareScopeA,
  compareScopeB,
  view,
  onSelect,
}: {
  items: ScopeNavItem[];
  activeScope: JournalScope;
  compareScopeMode: boolean;
  compareScopeA: JournalScope | null;
  compareScopeB: JournalScope | null;
  view: "list" | "trends";
  onSelect: (scope: JournalScope) => void;
}) {
  return (
    <nav className="dsc-logs-scope-nav" aria-label="Journal scope">
      {items.map((item) => {
        const active = scopeActive(activeScope, item.scope);
        const compareable = isCompareableScope(item.scope);
        const isA =
          compareScopeA != null &&
          item.scope.kind === compareScopeA.kind &&
          String(item.scope.id ?? "") === String(compareScopeA.id ?? "");
        const isB =
          compareScopeB != null &&
          item.scope.kind === compareScopeB.kind &&
          String(item.scope.id ?? "") === String(compareScopeB.id ?? "");
        // HashRouter app — hand `<Link>` a route-relative target so it renders a
        // correct `#/grow/logs?…` href (copy-link / middle-click / open-in-new-tab
        // now work) instead of the raw-path `<a href="/grow/logs?…">` that only
        // navigated because onClick preventDefault'd it. Plain clicks still route
        // through onSelect so compare-picking + anchor carry-through are unchanged.
        const to = `/grow/logs?${buildLogsSearchParams(item.scope, view).toString()}`;

        return (
          <Link
            key={item.key}
            to={to}
            replace
            className={`dsc-logs-scope-link${active ? " dsc-logs-scope-link--active" : ""}${
              item.indent ? " dsc-logs-scope-link--indent" : ""
            }${compareScopeMode && compareable && (isA || isB) ? " dsc-logs-scope-link--compare-pick" : ""}`}
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
              e.preventDefault();
              onSelect(item.scope);
            }}
          >
            {item.label}
            {compareScopeMode && isA ? (
              <span className="dsc-logs-scope-badge" aria-label="Compare scope A">
                A
              </span>
            ) : null}
            {compareScopeMode && isB ? (
              <span className="dsc-logs-scope-badge" aria-label="Compare scope B">
                B
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

export function GrowLogsPage() {
  const [params, setParams] = useSearchParams();
  const { entity, state } = useEntityBus();
  const fleet = useFleet();

  const { scope, view } = parseLogsScopeFromSearchParams(params);
  const highlightEntryId = parseHighlightEntryId(params);
  const chartAnchorSec = parseAnchorSec(params);
  const compareScopeA = parseCompareScopeParam(params.get("compareScopeA"));
  const compareScopeB = parseCompareScopeParam(params.get("compareScopeB"));
  const compareScopeMode = Boolean(compareScopeA || compareScopeB || params.get("compareScopes") === "1");

  const [compareMode, setCompareMode] = useState(false);
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [detailEntry, setDetailEntry] = useState<JournalEntry | null>(null);
  const [entryCache, setEntryCache] = useState<JournalEntry[]>([]);
  const [scopeComparePick, setScopeComparePick] = useState<"A" | "B">("A");

  useEffect(() => {
    setCompareMode(false);
    setCompareIds([]);
    setDetailEntry(null);
    setEntryCache([]);
  }, [scope.kind, scope.id]);

  const plantItems = useMemo((): ScopeNavItem[] => {
    const slots = rosterSlots(entity).filter((s) => {
      const st = String(s.status || "");
      return !["empty", "", "unknown", "unavailable"].includes(st);
    });
    return slots
      .map((s) => {
        const plantId = plantIdForSlot(s as unknown as Record<string, unknown>, fleet, state);
        const label =
          String(s.nickname || s.strain || "").trim() ||
          (plantId ? shortPlantId(plantId) : `Slot ${s.slot}`);
        return {
          key: `plant-${s.slot}-${plantId}`,
          label,
          scope: { kind: "plant" as JournalScopeKind, id: plantId },
          indent: true,
        };
      })
      .filter((item) => Boolean(item.scope.id?.trim()));
  }, [entity, fleet, state]);

  const navItems: ScopeNavItem[] = useMemo(
    () => [
      { key: "space-4x8", label: "4×8", scope: { kind: "space", id: "4x8" } },
      { key: "space-2x4", label: "2×4", scope: { kind: "space", id: "2x4" } },
      { key: "room", label: "Room", scope: { kind: "room", id: "grow_room" } },
      { key: "core", label: "Core", scope: { kind: "core" } },
      { key: "grow_log", label: "Grow log", scope: { kind: "grow_log" } },
    ],
    [],
  );

  const updateParams = (
    nextScope: JournalScope,
    nextView: "list" | "trends",
    opts?: {
      anchorSec?: number;
      compareScopeA?: string | null;
      compareScopeB?: string | null;
      compareScopes?: boolean;
    },
  ) => {
    const built = buildLogsSearchParams(nextScope, nextView, {
      anchorSec: opts?.anchorSec,
      compareScopeA: opts?.compareScopeA ?? undefined,
      compareScopeB: opts?.compareScopeB ?? undefined,
    });
    if (opts?.compareScopes) {
      built.set("compareScopes", "1");
    }
    setParams(built, { replace: true });
  };

  const selectScope = (next: JournalScope) => {
    if (compareScopeMode && isCompareableScope(next)) {
      const encoded = formatCompareScopeParam(next);
      if (!encoded) return;
      const nextA = scopeComparePick === "A" ? encoded : formatCompareScopeParam(compareScopeA ?? next);
      const nextB = scopeComparePick === "B" ? encoded : formatCompareScopeParam(compareScopeB ?? next);
      updateParams(next, view === "trends" || Boolean(nextA && nextB) ? "trends" : view, {
        anchorSec: chartAnchorSec ?? undefined,
        compareScopeA: nextA,
        compareScopeB: nextB,
        compareScopes: true,
      });
      setScopeComparePick((pick) => (pick === "A" ? "B" : "A"));
      return;
    }
    updateParams(next, view, {
      anchorSec: chartAnchorSec ?? undefined,
    });
  };

  const setView = (nextView: "list" | "trends", anchorSec?: number) => {
    updateParams(scope, nextView, {
      anchorSec,
      // Only carry compare params through when compare mode is already on —
      // otherwise this seeds a silent self-vs-self compare on every tab switch.
      compareScopeA: compareScopeMode ? formatCompareScopeParam(compareScopeA ?? scope) : undefined,
      compareScopeB: compareScopeMode ? formatCompareScopeParam(compareScopeB ?? scope) : undefined,
      compareScopes: compareScopeMode,
    });
  };

  /** Mid-pick reset — clear A/B and start over from A without leaving compare mode. */
  const restartScopePick = () => {
    updateParams(scope, "trends", {
      anchorSec: chartAnchorSec ?? undefined,
      compareScopeA: null,
      compareScopeB: null,
      compareScopes: true,
    });
    setScopeComparePick("A");
  };

  /** Swap which picked scope is A vs B. */
  const swapScopePick = () => {
    if (!compareScopeA && !compareScopeB) return;
    updateParams(scope, view, {
      anchorSec: chartAnchorSec ?? undefined,
      compareScopeA: compareScopeB ? formatCompareScopeParam(compareScopeB) : null,
      compareScopeB: compareScopeA ? formatCompareScopeParam(compareScopeA) : null,
      compareScopes: true,
    });
  };

  const toggleCompareScopes = () => {
    if (compareScopeMode) {
      updateParams(scope, view, { anchorSec: chartAnchorSec ?? undefined });
      setScopeComparePick("A");
      return;
    }
    updateParams(scope, "trends", {
      anchorSec: chartAnchorSec ?? undefined,
      compareScopeA: formatCompareScopeParam(scope),
      compareScopes: true,
    });
    setScopeComparePick("B");
  };

  const openChartMoment = (entry: JournalEntry) => {
    setView("trends", entry.occurred_at);
    setDetailEntry(null);
  };

  const compareEntries = useMemo((): [JournalEntry, JournalEntry] | null => {
    if (compareIds.length < 2) return null;
    const left = entryCache.find((e) => e.id === compareIds[0]);
    const right = entryCache.find((e) => e.id === compareIds[1]);
    if (!left || !right) return null;
    return [left, right];
  }, [compareIds, entryCache]);

  const mergeEntryCache = (entries: JournalEntry[]) => {
    setEntryCache((prev) => {
      const seen = new Set(prev.map((e) => e.id));
      const added = entries.filter((e) => !seen.has(e.id));
      return added.length ? [...prev, ...added] : prev;
    });
  };

  const trackEntryForCompare = (entry: JournalEntry) => {
    mergeEntryCache([entry]);
  };

  /** Bulk export of the loaded rows for the current scope as a CSV download. */
  const exportScopeCsv = () => {
    const src = entryCache.slice().sort((a, b) => b.occurred_at - a.occurred_at);
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const header = ["id", "occurred_at_iso", "source", "provenance", "tags", "note"];
    const body = src.map((e) =>
      [
        e.id,
        new Date(e.occurred_at * 1000).toISOString(),
        e.source,
        e.provenance ?? "",
        e.tags.join("|"),
        e.note,
      ]
        .map(esc)
        .join(","),
    );
    const csv = [header.map(esc).join(","), ...body].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `journal-${scope.kind}${scope.id ? `-${scope.id}` : ""}-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  const scopeCompareReady = compareScopeA != null && compareScopeB != null;
  const showScopeCompareTrends = compareScopeMode && scopeCompareReady && view === "trends";

  if (!params.get("scope")) {
    return <Navigate to="/grow/logs?scope=room&id=grow_room" replace />;
  }

  return (
    <div className="dsc-page">
      <PageHeader
        icon="catalog"
        title="Logs"
        subtitle="Review observations, compare scopes, and trend sensor history — unified journal browser."
        actions={
          <HelpTip title="Grow → Logs">
            <p>
              Hierarchy sidebar: plant journals follow roster slots; tent, room, and Core layers roll up child scopes.
              Grow log is operational GET-only.
            </p>
            <p>Embedded surfaces deep-link here with the same scope query params.</p>
          </HelpTip>
        }
      />

      <div className="dsc-logs-layout">
        <aside className="dsc-logs-sidebar">
          <Card className="dsc-glass" title="Scope">
            {compareScopeMode ? (
              <p className="dsc-muted" style={{ margin: "0 0 10px", fontSize: "var(--dsc-fs-sm)" }}>
                Pick scope {scopeComparePick} from plants, tents, or room — then switch to Trends.
              </p>
            ) : null}
            <p className="dsc-muted" style={{ margin: "0 0 10px", fontSize: "var(--dsc-fs-sm)" }}>
              Plants
            </p>
            {plantItems.length ? (
              <LogsScopeNav
                items={plantItems}
                activeScope={scope}
                compareScopeMode={compareScopeMode}
                compareScopeA={compareScopeA}
                compareScopeB={compareScopeB}
                view={view}
                onSelect={selectScope}
              />
            ) : (
              <p className="dsc-muted" style={{ margin: "0 0 12px", fontSize: "var(--dsc-fs-sm)" }}>
                No roster plants yet.
              </p>
            )}
            <p className="dsc-muted" style={{ margin: "12px 0 10px", fontSize: "var(--dsc-fs-sm)" }}>
              Spaces &amp; facility
            </p>
            <LogsScopeNav
              items={navItems.filter((i) => i.key !== "grow_log" && !i.indent)}
              activeScope={scope}
              compareScopeMode={compareScopeMode}
              compareScopeA={compareScopeA}
              compareScopeB={compareScopeB}
              view={view}
              onSelect={selectScope}
            />
            <p className="dsc-muted" style={{ margin: "12px 0 10px", fontSize: "var(--dsc-fs-sm)" }}>
              Operational
            </p>
            <LogsScopeNav
              items={navItems.filter((i) => i.key === "grow_log")}
              activeScope={scope}
              compareScopeMode={compareScopeMode}
              compareScopeA={compareScopeA}
              compareScopeB={compareScopeB}
              view={view}
              onSelect={selectScope}
            />
          </Card>
        </aside>

        <main className="dsc-logs-main">
          <div className="dsc-chip-row" style={{ marginBottom: 10 }}>
            <Button variant={view === "list" ? "primary" : "secondary"} onClick={() => setView("list")}>
              Journal list
            </Button>
            <Button
              variant={view === "trends" ? "primary" : "secondary"}
              onClick={() => setView("trends", chartAnchorSec ?? undefined)}
              disabled={scope.kind === "grow_log"}
            >
              Trends
            </Button>
            {view === "trends" && chartAnchorSec ? (
              <Button variant="secondary" onClick={() => setView("trends")}>
                Clear anchor
              </Button>
            ) : null}
            {scope.kind !== "grow_log" ? (
              <Button variant={compareScopeMode ? "primary" : "secondary"} onClick={toggleCompareScopes}>
                {compareScopeMode ? "Exit scope compare" : "Compare scopes"}
              </Button>
            ) : null}
            {compareScopeMode ? (
              <span className="dsc-muted" style={{ fontSize: "var(--dsc-fs-sm)" }}>
                {scopeCompareReady
                  ? `${scopeCompareLabel(compareScopeA!)} vs ${scopeCompareLabel(compareScopeB!)}`
                  : `Pick scope ${scopeComparePick} (${compareScopeA ? "A set" : "A —"}, ${compareScopeB ? "B set" : "B —"})`}
              </span>
            ) : null}
            {compareScopeMode && (compareScopeA || compareScopeB) ? (
              <>
                <Button variant="secondary" onClick={restartScopePick}>
                  Restart pick
                </Button>
                {compareScopeA && compareScopeB ? (
                  <Button variant="secondary" onClick={swapScopePick}>
                    Swap A↔B
                  </Button>
                ) : null}
              </>
            ) : null}
          </div>

          {showScopeCompareTrends ? (
            <div className="dsc-logs-scope-compare">
              <div className="dsc-logs-scope-compare-col">
                <p className="dsc-muted" style={{ margin: "0 0 8px", fontSize: "var(--dsc-fs-md)", fontWeight: 600 }}>
                  {scopeCompareLabel(compareScopeA!)}
                </p>
                <LogsTrendsPanel scope={compareScopeA!} compact />
              </div>
              <div className="dsc-logs-scope-compare-col">
                <p className="dsc-muted" style={{ margin: "0 0 8px", fontSize: "var(--dsc-fs-md)", fontWeight: 600 }}>
                  {scopeCompareLabel(compareScopeB!)}
                </p>
                <LogsTrendsPanel scope={compareScopeB!} compact />
              </div>
            </div>
          ) : view === "trends" ? (
            <LogsTrendsPanel scope={scope} anchorSec={chartAnchorSec} />
          ) : scope.kind === "grow_log" ? (
            <GrowLogStream />
          ) : (
            <>
              <div className="dsc-chip-row" style={{ marginBottom: 10 }}>
                <Button
                  variant={compareMode ? "primary" : "secondary"}
                  onClick={() => {
                    setCompareMode((on) => !on);
                    setCompareIds([]);
                    setDetailEntry(null);
                  }}
                >
                  {compareMode ? "Exit compare" : "Compare entries"}
                </Button>
                {compareMode ? (
                  <span className="dsc-muted" style={{ fontSize: "var(--dsc-fs-sm)" }}>
                    Select two rows ({compareIds.length}/2)
                  </span>
                ) : null}
                <Button variant="secondary" disabled={!entryCache.length} onClick={exportScopeCsv}>
                  Export CSV
                </Button>
              </div>
              <JournalScopePanel
                scope={scope}
                variant="full"
                fetchLimit={50}
                showCompose
                fullBrowser={{
                  highlightEntryId,
                  compareMode,
                  compareIds,
                  onCompareIdsChange: setCompareIds,
                  onCompareEntry: trackEntryForCompare,
                  onEntriesChange: mergeEntryCache,
                  detailEntry,
                  onDetailEntryChange: (entry) => {
                    if (entry) trackEntryForCompare(entry);
                    setDetailEntry(entry);
                  },
                  onChartMoment: openChartMoment,
                }}
              />
              {compareEntries ? (
                <JournalComparePane
                  left={compareEntries[0]}
                  right={compareEntries[1]}
                  scope={scope}
                  onClear={() => setCompareIds([])}
                />
              ) : null}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
