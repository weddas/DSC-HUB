import { useEffect, useState } from "react";
import { StatusChip } from "./ui";

type Health = { mode?: string; simulation?: boolean; detail?: string };

export function DemoBanner() {
  const [health, setHealth] = useState<Health | null>(null);
  const embedded = typeof window !== "undefined" && window.self !== window.top;

  useEffect(() => {
    if (embedded) return;
    let cancelled = false;
    fetch("/health")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: Health | null) => {
        if (!cancelled && data?.mode === "demo") setHealth(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [embedded]);

  if (embedded || !health) return null;

  return (
    <div className="dsc-demo-banner" role="status" aria-live="polite">
      <StatusChip icon="alert" label="Simulated room" tone="warn" />
      <span>
        Software-only WiP demo. No hardware, LAN, or live grow room connected.
        {health.detail ? ` ${health.detail}` : ""}
      </span>
    </div>
  );
}
