import { useState } from "react";
import { CatalogPicker } from "./CatalogPicker";
import { CoupledMix } from "./CoupledMix";
import { DecisionLayer, ResultChip } from "./DecisionLayer";
import { VesselGlyph } from "./VesselGlyph";
import { Button, Card, EntitySelect, EntityText, EntityDatetime, StatusChip } from "./ui";
import { TargetNumber } from "./TentTargets";
import { useHass } from "../hooks/useHass";
import { DEFAULT_VESSEL, resolveVesselSpec, vesselEntityId, VESSEL_CATALOG } from "../lib/vesselSpec";
import type { CatalogItem, CatalogKind } from "../lib/catalog";

type DrawKind = CatalogKind | "vessel" | null;
type ConfirmKind = "roster" | "assign" | "seat" | "mix" | "climate" | null;

const NUTRIENT_SLOTS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export function ComposePlant() {
  const { available, callService, entity, num, state } = useHass();
  const [draw, setDraw] = useState<DrawKind>(null);
  const [confirm, setConfirm] = useState<ConfirmKind>(null);
  const [pickedStrain, setPickedStrain] = useState<CatalogItem | null>(null);
  const [pickedLight, setPickedLight] = useState<CatalogItem | null>(null);
  const strain = state("input_text.dsc_build_strain", "");
  const nick = state("input_text.dsc_build_nickname", "");
  const assign = state("input_select.dsc_build_assign_pot", "none");
  const volumeL = num("input_number.dsc_blend_total_l", 20);
  const light = state("input_select.dsc_light_fixture", "");
  const vesselRaw = state("input_select.dsc_build_vessel", "");
  const vessel = resolveVesselSpec(vesselRaw || undefined, volumeL);
  const tankL = num("input_number.dsc_mix_tank_liters", 20);
  const strength = num("input_number.dsc_mix_strength_pct", 100);
  const strengthFrac = (Number.isFinite(strength) ? strength : 100) / 100;
  const tank = Number.isFinite(tankL) && tankL > 0 ? tankL : 20;

  const pick = (kind: CatalogKind, item: CatalogItem) => {
    if (kind === "strain") {
      setPickedStrain(item);
      void callService("input_text", "set_value", { entity_id: "input_text.dsc_build_strain", value: item.name });
    } else if (kind === "medium") {
      const composition =
        item.composition && typeof item.composition === "object"
          ? Object.entries(item.composition)
              .filter(([, pct]) => Number.isFinite(Number(pct)) && Number(pct) > 0)
              .slice(0, 3)
          : [];
      if (composition.length) {
        for (let n = 1; n <= 3; n++) {
          const part = composition[n - 1];
          void callService("input_text", "set_value", {
            entity_id: `input_text.dsc_blend_component_${n}_name`,
            value: part ? String(part[0]) : "",
          });
          void callService("input_number", "set_value", {
            entity_id: `input_number.dsc_blend_pct_${n}`,
            value: part ? Number(part[1]) : 0,
          });
        }
      } else {
        void callService("input_text", "set_value", {
          entity_id: "input_text.dsc_blend_component_1_name",
          value: item.name,
        });
      }
    } else if (kind === "nutrient") {
      for (const n of NUTRIENT_SLOTS) {
        const name = state(`input_text.dsc_nutrient_${n}_name`, "");
        const inv = state(`input_boolean.dsc_nutrient_${n}_in_inventory`) === "on";
        if (!name || name === "unknown" || !inv) {
          void callService("input_text", "set_value", {
            entity_id: `input_text.dsc_nutrient_${n}_name`,
            value: item.name,
          });
          if (item.dose_ml_l != null && Number.isFinite(Number(item.dose_ml_l))) {
            void callService("input_number", "set_value", {
              entity_id: `input_number.dsc_nutrient_${n}_dose_ml_l`,
              value: Number(item.dose_ml_l),
            });
          }
          void callService("input_boolean", "turn_on", { entity_id: `input_boolean.dsc_nutrient_${n}_in_inventory` });
          break;
        }
      }
    } else if (kind === "light") {
      setPickedLight(item);
      const opts = (entity("input_select.dsc_light_fixture")?.attributes?.options as string[]) || [];
      const match = opts.find((o) => o.toLowerCase().includes(String(item.name || "").toLowerCase().slice(0, 18)));
      if (match) {
        void callService("input_select", "select_option", { entity_id: "input_select.dsc_light_fixture", option: match });
      } else {
        void callService("input_text", "set_value", { entity_id: "input_text.dsc_light_custom_name", value: item.name });
      }
    }
    setDraw(null);
  };

  const copyVesselToPot = (pot: string) => {
    const potN = Number(pot);
    if (!Number.isFinite(potN) || pot === "none") return;
    const id = vesselEntityId(potN);
    if (!available(id)) return;
    void callService("input_select", "select_option", { entity_id: id, option: vessel.id });
  };

  const commit = () => {
    void callService("script", "turn_on", { entity_id: "script.dsc_build_plant_commit" });
  };
  const commitAssign = () => {
    copyVesselToPot(assign);
    if (available("script.dsc_build_plant_commit_and_assign")) {
      void callService("script", "turn_on", { entity_id: "script.dsc_build_plant_commit_and_assign" });
      return;
    }
    void callService("script", "turn_on", { entity_id: "script.dsc_build_plant_commit" });
    void callService("script", "turn_on", {
      entity_id: "script.dsc_plant_assign_to_pot",
      variables: { pot: assign },
    });
  };

  const mixLines = NUTRIENT_SLOTS.map((n) => {
    const name = state(`input_text.dsc_nutrient_${n}_name`, "");
    const dose = num(`input_number.dsc_nutrient_${n}_dose_ml_l`, 0);
    const stock = num(`input_number.dsc_nutrient_${n}_stock_ml`, 0);
    const inv = state(`input_boolean.dsc_nutrient_${n}_in_inventory`) === "on";
    const empty = !name || name === "unknown" || name === "unavailable";
    const ml = !empty && Number.isFinite(dose) ? Math.round(dose * tank * strengthFrac * 10) / 10 : 0;
    return { n, name, dose, stock, inv, empty, ml, short: inv && Number.isFinite(stock) && stock < ml && ml > 0 };
  });
  const mixTotal = mixLines.reduce((a, l) => a + l.ml, 0);

  return (
    <div className="dsc-compose">
      <div className="dsc-grid">
        <div className="dsc-col-6">
          <Card className="dsc-glass" title="Strain" icon="roster">
            <ResultChip
              label={strain && strain !== "unknown" ? strain : "No strain"}
              empty={!strain || strain === "unknown"}
              onClick={() => setDraw("strain")}
            />
            {pickedStrain ? (
              <div className="dsc-chip-row" style={{ margin: "8px 0" }}>
                {pickedStrain.type ? <StatusChip label={String(pickedStrain.type)} tone="muted" /> : null}
                {pickedStrain.height_cm_min != null ? (
                  <StatusChip
                    label={`${pickedStrain.height_cm_min}${pickedStrain.height_cm_max != null ? `–${pickedStrain.height_cm_max}` : ""}cm`}
                    tone="muted"
                  />
                ) : null}
                {pickedStrain.thc_min != null ? <StatusChip label={`${pickedStrain.thc_min}% THC`} tone="muted" /> : null}
              </div>
            ) : null}
            <EntityText entityId="input_text.dsc_build_nickname" label="Nickname" />
            <EntityDatetime entityId="input_datetime.dsc_build_sprout_date" label="Sprout date" />
            <EntitySelect entityId="input_select.dsc_build_custom_slot" label="Custom strain slot" />
          </Card>
        </div>
        <div className="dsc-col-6">
          <Card className="dsc-glass" title="Vessel + mix" icon="compose">
            <div className="dsc-chip-row" style={{ marginBottom: 8 }}>
              <VesselGlyph spec={vessel} size={48} label />
              <button type="button" className="dsc-chip" onClick={() => setDraw("vessel")}>
                {vessel.label}
              </button>
            </div>
            <CoupledMix volumeL={vessel.volumeL || volumeL} />
            <div className="dsc-chip-row" style={{ marginTop: 8 }}>
              <ResultChip label="Medium search" onClick={() => setDraw("medium")} empty />
            </div>
          </Card>
        </div>
        <div className="dsc-col-6">
          <Card className="dsc-glass" title="Nutrition" icon="nutrient">
            <div className="dsc-chip-row" style={{ marginBottom: 8 }}>
              <ResultChip label="Add from catalog" onClick={() => setDraw("nutrient")} empty />
              <StatusChip label={`Tank ${tank} L`} tone="muted" />
              <StatusChip label={`${Math.round(strengthFrac * 100)}% strength`} tone="muted" />
              <StatusChip label={`${mixTotal.toFixed(1)} ml`} tone={mixTotal > 0 ? "ok" : "muted"} />
            </div>
            <div className="dsc-target-grid">
              <TargetNumber entityId="input_number.dsc_mix_tank_liters" label="Tank L" step={0.5} />
              <TargetNumber entityId="input_number.dsc_mix_strength_pct" label="Strength %" step={1} />
            </div>
            {mixLines.map((slot) => (
              <div key={slot.n} className="dsc-nutrient-slot">
                <EntityText entityId={`input_text.dsc_nutrient_${slot.n}_name`} label={`Slot ${slot.n}`} />
                <TargetNumber entityId={`input_number.dsc_nutrient_${slot.n}_dose_ml_l`} label="ml/L" step={0.1} />
                <span className="dsc-mono">{slot.empty ? "—" : `${slot.ml} ml`}</span>
                {slot.short ? <StatusChip label="stock short" tone="warn" /> : null}
              </div>
            ))}
            <EntityText entityId="input_text.dsc_build_recipe_note" label="Recipe note" multiline />
            <p className="dsc-muted" style={{ margin: "8px 0 0", fontSize: 12 }}>
              ml = dose × tank × strength. Empty names stay empty — Compose does not invent products.
            </p>
          </Card>
        </div>
        <div className="dsc-col-6">
          <Card className="dsc-glass" title="Light + assign" icon="lighting">
            <ResultChip
              label={light && light !== "unknown" ? light : "No fixture"}
              empty={!light || light === "unknown"}
              onClick={() => setDraw("light")}
            />
            {pickedLight ? (
              <div className="dsc-chip-row" style={{ margin: "8px 0" }}>
                {pickedLight.wattage_w != null ? (
                  <StatusChip label={`${pickedLight.wattage_w} W`} tone="muted" />
                ) : null}
                {pickedLight.efficacy_umol_j != null ? (
                  <StatusChip label={`${pickedLight.efficacy_umol_j} µmol/J`} tone="muted" />
                ) : null}
                {pickedLight.has_ppfd || pickedLight.ppfd_url ? <StatusChip label="PPFD" tone="ok" /> : (
                  <StatusChip label="No PPFD URL" tone="warn" />
                )}
              </div>
            ) : null}
            <EntitySelect entityId="input_select.dsc_build_assign_pot" label="Assign pot" icon="root" />
            <EntitySelect entityId="input_select.dsc_build_climate_pot" label="Climate apply pot" icon="climate" />
            <div className="dsc-row-actions" style={{ marginTop: 12 }}>
              <Button primary onClick={() => setConfirm("roster")}>
                Commit roster
              </Button>
              <Button teal onClick={() => setConfirm("assign")}>
                Commit + assign
              </Button>
              <Button onClick={() => setConfirm("seat")}>Assign seat</Button>
              <Button onClick={() => setConfirm("mix")}>Accept mix</Button>
              <Button onClick={() => setConfirm("climate")}>Apply climate Want</Button>
            </div>
            <p className="dsc-honesty" style={{ marginBottom: 0 }}>
              Confirm overlay writes HA scripts. Coupled mix stays on <code>input_number.dsc_blend_pct_N</code>.
            </p>
          </Card>
        </div>
      </div>

      <DecisionLayer
        open={draw === "strain" || draw === "medium" || draw === "nutrient" || draw === "light"}
        onDismiss={() => setDraw(null)}
        title={draw ? `Search ${draw}` : "Search"}
        help={null}
      >
        {draw === "strain" || draw === "medium" || draw === "nutrient" || draw === "light" ? (
          <CatalogPicker kind={draw} onPick={(item) => pick(draw, item)} />
        ) : null}
      </DecisionLayer>

      <DecisionLayer open={draw === "vessel"} onDismiss={() => setDraw(null)} title="Vessel" help={null}>
        <div className="dsc-chip-row">
          {VESSEL_CATALOG.map((spec) => (
            <button
              key={spec.id}
              type="button"
              className={`dsc-chip${spec.id === vessel.id ? " dsc-chip--ok" : ""}`}
              onClick={() => {
                const opts = (entity("input_select.dsc_build_vessel")?.attributes?.options as string[]) || [];
                if (opts.includes(spec.id) && available("input_select.dsc_build_vessel")) {
                  void callService("input_select", "select_option", {
                    entity_id: "input_select.dsc_build_vessel",
                    option: spec.id,
                  });
                }
                void callService("input_number", "set_value", {
                  entity_id: "input_number.dsc_blend_total_l",
                  value: spec.volumeL,
                });
                setDraw(null);
              }}
            >
              <VesselGlyph spec={spec} size={28} /> {spec.label}
            </button>
          ))}
        </div>
        <p className="dsc-muted" style={{ fontSize: 12 }}>
          Default if helper missing: {DEFAULT_VESSEL.label}. Reload HA after packages load{" "}
          <code>dsc_v4_vessel.yaml</code>.
        </p>
        {available("input_select.dsc_build_vessel") ? (
          <StatusChip label="Vessel helper" tone="ok" />
        ) : (
          <StatusChip label="Volume-only until vessel select exists" tone="warn" />
        )}
      </DecisionLayer>

      <DecisionLayer
        open={confirm === "roster"}
        onDismiss={() => setConfirm(null)}
        onConfirm={() => {
          commit();
          setConfirm(null);
        }}
        title="Commit roster"
        confirmLabel="Write roster"
        help={null}
      >
        <p>
          Strain {nick || strain || "—"}. Vessel {vessel.label}. Assign helper stays {assign}. Runs{" "}
          <code>script.dsc_build_plant_commit</code>.
        </p>
      </DecisionLayer>

      <DecisionLayer
        open={confirm === "assign"}
        onDismiss={() => setConfirm(null)}
        onConfirm={() => {
          commitAssign();
          setConfirm(null);
        }}
        title="Commit + assign"
        confirmLabel="Write + assign"
        help={null}
      >
        <p>
          Writes roster then assigns pot {assign === "none" ? "(none — pick a pot first)" : assign}. Copies vessel{" "}
          {vessel.id} onto <code>{assign === "none" ? "—" : vesselEntityId(Number(assign))}</code> if that helper exists.
        </p>
      </DecisionLayer>

      <DecisionLayer
        open={confirm === "seat"}
        onDismiss={() => setConfirm(null)}
        onConfirm={() => {
          copyVesselToPot(assign);
          void callService("script", "turn_on", {
            entity_id: "script.dsc_plant_assign_to_pot",
            variables: { pot: assign },
          });
          setConfirm(null);
        }}
        title="Assign to pot"
        confirmLabel="Assign now"
        help={null}
      >
        <p>
          Assigns current roster plant to pot {assign === "none" ? "(none — pick a pot first)" : assign} via{" "}
          <code>script.dsc_plant_assign_to_pot</code>. Does not invent a roster row.
        </p>
      </DecisionLayer>

      <DecisionLayer
        open={confirm === "mix"}
        onDismiss={() => setConfirm(null)}
        onConfirm={() => {
          void callService("script", "turn_on", { entity_id: "script.dsc_accept_mix" });
          setConfirm(null);
        }}
        title="Accept mix"
        confirmLabel="Burn stock"
        help={null}
      >
        <p>
          {mixTotal.toFixed(1)} ml from tank {tank} L × {Math.round(strengthFrac * 100)}% strength. Runs{" "}
          <code>script.dsc_accept_mix</code>. Does not invent missing nutrients.
        </p>
      </DecisionLayer>
      <DecisionLayer
        open={confirm === "climate"}
        onDismiss={() => setConfirm(null)}
        onConfirm={() => {
          void callService("script", "turn_on", { entity_id: "script.dsc_apply_climate_want" });
          setConfirm(null);
        }}
        title="Apply climate Want"
        confirmLabel="Write Want"
        help={null}
      >
        <p>
          Applies custom temp/RH Want to pot{" "}
          {state("input_select.dsc_build_climate_pot", "Fleet")} via{" "}
          <code>script.dsc_apply_climate_want</code>. Does not invent catalog bands.
        </p>
      </DecisionLayer>
    </div>
  );
}
