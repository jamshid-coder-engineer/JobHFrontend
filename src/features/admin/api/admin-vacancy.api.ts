import { $api } from "../../../shared/api/axios-instance";

export const adminVacancyApi = {
  // Moderatsiyadagi vakansiyalarni olish
  getVacancies: async (status?: string) => {
    const response = await $api.get("/admin/vacancies", { params: { status } });
    return response.data;
  },

  // Tasdiqlash
  approve: async (id: string) => {
    return (await $api.patch(`/admin/vacancies/${id}/approve`)).data;
  },

  // Rad etish (Sababi bilan)
  reject: async (id: string, reason: string) => {
    return (await $api.patch(`/admin/vacancies/${id}/reject`, { reason })).data;
  },

  // Premium qilish (Kunlar soni bilan)
  setPremium: async (id: string, days: number) => {
    return (await $api.patch(`/admin/vacancies/${id}/premium`, { days })).data;
  }
};