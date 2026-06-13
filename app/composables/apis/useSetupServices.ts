import { useApi } from "./useApi";

export function useSetupServicesApi() {
  const { get, post, put, del } = useApi();

  const getAllServices = async () => {
    try {
      const res = await get(`/setups/services/servicelist`);
      return res.data;
    } catch (error) {
      console.error("Error fetching services:", error);
      return null;
    }
  };

  const createService = async (payload: { service: string; status?: boolean }) => {
    try {
      const res = await post(`/setups/services/servicelist`, payload);
      return res.data;
    } catch (error) {
      console.error("Error creating service:", error);
      return null;
    }
  };

  const updateService = async (id: string, payload: { status: boolean }) => {
    try {
      const res = await put(`/setups/services/servicelist/${id}`, payload);
      return res.data;
    } catch (error) {
      console.error("Error updating service:", error);
      return null;
    }
  };

  const deleteService = async (id: string) => {
    try {
      const res = await del(`/setups/services/servicelist/${id}`);
      return res.data;
    } catch (error) {
      console.error("Error deleting service:", error);
      return null;
    }
  };

  const getAllInterfaces = async () => {
    try {
      const res = await get(`/setups/services/interfacelist`);
      return res.data;
    } catch (error) {
      console.error("Error fetching interfaces:", error);
      return null;
    }
  };

  const createInterface = async (payload: { interface: string; apiKey?: string; status?: boolean }) => {
    try {
      const res = await post(`/setups/services/interfacelist`, payload);
      return res.data;
    } catch (error) {
      console.error("Error creating interface:", error);
      return null;
    }
  };

  const updateInterface = async (id: string, payload: { apiKey?: string; status?: boolean }) => {
    try {
      const res = await put(`/setups/services/interfacelist/${id}`, payload);
      return res.data;
    } catch (error) {
      console.error("Error updating interface:", error);
      return null;
    }
  };

  const deleteInterface = async (id: string) => {
    try {
      const res = await del(`/setups/services/interfacelist/${id}`);
      return res.data;
    } catch (error) {
      console.error("Error deleting interface:", error);
      return null;
    }
  };

  // ── Linking ──
  const linkInterface = async (serviceId: string, interfaceId: string) => {
    try {
      const res = await post(`/setups/services/servicelist/${serviceId}/link-interface/${interfaceId}`, {});
      return res.data;
    } catch (error) {
      console.error("Error linking interface:", error);
      return null;
    }
  };

  const unlinkInterface = async (serviceId: string, interfaceId: string) => {
    try {
      const res = await del(`/setups/services/servicelist/${serviceId}/unlink-interface/${interfaceId}`);
      return res.data;
    } catch (error) {
      console.error("Error unlinking interface:", error);
      return null;
    }
  };

  return {
    getAllServices,
    createService,
    updateService,
    deleteService,
    getAllInterfaces,
    createInterface,
    updateInterface,
    deleteInterface,
    linkInterface,
    unlinkInterface,
  };
}