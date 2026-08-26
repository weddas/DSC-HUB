import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { App } from "./App";
import { BrainProvider, useBrainContext } from "./hooks/useBrain";
import { FleetProvider } from "./hooks/useFleet";
import "./styles/dsc.css";

function PiApp() {
  const { hass, fleet, tick, loading, error } = useBrainContext();
  const surface =
    (fleet?.surface as string | undefined) ??
    (fleet?.expected_firmware ? `7.0.0 (${fleet.expected_firmware})` : "7.0.0");
  if (loading && !fleet) {
    return (
      <div className="dsc-shell" style={{ padding: 24 }}>
        <p className="dsc-muted">Connecting to fleet…</p>
      </div>
    );
  }
  if (error && !fleet) {
    return (
      <div className="dsc-shell" style={{ padding: 24 }}>
        <p className="dsc-honesty">Fleet unavailable: {error}</p>
      </div>
    );
  }
  return (
    <FleetProvider fleetRaw={fleet} tick={tick} source="pi" loading={loading} error={error}>
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
        <PiApp />
      </BrainProvider>
    </StrictMode>,
  );
}
