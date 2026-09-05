import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLocation, useSearchParams } from "react-router-dom";

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

/** Routes that own `?tent=` / `?zone=` in the URL (Shell strips elsewhere). */
function pathOwnsTentQuery(pathname: string): boolean {
  return pathname === "/live/climate" || pathname === "/ops/home";
}

export function ZoneFocusProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const urlOwned = pathOwnsTentQuery(location.pathname);
  const tentRaw = params.get("tent") ?? params.get("zone");
  const [focus, setFocusState] = useState<ZoneFocus>(() => parseFocus(tentRaw));

  // Sync from URL only when tent/zone is present — bare Climate entry must keep in-memory focus.
  useEffect(() => {
    if (!urlOwned || tentRaw == null) return;
    setFocusState(parseFocus(tentRaw));
  }, [urlOwned, tentRaw]);

  const setFocus = useCallback(
    (next: ZoneFocus) => {
      setFocusState(next);
      // Never write ?tent= on routes Shell will strip — that fight sticks Live tabs.
      if (!urlOwned) return;
      const nextParams = new URLSearchParams(params);
      nextParams.set("tent", next);
      nextParams.delete("zone");
      setParams(nextParams, { replace: true });
    },
    [params, setParams, urlOwned],
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
