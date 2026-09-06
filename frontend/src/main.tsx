import { StrictMode, useEffect, useMemo, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { App } from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { DscRoot } from "./components/ParallaxStars";
import { Button } from "./components/ui";
import { BrainProvider, useBrainRefresh, useBrainSelector } from "./hooks/useBrain";
import { FleetProvider } from "./hooks/useFleet";
import type { HassEntity } from "./vite-env";
import "./styles/dsc.css";

function PiBootGate({ children }: { children: ReactNode }) {
  const loading = useBrainSelector((v) => v.loading && v.fleet == null);
  const error = useBrainSelector((v) => (v.fleet == null ? v.error : null));
  const refresh = useBrainRefresh();

  if (loading) {
    return (
      <div className="dsc-shell dsc-connecting" style={{ padding: 24 }} role="status" aria-live="polite">
        <p className="dsc-muted">Connecting to fleet…</p>
        <div className="dsc-boot-track" aria-hidden="true">
          <div className="dsc-boot-bar" />
        </div>
        <div className="dsc-chip-row" style={{ marginTop: 12 }}>
          <Button primary onClick={() => void refresh()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="dsc-shell dsc-connecting" style={{ padding: 24 }}>
        <p className="dsc-honesty">Fleet unavailable: {error}</p>
        <div className="dsc-chip-row" style={{ marginTop: 12 }}>
          <Button primary onClick={() => void refresh()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }
  return children;
}

/**
 * Re-renders on brain fleet ticks and publishes into FleetProvider's store.
 * `children` must be a stable element (useMemo) so React bails out of the App tree.
 */
function PiFleetShell({ children }: { children: ReactNode }) {
  const fleet = useBrainSelector((v) => v.fleet);
  const computed = useBrainSelector((v) => v.computed);
  const tick = useBrainSelector((v) => v.tick);
  const loading = useBrainSelector((v) => v.loading);
  const error = useBrainSelector((v) => v.error);
  const lastUpdatedAt = useBrainSelector((v) => v.lastUpdatedAt);
  const refresh = useBrainRefresh();
  const surface = useBrainSelector((v) => (v.fleet?.surface as string | undefined) || "—");

  const fleetRaw = useMemo(() => {
    if (!fleet) return null;
    const extras = computed?.hass_extras as Record<string, HassEntity> | undefined;
    if (!extras || !Object.keys(extras).length) return fleet;
    const prior = (fleet.hass_states as Record<string, HassEntity> | undefined) ?? {};
    return { ...fleet, hass_states: { ...prior, ...extras } };
  }, [fleet, computed]);

  useEffect(() => {
    document.title = `DSC-HUB ${surface}`;
  }, [surface]);

  return (
    <FleetProvider
      fleetRaw={fleetRaw}
      tick={tick}
      loading={loading}
      error={error}
      lastUpdatedAt={lastUpdatedAt}
      refresh={refresh}
    >
      {children}
    </FleetProvider>
  );
}

function PiRoot() {
  // Stable element identity: PiFleetShell can re-render every WS tick without
  // re-rendering App/Shell — React skips reconciliation when child props are the
  // same element reference.
  const appTree = useMemo(
    () => (
      <HashRouter>
        <App surfaceVersion="pi" />
      </HashRouter>
    ),
    [],
  );

  return (
    <PiBootGate>
      <PiFleetShell>{appTree}</PiFleetShell>
    </PiBootGate>
  );
}

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <StrictMode>
      <BrainProvider>
        <DscRoot>
          <ErrorBoundary>
            <PiRoot />
          </ErrorBoundary>
        </DscRoot>
      </BrainProvider>
    </StrictMode>,
  );
}
