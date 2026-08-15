import { StatusChip } from "./ui";
import { cfmKindLabel, type CfmKind, type CfmReading } from "../lib/cfmProvenance";

export function CfmProvenanceBadge({ reading }: { reading: CfmReading }) {
  const tone = reading.kind === "nameplate" ? "warn" : "ok";
  return (
    <StatusChip
      label={cfmKindLabel(reading.kind)}
      tone={tone}
      icon={reading.kind === "nameplate" ? "alert" : "ok"}
    />
  );
}

export function CfmKindChip({ kind }: { kind: CfmKind }) {
  return <StatusChip label={cfmKindLabel(kind)} tone={kind === "nameplate" ? "warn" : "ok"} />;
}
