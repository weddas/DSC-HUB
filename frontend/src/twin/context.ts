import { createContext, useContext } from "react";
import type * as THREE from "three";
import type { TwinModel } from "./manifest";
import type { TwinPalette, TwinStyle } from "./wire";
import type { TwinState } from "../lib/twinState";
import type { InspectorKind } from "../components/EntityInspector";

/** Which effect layers the operator has switched on. */
export interface TwinLayers {
  air: boolean;
  heat: boolean;
  humidity: boolean;
  light: boolean;
  plants: boolean;
  devices: boolean;
  labels: boolean;
  /** Call out every instance nothing live is driving, in the scene itself. */
  bindings: boolean;
}

export const DEFAULT_LAYERS: TwinLayers = { air: true, heat: true, humidity: true, light: true, plants: true, devices: true, labels: true, bindings: true };

/** What a hovered part tells the shared label: where it is, what it is, which entity it binds. */
export interface TwinHover {
  id: string;
  label: string;
  sub?: string;
  entityId?: string;
  pos: THREE.Vector3;
}

export interface TwinPick {
  entityId: string;
  label: string;
  unit?: string;
  kind?: InspectorKind;
}

export interface TwinContextValue {
  palette: TwinPalette;
  models: Record<string, TwinModel>;
  state: TwinState;
  layers: TwinLayers;
  /** Wire · x-ray · solid — how the shells are drawn. */
  style: TwinStyle;
  hover: TwinHover | null;
  setHover: (h: TwinHover | null) => void;
  onPick?: (p: TwinPick) => void;
  /** True when the operator asked for reduced motion but forced the live twin anyway. */
  calm: boolean;
}

export const TwinCtx = createContext<TwinContextValue | null>(null);

export function useTwin(): TwinContextValue {
  const v = useContext(TwinCtx);
  if (!v) throw new Error("useTwin outside <TwinStage>");
  return v;
}
