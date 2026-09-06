import { CatalogPicker } from "../CatalogPicker";
import { Card, EntitySelect, EntityText, EntityDatetime, Icon, StatusChip } from "../ui";
import { probeLabel } from "../../lib/seatModel";
import type { CatalogItem } from "../../lib/catalog";
import { strainOk, type CallService } from "./plantWizardSteps";

export type PlantWizardPlantStepProps = {
  onPickStrain: (item: CatalogItem) => void;
  pickedStrain: CatalogItem | null;
  strainLabel: string;
  strain: string;
  assign: string;
  assignOptions: string[];
  setAssignDraft: (next: string) => void;
  callService: CallService;
  expectedStage: string;
  expectedDays: string;
};

export function PlantWizardPlantStep({
  onPickStrain,
  pickedStrain,
  strainLabel,
  strain,
  assign,
  assignOptions,
  setAssignDraft,
  callService,
  expectedStage,
  expectedDays,
}: PlantWizardPlantStepProps) {
  return (
    <Card className="dsc-glass dsc-wizard-panel" title="1 · Which plant, which probe?" icon="roster">
      <p className="dsc-muted" style={{ marginTop: 0, fontSize: "var(--dsc-fs-md)" }}>
        Search the catalog, give it a nickname, pick an empty kit probe, and set sprout date if you know it.
      </p>
      <CatalogPicker kind="strain" onPick={onPickStrain} placeholder="Search strains…" />
      {pickedStrain || strainOk(strain) ? (
        <div className="dsc-chip-row" style={{ margin: "10px 0" }}>
          <StatusChip icon="roster" label={strainLabel || strain} tone="ok" />
          {pickedStrain?.type ? <StatusChip icon="research" label={String(pickedStrain.type)} tone="muted" /> : null}
          {pickedStrain?.height_cm_min != null ? (
            <StatusChip
              label={`${pickedStrain.height_cm_min}${pickedStrain.height_cm_max != null ? `–${pickedStrain.height_cm_max}` : ""} cm`}
              tone="muted"
            />
          ) : null}
        </div>
      ) : (
        <p className="dsc-honesty">Pick a strain to continue.</p>
      )}
      <div className="dsc-wizard-fields">
        <EntityText entityId="input_text.dsc_build_nickname" label="Nickname (optional)" />
        <EntityDatetime entityId="input_datetime.dsc_build_sprout_date" label="Sprout date" />
        <label className="dsc-field">
          <span className="dsc-field-label">
            <Icon name="root" size={14} /> Assign to probe
          </span>
          <select
            className="dsc-input"
            value={assignOptions.includes(assign) ? assign : "none"}
            onChange={(e) => {
              const next = e.target.value;
              setAssignDraft(next);
              void callService("input_select", "select_option", {
                entity_id: "input_select.dsc_build_assign_pot",
                option: next,
              });
            }}
          >
            {assignOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt === "none" ? "— none —" : probeLabel(Number(opt))}
              </option>
            ))}
          </select>
        </label>
        <EntitySelect entityId="input_select.dsc_build_tent" label="Tent" icon="tent" />
      </div>
      {expectedStage ? (
        <div className="dsc-chip-row" style={{ marginTop: 8 }}>
          <StatusChip icon="grow" label={`Expected · ${expectedStage}`} tone="muted" />
          {expectedDays ? <StatusChip icon="history" label={`Day ${expectedDays}`} tone="muted" /> : null}
        </div>
      ) : (
        <p className="dsc-muted" style={{ margin: "8px 0 0", fontSize: "var(--dsc-fs-sm)" }}>
          Sprout date auto-calculates growth stage after commit.
        </p>
      )}
    </Card>
  );
}
