import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DecisionLayer } from "./DecisionLayer";
import { PlantSeatPanel } from "../pages/GrowPages";
import { Button } from "./ui";

/**
 * I-15 / U-09: Twin pot pick opens a seat layer on the CURRENT page.
 * Optional "Open Root" — not a forced /live/root hop.
 */
export function SeatOverlayHost() {
  const [pot, setPot] = useState<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onSelect = (ev: Event) => {
      const detail = (ev as CustomEvent<{ pot?: number | string }>).detail;
      const n = Number(detail?.pot);
      if (n >= 1 && n <= 4) setPot(n);
    };
    window.addEventListener("dsc-dash-select-pot", onSelect);
    return () => window.removeEventListener("dsc-dash-select-pot", onSelect);
  }, []);

  const close = useCallback(() => setPot(null), []);

  const help: ReactNode = null;

  return (
    <DecisionLayer
      open={pot != null}
      onDismiss={close}
      title={pot != null ? `Plant seat · POT${pot}` : "Plant seat"}
      help={help}
    >
      {pot != null ? (
        <>
          <PlantSeatPanel pot={pot} onSelectPot={setPot} onRetired={close} />
          {location.pathname !== "/live/root" ? (
            <div className="dsc-row-actions" style={{ marginTop: 12 }}>
              <Button
                teal
                onClick={() => {
                  const n = pot;
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
