import { CatalogPicker } from "../CatalogPicker";
import { CoupledMix } from "../CoupledMix";
import { VesselGlyph } from "../VesselGlyph";
import { Button, Card, Icon, StatusChip } from "../ui";
import { SOIL_PRESETS } from "../../lib/composePlantLogic";
import { VESSEL_CATALOG } from "../../lib/vesselSpec";
import type { CatalogItem } from "../../lib/catalog";
import type { VesselSpec } from "../../lib/vesselSpec";

export type PlantWizardSoilStepProps = {
  selectVessel: (spec: (typeof VESSEL_CATALOG)[number]) => void;
  vessel: VesselSpec;
  vesselAvailable: boolean;
  soilPresetId: string | null;
  applyPreset: (presetId: string) => void;
  onPickMedium: (item: CatalogItem) => void;
  mixLabel: string;
  volumeL: number;
  customBlend: boolean;
  setCustomBlend: (value: boolean | ((prev: boolean) => boolean)) => void;
};

export function PlantWizardSoilStep({
  selectVessel,
  vessel,
  vesselAvailable,
  soilPresetId,
  applyPreset,
  onPickMedium,
  mixLabel,
  volumeL,
  customBlend,
  setCustomBlend,
}: PlantWizardSoilStepProps) {
  return (
    <Card className="dsc-glass dsc-wizard-panel" title="2 · Pot size & growing medium" icon="compose">
      <p className="dsc-muted" style={{ marginTop: 0, fontSize: "var(--dsc-fs-md)" }}>
        Tap a pot size, then pick a common mix or search the medium catalog. Custom blends are tucked away unless you
        need them.
      </p>
      <div className="dsc-vessel-grid">
        {VESSEL_CATALOG.map((spec) => (
          <button
            key={spec.id}
            type="button"
            className={`dsc-vessel-tile${spec.id === vessel.id ? " is-selected" : ""}`}
            onClick={() => selectVessel(spec)}
          >
            <VesselGlyph spec={spec} size={36} />
            <span>{spec.label}</span>
          </button>
        ))}
      </div>
      {!vesselAvailable ? (
        <StatusChip label="Volume only — vessel presets unavailable on hub" tone="warn" />
      ) : null}

      <h4 className="dsc-wizard-subhead">Quick mixes</h4>
      <div className="dsc-soil-presets">
        {SOIL_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            className={`dsc-chip dsc-soil-preset${soilPresetId === preset.id ? " dsc-chip--ok" : ""}`}
            onClick={() => applyPreset(preset.id)}
          >
            <Icon name="root" size={12} /> {preset.label}
          </button>
        ))}
      </div>

      <h4 className="dsc-wizard-subhead">Or search catalog</h4>
      <CatalogPicker kind="medium" onPick={onPickMedium} placeholder="Search mediums…" />
      <div className="dsc-chip-row" style={{ marginTop: 8 }}>
        <StatusChip label={mixLabel} tone={mixLabel === "Not set" ? "warn" : "ok"} icon="compose" />
        <StatusChip label={`${vessel.volumeL || volumeL} L`} tone="muted" icon="tank" />
      </div>

      <div className="dsc-wizard-advanced-toggle">
        <Button variant="secondary" icon="advanced" onClick={() => setCustomBlend((v) => !v)}>
          {customBlend ? "Hide custom blend" : "Custom 3-layer blend"}
        </Button>
      </div>
      {customBlend ? <CoupledMix volumeL={vessel.volumeL || volumeL} /> : null}
    </Card>
  );
}
