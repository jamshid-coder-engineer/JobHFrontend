
import { $api } from "../../../shared/api/axios-instance";

export const applicationApi = {
  // Vakansiyaga topshirish
  apply: async (dto: { vacancyId: string; coverLetter?: string }) => {
    const { data } = await $api.post("/applications", dto);
    return data;
  },

  // Nomzodning o'z arizalari
  getMyApplications: async () => {
    const { data } = await $api.get("/applications/my");
    return data;
  },

  // Ish beruvchi uchun: kelgan arizalar
  getEmployerApplications: async () => {
    const { data } = await $api.get("/applications/employer");
    return data;
  },

  // Statusni o'zgartirish (Ish beruvchi uchun)
  updateStatus: async (id: string, status: string) => {
    const { data } = await $api.patch(`/applications/${id}/status`, { status });
    return data;
  }
};