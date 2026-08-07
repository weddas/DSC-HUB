import { Link } from "react-router-dom";
import { LegacyCardHost } from "../components/LegacyCardHost";
import { Button, Card, Icon, PageHeader } from "../components/ui";

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
          <Card title="Fleet seats">
            <p className="dsc-muted">Want–Need–Got seats and nutrient science.</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
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
      <PageHeader title="Plant · Build" subtitle="Compose mode — legacy card hosted in panel chrome." />
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
  return (
    <div className="dsc-page">
      <PageHeader title="Plant · Strains" subtitle="Fleet seats / Want–Need–Got." />
      <Card title="Roster">
        <p className="dsc-muted" style={{ marginTop: 0 }}>
          Strain seat management still lands via HA helpers for lab soak. Prefer brain catalog APIs for durable logic.
        </p>
        <Link to="/plant/build">
          <Button primary>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <Icon name="build" size={14} /> Use in Build
            </span>
          </Button>
        </Link>
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
