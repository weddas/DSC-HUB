import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DecisionLayer } from "./DecisionLayer";
import { PlantProbePanel } from "../pages/GrowPages";
import { Button } from "./ui";

/**
 * I-15 / U-09: a probe pick (Overview / Crop scheduler / Mission) opens a plant layer on the CURRENT page.
 * Optional "Open Root" — not a forced /live/root hop.
 */
export function ProbeOverlayHost() {
  const [probe, setProbe] = useState<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onSelect = (ev: Event) => {
      const detail = (ev as CustomEvent<{ probe?: number | string }>).detail;
      const n = Number(detail?.probe);
      if (n >= 1 && n <= 4) setProbe(n);
    };
    window.addEventListener("dsc-dash-select-probe", onSelect);
    return () => window.removeEventListener("dsc-dash-select-probe", onSelect);
  }, []);

  const close = useCallback(() => setProbe(null), []);

  const help: ReactNode = null;

  return (
    <DecisionLayer
      open={probe != null}
      onDismiss={close}
      title={probe != null ? `Plant · Probe ${probe}` : "Plant"}
      help={help}
    >
      {probe != null ? (
        <>
          <PlantProbePanel probe={probe} onSelectProbe={setProbe} onRetired={close} />
          {location.pathname !== "/live/root" ? (
            <div className="dsc-row-actions" style={{ marginTop: 12 }}>
              <Button
                teal
                onClick={() => {
                  const n = probe;
                  close();
                  navigate(`/live/root?pot=${n}`);
                }}
              >
                Open Root
              </Button>
            </div>
          ) : null}
        </>
      ) : null}
    </DecisionLayer>
  );
}
