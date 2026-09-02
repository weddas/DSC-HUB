import { useMemo } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { GrowLogStream } from "../components/journal/GrowLogStream";
import { JournalScopePanel } from "../components/journal/JournalScopePanel";
import { HelpTip } from "../components/HelpTip";
import { Card, PageHeader } from "../components/ui";
import { useEntityBus } from "../hooks/useEntityBus";
import { useFleet } from "../hooks/useFleet";
import { buildLogsSearchParams, parseLogsScopeFromSearchParams } from "../lib/journalApi";
import { probeAssignedPlantId, shortPlantId } from "../lib/probeAssignment";
import { rosterSlots } from "../lib/seatModel";
import type { JournalScope, JournalScopeKind } from "../types/journal";

type ScopeNavItem = {
  key: string;
  label: string;
  scope: JournalScope;
  indent?: boolean;
};

function plantIdForSlot(
  slot: Record<string, unknown>,
  fleet: ReturnType<typeof useFleet>,
  state: (id: string, fallback?: string) => string,
): string {
  const fromUuid = String(slot.plant_uuid ?? "").trim();
  if (fromUuid) return fromUuid;
  const potRaw = String(slot.pot ?? "");
  const pot = Number(potRaw.replace(/^pot/, ""));
  if (Number.isFinite(pot) && pot >= 1) {
    const fromProbe = probeAssignedPlantId(pot, fleet, state);
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

function LogsScopeNav({
  items,
  activeScope,
  view,
  onSelect,
}: {
  items: ScopeNavItem[];
  activeScope: JournalScope;
  view: "list" | "trends";
  onSelect: (scope: JournalScope) => void;
}) {
  return (
    <nav className="dsc-logs-scope-nav" aria-label="Journal scope">
      {items.map((item) => {
        const active = scopeActive(activeScope, item.scope);
        const href = `/grow/logs?${buildLogsSearchParams(item.scope, view).toString()}`;
        return (
          <a
            key={item.key}
            href={href}
            className={`dsc-logs-scope-link${active ? " dsc-logs-scope-link--active" : ""}${
              item.indent ? " dsc-logs-scope-link--indent" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              onSelect(item.scope);
            }}
          >
            {item.label}
          </a>
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

  const selectScope = (next: JournalScope) => {
    setParams(buildLogsSearchParams(next, view), { replace: true });
  };

  const visibleNavItems = navItems;

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
            <p className="dsc-muted" style={{ margin: "0 0 10px", fontSize: 12 }}>
              Plants
            </p>
            {plantItems.length ? (
              <LogsScopeNav
                items={plantItems}
                activeScope={scope}
                view={view}
                onSelect={selectScope}
              />
            ) : (
              <p className="dsc-muted" style={{ margin: "0 0 12px", fontSize: 13 }}>
                No roster plants yet.
              </p>
            )}
            <p className="dsc-muted" style={{ margin: "12px 0 10px", fontSize: 12 }}>
              Spaces &amp; facility
            </p>
            <LogsScopeNav
              items={visibleNavItems.filter((i) => i.key !== "grow_log" && !i.indent)}
              activeScope={scope}
              view={view}
              onSelect={selectScope}
            />
            <p className="dsc-muted" style={{ margin: "12px 0 10px", fontSize: 12 }}>
              Operational
            </p>
            <LogsScopeNav
              items={visibleNavItems.filter((i) => i.key === "grow_log")}
              activeScope={scope}
              view={view}
              onSelect={selectScope}
            />
          </Card>
        </aside>

        <main className="dsc-logs-main">
          {view === "trends" ? (
            <Card className="dsc-glass" title="Trends">
              <p className="dsc-muted" style={{ margin: 0, fontSize: 13 }}>
                Trends panel for{" "}
                <strong>
                  {scope.kind}
                  {scope.id ? ` · ${scope.id}` : ""}
                </strong>{" "}
                — charts land in Task 7. Tune Analytics will redirect here with{" "}
                <code>?view=trends</code>.
              </p>
            </Card>
          ) : scope.kind === "grow_log" ? (
            <GrowLogStream />
          ) : (
            <JournalScopePanel scope={scope} variant="full" fetchLimit={50} showCompose />
          )}
        </main>
      </div>
    </div>
  );
}
