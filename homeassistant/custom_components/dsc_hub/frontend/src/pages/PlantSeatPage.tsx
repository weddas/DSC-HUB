import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { OverflowMenu, SoilCrossSection } from "../components/chrome";
import { Button, Card, PageHeader, StatusChip } from "../components/ui";
import { useHass } from "../hooks/useHass";
import {
  buildPlantSeat,
  tentLabel,
  type TentId,
} from "../lib/seatModel";

function usePotParam(defaultPot = 1): [number, (n: number) => void] {
  const [params, setParams] = useSearchParams();
  const raw = Number(params.get("pot") || defaultPot);
  const pot = raw >= 1 && raw <= 4 ? raw : defaultPot;
  const setPot = (n: number) => {
    const next = new URLSearchParams(params);
    next.set("pot", String(n));
    setParams(next, { replace: true });
  };
  return [pot, setPot];
}

export function PlantSeatPage() {
  const { state, entity, callService, tick } = useHass();
  const [pot, setPot] = usePotParam(1);
  const navigate = useNavigate();
  void tick;
  const seat = buildPlantSeat(pot, { state, entity });

  const applyTent = (tent: TentId) => {
    void callService("script", "turn_on", {
      entity_id: "script.dsc_apply_pot_to_tent",
      variables: { pot: String(pot), tent },
    });
  };

  return (
    <div className="dsc-page">
      <PageHeader
        icon="seat"
        title={`Plant seat · POT${pot}`}
        subtitle="Soil, age, nutrients, live Got — apply tent to move on The Dash."
      />

      <div className="dsc-chip-row" style={{ marginBottom: 14 }}>
        {[1, 2, 3, 4].map((n) => (
          <button
            key={n}
            type="button"
            className={`dsc-chip${n === pot ? " dsc-chip--ok" : ""}`}
            onClick={() => setPot(n)}
          >
            P{n}
          </button>
        ))}
        <StatusChip label={tentLabel(seat.tent)} tone={seat.tent === "unassigned" ? "muted" : "ok"} />
        {seat.rosterSlot != null ? (
          <StatusChip label={`Roster #${seat.rosterSlot}`} tone="muted" />
        ) : (
          <StatusChip label="No roster join" tone="warn" />
        )}
      </div>

      <div className="dsc-seat-layout">
        <Card className="dsc-glass dsc-glass--glow" title="Medium">
          <SoilCrossSection layers={seat.layers} />
          <p className="dsc-muted" style={{ marginTop: 10, fontSize: 12 }}>
            {seat.blend || "Blend lives on roster after commit — not invented here."}
          </p>
        </Card>

        <div className="dsc-grid" style={{ gap: 14 }}>
          <div className="dsc-col-12">
            <Card
              className="dsc-glass"
              title="Identity"
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div className="dsc-kpi-value" style={{ fontSize: "1.45rem" }}>
                    {seat.plantName !== "—" ? seat.plantName : `POT${pot}`}
                  </div>
                  <div className="dsc-kpi-sub">{seat.strainDisplay}</div>
                  <div className="dsc-chip-row" style={{ marginTop: 10 }}>
                    <StatusChip label={`Day ${seat.days}`} tone="ok" />
                    <StatusChip label={seat.stage} tone="muted" />
                    <StatusChip label={`Sprout ${seat.sprout}`} tone="muted" />
                  </div>
                </div>
                <OverflowMenu
                  items={[
                    {
                      id: "build",
                      label: "Open Build",
                      onSelect: () => navigate("/plant/build"),
                    },
                    {
                      id: "root",
                      label: "Root zone",
                      onSelect: () => navigate("/ops/root-zone"),
                    },
                    {
                      id: "dash",
                      label: "Open Dash",
                      onSelect: () => navigate("/ops/dash"),
                    },
                  ]}
                />
              </div>
            </Card>
          </div>

          <div className="dsc-col-6">
            <Card title="Nutrition">
              <p style={{ margin: "0 0 6px" }}>
                {seat.recipe || "No roster recipe — catalog doses only, never invented."}
              </p>
              {seat.notes ? <p className="dsc-muted" style={{ margin: 0 }}>{seat.notes}</p> : null}
            </Card>
          </div>

          <div className="dsc-col-6">
            <Card title="Live Got">
              <div className="dsc-chip-row">
                <StatusChip label={`M ${seat.moisture}`} tone="muted" />
                <StatusChip label={`T ${seat.soilTemp}`} tone="muted" />
                <StatusChip label={`EC ${seat.ec}`} tone="muted" />
                <StatusChip label={`pH ${seat.ph}`} tone="muted" />
                <StatusChip label={`N ${seat.n}`} tone="muted" />
                <StatusChip label={`P ${seat.p}`} tone="muted" />
                <StatusChip label={`K ${seat.k}`} tone="muted" />
                <StatusChip
                  label={seat.need}
                  tone={seat.need !== "—" && seat.need !== "OK" ? "warn" : "ok"}
                />
              </div>
              <p className="dsc-muted" style={{ margin: "8px 0 0", fontSize: 12 }}>
                NPK = trend indicators. Unavailable stays —.
              </p>
            </Card>
          </div>

          <div className="dsc-col-12">
            <Card className="dsc-glass" title="Apply to tent">
              <p className="dsc-muted" style={{ marginTop: 0 }}>
                Digital-twin placement. Moves the plant on The Dash; does not rewrite climate Want.
              </p>
              <div className="dsc-seat-actions">
                <Button primary={seat.tent === "clone"} onClick={() => applyTent("clone")}>
                  Clone 2×4
                </Button>
                <Button primary={seat.tent === "main"} onClick={() => applyTent("main")}>
                  Main 4×8
                </Button>
                <Button onClick={() => applyTent("unassigned")}>Unassigned</Button>
                <Link to="/ops/dash">
                  <Button>Open Dash</Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
