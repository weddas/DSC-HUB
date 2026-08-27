import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useEntityBus } from "../hooks/useEntityBus";
import { useEntitySeries } from "../hooks/useEntitySeries";
import { useChartHours } from "../hooks/useChartHours";
import { withPriorGhost } from "../lib/chartSeries";
import { SlideDrawer } from "./chrome";
import { TimespanControl, CYCLE_TIMESPAN_EXTRAS } from "./HistoryDrawer";
import { StatusChip } from "./ui";
import { MultiLineChart, type ChartTarget, type NamedSeries } from "../viz/charts";

export type BandChartKind = "temp" | "rh" | "vpd" | "root" | "pot1" | "pot2" | "pot3" | "pot4";

export type BandChartTarget = {
  kind: BandChartKind;
  title: string;
};

type BandChartApi = {
  open: (target: BandChartTarget) => void;
  close: () => void;
};

const BandChartCtx = createContext<BandChartApi | null>(null);

const ZONE = {
  main: "var(--dsc-blue)",
  clone: "var(--dsc-teal)",
  room: "var(--dsc-gray-5)",
} as const;

function resolveRoomVpdEntity(entity: (id: string) => unknown): string {
  if (entity("sensor.dsc_hub_room_vpd_kpa")) return "sensor.dsc_hub_room_vpd_kpa";
  if (entity("sensor.dsc_hub_room_vpd")) return "sensor.dsc_hub_room_vpd";
  return "sensor.dsc_hub_room_vpd_kpa";
}

function BandChartDrawer({ target, onClose }: { target: BandChartTarget | null; onClose: () => void }) {
  const { num, entity } = useEntityBus();
  const defaultHours = target?.kind.startsWith("pot") ? 48 : 24;
  const { hours, setHours, maxPoints } = useChartHours(defaultHours);

  useEffect(() => {
    if (target) setHours(defaultHours);
  }, [target, defaultHours, setHours]);
  const fetchPoints = Math.min(Math.max(maxPoints, 96), 288);

  const tentT = useEntitySeries("sensor.dsc_hub_tent_temperature", { hours, maxPoints: fetchPoints, withGhost: true });
  const cloneT = useEntitySeries("sensor.dsc_hub_clone_temperature", { hours, maxPoints: fetchPoints, withGhost: true });
  const roomT = useEntitySeries("sensor.dsc_hub_room_temperature", { hours, maxPoints: fetchPoints, withGhost: true });
  const tentRh = useEntitySeries("sensor.dsc_hub_tent_humidity", { hours, maxPoints: fetchPoints, withGhost: true });
  const cloneRh = useEntitySeries("sensor.dsc_hub_clone_humidity", { hours, maxPoints: fetchPoints, withGhost: true });
  const roomRh = useEntitySeries("sensor.dsc_hub_room_humidity", { hours, maxPoints: fetchPoints, withGhost: true });
  const tentVpd = useEntitySeries("sensor.dsc_hub_vpd_kpa", { hours, maxPoints: fetchPoints, withGhost: true });
  const cloneVpd = useEntitySeries("sensor.dsc_hub_clone_vpd_kpa", { hours, maxPoints: fetchPoints, withGhost: true });
  const roomVpdId = resolveRoomVpdEntity(entity);
  const roomVpd = useEntitySeries(roomVpdId, { hours, maxPoints: fetchPoints, withGhost: true });
  const leafVpd = useEntitySeries("sensor.dsc_leaf_vpd_kpa", { hours, maxPoints: fetchPoints, withGhost: true });
  const cloneLeafVpd = useEntitySeries("sensor.dsc_clone_leaf_vpd_kpa", { hours, maxPoints: fetchPoints, withGhost: true });
  const rootT = useEntitySeries("sensor.dsc_coldest_root_zone_temp", { hours, maxPoints: fetchPoints, withGhost: true });

  const potMoist1 = useEntitySeries("sensor.dsc_pot1_soil_moisture", { hours, maxPoints: fetchPoints, withGhost: true });
  const potMoist2 = useEntitySeries("sensor.dsc_pot2_soil_moisture", { hours, maxPoints: fetchPoints, withGhost: true });
  const potMoist3 = useEntitySeries("sensor.dsc_pot3_soil_moisture", { hours, maxPoints: fetchPoints, withGhost: true });
  const potMoist4 = useEntitySeries("sensor.dsc_pot4_soil_moisture", { hours, maxPoints: fetchPoints, withGhost: true });
  const potTemp1 = useEntitySeries("sensor.dsc_pot1_soil_temperature", { hours, maxPoints: fetchPoints, withGhost: true });
  const potTemp2 = useEntitySeries("sensor.dsc_pot2_soil_temperature", { hours, maxPoints: fetchPoints, withGhost: true });
  const potTemp3 = useEntitySeries("sensor.dsc_pot3_soil_temperature", { hours, maxPoints: fetchPoints, withGhost: true });
  const potTemp4 = useEntitySeries("sensor.dsc_pot4_soil_temperature", { hours, maxPoints: fetchPoints, withGhost: true });

  const targetTemp = num("number.dsc_hub_target_temp", 25);
  const cloneTargetTemp = num("number.dsc_hub_clone_target_temp", 24);
  const rhMin = num("number.dsc_hub_rh_target_min", 45);
  const rhMax = num("number.dsc_hub_rh_target_max", 70);
  const cloneRhMin = num("number.dsc_hub_clone_rh_min", 55);
  const cloneRhMax = num("number.dsc_hub_clone_rh_max", 75);
  const vpdMin = num("number.dsc_hub_vpd_target_min", 0.8);
  const vpdMax = num("number.dsc_hub_vpd_target_max", 1.4);
  const cloneVpdMin = num("number.dsc_hub_clone_vpd_min", 0.6);
  const cloneVpdMax = num("number.dsc_hub_clone_vpd_max", 1.2);
  const matLo = num("number.dsc_hub_mat_root_zone_low", 20);
  const matHi = num("number.dsc_hub_mat_root_zone_high", 24);

  const model = useMemo(() => {
    if (!target) return null;
    switch (target.kind) {
      case "temp":
        return {
          unit: "°C",
          height: 380,
          yDomain: { left: { min: 15, max: 35 } },
          series: [
            ...withPriorGhost("mt", "4×8 Tent", tentT, ZONE.main, "°C"),
            ...withPriorGhost("ct", "2×4 Clone", cloneT, ZONE.clone, "°C"),
            ...withPriorGhost("rt", "Room", roomT, ZONE.room, "°C"),
          ] satisfies NamedSeries[],
          targets: [
            { value: targetTemp, color: "var(--dsc-blue-dim)", label: "4×8 target" },
            { value: cloneTargetTemp, color: "var(--dsc-teal-dim)", label: "2×4 target" },
          ] satisfies ChartTarget[],
        };
      case "rh":
        return {
          unit: "%",
          height: 380,
          yDomain: { left: { min: 0, max: 100 } },
          series: [
            ...withPriorGhost("mrh", "4×8 Tent", tentRh, ZONE.main, "%"),
            ...withPriorGhost("crh", "2×4 Clone", cloneRh, ZONE.clone, "%"),
            ...withPriorGhost("rrh", "Room", roomRh, ZONE.room, "%"),
          ] satisfies NamedSeries[],
          targets: [
            { min: rhMin, max: rhMax, color: "var(--dsc-blue-dim)" },
            { min: cloneRhMin, max: cloneRhMax, color: "var(--dsc-teal-dim)" },
          ] satisfies ChartTarget[],
        };
      case "vpd":
        return {
          unit: "kPa",
          height: 380,
          yDomain: { left: { min: 0, max: 2.5 } },
          series: [
            ...withPriorGhost("rv", "Room", roomVpd, ZONE.room, "kPa"),
            ...withPriorGhost("mv", "4×8 air", tentVpd, ZONE.main, "kPa"),
            ...withPriorGhost("cv", "2×4 air", cloneVpd, ZONE.clone, "kPa"),
            ...withPriorGhost("lv", "4×8 leaf", leafVpd, "var(--dsc-green)", "kPa"),
            ...withPriorGhost("clv", "2×4 leaf", cloneLeafVpd, "var(--dsc-green-dim)", "kPa"),
          ] satisfies NamedSeries[],
          targets: [
            { min: vpdMin, max: vpdMax, color: "var(--dsc-blue-dim)" },
            { min: cloneVpdMin, max: cloneVpdMax, color: "var(--dsc-teal-dim)" },
          ] satisfies ChartTarget[],
        };
      case "root":
        return {
          unit: "°C",
          height: 380,
          series: [...withPriorGhost("root", "Root coldest", rootT, "#fbbf24", "°C")] satisfies NamedSeries[],
          targets: [{ min: matLo, max: matHi, color: "#22c55e88" }] satisfies ChartTarget[],
        };
      default: {
        const n = Number(target.kind.replace("pot", ""));
        const moist = [potMoist1, potMoist2, potMoist3, potMoist4][n - 1];
        const temp = [potTemp1, potTemp2, potTemp3, potTemp4][n - 1];
        return {
          unit: "%",
          height: 320,
          yDomain: { left: { min: 0, max: 100 }, right: { min: 10, max: 35 } },
          series: [
            ...withPriorGhost(`pm${n}`, "Moisture", moist, "#3b82f6", "%", { axis: "left" }),
            ...withPriorGhost(`pt${n}`, "Soil °C", temp, ZONE.main, "°C", { axis: "right" }),
          ] satisfies NamedSeries[],
          targets: [{ value: 30, color: "#ef444488", label: "dry 30%" }] satisfies ChartTarget[],
        };
      }
    }
  }, [
    target,
    tentT,
    cloneT,
    roomT,
    tentRh,
    cloneRh,
    roomRh,
    tentVpd,
    cloneVpd,
    roomVpd,
    leafVpd,
    cloneLeafVpd,
    rootT,
    potMoist1,
    potMoist2,
    potMoist3,
    potMoist4,
    potTemp1,
    potTemp2,
    potTemp3,
    potTemp4,
    targetTemp,
    cloneTargetTemp,
    rhMin,
    rhMax,
    cloneRhMin,
    cloneRhMax,
    vpdMin,
    vpdMax,
    cloneVpdMin,
    cloneVpdMax,
    matLo,
    matHi,
  ]);

  const thin = model ? model.series.every((s) => s.series.length < 2) : true;
  const lastSync = model
    ? Math.max(
        ...model.series.map((s) => {
          const last = s.series[s.series.length - 1];
          return last?.t ?? 0;
        }),
        0,
      ) || undefined
    : undefined;

  return (
    <SlideDrawer open={!!target} onClose={onClose} title={target?.title ?? "History"}>
      <div className="dsc-chip-row" style={{ marginBottom: 12 }}>
        <TimespanControl hours={hours} setHours={setHours} extras={CYCLE_TIMESPAN_EXTRAS} />
        {thin ? <StatusChip label="Thin recorder" tone="warn" /> : null}
      </div>
      {model ? (
        <MultiLineChart
          live
          height={model.height}
          unit={model.unit}
          chartHours={hours}
          lastSyncAt={lastSync}
          series={model.series}
          targets={model.targets}
          yDomain={model.yDomain}
        />
      ) : null}
      <p className="dsc-muted" style={{ marginTop: 10, fontSize: 12 }}>
        Multi-zone history — same series as HA Home gauge popups.
      </p>
    </SlideDrawer>
  );
}

export function BandChartProvider({ children }: { children: ReactNode }) {
  const [target, setTarget] = useState<BandChartTarget | null>(null);
  const close = useCallback(() => setTarget(null), []);
  const open = useCallback((next: BandChartTarget) => setTarget(next), []);
  const api = useMemo(() => ({ open, close }), [open, close]);
  return (
    <BandChartCtx.Provider value={api}>
      {children}
      <BandChartDrawer target={target} onClose={close} />
    </BandChartCtx.Provider>
  );
}

export function useBandChart(): BandChartApi {
  const ctx = useContext(BandChartCtx);
  if (!ctx) {
    return { open: () => undefined, close: () => undefined };
  }
  return ctx;
}

export const BAND_CHART_TITLES: Record<BandChartKind, string> = {
  temp: "Temperature — 24h",
  rh: "Humidity — 24h",
  vpd: "VPD — 24h",
  root: "Soil temperature — 24h",
  pot1: "POT1 — moisture & soil temp",
  pot2: "POT2 — moisture & soil temp",
  pot3: "POT3 — moisture & soil temp",
  pot4: "POT4 — moisture & soil temp",
};
