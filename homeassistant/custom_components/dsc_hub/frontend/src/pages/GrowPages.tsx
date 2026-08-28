import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ComposePlant } from "../components/ComposePlant";
import { CatalogResearch } from "../components/CatalogResearch";
import { DecisionLayer } from "../components/DecisionLayer";
import { SlideDrawer } from "../components/chrome";
import { Button, Card, PageHeader, StatusChip } from "../components/ui";
import { HelpTip } from "../components/HelpTip";
import { useEntityBus } from "../hooks/useEntityBus";
import { useFleetActions } from "../hooks/useFleetActions";
import { PlantSeatPanel } from "../components/PlantSeatPanel";
import {
  isPotInService,
  readTent,
  rosterSlots,
  tentLabel,
  normalizeTent,
} from "../lib/seatModel";
import { readPotVessel } from "../lib/vesselSpec";
import { VesselGlyph } from "../components/VesselGlyph";
import { CropScheduler } from "../components/CropScheduler";

export { PlantSeatPanel } from "../components/PlantSeatPanel";

export function GrowComposePage() {
  const navigate = useNavigate();
  return (
    <div className="dsc-page">
      <PageHeader
        icon="compose"
        title="Compose"
        subtitle="Step through strain, pot, soil, and optional feed — one confirm to add."
        primaryAction={
          <Button teal onClick={() => navigate("/grow/roster")}>
            Open Roster / Seat
          </Button>
        }
        actions={
          <>
            <HelpTip title="Compose draft">
              <p>
                Compose builds a draft in helpers, then one confirm commits the plant. Retiring a plant clears the draft
                helpers so the next compose starts empty — not half a leftover WIP.
              </p>
              <p>Example: delete plant on POT3 → reopen Compose → strain/pot steps should be blank, ready for the next seat.</p>
            </HelpTip>
            <Button primary onClick={() => navigate("/grow/research")}>
              Browse Catalog
            </Button>
          </>
        }
      />
      <p className="dsc-honesty" style={{ marginTop: 0 }}>
        Five steps: plant → pot &amp; soil → feed (skip ok) → light (skip ok) → review. Quick soil presets cover most
        mixes; catalog search fills in the rest.
      </p>
      <ComposePlant />
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
        subtitle="Live CannaLib catalog — strains, mediums, nutrients, and lights."
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
      <p className="dsc-honesty" style={{ marginTop: 0 }}>
        Height, flowering, and chemistry chips appear only when the catalog has real data — gaps are shown as gaps.
        Use in Compose to draft a plant, or Open Seat to work with a plant already on the roster.
      </p>
      <CatalogResearch />
    </div>
  );
}

export function GrowRosterPage() {
  const { entity, state, tick } = useEntityBus();
  const { callService } = useFleetActions();
  const [params, setParams] = useSearchParams();
  const [retirePot, setRetirePot] = useState<number | null>(null);
  const [retireErr, setRetireErr] = useState<string | null>(null);
  void tick;
  const slots = rosterSlots(entity);
  const raw = Number(params.get("pot") || 0);
  const pot = raw >= 1 && raw <= 4 && isPotInService(raw, state) ? raw : null;

  const openPot = (n: number) => {
    if (!isPotInService(n, state)) return;
    const next = new URLSearchParams(params);
    next.set("pot", String(n));
    setParams(next, { replace: true });
  };

  const closePot = () => {
    const next = new URLSearchParams(params);
    next.delete("pot");
    setParams(next, { replace: true });
  };

  const confirmRetire = async () => {
    if (retirePot == null) return;
    setRetireErr(null);
    try {
      await callService("script", "turn_on", {
        entity_id: "script.dsc_plant_retire",
        pot: String(retirePot),
        variables: { pot: String(retirePot) },
      });
      if (pot === retirePot) closePot();
      setRetirePot(null);
    } catch (exc) {
      setRetireErr(exc instanceof Error ? exc.message : "Delete failed");
    }
  };

  return (
    <div className="dsc-page">
      <PageHeader
        icon="roster"
        title="Roster"
        subtitle="Seats — Edit opens the plant drawer; Delete clears pot + roster slot."
        primaryAction={
          <Link to="/grow/compose">
            <Button primary>Use in Compose</Button>
          </Link>
        }
        actions={
          <HelpTip title="Edit vs Delete">
            <p>
              <b>Edit</b> opens the seat drawer for identity, tent, and notes. <b>Delete</b> retires the plant and clears
              the pot slot — Compose draft helpers clear too.
            </p>
            <p>Out-of-service pots stay on Root grey; they will not appear as live roster seats until In service is back on.</p>
          </HelpTip>
        }
      />
      <div style={{ marginBottom: 14 }}>
        <CropScheduler compact />
      </div>
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
                <th>Need</th>
                <th>Tent</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {slots.map((s) => {
                const p = Number(s.pot);
                const joined = p >= 1 && p <= 4;
                const potLive = joined && isPotInService(p, state);
                const potTent = joined ? readTent(state, p) : "unassigned";
                const tent = tentLabel(potTent !== "unassigned" ? potTent : normalizeTent(s.tent));
                const need = joined ? state(`sensor.dsc_pot${p}_need_summary`, "—") : "—";
                const vessel = joined ? readPotVessel(p, state, entity) : null;
                return (
                  <tr
                    key={s.slot}
                    className={potLive ? "dsc-table-row--pot-live" : undefined}
                  >
                    <td>#{s.slot}</td>
                    <td>{s.nickname || "—"}</td>
                    <td>{s.strain || "—"}</td>
                    <td>{s.status || "—"}</td>
                    <td>
                      {joined ? (
                        <span className="dsc-chip-row">
                          {vessel ? <VesselGlyph spec={vessel} size={22} /> : null}
                          P{p}
                          {!potLive ? <StatusChip label="Out of service" tone="warn" /> : null}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>{need}</td>
                    <td>
                      <StatusChip label={tent} tone="muted" />
                    </td>
                    <td>
                      <div className="dsc-chip-row" style={{ flexWrap: "nowrap", gap: 6 }}>
                        {potLive ? (
                          <Button onClick={() => openPot(p)}>Edit</Button>
                        ) : null}
                        {joined ? (
                          <Button
                            variant="danger"
                            onClick={() => {
                              setRetireErr(null);
                              setRetirePot(p);
                            }}
                          >
                            Delete
                          </Button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {retireErr ? (
          <p className="dsc-honesty">
            <StatusChip label="Delete failed" tone="bad" /> {retireErr}
          </p>
        ) : null}
      </Card>

      <DecisionLayer
        open={retirePot != null}
        onDismiss={() => setRetirePot(null)}
        onConfirm={() => {
          void confirmRetire();
        }}
        title={retirePot != null ? `Delete plant on pot ${retirePot}?` : "Delete plant"}
        confirmLabel="Delete plant"
        help={null}
      >
        <p>
          Removes the plant from pot {retirePot} and clears its roster slot. Probe home assignment is unchanged.
        </p>
      </DecisionLayer>

      <SlideDrawer
        open={pot != null}
        onClose={closePot}
        title={pot != null ? `Plant seat · POT${pot}` : "Plant seat"}
        wide
      >
        {pot != null ? (
          <PlantSeatPanel pot={pot} onSelectPot={openPot} onRetired={closePot} />
        ) : null}
      </SlideDrawer>
    </div>
  );
}
