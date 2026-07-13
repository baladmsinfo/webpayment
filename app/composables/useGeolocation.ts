// composables/useGeolocation.ts
// AEPS transactions require the agent's Latitude/Longitude on every call (NSDL requirement).
// Mirrors the plain navigator.geolocation pattern already used in pages/index.vue for
// session-location tracking, wrapped as a promise for use inside the transaction flow.
export interface GeoCoords {
  latitude: number;
  longitude: number;
}

export function useGeolocation() {
  const getCurrentPosition = (): Promise<{ ok: true; coords: GeoCoords } | { ok: false; message: string }> => {
    return new Promise((resolve) => {
      if (typeof navigator === "undefined" || !navigator.geolocation) {
        resolve({ ok: false, message: "Location services aren't available on this device" });
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ ok: true, coords: { latitude: pos.coords.latitude, longitude: pos.coords.longitude } }),
        (err) => {
          const message = err.code === err.PERMISSION_DENIED
            ? "Location permission denied — allow location access to continue"
            : "Could not determine your location — check GPS/location settings and retry";
          resolve({ ok: false, message });
        },
        { timeout: 8_000, maximumAge: 60_000, enableHighAccuracy: true }
      );
    });
  };

  return { getCurrentPosition };
}
