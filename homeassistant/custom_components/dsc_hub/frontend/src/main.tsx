import { StrictMode, useEffect, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { App } from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { DscRoot } from "./components/ParallaxStars";
import { Button } from "./components/ui";
import { BrainProvider, useBrainContext } from "./hooks/useBrain";
import { FleetProvider } from "./hooks/useFleet";
import type { HassEntity } from "./vite-env";
import "./styles/dsc.css";

const DEFAULT_SURFACE = "7.4.0";

function PiApp() {
  const { hass, fleet, computed, tick, loading, error, refresh } = useBrainContext();
  const surface = (fleet?.surface as string | undefined) ?? DEFAULT_SURFACE;

  /** Merge /fleet/computed hass_extras into fleetRaw so enrichFleetFromHassStates fills dryback/rate/NPK. */
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

  if (loading && !fleet) {
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
  if (error && !fleet) {
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
  return (
    <FleetProvider fleetRaw={fleetRaw} tick={tick} source="pi" loading={loading} error={error}>
      <HashRouter>
        <App hass={hass} surfaceVersion={surface} hassRevision={tick} fleetSource="pi" />
      </HashRouter>
    </FleetProvider>
  );
}

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <StrictMode>
      <BrainProvider>
        <DscRoot>
          <ErrorBoundary>
            <PiApp />
          </ErrorBoundary>
        </DscRoot>
      </BrainProvider>
    </StrictMode>,
  );
}
