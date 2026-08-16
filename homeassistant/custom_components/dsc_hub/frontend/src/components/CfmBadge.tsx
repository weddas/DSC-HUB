import { StatusChip } from "./ui";
import { cfmKindLabel, type CfmKind, type CfmReading } from "../lib/cfmProvenance";

/** One honest CFM-trust line. Not a stack of Allocated/Nameplate pills. */
export function CfmTrustLine({ readings }: { readings: CfmReading[] }) {
  const nameplate = readings.some((r) => r.kind === "nameplate");
  const allocated = readings.some((r) => r.kind === "allocated" || r.kind === "mass-balance");
  if (nameplate && !allocated) {
    return (
      <p className="dsc-honesty" style={{ margin: "0 0 8px" }}>
        CFM guessed from fan % × nameplate — run Learning to measure.
      </p>
    );
  }
  if (nameplate && allocated) {
    return (
      <p className="dsc-honesty" style={{ margin: "0 0 8px" }}>
        Mixed CFM trust — some ducts from Learning, others still nameplate. Run Learning on the dashed paths.
      </p>
    );
  }
  return (
    <p className="dsc-honesty" style={{ margin: "0 0 8px" }}>
      CFM from Learning (anemometer).
    </p>
  );
}

export function CfmProvenanceBadge({ reading }: { reading: CfmReading }) {
  return <CfmTrustLine readings={[reading]} />;
}

export function CfmKindChip({ kind }: { kind: CfmKind }) {
  return <StatusChip label={cfmKindLabel(kind)} tone={kind === "nameplate" ? "warn" : "ok"} />;
}
