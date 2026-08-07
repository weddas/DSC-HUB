/// <reference types="vite/client" />

declare module "*.css?inline" {
  const css: string;
  export default css;
}

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed?: string;
  last_updated?: string;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  callService: (
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>,
  ) => Promise<unknown>;
  callWS: <T = unknown>(msg: Record<string, unknown>) => Promise<T>;
  connection?: { subscribeEvents: (...args: unknown[]) => unknown };
  language?: string;
  localize?: (key: string, ...args: unknown[]) => string;
}

declare global {
  interface HTMLElementTagNameMap {
    "dsc-hub-panel": HTMLElement;
  }
}

export {};
