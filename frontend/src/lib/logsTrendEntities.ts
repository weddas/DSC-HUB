import type { FleetSnapshot } from "./fleetModel";
import { probeAssignedPlantId } from "./probeAssignment";
import {
  isProbeInService,
  KIT_PROBE_NUMBERS,
  probeGotEntity,
  probeLabel,
} from "./probeModel";
import type { JournalScope } from "../types/journal";

export type TrendSeriesDef = {
  id: string;
  entityId: string;
  label: string;
  color?: string;
  axis?: "left" | "right";
  unit?: string;
};

export type TrendChartGroup = {
  id: string;
  title: string;
  icon?: string;
  honesty?: string;
  series: TrendSeriesDef[];
  unit?: string;
};

/** Resolve kit probe number for a plant id (empty when unassigned). */
export function probeForPlantId(
  plantId: string,
  fleet: FleetSnapshot | null | undefined,
  state: (id: string, fallback?: string) => string,
): number | null {
  const id = plantId.trim();
  if (!id) return null;
  for (const n of KIT_PROBE_NUMBERS) {
    if (probeAssignedPlantId(n, fleet, state) === id) return n;
  }
  return null;
}

export function trendChartGroupsForScope(
  scope: JournalScope,
  state: (id: string, fallback?: string) => string,
  fleet: FleetSnapshot | null | undefined,
): TrendChartGroup[] {
  switch (scope.kind) {
    case "space": {
      const isClone = scope.id === "2x4";
      const tId = isClone ? "sensor.dsc_hub_clone_temperature" : "sensor.dsc_hub_tent_temperature";
      const rhId = isClone ? "sensor.dsc_hub_clone_humidity" : "sensor.dsc_hub_tent_humidity";
      const vpdId = isClone ? "sensor.dsc_hub_clone_vpd_kpa" : "sensor.dsc_hub_vpd_kpa";
      const tentLabel = isClone ? "2×4" : "4×8";
      const moistSeries: TrendSeriesDef[] = KIT_PROBE_NUMBERS.filter((n) =>
        isProbeInService(n, state),
      ).map((n, i) => ({
        id: `p${n}m`,
        entityId: probeGotEntity(n, "moisture", state),
        label: probeLabel(n),
        color: ["var(--dsc-blue)", "var(--dsc-teal)", "var(--dsc-purple)", "var(--dsc-amber)"][i],
        unit: "%",
      }));
      const groups: TrendChartGroup[] = [
        {
          id: "climate",
          title: `${tentLabel} T + RH (secondary)`,
          icon: "climate",
          honesty: "Full climate Want→Got charts live on Climate — this is read-only history for review.",
          series: [
            {
              id: "t",
              entityId: tId,
              label: "Temp °C",
              color: "var(--dsc-blue)",
              axis: "left",
              unit: "°C",
            },
            {
              id: "rh",
              entityId: rhId,
              label: "RH %",
              color: "var(--dsc-teal)",
              axis: "right",
              unit: "%",
            },
          ],
        },
        {
          id: "vpd",
          title: `${tentLabel} VPD`,
          icon: "climate",
          series: [
            {
              id: "vpd",
              entityId: vpdId,
              label: "VPD kPa",
              color: "var(--dsc-purple)",
              unit: "kPa",
            },
          ],
          unit: "kPa",
        },
      ];
      if (moistSeries.length) {
        groups.push({
          id: "root",
          title: "Root pack — moisture (in service)",
          icon: "root",
          series: moistSeries,
          unit: "%",
        });
      }
      return groups;
    }
    case "plant": {
      const probe = probeForPlantId(scope.id ?? "", fleet, state);
      if (!probe || !isProbeInService(probe, state)) return [];
      return [
        {
          id: "plant-root",
          title: `Probe ${probe} — moisture & EC`,
          icon: "root",
          honesty: "Charts assigned probe Got channels only — unassigned or OOS probes stay empty.",
          series: [
            {
              id: "moist",
              entityId: probeGotEntity(probe, "moisture", state),
              label: "Moisture %",
              color: "var(--dsc-teal)",
              axis: "left",
              unit: "%",
            },
            {
              id: "ec",
              entityId: probeGotEntity(probe, "ec", state),
              label: "EC µS",
              color: "var(--dsc-amber)",
              axis: "right",
              unit: "µS",
            },
          ],
        },
      ];
    }
    case "room":
      return [
        {
          id: "room",
          title: "Room T + RH + VPD",
          icon: "climate",
          series: [
            {
              id: "rt",
              entityId: "sensor.dsc_hub_room_temperature",
              label: "Temp °C",
              color: "var(--dsc-blue)",
              axis: "left",
              unit: "°C",
            },
            {
              id: "rrh",
              entityId: "sensor.dsc_hub_room_humidity",
              label: "RH %",
              color: "var(--dsc-teal)",
              axis: "right",
              unit: "%",
            },
          ],
        },
        {
          id: "room-vpd",
          title: "Room VPD",
          icon: "climate",
          series: [
            {
              id: "rvpd",
              entityId: "sensor.dsc_hub_room_vpd_kpa",
              label: "VPD kPa",
              color: "var(--dsc-purple)",
              unit: "kPa",
            },
          ],
          unit: "kPa",
        },
      ];
    case "core":
    case "grow_log":
    default:
      return [];
  }
}
