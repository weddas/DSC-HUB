import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { LegacyCardHost } from "../components/LegacyCardHost";
import { OverflowMenu, SoilCrossSection, SlideDrawer } from "../components/chrome";
import { Button, Card, Icon, PageHeader, StatusChip } from "../components/ui";
import { useHass } from "../hooks/useHass";
import {
  buildPlantSeat,
  rosterSlots,
  tentLabel,
  readTent,
  type TentId,
} from "../lib/seatModel";

/** Shared seat body for Root / Roster drawers (Surface 7.0 — no standalone seat route). */
export function PlantSeatPanel({
  pot,
  onSelectPot,
}: {
  pot: number;
  onSelectPot?: (n: number) => void;
}) {
  const { state, entity, callService, tick } = useHass();
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
    <div className="dsc-seat-panel">
      <div className="dsc-chip-row" style={{ marginBottom: 14 }}>
        {[1, 2, 3, 4].map((n) => (
          <button
            key={n}
            type="button"
            className={`dsc-chip${n === pot ? " dsc-chip--ok" : ""}`}
            onClick={() => onSelectPot?.(n)}
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
            <Card className="dsc-glass" title="Identity">
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
                      id: "compose",
                      label: "Open Compose",
                      onSelect: () => navigate("/grow/compose"),
                    },
                    {
                      id: "root",
                      label: "Root zone",
                      onSelect: () => navigate("/live/root"),
                    },
                    {
                      id: "twin",
                      label: "Open Twin",
                      onSelect: () => navigate("/live/twin"),
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
              {seat.notes ? (
                <p className="dsc-muted" style={{ margin: 0 }}>
                  {seat.notes}
                </p>
              ) : null}
              <div style={{ marginTop: 10 }}>
                <Link to="/grow/compose">
                  <Button teal>Mix in Compose</Button>
                </Link>
              </div>
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
                Digital-twin placement. Moves the plant on Twin; does not rewrite climate Want.
              </p>
              <div className="dsc-seat-actions">
                <Button primary={seat.tent === "clone"} onClick={() => applyTent("clone")}>
                  Clone 2×4
                </Button>
                <Button primary={seat.tent === "main"} onClick={() => applyTent("main")}>
                  Main 4×8
                </Button>
                <Button onClick={() => applyTent("unassigned")}>Unassigned</Button>
                <Link to="/live/twin">
                  <Button>Open Twin</Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GrowComposePage() {
  const navigate = useNavigate();
  return (
    <div className="dsc-page">
      <PageHeader
        icon="compose"
        title="Compose"
        subtitle="Build soil blend, roster commit, and Want handoff."
        primaryAction={
          <Button teal onClick={() => navigate("/grow/roster")}>
            Open Roster
          </Button>
        }
      />
      <LegacyCardHost tag="dsc-build-plant-card" config={{}} />
    </div>
  );
}

export function GrowResearchPage() {
  const navigate = useNavigate();
  return (
    <div className="dsc-page">
      <PageHeader
        icon="research"
        title="Research"
        subtitle="Catalog browser over /local/dsc-catalog indexes."
        actions={
          <>
            <Button primary onClick={() => navigate("/grow/compose")}>
              Use in Compose
            </Button>
            <Button teal onClick={() => navigate("/grow/roster")}>
              Open Seat
            </Button>
          </>
        }
      />
      <LegacyCardHost tag="dsc-catalog-browse-card" config={{}} />
    </div>
  );
}

export function GrowRosterPage() {
  const { entity, state, tick } = useHass();
  const [params, setParams] = useSearchParams();
  void tick;
  const slots = rosterSlots(entity);
  const raw = Number(params.get("pot") || 0);
  const pot = raw >= 1 && raw <= 4 ? raw : null;

  const openPot = (n: number) => {
    const next = new URLSearchParams(params);
    next.set("pot", String(n));
    setParams(next, { replace: true });
  };

  const closePot = () => {
    const next = new URLSearchParams(params);
    next.delete("pot");
    setParams(next, { replace: true });
  };

  return (
    <div className="dsc-page">
      <PageHeader
        icon="roster"
        title="Roster"
        subtitle="Seats — open a row for Plant Seat drawer. Nutrient mix lives in Compose."
        primaryAction={
          <Link to="/grow/compose">
            <Button primary>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <Icon name="compose" size={14} /> Use in Compose
              </span>
            </Button>
          </Link>
        }
      />
      <Card className="dsc-glass" title="Roster" icon="roster">
        {!slots.length ? (
          <p className="dsc-muted" style={{ marginTop: 0 }}>
            No plants in roster yet. Commit from Compose, then assign a pot.
          </p>
        ) : (
          <table className="dsc-table">
            <thead>
              <tr>
                <th>Slot</th>
                <th>Name</th>
                <th>Strain</th>
                <th>Status</th>
                <th>Pot</th>
                <th>Tent</th>
              </tr>
            </thead>
            <tbody>
              {slots.map((s) => {
                const p = Number(s.pot);
                const tent = p >= 1 && p <= 4 ? tentLabel(readTent(state, p)) : "—";
                return (
                  <tr
                    key={s.slot}
                    onClick={() => {
                      if (p >= 1 && p <= 4) openPot(p);
                    }}
                    style={p >= 1 && p <= 4 ? { cursor: "pointer" } : undefined}
                  >
                    <td>#{s.slot}</td>
                    <td>{s.nickname || "—"}</td>
                    <td>{s.strain || "—"}</td>
                    <td>{s.status || "—"}</td>
                    <td>{p >= 1 && p <= 4 ? `P${p}` : "—"}</td>
                    <td>
                      <StatusChip label={tent} tone="muted" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>

      <SlideDrawer
        open={pot != null}
        onClose={closePot}
        title={pot != null ? `Plant seat · POT${pot}` : "Plant seat"}
      >
        {pot != null ? <PlantSeatPanel pot={pot} onSelectPot={openPot} /> : null}
      </SlideDrawer>
    </div>
  );
}
