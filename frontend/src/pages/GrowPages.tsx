import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ComposePlant } from "../components/ComposePlant";
import { CatalogResearch } from "../components/CatalogResearch";
import { RosterLifecycleDialogs } from "../components/roster/RosterLifecycleDialogs";
import { SlideDrawer } from "../components/chrome";
import { Button, Card, PageHeader, StatusChip } from "../components/ui";
import { HelpTip } from "../components/HelpTip";
import { useEntityBus } from "../hooks/useEntityBus";
import { useFleetActions } from "../hooks/useFleetActions";
import { useBrainRefresh } from "../hooks/useBrain";
import { PlantProbePanel } from "../components/PlantProbePanel";
import {
  isProbeInService,
  KIT_PROBE_NUMBERS,
  probeLabel,
  readTent,
  rosterSlots,
  tentLabel,
  normalizeTent,
} from "../lib/probeModel";
import { readProbeVessel } from "../lib/vesselSpec";
import { VesselGlyph } from "../components/VesselGlyph";
import { CropScheduler } from "../components/CropScheduler";
import { assignPlantToProbe, detachPlantFromProbe, retireRosterSlot } from "../lib/fleetApi";

export { PlantProbePanel } from "../components/PlantProbePanel";

export function GrowComposePage() {
  const navigate = useNavigate();
  return (
    <div className="dsc-page">
      <PageHeader
        icon="compose"
        title="Compose"
        subtitle="Step through strain, probe, soil, and optional feed — one confirm to add."
        primaryAction={
          <Button teal onClick={() => navigate("/grow/roster")}>
            Open Roster
          </Button>
        }
        actions={
          <>
            <HelpTip title="Compose draft">
              <p>
                Compose builds a draft in helpers, then one confirm commits the plant. Retiring a plant clears the draft
                helpers so the next compose starts empty — not half a leftover WIP.
              </p>
              <p>Example: delete plant on Probe 2 → reopen Compose → strain/probe steps should be blank.</p>
            </HelpTip>
            <Button primary onClick={() => navigate("/grow/research")}>
              Browse Catalog
            </Button>
          </>
        }
      />
      <p className="dsc-honesty" style={{ marginTop: 0 }}>
        Five steps: plant → probe &amp; soil → feed (skip ok) → light (skip ok) → review. Quick soil presets cover most
        mixes; catalog search fills in the rest. Kit probes only (Probe 1–2).
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
            <HelpTip title="Catalog honesty">
              <p>
                Research only shows chips the catalog actually has. Missing chem or height is a blank — never invented
                filler.
              </p>
              <p>
                <b>Use in Compose</b> drafts helpers for a new plant; <b>Open Roster</b> jumps to a plant already on the
                roster.
              </p>
            </HelpTip>
            <Button primary onClick={() => navigate("/grow/compose")}>
              Use in Compose
            </Button>
            <Button teal onClick={() => navigate("/grow/roster")}>
              Open Roster
            </Button>
          </>
        }
      />
      <p className="dsc-honesty" style={{ marginTop: 0 }}>
        Height, flowering, and chemistry chips appear only when the catalog has real data — gaps are shown as gaps.
        Use in Compose to draft a plant, or Open Roster to work with a plant already assigned.
      </p>
      <CatalogResearch />
    </div>
  );
}

export function GrowRosterPage() {
  const { entity, state, tick } = useEntityBus();
  const { callService } = useFleetActions();
  const refreshBrain = useBrainRefresh();
  const [params, setParams] = useSearchParams();
  const [retireProbe, setRetireProbe] = useState<number | null>(null);
  const [retireSlot, setRetireSlot] = useState<number | null>(null);
  const [retireErr, setRetireErr] = useState<string | null>(null);
  const [detachProbe, setDetachProbe] = useState<number | null>(null);
  const [lifecycleErr, setLifecycleErr] = useState<string | null>(null);
  const [assignSlot, setAssignSlot] = useState<number | null>(null);
  const [assignProbe, setAssignProbe] = useState<number>(KIT_PROBE_NUMBERS[0] ?? 1);
  void tick;
  const allSlots = rosterSlots(entity);
  const slots = allSlots.filter((s) => {
    const st = String(s.status || "");
    return !["empty", "", "unknown", "unavailable"].includes(st);
  });
  const vacantProbes = KIT_PROBE_NUMBERS.filter((n) => {
    if (!isProbeInService(n, state)) return false;
    const claimedOnRoster = allSlots.some((s) => {
      const p = Number(s.pot);
      return Number.isFinite(p) && p === n;
    });
    if (claimedOnRoster) return false;
    const name = state(`text.dsc_probe${n}_plant_name`, "").trim();
    return !name;
  });
  const raw = Number(params.get("pot") || 0);
  const probe =
    raw >= 1 &&
    (KIT_PROBE_NUMBERS as readonly number[]).includes(raw) &&
    isProbeInService(raw, state)
      ? raw
      : null;

  const openProbe = (n: number) => {
    if (!(KIT_PROBE_NUMBERS as readonly number[]).includes(n) || !isProbeInService(n, state)) return;
    const next = new URLSearchParams(params);
    next.set("pot", String(n));
    setParams(next, { replace: true });
  };

  const closeProbe = () => {
    const next = new URLSearchParams(params);
    next.delete("pot");
    setParams(next, { replace: true });
  };

  const confirmRetire = async () => {
    if (retireSlot != null) {
      setRetireErr(null);
      try {
        await retireRosterSlot(retireSlot);
        await refreshBrain();
        if (retireProbe != null && probe === retireProbe) closeProbe();
        setRetireSlot(null);
        setRetireProbe(null);
      } catch (exc) {
        setRetireErr(exc instanceof Error ? exc.message : "Delete failed");
      }
      return;
    }
    if (retireProbe == null) return;
    setRetireErr(null);
    try {
      await callService("script", "turn_on", {
        entity_id: "script.dsc_plant_retire",
        pot: String(retireProbe),
        variables: { pot: String(retireProbe) },
      });
      await refreshBrain();
      if (probe === retireProbe) closeProbe();
      setRetireProbe(null);
    } catch (exc) {
      setRetireErr(exc instanceof Error ? exc.message : "Delete failed");
    }
  };

  const confirmDetach = async () => {
    if (detachProbe == null) return;
    setLifecycleErr(null);
    try {
      await detachPlantFromProbe(detachProbe);
      await refreshBrain();
      if (probe === detachProbe) closeProbe();
      setDetachProbe(null);
    } catch (exc) {
      setLifecycleErr(exc instanceof Error ? exc.message : "Detach failed");
    }
  };

  const confirmAssign = async () => {
    if (assignSlot == null) return;
    setLifecycleErr(null);
    try {
      await assignPlantToProbe(assignSlot, assignProbe);
      await refreshBrain();
      setAssignSlot(null);
    } catch (exc) {
      setLifecycleErr(exc instanceof Error ? exc.message : "Assign failed");
    }
  };

  return (
    <div className="dsc-page">
      <PageHeader
        icon="roster"
        title="Roster"
        subtitle="Detach frees a probe without deleting the plant; Delete retires the plant."
        primaryAction={
          <Link to="/grow/compose">
            <Button primary>Use in Compose</Button>
          </Link>
        }
        actions={
          <HelpTip title="Detach vs Delete">
            <p>
              <b>Detach</b> keeps the plant on the roster with no probe. <b>Assign</b> binds a detached plant to a vacant
              kit probe. <b>Delete</b> destroys the plant.
            </p>
            <p>Probe-station home and SoftCal are separate layers — they are not detach.</p>
          </HelpTip>
        }
      />
      <div style={{ marginBottom: 14 }}>
        <CropScheduler compact />
      </div>
      <Card className="dsc-glass" title="Roster" icon="roster">
        {!slots.length ? (
          <p className="dsc-muted" style={{ marginTop: 0 }}>
            No plants in roster yet. Commit from Compose, then assign a probe.
          </p>
        ) : (
          <table className="dsc-table">
            <thead>
              <tr>
                <th>Slot</th>
                <th>Name</th>
                <th>Strain</th>
                <th>Status</th>
                <th>Probe</th>
                <th>Need</th>
                <th>Tent</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {slots.map((s) => {
                const p = Number(s.pot);
                const joined = p >= 1 && p <= 4;
                const probeLive = joined && isProbeInService(p, state);
                const probeTent = joined ? readTent(state, p) : "unassigned";
                const tent = tentLabel(probeTent !== "unassigned" ? probeTent : normalizeTent(s.tent));
                const need = joined ? state(`sensor.dsc_probe${p}_need_summary`, "—") : "—";
                const vessel = joined ? readProbeVessel(p, state, entity) : null;
                return (
                  <tr
                    key={s.slot}
                    className={probeLive ? "dsc-table-row--pot-live" : undefined}
                  >
                    <td>#{s.slot}</td>
                    <td>{s.nickname || "—"}</td>
                    <td>{s.strain || "—"}</td>
                    <td>{s.status || "—"}</td>
                    <td>
                      {joined ? (
                        <span className="dsc-chip-row">
                          {vessel ? <VesselGlyph spec={vessel} size={22} /> : null}
                          {probeLabel(p)}
                          {!probeLive ? <StatusChip label="Out of service" tone="warn" /> : null}
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
                      <div className="dsc-chip-row" style={{ flexWrap: "wrap", gap: 6 }}>
                        {probeLive ? (
                          <Button onClick={() => openProbe(p)}>Edit</Button>
                        ) : null}
                        {joined ? (
                          <Button
                            onClick={() => {
                              setLifecycleErr(null);
                              setDetachProbe(p);
                            }}
                          >
                            Detach
                          </Button>
                        ) : null}
                        {!joined && vacantProbes.length ? (
                          <Button
                            onClick={() => {
                              setLifecycleErr(null);
                              setAssignProbe(vacantProbes[0] ?? 1);
                              setAssignSlot(Number(s.slot));
                            }}
                          >
                            Assign
                          </Button>
                        ) : null}
                        {joined ? (
                          <Button
                            variant="danger"
                            onClick={() => {
                              setRetireErr(null);
                              setRetireProbe(p);
                              setRetireSlot(Number(s.slot));
                            }}
                          >
                            Delete
                          </Button>
                        ) : (
                          <Button
                            variant="danger"
                            onClick={() => {
                              setRetireErr(null);
                              setRetireProbe(null);
                              setRetireSlot(Number(s.slot));
                            }}
                          >
                            Delete
                          </Button>
                        )}
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
        {lifecycleErr ? (
          <p className="dsc-honesty">
            <StatusChip label="Lifecycle failed" tone="bad" /> {lifecycleErr}
          </p>
        ) : null}
      </Card>

      <RosterLifecycleDialogs
        detachProbe={detachProbe}
        onDismissDetach={() => setDetachProbe(null)}
        onConfirmDetach={() => {
          void confirmDetach();
        }}
        assignSlot={assignSlot}
        assignProbe={assignProbe}
        onAssignProbeChange={setAssignProbe}
        vacantProbes={vacantProbes}
        onDismissAssign={() => setAssignSlot(null)}
        onConfirmAssign={() => {
          void confirmAssign();
        }}
        retireSlot={retireSlot}
        retireProbe={retireProbe}
        onDismissRetire={() => {
          setRetireSlot(null);
          setRetireProbe(null);
        }}
        onConfirmRetire={() => {
          void confirmRetire();
        }}
      />

      <SlideDrawer
        open={probe != null}
        onClose={closeProbe}
        title={probe != null ? `${probeLabel(probe)} · plant` : "Plant"}
        wide
      >
        {probe != null ? (
          <PlantProbePanel probe={probe} onSelectProbe={openProbe} onRetired={closeProbe} />
        ) : null}
      </SlideDrawer>
    </div>
  );
}
