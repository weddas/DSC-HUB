import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { App } from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Button } from "./components/ui";
import { BrainProvider, useBrainContext } from "./hooks/useBrain";
import { FleetProvider } from "./hooks/useFleet";
import "./styles/dsc.css";

function PiApp() {
  const { hass, fleet, tick, loading, error, refresh } = useBrainContext();
  const surface =
    (fleet?.surface as string | undefined) ??
    (fleet?.expected_firmware ? `7.0.0 (${fleet.expected_firmware})` : "7.0.0");

  useEffect(() => {
    document.title = `DSC-HUB ${surface}`;
  }, [surface]);

  if (loading && !fleet) {
    return (
      <div className="dsc-root">
        <div className="dsc-shell dsc-connecting" style={{ padding: 24 }}>
          <p className="dsc-muted">Connecting to fleet…</p>
          <div className="dsc-chip-row" style={{ marginTop: 12 }}>
            <Button primary onClick={() => void refresh()}>
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }
  if (error && !fleet) {
    return (
      <div className="dsc-root">
        <div className="dsc-shell dsc-connecting" style={{ padding: 24 }}>
          <p className="dsc-honesty">Fleet unavailable: {error}</p>
          <div className="dsc-chip-row" style={{ marginTop: 12 }}>
            <Button primary onClick={() => void refresh()}>
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <FleetProvider fleetRaw={fleet} tick={tick} source="pi" loading={loading} error={error}>
      <HashRouter>
        <div className="dsc-root">
          <App hass={hass} surfaceVersion={surface} hassRevision={tick} fleetSource="pi" />
        </div>
      </HashRouter>
    </FleetProvider>
  );
}

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <StrictMode>
      <BrainProvider>
        <ErrorBoundary>
          <PiApp />
        </ErrorBoundary>
      </BrainProvider>
    </StrictMode>,
  );
}
