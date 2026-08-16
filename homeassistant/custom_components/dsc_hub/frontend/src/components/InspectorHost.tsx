import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { EntityInspector, type InspectorTarget } from "./EntityInspector";

type InspectorApi = {
  open: (target: InspectorTarget) => void;
  close: () => void;
};

const InspectorCtx = createContext<InspectorApi | null>(null);

export function InspectorProvider({ children }: { children: ReactNode }) {
  const [target, setTarget] = useState<InspectorTarget | null>(null);
  const close = useCallback(() => setTarget(null), []);
  const open = useCallback((next: InspectorTarget) => setTarget(next), []);
  const api = useMemo(() => ({ open, close }), [open, close]);
  return (
    <InspectorCtx.Provider value={api}>
      {children}
      <EntityInspector target={target} onClose={close} />
    </InspectorCtx.Provider>
  );
}

export function useInspector(): InspectorApi {
  const ctx = useContext(InspectorCtx);
  if (!ctx) {
    return {
      open: () => undefined,
      close: () => undefined,
    };
  }
  return ctx;
}
