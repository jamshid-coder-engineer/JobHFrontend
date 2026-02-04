import { $api } from "../../../shared/api/axios-instance";

export const adminApi = {
  // Umumiy statistika
  getStats: async () => {
    const response = await $api.get("/admin/statistics");
    return response.data;
  },

  // Kompaniyalarni status bo'yicha list qilish
  getCompanies: async (status?: string) => {
    const response = await $api.get("/admin/companies", { params: { status } });
    return response.data;
  },

  // Kompaniyani tasdiqlash yoki rad etish
  approveCompany: async (id: string) => {
    return (await $api.patch(`/admin/companies/${id}/approve`)).data;
  },

  rejectCompany: async (id: string, reason: string) => {
    return (await $api.patch(`/admin/companies/${id}/reject`, { reason })).data;
  },

  // Vakansiyalar moderatsiyasi
  getVacancies: async (status?: string) => {
    const response = await $api.get("/admin/vacancies", { params: { status } });
    return response.data;
  },

  approveVacancy: async (id: string) => {
    return (await $api.patch(`/admin/vacancies/${id}/approve`)).data;
  },
  rejectVacancy: async (id: string, reason: string) => {
  return (await $api.patch(`/admin/vacancies/${id}/reject`, { reason })).data;
},

setPremium: async (id: string, days: number) => {
  // Bekentdagi @Patch(':id/premium') endpointiga mos kelishi kerak
  const response = await $api.patch(`/admin/vacancies/${id}/premium`, { days });
  return response.data;
},
};