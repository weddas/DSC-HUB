import { Suspense, memo, useCallback, useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Grid, Html } from "@react-three/drei";
import { TwinCtx, type TwinHover, type TwinLayers, type TwinPick } from "./context";
import { CameraRig, type CameraPreset } from "./CameraRig";
import { FrameLoop, type FrameReport } from "./FrameLoop";
import { RigScene } from "./RigScene";
import { clearAnchors } from "./anchors";
import { loadPlacements } from "./placements";
import type { TwinModel } from "./manifest";
import type { TwinPalette } from "./wire";
import type { TwinStyle } from "./presets";
import type { TwinState } from "../lib/twinState";

export interface TwinStageProps {
  models: TwinModel[];
  state: TwinState;
  palette: TwinPalette;
  layers: TwinLayers;
  /** Wire · x-ray · solid. */
  style?: TwinStyle;
  preset: CameraPreset;
  cinematic: boolean;
  /** In view and tab visible — the loop stops when false. */
  active: boolean;
  /** Reduced motion was requested but the operator forced the live twin: no spin, no glide. */
  calm?: boolean;
  onPerf?: (p: FrameReport) => void;
  onPick?: (p: TwinPick) => void;
}

function HoverLabel({ hover }: { hover: TwinHover | null }) {
  if (!hover) return null;
  return (
    <Html position={[hover.pos.x, hover.pos.y + 0.08, hover.pos.z]} center zIndexRange={[40, 0]} style={{ pointerEvents: "none" }}>
      <div className="dsc-twin-hover">
        <b>{hover.label}</b>
        {hover.sub ? <span>{hover.sub}</span> : null}
      </div>
    </Html>
  );
}

/**
 * The twin stage: the whole rig in the wire look with its effect layers, over the grid
 * wash, driven by `TwinState`. Loaded as part of the lazy `twin-three` chunk; the wrapper
 * (`components/TwinStagePanel.tsx`) gates it for phones, reduced motion and visibility.
 */
function TwinStageImpl({ models, state, palette, layers, style = "wire", preset, cinematic, active, calm = false, onPerf, onPick }: TwinStageProps) {
  const [hover, setHover] = useState<TwinHover | null>(null);
  const modelMap = useMemo(() => Object.fromEntries(models.map((m) => [m.slug, m])), [models]);
  useEffect(() => () => clearAnchors(), []);
  // Where the operator has moved things (plan-spatial-layout S4). Fetched once per mount;
  // an empty or failed load leaves every instance at the scene's own literal.
  useEffect(() => {
    void loadPlacements();
  }, []);
  const ctx = useMemo(
    () => ({ palette, models: modelMap, state, layers, style, hover, setHover, onPick, calm }),
    [palette, modelMap, state, layers, style, hover, onPick, calm],
  );
  const onFrame = useCallback((p: FrameReport) => onPerf?.(p), [onPerf]);
  return (
    <Canvas
      frameloop="never"
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [3.9, 2.7, 4.9], fov: 38, near: 0.05, far: 60 }}
      style={{ background: "transparent" }}
      onPointerMissed={() => setHover(null)}
    >
      <color attach="background" args={[palette.background]} />
      <fog attach="fog" args={[palette.background, 7, 16]} />
      <TwinCtx.Provider value={ctx}>
        <Suspense fallback={null}>
          <RigScene />
        </Suspense>
        <HoverLabel hover={hover} />
      </TwinCtx.Provider>
      <Grid
        position={[0, -0.03, 0]}
        args={[12, 12]}
        cellSize={0.25}
        cellThickness={0.5}
        cellColor={palette.dim}
        sectionSize={1}
        sectionThickness={1}
        sectionColor={palette.teal}
        fadeDistance={11}
        fadeStrength={1.3}
        infiniteGrid
      />
      <CameraRig preset={preset} cinematic={cinematic} calm={calm} />
      <FrameLoop active={active} onFrame={onFrame} />
    </Canvas>
  );
}

/** Memoised: the page re-renders on every bus tick; the stage only needs to when its props change. */
const TwinStage = memo(TwinStageImpl);
export default TwinStage;
