import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { App } from "./App";
import { BrainProvider, useBrainContext } from "./hooks/useBrain";
import "./styles/dsc.css";

function PiApp() {
  const { hass, fleet } = useBrainContext();
  const surface =
    (fleet?.surface as string | undefined) ??
    (fleet?.expected_firmware ? `7.0.0 (${fleet.expected_firmware})` : "7.0.0-dev");
  return (
    <HashRouter>
      <App hass={hass} surfaceVersion={surface} />
    </HashRouter>
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
