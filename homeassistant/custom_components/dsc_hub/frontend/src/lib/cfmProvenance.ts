export type CfmKind = "allocated" | "nameplate" | "mass-balance";

export interface CfmReading {
  value: number;
  kind: CfmKind;
  entityId: string;
  nameplate?: number;
}

const ALLOC_SUFFIX = "_allocated";

export function resolveCfm(
  allocatedId: string,
  nameplateId: string,
  opts: {
    available: (id: string) => boolean;
    num: (id: string, fallback?: number) => number;
    forceKind?: CfmKind;
  },
): CfmReading {
  const nameplate = opts.num(nameplateId);
  if (opts.forceKind === "mass-balance") {
    return {
      value: opts.num(allocatedId, nameplate),
      kind: "mass-balance",
      entityId: allocatedId,
      nameplate: Number.isFinite(nameplate) ? nameplate : undefined,
    };
  }
  if (opts.available(allocatedId) && Number.isFinite(opts.num(allocatedId))) {
    return {
      value: opts.num(allocatedId),
      kind: allocatedId.endsWith(ALLOC_SUFFIX) ? "allocated" : "nameplate",
      entityId: allocatedId,
      nameplate: Number.isFinite(nameplate) ? nameplate : undefined,
    };
  }
  return {
    value: nameplate,
    kind: "nameplate",
    entityId: nameplateId,
    nameplate: Number.isFinite(nameplate) ? nameplate : undefined,
  };
}

export function cfmKindLabel(kind: CfmKind): string {
  switch (kind) {
    case "allocated":
      return "Allocated";
    case "nameplate":
      return "Nameplate";
    case "mass-balance":
      return "Mass-balance";
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}
