import { useMemo, useRef } from "react";
import { useEntityBus } from "./useEntityBus";
import { useFleet } from "./useFleet";
import { useZones } from "./useZones";
import { fanPctChip } from "../lib/fanPlant";
import { resolveCfm } from "../lib/cfmProvenance";
import { rosterSlots } from "../lib/probeModel";
import {
  FAN_DEFS,
  applyOverrides,
  plantsFromRoster,
  withBindings,
  zoneFromModel,
  type TwinAppliance,
  type TwinApplianceId,
  type TwinEntityProbe,
  type TwinFan,
  type TwinLamp,
  type TwinOverrides,
  type TwinState,
} from "../lib/twinState";

/**
 * The twin's view of Zone state (plan § 3D twin rule 2: a view, never a data source).
 * Readings come from `useZones`; fans from the shared fan plant + CFM provenance; plants
 * from the roster summary; probe moisture tones from the zone probes. `overrides` is the
 * Twin page's what-if panel — applied last and flagged, never written anywhere.
 */
export function useTwinState(overrides?: TwinOverrides | null): TwinState {
  const bus = useEntityBus();
  const { state, num, entity, available, tick } = bus;
  const fleet = useFleet();
  const zones = useZones();

  const base = useMemo<TwinState>(() => {
    void tick;
    const fans: TwinFan[] = FAN_DEFS.map((d) => {
      const chip = fanPctChip({ available, num }, d.pctEntity);
      let pct = chip.pct;
      let live = chip.live;
      let pctEntity = d.pctEntity;
      if (!live) {
        // The hub control mirrors the fan's percentage when the sensor is absent.
        const ctrl = entity(d.ctrlEntity);
        const p = Number(ctrl?.attributes?.percentage ?? NaN);
        if (ctrl && Number.isFinite(p)) {
          pct = ctrl.state === "off" ? 0 : p;
          live = true;
          pctEntity = d.ctrlEntity;
        }
      }
      const cfm = resolveCfm(d.cfmAllocated, d.cfmNameplate, { available, num });
      return {
        id: d.id,
        label: d.label,
        pct,
        cfm: cfm.value,
        cfmEntity: cfm.entityId,
        pctEntity,
        live,
        simulated: false,
      };
    });

    const lamps: TwinLamp[] = [];
    for (const z of [zones.clone, zones.main]) {
      if (!z.lamp) continue;
      lamps.push({
        zone: z.id,
        entityId: z.lamp.entityId,
        label: z.lamp.kind === "twin" ? "Twin SF1000" : z.lamp.kind === "window" ? "Schedule window" : "SF1000",
        on: z.lamp.on,
        brightnessPct: z.lamp.brightnessPct,
        available: z.lamp.available && z.lamp.kind !== "window",
        simulated: false,
      });
    }

    const appliances: TwinAppliance[] = [];
    for (const z of [zones.main, zones.clone]) {
      for (const a of z.appliances) {
        if (a.id === "clone_mode") continue;
        appliances.push({
          id: a.id as TwinApplianceId,
          zone: z.id,
          label: a.label,
          state: a.state,
          entityId: a.entityId,
          simulated: false,
        });
      }
    }

    const probeTone = new Map<number, { moisture: number; tone: TwinState["plants"][number]["moistureTone"] }>();
    for (const z of [zones.main, zones.clone]) for (const p of z.probes) probeTone.set(p.n, { moisture: p.moisture, tone: p.tone });
    const inService = (n: number) => {
      const raw = state(`input_boolean.dsc_probe${n}_in_service`, "off");
      return raw === "on";
    };
    const plants = plantsFromRoster(rosterSlots(entity), {
      state,
      num,
      probeInService: inService,
      moistureOf: (n) => probeTone.get(n)?.moisture ?? NaN,
      moistureTone: (n) => probeTone.get(n)?.tone ?? "muted",
    });

    const cascade = resolveCfm("sensor.dsc_cfm_cascade_2x4_allocated", "sensor.dsc_cfm_cascade_2x4_allocated", { available, num });
    return {
      zones: { main: zoneFromModel(zones.main), clone: zoneFromModel(zones.clone), room: zoneFromModel(zones.room) },
      fans,
      lamps,
      appliances,
      plants,
      cascadeCfm: available(cascade.entityId) ? cascade.value : NaN,
      cascadeEntity: cascade.entityId,
      hubOnline: fleet.hub.online,
      panelOnline: !!fleet.panel?.online,
      panelKnown: !!fleet.panel,
      simulated: false,
      bindings: {},
      bindingSummary: { total: 0, live: 0, simulated: 0, held: 0, noData: 0, missing: 0, unbound: 0 },
      updatedAt: fleet.updated_at,
    };
  }, [tick, zones, fleet, state, num, entity, available]);

  // The honesty contract: every scene instance resolved against the fleet *after* the
  // what-if overrides, so an overridden node reads SIMULATED and an absent one reads
  // UNBOUND / NO DATA rather than borrowing a neighbour's number.
  const probe = useMemo<TwinEntityProbe>(
    () => ({
      known: (id: string) => entity(id) != null,
      available,
      text: (id: string) => {
        const raw = state(id, "");
        return raw && raw !== "—" ? raw : null;
      },
    }),
    [entity, available, state],
  );
  const next = useMemo(() => withBindings(applyOverrides(base, overrides), probe), [base, overrides, probe]);
  // Hand the stage the same object while nothing it draws has changed: the bus ticks far
  // more often than a reading moves, and every new object re-renders the whole scene.
  const stable = useRef<{ key: string; value: TwinState } | null>(null);
  // `heldAt` moves on every bus tick even while the value holds still — it is not drawn.
  const key = JSON.stringify(next, (k, v) => (k === "updatedAt" || k === "heldAt" ? undefined : typeof v === "number" && Number.isNaN(v) ? "NaN" : v));
  if (!stable.current || stable.current.key !== key) stable.current = { key, value: next };
  return stable.current.value;
}
