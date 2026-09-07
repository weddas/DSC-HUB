import { useNavigate } from "react-router-dom";
import { useHistory } from "../hooks/useHistory";
import type { ZoneModel } from "../hooks/useZones";
import { fmtFractionOfHours, inBandFraction } from "../lib/derived/climate";
import { paths } from "../lib/paths";
import type { ZoneTone } from "../lib/zoneTone";
import type { PanelTone } from "./Panel";
import { Panel, PhaseChip } from "./Panel";
import { Triad } from "./Triad";
import { StatusTag } from "./ui";
import { UpdatedStamp } from "./UpdatedStamp";
import { applianceIcon } from "../lib/deviceIcons";
import type { BandChartKind } from "./BandChartHost";

export function panelToneFor(tone: ZoneTone): PanelTone {
  switch (tone) {
    case "critical":
      return "bad";
    case "warn":
    case "stale":
      return "warn";
    case "ok":
      return "ok";
    case "muted":
      return "muted";
    default: {
      const _exhaustive: never = tone;
      return _exhaustive;
    }
  }
}

function wantText(z: ZoneModel): string | null {
  const t = z.temp.band ? `${Math.round((z.temp.band.min + z.temp.band.max) / 2)}` : null;
  const rh = z.rh.band ? `${Math.round(z.rh.band.min)}–${Math.round(z.rh.band.max)}` : null;
  const vpd = z.vpd.band ? `${z.vpd.band.min.toFixed(1)}–${z.vpd.band.max.toFixed(1)}` : null;
  const parts = [t, rh, vpd].filter(Boolean);
  return parts.length ? `WANT ${parts.join(" · ")}` : null;
}

function lampTag(z: ZoneModel): { label: string; tone: "lamp" | "muted"; dashed: boolean; title: string } | null {
  const lamp = z.lamp;
  if (!lamp) return null;
  const name = lamp.kind === "twin" ? "TWIN" : lamp.kind === "window" ? "WINDOW" : "LAMP";
  if (!lamp.available) return { label: `${name} —`, tone: "muted", dashed: true, title: "Not reporting" };
  if (!lamp.on) return { label: `${name} OFF`, tone: "muted", dashed: false, title: lamp.kind === "window" ? "Schedule window closed — no lamp bound to the 4×8" : "Lamp off" };
  const bits = [`${name} ON`];
  if (lamp.brightnessPct != null) bits.push(`${lamp.brightnessPct}%`);
  if (lamp.ppfd != null) bits.push(`${Math.round(lamp.ppfd)} PPFD`);
  if (lamp.dli != null) bits.push(`DLI ${lamp.dli.toFixed(1)}`);
  return {
    label: bits.join(" · "),
    tone: "lamp",
    dashed: false,
    title:
      lamp.kind === "window"
        ? "Schedule window open — no lamp bound to the 4×8, so this is the photoperiod, not a fixture"
        : lamp.ppfd != null
          ? `PPFD from the SF1000 calibration curve at ${lamp.brightnessPct ?? "?"}% · DLI = PPFD × ${z.lightHours ?? "?"} h`
          : "Lamp on — no PPFD calibration yet",
  };
}

/**
 * The tent panel (frame 2a): legend `4×8 · EARLY FLWR · DAY 34`, the triad, then the
 * tag row — WANT, appliances, lamp (with derived PPFD/DLI), probes, cultivar.
 * Density: the same card at 2-up; Pass C adds the compact 4-up and row variants.
 */
export function ZoneCard({
  zone,
  onChart,
}: {
  zone: ZoneModel;
  onChart?: (kind: BandChartKind) => void;
}) {
  const navigate = useNavigate();
  const tone = panelToneFor(zone.tone);
  const legendBits = [zone.label];
  if (zone.stageShort) legendBits.push(zone.stageShort.toUpperCase());
  if (zone.day != null) legendBits.push(`DAY ${zone.day}`);
  const { points } = useHistory(zone.vpd.entityId, 24, 96);
  const inBand = inBandFraction(points, zone.vpd.band);
  const inBandText = inBand != null ? `VPD IN BAND ${fmtFractionOfHours(inBand, 24)} · 24H` : null;
  const lamp = lampTag(zone);
  const want = wantText(zone);
  const tent = zone.id === "clone" ? "clone" : "main";
  const nonGrow = zone.role !== "grow" && zone.role !== "room";

  return (
    <Panel
      tone={tone}
      live={tone === "bad"}
      legendIcon="grow-tent"
      legend={legendBits.join(" · ")}
      legendRight={
        <>
          {inBandText ? <span>{inBandText}</span> : null}
          <UpdatedStamp />
        </>
      }
      onLegendClick={() => navigate(paths.tent(tent))}
      legendTitle="Open the tent cockpit"
      className="dsc-zone-card"
    >
      <Triad temp={zone.temp} rh={zone.rh} vpd={zone.vpd} leafVpd={zone.leafVpd} onOpen={onChart} />
      <div className="dsc-tagrow">
        {zone.phase ? (
          <PhaseChip
            phase={zone.phase}
            title={nonGrow ? `Role ${zone.role}, set in Settings > Zones` : "Growth phase from the stage preset"}
          />
        ) : null}
        {nonGrow && zone.lamp?.on ? (
          <StatusTag
            label="LAMP ON · ROLE NOT ENFORCED"
            tone="warn"
            title="The role is recorded, but a flip does not switch the lamp yet. Turn it off on the Light desk."
            onClick={() => navigate(paths.light({ zone: tent }))}
          />
        ) : null}
        {want ? <StatusTag icon="target-goal" label={want} tone="muted" title={nonGrow ? "Want band from the role preset" : "Want band from the plant rail / stage preset"} /> : null}
        {zone.appliances.map((a) => (
          <StatusTag
            key={a.id}
            icon={applianceIcon(a.id)}
            label={a.label}
            tone={a.tone}
            dashed={a.dashed}
            live={a.state === "on"}
            title={
              a.state === "oos"
                ? "Out of service for this kit — honest OOS, not an alarm"
                : a.state === "offline"
                  ? "Relay not reporting"
                  : a.state === "on"
                    ? "Demand on"
                    : "Idle"
            }
            onClick={() => navigate(paths.climate({ zone: tent }))}
          />
        ))}
        {lamp ? (
          <StatusTag
            icon={zone.lamp?.kind === "twin" ? "grow-light-led-panel" : zone.lamp?.kind === "window" ? "light-schedule" : "grow-light"}
            label={lamp.label}
            tone={lamp.tone}
            dashed={lamp.dashed}
            title={lamp.title}
            onClick={() => navigate(paths.light({ zone: tent }))}
          />
        ) : null}
        {zone.probes.map((p) => (
          <StatusTag
            key={p.n}
            icon="soil-probe"
            label={
              p.oos
                ? `${p.label.toUpperCase()} OOS`
                : `${p.label.toUpperCase()} ${p.plantName.toUpperCase()}${Number.isFinite(p.moisture) ? ` · ${Math.round(p.moisture)}%` : " · —"}`
            }
            tone={p.oos ? "muted" : p.tone === "critical" ? "bad" : p.tone === "warn" || p.tone === "stale" ? "warn" : p.tone === "ok" ? "ok" : "muted"}
            dashed={p.oos}
            title={p.oos ? "Probe out of service" : "Soil moisture — open Root"}
            onClick={() => navigate(paths.root({ zone: tent, pot: p.n }))}
          />
        ))}
        {zone.cultivar ? <StatusTag icon="strain-tag" label={zone.cultivar} tone="muted" title="From the roster" /> : null}
      </div>
    </Panel>
  );
}
