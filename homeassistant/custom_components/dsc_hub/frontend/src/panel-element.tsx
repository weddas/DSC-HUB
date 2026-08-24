import { useEffect, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { App, DSC_PANEL_CSS } from "./App";
import { FleetProvider } from "./hooks/useFleet";
import type { HomeAssistant } from "./vite-env";

function PanelRoot({
  panel,
}: {
  panel: DscHubPanel;
}) {
  const [hass, setHass] = useState<HomeAssistant | null>(() => panel.hass);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const sync = () => {
      setHass(panel.hass);
      setTick((t) => t + 1);
    };
    sync();
    panel.addEventListener("hass-updated", sync);
    return () => {
      panel.removeEventListener("hass-updated", sync);
    };
  }, [panel]);

  return (
    <FleetProvider hass={hass} tick={tick} source="ha">
      <HashRouter>
        <App hass={hass} fleetSource="ha" />
      </HashRouter>
    </FleetProvider>
  );
}

class DscHubPanel extends HTMLElement {
  private _root: Root | null = null;
  private _hass: HomeAssistant | null = null;
  private _mounted = false;

  set hass(hass: HomeAssistant) {
    this._hass = hass;
    this.dispatchEvent(new Event("hass-updated"));
  }

  get hass(): HomeAssistant | null {
    return this._hass;
  }

  connectedCallback() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
    }
    if (!this._mounted) {
      const style = document.createElement("style");
      style.textContent = `:host{display:block;height:100%;background:#0a0e18;color:#eef1f8;}\n${DSC_PANEL_CSS}`;
      this.shadowRoot!.appendChild(style);

      const mount = document.createElement("div");
      mount.className = "dsc-root";
      mount.style.height = "100%";
      this.shadowRoot!.appendChild(mount);

      this._root = createRoot(mount);
      this._root.render(<PanelRoot panel={this} />);
      this._mounted = true;
    }
  }

  disconnectedCallback() {
    this._root?.unmount();
    this._root = null;
    this._mounted = false;
  }
}

if (!customElements.get("dsc-hub-panel")) {
  customElements.define("dsc-hub-panel", DscHubPanel);
}

export default DscHubPanel;
