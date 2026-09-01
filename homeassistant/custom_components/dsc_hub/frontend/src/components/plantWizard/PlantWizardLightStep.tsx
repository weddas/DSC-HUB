import { CatalogPicker } from "../CatalogPicker";
import { Button, Card, EntitySelect, StatusChip } from "../ui";
import type { CatalogItem } from "../../lib/catalog";

export type PlantWizardLightStepProps = {
  goNext: () => Promise<void>;
  setSkippedLight: (skipped: boolean) => void;
  onPickLight: (item: CatalogItem) => void;
  pickedLight: CatalogItem | null;
  light: string;
};

export function PlantWizardLightStep({
  goNext,
  setSkippedLight,
  onPickLight,
  pickedLight,
  light,
}: PlantWizardLightStepProps) {
  return (
    <Card className="dsc-glass dsc-wizard-panel" title="4 · Light fixture (optional)" icon="lighting">
      <p className="dsc-muted" style={{ marginTop: 0, fontSize: 13 }}>
        Match a catalog fixture or pick from hub presets. Skip if the tent light is already configured.
      </p>
      <div className="dsc-row-actions" style={{ marginBottom: 12 }}>
        <Button
          variant="secondary"
          icon="lighting"
          onClick={() => {
            setSkippedLight(true);
            void goNext();
          }}
        >
          Skip light
        </Button>
      </div>
      <CatalogPicker kind="light" onPick={onPickLight} placeholder="Search lights…" />
      <EntitySelect entityId="input_select.dsc_light_fixture" label="Hub fixture preset" />
      {pickedLight || (light && light !== "unknown") ? (
        <div className="dsc-chip-row" style={{ marginTop: 8 }}>
          <StatusChip label={light && light !== "unknown" ? light : pickedLight?.name || "—"} tone="ok" icon="lighting" motion="glow" />
          {pickedLight?.wattage_w != null ? (
            <StatusChip label={`${pickedLight.wattage_w} W`} tone="muted" />
          ) : null}
        </div>
      ) : null}
    </Card>
  );
}
