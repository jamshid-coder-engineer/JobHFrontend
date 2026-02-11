
import { $api } from "../../../shared/api/axios-instance";

export const applicationApi = {
  
  apply: async (dto: { vacancyId: string; coverLetter?: string }) => {
    const { data } = await $api.post("/applications", dto);
    return data;
  },

  
  getMyApplications: async () => {
    const { data } = await $api.get("/applications/my");
    return data;
  },

  
  getEmployerApplications: async () => {
    const { data } = await $api.get("/applications/employer");
    return data;
  },

  
  updateStatus: async (id: string, status: string) => {
    const { data } = await $api.patch(`/applications/${id}/status`, { status });
    return data;
  }
};