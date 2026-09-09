import { formatApiError } from "./apiError";

/** What a device draws, and who decided.
 *
 * `locked` is the one the UI must respect: a device matched to a catalogue product takes
 * that product's nameplate, and typing over it would leave the energy estimate disagreeing
 * with the hardware it describes.
 *
 * `watts: null` means NOT SET — deliberately not 0. Zero is a claim that a heater draws
 * nothing; absent is the truth, and the estimate leaves it out rather than under-counting.
 */
export type DevicePower = {
  device_id: string;
  label: string;
  kind: "appliance" | "light" | "fan";
  in_service: boolean;
  watts: number | null;
  source: "catalog" | "operator" | "unset";
  locked: boolean;
  catalog_id: string | null;
  note: string;
  /** What the operator typed, kept even while a catalogue match overrides it. */
  operator_watts: number | null;
};

export async function fetchDevicePower(): Promise<{ devices: DevicePower[]; max_watts: number }> {
  const resp = await fetch("/settings/device-power");
  if (!resp.ok) throw new Error(formatApiError(await resp.text(), "could not load device power"));
  return resp.json();
}

export async function setDevicePower(deviceId: string, watts: number | null): Promise<DevicePower> {
  const resp = await fetch(`/settings/device-power/${encodeURIComponent(deviceId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ watts }),
  });
  if (!resp.ok) {
    // 409 carries the brain's own sentence about which product owns the value — surface it.
    throw new Error(formatApiError(await resp.text(), "could not save the wattage"));
  }
  return (await resp.json()).device as DevicePower;
}
