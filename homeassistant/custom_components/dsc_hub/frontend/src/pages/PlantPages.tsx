import { Link } from "react-router-dom";
import { LegacyCardHost } from "../components/LegacyCardHost";
import { Button, Card, Icon, PageHeader, StatusChip } from "../components/ui";
import { useHass } from "../hooks/useHass";
import { rosterSlots, tentLabel, readTent } from "../lib/seatModel";

export function PlantHubPage() {
  return (
    <div className="dsc-page">
      <PageHeader
        title="Plant"
        subtitle="Build, catalog research, roster seats, and mix tools."
      />
      <div className="dsc-grid">
        <div className="dsc-col-4">
          <Card title="Build a Plant">
            <p className="dsc-muted">Compose soil blend, roster, and climate Want.</p>
            <Link to="/plant/build">
              <Button primary>Open Build</Button>
            </Link>
          </Card>
        </div>
        <div className="dsc-col-4">
          <Card title="Catalog Explorer">
            <p className="dsc-muted">Browse strains, nutrients, mediums, lights.</p>
            <Link to="/plant/catalog">
              <Button primary>Open Catalog</Button>
            </Link>
          </Card>
        </div>
        <div className="dsc-col-4">
          <Card title="Plant seat">
            <p className="dsc-muted">Soil, age, nutrients, tent apply.</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Link to="/plant/seat?pot=1">
                <Button primary>Open Seat</Button>
              </Link>
              <Link to="/plant/strains">
                <Button>Strains</Button>
              </Link>
              <Link to="/plant/nutrient">
                <Button>Nutrient</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function PlantBuildPage() {
  return (
    <div className="dsc-page">
      <PageHeader title="Plant · Build" subtitle="Compose mode — result-first glass card." />
      <LegacyCardHost tag="dsc-build-plant-card" config={{}} />
    </div>
  );
}

export function PlantCatalogPage() {
  return (
    <div className="dsc-page">
      <PageHeader title="Plant · Catalog" subtitle="Research browser over /local/dsc-catalog indexes." />
      <LegacyCardHost tag="dsc-catalog-browse-card" config={{}} />
    </div>
  );
}

export function PlantStrainsPage() {
  const { entity, state, tick } = useHass();
  void tick;
  const slots = rosterSlots(entity);

  return (
    <div className="dsc-page">
      <PageHeader title="Plant · Strains" subtitle="Roster seats — open a row for Plant Seat." />
      <Card className="dsc-glass" title="Roster">
        {!slots.length ? (
          <p className="dsc-muted" style={{ marginTop: 0 }}>
            No plants in roster yet. Commit from Build, then assign a pot.
          </p>
        ) : (
          <table className="dsc-table">
            <thead>
              <tr>
                <th>Slot</th>
                <th>Name</th>
                <th>Strain</th>
                <th>Status</th>
                <th>Pot</th>
                <th>Tent</th>
              </tr>
            </thead>
            <tbody>
              {slots.map((s) => {
                const pot = Number(s.pot);
                const tent =
                  pot >= 1 && pot <= 4 ? tentLabel(readTent(state, pot)) : "—";
                return (
                  <tr key={s.slot}>
                    <td>#{s.slot}</td>
                    <td>{s.nickname || "—"}</td>
                    <td>{s.strain || "—"}</td>
                    <td>{s.status || "—"}</td>
                    <td>
                      {pot >= 1 && pot <= 4 ? (
                        <Link to={`/plant/seat?pot=${pot}`}>P{pot}</Link>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      <StatusChip label={tent} tone="muted" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        <div style={{ marginTop: 12 }}>
          <Link to="/plant/build">
            <Button primary>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <Icon name="build" size={14} /> Use in Build
              </span>
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

export function PlantNutrientPage() {
  return (
    <div className="dsc-page">
      <PageHeader title="Plant · Nutrient science" subtitle="Mix lab / dose tools." />
      <Card title="Mix lab">
        <p className="dsc-muted" style={{ marginTop: 0 }}>
          Nutrient dose and stage tools — open Build for the interactive mixer, Catalog for SKU research.
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <Link to="/plant/build">
            <Button primary>Build mixer</Button>
          </Link>
          <Link to="/plant/catalog">
            <Button>Catalog nutrients</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
