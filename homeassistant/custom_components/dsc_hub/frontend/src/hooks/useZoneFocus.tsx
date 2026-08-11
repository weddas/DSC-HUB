import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useSearchParams } from "react-router-dom";

export type ZoneFocus = "main" | "clone" | "compare" | "room";

type ZoneFocusApi = {
  focus: ZoneFocus;
  setFocus: (next: ZoneFocus) => void;
};

const ZoneFocusContext = createContext<ZoneFocusApi | null>(null);

function parseFocus(raw: string | null): ZoneFocus {
  if (raw === "clone" || raw === "compare" || raw === "room" || raw === "main") return raw;
  if (raw === "tent") return "main";
  return "main";
}

export function ZoneFocusProvider({ children }: { children: ReactNode }) {
  const [params, setParams] = useSearchParams();
  const focus = parseFocus(params.get("tent") ?? params.get("zone"));

  const setFocus = useCallback(
    (next: ZoneFocus) => {
      const nextParams = new URLSearchParams(params);
      nextParams.set("tent", next);
      nextParams.delete("zone");
      setParams(nextParams, { replace: true });
    },
    [params, setParams],
  );

  const value = useMemo(() => ({ focus, setFocus }), [focus, setFocus]);
  return <ZoneFocusContext.Provider value={value}>{children}</ZoneFocusContext.Provider>;
}

export function useZoneFocus(): ZoneFocusApi {
  const ctx = useContext(ZoneFocusContext);
  if (!ctx) {
    return {
      focus: "main",
      setFocus: () => undefined,
    };
  }
  return ctx;
}
