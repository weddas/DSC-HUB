/**
 * Twin soft APIs the React panel already calls on `<dsc-the-dash-card>`.
 *
 * End-state extract: move createScene from the Dash IIFE into a shared
 * `dsc-twin` / R3F module AFTER neon restyle + these methods exist.
 * Do not rewrite the scene here — a lying extract is worse than an honest IIFE.
 *
 * Implemented on the IIFE (`homeassistant/www/dsc-the-dash-card.js` createScene):
 *   pause(bool)         — cancel rAF when keepalive is not .is-active / tab hidden
 *   setFocusTent(mode)  — camera + tent visibility; never setConfig for focus
 *   setHeld(bool)       — freeze wisps/fans/shafts (no last-good animation)
 *   setPots(VesselLive[]) — React-owned moisture/Need/OOS/silhouette/dryback/soilT
 *   setUiChrome({hideHud}) — Main/Clone cockpits: canvas only
 *
 * When extracting: copy those five methods into a module, keep HA SoT in React,
 * leave Lovelace hosting the same IIFE until the module is wired.
 */
export type TwinFocusTent = "main" | "clone" | null;

export interface VesselLive {
  id: string;
  pot: number;
  tent: "main" | "clone" | "unassigned";
  slot: number;
  inService: boolean;
  silhouette?: string;
  moisture?: number;
  ec?: number;
  ph?: number;
  soilT?: number;
  dryback?: number;
  need?: string;
  held?: boolean;
  untrusted?: boolean;
}

export interface TwinCardEl extends HTMLElement {
  setConfig?: (c: Record<string, unknown>) => void;
  hass?: unknown;
  pause?: (paused: boolean) => void;
  setFocusTent?: (mode: TwinFocusTent) => void;
  setHeld?: (held: boolean) => void;
  setPots?: (pots: VesselLive[]) => void;
  setUiChrome?: (flags: { hideHud?: boolean }) => void;
}
