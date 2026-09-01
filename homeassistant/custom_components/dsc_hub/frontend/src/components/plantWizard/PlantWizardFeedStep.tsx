import { CatalogPicker } from "../CatalogPicker";
import { Button, Card, EntityText, StatusChip } from "../ui";
import { TargetNumber } from "../TentTargets";
import { NUTRIENT_SLOTS } from "../../lib/composePlantLogic";
import type { CatalogItem } from "../../lib/catalog";

export type PlantWizardFeedStepProps = {
  goNext: () => Promise<void>;
  setSkippedFeed: (skipped: boolean) => void;
  onPickNutrient: (item: CatalogItem) => void;
  nutrients: string[];
};

export function PlantWizardFeedStep({
  goNext,
  setSkippedFeed,
  onPickNutrient,
  nutrients,
}: PlantWizardFeedStepProps) {
  return (
    <Card className="dsc-glass dsc-wizard-panel" title="3 · Feed recipe (optional)" icon="nutrient">
      <p className="dsc-muted" style={{ marginTop: 0, fontSize: 13 }}>
        Skip if you are not mixing nutrients yet. Search to add bottles — defaults fill dose from the catalog when
        available.
      </p>
      <div className="dsc-row-actions" style={{ marginBottom: 12 }}>
        <Button
          variant="secondary"
          icon="nutrient"
          onClick={() => {
            setSkippedFeed(true);
            void goNext();
          }}
        >
          Skip feed for now
        </Button>
      </div>
      <CatalogPicker kind="nutrient" onPick={onPickNutrient} placeholder="Search nutrients…" />
      {nutrients.length ? (
        <div className="dsc-chip-row" style={{ margin: "10px 0" }}>
          {nutrients.map((name) => (
            <StatusChip key={name} label={name} tone="ok" icon="nutrient" />
          ))}
        </div>
      ) : (
        <p className="dsc-muted" style={{ fontSize: 12 }}>No nutrients added yet.</p>
      )}
      <details className="dsc-wizard-details">
        <summary>Advanced — tank size & all slots</summary>
        <div className="dsc-target-grid">
          <TargetNumber entityId="input_number.dsc_mix_tank_liters" label="Tank L" step={0.5} />
          <TargetNumber entityId="input_number.dsc_mix_strength_pct" label="Strength %" step={1} />
        </div>
        {NUTRIENT_SLOTS.map((n) => (
          <div key={n} className="dsc-nutrient-slot">
            <EntityText entityId={`input_text.dsc_nutrient_${n}_name`} label={`Slot ${n}`} />
            <TargetNumber entityId={`input_number.dsc_nutrient_${n}_dose_ml_l`} label="ml/L" step={0.1} />
          </div>
        ))}
        <EntityText entityId="input_text.dsc_build_recipe_note" label="Recipe note" multiline />
      </details>
    </Card>
  );
}
