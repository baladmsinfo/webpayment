import { useApi } from "./useApi";

// Locations & Pincodes admin CRUD — mirrors useSetupServices.ts's shape,
// backed by src/modules/admin/routes/location.routes.js (prefix /setups/locations).
export function useSetupLocationsApi() {
  const { get, post, put, del } = useApi();

  const getLocations = async ({ page = 1, limit = 20, search = "" } = {}) => {
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) params.set("search", search);
      const res = await get(`/setups/locations?${params.toString()}`);
      return res.data;
    } catch (error: any) {
      console.error("Error fetching locations:", error);
      return error?.response?.data ?? { statusCode: "99", message: "Failed to fetch locations", data: [] };
    }
  };

  const createLocation = async (payload: { city: string; district: string; statename: string; pincode: string }) => {
    try {
      const res = await post(`/setups/locations`, payload);
      return res.data;
    } catch (error: any) {
      console.error("Error creating location:", error);
      return error?.response?.data ?? { statusCode: "99", message: "Failed to create location" };
    }
  };

  const updateLocation = async (
    id: string,
    payload: Partial<{ city: string; district: string; statename: string; pincode: string }>
  ) => {
    try {
      const res = await put(`/setups/locations/${id}`, payload);
      return res.data;
    } catch (error: any) {
      console.error("Error updating location:", error);
      return error?.response?.data ?? { statusCode: "99", message: "Failed to update location" };
    }
  };

  const deleteLocation = async (id: string) => {
    try {
      const res = await del(`/setups/locations/${id}`);
      return res.data;
    } catch (error: any) {
      console.error("Error deleting location:", error);
      return error?.response?.data ?? { statusCode: "99", message: "Failed to delete location" };
    }
  };

  return { getLocations, createLocation, updateLocation, deleteLocation };
}
