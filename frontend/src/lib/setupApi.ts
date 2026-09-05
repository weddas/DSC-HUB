/** Kit Setup API helpers (DSC-HUB 8.0.0). */

export type SetupState = {
  commissioned: boolean;
  phase: string;
  debt: string[];
  version?: string;
  surface?: string;
};

export type SetupHealth = {
  brain_ok?: boolean;
  mosquitto_ok?: boolean;
  z2m_ok?: boolean;
  fleet_online?: boolean;
  zigbee_up?: boolean;
  eth_up?: boolean;
  catalog?: { mode?: string; blocking?: boolean };
};

export type NetworkStatus = {
  operator_mode?: string;
  eth_carrier?: boolean;
  spa_urls?: string[];
  ap_ssid?: string;
};

export type UsbPort = {
  device: string;
  by_id?: string;
  vid_pid?: string;
  chip_hint?: string;
};

export type UsbManifest = {
  kit_roles: string[];
  roles: Record<string, { binary?: string; chip?: string; boot_mode_note?: string }>;
};

async function readJson<T>(resp: Response): Promise<T> {
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(text || `HTTP ${resp.status}`);
  }
  return resp.json() as Promise<T>;
}

export async function getSetupState(): Promise<SetupState> {
  return readJson(await fetch("/setup/state"));
}

export async function getSetupHealth(): Promise<SetupHealth> {
  return readJson(await fetch("/setup/health"));
}

export async function postSetupPhase(phase: string): Promise<SetupState> {
  return readJson(
    await fetch("/setup/phase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phase }),
    }),
  );
}

export async function postSetupDebt(item: string): Promise<SetupState> {
  return readJson(
    await fetch("/setup/debt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item }),
    }),
  );
}

export async function postSetupCommission(requireHubOnline = false): Promise<SetupState> {
  return readJson(
    await fetch("/setup/commission", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ require_hub_online: requireHubOnline }),
    }),
  );
}

export async function getNetworkStatus(): Promise<NetworkStatus> {
  return readJson(await fetch("/settings/network"));
}

export async function getUsbPorts(): Promise<UsbPort[]> {
  const data = await readJson<{ ports?: UsbPort[] }>(await fetch("/settings/usb-flash/ports"));
  return data.ports ?? [];
}

export async function getUsbManifest(): Promise<UsbManifest> {
  return readJson(await fetch("/settings/usb-flash/manifest"));
}

export async function queueUsbFlash(role: string, port: string): Promise<Record<string, unknown>> {
  return readJson(
    await fetch("/settings/usb-flash/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, port }),
    }),
  );
}

export async function getUsbFlashJob(jobId: string): Promise<Record<string, unknown>> {
  return readJson(await fetch(`/settings/usb-flash/jobs/${encodeURIComponent(jobId)}`));
}
