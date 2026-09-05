import type { HomeAssistant } from "../vite-env";

/**
 * Pi SPA: brain replaces the synthetic hass object every WS tick. App/HassProvider
 * stay mounted without re-rendering, so they keep a prop-era hassRef. Publishers
 * write here; HassProvider reads as fallback so callService/state see fresh states
 * when something does re-render, and so rare HA-fallback paths stay honest.
 */
export const piHassBridge: { current: HomeAssistant | null } = { current: null };
