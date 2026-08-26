import { ALL_POT_NUMBERS, isPotInService } from "./seatModel";
import type { FleetSnapshot } from "./fleetModel";
import { inventoryInService } from "./fleetModel";

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

export function buildKitNodesFromFleet(fleet: FleetSnapshot): KitNode[] {
  return KIT_DEFS.map((d) => resolveKitNodeFromFleet(d, fleet));
}

export function resolveKitNodeFromFleet(def: KitDef, fleet: FleetSnapshot): KitNode {
  const entityId = presenceEntity(def);
  const hubLive = fleet.hub.online;

  if (def.id === "hub") {
    return {
      id: def.id,
      label: def.label,
      status: fleet.hub.online ? "ok" : "dark",
      entityId: "binary_sensor.dsc_hub_link",
      firmwareEntity: def.firmwareEntity,
    };
  }

  if (def.inServiceEntity) {
    const inService = def.id.startsWith("pot") && def.id.length === 4
      ? inventoryInService(fleet, def.id)
      : inventoryInService(fleet, def.id);
    if (!inService) {
      return {
        id: def.id,
        label: def.label,
        status: "oos",
        subtitle: def.plannedWhenOff ? "Not installed" : "Out of service",
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

  const sonoff = fleet.sonoffs[def.id];
  const pot = fleet.pots[def.id];
  const seatOnline = sonoff?.online ?? pot?.online ?? false;
  const inventoryOn = def.inServiceEntity ? inventoryInService(fleet, def.id) : true;

  if (def.id.startsWith("pot")) {
    if (!inventoryOn) {
      return {
        id: def.id,
        label: def.label,
        status: "oos",
        subtitle: def.plannedWhenOff ? "Not installed" : "Out of service",
        entityId: def.inServiceEntity ?? entityId,
        inServiceEntity: def.inServiceEntity,
        plannedOos: def.plannedWhenOff,
        firmwareEntity: def.firmwareEntity,
      };
    }
    if (!seatOnline) {
      return {
        id: def.id,
        label: def.label,
        status: inventoryOn ? "dark" : "missing",
        subtitle: inventoryOn ? "No data" : undefined,
        entityId: def.firmwareEntity ?? entityId,
        inServiceEntity: def.inServiceEntity,
        firmwareEntity: def.firmwareEntity,
      };
    }
    return {
      id: def.id,
      label: def.label,
      status: "idle",
      subtitle: "Idle",
      entityId: def.firmwareEntity ?? entityId,
      inServiceEntity: def.inServiceEntity,
      firmwareEntity: def.firmwareEntity,
    };
  }

  if (sonoff) {
    if (!seatOnline) {
      return {
        id: def.id,
        label: def.label,
        status: inventoryOn ? "dark" : "missing",
        subtitle: inventoryOn ? "No data" : undefined,
        entityId: def.relayEntity ?? def.demandEntity ?? entityId,
        inServiceEntity: def.inServiceEntity,
        runtimeToday: def.runtimeToday,
        cyclesToday: def.cyclesToday,
        demandEntity: def.demandEntity,
        firmwareEntity: def.firmwareEntity,
      };
    }
    const running = sonoff.values.relay_on === true;
    return {
      id: def.id,
      label: def.label,
      status: running ? "ok" : "idle",
      subtitle: running ? "Running" : "Idle",
      entityId: def.demandEntity || def.relayEntity || entityId,
      inServiceEntity: def.inServiceEntity,
      runtimeToday: def.runtimeToday,
      cyclesToday: def.cyclesToday,
      demandEntity: def.demandEntity,
      firmwareEntity: def.firmwareEntity,
    };
  }

  if (def.id === "tank" || def.id === "ac" || def.id === "mister") {
    const inSvc = inventoryInService(fleet, def.id);
    if (!inSvc) {
      return {
        id: def.id,
        label: def.label,
        status: "oos",
        subtitle: def.plannedWhenOff ? "Not installed" : "Out of service",
        entityId: def.inServiceEntity ?? entityId,
        inServiceEntity: def.inServiceEntity,
        plannedOos: def.plannedWhenOff,
      };
    }
    return {
      id: def.id,
      label: def.label,
      status: "idle",
      subtitle: "Idle",
      entityId: def.inServiceEntity ?? entityId,
      inServiceEntity: def.inServiceEntity,
    };
  }

  return {
    id: def.id,
    label: def.label,
    status: hubLive ? "dark" : "missing",
    entityId,
    inServiceEntity: def.inServiceEntity,
    demandEntity: def.demandEntity,
    firmwareEntity: def.firmwareEntity,
  };
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
        subtitle: def.plannedWhenOff ? "Not installed" : "Out of service",
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

  const hubLive =
    hass.available("binary_sensor.dsc_hub_link") &&
    hass.state("binary_sensor.dsc_hub_link") === "on";

  const probe = def.relayEntity || def.demandEntity || def.firmwareEntity || def.inServiceEntity || "";
  const known = probe ? hass.available(probe) : true;
  const live = probe ? settled(probe) : true;
  const inventoryInService =
    def.inServiceEntity &&
    (def.id.startsWith("pot") && def.id.length === 4
      ? isPotInService(Number(def.id.slice(3)), hass.state)
      : hass.state(def.inServiceEntity) === "on");

  if (!known && !live) {
    return {
      id: def.id,
      label: def.label,
      status: inventoryInService && hubLive ? "dark" : "missing",
      subtitle: inventoryInService && hubLive ? "No data" : undefined,
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
      subtitle: "No data",
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
  const oos = countable.filter((n) => n.status === "oos");
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
      return `${label} held`;
    case "oos":
      return `${label} out of service`;
    case "missing":
      return `${label} not set up`;
    case "dark":
      return `${label} no data`;
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
