// composables/useRdService.ts
//
// Talks to the locally-running RD (Registered Device) service to capture a PidData XML
// blob for NSDL's updatebiodetail / AEPS transaction calls. All UIDAI-certified RD
// services expose the same two custom HTTP verbs — DEVICEINFO (detect) and CAPTURE
// (scan) — each vendor's driver just binds its own local port so multiple services can
// coexist on one machine. Mantra's port (127.0.0.1:11100) is confirmed working — it's
// the one already used in components/Vendor/Onboarding/AEPS/Onboard.vue. The other three
// ports below follow each vendor's documented default but haven't been verified against
// a live device in this codebase — confirm against the vendor's SDK/driver docs (Morpho
// RD Service, Startek FM220, SecuGen) before relying on them in production.
import { ref } from "vue";

export interface RdVendor {
  id: "mantra" | "morpho" | "startek" | "secugen";
  name: string;
  port: number;
}

export const RD_VENDORS: RdVendor[] = [
  { id: "mantra", name: "Mantra", port: 11100 },   // MFS100 — confirmed
  { id: "morpho", name: "Morpho", port: 11101 },   // placeholder — verify against Morpho RD Service docs
  { id: "startek", name: "Startek", port: 11103 }, // placeholder — verify against Startek FM220 docs
  { id: "secugen", name: "Secugen", port: 11102 }, // placeholder — verify against SecuGen docs
];

const PID_OPTIONS_XML =
  '<?xml version="1.0"?><PidOptions ver="1.0"><Opts fCount="1" fType="2" iCount="0" iType="0" pCount="0" pType="0" format="0" pidVer="2.0" timeout="10000" posh="UNKNOWN" env="P" wadh="E0jzJ/P8UopUHAieZn8CKqS4WPMi5ZSYXgfnlfkWjrc="/></PidOptions>';

function attr(xml: string, name: string): string | undefined {
  // Checks both a root-level attribute and one nested under <Devices><Device ...>,
  // since vendors place dpId/rdsId/rdsVer/mi/dc differently in their DeviceInfo XML.
  return xml.match(new RegExp(`${name}="([^"]+)"`))?.[1] ?? xml.match(new RegExp(`<${name}>([^<]+)</${name}>`))?.[1];
}

export interface RdDeviceInfo {
  vendor: RdVendor;
  dpId: string;
  rdsId: string;
  driverVersion: string;   // rdsVer
  modelInfo: string;       // mi
  healthy: boolean;        // derived from the dc (device-compliant) flag, when present
}

// Module-level (singleton) state — matches the pattern already used by useSnackbar.ts
// and useNetworkStatus.ts. A device-selector component and a capture button on the same
// page both call useRdService(); they need to see the same connection, not two
// independent ones, so the state lives outside the function rather than being
// re-created per call.
const deviceConnected = ref(false);
const deviceInfo = ref<RdDeviceInfo | null>(null);
const selectedVendor = ref<RdVendor>(RD_VENDORS[0]);

export function useRdService() {
  const parseDeviceInfo = (vendor: RdVendor, xml: string): RdDeviceInfo | null => {
    const dpId = attr(xml, "dpId");
    const rdsId = attr(xml, "rdsId");
    if (!dpId || !rdsId) return null;
    const dc = (attr(xml, "dc") || "").toUpperCase();
    return {
      vendor,
      dpId,
      rdsId,
      driverVersion: attr(xml, "rdsVer") || "—",
      modelInfo: attr(xml, "mi") || vendor.name,
      healthy: dc ? dc === "Y" : true, // no dc flag returned → assume healthy rather than warn without evidence
    };
  };

  const probeVendor = async (vendor: RdVendor): Promise<RdDeviceInfo | null> => {
    try {
      const res = await fetch(`http://127.0.0.1:${vendor.port}/rd/info`, {
        method: "DEVICEINFO",
        headers: { "Content-Type": "text/xml" },
        signal: AbortSignal.timeout(4000),
      });
      if (!res.ok) return null;
      return parseDeviceInfo(vendor, await res.text());
    } catch {
      return null;
    }
  };

  /** Tries each vendor's port in priority order, stopping at the first that answers.
   *  Deliberately sequential rather than Promise.all: a normal install only has one RD
   *  service running, and probing every port in parallel means the browser logs a
   *  net::ERR_CONNECTION_REFUSED line for each absent vendor on every scan — that's
   *  unsuppressable from JS (it comes from the network stack, not the caught rejection)
   *  and reads as broken even though the actual capture works fine. Stopping early keeps
   *  the common single-device case silent. */
  const findFirstConnectedVendor = async (): Promise<RdDeviceInfo | null> => {
    for (const vendor of RD_VENDORS) {
      const info = await probeVendor(vendor);
      if (info) return info;
    }
    return null;
  };

  /** Scans every known RD service port in parallel and returns all that respond — used
   *  only for the opt-in "check for other devices" action, not on every default scan,
   *  since it always logs a console error for each vendor that isn't actually connected. */
  const scanAllVendors = async (): Promise<RdDeviceInfo[]> => {
    const results = await Promise.all(RD_VENDORS.map(probeVendor));
    return results.filter((r): r is RdDeviceInfo => r !== null);
  };

  /** Detects the currently selected vendor's device. */
  const detectDevice = async () => {
    const info = await probeVendor(selectedVendor.value);
    if (info) {
      deviceInfo.value = info;
      deviceConnected.value = true;
      return { ok: true as const, info };
    }
    deviceConnected.value = false;
    deviceInfo.value = null;
    return {
      ok: false as const,
      message: `${selectedVendor.value.name} RD service not responding — start the driver and reconnect`,
    };
  };

  const selectVendor = (vendor: RdVendor) => {
    selectedVendor.value = vendor;
    deviceConnected.value = false;
    deviceInfo.value = null;
  };

  /** Returns the raw PidData XML (for updatebiodetail / AEPS calls). */
  const captureFingerprint = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:${selectedVendor.value.port}/rd/capture`, {
        method: "CAPTURE",
        headers: {
          "Content-Type": "text/xml",
          "Content-Length": String(new TextEncoder().encode(PID_OPTIONS_XML).length),
        },
        body: PID_OPTIONS_XML,
        signal: AbortSignal.timeout(20000),
      });
      const xml = await res.text();
      const errCode = attr(xml, "errCode");
      const errInfo = attr(xml, "errInfo");
      if (errCode && errCode !== "0") throw new Error(errInfo || `Capture failed (errCode ${errCode})`);
      return { ok: true as const, pidDataXml: xml };
    } catch (err: any) {
      const msg = err?.message || "";
      const friendly = msg.includes("Failed to fetch") || msg.includes("NetworkError") || err?.name === "TimeoutError"
        ? "Lost connection to the biometric device during capture"
        : msg || "Fingerprint capture failed — ask the customer to try again";
      return { ok: false as const, message: friendly };
    }
  };

  return {
    deviceConnected,
    deviceInfo,
    selectedVendor,
    selectVendor,
    detectDevice,
    findFirstConnectedVendor,
    scanAllVendors,
    captureFingerprint,
  };
}
