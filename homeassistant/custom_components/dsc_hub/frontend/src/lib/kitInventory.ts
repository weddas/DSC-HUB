import { ALL_POT_NUMBERS, isPotInService } from "./seatModel";

export type KitNodeStatus = "ok" | "missing" | "oos" | "dark" | "held" | "idle";

export interface KitNode {
  id: string;
  label: string;
  status: KitNodeStatus;
  subtitle?: string;
  /** Primary entity for inspector / history. */
  entityId: string;
  runtimeToday?: string;
  cyclesToday?: string;
  demandEntity?: string;
  firmwareEntity?: string;
  inServiceEntity?: string;
  plannedOos?: boolean;
}

export type HassBits = {
  state: (id: string, fallback?: string) => string;
  available: (id: string) => boolean;
};

export interface KitDef {
  id: string;
  label: string;
  inServiceEntity?: string;
  /** When true, in_service off is planned OOS (not built), not an error. */
  plannedWhenOff?: boolean;
  demandEntity?: string;
  relayEntity?: string;
  linkEntity?: string;
  runtimeToday?: string;
  cyclesToday?: string;
  firmwareEntity?: string;
}

/** Single kit map. in_service off = OOS. Dark only when an in-service node is unavailable. */
export const KIT_DEFS: KitDef[] = [
  {
    id: "hub",
    label: "Hub",
    linkEntity: "binary_sensor.dsc_hub_link",
    firmwareEntity: "sensor.dsc_hub_firmware_version",
  },
  {
    id: "heater",
    label: "Heater",
    demandEntity: "switch.dsc_hub_heater_demand",
    relayEntity: "switch.dsc_heater_main_relay",
    runtimeToday: "sensor.dsc_heater_runtime_today",
    cyclesToday: "sensor.dsc_heater_cycles_today",
    firmwareEntity: "sensor.dsc_heater_firmware_version",
  },
  {
    id: "heatmat",
    label: "Heat mat",
    demandEntity: "switch.dsc_hub_grow_mat_demand",
    relayEntity: "switch.dsc_heatmat_main_relay",
    runtimeToday: "sensor.dsc_growmat_runtime_today",
    firmwareEntity: "sensor.dsc_heatmat_firmware_version",
  },
  {
    id: "ac",
    label: "AC",
    inServiceEntity: "input_boolean.dsc_ac_in_service",
    plannedWhenOff: true,
    demandEntity: "switch.dsc_hub_ac_demand",
    relayEntity: "switch.dsc_ac_main_relay",
    runtimeToday: "sensor.dsc_ac_runtime_today",
  },
  {
    id: "humidifier",
    label: "Humidifier",
    demandEntity: "switch.dsc_hub_humidifier_demand",
    relayEntity: "switch.dsc_humidifier_main_relay",
    runtimeToday: "sensor.dsc_humidifier_runtime_today",
    cyclesToday: "sensor.dsc_humidifier_cycles_today",
    firmwareEntity: "sensor.dsc_humidifier_firmware_version",
  },
  {
    id: "dehumidifier",
    label: "Dehumidifier",
    demandEntity: "switch.dsc_hub_dehumidifier_demand",
    relayEntity: "switch.dsc_de_humidifier_main_relay",
    runtimeToday: "sensor.dsc_dehumidifier_runtime_today",
    firmwareEntity: "sensor.dsc_de_humidifier_firmware_version",
  },
  {
    id: "mister",
    label: "Clone mister",
    inServiceEntity: "input_boolean.dsc_clone_humidifier_in_service",
    plannedWhenOff: true,
    demandEntity: "switch.dsc_hub_clone_humidifier_demand",
    relayEntity: "switch.dsc_clone_humidifier_main_relay",
  },
  ...ALL_POT_NUMBERS.map(
    (n): KitDef => ({
      id: `pot${n}`,
      label: `Pot ${n}`,
      inServiceEntity: `input_boolean.dsc_pot${n}_in_service`,
      plannedWhenOff: n === 3,
      firmwareEntity: `sensor.dsc_pot${n}_firmware_version`,
    }),
  ),
  {
    id: "tank",
    label: "Tank",
    inServiceEntity: "input_boolean.dsc_tank_in_service",
    plannedWhenOff: true,
  },
];

function presenceEntity(def: KitDef): string {
  return def.linkEntity || def.relayEntity || def.demandEntity || def.inServiceEntity || def.firmwareEntity || "";
}

export function resolveKitNode(def: KitDef, hass: HassBits, settled: (id: string) => boolean): KitNode {
  const entityId = presenceEntity(def);
  if (def.id === "hub") {
    const known = hass.available("binary_sensor.dsc_hub_link");
    const on = hass.state("binary_sensor.dsc_hub_link") === "on";
    const live = settled("binary_sensor.dsc_hub_link");
    let status: KitNodeStatus = "missing";
    if (known && live) status = on ? "ok" : "dark";
    else if (known && !live) status = on ? "ok" : "dark";
    else status = "missing";
    return {
      id: def.id,
      label: def.label,
      status,
      entityId: "binary_sensor.dsc_hub_link",
      firmwareEntity: def.firmwareEntity,
    };
  }

  if (def.inServiceEntity) {
    const svcKnown = hass.available(def.inServiceEntity);
    const inService =
      def.id.startsWith("pot") && def.id.length === 4
        ? isPotInService(Number(def.id.slice(3)), hass.state)
        : hass.state(def.inServiceEntity) === "on";
    if (svcKnown && !inService) {
      return {
        id: def.id,
        label: def.label,
        status: "oos",
        subtitle: def.plannedWhenOff ? "Not built / parked" : "Out of service",
        entityId: def.inServiceEntity,
        inServiceEntity: def.inServiceEntity,
        plannedOos: def.plannedWhenOff,
        runtimeToday: def.runtimeToday,
        cyclesToday: def.cyclesToday,
        demandEntity: def.demandEntity,
        firmwareEntity: def.firmwareEntity,
      };
    }
  }

  const probe = def.relayEntity || def.demandEntity || def.firmwareEntity || def.inServiceEntity || "";
  const known = probe ? hass.available(probe) : true;
  const live = probe ? settled(probe) : true;
  if (!known && !live) {
    return {
      id: def.id,
      label: def.label,
      status: "missing",
      entityId: probe || entityId,
      inServiceEntity: def.inServiceEntity,
      runtimeToday: def.runtimeToday,
      cyclesToday: def.cyclesToday,
      demandEntity: def.demandEntity,
      firmwareEntity: def.firmwareEntity,
    };
  }
  if (probe && !live) {
    return {
      id: def.id,
      label: def.label,
      status: "dark",
      subtitle: "Dark",
      entityId: probe,
      inServiceEntity: def.inServiceEntity,
      runtimeToday: def.runtimeToday,
      cyclesToday: def.cyclesToday,
      demandEntity: def.demandEntity,
      firmwareEntity: def.firmwareEntity,
    };
  }

  const running =
    (def.demandEntity && hass.state(def.demandEntity) === "on") ||
    (def.relayEntity && hass.state(def.relayEntity) === "on");
  return {
    id: def.id,
    label: def.label,
    status: running ? "ok" : "idle",
    subtitle: running ? "Running" : "Idle",
    entityId: def.demandEntity || def.relayEntity || probe || entityId,
    inServiceEntity: def.inServiceEntity,
    runtimeToday: def.runtimeToday,
    cyclesToday: def.cyclesToday,
    demandEntity: def.demandEntity,
    firmwareEntity: def.firmwareEntity,
  };
}

export function buildKitNodes(hass: HassBits, settled: (id: string) => boolean): KitNode[] {
  return KIT_DEFS.map((d) => resolveKitNode(d, hass, settled));
}

export function kitInServiceCount(nodes: KitNode[]): { inService: number; total: number; dark: number } {
  const countable = nodes.filter((n) => n.id !== "hub");
  const oos = countable.filter((n) => n.status === "oos" || n.status === "missing");
  const dark = countable.filter((n) => n.status === "dark").length;
  return {
    inService: countable.length - oos.length,
    total: countable.length,
    dark,
  };
}

export function kitHoleLabel(status: KitNodeStatus, label: string): string {
  switch (status) {
    case "ok":
      return label;
    case "idle":
      return `${label} idle`;
    case "held":
      return `${label} HELD`;
    case "oos":
      return `${label} OOS`;
    case "missing":
      return `${label} missing`;
    case "dark":
      return `${label} dark`;
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

export function kitTone(status: KitNodeStatus): "ok" | "warn" | "bad" | "muted" {
  switch (status) {
    case "ok":
      return "ok";
    case "idle":
      return "muted";
    case "held":
      return "warn";
    case "oos":
    case "missing":
      return "muted";
    case "dark":
      return "bad";
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}
