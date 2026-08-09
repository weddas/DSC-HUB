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

export interface HassConnection {
  subscribeEvents: (
    callback: (event: HassEvent) => void,
    eventType?: string,
  ) => Promise<() => void> | (() => void);
  subscribeMessage?: (
    callback: (msg: unknown) => void,
    subscribeMessage: Record<string, unknown>,
  ) => Promise<() => void>;
}

export interface HassEvent {
  event_type: string;
  data: {
    entity_id?: string;
    new_state?: HassEntity | null;
    old_state?: HassEntity | null;
    [key: string]: unknown;
  };
  time_fired?: string;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  callService: (
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>,
  ) => Promise<unknown>;
  callWS: <T = unknown>(msg: Record<string, unknown>) => Promise<T>;
  connection?: HassConnection;
  language?: string;
  localize?: (key: string, ...args: unknown[]) => string;
}

declare global {
  interface HTMLElementTagNameMap {
    "dsc-hub-panel": HTMLElement;
  }
}

export {};
