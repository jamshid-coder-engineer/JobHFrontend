import { $api } from "../../../shared/api/axios-instance";

export const adminVacancyApi = {
  
  getVacancies: async (status?: string) => {
    const response = await $api.get("/admin/vacancies", { params: { status } });
    return response.data;
  },

  
  approve: async (id: string) => {
    return (await $api.patch(`/admin/vacancies/${id}/approve`)).data;
  },

  reject: async (id: string, reason: string) => {
    return (await $api.patch(`/admin/vacancies/${id}/reject`, { reason })).data;
  },

  setPremium: async (id: string, days: number) => {
    return (await $api.patch(`/admin/vacancies/${id}/premium`, { days })).data;
  }
};