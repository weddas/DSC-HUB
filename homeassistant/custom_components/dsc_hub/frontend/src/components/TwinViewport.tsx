/** Mount point for TwinKeepAlive portal on /live/twin and /ops/dash. */
export const TWIN_SLOT_ID = "dsc-twin-slot";

export function TwinViewport() {
  return <div id={TWIN_SLOT_ID} className="dsc-twin-slot" aria-label="Digital twin viewport" />;
}
