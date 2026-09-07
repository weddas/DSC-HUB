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
import { deskOwnsZone } from "../routes";

/** Zone context: the two tents, the room (umbrella lung), or all side by side. */
export type ZoneFocus = "main" | "clone" | "compare" | "room";

type ZoneFocusApi = {
  focus: ZoneFocus;
  setFocus: (next: ZoneFocus) => void;
};

const ZoneFocusContext = createContext<ZoneFocusApi | null>(null);

export function parseZoneFocus(raw: string | null): ZoneFocus {
  if (raw === "clone" || raw === "compare" || raw === "room" || raw === "main") return raw;
  if (raw === "tent" || raw === "4x8") return "main";
  if (raw === "2x4") return "clone";
  if (raw === "all") return "compare";
  return "main";
}

export function ZoneFocusProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const urlOwned = deskOwnsZone(location.pathname);
  // `?zone=` is canonical; `?tent=` is the 7.x spelling and still read.
  const zoneRaw = params.get("zone") ?? params.get("tent");
  const [focus, setFocusState] = useState<ZoneFocus>(() => parseZoneFocus(zoneRaw));

  // Sync from URL only when a zone is present — bare desk entry keeps in-memory focus,
  // so walking Climate → Root → Light keeps the zone you were looking at.
  useEffect(() => {
    if (!urlOwned || zoneRaw == null) return;
    setFocusState(parseZoneFocus(zoneRaw));
  }, [urlOwned, zoneRaw]);

  const setFocus = useCallback(
    (next: ZoneFocus) => {
      setFocusState(next);
      // Never write ?zone= on routes the Shell strips — that fight stuck the old tabs.
      if (!urlOwned) return;
      const nextParams = new URLSearchParams(params);
      nextParams.set("zone", next);
      nextParams.delete("tent");
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

/** The tent a zone focus resolves to when a surface is strictly per-tent. */
export function tentFromFocus(focus: ZoneFocus): "main" | "clone" {
  return focus === "clone" ? "clone" : "main";
}
